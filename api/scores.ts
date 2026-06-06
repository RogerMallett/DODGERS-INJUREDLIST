import type { VercelRequest, VercelResponse } from "@vercel/node";

interface GameScore {
  date: string;
  runsFor: number;
  runsAgainst: number;
  opponent: string;
}

let cache: { data: GameScore[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const TEAM_ABBREV: Record<number, string> = {
  108: "Angels",    109: "D-backs",  110: "Orioles",
  111: "Red Sox",   112: "Cubs",     113: "Reds",
  114: "Guardians", 115: "Rockies",  116: "Tigers",
  117: "Astros",    118: "Royals",   119: "Dodgers",
  120: "Nationals", 121: "Mets",     133: "Athletics",
  134: "Pirates",   135: "Padres",   136: "Mariners",
  137: "Giants",    138: "Cardinals",139: "Rays",
  140: "Rangers",   141: "Blue Jays",142: "Twins",
  143: "Phillies",  144: "Braves",   145: "White Sox",
  146: "Marlins",   147: "Yankees",  158: "Brewers",
};

const DODGERS_ID = 119;

async function fetchGameScores(): Promise<GameScore[]> {
  const url =
    `https://statsapi.mlb.com/api/v1/schedule` +
    `?teamId=${DODGERS_ID}&season=2026&gameType=R` +
    `&startDate=2026-03-26&endDate=2026-12-31`;

  console.log("[scores] Fetching:", url);

  const res = await fetch(url);
  const rawText = await res.text();

  console.log("[scores] HTTP status:", res.status);
  console.log("[scores] Response preview:", rawText.slice(0, 500));

  if (!res.ok) {
    throw new Error(`MLB API error: ${res.status} — ${rawText.slice(0, 200)}`);
  }

  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`MLB API returned non-JSON: ${rawText.slice(0, 200)}`);
  }

  console.log("[scores] Total date entries:", json.dates?.length ?? 0);

  const scores: GameScore[] = [];

  for (const dateEntry of json.dates ?? []) {
    for (const game of dateEntry.games ?? []) {
      console.log(`[scores] Game on ${dateEntry.date}: state=${game.status?.abstractGameState}, home=${game.teams?.home?.team?.id}, away=${game.teams?.away?.team?.id}`);

      if (game.status?.abstractGameState !== "Final") continue;

      const home = game.teams?.home;
      const away = game.teams?.away;
      if (!home || !away) continue;

      const dodgersAreHome = home.team?.id === DODGERS_ID;
      const dodgers = dodgersAreHome ? home : away;
      const opponent = dodgersAreHome ? away : home;

      const runsFor = dodgers.score ?? 0;
      const runsAgainst = opponent.score ?? 0;
      const opponentId = opponent.team?.id as number;
      const opponentName =
        TEAM_ABBREV[opponentId] ?? opponent.team?.name ?? "Opponent";

      console.log(`[scores] ✓ ${dateEntry.date}: LAD ${runsFor} - ${opponentName} ${runsAgainst}`);

      scores.push({
        date: dateEntry.date,
        runsFor,
        runsAgainst,
        opponent: opponentName,
      });
    }
  }

  console.log("[scores] Total scores parsed:", scores.length);
  return scores;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      res.status(200).json({ scores: cache.data, cached: true });
      return;
    }

    const scores = await fetchGameScores();
    cache = { data: scores, timestamp: Date.now() };
    res.status(200).json({ scores, cached: false });
  } catch (err: any) {
    console.error("[scores] FATAL:", err.message);
    res.status(500).json({ error: err.message });
  }
}

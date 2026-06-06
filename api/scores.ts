// Vercel serverless function — GET /api/scores
// Fetches Dodgers 2026 game-by-game results from MLB Stats API.
// Returns runs scored/allowed + opponent for each completed game.

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

  console.log("Fetching scores from:", url);
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MLB API error: ${res.status} — ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as any;
  console.log("MLB API dates returned:", json.dates?.length ?? 0);

  const scores: GameScore[] = [];

  for (const dateEntry of json.dates ?? []) {
    for (const game of dateEntry.games ?? []) {
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

      console.log(`  ${dateEntry.date}: Dodgers ${runsFor} - ${opponentName} ${runsAgainst}`);

      scores.push({
        date: dateEntry.date,
        runsFor,
        runsAgainst,
        opponent: opponentName,
      });
    }
  }

  console.log("Total scores parsed:", scores.length);
  return scores;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      res.json({ scores: cache.data, cached: true });
      return;
    }

    const scores = await fetchGameScores();
    cache = { data: scores, timestamp: Date.now() };
    res.json({ scores, cached: false });
  } catch (err: any) {
    console.error("Error in /api/scores:", err.message);
    res.status(500).json({ error: err.message });
  }
}

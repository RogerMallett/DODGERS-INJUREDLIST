// Vercel serverless function — GET /api/season?teamId=119
// Fetches a team's 2026 regular-season game log from the MLB Stats API and
// computes the cumulative win-percentage trend, one entry per completed game.
// Multi-team ready: pass any MLB teamId (defaults to the Dodgers).

interface SeasonGame {
  game: number;
  date: string;
  opponent: string;
  runsFor: number;
  runsAgainst: number;
  result: "W" | "L";
  wins: number;
  losses: number;
  pct: number;
}

interface SeasonResponse {
  team: { id: number; name: string };
  trend: SeasonGame[];
}

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

const DEFAULT_TEAM_ID = 119;
const SEASON = 2026;

const cache: Record<number, { data: SeasonResponse; timestamp: number }> = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchSeasonTrend(teamId: number): Promise<SeasonResponse> {
  const today = new Date().toISOString().split("T")[0];
  const url =
    `https://statsapi.mlb.com/api/v1/schedule` +
    `?sportId=1&teamId=${teamId}&season=${SEASON}&gameType=R` +
    `&startDate=${SEASON}-03-01&endDate=${today}`;

  console.log("[season] Fetching:", url);
  const res = await fetch(url);
  const rawText = await res.text();
  console.log("[season] HTTP status:", res.status);

  if (!res.ok) {
    throw new Error(`MLB API error: ${res.status} — ${rawText.slice(0, 200)}`);
  }

  let json: any;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error(`MLB API returned non-JSON: ${rawText.slice(0, 200)}`);
  }

  // Flatten every completed regular-season game across all dates.
  const raw: Array<{ date: string; game: any; ts: number }> = [];
  for (const dateEntry of json.dates ?? []) {
    for (const g of dateEntry.games ?? []) {
      if (g.status?.abstractGameState !== "Final") continue;
      raw.push({
        date: dateEntry.date,
        game: g,
        ts: new Date(g.gameDate ?? dateEntry.date).getTime(),
      });
    }
  }
  // Sort by actual game timestamp so doubleheaders order correctly.
  raw.sort((a, b) => a.ts - b.ts);

  const trend: SeasonGame[] = [];
  let wins = 0;
  let losses = 0;
  let n = 0;

  for (const { date, game } of raw) {
    const home = game.teams?.home;
    const away = game.teams?.away;
    if (!home || !away) continue;

    const isHome = home.team?.id === teamId;
    const me = isHome ? home : away;
    const opp = isHome ? away : home;

    const runsFor = me.score ?? 0;
    const runsAgainst = opp.score ?? 0;
    if (runsFor === runsAgainst) continue; // skip ties / undecided

    const result: "W" | "L" = runsFor > runsAgainst ? "W" : "L";
    if (result === "W") wins++; else losses++;
    n++;

    trend.push({
      game: n,
      date,
      opponent: TEAM_ABBREV[opp.team?.id as number] ?? opp.team?.name ?? "Opponent",
      runsFor,
      runsAgainst,
      result,
      wins,
      losses,
      pct: +(wins / (wins + losses)).toFixed(4),
    });
  }

  console.log("[season] Games in trend:", trend.length);
  return {
    team: { id: teamId, name: TEAM_ABBREV[teamId] ?? "Team" },
    trend,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const teamId = Number(req.query?.teamId) || DEFAULT_TEAM_ID;

  try {
    const cached = cache[teamId];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.status(200).json({ ...cached.data, cached: true });
      return;
    }
    const data = await fetchSeasonTrend(teamId);
    cache[teamId] = { data, timestamp: Date.now() };
    res.status(200).json({ ...data, cached: false });
  } catch (err: any) {
    console.error("[season] FATAL:", err.message);
    res.status(500).json({ error: err.message });
  }
}

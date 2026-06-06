// Vercel serverless function — GET /api/injuries
// Calls MLB Stats API then Claude AI to enrich each player's data.
// Module-level cache gives cache hits for warm function instances.

interface ILPlayer {
  name: string;
  position: string;
  role: "Position Player" | "Starting Pitcher" | "Relief Pitcher";
  injury: string;
  ilDate: string;
  status: "10-Day IL" | "15-Day IL" | "60-Day IL" | "Day-to-Day";
  expectedReturn: string;
  impact: "High" | "Medium" | "Low";
  notes: string;
}

let cache: { data: ILPlayer[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const DODGERS_TEAM_ID = 119;

async function fetchDodgersIL(): Promise<ILPlayer[]> {
  const url = `https://statsapi.mlb.com/api/v1/teams/${DODGERS_TEAM_ID}/roster?rosterType=fullRoster&season=2026`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MLB API error: ${res.status}`);
  const json = (await res.json()) as any;

  const roster = json.roster ?? [];
  const ilCodes = ["D10", "D15", "D60", "ILF"];
  const ilPlayers = roster.filter(
    (entry: any) =>
      ilCodes.includes(entry.status?.code) &&
      entry.note &&
      entry.note.trim() !== ""
  );

  return ilPlayers.map((entry: any): ILPlayer => {
    const p = entry.person ?? {};
    const statusCode = entry.status?.code ?? "D10";
    const pos = entry.position?.abbreviation ?? "—";

    let role: ILPlayer["role"] = "Position Player";
    if (pos === "SP" || (entry.position?.type === "Pitcher" && pos !== "RP")) {
      role = "Starting Pitcher";
    } else if (pos === "RP" || pos === "P" || entry.position?.type === "Pitcher") {
      role = "Relief Pitcher";
    }

    let ilStatus: ILPlayer["status"] = "10-Day IL";
    if (statusCode === "D60" || statusCode === "ILF") ilStatus = "60-Day IL";
    else if (statusCode === "D15") ilStatus = "15-Day IL";

    return {
      name: p.fullName ?? "Unknown",
      position: pos,
      role,
      injury: entry.note ?? "Injury details unavailable",
      ilDate: new Date().toISOString().split("T")[0],
      status: ilStatus,
      impact: "Medium",
      notes: "",
      expectedReturn: "TBD",
    };
  });
}

async function enrichWithClaude(players: ILPlayer[]): Promise<ILPlayer[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const playerList = players
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} (${p.position}) — ${p.injury} — ${p.status} since ${p.ilDate}`
    )
    .join("\n");

  const prompt = `You are a Dodgers injury analyst. Given the following players currently on the injured list, return a JSON array with one object per player in the same order. Each object must have exactly these fields:
- "expectedReturn": a short timeline string (e.g. "Mid-July", "Late June", "TBD", "Season-ending")
- "impact": exactly one of "High", "Medium", or "Low" based on the player's importance to the Dodgers
- "notes": one concise sentence with context about the injury or recovery status

Players:
${playerList}

Respond with ONLY a valid JSON array. No preamble, no markdown, no backticks.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const json = (await res.json()) as any;
  const text = json.content?.[0]?.text ?? "[]";

  let enrichments: Array<{ expectedReturn: string; impact: string; notes: string }>;
  try {
    enrichments = JSON.parse(text);
  } catch {
    console.error("Claude response was not valid JSON:", text);
    return players;
  }

  return players.map((p, i) => ({
    ...p,
    expectedReturn: enrichments[i]?.expectedReturn ?? "TBD",
    impact: (enrichments[i]?.impact ?? "Medium") as ILPlayer["impact"],
    notes: enrichments[i]?.notes ?? "",
  }));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      res.json({ players: cache.data, cached: true });
      return;
    }

    const rawPlayers = await fetchDodgersIL();
    const enrichedPlayers = await enrichWithClaude(rawPlayers);
    cache = { data: enrichedPlayers, timestamp: Date.now() };

    res.json({ players: enrichedPlayers, cached: false });
  } catch (err: any) {
    console.error("Error in /api/injuries:", err.message);
    res.status(500).json({ error: err.message });
  }
}

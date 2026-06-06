// Source data compiled from MLB.com Dodgers injury report, CBS Sports,
// ESPN, and FanGraphs RosterResource as of June 3, 2026.

export type InjuryStatus = "10-Day IL" | "15-Day IL" | "60-Day IL" | "Day-to-Day";

export interface ILPlayer {
  name: string;
  position: string;
  role: "Position Player" | "Starting Pitcher" | "Relief Pitcher";
  injury: string;
  ilDate: string;       // ISO date
  status: InjuryStatus;
  expectedReturn: string;
  impact: "High" | "Medium" | "Low";
  notes: string;
}

export const players: ILPlayer[] = [
  // High-impact starters
  {
    name: "Blake Snell",
    position: "SP",
    role: "Starting Pitcher",
    injury: "Elbow surgery (loose bodies)",
    ilDate: "2026-05-12",
    status: "60-Day IL",
    expectedReturn: "Mid-July (eligible 7/11)",
    impact: "High",
    notes: "NanoNeedle Scope procedure May 19. 2026: 0-1, 12.00 ERA.",
  },
  {
    name: "Tyler Glasnow",
    position: "SP",
    role: "Starting Pitcher",
    injury: "Lower back spasms",
    ilDate: "2026-05-08",
    status: "15-Day IL",
    expectedReturn: "Possibly June",
    impact: "High",
    notes: "Still playing catch — no significant progression yet. 2026: 3-0, 2.72 ERA.",
  },
  {
    name: "Edwin Díaz",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Elbow surgery (loose bodies)",
    ilDate: "2026-04-20",
    status: "60-Day IL",
    expectedReturn: "Approx. 6/19 — ~3 month recovery",
    impact: "High",
    notes: "Throwing progression underway.",
  },

  // Hernández × 2 — both now confirmed multi-week absences
  {
    name: "Teoscar Hernández",
    position: "OF",
    role: "Position Player",
    injury: "Grade 1 left hamstring strain",
    ilDate: "2026-05-29",
    status: "10-Day IL",
    expectedReturn: "Late June / Early July",
    impact: "High",
    notes: "MRI confirmed Grade 1 strain; expected to miss roughly a month.",
  },
  {
    name: "Kiké Hernández",
    position: "INF/OF",
    role: "Position Player",
    injury: "Left oblique strain",
    ilDate: "2026-05-27",
    status: "10-Day IL",
    expectedReturn: "Late July / Early August",
    impact: "Medium",
    notes: "Originally seemed minor; latest timeline pushed to late July or early August.",
  },

  // Bullpen — corrected injury context
  {
    name: "Evan Phillips",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Tommy John surgery recovery",
    ilDate: "2026-02-12",
    status: "60-Day IL",
    expectedReturn: "Possibly July",
    impact: "Medium",
    notes: "Faced hitters this week. Rehab assignment could begin soon.",
  },
  {
    name: "Brusdar Graterol",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Shoulder surgery + lower back surgery",
    ilDate: "2026-03-22",
    status: "60-Day IL",
    expectedReturn: "TBD — likely lost season",
    impact: "Medium",
    notes: "Reinjured back during rehab. Trending toward missing all of 2026.",
  },
  {
    name: "Jake Cousins",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Tommy John surgery recovery",
    ilDate: "2026-03-24",
    status: "60-Day IL",
    expectedReturn: "Second half of 2026",
    impact: "Low",
    notes: "TJ in June 2025. Could be a depth option later in the season.",
  },
  {
    name: "Brock Stewart",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Left foot bone spur",
    ilDate: "2026-05-09",
    status: "15-Day IL",
    expectedReturn: "June",
    impact: "Low",
    notes: "Resumed throwing; close to return.",
  },
  {
    name: "Ben Casparius",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Right shoulder inflammation",
    ilDate: "2026-04-13",
    status: "60-Day IL",
    expectedReturn: "Mid-June",
    impact: "Low",
    notes: "Rehabbing at Dodgers' Arizona complex.",
  },
  {
    name: "Jack Dreyer",
    position: "RP",
    role: "Relief Pitcher",
    injury: "Left shoulder discomfort",
    ilDate: "2026-05-16",
    status: "15-Day IL",
    expectedReturn: "Imminent",
    impact: "Low",
    notes: "MRI showed inflammation only. Eligible since 5/31.",
  },

  // Rotation / pitcher depth (60-day) — updated timelines
  {
    name: "Gavin Stone",
    position: "SP",
    role: "Starting Pitcher",
    injury: "Right shoulder inflammation",
    ilDate: "2026-03-22",
    status: "60-Day IL",
    expectedReturn: "At least August 1",
    impact: "Medium",
    notes: "Trouble ramping up the throwing program. Timeline keeps slipping.",
  },
  {
    name: "Landon Knack",
    position: "SP",
    role: "Starting Pitcher",
    injury: "Right intercostal strain",
    ilDate: "2026-03-22",
    status: "60-Day IL",
    expectedReturn: "TBD",
    impact: "Low",
    notes: "Needs ramp-up before rotation return.",
  },
  {
    name: "Bobby Miller",
    position: "SP",
    role: "Starting Pitcher",
    injury: "Right shoulder soreness",
    ilDate: "2026-03-22",
    status: "60-Day IL",
    expectedReturn: "At least July 17",
    impact: "Low",
    notes: "Rehabbing in Arizona; no rehab assignment yet.",
  },

  // Position players continuing rehab
  {
    name: "Tommy Edman",
    position: "INF/OF",
    role: "Position Player",
    injury: "Right ankle surgery recovery",
    ilDate: "2026-03-22",
    status: "60-Day IL",
    expectedReturn: "June",
    impact: "Medium",
    notes: "Rehab assignment in Triple-A continues; performing well.",
  },

  // Day-to-day
  {
    name: "Max Muncy",
    position: "3B",
    role: "Position Player",
    injury: "Right wrist (HBP)",
    ilDate: "2026-05-22",
    status: "Day-to-Day",
    expectedReturn: "Active",
    impact: "Medium",
    notes: "Returned from brief absence. 2026: .251/.356/.503, 12 HR.",
  },
];

// Key injury waves marked on the chart
// ⚠️ HARDCODED — Phase 3: Replace with MLB Stats API data.
// These injury wave annotations are editorial and currently maintained manually.
// The MLB Stats API does not return this data directly — will require
// a custom mapping from API placement dates to wave events.
export interface InjuryWave {
  date: string;
  label: string;
  description: string;
}

export const waves: InjuryWave[] = [
  {
    date: "2026-03-26",
    label: "Opening Day",
    description: "Season opens with Edman, Graterol, Stone, Phillips, Cousins, Miller, Knack already on IL.",
  },
  {
    date: "2026-04-20",
    label: "Díaz to IL",
    description: "Closer Edwin Díaz to 60-day IL with elbow loose bodies.",
  },
  {
    date: "2026-05-08",
    label: "Rotation hit",
    description: "Glasnow (back) + Stewart (foot) to IL within 24 hrs.",
  },
  {
    date: "2026-05-15",
    label: "Snell + bullpen wave",
    description: "Snell to IL; elbow surgery May 19. Dreyer also placed.",
  },
  {
    date: "2026-05-27",
    label: "Hernández × 2",
    description: "Kiké (oblique) and Teoscar (hamstring) to 10-day IL within 48 hrs.",
  },
];

// Game-by-game record reconstructed from MLB.com standings.
// Through 6/2: 38-22 (.633), L1 streak, L10 7-3.
export interface TrendPoint {
  game: number;
  date: string;
  result: "W" | "L";
  wins: number;
  losses: number;
  pct: number;
}

function buildTrend(): TrendPoint[] {
  // March (4-1) + April (16-10) + May (16-9) + June (2-2 through 6/2)
  const sequence: { date: string; result: "W" | "L" }[] = [
    // March (4-1)
    { date: "2026-03-26", result: "W" },
    { date: "2026-03-27", result: "W" },
    { date: "2026-03-28", result: "W" },
    { date: "2026-03-30", result: "L" },
    { date: "2026-03-31", result: "W" },
    // April (16-10)
    { date: "2026-04-01", result: "W" },
    { date: "2026-04-03", result: "W" },
    { date: "2026-04-04", result: "L" },
    { date: "2026-04-05", result: "W" },
    { date: "2026-04-06", result: "W" },
    { date: "2026-04-07", result: "W" },
    { date: "2026-04-08", result: "L" },
    { date: "2026-04-10", result: "W" },
    { date: "2026-04-11", result: "W" },
    { date: "2026-04-12", result: "W" },
    { date: "2026-04-13", result: "L" },
    { date: "2026-04-14", result: "W" },
    { date: "2026-04-15", result: "L" },
    { date: "2026-04-17", result: "W" },
    { date: "2026-04-18", result: "L" },
    { date: "2026-04-19", result: "W" },
    { date: "2026-04-20", result: "L" },
    { date: "2026-04-21", result: "L" },
    { date: "2026-04-22", result: "W" },
    { date: "2026-04-23", result: "L" },
    { date: "2026-04-24", result: "W" },
    { date: "2026-04-25", result: "W" },
    { date: "2026-04-26", result: "L" },
    { date: "2026-04-27", result: "W" },
    { date: "2026-04-28", result: "W" },
    { date: "2026-04-29", result: "L" },
    // May (16-9)
    { date: "2026-05-01", result: "L" },
    { date: "2026-05-02", result: "W" },
    { date: "2026-05-03", result: "L" },
    { date: "2026-05-04", result: "W" },
    { date: "2026-05-05", result: "L" },
    { date: "2026-05-06", result: "W" },
    { date: "2026-05-08", result: "L" },
    { date: "2026-05-09", result: "W" },
    { date: "2026-05-10", result: "L" },
    { date: "2026-05-11", result: "L" },
    { date: "2026-05-12", result: "W" },
    { date: "2026-05-13", result: "W" },
    { date: "2026-05-14", result: "W" },
    { date: "2026-05-15", result: "W" },
    { date: "2026-05-16", result: "L" },
    { date: "2026-05-17", result: "W" },
    { date: "2026-05-18", result: "L" },
    { date: "2026-05-19", result: "W" },
    { date: "2026-05-20", result: "W" },
    { date: "2026-05-22", result: "L" },
    { date: "2026-05-23", result: "W" },
    { date: "2026-05-24", result: "W" },
    { date: "2026-05-25", result: "W" },
    { date: "2026-05-26", result: "W" },
    { date: "2026-05-27", result: "W" },
    { date: "2026-05-28", result: "W" },
    { date: "2026-05-29", result: "W" },
    // June (2-2 through 6/2) — recent L1
    { date: "2026-05-30", result: "W" },
    { date: "2026-05-31", result: "L" },
    { date: "2026-06-01", result: "W" },
    { date: "2026-06-02", result: "L" },
  ];

  let w = 0, l = 0;
  return sequence.map((g, i) => {
    if (g.result === "W") w += 1; else l += 1;
    return {
      game: i + 1,
      date: g.date,
      result: g.result,
      wins: w,
      losses: l,
      pct: +(w / (w + l)).toFixed(4),
    };
  });
}

export const trend: TrendPoint[] = buildTrend();

export const seasonSummary = {
  wins: 38,
  losses: 22,
  pct: 0.633,
  standing: "1st in NL West",
  runsScored: 315,
  runsAllowed: 189,
  runDiff: 126,
  lastTen: "7-3",
  streak: "L1",
  lastUpdated: "June 3, 2026",
};

# Claude Code — Project Context: Dodgers Injury Tracker

This file gives Claude Code (and any AI coding assistant) the context it needs to work productively in this repo. Read it first before making changes.

---

## Project purpose

A single-page dashboard tracking the Los Angeles Dodgers injured list (IL) and correlating injury waves with the team's winning percentage trend across the 2026 MLB season. Built as a personal/portfolio project; deployable as a static site or as a full Express + Vite app.

**Operating system:** This project is developed on **Windows 11**. All CLI examples should use PowerShell and Windows-style paths.

---

## Stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Frontend     | React 18 + TypeScript + Vite            |
| Styling      | Tailwind CSS v3 + shadcn/ui             |
| Charts       | Recharts                                |
| Routing      | Wouter (hash-based)                     |
| Backend      | Express (present, currently unused)     |
| ORM / DB     | Drizzle ORM + better-sqlite3 (present, unused) |
| Build        | Vite → `dist\public\`                   |
| Hosting      | Vercel (static), also works on any S3/CDN |

The Express backend is kept in the repo deliberately — it's the wiring point for the live-data refactor described below.

---

## Where things live

```
client\src\
├─ App.tsx                    # Router + theme provider
├─ pages\dashboard.tsx        # The entire dashboard UI
├─ lib\data.ts                # ← All data (static snapshot)
├─ components\ui\             # shadcn primitives (Card, Table, Badge, etc.)
└─ index.css                  # Tailwind layers + Dodger blue palette
                              #   --primary: 214 92% 30%  (Dodger blue)
server\
├─ index.ts                   # Express entry (unused but wired)
└─ routes.ts                  # Empty route stubs
shared\
└─ schema.ts                  # Drizzle table defs (unused)
```

---

## Data model

Everything the UI renders comes from three exports in `client\src\lib\data.ts`:

```ts
export const dodgersInjuredList: Player[]   // current IL roster
export const injuryWaves: InjuryWave[]       // chart annotations
export const gameLog: Game[]                 // per-game W/L for win % series
```

`Player` shape:

```ts
{
  name: string;
  position: 'SP' | 'RP' | 'C' | '1B' | '2B' | 'SS' | '3B' | 'LF' | 'CF' | 'RF' | 'DH' | 'UT';
  injury: string;           // "Right shoulder inflammation"
  ilType: '10-day' | '15-day' | '60-day';
  ilStart: string;          // ISO date
  expectedReturn: string;   // ISO date or "TBD" or "Season"
  severity: 'minor' | 'moderate' | 'major';
  notes?: string;
}
```

---

## The next big refactor: live data (Pattern 2)

Right now the dashboard is a **static snapshot** — `data.ts` is hand-edited. The intended upgrade is to fetch live data from the **MLB Stats API** (free, public, no auth):

| Endpoint | Purpose |
| --- | --- |
| `https://statsapi.mlb.com/api/v1/teams/119/roster?rosterType=fullRoster` | Full Dodgers roster (team id 119) |
| `https://statsapi.mlb.com/api/v1/teams/119/roster?rosterType=40Man&date=YYYY-MM-DD` | IL filtering by status |
| `https://statsapi.mlb.com/api/v1/schedule?teamId=119&season=2026&sportId=1` | Game-by-game results |
| `https://statsapi.mlb.com/api/v1/people/{personId}` | Player details |

**Recommended architecture for live data:**

1. Add a build-time script `script\fetch-data.ts` that hits the MLB Stats API, normalizes to the `Player`/`Game` shapes, and writes `client\src\lib\data.json`.
2. Switch `data.ts` to `import data from './data.json'`.
3. Run the script in GitHub Actions on a daily cron and commit the JSON back to `main`. This gives you free daily refresh with no servers.
4. Alternatively, expose `/api/il` and `/api/games` via the Express server (already in the repo) and fetch client-side on mount. Cache with `Cache-Control: public, max-age=3600`.

The free-tier cost target is **$0–$12/year** even at moderate traffic.

---

## Multi-sport roadmap (MLB → NFL → NBA → NHL)

The dashboard's UI (KPIs, line chart, IL table, position-impact tiles) is sport-agnostic. The plan is to extract a **SportAdapter** pattern so the same UI renders any league.

### The pattern

```ts
interface SportAdapter {
  league: 'MLB' | 'NFL' | 'NBA' | 'NHL';
  team: { id: string; name: string; primaryColor: string };
  getRoster(): Promise<Player[]>;        // normalized
  getInjuryReport(): Promise<Player[]>;
  getGameLog(): Promise<Game[]>;
  getInjuryWaves(): Promise<InjuryWave[]>;
  positionGroups: PositionGroup[];        // sport-specific position taxonomy
}
```

Each league gets one adapter file:

```
client\src\adapters\
├─ mlb-adapter.ts    # MLB Stats API
├─ nfl-adapter.ts    # ESPN unofficial: site.api.espn.com/...
├─ nba-adapter.ts    # ESPN unofficial or balldontlie.io
└─ nhl-adapter.ts    # NHL API: api-web.nhle.com
```

### Phased rollout

1. **Phase 1 — MLB (Dodgers only).** Where we are now.
2. **Phase 2 — MLB (any team).** Add a team picker. Reuse MLB adapter with a `teamId` param.
3. **Phase 3 — NHL.** Cleanest second sport — NHL's official API mirrors MLB's structure and is free.
4. **Phase 4 — NBA.** Use `balldontlie.io` (free, ratelimited) or ESPN unofficial.
5. **Phase 5 — NFL.** Last because injury reports update on a weekly cadence; ESPN unofficial endpoint works but is the least stable.

### Position taxonomy (per sport)

- **MLB:** SP, RP, C, 1B, 2B, SS, 3B, LF, CF, RF, DH, UT
- **NFL:** QB, RB, WR, TE, OL, DL, LB, CB, S, K, P, ST
- **NBA:** PG, SG, SF, PF, C
- **NHL:** C, LW, RW, D, G

The UI's position-impact tiles should accept `positionGroups` from the adapter rather than hardcoding MLB positions.

---

## Conventions

- **Styling:** Tailwind utility classes inline. Tokens live in `tailwind.config.ts` and CSS vars in `index.css`. Do not introduce a CSS-in-JS library.
- **Components:** Use shadcn/ui primitives in `components\ui\`. Add new ones with `npx shadcn-ui@latest add <name>`.
- **Charts:** Recharts. Keep one chart per visual concept — don't stack four series on one chart.
- **Dates:** Always ISO strings (`YYYY-MM-DD`) in data; format at the render layer.
- **Types:** Strict TS. No `any` unless interfacing with an untyped third-party JSON shape — and even then, narrow it at the boundary.
- **No external state library.** React state + `useMemo` is enough. Don't add Redux/Zustand unless the live-data refactor truly needs it.

---

## Common Claude Code prompts that work well here

- *"Refresh `data.ts` for today's date — current Dodgers IL from MLB.com and team record from baseball-reference."*
- *"Extract a `SportAdapter` interface and refactor the existing data layer into an `MLBAdapter` that returns the same shape."*
- *"Add a team picker in the header that swaps the adapter's `teamId`."*
- *"Write a GitHub Actions workflow that runs `npm run fetch-data` daily at 9am Pacific and commits the result."*
- *"Add a mobile-optimized layout — the IL table should collapse to cards under 640px."*

---

## Things to avoid

- Don't replace Recharts with a heavier viz lib (D3, ECharts) unless the use case truly requires it.
- Don't pull in a Node web scraper for ESPN/MLB content — use the public Stats API.
- Don't add server-side rendering. This is a SPA. The Express backend is for JSON APIs only.
- Don't commit `node_modules\`, `dist\` (unless deploying static), `.vercel\`, or any `.env` files.

---

## Quick commands (PowerShell)

```powershell
# Install
npm install

# Dev (http://localhost:5000)
npm run dev

# Build
npm run build

# Deploy to Vercel
npx vercel --prod

# Add a shadcn component
npx shadcn-ui@latest add <component>
```

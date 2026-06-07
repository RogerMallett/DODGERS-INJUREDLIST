# Dodgers Injury Tracker

An interactive dashboard tracking Los Angeles Dodgers injured list (IL) players, expected return dates, position impact, and team winning percentage trends throughout the 2026 season.

**Live demo:** https://dodgers-injuredlist.vercel.app (also: https://dodgers-injury-tracker.vercel.app)

---

## What's inside

- **Header badges** — current record + win %, division standing, last-10 / streak
- **KPI cards** — players on IL, pitchers on IL, high-impact injuries, run differential
- **Win % trend chart** — cumulative season winning percentage with injury-wave overlays; hover a game for the score and W–L–PCT
- **IL table** — every player on the 10-day, 15-day, and 60-day IL with impact, injury, expected return, and status
- **Position-impact view** — which units (rotation, bullpen, position players) are hardest hit

Stack: React 18 + TypeScript + Vite + Tailwind CSS v3 + shadcn/ui + Recharts + Wouter. Backend in production is Vercel serverless functions (api/injuries.ts, api/season.ts) calling the MLB Stats API and the Claude API. The Express server and Drizzle ORM + better-sqlite3 are present in the repo but not deployed.

---

## Quick start (Windows 11 / PowerShell)

### 1. Prerequisites

Install Node.js 20 LTS or newer:

```powershell
winget install OpenJS.NodeJS.LTS
```

Verify:

```powershell
node --version
npm --version
```

Open the project in VS Code:

```powershell
cd C:\Users\<you>\projects\dodgers-il
code .
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Run the dev server

```powershell
npm run dev
```

Open http://localhost:5000 in any browser. The dev server has hot-reload — edit a file and the page refreshes automatically.

### 4. Build for production

```powershell
npm run build
```

Output goes to `dist\public\` (gitignored — not committed). On Vercel this is built automatically on deploy. Note: the static client alone won't return live data — the `/api/injuries` and `/api/season` serverless functions must also be deployed (they run on Vercel and require `ANTHROPIC_API_KEY` in the environment).

---

## Using Claude Code with this project

Install Claude Code globally:

```powershell
npm install -g @anthropic-ai/claude-code
```

Then from the project root:

```powershell
cd C:\Users\<you>\projects\dodgers-il
claude
```

Claude Code will automatically pick up `CLAUDE.md` for project context. Open the same folder in VS Code side-by-side for the best workflow.

---

## Where the data lives

Injury and win%-trend data are now fetched **live**, not hardcoded:

- `/api/injuries` (`api\injuries.ts`) — pulls the Dodgers roster from the MLB Stats API, filters to IL players, then enriches each with expected return / impact / notes via the Claude API. Consumed by `client\src\hooks\use-injuries.ts`.
- `/api/season` (`api\season.ts`) — pulls the season schedule from the MLB Stats API and computes the cumulative win% trend (one entry per completed game). Consumed by `client\src\hooks\use-season.ts`.

The only remaining static data is in `client\src\lib\data.ts`, which now exports:

- `waves` — editorial injury-wave annotations for the chart (the MLB API does not provide these)
- `seasonSummary` — partially static; wins/losses are overridden live from `/api/season`, but standing, last-10, streak, and run differential are still a manual snapshot
- `players` — a static IL array kept for reference/fallback (the live dashboard uses `/api/injuries`, not this)

---

## Project layout

```
dodgers-il\
├─ api\                  # Vercel serverless functions (PRODUCTION backend)
│  ├─ injuries.ts        # MLB roster + Claude enrichment → /api/injuries
│  └─ season.ts          # MLB schedule → cumulative win% trend → /api/season
├─ client\               # React frontend (Vite)
│  ├─ src\
│  │  ├─ App.tsx        # Router (hash-based)
│  │  ├─ pages\
│  │  │  └─ dashboard.tsx
│  │  ├─ hooks\         # use-injuries.ts, use-season.ts (live data)
│  │  ├─ components\    # shadcn/ui components
│  │  ├─ lib\
│  │  │  └─ data.ts     # ← Only static `waves`, `seasonSummary`, `players` remain
│  │  └─ index.css      # Dodger blue theme
│  └─ index.html
├─ docs\                 # ROADMAP.md, DATA-SOURCES.md
├─ server\               # Express backend (present but NOT deployed on Vercel)
├─ shared\               # Drizzle schema (present but unused)
├─ dist\public\          # Build output (gitignored; built by Vercel on deploy)
├─ package.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ vercel.json           # Vercel build + serverless function config
└─ CLAUDE.md             # Claude Code project context
```

---

## Deploying

### Vercel (already configured)

From PowerShell:

```powershell
npx vercel --prod
```

The project is linked to `rogermallett-8478s-projects/dodgers-injury-tracker`. First run will prompt you to log in.

### Other hosts

Vercel is the supported target because the app needs the `api/` serverless functions for live data. A plain static upload of `dist\public\` to a generic static host will load the UI but the `/api/injuries` and `/api/season` calls will fail — any alternative host must also run the `api/` functions and provide `ANTHROPIC_API_KEY`.

---

## License

Personal project — not affiliated with the Los Angeles Dodgers or MLB. Player names and injury data are public information from team announcements and reporting.

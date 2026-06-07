# CLAUDE.md — Dodgers Injury Tracker

## 1. Project Overview
Single-page dashboard tracking the LA Dodgers 2026 injured list (IL) and correlating injury waves with team win percentage over the season. Portfolio project with a long-term goal of supporting any team in any major sport. See docs/ROADMAP.md.

## 2. Tech Stack
React 18 + TypeScript + Vite (frontend), Tailwind CSS v3 + shadcn/ui (styling), Recharts (charts), Wouter (routing). Production backend is Vercel serverless functions in api/ (api/injuries.ts, api/season.ts) that call the MLB Stats API and the Claude API. The Express server in server/ is present but NOT deployed — Vercel runs the api/ functions, not Express. Drizzle ORM + better-sqlite3 and the server/ tree are present but unused. Windows 11 / PowerShell.

## 3. How to Run
npm install | npm run dev (http://localhost:5000) | npm run build

## 4. Key Conventions
Injury and win%-trend data are fetched live: /api/injuries (MLB Stats API roster + Claude enrichment) and /api/season (MLB Stats API schedule → cumulative win% trend). client/src/lib/data.ts now holds only the editorial `waves` array, a partially-static `seasonSummary` (wins/losses come live from /api/season; standing/L10/streak/run-diff are still static), and a `players` array kept for reference/fallback.
Components in client/src/components/ui/. One chart per visual concept. Dates as ISO strings (YYYY-MM-DD). No external state library.

## 5. What to Avoid
No Redux/Zustand. No D3/ECharts. No CSS-in-JS. No web scraping.
Do not add SSR. Express is for JSON APIs only when activated.
Do not commit node_modules/, .env, or .vercel/.
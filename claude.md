# CLAUDE.md — Dodgers Injury Tracker

## 1. Project Overview
Single-page dashboard tracking the LA Dodgers 2026 injured list (IL) and correlating injury waves with team win percentage over the season. Portfolio project with a long-term goal of supporting any team in any major sport. See docs/ROADMAP.md.

## 2. Tech Stack
React 18 + TypeScript + Vite (frontend), Tailwind CSS v3 + shadcn/ui (styling), Recharts (charts), Wouter (routing), Express (backend, currently unused). Drizzle ORM + better-sqlite3 (present, unused). Windows 11 / PowerShell.

## 3. How to Run
npm install | npm run dev (http://localhost:5000) | npm run build

## 4. Key Conventions
All data lives in client/src/lib/data.ts (static snapshot for now).
Components in client/src/components/ui/. One chart per visual concept. Dates as ISO strings (YYYY-MM-DD). No external state library.

## 5. What to Avoid
No Redux/Zustand. No D3/ECharts. No CSS-in-JS. No web scraping.
Do not add SSR. Express is for JSON APIs only when activated.
Do not commit node_modules/, .env, or .vercel/.
# Dodgers Injury Tracker

An interactive dashboard tracking Los Angeles Dodgers injured list (IL) players, expected return dates, position impact, and team winning percentage trends throughout the 2026 season.

**Live demo:** https://dodgers-injury-tracker.vercel.app

---

## What's inside

- **KPI cards** — current record, win %, games back, current streak
- **Win % trend chart** — rolling winning percentage with injury-wave overlays
- **IL table** — every player on the 10-day, 15-day, and 60-day IL with injury, expected return, and severity
- **Position-impact view** — which positions are hardest hit

Stack: Express + Vite + React 18 + TypeScript + Tailwind CSS v3 + shadcn/ui + Recharts + Drizzle ORM + better-sqlite3.

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

Output goes to `dist\public\`. You can host this folder on any static host (Vercel, Cloudflare Pages, Netlify, GitHub Pages, S3).

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

Claude Code will automatically pick up `claude.md` for project context. Open the same folder in VS Code side-by-side for the best workflow.

---

## Where the data lives

All current IL data is hardcoded in:

```
client\src\lib\data.ts
```

This file has three exports:

- `dodgersInjuredList` — array of player objects (name, position, injury, IL type, expected return)
- `injuryWaves` — key wave events to annotate on the chart
- `gameLog` — per-game results for the season-to-date win % calculation

To refresh the dashboard for today, edit those arrays and save. The dev server hot-reloads.

**Next major upgrade** (see `claude.md`): replace the static `data.ts` with a live fetch from the [MLB Stats API](https://statsapi.mlb.com/api/) so the dashboard stays current automatically.

---

## Project layout

```
dodgers-il\
├─ client\               # React frontend (Vite)
│  ├─ src\
│  │  ├─ App.tsx        # Router (hash-based)
│  │  ├─ pages\
│  │  │  └─ dashboard.tsx
│  │  ├─ components\    # shadcn/ui components
│  │  ├─ lib\
│  │  │  └─ data.ts     # ← All IL + game data lives here
│  │  └─ index.css      # Dodger blue theme
│  └─ index.html
├─ server\               # Express backend (optional, ready to wire up)
├─ shared\               # Types/schema shared client+server
├─ dist\public\          # Build output (committed for static hosts)
├─ package.json
├─ vite.config.ts
├─ tailwind.config.ts
└─ claude.md             # Claude Code project context
```

---

## Deploying

### Vercel (already configured)

From PowerShell:

```powershell
npx vercel --prod
```

The project is linked to `rogermallett-8478s-projects/dodgers-injury-tracker`. First run will prompt you to log in.

### Cloudflare Pages / Netlify / any static host

Run `npm run build`, then upload `dist\public\` to the host. No server required.

---

## License

Personal project — not affiliated with the Los Angeles Dodgers or MLB. Player names and injury data are public information from team announcements and reporting.

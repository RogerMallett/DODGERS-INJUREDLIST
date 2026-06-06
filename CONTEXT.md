# CONTEXT.md — Dodgers Injury Tracker

## Project
Repo: https://github.com/RogerMallett/DODGERS-INJUREDLIST
Branch: icm-refactor
Local path: C:\__My_AI_Projects\dodgers-injuredlist
Public URL: https://dodgers-injuredlist.vercel.app (also: https://dodgers-injury-tracker.vercel.app)

## Current Status
Live on Vercel. Full-stack deployment working end-to-end.
Live MLB Stats API data + Claude Haiku enrichment serving through /api/injuries Vercel serverless function.

## What's Done
- [x] icm-refactor branch created and pushed to GitHub
- [x] Layer 0: claude.md rewritten to 15-line ICM orientation file
- [x] Layer 1: CONTEXT.md created (this file)
- [x] docs/ folder created
- [x] docs/ROADMAP.md created (Layer 3 — long-term product vision)
- [x] docs/DATA-SOURCES.md created (Layer 3 — MLB API reference)
- [x] Dashboard verified running locally
- [x] Title updated to "Leslie's Dodgers Injury Tracker" in dashboard.tsx
- [x] Browser tab title set in index.html
- [x] vercel.json configured for client/Vite build structure
- [x] Deployed to Vercel — production URL is permanent and publicly shareable
- [x] Project moved from Google Drive to C:\__My_AI_Projects\dodgers-injuredlist
- [x] Fixed reusePort Windows compatibility issue in server/index.ts
- [x] Phase 2: MLB Stats API wired via fullRoster endpoint, filtering to IL players with injury notes
- [x] Phase 2: Claude API enrichment working — generates notes, expectedReturn, impact per player
- [x] use-injuries.ts hook created to fetch live data from /api/injuries
- [x] dashboard.tsx updated to consume live API data instead of hardcoded data.ts
- [x] icm-refactor branch merged into main and pushed to GitHub
- [x] ANTHROPIC_API_KEY added to Vercel environment variables
- [x] Fixed Vercel deployment: created api/injuries.ts as Vercel serverless function; fixed vercel.json (outputDirectory, installCommand); added engines.node=20.x to package.json
- [x] Resolved Vercel build cache/Root Directory issues — live site now serving correct build
- [x] Full stack live: MLB Stats API → Claude Haiku enrichment → /api/injuries → dashboard
- [x] Subtitle date made dynamic — always shows today's date

## What's Next
- [ ] Phase 3: Replace hardcoded team record/standings in seasonSummary (data.ts) with live MLB Stats API data
- [ ] GitHub Actions for daily auto-updates
- [ ] Mobile PWA configuration (add to Android home screen)
- [ ] Explore tunneling (discussed, deferred)
- [ ] Phase 3: Replace hardcoded `waves` array in data.ts with MLB API data (waves = injury wave annotations on the chart; currently editorial/manual — not returned by MLB Stats API)
- [ ] Future: Authentication system (storage.ts scaffold already in place for user login/accounts — relevant for paid tier)
- [ ] Phase 3: Replace hardcoded ImpactGroup summary strings in dashboard.tsx 
      with Claude API-generated summaries (same pattern as player notes/expectedReturn)


## Long-Term Vision
- Any MLB team (team picker)
- Multi-sport: NBA, NHL, NFL, soccer (MLS, EPL)
- Daily auto-update via GitHub Actions + Vercel (free tier, $0 cost)
- Public URL anyone can visit for latest injury data

## Stack
React 18 + TypeScript + Vite + Tailwind CSS v3 + shadcn/ui + Recharts
Windows 11 / PowerShell / VS Code + Claude Code
Hosting: Vercel (free Hobby tier)
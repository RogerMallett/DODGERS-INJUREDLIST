# CONTEXT.md — Dodgers Injury Tracker

## Project
Repo: https://github.com/RogerMallett/DODGERS-INJUREDLIST
Branch: main (icm-refactor merged in)
Local path: C:\__My_AI_Projects\dodgers-injuredlist
Public URL: https://dodgers-injuredlist.vercel.app (also: https://dodgers-injury-tracker.vercel.app)

## Current Status
Live on Vercel. Full-stack deployment working end-to-end.
Live MLB Stats API data + Claude Haiku enrichment serving through /api/injuries Vercel serverless function.
Win%-vs-injury-waves chart now derives its full trend live from /api/season (MLB Stats API schedule → cumulative win%), replacing the old hardcoded trend array. The /api/season function is multi-team ready (accepts a teamId).

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
- [x] IL table reordered (Player w/ position in parens | Impact | Injury | Expected return | Status | IL date) + positionLabel lookup
- [x] Created /api/season serverless fn + use-season hook; chart trend, X-axis ticks, record badge, and tooltip now all driven by live data
- [x] Removed hardcoded TrendPoint/buildTrend/trend from data.ts; deleted the interim api/scores.ts + use-scores.ts

## What's Next
- [~] Phase 3: seasonSummary partially live — wins/losses now come from /api/season; standing, L10, streak, run differential, and RS/RA are still hardcoded (June 3 snapshot) and need a live source
- [ ] GitHub Actions for daily auto-updates
- [ ] Mobile PWA configuration (add to Android home screen)
- [ ] Explore tunneling (discussed, deferred)
- [ ] Phase 3: Replace hardcoded `waves` array in data.ts with MLB API data (waves = injury wave annotations on the chart; currently editorial/manual — not returned by MLB Stats API)
- [ ] Future: Authentication system for the paid tier. NOTE: the server/storage.ts + shared/schema.ts users table (SQLite, plaintext password) is unused and is NOT a usable auth scaffold on Vercel (Express isn't deployed). Recommended path is Supabase Auth verified inside the api/ functions.
- [ ] Phase 3: Replace hardcoded ImpactGroup summary strings in dashboard.tsx 
      with Claude API-generated summaries (same pattern as player notes/expectedReturn)


## Known Issues (from June 6 audit)
- ilDate is fabricated: api/injuries.ts sets every player's IL date to today (not the real placement date), so the "IL date" column is not trustworthy.
- Dead/divergent duplicate: server/routes.ts reimplements /api/injuries with older bugs (claude-sonnet-4-6, max_tokens 1000, no markdown-fence stripping). It never runs on Vercel but is a trap — api/injuries.ts is the live one.
- seasonSummary is half-live / half-static (see What's Next).
- No rate limiting / CORS restriction on the api/ functions; /api/injuries calls the paid Claude API on every cache miss (cost/abuse risk before going public).
- teamId is not whitelist-validated in api/season.ts.
- React Query is configured (queryClient.ts + provider) but unused — both hooks use raw fetch.
- Hardcoded UI strings: "+ 1 Day-to-Day", the high-impact KPI sub "Snell · Glasnow · Díaz", and the three ImpactGroup summaries.

## Long-Term Vision
- Any MLB team (team picker)
- Multi-sport: NBA, NHL, NFL, soccer (MLS, EPL)
- Daily auto-update via GitHub Actions + Vercel (free tier, $0 cost)
- Public URL anyone can visit for latest injury data

## Stack
React 18 + TypeScript + Vite + Tailwind CSS v3 + shadcn/ui + Recharts
Windows 11 / PowerShell / VS Code + Claude Code
Hosting: Vercel (free Hobby tier)
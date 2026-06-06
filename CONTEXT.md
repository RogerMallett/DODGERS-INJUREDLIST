# CONTEXT.md — Dodgers Injury Tracker

## Project
Repo: https://github.com/RogerMallett/DODGERS-INJUREDLIST
Branch: icm-refactor
Local path: C:\__My_AI_Projects\dodgers-injuredlist
Public URL: https://dodgers-injury-tracker.vercel.app

## Current Status
Live on Vercel. Dashboard deployed and publicly accessible.
Data is currently static/hardcoded — Phase 2 will wire live MLB Stats API.

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

## What's Next
- [ ] Phase 2: wire live MLB Stats API data (replace hardcoded data)
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
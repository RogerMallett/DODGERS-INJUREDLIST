# ROADMAP.md — Dodgers Injury Tracker

## Product Vision
A public injury tracking dashboard for sports fans — free for casual users, paid for power users who want multi-team and multi-sport coverage.

## Monetization Model

### Free Tier (Public)
- One team (default: Los Angeles Dodgers)
- Current injury/IL data only
- No account required
- Hosted at a public URL (Vercel)

### Paid Tier (Subscription)
- Any MLB team (team picker)
- Multi-sport: NBA, NHL, NFL, MLS, EPL
- Possibly: historical IL data, injury alerts/notifications
- Account required (auth TBD)

## Phases

### Phase 1 — ICM Structure and Static Dashboard (Current)
- [x] ICM workspace scaffolded (claude.md, CONTEXT.md)
- [x] Working dashboard (Perplexity-generated, React/Vite/Tailwind)
- [ ] docs/ folder created (ROADMAP.md, DATA-SOURCES.md)
- [ ] Dashboard verified running locally (npm run dev)

### Phase 2 — Live MLB Data
- [ ] Wire MLB Stats API (free, no key required)
- [ ] Replace static/mock data with live IL feed
- [ ] Auto-refresh on load

### Phase 3 — Deployment
- [ ] Deploy to Vercel (free tier)
- [ ] GitHub Actions for daily auto-update
- [ ] Public URL live

### Phase 4 — Multi-Team (Paid Gate)
- [ ] Team picker UI
- [ ] Auth layer (Supabase Auth)
- [ ] Stripe for paid tier
- [ ] All 30 MLB teams supported

### Phase 5 — Multi-Sport
- [ ] NBA, NFL, NHL, MLS, EPL injury data

## Guiding Principles
- Zero infrastructure cost until revenue justifies it
- Public URL, no login wall for free tier
- ICM methodology governs all AI-assisted development

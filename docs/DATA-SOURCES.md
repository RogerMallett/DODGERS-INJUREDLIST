# DATA-SOURCES.md — Dodgers Injury Tracker

## Primary Data Source: MLB Stats API

### Overview
- URL: https://statsapi.mlb.com/api/
- Cost: Free, no API key required
- Docs: https://github.com/toddrob99/MLB-StatsAPI (community docs)

## Key Endpoints

### Injured List / Roster Status
GET https://statsapi.mlb.com/api/v1/teams/{teamId}/roster?rosterType=injuries

### Team ID Reference
- Los Angeles Dodgers: 119
- Los Angeles Angels: 108
- San Francisco Giants: 137
- San Diego Padres: 135
- Arizona Diamondbacks: 109

Full team list:
GET https://statsapi.mlb.com/api/v1/teams?sportId=1

### Player Details
GET https://statsapi.mlb.com/api/v1/people/{playerId}

## Response Notes
- IL data includes: player name, injury type, date placed, expected return
- Roster status codes: IL10, IL15, IL60, DTD
- Data is generally current within 24 hours

## Future Data Sources (Phase 5 - Multi-Sport)
- NBA: https://www.balldontlie.io/api/v1/
- NFL: https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries
- NHL: https://api-web.nhle.com/v1/
- MLS/EPL: https://www.football-data.org/

## Notes
- Implement caching or daily snapshots to stay within rate limits
- GitHub Actions daily cron job recommended to pre-fetch data
- Store cached data as JSON for Phase 3+

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Run with tsx (no build needed)
npm run watch      # Watch mode for development
npm run build      # Compile TypeScript to dist/
npm run serve      # Run compiled output
```

No test suite exists. Validate changes by running `npm start` and checking console output.

## Architecture

This is a Node.js TypeScript scraper that monitors real estate sites in Pirapora, MG for new rental listings and sends notifications about new ones.

**Flow:** `index.ts` → loads known listings from `data/house.json` → runs all scrapers in parallel via `checker.ts` → compares results by `id` → calls `notifier.ts` for each new listing → saves updated state back to `data/house.json`.

**Key contracts:**
- Each scraper implements the `Scraper` interface (`src/types.ts`) with a single `fetch(): Promise<Listing[]>` method.
- Deduplication is purely by `listing.id` — scrapers must produce stable, unique IDs per property.
- `data/house.json` is the persistent state (a `Record<string, House>`), committed to the repo and updated by GitHub Actions on every run.

**Adding a scraper:** create a class in `src/scrapers/`, implement `Scraper`, and register it in `src/scrapers/index.ts`.

**Notification stub:** `src/notifier.ts` is a no-op TODO — implement it to add email, Telegram, Slack, etc.

**Automation:** GitHub Actions runs the project hourly and commits any changes to `data/house.json`.

## Dependencies

- `cheerio` — HTML parsing for scrapers that use web scraping
- `node-fetch` — HTTP requests (project uses ESM `"type": "module"`)
- `tsx` — runs TypeScript directly without a build step in dev

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

**Pagination:** Always verify whether a site paginates results before implementing a scraper. Fetch the listing URL manually and check for next-page links (e.g. `pagesIntervalos`, `controlsPage`, `pag=`, `pg=`). Some sites (e.g. São Francisco Imobiliária) appear to have pagination UI elements in the HTML but return all results on a single page — confirm by counting listings vs. what the site shows. Scrapers that need pagination should loop with a `hasNext` guard (see `antoniovieira.ts` as reference).

**Notifications:** `src/notifier.ts` sends Telegram messages via bot `@CorretorFajutoBot`. Credentials are read from `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` env vars — set via GitHub Actions secrets in production and `.vscode/launch.json` locally (not committed). A daily summary is sent at 15:00 UTC (noon BRT).

**Automation:** GitHub Actions runs the project hourly and commits any changes to `data/house.json`.

## Dependencies

- `cheerio` — HTML parsing for scrapers that use web scraping
- `node-fetch` — HTTP requests (project uses ESM `"type": "module"`)
- `tsx` — runs TypeScript directly without a build step in dev

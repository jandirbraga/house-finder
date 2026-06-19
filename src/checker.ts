import type { Listing } from "./types.js";
import { scrapers } from "./scrapers/index.js";

export async function checkAllSites(): Promise<Listing[]> {
  const results = await Promise.allSettled(scrapers.map((s) => s.fetch()));

  const listings: Listing[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      listings.push(...result.value);
    } else {
      console.error("Scraper failed:", result.reason?.message);
    }
  }

  return listings;
}

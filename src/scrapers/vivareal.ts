import type { Listing, Scraper } from "../types.js";

export class VivaReal implements Scraper {
  async fetch(): Promise<Listing[]> {
    // TODO: implement Viva Real scraping
    return [];
  }
}

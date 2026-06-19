import type { Listing } from "./types.js";

export async function notify(listing: Listing): Promise<void> {
  // TODO: implement notification (e.g. email, Telegram, desktop alert)
  console.log(`[notify] New listing: ${listing.url}`);
}

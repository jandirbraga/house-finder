import { checkAllSites } from "./checker.js";
import { loadHouses, saveHouses, toHouse } from "./store.js";
import { notify } from "./notifier.js";

async function run(): Promise<void> {
  const houses = await loadHouses();
  const results = await checkAllSites();

  const newListings = results.filter((listing) => !(listing.id in houses));

  if (newListings.length === 0) {
    console.log("No new listings found.");
    return;
  }

  console.log(`Found ${newListings.length} new listing(s):`);
  for (const listing of newListings) {
    console.log(`  [${listing.site}] ${listing.title} — ${listing.price} — ${listing.url}`);
    await notify(listing);
    houses[listing.id] = toHouse(listing);
  }

  await saveHouses(houses);
}

run().catch(console.error);

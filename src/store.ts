import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import type { House, Listing } from "./types.js";

const STORE_PATH = "./data/house.json";

export async function loadHouses(): Promise<Record<string, House>> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, House>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Error loading houses:", error);
    }
    return {};
  }
}

export async function saveHouses(houses: Record<string, House>): Promise<void> {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(houses, null, 2));
}

export function toHouse(listing: Listing): House {
  return { ...listing, status: "UNCHECKED" };
}

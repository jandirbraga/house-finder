import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
const STORE_PATH = "./data/house.json";
export async function loadHouses() {
    try {
        const raw = await readFile(STORE_PATH, "utf-8");
        return JSON.parse(raw);
    }
    catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Error loading houses:", error);
        }
        return {};
    }
}
export async function saveHouses(houses) {
    await mkdir(dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(houses, null, 2));
}
export function toHouse(listing) {
    return { ...listing, status: "UNCHECKED" };
}

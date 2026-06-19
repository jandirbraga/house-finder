import type { Scraper } from "../types.js";
import { JhsImoveis } from "./jhsimoveis.js";
import { VivaReal } from "./vivareal.js";
import { SsImoveis } from "./ssimoveis.js";

export const scrapers: Scraper[] = [
  new JhsImoveis(),
  new VivaReal(),
  new SsImoveis(),
];

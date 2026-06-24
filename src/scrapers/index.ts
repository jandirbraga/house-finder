import type { Scraper } from "../types.js";
import { JhsImoveis } from "./jhsimoveis.js";
import { SsImoveis } from "./ssimoveis.js";
import { EuniceBragaCorretora } from "./eunicebragacorretora.js";
import { AlphaImoveis } from "./alphaimoveis.js";
import { AntonioVieira } from "./antoniovieira.js";
import { SaoFrancisco } from "./saofrancisco.js";

export const scrapers: Scraper[] = [
  new JhsImoveis(),
  new SsImoveis(),
  new EuniceBragaCorretora(),
  new AlphaImoveis(),
  new AntonioVieira(),
  new SaoFrancisco(),
];

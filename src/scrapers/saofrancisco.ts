import { load } from "cheerio";
import type { Listing, Scraper } from "../types.js";

const BASE_URL = "https://www.saofranciscoimobiliaria.com.br";
const SEARCH_URL = `${BASE_URL}/search?acao=s1&finalidade_s=3&tipo_s=&faixaPreco_s=&cidade_s=1&bairro_s=`;
const HEADERS = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
  "referer": BASE_URL,
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

function parsePage(html: string): Listing[] {
  const $ = load(html, { decodeEntities: true });
  const listings: Listing[] = [];

  $("dl.gridTypeList").each((_, el) => {
    const $dl = $(el);
    const href = $dl.find("dd.det-lista strong a").attr("href");
    const title = $dl.find("dd.det-lista strong a").text().trim();
    const bairro = $dl.find("dd.det-lista span.loc b").first().text().trim();
    const cidade = $dl.find("dd.det-lista span.loc b").last().text().trim();
    const priceText = $dl.find("dd.pr-lista span.valorImovel b").text().trim();
    const id = $dl.find("input[name='comparar[]']").val() as string | undefined;

    if (!href || !id) return;

    listings.push({
      id: `sf-${id}`,
      site: "São Francisco Imobiliária",
      title: `${title} — ${bairro}, ${cidade}`,
      price: priceText,
      url: `${BASE_URL}${href}`,
      address: bairro,
    });
  });

  return listings;
}

export class SaoFrancisco implements Scraper {
  async fetch(): Promise<Listing[]> {
    const response = await globalThis.fetch(SEARCH_URL, { headers: HEADERS });

    if (!response.ok) {
      throw new Error(`São Francisco request failed: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const html = new TextDecoder("iso-8859-1").decode(buffer);
    return parsePage(html);
  }
}

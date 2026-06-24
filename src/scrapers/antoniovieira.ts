import { load } from "cheerio";
import type { Listing, Scraper } from "../types.js";

const BASE_URL = "https://www.antoniovieiraimoveis.com.br";
const HEADERS = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
  "referer": `${BASE_URL}/secao/aluguel`,
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

function pageUrl(page: number): string {
  return page === 1
    ? `${BASE_URL}/secao/aluguel`
    : `${BASE_URL}/secao/aluguel?pag=${page}`;
}

function parsePage(html: string): { listings: Listing[]; hasNext: boolean } {
  const $ = load(html);
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
      id: `antonio-${id}`,
      site: "Antonio Vieira Imóveis",
      title: `${title} — ${bairro}, ${cidade}`,
      price: priceText,
      url: `${BASE_URL}${href}`,
      address: bairro,
    });
  });

  const hasNext = $("div.pagesIntervalos a.controlsPage").length > 0;

  return { listings, hasNext };
}

export class AntonioVieira implements Scraper {
  async fetch(): Promise<Listing[]> {
    const all: Listing[] = [];
    let page = 1;

    while (page <= 10) {
      // Site certificate chain not trusted by Node — temporarily disable TLS verification
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      const response = await globalThis.fetch(pageUrl(page), { headers: HEADERS }).finally(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
      });

      if (!response.ok) {
        throw new Error(`Antonio Vieira request failed: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const html = new TextDecoder("iso-8859-1").decode(buffer);
      const { listings, hasNext } = parsePage(html);
      all.push(...listings);

      if (!hasNext) break;
      page++;
    }

    return all;
  }
}

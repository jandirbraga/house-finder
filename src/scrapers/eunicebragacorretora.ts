import type { Listing, Scraper } from "../types.js";

const BASE_URL = "https://eunicebragacorretora.com";
const HEADERS = {
  "accept": "*/*",
  "accept-language": "en,pt-BR;q=0.9,pt;q=0.8",
  "rsc": "1",
  "next-url": "/dog",
  "next-router-state-tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22(templates)%22%2C%7B%22children%22%3A%5B%22dog%22%2C%7B%22children%22%3A%5B%22busca%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2C%22refetch%22%2C0%5D%7D%2Cnull%2Cnull%2C4%5D%7D%2Cnull%2Cnull%2C8%5D%7D%2Cnull%2Cnull%2C8%5D%7D%2Cnull%2Cnull%2C24%5D",
  "referer": `${BASE_URL}/`,
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

interface EuniceProperty {
  Codigo: string;
  TituloSite: string;
  ValorLocacao: number;
  Endereco: string;
  Bairro: string;
  Cidade: string;
  UF: string;
  Categoria: string;
}

interface ParseResult {
  properties: EuniceProperty[];
  total: number;
  quantity: number;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toListingUrl(p: EuniceProperty): string {
  const slug = [p.Categoria, p.Bairro, p.Cidade, p.UF, p.Codigo]
    .map(toSlug)
    .join("-");
  return `${BASE_URL}/imovel/${slug}`;
}

function parseRsc(rscText: string): ParseResult {
  const match = rscText.match(/"properties":(\[.*?\]),"total":(\d+),"page":\d+,"quantity":(\d+)/s);
  if (!match) return { properties: [], total: 0, quantity: 12 };
  try {
    return {
      properties: JSON.parse(match[1]),
      total: parseInt(match[2], 10),
      quantity: parseInt(match[3], 10),
    };
  } catch {
    return { properties: [], total: 0, quantity: 12 };
  }
}

function toListings(properties: EuniceProperty[]): Listing[] {
  return properties
    .filter((p) => p.ValorLocacao > 0)
    .map((p) => ({
      id: `eunice-${p.Codigo}`,
      site: "Eunice Braga Corretora",
      title: `${p.Categoria} — ${p.Bairro}, ${p.Cidade}/${p.UF}`,
      price: `R$ ${p.ValorLocacao.toLocaleString("pt-BR")}`,
      url: toListingUrl(p),
      address: `${p.Endereco} — ${p.Bairro}`,
    }));
}

export class EuniceBragaCorretora implements Scraper {
  private searchUrl(page: number): string {
    const base = `${BASE_URL}/busca?finalidade=Aluguel&cidade=Pirapora&_rsc=19Nru3e57UeSI_8T`;
    return page === 1 ? base : `${base}&page=${page}`;
  }

  async fetch(): Promise<Listing[]> {
    const all: Listing[] = [];
    let page = 1;

    while (page <= 20) {
      const response = await globalThis.fetch(this.searchUrl(page), { headers: HEADERS });

      if (!response.ok) {
        throw new Error(`Eunice Braga request failed: ${response.status} ${response.statusText}`);
      }

      const { properties, total, quantity } = parseRsc(await response.text());
      all.push(...toListings(properties));

      if (page * quantity >= total) break;
      page++;
    }

    return all;
  }
}

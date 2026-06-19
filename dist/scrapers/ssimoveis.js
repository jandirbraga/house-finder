import { load } from "cheerio";
const BASE_URL = "https://ssimoveismg.com.br";
export class SsImoveis {
    async fetchPage(page = 1) {
        const pageUrl = page === 1
            ? `${BASE_URL}/imoveis/negociacao/locacao/cidade/pirapora/tipoimovel/6937::apartamento,6938::casa`
            : `${BASE_URL}/imoveis/negociacao/locacao/cidade/pirapora/tipoimovel/6937::apartamento,6938::casa/pagina/${page}`;
        const response = await globalThis.fetch(pageUrl, {
            method: "GET",
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
            },
        });
        if (!response.ok) {
            throw new Error(`SS Imóveis request failed: ${response.status}`);
        }
        const html = await response.text();
        const $ = load(html);
        const listings = [];
        $(".card").each((_, elem) => {
            const $card = $(elem);
            const link = $card.find('a[href*="/imovel/"]').attr("href");
            const titleAlt = $card.find("img").attr("alt");
            const cardText = $card.text();
            const priceMatch = cardText.match(/R\$\s*([\d.,]+)/);
            const price = priceMatch ? priceMatch[1] : "N/A";
            const codeMatch = $card.find(".badge-code").text();
            const code = codeMatch.replace("Cód.", "").trim() || "N/A";
            if (link && titleAlt) {
                listings.push({
                    id: `ss-${code}`,
                    site: "SS Imóveis",
                    title: titleAlt,
                    price: `R$ ${price}`,
                    url: link.startsWith("http") ? link : `${BASE_URL}${link}`,
                });
            }
        });
        return listings;
    }
    hasNextPage(html) {
        const $ = load(html);
        const paginationLinks = $(".pagination a[href*='/pagina/']");
        return paginationLinks.length > 0;
    }
    async fetch() {
        try {
            const allListings = [];
            let page = 1;
            let hasMore = true;
            while (hasMore && page <= 10) {
                try {
                    const pageListings = await this.fetchPage(page);
                    allListings.push(...pageListings);
                    if (pageListings.length === 0) {
                        hasMore = false;
                    }
                    else {
                        // Check if there's a next page by trying to fetch it
                        const pageUrl = `${BASE_URL}/imoveis/negociacao/locacao/cidade/pirapora/tipoimovel/6937::apartamento,6938::casa/pagina/${page + 1}`;
                        const response = await globalThis.fetch(pageUrl, {
                            method: "GET",
                            headers: {
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
                            },
                        });
                        // If we get 500 or 404, there's no next page
                        if (!response.ok) {
                            hasMore = false;
                        }
                        else {
                            const html = await response.text();
                            hasMore = this.hasNextPage(html);
                            page++;
                        }
                    }
                }
                catch (pageError) {
                    // Stop pagination on error
                    hasMore = false;
                }
            }
            return allListings;
        }
        catch (error) {
            console.error("SS Imóveis scraper error:", error);
            return [];
        }
    }
}

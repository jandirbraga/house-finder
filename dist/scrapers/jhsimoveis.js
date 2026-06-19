const API_URL = "https://www.jhsimoveis.com.br/imoveis/ajax/";
const BASE_URL = "https://www.jhsimoveis.com.br";
const BODY = new URLSearchParams({
    "imovel[finalidade]": "aluguel",
    "imovel[codigounidade]": "",
    "imovel[codigosimoveis]": "",
    "imovel[codigoTipo][codigo][]": "0",
    "imovel[codigoTipo][nome][]": "imoveis",
    "imovel[codigocidade]": "pirapora",
    "imovel[codigoregiao]": "0",
    "imovel[codigosbairros]": "0",
    "imovel[endereco]": "0",
    "imovel[numeroquartos]": "0-quartos",
    "imovel[numerovagas]": "0-vaga-ou-mais",
    "imovel[numerobanhos]": "0-banheiro-ou-mais",
    "imovel[numerosuite]": "0-suite-ou-mais",
    "imovel[numerovaranda]": "0",
    "imovel[numeroelevador]": "0",
    "imovel[valorde]": "0",
    "imovel[valorate]": "0",
    "imovel[areade]": "0",
    "imovel[areaate]": "0",
    "imovel[extras]": "0",
    "imovel[extends]": "false",
    "imovel[mobiliado]": "false",
    "imovel[dce]": "false",
    "imovel[piscina]": "false",
    "imovel[sauna]": "false",
    "imovel[salaofestas]": "false",
    "imovel[academia]": "false",
    "imovel[boxDespejo]": "false",
    "imovel[portaria24h]": "false",
    "imovel[aceitafinanciamento]": "false",
    "imovel[arealazer]": "false",
    "imovel[quartoqtdeexata]": "false",
    "imovel[vagaqtdexata]": "false",
    "imovel[destaque]": "0",
    "imovel[opcaoimovel]": "4",
    "imovel[retornomapa]": "false",
    "imovel[retornomapaapp]": "false",
    "imovel[numeropagina]": "1",
    "imovel[numeroregistros]": "20",
    "imovel[ordenacao]": "",
    "imovel[pagina]": "1",
    "imovel[codigocondominio]": "0",
    "imovel[condominio][]": "todos-os-condominios",
}).toString();
function toListingUrl(listing) {
    return `${BASE_URL}/imovel/${listing.codigo}/${listing.titulo}`;
}
function toListingTitle(listing) {
    return `${listing.tipo} — ${listing.bairro}, ${listing.cidade}/${listing.estado}`;
}
export class JhsImoveis {
    async fetch() {
        const response = await globalThis.fetch(API_URL, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                "Referer": `${BASE_URL}/aluguel/imoveis/pirapora/todos-os-bairros/0-quartos/0-suite-ou-mais/0-vaga/0-banheiro-ou-mais/todos-os-condominios`,
            },
            body: BODY,
        });
        if (!response.ok) {
            throw new Error(`JHS Imóveis request failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.lista.map((item) => ({
            id: `jhs-${item.codigo}`,
            site: "JHS Imóveis",
            title: toListingTitle(item),
            price: item.valor,
            url: toListingUrl(item),
            address: `${item.endereco}, ${item.numero} — ${item.bairro}`,
        }));
    }
}

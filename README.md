# 🏠 House Finder

Monitora sites de imóveis em Pirapora, MG e notifica sobre novos anúncios de aluguel.

## 📍 Sites Monitorados

- **JHS Imóveis** - API REST
- **SS Imóveis** - Web scraping com paginação
- **VivaReal** - Web scraping

## 🚀 Como Usar

### Local

```bash
npm install
npm run build
npm start
```

### GitHub Actions (Automático)

O projeto roda automaticamente **a cada hora** via GitHub Actions. Os dados são salvos em `data/house.json`.

## 📋 Configuração

Edite os scrapers em `src/scrapers/` para:
- Mudar cidade (Pirapora)
- Mudar tipo de imóvel (apartamento, casa, etc.)
- Mudar tipo de negociação (aluguel, venda)

## 🔔 Notificações

Configure o arquivo `src/notifier.ts` para enviar notificações via:
- Email
- Slack
- WhatsApp
- etc.

## 📂 Estrutura

```
src/
├── index.ts          # Entry point
├── checker.ts        # Coordena scrapers
├── store.ts          # Salva dados em data/house.json
├── notifier.ts       # Envia notificações
├── types.ts          # Types TypeScript
└── scrapers/         # Web scrapers
    ├── jhsimoveis.ts
    ├── ssimoveis.ts
    └── vivareal.ts
```

## 📅 Workflow

1. Executa todos os scrapers
2. Compara com imóveis anteriores (em `data/house.json`)
3. Identifica novos anúncios
4. Envia notificações
5. Salva dados atualizados

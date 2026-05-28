# RubinOT — Gestão de Estoque

Sistema de gestão de estoque pessoal para loja no RubinOT (servidor OT do Tibia).  
Interface dark, 100% offline, dados salvos em localStorage.

## Instalação e execução

```bash
cd lojaestoque
npm install
npm run dev
```

Acesse em: http://localhost:5173

## Funcionalidades

- **Dashboard** — resumo do mês, lucro total em destaque, gráfico de barras dos últimos 6 meses (Recharts)
- **Coins** — registro de entradas/saídas, saldo por servidor, histórico filtrado, calculadora rápida
- **Itens** — cadastro com autocomplete (banco de itens pré-mapeado), sistema de tier (0–4), imagens da TibiaWiki, registro de vendas
- **Contas** — gestão de chars (Knight/Paladin/Sorcerer/Monk), vocação, level, outfits/montarias/itens notáveis, screenshot base64
- **Configurações** — servidores, preços de coins, exportar/importar JSON, relatório mensal .txt

## Sistema de Tier

| Tier | Cor    |
|------|--------|
| T0   | Cinza  |
| T1   | Verde  |
| T2   | Azul   |
| T3   | Roxo   |
| T4   | Dourado|

Itens Classe 3 → máx T3 · Itens Classe 4 → máx T4

## Imagens dos itens

As imagens carregam via URL pública da TibiaWiki BR:
`https://www.tibiawiki.com.br/images/[Nome_do_item].gif`

Em caso de erro (offline ou item não encontrado), exibe emoji de fallback por categoria.

## Tecnologias

- React 18 + Vite 5
- Tailwind CSS 3
- Recharts
- Lucide React
- localStorage (sem backend)

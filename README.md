# Health Tracker

Aplicativo pessoal de acompanhamento diário — tarefas, alimentação, nutrientes, desmame de medicação, estudos (sincronizado com o cronograma da pós em psiquiatria) e um resumo semanal qualitativo.

App web local-first (React + Vite + TypeScript). Todos os dados ficam salvos no `localStorage` do navegador — nada é enviado para um servidor.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

Gera os arquivos estáticos em `dist/`, prontos para hospedar em qualquer serviço estático (GitHub Pages, Vercel, Netlify etc).

## Abas

- **Tarefas** — registro do dia com julgamento crítico e qualitativo de performance, calibrado pelos objetivos pessoais (perda de peso, cognição, massa magra, cabelo, produtividade).
- **Alimentação** — suplementos pré-definidos (um clique confirma a dose), catálogo de "adicionar rápido" com base nutricional completa, registro livre de refeições, medicações e dados manuais do Apple Watch.
- **Nutrientes** — tabela com meta diária, semanal e revisão geral por nutriente, mais análise textual (dia/semana/mês) ao clicar em "Analisar dia".
- **Desmame** — acompanhamento de Rivotril × CBD × Melatonina ao longo do tempo.
- **Estudos** — objetivo do dia pré-preenchido a partir do cronograma da pós em psiquiatria, registro do que foi feito e julgamento.
- **Resumo** — análise qualitativa completa do dia e placar semanal (nutrientes, calorias, Apple Watch, nota 0-100).

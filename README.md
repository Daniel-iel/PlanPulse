# PLAN/PULSE

Analisador visual de query plans do PostgreSQL. Cole a saída de um `EXPLAIN`
(texto ou `FORMAT JSON`) e veja para onde o tempo está indo, com diagnóstico
automático e histórico de comparações — tudo rodando no navegador, sem
backend.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

- `/` — página de apresentação do PLAN/PULSE
- `/app` — analisador interativo de query plans

## Build de produção

```bash
npm run build
npm run start
```

## Estrutura

- `lib/parser.ts` — parsers para EXPLAIN texto e `FORMAT JSON`
- `lib/metrics.ts` — cálculo de tempo próprio (self-time) e % do total
- `lib/warnings.ts` — regras de diagnóstico automático (seq scan sem índice,
  sort em disco, estimativa desalinhada, etc.)
- `lib/treeLayout.ts` — layout do diagrama de cards conectados
- `lib/storage.ts` — histórico persistido em `localStorage`
- `components/` — UI (canvas com pan/zoom, inspetor, diagnóstico, modais de
  histórico e comparação)

## Histórico

Toda análise é salva automaticamente no `localStorage` do navegador (até 25
entradas). Nada é enviado para um servidor — os dados ficam só na máquina de
quem usa. Selecione duas execuções no histórico para comparar tempo de
execução, avisos resolvidos e avisos novos entre elas.

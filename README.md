# PLAN/PULSE

Visual PostgreSQL query-plan analyzer. Paste the output of `EXPLAIN` (text or
`FORMAT JSON`) to see where execution time goes, with automatic diagnosis and
comparison history — all in your browser, with no backend.

## Rodando localmente

```bash
npm install
npm run dev
```

Open http://localhost:3000.

- `/` — redirects to the English landing page (`/en`)
- `/en` — English (United States)
- `/pt` — Português (Brasil)
- `/es` — Español (España)
- `/<locale>/app` — interactive query-plan analyzer in the selected locale
- `/app` — redirects to the English analyzer (`/en/app`)
- `/pt-br` and `/es-es` — legacy routes that redirect to `/pt` and `/es`

The language switcher keeps you on the same page when changing locales.

## Build de produção

```bash
npm run build
npm run start
```

## Structure

- `lib/parser.ts` — parsers for text EXPLAIN and `FORMAT JSON`
- `lib/metrics.ts` — self-time and total percentage calculations
- `lib/warnings.ts` — automatic diagnosis rules (sequential scans, disk sorts,
  row-estimate mismatches, and more)
- `lib/treeLayout.ts` — connected-card diagram layout
- `lib/storage.ts` — history persisted in `localStorage`
- `lib/i18n.ts` — supported locales, page copy, and translated diagnostics
- `components/` — canvas, inspector, diagnosis, and history/comparison dialogs

## History

Each analysis is saved automatically in browser `localStorage` (up to 25
entries). Nothing is sent to a server. Select two runs in the history to
compare execution time, resolved warnings, and new warnings. Saved EXPLAIN
input is used to display history in the active locale; technical plan names
and SQL remain as provided by PostgreSQL.

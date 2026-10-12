# PLAN/PULSE

Visual PostgreSQL query-plan analyzer. Paste the output of `EXPLAIN` (text or
`FORMAT JSON`) to see where execution time goes, with automatic diagnosis and
comparison history — all in your browser, with no backend.

## Rodando localmente

```bash
cd src
npm ci
npm run dev
```

Open http://localhost:3000/en.

- `/en` — English (United States)
- `/pt` — Português (Brasil)
- `/es` — Español (España)
- `/<locale>/app` — interactive query-plan analyzer in the selected locale

The language switcher keeps you on the same page when changing locales.

## Build estático

```bash
cd src
npm run build
```

The static site is generated in `src/out`. The GitHub Actions workflow builds
it with the `/PlanPulse` base path and deploys it to
`https://daniel-iel.github.io/PlanPulse/en/`. GitHub Pages must be configured
once in **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Pull requests validate the build; pushes to `main` publish it.

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

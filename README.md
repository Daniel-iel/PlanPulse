# PLAN/PULSE

PLAN/PULSE is a browser-based PostgreSQL query plan analyzer built to turn raw `EXPLAIN` output into a readable execution tree, highlighting bottlenecks, diagnosing common problems, and allowing quick comparisons between runs.

It runs entirely in the browser, keeps query history in local storage, and requires no backend service.

## Why this project exists

PostgreSQL plans can be dense and hard to reason about when they are pasted as plain text. PLAN/PULSE makes them easier to inspect by:

- visualizing the execution tree
- highlighting the node that dominates runtime
- surfacing warnings such as sequential scans, sort spills, estimate mismatches, and repeated node execution
- keeping a local history of analyzed plans for comparison
- supporting English, Portuguese, and Spanish interfaces

## Features

- `EXPLAIN` text and `EXPLAIN (FORMAT JSON)` support
- interactive node inspection with detailed metrics
- automatic diagnosis based on execution patterns
- run comparison for before/after optimization work
- local-only storage with no server-side data processing
- static deployment-friendly Next.js app

## Live app

This repository contains the source for the app deployed on GitHub Pages. The app is available under locale routes such as:

- `/en`
- `/pt`
- `/es`
- `/<locale>/app`

## Quick start

### Prerequisites

- Node.js 20+
- npm

### Local development

```bash
cd src
npm install
npm run dev
```

Then open:

```text
http://localhost:3000/en
```

You can switch locales without losing the current plan state.

## Available scripts

From the `src` directory:

```bash
npm run dev    # start the development server
npm run build  # generate the production static build
npm run start  # serve the production build locally
npm run lint   # lint the app
```

## Build and deployment

The project is built as a static site:

```bash
cd src
npm run build
```

The generated output is written to `src/out`.

This project is designed to be deployed to GitHub Pages with a base path such as `/PlanPulse`. The repository includes automation for building and publishing the app, and the static deployment expects GitHub Pages to be configured with the GitHub Actions source.

## Project structure

```text
.
├── .github/               # CI/CD and GitHub automation
├── README.md              # project documentation
├── src/
│   ├── app/               # Next.js application routes and entry pages
│   ├── components/        # UI components for canvas, drawer, inspector, history, and comparison
│   ├── lib/               # parsing, metrics, warnings, locale configuration, and storage logic
│   ├── public/            # static assets
│   ├── package.json       # project scripts and dependencies
│   ├── next.config.*      # Next.js configuration
│   └── tsconfig.json      # TypeScript configuration
└── .venv/                 # local environment metadata for the session
```

## How to use it

1. Open the analyzer page in your preferred locale.
2. Paste a PostgreSQL `EXPLAIN` output in text form or as `FORMAT JSON`.
3. Review the visual execution tree and node timings.
4. Inspect warnings and recommendations for slow paths.
5. Save and compare multiple plans to evaluate optimization impact.

## Privacy and data handling

PLAN/PULSE is intentionally privacy-first:

- no backend API receives the query plan
- no data is sent to a remote service
- analysis history is persisted in the browser using `localStorage`
- saved plans remain on the local device unless the user clears them manually

## Contributing

Contributions are welcome. A typical workflow is:

```bash
git checkout -b feature/your-change
cd src
npm install
npm run dev
```

Then validate your changes with the relevant build or lint task before submitting a pull request.

## License

This project does not currently declare a license file in the repository root. If you plan to distribute or reuse it publicly, confirm the intended license before publishing or contributing.

## Notes

The app is optimized for PostgreSQL performance debugging and is especially useful when analyzing `EXPLAIN ANALYZE` output for indexes, joins, sort operations, and scan bottlenecks.

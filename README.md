# vibe-rank

The open leaderboard for AI **vibe-coding models** — compare frontier
language models on the metrics that actually matter for shipping code with
AI: tokens, code output, latency, cost, context and end-to-end task success.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** for theming, **shadcn-style** primitives for UI
- **Framer Motion** for transitions and reveals
- **React Router** for `/`, `/leaderboard`, `/models/:slug`
- Built to be **Convex-ready** — data lives in a typed seed today and
  plugs into a Convex backend tomorrow.
- **Bun** as the package manager and runtime

## Scripts

> The Freebuff Cloud UI runs the install + dev server for you. These are
> the same commands the preview is wired to.

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `bun install`      | Install dependencies                       |
| `bun run dev`      | Start the Vite dev server on **port 5173** |
| `bun run build`    | Type-check and produce a production build  |
| `bun run preview`  | Serve the production build                 |
| `bun run typecheck`| Strict TypeScript check only               |

## What's in here

- `/` — themed landing page (hero, KPI tiles, top-3 podium, scoring explainer, CTA)
- `/leaderboard` — sortable leaderboard with search + tier filter
- `/models/:slug` — full model deep-dive with KPI grid, radar vs baseline,
  and weekly trend charts
- 404 — gentle "model not found"

## KPIs we track

For every model in the cohort we publish **per-task averages**:

- **Tokens** (input / output)
- **Code output** (LOC / files / week-over-week)
- **Success rate** (% of tasks that produced a passing diff)
- **Latency** (p50 / p95 completion time)
- **Cost / task** (USD)
- **Context window** (max usable tokens)
- **Vibe-score** (composite 0–100)

The composite score is `0.45·success + 0.20·code density +
0.15·cost efficiency + 0.10·latency efficiency + 0.10·context boost`.
Weights are open and auditable.

## Future

- Wire the seed dataset to a Convex backend so submissions are auditable.
- Add per-vendor charts and benchmark breakdowns (single-file, multi-file, tests).
- Per-task transcript viewer.
- Comparison mode: pick any two models and diff KPIs head-to-head.

## License

MIT — see `LICENSE`.

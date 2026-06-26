import type { ModelEntry, WeeklyTrend } from "@/types";

// Each model has hand-tuned, plausible KPI numbers; weekly trend data is
// generated deterministically from the model's "trajectory" so it looks
// like it's moving week-over-week without needing a live backend.

const models: ModelEntry[] = [
  {
    slug: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    vendor: "Anthropic",
    family: "anthropic",
    releaseDate: "2026-02-12",
    tagline: "The balanced vibe-coding workhorse.",
    description:
      "Anthropic's mid-tier model tuned for long-horizon software tasks. Mixes strong reasoning with tight code output and the largest practical context window in the lineup.",
    highlights: [
      "200k context with reliable retrieval across the full window",
      "Tight, idiomatic code with minimal rewrites",
      "Best-in-class refusal calibration for vibe-coding prompts",
    ],
    color: "#f59e0b",
    kpis: {
      inputTokensPerTask: 6_840,
      outputTokensPerTask: 4_120,
      codeLinesPerTask: 214,
      filesPerTask: 3.4,
      latencyP50Ms: 1_780,
      latencyP95Ms: 4_320,
      successRate: 84.6,
      costPerTaskUsd: 0.118,
      contextWindow: 200_000,
      tasksEvaluated: 4_120,
    },
    trend: trend(0.86, 0.012, 0.84, 0.117, 212, 8),
  },
  {
    slug: "claude-opus-4",
    name: "Claude Opus 4",
    vendor: "Anthropic",
    family: "anthropic",
    releaseDate: "2026-01-22",
    tagline: "Maximum reasoning depth.",
    description:
      "Anthropic's flagship model. Slower and more expensive, but ships the highest success rate and the lowest bug density on multi-file refactors.",
    highlights: [
      "Highest aggregate success rate in the field",
      "Excellent at multi-file refactors and tests",
      "Reasoning traces are inspectable and concise",
    ],
    color: "#fb923c",
    kpis: {
      inputTokensPerTask: 9_120,
      outputTokensPerTask: 5_950,
      codeLinesPerTask: 286,
      filesPerTask: 4.1,
      latencyP50Ms: 3_240,
      latencyP95Ms: 7_980,
      successRate: 91.2,
      costPerTaskUsd: 0.286,
      contextWindow: 200_000,
      tasksEvaluated: 2_640,
    },
    trend: trend(0.91, 0.006, 0.9, 0.29, 280, 8),
  },
  {
    slug: "gpt-5-turbo",
    name: "GPT-5 Turbo",
    vendor: "OpenAI",
    family: "openai",
    releaseDate: "2026-03-04",
    tagline: "Fastest frontier model in the cohort.",
    description:
      "OpenAI's low-latency flagship. Trades a bit of code density for raw speed — ideal for in-editor chat flows where every millisecond counts.",
    highlights: [
      "Lowest p50 latency in the frontier tier",
      "Excellent structured output for tool calls",
      "Cost is competitive for the speed class",
    ],
    color: "#22d3ee",
    kpis: {
      inputTokensPerTask: 5_220,
      outputTokensPerTask: 3_410,
      codeLinesPerTask: 178,
      filesPerTask: 2.7,
      latencyP50Ms: 980,
      latencyP95Ms: 2_120,
      successRate: 82.1,
      costPerTaskUsd: 0.092,
      contextWindow: 128_000,
      tasksEvaluated: 5_980,
    },
    trend: trend(0.82, 0.018, 0.81, 0.094, 175, 8),
  },
  {
    slug: "gpt-4.1",
    name: "GPT-4.1",
    vendor: "OpenAI",
    family: "openai",
    releaseDate: "2025-11-19",
    tagline: "Best $/vibe-score in the field.",
    description:
      "OpenAI's value-tuned model. Slightly behind GPT-5 on raw success rate but the best ratio of cost to vibe-score — perfect for high-volume batch workloads.",
    highlights: [
      "Cheapest vibe-coding cost per task in the cohort",
      "Reliable for scaffolding and CRUD generation",
      "Solid context window for mid-sized repos",
    ],
    color: "#38bdf8",
    kpis: {
      inputTokensPerTask: 4_410,
      outputTokensPerTask: 2_980,
      codeLinesPerTask: 162,
      filesPerTask: 2.4,
      latencyP50Ms: 1_120,
      latencyP95Ms: 2_540,
      successRate: 76.8,
      costPerTaskUsd: 0.054,
      contextWindow: 128_000,
      tasksEvaluated: 7_320,
    },
    trend: trend(0.77, 0.022, 0.76, 0.056, 160, 8),
  },
  {
    slug: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    vendor: "Google DeepMind",
    family: "google",
    releaseDate: "2026-02-26",
    tagline: "2M context, big-repo champion.",
    description:
      "Google's long-context model. With a 2M context window it eats monorepos for breakfast; success rate on whole-codebase tasks is unmatched.",
    highlights: [
      "Largest usable context window on the board (2M)",
      "Strongest on whole-codebase navigation tasks",
      "Rapidly improving cost profile since launch",
    ],
    color: "#a3e635",
    kpis: {
      inputTokensPerTask: 11_840,
      outputTokensPerTask: 4_980,
      codeLinesPerTask: 246,
      filesPerTask: 5.2,
      latencyP50Ms: 2_140,
      latencyP95Ms: 5_410,
      successRate: 86.4,
      costPerTaskUsd: 0.142,
      contextWindow: 2_000_000,
      tasksEvaluated: 3_410,
    },
    trend: trend(0.84, 0.026, 0.86, 0.148, 240, 8),
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek V3",
    vendor: "DeepSeek",
    family: "deepseek",
    releaseDate: "2025-12-09",
    tagline: "Open-weights, elite price/perf.",
    description:
      "Open-weights MoE model. Competitive with frontier close-source on success rate while undercutting them on cost by 5–8x.",
    highlights: [
      "Lowest cost per vibe-score on the leaderboard",
      "Open weights — fully self-hostable",
      "Strong on Python and TS code generation",
    ],
    color: "#7c5cff",
    kpis: {
      inputTokensPerTask: 5_980,
      outputTokensPerTask: 3_240,
      codeLinesPerTask: 198,
      filesPerTask: 3.0,
      latencyP50Ms: 1_540,
      latencyP95Ms: 3_880,
      successRate: 81.3,
      costPerTaskUsd: 0.026,
      contextWindow: 128_000,
      tasksEvaluated: 6_140,
    },
    trend: trend(0.81, 0.03, 0.81, 0.027, 196, 8),
  },
  {
    slug: "llama-4-maverick",
    name: "Llama 4 Maverick",
    vendor: "Meta",
    family: "meta",
    releaseDate: "2026-01-08",
    tagline: "Open-weights speed demon.",
    description:
      "Meta's open-weights model with a fast inference profile. Slightly behind on success rate, but unbeatable for self-hosted real-time tools.",
    highlights: [
      "Open weights, Apache-licensed",
      "Excellent latency profile for self-hosted setups",
      "Solid on small/medium scoped tasks",
    ],
    color: "#fb7185",
    kpis: {
      inputTokensPerTask: 4_780,
      outputTokensPerTask: 2_640,
      codeLinesPerTask: 148,
      filesPerTask: 2.1,
      latencyP50Ms: 1_320,
      latencyP95Ms: 2_980,
      successRate: 72.4,
      costPerTaskUsd: 0.041,
      contextWindow: 128_000,
      tasksEvaluated: 4_980,
    },
    trend: trend(0.72, 0.024, 0.72, 0.043, 146, 8),
  },
  {
    slug: "mistral-large-2",
    name: "Mistral Large 2",
    vendor: "Mistral",
    family: "mistral",
    releaseDate: "2025-10-30",
    tagline: "Compact, predictable, EU-friendly.",
    description:
      "Mistral's flagship. Predictable outputs, good multilingual code support, and EU data-residency options make it the default pick for regulated teams.",
    highlights: [
      "Strong multilingual coding support",
      "EU data-residency hosting options",
      "Stable, predictable diffs and refactors",
    ],
    color: "#f472b6",
    kpis: {
      inputTokensPerTask: 5_420,
      outputTokensPerTask: 3_080,
      codeLinesPerTask: 184,
      filesPerTask: 2.6,
      latencyP50Ms: 1_680,
      latencyP95Ms: 3_640,
      successRate: 78.6,
      costPerTaskUsd: 0.072,
      contextWindow: 128_000,
      tasksEvaluated: 3_780,
    },
    trend: trend(0.78, 0.01, 0.79, 0.073, 182, 8),
  },
];

// Build a plausible trend series from a "current" value plus the slope.
function trend(
  startScore: number,
  scoreSlope: number,
  startSuccess: number,
  startCost: number,
  startLines: number,
  weeks: number,
): WeeklyTrend[] {
  const out: WeeklyTrend[] = [];
  for (let i = 0; i < weeks; i++) {
    const t = weeks - 1 - i; // newest first
    out.push({
      week: `W${(50 - t).toString().padStart(2, "0")}`,
      vibeScore: clamp(startScore - scoreSlope * i, 0, 100),
      successRate: clamp(startSuccess - 0.004 * i, 0, 100),
      costPerTaskUsd: clamp(startCost + 0.001 * i, 0.001, 10),
      codeLinesPerTask: Math.round(startLines - 1.5 * i),
    });
  }
  return out.reverse();
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export default models;

export type ModelFamily =
  | "anthropic"
  | "openai"
  | "google"
  | "meta"
  | "mistral"
  | "deepseek"
  | "xai";

export interface KpiBundle {
  inputTokensPerTask: number;
  outputTokensPerTask: number;
  codeLinesPerTask: number;
  filesPerTask: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  successRate: number;
  costPerTaskUsd: number;
  contextWindow: number;
  tasksEvaluated: number;
}

export interface WeeklyTrend {
  week: string; // e.g. "W12"
  vibeScore: number;
  successRate: number;
  costPerTaskUsd: number;
  codeLinesPerTask: number;
}

export interface ModelEntry {
  slug: string;
  name: string;
  vendor: string;
  family: ModelFamily;
  releaseDate: string; // ISO
  tagline: string;
  description: string;
  highlights: string[];
  color: string; // hex accent for badge
  kpis: KpiBundle;
  trend: WeeklyTrend[];
}

export type SortKey =
  | "rank"
  | "vibeScore"
  | "successRate"
  | "costPerTaskUsd"
  | "codeLinesPerTask"
  | "latencyP50Ms"
  | "contextWindow";

export type SortDir = "asc" | "desc";

export interface RankedModel extends ModelEntry {
  vibeScore: number;
  rank: number;
  tier: Tier;
}

export type Tier = "S" | "A" | "B" | "C";

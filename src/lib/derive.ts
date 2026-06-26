import type { ModelEntry, RankedModel, SortDir, SortKey, Tier } from "@/types";
import models from "@/data/seed";

// Weighted "vibe score" 0..100 — success rate matters most, then density of
// code output, then cost and latency as penalties.
//
// Density is normalized against the cohort max so a single low-volume model
// doesn't saturate that axis.
export function computeVibeScore(
  m: ModelEntry,
  cohortMaxes: CohortMaxes = buildCohortMaxes(models),
): number {
  const k = m.kpis;
  const densityBase =
    cohortMaxes.codeLines > 0
      ? (k.codeLinesPerTask / cohortMaxes.codeLines) * 100
      : 0;
  const density = clamp(densityBase);
  const costPenalty = Math.max(0, 60 - k.costPerTaskUsd * 240); // $0.25 ~ 0
  const latencyPenalty = Math.max(0, 60 - k.latencyP50Ms / 80); // 4.8s -> 0
  const contextBoost = Math.min(15, k.contextWindow / 200_000);
  const raw =
    k.successRate * 0.45 +
    density * 0.2 +
    costPenalty * 0.15 +
    latencyPenalty * 0.1 +
    contextBoost * 0.1;
  return Math.round(clamp(raw));
}

interface CohortMaxes {
  codeLines: number;
}

function buildCohortMaxes(list: ModelEntry[]): CohortMaxes {
  return {
    codeLines: Math.max(...list.map((m) => m.kpis.codeLinesPerTask)),
  };
}

export function deriveTier(score: number): Tier {
  if (score >= 88) return "S";
  if (score >= 78) return "A";
  if (score >= 68) return "B";
  return "C";
}

export function rankModels(list: ModelEntry[] = models): RankedModel[] {
  const maxes = buildCohortMaxes(list);
  const enriched = list.map((m) => {
    const vibeScore = computeVibeScore(m, maxes);
    return { ...m, vibeScore, rank: 0, tier: deriveTier(vibeScore) };
  });
  enriched.sort((a, b) => b.vibeScore - a.vibeScore);
  enriched.forEach((m, i) => (m.rank = i + 1));
  return enriched;
}

export function sortModels(
  list: RankedModel[],
  key: SortKey,
  dir: SortDir,
): RankedModel[] {
  const mult = dir === "asc" ? 1 : -1;
  const next = [...list];
  next.sort((a, b) => {
    switch (key) {
      case "rank":
        return (a.rank - b.rank) * mult;
      case "vibeScore":
        return (a.vibeScore - b.vibeScore) * mult;
      case "successRate":
        return (a.kpis.successRate - b.kpis.successRate) * mult;
      case "costPerTaskUsd":
        return (a.kpis.costPerTaskUsd - b.kpis.costPerTaskUsd) * mult;
      case "codeLinesPerTask":
        return (a.kpis.codeLinesPerTask - b.kpis.codeLinesPerTask) * mult;
      case "latencyP50Ms":
        return (a.kpis.latencyP50Ms - b.kpis.latencyP50Ms) * mult;
      case "contextWindow":
        return (a.kpis.contextWindow - b.kpis.contextWindow) * mult;
      default:
        return 0;
    }
  });
  return next;
}

export function findModel(slug: string) {
  return rankModels().find((m) => m.slug === slug);
}

// Aggregate stats used in the dashboard header.
export function fieldStats(list: RankedModel[] = rankModels()) {
  if (list.length === 0) {
    return {
      count: 0,
      avgScore: 0,
      avgSuccess: 0,
      avgCost: 0,
      avgLines: 0,
      avgLatency: 0,
      totalTasks: 0,
    };
  }
  const sum = (sel: (m: RankedModel) => number) =>
    list.reduce((a, m) => a + sel(m), 0);
  return {
    count: list.length,
    avgScore: round(sum((m) => m.vibeScore) / list.length),
    avgSuccess: round(sum((m) => m.kpis.successRate) / list.length),
    avgCost: round(sum((m) => m.kpis.costPerTaskUsd) / list.length, 4),
    avgLines: Math.round(sum((m) => m.kpis.codeLinesPerTask) / list.length),
    avgLatency: Math.round(sum((m) => m.kpis.latencyP50Ms) / list.length),
    totalTasks: sum((m) => m.kpis.tasksEvaluated),
  };
}

// Useful for cards / dashboard lines that show "this row vs field avg".
// Returns a delta where positive == better-for-display.
export function pctVsAverage(
  value: number,
  average: number,
  lowerIsBetter: boolean,
): number {
  if (!average) return 0;
  const diff = ((value - average) / average) * 100;
  return lowerIsBetter ? -diff : diff;
}

function round(n: number, p = 1) {
  const k = Math.pow(10, p);
  return Math.round(n * k) / k;
}

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

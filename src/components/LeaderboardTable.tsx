import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatMs, formatPercent, formatTokens, formatUsd } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScoreBar from "@/components/ScoreBar";
import Sparkline from "@/components/Sparkline";
import ModelBadge from "@/components/ModelBadge";
import type { RankedModel, SortDir, SortKey } from "@/types";
import { fieldStats, pctVsAverage } from "@/lib/derive";

interface LeaderboardTableProps {
  rows: RankedModel[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
}

const COLUMNS: { key: SortKey; label: string; align?: "left" | "right" }[] = [
  { key: "rank", label: "#", align: "left" },
  { key: "vibeScore", label: "Vibe Score", align: "left" },
  { key: "successRate", label: "Success", align: "left" },
  { key: "codeLinesPerTask", label: "Code Output", align: "left" },
  { key: "latencyP50Ms", label: "Speed", align: "left" },
  { key: "costPerTaskUsd", label: "Cost / task", align: "left" },
  { key: "contextWindow", label: "Context", align: "left" },
];

export default function LeaderboardTable({
  rows,
  sortKey,
  sortDir,
  onSort,
}: LeaderboardTableProps) {
  const stats = fieldStats(rows);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground/80">
              {COLUMNS.map((c) => {
                const isActive = sortKey === c.key;
                const ariaSort = isActive
                  ? sortDir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
                return (
                  <th
                    key={c.key}
                    aria-sort={ariaSort}
                    scope="col"
                    className={cn(
                      "px-4 py-3 font-medium border-b border-border/60 whitespace-nowrap",
                      c.align === "right" && "text-right",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={cn(
                        "inline-flex items-center gap-1 hover:text-foreground transition-colors",
                        isActive && "text-foreground",
                      )}
                    >
                      {c.label}
                      {isActive ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th
                scope="col"
                className="px-4 py-3 font-medium border-b border-border/60 whitespace-nowrap text-right"
              >
                Trend
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium border-b border-border/60 whitespace-nowrap text-right"
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m, idx) => {
              const trend = m.trend.map((t) => t.vibeScore);
              const costDelta = pctVsAverage(m.kpis.costPerTaskUsd, stats.avgCost, true);
              const codeDelta = pctVsAverage(m.kpis.codeLinesPerTask, stats.avgLines, false);
              const tokensIn = m.kpis.inputTokensPerTask + m.kpis.outputTokensPerTask;
              return (
                <motion.tr
                  key={m.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.025 }}
                  className="group hover:bg-secondary/40 border-b border-border/40 last:border-b-0"
                >
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex w-8 h-8 rounded-lg items-center justify-center font-display font-bold text-sm",
                          m.rank === 1 &&
                            "bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950",
                          m.rank === 2 &&
                            "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900",
                          m.rank === 3 &&
                            "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950",
                          m.rank > 3 && "bg-secondary text-muted-foreground",
                        )}
                      >
                        {m.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[260px]">
                    <div className="flex items-center gap-3">
                      <ModelBadge model={m} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {m.name}
                          </span>
                          <Badge
                            variant={
                              m.tier === "S"
                                ? "tier"
                                : m.tier === "A"
                                  ? "accent"
                                  : "muted"
                            }
                            className="uppercase tracking-wider"
                          >
                            {m.tier}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {m.vendor}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 max-w-[260px]">
                      <ScoreBar value={m.vibeScore} size="sm" />
                      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
                        {m.vibeScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatPercent(m.kpis.successRate, 1)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {m.kpis.tasksEvaluated.toLocaleString()} tasks
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {m.kpis.codeLinesPerTask} LOC
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {m.kpis.filesPerTask.toFixed(1)} files · {formatTokens(tokensIn)} tok
                      </span>
                      <DeltaPill label="vs avg" value={codeDelta} goodPositive={true} />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatMs(m.kpis.latencyP50Ms)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        p95 {formatMs(m.kpis.latencyP95Ms)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatUsd(m.kpis.costPerTaskUsd)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        per task
                      </span>
                      <DeltaPill label="vs avg" value={costDelta} goodPositive={true} />
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-base font-semibold text-foreground tabular-nums">
                        {formatTokens(m.kpis.contextWindow)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        window
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <Sparkline data={trend} width={120} height={32} />
                  </td>
                  <td className="px-4 py-4 align-middle text-right">
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/models/${m.slug}`}>Open</Link>
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeltaPill({
  value,
  label,
  goodPositive,
}: {
  value: number;
  label: string;
  goodPositive: boolean;
}) {
  const good = goodPositive ? value >= 0 : value <= 0;
  const symbol = value >= 0 ? "▲" : "▼";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums w-fit",
        good
          ? "bg-accent/15 text-accent"
          : "bg-destructive/15 text-destructive",
      )}
      title={`${label} ${value.toFixed(1)}%`}
    >
      {symbol} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

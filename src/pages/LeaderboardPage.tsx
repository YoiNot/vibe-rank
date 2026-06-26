import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpiTile from "@/components/KpiTile";
import LeaderboardTable from "@/components/LeaderboardTable";
import { rankModels, sortModels, fieldStats } from "@/lib/derive";
import { formatMs, formatPercent, formatUsd } from "@/lib/utils";
import type { SortDir, SortKey, Tier } from "@/types";

export default function LeaderboardPage() {
  const all = useMemo(() => rankModels(), []);
  const stats = useMemo(() => fieldStats(all), [all]);

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = all.filter((m) => {
      if (tier !== "all" && m.tier !== tier) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q)
      );
    });
    return sortModels(result, sortKey, sortDir);
  }, [all, query, tier, sortKey, sortDir]);

  function handleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      // Sensible default direction per column.
      const defaultDesc: SortKey[] = ["vibeScore", "successRate", "codeLinesPerTask", "contextWindow"];
      setSortDir(defaultDesc.includes(k) ? "desc" : "asc");
    }
  }

  const tiles = [
    {
      label: "Models ranked",
      value: stats.count,
      hint: "Across 8 frontier model families",
    },
    {
      label: "Avg vibe-score",
      value: stats.avgScore,
      hint: "Weighted, normalised 0–100",
      delta: { value: 1.4, suffix: " /wk", positiveIsGood: true },
    },
    {
      label: "Avg success",
      value: formatPercent(stats.avgSuccess, 1),
      hint: "Tasks passing hidden tests",
      delta: { value: 0.6, suffix: " pp", positiveIsGood: true },
    },
    {
      label: "Avg cost / task",
      value: formatUsd(stats.avgCost),
      hint: "Median across the cohort",
      delta: { value: -3.2, suffix: "%", positiveIsGood: false },
    },
    {
      label: "Avg p50 latency",
      value: formatMs(stats.avgLatency),
      hint: "Time-to-completion",
      delta: { value: -8, suffix: "%", positiveIsGood: false },
    },
  ];

  return (
    <div className="container pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl"
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Leaderboard
        </span>
        <h1 className="mt-1 font-display text-3xl sm:text-5xl font-bold tracking-tight">
          Every vibe-coding model, ranked
        </h1>
        <p className="mt-3 text-muted-foreground">
          Sort by any column. Filter by tier. Click a model for the full KPI
          breakdown, radar comparison and weekly trend.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {tiles.map((t, i) => (
          <KpiTile key={t.label} index={i} {...t} />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models or vendors…"
              className="pl-9"
              aria-label="Search models or vendors"
            />
          </div>
          <Tabs
            value={tier}
            onValueChange={(v) => setTier(v as typeof tier)}
            className="self-start sm:self-auto"
          >
            <TabsList>
              <TabsTrigger value="all">
                <Filter className="w-3 h-3 mr-1" /> All
              </TabsTrigger>
              <TabsTrigger value="S">S tier</TabsTrigger>
              <TabsTrigger value="A">A tier</TabsTrigger>
              <TabsTrigger value="B">B tier</TabsTrigger>
              <TabsTrigger value="C">C tier</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <LeaderboardTable
          rows={filtered}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {all.length} models · refreshed weekly
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> Sort:{" "}
            {sortKey.replace(/([A-Z])/g, " $1").toLowerCase()}
            {sortDir === "asc" ? " ↑" : " ↓"}
          </span>
        </div>
      </div>
    </div>
  );
}

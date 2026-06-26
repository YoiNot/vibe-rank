import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  Code2,
  Coins,
  Gauge,
  Layers,
  ShieldCheck,
  TimerReset,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KpiTile from "@/components/KpiTile";
import ScoreBar from "@/components/ScoreBar";
import Sparkline from "@/components/Sparkline";
import ModelBadge from "@/components/ModelBadge";
import VibeRadar from "@/components/VibeRadar";
import {
  rankModels,
  sortModels,
  findModel,
  fieldStats,
  pctVsAverage,
} from "@/lib/derive";
import {
  cn,
  formatMs,
  formatPercent,
  formatTokens,
  formatUsd,
} from "@/lib/utils";

export default function ModelDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [tab, setTab] = useState<"kpi" | "trend" | "tokens">("kpi");
  const ranked = rankModels();
  const stats = fieldStats(ranked);
  const m = findModel(slug);

  if (!m) {
    return (
      <div className="container pt-20 pb-24 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold">Model not found</h1>
        <p className="text-muted-foreground mt-2">
          No entry exists for{" "}
          <span className="text-foreground font-mono">{slug}</span>.
        </p>
        <Button asChild variant="accent" className="gap-2 mt-6">
          <Link to="/leaderboard">
            <ArrowLeft className="w-4 h-4" /> Back to leaderboard
          </Link>
        </Button>
      </div>
    );
  }

  const baseline = ranked.find((x) => x.slug === "gpt-5-turbo") ?? ranked[0]!;
  const related = sortModels(
    ranked.filter((x) => x.slug !== m.slug),
    "vibeScore",
    "desc",
  ).slice(0, 3);

  const fmtDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const k = m.kpis;
  const costSaved = stats.avgCost - k.costPerTaskUsd;
  const speedFaster = (stats.avgLatency - k.latencyP50Ms) / Math.max(1, stats.avgLatency);
  const successAbove = k.successRate - stats.avgSuccess;
  const promptTokens = k.inputTokensPerTask;
  const completionTokens = k.outputTokensPerTask;

  return (
    <div className="container pt-8 pb-20">
      <Link to="/leaderboard" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="w-3 h-3" /> Leaderboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 grid lg:grid-cols-[1fr_auto] gap-6"
      >
        <div>
          <div className="flex items-start gap-4">
            <ModelBadge model={m} size="lg" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {m.vendor}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {m.name}
              </h1>
              <p className="text-muted-foreground mt-1">{m.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={m.tier === "S" ? "tier" : "accent"}>
                  {m.tier} tier · #{m.rank}
                </Badge>
                <Badge variant="muted" className="gap-1">
                  <CalendarClock className="w-3 h-3" /> Released{" "}
                  {fmtDate.format(new Date(m.releaseDate))}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Layers className="w-3 h-3" /> {formatTokens(k.contextWindow)} context
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Card className="min-w-[260px]">
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Vibe-score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tabular-nums text-gradient">
                {m.vibeScore}
              </span>
              <span className="text-muted-foreground text-sm">/ 100</span>
            </div>
            <div className="mt-3">
              <ScoreBar value={m.vibeScore} />
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Fact label="Success" value={formatPercent(k.successRate, 1)} highlight={successAbove > 0 ? "good" : successAbove < 0 ? "bad" : undefined} hint={`${successAbove >= 0 ? "+" : ""}${successAbove.toFixed(1)} pp vs avg`} />
              <Fact label="Cost / task" value={formatUsd(k.costPerTaskUsd)} highlight={costSaved > 0 ? "good" : costSaved < 0 ? "bad" : undefined} hint={`${costSaved >= 0 ? "−" : "+"}${formatUsd(Math.abs(costSaved))} vs avg`} />
              <Fact label="p50 latency" value={formatMs(k.latencyP50Ms)} highlight={speedFaster > 0 ? "good" : speedFaster < 0 ? "bad" : undefined} hint={`${(speedFaster * 100).toFixed(0)}% vs avg`} />
              <Fact label="Tasks evaluated" value={k.tasksEvaluated.toLocaleString()} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About {m.name}</CardTitle>
            <CardDescription>{m.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
              {m.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-foreground/90">{h}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center text-center">
            <CardTitle>KPI Radar</CardTitle>
            <CardDescription>{m.name} vs {baseline.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <VibeRadar primary={m} compare={baseline} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
          <TabsList>
            <TabsTrigger value="kpi">KPI breakdown</TabsTrigger>
            <TabsTrigger value="trend">Weekly trend</TabsTrigger>
            <TabsTrigger value="tokens">Token &amp; code mix</TabsTrigger>
          </TabsList>

          <TabsContent value="kpi">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              <KpiTile
                label="Code lines / task"
                value={`${k.codeLinesPerTask}`}
                icon={Code2}
                hint={`${k.filesPerTask.toFixed(1)} files generated`}
                delta={{
                  value: pctVsAverage(k.codeLinesPerTask, stats.avgLines, false),
                  suffix: "%",
                }}
              />
              <KpiTile
                label="Input tokens"
                value={formatTokens(promptTokens)}
                icon={Layers}
                hint="average per task"
              />
              <KpiTile
                label="Output tokens"
                value={formatTokens(completionTokens)}
                icon={Sparkles}
                hint="average per task"
              />
              <KpiTile
                label="Success rate"
                value={formatPercent(k.successRate, 1)}
                icon={ShieldCheck}
                delta={{
                  value: pctVsAverage(k.successRate, stats.avgSuccess, false),
                  suffix: "%",
                }}
              />
              <KpiTile
                label="p50 latency"
                value={formatMs(k.latencyP50Ms)}
                icon={TimerReset}
                hint={`p95 ${formatMs(k.latencyP95Ms)}`}
                delta={{
                  value: pctVsAverage(k.latencyP50Ms, stats.avgLatency, true),
                  suffix: "%",
                  positiveIsGood: false,
                }}
              />
              <KpiTile
                label="Cost / task"
                value={formatUsd(k.costPerTaskUsd)}
                icon={Coins}
                delta={{
                  value: pctVsAverage(k.costPerTaskUsd, stats.avgCost, true),
                  suffix: "%",
                  positiveIsGood: false,
                }}
              />
              <KpiTile
                label="Context window"
                value={formatTokens(k.contextWindow)}
                icon={Layers}
              />
              <KpiTile
                label="Tasks evaluated"
                value={k.tasksEvaluated.toLocaleString()}
                icon={Gauge}
                hint="across vibe-coding suite"
              />
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <Card className="mt-4">
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TrendBlock
                  label="Vibe-score"
                  data={m.trend.map((t) => t.vibeScore)}
                  weeks={m.trend.map((t) => t.week)}
                  suffix=""
                  positiveIsGood
                />
                <TrendBlock
                  label="Success rate"
                  data={m.trend.map((t) => t.successRate)}
                  weeks={m.trend.map((t) => t.week)}
                  suffix="%"
                  positiveIsGood
                />
                <TrendBlock
                  label="Code lines / task"
                  data={m.trend.map((t) => t.codeLinesPerTask)}
                  weeks={m.trend.map((t) => t.week)}
                  positiveIsGood
                />
                <TrendBlock
                  label="Cost / task (¢)"
                  data={m.trend.map((t) => +(t.costPerTaskUsd * 100).toFixed(2))}
                  weeks={m.trend.map((t) => t.week)}
                  positiveIsGood={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens">
            <Card className="mt-4">
              <CardContent className="pt-6 grid sm:grid-cols-2 gap-6">
                <TokenBar
                  label="Input tokens / task"
                  primary={promptTokens}
                  compare={baseline.kpis.inputTokensPerTask}
                  unit="tok"
                />
                <TokenBar
                  label="Output tokens / task"
                  primary={completionTokens}
                  compare={baseline.kpis.outputTokensPerTask}
                  unit="tok"
                />
                <TokenBar
                  label="Cost / task"
                  primary={k.costPerTaskUsd}
                  compare={baseline.kpis.costPerTaskUsd}
                  unit="USD"
                  format="usd"
                />
                <TokenBar
                  label="p50 latency"
                  primary={k.latencyP50Ms}
                  compare={baseline.kpis.latencyP50Ms}
                  unit="ms"
                  format="ms"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Related models
          </h2>
          <Link to="/leaderboard" className="text-xs text-muted-foreground hover:text-foreground">
            All models →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((r) => (
            <Link to={`/models/${r.slug}`} key={r.slug}>
              <Card className="hover:border-primary/40 transition-colors h-full">
                <CardContent className="pt-6 flex flex-col gap-3 h-full">
                  <div className="flex items-center gap-3">
                    <ModelBadge model={r} />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">
                        {r.vendor}
                      </div>
                      <div className="font-semibold truncate">{r.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBar value={r.vibeScore} size="sm" />
                    <span className="text-sm font-display font-semibold tabular-nums">
                      {r.vibeScore}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.tagline}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Fact({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: "good" | "bad";
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "font-display font-semibold tabular-nums text-sm",
          highlight === "good" && "text-accent",
          highlight === "bad" && "text-destructive",
        )}
      >
        {value}
      </div>
      {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function TrendBlock({
  label,
  data,
  weeks,
  positiveIsGood,
  suffix,
}: {
  label: string;
  data: number[];
  weeks: string[];
  positiveIsGood: boolean;
  suffix?: string;
}) {
  const first = data[0] ?? 0;
  const last = data[data.length - 1] ?? 0;
  const delta = last - first;
  const good = positiveIsGood ? delta >= 0 : delta <= 0;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={cn(
            "text-xs tabular-nums font-medium",
            good ? "text-accent" : "text-destructive",
          )}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(suffix === "%" ? 1 : 0)}
          {suffix ?? ""}
        </span>
      </div>
      <Sparkline data={data} width={220} height={56} />
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-mono">
        <span>{weeks[0]}</span>
        <span>{weeks[weeks.length - 1]}</span>
      </div>
    </div>
  );
}

function TokenBar({
  label,
  primary,
  compare,
  unit,
  format,
}: {
  label: string;
  primary: number;
  compare: number;
  unit: string;
  format?: "usd" | "ms";
}) {
  const max = Math.max(primary, compare) * 1.15;
  const primaryPct = (primary / max) * 100;
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="space-y-2">
        <Bar
          label={label.includes("latency") || label.includes("p50") ? "p50" : "this model"}
          pct={primaryPct}
          value={
            format === "usd"
              ? formatUsd(primary)
              : format === "ms"
                ? formatMs(primary)
                : formatTokens(primary)
          }
          color="primary"
        />
        <Bar
          label="baseline"
          pct={(compare / max) * 100}
          value={
            format === "usd"
              ? formatUsd(compare)
              : format === "ms"
                ? formatMs(compare)
                : formatTokens(compare)
          }
          color="muted"
        />
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">
        Compared to {unit === "USD" ? "USD per task" : unit}.
      </div>
    </div>
  );
}

function Bar({
  label,
  pct,
  value,
  color,
}: {
  label: string;
  pct: number;
  value: string;
  color: "primary" | "muted";
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-muted-foreground w-24 truncate">
        {label}
      </span>
      <div className="grow h-2 rounded-full bg-secondary/70 overflow-hidden border border-border/40">
        <div
          className={cn(
            "h-full rounded-full",
            color === "primary" &&
              "bg-gradient-to-r from-primary to-accent glow-primary",
            color === "muted" && "bg-muted-foreground/40",
          )}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span className="text-xs font-display font-semibold tabular-nums w-16 text-right">
        {value}
      </span>
    </div>
  );
}

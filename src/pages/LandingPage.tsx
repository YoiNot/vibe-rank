import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Code2,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import KpiTile from "@/components/KpiTile";
import Sparkline from "@/components/Sparkline";
import ScoreBar from "@/components/ScoreBar";
import ModelBadge from "@/components/ModelBadge";
import { rankModels, fieldStats } from "@/lib/derive";
import { formatMs, formatPercent, formatTokens, formatUsd } from "@/lib/utils";

export default function LandingPage() {
  const ranked = rankModels();
  const top = ranked.slice(0, 3);
  const stats = fieldStats(ranked);

  const heroTiles = [
    {
      label: "Models tracked",
      value: ranked.length,
      icon: Layers,
      hint: `${stats.totalTasks.toLocaleString()} vibe-coding tasks evaluated`,
    },
    {
      label: "Avg vibe-score",
      value: stats.avgScore,
      icon: Sparkles,
      hint: "0–100 weighted across success, code, cost, speed, context",
      delta: { value: 1.4, suffix: " /wk", positiveIsGood: true },
    },
    {
      label: "Avg cost / task",
      value: formatUsd(stats.avgCost),
      icon: Coins,
      hint: "Across the cohort, fixed-spec tokens",
      delta: { value: -3.2, suffix: " %", positiveIsGood: false },
    },
    {
      label: "Avg p50 latency",
      value: formatMs(stats.avgLatency),
      icon: Gauge,
      hint: "Median time-to-first-token-free completion",
      delta: { value: -8, suffix: "%", positiveIsGood: false },
    },
  ];

  return (
    <div>
      <section className="container relative pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <Badge variant="accent" className="gap-1.5 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" /> Live
            for week 50 · {ranked.length} models tracked
          </Badge>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            The open leaderboard for{" "}
            <span className="text-gradient">vibe-coding models</span>.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Compare frontier AI coding models on the metrics that actually
            matter for <span className="text-foreground">vibe coding</span> —
            tokens, code output, latency, cost, context and end-to-end task
            success. Updated weekly from open benchmarks.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/leaderboard">
                Open leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#how-it-works">How vibes are scored</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {heroTiles.map((t, i) => (
            <motion.div
              key={t.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <KpiTile {...t} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container pb-24">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              <Trophy className="inline w-5 h-5 text-amber-400 mb-1" /> This
              week's podium
            </h2>
            <p className="text-muted-foreground text-sm">
              Ranked by composite vibe-score. Click any model for the full KPI
              breakdown.
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-1">
            <Link to="/leaderboard">
              Full leaderboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {top.map((m, i) => (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="relative overflow-hidden h-full">
                <div
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-40"
                  style={{ background: m.color }}
                  aria-hidden
                />
                <CardContent className="relative pt-7 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ModelBadge model={m} size="lg" />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {m.vendor}
                        </div>
                        <div className="text-lg font-semibold leading-tight">
                          {m.name}
                        </div>
                      </div>
                    </div>
                    <Badge variant={m.tier === "S" ? "tier" : "accent"}>
                      #{m.rank} · {m.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {m.tagline}
                  </p>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>vibe-score</span>
                      <span className="text-foreground font-display font-bold text-base tabular-nums">
                        {m.vibeScore}
                      </span>
                    </div>
                    <ScoreBar value={m.vibeScore} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Stat
                      label="Success"
                      value={formatPercent(m.kpis.successRate, 0)}
                    />
                    <Stat label="LOC" value={`${m.kpis.codeLinesPerTask}`} />
                    <Stat label="Cost" value={formatUsd(m.kpis.costPerTaskUsd)} />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <Sparkline
                      data={m.trend.map((t) => t.vibeScore)}
                      width={120}
                      height={28}
                    />
                    <Button asChild variant="secondary" size="sm" className="gap-1">
                      <Link to={`/models/${m.slug}`}>
                        Open <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container pb-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              What you actually get to compare
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Every model is scored on the same per-task benchmark suite
              built around realistic vibe-coding tasks — full-feature builds,
              bug fixes, multi-file refactors, and tests.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <KpiDoc
                icon={Code2}
                title="Code output"
                copy="Lines and files written per completed task. Density matters more than raw size — tight diffs that pass tests beat sprawling rewrites."
              />
              <KpiDoc
                icon={Coins}
                title="Tokens"
                copy="Input vs output tokens per task. Watch this alongside cost — cheap tokens can still produce expensive runs."
              />
              <KpiDoc
                icon={ShieldCheck}
                title="Success rate"
                copy="Percentage of tasks that produced a passing diff on first response, against a hidden test suite."
              />
              <KpiDoc
                icon={TimerReset}
                title="Latency"
                copy="Median and p95 wall-clock latency for end-to-end task completion, per identical hardware profile."
              />
            </div>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                How the vibe-score is computed
              </div>
              <Separator />
              <ul className="space-y-3 text-sm">
                <ScoreRow weight={0.45} label="Success rate" />
                <ScoreRow weight={0.2} label="Code density" />
                <ScoreRow weight={0.15} label="Cost efficiency" />
                <ScoreRow weight={0.1} label="Latency efficiency" />
                <ScoreRow weight={0.1} label="Context boost" />
              </ul>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Weights are open and auditable. The score is reset weekly and
                recomputed against the same task pool, so model-vs-model
                comparisons stay apples-to-apples as new releases land.
              </p>
              <Separator />
              <div className="text-[11px] text-muted-foreground">
                <span className="text-foreground font-medium">
                  Field snapshot this week:
                </span>{" "}
                {formatTokens(stats.totalTasks)} tasks · avg success{" "}
                {formatPercent(stats.avgSuccess, 1)} · avg cost{" "}
                {formatUsd(stats.avgCost)}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container pb-28">
        <Card className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(800px circle at 20% 0%, hsl(var(--primary)/.25), transparent 50%), radial-gradient(500px circle at 90% 100%, hsl(var(--accent)/.18), transparent 50%)",
            }}
            aria-hidden
          />
          <CardContent className="relative py-12 flex flex-col items-center text-center gap-5">
            <Badge variant="tier" className="gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Get the full picture
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight max-w-2xl">
              See every model side-by-side, sort by the KPI that matters to
              your shop.
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Filter by tier, sort by cost, latency or context, and drill
              into a model's full KPI breakdown and weekly trend.
            </p>
            <Button asChild size="lg" className="gap-2 mt-2">
              <Link to="/leaderboard">
                Open the leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/40 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-display font-semibold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function KpiDoc({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-4 flex gap-3">
      <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-primary/15 text-primary border border-primary/30 shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {copy}
        </p>
      </div>
    </div>
  );
}

function ScoreRow({ weight, label }: { weight: number; label: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-foreground">{label}</span>
      <div className="flex items-center gap-2 grow">
        <ScoreBar value={weight * 100} size="sm" />
        <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
          {Math.round(weight * 100)}%
        </span>
      </div>
    </li>
  );
}

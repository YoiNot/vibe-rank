import { cn } from "@/lib/utils";
import type { RankedModel } from "@/types";
import { rankModels } from "@/lib/derive";

interface VibeRadarProps {
  primary: RankedModel;
  compare?: RankedModel;
  className?: string;
}

type Axis = { label: string; a: number; b: number };

// Build a 5-axis radar showing success, code density, cost-efficiency,
// speed, and context — each normalized 0..1 against the best in the field.
export default function VibeRadar({ primary, compare, className }: VibeRadarProps) {
  const size = 240;
  const center = size / 2;
  const radius = center - 22;
  const norms = bestExtremes();
  const axes = useAxes(primary, compare, norms);
  const grid = [0.25, 0.5, 0.75, 1];

  const points = (key: "a" | "b") =>
    axes
      .map((ax, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
        const x = center + Math.cos(a) * radius * ax[key];
        const y = center + Math.sin(a) * radius * ax[key];
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("w-full max-w-[280px] h-auto", className)}
      role="img"
      aria-label="KPI radar"
    >
      <defs>
        <linearGradient id="radarA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.65" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="radarB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {grid.map((g) => (
        <polygon
          key={g}
          points={axes
            .map((_, i) => {
              const a = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
              const x = center + Math.cos(a) * radius * g;
              const y = center + Math.sin(a) * radius * g;
              return `${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join(" ")}
          fill="none"
          stroke="hsl(var(--border))"
          strokeOpacity="0.6"
        />
      ))}
      {axes.map((ax, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
        const x = center + Math.cos(a) * radius;
        const y = center + Math.sin(a) * radius;
        return (
          <g key={ax.label}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="hsl(var(--border))"
              strokeOpacity="0.4"
            />
            <text
              x={center + Math.cos(a) * (radius + 14)}
              y={center + Math.sin(a) * (radius + 14)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontFamily="Inter"
              fill="hsl(var(--muted-foreground))"
            >
              {ax.label}
            </text>
          </g>
        );
      })}
      {compare && (
        <polygon
          points={points("b")}
          fill="url(#radarB)"
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity="0.7"
          strokeWidth={1.2}
        />
      )}
      <polygon
        points={points("a")}
        fill="url(#radarA)"
        stroke="hsl(var(--primary))"
        strokeWidth={1.6}
      />
    </svg>
  );
}

function useAxes(
  primary: RankedModel,
  compare: RankedModel | undefined,
  norms: Extremes,
): Axis[] {
  // Higher-is-better: success / code / context → ratio against cohort max.
  // Lower-is-better: cost / latency → ratio of best (min) to primary, clamped.
  const ratio = (raw: number, best: number, invert: boolean) => {
    if (invert) return clamp01(best / Math.max(0.000001, raw));
    return clamp01(raw / Math.max(0.000001, best));
  };

  const primaryAxes: AxisInput[] = [
    { label: "Success", raw: primary.kpis.successRate, best: norms.max.success },
    { label: "Code Δensity", raw: primary.kpis.codeLinesPerTask, best: norms.max.codeLines },
    { label: "Cost savers", raw: primary.kpis.costPerTaskUsd, best: norms.min.cost },
    { label: "Speed", raw: primary.kpis.latencyP50Ms, best: norms.min.latency },
    { label: "Context", raw: primary.kpis.contextWindow, best: norms.max.context },
  ];

  const compareAxes: AxisInput[] | null = compare
    ? [
        { label: "Success", raw: compare.kpis.successRate, best: norms.max.success },
        { label: "Code Δensity", raw: compare.kpis.codeLinesPerTask, best: norms.max.codeLines },
        { label: "Cost savers", raw: compare.kpis.costPerTaskUsd, best: norms.min.cost },
        { label: "Speed", raw: compare.kpis.latencyP50Ms, best: norms.min.latency },
        { label: "Context", raw: compare.kpis.contextWindow, best: norms.max.context },
      ]
    : null;

  return primaryAxes.map((ax, i) => {
    const lowerBetter = i === 2 || i === 3;
    const a = ratio(ax.raw, ax.best, lowerBetter);
    const b =
      compareAxes && compareAxes[i]
        ? ratio(compareAxes[i]!.raw, compareAxes[i]!.best, lowerBetter)
        : 0;
    return { label: ax.label, a, b };
  });
}

interface AxisInput {
  label: string;
  raw: number;
  best: number;
}

interface Extremes {
  max: { success: number; codeLines: number; context: number };
  min: { cost: number; latency: number };
}

function bestExtremes(): Extremes {
  const rows = rankModels();
  const successMax = Math.max(...rows.map((m) => m.kpis.successRate));
  const linesMax = Math.max(...rows.map((m) => m.kpis.codeLinesPerTask));
  const contextMax = Math.max(...rows.map((m) => m.kpis.contextWindow));
  const costMin = Math.min(...rows.map((m) => m.kpis.costPerTaskUsd));
  const latencyMin = Math.min(...rows.map((m) => m.kpis.latencyP50Ms));
  return {
    max: { success: successMax, codeLines: linesMax, context: contextMax },
    min: { cost: costMin, latency: latencyMin },
  };
}

function clamp01(n: number) {
  return Math.max(0.05, Math.min(1, n));
}

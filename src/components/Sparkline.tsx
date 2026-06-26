import { useId } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke,
  className,
}: SparklineProps) {
  const id = useId();
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = Math.max(1, max - min);
  // For a single point, center it horizontally instead of leaving the
  // whole right half blank.
  const stepX = data.length === 1 ? 0 : width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = data.length === 1 ? width / 2 : i * stepX;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });
  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const areaD = `${pathD} L${points[points.length - 1]?.[0] ?? 0},${height} L0,${height} Z`;
  const trend = data[data.length - 1] - data[0];
  const color = stroke ?? (trend >= 0 ? "hsl(var(--accent))" : "hsl(var(--destructive))");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#spark-${id})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1]?.[0] ?? 0}
        cy={points[points.length - 1]?.[1] ?? 0}
        r={2.4}
        fill={color}
      />
    </svg>
  );
}

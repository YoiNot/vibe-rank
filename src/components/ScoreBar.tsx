import { cn } from "@/lib/utils";

export default function ScoreBar({
  value,
  className,
  size = "md",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative w-full rounded-full bg-secondary/80 overflow-hidden border border-border/50",
        size === "sm" ? "h-1.5" : "h-2",
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary to-accent"
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute inset-y-0 left-0 rounded-full opacity-70 blur-[3px] bg-gradient-to-r from-primary to-accent"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

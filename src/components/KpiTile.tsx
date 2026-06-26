import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface KpiTileProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  delta?: { value: number; suffix?: string; positiveIsGood?: boolean };
  hint?: string;
  className?: string;
  index?: number;
}

export default function KpiTile({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  className,
  index = 0,
}: KpiTileProps) {
  const display = typeof value === "number" ? formatNumber(value) : value;
  const good =
    delta && (delta.positiveIsGood ?? true) ? delta.value >= 0 : delta!.value <= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-4 sm:p-5 flex flex-col gap-2 min-w-0",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground tabular-nums">
          {display}
        </span>
        {delta && (
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              good ? "text-accent" : "text-destructive",
            )}
          >
            {delta.value >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(delta.value).toFixed(1)}
            {delta.suffix ?? ""}
          </span>
        )}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

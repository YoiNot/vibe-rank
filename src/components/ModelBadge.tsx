import { cn } from "@/lib/utils";
import type { ModelEntry } from "@/types";

export default function ModelBadge({
  model,
  size = "md",
  className,
}: {
  model: Pick<ModelEntry, "name" | "color" | "family" | "vendor">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = model.name
    .replace(/Claude|GPT|Llama|Mistral|DeepSeek|Gemini/gi, "")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || model.name.slice(0, 1).toUpperCase();

  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : size === "lg" ? "w-12 h-12 text-sm" : "w-9 h-9 text-xs";
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl font-display font-bold text-foreground select-none border border-border/60",
        dim,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${model.color}33, ${model.color}11)`,
        boxShadow: `inset 0 0 0 1px ${model.color}55`,
      }}
      aria-label={model.name}
      title={model.name}
    >
      <span
        className="absolute inset-0 rounded-xl opacity-60"
        style={{
          background: `radial-gradient(circle at 30% 25%, ${model.color}55, transparent 55%)`,
        }}
      />
      <span className="relative">{initials}</span>
    </span>
  );
}

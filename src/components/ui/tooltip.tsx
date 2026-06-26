import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}
export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  return (
    <span className={cn("relative inline-flex group", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 hidden group-hover:block group-focus-within:block whitespace-nowrap rounded-md border border-border/70 bg-card/95 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-xl",
          side === "top"
            ? "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2"
            : "top-[calc(100%+8px)] left-1/2 -translate-x-1/2",
        )}
      >
        {content}
      </span>
    </span>
  );
}

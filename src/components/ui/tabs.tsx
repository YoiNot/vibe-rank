import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  idPrefix: string;
}
const TabsCtx = React.createContext<TabsContextValue | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (v: string) => void;
}
export function Tabs({
  value,
  onValueChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const idPrefix = React.useId().replace(/:/g, "");
  return (
    <TabsCtx.Provider value={{ value, setValue: onValueChange, idPrefix }}>
      <div className={cn("flex flex-col gap-4", className)} {...rest}>
        {children}
      </div>
    </TabsCtx.Provider>
  );
}

export function TabsList({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-secondary/60 border border-border/60 p-1 self-start",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
export function TabsTrigger({
  value,
  className,
  children,
  ...rest
}: TabsTriggerProps) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  const triggerId = `${ctx.idPrefix}-trigger-${value}`;
  const panelId = `${ctx.idPrefix}-panel-${value}`;
  return (
    <button
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={active}
      aria-controls={panelId}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "h-8 px-3.5 text-xs font-medium rounded-lg transition-all",
        active
          ? "bg-primary text-primary-foreground glow-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}
export function TabsContent({
  value,
  className,
  children,
  ...rest
}: TabsContentProps) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx || ctx.value !== value) return null;
  const triggerId = `${ctx.idPrefix}-trigger-${value}`;
  const panelId = `${ctx.idPrefix}-panel-${value}`;
  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={triggerId}
      tabIndex={0}
      className={cn("focus-visible:outline-none", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

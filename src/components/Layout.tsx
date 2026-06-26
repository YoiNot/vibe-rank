import { Link, NavLink, useLocation } from "react-router-dom";
import { Github, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const onLanding = location.pathname === "/";
  return (
    <div className="relative min-h-screen flex flex-col">
      <Background />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/60">
        <div className="container flex items-center justify-between gap-6 h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoMark />
            <span className="font-display font-bold text-base tracking-tight text-foreground">
              vibe<span className="text-gradient">·rank</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <NavTab to="/" label="Overview" />
            <NavTab to="/leaderboard" label="Leaderboard" />
            <Button asChild variant="ghost" size="sm" className="gap-1.5 ml-1">
              <a
                href="https://github.com/YoiNot/vibe-rank"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="w-4 h-4" /> GitHub
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </Button>
          </nav>
          {!onLanding && (
            <Button asChild size="sm" variant="accent" className="gap-1 md:hidden">
              <Link to="/leaderboard">
                <Sparkles className="w-3.5 h-3.5" /> Board
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="relative flex-1">{children}</main>

      <footer className="relative border-t border-border/60 mt-24 py-10">
        <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            <div className="font-medium text-foreground">vibe·rank</div>
            <p>
              The open leaderboard for AI vibe-coding models · MIT licensed ·
              data updated weekly
            </p>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <span>Built with React, Vite, Tailwind &amp; Convex-ready schema</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavTab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      aria-current="page"
      className={({ isActive }) =>
        cn(
          "px-3 py-1.5 rounded-md transition-colors",
          isActive
            ? "text-foreground bg-secondary/70"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
        )
      }
    >
      {label}
    </NavLink>
  );
}

function LogoMark() {
  return (
    <span className="relative inline-flex w-8 h-8 rounded-lg items-center justify-center bg-gradient-to-br from-primary/30 via-accent/25 to-primary/40 border border-border/60">
      <span className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/.7),transparent_55%)]" />
      <span className="relative font-display font-bold text-foreground text-xs">
        v·r
      </span>
    </span>
  );
}

function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_18%_-10%,hsl(var(--primary)/.35),transparent_45%),radial-gradient(circle_at_85%_0%,hsl(var(--accent)/.25),transparent_55%),radial-gradient(circle_at_50%_120%,hsl(140_80%_60%/.15),transparent_45%)]" />
      <div className="absolute inset-0 bg-grid-faint opacity-30" />
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-[120px] animate-pulse-glow" />
      <div className="absolute -bottom-40 -left-24 w-[30rem] h-[30rem] rounded-full bg-accent/15 blur-[140px] animate-[pulse-glow_4.5s_ease-in-out_infinite_1.2s]" />
    </div>
  );
}

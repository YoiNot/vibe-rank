import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container pt-24 pb-32 max-w-2xl text-center">
      <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center bg-secondary/70 border border-border/60 mb-5">
        <Ghost className="w-5 h-5 text-muted-foreground" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
        <span className="text-gradient">404</span> · model not found
      </h1>
      <p className="mt-4 text-muted-foreground">
        That route doesn't exist on the vibe-rank leaderboard. Maybe it was
        deprecated along with the last model's release.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button asChild variant="outline">
          <Link to="/">Back to overview</Link>
        </Button>
        <Button asChild variant="accent">
          <Link to="/leaderboard">Open leaderboard</Link>
        </Button>
      </div>
    </div>
  );
}

import { TrendingUp } from "lucide-react";

export function ScoreCard({ score }: { score: number }) {
  return (
    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-100">Interview Score</p>
          <div className="mt-2 text-5xl font-semibold text-white">{score.toFixed(1)}<span className="text-xl text-slate-400">/10</span></div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
          <TrendingUp />
        </div>
      </div>
    </div>
  );
}

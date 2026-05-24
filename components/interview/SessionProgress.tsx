export function SessionProgress({ current, total = 5 }: { current: number; total?: number }) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Question {current} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

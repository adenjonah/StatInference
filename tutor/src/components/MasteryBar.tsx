import { cn } from "@/lib/utils";

interface MasteryBarProps {
  label: string;
  score: number; // 0-100
  weight?: number; // for displaying weight on right
  className?: string;
}

export function MasteryBar({ label, score, weight, className }: MasteryBarProps) {
  const pct = Math.max(0, Math.min(100, score));
  const tone = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="w-40 truncate text-sm">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className={cn("h-full transition-all", tone)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
        {Math.round(pct)}%
      </span>
      {weight !== undefined && (
        <span className="w-12 text-right text-xs tabular-nums text-neutral-500">
          {(weight * 100).toFixed(0)}% wt
        </span>
      )}
    </div>
  );
}

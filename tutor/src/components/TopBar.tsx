import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Mastery } from "@/lib/types";

interface TopBarProps {
  currentDay?: string;
  mastery?: Mastery;
}

export function TopBar({ currentDay, mastery }: TopBarProps) {
  const overall =
    mastery && Object.keys(mastery).length > 0
      ? Object.values(mastery).reduce((a, b) => a + b, 0) / Object.keys(mastery).length
      : 0;

  const examDate = new Date("2026-05-15");
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-tight">
          StatInf Tutor
        </Link>
        {currentDay && <Badge variant="default">Day {currentDay}</Badge>}
        <Badge variant="warning">{daysLeft}d to exam</Badge>
        <div className="flex-1" />
        {mastery !== undefined && (
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Mastery: <strong className="tabular-nums">{Math.round(overall)}%</strong>
          </span>
        )}
        <Link href="/reports" className="text-sm text-neutral-600 hover:underline dark:text-neutral-400">
          Reports
        </Link>
      </div>
    </header>
  );
}

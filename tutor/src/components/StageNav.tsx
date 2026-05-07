"use client";

import Link from "next/link";
import { CheckCircle2, Lock, BookOpen, FileQuestion, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StageManifest, StageProgress } from "@/lib/types";

interface StageNavProps {
  manifest: StageManifest;
  progress: Record<string, StageProgress | null>;
  diagnosticDone: boolean;
  currentStageId?: string | null;
}

export function StageNav({ manifest, progress, diagnosticDone, currentStageId }: StageNavProps) {
  const groupBy: Record<string, typeof manifest.stages> = { "1": [], "2": [], "3": [] };
  for (const s of manifest.stages) {
    if (s.kind === "diagnostic") continue;
    groupBy[s.day].push(s);
  }

  const diagnosticStage = manifest.stages.find(s => s.kind === "diagnostic");

  return (
    <nav className="space-y-6 text-sm">
      {diagnosticStage && (
        <Link
          href={`/diagnostic`}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
            currentStageId === diagnosticStage.id
              ? "bg-blue-100 font-medium dark:bg-blue-950"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            diagnosticDone && "text-neutral-500"
          )}
        >
          <ClipboardList className="h-4 w-4" />
          <span className="flex-1 truncate">Diagnostic</span>
          {diagnosticDone && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </Link>
      )}

      {(["1", "2", "3"] as const).map(day => (
        <div key={day}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Day {day}
          </h3>
          <ul className="space-y-1">
            {groupBy[day].map(s => {
              const p = progress[s.id];
              const isComplete = p?.state === "complete";
              const isUnlocked = isStageUnlockedSimple(s.id, manifest, progress, diagnosticDone);
              const isCurrent = currentStageId === s.id;
              const Icon = s.kind === "exam" ? FileQuestion : BookOpen;
              return (
                <li key={s.id}>
                  <Link
                    href={s.kind === "exam" ? `/exam/${s.id.replace("exam-", "")}` : `/stages/${s.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                      isCurrent && "bg-blue-100 font-medium dark:bg-blue-950",
                      !isUnlocked && "pointer-events-none opacity-50",
                      !isCurrent && isUnlocked && "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    {!isUnlocked ? (
                      <Lock className="h-4 w-4 text-neutral-400" />
                    ) : isComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icon className="h-4 w-4 text-neutral-500" />
                    )}
                    <span className="flex-1 truncate">{s.title}</span>
                    {p?.bestScore !== null && p?.bestScore !== undefined && (
                      <span className="text-xs tabular-nums text-neutral-500">
                        {Math.round(p.bestScore)}%
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function isStageUnlockedSimple(
  stageId: string,
  manifest: StageManifest,
  progress: Record<string, StageProgress | null>,
  diagnosticDone: boolean
): boolean {
  const stage = manifest.stages.find(s => s.id === stageId);
  if (!stage) return false;
  if (stage.kind === "diagnostic") return true;
  if (!diagnosticDone) return false;
  if (stage.prereqIds.length === 0) return true;
  return stage.prereqIds.every(pid => {
    if (pid === "diagnostic") return diagnosticDone;
    return progress[pid]?.state === "complete";
  });
}

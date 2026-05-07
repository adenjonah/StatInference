"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExamRunner } from "@/components/ExamRunner";
import type { ExamFile } from "@/lib/types";

type ExamRecord = {
  startedAt?: string;
  elapsedSeconds?: number;
  answers?: Record<string, string>;
  submitted?: boolean;
  totalScore?: number | null;
  partGrades?: Record<string, { score: number; maxPoints: number; reasoning: string }>;
};

const KEY = (variantId: string) => `examState:final-${variantId}`;

export function ExamClient({ exam }: { exam: ExamFile }) {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<ExamRecord>({});
  const router = useRouter();

  // Hydrate from localStorage. Use a microtask to defer setState off the
  // effect's synchronous body (React 19 lint rule: react-hooks/set-state-in-effect).
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const raw = localStorage.getItem(KEY(exam.variantId));
      if (raw) {
        try {
          setState(JSON.parse(raw));
        } catch {/* ignore */}
      }
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [exam.variantId]);

  const persist = useCallback((next: ExamRecord) => {
    localStorage.setItem(KEY(exam.variantId), JSON.stringify(next));
  }, [exam.variantId]);

  if (!loaded) {
    return <p className="text-sm text-neutral-500">Loading exam state...</p>;
  }

  if (state.submitted && state.totalScore !== undefined && state.totalScore !== null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{exam.title} — submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Score: <strong>{Math.round(state.totalScore ?? 0)}/{exam.totalPoints}</strong>
          </p>
          {state.partGrades && Object.keys(state.partGrades).length > 0 && (
            <details>
              <summary className="cursor-pointer">Show per-part feedback</summary>
              <div className="mt-2 space-y-2">
                {Object.entries(state.partGrades).map(([k, g]) => (
                  <div key={k} className="rounded border border-neutral-200 p-3 dark:border-neutral-800">
                    <div className="font-mono text-xs">{k}</div>
                    <div className="text-sm">{g.score}/{g.maxPoints} — {g.reasoning}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={() => { localStorage.removeItem(KEY(exam.variantId)); setState({}); }}>
              Reset & retake
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ExamRunner
      exam={exam}
      initialAnswers={state.answers ?? {}}
      initialElapsed={state.elapsedSeconds ?? 0}
      onSave={({ answers, elapsedSeconds }) => {
        const next = { ...state, answers, elapsedSeconds, startedAt: state.startedAt ?? new Date().toISOString() };
        setState(next);
        persist(next);
      }}
      onSubmit={async (answers) => {
        // Grade each problem-part via /api/grade. Compute total score.
        const partGrades: Record<string, { score: number; maxPoints: number; reasoning: string }> = {};
        let totalScore = 0;

        for (const p of exam.problems) {
          if (p.parts.length === 0) {
            const key = `p${p.num}-main`;
            const ans = (answers[key] ?? "").trim();
            if (!ans) {
              partGrades[key] = { score: 0, maxPoints: p.points, reasoning: "no answer" };
              continue;
            }
            try {
              const res = await fetch("/api/grade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  questionId: `${exam.variantId}-${key}`,
                  questionPrompt: p.prompt,
                  modelAnswer: "",
                  rubric: `Award up to ${p.points} points based on correctness and justification.`,
                  studentAnswer: ans,
                  conceptId: "exam",
                }),
              });
              const json = await res.json();
              const pct = json.data?.score ?? 0;
              const earned = (pct / 100) * p.points;
              partGrades[key] = { score: earned, maxPoints: p.points, reasoning: json.data?.reasoning ?? "" };
              totalScore += earned;
            } catch {
              partGrades[key] = { score: 0, maxPoints: p.points, reasoning: "grading failed" };
            }
          } else {
            for (const part of p.parts) {
              const key = `p${p.num}-${part.label.replace(/[()]/g, "")}`;
              const ans = (answers[key] ?? "").trim();
              if (!ans) {
                partGrades[key] = { score: 0, maxPoints: part.points, reasoning: "no answer" };
                continue;
              }
              try {
                const res = await fetch("/api/grade", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    questionId: `${exam.variantId}-${key}`,
                    questionPrompt: `${p.prompt}\n\n${part.label} (${part.points} pts) ${part.prompt}`,
                    modelAnswer: part.modelAnswer ?? "",
                    rubric: `Award up to ${part.points} points based on correctness and justification of part ${part.label}.`,
                    studentAnswer: ans,
                    conceptId: "exam",
                  }),
                });
                const json = await res.json();
                const pct = json.data?.score ?? 0;
                const earned = (pct / 100) * part.points;
                partGrades[key] = { score: earned, maxPoints: part.points, reasoning: json.data?.reasoning ?? "" };
                totalScore += earned;
              } catch {
                partGrades[key] = { score: 0, maxPoints: part.points, reasoning: "grading failed" };
              }
            }
          }
        }

        const next: ExamRecord = {
          ...state,
          answers,
          submitted: true,
          totalScore,
          partGrades,
        };
        setState(next);
        persist(next);
      }}
    />
  );
}

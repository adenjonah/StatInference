"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MCQuiz } from "@/components/MCQuiz";
import type { QuizFile, StageMeta } from "@/lib/types";

export function DiagnosticClient({ quiz, stage }: { quiz: QuizFile; stage: StageMeta }) {
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; score: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onComplete(r: {
    correct: number;
    total: number;
    responses: Record<string, string>;
    conceptsCorrect: string[];
    conceptsMissed: string[];
  }) {
    setDone(true);
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/progress?op=save-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: "diagnostic",
          topicIds: stage.topicIds,
          mcCorrect: r.correct,
          mcTotal: r.total,
          saScores: [],
          conceptsCorrect: r.conceptsCorrect,
          conceptsMissed: r.conceptsMissed,
          mcResponses: r.responses,
          saGrades: {},
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error ?? "save failed");
      setResult({ correct: r.correct, total: r.total, score: json.data.score });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (done && result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            You got <strong>{result.correct} / {result.total}</strong> correct ({Math.round(result.score)}%).
            Your weak areas have been recorded.
          </p>
          {saving && <p className="text-sm text-neutral-500">Saving progress...</p>}
          {err && <p className="text-sm text-red-600">Save error: {err}</p>}
          <div className="flex gap-2">
            <Button onClick={() => router.push("/stages/d1-notation")}>Start Day 1: Notation</Button>
            <Button variant="outline" onClick={() => router.push("/")}>Back to dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <MCQuiz questions={quiz.mc} onComplete={onComplete} showReview={true} />;
}

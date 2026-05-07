"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import type { GradeResponse, SAQuestion } from "@/lib/types";
import { MarkdownReader } from "./MarkdownReader";

interface SAGrade extends GradeResponse {
  answer: string;
}

interface ShortAnswerQuizProps {
  questions: SAQuestion[];
  onComplete: (result: {
    avgScore: number;
    grades: Record<string, SAGrade>;
    conceptsCorrect: string[];
    conceptsMissed: string[];
  }) => void;
  context?: string;
}

export function ShortAnswerQuiz({ questions, onComplete, context }: ShortAnswerQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, SAGrade>>({});
  const [grading, setGrading] = useState<string | null>(null); // questionId being graded
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitAll = async () => {
    for (const q of questions) {
      if (grades[q.id]) continue;
      const ans = answers[q.id]?.trim() ?? "";
      if (!ans) {
        setErrors(prev => ({ ...prev, [q.id]: "Please write an answer first." }));
        continue;
      }
      setGrading(q.id);
      setErrors(prev => ({ ...prev, [q.id]: "" }));
      try {
        const res = await fetch("/api/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: q.id,
            questionPrompt: q.prompt,
            modelAnswer: q.modelAnswer,
            rubric: q.rubric,
            studentAnswer: ans,
            conceptId: q.conceptId,
            context,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.data) throw new Error(json.error ?? "Grading failed");
        setGrades(prev => ({ ...prev, [q.id]: { ...json.data, answer: ans } }));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Grading failed";
        setErrors(prev => ({ ...prev, [q.id]: msg }));
      }
    }
    setGrading(null);

    // After all graded, fire onComplete
    setTimeout(() => {
      const finalGrades = { ...grades };
      questions.forEach(q => {
        if (!finalGrades[q.id] && answers[q.id]) {
          // pull from latest state via closure capture; safe because setGrades has fired
        }
      });
    }, 0);
  };

  const finalize = () => {
    const gradeArr = Object.values(grades);
    if (gradeArr.length === 0) return;
    const avg = gradeArr.reduce((a, g) => a + g.score, 0) / gradeArr.length;
    const conceptsCorrect: string[] = [];
    const conceptsMissed: string[] = [];
    for (const q of questions) {
      const g = grades[q.id];
      if (!g) continue;
      // Threshold: ≥70 → concept correct, otherwise missed
      if (g.score >= 70) conceptsCorrect.push(q.conceptId);
      else conceptsMissed.push(q.conceptId);
      conceptsCorrect.push(...g.conceptsCorrect);
      conceptsMissed.push(...g.conceptsMissing);
    }
    onComplete({
      avgScore: avg,
      grades,
      conceptsCorrect: Array.from(new Set(conceptsCorrect)),
      conceptsMissed: Array.from(new Set(conceptsMissed)),
    });
  };

  const allGraded = questions.every(q => grades[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const grade = grades[q.id];
        const err = errors[q.id];
        return (
          <div key={q.id} className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">Question {qi + 1}</h3>
              <Badge variant="neutral">{q.difficulty}</Badge>
            </div>
            <div className="mb-4">
              <MarkdownReader source={q.prompt} />
            </div>
            <Textarea
              value={answers[q.id] ?? ""}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder="Write your answer. Justify each step."
              rows={6}
              disabled={!!grade || grading === q.id}
            />
            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            {grade && (
              <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={grade.score >= 80 ? "success" : grade.score >= 60 ? "warning" : "danger"}>
                    Score: {Math.round(grade.score)}/100
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Reasoning:</strong> {grade.reasoning}
                  </div>
                  {grade.modelAnswerDiff && (
                    <div>
                      <strong>Diff vs model:</strong>
                      <div className="mt-1">
                        <MarkdownReader source={grade.modelAnswerDiff} />
                      </div>
                    </div>
                  )}
                  {grade.conceptsCorrect.length > 0 && (
                    <div className="text-xs">
                      <strong>Concepts correct:</strong> {grade.conceptsCorrect.join(", ")}
                    </div>
                  )}
                  {grade.conceptsMissing.length > 0 && (
                    <div className="text-xs">
                      <strong>Concepts missing:</strong> {grade.conceptsMissing.join(", ")}
                    </div>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium">Show model answer</summary>
                    <div className="mt-2 rounded bg-neutral-100 p-3 dark:bg-neutral-900">
                      <MarkdownReader source={q.modelAnswer} />
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!allGraded ? (
        <div className="flex items-center justify-end">
          <Button onClick={submitAll} disabled={grading !== null}>
            {grading ? "Grading..." : "Grade my answers"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <Button onClick={finalize}>Continue</Button>
        </div>
      )}
    </div>
  );
}

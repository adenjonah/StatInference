"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MCQuestion } from "@/lib/types";
import { MarkdownReader } from "./MarkdownReader";

interface MCQuizProps {
  questions: MCQuestion[];
  onComplete: (result: {
    correct: number;
    total: number;
    responses: Record<string, string>; // questionId -> chosen choiceId
    conceptsCorrect: string[];
    conceptsMissed: string[];
  }) => void;
  showReview?: boolean;
}

export function MCQuiz({ questions, onComplete, showReview = true }: MCQuizProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every(q => responses[q.id] !== undefined);

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    const conceptsCorrect: string[] = [];
    const conceptsMissed: string[] = [];
    for (const q of questions) {
      const chosen = responses[q.id];
      const isRight = q.choices.find(c => c.id === chosen)?.isCorrect;
      if (isRight) {
        correct++;
        conceptsCorrect.push(q.conceptId);
      } else {
        conceptsMissed.push(q.conceptId);
      }
    }
    onComplete({
      correct,
      total: questions.length,
      responses,
      conceptsCorrect,
      conceptsMissed,
    });
  };

  const select = (qId: string, choiceId: string) => {
    if (submitted) return;
    setResponses(prev => ({ ...prev, [qId]: choiceId }));
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen = responses[q.id];
        return (
          <div key={q.id} className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold">
                Question {qi + 1}
              </h3>
              <Badge variant="neutral">{q.difficulty}</Badge>
            </div>
            <div className="mb-4">
              <MarkdownReader source={q.prompt} />
            </div>
            <div className="space-y-2">
              {q.choices.map(c => {
                const isSelected = chosen === c.id;
                const showCorrect = submitted && c.isCorrect;
                const showWrong = submitted && isSelected && !c.isCorrect;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => select(q.id, c.id)}
                    disabled={submitted}
                    className={cn(
                      "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      isSelected && !submitted && "border-blue-500 bg-blue-50 dark:bg-blue-950",
                      showCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                      showWrong && "border-red-500 bg-red-50 dark:bg-red-950",
                      !isSelected && !submitted && "border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                      submitted && !isSelected && !c.isCorrect && "opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-xs uppercase text-neutral-500">{c.id})</span>
                      <div className="flex-1">
                        <MarkdownReader source={c.text} />
                        {submitted && showReview && c.rationale && (
                          <p className="mt-2 text-xs italic text-neutral-600 dark:text-neutral-400">
                            <MarkdownReader source={c.rationale} />
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {Object.keys(responses).length}/{questions.length} answered
          </span>
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Submit answers
          </Button>
        </div>
      )}
    </div>
  );
}

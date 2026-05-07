"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { MarkdownReader } from "./MarkdownReader";
import type { ExamFile } from "@/lib/types";

interface ExamRunnerProps {
  exam: ExamFile;
  initialAnswers?: Record<string, string>;
  initialElapsed?: number;
  onSave: (state: { answers: Record<string, string>; elapsedSeconds: number }) => void;
  onSubmit: (answers: Record<string, string>) => Promise<void>;
}

function partKey(probNum: number, partLabel: string): string {
  return `p${probNum}-${partLabel.replace(/[()]/g, "")}`;
}

export function ExamRunner({ exam, initialAnswers = {}, initialElapsed = 0, onSave, onSubmit }: ExamRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [elapsed, setElapsed] = useState(initialElapsed);
  const [running, setRunning] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Tick timer
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running]);

  // Periodic save (every 30s)
  useEffect(() => {
    const id = setInterval(() => {
      onSave({ answers, elapsedSeconds: elapsed });
    }, 30000);
    return () => clearInterval(id);
  }, [answers, elapsed, onSave]);

  const totalSeconds = exam.timeMinutes * 60;
  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const overtime = elapsed > totalSeconds;
  const totalProblems = exam.problems.length;
  const answeredCount = Object.values(answers).filter(v => v.trim().length > 0).length;

  async function handleSubmit() {
    if (submitting) return;
    if (!confirm(`Submit exam ${exam.variantId}? (${answeredCount} parts answered, ${Math.floor(elapsed / 60)}m elapsed)`)) return;
    setSubmitting(true);
    setRunning(false);
    try {
      await onSubmit(answers);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <h1 className="text-xl font-semibold">{exam.title}</h1>
        <div className="flex-1" />
        <Badge variant="neutral">{answeredCount} parts answered</Badge>
        <Badge variant={overtime ? "danger" : remaining < 300 ? "warning" : "default"}>
          {overtime ? "+" : ""}
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </Badge>
        <Button onClick={() => setRunning(r => !r)} variant="outline" size="sm">
          {running ? "Pause" : "Resume"}
        </Button>
      </div>

      <details className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
        <summary className="cursor-pointer font-medium">Quantile table (click to view)</summary>
        <div className="mt-3 text-sm">
          <MarkdownReader source={exam.quantileTable} />
        </div>
      </details>

      {exam.problems.map(p => (
        <section key={p.num} className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <header className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500">{p.section}</div>
              <h2 className="text-lg font-semibold">
                Problem {p.num}: {p.title}
              </h2>
            </div>
            <Badge variant="neutral">{p.points} pts</Badge>
          </header>
          <div className="mb-4">
            <MarkdownReader source={p.prompt} />
          </div>

          {p.parts.length === 0 ? (
            <Textarea
              value={answers[partKey(p.num, "main")] ?? ""}
              onChange={e => setAnswers(prev => ({ ...prev, [partKey(p.num, "main")]: e.target.value }))}
              rows={6}
              placeholder="Your answer (justify each step)..."
            />
          ) : (
            <div className="space-y-4">
              {p.parts.map(part => {
                const key = partKey(p.num, part.label);
                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center gap-2">
                      <strong>{part.label}</strong>
                      <span className="text-xs text-neutral-500">({part.points} pts)</span>
                    </div>
                    <div className="mb-2 text-sm">
                      <MarkdownReader source={part.prompt} />
                    </div>
                    <Textarea
                      value={answers[key] ?? ""}
                      onChange={e => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                      rows={4}
                      placeholder={`Answer for ${part.label}...`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}

      <div className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {answeredCount} / {totalProblems} problems with at least one answer
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onSave({ answers, elapsedSeconds: elapsed })}>
            Save progress
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit exam"}
          </Button>
        </div>
      </div>
    </div>
  );
}

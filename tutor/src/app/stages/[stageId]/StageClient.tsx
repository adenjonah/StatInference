"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownReader } from "@/components/MarkdownReader";
import { MCQuiz } from "@/components/MCQuiz";
import { ShortAnswerQuiz } from "@/components/ShortAnswerQuiz";
import { cn } from "@/lib/utils";
import type { GradeResponse, QuizFile, StageMeta } from "@/lib/types";

type Tab = "reading" | "mc" | "sa";

interface StageClientProps {
  stage: StageMeta;
  content: string | null;
  quiz: QuizFile | null;
}

interface SAGrade extends GradeResponse {
  answer: string;
}

interface MCResult {
  correct: number;
  total: number;
  responses: Record<string, string>;
  conceptsCorrect: string[];
  conceptsMissed: string[];
}

interface SAResult {
  avgScore: number;
  grades: Record<string, SAGrade>;
  conceptsCorrect: string[];
  conceptsMissed: string[];
}

export function StageClient({ stage, content, quiz }: StageClientProps) {
  const [tab, setTab] = useState<Tab>("reading");
  const [mcResult, setMcResult] = useState<MCResult | null>(null);
  const [saResult, setSaResult] = useState<SAResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedScore, setSavedScore] = useState<{ score: number; passed: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function saveAttempt() {
    if (!mcResult && !saResult) return;
    setSaving(true);
    setErr(null);
    try {
      const conceptsCorrect = [
        ...(mcResult?.conceptsCorrect ?? []),
        ...(saResult?.conceptsCorrect ?? []),
      ];
      const conceptsMissed = [
        ...(mcResult?.conceptsMissed ?? []),
        ...(saResult?.conceptsMissed ?? []),
      ];
      const saGrades: Record<string, { score: number; reasoning: string; conceptsCorrect: string[]; conceptsMissing: string[]; modelAnswerDiff: string; answer: string; gradedAt: string }> = {};
      if (saResult) {
        const now = new Date().toISOString();
        for (const [qid, g] of Object.entries(saResult.grades)) {
          saGrades[qid] = {
            score: g.score,
            reasoning: g.reasoning,
            conceptsCorrect: g.conceptsCorrect,
            conceptsMissing: g.conceptsMissing,
            modelAnswerDiff: g.modelAnswerDiff,
            answer: g.answer,
            gradedAt: now,
          };
        }
      }
      const res = await fetch("/api/progress?op=save-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: stage.id,
          topicIds: stage.topicIds,
          mcCorrect: mcResult?.correct ?? 0,
          mcTotal: mcResult?.total ?? 0,
          saScores: saResult ? Object.values(saResult.grades).map(g => g.score) : [],
          conceptsCorrect,
          conceptsMissed,
          mcResponses: mcResult?.responses ?? {},
          saGrades,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error ?? "save failed");
      setSavedScore({ score: json.data.score, passed: json.data.passed });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <nav className="mb-4 flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
        <TabButton active={tab === "reading"} onClick={() => setTab("reading")}>Reading</TabButton>
        {quiz && quiz.mc.length > 0 && (
          <TabButton active={tab === "mc"} onClick={() => setTab("mc")}>
            Multiple choice
            {mcResult && <Badge variant={mcResult.correct / mcResult.total >= 0.8 ? "success" : "warning"} className="ml-2">{mcResult.correct}/{mcResult.total}</Badge>}
          </TabButton>
        )}
        {quiz && quiz.sa.length > 0 && (
          <TabButton active={tab === "sa"} onClick={() => setTab("sa")}>
            Short answer
            {saResult && <Badge variant={saResult.avgScore >= 80 ? "success" : "warning"} className="ml-2">{Math.round(saResult.avgScore)}%</Badge>}
          </TabButton>
        )}
      </nav>

      {tab === "reading" && (
        <div>
          {content ? (
            <Card>
              <CardContent className="py-6">
                <MarkdownReader source={content} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle>No reading content</CardTitle></CardHeader>
              <CardContent className="text-sm">
                This stage doesn&apos;t have a content file. Use the tutor chat (button bottom right) to discuss.
              </CardContent>
            </Card>
          )}
          {quiz && (quiz.mc.length > 0 || quiz.sa.length > 0) && (
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setTab(quiz.mc.length > 0 ? "mc" : "sa")}>
                Start quiz →
              </Button>
            </div>
          )}
        </div>
      )}

      {tab === "mc" && quiz && (
        <MCQuiz
          questions={quiz.mc}
          onComplete={r => setMcResult(r)}
          showReview
        />
      )}

      {tab === "sa" && quiz && (
        <ShortAnswerQuiz
          questions={quiz.sa}
          onComplete={r => setSaResult(r)}
          context={content?.slice(0, 4000)}
        />
      )}

      {(mcResult || saResult) && tab !== "reading" && !savedScore && (
        <div className="mt-6 flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-sm">
            {mcResult && `${mcResult.correct}/${mcResult.total} MC correct`}
            {mcResult && saResult && " · "}
            {saResult && `${Math.round(saResult.avgScore)}% on short-answer`}
          </span>
          <Button onClick={saveAttempt} disabled={saving}>
            {saving ? "Saving..." : "Save & finish stage"}
          </Button>
        </div>
      )}

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {savedScore && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{savedScore.passed ? "✓ Passed" : "Below threshold"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Stage score: <strong>{Math.round(savedScore.score)}%</strong>
              {savedScore.passed
                ? " — you've cleared the 80% gate."
                : " — below the 80% gate. Review the reading and try again."}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")}>Back to dashboard</Button>
              {savedScore.passed && (
                <Button variant="outline" onClick={() => router.refresh()}>Refresh stage</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-blue-600 text-blue-600 dark:text-blue-400"
          : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      )}
    >
      {children}
    </button>
  );
}

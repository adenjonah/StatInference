import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/TopBar";
import { TutorChat } from "@/components/TutorChat";
import { StageClient } from "./StageClient";
import { loadManifest, loadQuestions, loadStageContent } from "@/lib/content-loader";
import { notFound } from "next/navigation";

export default async function StagePage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const { stageId } = await params;
  const manifest = await loadManifest().catch(() => null);
  if (!manifest) return <Notice title="Manifest missing" />;

  const stage = manifest.stages.find(s => s.id === stageId);
  if (!stage) notFound();

  const content = stage.contentFile
    ? await loadStageContent(stage.contentFile).catch(() => null)
    : null;
  const quiz = stage.questionsFile
    ? await loadQuestions(stage.questionsFile).catch(() => null)
    : null;

  return (
    <>
      <TopBar currentDay={stage.day} />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-neutral-500">Day {stage.day}</div>
            <h1 className="text-2xl font-semibold tracking-tight">{stage.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              {stage.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="neutral">~{stage.estimatedMinutes} min</Badge>
            <Badge variant="default">{stage.topicIds.length} topics</Badge>
          </div>
        </header>

        <StageClient stage={stage} content={content} quiz={quiz} />

        <div className="mt-10 flex justify-between text-sm">
          <Link href="/" className="underline">← Dashboard</Link>
          {stage.prereqIds.length > 0 && (
            <span className="text-neutral-500">Prereqs: {stage.prereqIds.join(", ")}</span>
          )}
        </div>
      </main>
      <TutorChat stageId={stage.id} />
    </>
  );
}

function Notice({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <Link href="/" className="underline">← Dashboard</Link>
        </CardContent>
      </Card>
    </main>
  );
}

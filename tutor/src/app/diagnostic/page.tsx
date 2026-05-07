import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopBar } from "@/components/TopBar";
import { DiagnosticClient } from "./DiagnosticClient";
import { loadManifest, loadQuestions } from "@/lib/content-loader";

export default async function DiagnosticPage() {
  const manifest = await loadManifest().catch(() => null);
  const quiz = await loadQuestions("diagnostic.json").catch(() => null);

  if (!manifest) {
    return <Notice title="Manifest missing" body="Couldn't load data/stages.json." />;
  }
  if (!quiz) {
    return (
      <Notice
        title="Diagnostic not seeded yet"
        body={
          <>
            Run <code>pnpm seed-questions</code> to generate quizzes, or hand-curate a JSON file at{" "}
            <code>data/questions/diagnostic.json</code> matching the QuizFile schema.
          </>
        }
      />
    );
  }

  const stage = manifest.stages.find(s => s.id === "diagnostic");
  if (!stage) return <Notice title="Diagnostic stage missing" body="No stage with id 'diagnostic' in manifest." />;

  return (
    <>
      <TopBar currentDay="1" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Diagnostic Placement Quiz</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            ~30 minutes. {quiz.mc.length} multiple-choice questions covering all topics. Used to calibrate weak areas.
          </p>
        </header>
        <DiagnosticClient quiz={quiz} stage={stage} />
      </main>
    </>
  );
}

function Notice({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>{body}</div>
          <Link href="/" className="underline">← Back to dashboard</Link>
        </CardContent>
      </Card>
    </main>
  );
}

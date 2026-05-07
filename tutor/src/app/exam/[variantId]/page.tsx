import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopBar } from "@/components/TopBar";
import { ExamClient } from "./ExamClient";
import { loadExam } from "@/lib/content-loader";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ variantId: string }>;
}) {
  const { variantId } = await params;
  const exam = await loadExam(`final-${variantId}.json`).catch(() => null);

  if (!exam) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Card>
          <CardHeader><CardTitle>Exam {variantId} not found</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Could not load <code>data/exams/final-{variantId}.json</code>.
              Make sure the parser script ran successfully.
            </p>
            <Link href="/" className="underline">← Dashboard</Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <>
      <TopBar currentDay="3" />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <ExamClient exam={exam} />
      </main>
    </>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { DashboardClient } from "./DashboardClient";
import { loadManifest } from "@/lib/content-loader";

export default async function Home() {
  const manifest = await loadManifest().catch(() => null);

  if (!manifest) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">StatInf Tutor — setup needed</h1>
        <p className="mt-3 text-sm text-neutral-600">
          The stage manifest at <code>data/stages.json</code> could not be loaded. Make sure
          the file exists and is valid JSON.
        </p>
      </main>
    );
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome, Jonah.</h1>
          <Badge variant="warning">Final 2026-05-15</Badge>
        </header>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Day 1 — Foundations</CardTitle>
              <CardDescription>Notation, prob review, MLE, MoM</CardDescription>
            </CardHeader>
            <CardContent>
              {manifest.stages.filter(s => s.day === "1" && s.kind === "reading").length} stages, ~8h
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Day 2 — Theory</CardTitle>
              <CardDescription>Sufficiency, Bayesian, CIs, Cramer-Rao</CardDescription>
            </CardHeader>
            <CardContent>
              {manifest.stages.filter(s => s.day === "2" && s.kind === "reading").length} stages, ~8h
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Day 3 — HT + Mocks</CardTitle>
              <CardDescription>Hypothesis testing, then 5 mock finals</CardDescription>
            </CardHeader>
            <CardContent>
              {manifest.stages.filter(s => s.day === "3").length} stages incl. {manifest.stages.filter(s => s.kind === "exam").length} mocks, ~8h
            </CardContent>
          </Card>
        </div>

        <DashboardClient manifest={manifest} />

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Start here</CardTitle>
              <CardDescription>30-min placement quiz to calibrate weak areas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/diagnostic"><Button>Take diagnostic</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Flashcards</CardTitle>
              <CardDescription>T/F + definitions + theorem statements for rapid review.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/flashcards"><Button variant="outline">Open deck</Button></Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mock final</CardTitle>
              <CardDescription>Variant E is the most-likely prediction of Baydil&apos;s final.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/exam/E"><Button variant="outline">Open variant E</Button></Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}

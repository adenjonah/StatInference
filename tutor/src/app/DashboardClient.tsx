"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MasteryBar } from "@/components/MasteryBar";
import { masteryByGroup } from "@/lib/adaptive";
import type { Mastery, Profile, StageManifest, WeakAreas } from "@/lib/types";

interface SummaryData {
  profile: Profile | null;
  mastery: Mastery;
  weakAreas: WeakAreas;
  topWeak: { conceptId: string; weight: number }[];
}

export function DashboardClient({ manifest }: { manifest: StageManifest }) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress?op=summary")
      .then(r => r.json())
      .then(j => {
        if (j.data) setSummary(j.data);
        else setError(j.error ?? "no data");
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Card><CardContent className="py-6 text-sm text-neutral-500">Loading progress...</CardContent></Card>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KV not configured</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-neutral-700 dark:text-neutral-300">
            Couldn&apos;t load progress: <code>{error}</code>
          </p>
          <p>
            Make sure <code>KV_REST_API_URL</code> and <code>KV_REST_API_TOKEN</code> are set in
            <code> .env.local</code>. Provision Upstash Redis via the Vercel Marketplace.
          </p>
          <p>
            Once configured, click below to initialize your profile.
          </p>
          <Button onClick={initProfile}>Initialize profile</Button>
        </CardContent>
      </Card>
    );
  }

  if (!summary?.profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set up your profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">No profile yet. Click below to start.</p>
          <Button onClick={initProfile}>Initialize profile</Button>
        </CardContent>
      </Card>
    );
  }

  const groupScores = masteryByGroup(summary.mastery, manifest);
  const groupLabels: Record<string, string> = {
    foundations: "Foundations (notation, prob, convergence)",
    theory: "Theory (MLE, sufficiency, Bayesian)",
    "hypothesis-testing": "Hypothesis testing (40-45% of exam)",
    "confidence-intervals": "Confidence intervals (15-18%)",
    "cramer-rao": "Cramer-Rao / Fisher info (10-12%)",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mastery by area</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(groupLabels).map(([id, label]) => (
          <MasteryBar key={id} label={label} score={groupScores[id] ?? 0} />
        ))}
        {summary.topWeak.length > 0 && (
          <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-sm font-semibold">Top weak concepts</h4>
            <ul className="space-y-1 text-sm">
              {summary.topWeak.map(w => (
                <li key={w.conceptId} className="flex justify-between">
                  <span>{w.conceptId.replace(/-/g, " ")}</span>
                  <span className="tabular-nums text-neutral-600 dark:text-neutral-400">w {w.weight.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {summary.profile.currentStageId && (
          <div className="mt-6">
            <Link href={summary.profile.currentStageId.startsWith("exam-") ? `/exam/${summary.profile.currentStageId.replace("exam-", "")}` : `/stages/${summary.profile.currentStageId}`}>
              <Button>Continue: {summary.profile.currentStageId}</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function initProfile() {
  const res = await fetch("/api/progress?op=init-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Jonah" }),
  });
  if (res.ok) window.location.reload();
  else alert("Failed to init profile: " + (await res.text()));
}

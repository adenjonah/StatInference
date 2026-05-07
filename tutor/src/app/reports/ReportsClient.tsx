"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MasteryBar } from "@/components/MasteryBar";
import type { DailyReport, Mastery, Profile, WeakAreas } from "@/lib/types";

interface SummaryData {
  profile: Profile | null;
  mastery: Mastery;
  weakAreas: WeakAreas;
  topWeak: { conceptId: string; weight: number }[];
  reports: DailyReport[];
}

export function ReportsClient() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/progress?op=summary")
      .then(r => r.json())
      .then(j => {
        if (j.data) setData(j.data);
        else setErr(j.error ?? "no data");
      })
      .catch(e => setErr(String(e)));
  }, []);

  if (err) return <Card><CardContent className="py-6 text-sm text-red-600">Error: {err}</CardContent></Card>;
  if (!data) return <Card><CardContent className="py-6 text-sm">Loading...</CardContent></Card>;

  const sortedTopics = Object.entries(data.mastery).sort(([, a], [, b]) => a - b);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mastery by topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedTopics.length === 0 ? (
            <p className="text-sm text-neutral-500">No data yet — take the diagnostic to start.</p>
          ) : (
            sortedTopics.map(([id, score]) => (
              <MasteryBar key={id} label={id.replace(/-/g, " ")} score={score} />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 weak concepts</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topWeak.length === 0 ? (
            <p className="text-sm text-neutral-500">No weak areas tracked yet.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {data.topWeak.map(w => (
                <li key={w.conceptId} className="flex justify-between">
                  <span>{w.conceptId.replace(/-/g, " ")}</span>
                  <span className="tabular-nums text-neutral-600 dark:text-neutral-400">w {w.weight.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily reports</CardTitle>
        </CardHeader>
        <CardContent>
          {data.reports.length === 0 ? (
            <p className="text-sm text-neutral-500">None logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.reports.map((r, i) => (
                <li key={i} className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                  <div className="text-xs text-neutral-500">Day {r.day} — {r.date}</div>
                  <p className="mt-1 text-sm">{r.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

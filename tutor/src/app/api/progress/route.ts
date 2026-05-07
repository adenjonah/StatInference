import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  appendDailyReport,
  getDailyReports,
  getMastery,
  getProfile,
  getStageProgress,
  getWeakAreas,
  setMastery,
  setProfile,
  setStageProgress,
  setWeakAreas,
  smokeTest,
} from "@/lib/kv";
import {
  computeStageScore,
  topWeakAreas,
  updateMastery,
  updateWeakAreas,
} from "@/lib/adaptive";
import {
  MasterySchema,
  ProfileSchema,
  StageProgressSchema,
  WeakAreasSchema,
} from "@/lib/types";

export const runtime = "nodejs";

const SaveAttemptSchema = z.object({
  stageId: z.string(),
  topicIds: z.array(z.string()),
  mcCorrect: z.number(),
  mcTotal: z.number(),
  saScores: z.array(z.number()),
  conceptsCorrect: z.array(z.string()),
  conceptsMissed: z.array(z.string()),
  mcResponses: z.record(z.string(), z.string()).default({}),
  saGrades: StageProgressSchema.shape.saGrades.default({}),
});

export async function GET(req: NextRequest) {
  const op = req.nextUrl.searchParams.get("op");

  if (op === "smoke") {
    const result = await smokeTest();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  }

  if (op === "summary") {
    try {
      const [profile, mastery, weakAreas, reports] = await Promise.all([
        getProfile(),
        getMastery(),
        getWeakAreas(),
        getDailyReports(),
      ]);
      return NextResponse.json({
        data: {
          profile,
          mastery,
          weakAreas,
          topWeak: topWeakAreas(weakAreas, 5),
          reports: reports.slice(-7),
        },
      });
    } catch (e: unknown) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "kv error" }, { status: 500 });
    }
  }

  if (op === "stage") {
    const stageId = req.nextUrl.searchParams.get("stageId");
    if (!stageId) return NextResponse.json({ error: "stageId required" }, { status: 400 });
    try {
      const progress = await getStageProgress(stageId);
      return NextResponse.json({ data: progress });
    } catch (e: unknown) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "kv error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown op" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const op = req.nextUrl.searchParams.get("op");
  const body: unknown = await req.json().catch(() => ({}));

  try {
    if (op === "init-profile") {
      const profile = ProfileSchema.parse({
        ...(body as object),
        startedAt: new Date().toISOString(),
        currentStageId: null,
        totalStudyMinutes: 0,
        diagnosticDone: false,
      });
      await setProfile(profile);
      return NextResponse.json({ data: profile });
    }

    if (op === "set-mastery") {
      const parsed = MasterySchema.parse(body);
      await setMastery(parsed);
      return NextResponse.json({ data: parsed });
    }

    if (op === "set-weak-areas") {
      const parsed = WeakAreasSchema.parse(body);
      await setWeakAreas(parsed);
      return NextResponse.json({ data: parsed });
    }

    if (op === "save-attempt") {
      const attempt = SaveAttemptSchema.parse(body);
      const score = computeStageScore({
        mcCorrect: attempt.mcCorrect,
        mcTotal: attempt.mcTotal,
        saScores: attempt.saScores,
      });
      const passed = score >= 80;

      const [prevProgress, prevMastery, prevWeak, profile] = await Promise.all([
        getStageProgress(attempt.stageId),
        getMastery(),
        getWeakAreas(),
        getProfile(),
      ]);

      const isFirstAttempt = !prevProgress || prevProgress.attempts === 0;
      const newMastery = updateMastery({
        current: prevMastery,
        topicIds: attempt.topicIds,
        stageScore: score,
        isFirstAttempt,
      });
      const newWeak = updateWeakAreas({
        current: prevWeak,
        conceptsMissed: attempt.conceptsMissed,
        conceptsCorrect: attempt.conceptsCorrect,
      });

      const nextProgress = StageProgressSchema.parse({
        state: passed ? "complete" : "in_progress",
        bestScore: Math.max(prevProgress?.bestScore ?? 0, score),
        attempts: (prevProgress?.attempts ?? 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        conceptsMissed: attempt.conceptsMissed,
        mcResponses: attempt.mcResponses,
        saGrades: attempt.saGrades,
      });

      await Promise.all([
        setStageProgress(attempt.stageId, nextProgress),
        setMastery(newMastery),
        setWeakAreas(newWeak),
      ]);

      // Update profile on diagnostic completion
      if (attempt.stageId === "diagnostic" && profile) {
        await setProfile({
          ...profile,
          diagnosticDone: true,
          currentStageId: profile.currentStageId ?? "d1-notation",
        });
      }

      return NextResponse.json({
        data: {
          score,
          passed,
          progress: nextProgress,
          mastery: newMastery,
          weakAreas: newWeak,
        },
      });
    }

    if (op === "set-current-stage") {
      const { stageId } = z.object({ stageId: z.string() }).parse(body);
      const profile = await getProfile();
      if (!profile) return NextResponse.json({ error: "no profile" }, { status: 400 });
      await setProfile({ ...profile, currentStageId: stageId });
      return NextResponse.json({ data: { currentStageId: stageId } });
    }

    if (op === "log-report") {
      const report = z.object({
        date: z.string(),
        day: z.string(),
        summary: z.string(),
        weakAreas: z.array(z.object({ conceptId: z.string(), weight: z.number() })),
        recommendedReading: z.array(z.string()),
        masterySnapshot: MasterySchema,
      }).parse(body);
      await appendDailyReport(report);
      return NextResponse.json({ data: { ok: true } });
    }

    return NextResponse.json({ error: "Unknown op" }, { status: 400 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

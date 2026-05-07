import { Mastery, StageManifest, StageProgress, WeakAreas } from "./types";
import { clamp } from "./utils";

export const MASTERY_THRESHOLD = 80;

/**
 * Compute the weighted mastery score for a stage attempt.
 * MC contributes 60%, SA contributes 40%.
 */
export function computeStageScore(args: {
  mcCorrect: number;
  mcTotal: number;
  saScores: number[]; // 0-100 each
}): number {
  const mcPct = args.mcTotal === 0 ? 0 : (args.mcCorrect / args.mcTotal) * 100;
  const saAvg = args.saScores.length === 0
    ? 0
    : args.saScores.reduce((a, b) => a + b, 0) / args.saScores.length;
  if (args.mcTotal === 0) return saAvg;
  if (args.saScores.length === 0) return mcPct;
  return mcPct * 0.6 + saAvg * 0.4;
}

/**
 * Update mastery vector after a stage attempt.
 * Uses exponential moving average so later attempts dominate.
 */
export function updateMastery(args: {
  current: Mastery;
  topicIds: string[];
  stageScore: number;
  isFirstAttempt: boolean;
}): Mastery {
  const next: Mastery = { ...args.current };
  const alpha = args.isFirstAttempt ? 1.0 : 0.6; // re-attempts blend
  for (const topic of args.topicIds) {
    const prev = next[topic] ?? 0;
    next[topic] = clamp(alpha * args.stageScore + (1 - alpha) * prev, 0, 100);
  }
  return next;
}

/**
 * Bump weak-area weights for missed concepts.
 * Each miss adds 1.0 (capped at 20). Concepts not missed decay 5% so old
 * weak areas fade as Jonah improves.
 */
export function updateWeakAreas(args: {
  current: WeakAreas;
  conceptsMissed: string[];
  conceptsCorrect: string[];
}): WeakAreas {
  const next: WeakAreas = {};
  for (const [k, v] of Object.entries(args.current)) {
    next[k] = v * 0.95; // decay
  }
  for (const c of args.conceptsCorrect) {
    next[c] = (next[c] ?? 0) * 0.7; // bigger decay if explicitly correct
  }
  for (const c of args.conceptsMissed) {
    next[c] = clamp((next[c] ?? 0) + 1, 0, 20);
  }
  // drop near-zero
  for (const [k, v] of Object.entries(next)) {
    if (v < 0.05) delete next[k];
  }
  return next;
}

/**
 * Pick the top-N weakest concepts (highest weight).
 */
export function topWeakAreas(w: WeakAreas, n = 5): { conceptId: string; weight: number }[] {
  return Object.entries(w)
    .map(([conceptId, weight]) => ({ conceptId, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}

/**
 * Decide whether a stage is unlocked given prereqs.
 * A stage with no prereqs is always unlocked. Otherwise all prereqs must be complete.
 */
export function isStageUnlocked(args: {
  stageId: string;
  manifest: StageManifest;
  progress: Record<string, StageProgress | null>;
}): boolean {
  const stage = args.manifest.stages.find(s => s.id === args.stageId);
  if (!stage) return false;
  if (stage.prereqIds.length === 0) return true;
  return stage.prereqIds.every(pid => args.progress[pid]?.state === "complete");
}

/**
 * Decide if a stage attempt passed the gate.
 */
export function passedGate(score: number): boolean {
  return score >= MASTERY_THRESHOLD;
}

/**
 * Pick the recommended next stage given progress + manifest.
 */
export function nextRecommendedStage(args: {
  manifest: StageManifest;
  progress: Record<string, StageProgress | null>;
  diagnosticDone: boolean;
}): string | null {
  if (!args.diagnosticDone) return "diagnostic";
  for (const stage of args.manifest.stages) {
    if (stage.kind === "diagnostic") continue;
    const p = args.progress[stage.id];
    if (!p || p.state !== "complete") {
      if (isStageUnlocked({ stageId: stage.id, manifest: args.manifest, progress: args.progress })) {
        return stage.id;
      }
    }
  }
  return null;
}

/**
 * Aggregate mastery into "topic group" averages for the dashboard.
 * Groups: foundations, theory, hypothesis-testing.
 */
export function masteryByGroup(m: Mastery, manifest: StageManifest): Record<string, number> {
  const groupMap: Record<string, string[]> = {
    foundations: [],
    theory: [],
    "hypothesis-testing": [],
    "confidence-intervals": [],
    "cramer-rao": [],
  };
  for (const t of manifest.topics) {
    if (t.id.startsWith("ht-")) groupMap["hypothesis-testing"].push(t.id);
    else if (t.id.startsWith("ci-")) groupMap["confidence-intervals"].push(t.id);
    else if (t.id.startsWith("cr-")) groupMap["cramer-rao"].push(t.id);
    else if (["mle", "mom", "sufficiency", "bayesian", "sampling-distributions", "estimation-principles"].some(p => t.id.includes(p))) {
      groupMap.theory.push(t.id);
    } else {
      groupMap.foundations.push(t.id);
    }
  }
  const out: Record<string, number> = {};
  for (const [grp, ids] of Object.entries(groupMap)) {
    if (ids.length === 0) {
      out[grp] = 0;
      continue;
    }
    const scores = ids.map(id => m[id] ?? 0);
    out[grp] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  return out;
}

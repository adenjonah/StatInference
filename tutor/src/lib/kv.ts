import { Redis } from "@upstash/redis";
import {
  ChatMessage,
  DailyReport,
  ExamState,
  Mastery,
  Profile,
  StageProgress,
  WeakAreas,
} from "./types";

const USER_ID = process.env.USER_ID ?? "jonah";

let _redis: Redis | null = null;

/**
 * Returns a singleton Upstash Redis client.
 * Throws if KV env vars are missing.
 */
export function kv(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "KV_REST_API_URL / KV_REST_API_TOKEN missing — provision Upstash Redis via Vercel Marketplace and add to .env.local"
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}

// Keys
const k = {
  profile: () => `user:${USER_ID}:profile`,
  mastery: () => `user:${USER_ID}:mastery`,
  weakAreas: () => `user:${USER_ID}:weakAreas`,
  stage: (stageId: string) => `user:${USER_ID}:stage:${stageId}`,
  gradeCache: (hash: string) => `user:${USER_ID}:gradeCache:${hash}`,
  dailyReports: () => `user:${USER_ID}:dailyReports`,
  chat: (stageId: string) => `user:${USER_ID}:chat:${stageId}`,
  exam: (variantId: string) => `user:${USER_ID}:exam:${variantId}`,
};

// ----- Profile -----

export async function getProfile(): Promise<Profile | null> {
  return (await kv().get<Profile>(k.profile())) ?? null;
}

export async function setProfile(p: Profile): Promise<void> {
  await kv().set(k.profile(), p);
}

// ----- Mastery -----

export async function getMastery(): Promise<Mastery> {
  return (await kv().get<Mastery>(k.mastery())) ?? {};
}

export async function setMastery(m: Mastery): Promise<void> {
  await kv().set(k.mastery(), m);
}

// ----- WeakAreas -----

export async function getWeakAreas(): Promise<WeakAreas> {
  return (await kv().get<WeakAreas>(k.weakAreas())) ?? {};
}

export async function setWeakAreas(w: WeakAreas): Promise<void> {
  await kv().set(k.weakAreas(), w);
}

// ----- Stage progress -----

export async function getStageProgress(stageId: string): Promise<StageProgress | null> {
  return (await kv().get<StageProgress>(k.stage(stageId))) ?? null;
}

export async function setStageProgress(stageId: string, p: StageProgress): Promise<void> {
  await kv().set(k.stage(stageId), p);
}

export async function listStageProgress(stageIds: string[]): Promise<Record<string, StageProgress | null>> {
  if (stageIds.length === 0) return {};
  const keys = stageIds.map(k.stage);
  const results = await kv().mget<StageProgress[]>(...keys);
  const out: Record<string, StageProgress | null> = {};
  stageIds.forEach((id, i) => {
    out[id] = (results?.[i] as StageProgress | null) ?? null;
  });
  return out;
}

// ----- Grade cache -----

export async function getCachedGrade<T = unknown>(hash: string): Promise<T | null> {
  return (await kv().get<T>(k.gradeCache(hash))) ?? null;
}

export async function setCachedGrade<T = unknown>(hash: string, value: T): Promise<void> {
  // Cache for 30 days
  await kv().set(k.gradeCache(hash), value, { ex: 60 * 60 * 24 * 30 });
}

// ----- Daily reports -----

export async function getDailyReports(): Promise<DailyReport[]> {
  return (await kv().get<DailyReport[]>(k.dailyReports())) ?? [];
}

export async function appendDailyReport(report: DailyReport): Promise<void> {
  const existing = await getDailyReports();
  await kv().set(k.dailyReports(), [...existing, report]);
}

// ----- Chat -----

export async function getChatThread(stageId: string): Promise<ChatMessage[]> {
  return (await kv().get<ChatMessage[]>(k.chat(stageId))) ?? [];
}

export async function appendChatMessage(stageId: string, msg: ChatMessage): Promise<void> {
  const existing = await getChatThread(stageId);
  // Cap at 40 messages
  const next = [...existing, msg].slice(-40);
  await kv().set(k.chat(stageId), next);
}

// ----- Exam state -----

export async function getExamState(variantId: string): Promise<ExamState | null> {
  return (await kv().get<ExamState>(k.exam(variantId))) ?? null;
}

export async function setExamState(variantId: string, state: ExamState): Promise<void> {
  await kv().set(k.exam(variantId), state);
}

// ----- Smoke test -----

export async function smokeTest(): Promise<{ ok: boolean; error?: string }> {
  try {
    const key = `__smoke__:${Date.now()}`;
    await kv().set(key, "hello", { ex: 60 });
    const got = await kv().get<string>(key);
    await kv().del(key);
    if (got !== "hello") return { ok: false, error: `read mismatch: ${got}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

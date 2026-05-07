import { promises as fs } from "node:fs";
import path from "node:path";
import {
  ExamFile,
  ExamFileSchema,
  QuizFile,
  QuizFileSchema,
  StageManifest,
  StageManifestSchema,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

let _manifest: StageManifest | null = null;

export async function loadManifest(): Promise<StageManifest> {
  if (_manifest) return _manifest;
  const raw = await fs.readFile(path.join(DATA_DIR, "stages.json"), "utf8");
  _manifest = StageManifestSchema.parse(JSON.parse(raw));
  return _manifest;
}

export async function loadStageContent(filename: string): Promise<string> {
  const p = path.join(DATA_DIR, "content", filename);
  return fs.readFile(p, "utf8");
}

export async function loadQuestions(filename: string): Promise<QuizFile | null> {
  const p = path.join(DATA_DIR, "questions", filename);
  try {
    const raw = await fs.readFile(p, "utf8");
    return QuizFileSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function loadExam(filename: string): Promise<ExamFile | null> {
  const p = path.join(DATA_DIR, "exams", filename);
  try {
    const raw = await fs.readFile(p, "utf8");
    return ExamFileSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

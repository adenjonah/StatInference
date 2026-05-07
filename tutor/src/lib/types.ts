import { z } from "zod";

// ----- Stage manifest -----

export const StageDayEnum = z.enum(["1", "2", "3"]);

export const StageKindEnum = z.enum(["diagnostic", "reading", "exam"]);

export const StageMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  day: StageDayEnum,
  kind: StageKindEnum,
  estimatedMinutes: z.number(),
  topicIds: z.array(z.string()),
  sourceChunks: z.array(z.string()), // file basenames in chunks/
  contentFile: z.string().optional(), // markdown file in data/content/
  questionsFile: z.string().optional(), // JSON file in data/questions/
  examFile: z.string().optional(), // JSON file in data/exams/ (for exam kind)
  description: z.string(),
  prereqIds: z.array(z.string()).default([]),
});
export type StageMeta = z.infer<typeof StageMetaSchema>;

export const StageManifestSchema = z.object({
  topics: z.array(z.object({
    id: z.string(),
    name: z.string(),
    weight: z.number(), // exam weight (0–1)
  })),
  stages: z.array(StageMetaSchema),
});
export type StageManifest = z.infer<typeof StageManifestSchema>;

// ----- Questions -----

export const MCChoiceSchema = z.object({
  id: z.string(), // "a", "b", "c", "d"
  text: z.string(),
  isCorrect: z.boolean(),
  rationale: z.string().optional(),
});

export const MCQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("mc"),
  prompt: z.string(),
  choices: z.array(MCChoiceSchema),
  conceptId: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});
export type MCQuestion = z.infer<typeof MCQuestionSchema>;

export const SAQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("sa"),
  prompt: z.string(),
  modelAnswer: z.string(),
  rubric: z.string(),
  conceptId: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});
export type SAQuestion = z.infer<typeof SAQuestionSchema>;

export const QuestionSchema = z.discriminatedUnion("type", [
  MCQuestionSchema,
  SAQuestionSchema,
]);
export type Question = z.infer<typeof QuestionSchema>;

export const QuizFileSchema = z.object({
  stageId: z.string(),
  generatedAt: z.string(),
  mc: z.array(MCQuestionSchema),
  sa: z.array(SAQuestionSchema),
});
export type QuizFile = z.infer<typeof QuizFileSchema>;

// ----- Exams -----

export const ExamPartSchema = z.object({
  label: z.string(), // "(a)", "(b)", ...
  points: z.number(),
  prompt: z.string(),
  modelAnswer: z.string().optional(),
});

export const ExamProblemSchema = z.object({
  num: z.number(),
  title: z.string(),
  points: z.number(),
  prompt: z.string(), // overall problem stem
  parts: z.array(ExamPartSchema),
  section: z.string(), // "Part A", "Part B", "Part C"
});
export type ExamProblem = z.infer<typeof ExamProblemSchema>;

export const ExamFileSchema = z.object({
  variantId: z.string(), // "A", "B", ...
  title: z.string(),
  totalPoints: z.number(),
  timeMinutes: z.number(),
  quantileTable: z.string(), // markdown
  problems: z.array(ExamProblemSchema),
});
export type ExamFile = z.infer<typeof ExamFileSchema>;

// ----- Persisted KV state -----

export const ProfileSchema = z.object({
  name: z.string().default("Jonah"),
  startedAt: z.string(),
  currentStageId: z.string().nullable(),
  totalStudyMinutes: z.number().default(0),
  diagnosticDone: z.boolean().default(false),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const MasterySchema = z.record(z.string(), z.number().min(0).max(100));
export type Mastery = z.infer<typeof MasterySchema>;

export const WeakAreasSchema = z.record(z.string(), z.number().min(0).max(20));
export type WeakAreas = z.infer<typeof WeakAreasSchema>;

export const StageStateEnum = z.enum(["locked", "unlocked", "in_progress", "complete"]);

export const StageProgressSchema = z.object({
  state: StageStateEnum,
  bestScore: z.number().nullable().default(null),
  attempts: z.number().default(0),
  lastAttemptAt: z.string().optional(),
  conceptsMissed: z.array(z.string()).default([]),
  mcResponses: z.record(z.string(), z.string()).default({}), // questionId -> chosen choiceId
  saGrades: z.record(z.string(), z.object({
    score: z.number(),
    reasoning: z.string(),
    conceptsCorrect: z.array(z.string()),
    conceptsMissing: z.array(z.string()),
    modelAnswerDiff: z.string(),
    answer: z.string(),
    gradedAt: z.string(),
  })).default({}),
});
export type StageProgress = z.infer<typeof StageProgressSchema>;

export const ExamStateSchema = z.object({
  variantId: z.string(),
  startedAt: z.string(),
  elapsedSeconds: z.number().default(0),
  answers: z.record(z.string(), z.string()).default({}), // partKey -> answer text
  submitted: z.boolean().default(false),
  totalScore: z.number().nullable().default(null),
  partGrades: z.record(z.string(), z.object({
    score: z.number(),
    maxPoints: z.number(),
    reasoning: z.string(),
  })).default({}),
});
export type ExamState = z.infer<typeof ExamStateSchema>;

export const DailyReportSchema = z.object({
  date: z.string(),
  day: z.string(), // "1", "2", "3"
  summary: z.string(),
  weakAreas: z.array(z.object({ conceptId: z.string(), weight: z.number() })),
  recommendedReading: z.array(z.string()),
  masterySnapshot: MasterySchema,
});
export type DailyReport = z.infer<typeof DailyReportSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  ts: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ----- Grading API -----

export const GradeRequestSchema = z.object({
  questionId: z.string(),
  questionPrompt: z.string(),
  modelAnswer: z.string(),
  rubric: z.string(),
  studentAnswer: z.string(),
  conceptId: z.string(),
  context: z.string().optional(), // stage context, optional
});
export type GradeRequest = z.infer<typeof GradeRequestSchema>;

export const GradeResponseSchema = z.object({
  score: z.number().min(0).max(100),
  reasoning: z.string(),
  conceptsCorrect: z.array(z.string()),
  conceptsMissing: z.array(z.string()),
  modelAnswerDiff: z.string(),
});
export type GradeResponse = z.infer<typeof GradeResponseSchema>;

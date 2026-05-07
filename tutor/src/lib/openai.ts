import OpenAI from "openai";

let _client: OpenAI | null = null;

export function openai(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY missing — add it to .env.local");
  }
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export const MODELS = {
  grader: process.env.MODEL_GRADER ?? "gpt-4o",
  generator: process.env.MODEL_GENERATOR ?? "gpt-4o-mini",
  chat: process.env.MODEL_CHAT ?? "gpt-4o",
};

// JSON schema for the grader response (used with response_format).
export const GRADE_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    reasoning: { type: "string" },
    conceptsCorrect: { type: "array", items: { type: "string" } },
    conceptsMissing: { type: "array", items: { type: "string" } },
    modelAnswerDiff: { type: "string" },
  },
  required: ["score", "reasoning", "conceptsCorrect", "conceptsMissing", "modelAnswerDiff"],
} as const;

// JSON schema for question seeding.
export const SEED_QUIZ_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    mc: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          prompt: { type: "string" },
          choices: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                isCorrect: { type: "boolean" },
                rationale: { type: "string" },
              },
              required: ["id", "text", "isCorrect", "rationale"],
            },
          },
          conceptId: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
        },
        required: ["id", "prompt", "choices", "conceptId", "difficulty"],
      },
    },
    sa: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          prompt: { type: "string" },
          modelAnswer: { type: "string" },
          rubric: { type: "string" },
          conceptId: { type: "string" },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
        },
        required: ["id", "prompt", "modelAnswer", "rubric", "conceptId", "difficulty"],
      },
    },
  },
  required: ["mc", "sa"],
} as const;

// JSON schema for remediation.
export const REMEDIATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          prompt: { type: "string" },
          modelAnswer: { type: "string" },
          rubric: { type: "string" },
          conceptId: { type: "string" },
        },
        required: ["id", "prompt", "modelAnswer", "rubric", "conceptId"],
      },
    },
  },
  required: ["questions"],
} as const;

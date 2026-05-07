#!/usr/bin/env node
/**
 * Seed-questions: generate base MC + SA quizzes for every reading stage that
 * doesn't already have a JSON file in data/questions/. Idempotent — skips
 * stages whose questions already exist.
 *
 * Usage:
 *   pnpm seed-questions             # seed all missing stages
 *   pnpm seed-questions <stageId>   # seed just one stage (force overwrite)
 *   pnpm seed-questions --force     # overwrite all
 *
 * Requires: OPENAI_API_KEY in .env.local or env. Cost: ~$0.05–0.20 total
 * with gpt-4o-mini for 16 stages.
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "data", "content");
const OUT = path.join(ROOT, "data", "questions");

// Tiny .env.local loader (no dependencies).
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  } catch {/* no .env.local — that's ok */}
}

const COURSE_CONVENTIONS = `STAT GU4204 (Columbia, Spring 2026, Prof. Banu Baydil; lecture notes by Prof. Bodhisattva Sen). Textbook: DeGroot & Schervish, Probability and Statistics, 4th ed.

DeGroot conventions to enforce:
- Exponential(θ): density θe^(−θx) on x>0 — RATE parameterization. E[X]=1/θ, Var(X)=1/θ².
- Gamma(α,β): rate param. E=α/β, Var=α/β².
- Geometric(p): pmf p(1−p)^x on x=0,1,2,… (starts at 0).
- χ²_d = Gamma(d/2, 1/2). E=d, Var=2d.
- t_d = Z/√(V/d) with Z⊥V, V~χ²_d.

Common Baydil pitfalls — embed in distractors:
- σ known (z) vs σ unknown (t).
- One-sided vs two-sided p-values (factor of 2).
- Type I sup over Ω₀; Type II sup over Ω₁.
- Support depends on θ → CRLB regularity (A.1) fails (e.g., Uniform(0,θ)).
- Delta method requires g'(θ) ≠ 0.
- Test/CI duality: invert acceptance region.`;

const SYSTEM = `You are a question writer for STAT GU4204.
${COURSE_CONVENTIONS}

You generate practice questions for a stage quiz. Output JSON only.

For multiple-choice questions:
- Exactly one correct answer per question.
- Distractors should embody Baydil's known pitfalls.
- Mix difficulty: 2 easy, 2 medium, 1 hard per stage (5 MC total).
- Include a one-sentence rationale for each choice.

For short-answer questions:
- Multi-part scaffolded prompts when possible: e.g., (a) state X, (b) compute Y.
- Provide a full model answer (1–4 sentences) AND a one-line rubric.
- Use formal Baydil setup: "Let X_1, …, X_n be a random sample from …".
- 2 SA questions total.

Use LaTeX inline $...$ and display $$...$$ for math.`;

const SCHEMA = {
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
};

async function generateForStage(client, stage, content) {
  const truncatedContent = content.slice(0, 8000);
  const userPrompt = `Stage: ${stage.title}
Topics: ${stage.topicIds.join(", ")}

Generate exactly 5 multiple-choice (one correct each, 4 choices labeled a/b/c/d) and 2 short-answer questions for this stage.

Use stage-specific IDs (e.g., "${stage.id}-mc-1", "${stage.id}-sa-1"). Set conceptId to one of the stage topics.

Reading content for context:
${truncatedContent}

Output JSON only matching the schema.`;

  const completion = await client.chat.completions.create({
    model: process.env.MODEL_GENERATOR ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "QuizFile", schema: SCHEMA, strict: true },
    },
    temperature: 0.5,
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty completion");
  const parsed = JSON.parse(raw);
  // Ensure type discriminators
  for (const q of parsed.mc) q.type = "mc";
  for (const q of parsed.sa) q.type = "sa";
  return parsed;
}

async function main() {
  await loadEnv();
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing. Add to .env.local.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyStageId = args.find(a => !a.startsWith("--"));

  const manifest = JSON.parse(await readFile(path.join(ROOT, "data", "stages.json"), "utf8"));
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const targets = manifest.stages.filter(s => {
    if (s.kind !== "reading") return false;
    if (!s.questionsFile) return false;
    if (onlyStageId) return s.id === onlyStageId;
    return true;
  });

  console.log(`Seeding ${targets.length} stage(s)...`);

  let count = 0;
  for (const stage of targets) {
    const outPath = path.join(OUT, stage.questionsFile);
    if (!force && !onlyStageId && existsSync(outPath)) {
      console.log(`SKIP  ${stage.id} — exists`);
      continue;
    }
    const contentFile = stage.contentFile ?? stage.sourceChunks?.[0];
    if (!contentFile) {
      console.warn(`SKIP  ${stage.id} — no content file`);
      continue;
    }
    const content = await readFile(path.join(CONTENT, contentFile), "utf8").catch(() => null);
    if (!content) {
      console.warn(`SKIP  ${stage.id} — content unreadable`);
      continue;
    }

    process.stdout.write(`GEN   ${stage.id}... `);
    try {
      const result = await generateForStage(client, stage, content);
      const file = {
        stageId: stage.id,
        generatedAt: new Date().toISOString(),
        mc: result.mc,
        sa: result.sa,
      };
      await writeFile(outPath, JSON.stringify(file, null, 2));
      console.log(`OK (${result.mc.length} MC, ${result.sa.length} SA)`);
      count++;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  console.log(`\nDone. ${count} stages seeded.`);
}

main().catch(e => { console.error(e); process.exit(1); });

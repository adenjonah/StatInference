import { GradeRequest, GradeResponse, GradeResponseSchema } from "./types";
import { getCachedGrade, setCachedGrade } from "./kv";
import { sha256 } from "./utils";
import { GRADER_SYSTEM, buildGraderPrompt } from "./prompts";
import { GRADE_RESPONSE_SCHEMA, MODELS, openai } from "./openai";

export async function gradeShortAnswer(req: GradeRequest): Promise<GradeResponse> {
  const cacheKey = sha256(`${req.questionId}|${req.studentAnswer.trim().slice(0, 4000)}`);
  const cached = await getCachedGrade<GradeResponse>(cacheKey).catch(() => null);
  if (cached) {
    const parsed = GradeResponseSchema.safeParse(cached);
    if (parsed.success) return parsed.data;
  }

  const completion = await openai().chat.completions.create({
    model: MODELS.grader,
    messages: [
      { role: "system", content: GRADER_SYSTEM },
      { role: "user", content: buildGraderPrompt(req) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "GradeResponse",
        schema: GRADE_RESPONSE_SCHEMA,
        strict: true,
      },
    },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Grader returned empty response");
  const parsed = GradeResponseSchema.parse(JSON.parse(raw));
  await setCachedGrade(cacheKey, parsed).catch(() => {/* non-fatal */});
  return parsed;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MODELS, REMEDIATION_SCHEMA, openai } from "@/lib/openai";
import { REMEDIATION_SYSTEM } from "@/lib/prompts";

export const runtime = "nodejs";
export const maxDuration = 30;

const RemediationRequestSchema = z.object({
  stageId: z.string(),
  conceptIds: z.array(z.string()).min(1).max(8),
  count: z.number().min(1).max(5).default(3),
});

const RemediationOutputSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    prompt: z.string(),
    modelAnswer: z.string(),
    rubric: z.string(),
    conceptId: z.string(),
  })),
});

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = RemediationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { stageId, conceptIds, count } = parsed.data;

    const userPrompt = `Stage: ${stageId}

Generate ${count} short-answer remediation questions targeting these weak concepts:
${conceptIds.map(c => `- ${c}`).join("\n")}

Each question should test exactly one concept and follow Baydil's voice. Use formal "random sample" setup.

Output JSON only.`;

    const completion = await openai().chat.completions.create({
      model: MODELS.generator,
      messages: [
        { role: "system", content: REMEDIATION_SYSTEM },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "RemediationOutput",
          schema: REMEDIATION_SCHEMA,
          strict: true,
        },
      },
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty generation");
    const json = RemediationOutputSchema.parse(JSON.parse(raw));
    return NextResponse.json({ data: json });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

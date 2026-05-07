import { NextRequest, NextResponse } from "next/server";
import { gradeShortAnswer } from "@/lib/grading";
import { GradeRequestSchema } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = GradeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.format() }, { status: 400 });
    }
    const result = await gradeShortAnswer(parsed.data);
    return NextResponse.json({ data: result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

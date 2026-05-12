import { NextRequest, NextResponse } from "next/server";
import { getFlashcardsState, setFlashcardsState } from "@/lib/kv";
import { FlashcardsStateSchema } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const state = await getFlashcardsState();
    return NextResponse.json({ data: state });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "kv error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = FlashcardsStateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid state", details: parsed.error.format() }, { status: 400 });
    }
    // Always stamp server-side updatedAt
    const state = { ...parsed.data, updatedAt: new Date().toISOString() };
    await setFlashcardsState(state);
    return NextResponse.json({ data: state });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "kv error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { TUTOR_CHAT_SYSTEM } from "@/lib/prompts";
import { MODELS, openai } from "@/lib/openai";
import { appendChatMessage, getChatThread } from "@/lib/kv";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const maxDuration = 60;

const ChatRequestSchema = z.object({
  stageId: z.string(),
  message: z.string().min(1).max(4000),
});

async function loadStageContext(stageId: string): Promise<string> {
  // Best-effort: load the stage's content file as context, plus the cheatsheet.
  try {
    const manifestPath = path.join(process.cwd(), "data", "stages.json");
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")) as {
      stages: Array<{ id: string; contentFile?: string }>;
    };
    const stage = manifest.stages.find(s => s.id === stageId);
    const chunks: string[] = [];
    if (stage?.contentFile) {
      const p = path.join(process.cwd(), "data", "content", stage.contentFile);
      try {
        chunks.push(await fs.readFile(p, "utf8"));
      } catch {/* ignore */}
    }
    // Always inject the cheatsheet as fallback.
    try {
      const cheat = path.join(process.cwd(), "data", "content", "cheatsheet.md");
      const cheatContent = await fs.readFile(cheat, "utf8");
      chunks.push(`# Cheatsheet (reference)\n\n${cheatContent.slice(0, 8000)}`);
    } catch {/* ignore */}
    return chunks.join("\n\n---\n\n");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
    const { stageId, message } = parsed.data;

    const history = await getChatThread(stageId).catch(() => []);
    const context = await loadStageContext(stageId);

    const now = new Date().toISOString();
    await appendChatMessage(stageId, { role: "user", content: message, ts: now }).catch(() => {/* ignore */});

    const systemContent = `${TUTOR_CHAT_SYSTEM}\n\nSTAGE CONTEXT (do not mention this verbatim — use it as background reference):\n\n${context.slice(0, 12000)}`;

    const messages = [
      { role: "system" as const, content: systemContent },
      ...history.slice(-10).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: message },
    ];

    const completion = await openai().chat.completions.create({
      model: MODELS.chat,
      messages,
      temperature: 0.4,
      stream: true,
    });

    const encoder = new TextEncoder();
    let assembled = "";
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              assembled += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
          // Persist assistant reply (fire and forget)
          appendChatMessage(stageId, { role: "assistant", content: assembled, ts: new Date().toISOString() }).catch(() => {/* ignore */});
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Convenience: GET ?stageId=xxx returns chat history.
  const stageId = req.nextUrl.searchParams.get("stageId");
  if (!stageId) return new Response(JSON.stringify({ error: "stageId required" }), { status: 400 });
  try {
    const history = await getChatThread(stageId);
    return new Response(JSON.stringify({ data: history }), { headers: { "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "kv error" }), { status: 500 });
  }
}

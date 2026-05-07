"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarkdownReader } from "./MarkdownReader";
import type { ChatMessage } from "@/lib/types";

interface TutorChatProps {
  stageId: string;
}

export function TutorChat({ stageId }: TutorChatProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/chat?stageId=${encodeURIComponent(stageId)}`)
      .then(r => r.json())
      .then(j => {
        if (Array.isArray(j.data)) setHistory(j.data);
      })
      .catch(() => {/* ignore */});
  }, [open, stageId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, streamBuffer]);

  async function sendMessage() {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput("");
    setStreaming(true);
    setStreamBuffer("");
    setHistory(prev => [...prev, { role: "user", content: msg, ts: new Date().toISOString() }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId, message: msg }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assembled += chunk;
        setStreamBuffer(assembled);
      }
      setHistory(prev => [...prev, { role: "assistant", content: assembled, ts: new Date().toISOString() }]);
      setStreamBuffer("");
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Chat failed";
      setHistory(prev => [...prev, { role: "assistant", content: `*Error: ${errMsg}*`, ts: new Date().toISOString() }]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        aria-label={open ? "Close tutor chat" : "Open tutor chat"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-20 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-xl transition-transform dark:border-neutral-800 dark:bg-neutral-950",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">Tutor — Stage: {stageId}</h2>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 && !streamBuffer && (
            <p className="text-sm text-neutral-500">
              Ask anything about this stage. The tutor sees your stage content and the cheatsheet as context.
            </p>
          )}
          {history.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-md p-3 text-sm",
                m.role === "user"
                  ? "ml-auto max-w-[85%] bg-blue-600 text-white"
                  : "max-w-[90%] bg-neutral-100 dark:bg-neutral-800"
              )}
            >
              {m.role === "assistant" ? (
                <MarkdownReader source={m.content} />
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          ))}
          {streamBuffer && (
            <div className="max-w-[90%] rounded-md bg-neutral-100 p-3 text-sm dark:bg-neutral-800">
              <MarkdownReader source={streamBuffer} />
            </div>
          )}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800"
        >
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about this stage..."
            rows={2}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={streaming}
            className="resize-none"
          />
          <Button type="submit" disabled={streaming || !input.trim()} size="sm">
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </aside>
    </>
  );
}

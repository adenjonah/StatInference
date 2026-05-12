"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownReader } from "@/components/MarkdownReader";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Shuffle, RotateCw } from "lucide-react";
import type { Flashcard } from "@/lib/types";

interface FlashcardsClientProps {
  cards: Flashcard[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TYPE_LABELS: Record<Flashcard["type"], string> = {
  tf: "True / False",
  definition: "Definition",
  statement: "Theorem",
};

const TYPE_VARIANTS: Record<Flashcard["type"], "default" | "success" | "warning"> = {
  tf: "warning",
  definition: "default",
  statement: "success",
};

export function FlashcardsClient({ cards }: FlashcardsClientProps) {
  const [order, setOrder] = useState<Flashcard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const current = order[index];

  const flip = useCallback(() => setFlipped(f => !f), []);

  const next = useCallback(() => {
    setIndex(i => {
      const ni = Math.min(order.length - 1, i + 1);
      return ni;
    });
    setFlipped(false);
  }, [order.length]);

  const prev = useCallback(() => {
    setIndex(i => Math.max(0, i - 1));
    setFlipped(false);
  }, []);

  const shuffle = useCallback(() => {
    setOrder(shuffleArray(cards));
    setIndex(0);
    setFlipped(false);
    setSeen(new Set());
  }, [cards]);

  const reset = useCallback(() => {
    setOrder(cards);
    setIndex(0);
    setFlipped(false);
    setSeen(new Set());
  }, [cards]);

  useEffect(() => {
    if (current) setSeen(prev => new Set(prev).add(current.id));
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        shuffle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, next, prev, shuffle]);

  const progress = useMemo(() => Math.round(((index + 1) / order.length) * 100), [index, order.length]);

  if (!current) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant={TYPE_VARIANTS[current.type]}>{TYPE_LABELS[current.type]}</Badge>
        <Badge variant="neutral">{current.category.replace(/-/g, " ")}</Badge>
        <div className="flex-1" />
        <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
          {index + 1} / {order.length} · seen {seen.size}
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <button
        type="button"
        onClick={flip}
        className={cn(
          "block w-full min-h-[280px] rounded-xl border-2 px-6 py-8 text-left transition-all",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300",
          flipped
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500"
        )}
        aria-label={flipped ? "Show front" : "Show back"}
      >
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
          {flipped ? "Answer" : "Front — click to flip"}
        </div>
        <div className="text-base leading-relaxed">
          <MarkdownReader source={flipped ? current.back : current.front} />
        </div>
      </button>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={prev} disabled={index === 0}>
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={shuffle} title="Shuffle (S)">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={reset} title="Reset order">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={next} disabled={index === order.length - 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <strong>Shortcuts:</strong> <kbd>Space</kbd> flip · <kbd>←</kbd>/<kbd>→</kbd> navigate · <kbd>S</kbd> shuffle
      </div>
    </div>
  );
}

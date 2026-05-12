"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownReader } from "@/components/MarkdownReader";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, Trash2 } from "lucide-react";
import type { Flashcard } from "@/lib/types";

interface FlashcardsClientProps {
  cards: Flashcard[];
}

const STORAGE_KEY = "flashcards:state:v1";
const ALL = "__all__";

interface SavedState {
  index: number;
  seenIds: string[];
  category: string;
  typeFilter: string;
  shuffledOrderIds: string[] | null;
}

function shuffleIds(allCards: Flashcard[]): string[] {
  const ids = allCards.map(c => c.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

const TYPE_LABELS: Record<Flashcard["type"], string> = {
  tf: "True / False",
  definition: "Definition",
  statement: "Theorem",
  memorize: "Memorize",
};

const TYPE_VARIANTS: Record<Flashcard["type"], "default" | "success" | "warning" | "neutral"> = {
  tf: "warning",
  definition: "default",
  statement: "success",
  memorize: "neutral",
};

export function FlashcardsClient({ cards }: FlashcardsClientProps) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of cards) set.add(c.category);
    return Array.from(set).sort();
  }, [cards]);

  const types = useMemo(() => {
    const set = new Set<Flashcard["type"]>();
    for (const c of cards) set.add(c.type);
    return Array.from(set);
  }, [cards]);

  const [category, setCategory] = useState<string>(ALL);
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [shuffledOrderIds, setShuffledOrderIds] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage — deferred to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<SavedState>;
          if (typeof saved.index === "number") setIndex(saved.index);
          if (Array.isArray(saved.seenIds)) setSeen(new Set(saved.seenIds));
          if (typeof saved.category === "string") setCategory(saved.category);
          if (typeof saved.typeFilter === "string") setTypeFilter(saved.typeFilter);
          if (Array.isArray(saved.shuffledOrderIds) || saved.shuffledOrderIds === null) {
            setShuffledOrderIds(saved.shuffledOrderIds ?? null);
          }
        }
      } catch {/* ignore */}
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Persist on changes (skip until hydrated to avoid clobbering)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: SavedState = {
        index,
        seenIds: Array.from(seen),
        category,
        typeFilter,
        shuffledOrderIds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {/* ignore quota errors */}
  }, [hydrated, index, seen, category, typeFilter, shuffledOrderIds]);

  // Build the active order: apply shuffle (if any) then filters.
  const order = useMemo(() => {
    let base: Flashcard[];
    if (shuffledOrderIds && shuffledOrderIds.length > 0) {
      const byId = new Map(cards.map(c => [c.id, c]));
      base = shuffledOrderIds
        .map(id => byId.get(id))
        .filter((c): c is Flashcard => Boolean(c));
      // Append any new cards not present in the saved shuffle (so deck additions still appear)
      const seenInShuffle = new Set(shuffledOrderIds);
      for (const c of cards) if (!seenInShuffle.has(c.id)) base.push(c);
    } else {
      base = cards;
    }
    let filtered = base;
    if (category !== ALL) filtered = filtered.filter(c => c.category === category);
    if (typeFilter !== ALL) filtered = filtered.filter(c => c.type === typeFilter);
    return filtered;
  }, [cards, category, typeFilter, shuffledOrderIds]);

  // Clamp index without setState-in-render (just compute a safe view-index).
  const safeIndex = order.length === 0 ? 0 : Math.min(index, order.length - 1);
  const current = order[safeIndex];

  const flip = useCallback(() => setFlipped(f => !f), []);

  const next = useCallback(() => {
    setIndex(i => {
      const cur = order.length === 0 ? 0 : Math.min(i, order.length - 1);
      return Math.min(order.length - 1, cur + 1);
    });
    setFlipped(false);
  }, [order.length]);

  const prev = useCallback(() => {
    setIndex(i => {
      const cur = order.length === 0 ? 0 : Math.min(i, order.length - 1);
      return Math.max(0, cur - 1);
    });
    setFlipped(false);
  }, [order.length]);

  const doShuffle = useCallback(() => {
    setShuffledOrderIds(shuffleIds(cards));
    setIndex(0);
    setFlipped(false);
  }, [cards]);

  const resetOrder = useCallback(() => {
    setShuffledOrderIds(null);
    setIndex(0);
    setFlipped(false);
  }, []);

  const clearProgress = useCallback(() => {
    if (!confirm("Clear all flashcard progress (seen cards, filters, shuffle, position)?")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    setIndex(0);
    setFlipped(false);
    setSeen(new Set());
    setCategory(ALL);
    setTypeFilter(ALL);
    setShuffledOrderIds(null);
  }, []);

  // Track seen cards
  useEffect(() => {
    if (!current) return;
    setSeen(prev => {
      if (prev.has(current.id)) return prev;
      const n = new Set(prev);
      n.add(current.id);
      return n;
    });
  }, [current]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;
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
        doShuffle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, next, prev, doShuffle]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setIndex(0);
    setFlipped(false);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setIndex(0);
    setFlipped(false);
  };

  if (order.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelects
            category={category}
            typeFilter={typeFilter}
            categories={categories}
            cards={cards}
            types={types}
            onCategoryChange={handleCategoryChange}
            onTypeChange={handleTypeChange}
          />
        </div>
        <div className="rounded-md border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          No cards match the current filter. Try a different topic or type.
        </div>
      </div>
    );
  }

  const progress = Math.round(((safeIndex + 1) / order.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelects
          category={category}
          typeFilter={typeFilter}
          categories={categories}
          cards={cards}
          types={types}
          onCategoryChange={handleCategoryChange}
          onTypeChange={handleTypeChange}
        />
        <div className="flex-1" />
        <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
          {safeIndex + 1} / {order.length} · seen {seen.size} / {cards.length}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={TYPE_VARIANTS[current.type]}>{TYPE_LABELS[current.type]}</Badge>
        <Badge variant="neutral">{current.category.replace(/-/g, " ")}</Badge>
        <div className="flex-1" />
        <span className="text-xs text-neutral-500">{current.id}</span>
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
        <Button variant="outline" size="sm" onClick={prev} disabled={safeIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={doShuffle} title="Shuffle (S)">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetOrder} title="Reset order (no shuffle)">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearProgress} title="Clear saved progress">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={next} disabled={safeIndex === order.length - 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <strong>Shortcuts:</strong> <kbd>Space</kbd> flip · <kbd>←</kbd>/<kbd>→</kbd> navigate · <kbd>S</kbd> shuffle. <strong>State auto-saved</strong> on refresh.
      </div>
    </div>
  );
}

interface FilterSelectsProps {
  category: string;
  typeFilter: string;
  categories: string[];
  cards: Flashcard[];
  types: Flashcard["type"][];
  onCategoryChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

function FilterSelects({
  category, typeFilter, categories, cards, types, onCategoryChange, onTypeChange,
}: FilterSelectsProps) {
  return (
    <>
      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Topic</label>
      <select
        value={category}
        onChange={e => onCategoryChange(e.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value={ALL}>All topics ({cards.length})</option>
        {categories.map(c => {
          const count = cards.filter(card => card.category === c).length;
          return <option key={c} value={c}>{c.replace(/-/g, " ")} ({count})</option>;
        })}
      </select>

      <label className="ml-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">Type</label>
      <select
        value={typeFilter}
        onChange={e => onTypeChange(e.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value={ALL}>All types</option>
        {types.map(t => <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>)}
      </select>
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownReader } from "@/components/MarkdownReader";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Shuffle, RotateCw, Trash2, Cloud, CloudOff, RefreshCw } from "lucide-react";
import type { Flashcard, FlashcardsState } from "@/lib/types";

interface FlashcardsClientProps {
  cards: Flashcard[];
}

const STORAGE_KEY = "flashcards:state:v1";
const ALL = "__all__";
const SYNC_DEBOUNCE_MS = 1500;

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

type SyncStatus = "loading" | "synced" | "syncing" | "offline";

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
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ----- Hydrate: load localStorage first (instant), then fetch server (authoritative) -----
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      // Step 1: pull localStorage so we render something immediately
      let local: Partial<FlashcardsState> | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) local = JSON.parse(raw);
      } catch {/* ignore */}

      if (local && !cancelled) {
        applySavedState(local);
      }

      // Step 2: fetch server state
      try {
        const res = await fetch("/api/flashcards", { cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setSyncStatus("offline");
          setHydrated(true);
          return;
        }
        const json = await res.json();
        const server: FlashcardsState | null = json?.data ?? null;
        if (server) {
          // Use server if newer than local, OR if no local existed
          const serverTime = server.updatedAt ? Date.parse(server.updatedAt) : 0;
          const localTime = local?.updatedAt ? Date.parse(local.updatedAt as string) : 0;
          if (!local || serverTime >= localTime) {
            applySavedState(server);
          }
        }
        setSyncStatus("synced");
      } catch {
        setSyncStatus("offline");
      } finally {
        setHydrated(true);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySavedState(saved: Partial<FlashcardsState>) {
    if (typeof saved.index === "number") setIndex(saved.index);
    if (Array.isArray(saved.seenIds)) setSeen(new Set(saved.seenIds));
    if (typeof saved.category === "string") setCategory(saved.category);
    if (typeof saved.typeFilter === "string") setTypeFilter(saved.typeFilter);
    if (Array.isArray(saved.shuffledOrderIds) || saved.shuffledOrderIds === null) {
      setShuffledOrderIds(saved.shuffledOrderIds ?? null);
    }
  }

  // ----- Persist: localStorage immediately, KV debounced -----
  useEffect(() => {
    if (!hydrated) return;
    const payload: FlashcardsState = {
      index,
      seenIds: Array.from(seen),
      category,
      typeFilter,
      shuffledOrderIds,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {/* ignore */}

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSyncStatus("syncing");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) setSyncStatus("synced");
        else setSyncStatus("offline");
      } catch {
        setSyncStatus("offline");
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [hydrated, index, seen, category, typeFilter, shuffledOrderIds]);

  // ----- Build active order -----
  const order = useMemo(() => {
    let base: Flashcard[];
    if (shuffledOrderIds && shuffledOrderIds.length > 0) {
      const byId = new Map(cards.map(c => [c.id, c]));
      base = shuffledOrderIds
        .map(id => byId.get(id))
        .filter((c): c is Flashcard => Boolean(c));
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

  const refetchFromServer = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      const res = await fetch("/api/flashcards", { cache: "no-store" });
      if (!res.ok) { setSyncStatus("offline"); return; }
      const json = await res.json();
      if (json?.data) applySavedState(json.data);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("offline");
    }
  }, []);

  const clearProgress = useCallback(async () => {
    if (!confirm("Clear ALL flashcard progress on this device AND the server? This cannot be undone.")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    setIndex(0);
    setFlipped(false);
    setSeen(new Set());
    setCategory(ALL);
    setTypeFilter(ALL);
    setShuffledOrderIds(null);
    setSyncStatus("syncing");
    try {
      const wiped: FlashcardsState = {
        index: 0, seenIds: [], category: ALL, typeFilter: ALL,
        shuffledOrderIds: null, updatedAt: new Date().toISOString(),
      };
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wiped),
      });
      setSyncStatus(res.ok ? "synced" : "offline");
    } catch {
      setSyncStatus("offline");
    }
  }, []);

  useEffect(() => {
    if (!current) return;
    setSeen(prev => {
      if (prev.has(current.id)) return prev;
      const n = new Set(prev);
      n.add(current.id);
      return n;
    });
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key.toLowerCase() === "s") { e.preventDefault(); doShuffle(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, next, prev, doShuffle]);

  const handleCategoryChange = (value: string) => {
    setCategory(value); setIndex(0); setFlipped(false);
  };
  const handleTypeChange = (value: string) => {
    setTypeFilter(value); setIndex(0); setFlipped(false);
  };

  if (order.length === 0) {
    return (
      <div className="space-y-4">
        <FilterRow
          category={category} typeFilter={typeFilter}
          categories={categories} cards={cards} types={types}
          onCategoryChange={handleCategoryChange} onTypeChange={handleTypeChange}
          syncStatus={syncStatus} onRefetch={refetchFromServer}
          safeIndex={0} orderLength={0} seenCount={seen.size} totalCount={cards.length}
        />
        <div className="rounded-md border border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          No cards match the current filter.
        </div>
      </div>
    );
  }

  const progress = Math.round(((safeIndex + 1) / order.length) * 100);

  return (
    <div className="space-y-4">
      <FilterRow
        category={category} typeFilter={typeFilter}
        categories={categories} cards={cards} types={types}
        onCategoryChange={handleCategoryChange} onTypeChange={handleTypeChange}
        syncStatus={syncStatus} onRefetch={refetchFromServer}
        safeIndex={safeIndex} orderLength={order.length} seenCount={seen.size} totalCount={cards.length}
      />

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
          <Button variant="ghost" size="sm" onClick={resetOrder} title="Reset order">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearProgress} title="Clear ALL progress (server + local)">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={next} disabled={safeIndex === order.length - 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <strong>Shortcuts:</strong> <kbd>Space</kbd> flip · <kbd>←</kbd>/<kbd>→</kbd> navigate · <kbd>S</kbd> shuffle. <strong>State syncs to cloud</strong> across browsers (auto-saved 1.5s after each change).
      </div>
    </div>
  );
}

interface FilterRowProps {
  category: string;
  typeFilter: string;
  categories: string[];
  cards: Flashcard[];
  types: Flashcard["type"][];
  onCategoryChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  syncStatus: SyncStatus;
  onRefetch: () => void;
  safeIndex: number;
  orderLength: number;
  seenCount: number;
  totalCount: number;
}

function FilterRow({
  category, typeFilter, categories, cards, types,
  onCategoryChange, onTypeChange, syncStatus, onRefetch,
  safeIndex, orderLength, seenCount, totalCount,
}: FilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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

      <SyncBadge status={syncStatus} onClick={onRefetch} />

      <div className="flex-1" />

      <span className="text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
        {orderLength > 0 ? `${safeIndex + 1} / ${orderLength}` : "0 / 0"} · seen {seenCount} / {totalCount}
      </span>
    </div>
  );
}

function SyncBadge({ status, onClick }: { status: SyncStatus; onClick: () => void }) {
  const map: Record<SyncStatus, { label: string; icon: React.ReactNode; tone: string }> = {
    loading: { label: "Loading…", icon: <RefreshCw className="h-3 w-3 animate-spin" />, tone: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
    syncing: { label: "Syncing…", icon: <RefreshCw className="h-3 w-3 animate-spin" />, tone: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
    synced:  { label: "Synced",   icon: <Cloud className="h-3 w-3" />,                    tone: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
    offline: { label: "Offline",  icon: <CloudOff className="h-3 w-3" />,                  tone: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300" },
  };
  const s = map[status];
  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to re-fetch server state"
      className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.tone} hover:opacity-80`}
    >
      {s.icon}
      {s.label}
    </button>
  );
}

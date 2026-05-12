import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopBar } from "@/components/TopBar";
import { FlashcardsClient } from "./FlashcardsClient";
import { loadFlashcards } from "@/lib/content-loader";

export default async function FlashcardsPage() {
  const deck = await loadFlashcards();

  if (!deck || deck.cards.length === 0) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-2xl px-6 py-10">
          <Card>
            <CardHeader><CardTitle>No flashcards yet</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">Add cards to <code>data/flashcards.json</code> and redeploy.</p>
              <Link href="/" className="mt-3 inline-block text-sm underline">← Dashboard</Link>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            T/F + definitions + theorem statements. {deck.cards.length} cards. Click the card or press <kbd>Space</kbd> to flip; <kbd>←</kbd>/<kbd>→</kbd> to navigate.
          </p>
        </header>
        <FlashcardsClient cards={deck.cards} />
        <div className="mt-8">
          <Link href="/" className="text-sm underline">← Dashboard</Link>
        </div>
      </main>
    </>
  );
}

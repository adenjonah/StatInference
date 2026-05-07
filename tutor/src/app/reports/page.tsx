import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { ReportsClient } from "./ReportsClient";

export default function ReportsPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Mastery snapshot and weak areas. Daily reports are generated at the end of each day.
          </p>
        </header>
        <ReportsClient />
        <div className="mt-6">
          <Link href="/" className="text-sm underline">← Dashboard</Link>
        </div>
      </main>
    </>
  );
}

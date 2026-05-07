"use client";

import React, { Fragment } from "react";
import { InlineMath, BlockMath } from "react-katex";

/**
 * Lightweight markdown renderer with KaTeX math support.
 * Handles: headings, paragraphs, bullet/numbered lists, blockquotes, code blocks,
 * tables, inline + display math, bold/italic, inline code, callouts.
 *
 * Designed for the StatInf course chunks — not a general-purpose renderer.
 */
export function MarkdownReader({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((b, i) => renderBlock(b, i))}
    </article>
  );
}

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "code"; lang: string; content: string }
  | { kind: "math"; tex: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "blockquote"; text: string }
  | { kind: "callout"; tone: "info" | "warning" | "tip"; text: string }
  | { kind: "hr" };

function parseBlocks(src: string): Block[] {
  // Strip HTML comments first
  const cleaned = src.replace(/<!--[\s\S]*?-->/g, "");
  const lines = cleaned.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push({ kind: "hr" });
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ kind: "heading", level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    if (trimmed.startsWith("$$")) {
      const oneLine = trimmed.match(/^\$\$(.+)\$\$$/);
      if (oneLine) {
        blocks.push({ kind: "math", tex: oneLine[1].trim() });
        i++;
        continue;
      }
      const buf: string[] = [];
      const startContent = trimmed.replace(/^\$\$/, "");
      if (startContent !== "") buf.push(startContent);
      i++;
      while (i < lines.length && !lines[i].trimEnd().endsWith("$$")) {
        buf.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        const last = lines[i].trimEnd().replace(/\$\$$/, "");
        if (last !== "") buf.push(last);
        i++;
      }
      blocks.push({ kind: "math", tex: buf.join("\n").trim() });
      continue;
    }

    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ kind: "code", lang, content: buf.join("\n") });
      continue;
    }

    if (line.includes("|") && lines[i + 1]?.match(/^\s*\|?\s*:?-+:?\s*\|/)) {
      const headers = splitTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ kind: "table", headers, rows });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "list", ordered: false, items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ kind: "list", ordered: true, items });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      const text = buf.join("\n");
      const cm = text.match(/^\[!(INFO|WARNING|TIP|NOTE|BAYDIL)\]\s*(.*)/i);
      if (cm) {
        const kind = cm[1].toUpperCase();
        const rest = cm[2] + "\n" + buf.slice(1).join("\n");
        blocks.push({
          kind: "callout",
          tone: kind === "WARNING" ? "warning" : kind === "TIP" ? "tip" : "info",
          text: rest.trim(),
        });
      } else {
        blocks.push({ kind: "blockquote", text });
      }
      continue;
    }

    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !isStartOfBlock(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    if (buf.length > 0) {
      blocks.push({ kind: "paragraph", text: buf.join(" ") });
    }
  }

  return blocks;
}

function isStartOfBlock(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^#{1,6}\s/.test(trimmed) ||
    trimmed.startsWith("$$") ||
    trimmed.startsWith("```") ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    trimmed.startsWith(">") ||
    /^---+$/.test(trimmed)
  );
}

function splitTableRow(line: string): string[] {
  return line
    .split("|")
    .map(c => c.trim())
    .filter((_, i, arr) => !(i === 0 && arr[0] === "") && !(i === arr.length - 1 && arr[arr.length - 1] === ""));
}

function renderBlock(b: Block, key: number): React.ReactNode {
  switch (b.kind) {
    case "heading": {
      const Tag = `h${Math.min(b.level, 6)}` as keyof React.JSX.IntrinsicElements;
      const sizes = ["", "text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-base"];
      return (
        <Tag key={key} className={`${sizes[b.level]} font-semibold mt-6 mb-3`}>
          {renderInline(b.text)}
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p key={key} className="my-3 leading-relaxed">
          {renderInline(b.text)}
        </p>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      const cls = b.ordered ? "list-decimal" : "list-disc";
      return (
        <Tag key={key} className={`${cls} pl-6 my-3 space-y-1`}>
          {b.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </Tag>
      );
    }
    case "code":
      return (
        <pre key={key} className="my-3 overflow-x-auto rounded-md bg-neutral-100 p-3 text-xs dark:bg-neutral-800">
          <code>{b.content}</code>
        </pre>
      );
    case "math":
      return (
        <div key={key} className="my-4 overflow-x-auto">
          <BlockMath math={b.tex} />
        </div>
      );
    case "table":
      return (
        <div key={key} className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-700">
                {b.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-neutral-200 dark:border-neutral-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="my-3 border-l-4 border-neutral-300 pl-4 italic text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
          {renderInline(b.text)}
        </blockquote>
      );
    case "callout": {
      const palette = {
        info: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100",
        warning: "border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-100",
        tip: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100",
      }[b.tone];
      return (
        <div key={key} className={`my-3 rounded-md border-l-4 px-4 py-3 ${palette}`}>
          {renderInline(b.text)}
        </div>
      );
    }
    case "hr":
      return <hr key={key} className="my-6 border-neutral-200 dark:border-neutral-800" />;
  }
}

function renderInline(text: string): React.ReactNode {
  const segments = splitMath(text);
  return segments.map((s, idx) =>
    s.type === "math" ? (
      <InlineMath key={idx} math={s.value} />
    ) : (
      <Fragment key={idx}>{renderTextWithFormat(s.value)}</Fragment>
    )
  );
}

function splitMath(text: string): { type: "text" | "math"; value: string }[] {
  const out: { type: "text" | "math"; value: string }[] = [];
  let i = 0;
  let buf = "";
  while (i < text.length) {
    if (text[i] === "\\" && text[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }
    if (text[i] === "$") {
      const close = findClosingDollar(text, i + 1);
      if (close > i) {
        if (buf) {
          out.push({ type: "text", value: buf });
          buf = "";
        }
        out.push({ type: "math", value: text.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  if (buf) out.push({ type: "text", value: buf });
  return out;
}

function findClosingDollar(text: string, from: number): number {
  for (let j = from; j < text.length; j++) {
    if (text[j] === "\\" && text[j + 1] === "$") {
      j++;
      continue;
    }
    if (text[j] === "$") return j;
  }
  return -1;
}

function renderTextWithFormat(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  let lastIdx = 0;
  let key = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > lastIdx) out.push(text.slice(lastIdx, idx));
    if (m[2]) out.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) out.push(<code key={key++} className="rounded bg-neutral-100 px-1 text-[0.9em] dark:bg-neutral-800">{m[3]}</code>);
    else if (m[4]) out.push(<em key={key++}>{m[4]}</em>);
    lastIdx = idx + m[0].length;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return out;
}

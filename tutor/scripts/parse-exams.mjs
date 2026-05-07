#!/usr/bin/env node
// One-off parser. Reads /exam-prep/final-versions/final-{A..E}.tex (+ -solutions.tex)
// and writes /tutor/data/exams/final-{A..E}.json.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const SRC_DIR = join(REPO_ROOT, "exam-prep", "final-versions");
const OUT_DIR = join(__dirname, "..", "data", "exams");

const VARIANTS = [
  { id: "A", title: "Mock Final — Variant A (Predictable Standard)" },
  { id: "B", title: "Mock Final — Variant B (Theory-Heavy)" },
  { id: "C", title: "Mock Final — Variant C (Computation-Heavy)" },
  { id: "D", title: "Mock Final — Variant D (Hypothesis-Testing Centered)" },
  { id: "E", title: "Mock Final — Variant E (Hybrid / Most-Likely)" },
];

const warn = (msg) => process.stderr.write(`warn: ${msg}\n`);
const readTex = async (name) => readFile(join(SRC_DIR, name), "utf8");

const cleanBody = (s) =>
  s
    .replace(/\\vspace\{[^}]*\}/g, "")
    .replace(/\\vfill\b/g, "")
    .replace(/\\medskip\b/g, "")
    .replace(/\\bigskip\b/g, "")
    .replace(/\\smallskip\b/g, "")
    .replace(/\\newpage\b/g, "")
    .replace(/\\hrule\b/g, "")
    .replace(/\\par\\nobreak/g, "")
    .replace(/\\noindent\s*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const findSections = (text) => {
  const re = /\\section\*\{\s*Part\s+([A-D])\b[^}]*\}/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) {
    out.push({ index: m.index, partLabel: `Part ${m[1]}`, end: re.lastIndex });
  }
  return out;
};

const sectionForIndex = (sections, idx) => {
  let label = null;
  for (const s of sections) {
    if (s.index <= idx) label = s.partLabel;
    else break;
  }
  return label || "Part A";
};

const extractQuantileTable = (text) => {
  const idx = text.search(/\\textbf\{Quantile [Rr]eference table\.?\}|\\textbf\{Quantile Table[^}]*\}/);
  if (idx === -1) return "";
  const tail = text.slice(idx);
  const stop = tail.search(/\\hrule|\\section\*|\\bigskip\\hrule/);
  const block = stop === -1 ? tail : tail.slice(0, stop);
  const lines = [];
  const dollarRe = /\$([^$]+)\$/g;
  const chunks = block.split(/\\\\|\n/);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (/\\toprule|\\bottomrule|\\midrule|\\hline|\\begin\{|\\end\{|\\renewcommand|multicolumn/.test(trimmed)) {
      if (!/\$/.test(trimmed)) continue;
    }
    const headerMatch = trimmed.match(/\\textbf\{([^}]+)\}/);
    const isHeaderOnly =
      headerMatch && trimmed.replace(/\\textbf\{[^}]+\}/, "").replace(/[\s&]/g, "") === "";
    if (isHeaderOnly) {
      lines.push(`**${headerMatch[1]}**`);
      continue;
    }
    const maths = [];
    let m;
    dollarRe.lastIndex = 0;
    while ((m = dollarRe.exec(trimmed))) maths.push(`$${m[1].trim()}$`);
    if (maths.length === 0) continue;
    let prefix = "";
    if (headerMatch) prefix = `**${headerMatch[1]}**: `;
    lines.push(`- ${prefix}${maths.join(", ")}`);
  }
  return lines.join("\n").trim();
};

const extractParts = (body) => {
  if (/\\partlabel\{/.test(body)) return extractPartlabelParts(body);
  if (/\\begin\{enumerate\}\[[^\]]*alph\*[^\]]*\]/.test(body)) return extractAlphEnumerateParts(body);
  return [];
};

const extractPartlabelParts = (body) => {
  const parts = [];
  const re = /\\partlabel\{([a-z])\}\{(\d+)\}/g;
  const matches = [];
  let m;
  while ((m = re.exec(body))) matches.push({ label: m[1], pts: parseInt(m[2], 10), end: re.lastIndex, start: m.index });
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : body.length;
    let promptRaw = body.slice(cur.end, nextStart).replace(/^\s*\\quad\s*/, "");
    parts.push({ label: `(${cur.label})`, points: cur.pts, prompt: cleanBody(promptRaw), modelAnswer: "" });
  }
  return parts;
};

const extractAlphEnumerateParts = (body) => {
  const beginRe = /\\begin\{enumerate\}\[[^\]]*alph\*[^\]]*\]/;
  const bm = body.match(beginRe);
  if (!bm) return [];
  const beginIdx = bm.index + bm[0].length;
  const after = body.slice(beginIdx);
  const em = after.match(/\\end\{enumerate\}/);
  if (!em) return [];
  const inner = after.slice(0, em.index);
  const items = inner.split(/\\item\s+/).slice(1);
  const parts = [];
  const labels = ["a", "b", "c", "d", "e", "f", "g", "h"];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const ptsMatch = item.match(/^\s*(?:\\textbf\{)?\(?\s*(\d+)\s*pts?\)\}?\s*/);
    let pts = 0;
    let promptRaw = item;
    if (ptsMatch) {
      pts = parseInt(ptsMatch[1], 10);
      promptRaw = item.slice(ptsMatch[0].length);
    }
    parts.push({ label: `(${labels[i]})`, points: pts, prompt: cleanBody(promptRaw), modelAnswer: "" });
  }
  return parts;
};

const findEndOfDocument = (text) => {
  const m = text.match(/\\end\{document\}/);
  return m ? m.index : text.length;
};

const deLatex = (s) =>
  s
    .replace(/\\'\{?e\}?/g, "é")
    .replace(/\\'e/g, "é")
    .replace(/\\textbf\{([^}]*)\}/g, "$1")
    .replace(/\\emph\{([^}]*)\}/g, "$1")
    .replace(/\\\\/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseProbStyle = (text, command) => {
  const sections = findSections(text);
  const re = new RegExp(`\\\\${command}\\{(\\d+)\\}\\{([^}]*)\\}`, "g");
  const probs = [];
  const matches = [];
  let m;
  while ((m = re.exec(text))) {
    matches.push({ points: parseInt(m[1], 10), title: m[2].trim(), start: m.index, end: re.lastIndex });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    const section = sectionForIndex(sections, cur.start);
    const parts = extractParts(body);
    let promptRaw = body;
    const firstMarker = body.search(/\\partlabel\{|\\begin\{enumerate\}/);
    if (firstMarker !== -1) promptRaw = body.slice(0, firstMarker);
    probs.push({
      num: i + 1,
      title: deLatex(cur.title),
      section,
      points: cur.points,
      prompt: cleanBody(promptRaw),
      parts,
    });
  }
  return probs;
};

const parseVariantC = (text) => {
  const sections = findSections(text);
  const probs = [];
  let num = 0;
  const partA = sections.find((s) => s.partLabel === "Part A");
  const partB = sections.find((s) => s.partLabel === "Part B");
  if (partA) {
    const partABody = text.slice(partA.end, partB ? partB.index : text.length);
    const re =
      /\\textbf\{([A-Z])(\d+)\.\}\s*\((\d+)\s*pts?\)\s*([\s\S]*?)(?=\\textbf\{[A-Z]\d+\.\}|\\section\*|\\subsection\*|$)/g;
    let m;
    while ((m = re.exec(partABody))) {
      num++;
      probs.push({
        num,
        title: `Part A — A${m[2]}`,
        section: "Part A",
        points: parseInt(m[3], 10),
        prompt: cleanBody(m[4]),
        parts: [],
      });
    }
  }
  const subsecRe = /\\subsection\*\{Problem\s+([A-Z]\d+)\s*---\s*([^()]+?)\s*\((\d+)\s*pts?\)\}/g;
  const subMatches = [];
  let m;
  while ((m = subsecRe.exec(text))) {
    subMatches.push({ probId: m[1], title: m[2].trim(), points: parseInt(m[3], 10), start: m.index, end: subsecRe.lastIndex });
  }
  for (let i = 0; i < subMatches.length; i++) {
    const cur = subMatches[i];
    const nextStart = i + 1 < subMatches.length ? subMatches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    const section = sectionForIndex(sections, cur.start);
    const parts = extractParts(body);
    let promptRaw = body;
    const firstMarker = body.search(/\\begin\{enumerate\}/);
    if (firstMarker !== -1) promptRaw = body.slice(0, firstMarker);
    num++;
    probs.push({
      num,
      title: deLatex(cur.title),
      section,
      points: cur.points,
      prompt: cleanBody(promptRaw),
      parts,
    });
  }
  return probs;
};

const parseVariantD = (text) => {
  const sections = findSections(text);
  const probs = [];
  let num = 0;
  const re = /\\textbf\{([A-Z])(\d+)\.\\?\s*([^}]*?)\((\d+)\s*pts?\)\}/g;
  const matches = [];
  let m;
  while ((m = re.exec(text))) {
    matches.push({
      letter: m[1],
      n: m[2],
      title: m[3].trim().replace(/\.$/, "").trim(),
      points: parseInt(m[4], 10),
      start: m.index,
      end: re.lastIndex,
    });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    const section = sectionForIndex(sections, cur.start);
    const parts = extractParts(body);
    let promptRaw = body;
    const firstMarker = body.search(/\\begin\{enumerate\}/);
    if (firstMarker !== -1) promptRaw = body.slice(0, firstMarker);
    num++;
    const titleClean = deLatex(cur.title || `${cur.letter}${cur.n}`);
    probs.push({
      num,
      title: titleClean || `${cur.letter}${cur.n}`,
      section,
      points: cur.points,
      prompt: cleanBody(promptRaw),
      parts,
    });
  }
  return probs;
};

const parseSolutionsForVariant = (variantId, solText) => {
  switch (variantId) {
    case "A":
      return parseSolutionsByCommand(solText, "prob");
    case "B":
    case "E":
      return parseSolutionsByCommand(solText, "question");
    case "C":
      return parseSolutionsVariantC(solText);
    case "D":
      return parseSolutionsVariantD(solText);
    default:
      return [];
  }
};

const parseSolutionsByCommand = (text, command) => {
  const re = new RegExp(`\\\\${command}\\{(\\d+)\\}\\{([^}]*)\\}`, "g");
  const matches = [];
  let m;
  while ((m = re.exec(text))) matches.push({ start: m.index, end: re.lastIndex });
  const out = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    out.push({ num: i + 1, ...extractSolutionParts(body) });
  }
  return out;
};

const parseSolutionsVariantC = (text) => {
  const out = [];
  let num = 0;
  const sections = findSections(text);
  const partA = sections.find((s) => s.partLabel === "Part A");
  const partB = sections.find((s) => s.partLabel === "Part B");
  if (partA) {
    const partABody = text.slice(partA.end, partB ? partB.index : text.length);
    const re =
      /\\textbf\{([A-Z])(\d+)\.\}\s*([\s\S]*?)(?=\\textbf\{[A-Z]\d+\.\}|\\section\*|\\subsection\*|$)/g;
    let m;
    while ((m = re.exec(partABody))) {
      num++;
      out.push({ num, parts: [], whole: cleanBody(m[3]) });
    }
  }
  const subsecRe = /\\subsection\*\{Problem\s+[A-Z]\d+\s*---\s*[^}]*\}/g;
  const subMatches = [];
  let m;
  while ((m = subsecRe.exec(text))) subMatches.push({ start: m.index, end: subsecRe.lastIndex });
  for (let i = 0; i < subMatches.length; i++) {
    const cur = subMatches[i];
    const nextStart = i + 1 < subMatches.length ? subMatches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    num++;
    out.push({ num, ...extractSolutionParts(body) });
  }
  return out;
};

const parseSolutionsVariantD = (text) => {
  const re = /\\textbf\{([A-Z])(\d+)\.\\?\s*([^}]*)\}/g;
  const matches = [];
  let m;
  while ((m = re.exec(text))) matches.push({ start: m.index, end: re.lastIndex });
  const out = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].start : findEndOfDocument(text);
    const body = text.slice(cur.end, nextStart);
    out.push({ num: i + 1, ...extractSolutionParts(body) });
  }
  return out;
};

const extractSolutionParts = (body) => {
  const parts = [];
  const partlabelRe = /\\partlabel\{([a-z])\}\{(\d+)\}/g;
  if (partlabelRe.test(body)) {
    partlabelRe.lastIndex = 0;
    const matches = [];
    let m;
    while ((m = partlabelRe.exec(body))) {
      matches.push({ label: m[1], start: m.index, end: partlabelRe.lastIndex });
    }
    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const nextStart = i + 1 < matches.length ? matches[i + 1].start : body.length;
      let txt = body.slice(cur.end, nextStart).replace(/^\s*\\quad\s*/, "");
      parts.push({ label: `(${cur.label})`, text: cleanSolutionText(txt) });
    }
    return { parts, whole: cleanSolutionText(body) };
  }
  const boldPartRe = /\\textbf\{\s*\(([a-z])\)([^}]*)\}/g;
  const boldMatches = [];
  let m;
  while ((m = boldPartRe.exec(body))) {
    boldMatches.push({ label: m[1], inlineExtra: m[2], start: m.index, end: boldPartRe.lastIndex });
  }
  if (boldMatches.length > 0) {
    for (let i = 0; i < boldMatches.length; i++) {
      const cur = boldMatches[i];
      const nextStart = i + 1 < boldMatches.length ? boldMatches[i + 1].start : body.length;
      const inlineExtra = (cur.inlineExtra || "").trim();
      let txt = body.slice(cur.end, nextStart);
      if (inlineExtra) txt = `**${inlineExtra}**` + txt;
      parts.push({ label: `(${cur.label})`, text: cleanSolutionText(txt) });
    }
    return { parts, whole: cleanSolutionText(body) };
  }
  return { parts, whole: cleanSolutionText(body) };
};

const cleanSolutionText = (s) =>
  s
    .replace(/\\boxedans\{/g, "\n**Answer.** ")
    .replace(/\\fbox\{([\s\S]*?)\}/g, "$1")
    .replace(/\\begin\{shaded\}/g, "")
    .replace(/\\end\{shaded\}/g, "")
    .replace(/\\begin\{itemize\}\[[^\]]*\]/g, "")
    .replace(/\\begin\{itemize\}/g, "")
    .replace(/\\end\{itemize\}/g, "")
    .replace(/\\item\s+/g, "- ")
    .replace(/\\textbf\{([^}]*)\}/g, "**$1**")
    .replace(/\\emph\{([^}]*)\}/g, "_$1_")
    .replace(/\\textit\{([^}]*)\}/g, "_$1_");

const finalizeSolutionText = (s) => cleanBody(s);

const attachSolutions = (problems, solutionBlocks) => {
  for (const prob of problems) {
    const solBlock = solutionBlocks.find((b) => b.num === prob.num);
    if (!solBlock) {
      warn(`no solution block for problem ${prob.num}`);
      continue;
    }
    if (prob.parts.length === 0) {
      if (solBlock.whole && solBlock.whole.trim()) {
        prob.parts = [
          {
            label: "(answer)",
            points: prob.points,
            prompt: "",
            modelAnswer: finalizeSolutionText(solBlock.whole),
          },
        ];
      }
      continue;
    }
    for (const part of prob.parts) {
      const solPart = solBlock.parts.find((p) => p.label === part.label);
      if (solPart) {
        part.modelAnswer = finalizeSolutionText(solPart.text);
      } else {
        if (solBlock.parts.length === 0 && solBlock.whole) {
          part.modelAnswer = finalizeSolutionText(solBlock.whole);
        } else {
          warn(`no solution match for problem ${prob.num} part ${part.label}`);
          part.modelAnswer = "";
        }
      }
    }
  }
};

const parseVariant = async (variant) => {
  const { id, title } = variant;
  const examTex = await readTex(`final-${id}.tex`);
  const solTex = await readTex(`final-${id}-solutions.tex`);
  const quantileTable = extractQuantileTable(examTex);
  let problems;
  switch (id) {
    case "A":
      problems = parseProbStyle(examTex, "prob");
      break;
    case "B":
    case "E":
      problems = parseProbStyle(examTex, "question");
      break;
    case "C":
      problems = parseVariantC(examTex);
      break;
    case "D":
      problems = parseVariantD(examTex);
      break;
    default:
      problems = [];
  }
  const solutionBlocks = parseSolutionsForVariant(id, solTex);
  attachSolutions(problems, solutionBlocks);
  const total = problems.reduce((s, p) => s + p.points, 0);
  if (total !== 100) warn(`variant ${id}: total points = ${total}, expected 100`);
  return {
    out: { variantId: id, title, totalPoints: 100, timeMinutes: 150, quantileTable, problems },
    total,
    count: problems.length,
  };
};

const main = async () => {
  await mkdir(OUT_DIR, { recursive: true });
  const summary = [];
  for (const v of VARIANTS) {
    try {
      const { out, total, count } = await parseVariant(v);
      const path = join(OUT_DIR, `final-${v.id}.json`);
      await writeFile(path, JSON.stringify(out, null, 2) + "\n", "utf8");
      summary.push({ id: v.id, count, total, path });
      process.stderr.write(`final-${v.id}: ${count} problems, ${total} pts -> ${path}\n`);
    } catch (e) {
      warn(`variant ${v.id} failed: ${e.message}`);
    }
  }
  console.log(JSON.stringify(summary, null, 2));
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

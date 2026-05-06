# Super Prompt — Build "StatInf Tutor" for Jonah Aden

> Paste this entire file as the first message in a fresh Claude Code session run from `/Users/jonah/dev/school/StatInference/`. The session that receives this prompt is responsible for **planning first** (architecture, file tree, agent decomposition), then **executing the plan with multiple sub-agents in parallel**. Do not start coding before the plan is reviewed.

---

## 1. Who you are working for

- **User:** Jonah Aden (`adenjonah@gmail.com`)
- **Course:** STAT GU4204 *Statistical Inference*, Columbia University, Spring 2026
- **Instructor:** Dr. Banu Baydil; lecture notes by Prof. Bodhisattva Sen
- **Textbook:** DeGroot & Schervish, *Probability and Statistics*, 4th ed.
- **Final exam:** in-class, **cumulative**, **50% of course grade**, scheduled by Friday May 15, 2026.
- **Time available before exam:** **~3 days from session start** (≈ 24 study-hours).
- **Jonah's profile:** strong intuitive grasp of statistics; **weak on technical machinery** — math notation, symbol manipulation, formal definitions, structure of inference proofs, DeGroot's specific conventions, and multi-part problem decomposition. He is a junior developer who learns best through reading + active practice, not lecture.

Your job: build a **fully-featured, adaptive, AI-graded tutoring website** that takes Jonah from where he is to "ready for any plausible final exam" in 3 days.

## 2. Mission (one sentence)

Ship a Next.js + Vercel app at `/Users/jonah/dev/school/StatInference/tutor/` that delivers a personalized 3-day curriculum for STAT GU4204, grades short-answer responses via OpenAI, adapts content based on Jonah's performance, and culminates in timed mock finals built from the 5 existing exam variants in `exam-prep/final-versions/`.

## 3. Hard constraints (non-negotiable)

| Constraint | Value |
|---|---|
| **Tech stack** | Next.js 15 App Router + TypeScript + Tailwind + **shadcn/ui** + KaTeX (`react-katex` or `better-react-mathjax`) |
| **Deployment** | Vercel (production target); local dev via `pnpm dev` or `npm run dev` |
| **AI grading** | OpenAI API. Jonah will provide `OPENAI_API_KEY` in `.env.local`. Use `gpt-4.1` or `gpt-4o` (whichever is currently best for math reasoning at session time). |
| **Persistence** | **Vercel KV** (preferred) or Vercel Postgres via the Vercel Marketplace integration. Stores: progress, mastery scores, weak-area weights, graded responses, end-of-day reports. |
| **Repo location** | `/Users/jonah/dev/school/StatInference/tutor/` (new subfolder; sibling to `chunks/`, `exam-prep/`, `homework/`, `reference/`) |
| **Math rendering** | KaTeX (NOT MathJax, unless KaTeX fails on a specific construct) — fast, SSR-friendly |
| **Auth** | None. Single-user app. No login screen. Optional: a soft "name" check at first visit to personalize copy (Jonah). |
| **Mobile** | Responsive layout required (Jonah may study on his phone). Don't optimize for mobile-only, but don't break it either. |

## 4. Content sources (all already in this repo — read first, do not re-derive)

The implementing session must spend the **first agent invocation** auditing these files and building an internal "content map." Do not skip this — half the value comes from leveraging what's already there.

### Course chunks (RAG-ready markdown)
- `chunks/00-course-info.md` … `chunks/16-hypothesis-testing.md` — 17 topical chunks
- `chunks/homework-1-problems.md` … `chunks/homework-4-problems.md` — Baydil's actual HW problems
- `chunks/textbook-rag/` — DeGroot & Schervish reference material (per-chapter solution guidance)

### Existing exams (use as Day 3 mock tests, not as Day 1 content)
- `exam-prep/final-versions/final-A.tex` … `final-E.tex` — 5 distinct 100-point predicted finals
- `exam-prep/final-versions/final-X-solutions.tex` — full worked solutions per variant
- `exam-prep/final-versions/_design-brief.md` — the audit-derived design brief; topic weights, Baydil voice template, DeGroot conventions, common pitfalls
- `exam-prep/final-versions/README.md` — variant personalities + recommended order
- `exam-prep/cheatsheet.md` — Jonah's hand-curated 1-page cheat sheet (everything he deemed essential)
- `exam-prep/practice-midterm.tex`, `exam-prep/mock-midterm.tex` — earlier practice that Jonah said was "off the ball" (use as negative examples — what NOT to copy)

### Reference PDFs
- `reference/STAT_GU4204_08.pdf` — Sen's full hypothesis-testing notes
- `reference/HWs_Spring_2026.pdf` — Baydil's master HW document
- `reference/Additional_Ex_Sol.pdf` — solutions to additional/HW2 exercises
- `reference/terms-and-symbols.md` — glossary

### Submitted student work (for tone/level calibration)
- `homework/hw1/HW1_Sol.pdf`, `homework/hw3/hw3-solutions.tex`, `homework/hw4/hw4-solutions.tex`

### Course context
- `CLAUDE.md` — the StatInference repo instructions
- Topic weight target for the final (per the design brief): HT 40–45% / pre-midterm 20–30% / CIs 15–18% / Cramer-Rao 10–12%

## 5. Feature spec

### 5.1 Three-day curriculum structure (default; the placement quiz may shorten it)

Day 1 — **Foundations** (≈8h):
- Notation primer (∇, θ, Ω, sup, ‖·‖, ⊥, →ᵖ, →ᵈ — full glossary with hover-explanations)
- DeGroot conventions enforcement module (Exp rate, Geom from 0, χ²_d = Gamma(d/2, 1/2), Gamma rate)
- Probability review (chunks 01–04): convergence, CLT, WLLN, Chebyshev, delta method
- Estimation framework (chunks 05–07): MoM, MLE, MLE invariance, pathologies (Uniform(0,θ))
- Day 1 quiz block + end-of-day report

Day 2 — **Inference theory** (≈8h):
- Estimation principles (chunks 09–10): MSE/bias-variance, sufficiency, factorization, Rao-Blackwell
- Bayesian (chunk 11): conjugate priors, posteriors, Bayes estimators
- Sampling distributions (chunk 12): χ², t, F, independence of X̄ and s²
- Confidence intervals (chunk 13): pivots, t-CIs, sample size
- Cramer-Rao (chunk 14): Fisher info, score, regularity conditions, efficiency
- Day 2 quiz block + end-of-day report

Day 3 — **Hypothesis testing + mock finals** (≈8h):
- Hypothesis testing (chunk 16): Type I/II, power, p-value, NP lemma, UMP, t-test, two-sample t, F-test, LRT, Wilks, test/CI duality
- "Multi-part problem decomposition" stage — strategic walkthrough of how to attack a Baydil HW-style scaffolded problem
- Mock finals (variants A–E) — timed 2.5h each, picked adaptively
- Final review of Jonah's persistent weak-area list + last-minute drills

### 5.2 Stage structure (every sub-stage uses this template)

Each stage is a route under `/stages/[stage-id]` with these sections:

1. **Reading** — formatted markdown from the relevant chunk(s), KaTeX-rendered math, callout boxes for Baydil-specific quirks. Inline "click to reveal" definitions for jargon.
2. **Worked example(s)** — 1–2 fully worked DeGroot or HW-style problems, broken into (a)(b)(c)(d) with each step revealable on click. Mirrors Baydil's scaffolded style.
3. **Multiple-choice quiz** — 5–10 questions. Auto-graded. Distractors include common Baydil-pitfalls (one-sided vs two-sided, σ known vs unknown, Exp rate vs scale).
4. **Short-answer quiz** — 2–4 questions. Graded by OpenAI (see §5.4). Asks for derivations, proofs, or interpretive answers.
5. **Stage gate** — must hit ≥80% mastery (weighted average of MC and AI grades) to unlock next stage. If <80%, generate a remediation set targeting the specific concepts missed.

### 5.3 Adaptive engine (all 4 features required)

1. **Diagnostic placement quiz** — Stage 0, ~30 min, 25–30 questions across all topics. Calibrates initial mastery vector.
2. **Per-stage mastery threshold** — 80% to advance. Sub-80% triggers AI-generated remediation problems on missed concepts.
3. **Re-weighting** — every wrong answer (MC or AI-graded) adds weight to that topic in the persistent `weakAreas` table. Subsequent stages and Day 3 mock finals weight problem generation by these weights.
4. **End-of-day report** — Markdown summary with: mastery heatmap, top 3 weak topics, recommended overnight reading (from `chunks/`), and tomorrow's revised plan.

### 5.4 OpenAI short-answer grading

For every short-answer submission:
- **Server-side** API route (Next.js Route Handler) calls OpenAI with:
  - System prompt: "You are an expert grader for STAT GU4204 at Columbia. Use DeGroot conventions (Exp rate-parameterized, Geom from 0, χ²_d = Gamma(d/2, 1/2)). Grade the student's answer against the model answer."
  - User prompt: question + model answer + Jonah's response
  - Structured JSON output with: `score` (0–100), `reasoning` (1–2 sentences), `concepts_correct` (string[]), `concepts_missing` (string[]), `model_answer_diff` (markdown showing where Jonah's answer diverged from the model). Use the OpenAI `response_format: { type: "json_schema" }` mode.
- Cache responses (key = hash of (question_id, response_text)) to avoid re-charges.
- Show all four feedback components in the UI: numerical grade, reasoning, concept breakdown, and model-answer diff.

### 5.5 Tutor chat (persistent panel)

- Floating drawer or sidebar available on every page.
- Backed by OpenAI with a RAG-light approach: at chat start, inject the relevant chunk content (whatever stage Jonah is currently on, plus the cheatsheet) as system context. For "ad hoc" questions, pre-fetch by simple keyword matching against `chunks/*.md` filenames + headings, inject top-2 matches.
- Chat history persists per stage (KV).
- Latency budget: 200ms first token target; show streaming output.

### 5.6 Day 3 mock finals

- All 5 variants (A–E) available from the `exam-prep/final-versions/` directory.
- Site renders the `.tex` content via KaTeX (parse a simplified subset; alternatively, embed the compiled PDF in an iframe with a separate input form for student responses).
- Default order: **E first** (most-likely), then A. If Jonah scores <90% mastery on E, drill D (HT-centered). Then drill weak-area-targeted variants (B if theory weak, C if computation weak).
- Each variant timed at 150 min (configurable). Save running clock to KV so refresh doesn't lose state.
- After submission: AI-graded, feedback per problem, then concept-rollup that updates `weakAreas` heavily.

### 5.7 Persistence schema (Vercel KV — JSON values keyed by stable IDs)

- `user:jonah:profile` — name, current stage, total time studied
- `user:jonah:mastery` — `{ topicId: scoreNumber }` (0–100 mastery per topic)
- `user:jonah:weakAreas` — `{ conceptId: weight }` (weight 0–10; biases future question generation)
- `user:jonah:stageProgress` — `{ stageId: { state: 'locked|in_progress|complete', score, attempts } }`
- `user:jonah:gradingCache` — `{ hash: { score, reasoning, ... } }`
- `user:jonah:dailyReports` — `[{ date, summary, weakAreas, recommendedReading }]`
- `user:jonah:chatHistory:{stageId}` — chat threads per stage

Use a single typed wrapper module (`lib/kv.ts`) with Zod schemas so the storage shape is enforceable.

## 6. UI / UX rules

- Single-line top nav: course title, current day badge, total study time, mastery score (live), Settings.
- Left sidebar: stage list with locks/checkmarks/in-progress indicators.
- Main content area: stage content. KaTeX-rendered math. Code/formula blocks copiable.
- Right (or floating) drawer: Tutor Chat.
- Bottom bar on quiz pages: progress within stage, "Save & continue" button.
- Color/visual hierarchy: shadcn neutrals; one accent color (Columbia blue ok). No emoji unless Jonah explicitly enables a "fun mode" toggle.
- Math display: KaTeX inline + display modes; prefer inline `$x$` and `$$x$$` patterns rendered cleanly.
- Long reading sections: break into ~300-word "blocks" with progress dots so Jonah feels forward motion.

## 7. Required execution methodology

### 7.1 Plan first — DO NOT START CODING

The session that receives this prompt must:

1. **Read every referenced file in §4.** No skipping. This is mandatory pre-work.
2. **Produce a written plan** containing:
   - File tree for `tutor/` (every directory and key file)
   - Database schema (Vercel KV keys + Zod types)
   - Route map (every Next.js route + which component it renders)
   - Sub-agent decomposition (which agents will build which pieces, in what order, in parallel where possible)
   - Stage manifest (the full 3-day list of stages with topic IDs, source chunks, estimated time, difficulty)
   - OpenAI prompt templates (one for grading, one for tutor chat, one for question generation)
   - Risks + mitigations (rate limits, KV cold start, KaTeX failures on certain LaTeX, exam.tex parsing)
3. **Show the plan** with `ExitPlanMode`. Wait for Jonah's approval before starting.
4. After approval: dispatch sub-agents.

### 7.2 Sub-agent strategy (parallel where possible)

The plan must use multiple sub-agents. Recommended decomposition (adapt as needed):

| Agent | Responsibility | Parallelizable with |
|---|---|---|
| **Scaffold agent** | `npm create next-app`, Tailwind, shadcn init, KaTeX setup, Vercel KV provisioning, `.env.local` template | (none — must run first) |
| **Content extraction agent** | Convert each `chunks/*.md` into a stage data file with parsed math, headings, examples extracted for re-use in quizzes | Quiz generation, exam parsing |
| **Quiz generation agent** | For each stage, use OpenAI to generate MC + short-answer questions matched to Baydil's pitfall list. Save to `tutor/data/questions/*.json`. Verify each MC has exactly one correct answer. | Content extraction, exam parsing |
| **Exam parsing agent** | Parse the 5 final-versions/*.tex into structured JSON (problem statements, point values, solutions). Render-friendly format for KaTeX. | Quiz generation, content extraction |
| **UI/component agent** | Build shadcn-based components: StageReader, MCQuiz, ShortAnswerQuiz, MasteryBar, DailyReport, TutorChat, MockExamRunner | After scaffold |
| **API/grading agent** | Implement Next.js Route Handlers for grading, chat, question generation. Implement caching, streaming, error handling | After scaffold |
| **Adaptive engine agent** | Implement diagnostic placement, mastery threshold, weak-area weighting, end-of-day report generator | After API + UI |
| **Integration/QA agent** | End-to-end manual walk-through: take diagnostic, do stage 1, fail a question on purpose, verify remediation, etc. Report bugs. | Last |

Use `Agent` calls in parallel where their work doesn't depend on each other's outputs. Quiz generation, exam parsing, and content extraction can all run simultaneously after scaffold.

### 7.3 Verification gates

Before declaring done:
- `npm run typecheck` passes (zero errors)
- `npm run lint` passes
- `npm run build` succeeds (production build)
- Local `npm run dev` boots; the diagnostic quiz can be taken end-to-end; one stage can be completed; one short answer is graded by OpenAI; the tutor chat returns a reasonable response
- All 5 mock exam variants render in the UI without LaTeX parse errors
- Mobile viewport (Chrome DevTools 390×844) shows usable layout
- Vercel KV smoke test: write/read/delete one key cleanly

If any verification fails, the corresponding sub-agent must fix it before the integration agent reports done.

## 8. Coding standards (per Jonah's CLAUDE.md)

- TypeScript strict mode
- No `any` — use `unknown` and narrow
- 200–400 lines per file; split when approaching
- One component/function per file; small helpers OK
- No hardcoded secrets — `.env.local` only
- Tailwind utility-first; shadcn components for primitives
- Use `next/font` for typography
- Use `next/image` for any images
- Server components by default; mark `'use client'` only where needed
- Use server actions for grading/chat where streaming isn't required; route handlers for streaming chat

## 9. Privacy / API key handling

- `OPENAI_API_KEY` lives only in `.env.local` (gitignored) on dev and as a Vercel project env var on production.
- All OpenAI calls happen server-side. No key in client bundle.
- Cache aggressively to keep token spend down.
- Do NOT log raw graded responses to console in production builds.

## 10. Deliverables checklist

When the implementing session finishes, the following must exist:

- [ ] `tutor/` Next.js app with all features in §5
- [ ] `tutor/README.md` — how to run locally, deploy, set env vars, top up OpenAI credits if exhausted
- [ ] `tutor/data/stages.json` — manifest of all stages (Day 1 / 2 / 3 split)
- [ ] `tutor/data/questions/*.json` — generated questions per stage (MC + SA)
- [ ] `tutor/data/exams/*.json` — parsed mock exams from `final-versions/`
- [ ] All routes typed, all KV access typed, build green, lint clean
- [ ] Vercel deployment URL (after first preview deploy)
- [ ] One end-to-end screen recording or screenshot set proving the diagnostic + stage 1 + grading + chat work

## 11. Anti-goals (things NOT to do)

- ❌ Don't reproduce the practice-midterm.tex / mock-midterm.tex format (heavy fill-in-blank/T-F/MC). Jonah told us those were "off the ball." Use the `final-versions/` style instead: multi-part scaffolded computational problems with required justification.
- ❌ Don't add user accounts, login, or multi-tenant features. Single-user.
- ❌ Don't ship without testing the OpenAI grading round-trip locally.
- ❌ Don't burn OpenAI credits regenerating the same questions. Cache + commit `data/questions/*.json` so subsequent runs reuse them.
- ❌ Don't skip the diagnostic placement quiz — it's the input to all adaptive logic.
- ❌ Don't store the OpenAI API key anywhere other than `.env.local` / Vercel env vars.
- ❌ Don't hand-write the course content. Pull it from `chunks/`. The chunks are already authoritative.

## 12. Extra context — Jonah-specific

- Jonah's GitHub: `adenjonah`
- He uses macOS Apple Silicon, prefers `pnpm` if it's already available; otherwise `npm`
- He has Vercel CLI installed (`brew install vercel-cli` is set up)
- He has the courseworks-parsing tool at `~/dev/claude/courseworks-parsing` if any new course material is posted in the next 3 days
- Project notes vault: `~/notes/projects/statinference/` — log major design decisions here via the `bookkeeper` agent at the end of major milestones
- Jonah's background: junior dev (0–2 years), comfortable with React/Next.js, less so with Vercel KV. Briefly explain non-obvious choices in commit messages.

## 13. First five actions (literally in this order)

1. Read `/Users/jonah/dev/school/StatInference/CLAUDE.md` and `/Users/jonah/dev/school/StatInference/exam-prep/final-versions/_design-brief.md`.
2. Read `chunks/00-course-info.md` through `chunks/16-hypothesis-testing.md` (skim acceptable; mark which chunks need deep reading later).
3. Read `chunks/homework-{1,2,3,4}-problems.md` and `exam-prep/cheatsheet.md`.
4. Read `exam-prep/final-versions/README.md` and skim `final-E.tex` + `final-A.tex`.
5. Produce the §7.1 plan. Show it to Jonah via `ExitPlanMode`. Wait for approval.

Then, after approval, kick off the sub-agents per §7.2.

---

**End of super prompt. Good luck. Build something Jonah is proud of.**

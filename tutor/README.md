# StatInf Tutor — STAT GU4204 Exam Prep

Adaptive 3-day final exam prep for **STAT GU4204 Statistical Inference** (Columbia, Spring 2026, Prof. Banu Baydil). Final exam: **2026-05-15**.

Built for Jonah. Single-user. No auth.

## Stack

- Next.js 16 App Router · React 19 · TypeScript strict
- Tailwind CSS 4 + hand-written shadcn-style primitives
- KaTeX for math rendering (`react-katex`)
- Vercel KV (Upstash Redis) for persistent state
- OpenAI (`gpt-4o` / `gpt-4o-mini`) for short-answer grading + tutor chat

## What's in here

```
tutor/
├── data/
│   ├── content/          # Course chunks (markdown, sourced from ../chunks/)
│   ├── questions/        # Quiz JSON per stage (diagnostic.json + d1-*.json + ...)
│   ├── exams/            # 5 parsed mock finals (final-A.json … final-E.json)
│   └── stages.json       # 3-day curriculum manifest (22 stages: 1 diagnostic + 16 reading + 5 exams)
├── src/
│   ├── app/              # App Router pages + API routes
│   ├── components/       # MCQuiz, ShortAnswerQuiz, ExamRunner, TutorChat, etc.
│   └── lib/              # kv.ts, openai.ts, grading.ts, adaptive.ts, types.ts
├── scripts/
│   ├── parse-exams.mjs   # Already ran — re-run if .tex sources change
│   └── seed-questions.mjs# Generates per-stage MC + SA quizzes via OpenAI
└── .env.local.example
```

## Setup (first time)

```bash
cd /Users/jonah/dev/school/StatInference/tutor
pnpm install                      # already done by the build
cp .env.local.example .env.local
# Edit .env.local: add OPENAI_API_KEY and KV_REST_API_URL/KV_REST_API_TOKEN.
```

### Provisioning Vercel KV

```bash
vercel link                       # link this folder to a new Vercel project
vercel storage create-redis       # creates an Upstash Redis store via the marketplace
vercel env pull .env.local        # syncs the KV creds locally
```

If you can't run those (no Vercel project yet), you can also create an Upstash Redis instance directly at upstash.com and paste the REST URL + token into `.env.local`.

### Seeding stage quizzes

The diagnostic quiz is hand-curated and ready. The 16 stage quizzes need to be generated:

```bash
pnpm seed-questions               # generates all missing stages, ~$0.05–0.20 in OpenAI calls
pnpm seed-questions d1-mle        # regen one stage (force overwrite)
pnpm seed-questions --force       # regen everything
```

The script is idempotent: skips stages whose JSON already exists.

## Run locally

```bash
pnpm dev                          # http://localhost:3000
```

## Production

```bash
pnpm build && pnpm start          # local production server
vercel --prod                     # deploy to Vercel
```

Set the env vars in the Vercel dashboard (or `vercel env add ...`).

## Validation

```bash
pnpm typecheck                    # tsc --noEmit
pnpm lint                         # eslint
pnpm validate                     # both
```

## How the adaptive flow works

1. **Diagnostic** (Stage 0, ~30 min, 25 MC) — calibrates initial mastery + weakAreas vectors stored in KV.
2. **Day 1 → 2 → 3 reading stages** (16 stages, ~24h total). Each stage:
   - Reading (course chunk + Baydil-quirk callouts)
   - 5 MC + 2 SA questions
   - Auto-grading: MC binary, SA via OpenAI structured-JSON grader
   - **Mastery gate at 80%.** Below threshold → POST to `/api/remediation` for 3 targeted SA questions.
3. **Day 3 mock finals** (5 variants, 150 min each) in order **E → A → D → B → C**. Timed, resumable (state in `localStorage`). Per-part grading via the same SA grader.

## State schema (KV keys)

```
user:jonah:profile          { name, currentStageId, totalStudyMinutes, diagnosticDone }
user:jonah:mastery          { topicId: 0–100 }
user:jonah:weakAreas        { conceptId: 0–20 weight }
user:jonah:stage:{id}       { state, bestScore, attempts, conceptsMissed[], saGrades }
user:jonah:gradeCache:{h}   SHA256(question_id + student_answer) → cached grade (30d TTL)
user:jonah:dailyReports     [ { date, summary, weakAreas, recommendedReading } ]
user:jonah:chat:{stageId}   [ { role, content, ts } ] — last 40 messages
```

All schemas Zod-validated in `src/lib/types.ts`.

## OpenAI cost expectations

- **Grading 1 SA**: ~$0.005 with `gpt-4o`
- **Tutor chat turn**: ~$0.01–0.03 streaming
- **Seeding all 16 stages**: ~$0.05–0.20 with `gpt-4o-mini`
- **Full mock exam grading** (~25 parts): ~$0.10
- **End-to-end 3 days**: maybe $5 if used heavily

Grading responses are cached by `SHA256(questionId + answer)` so re-grading the same answer is free.

## Conventions enforced everywhere

DeGroot 4e parameterizations:

- Exp(θ) is **rate**: $f(x;\theta) = \theta e^{-\theta x}$, $E[X]=1/\theta$
- Geom(p) starts at **0**: support $\{0, 1, 2, \ldots\}$
- $\chi^2_d = \text{Gamma}(d/2, 1/2)$
- $t_d = Z/\sqrt{V/d}$ with $Z \perp V$, $V \sim \chi^2_d$

Common Baydil pitfalls embedded in distractors / called out in callouts:

1. σ known (z) vs σ unknown (t)
2. One-sided vs two-sided p-values
3. Type I sup over $\Omega_0$
4. Support depending on θ → CRLB regularity (A.1) fails
5. Delta method requires $g'(\theta) \neq 0$
6. Test/CI duality: invert acceptance region

## Troubleshooting

- **"KV_REST_API_URL missing"** → add Upstash Redis creds to `.env.local`.
- **"Diagnostic not seeded yet"** → file `data/questions/diagnostic.json` is missing; check git.
- **Math doesn't render** → verify KaTeX CSS imported in `src/app/layout.tsx`.
- **Stage shows "no questions"** → run `pnpm seed-questions <stageId>`.
- **Build fails with webpack error** → Next 16 uses Turbopack by default.

## Status

Built 2026-05-06. Phase 1–4 complete; mock exams parsed; diagnostic curated; stage quizzes ready to seed via OpenAI.

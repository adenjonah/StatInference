# STAT GU4204 Final Exam — Design Brief (Shared Context)

## Course & Exam Reality

- **Course:** STAT GU4204 Statistical Inference, Columbia, Spring 2026
- **Instructor:** Prof. Banu Baydil (lecture notes by Prof. Bodhisattva Sen)
- **Textbook:** DeGroot & Schervish, *Probability and Statistics*, 4th ed.
- **Final exam:** in-class, **CUMULATIVE**, **50%** of course grade, by 2026-05-15
- **Time:** ~2.5 hours (150 min) — write the exam to fit this
- **Total points:** 100
- **Allowed:** 1 page (8.5×11) double-sided **hand-written** cheat sheet; probability tables provided
- **NOT allowed:** Calculators, computers, books, notes, phones

## Topic Weights for Final (Best Estimate)

| Area | Weight |
|---|---|
| Hypothesis testing (Ch 9 / lecture 10) — NP, UMP, LRT, t-tests, F-test, Type I/II, power | **40-45%** |
| Pre-midterm review: MLE, MOM, sufficiency, Bayesian, delta method, CLT | **20-30%** |
| Confidence intervals (incl. test/CI duality) | **15-18%** |
| Cramer-Rao / Fisher information / efficiency | **10-12%** |

## DeGroot Conventions (CRITICAL — error sources)

- **Exponential:** Exp(θ) = θe^(−θx) (RATE param), E = 1/θ, Var = 1/θ²
- **Gamma(α, β):** rate parameterization, E = α/β, Var = α/β²
- **Geometric(p):** PMF = p(1−p)^x, support x = 0, 1, 2, ...
- **χ²_d:** = Gamma(d/2, 1/2); E = d, Var = 2d
- **t-distribution:** t_d = Z/√(V/d), Z⊥V, V~χ²_d

## Baydil's Voice — Phrasing Template

- "Let X₁, …, Xₙ be a random sample from [distribution] where [parameter] is unknown."
- "(a) Find the maximum likelihood estimator of θ." (spell out "MLE")
- "(b) Is θ̂ unbiased for θ? Justify your answer."
- "(c) Using the factorization criterion, show that T = ... is sufficient for θ."
- "(d) Compute the Fisher information I_n(θ) in the sample. Is θ̂ efficient?"
- For testing: "Test H₀: ... versus H₁: ... at significance level α₀ = 0.05."
- For CIs: "Construct a 95% confidence interval for θ."
- "Show all work to get full credit."

## Format Rules (from Question-Style Audit)

**DO:**
- Multi-part scaffolded problems (a)–(d) that build sequentially
- Provide critical values up front: z_{0.025}=1.96, z_{0.05}=1.645, z_{0.005}=2.576, t-values, χ², F as needed
- Use formal "random sample" / "i.i.d." setup
- Require justification on every step
- Group related concepts into one big problem (e.g., MLE → sufficiency → Fisher info → CI all in one 20-pt problem)

**DON'T:**
- Spam fill-in-the-blank or T/F questions (≤8 pts total, justification required if used)
- Multiple-choice (Baydil never uses this)
- Single-step "find X" problems with no scaffold
- Ask numerical answers without showing intermediate steps

## Recommended Structure (per variant — adapt to personality)

- **Part A — Short conceptual** (8–12 pts): 2–4 short questions with 1–2 sentence justifications
- **Part B — Mid-length problems** (25–35 pts): 2–3 problems, each ~12 pts, multi-part
- **Part C — Major problems** (50–60 pts): 3–4 big problems, each 15–20 pts, fully scaffolded

## Common Pitfalls to Test (Baydil-aligned)

1. **σ known (z) vs σ unknown (t)** — different critical values
2. **One-sided vs two-sided p-value** (factor of 2)
3. **Type I error**: sup over Ω₀; **Type II**: sup over Ω₁ (composite)
4. **Support depends on θ** → Cramer-Rao A.1 fails (e.g., Uniform(0,θ))
5. **g'(θ) = 0** → delta method fails (e.g., g(x)=x² at θ=0)
6. **Exp(θ) parameterization** — rate not scale
7. **Test/CI duality** — invert acceptance region

## Required Topic Coverage Across All 5 Variants

Each variant must include AT LEAST:
- 1 problem on MLE + properties (sufficiency or efficiency)
- 1 problem on a hypothesis test (any type)
- 1 problem on Type I / Type II / power
- 1 problem on CIs OR test/CI duality
- 1 problem from pre-midterm content (probability / convergence / Bayesian / delta method)

But each variant emphasizes its personality — see individual prompts.

## Quantile Table to Reference (provide top of exam)

```
z_{0.10} = 1.282    z_{0.05} = 1.645    z_{0.025} = 1.960    z_{0.01} = 2.326    z_{0.005} = 2.576

t_{0.025, 7} = 2.365    t_{0.025, 8} = 2.306    t_{0.025, 9} = 2.262    t_{0.025, 14} = 2.145
t_{0.025, 15} = 2.131   t_{0.025, 19} = 2.093   t_{0.025, 24} = 2.064
t_{0.05, 8} = 1.860     t_{0.05, 14} = 1.761    t_{0.05, 19} = 1.729

χ²_{0.95, 7} = 14.07    χ²_{0.95, 8} = 15.51    χ²_{0.05, 8} = 2.733
χ²_{0.975, 9} = 19.02   χ²_{0.025, 9} = 2.700

F_{0.05, 4, 4} = 6.39   F_{0.05, 7, 7} = 3.79   F_{0.025, 7, 7} = 4.99   F_{0.975, 7, 7} = 1/F_{0.025, 7, 7} = 0.20
```

## File Output Convention

Each variant produces TWO files:
- `final-{X}.tex` — student-facing exam (questions only, with name/UNI lines, instructions)
- `final-{X}-solutions.tex` — full solutions with derivations
- Both should compile cleanly via: `cd /Users/jonah/dev/school/StatInference/exam-prep/final-versions && /Library/TeX/texbin/pdflatex -interaction=nonstopmode <file>.tex`

## Variant Personalities

- **A — Predictable Standard:** Closest mimic of midterm style; balanced cumulative; medium difficulty; the "default" exam
- **B — Theory-Heavy / Proof-Centric:** More derivations and theorem applications; harder; tests concepts deeply
- **C — Computation-Heavy / Numerical:** Concrete data, lots of arithmetic; less symbolic; tests fluency with formulas
- **D — Hypothesis-Testing Centered:** ~60% post-midterm Ch 9; deep on NP/UMP/LRT; pre-midterm only as supporting questions
- **E — Hybrid Most-Likely:** Best guess of Baydil's actual final; multi-part chains; the "high-confidence prediction" version

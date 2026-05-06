# STAT GU4204 — Final Exam Practice (5 Variants)

Five distinct predicted versions of the cumulative final exam, each calibrated against research into Prof. Baydil's HW style, the lecture notes, and the syllabus.

## Exam reality (from the syllabus)
- **Cumulative**, in-class, **50% of course grade**
- Last day for finals: **Friday, May 15, 2026**
- ~2.5 hours, **calculators NOT allowed**, 1-page double-sided hand-written cheat sheet allowed, probability tables provided
- One midterm only (March 31, 30%); the final covers everything

## Topic weights used across all variants
| Area | Target weight |
|---|---|
| Hypothesis testing (Ch 9 / lecture 10) | 40–45% |
| Pre-midterm review (MLE, MOM, sufficiency, Bayesian, delta method, CLT) | 20–30% |
| Confidence intervals (incl. test/CI duality) | 15–18% |
| Cramer-Rao / Fisher info / efficiency | 10–12% |

## The five variants

| File | Personality | Difficulty | Use when... |
|---|---|---|---|
| **`final-A.{tex,pdf}`** | **Predictable Standard** — closest mimic of Baydil's style. Balanced cumulative. | Medium | First pass / baseline |
| **`final-B.{tex,pdf}`** | **Theory-Heavy / Proof-Centric** — derivations, theorem statements, "show that..." problems | Hard | After you can compute, want to test concepts |
| **`final-C.{tex,pdf}`** | **Computation-Heavy / Numerical** — concrete data, t/F/χ² with given numbers | Medium | Speed/fluency drill; testing ability to plug-and-chug |
| **`final-D.{tex,pdf}`** | **Hypothesis-Testing Centered** — ~88% HT (NP / UMP / LRT / t / F), HW4 reuse | Medium-Hard | Final week before exam; lock in HT |
| **`final-E.{tex,pdf}`** | **Hybrid / Most-Likely** — best prediction of Baydil's actual final | Medium | The single best prep doc |

Each variant has `final-X.pdf` (student-facing exam, 100 pts) and `final-X-solutions.pdf` (full worked solutions).

## Recommended study order
1. **E first** — best calibration; treat as the exam itself
2. **A** — alternative phrasing, similar coverage
3. **D** — drill the new (post-midterm) material
4. **B** — stretch on theory/proofs
5. **C** — speed and arithmetic check the day before

## What I corrected from the practice midterm
The user said the prior practice midterm was "off the ball." Per a question-style audit:
- Practice midterm overweighted fill-in-blank / T-F / MC (low-value recall ~30% of points) → **Baydil never uses these**
- These finals heavily weight multi-part computational scaffolds (Part B/C ≈ 90 pts) per Baydil's HW pattern
- Required justification on every step (no "circle T or F, no justification needed")
- DeGroot conventions enforced: Exp(θ) is rate-parameterized, Geometric starts at 0, χ²_d = Gamma(d/2, 1/2)

## Compile a single variant
```bash
cd /Users/jonah/dev/school/StatInference/exam-prep/final-versions
/Library/TeX/texbin/pdflatex -interaction=nonstopmode final-E.tex
/Library/TeX/texbin/pdflatex -interaction=nonstopmode final-E-solutions.tex
```

## Design brief (for reference)
See `_design-brief.md` — the shared context document used by all 5 generation agents (Baydil's voice, format rules, quantile table, common pitfalls).

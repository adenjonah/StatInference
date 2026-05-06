# StatInference

RAG-optimized notes for **STAT GU4204: Statistical Inference** (Columbia University, Spring 2026).

## Layout

| Dir | Contents |
|------|----------|
| `homework/` | Per-assignment subdirs (`hw1/`, `hw3/`, `hw4/`) with `.tex` sources and compiled `.pdf`s |
| `exam-prep/` | Cheatsheet, mock midterms, practice exams |
| `reference/` | Master assignment PDF (`HWs_Spring_2026.pdf`), `Additional_Ex_Sol.pdf` (additional/HW2 solutions), `STAT_GU4204_08.pdf` (full Sen notes Ch 1–10), `terms-and-symbols.md` glossary |
| `chunks/` | RAG-chunked course notes (indexed below) |

## Sources

| File | Author | Content |
|------|--------|---------|
| STAT_GU4204_01.pdf | Bodhisattva Sen | Comprehensive notes: Ch 1-3 (Intro, Estimation, MLE) |
| STAT_GU4204_02.pdf | Banu Baydil | Lecture slides: Course info, Review Examples |
| STAT_GU4204_03.pdf | Banu Baydil | Lecture slides: Normal review, sample mean examples |
| STAT_GU4204_04.pdf | Banu Baydil | Lecture slides: Probability Inequalities, LLN, CLT |
| STAT_GU4204_05.pdf | Bodhisattva Sen | Comprehensive notes: Ch 4 (Estimation Principles, Sufficiency) |
| STAT_GU4204_06.pdf | Bodhisattva Sen | Comprehensive notes: Ch 5-7 (Bayesian, Sampling Distributions, Confidence Intervals) |
| STAT_GU4204_07.pdf | Bodhisattva Sen | Comprehensive notes: Ch 8-9 (Cramer-Rao, Large Sample MLE) |
| STAT_GU4204_08.pdf | Bodhisattva Sen | Comprehensive notes: Ch 10 (Hypothesis Testing) — full final-exam content |
| Additional_Ex_Sol.pdf | Course TA | Solutions to Additional Exercises (HW2/practice) |
| Midterm_Exam_Information_GU4204_S26.pdf | Banu Baydil | Midterm exam info, scope, cheat sheet rules |
| 01_19_STAT_GU4204_Syllabus_S26.pdf | Banu Baydil | Course syllabus |
| HWs_Spring_2026.pdf (5/2 update) | Banu Baydil | All homework assignments + HW4-Extra Credit |

## Chunk Index

### Course Notes & Concepts
| File | Topic | Key Concepts |
|------|-------|-------------|
| [00-course-info](chunks/00-course-info.md) | Course Logistics | Grading, textbook, TA info |
| [01-probability-review](chunks/01-probability-review.md) | Probability Review | Distributions (Bernoulli, Binomial, Poisson, Exponential, Normal, Gamma), sample mean |
| [02-convergence-and-limit-theorems](chunks/02-convergence-and-limit-theorems.md) | Convergence & Limits | Conv. in probability, conv. in distribution, WLLN, SLLN, CLT, continuous mapping theorem |
| [03-probability-inequalities](chunks/03-probability-inequalities.md) | Probability Inequalities | Markov inequality, Chebyshev inequality, tail bounds, sample size calculations |
| [04-delta-method](chunks/04-delta-method.md) | Delta Method | Asymptotic distributions of transformed estimators, Taylor expansion approach |
| [05-statistical-models](chunks/05-statistical-models-and-estimation.md) | Statistical Models | Models, parameters, parameter space, statistics, estimators, consistency |
| [06-method-of-moments](chunks/06-method-of-moments.md) | Method of Moments | MOM definition, examples (Normal, Gamma, Bernoulli, Poisson, Exponential), consistency |
| [07-maximum-likelihood](chunks/07-maximum-likelihood-estimation.md) | Maximum Likelihood | Likelihood function, MLE examples (Poisson, Uniform, Normal), invariance, consistency |
| [08-computational-methods](chunks/08-computational-methods-for-mle.md) | Computational Methods | Newton's method for MLE, EM algorithm, Gamma MLE |
| [09-estimation-principles](chunks/09-estimation-principles.md) | Estimation Principles | MSE, bias-variance decomposition, comparing estimators, unbiased, MVUE |
| [10-sufficient-statistics](chunks/10-sufficient-statistics.md) | Sufficient Statistics | Sufficiency, factorization criterion, Rao-Blackwell theorem |
| [11-bayesian-paradigm](chunks/11-bayesian-paradigm.md) | Bayesian Paradigm | Prior, posterior, Bayes estimators, conjugate priors |
| [12-sampling-distributions](chunks/12-sampling-distributions.md) | Sampling Distributions | Gamma, chi-squared, t-distribution, normal sampling, Prop 6.3 |
| [13-confidence-intervals](chunks/13-confidence-intervals.md) | Confidence Intervals | Pivots, exact/approximate CIs, t-intervals, CLT-based CIs |
| [14-cramer-rao-inequality](chunks/14-cramer-rao-inequality.md) | Cramer-Rao Inequality | Fisher information, score function, CRLB, efficiency, MVUE |
| [15-midterm-info](chunks/15-midterm-info.md) | Midterm Exam Info | Exam scope, rules, cheat sheet policy, question types |
| [16-hypothesis-testing](chunks/16-hypothesis-testing.md) | Hypothesis Testing | Type I/II errors, power function, p-value, Neyman-Pearson, UMP, t-test, F-test, LRT, test/CI duality |

### Homework & Textbook RAG
| File | Topic | Purpose |
|------|-------|---------|
| [homework-1-problems](chunks/homework-1-problems.md) | Homework 1 + Additional Exercises | Ch 6.3, 7.5, 7.6 problems; MLE, delta method, Bernoulli/Poisson/Normal inference |
| [homework-2-additional-problems](chunks/homework-2-additional-problems.md) | HW2 (Unofficial) + Additional Practice | Ch 7.7, 8.2, 8.4; sufficiency, MoM/MLE, MGF, gamma E(X³) |
| [homework-3-problems](chunks/homework-3-problems.md) | Homework 3 | Ch 8.5, 8.7, 8.8, 9.1; Fisher info, large-sample MLE, CIs, intro to testing |
| [homework-4-problems](chunks/homework-4-problems.md) | HW4 Extra Credit | Ch 9.5, 9.6, 9.10; Neyman-Pearson, UMP tests, Type I/II errors |
| [textbook-rag/](chunks/textbook-rag/) | **Textbook RAG System** | **Full DeGroot & Schervish reference with solution guidance for each HW problem** |

## Concept Cross-Reference

| Concept | Chunks |
|---------|--------|
| Sample mean | 01, 02, 03, 12 |
| Normal distribution | 01, 07, 09, 12 |
| Convergence in probability | 02, 05 |
| Law of Large Numbers | 02, 03 |
| Central Limit Theorem | 02, 13 |
| Estimator comparison | 09, 10, 14 |
| Poisson examples | 01, 06, 07, 10 |
| Bias-variance tradeoff | 09 |
| Bayesian inference | 11 |
| Chi-squared distribution | 12 |
| t-distribution | 12, 13 |
| Confidence intervals | 13, 16 (test/CI duality) |
| Fisher information | 14 |
| Cramer-Rao lower bound | 14 |
| Gamma distribution | 01, 06, 12 |
| Hypothesis testing | 16 |
| Type I / II errors, power function | 16 |
| p-value | 16 |
| Neyman-Pearson lemma, UMP tests | 16 |
| t-test, F-test, likelihood ratio test | 16 |

## Textbook

DeGroot & Schervish, *Probability and Statistics*, 4th Edition (Pearson, 2012)

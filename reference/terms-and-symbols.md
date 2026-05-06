# STAT GU4204 — Complete Terms & Symbols Guide

## GREEK LETTERS (How to Read Them)

| Symbol | Name | How to say it | What it usually means in this course |
|---|---|---|---|
| θ | theta | "THAY-tuh" | The unknown parameter we're trying to estimate |
| θ̂ | theta-hat | "theta hat" | Our GUESS (estimator) for θ |
| μ | mu | "myoo" | Population mean (true average) |
| σ | sigma | "SIG-muh" | Population standard deviation |
| σ² | sigma squared | "sigma squared" | Population variance |
| λ | lambda | "LAM-duh" | Rate parameter (Poisson, Exponential) |
| α | alpha | "AL-fuh" | Shape parameter, OR significance level, OR prior param |
| β | beta | "BAY-tuh" | Rate parameter (Gamma), OR prior parameter |
| ξ | xi | "ksee" or "zai" | Prior distribution (in Bayesian) |
| Ω | omega (capital) | "oh-MEG-uh" | Parameter space — set of all possible θ values |
| ε | epsilon | "EP-sih-lon" | A small positive number (used in limits) |
| τ | tau | "tow" (rhymes with "now") | Threshold in inequalities |
| Γ | gamma (capital) | "GAM-uh" | The Gamma function: Γ(n) = (n-1)! for integers |
| φ / ϕ | phi | "fye" or "fee" | A function (often the function defining a statistic) |
| Φ | phi (capital) | "FYE" | Standard normal CDF — Φ(z) = P(Z ≤ z) |
| Ψ | psi (capital) | "SIGH" | Pivot function |
| χ² | chi-squared | "KYE squared" | A specific distribution (see below) |
| ∝ | proportional to | "proportional to" | "equals up to a constant" — used in Bayesian |

---

## ABBREVIATIONS

| Abbreviation | Full Name | What It Means (Plain English) |
|---|---|---|
| **iid** | Independent and Identically Distributed | Each data point comes from the same distribution and they don't affect each other |
| **MLE** | Maximum Likelihood Estimator/Estimate | The guess for θ that makes your observed data most probable |
| **MOM** | Method of Moments | Estimate θ by matching sample averages to population averages |
| **MSE** | Mean Squared Error | Average squared distance between your guess and the truth — THE metric for "how good is my estimator" |
| **MVUE** | Minimum Variance Unbiased Estimator | The BEST possible unbiased estimator — lowest variance among all unbiased options |
| **CRLB** | Cramér-Rao Lower Bound | The theoretical floor — no unbiased estimator can have variance below this |
| **CI** | Confidence Interval | A range of values that we're "X% confident" contains the true parameter |
| **CLT** | Central Limit Theorem | Sample averages become approximately Normal for large n |
| **WLLN** | Weak Law of Large Numbers | Sample average converges to population mean as n grows |
| **SLLN** | Strong Law of Large Numbers | Same but stronger (almost sure convergence) |
| **CMT** | Continuous Mapping Theorem | If Xₙ converges to X, then g(Xₙ) converges to g(X) for continuous g |
| **CDF** | Cumulative Distribution Function | F(x) = P(X ≤ x) |
| **PDF** | Probability Density Function | f(x) — the "height" of the distribution curve at x |
| **PMF** | Probability Mass Function | f(x) = P(X = x) — for discrete distributions |
| **MGF** | Moment Generating Function | M(t) = E(eᵗˣ) — a tool for identifying distributions |
| **LLN** | Law of Large Numbers | General term for WLLN/SLLN |

---

## MATHEMATICAL NOTATION

### Data and Samples

| Symbol | What It Means |
|---|---|
| X₁, X₂, ..., Xₙ | Your n data points (random variables — before you observe them) |
| x₁, x₂, ..., xₙ | The actual observed numbers (lowercase = realized values) |
| **Xₙ** (bold or subscript n) | The whole sample: (X₁, ..., Xₙ) |
| n | Sample size — how many data points you have |
| X̄ or X̄ₙ | Sample mean = (1/n)ΣXᵢ = (X₁ + X₂ + ... + Xₙ)/n |
| s² | Sample variance (UNBIASED) = (1/(n-1))Σ(Xᵢ - X̄)² |
| σ̂² | MLE of variance (BIASED) = (1/n)Σ(Xᵢ - X̄)² |
| X₍₁₎ | Smallest value in sample (order statistic) |
| X₍ₙ₎ | Largest value in sample = max(X₁,...,Xₙ) |

### Summation and Product

| Symbol | What It Means | Example |
|---|---|---|
| Σ | Sum (add them up) | ΣXᵢ = X₁ + X₂ + ... + Xₙ |
| Π | Product (multiply them) | ΠXᵢ = X₁ × X₂ × ... × Xₙ |
| ΣXᵢ² | Sum of squares | X₁² + X₂² + ... + Xₙ² |
| Σ(Xᵢ-X̄)² | Sum of squared deviations | How spread out the data is around the mean |

### Convergence Arrows

| Symbol | Name | Meaning |
|---|---|---|
| →ᴾ | Converges in probability | Gets closer and closer to the target (with high probability) |
| →ᵈ | Converges in distribution | The shape of the distribution approaches a target shape |
| →ᵃ·ˢ· | Almost sure convergence | Converges with probability 1 (strongest type) |

**Hierarchy**: almost sure → in probability → in distribution (each implies the next, NOT the reverse)

**One exception**: If the limit is a CONSTANT, then convergence in distribution DOES imply convergence in probability.

### Calculus Notation

| Symbol | What It Means |
|---|---|
| ∂/∂θ | Partial derivative with respect to θ (how the expression changes as θ changes) |
| ℓ(θ) | Log-likelihood function = log of the likelihood |
| ℓ'(θ) or ℓ̇(θ) | Derivative of log-likelihood (the score function) |
| ℓ''(θ) | Second derivative of log-likelihood |
| ∫ | Integral (continuous version of summation) |
| argmax | "The value that maximizes" — argmax L(θ) = the θ where L is biggest |

### Set and Logic Notation

| Symbol | What It Means |
|---|---|
| ∈ | "is in" or "belongs to" — θ ∈ Ω means θ is in the parameter space |
| ∀ | "for all" — ∀θ means "for every possible value of θ" |
| ⟹ | "implies" — A ⟹ B means "if A then B" |
| ⟺ | "if and only if" — both directions |
| I(condition) | Indicator function: equals 1 if condition is true, 0 if false |
| {x : f(x,θ) > 0} | "The set of x values where f is positive" = the support |

### Probability and Expectation

| Symbol | What It Means | Plain English |
|---|---|---|
| P(A) | Probability of event A | How likely is A? |
| E(X) | Expected value of X | The long-run average of X |
| Var(X) | Variance of X | How spread out X is (in squared units) |
| E(X\|Y) | Conditional expectation | Average of X given you know Y |
| X ~ N(μ,σ²) | "X follows a Normal distribution" | X is a bell curve centered at μ with spread σ |
| X ⊥ Y | X and Y are independent | Knowing X tells you nothing about Y |

---

## DISTRIBUTIONS

### The Ones You Need to Know

| Name | Symbol | What It Models | Key Feature |
|---|---|---|---|
| **Bernoulli** | Ber(p) | Single coin flip (yes/no, 0/1) | P(X=1)=p, P(X=0)=1-p |
| **Binomial** | Binom(n,p) | # of successes in n coin flips | Sum of n Bernoullis |
| **Poisson** | Poisson(λ) | # of rare events in a time period | Mean = Variance = λ |
| **Exponential** | Exp(θ) | Time until an event happens | Memoryless; mean = 1/θ |
| **Normal/Gaussian** | N(μ,σ²) | The bell curve | Most important distribution |
| **Uniform** | Unif([a,b]) | Equally likely anywhere in [a,b] | Flat distribution |
| **Gamma** | Gamma(α,β) | Generalization of Exponential | Sum of α Exponentials |
| **Chi-squared** | χ²_d | Sum of d squared standard normals | Special case of Gamma |
| **t-distribution** | t_n | Like Normal but with heavier tails | Used when σ is unknown |
| **Beta** | Beta(α,β) | Probabilities/proportions (values in [0,1]) | Conjugate prior for Bernoulli |

### Chi-Squared (χ²) — Why It Matters

**What it is**: Take d independent standard normal variables (Z₁,...,Z_d), square each one, add them up. That sum follows a χ²_d distribution.

**Why you care**: When you compute sample variance s² from normal data, the quantity (n-1)s²/σ² follows a χ²_{n-1}. This lets you build confidence intervals for variance.

- χ²_d = Gamma(d/2, 1/2)
- E(χ²_d) = d
- Var(χ²_d) = 2d
- The subscript d is called "degrees of freedom"

### t-Distribution — Why It Matters

**The problem**: To build a CI for μ, you need √n(X̄-μ)/σ ~ N(0,1). But you don't KNOW σ!

**The fix**: Replace σ with s (sample standard deviation). But now √n(X̄-μ)/s is NOT Normal anymore — it follows a t_{n-1} distribution.

**Key facts**:
- Looks like a Normal but with fatter tails (more uncertainty because you estimated σ)
- As n→∞, t_n → N(0,1) (more data = less uncertainty about σ = closer to Normal)
- Always symmetric around 0

---

## ESTIMATION CONCEPTS

### The Players

| Term | Symbol | What It Is | Analogy |
|---|---|---|---|
| **Parameter** | θ | The true value (unknown) | The bullseye |
| **Estimator** | θ̂ = φ(X₁,...,Xₙ) | A formula for guessing θ (random variable) | Your aiming strategy |
| **Estimate** | φ(x₁,...,xₙ) | The actual number your formula gives | Where the dart landed |
| **Bias** | E(θ̂) - θ | How far off-center you are on average | How far left/right of bullseye your average dart lands |
| **Variance** | Var(θ̂) | How spread out your guesses are | How scattered your darts are |
| **MSE** | Var(θ̂) + Bias² | Total "badness" of your estimator | Overall accuracy |

### Bias-Variance Tradeoff (The Big Idea)

**MSE = Variance + Bias²**

- You want MSE to be small
- Two ways MSE can be big: high variance OR high bias
- Sometimes you can REDUCE variance a lot by accepting a LITTLE bias
- Result: a biased estimator with lower MSE can be BETTER than an unbiased one

**Example**: Estimating θ for Uniform[0,θ]:
- 2X̄ is unbiased but has MSE = θ²/(3n) — high variance
- X₍ₙ₎ (max) is biased but has MSE ≈ θ²/n² — much lower MSE
- The biased one WINS

### Sufficiency — What It Means

A sufficient statistic T **captures all the information** in the data about θ.

Once you know T, the individual data points X₁,...,Xₙ tell you NOTHING more about θ.

**Example**: For Bernoulli data, T = ΣXᵢ (the total count of 1s) is sufficient. If you know there were 7 successes in 10 trials, knowing WHICH specific trials were successes doesn't help you estimate p.

### MVUE vs Efficient Estimator

- **MVUE**: Among ALL unbiased estimators, the one with smallest variance
- **Efficient**: An unbiased estimator whose variance EQUALS the CRLB (the theoretical minimum)
- Every efficient estimator is MVUE, but not every MVUE is efficient (CRLB may not be achievable)

---

## LIKELIHOOD AND INFORMATION

| Term | Symbol | Meaning |
|---|---|---|
| **Likelihood** | L(θ) = Πf(Xᵢ,θ) | "How probable is my data if θ were the true value?" Viewed as a function of θ |
| **Log-likelihood** | ℓ(θ) = Σlog f(Xᵢ,θ) | Log of likelihood — easier to work with (turns products into sums) |
| **Score function** | ℓ̇(x,θ) = ∂/∂θ log f(x,θ) | Derivative of log-likelihood. Measures sensitivity of likelihood to θ |
| **Score equation** | Σℓ̇(Xᵢ,θ) = 0 | Set total score to zero → solve for MLE |
| **Fisher information** | I(θ) = E[ℓ̇²] | How much info ONE observation carries about θ. Higher = data is more informative |
| **Total Fisher info** | n·I(θ) | How much info the WHOLE sample carries |
| **CRLB** | [g'(θ)]² / (n·I(θ)) | Floor on variance of any unbiased estimator of g(θ) |

**Key relationship**: Score always has mean zero: E[ℓ̇(X,θ)] = 0. Its variance IS the Fisher information.

---

## BAYESIAN TERMS

| Term | Symbol | Meaning | Analogy |
|---|---|---|---|
| **Prior** | ξ(θ) | Your belief about θ BEFORE seeing data | Your initial guess |
| **Likelihood** | f(x\|θ) | Probability of data given θ | The evidence |
| **Posterior** | ξ(θ\|x) | Your UPDATED belief after seeing data | Your revised guess |
| **Conjugate prior** | — | A prior whose posterior is in the SAME family | Mathematically convenient |
| **Bayes estimator** | — | The "best" estimate under your posterior | Posterior mean (for squared error loss) |
| **Precision** | 1/σ² | Inverse of variance | How "sure" you are (higher = more sure) |

**The one formula**: Posterior ∝ Likelihood × Prior

("∝" means "proportional to" — you can ignore normalizing constants and just identify the distribution kernel)

---

## CONFIDENCE INTERVAL TERMS

| Term | Meaning |
|---|---|
| **Pivot** | A function of data AND θ whose distribution you KNOW and is FREE of θ |
| **Confidence level** | 1 - α (e.g., 95% means α = 0.05) |
| **α (alpha)** | Significance level — probability of NOT covering θ |
| **z_{α/2}** | The value where P(Z > z_{α/2}) = α/2 for standard Normal |
| **t_{n,α/2}** | Same thing but for the t-distribution with n degrees of freedom |
| **χ²_{n,α}** | The value where P(χ² > χ²_{n,α}) = α |
| **Degrees of freedom** | Usually n-1 for single-sample problems; controls the shape of χ² and t distributions |
| **Equal-tailed CI** | Cut α/2 from each tail (most common) |

---

## CONVERGENCE CONCEPTS

| Term | Intuition |
|---|---|
| **Converges in probability** (→ᴾ) | For large n, the random variable is VERY LIKELY close to the target |
| **Converges in distribution** (→ᵈ) | The histogram shape approaches a target shape |
| **WLLN** | X̄ₙ →ᴾ μ (sample mean converges to true mean) |
| **CLT** | √n(X̄ₙ - μ)/σ →ᵈ N(0,1) (standardized mean becomes Normal) |
| **Slutsky's theorem** | If Xₙ →ᵈ X and Yₙ →ᴾ constant c, then XₙYₙ →ᵈ cX |
| **Delta method** | Way to find the distribution of g(X̄ₙ) using the derivative g'(θ) |

---

## REGULARITY CONDITIONS (for CRLB)

These are the "fine print" that must be true for the Cramér-Rao bound to work:

| Condition | What It Says | What Breaks It |
|---|---|---|
| **(A.1)** | The support (where f > 0) does NOT depend on θ | Uniform[0,θ] — the range [0,θ] changes with θ! |
| **(A.2)** | You can swap the order of differentiation and integration | Technical condition, rarely tested directly |
| **(A.3)** | ∂/∂θ log f(x,θ) exists and is finite everywhere | Need the density to be "smooth enough" |

**Bottom line**: CRLB works for Normal, Bernoulli, Poisson, Exponential. Does NOT work for Uniform[0,θ].

---

## QUICK PRONUNCIATION GUIDE

| See this | Say this |
|---|---|
| χ² | "kai-squared" (not "chi" like "cheese") |
| Σ | "sigma" (capital) or just say "sum" |
| Π | "pi" (capital) or just say "product" |
| ∝ | "proportional to" |
| ℓ | "ell" (script L, for log-likelihood) |
| θ̂ | "theta hat" |
| X̄ | "X bar" |
| s² | "s squared" |
| X₍ₙ₎ | "X sub n" or "the max order statistic" |
| t_{n-1} | "t with n minus 1 degrees of freedom" |
| z_{α/2} | "z alpha over two" |
| →ᵈ | "converges in distribution to" |
| →ᴾ | "converges in probability to" |

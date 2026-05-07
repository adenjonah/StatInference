# STAT GU4204 Midterm Cheat Sheet

## KEY DEFINITIONS (Fill-in-the-Blank)

- **Statistical inference**: Procedure that produces a probabilistic statement about some or all parts of a statistical model
- **Parameter**: Characteristic(s) that determine the joint distribution of the random variables of interest
- **Parameter space (Ω)**: Set of all possible values of the parameter θ
- **Statistic**: T = φ(X₁,...,Xₙ) — function of data ONLY, contains NO unknown parameters
- **Estimator**: θ̂ₙ = φ(X₁,...,Xₙ) — a statistic used to estimate a parameter; it is a RANDOM VARIABLE
- **Estimate**: φ(x₁,...,xₙ) — the realized NUMBER after plugging in observed data
- **Bias**: b(Tₙ) = E(Tₙ) - g(θ) — how much the estimator misses the target on average
- **Unbiased**: E(Tₙ) = g(θ) for ALL θ ∈ Ω (bias = 0 everywhere)
- **Consistent**: θ̂ₙ →^P θ as n→∞ (large sample property; does NOT tell us about finite n performance)
- **MSE**: E[(Tₙ - g(θ))²] = Var(Tₙ) + [bias(Tₙ)]² (bias-variance decomposition)
- **Dominates**: Tₙ dominates Sₙ if MSE(Tₙ) ≤ MSE(Sₙ) for ALL θ
- **Inadmissible**: Sₙ is inadmissible if some Tₙ dominates it
- **MVUE**: Minimum Variance Unbiased Estimator — unbiased AND has smallest variance among all unbiased estimators
- **Efficient estimator**: Unbiased estimator that achieves the Cramer-Rao lower bound
- **Sufficient statistic**: T is sufficient for θ if the conditional distribution of X|T=t does NOT depend on θ
- **Likelihood function**: L(θ) = Πf(Xᵢ, θ) — joint density viewed as function of θ
- **Log-likelihood**: ℓ(θ) = Σlog f(Xᵢ, θ)
- **Score function**: ℓ̇(x,θ) = ∂/∂θ log f(x,θ)
- **Score equation**: ℓ̇ₙ(Xₙ,θ) = Σℓ̇(Xᵢ,θ) = 0 (solve for MLE)
- **Fisher information**: I(θ) = E[ℓ̇²(X,θ)] — measures how much info data carries about θ
- **Sampling distribution**: Distribution of a statistic T = φ(X₁,...,Xₙ)
- **Pivot**: Ψ(Xₙ, g(θ)) — function of data AND parameter whose distribution does NOT depend on θ
- **Confidence interval**: Random interval (A,B) such that P(A ≤ g(θ) ≤ B) ≥ 1-α for all θ
- **Exact CI**: When P = 1-α exactly (not just ≥)
- **Prior distribution**: ξ(θ) — belief about θ BEFORE observing data
- **Posterior distribution**: ξ(θ|x) — updated belief about θ AFTER observing data
- **Conjugate prior**: Prior such that posterior belongs to the SAME family as the prior
- **Bayes estimator**: Estimator that minimizes expected posterior loss; under squared error loss = posterior mean

---

## DISTRIBUTIONS REFERENCE

| Distribution | PDF/PMF | E(X) | Var(X) | MGF |
|---|---|---|---|---|
| Ber(p) | P(X=1)=p, P(X=0)=1-p | p | p(1-p) | 1-p+pe^t |
| Binom(n,p) | C(n,k)p^k(1-p)^{n-k} | np | np(1-p) | (1-p+pe^t)^n |
| Poisson(λ) | e^{-λ}λ^k / k! | λ | λ | exp(λ(e^t-1)) |
| Exp(θ) | θe^{-θx}, x≥0 | 1/θ | 1/θ² | θ/(θ-t) |
| N(μ,σ²) | (2πσ²)^{-1/2} exp(-(x-μ)²/(2σ²)) | μ | σ² | exp(μt+σ²t²/2) |
| Unif([a,b]) | 1/(b-a) | (a+b)/2 | (b-a)²/12 | (e^{tb}-e^{ta})/(t(b-a)) |
| Gamma(α,β) | (β^α/Γ(α))x^{α-1}e^{-βx}, x>0 | α/β | α/β² | (β/(β-t))^α |
| χ²_d | = Gamma(d/2, 1/2) | d | 2d | (1-2t)^{-d/2} |
| t_n | (symmetric, heavier tails than normal) | 0 (n>1) | n/(n-2) (n>2) | — |
| Beta(α,β) | x^{α-1}(1-x)^{β-1}/B(α,β), x∈(0,1) | α/(α+β) | αβ/((α+β)²(α+β+1)) | — |

### Gamma Function

- Γ(α) = ∫₀^∞ x^{α-1} e^{-x} dx
- Γ(α+1) = αΓ(α)
- Γ(n) = (n-1)! for integer n
- Γ(1/2) = √π

### Reproductive Properties (Sum of Independents)

| If Xᵢ iid from | Then ΣXᵢ ~ |
|---|---|
| Bernoulli(p) | Binomial(n, p) |
| Binomial(nᵢ, p) | Binomial(Σnᵢ, p) |
| Gamma(αᵢ, β) same β | Gamma(Σαᵢ, β) |
| χ²_{mᵢ} | χ²_{Σmᵢ} |
| Poisson(λᵢ) | Poisson(Σλᵢ) |
| N(μᵢ, σᵢ²) | N(Σμᵢ, Σσᵢ²) |

---

## NORMAL DISTRIBUTION PROPERTIES

- If X ~ N(μ,σ²): Y = aX + b ~ N(aμ+b, a²σ²)
- X̄ₙ ~ N(μ, σ²/n) for iid normal sample
- Standard normal CDF: Φ(z), symmetry: 1-Φ(x) = Φ(-x)
- F_X(x) = Φ((x-μ)/σ)
- Key values: Φ(-1.96) ≈ 0.025, Φ(-1.645) ≈ 0.05, Φ(-2.326) ≈ 0.01

---

## PROBABILITY INEQUALITIES

**Markov**: W ≥ 0 ⟹ P(W ≥ t) ≤ E(W)/t

**Chebyshev**: P(|Z - E(Z)| ≥ τ) ≤ Var(Z)/τ²

**Chebyshev on sample mean**: P(|X̄ - μ| ≥ τ) ≤ σ²/(nτ²)

Use: sample size calculations ("how large n to be 99% sure X̄ is within ε of μ?")

---

## CONVERGENCE

**In probability** (Zₙ →^P Z): P(|Zₙ - Z| > ε) → 0 for all ε > 0

**In distribution** (Zₙ →^d Z): Fₙ(u) → F(u) at all continuity points of F

**Relationship**: Conv in prob ⟹ conv in dist (converse is FALSE in general; TRUE if limit is a constant)

**WLLN**: Xᵢ iid, finite mean μ ⟹ X̄ₙ →^P μ
- Conditions: iid, finite mean
- Proof uses Chebyshev (if variance exists)

**SLLN**: P(lim X̄ₙ = μ) = 1 (almost sure convergence, STRONGER than conv in prob)

**CLT**: Xᵢ iid, mean μ, finite var σ² ⟹ √n(X̄ₙ - μ)/σ →^d N(0,1)
- Conditions: iid, finite variance
- Gives APPROXIMATE distribution for large n
- Does NOT require normality of Xᵢ

**Continuous Mapping Theorem**:
- Zₙ →^P b, g continuous at b ⟹ g(Zₙ) →^P g(b)
- Zₙ →^d Z, g continuous ⟹ g(Zₙ) →^d g(Z)

**Slutsky's Theorem**: If Xₙ →^d X and Yₙ →^P c (constant), then XₙYₙ →^d cX and Xₙ+Yₙ →^d X+c

---

## DELTA METHOD

If √n(Zₙ - θ)/σ →^d N(0,1) and g'(θ) ≠ 0:

**√n(g(Zₙ) - g(θ)) →^d N(0, σ²·[g'(θ)]²)**

- Requires g'(θ) ≠ 0 (if g'(θ)=0, delta method breaks — need second-order version)
- Recipe: derivative of g, evaluate at θ, square, multiply by original variance

---

## METHOD OF MOMENTS (MOM)

**Method**: Set population moments = sample moments, solve for parameters
1. μⱼ(θ) = E(X^j) for j = 1,...,k parameters
2. μ̂ⱼ = (1/n)ΣXᵢ^j
3. Solve μⱼ(θ) = μ̂ⱼ

| Distribution | MOM Estimator |
|---|---|
| Ber(θ) | θ̂ = X̄ |
| Poisson(λ) | λ̂ = X̄ |
| N(μ,σ²) | μ̂ = X̄, σ̂² = (1/n)Σ(Xᵢ-X̄)² |
| Exp(λ) | λ̂ = 1/X̄ |
| Gamma(α,β) | α̂ = X̄²/(μ̂₂-X̄²), β̂ = X̄/(μ̂₂-X̄²) where μ̂₂=(1/n)ΣXᵢ² |

**Properties**: MOM is consistent (by LLN + continuous mapping). Not unique (different moments → different estimates). Not always optimal.

---

## MAXIMUM LIKELIHOOD ESTIMATION (MLE)

**Likelihood**: L(θ) = Πf(Xᵢ, θ)    **Log-likelihood**: ℓ(θ) = Σlog f(Xᵢ, θ)

Find θ̂ = argmax L(θ). Usually: set ℓ'(θ) = 0, verify ℓ''(θ̂) < 0.

| Distribution | MLE |
|---|---|
| Ber(θ) | θ̂ = X̄ |
| Poisson(θ) | θ̂ = X̄ |
| N(μ,σ²) | μ̂ = X̄, σ̂² = (1/n)Σ(Xᵢ-X̄)² ← BIASED for σ² |
| Exp(θ) rate param | θ̂ = 1/X̄ |
| Unif([0,θ]) | θ̂ = X₍ₙ₎ = max(Xᵢ) — by INSPECTION, not calculus |
| Unif([θ,θ+1]) | any θ ∈ [X₍ₙ₎-1, X₍₁₎] — NOT unique |

**MLE Properties**:
- **Invariance**: If θ̂ is MLE of θ, then g(θ̂) is MLE of g(θ) for any function g
- **Consistency**: θ̂ₙ →^P θ (under regularity conditions)
- **Caution**: MLE may not exist, may not be unique, may be biased

**When calculus fails**: Unif([0,θ]) — likelihood is NOT differentiable; L(θ) = (1/θⁿ)·I(θ ≥ X₍ₙ₎) so maximize by choosing smallest valid θ = X₍ₙ₎

---

## MSE, BIAS-VARIANCE, AND COMPARING ESTIMATORS

**MSE(Tₙ, g(θ)) = Var(Tₙ) + [bias(Tₙ)]²**

For unbiased estimator: MSE = Var

### Key Estimator Facts

| Estimator | Unbiased for | MVUE? | Notes |
|---|---|---|---|
| X̄ | μ (always) | Yes for N(μ,σ²) | Var = σ²/n |
| (1/n)Σ(Xᵢ-X̄)² | BIASED for σ² | No | This is the MLE; E = (n-1)σ²/n |
| s² = (1/(n-1))Σ(Xᵢ-X̄)² | σ² | Yes for Normal | Unbiased by Bessel's correction |
| 2X̄ for Unif([0,θ]) | θ | No | MSE = θ²/(3n) |
| X₍ₙ₎ for Unif([0,θ]) | BIASED | No | MSE much smaller than 2X̄ |
| (1+1/n)X₍ₙ₎ for Unif([0,θ]) | θ | Yes (MVUE) | MSE = θ²/(n(n+2)) |

**Lesson**: Biased estimator can have LOWER MSE than unbiased one (bias-variance tradeoff)

**Unbiased estimators don't always exist**: e.g., θ/(1-θ) for Ber(θ) has no unbiased estimator

**No universally best estimator** exists in general

---

## SUFFICIENT STATISTICS

**T is sufficient for θ** ⟺ conditional distribution of X|T=t does NOT depend on θ

### Factorization Criterion (Fisher-Neyman)

T = r(X) is sufficient ⟺ joint pdf factors as:

**f(x, θ) = u(x) · ν(r(x), θ)**
- u(x): depends on data ONLY (not θ)
- ν(r(x), θ): depends on θ ONLY through r(x)

**How to use**: Write out joint pdf, group terms. Everything involving θ must depend on data only through T.

| Distribution | Sufficient Statistic |
|---|---|
| Poisson(θ) | ΣXᵢ |
| Ber(θ) / Binom | ΣXᵢ |
| N(μ,σ²) both unknown | (ΣXᵢ, ΣXᵢ²) — need TWO statistics for TWO parameters |
| N(μ, σ² known) | ΣXᵢ (or equivalently X̄) |
| Exp(θ) | ΣXᵢ |
| Unif([0,θ]) | X₍ₙ₎ = max(Xᵢ) |
| Gamma(α known, β) | ΣXᵢ |
| Gamma(α, β known) | ΠXᵢ |

### Rao-Blackwell Theorem

Given ANY estimator δ(X) and sufficient statistic T, define:

δ₀(T) = E[δ(X) | T]

Then: **MSE(δ₀) ≤ MSE(δ)** for all θ (never worse, often strictly better)

**Implication**: To find good estimators, always condition on sufficient statistics

---

## BAYESIAN INFERENCE

**Posterior ∝ Likelihood × Prior**: ξ(θ|x) ∝ f(x|θ) · ξ(θ)

**Bayes estimator** (squared error loss) = **posterior mean** E[θ|X]
**Bayes estimator** (absolute error loss) = **posterior median**

### Conjugate Priors

| Likelihood | Conjugate Prior | Posterior |
|---|---|---|
| Ber(θ) / Binom | Beta(α, β) | Beta(α + Σxᵢ, β + n - Σxᵢ) |
| Poisson(λ) | Gamma(α, β) | Gamma(α + Σxᵢ, β + n) |
| N(μ, σ² known) | N(μ₀, v₀²) | N(μₙ, vₙ²) — see formula below |
| Exp(θ) | Gamma(α, β) | Gamma(α + n, β + Σxᵢ) |

### Normal-Normal Conjugate (σ² known)

Prior: μ ~ N(μ₀, v₀²). Data: X₁,...,Xₙ iid N(μ, σ²).

Posterior: μ|X ~ N(μₙ, vₙ²) where:

**μₙ = (μ₀/v₀² + nX̄/σ²) / (1/v₀² + n/σ²)**

**vₙ² = 1 / (1/v₀² + n/σ²)**

- Posterior mean = weighted average of prior mean and sample mean, weighted by PRECISIONS (1/variance)
- As n→∞: posterior concentrates around X̄ (data overwhelms prior)
- As v₀²→∞ (vague prior): posterior ≈ N(X̄, σ²/n) (matches frequentist)

---

## SAMPLING DISTRIBUTIONS

### Chi-Squared Distribution

**Definition**: Z ~ N(0,1) ⟹ Z² ~ χ²₁. If Z₁,...,Z_d iid N(0,1), then ΣZᵢ² ~ χ²_d

- χ²_d = Gamma(d/2, 1/2)
- E(χ²_d) = d, Var(χ²_d) = 2d
- **Reproductive**: Σχ²_{mᵢ} ~ χ²_{Σmᵢ} (independent)

### Normal Sampling — CRITICAL RESULTS

X₁,...,Xₙ iid N(μ,σ²):

1. **X̄ ~ N(μ, σ²/n)**
2. **s² ~ (σ²/(n-1)) · χ²_{n-1}** equivalently S²/σ² ~ χ²_{n-1} where S² = Σ(Xᵢ-X̄)²
3. **X̄ and s² are INDEPENDENT** (Proposition 6.3)
   - This independence characterizes the normal: F is normal ⟺ X̄ and s² independent for all n

**Theorem 6.4** (statement only): If Z₁,...,Zₙ iid N(0,1) and A is orthogonal matrix, then V = AZ has V₁,...,Vₙ iid N(0,1). Also ΣVᵢ² = ΣZᵢ².

### t-Distribution

**Definition**: Z ~ N(0,1), V ~ χ²_n, Z⊥V ⟹ T = Z/√(V/n) ~ t_n

**Properties**:
- Symmetric about 0 (T and -T have same distribution)
- Heavier tails than N(0,1) for finite n
- As n→∞: t_n → N(0,1) (by WLLN: V/n →^P 1)

**Theorem 6.5**: X₁,...,Xₙ iid N(μ,σ²) ⟹ **√n(X̄-μ)/s ~ t_{n-1}**

Why: numerator √n(X̄-μ)/σ ~ N(0,1), denominator involves s²/σ² ~ χ²_{n-1}/(n-1), and they are INDEPENDENT by Prop 6.3.

---

## CONFIDENCE INTERVALS

**Definition**: (A,B) is a level (1-α) CI for g(θ) if P(A ≤ g(θ) ≤ B) ≥ 1-α for ALL θ

### Method of Pivots

1. Construct Ψ(data, θ) whose distribution is KNOWN and FREE of θ
2. Find quantiles: P(q_{β₁} ≤ Ψ ≤ q_{1-β₂}) = 1-α where β₁+β₂=α
3. Invert the inequalities to isolate g(θ)
4. Equal-tailed CI (β₁=β₂=α/2) gives shortest CI for symmetric distributions

### Normal Mean CIs

| Case | Pivot | Distribution | CI Formula |
|---|---|---|---|
| σ² KNOWN | √n(X̄-μ)/σ | N(0,1) | X̄ ± (σ/√n)·z_{α/2} |
| σ² UNKNOWN | √n(X̄-μ)/s | t_{n-1} (EXACT) | X̄ ± (s/√n)·t_{n-1,α/2} |
| Large n, ANY dist, σ known | √n(X̄-μ)/σ | ≈ N(0,1) | X̄ ± (σ/√n)·z_{α/2} |
| Large n, ANY dist, σ unknown | √n(X̄-μ)/s | ≈ N(0,1) | X̄ ± (s/√n)·z_{α/2} |

### Bernoulli CI (large n)

θ̂ = X̄ (sample proportion). Approximate (1-α) CI:

**θ̂ ± √(θ̂(1-θ̂)/(n-1)) · z_{α/2}**

### CI for σ² (Normal data)

Pivot: (n-1)s²/σ² ~ χ²_{n-1}

CI: ((n-1)s²/χ²_{n-1,α/2}, (n-1)s²/χ²_{n-1,1-α/2})

### CI Properties and Width

- **Length of CI** (σ known): 2σ·z_{α/2}/√n
- Higher confidence (smaller α) → WIDER CI (z_{α/2} increases)
- Larger n → NARROWER CI (width ∝ 1/√n)
- **4× the sample size → half the CI width**
- α = 0 ⟹ z_{α/2} = ∞ ⟹ CI is infinitely wide (absolute confidence impossible)

### INTERPRETATION (Classic T/F trap!)

- **CORRECT**: "We have confidence γ that θ lies in (a,b)"
- **WRONG**: "θ lies in (a,b) with probability γ" ← θ is FIXED (not random), the interval is random
- After observing data, the interval either contains θ or it doesn't — the probability statement is about the random interval BEFORE data is observed

---

## CRAMER-RAO INEQUALITY

### Setup

- Score function: ℓ̇(x,θ) = ∂/∂θ log f(x,θ)
- Score equation: Σℓ̇(Xᵢ,θ) = 0 (set to 0 to find MLE)
- Fisher information: I(θ) = E[ℓ̇²(X,θ)] = Var[ℓ̇(X,θ)]
- **Score has mean zero**: E[ℓ̇(X,θ)] = 0 (follows from differentiating ∫f dx = 1)
- For n iid observations: total information = n·I(θ)

### Regularity Conditions (MUST KNOW — likely "list the conditions" question)

**(A.1)** Support {x : f(x,θ) > 0} does NOT depend on θ
- Excludes: Unif([0,θ]), Unif([θ, θ+1]) — support changes with θ

**(A.2)** Can interchange differentiation and integration:
∂/∂θ ∫W(x)f(x,θ)dx = ∫W(x)(∂/∂θ)f(x,θ)dx

**(A.3)** ∂/∂θ log f(x,θ) exists for all x in support and all θ ∈ Ω, as a finite quantity

### The Cramer-Rao Lower Bound (CRLB)

If T(Xₙ) is UNBIASED for g(θ), and A.1-A.3 hold, and I(θ) is finite:

**Var(T) ≥ [g'(θ)]² / (n·I(θ))**

Special case g(θ) = θ: **Var(T) ≥ 1/(n·I(θ))**

- Gives a FLOOR on variance of any unbiased estimator
- If an unbiased estimator ACHIEVES this bound → it is the MVUE (efficient)
- Not all parameters have efficient estimators

### Common Fisher Information

| Distribution | f(x,θ) | ℓ̇(x,θ) | I(θ) | CRLB for θ |
|---|---|---|---|---|
| Ber(θ) | θ^x(1-θ)^{1-x} | (x-θ)/(θ(1-θ)) | 1/(θ(1-θ)) | θ(1-θ)/n |
| Poisson(θ) | e^{-θ}θ^x/x! | x/θ - 1 | 1/θ | θ/n |
| N(μ,σ² known) | normal pdf | (x-μ)/σ² | 1/σ² | σ²/n |
| Exp(θ) rate | θe^{-θx} | 1/θ - x | 1/θ² | θ²/n |

**Key check**: X̄ is MVUE for μ in Normal (Var(X̄)=σ²/n = CRLB) and for θ in Bernoulli and Poisson.

---

## TRUE/FALSE TRAPS & COMMON MISCONCEPTIONS

**Convergence**:
1. **F**: "Conv in dist ⟹ conv in prob" — Only true if limit is a constant
2. **F**: "CLT says X̄ is exactly normal" — Approximate only; exact only if Xᵢ are normal
3. **T**: "Conv in prob ⟹ conv in dist" — Always true (stronger implies weaker)

**MLE Properties**:
4. **F**: "MLE is always unbiased" — Normal σ̂² biased; Unif X₍ₙ₎ biased
5. **F**: "MLE always exists and is unique" — May not exist; Unif[θ,θ+1] not unique
6. **T**: "MLE is invariant: g(θ̂) is MLE of g(θ)" — Works for ANY function g
7. **T**: "MLE is consistent under regularity conditions"
8. **T**: "MLE is asymptotically normal: θ̂ₙ ≈ N(θ, 1/(nI(θ))) for large n"

**Estimator Comparisons**:
9. **F**: "Unbiased is always better than biased" — Biased X₍ₙ₎ beats unbiased 2X̄ for Uniform
10. **F**: "Consistent ⟹ unbiased" — Consistency is large-n; can be biased at every finite n
11. **F**: "Unbiased estimators always exist" — θ/(1-θ) for Ber(θ) has none
12. **T**: "A biased estimator can have lower MSE than any unbiased estimator"

**Sufficiency & Information**:
13. **T**: "Any 1-to-1 function of a sufficient statistic is sufficient" — Exam favorite
14. **T**: "Sufficient statistic can be vector-valued" — Normal: T=(ΣXᵢ, ΣXᵢ²)
15. **T**: "Sufficiency + Rao-Blackwell can improve any estimator"
16. **F**: "CRLB applies to all distributions" — Fails for Uniform (A.1 violated: support depends on θ)

**Confidence Intervals**:
17. **F**: "θ lies in CI with probability 1-α" — θ is FIXED; CI is random. Say "confidence" not "probability"

**Normal Sampling**:
18. **T**: "X̄ and s² are independent for normal data" — Prop 6.3; CHARACTERIZES normality
19. **T**: "t_n → N(0,1) as n→∞" — By WLLN: V/n →^P 1

**Bayesian**:
20. **T**: "As n→∞, posterior concentrates around true θ regardless of prior"

**Fill-in-the-Blank Quick Lookup**:
- "Xₙ →^P c and g continuous ⟹ g(Xₙ) →^P g(c)" = **Continuous Mapping Theorem**
- "Xₙ →^d X and Yₙ →^P a ⟹ XₙYₙ →^d aX" = **Slutsky's Theorem**
- Estimator that minimizes posterior expected loss = **Bayes estimator**
- Squared error loss → posterior **mean**; absolute error loss → posterior **median**
- Distribution of a statistic = **sampling distribution**
- E[ℓ̇(X,θ)] = **0** (score has mean zero)
- I(θ) = E[ℓ̇²] = Var[ℓ̇] (since mean is 0) = **Fisher information**

---

## COMPUTATION RECIPES

1. **"Find MLE"** → Write L(θ), take log, differentiate ℓ'(θ)=0, solve, check ℓ''<0. If not differentiable (Uniform), maximize by inspection.
2. **"Find MOM"** → Set E(X)=X̄ (and E(X²)=(1/n)ΣXᵢ² if 2 params), solve for parameters.
3. **"Is it unbiased?"** → Compute E(estimator), check if = g(θ) for ALL θ.
4. **"Find sufficient statistic"** → Write joint pdf, factor as u(x)·ν(r(x),θ). The r(x) part is sufficient.
5. **"Compare estimators"** → Compute MSE = Var + Bias² for each, compare across all θ.
6. **"Show consistency"** → Show θ̂ₙ →^P θ. Common methods: LLN, Chebyshev, or CMT.
7. **"Find asymptotic distribution"** → CLT gives √n(X̄-μ)/σ →^d N(0,1). Apply delta method if transformed.
8. **"Construct CI"** → Choose pivot (Z if σ known, t if σ unknown, Z if large n). Find quantiles. Invert.
9. **"Find Fisher information"** → Compute ℓ̇ = ∂/∂θ log f, then I(θ) = E[ℓ̇²].
10. **"Is it MVUE?"** → Check: (a) unbiased, (b) Var = CRLB, OR use Rao-Blackwell + complete sufficient stat.
11. **"Find posterior"** → Write posterior ∝ likelihood × prior, identify the kernel of known distribution.
12. **"Bayes estimator"** → Under squared error loss: posterior mean. Under absolute error loss: posterior median.
13. **"Interpret CI"** → Say "confidence", NOT "probability". The interval is random, θ is fixed.
14. **"Apply Rao-Blackwell"** → Find sufficient statistic T, compute E[δ(X)|T] to get improved estimator.
15. **"Sample size"** → Use Chebyshev or CI width formula. Set P(|X̄-μ|≥ε) ≤ δ, solve for n.

---

## WORKFLOW GUIDES (Plug-and-Play)

### Quick Classifier — "What workflow do I use?"

- "Find Var(aX + bY + ...)" → **W1**
- "Find a bound on P(...)" or "How large must n be?" → **W2**
- "Find the asymptotic distribution of g(X̄)" → **W3**
- "Find the CDF/distribution of the maximum X₍ₙ₎" → **W4**
- "Find the MLE of θ" → **W5**
- "Find the MLE of g(θ)" or "θ̂ is the MLE, find MLE of ..." → **W6**
- "Show MOM = MLE" or "Find the MOM estimator" → **W7**
- "Show θ̂ is consistent" → **W8**
- "Compute E[X^k]" or "Evaluate ∫x^a e^{-bx} dx" → **W9**
- "Find the distribution of a sum" or "Find the MGF" or "What distribution does T follow?" → **W10**
- "Find Fisher info, is T efficient, asymptotic dist of MLE, give CI" (multi-part) → **W11**
- "Margin of error 1/k as large" or "more precise CI" → **W12**
- "Show T is sufficient using the definition/conditional distribution" → **W13**

---

### W1: Variance of Linear Combinations

**Trigger**: "Find Var(aX + bY + cZ + ...)" or "compare Var(X+Y) vs Var(X-Y)"

**Formula**: Var(a₁X₁ + a₂X₂ + ... + aₖXₖ + constant) = Σᵢ aᵢ²Var(Xᵢ) + 2·Σᵢ<ⱼ aᵢaⱼCov(Xᵢ,Xⱼ)

**Steps**:
1. **Drop constants** — adding a constant does NOT affect variance
2. **List coefficients** a₁, a₂, ..., aₖ (include signs! X - 3Y means a₁=1, a₂=-3)
3. **Square each coefficient** and multiply by the corresponding Var(Xᵢ)
4. **For each pair (i,j)**, compute 2·aᵢ·aⱼ·Cov(Xᵢ,Xⱼ)
5. **Sum everything**

**Answer format**: A single number (or expression in terms of given variances/covariances)

**Sanity check**: Variance must be ≥ 0. If you get negative, check your signs on the cross terms.

**Example**: Var(X - 3Y + 4) where Var(X)=9, Var(Y)=4, Cov(X,Y)=-1
- Coefficients: a₁=1, a₂=-3, constant dropped
- = (1)²(9) + (-3)²(4) + 2(1)(-3)(-1) = 9 + 36 + 6 = **51**

---

### W2: Probability Bounds & Sample Size

**Trigger**: "Find an upper bound on P(...)" or "How large must n be so that P(... ) ≤ δ?"

**Choose your inequality**:
- **Markov**: Need W ≥ 0. Gives P(W ≥ t) ≤ E(W)/t. Use when you only know E(W).
- **Chebyshev**: Gives P(|Z - E(Z)| ≥ τ) ≤ Var(Z)/τ². Use when you know Var(Z).
- **Higher-moment Markov**: P(|X-μ| ≥ t) ≤ E(|X-μ|^k)/t^k. Use when given a higher moment (e.g., β₄).

**Steps (Chebyshev sample size)**:
1. Write P(|X̄ - μ| ≥ ε) ≤ Var(X̄)/ε² = σ²/(nε²)
2. Set σ²/(nε²) ≤ δ
3. Solve: **n ≥ σ²/(ε²δ)**

**Steps (Markov)**:
1. Identify non-negative random variable W (or use |X-μ|^k for higher-moment version)
2. P(W ≥ t) ≤ E(W)/t
3. Plug in known E(W) and the threshold t

**Steps (Chebyshev bound)**:
1. Identify the random variable and its mean μ and variance σ²
2. Write P(|X - μ| ≥ t) ≤ σ²/t²
3. Plug in to get the bound

**Steps (Convergence in probability via Markov)**:
1. Show E(Xₙ) → 0 (or E(|Xₙ - c|) → 0)
2. By Markov: P(Xₙ ≥ ε) ≤ E(Xₙ)/ε → 0
3. Conclude Xₙ →^P 0

**Answer format**: An inequality (bound), or a minimum integer n.

**Sanity check**: Bounds must be between 0 and 1 to be useful. If bound > 1, it's trivially true but uninformative.

---

### W3: Delta Method

**Trigger**: "Find the asymptotic distribution of g(X̄ₙ)" or "Find the asymptotic distribution of g(Yₙ)" where Yₙ is asymptotically normal.

**Steps (Standard — g'(θ) ≠ 0)**:
1. **Identify the base statistic** Zₙ and its asymptotic distribution: √n(Zₙ - θ)/σ →^d N(0,1), meaning Zₙ has asymptotic mean θ and asymptotic variance σ²/n
   - If Zₙ = X̄ₙ: mean = E(X), variance = Var(X)/n
   - If Zₙ = (1/n)ΣXᵢ²: mean = E(X²), variance = Var(X²)/n (need E(X⁴) for this)
2. **Identify g** (the transformation applied to Zₙ)
3. **Compute g'(θ)** — the derivative of g evaluated at the mean θ
4. **Check**: Is g'(θ) ≠ 0? If yes, proceed. If g'(θ) = 0, go to Second-Order below.
5. **Write the answer**: g(Zₙ) has asymptotic distribution **N(g(θ), (σ²/n)·[g'(θ)]²)**

**Answer format**: "The asymptotic distribution of g(Zₙ) is N(mean, variance)" where:
- mean = g(θ)
- variance = (σ²/n) · [g'(θ)]²

**Steps (Second-Order — g'(θ) = 0)**:
1. If g'(θ) = 0, the standard delta method gives a degenerate (zero) limit
2. Instead, use **continuous mapping theorem**: if √n·Zₙ →^d N(0,1), then n·Zₙ² →^d χ²₁
3. More generally: if √n(Zₙ - θ)/σ →^d N(0,σ²), and g'(θ)=0, g''(θ)≠0, then:
   **n·(g(Zₙ) - g(θ)) →^d (σ²g''(θ)/2)·χ²₁**

**Example (Standard)**: g(X̄) = X̄³, X iid with mean θ, var σ²
- g'(x) = 3x², g'(θ) = 3θ²
- Asymptotic dist: **N(θ³, 9σ²θ⁴/n)**

**Example (Standard)**: g(Yₙ) = 1/Yₙ where Yₙ = (1/n)ΣXᵢ², E(X²)=σ², Var(X²)=2σ⁴
- g(x) = 1/x, g'(x) = -1/x², g'(σ²) = -1/σ⁴
- Asymptotic dist: **N(1/σ², (2σ⁴/n)·(1/σ⁴)²) = N(1/σ², 2/(nσ⁴))**

**Example (Second-Order)**: g(Zₙ) = Zₙ² where √n·Zₙ →^d N(0,1), θ=0
- g'(0) = 0 → standard delta method fails (gives degenerate limit)
- Use CMT: n·Zₙ² = (√n·Zₙ)² →^d χ²₁

---

### W4: Order Statistics

**Trigger**: "Find the CDF/PDF of X₍ₙ₎ = max(Xᵢ)" or "Find the limiting distribution of n(X₍ₙ₎ - θ)"

**Steps (CDF of max)**:
1. P(X₍ₙ₎ ≤ y) = P(all Xᵢ ≤ y) = [F_X(y)]ⁿ (by independence)
2. Plug in the CDF of the individual Xᵢ

**Steps (Convergence of order statistics)**:
1. Define Zₙ = n(Yₙ - θ) (rescale by n, not √n — order stats converge faster)
2. Find P(Zₙ ≤ z) = P(Yₙ ≤ θ + z/n) = [F_X(θ + z/n)]ⁿ
3. Take limit as n → ∞ using the fact that (1 + a/n)ⁿ → eᵃ
4. The limit is typically an exponential-type CDF

**Steps (Delta method on order statistics)**:
1. If n(Yₙ - θ) →^d W for some distribution W
2. For g(Yₙ), use: n(g(Yₙ) - g(θ))/g'(θ) →^d W (when g'(θ) ≠ 0)

**Example**: Xᵢ iid Unif[0,θ], Yₙ = max(Xᵢ)
- P(Yₙ ≤ y) = (y/θ)ⁿ for 0 < y < θ
- Zₙ = n(Yₙ - θ): P(Zₙ ≤ z) = (1 + z/(nθ))ⁿ → exp(z/θ) for z ≤ 0

---

### W5: MLE Computation

**Trigger**: "Find the MLE of θ"

**Step 0 — Check: Is the support θ-dependent?**
- If support depends on θ (e.g., Unif[0,θ]): go to **Inspection Path**
- If support is fixed: go to **Calculus Path**

**Calculus Path (Detailed)**:

**Step 1 — Write the likelihood** (plug ALL n observations into the joint):
- L(θ) = ∏ᵢ f(xᵢ | θ) — multiply the PDF/PMF n times, one per observation
- Use product rules: ∏ θ = θⁿ, ∏ e^{-θxᵢ} = e^{-θΣxᵢ}, ∏ xᵢ^{θ-1} = (∏xᵢ)^{θ-1}

**Step 2 — Take the log** (turns products into sums):
- ℓ(θ) = log L(θ) = Σᵢ log f(xᵢ | θ)
- Key log rules: log(θⁿ) = n log θ, log(e^{-nθ}) = -nθ, log(∏xᵢ) = Σ log xᵢ
- Anything not involving θ is a constant — you can drop it or keep it, doesn't affect the derivative

**Step 3 — Differentiate with respect to θ**:
- d/dθ [n log θ] = n/θ
- d/dθ [-nθ] = -n
- d/dθ [(Σxᵢ) log θ] = (Σxᵢ)/θ
- d/dθ [θ · Σ log xᵢ] = Σ log xᵢ
- d/dθ [-Σxᵢ²/(2θ)] = Σxᵢ²/(2θ²)

**Step 4 — Set ℓ'(θ) = 0 and solve for θ̂**:
- Isolate θ on one side. Common pattern: n/θ - (something) = 0 → θ̂ = n/(something)
- Or: (Σxᵢ)/θ - n = 0 → θ̂ = Σxᵢ/n = X̄

**Step 5 — Verify it's a maximum**:
- Compute ℓ''(θ). If ℓ''(θ̂) < 0 → confirmed maximum
- Common: ℓ'' = -n/θ² (always < 0 ✓), or ℓ'' = -Σxᵢ/θ² (< 0 if Σxᵢ > 0 ✓)

**Worked example — Exponential(β), f(x) = βe^{-βx}**:
1. L(β) = ∏ βe^{-βxᵢ} = βⁿ · e^{-βΣxᵢ}
2. ℓ(β) = n log β - βΣxᵢ
3. ℓ'(β) = n/β - Σxᵢ
4. Set = 0: n/β = Σxᵢ → **β̂ = n/Σxᵢ = 1/X̄**
5. ℓ''(β) = -n/β² < 0 ✓

**Worked example — Bernoulli(θ), f(x) = θ^x(1-θ)^{1-x}**:
1. L(θ) = ∏ θ^{xᵢ}(1-θ)^{1-xᵢ} = θ^{Σxᵢ}(1-θ)^{n-Σxᵢ}
2. ℓ(θ) = (Σxᵢ) log θ + (n - Σxᵢ) log(1-θ)
3. ℓ'(θ) = (Σxᵢ)/θ - (n - Σxᵢ)/(1-θ)
4. Set = 0: (Σxᵢ)(1-θ) = (n-Σxᵢ)θ → Σxᵢ = nθ → **θ̂ = Σxᵢ/n = X̄**
5. ℓ''(θ) = -(Σxᵢ)/θ² - (n-Σxᵢ)/(1-θ)² < 0 ✓

**Worked example — Power distribution, f(x|θ) = θx^{θ-1}, 0<x<1**:
1. L(θ) = θⁿ · (∏xᵢ)^{θ-1}
2. ℓ(θ) = n log θ + (θ-1)Σ log xᵢ
3. ℓ'(θ) = n/θ + Σ log xᵢ
4. Set = 0: n/θ = -Σ log xᵢ → **θ̂ = -n/Σ log xᵢ** (positive since log xᵢ < 0)
5. ℓ''(θ) = -n/θ² < 0 ✓

**Inspection Path** (Uniform-type — when calculus FAILS):
1. Write L(θ) — will include indicator function I(θ ≥ X₍ₙ₎) or similar
2. For θ in the valid region, L(θ) = θ^{-n} which is DECREASING
3. **Maximize by choosing smallest valid θ**: θ̂ = X₍ₙ₎ for Unif[0,θ]

**Restricted Domain** (e.g., p ∈ [1/2, 2/3]):
1. Find the unrestricted MLE θ̂ via calculus
2. If θ̂ falls inside the restricted domain → that's the answer
3. If θ̂ falls outside → pick the boundary closest to the unrestricted MLE

**Common MLEs to recognize immediately**:
- Bernoulli(θ): θ̂ = X̄
- Poisson(θ): θ̂ = X̄
- Normal(μ,σ²): μ̂ = X̄, σ̂² = (1/n)Σ(Xᵢ-X̄)² (biased!)
- Exponential(β) rate: β̂ = 1/X̄
- Uniform[0,θ]: θ̂ = X₍ₙ₎ = max(Xᵢ)

**Answer format**: θ̂ = [expression in terms of sample data]

**Sanity check**: θ̂ should be in the parameter space. For rate parameters, θ̂ > 0.

---

### W6: MLE Invariance & Derived Estimators

**Trigger**: "Find the MLE of g(θ)" or "θ̂ is the MLE of θ, find the MLE of [some function of θ]"

**The Rule**: If θ̂ is MLE of θ, then g(θ̂) is MLE of g(θ). Just plug in.

**Steps**:
1. **Find (or recall) the MLE** θ̂ of the base parameter
2. **Identify the function** g(θ) you need the MLE of
3. **Plug in**: MLE of g(θ) = g(θ̂)

**Common applications**:
- MLE of θ is X̄, need MLE of θ² → answer: (X̄)²
- MLE of β is 1/X̄ (Exponential), need MLE of median = (log 2)/β → answer: (log 2)·X̄
- MLE of (μ,σ²) is (X̄, σ̂²), need MLE of 95th percentile θ = μ + 1.645σ → answer: X̄ + 1.645·σ̂
- MLE of θ is X̄ (Poisson), need MLE of σ = √θ → answer: √(X̄)

**Answer format**: g(θ̂) = [expression]

**Sanity check**: Make sure you have the MLE of the BASE parameter first, then transform.

---

### W7: MOM and MOM = MLE Equivalence

**Trigger**: "Find the MOM estimator" or "Show MOM = MLE"

**Steps (Find MOM)**:
1. **Compute population moments**: μ₁ = E(X), and if 2 parameters: μ₂ = E(X²)
2. **Compute sample moments**: μ̂₁ = X̄, μ̂₂ = (1/n)ΣXᵢ²
3. **Set μₖ(θ) = μ̂ₖ** for each k = 1,...,# of parameters
4. **Solve for θ**

**Steps (Show MOM = MLE)**:
1. Find the MOM estimator (steps above)
2. Find the MLE (W5)
3. Show they're the same expression

**Key insight**: For one-parameter exponential families where E(X) = h(θ) and h is invertible, MOM gives θ̂ = h⁻¹(X̄), which often equals the MLE.

**Distributions where MOM = MLE**:
- Bernoulli: both give X̄
- Poisson: both give X̄
- Exponential: both give 1/X̄
- Normal: both give (X̄, (1/n)Σ(Xᵢ-X̄)²)

---

### W8: Consistency Proofs

**Trigger**: "Show θ̂ₙ is consistent" or "Show θ̂ₙ →^P θ"

**What the exam gives you**: An estimator θ̂ₙ (like 1/X̄, X̄², etc.) and the distribution of Xᵢ (so you know E(X)).
**What stays a variable**: θ (the parameter), n (sample size).
**What you write**: A 3-line proof. That's it.

**Method 1 — LLN + CMT (use this 90% of the time)**:

The template — just fill in the blanks:

> **Line 1**: "By WLLN, X̄ₙ →^P E(X) = [plug in the mean of the distribution]"
>
> **Line 2**: "Let g(x) = [the function that turns X̄ into your estimator]. g is continuous at x = [the mean]."
>
> **Line 3**: "By the Continuous Mapping Theorem, g(X̄ₙ) = θ̂ₙ →^P g([mean]) = θ. ∎"

**How to identify g**: Look at the estimator. If θ̂ = 1/X̄, then g(x) = 1/x. If θ̂ = X̄², then g(x) = x². If θ̂ = X̄ itself, then g(x) = x (trivial — just use LLN directly).

**Worked example 1 — Exponential(β), θ̂ = 1/X̄**:
- **Given**: Xᵢ iid Exp(β), E(X) = 1/β, estimator β̂ = 1/X̄
- Line 1: By WLLN, X̄ₙ →^P 1/β
- Line 2: Let g(x) = 1/x. g is continuous at x = 1/β (since β > 0, so 1/β > 0)
- Line 3: By CMT, 1/X̄ₙ →^P 1/(1/β) = β ✓

**Worked example 2 — Any distribution, θ̂ = X̄²** (estimating μ²):
- **Given**: Xᵢ iid with E(X) = μ, estimator = X̄²
- Line 1: By WLLN, X̄ₙ →^P μ
- Line 2: Let g(x) = x². g is continuous everywhere.
- Line 3: By CMT, X̄ₙ² →^P μ² ✓

**Worked example 3 — Gamma(α,β), MOM estimators**:
- **Given**: MOM gives α̂ = X̄²/(μ̂₂ - X̄²) where μ̂₂ = (1/n)ΣXᵢ²
- Line 1: By WLLN, X̄ →^P E(X) = α/β and μ̂₂ →^P E(X²) = α(α+1)/β²
- Line 2: α̂ is a continuous function of (X̄, μ̂₂)
- Line 3: By CMT, α̂ →^P α ✓

**Method 2 — Chebyshev (use when they give you Var(θ̂) explicitly)**:
1. Show E(θ̂ₙ) → θ (they usually tell you it's unbiased, or bias → 0)
2. Show Var(θ̂ₙ) → 0 (plug in the given variance formula, show it has n in denominator)
3. Write: "MSE = Var + Bias² → 0, therefore θ̂ₙ →^P θ"

---

### W9: Gamma Integrals & E[X^k]

**Trigger**: "Evaluate ∫₀^∞ x^{a} e^{-bx} dx" or "Compute E[X^k] for Gamma distribution"

**Master formula**: ∫₀^∞ x^{α-1} e^{-βx} dx = Γ(α)/β^α

**Steps (Evaluate an integral)**:
1. Match your integral to the form ∫₀^∞ x^{α-1} e^{-βx} dx
2. Read off α (power + 1) and β (coefficient in exponent)
3. Apply: answer = Γ(α)/β^α
4. Simplify Γ(α): if α is integer, Γ(n) = (n-1)!. If α = n+1/2, use Γ(1/2) = √π and Γ(α+1) = αΓ(α)

**Steps (E[X^k] for X ~ Gamma(α,β))**:
1. E[X^k] = ∫₀^∞ x^k · (β^α/Γ(α)) x^{α-1} e^{-βx} dx
2. = (β^α/Γ(α)) · ∫₀^∞ x^{α+k-1} e^{-βx} dx
3. = (β^α/Γ(α)) · Γ(α+k)/β^{α+k}
4. = **Γ(α+k) / (β^k · Γ(α))**

**Useful Gamma facts**:
- Γ(1) = 1, Γ(2) = 1, Γ(3) = 2, Γ(4) = 6
- Γ(1/2) = √π, Γ(3/2) = (1/2)√π, Γ(5/2) = (3/4)√π
- Γ(α+k)/Γ(α) = α(α+1)(α+2)···(α+k-1) (rising factorial)

**Example**: E[X³] for X ~ Gamma(α,β)
- = Γ(α+3)/(β³·Γ(α)) = α(α+1)(α+2)/β³

**Substitution trick**: If integral has e^{-βx}, substitute y = βx so dx = dy/β, x = y/β.

---

### W10: MGF Products & Sampling Distributions

**Trigger**: "Find the distribution of X₁ + X₂ + ... + Xₙ" or "What distribution does this statistic follow?"

**Part A — MGF of sums** (independent):
1. **Write** M_{ΣXᵢ}(t) = ∏ M_{Xᵢ}(t) (independence!)
2. **Plug in** the MGF of each Xᵢ from the distributions table
3. **Multiply** — for iid, this is [M_X(t)]ⁿ
4. **Recognize** the resulting MGF as a known distribution

**MGF recognition table**:
- (1-p+pe^t)^n → Binomial(n,p)
- exp(λ(e^t-1)) → Poisson(λ)
- exp(μt + σ²t²/2) → Normal(μ, σ²)
- (β/(β-t))^α → Gamma(α, β)
- (1-2t)^{-d/2} → χ²_d

**Part B — Sampling distribution problems**:

**"What is the distribution of (X̄ - μ)/(σ/√n)?"**
→ If Xᵢ normal: exactly N(0,1)
→ If Xᵢ not normal, large n: approximately N(0,1) by CLT

**"What is the distribution of Σ(Xᵢ-X̄)²/σ²?"**
→ If Xᵢ iid N(μ,σ²): χ²_{n-1}

**"What is the distribution of √n(X̄-μ)/s?"**
→ If Xᵢ iid N(μ,σ²): t_{n-1} (Theorem 6.5)

**Building a t-statistic from scratch** (e.g., 8.4.3):
1. **Find a standard normal** Z ~ N(0,1) — often a normalized sum
2. **Find an independent χ²** V ~ χ²_m — often a sum of squared normals
3. **Form T = Z/√(V/m)** → T ~ t_m
4. Key: Z and V must be **independent**

**Building a chi-squared**:
- Sum of squared standard normals: Z₁² + ... + Z_d² ~ χ²_d
- (n-1)s²/σ² ~ χ²_{n-1} for normal data
- n(X̄-μ)²/σ² ~ χ²₁

**Answer format**: Name the distribution with its parameters.

---

### W11: Full Estimation Pipeline (Multi-Part Exam Problem)

**Trigger**: A multi-part problem that asks several of: find Fisher info, check efficiency, find asymptotic distribution of MLE, construct CI. (See final exam Q11 — this is her signature format.)

**What the exam gives you**: A distribution f(x|θ), sample size n, sometimes a specific estimator T with its variance.
**What stays a variable**: θ, n, sometimes σ².
**What you plug in**: The specific PDF, its derivatives, and known moments of the distribution.

---

**Part (a): Fisher Information Iₙ(θ) — "Compute the Fisher information"**

Step-by-step template:

> **Step 1**: Write log f(x|θ) for ONE observation (you know f from the problem)
>
> **Step 2**: Take ∂/∂θ of log f. This gives you the **score** ℓ̇(x,θ). It will be a function of x and θ.
>
> **Step 3**: Square the score: [ℓ̇(x,θ)]²
>
> **Step 4**: Take the expectation E[ℓ̇²]. Replace E(X) with the known mean, E(X²) with known second moment, etc. This gives **I₁(θ)** (Fisher info for ONE observation).
>
> **Step 5**: Multiply by n: **Iₙ(θ) = n · I₁(θ)**

**Shortcut**: Often I₁(θ) = Var(X)/(something)². Use the fact that E[ℓ̇] = 0, so E[ℓ̇²] = Var(ℓ̇).

**Worked example — Poisson(θ)**:
- f(x|θ) = e^{-θ}θ^x/x!
- Step 1: log f = -θ + x log θ - log(x!)
- Step 2: ℓ̇ = -1 + x/θ = (x - θ)/θ
- Step 3: ℓ̇² = (x - θ)²/θ²
- Step 4: E[ℓ̇²] = E[(X-θ)²]/θ² = Var(X)/θ² = θ/θ² = **1/θ**
- Step 5: Iₙ(θ) = **n/θ**

**Worked example — Exponential(θ) rate, f = θe^{-θx}**:
- log f = log θ - θx
- ℓ̇ = 1/θ - x
- E[ℓ̇²] = E[(1/θ - X)²] = Var(X) = 1/θ² → **I₁(θ) = 1/θ²**
- Iₙ(θ) = **n/θ²**

**Worked example — Bernoulli(θ)**:
- log f = x log θ + (1-x) log(1-θ)
- ℓ̇ = x/θ - (1-x)/(1-θ) = (x - θ)/(θ(1-θ))
- E[ℓ̇²] = Var(X)/(θ(1-θ))² = θ(1-θ)/(θ(1-θ))² = **1/(θ(1-θ))**
- Iₙ(θ) = **n/(θ(1-θ))**

**Worked example — Normal(μ, σ² known), estimating μ**:
- log f = -(x-μ)²/(2σ²) + constant
- ℓ̇ = (x-μ)/σ²
- E[ℓ̇²] = Var(X)/σ⁴ = σ²/σ⁴ = **1/σ²**
- Iₙ(μ) = **n/σ²**

---

**Part (b): "Is T efficient?" — Compare Var(T) to CRLB**

> **Step 1**: The exam gives you an estimator T and tells you its variance (or you compute it).
>
> **Step 2**: Compute CRLB = 1/(n·I₁(θ)) if estimating θ directly. Or CRLB = [g'(θ)]²/(n·I₁(θ)) if estimating g(θ).
>
> **Step 3**: Compare. Write one of:
> - "Var(T) = CRLB → T is efficient (and therefore MVUE)" ✓
> - "Var(T) > CRLB → T is NOT efficient" ✗

**Worked example — Poisson, T = X̄**:
- Var(X̄) = θ/n
- CRLB = 1/(n · 1/θ) = θ/n
- θ/n = θ/n → **efficient** ✓

**Worked example — Exponential, T = (n-1)/ΣXᵢ with Var = θ²/(n-2)**:
- CRLB = 1/(n · 1/θ²) = θ²/n
- θ²/(n-2) > θ²/n → **NOT efficient** ✗

---

**Part (c): "What is the asymptotic distribution of the MLE?" — Just plug in**

This is a memorized result. Write:

> "For large n, θ̂ₙ ~ approximately N(θ, 1/(n·I₁(θ)))"

Then plug in I₁(θ) from part (a):

- Poisson: θ̂ = X̄ ~ approx N(θ, **θ/n**)
- Exponential: θ̂ = 1/X̄ ~ approx N(θ, **θ²/n**)
- Bernoulli: θ̂ = X̄ ~ approx N(θ, **θ(1-θ)/n**)
- Normal (μ): θ̂ = X̄ ~ approx N(μ, **σ²/n**)

---

**Part (d): "Give a 95% large-sample CI for θ" — Plug into formula**

> **Formula**: θ̂ ± z_{α/2} · √(1/(n·I₁(θ̂)))
>
> **Step 1**: Take your MLE θ̂ from the problem
> **Step 2**: Plug θ̂ into the expression 1/(n·I₁(θ)) to get the estimated variance
> **Step 3**: Take the square root
> **Step 4**: Multiply by z_{α/2} (given on the exam, e.g., 1.96 for 95%)
> **Step 5**: Write: θ̂ ± [that number]

**Worked example — Exponential, 95% CI**:
- θ̂ = 1/X̄, I₁(θ) = 1/θ², so 1/(nI₁(θ)) = θ²/n
- Plug in θ̂: estimated variance = (1/X̄)²/n
- SE = (1/X̄)/√n
- **CI: 1/X̄ ± 1.96 · (1/X̄)/√n**

**Worked example — Poisson, 95% CI**:
- θ̂ = X̄, I₁(θ) = 1/θ, so 1/(nI₁(θ)) = θ/n
- Plug in θ̂: estimated variance = X̄/n
- SE = √(X̄/n)
- **CI: X̄ ± 1.96 · √(X̄/n)**

---

### W12: CI Width Scaling & Sample Size for Precision

**Trigger**: "Want margin of error 1/k as large" or "more precise estimate" or "how large must new sample be?"

**Key rule**: CI width ∝ 1/√n. So:
- **To cut margin of error by factor k → multiply n by k²**
- Margin of error = z_{α/2} · σ/√n (known σ) or z_{α/2} · √(p̂(1-p̂)/n) (proportion)

**Steps**:
1. Current margin of error: E₁ with sample size n₁
2. Desired margin of error: E₂ = E₁/k
3. Since E ∝ 1/√n: E₂/E₁ = √(n₁/n₂)
4. Solve: **n₂ = n₁ · k²**

**Example (Final Q5)**: Current n = 100, want margin 1/3 as large
- k = 3, so n₂ = 100 · 9 = **900**

**Sample size for target margin of error E** (proportion CI):
- n ≥ z²_{α/2} · p̂(1-p̂) / E²
- Conservative (worst case p̂ = 0.5): n ≥ z²_{α/2} / (4E²)

**Sample size via Chebyshev** (Final Q6):
- Want P(|X̄ - μ| ≤ kσ) ≥ 1 - δ
- Chebyshev: σ²/(n·(kσ)²) ≤ δ → n ≥ 1/(k²δ)
- Example: within 3σ, prob ≥ 0.99 → n ≥ 1/(9·0.01) = **12** (round up)

---

### W13: Sufficiency via Conditional Distribution (Definition Method)

**Trigger**: "Show T is sufficient" or "Using the conditional distribution, show T is sufficient"

**What the exam gives you**: A distribution f(x|θ), and a statistic T (usually T = ΣXᵢ).
**What stays a variable**: θ, n, t.
**What you need to know**: The distribution of T (e.g., if Xᵢ ~ Ber(θ), then ΣXᵢ ~ Binomial(n,θ)).

**There are TWO methods. Use whichever the problem asks for:**

---

**Method A: Factorization Criterion (faster, use by default)**

Template — just fill in the blanks:

> **Step 1**: Write the joint PDF/PMF: f(x₁,...,xₙ|θ) = ∏ f(xᵢ|θ)
>
> **Step 2**: Multiply it out. Group terms: put everything with θ in one factor, everything without θ in the other.
>
> **Step 3**: Write: "f(x,θ) = u(x) · v(T(x), θ) where u(x) = [θ-free stuff] and v = [stuff with θ that only depends on data through T]"
>
> **Step 4**: "By the factorization criterion, T is sufficient for θ. ∎"

**Worked example — Poisson(θ), show T = ΣXᵢ is sufficient**:
- Joint: ∏ (e^{-θ}θ^{xᵢ}/xᵢ!) = e^{-nθ} · θ^{Σxᵢ} / ∏(xᵢ!)
- Factor: u(x) = 1/∏(xᵢ!) [no θ], v(Σxᵢ, θ) = e^{-nθ} · θ^{Σxᵢ} [θ only through Σxᵢ]
- By factorization criterion, T = ΣXᵢ is sufficient ✓

**Worked example — Exponential(θ), show T = ΣXᵢ is sufficient**:
- Joint: ∏ θe^{-θxᵢ} = θⁿ · e^{-θΣxᵢ}
- Factor: u(x) = 1, v(Σxᵢ, θ) = θⁿe^{-θΣxᵢ}
- By factorization criterion, T = ΣXᵢ is sufficient ✓

**Worked example — Normal(μ, σ² known), show T = ΣXᵢ is sufficient for μ**:
- Joint: ∏ (2πσ²)^{-1/2} exp(-(xᵢ-μ)²/(2σ²))
- = (2πσ²)^{-n/2} · exp(-Σ(xᵢ-μ)²/(2σ²))
- Expand: Σ(xᵢ-μ)² = Σxᵢ² - 2μΣxᵢ + nμ²
- Factor: u(x) = (2πσ²)^{-n/2} exp(-Σxᵢ²/(2σ²)) [no μ], v = exp(μΣxᵢ/σ² - nμ²/(2σ²)) [μ only through Σxᵢ]
- By factorization criterion, T = ΣXᵢ is sufficient for μ ✓

**Worked example — Normal(μ, σ²) BOTH unknown, show T = (ΣXᵢ, ΣXᵢ²) is sufficient**:
- Same expansion, but now σ² is unknown too
- u(x) = 1, v = (σ²)^{-n/2} exp(-Σxᵢ²/(2σ²) + μΣxᵢ/σ² - nμ²/(2σ²))
- θ enters only through Σxᵢ and Σxᵢ² → T is the vector (ΣXᵢ, ΣXᵢ²) ✓

---

**Method B: Conditional Distribution (use when problem says "using the definition")**

Template:

> **Step 1**: Write numerator = joint PMF f(x₁,...,xₙ|θ)
>
> **Step 2**: Write denominator = P(T = t | θ). **You need to know the distribution of T.** Common ones:
> - Xᵢ iid Ber(θ), T = ΣXᵢ → T ~ Binomial(n, θ), so P(T=t) = C(n,t)θ^t(1-θ)^{n-t}
> - Xᵢ iid Poisson(θ), T = ΣXᵢ → T ~ Poisson(nθ), so P(T=t) = e^{-nθ}(nθ)^t/t!
>
> **Step 3**: Divide. All θ terms MUST cancel. Write the result.
>
> **Step 4**: "The conditional does not depend on θ, so T is sufficient. ∎"

**Worked example — Bernoulli(θ), T = ΣXᵢ**:
- Numerator: θ^{Σxᵢ}(1-θ)^{n-Σxᵢ} = θ^t(1-θ)^{n-t}
- Denominator: P(T=t) = C(n,t) · θ^t(1-θ)^{n-t}
- Ratio: θ^t(1-θ)^{n-t} / [C(n,t) · θ^t(1-θ)^{n-t}] = **1/C(n,t)**
- No θ anywhere → T is sufficient ✓

**Worked example — Poisson(θ), T = ΣXᵢ**:
- Numerator: e^{-nθ}θ^{Σxᵢ}/∏(xᵢ!) = e^{-nθ}θ^t/∏(xᵢ!)
- Denominator: P(T=t) = e^{-nθ}(nθ)^t/t! = e^{-nθ} · n^t · θ^t/t!
- Ratio: [e^{-nθ}θ^t/∏(xᵢ!)] / [e^{-nθ}n^tθ^t/t!] = **t! / (n^t · ∏(xᵢ!))**
- No θ anywhere → T is sufficient ✓

---

## PRACTICE PROBLEMS (with Solutions)

### Problem 1 [W1: Variance of Linear Combinations]

Let X, Y, Z be random variables with Var(X) = 5, Var(Y) = 3, Var(Z) = 2, Cov(X,Y) = 1, Cov(X,Z) = -2, Cov(Y,Z) = 0.

(a) Find Var(2X - Y + 3Z).
(b) Find Var(X + Y - Z + 7).

**Solution**:
(a) Var(2X - Y + 3Z) = 4(5) + 1(3) + 9(2) + 2(2)(-1)(1) + 2(2)(3)(-2) + 2(-1)(3)(0) = 20 + 3 + 18 - 4 - 24 + 0 = **13**

(b) Var(X + Y - Z + 7) = 1(5) + 1(3) + 1(2) + 2(1)(1)(1) + 2(1)(-1)(-2) + 2(1)(-1)(0) = 5 + 3 + 2 + 2 + 4 + 0 = **16**

---

### Problem 2 [W2: Chebyshev Bound & Sample Size]

Let X₁,...,Xₙ be iid with mean μ = 10 and variance σ² = 25.

(a) Use Chebyshev's inequality to find an upper bound on P(|X̄ₙ - 10| ≥ 3).
(b) How large must n be so that P(|X̄ₙ - 10| ≤ 1) ≥ 0.95?

**Solution**:
(a) P(|X̄ - 10| ≥ 3) ≤ Var(X̄)/3² = (25/n)/9 = **25/(9n)**

(b) Need P(|X̄ - 10| ≥ 1) ≤ 0.05. Chebyshev: 25/(n·1²) ≤ 0.05, so n ≥ 25/0.05 = **500**

---

### Problem 3 [W2: Markov Inequality]

Let X be a non-negative random variable with E(X) = 4.

(a) Find an upper bound on P(X ≥ 20).
(b) If additionally E(X⁴) = 1000 and E(X) is unknown, find an upper bound on P(|X - E(X)| ≥ 5) using a 4th moment bound.

**Solution**:
(a) P(X ≥ 20) ≤ E(X)/20 = 4/20 = **1/5**

(b) P(|X - μ| ≥ 5) ≤ E(|X-μ|⁴)/5⁴ = β₄/625 = 1000/625 = **8/5** (trivial bound >1, so bound is just 1)

---

### Problem 4 [W3: Standard Delta Method]

Let X₁,...,Xₙ be iid with mean θ and variance σ². Find the asymptotic distribution of (X̄ₙ)⁴.

**Solution**:
- g(x) = x⁴, g'(x) = 4x³, g'(θ) = 4θ³
- X̄ has asymptotic mean θ, variance σ²/n
- Asymptotic distribution: **N(θ⁴, 16σ²θ⁶/n)**

---

### Problem 5 [W3: Delta Method — Asymptotic Distribution of 1/Yₙ]

Let X₁,...,Xₙ be iid with E(X) = 0, Var(X) = σ², E(X⁴) = 3σ⁴. Let Yₙ = (1/n)ΣXᵢ². Find the asymptotic distribution of √Yₙ.

**Solution**:
- E(X²) = σ², Var(X²) = E(X⁴) - [E(X²)]² = 3σ⁴ - σ⁴ = 2σ⁴
- So Yₙ has asymptotic mean σ² and variance 2σ⁴/n
- g(x) = √x, g'(x) = 1/(2√x), g'(σ²) = 1/(2σ)
- Asymptotic distribution: **N(σ, 2σ⁴/(n·4σ²)) = N(σ, σ²/(2n))**

---

### Problem 6 [W4: Order Statistics]

Let X₁,...,Xₙ be iid Unif[0,θ]. Let Yₙ = max(Xᵢ).

(a) Find the CDF of Yₙ.
(b) Find the CDF of Zₙ = n(Yₙ - θ) and its limiting distribution.

**Solution**:
(a) P(Yₙ ≤ y) = (y/θ)ⁿ for 0 < y < θ

(b) P(Zₙ ≤ z) = P(Yₙ ≤ θ + z/n) = (1 + z/(nθ))ⁿ for -nθ ≤ z ≤ 0
As n → ∞: **(1 + z/(nθ))ⁿ → exp(z/θ)** for z ≤ 0. This is the CDF of an exponential-type distribution on (-∞, 0].

---

### Problem 7 [W5: MLE — Calculus Path]

Let X₁,...,Xₙ be iid with PDF f(x|θ) = θx^{θ-1} for 0 < x < 1, θ > 0. Find the MLE of θ.

**Solution**:
1. L(θ) = θⁿ · (∏xᵢ)^{θ-1}
2. ℓ(θ) = n log θ + (θ-1)Σlog xᵢ
3. ℓ'(θ) = n/θ + Σlog xᵢ = 0
4. **θ̂ = -n / Σlog xᵢ** (note: log xᵢ < 0 since 0 < xᵢ < 1, so θ̂ > 0 ✓)
5. ℓ''(θ) = -n/θ² < 0 ✓

---

### Problem 8 [W5: MLE — Restricted Domain]

Let X₁,...,X₇₀ be iid Bernoulli(p). You observe Σxᵢ = 58. Find the MLE of p if the parameter space is restricted to p ∈ [1/2, 2/3].

**Solution**:
1. L(p) = p⁵⁸(1-p)¹². Unrestricted MLE: p̂ = 58/70 = 29/35 ≈ 0.829
2. 29/35 > 2/3, so falls outside [1/2, 2/3]
3. L(p) is increasing on [1/2, 2/3] (since unrestricted max is to the right)
4. MLE = right boundary = **2/3**

---

### Problem 9 [W6: MLE Invariance]

Let X₁,...,Xₙ be iid Exponential(β). The MLE of β is β̂ = 1/X̄.

(a) Find the MLE of the median of the distribution.
(b) Find the MLE of P(X > 2).

**Solution**:
(a) Median of Exp(β) is m = (log 2)/β. By invariance: **m̂ = (log 2)·X̄**

(b) P(X > 2) = e^{-2β}. By invariance: **MLE = e^{-2/X̄}**

---

### Problem 10 [W7: MOM Estimator]

Let X₁,...,Xₙ be iid Gamma(α,β).

(a) Find the MOM estimators of α and β.
(b) Are these the same as the MLEs?

**Solution**:
(a) E(X) = α/β, E(X²) = α(α+1)/β². Set equal to sample moments:
- X̄ = α/β → β = α/X̄
- (1/n)ΣXᵢ² = α(α+1)/β²
- Substituting: μ̂₂ - X̄² = α/β² (this is the population variance = sample variance)
- **α̂ = X̄²/(μ̂₂ - X̄²), β̂ = X̄/(μ̂₂ - X̄²)** where μ̂₂ = (1/n)ΣXᵢ²

(b) No — the Gamma MLE has no closed-form solution (requires numerical methods). MOM ≠ MLE here.

---

### Problem 11 [W8: Consistency]

Let X₁,...,Xₙ be iid Exponential(β) with mean 1/β. Show that β̂ = 1/X̄ₙ is consistent for β.

**Solution**:
1. By WLLN: X̄ₙ →^P E(X) = 1/β
2. Let g(x) = 1/x. g is continuous at x = 1/β (since β > 0, so 1/β > 0)
3. By CMT: g(X̄ₙ) = 1/X̄ₙ →^P g(1/β) = β
4. Therefore **β̂ →^P β** ✓

---

### Problem 12 [W9: Gamma Integral]

Evaluate ∫₀^∞ x⁵ e^{-3x} dx.

**Solution**:
- Match to ∫₀^∞ x^{α-1} e^{-βx} dx with α-1 = 5, so α = 6, and β = 3
- = Γ(6)/3⁶ = 5!/729 = 120/729 = **40/243**

---

### Problem 13 [W9: E[X^k] for Gamma]

Let X ~ Gamma(2, 3). Compute E[X⁴].

**Solution**:
- E[X⁴] = Γ(2+4)/(3⁴ · Γ(2)) = Γ(6)/(81 · Γ(2)) = 120/(81 · 1) = **40/27**

---

### Problem 14 [W10: MGF — Sum of Independent RVs]

Let X₁,...,X₈ be iid Exponential(β). Find the distribution of S = X₁ + ... + X₈.

**Solution**:
- MGF of Xᵢ: β/(β-t)
- MGF of S: [β/(β-t)]⁸ = (β/(β-t))⁸
- Recognize: this is the MGF of **Gamma(8, β)**

---

### Problem 15 [W10: Sampling Distribution — Building a t-statistic]

Let X₁,...,X₅ be iid N(0,1). Define W = X₁/√((X₂² + X₃² + X₄²)/3).

(a) What is the distribution of W?
(b) What is the distribution of W²?

**Solution**:
(a) X₁ ~ N(0,1) and X₂² + X₃² + X₄² ~ χ²₃ (independent of X₁). So W = Z/√(V/3) where Z ~ N(0,1), V ~ χ²₃, Z ⊥ V. Therefore **W ~ t₃**.

(b) **W² ~ t₃² = F(1,3)** (the square of a t_n has an F distribution with 1 and n df). Alternatively, just note W² has the distribution of the square of a t₃ random variable.

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

1. **FALSE**: "Conv in distribution ⟹ conv in probability" (only true if limit is a constant)
2. **FALSE**: "MLE is always unbiased" (Normal σ̂² = (1/n)Σ(Xᵢ-X̄)² is biased; Unif X₍ₙ₎ is biased)
3. **FALSE**: "MLE always exists and is unique" (may not exist; Unif([θ,θ+1]) not unique)
4. **FALSE**: "Unbiased is always better than biased" (biased X₍ₙ₎ beats unbiased 2X̄ for Unif([0,θ]))
5. **FALSE**: "θ lies in the CI with probability 1-α" (θ is FIXED; CI is random. Say "confidence", not "probability")
6. **TRUE**: "MLE is invariant: if θ̂ is MLE of θ, then g(θ̂) is MLE of g(θ)"
7. **TRUE**: "MLE is consistent under regularity conditions"
8. **TRUE**: "Sufficiency + Rao-Blackwell can improve any estimator"
9. **FALSE**: "Unbiased estimators always exist" (θ/(1-θ) for Ber(θ) has none)
10. **FALSE**: "CRLB applies to all distributions" (requires regularity conditions — fails for Uniform)
11. **TRUE**: "X̄ and s² are independent for normal data" (Prop 6.3 — CHARACTERIZES normality)
12. **FALSE**: "The CLT says X̄ is exactly normal" (only approximately, for large n; EXACTLY normal only if Xᵢ are normal)
13. **TRUE**: "Sufficient statistic can be vector-valued" (Normal with both params unknown: T=(ΣXᵢ, ΣXᵢ²))
14. **FALSE**: "A consistent estimator is unbiased" (consistency is about large-n convergence; can be biased for each n)
15. **TRUE**: "As n→∞, posterior concentrates around the true θ regardless of prior" (data overwhelms prior)

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

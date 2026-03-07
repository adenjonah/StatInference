# STAT GU4204 Midterm Cheat Sheet

## Distributions Quick Reference

| Distribution | PDF/PMF | E(X) | Var(X) |
|---|---|---|---|
| Ber(p) | P(X=1)=p, P(X=0)=1-p | p | p(1-p) |
| Binom(n,p) | C(n,k)p^k(1-p)^{n-k} | np | np(1-p) |
| Poisson(λ) | e^{-λ}λ^k / k! | λ | λ |
| Exp(θ) | θe^{-θx}, x≥0 | 1/θ | 1/θ^2 |
| N(μ,σ^2) | (2πσ^2)^{-1/2} exp(-(x-μ)^2/(2σ^2)) | μ | σ^2 |
| Unif([a,b]) | 1/(b-a) | (a+b)/2 | (b-a)^2/12 |
| Gamma(α,β) | (β^α/Γ(α))x^{α-1}e^{-βx} | α/β | α/β^2 |

## Normal Distribution Properties

- If X ~ N(μ,σ^2): Y = aX + b ~ N(aμ+b, a^2σ^2)
- X_i indep N(μ_i,σ_i^2): ΣX_i ~ N(Σμ_i, Σσ_i^2)
- X_i iid N(μ,σ^2): X̄ ~ N(μ, σ^2/n)
- Standard normal CDF: Φ(z), no closed form
- F_X(x) = Φ((x-μ)/σ)
- Symmetry: 1 - Φ(x) = Φ(-x)
- Φ(-2) ≈ 0.025, so 2Φ(-2) ≈ 0.05

## Sample Mean

X̄_n = (1/n)ΣX_i

- E(X̄) = μ
- Var(X̄) = σ^2/n

---

## Probability Inequalities

**Markov**: W ≥ 0 ⟹ P(W ≥ t) ≤ E(W)/t

**Chebyshev**: P(|Z - E(Z)| ≥ τ) ≤ Var(Z)/τ^2

**Chebyshev on sample mean**: P(|X̄ - E(X)| ≥ τ) ≤ Var(X)/(nτ^2)

---

## Convergence

**In probability** (Z_n →^P Z): P(|Z_n - Z| > ε) → 0 for all ε > 0

**In distribution** (Z_n →^d Z): F_n(u) → F(u) at all continuity points of F

Conv in prob ⟹ conv in dist (not reverse)

**WLLN**: X_i iid, finite mean μ ⟹ X̄_n →^P μ

**SLLN**: P(lim X̄_n = μ) = 1

**CLT**: X_i iid, mean μ, var σ^2 ⟹ √n(X̄_n - μ) →^d N(0, σ^2)

**Continuous Mapping**:
- Z_n →^P b, g continuous at b ⟹ g(Z_n) →^P g(b)
- Z_n →^d Z, g continuous ⟹ g(Z_n) →^d g(Z)

---

## Delta Method

If √n(Z_n - θ)/σ →^d N(0,1) and g'(θ) ≠ 0:

**√n(g(Z_n) - g(θ)) →^d N(0, σ^2·(g'(θ))^2)**

Recipe: take derivative of g, evaluate at the limit, square it, multiply by the original variance.

---

## Estimation Framework

- **Statistic**: T = φ(X_1,...,X_n) — function of data only, no unknown params
- **Estimator**: θ̂_n = φ(X_1,...,X_n) — random variable
- **Estimate**: φ(x_1,...,x_n) — realized number
- **Consistent**: θ̂_n →^P θ

---

## Method of Moments (MOM)

1. Write population moments μ_j(θ) = E(X^j) for j = 1,...,k
2. Set sample moments μ̂_j = (1/n)ΣX_i^j equal to μ_j(θ)
3. Solve for θ

| Distribution | MOM Estimator |
|---|---|
| N(μ,σ^2) | μ̂=X̄, σ̂^2=(1/n)Σ(X_i-X̄)^2 |
| Ber(θ) | θ̂=X̄ |
| Poisson(λ) | λ̂=X̄ |
| Exp(λ) | λ̂=1/X̄ |
| Gamma(α,β) | α̂=μ̂_1^2/(μ̂_2-μ̂_1^2), β̂=μ̂_1/(μ̂_2-μ̂_1^2) |

- MOM is consistent (by LLN + continuous mapping)
- Disadvantage: not unique (different moments → different estimates)

---

## Maximum Likelihood Estimation (MLE)

**Likelihood**: L_n(θ) = Π f(X_i, θ)

**Log-likelihood**: ℓ_n(θ) = Σ log f(X_i, θ)

Find θ̂ that maximizes L_n(θ). Usually set ℓ'_n(θ) = 0, check 2nd derivative < 0.

| Distribution | MLE |
|---|---|
| Poisson(θ) | θ̂ = X̄ |
| Ber(θ) | θ̂ = X̄ |
| N(μ,σ^2) | μ̂=X̄, σ̂^2=(1/n)Σ(X_i-X̄)^2 |
| Unif([0,θ]) | θ̂ = max(X_i) = X_(n) |
| Unif([θ,θ+1]) | any θ ∈ [X_(n)-1, X_(1)] (not unique) |

**Invariance**: If θ̂ is MLE of θ, then Ψ(θ̂) is MLE of Ψ(θ)

**Consistency**: θ̂_n →^P θ (under regularity conditions)

**Caution**: MLE may not exist (mixture normal example), may not be unique

**When calculus fails**: Unif([0,θ]) — likelihood not differentiable at max, maximize by inspection

---

## MSE and Bias-Variance

**MSE(T_n, g(θ)) = E[(T_n - g(θ))^2] = Var(T_n) + [bias(T_n)]^2**

**Bias**: b(T_n) = E(T_n) - g(θ)

- Unbiased: E(T_n) = g(θ) for all θ ⟹ MSE = Var
- T_n **dominates** S_n if MSE(T_n) ≤ MSE(S_n) for all θ
- S_n then called **inadmissible**
- No universally best estimator exists in general

### Key Variance Facts

| Estimator | Unbiased for | Notes |
|---|---|---|
| X̄ | μ | Always unbiased for E(X); MVUE for μ in N(μ,σ^2) |
| (1/n)Σ(X_i-X̄)^2 | — | BIASED for σ^2 (this is the MLE) |
| s^2 = (1/(n-1))Σ(X_i-X̄)^2 | σ^2 | Unbiased; MVUE of σ^2 for Normal |

### Unif([0,θ]) Comparison

| Estimator | MSE | Notes |
|---|---|---|
| 2X̄ | θ^2/(3n) | Unbiased but high variance |
| X_(n) | ~θ^2/n^2 | Biased but much lower MSE |
| (1+1/n)X_(n) | θ^2/(n(n+2)) | MVUE — best unbiased |

**Lesson**: Biased estimator can beat unbiased via lower variance.

Unbiased estimators don't always exist (e.g., θ/(1-θ) for Ber(θ)).

---

## Sufficient Statistics

**T is sufficient for θ** if the conditional distribution of X | T=t does not depend on θ.

### Factorization Criterion (Fisher-Neyman)

T = r(X) is sufficient ⟺ joint pdf factors as:

**f_n(x, θ) = u(x) · ν(r(x), θ)**

- u(x): depends on data, NOT on θ
- ν(r(x), θ): depends on θ only through r(x)

| Distribution | Sufficient Statistic |
|---|---|
| Poisson(θ) | T = ΣX_i |
| N(μ,σ^2) both unknown | T = (ΣX_i, ΣX_i^2) |
| Exp(θ) | T = ΣX_i |
| Unif([0,θ]) | T = max(X_i) |
| Gamma(α,β), β unknown | T = ΣX_i |
| Gamma(α,β), α unknown | T = ΠX_i |

### Rao-Blackwell Theorem

For any estimator δ(X) and sufficient statistic T:

δ_0(T) = E[δ(X) | T]

Then: **MSE(δ_0(T)) ≤ MSE(δ(X))** for all θ

⟹ Always condition on sufficient statistics to improve estimators.

---

## Common Exam Patterns

1. **"Find the MLE"** → Write likelihood, take log, differentiate, solve. Check 2nd derivative. If not differentiable, maximize by inspection.
2. **"Find MOM estimator"** → Match population moments to sample moments, solve for params.
3. **"Is it unbiased?"** → Compute E(estimator), check if = g(θ).
4. **"Find sufficient statistic"** → Factor the joint pdf using factorization criterion.
5. **"Compare estimators"** → Compute MSE = Var + Bias^2 for each, compare.
6. **"Show consistency"** → Show convergence in probability (usually via LLN or Chebyshev).
7. **"Find asymptotic distribution"** → CLT for X̄, then delta method if transformed.

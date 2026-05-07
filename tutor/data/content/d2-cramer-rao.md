# The Cramer-Rao Information Inequality

<!-- source: STAT_GU4204_07.pdf (Sen Ch 8), Baydil Lecture Slides -->
<!-- topics: cramer-rao, fisher-information, score-function, CRLB, efficiency, MVUE -->

## Setup and Notation

Let X be a random variable with pdf/pmf f(x, θ), where θ ∈ Ω.

**Log-likelihood**: ℓ(x, θ) = log f(x, θ)

**Score function**: ℓ̇(x, θ) = ∂/∂θ ℓ(x, θ) = ∂/∂θ log f(x, θ)

**Score equation** (for finding MLE): ℓ̇_n(X_n, θ) = Σ ℓ̇(Xᵢ, θ) = 0

## Fisher Information

The **Fisher information** about θ in the model is:

$$I(\theta) = E_\theta[\dot{\ell}^2(X, \theta)]$$

provided it exists as a finite quantity.

**For n iid observations**: Fisher information is n · I(θ).

**Intuition**: I(θ) measures how much information the data carries about θ.
- Large I(θ) → data is very informative → estimators can be precise
- Small I(θ) → data is not very informative → estimators have high variance

## Regularity Conditions

The Cramer-Rao bound requires three conditions:

**(A.1)** The support A_θ = {x : f(x, θ) > 0} does NOT depend on θ
- Rules out families like Uniform([0, θ])

**(A.2)** Interchange of differentiation and integration is valid:
$$\frac{\partial}{\partial\theta} E_\theta[W(X_n)] = \int W(x) \frac{\partial}{\partial\theta} f_n(x, \theta) \, dx$$

**(A.3)** ∂/∂θ log f(x, θ) exists for all x ∈ A and all θ ∈ Ω as a well-defined finite quantity.

## Key Properties of the Score

Under regularity conditions:

1. **E[ℓ̇(X, θ)] = 0** — the score has mean zero
2. **Var[ℓ̇(X, θ)] = I(θ)** — the variance of the score IS the Fisher information

## The Cramer-Rao Inequality (Theorem 8.1)

If T(X_n) is an **unbiased estimator** of g(θ), then under conditions A.1-A.3:

$$\text{Var}_\theta(T(X_n)) \geq \frac{[g'(\theta)]^2}{n \cdot I(\theta)}$$

### Special Case: g(θ) = θ

For unbiased estimators of θ itself:

$$\text{Var}_\theta(T(X_n)) \geq \frac{1}{n \cdot I(\theta)}$$

This is the **Cramer-Rao Lower Bound (CRLB)**.

## Implications

- The CRLB gives a **floor** on how small the variance of any unbiased estimator can be
- If an unbiased estimator **achieves** the CRLB, it is the **MVUE** (minimum variance unbiased estimator) — it's the best possible unbiased estimator
- An estimator that achieves the CRLB is called **efficient**
- Not all unbiased estimators achieve the bound; some parameters have no efficient unbiased estimator

## Proof Sketch

Uses the Cauchy-Schwarz inequality:

$$\text{Cov}^2(T(X_n), \dot{\ell}_n(X_n, \theta)) \leq \text{Var}(T(X_n)) \cdot \text{Var}(\dot{\ell}_n(X_n, \theta))$$

Key steps:
1. Show E[ℓ̇_n] = 0 (differentiate ∫f_n dx = 1)
2. Show Cov(T, ℓ̇_n) = g'(θ) (differentiate E[T] = g(θ))
3. Show Var(ℓ̇_n) = n · I(θ) (iid sum)
4. Apply Cauchy-Schwarz and rearrange

## Common Fisher Information Examples

| Distribution | I(θ) | CRLB for θ |
|---|---|---|
| Bernoulli(θ) | 1/(θ(1-θ)) | θ(1-θ)/n |
| Poisson(θ) | 1/θ | θ/n |
| N(μ, σ² known) | 1/σ² | σ²/n |
| N(μ known, σ²) | 1/(2σ⁴) | 2σ⁴/n |
| Exponential(θ) | 1/θ² | θ²/n |

# Confidence Intervals

<!-- source: STAT_GU4204_06.pdf (Sen Ch 7), Baydil Lecture Slides -->
<!-- topics: confidence-interval, pivot, exact-CI, approximate-CI, CLT-CI, t-interval -->

## Definition

Suppose X₁, ..., Xₙ is a random sample from distribution P_θ. Let A ≤ B be two statistics such that for all θ:

$$P_\theta(A \leq g(\theta) \leq B) \geq 1 - \alpha$$

Then (A, B) is a **confidence interval** for g(θ) with **confidence level** (1 - α).

If the inequality is an equality for all θ, the CI is called **exact**.

## Method of Pivots

The standard method for constructing CIs:

1. **Find a pivot** Ψ(X_n, g(θ)) — a function of data AND the parameter whose distribution does NOT depend on θ
2. **Determine quantiles** of the pivot's distribution G. Choose β₁, β₂ with β₁ + β₂ = α
3. **Invert** the probability statement to isolate g(θ)
4. **Result**: CI = set of all g(θ) satisfying the inequalities

## Example 1: Normal Mean, σ Known

Data: X₁, ..., Xₙ iid N(μ, σ²), σ known.

**Pivot**: Ψ = √n(X̄ - μ)/σ ~ N(0,1)

**CI**:

$$\left[\bar{X} - \frac{\sigma}{\sqrt{n}} z_{\alpha/2}, \quad \bar{X} + \frac{\sigma}{\sqrt{n}} z_{\alpha/2}\right]$$

where z_{α/2} is the upper α/2 quantile of N(0,1).

**Length** = 2σ · z_{α/2} / √n — decreases with n, increases with confidence level.

## Example 2: Normal Mean, σ Unknown

Data: X₁, ..., Xₙ iid N(μ, σ²), σ unknown.

**Pivot**: Ψ = √n(X̄ - μ)/s ~ t_{n-1}

(Uses s instead of σ; works because X̄ and s² are independent for normal data)

**CI**:

$$\left[\bar{X} - \frac{s}{\sqrt{n}} t_{n-1, \alpha/2}, \quad \bar{X} + \frac{s}{\sqrt{n}} t_{n-1, \alpha/2}\right]$$

where t_{n-1, α/2} is the upper α/2 quantile of the t_{n-1} distribution.

## Approximate CIs Using CLT

For **any** distribution with mean μ and variance σ², when n is large:

By CLT: √n(X̄ - μ)/σ ~approx N(0,1)

**If σ known**: approximate (1-α) CI for μ:

$$\left[\bar{X} - \frac{\sigma}{\sqrt{n}} z_{\alpha/2}, \quad \bar{X} + \frac{\sigma}{\sqrt{n}} z_{\alpha/2}\right]$$

**If σ unknown** (realistic case): replace σ with s (by Slutsky/LLN, s →^P σ):

$$\left[\bar{X} - \frac{s}{\sqrt{n}} z_{\alpha/2}, \quad \bar{X} + \frac{s}{\sqrt{n}} z_{\alpha/2}\right]$$

### Example: Bernoulli CI

X₁, ..., Xₙ iid Bernoulli(θ), n large. MLE θ̂ = X̄ = sample proportion.

Approximate (1-α) CI for θ:

$$\left[\hat{\theta} - \sqrt{\frac{\hat{\theta}(1-\hat{\theta})}{n-1}} z_{\alpha/2}, \quad \hat{\theta} + \sqrt{\frac{\hat{\theta}(1-\hat{\theta})}{n-1}} z_{\alpha/2}\right]$$

## Properties of Confidence Intervals

- **Higher confidence** (smaller α) → **wider** CI
- **Larger sample** (bigger n) → **narrower** CI
- Cannot get α = 0 (absolute confidence → infinitely wide interval)
- 4× the sample size → half the CI width

## Interpretation (Important!)

If (A, B) is a coefficient γ CI and (a, b) is the observed interval:

- **CORRECT**: "We have confidence γ that θ lies in (a, b)"
- **INCORRECT**: "θ lies in (a, b) with probability γ"

The probability statement is about the random interval (A, B), not about the fixed (but unknown) parameter θ. Once we observe specific values, the interval either contains θ or it doesn't.

# Sampling Distributions

<!-- source: STAT_GU4204_06.pdf (Sen Ch 6), Baydil Lecture Slides -->
<!-- topics: sampling-distribution, gamma, chi-squared, t-distribution, normal-sampling -->

## What is a Sampling Distribution?

A **statistic** T = φ(X₁, ..., Xₙ) is a function of the data, and hence is itself a random variable. Its distribution is called the **sampling distribution**.

## The Gamma Distribution

### Gamma Function

$$\Gamma(\alpha) = \int_0^\infty x^{\alpha-1} e^{-x} \, dx, \quad \alpha > 0$$

**Properties**:
- Γ(α + 1) = α · Γ(α)
- Γ(n) = (n - 1)! for integer n
- Γ(1/2) = √π

### Gamma(α, λ) Distribution

$$f(x | \alpha, \lambda) = \frac{\lambda^\alpha}{\Gamma(\alpha)} e^{-\lambda x} x^{\alpha-1}, \quad x > 0$$

- α = shape parameter, λ = rate parameter
- E(X) = α/λ
- Var(X) = α/λ²

**Reproductive property**: If X₁, ..., Xₙ independent with Xᵢ ~ Gamma(αᵢ, λ), then:

$$\sum_{i=1}^n X_i \sim \text{Gamma}\left(\sum_{i=1}^n \alpha_i, \lambda\right)$$

## The Chi-Squared Distribution

### χ²₁ Distribution

If Z ~ N(0,1), then **W = Z² ~ χ²₁**.

Equivalently: χ²₁ = Gamma(1/2, 1/2).

### χ²_d Distribution (d degrees of freedom)

If Z₁, ..., Z_d are iid N(0,1), then:

$$W_d = Z_1^2 + Z_2^2 + \cdots + Z_d^2 \sim \chi^2_d$$

Equivalently: χ²_d = Gamma(d/2, 1/2).

**Theorem 6.1**: If X ~ χ²_m, then E(X) = m and Var(X) = 2m.

**Theorem 6.2** (Reproductive): If X₁, ..., X_k independent with Xᵢ ~ χ²_{mᵢ}, then:

$$\sum X_i \sim \chi^2_{\sum m_i}$$

## Sampling from a Normal Population

Let X₁, ..., Xₙ iid N(μ, σ²).

**Sample mean**: X̄ₙ = (1/n)ΣXᵢ

**Sample variance** (unbiased): s² = (1/(n-1))Σ(Xᵢ - X̄)²

**Biased version** (MLE): σ̂² = (1/n)Σ(Xᵢ - X̄)²

Note: E(s²) = σ² (unbiased), but E(σ̂²) ≠ σ² (biased)

### Proposition 6.3 (Key Result)

For X₁, ..., Xₙ iid N(μ, σ²):

1. **X̄ₙ and s² are independent** (this characterizes the normal distribution!)
2. X̄ₙ ~ N(μ, σ²/n)
3. s² ~ (σ²/(n-1)) · χ²_{n-1}

Equivalently: S²/σ² = Σ(Xᵢ - X̄)²/σ² ~ χ²_{n-1}

**Theorem 6.4**: If Z₁, ..., Zₙ are iid N(0,1) and A is an orthogonal matrix, then V = AZ has V₁, ..., Vₙ iid N(0,1). Also ΣVᵢ² = ΣZᵢ².

*Note: For the midterm, students are only responsible for the **statement** of Theorem 6.4 (not the proof).*

## The t-Distribution

### Definition

Let Z ~ N(0,1) and V ~ χ²_n, independent. Then:

$$T = \frac{Z}{\sqrt{V/n}} \sim t_n$$

T follows the **t-distribution with n degrees of freedom**.

### Key Properties

1. **Symmetric about 0**: T and -T have the same distribution
2. **Convergence to normal**: As n → ∞, t_n → N(0,1) (by WLLN, V/n →^P 1)
3. **Heavier tails** than N(0,1) for finite n

### Theorem 6.5 (Critical for Confidence Intervals)

For X₁, ..., Xₙ iid N(μ, σ²):

$$\frac{\sqrt{n}(\bar{X}_n - \mu)}{s} \sim t_{n-1}$$

This works because:
- Numerator: √n(X̄ - μ)/σ ~ N(0,1)
- Denominator: √(s²/σ²) = √((1/(n-1))χ²_{n-1} · 1/(n-1))... simplifies via independence of X̄ and s²

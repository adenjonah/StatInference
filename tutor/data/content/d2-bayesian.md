# Bayesian Paradigm

<!-- source: STAT_GU4204_06.pdf (Sen Ch 5), Baydil Lecture Slides -->
<!-- topics: bayesian-inference, prior, posterior, bayes-estimator, conjugate-prior -->

## Overview

The Bayesian approach treats the unknown parameter θ as a **random variable** with its own distribution, rather than a fixed unknown constant (the frequentist view).

## Prior Distribution

The **prior distribution** ξ(θ) represents our belief about θ **before** observing the data.

- Encodes prior knowledge or uncertainty about θ
- Can be informative (strong prior belief) or non-informative (vague/diffuse)
- Common choices: Uniform (non-informative), conjugate priors (mathematically convenient)

## Posterior Distribution

After observing data X = (X₁, ..., Xₙ), we update our belief using **Bayes' theorem**:

$$\xi(\theta | \mathbf{x}) = \frac{f_n(\mathbf{x} | \theta) \cdot \xi(\theta)}{\int f_n(\mathbf{x} | \theta) \cdot \xi(\theta) \, d\theta}$$

Where:
- f_n(x | θ) = likelihood of the data given θ
- ξ(θ) = prior distribution
- Denominator = marginal distribution of X (normalizing constant)

**Key insight**: Posterior ∝ Likelihood × Prior

$$\xi(\theta | \mathbf{x}) \propto f_n(\mathbf{x} | \theta) \cdot \xi(\theta)$$

## Bayes Estimators

A **Bayes estimator** minimizes the expected loss with respect to the posterior distribution.

Under **squared error loss**, the Bayes estimator is the **posterior mean**:

$$\hat{\theta}_{\text{Bayes}} = E[\theta | \mathbf{X}] = \int \theta \cdot \xi(\theta | \mathbf{x}) \, d\theta$$

Under **absolute error loss**, the Bayes estimator is the **posterior median**.

## Conjugate Priors

A prior is **conjugate** for a likelihood if the posterior belongs to the same family as the prior.

| Likelihood | Conjugate Prior | Posterior |
|---|---|---|
| Bernoulli(θ) / Binomial(n,θ) | Beta(α, β) | Beta(α + Σxᵢ, β + n - Σxᵢ) |
| Poisson(λ) | Gamma(α, β) | Gamma(α + Σxᵢ, β + n) |
| Normal(μ, σ² known) | Normal(μ₀, σ₀²) | Normal(weighted mean, combined precision) |
| Exponential(θ) | Gamma(α, β) | Gamma(α + n, β + Σxᵢ) |

## Sampling from a Normal Distribution (Bayesian)

For X₁, ..., Xₙ iid N(μ, σ²) with σ² known and prior μ ~ N(μ₀, v₀²):

**Posterior**: μ | X ~ N(μₙ, vₙ²) where:

$$\mu_n = \frac{\frac{\mu_0}{v_0^2} + \frac{n\bar{X}}{\sigma^2}}{\frac{1}{v_0^2} + \frac{n}{\sigma^2}}, \quad v_n^2 = \frac{1}{\frac{1}{v_0^2} + \frac{n}{\sigma^2}}$$

**Interpretation**: Posterior mean is a **weighted average** of prior mean μ₀ and sample mean X̄, weighted by their respective precisions (1/variance).

- As n → ∞: posterior concentrates around X̄ (data overwhelms prior)
- As v₀² → ∞ (diffuse prior): posterior ≈ N(X̄, σ²/n) (same as frequentist)

## Key Takeaways

- Bayesian inference provides a complete probability distribution for θ (the posterior)
- The posterior combines prior information with data through the likelihood
- With more data, the influence of the prior diminishes
- Conjugate priors make computation tractable (closed-form posteriors)

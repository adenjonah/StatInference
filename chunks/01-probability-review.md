# Probability Review and Setup

<!-- source: STAT_GU4204_01.pdf (Sen Ch 1.1-1.2), STAT_GU4204_02.pdf (Baydil Lecture 1), STAT_GU4204_03.pdf (Baydil Lecture 2) -->
<!-- topics: sample-mean, distributions, normal, binomial, bernoulli, exponential, poisson, variance -->
<!-- related: 02-convergence-and-limit-theorems.md, 03-probability-inequalities.md -->

## Motivation for Statistical Inference

**Statistical inference** is concerned with making *probabilistic statements* about *random variables* encountered in the analysis of data (e.g., means, medians, variances).

### Example 1.1 (Electronic Component Lifetimes)

A company sells electronic components and wants to know how long they last on average. They model the time-to-failure using the exponential distribution family. If the failure rate is theta, then X_n = (X_1, ..., X_n) would be n i.i.d. random variables with Exp(theta).

Key questions:
1. Can we **estimate** theta from data? What is a reasonable estimator?
2. Can we quantify uncertainty, i.e., construct a **confidence interval** for theta?

## Key Distributions

### Bernoulli Distribution

- X ~ Ber(p), where p in [0,1]
- P(X = 1) = p, P(X = 0) = 1 - p
- E(X) = p
- Var(X) = p(1 - p)

### Binomial Distribution

- X ~ Binom(n, p)
- X counts the number of successes in n independent Bernoulli(p) trials
- f_X(x) = C(n,x) p^x (1-p)^{n-x}, for x = 0, 1, ..., n
- E(X) = np
- Var(X) = np(1-p)

**Example (Factory Defective Devices)**: n devices produced by a factory, each independently defective with probability p.
- X = number of defective devices: X ~ Binom(n, p)
- Z_12 = indicator for the 12th device being defective: Z_12 ~ Ber(p)
- Expected number defective: E(X) = np

**Conditional expectation**: Given that at least one device is defective:

E(X | X >= 1) = sum_{k=0}^{n} k * P(X=k, X>=1) / P(X>=1)

where:
- P(X >= 1) = 1 - P(X = 0) = 1 - (1-p)^n
- P(X = k, X >= 1) = P(X = k) * 1(k > 0)

Result: E(X | X >= 1) = np / (1 - (1-p)^n)

### Poisson Distribution

- X ~ Poisson(lambda), lambda > 0
- P(X = k) = e^{-lambda} lambda^k / k!
- E(X) = lambda
- Var(X) = lambda

### Exponential Distribution

- X ~ Exp(theta), theta > 0 (failure rate)
- f_theta(x) = theta * e^{-theta*x} * 1_{[0,inf)}(x)
- E(X) = 1/theta (= theta^{-1})
- Var(X) = 1/theta^2 (= theta^{-2})

### Normal (Gaussian) Distribution

- X ~ N(mu, sigma^2)
- f_X(x) = (1 / sqrt(2*pi*sigma^2)) * exp(-(1/2) * (x - mu)^2 / sigma^2)
- E(X) = mu
- Var(X) = sigma^2

**Key properties of Normal distribution**:
- If X ~ N(mu, sigma^2), then Y = aX + b ~ N(a*mu + b, a^2 * sigma^2)
- If X_i independent N(mu_i, sigma_i^2), then sum_i X_i ~ N(sum_i mu_i, sum_i sigma_i^2)
- If X_i i.i.d. N(mu, sigma^2), then (1/n) sum_i X_i ~ N(mu, sigma^2/n)

### Standard Normal CDF

- Z ~ N(0, 1) is the standard normal
- CDF: Phi(z) = integral from -inf to z of (1/sqrt(2*pi)) * exp(-u^2/2) du
- No closed-form expression for Phi

**Relating any Normal to the Standard Normal**:
- If X ~ N(mu, sigma^2), then F_X(x) = Phi((x - mu) / sigma)
- Left tail: P(X <= x) = Phi((x - mu) / sigma)
- Right tail: P(X > x) = 1 - Phi((x - mu) / sigma)
- Symmetry: 1 - Phi(x) = Phi(-x)

## Sample Mean

**Definition 1 (Sample mean)**: Suppose X_1, ..., X_n are n i.i.d. r.v.'s with unknown mean mu in R (i.e., E(X_1) = mu) and variance sigma^2 < inf. The sample mean is:

X_bar_n := (1/n) * sum_{i=1}^{n} X_i

**Lemma 1.2**: E(X_bar_n) = mu and Var(X_bar_n) = sigma^2 / n.

**Proof**:
- E(X_bar_n) = (1/n) * sum E(X_i) = (1/n) * n*mu = mu
- Var(X_bar_n) = (1/n^2) * Var(sum X_i) = (1/n^2) * n*sigma^2 = sigma^2/n

**Key insight**: As n increases, Var(X_bar_n) -> 0, meaning the sample mean concentrates around the true mean.

### Example (Mice Colony)

The i-th mouse in a colony has weight X_i ~ N(mu, sigma^2). Let Z = (1/n) sum_{i=1}^{n} X_i be the averaged weight of n independent mice.

- Z = X_bar = (1/n) sum X_i
- E(Z) = mu
- Var(Z) = sigma^2/n
- Let W = Z - mu, then f_W(w) ~ N(0, sigma^2/n)
- P(|Z - mu| >= 2*sigma/sqrt(n)) = P(Z < mu - 2*sigma/sqrt(n)) + P(Z > mu + 2*sigma/sqrt(n)) = Phi(-2) + (1 - Phi(2)) = 2*Phi(-2) ≈ 0.05

This means: the probability that the sample mean is more than 2 standard errors from the true mean is approximately 5%.

### Gamma Distribution

- f(x, alpha) = (1/Gamma(alpha)) * x^{alpha-1} * e^{-x}, for x > 0
- More generally, Gamma(alpha, beta): f(x) = (beta^alpha / Gamma(alpha)) * x^{alpha-1} * e^{-beta*x}
- E(X) = alpha/beta
- Var(X) = alpha/beta^2

# Convergence Concepts and Limit Theorems

<!-- source: STAT_GU4204_01.pdf (Sen Ch 1.2-1.3), STAT_GU4204_03.pdf, STAT_GU4204_04.pdf (Baydil Lectures) -->
<!-- topics: convergence-in-probability, convergence-in-distribution, WLLN, SLLN, CLT, continuous-mapping-theorem -->
<!-- related: 01-probability-review.md, 03-probability-inequalities.md, 04-delta-method.md -->

## Convergence in Probability

**Definition 2**: The sample mean (1/n) sum_{i=1}^{n} X_i **converges in probability** to the true (population) mean.

More generally, we say the sequence of r.v.'s {Z_n}_{n=1}^{inf} converges to Z **in probability**, written:

Z_n -P-> Z

if for every epsilon > 0:

P(|Z_n - Z| > epsilon) -> 0 as n -> inf

Equivalently: lim_{n->inf} P(|Z_n - Z| <= epsilon) = 1 for every epsilon > 0.

## Weak Law of Large Numbers (WLLN)

**Theorem 1.3 (WLLN)**: Suppose X_1, X_2, ..., X_n are n i.i.d. r.v.'s with finite mean mu. Then for any epsilon > 0:

P(|(1/n) sum_{i=1}^{n} X_i - E(X)| > epsilon) -> 0 as n -> inf

**In words**: The sample mean of n i.i.d. r.v.'s converges in probability to the true population average as n -> inf.

**Proof sketch (using Chebyshev)**:

P(|(1/n) sum X_i - E(X)| >= epsilon) <= Var(X) / (n * epsilon^2)

As n -> inf, the right side -> 0.

**Illustration**: For X_i i.i.d. Exp(10):
- E(X_1) = 1/10 = 0.1
- Distribution of X_bar_n concentrates around 0.1 as n increases (n=100 vs n=1000)

### Strong Law of Large Numbers (SLLN)

A stronger statement:

P(lim_{n->inf} (1/n) sum_{i=1}^{n} X_i = E(X)) = 1

This is **convergence with probability 1** (almost sure convergence), which is stronger than convergence in probability.

### WLLN Application Example (Poisson Road Counting)

Suppose cars pass a road as X ~ Poisson(lambda). How many days n do I need to count cars to be 99% confident that the sample average is within 10% of the mean?

- E(X) = lambda, Var(X) = lambda
- By Chebyshev: P(|(1/n) sum X_i - E(X)| >= 0.1*E(X)) <= Var(X) / (n * (0.1*E(X))^2) = lambda / (n * 0.01 * lambda^2) = 1/(0.01 * n * lambda)
- Want this <= 0.01 (for 99% confidence)
- So need: n >= 100/lambda * 100 = 10000/lambda

## Convergence in Distribution

**Definition 3**: A sequence of r.v.'s {Z_n}_{n=1}^{inf} with c.d.f.'s F_n(.) **converges in distribution** to F if:

lim_{n->inf} F_n(u) = F(u)

for all u such that F is continuous at u (here F is itself a c.d.f.).

**Important**: Convergence in distribution is **weaker** than convergence in probability:
- Conv. in distribution only looks at the c.d.f.
- Example: If p_X is symmetric, then X, -X, X, -X, ... trivially converges in distribution to X, but does NOT converge in probability
- If U ~ Unif(0,1), then U, 1-U, U, 1-U, ... converges in distribution to Uniform but not in probability

## Central Limit Theorem (CLT)

**Theorem 1.4 (CLT)**: If X_1, X_2, ... are i.i.d. with mean zero and variance 1, then:

(1/sqrt(n)) * sum_{i=1}^{n} X_i -d-> N(0, 1)

More generally, for X_1, X_2, ... i.i.d. with mean mu and variance sigma^2 < inf:

sqrt(n) * (X_bar_n - mu) ≡ (1/sqrt(n)) * sum_{i=1}^{n} (X_i - mu) -d-> N(0, sigma^2)

**Illustration**: For X_i i.i.d. Exp(10) (skewed and non-normal), the distribution of X_bar_n approaches Normal remarkably quickly:
- n = 10: already quite close to Normal
- n = 30, 100: excellent Normal approximation
- Overlaid normal density with mean 0.1 and variance 10^{-1}/sqrt(n) matches closely

## Continuous Mapping Theorem

**Theorem 1.5**: If Z_n -P-> b and g(.) is a function that is continuous at b, then:

g(Z_n) -P-> g(b)

**Theorem 1.6**: If Z_n -d-> Z and g(.) is a continuous function, then:

g(Z_n) -d-> g(Z)

## Application to Example 1.1

For the electronic component example (X_i i.i.d. Exp(theta)):

1. By the LLN: X_bar_n -P-> 1/theta (the expected failure time)
2. By continuous mapping theorem: X_bar_n^{-1} -P-> theta
3. By the CLT: sqrt(n) * (X_bar_n - theta^{-1}) -d-> N(0, theta^{-2})

The question remains: how to find the distribution of X_bar_n^{-1}? This motivates the **delta method** (see 04-delta-method.md).

# Probability Inequalities

<!-- source: STAT_GU4204_04.pdf (Baydil Lecture), STAT_GU4204_01.pdf (Sen) -->
<!-- topics: markov-inequality, chebyshev-inequality, tail-bounds -->
<!-- related: 02-convergence-and-limit-theorems.md, 01-probability-review.md -->

## Motivation

Given a random variable, what can we say about how much probability mass can be far from the mean? These inequalities provide bounds without knowing the exact distribution.

## Markov Inequality

**Statement**: Given a **nonnegative** random variable W, for every number t > 0:

P(W >= t) <= E(W) / t

**Derivation**:

E(W) = integral_0^inf w * f_W(w) dw = integral_0^t w * f_W(w) dw + integral_t^inf w * f_W(w) dw

From this:
- E(W) >= integral_t^inf w * f_W(w) dw >= integral_t^inf t * f_W(w) dw = t * P(W >= t)

Therefore: P(W >= t) <= E(W) / t

**Alternative form**: P(W >= t * E(W)) <= 1/t

**Examples**:
- W ~ Unif(a, b): P(W >= t) <= E(W)/t (crude but always valid)
- W ~ Exp(lambda): P(W >= t) <= E(W)/t

**Interpretation**: A bound on how much probability can be at large values once the mean is specified.

## Chebyshev Inequality

**Derivation**: Take any Z ~ f_Z(z). Apply Markov inequality on Y = (Z - E(Z))^2:

P((Z - E(Z))^2 >= t) <= E((Z - E(Z))^2) / t = Var(Z) / t

Now let t = tau^2:

P((Z - E(Z))^2 >= tau^2) = P(|Z - E(Z)| >= tau)

**Chebyshev Inequality**:

P(|Z - E(Z)| >= tau) <= Var(Z) / tau^2

**Key properties**:
- Now we can ask questions about distance from the mean
- P(Z far from its mean) is bounded by a quantity that increases as Var(Z) increases
- Chebyshev is a special case of Markov (applied to the squared deviation)

## Application to the Sample Mean

Let Z = (1/n) sum_{i=1}^{n} X_i (sample mean). Apply Chebyshev:

P(|Z - E(Z)| >= tau) <= Var(Z) / tau^2

Since Var(Z) = Var(X) / n (for i.i.d. X_i):

P(|(1/n) sum_{i=1}^{n} X_i - E(X)| >= tau) <= Var(X) / (n * tau^2)

**This directly proves the WLLN**: as n -> inf, the right side -> 0 for any fixed tau > 0.

## Example: Required Sample Size via Chebyshev

**Problem**: Rebuilding a road with X ~ Poisson(lambda) cars. How many days n to count to be 99% confident that sample average is within 10% of the mean?

- E(X) = lambda, Var(X) = lambda
- Want: P(|(1/n) sum X_i - E(X)| >= 0.1 * E(X)) <= 0.01
- By Chebyshev: Var(X) / (n * (0.1 * E(X))^2) = lambda / (n * 0.01 * lambda^2) = 100 / (n * lambda)
- Need: 100 / (n * lambda) <= 0.01
- Solution: n >= 10000 / lambda

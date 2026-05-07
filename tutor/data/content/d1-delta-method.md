# Delta Method

<!-- source: STAT_GU4204_01.pdf (Sen Ch 1.4-1.5) -->
<!-- topics: delta-method, asymptotic-distribution, taylor-expansion, transformation -->
<!-- related: 02-convergence-and-limit-theorems.md, 07-maximum-likelihood-estimation.md -->

## Intuition

If {Z_n} converges in distribution (or probability) to a constant theta, then g(Z_n) -d-> g(theta) for any continuous function g(.). But we want more: we want to know the **asymptotic distribution** (not just the limit point) of g(Z_n).

## Theorem 1.7 (Delta Method)

Let Z_1, Z_2, ..., Z_n be a sequence of r.v.'s and let Z be a r.v. with a continuous c.d.f. F*. Let theta in R, and let a_1, a_2, ... be a sequence such that a_n -> inf. Suppose:

a_n * (Z_n - theta) -d-> Z

Let g(.) be a function with a continuous derivative such that g'(theta) != 0. Then:

a_n * (g(Z_n) - g(theta)) / g'(theta) -d-> F*

## Proof Outline

- Think a_n = n^{1/2}, Z_n as the sample mean
- As a_n -> inf, Z_n must get close to theta with high probability
- Since g is continuous, g(Z_n) will be close to g(theta) with high probability
- Taylor expansion: g(Z_n) ≈ g(theta) + g'(theta) * (Z_n - theta)
- Therefore: a_n * (g(Z_n) - g(theta)) / g'(theta) ≈ a_n * (Z_n - theta) -d-> F*

## Main Application: Delta Method with CLT

If we have a CLT for Z_n:

sqrt(n) * (Z_n - mu) / sigma -d-> N(0, 1)

Then by the delta method:

sqrt(n) * (g(Z_n) - g(mu)) -d-> N(0, sigma^2 * (g'(mu))^2)

**In words**: Limit distributions pass through smooth functions in a simple way. The variance gets multiplied by the square of the derivative evaluated at the limit.

## Application to Example 1.1

For X_i i.i.d. Exp(theta), consider estimating theta via X_bar_n^{-1}:

- We know: sqrt(n) * (X_bar_n - theta^{-1}) -d-> N(0, theta^{-2})
- Apply delta method with g(x) = 1/x, so g'(x) = -1/x^2
- g'(theta^{-1}) = -1/(theta^{-1})^2 = -theta^2

Result:

sqrt(n) * (X_bar_n^{-1} - theta) -d-> N(0, (theta^2)^2 * theta^{-2}) = N(0, theta^2)

where we used Var(X_1) = theta^{-2} and g'(theta^{-1}) = -theta^2.

Note: g(x) = 1/x is continuous on (0, inf) which is where X_bar_n lives for positive data.

## Exercises

**Exercise 1**: Assume n^{1/2} * Z_n -d-> N(0, 1).

1. g(Z_n) = (Z_n - 1)^2: What is the asymptotic distribution?
   - g(x) = (x-1)^2, g'(x) = 2(x-1), g'(0) = -2
   - sqrt(n) * ((Z_n - 1)^2 - 1) / (-2) -d-> N(0,1)
   - So sqrt(n) * ((Z_n - 1)^2 - 1) -d-> N(0, 4)

2. g(Z_n) = Z_n^2: Does anything go wrong?
   - g(x) = x^2, g'(x) = 2x, g'(0) = 0
   - The delta method fails because g'(theta) = 0! Need a second-order delta method or different approach.

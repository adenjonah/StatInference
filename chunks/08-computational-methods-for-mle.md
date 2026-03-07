# Computational Methods for Approximating MLEs

<!-- source: STAT_GU4204_01.pdf (Sen Ch 3.2) -->
<!-- topics: newtons-method, EM-algorithm, numerical-optimization, root-finding -->
<!-- related: 07-maximum-likelihood-estimation.md -->

## Motivation

Many MLEs cannot be found in closed form (e.g., Gamma distribution). Numerical methods are needed to approximate the solution.

## Example: Gamma Distribution MLE

X_1, ..., X_n i.i.d. from Gamma(alpha, 1) (rate = 1) distribution:

f(x, alpha) = (1/Gamma(alpha)) * x^{alpha-1} * e^{-x}, for x > 0

Likelihood: L_n(alpha) = (1/Gamma(alpha)^n) * (product X_i)^{alpha-1} * e^{-sum X_i}

Log-likelihood:
l_n(alpha) = -n * log(Gamma(alpha)) + (alpha - 1) * sum log(X_i) - sum X_i

Setting the derivative to zero:
d/d_alpha l_n(alpha) = -n * Gamma'(alpha)/Gamma(alpha) + sum log(X_i) = 0

i.e., Gamma'(alpha)/Gamma(alpha) = (1/n) sum log(X_i) (the digamma function equation)

This equation has **no closed-form solution** — must use numerical methods.

## Newton's Method

Let f(x) be a real-valued function. We want to solve f(x) = 0.

**Algorithm**:
1. Start with an initial guess x_1
2. Update: x_2 = x_1 - f(x_1) / f'(x_1)
3. Repeat: x_{k+1} = x_k - f(x_k) / f'(x_k)
4. Stop when |x_{k+1} - x_k| < tolerance

**Rationale**: Approximate the curve by a line tangent to the curve passing through the point (x_1, f(x_1)). The approximating line crosses the horizontal axis at the revised guess x_2.

**For MLE**: Apply Newton's method to f(x) = l'_n(x) (the derivative of the log-likelihood):

x_{k+1} = x_k - l'_n(x_k) / l''_n(x_k)

This is equivalent to the **Newton-Raphson method** or **Fisher scoring** in statistics.

## The EM Algorithm

The Expectation-Maximization (EM) algorithm is used for finding MLEs when data is incomplete or has latent variables.

Reference: Section 7.6 of DeGroot and Schervish textbook.

(Further details to be covered in lecture if time permits.)

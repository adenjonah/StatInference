# Principles of Estimation: MSE, Bias, and Comparing Estimators

<!-- source: STAT_GU4204_05.pdf (Sen Ch 4.1-4.3) -->
<!-- topics: MSE, mean-squared-error, bias, variance, bias-variance-tradeoff, unbiased, MVUE, inadmissible -->
<!-- related: 05-statistical-models-and-estimation.md, 10-sufficient-statistics.md, 07-maximum-likelihood-estimation.md -->

## Measuring Estimator Performance

**Question**: For a fixed sample size n, how do we measure the performance of an estimator T_n?

### Mean Absolute Error (MAD)

MAD := E_theta[|T_n - g(theta)|]

### Mean Squared Error (MSE)

More commonly used (avoids absolute values):

MSE(T_n, g(theta)) := E_theta[(T_n - g(theta))^2]

Good estimators have MSE that is not too high for all values of theta.

## Bias-Variance Decomposition

**Theorem 4.1**: For any estimator T_n of g(theta):

MSE(T_n, g(theta)) = Var_theta(T_n) + b(T_n, g(theta))^2

where b(T_n, g(theta)) = E_theta(T_n) - g(theta) is the **bias** of T_n as an estimator of g(theta).

**Proof**:

MSE(T_n, g(theta)) = E_theta[(T_n - g(theta))^2]
= E_theta[(T_n - E_theta(T_n) + E_theta(T_n) - g(theta))^2]
= E_theta[(T_n - E_theta(T_n))^2] + (E_theta(T_n) - g(theta))^2 + 2 * E_theta[(T_n - E_theta(T_n))(E_theta(T_n) - g(theta))]

The cross term vanishes since E_theta(T_n) - g(theta) is a constant and E_theta(T_n - E_theta(T_n)) = 0.

**Interpretation**:
- **Bias** measures how much T_n overestimates or underestimates g(theta) on average. It's the deviation of the center of the estimator's distribution from the target.
- **Variance** measures how closely T_n is clustered around its center
- Ideally minimize both simultaneously, but this is rarely possible (bias-variance tradeoff)

## Comparing Estimators

Two estimators T_n and S_n can be compared via their MSEs.

**Definition**: Under parameter value theta, T_n **dominates** S_n as an estimator if:

MSE(T_n, theta) <= MSE(S_n, theta) for all theta in Omega

In this case, S_n is **inadmissible** in the presence of T_n.

**Key result**: There is generally **no** universally best estimator (no single estimator that makes every other inadmissible), except in pathological situations.

### Example 4.2: Binomial Estimators

X ~ Binomial(100, theta), theta in [0, 1]. Three estimators:

1. delta_0(X) = X/100 (natural MLE and MOM estimator)
   - MSE = R(theta, delta_0) = theta(1-theta)/100

2. delta_1(X) = (X + 3)/100
   - MSE = R(theta, delta_1) = (9 + 100*theta*(1-theta))/100^2

3. delta_2(X) = (X + 3)/106
   - MSE = R(theta, delta_2) = (9 - 8*theta)(1 + 8*theta)/106^2

**Findings**:
- delta_0 and delta_2 both dominate delta_1
- Comparison between delta_0 and delta_2 is ambiguous:
  - Near theta = 1/2: delta_2 is preferable
  - Near theta = 0 or 1: delta_0 is preferable
- If theta were known, we could choose — but then no need to estimate!

## Unbiased Estimators

An estimator T_n of g(theta) is **unbiased** if E_theta(T_n) = g(theta) for all theta in Omega, i.e.:

b(T_n, g(theta)) = 0 for all theta in Omega

For an unbiased estimator, **MSE = Variance**.

## Minimum Variance Unbiased Estimator (MVUE)

**Definition**: S_n is an MVUE of g(theta) if:
1. E_theta(S_n) = g(theta) for all theta in Omega (unbiased)
2. For any other unbiased estimator T_n: Var_theta(S_n) <= Var_theta(T_n)

### Important Examples

**(a) Normal mean**: X_1, ..., X_n i.i.d. N(mu, sigma^2)
- X_bar_n is unbiased for mu (E(X_bar) = mu), consistent by WLLN
- X_bar_n is the MVUE of mu
- Any other unbiased estimate of mu has larger variance than sigma^2/n

**(a cont.) Normal variance**: Two estimators of sigma^2:
- sigma_hat^2 = (1/n) sum (X_i - X_bar)^2 — NOT unbiased (this is the MLE)
- s^2 = (1/(n-1)) sum (X_i - X_bar)^2 — unbiased, and in fact is the MVUE of sigma^2

**(b) General case**: For X_1, ..., X_n i.i.d. from any distribution with g(theta) = E_theta(X_1), X_bar_n is ALWAYS an unbiased estimator. Whether it is MVUE depends on the model structure.

**(c) Bernoulli**: X_1, ..., X_n i.i.d. Ber(theta). X_bar_n is the MVUE of theta.

For g(theta) = theta/(1-theta) (the odds): there is **no unbiased estimator** of g(theta) in this model. However, T_n = X_bar_n/(1 - X_bar_n) is a natural (biased) estimator that converges in probability to g(theta).

**Lesson**: Unbiased estimators may not always exist. Imposing unbiasedness as a constraint may not be meaningful in all situations.

**(d) Unbiased is not always better**: The MSE gauges performance, and a biased estimator may actually outperform an unbiased one owing to significantly smaller variance.

### Example 4.3: Uniform Estimation

X_1, ..., X_n i.i.d. Uniform([0, theta]), theta > 0.

Natural estimate: X_(n) = max(X_i) — biased (underestimates theta)

Alternative unbiased: 2*X_bar_n (since E(X_bar) = theta/2)

MSE comparison:
- MSE(2*X_bar_n, theta) = theta^2/(3n) (variance only, unbiased)
- MSE(X_(n), theta) = theta^2/(n(n+2)) * n^2/(n+1)^2 + theta^2/(n+1)^2 — much smaller!

**Best unbiased estimator (MVUE)**: (1 + n^{-1}) * X_(n)

MSE((1+n^{-1})X_(n), theta) = theta^2 / (n(n+2)) — outperforms 2*X_bar by order of magnitude

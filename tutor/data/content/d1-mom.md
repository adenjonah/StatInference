# Method of Moments (MOM) Estimators

<!-- source: STAT_GU4204_01.pdf (Sen Ch 2.2) -->
<!-- topics: method-of-moments, MOM, population-moments, sample-moments, plug-in-estimator -->
<!-- related: 05-statistical-models-and-estimation.md, 07-maximum-likelihood-estimation.md -->

## Definition

The **method of moments** (MOM) is an intuitive method for estimating parameters when other, more attractive methods may be too difficult to implement/compute.

**Definition 11 (MOM estimator)**: Assume X_1, ..., X_n form a random sample from a distribution indexed by a k-dimensional parameter theta, with at least k finite moments. For j = 1, ..., k, let:

mu_j(theta) := E_theta(X_1^j) (the j-th population moment)

Suppose the function mu(theta) = (mu_1(theta), ..., mu_k(theta)) is one-to-one. Let M(mu_1, ..., mu_k) denote the inverse function, so theta = M(mu_1, ..., mu_k).

Define the **sample moments**:

mu_hat_j := (1/n) sum_{i=1}^{n} X_i^j for j = 1, ..., k

The **MOM estimator** of theta is: M(mu_hat_1, ..., mu_hat_k).

**Procedure**: Set up the k equations mu_hat_j = mu_j(theta) for j = 1, ..., k, and solve for theta.

MOM is a "plug-in" method: replace population moments with sample moments, then invert to get the parameter estimate.

## Examples

### Example 2.2: Normal Distribution

X_1, ..., X_n from N(mu, sigma^2). Thus theta = (mu, sigma^2).

- mu_1 = E(X_1) = mu, mu_2 = E(X_1^2) = sigma^2 + mu^2
- So: mu = mu_1, sigma^2 = mu_2 - mu_1^2

MOM estimates:
- mu_hat = mu_hat_1 = X_bar
- sigma_hat^2 = (1/n) sum X_j^2 - X_bar^2 = (1/n) sum (X_i - X_bar)^2

### Example 2.3: Gamma Distribution

X_1, ..., X_n i.i.d. Gamma(alpha, beta), theta = (alpha, beta) in R_+ x R_+.

- mu_1(theta) = alpha/beta
- mu_2(theta) = alpha(alpha+1)/beta^2

Solving the inverse:
- alpha = mu_1^2 / (mu_2 - mu_1^2)
- beta = mu_1 / (mu_2 - mu_1^2)

MOM estimates:
- alpha_hat = mu_hat_1^2 / (mu_hat_2 - mu_hat_1^2)
- beta_hat = mu_hat_1 / (mu_hat_2 - mu_hat_1^2)

### Example 2.4: Bernoulli Trials

X_1, ..., X_n indicators of n Bernoulli trials with success probability theta.

- theta = E(X_1) and also theta = E(X_1^2) (since X^2 = X for Bernoulli)
- MOM from first moment: theta_hat_MOM = X_bar
- MOM from second moment: theta_hat_MOM = (1/n) sum X_j^2 = (1/n) sum X_j = X_bar

Both give the same estimate (coincidence for Bernoulli).

### Example 2.5: Poisson Distribution

X_1, ..., X_n i.i.d. Poisson(lambda), lambda > 0.

- E(X_1) = lambda (first moment)
- Var(X_1) = mu_2 - mu_1^2 = lambda, so mu_2 = lambda + lambda^2

MOM from first moment: lambda_hat = mu_hat_1 = X_bar
MOM from second moment: lambda_hat = X_bar^2 + X_bar (from mu_hat_2 = lambda^2 + lambda)

**Important**: These two estimates are NOT necessarily equal! This illustrates a key disadvantage of MOM — estimates may not be uniquely defined.

### Example 2.6: Exponential Distribution

X_1, ..., X_n i.i.d. Exp(lambda), lambda > 0.

- E(X_1) = 1/lambda, E(X_1^2) = 2/lambda^2
- lambda = 1/mu_1 = sqrt(2/mu_2)

Two different MOM estimators:
- Based on first moment: lambda_hat_MOM = 1/mu_hat_1 = 1/X_bar
- Based on second moment: lambda_hat_MOM = sqrt(2/mu_hat_2)

Again, non-uniqueness of MOM estimates.

## Consistency of MOM Estimators

**Result**: If M is continuous, then the fact that the sample moments m_i converge in probability to mu_i (by the LLN), for every i = 1, ..., k, entails that:

theta_hat = M(mu_hat_1, ..., mu_hat_k) -P-> M(mu_1, ..., mu_k) = theta

**Proof**: By the LLN, sample moments converge in probability to population moments. By the continuous mapping theorem (generalized to k variables), M evaluated at the sample moments converges in probability to theta.

Thus **MOM estimators are consistent under mild assumptions**.

## Key Properties of MOM

1. **Easy to compute**: Generally leads to procedures that are easy to implement, valuable as preliminary estimates
2. **Consistent**: For large sample sizes, estimates are likely to be close to the true value
3. **Prime disadvantage**: They do not provide a unique estimate (different moments can give different answers)

## Remark on Estimating Functions of Parameters

If interested in estimating Psi(theta) where Psi is a known function of theta, the MOM estimate of Psi(theta) is Psi(theta_hat) where theta_hat is the MOM estimate of theta.

# Maximum Likelihood Estimation (MLE)

<!-- source: STAT_GU4204_01.pdf (Sen Ch 3) -->
<!-- topics: likelihood-function, log-likelihood, MLE, maximum-likelihood, invariance, consistency -->
<!-- related: 06-method-of-moments.md, 08-computational-methods-for-mle.md, 09-estimation-principles.md -->

## Setup

We have i.i.d. observations X_1, ..., X_n with common probability density (or mass function) f(x, theta), where theta in Omega is a subset of R^k. The goal is to estimate theta or some Psi(theta).

## Likelihood Function

**Definition 12 (Likelihood function)**: The likelihood function for the sample X_n = (X_1, ..., X_n) is:

L_n(theta) ≡ L_n(theta, X_n) := product_{i=1}^{n} f(X_i, theta)

This is the joint density (or mass function), but viewed as a **function of theta** for a fixed X_n (the realized data).

**Intuition**: When X_i's are discrete, L_n(theta) is exactly the probability that the observed data is realized. We want to find the theta that makes this probability largest.

## Maximum Likelihood Estimate

We seek theta_hat_n in Omega for which L_n(theta) is maximized. This theta_hat_n (assuming it exists) is the value of the parameter that maximizes the likelihood function — i.e., makes the observed data **most likely**.

For obvious reasons, theta_hat_n is called the **maximum likelihood estimate** (MLE).

**Key facts**:
- theta_hat_n is a deterministic function of X_n = (X_1, ..., X_n) and is therefore a random variable
- Nothing guarantees theta_hat_n is unique, even if it exists
- When multiple maximizers exist, we choose the most desirable by some "sensible" criterion

**Practical tip**: Usually maximize the **log-likelihood** l_n(theta) = log L_n(theta) instead, since log is monotonically increasing and products become sums.

## Examples

### Example 3.1: Poisson MLE

X_1, ..., X_n i.i.d. Poisson(theta), theta > 0.

Likelihood: L_n(theta) = product_{i=1}^{n} (e^{-theta} * theta^{X_i} / X_i!) = C(X_n) * e^{-n*theta} * theta^{sum X_i}

Log-likelihood: l_n(theta) = -n*theta + (sum X_i) * log(theta) + const

Setting d/d_theta l_n(theta) = 0:
- -n + (sum X_i) / theta = 0
- **theta_hat_n = X_bar** (sample mean)

Verified as a maximum by checking the second derivative is negative (log-likelihood is strictly concave).

### Example 3.2: Uniform MLE

X_1, ..., X_n i.i.d. Uniform([0, theta]), theta > 0.

Likelihood: L_n(theta) = product_{i=1}^{n} (1/theta) * I_{[0,theta]}(X_i) = (1/theta^n) * I_{[max X_i, inf)}(theta)

L_n(theta) is constant (= 1/theta^n) for theta >= max X_i, and 0 otherwise. Since 1/theta^n is decreasing in theta, the MLE is:

**theta_hat_n = max_{i=1,...,n} X_i = X_(n)**

**Important**: Differentiation does NOT help here because the likelihood is not differentiable at the maximum.

### Example 3.3: Normal MLE

X_1, ..., X_n i.i.d. N(mu, sigma^2). Find MLEs of mu and sigma^2.

Log-likelihood:
l_n(mu, sigma^2) = -(n/2) log(sigma^2) - (1/(2*sigma^2)) sum (X_i - mu)^2 + const
= -(n/2) log(sigma^2) - (1/(2*sigma^2)) sum (X_i - X_bar)^2 - (n/(2*sigma^2)) (X_bar - mu)^2

For any (mu, sigma^2): log L_n(mu, sigma^2) <= log L_n(X_bar, sigma^2), showing:

**mu_hat_MLE = X_bar**

Then maximizing over sigma^2 with mu = X_bar:
l_n(X_bar, sigma^2) = -(n/2) log(sigma^2) - (1/(2*sigma^2)) sum (X_i - X_bar)^2

Setting derivative w.r.t. sigma^2 to zero:
-n/(2*sigma^2) + (1/(2*(sigma^2)^2)) * n * sigma_hat^2 = 0

**sigma_hat^2_MLE = (1/n) sum (X_i - X_bar)^2**

Note: The MLE of sigma^2 uses 1/n (not 1/(n-1)), so it coincides with the MOM estimate but is **biased** (see estimation principles).

### Example 3.4: Non-Uniqueness of MLE

X_1, ..., X_n from Uniform([theta, theta+1]), theta in R.

Any value of theta in [X_(n) - 1, X_(1)] can be selected as an MLE. Thus the MLE is **not unique**.

### Example 3.5: MLE Might Not Exist

X can come with equal probability from N(0,1) or N(mu, sigma^2), where both mu and sigma are unknown.

The p.d.f. is: f(x, mu, sigma^2) = (1/2)[phi(x) + (1/(sigma*sqrt(2*pi))) * exp(-(x-mu)^2/(2*sigma^2))]

The likelihood can be made arbitrarily large by choosing mu = X_k (any observation) and letting sigma^2 -> 0. Since 0 is not a permissible value of sigma^2, the **MLE does not exist**.

### Exercise 2

X_1, ..., X_n i.i.d. Ber(theta), 0 <= theta <= 1. The MLE of theta is X_bar (the sample proportion).

### Exercise 3

X_1, ..., X_n i.i.d. N(mu, sigma^2) with mu >= 0. Maximize log L_n subject to mu >= 0, sigma^2 > 0.

## Properties of MLEs

### 3.1.1 Invariance

**Theorem 3.6 (Invariance property)**: If theta_hat_n is the MLE of theta and Psi is any function, then Psi(theta_hat_n) is the MLE of Psi(theta).

**Example**: If X_i i.i.d. N(mu, sigma^2), then the MLE of mu^2 is X_bar^2.

### 3.1.2 Consistency

Under certain regularity conditions (typically satisfied in practice), the sequence of MLEs is **consistent**:

theta_hat_n -P-> theta as n -> inf

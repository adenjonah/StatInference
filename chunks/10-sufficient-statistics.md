# Sufficient Statistics

<!-- source: STAT_GU4204_05.pdf (Sen Ch 4.4) -->
<!-- topics: sufficient-statistic, factorization-criterion, data-reduction, Rao-Blackwell, information -->
<!-- related: 09-estimation-principles.md, 07-maximum-likelihood-estimation.md -->

## Motivation

In some problems, there may not be any MLE, or there may be more than one. Even when the MLE is unique, it may not be suitable (e.g., Unif(0, theta) MLE always underestimates theta).

The concept of a **sufficient statistic** simplifies the search for a good estimator.

## Intuition

Consider two statisticians estimating theta:
- **Statistician A** can observe all values X_1, ..., X_n
- **Statistician B** can only observe a statistic T = phi(X_1, ..., X_n)

Generally, A will find a better estimator. But in some problems, B can do **just as well** as A. In such cases, T = phi(X_1, ..., X_n) summarizes **all the information** about theta contained in the sample.

A statistic T with this property is called a **sufficient statistic**. It provides "all" the information on theta — no other statistic from the same sample provides additional information about theta.

## Formal Definition

**Definition 13 (Sufficient statistic)**: Let X_1, ..., X_n be a random sample from a distribution indexed by theta in Omega. Let T be a statistic. Suppose that, for every theta in Omega and every possible value t of T, the **conditional joint distribution** of X_1, ..., X_n given T = t (at theta) depends only on t but **not on theta**.

That is, for each t, the conditional distribution of X_1, ..., X_n given T = t is the same for all theta. Then T is a **sufficient statistic for theta**.

**Implication**: If T is sufficient and one observed only T (instead of (X_1, ..., X_n)), one could, at least in principle, simulate (X_1', ..., X_n') with the same joint distribution. T is sufficient for obtaining as much information about theta as one could get from the full data.

## Example 4.4: Poisson Sufficient Statistic

X_1, ..., X_n i.i.d. Poisson(theta), theta > 0. Show T = sum_{i=1}^{n} X_i is sufficient.

Let X = (X_1, ..., X_n).

P_theta(X = x | T(X) = t) = P_theta(X = x, T(X) = t) / P_theta(T = t)

If T(x) != t, the numerator is 0.
If T(x) = t: P(X = x) = e^{-n*theta} * theta^{T(x)} / (product x_i!)

Also: P_theta(T = t) = e^{-n*theta} * (n*theta)^t / t! (since sum of i.i.d. Poisson(theta) ~ Poisson(n*theta))

Therefore:
P_theta(X = x | T = t) = t! / (product x_i! * n^t)

This does **not depend on theta** — so T = sum X_i is sufficient for theta.

Other sufficient statistics include: T = 3.7 * sum X_i, or T = (sum X_i, X_4), or T = (X_1, ..., X_n) (the whole sample is always trivially sufficient).

## Factorization Criterion

**Theorem 4.5 (Fisher-Neyman Factorization)**: Let X_1, ..., X_n form a random sample from a continuous or discrete distribution with p.d.f. or p.m.f. f(x, theta), where theta in Omega. A statistic T = r(X_1, ..., X_n) is **sufficient for theta** if and only if the joint p.d.f. or p.m.f. can be factored as:

f_n(x, theta) = u(x) * nu(r(x), theta)

where:
- u and nu are both non-negative
- u may depend on x but does NOT depend on theta
- nu depends on theta but depends on x **only through** the statistic r(x)

### Example: Poisson via Factorization

X_1, ..., X_n i.i.d. Poi(theta). Joint p.m.f.:

f_n(x, theta) = product (e^{-theta} * theta^{x_i} / x_i!) = (1 / product x_i!) * e^{-n*theta} * theta^{sum x_i}

Take:
- u(x) = 1 / (product x_i!)
- r(x) = sum x_i
- nu(t, theta) = e^{-n*theta} * theta^t

So T = sum X_i is sufficient for theta.

### Example: Gamma with Known Alpha (Unknown Beta)

X_1, ..., X_n i.i.d. Gamma(alpha, beta), alpha known, beta unknown.

f_n(x, beta) = {[Gamma(alpha)]^n * (product x_i)^{alpha-1}}^{-1} * {beta^{n*alpha} * exp(-beta * sum x_i)}

- u(x) part: [Gamma(alpha)]^n * (product x_i)^{alpha-1} (does not depend on beta)
- nu(t, beta) part: beta^{n*alpha} * exp(-beta*t) where t = sum x_i

Sufficient statistic: T_n = sum_{i=1}^{n} X_i

### Example: Gamma with Known Beta (Unknown Alpha)

Same setup, but alpha unknown and beta known.

f_n(x, alpha) = {exp(-beta * sum x_i)} * {beta^{n*alpha} / [Gamma(alpha)]^n * t^{alpha-1}}

where t = product_{i=1}^{n} x_i.

Sufficient statistic: T_n = product_{i=1}^{n} X_i

### Exercise: Uniform Sufficient Statistic

X_1, ..., X_n i.i.d. Unif([0, theta]), theta > 0. Show that T = max{X_1, ..., X_n} is the sufficient statistic.

## Improving Estimators via Sufficiency

Suppose X = (X_1, ..., X_n) from a distribution with p.d.f. f(.|theta), and T is a sufficient statistic for theta.

Let delta(X) be any estimator of g(theta). Define a new estimator by conditioning on T:

delta_0(T) = E_theta[delta(X) | T]

Since T is sufficient, the conditional expectation does not depend on theta (it depends only on the value of T and the data X). So delta_0(T) is indeed an estimator — it depends only on the observations through T.

## Rao-Blackwell Theorem

**Theorem 4.6 (Rao-Blackwell)**: For every value of theta in Omega:

MSE(delta_0(T), g(theta)) <= MSE(delta(X), g(theta))

**In words**: Any estimator can be improved (in terms of MSE) by conditioning on a sufficient statistic. The resulting estimator is at least as good, and typically strictly better.

This result was established independently by D. Blackwell and C. R. Rao in the late 1940s. (See Theorem 7.9.1 in DeGroot and Schervish, Fourth Edition.)

**Practical implication**: When searching for good estimators, restrict attention to functions of sufficient statistics — you never lose anything by doing so.

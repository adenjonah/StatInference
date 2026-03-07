# Statistical Models and Estimation Framework

<!-- source: STAT_GU4204_01.pdf (Sen Ch 2.1), STAT_GU4204_05.pdf (Sen Ch 4 intro) -->
<!-- topics: statistical-model, parameter-space, statistic, estimator, estimate, consistency -->
<!-- related: 06-method-of-moments.md, 07-maximum-likelihood-estimation.md, 09-estimation-principles.md -->

## Statistical Model

**Definition 4 (Statistical model)**: A statistical model consists of:
- An identification of random variables of interest
- A specification of a joint distribution or a family of possible joint distributions for the observable random variables
- The identification of any parameters of those distributions that are assumed unknown
- (Bayesian approach, if desired) a specification of a distribution for the unknown parameter(s)

**Definition 5 (Statistical Inference)**: Statistical inference is a procedure that produces a probabilistic statement about some or all parts of a statistical model.

## Parameter and Parameter Space

**Definition 6 (Parameter space)**: A characteristic or combination of characteristics that **determine the joint distribution** for the random variables of interest is called a **parameter** of the distribution.

The set Omega of **all possible values** of a parameter theta (or vector theta = (theta_1, ..., theta_k)) is called the **parameter space**.

**Examples**:
- Binomial distributions: parameters n and p
- Normal distributions: theta = (mu, sigma^2), parameter space Omega = R x R^+
- Exponential distributions: rate parameter theta > 0, so Omega = (0, inf)

## Statistic

**Definition 7 (Statistic)**: Suppose X_1, ..., X_n are the observable random variables of interest. Let phi be a real-valued function of n real variables. Then T = phi(X_1, ..., X_n) is called a **statistic**.

**Examples**:
- Sample mean: X_bar_n = (1/n) sum_{i=1}^{n} X_i
- Sample maximum: X_(n) = max(X_1, ..., X_n)
- Sample variance: S_n^2 = (1/(n-1)) sum_{i=1}^{n} (X_i - X_bar_n)^2

**Key point**: A statistic is a function of the data only — it does NOT depend on any unknown parameters.

## Estimator and Estimate

**Definition 8 (Estimator/Estimate)**: Let X_1, ..., X_n be observable data whose joint distribution is indexed by theta in Omega.

- An **estimator** theta_hat_n of theta is a real-valued function theta_hat_n = phi(X_1, ..., X_n) — it is a random variable
- If {X_1 = x_1, ..., X_n = x_n} is observed, then phi(x_1, ..., x_n) is called the **estimate** — it is a number

**Definition 9 (General Estimator)**: When Omega is a subset of R^d, let h: Omega -> R^d be a function. Define psi = h(theta). An estimator of psi is a function g(X_1, ..., X_n) that takes values in d-dimensional space.

When h(theta) = theta (identity function), we are estimating the original parameter. When g(theta) is one coordinate of theta, we are estimating just that coordinate.

### Example 2.1 (Patient Treatment)

n patients treated for a condition. X_i = 1 if patient i recovers, X_i = 0 otherwise. Model: X_i i.i.d. Bernoulli(p), 0 <= p <= 1.

- Parameter space: [0, 1]
- By the LLN, p is the limit as n -> inf of the proportion of patients who recover

## Consistency

**Definition 10 (Consistent estimator)**: A sequence of estimators theta_hat_n that **converges in probability** to the unknown value of theta being estimated is called a **consistent sequence of estimators**, i.e., theta_hat_n is consistent if and only if for every epsilon > 0:

P(|theta_hat_n - theta| > epsilon) -> 0 as n -> inf

**Key points**:
- Consistency is a **large sample property**: with probability approaching 1, T_n estimates g(theta) to any pre-determined level of accuracy
- However, consistency alone does not tell us about performance for any particular sample size, or the rate of convergence

## Estimation Problem Setup (Ch 4)

Setup: X_1, ..., X_n are i.i.d. observations from distribution P_theta where theta in Omega (k-dimensional Euclidean space). We assume identifiability: theta_1 != theta_2 implies P_{theta_1} != P_{theta_2}.

**Estimation problem**: Estimate g(theta) where g is some function of theta (often g(theta) = theta itself). Generally g(theta) describes some important aspect of P_theta.

Our estimator of g(theta) will be some function of the observed data X_n = (X_1, ..., X_n).

In general, there will be several different estimators that seem reasonable — the question is finding the most **optimal** one. This requires an objective **measure of performance**.

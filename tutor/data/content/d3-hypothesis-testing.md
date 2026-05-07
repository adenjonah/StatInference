# Hypothesis Testing

<!-- source: STAT_GU4204_08.pdf (Sen Ch 10), DeGroot & Schervish Ch 9 -->
<!-- topics: hypothesis-testing, type-I-error, type-II-error, power-function, p-value, neyman-pearson, UMP, t-test, F-test, likelihood-ratio-test -->

## Setup

Given i.i.d. data X₁, …, Xₙ ~ P_θ from a model parametrized by θ ∈ Ω. We split the parameter space:

$$\Omega = \Omega_0 \cup \Omega_1, \qquad \Omega_0 \cap \Omega_1 = \emptyset$$

The **testing problem** is

$$H_0: \theta \in \Omega_0 \quad \text{vs.} \quad H_1: \theta \in \Omega_1$$

- **H₀** = null hypothesis
- **H₁** = alternative hypothesis
- **Question**: Is there enough evidence in the data against H₀?

### Types of Hypotheses

For a one-dimensional θ:
- **One-sided**: H₀: θ ≤ θ₀ vs. H₁: θ > θ₀  (or reversed)
- **Two-sided**: H₀: θ = θ₀ vs. H₁: θ ≠ θ₀

H₀ is **simple** if Ω₀ contains only one point; otherwise **composite**.

---

## 10.2 — Critical Regions and Test Statistics

A **test procedure** (denoted δ) partitions the sample space S into:
- **Rejection region (critical region)** S₁ — values of **X** for which we reject H₀
- **Acceptance region** S₀ — values of **X** for which we do NOT reject H₀

Most tests use a **test statistic** T = φ(**X**) and reject H₀ when T ∈ R (a fixed subset of ℝ):

$$S_1 = \{\mathbf{x} : \varphi(\mathbf{x}) \in R\}$$

Typical form: reject H₀ when T ≥ c.

**Example (Normal mean, σ known):** Test H₀: μ = μ₀ vs. H₁: μ ≠ μ₀ using T = |X̄ − μ₀|. Reject for T > c.

### Type I and Type II Errors

| State \ Decision | Fail to reject H₀ | Reject H₀ |
|------------------|-------------------|-----------|
| H₀ True          | Correct           | **Type I error** |
| H₁ True          | **Type II error** | Correct |

- **Type I error**: rejecting H₀ when H₀ is true
- **Type II error**: failing to reject H₀ when H₀ is false

---

## 10.3 — Power Function and Errors

The **power function** of a test δ with critical region S₁:

$$\pi(\theta \mid \delta) = \mathbb{P}_\theta(\mathbf{X} \in S_1), \quad \theta \in \Omega$$

If the test uses a statistic T with rejection region R:

$$\pi(\theta \mid \delta) = \mathbb{P}_\theta(T \in R)$$

- For θ ∈ Ω₀: π(θ|δ) = P(Type I error)
- For θ ∈ Ω₁: 1 − π(θ|δ) = P(Type II error)

**Ideal power function**: 0 on Ω₀ and 1 on Ω₁ (impossible in practice).

**Goal trade-off**: making π small on Ω₀ usually makes π small on Ω₁ too. Standard resolution: bound the Type I rate at α₀ and maximize power on Ω₁.

### Worked example — Uniform(0, θ)

Test H₀: 3 ≤ θ ≤ 4 vs. H₁: θ < 3 or θ > 4. Use T = X₍ₙ₎ (the MLE) with rejection region

$$S_1 = \{\mathbf{x}: x_{(n)} \leq 2.9 \text{ or } x_{(n)} \geq 4\}$$

Power function:

$$\pi(\theta\mid\delta) = \mathbb{P}_\theta(X_{(n)}\leq 2.9) + \mathbb{P}_\theta(X_{(n)}\geq 4)$$

- θ ≤ 2.9: π = 1
- 2.9 < θ ≤ 4: π = (2.9/θ)ⁿ
- θ > 4: π = (2.9/θ)ⁿ + [1 − (4/θ)ⁿ]

---

## 10.4 — Significance Level

A test δ is a **level α₀ test** if

$$\pi(\theta \mid \delta) \leq \alpha_0 \quad \forall\, \theta \in \Omega_0$$

The **size** of δ is:

$$\alpha(\delta) = \sup_{\theta \in \Omega_0} \pi(\theta \mid \delta)$$

- δ has level α₀ ⟺ α(δ) ≤ α₀
- For simple H₀: θ = θ₀: α(δ) = π(θ₀|δ)

### Choosing the critical value

For test "reject H₀ if T ≥ c" with desired level α₀:

$$\sup_{\theta \in \Omega_0} \mathbb{P}_\theta(T \geq c) \leq \alpha_0$$

The LHS is non-increasing in c, so larger c satisfies it. Pick the smallest c that does (most powerful).

### Z-test for normal mean (σ known)

Test H₀: μ = μ₀ vs. H₁: μ ≠ μ₀. Use the **z-statistic**:

$$Z = \frac{\overline{X} - \mu_0}{\sigma/\sqrt{n}} = \frac{\sqrt{n}(\overline{X} - \mu_0)}{\sigma}$$

Under H₀: Z ~ N(0, 1). Reject H₀ if |Z| > z_{α₀/2}, where z_{α₀/2} is the (1 − α₀/2)-quantile of N(0, 1).

**Acceptance region:**

$$\mathcal{A} = \left\{\mathbf{x}: \mu_0 - \frac{\sigma}{\sqrt{n}} z_{\alpha_0/2} \leq \overline{x} \leq \mu_0 + \frac{\sigma}{\sqrt{n}} z_{\alpha_0/2}\right\}$$

---

## 10.5 — P-value

The **p-value** is the smallest level α₀ at which we would reject H₀ given the observed data.

Also called the *observed level of significance*.

**Decision rule**: Reject H₀ at level α₀ ⟺ p-value ≤ α₀.

**Advantages**:
1. No need to fix α₀ in advance — let the reader decide
2. Communicates strength of evidence

**Example**: If observed Z = 2.78, p-value = 2(1 − Φ(2.78)) ≈ 0.0054.

---

## 10.6 — Testing Simple Hypotheses: Optimal Tests

Setup: Ω = {θ₀, θ₁}, joint density f₀ or f₁.

$$H_0: \theta = \theta_0 \quad \text{vs.} \quad H_1: \theta = \theta_1$$

Special notation:
- α(δ) = P_{θ₀}(reject H₀)
- β(δ) = P_{θ₁}(NOT reject H₀)

### 10.6.1 — Neyman-Pearson Lemma

**Theorem 10.1**: Suppose δ' is a test of the form, for some k > 0:

- Do NOT reject H₀ if f₁(**x**) < k·f₀(**x**)
- Reject H₀ if f₁(**x**) > k·f₀(**x**)
- Either decision allowed if f₁(**x**) = k·f₀(**x**)

Then for any other test δ:

- α(δ) ≤ α(δ') ⟹ β(δ) ≥ β(δ')
- α(δ) < α(δ') ⟹ β(δ) > β(δ')

**Interpretation**: The likelihood ratio test minimizes Type II error among tests with the given Type I bound.

**Worked example**: X₁, …, Xₙ ~ N(θ, 1). Test H₀: θ = 0 vs. H₁: θ = 1 at α₀ = 0.05.

Likelihood ratio:

$$\frac{f_1(\mathbf{x})}{f_0(\mathbf{x})} = \exp\left[n\left(\bar{x} - \tfrac{1}{2}\right)\right]$$

Rejecting when LR > k is equivalent to rejecting when X̄ > k' where k' = ½ + (log k)/n. Solve P_0(X̄ > k') = 0.05 ⟹ √n · k' = 1.645.

---

## 10.7 — Uniformly Most Powerful (UMP) Tests

Setup: composite alternative, e.g.,

$$H_0: \theta \leq \theta_0 \quad \text{vs.} \quad H_1: \theta > \theta_0$$

A test δ* is **UMP at level α₀** if α(δ*) ≤ α₀ AND for every other level α₀ test δ:

$$\pi(\theta \mid \delta) \leq \pi(\theta \mid \delta^*) \quad \forall\, \theta \in \Omega_1$$

**Caveat**: UMP tests usually don't exist for two-sided alternatives — only for monotone likelihood ratio (MLR) families with one-sided alternatives.

---

## 10.8 — The t-test (Normal mean, σ unknown)

Test H₀: μ = μ₀ vs. H₁: μ ≠ μ₀ when σ² is unknown.

**Test statistic**:

$$U_n = \frac{\overline{X}_n - \mu_0}{s_n / \sqrt{n}}, \quad s_n = \sqrt{\frac{1}{n-1}\sum_{i=1}^n (X_i - \overline{X}_n)^2}$$

Under H₀: U_n ~ t_{n−1}.

**Reject H₀** if:

$$|U_n| \geq T_{n-1}^{-1}(1 - \alpha_0/2)$$

(the (1 − α₀/2)-quantile of the t-distribution with n − 1 d.f.)

**P-value (two-sided)**: 2[1 − T_{n−1}(|u|)] where u is the observed U_n.

### Power function (σ known case, for intuition)

For two-sided z-test:

$$\pi(\mu\mid\delta) = \Phi\!\left(-z_{\alpha/2} + \frac{\sqrt{n}(\mu - \mu_0)}{\sigma}\right) + \Phi\!\left(-z_{\alpha/2} - \frac{\sqrt{n}(\mu - \mu_0)}{\sigma}\right)$$

Properties:
- π(μ₀|δ) = α₀ (size of test)
- π → 1 as μ → ±∞
- Symmetric around μ₀

### Non-central t-distribution

If W ~ N(ψ, 1) and Y ~ χ²ₘ are independent, then

$$X = \frac{W}{\sqrt{Y/m}} \sim t_m(\psi)$$

is the **non-central t-distribution** with m d.f. and non-centrality parameter ψ.

For the t-test of H₀: μ = μ₀, the statistic U_n has a non-central t with n − 1 d.f. and

$$\psi = \frac{\sqrt{n}(\mu - \mu_0)}{\sigma}$$

Power function:

$$\pi(\mu, \sigma^2 \mid \delta) = T_{n-1}(-c \mid \psi) + 1 - T_{n-1}(c \mid \psi), \quad c = T_{n-1}^{-1}(1 - \alpha_0/2)$$

### 10.8.2 — One-sided t-test

Test H₀: μ ≤ μ₀ vs. H₁: μ > μ₀.

- When μ = μ₀: U_n ~ t_{n−1}
- **Reject H₀** if U_n ≥ c, where c = T_{n−1}⁻¹(1 − α₀)
- **P-value**: 1 − T_{n−1}(u)

For H₀: μ ≥ μ₀ vs. H₁: μ < μ₀: reject if U_n ≤ c = T_{n−1}⁻¹(α₀).

---

## 10.9 — Two-Sample t-Test

Two independent samples, **common unknown variance** σ²:
- **X** = (X₁, …, X_m) ~ N(μ₁, σ²)
- **Y** = (Y₁, …, Y_n) ~ N(μ₂, σ²)

### Test statistic

$$U_{m,n} = \frac{\sqrt{m+n-2}\,(\overline{X}_m - \overline{Y}_n)}{\sqrt{(\tfrac{1}{m}+\tfrac{1}{n})(S_X^2 + S_Y^2)}}$$

where S_X² = Σ(X_i − X̄)² and S_Y² = Σ(Y_j − Ȳ)². Under μ₁ = μ₂: U_{m,n} ~ t_{m+n−2}.

### One-sided alternatives

**H₀: μ₁ ≤ μ₂ vs. H₁: μ₁ > μ₂**: reject if U_{m,n} ≥ T_{m+n−2}⁻¹(1 − α₀). P-value = 1 − T_{m+n−2}(u).

**H₀: μ₁ ≥ μ₂ vs. H₁: μ₁ < μ₂**: reject if U_{m,n} ≤ T_{m+n−2}⁻¹(α₀). P-value = T_{m+n−2}(u).

### Two-sided alternative

H₀: μ₁ = μ₂ vs. H₁: μ₁ ≠ μ₂: reject if |U_{m,n}| ≥ T_{m+n−2}⁻¹(1 − α₀/2). P-value = 2[1 − T_{m+n−2}(|u|)].

Power function uses non-central t with non-centrality:

$$\psi = \frac{\mu_1 - \mu_2}{\sqrt{\sigma^2(\tfrac{1}{m} + \tfrac{1}{n})}}$$

---

## 10.10 — F-test (Comparing Two Variances)

Two independent samples from N(μ₁, σ₁²) and N(μ₂, σ₂²), all four parameters unknown.

### F-distribution

If Y ~ χ²_m and W ~ χ²_n are independent:

$$X = \frac{Y/m}{W/n} \sim F_{m, n}$$

### Test statistic

$$V_{m,n} = \frac{S_X^2/(m-1)}{S_Y^2/(n-1)}$$

Under σ₁² = σ₂²: V_{m,n} ~ F_{m−1, n−1}. Let G_{m−1, n−1} be the F-cdf.

### One-sided

**H₀: σ₁² ≤ σ₂² vs. H₁: σ₁² > σ₂²**: reject if V_{m,n} ≥ G_{m−1,n−1}⁻¹(1 − α₀). P-value = 1 − G(v).

### Two-sided

**H₀: σ₁² = σ₂² vs. H₁: σ₁² ≠ σ₂²**: reject if V ≤ c₁ or V ≥ c₂, with

$$c_1 = G^{-1}(\alpha_0/2), \quad c_2 = G^{-1}(1 - \alpha_0/2)$$

---

## 10.11 — Likelihood Ratio Test (LRT)

For H₀: θ ∈ Ω₀ vs. H₁: θ ∈ Ω₁, the **likelihood ratio statistic**:

$$\Lambda(\mathbf{X}) = \frac{\sup_{\theta \in \Omega_0} L_n(\theta, \mathbf{X})}{\sup_{\theta \in \Omega} L_n(\theta, \mathbf{X})}$$

where Ω = Ω₀ ∪ Ω₁. Note 0 ≤ Λ ≤ 1.

**LRT**: reject H₀ when Λ(**x**) ≤ k. Choose k for desired level α₀.

**Interpretation**: Reject when likelihood under Ω₀ is small relative to overall.

### Equivalences (for normal problems)

- Test H₀: μ = μ₀ (σ known) ⟺ z-test
- Test H₀: σ² = σ₀² (μ unknown) ⟺ χ²-test
- Test H₀: μ = μ₀ (σ unknown) ⟺ t-test

### Asymptotic distribution of LR

**Theorem 10.2 (Wilks)**: If H₀ specifies k coordinates of θ have specific values and the MLE is asymptotically normal/efficient, then under H₀ as n → ∞:

$$-2 \log \Lambda(\mathbf{X}) \xrightarrow{d} \chi^2_k$$

This lets you set critical values asymptotically using χ² tables.

---

## 10.12 — Equivalence of Tests and Confidence Sets

**Key duality**: A confidence set is the family of null values that would *not* be rejected by a level α₀ test.

### From CI to test

**Acceptance region** of the level α₀ z-test of H₀: μ = μ₀:

$$\mathcal{A}_{\mu_0} = \left\{\mathbf{x}: \overline{x} - \tfrac{\sigma}{\sqrt{n}} z_{\alpha_0/2} \leq \mu_0 \leq \overline{x} + \tfrac{\sigma}{\sqrt{n}} z_{\alpha_0/2}\right\}$$

The set of μ̃ that fails to be rejected:

$$\left[\overline{X} - \tfrac{\sigma}{\sqrt{n}} z_{\alpha_0/2},\ \overline{X} + \tfrac{\sigma}{\sqrt{n}} z_{\alpha_0/2}\right]$$

— precisely the standard 1 − α₀ CI.

### Theorem 10.3 — Test/CI Duality

For each θ₀ ∈ Ω, let 𝒜(θ₀) be the acceptance region of a level α test of H₀: θ = θ₀. Define

$$\mathcal{S}(\mathbf{x}) = \{\theta_0 : \mathbf{x} \in \mathcal{A}(\theta_0)\}$$

Then 𝒮(**X**) is a **(1 − α) confidence set** for θ. Conversely, given a confidence set, you can construct level α tests by inverting.

**Practical use**: given any level α test (often easy), invert to obtain a CI.

---

## Quick Reference Table

| Hypothesis | Distribution | Test Statistic | Rejection (two-sided level α) |
|---|---|---|---|
| μ = μ₀, σ known | N(μ, σ²) | Z = √n(X̄ − μ₀)/σ | \|Z\| > z_{α/2} |
| μ = μ₀, σ unknown | N(μ, σ²) | U = √n(X̄ − μ₀)/s | \|U\| > t_{n−1, α/2} |
| μ₁ = μ₂, common σ unknown | N | Two-sample t | \|U_{m,n}\| > t_{m+n−2, α/2} |
| σ₁² = σ₂² | N | V = (S_X²/(m−1))/(S_Y²/(n−1)) | V ∉ [F_{α/2}, F_{1−α/2}] |
| Composite | Any | Λ(X) | Λ ≤ k or −2 log Λ > χ²_{k, 1−α} |

---

## Common Pitfalls

1. **Forgetting the side**: One-sided vs. two-sided changes the critical value (z_{α} vs. z_{α/2}).
2. **σ known vs. unknown**: Use Z when σ is known, U (t-stat) when not.
3. **Power vs. size**: size = sup over Ω₀; power = π(θ) for θ ∈ Ω₁.
4. **Non-existent UMP**: Two-sided tests of normal mean have no UMP — typical case.
5. **CI/test inversion**: Always remember the duality — saves lots of derivation.

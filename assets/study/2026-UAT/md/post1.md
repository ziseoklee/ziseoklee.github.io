<!--
title: The Problem of Representing a Continuous Function
date: 2026-02-13
tags: []
-->

# The Problem of Representing a Continuous Function

[← Back to contents](index.html)

**Theorem 1** (Taylor, 1715). Any continuous function $f(x):\mathbb{R}\to\mathbb{R}$ that is $k-$times differentiable at $a\in\mathbb{R}$ can be represented as a sum of polynomials:
$$
f(x)=f(a) + f'(a) (x-a) + \frac{f''(a)}{2} (x-a)^2 +\cdots + \frac{f^{(k)}(a)}{k!}(x-a)^k + R_k(x)
$$
where $R_k(x)=o(|x-a|^k)$ is the residual term. A special case for $a=0$ gives the Maclaurin series:
$$
f(x)=f(0) + f'(0) x + \frac{f''(0)}{2} x^2 +\cdots + \frac{f^{(k)}(0)}{k!}x^k + R_k(x)
$$

Taylor/Maclaurin series shows that polynomial functions can approximate any continuous smooth functions with sufficient accuracy. Similar ideas were presented in the Fourier series in which the results are initially given for periodic functions:

**Theoreom 2** (Fourier, 1807). Any continuous and periodic function $f(x)$ can be expressed as a sum of sinusoids:
$$
f(x)=A_0 + \sum_{i=1}^N A_i \cos\left(\frac{2\pi i}{T}x + \phi_i \right)
$$
where $T$ is the period of the function, $A_i$ is the amplitude and $\phi_i$ is the phase of the $i-$th harmonic component.

Later, the results are generalized for nonperiodic functions, which resulted in the Fourier transform. Another milestone is the Weierstrass approximation theorem, which can be considered an extension of Taylor's theorem to arbitrary continuous functions:

**Theorem 3** (Weierstrass, 1885). Any continuous real-valued function $f(x):[a,b]\to\mathbb{R}$ defined on the interval $[a,b]$ can be approximated with a polynomial function $p_N(x)=\sum_{i=0}^N c_i x^i$ with finite degree $N$ such that 
$$
|f(x) - p_N(x)| < \epsilon
$$
for arbitrary $\epsilon>0$.

Weierstrass's theorem implies that any continuous function on a closed interval can be uniformly approximated by a polynomial function with arbitrary accuracy. Later on in the 1900s, the problem of decomposing continuous multivariable functions as a finite superposition of continuous univariate and bivariate functions attracted a lot of research interest. This started with the continuous variant of Hilbert's 13th problem: *Can any continuous function of more than two variables be expressed as a superposition of finitely many continuous functions of two variables?*

This problem was solved by Arnold and Kolmogorov in 1957 which resulted in the Kolmogorov-Arnold representation theorem stated below:

**Theorem 4** (Kolmogorov and Arnold, 1959). Any continuous multivariate function $f[0,1]^n\to \mathbb{R}$ can be written as
$$
f(\mathbf{x}) = f(x_1, \dots, x_n) = \sum_{j=1}^{2n+1}\beta_j \left(\sum_{i=1}^n \alpha_{ij}(x_i)\right)
$$
where $\alpha_{ij}:[0,1]\to \mathbb{R}$ and $\beta_j:\mathbb{R}\to\mathbb{R}$.
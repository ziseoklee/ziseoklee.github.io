<!--
title: Regularized Optimal Transport: Enhancing Tractability and Properties
date: 2025-08-25
tags: [OT, math]
-->

# Regularized Optimal Transport: Enhancing Tractability and Properties

[← Back to contents](index.html)

Despite its theoretical elegance and broad applicability, classical Optimal Transport faces significant practical limitations, particularly when dealing with high-dimensional data or large-scale datasets. **Regularization techniques** have emerged as a powerful solution to address these challenges, transforming OT into a computationally tractable and statistically robust framework.

## 1. Motivation for Regularization: Overcoming Computational and Statistical Challenges

The primary impediment to the widespread adoption of classical Optimal Transport has been its substantial computational burden. For discrete measures with $n$ atoms, the exact solution of the Kantorovich problem typically scales with a complexity of $$O(n^3\log n) \text{ or } O(n^3)$$
This is prohibitively expensive for large datasets commonly encountered in modern applications. This computational bottleneck severely limited the practical impact of OT, despite its compelling theoretical appeal.

Beyond computational cost, the unregularized OT problem, while convex, is not strictly convex for general cost functions. This can lead to non-uniqueness of the optimal transport plan, which in turn can cause numerical instability in optimization algorithms. Furthermore, when estimating Wasserstein distances from sampled data, vanilla OT is susceptible to the "curse of dimensionality." This means that the quality of approximation degrades significantly as the dimensionality of the data increases (approximation error is $O(n^{-1/d})$ for $d\geq 3$), making statistical inference and stability challenging in high-dimensional settings. Regularization is proposed as a remedy to these issues, aiming to make the computation of transport plans more tractable and efficient, and to improve statistical stability.

## 2. General Framework of Regularized OT

Regularized Optimal Transport modifies the original OT optimization problem by adding a penalty term to the objective function. This penalty term, often a $\phi$-divergence between the transport plan $\pi(x,y)$ and a reference measure (typically the product of the marginals $\mu\otimes \nu$), serves to steer the solution towards desired properties, such as smoothness or a certain level of diffuseness.   

The general primal formulation of regularized OT is expressed as:
$$ W_{\phi, \epsilon}(\mu, \nu) := \min_{\pi \in \Pi(\mu, \nu)} \left( \int_{X \times Y} c(x, y)d\pi(x, y) + \epsilon D_\phi(\pi \mid\mid \mu \otimes \nu) \right) $$
Here, $\epsilon>0$ is the regularization parameter, which controls the strength of the penalty, and $D_\phi$ is a $\phi$-divergence. Recall that for a convex function $f:[0,\infty)\to (-\infty,\infty]$ such that $f(x)$ is finite for all $x>0$, $f(1)=0$, $f(0)=\lim_{t\to 0+}f(t)$, the $f-$divergence of probability distribution $P$ from $Q$ is defined as 
$$
D_f(P\mid\mid Q) := \int_\Omega f\left(\frac{dP}{dQ}\right)dQ
$$
We call $f$ the generator of $D_f$.
The regularization term $ \epsilon D_\phi(\pi \mid\mid \mu \otimes \nu)$ increases as the transport plan $\pi$ deviates more from the product measure $\mu\otimes \nu$, thereby favoring transport plans that are "more similar" to this reference.   

A key advantage of regularization is that it often replaces the hard constraints present in the dual formulation of standard OT with a smooth regularization term. This transformation makes the dual problem significantly more amenable to efficient optimization methods, as strong duality generally holds for regularized OT. Regularization also contributes to ensuring uniqueness of the optimal solution for certain cases, particularly with specific choices of regularizers.

The introduction of regularization transforms Optimal Transport from a powerful but impractical theoretical tool into a computationally viable and statistically robust framework. The fundamental problem with classical OT was its overwhelming computational complexity and its sensitivity to high-dimensional data, which created a significant barrier to its practical use. Regularization directly targets these issues by adding a penalty term to the objective function. This penalty, while introducing a controlled amount of bias (an approximation error), fundamentally alters the optimization landscape. For instance, specific regularizers like entropy can make the problem strictly convex, which in turn ensures uniqueness of the solution and enables the use of highly efficient, gradient-based algorithms like Sinkhorn. Furthermore, regularization significantly improves statistical stability by mitigating the "curse of dimensionality" that plagues vanilla OT when dealing with sampled data. This means that a slight compromise on "exactness" through regularization leads to immense gains in practical utility and applicability, expanding the reach of OT theory into real-world, large-scale problems. This exemplifies a crucial principle in applied mathematics and computational science: sometimes, a strategic trade-off in theoretical purity can yield profound benefits in terms of computational feasibility and real-world impact.
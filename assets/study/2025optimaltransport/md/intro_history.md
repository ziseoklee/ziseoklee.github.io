<!--
title: Introduction to Optimal Transport
date: 2025-08-25
tags: [OT, math]
-->

# Introduction to Optimal Transport

[← Back to contents](index.html)



## 1. Historical Foundations: Monge and Kantorovich Formulations

The origins of Optimal Transport trace back to the 18th century, with significant advancements in the 20th century that transformed it into a powerful modern theory.

### **Monge's Original Formulation (1781)**
Gaspard Monge first formulated the problem in 1781, driven by practical concerns such as optimizing the movement of earth for construction projects. Monge sought to identify a one-to-one measurable mapping $T:X\to Y$ that transports mass from a source probability distribution $\mu$ on a space $X$ to a target probability distribution $\nu$ on space $Y$. The objective was to minimize the total transportation cost defined by the integral
$$
\int_X c(x, T(x))d\mu(x)
$$
where $c(x,y)$ is the cost of moving a unit of mass from $x$ to $y$, subject to the push-forward condition $T_\text{#}\mu=\nu$.

Despite its intuitive appeal, Monge's formulation proved notoriously difficult to solve. Its **non-convex** nature and the stringent requirement that mass cannot be split (i.e., a single point $x$ from the source must map to a single point $T(x)$ in the target) often led to the non-existence of such optimal maps, particularly for general measures or discrete distributions where a one-to-one correspondence is not always feasible. This inherent difficulty severly limited its practical applicability for over a century.

### **Kantorovich's Relaxation (1942)**
A pivotal breakthrough occured in 1942 when Leonid Kantorovich provided a crucial relaxation of Monge's problem. Instead of seeking a direct map, Kantorovich introduced the concept of a joint transportation plan, or coupling, $\pi(x,y)$. This $\pi$ is a probability measure on the product space $X\times Y$, specifying the amount of mass moved between each source-target pair $(x,y)$, thereby allowing for mass splitting. This reformulation transformed the problem into a convex linear program:
$$
\min_{\pi\in\Pi(\mu,\nu)}\int_{X\times Y}c(x,y)d\pi(x,y)
$$
where $\Pi(\mu,\nu)$ denotes the set of all joint probability measures on $X\times Y$ whose marginals are $\mu,\nu$ respectively. 

A **linear program** is an optimization problem where the objective function and all constraints are linear. In its standard form, a primal LP is defined as:
$$
\text{maximize}\quad c^Tx \quad \text{subject to}\quad Ax=b, x \geq 0
$$
where $x$ is the vector of decision variables, $c, b$ are vectors of coefficients, and $A$ is a matrix.

For discrete measures, say $\mu=\sum_i \alpha_i \delta_{x_i}$ and $\nu = \sum_j \beta_j \delta_{y_j} $, the Kantorovich problem becomes a finite dimensional optimization problem over a matrix of transport probabilities $\pi_{ij}$:
$$
\text{minimize}\quad \sum_{i,j}c_{ij} \pi_{ij} \quad \text{subject to}\quad \sum_j \pi_{ij} = \alpha_i, \sum_i \pi_{ij} = \beta_j, \pi_{ij}\geq 0 \quad \forall i,j
$$

The objective function is linear (a linear combination of decision variables $\pi_{ij}$) and convex (linear functions are convex). The marginal constraints and the non-negativity constraints are all linear (forming a convex set). Thus the minimum of a convex function over a convex set is a convex linear program. This tractability is a major advantage of the Kantorovich formulation over the Monge problem.

### Dual Formulation and Duality Theorems
The Kantorovich dual problem gives an alternative, equivalent formulation of the primal problem from a "pricing" persepctive. Instead of finding the cheapest way to move mass, it seeks to find the most profitable way to set prices at the source and destination while ensuring that no transport path is profitable to the shipper. This is done by introducing **dual potentials** or **Kantorovich potentials**, which are functions $f:X\to \mathbb{R}$ and $g:Y\to \mathbb{R}$.

For the discrete case, the dual problem is:
$$
\text{maximize}\quad \sum_i \alpha_i f_i + \sum_j \beta_j g_j \quad \text{subject to}\quad f_i + g_j \leq c_{ij} \quad \forall i,j
$$
This is also a linear program, where the variables are the potentials $f_i, g_j$. 

**Weak Duality Theorem**: Let $P_K$ be the value of the primal Kantorovich problem and $D_K$ be the value of its dual. For any feasible primal plan $\pi$ and any feasible dual potentials $(f,g)$, the following inequality holds:
$$
\sum_{i,j} c_{ij} \pi_{ij} \geq \sum_i \alpha_i f_i + \sum_j \beta_j g_j 
$$
This implies $P_K\ geq D_K$. The weak duality theorem holds generally for any linear program and essentially states that any feasible dual solution provides a **lower bound** on the optimal primal value.

**Strong duality theorem**: Under general conditions (e.g., in the discrete case, or for continuous spaces under mild assumptions on the cost function and measures), the value of the primal problem equals the value of the dual problem.
$$
P_K = D_K
$$
Furthermore, if the primal and dual problems have finite optimal values, there exist optimal solutions $\pi^\*$ and $(f^\*, g^\*)$ such that complementary slackness holds:
$$
\pi^\*_{ij}(f^\*_i+g^\*_j - c\_{ij} )=0 \quad \forall i, j
$$
This condition is central to the theory and states that mass is only transported along paths where the "transport price" is equal to the "transport cost", providing a powerful optimality criterion:
$$
f^\*_i+g^\*_j = c\_{ij}
$$

### Life Lesson from Kantorovich
> When faced with intractable problems, a carefully chosen relaxation can unlock computational tractability and broader applicability, even if it slightly abstracts the direct physical interpretation

The evolution from Monge's original problem to Kantorovich's relaxation represents a fundamental paradigm shift in mathematical optimization. Monge's formulation, while conceptually straightforward in its direct mapping, was mathematically intractable due to its non-convexity and the strict "no mass splitting" constraint. Kantorovich's profound contribution was to relax this rigid one-to-one condition to a joint distribution or "transportation plan." This seemingly minor conceptual adjustment had a transformative impact, converting a non-convex, often non-existent problem into a convex one that could be solved using linear programming. This established a critical precedent: when faced with intractable optimization problems, a carefully chosen relaxation can unlock computational tractability and broader applicability, even if it slightly abstracts the direct physical interpretation. This principle, demonstrated so powerfully by Kantorovich, has since become a cornerstone in various fields beyond Optimal Transport, showcasing the immense power of mathematical abstraction and problem reformulation in advancing computational feasibility. This foundational shift was indispensable, as it paved the way for all subsequent advancements in OT, including the development of regularized variants and their widespread adoption in computational sciences.

### Brenier's Theorem (1987)
Further theoretical advancements were made by Yann Brenier in 1987, who established profound connections between Optimal Transport (specifically for the quadratic cost function $c(x,y)= |x-y|^2$) and fields such as PDEs, fluid mechanics, geometry, probability theory, and functional analysis. Brenier's theorem states that under certain conditions (e.g., the source measure $\mu$ being absolutely continuous), the Kantorovich problem admits a **unique** optimal transport map, and this map is given by the gradient of a convex function. This result solidified the deep geometric underpinnings of OT.
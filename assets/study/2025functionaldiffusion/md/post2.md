<!--
title: Part II: Mathematical Foundations
date: 2025-09-30
tags: [functional, math]
-->

# Part II: Mathematical Foundations

[← Back to contents](index.html)

A rigorous treatment of generative models on function spaces requires a firm grasp of concepts from functional analysis, differential geometry, and stochastic calculus. This section provides a self-contained introduction to these foundational topics, with a consistent focus on their specific relevance to the formulation and implementation of infinite-dimensional generative models.

## 2. The Geometry of Function Spaces

The first step in defining a generative model is to specify the space on which the data lives. For functional data, this space is infinite-dimensional, and Hilbert spaces provide the natural geometric setting.

### 2.1 Hilbert Spaces: The Infinite-Dimensional Analogue of Euclidean Space

A Hilbert space is the direct generalization of finite-dimensional Euclidean space to an infinite number of dimensions. It provides the essential structure needed to measure distances, define angles, and ensure that analytical procedures like optimization and limit-taking are well-behaved.

**Definition 2.1. (Hilbert Space)**   
A Hilbert space $\mathcal{H}$ is a vector space equipped with an inner product $\braket{\cdot,\cdot}_\mathcal{H}$ that is also a complete metric space with respect to the norm induced by the inner product, 

$$||f||=\sqrt{\braket{f,f}_\mathcal{H}}$$

<details>
<summary>Key Properties</summary>

---
* **Inner Product**: The inner product generalizes the dot product, enabling fundamental geometric concepts. It allows for the definition of *orthogonality* ($\braket{f,g}=0$), which is the basis for decomposing functions into simpler components (e.g., via Fourier series), and *projection*, which is central to approximation theory.   
* **Completeness**: The property of completeness ensures that every Cauchy sequence of elements in the space converges to a limit that is also within the space. This is a crucial analytical property. Without it, iterative algorithms used in machine learning (such as gradient descent) would not be guaranteed to converge to a valid solution within the model space. An inner product space that is not complete is known as a pre-Hilbert space.   
---
</details>


Canonical Example: The most important example for our purposes is the space of square-integrable functions, $L^2(\Omega)$, defined on some domain $\Omega \subset \mathbb{R}^d$. This space consists of all functions $f:\Omega \to \mathbb{R}$ such that $$
\int_\Omega |f(x)|^2dx < \infty
$$
The inner product is defined as $\braket{f,g}=\int_\Omega f(x)g(x)dx$. Many generative models for functional data are formally situated in $L^2$ or its subspaces.

### 2.2 Reproducing Kernel Hilbert Spaces (RKHS): Where Evaluation is Continuous

While $L^2$ is a general-purpose function space, it has a significant drawback: the value of a function at a single point, $f(x)$, is not well-defined, as functions that differ on a set of measure zero are considered identical. Reproducing Kernel Hilbert Spaces (RKHS) are a special class of Hilbert spaces that remedy this, making them exceptionally useful for machine learning.

**Definition 2.2. (Reproducing Kernel Hilbert Space)**   
An RKHS $\mathcal{H}$ is a Hilbert space of functions where, for every point $x$ in the domain, the point evaluation functional $$\delta_x:\mathcal{H}\to\mathbb{R},$$ defined by $\delta_x(f)=f(x)$, is a continuous linear functional. 

**The Reproducing Property:** The continuity of the evaluation functional has a profound consequence. By the Riesz Representation Theorem, for every continuous linear functional, there exists a unique element in the Hilbert space that represents it via the inner product. In the case of $\delta_x$, this means there exists a unique function $k_x \in \mathcal{H}$ such that for any $f\in\mathcal{H}$:
$$f(x)=\braket{f,k_x}_\mathcal{H}$$
Here, the function $k_x$ is called the *representer of evaluation*. The **reproducing kernel** of the space is then defined as the bivariate function 
$$ K(x,y) := k_y(x) = \braket{k_y, k_x} _ \mathcal{H}$$
This property is foundational; it connects the abstract inner product of the space to the concrete operation of function evaluation. 

**Theorem 2.1. (Moore-Aronszajn Theorem)**   
For any symmetric, positive-definite kernel function $K(x,y)$, there exists a unique RKHS for which $K$ is the reproducing kernel. 

This is a powerful constructive result. It means we can define a function space with specific desired properties (e.g., smoothness) simply by choosing an appropriate kernel function. This is the theoretical underpinning of all kernel methods in machine learning, including Support Vector Machines and Gaussian Processes. 

### 2.3 Functional Representation: The Role of Basis Systems

To make computations in an infinite-dimensional space tractable, we often represent functions with respect to a basis. This transforms the problem of learning a function into the more familiar problem of learning a sequence of coefficients.

Given an orthonormal basis $\\{\phi_k \\}_{k=1}^\infty$ for a Hilbert space $\mathcal{H}$, any function $f\in \mathcal{H}$ can be uniquely represented as a linear combination of basis functions:
$$f(t)=\sum _{k=1} ^\infty c_k \phi_k(t)$$
where the coefficients are given by the projection of $f$ onto each basis element, 
$$c_k = \braket{f, \phi_k} _\mathcal{H}$$

* **Fourier Basis:** For functions defined on a periodic domain (or an interval that can be treated as such), the Fourier basis is a canonical choice. It consists of sine and cosine functions of increasing frequency:
$$
\\{ \frac{1}{\sqrt{|T|}}, \frac{\sin(r\omega t)}{\sqrt{|T|/2}}, \frac{\cos(r\omega t)}{\sqrt{|T|/2}} \\} _{r=1} ^\infty
$$
This basis is exceptionally well-suited for representing periodic or near-periodic data, such as seasonal weather patterns or audio signals. Its computational efficiency, via the Fast Fourier Transform (FFT), is a key reason for its adoption in modern architectures like the Fourier Neural Operator.

* **Other Bases:** While the Fourier basis is powerful, other bases are better suited for different types of functions. *B-splines* are widely used for representing smooth, non-periodic data, offering excellent flexibility and local control. *Wavelets* provide a basis that is localized in both time and frequency, making them ideal for representing functions with sharp, transient features or discontinuities.   

### 2.4 Operators on Manifolds: The Laplace and Laplace-Beltrami Operators

When data is defined not on a flat Euclidean domain but on a curved surface or manifold, standard tools like the Fourier basis no longer apply directly. Differential geometry provides the necessary generalization through the Laplace-Beltrami Operator (LBO).

**Definition 2.3. (Laplacian in $\mathbb{R}^d$)**  
In Euclidean space, the Laplacian of a function $u$ is defined as the sum of its second partial derivatives, or equivalently, the divergence of its gradient: 
$$
\Delta u := \nabla \cdot \nabla u  = \sum _{i=1}^d \frac{\partial^2}{\partial x_i^2} u
$$
Intuitively, it measures how much the value of a function at a point deviates from the average value in its immediate neighborhood. Its eigenfunctions on a given domain (e.g., the Fourier basis on a torus) provide a natural basis for decomposing functions into modes of different "frequencies." 

<!-- **Definition 2.4.** (Laplace-Beltrami Operator (LBO, $\Delta_M$)) The LBO is the natural generalization of the Laplacian to functions defined on a Riemannian manifold $M$ (a space that locally resembles Euclidean space and is equipped with a metric for measuring distances). It is defined in local coordinates using the metric tensor of the manifold. Formally, it is defined by -->

**Definition 2.4. (Laplace–Beltrami Operator (LBO, $\Delta_M$))**  
The Laplace–Beltrami operator is the natural generalization of the Euclidean Laplacian to functions defined on a smooth Riemannian manifold $(M, g)$. 
For a smooth function $f \in C^\infty(M)$, the Laplace–Beltrami operator is defined in local coordinates by

$$
\Delta _M f = \frac{1}{\sqrt{|g|}} \sum _{i,j=1}^n \partial_i \Big( \sqrt{|g|} \, g^{ij} \, \partial_j f \Big),
$$

where  
- $g = (g_{ij})$ is the Riemannian metric tensor,  
- $g^{ij}$ are the entries of the inverse metric $(g^{ij}) = (g_{ij})^{-1}$,  
- $|g| = \det(g_{ij})$,  
- $\partial_i = \frac{\partial}{\partial x^i}$ in local coordinates.

Equivalently, the LBO can be expressed as the **divergence of the gradient**:

$$
\Delta _M f = \operatorname{div}(\nabla f).
$$

**Definition 2.5. Weak (Variational) Formulation**   
For $u,v \in H^1(M)$ (the Sobolev space of square-integrable functions with square-integrable weak derivatives), the weak formulation of the Laplace–Beltrami operator is

$$
\int _M (\nabla u \cdot \nabla v) _g \, d\mu = - \int_M (\Delta _M u)\, v \, d\mu,
$$

where  
- $(\nabla u \cdot \nabla v)_g = g^{ij} \, \partial_i u \, \partial_j v$ is the inner product of gradients with respect to the metric,  
- $d\mu = \sqrt{|g|}\, dx^1 \cdots dx^n$ is the Riemannian volume element.  

This formulation is the foundation for finite element methods and spectral geometry.

<details>
  <summary>Key Properties</summary>

---
1. **Self-adjointness**  
   On a compact manifold $M$ without boundary (or with appropriate boundary conditions), $\Delta_M$ is a self-adjoint operator on $L^2(M)$:

$$
   \int _M f \, \Delta _M g \, d\mu = \int _M g \, \Delta _M f \, d\mu.
$$

2. **Ellipticity**  
   $\Delta_M$ is an elliptic second-order differential operator, ensuring regularity of solutions.

3. **Spectrum**  
   If $M$ is compact, the spectrum of $-\Delta_M$ is **discrete, real, and nonnegative**:
   $$
   0 = \lambda_0 < \lambda_1 \leq \lambda_2 \leq \cdots, \quad \lambda_k \to \infty.
   $$

4. **Eigenfunctions**  
   There exists an orthonormal basis $\{\phi_k\}_{k=0}^\infty$ of $L^2(M)$ consisting of eigenfunctions of $-\Delta_M$:
   $$
   -\Delta_M \phi_k = \lambda_k \phi_k, \quad k = 0,1,2,\dots
   $$
   - The first eigenfunction is constant: $\phi_0 = \frac{1}{\sqrt{\operatorname{Vol}(M)}}$.

5. **Relation to Heat Flow and Diffusion**  
   $\Delta_M$ governs heat diffusion on $M$:
   $$
   \frac{\partial u}{\partial t} = \Delta_M u,
   $$
   with solution
   $$
   u(x,t) = \sum_{k=0}^\infty e^{-\lambda_k t} \langle u_0, \phi_k \rangle \phi_k(x).
   $$

6. **Invariance under Isometries**  
   $\Delta_M$ is intrinsic: it depends only on the geometry of $M$ (the metric $g$), not on its embedding in $\mathbb{R}^n$.

**Examples**
- **Euclidean space** $(\mathbb{R}^n, g_{ij} = \delta_{ij})$:  
  $$
  \Delta_{\mathbb{R}^n} f = \sum_{i=1}^n \frac{\partial^2 f}{\partial x_i^2}.
  $$

- **Unit sphere** $S^2 \subset \mathbb{R}^3$:  
  Eigenfunctions are spherical harmonics $Y_\ell^m(\theta, \phi)$ with eigenvalues $\lambda_\ell = \ell(\ell+1)$.
---
</details>


**Significance for Generative Modeling**  
* **Isometry Invariance**: The LBO and its spectrum (its set of eigenvalues) are intrinsic to the geometry of the manifold. They remain unchanged under isometric deformations (bending without stretching or tearing). This property has led to its eigenvalues being called the "Shape-DNA" of a surface, as they provide a canonical signature that is invariant to the object's pose in space.   

* **Intrinsic Basis**: The eigenfunctions of the LBO, $\\{\phi _k\\} _{k=0} ^\infty$, which are the solutions to $\Delta _M \phi _k = -\lambda _k \phi _k$, form an orthonormal basis for the space of square-integrable functions on the manifold, $L^2(M)$. This basis is the direct analogue of the Fourier basis for curved spaces. It provides a natural, intrinsic coordinate system for points on the manifold. Formally, a point $p\in M$ can be embedded into an infinite-dimensional space via the map $$p\mapsto (\phi _1(p), \phi _2(p), \dots)$$ This is the central idea that enables the extension of generative models to arbitrary geometries, as powerfully demonstrated in [Manifold Diffusion Fields (MDF)](https://openreview.net/forum?id=BZtEthuXRF). By using this intrinsic representation, the model can learn in a way that is automatically invariant to the manifold's embedding in ambient space.


## 3. Stochastic Calculus in Infinite Dimensions

Diffusion-based generative models are fundamentally described by stochastic differential equations (SDEs). Extending these models to function spaces requires generalizing the concepts of Gaussian noise, SDEs, and the rules for transforming probability measures to the infinite-dimensional Hilbert space setting.

### 3.1 Gaussian Measures on Hilbert Spaces

The first challenge in infinite dimensions is the non-existence of a Lebesgue measure, which serves as the standard reference for defining probability densities in $\mathbb{R}^d$. This necessitates a shift to using Gaussian measures as the canonical reference.

**Definition 3.1. (Gaussian measure)**   
A probability measure $\mu$ on a separable Hilbert space $\mathcal{H}$ is called a (centered) Gaussian measure if, for every continuous linear functional $l\in\mathcal{H}^*$, the pushforward measure on $\mathbb{R}$ is a one-dimensional Gaussian distribution. Such a measure is uniquely characterized by its mean element (here, assumed to be 0) and its covariance operator $C:\mathcal{H}\to \mathcal{H}$.

* **Covariance Operator:** For a measure to be well-defined, the covariance operator $C$ must be a symmetric, positive-semidefinite, and, crucially, *trace-class* operator. The trace-class condition
$$\operatorname{Tr}(C)=\sum _k \braket{C e_k, e_k} < \infty \text{ for any orthonormal basis }\\{e_k\\}$$
is a strict requirement in infinite dimensions that ensures the total variance is finite. This makes the choice of the noise covariance a critical modeling decision, as it dictates the properties (e.g., smoothness) of the random functions being sampled.

**Definition 3.2. (Cameron-Martin Space)**   
Associated with every Gaussian measure $\mu=\mathcal{N}(0,C)$ is a special subspace called the Cameron-Martin space, $\mathcal{H}_C$. It is defined as the image of $\mathcal{H}$ under the operator $C^{1/2}$:
$$\mathcal{H}_C := \operatorname{Im}(C^{1/2}) \text{ equipped with the inner product } \braket{u, v}_C = \braket{C^{-1/2}u, C^{-1/2}v} _\mathcal{H}$$
The Cameron-Martin space is itself a Hilbert space that is densely embedded within $\mathcal{H}$, but it has a measure of zero under $\mu$. It represents the directions in which the Gaussian measure has some "regularity."

### 3.2 The Cameron-Martin-Girsanov Theorem: Changing the Measure

This set of theorems provides the mathematical machinery for understanding how a probability measure transforms when the underlying process is altered, which is the very essence of generative modeling.

**Theorem 3.1. (Cameron-Martin Theorem)**   
This theorem describes how a Gaussian measure $\mu$ changes under a simple translation. Let $\mu_h$ be the measure translated by the vector $h\in\mathcal{H}$. The theorem states that $\mu_h$ is absolutely continuous with respect to $\mu$ if and only if the translation vector $h$ lies within the Cameron-Martin space $\mathcal{H}_C$. If $h\not\in\mathcal{H}_C$, the two measures are mutually singular, meaning they live on completely disjoint sets. When $h\in\mathcal{H}_C$, the Radon-Nikodym derivative is given by:
$$
\frac{d\mu_h}{d\mu}(x) = \exp \Big( \braket{h, x} _C - \frac{1}{2} ||h|| ^2 _C \Big)
$$
This result is profound: it implies that one can only shift a Gaussian measure in the "directions" defined by its Cameron-Martin space. This places a strong constraint on the drift or score function that can be learned in a diffusion model.

**Theorem 3.2. (Girsanov Theorem)**  
This is a more general result for stochastic processes. It provides an explicit formula for the Radon-Nikodym derivative that relates the law of a stochastic process to the law of the same process with a modified drift term. This theorem is the foundation for deriving likelihood-based training objectives (like the Evidence Lower Bound, or ELBO) and for formally relating the forward (noising) and reverse (generating) processes in diffusion models, both in finite and infinite dimensions.

### 3.3 Stochastic (Partial) Differential Equations in Hilbert Spaces

The continuous-time dynamics of diffusion models are described by SDEs. In the functional setting, these become SDEs on Hilbert spaces, often interpreted as Stochastic Partial Differential Equations (SPDEs).

**SDEs in $\mathcal{H}$:** A stochastic process $X_t$ taking values in a Hilbert space $\mathcal{H}$ is described by an equation of the form:
$$
dX_t = f(t, X_t)dt + g(t, X_t)dW_t
$$
where $f$ is the drift term and $g$ is the diffusion term. The noise term $W_t$ is a **Q-Wiener process**, an infinite-dimensional generalization of Brownian motion whose covariance operator $Q$ determines the spatial correlation structure of the noise. Standard "white noise" corresponds to $Q=I$, which is not trace-class and leads to processes with very low spatial regularity. Using a trace-class $Q$ (e.g., related to the inverse of a differential operator) generates smoother noise processes.

**SPDEs:** When $\mathcal{H}$ is a function space and the drift term $f$ invovles spatial differential operators (e.g., the Laplacian $A=\Delta$), the SDE is often written as an SPDE. For example, the forward process in many funcitonal diffusion models can be viewed as a stochastic heat equation. The forward noising process is an SDE/SPDE that transforms a data function into a sample from a Gaussian Process, while the reverse generative process is the time-reversal of this SDE/SPDE, which requires learning the score operator.   

### 3.4 The Fokker-Planck Equation: Evolution of Densities

The Fokker-Planck equation governs the evolution of the probability density of a process driven by an SDE. Its infinite-dimensional analogue is key to understanding the continuous flow of probability mass in functional generative models.

* **Finite-dimensional Fokker Planck:** For a finite-dimensional SDE, the Fokker-Planck equation is a linear parabolic PDE that describes how the probability density function $\rho(t,x)$ evolves over time. It takes the form:
$$
\partial_t \rho (t,x) = - \nabla \cdot (b(t,x)\rho (t,x)) + \epsilon \Delta \rho (t,x)
$$  

* **Wasserstein Gradient Flow:** A deep result from optimal transport theory, established by Jordan, Kinderlehrer, and Otto, shows that the Fokker-Planck equation can be interpreted as the gradient flow of the Kullback-Leibler (KL) divergence functional on the space of probability measures, where the geometry is given by the Wasserstein-2 metric. This connects the probabilistic evolution of an SDE to a geometric optimization problem, a perspective that is central to the theory of flow matching and continuous normalizing flows.   

* **Infinite-Dimensional Case:** While a density with respect to a non-existent Lebesgue measure is not well-defined, one can still formulate a Fokker-Planck equation in Hilbert spaces that governs the evolution of measure-valued solutions to SPDEs. This provides the theoretical basis for the continuity equation that underpins the dynamics of probability measures in continuous-time generative models on function spaces.   


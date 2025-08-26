<!--
title: Equivariant Featurization of 3D Geometries and Equivariant Data Interactions
date: 2025-08-26
tags: []
-->

 # Equivariant Featurization of 3D Geometries

 [← Back to contents](index.html)

Particularly for many science problems of interest (molecule, protein, interactions, etc), we focus on continuous $SE(3)$ transformations in 3D structures of chemical compounds, including translations and 3D rotations, where $SE(3)$ stands for the special Euclidean group in 3D space.

When we aim to predict certain target properties from chemical compounds represented by a 3D point cloud, the target properties are usually constrained to be equivariant to $SE(3)$ transformations (i.e., rotations and translations).

Formally, let $C=[c_1,\dots, c_n] \in \mathbb{R}^{3\times n}$ be the coordinate matrix of a 3D point cloud with $n$ nodes. Let $f:\mathbb{R}^{3\times n} \to \mathbb{R}^{2l+1}$ be a function mapping coordinate matrices to $(2l+1)$-dimensional property vectors that are $SE(3)$ equivariant with order $l$. Here, order-$l$ equivariance requires $f$ to satisfy:
$$ f(RC+t\mathbf{1}^T)=D^l(R)f(C) $$
where $t\in\mathbb{R}^3$ is the translation vector, $\mathbf{1}\in\mathbb{R}^n$ is a vector whose entries are all one, $R\in \mathbb{R}^{3\times 3}$ is the rotation matrix satisfying $R^TR=I, |R|=1$, and $D^l(R)\in \mathbb{R}^{(2l+1)\times (2l+1)}$ is the Wigner-D matrix of $R$. $f$ is assumed to be
translation invariant, since most physical porperties only depend on the relative positions of its components.

* When $l=0$, $D^l(R)=[1]$, and $f$ corresponds to $SE(3)$ invariant properties such as total energy, Hamiltonian eigenvalues, and band gap.
* When $l=1$, $D^l(R)=R$ and $f$ corresponds to rotation-equivariant properties such as force fields.
* When $l>1$, $f$ corresponds to properties in space with a higher dimension beyond 3D space if $C$ is rotated, such as spherical harmonics functions with degree $l>1$ and Hamiltonian matrix blocks.

> To develop machine learning models for predicting such $SE(3)$-equivariant properties, we need methods to encode geometric information in $C$ into $SE(3)$-equivariant features.

A commonly used $SE(3)$-equivariant geometric feature encoding in physics and ML methods is the spherical harmonics function. Real spherical harmonics function $Y^l(\cdot):\mathbb{R}^3 \to \mathbb{R}^{2l+1}$ maps an input 3D vector to a $(2l+1)$ dimensional vector representing the coefficients of order-$l$ spherical harmonics bases. A nice property of the spherical harmonics function is that it is equivariant to order-$l$ rotations (i.e., order-$l$ $SO(3)$ transformations):
$$
Y^l(Rc)=D^l(R)Y^l(c)
$$
Thus, spherical harmonics function can be used to encode the relative positions of every two points in a 3D point cloud to an order-$l$ $SE(3)$-equivariant feature vector.

**Spherical Harmonics Function**: Spherical harmonics are a set of functions defined on the surface of a sphere that form an orthonormal basis, used to represent and reconstruct any function on the sphere. They are solutions to the Laplace equation and the Schrödinger equation, and are fundamental in quantum mechanics for describing angular momentum. (See the next post for more details)

# Equivariant Data Interactions

Many $SE(3)$-equivariant operations based on spherical harmonics functions have been proposed and applied to machine learning models, where spherical harmonics are used to featurize 3D geometries into higher dimensions. This enables data points to directly interact with high dimensional features that reside on the geometries. We review methods of data interactions and operations that preserve equivariance.

## Equivariant Data Interactions via Tensor Product

There are many ways to featurize local geometry. One widely used operation is message passing based on tensor product (TP) operations. For an $n$-node point cloud with coordinates $C=[c_1,\dots,c_n]$, we assume that each node $i$ is associated with an order$-l_1$ $SE(3)$-equivariant node feature $\mathbf{h}_i^{l_1}\in\mathbb{R}^{2l_1+1}$. The TP based message passing first computes a message $\mathbf{m}_i^{l_3}\in\mathbb{R}^{2l_3+1}$, then update $\mathbf{h}_i^{l_1}$ to new node feature $\mathbf{h'}_i^{l_1}$. This process can be formally described as:

$$
\mathbf{m}^{l_3}_i = \sum _{j\in N(i)} \mathbf{m}^{l_3} _{j\to i} = \sum _{j\in N(i)} \text{TP}^{l_3} _{l_1,l_2} (c_i-c_j, \mathbf{h}^{l_1}_j) 
$$
$$
\mathbf{h'}_i^{l_1} = U(\mathbf{h}^{l_1} _i, \mathbf{m}^{l_3} _i)
$$
Here, $\text{TP}^{l_3} _{l_1,l_2} (\cdot, \cdot)$ is the TP operation, $N(i)$ is the neighboring node set of the node $i$, and $U(\cdot, \cdot)$ is the node feature updating function.
* $N(i)$ is commonly defined as $N(i)=\{j: \|c_i - c_j\|_2 \leq r\}$, the set of nodes whose distances to $i$ are smaller than a radius cutoff $r$.
* The TP operation uses order-$l_2$ spherical harmonics function as the kernel to compute the message $\mathbf{m}^{l_3} _{j\to i}$ propagated from every node $j\in N(i)$ to $i$. The operation can be described as:
$$
\text{TP}^{l_3} _{l_1,l_2}(c_i-c_j, \mathbf{h}^{l_1}_j) = \mathscr{C}^{l_3} _{l_1,l_2} \text{vec}\left(\text{MLP}\left(\|c_i-c_j\|_2\right) \cdot Y^{l_2}\left(\frac{c_i-c_j}{\|c_i-c_j\|_2}\right) \otimes \mathbf{h}^{l_1}_j \right)
$$
$\text{MLP}$ is a multi-layer perceptron model that takes distance as input, $\otimes$ is the vector outer product operation, $\text{vec}(\cdot)$ flattens a matrix to a vector, and $\mathscr{C}^{l_3} _{l_1,l_2}$ is the Clebsch-Gordan (CG) matrix with $2l_3+1$ rows and $(2l_1+1)(2l_2+1)$ columns. We skip the derivations for now, but the CG matrix is widely used in physics to ensure that for $|l_1-l_2|\leq l_3 \leq l_1+l_2$, the $\text{TP}^{l_3} _{l_1,l_2} (\cdot, \cdot)$ is always $SE(3)-$equivariant as:
$$
\text{TP}^{l_3} _{l_1,l_2}(R(c_i-c_j), D^{l_1}(R)\mathbf{h}^{l_1}_j) = D^{l_3}(R)\text{TP}^{l_3} _{l_1,l_2}(c_i-c_j, \mathbf{h}^{l_1}_j)
$$
Hence the message $\mathbf{m}^{l_3}_i$ is naturally $SE(3)$-equivariant [Brandstetter et al. 2022a]. 
* For the node feature update function $U$, a linear operation or another TP operation can be used otm aintain $SE(3)$ equivariance of the new node feature $\mathbf{h'}_i^{l_1}$. 


Since all TP-based message passing calculations are $SE(3)$-equivariant, we can develop a $SE(3)$-equivariant model by stacking multiple message passing layers. [Weiler et al. 2018] proved that spherical harmonics based tensor product operations are sufficient and necessary for $SE(3)$-equivariance.

<!-- ## Approximately Equivariant Data Interactions via Spherical Channel Networks -->
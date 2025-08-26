<!--
title: Data Augmentation vs Symmetry-Adapted Architecture
date: 2025-08-26
tags: []
-->

# Data Augmentation vs Symmetry-Adapted Architecture

[← Back to contents](index.html)

 If certain symmetries are present in the system, the predicted targets are naturally invariant
 or equivariant to the corresponding symmetry transformations. For instance, when predicting
 energies of 3D molecular structures, the predicted target remains unchanged even if the input 3D
 molecule is translated or rotated in 3D space. One possible strategy to achieve symmetry-aware
 learning is adopting data augmentation when training supervised learning models. Specifically,
 random symmetry transformations are applied to input data samples and labels to force the model
 to output approximately equivariant predictions.

 However, there are several drawbacks with data augmentation. 
 1. First, to account for the additional degree of freedom from choosing a reference
 frame, more model capacity would be needed to represent patterns that would be relatively simple in
 a fixed reference frame. 
 2. Second, many symmetry transformations, such as translation, can produce
 an infinite number of equivalent data samples, making it difficult for finite data augmentation
 operations to completely reflect the symmetries in data. 
 3. Third, in some scenarios, we need to build a very deep model by stacking multiple layers to achieve good prediction performance. However, it  would pose much more challenges to force the deep model to output approximately equivariant
 predictions by data augmentation if the model does not maintain equivariance at every layer. 
 4. Fourth, in some scientific problems such as molecular modeling, it is important to provide provably 
 robust predictions under these transformations so that users can employ machine learning
 models in a reliable way.

 With symmetry-adapted architecture, no data augmentation is required
 for symmetry-aware learning, and models can focus solely on learning the target prediction task.
 Recently, such symmetry-adapted models have shown significant success in scientific problems
 for a variety of different systems, including molecules, proteins, and crystalline materials. 

 <!-- # Equivariance to Discrete Symmetry Transformations
 Consider the case where the inputs are 2D scalar fields and the symmetry transformations consist of rotating by the angels of $90^\circ, 180^\circ, 270^\circ$. An example of such problem is simulating the dynamics of the fluid field in a 2D square plane where we learn a mapping between the fluid field at the current time step to the next time step.

 Let $X\in\mathbb{R}^{s\times s}$ -->



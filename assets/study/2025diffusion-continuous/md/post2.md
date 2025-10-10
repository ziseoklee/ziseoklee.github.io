<!--
title: Part II: Diffusion Model
date: 2025-06-10
tags: [diffusion, flow, interpolant]
-->

# Part II: Diffusion Model

[← Back to contents](index.html)

* Score Matching in Diffusion Models, Score Function and Score Matching, Tweedie’s Formula and proof, Anderson's theorem
* DDPMs and Score-Based Diffusion Models, Forward Diffusion Process(O-U process, VP/VE process), Reverse Process, Variational Objective (ELBO), Score-Based SDE Perspective, Implementation details (discretization of time, non-Markovian process in DDIM, predictor-corrector SDE solvers, ODE solvers)
* non-Gaussian noise (e.g., Cauchy, Poisson)
* DDPM vs DDIM, Practical Considerations (Efficiency, Coverage, liklihood control)
* Sampling in Diffusion Models: SDEs vs. ODEs, The Forward and Reverse SDE, The Fokker–Planck Equation, The Probability Flow ODE
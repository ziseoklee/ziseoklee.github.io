<!--
title: Part VI: Distillation and Acceleration
date: 2025-07-08
tags: [diffusion, flow, interpolant]
-->

# Part VI: Distillation and Acceleration

* Consistency Models, Distillation, Distribution matching distillation, score distillation, shortcut models, Inductive Moment Matching, flow map matching models, Algin your flow, MeanFlow models
* Fast SDE/ODE solvers: predictor-corrector SDE solvers (e.g., SA-Solver), ODE solvers (DPM-Solver, DPM-Solver++)
* Stochastic consistency distillation (SCott), Blessing of Randomness (SDE -> ODE -> Consistency model has efficiency gains, but there is a trade-off. Stochasticity gives better modeling power (as highlighted in Stochastic Interpolants paper))
* Below is just a simple outline (not rigorous)

<h2>Introduction</h2>
<p>
    Recent advances in generative modeling have explored alternative paths to diffusion and score-based models that rely on solving differential equations. In this post, we discuss a suite of ideas that center around modeling consistency across time, matching flows directly, and interpolating data distributions — namely <b>Consistency Models</b>, <b>Flow Matching</b>, <b>Shortcut Models</b>, and <b>Stochastic Interpolants</b>. These techniques share the common theme of avoiding slow sampling while preserving sample quality.
</p>

<hr />

<h2>1. Consistency Models</h2>
<p>
    Consistency Models (CMs) aim to learn a function \( f(x_t, t) \) that is <em>consistent</em> across time steps, allowing single-step or few-step generation of high-quality samples.
</p>
<p>
    Instead of predicting a score or a velocity like in DDPM or DDIM, CMs train a function such that:
    \[
    f(x_t, t) \approx f(x_s, s) \quad \text{for all } s < t
    \]
    where \( x_t \) and \( x_s \) are noisy versions of the same clean input \( x_0 \) at times \( t \) and \( s \) respectively.
</p>
<p>
    The training objective is:
    \[
    \mathcal{L}_{\text{consistency}} = \mathbb{E}_{x_0, t, s} \left[ \| f(x_t, t) - f(x_s, s) \|^2 \right]
    \]
    This effectively enforces that the denoising function gives the same output regardless of the noise level, enabling faster sampling compared to standard diffusion models.
</p>

<hr />

<h2>2. Flow Matching</h2>
<p>
    Flow Matching (FM) aims to directly learn a vector field \( v(x, t) \) that transports a base distribution (e.g., Gaussian) to a data distribution along a continuous flow.
</p>
<p>
    The key idea is to match the vector field of a known flow:
    \[
    \mathcal{L}_{\text{flow}} = \mathbb{E}_{x, t} \left[ \| \hat{v}(x, t) - v^*(x, t) \|^2 \right]
    \]
    where \( v^*(x, t) \) is an analytically known or sampleable vector field from a chosen stochastic interpolant (e.g., linear or Gaussian mixture paths).
</p>
<p>
    Flow Matching is related to Score Matching and Schrödinger bridges, but often bypasses the need to compute score functions by directly using transport velocities.
</p>

<hr />

<h2>3. Shortcut Models</h2>
<p>
    Shortcut Models take inspiration from Consistency Models but extend them by modeling the consistency between arbitrary pairs of time steps, not just adjacent ones.
</p>
<p>
    Instead of relying on continuous consistency, the shortcut model is trained to denoise:
    \[
    f(x_t, t) \approx x_0 \quad \text{and} \quad f(x_s, s) \approx x_0
    \]
    and enforce:
    \[
    f(x_t, t) \approx f(x_s, s)
    \]
    for randomly sampled \( s, t \in [0, 1] \). This makes them amenable to single-shot sampling at arbitrary time steps, and composable with standard diffusion trajectories.
</p>

<hr />

<h2>4. Stochastic Interpolants</h2>
<p>
    A stochastic interpolant is a process that smoothly connects two distributions \( p_0(x) \) and \( p_1(x) \) by a stochastic trajectory \( x(t) \), such that:
    \[
    x(0) \sim p_0(x), \quad x(1) \sim p_1(x)
    \]
</p>
<p>
    One common interpolant is the Gaussian path:
    \[
    x(t) = (1 - t) x_0 + t x_1 + \sqrt{t(1 - t)} \cdot \epsilon
    \]
    with \( x_0 \sim p_0 \), \( x_1 \sim p_1 \), and \( \epsilon \sim \mathcal{N}(0, I) \).
</p>
<p>
    These interpolants give rise to known velocity fields that can be used for training flow matching or shortcut models.
</p>
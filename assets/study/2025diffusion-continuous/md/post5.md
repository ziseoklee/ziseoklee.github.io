<!--
title: Part V: Conditional Generation and its Practical Applications
date: 2025-07-01
tags: [diffusion, flow, interpolant]
-->

# Part V: Conditional Generation and its Practical Applications

[← Back to contents](index.html)

* Conditional Generation (CFG, CFG++, etc - CFG variants = heuristics) + (Feynman-Kac correctors, Feynman-Kac Flows (theoretically grounded methods) - spend more text and equations explaining this part)
* Text-to-Image, Text-to-Video, Text-to-3D, Text-to-Audio and more
* Diffusion forcing, sequence generation, Monte Carlo Tree Diffusion, MCTD2
* Molecule Generation (Structure based drug design, fragment-based drug design etc), Protein structure generation (AlphaFold3), DNA/RNA, PDE, weather forecasting, AI4Science
* Diffusion Policy and Reinforcement learning

* below is just an example (not rigorous)

<h2>1. Numerical Solvers for SDEs and ODEs</h2>

<p>
    Sampling from diffusion models amounts to integrating either:
</p>

<ul>
    <li><strong>Stochastic differential equations (SDEs)</strong> — DDPM-style sampling</li>
    <li><strong>Deterministic ODEs</strong> (probability flow ODEs) — DDIM-style sampling</li>
</ul>

<p>
    These can be integrated using numerical methods:
</p>

<ul>
    <li><strong>Euler–Maruyama</strong> (for SDEs): explicit, fast but low accuracy.</li>
    <li><strong>Heun’s method</strong> (2nd-order Runge–Kutta): corrects Euler with a predictor–corrector step.</li>
    <li><strong>DPM-Solver</strong>: an efficient high-order sampler designed for score-based diffusion ODEs.
    See the paper <a href="https://arxiv.org/abs/2206.00927">DPM-Solver</a> for the full derivation.
    </li>
</ul>

<p>
    The key benefit of advanced solvers like DPM-Solver is <strong>few-step sampling</strong> with high fidelity,
    thanks to treating the score model as a time-dependent vector field and integrating it as an ODE.
</p>

<h2>2. Classifier-Free Guidance (CFG)</h2>

<p>
    In conditional generation, we want to sample from \( p(\mathbf{x} \mid \mathbf{y}) \). One option is <strong>classifier guidance</strong> (Dhariwal & Nichol, 2021), using a pretrained classifier \( \nabla_{\mathbf{x}} \log p(\mathbf{y} \mid \mathbf{x}) \). But CFG takes a simpler approach:
</p>

<ul>
    <li>Train a single conditional score model \( s_\theta(\mathbf{x}, t, \mathbf{y}) \),</li>
    <li>Use null-conditioning \( \varnothing \) during training with some probability (e.g., 10–20%)</li>
    <li>At inference, guide with:
    \[
    \tilde{s}_\theta(\mathbf{x}, t, \mathbf{y}) = (1 + w) s_\theta(\mathbf{x}, t, \mathbf{y}) - w s_\theta(\mathbf{x}, t, \varnothing)
    \]
    where \( w > 0 \) is the guidance scale.
    </li>
</ul>

<h3>Interpretation 1: Directional Control</h3>

<p>
    This linear interpolation increases the gradient magnitude in the direction of the conditional score,
    amplifying the drift toward high-likelihood samples under \( p(\mathbf{x} \mid \mathbf{y}) \).
</p>

<h3>Interpretation 2: Annealed Denoising</h3>

<p>
    As noted in GLIDE and subsequent works, CFG acts as an annealing mechanism: 
    the model gradually shifts from unconditional to conditional generation.
</p>

<h3>Interpretation 3: A Model vs. Its Noisy Self</h3>

<p>
    CFG can also be seen as the model comparing itself to a "bad version" — the unconditional variant —
    and refining its outputs based on that discrepancy.
</p>

<p>
    CFG is especially powerful in <strong>text-to-image models</strong> like Stable Diffusion, where 
    nuanced conditioning (e.g., CLIP embeddings) allows for fine-grained generation control.
</p>

<h2>3. Latent Diffusion Models (LDM)</h2>

<p>
    Training a diffusion model in pixel space is costly. <strong>Latent Diffusion Models</strong> (Rombach et al., 2022) propose:
</p>

<ul>
    <li>Train an autoencoder \( E(\mathbf{x}) = \mathbf{z} \), \( D(\mathbf{z}) = \hat{\mathbf{x}} \)</li>
    <li>Train a diffusion model in the latent space \( \mathbf{z} \in \mathbb{R}^d \) with \( d \ll HW \)</li>
    <li>Sample in latent space and decode to image</li>
</ul>

<p>
    Formally, diffusion is applied to \( \mathbf{z}_0 \sim E(p_{\text{data}}) \), and the generative model is:
</p>

\[
p(\mathbf{x}) = \int p(\mathbf{x} \mid \mathbf{z}_0) p(\mathbf{z}_0) \, d\mathbf{z}_0
\]

<p>
    The benefit is computational: both training and sampling are dramatically cheaper in the latent space,
    and high-frequency details are preserved via decoder upsampling.
</p>

<p>
    Note that conditioning (e.g., text prompts) is often passed through CLIP or T5 embeddings,
    and cross-attended during sampling steps.
</p>
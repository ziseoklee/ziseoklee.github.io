<!--
title: Part III: Algorithms for Generative Modeling on Function Spaces
date: 2025-10-10
tags: [functional, math]
-->

# Part III: Algorithms for Generative Modeling on Function Spaces

[← Back to contents](index.html)

Armed with the mathematical foundations, we now turn to the algorithms that realize generative modeling in function spaces. This section details the architectures that make computation feasible and surveys the major frameworks—diffusion, flow matching, and stochastic interpolants—that have been successfully extended to the infinite-dimensional setting. The field is characterized by a fascinating interplay between mathematical rigor and pragmatic architectural choices, a dynamic we will explore through key seminal works.

To provide a clear overview of the landscape, the following table compares the main characteristics of the prominent models discussed in this study.

| **Model** | **Generative Paradigm** | **Function Representation** | **Architectural Backbone** | **Key Theoretical Tool** |
|--|--|--|--|--|
| [DDO (Denoising Diffusion Operators)](https://arxiv.org/abs/2302.07400) | Score-based Diffusion | Implicit (via basis coefficients) | Fourier Neural Operator (FNO) | Gaussian Measures & Score Operator in Hilbert Space |
| [DPF (Diffusion Probabilistic Fields)](https://arxiv.org/abs/2303.00165) | Score-based Diffusion | Explicit (Coordinate-Value Pairs) | PerceiverIO | Field Representation & Attention Mechanisms |
| [MDF (Manifold Diffusion Fields)](https://arxiv.org/abs/2305.15586) | Score-based Diffusion | Explicit (Intrinsic Corrdinate-Value Pairs) | PerceiverIO | Laplace-Beltrami Operator Eigenfunctions |
| [FunDiff (Functional Diffusion)](https://arxiv.org/abs/2506.07902) | Latent Diffusion | Latent Vector (via Function Autoencoder) | ViT, Perceiver, MLP | Physics-Informed Learning, Latent Space Diffusion |
| [FFM (Funcitonal Flow Matching)](https://arxiv.org/abs/2305.17209) | Flow Matching (ODE-based) | Implicit (via basis coefficients) | Neural Operator (e.g., FNO) | Optimal Transport & Vector Field on Function Space |
| [Operator-based Stochastic Interpolants](https://arxiv.org/abs/2508.04605) | Stochastic Interpolant | Implicit (Function-valued output) | Neural Operator | Operator-valued Interplation Paths |
| [GANO (Generative Adversarial NO)](https://openreview.net/forum?id=X1VzbBU6xZ) | Adversarial | Implicit (Function-valued output) | U-Net FNO (U-NO) | Adversarial Training between Neural Operators |

## 4. Neural Operators: The Architectural Backbone
The theoretical constructs of infinite-dimensional generative models, such as score operators or vector fields on function spaces, would remain abstract without a practical way to parameterize and learn them. Neural Operators (NOs) provide this crucial bridge, serving as the architectural workhorse for the field.

### 4.1 From Neural Networks to Neural Operators

A standard neural network learns a mapping between finite-dimensional vector spaces
$$
f_\theta: \mathbb{R}^{d_\text{in}} \to \mathbb{R}^{d_\text{out}}
$$
The architecture (e.g., number of neurons, matrix weights) is tied to the specific dimensions $d_\text{in}$, $d_\text{out}$. In constrast, a *Neural Operator (NO)* learns a mapping between infinite-dimensional function spaces 
$$
\mathcal{G}_\theta:\mathcal{A}\to \mathcal{U}
$$
where $\mathcal{A}$ and $\mathcal{U}$ are spaces of functions. The key property of a NO is that its parameters $\theta$ are independent of how the input function $a\in\mathcal{A}$ or output function $u\in\mathcal{U}$ are discretized. This property is what endows the resulting models with resolution invariance. Check this [PDF](https://www.robertj1.com/assets/pdf/Neural_Operators_jpl.pdf) for more details.

### 4.2 The Fourier Neural Operator (FNO) Architecture

The [Fourier Neural Operator (FNO)](https://www.semanticscholar.org/paper/010dbeb1bb09073fff8aafa3a0b7b78921e6b83a) is a particularly effective and widely used architecture for learning operators, especially for problems governed by PDEs. Its efficacy stems from its ability to learn a global convolution operator efficiently in the frequency domain.

* **Core Idea**: An integral operator can be expressed as a convolution, and by the convolution theorem, this operation becomes a simple element-wise product in the Fourier domain. The FNO learns the kernel of this convolution directly in Fourier space.

* **Mechanism**: A typical FNO architecture consists of several layers, each performing the following steps : 

    1. *Fourier Transform*: The input function (lifted to a high-dimensional channel space) is transformed into the frequency domain using the Fast Fourier Transform (FFT).

    2. *Linear Transform in Frequency Domain*: A learnable linear transformation $R_\theta$ is applied to the Fourier coefficients. Crucially, this transformation is applied only to a limited number of low-frequency modes, with higher frequencies being truncated. This acts as a form of regularization and is motivated by the fact that many physical systems are dominated by low-frequency dynamics.

    3. *Inverse Fourier Transform*: The result is transformed back to the spatial domain using the inverse FFT.

    4. *Pointwise Update*: The output of the global convolution is combined with a local, pointwise linear transformation (acting as a residual connection) and passed through a non-linear activation function (e.g., GELU).

* **Properties**: This architecture is highly efficient (due to the $O(n\log n)$ complexity of the FFT), possesses a global receptive field in every layer (allowing it to capture long-range dependencies), and is inherently [resolution-invariant](https://www.researchgate.net/publication/370670762_Resolution-Invariant_Image_Classification_Based_on_Fourier_Neural_Operators) because the learned weights $R_\theta$ operate on Fourier modes, which have a grid-independent interpretation.

### 4.3 The Role of Neural Operators in Functional Generative Models

Neural operators are the key enabler that allows us to parameterize and learn the infinite-dimensional objects central to functional generative models. They serve as powerful function approximators for:

* The score operator $S_\theta(u_t,t)$ in score-based diffusion models like [DDO](https://jmlr.org/papers/volume26/23-1472/23-1472.pdf)s, which maps a noisy function $u_t$ to the direction of steepest ascent in log-probability.
* The time-dependent vector field $v_\theta(f,t)$ in flow matching models like [FFM](https://proceedings.mlr.press/v238/kerrigan24a/kerrigan24a.pdf), which defines the ODE that transports noise functions to data functions.
* The generator operator operator $G_\theta(a)$ in adversarial models like [GANO](https://openreview.net/forum?id=X1VzbBU6xZ), which maps a random input function $a$ from a simple prior distribution to a complex data function.
* The discriminator functional $D_\theta(u)$ in [GANO](https://openreview.net/forum?id=X1VzbBU6xZ) which maps an input function to a scalar real/fake prediction.


## 5. Diffusion and Score-Matching in Hilbert Spaces

Diffusion models have become the state-of-the-art in many finite-dimensional generative tasks. Their extension to function spaces has been a major focus of recent research, leading to several distinct but related frameworks.

### 5.1 Theoretical Framework: From Forward SDEs to Reverse-Time SPDEs
The core idea of continuous-time diffusion models translates to the infinite-dimensional setting, though the mathematical objects become more complex.

* **Forward Process**: A data function $u_0$ from the target distribution is gradually perturbed into noise. This is described by a forward SDE or SPDE in a Hilbert space $\mathcal{H}$:
$$
du_t = B(u_t,t)dt + G(t)dW_t
$$
Here, $W_t$ is a $Q-$Wiener process whose covariance $Q$ dictates the spatial properties of the added noise. The process is designed such that the distribution of $u_T$ at a terminal time $T$ approaches a simple, tractable prior, typically a Gaussian Process measure.

* **Reverse Process**: Anderson's theorem on the time-reversal of diffusion processes can be extended to infinite dimensions. The generative process is governed by a reverse-time SDE/SPDE:
$$
d\hat{u} _t=[-B(\hat{u} _t,T-t)+S _{T-t}(\hat{u} _t)]dt + G(T-t)dW _t
$$
where $(u_t,\hat{u} _t)$ is a pair of forward and reverse stochastic processes with evolution operators $(B(\cdot, t), G(t))$, $W_t$ is a Wiener process and $S_t(u_t)$ is the score operator of the marginal distribution $p_t$ of the forward process at time $t$. The entire learning problem reduces to estimating this score operator. Check [HDM](https://proceedings.neurips.cc/paper_files/paper/2023/file/76c6f9f2475b275b92d03a83ea270af4-Paper-Conference.pdf) for more details.

### 5.2 Seminal Work 1: Denoising Diffusion Operators (DDOs)
The DDO framework provides one of the first mathematically rigorous formulations of score-based diffusion models in infinite-dimensional Hilbert spaces.

* Contribution: DDOs formalize the forward process, the score operator, and the training objective directly in a Hilbert space setting, providing a solid theoretical foundation.

* Forward Process: The framework perturbs an input function $u_0$ using a Gaussian process. A common choice is an Ornstein-Uhlenbeck process, which adds spatially correlated noise. The covariance of the noise is a critical design choice; it can be white noise ($Q=I$, leading to rough functions) or a trace-class operator (e.g., derived from a Matérn kernel, leading to smoother functions)

* Denoising Score Matching Objective: The key theoretical contribution is the generalization of denoising score matching to Hilbert spaces. The objective is to train a neural operator $S_\theta$ to approximate the true score operator. As in the finite-dimensional case, the objective involving the score can be simplified via integration by parts to a denoising objective. The model is trained to predict the original clean function $u_0$ from its noisy version $u_t$. The loss is the expected squared norm of the error in the Hilbert space:
$$
\mathcal{L}(\theta) = \mathbb{E} _{t, u _0, u _t} || S _\theta (u _t, t) - u _0 || _{\mathcal{H}} ^2
$$

* Architecture: The score operator $S_\theta$ is parameterized using a neural operator, typically a U-Net architecture with FNO blocks (termed `fnounet2d` in implementations), to effectively capture features at multiple scales.

* Sampling: Generation is performed by numerically integrating the reverse-time SDE, a procedure known as annealed Langevin dynamics in function space.

### 5.3 Seminal Work 2: Diffusion Probabilistic Fields (DPF)

While DDOs provide theoretical rigor, [DPF](https://openreview.net/forum?id=ik91mY-2GN)s offer a more pragmatic and flexible approach that has proven highly effective across diverse data modalities. The success of DPF illustrates a powerful principle: with a sufficiently expressive and well-designed architecture, one can often achieve the desired functional behavior without explicitly implementing all the formal mathematical machinery of Hilbert spaces. 

* **Contribution**: DPFs propose a domain-agnostic framework by representing data as "fields"—continuous functions parameterized by sets of coordinate-value pairs. This avoids the need for specialized, domain-specific score network architectures.

* **Representation**: A data instance (e.g., an image) is not treated as a single element in a function space, but as a function 
$$
f:M\to Y
$$
that can be queried. This function is implicitly defined by a set of context pairs $\\{ (x_i, y_i) \\}$, where $x_i \in M$ are coordinates and $y_i = f(x_i)$ are the corresponding signal values. The diffusion process is then applied directly to the finite set of signal values $\\{ y_i \\}$.

* **Training and Architecture**: The score network $\epsilon_\theta$ is designed to be a set-to-set function. It takes as input a set of noisy context pairs $\\{ (x_i, (y_t)_i) \\}$ and the diffusion timestep $t$, and predicts the noise that was added to the signal values at a set of query coordinates $\\{ (x_j) \\}$. This architecture is implemented using *PerceiverIO*. PerceiverIO uses a cross-attention mechanism to map a variable-sized input set (the context pairs) to a fixed-size latent array, processes this array with a deep Transformer (self-attention), and then uses another cross-attention mechanism to produce outputs at the desired query locations. This makes it naturally suited for handling irregularly sampled data and varying input sizes.   

* **Advantages**: The primary advantage of DPF is its generality. The exact same PerceiverIO-based score network can be used to model distributions of 2D images (where $M=\mathbb{R}^2$), 3D volumetric data ($M=\mathbb{R}^3$), and signals on a sphere ($M=\mathcal{S}^2$), simply by changing the dimensionality of the input coordinates. This sidesteps the complexities of defining measures and operators on different spaces, delegating the task of learning the underlying structure to the powerful attention-based architecture. 

### 5.4 Other Notable Diffusion-based Approaches

* [**Functional Diffusion**](https://openaccess.thecvf.com/content/CVPR2024/papers/Zhang_Functional_Diffusion_CVPR_2024_paper.pdf): This framework proposes a hybrid representation for functions, using both a continuous representation (a set of latent vectors) and a sampled representation (coordinate-value pairs). The denoising network is a Transformer-based architecture that takes the sampled representation as input and outputs an updated continuous representation, which can then be queried at any point.

* [**FunDiff**](https://arxiv.org/abs/2506.07902): This model takes a two-stage approach that is particularly well-suited for physics-informed applications. First, a Function Autoencoder (FAE) is trained to compress functions into a low-dimensional, fixed-size latent vector. This FAE consists of a resolution-agnostic encoder (e.g., using a Vision Transformer and Perceiver) and a continuous decoder (e.g., an MLP or SIREN). 1  Second, a standard, finite-dimensional diffusion model is trained on this latent space. This decouples the complexity of function representation from the generative process and provides a natural point to inject physical constraints, either as a loss term during FAE training or by architectural design of the decoder.


## 6. Flow Matching and Stochastic Interpolants as a Unifying Framework

While diffusion models are based on reversing a stochastic process, an alternative and increasingly popular approach is to learn a deterministic transformation (a flow) that pushes a simple prior distribution to the data distribution. Flow matching and its generalization, stochastic interpolants, offer a more efficient, simulation-free way to train such models.

### 6.1 Functional Flow Matching (FFM)

[FFM](https://proceedings.mlr.press/v238/kerrigan24a/kerrigan24a.pdf) extends the flow matching paradigm of Lipman et al. to the infinite-dimensional setting, providing a method for training continuous normalizing flows (CNFs) directly on function spaces.

* **Concept**: Instead of simulating an SDE, FFM learns the vector field of an ordinary differential equation (ODE) in function space,  
$$
\frac{df_t}{dt} = v_t(f_t)
$$
that transports samples from a prior measure $\mu_0$ (e.g., a Gaussian Process) to the data distribution $\mu_1$.

* **Mechanism**: The key idea is to define a target vector field and train a neural operator to regress it directly, without solving the ODE during training.

    1. A path of probability measures $\mu_t$ is defined, typically by linearly interpolating between a sample from the prior $f_0\sim \mu_0$ and a sample from the data $f_1 \sim \mu_1$:
    $$
    f_t = (1-t)f_0 + tf_1
    $$
    The target velocity is simply $f_1 - f_0$.
    2. A neural operator $v_\theta(f,t)$ is trained to predict this target velocity given an interpolated function $f_t$. The flow matching loss is a simple mean squared error objective :
    $$ \mathcal{L} _\text{FM} (\theta) = \mathbb{E} _{t, f_0, f_1} || v _\theta((1-t)f_0 + t f_1, t) - (f_1 - f_0) || _{\mathcal{H}} ^2 $$   

* **Advantages**: This training is "simulation-free"—it only requires sampling pairs ($f_0,f_1$) and a time $t$ to compute the loss. This avoids the need to solve an SDE or ODE during training, leading to faster, more stable, and more scalable training compared to earlier methods for CNFs.   


### 6.2 [Operator-Based Stochastic Interpolants](https://arxiv.org/pdf/2508.04605): A General Framework for Diffusion and Flows
The framework of stochastic interpolants, introduced by Albergo et al., provides a powerful unification of diffusion models and normalizing flows.   

* **Stochastic Interpolants in Finite Dimensions**: The framework defines a general interpolant process 
$$ I_t = \alpha_t x_0 + \beta_t x_1 $$
where $x_0 \sim p_0$ (a prior distribution), $x_1 \sim p_1$ (the data distribution), and $(\alpha_t, \beta_t)$ are scalar functions of time defining the interpolation path. The generative model learns the velocity filed of the probability flow associated with the densities of $I_t$. Both diffusion models (which correspond to a specific choice of stochastic path) and flow matching (a deterministic path) can be seen as special cases of this framework. This naturally extends to Hilbert spaces where $x_0$ and $x_1$ are functions.

A recent, groundbreaking extension of this framework replaces the scalar time variable with linear operators, opening the door to highly versatile, multitask generative models. This development points towards a future of universal generative models, trained once to perform a multitude of tasks.   

* **Core Idea**: The interpolant is generalized to 
$$ I(\alpha, \beta) = \alpha x_0 + \beta x_1 $$
where $\alpha$ and $\beta$ are no longer scalars but are bounded linear operators on the Hilbert space $\mathcal{H}$. The model learns a velocity field that is conditioned on these operators.

* **Multitask Learning**: A single model, trained on this operator-conditioned objective, can perform a wide variety of generative tasks in a zero-shot manner at inference time, simply by selecting an appropriate path through the space of operators.

    1. *Unconditional Generation*: A path from $(α=I,β=0)$ to $(α=0,β=I)$ transports noise to data.

    2. *Inpainting/Conditional Generation*: Let $M$ be a projection operator onto a known (unmasked) region. A path can be constructed that only modifies the unknown parts of the image, corresponding to operators that act as the identity on the range of $M$.

    3. *Super-resolution*: Operator paths can be designed in the Fourier domain, where operators correspond to selecting different frequency bands, allowing the model to generate high-frequency details conditioned on low-frequency inputs.

* **Implications**: This framework represents a significant conceptual leap. Instead of training separate models for separate tasks, one can train a single, more general model that learns a rich "operator space" of transformations. The cost of training this more complex model is amortized over a wide range of downstream applications, potentially revolutionizing how generative models are built and deployed for scientific problems.   
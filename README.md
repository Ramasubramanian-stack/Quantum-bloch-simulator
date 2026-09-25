# ⚛️ Quantum Bloch Sphere Simulator

[![Deploy Quantum Bloch Simulator to GitHub Pages](https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

> **Live Interactive Web App**: **[https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/](https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/)**  
> *(Hosted directly on GitHub Pages — open in any modern browser to rotate the sphere and apply quantum gates live!)*

---

## 🌟 Why We Built This: A Bridge for Quantum Beginners

Quantum mechanics and quantum computing are notoriously counter-intuitive for newcomers. Beginners usually encounter two disconnected worlds:

1. **Abstract linear algebra**: 2 × 2 unitary matrices, state vectors in complex Hilbert space C², and symbols such as   `|ψ⟩ = α|0⟩ + β|1⟩` that feel foreign and abstract.
2. **Abstract analogies**: Popular explanations like “a qubit is both 0 and 1 at the same time” often hide the actual mathematical rules and make quantum computing seem mystical.

### Why This Tool Is Built Specifically for Beginners

- **Visual + Algebraic Connection**: The Bloch sphere is the standard geometric representation of a 2-level quantum system. This simulator links every geometric rotation of the state vector directly to the underlying matrix calculation.
- **No Hidden Steps**: Unlike simulators that jump from input to output with a black-box result, this app explicitly logs the gate matrix multiplied by the input state vector to produce the output state vector.
- **History Trail That Never Overwrites**: When learning, you need to see how you arrived at each state. The Math Breakdown panel stacks each operation vertically so you can trace your entire gate sequence.
- **Exact Textbook Math, Never Rounded**: Rotation matrices such as Rₓ(±π/2), Rᵧ(±π/2), and R𝓏(±π/2) are computed and displayed using exact radicals such as 1/√2 and exact complex phases.
- **Global Phase Transparency**: Beginners often get confused why R𝓏(π/2) and the S gate produce identical state arrows on the Bloch sphere despite having different diagonal elements. The app makes this distinction explicit.

---

## 🧭 Core Quantum Concepts Explained

### 1. The Single Qubit State Vector

In classical computing, a bit is strictly 0 or 1. A single qubit exists as a pure quantum state in a 2D complex Hilbert space:

**|ψ⟩ = α|0⟩ + β|1⟩ = [ α, β ]ᵀ**

Here, α and β are complex numbers, and **|α|² + |β|² = 1**. This is the normalization rule: the total probability must equal 1.

### 2. The Bloch Sphere Representation

Because an overall global phase eⁱᵞ has no physically measurable consequence, states that differ only by this phase represent the same physical state:

**|ψ⟩ ≈ eⁱᵞ|ψ⟩**

Any pure single-qubit state can therefore be written using two real angles, θ and φ:

**|ψ(θ, φ)⟩ = cos(θ/2)|0⟩ + eⁱᵠ sin(θ/2)|1⟩**

This maps directly to a point (x, y, z) on the unit 3D sphere:

- **x = sin(θ) cos(φ)**
- **y = sin(θ) sin(φ)**
- **z = cos(θ)**

### 3. The 6 Cardinal States

```math
\(\begin{aligned} \vert{}0\rangle &= \begin{bmatrix} 1 \\ 0 \end{bmatrix} && \text{North pole (+Z). The default ground state.} \\ \vert{}1\rangle &= \begin{bmatrix} 0 \\ 1 \end{bmatrix} && \text{South pole (−Z). The excited state.} \\\)

\(\vert{}+\rangle &= \frac{\vert{}0\rangle + \vert{}1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ 1 \end{bmatrix} && \text{+X axis. Equal superposition state and eigenstate of Pauli-X.} \\ \vert{}-\rangle &= \frac{\vert{}0\rangle - \vert{}1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -1 \end{bmatrix} && \text{−X axis. Superposition with a } \pi \text{ phase difference.} \\ \vert{}+i\rangle &= \frac{\vert{}0\rangle + i\vert{}1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ i \end{bmatrix} && \text{+Y axis. Circular phase state and eigenstate of Pauli-Y.} \\ \vert{}-i\rangle &= \frac{\vert{}0\rangle - i\vert{}1\rangle}{\sqrt{2}} = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 \\ -i \end{bmatrix} && \text{−Y axis. Opposite circular phase state.} \end{aligned} \%\%\)MAGIT_PARSER_PROTECT%%```
```

### 4. Quantum Gates as Rotations

Quantum logic gates are 2 × 2 unitary operators satisfying **U†U = I**. They preserve the length of the state vector:

- **Hadamard (H)**: Creates equal superposition from basis states and reflects across the X + Z diagonal.
- **Pauli-X (σₓ)**: Bit-flip gate; a 180° rotation around the X axis, exchanging **|0⟩ ↔ |1⟩**.
- **Pauli-Y (σᵧ)**: Bit-and-phase-flip gate; a 180° rotation around the Y axis, mapping **|0⟩ ↔ i|1⟩** up to global phase.
- **Pauli-Z (σ𝓏)**: Phase-flip gate; a 180° rotation around the Z axis, exchanging **|+⟩ ↔ |−⟩**.
- **Phase gate (S)**: A 90° rotation around the Z axis with matrix **S = diag(1, i)**.
- **Axis rotations (Rₓ, Rᵧ, R𝓏)**: Exact continuous rotations generated by the Pauli matrices:

  **Rₙ(θ) = cos(θ/2)I − i·sin(θ/2)(n⃗ · σ⃗ )**

---

## 🖥️ Interactive Interface Tour

The simulator is divided into three core views:

1. **Left Panel — 3D Bloch Sphere**: Orbit around the sphere with your mouse or finger, view the cardinal axes, and watch the gold state-vector arrow update instantly. Click **MATRICES** to open the reference modal for gate matrices.
2. **Middle Panel — Quantum Gates**: Clearly lists the applied sequence trail and provides buttons with their unitary matrices for H, σₓ, σᵧ, σ𝓏, S, and the rotation gates.
3. **Right Panel — Math Breakdown**: Shows the worked-out algebraic derivation for every click, including the exact input state, matrix multiplication, and final state.

---

## 🔬 Mathematical Verification Suite

To guarantee that the simulator is faithful to textbook quantum mechanics:

- Every gate matrix displayed on the screen is dynamically extracted from the source code.
- Each gate is checked against analytical formulas for exact matrix equality.
- The simulator is evaluated across **all 66 gate × cardinal-state transitions** for unit norm and fidelity up to global phase.
- The app passes all **94 mathematical checks**.

```bash
cd frontend
npm run verify
# ✔ Displayed gate matrices match their analytic formulas exactly (11 gates).
# ✔ 66 gate × cardinal-state transitions verified up to global phase.
# ✔ All displayed matrices are unitary.
# ✔ S = eⁱπ⁄⁴ · R𝓏(π/2) and S† = e⁻ⁱπ⁄⁴ · R𝓏(−π/2).
# 94 checks passed.
```

---

## 💻 Tech Stack & Architecture

- **React 19 + Vite**: Ultra-fast component lifecycle and build system.
- **Three.js + @react-three/fiber + @react-three/drei**: WebGL-accelerated 3D rendering with smooth orbit controls.
- **react-katex + KaTeX**: High-fidelity mathematical typesetting for matrices and formulas.
- **Tailwind CSS v4 + Custom Modular CSS**: High-performance UI styling with strict layer scoping.
- **GitHub Actions**: Automated CI/CD pipeline deploying each release to GitHub Pages on every push to `main`.

---

## 🚀 Local Development Setup

To run this project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator.git
cd Quantum-bloch-simulator/frontend

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Then visit `http://localhost:5173` in your browser.

### Build and Test Commands

```bash
npm run build     # Compile production bundle into dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint across the codebase
npm run verify    # Run the 94-check quantum math verification suite
```

---

## 🌐 Live Deployment on GitHub Pages

The web application is configured with automated GitHub Actions deployment.

- **Production URL**: https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/
- **Deployment Workflow**: `.github/workflows/deploy.yml` runs verification, compiles the static bundle, and publishes to GitHub Pages automatically.
- **One-time GitHub Setup**:
  1. In the GitHub repository, navigate to **Settings → Pages**.
  2. Under **Build and deployment → Source**, choose **GitHub Actions**.
  3. The workflow triggers automatically on push and deploys the live app within about one minute.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

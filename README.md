# ⚛️ Quantum Bloch Sphere Simulator

[![Deploy Quantum Bloch Simulator to GitHub Pages](https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

> **Live Interactive Web App**: **[https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/](https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/)**  
> *(Hosted directly on GitHub Pages — open in any modern browser to rotate the sphere and apply quantum gates live!)*

---

## 🌟 Why We Built This: A Bridge for Quantum Beginners

Quantum mechanics and quantum computing are notoriously counter-intuitive for newcomers. Beginners usually encounter two distinct, disconnected worlds:

1. **Abstract linear algebra**: $2 \times 2$ unitary matrices, state vectors in complex Hilbert space $\mathbb{C}^2$, and symbols like $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ that feel disconnected from physical reality.
2. **Abstract analogies**: Popular explanations like "a qubit is both 0 and 1 at the same time", which obscure the actual mathematical rules and make quantum computing seem mystical rather than computational.

### Why This Tool is Built Specifically for Beginners

- **Visual + Algebraic Connection**: The Bloch sphere is the standard geometric representation of a 2-level quantum system. This simulator links every geometric rotation of the state vector directly to its **step-by-step matrix multiplication**.
- **No Hidden Steps**: Unlike simulators that jump from input to output with a black-box result, this app explicitly logs: $$\text{Gate Matrix } U \times \text{State Vector } |\psi_{\text{in}}\rangle = \text{Exact Multiplication} = \text{Resulting State } |\psi_{\text{out}}\rangle$$
- **History Trail That Never Overwrites**: When learning, you need to see how you arrived at a state. The Math Breakdown panel stacks each operation vertically so you can trace your entire gate sequence (up to 12 steps).
- **Exact Textbook Math, Never Rounded**: Rotation matrices like $R_x(\pm\pi/2)$, $R_y(\pm\pi/2)$, and $R_z(\pm\pi/2)$ are computed and displayed using exact radicals ($1/\sqrt{2}$) and complex phase terms ($e^{\pm i\pi/4}$), with zero rounding artifacts.
- **Global Phase Transparency**: Beginners often get confused why $R_z(\pi/2)$ and the $S$ gate produce identical state arrows on the Bloch sphere despite having different diagonal elements. The app explains the global phase factor ($e^{-i\pi/4}$) clearly instead of silently sweeping it under the rug.

---

## 🧭 Core Quantum Concepts Explained

### 1. The Single Qubit State Vector

In classical computing, a bit is strictly $0$ or $1$. A single qubit exists as a pure quantum state in a 2D complex Hilbert space:
$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{pmatrix} \alpha \\ \beta \end{pmatrix}$$
where $\alpha, \beta \in \mathbb{C}$ and $|\alpha|^2 + |\beta|^2 = 1$ (the total probability must equal 1).

### 2. The Bloch Sphere Representation

Because an overall global phase $e^{i\gamma}$ has no physically measurable consequence ($|\psi\rangle \sim e^{i\gamma}|\psi\rangle$), any pure single-qubit state can be written using two real angles $\theta \in [0, \pi]$ and $\phi \in [0, 2\pi)$:
$$|\psi(\theta, \phi)\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$

This maps directly to a point $(x, y, z)$ on the unit 3D sphere:
$$x = \sin\theta \cos\phi, \quad y = \sin\theta \sin\phi, \quad z = \cos\theta$$

### 3. The 6 Cardinal States

The simulator tracks and identifies the fundamental cardinal states on the sphere's poles and equator:

- **$|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$**: North pole ($+Z$). The default ground state.
- **$|1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$**: South pole ($-Z$). The excited state.
- **$|+\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$**: $+X$ axis. Equal superposition state (eigenstate of Pauli-X).
- **$|-\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}$**: $-X$ axis. Superposition with a $\pi$ phase difference.
- **$|+i\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ i \end{pmatrix}$**: $+Y$ axis. Circular phase state (eigenstate of Pauli-Y).
- **$|-i\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -i \end{pmatrix}$**: $-Y$ axis. Opposite circular phase state.

### 4. Quantum Gates as Rotations

Quantum logic gates are $2 \times 2$ unitary operators ($U^\dagger U = I$) that preserve the length of the state vector:

- **Hadamard ($H$)**: Creates equal superposition from basis states; reflects across the $X+Z$ diagonal.
- **Pauli-X ($\sigma_x$)**: Bit-flip gate; $180^\circ$ rotation around the $X$ axis ($|0\rangle \leftrightarrow |1\rangle$).
- **Pauli-Y ($\sigma_y$)**: Bit-and-phase-flip; $180^\circ$ rotation around the $Y$ axis ($|0\rangle \leftrightarrow i|1\rangle$).
- **Pauli-Z ($\sigma_z$)**: Phase-flip gate; $180^\circ$ rotation around the $Z$ axis ($|+\rangle \leftrightarrow |-\rangle$).
- **Phase Gate ($S$)**: Quarter-turn ($90^\circ$) rotation around the $Z$ axis ($S = \text{diag}(1, i)$).
- **Axis Rotations ($R_x, R_y, R_z$)**: Exact continuous rotations generated by the Pauli matrices:
  $$R_n(\theta) = \exp\left(-i\frac{\theta}{2}\vec{n}\cdot\vec{\sigma}\right) = \cos\left(\frac{\theta}{2}\right)I - i\sin\left(\frac{\theta}{2}\right)(\vec{n}\cdot\vec{\sigma})$$

---

## 🖥️ Interactive Interface Tour

┌───────────────────────────┬───────────────────────────────┬────────────────────────────────┐
│      3D BLOCH SPHERE      │     QUANTUM GATES PANEL       │     STEP-BY-STEP MATH LOG      │
│                           │                               │                                │
│   • Orbit, zoom, pan 3D   │   • Applied sequence trail    │   • Scrollable step history    │
│   • Colored axes (X,Y,Z)  │   • Standard gates (H,X,Y,Z,S)│   • Input state vector         │
│   • Gold state vector     │   • Exact rotation buttons    │   • Gate unitary matrix        │
│   • MATRICES reference  │   • Reset & step counters     │   • Worked out multiplication  │
│     modal launcher        │                               │   • Resulting state & vector   │
└───────────────────────────┴───────────────────────────────┴────────────────────────────────┘

1. **Left Panel — 3D Bloch Sphere**: Orbit around the sphere with your mouse or finger, view the cardinal axes, and watch the gold state-vector arrow update instantly. Click **MATRICES** to open the comprehensive formula reference sheet.
2. **Middle Panel — Quantum Gates**: Clearly lists the applied sequence trail (`|0⟩ —H→ |+⟩ —Rz→ ...`) and provides buttons with their unitary matrices for $H$, $\sigma_x$, $\sigma_y$, $\sigma_z$, $S$, and $\pm\pi/2$ rotations around $X$, $Y$, and $Z$.
3. **Right Panel — Math Breakdown**: The worked-out algebraic derivation for every single click, showing exact inputs, matrix multiplication, and final state labels.

---

## 🔬 Mathematical Verification Suite

To guarantee that the simulator is 100% faithful to textbook quantum mechanics:

- Every gate matrix displayed on the screen is dynamically extracted from source code.
- Checked against analytical formulas for exact matrix equality.
- Evaluated across **all 66 gate $\times$ cardinal-state transitions** for unit norm and fidelity up to global phase.
- Passes all **94 mathematical checks**:

  ```bash
  cd frontend
  npm run verify
  # ✔ Displayed gate matrices match their analytic formulas exactly (11 gates).
  # ✔ 66 gate × cardinal-state transitions verified up to global phase.
  # ✔ All displayed matrices are unitary; S = e^{i\pi/4}\cdot Rz(\pi/2) and S^\dagger = e^{-i\pi/4}\cdot Rz(-\pi/2).
  # 94 checks passed.
💻 Tech Stack & Architecture
- React 19 + Vite: Ultra-fast component lifecycle and build system.
- Three.js + @react-three/fiber + @react-three/drei: WebGL-accelerated 3D rendering with smooth orbit controls.
- react-katex + KaTeX: High-fidelity $\mathrm{\LaTeX}$ mathematical typesetting for matrices and formulas.
- Tailwind CSS v4 + Custom Modular CSS: High-performance UI styling with strict layer scoping.
- GitHub Actions: Automated CI/CD pipeline deploying each release to GitHub Pages on every push to main.
🚀 Local Development Setup
To run this project locally on your machine:
# 1. Clone the repository
git clone https://github.com/Ramasubramanian-stack/Quantum-bloch-simulator.git
cd Quantum-bloch-simulator/frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
Visit http://localhost:5173 in your browser.
Build and Test Commands
npm run build     # Compile production bundle into dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint across the codebase
npm run verify    # Run the 94-check quantum math verification suite
🌐 Live Deployment on GitHub Pages
The web application is configured with automated GitHub Actions deployment.
- Production URL: https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/ (https://ramasubramanian-stack.github.io/Quantum-bloch-simulator/)
- Deployment Workflow: .github/workflows/deploy.yml runs verification, compiles the static bundle, and publishes to GitHub Pages automatically.
- One-time GitHub Setup:
1. In the GitHub repository, navigate to Settings $\rightarrow$ Pages.
2. Under Build and deployment $\rightarrow$ Source, choose GitHub Actions.
3. The workflow triggers automatically on push and deploys the live app within ~1 minute!
📜 License
This project is licensed under the MIT License — see the LICENSE (LICENSE) file for details.

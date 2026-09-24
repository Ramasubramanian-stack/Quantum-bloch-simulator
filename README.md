# ⚛️ Quantum Bloch Sphere Simulator

An interactive, beginner-friendly web app for learning **single-qubit quantum
computing** through the **Bloch sphere** — with every gate application broken
down into its exact matrix mathematics, step by step.

Built for students and newcomers who want to *see* what a quantum gate
actually does, both geometrically on the sphere and algebraically as matrix
multiplication.

---

## ✨ Features

- **Interactive 3D Bloch Sphere** — orbit, zoom, and watch the qubit state
  vector (gold arrow) jump between the 6 cardinal states in real time.
- **6 Cardinal Qubit States** — `|0⟩`, `|1⟩`, `|+⟩`, `|-⟩`, `|+i⟩`, `|-i⟩`
  positioned at ±Z, ±X, ±Y exactly as in textbook quantum mechanics
  (|0⟩ at the +Z north pole).
- **Quantum Gates** — Hadamard (**H**), Pauli-X (**σₓ**), Pauli-Y (**σᵧ**),
  Pauli-Z (**σ_z**), and the S phase gate, each displayed with its unitary matrix.
- **Default-Axis Rotations** — exact ±π/2 rotations about the X, Y, and Z axes.
  Every rotation button displays its true textbook matrix
  (`Rx(θ) = cos(θ/2)I − i·sin(θ/2)σx`, likewise for Y, and
  `Rz(θ) = diag(e^{−iθ/2}, e^{iθ/2})`), with the general formula printed
  beside the button — so no button ever shows a matrix that disagrees with
  the reference window. Where a raw product differs from the physical state
  by a global phase (e.g. `Rz(π/2)` versus `S`), the calculation panel
  states that phase explicitly instead of hiding it.
- **Step-by-Step Math Breakdown** — every gate application appends a new
  calculation *below* the previous one in the scrollable math panel:
  gate matrix × input state vector = resulting vector = resulting state.
  Nothing is overwritten; the full history of up to 12 steps stays visible.
- **12-Operation Sequence Limit** — keeps the calculation panel readable; a
  reset starts a fresh worked example.
- **Gate Sequence Summary** — the middle panel shows the applied operations, e.g.
  `|0⟩ —H→ —Px→ |1⟩`.
- **Matrices Reference Modal** — a pop-up cheat sheet with state vectors,
  density matrices (`ρ = |ψ⟩⟨ψ|`), Pauli operators, standard gates, and the
  general `|ψ(θ, φ)⟩` parameterization.
- **Quantum Gates Reference Window** — inside the MATRICES modal: for Rx, Ry,
  and Rz the exact algebraic formula (typeset with KaTeX), directly followed by
  the θ = ±π/2 matrices the simulator buttons actually apply, plus a short
  "Why it works" note connecting the two — formula first, numbers second.
- **Physically Verified Math** — `npm run verify` parses the matrices the UI
  actually displays out of `src/App.jsx`, compares them exactly against the
  analytic rotation formulas, then checks all 66 gate × cardinal-state
  actions for unit norm and equality up to global phase (94 checks,
  including unitarity and the `S = e^{iπ/4}·Rz(π/2)` relations).

## 🖥️ Interface Overview

| Panel        | Contents                                                        |
| ------------ | --------------------------------------------------------------- |
| **Left**     | 3D Bloch sphere + MATRICES reference button                     |
| **Middle**   | Step tracker, sequence trail, and gate buttons with matrices    |
| **Right**    | Scrollable "Math Breakdown": initial state + full step history  |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or newer** (v20+ recommended)
- npm (bundled with Node.js)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/quantum-bloch-simulator.git
cd quantum-bloch-simulator/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open the URL printed in the terminal (default: <http://localhost:5173>).

### Production Build

```bash
npm run build     # outputs to frontend/dist/
npm run preview   # serve the production build locally
npm run verify    # independently check the taught gate and rotation math
```

## 🧮 How the Math Works

A single qubit pure state is a unit vector in ℂ²:

```
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)·sin(θ/2)|1⟩
```

which maps to the Bloch vector `(sinθ·cosφ, sinθ·sinφ, cosθ)` on the unit
sphere. Each gate is a 2×2 unitary matrix; applying it is plain
matrix–vector multiplication. Example — Hadamard on `|0⟩`:

```
H|0⟩ = (1/√2) [ 1  1 ] [ 1 ]   = (1/√2) [ 1 ]  = |+⟩
              [ 1 -1 ] [ 0 ]              [ 1 ]
```

The simulator performs exactly this calculation for every step and renders
the input vector, gate matrix, and result in textbook bracket notation.

## 📁 Project Structure

```
quantum-bloch-simulator/
├── frontend/                  # React + Vite application (Phase 1 — complete)
│   ├── src/
│   │   ├── App.jsx            # State machine, gate transitions, math history
│   │   ├── BlochSphere.jsx    # 3D sphere, axes, state-vector arrow
│   │   ├── MatricesModal.jsx  # Reference modal (states, ρ matrices, gates)
│   │   ├── QuantumGatesReference.jsx # Formula → θ=±π/2 instances → why (Tailwind + KaTeX)
│   │   ├── TextbookMatrix.jsx # Bracketed matrix renderer
│   │   └── App.css            # All styling
│   ├── scripts/
│   │   └── verify-pauli-gates.mjs  # npm run verify — 94 independent math checks
│   └── package.json
├── backend/                   # Planned C++ compute engine (see backend/README.md)
├── LICENSE                    # MIT
└── README.md
```

## 🛠️ Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D rendering
- **Tailwind CSS v4** — utilities only (theme + utilities layers; the preflight
  layer is intentionally excluded so it cannot restyle the app) for the
  Quantum Gates Reference Window
- **react-katex** + **KaTeX** — real typeset math (formulas and matrices)
- Plain CSS (no UI framework) for everything else — simple, hackable styling

## 🗺️ Roadmap

- [ ] Arbitrary-angle rotation gates Rx(θ), Ry(θ), Rz(θ) beyond the exact ±π/2 buttons
- [ ] Arbitrary (θ, φ) state initialization via sliders
- [ ] Animated state-vector transitions on the sphere
- [ ] C++ WebAssembly compute engine (`backend/cpp_engine/`)
- [ ] Multi-qubit support and entanglement visualization

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request

Please run `npm run lint` and `npm run build` inside `frontend/` before
submitting.

## 📜 License

Distributed under the **MIT License** — see [LICENSE](LICENSE) for details.

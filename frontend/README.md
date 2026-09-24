# Quantum Bloch Sphere Simulator — Frontend

React + Vite single-page application that renders the interactive Bloch sphere,
quantum gate controls, and the step-by-step matrix math breakdown.

For the full project overview, screenshots, and contribution guide, see the
[root README](../README.md).

## Quick Start

```bash
npm install     # install dependencies
npm run dev     # start the dev server (default: http://localhost:5173)
npm run verify  # independently verify the taught gate and rotation math
```

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite development server        |
| `npm run build`   | Produce a production build in `dist/`    |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint over the source files         |
| `npm run verify`  | Verify canonical gate and rotation math  |

## Source Layout

| File                   | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `src/App.jsx`          | App shell, qubit state machine, gate transition map, math history  |
| `src/BlochSphere.jsx`  | Three.js / React Three Fiber Bloch sphere, axes, and state arrow   |
| `src/MatricesModal.jsx`| Pop-up reference: state vectors, density matrices, gate matrices   |
| `src/QuantumGatesReference.jsx` | Quantum Gates Reference Window (Tailwind + react-katex): formula → θ = ±π/2 instances → why |
| `src/TextbookMatrix.jsx`| Renders bracketed textbook-style matrices with optional scalars   |
| `src/App.css`          | All panel, matrix, modal, and tracker styling                      |
| `scripts/verify-pauli-gates.mjs` | `npm run verify` — checks displayed matrices vs their formulas |


> **Note:** The Bloch sphere axes group is intentionally rotated −90° about X
> in `BlochSphere.jsx` so that the Three.js default sphere orientation matches
> the standard Bloch-sphere convention (|0⟩ at +Z north pole, |+⟩ at +X, |+i⟩
> at +Y). Do not change this rotation.

## Notation & Conventions

- **Buttons display their true textbook matrix.** Each gate button shows the
  matrix that is actually applied — never display a different matrix than the
  one being applied, even if the two agree up to a global phase. The Rotations
  group keeps it minimal (gate label + matrix only); the general formulas
  (`Rx(θ) = cos(θ/2)I − i·sin(θ/2)σx`, likewise for Y, and
  `Rz(θ) = diag(e^{−iθ/2}, e^{iθ/2})`) live in the **Quantum Gates Reference
  Window** inside the MATRICES modal, which walks formula → evaluated θ = ±π/2
  instances → why they are equal.
- **`Rz(±π/2)` is not `S`/`S†`.** `S = diag(1, i) = e^{iπ/4}·Rz(π/2)`. The Rz
  buttons carry the exact phase-factor matrices; `S` keeps its own matrix. The
  calculation panel reports the `e^{∓iπ/4}` global phase for Rz steps, the same
  way it does for Hadamard on `|±i⟩` and Pauli-Y on `|-i⟩`.
- **Global phases are labelled with exact symbols**, never decimals:
  `e^{iπ/4}`, `e^{-i3π/4}`, `-1 ( = e^{iπ} )`, and so on.
- **`npm run verify` enforces all of the above.** It parses the displayed
  matrices out of `src/App.jsx` and fails the build if any button's matrix
  stops matching its formula, so run it before committing math changes.


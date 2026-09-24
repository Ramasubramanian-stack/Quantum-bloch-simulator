# Backend (Planned)

This directory is reserved for a future **C++ computation engine** (`cpp_engine/`)
that will offload state-vector math for larger gate sequences and multi-qubit
support.

**Current status (Phase 1):** All single-qubit calculations are performed
client-side in the React frontend using an exact, pre-verified transition map
covering the 6 cardinal Bloch-sphere states (`|0⟩`, `|1⟩`, `|+⟩`, `|-⟩`,
`|+i⟩`, `|-i⟩`) and the Hadamard / Pauli-X / Pauli-Y / Pauli-Z gates. No
backend is required to run the simulator — see the
[root README](../README.md) for setup instructions.

**Roadmap for this folder:**

- Arbitrary (θ, φ) state initialization
- Parameterized rotation gates: Rx(θ), Ry(θ), Rz(θ), Phase(λ)
- Multi-qubit state vectors and entanglement visualization
- WebAssembly (Emscripten) binding so the C++ engine runs in the browser

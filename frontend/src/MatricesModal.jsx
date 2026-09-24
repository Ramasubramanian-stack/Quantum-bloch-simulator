import React, { useEffect } from "react";
import TextbookMatrix from "./TextbookMatrix";
import QuantumGatesReference from "./QuantumGatesReference";

const CARDINAL_STATES = [
  {
    name: "Ground State |0⟩",
    symbol: "|0⟩",
    axis: "+Z Axis (North Pole)",
    description: "Computational zero basis state. The default initialized qubit state.",
    stateVector: [["1"], ["0"]],
    vectorScalar: null,
    densityMatrix: [
      ["1", "0"],
      ["0", "0"],
    ],
    densityScalar: null,
    probability: "P(|0⟩) = 1, P(|1⟩) = 0",
  },
  {
    name: "Excited State |1⟩",
    symbol: "|1⟩",
    axis: "-Z Axis (South Pole)",
    description: "Computational one basis state. Orthogonal to |0⟩.",
    stateVector: [["0"], ["1"]],
    vectorScalar: null,
    densityMatrix: [
      ["0", "0"],
      ["0", "1"],
    ],
    densityScalar: null,
    probability: "P(|0⟩) = 0, P(|1⟩) = 1",
  },
  {
    name: "Hadamard Plus |+⟩",
    symbol: "|+⟩",
    axis: "+X Axis (Equator)",
    description: "Equal superposition state: (|0⟩ + |1⟩)/√2. Eigenstate of Pauli-X (+1).",
    stateVector: [["1"], ["1"]],
    vectorScalar: "1/√2",
    densityMatrix: [
      ["1", "1"],
      ["1", "1"],
    ],
    densityScalar: "1/2",
    probability: "P(|0⟩) = 1/2, P(|1⟩) = 1/2",
  },
  {
    name: "Hadamard Minus |-⟩",
    symbol: "|-⟩",
    axis: "-X Axis (Equator)",
    description: "Equal superposition with π phase difference: (|0⟩ - |1⟩)/√2. Eigenstate of Pauli-X (-1).",
    stateVector: [["1"], ["-1"]],
    vectorScalar: "1/√2",
    densityMatrix: [
      ["1", "-1"],
      ["-1", "1"],
    ],
    densityScalar: "1/2",
    probability: "P(|0⟩) = 1/2, P(|1⟩) = 1/2",
  },
  {
    name: "Plus-i State |+i⟩",
    symbol: "|+i⟩",
    axis: "+Y Axis (Equator)",
    description: "Circular phase state: (|0⟩ + i|1⟩)/√2. Eigenstate of Pauli-Y (+1).",
    stateVector: [["1"], ["i"]],
    vectorScalar: "1/√2",
    densityMatrix: [
      ["1", "-i"],
      ["i", "1"],
    ],
    densityScalar: "1/2",
    probability: "P(|0⟩) = 1/2, P(|1⟩) = 1/2",
  },
  {
    name: "Minus-i State |-i⟩",
    symbol: "|-i⟩",
    axis: "-Y Axis (Equator)",
    description: "Circular phase state: (|0⟩ - i|1⟩)/√2. Eigenstate of Pauli-Y (-1).",
    stateVector: [["1"], ["-i"]],
    vectorScalar: "1/√2",
    densityMatrix: [
      ["1", "i"],
      ["-i", "1"],
    ],
    densityScalar: "1/2",
    probability: "P(|0⟩) = 1/2, P(|1⟩) = 1/2",
  },
];

const PAULI_MATRICES = [
  {
    name: "Identity Operator",
    symbol: "I",
    matrix: [
      ["1", "0"],
      ["0", "1"],
    ],
    scalar: null,
    role: "No-operation. In density matrix representation, (1/2)I corresponds to the center of the Bloch sphere (maximally mixed state).",
  },
  {
    name: "Pauli-X (NOT / Bit-Flip)",
    symbol: <>σ<sub>x</sub></>,
    matrix: [
      ["0", "1"],
      ["1", "0"],
    ],
    scalar: null,
    role: "Flips computational basis |0⟩ ↔ |1⟩. Corresponds to a π (180°) rotation around the X-axis of the Bloch sphere.",
  },
  {
    name: "Pauli-Y (Bit & Phase Flip)",
    symbol: <>σ<sub>y</sub></>,
    matrix: [
      ["0", "-i"],
      ["i", "0"],
    ],
    scalar: null,
    role: "Combined bit and phase flip: Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩. Corresponds to a π rotation around the Y-axis.",
  },
  {
    name: "Pauli-Z (Phase-Flip)",
    symbol: <>σ<sub>z</sub></>,
    matrix: [
      ["1", "0"],
      ["0", "-1"],
    ],
    scalar: null,
    role: "Flips relative phase: Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Corresponds to a π rotation around the Z-axis.",
  },
];

const QUANTUM_GATES = [
  {
    name: "Hadamard Gate",
    symbol: "H",
    scalar: "1/√2",
    matrix: [
      ["1", "1"],
      ["1", "-1"],
    ],
    role: "Creates uniform superposition from basis states: H|0⟩ = |+⟩, H|1⟩ = |-⟩. Maps X ↔ Z axes on the Bloch sphere.",
  },
  {
    name: "Phase Gate (S Gate)",
    symbol: "S",
    scalar: null,
    matrix: [
      ["1", "0"],
      ["0", "i"],
    ],
    instances: "S = diag(1, i) = e^{iπ/4}·Rz(π/2)   |   S† = diag(1, −i) = e^{−iπ/4}·Rz(−π/2)",
    role: "Applies a π/2 (90°) rotation around the Z-axis: |+⟩ → |+i⟩, |+i⟩ → |−⟩. This exact matrix is also the one shown on the simulator's S button.",
  },
  {
    name: "T Gate (π/8 Gate)",
    symbol: "T",
    scalar: null,
    matrix: [
      ["1", "0"],
      ["0", "e^{iπ/4}"],
    ],
    instances: "T = diag(1, e^{iπ/4}) = e^{iπ/8}·Rz(π/4)",
    role: "Applies a π/4 (45°) rotation around the Z-axis. Reference only — T is not simulated in Phase 1 (its half-angle phase is outside the exact 45° grid the calculator covers).",
  },
];

export function MatricesModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">Quantum Reference</span>
            <h2 className="modal-title">Bloch Sphere & Quantum State Matrices</h2>
            <p className="modal-subtitle">
              Authentic textbook matrices for state vectors, density operators, and quantum logic gates.
            </p>
          </div>
          <button className="modal-close-icon" onClick={onClose} title="Close (Esc)">
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body">
          {/* Section 1: The 6 Cardinal States */}
          <div className="modal-section">
            <div className="section-title-row">
              <span className="section-number">01</span>
              <h3 className="section-heading">6 Cardinal Qubit State Vectors & Density Matrices</h3>
            </div>
            <p className="section-desc">
              Any pure single-qubit state resides on the surface of the Bloch sphere (|r| = 1). The 6 primary eigenstates along the ±X, ±Y, and ±Z axes are:
            </p>

            <div className="states-matrix-grid">
              {CARDINAL_STATES.map((st) => (
                <div key={st.symbol} className="state-matrix-card">
                  <div className="card-top-row">
                    <span className="state-ket-badge">{st.symbol}</span>
                    <span className="state-axis-badge">{st.axis}</span>
                  </div>
                  <h4 className="state-card-name">{st.name}</h4>
                  <p className="state-card-desc">{st.description}</p>

                  <div className="matrix-comparison-row">
                    <div className="matrix-sub-item">
                      <span className="matrix-sub-label">State Vector |ψ⟩:</span>
                      <div className="matrix-render-box">
                        <TextbookMatrix matrix={st.stateVector} scalar={st.vectorScalar} />
                      </div>
                    </div>

                    <div className="matrix-sub-item">
                      <span className="matrix-sub-label">Density Matrix ρ = |ψ⟩⟨ψ|:</span>
                      <div className="matrix-render-box">
                        <TextbookMatrix matrix={st.densityMatrix} scalar={st.densityScalar} />
                      </div>
                    </div>
                  </div>

                  <div className="state-card-footer">
                    <span className="prob-chip">{st.probability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Pauli Operators & Generators */}
          <div className="modal-section">
            <div className="section-title-row">
              <span className="section-number">02</span>
              <h3 className="section-heading">Pauli Spin Operators (Generators of Rotations)</h3>
            </div>
            <p className="section-desc">
              The Pauli matrices form a complete basis for 2×2 Hermitian operators and generate rotations on the Bloch sphere.
            </p>

            <div className="gates-matrix-grid">
              {PAULI_MATRICES.map((p) => (
                <div key={p.name} className="gate-matrix-card">
                  <div className="card-top-row">
                    <span className="gate-symbol-badge">{p.symbol}</span>
                    <span className="gate-type-badge">Pauli</span>
                  </div>
                  <h4 className="state-card-name">{p.name}</h4>
                  <div className="matrix-render-box centered">
                    <TextbookMatrix matrix={p.matrix} scalar={p.scalar} />
                  </div>
                  <p className="gate-role-text">{p.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Essential Quantum Logic Gates + Rotation Reference */}
          <div className="modal-section">
            <div className="section-title-row">
              <span className="section-number">03</span>
              <h3 className="section-heading">Standard Single-Qubit Gates</h3>
            </div>
            <p className="section-desc">
              Unitary transformations (U†U = I) that rotate state vectors across the Bloch sphere. A global phase does not change the physical Bloch-vector direction.
            </p>

            <div className="gates-matrix-grid">
              {QUANTUM_GATES.map((g) => (
                <div key={g.name} className="gate-matrix-card">
                  <div className="card-top-row">
                    <span className="gate-symbol-badge">{g.symbol}</span>
                    <span className="gate-type-badge">Gate</span>
                  </div>
                  <h4 className="state-card-name">{g.name}</h4>
                  <div className="matrix-render-box centered">
                    <TextbookMatrix matrix={g.matrix} scalar={g.scalar} />
                  </div>
                  {g.instances && (
                    <p className="gate-instances-text">{g.instances}</p>
                  )}
                  <p className="gate-role-text">{g.role}</p>
                </div>
              ))}
            </div>

            {/* Rotation gates: formula first, then the evaluated button angles */}
            <QuantumGatesReference />
          </div>
        </div>

      </div>
    </div>
  );
}

export default MatricesModal;

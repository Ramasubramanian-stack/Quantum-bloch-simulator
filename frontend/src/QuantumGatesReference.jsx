import React from "react";
import "./QuantumGatesReference.css";

/**
 * The rotation reference intentionally uses normal React elements instead of
 * KaTeX strings. This keeps the reference reliable in production builds and
 * avoids displaying raw LaTeX when the deployed asset is loaded without the
 * KaTeX stylesheet.
 */
const HALF_ANGLE = "θ/2";

const matrixCell = (children, className = "") => (
  <span className={`rotation-matrix-cell ${className}`}>{children}</span>
);

// bracket: "round" for symbolic/general formulas (textbook convention),
// "square" (default) for concrete numeric instances.
function Matrix({ factor, rows, ariaLabel, bracket = "square" }) {
  const glyph = bracket === "round" ? ["(", ")"] : ["[", "]"];
  return (
    <div className="rotation-matrix-wrap" role="img" aria-label={ariaLabel}>
      {factor && <span className="rotation-matrix-factor">{factor}</span>}
      <span className={`rotation-matrix-box rotation-matrix-box--${bracket}`}>
        <span className="rotation-matrix-bracket rotation-matrix-left" aria-hidden="true">
          {glyph[0]}
        </span>
        <span className="rotation-matrix-grid">
          {rows.flatMap((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <React.Fragment key={`${rowIndex}-${columnIndex}`}>
                {matrixCell(cell)}
              </React.Fragment>
            )),
          )}
        </span>
        <span className="rotation-matrix-bracket rotation-matrix-right" aria-hidden="true">
          {glyph[1]}
        </span>
      </span>
    </div>
  );
}

function DiagonalMatrix({ entries, ariaLabel, bracket }) {
  return (
    <Matrix
      ariaLabel={ariaLabel}
      bracket={bracket}
      rows={[
        [entries[0], "0"],
        ["0", entries[1]],
      ]}
    />
  );
}

const ROTATION_GATES = [
  {
    id: "rx",
    title: "Rₓ(θ) — rotation about the X axis",
    general: (
      <Matrix
        bracket="round"
        ariaLabel="Rx theta equals the two by two matrix with cos theta over 2 on the diagonal and negative i sine theta over 2 off the diagonal"
        rows={[
          [<>cos({HALF_ANGLE})</>, <>−i sin({HALF_ANGLE})</>],
          [<>−i sin({HALF_ANGLE})</>, <>cos({HALF_ANGLE})</>],
        ]}
      />
    ),
    instances: [
      {
        label: "θ = +π/2 · simulator button Rₓ",
        content: <Matrix factor="1/√2" rows={[["1", "−i"], ["−i", "1"]]} ariaLabel="one over square root of two times the Rx plus pi over two matrix" />,
      },
      {
        label: "θ = −π/2 · simulator button Rₓ",
        content: <Matrix factor="1/√2" rows={[["1", "i"], ["i", "1"]]} ariaLabel="one over square root of two times the Rx minus pi over two matrix" />,
      },
    ],
    why: [
      <>For θ = π/2, the half-angle is π/4. Since cos(π/4) = sin(π/4) = 1/√2, we factor 1/√2 out front.</>,
    ],
  },
  {
    id: "ry",
    title: "Rᵧ(θ) — rotation about the Y axis",
    general: (
      <Matrix
        bracket="round"
        ariaLabel="Ry theta equals the two by two matrix with cos theta over 2 on the diagonal"
        rows={[
          [<>cos({HALF_ANGLE})</>, <>−sin({HALF_ANGLE})</>],
          [<>sin({HALF_ANGLE})</>, <>cos({HALF_ANGLE})</>],
        ]}
      />
    ),
    instances: [
      {
        label: "θ = +π/2 · simulator button Rᵧ",
        content: <Matrix factor="1/√2" rows={[["1", "−1"], ["1", "1"]]} ariaLabel="one over square root of two times the Ry plus pi over two matrix" />,
      },
      {
        label: "θ = −π/2 · simulator button Rᵧ",
        content: <Matrix factor="1/√2" rows={[["1", "1"], ["−1", "1"]]} ariaLabel="one over square root of two times the Ry minus pi over two matrix" />,
      },
    ],
    why: [
      <>For θ = π/2, cos(π/4) = sin(π/4) = 1/√2, so we again factor 1/√2 out front.</>,
      <>Only the off-diagonal signs differ between +π/2 and −π/2; that sign flip reverses the direction of rotation around the Y axis.</>,
    ],
  },
  {
    id: "rz",
    title: "R𝓏(θ) — rotation about the Z axis",
    general: (
      <DiagonalMatrix
        bracket="round"
        entries={[<>e<sup>−iθ/2</sup></>, <>e<sup>iθ/2</sup></>]}
        ariaLabel="Rz theta equals diagonal e to the negative i theta over two and e to the i theta over two"
      />
    ),
    instances: [
      {
        label: "θ = +π/2 · simulator button R𝓏",
        content: <DiagonalMatrix entries={[<>e<sup>−iπ/4</sup></>, <>e<sup>iπ/4</sup></>]} ariaLabel="Rz plus pi over two diagonal matrix" />,
      },
      {
        label: "θ = −π/2 · simulator button R𝓏",
        content: <DiagonalMatrix entries={[<>e<sup>iπ/4</sup></>, <>e<sup>−iπ/4</sup></>]} ariaLabel="Rz minus pi over two diagonal matrix" />,
      },
    ],
    why: [
      <>For θ = π/2, the half-angle is π/4, so the diagonal entries are exactly e<sup>±iπ/4</sup>.</>,
    ],
  },
];

function StepBadge({ number, children }) {
  return (
    <h5 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#5eead4]">
      {number}. {children}
    </h5>
  );
}

function RotationGateCard({ gate }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d1428] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
      <header className="flex flex-col gap-2">
        <h4 className="font-mono text-sm font-semibold text-[#f1f5f9]">{gate.title}</h4>
        <StepBadge number="1">General formula</StepBadge>
        <div className="rotation-formula-box">{gate.general}</div>
      </header>

      <div className="flex flex-col gap-2">
        <StepBadge number="2">Evaluated at the button angles (θ = ±π/2)</StepBadge>
        <div className="grid grid-cols-1 gap-2 min-[19rem]:grid-cols-2">
          {gate.instances.map((instance) => (
            <figure key={instance.label} className="flex flex-col gap-1.5 rounded-lg border border-[#00bfa5]/25 bg-[#00bfa5]/5 px-2.5 py-2">
              <figcaption className="text-[0.64rem] font-medium uppercase tracking-wide text-[#7dd3c0]">{instance.label}</figcaption>
              <div className="rotation-instance-box">{instance.content}</div>
            </figure>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border-l-2 border-l-[#fbbf24] bg-[#fbbf24]/[0.07] px-3 py-2">
        <StepBadge number="3">Why it works</StepBadge>
        <ul className="flex flex-col gap-1.5">
          {gate.why.map((line, index) => (
            <li key={index} className="relative pl-4 text-[0.78rem] leading-relaxed text-[#cbd5e1] before:absolute before:left-1 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#fbbf24]">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function QuantumGatesReference() {
  return (
    <section className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0b1122] p-4">
      <header className="flex flex-col gap-1">
        <h3 className="font-mono text-[0.95rem] font-semibold uppercase tracking-[0.15em] text-[#00bfa5]">
          Quantum Gates Reference Window — Rotations
        </h3>
      </header>
      <div className="flex flex-col gap-3">
        {ROTATION_GATES.map((gate) => <RotationGateCard key={gate.id} gate={gate} />)}
      </div>
    </section>
  );
}

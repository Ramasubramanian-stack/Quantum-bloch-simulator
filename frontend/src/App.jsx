import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import BlochSphere from "./BlochSphere";
import TextbookMatrix from "./TextbookMatrix";
import MatricesModal from "./MatricesModal";

// 6 Canonical Qubit States on the Bloch Sphere
const STATES = {
  "0": {
    id: "0",
    symbol: "|0⟩",
    name: "Ground State |0⟩",
    axis: "+Z Axis (North Pole)",
    blochVector: [0, 0, 1],
    scalar: null,
    matrix: [["1"], ["0"]],
  },
  "1": {
    id: "1",
    symbol: "|1⟩",
    name: "Excited State |1⟩",
    axis: "-Z Axis (South Pole)",
    blochVector: [0, 0, -1],
    scalar: null,
    matrix: [["0"], ["1"]],
  },
  plus: {
    id: "plus",
    symbol: "|+⟩",
    name: "Plus State |+⟩",
    axis: "+X Axis",
    blochVector: [1, 0, 0],
    scalar: "1/√2",
    matrix: [["1"], ["1"]],
  },
  minus: {
    id: "minus",
    symbol: "|-⟩",
    name: "Minus State |-⟩",
    axis: "-X Axis",
    blochVector: [-1, 0, 0],
    scalar: "1/√2",
    matrix: [["1"], ["-1"]],
  },
  plus_i: {
    id: "plus_i",
    symbol: "|+i⟩",
    name: "Plus-i State |+i⟩",
    axis: "+Y Axis",
    blochVector: [0, 1, 0],
    scalar: "1/√2",
    matrix: [["1"], ["i"]],
  },
  minus_i: {
    id: "minus_i",
    symbol: "|-i⟩",
    name: "Minus-i State |-i⟩",
    axis: "-Y Axis",
    blochVector: [0, -1, 0],
    scalar: "1/√2",
    matrix: [["1"], ["-i"]],
  },
};

// Quantum Gate Definitions
const GATES = [
  {
    id: "H",
    label: "H",
    name: "Hadamard",
    group: "gates",
    scalar: "1/√2",
    matrix: [
      ["1", "1"],
      ["1", "-1"],
    ],
    exactForm: "H = (σx + σz)/√2",
    exactNote: "exact as displayed — the 1/√2 is shown with the matrix. Self-inverse: H² = I.",
  },
  {
    id: "Px",
    label: <>σ<sub>x</sub></>,
    name: "Pauli-X",
    group: "gates",
    scalar: null,
    matrix: [
      ["0", "1"],
      ["1", "0"],
    ],
    exactForm: "σx = i·Rx(π)",
    exactNote: "exact as displayed — bit-flip, i.e. a 180° rotation about X up to the global phase i.",
  },
  {
    id: "Py",
    label: <>σ<sub>y</sub></>,
    name: "Pauli-Y",
    group: "gates",
    scalar: null,
    matrix: [
      ["0", "-i"],
      ["i", "0"],
    ],
    exactForm: "σy = i·Ry(π)",
    exactNote: "exact as displayed — combined bit & phase flip, i.e. a 180° rotation about Y up to the global phase i.",
  },
  {
    id: "Pz",
    label: <>σ<sub>z</sub></>,
    name: "Pauli-Z",
    group: "gates",
    scalar: null,
    matrix: [
      ["1", "0"],
      ["0", "-1"],
    ],
    exactForm: "σz = i·Rz(π) = diag(1, −1)",
    exactNote: "exact as displayed — phase flip, i.e. a 180° rotation about Z up to the global phase i.",
  },
  {
    id: "S",
    label: "S",
    name: "S Phase Gate",
    group: "gates",
    scalar: null,
    matrix: [["1", "0"], ["0", "i"]],
    exactForm: "S = diag(1, i) = e^{iπ/4}·Rz(π/2)",
    exactNote: "exact as displayed — the phase gate itself. A π/2 rotation about Z up to the global phase e^{iπ/4}.",
  },
  {
    id: "Rx+",
    label: <>R<sub>x</sub>(π/2)</>,
    buttonLabel: <>R<sub>x</sub></>,
    angle: "+π/2",
    name: "X Rotation +π/2",
    group: "rotations",
    scalar: "1/√2",
    matrix: [["1", "-i"], ["-i", "1"]],
    exactForm: "Rx(θ) = cos(θ/2)·I − i·sin(θ/2)·σx",
    exactNote: "θ = +π/2 ⇒ (1/√2)[[1, −i], [−i, 1]] — exact textbook matrix, no phase correction needed.",
  },
  {
    id: "Rx-",
    label: <>R<sub>x</sub>(−π/2)</>,
    buttonLabel: <>R<sub>x</sub></>,
    angle: "−π/2",
    name: "X Rotation −π/2",
    group: "rotations",
    scalar: "1/√2",
    matrix: [["1", "i"], ["i", "1"]],
    exactForm: "Rx(θ) = cos(θ/2)·I − i·sin(θ/2)·σx",
    exactNote: "θ = −π/2 ⇒ (1/√2)[[1, i], [i, 1]] — exact textbook matrix, no phase correction needed.",
  },
  {
    id: "Ry+",
    label: <>R<sub>y</sub>(π/2)</>,
    buttonLabel: <>R<sub>y</sub></>,
    angle: "+π/2",
    name: "Y Rotation +π/2",
    group: "rotations",
    scalar: "1/√2",
    matrix: [["1", "-1"], ["1", "1"]],
    exactForm: "Ry(θ) = cos(θ/2)·I − i·sin(θ/2)·σy",
    exactNote: "θ = +π/2 ⇒ (1/√2)[[1, −1], [1, 1]] — exact textbook matrix, no phase correction needed.",
  },
  {
    id: "Ry-",
    label: <>R<sub>y</sub>(−π/2)</>,
    buttonLabel: <>R<sub>y</sub></>,
    angle: "−π/2",
    name: "Y Rotation −π/2",
    group: "rotations",
    scalar: "1/√2",
    matrix: [["1", "1"], ["-1", "1"]],
    exactForm: "Ry(θ) = cos(θ/2)·I − i·sin(θ/2)·σy",
    exactNote: "θ = −π/2 ⇒ (1/√2)[[1, 1], [−1, 1]] — exact textbook matrix, no phase correction needed.",
  },
  {
    id: "Rz+",
    label: <>R<sub>z</sub>(π/2)</>,
    buttonLabel: <>R<sub>z</sub></>,
    angle: "+π/2",
    name: "Z Rotation +π/2",
    group: "rotations",
    scalar: null,
    // Exact textbook matrix: Rz(θ) = diag(e^{-iθ/2}, e^{iθ/2}) at θ = +π/2.
    // This is NOT the S gate: S = diag(1, i) = e^{iπ/4}·Rz(π/2).
    matrix: [["e^{-iπ/4}", "0"], ["0", "e^{iπ/4}"]],
    exactForm: "Rz(θ) = diag( e^{−iθ/2}, e^{iθ/2} )",
    exactNote: "θ = +π/2 ⇒ diag( e^{−iπ/4}, e^{iπ/4} ) — exact. Equal to S up to the global phase e^{iπ/4}.",
  },
  {
    id: "Rz-",
    label: <>R<sub>z</sub>(−π/2)</>,
    buttonLabel: <>R<sub>z</sub></>,
    angle: "−π/2",
    name: "Z Rotation −π/2",
    group: "rotations",
    scalar: null,
    // Rz(θ) = diag(e^{-iθ/2}, e^{iθ/2}) at θ = −π/2.
    // This is NOT S†: S† = diag(1, −i) = e^{-iπ/4}·Rz(−π/2).
    matrix: [["e^{iπ/4}", "0"], ["0", "e^{-iπ/4}"]],
    exactForm: "Rz(θ) = diag( e^{−iθ/2}, e^{iθ/2} )",
    exactNote: "θ = −π/2 ⇒ diag( e^{iπ/4}, e^{−iπ/4} ) — exact. Equal to S† up to the global phase e^{−iπ/4}.",
  },
];

// Exact Step Transition Map for sequential gate applications
const STEP_TRANSITIONS = {
  "0": {
    H: { nextId: "plus", resultMatrix: [["1"], ["1"]], resultScalar: "1/√2", symbol: "|+⟩" },
    Px: { nextId: "1", resultMatrix: [["0"], ["1"]], resultScalar: null, symbol: "|1⟩" },
    Py: { nextId: "1", resultMatrix: [["0"], ["i"]], resultScalar: null, symbol: "i|1⟩" },
    Pz: { nextId: "0", resultMatrix: [["1"], ["0"]], resultScalar: null, symbol: "|0⟩" },
  },
  "1": {
    H: { nextId: "minus", resultMatrix: [["1"], ["-1"]], resultScalar: "1/√2", symbol: "|-⟩" },
    Px: { nextId: "0", resultMatrix: [["1"], ["0"]], resultScalar: null, symbol: "|0⟩" },
    Py: { nextId: "0", resultMatrix: [["-i"], ["0"]], resultScalar: null, symbol: "-i|0⟩" },
    Pz: { nextId: "1", resultMatrix: [["0"], ["-1"]], resultScalar: null, symbol: "-|1⟩" },
  },
  plus: {
    H: { nextId: "0", resultMatrix: [["1"], ["0"]], resultScalar: null, symbol: "|0⟩" },
    Px: { nextId: "plus", resultMatrix: [["1"], ["1"]], resultScalar: "1/√2", symbol: "|+⟩" },
    Py: { nextId: "minus", resultMatrix: [["-i"], ["i"]], resultScalar: "1/√2", symbol: "-i|-⟩" },
    Pz: { nextId: "minus", resultMatrix: [["1"], ["-1"]], resultScalar: "1/√2", symbol: "|-⟩" },
  },
  minus: {
    H: { nextId: "1", resultMatrix: [["0"], ["1"]], resultScalar: null, symbol: "|1⟩" },
    Px: { nextId: "minus", resultMatrix: [["-1"], ["1"]], resultScalar: "1/√2", symbol: "-|-⟩" },
    Py: { nextId: "plus", resultMatrix: [["i"], ["i"]], resultScalar: "1/√2", symbol: "i|+⟩" },
    Pz: { nextId: "plus", resultMatrix: [["1"], ["1"]], resultScalar: "1/√2", symbol: "|+⟩" },
  },
  plus_i: {
    H: { nextId: "minus_i", resultMatrix: [["1"], ["-i"]], resultScalar: "1/√2", symbol: "|-i⟩" },
    Px: { nextId: "minus_i", resultMatrix: [["i"], ["1"]], resultScalar: "1/√2", symbol: "i|-i⟩" },
    Py: { nextId: "plus_i", resultMatrix: [["1"], ["i"]], resultScalar: "1/√2", symbol: "|+i⟩" },
    Pz: { nextId: "minus_i", resultMatrix: [["1"], ["-i"]], resultScalar: "1/√2", symbol: "|-i⟩" },
  },
  minus_i: {
    H: { nextId: "plus_i", resultMatrix: [["1"], ["i"]], resultScalar: "1/√2", symbol: "|+i⟩" },
    Px: { nextId: "plus_i", resultMatrix: [["-i"], ["1"]], resultScalar: "1/√2", symbol: "-i|+i⟩" },
    Py: { nextId: "minus_i", resultMatrix: [["1"], ["-i"]], resultScalar: "1/√2", symbol: "|-i⟩" },
    Pz: { nextId: "plus_i", resultMatrix: [["1"], ["i"]], resultScalar: "1/√2", symbol: "|+i⟩" },
  },
};

// Every interactive operation stays on one of the six cardinal Bloch states.
// The displayed result may differ from the raw product by global phase; the
// calculation panel identifies that phase explicitly because it is physical-state invariant.
const addTransitions = (gateId, transitions) => {
  Object.entries(transitions).forEach(([stateId, transition]) => {
    STEP_TRANSITIONS[stateId][gateId] = transition;
  });
};

const zero = { nextId: "0", resultMatrix: [["1"], ["0"]], resultScalar: null, symbol: "|0⟩" };
const one = { nextId: "1", resultMatrix: [["0"], ["1"]], resultScalar: null, symbol: "|1⟩" };
const plus = { nextId: "plus", resultMatrix: [["1"], ["1"]], resultScalar: "1/√2", symbol: "|+⟩" };
const minus = { nextId: "minus", resultMatrix: [["1"], ["-1"]], resultScalar: "1/√2", symbol: "|-⟩" };
const plusI = { nextId: "plus_i", resultMatrix: [["1"], ["i"]], resultScalar: "1/√2", symbol: "|+i⟩" };
const minusI = { nextId: "minus_i", resultMatrix: [["1"], ["-i"]], resultScalar: "1/√2", symbol: "|-i⟩" };

addTransitions("S", { "0": zero, "1": one, plus: plusI, minus: minusI, plus_i: minus, minus_i: plus });
addTransitions("Rx+", { "0": minusI, "1": plusI, plus, minus, plus_i: zero, minus_i: one });
addTransitions("Rx-", { "0": plusI, "1": minusI, plus, minus, plus_i: one, minus_i: zero });
addTransitions("Ry+", { "0": plus, "1": minus, plus: one, minus: zero, plus_i: plusI, minus_i: minusI });
addTransitions("Ry-", { "0": minus, "1": plus, plus: zero, minus: one, plus_i: plusI, minus_i: minusI });
// The Rz buttons display the exact textbook matrices
// Rz(θ) = diag(e^{-iθ/2}, e^{iθ/2}) at θ = ±π/2 — NOT the S / S† matrices.
// Their physical Bloch-sphere action equals S / S†, differing by the global
// phase e^{∓iπ/4}; the calculation panel flags exactly that difference.
addTransitions("Rz+", { "0": zero, "1": one, plus: plusI, minus: minusI, plus_i: minus, minus_i: plus });
addTransitions("Rz-", { "0": zero, "1": one, plus: minusI, minus: plusI, plus_i: plus, minus_i: minus });

const MAX_GATES = 12;

/* ==========================================================================
   Exact symbolic arithmetic for the worked step-by-step calculations.
   Entries are the basis/phase factors that appear in every matrix and state
   vector used by this app: 0, ±1, ±i and the rotation phase factors
   e^{±iπ/4}, e^{±i3π/4}. Products and sums of these stay exact.
   ========================================================================== */
const S2 = Math.SQRT1_2;
const ENTRY_VALUES = {
  "0": { re: 0, im: 0 },
  "1": { re: 1, im: 0 },
  "-1": { re: -1, im: 0 },
  i: { re: 0, im: 1 },
  "-i": { re: 0, im: -1 },
  "e^{iπ/4}": { re: S2, im: S2 },
  "e^{-iπ/4}": { re: S2, im: -S2 },
  "e^{i3π/4}": { re: -S2, im: S2 },
  "e^{-i3π/4}": { re: -S2, im: -S2 },
};

const parseEntry = (s) => ENTRY_VALUES[s] ?? { re: 0, im: 0 };

const mulC = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

const addC = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });

// Labels for unit-modulus phases z = e^{iφ}, indexed by the phase angle φ in
// units of π/4 (mod 8). Keeps every exact phase out of decimal notation.
const UNIT_CIRCLE_LABELS = [
  "1",
  "e^{iπ/4}",
  "i",
  "e^{i3π/4}",
  "-1",
  "e^{-i3π/4}",
  "-i",
  "e^{-iπ/4}",
];

// Compact complex formatter: "0", "1", "-1", "2", "i", "-i", "1+i", "1-i",
// and exact phase labels "e^{iπ/4}", "e^{-i3π/4}", ... for unit-modulus values.
const fmtC = ({ re, im }) => {
  if (re === 0 && im === 0) return "0";
  const modulus = Math.hypot(re, im);
  if (Math.abs(modulus - 1) < 1e-9) {
    const eighths =
      ((Math.round(Math.atan2(im, re) / (Math.PI / 4)) % 8) + 8) % 8;
    return UNIT_CIRCLE_LABELS[eighths];
  }
  if (im === 0) return String(re);
  if (re === 0) return im === 1 ? "i" : im === -1 ? "-i" : `${im}i`;
  const imAbs = Math.abs(im);
  const imPart = imAbs === 1 ? "i" : `${imAbs}i`;
  return im > 0 ? `${re}+${imPart}` : `${re}-${imPart}`;
};

// "t1 + t2" display string with correct sign handling: "1 + i", "1 - i"
const fmtSum = (a, b) => {
  const sa = fmtC(a);
  const sb = fmtC(b);
  return sb.startsWith("-") ? `${sa} - ${sb.slice(1)}` : `${sa} + ${sb}`;
};

const SCALAR_NUM = { "1/√2": Math.SQRT1_2, "1/2": 0.5 };
const scalarNum = (s) => (s ? SCALAR_NUM[s] : 1);

// 1/√2 × 1/√2 = 1/2 (only the Hadamard gate and superposition states carry scalars)
const combineGateScalars = (gateScalar, stateScalar) =>
  gateScalar && stateScalar ? "1/2" : gateScalar || stateScalar || null;

// Row-by-row dot product of the 2x2 gate matrix with the 2x1 state vector
const computeStepRows = (gate, prevState) => {
  const v = prevState.matrix.map((row) =>
    parseEntry(Array.isArray(row) ? row[0] : row)
  );
  const vStr = prevState.matrix.map((row) =>
    Array.isArray(row) ? row[0] : row
  );
  return [0, 1].map((r) => {
    const g0 = gate.matrix[r][0];
    const g1 = gate.matrix[r][1];
    const t1 = mulC(parseEntry(g0), v[0]);
    const t2 = mulC(parseEntry(g1), v[1]);
    const value = addC(t1, t2);
    const sumStr = fmtSum(t1, t2);
    const valStr = fmtC(value);
    // Skip the trailing "= value" when the sum already IS the value (e.g. "1 + i")
    const tail =
      sumStr.replace(/\s/g, "") === valStr.replace(/\s/g, "")
        ? ""
        : ` = ${valStr}`;
    return {
      line: `(${g0})(${vStr[0]}) + (${g1})(${vStr[1]}) = ${sumStr}${tail}`,
      value,
    };
  });
};

// Convert a result vector into ket form: a|0⟩ + b|1⟩ (with optional scalar)
const coeffTerm = (coeff, ket) => {
  if (coeff === "0") return null;
  if (coeff === "1") return { neg: false, body: ket };
  if (coeff === "-1") return { neg: true, body: ket };
  if (coeff === "i") return { neg: false, body: `i${ket}` };
  if (coeff === "-i") return { neg: true, body: `i${ket}` };
  return { neg: false, body: `${coeff}${ket}` };
};

const ketDecomposition = (resultMatrix, resultScalar) => {
  const a = Array.isArray(resultMatrix[0]) ? resultMatrix[0][0] : resultMatrix[0];
  const b = Array.isArray(resultMatrix[1]) ? resultMatrix[1][0] : resultMatrix[1];
  const t0 = coeffTerm(a, "|0⟩");
  const t1 = coeffTerm(b, "|1⟩");
  let inner;
  if (t0 && t1) {
    inner = `${t0.neg ? "-" : ""}${t0.body} ${t1.neg ? "-" : "+"} ${t1.body}`;
  } else {
    const t = t0 || t1;
    inner = `${t.neg ? "-" : ""}${t.body}`;
  }
  return resultScalar ? `${resultScalar}( ${inner} )` : inner;
};

// Show the intermediate computational-basis expansion before using ket notation.
// For example, [1, 1]ᵀ becomes [1, 0]ᵀ + [0, 1]ᵀ.
const basisVectorTerms = (resultMatrix) =>
  resultMatrix
    .map((row, index) => ({
      coefficient: Array.isArray(row) ? row[0] : row,
      vector: index === 0 ? [["1"], ["0"]] : [["0"], ["1"]],
    }))
    .filter(({ coefficient }) => coefficient !== "0");

// When both vector entries share a phase factor (e.g. [-i, i] = -i·[1, -1]),
// show the factored form: "-i · 1/√2( |0⟩ - |1⟩ )"
const factorOutPhase = (resultMatrix, resultScalar) => {
  const a = Array.isArray(resultMatrix[0]) ? resultMatrix[0][0] : resultMatrix[0];
  const b = Array.isArray(resultMatrix[1]) ? resultMatrix[1][0] : resultMatrix[1];
  if (!resultScalar || a === "0" || b === "0" || a === "1") return null;
  const ea = parseEntry(a);
  const eb = parseEntry(b);
  // eb / ea (ea is a unit complex number, so |ea|^2 = 1)
  const div = {
    re: eb.re * ea.re + eb.im * ea.im,
    im: eb.im * ea.re - eb.re * ea.im,
  };
  const t = coeffTerm(fmtC(div), "|1⟩");
  if (!t) return null;
  return `${a} · ${resultScalar}( |0⟩ ${t.neg ? "-" : "+"} ${t.body} )`;
};

// Compute the global phase between the raw product and the final state vector
// (raw = phase × final). Returns an exact label, or null when there is none.
// This applies to every gate uniformly — Hadamard on |±i⟩, Pauli-Y on |-i⟩,
// and the exact Rz(±π/2) rotations.
const ratioPhaseNote = (rows, combinedScalar, resultMatrix, resultScalar) => {
  const k1 = scalarNum(combinedScalar);
  const k2 = scalarNum(resultScalar);
  for (let i = 0; i < rows.length; i++) {
    const entry = Array.isArray(resultMatrix[i]) ? resultMatrix[i][0] : resultMatrix[i];
    const t = parseEntry(entry);
    if (t.re === 0 && t.im === 0) continue;
    const rawRe = k1 * rows[i].value.re;
    const rawIm = k1 * rows[i].value.im;
    const tgtRe = k2 * t.re;
    const tgtIm = k2 * t.im;
    const denom = tgtRe * tgtRe + tgtIm * tgtIm;
    const pr = (rawRe * tgtRe + rawIm * tgtIm) / denom;
    const pi = (rawIm * tgtRe - rawRe * tgtIm) / denom;
    if (Math.abs(pr - 1) < 1e-9 && Math.abs(pi) < 1e-9) return null; // no phase difference
    // A ratio between two unit-norm states must itself have unit modulus
    if (Math.abs(Math.hypot(pr, pi) - 1) > 1e-9) {
      return "a constant phase factor";
    }
    const label = fmtC({ re: pr, im: pi });
    const exponential = {
      "-1": "e^{iπ}",
      i: "e^{iπ/2}",
      "-i": "e^{-iπ/2}",
    }[label];
    return exponential ? `${label} ( = ${exponential} )` : label;
  }
  return null;
};

// Build every line of the worked calculation for one applied gate step
function buildStepCalc(step) {
  const rows = computeStepRows(step.gate, step.prevState);
  const combinedScalar = combineGateScalars(step.gate.scalar, step.prevState.scalar);
  const rawStrings = rows.map((r) => fmtC(r.value));
  const finalEntries = step.resultMatrix.map((row) =>
    Array.isArray(row) ? row[0] : row
  );
  const sameAsFinal =
    combinedScalar === step.resultScalar &&
    rawStrings.every((s, i) => s === finalEntries[i]);
  const showRawResult = !sameAsFinal;
  // Raw product vs physical state may differ by a global phase
  // (Hadamard on |±i⟩, Pauli-Y on |-i⟩) — physically irrelevant
  const phaseNote = showRawResult
    ? ratioPhaseNote(rows, combinedScalar, step.resultMatrix, step.resultScalar)
    : null;

  return {
    rows,
    combinedScalar,
    rawStrings,
    showRawResult,
    phaseNote,
    showScalarCombine: Boolean(step.gate.scalar && step.prevState.scalar),
    basisTerms: basisVectorTerms(step.resultMatrix),
    decomposition: ketDecomposition(step.resultMatrix, step.resultScalar),
    factorLine: factorOutPhase(step.resultMatrix, step.resultScalar),
  };
}

function GateGroup({ title, description, group, activeGateId, isLimitReached, currentState, onApply }) {
  return (
    <details className="gate-group" open>
      <summary>
        <span>{title}</span>
        <small>{description}</small>
      </summary>
      <div className="gates-simple-list">
        {GATES.filter((gate) => gate.group === group).map((gate) => {
          const isSelected = activeGateId === gate.id;
          return (
            <div key={gate.id} className="gate-item-row">
              <button
                className={`square-gate-btn ${isSelected ? "active" : ""} ${isLimitReached ? "disabled" : ""}`}
                onClick={() => onApply(gate)}
                disabled={isLimitReached}
                title={
                  isLimitReached
                    ? `Maximum ${MAX_GATES} operations reached. Reset to |0⟩ to continue.`
                    : `Apply ${gate.name} to ${currentState.symbol}`
                }
              >
                {gate.buttonLabel || gate.label}
              </button>
              {gate.angle && <span className="rotation-angle">{gate.angle}</span>}
              <div className="gate-matrix-display">
                <TextbookMatrix matrix={gate.matrix} scalar={gate.scalar} />
              </div>
              {(gate.exactForm || gate.exactNote) && (
                <div className="gate-exact-form">
                  {gate.exactForm && (
                    <span className="exact-form-line">{gate.exactForm}</span>
                  )}
                  {gate.exactNote && (
                    <span className="exact-note-line">{gate.exactNote}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </details>
  );
}

function App() {
  const [currentState, setCurrentState] = useState(STATES["0"]);
  // Full history of applied gate steps — each new calculation is appended
  // below the previous one in the Math Breakdown panel (never replaced).
  const [steps, setSteps] = useState([]);
  const [activeGateId, setActiveGateId] = useState(null);
  const [showMatricesModal, setShowMatricesModal] = useState(false);
  const mathWindowRef = useRef(null);

  const gateCount = steps.length;

  // Auto-scroll the Math Breakdown window so the newest step is visible
  useEffect(() => {
    const el = mathWindowRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [steps.length]);

  const handleGateClick = (gate) => {
    if (gateCount >= MAX_GATES) {
      return;
    }

    const transition = STEP_TRANSITIONS[currentState.id]?.[gate.id];
    if (!transition) return;

    const nextState = STATES[transition.nextId];
    const stepRecord = {
      stepNumber: gateCount + 1,
      gate,
      prevState: currentState,
      nextState,
      resultMatrix: transition.resultMatrix,
      resultScalar: transition.resultScalar,
      resultSymbol: transition.symbol,
    };

    setCurrentState(nextState);
    setSteps((prev) => [...prev, stepRecord]);
    setActiveGateId(gate.id);
  };

  const handleReset = () => {
    setCurrentState(STATES["0"]);
    setSteps([]);
    setActiveGateId(null);
  };

  const isLimitReached = gateCount >= MAX_GATES;

  return (
    <div className="layout">
      {/* 1. Leftmost Container: Bloch Sphere Visualization */}
      <div className="left-panel">
        <div className="panel-header">
          <div className="bloch-title-wrap">
            <h2 className="panel-heading">Bloch Sphere</h2>
            <button
              className="matrices-trigger-btn"
              onClick={() => setShowMatricesModal(true)}
              title="Open Quantum States & Gate Matrices Reference"
            >
              MATRICES
            </button>
          </div>
        </div>

        <div className="bloch-canvas-wrapper">
          <BlochSphere stateVector={currentState.blochVector} />
        </div>
      </div>

      {/* 2. Centre Container: Quantum Gates (Clean, square buttons + matrices) */}
      <div className="middle-panel">
        <div className="panel-header">
          <h2 className="panel-heading">Quantum Gates</h2>
        </div>

        {/* Step tracker showing sequence progress */}
        <div className="gate-sequence-tracker">
          <span className="tracker-counter">
            Step <strong>{gateCount}</strong> of <strong>{MAX_GATES}</strong>
          </span>
          <span className="tracker-state-pill">
            State: <strong>{currentState.symbol}</strong>
          </span>
        </div>

        {/* Applied gate sequence trail */}
        {gateCount > 0 && (
          <div className="gate-sequence-trail">
            <span className="trail-label">Sequence:</span>
            <span className="trail-gates">
              |0⟩
              {steps.map((s) => (
                <span key={s.stepNumber} className="trail-step">
                  {" "}—<span className="trail-gate">{s.gate.label}</span>→
                </span>
              ))}
              {" "}
              <strong>{currentState.symbol}</strong>
            </span>
          </div>
        )}

        {isLimitReached && (
          <div className="limit-warning-badge">
            <span>⚠️ Max {MAX_GATES} operations reached. Reset to |0⟩ to continue.</span>
          </div>
        )}

        <GateGroup
          title="Quantum Gates"
          description="H, Pauli, and phase gates"
          group="gates"
          activeGateId={activeGateId}
          isLimitReached={isLimitReached}
          currentState={currentState}
          onApply={handleGateClick}
        />
        <GateGroup
          title="Rotations Around Default Axes"
          description="±π/2 around X, Y, and Z; Z uses S / S†"
          group="rotations"
          activeGateId={activeGateId}
          isLimitReached={isLimitReached}
          currentState={currentState}
          onApply={handleGateClick}
        />
      </div>

      {/* 3. Rightmost Container: Scrollable Math Breakdown */}
      <div className="right-panel">
        <div className="panel-header">
          <h2 className="panel-heading">Math Breakdown</h2>
          <button className="reset-state-btn" onClick={handleReset} title="Reset qubit to |0⟩ ground state">
            ↺ Reset to |0⟩
          </button>
        </div>

        {/* Inner Scrollable Window — Single black container with white text */}
        <div className="math-scroll-window" ref={mathWindowRef}>
          {/* Initial State — always visible at the top */}
          <div className="math-section-block">
            <div className="active-gate-badge-row">
              <span className="gate-tag-badge">Initial State</span>
            </div>
            <div className="textbook-equation-card">
              <span className="math-var">|ψ⟩ = |0⟩ =</span>
              <TextbookMatrix matrix={[["1"], ["0"]]} />
            </div>
          </div>

          {/* Gate multiplication history — every applied gate stacks vertically,
              step 2 appears below step 1, step 3 below step 2, and so on. */}
          {steps.map((step) => {
            const calc = buildStepCalc(step);
            return (
              <div className="math-section-block" key={step.stepNumber}>
                <div className="active-gate-badge-row">
                  <span className="gate-tag-badge">
                    Step {step.stepNumber} — {step.gate.name} ({step.gate.label})
                  </span>
                </div>
                <div className="textbook-equation-card equation-column">
                  {/* 1. LHS: gate label applied to previous state */}
                  <div className="equation-line">
                    <span className="math-var">
                      {step.gate.label} {step.prevState.symbol} =
                    </span>
                  </div>

                  {/* 2. Gate Matrix · Previous State Vector */}
                  <div className="equation-line">
                    <TextbookMatrix
                      matrix={step.gate.matrix}
                      scalar={step.gate.scalar}
                    />
                    <span className="math-symbol">·</span>
                    <TextbookMatrix
                      matrix={step.prevState.matrix}
                      scalar={step.prevState.scalar}
                    />
                  </div>

                  {/* 3. Combine the two 1/√2 scalar factors first */}
                  {calc.showScalarCombine && (
                    <div className="equation-line calc-sub-line">
                      <span className="eq-equals">=</span>
                      <span className="calc-text">
                        (1/√2 × 1/√2 = 1/2) — combine the scalars, then multiply
                      </span>
                    </div>
                  )}

                  {/* 4. Row-by-row dot product expansion */}
                  {calc.rows.map((row, idx) => (
                    <div className="equation-line calc-sub-line" key={idx}>
                      <span className="calc-text">
                        r{idx === 0 ? "₁" : "₂"} = {row.line}
                      </span>
                    </div>
                  ))}

                  {/* 5. Raw (unsimplified) product — only when it differs from the final form */}
                  {calc.showRawResult && (
                    <div className="equation-line">
                      <span className="eq-equals">=</span>
                      <TextbookMatrix
                        matrix={calc.rawStrings.map((s) => [s])}
                        scalar={calc.combinedScalar}
                      />
                    </div>
                  )}

                  {/* 6. Final result vector */}
                  <div className="equation-line">
                    <span className="eq-equals">=</span>
                    <TextbookMatrix
                      matrix={step.resultMatrix}
                      scalar={step.resultScalar}
                    />
                  </div>

                  {/* 6b. Global phase note (Hadamard on |±i⟩) */}
                  {calc.phaseNote && (
                    <div className="equation-line calc-sub-line">
                      <span className="calc-note">
                        ⤷ the raw product differs only by a global phase {calc.phaseNote} — physically the same state
                      </span>
                    </div>
                  )}

                  {/* 7. Expand the column vector in the computational basis */}
                  <div className="equation-line calc-sub-line basis-vector-line">
                    <span className="eq-equals">=</span>
                    {step.resultScalar && (
                      <span className="calc-text">{step.resultScalar}(</span>
                    )}
                    {calc.basisTerms.map((term, index) => {
                      const isNegative = term.coefficient.startsWith("-");
                      const magnitude = isNegative
                        ? term.coefficient.slice(1)
                        : term.coefficient;
                      return (
                        <React.Fragment key={index}>
                          {index > 0 && (
                            <span className="calc-text">{isNegative ? "−" : "+"}</span>
                          )}
                          {index === 0 && isNegative && (
                            <span className="calc-text">−</span>
                          )}
                          {magnitude !== "1" && (
                            <span className="calc-text">{magnitude}·</span>
                          )}
                          <TextbookMatrix matrix={term.vector} />
                        </React.Fragment>
                      );
                    })}
                    {step.resultScalar && <span className="calc-text">)</span>}
                  </div>

                  {/* 8. Convert the computational basis vectors into ket form */}
                  <div className="equation-line calc-sub-line">
                    <span className="eq-equals">=</span>
                    <span className="calc-text">{calc.decomposition}</span>
                  </div>

                  {/* 8b. Factor out a shared phase when present */}
                  {calc.factorLine && (
                    <div className="equation-line calc-sub-line">
                      <span className="eq-equals">=</span>
                      <span className="calc-text">{calc.factorLine}</span>
                      <span className="calc-hint-inline">( factor out the phase )</span>
                    </div>
                  )}

                  {/* 9. Resultant State Symbol */}
                  <div className="equation-line">
                    <span className="eq-equals">=</span>
                    <span className="result-state-symbol">
                      {step.resultSymbol}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Sequence limit notice */}
          {isLimitReached && (
            <div className="gate-limit-alert">
              <span className="alert-title">⚠️ Sequence Limit Reached</span>
              <p className="alert-text">
                {MAX_GATES} operations are shown at once to keep the worked mathematics readable. Reset to <strong>|0⟩</strong> to start a fresh calculation.
              </p>
              <button className="alert-reset-action-btn" onClick={handleReset}>
                ↺ Reset to |0⟩ Ground State
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MATRICES Pop-up Reference Modal */}
      <MatricesModal
        isOpen={showMatricesModal}
        onClose={() => setShowMatricesModal(false)}
      />
    </div>
  );
}

export default App;

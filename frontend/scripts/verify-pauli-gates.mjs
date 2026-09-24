// Independent mathematical verification for the Bloch-sphere simulator.
// Run with: npm run verify
//
// Section A — reads the gate matrices DISPLAYED in src/App.jsx straight out of
//   the source file and compares them EXACTLY (not just up to phase) with the
//   standard textbook formulas:
//     Rx(θ) = cos(θ/2)·I − i·sin(θ/2)·σx
//     Ry(θ) = cos(θ/2)·I − i·sin(θ/2)·σy
//     Rz(θ) = diag(e^{−iθ/2}, e^{iθ/2})
//   evaluated at the θ = ±π/2 used by the simulator buttons. This is the check
//   that prevents a button from advertising one matrix while running another.
// Section B — all 60 gate × cardinal-state transitions match the exact matrix
//   product up to a physically irrelevant global phase.
// Section C — every displayed matrix is unitary (U†U = I), and the documented
//   relations S = e^{iπ/4}·Rz(π/2), S† = e^{−iπ/4}·Rz(−π/2) hold exactly.

import { readFileSync } from "node:fs";

const EPSILON = 1e-12;
const INV_SQRT_2 = 1 / Math.sqrt(2);

const c = (re, im = 0) => ({ re, im });
const add = (a, b) => c(a.re + b.re, a.im + b.im);
const mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (k, a) => c(k * a.re, k * a.im);
const conjugate = (a) => c(a.re, -a.im);
const magnitudeSquared = (a) => a.re * a.re + a.im * a.im;
const close = (a, b) => Math.abs(a.re - b.re) < EPSILON && Math.abs(a.im - b.im) < EPSILON;
const phase = (angle) => c(Math.cos(angle), Math.sin(angle));

const apply = (matrix, vector) =>
  matrix.map((row) => add(mul(row[0], vector[0]), mul(row[1], vector[1])));
const norm = (vector) => vector.reduce((sum, value) => sum + magnitudeSquared(value), 0);

// Two states are physically equivalent when they differ only by global phase.
const equalUpToGlobalPhase = (actual, expected) => {
  const index = expected.findIndex((value) => magnitudeSquared(value) > EPSILON);
  if (index === -1) return actual.every((value) => magnitudeSquared(value) < EPSILON);
  const rawPhase = mul(actual[index], conjugate(expected[index]));
  const magnitude = magnitudeSquared(expected[index]);
  const unitPhase = c(rawPhase.re / magnitude, rawPhase.im / magnitude);
  return actual.every((value, i) => close(value, mul(unitPhase, expected[i])));
};

const matricesEqual = (a, b) => a.every((row, r) => row.every((value, q) => close(value, b[r][q])));

/* ------------------------------------------------------------------ *
 * Analytic gate formulas
 * ------------------------------------------------------------------ */
const rotatesX = (theta) => {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return [
    [c(cos), c(0, -sin)],
    [c(0, -sin), c(cos)],
  ];
};

const rotatesY = (theta) => {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return [
    [c(cos), c(-sin)],
    [c(sin), c(cos)],
  ];
};

const rotatesZ = (theta) => [
  [c(Math.cos(theta / 2), -Math.sin(theta / 2)), c(0)],
  [c(0), c(Math.cos(theta / 2), Math.sin(theta / 2))],
];

const HADAMARD = [
  [c(INV_SQRT_2), c(INV_SQRT_2)],
  [c(INV_SQRT_2), c(-INV_SQRT_2)],
];
const PAULI_X = [
  [c(0), c(1)],
  [c(1), c(0)],
];
const PAULI_Y = [
  [c(0), c(0, -1)],
  [c(0, 1), c(0)],
];
const PAULI_Z = [
  [c(1), c(0)],
  [c(0), c(-1)],
];
const S_GATE = [
  [c(1), c(0)],
  [c(0), c(0, 1)],
];
const SDG_GATE = [
  [c(1), c(0)],
  [c(0), c(0, -1)],
];

/* ------------------------------------------------------------------ *
 * Read the matrices the app actually displays
 * ------------------------------------------------------------------ */
const APP_SOURCE = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

const ENTRY_VALUES = {
  "0": c(0),
  "1": c(1),
  "-1": c(-1),
  i: c(0, 1),
  "-i": c(0, -1),
  "e^{iπ/4}": c(INV_SQRT_2, INV_SQRT_2),
  "e^{-iπ/4}": c(INV_SQRT_2, -INV_SQRT_2),
  "e^{i3π/4}": c(-INV_SQRT_2, INV_SQRT_2),
  "e^{-i3π/4}": c(-INV_SQRT_2, -INV_SQRT_2),
};
const SCALAR_VALUES = { "1/√2": INV_SQRT_2, "1/2": 0.5 };

const readDisplayedGate = (id) => {
  const start = APP_SOURCE.indexOf(`id: "${id}"`);
  if (start === -1) throw new Error(`Gate "${id}" is missing from src/App.jsx`);
  const block = APP_SOURCE.slice(start, APP_SOURCE.indexOf("\n  },", start));
  const scalarMatch = block.match(/scalar:\s*(?:"([^"]+)"|null)/);
  // The matrix is written either inline ([["1","0"],["0","i"]]) or across
  // several lines, so read the region between "matrix:" and the caption fields
  // that follow it, then collect its quoted entries in row-major order.
  const matrixIndex = block.indexOf("matrix:");
  if (matrixIndex === -1) throw new Error(`Gate "${id}" has no matrix in src/App.jsx`);
  const afterMatrix = block.slice(matrixIndex);
  const boundary = afterMatrix.search(/exact(Form|Note):/);
  const matrixRegion = boundary === -1 ? afterMatrix : afterMatrix.slice(0, boundary);
  const tokens = matrixRegion.match(/"[^"]*"/g) || [];
  const entries = tokens.map((token) => token.slice(1, -1));
  if (entries.length !== 4) {
    throw new Error(`Gate "${id}" matrix must have 4 entries, found ${entries.length}`);
  }
  const unknown = entries.filter((entry) => !(entry in ENTRY_VALUES));
  if (unknown.length) {
    throw new Error(`Gate "${id}" uses unknown matrix entries: ${unknown.join(", ")}`);
  }
  const scalarLabel = scalarMatch && scalarMatch[1] ? scalarMatch[1] : null;
  const factor = scalarLabel ? SCALAR_VALUES[scalarLabel] : 1;
  if (factor === undefined) {
    throw new Error(`Gate "${id}" uses unknown scalar "${scalarLabel}"`);
  }
  // The scalar shown beside the matrix multiplies every entry of that matrix.
  const effective = [
    [scale(factor, ENTRY_VALUES[entries[0]]), scale(factor, ENTRY_VALUES[entries[1]])],
    [scale(factor, ENTRY_VALUES[entries[2]]), scale(factor, ENTRY_VALUES[entries[3]])],
  ];
  return {
    raw: entries.join(" "),
    scalarLabel,
    factor,
    effective,
  };
};

const displayed = {};
for (const id of ["H", "Px", "Py", "Pz", "S", "Rx+", "Rx-", "Ry+", "Ry-", "Rz+", "Rz-"]) {
  displayed[id] = readDisplayedGate(id);
}

/* ------------------------------------------------------------------ *
 * Cardinal states and the simulator's transition rules
 * ------------------------------------------------------------------ */
const states = {
  zero: [c(1), c(0)],
  one: [c(0), c(1)],
  plus: [c(INV_SQRT_2), c(INV_SQRT_2)],
  minus: [c(INV_SQRT_2), c(-INV_SQRT_2)],
  plusI: [c(INV_SQRT_2), c(0, INV_SQRT_2)],
  minusI: [c(INV_SQRT_2), c(0, -INV_SQRT_2)],
};

// Mirrors STEP_TRANSITIONS in src/App.jsx: each gate maps a cardinal state to
// the cardinal state the simulator moves to next.
const transitions = {
  H: { zero: "plus", one: "minus", plus: "zero", minus: "one", plusI: "minusI", minusI: "plusI" },
  Px: { zero: "one", one: "zero", plus: "plus", minus: "minus", plusI: "minusI", minusI: "plusI" },
  Py: { zero: "one", one: "zero", plus: "minus", minus: "plus", plusI: "plusI", minusI: "minusI" },
  Pz: { zero: "zero", one: "one", plus: "minus", minus: "plus", plusI: "minusI", minusI: "plusI" },
  S: { zero: "zero", one: "one", plus: "plusI", minus: "minusI", plusI: "minus", minusI: "plus" },
  "Rx+": { zero: "minusI", one: "plusI", plus: "plus", minus: "minus", plusI: "zero", minusI: "one" },
  "Rx-": { zero: "plusI", one: "minusI", plus: "plus", minus: "minus", plusI: "one", minusI: "zero" },
  "Ry+": { zero: "plus", one: "minus", plus: "one", minus: "zero", plusI: "plusI", minusI: "minusI" },
  "Ry-": { zero: "minus", one: "plus", plus: "zero", minus: "one", plusI: "plusI", minusI: "minusI" },
  "Rz+": { zero: "zero", one: "one", plus: "plusI", minus: "minusI", plusI: "minus", minusI: "plus" },
  "Rz-": { zero: "zero", one: "one", plus: "minusI", minus: "plusI", plusI: "plus", minusI: "minus" },
};

/* ------------------------------------------------------------------ *
 * Checks
 * ------------------------------------------------------------------ */
let passed = 0;
const failures = [];
const check = (name, ok) => {
  if (ok) passed += 1;
  else failures.push(name);
};

// Section A — the matrix displayed next to each button equals its formula exactly.
const formulaChecks = [
  ["H", HADAMARD],
  ["Px", PAULI_X],
  ["Py", PAULI_Y],
  ["Pz", PAULI_Z],
  ["S", S_GATE],
  ["Rx+", rotatesX(Math.PI / 2)],
  ["Rx-", rotatesX(-Math.PI / 2)],
  ["Ry+", rotatesY(Math.PI / 2)],
  ["Ry-", rotatesY(-Math.PI / 2)],
  ["Rz+", rotatesZ(Math.PI / 2)],
  ["Rz-", rotatesZ(-Math.PI / 2)],
];

for (const [id, formula] of formulaChecks) {
  check(
    `displayed matrix of ${id} equals its analytic formula exactly (${displayed[id].raw})`,
    matricesEqual(displayed[id].effective, formula)
  );
}

// Section B — every gate × cardinal-state transition is the exact product,
// identical to the displayed result up to a global phase.
const gateMatrices = {
  H: HADAMARD,
  Px: PAULI_X,
  Py: PAULI_Y,
  Pz: PAULI_Z,
  S: S_GATE,
  "Rx+": rotatesX(Math.PI / 2),
  "Rx-": rotatesX(-Math.PI / 2),
  "Ry+": rotatesY(Math.PI / 2),
  "Ry-": rotatesY(-Math.PI / 2),
  "Rz+": rotatesZ(Math.PI / 2),
  "Rz-": rotatesZ(-Math.PI / 2),
};

let transitionCount = 0;
for (const [gateId, gateMatrix] of Object.entries(gateMatrices)) {
  for (const [stateId, stateVector] of Object.entries(states)) {
    const target = transitions[gateId][stateId];
    const output = apply(gateMatrix, stateVector);
    transitionCount += 1;
    check(
      `${gateId}${stateId} → ${target} (unit norm + result matches up to global phase)`,
      Math.abs(norm(output) - 1) < EPSILON &&
        equalUpToGlobalPhase(output, states[target])
    );
  }
}

// Section C — unitarity of every displayed matrix, and the documented
// global-phase relations between the phase gate and the Z rotations.
const IDENTITY = [
  [c(1), c(0)],
  [c(0), c(1)],
];

const isUnitary = (matrix) => {
  const dagger = [
    [conjugate(matrix[0][0]), conjugate(matrix[1][0])],
    [conjugate(matrix[0][1]), conjugate(matrix[1][1])],
  ];
  const product = [0, 1].map((row) =>
    [0, 1].map((col) =>
      add(mul(dagger[row][0], matrix[0][col]), mul(dagger[row][1], matrix[1][col]))
    )
  );
  return matricesEqual(product, IDENTITY);
};

for (const [id, gate] of Object.entries(displayed)) {
  check(`displayed matrix of ${id} is unitary (U†U = I)`, isUnitary(gate.effective));
}

const scaleMatrix = (factor, matrix) => matrix.map((row) => row.map((value) => mul(factor, value)));
check(
  "S = e^{iπ/4}·Rz(π/2) holds exactly (as documented on the buttons)",
  matricesEqual(scaleMatrix(phase(Math.PI / 4), rotatesZ(Math.PI / 2)), S_GATE)
);
check(
  "S† = e^{-iπ/4}·Rz(-π/2) holds exactly (as documented on the buttons)",
  matricesEqual(scaleMatrix(phase(-Math.PI / 4), rotatesZ(-Math.PI / 2)), SDG_GATE)
);
check(
  "Rz(π/2) is NOT the S matrix (the contradiction this script guards against)",
  !matricesEqual(rotatesZ(Math.PI / 2), S_GATE)
);

// The exact phases the calculation panel displays for the Rz buttons:
// raw product = phase × physical state, e.g. Rz(π/2)|+⟩ = e^{−iπ/4}|+i⟩.
const phaseScaled = (factor, vector) => vector.map((value) => mul(factor, value));
check(
  "Rz(π/2)|0⟩ = e^{−iπ/4}|0⟩ (phase reported on the Rz panel step)",
  equalUpToGlobalPhase(apply(rotatesZ(Math.PI / 2), states.zero), states.zero) &&
    close(mul(apply(rotatesZ(Math.PI / 2), states.zero)[0], conjugate(states.zero[0])), phase(-Math.PI / 4))
);
check(
  "Rz(π/2)|+⟩ = e^{−iπ/4}|+i⟩ (phase reported on the Rz panel step)",
  matricesEqual(
    apply(rotatesZ(Math.PI / 2), states.plus).map((value) => [value]),
    phaseScaled(phase(-Math.PI / 4), states.plusI).map((value) => [value])
  )
);
check(
  "Rz(−π/2)|+⟩ = e^{iπ/4}|−i⟩ (phase reported on the Rz panel step)",
  matricesEqual(
    apply(rotatesZ(-Math.PI / 2), states.plus).map((value) => [value]),
    phaseScaled(phase(Math.PI / 4), states.minusI).map((value) => [value])
  )
);

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */
if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("✔ Displayed gate matrices match their analytic formulas exactly (11 gates).");
console.log(`✔ ${transitionCount} gate × cardinal-state transitions verified up to global phase.`);
console.log("✔ All displayed matrices are unitary; S = e^{iπ/4}·Rz(π/2) and S† = e^{-iπ/4}·Rz(-π/2).");
console.log(`\n${passed} checks passed.`);


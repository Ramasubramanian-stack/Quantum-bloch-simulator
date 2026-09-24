import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./QuantumGatesReference.css";

/**
 * Quantum Gates Reference Window
 *
 * Pedagogical order for every rotation gate:
 *   1. General formula  — the exact algebraic matrix (BlockMath).
 *   2. Evaluated instances — how that formula reads at θ = ±π/2, i.e. the
 *      concrete matrices the simulator's rotation buttons actually apply.
 *   3. "Why it works"   — 1–2 sentences connecting (1) to (2).
 */
const ROTATION_GATES = [
  {
    id: "rx",
    title: "Rx(θ) — rotation about the X axis",
    general: String.raw`\begin{pmatrix} \cos(\theta/2) & -i\,\sin(\theta/2) \\ -i\,\sin(\theta/2) & \cos(\theta/2) \end{pmatrix}`,
    instances: [
      {
        label: "θ = +π/2  ·  simulator button Rx",
        math: String.raw`\frac{1}{\sqrt{2}}\begin{pmatrix} 1 & -i \\ -i & 1 \end{pmatrix}`,
      },
      {
        label: "θ = −π/2  ·  simulator button Rx",
        math: String.raw`\frac{1}{\sqrt{2}}\begin{pmatrix} 1 & i \\ i & 1 \end{pmatrix}`,
      },
    ],
    why: [
      "For θ = π/2 the half-angle becomes π/4, and since cos(π/4) = sin(π/4) = 1/√2, we factor 1/√2 out front to get the clean matrix above.",
      "The −i entries are simply sin(π/4) multiplied by −i — no phase is hidden anywhere.",
    ],
  },
  {
    id: "ry",
    title: "Ry(θ) — rotation about the Y axis",
    general: String.raw`\begin{pmatrix} \cos(\theta/2) & -\sin(\theta/2) \\ \sin(\theta/2) & \cos(\theta/2) \end{pmatrix}`,
    instances: [
      {
        label: "θ = +π/2  ·  simulator button Ry",
        math: String.raw`\frac{1}{\sqrt{2}}\begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}`,
      },
      {
        label: "θ = −π/2  ·  simulator button Ry",
        math: String.raw`\frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix}`,
      },
    ],
    why: [
      "For θ = π/2, cos(π/4) = sin(π/4) = 1/√2, so again we pull 1/√2 out front.",
      "Only the off-diagonal signs differ between +π/2 and −π/2 — that sign flip is what reverses the direction the arrow travels around the Y axis.",
    ],
  },
  {
    id: "rz",
    title: "Rz(θ) — rotation about the Z axis",
    general: String.raw`\begin{pmatrix} e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2} \end{pmatrix}`,
    instances: [
      {
        label: "θ = +π/2  ·  simulator button Rz",
        math: String.raw`\operatorname{diag}\!\left(e^{-i\pi/4},\; e^{i\pi/4}\right)`,
      },
      {
        label: "θ = −π/2  ·  simulator button Rz",
        math: String.raw`\operatorname{diag}\!\left(e^{i\pi/4},\; e^{-i\pi/4}\right)`,
      },
    ],
    why: [
      <>
        For θ = π/2 the half-angle is π/4, so the diagonal entries are exactly{" "}
        <InlineMath math="e^{\pm i\pi/4}" />.
      </>,
      <>
        Factoring one phase out gives{" "}
        <InlineMath math="\mathrm{Rz}(\pi/2) = e^{-i\pi/4}\,\mathrm{S}" /> — the
        same <InlineMath math="\mathrm{S} = \operatorname{diag}(1, i)" /> gate,
        up to the <strong>global phase</strong>{" "}
        <InlineMath math="e^{-i\pi/4}" />, which can never move the Bloch-sphere
        arrow.
      </>,
      "The calculation panel states this phase explicitly on every Rz step instead of hiding it.",
    ],
  },
];

function StepBadge({ number, children }) {
  return (
    <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#5eead4]">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#5eead4]/15 text-[0.6rem] text-[#5eead4]">
        {number}
      </span>
      {children}
    </span>
  );
}

function RotationGateCard({ gate }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d1428] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
      {/* 1 · General formula (exact algebra) */}
      <header className="flex flex-col gap-2">
        <StepBadge number="1">General formula</StepBadge>
        <h4 className="font-mono text-sm font-semibold text-[#f1f5f9]">
          {gate.title}
        </h4>
        <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/40 px-3 py-2 [&_.katex]:text-[1.05rem] [&_.katex]:text-[#f8fafc]">
          <BlockMath math={gate.general} errorColor="#f87171" />
        </div>
      </header>

      {/* 2 · Evaluated instances — exactly what the buttons apply */}
      <div className="flex flex-col gap-2">
        <StepBadge number="2">Evaluated at the button angles (θ = ±π/2)</StepBadge>
        <div className="grid grid-cols-1 gap-2 min-[19rem]:grid-cols-2">
          {gate.instances.map((instance) => (
            <figure
              key={instance.label}
              className="flex flex-col gap-1.5 rounded-lg border border-[#00bfa5]/25 bg-[#00bfa5]/5 px-2.5 py-2"
            >
              <figcaption className="text-[0.64rem] font-medium uppercase tracking-wide text-[#7dd3c0]">
                {instance.label}
              </figcaption>
              <div className="overflow-x-auto [&_.katex]:text-[0.98rem] [&_.katex]:text-[#f8fafc]">
                <BlockMath math={instance.math} errorColor="#f87171" />
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* 3 · Why it works — connects (1) to (2) */}
      <div className="flex flex-col gap-1.5 rounded-lg border-l-2 border-l-[#fbbf24] bg-[#fbbf24]/[0.07] px-3 py-2">
        <StepBadge number="3">Why it works</StepBadge>
        <ul className="flex flex-col gap-1.5">
          {gate.why.map((line, index) => (
            <li
              key={index}
              className="relative pl-4 text-[0.78rem] leading-relaxed text-[#cbd5e1] before:absolute before:left-1 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#fbbf24] [&_.katex]:text-[0.8rem]"
            >
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
        <p className="text-[0.78rem] leading-relaxed text-[#94a3b8]">
          Read top to bottom: the exact algebra first, then the numbers your
          buttons apply, then why the two are the same thing.
        </p>
        <p className="mt-0.5 flex items-start gap-1.5 text-[0.74rem] font-medium text-[#fbbf24]">
          <span aria-hidden="true">•</span>
          <span>Nothing is rounded and no phase is silently dropped.</span>
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {ROTATION_GATES.map((gate) => (
          <RotationGateCard key={gate.id} gate={gate} />
        ))}
      </div>
    </section>
  );
}


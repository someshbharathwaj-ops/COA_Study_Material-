import { useState, useEffect, useRef } from "react";
import FormulaBrain from "./FormulaBrain";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STAGES = ["IF", "ID", "EX", "MEM", "WB"];
const STAGE_COLORS = {
  IF:  { bg: "#0ea5e9", glow: "#0ea5e930", text: "#e0f2fe" },
  ID:  { bg: "#8b5cf6", glow: "#8b5cf630", text: "#ede9fe" },
  EX:  { bg: "#f59e0b", glow: "#f59e0b30", text: "#fef3c7" },
  MEM: { bg: "#10b981", glow: "#10b98130", text: "#d1fae5" },
  WB:  { bg: "#f43f5e", glow: "#f43f5e30", text: "#ffe4e6" },
};

const NAV_ITEMS = [
  { id: "intro",      label: "🚀 Intro",        icon: "🚀" },
  { id: "pipeline",   label: "⚙️ Pipeline",     icon: "⚙️" },
  { id: "stages",     label: "🔬 5 Stages",     icon: "🔬" },
  { id: "datapath",   label: "🗺 Datapath",     icon: "🗺" },
  { id: "hazards",    label: "⚠️ Hazards",      icon: "⚠️" },
  { id: "forwarding", label: "↩️ Forwarding",   icon: "↩️" },
  { id: "control",    label: "🎛 Control",      icon: "🎛" },
  { id: "simulator",  label: "🧪 Simulator",    icon: "🧪" },
  { id: "playground", label: "🎮 Playground",   icon: "🎮" },
  { id: "quiz",       label: "🧠 Quiz",         icon: "🧠" },
  { id: "formulas",   label: "📋 Formulas",     icon: "📋" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;600;800;900&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #060a14;
    --surface:   #0d1526;
    --surface2:  #112038;
    --border:    #1e3a5f;
    --border2:   #2a4a7f;
    --text:      #cbd5e1;
    --text2:     #94a3b8;
    --accent:    #00d4ff;
    --accent2:   #7c3aed;
    --warn:      #f59e0b;
    --danger:    #ef4444;
    --success:   #22c55e;
    --font-mono: 'Space Mono', monospace;
    --font-head: 'Orbitron', sans-serif;
    --font-body: 'IBM Plex Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.65;
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* Layout */
  .app { display: flex; min-height: 100vh; }

  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    position: fixed;
    top: 0; left: 0; bottom: 0;
    overflow-y: auto;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .sidebar-logo {
    padding: 24px 20px 16px;
    font-family: var(--font-head);
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--accent);
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
    line-height: 1.4;
  }
  .sidebar-logo span { display: block; font-size: 18px; font-weight: 900; letter-spacing: 1px; }

  .nav { padding: 12px 0; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text2);
    transition: all 0.2s;
    border-left: 3px solid transparent;
    font-family: var(--font-mono);
    white-space: nowrap;
  }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active { color: var(--accent); background: #001a2e; border-left-color: var(--accent); }

  .main {
    margin-left: 220px;
    flex: 1;
    min-height: 100vh;
  }

  .section {
    min-height: 100vh;
    padding: 60px 48px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse at 20% 10%, #0ea5e908 0%, transparent 60%);
    pointer-events: none;
  }

  h1 {
    font-family: var(--font-head);
    font-size: 36px;
    font-weight: 900;
    letter-spacing: 1px;
    color: #fff;
    margin-bottom: 8px;
  }
  h2 {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 16px;
    letter-spacing: 1px;
  }
  h3 {
    font-family: var(--font-head);
    font-size: 14px;
    font-weight: 600;
    color: var(--warn);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  p { color: var(--text2); line-height: 1.75; margin-bottom: 12px; }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .tag-blue   { background: #0ea5e920; color: #0ea5e9; border: 1px solid #0ea5e940; }
  .tag-purple { background: #7c3aed20; color: #a78bfa; border: 1px solid #7c3aed40; }
  .tag-amber  { background: #f59e0b20; color: #fbbf24; border: 1px solid #f59e0b40; }
  .tag-red    { background: #ef444420; color: #f87171; border: 1px solid #ef444440; }
  .tag-green  { background: #22c55e20; color: #4ade80; border: 1px solid #22c55e40; }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* Stage Badges */
  .stage-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 44px; height: 44px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
  }

  /* Pipeline Row */
  .pipe-row {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .pipe-label {
    width: 180px; flex-shrink: 0;
    color: var(--text2);
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 8px;
  }
  .pipe-cell {
    width: 56px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    margin: 0 1px;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .pipe-cell.empty { background: transparent; }
  .pipe-cell.stall { background: #374151; color: #6b7280; }
  .pipe-cell.bubble { background: #1f2937; color: #4b5563; border: 1px dashed #374151; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .btn-primary {
    background: var(--accent);
    color: #000;
    box-shadow: 0 0 20px #00d4ff40;
  }
  .btn-primary:hover { box-shadow: 0 0 30px #00d4ff60; transform: translateY(-1px); }
  .btn-secondary {
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--border2);
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger {
    background: #ef444420;
    color: #f87171;
    border: 1px solid #ef444440;
  }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }

  /* Code block */
  .code-block {
    background: #020c18;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 2;
    overflow-x: auto;
  }
  .code-block .kw  { color: #7c3aed; }
  .code-block .reg { color: #0ea5e9; }
  .code-block .num { color: #f59e0b; }
  .code-block .com { color: #4b5563; }

  /* Hazard highlight */
  .hl-raw    { color: #f87171; font-weight: 700; }
  .hl-fwd    { color: #4ade80; font-weight: 700; }
  .hl-stall  { color: #fbbf24; font-weight: 700; }
  .hl-ctrl   { color: #c084fc; font-weight: 700; }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    background: var(--surface2);
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1px;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--border2);
  }
  td {
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text2);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  tr:hover td { background: var(--surface2); }

  /* Signal chip */
  .sig {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
  }
  .sig-1 { background: #22c55e20; color: #4ade80; }
  .sig-0 { background: #ef444420; color: #f87171; }
  .sig-x { background: #37415120; color: #9ca3af; }

  /* Quiz */
  .quiz-opt {
    display: block; width: 100%;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .quiz-opt:hover { border-color: var(--accent); color: var(--accent); }
  .quiz-opt.correct { border-color: #22c55e; background: #22c55e15; color: #4ade80; }
  .quiz-opt.wrong   { border-color: #ef4444; background: #ef444415; color: #f87171; }

  /* Datapath SVG wrapper */
  .dp-wrap {
    background: #020c18;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    overflow-x: auto;
  }

  /* Register file viz */
  .reg-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    font-family: var(--font-mono);
    font-size: 10px;
  }
  .reg-cell {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px;
    text-align: center;
  }
  .reg-cell.active { border-color: var(--accent); background: #001a2e; }
  .reg-cell label { display: block; color: var(--text2); font-size: 9px; }
  .reg-cell span   { color: var(--warn); font-size: 11px; }

  /* Progress bar */
  .progress-bar {
    height: 4px;
    background: var(--surface2);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
  }
  .progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), #7c3aed);
    transition: width 0.5s ease;
  }

  /* Forwarding path */
  .fwd-path {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    margin-bottom: 8px;
  }
  .fwd-path.ex-ex   { background: #22c55e15; border: 1px solid #22c55e40; color: #4ade80; }
  .fwd-path.mem-ex  { background: #0ea5e915; border: 1px solid #0ea5e940; color: #38bdf8; }
  .fwd-path.stall   { background: #f59e0b15; border: 1px solid #f59e0b40; color: #fbbf24; }

  /* Glow text */
  .glow { text-shadow: 0 0 20px currentColor; }

  /* Animated pipeline flow */
  @keyframes flow {
    0%   { transform: translateX(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(0); opacity: 0; }
  }

  @keyframes pulse-border {
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    50%       { box-shadow: 0 0 0 3px var(--accent); }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .blink { animation: blink 1.2s infinite; }

  /* Responsive collapse */
  @media (max-width: 900px) {
    .sidebar { width: 60px; }
    .sidebar-logo, .nav-item span { display: none; }
    .main { margin-left: 60px; }
    .section { padding: 40px 20px; }
    .grid2, .grid3 { grid-template-columns: 1fr; }
  }

  /* Textarea */
  textarea, input[type=text] {
    width: 100%;
    background: #020c18;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
  }
  textarea:focus, input:focus { border-color: var(--accent); }

  /* Tooltip */
  .tooltip-wrap { position: relative; display: inline-block; }
  .tooltip-wrap:hover .tooltip { opacity: 1; pointer-events: auto; }
  .tooltip {
    position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 6px; padding: 6px 12px;
    font-size: 11px; font-family: var(--font-mono);
    color: var(--text); white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.2s;
    margin-bottom: 6px; z-index: 999;
  }

  .divider { height: 1px; background: var(--border); margin: 32px 0; }

  /* scroll indicator */
  .section-num {
    font-family: var(--font-mono);
    font-size: 72px;
    font-weight: 900;
    color: #ffffff04;
    position: absolute;
    top: 40px; right: 48px;
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
`;

// ─── PIPELINE SIMULATOR DATA ──────────────────────────────────────────────────
const DEMO_INSTRUCTIONS = [
  { asm: "ADD X1, X2, X3",   type: "R", dst: "X1", src1: "X2", src2: "X3" },
  { asm: "SUB X4, X1, X5",   type: "R", dst: "X4", src1: "X1", src2: "X5" }, // RAW on X1
  { asm: "LDUR X6, [X7,#0]", type: "L", dst: "X6", src1: "X7", src2: null },
  { asm: "ADD X8, X6, X9",   type: "R", dst: "X8", src1: "X6", src2: "X9" }, // load-use
  { asm: "B.EQ #100",        type: "B", dst: null,  src1: null, src2: null },
  { asm: "STUR X1, [X2,#4]", type: "S", dst: null,  src1: "X2", src2: "X1" },
];

function detectHazards(instructions) {
  const hazards = {};
  for (let i = 1; i < instructions.length; i++) {
    const prev = instructions[i - 1];
    const curr = instructions[i];
    if (prev.dst && (curr.src1 === prev.dst || curr.src2 === prev.dst)) {
      if (prev.type === "L") {
        hazards[i] = { type: "load-use", label: "LOAD-USE STALL", color: "#f59e0b" };
      } else {
        hazards[i] = { type: "raw", label: "RAW→FWD", color: "#22c55e" };
      }
    }
    if (prev.type === "B") {
      hazards[i] = { type: "control", label: "CTRL HAZARD", color: "#c084fc" };
    }
  }
  return hazards;
}

function buildPipelineGrid(instructions, hazards) {
  const rows = [];
  let timeOffset = 0;
  for (let i = 0; i < instructions.length; i++) {
    const h = hazards[i];
    const extra = h?.type === "load-use" ? 1 : 0;
    const cells = [];
    const start = i + timeOffset + extra;
    for (let c = 0; c < 12; c++) {
      const stageIdx = c - start;
      if (stageIdx < 0 || stageIdx >= 5) cells.push(null);
      else {
        if (extra && stageIdx === 0) cells.push({ stage: "STALL", color: "#f59e0b" });
        else cells.push({ stage: STAGES[stageIdx], color: STAGE_COLORS[STAGES[stageIdx]].bg });
      }
    }
    rows.push({ instr: instructions[i], cells, hazard: h });
    timeOffset += extra;
  }
  return rows;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StageBadge({ label }) {
  const c = STAGE_COLORS[label] || { bg: "#374151", text: "#9ca3af" };
  return (
    <div className="stage-badge" style={{ background: c.bg + "25", color: c.bg, border: `1px solid ${c.bg}50` }}>
      {label}
    </div>
  );
}

// ─── INTRO SECTION ────────────────────────────────────────────────────────────
function IntroSection() {
  const [shown, setShown] = useState(false);
  useEffect(() => { setTimeout(() => setShown(true), 100); }, []);
  return (
    <section id="intro" className="section">
      <div className="section-num">01</div>
      <div className="tag tag-blue">Foundations</div>
      <h1 style={{ fontSize: 42, lineHeight: 1.1, marginBottom: 24 }}>
        CPU Pipeline<br />
        <span style={{ color: "var(--accent)" }} className="glow">Learning Lab</span>
      </h1>
      <p style={{ maxWidth: 580, fontSize: 16, marginBottom: 32 }}>
        Master pipelining, hazards, forwarding, and control flow through interactive diagrams,
        cycle-by-cycle simulation, and hands-on hazard detection.
      </p>

      <div className="grid3" style={{ marginBottom: 40 }}>
        {[
          { icon: "⚡", title: "Why Pipeline?", body: "Single-cycle CPUs waste hardware — every instruction waits for the slowest path. Pipelining overlaps execution to maximize throughput.", color: "var(--accent)" },
          { icon: "⚠️", title: "The Hazard Problem", body: "Overlapped execution creates conflicts: data not ready, wrong path fetched, shared resources. Hazards are what make pipeline design hard.", color: "var(--warn)" },
          { icon: "🧠", title: "The Solutions", body: "Forwarding bypasses register file waits. Stalls pause the pipeline. Branch prediction fetches the likely path. Each has trade-offs.", color: "#a78bfa" },
        ].map(c => (
          <div key={c.title} className="card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ color: c.color }}>{c.title}</h3>
            <p style={{ fontSize: 13 }}>{c.body}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg, #001a2e, #0d1526)" }}>
        <h3>Single-Cycle vs Pipelined — Core Insight</h3>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginTop: 8 }}>
          <div>
            <p style={{ color: "#f87171", fontSize: 13, marginBottom: 4 }}>🐢 Single-Cycle</p>
            <p style={{ fontSize: 13 }}>Clock = slowest instruction (e.g., LDUR = 800ps)<br />
              All instructions take same long time<br />
              CPI = 1 but huge cycle time</p>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div>
            <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 4 }}>🚀 Pipelined</p>
            <p style={{ fontSize: 13 }}>Clock = longest stage (e.g., 200ps)<br />
              Multiple instructions overlap<br />
              Throughput ≈ 1 inst / 200ps (ideal)</p>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div>
            <p style={{ color: "var(--accent)", fontSize: 13, marginBottom: 4 }}>📐 Speedup Formula</p>
            <div className="code-block" style={{ padding: "8px 12px", fontSize: 13, display: "inline-block" }}>
              Speedup = N × T_single / (N + 4) × T_stage
            </div>
            <p style={{ fontSize: 12, marginTop: 6 }}>→ Approaches <span style={{ color: "var(--accent)" }}>k stages</span> for large N</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Laundry Analogy — Pipeline Intuition</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {[
            { icon: "🧺", label: "Wash", time: "30m" },
            { icon: "🌀", label: "Dry", time: "40m" },
            { icon: "👕", label: "Fold", time: "20m" },
            { icon: "🗄️", label: "Store", time: "10m" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--warn)" }}>{s.time}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 13 }}>
          Instead of waiting for 4 loads to complete sequentially (4 × 100m = 400m), start the next load while previous is drying.
          <strong style={{ color: "var(--accent)" }}> Pipeline overlap = throughput multiplier.</strong>
        </p>
      </div>
    </section>
  );
}

// ─── PIPELINE TIMING SECTION ─────────────────────────────────────────────────
function PipelineSection() {
  const [showPipelined, setShowPipelined] = useState(false);
  const instructions = ["ADD X1,X2,X3", "LDUR X4,[X5,0]", "SUB X6,X7,X8", "STUR X9,[X10,4]"];
  const singleCycleTimes = [800, 800, 800, 800];
  const pipelinedStages = 5;

  return (
    <section id="pipeline" className="section">
      <div className="section-num">02</div>
      <div className="tag tag-purple">Core Concept</div>
      <h1>Pipelining</h1>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>
        A pipeline divides instruction execution into discrete stages that operate simultaneously —
        each stage works on a different instruction every cycle.
      </p>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={() => setShowPipelined(false)}>Single-Cycle</button>
        <button className="btn btn-primary" onClick={() => setShowPipelined(true)}>Pipelined</button>
      </div>

      {/* Timing Table */}
      <div className="card">
        <h3>{showPipelined ? "Pipelined Execution (200ps / stage)" : "Single-Cycle Execution (800ps / inst)"}</h3>
        <div style={{ overflowX: "auto" }}>
          {showPipelined ? (
            <div>
              <div style={{ display: "flex", marginBottom: 8, paddingLeft: 180 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ width: 58, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", flexShrink: 0 }}>
                    CC{i + 1}
                  </div>
                ))}
              </div>
              {instructions.map((ins, ri) => (
                <div key={ri} className="pipe-row">
                  <div className="pipe-label">{ins}</div>
                  {Array.from({ length: 10 }, (_, ci) => {
                    const si = ci - ri;
                    if (si < 0 || si >= 5) return <div key={ci} className="pipe-cell empty" style={{ width: 58 }} />;
                    const stage = STAGES[si];
                    const c = STAGE_COLORS[stage];
                    return (
                      <div key={ci} className="pipe-cell" style={{ background: c.bg + "30", color: c.bg, border: `1px solid ${c.bg}50`, width: 58 }}>
                        {stage}
                      </div>
                    );
                  })}
                </div>
              ))}
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--success)" }}>
                ✅ Total: 8 cycles × 200ps = <strong>1600ps</strong> for 4 instructions
              </p>
            </div>
          ) : (
            <div>
              {instructions.map((ins, ri) => (
                <div key={ri} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ width: 180, fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text2)", flexShrink: 0 }}>{ins}</div>
                  <div style={{ height: 30, background: "#ef444420", border: "1px solid #ef444440", borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 12, color: "#f87171", fontFamily: "var(--font-mono)", fontSize: 12, width: 200 }}>
                    800ps
                  </div>
                </div>
              ))}
              <p style={{ marginTop: 16, fontSize: 13, color: "#f87171" }}>
                ❌ Total: 4 × 800ps = <strong>3200ps</strong> for 4 instructions
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Pipeline Registers</h3>
          <p style={{ fontSize: 13 }}>Between each stage, a <span style={{ color: "var(--accent)" }}>pipeline register</span> latches all data needed by downstream stages.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {["IF/ID → holds: PC+4, Instruction[31:0]",
              "ID/EX → holds: PC+4, RegA, RegB, Sign-ext, Rd, Rs1, Rs2, Ctrl",
              "EX/MEM → holds: PC+branch, Zero, ALUresult, RegB, Rd, Ctrl",
              "MEM/WB → holds: ReadData, ALUresult, Rd, Ctrl"].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>{["IF/ID", "ID/EX", "EX/MEM", "MEM/WB"][i]}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{r.split("→")[1]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Stage Timing (LEGv8)</h3>
          <table>
            <thead><tr><th>Stage</th><th>Op</th><th>Time</th></tr></thead>
            <tbody>
              {[["IF", "Instruction Memory Read", "200ps"],
                ["ID", "Register File Read", "100ps"],
                ["EX", "ALU Operation", "200ps"],
                ["MEM", "Data Memory Access", "200ps"],
                ["WB", "Register File Write", "100ps"]].map(([s, op, t]) => (
                <tr key={s}>
                  <td><span style={{ color: STAGE_COLORS[s].bg, fontWeight: 700 }}>{s}</span></td>
                  <td>{op}</td>
                  <td style={{ color: "var(--warn)" }}>{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, marginTop: 12, color: "var(--text2)" }}>
            Clock period determined by <strong style={{ color: "var(--danger)" }}>longest stage</strong> = 200ps
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── 5 STAGES SECTION ────────────────────────────────────────────────────────
function StagesSection() {
  const [active, setActive] = useState(0);
  const stages = [
    {
      id: "IF", color: STAGE_COLORS.IF.bg,
      title: "Instruction Fetch",
      desc: "Fetch the 32-bit instruction from Instruction Memory at address PC. Simultaneously compute PC+4 for the next sequential instruction.",
      inputs: ["PC"],
      outputs: ["Instruction[31:0]", "PC+4"],
      ops: ["1. Send PC to Instruction Memory", "2. Read 32-bit instruction at PC", "3. Compute PC+4 = PC + 4", "4. Latch into IF/ID register"],
      signals: [],
      example: "PC=0x400 → fetch 0x8B010041 → ADD X1,X2,X3"
    },
    {
      id: "ID", color: STAGE_COLORS.ID.bg,
      title: "Instruction Decode / Register Read",
      desc: "Decode the instruction fields. Read two source registers simultaneously. Generate sign-extended immediate. Decode control signals.",
      inputs: ["Instruction[31:0]", "PC+4"],
      outputs: ["ReadData1 (Rs1)", "ReadData2 (Rs2)", "Sign-Ext Imm", "Rd", "Control Signals"],
      ops: ["1. Split instruction into fields", "2. Read Regs[Rs1], Regs[Rs2] simultaneously", "3. Sign-extend 9-bit/19-bit immediate", "4. Generate all control signals", "5. Latch into ID/EX register"],
      signals: ["RegWrite", "ALUSrc", "MemRead", "MemWrite", "MemtoReg", "Branch"],
      example: "Instr=ADD → Rs1=X2, Rs2=X3, Rd=X1; RegWrite=1, ALUSrc=0"
    },
    {
      id: "EX", color: STAGE_COLORS.EX.bg,
      title: "Execute / Address Calculate",
      desc: "Perform the ALU operation. For loads/stores: compute memory address = base + offset. For branches: compute target = PC + offset. Forwarding happens here.",
      inputs: ["ReadData1", "ReadData2 / Imm", "ALUOp", "ForwardA/B"],
      outputs: ["ALUResult", "Zero flag", "Branch Target"],
      ops: ["1. Mux A: select RegA or forwarded value (ForwardA)", "2. Mux B: select RegB, Imm, or forwarded value (ForwardB)", "3. ALU performs operation based on ALUOp", "4. Zero = (Result == 0) for branches", "5. Compute branch target: PC + SignExt(offset)"],
      signals: ["ALUOp[1:0]", "ALUSrc", "ForwardA[1:0]", "ForwardB[1:0]"],
      example: "ADD: ALU = X2 + X3 = 5; LDUR: ALU = X7 + 0 = 0x500 (addr)"
    },
    {
      id: "MEM", color: STAGE_COLORS.MEM.bg,
      title: "Memory Access",
      desc: "Access data memory for loads/stores. For other instructions, pass ALU result through. Branch decision made here using Zero flag.",
      inputs: ["ALUResult", "ReadData2 (for stores)", "MemRead", "MemWrite"],
      outputs: ["ReadData (loads)", "ALUResult (pass-through)", "PCSrc"],
      ops: ["1. IF MemRead: read Data_Memory[ALUResult]", "2. IF MemWrite: write Data_Memory[ALUResult] = ReadData2", "3. PCSrc = Branch AND Zero", "4. If PCSrc: PC ← branch target"],
      signals: ["MemRead", "MemWrite", "Branch", "Zero"],
      example: "LDUR: read Mem[0x500] = 42; STUR: write Mem[addr] = Reg value"
    },
    {
      id: "WB", color: STAGE_COLORS.WB.bg,
      title: "Write Back",
      desc: "Write result back to the destination register. Either the ALU result (arithmetic) or data from memory (load). This is the final stage.",
      inputs: ["ALUResult", "ReadData", "Rd", "RegWrite", "MemtoReg"],
      outputs: ["Regs[Rd] ← value"],
      ops: ["1. Mux: select ALUResult or ReadData based on MemtoReg", "2. IF RegWrite: Regs[Rd] = selected value", "3. Note: write occurs in first HALF of cycle", "4. Register read in ID uses SECOND half — same cycle works!"],
      signals: ["RegWrite", "MemtoReg"],
      example: "ADD: Regs[X1] = 5; LDUR: Regs[X6] = 42 (from memory)"
    },
  ];
  const s = stages[active];
  return (
    <section id="stages" className="section">
      <div className="section-num">03</div>
      <div className="tag tag-amber">Deep Dive</div>
      <h1>The 5 Pipeline Stages</h1>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>Click each stage to explore its function, inputs, outputs, and control signals.</p>

      {/* Stage selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {stages.map((st, i) => (
          <button key={st.id} className="btn" onClick={() => setActive(i)}
            style={{ background: active === i ? st.color + "30" : "var(--surface2)", color: active === i ? st.color : "var(--text2)", border: `1px solid ${active === i ? st.color : "var(--border)"}`, flex: 1, justifyContent: "center" }}>
            {st.id}
          </button>
        ))}
      </div>

      {/* Arrow connector */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, overflowX: "auto" }}>
        {stages.map((st, i) => (
          <div key={st.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              background: active === i ? st.color + "25" : "var(--surface2)",
              border: `2px solid ${active === i ? st.color : "var(--border)"}`,
              borderRadius: 8,
              padding: "12px 20px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 14,
              color: active === i ? st.color : "var(--text2)",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              boxShadow: active === i ? `0 0 20px ${st.color}40` : "none",
            }} onClick={() => setActive(i)}>
              {st.id}
            </div>
            {i < stages.length - 1 && (
              <div style={{ width: 32, height: 2, background: "var(--border2)", position: "relative" }}>
                <div style={{ position: "absolute", right: -5, top: -5, width: 10, height: 10, borderTop: "2px solid var(--border2)", borderRight: "2px solid var(--border2)", transform: "rotate(45deg)" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="card" style={{ borderColor: s.color + "50" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div className="stage-badge" style={{ background: s.color + "20", color: s.color, border: `1px solid ${s.color}40`, fontSize: 18, fontFamily: "var(--font-mono)", fontWeight: 900 }}>
              {s.id}
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: 0, color: s.color }}>{s.title}</h2>
            </div>
          </div>
          <p style={{ fontSize: 13, marginBottom: 16 }}>{s.desc}</p>
          <div className="code-block" style={{ fontSize: 12, color: "var(--warn)" }}>
            💡 {s.example}
          </div>
        </div>

        <div className="card">
          <h3>Step-by-Step Operations</h3>
          {s.ops.map((op, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: s.color, fontFamily: "var(--font-mono)", fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontSize: 13 }}>{op}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Inputs & Outputs</h3>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>INPUTS:</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {s.inputs.map(inp => <span key={inp} style={{ background: "#0ea5e915", border: "1px solid #0ea5e940", borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#38bdf8" }}>{inp}</span>)}
            </div>
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)" }}>OUTPUTS:</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {s.outputs.map(out => <span key={out} style={{ background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#4ade80" }}>{out}</span>)}
            </div>
          </div>
        </div>

        {s.signals.length > 0 && (
          <div className="card">
            <h3>Control Signals at this Stage</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {s.signals.map(sig => (
                <span key={sig} style={{ background: "#f59e0b15", border: "1px solid #f59e0b40", borderRadius: 4, padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#fbbf24" }}>{sig}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── DATAPATH SECTION ────────────────────────────────────────────────────────
function DatapathSection() {
  const [instrType, setInstrType] = useState("R");
  const active = { R: ["IF","ID","EX","WB"], L: ["IF","ID","EX","MEM","WB"], S: ["IF","ID","EX","MEM"], B: ["IF","ID","EX","MEM"] };
  const activeStages = active[instrType] || STAGES;

  return (
    <section id="datapath" className="section">
      <div className="section-num">04</div>
      <div className="tag tag-blue">Architecture</div>
      <h1>Pipelined Datapath</h1>
      <p style={{ maxWidth: 640, marginBottom: 24 }}>
        The pipelined datapath separates each stage with pipeline registers. Control signals are generated in ID and flow forward through the pipeline.
      </p>

      <div className="btn-row">
        {["R","L","S","B"].map(t => (
          <button key={t} className={`btn ${instrType === t ? "btn-primary" : "btn-secondary"}`} onClick={() => setInstrType(t)}>
            {t === "R" ? "R-Type (ADD)" : t === "L" ? "LDUR (Load)" : t === "S" ? "STUR (Store)" : "Branch"}
          </button>
        ))}
      </div>

      {/* SVG Datapath */}
      <div className="dp-wrap" style={{ marginBottom: 24 }}>
        <svg viewBox="0 0 900 260" style={{ width: "100%", minWidth: 700, fontFamily: "var(--font-mono)" }}>
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#1e3a5f" />
            </marker>
            <marker id="arr-act" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" />
            </marker>
          </defs>

          {/* Pipeline register boxes */}
          {[170, 330, 510, 690].map((x, i) => (
            <g key={i}>
              <rect x={x} y={30} width={18} height={200} rx={3} fill="#1e3a5f" stroke="#2a4a7f" strokeWidth={1} />
              <text x={x + 9} y={24} textAnchor="middle" fontSize={9} fill="#4b6a8f">
                {["IF/ID","ID/EX","EX/MEM","MEM/WB"][i]}
              </text>
            </g>
          ))}

          {/* Stage blocks */}
          {[
            { x: 20,  label: "IF",  w: 140, color: STAGE_COLORS.IF.bg },
            { x: 200, label: "ID",  w: 120, color: STAGE_COLORS.ID.bg },
            { x: 360, label: "EX",  w: 140, color: STAGE_COLORS.EX.bg },
            { x: 540, label: "MEM", w: 140, color: STAGE_COLORS.MEM.bg },
            { x: 710, label: "WB",  w: 140, color: STAGE_COLORS.WB.bg },
          ].map(({ x, label, w, color }) => {
            const isActive = activeStages.includes(label);
            return (
              <g key={label}>
                <rect x={x} y={50} width={w} height={160} rx={8}
                  fill={isActive ? color + "18" : "#0d152610"}
                  stroke={isActive ? color : "#1e3a5f"}
                  strokeWidth={isActive ? 2 : 1} />
                <text x={x + w / 2} y={82} textAnchor="middle" fontSize={16} fontWeight="bold" fill={isActive ? color : "#374151"} className={isActive ? "glow" : ""}>{label}</text>
                {isActive && <rect x={x} y={50} width={w} height={3} rx={2} fill={color} />}
              </g>
            );
          })}

          {/* Internal labels per stage */}
          {instrType === "R" && (
            <>
              <text x={90}  y={130} textAnchor="middle" fontSize={9} fill="#38bdf8">I-Mem</text>
              <text x={260} y={120} textAnchor="middle" fontSize={9} fill="#a78bfa">RegFile</text>
              <text x={260} y={135} textAnchor="middle" fontSize={9} fill="#a78bfa">Decode</text>
              <text x={430} y={130} textAnchor="middle" fontSize={9} fill="#fbbf24">ALU</text>
              <text x={610} y={130} textAnchor="middle" fontSize={9} fill="#4ade80">—</text>
              <text x={780} y={125} textAnchor="middle" fontSize={9} fill="#f87171">WrReg</text>
              <text x={780} y={140} textAnchor="middle" fontSize={9} fill="#f87171">← result</text>
            </>
          )}
          {instrType === "L" && (
            <>
              <text x={90}  y={130} textAnchor="middle" fontSize={9} fill="#38bdf8">I-Mem</text>
              <text x={260} y={128} textAnchor="middle" fontSize={9} fill="#a78bfa">RegFile</text>
              <text x={430} y={125} textAnchor="middle" fontSize={9} fill="#fbbf24">ALU</text>
              <text x={430} y={138} textAnchor="middle" fontSize={9} fill="#fbbf24">base+off</text>
              <text x={610} y={125} textAnchor="middle" fontSize={9} fill="#4ade80">D-Mem</text>
              <text x={610} y={138} textAnchor="middle" fontSize={9} fill="#4ade80">READ</text>
              <text x={780} y={125} textAnchor="middle" fontSize={9} fill="#f87171">WrReg</text>
              <text x={780} y={140} textAnchor="middle" fontSize={9} fill="#f87171">← mem</text>
            </>
          )}
          {instrType === "S" && (
            <>
              <text x={90}  y={130} textAnchor="middle" fontSize={9} fill="#38bdf8">I-Mem</text>
              <text x={260} y={128} textAnchor="middle" fontSize={9} fill="#a78bfa">RegFile</text>
              <text x={430} y={128} textAnchor="middle" fontSize={9} fill="#fbbf24">addr calc</text>
              <text x={610} y={125} textAnchor="middle" fontSize={9} fill="#4ade80">D-Mem</text>
              <text x={610} y={138} textAnchor="middle" fontSize={9} fill="#4ade80">WRITE</text>
              <text x={780} y={130} textAnchor="middle" fontSize={9} fill="#374151">—</text>
            </>
          )}
          {instrType === "B" && (
            <>
              <text x={90}  y={130} textAnchor="middle" fontSize={9} fill="#38bdf8">I-Mem</text>
              <text x={260} y={128} textAnchor="middle" fontSize={9} fill="#a78bfa">decode</text>
              <text x={430} y={128} textAnchor="middle" fontSize={9} fill="#fbbf24">subtract</text>
              <text x={610} y={125} textAnchor="middle" fontSize={9} fill="#4ade80">Branch?</text>
              <text x={610} y={138} textAnchor="middle" fontSize={9} fill="#4ade80">PC←target</text>
              <text x={780} y={130} textAnchor="middle" fontSize={9} fill="#374151">—</text>
            </>
          )}

          {/* Data flow arrows */}
          {activeStages.includes("IF") && activeStages.includes("ID") &&
            <line x1={160} y1={130} x2={200} y2={130} stroke="#00d4ff" strokeWidth={2} markerEnd="url(#arr-act)" />}
          {activeStages.includes("ID") && activeStages.includes("EX") &&
            <line x1={320} y1={130} x2={360} y2={130} stroke="#00d4ff" strokeWidth={2} markerEnd="url(#arr-act)" />}
          {activeStages.includes("EX") && activeStages.includes("MEM") &&
            <line x1={500} y1={130} x2={540} y2={130} stroke="#00d4ff" strokeWidth={2} markerEnd="url(#arr-act)" />}
          {activeStages.includes("MEM") && activeStages.includes("WB") &&
            <line x1={680} y1={130} x2={710} y2={130} stroke="#00d4ff" strokeWidth={2} markerEnd="url(#arr-act)" />}

          {/* Write-back arrow (right to left) */}
          {(instrType === "R" || instrType === "L") && (
            <path d="M 850,200 Q 850,235 780,235 Q 300,235 260,200" stroke="#f43f5e" strokeWidth={1.5} fill="none" markerEnd="url(#arr)" strokeDasharray="4,3" />
          )}

          {/* WB label */}
          {(instrType === "R" || instrType === "L") && (
            <text x={560} y={248} textAnchor="middle" fontSize={9} fill="#f87171">← Write-Back path</text>
          )}
        </svg>
      </div>

      {/* Control signals table */}
      <div className="card">
        <h3>Control Signal Truth Table</h3>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Instruction</th>
                <th>RegWrite</th><th>ALUSrc</th><th>MemRead</th>
                <th>MemWrite</th><th>MemtoReg</th><th>Branch</th><th>ALUOp</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["R-Type (ADD/SUB)",  1,0,0,0,0,0,"10"],
                ["LDUR",             1,1,1,0,1,0,"00"],
                ["STUR",             0,1,0,1,0,0,"00"],
                ["CBZ (branch)",     0,0,0,0,0,1,"01"],
              ].map(([name, rw,as,mr,mw,mtr,br,op]) => (
                <tr key={name}>
                  <td style={{ color: "var(--text)" }}>{name}</td>
                  {[rw,as,mr,mw,mtr,br].map((v,i) => (
                    <td key={i}><span className={`sig sig-${v}`}>{v}</span></td>
                  ))}
                  <td><span className="sig sig-1">{op}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: "var(--text2)" }}>
          Control signals are generated in <strong style={{ color: "var(--accent)" }}>ID stage</strong> and propagated forward through pipeline registers to the stage that needs them.
        </p>
      </div>
    </section>
  );
}

// ─── HAZARDS SECTION ─────────────────────────────────────────────────────────
function HazardsSection() {
  const [tab, setTab] = useState("structural");
  const tabs = [
    { id: "structural", label: "🔧 Structural", color: "#0ea5e9" },
    { id: "data",       label: "📊 Data (RAW)", color: "#f59e0b" },
    { id: "control",    label: "🎯 Control",    color: "#c084fc" },
  ];

  return (
    <section id="hazards" className="section">
      <div className="section-num">05</div>
      <div className="tag tag-red">Critical Topic</div>
      <h1>Pipeline Hazards</h1>
      <p style={{ maxWidth: 640, marginBottom: 32 }}>
        Hazards are situations that prevent the next instruction from executing in its designated clock cycle.
        Three types: Structural, Data, and Control.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t.id} className="btn" onClick={() => setTab(t.id)}
            style={{ background: tab === t.id ? t.color + "25" : "var(--surface2)", color: tab === t.id ? t.color : "var(--text2)", border: `1px solid ${tab === t.id ? t.color : "var(--border)"}` }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "structural" && (
        <div>
          <div className="card">
            <h2 style={{ color: "#0ea5e9" }}>Structural Hazard</h2>
            <p>A required hardware resource is being used by another instruction already in the pipeline.</p>
            <div className="divider" />
            <div className="grid2">
              <div>
                <h3>Classic Example: Single Memory</h3>
                <p style={{ fontSize: 13 }}>If instruction memory and data memory are <strong style={{ color: "#f87171" }}>the same unit</strong>, then:</p>
                <div className="code-block" style={{ marginTop: 8 }}>
                  <div><span className="kw">Cycle 1:</span> <span className="com">LDUR in IF → reads memory</span></div>
                  <div><span className="kw">Cycle 1:</span> <span className="com">ADD in MEM → also reads memory</span></div>
                  <div style={{ color: "#f87171", marginTop: 4 }}>⚡ CONFLICT: both need memory simultaneously!</div>
                </div>
              </div>
              <div>
                <h3>Solution</h3>
                <div className="fwd-path" style={{ background: "#22c55e15", border: "1px solid #22c55e40", color: "#4ade80", marginBottom: 8 }}>
                  ✅ Separate Instruction Memory and Data Memory
                </div>
                <div className="fwd-path" style={{ background: "#22c55e15", border: "1px solid #22c55e40", color: "#4ade80" }}>
                  ✅ Duplicate register file ports (read+write simultaneously)
                </div>
                <p style={{ fontSize: 12, marginTop: 12, color: "var(--text2)" }}>
                  LEGv8 design avoids structural hazards by having <span style={{ color: "var(--accent)" }}>separate caches</span> and a register file with both read and write ports.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "data" && (
        <div>
          <div className="card">
            <h2 style={{ color: "#f59e0b" }}>Data Hazard (RAW)</h2>
            <p>Read After Write — an instruction tries to read a register before a previous instruction has finished writing to it.</p>
            <div className="divider" />
            <div className="grid2">
              <div>
                <h3>RAW Example</h3>
                <div className="code-block">
                  <div><span className="reg">ADD</span> <span className="num">X1</span>, X2, X3   <span className="com">// writes X1 in WB (cycle 5)</span></div>
                  <div><span className="hl-raw">SUB X4, X1, X5</span>  <span className="com">// reads X1 in ID (cycle 3!)</span></div>
                  <div><span className="com">                  // X1 NOT READY YET ⚠️</span></div>
                </div>
                <p style={{ fontSize: 13, marginTop: 12 }}>
                  ADD writes X1 in cycle 5 (WB), but SUB reads X1 in cycle 3 (ID). Without forwarding, SUB reads a <span style={{ color: "#f87171" }}>stale value</span>.
                </p>
              </div>
              <div>
                <h3>Data Hazard Types</h3>
                {[
                  { name: "RAW", desc: "Read After Write — consumer needs producer's result", color: "#f59e0b" },
                  { name: "WAR", desc: "Write After Read — rare in in-order pipelines", color: "#6b7280" },
                  { name: "WAW", desc: "Write After Write — rare in 5-stage pipeline", color: "#6b7280" },
                ].map(h => (
                  <div key={h.name} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: h.color, minWidth: 36 }}>{h.name}</span>
                    <span style={{ fontSize: 12, color: h.name === "RAW" ? "var(--text)" : "var(--text2)" }}>{h.desc}</span>
                  </div>
                ))}
                <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 8 }}>
                  In LEGv8 pipeline, <strong style={{ color: "var(--warn)" }}>RAW</strong> is the primary concern. WAR/WAW don't occur in simple in-order execution.
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ borderColor: "#f59e0b50" }}>
            <h3>When Can Forwarding Fail?</h3>
            <div className="code-block" style={{ marginBottom: 12 }}>
              <div><span className="reg">LDUR</span> <span className="num">X1</span>, [X2, #0]  <span className="com">// X1 ready after MEM stage</span></div>
              <div><span className="hl-stall">ADD  X3, X1, X4</span>   <span className="com">// needs X1 at start of EX</span></div>
              <div style={{ color: "#fbbf24", marginTop: 4 }}>⚠️ LOAD-USE HAZARD: 1 stall required!</div>
            </div>
            <p style={{ fontSize: 13 }}>
              For a load followed immediately by a dependent instruction, the data is only available <strong>after the MEM stage</strong>, but the next instruction needs it <strong>at the beginning of EX</strong> — a full cycle too late.
              The <span style={{ color: "#fbbf24" }}>Hazard Detection Unit</span> inserts a <strong>bubble (stall)</strong>.
            </p>
          </div>
        </div>
      )}

      {tab === "control" && (
        <div>
          <div className="card">
            <h2 style={{ color: "#c084fc" }}>Control Hazard</h2>
            <p>The CPU fetches the wrong instruction because a branch decision has not yet been made.</p>
            <div className="divider" />
            <div className="grid2">
              <div>
                <h3>The Problem</h3>
                <div className="code-block">
                  <div><span className="kw">Cycle 1:</span> CBZ X1, #offset  <span className="com">// IF</span></div>
                  <div><span className="kw">Cycle 2:</span> CBZ X1, #offset  <span className="com">// ID — decode</span></div>
                  <div><span className="kw">Cycle 2:</span> ADD X2, X3, X4   <span className="com">// IF — fetched PC+4!</span></div>
                  <div><span className="kw">Cycle 3:</span> CBZ X1, #offset  <span className="com">// EX — branch decided!</span></div>
                  <div style={{ color: "#c084fc", marginTop: 4 }}>⚠️ 2 instructions fetched before branch resolved</div>
                </div>
              </div>
              <div>
                <h3>Solutions Compared</h3>
                {[
                  { s: "Always Stall", desc: "Insert 2 bubbles after every branch. Simple but costly.", cost: "2 CPI per branch" },
                  { s: "Predict Not Taken", desc: "Continue fetching. If branch taken, flush wrong instructions.", cost: "2 CPI if taken" },
                  { s: "Move branch to ID", desc: "Resolve branch 1 cycle earlier → only 1 stall needed.", cost: "1 CPI if taken" },
                ].map(s => (
                  <div key={s.s} style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#c084fc" }}>{s.s}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{s.desc}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--warn)" }}>Cost: {s.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Branch Pipeline Diagram — Predict Not Taken</h3>
            <div style={{ overflowX: "auto" }}>
              {[
                { label: "CBZ X1, L1", stages: ["IF","ID","EX","MEM","WB"], note: "branch" },
                { label: "ADD X2,X3,X4", stages: ["IF","ID","flush","—","—"], note: "fetched, then FLUSHED" },
                { label: "SUB X5,X6,X7", stages: ["—","IF","flush","—","—"], note: "fetched, then FLUSHED" },
                { label: "Target: AND X8,X9,X10", stages: ["—","—","IF","ID","EX"], note: "correct" },
              ].map((row, ri) => (
                <div key={ri} className="pipe-row" style={{ alignItems: "center" }}>
                  <div className="pipe-label" style={{ width: 200, color: row.note === "branch" ? "#c084fc" : row.note === "correct" ? "#4ade80" : "#6b7280" }}>
                    {row.label}
                  </div>
                  {Array.from({ length: 8 }, (_, ci) => {
                    const s = row.stages[ci];
                    if (!s || s === "—") return <div key={ci} className="pipe-cell empty" style={{ width: 64 }} />;
                    if (s === "flush") return <div key={ci} className="pipe-cell" style={{ width: 64, background: "#c084fc15", border: "1px dashed #c084fc40", color: "#c084fc", fontSize: 10 }}>FLUSH</div>;
                    const c = STAGE_COLORS[s];
                    return <div key={ci} className="pipe-cell" style={{ width: 64, background: c ? c.bg + "25" : "#37415120", color: c ? c.bg : "#9ca3af", border: `1px solid ${c ? c.bg + "50" : "#374151"}` }}>{s}</div>;
                  })}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, marginTop: 12, color: "var(--text2)" }}>
              Two instructions are flushed (turned into NOPs) when the branch is taken. This is a <strong style={{ color: "#c084fc" }}>2-cycle penalty</strong>.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── FORWARDING SECTION ──────────────────────────────────────────────────────
function ForwardingSection() {
  const [scenario, setScenario] = useState(0);
  const scenarios = [
    {
      label: "EX→EX Forward",
      color: "#22c55e",
      instrs: ["ADD X1, X2, X3", "SUB X4, X1, X5"],
      desc: "ADD result in EX/MEM register → forward to SUB's EX stage. No stall needed.",
      path: "EX/MEM.Rd == ID/EX.Rs1",
      type: "ex-ex",
      mux: "ForwardA = 10"
    },
    {
      label: "MEM→EX Forward",
      color: "#0ea5e9",
      instrs: ["ADD X1, X2, X3", "SUB X4, X6, X7", "AND X8, X1, X9"],
      desc: "ADD result now in MEM/WB register when AND reaches EX. Forward from MEM/WB. No stall.",
      path: "MEM/WB.Rd == ID/EX.Rs1",
      type: "mem-ex",
      mux: "ForwardA = 01"
    },
    {
      label: "Load-Use (Stall)",
      color: "#f59e0b",
      instrs: ["LDUR X1, [X2,#0]", "ADD X3, X1, X4"],
      desc: "Load result only available after MEM stage — forwarding impossible. Must stall 1 cycle.",
      path: "ID/EX.MemRead AND (ID/EX.Rd == IF/ID.Rs1)",
      type: "stall",
      mux: "PCWrite=0, IF/ID.write=0, bubble inserted"
    },
  ];
  const s = scenarios[scenario];

  return (
    <section id="forwarding" className="section">
      <div className="section-num">06</div>
      <div className="tag tag-green">Optimization</div>
      <h1>Forwarding & Hazard Detection</h1>
      <p style={{ maxWidth: 640, marginBottom: 32 }}>
        Forwarding (bypassing) routes pipeline register values directly to where they are needed,
        eliminating stalls for most RAW hazards.
      </p>

      <div className="btn-row">
        {scenarios.map((sc, i) => (
          <button key={i} className="btn" onClick={() => setScenario(i)}
            style={{ background: scenario === i ? sc.color + "20" : "var(--surface2)", color: scenario === i ? sc.color : "var(--text2)", border: `1px solid ${scenario === i ? sc.color : "var(--border)"}` }}>
            {sc.label}
          </button>
        ))}
      </div>

      <div className={`fwd-path ${s.type}`} style={{ fontSize: 14, marginBottom: 20 }}>
        <span>🔀</span><strong>{s.label}</strong> — {s.desc}
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Forwarding Unit Logic</h3>
          <div className="code-block" style={{ lineHeight: 2.2 }}>
            <div><span className="com">// EX Hazard (forward from EX/MEM):</span></div>
            <div><span className="kw">if</span> (EX/MEM.RegWrite <span className="kw">AND</span></div>
            <div>    EX/MEM.Rd != 0 <span className="kw">AND</span></div>
            <div>    EX/MEM.Rd == <span className="num">ID/EX.Rs1</span>)</div>
            <div>  ForwardA = <span className="num">10</span> <span className="com">// use EX/MEM ALU result</span></div>
            <div>&nbsp;</div>
            <div><span className="com">// MEM Hazard (forward from MEM/WB):</span></div>
            <div><span className="kw">if</span> (MEM/WB.RegWrite <span className="kw">AND</span></div>
            <div>    MEM/WB.Rd != 0 <span className="kw">AND</span></div>
            <div>    <span className="kw">NOT</span>(EX hazard on Rs1) <span className="kw">AND</span></div>
            <div>    MEM/WB.Rd == <span className="num">ID/EX.Rs1</span>)</div>
            <div>  ForwardA = <span className="num">01</span> <span className="com">// use MEM/WB result</span></div>
          </div>
          <p style={{ fontSize: 12, marginTop: 12, color: "var(--text2)" }}>
            <strong style={{ color: "var(--warn)" }}>Priority:</strong> EX hazard takes precedence over MEM hazard (latest value wins).
          </p>
        </div>

        <div className="card">
          <h3>Active Scenario</h3>
          <div className="code-block" style={{ marginBottom: 16 }}>
            {s.instrs.map((ins, i) => (
              <div key={i} style={{ color: i === 0 ? s.color : i === s.instrs.length - 1 ? "#4ade80" : "var(--text2)" }}>
                {i + 1}. {ins}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", marginBottom: 6 }}>DETECTION CONDITION:</div>
            <div style={{ background: "#020c18", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: s.color }}>
              {s.path}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", marginBottom: 6 }}>MUX SELECT:</div>
            <div style={{ background: "#020c18", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--warn)" }}>
              {s.mux}
            </div>
          </div>

          {s.type === "stall" ? (
            <div style={{ background: "#f59e0b15", border: "1px solid #f59e0b40", borderRadius: 8, padding: "12px", marginTop: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#fbbf24", marginBottom: 8 }}>⚠️ Stall Mechanism:</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>
                1. PCWrite = 0 (freeze PC)<br />
                2. IF/ID.Write = 0 (freeze IF/ID register)<br />
                3. Insert NOP into ID/EX (all control = 0)<br />
                4. Pipeline resumes next cycle<br />
                5. Forwarding from MEM/WB resolves the hazard
              </div>
            </div>
          ) : (
            <div style={{ background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: 8, padding: "12px", marginTop: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#4ade80" }}>✅ No stall needed — forwarding resolves the hazard</div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        <h3>Code Scheduling — Avoid Load-Use Hazards</h3>
        <div className="grid2">
          <div>
            <p style={{ fontSize: 12, color: "#f87171", marginBottom: 8 }}>❌ Needs stall (1 bubble):</p>
            <div className="code-block">
              <div><span className="reg">LDUR X1</span>, [X2, #0]</div>
              <div style={{ color: "#f87171" }}>ADD  X3, <span className="num">X1</span>, X4  <span className="com">// ← uses X1!</span></div>
              <div><span className="com">SUB  X5, X6, X7</span></div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#4ade80", marginBottom: 8 }}>✅ Reordered (no stall):</p>
            <div className="code-block">
              <div><span className="reg">LDUR X1</span>, [X2, #0]</div>
              <div style={{ color: "#4ade80" }}>SUB  X5, X6, X7  <span className="com">// moved here</span></div>
              <div>ADD  X3, <span className="num">X1</span>, X4  <span className="com">// now safe</span></div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, marginTop: 12, color: "var(--text2)" }}>
          Compilers reorder instructions to <strong style={{ color: "var(--accent)" }}>fill load delay slots</strong> — a key optimization technique.
        </p>
      </div>
    </section>
  );
}

// ─── CONTROL SECTION ─────────────────────────────────────────────────────────
function ControlSection() {
  return (
    <section id="control" className="section">
      <div className="section-num">07</div>
      <div className="tag tag-purple">Architecture</div>
      <h1>Control in the Pipeline</h1>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>
        Control signals are decoded in the ID stage and must travel through pipeline registers to reach the stage that uses them.
      </p>

      <div className="grid2">
        <div className="card">
          <h3>Signal Groups by Stage</h3>
          {[
            { stage: "EX", color: STAGE_COLORS.EX.bg, sigs: ["ALUSrc", "ALUOp[1:0]", "RegDst"] },
            { stage: "MEM", color: STAGE_COLORS.MEM.bg, sigs: ["Branch", "MemRead", "MemWrite"] },
            { stage: "WB", color: STAGE_COLORS.WB.bg, sigs: ["RegWrite", "MemtoReg"] },
          ].map(g => (
            <div key={g.stage} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <div className="stage-badge" style={{ background: g.color + "20", color: g.color, border: `1px solid ${g.color}40`, width: 48, height: 36 }}>
                {g.stage}
              </div>
              <div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {g.sigs.map(sig => (
                    <span key={sig} style={{ background: g.color + "15", border: `1px solid ${g.color}40`, borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: g.color }}>{sig}</span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, marginBottom: 0 }}>
                  {g.stage === "EX" ? "Used to control ALU and input muxes" :
                   g.stage === "MEM" ? "Used to control memory access and PC" :
                   "Used to control register file write"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Signal Propagation Flow</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {[
              { from: "ID", to: "ID/EX register", label: "All 8 control bits stored", color: "#8b5cf6" },
              { from: "ID/EX", to: "EX stage", label: "EX bits used; rest forwarded", color: "#f59e0b" },
              { from: "EX/MEM", to: "MEM stage", label: "MEM bits used; WB bits forwarded", color: "#10b981" },
              { from: "MEM/WB", to: "WB stage", label: "WB bits (RegWrite, MemtoReg) used", color: "#f43f5e" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: row.color + "20", border: `1px solid ${row.color}40`, borderRadius: 4, padding: "4px 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: row.color, flexShrink: 0 }}>
                  {row.from}
                </div>
                <div style={{ color: "var(--border2)", fontSize: 16 }}>→</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{row.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, marginTop: 16, color: "var(--text2)" }}>
            Key insight: control signals <strong style={{ color: "var(--accent)" }}>ride along</strong> in pipeline registers, arriving at the right stage exactly when needed.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Full Control Signal Journey — LDUR Example</h3>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Cycle</th><th>Stage</th><th>RegWrite</th><th>ALUSrc</th>
                <th>MemRead</th><th>MemWrite</th><th>MemtoReg</th><th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", "IF",  "—","—","—","—","—","—"],
                ["2", "ID",  "1 generated","1 gen","1 gen","0 gen","1 gen","0 gen"],
                ["3", "EX",  "→ stored","used (ALU=add)","→ stored","→ stored","→ stored","→ stored"],
                ["4", "MEM", "→ stored","—","used","—","→ stored","used"],
                ["5", "WB",  "used!","—","—","—","used!","—"],
              ].map(([cy, st, ...sigs]) => (
                <tr key={cy}>
                  <td style={{ color: "var(--accent)" }}>{cy}</td>
                  <td><span style={{ color: STAGE_COLORS[st]?.bg || "var(--text2)", fontWeight: 700 }}>{st}</span></td>
                  {sigs.map((v, i) => (
                    <td key={i} style={{ color: v.includes("used") ? "#4ade80" : v.includes("gen") ? "#fbbf24" : v === "—" ? "#374151" : "var(--text2)" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── PIPELINE SIMULATOR ───────────────────────────────────────────────────────
function SimulatorSection() {
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const hazards = detectHazards(DEMO_INSTRUCTIONS);
  const grid = buildPipelineGrid(DEMO_INSTRUCTIONS, hazards);
  const maxCycle = 12;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCycle(c => {
          if (c >= maxCycle - 1) { setRunning(false); return c; }
          return c + 1;
        });
      }, 900);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => { setRunning(false); setCycle(0); };

  const activeStages = grid.map(row => {
    for (let c = 0; c < 12; c++) {
      if (row.cells[c] && c === cycle) return row.cells[c].stage;
    }
    return null;
  });

  return (
    <section id="simulator" className="section">
      <div className="section-num">08</div>
      <div className="tag tag-blue">Interactive</div>
      <h1>Pipeline Simulator</h1>
      <p style={{ maxWidth: 640, marginBottom: 24 }}>
        Step through a sequence of instructions cycle-by-cycle. Watch hazards detected, forwarding applied, and stalls inserted.
      </p>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={reset}>⟳ Reset</button>
        <button className="btn btn-secondary" onClick={() => setCycle(c => Math.max(0, c - 1))}>◀ Prev</button>
        <button className="btn btn-primary" onClick={() => { if (!running) { if (cycle >= maxCycle - 1) reset(); setRunning(true); } else setRunning(false); }}>
          {running ? "⏸ Pause" : "▶ Run"}
        </button>
        <button className="btn btn-secondary" onClick={() => setCycle(c => Math.min(maxCycle - 1, c + 1))}>Next ▶</button>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", alignSelf: "center" }}>
          Cycle {cycle + 1} / {maxCycle}
        </span>
      </div>

      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: `${((cycle + 1) / maxCycle) * 100}%` }} />
      </div>

      {/* Instruction legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {DEMO_INSTRUCTIONS.map((ins, i) => {
          const h = hazards[i];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: activeStages[i] ? STAGE_COLORS[activeStages[i]]?.bg || "var(--text)" : "var(--text2)" }}>
                I{i + 1}: {ins.asm}
              </span>
              {h && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: h.color, background: h.color + "20", padding: "1px 6px", borderRadius: 3 }}>{h.label}</span>}
            </div>
          );
        })}
      </div>

      {/* Pipeline grid */}
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          {/* Cycle header */}
          <div style={{ display: "flex", paddingLeft: 190, marginBottom: 8 }}>
            {Array.from({ length: maxCycle }, (_, i) => (
              <div key={i} style={{
                width: 58, flexShrink: 0, textAlign: "center",
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: i === cycle ? "var(--accent)" : "var(--text2)",
                background: i === cycle ? "#00d4ff15" : "transparent",
                borderRadius: 4, padding: "2px 0",
                fontWeight: i === cycle ? 700 : 400,
              }}>
                {i + 1}
              </div>
            ))}
          </div>

          {grid.map((row, ri) => (
            <div key={ri} className="pipe-row" style={{ alignItems: "center", marginBottom: 8 }}>
              <div className="pipe-label" style={{ width: 190, fontSize: 12, color: activeStages[ri] ? "var(--text)" : "var(--text2)" }}>
                <span style={{ color: "var(--text2)", marginRight: 4 }}>I{ri + 1}:</span>
                {row.instr.asm}
                {row.hazard && (
                  <span style={{ marginLeft: 6, fontSize: 10, color: row.hazard.color }}>⚠</span>
                )}
              </div>
              {row.cells.map((cell, ci) => {
                const isCurrentCycle = ci === cycle;
                if (!cell) return <div key={ci} className="pipe-cell empty" style={{ width: 58 }} />;
                const sc = STAGE_COLORS[cell.stage];
                const isStall = cell.stage === "STALL";
                return (
                  <div key={ci} className="pipe-cell" style={{
                    width: 58,
                    background: isStall ? "#f59e0b15" : isCurrentCycle ? cell.color + "40" : cell.color + "20",
                    color: isStall ? "#fbbf24" : cell.color,
                    border: `1px solid ${isStall ? "#f59e0b40" : isCurrentCycle ? cell.color + "90" : cell.color + "40"}`,
                    boxShadow: isCurrentCycle ? `0 0 10px ${cell.color}40` : "none",
                    transform: isCurrentCycle ? "scale(1.05)" : "scale(1)",
                    fontSize: isStall ? 9 : 11,
                  }}>
                    {isStall ? "STALL" : cell.stage}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Active hazard info */}
      {(() => {
        for (let ri = 0; ri < grid.length; ri++) {
          if (grid[ri].cells[cycle] && grid[ri].hazard) {
            const h = grid[ri].hazard;
            return (
              <div key={ri} style={{ background: h.color + "15", border: `1px solid ${h.color}40`, borderRadius: 8, padding: "12px 16px", marginTop: 16 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: h.color, marginBottom: 4 }}>
                  ⚠️ {h.label} detected at I{ri + 1}: {grid[ri].instr.asm}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>
                  {h.type === "load-use" ? "Hazard Detection Unit: PCWrite=0, IF/ID.Write=0 → bubble inserted" :
                   h.type === "raw" ? "Forwarding Unit: EX/MEM or MEM/WB value forwarded to EX stage mux" :
                   "Branch resolved in EX/MEM → earlier fetches flushed if taken"}
                </div>
              </div>
            );
          }
        }
        return null;
      })()}
    </section>
  );
}

// ─── HAZARD PLAYGROUND ────────────────────────────────────────────────────────
function PlaygroundSection() {
  const REGS = ["X0","X1","X2","X3","X4","X5","X6","X7","X8","X9","X10"];
  const [instrList, setInstrList] = useState([
    { type: "ADD", rd: "X1", rs1: "X2", rs2: "X3" },
    { type: "SUB", rd: "X4", rs1: "X1", rs2: "X5" },
    { type: "LDUR", rd: "X6", rs1: "X7", rs2: null },
    { type: "ADD", rd: "X8", rs1: "X6", rs2: "X9" },
  ]);
  const [analysis, setAnalysis] = useState(null);

  const TYPES = ["ADD","SUB","AND","ORR","LDUR","STUR","CBZ"];

  function addInstr() {
    setInstrList(l => [...l, { type: "ADD", rd: "X0", rs1: "X1", rs2: "X2" }]);
    setAnalysis(null);
  }
  function removeInstr(i) { setInstrList(l => l.filter((_, j) => j !== i)); setAnalysis(null); }
  function updateInstr(i, field, val) {
    setInstrList(l => l.map((ins, j) => j === i ? { ...ins, [field]: val } : ins));
    setAnalysis(null);
  }

  function analyze() {
    const hazards = [];
    const instrs = instrList.map(i => ({
      ...i,
      asm: `${i.type} ${i.rd}, ${i.rs1}${i.rs2 ? ", " + i.rs2 : ""}`,
      dst: (i.type !== "STUR" && i.type !== "CBZ") ? i.rd : null,
      src1: i.rs1, src2: i.rs2, type2: i.type === "LDUR" ? "L" : i.type === "CBZ" ? "B" : "R"
    }));

    for (let i = 1; i < instrs.length; i++) {
      const curr = instrs[i], prev = instrs[i - 1];
      let h = null;
      if (prev.dst && (curr.src1 === prev.dst || curr.src2 === prev.dst)) {
        if (prev.type2 === "L") h = { idx: i, type: "load-use", src: i-1, label: "LOAD-USE HAZARD", color: "#f59e0b", fix: "Insert 1 bubble (stall). Compiler may reorder instructions." };
        else h = { idx: i, type: "raw-fwd", src: i-1, label: "RAW — Forwarding", color: "#22c55e", fix: "EX/MEM→EX or MEM/WB→EX forwarding handles this. No stall needed." };
      }
      if (i + 1 < instrs.length && prev.type2 === "B") {
        hazards.push({ idx: i, type: "control", src: i-1, label: "CONTROL HAZARD", color: "#c084fc", fix: "2 instructions after branch may be flushed if branch taken." });
      }
      if (h) hazards.push(h);
    }
    setAnalysis({ hazards, instrs });
  }

  return (
    <section id="playground" className="section">
      <div className="section-num">09</div>
      <div className="tag tag-amber">Hands-On</div>
      <h1>Hazard Playground</h1>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>
        Build your own instruction sequence and analyze hazards. The system will detect forwarding, stalls, and control hazards.
      </p>

      <div className="grid2">
        <div>
          <h3>Build Instruction Sequence</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {instrList.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", width: 20 }}>I{i + 1}</span>
                <select value={ins.type} onChange={e => updateInstr(i, "type", e.target.value)}
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 12, borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {ins.type !== "CBZ" && (
                  <>
                    <select value={ins.rd} onChange={e => updateInstr(i, "rd", e.target.value)}
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "#fbbf24", fontFamily: "var(--font-mono)", fontSize: 12, borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}>
                      {REGS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <span style={{ color: "var(--text2)", fontSize: 12 }}>,</span>
                  </>
                )}
                <select value={ins.rs1} onChange={e => updateInstr(i, "rs1", e.target.value)}
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: 12, borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}>
                  {REGS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {ins.type !== "LDUR" && ins.type !== "CBZ" && (
                  <>
                    <span style={{ color: "var(--text2)", fontSize: 12 }}>,</span>
                    <select value={ins.rs2 || "X0"} onChange={e => updateInstr(i, "rs2", e.target.value)}
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "#38bdf8", fontFamily: "var(--font-mono)", fontSize: 12, borderRadius: 4, padding: "3px 6px", cursor: "pointer" }}>
                      {REGS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </>
                )}
                <button className="btn btn-danger" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => removeInstr(i)}>✕</button>
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button className="btn btn-secondary" onClick={addInstr}>+ Add Instruction</button>
            <button className="btn btn-primary" onClick={analyze}>🔍 Analyze Hazards</button>
          </div>
        </div>

        <div>
          <h3>Analysis Results</h3>
          {!analysis ? (
            <div style={{ color: "var(--text2)", fontSize: 13, fontStyle: "italic" }}>
              Click "Analyze Hazards" to see results...
            </div>
          ) : analysis.hazards.length === 0 ? (
            <div style={{ background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: 8, padding: 16 }}>
              <div style={{ color: "#4ade80", fontFamily: "var(--font-mono)", fontSize: 13, marginBottom: 8 }}>✅ No hazards detected!</div>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>This sequence can execute without stalls or forwarding.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {analysis.hazards.map((h, i) => (
                <div key={i} style={{ background: h.color + "15", border: `1px solid ${h.color}40`, borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: h.color, fontWeight: 700 }}>{h.label}</span>
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>I{h.src + 1} → I{h.idx + 1}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>{analysis.instrs[h.src].asm}</div>
                  <div style={{ fontSize: 11, color: h.color, margin: "2px 0" }}>↓ {h.type === "raw-fwd" ? "forwarding path" : h.type === "load-use" ? "stall required" : "potential flush"}</div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>{analysis.instrs[h.idx].asm}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text2)", borderTop: "1px solid " + h.color + "30", paddingTop: 8 }}>
                    💡 {h.fix}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── QUIZ SECTION ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "What determines the clock cycle time of a pipelined processor?",
    opts: ["The sum of all stage delays", "The longest stage delay", "The average stage delay", "The number of stages"],
    ans: 1,
    exp: "The clock period must be long enough for the slowest stage to complete. Even if other stages are faster, the pipeline cannot advance until the slowest stage is done."
  },
  {
    q: "In a 5-stage pipeline, a RAW hazard between instruction I and I+1 using forwarding requires:",
    opts: ["0 stall cycles (forwarding handles it)", "1 stall cycle", "2 stall cycles", "3 stall cycles"],
    ans: 0,
    exp: "EX/MEM→EX forwarding allows the ALU result to be passed directly to the next instruction's EX stage. No stall needed for ALU-ALU dependencies."
  },
  {
    q: "Why does a load-use hazard require a 1-cycle stall even with forwarding?",
    opts: ["Load instructions are longer", "Memory data is only available after the MEM stage, but needed at start of EX", "The forwarding unit doesn't detect loads", "The register file needs extra time"],
    ans: 1,
    exp: "A load only gets its data from memory at the END of the MEM stage (cycle 4), but the dependent instruction needs it at the BEGINNING of its EX stage (also cycle 4 for the next instruction). This is a half-cycle too late — a stall is required."
  },
  {
    q: "In the 'predict not taken' branch strategy, what happens if the branch IS taken?",
    opts: ["Nothing, prediction was correct", "Instructions after the branch are flushed", "The pipeline stalls for 2 cycles first", "The branch target is predicted"],
    ans: 1,
    exp: "When predicting not taken, the CPU continues fetching sequential instructions. If the branch is taken, the incorrectly fetched instructions must be converted to NOPs (flushed)."
  },
  {
    q: "Where are control signals generated in the pipeline?",
    opts: ["IF stage", "ID stage", "EX stage", "Each stage generates its own"],
    ans: 1,
    exp: "All control signals are generated in the ID (decode) stage. They then travel forward through pipeline registers, arriving at the stage that needs them (EX signals used in EX, MEM signals in MEM, etc.)"
  },
  {
    q: "What does ForwardA = 10 mean?",
    opts: ["No forwarding — use register file value", "Forward from MEM/WB register", "Forward from EX/MEM register (EX hazard)", "Forward from ID/EX register"],
    ans: 2,
    exp: "ForwardA = 10 (binary) selects the EX/MEM ALUresult. This handles an EX hazard where the previous instruction's result is needed. ForwardA = 01 selects MEM/WB (MEM hazard). ForwardA = 00 is no forward."
  },
];

function QuizSection() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  function select(qi, oi) {
    if (score !== null) return;
    setAnswers(a => ({ ...a, [qi]: oi }));
  }

  function submit() {
    let correct = 0;
    QUESTIONS.forEach((q, i) => { if (answers[i] === q.ans) correct++; });
    setScore(correct);
  }

  function reset() { setAnswers({}); setScore(null); }

  return (
    <section id="quiz" className="section">
      <div className="section-num">10</div>
      <div className="tag tag-purple">Assessment</div>
      <h1>Knowledge Check</h1>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>
        Test your understanding. {QUESTIONS.length} questions covering all topics.
      </p>

      {score !== null && (
        <div style={{ background: score >= 5 ? "#22c55e15" : score >= 3 ? "#f59e0b15" : "#ef444415", border: `1px solid ${score >= 5 ? "#22c55e40" : score >= 3 ? "#f59e0b40" : "#ef444440"}`, borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 24, color: score >= 5 ? "#4ade80" : score >= 3 ? "#fbbf24" : "#f87171", marginBottom: 8 }}>
            Score: {score} / {QUESTIONS.length}
          </div>
          <p style={{ fontSize: 13 }}>
            {score === QUESTIONS.length ? "🏆 Perfect! You have mastered pipeline concepts!" :
             score >= 5 ? "🎯 Excellent! Review any missed questions below." :
             score >= 3 ? "📚 Good effort! Review the explanations and revisit the relevant sections." :
             "🔄 Keep studying! Use the interactive simulator and datapath viewer to reinforce concepts."}
          </p>
          <button className="btn btn-secondary" onClick={reset} style={{ marginTop: 12 }}>Try Again</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {QUESTIONS.map((q, qi) => (
          <div key={qi} className="card">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", marginBottom: 8 }}>Q{qi + 1}</div>
            <p style={{ fontSize: 15, color: "var(--text)", marginBottom: 16, fontWeight: 500 }}>{q.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.opts.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const revealed = score !== null;
                const correct = oi === q.ans;
                let cls = "quiz-opt";
                if (revealed && correct) cls += " correct";
                else if (revealed && selected && !correct) cls += " wrong";
                else if (!revealed && selected) cls += " correct"; // show as "selected"
                return (
                  <button key={oi} className={cls} onClick={() => select(qi, oi)}
                    style={{ position: "relative", paddingLeft: 32 }}>
                    <span style={{ position: "absolute", left: 12, color: "inherit" }}>
                      {revealed ? (correct ? "✓" : selected ? "✗" : "○") : selected ? "●" : "○"}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {score !== null && (
              <div style={{ marginTop: 12, background: "#00d4ff10", border: "1px solid #00d4ff20", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "var(--text2)" }}>
                💡 {q.exp}
              </div>
            )}
          </div>
        ))}
      </div>

      {score === null && Object.keys(answers).length === QUESTIONS.length && (
        <button className="btn btn-primary" onClick={submit} style={{ marginTop: 20, fontSize: 14, padding: "14px 32px" }}>
          Submit Answers
        </button>
      )}
      {score === null && Object.keys(answers).length < QUESTIONS.length && (
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text2)" }}>
          Answer all {QUESTIONS.length} questions to submit. ({Object.keys(answers).length}/{QUESTIONS.length} answered)
        </p>
      )}
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span>PIPELINE</span>
            LAB
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(item => (
              <a key={item.id} className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                href={`#${item.id}`}
                onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); }}>
                <span>{item.icon}</span>
                <span>{item.label.replace(/^.{2} /, "")}</span>
              </a>
            ))}
          </nav>
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", fontSize: 10, fontFamily: "var(--font-mono)", color: "#2a4a7f" }}>
            LEGv8 Architecture<br />Computer Organization
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          <IntroSection />
          <PipelineSection />
          <StagesSection />
          <DatapathSection />
          <HazardsSection />
          <ForwardingSection />
          <ControlSection />
          <SimulatorSection />
          <PlaygroundSection />
          <QuizSection />
          <section id="formulas" className="section" style={{ background: "#060a14" }}>
            <FormulaBrain />
          </section>
        </main>
      </div>
    </>
  );
}

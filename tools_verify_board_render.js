#!/usr/bin/env node
// Regression test for js/board-render.js (modularization step 8).
// The OLD builders read a global state.workspace; the extracted module takes the
// workspace explicitly. With identical injected deps, the HTML must be identical.
//   node tools_verify_board_render.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/board-render.js"), "utf8");

const stub = `
  const PINS = {
    "S1.out": { label: "מוצא", x: 56, y: 0, direction: "out" },
    "N1.in1": { label: "כניסה 1", x: -66, y: -20, direction: "in" },
    "N1.in2": { label: "כניסה 2", x: -66, y: 20, direction: "in" },
    "N1.out": { label: "מוצא", x: 88, y: 0, direction: "out" },
    "L1.in":  { label: "כניסה", x: 0, y: -60, direction: "in" }
  };
  const DEFS = {
    source: { pins: { out: PINS["S1.out"] } },
    nand:   { pins: { in1: PINS["N1.in1"], in2: PINS["N1.in2"], out: PINS["N1.out"] } },
    lamp:   { pins: { in: PINS["L1.in"] } },
    notCard:{ fixed: true, pins: {} }
  };
  const WS = {
    components: [
      { id: "S1", type: "source", x: 120, y: 260 },
      { id: "N1", type: "nand", x: 400, y: 300 },
      { id: "L1", type: "lamp", x: 700, y: 300 },
      { id: "F1", type: "notCard", x: 500, y: 500 }
    ],
    wires: [ { a: "S1.out", b: "N1.in1" }, { a: "N1.out", b: "L1.in" }, { a: "S1.out", b: "GONE.in" } ],
    selectedTerminal: "N1.in1",
    accident: { type: "nand-overvoltage", nandId: "N1" }
  };
  const EVAL = { lamps: new Map([["L1", true]]) };
  const state = { workspace: WS };
  function wireKey(a,b){ return [a,b].sort().join("|"); }
  function esc(v){ return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
  function componentDef(type){ return DEFS[type] || null; }
  function componentById(ws,id){ return ws.components.find(c=>c.id===id)||null; }
  function terminalPosition(ws, ref){ const dot=String(ref).lastIndexOf("."); if(dot<1) return null; const c=componentById(ws, ref.slice(0,dot)); const p=PINS[ref]; return c&&p ? { x:c.x+p.x, y:c.y+p.y } : null; }
  function solutionHighlightConfig(){ return { terminals: new Set(["N1.out","L1.in"]), wires: new Set([wireKey("N1.out","L1.in")]), components: new Set(["N1"]), truthRows: new Set() }; }
  function componentMarkup(type, opts){ return "[MK "+type+" lampOn="+String(!!(opts&&opts.lampOn))+"]"; }
  function charredNandMarkup(){ return "[CHAR]"; }
  function smokeMarkup(){ return "[SMOKE]"; }
  function isFixedWorkspaceComponent(c){ return !!(c && (DEFS[c.type]?.fixed || c.id === "S1")); }
`;

const OLD_SRC = `
  function renderWires(){ const highlight = solutionHighlightConfig(); return state.workspace.wires.map((wire) => { const a = terminalPosition(state.workspace, wire.a); const b = terminalPosition(state.workspace, wire.b); if (!a || !b) return ""; const key = wireKey(wire.a, wire.b); const highlightClass = highlight.wires.has(key) ? " wire-highlight" : ""; return \`
        <g class="wire\${highlightClass}" data-action="workspace-wire" data-wire-key="\${esc(key)}" role="button" tabindex="0" aria-label="מחק כבל">
          <line class="wire-line" x1="\${a.x}" y1="\${a.y}" x2="\${b.x}" y2="\${b.y}" />
          <line class="wire-hit-line" x1="\${a.x}" y1="\${a.y}" x2="\${b.x}" y2="\${b.y}" />
        </g>\`; }).join(""); }
  function renderTerminals(){ const highlight = solutionHighlightConfig(); return state.workspace.components.map((component) => { const def = componentDef(component.type); return Object.entries(def.pins).map(([pinId, pin]) => { const ref = \`\${component.id}.\${pinId}\`; const selected = state.workspace.selectedTerminal === ref ? " terminal-selected" : ""; const solutionClass = highlight.terminals.has(ref) ? " terminal-solution-highlight" : ""; return \`<circle class="terminal-hit\${selected}\${solutionClass}" data-action="workspace-terminal" data-terminal-ref="\${esc(ref)}" aria-label="\${esc(pin.label)}" role="button" tabindex="0" cx="\${component.x + pin.x}" cy="\${component.y + pin.y}" r="12"></circle>\`; }).join(""); }).join(""); }
  function renderComponent(component, evaluation){ if (componentDef(component.type)?.fixed) return ""; const lampOn = component.type === "lamp" ? evaluation.lamps.get(component.id) : false; const smoking = state.workspace.accident?.type === "nand-overvoltage" && state.workspace.accident.nandId === component.id; const burnedClass = smoking && component.type === "nand" ? " component-nand-burned" : ""; const fixedClass = isFixedWorkspaceComponent(component) ? " component-fixed" : ""; const solutionHighlightClass = solutionHighlightConfig().components.has(component.id) ? " component-solution-highlight" : ""; return \`
      <g class="workspace-component component-\${esc(component.type)}\${burnedClass}\${fixedClass}\${solutionHighlightClass}" data-action="workspace-component" data-component-id="\${esc(component.id)}" transform="translate(\${component.x} \${component.y})">
        \${componentMarkup(component.type, { lampOn })}
        \${smoking ? charredNandMarkup() : ""}
        \${smoking ? smokeMarkup() : ""}
      </g>\`; }
  return { renderWires, renderTerminals, renderComponent };
`;

const OLD = new Function(stub + OLD_SRC)();
const NEW = new Function(stub + MODULE_SRC + "\n return createBoardRender({ solutionHighlightConfig, terminalPosition, wireKey, esc, componentDef, componentMarkup, charredNandMarkup, smokeMarkup, isFixedWorkspaceComponent });")();
const WS = new Function(stub + "return WS;")();
const EVAL = new Function(stub + "return EVAL;")();

let pass = 0, fail = 0;
const cmp = (label, a, b) => { const ok = a === b; ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${JSON.stringify(a)}\n    new=${JSON.stringify(b)}`); };

console.log("Board render (wires/terminals/components): old-vs-new equivalence\n");
cmp("renderWires", OLD.renderWires(), NEW.renderWires(WS));
cmp("renderTerminals", OLD.renderTerminals(), NEW.renderTerminals(WS));
WS.components.forEach((c) => cmp(`renderComponent(${c.id})`, OLD.renderComponent(c, EVAL), NEW.renderComponent(c, EVAL, WS)));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

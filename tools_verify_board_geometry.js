#!/usr/bin/env node
// Regression test for js/board-geometry.js (modularization step 7).
// Confirms terminalPosition and clampComponentPosition match the pre-extraction
// versions over a corpus, and that the factory injects its dependencies.
//   node tools_verify_board_geometry.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/board-geometry.js"), "utf8");

const stub = `
  const WS = { components: [ { id: "N1", type: "nand", x: 400, y: 300 }, { id: "S1", type: "source", x: 120, y: 260 } ] };
  const PINS = { "N1.in1": { x: -66, y: -20 }, "N1.in2": { x: -66, y: 20 }, "N1.out": { x: 88, y: 0 }, "S1.out": { x: 56, y: 0 } };
  function componentById(ws, id){ return ws.components.find(c => c.id === id) || null; }
  function pinDefFor(ws, ref){ const dot = String(ref).lastIndexOf("."); if (dot < 1) return null; const id = ref.slice(0, dot); const c = componentById(ws, id); const p = PINS[ref]; return c && p ? { component: c, pin: p, pinId: ref.slice(dot + 1) } : null; }
  const BOUNDS = { source: { left:20, right:20, top:20, bottom:20 }, nand: { left:66, right:88, top:52, bottom:52 }, lamp: { left:55, right:55, top:100, bottom:40 } };
  function componentDef(type){ return BOUNDS[type] ? { bounds: BOUNDS[type] } : null; }
  function workspaceBoardSize(){ return { width: 1000, height: 600 }; }
`;

const OLD_SRC = `
  function terminalPosition(workspace, ref, overrides = null){ const info = pinDefFor(workspace, ref); if (!info) return null; const override = overrides?.[info.component.id]; const x = override?.x ?? info.component.x; const y = override?.y ?? info.component.y; return { x: x + info.pin.x, y: y + info.pin.y }; }
  function clampComponentPosition(type, x, y){ const size = workspaceBoardSize(); const bounds = componentDef(type)?.bounds || { left: 8, right: 8, top: 8, bottom: 8 }; const minX = Math.min(bounds.left, size.width - bounds.right); const maxX = Math.max(bounds.left, size.width - bounds.right); const minY = Math.min(bounds.top, size.height - bounds.bottom); const maxY = Math.max(bounds.top, size.height - bounds.bottom); return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) }; }
  return { terminalPosition, clampComponentPosition };
`;

const OLD = new Function(stub + OLD_SRC)();
const NEW = new Function(stub + MODULE_SRC + "\n return createBoardGeometry({ pinDefFor, componentDef, workspaceBoardSize });")();
const WS = new Function(stub + "return WS;")();

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const cmp = (label, a, b) => { const ok = S(a) === S(b); ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}  old=${S(a)} new=${S(b)}`); };

console.log("Board geometry: old-vs-new equivalence\n");

// terminalPosition: valid/invalid refs, with and without overrides
const refs = ["N1.in1", "N1.in2", "N1.out", "S1.out", "N1.nope", "X.out", "bad", ""];
const overridesList = [null, { N1: { x: 700, y: 100 } }, { S1: { x: 0, y: 0 } }, { N1: {} }];
refs.forEach((r) => overridesList.forEach((ov, oi) => {
  cmp(`terminalPosition(${S(r)}, ov#${oi})`, OLD.terminalPosition(WS, r, ov), NEW.terminalPosition(WS, r, ov));
}));

// clampComponentPosition: inside, outside on each side, unknown type
const types = ["source", "nand", "lamp", "wat"];
const pts = [[500, 300], [-100, -100], [5000, 5000], [0, 0], [1000, 600], [700, 250]];
types.forEach((t) => pts.forEach(([x, y]) => {
  cmp(`clampComponentPosition(${t}, ${x}, ${y})`, OLD.clampComponentPosition(t, x, y), NEW.clampComponentPosition(t, x, y));
}));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

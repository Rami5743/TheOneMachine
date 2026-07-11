#!/usr/bin/env node
// Regression test for js/wire-ops.js (modularization step 9).
// Confirms the extracted wire operations (including the click-to-toggle rule)
// mutate the workspace exactly like the pre-extraction versions, over a corpus,
// using a realistic canAddWire from the actual workbench-model.
//   node tools_verify_wire_ops.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/wire-ops.js"), "utf8");
const WB_SRC = fs.readFileSync(path.join(process.cwd(), "js/workbench-model.js"), "utf8");

const stub = `
  function splitTerminalRef(ref){ const i=String(ref).lastIndexOf("."); if(i<1) return null; return {componentId:ref.slice(0,i), pinId:ref.slice(i+1)}; }
  function componentById(ws,id){ return ws.components.find(c=>c.id===id)||null; }
  function pinIdsFor(type){ if(type==="source") return ["out"]; if(type==="nand") return ["in1","in2","out"]; if(type==="lamp") return ["in"]; if(String(type).startsWith("gate-")) return ["in1","in2","out"]; if(String(type).startsWith("taskCard-")) return ["inputExt1","inputExt2","outputExt","inputInt1","outputInt"]; return []; }
  function terminalExists(ws,ref){ const p=splitTerminalRef(ref); if(!p) return false; const c=componentById(ws,p.componentId); return !!(c && pinIdsFor(c.type).includes(p.pinId)); }
  function terminalDirection(ws,ref){ const p=splitTerminalRef(ref); if(!p) return null; if(p.pinId==="out"||p.pinId==="outputExt") return "out"; if(/^inputInt\\d*$/.test(p.pinId)) return "out"; return "in"; }
  function isNandOutputRef(ws,ref){ const p=splitTerminalRef(ref); const c=p&&componentById(ws,p.componentId); return !!(c&&c.type==="nand"&&p.pinId==="out"); }
  function normalizeWire(a,b){ const [x,y]=[a,b].sort(); return {a:x,b:y}; }
  function otherWireEnd(wire,ref){ if(wire.a===ref) return wire.b; if(wire.b===ref) return wire.a; return null; }
  function wireKey(a,b){ return [a,b].sort().join("|"); }
  function canonicalTaskFrameWire(ws,a,b){ return [a,b]; }
  function inputRefOf(ws,a,b){ return __wb.inputRefOf(ws,a,b); }
  function componentGraphHasPath(ws,wires,fromId,toId){ let removed=false; const edges=[];
    for(const w of wires){ const pa=splitTerminalRef(w.a), pb=splitTerminalRef(w.b); if(!pa||!pb) continue; const set=new Set([pa.componentId,pb.componentId]);
      if(!removed && set.has(fromId) && set.has(toId)){ removed=true; continue; } edges.push([pa.componentId,pb.componentId]); }
    const adj={}; for(const [u,v] of edges){ (adj[u]=adj[u]||new Set()).add(v); (adj[v]=adj[v]||new Set()).add(u); }
    const seen=new Set([fromId]); const q=[fromId]; while(q.length){ const u=q.shift(); if(u===toId) return true; for(const v of (adj[u]||[])) if(!seen.has(v)){seen.add(v);q.push(v);} } return false; }
  ${WB_SRC}
  const __wb = createWorkbenchModel({terminalDirection, terminalExists, splitTerminalRef, componentById, componentGraphHasPath, normalizeWire, isNandOutputRef});
  function canAddWire(ws,a,b,wires,enforceInputVacancy){ return __wb.canAddWire(ws,a,b,wires,enforceInputVacancy); }
  const DEPS = { otherWireEnd, splitTerminalRef, terminalExists, inputRefOf, wireKey, normalizeWire, canonicalTaskFrameWire, canAddWire };
`;

const OLD_SRC = `
  function connectedTerminals(workspace, ref){ const result = new Set([ref]); const queue = [ref]; while (queue.length){ const current = queue.shift(); for (const wire of workspace.wires){ const next = otherWireEnd(wire, current); if (!next || result.has(next)) continue; result.add(next); queue.push(next); } } return result; }
  function removeInvalidWires(workspace){ const componentIds = new Set(workspace.components.map((c) => c.id)); workspace.wires = workspace.wires.filter((wire) => { const a = splitTerminalRef(wire.a); const b = splitTerminalRef(wire.b); return a && b && componentIds.has(a.componentId) && componentIds.has(b.componentId); }); }
  function removeWiresAt(workspace, ref){ workspace.wires = workspace.wires.filter((wire) => wire.a !== ref && wire.b !== ref); }
  function addTestWire(workspace, a, b){ if (!terminalExists(workspace, a) || !terminalExists(workspace, b) || a === b) return; const inputRef = inputRefOf(workspace, a, b); if (inputRef) removeWiresAt(workspace, inputRef); const key = wireKey(a, b); if (!workspace.wires.some((wire) => wireKey(wire.a, wire.b) === key)){ workspace.wires.push(normalizeWire(a, b)); } }
  function applyWireToggle(workspace, a, b){ const [wireA, wireB] = canonicalTaskFrameWire(workspace, a, b); const key = wireKey(wireA, wireB); const existing = workspace.wires.some((wire) => wireKey(wire.a, wire.b) === key); if (existing){ workspace.wires = workspace.wires.filter((wire) => wireKey(wire.a, wire.b) !== key); workspace.selectedTerminal = null; return; } if (!canAddWire(workspace, wireA, wireB, workspace.wires, true)){ workspace.selectedTerminal = null; return; } workspace.wires.push(normalizeWire(wireA, wireB)); workspace.selectedTerminal = null; }
  return { connectedTerminals, removeInvalidWires, removeWiresAt, addTestWire, applyWireToggle };
`;

const OLD = new Function(stub + OLD_SRC)();
const NEW = new Function(stub + MODULE_SRC + "\n return createWireOps(DEPS);")();

const comps = [
  { id: "S", type: "source" }, { id: "N", type: "nand" }, { id: "M", type: "nand" },
  { id: "G", type: "gate-And" }, { id: "L", type: "lamp" }
];
const W = (wires, sel = null) => ({ components: comps.map((c) => ({ ...c })), wires: wires.map(([a, b]) => ({ a, b })), selectedTerminal: sel });
const clone = (ws) => JSON.parse(JSON.stringify(ws));
const norm = (ws) => ({ wires: ws.wires.map((w) => [w.a, w.b].sort().join("|")).sort(), selectedTerminal: ws.selectedTerminal ?? null });

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const cmpMut = (label, ws, run) => { const wo = clone(ws), wn = clone(ws); run(OLD, wo); run(NEW, wn); const ok = S(norm(wo)) === S(norm(wn)); ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${S(norm(wo))}\n    new=${S(norm(wn))}`); };
const cmpVal = (label, a, b) => { const ok = S(a) === S(b); ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}  old=${S(a)} new=${S(b)}`); };

console.log("Wire operations: old-vs-new equivalence\n");

// connectedTerminals (read-only)
const wired = W([["S.out", "N.in1"], ["N.out", "L.in"]]);
["S.out", "N.in1", "N.out", "L.in", "M.in1", "X.y"].forEach((r) =>
  cmpVal(`connectedTerminals(${r})`, [...OLD.connectedTerminals(wired, r)].sort(), [...NEW.connectedTerminals(wired, r)].sort()));

// removeInvalidWires
cmpMut("removeInvalidWires", W([["S.out", "N.in1"], ["GONE.out", "L.in"], ["N.out", "X.in"]]), (M, ws) => M.removeInvalidWires(ws));

// removeWiresAt
cmpMut("removeWiresAt(N.in1)", W([["S.out", "N.in1"], ["M.out", "N.in1"], ["N.out", "L.in"]]), (M, ws) => M.removeWiresAt(ws, "N.in1"));

// addTestWire: new, duplicate, self, invalid, input-replacement
cmpMut("addTestWire new", W([]), (M, ws) => M.addTestWire(ws, "S.out", "N.in1"));
cmpMut("addTestWire dup", W([["S.out", "N.in1"]]), (M, ws) => M.addTestWire(ws, "S.out", "N.in1"));
cmpMut("addTestWire self", W([]), (M, ws) => M.addTestWire(ws, "S.out", "S.out"));
cmpMut("addTestWire invalid", W([]), (M, ws) => M.addTestWire(ws, "S.out", "X.in"));
cmpMut("addTestWire replaces input", W([["M.out", "N.in1"]]), (M, ws) => M.addTestWire(ws, "S.out", "N.in1"));

// applyWireToggle: remove existing, add new, reject illegal, dangerous short, input-replace
cmpMut("toggle remove", W([["S.out", "N.in1"]], "S.out"), (M, ws) => M.applyWireToggle(ws, "S.out", "N.in1"));
cmpMut("toggle add", W([], "S.out"), (M, ws) => M.applyWireToggle(ws, "S.out", "N.in1"));
cmpMut("toggle reject in-in", W([], "N.in1"), (M, ws) => M.applyWireToggle(ws, "N.in1", "M.in1"));
cmpMut("toggle dangerous short", W([], "N.out"), (M, ws) => M.applyWireToggle(ws, "N.out", "M.out"));
cmpMut("toggle rejects occupied input", W([["M.out", "N.in1"]], "S.out"), (M, ws) => M.applyWireToggle(ws, "S.out", "N.in1"));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

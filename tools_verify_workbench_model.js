#!/usr/bin/env node
// Regression test for js/workbench-model.js (modularization step 3).
// Loads the wiring-rule model, injects a small component/pin model, and checks
// the connection rules. Run from the project root:
//   node tools_verify_workbench_model.js
const fs = require("fs");
const path = require("path");
const SRC = fs.readFileSync(path.join(process.cwd(), "js/workbench-model.js"), "utf8");

// Injected host model (mirrors app.js conventions closely enough to test rules).
const stub = `
  function otherWireEnd(wire, ref){ if(wire.a===ref) return wire.b; if(wire.b===ref) return wire.a; return null; }
  function splitTerminalRef(ref){ const i=ref.indexOf("."); if(i<0) return null; return {componentId:ref.slice(0,i), pinId:ref.slice(i+1)}; }
  function componentById(ws,id){ return ws.components.find(c=>c.id===id)||null; }
  function terminalDirection(ws,ref){ const p=splitTerminalRef(ref); if(!p) return null;
    if(p.pinId==="out"||p.pinId==="outputExt") return "out";
    if(/^inputInt\\d+$/.test(p.pinId)) return "out";
    return "in"; }
  function terminalExists(ws,ref){ const p=splitTerminalRef(ref); return !!(p && componentById(ws,p.componentId) && p.pinId); }
  function isNandOutputRef(ws,ref){ const p=splitTerminalRef(ref); const c=p&&componentById(ws,p.componentId); return !!(c&&c.type==="nand"&&p.pinId==="out"); }
  function normalizeWire(a,b){ const [x,y]=[a,b].sort(); return {a:x,b:y}; }
  function componentGraphHasPath(ws,wires,fromId,toId){
    // A new single edge is not a cycle: ignore one direct candidate edge, then
    // test whether fromId and toId are still connected via the remaining wires.
    let removed=false; const edges=[];
    for(const w of wires){ const pa=splitTerminalRef(w.a), pb=splitTerminalRef(w.b); if(!pa||!pb) continue;
      const set=new Set([pa.componentId,pb.componentId]);
      if(!removed && set.has(fromId) && set.has(toId)){ removed=true; continue; }
      edges.push([pa.componentId,pb.componentId]); }
    const adj={}; for(const [u,v] of edges){ (adj[u]=adj[u]||new Set()).add(v); (adj[v]=adj[v]||new Set()).add(u); }
    const seen=new Set([fromId]); const q=[fromId];
    while(q.length){ const u=q.shift(); if(u===toId) return true; for(const v of (adj[u]||[])) if(!seen.has(v)){seen.add(v);q.push(v);} }
    return false; }
`;
const deps = "{terminalDirection, terminalExists, splitTerminalRef, componentById, componentGraphHasPath, normalizeWire, isNandOutputRef}";
const model = new Function(stub + SRC + "\n return createWorkbenchModel(" + deps + ");")();

const comp = (id, type) => ({ id, type });
const W = (components, wires) => ({ components, wires: wires.map(([a, b]) => ({ a, b })) });
const base = [comp("S", "source"), comp("N", "nand"), comp("M", "nand"), comp("G", "gate-And"), comp("L", "lamp"), comp("C", "taskCard-Xor")];
const mk = (wires) => W(base, wires);

let pass = 0, fail = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const C = (name, got, exp) => { (eq(got, exp) ? pass++ : fail++); console.log(`  [${eq(got, exp) ? "PASS" : "FAIL"}] ${name}${eq(got, exp) ? "" : "  (got " + JSON.stringify(got) + ", expected " + JSON.stringify(exp) + ")"}`); };

console.log("Workbench-model (wiring rules) verification\n");

// inputRefOf / outputRefOf
C("inputRefOf picks the input end", model.inputRefOf(mk([]), "S.out", "N.in1"), "N.in1");
C("outputRefOf picks the output end", model.outputRefOf(mk([]), "S.out", "N.in1"), "S.out");
C("inputRefOf rejects out-out", model.inputRefOf(mk([]), "S.out", "N.out"), null);

// dangerousPowerWireInfo (short between two outputs, at least one NAND)
C("two NAND outputs are dangerous", !!model.dangerousPowerWireInfo(mk([]), "N.out", "M.out"), true);
C("source+NAND outputs are dangerous", !!model.dangerousPowerWireInfo(mk([]), "S.out", "N.out"), true);
C("out-out without NAND is not dangerous", model.dangerousPowerWireInfo(mk([]), "S.out", "G.out"), null);
C("out-in is not dangerous", model.dangerousPowerWireInfo(mk([]), "S.out", "N.in1"), null);

// canAddWire
C("out -> in is allowed", model.canAddWire(mk([]), "S.out", "N.in1"), true);
C("in -> in is rejected", model.canAddWire(mk([]), "N.in1", "M.in1"), false);
C("same terminal is rejected", model.canAddWire(mk([]), "S.out", "S.out"), false);
C("same component is rejected", model.canAddWire(mk([]), "N.out", "N.in1"), false);
C("nonexistent terminal is rejected", model.canAddWire(mk([]), "X.out", "N.in1"), false);
C("occupied input blocks a second wire", model.canAddWire(mk([["N.out", "L.in"]]), "S.out", "L.in"), false);
C("dangerous NAND short is allowed", model.canAddWire(mk([]), "N.out", "M.out"), true);
C("out-out without NAND is rejected", model.canAddWire(mk([]), "S.out", "G.out"), false);
C("wire touching a task frame is allowed", model.canAddWire(mk([]), "G.out", "C.inputExt1"), true);

// The NAND short (burning the NAND) is only permitted in the NAND-presentation
// workbench. In a task-card build (taskId set) or the free "empty table"
// (freeBuild set) the same output-to-output short must be rejected.
const withTask = { ...mk([]), taskId: "Xor" };
const withFree = { ...mk([]), freeBuild: true };
C("dangerous NAND short rejected in task-card build", model.canAddWire(withTask, "N.out", "M.out"), false);
C("source+NAND short rejected in task-card build", model.canAddWire(withTask, "S.out", "N.out"), false);
C("dangerous NAND short rejected in free build", model.canAddWire(withFree, "N.out", "M.out"), false);

// A task card's own internal input piped straight to its internal output is a
// permitted passthrough; the same self-wire on a non-card is still rejected.
C("card internal input -> output passthrough allowed", model.canAddWire(mk([]), "C.inputInt1", "C.outputInt"), true);
C("non-card self-wire still rejected", model.canAddWire(mk([]), "N.in1", "N.out"), false);

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

#!/usr/bin/env node
// Regression test for js/accident-observation.js (modularization step 11).
// OLD runs the extracted bodies with deps in scope; NEW runs them through the
// factory with deps INJECTED. A missing injection makes NEW throw. Both are
// exercised over crafted workspaces (accident / no accident / observations).
//   node tools_verify_accident_observation.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/accident-observation.js"), "utf8");
const RAW = MODULE_SRC.split("isNandOutputRef\n}) {\n")[1].split("\n  return {")[0];
const RET = "\n return { detectWorkspaceAccident, updateNandOutputObservation };";

const stub = `
  function split(ref){ const i=String(ref).lastIndexOf("."); return i<1?null:{id:ref.slice(0,i),pin:ref.slice(i+1)}; }
  function otherWireEnd(wire, ref){ if(wire.a===ref) return wire.b; if(wire.b===ref) return wire.a; return null; }
  function connectedTerminals(ws, ref){ const seen=new Set([ref]); const q=[ref]; while(q.length){ const c=q.shift(); for(const w of ws.wires){ const n=otherWireEnd(w,c); if(n&&!seen.has(n)){ seen.add(n); q.push(n); } } } return seen; }
  function terminalDirection(ws, ref){ const p=split(ref); if(!p) return null; if(p.pin==="out"||p.pin==="outputExt") return "out"; if(/^inputInt\\d*$/.test(p.pin)) return "out"; return "in"; }
  function isNandOutputRef(ws, ref){ const p=split(ref); const c=p&&ws.components.find(x=>x.id===p.componentId||x.id===p.id); return !!(c&&c.type==="nand"&&p.pin==="out"); }
  function evaluateWorkspace(ws){ return { outputs: new Map(ws.__outputs || []), lamps: new Map(ws.__lamps || []) }; }
  const DEPS = { evaluateWorkspace, connectedTerminals, terminalDirection, otherWireEnd, isNandOutputRef };
`;

const OLD = new Function(stub + RAW + RET)();
const NEW = new Function(stub + MODULE_SRC + "\n return createAccidentObservation(DEPS);")();

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const clone = (o) => JSON.parse(JSON.stringify(o));
const cmpVal = (label, run) => { let a,b,err=null; try{a=run(OLD);}catch(e){err="OLD:"+e.message;} try{b=run(NEW);}catch(e){err=(err?err+" | ":"")+"NEW:"+e.message;} const ok=!err&&S(a)===S(b); ok?pass++:fail++; if(!ok) console.log(`  [FAIL] ${label}  ${err||"got "+S(a)+" vs "+S(b)}`); };
const cmpMut = (label, ws, run) => { const wo=clone(ws), wn=clone(ws); let err=null; try{run(OLD,wo);}catch(e){err="OLD:"+e.message;} try{run(NEW,wn);}catch(e){err=(err?err+" | ":"")+"NEW:"+e.message;} const strip=(w)=>({nandOutputObserved:w.nandOutputObserved,understoodPromptShown:w.understoodPromptShown,selectedTerminal:w.selectedTerminal}); const ok=!err&&S(strip(wo))===S(strip(wn)); ok?pass++:fail++; if(!ok) console.log(`  [FAIL] ${label}  ${err||S(strip(wo))+" vs "+S(strip(wn))}`); };

console.log("Accident detection & NAND-output observation: old-vs-new equivalence\n");

// --- detectWorkspaceAccident ---
const accidentWs = {
  components: [ {id:"N1",type:"nand"}, {id:"S1",type:"source"}, {id:"S2",type:"source"}, {id:"S3",type:"source"} ],
  wires: [ {a:"N1.in1",b:"S1.out"}, {a:"N1.in2",b:"S2.out"}, {a:"N1.out",b:"S3.out"} ],
  __outputs: [ ["S1.out",true], ["S2.out",true], ["S3.out",true], ["N1.out",true] ]
};
const safeWs = {
  components: [ {id:"N1",type:"nand"}, {id:"S1",type:"source"} ],
  wires: [ {a:"N1.in1",b:"S1.out"} ],
  __outputs: [ ["S1.out",true], ["N1.out",false] ]
};
cmpVal("detect accident (burned NAND)", (M) => M.detectWorkspaceAccident(accidentWs));
cmpVal("detect no accident", (M) => M.detectWorkspaceAccident(safeWs));
cmpVal("detect on empty", (M) => M.detectWorkspaceAccident({ components: [], wires: [], __outputs: [] }));

// --- updateNandOutputObservation ---
const observeBoth = {
  taskId: null, accident: null, understoodPromptShown: false, understoodButtonVisible: false, nandMonologueStep: null,
  nandOutputObserved: { zero: false, one: false }, selectedTerminal: "x",
  components: [ {id:"N1",type:"nand"}, {id:"N2",type:"nand"}, {id:"L1",type:"lamp"}, {id:"L2",type:"lamp"} ],
  wires: [ {a:"L1.in",b:"N1.out"}, {a:"L2.in",b:"N2.out"} ],
  __outputs: [ ["N1.out",true], ["N2.out",false] ]
};
const observeOne = { ...clone(observeBoth), wires: [ {a:"L1.in",b:"N1.out"} ], __outputs: [ ["N1.out",true] ] };
const skipTask = { ...clone(observeBoth), taskId: "And" };
const skipAccident = { ...clone(observeBoth), accident: { type: "nand-overvoltage", nandId: "N1" } };
cmpMut("observe both 0 and 1 -> understood", observeBoth, (M, ws) => M.updateNandOutputObservation(ws));
cmpMut("observe only 1", observeOne, (M, ws) => M.updateNandOutputObservation(ws));
cmpMut("skip when task active", skipTask, (M, ws) => M.updateNandOutputObservation(ws));
cmpMut("skip when accident present", skipAccident, (M, ws) => M.updateNandOutputObservation(ws));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

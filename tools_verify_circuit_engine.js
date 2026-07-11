#!/usr/bin/env node
// Regression test for js/circuit-engine.js (modularization step 2).
// Loads the engine, injects a direction/taskDef model, builds known circuits
// and checks their truth tables. Run from the project root:
//   node tools_verify_circuit_engine.js
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

// Real task definitions from app-data.js.
const DATA = read("js/app-data.js");
const mm = DATA.match(/  const TASK_DEFS = \[[\s\S]*?\n  \];/);
if (!mm) { console.error("TASK_DEFS not found in app-data.js"); process.exit(1); }
const TASK_DEFS = eval("(" + mm[0].replace(/^\s*const TASK_DEFS =\s*/, "").replace(/;\s*$/, "") + ")");

// Injected host model (same conventions app.js uses).
const terminalDirection = (ws, ref) => {
  if (/\.out$/.test(ref)) return "out";
  if (/\.outputExt$/.test(ref)) return "out";
  if (/\.inputInt\d+$/.test(ref)) return "out";
  return "in";
};
const taskDefById = (id) => TASK_DEFS.find((t) => t.id === id) || null;

// Load the engine in a local scope and build it.
const makeEngine = new Function(
  "terminalDirection", "taskDefById",
  read("js/circuit-engine.js") + "\n return createCircuitEngine({ terminalDirection, taskDefById });"
);
const engine = makeEngine(terminalDirection, taskDefById);
const evaluate = (ws) => engine.evaluateWorkspace(ws);

// Circuit builders.
const W = (components, wires) => ({ components, wires });
const wire = (a, b) => ({ a, b });
const src = (id) => ({ id, type: "source" });
const lamp = (id) => ({ id, type: "lamp" });
const nand = (id) => ({ id, type: "nand" });
const gate = (id, tid) => ({ id, type: "gate-" + tid });

let pass = 0, fail = 0;
const check = (name, ws, expected) => {
  const res = evaluate(ws);
  let ok = true, detail = "";
  for (const [lid, val] of Object.entries(expected)) {
    const got = res.lamps.get(lid);
    if (got !== val) { ok = false; detail += ` ${lid}: expected ${val}, got ${got}`; }
  }
  (ok ? pass++ : fail++);
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${name}${ok ? "" : " ->" + detail}`);
};

console.log("Circuit-engine verification\n");

check("source -> lamp on", W([src("S"), lamp("L")], [wire("S.out", "L.in")]), { L: true });
check("floating lamp off", W([lamp("L")], []), { L: false });

// NAND truth table (an unwired input reads as 0).
for (const a of [0, 1]) for (const b of [0, 1]) {
  const comps = [nand("N"), lamp("L")], wires = [wire("N.out", "L.in")];
  if (a) { comps.push(src("A")); wires.push(wire("A.out", "N.in1")); }
  if (b) { comps.push(src("B")); wires.push(wire("B.out", "N.in2")); }
  check(`NAND(${a},${b})`, W(comps, wires), { L: !(a && b) });
}

// Gate truth tables.
const gates = { And: (a, b) => !!(a && b), Or: (a, b) => !!(a || b), Xor: (a, b) => (!!a !== !!b) };
for (const [tid, fn] of Object.entries(gates))
  for (const a of [0, 1]) for (const b of [0, 1]) {
    const comps = [gate("G", tid), lamp("L")], wires = [wire("G.out", "L.in")];
    if (a) { comps.push(src("A")); wires.push(wire("A.out", "G.in1")); }
    if (b) { comps.push(src("B")); wires.push(wire("B.out", "G.in2")); }
    check(`${tid}(${a},${b})`, W(comps, wires), { L: fn(a, b) });
  }

// Multi-input gates.
check("AND3way(1,1,1)=1", W([gate("G", "AND3way"), lamp("L"), src("A"), src("B"), src("C")],
  [wire("G.out", "L.in"), wire("A.out", "G.in1"), wire("B.out", "G.in2"), wire("C.out", "G.in3")]), { L: true });
check("AND3way(1,0,1)=0", W([gate("G", "AND3way"), lamp("L"), src("A"), src("C")],
  [wire("G.out", "L.in"), wire("A.out", "G.in1"), wire("C.out", "G.in3")]), { L: false });
check("OR4way(0,0,1,0)=1", W([gate("G", "OR4way"), lamp("L"), src("C")],
  [wire("G.out", "L.in"), wire("C.out", "G.in3")]), { L: true });

// A small chain and a fan-out.
check("chain NAND(1,1)=0 -> And(0,1)=0", W([nand("N"), gate("G", "And"), src("A"), src("B"), src("C"), lamp("L")],
  [wire("A.out", "N.in1"), wire("B.out", "N.in2"), wire("N.out", "G.in1"), wire("C.out", "G.in2"), wire("G.out", "L.in")]), { L: false });
check("fan-out one source to 3 lamps + NAND(1,0)=1", W([src("S"), lamp("L1"), lamp("L2"), nand("N"), lamp("L3")],
  [wire("S.out", "L1.in"), wire("S.out", "L2.in"), wire("S.out", "N.in1"), wire("N.out", "L3.in")]),
  { L1: true, L2: true, L3: true });

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

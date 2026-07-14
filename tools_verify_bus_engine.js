#!/usr/bin/env node
// Verifies js/circuit-engine.js evaluateWorkspaceBits (chapter 2.4 buses).
// Builds a full Not4 check circuit — the learner's inside-the-card solution
// (split the input bus, NOT each bit, merge back) wrapped in the splitter
// harness the real check adds (per-bit sources -> merge splitter -> card ->
// split splitter -> per-bit lamps) — and checks the lamps against NOT(input).
//   node tools_verify_bus_engine.js
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const TASK_DEFS = [{ id: "Not", label: "Not", inputs: 1 }];

// Card defs mirror WORKSPACE_COMPONENT_DEFS["taskCard-Not4"/"taskCard-Not16"].
const CARD_PINS = {
  inputExt1: { direction: "in" }, inputInt1: { direction: "out" },
  outputInt: { direction: "in" }, outputExt: { direction: "out" }
};
const CARD_BUS_WIDTH = { "taskCard-Not4": 4, "taskCard-Not16": 16 };
// Placeable bus gates (gate-Not4).
const BUS_GATE = { "gate-Not4": { op: "Not", inputs: 1, width: 4 } };
const busGateSpec = (type) => BUS_GATE[type] || null;

const splitterOutputCount = (c) => Math.min(16, Math.max(2, Number(c && c.outputs) || 4));

function componentPins(component) {
  const type = component && component.type;
  if (type === "splitter") {
    const n = splitterOutputCount(component);
    const mirrored = Boolean(component.mirrored);
    const pins = { single: { direction: mirrored ? "out" : "in" } };
    for (let i = 0; i < n; i += 1) pins["leg" + i] = { direction: mirrored ? "in" : "out" };
    return pins;
  }
  if (type in CARD_BUS_WIDTH) return CARD_PINS;
  if (type === "source") return { out: { direction: "out" } };
  if (type === "nand") return { in1: { direction: "in" }, in2: { direction: "in" }, out: { direction: "out" } };
  if (type === "lamp") return { in: { direction: "in" } };
  if (type && type.indexOf("gate-") === 0) return { in1: { direction: "in" }, out: { direction: "out" } };
  return {};
}

const byId = (ws, id) => ws.components.find((c) => c.id === id) || null;
function splitRef(ref) { const i = String(ref).lastIndexOf("."); return { id: ref.slice(0, i), pin: ref.slice(i + 1) }; }

function terminalDirection(ws, ref) {
  const { id, pin } = splitRef(ref);
  const c = byId(ws, id);
  const pins = componentPins(c);
  return pins[pin] ? pins[pin].direction : "in";
}

function pinWidth(ws, ref) {
  const { id, pin } = splitRef(ref);
  const c = byId(ws, id);
  if (!c) return null;
  if (c.type === "splitter") {
    const w = Number.isInteger(c.width) ? c.width : null;
    if (w === null) return null;
    return pin === "single" ? w * splitterOutputCount(c) : w;
  }
  if (c.type in CARD_BUS_WIDTH) return CARD_BUS_WIDTH[c.type];
  if (busGateSpec(c.type)) return busGateSpec(c.type).width;
  return 1;
}

const taskDefById = (id) => TASK_DEFS.find((t) => t.id === id) || null;

const makeEngine = new Function(
  "terminalDirection", "taskDefById", "pinWidth", "splitterOutputCount", "resolvePins", "busGateSpec",
  read("js/circuit-engine.js") + "\n return createCircuitEngine({ terminalDirection, taskDefById, pinWidth, splitterOutputCount, resolvePins, busGateSpec });"
);
const engine = makeEngine(terminalDirection, taskDefById, pinWidth, splitterOutputCount, componentPins, busGateSpec);

const wire = (a, b) => ({ a, b });

// Build the Not4 check circuit for a 4-bit input pattern.
function buildNot4(bits) {
  const components = [
    { id: "task-card-1", type: "taskCard-Not4" },
    // learner's circuit inside the card
    { id: "split-in", type: "splitter", mirrored: false, outputs: 4, width: 1 },
    { id: "not-0", type: "gate-Not" }, { id: "not-1", type: "gate-Not" },
    { id: "not-2", type: "gate-Not" }, { id: "not-3", type: "gate-Not" },
    { id: "merge", type: "splitter", mirrored: true, outputs: 4, width: 1 },
    // harness
    { id: "bus-in-split", type: "splitter", mirrored: true, outputs: 4, width: 1 },
    { id: "bus-out-split", type: "splitter", mirrored: false, outputs: 4, width: 1 }
  ];
  const wires = [
    wire("task-card-1.inputInt1", "split-in.single"),
    wire("split-in.leg0", "not-0.in1"), wire("split-in.leg1", "not-1.in1"),
    wire("split-in.leg2", "not-2.in1"), wire("split-in.leg3", "not-3.in1"),
    wire("not-0.out", "merge.leg0"), wire("not-1.out", "merge.leg1"),
    wire("not-2.out", "merge.leg2"), wire("not-3.out", "merge.leg3"),
    wire("merge.single", "task-card-1.outputInt"),
    wire("bus-in-split.single", "task-card-1.inputExt1"),
    wire("task-card-1.outputExt", "bus-out-split.single")
  ];
  // One source wired to the legs of the 1-bits (matches the real harness).
  components.push({ id: "source-1", type: "source" });
  bits.forEach((bit, i) => {
    if (bit) wires.push(wire("source-1.out", "bus-in-split.leg" + i));
  });
  for (let i = 0; i < 4; i += 1) {
    components.push({ id: "bus-out-lamp-" + i, type: "lamp" });
    wires.push(wire("bus-out-split.leg" + i, "bus-out-lamp-" + i + ".in"));
  }
  return { components, wires };
}

// A broken learner circuit (one bit not NOTed — wired straight through) must fail.
function buildBrokenNot4(bits) {
  const ws = buildNot4(bits);
  ws.wires = ws.wires.filter((w) => !(w.a === "split-in.leg3" && w.b === "not-3.in1") && !(w.a === "not-3.out" && w.b === "merge.leg3"));
  ws.wires.push(wire("split-in.leg3", "merge.leg3")); // bit 3 passes through un-NOTed
  return ws;
}

let pass = 0, fail = 0;
function check(name, ws, expectedBits) {
  const res = engine.evaluateWorkspaceBits(ws);
  let ok = true, detail = "";
  expectedBits.forEach((bit, i) => {
    const got = Boolean(res.lamps.get("bus-out-lamp-" + i));
    if (got !== Boolean(bit)) { ok = false; detail += ` lamp${i}: expected ${!!bit}, got ${got}`; }
  });
  (ok ? pass++ : fail++);
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${name}${ok ? "" : " ->" + detail}`);
}

console.log("Bus-engine (Not4) verification\n");
const cases = [[1,0,1,1],[0,1,0,0],[1,1,0,1],[0,0,1,0],[1,0,0,1],[0,0,0,0],[1,1,1,1]];
for (const bits of cases) check(`Not4(${bits.join("")})`, buildNot4(bits), bits.map((b) => b ? 0 : 1));

// The broken circuit should NOT match NOT(input) (bit 3 wrong).
const bad = [1,0,1,0];
const res = engine.evaluateWorkspaceBits(buildBrokenNot4(bad));
const expected = bad.map((b) => b ? 0 : 1);
const matches = expected.every((bit, i) => Boolean(res.lamps.get("bus-out-lamp-" + i)) === Boolean(bit));
(!matches ? pass++ : fail++);
console.log(`  [${!matches ? "PASS" : "FAIL"}] broken Not4 correctly rejected`);

// --- Not16 via 4× Not4 bus gate, with the width-16 splitter harness ----------
function buildNot16(bits) {
  const components = [
    { id: "task-card-1", type: "taskCard-Not16" },
    // learner circuit: split 16 -> 4 buses of 4, Not4 each, merge back
    { id: "split-in", type: "splitter", mirrored: false, outputs: 4, width: 4 },
    { id: "merge", type: "splitter", mirrored: true, outputs: 4, width: 4 },
    // harness: 16-way splitters + one source
    { id: "bus-in-split", type: "splitter", mirrored: true, outputs: 16, width: 1 },
    { id: "bus-out-split", type: "splitter", mirrored: false, outputs: 16, width: 1 },
    { id: "source-1", type: "source" }
  ];
  const wires = [
    wire("task-card-1.inputInt1", "split-in.single"),
    wire("merge.single", "task-card-1.outputInt"),
    wire("bus-in-split.single", "task-card-1.inputExt1"),
    wire("task-card-1.outputExt", "bus-out-split.single")
  ];
  for (let i = 0; i < 4; i += 1) {
    components.push({ id: "not4-" + i, type: "gate-Not4" });
    wires.push(wire("split-in.leg" + i, "not4-" + i + ".in1"));
    wires.push(wire("not4-" + i + ".out", "merge.leg" + i));
  }
  bits.forEach((bit, i) => { if (bit) wires.push(wire("source-1.out", "bus-in-split.leg" + i)); });
  for (let i = 0; i < 16; i += 1) {
    components.push({ id: "bus-out-lamp-" + i, type: "lamp" });
    wires.push(wire("bus-out-split.leg" + i, "bus-out-lamp-" + i + ".in"));
  }
  return { components, wires };
}

function check16(name, ws, expectedBits) {
  const res = engine.evaluateWorkspaceBits(ws);
  let ok = true, detail = "";
  expectedBits.forEach((bit, i) => {
    const got = Boolean(res.lamps.get("bus-out-lamp-" + i));
    if (got !== Boolean(bit)) { ok = false; detail += ` lamp${i}: exp ${!!bit}, got ${got}`; }
  });
  (ok ? pass++ : fail++);
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${name}${ok ? "" : " ->" + detail}`);
}

console.log("\nBus-engine (Not16 via Not4 gate)\n");
const cases16 = [
  [1,0,1,1, 0,0,1,0, 1,1,0,0, 0,1,0,1],
  [0,1,0,0, 1,1,1,0, 0,0,1,1, 1,0,1,0],
  [1,1,1,1, 0,0,0,0, 1,0,1,0, 0,1,0,1]
];
for (const bits of cases16) check16(`Not16(${bits.join("")})`, buildNot16(bits), bits.map((b) => b ? 0 : 1));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

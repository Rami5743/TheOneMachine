#!/usr/bin/env node
// Regression test for js/solution-workspaces.js (modularization step 10).
// OLD runs the extracted builder bodies with dependencies visible in scope; NEW
// runs the same bodies through the factory with dependencies INJECTED. If the
// factory's parameter list omits anything the bodies use, NEW throws while OLD
// works -> caught. Output is otherwise compared for every builder/branch.
//   node tools_verify_solution_workspaces.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/solution-workspaces.js"), "utf8");

// Strip the factory wrapper to get the raw function declarations (OLD form).
const RAW_BODIES = MODULE_SRC.split("muxSolutionLayout\n}) {\n")[1].split("\n  return {")[0];
const RET = "\n return { standardTaskWorkspace, cleanedWorkspaceForTaskTest, workspaceForTaskTestRow, solutionWorkspaceForTask };";

const stub = `
  const normalizeWorkspace = (ws) => ws;
  const createDefaultWorkspace = () => ({ components: [], wires: [], nextId: 2, unlocked: false, selectedTerminal: null, accident: null, workspaceSession: 0, taskId: null });
  const normalizeWire = (a, b) => ({ a, b });
  const clonePlain = (v) => JSON.parse(JSON.stringify(v));
  const removeInvalidWires = (ws) => { const ids = new Set(ws.components.map((c) => c.id)); ws.wires = ws.wires.filter((w) => ids.has(String(w.a).split(".")[0]) && ids.has(String(w.b).split(".")[0])); };
  const removeWiresAt = (ws, ref) => { ws.wires = ws.wires.filter((w) => w.a !== ref && w.b !== ref); };
  const addTestWire = (ws, a, b) => { if (!ws.wires.some((w) => (w.a === a && w.b === b) || (w.a === b && w.b === a))) ws.wires.push({ a, b }); };
  const TASK_INPUTS = { Not: 1, And: 2, Or: 2, Xor: 2, AND3way: 3, OR4way: 4 };
  const taskDefById = (id) => (id in TASK_INPUTS ? { id, inputs: TASK_INPUTS[id] } : null);
  const taskCardComponentType = (id) => "taskCard-" + id;
  const currentTaskDef = (ws) => taskDefById(ws && ws.taskId);
  const taskCardOutputExtRef = () => "task-card-1.outputExt";
  const taskCardInputExtRef = (i) => "task-card-1.inputExt" + (i + 1);
  const secondWorkspaceExitTarget = () => ({ panelIndex: 7 });
  const TASK_TEST_FRAME = { x1: 200, y1: 100, x2: 800, y2: 476 };
  const DEPS = { normalizeWorkspace, createDefaultWorkspace, normalizeWire, clonePlain, removeInvalidWires, removeWiresAt, addTestWire, taskDefById, taskCardComponentType, currentTaskDef, taskCardOutputExtRef, taskCardInputExtRef, secondWorkspaceExitTarget, TASK_TEST_FRAME };
`;

const OLD = new Function(stub + RAW_BODIES + RET)();
const NEW = new Function(stub + MODULE_SRC + "\n return createSolutionWorkspaces(DEPS);")();

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const cmp = (label, run) => {
  let a, b, err = null;
  try { a = run(OLD); } catch (e) { err = "OLD threw: " + e.message; }
  try { b = run(NEW); } catch (e) { err = (err ? err + " | " : "") + "NEW threw: " + e.message; }
  const ok = !err && S(a) === S(b);
  ok ? pass++ : fail++;
  if (!ok) console.log(`  [FAIL] ${label}  ${err || "mismatch"}`);
};

console.log("Solution / task-test workspace builders: old-vs-new equivalence\n");

const tasks = ["Not", "And", "Or", "Xor", "AND3way", "OR4way"];
tasks.forEach((t) => cmp(`standardTaskWorkspace(${t})`, (M) => M.standardTaskWorkspace(t)));
tasks.forEach((t) => [0, 4, 7, 8, 10].forEach((step) =>
  cmp(`solutionWorkspaceForTask(${t}, ${step})`, (M) => M.solutionWorkspaceForTask(t, step))));

const baseWs = {
  taskId: "And", selectedTerminal: "task-card-1.inputInt1", accident: { type: "nand-overvoltage", nandId: "nand-9" },
  components: [
    { id: "source-1", type: "source", x: 80, y: 288 },
    { id: "task-card-1", type: "taskCard-And", x: 500, y: 288 },
    { id: "lamp-1", type: "lamp", x: 910, y: 258 },
    { id: "nand-9", type: "nand", x: 400, y: 300 },
    { id: "stray", type: "nand", x: 40, y: 40 }
  ],
  wires: [{ a: "nand-9.out", b: "task-card-1.outputInt" }, { a: "task-card-1.outputExt", b: "lamp-1.in" }, { a: "gone.out", b: "lamp-1.in" }]
};
cmp("cleanedWorkspaceForTaskTest", (M) => M.cleanedWorkspaceForTaskTest(baseWs));
[[true, false], [false, true], [true, true], [false, false]].forEach((inputs, i) =>
  cmp(`workspaceForTaskTestRow row#${i}`, (M) => M.workspaceForTaskTestRow(baseWs, { inputs, output: false })));

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

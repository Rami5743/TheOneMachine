#!/usr/bin/env node
// Regression test for js/component-model.js (modularization step 5).
// Confirms the extracted structure model (componentDef, splitTerminalRef,
// componentById, pinDefFor, terminalExists, terminalDirection, isNandOutputRef)
// matches the pre-extraction versions over a corpus, and that the factory
// injects its dependency (a missing injection makes NEW throw).
//   node tools_verify_component_model.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/component-model.js"), "utf8");

// Injected component-definition table (shared by OLD and NEW).
const stub = `
  const componentDefs = {
    source: { pins: { out: { direction: "out" } } },
    nand: { pins: { in1: { direction: "in" }, in2: { direction: "in" }, out: { direction: "out" } } },
    lamp: { pins: { in: { direction: "in" } } },
    notCard: { fixed: true, pins: { inputExt: { direction: "in" }, inputInt: { direction: "out" }, outputInt: { direction: "in" }, outputExt: { direction: "out" } } },
    "gate-And": { pins: { in1: { direction: "in" }, in2: { direction: "in" }, out: { direction: "out" } } },
    "taskCard-Xor": { pins: { inputExt1: { direction: "in" }, inputExt2: { direction: "in" }, outputExt: { direction: "out" }, inputInt1: { direction: "out" }, outputInt: { direction: "in" } } }
  };
`;

// OLD verbatim bodies (pre-extraction), reading componentDefs from scope.
const OLD_SRC = `
  function componentDef(type){ return componentDefs[type] || null; }
  function splitTerminalRef(ref){ const dot = String(ref).lastIndexOf("."); if (dot < 1) return null; return { componentId: ref.slice(0, dot), pinId: ref.slice(dot + 1) }; }
  function componentById(workspace, componentId){ return workspace.components.find((component) => component.id === componentId) || null; }
  function pinDefFor(workspace, ref){ const parsed = splitTerminalRef(ref); if (!parsed) return null; const component = componentById(workspace, parsed.componentId); const def = component ? componentDef(component.type) : null; const pin = def?.pins?.[parsed.pinId] || null; return component && pin ? { component, pin, pinId: parsed.pinId } : null; }
  function terminalExists(workspace, ref){ return Boolean(pinDefFor(workspace, ref)); }
  function terminalDirection(workspace, ref){ return pinDefFor(workspace, ref)?.pin.direction || null; }
  function isNandOutputRef(workspace, ref){ const info = pinDefFor(workspace, ref); return Boolean(info && info.component.type === "nand" && info.pinId === "out"); }
  return { componentDef, splitTerminalRef, componentById, pinDefFor, terminalExists, terminalDirection, isNandOutputRef };
`;

const OLD = new Function(stub + OLD_SRC)();
const NEW = new Function(stub + MODULE_SRC + "\n return createComponentModel({ componentDefs });")();

const ws = { components: [
  { id: "S1", type: "source" }, { id: "N1", type: "nand" }, { id: "L1", type: "lamp" },
  { id: "notCard1", type: "notCard" }, { id: "G.1", type: "gate-And" }, { id: "C1", type: "taskCard-Xor" }
] };

const types = ["source", "nand", "lamp", "notCard", "gate-And", "taskCard-Xor", "wat", "", null, undefined];
const refs = [
  "S1.out", "N1.in1", "N1.in2", "N1.out", "L1.in", "N1.nope", "X.out", "S1", ".out", "N1.",
  "notCard1.inputExt", "notCard1.inputInt", "notCard1.outputInt", "notCard1.outputExt",
  "G.1.out", "G.1.in1", "C1.inputExt1", "C1.outputInt", "a.b.c", "", null, undefined
];

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const cmp = (label, a, b) => { const ok = S(a) === S(b); ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}  old=${S(a)} new=${S(b)}`); };

console.log("Component/terminal structure model: old-vs-new equivalence\n");
types.forEach((t) => cmp(`componentDef(${S(t)})`, OLD.componentDef(t), NEW.componentDef(t)));
refs.forEach((r) => {
  cmp(`splitTerminalRef(${S(r)})`, OLD.splitTerminalRef(r), NEW.splitTerminalRef(r));
  cmp(`componentById(${S(r)})`, OLD.componentById(ws, r), NEW.componentById(ws, r));
  cmp(`pinDefFor(${S(r)})`, OLD.pinDefFor(ws, r), NEW.pinDefFor(ws, r));
  cmp(`terminalExists(${S(r)})`, OLD.terminalExists(ws, r), NEW.terminalExists(ws, r));
  cmp(`terminalDirection(${S(r)})`, OLD.terminalDirection(ws, r), NEW.terminalDirection(ws, r));
  cmp(`isNandOutputRef(${S(r)})`, OLD.isNandOutputRef(ws, r), NEW.isNandOutputRef(ws, r));
});

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

#!/usr/bin/env node
// Regression test for js/toolbar-view.js (modularization step 12).
// OLD runs the extracted bodies with deps in scope; NEW injects them via the
// factory. renderToolbar output is compared for several completed-task states.
//   node tools_verify_toolbar_view.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/toolbar-view.js"), "utf8");
const RAW = MODULE_SRC.split("componentMarkup, esc }) {\n")[1].split("\n  return {")[0];

const stub = `
  let COMPLETED = [];
  const setCompleted = (a) => { COMPLETED = a; };
  const completedTaskIds = () => COMPLETED;
  const LABELS = { Not: "לא", And: "וגם", Or: "או", Xor: "או-בלעדי", AND3way: "וגם-3", OR4way: "או-4" };
  const taskDefById = (id) => (id in LABELS ? { id, label: LABELS[id] } : null);
  const gateComponentType = (id) => "gate-" + id;
  const componentMarkup = (type, opts) => "[MK " + type + " lampOn=" + String(!!(opts && opts.lampOn)) + "]";
  const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const DEPS = { completedTaskIds, taskDefById, gateComponentType, componentMarkup, esc };
`;

const OLD = new Function(stub + RAW + "\n return { renderToolbar, setCompleted };")();
const NEW = new Function(stub + MODULE_SRC + "\n return { view: createToolbarView(DEPS), setCompleted };")();

let pass = 0, fail = 0;
const cmp = (label, a, b) => { const ok = a === b; ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${JSON.stringify(a)}\n    new=${JSON.stringify(b)}`); };

console.log("Toolbar view (palette markup): old-vs-new equivalence\n");
[[], ["Not"], ["Not", "And", "Xor"], ["Bogus", "Or"], ["Not", "And", "Or", "Xor", "AND3way", "OR4way"]].forEach((completed, i) => {
  OLD.setCompleted(completed);
  NEW.setCompleted(completed);
  cmp(`renderToolbar #${i} (completed=${JSON.stringify(completed)})`, OLD.renderToolbar(), NEW.view.renderToolbar());
});

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

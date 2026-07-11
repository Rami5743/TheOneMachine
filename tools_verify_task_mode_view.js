#!/usr/bin/env node
// Regression test for js/task-mode-view.js (modularization step 15).
// OLD reads `state` directly; NEW reads it via injected getState(). Same state
// and deps -> identical HTML for the shell, intro, hint, and check button.
//   node tools_verify_task_mode_view.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/task-mode-view.js"), "utf8");
const RAW = MODULE_SRC.split("notTestActive\n}) {\n")[1].split("\n  return {")[0];
const OLD_BODIES = RAW.replace(/ {4}const state = getState\(\);\n/g, "");

const stub = `
  let state = {}; let P = {};
  const setEnv = (s, p) => { state = s; P = p; };
  const getState = () => state;
  const esc = (v) => String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
  const TASKS = {
    Not: { id:"Not", label:"לא", inputs:1, description:"מהפך", rows:[{inputs:[0],output:1},{inputs:[1],output:0}] },
    And: { id:"And", label:"וגם", inputs:2, description:"שער וגם", rows:[{inputs:[0,0],output:0},{inputs:[0,1],output:0},{inputs:[1,0],output:0},{inputs:[1,1],output:1}] },
    AND3way: { id:"AND3way", label:"וגם-3", inputs:3, description:"וגם 3", rows:[{inputs:[1,1,1],output:1}] }
  };
  const taskDefById = (id) => TASKS[id] || null;
  const taskInputYs = (n) => (n===1?[0]:n===2?[-60,60]:n===3?[-80,0,80]:[-100,-33,33,100]);
  const solutionHighlightConfig = () => ({ terminals:new Set(), wires:new Set(), components:new Set(), truthRows:new Set(P.truthRows||[]) });
  const isNotTaskWorkspace = () => P.notTask;
  const workspaceTaskIntroActive = () => P.intro;
  const notTestActive = () => P.notTestActive;
  const DEPS = { getState, esc, taskDefById, taskInputYs, solutionHighlightConfig, isNotTaskWorkspace, workspaceTaskIntroActive, notTestActive };
`;

const OLD = new Function(stub + OLD_BODIES + "\n return { renderWorkspaceTaskShell, renderWorkspaceTaskIntro, renderNotTaskHint, renderNotTaskCheckButton, setEnv };")();
const NEW = new Function(stub + MODULE_SRC + "\n return { view: createTaskModeView(DEPS), setEnv };")();

const FNS = ["renderWorkspaceTaskShell", "renderWorkspaceTaskIntro", "renderNotTaskHint", "renderNotTaskCheckButton"];
let pass = 0, fail = 0;
const cmp = (label, a, b) => { const ok = a === b; ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${JSON.stringify(a)}\n    new=${JSON.stringify(b)}`); };

console.log("Task-mode view (shell/intro/hint/check): old-vs-new equivalence\n");
const scenarios = [
  { s: { workspace: { taskId: "And" }, notTest: { rowIndex: 2 } }, p: { notTask: true, intro: false, notTestActive: false, truthRows: [1, 3] } },
  { s: { workspace: { taskId: "Not" }, notTest: null }, p: { notTask: true, intro: true, notTestActive: false, truthRows: [] } },
  { s: { workspace: { taskId: "AND3way" }, notTest: { rowIndex: null } }, p: { notTask: true, intro: false, notTestActive: true, truthRows: [] } },
  { s: { workspace: { taskId: "And" }, notTest: null }, p: { notTask: false, intro: false, notTestActive: false, truthRows: [] } },
  { s: { workspace: { taskId: "Ghost" }, notTest: null }, p: { notTask: true, intro: true, notTestActive: false, truthRows: [] } }
];
scenarios.forEach((sc, i) => { OLD.setEnv(sc.s, sc.p); NEW.setEnv(sc.s, sc.p); FNS.forEach((fn) => cmp(`${fn} [scenario ${i}]`, OLD[fn](), NEW.view[fn]())); });

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

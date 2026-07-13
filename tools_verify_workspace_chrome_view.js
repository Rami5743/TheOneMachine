#!/usr/bin/env node
// Regression test for js/workspace-chrome-view.js (modularization step 13).
// OLD reads `state` directly (the pre-extraction form); NEW reads it through the
// injected getState(). With getState() returning the same object, and identical
// predicate stubs, every render function must produce identical HTML.
//   node tools_verify_workspace_chrome_view.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/workspace-chrome-view.js"), "utf8");

// Raw bodies (strip factory). OLD form: drop the `const state = getState();`
// lines so the functions read `state` from scope, exactly like the original.
const RAW = MODULE_SRC.split("workspaceSkipDisabled\n}) {\n")[1].split("\n  return {")[0];
const OLD_BODIES = RAW.replace(/ {4}const state = getState\(\);\n/g, "");
const RET = `
 return { view: {
   renderWorkspaceAccidentModal, renderWorkspaceBuildHelpPrompt, renderWorkspaceBuildHelpButton,
   renderWorkspaceUnderstoodButton, renderWorkspaceReturnButton, renderWorkspaceSkipButton,
   renderWorkspaceUnderstoodPrompt
 }, setEnv };`;

const stub = `
  let state = {};
  let PRED = { buildHelp: false, understood: false, skipDisabled: false };
  const setEnv = (s, p) => { state = s; PRED = p; };
  const getState = () => state;
  const workspaceBuildHelpPromptActive = () => PRED.buildHelp;
  const workspaceUnderstoodPromptActive = () => PRED.understood;
  const workspaceSkipDisabled = () => PRED.skipDisabled;
  const genderText = (masc, fem) => masc;
  const DEPS = { getState, genderText, workspaceBuildHelpPromptActive, workspaceUnderstoodPromptActive, workspaceSkipDisabled };
`;

const OLD = new Function(stub + OLD_BODIES + RET)();
const NEW = new Function(stub + MODULE_SRC + "\n return { view: createWorkspaceChromeView(DEPS), setEnv };")();

const FNS = [
  "renderWorkspaceAccidentModal", "renderWorkspaceBuildHelpPrompt", "renderWorkspaceBuildHelpButton",
  "renderWorkspaceUnderstoodButton", "renderWorkspaceReturnButton", "renderWorkspaceSkipButton",
  "renderWorkspaceUnderstoodPrompt"
];

const scenarios = [
  { s: { screen: "workspace", chapterId: "chapter-4", workspace: { accident: { type: "nand-overvoltage" }, buildHelpButtonVisible: true, understoodButtonVisible: true, workspaceSession: 1 } }, p: { buildHelp: true, understood: true, skipDisabled: false } },
  { s: { screen: "story", chapterId: "chapter-5", workspace: { accident: null, buildHelpButtonVisible: false, understoodButtonVisible: false, workspaceSession: 2 } }, p: { buildHelp: false, understood: false, skipDisabled: true } },
  { s: { screen: "workspace", chapterId: "chapter-6", workspace: { accident: null, buildHelpButtonVisible: true, understoodButtonVisible: false, workspaceSession: 1 } }, p: { buildHelp: false, understood: true, skipDisabled: true } },
  { s: { screen: "workspace", chapterId: "chapter-4", workspace: {} }, p: { buildHelp: true, understood: false, skipDisabled: false } }
];

let pass = 0, fail = 0;
const cmp = (label, a, b) => { const ok = a === b; ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${JSON.stringify(a)}\n    new=${JSON.stringify(b)}`); };

console.log("Workspace chrome view (buttons/prompts): old-vs-new equivalence\n");
scenarios.forEach((sc, i) => {
  OLD.setEnv(sc.s, sc.p);
  NEW.setEnv(sc.s, sc.p);
  FNS.forEach((fn) => cmp(`${fn} [scenario ${i}]`, OLD.view[fn](), NEW.view[fn]()));
});

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

#!/usr/bin/env node
// Regression test for js/nand-monologue-view.js (modularization step 14).
// OLD reads `state` directly; NEW reads it via injected getState(). Same state
// and deps -> identical HTML across monologue steps and the inactive case.
//   node tools_verify_nand_monologue_view.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/nand-monologue-view.js"), "utf8");
const RAW = MODULE_SRC.split("NAND_MONOLOGUE_TEXTS }) {\n")[1].split("\n  return {")[0];
const OLD_BODIES = RAW.replace(/ {4}const state = getState\(\);\n/g, "");

const stub = `
  let state = {};
  let ACTIVE = false;
  const setEnv = (s, a) => { state = s; ACTIVE = a; };
  const getState = () => state;
  const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const workspaceNandMonologueActive = () => ACTIVE;
  const NAND_MONOLOGUE_TEXTS = ["שלב אפס <NAND>", "שלב אחד & טבלה", "שלב שתיים", "שלב שלוש"];
  const DEPS = { getState, esc, workspaceNandMonologueActive, NAND_MONOLOGUE_TEXTS };
`;

const OLD = new Function(stub + OLD_BODIES + "\n return { renderWorkspaceNandMonologue, setEnv };")();
const NEW = new Function(stub + MODULE_SRC + "\n return { view: createNandMonologueView(DEPS), setEnv };")();

let pass = 0, fail = 0;
const cmp = (label, a, b) => { const ok = a === b; ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}\n    old=${JSON.stringify(a)}\n    new=${JSON.stringify(b)}`); };

console.log("NAND monologue view: old-vs-new equivalence\n");
const cases = [
  { label: "inactive", s: { workspace: { nandMonologueStep: 1 } }, a: false },
  { label: "step 0", s: { workspace: { nandMonologueStep: 0 } }, a: true },
  { label: "step 1 (truth table)", s: { workspace: { nandMonologueStep: 1 } }, a: true },
  { label: "step 2", s: { workspace: { nandMonologueStep: 2 } }, a: true },
  { label: "step clamped high", s: { workspace: { nandMonologueStep: 9 } }, a: true },
  { label: "step clamped low", s: { workspace: { nandMonologueStep: -3 } }, a: true }
];
cases.forEach((c) => { OLD.setEnv(c.s, c.a); NEW.setEnv(c.s, c.a); cmp(c.label, OLD.renderWorkspaceNandMonologue(), NEW.view.renderWorkspaceNandMonologue()); });

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

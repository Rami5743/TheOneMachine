#!/usr/bin/env node
// Regression tests for the app-data.js extraction (and template for future steps).
// Run from the project root:  node tools_verify_modularization.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const JS = (f) => path.join(ROOT, "js", f);
const MOVED = ["TASK_DEFS","SVG_PIN_FALLBACKS","DEFAULT_WORKSPACE_COMPONENTS","OLD_TERMINAL_REFS",
  "ROUTING_TASK_DEFS","TASK_HINTS","FALLBACK_END_DIALOGS","EXPLANATION_ITEMS",
  "BIT_EXPLANATION_STEPS","XOR_HINT_SLIDES","XOR_HINT_NARRATION","NAND_MONOLOGUE_TEXTS"];

let pass = 0, fail = 0;
const ok = (name, cond, extra="") => { (cond?pass++:fail++); console.log(`  [${cond?"PASS":"FAIL"}] ${name}${extra&&!cond?" -> "+extra:""}`); };
const check = (f) => { try { execSync(`node --check "${f}"`, {stdio:"pipe"}); return true; } catch { return false; } };

console.log("Modularization verification\n");

// 1) Every script parses.
for (const f of ["data.js","app-data.js","component-model.js","board-geometry.js","circuit-engine.js","workbench-model.js","workspace-state.js","component-visuals.js","toolbar-view.js","workspace-chrome-view.js","nand-monologue-view.js","board-render.js","wire-ops.js","accident-observation.js","solution-workspaces.js","app.js","warehouse-hotspots.js"]) ok(`node --check js/${f}`, check(JS(f)));

// 2) Concatenation of data.js + app-data.js + app.js parses (catches cross-file redeclaration).
const combined = path.join(require("os").tmpdir(), "combined_check.js");
fs.writeFileSync(combined, [ "data.js","app-data.js","component-model.js","board-geometry.js","circuit-engine.js","workbench-model.js","workspace-state.js","component-visuals.js","toolbar-view.js","workspace-chrome-view.js","nand-monologue-view.js","board-render.js","wire-ops.js","accident-observation.js","solution-workspaces.js","app.js" ].map(f=>fs.readFileSync(JS(f),"utf8")).join("\n"));
ok("data.js + app-data.js + app.js parse together (no redeclaration)", check(combined));

// 3) app-data.js loads standalone and defines all moved globals as non-empty data.
const probe = path.join(require("os").tmpdir(), "probe.js");
fs.writeFileSync(probe, fs.readFileSync(JS("data.js"),"utf8") + "\n" + fs.readFileSync(JS("app-data.js"),"utf8") + "\n" +
  `const _c = {${MOVED.map(n=>`${n}: (Array.isArray(${n})?${n}.length:Object.keys(${n}).length)`).join(",")}};` +
  `process.stdout.write(JSON.stringify(_c));`);
let counts = null;
try { counts = JSON.parse(execSync(`node "${probe}"`, {stdio:"pipe"}).toString()); } catch(e) {}
ok("app-data.js loads with data.js and all 12 globals resolve", !!counts, counts?"":"load error");
if (counts) for (const n of MOVED) ok(`  ${n} is non-empty`, counts[n] > 0, String(counts[n]));

// 4) Each moved const: declared once in app-data.js, zero times in app.js, still referenced in app.js.
const appTxt = fs.readFileSync(JS("app.js"),"utf8");
const dataTxt = fs.readFileSync(JS("app-data.js"),"utf8");
for (const n of MOVED) {
  const dData = (dataTxt.match(new RegExp(`^  const ${n}\\s*=`,"gm"))||[]).length;
  const dApp  = (appTxt.match(new RegExp(`^  const ${n}\\s*=`,"gm"))||[]).length;
  const uApp  = (appTxt.match(new RegExp(`\\b${n}\\b`,"g"))||[]).length;
  ok(`${n}: 1 decl in app-data, 0 in app, used in app`, dData===1 && dApp===0 && uApp>=1, `data=${dData} app=${dApp} used=${uApp}`);
}

console.log(`\n${fail? "FAILURES: "+fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

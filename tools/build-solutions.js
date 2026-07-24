// build-solutions.js — bundle every assets/solutions/<task>.json into a single
// JS file (assets/solutions/solutions.js) that assigns them to a global. This is
// what lets the solution docs load when the app is opened directly from disk
// (file://), where fetch() of local JSON is blocked by the browser. When served
// over HTTP the app fetches the .json files directly and this bundle is just a
// fallback, so the .json files stay the source of truth.
//
// Run after editing any solution JSON:  node tools/build-solutions.js
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "assets", "solutions");
const OUT = path.join(DIR, "solutions.js");
const TASKS = ["Inc", "ALU0", "PreperNum", "ALU1", "ALU2", "ALU3", "ALU4"];

const docs = {};
for (const task of TASKS) {
  const file = path.join(DIR, `${task}.json`);
  if (!fs.existsSync(file)) { console.warn(`skip ${task}: no file`); continue; }
  docs[task] = JSON.parse(fs.readFileSync(file, "utf8"));
}

const banner = "// AUTO-GENERATED from assets/solutions/*.json — do not edit by hand.\n"
  + "// Regenerate with: node tools/build-solutions.js\n"
  + "// Lets the solution docs load from file:// (no server), where fetch() is blocked.\n";
fs.writeFileSync(OUT, `${banner}window.EMBEDDED_SOLUTIONS = ${JSON.stringify(docs, null, 2)};\n`);
console.log(`wrote ${OUT} with ${Object.keys(docs).length} solutions: ${Object.keys(docs).join(", ")}`);

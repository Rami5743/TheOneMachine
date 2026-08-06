// Two static audits of app.js, both guarding bugs that have bitten more than once.
//
// 1. TASK ROUTES. Three functions decide where a learner lands when a build card
//    is finished or left: finishNotTestDialog (a card with no walkthrough),
//    finishSolutionDialog (a card that completes THROUGH its walkthrough) and
//    secretSolveAndExit (the dev shortcut). They all switch on taskFamilyOf().
//    A family taught to only some of them is invisible until a player finishes a
//    card that takes the forgotten path — that is how finishing PC0 landed on the
//    2.4 buses note. Every family must appear in every switch.
//
// 2. PANEL REFERENCES. app.js keys behaviour to panel FILE NAMES ("go back to the
//    build room", "is this the worktable slide"). Renaming a panel silently turns
//    every stale reference into "not found", and the fallback is usually the last
//    slide of the scene — or the wrong branch entirely. Every panel name app.js
//    mentions must exist in data.js.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
let bad = 0;

// ---- 1. every family in every router ---------------------------------------
const families = [...app.matchAll(/return "([a-z-]+)";/g)]
  .slice(0, 0)  // placeholder, filled from taskFamilyOf below
  .map((m) => m[1]);
const familyFn = app.slice(app.indexOf('function taskFamilyOf('));
const familyBody = familyFn.slice(0, familyFn.indexOf('\n  }\n'));
[...familyBody.matchAll(/return "([a-z-]+)"/g)].forEach((m) => families.push(m[1]));

function bodyOf(name) {
  const i = app.indexOf(`function ${name}(`);
  if (i < 0) return null;
  return app.slice(i, app.indexOf('\n  }\n', i));
}
// finishNotTestDialog never sees a bus card: those are diverted to their
// walkthrough one branch earlier and finish in finishSolutionDialog.
const ROUTERS = {
  finishNotTestDialog: ['bus'],
  finishSolutionDialog: [],
  secretSolveAndExit: []
};
console.log('families:', families.join(', '));
for (const [name, exempt] of Object.entries(ROUTERS)) {
  const body = bodyOf(name);
  if (!body) { console.log(`✗ ${name}: not found`); bad++; continue; }
  const missing = families.filter((f) => !exempt.includes(f) && !body.includes(`family === "${f}"`));
  if (missing.length) { console.log(`✗ ${name}: no branch for ${missing.join(', ')}`); bad++; }
  else console.log(`ok ${name}`);
}

// ---- 2. every panel name app.js mentions exists ----------------------------
const data = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const panelFiles = new Set([...data.matchAll(/assets\/panels\/([^"']+)/g)].map((m) => m[1]));
const refs = [];
const push = (re, group) => {
  for (const m of app.matchAll(re)) {
    const line = app.slice(0, m.index).split('\n').length;
    refs.push({ name: m[group], line });
  }
};
push(/panelIndexByImage\([^,]+,\s*"([^"]+)"/g, 1);
push(/panelImageIs\([^,]+,\s*"([^"]+)"/g, 1);
push(/\.includes\("([0-9]{3}_[^"]+)"\)/g, 1);
push(/\.includes\("(panel[^"]*)"\)/g, 1);          // the OLD naming, always stale now
const stem = (n) => String(n).replace(/\.[a-z0-9]+$/i, '');
const missing = refs.filter((ref) => {
  const want = stem(ref.name);
  for (const file of panelFiles) {
    const have = stem(file);
    if (have === want || have.startsWith(`${want}_`) || file.includes(ref.name)) return false;
  }
  return true;
});
if (missing.length) {
  bad++;
  console.log(`\n✗ ${missing.length} panel reference(s) in app.js name a panel that no longer exists:`);
  missing.forEach((ref) => console.log(`   js/app.js:${ref.line}  "${ref.name}"`));
} else console.log(`\nok all ${refs.length} panel references in app.js resolve`);

console.log(bad ? `\n${bad} audit(s) failed` : '\nboth audits clean');
process.exit(bad ? 1 : 0);

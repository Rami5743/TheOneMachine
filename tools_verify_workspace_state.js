#!/usr/bin/env node
// Regression test for js/workspace-state.js (modularization step 4).
// Confirms the extracted normalizeWorkspace/normalizeComponent behave EXACTLY
// like the pre-extraction versions, over a corpus of workspace inputs, and that
// the factory injects every dependency (a missing injection makes NEW throw).
//   node tools_verify_workspace_state.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/workspace-state.js"), "utf8");

// ---- Shared host stub (same for OLD and NEW) ------------------------------
// Faithful enough to exercise the real code paths; identical on both sides, so
// any divergence is caused by the extraction itself, not by the stub.
const stub = `
  const KNOWN = { source:{bounds:{left:20,right:20,top:20,bottom:20}}, nand:{bounds:{left:30,right:30,top:30,bottom:30}}, lamp:{bounds:{left:20,right:20,top:20,bottom:20}}, notCard:{fixed:true,bounds:{left:0,right:0,top:0,bottom:0}}, "gate-And":{bounds:{left:25,right:25,top:25,bottom:25}}, "gate-Or":{bounds:{left:25,right:25,top:25,bottom:25}}, "taskCard-Xor":{bounds:{left:10,right:10,top:10,bottom:10}}, "taskCard-Not":{bounds:{left:10,right:10,top:10,bottom:10}} };
  function componentDef(type){ return KNOWN[type] || null; }
  const BOARD = { width:1000, height:600 };
  function clampComponentPosition(type,x,y){ const b=(componentDef(type)||{}).bounds||{left:8,right:8,top:8,bottom:8};
    const minX=Math.min(b.left,BOARD.width-b.right), maxX=Math.max(b.left,BOARD.width-b.right);
    const minY=Math.min(b.top,BOARD.height-b.bottom), maxY=Math.max(b.top,BOARD.height-b.bottom);
    return { x:Math.min(maxX,Math.max(minX,x)), y:Math.min(maxY,Math.max(minY,y)) }; }
  const OLD_TERMINAL_REFS = { "legacyA":"S1.out", "legacyB":"N1.in1" };
  function migrateTerminalRef(ref){ return OLD_TERMINAL_REFS[ref] || ref; }
  function canonicalTaskFrameWire(ws,a,b){ return [a,b]; }
  function wireKey(a,b){ return [a,b].sort().join("|"); }
  function componentById(ws,id){ return ws.components.find(c=>c.id===id)||null; }
  function splitTerminalRef(ref){ if(typeof ref!=="string") return null; const i=ref.indexOf("."); if(i<0) return null; return {componentId:ref.slice(0,i), pinId:ref.slice(i+1)}; }
  function pinIdsFor(type){ if(type==="source") return ["out"]; if(type==="nand") return ["in1","in2","out"]; if(type==="lamp") return ["in"]; if(type==="notCard") return ["inputExt","inputInt","outputInt","outputExt"]; if(String(type).startsWith("gate-")) return ["in1","in2","out"]; if(String(type).startsWith("taskCard-")) return ["inputExt1","inputExt2","outputExt","inputInt1","outputInt"]; return []; }
  function terminalExists(ws,ref){ const p=splitTerminalRef(ref); if(!p) return false; const c=componentById(ws,p.componentId); return !!(c && pinIdsFor(c.type).includes(p.pinId)); }
  function terminalDirection(ws,ref){ const p=splitTerminalRef(ref); if(!p) return null; if(p.pinId==="out"||p.pinId==="outputExt") return "out"; if(/^inputInt\\d*$/.test(p.pinId)) return "out"; if(/^outputInt\\d*$/.test(p.pinId)) return "in"; return "in"; }
  function isNandOutputRef(ws,ref){ const p=splitTerminalRef(ref); const c=p&&componentById(ws,p.componentId); return !!(c&&c.type==="nand"&&p.pinId==="out"); }
  function normalizeWire(a,b){ const [x,y]=[a,b].sort(); return {a:x,b:y}; }
  function otherWireEnd(wire,ref){ if(wire.a===ref) return wire.b; if(wire.b===ref) return wire.a; return null; }
  function componentGraphHasPath(ws,wires,fromId,toId){ let removed=false; const edges=[];
    for(const w of wires){ const pa=splitTerminalRef(w.a), pb=splitTerminalRef(w.b); if(!pa||!pb) continue; const set=new Set([pa.componentId,pb.componentId]);
      if(!removed && set.has(fromId) && set.has(toId)){ removed=true; continue; } edges.push([pa.componentId,pb.componentId]); }
    const adj={}; for(const [u,v] of edges){ (adj[u]=adj[u]||new Set()).add(v); (adj[v]=adj[v]||new Set()).add(u); }
    const seen=new Set([fromId]); const q=[fromId]; while(q.length){ const u=q.shift(); if(u===toId) return true; for(const v of (adj[u]||[])) if(!seen.has(v)){seen.add(v);q.push(v);} } return false; }
  ${fs.readFileSync(path.join(process.cwd(), "js/workbench-model.js"), "utf8")}
  const __wb = createWorkbenchModel({terminalDirection, terminalExists, splitTerminalRef, componentById, componentGraphHasPath, normalizeWire, isNandOutputRef});
  function canAddWire(ws,a,b,wires,announce){ return __wb.canAddWire(ws,a,b,wires,announce); }
  const DEFAULT_COMPONENTS = [ {id:"S1",type:"source",x:120,y:300}, {id:"N1",type:"nand",x:400,y:300}, {id:"L1",type:"lamp",x:700,y:300} ];
  function cloneDefaultComponents(){ return DEFAULT_COMPONENTS.map(c=>({...c})); }
  function createDefaultWorkspace(){ return { selectedTerminal:null, components:cloneDefaultComponents(), wires:[], nextId:2, unlocked:false, accident:null, helpPromptSeen:false, buildHelpButtonVisible:false, nandOutputObserved:{zero:false,one:false}, understoodPromptShown:false, understoodButtonVisible:false, nandMonologueStep:null, workspaceLaunchPanelIndex:null, workspaceCompleted:false, workspaceSession:0, exitTargetPanelIndex:null, returnToWorkspaceAfterMonologue:false, sessionReturnChapterId:null, sessionReturnPanelIndex:null, taskId:null, taskIntroSeen:false }; }
`;

// ---- OLD implementation (verbatim pre-extraction body) --------------------
const OLD_SRC = `
  function normalizeComponent(component, usedIds, index) {
    const type = componentDef(component?.type) ? component.type : null;
    if (!type) return null;
    let id = String(component.id || \`\${type}-\${index + 1}\`).replace(/[^\\w-]/g, "-");
    if (!id || usedIds.has(id)) id = \`\${type}-\${index + 1}\`;
    while (usedIds.has(id)) id = \`\${id}-1\`;
    usedIds.add(id);
    const x = Number.isFinite(component.x) ? component.x : 500;
    const y = Number.isFinite(component.y) ? component.y : 300;
    const clamped = clampComponentPosition(type, x, y);
    return { id, type, x: clamped.x, y: clamped.y };
  }
  function normalizeWorkspace(workspace) {
    const fallback = createDefaultWorkspace();
    const ws = workspace && typeof workspace === "object" ? workspace : fallback;
    const usedIds = new Set();
    const sourceComponents = Array.isArray(ws.components) && ws.components.length ? ws.components : cloneDefaultComponents();
    const components = sourceComponents.map((component, index) => normalizeComponent(component, usedIds, index)).filter(Boolean);
    if (!components.length) components.push(...cloneDefaultComponents());
    const observed = ws.nandOutputObserved && typeof ws.nandOutputObserved === "object" ? ws.nandOutputObserved : {};
    const normalized = {
      selectedTerminal: null, components, wires: [],
      nextId: Number.isInteger(ws.nextId) && ws.nextId > 1 ? ws.nextId : 2,
      unlocked: Boolean(ws.unlocked), accident: null,
      helpPromptSeen: Boolean(ws.helpPromptSeen), buildHelpButtonVisible: Boolean(ws.buildHelpButtonVisible),
      nandOutputObserved: { zero: Boolean(observed.zero), one: Boolean(observed.one) },
      understoodPromptShown: Boolean(ws.understoodPromptShown), understoodButtonVisible: Boolean(ws.understoodButtonVisible),
      nandMonologueStep: Number.isInteger(ws.nandMonologueStep) ? ws.nandMonologueStep : null,
      workspaceLaunchPanelIndex: Number.isInteger(ws.workspaceLaunchPanelIndex) ? ws.workspaceLaunchPanelIndex : null,
      workspaceCompleted: Boolean(ws.workspaceCompleted),
      workspaceSession: Number.isInteger(ws.workspaceSession) ? Math.max(0, ws.workspaceSession) : 0,
      exitTargetPanelIndex: Number.isInteger(ws.exitTargetPanelIndex) ? ws.exitTargetPanelIndex : null,
      returnToWorkspaceAfterMonologue: Boolean(ws.returnToWorkspaceAfterMonologue),
      sessionReturnChapterId: typeof ws.sessionReturnChapterId === "string" ? ws.sessionReturnChapterId : null,
      sessionReturnPanelIndex: Number.isInteger(ws.sessionReturnPanelIndex) ? ws.sessionReturnPanelIndex : null,
      taskId: typeof ws.taskId === "string" ? ws.taskId : null, taskIntroSeen: Boolean(ws.taskIntroSeen),
      freeBuild: Boolean(ws.freeBuild)
    };
    const maxNumericSuffix = components.reduce((max, component) => { const match = component.id.match(/-(\\d+)$/); return match ? Math.max(max, Number(match[1]) + 1) : max; }, 2);
    normalized.nextId = Math.max(normalized.nextId, maxNumericSuffix);
    if (terminalExists(normalized, ws.selectedTerminal)) { normalized.selectedTerminal = ws.selectedTerminal; }
    const wires = Array.isArray(ws.wires) ? ws.wires : [];
    const seen = new Set();
    for (const wire of wires) {
      if (!wire) continue;
      const migratedA = migrateTerminalRef(wire.a); const migratedB = migrateTerminalRef(wire.b);
      const [a, b] = canonicalTaskFrameWire(normalized, migratedA, migratedB);
      if (!terminalExists(normalized, a) || !terminalExists(normalized, b) || a === b) continue;
      const key = wireKey(a, b); if (seen.has(key)) continue;
      if (!canAddWire(normalized, a, b, normalized.wires, false)) continue;
      normalized.wires.push(normalizeWire(a, b)); seen.add(key);
    }
    if (ws.accident?.type === "nand-overvoltage" && componentById(normalized, ws.accident.nandId)?.type === "nand") {
      normalized.accident = { type: "nand-overvoltage", nandId: ws.accident.nandId };
    }
    return normalized;
  }
  return { normalizeWorkspace, normalizeComponent };
`;

const DEPS = "{componentDef, clampComponentPosition, migrateTerminalRef, canonicalTaskFrameWire, wireKey, componentById, terminalExists, canAddWire, normalizeWire, createDefaultWorkspace, cloneDefaultComponents}";

const OLD = new Function(stub + OLD_SRC)();
const NEW = new Function(stub + MODULE_SRC + "\n return createWorkspaceState(" + DEPS + ");")();

// ---- Corpus ----------------------------------------------------------------
const corpus = [
  undefined, null, 42, "x", {},
  { components: [] },
  { components: [{ id: "S1", type: "source", x: 120, y: 300 }, { id: "N1", type: "nand", x: 400, y: 300 }, { id: "L1", type: "lamp", x: 700, y: 300 }] },
  { components: [{ id: "bad", type: "wat", x: 10, y: 10 }, { id: "N1", type: "nand", x: 0, y: 0 }] },
  { components: [{ id: "N1", type: "nand", x: 1e9, y: -1e9 }, { id: "N1", type: "nand", x: 50, y: 50 }] }, // dup id
  { components: [{ type: "source", x: NaN, y: Infinity }, { type: "lamp" }] }, // missing id / bad pos
  { components: [{ id: "N-5", type: "nand", x: 100, y: 100 }, { id: "N-2", type: "nand", x: 200, y: 200 }] }, // suffix -> nextId
  { components: [{ id: "S1", type: "source", x: 1, y: 1 }, { id: "N1", type: "nand", x: 2, y: 2 }, { id: "L1", type: "lamp", x: 3, y: 3 }],
    wires: [{ a: "S1.out", b: "N1.in1" }, { a: "N1.out", b: "L1.in" }] },
  { components: [{ id: "S1", type: "source" }, { id: "N1", type: "nand" }], wires: [{ a: "S1.out", b: "N1.in1" }, { a: "S1.out", b: "N1.in1" }] }, // dup wire
  { components: [{ id: "N1", type: "nand" }], wires: [{ a: "N1.in1", b: "N1.in2" }, null, { a: "N1.out", b: "N1.out" }, { a: "X.out", b: "N1.in1" }] }, // illegal wires
  { components: [{ id: "S1", type: "source" }, { id: "N1", type: "nand" }], wires: [{ a: "legacyA", b: "N1.in1" }] }, // migrated ref
  { components: [{ id: "N1", type: "nand" }], selectedTerminal: "N1.in1" },
  { components: [{ id: "N1", type: "nand" }], selectedTerminal: "Z.nope" },
  { components: [{ id: "N1", type: "nand" }], accident: { type: "nand-overvoltage", nandId: "N1" } },
  { components: [{ id: "S1", type: "source" }], accident: { type: "nand-overvoltage", nandId: "S1" } }, // not a nand
  { nextId: 0, unlocked: 1, workspaceSession: -5, nandMonologueStep: 2.5, exitTargetPanelIndex: "3", sessionReturnChapterId: 7, sessionReturnPanelIndex: 4, taskId: 9, nandOutputObserved: { zero: 1 } },
  { components: [{ id: "S1", type: "source" }, { id: "N1", type: "nand" }, { id: "L1", type: "lamp" }, { id: "N1", type: "nand" }],
    wires: [{ a: "S1.out", b: "N1.in1" }, { a: "S1.out", b: "N1.in1-1" }] }
];

let pass = 0, fail = 0;
const stable = (v) => JSON.stringify(v);
console.log("Workspace-state normalization: old-vs-new equivalence\n");
corpus.forEach((input, i) => {
  let a, b, err = null;
  try { a = OLD.normalizeWorkspace(input); } catch (e) { err = "OLD threw: " + e.message; }
  try { b = NEW.normalizeWorkspace(input); } catch (e) { err = (err ? err + " | " : "") + "NEW threw: " + e.message; }
  const ok = !err && stable(a) === stable(b);
  ok ? pass++ : fail++;
  console.log(`  [${ok ? "PASS" : "FAIL"}] case ${i}${ok ? "" : "  " + (err || ("mismatch\n    old=" + stable(a) + "\n    new=" + stable(b)))}`);
});

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

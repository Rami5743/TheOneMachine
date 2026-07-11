#!/usr/bin/env node
// Regression test for js/workspace-navigation.js (modularization step 16).
// OLD reads `state` directly (pre-extraction); NEW reads via injected getState().
// With identical state, scene, and helper stubs, every target/index matches.
//   node tools_verify_workspace_navigation.js
const fs = require("fs");
const path = require("path");
const MODULE_SRC = fs.readFileSync(path.join(process.cwd(), "js/workspace-navigation.js"), "utf8");

const stub = `
  let state = {};
  const setState = (s) => { state = s; };
  const getState = () => state;
  const SCENE = { panels: [ {image:"panel80.png"}, {image:"panel82.png", launch:true}, {image:"panel83.png"}, {image:"panel87.png"}, {image:"panel90.png"} ] };
  const SCENE_NO_LAUNCH = { panels: [ {image:"a.png"}, {image:"b.png"} ] };
  const currentScene = () => SCENE;
  const currentChapter = () => ({ id: state.chapterId, sceneId: "cur" });
  const currentPanel = () => (SCENE.panels[state.panelIndex] || null);
  const simpleGatesChapter = () => ({ id: "chapter-5", sceneId: "simple-gates" });
  const sceneByChapter = (ch) => SCENE;
  const chapterById = (id) => ({ id });
  const panelIndexByImage = (scene, img) => scene.panels.findIndex((p) => p.image === img);
  const storyTarget = (chapter, index) => ({ screen: "story", chapterId: chapter ? chapter.id : null, panelIndex: index });
  const normalizeWorkspace = (ws) => ({ taskId: ws && typeof ws.taskId === "string" ? ws.taskId : null, workspaceSession: Number.isInteger(ws && ws.workspaceSession) ? ws.workspaceSession : 0, workspaceLaunchPanelIndex: Number.isInteger(ws && ws.workspaceLaunchPanelIndex) ? ws.workspaceLaunchPanelIndex : null });
  const isWorkspaceLaunchPanel = (panel) => !!(panel && panel.launch);
  const DEPS = { getState, currentScene, currentChapter, currentPanel, simpleGatesChapter, sceneByChapter, chapterById, panelIndexByImage, storyTarget, normalizeWorkspace, isWorkspaceLaunchPanel };
`;

const OLD_SRC = `
  function workspaceLaunchPanelIndex(scene = currentScene()){ const index = scene.panels.findIndex(isWorkspaceLaunchPanel); return index >= 0 ? index : scene.panels.length - 1; }
  function firstWorkspaceExitTarget(){ const chapter = simpleGatesChapter(); const scene = sceneByChapter(chapter); const panel83Index = panelIndexByImage(scene, "panel83.png"); return storyTarget(chapter, panel83Index >= 0 ? panel83Index : 0); }
  function secondWorkspaceExitTarget(){ const ws = state.workspace; if (ws && typeof ws.sessionReturnChapterId === "string" && Number.isInteger(ws.sessionReturnPanelIndex)) { return storyTarget(chapterById(ws.sessionReturnChapterId), ws.sessionReturnPanelIndex); } const chapter = simpleGatesChapter(); const scene = sceneByChapter(chapter); const panel87Index = panelIndexByImage(scene, "panel87.png"); return storyTarget(chapter, panel87Index >= 0 ? panel87Index : scene.panels.length - 1); }
  function isWorkspaceLaunchPoint(){ if (state.chapterId !== "chapter-4") return false; if (state.workspace?.workspaceCompleted) return false; return isWorkspaceLaunchPanel(currentPanel()); }
  function workspaceWarehouseTarget(){ const workspace = normalizeWorkspace(state.workspace); if (state.chapterId === "chapter-4" && !workspace.taskId && workspace.workspaceSession !== 2) { const chapter = currentChapter(); const scene = sceneByChapter(chapter); const launchIndex = Number.isInteger(workspace.workspaceLaunchPanelIndex) ? workspace.workspaceLaunchPanelIndex : workspaceLaunchPanelIndex(scene); return storyTarget(chapter, launchIndex >= 0 ? launchIndex : 0); } return secondWorkspaceExitTarget(); }
  return { workspaceLaunchPanelIndex, firstWorkspaceExitTarget, secondWorkspaceExitTarget, workspaceWarehouseTarget, isWorkspaceLaunchPoint, setState, SCENE_NO_LAUNCH };
`;

const OLD = new Function(stub + OLD_SRC)();
const NEW = (() => { const m = new Function(stub + MODULE_SRC + "\n return { view: createWorkspaceNavigation(DEPS), setState, SCENE_NO_LAUNCH };")(); return m; })();

let pass = 0, fail = 0;
const S = (v) => JSON.stringify(v);
const cmp = (label, run) => { const a = run(OLD, OLD), b = run(NEW.view, NEW); const ok = S(a) === S(b); ok ? pass++ : fail++; if (!ok) console.log(`  [FAIL] ${label}  old=${S(a)} new=${S(b)}`); };
const setBoth = (s) => { OLD.setState(s); NEW.setState(s); };

console.log("Workspace navigation (launch/exit targets): old-vs-new equivalence\n");

// workspaceLaunchPanelIndex (default scene has a launch panel at index 1; alt scene has none)
setBoth({});
cmp("launchPanelIndex default scene", (V) => V.workspaceLaunchPanelIndex());
cmp("launchPanelIndex no-launch scene", (V, M) => V.workspaceLaunchPanelIndex(M.SCENE_NO_LAUNCH));

cmp("firstWorkspaceExitTarget", (V) => V.firstWorkspaceExitTarget());

// secondWorkspaceExitTarget: with and without sessionReturn
setBoth({ workspace: { sessionReturnChapterId: "chapter-6", sessionReturnPanelIndex: 5 } });
cmp("secondExit (sessionReturn set)", (V) => V.secondWorkspaceExitTarget());
setBoth({ workspace: {} });
cmp("secondExit (fallback panel87)", (V) => V.secondWorkspaceExitTarget());

// isWorkspaceLaunchPoint
setBoth({ chapterId: "chapter-4", panelIndex: 1, workspace: { workspaceCompleted: false } });
cmp("isLaunchPoint ch4 launch panel", (V) => V.isWorkspaceLaunchPoint());
setBoth({ chapterId: "chapter-4", panelIndex: 0, workspace: {} });
cmp("isLaunchPoint ch4 non-launch panel", (V) => V.isWorkspaceLaunchPoint());
setBoth({ chapterId: "chapter-4", panelIndex: 1, workspace: { workspaceCompleted: true } });
cmp("isLaunchPoint ch4 completed", (V) => V.isWorkspaceLaunchPoint());
setBoth({ chapterId: "chapter-5", panelIndex: 1, workspace: {} });
cmp("isLaunchPoint ch5", (V) => V.isWorkspaceLaunchPoint());

// workspaceWarehouseTarget
setBoth({ chapterId: "chapter-4", panelIndex: 1, workspace: { taskId: null, workspaceSession: 1 } });
cmp("warehouse ch4 no-task session1", (V) => V.workspaceWarehouseTarget());
setBoth({ chapterId: "chapter-4", panelIndex: 1, workspace: { taskId: "Not", workspaceSession: 2 } });
cmp("warehouse ch4 with task", (V) => V.workspaceWarehouseTarget());
setBoth({ chapterId: "chapter-6", panelIndex: 1, workspace: { sessionReturnChapterId: "chapter-6", sessionReturnPanelIndex: 3 } });
cmp("warehouse ch6 -> secondExit", (V) => V.workspaceWarehouseTarget());

console.log(`\n${fail ? "FAILURES: " + fail : "ALL PASS"} (${pass} passed, ${fail} failed)`);
process.exit(fail ? 1 : 0);

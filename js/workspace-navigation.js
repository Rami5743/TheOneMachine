// workspace-navigation.js — the story targets for launching and leaving the
// workbench, extracted from app.js. workspaceLaunchPanelIndex finds the panel a
// chapter's workbench launches from; first/secondWorkspaceExitTarget give the
// story panel to return to after the first (chapter 2.1) and second (2.2/2.3)
// workbench sessions; workspaceWarehouseTarget picks the right one for the
// "return to warehouse" button; isWorkspaceLaunchPoint tells whether the current
// panel opens the workbench. State is read via injected getState().
//
// Loaded BEFORE app.js. createWorkspaceNavigation(deps) -> { workspaceLaunchPanelIndex,
//   firstWorkspaceExitTarget, secondWorkspaceExitTarget, workspaceWarehouseTarget,
//   isWorkspaceLaunchPoint }
//   deps: getState, currentScene, currentChapter, currentPanel, simpleGatesChapter,
//         sceneByChapter, chapterById, panelIndexByImage, storyTarget,
//         normalizeWorkspace, isWorkspaceLaunchPanel

function createWorkspaceNavigation({
  getState,
  currentScene,
  currentChapter,
  currentPanel,
  simpleGatesChapter,
  sceneByChapter,
  chapterById,
  panelIndexByImage,
  storyTarget,
  normalizeWorkspace,
  isWorkspaceLaunchPanel
}) {
  function workspaceLaunchPanelIndex(scene = currentScene()) {
    const index = scene.panels.findIndex(isWorkspaceLaunchPanel);
    return index >= 0 ? index : scene.panels.length - 1;
  }

  function firstWorkspaceExitTarget() {
    // Leaving the Nand workbench returns to the two post-experiment slides that
    // now sit right AFTER the launch panel (panel82) in the 2.1 scene — panel80
    // (the Nand shrinking) and panel81 (chips) — before the story flows on to
    // 2.2's panel83. Land on the panel right after the launch.
    const chapter = chapterById("chapter-4");
    const scene = sceneByChapter(chapter);
    const launchIndex = scene.panels.findIndex(isWorkspaceLaunchPanel);
    const idx = launchIndex >= 0 ? Math.min(launchIndex + 1, scene.panels.length - 1) : 0;
    return storyTarget(chapter, idx);
  }

  function secondWorkspaceExitTarget() {
    const ws = getState().workspace;
    if (ws && typeof ws.sessionReturnChapterId === "string" && Number.isInteger(ws.sessionReturnPanelIndex)) {
      return storyTarget(chapterById(ws.sessionReturnChapterId), ws.sessionReturnPanelIndex);
    }
    const chapter = simpleGatesChapter();
    const scene = sceneByChapter(chapter);
    const worktableIndex = panelIndexByImage(scene, "090_2.2_simple-gates-worktable.svg");
    return storyTarget(chapter, worktableIndex >= 0 ? worktableIndex : scene.panels.length - 1);
  }

  function isWorkspaceLaunchPoint() {
    const state = getState();
    if (state.chapterId !== "chapter-4") return false;
    // NB: intentionally NOT gated on workspaceCompleted. Advancing onto the launch
    // panel (right after the warehouse Nand presentation) must always re-open the
    // workbench demo — even after the learner has finished it once and later
    // navigates back to this panel — instead of letting the story flow past and
    // skip the demo. openWorkspace rebuilds a fresh session-1 workbench each time.
    return isWorkspaceLaunchPanel(currentPanel());
  }

  function workspaceWarehouseTarget() {
    const state = getState();
    const workspace = normalizeWorkspace(state.workspace);
    if (state.chapterId === "chapter-4" && !workspace.taskId && workspace.workspaceSession !== 2) {
      const chapter = currentChapter();
      const scene = sceneByChapter(chapter);
      const launchIndex = Number.isInteger(workspace.workspaceLaunchPanelIndex)
        ? workspace.workspaceLaunchPanelIndex
        : workspaceLaunchPanelIndex(scene);
      return storyTarget(chapter, launchIndex >= 0 ? launchIndex : 0);
    }
    return secondWorkspaceExitTarget();
  }

  return { workspaceLaunchPanelIndex, firstWorkspaceExitTarget, secondWorkspaceExitTarget, workspaceWarehouseTarget, isWorkspaceLaunchPoint };
}

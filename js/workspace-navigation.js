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
    const chapter = simpleGatesChapter();
    const scene = sceneByChapter(chapter);
    const panel83Index = panelIndexByImage(scene, "panel83.png");
    return storyTarget(chapter, panel83Index >= 0 ? panel83Index : 0);
  }

  function secondWorkspaceExitTarget() {
    const ws = getState().workspace;
    if (ws && typeof ws.sessionReturnChapterId === "string" && Number.isInteger(ws.sessionReturnPanelIndex)) {
      return storyTarget(chapterById(ws.sessionReturnChapterId), ws.sessionReturnPanelIndex);
    }
    const chapter = simpleGatesChapter();
    const scene = sceneByChapter(chapter);
    const panel87Index = panelIndexByImage(scene, "panel87.png");
    return storyTarget(chapter, panel87Index >= 0 ? panel87Index : scene.panels.length - 1);
  }

  function isWorkspaceLaunchPoint() {
    const state = getState();
    if (state.chapterId !== "chapter-4") return false;
    if (state.workspace?.workspaceCompleted) return false;
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

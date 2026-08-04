// workspace-chrome-view.js — the small buttons and prompt overlays around the
// workbench screen, extracted from app.js: the "burned Nand" accident modal, the
// build-help prompt/button, the "understood?" button/prompt, the return-to-
// warehouse button, and the skip button. Each returns an HTML string (or "" when
// hidden). They read the live app state through the injected getState() and use
// injected predicates for their show/hide conditions.
//
// Loaded BEFORE app.js. createWorkspaceChromeView(deps) -> { renderWorkspaceAccidentModal,
//   renderWorkspaceBuildHelpPrompt, renderWorkspaceBuildHelpButton,
//   renderWorkspaceUnderstoodButton, renderWorkspaceReturnButton,
//   renderWorkspaceSkipButton, renderWorkspaceUnderstoodPrompt }
//   deps: getState, workspaceBuildHelpPromptActive, workspaceUnderstoodPromptActive,
//         workspaceSkipDisabled

function createWorkspaceChromeView({
  getState,
  genderText,
  navButton,
  workspaceBuildHelpPromptActive,
  workspaceUnderstoodPromptActive,
  workspaceSkipDisabled
}) {
  function renderWorkspaceAccidentModal() {
    const state = getState();
    if (state.workspace.accident?.type !== "nand-overvoltage") return "";
    return `
      <div class="workspace-accident-overlay" role="presentation">
        <section class="workspace-accident-card" role="alertdialog" aria-modal="false" aria-label="Nand נשרף">
          <p>${genderText("מה עשית?! ילד נזק. טוב, אתה יכול לקחת חדש.", "מה עשית?! ילדה נוזקה. טוב, את יכולה לקחת חדש.")}</p>
          <div class="workspace-accident-actions">
            <button class="btn btn-primary" data-action="workspace-accident-ok">אישור</button>
          </div>
        </section>
      </div>`;
  }

  function renderWorkspaceBuildHelpPrompt() {
    if (!workspaceBuildHelpPromptActive()) return "";

    return `
      <div class="workspace-build-help-prompt" role="dialog" aria-modal="false" aria-label="העשרה: הסבר על בניית Nand">
        <h2 class="build-help-title">
          <svg class="build-help-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor"/></svg>
          העשרה
        </h2>
        <p>רוצה לדעת איך בונים Nand (ומה זה לעזאזל טריודה, נגד ומקור מתח)?</p>
        <div class="workspace-build-help-actions">
          <button class="btn btn-primary" data-action="build-help-later">לא כרגע</button>
          <button class="btn" data-action="build-help-yes">כן</button>
        </div>
      </div>`;
  }

  function renderWorkspaceBuildHelpButton() {
    const state = getState();
    if (state.chapterId !== "chapter-4" || !state.workspace?.buildHelpButtonVisible) return "";
    return `<button class="btn" data-action="build-help-open">רוצה לדעת איך בונים Nand</button>`;
  }

  function renderWorkspaceUnderstoodButton() {
    const state = getState();
    if (!state.workspace?.understoodButtonVisible) return "";
    return `<button class="btn" data-action="understood-open">הבנת?</button>`;
  }

  function renderWorkspaceReturnButton() {
    const state = getState();
    if (state.screen !== "workspace") return "";
    // A gate solution opened from the explanations menu returns there instead.
    if (state.solutionDialog?.returnToExplanations) {
      return `<button class="btn" data-action="solution-ok" type="button">חזרה לתפריט ההסברים</button>`;
    }
    // An explanation replayed on the workbench (the memory explanations) belongs
    // to the menu, not to the story — so it never offers "חזרה למחסן".
    if (state.explanationReplay) {
      return `<button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>`;
    }
    // The free workbench of chapter 4.1 — reached from the exercise page or from
    // the work area on the room's floor — goes back the way it was opened.
    if (state.workspace?.sheetReturn) {
      const label = state.workspace.sheetReturn.label || "חזרה לדף הפקודות";
      return `<button class="btn" data-action="sheet-workbench-return" type="button">${label}</button>`;
    }
    return `<button class="btn" data-action="workspace-return-warehouse" type="button">חזרה למחסן</button>`;
  }

  function renderWorkspaceSkipButton() {
    const state = getState();
    // A replayed explanation has no story to skip past.
    if (state.explanationReplay) return "";
    if (state.chapterId === "chapter-5" || state.workspace?.workspaceSession === 2) return "";
    return navButton("skip", "skip-rtl", "דלג", { disabled: workspaceSkipDisabled() });
  }

  function renderWorkspaceUnderstoodPrompt() {
    if (!workspaceUnderstoodPromptActive()) return "";

    return `
      <div class="workspace-understood-overlay" role="presentation">
        <section class="workspace-understood-card" role="dialog" aria-modal="false" aria-label="בדיקת הבנה">
          <h2>הבנת?</h2>
          <div class="workspace-understood-actions">
            <button class="btn" data-action="understood-play-more">אני רוצה עוד לשחק עם זה</button>
            <button class="btn btn-primary" data-action="understood-yes">כן</button>
            <button class="btn" data-action="understood-no">לא</button>
          </div>
        </section>
      </div>`;
  }

  return {
    renderWorkspaceAccidentModal,
    renderWorkspaceBuildHelpPrompt,
    renderWorkspaceBuildHelpButton,
    renderWorkspaceUnderstoodButton,
    renderWorkspaceReturnButton,
    renderWorkspaceSkipButton,
    renderWorkspaceUnderstoodPrompt
  };
}

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
      <div class="workspace-build-help-prompt" role="dialog" aria-modal="false" aria-label="הסבר על בניית Nand">
        <p>רוצה לדעת איך בונים Nand (ומה זה לעזאזל טריודה, נגד ומקור מתח)?</p>
        <div class="workspace-build-help-actions">
          <button class="btn btn-primary" data-action="build-help-yes">כן</button>
          <button class="btn" data-action="build-help-later">לא כרגע</button>
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
    return `<button class="btn" data-action="workspace-return-warehouse" type="button">חזרה למחסן</button>`;
  }

  function renderWorkspaceSkipButton() {
    const state = getState();
    if (state.chapterId === "chapter-5" || state.workspace?.workspaceSession === 2) return "";
    return `<button class="btn" data-action="skip" ${workspaceSkipDisabled() ? "disabled" : ""}>דלג</button>`;
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

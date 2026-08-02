// nand-monologue-view.js — the Nand "inner monologue" speech bubble shown on the
// workbench in chapter 2.1, plus the Nand truth table it reveals on one of its
// steps, extracted from app.js. renderWorkspaceNandMonologue returns the speech
// layer for the current step (or "" when inactive); renderNandTruthTable is its
// internal static table. State is read via injected getState().
//
// Loaded BEFORE app.js. createNandMonologueView(deps) -> { renderWorkspaceNandMonologue }
//   deps: getState, esc, workspaceNandMonologueActive, NAND_MONOLOGUE_TEXTS

function createNandMonologueView({ getState, esc, workspaceNandMonologueActive, NAND_MONOLOGUE_TEXTS }) {
  function renderNandTruthTable() {
    return `
      <section class="nand-truth-table" aria-label="טבלת אמת של Nand">
        <table>
          <thead>
            <tr>
              <th class="truth-output-cell">יציאה</th>
              <th>כניסה 2</th>
              <th>כניסה 1</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="truth-output-cell">1</td><td>0</td><td>0</td></tr>
            <tr><td class="truth-output-cell">1</td><td>1</td><td>0</td></tr>
            <tr><td class="truth-output-cell">1</td><td>0</td><td>1</td></tr>
            <tr><td class="truth-output-cell">0</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
      </section>`;
  }

  // A gold "✦ העשרה" enrichment badge — the same sparkle used on the build-help
  // teaser and the story corner links — marking a bubble as bonus content.
  function enrichmentBadge() {
    return `
      <div class="nand-speech-enrichment">
        <svg class="build-help-icon" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor"/></svg>
        העשרה
      </div>`;
  }

  function renderWorkspaceNandMonologue() {
    if (!workspaceNandMonologueActive()) return "";

    const state = getState();
    const step = Math.min(Math.max(state.workspace.nandMonologueStep, 0), NAND_MONOLOGUE_TEXTS.length - 1);
    // Bold "טבלת אמת" the first time the Nand names it (step 0). The phrase has no
    // HTML-special characters, so it survives esc() unchanged and we can wrap the
    // first occurrence afterwards.
    const body = esc(NAND_MONOLOGUE_TEXTS[step]).replace("טבלת אמת", "<strong>טבלת אמת</strong>");
    // The last bubble is where the Nand explains its NAME (Not-And) — bonus
    // etymology, marked as enrichment.
    const isNameStep = step === NAND_MONOLOGUE_TEXTS.length - 1;
    return `
      <div class="workspace-nand-monologue-layer monologue-step-${step}" data-nand-monologue-layer role="presentation">
        <div class="workspace-nand-speech monologue-step-${step}" data-nand-speech>
          ${isNameStep ? enrichmentBadge() : ""}
          <p>${body}</p>
        </div>
        ${step === 1 ? renderNandTruthTable() : ""}
      </div>`;
  }

  return { renderWorkspaceNandMonologue };
}

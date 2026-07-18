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
              <th>כניסה 1</th>
              <th>כניסה 2</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="truth-output-cell">1</td><td>0</td><td>0</td></tr>
            <tr><td class="truth-output-cell">1</td><td>0</td><td>1</td></tr>
            <tr><td class="truth-output-cell">1</td><td>1</td><td>0</td></tr>
            <tr><td class="truth-output-cell">0</td><td>1</td><td>1</td></tr>
          </tbody>
        </table>
      </section>`;
  }

  function renderWorkspaceNandMonologue() {
    if (!workspaceNandMonologueActive()) return "";

    const state = getState();
    const step = Math.min(Math.max(state.workspace.nandMonologueStep, 0), NAND_MONOLOGUE_TEXTS.length - 1);
    return `
      <div class="workspace-nand-monologue-layer monologue-step-${step}" data-nand-monologue-layer role="presentation">
        <div class="workspace-nand-speech monologue-step-${step}" data-nand-speech>
          <p>${esc(NAND_MONOLOGUE_TEXTS[step])}</p>
        </div>
        ${step === 1 ? renderNandTruthTable() : ""}
      </div>`;
  }

  return { renderWorkspaceNandMonologue };
}

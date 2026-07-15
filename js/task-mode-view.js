// task-mode-view.js — the task-building UI on the workbench (chapter 2.2 "build
// the gate inside the frame"), extracted from app.js: the task-card shell/frame
// with its pins and label, the intro instructions overlay, the truth-table hint
// panel, and the "check" button. Each returns an HTML string (or "" when hidden)
// and reads live state through the injected getState().
//
// Loaded BEFORE app.js. createTaskModeView(deps) -> { renderWorkspaceTaskShell,
//   renderWorkspaceTaskIntro, renderNotTaskHint, renderNotTaskCheckButton }
//   deps: getState, esc, taskDefById, taskInputYs, solutionHighlightConfig,
//         isNotTaskWorkspace, workspaceTaskIntroActive, notTestActive

function createTaskModeView({
  getState,
  esc,
  genderText,
  adaptGender,
  taskDefById,
  busTaskDefById,
  busCheckDisplayRow,
  taskInputYs,
  solutionHighlightConfig,
  isNotTaskWorkspace,
  workspaceTaskIntroActive,
  notTestActive,
  multibitTaskDefById,
  isMultibitTaskWorkspace,
  renderMultibitTaskShell
}) {
  function busDefFor() {
    const state = getState();
    return typeof busTaskDefById === "function" ? busTaskDefById(state.workspace?.taskId) : null;
  }

  // One bus pin on the task frame: a thick black bar with a light dashed line
  // along it (the "bus" look) and the bit width above — same visual as the bus
  // wires and the splitter pins. The width label sits over `labelX` (kept
  // outside the frame, over the external stub).
  function busPinBar(x1, x2, y, labelX, width) {
    return `
      <line class="workspace-task-shell-bus" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
      <line class="workspace-task-shell-bus-stripe" x1="${x1 + 4}" y1="${y}" x2="${x2 - 4}" y2="${y}" />
      <text class="splitter-width-label" x="${labelX}" y="${y - 16}" text-anchor="middle">${width}</text>`;
  }

  function renderBusTaskShell(def) {
    // The frame follows the card component's position. Card pin offsets are
    // ±340 (external) / ±260 (internal); the frame edges sit at ±300, so the
    // external stub pokes out on each side. The width labels sit over those
    // external stubs (at ±320) so they clear the frame edge. A 2-input card
    // (AND4 …) draws two input buses on the left (at y ±90, matching the pins).
    const state = getState();
    const card = (state.workspace?.components || []).find((c) => c.id === "task-card-1");
    const cx = Number.isFinite(card?.x) ? card.x : 640;
    const nIn = def.inputs || 1;
    const inYs = nIn <= 1 ? [0] : [-90, 90];
    const inputBars = inYs.map((dy) => busPinBar(cx - 340, cx - 260, 288 + dy, cx - 320, def.width)).join("");
    // A MUX card adds a single-bit control pin poking out of the top, moved to
    // the left so it clears the data buses. Its frame is taller in y to give
    // more building room around the extra input.
    const control = def.control
      ? `<line class="workspace-task-shell-pin" x1="${cx - 130}" y1="40" x2="${cx - 130}" y2="108" />
         <text class="workspace-task-shell-pin-label" x="${cx - 130}" y="28" text-anchor="middle">בקרה</text>`
      : "";
    const frameTop = def.control ? 90 : 100;
    const frameH = def.control ? 510 : 376;
    // MUX cards get a wider frame so the AND4/OR4/NOT4 layout fits comfortably.
    const frameLeft = def.control ? cx - 330 : cx - 300;
    const frameW = def.control ? 660 : 600;
    return `
      <g class="workspace-task-shell" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="${frameLeft}" y="${frameTop}" width="${frameW}" height="${frameH}" rx="18" />
        <text class="workspace-task-shell-title" x="${cx}" y="${frameTop - 10}" text-anchor="middle">${esc(def.label)}</text>
        ${inputBars}
        ${control}
        ${busPinBar(cx + 260, cx + 340, 288, cx + 320, def.width)}
      </g>`;
  }

  // The single-row truth table shown for the case currently under test: the
  // input bus value(s) and the expected output bus value, one bit per cell.
  // row.inputs is an array of buses (one per card input). LTR DOM == left to
  // right; read right-to-left as כניסה 1, כניסה 2 …, then יציאה — so the output
  // group is first in the DOM, the inputs run from last to first, and within
  // each group the bits run component-N..component-0 (component 0 rightmost).
  function renderBusCheckRow(def, row) {
    const cell = (bit, isOut) => `<td class="${isOut ? "truth-output-cell" : ""}">${bit ? 1 : 0}</td>`;
    const n = row.inputs.length;
    const outHead = `<th class="truth-output-cell" colspan="${row.outputs.length}">יציאה</th>`;
    const outCells = row.outputs.slice().reverse().map((b) => cell(b, true)).join("");
    let inHeads = "", inCells = "";
    for (let j = n - 1; j >= 0; j -= 1) {
      inHeads += `<th colspan="${row.inputs[j].length}">${n > 1 ? `כניסה ${j + 1}` : "כניסה"}</th>`;
      inCells += row.inputs[j].slice().reverse().map((b) => cell(b, false)).join("");
    }
    return `
      <table class="workspace-task-hint-table bus-check-table">
        <thead><tr>${outHead}${inHeads}</tr></thead>
        <tbody><tr class="truth-row-active">${outCells}${inCells}</tr></tbody>
      </table>`;
  }
  function renderMuxTaskShell(task) {
    // Custom layout: two numbered data inputs on the left, the control input on
    // top, one output on the right. Matches the taskCard-Mux pin offsets in app.js.
    return `
      <g class="workspace-task-shell workspace-task-shell-mux" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="150" y="60" width="700" height="456" rx="18" />
        <text class="workspace-task-shell-title" x="500" y="48" text-anchor="middle">${esc(task.label)}</text>
        <line class="workspace-task-shell-pin" x1="125" y1="188" x2="175" y2="188" />
        <line class="workspace-task-shell-pin" x1="125" y1="388" x2="175" y2="388" />
        <text class="workspace-task-shell-pin-label" x="108" y="194" text-anchor="end">1</text>
        <text class="workspace-task-shell-pin-label" x="108" y="394" text-anchor="end">2</text>
        <line class="workspace-task-shell-pin" x1="300" y1="40" x2="300" y2="80" />
        <text class="workspace-task-shell-pin-label" x="300" y="28" text-anchor="middle">בקרה</text>
        <line class="workspace-task-shell-pin" x1="800" y1="288" x2="875" y2="288" />
      </g>`;
  }

  function renderDmuxTaskShell(task) {
    // The mirror of the MUX: one data input on the left, the control on top, and
    // two outputs (1 top, 2 bottom) on the right. Matches the taskCard-DMux pins.
    return `
      <g class="workspace-task-shell workspace-task-shell-mux" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="150" y="60" width="700" height="456" rx="18" />
        <text class="workspace-task-shell-title" x="500" y="48" text-anchor="middle">${esc(task.label)}</text>
        <line class="workspace-task-shell-pin" x1="125" y1="288" x2="175" y2="288" />
        <line class="workspace-task-shell-pin" x1="300" y1="40" x2="300" y2="80" />
        <text class="workspace-task-shell-pin-label" x="300" y="28" text-anchor="middle">בקרה</text>
        <line class="workspace-task-shell-pin" x1="800" y1="188" x2="875" y2="188" />
        <line class="workspace-task-shell-pin" x1="800" y1="388" x2="875" y2="388" />
        <text class="workspace-task-shell-pin-label" x="892" y="194" text-anchor="start">1</text>
        <text class="workspace-task-shell-pin-label" x="892" y="394" text-anchor="start">2</text>
      </g>`;
  }

  function renderWorkspaceTaskShell() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    if (typeof isMultibitTaskWorkspace === "function" && isMultibitTaskWorkspace()) {
      return typeof renderMultibitTaskShell === "function" ? renderMultibitTaskShell() : "";
    }
    const busDef = busDefFor();
    if (busDef) return renderBusTaskShell(busDef);
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
    if (task.id === "Mux") return renderMuxTaskShell(task);
    if (task.id === "DMux") return renderDmuxTaskShell(task);
    const inputLines = taskInputYs(task.inputs).map((y) => `
        <line class="workspace-task-shell-pin" x1="160" y1="${288 + y}" x2="240" y2="${288 + y}" />`).join("");
    return `
      <g class="workspace-task-shell" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="200" y="100" width="600" height="376" rx="18" />
        <text class="workspace-task-shell-title" x="500" y="90" text-anchor="middle">${esc(task.label)}</text>
        ${inputLines}
        <line class="workspace-task-shell-pin" x1="760" y1="288" x2="840" y2="288" />
      </g>`;
  }

  function renderWorkspaceTaskIntro() {
    const state = getState();
    if (!workspaceTaskIntroActive()) return "";
    const task = taskDefById(state.workspace?.taskId);
    const label = task?.label || "הכרטיס";
    return `
      <div class="workspace-task-intro-overlay" role="presentation">
        <section class="workspace-task-intro-card" role="dialog" aria-modal="false" aria-label="הוראות לבניית ${esc(label)}">
          <p>${genderText("אתה צריך לבנות את הכרטיס בתוך המסגרת. אל תשכח לחבר את הכניסות והיציאה של", "את צריכה לבנות את הכרטיס בתוך המסגרת. אל תשכחי לחבר את הכניסות והיציאה של")} ${esc(label)} ${genderText("לרכיבים שאתה שם בפנים.", "לרכיבים שאת שמה בפנים.")}</p>
          <div class="workspace-task-intro-actions">
            <button class="btn btn-primary" data-action="workspace-task-intro-ok">אישור</button>
          </div>
        </section>
      </div>`;
  }

  function muxScratchCell(row, column, value) {
    const shown = value === 0 ? "0" : value === 1 ? "1" : "";
    const cls = value === null || value === undefined ? "mux-cell-empty" : "";
    const isDivider = column === "out" || column === "out1";
    return `<td class="${isDivider ? "truth-output-cell" : ""}"><button type="button" class="mux-truth-cell ${cls}" data-action="mux-truth-cell" data-row="${row}" data-col="${column}" aria-label="שורה ${row + 1} עמודה">${shown}</button></td>`;
  }

  function renderMuxScratchTable() {
    const state = getState();
    const table = Array.isArray(state.muxTable) && state.muxTable.length === 8
      ? state.muxTable
      : Array.from({ length: 8 }, () => ({ control: null, in1: null, in2: null, out: null }));
    const activeRow = Number.isInteger(state.notTest?.rowIndex) ? state.notTest.rowIndex : null;
    const solutionRows = solutionHighlightConfig().truthRows;
    // The table is rendered LTR (direction:ltr, set in CSS for determinism), so
    // DOM order == visual left-to-right. The learner should read it right-to-left
    // as בקרה, כניסה 1, כניסה 2, ┃ (thick divider) יציאה — so left-to-right the
    // DOM is יציאה, כניסה 2, כניסה 1, בקרה, with the divider between יציאה and the
    // inputs (a thick right-border on the output column, added in CSS).
    const rows = table.map((row, index) => `
      <tr class="${activeRow === index ? "truth-row-active" : ""} ${solutionRows.has(index) ? "truth-row-solution-highlight" : ""}">
        ${muxScratchCell(index, "out", row.out)}
        ${muxScratchCell(index, "in2", row.in2)}
        ${muxScratchCell(index, "in1", row.in1)}
        ${muxScratchCell(index, "control", row.control)}
      </tr>`).join("");
    return `
      <table class="workspace-task-hint-table mux-scratch-table">
        <thead>
          <tr>
            <th class="truth-output-cell">יציאה</th>
            <th>כניסה 2</th>
            <th>כניסה 1</th>
            <th>בקרה</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderDmuxScratchTable() {
    const state = getState();
    const table = Array.isArray(state.muxTable) && state.muxTable.length === 4
      ? state.muxTable
      : Array.from({ length: 4 }, () => ({ control: null, data: null, out1: null, out2: null }));
    const activeRow = Number.isInteger(state.notTest?.rowIndex) ? state.notTest.rowIndex : null;
    // LTR DOM == visual left-to-right; read right-to-left as בקרה, כניסה, ┃
    // (divider) יציאה 1, יציאה 2.
    const rows = table.map((row, index) => `
      <tr class="${activeRow === index ? "truth-row-active" : ""}">
        ${muxScratchCell(index, "out2", row.out2)}
        ${muxScratchCell(index, "out1", row.out1)}
        ${muxScratchCell(index, "data", row.data)}
        ${muxScratchCell(index, "control", row.control)}
      </tr>`).join("");
    return `
      <table class="workspace-task-hint-table mux-scratch-table">
        <thead>
          <tr>
            <th>יציאה 2</th>
            <th class="truth-output-cell">יציאה 1</th>
            <th>כניסה</th>
            <th>בקרה</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  // The MUX/DMUX build requirements panel (description + editable table) with a
  // hide/show toggle in its top-left corner. When hidden it collapses to just a
  // title bar ("דרישות כרטיס ה-…").
  function renderRequirementsPanel(task, scratchTableHtml) {
    const state = getState();
    const hidden = Boolean(state.requirementsPanelHidden);
    const toggle = `<button class="requirements-toggle" data-action="toggle-requirements" type="button">${hidden ? "הצגה" : "הסתרה"}</button>`;
    if (hidden) {
      return `
        <section class="workspace-task-hint workspace-task-hint-mux workspace-task-hint-collapsed" aria-label="דרישות ${esc(task.label)}">
          ${toggle}
          <span class="requirements-title">דרישות כרטיס ה-${esc(task.label)}</span>
        </section>`;
    }
    return `
      <section class="workspace-task-hint workspace-task-hint-mux" aria-label="דרישות ${esc(task.label)}">
        ${toggle}
        <div class="mux-hint-text"><p>${esc(adaptGender(task.description))}</p></div>
        <div class="mux-hint-table">${scratchTableHtml}</div>
      </section>`;
  }

  function renderNotTaskHint() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    if (typeof isMultibitTaskWorkspace === "function" && isMultibitTaskWorkspace()) {
      // During the solution walkthrough the solution dialog carries the text, so
      // the requirements panel steps aside.
      if (state.solutionDialog) return "";
      const mbDef = typeof multibitTaskDefById === "function" ? multibitTaskDefById(state.workspace?.taskId) : null;
      if (!mbDef) return "";
      // Collapsible, click-through requirements panel (same UX as the MUX/DMUX
      // build): the card's output pins sit in the lower-right, under the panel,
      // so it must let clicks fall through and be hideable to reach them.
      const hidden = Boolean(state.requirementsPanelHidden);
      const toggle = `<button class="requirements-toggle" data-action="toggle-requirements" type="button">${hidden ? "הצגה" : "הסתרה"}</button>`;
      if (hidden) {
        return `
          <section class="workspace-task-hint workspace-task-hint-mux workspace-task-hint-collapsed" aria-label="דרישות ${esc(mbDef.label)}">
            ${toggle}
            <span class="requirements-title">דרישות כרטיס ה-${esc(mbDef.label)}</span>
          </section>`;
      }
      return `
        <section class="workspace-task-hint workspace-task-hint-mux workspace-task-hint-multibit" aria-label="דרישות ${esc(mbDef.label)}">
          ${toggle}
          <div class="mux-hint-text"><p>${esc(adaptGender(mbDef.requirements || ""))}</p></div>
        </section>`;
    }
    const busDef = busDefFor();
    if (busDef) {
      // Bus tasks: the requirements text, plus — while a check is running — a
      // single-row truth table for the case currently under test.
      const row = typeof busCheckDisplayRow === "function" ? busCheckDisplayRow() : null;
      const table = row ? renderBusCheckRow(busDef, row) : "";
      return `
        <section class="workspace-task-hint" aria-label="הסבר על ${esc(busDef.label)}">
          <p>${esc(adaptGender(busDef.description || ""))}</p>
          ${table}
        </section>`;
    }
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
    if (task.id === "Mux") {
      // During the solution walkthrough show only the (highlighted) truth table
      // in a compact panel, leaving room for the solution dialog and circuit. The
      // learner can hide/show it with the toggle on the solution dialog.
      if (state.solutionDialog) {
        if (state.solutionTableHidden) return "";
        return `
          <section class="workspace-task-hint workspace-task-hint-mux-solution" aria-label="טבלת האמת של ${esc(task.label)}">
            ${renderMuxScratchTable()}
          </section>`;
      }
      // Order matters: in the RTL flex row the FIRST child lands on the right.
      // The click-through text goes on the right (over the fixed lamp, which the
      // learner must be able to hand-wire), and the interactive table sits on the
      // left over the gate-build zone (gates are movable, so it never traps them).
      return renderRequirementsPanel(task, renderMuxScratchTable());
    }
    if (task.id === "DMux") {
      // An empty, editable truth table (like the MUX): the learner fills it in as
      // a thinking aid. Two output columns, four rows.
      if (state.solutionDialog) {
        if (state.solutionTableHidden) return "";
        return `
          <section class="workspace-task-hint workspace-task-hint-mux-solution" aria-label="טבלת האמת של ${esc(task.label)}">
            ${renderDmuxScratchTable()}
          </section>`;
      }
      return renderRequirementsPanel(task, renderDmuxScratchTable());
    }
    const activeRow = Number.isInteger(state.notTest?.rowIndex) ? state.notTest.rowIndex : null;
    const solutionTruthRows = solutionHighlightConfig().truthRows;
    const inputHeaders = Array.from({ length: task.inputs }, (_, index) =>
      `<th>${task.inputs === 1 ? "כניסה" : `כניסה ${index + 1}`}</th>`
    ).join("");
    const rows = task.rows.map((row, index) => `
      <tr class="${activeRow === index ? "truth-row-active" : ""} ${solutionTruthRows.has(index) ? "truth-row-solution-highlight" : ""}">
        <td class="truth-output-cell">${row.output ? 1 : 0}</td>
        ${row.inputs.map((value) => `<td>${value ? 1 : 0}</td>`).join("")}
      </tr>`).join("");

    return `
      <section class="workspace-task-hint" aria-label="הסבר על ${esc(task.label)}">
        <p>${esc(adaptGender(task.description))}</p>
        <table class="workspace-task-hint-table">
          <thead>
            <tr>
              <th class="truth-output-cell">יציאה</th>
              ${inputHeaders}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function renderNotTaskCheckButton() {
    if (!isNotTaskWorkspace()) return "";
    const disabled = notTestActive() || workspaceTaskIntroActive() ? "disabled" : "";
    return `<button class="btn btn-primary" data-action="check-not-task" ${disabled}>בדיקה</button>`;
  }

  return { renderWorkspaceTaskShell, renderWorkspaceTaskIntro, renderNotTaskHint, renderNotTaskCheckButton };
}

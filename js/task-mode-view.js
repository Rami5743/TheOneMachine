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
  taskDefById,
  taskInputYs,
  solutionHighlightConfig,
  isNotTaskWorkspace,
  workspaceTaskIntroActive,
  notTestActive
}) {
  function renderMuxTaskShell(task) {
    // Custom layout: two numbered data inputs on the left, the control input on
    // top, one output on the right. Matches the taskCard-Mux pin offsets in app.js.
    return `
      <g class="workspace-task-shell workspace-task-shell-mux" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="200" y="100" width="600" height="376" rx="18" />
        <text class="workspace-task-shell-title" x="300" y="90" text-anchor="middle">${esc(task.label)}</text>
        <line class="workspace-task-shell-pin" x1="160" y1="218" x2="240" y2="218" />
        <line class="workspace-task-shell-pin" x1="160" y1="358" x2="240" y2="358" />
        <text class="workspace-task-shell-pin-label" x="144" y="224" text-anchor="end">1</text>
        <text class="workspace-task-shell-pin-label" x="144" y="364" text-anchor="end">2</text>
        <line class="workspace-task-shell-pin" x1="500" y1="40" x2="500" y2="140" />
        <text class="workspace-task-shell-pin-label" x="500" y="30" text-anchor="middle">בקרה</text>
        <line class="workspace-task-shell-pin" x1="760" y1="288" x2="840" y2="288" />
      </g>`;
  }

  function renderWorkspaceTaskShell() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
    if (task.id === "Mux") return renderMuxTaskShell(task);
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
          <p>אתה צריך לבנות את הכרטיס בתוך המסגרת. אל תשכח לחבר את הכניסות והיציאה של ${esc(label)} לרכיבים שאתה שם בפנים.</p>
          <div class="workspace-task-intro-actions">
            <button class="btn btn-primary" data-action="workspace-task-intro-ok">אישור</button>
          </div>
        </section>
      </div>`;
  }

  function muxScratchCell(row, column, value) {
    const shown = value === 0 ? "0" : value === 1 ? "1" : "";
    const cls = value === null || value === undefined ? "mux-cell-empty" : "";
    return `<td class="${column === "out" ? "truth-output-cell" : ""}"><button type="button" class="mux-truth-cell ${cls}" data-action="mux-truth-cell" data-row="${row}" data-col="${column}" aria-label="שורה ${row + 1} עמודה">${shown}</button></td>`;
  }

  function renderMuxScratchTable() {
    const state = getState();
    const table = Array.isArray(state.muxTable) && state.muxTable.length === 8
      ? state.muxTable
      : Array.from({ length: 8 }, () => ({ control: null, in1: null, in2: null, out: null }));
    const activeRow = Number.isInteger(state.notTest?.rowIndex) ? state.notTest.rowIndex : null;
    const rows = table.map((row, index) => `
      <tr class="${activeRow === index ? "truth-row-active" : ""}">
        ${muxScratchCell(index, "out", row.out)}
        ${muxScratchCell(index, "control", row.control)}
        ${muxScratchCell(index, "in1", row.in1)}
        ${muxScratchCell(index, "in2", row.in2)}
      </tr>`).join("");
    return `
      <table class="workspace-task-hint-table mux-scratch-table">
        <thead>
          <tr>
            <th class="truth-output-cell">יציאה</th>
            <th>בקרה</th>
            <th>כניסה 1</th>
            <th>כניסה 2</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderNotTaskHint() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
    if (task.id === "Mux") {
      return `
        <section class="workspace-task-hint workspace-task-hint-mux" aria-label="דרישות ${esc(task.label)}">
          <div class="mux-hint-table">${renderMuxScratchTable()}</div>
          <div class="mux-hint-text"><p>${esc(task.description)}</p></div>
        </section>`;
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
        <p>${esc(task.description)}</p>
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

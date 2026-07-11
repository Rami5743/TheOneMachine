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
  function renderWorkspaceTaskShell() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
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

  function renderNotTaskHint() {
    const state = getState();
    if (!isNotTaskWorkspace()) return "";
    const task = taskDefById(state.workspace?.taskId);
    if (!task) return "";
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

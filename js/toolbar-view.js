// toolbar-view.js — the workbench tool palette markup, extracted from app.js.
// renderToolbar builds the left-hand palette: NAND, any gates the learner has
// already completed (so they can be reused), a lamp, a voltage source, and the
// trash bin. toolbarIcon/trashIcon are its internal SVG helpers. Pure string
// building; host lookups are INJECTED.
//
// Loaded BEFORE app.js. createToolbarView(deps) -> { renderToolbar }
//   deps: completedTaskIds, taskDefById, gateComponentType, componentMarkup, esc

function createToolbarView({ toolbarGateToolIds, taskDefById, gateComponentType, componentMarkup, esc, isNandPresentationWorkspace, isFreeBuildWorkspace, isBusTaskWorkspace }) {
  function toolbarIcon(type) {
    return `
      <svg class="toolbox-icon" viewBox="-90 -85 180 170" aria-hidden="true" focusable="false">
        <g transform="scale(0.78)">
          ${componentMarkup(type, { lampOn: false })}
        </g>
      </svg>`;
  }

  function trashIcon() {
    return `
      <svg class="trash-icon" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
        <path class="trash-line" d="M24 26 H56" />
        <path class="trash-line" d="M32 26 V20 H48 V26" />
        <path class="trash-body" d="M28 30 H52 L49 62 H31 Z" />
        <path class="trash-line" d="M35 36 V56" />
        <path class="trash-line" d="M45 36 V56" />
      </svg>`;
  }

  function renderToolbar() {
    // In the NAND-presentation workbench the palette is deliberately minimal —
    // only the NAND, the voltage source and the lamp. Elsewhere (the task-card
    // build and the free "empty table") the learner may also reuse every gate
    // they have already built.
    const builtGateTools = isNandPresentationWorkspace()
      ? []
      : toolbarGateToolIds()
          .map((taskId) => taskDefById(taskId))
          .filter(Boolean)
          .map((task) => ({ type: gateComponentType(task.id), label: task.label }));

    const tools = [
      { type: "nand", label: "NAND" },
      ...builtGateTools,
      { type: "lamp", label: "מנורה" },
      { type: "source", label: "מקור מתח" },
      // The splitter is available on the free "empty table" and in the chapter
      // 2.4 bus-task builds (where it is needed to split the input bus).
      ...((isFreeBuildWorkspace && isFreeBuildWorkspace()) || (isBusTaskWorkspace && isBusTaskWorkspace()) ? [{ type: "splitter", label: "מפצל" }] : [])
    ];

    return `
      <aside class="workspace-toolbox" aria-label="סרגל כלים">
        <div class="toolbox-list">
          ${tools.map((tool) => `
            <button class="toolbox-component" data-action="toolbox-component" data-component-type="${esc(tool.type)}" type="button" aria-label="גרור ${esc(tool.label)} לשולחן">
              ${toolbarIcon(tool.type)}
              <span>${esc(tool.label)}</span>
            </button>`).join("")}
        </div>
        <div class="toolbox-trash" data-trash aria-label="פח זבל">
          ${trashIcon()}
          <span>פח</span>
        </div>
      </aside>`;
  }

  return { renderToolbar };
}

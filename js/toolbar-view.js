// toolbar-view.js — the workbench tool palette markup, extracted from app.js.
// renderToolbar builds the left-hand palette: Nand, any gates the learner has
// already completed (so they can be reused), a lamp, a voltage source, and the
// trash bin. toolbarIcon/trashIcon are its internal SVG helpers. Pure string
// building; host lookups are INJECTED.
//
// Loaded BEFORE app.js. createToolbarView(deps) -> { renderToolbar }
//   deps: completedTaskIds, taskDefById, gateComponentType, componentMarkup, esc

function createToolbarView({ toolbarGateToolIds, taskDefById, toolCategoryOf, toolGroupsAvailable, toolGroupCollapsed, busTaskDefById, gateComponentType, componentMarkup, esc, isNandPresentationWorkspace, isFreeBuildWorkspace, isBusTaskWorkspace, isMultibitTaskWorkspace, nailAvailable, muxToolAvailable, ffCardAvailable, memoryBuildAvailable, sequentialToolsAvailable, isMemoryCardType, createCardToolAvailable, savedCardTools, splitterAvailable, convertersAvailable }) {
  function toolbarIcon(type) {
    return `
      <svg class="toolbox-icon" viewBox="-90 -85 180 170" aria-hidden="true" focusable="false">
        <g transform="scale(0.78)">
          ${componentMarkup(type, { lampOn: false, toolbar: true, renderScale: 0.78 })}
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

  // The palette's headings, in the order they are shown. A heading only appears
  // when it has cards in it, so early chapters see just the two or three that
  // apply. The learner can fold any of them away (the arrow), and that choice
  // lasts.
  const TOOL_GROUPS = [
    { key: "simple", title: "פשוטים" },
    { key: "buses", title: "בסים" },
    { key: "routing", title: "ניתוב" },
    { key: "arith", title: "חיבור" },
    { key: "alu", title: "ALU" },
    { key: "memory", title: "זיכרון" },
    { key: "computer", title: "מחשב" },
    { key: "usercards", title: "הכרטיסים שלי" },
    { key: "accessories", title: "אביזרים" }
  ];

  function toolButton(tool) {
    return `
      <button class="toolbox-component" data-action="toolbox-component" data-component-type="${esc(tool.type)}" type="button" aria-label="גרור ${esc(tool.label)} לשולחן">
        ${toolbarIcon(tool.type)}
        <span>${esc(tool.label)}</span>
      </button>`;
  }

  // The palette body: a flat run of tools before chapter 2.5, and headed groups
  // from there on.
  function toolboxBody(tools) {
    const grouped = typeof toolGroupsAvailable === "function" && toolGroupsAvailable()
      && typeof toolCategoryOf === "function";
    if (!grouped) {
      return `<div class="toolbox-list">${tools.map(toolButton).join("")}</div>`;
    }
    const groups = TOOL_GROUPS.map((group) => ({
      ...group,
      items: tools.filter((tool) => toolCategoryOf(tool.type) === group.key)
    })).filter((group) => group.items.length);
    return `
      <div class="toolbox-list toolbox-list-grouped">
        ${groups.map((group) => {
          const collapsed = typeof toolGroupCollapsed === "function" && toolGroupCollapsed(group.key);
          return `
            <section class="toolbox-group${collapsed ? " toolbox-group-collapsed" : ""}">
              <button class="toolbox-group-head" data-action="toolbox-group-toggle" data-group="${esc(group.key)}" type="button" aria-expanded="${collapsed ? "false" : "true"}">
                <svg class="toolbox-group-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M4 6 L8 10 L12 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>${esc(group.title)}</span>
              </button>
              ${collapsed ? "" : `<div class="toolbox-group-items">${group.items.map(toolButton).join("")}</div>`}
            </section>`;
        }).join("")}
      </div>`;
  }

  function renderToolbar() {
    // In the Nand-presentation workbench the palette is deliberately minimal —
    // only the Nand, the voltage source and the lamp. Elsewhere (the task-card
    // build and the free "empty table") the learner may also reuse every gate
    // they have already built.
    const allGateTools = isNandPresentationWorkspace()
      ? []
      : toolbarGateToolIds()
          .map((taskId) => taskDefById(taskId) || (busTaskDefById ? busTaskDefById(taskId) : null))
          .filter(Boolean)
          .map((task) => ({ type: gateComponentType(task.id), label: task.label }));
    // The memory cards are pulled OUT of the built-gate run so they can sit with
    // the FF, after every older card but before the accessories.
    const isMemoryTool = (tool) => typeof isMemoryCardType === "function" && isMemoryCardType(tool.type);
    const builtGateTools = allGateTools.filter((t) => !isMemoryTool(t));
    const memoryCardTools = allGateTools.filter(isMemoryTool);
    // FF first, then the registers (Register4, Register) in their build order.
    const sequentialCards = (typeof sequentialToolsAvailable === "function" && sequentialToolsAvailable())
      ? [{ type: "ffCard", label: "FF" }, ...memoryCardTools]
      : memoryCardTools;

    // User-built cards join the palette (as generic-icon tools) wherever the
    // learner is free to build — the same places the built gates appear.
    const cardTools = isNandPresentationWorkspace()
      ? []
      : (typeof savedCardTools === "function" ? savedCardTools() : []);

    // The clocked (sequential) table has a deliberately narrow palette: just the
    // NOT gate, a source, a lamp and the נעץ (routing dot). Nothing else — the
    // whole point is to explore feedback loops with the simplest possible parts.
    // The memory-card build (Register4 / Register) is clocked too, but gets the
    // FULL palette — every previously-built tool + the splitter — PLUS the נעץ and
    // the FF, so the learner can build a sequential card from anything.
    const memoryBuild = typeof memoryBuildAvailable === "function" && memoryBuildAvailable();
    const clockedMinimal = !memoryBuild && typeof nailAvailable === "function" && nailAvailable();

    const tools = memoryBuild
      ? [
          { type: "nand", label: "Nand" },
          ...builtGateTools,
          ...cardTools,
          // Same order as everywhere else: the sequential cards, then accessories.
          { type: "ffCard", label: "FF" },
          ...memoryCardTools,
          { type: "lamp", label: "מנורה" },
          { type: "source", label: "מקור מתח" },
          { type: "splitter", label: "מפצל" },
          // The converters come along here too: a RAM build needs a way to dial an
          // address (and a value) by hand while experimenting.
          ...((typeof convertersAvailable === "function" && convertersAvailable()) ? [{ type: "converter-out", label: "ממיר לבינרי" }, { type: "converter-in", label: "ממיר לעשרוני" }] : []),
          { type: "nail", label: "נעץ" }
        ]
      : clockedMinimal
      ? [
          { type: gateComponentType("Not"), label: "Not" },
          // The MUX joins the palette in the flip-flop scene — right after the Not,
          // before the source/lamp/nail accessories.
          ...(typeof muxToolAvailable === "function" && muxToolAvailable() ? [{ type: gateComponentType("Mux"), label: "MUX" }] : []),
          // The finished flip-flop card (FF) joins the palette once the MUX-latch
          // demo has collapsed it into a single reusable component.
          ...(typeof ffCardAvailable === "function" && ffCardAvailable() ? [{ type: "ffCard", label: "FF" }] : []),
          { type: "source", label: "מקור מתח" },
          { type: "lamp", label: "מנורה" },
          { type: "nail", label: "נעץ" }
        ]
      : [
          { type: "nand", label: "Nand" },
          ...builtGateTools,
          ...cardTools,
          // The sequential cards (FF, Register4, Register) come AFTER every older
          // card and BEFORE the accessories below.
          ...sequentialCards,
          { type: "lamp", label: "מנורה" },
          { type: "source", label: "מקור מתח" },
          // The splitter is available in every build from chapter 2.4 on (once it is
          // introduced), plus the free "empty table" and any bus/multibit task build.
          // NEVER in the minimal Nand-presentation palette, though: splitterAvailable
          // keys off the CURRENT chapter, so once the learner has reached 2.4 and
          // later replays the Nand presentation it would otherwise leak in (only the
          // splitter, since built gates/cards are already excluded above).
          ...(!isNandPresentationWorkspace() && ((splitterAvailable && splitterAvailable()) || (isFreeBuildWorkspace && isFreeBuildWorkspace()) || (isBusTaskWorkspace && isBusTaskWorkspace()) || (isMultibitTaskWorkspace && isMultibitTaskWorkspace())) ? [{ type: "splitter", label: "מפצל" }] : []),
          // The binary↔decimal converters, on the 2.5 worktable (arith builds).
          ...(!isNandPresentationWorkspace() && (typeof convertersAvailable === "function" && convertersAvailable()) ? [{ type: "converter-out", label: "ממיר לבינרי" }, { type: "converter-in", label: "ממיר לעשרוני" }] : []),
          // The נעץ is an accessory, so it closes the row from part 3 on.
          ...(!isNandPresentationWorkspace() && (typeof sequentialToolsAvailable === "function" && sequentialToolsAvailable()) ? [{ type: "nail", label: "נעץ" }] : [])
        ];

    // The "create new card" tool, unlocked at the end of the MUX16 walkthrough.
    // It is an action button (not a draggable component); its click is not wired
    // up yet.
    const createCardButton = (typeof createCardToolAvailable === "function" && createCardToolAvailable() && !isNandPresentationWorkspace())
      ? `<button class="toolbox-component toolbox-create-card" data-action="create-card-tool" type="button" aria-label="יצירת כרטיס חדש">
          <svg class="toolbox-icon" viewBox="-90 -85 180 170" aria-hidden="true" focusable="false">
            <rect x="-46" y="-56" width="92" height="112" rx="10" fill="none" stroke="currentColor" stroke-width="8" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
            <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
          </svg>
          <span>יצירת כרטיס חדש</span>
        </button>`
      : "";

    return `
      <aside class="workspace-toolbox" aria-label="סרגל כלים">
        ${toolboxBody(tools)}
        ${createCardButton}
        <div class="toolbox-trash" data-trash aria-label="פח זבל">
          ${trashIcon()}
          <span>פח</span>
        </div>
      </aside>`;
  }

  return { renderToolbar };
}

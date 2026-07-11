// board-render.js — the SVG markup for the live contents of the workbench board
// (wires, terminals, and placed components), extracted from app.js. Each builder
// takes the workspace explicitly and returns an SVG string; renderComponent also
// takes the current evaluation (for lamp state). They read no globals — anything
// state-derived (solution highlighting, fixed-component test, geometry, art) is
// INJECTED.
//
// Loaded BEFORE app.js. createBoardRender(deps) -> { renderWires, renderTerminals,
//                                                    renderComponent }
//   deps: solutionHighlightConfig, terminalPosition, wireKey, esc, componentDef,
//         componentMarkup, charredNandMarkup, smokeMarkup, isFixedWorkspaceComponent

function createBoardRender({
  solutionHighlightConfig,
  terminalPosition,
  wireKey,
  esc,
  componentDef,
  componentMarkup,
  charredNandMarkup,
  smokeMarkup,
  isFixedWorkspaceComponent
}) {
  function renderWires(workspace) {
    const highlight = solutionHighlightConfig();
    return workspace.wires.map((wire) => {
      const a = terminalPosition(workspace, wire.a);
      const b = terminalPosition(workspace, wire.b);
      if (!a || !b) return "";
      const key = wireKey(wire.a, wire.b);
      const highlightClass = highlight.wires.has(key) ? " wire-highlight" : "";
      const wrap = (shape) => `
        <g class="wire${highlightClass}" data-action="workspace-wire" data-wire-key="${esc(key)}" role="button" tabindex="0" aria-label="מחק כבל">
          ${shape("wire-line")}
          ${shape("wire-hit-line")}
        </g>`;

      // A wire reaching a pin above the card frame (the MUX control input) is
      // routed up-and-over so it does not cross the card.
      const top = a.y < 90 ? a : (b.y < 90 ? b : null);
      if (top) {
        const other = top === a ? b : a;
        const d = `M ${other.x} ${other.y} L ${other.x} ${top.y} L ${top.x} ${top.y}`;
        return wrap((cls) => `<path class="${cls}" d="${d}" fill="none" />`);
      }

      return wrap((cls) => `<line class="${cls}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`);
    }).join("");
  }

  function renderTerminals(workspace) {
    const highlight = solutionHighlightConfig();
    return workspace.components.map((component) => {
      const def = componentDef(component.type);
      return Object.entries(def.pins).map(([pinId, pin]) => {
        const ref = `${component.id}.${pinId}`;
        const selected = workspace.selectedTerminal === ref ? " terminal-selected" : "";
        const solutionClass = highlight.terminals.has(ref) ? " terminal-solution-highlight" : "";
        return `<circle class="terminal-hit${selected}${solutionClass}" data-action="workspace-terminal" data-terminal-ref="${esc(ref)}" aria-label="${esc(pin.label)}" role="button" tabindex="0" cx="${component.x + pin.x}" cy="${component.y + pin.y}" r="12"></circle>`;
      }).join("");
    }).join("");
  }

  function renderComponent(component, evaluation, workspace) {
    if (componentDef(component.type)?.fixed) return "";
    const lampOn = component.type === "lamp" ? evaluation.lamps.get(component.id) : false;
    const smoking = workspace.accident?.type === "nand-overvoltage" && workspace.accident.nandId === component.id;
    const burnedClass = smoking && component.type === "nand" ? " component-nand-burned" : "";
    const fixedClass = isFixedWorkspaceComponent(component) ? " component-fixed" : "";
    const solutionHighlightClass = solutionHighlightConfig().components.has(component.id) ? " component-solution-highlight" : "";
    return `
      <g class="workspace-component component-${esc(component.type)}${burnedClass}${fixedClass}${solutionHighlightClass}" data-action="workspace-component" data-component-id="${esc(component.id)}" transform="translate(${component.x} ${component.y})">
        ${componentMarkup(component.type, { lampOn })}
        ${smoking ? charredNandMarkup() : ""}
        ${smoking ? smokeMarkup() : ""}
      </g>`;
  }

  return { renderWires, renderTerminals, renderComponent };
}

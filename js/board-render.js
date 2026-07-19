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
  isFixedWorkspaceComponent,
  componentRenderScale,
  resolvePins,
  pinWidth
}) {
  const renderScale = (type) => (componentRenderScale ? componentRenderScale(type) : 1);
  const pinsFor = (component) => (resolvePins ? resolvePins(component) : componentDef(component.type).pins);

  function renderWires(workspace) {
    const highlight = solutionHighlightConfig();
    return workspace.wires.map((wire) => {
      const a = terminalPosition(workspace, wire.a);
      const b = terminalPosition(workspace, wire.b);
      if (!a || !b) return "";
      const key = wireKey(wire.a, wire.b);
      const highlightClass = highlight.wires.has(key) ? " wire-highlight" : "";
      // A connection wider than a single bit is drawn as a bus; a 1-bit wire
      // (or an as-yet-untyped wire) looks like an ordinary cable.
      const width = pinWidth ? (pinWidth(workspace, wire.a) ?? pinWidth(workspace, wire.b) ?? 1) : 1;
      const busClass = width > 1 ? " wire-bus" : "";
      const wrap = (shape) => `
        <g class="wire${highlightClass}${busClass}" data-action="workspace-wire" data-wire-key="${esc(key)}" role="button" tabindex="0" aria-label="מחק כבל">
          ${shape("wire-line")}
          ${width > 1 ? shape("wire-bus-stripe") : ""}
          ${shape("wire-hit-line")}
        </g>`;

      // A wire reaching the CARD's external control pin (which sits over the top
      // edge of the frame) is routed up-and-over so it does not cross the card.
      // The control's INTERNAL pin sits just inside the frame (below the top
      // edge), so its wires to the gates stay straight. Only a fixed card-frame
      // pin triggers this — a splitter/gate that merely happens to sit high (e.g.
      // the check harness's control splitter) still connects with a straight line.
      const isFrameTopPin = (ref, pos) => {
        if (!pos || pos.y >= 60) return false;
        const compId = String(ref).split(".")[0];
        const comp = workspace.components.find((c) => c.id === compId);
        return Boolean(comp && componentDef(comp.type)?.fixed);
      };
      const top = isFrameTopPin(wire.a, a) ? a : (isFrameTopPin(wire.b, b) ? b : null);
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
      return Object.entries(pinsFor(component)).map(([pinId, pin]) => {
        const ref = `${component.id}.${pinId}`;
        const selected = workspace.selectedTerminal === ref ? " terminal-selected" : "";
        const solutionClass = highlight.terminals.has(ref) ? " terminal-solution-highlight" : "";
        const scale = Number.isFinite(component.scale) ? component.scale : renderScale(component.type);
        return `<circle class="terminal-hit${selected}${solutionClass}" data-action="workspace-terminal" data-terminal-ref="${esc(ref)}" aria-label="${esc(pin.label)}" role="button" tabindex="0" cx="${component.x + pin.x * scale}" cy="${component.y + pin.y * scale}" r="12"></circle>`;
      }).join("");
    }).join("");
  }

  // The digit string shown on a placed converter: the decimal value padded to
  // the number of digits the connected bus width allows (dynamic; ~6 unconnected).
  function converterDigits(component, evaluation) {
    const info = (evaluation.converters && evaluation.converters.get(component.id)) || { value: 0, width: null };
    const w = Number.isInteger(info.width) ? Math.min(info.width, 40) : null;
    const digitCount = Math.min(12, w ? String(Math.pow(2, w) - 1).length : 6);
    const raw = String(Math.max(0, Math.floor(info.value || 0)));
    return raw.length >= digitCount ? raw : raw.padStart(digitCount, "0");
  }

  function renderComponent(component, evaluation, workspace) {
    if (componentDef(component.type)?.fixed) return "";
    const lampOn = component.type === "lamp" ? evaluation.lamps.get(component.id) : false;
    const isConverter = component.type === "converter-in" || component.type === "converter-out";
    const converterOpts = isConverter
      ? { digits: converterDigits(component, evaluation), interactive: component.type === "converter-out", componentId: component.id }
      : {};
    const smoking = workspace.accident?.type === "nand-overvoltage" && workspace.accident.nandId === component.id;
    const burnedClass = smoking && component.type === "nand" ? " component-nand-burned" : "";
    const fixedClass = isFixedWorkspaceComponent(component) ? " component-fixed" : "";
    const solutionHighlightClass = solutionHighlightConfig().components.has(component.id) ? " component-solution-highlight" : "";
    const scale = Number.isFinite(component.scale) ? component.scale : renderScale(component.type);
    const scaleTransform = scale === 1 ? "" : ` scale(${scale})`;
    return `
      <g class="workspace-component component-${esc(component.type)}${burnedClass}${fixedClass}${solutionHighlightClass}" data-action="workspace-component" data-component-id="${esc(component.id)}" transform="translate(${component.x} ${component.y})${scaleTransform}">
        ${componentMarkup(component.type, { lampOn, outputs: component.outputs, mirrored: component.mirrored, width: component.width, ...converterOpts })}
        ${smoking ? charredNandMarkup() : ""}
        ${smoking ? smokeMarkup() : ""}
      </g>`;
  }

  return { renderWires, renderTerminals, renderComponent };
}

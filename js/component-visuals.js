// component-visuals.js — the SVG markup for each workbench component, extracted
// from app.js. Given a component type (and small options such as whether a lamp
// is lit), these functions return the SVG string drawn on the board or in the
// toolbar, plus the accident overlays (smoke and char marks). They are pure
// string builders and touch neither the DOM nor app state.
//
// Loaded BEFORE app.js. Dependencies are INJECTED via createComponentVisuals(...):
//   esc               - HTML/attribute escaper
//   gateComponentType - taskId -> "gate-<taskId>"
//   taskDefById       - taskId -> task definition (for gate art)
//
// createComponentVisuals(deps) -> { componentSvgFilenameForType, componentMarkup,
//                                   smokeMarkup, charredNandMarkup }

function createComponentVisuals({ esc, gateComponentType, taskDefById, busGateSpec }) {
  function componentSvgImage(filename, x, y, width, height) {
    const href = `assets/components/${filename}`;
    return `<image class="component-svg" href="${esc(href)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"></image>`;
  }

  function componentSvgFilenameForType(type, options = {}) {
    if (type === "source") return "source.svg";
    if (type === "nand") return "nand.svg";
    if (type === "lamp") return options.lampOn ? "lamp-on.svg" : "lamp-off.svg";
    if (type === "gate-Not") return "gate-not.svg";
    if (type === "gate-And") return "gate-and.svg";
    if (type === "gate-Or") return "gate-or.svg";
    if (type === "gate-Xor") return "gate-xor.svg";
    if (type === "gate-AND3way") return "gate-and3way.svg";
    if (type === "gate-OR4way") return "gate-or4way.svg";
    if (type === "gate-Mux") return "gate-mux.svg";
    if (type === "gate-DMux") return "gate-dmux.svg";
    if (type === "bus") return "bus.svg";
    if (type === "splitter") return "splitter.svg";
    return "";
  }

  function sourceMarkup() {
    return componentSvgImage("source.svg", -36, -50, 92, 100);
  }

  function nandMarkup() {
    return componentSvgImage("nand.svg", -66, -52, 154, 104);
  }

  function lampMarkup(isOn = false) {
    return componentSvgImage(isOn ? "lamp-on.svg" : "lamp-off.svg", -55, -100, 110, 140);
  }

  function gateSvgFilename(task) {
    return task ? componentSvgFilenameForType(gateComponentType(task.id)) : "";
  }

  function gateMarkup(task) {
    const filename = gateSvgFilename(task);
    if (!filename) return "";
    return componentSvgImage(filename, -66, -52, 154, 104);
  }

  // Chapter 2.4 multi-bit symbols. Appearance only for now (used in the
  // monologue); their workbench behaviour is not wired up yet.
  function busMarkup() {
    return componentSvgImage("bus.svg", -66, -52, 154, 104);
  }

  // A short length of "bus" cable drawn like the bus symbol / bus wire: a solid
  // black bar with a light dashed line running along its length.
  function splitterBusBar(x1, x2, y, h) {
    const half = h / 2;
    return `<rect class="splitter-bar" x="${x1}" y="${y - half}" width="${x2 - x1}" height="${h}" /><line class="splitter-stripe" x1="${x1 + 3}" y1="${y}" x2="${x2 - 3}" y2="${y}" />`;
  }

  // A width-1 pin is an ordinary cable, not a bus.
  function splitterCableStub(x1, x2, y) {
    return `<line class="splitter-cable" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />`;
  }

  // The splitter as drawn on the board: a black spine with one input bus on one
  // side and `outputs` legs on the other. A leg whose width is 1 is drawn as a
  // plain cable; otherwise it is a bus bar. Outputs are spaced to leave room for
  // a width label above each pin. Mirrored instances are flipped around the
  // y-axis. (The toolbar uses the static splitter.svg — see splitterMarkup.)
  const SPLITTER_OUTPUT_SPACING = 34;
  const SPLITTER_BAR_H = 11;
  function splitterBoardMarkup(outputs, mirrored, width) {
    const n = Math.min(16, Math.max(2, Number(outputs) || 4));
    const spacing = SPLITTER_OUTPUT_SPACING;
    const legWidth = Number.isInteger(width) ? width : null;
    const ys = [];
    for (let i = 0; i < n; i++) ys.push(Math.round((i - (n - 1) / 2) * spacing));
    const halfH = ((n - 1) * spacing) / 2;
    const spineTop = -(halfH + 8);
    const spine = `<rect class="splitter-bar" x="-7" y="${spineTop}" width="14" height="${halfH * 2 + 16}" />`;
    const inputBar = splitterBusBar(-70, -7, 0, SPLITTER_BAR_H);
    const leg = (y) => (legWidth === 1 ? splitterCableStub(7, 66, y) : splitterBusBar(7, 66, y, SPLITTER_BAR_H));
    const outputStubs = ys.map(leg).join("");
    const hit = `<rect class="splitter-hit" x="-74" y="${spineTop - 12}" width="146" height="${halfH * 2 + 40}" fill="transparent" />`;
    const inner = `${hit}${spine}${inputBar}${outputStubs}`;
    return mirrored ? `<g transform="scale(-1 1)">${inner}</g>` : inner;
  }

  function splitterMarkup(options = {}) {
    // The board passes the instance's output count; the toolbar does not, and
    // gets the static reference symbol.
    if (Number.isInteger(options.outputs)) {
      return splitterBoardMarkup(options.outputs, options.mirrored, options.width);
    }
    return componentSvgImage("splitter.svg", -66, -52, 154, 104);
  }

  function componentMarkup(type, options = {}) {
    if (type === "source") return sourceMarkup();
    if (type === "nand") return nandMarkup();
    if (type === "lamp") return lampMarkup(Boolean(options.lampOn));
    if (type === "bus") return busMarkup();
    if (type === "splitter") return splitterMarkup(options);
    if (type.startsWith("gate-")) {
      // A bus gate (gate-Not4 …) draws exactly like its base gate — the same
      // schematic symbol, keyed off its op (NOT4 → the NOT symbol).
      const bus = typeof busGateSpec === "function" ? busGateSpec(type) : null;
      if (bus) return gateMarkup(taskDefById(bus.op));
      return gateMarkup(taskDefById(type.slice(5)));
    }
    return "";
  }

  function smokeMarkup() {
    return `
      <g class="nand-smoke" aria-hidden="true">
        <path class="smoke-wisp smoke-wisp-1" d="M0 -47 C-20 -62 6 -76 -10 -94 C-23 -108 -4 -122 -18 -138" />
        <path class="smoke-wisp smoke-wisp-2" d="M12 -47 C27 -64 6 -78 24 -98 C37 -113 14 -124 31 -143" />
        <path class="smoke-wisp smoke-wisp-3" d="M-8 -52 C4 -70 -17 -84 1 -104 C14 -118 -11 -130 4 -150" />
        <path class="smoke-haze" d="M-27 -62 C-8 -84 28 -82 37 -58 C25 -48 -9 -45 -27 -62 Z" />
      </g>`;
  }

  function charredNandMarkup() {
    return `
      <g class="nand-char" aria-hidden="true">
        <path class="nand-char-mark nand-char-mark-1" d="M-24 -30 C-6 -40 8 -30 3 -11 C-10 -10 -24 -15 -24 -30 Z" />
        <path class="nand-char-mark nand-char-mark-2" d="M13 3 C34 -4 47 12 35 29 C17 28 7 19 13 3 Z" />
        <path class="nand-char-crack" d="M-2 -36 L7 -17 L-1 0 L10 18 L4 36" />
      </g>`;
  }

  return { componentSvgFilenameForType, componentMarkup, smokeMarkup, charredNandMarkup };
}

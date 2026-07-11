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

function createComponentVisuals({ esc, gateComponentType, taskDefById }) {
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

  function componentMarkup(type, options = {}) {
    if (type === "source") return sourceMarkup();
    if (type === "nand") return nandMarkup();
    if (type === "lamp") return lampMarkup(Boolean(options.lampOn));
    if (type.startsWith("gate-")) return gateMarkup(taskDefById(type.slice(5)));
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

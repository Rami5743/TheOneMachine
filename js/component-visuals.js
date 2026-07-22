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

function createComponentVisuals({ esc, gateComponentType, taskDefById, busGateSpec, savedCardMarkup }) {
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

  // The arith cards (halfAdder / fullAdder) have no schematic symbol, so their
  // placeable gate is drawn as a "+" box: a rounded body with a plus sign in the
  // middle (halfAdder's plus is missing its lower leg — "half" a plus), input
  // stubs on the left and two output stubs on the right — carry (c) on top, sum
  // (s) on the bottom. Pin geometry matches the gate-<id> def in app.js.
  const ARITH_GATE_IDS = ["halfAdder", "fullAdder"];
  function arithGateMarkup(task, options = {}) {
    if (!task) return "";
    const inYs = task.inputs === 3 ? [-27, 0, 27] : [-23, 23];
    const bodyW = 92;
    const bodyH = 84;
    const inX = -62;
    const outX = 66;
    const carryY = -23;
    const sumY = 23;
    const arm = 17;
    const half = task.id === "halfAdder";
    let s = `<rect class="usercard-body" x="${-bodyW / 2}" y="${-bodyH / 2}" width="${bodyW}" height="${bodyH}" rx="12" />`;
    // The "+" mark (halfAdder omits the lower leg).
    s += `<line class="arith-gate-plus" x1="${-arm}" y1="0" x2="${arm}" y2="0" />`;
    s += `<line class="arith-gate-plus" x1="0" y1="${-arm}" x2="0" y2="${half ? 0 : arm}" />`;
    inYs.forEach((y) => { s += `<line class="usercard-pin" x1="${-bodyW / 2}" y1="${y}" x2="${inX}" y2="${y}" />`; });
    s += `<line class="usercard-pin" x1="${bodyW / 2}" y1="${carryY}" x2="${outX}" y2="${carryY}" />`;
    s += `<line class="usercard-pin" x1="${bodyW / 2}" y1="${sumY}" x2="${outX}" y2="${sumY}" />`;
    s += `<text class="arith-gate-pin-letter" x="${bodyW / 2 - 9}" y="${carryY + 5}" text-anchor="end">c</text>`;
    s += `<text class="arith-gate-pin-letter" x="${bodyW / 2 - 9}" y="${sumY + 5}" text-anchor="end">s</text>`;
    // No name caption under the placed adder gates: the "+" mark and the c/s pin
    // letters already identify them, and the label only crowded the workbench.
    return `<g class="usercard">${s}</g>`;
  }

  // The placeable Add4 gate (the building block of Add16): the SAME "+" box as
  // the fullAdder, but its number pins are width-4 BUSES — so they are drawn as
  // bus bars (thick + dashed stripe) with the width "4" labelled, while the
  // single-bit carry pins stay plain thin cables. This is the Add4-vs-fullAdder
  // distinction, exactly like AND4 vs AND. Matches the gate-Add4 pin offsets.
  // The bus-adder gate. Add4 (carry=true): two number buses + a single-bit
  // carry-in on the left; a single-bit carry-out (c) and a bus sum (s) on the
  // right — the pins that chain the blocks. Add16 (carry=false): no carry at all,
  // just two symmetric number buses on the left and one bus sum on the right, so
  // it is drawn shorter on the y-axis. Only the bus width label differs (4 vs 16).
  function addNGateMarkup(width, carry = true) {
    // Box edge at ±44 (like AND4's symbol edge) so the pins sit ENTIRELY outside
    // the box: the pin terminals are at x ±62/66, the box edge at ±44, so each
    // stub is a full-length AND4-style pin that never pokes into the box.
    const edge = 44;
    const bodyW = edge * 2;
    // Pins are spaced far enough apart that each bus pin's width label, which sits
    // ~22px above the bar, clears the pin above it. The carry variant stacks three
    // inputs (±52); the carry-less Add16 has two symmetric inputs (±26) and one
    // centred output, so its box is shorter.
    const inYs = carry ? [-52, 0, 52] : [-26, 26];
    const outYs = carry ? [-34, 34] : [0];
    // Tall enough to contain the top pin AND its width label above it.
    const bodyH = carry ? 176 : 116;
    const inX = -62;
    const outX = 66;
    const arm = 17;
    // A bus pin drawn EXACTLY like AND4's bus pins (busGateBar): same bar
    // thickness, stripe and width label — busGateBar pre-multiplies by 1/0.6 so
    // that after the gate's 0.6 render scale the pin comes out at full bus size.
    const busPin = (x1, x2, y) => busGateBar({ x1: Math.min(x1, x2), x2: Math.max(x1, x2), y }, width, true);
    const cable = (x1, x2, y) => `<line class="usercard-pin" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />`;
    let s = `<rect class="usercard-body" x="${-edge}" y="${-bodyH / 2}" width="${bodyW}" height="${bodyH}" rx="14" />`;
    // The full "+" mark, like the fullAdder.
    s += `<line class="arith-gate-plus" x1="${-arm}" y1="0" x2="${arm}" y2="0" />`;
    s += `<line class="arith-gate-plus" x1="0" y1="${-arm}" x2="0" y2="${arm}" />`;
    if (carry) {
      // Inputs (left): two number buses + the single-bit carry-in below them.
      s += busPin(inX, -edge, inYs[0]);
      s += busPin(inX, -edge, inYs[1]);
      s += cable(inX, -edge, inYs[2]);
      // Outputs (right): carry-out (c, single bit) on top, sum (s, bus) below.
      s += cable(edge, outX, outYs[0]);
      s += busPin(edge, outX, outYs[1]);
      s += `<text class="arith-gate-pin-letter" x="${edge - 9}" y="${outYs[0] + 5}" text-anchor="end">c</text>`;
      s += `<text class="arith-gate-pin-letter" x="${edge - 9}" y="${outYs[1] + 5}" text-anchor="end">s</text>`;
    } else {
      // Add16: two number buses in, one bus sum out — no carry pins, no letters.
      s += busPin(inX, -edge, inYs[0]);
      s += busPin(inX, -edge, inYs[1]);
      s += busPin(edge, outX, outYs[0]);
    }
    return `<g class="usercard">${s}</g>`;
  }

  // The Inc gate (chapter 2.6): a "+1" box with ONE bus input on the left and
  // ONE bus output on the right (output = input + 1). Same box/pin styling as
  // addNGateMarkup, but a single symmetric input/output and a "+1" label.
  function incGateMarkup(width) {
    const edge = 44;
    const bodyW = edge * 2;
    const bodyH = 88;
    const inX = -62;
    const outX = 66;
    const busPin = (x1, x2, y) => busGateBar({ x1: Math.min(x1, x2), x2: Math.max(x1, x2), y }, width, true);
    let s = `<rect class="usercard-body" x="${-edge}" y="${-bodyH / 2}" width="${bodyW}" height="${bodyH}" rx="14" />`;
    // A "+1" mark inside the box.
    s += `<text class="arith-gate-pin-letter" x="0" y="9" text-anchor="middle">+1</text>`;
    s += busPin(inX, -edge, 0);
    s += busPin(edge, outX, 0);
    return `<g class="usercard">${s}</g>`;
  }

  // The ALU0 gate (chapter 2.6): a box labelled "ALU" with two width-16 number
  // buses on the left, a single-bit control cable poking out the TOP, and one
  // width-16 output bus on the right (control selects AND vs ADD).
  // The ALU-family gate symbol (chapter 2.6): the classic ALU shape — a tall,
  // notched left edge where the operands enter (a chevron pointing right), the
  // top and bottom sloping in, and a short right edge for the result. `inputYs`
  // lists the operand terminal heights (2 for ALU0/ALU1, 3 for ALU2/ALU3); an
  // operand at the notch height reaches the chevron tip like an extra leg.
  // `opts.tall` makes the body taller so three operands fit.
  function aluShapeMarkup(width, label, inputYs, opts) {
    opts = opts || {};
    const hw = 46;
    const hh = opts.tall ? 54 : 40;   // tall left (input) edge half-height
    const hhr = opts.tall ? 30 : 20;  // short right (output) edge half-height
    const nTop = -13, nBot = 13, nTip = -24;  // the chevron notch on the left edge
    const inX = -62, outX = 66;
    const text = label || "ALU";
    const busPin = (x1, x2, y) => busGateBar({ x1: Math.min(x1, x2), x2: Math.max(x1, x2), y }, width, true);
    let s = `<path class="usercard-body" d="M ${-hw} ${-hh} L ${hw} ${-hhr} L ${hw} ${hhr} L ${-hw} ${hh} L ${-hw} ${nBot} L ${nTip} 0 L ${-hw} ${nTop} Z" />`;
    s += `<text class="arith-gate-pin-letter" x="6" y="6" text-anchor="middle"${text.length > 3 ? ' style="font-size:16px"' : ''}>${text}</text>`;
    for (const y of inputYs) s += busPin(inX, Math.abs(y) < nBot ? nTip : -hw, y);
    s += busPin(hw, outX, 0);   // result bus on the right
    // The control pokes out of the sloping top edge toward its terminal: a wide
    // (bus) control is drawn as a bus bar, a single-bit control as a thin cable.
    const topY = -(hh + hhr) / 2;
    s += (opts.controlWidth > 1)
      ? busGateBarV(0, topY + 4, -46)
      : `<line class="usercard-pin" x1="0" y1="${topY}" x2="0" y2="-46" />`;
    return `<g class="usercard">${s}</g>`;
  }

  // The PreperNum gate (chapter 2.6): a box labelled "Prep" with a width-16 bus
  // on the left, a width-2 control bus poking out the TOP, and a width-16 output
  // bus on the right.
  function prepGateMarkup(width) {
    const edge = 44;
    const bodyW = edge * 2;
    const bodyH = 76;
    const inX = -62;
    const outX = 66;
    const busPin = (x1, x2, y) => busGateBar({ x1: Math.min(x1, x2), x2: Math.max(x1, x2), y }, width, true);
    let s = `<rect class="usercard-body" x="${-edge}" y="${-bodyH / 2}" width="${bodyW}" height="${bodyH}" rx="14" />`;
    s += `<text class="arith-gate-pin-letter" x="0" y="5" text-anchor="middle" style="font-size:16px">Prep</text>`;
    s += busPin(inX, -edge, 0);   // number bus in
    s += busPin(edge, outX, 0);   // result bus out
    // The width-2 control bus pokes out of the top edge toward its terminal —
    // drawn as a bus bar (not a thin cable) so it reads as a width-2 bus.
    s += busGateBarV(0, -bodyH / 2 + 4, -46);
    return `<g class="usercard">${s}</g>`;
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
    // Pins on both sides are ~half the old length (single 70→38, legs 66→37).
    const inputBar = splitterBusBar(-38, -7, 0, SPLITTER_BAR_H);
    const leg = (y) => (legWidth === 1 ? splitterCableStub(7, 37, y) : splitterBusBar(7, 37, y, SPLITTER_BAR_H));
    const outputStubs = ys.map(leg).join("");
    const hit = `<rect class="splitter-hit" x="-44" y="${spineTop - 12}" width="87" height="${halfH * 2 + 40}" fill="transparent" />`;
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

  // The pin stubs of each base gate (from its SVG), redrawn as bus bars for the
  // bus gates. Each entry is the [x1,x2] extent (and y) of a stub line.
  const BUS_GATE_BARS = {
    Not: [{ x1: -60, x2: -42, y: 0 }, { x1: 48, x2: 80, y: 0 }],
    And: [{ x1: -62, x2: -44, y: -23 }, { x1: -62, x2: -44, y: 23 }, { x1: 44, x2: 66, y: 0 }],
    Or: [{ x1: -58, x2: -28, y: -23 }, { x1: -58, x2: -28, y: 23 }, { x1: 62, x2: 80, y: 0 }],
    // MUX: two data inputs (left) and the output (right) are buses; the control
    // stub on top stays a thin single-bit line.
    Mux: [{ x1: -62, x2: -30, y: -23 }, { x1: -62, x2: -30, y: 23 }, { x1: 30, x2: 66, y: 0 }]
  };

  // A bus gate (gate-Not4 …): the base gate's schematic symbol, with its thin
  // pin stubs overdrawn as bus bars (thick dashed + the width number) so the
  // pins read as width-N buses. Body identical to the base gate; pins differ.
  // Bus gates render at GATE_RENDER_SCALE (0.6) in chapter 2.4, which would
  // shrink the bars below normal bus thickness — so the bar/stripe/label sizes
  // are pre-divided by that scale to come out the same thickness as a real bus.
  const BUS_GATE_SCALE = 0.6;
  const K = 1 / BUS_GATE_SCALE;
  function busGateBar(b, width, showLabel) {
    const half = (11 * K) / 2;
    // The width number is omitted in the toolbar icon (too small to read, and
    // the tool already has a text label beneath it).
    const label = showLabel
      ? `<text class="splitter-width-label" x="${(b.x1 + b.x2) / 2}" y="${b.y - 13 * K}" text-anchor="middle" style="font-size:${13 * K}px">${width}</text>`
      : "";
    return `
      <rect class="splitter-bar" x="${b.x1}" y="${b.y - half}" width="${b.x2 - b.x1}" height="${11 * K}" />
      <line class="splitter-stripe" x1="${b.x1 + 3}" y1="${b.y}" x2="${b.x2 - 3}" y2="${b.y}" style="stroke-width:${3 * K};stroke-dasharray:${6 * K} ${3 * K}" />
      ${label}`;
  }

  // A VERTICAL bus bar (for a control pin that pokes out the top of a gate): the
  // same thick dashed bar as busGateBar but running along y between y1 and y2 at
  // a fixed x. Used to draw wide control cables (PreperNum, ALU1/2/3) as buses.
  function busGateBarV(cx, y1, y2) {
    const half = (11 * K) / 2;
    const top = Math.min(y1, y2), bot = Math.max(y1, y2);
    return `
      <rect class="splitter-bar" x="${cx - half}" y="${top}" width="${11 * K}" height="${bot - top}" />
      <line class="splitter-stripe" x1="${cx}" y1="${top + 3}" x2="${cx}" y2="${bot - 3}" style="stroke-width:${3 * K};stroke-dasharray:${6 * K} ${3 * K}" />`;
  }
  function busGateMarkup(spec, options = {}) {
    const symbol = gateMarkup(taskDefById(spec.op));
    const bars = (BUS_GATE_BARS[spec.op] || []).map((b) => busGateBar(b, spec.width, !options.toolbar)).join("");
    return `<g class="bus-gate">${symbol}${bars}</g>`;
  }

  function componentMarkup(type, options = {}) {
    if (type === "source") return sourceMarkup();
    if (type === "nand") return nandMarkup();
    if (type === "lamp") return lampMarkup(Boolean(options.lampOn));
    if (type === "converter-in" || type === "converter-out") {
      return `<g class="converter">${converterMarkup(type === "converter-out" ? "out" : "in", options)}</g>`;
    }
    if (type === "bus") return busMarkup();
    if (type === "splitter") return splitterMarkup(options);
    if (type.startsWith("usercard-")) return typeof savedCardMarkup === "function" ? savedCardMarkup(type, options) : "";
    if (type.startsWith("gate-")) {
      // A bus gate (gate-Not4 …) draws like its base gate — same symbol, keyed
      // off its op — but with bus pins.
      const bus = typeof busGateSpec === "function" ? busGateSpec(type) : null;
      if (bus) return busGateMarkup(bus, options);
      const gateTask = taskDefById(type.slice(5));
      if (gateTask && gateTask.id === "Add4") return addNGateMarkup(4, true);
      if (gateTask && gateTask.id === "Add16") return addNGateMarkup(16, false);
      if (gateTask && gateTask.id === "Inc") return incGateMarkup(16);
      if (gateTask && gateTask.id === "ALU0") return aluShapeMarkup(16, "ALU0", [-26, 26], { controlWidth: 1 });
      if (gateTask && gateTask.id === "PreperNum") return prepGateMarkup(16);
      if (gateTask && gateTask.id === "ALU1") return aluShapeMarkup(16, "ALU1", [-26, 26], { controlWidth: 6 });
      if (gateTask && gateTask.id === "ALU2") return aluShapeMarkup(16, "ALU2", [-34, 0, 34], { tall: true, controlWidth: 7 });
      if (gateTask && gateTask.id === "ALU3") return aluShapeMarkup(16, "ALU3", [-34, 0, 34], { tall: true, controlWidth: 12 });
      if (gateTask && ARITH_GATE_IDS.includes(gateTask.id)) return arithGateMarkup(gateTask, options);
      return gateMarkup(gateTask);
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

  // Which of the seven segments (a top, b top-right, c bottom-right, d bottom,
  // e bottom-left, f top-left, g middle) light up for each decimal digit. A
  // primitive 7-segment display: "8" uses all seven lamps, "0" uses six (no g).
  const SEVEN_SEG = {
    "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
    "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg"
  };

  // One 7-segment glyph filling a tall cell (top-left x0,y0; size W×H). Lit lamps
  // use a neutral grey; unlit lamps stay a barely-there ghost so the figure-8
  // grid reads. Returns the seven <rect> segments.
  function sevenSegGlyph(ch, x0, y0, W, H, t) {
    const on = SEVEN_SEG[String(ch)] || "";
    const lit = "#cfcfd2", dim = "#26262b";
    const col = (k) => (on.indexOf(k) >= 0 ? lit : dim);
    const midY = y0 + H / 2;
    const hx = x0 + t * 0.7, hw = W - t * 1.4;      // horizontal segment span
    const vh = H / 2 - t * 1.3;                       // vertical segment length
    const hseg = (yy, k) => `<rect x="${hx}" y="${yy - t / 2}" width="${hw}" height="${t}" rx="${t / 2}" fill="${col(k)}" />`;
    const vseg = (xx, yy, k) => `<rect x="${xx - t / 2}" y="${yy}" width="${t}" height="${vh}" rx="${t / 2}" fill="${col(k)}" />`;
    return (
      hseg(y0, "a") +                                 // a: top
      hseg(midY, "g") +                               // g: middle
      hseg(y0 + H, "d") +                             // d: bottom
      vseg(x0, y0 + t * 0.7, "f") +                   // f: upper-left
      vseg(x0 + W, y0 + t * 0.7, "b") +               // b: upper-right
      vseg(x0, midY + t * 0.6, "e") +                 // e: lower-left
      vseg(x0 + W, midY + t * 0.6, "c")               // c: lower-right
    );
  }

  // Shared converter geometry so the placed pin (see converterPinX) lands exactly
  // on the visible bus-stub tip, whatever the digit count.
  const CONV_GEO = { glyphW: 26, glyphH: 64, t: 5, gap: 9, padX: 12, screenPadY: 4, margin: 8, ext: 46, H: 80, half: 5.5 };
  // Half the casing width for an n-digit converter (its left/right edge from the
  // centre).
  function converterBodyEdge(n) {
    const g = CONV_GEO;
    const screenW = Math.max(1, n) * g.glyphW + (Math.max(1, n) - 1) * g.gap + g.padX * 2;
    return screenW / 2 + g.margin;
  }
  // One mechanical counter (odometer) wheel filling a cell (top-left x0,y0; size
  // W×H). The set digit sits centred in a plain serif face, with its neighbours
  // peeking above/below to suggest a wheel you rotate. The housing strips that
  // clip those neighbours are drawn once by the caller (across the whole row).
  function counterWheelGlyph(ch, x0, y0, W, H) {
    const cx = x0 + W / 2, cy = y0 + H / 2;
    const nv = /[0-9]/.test(ch) ? Number(ch) : 0;
    const up = (nv + 1) % 10, dn = (nv + 9) % 10;
    const fs = Math.round(H * 0.42), step = Math.round(H * 0.36);
    const face = "#efe9d8", edge = "#b3a47e", ink = "#2b2620";
    const dig = (v, yy, op) => `<text x="${cx}" y="${yy}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${fs}" fill="${ink}"${op < 1 ? ` opacity="${op}"` : ""}>${v}</text>`;
    return (
      `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="3" fill="${face}" stroke="${edge}" stroke-width="1" />` +
      dig(up, cy - step, 0.32) + dig(dn, cy + step, 0.32) + dig(nv, cy, 1)
    );
  }

  // The binary↔decimal converter schematic. A cream casing with one bus stub — on
  // the LEFT for bin→dec ("in") or the RIGHT for dec→bin ("out"). Centred on the
  // origin; returns inner markup (wrap in <svg> for a dialog, or a board
  // <g transform> for a placed component). The bin→dec reader shows its value on a
  // neutral-grey 7-segment screen; the dec→bin setter shows editable mechanical
  // counter wheels (plain digits) you click to rotate. Placed dec→bin converters
  // are interactive.
  function converterMarkup(dir, options = {}) {
    const digits = String(options.digits != null ? options.digits : "00000");
    const n = Math.max(1, digits.length);
    const g = CONV_GEO;
    const glyphW = g.glyphW, glyphH = g.glyphH, t = g.t, gap = g.gap, padX = g.padX, screenPadY = g.screenPadY;
    const dtot = n * glyphW + (n - 1) * gap;
    const screenW = dtot + padX * 2, screenH = glyphH + screenPadY * 2;
    const edge = converterBodyEdge(n), W = edge * 2, H = g.H, dx0 = -dtot / 2;
    const ext = g.ext, half = g.half;
    const clickable = dir === "out" && options.interactive;
    const cid = options.componentId ? esc(options.componentId) : "";
    // Cream casing.
    let s = `<rect x="${-edge}" y="${-H / 2}" width="${W}" height="${H}" rx="8" fill="#efe7d2" stroke="#2b2b2b" stroke-width="3" />`;
    if (dir === "out") {
      // Recessed housing that the wheels turn inside.
      s += `<rect x="${-screenW / 2}" y="${-screenH / 2}" width="${screenW}" height="${screenH}" rx="4" fill="#c9bd9a" stroke="#8a7c58" stroke-width="1.5" />`;
      const wheelTop = -glyphH / 2;
      for (let i = 0; i < n; i++) {
        const x0 = dx0 + i * (glyphW + gap);
        s += counterWheelGlyph(digits[i], x0, wheelTop, glyphW, glyphH);
      }
      // Housing lips (same colour as the recess) clip the neighbour digits top and
      // bottom, leaving a window that reads like an odometer slot.
      const lip = screenH * 0.27;
      s += `<rect x="${-screenW / 2}" y="${-screenH / 2}" width="${screenW}" height="${lip}" fill="#c9bd9a" />`;
      s += `<rect x="${-screenW / 2}" y="${screenH / 2 - lip}" width="${screenW}" height="${lip}" fill="#c9bd9a" />`;
      s += `<line x1="${-screenW / 2}" y1="${-screenH / 2 + lip}" x2="${screenW / 2}" y2="${-screenH / 2 + lip}" stroke="#00000026" stroke-width="1" />`;
      s += `<line x1="${-screenW / 2}" y1="${screenH / 2 - lip}" x2="${screenW / 2}" y2="${screenH / 2 - lip}" stroke="#ffffff30" stroke-width="1" />`;
      if (clickable) {
        for (let i = 0; i < n; i++) {
          const x0 = dx0 + i * (glyphW + gap);
          s += `<rect x="${x0 - gap / 2}" y="${-screenH / 2}" width="${glyphW + gap}" height="${screenH}" fill="transparent" style="cursor:pointer" data-action="converter-digit" data-component-id="${cid}" data-digit-index="${i}" />`;
        }
      }
    } else {
      // bin→dec reader: neutral-grey 7-segment digits on a dark screen.
      s += `<rect x="${-screenW / 2}" y="${-screenH / 2}" width="${screenW}" height="${screenH}" rx="4" fill="#141416" stroke="#000" stroke-width="1.5" />`;
      for (let i = 0; i < n; i++) {
        const x0 = dx0 + i * (glyphW + gap);
        s += sevenSegGlyph(digits[i], x0, -glyphH / 2, glyphW, glyphH, t);
      }
    }
    // The bus stub (thick dashed bar), left for "in", right for "out".
    const bx1 = dir === "in" ? -edge - ext : edge;
    const bx2 = dir === "in" ? -edge : edge + ext;
    s += `<rect x="${bx1}" y="${-half}" width="${bx2 - bx1}" height="${half * 2}" fill="#111" />
      <line x1="${bx1 + 3}" y1="0" x2="${bx2 - 3}" y2="0" stroke="#e9e2cf" stroke-width="2.4" stroke-dasharray="6 3" />`;
    return s;
  }

  return { componentSvgFilenameForType, componentMarkup, converterMarkup, smokeMarkup, charredNandMarkup };
}

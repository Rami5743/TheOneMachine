// Slide-SVG generator: reuses an existing panel raster and bakes a Hebrew speech
// bubble (rounded rectangle + tail) sized to the given lines. Matches the panel
// convention (viewBox 1448x1086, embedded same-basename .jpg, text baked as SVG
// <text> inside a "Text bubble" layer). Usage:
//   node tools/make-slide.js <outSvgPath> <jpgBasename> "<line1>|<line2>|..."
//
// The geometry below is taken VERBATIM from the hand-corrected reference slide
// (panel136_chapter_3_1_good_work.svg): a 621-wide bubble centred at x=774, with
// soft cubic corners and a SLIM tail on the left edge pointing left toward the
// speaker. Do not "improve" these numbers — the earlier generated bubbles were
// rejected precisely because their tail was oversized and mis-shaped.
const fs = require("fs");

const FONT = "'Noto Sans Hebrew', Arial, sans-serif";
const FS = 34;            // font size
const LH = 50.5;          // line height
const PAD_TOP = 40;       // from bubble top to the first baseline
const PAD_BOT = 30;       // from the last baseline to the bubble bottom
const TOP = 40;           // bubble top y
const CX = 774;           // text centre x
const LEFT = 463.17169;   // bubble left edge
const RIGHT = 1084;       // bubble right edge
const RX = 19.51169;      // corner: horizontal radius
const RY = 22;            // corner: vertical radius
// The tail, anchored to the TOP of the bubble so it keeps its place no matter how
// many lines the bubble holds (offsets measured off the reference slide).
const TAIL_UPPER = 61.21; // upper base point, relative to TOP
const TAIL_LOWER = 83.23; // lower base point, relative to TOP
const TAIL_DX = 45.52867; // how far the tip sticks out to the left
const TAIL_TIP = 89.92;   // tip y, relative to TOP

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function build(jpg, lines) {
  const n = lines.length;
  const bottom = TOP + PAD_TOP + (n - 1) * LH + PAD_BOT;
  const tailUpperY = TOP + TAIL_UPPER;
  const tailLowerY = TOP + TAIL_LOWER;
  const tipX = LEFT - TAIL_DX;
  const tipY = TOP + TAIL_TIP;
  const r = (v) => Number(v.toFixed(5));
  // Rounded rectangle with soft cubic corners; the left edge is interrupted by the
  // slim tail between tailLowerY and tailUpperY.
  const path =
    `M ${r(LEFT + RX)},${TOP} ` +
    `H ${r(RIGHT - RX)} ` +
    `C ${r(RIGHT - RX + 13.0078)},${TOP} ${RIGHT},${r(TOP + 7.333333)} ${RIGHT},${r(TOP + RY)} ` +
    `V ${r(bottom - RY)} ` +
    `C ${RIGHT},${r(bottom - RY + 14.66667)} ${r(RIGHT - 6.5039)},${r(bottom)} ${r(RIGHT - RX)},${r(bottom)} ` +
    `H ${r(LEFT + RX)} ` +
    `C ${r(LEFT + RX - 13.0078)},${r(bottom)} ${LEFT},${r(bottom - 7.33333)} ${LEFT},${r(bottom - RY)} ` +
    `V ${r(tailLowerY)} ` +
    `L ${r(tipX)},${r(tipY)} ` +
    `L ${LEFT},${r(tailUpperY)} ` +
    `V ${r(TOP + RY)} ` +
    `C ${LEFT},${r(TOP + RY - 14.666667)} ${r(LEFT + 6.50389)},${TOP} ${r(LEFT + RX)},${TOP} Z`;
  const tspans = lines.map((ln, i) =>
    `<tspan x="${CX}" y="${r(TOP + PAD_TOP + i * LH)}" id="tspan${i + 1}">${esc(ln)}</tspan>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" width="1448" height="1086" viewBox="0 0 1448 1086"
   preserveAspectRatio="xMidYMid meet"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg">
  <image id="raster-base" x="0" y="0" width="1448" height="1086"
     preserveAspectRatio="none" href="${jpg}" xlink:href="${jpg}" />
  <g id="text-bubble-layer" inkscape:groupmode="layer" inkscape:label="Text bubble">
    <path id="speech-bubble" d="${path}" fill="#ffffff" stroke="#000000"
       stroke-width="3.44993" stroke-linejoin="round" stroke-linecap="round" />
    <text id="bubble-text" text-anchor="middle" direction="rtl" unicode-bidi="plaintext"
       font-family="${FONT}" font-size="${FS}px" font-weight="400" fill="#000000"
       stroke="none" xml:space="preserve">${tspans}</text>
  </g>
</svg>
`;
}

const [outPath, jpg, linesArg] = process.argv.slice(2);
if (!outPath || !jpg || !linesArg) {
  console.error('usage: node tools/make-slide.js <out.svg> <raster.jpg> "l1|l2|..."');
  process.exit(1);
}
const lines = linesArg.split("|");
fs.writeFileSync(outPath, build(jpg, lines));
console.log("wrote", outPath, "(" + lines.length + " lines)");

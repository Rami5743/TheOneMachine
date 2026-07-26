// Slide-SVG generator: reuses an existing panel raster and bakes a Hebrew speech
// bubble (rounded rectangle + tail) sized to the given lines. Matches the panel
// convention (viewBox 1448x1086, embedded same-basename .jpg, text baked as SVG
// <text> inside a "Text bubble" layer). Usage:
//   node tools/make-slide.js <outSvgPath> <jpgBasename> "<line1>|<line2>|..."
// The bubble sits upper-centre with a tail pointing down-left (toward a speaker
// at lower-left, matching panel118c/panel128).
const fs = require("fs");

const FONT = "'Noto Sans Hebrew', Arial, sans-serif";
const FS = 34;            // font size
const LH = 50.5;          // line height
const PAD_X = 46;         // horizontal padding inside the bubble
const PAD_TOP = 40;       // from bubble top to first baseline
const PAD_BOT = 30;       // from last baseline to bubble bottom
const CX = 820;           // bubble centre x
const BW = 700;           // bubble width
const R = 22;             // corner radius
const TOP = 40;           // bubble top y

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function build(jpg, lines) {
  const n = lines.length;
  const bottom = TOP + PAD_TOP + (n - 1) * LH + PAD_BOT;
  const left = CX - BW / 2, right = CX + BW / 2;
  // Rounded-rectangle body with a triangular tail on the lower-left edge,
  // pointing down-left toward the speaker.
  const tailTopY = Math.min(bottom - R, TOP + PAD_TOP + (n - 1) * LH + 8);
  const tailBotY = Math.min(tailTopY + 64, bottom - 6);
  const tailTipX = left - 78, tailTipY = tailBotY + 40;
  const path =
    `M ${left + R},${TOP} ` +
    `H ${right - R} Q ${right},${TOP} ${right},${TOP + R} ` +
    `V ${bottom - R} Q ${right},${bottom} ${right - R},${bottom} ` +
    `H ${left + R} Q ${left},${bottom} ${left},${bottom - R} ` +
    `V ${tailBotY} L ${tailTipX},${tailTipY} L ${left},${tailTopY} ` +
    `V ${TOP + R} Q ${left},${TOP} ${left + R},${TOP} Z`;
  const tspans = lines.map((ln, i) =>
    `<tspan x="${CX}" y="${TOP + PAD_TOP + i * LH}" id="tspan${i + 1}">${esc(ln)}</tspan>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg version="1.1" width="1448" height="1086" viewBox="0 0 1448 1086"
   preserveAspectRatio="xMidYMid meet"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
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

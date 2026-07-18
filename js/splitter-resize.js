// splitter-resize.js — the splitter's "drag to set the leg count" handle.
//
// A cross-cutting UI helper kept in its OWN file (loaded before app.js) so it
// adds as little churn as possible to app.js. The splitter used to expose an
// HTML number box for its output (leg) count; this replaces that with a grab
// handle drawn under the splitter while it is focused — dragging the handle
// vertically adds or removes legs.
//
// This module owns the pure pieces: the handle's SVG markup and the mapping
// from a vertical drag distance to a leg count. app.js owns the shared drag
// state and wires the pointer lifecycle to these helpers.
//
// createSplitterResize(deps) -> { HANDLE_ACTION, STEP, clampOutputs,
//                                 outputsForDrag, handleBottomOffset,
//                                 resizeHandleMarkup }
//   deps: SPLITTER_OUTPUT_SPACING - vertical gap between legs (board px)
//         esc                     - HTML/attribute escaper
//         minOutputs, maxOutputs  - leg-count limits (default 2..16)

function createSplitterResize({ SPLITTER_OUTPUT_SPACING, esc, minOutputs = 2, maxOutputs = 16 }) {
  const HANDLE_ACTION = "splitter-resize";

  // One leg step = half a leg-gap of vertical travel. Adding a leg grows the
  // splitter's half-height by exactly this much, so the handle stays under the
  // pointer as legs appear/disappear (the drag feels "connected").
  const STEP = SPLITTER_OUTPUT_SPACING / 2;

  // The handle sits this far below the splitter's bottom edge (centre + halfH).
  const handleBottomOffset = 30;

  function clampOutputs(n) {
    return Math.min(maxOutputs, Math.max(minOutputs, Math.round(n)));
  }

  // Given the leg count at drag start and how far (board px) the pointer has
  // moved since (down = positive), return the new clamped leg count.
  function outputsForDrag(startOutputs, dy) {
    return clampOutputs(startOutputs + dy / STEP);
  }

  // SVG markup for the handle, in board coordinates. `count` is the live leg
  // count shown inside the pill so the learner sees the value while dragging.
  function resizeHandleMarkup(id, cx, cy, halfH, count) {
    const y = cy + halfH + handleBottomOffset;
    return `
      <g class="splitter-resize-handle" data-action="${HANDLE_ACTION}" data-component-id="${esc(id)}"
         role="button" tabindex="0" aria-label="גרור מעלה או מטה כדי לשנות את מספר הפינים של המפצל"
         transform="translate(${cx} ${y})">
        <rect class="splitter-resize-bg" x="-27" y="-15" width="54" height="30" rx="15" />
        <g class="splitter-resize-glyph" transform="translate(-14 0)">
          <polyline points="-5,-3 0,-8 5,-3" />
          <polyline points="-5,3 0,8 5,3" />
        </g>
        <text class="splitter-resize-count" x="9" y="1">${count}</text>
      </g>`;
  }

  return { HANDLE_ACTION, STEP, clampOutputs, outputsForDrag, handleBottomOffset, resizeHandleMarkup };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createSplitterResize };
}

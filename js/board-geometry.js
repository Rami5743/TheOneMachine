// board-geometry.js — where things sit on the workbench board, extracted from
// app.js. terminalPosition returns the board coordinates of a pin (optionally
// with a dragged-component override); clampComponentPosition keeps a component
// inside the board bounds. Both are used by rendering (wire/terminal geometry)
// and by the drag/interaction layer.
//
// Loaded BEFORE app.js. Dependencies are INJECTED via createBoardGeometry(...):
//   pinDefFor          - (workspace, ref) -> { component, pin, pinId } | null
//   componentDef       - type -> definition (for bounds)
//   workspaceBoardSize - () -> { width, height, measured } (reads the DOM; stays
//                        in app.js). measured:false = the size is a fallback
//                        guess, so nothing may be clamped against it.
//
// createBoardGeometry(deps) -> { terminalPosition, clampComponentPosition }

function createBoardGeometry({ pinDefFor, componentDef, workspaceBoardSize, componentRenderScale }) {
  const renderScale = (type) => (componentRenderScale ? componentRenderScale(type) : 1);
  // The tallest authored content (tall-card solutions, check harness lamps)
  // reaches roughly y≈720; this virtual floor keeps such content placeable even
  // when the real board viewport is shorter (the board scrolls to reveal it).
  const CLAMP_MIN_BOARD_HEIGHT = 900;
  // Same idea on X now that the board scrolls sideways too: the widest authored
  // content (a 4.4 frame's outer pins at x≈1080, a check's lamps beyond that)
  // must stay placeable on a narrow window instead of being dragged inward.
  const CLAMP_MIN_BOARD_WIDTH = 1280;

  function terminalPosition(workspace, ref, overrides = null) {
    const info = pinDefFor(workspace, ref);
    if (!info) return null;
    const override = overrides?.[info.component.id];
    const x = override?.x ?? info.component.x;
    const y = override?.y ?? info.component.y;
    // A per-instance scale (used for the small bus-check lamps) overrides the
    // per-type render scale.
    const scale = Number.isFinite(info.component.scale) ? info.component.scale : renderScale(info.component.type);
    return { x: x + info.pin.x * scale, y: y + info.pin.y * scale };
  }

  function clampComponentPosition(type, x, y) {
    // The task-card frame (taskCard-<id>) is placed PROGRAMMATICALLY at a
    // deliberate, valid spot (aluBuildCardY during a build, the same position in
    // the solution walkthrough) and is never dragged by the learner. It must
    // therefore render at EXACTLY that Y everywhere. Clamping it is not only
    // pointless but actively harmful: normalizeWorkspace runs during boot
    // (loadState) and on every save, and at those moments the board DOM may not
    // be laid out yet, so workspaceBoardSize() returns its small fallback
    // (height 600). With that fallback, a tall card (ALU2/ALU3/ALU4, whose frame
    // reaches far below its centre) gets clamped UP — moving the frame to a
    // different height than the un-clamped copy shown once the real board exists.
    // That mismatch is the "the card suddenly sits higher in the solution than
    // during the build" bug. Frames are authored valid, so never clamp them.
    if (typeof type === "string" && type.startsWith("taskCard-")) {
      return { x, y };
    }
    const size = workspaceBoardSize();
    // Same trap as the frame above, on the X axis: when the board is not on
    // screen yet (a solution/task workspace built from a STORY screen, or
    // normalizeWorkspace running at boot/save time) workspaceBoardSize() returns
    // its fallback guess of width 1000. Clamping against that guess MOVES
    // authored components that sit further right — and once the real board
    // exists the next rebuild puts them back, so the first walkthrough step
    // showed a component in a different place than every following step. A size
    // we did not measure is no reason to move anything.
    if (size.measured === false) return { x, y };
    const bounds = componentDef(type)?.bounds || { left: 8, right: 8, top: 8, bottom: 8 };
    // The board scrolls on BOTH axes, so a component may legitimately sit below
    // the visible viewport (a check's harness lamps, a tall card's solution) or
    // past its right edge. Clamp against generous virtual bounds rather than the
    // real (possibly short/narrow, or boot-time fallback) viewport, so content
    // out there is never pulled back in out of place.
    const heightForClamp = Math.max(size.height, CLAMP_MIN_BOARD_HEIGHT);
    const widthForClamp = Math.max(size.width, CLAMP_MIN_BOARD_WIDTH);
    const minX = Math.min(bounds.left, widthForClamp - bounds.right);
    const maxX = Math.max(bounds.left, widthForClamp - bounds.right);
    const minY = Math.min(bounds.top, heightForClamp - bounds.bottom);
    const maxY = Math.max(bounds.top, heightForClamp - bounds.bottom);

    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y))
    };
  }

  return { terminalPosition, clampComponentPosition };
}

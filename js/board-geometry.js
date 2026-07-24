// board-geometry.js — where things sit on the workbench board, extracted from
// app.js. terminalPosition returns the board coordinates of a pin (optionally
// with a dragged-component override); clampComponentPosition keeps a component
// inside the board bounds. Both are used by rendering (wire/terminal geometry)
// and by the drag/interaction layer.
//
// Loaded BEFORE app.js. Dependencies are INJECTED via createBoardGeometry(...):
//   pinDefFor          - (workspace, ref) -> { component, pin, pinId } | null
//   componentDef       - type -> definition (for bounds)
//   workspaceBoardSize - () -> { width, height } (reads the DOM; stays in app.js)
//
// createBoardGeometry(deps) -> { terminalPosition, clampComponentPosition }

function createBoardGeometry({ pinDefFor, componentDef, workspaceBoardSize, componentRenderScale }) {
  const renderScale = (type) => (componentRenderScale ? componentRenderScale(type) : 1);

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
    const bounds = componentDef(type)?.bounds || { left: 8, right: 8, top: 8, bottom: 8 };
    const minX = Math.min(bounds.left, size.width - bounds.right);
    const maxX = Math.max(bounds.left, size.width - bounds.right);
    const minY = Math.min(bounds.top, size.height - bounds.bottom);
    const maxY = Math.max(bounds.top, size.height - bounds.bottom);

    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y))
    };
  }

  return { terminalPosition, clampComponentPosition };
}

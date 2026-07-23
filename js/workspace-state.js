// workspace-state.js — workbench state normalization, extracted from app.js.
//
// normalizeWorkspace takes any (possibly stale or hand-edited) workspace object
// and returns a clean, valid workspace: components with unique ids and clamped
// positions, a de-duplicated set of legal wires, and every flag coerced to a
// safe type. normalizeComponent validates a single component.
//
// Loaded BEFORE app.js. Like the circuit engine and the workbench model, it
// touches neither the DOM nor app state: everything it needs is INJECTED via
// createWorkspaceState(...). The two trivial factories createDefaultWorkspace
// and cloneDefaultComponents stay in app.js (they run while app.js builds its
// defaultState, before this model is created) and are injected here.
//
// createWorkspaceState(deps) -> { normalizeWorkspace, normalizeComponent }
//   deps: componentDef, clampComponentPosition, migrateTerminalRef,
//         canonicalTaskFrameWire, wireKey, componentById, terminalExists,
//         canAddWire, normalizeWire, createDefaultWorkspace, cloneDefaultComponents

function createWorkspaceState({
  componentDef,
  clampComponentPosition,
  migrateTerminalRef,
  canonicalTaskFrameWire,
  wireKey,
  componentById,
  terminalExists,
  canAddWire,
  normalizeWire,
  createDefaultWorkspace,
  cloneDefaultComponents
}) {
  function normalizeComponent(component, usedIds, index) {
    const type = componentDef(component?.type) ? component.type : null;
    if (!type) return null;

    let id = String(component.id || `${type}-${index + 1}`).replace(/[^\w-]/g, "-");
    if (!id || usedIds.has(id)) id = `${type}-${index + 1}`;
    while (usedIds.has(id)) id = `${id}-1`;
    usedIds.add(id);

    const x = Number.isFinite(component.x) ? component.x : 500;
    const y = Number.isFinite(component.y) ? component.y : 300;
    const clamped = clampComponentPosition(type, x, y);
    const base = { id, type, x: clamped.x, y: clamped.y };
    // A per-instance render scale (the small bus-check lamps carry one).
    if (Number.isFinite(component.scale) && component.scale > 0) base.scale = component.scale;
    // The splitter carries per-instance state: how many outputs it has (default
    // 4) and whether it is mirrored around the y-axis.
    if (type === "splitter") {
      base.outputs = Number.isInteger(component.outputs) ? Math.min(16, Math.max(2, component.outputs)) : 4;
      base.mirrored = Boolean(component.mirrored);
      const n = base.outputs;
      const clampW = (w) => (Number.isInteger(w) && w >= 1 ? w : null);
      // Per-leg widths: legWidths[i] is leg i's bus width (null = not yet fixed by
      // wiring / inference); singleWidth is the merged side. Legs need NOT be
      // equal. Legacy data used a single scalar `width` meaning every leg had that
      // width and the single side was width*outputs — migrate it here.
      let legWidths = Array.isArray(component.legWidths) ? component.legWidths.slice(0, n).map(clampW) : null;
      let singleWidth = clampW(component.singleWidth);
      if (!legWidths) {
        const legacy = clampW(component.width);
        legWidths = Array.from({ length: n }, () => legacy);
        if (singleWidth === null && legacy !== null) singleWidth = legacy * n;
      }
      while (legWidths.length < n) legWidths.push(null);
      base.legWidths = legWidths;
      base.singleWidth = singleWidth;
    }
    // A dec→bin converter carries the decimal value it emits (persisted so a
    // player's set number survives reloads); both converters carry the fixed bus
    // width once a connection has determined it (null = still undetermined).
    if (type === "converter-out") {
      base.value = Math.max(0, Math.floor(Number(component.value) || 0));
    }
    if (type === "converter-in" || type === "converter-out") {
      if (Number.isInteger(component.width) && component.width >= 1) base.width = component.width;
    }
    return base;
  }

  function normalizeWorkspace(workspace) {
    const fallback = createDefaultWorkspace();
    const ws = workspace && typeof workspace === "object" ? workspace : fallback;

    const usedIds = new Set();
    const sourceComponents = Array.isArray(ws.components) && ws.components.length ? ws.components : cloneDefaultComponents();
    const components = sourceComponents
      .map((component, index) => normalizeComponent(component, usedIds, index))
      .filter(Boolean);

    if (!components.length) components.push(...cloneDefaultComponents());

    const observed = ws.nandOutputObserved && typeof ws.nandOutputObserved === "object"
      ? ws.nandOutputObserved
      : {};

    const normalized = {
      selectedTerminal: null,
      components,
      wires: [],
      nextId: Number.isInteger(ws.nextId) && ws.nextId > 1 ? ws.nextId : 2,
      unlocked: Boolean(ws.unlocked),
      accident: null,
      helpPromptSeen: Boolean(ws.helpPromptSeen),
      buildHelpButtonVisible: Boolean(ws.buildHelpButtonVisible),
      nandOutputObserved: {
        zero: Boolean(observed.zero),
        one: Boolean(observed.one)
      },
      understoodPromptShown: Boolean(ws.understoodPromptShown),
      understoodButtonVisible: Boolean(ws.understoodButtonVisible),
      nandMonologueStep: Number.isInteger(ws.nandMonologueStep) ? ws.nandMonologueStep : null,
      workspaceLaunchPanelIndex: Number.isInteger(ws.workspaceLaunchPanelIndex) ? ws.workspaceLaunchPanelIndex : null,
      workspaceCompleted: Boolean(ws.workspaceCompleted),
      workspaceSession: Number.isInteger(ws.workspaceSession) ? Math.max(0, ws.workspaceSession) : 0,
      exitTargetPanelIndex: Number.isInteger(ws.exitTargetPanelIndex) ? ws.exitTargetPanelIndex : null,
      returnToWorkspaceAfterMonologue: Boolean(ws.returnToWorkspaceAfterMonologue),
      sessionReturnChapterId: typeof ws.sessionReturnChapterId === "string" ? ws.sessionReturnChapterId : null,
      sessionReturnPanelIndex: Number.isInteger(ws.sessionReturnPanelIndex) ? ws.sessionReturnPanelIndex : null,
      taskId: typeof ws.taskId === "string" ? ws.taskId : null,
      taskIntroSeen: Boolean(ws.taskIntroSeen),
      // The "empty table" free-build workbench flag. Preserved here so the mode
      // survives load/save (this normalizer runs on both) and stays
      // distinguishable from the Nand-presentation workbench.
      freeBuild: Boolean(ws.freeBuild),
      // The component (currently only a splitter) that shows its focus controls
      // — the mirror handle. Validated below against the live components.
      focusedComponentId: typeof ws.focusedComponentId === "string" ? ws.focusedComponentId : null
    };

    if (!components.some((component) => component.id === normalized.focusedComponentId)) {
      normalized.focusedComponentId = null;
    }

    const maxNumericSuffix = components.reduce((max, component) => {
      const match = component.id.match(/-(\d+)$/);
      return match ? Math.max(max, Number(match[1]) + 1) : max;
    }, 2);
    normalized.nextId = Math.max(normalized.nextId, maxNumericSuffix);

    if (terminalExists(normalized, ws.selectedTerminal)) {
      normalized.selectedTerminal = ws.selectedTerminal;
    }

    const wires = Array.isArray(ws.wires) ? ws.wires : [];
    const seen = new Set();

    for (const wire of wires) {
      if (!wire) continue;
      const migratedA = migrateTerminalRef(wire.a);
      const migratedB = migrateTerminalRef(wire.b);
      const [a, b] = canonicalTaskFrameWire(normalized, migratedA, migratedB);
      if (!terminalExists(normalized, a) || !terminalExists(normalized, b) || a === b) continue;
      const key = wireKey(a, b);
      if (seen.has(key)) continue;
      if (!canAddWire(normalized, a, b, normalized.wires, false)) continue;
      normalized.wires.push(normalizeWire(a, b));
      seen.add(key);
    }

    if (
      ws.accident?.type === "nand-overvoltage" &&
      componentById(normalized, ws.accident.nandId)?.type === "nand"
    ) {
      normalized.accident = { type: "nand-overvoltage", nandId: ws.accident.nandId };
    }

    return normalized;
  }

  return { normalizeWorkspace, normalizeComponent };
}

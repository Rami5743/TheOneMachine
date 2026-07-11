// wire-ops.js — pure operations on the set of wires in a workspace, extracted
// from app.js. They mutate (or read) the workspace data model directly and hold
// no DOM or app-state; the app.js plumbing (withWorkspace / setState / drag)
// calls them. Covered here: reachability, pruning wires to valid components,
// removing wires at a terminal, adding a test wire, and the click-to-toggle wire
// rule used when a user connects two terminals.
//
// Loaded BEFORE app.js. createWireOps(deps) -> { connectedTerminals,
//   removeInvalidWires, removeWiresAt, addTestWire, applyWireToggle }
//   deps: otherWireEnd, splitTerminalRef, terminalExists, inputRefOf, wireKey,
//         normalizeWire, canonicalTaskFrameWire, canAddWire, dangerousPowerWireInfo

function createWireOps({
  otherWireEnd,
  splitTerminalRef,
  terminalExists,
  inputRefOf,
  wireKey,
  normalizeWire,
  canonicalTaskFrameWire,
  canAddWire,
  dangerousPowerWireInfo
}) {
  function connectedTerminals(workspace, ref) {
    const result = new Set([ref]);
    const queue = [ref];

    while (queue.length) {
      const current = queue.shift();
      for (const wire of workspace.wires) {
        const next = otherWireEnd(wire, current);
        if (!next || result.has(next)) continue;
        result.add(next);
        queue.push(next);
      }
    }

    return result;
  }

  function removeInvalidWires(workspace) {
    const componentIds = new Set(workspace.components.map((component) => component.id));
    workspace.wires = workspace.wires.filter((wire) => {
      const a = splitTerminalRef(wire.a);
      const b = splitTerminalRef(wire.b);
      return a && b && componentIds.has(a.componentId) && componentIds.has(b.componentId);
    });
  }

  function removeWiresAt(workspace, ref) {
    workspace.wires = workspace.wires.filter((wire) => wire.a !== ref && wire.b !== ref);
  }

  function addTestWire(workspace, a, b) {
    if (!terminalExists(workspace, a) || !terminalExists(workspace, b) || a === b) return;
    const inputRef = inputRefOf(workspace, a, b);
    if (inputRef) removeWiresAt(workspace, inputRef);
    const key = wireKey(a, b);
    if (!workspace.wires.some((wire) => wireKey(wire.a, wire.b) === key)) {
      workspace.wires.push(normalizeWire(a, b));
    }
  }

  // The click-to-connect rule: toggling a wire between terminals a and b.
  // Removes it if present; otherwise adds it (subject to canAddWire), replacing
  // any existing wire on the input end unless the new wire is a dangerous short.
  function applyWireToggle(workspace, a, b) {
    const [wireA, wireB] = canonicalTaskFrameWire(workspace, a, b);
    const key = wireKey(wireA, wireB);
    const existing = workspace.wires.some((wire) => wireKey(wire.a, wire.b) === key);
    if (existing) {
      workspace.wires = workspace.wires.filter((wire) => wireKey(wire.a, wire.b) !== key);
      workspace.selectedTerminal = null;
      return;
    }

    if (!canAddWire(workspace, wireA, wireB, workspace.wires, true)) {
      workspace.selectedTerminal = null;
      return;
    }

    const dangerous = dangerousPowerWireInfo(workspace, wireA, wireB);
    const inputRef = inputRefOf(workspace, wireA, wireB);
    if (inputRef && !dangerous) {
      workspace.wires = workspace.wires.filter((wire) => !otherWireEnd(wire, inputRef));
    }
    workspace.wires.push(normalizeWire(wireA, wireB));
    workspace.selectedTerminal = null;
  }

  return { connectedTerminals, removeInvalidWires, removeWiresAt, addTestWire, applyWireToggle };
}

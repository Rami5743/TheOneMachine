// workbench-model.js — the wiring rules of the workbench, extracted from app.js.
//
// These functions decide whether two terminals may be connected, which end is
// the input and which is the output, and whether a connection is a dangerous
// short between two outputs. They operate purely on the workspace data model.
//
// Loaded BEFORE app.js. Like the circuit engine, it depends on nothing from the
// DOM or app state: everything it needs about the component/pin model is
// INJECTED via createWorkbenchModel(...). It also uses the pure global
// otherWireEnd from circuit-engine.js.
//
// createWorkbenchModel(deps) -> { canAddWire, inputRefOf, outputRefOf, dangerousPowerWireInfo }
//   deps: terminalDirection, terminalExists, splitTerminalRef, componentById,
//         componentGraphHasPath, normalizeWire, isNandOutputRef

function createWorkbenchModel({
  terminalDirection,
  terminalExists,
  splitTerminalRef,
  componentById,
  componentGraphHasPath,
  normalizeWire,
  isNandOutputRef
}) {
  function inputRefOf(workspace, a, b) {
    const da = terminalDirection(workspace, a);
    const db = terminalDirection(workspace, b);
    if (da === "in" && db === "out") return a;
    if (db === "in" && da === "out") return b;
    return null;
  }

  function outputRefOf(workspace, a, b) {
    const da = terminalDirection(workspace, a);
    const db = terminalDirection(workspace, b);
    if (da === "out" && db === "in") return a;
    if (db === "out" && da === "in") return b;
    return null;
  }

  function dangerousPowerWireInfo(workspace, a, b) {
    const aDirection = terminalDirection(workspace, a);
    const bDirection = terminalDirection(workspace, b);
    if (aDirection !== "out" || bDirection !== "out") return null;

    const aNandOutput = isNandOutputRef(workspace, a);
    const bNandOutput = isNandOutputRef(workspace, b);
    if (!aNandOutput && !bNandOutput) return null;

    return {
      outputA: a,
      outputB: b,
      nandId: aNandOutput ? splitTerminalRef(a).componentId : splitTerminalRef(b).componentId
    };
  }

  // The NAND-presentation workbench is the only workbench variant that lets the
  // learner short two outputs together and burn the NAND (the teaching moment).
  // The task-card build and the free "empty table" both forbid it, so no output
  // (voltage source included) can ever be wired into another output there.
  function isNandPresentationWorkspace(workspace) {
    return !workspace?.taskId && !workspace?.freeBuild;
  }

  function canAddWire(workspace, a, b, wires = workspace.wires, enforceInputVacancy = true) {
    if (!terminalExists(workspace, a) || !terminalExists(workspace, b) || a === b) return false;

    const dangerous = dangerousPowerWireInfo(workspace, a, b);
    if (dangerous) return isNandPresentationWorkspace(workspace);

    const inputRef = inputRefOf(workspace, a, b);
    const outputRef = outputRefOf(workspace, a, b);
    if (!inputRef || !outputRef) return false;

    const inputInfo = splitTerminalRef(inputRef);
    const outputInfo = splitTerminalRef(outputRef);
    if (!inputInfo || !outputInfo || inputInfo.componentId === outputInfo.componentId) return false;

    if (enforceInputVacancy && wires.some((wire) => otherWireEnd(wire, inputRef))) return false;

    const inputComponent = componentById(workspace, inputInfo.componentId);
    const outputComponent = componentById(workspace, outputInfo.componentId);
    const touchesTaskFrame = (component) => component?.type === "notCard" || String(component?.type || "").startsWith("taskCard-");
    if (touchesTaskFrame(inputComponent) || touchesTaskFrame(outputComponent)) return true;

    const candidateWires = [...wires, normalizeWire(a, b)];
    return !componentGraphHasPath(workspace, candidateWires, inputInfo.componentId, outputInfo.componentId);
  }

  return { canAddWire, inputRefOf, outputRefOf, dangerousPowerWireInfo };
}

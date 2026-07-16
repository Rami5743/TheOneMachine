// accident-observation.js — the two safety/learning signals derived from a live
// workbench, extracted from app.js. detectWorkspaceAccident spots a Nand whose
// two inputs AND its output are all driven high by external outputs (a short
// that "burns" it). updateNandOutputObservation watches lamps wired to Nand
// outputs and records whether the learner has seen both a 0 and a 1, flipping
// the "understood" prompt once both are observed. Pure: all host helpers are
// INJECTED; updateNandOutputObservation mutates the workspace it is given.
//
// Loaded BEFORE app.js. createAccidentObservation(deps) ->
//   { detectWorkspaceAccident, updateNandOutputObservation }
//   deps: evaluateWorkspace, connectedTerminals, terminalDirection, otherWireEnd,
//         isNandOutputRef

function createAccidentObservation({
  evaluateWorkspace,
  connectedTerminals,
  terminalDirection,
  otherWireEnd,
  isNandOutputRef
}) {
  function terminalPoweredByExternalHighOutput(workspace, ref, outputs) {
    const connected = connectedTerminals(workspace, ref);
    for (const candidate of connected) {
      if (candidate === ref) continue;
      if (terminalDirection(workspace, candidate) === "out" && outputs.get(candidate) === true) {
        return true;
      }
    }
    return false;
  }

  function detectWorkspaceAccident(workspace) {
    const evaluation = evaluateWorkspace(workspace);

    for (const component of workspace.components) {
      if (component.type !== "nand") continue;
      const in1 = `${component.id}.in1`;
      const in2 = `${component.id}.in2`;
      const out = `${component.id}.out`;
      if (
        terminalPoweredByExternalHighOutput(workspace, in1, evaluation.outputs) &&
        terminalPoweredByExternalHighOutput(workspace, in2, evaluation.outputs) &&
        terminalPoweredByExternalHighOutput(workspace, out, evaluation.outputs)
      ) {
        return { type: "nand-overvoltage", nandId: component.id };
      }
    }
    return null;
  }

  function lampConnectedToNandOutputValue(workspace, evaluation, lampComponent) {
    const lampInput = `${lampComponent.id}.in`;
    return workspace.wires
      .map((wire) => otherWireEnd(wire, lampInput))
      .filter((ref) => ref && isNandOutputRef(workspace, ref))
      .map((ref) => evaluation.outputs.get(ref))
      .find((value) => value === true || value === false);
  }

  function updateNandOutputObservation(workspace) {
    if (workspace.taskId || workspace.accident || workspace.understoodPromptShown || workspace.understoodButtonVisible || Number.isInteger(workspace.nandMonologueStep)) {
      return;
    }

    const evaluation = evaluateWorkspace(workspace);
    const observed = {
      zero: Boolean(workspace.nandOutputObserved?.zero),
      one: Boolean(workspace.nandOutputObserved?.one)
    };

    for (const component of workspace.components) {
      if (component.type !== "lamp") continue;
      const value = lampConnectedToNandOutputValue(workspace, evaluation, component);
      if (value === true) observed.one = true;
      if (value === false) observed.zero = true;
    }

    workspace.nandOutputObserved = observed;
    if (observed.zero && observed.one) {
      workspace.understoodPromptShown = true;
      workspace.selectedTerminal = null;
    }
  }

  return { detectWorkspaceAccident, updateNandOutputObservation };
}

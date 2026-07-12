// circuit-engine.js — pure circuit-simulation core, extracted from app.js.
//
// Loaded BEFORE app.js. It has no dependency on the DOM, on app state, or on
// any app.js internal: the two things it needs (how to read a terminal's
// direction, and how to look up a task definition) are INJECTED by app.js via
// createCircuitEngine(...). This keeps the simulation logic isolated and
// unit-testable on its own, while app.js keeps owning the component/pin model.
//
// Public surface:
//   - taskOutput(taskId, inputs)            (pure global)
//   - otherWireEnd(wire, ref)               (pure global)
//   - createCircuitEngine({ terminalDirection, taskDefById })
//         -> { connectedOutputRefs, inputSignal, evaluateWorkspace }

// Truth function for a gate/task id. Pure.
function taskOutput(taskId, inputs) {
  if (taskId === "Not") return !inputs[0];
  if (taskId === "And") return Boolean(inputs[0] && inputs[1]);
  if (taskId === "Or") return Boolean(inputs[0] || inputs[1]);
  if (taskId === "Xor") return Boolean(Boolean(inputs[0]) !== Boolean(inputs[1]));
  if (taskId === "AND3way") return inputs.slice(0, 3).every(Boolean);
  if (taskId === "OR4way") return inputs.slice(0, 4).some(Boolean);
  return false;
}

// Given a wire and one of its endpoints, return the other endpoint. Pure.
function otherWireEnd(wire, ref) {
  if (wire.a === ref) return wire.b;
  if (wire.b === ref) return wire.a;
  return null;
}

// Build the evaluation engine. terminalDirection(workspace, ref) and
// taskDefById(taskId) are supplied by the host (app.js).
function createCircuitEngine({ terminalDirection, taskDefById }) {
  function connectedOutputRefs(workspace, inputRef, outputs) {
    return workspace.wires
      .map((wire) => otherWireEnd(wire, inputRef))
      .filter((ref) => ref && terminalDirection(workspace, ref) === "out" && outputs.has(ref));
  }

  function inputSignal(workspace, inputRef, outputs) {
    return connectedOutputRefs(workspace, inputRef, outputs).some((ref) => outputs.get(ref) === true);
  }

  function evaluateWorkspace(workspace) {
    const outputs = new Map();

    for (const component of workspace.components) {
      if (component.type === "source") outputs.set(`${component.id}.out`, true);
    }

    for (let i = 0; i < workspace.components.length + 2; i += 1) {
      let changed = false;

      for (const component of workspace.components) {
        if (component.type === "nand") {
          const a = inputSignal(workspace, `${component.id}.in1`, outputs);
          const b = inputSignal(workspace, `${component.id}.in2`, outputs);
          const value = !(a && b);
          const ref = `${component.id}.out`;
          if (outputs.get(ref) !== value) {
            outputs.set(ref, value);
            changed = true;
          }
        }

        if (component.type.startsWith("gate-")) {
          const task = taskDefById(component.type.slice(5));
          if (task) {
            const inputs = Array.from({ length: task.inputs }, (_, index) => inputSignal(workspace, `${component.id}.in${index + 1}`, outputs));
            const value = taskOutput(task.id, inputs);
            const ref = `${component.id}.out`;
            if (outputs.get(ref) !== value) {
              outputs.set(ref, value);
              changed = true;
            }
          }
        }

        if (component.type.startsWith("taskCard-")) {
          const task = taskDefById(component.type.slice("taskCard-".length));
          if (task) {
            for (let index = 0; index < task.inputs; index += 1) {
              const inputValue = inputSignal(workspace, `${component.id}.inputExt${index + 1}`, outputs);
              const inputRef = `${component.id}.inputInt${index + 1}`;
              if (outputs.get(inputRef) !== inputValue) {
                outputs.set(inputRef, inputValue);
                changed = true;
              }
            }

            // A card may have one output (outputInt/outputExt) or several,
            // numbered outputInt{k}/outputExt{k} (e.g. the DMUX's two outputs).
            const outputCount = task.outputs || 1;
            if (outputCount > 1) {
              for (let k = 1; k <= outputCount; k += 1) {
                const outputValue = inputSignal(workspace, `${component.id}.outputInt${k}`, outputs);
                const outputRef = `${component.id}.outputExt${k}`;
                if (outputs.get(outputRef) !== outputValue) {
                  outputs.set(outputRef, outputValue);
                  changed = true;
                }
              }
            } else {
              const outputValue = inputSignal(workspace, `${component.id}.outputInt`, outputs);
              const outputRef = `${component.id}.outputExt`;
              if (outputs.get(outputRef) !== outputValue) {
                outputs.set(outputRef, outputValue);
                changed = true;
              }
            }
          }
        }
      }

      if (!changed) break;
    }

    const lamps = new Map();
    for (const component of workspace.components) {
      if (component.type === "lamp") {
        lamps.set(component.id, inputSignal(workspace, `${component.id}.in`, outputs));
      }
    }

    return { outputs, lamps };
  }

  return { connectedOutputRefs, inputSignal, evaluateWorkspace };
}

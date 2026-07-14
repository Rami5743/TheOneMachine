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

// Truth function for a single-output gate/task id. Pure.
// (inputs for MUX are [input1, input2, control].)
function taskOutput(taskId, inputs) {
  if (taskId === "Not") return !inputs[0];
  if (taskId === "And") return Boolean(inputs[0] && inputs[1]);
  if (taskId === "Or") return Boolean(inputs[0] || inputs[1]);
  if (taskId === "Xor") return Boolean(Boolean(inputs[0]) !== Boolean(inputs[1]));
  if (taskId === "AND3way") return inputs.slice(0, 3).every(Boolean);
  if (taskId === "OR4way") return inputs.slice(0, 4).some(Boolean);
  if (taskId === "Mux") return inputs[2] ? Boolean(inputs[1]) : Boolean(inputs[0]);
  return false;
}

// Truth function for a multi-output gate, returning an array of outputs.
// (DMUX inputs are [data, control]; outputs are [out1, out2].)
function taskOutputs(taskId, inputs) {
  if (taskId === "DMux") return [Boolean(inputs[0] && !inputs[1]), Boolean(inputs[0] && inputs[1])];
  return [taskOutput(taskId, inputs)];
}

// Given a wire and one of its endpoints, return the other endpoint. Pure.
function otherWireEnd(wire, ref) {
  if (wire.a === ref) return wire.b;
  if (wire.b === ref) return wire.a;
  return null;
}

// Build the evaluation engine. terminalDirection(workspace, ref) and
// taskDefById(taskId) are supplied by the host (app.js).
function createCircuitEngine({ terminalDirection, taskDefById, pinWidth, splitterOutputCount, resolvePins, busGateSpec }) {
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
            const outCount = task.outputs || 1;
            if (outCount > 1) {
              // Multi-output gate (the DMUX): out1/out2/…
              const values = taskOutputs(task.id, inputs);
              for (let k = 0; k < outCount; k += 1) {
                const ref = `${component.id}.out${k + 1}`;
                const value = Boolean(values[k]);
                if (outputs.get(ref) !== value) {
                  outputs.set(ref, value);
                  changed = true;
                }
              }
            } else {
              const value = taskOutput(task.id, inputs);
              const ref = `${component.id}.out`;
              if (outputs.get(ref) !== value) {
                outputs.set(ref, value);
                changed = true;
              }
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

  // --- Bus-aware evaluation (chapter 2.4) ----------------------------------
  // Like evaluateWorkspace, but every terminal carries a bit-vector (boolean[])
  // instead of a single boolean, so buses and splitters propagate correctly.
  // Single-bit components (source/nand/gate/card) use length-1 vectors, so the
  // same code covers both. Kept separate from evaluateWorkspace to leave the
  // (heavily relied-on) single-bit path for chapters 2.2/2.3 untouched.
  function widthOfBits(workspace, ref) {
    const w = typeof pinWidth === "function" ? pinWidth(workspace, ref) : 1;
    return Number.isInteger(w) && w > 0 ? w : 1;
  }

  function zeroBits(n) {
    return Array.from({ length: n }, () => false);
  }

  function orBits(a, b) {
    const n = Math.max(a.length, b.length);
    const out = [];
    for (let i = 0; i < n; i += 1) out.push(Boolean(a[i]) || Boolean(b[i]));
    return out;
  }

  function bitsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) if (Boolean(a[i]) !== Boolean(b[i])) return false;
    return true;
  }

  function fitBits(vec, width) {
    if (vec.length === width) return vec;
    if (vec.length > width) return vec.slice(0, width);
    return vec.concat(zeroBits(width - vec.length));
  }

  // The bit-vector driving an input ref: the bitwise OR of every connected
  // output's vector, sized to the input pin's width.
  function inputBits(workspace, inputRef, outputs) {
    const width = widthOfBits(workspace, inputRef);
    let vec = zeroBits(width);
    for (const wire of workspace.wires) {
      const other = otherWireEnd(wire, inputRef);
      if (!other) continue;
      if (terminalDirection(workspace, other) !== "out") continue;
      const src = outputs.get(other);
      if (Array.isArray(src)) vec = orBits(vec, src);
    }
    return fitBits(vec, width);
  }

  function setBits(outputs, ref, vec) {
    if (bitsEqual(outputs.get(ref), vec)) return false;
    outputs.set(ref, vec);
    return true;
  }

  function splitterCount(component) {
    if (typeof splitterOutputCount === "function") return splitterOutputCount(component);
    return Math.min(16, Math.max(2, Number(component?.outputs) || 4));
  }

  function evaluateWorkspaceBits(workspace) {
    const outputs = new Map();
    for (const component of workspace.components) {
      if (component.type === "source") outputs.set(`${component.id}.out`, [true]);
    }

    for (let iter = 0; iter < workspace.components.length + 4; iter += 1) {
      let changed = false;

      for (const component of workspace.components) {
        const type = component.type;
        if (type === "source") continue;

        if (type === "nand") {
          const a = inputBits(workspace, `${component.id}.in1`, outputs)[0];
          const b = inputBits(workspace, `${component.id}.in2`, outputs)[0];
          if (setBits(outputs, `${component.id}.out`, [!(a && b)])) changed = true;
          continue;
        }

        if (type === "splitter") {
          const w = Number.isInteger(component.width) ? component.width : null;
          if (w === null) continue; // untyped splitter: nothing to propagate yet
          const count = splitterCount(component);
          if (component.mirrored) {
            // Legs are inputs; the single pin outputs their concatenation.
            let vec = [];
            for (let i = 0; i < count; i += 1) {
              vec = vec.concat(fitBits(inputBits(workspace, `${component.id}.leg${i}`, outputs), w));
            }
            if (setBits(outputs, `${component.id}.single`, vec)) changed = true;
          } else {
            // The single pin is the input; each leg outputs one chunk of it.
            const inVec = inputBits(workspace, `${component.id}.single`, outputs);
            for (let i = 0; i < count; i += 1) {
              const chunk = fitBits(inVec.slice(i * w, i * w + w), w);
              if (setBits(outputs, `${component.id}.leg${i}`, chunk)) changed = true;
            }
          }
          continue;
        }

        if (type.startsWith("gate-")) {
          // A placeable bus gate (gate-Not4 …): apply the op componentwise over
          // the whole input bus.
          const bus = typeof busGateSpec === "function" ? busGateSpec(type) : null;
          if (bus) {
            const inVecs = Array.from({ length: bus.inputs }, (_, k) => inputBits(workspace, `${component.id}.in${k + 1}`, outputs));
            const outVec = [];
            if (bus.control) {
              // MUX bus gate: the last input is a single shared control bit; the
              // rest are per-bit data buses. output[i] = op(data…[i], control).
              const dataVecs = inVecs.slice(0, -1);
              const control = inVecs[inVecs.length - 1][0];
              for (let i = 0; i < bus.width; i += 1) {
                outVec.push(Boolean(taskOutput(bus.op, [...dataVecs.map((v) => v[i]), control])));
              }
            } else {
              for (let i = 0; i < bus.width; i += 1) {
                outVec.push(Boolean(taskOutput(bus.op, inVecs.map((v) => v[i]))));
              }
            }
            if (setBits(outputs, `${component.id}.out`, outVec)) changed = true;
            continue;
          }
          const task = taskDefById(type.slice(5));
          if (!task) continue;
          const inputs = Array.from({ length: task.inputs }, (_, i) => inputBits(workspace, `${component.id}.in${i + 1}`, outputs)[0]);
          const outCount = task.outputs || 1;
          if (outCount > 1) {
            const values = taskOutputs(task.id, inputs);
            for (let k = 0; k < outCount; k += 1) {
              if (setBits(outputs, `${component.id}.out${k + 1}`, [Boolean(values[k])])) changed = true;
            }
          } else if (setBits(outputs, `${component.id}.out`, [Boolean(taskOutput(task.id, inputs))])) {
            changed = true;
          }
          continue;
        }

        if (type.startsWith("taskCard-")) {
          // A card is a pass-through: external inputs drive internal inputs, and
          // internal outputs drive external outputs. This holds for single-bit
          // and bus cards alike — the vectors are simply wider. Pin roles are
          // discovered from the card's pin map so every card shape is covered.
          const pins = typeof resolvePins === "function" ? resolvePins(component) : {};
          for (const pinId of Object.keys(pins)) {
            const intMatch = pinId.match(/^inputInt(\d*)$/);
            if (intMatch) {
              const extRef = `${component.id}.inputExt${intMatch[1]}`;
              if (setBits(outputs, `${component.id}.${pinId}`, inputBits(workspace, extRef, outputs))) changed = true;
              continue;
            }
            const extMatch = pinId.match(/^outputExt(\d*)$/);
            if (extMatch) {
              const intRef = `${component.id}.outputInt${extMatch[1]}`;
              if (setBits(outputs, `${component.id}.${pinId}`, inputBits(workspace, intRef, outputs))) changed = true;
            }
          }
          continue;
        }
      }

      if (!changed) break;
    }

    const lamps = new Map();
    for (const component of workspace.components) {
      if (component.type === "lamp") {
        lamps.set(component.id, Boolean(inputBits(workspace, `${component.id}.in`, outputs)[0]));
      }
    }

    return { outputs, lamps };
  }

  return { connectedOutputRefs, inputSignal, evaluateWorkspace, evaluateWorkspaceBits };
}

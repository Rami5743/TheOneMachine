// solution-workspaces.js — builders that assemble complete workbench layouts as
// DATA, extracted from app.js: the reference solution for each task (Not, And,
// Or, Xor, AND3way, OR4way, including the alternative Nand-based / balanced
// variants shown at later hint steps), the blank standard task workbench, and
// the workspaces used while running an automated task test row by row. They are
// pure: every host helper (normalizer, wire builder, wire ops, task lookups,
// exit target, and the task-test frame) is INJECTED.
//
// Loaded BEFORE app.js. createSolutionWorkspaces(deps) -> { standardTaskWorkspace,
//   cleanedWorkspaceForTaskTest, workspaceForTaskTestRow, solutionWorkspaceForTask }
//   deps: normalizeWorkspace, createDefaultWorkspace, normalizeWire, clonePlain,
//         removeInvalidWires, removeWiresAt, addTestWire, taskDefById,
//         taskCardComponentType, currentTaskDef, taskCardOutputExtRef,
//         taskCardInputExtRef, secondWorkspaceExitTarget, TASK_TEST_FRAME

function createSolutionWorkspaces({
  normalizeWorkspace,
  createDefaultWorkspace,
  normalizeWire,
  clonePlain,
  removeInvalidWires,
  removeWiresAt,
  addTestWire,
  taskDefById,
  taskCardComponentType,
  currentTaskDef,
  taskCardOutputExtRef,
  taskCardInputExtRef,
  taskOutputLampPairs,
  taskLampComponents,
  secondWorkspaceExitTarget,
  TASK_TEST_FRAME,
  muxSolutionLayout
}) {
  function lampComponents(taskId) {
    if (typeof taskLampComponents === "function") return taskLampComponents(taskId);
    return [{ id: "lamp-1", type: "lamp", x: 910, y: 258 }];
  }
  // Position a MUX-solution component from the (editable) SVG layout when it has
  // posted, otherwise from the hardcoded fallback coordinates.
  function muxLayout(key) {
    return typeof muxSolutionLayout === "function" ? muxSolutionLayout(key) : null;
  }

  function muxAt(key, id, fallbackX, fallbackY) {
    const layout = muxLayout(key);
    const p = layout && layout.components ? layout.components[id] : null;
    return { x: p && Number.isFinite(p.x) ? p.x : fallbackX, y: p && Number.isFinite(p.y) ? p.y : fallbackY };
  }

  // The wire list: the netlist the SVG derived from its own (hand-editable) wire
  // elements when it has posted one, otherwise the hardcoded fallback pairs.
  function muxWires(key, fallbackPairs) {
    const layout = muxLayout(key);
    const conns = layout && Array.isArray(layout.connections) && layout.connections.length
      ? layout.connections
      : fallbackPairs;
    const seen = new Set();
    const wires = [];
    conns.forEach(([a, b]) => {
      const wire = normalizeWire(a, b);
      const id = `${wire.a}|${wire.b}`;
      if (seen.has(id)) return;
      seen.add(id);
      wires.push(wire);
    });
    return wires;
  }
  // The MUX card is drawn on a larger frame than the 2.2 cards, so its "keep
  // components inside the card" test frame is larger too — otherwise gates the
  // learner legitimately places near the (bigger) card edges get discarded when
  // the check assembles the test circuit.
  function taskTestFrame(workspace) {
    // The MUX and DMUX cards share the larger 2.3 frame.
    if (workspace?.taskId === "Mux" || workspace?.taskId === "DMux") return { x1: 140, y1: 35, x2: 870, y2: 540 };
    return TASK_TEST_FRAME;
  }

  function componentInsideTaskFrame(component, frame) {
    if (!component) return false;
    // The card, the source, and any lamp (a card may have several) are always kept.
    if (component.id === "source-1" || component.id === "task-card-1" || /^lamp-\d+$/.test(component.id)) return true;
    return component.x >= frame.x1 && component.x <= frame.x2 && component.y >= frame.y1 && component.y <= frame.y2;
  }

  // The card's output(s) paired with the lamp reading each (one pair for single-
  // output cards, one per output for the DMUX).
  function outputLampPairs(task) {
    if (typeof taskOutputLampPairs === "function") return taskOutputLampPairs(task);
    return [{ outputRef: taskCardOutputExtRef(), lampId: "lamp-1" }];
  }

  function cleanedWorkspaceForTaskTest(sourceWorkspace) {
    const workspace = normalizeWorkspace(clonePlain(sourceWorkspace));
    const frame = taskTestFrame(workspace);
    workspace.components = workspace.components.filter((component) => componentInsideTaskFrame(component, frame));
    workspace.selectedTerminal = null;
    workspace.accident = null;
    removeInvalidWires(workspace);
    outputLampPairs(currentTaskDef(workspace)).forEach((pair) => addTestWire(workspace, pair.outputRef, `${pair.lampId}.in`));
    return workspace;
  }

  function workspaceForTaskTestRow(baseWorkspace, row) {
    const task = currentTaskDef(baseWorkspace);
    const workspace = normalizeWorkspace(clonePlain(baseWorkspace));
    workspace.selectedTerminal = null;
    workspace.accident = null;

    if (task) {
      for (let index = 0; index < task.inputs; index += 1) {
        removeWiresAt(workspace, taskCardInputExtRef(index));
      }
    }

    outputLampPairs(task).forEach((pair) => {
      removeWiresAt(workspace, `${pair.lampId}.in`);
      addTestWire(workspace, pair.outputRef, `${pair.lampId}.in`);
    });

    if (task) {
      row.inputs.forEach((value, index) => {
        if (value) addTestWire(workspace, "source-1.out", taskCardInputExtRef(index));
      });
    }

    return workspace;
  }

  function standardTaskWorkspace(taskId) {
    const task = taskDefById(taskId);
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components: [
        { id: "source-1", type: "source", x: (taskId === "Mux" || taskId === "DMux") ? 45 : 80, y: 288 },
        { id: "task-card-1", type: taskCardComponentType(task.id), x: 500, y: 288 },
        ...lampComponents(taskId)
      ],
      wires: [],
      nextId: 2,
      selectedTerminal: null,
      accident: null,
      unlocked: true,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      nandMonologueStep: null,
      workspaceCompleted: false,
      workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      returnToWorkspaceAfterMonologue: false,
      taskId,
      taskIntroSeen: true
    });
  }

  function notSolutionWorkspaceFrom() {
    const workspace = standardTaskWorkspace("Not");
    workspace.components.push({ id: "nand-1", type: "nand", x: 500, y: 288 });
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "nand-1.in1"),
      normalizeWire("task-card-1.inputInt1", "nand-1.in2"),
      normalizeWire("nand-1.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function andSolutionWorkspaceFrom() {
    const workspace = standardTaskWorkspace("And");
    workspace.components.push(
      { id: "nand-1", type: "nand", x: 420, y: 288 },
      { id: "not-1", type: "gate-Not", x: 640, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "nand-1.in1"),
      normalizeWire("task-card-1.inputInt2", "nand-1.in2"),
      normalizeWire("nand-1.out", "not-1.in1"),
      normalizeWire("not-1.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function orSolutionWorkspaceStandardFrom() {
    const workspace = standardTaskWorkspace("Or");
    workspace.components.push(
      { id: "not-1", type: "gate-Not", x: 340, y: 218 },
      { id: "not-2", type: "gate-Not", x: 340, y: 358 },
      { id: "and-1", type: "gate-And", x: 500, y: 288 },
      { id: "not-3", type: "gate-Not", x: 650, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "not-1.in1"),
      normalizeWire("task-card-1.inputInt2", "not-2.in1"),
      normalizeWire("not-1.out", "and-1.in1"),
      normalizeWire("not-2.out", "and-1.in2"),
      normalizeWire("and-1.out", "not-3.in1"),
      normalizeWire("not-3.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function orSolutionWorkspaceNandFrom() {
    const workspace = standardTaskWorkspace("Or");
    workspace.components.push(
      { id: "not-1", type: "gate-Not", x: 340, y: 218 },
      { id: "not-2", type: "gate-Not", x: 340, y: 358 },
      { id: "nand-1", type: "nand", x: 580, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "not-1.in1"),
      normalizeWire("task-card-1.inputInt2", "not-2.in1"),
      normalizeWire("not-1.out", "nand-1.in1"),
      normalizeWire("not-2.out", "nand-1.in2"),
      normalizeWire("nand-1.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function orSolutionWorkspaceFrom(step = 0) {
    return step >= 7 ? orSolutionWorkspaceNandFrom() : orSolutionWorkspaceStandardFrom();
  }

  function xorSolutionWorkspaceFirstFrom() {
    const workspace = standardTaskWorkspace("Xor");
    workspace.components.push(
      { id: "or-1", type: "gate-Or", x: 360, y: 218 },
      { id: "and-raw", type: "gate-And", x: 360, y: 358 },
      { id: "not-1", type: "gate-Not", x: 520, y: 358 },
      { id: "and-final", type: "gate-And", x: 690, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "or-1.in1"),
      normalizeWire("task-card-1.inputInt2", "or-1.in2"),
      normalizeWire("task-card-1.inputInt1", "and-raw.in1"),
      normalizeWire("task-card-1.inputInt2", "and-raw.in2"),
      normalizeWire("and-raw.out", "not-1.in1"),
      normalizeWire("or-1.out", "and-final.in1"),
      normalizeWire("not-1.out", "and-final.in2"),
      normalizeWire("and-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function xorSolutionWorkspaceNandFrom() {
    const workspace = standardTaskWorkspace("Xor");
    workspace.components.push(
      { id: "or-1", type: "gate-Or", x: 360, y: 218 },
      { id: "nand-1", type: "nand", x: 420, y: 358 },
      { id: "and-final", type: "gate-And", x: 670, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "or-1.in1"),
      normalizeWire("task-card-1.inputInt2", "or-1.in2"),
      normalizeWire("task-card-1.inputInt1", "nand-1.in1"),
      normalizeWire("task-card-1.inputInt2", "nand-1.in2"),
      normalizeWire("or-1.out", "and-final.in1"),
      normalizeWire("nand-1.out", "and-final.in2"),
      normalizeWire("and-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function xorSolutionWorkspaceCasesFrom() {
    const workspace = standardTaskWorkspace("Xor");
    workspace.components.push(
      { id: "not-a", type: "gate-Not", x: 340, y: 218 },
      { id: "not-b", type: "gate-Not", x: 340, y: 358 },
      { id: "and-case1", type: "gate-And", x: 520, y: 218 },
      { id: "and-case2", type: "gate-And", x: 520, y: 358 },
      { id: "or-final", type: "gate-Or", x: 670, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "not-a.in1"),
      normalizeWire("task-card-1.inputInt2", "not-b.in1"),
      normalizeWire("not-a.out", "and-case1.in1"),
      normalizeWire("task-card-1.inputInt2", "and-case1.in2"),
      normalizeWire("task-card-1.inputInt1", "and-case2.in1"),
      normalizeWire("not-b.out", "and-case2.in2"),
      normalizeWire("and-case1.out", "or-final.in1"),
      normalizeWire("and-case2.out", "or-final.in2"),
      normalizeWire("or-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function xorSolutionWorkspaceFrom(step = 0) {
    if (step >= 10) return xorSolutionWorkspaceCasesFrom();
    if (step >= 8) return xorSolutionWorkspaceNandFrom();
    return xorSolutionWorkspaceFirstFrom();
  }

  function and3waySolutionWorkspaceFrom() {
    const workspace = standardTaskWorkspace("AND3way");
    workspace.components.push(
      { id: "and-1", type: "gate-And", x: 420, y: 230 },
      { id: "and-2", type: "gate-And", x: 640, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "and-1.in1"),
      normalizeWire("task-card-1.inputInt2", "and-1.in2"),
      normalizeWire("and-1.out", "and-2.in1"),
      normalizeWire("task-card-1.inputInt3", "and-2.in2"),
      normalizeWire("and-2.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function or4waySolutionWorkspaceChainFrom() {
    const workspace = standardTaskWorkspace("OR4way");
    workspace.components.push(
      { id: "or-ab", type: "gate-Or", x: 360, y: 196 },
      { id: "or-abc", type: "gate-Or", x: 535, y: 270 },
      { id: "or-final", type: "gate-Or", x: 680, y: 346 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "or-ab.in1"),
      normalizeWire("task-card-1.inputInt2", "or-ab.in2"),
      normalizeWire("or-ab.out", "or-abc.in1"),
      normalizeWire("task-card-1.inputInt3", "or-abc.in2"),
      normalizeWire("or-abc.out", "or-final.in1"),
      normalizeWire("task-card-1.inputInt4", "or-final.in2"),
      normalizeWire("or-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function or4waySolutionWorkspaceBalancedFrom() {
    const workspace = standardTaskWorkspace("OR4way");
    workspace.components.push(
      { id: "or-left", type: "gate-Or", x: 360, y: 220 },
      { id: "or-right", type: "gate-Or", x: 360, y: 360 },
      { id: "or-final", type: "gate-Or", x: 620, y: 288 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "or-left.in1"),
      normalizeWire("task-card-1.inputInt2", "or-left.in2"),
      normalizeWire("task-card-1.inputInt3", "or-right.in1"),
      normalizeWire("task-card-1.inputInt4", "or-right.in2"),
      normalizeWire("or-left.out", "or-final.in1"),
      normalizeWire("or-right.out", "or-final.in2"),
      normalizeWire("or-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  function or4waySolutionWorkspaceFrom(step = 0) {
    return step >= 4 ? or4waySolutionWorkspaceBalancedFrom() : or4waySolutionWorkspaceChainFrom();
  }

  // MUX — the compact solution: (input1 AND NOT control) OR (input2 AND control).
  function muxCompactSolutionFrom() {
    const workspace = standardTaskWorkspace("Mux");
    workspace.components.push(
      { id: "not-c", type: "gate-Not", ...muxAt("compact", "not-c", 380, 175) },
      { id: "and-1", type: "gate-And", ...muxAt("compact", "and-1", 500, 240) },
      { id: "and-2", type: "gate-And", ...muxAt("compact", "and-2", 500, 410) },
      { id: "or-1", type: "gate-Or", ...muxAt("compact", "or-1", 660, 320) }
    );
    workspace.wires = muxWires("compact", [
      ["task-card-1.inputInt3", "not-c.in1"],
      // Control signal on the top input (in1) of each AND, data on the bottom
      // (in2) — matching the SVG layout.
      ["not-c.out", "and-1.in1"],
      ["task-card-1.inputInt1", "and-1.in2"],
      ["task-card-1.inputInt3", "and-2.in1"],
      ["task-card-1.inputInt2", "and-2.in2"],
      ["and-1.out", "or-1.in1"],
      ["and-2.out", "or-1.in2"],
      ["or-1.out", "task-card-1.outputInt"]
    ]);
    return normalizeWorkspace(workspace);
  }

  // MUX — the generic truth-table (minterm) solution: one AND term per row that
  // outputs 1, all combined with an OR. The four 1-rows are:
  //   m1: in1 & ~in2 & ~c   m2: in1 & in2 & ~c
  //   m3: ~in1 & in2 & c     m4: in1 & in2 & c
  function muxGenericSolutionFrom() {
    const workspace = standardTaskWorkspace("Mux");
    const ands = [
      { id: "and-m1", type: "gate-AND3way", ...muxAt("generic", "and-m1", 535, 165) },
      { id: "and-m2", type: "gate-AND3way", ...muxAt("generic", "and-m2", 535, 255) },
      { id: "and-m3", type: "gate-AND3way", ...muxAt("generic", "and-m3", 535, 345) },
      { id: "and-m4", type: "gate-AND3way", ...muxAt("generic", "and-m4", 535, 435) }
    ];
    workspace.components.push(
      { id: "not-c", type: "gate-Not", ...muxAt("generic", "not-c", 360, 90) },
      { id: "not-in1", type: "gate-Not", ...muxAt("generic", "not-in1", 255, 250) },
      { id: "not-in2", type: "gate-Not", ...muxAt("generic", "not-in2", 255, 360) },
      ...ands,
      { id: "or-final", type: "gate-OR4way", ...muxAt("generic", "or-final", 700, 300) }
    );
    // AND → OR by vertical position (top AND to the top OR input, and so on), so
    // the four wires never cross — matching the SVG rather than the label order.
    const orInputs = ["or-final.in1", "or-final.in2", "or-final.in3", "or-final.in4"];
    const andToOr = [...ands]
      .sort((a, b) => a.y - b.y)
      .map((and, index) => [`${and.id}.out`, orInputs[index]]);
    workspace.wires = muxWires("generic", [
      ["task-card-1.inputInt2", "not-in2.in1"],
      ["task-card-1.inputInt1", "not-in1.in1"],
      ["task-card-1.inputInt3", "not-c.in1"],
      // Each AND takes its inputs in a fixed vertical order matching the SVG:
      // the control signal on top (in1), input-1 in the middle (in2), input-2 at
      // the bottom (in3). AND is commutative, so this is the same circuit.
      ["not-c.out", "and-m1.in1"],
      ["task-card-1.inputInt1", "and-m1.in2"],
      ["not-in2.out", "and-m1.in3"],
      ["not-c.out", "and-m2.in1"],
      ["task-card-1.inputInt1", "and-m2.in2"],
      ["task-card-1.inputInt2", "and-m2.in3"],
      ["task-card-1.inputInt3", "and-m3.in1"],
      ["not-in1.out", "and-m3.in2"],
      ["task-card-1.inputInt2", "and-m3.in3"],
      ["task-card-1.inputInt3", "and-m4.in1"],
      ["task-card-1.inputInt1", "and-m4.in2"],
      ["task-card-1.inputInt2", "and-m4.in3"],
      ...andToOr,
      ["or-final.out", "task-card-1.outputInt"]
    ]);
    return normalizeWorkspace(workspace);
  }

  // Steps 0..5 walk the generic minterm solution; from step 6 ("פתרון נוסף")
  // the compact solution is shown.
  function muxSolutionWorkspaceFrom(step = 0) {
    return step >= 6 ? muxCompactSolutionFrom() : muxGenericSolutionFrom();
  }

  // DMUX — the simplest solution: out1 = data AND NOT(control); out2 = data AND
  // control. Control goes on the top input (in1) of each AND, data on the bottom.
  function dmuxSolutionFrom() {
    const workspace = standardTaskWorkspace("DMux");
    workspace.components.push(
      { id: "not-c", type: "gate-Not", ...muxAt("dmux", "not-c", 400, 120) },
      { id: "and-1", type: "gate-And", ...muxAt("dmux", "and-1", 560, 188) },
      { id: "and-2", type: "gate-And", ...muxAt("dmux", "and-2", 560, 388) }
    );
    workspace.wires = muxWires("dmux", [
      ["task-card-1.inputInt2", "not-c.in1"],
      ["not-c.out", "and-1.in1"],
      ["task-card-1.inputInt1", "and-1.in2"],
      ["and-1.out", "task-card-1.outputInt1"],
      ["task-card-1.inputInt2", "and-2.in1"],
      ["task-card-1.inputInt1", "and-2.in2"],
      ["and-2.out", "task-card-1.outputInt2"]
    ]);
    return normalizeWorkspace(workspace);
  }

  // halfAdder (chapter 2.5): sum = Xor(in1,in2) on the top output, carry =
  // And(in1,in2) on the bottom output.
  function halfAdderSolutionFrom() {
    const workspace = standardTaskWorkspace("halfAdder");
    // And (carry) on top, Xor (sum) on the bottom — matching the card's carry-top
    // / sum-bottom outputs, so the two wires don't cross.
    workspace.components.push(
      { id: "and-1", type: "gate-And", x: 330, y: 200 },
      { id: "xor-1", type: "gate-Xor", x: 330, y: 380 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "xor-1.in1"),
      normalizeWire("task-card-1.inputInt2", "xor-1.in2"),
      normalizeWire("task-card-1.inputInt1", "and-1.in1"),
      normalizeWire("task-card-1.inputInt2", "and-1.in2"),
      normalizeWire("xor-1.out", "task-card-1.outputInt1"),
      normalizeWire("and-1.out", "task-card-1.outputInt2")
    ];
    return normalizeWorkspace(workspace);
  }

  // fullAdder (chapter 2.5): three halfAdders. HA1 adds the first two inputs;
  // HA2 adds the third to HA1's sum (its sum is the card's sum); HA3 adds the two
  // carries (its sum is the card's carry, its own carry is always 0).
  function fullAdderSolutionFrom() {
    const workspace = standardTaskWorkspace("fullAdder");
    workspace.components.push(
      { id: "ha-1", type: "gate-halfAdder", x: 330, y: 200 },
      { id: "ha-2", type: "gate-halfAdder", x: 500, y: 320 },
      { id: "ha-3", type: "gate-halfAdder", x: 690, y: 240 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt1", "ha-1.in1"),
      normalizeWire("task-card-1.inputInt2", "ha-1.in2"),
      normalizeWire("ha-1.out1", "ha-2.in1"),
      normalizeWire("task-card-1.inputInt3", "ha-2.in2"),
      normalizeWire("ha-2.out1", "task-card-1.outputInt1"),
      normalizeWire("ha-1.out2", "ha-3.in1"),
      normalizeWire("ha-2.out2", "ha-3.in2"),
      normalizeWire("ha-3.out1", "task-card-1.outputInt2")
    ];
    return normalizeWorkspace(workspace);
  }

  // Add4 (chapter 2.5): a 4-bit ripple-carry adder. Split both number buses into
  // their 4 bits, add them column by column with a chain of four fullAdders
  // threading the carry, merge the four sum bits back into the sum bus, and take
  // the last carry as the leading digit. The splitter's bottom leg is leg0 (the
  // units bit, LSB) and the top leg is leg3 (the MSB), so the units fullAdder
  // (fa0) sits at the bottom by the incoming carry and the carry threads UP
  // fa0->fa1->fa2->fa3; fa3's carry is the leading digit. Layout supplied by the
  // author (units at the bottom, a slight rightward lean up the significance).
  function add4SolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Add4"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 451, y: 173, mirrored: false, outputs: 4, width: 1 },
      { id: "split-b", type: "splitter", x: 451, y: 310, mirrored: false, outputs: 4, width: 1 },
      { id: "fa0", type: "gate-fullAdder", x: 582, y: 406 },
      { id: "fa1", type: "gate-fullAdder", x: 602, y: 323 },
      { id: "fa2", type: "gate-fullAdder", x: 610, y: 245 },
      { id: "fa3", type: "gate-fullAdder", x: 635, y: 170 },
      { id: "merge", type: "splitter", x: 796, y: 328, mirrored: true, outputs: 4, width: 1 }
    ];
    // fa0=units (LSB=leg0, bottom), fa3=leading (MSB=leg3, top); the carry threads
    // upward fa0->fa1->fa2->fa3, and fa3's carry is the leading fifth digit.
    const cols = [
      { fa: "fa0", leg: "leg0", carryIn: "task-card-1.inputInt3" },
      { fa: "fa1", leg: "leg1", carryIn: "fa0.out2" },
      { fa: "fa2", leg: "leg2", carryIn: "fa1.out2" },
      { fa: "fa3", leg: "leg3", carryIn: "fa2.out2" }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt2"),
      normalizeWire("fa3.out2", "task-card-1.outputInt1")
    ];
    cols.forEach(({ fa, leg, carryIn }) => {
      wires.push(normalizeWire(`split-a.${leg}`, `${fa}.in1`));
      wires.push(normalizeWire(`split-b.${leg}`, `${fa}.in2`));
      wires.push(normalizeWire(carryIn, `${fa}.in3`));
      wires.push(normalizeWire(`${fa}.out1`, `merge.${leg}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components,
      wires,
      nextId: 2,
      selectedTerminal: null,
      accident: null,
      unlocked: true,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      nandMonologueStep: null,
      workspaceCompleted: false,
      workspaceSession: 2,
      taskId: "Add4",
      taskIntroSeen: true
    });
  }

  // Not4 (chapter 2.4): split the input bus into 4 wires, NOT each, merge back.
  // Built directly (not via standardTaskWorkspace) because bus tasks have no
  // TASK_DEFS entry and use a bus card with a pre-placed single source.
  function not4SolutionWorkspaceFrom() {
    // Aligned with the splitter legs (288 ± 51/17), component 0 at the bottom,
    // so every split→gate→merge wire is horizontal (no crossing).
    const notYs = [339, 305, 271, 237];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Not4"), x: 640, y: 288 },
      { id: "split-in", type: "splitter", x: 450, y: 288, mirrored: false, outputs: 4, width: 1 },
      { id: "merge", type: "splitter", x: 830, y: 288, mirrored: true, outputs: 4, width: 1 }
    ];
    const wires = [normalizeWire("task-card-1.inputInt1", "split-in.single")];
    notYs.forEach((y, i) => {
      components.push({ id: `not-${i}`, type: "gate-Not", x: 640, y });
      wires.push(normalizeWire(`split-in.leg${i}`, `not-${i}.in1`));
      wires.push(normalizeWire(`not-${i}.out`, `merge.leg${i}`));
    });
    wires.push(normalizeWire("merge.single", "task-card-1.outputInt"));
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "Not4", taskIntroSeen: true
    });
  }

  // Not16: split the 16-bit input into 4 buses of width 4, apply a Not4 to each,
  // merge the four 4-bit results back into the 16-bit output.
  function not16SolutionWorkspaceFrom() {
    // Aligned with the splitter legs, component 0 at the bottom, so every
    // split→gate→merge wire is horizontal (no crossing).
    const not4Ys = [339, 305, 271, 237];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Not16"), x: 640, y: 288 },
      { id: "split-in", type: "splitter", x: 450, y: 288, mirrored: false, outputs: 4, width: 4 },
      { id: "merge", type: "splitter", x: 830, y: 288, mirrored: true, outputs: 4, width: 4 }
    ];
    const wires = [normalizeWire("task-card-1.inputInt1", "split-in.single")];
    not4Ys.forEach((y, i) => {
      components.push({ id: `not4-${i}`, type: "gate-Not4", x: 640, y });
      wires.push(normalizeWire(`split-in.leg${i}`, `not4-${i}.in1`));
      wires.push(normalizeWire(`not4-${i}.out`, `merge.leg${i}`));
    });
    wires.push(normalizeWire("merge.single", "task-card-1.outputInt"));
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "Not16", taskIntroSeen: true
    });
  }

  // AND4: split each of the two 4-bit inputs into 4 wires, AND the matching
  // pairs, merge the four results back into the 4-bit output.
  function and4SolutionWorkspaceFrom() {
    // Spread out (component 0 at the bottom) so the AND gates don't overlap —
    // each still sits between its two input legs (top split-a, bottom split-b).
    const andYs = [393, 323, 253, 183];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("AND4"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 450, y: 198, mirrored: false, outputs: 4, width: 1 },
      { id: "split-b", type: "splitter", x: 450, y: 378, mirrored: false, outputs: 4, width: 1 },
      { id: "merge", type: "splitter", x: 830, y: 288, mirrored: true, outputs: 4, width: 1 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    andYs.forEach((y, i) => {
      components.push({ id: `and-${i}`, type: "gate-And", x: 660, y });
      wires.push(normalizeWire(`split-a.leg${i}`, `and-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `and-${i}.in2`));
      wires.push(normalizeWire(`and-${i}.out`, `merge.leg${i}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "AND4", taskIntroSeen: true
    });
  }

  // OR4: split each of the two 4-bit inputs into 4 wires, OR the matching pairs,
  // merge the four results back into the 4-bit output. (Analogous to AND4.)
  function or4SolutionWorkspaceFrom() {
    const orYs = [393, 323, 253, 183];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("OR4"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 450, y: 198, mirrored: false, outputs: 4, width: 1 },
      { id: "split-b", type: "splitter", x: 450, y: 378, mirrored: false, outputs: 4, width: 1 },
      { id: "merge", type: "splitter", x: 830, y: 288, mirrored: true, outputs: 4, width: 1 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    orYs.forEach((y, i) => {
      components.push({ id: `or-${i}`, type: "gate-Or", x: 660, y });
      wires.push(normalizeWire(`split-a.leg${i}`, `or-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `or-${i}.in2`));
      wires.push(normalizeWire(`or-${i}.out`, `merge.leg${i}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "OR4", taskIntroSeen: true
    });
  }

  // AND16: split each 16-bit input into 4 buses of width 4, AND the matching
  // pairs with an AND4, merge the four 4-bit results back into the 16-bit output.
  function and16SolutionWorkspaceFrom() {
    const andYs = [393, 323, 253, 183];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("AND16"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 450, y: 198, mirrored: false, outputs: 4, width: 4 },
      { id: "split-b", type: "splitter", x: 450, y: 378, mirrored: false, outputs: 4, width: 4 },
      { id: "merge", type: "splitter", x: 830, y: 288, mirrored: true, outputs: 4, width: 4 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    andYs.forEach((y, i) => {
      components.push({ id: `and4-${i}`, type: "gate-AND4", x: 660, y });
      wires.push(normalizeWire(`split-a.leg${i}`, `and4-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `and4-${i}.in2`));
      wires.push(normalizeWire(`and4-${i}.out`, `merge.leg${i}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "AND16", taskIntroSeen: true
    });
  }

  // MUX4: split each of the two 4-bit data inputs into 4 wires, feed matching
  // bit-pairs into a single-bit MUX (in1=data-1 bit, in2=data-2 bit), fan the
  // shared control bit to every MUX's in3, merge the four results into the
  // 4-bit output. output = control ? data2 : data1, bit by bit.
  function mux4SolutionWorkspaceFrom() {
    const muxYs = [393, 323, 253, 183];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("MUX4"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 430, y: 198, mirrored: false, outputs: 4, width: 1 },
      { id: "split-b", type: "splitter", x: 430, y: 378, mirrored: false, outputs: 4, width: 1 },
      { id: "merge", type: "splitter", x: 850, y: 288, mirrored: true, outputs: 4, width: 1 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    muxYs.forEach((y, i) => {
      components.push({ id: `mux-${i}`, type: "gate-Mux", x: 650, y });
      wires.push(normalizeWire(`split-a.leg${i}`, `mux-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `mux-${i}.in2`));
      wires.push(normalizeWire("task-card-1.inputInt3", `mux-${i}.in3`));
      wires.push(normalizeWire(`mux-${i}.out`, `merge.leg${i}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "MUX4", taskIntroSeen: true
    });
  }

  // MUX16: split each 16-bit data input into 4 buses of width 4, feed matching
  // bus-pairs into a MUX4, fan the shared control bit to every MUX4's in3, merge
  // the four 4-bit results into the 16-bit output. (Just like MUX4, using MUX4
  // in place of MUX.)
  function mux16SolutionWorkspaceFrom() {
    const muxYs = [393, 323, 253, 183];
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("MUX16"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 430, y: 198, mirrored: false, outputs: 4, width: 4 },
      { id: "split-b", type: "splitter", x: 430, y: 378, mirrored: false, outputs: 4, width: 4 },
      { id: "merge", type: "splitter", x: 850, y: 288, mirrored: true, outputs: 4, width: 4 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    muxYs.forEach((y, i) => {
      components.push({ id: `mux4-${i}`, type: "gate-MUX4", x: 650, y });
      wires.push(normalizeWire(`split-a.leg${i}`, `mux4-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `mux4-${i}.in2`));
      wires.push(normalizeWire("task-card-1.inputInt3", `mux4-${i}.in3`));
      wires.push(normalizeWire(`mux4-${i}.out`, `merge.leg${i}`));
    });
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "MUX16", taskIntroSeen: true
    });
  }

  // Shared scaffold for a bus-task solution workspace (chapter 2.4).
  function busSolutionWorkspace(taskId, components, wires) {
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId, taskIntroSeen: true
    });
  }

  // y of splitter leg i (leg 0 at the BOTTOM), matching the board convention.
  function legY(n, i, center = 288, spacing = 34) {
    return center + ((n - 1) / 2 - i) * spacing;
  }

  // Not16 — the direct (cumbersome) variant: split the 16-bit input into 16 raw
  // wires, NOT each one, merge back. Shown as the "additional solution".
  function not16DirectSolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Not16"), x: 640, y: 288 },
      { id: "split-in", type: "splitter", x: 470, y: 288, mirrored: false, outputs: 16, width: 1 },
      { id: "merge", type: "splitter", x: 820, y: 288, mirrored: true, outputs: 16, width: 1 }
    ];
    const wires = [normalizeWire("task-card-1.inputInt1", "split-in.single")];
    for (let i = 0; i < 16; i += 1) {
      components.push({ id: `not-${i}`, type: "gate-Not", x: 645, y: legY(16, i) });
      wires.push(normalizeWire(`split-in.leg${i}`, `not-${i}.in1`));
      wires.push(normalizeWire(`not-${i}.out`, `merge.leg${i}`));
    }
    wires.push(normalizeWire("merge.single", "task-card-1.outputInt"));
    return busSolutionWorkspace("Not16", components, wires);
  }

  // AND16 — the direct (cumbersome) variant: split each 16-bit input into 16 raw
  // wires, AND matching pairs, merge back.
  function and16DirectSolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("AND16"), x: 640, y: 288 },
      { id: "split-a", type: "splitter", x: 430, y: 288, mirrored: false, outputs: 16, width: 1 },
      { id: "split-b", type: "splitter", x: 600, y: 288, mirrored: false, outputs: 16, width: 1 },
      { id: "merge", type: "splitter", x: 950, y: 288, mirrored: true, outputs: 16, width: 1 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "split-a.single"),
      normalizeWire("task-card-1.inputInt2", "split-b.single"),
      normalizeWire("merge.single", "task-card-1.outputInt")
    ];
    for (let i = 0; i < 16; i += 1) {
      components.push({ id: `and-${i}`, type: "gate-And", x: 780, y: legY(16, i) });
      wires.push(normalizeWire(`split-a.leg${i}`, `and-${i}.in1`));
      wires.push(normalizeWire(`split-b.leg${i}`, `and-${i}.in2`));
      wires.push(normalizeWire(`and-${i}.out`, `merge.leg${i}`));
    }
    return busSolutionWorkspace("AND16", components, wires);
  }

  // OR4 — the "original OR" variant (De Morgan): OR = NOT(AND(NOT a, NOT b)), done
  // per bus with NOT4/AND4. out = NOT4( AND4( NOT4(in1), NOT4(in2) ) ).
  function or4NotAndSolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("OR4"), x: 640, y: 288 },
      { id: "not-a", type: "gate-Not4", x: 470, y: 198 },
      { id: "not-b", type: "gate-Not4", x: 470, y: 378 },
      { id: "and-1", type: "gate-AND4", x: 650, y: 288 },
      { id: "not-out", type: "gate-Not4", x: 820, y: 288 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt1", "not-a.in1"),
      normalizeWire("task-card-1.inputInt2", "not-b.in1"),
      normalizeWire("not-a.out", "and-1.in1"),
      normalizeWire("not-b.out", "and-1.in2"),
      normalizeWire("and-1.out", "not-out.in1"),
      normalizeWire("not-out.out", "task-card-1.outputInt")
    ];
    return busSolutionWorkspace("OR4", components, wires);
  }

  // MUX4 — the "compute" variant, mirroring the single-bit MUX: out =
  // (data1 AND ~c) OR (data2 AND c), lifted to buses. The single control bit is
  // duplicated into 4 copies and bundled (ctrl-merge) into a width-4 control
  // bus; NOT4 gives its inverse; two AND4s gate the data buses; OR4 combines.
  function mux4NotAndOrSolutionFrom() {
    // Layout copied from the reference screenshot: the control is bundled into a
    // width-4 bus at the top-left, NOT4 sits at the top, the two AND4s are
    // stacked (upper = data1 & ~c, lower = data2 & c) with the control fanning to
    // both the NOT4 and the lower AND, and OR4 combines them on the right.
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("MUX4"), x: 640, y: 288 },
      { id: "ctrl-merge", type: "splitter", x: 575, y: 155, mirrored: true, outputs: 4, width: 1 },
      { id: "not4-c", type: "gate-Not4", x: 700, y: 155 },
      { id: "and-1", type: "gate-AND4", x: 760, y: 255 },
      { id: "and-2", type: "gate-AND4", x: 760, y: 390 },
      { id: "or-1", type: "gate-OR4", x: 840, y: 320 }
    ];
    const wires = [
      // fan the control bit into the four legs of the merging splitter
      normalizeWire("task-card-1.inputInt3", "ctrl-merge.leg0"),
      normalizeWire("task-card-1.inputInt3", "ctrl-merge.leg1"),
      normalizeWire("task-card-1.inputInt3", "ctrl-merge.leg2"),
      normalizeWire("task-card-1.inputInt3", "ctrl-merge.leg3"),
      // NOT4 gives ~c; it drives the TOP input of the upper AND (data1 & ~c)
      normalizeWire("ctrl-merge.single", "not4-c.in1"),
      normalizeWire("not4-c.out", "and-1.in1"),
      normalizeWire("task-card-1.inputInt1", "and-1.in2"),
      // the raw control bus drives the TOP input of the lower AND (data2 & c)
      normalizeWire("ctrl-merge.single", "and-2.in1"),
      normalizeWire("task-card-1.inputInt2", "and-2.in2"),
      // combine
      normalizeWire("and-1.out", "or-1.in1"),
      normalizeWire("and-2.out", "or-1.in2"),
      normalizeWire("or-1.out", "task-card-1.outputInt")
    ];
    return busSolutionWorkspace("MUX4", components, wires);
  }

  // MUX16 — the "original MUX" variant, drawn with AND16/NOT16/OR16 (the same
  // shape as the MUX4 compute variant, one width up). OR16 is not a real task;
  // it is drawn here (gate-OR16) to show what the learner will need to build.
  function mux16NotAndOrSolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("MUX16"), x: 640, y: 288 },
      { id: "ctrl-merge", type: "splitter", x: 460, y: 345, mirrored: true, outputs: 16, width: 1 },
      { id: "not16-c", type: "gate-Not16", x: 610, y: 165 },
      { id: "and16-1", type: "gate-AND16", x: 745, y: 225 },
      { id: "and16-2", type: "gate-AND16", x: 745, y: 400 },
      { id: "or16-1", type: "gate-OR16", x: 850, y: 315 }
    ];
    const wires = [
      normalizeWire("ctrl-merge.single", "not16-c.in1"),
      normalizeWire("not16-c.out", "and16-1.in1"),
      normalizeWire("task-card-1.inputInt1", "and16-1.in2"),
      normalizeWire("ctrl-merge.single", "and16-2.in1"),
      normalizeWire("task-card-1.inputInt2", "and16-2.in2"),
      normalizeWire("and16-1.out", "or16-1.in1"),
      normalizeWire("and16-2.out", "or16-1.in2"),
      normalizeWire("or16-1.out", "task-card-1.outputInt")
    ];
    // fan the single control bit into all 16 legs of the merging splitter
    for (let i = 0; i < 16; i += 1) wires.push(normalizeWire("task-card-1.inputInt3", `ctrl-merge.leg${i}`));
    return busSolutionWorkspace("MUX16", components, wires);
  }

  // Dmux4way: split the 2-bit control bus; a DMUX tree routes the input — the
  // first DMUX (control = MSB / "first bit") picks the pair of outputs, and a
  // second DMUX in each branch (control = LSB) picks within the pair.
  function dmux4waySolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Dmux4way"), x: 640, y: 288 },
      { id: "ctrl-split", type: "splitter", x: 545, y: 150, mirrored: false, outputs: 2, width: 1 },
      { id: "dmux-a", type: "gate-DMux", x: 590, y: 300 },
      { id: "dmux-b", type: "gate-DMux", x: 775, y: 205 },
      { id: "dmux-c", type: "gate-DMux", x: 775, y: 395 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt2", "ctrl-split.single"),
      normalizeWire("task-card-1.inputInt1", "dmux-a.in1"),
      normalizeWire("ctrl-split.leg1", "dmux-a.in2"),
      normalizeWire("dmux-a.out1", "dmux-b.in1"),
      normalizeWire("dmux-a.out2", "dmux-c.in1"),
      normalizeWire("ctrl-split.leg0", "dmux-b.in2"),
      normalizeWire("ctrl-split.leg0", "dmux-c.in2"),
      normalizeWire("dmux-b.out1", "task-card-1.outputInt1"),
      normalizeWire("dmux-b.out2", "task-card-1.outputInt2"),
      normalizeWire("dmux-c.out1", "task-card-1.outputInt3"),
      normalizeWire("dmux-c.out2", "task-card-1.outputInt4")
    ];
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "Dmux4way", taskIntroSeen: true
    });
  }

  // Mux4way16: split the 2-bit control bus; a MUX16 tree selects the output —
  // two first-level MUX16 choose within each pair by the LSB, and a final
  // MUX16 chooses between the pairs by the MSB ("first bit").
  function mux4way16SolutionFrom() {
    const components = [
      { id: "source-1", type: "source", x: 65, y: 288 },
      { id: "task-card-1", type: taskCardComponentType("Mux4way16"), x: 640, y: 288 },
      { id: "ctrl-split", type: "splitter", x: 520, y: 128, mirrored: false, outputs: 2, width: 1 },
      { id: "mux-lo", type: "gate-MUX16", x: 630, y: 205 },
      { id: "mux-hi", type: "gate-MUX16", x: 630, y: 385 },
      { id: "mux-fin", type: "gate-MUX16", x: 805, y: 295 }
    ];
    const wires = [
      normalizeWire("task-card-1.inputInt5", "ctrl-split.single"),
      normalizeWire("task-card-1.inputInt1", "mux-lo.in1"),
      normalizeWire("task-card-1.inputInt2", "mux-lo.in2"),
      normalizeWire("ctrl-split.leg0", "mux-lo.in3"),
      normalizeWire("task-card-1.inputInt3", "mux-hi.in1"),
      normalizeWire("task-card-1.inputInt4", "mux-hi.in2"),
      normalizeWire("ctrl-split.leg0", "mux-hi.in3"),
      normalizeWire("mux-lo.out", "mux-fin.in1"),
      normalizeWire("mux-hi.out", "mux-fin.in2"),
      normalizeWire("ctrl-split.leg1", "mux-fin.in3"),
      normalizeWire("mux-fin.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace({
      ...createDefaultWorkspace(),
      components, wires, nextId: 2, unlocked: true, helpPromptSeen: true,
      buildHelpButtonVisible: false, understoodPromptShown: false, understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false }, nandMonologueStep: null,
      workspaceCompleted: false, workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      taskId: "Mux4way16", taskIntroSeen: true
    });
  }

  function solutionWorkspaceForTask(taskId, step = 0) {
    if (taskId === "halfAdder") return halfAdderSolutionFrom();
    if (taskId === "fullAdder") return fullAdderSolutionFrom();
    if (taskId === "Add4") return add4SolutionFrom();
    if (taskId === "Dmux4way") return dmux4waySolutionFrom();
    if (taskId === "Mux4way16") return mux4way16SolutionFrom();
    if (taskId === "Not4") return not4SolutionWorkspaceFrom();
    if (taskId === "Not16") return step >= 3 ? not16DirectSolutionFrom() : not16SolutionWorkspaceFrom();
    if (taskId === "AND4") return and4SolutionWorkspaceFrom();
    if (taskId === "OR4") return step >= 3 ? or4NotAndSolutionFrom() : or4SolutionWorkspaceFrom();
    if (taskId === "AND16") return step >= 3 ? and16DirectSolutionFrom() : and16SolutionWorkspaceFrom();
    if (taskId === "MUX4") return step >= 3 ? mux4NotAndOrSolutionFrom() : mux4SolutionWorkspaceFrom();
    if (taskId === "MUX16") return step >= 3 ? mux16NotAndOrSolutionFrom() : mux16SolutionWorkspaceFrom();
    if (taskId === "Mux") return muxSolutionWorkspaceFrom(step);
    if (taskId === "DMux") return dmuxSolutionFrom();
    if (taskId === "Not") return notSolutionWorkspaceFrom();
    if (taskId === "And") return andSolutionWorkspaceFrom();
    if (taskId === "Or") return orSolutionWorkspaceFrom(step);
    if (taskId === "Xor") return xorSolutionWorkspaceFrom(step);
    if (taskId === "AND3way") return and3waySolutionWorkspaceFrom();
    if (taskId === "OR4way") return or4waySolutionWorkspaceFrom(step);
    return standardTaskWorkspace(taskId);
  }

  return { standardTaskWorkspace, cleanedWorkspaceForTaskTest, workspaceForTaskTestRow, solutionWorkspaceForTask };
}

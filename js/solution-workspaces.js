// solution-workspaces.js — builders that assemble complete workbench layouts as
// DATA, extracted from app.js: the reference solution for each task (Not, And,
// Or, Xor, AND3way, OR4way, including the alternative NAND-based / balanced
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
  secondWorkspaceExitTarget,
  TASK_TEST_FRAME
}) {
  function notTaskFrameContainsComponent(component) {
    if (!component) return false;
    if (["source-1", "lamp-1", "task-card-1"].includes(component.id)) return true;
    return component.x >= TASK_TEST_FRAME.x1 && component.x <= TASK_TEST_FRAME.x2 && component.y >= TASK_TEST_FRAME.y1 && component.y <= TASK_TEST_FRAME.y2;
  }

  function cleanedWorkspaceForTaskTest(sourceWorkspace) {
    const workspace = normalizeWorkspace(clonePlain(sourceWorkspace));
    workspace.components = workspace.components.filter(notTaskFrameContainsComponent);
    workspace.selectedTerminal = null;
    workspace.accident = null;
    removeInvalidWires(workspace);
    addTestWire(workspace, taskCardOutputExtRef(), "lamp-1.in");
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

    removeWiresAt(workspace, "lamp-1.in");
    addTestWire(workspace, taskCardOutputExtRef(), "lamp-1.in");

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
        { id: "source-1", type: "source", x: 80, y: 288 },
        { id: "task-card-1", type: taskCardComponentType(task.id), x: 500, y: 288 },
        { id: "lamp-1", type: "lamp", x: 910, y: 258 }
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
      { id: "not-c", type: "gate-Not", x: 410, y: 150 },
      { id: "and-1", type: "gate-And", x: 480, y: 235 },
      { id: "and-2", type: "gate-And", x: 480, y: 410 },
      { id: "or-1", type: "gate-Or", x: 650, y: 320 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt3", "not-c.in1"),
      normalizeWire("task-card-1.inputInt1", "and-1.in1"),
      normalizeWire("not-c.out", "and-1.in2"),
      normalizeWire("task-card-1.inputInt2", "and-2.in1"),
      normalizeWire("task-card-1.inputInt3", "and-2.in2"),
      normalizeWire("and-1.out", "or-1.in1"),
      normalizeWire("and-2.out", "or-1.in2"),
      normalizeWire("or-1.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  // MUX — the generic truth-table (minterm) solution: one AND term per row that
  // outputs 1, all combined with an OR. The four 1-rows are:
  //   m1: in1 & ~in2 & ~c   m2: in1 & in2 & ~c
  //   m3: ~in1 & in2 & c     m4: in1 & in2 & c
  function muxGenericSolutionFrom() {
    const workspace = standardTaskWorkspace("Mux");
    workspace.components.push(
      { id: "not-c", type: "gate-Not", x: 430, y: 160 },
      { id: "not-in1", type: "gate-Not", x: 340, y: 235 },
      { id: "not-in2", type: "gate-Not", x: 340, y: 335 },
      { id: "and-m1", type: "gate-AND3way", x: 545, y: 180 },
      { id: "and-m2", type: "gate-AND3way", x: 545, y: 275 },
      { id: "and-m3", type: "gate-AND3way", x: 545, y: 375 },
      { id: "and-m4", type: "gate-AND3way", x: 545, y: 470 },
      { id: "or-final", type: "gate-OR4way", x: 690, y: 300 }
    );
    workspace.wires = [
      normalizeWire("task-card-1.inputInt2", "not-in2.in1"),
      normalizeWire("task-card-1.inputInt1", "not-in1.in1"),
      normalizeWire("task-card-1.inputInt3", "not-c.in1"),
      normalizeWire("task-card-1.inputInt1", "and-m1.in1"),
      normalizeWire("not-in2.out", "and-m1.in2"),
      normalizeWire("not-c.out", "and-m1.in3"),
      normalizeWire("task-card-1.inputInt1", "and-m2.in1"),
      normalizeWire("task-card-1.inputInt2", "and-m2.in2"),
      normalizeWire("not-c.out", "and-m2.in3"),
      normalizeWire("not-in1.out", "and-m3.in1"),
      normalizeWire("task-card-1.inputInt2", "and-m3.in2"),
      normalizeWire("task-card-1.inputInt3", "and-m3.in3"),
      normalizeWire("task-card-1.inputInt1", "and-m4.in1"),
      normalizeWire("task-card-1.inputInt2", "and-m4.in2"),
      normalizeWire("task-card-1.inputInt3", "and-m4.in3"),
      normalizeWire("and-m1.out", "or-final.in1"),
      normalizeWire("and-m2.out", "or-final.in2"),
      normalizeWire("and-m3.out", "or-final.in3"),
      normalizeWire("and-m4.out", "or-final.in4"),
      normalizeWire("or-final.out", "task-card-1.outputInt")
    ];
    return normalizeWorkspace(workspace);
  }

  // Steps 0..5 walk the generic minterm solution; from step 6 ("פתרון נוסף")
  // the compact solution is shown.
  function muxSolutionWorkspaceFrom(step = 0) {
    return step >= 6 ? muxCompactSolutionFrom() : muxGenericSolutionFrom();
  }

  function solutionWorkspaceForTask(taskId, step = 0) {
    if (taskId === "Mux") return muxSolutionWorkspaceFrom(step);
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

(() => {
  const app = document.getElementById("app");

  const WORKSPACE_COMPONENT_DEFS = {
    source: {
      label: "מקור מתח",
      pins: {
        out: { x: 46, y: 0, direction: "out", label: "פין מקור מתח" }
      },
      bounds: { left: 34, right: 52, top: 46, bottom: 46 }
    },
    nand: {
      label: "NAND",
      pins: {
        in1: { x: -60, y: -24, direction: "in", label: "כניסת NAND עליונה" },
        in2: { x: -60, y: 24, direction: "in", label: "כניסת NAND תחתונה" },
        out: { x: 80, y: 0, direction: "out", label: "יציאת NAND" }
      },
      bounds: { left: 64, right: 84, top: 46, bottom: 46 }
    },
    lamp: {
      label: "מנורה",
      pins: {
        in: { x: 0, y: 30, direction: "in", label: "כניסת מנורה" }
      },
      bounds: { left: 38, right: 38, top: 78, bottom: 34 }
    },
    notCard: {
      label: "מסגרת NOT",
      fixed: true,
      pins: {
        inputExt: { x: -340, y: 0, direction: "in", label: "כניסת NOT חיצונית" },
        inputInt: { x: -260, y: 0, direction: "out", label: "כניסת NOT פנימית" },
        outputInt: { x: 260, y: 0, direction: "in", label: "יציאת NOT פנימית" },
        outputExt: { x: 340, y: 0, direction: "out", label: "יציאת NOT חיצונית" }
      },
      bounds: { left: 340, right: 340, top: 190, bottom: 190 }
    }
  };


  // TASK_DEFS moved to js/app-data.js

  function taskDefById(taskId) {
    return TASK_DEFS.find((task) => task.id === taskId)
      || ROUTING_TASK_DEFS.find((task) => task.id === taskId && Number.isInteger(task.inputs))
      || null;
  }

  function taskInputYs(inputCount) {
    if (inputCount === 1) return [0];
    if (inputCount === 2) return [-70, 70];
    if (inputCount === 3) return [-110, 0, 110];
    return [-135, -45, 45, 135];
  }

  function gateInputYs(inputCount) {
    if (inputCount === 1) return [0];
    if (inputCount === 2) return [-23, 23];
    if (inputCount === 3) return [-27, 0, 27];
    return [-30, -10, 10, 30];
  }

  function taskCardComponentType(taskId) {
    return `taskCard-${taskId}`;
  }

  function gateComponentType(taskId) {
    return `gate-${taskId}`;
  }

  // taskOutput moved to js/circuit-engine.js

  // SVG_PIN_FALLBACKS moved to js/app-data.js

  function svgPinFallback(type, pinId) {
    return SVG_PIN_FALLBACKS[type]?.[pinId] || null;
  }

  for (const task of TASK_DEFS) {
    const cardPins = {};
    taskInputYs(task.inputs).forEach((y, index) => {
      const label = task.inputs === 1 ? "" : ` ${index + 1}`;
      cardPins[`inputExt${index + 1}`] = { x: -340, y, direction: "in", label: `כניסת ${task.label}${label} חיצונית` };
      cardPins[`inputInt${index + 1}`] = { x: -260, y, direction: "out", label: `כניסת ${task.label}${label} פנימית` };
    });
    cardPins.outputInt = { x: 260, y: 0, direction: "in", label: `יציאת ${task.label} פנימית` };
    cardPins.outputExt = { x: 340, y: 0, direction: "out", label: `יציאת ${task.label} חיצונית` };
    WORKSPACE_COMPONENT_DEFS[taskCardComponentType(task.id)] = {
      label: `מסגרת ${task.label}`,
      fixed: true,
      taskId: task.id,
      pins: cardPins,
      bounds: { left: 340, right: 340, top: 190, bottom: 190 }
    };

    const gatePins = {};
    const gateType = gateComponentType(task.id);
    gateInputYs(task.inputs).forEach((y, index) => {
      const pinId = `in${index + 1}`;
      const fallback = svgPinFallback(gateType, pinId);
      const label = task.inputs === 1 ? "" : ` ${index + 1}`;
      gatePins[pinId] = {
        x: Number.isFinite(fallback?.x) ? fallback.x : -60,
        y: Number.isFinite(fallback?.y) ? fallback.y : y,
        direction: "in",
        label: `כניסת ${task.label}${label}`
      };
    });
    const outFallback = svgPinFallback(gateType, "out");
    gatePins.out = {
      x: Number.isFinite(outFallback?.x) ? outFallback.x : 80,
      y: Number.isFinite(outFallback?.y) ? outFallback.y : 0,
      direction: "out",
      label: `יציאת ${task.label}`
    };
    const allGatePinYs = Object.values(gatePins).map((pin) => Math.abs(pin.y || 0));
    const maxInputY = Math.max(0, ...allGatePinYs);
    WORKSPACE_COMPONENT_DEFS[gateType] = {
      label: task.label,
      taskId: task.id,
      gate: true,
      pins: gatePins,
      bounds: { left: 64, right: 84, top: maxInputY + 36, bottom: maxInputY + 36 }
    };
  }

  // The MUX card (chapter 2.3) needs a layout the generic generator can't
  // express: two numbered data inputs on the LEFT and the control input on TOP.
  // inputExt1/2 (left) are data inputs #1/#2; inputExt3 (top) is the control.
  {
    const mux = ROUTING_TASK_DEFS.find((task) => task.id === "Mux");
    if (mux) {
      WORKSPACE_COMPONENT_DEFS[taskCardComponentType(mux.id)] = {
        label: `מסגרת ${mux.label}`,
        fixed: true,
        taskId: mux.id,
        pins: {
          // Data inputs 1/2 on the LEFT: a short external stub that pokes out of
          // the frame (x=-375 → board 125, frame edge at 150) and a shortened
          // internal stub (x=-300 → board 200). The control (top) already pokes
          // out above the frame. The output on the RIGHT likewise pokes out
          // (x=375 → board 875, frame edge at 850).
          inputExt1: { x: -375, y: -100, direction: "in", label: "כניסת MUX 1 חיצונית" },
          inputInt1: { x: -325, y: -100, direction: "out", label: "כניסת MUX 1 פנימית" },
          inputExt2: { x: -375, y: 100, direction: "in", label: "כניסת MUX 2 חיצונית" },
          inputInt2: { x: -325, y: 100, direction: "out", label: "כניסת MUX 2 פנימית" },
          inputExt3: { x: -200, y: -248, direction: "in", label: "כניסת בקרה חיצונית" },
          inputInt3: { x: -200, y: -208, direction: "out", label: "כניסת בקרה פנימית" },
          outputInt: { x: 300, y: 0, direction: "in", label: "יציאת MUX פנימית" },
          outputExt: { x: 375, y: 0, direction: "out", label: "יציאת MUX חיצונית" }
        },
        bounds: { left: 380, right: 380, top: 270, bottom: 240 }
      };
    }
  }

  // The DMUX card (chapter 2.3): the mirror image of the MUX — one data input on
  // the LEFT, the control input on TOP, and TWO outputs stacked on the RIGHT.
  // inputExt1 (left) is the data input; inputExt2 (top) is the control.
  {
    const dmux = ROUTING_TASK_DEFS.find((task) => task.id === "DMux");
    if (dmux) {
      WORKSPACE_COMPONENT_DEFS[taskCardComponentType(dmux.id)] = {
        label: `מסגרת ${dmux.label}`,
        fixed: true,
        taskId: dmux.id,
        pins: {
          inputExt1: { x: -375, y: 0, direction: "in", label: "כניסת DMUX חיצונית" },
          inputInt1: { x: -325, y: 0, direction: "out", label: "כניסת DMUX פנימית" },
          inputExt2: { x: -200, y: -248, direction: "in", label: "כניסת בקרה חיצונית" },
          inputInt2: { x: -200, y: -208, direction: "out", label: "כניסת בקרה פנימית" },
          outputInt1: { x: 300, y: -100, direction: "in", label: "יציאת DMUX 1 פנימית" },
          outputExt1: { x: 375, y: -100, direction: "out", label: "יציאת DMUX 1 חיצונית" },
          outputInt2: { x: 300, y: 100, direction: "in", label: "יציאת DMUX 2 פנימית" },
          outputExt2: { x: 375, y: 100, direction: "out", label: "יציאת DMUX 2 חיצונית" }
        },
        bounds: { left: 380, right: 380, top: 270, bottom: 240 }
      };
    }
  }


  // DEFAULT_WORKSPACE_COMPONENTS moved to js/app-data.js

  // OLD_TERMINAL_REFS moved to js/app-data.js

  function cloneDefaultComponents() {
    return DEFAULT_WORKSPACE_COMPONENTS.map((component) => ({ ...component }));
  }

  function createDefaultWorkspace() {
    return {
      selectedTerminal: null,
      components: cloneDefaultComponents(),
      wires: [],
      nextId: 2,
      unlocked: false,
      accident: null,
      helpPromptSeen: false,
      buildHelpButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandMonologueStep: null,
      workspaceLaunchPanelIndex: null,
      workspaceCompleted: false,
      workspaceSession: 0,
      exitTargetPanelIndex: null,
      returnToWorkspaceAfterMonologue: false,
      sessionReturnChapterId: null,
      sessionReturnPanelIndex: null,
      taskId: null,
      taskIntroSeen: false,
      freeBuild: false
    };
  }

  const defaultState = {
    screen: "menu",
    chapterId: CHAPTERS[0].id,
    sceneId: CHAPTERS[0].sceneId,
    panelIndex: 0,
    soundOn: false,
    started: false,
    replayNonce: 0,
    dialog: null,
    taskDialog: null,
    notTest: null,
    hintDialog: null,
    hintSlides: null,
    solutionDialog: null,
    solutionTableHidden: false,
    bitDialog: null,
    bitInfoUnlocked: false,
    xorTableHelpUnlocked: false,
    postTasksXorHintShown: false,
    hintState: {},
    completedTasks: [],
    explanationsUnlocked: [],
    explanationsReturnTo: null,
    explanationReplay: null,
    workspace: createDefaultWorkspace()
  };

  // Component & terminal structure model lives in js/component-model.js. Created
  // first (the wiring, circuit, and state models below all build on it) with a
  // live reference to the component-definition table. Thin wrappers keep every
  // existing call site unchanged.
  const __componentModel = createComponentModel({ componentDefs: WORKSPACE_COMPONENT_DEFS });
  const componentDef = (...args) => __componentModel.componentDef(...args);
  const splitTerminalRef = (...args) => __componentModel.splitTerminalRef(...args);
  const componentById = (...args) => __componentModel.componentById(...args);
  const pinDefFor = (...args) => __componentModel.pinDefFor(...args);
  const terminalExists = (...args) => __componentModel.terminalExists(...args);
  const terminalDirection = (...args) => __componentModel.terminalDirection(...args);
  const isNandOutputRef = (...args) => __componentModel.isNandOutputRef(...args);

  // Wiring rules live in js/workbench-model.js. Create the model (its deps are
  // hoisted host functions) BEFORE loadState(), since normalizeWorkspace() uses
  // canAddWire during load. Thin wrappers keep every existing call site unchanged.
  const __workbenchModel = createWorkbenchModel({
    terminalDirection, terminalExists, splitTerminalRef, componentById,
    componentGraphHasPath, normalizeWire, isNandOutputRef
  });
  const canAddWire = (...args) => __workbenchModel.canAddWire(...args);
  const inputRefOf = (...args) => __workbenchModel.inputRefOf(...args);
  const outputRefOf = (...args) => __workbenchModel.outputRefOf(...args);
  const dangerousPowerWireInfo = (...args) => __workbenchModel.dangerousPowerWireInfo(...args);

  // Board geometry (pin positions + component-position clamping) lives in
  // js/board-geometry.js. Created before workspace-state, which injects
  // clampComponentPosition into its normalizer. workspaceBoardSize (DOM) stays
  // in this file and is injected.
  // From chapter 2.3 onward, built-gate cards are drawn at 60% size to keep the
  // busier circuits (and the MUX solution) readable. Chapter 2.2 keeps gates at
  // full size. Scaling at render time leaves pin data, the circuit check and
  // the toolbar icons untouched.
  const GATE_RENDER_SCALE = 0.6;
  function componentRenderScale(type) {
    if (!String(type || "").startsWith("gate-")) return 1;
    return isPastSimpleGatesChapter() ? GATE_RENDER_SCALE : 1;
  }

  const __boardGeometry = createBoardGeometry({ pinDefFor, componentDef, workspaceBoardSize, componentRenderScale });
  const terminalPosition = (...args) => __boardGeometry.terminalPosition(...args);
  const clampComponentPosition = (...args) => __boardGeometry.clampComponentPosition(...args);

  // Workspace state normalization lives in js/workspace-state.js. Created here
  // (after canAddWire, before loadState) because loadState() calls
  // normalizeWorkspace. createDefaultWorkspace/cloneDefaultComponents stay in
  // this file (defaultState uses them earlier) and are injected.
  const __workspaceState = createWorkspaceState({
    componentDef, clampComponentPosition, migrateTerminalRef, canonicalTaskFrameWire,
    wireKey, componentById, terminalExists, canAddWire, normalizeWire,
    createDefaultWorkspace, cloneDefaultComponents
  });
  const normalizeWorkspace = (...args) => __workspaceState.normalizeWorkspace(...args);

  let state = loadState();
  let dragState = null;
  let dialogDragState = null;
  let suppressNextClick = false;

  // Circuit-simulation engine lives in js/circuit-engine.js. We inject the two
  // host dependencies it needs (terminalDirection, taskDefById); taskOutput and
  // otherWireEnd are pure globals from that file. The thin wrappers below keep
  // every existing call site (and evaluateWorkspace's default arg) unchanged.
  const __circuitEngine = createCircuitEngine({ terminalDirection, taskDefById });
  const connectedOutputRefs = (workspace, inputRef, outputs) => __circuitEngine.connectedOutputRefs(workspace, inputRef, outputs);
  const inputSignal = (workspace, inputRef, outputs) => __circuitEngine.inputSignal(workspace, inputRef, outputs);
  const evaluateWorkspace = (workspace = state.workspace) => __circuitEngine.evaluateWorkspace(workspace);

  // Component SVG markup lives in js/component-visuals.js (deps injected: esc,
  // gateComponentType, taskDefById). Thin wrappers keep every call site unchanged.
  const __componentVisuals = createComponentVisuals({ esc, gateComponentType, taskDefById });
  const componentSvgFilenameForType = (...args) => __componentVisuals.componentSvgFilenameForType(...args);
  const componentMarkup = (...args) => __componentVisuals.componentMarkup(...args);
  const smokeMarkup = (...args) => __componentVisuals.smokeMarkup(...args);
  const charredNandMarkup = (...args) => __componentVisuals.charredNandMarkup(...args);

  // Board content markup (wires, terminals, placed components) lives in
  // js/board-render.js. Its builders take the workspace explicitly; the wrappers
  // below pass state.workspace so existing call sites stay unchanged.
  const __boardRender = createBoardRender({
    solutionHighlightConfig, terminalPosition, wireKey, esc, componentDef,
    componentMarkup, charredNandMarkup, smokeMarkup, isFixedWorkspaceComponent,
    componentRenderScale
  });
  const renderWires = () => __boardRender.renderWires(state.workspace);
  const renderTerminals = () => __boardRender.renderTerminals(state.workspace);
  const renderComponent = (component, evaluation) => __boardRender.renderComponent(component, evaluation, state.workspace);

  // Wire operations (reachability, pruning, test wires, click-to-toggle rule)
  // live in js/wire-ops.js and operate purely on a workspace. The withWorkspace/
  // setState plumbing that calls them stays in this file.
  const __wireOps = createWireOps({
    otherWireEnd, splitTerminalRef, terminalExists, inputRefOf, wireKey,
    normalizeWire, canonicalTaskFrameWire, canAddWire
  });
  const connectedTerminals = (...args) => __wireOps.connectedTerminals(...args);
  const removeInvalidWires = (...args) => __wireOps.removeInvalidWires(...args);
  const removeWiresAt = (...args) => __wireOps.removeWiresAt(...args);
  const addTestWire = (...args) => __wireOps.addTestWire(...args);
  const applyWireToggle = (...args) => __wireOps.applyWireToggle(...args);

  // Accident detection + NAND-output observation live in js/accident-observation.js
  // (deps injected). Created after wire-ops (it uses connectedTerminals). Thin
  // wrappers keep existing call sites unchanged.
  const __accidentObservation = createAccidentObservation({
    evaluateWorkspace, connectedTerminals, terminalDirection, otherWireEnd, isNandOutputRef
  });
  const detectWorkspaceAccident = (...args) => __accidentObservation.detectWorkspaceAccident(...args);
  const updateNandOutputObservation = (...args) => __accidentObservation.updateNandOutputObservation(...args);

  // Tool palette markup lives in js/toolbar-view.js (deps injected). Thin wrapper
  // keeps the existing renderWorkspace call site unchanged.
  const __toolbarView = createToolbarView({ toolbarGateToolIds, taskDefById, gateComponentType, componentMarkup, esc, isNandPresentationWorkspace });
  const renderToolbar = (...args) => __toolbarView.renderToolbar(...args);

  // Workbench-screen buttons and prompt overlays live in js/workspace-chrome-view.js.
  // They read live state via getState() and injected predicates. Thin wrappers
  // keep existing call sites unchanged.
  const __workspaceChromeView = createWorkspaceChromeView({
    getState: () => state,
    workspaceBuildHelpPromptActive, workspaceUnderstoodPromptActive, workspaceSkipDisabled
  });
  const renderWorkspaceAccidentModal = (...a) => __workspaceChromeView.renderWorkspaceAccidentModal(...a);
  const renderWorkspaceBuildHelpPrompt = (...a) => __workspaceChromeView.renderWorkspaceBuildHelpPrompt(...a);
  const renderWorkspaceBuildHelpButton = (...a) => __workspaceChromeView.renderWorkspaceBuildHelpButton(...a);
  const renderWorkspaceUnderstoodButton = (...a) => __workspaceChromeView.renderWorkspaceUnderstoodButton(...a);
  const renderWorkspaceReturnButton = (...a) => __workspaceChromeView.renderWorkspaceReturnButton(...a);
  const renderWorkspaceSkipButton = (...a) => __workspaceChromeView.renderWorkspaceSkipButton(...a);
  const renderWorkspaceUnderstoodPrompt = (...a) => __workspaceChromeView.renderWorkspaceUnderstoodPrompt(...a);

  // NAND monologue speech + truth table markup live in js/nand-monologue-view.js.
  const __nandMonologueView = createNandMonologueView({
    getState: () => state, esc, workspaceNandMonologueActive, NAND_MONOLOGUE_TEXTS
  });
  const renderWorkspaceNandMonologue = (...a) => __nandMonologueView.renderWorkspaceNandMonologue(...a);

  // Task-building UI (shell/intro/hint/check) lives in js/task-mode-view.js.
  const __taskModeView = createTaskModeView({
    getState: () => state, esc, taskDefById, taskInputYs, solutionHighlightConfig,
    isNotTaskWorkspace, workspaceTaskIntroActive, notTestActive
  });
  const renderWorkspaceTaskShell = (...a) => __taskModeView.renderWorkspaceTaskShell(...a);
  const renderWorkspaceTaskIntro = (...a) => __taskModeView.renderWorkspaceTaskIntro(...a);
  const renderNotTaskHint = (...a) => __taskModeView.renderNotTaskHint(...a);
  const renderNotTaskCheckButton = (...a) => __taskModeView.renderNotTaskCheckButton(...a);

  // Workbench launch/exit navigation lives in js/workspace-navigation.js. Created
  // here so its secondWorkspaceExitTarget wrapper is available to later modules.
  const __workspaceNavigation = createWorkspaceNavigation({
    getState: () => state, currentScene, currentChapter, currentPanel, simpleGatesChapter,
    sceneByChapter, chapterById, panelIndexByImage, storyTarget, normalizeWorkspace, isWorkspaceLaunchPanel
  });
  const workspaceLaunchPanelIndex = (...a) => __workspaceNavigation.workspaceLaunchPanelIndex(...a);
  const firstWorkspaceExitTarget = (...a) => __workspaceNavigation.firstWorkspaceExitTarget(...a);
  const secondWorkspaceExitTarget = (...a) => __workspaceNavigation.secondWorkspaceExitTarget(...a);
  const workspaceWarehouseTarget = (...a) => __workspaceNavigation.workspaceWarehouseTarget(...a);
  const isWorkspaceLaunchPoint = (...a) => __workspaceNavigation.isWorkspaceLaunchPoint(...a);


  function workspaceAccidentActive() {
    return state.screen === "workspace" && state.workspace?.accident?.type === "nand-overvoltage";
  }

  function workspaceBuildHelpPromptActive() {
    return (
      state.screen === "workspace" &&
      state.chapterId === "chapter-4" &&
      !workspaceAccidentActive() &&
      !state.workspace?.helpPromptSeen
    );
  }

  function workspaceUnderstoodPromptActive() {
    return (
      state.screen === "workspace" &&
      !workspaceAccidentActive() &&
      !workspaceBuildHelpPromptActive() &&
      Boolean(state.workspace?.understoodPromptShown)
    );
  }

  function workspaceNandMonologueActive() {
    return state.screen === "workspace" && Number.isInteger(state.workspace?.nandMonologueStep);
  }

  function workspaceTaskId() {
    return state.screen === "workspace" ? state.workspace?.taskId || null : null;
  }

  function isNotTaskWorkspace() {
    return Boolean(taskDefById(workspaceTaskId()));
  }

  // The workbench has three variants. This is the first one: "הצגת הנאנד" — the
  // NAND-presentation workbench (default source+NAND+lamp, the observe/"הבנת?"/
  // monologue flow). The other two are the task-card build (taskId set) and the
  // "empty table" free build (freeBuild set). Toolbar contents and the ability to
  // short the NAND both depend on being in this mode.
  function isNandPresentationWorkspace() {
    return (
      state.screen === "workspace" &&
      !workspaceTaskId() &&
      !state.workspace?.freeBuild
    );
  }

  function isFixedWorkspaceComponent(component) {
    if (!component) return false;
    if (componentDef(component.type)?.fixed) return true;
    return isNotTaskWorkspace() && ["source-1", "lamp-1"].includes(component.id);
  }

  function workspaceTaskIntroActive() {
    return (
      state.screen === "workspace" &&
      workspaceTaskId() === "Not" &&
      !workspaceAccidentActive() &&
      !workspaceBuildHelpPromptActive() &&
      !workspaceUnderstoodPromptActive() &&
      !workspaceNandMonologueActive() &&
      !state.workspace?.taskIntroSeen
    );
  }

  function notTestActive() {
    return state.screen === "workspace" && Boolean(state.notTest?.active || state.notTest?.result);
  }

  function workspaceInteractionLocked() {
    return (
      workspaceAccidentActive() ||
      workspaceBuildHelpPromptActive() ||
      workspaceUnderstoodPromptActive() ||
      workspaceTaskIntroActive() ||
      notTestActive() ||
      Boolean(state.hintDialog) ||
      Boolean(state.hintSlides) ||
      Boolean(state.solutionDialog) ||
      workspaceNandMonologueActive()
    );
  }

  function transientUiClearPatch() {
    return {
      dialog: null,
      taskDialog: null,
      hintDialog: null,
      hintSlides: null,
      solutionDialog: null,
      bitDialog: null,
      notTest: null
    };
  }

  function isGlobalNavigationAction(action) {
    return ["menu", "chapters", "about", "explanations", "explanations-return", "explanation-open", "explanations-return-to-menu", "explanation-prev", "explanation-next", "exit", "start", "continue", "chapter", "reset-progress", "workspace-return-warehouse", "workspace-reset", "nand-monologue-prev"].includes(action);
  }

  // FALLBACK_END_DIALOGS moved to js/app-data.js

  function endDialogs() {
    if (typeof END_DIALOGS === "undefined") return FALLBACK_END_DIALOGS;
    return { ...FALLBACK_END_DIALOGS, ...END_DIALOGS };
  }

  function chapterById(chapterId) {
    return CHAPTERS.find((c) => c.id === chapterId) || CHAPTERS[0];
  }

  function sceneByChapter(chapter) {
    return SCENES[chapter.sceneId];
  }

  function chapterStartState(chapterId) {
    const chapter = chapterById(chapterId);
    const scene = sceneByChapter(chapter);
    return {
      screen: "story",
      chapterId: chapter.id,
      sceneId: scene.id,
      panelIndex: 0,
      started: true,
      dialog: null,
      workspace: createDefaultWorkspace()
    };
  }

  function migrateTerminalRef(ref) {
    return OLD_TERMINAL_REFS[ref] || ref;
  }

  function workspaceBoardSize() {
    const board = app.querySelector("[data-workspace-board]");
    if (!board) return { width: 1000, height: 600 };
    const rect = board.getBoundingClientRect();
    return {
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height)
    };
  }

  // normalizeComponent and normalizeWorkspace live in js/workspace-state.js
  // (wired above as __workspaceState; normalizeWorkspace is wrapped there).

  function loadState() {
    try {
      const raw = localStorage.getItem(APP.storageKey);
      const loaded = raw ? { ...defaultState, ...JSON.parse(raw), soundOn: false } : { ...defaultState };
      const normalized = normalizeLoadedState(loaded);
      localStorage.setItem(APP.storageKey, JSON.stringify(stateForStorageValue(normalized)));
      return normalized;
    } catch {
      const fallback = { ...defaultState };
      try {
        localStorage.setItem(APP.storageKey, JSON.stringify(fallback));
      } catch {}
      return fallback;
    }
  }

  function normalizeLoadedState(loaded) {
    const chapter = chapterById(loaded.chapterId);
    const scene = SCENES[loaded.sceneId] || sceneByChapter(chapter);
    const maxPanelIndex = Math.max(scene.panels.length - 1, 0);
    const panelIndex = Number.isInteger(loaded.panelIndex)
      ? Math.min(Math.max(loaded.panelIndex, 0), maxPanelIndex)
      : 0;
    const screen = ["menu", "chapters", "story", "workspace", "nandBuildHelp", "about", "explanations"].includes(loaded.screen) ? loaded.screen : defaultState.screen;
    const workspace = normalizeWorkspace(loaded.workspace);

    if (loaded.dialog) {
      return {
        ...loaded,
        ...chapterStartState(chapter.id),
        soundOn: false,
        replayNonce: Number.isInteger(loaded.replayNonce) ? loaded.replayNonce : 0,
        workspace
      };
    }

    const chapter4Scene = SCENES["nand-workshop-1943"];
    const workspaceAllowed = (
      chapter.id === "chapter-4" && (workspace.unlocked || panelIndex >= chapter4Scene.panels.length - 1)
    ) || (
      (chapter.id === "chapter-5" || chapter.id === "chapter-6") && workspace.unlocked
    );

    return {
      ...loaded,
      screen: (["workspace", "nandBuildHelp"].includes(screen) && !workspaceAllowed) ? "story" : screen,
      chapterId: chapter.id,
      sceneId: scene.id,
      panelIndex,
      soundOn: false,
      dialog: null,
      taskDialog: null,
      notTest: null,
      hintDialog: null,
      hintSlides: null,
      solutionDialog: null,
      hintState: loaded.hintState && typeof loaded.hintState === "object" ? loaded.hintState : {},
      workspace
    };
  }

  function stateForStorageValue(value) {
    const workspace = normalizeWorkspace(value.workspace);
    workspace.selectedTerminal = null;
    return { ...value, soundOn: false, dialog: null, taskDialog: null, notTest: null, hintDialog: null, hintSlides: null, solutionDialog: null, bitDialog: null, workspace };
  }

  function stateForStorage() {
    return stateForStorageValue(state);
  }

  function saveState() {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(stateForStorage()));
    } catch {}
  }

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function narrationText(text) {
    return String(text).replace(/^[^:：]{1,40}[:：]\s*/, "");
  }

  function speak(text) {
    if (!state.soundOn || !("speechSynthesis" in window) || !text) return;
    stopSpeech();
    const u = new SpeechSynthesisUtterance(narrationText(text));
    u.lang = "he-IL";
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }

  function setState(patch, shouldSpeak = false) {
    stopSpeech();
    state = { ...state, ...patch };
    saveState();
    render();
    if (shouldSpeak) speakCurrent();
  }

  function currentScene() {
    return SCENES[state.sceneId];
  }

  function currentPanel() {
    return currentScene().panels[state.panelIndex];
  }

  function chapterIndexById(chapterId) {
    return CHAPTERS.findIndex((c) => c.id === chapterId);
  }

  function globalHasPrevious() {
    if (state.screen === "workspace") return true;
    if (state.panelIndex > 0) return true;
    return chapterIndexById(state.chapterId) > 0;
  }

  function speakCurrent() {
    if (state.hintSlides) return speak(currentHintSlideReadText());
    if (state.screen !== "story" || state.dialog) return;
    speak(currentPanel().read);
  }

  function navIcon(name) {
    const common = `class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;
    if (name === "arrow-left") {
      return `<svg ${common}><path d="M14.5 5.5 L8 12 L14.5 18.5" /><path d="M9 12 H20" /></svg>`;
    }
    if (name === "arrow-right") {
      return `<svg ${common}><path d="M9.5 5.5 L16 12 L9.5 18.5" /><path d="M15 12 H4" /></svg>`;
    }
    if (name === "restart") {
      return `<svg ${common}><path d="M8 4 L4 8 L8 12" /><path d="M4.8 8 H13 A7 7 0 1 1 7 19" /></svg>`;
    }
    if (name === "speaker") {
      return `<svg ${common}><path d="M4 9 V15 H8 L13 19 V5 L8 9 Z" /><path d="M16 9.5 C17.2 10.8 17.2 13.2 16 14.5" /><path d="M18.5 7 C21 9.8 21 14.2 18.5 17" /></svg>`;
    }
    if (name === "speaker-muted") {
      return `<svg ${common}><path d="M4 9 V15 H8 L13 19 V5 L8 9 Z" /><path d="M17 9 L21 15" /><path d="M21 9 L17 15" /></svg>`;
    }
    return "";
  }

  function navButton(action, iconName, label, options = {}) {
    const classes = `btn icon-btn${options.primary ? " btn-primary" : ""}`;
    const disabled = options.disabled ? "disabled" : "";
    return `<button class="${classes}" data-action="${esc(action)}" aria-label="${esc(label)}" title="${esc(label)}" ${disabled}>${navIcon(iconName)}<span class="visually-hidden">${esc(label)}</span></button>`;
  }

  function topbar() {
    const contentScreens = ["story", "workspace", "nandBuildHelp"];
    const showChapter = Boolean(state.started) && (Boolean(state.hintSlides) || contentScreens.includes(state.screen));
    const chapter = showChapter ? currentChapter() : null;
    const subtitle = chapter
      ? `<div class="chapter-subtitle">פרק ${esc(chapter.title)}</div>`
      : "";
    return `
      <header class="topbar">
        <div class="brand">
          <div class="title">${esc(APP.title)}</div>
          ${subtitle}
        </div>
        <nav class="top-buttons">
          <button class="btn" data-action="chapters">פרקים</button>
          <button class="btn" data-action="menu">תפריט ראשי</button>
          <button class="btn" data-action="explanations">הסברים</button>
          <button class="btn" data-action="about">אודות</button>
          <button class="btn" data-action="exit">צא</button>
        </nav>
      </header>`;
  }

  function isHelpDecisionPoint() {
    const scene = currentScene();
    return state.chapterId === "chapter-3" && state.panelIndex === scene.panels.length - 1;
  }

  function imageFileStem(filename) {
    return String(filename || "")
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .pop()
      .replace(/\.(png|svg)$/i, "");
  }

  function panelImageName(panel) {
    return String(panel?.image || "").split("?")[0].split("#")[0].split("/").pop();
  }

  function panelImageIs(panel, filename) {
    const nameStem = imageFileStem(panelImageName(panel));
    const targetStem = imageFileStem(filename);
    return nameStem === targetStem || nameStem.startsWith(`${targetStem}_`);
  }

  function panelIndexByImage(scene, filename) {
    return scene.panels.findIndex((panel) => panelImageIs(panel, filename));
  }

  function isWorkspaceLaunchPanel(panel) {
    if (!panel) return false;
    if (panel.launchWorkspace || panel.workspaceLaunch) return true;
    return panelImageIs(panel, "panel82.png");
  }

  function isReturnToNandPanel(panel) {
    if (!panel) return false;
    if (panel.returnToNand || panel.nandReturn) return true;
    return panelImageIs(panel, "panel87.png");
  }

  function chapterBySceneId(sceneId) {
    return CHAPTERS.find((chapter) => chapter.sceneId === sceneId) || null;
  }

  function simpleGatesChapter() {
    return chapterBySceneId("simple-gates") || CHAPTERS.find((chapter) => chapter.id === "chapter-5") || chapterById("chapter-5");
  }

  function storyTarget(chapter, panelIndex) {
    const resolvedChapter = chapter || chapterById(state.chapterId);
    const scene = sceneByChapter(resolvedChapter);
    const safeIndex = Math.min(Math.max(panelIndex, 0), Math.max(scene.panels.length - 1, 0));
    return {
      screen: "story",
      chapterId: resolvedChapter.id,
      sceneId: scene.id,
      panelIndex: safeIndex,
      started: true,
      dialog: null
    };
  }

  function chapter23Chapter() {
    return chapterById("chapter-6");
  }

  function chapter23StartTarget() {
    return storyTarget(chapter23Chapter(), 0);
  }

  function isChapter23StartPoint() {
    return state.screen === "story" && state.chapterId === "chapter-6" && state.panelIndex === 0;
  }

  function xorInteractiveHintUsed() {
    return Boolean(hintProgress("Xor").seen >= 2);
  }

  function shouldShowPostTasksXorHint() {
    return !state.hintSlides && isChapter23StartPoint() && !xorInteractiveHintUsed();
  }

  function openPostTasksXorHintSlides(startIndex = 0, returnPanelIndex = state.panelIndex) {
    preloadHintSlides(XOR_HINT_SLIDES);
    unlockExplanation("truth-table-cards");
    setState({
      hintSlides: {
        taskId: "Xor",
        index: Math.min(Math.max(Number(startIndex) || 0, 0), 3),
        limit: 4,
        returnTo: {
          mode: "continue-story",
          screen: "story",
          chapterId: state.chapterId,
          sceneId: state.sceneId,
          panelIndex: returnPanelIndex,
          started: true,
          dialog: null
        }
      },
      postTasksXorHintShown: true
    }, false);
  }

  function firstWorkspaceExitPanelIndex(scene = currentScene()) {
    const panel83Index = panelIndexByImage(scene, "panel83.png");
    if (panel83Index >= 0) return panel83Index;

    const launchIndex = workspaceLaunchPanelIndex(scene);
    if (launchIndex >= 0 && launchIndex < scene.panels.length - 1) return launchIndex + 1;

    return Math.max(0, scene.panels.length - 5);
  }

  function secondWorkspaceExitPanelIndex(scene = currentScene()) {
    const panel87Index = panelIndexByImage(scene, "panel87.png");
    if (panel87Index >= 0) return panel87Index;
    return Math.max(0, scene.panels.length - 1);
  }

  function currentChapter() {
    return chapterById(state.chapterId);
  }

  function completedTaskIds() {
    return Array.isArray(state.completedTasks) ? state.completedTasks : [];
  }

  function taskCompleted(taskId) {
    return completedTaskIds().includes(taskId);
  }

  // Which built-gate tools the palette offers. Once the learner is PAST chapter
  // 2.2 (i.e. in 2.3 onward) every simple gate is available even if it was
  // skipped and never actually built. Back inside 2.2 (or earlier) only the
  // gates truly completed appear.
  function isPastSimpleGatesChapter() {
    return chapterIndexById(state.chapterId) > chapterIndexById(simpleGatesChapter().id);
  }

  function toolbarGateToolIds() {
    return isPastSimpleGatesChapter() ? TASK_DEFS.map((task) => task.id) : completedTaskIds();
  }

  // ROUTING_TASK_DEFS moved to js/app-data.js

  function routingNoteDialogActive() {
    return Boolean(state.taskDialog?.mode === "routing");
  }

  function currentNoteTaskDefs() {
    return routingNoteDialogActive() ? ROUTING_TASK_DEFS : TASK_DEFS;
  }

  function allBasicTasksCompleted() {
    return ["Not", "And", "Or"].every(taskCompleted);
  }

  function allNoteTasksCompletedIn(taskIds = completedTaskIds()) {
    const completed = new Set(Array.isArray(taskIds) ? taskIds : []);
    return TASK_DEFS.every((task) => completed.has(task.id));
  }

  function taskUnlockRequirement(taskId) {
    if (taskId === "Not") return null;
    if (taskId === "And") return taskCompleted("Not") ? null : "Not";
    if (taskId === "Or") return taskCompleted("And") ? null : "And";
    return allBasicTasksCompleted() ? null : "Or";
  }

  function taskUnlocked(taskId) {
    return taskUnlockRequirement(taskId) === null;
  }

  function taskLockedMessage(taskId) {
    const requirement = taskUnlockRequirement(taskId);
    return requirement ? `צריך קודם לבנות את ${requirement}` : "";
  }

  // TASK_HINTS moved to js/app-data.js

  function taskHints(taskId = null) {
    return taskId ? (TASK_HINTS[taskId] || []) : [];
  }

  function taskHasHints(taskId = null) {
    return taskHints(taskId).length > 0;
  }

  function taskHasSolutionWalkthrough(taskId) {
    return Array.isArray(TASK_SOLUTION_STEPS[taskId]) && TASK_SOLUTION_STEPS[taskId].length > 0;
  }

  function solutionAvailable(taskId = workspaceTaskId()) {
    const hints = taskHints(taskId);
    return Boolean(taskId) && hints.length > 0 && !taskCompleted(taskId) && hintProgress(taskId).failures >= hints.length + 2;
  }

  function hintState() {
    return state.hintState && typeof state.hintState === "object" ? state.hintState : {};
  }

  function hintProgress(taskId = workspaceTaskId()) {
    const raw = hintState()[taskId] || {};
    return {
      failures: Number.isInteger(raw.failures) ? Math.max(0, raw.failures) : 0,
      seen: Number.isInteger(raw.seen) ? Math.max(0, raw.seen) : 0
    };
  }

  function unlockedHintCount(taskId = workspaceTaskId()) {
    const hints = taskHints(taskId);
    if (!hints.length) return 0;
    const progress = hintProgress(taskId);
    return Math.min(hints.length, Math.max(0, progress.failures - 1));
  }

  function hintedTaskActive() {
    const taskId = workspaceTaskId();
    return state.screen === "workspace" && taskHasHints(taskId) && !taskCompleted(taskId);
  }

  function hintButtonVisible() {
    const taskId = workspaceTaskId();
    return hintedTaskActive() && (unlockedHintCount(taskId) > 0 || solutionAvailable(taskId));
  }

  function hintButtonHasNewHint() {
    const taskId = workspaceTaskId();
    if (!taskId) return false;
    if (solutionAvailable(taskId)) return true;
    const progress = hintProgress(taskId);
    return progress.seen < unlockedHintCount(taskId);
  }

  function hintButtonLabel() {
    const taskId = workspaceTaskId();
    if (solutionAvailable(taskId)) return "רוצה לראות את הפתרון";
    return hintProgress(taskId).seen === 0 ? "רוצה רמז" : "רוצה עוד רמז";
  }

  function setHintProgress(taskId, progress) {
    const next = {
      ...hintState(),
      [taskId]: {
        failures: Math.max(0, Number(progress.failures) || 0),
        seen: Math.max(0, Number(progress.seen) || 0)
      }
    };
    return next;
  }

  function recordHintFailure(taskId) {
    const progress = hintProgress(taskId);
    return setHintProgress(taskId, { ...progress, failures: progress.failures + 1 });
  }

  function markHintSeen(taskId, hintNumber) {
    const progress = hintProgress(taskId);
    return setHintProgress(taskId, { ...progress, seen: Math.max(progress.seen, hintNumber) });
  }

  function workspaceSkipDisabled() {
    if (state.screen !== "workspace") return true;
    return ![1, 2].includes(Number(state.workspace?.workspaceSession));
  }

  function isSkipDisabled() {
    if (state.screen === "workspace") return workspaceSkipDisabled();
    if (state.screen !== "story") return true;

    const chapter = currentChapter();
    if (chapter?.partId === "part-1") return false;
    if (chapter?.id === "chapter-4") return false;
    if (chapter?.id === "chapter-5") return state.panelIndex >= currentScene().panels.length - 1;

    return false;
  }

  function renderDialog() {
    if (!state.dialog) return "";
    const dialog = endDialogs()[state.dialog];
    if (!dialog) return "";

    const title = dialog.title ? `<h2 class="dialog-title">${esc(dialog.title)}</h2>` : "";
    const body = dialog.paragraphs
      ? `<div class="dialog-body">${dialog.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
      : "";

    return `
      <div class="dialog-overlay" role="presentation">
        <section class="dialog-card dialog-card-${esc(dialog.size)}" role="dialog" aria-modal="false" aria-label="${esc(dialog.ariaLabel)}">
          ${title}
          ${body}
          <div class="dialog-actions">
            <button class="btn btn-primary" data-action="dialog-yes">כן</button>
            <button class="btn" data-action="dialog-no">לא</button>
          </div>
        </section>
      </div>`;
  }

  function implicitHotspots(panel, existing = []) {
    const hasReturnHotspot = existing.some((hotspot) => hotspot?.action === "return-to-nand-dialog");
    if (isReturnToNandPanel(panel) && !hasReturnHotspot) {
      return [{
        action: "return-to-nand-dialog",
        ariaLabel: "לחץ על ה-NAND",
        left: 40,
        top: 56,
        width: 22,
        height: 28
      }];
    }
    return [];
  }

  function panelHotspots(panel) {
    const explicit = panel.hotspot
      ? (Array.isArray(panel.hotspot) ? panel.hotspot : [panel.hotspot])
      : [];
    const plural = Array.isArray(panel.hotspots) ? panel.hotspots : [];
    const existing = [...explicit, ...plural];
    return [...existing, ...implicitHotspots(panel, existing)];
  }

  function renderHotspots(panel) {
    const hotspots = panelHotspots(panel);
    if (!hotspots.length) return "";
    return hotspots.map((h) => `
      <button class="panel-hotspot" type="button" data-action="${esc(h.action || "panel-hotspot")}" aria-label="${esc(h.ariaLabel || "אזור אינטראקטיבי")}" style="left:${Number(h.left)}%;top:${Number(h.top)}%;width:${Number(h.width)}%;height:${Number(h.height)}%;"></button>`).join("");
  }

  // EXPLANATION_ITEMS moved to js/app-data.js

  function explanationItem(id) {
    return EXPLANATION_ITEMS.find((item) => item.id === id) || null;
  }

  function explanationUnlocked(id) {
    return Array.isArray(state.explanationsUnlocked) && state.explanationsUnlocked.includes(id);
  }

  function unlockExplanation(id) {
    if (!explanationItem(id) || explanationUnlocked(id)) return;
    state.explanationsUnlocked = [...(Array.isArray(state.explanationsUnlocked) ? state.explanationsUnlocked : []), id];
    saveState();
  }

  function nandIntroScene() {
    return SCENES["nand-workshop-1943"];
  }

  function nandIntroStartIndex() {
    const scene = nandIntroScene();
    const index = panelIndexByImage(scene, "panel75.png");
    return index >= 0 ? index : 0;
  }

  function nandIntroEndIndex() {
    const scene = nandIntroScene();
    const index = panelIndexByImage(scene, "panel82.png");
    return index >= 0 ? index : scene.panels.length - 1;
  }

  function syncExplanationUnlocks() {
    const chapter4Index = chapterIndexById("chapter-4");
    const currentIndex = chapterIndexById(state.chapterId);
    const reachedChapter5 = currentIndex > chapter4Index || state.chapterId === "chapter-5";

    if (
      reachedChapter5 ||
      (state.chapterId === "chapter-4" && Number(state.panelIndex) >= nandIntroStartIndex()) ||
      state.explanationReplay?.id === "nand-intro" ||
      state.explanationReplay?.id === "nand-function"
    ) {
      unlockExplanation("nand-intro");
    }

    if (
      reachedChapter5 ||
      (state.screen === "workspace" && (
        Number.isInteger(state.workspace?.nandMonologueStep) ||
        Boolean(state.workspace?.understoodPromptShown) ||
        Boolean(state.workspace?.understoodButtonVisible) ||
        Boolean(state.workspace?.nandOutputObserved?.zero && state.workspace?.nandOutputObserved?.one)
      )) ||
      state.explanationReplay?.id === "nand-function"
    ) {
      unlockExplanation("nand-function");
    }

    if (
      reachedChapter5 ||
      state.screen === "nandBuildHelp" ||
      (state.screen === "workspace" && state.chapterId === "chapter-4" && (
        !state.workspace?.helpPromptSeen ||
        Boolean(state.workspace?.buildHelpButtonVisible)
      )) ||
      state.explanationReplay?.id === "build-nand"
    ) {
      unlockExplanation("build-nand");
    }

    if (
      Boolean(state.bitInfoUnlocked) ||
      Boolean(state.bitDialog) ||
      bitInfoButtonVisible() ||
      state.explanationReplay?.id === "bit-info"
    ) {
      unlockExplanation("bit-info");
    }

    if (
      Boolean(state.xorTableHelpUnlocked) ||
      xorTableHelpButtonVisible() ||
      state.hintSlides?.taskId === "Xor" ||
      state.explanationReplay?.id === "truth-table-cards"
    ) {
      unlockExplanation("truth-table-cards");
    }
  }

  function explanationReplayActive(id = null) {
    return Boolean(state.explanationReplay && (!id || state.explanationReplay.id === id));
  }

  function renderNandIntroExplanationControls() {
    return `
        <section class="controls">
          ${navButton("explanation-prev", "arrow-right", "הקודם")}
          <button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>
          ${navButton("explanation-next", "arrow-left", "המשך", { primary: true })}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>`;
  }

  function renderNandFunctionExplanationControls() {
    return `
        <section class="controls">
          ${navButton("explanation-prev", "arrow-right", "הקודם")}
          <button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>
          ${navButton("explanation-next", "arrow-left", "המשך", { primary: true })}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>`;
  }

  function cloneForExplanationsReturn(value) {
    if (value === undefined) return null;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return null;
    }
  }

  function explanationsReturnSnapshot() {
    return {
      screen: state.screen,
      chapterId: state.chapterId,
      sceneId: state.sceneId,
      panelIndex: state.panelIndex,
      started: state.started,
      replayNonce: state.replayNonce,
      dialog: cloneForExplanationsReturn(state.dialog),
      taskDialog: cloneForExplanationsReturn(state.taskDialog),
      notTest: cloneForExplanationsReturn(state.notTest),
      hintDialog: cloneForExplanationsReturn(state.hintDialog),
      hintSlides: cloneForExplanationsReturn(state.hintSlides),
      solutionDialog: cloneForExplanationsReturn(state.solutionDialog),
      bitDialog: cloneForExplanationsReturn(state.bitDialog),
      workspace: cloneForExplanationsReturn(state.workspace)
    };
  }

  function openExplanationsMenu() {
    const returnTo = state.screen === "explanations"
      ? state.explanationsReturnTo || explanationsReturnSnapshot()
      : explanationsReturnSnapshot();

    setState({
      ...transientUiClearPatch(),
      screen: "explanations",
      explanationsReturnTo: returnTo
    }, false);
  }

  function returnFromExplanationsMenu() {
    const target = state.explanationsReturnTo;
    if (target && typeof target === "object" && target.screen) {
      return setState({
        ...transientUiClearPatch(),
        ...target,
        explanationsReturnTo: null,
        replayNonce: Number.isInteger(target.replayNonce) ? target.replayNonce : state.replayNonce + 1
      }, false);
    }

    setState({
      ...transientUiClearPatch(),
      screen: "menu",
      explanationsReturnTo: null
    }, false);
  }

  function cleanNandFunctionExplanationWorkspace() {
    return {
      ...createDefaultWorkspace(),
      unlocked: true,
      selectedTerminal: null,
      wires: [],
      nextId: 2,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      nandOutputObserved: { zero: true, one: true },
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandMonologueStep: 0,
      workspaceLaunchPanelIndex: workspaceLaunchPanelIndex(nandIntroScene()),
      workspaceCompleted: false,
      workspaceSession: 1,
      exitTargetPanelIndex: firstWorkspaceExitTarget().panelIndex,
      returnToWorkspaceAfterMonologue: false,
      taskId: null,
      taskIntroSeen: false
    };
  }

  function startExplanation(id) {
    if (id === "nand-intro") {
      if (!explanationUnlocked("nand-intro")) return;
      const scene = nandIntroScene();
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: "chapter-4",
        sceneId: scene.id,
        panelIndex: nandIntroStartIndex(),
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "nand-intro" }
      }, true);
    }

    if (id === "nand-function") {
      if (!explanationUnlocked("nand-function")) return;
      const scene = nandIntroScene();
      return setState({
        ...transientUiClearPatch(),
        screen: "workspace",
        chapterId: "chapter-4",
        sceneId: scene.id,
        panelIndex: nandIntroEndIndex(),
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "nand-function" },
        workspace: cleanNandFunctionExplanationWorkspace()
      }, false);
    }

    if (id === "build-nand") {
      if (!explanationUnlocked("build-nand")) return;
      const scene = nandIntroScene();
      return setState({
        ...transientUiClearPatch(),
        screen: "nandBuildHelp",
        chapterId: "chapter-4",
        sceneId: scene.id,
        panelIndex: nandIntroEndIndex(),
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "build-nand" },
        workspace: cleanNandFunctionExplanationWorkspace()
      }, false);
    }

    if (id === "bit-info") {
      if (!explanationUnlocked("bit-info")) return;
      const chapter = simpleGatesChapter();
      const scene = sceneByChapter(chapter);
      const panel87Index = panelIndexByImage(scene, "panel87.png");
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: chapter.id,
        sceneId: scene.id,
        panelIndex: panel87Index >= 0 ? panel87Index : scene.panels.length - 1,
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "bit-info" },
        bitDialog: { step: 0, returnToNote: false }
      }, false);
    }

    if (id === "truth-table-cards") {
      if (!explanationUnlocked("truth-table-cards")) return;
      const chapter = simpleGatesChapter();
      const scene = sceneByChapter(chapter);
      const panel87Index = panelIndexByImage(scene, "panel87.png");
      preloadHintSlides(XOR_HINT_SLIDES);
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: chapter.id,
        sceneId: scene.id,
        panelIndex: panel87Index >= 0 ? panel87Index : scene.panels.length - 1,
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "truth-table-cards" },
        hintSlides: {
          taskId: "Xor",
          index: 0,
          limit: 4,
          returnTo: {
            screen: "explanations"
          }
        }
      }, false);
    }
  }

  function returnToExplanationsMenuFromReplay() {
    setState({
      ...transientUiClearPatch(),
      screen: "explanations",
      explanationReplay: null,
      replayNonce: state.replayNonce + 1
    }, false);
  }

  function previousExplanationPanel() {
    if (explanationReplayActive("nand-intro")) {
      if (state.panelIndex <= nandIntroStartIndex()) return returnToExplanationsMenuFromReplay();
      return setState({ panelIndex: state.panelIndex - 1, replayNonce: state.replayNonce + 1 }, true);
    }

    if (explanationReplayActive("nand-function")) {
      const workspace = normalizeWorkspace(state.workspace);
      const step = Number.isInteger(workspace.nandMonologueStep) ? workspace.nandMonologueStep : 0;
      if (step <= 0) return returnToExplanationsMenuFromReplay();
      workspace.nandMonologueStep = step - 1;
      return setState({ workspace }, false);
    }
  }

  function nextExplanationPanel() {
    if (explanationReplayActive("nand-intro")) {
      if (state.panelIndex >= nandIntroEndIndex()) return returnToExplanationsMenuFromReplay();
      return setState({ panelIndex: state.panelIndex + 1, replayNonce: state.replayNonce + 1 }, true);
    }

    if (explanationReplayActive("nand-function")) {
      const workspace = normalizeWorkspace(state.workspace);
      const step = Number.isInteger(workspace.nandMonologueStep) ? workspace.nandMonologueStep : 0;
      if (step >= NAND_MONOLOGUE_TEXTS.length - 1) return returnToExplanationsMenuFromReplay();
      workspace.nandMonologueStep = step + 1;
      return setState({ workspace }, false);
    }
  }

  function renderExplanationsMenu() {
    syncExplanationUnlocks();
    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen explanations-screen">
        <section class="menu-card">
          <h1>הסברים</h1>
          <div class="menu-buttons explanations-list">
            ${EXPLANATION_ITEMS.map((item) => {
              const enabled = explanationUnlocked(item.id);
              return enabled
                ? `<button class="btn btn-primary" data-action="explanation-open" data-explanation-id="${esc(item.id)}" type="button">${esc(item.title)}</button>`
                : `<button class="btn" type="button" disabled aria-disabled="true">${esc(item.title)}</button>`;
            }).join("")}
          </div>
          <div class="about-actions" style="margin-top:1.15rem;padding-top:1rem;border-top:1px dashed rgba(70,50,25,.35);">
            <button class="btn" data-action="explanations-return" type="button" style="background:#5b4328;color:#fff8ec;border-color:#3f2d19;min-width:12rem;">חזרה למשחק</button>
          </div>
        </section>
      </main>`;
  }

  function renderMenu() {
    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen">
        <section class="menu-card">
          <h1>${esc(APP.title)}</h1>
          <p class="menu-subtitle">
            לומדה על פי הקורס
            <a href="https://www.nand2tetris.org/" target="_blank" rel="noopener noreferrer">nand2tetris</a>
            של נועם ניסן ושמעון שוקן
          </p>
          <div class="menu-buttons">
            <button class="btn btn-primary" data-action="start">התחל</button>
            <button class="btn" data-action="continue">המשך</button>
            <button class="btn" data-action="chapters">פרקים</button>
            <button class="btn" data-action="explanations">הסברים</button>
            <button class="btn" data-action="about">אודות</button>
            <button class="btn" data-action="reset-progress">אפס התקדמות</button>
          </div>
        </section>
      </main>
      ${renderDialog()}`;
  }

  function renderAbout() {
    app.innerHTML = `
      ${topbar()}
      <main class="screen about-screen">
        <section class="about-card">
          <h1>אודות</h1>
          <p>זהו פיילוט ראשוני של לומדה לפי הקורס nand2tetris. יוצרי הקורס המקורי אינם נושאים באחריות לתוכן הלומדה. העלילה בלומדה שאבה השראה מאירועים היסטוריים, אך היא בדיונית לחלוטין. אל תשתמשו בה כדי ללמוד היסטוריה.</p>
          <p>אשמח לשמוע הערות ב־<a href="mailto:aizenr@gmail.com">aizenr@gmail.com</a></p>
          <div class="about-actions">
            <button class="btn btn-primary" data-action="menu">חזרה לתפריט הראשי</button>
          </div>
        </section>
      </main>`;
  }

  function renderChapters() {
    const parts = typeof PARTS === "undefined" ? [] : PARTS;
    const knownPartIds = new Set(parts.map((part) => part.id));
    const partSections = parts.map((part) => {
      const chapters = CHAPTERS.filter((chapter) => chapter.partId === part.id);
      if (!chapters.length) return "";

      const chapterButtons = chapters.map((chapter) => `
        <button class="chapter-btn" data-action="chapter" data-chapter-id="${esc(chapter.id)}">${esc(chapter.title)}</button>`).join("");

      return `
        <section class="part-card">
          <h2 class="part-title">${esc(part.title)}</h2>
          <div class="part-chapters">${chapterButtons}</div>
        </section>`;
    }).join("");

    const ungroupedChapters = CHAPTERS.filter((chapter) => !chapter.partId || !knownPartIds.has(chapter.partId));
    const fallbackSection = ungroupedChapters.length ? `
      <section class="part-card">
        <h2 class="part-title">פרקים</h2>
        <div class="part-chapters">${ungroupedChapters.map((chapter) => `
          <button class="chapter-btn" data-action="chapter" data-chapter-id="${esc(chapter.id)}">${esc(chapter.title)}</button>`).join("")}</div>
      </section>` : "";

    app.innerHTML = `
      ${topbar()}
      <main class="screen chapters-screen">
        <section class="chapters-card parts-card">${partSections}${fallbackSection}</section>
      </main>`;
  }

  function renderStory() {
    const scene = currentScene();
    const panel = currentPanel();
    const imageSrc = `${panel.image}?r=${state.replayNonce}`;
    const year = Object.prototype.hasOwnProperty.call(panel, "year") ? panel.year : (scene.year || "");
    const imageStageClass = year ? "image-stage" : "image-stage image-stage-no-year";
    const nextDisabled = panelHotspots(panel).length ? "disabled" : "";
    const skipDisabled = isSkipDisabled() ? "disabled" : "";

    app.innerHTML = `
      ${topbar()}
      <main class="screen story-screen">
        <section class="${imageStageClass}">
          ${year ? `<div class="year-badge">${esc(year)}</div>` : ""}
          <div class="image-frame">
            <div class="image-shell">
              <object class="panel-image" data="${esc(imageSrc)}" type="image/svg+xml" width="1448" height="1086" aria-label="קומיקס" role="img"></object>
              ${renderHotspots(panel)}
            </div>
          </div>
        </section>
        ${explanationReplayActive("nand-intro") ? renderNandIntroExplanationControls() : `
        <section class="controls">
          ${navButton("prev", "arrow-right", "הקודם", { disabled: !globalHasPrevious() })}
          ${navButton("restart", "restart", "חזור")}
          ${navButton("next", "arrow-left", "המשך", { primary: true, disabled: Boolean(nextDisabled) })}
          <button class="btn" data-action="skip" ${routingFinalPanelActive() ? "disabled" : skipDisabled}>דלג</button>
          ${renderBitInfoButton()}
          ${renderXorTableHelpButton()}
          ${renderRoutingCardsButton()}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>`}
      </main>
      ${renderDialog()}
      ${renderNoteTaskDialog()}
      ${renderBitDialog()}`;
  }

  function wireKey(a, b) {
    return [a, b].sort().join("|");
  }

  function normalizeWire(a, b) {
    const [x, y] = [a, b].sort();
    return { a: x, b: y };
  }

  // otherWireEnd moved to js/circuit-engine.js

  // inputRefOf moved to js/workbench-model.js

  // outputRefOf moved to js/workbench-model.js

  function isSourceOutputRef(workspace, ref) {
    const info = pinDefFor(workspace, ref);
    return Boolean(info && info.component.type === "source" && info.pinId === "out");
  }

  // dangerousPowerWireInfo moved to js/workbench-model.js

  // Cycle detection for a candidate wire. fromRef/toRef are the input-side and
  // output-side terminals of the candidate; a cycle exists if the input side can
  // already reach the output side following the directed signal flow.
  //
  // A task card is NOT a pass-through: its internal input pins are signal SOURCES
  // and its internal output pin is a SINK, with no internal link between them.
  // Modelling it as a single node would create a false path "through" the card
  // (output -> card -> input) and wrongly reject legitimate reconvergent wiring
  // (e.g. one NOT feeding several ANDs that all feed one OR). So the card's
  // input side and output side are kept as separate graph nodes.
  function componentGraphHasPath(workspace, wires, fromRef, toRef) {
    const cardNode = (info) => {
      const comp = componentById(workspace, info.componentId);
      const isCard = comp && (comp.type === "notCard" || String(comp.type || "").startsWith("taskCard-"));
      if (!isCard) return info.componentId;
      const outputSide = /^output(Int|Ext)/.test(info.pinId);
      return `${info.componentId}$${outputSide ? "out" : "in"}`;
    };
    const nodeOf = (ref) => {
      const info = splitTerminalRef(ref);
      return info ? cardNode(info) : null;
    };

    const fromNode = nodeOf(fromRef);
    const toNode = nodeOf(toRef);
    if (!fromNode || !toNode) return false;
    if (fromNode === toNode) return true;

    const graph = new Map();
    for (const wire of wires) {
      const outRef = outputRefOf(workspace, wire.a, wire.b);
      const inRef = inputRefOf(workspace, wire.a, wire.b);
      if (!outRef || !inRef) continue;
      const u = nodeOf(outRef);
      const v = nodeOf(inRef);
      if (!u || !v || u === v) continue;
      if (!graph.has(u)) graph.set(u, []);
      graph.get(u).push(v);
    }

    const seen = new Set([fromNode]);
    const queue = [fromNode];
    while (queue.length) {
      const current = queue.shift();
      for (const next of graph.get(current) || []) {
        if (next === toNode) return true;
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }

    return false;
  }

  function taskFramePairedPin(pinId, otherDirection) {
    const inputMatch = String(pinId || "").match(/^input(?:Ext|Int)(\d+)$/);
    if (inputMatch) {
      if (otherDirection === "in") return `inputInt${inputMatch[1]}`;
      if (otherDirection === "out") return `inputExt${inputMatch[1]}`;
    }

    if (pinId === "outputInt" || pinId === "outputExt") {
      if (otherDirection === "out") return "outputInt";
      if (otherDirection === "in") return "outputExt";
    }

    return pinId;
  }

  function canonicalTaskFrameRef(workspace, ref, otherRef) {
    const info = splitTerminalRef(ref);
    if (!info) return ref;
    const component = componentById(workspace, info.componentId);
    if (!String(component?.type || "").startsWith("taskCard-")) return ref;

    const nextPinId = taskFramePairedPin(info.pinId, terminalDirection(workspace, otherRef));
    const nextRef = `${info.componentId}.${nextPinId}`;
    return terminalExists(workspace, nextRef) ? nextRef : ref;
  }

  function canonicalTaskFrameWire(workspace, a, b) {
    const nextA = canonicalTaskFrameRef(workspace, a, b);
    const nextB = canonicalTaskFrameRef(workspace, b, a);
    return [nextA, nextB];
  }

  // canAddWire moved to js/workbench-model.js

  // connectedOutputRefs moved to js/circuit-engine.js

  // inputSignal moved to js/circuit-engine.js

  // evaluateWorkspace moved to js/circuit-engine.js

  function workspaceStatusText() {
    const evaluation = evaluateWorkspace();
    const lamps = [...evaluation.lamps.values()];
    if (lamps.length === 0) return "אין מנורות על השולחן.";
    if (lamps.length === 1) return `מנורה: ${lamps[0] ? "דלוקה" : "כבויה"}`;
    const onCount = lamps.filter(Boolean).length;
    return `מנורות דולקות: ${onCount} מתוך ${lamps.length}`;
  }

  function solutionHighlightConfig() {
    if (!state.solutionDialog) return { terminals: new Set(), wires: new Set(), components: new Set(), truthRows: new Set() };
    const taskId = state.solutionDialog.taskId || "Not";
    const steps = TASK_SOLUTION_STEPS[taskId] || [];
    if (!steps.length) return { terminals: new Set(), wires: new Set(), components: new Set(), truthRows: new Set() };
    const stepIndex = Math.min(Math.max(Number(state.solutionDialog.step) || 0, 0), steps.length - 1);
    const highlight = steps[stepIndex]?.highlight || {};
    return {
      terminals: new Set(highlight.terminals || []),
      wires: new Set(highlight.wires || []),
      components: new Set(highlight.components || []),
      truthRows: new Set(highlight.truthRows || [])
    };
  }

  function updatePinFromSvgTag(type, pinId, x, y) {
    const pin = WORKSPACE_COMPONENT_DEFS[type]?.pins?.[pinId];
    if (!pin || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    pin.x = x;
    pin.y = y;
    return true;
  }

  async function loadSvgPinsForType(type, filename) {
    if (!filename || !WORKSPACE_COMPONENT_DEFS[type]) return false;

    try {
      const response = await fetch(`assets/components/${filename}?pins=1`, { cache: "no-store" });
      if (!response.ok) return false;
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "image/svg+xml");
      let changed = false;

      doc.querySelectorAll("[data-pin]").forEach((element) => {
        const pinId = element.getAttribute("data-pin");
        const x = Number(element.getAttribute("data-pin-x") ?? element.getAttribute("cx") ?? element.getAttribute("x"));
        const y = Number(element.getAttribute("data-pin-y") ?? element.getAttribute("cy") ?? element.getAttribute("y"));
        if (updatePinFromSvgTag(type, pinId, x, y)) changed = true;
      });

      return changed;
    } catch {
      return false;
    }
  }

  async function loadSvgPinDefinitions() {
    const entries = new Map();

    Object.keys(WORKSPACE_COMPONENT_DEFS).forEach((type) => {
      const filename = componentSvgFilenameForType(type, { lampOn: false });
      if (filename) entries.set(type, filename);
    });

    const results = await Promise.all([...entries].map(([type, filename]) => loadSvgPinsForType(type, filename)));
    return results.some(Boolean);
  }

  function renderNotTestResultDialog() {
    if (!state.notTest?.result) return "";
    const message = state.notTest.result === "success" ? "הבדיקה הצליחה" : "הבדיקה נכשלה";
    return `
      <div class="not-test-result-overlay" role="presentation">
        <section class="not-test-result-card" role="alertdialog" aria-modal="false" aria-label="${esc(message)}">
          <p>${esc(message)}</p>
          <div class="not-test-result-actions">
            <button class="btn btn-primary" data-action="not-test-ok">אישור</button>
          </div>
        </section>
      </div>`;
  }

  const TASK_SOLUTION_STEPS = {
    And: [
      {
        text: "אנחנו מחברים את שתי הכניסות ל־NAND.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "nand-1.in1", "nand-1.in2"],
          wires: [
            wireKey("task-card-1.inputInt1", "nand-1.in1"),
            wireKey("task-card-1.inputInt2", "nand-1.in2")
          ],
          components: ["nand-1"]
        }
      },
      {
        text: "היציאה שלו היא 0 (בלי מתח) רק אם 2 הכניסות הן 1 (עם מתח). זה בדיוק המקרה היחיד שבו הכרטיס AND צריך להוציא 1.",
        highlight: {
          terminals: ["nand-1.out"]
        }
      },
      {
        text: "לכן אנחנו מחברים את היציאה של ה־NAND ל־NOT.",
        highlight: {
          terminals: ["nand-1.out", "not-1.in1"],
          wires: [wireKey("nand-1.out", "not-1.in1")],
          components: ["not-1"]
        }
      },
      {
        text: "היציאה שלו היא בדיוק מה שאנחנו צריכים. לכן אנחנו מוציאים אותה החוצה מכל הכרטיס AND.",
        highlight: {
          terminals: ["not-1.out", "task-card-1.outputInt"],
          wires: [wireKey("not-1.out", "task-card-1.outputInt")],
          components: ["not-1"]
        }
      }
    ],
    Or: [
      {
        text: "אנחנו צריכים לבדוק האם שתי הכניסות הן 0 ורק במקרה הזה להוציא 0. AND עושה בדיוק את ההפך: הוא בודק אם שתי הכניסות הן 1 ורק במקרה הזה מוציא 1.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2"]
        }
      },
      {
        text: "לכן אנחנו הופכים את שתי הכניסות על ידי NOT-ים.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-1.in1", "not-2.in1"],
          wires: [
            wireKey("task-card-1.inputInt1", "not-1.in1"),
            wireKey("task-card-1.inputInt2", "not-2.in1")
          ],
          components: ["not-1", "not-2"]
        }
      },
      {
        text: "ואז אנחנו מכניסים אותם ל־AND.",
        highlight: {
          terminals: ["not-1.out", "not-2.out", "and-1.in1", "and-1.in2"],
          wires: [
            wireKey("not-1.out", "and-1.in1"),
            wireKey("not-2.out", "and-1.in2")
          ],
          components: ["and-1"]
        }
      },
      {
        text: "כרגע אנחנו מקבלים 1 בדיוק במקרה שבו אנחנו צריכים לקבל 0.",
        highlight: {
          terminals: ["and-1.out"],
          components: ["and-1"]
        }
      },
      {
        text: "לכן אנחנו מבצעים NOT נוסף.",
        highlight: {
          terminals: ["and-1.out", "not-3.in1"],
          wires: [wireKey("and-1.out", "not-3.in1")],
          components: ["not-3"]
        }
      },
      {
        text: "ומוציאים את התוצאה.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          terminals: ["not-3.out", "task-card-1.outputInt"],
          wires: [wireKey("not-3.out", "task-card-1.outputInt")],
          components: ["not-3"]
        }
      },
      {
        text: "שים לב, שהשילוב בין ה־AND ל־NOT הוא בעצם NAND.",
        highlight: {
          components: ["and-1", "not-3"],
          terminals: ["and-1.out", "not-3.in1", "not-3.out"]
        }
      },
      {
        text: "כך שאפשר להחליף אותם ב־NAND ולחסוך.",
        highlight: {
          components: ["nand-1"],
          terminals: ["not-1.out", "not-2.out", "nand-1.in1", "nand-1.in2", "nand-1.out"],
          wires: [
            wireKey("not-1.out", "nand-1.in1"),
            wireKey("not-2.out", "nand-1.in2"),
            wireKey("nand-1.out", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "קיבלנו עוד פתרון.",
        highlight: {
          components: ["nand-1"]
        }
      },
      {
        text: "עוד דרך לחשוב על הפתרון הזה היא שגם NAND וגם OR מוציאים 0 רק במקרה אחד. ההבדל ביניהם הוא שאצל OR המקרה הזה הוא כששתי הכניסות הן 0, ואצל NAND המקרה הזה הוא כששתי הכניסות הן 1. ה־NOT-ים בהתחלה מחליפים בין המקרים.",
        highlight: {
          components: ["not-1", "not-2"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-1.in1", "not-2.in1", "not-1.out", "not-2.out"]
        }
      },
      {
        text: "כך אנו יכולים לעשות OR באמצעות NAND.",
        highlight: {
          components: ["not-1", "not-2", "nand-1"],
          wires: [
            wireKey("task-card-1.inputInt1", "not-1.in1"),
            wireKey("task-card-1.inputInt2", "not-2.in1"),
            wireKey("not-1.out", "nand-1.in1"),
            wireKey("not-2.out", "nand-1.in2"),
            wireKey("nand-1.out", "task-card-1.outputInt")
          ]
        }
      }
    ],
    AND3way: [
      {
        text: "כדי לבדוק ששלוש הכניסות הן 1, נתחיל משתי הכניסות הראשונות. נחבר אותן ל־AND.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "and-1.in1", "and-1.in2"],
          wires: [
            wireKey("task-card-1.inputInt1", "and-1.in1"),
            wireKey("task-card-1.inputInt2", "and-1.in2")
          ],
          components: ["and-1"]
        }
      },
      {
        text: "היציאה של ה־AND הראשון היא 1 רק אם שתי הכניסות הראשונות הן 1.",
        highlight: {
          terminals: ["and-1.out"],
          components: ["and-1"]
        }
      },
      {
        text: "עכשיו נשאר לבדוק שגם הכניסה השלישית היא 1. לכן נחבר את היציאה של ה־AND הראשון ואת הכניסה השלישית ל־AND נוסף.",
        highlight: {
          terminals: ["and-1.out", "task-card-1.inputInt3", "and-2.in1", "and-2.in2"],
          wires: [
            wireKey("and-1.out", "and-2.in1"),
            wireKey("task-card-1.inputInt3", "and-2.in2")
          ],
          components: ["and-1", "and-2"]
        }
      },
      {
        text: "היציאה של ה־AND השני היא 1 רק אם שתי הכניסות שלו הן 1, כלומר רק אם שלוש הכניסות המקוריות הן 1. לכן נוציא אותה החוצה מהכרטיס.",
        highlight: {
          terminals: ["and-2.out", "task-card-1.outputInt"],
          wires: [wireKey("and-2.out", "task-card-1.outputInt")],
          components: ["and-2"]
        }
      }
    ],
    OR4way: [
      {
        text: "בפתרון הראשון נתחיל משתי הכניסות הראשונות. נחבר את הכניסות 1 ו־2 ל־OR.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "or-ab.in1", "or-ab.in2"],
          wires: [
            wireKey("task-card-1.inputInt1", "or-ab.in1"),
            wireKey("task-card-1.inputInt2", "or-ab.in2")
          ],
          components: ["or-ab"]
        }
      },
      {
        text: "היציאה של ה־OR הראשון היא 1 אם הכניסה הראשונה היא 1 או שהכניסה השנייה היא 1.",
        highlight: {
          terminals: ["or-ab.out"],
          components: ["or-ab"]
        }
      },
      {
        text: "עכשיו נוסיף את הכניסה השלישית. נחבר את התוצאה שקיבלנו ואת הכניסה השלישית ל־OR נוסף. הוא מוציא 1 אם לפחות אחת משלוש הכניסות הראשונות היא 1.",
        highlight: {
          terminals: ["or-ab.out", "task-card-1.inputInt3", "or-abc.in1", "or-abc.in2"],
          wires: [
            wireKey("or-ab.out", "or-abc.in1"),
            wireKey("task-card-1.inputInt3", "or-abc.in2")
          ],
          components: ["or-ab", "or-abc"]
        }
      },
      {
        text: "לבסוף נוסיף את הכניסה הרביעית באותה דרך. נחבר את התוצאה הקודמת ואת הכניסה הרביעית ל־OR אחרון, ואת היציאה שלו נוציא החוצה.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          terminals: ["or-abc.out", "task-card-1.inputInt4", "or-final.in1", "or-final.in2", "or-final.out", "task-card-1.outputInt"],
          wires: [
            wireKey("or-abc.out", "or-final.in1"),
            wireKey("task-card-1.inputInt4", "or-final.in2"),
            wireKey("or-final.out", "task-card-1.outputInt")
          ],
          components: ["or-final"]
        }
      },
      {
        text: "יש גם פתרון סימטרי יותר: נחלק את ארבע הכניסות לשני זוגות.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "task-card-1.inputInt3", "task-card-1.inputInt4"],
          components: ["or-left", "or-right"]
        }
      },
      {
        text: "ה־OR העליון בודק את שתי הכניסות הראשונות.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "or-left.in1", "or-left.in2", "or-left.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "or-left.in1"),
            wireKey("task-card-1.inputInt2", "or-left.in2")
          ],
          components: ["or-left"]
        }
      },
      {
        text: "ה־OR התחתון בודק את שתי הכניסות האחרונות.",
        highlight: {
          terminals: ["task-card-1.inputInt3", "task-card-1.inputInt4", "or-right.in1", "or-right.in2", "or-right.out"],
          wires: [
            wireKey("task-card-1.inputInt3", "or-right.in1"),
            wireKey("task-card-1.inputInt4", "or-right.in2")
          ],
          components: ["or-right"]
        }
      },
      {
        text: "עכשיו נחבר את שתי התוצאות ל־OR אחרון. אם אחד מהזוגות הכיל 1, היציאה הסופית תהיה 1.",
        highlight: {
          terminals: ["or-left.out", "or-right.out", "or-final.in1", "or-final.in2", "or-final.out", "task-card-1.outputInt"],
          wires: [
            wireKey("or-left.out", "or-final.in1"),
            wireKey("or-right.out", "or-final.in2"),
            wireKey("or-final.out", "task-card-1.outputInt")
          ],
          components: ["or-final"]
        }
      },
      {
        text: "שים לב, אתה יכול להשתמש בכרטיס הזה גם עם 3 כניסות. אתה לא חייב להשתמש בכל הכניסות. אם כניסה לא מחוברת היא לא מקבלת מתח, כלומר מקבלת 0, ולכן היא לא תשפיע על התנהגות הכרטיס. הוא יוציא 1 רק אם אחת משלוש הכניסות האחרות מקבלת 1.",
        highlight: {
          components: ["or-left", "or-right", "or-final"]
        }
      }
    ],
    Xor: [
      {
        text: "החלק הזה בודק האם לפחות אחת משתי הכניסות היא 1, ומוציא 1 רק אם כן.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "or-1.in1", "or-1.in2", "or-1.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "or-1.in1"),
            wireKey("task-card-1.inputInt2", "or-1.in2")
          ],
          components: ["or-1"]
        }
      },
      {
        text: "החלק הזה בודק האם שתי הכניסות הן 1.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "and-raw.in1", "and-raw.in2", "and-raw.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "and-raw.in1"),
            wireKey("task-card-1.inputInt2", "and-raw.in2")
          ],
          components: ["and-raw"]
        }
      },
      {
        text: "הכרטיס XOR צריך להוציא 1 רק אם החלק הראשון מוציא 1 והשני 0.",
        highlight: {
          terminals: ["or-1.out", "and-raw.out"],
          components: ["or-1", "and-raw"]
        }
      },
      {
        text: "החלק הזה הופך את התוצאה של החלק השני.",
        highlight: {
          terminals: ["and-raw.out", "not-1.in1", "not-1.out"],
          wires: [wireKey("and-raw.out", "not-1.in1")],
          components: ["not-1"]
        }
      },
      {
        text: "כך שיחד הם מוציאים 1 אלא אם כן שתי הכניסות הן 1.",
        highlight: {
          terminals: ["not-1.out"],
          components: ["and-raw", "not-1"]
        }
      },
      {
        text: "לסיכום, אנחנו צריכים להוציא 1 רק כאשר שני הכבלים האלה הם 1.",
        highlight: {
          terminals: ["or-1.out", "not-1.out", "and-final.in1", "and-final.in2"],
          wires: [
            wireKey("or-1.out", "and-final.in1"),
            wireKey("not-1.out", "and-final.in2")
          ]
        }
      },
      {
        text: "את זה עושה החלק האחרון.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          terminals: ["and-final.in1", "and-final.in2", "and-final.out", "task-card-1.outputInt"],
          wires: [wireKey("and-final.out", "task-card-1.outputInt")],
          components: ["and-final"]
        }
      },
      {
        text: "שוב, השילוב בין ה־AND ל־NOT הוא בעצם NAND.",
        highlight: {
          components: ["and-raw", "not-1"],
          terminals: ["and-raw.out", "not-1.in1", "not-1.out"]
        }
      },
      {
        text: "כך שאפשר להחליף אותם ב־NAND ולחסוך.",
        highlight: {
          components: ["nand-1"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "nand-1.in1", "nand-1.in2", "nand-1.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "nand-1.in1"),
            wireKey("task-card-1.inputInt2", "nand-1.in2")
          ]
        }
      },
      {
        text: "קיבלנו עוד פתרון.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["or-1", "nand-1", "and-final"]
        }
      },
      {
        text: "יש גם פתרון אחר לגמרי: כשמסתכלים על טבלת האמת רואים שיש בדיוק שני מקרים שבהם הכרטיס צריך להוציא 1.",
        highlight: {
          truthRows: [1, 2]
        }
      },
      {
        text: "החלק הזה מטפל במקרה הראשון.",
        highlight: {
          truthRows: [1],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-a.in1", "and-case1.in1", "and-case1.in2", "and-case1.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "not-a.in1"),
            wireKey("not-a.out", "and-case1.in1"),
            wireKey("task-card-1.inputInt2", "and-case1.in2")
          ],
          components: ["not-a", "and-case1"]
        }
      },
      {
        text: "החלק הזה מטפל במקרה השני.",
        highlight: {
          truthRows: [2],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-b.in1", "and-case2.in1", "and-case2.in2", "and-case2.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "and-case2.in1"),
            wireKey("task-card-1.inputInt2", "not-b.in1"),
            wireKey("not-b.out", "and-case2.in2")
          ],
          components: ["not-b", "and-case2"]
        }
      },
      {
        text: "וכאן אנחנו בודקים האם אחד מהמקרים התקיים.",
        highlight: {
          terminals: ["and-case1.out", "and-case2.out", "or-final.in1", "or-final.in2", "or-final.out", "task-card-1.outputInt"],
          wires: [
            wireKey("and-case1.out", "or-final.in1"),
            wireKey("and-case2.out", "or-final.in2"),
            wireKey("or-final.out", "task-card-1.outputInt")
          ],
          components: ["or-final"]
        }
      }
    ],
    Mux: [
      {
        text: "לפי טבלת האמת יש 4 שורות שבהן הכרטיס צריך להוציא 1 (מסומנות). הרעיון הכללי — השיטה שג'ון לימד: לכל שורה כזאת בונים חלק שמוציא 1 בדיוק במקרה שלה, ובסוף מאחדים את כולם עם OR.",
        highlight: { truthRows: [2, 3, 5, 7] }
      },
      {
        text: "החלק הזה מוציא 1 בדיוק במקרה של השורה הראשונה שמסומנת: כניסה 1 היא 1, כניסה 2 היא 0, והבקרה 0.",
        highlight: {
          truthRows: [2],
          components: ["not-in2", "not-c", "and-m1"],
          terminals: ["task-card-1.inputInt1", "not-in2.out", "not-c.out", "and-m1.out"],
          wires: [
            wireKey("task-card-1.inputInt2", "not-in2.in1"),
            wireKey("task-card-1.inputInt3", "not-c.in1"),
            wireKey("not-c.out", "and-m1.in1"),
            wireKey("task-card-1.inputInt1", "and-m1.in2"),
            wireKey("not-in2.out", "and-m1.in3")
          ]
        }
      },
      {
        text: "וזה מטפל בשורה השנייה: כניסה 1 היא 1, כניסה 2 היא 1, והבקרה 0.",
        highlight: {
          truthRows: [3],
          components: ["and-m2"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-c.out", "and-m2.out"],
          wires: [
            wireKey("not-c.out", "and-m2.in1"),
            wireKey("task-card-1.inputInt1", "and-m2.in2"),
            wireKey("task-card-1.inputInt2", "and-m2.in3")
          ]
        }
      },
      {
        text: "וזה בשורה השלישית: כניסה 1 היא 0, כניסה 2 היא 1, והבקרה 1.",
        highlight: {
          truthRows: [5],
          components: ["not-in1", "and-m3"],
          terminals: ["not-in1.out", "task-card-1.inputInt2", "task-card-1.inputInt3", "and-m3.out"],
          wires: [
            wireKey("task-card-1.inputInt1", "not-in1.in1"),
            wireKey("task-card-1.inputInt3", "and-m3.in1"),
            wireKey("not-in1.out", "and-m3.in2"),
            wireKey("task-card-1.inputInt2", "and-m3.in3")
          ]
        }
      },
      {
        text: "וזה בשורה הרביעית: שלוש הכניסות הן 1.",
        highlight: {
          truthRows: [7],
          components: ["and-m4"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "task-card-1.inputInt3", "and-m4.out"],
          wires: [
            wireKey("task-card-1.inputInt3", "and-m4.in1"),
            wireKey("task-card-1.inputInt1", "and-m4.in2"),
            wireKey("task-card-1.inputInt2", "and-m4.in3")
          ]
        }
      },
      {
        text: "בסוף מחברים את כל ארבעת החלקים ל־OR: אם אחד מהם מוציא 1, גם הכרטיס מוציא 1. זה פתרון שעובד תמיד, אבל אפשר לעשות אותו בצורה חסכונית יותר.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["or-final"],
          terminals: ["and-m1.out", "and-m2.out", "and-m3.out", "and-m4.out", "or-final.out", "task-card-1.outputInt"],
          wires: [
            wireKey("and-m1.out", "or-final.in1"),
            wireKey("and-m2.out", "or-final.in2"),
            wireKey("and-m3.out", "or-final.in3"),
            wireKey("and-m4.out", "or-final.in4"),
            wireKey("or-final.out", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "למעשה יש רק 2 אפשרויות שבהן מופיע 1: (1) כשהכניסה הראשונה 1 וכניסת הבקרה 0, ו־(2) כשהכניסה השנייה 1 וכניסת הבקרה 1. כל אחת מהאפשרויות מופיעה פעמיים בטבלת האמת מכיוון שהיא לא רגישה לכניסה האחרת. לכן מספיק: (כניסה 1 וגם לא בקרה) או (כניסה 2 וגם בקרה).",
        highlight: { truthRows: [2, 3, 5, 7] }
      },
      {
        text: "החלק הזה מטפל באפשרות הראשונה,",
        highlight: {
          truthRows: [2, 3],
          components: ["not-c", "and-1"],
          terminals: ["task-card-1.inputInt1", "not-c.out", "and-1.out"],
          wires: [
            wireKey("task-card-1.inputInt3", "not-c.in1"),
            wireKey("task-card-1.inputInt1", "and-1.in1"),
            wireKey("not-c.out", "and-1.in2")
          ]
        }
      },
      {
        text: "והחלק הזה בשנייה,",
        highlight: {
          truthRows: [5, 7],
          components: ["and-2"],
          terminals: ["task-card-1.inputInt2", "task-card-1.inputInt3", "and-2.out"],
          wires: [
            wireKey("task-card-1.inputInt2", "and-2.in1"),
            wireKey("task-card-1.inputInt3", "and-2.in2")
          ]
        }
      },
      {
        text: "כרגיל בסוף עושים OR לשתיהן.",
        highlight: {
          components: ["or-1"],
          terminals: ["and-1.out", "and-2.out", "or-1.out", "task-card-1.outputInt"],
          wires: [
            wireKey("and-1.out", "or-1.in1"),
            wireKey("and-2.out", "or-1.in2"),
            wireKey("or-1.out", "task-card-1.outputInt")
          ]
        }
      }
    ]
  };

  function renderSolutionDialog() {
    if (!state.solutionDialog) return "";
    const taskId = state.solutionDialog.taskId || "Not";
    const task = taskDefById(taskId);

    if (taskId === "Not") {
      const text = "אם בכניסה של ה־NOT יש מתח, הוא מגיע לשתי הכניסות של ה־NAND, ולכן ביציאה של ה־NAND אין מתח. אם אין מתח בכניסה של ה־NOT, אין גם מתח בשתי הכניסות של ה־NAND, ולכן ביציאה של ה־NAND יש מתח.";
      return `
        <div class="solution-overlay" role="presentation">
          <section class="solution-card" role="dialog" aria-modal="false" aria-label="פתרון NOT">
            <h2>פתרון</h2>
            <p>${esc(text)}</p>
            <div class="solution-actions">
              <button class="btn btn-primary" data-action="solution-ok" type="button">אישור</button>
            </div>
          </section>
        </div>`;
    }

    const steps = TASK_SOLUTION_STEPS[taskId] || [];
    if (!steps.length) return "";
    const stepIndex = Math.min(Math.max(Number(state.solutionDialog.step) || 0, 0), steps.length - 1);
    const step = steps[stepIndex];
    const isLast = stepIndex >= steps.length - 1;

    const hasTable = Array.isArray(state.muxTable);
    const toggleButton = hasTable
      ? `<button class="btn" data-action="solution-toggle-table" type="button">${state.solutionTableHidden ? "הצג טבלה" : "הסתר טבלה"}</button>`
      : "";

    return `
      <div class="solution-overlay" role="presentation">
        <section class="solution-card" role="dialog" aria-modal="false" aria-label="פתרון ${esc(task?.label || taskId)}">
          <h2>פתרון</h2>
          <p>${esc(step.text)}</p>
          <div class="solution-actions">
            ${toggleButton}
            ${isLast ? '<button class="btn btn-primary" data-action="solution-ok" type="button">אישור</button>' : `<button class="btn btn-primary" data-action="solution-next" type="button">${esc(step.buttonLabel || "המשך")}</button>`}
          </div>
        </section>
      </div>`;
  }

  // BIT_EXPLANATION_STEPS moved to js/app-data.js

  function bitInfoButtonVisible() {
    return Boolean(state.bitInfoUnlocked) && state.screen === "story" && state.chapterId === "chapter-5" && isReturnToNandPanel(currentPanel());
  }

  function renderBitInfoButton() {
    if (!bitInfoButtonVisible()) return "";
    return `<button class="btn" data-action="bit-info-open" type="button">מה זה ביט?</button>`;
  }

  function xorTableHelpButtonVisible() {
    return Boolean(state.xorTableHelpUnlocked) && state.screen === "story" && state.chapterId === "chapter-5" && isReturnToNandPanel(currentPanel());
  }

  function renderXorTableHelpButton() {
    if (!xorTableHelpButtonVisible()) return "";
    return `<button class="btn" data-action="xor-table-help-open" type="button">יצירת כרטיסים לפי טבלת אמת</button>`;
  }

  function routingCardsButtonVisible() {
    return (
      state.screen === "story" &&
      state.chapterId === "chapter-6" &&
      panelImageIs(currentPanel(), "panel93_chapter_2_3_worktable.svg") &&
      Boolean(state.xorTableHelpUnlocked || (Array.isArray(state.explanationsUnlocked) && state.explanationsUnlocked.includes("truth-table-cards")))
    );
  }

  function routingFinalPanelActive() {
    return state.screen === "story" && state.chapterId === "chapter-6" && panelImageIs(currentPanel(), "panel93_chapter_2_3_worktable.svg");
  }

  function renderRoutingCardsButton() {
    if (!routingCardsButtonVisible()) return "";
    return `<button class="btn" data-action="xor-table-help-open" type="button">הכנת כרטיסים מטבלת אמת</button>`;
  }

  function renderBitDialog() {
    if (!state.bitDialog) return "";
    const step = Math.min(Math.max(Number(state.bitDialog.step) || 0, 0), BIT_EXPLANATION_STEPS.length - 1);
    const isLast = step >= BIT_EXPLANATION_STEPS.length - 1;
    const inExplanation = explanationReplayActive("bit-info");
    const primaryAction = isLast
      ? (inExplanation ? "explanations-return-to-menu" : "bit-dialog-ok")
      : "bit-dialog-next";
    const primaryLabel = isLast
      ? (inExplanation ? "חזרה לתפריט ההסברים" : "אישור")
      : "המשך";
    return `
      <div class="bit-overlay" role="presentation">
        <section class="bit-card" role="dialog" aria-modal="false" aria-label="מה זה ביט">
          <h2>מה זה ביט?</h2>
          <p>${esc(BIT_EXPLANATION_STEPS[step])}</p>
          <div class="bit-actions">
            <button class="btn btn-primary" data-action="${primaryAction}" type="button">${primaryLabel}</button>
            ${inExplanation && !isLast ? `<button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>` : ""}
          </div>
        </section>
      </div>`;
  }

  function renderHintButton() {
    if (!hintButtonVisible()) return "";
    const fresh = hintButtonHasNewHint();
    const disabled = notTestActive() || workspaceTaskIntroActive() ? "disabled" : "";
    const classes = `btn hint-btn ${fresh ? "hint-btn-ready" : "hint-btn-seen"}`;
    return `<button class="${classes}" data-action="hint-open" ${disabled}>${esc(hintButtonLabel())}</button>`;
  }

  function hintParagraphsHtml(text) {
    return String(text || "")
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => `<p>${esc(part)}</p>`)
      .join("");
  }

  function renderHintDialog() {
    if (!state.hintDialog) return "";
    const taskId = state.hintDialog.taskId || workspaceTaskId() || "Not";
    const task = taskDefById(taskId);
    const hints = taskHints(taskId);
    const unlocked = unlockedHintCount(taskId);
    const hasSolution = solutionAvailable(taskId);
    if (!unlocked && !hasSolution) return "";
    const solutionIndex = hints.length;
    const rawIndex = Number(state.hintDialog.index);
    const selectedIsSolution = hasSolution && Number.isFinite(rawIndex) && rawIndex === solutionIndex;
    const selectedIndex = selectedIsSolution
      ? solutionIndex
      : Math.min(Math.max(Number.isFinite(rawIndex) ? rawIndex : (hasSolution ? solutionIndex : unlocked - 1), 0), Math.max(0, unlocked - 1));
    const selectedHint = selectedIsSolution ? null : hints[selectedIndex];
    const hintItems = hints.slice(0, unlocked).map((hint, index) => `
      <button class="hint-list-item ${index === selectedIndex ? "hint-list-item-active" : ""}" data-action="hint-select" data-hint-index="${index}" type="button">
        ${esc(hint.title)}
      </button>`).join("");
    const solutionItem = hasSolution ? `
      <button class="hint-list-item hint-solution-item ${selectedIsSolution ? "hint-list-item-active" : ""}" data-action="hint-solution" type="button">פתרון</button>` : "";
    const list = `${hintItems}${solutionItem}`;

    const content = selectedIsSolution
      ? `<p>אפשר לראות את המימוש המלא של ${esc(task?.label || taskId)}.</p><button class="btn btn-primary" data-action="show-task-solution" type="button">הצג פתרון</button>`
      : (selectedHint?.kind === "interactive"
        ? (selectedHint.openAfterApply && selectedHint.text
          ? hintParagraphsHtml(selectedHint.text)
          : `${selectedHint.text ? hintParagraphsHtml(selectedHint.text) : ""}<button class="btn btn-primary" data-action="hint-apply" data-hint-index="${selectedIndex}" type="button">${esc(selectedHint.applyLabel || "הפעל רמז")}</button>`)
        : hintParagraphsHtml(selectedHint?.text || ""));

    return `
      <div class="hint-overlay" role="presentation">
        <section class="hint-card" role="dialog" aria-modal="false" aria-label="רמזים">
          <h2>רמזים</h2>
          <div class="hint-layout">
            <nav class="hint-list" aria-label="רשימת רמזים">${list}</nav>
            <div class="hint-content">${content}</div>
          </div>
          <div class="hint-actions">
            <button class="btn" data-action="hint-close" type="button">סגור</button>
          </div>
        </section>
      </div>`;
  }

  // XOR_HINT_SLIDES moved to js/app-data.js

  // XOR_HINT_NARRATION moved to js/app-data.js

  const preloadedHintSlides = new Set();

  function preloadHintSlides(slides = []) {
    slides.forEach((src) => {
      if (!src || preloadedHintSlides.has(src)) return;
      const image = new Image();
      image.src = src;
      preloadedHintSlides.add(src);
    });
  }

  function xorHintTruthRows() {
    return [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 0 }
    ];
  }

  function xorHintHighlightedRows(index) {
    if (index === 1 || index === 2) return new Set([1, 2]);
    if (index === 3) return new Set([1]);
    return new Set();
  }

  function renderXorHintTruthTable(index) {
    const highlighted = xorHintHighlightedRows(index);
    return `
      <section class="xor-hint-truth-table workspace-task-hint" aria-label="טבלת אמת של XOR">
        <table class="workspace-task-hint-table">
          <thead>
            <tr>
              <th class="truth-output-cell">יציאה</th>
              <th>כניסה 1</th>
              <th>כניסה 2</th>
            </tr>
          </thead>
          <tbody>
            ${xorHintTruthRows().map((row, rowIndex) => `
              <tr class="${highlighted.has(rowIndex) ? "truth-row-active" : ""}">
                <td class="truth-output-cell">${row.output}</td>
                <td>${row.inputs[0]}</td>
                <td>${row.inputs[1]}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </section>`;
  }

  function postTasksXorHintSlidesActive() {
    return Boolean(
      state.hintSlides?.taskId === "Xor" &&
      state.hintSlides?.returnTo?.mode === "continue-story" &&
      state.hintSlides?.returnTo?.chapterId === "chapter-6"
    );
  }

  function hintSlidesList() {
    if (!state.hintSlides) return [];
    const allSlides = state.hintSlides.taskId === "Xor" ? XOR_HINT_SLIDES : [];
    const limit = Number(state.hintSlides.limit);
    return Number.isInteger(limit) && limit > 0 ? allSlides.slice(0, limit) : allSlides;
  }

  function currentHintSlideIndex() {
    const slides = hintSlidesList();
    return Math.min(Math.max(Number(state.hintSlides?.index) || 0, 0), Math.max(slides.length - 1, 0));
  }

  function currentHintSlideReadText() {
    if (!state.hintSlides) return "";
    const index = currentHintSlideIndex();
    if (state.hintSlides.taskId === "Xor") return XOR_HINT_NARRATION[index] || "";
    return "";
  }

  function replayCurrentNarration() {
    stopSpeech();
    speakCurrent();
  }

  function skipInlineXorHintToChapterLastPanel() {
    if (!postTasksXorHintSlidesActive()) return closeHintSlides();

    const returnTo = state.hintSlides?.returnTo || {};
    const chapter = chapterById(returnTo.chapterId || "chapter-6");
    const scene = SCENES[returnTo.sceneId] || sceneByChapter(chapter);
    const lastPanelIndex = Math.max(scene.panels.length - 1, 0);

    return setState({
      ...transientUiClearPatch(),
      screen: "story",
      chapterId: chapter.id,
      sceneId: scene.id,
      panelIndex: lastPanelIndex,
      started: true,
      hintSlides: null,
      replayNonce: state.replayNonce + 1
    }, true);
  }

  function renderHintSlides() {
    if (!state.hintSlides) return;
    const slides = hintSlidesList();
    if (!slides.length) return;
    preloadHintSlides(slides);
    const index = Math.min(Math.max(Number(state.hintSlides.index) || 0, 0), slides.length - 1);
    const imageSrc = `${slides[index]}?r=${state.replayNonce}`;
    const inlineChapterHint = postTasksXorHintSlidesActive();

    app.innerHTML = `
      ${topbar()}
      <main class="screen story-screen hint-slides-screen">
        <section class="image-stage image-stage-no-year">
          <div class="image-frame">
            <div class="image-shell">
              <object class="panel-image hint-slide-image" data="${esc(imageSrc)}" type="image/svg+xml" width="1448" height="1086" aria-label="רמז XOR ${index + 1}" role="img"></object>
              ${renderXorHintTruthTable(index)}
            </div>
          </div>
        </section>
        <section class="controls">
          ${navButton("hint-slides-prev", "arrow-right", explanationReplayActive("truth-table-cards") && index === 0 ? "חזרה לתפריט ההסברים" : "הקודם")}
          ${navButton("hint-slides-replay", "restart", "הקרא שוב")}
          ${inlineChapterHint
            ? `<button class="btn" data-action="hint-slides-skip-to-chapter-last" type="button">דלג</button>`
            : (explanationReplayActive("truth-table-cards")
              ? `<button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>`
              : `<button class="btn" data-action="hint-slides-close" type="button">דלג</button>`)}
          ${navButton("hint-slides-next", "arrow-left", "המשך", { primary: true })}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>
      </main>`;
  }

  function renderNandBuildHelpScreen() {
    const backAction = explanationReplayActive("build-nand") ? "explanations-return-to-menu" : "back-to-workspace";
    const backLabel = explanationReplayActive("build-nand") ? "חזרה לתפריט ההסברים" : "חזרה לשולחן העבודה";
    app.innerHTML = `
      ${topbar()}
      <main class="screen nand-build-help-screen">
        <section class="nand-build-help-card">
          <p>
            חלק זה של המשחק עדיין בבנייה. אתה יכול בינתיים לשמוע על זה
            <a href="https://youtu.be/LIXkBWvEq5Y?t=253" target="_blank" rel="noopener noreferrer">כאן</a>.
          </p>
        </section>
        <section class="controls">
          <button class="btn btn-primary" data-action="${backAction}">${backLabel}</button>
        </section>
      </main>`;
  }

  // NAND_MONOLOGUE_TEXTS moved to js/app-data.js

    function renderNoteTaskDialog() {
    if (!state.taskDialog) return "";

    const message = state.taskDialog.message
      ? `<p class="note-task-message">${esc(state.taskDialog.message)}</p>`
      : "";
    const taskDefs = currentNoteTaskDefs();

    return `
      <div class="note-task-overlay" role="presentation">
        <section class="note-task-card" role="dialog" aria-modal="false" aria-label="רשימת משימות">
          <h2>משימות</h2>
          <ol class="note-task-list">
            ${taskDefs.map((task, index) => {
              const completed = routingNoteDialogActive() ? false : taskCompleted(task.id);
              const locked = routingNoteDialogActive() ? false : !taskUnlocked(task.id);
              return `
                <li class="${completed ? "task-completed" : ""} ${locked ? "task-locked" : ""}">
                  <span class="note-task-check" aria-hidden="true">${completed ? "✓" : ""}</span>
                  <button class="note-task-button" data-action="note-task" data-task-index="${index}" type="button" aria-disabled="${locked ? "true" : "false"}">${esc(task.label)}</button>
                </li>`;
            }).join("")}
          </ol>
          ${message}
          <div class="note-task-actions">
            <button class="btn" data-action="note-task-close">סגור</button>
          </div>
        </section>
      </div>`;
  }

  function renderWorkspace() {
    const evaluation = evaluateWorkspace();
    app.innerHTML = `
      ${topbar()}
      <main class="screen workspace-screen">
        <section class="workspace-layout">
          ${renderToolbar()}
          <section class="workspace-board-wrap">
            <div class="workspace-board" data-workspace-board>
              <svg class="workspace-canvas" data-workspace-svg  aria-label="שולחן עבודה אלקטרוני" role="img">
                <rect class="workspace-board-bg" x="0" y="0" width="100%" height="100%" rx="18" />
                <g class="workspace-task-shell-layer">
                  ${renderWorkspaceTaskShell()}
                </g>
                <g class="workspace-wire-layer">
                  ${renderWires()}
                  <line id="workspace-draft-wire" class="wire-line wire-line-draft" x1="0" y1="0" x2="0" y2="0" hidden />
                </g>
                <g class="workspace-component-layer">
                  ${state.workspace.components.map((component) => renderComponent(component, evaluation)).join("")}
                </g>
                <g class="workspace-terminal-layer">
                  ${renderTerminals()}
                </g>
              </svg>
              ${renderNotTaskHint()}
              ${renderSolutionDialog()}
              ${renderWorkspaceNandMonologue()}
            </div>
          </section>
        </section>
        ${explanationReplayActive("nand-function") ? renderNandFunctionExplanationControls() : `
        <section class="controls">
          ${navButton("workspace-reset", "restart", "נקה שולחן")}
          ${workspaceNandMonologueActive() ? `
            ${navButton("nand-monologue-prev", "arrow-right", "הקודם")}
            ${navButton("next", "arrow-left", "המשך", { primary: true })}
          ` : ""}
          ${renderWorkspaceReturnButton()}
          ${renderWorkspaceSkipButton()}
          ${renderNotTaskCheckButton()}
          ${renderHintButton()}
          ${renderWorkspaceBuildHelpButton()}
          ${renderWorkspaceUnderstoodButton()}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>`}
      </main>
      ${renderWorkspaceUnderstoodPrompt()}
      ${renderWorkspaceBuildHelpPrompt()}
      ${renderWorkspaceTaskIntro()}
      ${renderWorkspaceAccidentModal()}
      ${renderNotTestResultDialog()}
      ${renderHintDialog()}`;
  }

  function activeMonologueNandComponent() {
    return state.workspace?.components?.find((component) => component.type === "nand") || null;
  }

  function positionWorkspaceNandMonologue() {
    if (!workspaceNandMonologueActive()) return;

    const board = app.querySelector("[data-workspace-board]");
    const speech = app.querySelector("[data-nand-speech]");
    if (!board || !speech) return;

    const nand = activeMonologueNandComponent();
    if (!nand) return;

    const boardRect = board.getBoundingClientRect();
    if (!boardRect.width || !boardRect.height) return;

    const step = Math.min(Math.max(state.workspace.nandMonologueStep, 0), NAND_MONOLOGUE_TEXTS.length - 1);
    const bounds = componentDef(nand.type)?.bounds || { left: 64, right: 84, top: 46, bottom: 46 };
    const boardW = boardRect.width;
    const boardH = boardRect.height;
    const nandRight = nand.x + bounds.right;
    const nandTop = nand.y - bounds.top;
    const nandCenterX = nand.x;
    const gapX = 24;
    const gapY = 16;
    const margin = 12;

    const availableRight = boardW - (nandRight + gapX) - margin;
    const preferredW = step === 2 ? 720 : 560;
    const minW = step === 2 ? 360 : 300;
    const useWideTopBubble = step === 2 && availableRight < 460;

    let speechW = useWideTopBubble
      ? Math.min(preferredW, Math.max(minW, boardW - 2 * margin))
      : (availableRight >= minW
        ? Math.min(preferredW, availableRight)
        : Math.min(preferredW, Math.max(minW, boardW - 2 * margin)));

    speech.style.width = `${speechW}px`;

    const availableAbove = nandTop - margin - gapY;
    const maxPreferredH = step === 2 ? 320 : 265;
    const maxSpeechH = Math.max(130, Math.min(maxPreferredH, availableAbove));
    speech.style.maxHeight = `${maxSpeechH}px`;
    speech.style.setProperty("--speech-content-max", `${Math.max(84, maxSpeechH - 26)}px`);

    const speechRect = speech.getBoundingClientRect();
    const speechH = Math.min(speechRect.height || maxSpeechH, maxSpeechH);

    let left = useWideTopBubble
      ? boardW - speechW - margin
      : (availableRight >= minW
        ? nandRight + gapX
        : Math.min(boardW - speechW - margin, Math.max(margin, nandRight + gapX)));

    left = Math.min(boardW - speechW - margin, Math.max(margin, left));

    let top = nandTop - speechH - gapY;
    top = Math.min(boardH - speechH - margin, Math.max(margin, top));

    // The bubble should stay above the NAND and avoid covering it.
    if (top + speechH > nandTop - 8) {
      top = Math.max(margin, nandTop - speechH - 8);
    }

    speech.style.left = `${left}px`;
    speech.style.top = `${top}px`;

    const tailLeft = Math.min(speechW - 54, Math.max(24, nandCenterX - left + 34));
    speech.style.setProperty("--nand-tail-left", `${tailLeft}px`);

    const table = app.querySelector(".nand-truth-table");
    if (table) {
      const tableRect = table.getBoundingClientRect();
      const tableW = tableRect.width || 330;
      const tableH = tableRect.height || 220;

      let tableLeft = left - tableW - 26;
      if (tableLeft < margin) {
        tableLeft = left + speechW + 26;
      }
      if (tableLeft + tableW > boardW - margin) {
        tableLeft = Math.max(margin, left - tableW - 26);
      }
      tableLeft = Math.min(boardW - tableW - margin, Math.max(margin, tableLeft));

      let tableTop = top;
      tableTop = Math.min(boardH - tableH - margin, Math.max(margin, tableTop));

      table.style.left = `${tableLeft}px`;
      table.style.top = `${tableTop}px`;
    }
  }

  function render() {
    syncExplanationUnlocks();
    if (state.hintSlides) return renderHintSlides();
    if (state.screen === "menu") return renderMenu();
    if (state.screen === "explanations") return renderExplanationsMenu();
    if (state.screen === "about") return renderAbout();
    if (state.screen === "chapters") return renderChapters();
    if (state.screen === "nandBuildHelp") return renderNandBuildHelpScreen();

    if (state.screen === "workspace") {
      renderWorkspace();
      if (workspaceAccidentActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='workspace-accident-ok']")?.focus());
      } else if (workspaceBuildHelpPromptActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='build-help-yes']")?.focus());
      } else if (workspaceUnderstoodPromptActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='understood-yes']")?.focus());
      }
      if (workspaceNandMonologueActive()) {
        requestAnimationFrame(positionWorkspaceNandMonologue);
      }
      return;
    }
    renderStory();
    if (state.dialog) {
      requestAnimationFrame(() => app.querySelector("[data-action='dialog-yes']")?.focus());
    }
  }

  function openChapter(chapterId) {
    const chapter = CHAPTERS.find((c) => c.id === chapterId) || CHAPTERS[0];
    setState({
      ...transientUiClearPatch(),
      screen: "story",
      chapterId: chapter.id,
      sceneId: chapter.sceneId,
      panelIndex: 0,
      started: true,
      replayNonce: state.replayNonce + 1,
      workspace: createDefaultWorkspace()
    }, true);
  }

  function openWorkspace() {
    const workspace = normalizeWorkspace(state.workspace);
    const session = workspace.workspaceSession === 2 ? 2 : 1;

    workspace.unlocked = true;
    workspace.selectedTerminal = null;
    workspace.workspaceLaunchPanelIndex = state.panelIndex;
    workspace.workspaceCompleted = false;
    workspace.workspaceSession = session;
    workspace.exitTargetPanelIndex = session === 2
      ? secondWorkspaceExitTarget().panelIndex
      : firstWorkspaceExitTarget().panelIndex;
    workspace.returnToWorkspaceAfterMonologue = false;

    if (session === 2) {
      workspace.helpPromptSeen = true;
      workspace.buildHelpButtonVisible = true;
      workspace.understoodPromptShown = false;
      workspace.understoodButtonVisible = true;
      workspace.nandOutputObserved = { zero: true, one: true };
      workspace.nandMonologueStep = null;
    }

    setState({
      screen: "workspace",
      started: true,
      dialog: null,
      workspace
    }, false);
  }

  function nextPanel() {
    if (state.screen === "workspace") {
      if (workspaceNandMonologueActive()) return advanceNandMonologue();
      return;
    }

    const scene = currentScene();
    if (isWorkspaceLaunchPoint()) return openWorkspace();

    if (shouldShowPostTasksXorHint()) return openPostTasksXorHintSlides();

    if (state.panelIndex < scene.panels.length - 1) {
      return setState({ panelIndex: state.panelIndex + 1, started: true, replayNonce: state.replayNonce + 1, dialog: null }, true);
    }

    if (isHelpDecisionPoint()) return setState({ dialog: "helpPrompt" });

    const chapterIndex = chapterIndexById(state.chapterId);
    if (chapterIndex < CHAPTERS.length - 1) {
      const nextChapter = CHAPTERS[chapterIndex + 1];
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: nextChapter.id,
        sceneId: nextChapter.sceneId,
        panelIndex: 0,
        started: true,
        replayNonce: state.replayNonce + 1,
        workspace: state.workspace
      }, true);
    }

    return setState({ screen: "chapters", panelIndex: 0, replayNonce: state.replayNonce + 1, dialog: null });
  }

  function previousPanel() {
    if (state.screen === "workspace") {
      if (state.workspace?.workspaceSession === 2) {
        return setState({ ...secondWorkspaceExitTarget(), replayNonce: state.replayNonce + 1, workspace: state.workspace }, true);
      }

      const scene = currentScene();
      return setState({ screen: "story", panelIndex: workspaceLaunchPanelIndex(scene), replayNonce: state.replayNonce + 1 }, true);
    }

    if (state.panelIndex > 0) {
      if (state.chapterId === "chapter-6" && state.panelIndex === 1 && !xorInteractiveHintUsed()) {
        return openPostTasksXorHintSlides(3, 0);
      }
      return setState({ panelIndex: state.panelIndex - 1, started: true, replayNonce: state.replayNonce + 1, dialog: null }, true);
    }

    const chapterIndex = chapterIndexById(state.chapterId);
    if (chapterIndex > 0) {
      const prevChapter = CHAPTERS[chapterIndex - 1];
      const prevScene = SCENES[prevChapter.sceneId];
      return setState({
        screen: "story",
        chapterId: prevChapter.id,
        sceneId: prevChapter.sceneId,
        panelIndex: prevScene.panels.length - 1,
        started: true,
        replayNonce: state.replayNonce + 1,
        dialog: null,
        workspace: createDefaultWorkspace()
      }, true);
    }
  }

  function workspaceHelpFlags() {
    return {
      helpPromptSeen: Boolean(state.workspace?.helpPromptSeen),
      buildHelpButtonVisible: Boolean(state.workspace?.buildHelpButtonVisible),
      nandOutputObserved: state.workspace?.nandOutputObserved || { zero: false, one: false },
      understoodPromptShown: Boolean(state.workspace?.understoodPromptShown),
      understoodButtonVisible: Boolean(state.workspace?.understoodButtonVisible),
      nandMonologueStep: Number.isInteger(state.workspace?.nandMonologueStep) ? state.workspace.nandMonologueStep : null,
      workspaceLaunchPanelIndex: Number.isInteger(state.workspace?.workspaceLaunchPanelIndex)
        ? state.workspace.workspaceLaunchPanelIndex
        : null,
      workspaceCompleted: Boolean(state.workspace?.workspaceCompleted),
      workspaceSession: Number.isInteger(state.workspace?.workspaceSession) ? state.workspace.workspaceSession : 0,
      exitTargetPanelIndex: Number.isInteger(state.workspace?.exitTargetPanelIndex) ? state.workspace.exitTargetPanelIndex : null,
      returnToWorkspaceAfterMonologue: Boolean(state.workspace?.returnToWorkspaceAfterMonologue)
    };
  }

  function freshWorkspacePreservingHelp() {
    return { ...createDefaultWorkspace(), unlocked: true, ...workspaceHelpFlags() };
  }

  function resetWorkspaceCurrentMode() {
    const taskId = workspaceTaskId();
    if (taskId && taskDefById(taskId)) {
      const current = normalizeWorkspace(state.workspace);
      const workspace = standardTaskWorkspace(taskId);
      workspace.taskIntroSeen = true;
      // Preserve where this task must return to (e.g. the 2.3 routing worktable);
      // standardTaskWorkspace does not carry the session-return fields.
      workspace.sessionReturnChapterId = current.sessionReturnChapterId;
      workspace.sessionReturnPanelIndex = current.sessionReturnPanelIndex;
      workspace.exitTargetPanelIndex = current.exitTargetPanelIndex;
      return setState({ workspace, notTest: null, hintDialog: null, solutionDialog: null }, false);
    }
    return setState({ workspace: freshWorkspacePreservingHelp(), notTest: null }, false);
  }

  function restartPanel() {
    if (state.screen === "workspace") {
      return resetWorkspaceCurrentMode();
    }
    setState({ replayNonce: state.replayNonce + 1 }, true);
  }

  function resetWorkspaceAfterAccident() {
    stopSpeech();
    setState({ workspace: freshWorkspacePreservingHelp() }, false);
  }

  function dismissBuildHelpPrompt() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.helpPromptSeen = true;
    workspace.buildHelpButtonVisible = true;
    workspace.selectedTerminal = null;
    setState({ workspace }, false);
  }

  function openNandBuildHelp() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.helpPromptSeen = true;
    workspace.buildHelpButtonVisible = true;
    workspace.selectedTerminal = null;
    setState({ screen: "nandBuildHelp", workspace, dialog: null }, false);
  }

  function backToWorkspaceFromNandBuildHelp() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.helpPromptSeen = true;
    workspace.buildHelpButtonVisible = true;
    setState({ screen: "workspace", workspace, dialog: null }, false);
  }

  function dismissUnderstoodPrompt() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.understoodPromptShown = false;
    workspace.understoodButtonVisible = true;
    workspace.selectedTerminal = null;
    unlockExplanation("nand-function");
    setState({ workspace }, false);
  }

  function openUnderstoodPrompt() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.understoodPromptShown = true;
    workspace.understoodButtonVisible = false;
    workspace.selectedTerminal = null;
    setState({ workspace }, false);
  }

  function startNandMonologue() {
    const currentWorkspace = normalizeWorkspace(state.workspace);
    const session = currentWorkspace.workspaceSession === 2 ? 2 : 1;
    const exitTargetPanelIndex = session === 2
      ? secondWorkspaceExitTarget().panelIndex
      : firstWorkspaceExitTarget().panelIndex;

    const keepHelp = {
      helpPromptSeen: Boolean(currentWorkspace.helpPromptSeen),
      buildHelpButtonVisible: Boolean(currentWorkspace.buildHelpButtonVisible),
      workspaceLaunchPanelIndex: Number.isInteger(currentWorkspace.workspaceLaunchPanelIndex)
        ? currentWorkspace.workspaceLaunchPanelIndex
        : workspaceLaunchPanelIndex(),
      workspaceCompleted: false,
      workspaceSession: session,
      exitTargetPanelIndex,
      returnToWorkspaceAfterMonologue: false,
      // Preserve where this NAND session must return to (e.g. chapter 2.3),
      // otherwise the rebuilt workbench loses it and exit falls back to 2.2.
      sessionReturnChapterId: currentWorkspace.sessionReturnChapterId,
      sessionReturnPanelIndex: currentWorkspace.sessionReturnPanelIndex
    };

    setState({
      workspace: {
        ...createDefaultWorkspace(),
        unlocked: true,
        ...keepHelp,
        nandOutputObserved: { zero: true, one: true },
        understoodPromptShown: false,
        understoodButtonVisible: false,
        nandMonologueStep: 0
      }
    }, false);
  }

  function startSecondWorkspaceNandMonologue() {
    const originChapterId = state.chapterId;
    const originPanelIndex = Number.isInteger(state.panelIndex) ? state.panelIndex : null;
    const nandChapter = chapterById("chapter-4");
    const scene = sceneByChapter(nandChapter);
    const panel75Index = panelIndexByImage(scene, "panel75.png");

    // Replaying the NAND monologue from the final warehouse must not reuse the
    // previous workbench state. Start from the same clean workbench as the
    // first NAND workbench visit, with the "הבנת?" button already available.
    const workspace = {
      ...createDefaultWorkspace(),
      unlocked: true,
      selectedTerminal: null,
      wires: [],
      nextId: 2,
      workspaceLaunchPanelIndex: workspaceLaunchPanelIndex(scene),
      workspaceCompleted: false,
      workspaceSession: 2,
      exitTargetPanelIndex: secondWorkspaceExitTarget().panelIndex,
      returnToWorkspaceAfterMonologue: false,
      helpPromptSeen: true,
      buildHelpButtonVisible: true,
      understoodPromptShown: false,
      understoodButtonVisible: true,
      nandOutputObserved: { zero: true, one: true },
      nandMonologueStep: null,
      accident: null,
      sessionReturnChapterId: originChapterId,
      sessionReturnPanelIndex: originPanelIndex,
      taskId: null,
      taskIntroSeen: false
    };

    setState({
      screen: "story",
      chapterId: nandChapter.id,
      sceneId: scene.id,
      panelIndex: panel75Index >= 0 ? panel75Index : 0,
      replayNonce: state.replayNonce + 1,
      dialog: null,
      started: true,
      workspace
    }, true);
  }

  function exitNandMonologueToWorkspace() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.nandMonologueStep = null;
    workspace.understoodPromptShown = false;
    workspace.understoodButtonVisible = true;
    workspace.selectedTerminal = null;
    workspace.workspaceCompleted = false;
    setState({ workspace }, false);
  }

  function previousNandMonologue() {
    const workspace = normalizeWorkspace(state.workspace);
    const step = Number.isInteger(workspace.nandMonologueStep) ? workspace.nandMonologueStep : null;
    if (step === null) return;
    if (step <= 0) return exitNandMonologueToWorkspace();
    workspace.nandMonologueStep = step - 1;
    setState({ workspace }, false);
  }

  function advanceNandMonologue() {
    const workspace = normalizeWorkspace(state.workspace);
    const step = Number.isInteger(workspace.nandMonologueStep) ? workspace.nandMonologueStep : null;
    if (step === null) return;

    if (step < NAND_MONOLOGUE_TEXTS.length - 1) {
      workspace.nandMonologueStep = step + 1;
      return setState({ workspace }, false);
    }

    workspace.nandMonologueStep = null;
    workspace.understoodButtonVisible = false;
    workspace.selectedTerminal = null;
    workspace.workspaceCompleted = true;
    workspace.returnToWorkspaceAfterMonologue = false;

    const target = workspace.workspaceSession === 2
      ? secondWorkspaceExitTarget()
      : firstWorkspaceExitTarget();

    setState({
      ...target,
      replayNonce: state.replayNonce + 1,
      workspace
    }, true);
  }

  const TASK_TEST_FRAME = { x1: 200, y1: 100, x2: 800, y2: 476 };

  let notTestSnapshot = null;
  let notTestTimer = null;

  function clonePlain(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clearNotTestTimer() {
    if (notTestTimer) window.clearTimeout(notTestTimer);
    notTestTimer = null;
  }

  function currentTaskDef(workspace = state.workspace) {
    return taskDefById(workspace?.taskId);
  }

  function taskCardInputExtRef(index) {
    return `task-card-1.inputExt${index + 1}`;
  }

  function taskCardOutputExtRef() {
    return "task-card-1.outputExt";
  }

  function taskCardOutputIntRef() {
    return "task-card-1.outputInt";
  }

  // A task's outputs paired with the lamp that reads each one. Single-output
  // cards use the unnumbered outputExt and lamp-1; multi-output cards (the DMUX)
  // use outputExt{k} feeding lamp-{k}.
  function taskOutputLampPairs(task) {
    const count = task?.outputs || 1;
    if (count > 1) {
      return Array.from({ length: count }, (_, index) => ({
        outputRef: `task-card-1.outputExt${index + 1}`,
        lampId: `lamp-${index + 1}`
      }));
    }
    return [{ outputRef: "task-card-1.outputExt", lampId: "lamp-1" }];
  }

  // The expected output(s) of a truth-table row, as an array (multi-output rows
  // carry `outputs`, single-output rows the scalar `output`).
  function rowExpectedOutputs(row) {
    return Array.isArray(row.outputs) ? row.outputs : [row.output];
  }

  // The lamp component(s) a task needs on its workbench — one per output. The
  // DMUX's two lamps sit beside its two right-hand outputs.
  function taskLampComponents(taskId) {
    const count = taskDefById(taskId)?.outputs || 1;
    if (count > 1) {
      return [
        { id: "lamp-1", type: "lamp", x: 940, y: 158 },
        { id: "lamp-2", type: "lamp", x: 940, y: 358 }
      ];
    }
    return [{ id: "lamp-1", type: "lamp", x: 910, y: 258 }];
  }

  // --- MUX scratch truth table (chapter 2.3) -------------------------------
  // A learner-only thinking aid shown beside the MUX requirements. 8 rows, each
  // a set of cells that cycle blank -> 0 -> 1 -> blank. Columns are ordered
  // control, input 1, input 2, output. It is NOT validated — the task is still
  // completed by building the circuit and pressing "בדיקה". Interactive hints
  // can fill it. Held at top level (state.muxTable), reset when MUX opens.
  const MUX_TABLE_COLUMNS = ["control", "in1", "in2", "out"];
  let muxTableSnapshot = null;

  function createEmptyMuxTable() {
    return Array.from({ length: 8 }, () => ({ control: null, in1: null, in2: null, out: null }));
  }

  // A task row (inputs = [input1, input2, control]) as the scratch table shows it.
  function muxRowDisplay(row) {
    return {
      control: row.inputs[2] ? 1 : 0,
      in1: row.inputs[0] ? 1 : 0,
      in2: row.inputs[1] ? 1 : 0,
      out: row.output ? 1 : 0
    };
  }

  function muxTableWithInputs(withOutputs) {
    const rows = taskDefById("Mux")?.rows || [];
    return rows.map((row) => {
      const d = muxRowDisplay(row);
      return { control: d.control, in1: d.in1, in2: d.in2, out: withOutputs ? d.out : null };
    });
  }

  // The scratch table shown mid-check: the learner's own table, with only the
  // row currently under test temporarily filled with the correct values.
  function muxCheckDisplayTable(rowIndex) {
    const snap = Array.isArray(muxTableSnapshot) && muxTableSnapshot.length === 8
      ? muxTableSnapshot.map((row) => ({ ...row }))
      : createEmptyMuxTable();
    const row = taskDefById("Mux")?.rows?.[rowIndex];
    if (row) snap[rowIndex] = muxRowDisplay(row);
    return snap;
  }

  function currentMuxTable() {
    return Array.isArray(state.muxTable) && state.muxTable.length === 8
      ? state.muxTable
      : createEmptyMuxTable();
  }

  function cycleMuxCell(value) {
    if (value === null || value === undefined) return 0;
    if (value === 0) return 1;
    return null;
  }

  function handleMuxTruthCell(rowIndex, column) {
    if (state.workspace?.taskId !== "Mux") return;
    if (!MUX_TABLE_COLUMNS.includes(column)) return;
    if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex > 7) return;
    const table = currentMuxTable().map((row) => ({ ...row }));
    table[rowIndex][column] = cycleMuxCell(table[rowIndex][column]);
    setState({ muxTable: table }, false);
  }

  // Solution & task-test workbench builders live in js/solution-workspaces.js
  // (pure data builders; host helpers injected). Placed here because they need
  // The MUX solution circuit layout can be authored in assets/solutions/mux-*.svg
  // and is delivered via the same <object>+postMessage trick the panel hotspots
  // use (so it works from file:// too). Positions arrive keyed by layout name
  // ("generic" / "compact"); until then the hardcoded fallbacks are used.
  const muxSolutionLayouts = Object.create(null);
  function muxSolutionLayout(key) {
    return muxSolutionLayouts[key] || null;
  }

  // TASK_TEST_FRAME and the task-card ref helpers defined just above. Thin
  // wrappers keep existing call sites unchanged.
  const __solutionWorkspaces = createSolutionWorkspaces({
    normalizeWorkspace, createDefaultWorkspace, normalizeWire, clonePlain,
    removeInvalidWires, removeWiresAt, addTestWire, taskDefById, taskCardComponentType,
    currentTaskDef, taskCardOutputExtRef, taskCardInputExtRef, taskOutputLampPairs, taskLampComponents, secondWorkspaceExitTarget,
    TASK_TEST_FRAME, muxSolutionLayout
  });
  const standardTaskWorkspace = (...args) => __solutionWorkspaces.standardTaskWorkspace(...args);
  const cleanedWorkspaceForTaskTest = (...args) => __solutionWorkspaces.cleanedWorkspaceForTaskTest(...args);
  const workspaceForTaskTestRow = (...args) => __solutionWorkspaces.workspaceForTaskTestRow(...args);
  const solutionWorkspaceForTask = (...args) => __solutionWorkspaces.solutionWorkspaceForTask(...args);

  // If a fresh SVG layout arrives while a MUX solution is on screen, rebuild it
  // in place so the new positions apply immediately.
  function refreshMuxSolutionIfShown() {
    if (state.solutionDialog?.taskId !== "Mux") return;
    const step = Number(state.solutionDialog.step) || 0;
    const workspace = solutionWorkspaceForTask("Mux", step);
    workspace.sessionReturnChapterId = state.workspace?.sessionReturnChapterId || workspace.sessionReturnChapterId;
    if (Number.isInteger(state.workspace?.sessionReturnPanelIndex)) {
      workspace.sessionReturnPanelIndex = state.workspace.sessionReturnPanelIndex;
    }
    setState({ workspace }, false);
  }

  window.addEventListener("message", (event) => {
    const data = event?.data;
    if (!data || data.__muxSolutionLayout !== true || !data.payload) return;
    const { key, components, connections } = data.payload;
    if (!key || !Array.isArray(components)) return;
    const map = Object.create(null);
    components.forEach((c) => {
      if (c && typeof c.id === "string" && Number.isFinite(c.x) && Number.isFinite(c.y)) {
        map[c.id] = { x: c.x, y: c.y };
      }
    });
    // The SVG also derives the netlist from its own wire elements (each wire's
    // endpoints snapped to the nearest pin), so hand-drawn wires in the editor
    // drive the shown solution too. Keep only well-formed ref pairs.
    const conns = Array.isArray(connections)
      ? connections.filter((pair) =>
          Array.isArray(pair) && pair.length === 2 &&
          typeof pair[0] === "string" && typeof pair[1] === "string" && pair[0] !== pair[1])
      : null;
    muxSolutionLayouts[key] = { components: map, connections: conns };
    refreshMuxSolutionIfShown();
  });

  function loadMuxSolutionLayouts() {
    const holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;";
    ["generic", "compact"].forEach((key) => {
      const obj = document.createElement("object");
      obj.type = "image/svg+xml";
      obj.data = `assets/solutions/mux-${key}.svg`;
      holder.appendChild(obj);
    });
    document.body.appendChild(holder);
  }

  function showNotTestResult(result, workspace, taskId) {
    clearNotTestTimer();
    const patch = {
      workspace,
      notTest: { result, taskId }
    };
    if (result === "failure" && taskHasHints(taskId)) {
      patch.hintState = recordHintFailure(taskId);
    }
    setState(patch, false);
  }

  function runNotTestRow(baseWorkspace, rowIndex) {
    const task = currentTaskDef(baseWorkspace);
    if (!task) return showNotTestResult("failure", baseWorkspace, null);
    if (!task.rows[rowIndex]) return showNotTestResult("success", baseWorkspace, task.id);

    const row = task.rows[rowIndex];
    const workspace = workspaceForTaskTestRow(baseWorkspace, row);

    setState({
      workspace,
      notTest: { active: true, taskId: task.id, rowIndex },
      // For MUX, temporarily fill the row under test in the scratch table.
      ...(task.id === "Mux" ? { muxTable: muxCheckDisplayTable(rowIndex) } : {})
    }, false);

    notTestTimer = window.setTimeout(() => {
      const evaluation = evaluateWorkspace(workspace);
      const expected = rowExpectedOutputs(row);
      const pairs = taskOutputLampPairs(task);
      const ok = pairs.every((pair, index) => Boolean(evaluation.lamps.get(pair.lampId)) === Boolean(expected[index]));
      if (!ok) return showNotTestResult("failure", workspace, task.id);
      runNotTestRow(workspace, rowIndex + 1);
    }, 850);
  }

  function startNotTaskTest() {
    if (!isNotTaskWorkspace() || notTestActive()) return;
    clearNotTestTimer();
    notTestSnapshot = clonePlain(state.workspace);
    muxTableSnapshot = Array.isArray(state.muxTable) ? state.muxTable.map((row) => ({ ...row })) : null;
    const testWorkspace = cleanedWorkspaceForTaskTest(state.workspace);
    runNotTestRow(testWorkspace, 0);
  }

  function finishNotTestDialog() {
    if (state.notTest?.result === "failure") {
      const workspace = notTestSnapshot ? normalizeWorkspace(notTestSnapshot) : state.workspace;
      notTestSnapshot = null;
      // Restore the learner's own scratch table (the check filled rows into it).
      const restoreMux = Array.isArray(muxTableSnapshot) ? { muxTable: muxTableSnapshot } : {};
      muxTableSnapshot = null;
      return setState({ workspace, notTest: null, ...restoreMux }, false);
    }

    if (state.notTest?.result === "success") {
      const taskId = state.notTest.taskId;
      notTestSnapshot = null;
      muxTableSnapshot = null;
      clearNotTestTimer();
      if (["Not", "And", "Or", "Xor", "AND3way", "OR4way"].includes(taskId) || taskHasSolutionWalkthrough(taskId)) return showTaskSolution(taskId, { completeOnClose: true });

      const completedTasks = taskId && !taskCompleted(taskId)
        ? [...completedTaskIds(), taskId]
        : completedTaskIds();

      return setState({
        ...secondWorkspaceExitTarget(),
        taskDialog: { message: "", ...(isRoutingTask(taskId) ? { mode: "routing" } : {}) },
        notTest: null,
        muxTable: null,
        completedTasks,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    setState({ notTest: null }, false);
  }

  function showTaskSolution(taskId, options = {}) {
    const routing = isRoutingTask(taskId);
    const chapter = routing ? chapterById("chapter-6") : simpleGatesChapter();
    const workspace = solutionWorkspaceForTask(taskId, 0);
    if (routing) {
      // Keep the return target so leaving the solution goes back to the 2.3 worktable.
      workspace.sessionReturnChapterId = state.workspace?.sessionReturnChapterId || state.chapterId;
      workspace.sessionReturnPanelIndex = Number.isInteger(state.workspace?.sessionReturnPanelIndex)
        ? state.workspace.sessionReturnPanelIndex
        : (Number.isInteger(state.panelIndex) ? state.panelIndex : null);
    }
    setState({
      screen: "workspace",
      chapterId: chapter.id,
      sceneId: chapter.sceneId,
      started: true,
      dialog: null,
      taskDialog: null,
      hintDialog: null,
      solutionTableHidden: false,
      notTest: null,
      // Show the full, correct truth table during the MUX walkthrough so the
      // highlighted rows are meaningful.
      muxTable: taskId === "Mux" ? muxTableWithInputs(true) : null,
      solutionDialog: { taskId, completeOnClose: options.completeOnClose !== false, step: 0 },
      workspace
    }, false);
  }

  function openBitDialog(returnToNote = false) {
    setState({ bitDialog: { step: 0, returnToNote: Boolean(returnToNote) } }, false);
  }

  function advanceBitDialog() {
    if (!state.bitDialog) return;
    const step = Math.min(Math.max(Number(state.bitDialog.step) || 0, 0), BIT_EXPLANATION_STEPS.length - 1);
    if (step >= BIT_EXPLANATION_STEPS.length - 1) return finishBitDialog();
    setState({ bitDialog: { ...state.bitDialog, step: step + 1 } }, false);
  }

  function finishBitDialog() {
    if (!state.bitDialog) return;
    if (explanationReplayActive("bit-info")) {
      return returnToExplanationsMenuFromReplay();
    }
    const returnToNote = Boolean(state.bitDialog.returnToNote);
    if (returnToNote) {
      return setState({ bitDialog: null, taskDialog: { message: "" } }, false);
    }
    return setState({ bitDialog: null }, false);
  }

  function finishSolutionDialog() {
    const taskId = state.solutionDialog?.taskId || "Not";
    const shouldComplete = Boolean(state.solutionDialog?.completeOnClose);
    const completedTasks = shouldComplete && taskId && !taskCompleted(taskId)
      ? [...completedTaskIds(), taskId]
      : completedTaskIds();

    if (shouldComplete && allNoteTasksCompletedIn(completedTasks)) {
      return setState({
        ...chapter23StartTarget(),
        taskDialog: null,
        solutionDialog: null,
        notTest: null,
        hintDialog: null,
        bitDialog: null,
        completedTasks,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    if (taskId === "And") {
      return setState({
        ...secondWorkspaceExitTarget(),
        taskDialog: null,
        solutionDialog: null,
        notTest: null,
        hintDialog: null,
        bitDialog: { step: 0, returnToNote: true },
        bitInfoUnlocked: true,
        completedTasks,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    return setState({
      ...secondWorkspaceExitTarget(),
      taskDialog: { message: "", ...(isRoutingTask(taskId) ? { mode: "routing" } : {}) },
      solutionDialog: null,
      notTest: null,
      hintDialog: null,
      muxTable: null,
      completedTasks,
      workspace: createDefaultWorkspace(),
      replayNonce: state.replayNonce + 1
    }, true);
  }

  function advanceSolutionDialog() {
    if (!state.solutionDialog) return;
    const taskId = state.solutionDialog.taskId || "Not";
    const steps = TASK_SOLUTION_STEPS[taskId] || [];
    if (!steps.length) return finishSolutionDialog();
    const step = Math.min(Math.max(Number(state.solutionDialog.step) || 0, 0), steps.length - 1);
    if (step >= steps.length - 1) return finishSolutionDialog();
    const nextStep = step + 1;
    const nextWorkspace = solutionWorkspaceForTask(taskId, nextStep);
    if (isRoutingTask(taskId)) {
      // The rebuilt solution workspace must keep the 2.3 return target.
      nextWorkspace.sessionReturnChapterId = state.workspace?.sessionReturnChapterId || nextWorkspace.sessionReturnChapterId;
      if (Number.isInteger(state.workspace?.sessionReturnPanelIndex)) {
        nextWorkspace.sessionReturnPanelIndex = state.workspace.sessionReturnPanelIndex;
      }
    }
    setState({
      solutionDialog: { ...state.solutionDialog, step: nextStep },
      workspace: nextWorkspace
    }, false);
  }

  function closeHintDialog() {
    setState({ hintDialog: null }, false);
  }

  function selectHint(index) {
    const taskId = state.hintDialog?.taskId || workspaceTaskId() || "Not";
    const unlocked = unlockedHintCount(taskId);
    const rawIndex = Number(index);
    const safeIndex = Math.min(Math.max(Number.isFinite(rawIndex) ? rawIndex : 0, 0), Math.max(0, unlocked - 1));
    const nextHintState = markHintSeen(taskId, safeIndex + 1);
    const hint = taskHints(taskId)[safeIndex];
    if (hint?.kind === "interactive" && hint.openAfterApply) {
      return applyInteractiveTaskHint(taskId, safeIndex, nextHintState);
    }
    setState({
      hintState: nextHintState,
      hintDialog: { taskId, index: safeIndex }
    }, false);
  }

  function selectSolutionHint() {
    const taskId = state.hintDialog?.taskId || workspaceTaskId() || "Not";
    if (!solutionAvailable(taskId)) return;
    setState({ hintDialog: { taskId, index: taskHints(taskId).length } }, false);
  }

  function baseTaskHintComponents(taskId, workspace) {
    const source = componentById(workspace, "source-1") || { id: "source-1", type: "source", x: taskId === "Mux" ? 45 : 80, y: 288 };
    const card = componentById(workspace, "task-card-1") || { id: "task-card-1", type: taskCardComponentType(taskId), x: 500, y: 288 };
    const lamp = componentById(workspace, "lamp-1") || { id: "lamp-1", type: "lamp", x: 910, y: 258 };
    return [clonePlain(source), clonePlain(card), clonePlain(lamp)];
  }

  function applyInteractiveTaskHint(taskId, hintIndex, hintStateOverride = null) {
    if (state.workspace?.taskId !== taskId) return;
    const hints = taskHints(taskId);
    const hint = hints[hintIndex];
    if (!hint || hint.kind !== "interactive") return;

    if (taskId === "Xor" && hint.action === "xor-slides") {
      preloadHintSlides(XOR_HINT_SLIDES);
      const patch = {
        hintDialog: null,
        hintSlides: { taskId: "Xor", index: 0, returnTo: { screen: "workspace" } }
      };
      if (hintStateOverride) patch.hintState = hintStateOverride;
      return setState(patch, false);
    }

    // MUX interactive hints fill the scratch truth table; they leave the
    // learner's built circuit untouched.
    if (taskId === "Mux" && (hint.action === "mux-fill-inputs" || hint.action === "mux-fill-outputs")) {
      const patch = {
        hintDialog: null,
        muxTable: muxTableWithInputs(hint.action === "mux-fill-outputs")
      };
      if (hintStateOverride) patch.hintState = hintStateOverride;
      return setState(patch, false);
    }

    const workspace = normalizeWorkspace(clonePlain(state.workspace));
    workspace.components = baseTaskHintComponents(taskId, workspace);
    workspace.wires = [];
    workspace.nextId = 2;
    workspace.selectedTerminal = null;
    workspace.accident = null;
    workspace.unlocked = true;
    workspace.taskIntroSeen = true;

    if (taskId === "Not") {
      const nand = { id: "nand-1", type: "nand", x: 500, y: 288 };
      workspace.components.push(nand);
      if (hint.action === "connect-not-input-to-nand") {
        workspace.wires.push(normalizeWire("task-card-1.inputInt1", "nand-1.in1"));
        workspace.wires.push(normalizeWire("task-card-1.inputInt1", "nand-1.in2"));
      }
    }

    if (taskId === "And") {
      const nand1 = { id: "nand-1", type: "nand", x: 420, y: 288 };
      workspace.components.push(nand1);
      if (["and-place-first-nand", "and-place-first-nand-explained"].includes(hint.action)) {
        workspace.wires.push(normalizeWire("task-card-1.inputInt1", "nand-1.in1"));
        workspace.wires.push(normalizeWire("task-card-1.inputInt2", "nand-1.in2"));
      }
    }

    if (taskId === "Or") {
      workspace.components.push(
        { id: "not-1", type: "gate-Not", x: 360, y: 218 },
        { id: "not-2", type: "gate-Not", x: 360, y: 358 }
      );
      if (hint.action === "or-connect-inputs-to-not") {
        workspace.wires.push(normalizeWire("task-card-1.inputInt1", "not-1.in1"));
        workspace.wires.push(normalizeWire("task-card-1.inputInt2", "not-2.in1"));
      }
    }

    const patch = {
      workspace: normalizeWorkspace(workspace),
      hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
    };
    if (hintStateOverride) patch.hintState = hintStateOverride;
    setState(patch, false);
  }

  function openHintFromButton() {
    if (!hintButtonVisible()) return;
    const taskId = workspaceTaskId();
    const progress = hintProgress(taskId);
    const unlocked = unlockedHintCount(taskId);
    const hints = taskHints(taskId);
    if (solutionAvailable(taskId)) {
      return setState({ hintDialog: { taskId, index: hints.length } }, false);
    }

    const index = progress.seen < unlocked
      ? progress.seen
      : Math.max(0, unlocked - 1);
    const nextHintState = markHintSeen(taskId, index + 1);
    const hint = hints[index];

    if (hint?.kind === "interactive" && progress.seen < unlocked && !hint.confirmBeforeApply) {
      return applyInteractiveTaskHint(taskId, index, nextHintState);
    }

    setState({
      hintState: nextHintState,
      hintDialog: { taskId, index }
    }, false);
  }

  function applySelectedHint(index) {
    const taskId = state.hintDialog?.taskId || workspaceTaskId() || "Not";
    const hints = taskHints(taskId);
    const rawIndex = Number(index);
    if (solutionAvailable(taskId) && rawIndex === hints.length) return showTaskSolution(taskId, { completeOnClose: true });
    const safeIndex = Math.min(Math.max(Number.isFinite(rawIndex) ? rawIndex : 0, 0), Math.max(0, unlockedHintCount(taskId) - 1));
    const hint = hints[safeIndex];
    if (hint?.kind === "interactive") return applyInteractiveTaskHint(taskId, safeIndex);
    return selectHint(safeIndex);
  }

  function returnToWorkspaceWarehouse() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.selectedTerminal = null;
    return setState({
      ...workspaceWarehouseTarget(),
      hintDialog: null,
      hintSlides: null,
      solutionDialog: null,
      notTest: null,
      workspace,
      replayNonce: state.replayNonce + 1
    }, true);
  }

  function openXorTableHelpFromStory() {
    preloadHintSlides(XOR_HINT_SLIDES);
    setState({
      hintSlides: {
        taskId: "Xor",
        index: 0,
        limit: 4,
        returnTo: {
          screen: "story",
          chapterId: state.chapterId,
          sceneId: state.sceneId,
          panelIndex: state.panelIndex,
          started: true,
          dialog: null
        }
      }
    }, false);
  }

  function continueStoryAfterHintSlides(returnTo) {
    const chapter = chapterById(returnTo?.chapterId || state.chapterId);
    const scene = SCENES[returnTo?.sceneId] || sceneByChapter(chapter);
    const panelIndex = Number.isInteger(returnTo?.panelIndex) ? returnTo.panelIndex : state.panelIndex;

    if (panelIndex < scene.panels.length - 1) {
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: chapter.id,
        sceneId: scene.id,
        panelIndex: panelIndex + 1,
        started: true,
        replayNonce: state.replayNonce + 1
      }, true);
    }

    const chapterIndex = chapterIndexById(chapter.id);
    if (chapterIndex >= 0 && chapterIndex < CHAPTERS.length - 1) {
      const nextChapter = CHAPTERS[chapterIndex + 1];
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: nextChapter.id,
        sceneId: nextChapter.sceneId,
        panelIndex: 0,
        started: true,
        replayNonce: state.replayNonce + 1,
        workspace: state.workspace
      }, true);
    }

    return setState({
      ...transientUiClearPatch(),
      screen: "chapters",
      panelIndex: 0,
      replayNonce: state.replayNonce + 1
    }, false);
  }

  function returnToStoryFromHintSlides(returnTo = state.hintSlides?.returnTo) {
    if (!returnTo || returnTo.screen !== "story") return setState({ hintSlides: null }, false);
    return setState({
      ...transientUiClearPatch(),
      ...returnTo,
      hintSlides: null,
      replayNonce: state.replayNonce + 1
    }, true);
  }

  function closeHintSlides(completed = false) {
    const currentSlides = state.hintSlides;
    if (explanationReplayActive("truth-table-cards")) {
      return returnToExplanationsMenuFromReplay();
    }

    const unlockXorHelp = Boolean(completed && currentSlides?.taskId === "Xor");
    const returnTo = currentSlides?.returnTo;
    const patch = {
      hintSlides: null,
      ...(unlockXorHelp ? { xorTableHelpUnlocked: true } : {})
    };

    if (returnTo?.mode === "continue-story") {
      setState(patch, false);
      return continueStoryAfterHintSlides(returnTo);
    }

    if (returnTo?.screen === "story") {
      return setState({
        ...returnTo,
        ...patch,
        replayNonce: state.replayNonce + 1
      }, true);
    }

    return setState({ ...patch, screen: "workspace" }, false);
  }

  function previousHintSlide() {
    if (!state.hintSlides) return;
    const slides = hintSlidesList();
    const index = Math.min(Math.max(Number(state.hintSlides.index) || 0, 0), Math.max(slides.length - 1, 0));
    if (index <= 0) {
      if (postTasksXorHintSlidesActive()) return returnToStoryFromHintSlides();
      return closeHintSlides();
    }
    setState({ hintSlides: { ...state.hintSlides, index: index - 1 } }, true);
  }

  function nextHintSlide() {
    if (!state.hintSlides) return;
    const slides = hintSlidesList();
    const index = Math.min(Math.max(Number(state.hintSlides.index) || 0, 0), Math.max(slides.length - 1, 0));
    if (index >= slides.length - 1) return closeHintSlides(true);
    setState({ hintSlides: { ...state.hintSlides, index: index + 1 } }, true);
  }

  function dismissWorkspaceTaskIntro() {
    withWorkspace((workspace) => {
      workspace.taskIntroSeen = true;
    });
  }

  function openNoteTaskDialog() {
    setState({ taskDialog: { message: "" } }, false);
  }

  function openRoutingNoteTaskDialog() {
    setState({ taskDialog: { message: "", mode: "routing" } }, false);
  }

  function closeNoteTaskDialog() {
    if (state.chapterId === "chapter-5" && allNoteTasksCompletedIn()) {
      return setState({
        ...chapter23StartTarget(),
        taskDialog: null,
        notTest: null,
        hintDialog: null,
        hintSlides: null,
        solutionDialog: null,
        bitDialog: null,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    setState({ taskDialog: null }, false);
  }

  function noteTaskBlocked(taskId) {
    setState({ taskDialog: { message: taskLockedMessage(taskId) } }, false);
  }

  function isRoutingTask(taskId) {
    return ROUTING_TASK_DEFS.some((task) => task.id === taskId);
  }

  function openTaskWorkspace(taskId) {
    const task = taskDefById(taskId);
    if (!task) return;
    // Routing tasks (chapter 2.3) return to the routing worktable the learner
    // came from; the simple gates (2.2) fall back to their usual exit target.
    const routing = isRoutingTask(taskId);
    const chapter = routing ? chapterById("chapter-6") : simpleGatesChapter();
    const sessionReturnChapterId = routing ? state.chapterId : null;
    const sessionReturnPanelIndex = routing && Number.isInteger(state.panelIndex) ? state.panelIndex : null;
    const workspace = {
      ...createDefaultWorkspace(),
      components: [
        { id: "source-1", type: "source", x: task.id === "Mux" ? 45 : 80, y: 288 },
        { id: "task-card-1", type: taskCardComponentType(task.id), x: 500, y: 288 },
        ...taskLampComponents(task.id)
      ],
      wires: [],
      nextId: 2,
      unlocked: true,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      nandMonologueStep: null,
      workspaceCompleted: false,
      workspaceSession: 2,
      exitTargetPanelIndex: routing ? sessionReturnPanelIndex : secondWorkspaceExitTarget().panelIndex,
      sessionReturnChapterId,
      sessionReturnPanelIndex,
      taskId: task.id,
      taskIntroSeen: false
    };

    setState({
      screen: "workspace",
      chapterId: chapter.id,
      sceneId: chapter.sceneId,
      started: true,
      dialog: null,
      taskDialog: null,
      muxTable: taskId === "Mux" ? createEmptyMuxTable() : null,
      workspace
    }, false);
  }

  function openNotTaskWorkspace() {
    openTaskWorkspace("Not");
  }

  function handleNoteTask(index) {
    const defs = currentNoteTaskDefs();
    const task = defs[index];
    if (!task) return;
    if (routingNoteDialogActive()) {
      // Routing tasks that have a full definition (MUX) open a real build
      // workspace; the rest are still placeholders.
      if (taskDefById(task.id)) {
        if (taskCompleted(task.id) && taskHasSolutionWalkthrough(task.id)) return showTaskSolution(task.id, { completeOnClose: false });
        return openTaskWorkspace(task.id);
      }
      return setState({ taskDialog: { ...state.taskDialog, message: "כרגע המשחק נעצר כאן. המשך יבוא..." } }, false);
    }
    if (["Not", "And", "Or", "Xor", "AND3way", "OR4way"].includes(task.id) && taskCompleted(task.id)) return showTaskSolution(task.id, { completeOnClose: false });
    if (!taskUnlocked(task.id)) return noteTaskBlocked(task.id);
    openTaskWorkspace(task.id);
  }

  function skipStory() {
    if (state.screen === "workspace") {
      if (state.workspace?.workspaceSession === 1) {
        const workspace = normalizeWorkspace(state.workspace);
        workspace.workspaceCompleted = true;
        return setState({ ...firstWorkspaceExitTarget(), replayNonce: state.replayNonce + 1, workspace }, true);
      }

      if (state.workspace?.workspaceSession === 2) {
        const workspace = normalizeWorkspace(state.workspace);
        workspace.workspaceCompleted = true;
        return setState({ ...secondWorkspaceExitTarget(), replayNonce: state.replayNonce + 1, workspace }, true);
      }

      return;
    }

    if (isSkipDisabled()) return;

    const chapter = currentChapter();
    const chapterIndex = chapterIndexById(chapter.id);

    if (chapter.partId === "part-1") {
      const nextChapter = CHAPTERS[chapterIndex + 1];
      if (nextChapter) return openChapter(nextChapter.id);
      return;
    }

    if (chapter.id === "chapter-4") return openWorkspace();

    const scene = currentScene();
    setState({ panelIndex: scene.panels.length - 1, started: true, replayNonce: state.replayNonce + 1, dialog: null }, true);
  }

  function toggleSound() {
    const next = !state.soundOn;
    setState({ soundOn: next }, false);
    if (next) speakCurrent();
  }

  function resetProgressConfirmed() {
    stopSpeech();
    clearNotTestTimer();

    const nextState = {
      ...defaultState,
      screen: "menu",
      chapterId: CHAPTERS[0].id,
      sceneId: CHAPTERS[0].sceneId,
      panelIndex: 0,
      started: false,
      replayNonce: state.replayNonce + 1,
      dialog: null,
      taskDialog: null,
      notTest: null,
      hintDialog: null,
      hintSlides: null,
      bitDialog: null,
      bitInfoUnlocked: false,
      xorTableHelpUnlocked: false,
      postTasksXorHintShown: false,
      hintState: {},
      completedTasks: [],
      explanationsUnlocked: [],
      explanationsReturnTo: null,
      explanationReplay: null,
      workspace: createDefaultWorkspace()
    };

    state = nextState;
    try {
      localStorage.removeItem(APP.storageKey);
      localStorage.setItem(APP.storageKey, JSON.stringify(stateForStorageValue(nextState)));
    } catch {}
    render();
  }

  function openResetProgressDialog() {
    setState({ ...transientUiClearPatch(), dialog: "resetProgressPrompt" });
  }

  function continueInteractiveDialog() {
    if (state.dialog === "resetProgressPrompt") return resetProgressConfirmed();
    if (state.dialog === "returnToNandPrompt") return startSecondWorkspaceNandMonologue();
    openChapter("chapter-4");
  }

  function rejectInteractiveDialog() {
    if (state.dialog === "resetProgressPrompt") return setState({ dialog: null });
    if (state.dialog === "returnToNandPrompt") return setState({ dialog: null });
    if (state.dialog === "helpPrompt") return setState({ dialog: "helpRefusal" });
    if (state.dialog === "helpRefusal") return exitApp();
  }

  function openReturnToNandDialog() {
    setState({ dialog: "returnToNandPrompt" });
  }

  function exitApp() {
    stopSpeech();
    state = {
      ...state,
      ...chapterStartState(state.chapterId),
      soundOn: false,
      replayNonce: state.replayNonce + 1,
      workspace: createDefaultWorkspace()
    };
    saveState();
    render();
    window.close();
  }

  function activatePanelHotspot() {
    const hotspot = currentPanel().hotspot;
    if (!hotspot) return;
    if (hotspot.action === "next") return nextPanel();
  }

  function withWorkspace(mutator) {
    const workspace = normalizeWorkspace(state.workspace);
    mutator(workspace);
    workspace.selectedTerminal = terminalExists(workspace, workspace.selectedTerminal) ? workspace.selectedTerminal : null;
    workspace.unlocked = true;
    workspace.accident = detectWorkspaceAccident(workspace);
    if (workspace.accident) workspace.selectedTerminal = null;
    updateNandOutputObservation(workspace);
    setState({ workspace }, false);
  }

  function toggleWire(a, b) {
    withWorkspace((workspace) => applyWireToggle(workspace, a, b));
  }

  function deleteWireByKey(key) {
    withWorkspace((workspace) => {
      workspace.wires = workspace.wires.filter((wire) => wireKey(wire.a, wire.b) !== key);
      workspace.selectedTerminal = null;
    });
  }

  function addWorkspaceComponent(type, x, y) {
    if (!componentDef(type)) return;
    withWorkspace((workspace) => {
      const id = `${type}-${workspace.nextId}`;
      workspace.nextId += 1;
      const pos = clampComponentPosition(type, x, y);
      workspace.components.push({ id, type, x: pos.x, y: pos.y });
      workspace.selectedTerminal = null;
    });
  }

  function moveWorkspaceComponent(id, x, y) {
    withWorkspace((workspace) => {
      const component = componentById(workspace, id);
      if (!component) return;
      const pos = clampComponentPosition(component.type, x, y);
      component.x = pos.x;
      component.y = pos.y;
    });
  }

  function deleteWorkspaceComponent(id) {
    withWorkspace((workspace) => {
      const component = componentById(workspace, id);
      if (isFixedWorkspaceComponent(component)) return;
      workspace.components = workspace.components.filter((component) => component.id !== id);
      workspace.wires = workspace.wires.filter((wire) => !wire.a.startsWith(`${id}.`) && !wire.b.startsWith(`${id}.`));
      if (workspace.selectedTerminal?.startsWith(`${id}.`)) workspace.selectedTerminal = null;
    });
  }

  function handleWorkspaceTerminal(ref) {
    const workspace = normalizeWorkspace(state.workspace);
    if (!terminalExists(workspace, ref)) return;

    if (!workspace.selectedTerminal) {
      workspace.selectedTerminal = ref;
      workspace.unlocked = true;
      return setState({ workspace }, false);
    }

    if (workspace.selectedTerminal === ref) {
      workspace.selectedTerminal = null;
      workspace.unlocked = true;
      return setState({ workspace }, false);
    }

    toggleWire(workspace.selectedTerminal, ref);
  }

  function boardPointFromEvent(event) {
    const board = app.querySelector("[data-workspace-board]");
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const insideBoard =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    return {
      x: Math.min(rect.width, Math.max(0, event.clientX - rect.left)),
      y: Math.min(rect.height, Math.max(0, event.clientY - rect.top)),
      inside: insideBoard
    };
  }

  function draftWireElement() {
    return app.querySelector("#workspace-draft-wire");
  }

  function setDraftWireHidden(hidden) {
    const line = draftWireElement();
    if (line) line.hidden = hidden;
  }

  function draggableDialogElement(event) {
    return event.target.closest(`
      .dialog-card,
      .workspace-build-help-prompt,
      .workspace-understood-card,
      .workspace-accident-card,
      .workspace-task-intro-card,
      .not-test-result-card,
      .note-task-card,
      .hint-card,
      .hint-slides-card,
      .solution-card,
      .bit-card
    `);
  }

  function dialogDragBlockedByControl(event) {
    return Boolean(event.target.closest("button, a, input, textarea, select, [role='button']"));
  }

  function startDialogDrag(event) {
    if (event.button !== undefined && event.button !== 0) return false;
    const element = draggableDialogElement(event);
    if (!element || dialogDragBlockedByControl(event)) return false;

    const rect = element.getBoundingClientRect();
    element.style.position = "fixed";
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.right = "auto";
    element.style.bottom = "auto";
    element.style.transform = "none";
    element.style.margin = "0";
    element.style.width = `${rect.width}px`;
    element.style.maxWidth = "none";
    element.classList.add("dialog-dragging");

    dialogDragState = {
      element,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };

    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    return true;
  }

  function updateDialogDrag(event) {
    if (!dialogDragState || event.pointerId !== dialogDragState.pointerId) return;
    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - dialogDragState.width - margin);
    const maxY = Math.max(margin, window.innerHeight - dialogDragState.height - margin);
    const x = Math.min(maxX, Math.max(margin, event.clientX - dialogDragState.offsetX));
    const y = Math.min(maxY, Math.max(margin, event.clientY - dialogDragState.offsetY));
    dialogDragState.element.style.left = `${x}px`;
    dialogDragState.element.style.top = `${y}px`;
  }

  function finishDialogDrag(event) {
    if (!dialogDragState || event.pointerId !== dialogDragState.pointerId) return;
    dialogDragState.element.classList.remove("dialog-dragging");
    dialogDragState.element.releasePointerCapture?.(event.pointerId);
    dialogDragState = null;
  }

  function startCableDrag(ref, event) {
    if (state.screen !== "workspace") return;
    const pos = terminalPosition(state.workspace, ref);
    if (!pos) return;
    dragState = {
      kind: "wire",
      from: ref,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moved: false
    };
    const line = draftWireElement();
    if (line) {
      line.setAttribute("x1", pos.x);
      line.setAttribute("y1", pos.y);
      line.setAttribute("x2", pos.x);
      line.setAttribute("y2", pos.y);
      line.hidden = false;
    }
    event.target.setPointerCapture?.(event.pointerId);
  }

  function updateCableDrag(event) {
    if (!dragState || dragState.kind !== "wire" || event.pointerId !== dragState.pointerId) return;
    const dx = event.clientX - dragState.startClientX;
    const dy = event.clientY - dragState.startClientY;
    if (Math.hypot(dx, dy) > 4) dragState.moved = true;
    const point = boardPointFromEvent(event);
    const line = draftWireElement();
    if (point && line) {
      line.setAttribute("x2", point.x);
      line.setAttribute("y2", point.y);
    }
  }

  function finishCableDrag(event) {
    if (!dragState || dragState.kind !== "wire" || event.pointerId !== dragState.pointerId) return;

    setDraftWireHidden(true);

    const from = dragState.from;
    const moved = dragState.moved;
    dragState = null;

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-action='workspace-terminal']");
    const to = target?.dataset.terminalRef || null;

    suppressNextClick = true;
    window.setTimeout(() => { suppressNextClick = false; }, 0);

    if (!moved) return handleWorkspaceTerminal(from);
    if (to && to !== from && terminalExists(state.workspace, to)) return toggleWire(from, to);

    const workspace = normalizeWorkspace(state.workspace);
    workspace.selectedTerminal = null;
    workspace.unlocked = true;
    setState({ workspace }, false);
  }

  function componentPositionFromEvent(event, drag) {
    const point = boardPointFromEvent(event);
    if (!point) return null;
    return clampComponentPosition(drag.componentType, point.x - drag.offsetX, point.y - drag.offsetY);
  }

  function terminalPositionWithOverride(ref, componentId, pos) {
    const overrides = componentId && pos ? { [componentId]: pos } : null;
    return terminalPosition(state.workspace, ref, overrides);
  }

  function updateMovedComponentPreview(event) {
    if (!dragState || dragState.kind !== "component") return;
    const pos = componentPositionFromEvent(event, dragState);
    if (!pos) return;

    dragState.currentX = pos.x;
    dragState.currentY = pos.y;

    const component = componentById(state.workspace, dragState.componentId);
    const group = app.querySelector(`[data-action='workspace-component'][data-component-id='${CSS.escape(dragState.componentId)}']`);
    if (group) {
      // Keep the render scale during the drag so the gate does not jump to full
      // size while moving and snap back on release.
      const scale = componentRenderScale(component?.type);
      const scaleTransform = scale === 1 ? "" : ` scale(${scale})`;
      group.setAttribute("transform", `translate(${pos.x} ${pos.y})${scaleTransform}`);
    }

    const def = componentDef(component?.type);
    if (component && def) {
      for (const pinId of Object.keys(def.pins)) {
        const ref = `${component.id}.${pinId}`;
        const pinPos = terminalPositionWithOverride(ref, component.id, pos);
        const terminal = app.querySelector(`[data-action='workspace-terminal'][data-terminal-ref='${CSS.escape(ref)}']`);
        if (pinPos && terminal) {
          terminal.setAttribute("cx", pinPos.x);
          terminal.setAttribute("cy", pinPos.y);
        }
      }
    }

    for (const wire of state.workspace.wires) {
      const key = wireKey(wire.a, wire.b);
      const a = terminalPositionWithOverride(wire.a, dragState.componentId, pos);
      const b = terminalPositionWithOverride(wire.b, dragState.componentId, pos);
      const wireGroup = app.querySelector(`[data-action='workspace-wire'][data-wire-key='${CSS.escape(key)}']`);
      if (!wireGroup || !a || !b) continue;
      for (const line of wireGroup.querySelectorAll("line")) {
        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);
      }
    }
  }

  function startComponentDrag(componentId, event) {
    if (state.screen !== "workspace") return;
    const component = componentById(state.workspace, componentId);
    if (!component || isFixedWorkspaceComponent(component)) return;
    const point = boardPointFromEvent(event);
    if (!point) return;

    dragState = {
      kind: "component",
      componentId,
      componentType: component.type,
      pointerId: event.pointerId,
      offsetX: point.x - component.x,
      offsetY: point.y - component.y,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originalX: component.x,
      originalY: component.y,
      currentX: component.x,
      currentY: component.y,
      currentInside: true,
      moved: false
    };
    createDragGhost(component.type);
    moveDragGhost(event);
    event.target.setPointerCapture?.(event.pointerId);
  }

  function updateComponentDrag(event) {
    if (!dragState || dragState.kind !== "component" || event.pointerId !== dragState.pointerId) return;
    const dx = event.clientX - dragState.startClientX;
    const dy = event.clientY - dragState.startClientY;
    if (Math.hypot(dx, dy) > 4) dragState.moved = true;
    moveDragGhost(event);

    const point = boardPointFromEvent(event);
    dragState.currentInside = Boolean(point?.inside);
    if (dragState.currentInside) updateMovedComponentPreview(event);
  }

  function isEventOverTrash(event) {
    const trash = app.querySelector("[data-trash]");
    if (!trash) return false;
    const rect = trash.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  function finishComponentDrag(event) {
    if (!dragState || dragState.kind !== "component" || event.pointerId !== dragState.pointerId) return;

    const finished = dragState;
    dragState = null;
    removeDragGhost();

    if (finished.moved) {
      suppressNextClick = true;
      window.setTimeout(() => { suppressNextClick = false; }, 0);
    }

    if (finished.moved && isEventOverTrash(event)) return deleteWorkspaceComponent(finished.componentId);

    const point = boardPointFromEvent(event);
    if (finished.moved && point?.inside) {
      return moveWorkspaceComponent(finished.componentId, finished.currentX, finished.currentY);
    }

    if (finished.moved) return render();
  }

  function createDragGhost(type) {
    removeDragGhost();
    const ghost = document.createElement("div");
    ghost.className = "component-drag-ghost";
    ghost.dataset.dragGhost = "true";
    ghost.textContent = componentDef(type)?.label || type;
    document.body.appendChild(ghost);
    return ghost;
  }

  function moveDragGhost(event) {
    const ghost = document.querySelector("[data-drag-ghost]");
    if (!ghost) return;
    ghost.style.left = `${event.clientX}px`;
    ghost.style.top = `${event.clientY}px`;
  }

  function removeDragGhost() {
    document.querySelector("[data-drag-ghost]")?.remove();
  }

  function startToolbarDrag(type, event) {
    if (state.screen !== "workspace" || !componentDef(type)) return;
    dragState = {
      kind: "new-component",
      componentType: type,
      pointerId: event.pointerId,
      moved: false,
      startClientX: event.clientX,
      startClientY: event.clientY
    };
    createDragGhost(type);
    moveDragGhost(event);
    event.target.setPointerCapture?.(event.pointerId);
  }

  function updateToolbarDrag(event) {
    if (!dragState || dragState.kind !== "new-component" || event.pointerId !== dragState.pointerId) return;
    const dx = event.clientX - dragState.startClientX;
    const dy = event.clientY - dragState.startClientY;
    if (Math.hypot(dx, dy) > 4) dragState.moved = true;
    moveDragGhost(event);
  }

  function finishToolbarDrag(event) {
    if (!dragState || dragState.kind !== "new-component" || event.pointerId !== dragState.pointerId) return;

    const type = dragState.componentType;
    const moved = dragState.moved;
    dragState = null;
    removeDragGhost();

    suppressNextClick = true;
    window.setTimeout(() => { suppressNextClick = false; }, 0);

    const point = boardPointFromEvent(event);
    if (moved && point?.inside) addWorkspaceComponent(type, point.x, point.y);
  }

  function cancelActiveDrag(event) {
    if (dialogDragState && event.pointerId === dialogDragState.pointerId) {
      dialogDragState.element.classList.remove("dialog-dragging");
      dialogDragState = null;
      return;
    }
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    cancelActiveDragNow();
  }

  function cancelActiveDragNow() {
    if (dialogDragState) {
      dialogDragState.element.classList.remove("dialog-dragging");
      dialogDragState = null;
      return;
    }
    if (!dragState) return;
    if (dragState.kind === "wire") setDraftWireHidden(true);
    if (dragState.kind === "new-component" || dragState.kind === "component") removeDragGhost();
    dragState = null;
    suppressNextClick = true;
    window.setTimeout(() => { suppressNextClick = false; }, 0);
    render();
  }

  document.addEventListener("click", (event) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      event.preventDefault();
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) {
      if (state.hintSlides && event.target.closest(".image-shell")) {
        event.preventDefault();
        return nextHintSlide();
      }

      // During the NAND monologue a plain click on the board advances it, the
      // same as the advance key. (The explicit prev/next/reset/sound controls
      // carry a data-action, so they are handled by the button branch below and
      // never reach here.)
      if (
        state.screen === "workspace" &&
        workspaceNandMonologueActive() &&
        event.target.closest("[data-workspace-board]")
      ) {
        event.preventDefault();
        return explanationReplayActive("nand-function") ? nextExplanationPanel() : advanceNandMonologue();
      }

      if (
        state.screen === "story" &&
        !state.dialog &&
        !state.taskDialog &&
        !state.bitDialog &&
        event.target.closest(".image-shell") &&
        !panelHotspots(currentPanel()).length
      ) {
        event.preventDefault();
        return nextPanel();
      }
      return;
    }

    const action = button.dataset.action;
    if (state.taskDialog && !isGlobalNavigationAction(action) && !["note-task", "note-task-close"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (state.bitDialog && !isGlobalNavigationAction(action) && !["bit-dialog-next", "bit-dialog-ok"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (state.hintDialog && !isGlobalNavigationAction(action) && !["hint-close", "hint-select", "hint-apply", "hint-solution", "show-task-solution"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (state.hintSlides && !isGlobalNavigationAction(action) && !["hint-slides-next", "hint-slides-prev", "hint-slides-close", "hint-slides-replay", "hint-slides-skip-to-chapter-last", "sound"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (state.solutionDialog && !isGlobalNavigationAction(action) && !["solution-ok", "solution-next", "solution-toggle-table"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (workspaceTaskIntroActive() && !isGlobalNavigationAction(action) && !["workspace-task-intro-ok"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (notTestActive() && !isGlobalNavigationAction(action) && !["not-test-ok"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (workspaceAccidentActive() && !isGlobalNavigationAction(action) && action !== "workspace-accident-ok") {
      event.preventDefault();
      return;
    }

    if (workspaceBuildHelpPromptActive() && !isGlobalNavigationAction(action) && !["build-help-yes", "build-help-later"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (workspaceUnderstoodPromptActive() && !isGlobalNavigationAction(action) && !["understood-play-more", "understood-yes", "understood-no"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (workspaceNandMonologueActive() && !isGlobalNavigationAction(action) && !["next", "nand-monologue-prev", "workspace-reset", "sound", "explanation-prev", "explanation-next", "explanations-return-to-menu"].includes(action)) {
      event.preventDefault();
      return;
    }

    if (action === "menu") return setState({ ...transientUiClearPatch(), screen: "menu" });
    if (action === "chapters") return setState({ ...transientUiClearPatch(), screen: "chapters" });
    if (action === "about") return setState({ ...transientUiClearPatch(), screen: "about" });
    if (action === "explanations") return openExplanationsMenu();
    if (action === "explanations-return") return returnFromExplanationsMenu();
    if (action === "explanation-open") return startExplanation(button.dataset.explanationId);
    if (action === "explanations-return-to-menu") return returnToExplanationsMenuFromReplay();
    if (action === "explanation-prev") return previousExplanationPanel();
    if (action === "explanation-next") return nextExplanationPanel();
    if (action === "reset-progress") return openResetProgressDialog();
    if (action === "start") return openChapter(CHAPTERS[0].id);
    if (action === "continue") {
      if (!state.started) return openChapter(CHAPTERS[0].id);
      if (state.workspace.unlocked && ["chapter-4", "chapter-5", "chapter-6"].includes(state.chapterId)) return setState({ ...transientUiClearPatch(), screen: "workspace" }, false);
      return setState({ ...transientUiClearPatch(), screen: "story" }, true);
    }
    if (action === "chapter") return openChapter(button.dataset.chapterId);
    if (action === "next") return nextPanel();
    if (action === "prev") return previousPanel();
    if (action === "nand-monologue-prev") return previousNandMonologue();
    if (action === "workspace-reset") return resetWorkspaceCurrentMode();
    if (action === "restart") return restartPanel();
    if (action === "skip") return skipStory();
    if (action === "sound") return toggleSound();
    if (action === "workspace-return-warehouse") return returnToWorkspaceWarehouse();
    if (action === "xor-table-help-open") return openXorTableHelpFromStory();
    if (action === "bit-info-open") return openBitDialog(false);
    if (action === "bit-dialog-next") return advanceBitDialog();
    if (action === "bit-dialog-ok") return finishBitDialog();
    if (action === "dialog-yes") return continueInteractiveDialog();
    if (action === "dialog-no") return rejectInteractiveDialog();
    if (action === "panel-hotspot") return activatePanelHotspot();
    if (action === "open-note-tasks") return openNoteTaskDialog();
    if (action === "open-routing-note-tasks") return openRoutingNoteTaskDialog();
    if (action === "note-task-close") return closeNoteTaskDialog();
    if (action === "note-task") return handleNoteTask(Number(button.dataset.taskIndex));
    if (action === "return-to-nand-dialog") return openReturnToNandDialog();
    if (action === "workspace-terminal") return handleWorkspaceTerminal(button.dataset.terminalRef);
    if (action === "workspace-wire") return deleteWireByKey(button.dataset.wireKey);
    if (action === "workspace-accident-ok") return resetWorkspaceAfterAccident();
    if (action === "workspace-task-intro-ok") return dismissWorkspaceTaskIntro();
    if (action === "check-not-task") return startNotTaskTest();
    if (action === "mux-truth-cell") return handleMuxTruthCell(Number(button.dataset.row), button.dataset.col);
    if (action === "hint-open") return openHintFromButton();
    if (action === "hint-close") return closeHintDialog();
    if (action === "hint-select") return selectHint(Number(button.dataset.hintIndex));
    if (action === "hint-solution") return showTaskSolution(state.hintDialog?.taskId || workspaceTaskId() || "Not", { completeOnClose: true });
    if (action === "hint-apply") return applySelectedHint(Number(button.dataset.hintIndex));
    if (action === "show-task-solution") return showTaskSolution(state.hintDialog?.taskId || workspaceTaskId() || "Not", { completeOnClose: true });
    if (action === "hint-slides-next") return nextHintSlide();
    if (action === "hint-slides-prev") return previousHintSlide();
    if (action === "hint-slides-replay") return replayCurrentNarration();
    if (action === "hint-slides-skip-to-chapter-last") return skipInlineXorHintToChapterLastPanel();
    if (action === "hint-slides-close") return closeHintSlides();
    if (action === "not-test-ok") return finishNotTestDialog();
    if (action === "solution-next") return advanceSolutionDialog();
    if (action === "solution-ok") return finishSolutionDialog();
    if (action === "solution-toggle-table") return setState({ solutionTableHidden: !state.solutionTableHidden }, false);
    if (action === "build-help-later") return dismissBuildHelpPrompt();
    if (action === "build-help-yes" || action === "build-help-open") return openNandBuildHelp();
    if (action === "back-to-workspace") return backToWorkspaceFromNandBuildHelp();
    if (action === "understood-play-more") return dismissUnderstoodPrompt();
    if (action === "understood-yes" || action === "understood-no") return startNandMonologue();
    if (action === "understood-open") return openUnderstoodPrompt();
    if (action === "exit") return exitApp();
  });

  document.addEventListener("pointerdown", (event) => {
    if (workspaceNandMonologueActive() && event.target.closest("[data-nand-speech]")) {
      return;
    }

    if (startDialogDrag(event)) return;

    if (state.hintSlides && event.target.closest(".hint-slides-card")) return;

    if (event.target.closest("[data-action='workspace-return-warehouse']")) return;
    if (event.target.closest("[data-action='workspace-reset']")) return;
    if (event.target.closest("[data-action='nand-monologue-prev']")) return;
    if (event.target.closest("[data-action='explanation-prev']")) return;
    if (event.target.closest("[data-action='explanation-next']")) return;
    if (event.target.closest("[data-action='explanations-return-to-menu']")) return;
    if (event.target.closest("[data-action='sound']")) return;
    if (event.target.closest("[data-action='next']") && workspaceNandMonologueActive()) return;

    if (workspaceInteractionLocked()) {
      event.preventDefault();
      return;
    }

    const terminal = event.target.closest("[data-action='workspace-terminal']");
    if (terminal) {
      event.preventDefault();
      return startCableDrag(terminal.dataset.terminalRef, event);
    }

    const toolboxComponent = event.target.closest("[data-action='toolbox-component']");
    if (toolboxComponent) {
      event.preventDefault();
      return startToolbarDrag(toolboxComponent.dataset.componentType, event);
    }

    const component = event.target.closest("[data-action='workspace-component']");
    if (component) {
      event.preventDefault();
      return startComponentDrag(component.dataset.componentId, event);
    }
  });

  document.addEventListener("pointermove", (event) => {
    if (dialogDragState) return updateDialogDrag(event);
    if (!dragState) return;
    if (dragState.kind === "wire") return updateCableDrag(event);
    if (dragState.kind === "component") return updateComponentDrag(event);
    if (dragState.kind === "new-component") return updateToolbarDrag(event);
  });

  window.addEventListener("pointerup", (event) => {
    if (dialogDragState) return finishDialogDrag(event);
    if (!dragState) return;
    if (dragState.kind === "wire") return finishCableDrag(event);
    if (dragState.kind === "component") return finishComponentDrag(event);
    if (dragState.kind === "new-component") return finishToolbarDrag(event);
  }, true);

  window.addEventListener("pointercancel", cancelActiveDrag, true);
  window.addEventListener("mouseup", () => {
    if (dragState?.kind === "wire") cancelActiveDragNow();
  }, true);
  window.addEventListener("dragstart", (event) => event.preventDefault(), true);
  window.addEventListener("blur", cancelActiveDragNow);

  document.addEventListener("keydown", (event) => {
    if (state.screen === "nandBuildHelp" && explanationReplayActive("build-nand")) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "explanations-return-to-menu") {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      event.preventDefault();
      return;
    }

    if (state.screen === "explanations") {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "explanation-open") {
        event.preventDefault();
        return startExplanation(actionElement.dataset.explanationId);
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "explanations-return") {
        event.preventDefault();
        return returnFromExplanationsMenu();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        return returnFromExplanationsMenu();
      }
      event.preventDefault();
      return;
    }

    if (state.taskDialog) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "note-task") {
        event.preventDefault();
        return handleNoteTask(Number(actionElement.dataset.taskIndex));
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "note-task-close") {
        event.preventDefault();
        return closeNoteTaskDialog();
      }
      if (event.key === "Escape") return closeNoteTaskDialog();
      event.preventDefault();
      return;
    }

    if (state.bitDialog) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "bit-dialog-next") {
        event.preventDefault();
        return advanceBitDialog();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "bit-dialog-ok") {
        event.preventDefault();
        return finishBitDialog();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "explanations-return-to-menu") {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      if (event.key === "Escape" && explanationReplayActive("bit-info")) {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      event.preventDefault();
      return;
    }

    if (state.hintDialog) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-select") {
        event.preventDefault();
        return selectHint(Number(actionElement.dataset.hintIndex));
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-solution") {
        event.preventDefault();
        return showTaskSolution(state.hintDialog?.taskId || workspaceTaskId() || "Not", { completeOnClose: true });
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-apply") {
        event.preventDefault();
        return applySelectedHint(Number(actionElement.dataset.hintIndex));
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "show-task-solution") {
        event.preventDefault();
        return showTaskSolution(state.hintDialog?.taskId || workspaceTaskId() || "Not", { completeOnClose: true });
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-close") {
        event.preventDefault();
        return closeHintDialog();
      }
      if (event.key === "Escape") return closeHintDialog();
      event.preventDefault();
      return;
    }

    if (state.hintSlides) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "explanations-return-to-menu") {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-slides-close") {
        event.preventDefault();
        return closeHintSlides();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-slides-replay") {
        event.preventDefault();
        return replayCurrentNarration();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-slides-skip-to-chapter-last") {
        event.preventDefault();
        return skipInlineXorHintToChapterLastPanel();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "sound") {
        event.preventDefault();
        return toggleSound();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "hint-slides-prev") {
        event.preventDefault();
        return previousHintSlide();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        return explanationReplayActive("truth-table-cards") ? returnToExplanationsMenuFromReplay() : closeHintSlides();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        return previousHintSlide();
      }
      if (event.key === "ArrowLeft" || event.key === " " || (event.key === "Enter" && actionElement?.dataset.action === "hint-slides-next")) {
        event.preventDefault();
        return nextHintSlide();
      }
      event.preventDefault();
      return;
    }

    if (state.solutionDialog) {
      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "solution-next") {
        event.preventDefault();
        return advanceSolutionDialog();
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "solution-ok") {
        event.preventDefault();
        return finishSolutionDialog();
      }
      event.preventDefault();
      return;
    }

    if (state.screen === "workspace") {
      if (explanationReplayActive("nand-function")) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          return previousExplanationPanel();
        }
        if (event.key === "ArrowLeft" || event.key === " ") {
          event.preventDefault();
          return nextExplanationPanel();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          return returnToExplanationsMenuFromReplay();
        }
        event.preventDefault();
        return;
      }

      if (workspaceAccidentActive()) {
        const actionElement = event.target.closest("[data-action]");
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "workspace-accident-ok") {
          event.preventDefault();
          return resetWorkspaceAfterAccident();
        }
        event.preventDefault();
        return;
      }

      if (notTestActive()) {
        const actionElement = event.target.closest("[data-action]");
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "not-test-ok") {
          event.preventDefault();
          return finishNotTestDialog();
        }
        event.preventDefault();
        return;
      }

      if (workspaceTaskIntroActive()) {
        const actionElement = event.target.closest("[data-action]");
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "workspace-task-intro-ok") {
          event.preventDefault();
          return dismissWorkspaceTaskIntro();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          return dismissWorkspaceTaskIntro();
        }
        event.preventDefault();
        return;
      }

      if (workspaceBuildHelpPromptActive()) {
        const actionElement = event.target.closest("[data-action]");
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "build-help-yes") {
          event.preventDefault();
          return openNandBuildHelp();
        }
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "build-help-later") {
          event.preventDefault();
          return dismissBuildHelpPrompt();
        }
        event.preventDefault();
        return;
      }

      if (workspaceUnderstoodPromptActive()) {
        const actionElement = event.target.closest("[data-action]");
        if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "understood-play-more") {
          event.preventDefault();
          return dismissUnderstoodPrompt();
        }
        if ((event.key === "Enter" || event.key === " ") && ["understood-yes", "understood-no"].includes(actionElement?.dataset.action)) {
          event.preventDefault();
          return startNandMonologue();
        }
        event.preventDefault();
        return;
      }

      if (workspaceNandMonologueActive()) {
        if (event.key === "ArrowLeft" || event.key === " ") {
          event.preventDefault();
          return advanceNandMonologue();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          return previousNandMonologue();
        }
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        return;
      }

      const actionElement = event.target.closest("[data-action]");
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "workspace-wire") {
        event.preventDefault();
        return deleteWireByKey(actionElement.dataset.wireKey);
      }
      if ((event.key === "Enter" || event.key === " ") && actionElement?.dataset.action === "workspace-terminal") {
        event.preventDefault();
        return handleWorkspaceTerminal(actionElement.dataset.terminalRef);
      }
      return;
    }

    if (explanationReplayActive("nand-intro")) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        return previousExplanationPanel();
      }
      if (event.key === "ArrowLeft" || event.key === " ") {
        event.preventDefault();
        return nextExplanationPanel();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        return returnToExplanationsMenuFromReplay();
      }
      event.preventDefault();
      return;
    }

    if (state.screen !== "story" || state.dialog) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      return previousPanel();
    }
    if ((event.key === "ArrowLeft" || event.key === " ") && panelHotspots(currentPanel()).length) {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === " ") {
      event.preventDefault();
      return nextPanel();
    }
    if ((event.key === "Enter" || event.key === "Spacebar") && currentPanel().hotspot && document.activeElement?.classList.contains("panel-hotspot")) {
      event.preventDefault();
      activatePanelHotspot();
    }
  });

  window.addEventListener("resize", () => {
    if (workspaceNandMonologueActive()) requestAnimationFrame(positionWorkspaceNandMonologue);
  });

  render();
  loadMuxSolutionLayouts();
  loadSvgPinDefinitions().then((changed) => {
    if (changed) {
      state.workspace = normalizeWorkspace(state.workspace);
      saveState();
      render();
    }
  });
})();

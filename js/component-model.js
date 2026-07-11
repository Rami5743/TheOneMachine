// component-model.js — the component & terminal STRUCTURE model, extracted from
// app.js. These are the pure structural queries every other workbench module
// builds on: what a component type is, how a terminal reference splits into a
// component id and a pin id, which component/pin a reference points at, whether
// a terminal exists, its direction, and whether it is a NAND output.
//
// Loaded BEFORE app.js. It touches neither the DOM nor app state. Its only
// dependency is the component-definition table, INJECTED via
// createComponentModel({ componentDefs }). The table is passed by reference and
// may be mutated in place afterwards (app.js adds gate/task-card defs at init);
// componentDef reads it live, so timing does not matter.
//
// createComponentModel(deps) -> { componentDef, splitTerminalRef, componentById,
//                                 pinDefFor, terminalExists, terminalDirection,
//                                 isNandOutputRef }
//   deps: componentDefs

function createComponentModel({ componentDefs }) {
  function componentDef(type) {
    return componentDefs[type] || null;
  }

  function splitTerminalRef(ref) {
    const dot = String(ref).lastIndexOf(".");
    if (dot < 1) return null;
    return { componentId: ref.slice(0, dot), pinId: ref.slice(dot + 1) };
  }

  function componentById(workspace, componentId) {
    return workspace.components.find((component) => component.id === componentId) || null;
  }

  function pinDefFor(workspace, ref) {
    const parsed = splitTerminalRef(ref);
    if (!parsed) return null;
    const component = componentById(workspace, parsed.componentId);
    const def = component ? componentDef(component.type) : null;
    const pin = def?.pins?.[parsed.pinId] || null;
    return component && pin ? { component, pin, pinId: parsed.pinId } : null;
  }

  function terminalExists(workspace, ref) {
    return Boolean(pinDefFor(workspace, ref));
  }

  function terminalDirection(workspace, ref) {
    return pinDefFor(workspace, ref)?.pin.direction || null;
  }

  function isNandOutputRef(workspace, ref) {
    const info = pinDefFor(workspace, ref);
    return Boolean(info && info.component.type === "nand" && info.pinId === "out");
  }

  return { componentDef, splitTerminalRef, componentById, pinDefFor, terminalExists, terminalDirection, isNandOutputRef };
}

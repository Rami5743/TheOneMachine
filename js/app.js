(() => {
  const app = document.getElementById("app");

  // Vertical gap between a splitter's output pins. Declared up here (not beside
  // the other splitter helpers) because splitter pin resolution runs during the
  // initial loadState()/normalizeWorkspace(), before that later block executes.
  const SPLITTER_OUTPUT_SPACING = 34; // matches component-visuals
  // Component-type prefix for user-saved cards (see the "User-saved cards"
  // section). Declared here because registerAllSavedCards() runs at load time.
  const SAVED_CARD_PREFIX = "usercard-";

  const WORKSPACE_COMPONENT_DEFS = {
    source: {
      label: "מקור מתח",
      pins: {
        out: { x: 46, y: 0, direction: "out", label: "פין מקור מתח" }
      },
      bounds: { left: 34, right: 52, top: 46, bottom: 46 }
    },
    nand: {
      label: "Nand",
      pins: {
        in1: { x: -60, y: -24, direction: "in", label: "כניסת Nand עליונה" },
        in2: { x: -60, y: 24, direction: "in", label: "כניסת Nand תחתונה" },
        out: { x: 80, y: 0, direction: "out", label: "יציאת Nand" }
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
    splitter: {
      label: "מפצל",
      // Wiring the splitter is not implemented yet, so it exposes no pins. Its
      // look is drawn dynamically from the instance's `outputs`/`mirrored`.
      pins: {},
      bounds: { left: 74, right: 74, top: 96, bottom: 96 }
    },
    notCard: {
      label: "מסגרת Not",
      fixed: true,
      pins: {
        inputExt: { x: -340, y: 0, direction: "in", label: "כניסת Not חיצונית" },
        inputInt: { x: -260, y: 0, direction: "out", label: "כניסת Not פנימית" },
        outputInt: { x: 260, y: 0, direction: "in", label: "יציאת Not פנימית" },
        outputExt: { x: 340, y: 0, direction: "out", label: "יציאת Not חיצונית" }
      },
      bounds: { left: 340, right: 340, top: 190, bottom: 190 }
    }
  };


  // TASK_DEFS moved to js/app-data.js

  function taskDefById(taskId) {
    return TASK_DEFS.find((task) => task.id === taskId)
      || ROUTING_TASK_DEFS.find((task) => task.id === taskId && Number.isInteger(task.inputs))
      || (typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS.find((task) => task.id === taskId && Number.isInteger(task.inputs)) : null)
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
          inputExt1: { x: -375, y: -100, direction: "in", label: "כניסת Mux 1 חיצונית" },
          inputInt1: { x: -325, y: -100, direction: "out", label: "כניסת Mux 1 פנימית" },
          inputExt2: { x: -375, y: 100, direction: "in", label: "כניסת Mux 2 חיצונית" },
          inputInt2: { x: -325, y: 100, direction: "out", label: "כניסת Mux 2 פנימית" },
          inputExt3: { x: -200, y: -248, direction: "in", label: "כניסת בקרה חיצונית" },
          inputInt3: { x: -200, y: -208, direction: "out", label: "כניסת בקרה פנימית" },
          outputInt: { x: 300, y: 0, direction: "in", label: "יציאת Mux פנימית" },
          outputExt: { x: 375, y: 0, direction: "out", label: "יציאת Mux חיצונית" }
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
          inputExt1: { x: -375, y: 0, direction: "in", label: "כניסת DMux חיצונית" },
          inputInt1: { x: -325, y: 0, direction: "out", label: "כניסת DMux פנימית" },
          inputExt2: { x: -200, y: -248, direction: "in", label: "כניסת בקרה חיצונית" },
          inputInt2: { x: -200, y: -208, direction: "out", label: "כניסת בקרה פנימית" },
          outputInt1: { x: 300, y: -100, direction: "in", label: "יציאת DMux 1 פנימית" },
          outputExt1: { x: 375, y: -100, direction: "out", label: "יציאת DMux 1 חיצונית" },
          outputInt2: { x: 300, y: 100, direction: "in", label: "יציאת DMux 2 פנימית" },
          outputExt2: { x: 375, y: 100, direction: "out", label: "יציאת DMux 2 חיצונית" }
        },
        bounds: { left: 380, right: 380, top: 270, bottom: 240 }
      };
    }
  }

  // Once completed, the MUX and DMUX join the toolbar as placeable gates drawn
  // with the standard schematic (trapezoid) symbols. The MUX has two data inputs
  // on the left and the select at the top; the DMUX has one input on the left,
  // the select at the top, and two outputs on the right.
  WORKSPACE_COMPONENT_DEFS["gate-Mux"] = {
    label: "Mux",
    taskId: "Mux",
    gate: true,
    pins: {
      in1: { x: -62, y: -23, direction: "in", label: "כניסת Mux 1" },
      in2: { x: -62, y: 23, direction: "in", label: "כניסת Mux 2" },
      in3: { x: 0, y: -46, direction: "in", label: "כניסת בקרה של Mux" },
      out: { x: 66, y: 0, direction: "out", label: "יציאת Mux" }
    },
    bounds: { left: 64, right: 84, top: 62, bottom: 62 }
  };

  WORKSPACE_COMPONENT_DEFS["gate-DMux"] = {
    label: "DMux",
    taskId: "DMux",
    gate: true,
    pins: {
      in1: { x: -62, y: 0, direction: "in", label: "כניסת DMux" },
      in2: { x: 0, y: -46, direction: "in", label: "כניסת בקרה של DMux" },
      out1: { x: 66, y: -23, direction: "out", label: "יציאת DMux 1" },
      out2: { x: 66, y: 23, direction: "out", label: "יציאת DMux 2" }
    },
    bounds: { left: 64, right: 84, top: 62, bottom: 62 }
  };

  // Chapter 2.4 bus tasks build two component kinds each:
  //  * a bus CARD (the build frame, taskCard-<id>) whose single input and output
  //    are BUSES — pinWidth reports the card's `busWidth`, so wires to
  //    inputInt1 / outputInt render as buses and obey the width rules; and
  //  * a placeable bus GATE (gate-<id>) with the same op on a whole bus, which
  //    the learner reuses inside later tasks (e.g. Not4 inside Not16).
  // The card/gate are only built for tasks with a real build workspace so far.
  const BUS_TASKS_WITH_CARD = ["Not4", "Not16", "AND4", "AND16", "OR4"];
  const BUS_TASKS_WITH_GATE = ["Not4", "Not16", "AND4", "AND16", "OR4"];
  // Vertical positions of a bus card's input pins by input count.
  function busCardInputYs(n) { return n <= 1 ? [0] : [-90, 90]; }
  for (const busTask of (typeof BUS_TASK_DEFS !== "undefined" ? BUS_TASK_DEFS : [])) {
    const nIn = busTask.inputs || 1;
    if (BUS_TASKS_WITH_CARD.includes(busTask.id)) {
      const cardPins = {};
      busCardInputYs(nIn).forEach((y, i) => {
        const num = nIn > 1 ? ` ${i + 1}` : "";
        cardPins[`inputExt${i + 1}`] = { x: -340, y, direction: "in", label: `כניסת ${busTask.label}${num} חיצונית` };
        cardPins[`inputInt${i + 1}`] = { x: -260, y, direction: "out", label: `כניסת ${busTask.label}${num} פנימית` };
      });
      cardPins.outputInt = { x: 260, y: 0, direction: "in", label: `יציאת ${busTask.label} פנימית` };
      cardPins.outputExt = { x: 340, y: 0, direction: "out", label: `יציאת ${busTask.label} חיצונית` };
      WORKSPACE_COMPONENT_DEFS[taskCardComponentType(busTask.id)] = {
        label: `מסגרת ${busTask.label}`,
        fixed: true,
        taskId: busTask.id,
        busWidth: busTask.width,
        busTask: true,
        busInputs: nIn,
        pins: cardPins,
        bounds: { left: 340, right: 340, top: 190, bottom: 190 }
      };
    }

    if (BUS_TASKS_WITH_GATE.includes(busTask.id)) {
      // A placeable bus gate looks EXACTLY like its base gate (NOT4 like NOT,
      // AND4 like AND) — same schematic symbol and pin layout — only the label
      // differs. It reuses the base gate's pins/bounds; `busWidth` makes its
      // pins buses, and `op` drives the componentwise evaluation. The base gate
      // (gate-Not / gate-And …) was defined above, from TASK_DEFS.
      const baseDef = WORKSPACE_COMPONENT_DEFS[gateComponentType(busTask.op)];
      const gatePins = {};
      Object.entries(baseDef ? baseDef.pins : {}).forEach(([pinId, pin]) => {
        gatePins[pinId] = { ...pin };
      });
      WORKSPACE_COMPONENT_DEFS[gateComponentType(busTask.id)] = {
        label: busTask.label,
        gate: true,
        busGate: true,
        busWidth: busTask.width,
        op: busTask.op,
        inputs: nIn,
        pins: gatePins,
        bounds: baseDef ? { ...baseDef.bounds } : { left: 84, right: 84, top: 62, bottom: 62 }
      };
    }
  }

  // MUX bus cards & gates (MUX4, MUX16). Unlike AND/OR, a MUX has two DATA bus
  // inputs plus a single-bit CONTROL input on top; the data pins/output are
  // buses of the card's width, the control pin is 1 bit. `control: true` tells
  // the engine the last input is the shared select bit.
  for (const muxTask of (typeof BUS_TASK_DEFS !== "undefined" ? BUS_TASK_DEFS : []).filter((t) => ["MUX4", "MUX16"].includes(t.id))) {
    const W = muxTask.width;
    WORKSPACE_COMPONENT_DEFS[taskCardComponentType(muxTask.id)] = {
      label: `מסגרת ${muxTask.label}`,
      fixed: true,
      taskId: muxTask.id,
      busWidth: W,
      busTask: true,
      mux: true,
      pins: {
        inputExt1: { x: -340, y: -90, direction: "in", width: W, label: `כניסת ${muxTask.label} 1 חיצונית` },
        inputInt1: { x: -260, y: -90, direction: "out", width: W, label: `כניסת ${muxTask.label} 1 פנימית` },
        inputExt2: { x: -340, y: 90, direction: "in", width: W, label: `כניסת ${muxTask.label} 2 חיצונית` },
        inputInt2: { x: -260, y: 90, direction: "out", width: W, label: `כניסת ${muxTask.label} 2 פנימית` },
        inputExt3: { x: -130, y: -250, direction: "in", width: 1, label: "כניסת בקרה חיצונית" },
        inputInt3: { x: -130, y: -180, direction: "out", width: 1, label: "כניסת בקרה פנימית" },
        outputInt: { x: 260, y: 0, direction: "in", width: W, label: `יציאת ${muxTask.label} פנימית` },
        outputExt: { x: 340, y: 0, direction: "out", width: W, label: `יציאת ${muxTask.label} חיצונית` }
      },
      bounds: { left: 340, right: 340, top: 280, bottom: 190 }
    };

    // The placeable MUX bus gate mirrors the 2.3 MUX symbol (two data inputs on
    // the left, control on top, output on the right), with bus data/output pins.
    const baseMux = WORKSPACE_COMPONENT_DEFS["gate-Mux"];
    const muxPins = {};
    Object.entries(baseMux ? baseMux.pins : {}).forEach(([pinId, pin]) => {
      muxPins[pinId] = { ...pin, width: pinId === "in3" ? 1 : W };
    });
    WORKSPACE_COMPONENT_DEFS[gateComponentType(muxTask.id)] = {
      label: muxTask.label,
      gate: true,
      busGate: true,
      busWidth: W,
      op: "Mux",
      inputs: 3,
      control: true,
      pins: muxPins,
      bounds: baseMux ? { ...baseMux.bounds } : { left: 64, right: 84, top: 62, bottom: 62 }
    };
  }

  // ---- Chapter 2.5 arithmetic cards (halfAdder / fullAdder) ----------------
  // Build frames with N input pins on the left and TWO output pins (sum on top,
  // carry on bottom) on the right — hand-built like the DMux card because the
  // generic TASK_DEFS loop only emits a single output pin. Registered here, at
  // the top of the file, so the taskCard-<id> component defs exist before the
  // initial state load (which strips components of unknown type).
  for (const arithTask of (typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : [])) {
    if (!Number.isInteger(arithTask.inputs)) continue;
    if (arithTask.busWidth) continue; // bus adder cards (Add4/Add16) are hand-written below
    const cardPins = {};
    taskInputYs(arithTask.inputs).forEach((y, index) => {
      cardPins[`inputExt${index + 1}`] = { x: -340, y, direction: "in", label: `כניסת ${arithTask.label} ${index + 1} חיצונית` };
      cardPins[`inputInt${index + 1}`] = { x: -260, y, direction: "out", label: `כניסת ${arithTask.label} ${index + 1} פנימית` };
    });
    // carry (output 2) on top, sum (output 1) on the bottom.
    cardPins.outputInt2 = { x: 260, y: -100, direction: "in", label: "יציאת carry פנימית" };
    cardPins.outputExt2 = { x: 340, y: -100, direction: "out", label: "יציאת carry חיצונית" };
    cardPins.outputInt1 = { x: 260, y: 100, direction: "in", label: "יציאת sum פנימית" };
    cardPins.outputExt1 = { x: 340, y: 100, direction: "out", label: "יציאת sum חיצונית" };
    WORKSPACE_COMPONENT_DEFS[taskCardComponentType(arithTask.id)] = {
      label: `מסגרת ${arithTask.label}`,
      fixed: true,
      taskId: arithTask.id,
      pins: cardPins,
      bounds: { left: 340, right: 340, top: 190, bottom: 190 }
    };
  }

  // Once built, the adder cards join the toolbar as placeable gates (halfAdder is
  // reused inside fullAdder), drawn as a "+" box with two outputs: carry on top
  // (out2), sum on the bottom (out1).
  WORKSPACE_COMPONENT_DEFS["gate-halfAdder"] = {
    label: "halfAdder",
    taskId: "halfAdder",
    gate: true,
    pins: {
      in1: { x: -62, y: -23, direction: "in", label: "כניסת halfAdder 1" },
      in2: { x: -62, y: 23, direction: "in", label: "כניסת halfAdder 2" },
      out2: { x: 66, y: -23, direction: "out", label: "יציאת carry" },
      out1: { x: 66, y: 23, direction: "out", label: "יציאת sum" }
    },
    bounds: { left: 64, right: 84, top: 62, bottom: 62 }
  };
  WORKSPACE_COMPONENT_DEFS["gate-fullAdder"] = {
    label: "fullAdder",
    taskId: "fullAdder",
    gate: true,
    pins: {
      in1: { x: -62, y: -27, direction: "in", label: "כניסת fullAdder 1" },
      in2: { x: -62, y: 0, direction: "in", label: "כניסת fullAdder 2" },
      in3: { x: -62, y: 27, direction: "in", label: "כניסת fullAdder 3" },
      out2: { x: 66, y: -23, direction: "out", label: "יציאת carry" },
      out1: { x: 66, y: 23, direction: "out", label: "יציאת sum" }
    },
    bounds: { left: 64, right: 84, top: 62, bottom: 62 }
  };

  // The 2.5 Add4 build frame: two width-4 bus inputs (the two numbers) and a
  // single-bit carry-in, all three stacked on the left; a single-bit carry-out
  // (the leading digit) and a width-4 bus sum on the right. Checked with the
  // multi-bit harness; the engine passes each pin through by width.
  WORKSPACE_COMPONENT_DEFS["taskCard-Add4"] = {
    label: "מסגרת Add4",
    fixed: true,
    taskId: "Add4",
    busWidth: 4,
    busTask: true,
    routingMultibit: true,
    pins: {
      // All three inputs on the LEFT, top-to-bottom: the two 4-bit number buses,
      // then the single carry-in below them (a regular input, not a control pin).
      inputExt1: { x: -340, y: -140, direction: "in", width: 4, label: "כניסת המספר הראשון חיצונית" },
      inputInt1: { x: -260, y: -140, direction: "out", width: 4, label: "כניסת המספר הראשון פנימית" },
      inputExt2: { x: -340, y: 0, direction: "in", width: 4, label: "כניסת המספר השני חיצונית" },
      inputInt2: { x: -260, y: 0, direction: "out", width: 4, label: "כניסת המספר השני פנימית" },
      inputExt3: { x: -340, y: 140, direction: "in", width: 1, label: "כניסת הנשיאה חיצונית" },
      inputInt3: { x: -260, y: 140, direction: "out", width: 1, label: "כניסת הנשיאה פנימית" },
      outputInt1: { x: 260, y: -90, direction: "in", width: 1, label: "יציאת הנשיאה האחרונה פנימית" },
      outputExt1: { x: 340, y: -90, direction: "out", width: 1, label: "יציאת הנשיאה האחרונה חיצונית" },
      outputInt2: { x: 260, y: 90, direction: "in", width: 4, label: "יציאת הסכום פנימית" },
      outputExt2: { x: 340, y: 90, direction: "out", width: 4, label: "יציאת הסכום חיצונית" }
    },
    bounds: { left: 340, right: 340, top: 280, bottom: 190 }
  };

  // The 2.5 Add16 build frame: two width-16 bus inputs (the two numbers) on the
  // left and a single width-16 bus sum on the right. No carry pins — Add16 takes
  // no carry-in and discards the final carry (the 17th digit). Checked with the
  // multi-bit harness.
  WORKSPACE_COMPONENT_DEFS["taskCard-Add16"] = {
    label: "מסגרת Add16",
    fixed: true,
    taskId: "Add16",
    busWidth: 16,
    busTask: true,
    routingMultibit: true,
    pins: {
      inputExt1: { x: -340, y: -90, direction: "in", width: 16, label: "כניסת המספר הראשון חיצונית" },
      inputInt1: { x: -260, y: -90, direction: "out", width: 16, label: "כניסת המספר הראשון פנימית" },
      inputExt2: { x: -340, y: 90, direction: "in", width: 16, label: "כניסת המספר השני חיצונית" },
      inputInt2: { x: -260, y: 90, direction: "out", width: 16, label: "כניסת המספר השני פנימית" },
      outputInt1: { x: 260, y: 0, direction: "in", width: 16, label: "יציאת הסכום פנימית" },
      outputExt1: { x: 340, y: 0, direction: "out", width: 16, label: "יציאת הסכום חיצונית" }
    },
    bounds: { left: 340, right: 340, top: 190, bottom: 190 }
  };

  // Once Add4 is built it joins the toolbar as a placeable gate — the building
  // block of Add16. A bus adder gate: two width-4 number inputs and a single-bit
  // carry-in on the left; a width-4 sum (out1) and a single-bit carry-out (out2)
  // on the right. The engine adds the two 4-bit buses plus the carry-in bit (see
  // the arith-bus-gate case in circuit-engine.js).
  WORKSPACE_COMPONENT_DEFS["gate-Add4"] = {
    label: "Add4",
    taskId: "Add4",
    gate: true,
    busAdder: true,
    busWidth: 4,
    pins: {
      in1: { x: -62, y: -52, direction: "in", width: 4, label: "כניסת המספר הראשון" },
      in2: { x: -62, y: 0, direction: "in", width: 4, label: "כניסת המספר השני" },
      in3: { x: -62, y: 52, direction: "in", width: 1, label: "כניסת הנשיאה" },
      out2: { x: 66, y: -34, direction: "out", width: 1, label: "יציאת הנשיאה" },
      out1: { x: 66, y: 34, direction: "out", width: 4, label: "יציאת הסכום" }
    },
    // The gate renders at 0.6 scale, so its real visual half-height is ~53px, not
    // 92. Keep the vertical bounds close to that (56) so four stacked Add4 gates
    // fit inside the board without the bottom/top gate being clamped off-edge.
    bounds: { left: 64, right: 84, top: 56, bottom: 56 }
  };

  // gate-Add16: the placeable card the learner earns by completing Add16. Same
  // shape and drawing as gate-Add4 (a "+" box with emphasized bus pins), only the
  // two number buses + the sum bus are width 16 instead of 4 (the carry pins stay
  // single-bit). Joins the palette once Add16 is completed, like the other gates.
  WORKSPACE_COMPONENT_DEFS["gate-Add16"] = {
    label: "Add16",
    taskId: "Add16",
    gate: true,
    busAdder: true,
    busWidth: 16,
    pins: {
      in1: { x: -62, y: -52, direction: "in", width: 16, label: "כניסת המספר הראשון" },
      in2: { x: -62, y: 0, direction: "in", width: 16, label: "כניסת המספר השני" },
      in3: { x: -62, y: 52, direction: "in", width: 1, label: "כניסת הנשיאה" },
      out2: { x: 66, y: -34, direction: "out", width: 1, label: "יציאת הנשיאה" },
      out1: { x: 66, y: 34, direction: "out", width: 16, label: "יציאת הסכום" }
    },
    bounds: { left: 64, right: 84, top: 56, bottom: 56 }
  };

  // The 2.5 binary↔decimal converters — dynamic-width helper devices for the
  // worktable. Their single bus pin has NO fixed width, so wireWidthLegal lets it
  // accept ANY bus; the actual width is read from the connection at eval/render.
  //  converter-in  (bin→dec): reads a bus, DISPLAYS its decimal value (a sink).
  //  converter-out (dec→bin): stores a decimal `value`, EMITS its bits (a source).
  WORKSPACE_COMPONENT_DEFS["converter-in"] = {
    label: "ממיר לעשרוני",
    converter: true, converterDir: "in",
    pins: { in: { x: -146, y: 0, direction: "in", label: "כניסת הבס" } },
    bounds: { left: 150, right: 106, top: 46, bottom: 46 }
  };
  WORKSPACE_COMPONENT_DEFS["converter-out"] = {
    label: "ממיר לבינרי",
    converter: true, converterDir: "out",
    pins: { out: { x: 146, y: 0, direction: "out", label: "יציאת הבס" } },
    bounds: { left: 106, right: 150, top: 46, bottom: 46 }
  };

  // OR16 is NOT one of the chapter 2.4 tasks, but the MUX16 "original-MUX"
  // walkthrough draws it (out = (data1 & ~c) OR16 (data2 & c)), and it is the
  // card the upcoming "create new card" tool is meant to let the learner build.
  // Define its placeable bus gate (a width-16 OR bus gate) so it can be rendered
  // and evaluated even though there is no OR16 task.
  {
    const baseOr16 = WORKSPACE_COMPONENT_DEFS[gateComponentType("Or")];
    const or16Pins = {};
    Object.entries(baseOr16 ? baseOr16.pins : {}).forEach(([pinId, pin]) => { or16Pins[pinId] = { ...pin }; });
    WORKSPACE_COMPONENT_DEFS["gate-OR16"] = {
      label: "Or16", gate: true, busGate: true, busWidth: 16, op: "Or", inputs: 2,
      pins: or16Pins,
      bounds: baseOr16 ? { ...baseOr16.bounds } : { left: 84, right: 84, top: 62, bottom: 62 }
    };
  }

  // ---- Multi-bit routing cards (chapter 2.5): Dmux4way & Mux4way16 ----------
  // Dmux4way: one regular input (left) + a 2-bit control bus (top) route the
  // input to one of FOUR regular outputs (right); the other three are 0.
  WORKSPACE_COMPONENT_DEFS["taskCard-Dmux4way"] = {
    label: "מסגרת DMux4Way",
    fixed: true,
    taskId: "Dmux4way",
    routingMultibit: true,
    pins: {
      inputExt1: { x: -340, y: 60, direction: "in", width: 1, label: "כניסה חיצונית" },
      inputInt1: { x: -260, y: 60, direction: "out", width: 1, label: "כניסה פנימית" },
      inputExt2: { x: -130, y: -250, direction: "in", width: 2, label: "כניסת בקרה חיצונית" },
      inputInt2: { x: -130, y: -180, direction: "out", width: 2, label: "כניסת בקרה פנימית" },
      outputInt1: { x: 260, y: -135, direction: "in", width: 1, label: "יציאה 1 פנימית" },
      outputExt1: { x: 340, y: -135, direction: "out", width: 1, label: "יציאה 1 חיצונית" },
      outputInt2: { x: 260, y: -45, direction: "in", width: 1, label: "יציאה 2 פנימית" },
      outputExt2: { x: 340, y: -45, direction: "out", width: 1, label: "יציאה 2 חיצונית" },
      outputInt3: { x: 260, y: 45, direction: "in", width: 1, label: "יציאה 3 פנימית" },
      outputExt3: { x: 340, y: 45, direction: "out", width: 1, label: "יציאה 3 חיצונית" },
      outputInt4: { x: 260, y: 135, direction: "in", width: 1, label: "יציאה 4 פנימית" },
      outputExt4: { x: 340, y: 135, direction: "out", width: 1, label: "יציאה 4 חיצונית" }
    },
    bounds: { left: 340, right: 340, top: 280, bottom: 190 }
  };

  // Mux4way16: FOUR 16-bit data inputs (left) + a 2-bit control bus (top) select
  // which data input passes to the single 16-bit output (right).
  WORKSPACE_COMPONENT_DEFS["taskCard-Mux4way16"] = {
    label: "מסגרת Mux4Way16",
    fixed: true,
    taskId: "Mux4way16",
    routingMultibit: true,
    pins: {
      inputExt1: { x: -340, y: -135, direction: "in", width: 16, label: "כניסה 1 חיצונית" },
      inputInt1: { x: -260, y: -135, direction: "out", width: 16, label: "כניסה 1 פנימית" },
      inputExt2: { x: -340, y: -45, direction: "in", width: 16, label: "כניסה 2 חיצונית" },
      inputInt2: { x: -260, y: -45, direction: "out", width: 16, label: "כניסה 2 פנימית" },
      inputExt3: { x: -340, y: 45, direction: "in", width: 16, label: "כניסה 3 חיצונית" },
      inputInt3: { x: -260, y: 45, direction: "out", width: 16, label: "כניסה 3 פנימית" },
      inputExt4: { x: -340, y: 135, direction: "in", width: 16, label: "כניסה 4 חיצונית" },
      inputInt4: { x: -260, y: 135, direction: "out", width: 16, label: "כניסה 4 פנימית" },
      inputExt5: { x: -130, y: -250, direction: "in", width: 2, label: "כניסת בקרה חיצונית" },
      inputInt5: { x: -130, y: -180, direction: "out", width: 2, label: "כניסת בקרה פנימית" },
      outputInt: { x: 260, y: 0, direction: "in", width: 16, label: "יציאה פנימית" },
      outputExt: { x: 340, y: 0, direction: "out", width: 16, label: "יציאה חיצונית" }
    },
    bounds: { left: 340, right: 340, top: 280, bottom: 190 }
  };

  // The card-creation frame: an invisible fixed component (the frame + pins are
  // drawn separately) whose pins are resolved dynamically from state.cardCreation
  // so the learner can wire internal components to the card's inputs/outputs.
  WORKSPACE_COMPONENT_DEFS["cardFrame"] = { label: "מסגרת כרטיס", fixed: true, pins: {} };


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

  // Default lomda pace. Production wants "step" (this is the shipped value).
  // Project policy: AFTER a push to main, flip this to "all" in the dev branch
  // for free testing; then restore "step" right before the next push to main.
  // This one constant is the flip point.
  const DEFAULT_PACE = "all";

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
    requirementsPanelHidden: false,
    bitDialog: null,
    bitInfoUnlocked: false,
    xorTableHelpUnlocked: false,
    postTasksXorHintShown: false,
    hintState: {},
    completedTasks: [],
    // Achievements the player has earned (a subset of ACHIEVEMENTS ids).
    achievementsUnlocked: [],
    explanationsUnlocked: [],
    // Explanations whose "new explanation" flourish has already been played, so
    // it fires exactly once — at the END of the explanation (or when an optional
    // one is declined), decoupled from when the item was unlocked.
    explanationsAnnounced: [],
    explanationsReturnTo: null,
    explanationReplay: null,
    settings: { language: "he", gender: "", age: "", pace: DEFAULT_PACE },
    pageReturn: null,
    // The last in-game screen the learner was on (story / workspace /
    // nandBuildHelp). setState keeps it current; "continue" from the main menu
    // returns here, so leaving the workbench for the menu and coming back lands
    // on the workbench (with its contents), not the warehouse.
    resumeScreen: null,
    paceHintShown: false,
    paceDialog: false,
    infoDialog: null,
    // Routing-card requirements dialog (Mux/DMux) opened from the explanations menu.
    explRoutingInfo: null,
    componentMonologue: null,
    converterInfo: null,
    busesEquipmentSeen: [],
    arithConvertersSeen: [],
    busesNoteList: false,
    // The 2.5 arithmetic worktable note (halfAdder → fullAdder → Add4 → Add16).
    arithNoteList: false,
    // The "create new card" tool, introduced at the end of the MUX16 walkthrough.
    // createCardUnlocked persists (the tool stays in the palette). cardIntroPending
    // drives the one-time scripted moment right after MUX16: the "new card" speech
    // bubble is shown, the next click anywhere in the workbench opens the card page
    // with its explainer, and dismissing the explainer ("הבנתי") continues the plot
    // (the von Neumann beat). It persists so a page reload mid-sequence keeps it.
    // Which binary-booklet tasks the learner has solved cleanly (a subset of
    // BIN_STAGES). Persists across booklet exits so re-entry lands on the first
    // unfinished task, and once all are done the booklet opens on its menu.
    binBookletDone: [],
    // Whether the library's decimal column-addition exercise (the Stone-Millis
    // book) has been solved. Today it is a mandatory step before the binary
    // booklet, but the "מחשב" achievement checks it explicitly so it keeps
    // requiring the library task even if the flow ever changes.
    libraryArithDone: false,
    // Booklet-mastery bookkeeping for the calculation achievements:
    //   binFirstTryClean — stages solved cleanly on their very first exercise
    //     (no fails, no hint) → "מחשב מדויק" / "מחשב יסודי ומדויק".
    //   binMenuResolved — stages re-solved from the booklet menu after all were
    //     already done → "מחשב יסודי" / "מחשב יסודי מאוד".
    binFirstTryClean: [],
    binMenuResolved: [],
    // Whether the post-booklet "bits-range" plot dialogue has been shown. It
    // plays once (on the first completion, or the next booklet open for players
    // who finished it earlier), then booklet visits go straight to the menu.
    bitsRangeSeen: false,
    // Cards (build tasks) whose test has failed at least once — a later success
    // then no longer counts toward the "מהנדס מדויק" first-try achievement.
    // Cleared for a note's tasks when that note's progress is cleared, so a
    // fresh clean rebuild can earn the "מדויק" chapter achievements again.
    tasksFailedOnce: [],
    // Every task ever completed (never cleared), and the ever-completed tasks
    // that were later cleared from a task note — together they drive "מהנדס
    // יסודי" (re-doing an already-done task after clearing its note).
    tasksEverCompleted: [],
    tasksClearedAfterCompletion: [],
    createCardUnlocked: false,
    cardIntroPending: false,
    // Set once the von Neumann beat has played, so the scripted moment never
    // re-arms after the learner has been through it.
    cardIntroDone: false,
    cardCreation: null,
    // User-built cards, saved locally. Each: { type:"usercard-<n>", name,
    // inputs:[width…], outputs:[width…], logic:{components,wires} }. They become
    // placeable tools (a generic icon under their name). myCardsIntroSeen gates
    // the one-time "you can now use this card" message shown on the first save.
    savedCards: [],
    nextSavedCardId: 1,
    myCardsIntroSeen: false,
    // The card currently pending a delete confirmation on the "My cards" page.
    cardDeleteConfirm: null,
    // Which task note's "נקה התקדמות" warning is open ("boolean" | "routing" |
    // "buses" | "multibit"), or null when none.
    noteClearConfirm: null,
    // Transient input state for a story panel that gates advancement behind a
    // numeric answer: { value, feedback }.
    panelAnswer: null,
    // The "מילים ובתים" reading dialog: null when closed, else { page }.
    wordsBytesDialog: null,
    maxChapterReached: 0,
    // Furthest story-panel index reached, keyed by scene id. Drives the
    // step-by-step skip gate: skip is disabled until the target panel has been
    // reached, then stays enabled (even after going back within the chapter).
    maxPanelReached: {},
    // The arithmetic notebook (chapter 2.5), opened from the Stone-Millis book.
    // { exercise:{a,b}, cells:{"r,c":char}, active:"r,c"|null, result:null|"correct"|"wrong" }
    // Persisted so the learner's work survives leaving for the library and back.
    notebook: null,
    workspace: createDefaultWorkspace()
  };

  // Player settings. Language is fixed to Hebrew for now (the only option).
  // gender/age are stored empty by default; the *effective* behaviour treats an
  // empty gender as "בן" and an empty/invalid age as 13. Settings do not affect
  // anything yet — that is handled later.
  function normalizedSettings(raw) {
    const s = raw && typeof raw === "object" ? raw : {};
    return {
      language: "he",
      gender: s.gender === "בת" ? "בת" : (s.gender === "בן" ? "בן" : ""),
      age: typeof s.age === "string" ? s.age : (Number.isInteger(s.age) ? String(s.age) : ""),
      // How the player takes the lomda: "step" (step by step) or "all" (see
      // everything). An explicit choice is kept; otherwise DEFAULT_PACE applies.
      pace: (s.pace === "step" || s.pace === "all") ? s.pace : DEFAULT_PACE
    };
  }

  function effectiveGender() {
    return state.settings && state.settings.gender === "בת" ? "בת" : "בן";
  }

  function effectiveAge() {
    const n = parseInt(state.settings && state.settings.age, 10);
    return Number.isFinite(n) && n > 0 ? n : 13;
  }

  // Gender adaptation. When the player is a girl, texts that ADDRESS the player
  // in masculine Hebrew are shown in the feminine form. Story dialogue between
  // characters is unaffected (it is written per-character, not per-player).
  function isFemalePlayer() {
    return effectiveGender() === "בת";
  }

  // Pick the feminine string for a girl player, otherwise the masculine one.
  // Used for UI/code messages; injected into the view factories that need it.
  function genderText(masc, fem) {
    return isFemalePlayer() && fem != null ? fem : masc;
  }

  // A story panel may carry preference-based overrides — an alternate SVG that
  // reuses the same raster with different speech text, plus matching narration:
  //   femaleImage/femaleRead  — girl player
  //   babyImage/babyRead      — age 5 and under (most specific age band)
  //   youngImage/youngRead    — age under 13
  //   olderImage/olderRead    — age 17 and up
  // These affect DISPLAY only — the canonical `image` stays the panel's identity
  // for lookups (panelImageIs etc.). Returns {image, read} or null.
  function panelVariant(panel) {
    if (!panel) return null;
    const age = effectiveAge();
    if (panel.babyImage && age <= 5) return { image: panel.babyImage, read: panel.babyRead };
    if (panel.youngImage && age < 13) return { image: panel.youngImage, read: panel.youngRead };
    if (panel.olderImage && age >= 17) return { image: panel.olderImage, read: panel.olderRead };
    if (isFemalePlayer() && panel.femaleImage) return { image: panel.femaleImage, read: panel.femaleRead };
    return null;
  }

  function displayPanelImage(panel) {
    const v = panelVariant(panel);
    return v && v.image ? v.image : (panel ? panel.image : "");
  }

  function panelReadText(panel) {
    const v = panelVariant(panel);
    return v && v.read != null ? v.read : (panel ? panel.read : "");
  }

  // Feminine variants for player-addressed strings that live in shared data
  // (hints, solution/bit steps, card descriptions, end-dialogs). These are
  // evaluated at load time, before the player's gender is known, so they cannot
  // be wrapped inline — instead we resolve them at render time through this map.
  //
  // Both the key (masculine) and the value (feminine) are DERIVED from the real
  // source string via femOf(), so every unchanged character (including the
  // Hebrew maqaf ־ and quotes) is preserved exactly and the key always matches.
  function femOf(str, ...pairs) {
    return pairs.reduce((s, [a, b]) => s.split(a).join(b), str);
  }

  let __feminineTextMap = null;
  function feminineTextMap() {
    if (__feminineTextMap) return __feminineTextMap;
    const m = new Map();
    const add = (masc, ...pairs) => { if (typeof masc === "string") m.set(masc, femOf(masc, ...pairs)); };

    // ---- Task hints (js/app-data.js TASK_HINTS) ----
    if (typeof TASK_HINTS === "object" && TASK_HINTS) {
      add(TASK_HINTS.Not?.[0]?.text, ["נסה להשתמש", "נסי להשתמש"]);
      add(TASK_HINTS.Not?.[2]?.text, ["אתה יכול", "את יכולה"]);
      add(TASK_HINTS.And?.[0]?.text, ["חשוב על", "חשבי על"]);
      add(TASK_HINTS.And?.[2]?.text, ["אתה יכול", "את יכולה"], ["אתה מטפל", "את מטפלת"]);
      add(TASK_HINTS.And?.[4]?.text, ["שאתה צריך", "שאת צריכה"]);
      add(TASK_HINTS.Or?.[0]?.text, ["חשוב על", "חשבי על"]);
      add(TASK_HINTS.Or?.[1]?.text, ["אולי תשתמש", "אולי תשתמשי"]);
      add(TASK_HINTS.Or?.[2]?.text, ["חשוב מתי", "חשבי מתי"]);
      add(TASK_HINTS.Or?.[4]?.text, ["תבצע", "תבצעי"], ["תוכל", "תוכלי"]);
      add(TASK_HINTS.Xor?.[0]?.text, ["אתה כבר יודע", "את כבר יודעת"], ["אתה יודע", "את יודעת"], ["נסה לשלב", "נסי לשלב"], ["נסה להבין", "נסי להבין"], ["אתה צריך", "את צריכה"]);
      add(TASK_HINTS.AND3way?.[0]?.text, ["נסה ", "נסי "]);
      add(TASK_HINTS.AND3way?.[1]?.text, ["אתה יכול", "את יכולה"]);
      add(TASK_HINTS.AND3way?.[2]?.text, ["אתה צריך", "את צריכה"]);
      add(TASK_HINTS.DMux?.[0]?.text, ["אתה יכול", "את יכולה"]);
      add(TASK_HINTS.DMux?.[1]?.text, ["שים לב", "שימי לב"]);
      add(TASK_HINTS.DMux?.[2]?.text, ["אתה צריך", "את צריכה"], ["תלחץ", "תלחצי"]);
      add(TASK_HINTS.DMux?.[3]?.text, ["אתה צריך", "את צריכה"]);
      add(TASK_HINTS.Mux?.[0]?.text, ["זכור שמדובר", "זכרי שמדובר"], ["הבן באילו", "הביני באילו"], ["וטפל בהן", "וטפלי בהן"]);
      add(TASK_HINTS.Mux?.[1]?.text, ["אתה יכול", "את יכולה"]);
      add(TASK_HINTS.Mux?.[2]?.text, ["נסה להכין", "נסי להכין"], ["נסה לרשום", "נסי לרשום"]);
      add(TASK_HINTS.Mux?.[3]?.text, ["אתה צריך", "את צריכה"], ["תלחץ", "תלחצי"]);
      add(TASK_HINTS.Mux?.[4]?.text, ["אתה צריך", "את צריכה"]);
    }

    // ---- Bit explanation steps (js/app-data.js BIT_EXPLANATION_STEPS) ----
    if (Array.isArray(typeof BIT_EXPLANATION_STEPS !== "undefined" ? BIT_EXPLANATION_STEPS : null)) {
      add(BIT_EXPLANATION_STEPS[0], ["שים לב", "שימי לב"]);
      add(BIT_EXPLANATION_STEPS[1], ["אתה תראה", "את תראי"], ["תוכל להשתמש", "תוכלי להשתמש"]);
    }

    // ---- MUX card description (js/app-data.js ROUTING_TASK_DEFS) ----
    if (typeof ROUTING_TASK_DEFS !== "undefined" && Array.isArray(ROUTING_TASK_DEFS)) {
      const mux = ROUTING_TASK_DEFS.find((t) => t.id === "Mux");
      add(mux?.description, ["שים לב", "שימי לב"]);
    }

    // ---- Solution walkthrough steps (TASK_SOLUTION_STEPS, defined in app.js) ----
    if (typeof TASK_SOLUTION_STEPS === "object" && TASK_SOLUTION_STEPS) {
      for (const steps of Object.values(TASK_SOLUTION_STEPS)) {
        if (!Array.isArray(steps)) continue;
        for (const st of steps) {
          if (!st || typeof st.text !== "string") continue;
          if (st.text.includes("Not הוא בעצם Nand")) add(st.text, ["שים לב", "שימי לב"]);
          if (st.text.includes("להשתמש בכרטיס הזה גם עם 3 כניסות")) add(st.text, ["שים לב", "שימי לב"], ["אתה יכול", "את יכולה"], ["אתה לא חייב", "את לא חייבת"]);
        }
      }
    }

    // ---- End-of-course dialogs (js/data.js END_DIALOGS & app-data FALLBACK) ----
    [typeof END_DIALOGS !== "undefined" ? END_DIALOGS : null,
     typeof FALLBACK_END_DIALOGS !== "undefined" ? FALLBACK_END_DIALOGS : null]
      .filter(Boolean)
      .forEach((dialogs) => {
        add(dialogs.helpPrompt?.title, ["אתה מסכים לעזור", "את מסכימה לעזור"]);
        add(dialogs.helpRefusal?.paragraphs?.[3], ["תרצה", "תרצי"]);
        add(dialogs.returnToNandPrompt?.title, ["אתה כבר מכיר", "את כבר מכירה"]);
      });

    // ---- Achievement titles (js/achievements-data.js ACHIEVEMENTS) ----
    // The titles are gendered agent-nouns (מהנדס → מהנדסת …); descriptions use
    // 2nd-person past verbs that are spelled the same for both genders, so only
    // the titles need a feminine form. Keyed by id so each title gets only its
    // own substitutions.
    if (typeof ACHIEVEMENTS !== "undefined" && Array.isArray(ACHIEVEMENTS)) {
      const ENG = ["מהנדס", "מהנדסת"], PRECISE = ["מדויק", "מדויקת"], THOROUGH = ["יסודי", "יסודית"],
        CALC = ["מחשב", "מחשבת"], BOOL = ["בוליאני", "בוליאנית"], INVENT = ["ממציא", "ממציאה"], SAVE = ["שומר", "שומרת"];
      const femTitle = {
        "card-creator": [["יוצר", "יוצרת"]],
        "boolean-engineer": [ENG, BOOL],
        "routing-engineer": [ENG],
        "bus-engineer": [ENG],
        "calculator": [CALC],
        "arith-engineer": [ENG],
        "equipment-destroyer": [["משחית", "משחיתת"]],
        "precise-engineer": [ENG, PRECISE],
        "precise-boolean-engineer": [ENG, BOOL, PRECISE],
        "precise-routing-engineer": [ENG, PRECISE],
        "precise-bus-engineer": [ENG, PRECISE],
        "precise-arith-engineer": [ENG, PRECISE],
        "thorough-engineer": [ENG, THOROUGH],
        "precise-calc": [CALC, PRECISE],
        "thorough-calc": [CALC, THOROUGH],
        "very-thorough-calc": [CALC, THOROUGH],
        "thorough-precise-calc": [CALC, THOROUGH, PRECISE],
        "card-inventor": [INVENT],
        "card-saver": [SAVE],
        "card-necromancer": [["טוען", "טוענת"]],
        "connected": [["מחובר", "מחוברת"]],
        "progress-saver": [SAVE],
        "useful-inventor": [INVENT, ["שימושי", "שימושית"]],
        "scholar": [["למדן", "למדנית"]],
        "curious": [["סקרן", "סקרנית"]]
        // progress-necromancer ("מעלה מן האוב") reads the same for both genders.
      };
      ACHIEVEMENTS.forEach((a) => { if (femTitle[a.id]) add(a.title, ...femTitle[a.id]); });
    }

    __feminineTextMap = m;
    return m;
  }

  // Resolve a shared-data string to its feminine form for a girl player.
  function adaptGender(text) {
    if (!isFemalePlayer() || typeof text !== "string") return text;
    return feminineTextMap().get(text) || text;
  }

  // Component & terminal structure model lives in js/component-model.js. Created
  // first (the wiring, circuit, and state models below all build on it) with a
  // live reference to the component-definition table. Thin wrappers keep every
  // existing call site unchanged.
  const __componentModel = createComponentModel({ componentDefs: WORKSPACE_COMPONENT_DEFS, resolvePins: componentPins });
  const componentDef = (...args) => __componentModel.componentDef(...args);
  const pinsOf = (...args) => __componentModel.pinsOf(...args);
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
    componentGraphHasPath, normalizeWire, isNandOutputRef,
    wireWidthLegal
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
    const t = String(type || "");
    // Past chapter 2.2 the schematic shrinks — gates AND the Nand itself.
    if (!t.startsWith("gate-") && t !== "nand") return 1;
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

  // Saved cards are placeable components. Register them from raw storage BEFORE
  // loadState() normalizes the workspace — otherwise normalizeWorkspace, seeing
  // an unknown component type, would strip any placed saved card off the board.
  try {
    const rawSaved = localStorage.getItem(APP.storageKey);
    if (rawSaved) (JSON.parse(rawSaved).savedCards || []).forEach(registerSavedCard);
  } catch {}
  let state = loadState();
  // Seed the resume target from the loaded screen (covers states saved before
  // this field existed, and a page reload while on the workbench), so "continue"
  // returns to the workbench rather than the warehouse.
  if (["story", "workspace", "nandBuildHelp"].includes(state.screen) && !state.resumeScreen) {
    state.resumeScreen = state.screen;
  }
  // Re-arm the scripted card-intro moment for anyone who unlocked the card tool
  // but has not yet been through the von Neumann beat (covers states saved before
  // this sequence existed).
  if (state.createCardUnlocked && !state.cardIntroDone && !state.cardIntroPending) {
    state.cardIntroPending = true;
  }
  // Re-register from the loaded state (covers defaults) so the toolbar and board
  // recognise every saved card from the first render.
  registerAllSavedCards();
  let dragState = null;
  let dialogDragState = null;
  let suppressNextClick = false;

  // Circuit-simulation engine lives in js/circuit-engine.js. We inject the two
  // host dependencies it needs (terminalDirection, taskDefById); taskOutput and
  // otherWireEnd are pure globals from that file. The thin wrappers below keep
  // every existing call site (and evaluateWorkspace's default arg) unchanged.
  const __circuitEngine = createCircuitEngine({ terminalDirection, taskDefById, pinWidth, splitterOutputCount, resolvePins: componentPins, busGateSpec, arithBusGateSpec });
  const connectedOutputRefs = (workspace, inputRef, outputs) => __circuitEngine.connectedOutputRefs(workspace, inputRef, outputs);
  const inputSignal = (workspace, inputRef, outputs) => __circuitEngine.inputSignal(workspace, inputRef, outputs);
  const evaluateWorkspace = (workspace = state.workspace) => __circuitEngine.evaluateWorkspace(workspace);
  const evaluateWorkspaceBits = (workspace = state.workspace) => __circuitEngine.evaluateWorkspaceBits(workspace);

  // A workspace with splitters or bus gates must be simulated by the bus-aware
  // engine (so its lamps light up); everything else uses the single-bit engine.
  function workspaceHasBusElements(workspace = state.workspace) {
    return (workspace?.components || []).some((c) => c.type === "splitter" || c.type === "converter-in" || c.type === "converter-out" || busGateSpec(c.type) || String(c.type).startsWith("usercardFrame-"));
  }
  // A placed saved card is simulated by expanding it into its internal circuit
  // first (flattenWorkspaceForEval), then evaluating that. The bus-aware engine
  // is used whenever the expanded workspace has buses/cards (it handles single
  // bits too); lamp ids are preserved by the flattening, so lamp results still
  // key off the real, on-board lamp components.
  const workspaceEvaluation = (workspace = state.workspace) => {
    const flat = flattenWorkspaceForEval(workspace);
    return workspaceHasBusElements(flat) ? evaluateWorkspaceBits(flat) : evaluateWorkspace(flat);
  };

  // Component SVG markup lives in js/component-visuals.js (deps injected: esc,
  // gateComponentType, taskDefById). Thin wrappers keep every call site unchanged.
  const __componentVisuals = createComponentVisuals({ esc, gateComponentType, taskDefById, busGateSpec, savedCardMarkup });
  const componentSvgFilenameForType = (...args) => __componentVisuals.componentSvgFilenameForType(...args);
  const componentMarkup = (...args) => __componentVisuals.componentMarkup(...args);
  const converterMarkup = (...args) => __componentVisuals.converterMarkup(...args);
  const smokeMarkup = (...args) => __componentVisuals.smokeMarkup(...args);
  const charredNandMarkup = (...args) => __componentVisuals.charredNandMarkup(...args);

  // The splitter's leg-count drag handle (SVG markup + drag→count mapping) lives
  // in js/splitter-resize.js; app.js owns the shared drag state below.
  const __splitterResize = createSplitterResize({ SPLITTER_OUTPUT_SPACING, esc });

  // Board content markup (wires, terminals, placed components) lives in
  // js/board-render.js. Its builders take the workspace explicitly; the wrappers
  // below pass state.workspace so existing call sites stay unchanged.
  const __boardRender = createBoardRender({
    solutionHighlightConfig, terminalPosition, wireKey, esc, componentDef,
    componentMarkup, charredNandMarkup, smokeMarkup, isFixedWorkspaceComponent,
    componentRenderScale, resolvePins: componentPins, pinWidth
  });
  const renderWires = () => __boardRender.renderWires(state.workspace);
  const renderTerminals = () => __boardRender.renderTerminals(state.workspace);
  const renderComponent = (component, evaluation) => __boardRender.renderComponent(component, evaluation, state.workspace);

  // Wire operations (reachability, pruning, test wires, click-to-toggle rule)
  // live in js/wire-ops.js and operate purely on a workspace. The withWorkspace/
  // setState plumbing that calls them stays in this file.
  const __wireOps = createWireOps({
    otherWireEnd, splitTerminalRef, terminalExists, inputRefOf, wireKey,
    normalizeWire, canonicalTaskFrameWire, canAddWire,
    onWireAdded: applyWireWidthDefinition
  });
  const connectedTerminals = (...args) => __wireOps.connectedTerminals(...args);
  const removeInvalidWires = (...args) => __wireOps.removeInvalidWires(...args);
  const removeWiresAt = (...args) => __wireOps.removeWiresAt(...args);
  const addTestWire = (...args) => __wireOps.addTestWire(...args);
  const applyWireToggle = (...args) => __wireOps.applyWireToggle(...args);

  // Accident detection + Nand-output observation live in js/accident-observation.js
  // (deps injected). Created after wire-ops (it uses connectedTerminals). Thin
  // wrappers keep existing call sites unchanged.
  const __accidentObservation = createAccidentObservation({
    evaluateWorkspace, connectedTerminals, terminalDirection, otherWireEnd, isNandOutputRef
  });
  const detectWorkspaceAccident = (...args) => __accidentObservation.detectWorkspaceAccident(...args);
  const updateNandOutputObservation = (...args) => __accidentObservation.updateNandOutputObservation(...args);

  // Tool palette markup lives in js/toolbar-view.js (deps injected). Thin wrapper
  // keeps the existing renderWorkspace call site unchanged.
  const __toolbarView = createToolbarView({ toolbarGateToolIds, taskDefById, busTaskDefById, gateComponentType, componentMarkup, esc, isNandPresentationWorkspace, isFreeBuildWorkspace, isBusTaskWorkspace, isMultibitTaskWorkspace, createCardToolAvailable: () => Boolean(state.createCardUnlocked) && !state.cardCreation, savedCardTools: () => {
    // While editing a card, hide it and anything that (transitively) uses it, so
    // the learner can't build a cycle.
    const editing = state.cardCreation?.editingType || null;
    return (state.savedCards || [])
      .filter((card) => !editing || !cardUsesCard(card.type, editing))
      .map((card) => ({ type: card.type, label: card.name }));
  }, convertersAvailable: () => isArithTask(state.workspace?.taskId) || (isFreeBuildWorkspace() && state.chapterId === "chapter-8") });
  const renderToolbar = (...args) => __toolbarView.renderToolbar(...args);

  // Workbench-screen buttons and prompt overlays live in js/workspace-chrome-view.js.
  // They read live state via getState() and injected predicates. Thin wrappers
  // keep existing call sites unchanged.
  const __workspaceChromeView = createWorkspaceChromeView({
    getState: () => state,
    genderText,
    workspaceBuildHelpPromptActive, workspaceUnderstoodPromptActive, workspaceSkipDisabled
  });
  const renderWorkspaceAccidentModal = (...a) => __workspaceChromeView.renderWorkspaceAccidentModal(...a);
  const renderWorkspaceBuildHelpPrompt = (...a) => __workspaceChromeView.renderWorkspaceBuildHelpPrompt(...a);
  const renderWorkspaceBuildHelpButton = (...a) => __workspaceChromeView.renderWorkspaceBuildHelpButton(...a);
  const renderWorkspaceUnderstoodButton = (...a) => __workspaceChromeView.renderWorkspaceUnderstoodButton(...a);
  const renderWorkspaceReturnButton = (...a) => __workspaceChromeView.renderWorkspaceReturnButton(...a);
  const renderWorkspaceSkipButton = (...a) => __workspaceChromeView.renderWorkspaceSkipButton(...a);
  const renderWorkspaceUnderstoodPrompt = (...a) => __workspaceChromeView.renderWorkspaceUnderstoodPrompt(...a);

  // Nand monologue speech + truth table markup live in js/nand-monologue-view.js.
  const __nandMonologueView = createNandMonologueView({
    getState: () => state, esc, workspaceNandMonologueActive, NAND_MONOLOGUE_TEXTS
  });
  const renderWorkspaceNandMonologue = (...a) => __nandMonologueView.renderWorkspaceNandMonologue(...a);

  // Task-building UI (shell/intro/hint/check) lives in js/task-mode-view.js.
  const __taskModeView = createTaskModeView({
    getState: () => state, esc, genderText, adaptGender, taskDefById, busTaskDefById, busCheckDisplayRow, taskInputYs, solutionHighlightConfig,
    isNotTaskWorkspace, workspaceTaskIntroActive, notTestActive,
    multibitTaskDefById, isMultibitTaskWorkspace, renderMultibitTaskShell
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
    return Boolean(taskDefById(workspaceTaskId())) || isBusTaskWorkspace() || isMultibitTaskWorkspace();
  }

  // Chapter 2.5 multi-bit routing tasks (Dmux4way / Mux4way16). Their card is
  // built inside a frame like the bus tasks, but with a different I/O shape, so
  // they get their own shell and check harness.
  function multibitTaskDefById(id) {
    // Includes the arith BUS cards (Add4/Add16): they are checked with the same
    // multi-bit harness and drawn with the same bus shell. Their note/return flow
    // still goes through the arith path (guarded by isArithTask where it matters).
    return MULTIBIT_TASKS.find((task) => task.id === id)
      || (typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS.find((task) => task.id === id && task.busWidth) : null)
      || null;
  }
  function isMultibitTaskWorkspace() {
    return state.screen === "workspace" && Boolean(multibitTaskDefById(state.workspace?.taskId));
  }

  // The frame shell for a multi-bit routing task: a rounded rectangle around the
  // card with a stub for every pin (thin cable for width 1, bus bar + width for
  // wider), drawn from the frame's pin offsets. The control bus pokes out the top.
  function renderMultibitTaskShell() {
    const def = multibitTaskDefById(state.workspace?.taskId);
    if (!def) return "";
    const frameDef = WORKSPACE_COMPONENT_DEFS[taskCardComponentType(def.id)];
    if (!frameDef) return "";
    const card = (state.workspace?.components || []).find((c) => c.id === "task-card-1");
    const cx = Number.isFinite(card?.x) ? card.x : 640;
    const cy = Number.isFinite(card?.y) ? card.y : 288;
    // Add16 stacks four (tall) Add4 gates, so it gets a much taller frame.
    const tall = def.id === "Add16";
    const frameW = 600;
    const frameH = tall ? 540 : 420;
    const frameLeft = cx - 300;
    const frameTop = cy - frameH / 2;
    // A horizontal stub from the external tip (x1) all the way to the internal
    // connection point (x2), so BOTH the external pin and the internal pin the
    // learner wires to are visible (matching the bus-task shell). Same for a
    // vertical control stub.
    const hStub = (x1, x2, y, w, labelX) => (w > 1
      ? `<line class="workspace-task-shell-bus" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
         <line class="workspace-task-shell-bus-stripe" x1="${x1 + (x2 > x1 ? 4 : -4)}" y1="${y}" x2="${x2 - (x2 > x1 ? 4 : -4)}" y2="${y}" />
         <text class="splitter-width-label" x="${labelX}" y="${y - 16}" text-anchor="middle">${w}</text>`
      : `<line class="workspace-task-shell-pin" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />`);
    let stubs = "";
    for (const [pinId, pin] of Object.entries(frameDef.pins)) {
      if (!pinId.includes("Ext")) continue; // one stub per external pin
      const internalPin = frameDef.pins[pinId.replace("Ext", "Int")];
      const ax = cx + pin.x;
      const ay = cy + pin.y;
      const w = pin.width || 1;
      if (pin.y < -150) {
        // Control bus poking out the top, drawn down to its internal pin.
        const iy = cy + (internalPin ? internalPin.y : pin.y + 70);
        stubs += `<line class="workspace-task-shell-bus" x1="${ax}" y1="${ay}" x2="${ax}" y2="${iy}" />
          <line class="workspace-task-shell-bus-stripe" x1="${ax}" y1="${ay + 3}" x2="${ax}" y2="${iy - 3}" />
          <text class="workspace-task-shell-pin-label" x="${ax}" y="${ay - 14}" text-anchor="middle">בקרה</text>
          <text class="splitter-width-label" x="${ax + 26}" y="${ay + 20}" text-anchor="middle">${w}</text>`;
      } else {
        const ix = cx + (internalPin ? internalPin.x : (pin.x < 0 ? pin.x + 80 : pin.x - 80));
        const labelX = pin.x < 0 ? ax + 20 : ax - 20;
        stubs += hStub(ax, ix, ay, w, labelX);
      }
    }
    return `
      <g class="workspace-task-shell" aria-hidden="true">
        <rect class="workspace-task-shell-frame" x="${frameLeft}" y="${frameTop}" width="${frameW}" height="${frameH}" rx="18" />
        <text class="workspace-task-shell-title" x="${cx}" y="${frameTop - 10}" text-anchor="middle">${esc(def.label)}</text>
        ${stubs}
      </g>`;
  }

  // A chapter 2.4 bus-card build workspace (Not4 etc.). Kept separate from the
  // truth-table tasks: bus tasks have no rows and are checked with a splitter
  // harness over a few hard-coded cases instead of an exhaustive truth table.
  function isBusTaskWorkspace() {
    return state.screen === "workspace" && Boolean(busTaskDefById(state.workspace?.taskId));
  }

  // The workbench has three variants. This is the first one: "הצגת הנאנד" — the
  // Nand-presentation workbench (default source+Nand+lamp, the observe/"הבנת?"/
  // monologue flow). The other two are the task-card build (taskId set) and the
  // "empty table" free build (freeBuild set). Toolbar contents and the ability to
  // short the Nand both depend on being in this mode.
  function isNandPresentationWorkspace() {
    return (
      state.screen === "workspace" &&
      !workspaceTaskId() &&
      !state.workspace?.freeBuild
    );
  }

  function isFreeBuildWorkspace() {
    return state.screen === "workspace" && Boolean(state.workspace?.freeBuild);
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
      notTest: null,
      paceDialog: false,
      infoDialog: null,
      componentMonologue: null,
      converterInfo: null,
      busesNoteList: false,
      arithNoteList: false,
      panelAnswer: null,
      wordsBytesDialog: null
    };
  }

  function isGlobalNavigationAction(action) {
    return ["menu", "chapters", "about", "achievements", "explanations", "settings", "my-cards", "explanations-return", "explanation-open", "explanations-return-to-menu", "explanation-prev", "explanation-next", "exit", "start", "continue", "chapter", "reset-progress", "workspace-return-warehouse", "workspace-reset", "nand-monologue-prev"].includes(action);
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
    const screen = ["menu", "chapters", "story", "workspace", "nandBuildHelp", "about", "explanations", "settings", "notReady", "myCards", "notebook", "achievements"].includes(loaded.screen) ? loaded.screen : defaultState.screen;
    const workspace = normalizeWorkspace(loaded.workspace);

    if (loaded.dialog) {
      return {
        ...loaded,
        ...chapterStartState(chapter.id),
        soundOn: false,
        replayNonce: Number.isInteger(loaded.replayNonce) ? loaded.replayNonce : 0,
        settings: normalizedSettings(loaded.settings),
        maxChapterReached: Math.max(Number.isInteger(loaded.maxChapterReached) ? loaded.maxChapterReached : 0, chapterIndexById(chapter.id)),
        workspace
      };
    }

    const chapter4Scene = SCENES["nand-workshop-1943"];
    const workspaceAllowed = (
      chapter.id === "chapter-4" && (workspace.unlocked || panelIndex >= chapter4Scene.panels.length - 1)
    ) || (
      (chapter.id === "chapter-5" || chapter.id === "chapter-6" || chapter.id === "chapter-7" || chapter.id === "chapter-8") && workspace.unlocked
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
      settings: normalizedSettings(loaded.settings),
      maxChapterReached: Math.max(Number.isInteger(loaded.maxChapterReached) ? loaded.maxChapterReached : 0, chapterIndexById(chapter.id)),
      workspace
    };
  }

  function stateForStorageValue(value) {
    const workspace = normalizeWorkspace(value.workspace);
    workspace.selectedTerminal = null;
    return { ...value, soundOn: false, dialog: null, taskDialog: null, notTest: null, hintDialog: null, hintSlides: null, solutionDialog: null, bitDialog: null, paceDialog: false, infoDialog: null, explRoutingInfo: null, componentMonologue: null, converterInfo: null, busesNoteList: false, arithNoteList: false, cardCreation: null, cardDeleteConfirm: null, binClearConfirm: false, noteClearConfirm: null, panelAnswer: null, wordsBytesDialog: null, workspace };
  }

  function stateForStorage() {
    return stateForStorageValue(state);
  }

  function saveState() {
    try {
      localStorage.setItem(APP.storageKey, JSON.stringify(stateForStorage()));
      // Let the optional cloud-sync module (js/auth.js) know a save happened, so
      // it can push to the signed-in user's cloud copy. No-op when auth is off.
      window.dispatchEvent(new Event("tom:statesaved"));
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
    // Remember the last in-game screen (story / workspace / nandBuildHelp) so
    // "continue" from the main menu returns to exactly where the learner was,
    // including a workbench in mid-build. Menu/overlay screens don't overwrite
    // it, and NEITHER does the card-creation page: it is a transient card-build
    // session (reachable from the main menu / "My cards"), not a story position,
    // and its workspace is thrown away on exit — so resuming to it would drop the
    // learner onto a blank Nand workbench instead of where they actually were.
    if (IN_GAME_SCREENS.includes(state.screen) && !state.cardCreation) state.resumeScreen = state.screen;
    // Track the furthest chapter reached (drives step-by-step chapter locking).
    // Every chapter change flows through setState, so replaying an earlier
    // chapter never lowers this — completed chapters stay unlocked.
    const chapterIdx = chapterIndexById(state.chapterId);
    if (chapterIdx > (Number.isInteger(state.maxChapterReached) ? state.maxChapterReached : 0)) {
      state.maxChapterReached = chapterIdx;
    }
    // Track the furthest story panel reached per scene (drives the step-by-step
    // skip gate). Only story panels advance it, never workbench/menu screens.
    if (state.screen === "story" && Number.isInteger(state.panelIndex) && typeof state.sceneId === "string") {
      const reached = (state.maxPanelReached && typeof state.maxPanelReached === "object") ? state.maxPanelReached : {};
      const prev = Number.isInteger(reached[state.sceneId]) ? reached[state.sceneId] : -1;
      if (state.panelIndex > prev) {
        state.maxPanelReached = { ...reached, [state.sceneId]: state.panelIndex };
      }
    }
    saveState();
    render();
    if (shouldSpeak) speakCurrent();
  }

  function isStepByStepPace() {
    return state.settings && state.settings.pace === "step";
  }

  // Overlay pages (settings / about / not-ready) remember whether they were
  // opened from within the game, so their back button offers "חזרה למשחק" and
  // returns there; otherwise "חזרה לתפריט הראשי". Navigating from one overlay
  // page to another preserves the original in-game origin.
  const IN_GAME_SCREENS = ["story", "workspace", "nandBuildHelp"];
  const OVERLAY_PAGES = ["about", "settings", "notReady", "myCards", "achievements", "chapters"];

  function overlayReturnPatch() {
    if (IN_GAME_SCREENS.includes(state.screen)) return { pageReturn: state.screen };
    if (OVERLAY_PAGES.includes(state.screen)) return { pageReturn: state.pageReturn };
    return { pageReturn: null };
  }

  function pageBackButton() {
    const backToGame = IN_GAME_SCREENS.includes(state.pageReturn);
    const label = backToGame ? "חזרה למשחק" : "חזרה לתפריט הראשי";
    return `<button class="btn btn-primary" data-action="page-back">${label}</button>`;
  }

  // In step-by-step mode, chapters past the furthest one reached are locked.
  function chapterReached(chapterId) {
    if (!isStepByStepPace()) return true;
    const max = Number.isInteger(state.maxChapterReached) ? state.maxChapterReached : 0;
    return chapterIndexById(chapterId) <= max;
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
    speak(panelReadText(currentPanel()));
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
    // Simple, monochrome line house (Chrome-style) — main menu.
    if (name === "home") {
      return `<svg ${common}><path d="M3.5 11.5 L12 4 L20.5 11.5" /><path d="M6 10 V19.5 H18 V10" /></svg>`;
    }
    // Open book — chapters.
    if (name === "book") {
      return `<svg ${common}><path d="M12 6.2 C9.8 4.7 6.4 4.7 4 5.7 V18.2 C6.4 17.2 9.8 17.2 12 18.7 C14.2 17.2 17.6 17.2 20 18.2 V5.7 C17.6 4.7 14.2 4.7 12 6.2 Z" /><path d="M12 6.2 V18.7" /></svg>`;
    }
    // Academic cap (mortarboard) — explanations.
    if (name === "grad-cap") {
      return `<svg ${common}><path d="M2.5 9 L12 5 L21.5 9 L12 13 Z" /><path d="M6.5 10.7 V15 C6.5 15 8.8 16.8 12 16.8 C15.2 16.8 17.5 15 17.5 15 V10.7" /><path d="M21.5 9 V14" /></svg>`;
    }
    // Info circle — about.
    if (name === "info") {
      return `<svg ${common}><circle cx="12" cy="12" r="8.5" /><path d="M12 11 V16.5" /><path d="M12 7.6 V7.7" /></svg>`;
    }
    // Gear (cog: toothed rim + hub) — settings.
    if (name === "gear") {
      return `<svg ${common}><circle cx="12" cy="12" r="5.9" /><circle cx="12" cy="12" r="2.3" /><path d="M12 3.2 V6 M12 18 V20.8 M20.8 12 H18 M6 12 H3.2 M18.15 5.85 L16.2 7.8 M7.8 16.2 L5.85 18.15 M18.15 18.15 L16.2 16.2 M7.8 7.8 L5.85 5.85" /></svg>`;
    }
    // Play triangle pointing left (RTL "start") — filled.
    if (name === "play-rtl") {
      return `<svg ${common}><path class="icon-fill" d="M15.5 5.5 L6.5 12 L15.5 18.5 Z" /></svg>`;
    }
    // Resume: left triangle with a bar on its right, mirrored from the IDE
    // "continue" glyph (bar comes first in RTL reading order).
    if (name === "resume-rtl") {
      return `<svg ${common}><path class="icon-fill" d="M13 6 L5.5 12 L13 18 Z" /><path class="icon-bar" d="M18 5.5 V18.5" /></svg>`;
    }
    // Trash can — reset progress.
    if (name === "trash") {
      return `<svg ${common}><path d="M4 7 H20" /><path d="M9.5 7 V4.6 H14.5 V7" /><path d="M6.2 7 L7.2 20 H16.8 L17.8 7" /><path d="M10 10.5 V16.5 M14 10.5 V16.5" /></svg>`;
    }
    // Stacked cards — "my cards".
    if (name === "cards") {
      return `<svg ${common}><rect x="6.5" y="4.5" width="12" height="9" rx="1.6" transform="rotate(-9 12.5 9)" /><rect x="5" y="10" width="12" height="9" rx="1.6" /></svg>`;
    }
    // Pencil — edit.
    if (name === "pencil") {
      return `<svg ${common}><path d="M4 20 L4 16.5 L15 5.5 L18.5 9 L7.5 20 Z" /><path d="M13 7.5 L16.5 11" /></svg>`;
    }
    // Down arrow into a tray — download / save to computer.
    if (name === "download") {
      return `<svg ${common}><path d="M12 4 V14" /><path d="M8 10.5 L12 14.5 L16 10.5" /><path d="M4.5 19.5 H19.5" /></svg>`;
    }
    // Up arrow out of a tray — upload / load from computer.
    if (name === "upload") {
      return `<svg ${common}><path d="M12 15 V5" /><path d="M8 8.5 L12 4.5 L16 8.5" /><path d="M4.5 19.5 H19.5" /></svg>`;
    }
    // Plus — create new.
    if (name === "plus") {
      return `<svg ${common}><path d="M12 5 V19" /><path d="M5 12 H19" /></svg>`;
    }
    // Trophy — achievements.
    if (name === "trophy") {
      return `<svg ${common}><path d="M7 4 H17 V9 A5 5 0 0 1 7 9 Z" /><path d="M7 5.5 H4.2 V7 A3.2 3.2 0 0 0 7.5 10.1" /><path d="M17 5.5 H19.8 V7 A3.2 3.2 0 0 1 16.5 10.1" /><path d="M12 14 V16.5" /><path d="M9 20 H15 L14.3 16.8 H9.7 Z" /></svg>`;
    }
    // Account — a person head + shoulders (login / logout).
    if (name === "account") {
      return `<svg ${common}><circle cx="12" cy="8" r="3.6" /><path d="M5.5 19.5 A6.5 6.5 0 0 1 18.5 19.5" /></svg>`;
    }
    // Google — the multicolour "G" (used on the account button, matching the chip).
    if (name === "google") {
      return `<svg class="nav-icon" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.1-3.8 6.5-9.4 6.5-16z"/>
        <path fill="#FBBC05" d="M10.4 28.3a14.5 14.5 0 0 1 0-8.6l-7.9-6.1a24 24 0 0 0 0 20.8l7.9-6.1z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.8 2.1-6.3 0-11.7-3.7-13.6-9l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/>
      </svg>`;
    }
    return "";
  }

  function navButton(action, iconName, label, options = {}) {
    const classes = `btn icon-btn${options.primary ? " btn-primary" : ""}`;
    const disabled = options.disabled ? "disabled" : "";
    return `<button class="${classes}" data-action="${esc(action)}" aria-label="${esc(label)}" title="${esc(label)}" ${disabled}>${navIcon(iconName)}<span class="visually-hidden">${esc(label)}</span></button>`;
  }

  // A button with an icon shown beside its visible text label (top bar / menu).
  function labeledButton(action, iconName, label, options = {}) {
    const classes = `btn labeled-btn${options.primary ? " btn-primary" : ""}`;
    const attrs = options.attrs ? ` ${options.attrs}` : "";
    return `<button class="${classes}" data-action="${esc(action)}"${attrs}>${navIcon(iconName)}<span class="btn-label">${esc(label)}</span></button>`;
  }

  // "My cards" is a permanent menu entry, but in step-by-step mode it stays
  // disabled until the card-creation tool has been unlocked. Its click is not
  // wired up yet (no handler → a no-op).
  function myCardsEnabled() {
    return !isStepByStepPace() || Boolean(state.createCardUnlocked);
  }
  function myCardsButton() {
    return labeledButton("my-cards", "cards", "הכרטיסים שלי", { attrs: myCardsEnabled() ? "" : "disabled" });
  }

  // The Google account button, shown in the main menu ONLY when cloud sign-in is
  // available (js/auth.js loaded its config + library and published APP.auth).
  // With auth disabled/offline it returns "" and the menu simply omits it —
  // saving/loading progress to a FILE stays available regardless.
  function authBridge() {
    return (typeof APP !== "undefined" && APP && APP.auth) ? APP.auth : null;
  }
  function accountMenuButton() {
    const auth = authBridge();
    if (!auth) return "";
    const user = auth.user || null;
    if (user) {
      const name = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || user.email || "";
      const label = name ? `התנתק (${name})` : "התנתק";
      return labeledButton("auth-signout", "account", label);
    }
    return labeledButton("auth-signin", "account", "התחבר עם Google");
  }

  function topbar() {
    const contentScreens = ["story", "workspace", "nandBuildHelp", "notebook"];
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
          ${labeledButton("menu", "home", "תפריט ראשי")}
          ${labeledButton("chapters", "book", "פרקים")}
          ${labeledButton("explanations", "grad-cap", "הסברים")}
          ${labeledButton("achievements", "trophy", "השיגים")}
          ${myCardsButton()}
          ${labeledButton("about", "info", "אודות")}
          ${labeledButton("settings", "gear", "הגדרות")}
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
    unlockExplanation("truth-table-cards", { silent: true });
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
    if (!isPastSimpleGatesChapter()) return completedTaskIds();
    // In chapter 2.3+: all the 2.2 gates, plus routing cards (MUX/DMUX) and 2.4
    // bus cards that have a placeable gate (Not4 …).
    const routingIds = ROUTING_TASK_DEFS.map((task) => task.id);
    const busIds = BUS_TASK_DEFS
      .map((task) => task.id)
      .filter((id) => WORKSPACE_COMPONENT_DEFS[gateComponentType(id)]);
    // Arith cards that have a placeable gate (halfAdder, reused inside fullAdder).
    const arithIds = ARITH_TASKS
      .map((task) => task.id)
      .filter((id) => WORKSPACE_COMPONENT_DEFS[gateComponentType(id)]);
    const arithCompleted = arithIds.filter(taskCompleted);
    // In the multi-bit routing build (chapter 2.5) EVERY earlier-chapter card is
    // offered even if the learner skipped ahead and never built it — otherwise
    // the task (which needs MUX16/DMUX) would be impossible. The 2.5 free-build
    // table (the workshop worktable) follows the same rule for earlier chapters.
    // The arith cards, though, belong to THIS chapter (2.5): they respect
    // completion so that clearing the arith note drops the cards it built out of
    // the palette until they are rebuilt (a locked card can't be reached anyway).
    if (isMultibitTaskWorkspace() || (isFreeBuildWorkspace() && state.chapterId === "chapter-8")) {
      return [...TASK_DEFS.map((task) => task.id), ...routingIds, ...busIds, ...arithCompleted];
    }
    // Building an arith card (halfAdder / fullAdder) on the 2.5 worktable: every
    // card from an EARLIER stage is offered even if the learner skipped it (so
    // clearing this note's progress does not strip the palette down to the basic
    // gates), plus the arith cards actually built in this stage — a cleared arith
    // card drops out because it is no longer completed.
    if (isArithTask(state.workspace?.taskId)) {
      return [...TASK_DEFS.map((task) => task.id), ...routingIds, ...busIds, ...arithCompleted];
    }
    const routingCompleted = routingIds.filter(taskCompleted);
    const busCompleted = busIds.filter(taskCompleted);
    return [...TASK_DEFS.map((task) => task.id), ...routingCompleted, ...busCompleted, ...arithCompleted];
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

  // Both routing cards (MUX + DMUX) of chapter 2.3 completed.
  function allRoutingTasksCompletedIn(taskIds = completedTaskIds()) {
    const completed = new Set(Array.isArray(taskIds) ? taskIds : []);
    return ROUTING_TASK_DEFS.every((task) => completed.has(task.id));
  }

  // Every card in the arith note (the LAST task list in the game) completed.
  function allArithTasksCompletedIn(taskIds = completedTaskIds()) {
    const completed = new Set(Array.isArray(taskIds) ? taskIds : []);
    const arith = typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : [];
    return arith.length > 0 && arith.every((task) => completed.has(task.id));
  }

  // Entry point of chapter 2.4 (the "buses" story scene).
  function chapter24StartTarget() {
    return storyTarget(chapterById("chapter-7"), 0);
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
    if (![1, 2].includes(Number(state.workspace?.workspaceSession))) return true;
    // Step-by-step: the workbench (Nand presentation / task build) can't be
    // skipped on a first pass through its chapter.
    return stepFirstVisit();
  }

  // Step-by-step: skip is disabled on the learner's FIRST pass through a chapter
  // (the current chapter is the furthest one reached). Once they have gone on to
  // a later chapter, replaying an earlier one re-enables the shortcut.
  function stepFirstVisit() {
    if (!isStepByStepPace()) return false;
    const maxChapter = Number.isInteger(state.maxChapterReached) ? state.maxChapterReached : 0;
    return chapterIndexById(state.chapterId) >= maxChapter;
  }

  // The 2.4 closing monologue (the "go to sleep / library" slides after the
  // next-tasks worktable) leads into chapter 2.5, so its skip jumps to the next
  // chapter rather than to a panel in this scene.
  function busesClosingMonologue() {
    if (state.screen !== "story" || state.sceneId !== "buses") return false;
    const g = panelIndexByImage(currentScene(), "panel99g_chapter_2_4_worktable_next.svg");
    return g >= 0 && Number.isInteger(state.panelIndex) && state.panelIndex > g;
  }

  // A skip that would leave the learner on the very same panel does nothing, so
  // its button is hidden. Only the panel-based skips (part-2 story scenes) can be
  // no-ops — part-1 jumps to the next chapter, chapter-4 opens the workbench, and
  // the 2.4 closing monologue jumps to chapter 2.5.
  function skipLeadsNowhere() {
    if (state.screen !== "story") return false;
    const chapter = currentChapter();
    if (chapter?.partId === "part-1" || chapter?.id === "chapter-4") return false;
    if (busesClosingMonologue()) return false;
    return skipTargetPanelIndex() === state.panelIndex;
  }

  // Whether the learner has already reached what the STORY skip targets. Once
  // reached it stays reached (going back within the chapter re-enables skip):
  //  - past this chapter entirely → reached;
  //  - part-1: skip jumps to the next chapter → reached once that chapter opens;
  //  - otherwise (panel-based): the furthest story panel is at/after the target
  //    (for 2.1 the target is the workbench launch panel).
  function skipTargetReached() {
    const chapter = currentChapter();
    const idx = chapterIndexById(chapter?.id);
    const maxChapter = Number.isInteger(state.maxChapterReached) ? state.maxChapterReached : 0;
    if (maxChapter > idx) return true;
    if (chapter?.partId === "part-1") return false;
    // The 2.4 closing monologue skips to chapter 2.5 — reached only once that
    // chapter has been visited (handled by the maxChapter check above).
    if (busesClosingMonologue()) return false;
    const reached = (state.maxPanelReached && typeof state.maxPanelReached === "object") ? state.maxPanelReached : {};
    const max = Number.isInteger(reached[state.sceneId]) ? reached[state.sceneId] : -1;
    const target = skipTargetPanelIndex();
    if (max < target) return false;
    // Skipping the 2.4 opening also skips examining the new bus + splitter, so on
    // a first pass the shortcut is withheld until that equipment has actually
    // been examined (the tasks note depends on it).
    if (chapter?.id === "chapter-7" && target === panelIndexByImage(currentScene(), "panel99_chapter_2_4_worktable.svg")) {
      return newEquipmentChecked();
    }
    return true;
  }

  function isSkipDisabled() {
    if (state.screen === "workspace") return workspaceSkipDisabled();
    if (state.screen !== "story") return true;

    const chapter = currentChapter();
    // A skip that leads nowhere (worktable notes, the closing wordless slide) is
    // hidden in every mode.
    if (skipLeadsNowhere()) return true;
    // Step-by-step: no skipping AHEAD to a target not yet reached. Once the
    // target has been reached the shortcut is available again (e.g. after going
    // back through the chapter's opening).
    if (isStepByStepPace() && !skipTargetReached()) return true;

    if (chapter?.partId === "part-1") return false;
    if (chapter?.id === "chapter-4") return false;
    if (chapter?.id === "chapter-5") return state.panelIndex >= currentScene().panels.length - 1;

    return false;
  }

  function renderDialog() {
    if (!state.dialog) return "";
    const dialog = endDialogs()[state.dialog];
    if (!dialog) return "";

    const title = dialog.title ? `<h2 class="dialog-title">${esc(adaptGender(dialog.title))}</h2>` : "";
    const body = dialog.paragraphs
      ? `<div class="dialog-body">${dialog.paragraphs.map((p) => `<p>${esc(adaptGender(p))}</p>`).join("")}</div>`
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
        ariaLabel: "לחץ על ה-Nand",
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
    return hotspots.map((h) => {
      // A hotspot that carries a `url` opens that page in a new tab; it is
      // wired through the dedicated "open-external-url" action and stashes the
      // target in a data attribute the click handler reads.
      const action = h.url ? "open-external-url" : (h.action || "panel-hotspot");
      const urlAttr = h.url ? ` data-url="${esc(h.url)}"` : "";
      return `
      <button class="panel-hotspot" type="button" data-action="${esc(action)}"${urlAttr} aria-label="${esc(h.ariaLabel || "אזור אינטראקטיבי")}" style="left:${Number(h.left)}%;top:${Number(h.top)}%;width:${Number(h.width)}%;height:${Number(h.height)}%;"></button>`;
    }).join("");
  }

  // EXPLANATION_ITEMS moved to js/app-data.js

  function explanationItem(id) {
    return EXPLANATION_ITEMS.find((item) => item.id === id) || null;
  }

  function explanationUnlocked(id) {
    // In "see everything" mode every explanation is available from the start.
    if (!isStepByStepPace()) return Boolean(explanationItem(id));
    return Array.isArray(state.explanationsUnlocked) && state.explanationsUnlocked.includes(id);
  }

  // Set when an explanation is unlocked for the first time; the next render
  // plays a short "icon flies into the הסברים button" animation.
  let explanationUnlockAnimationPending = false;

  function unlockExplanation(id, options) {
    if (!explanationItem(id) || explanationUnlocked(id)) return;
    state.explanationsUnlocked = [...(Array.isArray(state.explanationsUnlocked) ? state.explanationsUnlocked : []), id];
    // The unlock flourish normally plays right away, but some explanations are
    // unlocked "silently" and announced later (at the END of the explanation /
    // at the moment an optional one is declined) via announceExplanationUnlock.
    if (!options || !options.silent) explanationUnlockAnimationPending = true;
    saveState();
  }

  // Arm the "new explanation" flourish for the next render (used to play it at
  // the END of an explanation, decoupled from when the item was unlocked). With
  // an id it fires at most once ever (tracked in explanationsAnnounced) — so a
  // "closed the reading" hook and a "declined the teaser" hook can't double it.
  function announceExplanationUnlock(id) {
    if (id) {
      // Only announce an explanation that is actually unlocked (experienced), and
      // only once — so an end-hook can be called unconditionally at a natural
      // finish point without risking a flourish for something never seen.
      if (!explanationUnlocked(id)) return;
      const announced = Array.isArray(state.explanationsAnnounced) ? state.explanationsAnnounced : [];
      if (announced.includes(id)) return;
      state.explanationsAnnounced = [...announced, id];
      saveState();
    }
    explanationUnlockAnimationPending = true;
  }

  // A quick, deliberately noticeable flourish: an explanation icon appears at the
  // centre of the screen and is drawn into the topbar's הסברים button, so the
  // learner notices a new explanation has become available.
  function playExplanationUnlockAnimation() {
    const target = document.querySelector('.topbar [data-action="explanations"]');
    if (!target || typeof target.animate !== "function") return;
    const tr = target.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const dx = (tr.left + tr.width / 2) - startX;
    const dy = (tr.top + tr.height / 2) - startY;
    const fly = document.createElement("div");
    fly.className = "expl-unlock-fly";
    fly.style.left = `${startX}px`;
    fly.style.top = `${startY}px`;
    fly.innerHTML = navIcon("grad-cap");
    document.body.appendChild(fly);
    const anim = fly.animate([
      { transform: "translate(-50%,-50%) scale(0.5)", opacity: 0, offset: 0 },
      { transform: "translate(-50%,-50%) scale(1.25)", opacity: 1, offset: 0.22 },
      { transform: "translate(-50%,-50%) scale(1.1)", opacity: 1, offset: 0.42 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.18)`, opacity: 0.15, offset: 1 }
    ], { duration: 780, easing: "cubic-bezier(.4,0,.25,1)" });
    anim.onfinish = () => fly.remove();
    anim.oncancel = () => fly.remove();
    // A little pop on the button as the icon lands.
    target.animate([
      { transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(1)" }
    ], { duration: 320, delay: 560, easing: "ease-out" });
  }

  // "אני רוצה עוד לשחק עם זה" on the "הבנת?" prompt: shrink the dialog into the
  // "הבנת?" button that appears in the controls, so the learner sees where it
  // went. `fromRect` is the dismissed card's bounding rect (captured before the
  // re-render removed it).
  function playUnderstoodSuckAnimation(fromRect) {
    const target = app.querySelector('[data-action="understood-open"]');
    if (!target || !fromRect || typeof target.animate !== "function") return;
    const tr = target.getBoundingClientRect();
    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const dx = (tr.left + tr.width / 2) - startX;
    const dy = (tr.top + tr.height / 2) - startY;
    const fly = document.createElement("div");
    fly.className = "understood-suck-fly";
    fly.textContent = "הבנת?";
    fly.style.left = `${startX}px`;
    fly.style.top = `${startY}px`;
    document.body.appendChild(fly);
    const anim = fly.animate([
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: 0 },
      { transform: "translate(-50%,-50%) scale(0.9)", opacity: 1, offset: 0.15 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.1)`, opacity: 0.1, offset: 1 }
    ], { duration: 460, easing: "cubic-bezier(.55,0,.9,.85)" });
    anim.onfinish = () => fly.remove();
    anim.oncancel = () => fly.remove();
    // A little pop on the button as the card lands.
    target.animate([
      { transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }
    ], { duration: 300, delay: 320, easing: "ease-out" });
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
      // Silent; announced when the Nand intro ends and the workbench opens.
      unlockExplanation("nand-intro", { silent: true });
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
      // Unlocked silently; its flourish plays at the END of the Nand monologue.
      unlockExplanation("nand-function", { silent: true });
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
      // Unlocked silently; its flourish plays when the teaser is declined
      // ("לא כרגע") or after the build-help screen is closed ("כן").
      unlockExplanation("build-nand", { silent: true });
    }

    if (
      Boolean(state.bitInfoUnlocked) ||
      Boolean(state.bitDialog) ||
      bitInfoButtonVisible() ||
      state.explanationReplay?.id === "bit-info"
    ) {
      // Silent; announced when the bit dialog is closed.
      unlockExplanation("bit-info", { silent: true });
    }

    if (
      Boolean(state.xorTableHelpUnlocked) ||
      xorTableHelpButtonVisible() ||
      state.hintSlides?.taskId === "Xor" ||
      state.explanationReplay?.id === "truth-table-cards"
    ) {
      // Silent; announced when the Xor hint slides are finished.
      unlockExplanation("truth-table-cards", { silent: true });
    }

    const reachedChapter6 = currentIndex > chapterIndexById("chapter-5") || state.chapterId === "chapter-6";
    if (reachedChapter6 || state.explanationReplay?.id === "why-route") {
      // Silent here (this also unlocks it retroactively for a player already past
      // chapter 2.3). Its flourish is announced when the learner advances past the
      // routing-concept panel — panel89 declares unlocksExplanation:"why-route",
      // handled by the generic "leaving panel" hook in nextPanel.
      unlockExplanation("why-route", { silent: true });
    }

    // The routing cards' menu buttons unlock once their task is solved.
    if (!isStepByStepPace() || taskCompleted("Mux")) unlockExplanation("gate-Mux");
    if (!isStepByStepPace() || taskCompleted("DMux")) unlockExplanation("gate-DMux");

    // A story panel may declare an explanation it unlocks just by being reached
    // (e.g. the bits-range "64,000" slide unlocks "מילים ובתים", whether the red
    // link is clicked or ignored). Unlocked silently — its flourish is announced
    // when the reading is closed, or when the learner advances past the panel
    // without opening it (declined) — see advanceStoryPanel.
    if (state.screen === "story") {
      const cp = currentPanel();
      if (cp && cp.unlocksExplanation) unlockExplanation(cp.unlocksExplanation, { silent: true });
    }
  }

  // Achievements that can be derived from persistent progress state are granted
  // here (run every render, like syncExplanationUnlocks), so they also unlock
  // retroactively for a player who is already past the relevant point. The
  // one-shot achievements (burning a Nand, saving/loading a card, a clean solve)
  // are granted at their event site instead.
  function syncAchievements() {
    // Keep the "ever completed" ledger current (it is never cleared, so it
    // outlives a task-note progress reset).
    const completedNow = completedTaskIds();
    const ever = Array.isArray(state.tasksEverCompleted) ? state.tasksEverCompleted : [];
    const missingFromEver = completedNow.filter((id) => !ever.includes(id));
    if (missingFromEver.length) {
      state.tasksEverCompleted = [...ever, ...missingFromEver];
      saveState();
    }

    // Chapter task-id groups (2.2 boolean, 2.3 routing, 2.4 buses across both notes).
    const boolIds = TASK_DEFS.map((t) => t.id);
    const routeIds = ROUTING_TASK_DEFS.map((t) => t.id);
    const busIds = [...BUS_TASK_DEFS.map((t) => t.id), ...MULTIBIT_TASKS.map((t) => t.id)];

    // Progress milestones.
    if (completedNow.length >= 1) unlockAchievement("card-creator");
    if (allNoteTasksCompletedIn()) unlockAchievement("boolean-engineer");
    if (allRoutingTasksCompletedIn()) unlockAchievement("routing-engineer");
    if (busIds.every((id) => taskCompleted(id))) unlockAchievement("bus-engineer");
    // "מחשב" needs BOTH the library arithmetic task and every booklet stage.
    if (state.libraryArithDone && BIN_STAGES.every((s) => binDone().includes(s))) unlockAchievement("calculator");

    // Chapter 2.5 build-task group (the worktable note: halfAdder → Add16).
    const arithIds = (typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : []).map((t) => t.id);
    if (arithIds.length > 0 && arithIds.every((id) => taskCompleted(id))) unlockAchievement("arith-engineer");

    // "מדויק" chapter achievements: every card of the chapter built with no failed
    // test (hints only unlock after a failure, so "no failures" == "no hints").
    const failed = new Set(Array.isArray(state.tasksFailedOnce) ? state.tasksFailedOnce : []);
    const chapterClean = (ids) => ids.length > 0 && ids.every((id) => taskCompleted(id) && !failed.has(id));
    if (chapterClean(boolIds)) unlockAchievement("precise-boolean-engineer");
    if (chapterClean(routeIds)) unlockAchievement("precise-routing-engineer");
    if (chapterClean(busIds)) unlockAchievement("precise-bus-engineer");
    if (chapterClean(arithIds)) unlockAchievement("precise-arith-engineer");

    // "מהנדס יסודי": a task that was completed, cleared from its note, and then
    // completed again.
    const clearedAfter = Array.isArray(state.tasksClearedAfterCompletion) ? state.tasksClearedAfterCompletion : [];
    if (clearedAfter.some((id) => taskCompleted(id))) unlockAchievement("thorough-engineer");

    // Calculation mastery, derived from the booklet's bookkeeping arrays.
    const menuResolved = Array.isArray(state.binMenuResolved) ? state.binMenuResolved : [];
    if (menuResolved.length >= 1) unlockAchievement("thorough-calc");
    if (BIN_STAGES.every((s) => menuResolved.includes(s))) unlockAchievement("very-thorough-calc");
    const firstTryClean = Array.isArray(state.binFirstTryClean) ? state.binFirstTryClean : [];
    if (BIN_STAGES.every((s) => firstTryClean.includes(s))) unlockAchievement("thorough-precise-calc");
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

    if (id === "why-route") {
      if (!explanationUnlocked("why-route")) return;
      const chapter = chapterById("chapter-6");
      const scene = sceneByChapter(chapter);
      const idx = panelIndexByImage(scene, "panel89_chapter_2_3_routing_concept.svg");
      return setState({
        ...transientUiClearPatch(),
        screen: "story",
        chapterId: chapter.id,
        sceneId: scene.id,
        panelIndex: idx >= 0 ? idx : 1,
        started: true,
        replayNonce: state.replayNonce + 1,
        explanationReplay: { id: "why-route" }
      }, true);
    }

    // A pure-text enrichment reading: opens a scrollable dialog over the current
    // screen (the explanations menu) rather than replaying a story scene.
    if (id === "words-bytes") {
      if (!explanationUnlocked("words-bytes")) return;
      return setState({ wordsBytesDialog: { page: 0 } }, false);
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

  // A חשבון explanation opens a sample exercise's solution and returns to the
  // explanations menu when done (flagged fromExplanations).
  function openArithExplanationSolution(arith) {
    if (arith === "dec-add") {
      const nb = freshNotebook(0);
      nb.dialog = "solution";
      nb.solutionStep = 0;
      nb.fromExplanations = true;
      setState({ screen: "notebook", notebook: nb }, false);
      return;
    }
    if (!["bin2dec", "dec2bin", "binadd"].includes(arith)) return;
    const ex = freshBinExercise(arith, 0, 0);
    ex.dialog = "walkthrough";
    ex.walkStep = 0;
    ex.fromExplanations = true;
    setState({ screen: "notebook", notebook: ex }, false);
  }

  function previousExplanationPanel() {
    if (explanationReplayActive("why-route")) return returnToExplanationsMenuFromReplay();
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
    // Single-panel replays (e.g. "why-route") just return to the menu.
    if (explanationReplayActive("why-route")) return returnToExplanationsMenuFromReplay();
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

  // The explanations menu is laid out as a table: one row per topic, and two
  // columns — the in-game explanations and the enrichment ones. Existing
  // explanations keep their handlers; they only move into the right cell. Items
  // that are not yet built (the three basic gates) render as inert buttons.
  const EXPLANATION_SECTIONS = [
    {
      title: "Nand",
      inGame: ["nand-intro", "nand-function"],
      enrichment: ["build-nand"]
    },
    {
      title: "שערים פשוטים",
      inGame: ["bit-info", { gatesLabel: "שלושת השערים הבסיסיים", gates: ["Not", "And", "Or"] }, "truth-table-cards"],
      enrichment: []
    },
    {
      title: "ניתוב",
      inGame: ["why-route", { gates: ["Mux", "DMux"], mode: "routing-info" }],
      enrichment: []
    },
    {
      title: "חשבון",
      inGame: [
        { arith: "dec-add", label: "חיבור עשרוני" },
        { arith: "bin2dec", label: "המרה מכתיב בינרי לכתיב עשרוני" },
        { arith: "dec2bin", label: "המרה מכתיב עשרוני לכתיב בינרי" },
        { arith: "binadd", label: "חיבור בינרי" }
      ],
      enrichment: []
    },
    // Memory: reserved for later (empty for now).
    {
      title: "זיכרון",
      inGame: [],
      enrichment: []
    },
    // Processor: currently holds the "מילים ובתים" enrichment reading.
    {
      title: "מעבד",
      inGame: [],
      enrichment: ["words-bytes"]
    }
  ];

  function explanationItemHtml(spec) {
    if (typeof spec === "string") {
      const item = explanationItem(spec);
      if (!item) return "";
      return explanationUnlocked(spec)
        ? `<button class="btn btn-primary expl-item" data-action="explanation-open" data-explanation-id="${esc(spec)}" type="button">${esc(item.title)}</button>`
        : `<button class="btn expl-item" type="button" disabled aria-disabled="true">${esc(item.title)}</button>`;
    }
    if (spec && spec.arith) {
      // An arithmetic exercise solution; active once its solution has been seen.
      const id = `arith-${spec.arith}`;
      return explanationUnlocked(id)
        ? `<button class="btn btn-primary expl-item" data-action="expl-arith-solution" data-arith="${esc(spec.arith)}" type="button">${esc(spec.label)}</button>`
        : `<button class="btn expl-item" type="button" disabled aria-disabled="true">${esc(spec.label)}</button>`;
    }
    if (spec && Array.isArray(spec.gates)) {
      // An optional (unlinked) label followed by a button per gate. The basic
      // gates open their solution walkthrough; the routing cards open a
      // requirements + truth-table dialog. Like the other explanations, a gate is
      // a light (active) button once unlocked, and a dark, disabled one until then.
      const act = spec.mode === "routing-info" ? "expl-routing-info" : "expl-gate-solution";
      const gates = spec.gates.map((g) => (
        explanationUnlocked(`gate-${g}`)
          ? `<button class="btn btn-primary expl-gate-btn" data-action="${act}" data-task-id="${esc(g)}" type="button">${esc(g)}</button>`
          : `<button class="btn expl-gate-btn" type="button" disabled aria-disabled="true">${esc(g)}</button>`
      )).join("");
      const label = spec.gatesLabel ? `<span class="expl-gate-label">${esc(spec.gatesLabel)}:</span>` : "";
      return `<div class="expl-gate-line">${label}<span class="expl-gate-buttons">${gates}</span></div>`;
    }
    return "";
  }

  function renderExplanationsMenu() {
    syncExplanationUnlocks();
    // "חזרה למשחק" when the menu was opened from within the game; otherwise it
    // returns to the main menu, so label it accordingly.
    const explBackLabel = IN_GAME_SCREENS.includes(state.explanationsReturnTo && state.explanationsReturnTo.screen)
      ? "חזרה למשחק" : "חזרה לתפריט הראשי";
    const cell = (list) => (list.map(explanationItemHtml).join("") || '<span class="expl-empty" aria-hidden="true"></span>');
    const rows = EXPLANATION_SECTIONS.map((sec) => `
      <div class="expl-section-title">${esc(sec.title)}</div>
      <div class="expl-cell">${cell(sec.inGame)}</div>
      <div class="expl-cell">${cell(sec.enrichment)}</div>`).join("");
    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen explanations-screen">
        <section class="menu-card explanations-card">
          <div class="page-return-top"><button class="btn return-to-game-btn" data-action="explanations-return" type="button">${explBackLabel}</button></div>
          <h1>הסברים</h1>
          <div class="explanations-table">
            <div class="expl-corner" aria-hidden="true"></div>
            <div class="expl-col-head">הסברים במשחק</div>
            <div class="expl-col-head">הסברי העשרה</div>
            ${rows}
          </div>
          <div class="about-actions" style="margin-top:1.15rem;padding-top:1rem;border-top:1px dashed rgba(70,50,25,.35);">
            <button class="btn return-to-game-btn" data-action="explanations-return" type="button">${explBackLabel}</button>
          </div>
        </section>
        ${renderExplRoutingInfoDialog()}
        ${renderWordsBytesDialog()}
      </main>`;
  }

  // The "מילים ובתים" enrichment reading, shown in a scrollable dialog over
  // whichever screen opened it (the explanations menu, or the story via the red
  // link on the last bits-range slide).
  function wordsBytesParagraphs() {
    return typeof WORDS_BYTES_PARAGRAPHS !== "undefined" ? WORDS_BYTES_PARAGRAPHS : [];
  }
  // The reading is paged one paragraph at a time; ← advances, → goes back (RTL),
  // matching the story/booklet navigation.
  function renderWordsBytesDialog() {
    if (!state.wordsBytesDialog) return "";
    const paras = wordsBytesParagraphs();
    const total = Math.max(1, paras.length);
    const page = Math.min(Math.max(0, Number(state.wordsBytesDialog.page) || 0), total - 1);
    const isFirst = page === 0;
    const isLast = page >= total - 1;
    const prev = navButton("words-bytes-prev", "arrow-right", "הקודם", { disabled: isFirst });
    const next = isLast
      ? `<button class="btn btn-primary" data-action="words-bytes-close" type="button">סיום</button>`
      : navButton("words-bytes-next", "arrow-left", "המשך", { primary: true });
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card words-bytes-card" role="dialog" aria-modal="false" aria-label="מילים ובתים">
          <h2 class="words-bytes-title">מילים ובתים</h2>
          <div class="words-bytes-body"><p>${esc(paras[page] || "")}</p></div>
          <div class="words-bytes-nav">
            <button class="btn" data-action="words-bytes-close" type="button">סגור</button>
            <span class="words-bytes-count">${page + 1} מתוך ${total}</span>
            <div class="words-bytes-arrows">${prev}${next}</div>
          </div>
        </section>
      </div>`;
  }

  // Closing the "מילים ובתים" reading is the end of that enrichment explanation →
  // announce its flourish now (a no-op if it was somehow already announced).
  function closeWordsBytes() {
    announceExplanationUnlock("words-bytes");
    setState({ wordsBytesDialog: null }, false);
  }

  function wordsBytesStep(delta) {
    if (!state.wordsBytesDialog) return;
    const total = Math.max(1, wordsBytesParagraphs().length);
    const page = Math.min(Math.max(0, Number(state.wordsBytesDialog.page) || 0), total - 1);
    const nextPage = page + delta;
    if (nextPage < 0 || nextPage >= total) return;
    setState({ wordsBytesDialog: { page: nextPage } }, false);
  }

  // The routing cards' requirements dialog (Mux/DMux): the card's description
  // plus its truth table, shown over the explanations menu.
  // Columns are ordered outputs → inputs (so, read right-to-left in Hebrew, they
  // are inputs → outputs); a thick rule marks the input/output boundary.
  const ROUTING_INFO_TABLE = {
    Mux: [
      { h: "יציאה", v: (r) => r.output, kind: "out" },
      { h: "כניסה 2", v: (r) => r.inputs[1], kind: "in" },
      { h: "כניסה 1", v: (r) => r.inputs[0], kind: "in" },
      { h: "בקרה", v: (r) => r.inputs[2], kind: "in" }
    ],
    DMux: [
      { h: "יציאה 2", v: (r) => r.outputs[1], kind: "out" },
      { h: "יציאה 1", v: (r) => r.outputs[0], kind: "out" },
      { h: "כניסה", v: (r) => r.inputs[0], kind: "in" },
      { h: "בקרה", v: (r) => r.inputs[1], kind: "in" }
    ]
  };
  function renderExplRoutingInfoDialog() {
    const info = state.explRoutingInfo;
    if (!info) return "";
    const def = ROUTING_TASK_DEFS.find((t) => t.id === info.taskId);
    const cols = ROUTING_INFO_TABLE[info.taskId];
    if (!def || !cols) return "";
    const bit = (b) => (b ? "1" : "0");
    const sepIdx = cols.findIndex((c) => c.kind === "in"); // first input column
    const cls = (i) => (i === sepIdx ? ' class="expl-tt-sep"' : "");
    const head = cols.map((c, i) => `<th${cls(i)}>${esc(c.h)}</th>`).join("");
    const body = def.rows.map((r) => `<tr>${cols.map((c, i) => `<td${cls(i)}>${bit(c.v(r))}</td>`).join("")}</tr>`).join("");
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card expl-routing-card" role="dialog" aria-modal="false" aria-label="${esc(def.label)}">
          <h2 class="expl-routing-title">${esc(def.label)}</h2>
          <p class="expl-routing-desc">${esc(def.description)}</p>
          <table class="expl-truth-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
          <div class="pace-dialog-actions">
            <button class="btn btn-primary" data-action="expl-routing-info-close" type="button">סגור</button>
          </div>
        </section>
      </div>`;
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
            ${labeledButton("start", "play-rtl", "התחל", { primary: true })}
            ${labeledButton("continue", "resume-rtl", "המשך")}
            ${labeledButton("chapters", "book", "פרקים")}
            ${labeledButton("explanations", "grad-cap", "הסברים")}
            ${labeledButton("achievements", "trophy", "השיגים")}
            ${myCardsButton()}
            ${labeledButton("about", "info", "אודות")}
            ${labeledButton("settings", "gear", "הגדרות")}
            ${labeledButton("reset-progress", "trash", "אפס התקדמות")}
          </div>
          <div class="menu-buttons menu-account-buttons">
            ${accountMenuButton()}
            ${labeledButton("save-progress-file", "download", "שמור התקדמות למחשב")}
            ${labeledButton("load-progress-file", "upload", "טען התקדמות מהמחשב")}
          </div>
          <input type="file" data-progress-file-input accept="application/json,.json" hidden />
        </section>
      </main>
      ${renderDialog()}`;
  }

  function renderAbout() {
    const linkAttrs = 'target="_blank" rel="noopener noreferrer"';
    app.innerHTML = `
      ${topbar()}
      <main class="screen about-screen">
        <section class="about-card">
          <h1>אודות</h1>
          <p>זהו פיילוט ראשוני של לומדה לפי הקורס <a href="https://www.nand2tetris.org/" ${linkAttrs}>nand2tetris</a>.</p>
          <p>מטרת הלומדה היא להנגיש באופן פשוט וחווייתי את התשובה לשאלה "איך בונים מחשב?". הלומדה מיועדת לקהל רחב עם התמקדות בילדים ובני נוער. מתחת לגיל 10 מומלץ ליווי מבוגר. הלומדה מתאימה גם לבוגרים, אבל אם יש לכם את הבגרות והקשב ללמוד קורס ברמה אוניברסיטאית, עדיף ללמוד את <a href="https://campus.gov.il/course/huji-acd-huji-nand2tetris/" ${linkAttrs}>הקורס המקורי באתר קמפוס.il</a> ולבוא לבקר כאן, בשביל החוויה.</p>
          <p>יצירת הלומדה היא באישור יוצרי הקורס המקורי <a href="https://he.wikipedia.org/wiki/%D7%A9%D7%9E%D7%A2%D7%95%D7%9F_%D7%A9%D7%95%D7%A7%D7%9F" ${linkAttrs}>שמעון שוקן</a> ו<a href="https://he.wikipedia.org/wiki/%D7%A0%D7%A2%D7%9D_%D7%A0%D7%99%D7%A1%D7%9F" ${linkAttrs}>נעם ניסן</a>, אך הם אינם נושאים בכל אחריות לתוכן הלומדה.</p>
          <p>העלילה בלומדה שואבת השראה מאירועים היסטוריים, אך היא בדיונית לחלוטין. אל תשתמשו בה כדי ללמוד היסטוריה.</p>
          <p>אשמח לשמוע הערות ב־<a href="mailto:aizenr@gmail.com">aizenr@gmail.com</a></p>
          <div class="about-links">
            <button class="btn" data-action="open-not-ready">קשר להיסטוריה</button>
            <button class="btn" data-action="open-not-ready">קשר לקורס</button>
          </div>
          <div class="about-actions">
            ${pageBackButton()}
          </div>
        </section>
      </main>`;
  }

  function achievementUnlocked(id) {
    return Array.isArray(state.achievementsUnlocked) && state.achievementsUnlocked.includes(id);
  }
  // Earn an achievement, arming the unlock flourish (played on the next render).
  let achievementUnlockAnimationPending = null;
  function unlockAchievement(id) {
    if (!ACHIEVEMENTS.some((a) => a.id === id) || achievementUnlocked(id)) return;
    state.achievementsUnlocked = [...(Array.isArray(state.achievementsUnlocked) ? state.achievementsUnlocked : []), id];
    achievementUnlockAnimationPending = id;
    saveState();
  }

  // The "new achievement" flourish, a sibling of the explanation-unlock one: the
  // earned achievement's own trophy blooms at the centre of the screen and is
  // drawn into the topbar's השיגים button. The flying icon lives on <body> so the
  // next render does not wipe it mid-animation.
  function playAchievementUnlockAnimation(achievementId) {
    const target = document.querySelector('.topbar [data-action="achievements"]');
    if (!target || typeof target.animate !== "function") return;
    const tr = target.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const dx = (tr.left + tr.width / 2) - startX;
    const dy = (tr.top + tr.height / 2) - startY;
    const fly = document.createElement("div");
    fly.className = "achv-unlock-fly";
    fly.style.left = `${startX}px`;
    fly.style.top = `${startY}px`;
    fly.innerHTML = renderAchievementIcon(achievementId);
    document.body.appendChild(fly);
    const anim = fly.animate([
      { transform: "translate(-50%,-50%) scale(0.4) rotate(-12deg)", opacity: 0, offset: 0 },
      { transform: "translate(-50%,-50%) scale(1.15) rotate(0deg)", opacity: 1, offset: 0.24 },
      { transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1, offset: 0.52 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.16)`, opacity: 0.12, offset: 1 }
    ], { duration: 900, easing: "cubic-bezier(.4,0,.25,1)" });
    anim.onfinish = () => fly.remove();
    anim.oncancel = () => fly.remove();
    target.animate([
      { transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }
    ], { duration: 340, delay: 640, easing: "ease-out" });
  }

  // A bridge for sibling modules (e.g. warehouse-hotspots.js, which owns the
  // reference-link popovers over story panels): earn an achievement and play its
  // flourish in place, without a full re-render that would wipe the module's own
  // DOM. Safe to call from anywhere once app.js has loaded.
  if (typeof APP !== "undefined") {
    APP.unlockAchievement = (id) => {
      if (achievementUnlocked(id)) return;
      unlockAchievement(id);
      if (achievementUnlockAnimationPending === id) {
        achievementUnlockAnimationPending = null;
        requestAnimationFrame(() => playAchievementUnlockAnimation(id));
      }
    };
    // A bridge for warehouse-hotspots.js so it can resolve a panel's live index by
    // image name instead of hardcoding one that breaks when slides are inserted.
    APP.panelIndexByImage = (sceneId, filename) => {
      try {
        const scene = typeof SCENES !== "undefined" ? SCENES[sceneId] : null;
        return scene ? panelIndexByImage(scene, filename) : -1;
      } catch { return -1; }
    };
    // A bridge for the cloud module (js/auth.js): swap the running game state to
    // the one pulled from the signed-in user's cloud copy, in place and WITHOUT
    // a page reload (a reload here used to loop). Returns true on success.
    APP.applyCloudState = (stateObj) => {
      if (!stateObj || typeof stateObj !== "object") return false;
      // Achievements are monotonic: never un-earn one by adopting a cloud copy
      // that happens to predate it. Union whatever is already earned locally.
      const priorAchievements = Array.isArray(state.achievementsUnlocked) ? state.achievementsUnlocked : [];
      let normalized;
      try {
        normalized = normalizeLoadedState({ ...defaultState, ...stateObj, soundOn: false });
      } catch (e) {
        return false;
      }
      const cloudAchievements = Array.isArray(normalized.achievementsUnlocked) ? normalized.achievementsUnlocked : [];
      normalized.achievementsUnlocked = Array.from(new Set([...priorAchievements, ...cloudAchievements]));
      state = normalized;
      // Being signed in is itself the "מחובר" achievement.
      if (APP.auth && APP.auth.user && !achievementUnlocked("connected")) unlockAchievement("connected");
      saveState();
      render();
      return true;
    };
  }

  // renderAchievementIcon / achievementTrophy / achvStar live in
  // js/achievement-icons.js (editable trophy icons), loaded before app.js;
  // renderAchievementIcon(id) is called below exactly as before.

  // The achievements page: two columns (progress / special), each showing an
  // "X מתוך Y" count and the earned achievements. In "see everything" mode the
  // not-yet-earned ones are also listed, greyed out.
  function renderAchievements() {
    const seeAll = !isStepByStepPace();
    const card = (a, locked) => `
      <div class="achv-item${locked ? " achv-locked" : ""}">
        <div class="achv-icon">${renderAchievementIcon(a.id)}</div>
        <div class="achv-text">
          <div class="achv-title">${esc(adaptGender(a.title))}</div>
          ${a.description ? `<div class="achv-desc">${esc(adaptGender(a.description))}</div>` : ""}
        </div>
      </div>`;
    const column = (cat, title) => {
      const list = ACHIEVEMENTS.filter((a) => a.category === cat);
      const earned = list.filter((a) => achievementUnlocked(a.id));
      const locked = seeAll ? list.filter((a) => !achievementUnlocked(a.id)) : [];
      const body = earned.map((a) => card(a, false)).join("") + locked.map((a) => card(a, true)).join("");
      return `
        <section class="achv-column">
          <h2 class="achv-col-title">${esc(title)}</h2>
          <div class="achv-count">${earned.length} מתוך ${list.length}</div>
          <div class="achv-list">${body}</div>
        </section>`;
    };
    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen achievements-screen">
        <section class="menu-card achievements-card">
          <h1>השיגים</h1>
          <div class="achievements-columns">
            ${column("progress", "השיגי התקדמות")}
            ${column("special", "השיגים מיוחדים")}
          </div>
          <div class="about-actions" style="margin-top:1.15rem;padding-top:1rem;border-top:1px dashed rgba(70,50,25,.35);">
            ${pageBackButton()}
          </div>
        </section>
      </main>`;
  }

  function renderNotReady() {
    app.innerHTML = `
      ${topbar()}
      <main class="screen about-screen">
        <section class="about-card">
          <h1>בקרוב</h1>
          <p>דף זה עדיין לא מוכן.</p>
          <div class="about-actions">
            ${pageBackButton()}
          </div>
        </section>
      </main>`;
  }

  // A small generic-chip preview of a saved card, for the "My cards" list.
  function savedCardPreviewSvg(card) {
    return `
      <svg class="my-card-preview-icon" viewBox="-90 -85 180 170" aria-hidden="true" focusable="false">
        <g transform="scale(0.72)">${savedCardMarkup(card.type, { toolbar: true })}</g>
      </svg>`;
  }

  function renderMyCards() {
    const cards = state.savedCards || [];
    const list = cards.length === 0
      ? `<p class="my-cards-empty">עדיין לא יצרת כרטיסים. אפשר ליצור כרטיס חדש או לטעון כרטיס מהמחשב.</p>`
      : `<ul class="my-cards-list">
          ${cards.map((card) => `
            <li class="my-cards-item">
              <span class="my-card-preview">${savedCardPreviewSvg(card)}</span>
              <span class="my-card-info">
                <span class="my-card-name">${esc(card.name)}</span>
                <span class="my-card-io">${(card.inputs || []).length} כניסות · ${(card.outputs || []).length} יציאות</span>
              </span>
              <span class="my-card-actions">
                <button class="btn labeled-btn" data-action="my-card-edit" data-card-type="${esc(card.type)}" type="button">${navIcon("pencil")}<span class="btn-label">עריכה</span></button>
                <button class="btn labeled-btn" data-action="my-card-save-file" data-card-type="${esc(card.type)}" type="button">${navIcon("download")}<span class="btn-label">שמירה למחשב</span></button>
                <button class="btn labeled-btn my-card-delete-btn" data-action="my-card-delete" data-card-type="${esc(card.type)}" type="button">${navIcon("trash")}<span class="btn-label">מחיקה</span></button>
              </span>
            </li>`).join("")}
        </ul>`;
    app.innerHTML = `
      ${topbar()}
      <main class="screen my-cards-screen">
        <section class="my-cards-card">
          <h1>הכרטיסים שלי</h1>
          <div class="my-cards-toolbar">
            <button class="btn btn-primary labeled-btn" data-action="my-cards-new" type="button">${navIcon("plus")}<span class="btn-label">כרטיס חדש</span></button>
            <button class="btn labeled-btn" data-action="my-cards-load" type="button">${navIcon("upload")}<span class="btn-label">טעינה מהמחשב</span></button>
          </div>
          ${list}
          <div class="my-cards-back">${pageBackButton()}</div>
        </section>
      </main>
      <input type="file" data-card-file-input accept="application/json,.json" hidden />
      ${renderInfoDialog()}
      ${renderCardDeleteDialog()}`;
  }

  function renderCardDeleteDialog() {
    if (!state.cardDeleteConfirm) return "";
    const card = savedCardByType(state.cardDeleteConfirm);
    if (!card) return "";
    // Warn if other saved cards depend on this one (their logic would break).
    const dependents = (state.savedCards || [])
      .filter((c) => c.type !== card.type && cardUsesCard(c.type, card.type))
      .map((c) => c.name);
    const warn = dependents.length
      ? `<p class="my-card-delete-warn">שים לב: הכרטיסים ${dependents.map((n) => `"${esc(n)}"`).join(", ")} משתמשים בכרטיס הזה ויפסיקו לעבוד.</p>`
      : "";
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card" role="dialog" aria-modal="false" aria-label="אישור מחיקה">
          <p>למחוק את הכרטיס "${esc(card.name)}"?</p>
          ${warn}
          <div class="pace-dialog-actions">
            <button class="btn btn-primary" data-action="card-delete-confirm" type="button">מחק</button>
            <button class="btn" data-action="card-delete-cancel" type="button">ביטול</button>
          </div>
        </section>
      </div>`;
  }

  function renderSettings() {
    const settings = normalizedSettings(state.settings);
    app.innerHTML = `
      ${topbar()}
      <main class="screen settings-screen">
        <section class="settings-card">
          <h1>הגדרות</h1>
          <div class="settings-fields">
            <label class="settings-field">
              <span class="settings-label">שפה</span>
              <select class="settings-input" data-setting="language">
                <option value="he"${settings.language === "he" ? " selected" : ""}>עברית</option>
              </select>
            </label>
            <label class="settings-field">
              <span class="settings-label">מין</span>
              <select class="settings-input" data-setting="gender">
                <option value=""${settings.gender === "" ? " selected" : ""}></option>
                <option value="בן"${settings.gender === "בן" ? " selected" : ""}>בן</option>
                <option value="בת"${settings.gender === "בת" ? " selected" : ""}>בת</option>
              </select>
            </label>
            <label class="settings-field">
              <span class="settings-label">גיל</span>
              <input class="settings-input" type="number" min="1" step="1" inputmode="numeric"
                     data-setting="age" value="${esc(settings.age)}" />
            </label>
            <label class="settings-field">
              <span class="settings-label">איך אני עושה את הלומדה?</span>
              <select class="settings-input" data-setting="pace">
                <option value="step"${settings.pace === "step" ? " selected" : ""}>שלב אחר שלב</option>
                <option value="all"${settings.pace === "all" ? " selected" : ""}>רוצה לראות את הכול</option>
              </select>
            </label>
          </div>
          <div class="settings-actions">
            ${pageBackButton()}
          </div>
          <p class="settings-note">* ההתאמות להגדרות השונות הן שטחיות בלבד.</p>
        </section>
        ${renderPaceDialog()}
      </main>`;
  }

  // A simple single-OK info message modal (e.g. the worktable note prompt). When
  // the value is an object with `discardCard`, a second "discard the card" button
  // is offered (the card-build exit error, where the card is invalid) that leaves
  // without saving.
  function renderInfoDialog() {
    if (!state.infoDialog) return "";
    const isObj = typeof state.infoDialog === "object";
    const message = isObj ? state.infoDialog.message : state.infoDialog;
    const discard = isObj && state.infoDialog.discardCard
      ? `<button class="btn" data-action="card-discard-exit" type="button">השלך את הכרטיס</button>`
      : "";
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card" role="dialog" aria-modal="false" aria-label="הודעה">
          <p>${esc(message)}</p>
          <div class="pace-dialog-actions">
            <button class="btn btn-primary" data-action="info-dialog-ok">הבנתי</button>
            ${discard}
          </div>
        </section>
      </div>`;
  }

  // The one-time speech bubble that points at the freshly-revealed "create card"
  // tool in the palette (after the MUX16 walkthrough). Dismissed with "הבנתי".
  function renderCreateCardBubble() {
    if (!state.cardIntroPending || !state.createCardUnlocked || state.cardCreation) return "";
    const text = "הי, אתה יכול ללחוץ עליי כדי ליצור כרטיס חדש, שתוכל להשתמש בו בכרטיסים האחרים שאתה בונה.";
    // A comic speech bubble (like the Nand monologue). While it is up, a click
    // anywhere in the workbench opens the card-building page (see the click
    // dispatcher) — the bubble itself is just the visual cue.
    return `
      <div class="create-card-bubble" role="button" tabindex="0" data-action="create-card-tool" aria-label="יצירת כרטיס חדש">
        <p>${esc(adaptGender(text))}</p>
      </div>`;
  }

  // The bus / splitter monologue: a single speech bubble in which the component
  // introduces itself, with its schematic symbol shown inline between the two
  // sentences ("...אני נראה כך:" [symbol] "..."). Opened from the two new 2.4
  // crate hotspots. Appearance/text only — no workbench behaviour yet.
  function componentMonologueData(kind) {
    return kind === "splitter" ? SPLITTER_MONOLOGUE : BUS_MONOLOGUE;
  }

  function componentMonologueSymbol(kind) {
    return kind === "splitter" ? "assets/components/splitter.svg" : "assets/components/bus.svg";
  }

  function renderComponentMonologue() {
    if (!state.componentMonologue) return "";
    const kind = state.componentMonologue.kind === "splitter" ? "splitter" : "bus";
    const data = componentMonologueData(kind);
    const label = kind === "splitter" ? "מפצל" : "בס";
    return `
      <div class="bit-overlay" role="presentation">
        <section class="bit-card component-monologue-card" role="dialog" aria-modal="false" aria-label="${esc(label)}">
          <div class="component-monologue-body">
            <p>${esc(adaptGender(data.intro))}</p>
            <img class="component-monologue-symbol" src="${esc(componentMonologueSymbol(kind))}" alt="${esc(label)}" />
            <p>${esc(adaptGender(data.outro))}</p>
          </div>
          <div class="bit-actions">
            <button class="btn btn-primary" data-action="component-monologue-ok" type="button">הבנתי</button>
          </div>
        </section>
      </div>`;
  }

  // The binary↔decimal converter self-introduction (items on the 2.5 worktable).
  // Shows the device's line + its schematic (how it looks on the workbench).
  function renderConverterInfoDialog() {
    if (!state.converterInfo) return "";
    const dir = state.converterInfo.dir === "out" ? "out" : "in";
    const text = dir === "in"
      ? "אני ממיר מבינרי לעשרוני. חבר אותי לבס, אני אציג לך את הכתוב העשרוני של המספר שמקודד בבס. בשולחן העבודה אני נראה כך:"
      : "אני ממיר מעשרוני לבינרי. התאם את הספרות שעליי למספר שאתה רוצה, ואני אוציא בס עם הביטים שמתאימים למספר. בשולחן העבודה אני נראה כך:";
    return `
      <div class="bit-overlay" role="presentation">
        <section class="bit-card component-monologue-card" role="dialog" aria-modal="false" aria-label="ממיר">
          <div class="component-monologue-body">
            <p>${esc(adaptGender(text))}</p>
            <svg class="converter-schematic" viewBox="-178 -56 356 112" width="356" height="112" xmlns="http://www.w3.org/2000/svg">${converterMarkup(dir)}</svg>
          </div>
          <div class="bit-actions">
            <button class="btn btn-primary" data-action="converter-info-ok" type="button">הבנתי</button>
          </div>
        </section>
      </div>`;
  }

  function renderPaceDialog() {
    if (!state.paceDialog) return "";
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card" role="dialog" aria-modal="false" aria-label="מצב הלומדה">
          <p>מומלץ לעשות את הלומדה במצב "שלב אחר שלב". אולם אם אתה כבר יודע את החומר, או שאתה מנחה מישהו בלומדה, או שעדיין לא גיבשת דעה האם הלומדה מתאימה לך, אתה מוזמן לעבור מצב.</p>
          <div class="pace-dialog-actions">
            <button class="btn btn-primary" data-action="pace-dialog-ok">הבנתי</button>
          </div>
        </section>
      </div>`;
  }

  function chapterButtonHtml(chapter) {
    const locked = !chapterReached(chapter.id);
    const cls = locked ? "chapter-btn chapter-btn-locked" : "chapter-btn";
    const attrs = locked ? ' disabled aria-disabled="true" title="הפרק יינעל עד שתגיע אליו"' : "";
    const lock = locked ? ' <span class="chapter-lock" aria-hidden="true">🔒</span>' : "";
    return `<button class="${cls}" data-action="chapter" data-chapter-id="${esc(chapter.id)}"${attrs}>${esc(chapter.title)}${lock}</button>`;
  }

  function renderChapters() {
    const parts = typeof PARTS === "undefined" ? [] : PARTS;
    const knownPartIds = new Set(parts.map((part) => part.id));
    const partSections = parts.map((part) => {
      const chapters = CHAPTERS.filter((chapter) => chapter.partId === part.id);
      if (!chapters.length) return "";

      const chapterButtons = chapters.map(chapterButtonHtml).join("");

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
        <div class="part-chapters">${ungroupedChapters.map(chapterButtonHtml).join("")}</div>
      </section>` : "";

    app.innerHTML = `
      ${topbar()}
      <main class="screen chapters-screen">
        <div class="chapters-layout">
          <div class="page-return-top">${pageBackButton()}</div>
          <section class="chapters-card parts-card">${partSections}${fallbackSection}</section>
        </div>
      </main>`;
  }

  function renderStory() {
    const scene = currentScene();
    const panel = currentPanel();
    const panelImage = displayPanelImage(panel);
    const imageSrc = `${panelImage}?r=${state.replayNonce}`;
    const year = Object.prototype.hasOwnProperty.call(panel, "year") ? panel.year : (scene.year || "");
    const imageStageClass = year ? "image-stage" : "image-stage image-stage-no-year";
    // A "navigational" hotspot (e.g. the return-to-Nand panel) IS the way
    // forward, so it disables the plain המשך button. Hotspots that merely open
    // an external reference, or the reserved Stone-Millis book, do not — the
    // learner still advances normally.
    // The Stone-Millis book is the ONLY way forward from the library slide, so it
    // disables המשך (and דלג, below) — the learner must go through the notebook.
    // Reference-link and the reserved binary-booklet hotspots stay non-blocking.
    const nonBlockingActions = ["binary-booklet"];
    const blockingHotspots = panelHotspots(panel).filter((h) => !h.url && !nonBlockingActions.includes(h.action));
    // A panel with a numeric question is the way forward: המשך (and דלג) are
    // blocked until the learner types the right answer (see checkPanelAnswer).
    const questionGate = Boolean(panel.question);
    const nextDisabled = (blockingHotspots.length || questionGate) ? "disabled" : "";
    const skipDisabled = (isSkipDisabled() || questionGate) ? "disabled" : "";

    app.innerHTML = `
      ${topbar()}
      <main class="screen story-screen">
        <section class="${imageStageClass}">
          ${year ? `<div class="year-badge">${esc(year)}</div>` : ""}
          <div class="image-frame">
            <div class="image-shell">
              <object class="panel-image" data="${esc(imageSrc)}" type="image/svg+xml" width="1448" height="1086" aria-label="קומיקס" role="img"></object>
              ${renderHotspots(panel)}
              ${panel.cornerLink ? `<button class="story-corner-link" data-action="${esc(panel.cornerLink.action)}" type="button"><svg class="corner-link-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor"/></svg><span>${esc(panel.cornerLink.text)}</span></button>` : ""}
            </div>
          </div>
        </section>
        ${panel.question ? renderPanelQuestion(panel) : ""}
        ${renderWordsBytesDialog()}
        <div class="panel-spinner" data-panel-spinner aria-hidden="true"><span class="panel-spinner-icon">⏳</span></div>
        ${(explanationReplayActive("nand-intro") || explanationReplayActive("why-route")) ? renderNandIntroExplanationControls() : `
        <section class="controls">
          ${navButton("prev", "arrow-right", "הקודם", { disabled: !globalHasPrevious() })}
          ${navButton("restart", "restart", "חזור")}
          ${navButton("next", "arrow-left", "המשך", { primary: true, disabled: Boolean(nextDisabled) })}
          ${skipLeadsNowhere() ? "" : `<button class="btn" data-action="skip" ${routingFinalPanelActive() ? "disabled" : skipDisabled}>דלג</button>`}
          ${renderBitInfoButton()}
          ${renderXorTableHelpButton()}
          ${renderRoutingCardsButton()}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>`}
      </main>
      ${renderDialog()}
      ${renderNoteTaskDialog()}
      ${renderBitDialog()}
      ${renderInfoDialog()}
      ${renderComponentMonologue()}
      ${renderConverterInfoDialog()}
      ${renderBusesNoteList()}
      ${renderArithNoteList()}`;

    setupPanelStage(panelImage, preloadStoryNeighbors);
  }

  // The numeric-answer box for a gating story panel. The value is kept live in
  // state.panelAnswer (updated on input without a re-render, so focus is not
  // lost), and graded by checkPanelAnswer.
  function renderPanelQuestion(panel) {
    const answer = state.panelAnswer && typeof state.panelAnswer === "object" ? state.panelAnswer : {};
    // The feedback sits INSIDE the input row (to its side), not below it — the
    // story controls sit right under this row, and a feedback line below used to
    // land on top of the nav buttons.
    const feedback = answer.feedback
      ? `<span class="panel-question-feedback">${esc(answer.feedback)}</span>`
      : "";
    return `
      <section class="panel-question">
        <div class="panel-question-row">
          <input class="panel-question-input" type="number" inputmode="numeric" step="1"
                 value="${esc(answer.value != null ? String(answer.value) : "")}" aria-label="התשובה שלך" />
          <button class="btn btn-primary" data-action="panel-answer-check" type="button">בדיקה</button>
          ${feedback}
        </div>
      </section>`;
  }

  function checkPanelAnswer() {
    const panel = currentPanel();
    if (!panel || !panel.question) return;
    const raw = state.panelAnswer && state.panelAnswer.value != null ? state.panelAnswer.value : "";
    const value = Number(String(raw).trim());
    if (String(raw).trim() === "" || !Number.isFinite(value) || value !== Number(panel.question.answer)) {
      return setState({ panelAnswer: { value: raw, feedback: panel.question.wrong || "אני לא חושב" } });
    }
    // Correct: nextPanel() clears panelAnswer as it advances.
    nextPanel();
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
      // A card frame passes each internal input straight to the workspace and
      // takes each internal output back from it, so its input and output sides
      // must be SEPARATE graph nodes — otherwise a path "some output -> card
      // output pin -> card input pin -> some gate" is invented, and the cycle
      // check wrongly rejects an unrelated wire. The card-creation frame
      // ("cardFrame") needs this exactly like a task card / notCard does.
      const isCard = comp && (comp.type === "notCard" || comp.type === "cardFrame" || String(comp.type || "").startsWith("taskCard-"));
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
    const evaluation = workspaceEvaluation();
    const lamps = [...evaluation.lamps.values()];
    if (lamps.length === 0) return "אין מנורות על השולחן.";
    if (lamps.length === 1) return `מנורה: ${lamps[0] ? "דלוקה" : "כבויה"}`;
    const onCount = lamps.filter(Boolean).length;
    return `מנורות דולקות: ${onCount} מתוך ${lamps.length}`;
  }

  function solutionHighlightConfig() {
    if (!state.solutionDialog) return { terminals: new Set(), wires: new Set(), components: new Set(), truthRows: new Set(), truthCols: new Set() };
    const taskId = state.solutionDialog.taskId || "Not";
    const steps = TASK_SOLUTION_STEPS[taskId] || [];
    if (!steps.length) return { terminals: new Set(), wires: new Set(), components: new Set(), truthRows: new Set(), truthCols: new Set() };
    const stepIndex = Math.min(Math.max(Number(state.solutionDialog.step) || 0, 0), steps.length - 1);
    const highlight = steps[stepIndex]?.highlight || {};
    return {
      terminals: new Set(highlight.terminals || []),
      wires: new Set(highlight.wires || []),
      components: new Set(highlight.components || []),
      truthRows: new Set(highlight.truthRows || []),
      truthCols: new Set(highlight.truthCols || [])
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
    halfAdder: [
      {
        text: "ראשית ניצור טבלת אמת על ידי חישוב כל ארבע האפשרויות: 0+0=0, 1+0=1, 0+1=1, 1+1=2=10 בבינרית. נמלא את הטבלה בהתאם.",
        highlight: { truthRows: [0, 1, 2, 3] }
      },
      {
        text: "עכשיו אנחנו רואים שה-sum הוא בעצם XOR.",
        highlight: {
          components: ["xor-1"],
          truthCols: ["sum"],
          terminals: ["task-card-1.outputInt1"],
          wires: [
            wireKey("task-card-1.inputInt1", "xor-1.in1"),
            wireKey("task-card-1.inputInt2", "xor-1.in2"),
            wireKey("xor-1.out", "task-card-1.outputInt1")
          ]
        }
      },
      {
        text: "וה-carry הוא בעצם And.",
        highlight: {
          components: ["and-1"],
          truthCols: ["carry"],
          terminals: ["task-card-1.outputInt2"],
          wires: [
            wireKey("task-card-1.inputInt1", "and-1.in1"),
            wireKey("task-card-1.inputInt2", "and-1.in2"),
            wireKey("and-1.out", "task-card-1.outputInt2")
          ]
        }
      }
    ],
    fullAdder: [
      {
        text: "ראשית אנחנו מחברים 2 מהכניסות בעזרת halfAdder. התוצאה היא מספר דו-ספרתי. אנחנו מחברים את ספרת האחדות שלו עם הכניסה השלישית בעזרת halfAdder נוסף.",
        highlight: {
          components: ["ha-1", "ha-2"],
          wires: [
            wireKey("task-card-1.inputInt1", "ha-1.in1"),
            wireKey("task-card-1.inputInt2", "ha-1.in2"),
            wireKey("ha-1.out1", "ha-2.in1"),
            wireKey("task-card-1.inputInt3", "ha-2.in2")
          ]
        }
      },
      {
        text: "ספרת האחדות של התוצאה היא ספרת האחדות שיוצאת מה-halfAdder השני, ואותה אנחנו מוציאים מיציאת ה-sum של הכרטיס.",
        highlight: {
          components: ["ha-2"],
          truthCols: ["sum"],
          terminals: ["task-card-1.outputInt1"],
          wires: [wireKey("ha-2.out1", "task-card-1.outputInt1")]
        }
      },
      {
        text: "כדי לקבל את ספרת ה-2 צריך לסכם את שתי ספרות ה-2 שקיבלנו — ה-carry של ה-halfAdder הראשון וה-carry של ה-halfAdder השני — בעזרת halfAdder שלישי.",
        highlight: {
          components: ["ha-1", "ha-2", "ha-3"],
          terminals: ["ha-1.out2", "ha-2.out2"],
          wires: [
            wireKey("ha-1.out2", "ha-3.in1"),
            wireKey("ha-2.out2", "ha-3.in2")
          ]
        }
      },
      {
        text: "נשים לב שבאופן עקרוני הסכום הזה יכול היה להיות דו-ספרתי. ספרת ה-2 שלו היא למעשה ספרת ה-4 של הסכום שאנחנו מחשבים, ולכן היא חייבת להיות 0 (הסכום הכי גדול הוא 1+1+1=3=11 בבינרית, שהוא דו-ספרתי). לכן אנחנו מתעלמים מהספרה הזאת, וה-sum של ה-halfAdder השלישי הוא ספרת ה-2 של התוצאה.",
        highlight: {
          components: ["ha-3"],
          truthCols: ["carry"],
          terminals: ["ha-3.out2", "task-card-1.outputInt2"],
          wires: [wireKey("ha-3.out1", "task-card-1.outputInt2")]
        }
      }
    ],
    Add4: [
      {
        text: "כמו בחיבור ארוך בעמודות — קודם מפצלים כל אחד משני המספרים ל-4 הספרות שלו בעזרת מפצל, כדי לעבוד על כל עמודה (ספרה) בנפרד. עובדים מלמטה למעלה: ספרת האחדות למטה, הספרה המשמעותית ביותר למעלה.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מתחילים מעמודת האחדות (למטה). מחברים את שתי ספרות האחדות יחד עם ספרת הנשיאה שנכנסת לכרטיס, בעזרת fullAdder — בדיוק שלוש הספרות שהוא יודע לחבר.",
        highlight: {
          components: ["fa0"],
          terminals: ["task-card-1.inputInt3", "split-a.leg0", "split-b.leg0"],
          wires: [
            wireKey("split-a.leg0", "fa0.in1"),
            wireKey("split-b.leg0", "fa0.in2"),
            wireKey("task-card-1.inputInt3", "fa0.in3")
          ]
        }
      },
      {
        text: "התוצאה של החיבור הזה היא ספרה אחת ועוד נשיאה. הספרה שיצאה היא ספרת האחדות של התוצאה הסופית — אותה מחזירים לספרת האחדות (התחתונה) של בס הסכום. את הנשיאה מעבירים הלאה לעמודה הבאה, זו שמעל.",
        highlight: {
          components: ["fa0", "merge"],
          terminals: ["fa0.out1", "fa0.out2"],
          wires: [
            wireKey("fa0.out1", "merge.leg0"),
            wireKey("fa0.out2", "fa1.in3")
          ]
        }
      },
      {
        text: "עכשיו העמודה השנייה, זו שמעל האחדות: מחברים את שתי הספרות השנייות של המספרים יחד עם הנשיאה שקיבלנו מעמודת האחדות, שוב בעזרת fullAdder. הספרה שיוצאת ממנו היא הספרה השנייה של התוצאה (מחזירים אותה לבס הסכום), והנשיאה שלו ממשיכה לעמודה שמעליה.",
        highlight: {
          components: ["fa1", "merge"],
          terminals: ["split-a.leg1", "split-b.leg1", "fa1.out1", "fa1.out2"],
          wires: [
            wireKey("split-a.leg1", "fa1.in1"), wireKey("split-b.leg1", "fa1.in2"),
            wireKey("fa1.out1", "merge.leg1"), wireKey("fa1.out2", "fa2.in3")
          ]
        }
      },
      {
        text: "ממשיכים באותו אופן, עמודה-עמודה כלפי מעלה, עד הספרה השמאלית ביותר — כל fullAdder מקבל את שתי הספרות שלו ואת הנשיאה מהעמודה שמתחתיו, ומעביר את הנשיאה שלו כלפי מעלה. כך שרשרת של ארבעה fullAdder-ים מכסה את כל ארבע הספרות.",
        highlight: {
          components: ["fa2", "fa3"],
          wires: [
            wireKey("split-a.leg2", "fa2.in1"), wireKey("split-b.leg2", "fa2.in2"), wireKey("fa2.out1", "merge.leg2"),
            wireKey("split-a.leg3", "fa3.in1"), wireKey("split-b.leg3", "fa3.in2"), wireKey("fa2.out2", "fa3.in3"), wireKey("fa3.out1", "merge.leg3")
          ]
        }
      },
      {
        text: "מאחדים בחזרה את ארבע הספרות שיצאו מהמחברים לבס אחד — אלה ארבע הספרות הימניות של התוצאה. הנשיאה האחרונה, זו שיוצאת מהמחבר של הספרה השמאלית ביותר (העליון), היא הספרה החמישית והשמאלית ביותר של התוצאה — ואותה מוציאים מהיציאה הבודדת של הכרטיס.",
        highlight: {
          components: ["merge", "fa3"],
          terminals: ["merge.single", "fa3.out2", "task-card-1.outputInt1", "task-card-1.outputInt2"],
          wires: [
            wireKey("merge.single", "task-card-1.outputInt2"),
            wireKey("fa3.out2", "task-card-1.outputInt1")
          ]
        }
      }
    ],
    Add16: [
      {
        text: "בדיוק כמו בחיבור ארוך — רק שהפעם כל \"ספרה\" היא בעצם קבוצה של 4 ביטים. מפצלים כל אחד משני המספרים לארבע קבוצות של 4 ביטים בעזרת מפצל. קבוצת האחדות (4 הביטים התחתונים) למטה, הקבוצה המשמעותית ביותר למעלה.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מתחילים מקבוצת האחדות (למטה): מחברים את שתי קבוצות ה-4 התחתונות בעזרת Add4 — הכרטיס שכבר בנינו שיודע לחבר שני מספרים בני 4 ספרות. אין כאן נשיאה נכנסת (Add16 לא מקבל נשיאה), אז את כניסת הנשיאה של ה-Add4 הזה משאירים לא מחוברת (0).",
        highlight: {
          components: ["ad0"],
          terminals: ["split-a.leg0", "split-b.leg0"],
          wires: [
            wireKey("split-a.leg0", "ad0.in1"),
            wireKey("split-b.leg0", "ad0.in2")
          ]
        }
      },
      {
        text: "יציאת הסכום (4 ביטים) של ה-Add4 הזה היא קבוצת האחדות של התוצאה — מחזירים אותה לקבוצה התחתונה של בס הסכום. יציאת הנשיאה שלו היא הנשיאה שעוברת הלאה לקבוצה הבאה (כלפי מעלה).",
        highlight: {
          components: ["ad0", "merge"],
          terminals: ["ad0.out1", "ad0.out2"],
          wires: [
            wireKey("ad0.out1", "merge.leg0"),
            wireKey("ad0.out2", "ad1.in3")
          ]
        }
      },
      {
        text: "הקבוצה הבאה: Add4 שמחבר את שתי הקבוצות הבאות יחד עם הנשיאה שקיבלנו מקבוצת האחדות (דרך כניסת הנשיאה שלו). הסכום שלו הוא הקבוצה הבאה של התוצאה, והנשיאה שלו ממשיכה כלפי מעלה.",
        highlight: {
          components: ["ad1", "merge"],
          terminals: ["split-a.leg1", "split-b.leg1", "ad1.out1", "ad1.out2"],
          wires: [
            wireKey("split-a.leg1", "ad1.in1"), wireKey("split-b.leg1", "ad1.in2"),
            wireKey("ad1.out1", "merge.leg1"), wireKey("ad1.out2", "ad2.in3")
          ]
        }
      },
      {
        text: "ממשיכים כך קבוצה-קבוצה כלפי מעלה עד הקבוצה המשמעותית ביותר. שרשרת של ארבעה Add4 מכסה את כל 16 הביטים. הנשיאה האחרונה — היוצאת מה-Add4 העליון — היא הספרה ה-17, ואותה פשוט מתעלמים ממנה (משאירים אותה לא מחוברת).",
        highlight: {
          components: ["ad2", "ad3"],
          terminals: ["ad3.out2"],
          wires: [
            wireKey("split-a.leg2", "ad2.in1"), wireKey("split-b.leg2", "ad2.in2"), wireKey("ad2.out1", "merge.leg2"),
            wireKey("split-a.leg3", "ad3.in1"), wireKey("split-b.leg3", "ad3.in2"), wireKey("ad2.out2", "ad3.in3"), wireKey("ad3.out1", "merge.leg3")
          ]
        }
      },
      {
        text: "מאחדים בחזרה את ארבע קבוצות הסכום (4 ביטים כל אחת) לבס אחד ברוחב 16 בעזרת מאחד — זו התוצאה הסופית, ואותה מוציאים מיציאת הכרטיס.",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt1"],
          wires: [wireKey("merge.single", "task-card-1.outputInt1")]
        }
      }
    ],
    Not4: [
      {
        text: "מפצלים את בס הכניסה ל-4 כבלים נפרדים בעזרת מפצל.",
        highlight: {
          components: ["split-in"],
          terminals: ["task-card-1.inputInt1", "split-in.single", "split-in.leg0", "split-in.leg1", "split-in.leg2", "split-in.leg3"],
          wires: [wireKey("task-card-1.inputInt1", "split-in.single")]
        }
      },
      {
        text: "מפעילים Not על כל אחד מ-4 הכבלים בנפרד.",
        highlight: {
          components: ["not-0", "not-1", "not-2", "not-3"],
          wires: [
            wireKey("split-in.leg0", "not-0.in1"),
            wireKey("split-in.leg1", "not-1.in1"),
            wireKey("split-in.leg2", "not-2.in1"),
            wireKey("split-in.leg3", "not-3.in1")
          ]
        }
      },
      {
        text: "מצרפים את 4 הכבלים חזרה לבס אחד בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("not-0.out", "merge.leg0"),
            wireKey("not-1.out", "merge.leg1"),
            wireKey("not-2.out", "merge.leg2"),
            wireKey("not-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      }
    ],
    Not16: [
      {
        text: "מפצלים את בס הכניסה (רוחב 16) ל-4 בסים ברוחב 4 בעזרת מפצל.",
        highlight: {
          components: ["split-in"],
          terminals: ["task-card-1.inputInt1", "split-in.single", "split-in.leg0", "split-in.leg1", "split-in.leg2", "split-in.leg3"],
          wires: [wireKey("task-card-1.inputInt1", "split-in.single")]
        }
      },
      {
        text: "מפעילים Not4 על כל אחד מ-4 הבסים.",
        highlight: {
          components: ["not4-0", "not4-1", "not4-2", "not4-3"],
          wires: [
            wireKey("split-in.leg0", "not4-0.in1"),
            wireKey("split-in.leg1", "not4-1.in1"),
            wireKey("split-in.leg2", "not4-2.in1"),
            wireKey("split-in.leg3", "not4-3.in1")
          ]
        }
      },
      {
        text: "מצרפים את 4 הבסים חזרה לבס אחד ברוחב 16 בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("not4-0.out", "merge.leg0"),
            wireKey("not4-1.out", "merge.leg1"),
            wireKey("not4-2.out", "merge.leg2"),
            wireKey("not4-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "אפשר כמובן גם לעשות את זה ישירות עם Not. זה גם דומה ל-Not4, רק צריך לפצל ל-16 חלקים במקום ל-4. זה הרבה יותר מסורבל.",
        highlight: {
          components: ["split-in", "merge", ...Array.from({ length: 16 }, (_, i) => `not-${i}`)]
        }
      }
    ],
    AND4: [
      {
        text: "מפצלים כל אחת משתי כניסות הבס ל-4 כבלים נפרדים בעזרת שני מפצלים.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מחברים כל שני כבלים מתאימים (אחד מכל כניסה) ל-And.",
        highlight: {
          components: ["and-0", "and-1", "and-2", "and-3"],
          wires: [
            wireKey("split-a.leg0", "and-0.in1"), wireKey("split-b.leg0", "and-0.in2"),
            wireKey("split-a.leg1", "and-1.in1"), wireKey("split-b.leg1", "and-1.in2"),
            wireKey("split-a.leg2", "and-2.in1"), wireKey("split-b.leg2", "and-2.in2"),
            wireKey("split-a.leg3", "and-3.in1"), wireKey("split-b.leg3", "and-3.in2")
          ]
        }
      },
      {
        text: "מצרפים את 4 התוצאות חזרה לבס אחד בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("and-0.out", "merge.leg0"), wireKey("and-1.out", "merge.leg1"),
            wireKey("and-2.out", "merge.leg2"), wireKey("and-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      }
    ],
    OR4: [
      {
        text: "מפצלים כל אחת משתי כניסות הבס ל-4 כבלים נפרדים בעזרת שני מפצלים.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מחברים כל שני כבלים מתאימים (אחד מכל כניסה) ל-Or.",
        highlight: {
          components: ["or-0", "or-1", "or-2", "or-3"],
          wires: [
            wireKey("split-a.leg0", "or-0.in1"), wireKey("split-b.leg0", "or-0.in2"),
            wireKey("split-a.leg1", "or-1.in1"), wireKey("split-b.leg1", "or-1.in2"),
            wireKey("split-a.leg2", "or-2.in1"), wireKey("split-b.leg2", "or-2.in2"),
            wireKey("split-a.leg3", "or-3.in1"), wireKey("split-b.leg3", "or-3.in2")
          ]
        }
      },
      {
        text: "מצרפים את 4 התוצאות חזרה לבס אחד בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("or-0.out", "merge.leg0"), wireKey("or-1.out", "merge.leg1"),
            wireKey("or-2.out", "merge.leg2"), wireKey("or-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "אפשר גם לממש את Or4 בדיוק כמו שמימשנו את Or הרגיל. נזכיר: Or שקול ל-Not של And על שתי הכניסות ההפוכות. קודם מבצעים Not4 לכל אחת משתי הכניסות.",
        highlight: {
          components: ["not-a", "not-b"],
          wires: [wireKey("task-card-1.inputInt1", "not-a.in1"), wireKey("task-card-1.inputInt2", "not-b.in1")]
        }
      },
      {
        text: "מכניסים את שתי התוצאות ל-And4.",
        highlight: {
          components: ["and-1"],
          wires: [wireKey("not-a.out", "and-1.in1"), wireKey("not-b.out", "and-1.in2")]
        }
      },
      {
        text: "ומבצעים Not4 על התוצאה. זה בדיוק אותו רעיון כמו במימוש המקורי של Or, רק שהפעם הכול קורה על בסים ברוחב 4.",
        highlight: {
          components: ["not-out"],
          terminals: ["task-card-1.outputInt"],
          wires: [wireKey("and-1.out", "not-out.in1"), wireKey("not-out.out", "task-card-1.outputInt")]
        }
      }
    ],
    AND16: [
      {
        text: "מפצלים כל אחת משתי כניסות הבס (רוחב 16) ל-4 בסים ברוחב 4 בעזרת שני מפצלים.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מחברים כל שני בסים מתאימים (אחד מכל כניסה) ל-And4.",
        highlight: {
          components: ["and4-0", "and4-1", "and4-2", "and4-3"],
          wires: [
            wireKey("split-a.leg0", "and4-0.in1"), wireKey("split-b.leg0", "and4-0.in2"),
            wireKey("split-a.leg1", "and4-1.in1"), wireKey("split-b.leg1", "and4-1.in2"),
            wireKey("split-a.leg2", "and4-2.in1"), wireKey("split-b.leg2", "and4-2.in2"),
            wireKey("split-a.leg3", "and4-3.in1"), wireKey("split-b.leg3", "and4-3.in2")
          ]
        }
      },
      {
        text: "מצרפים את 4 הבסים חזרה לבס אחד ברוחב 16 בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("and4-0.out", "merge.leg0"), wireKey("and4-1.out", "merge.leg1"),
            wireKey("and4-2.out", "merge.leg2"), wireKey("and4-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "אפשר כמובן גם לעשות את זה ישירות עם And. זה גם דומה ל-And4, רק צריך לפצל ל-16 חלקים במקום ל-4. זה הרבה יותר מסורבל.",
        highlight: {
          components: ["split-a", "split-b", "merge", ...Array.from({ length: 16 }, (_, i) => `and-${i}`)]
        }
      }
    ],
    MUX4: [
      {
        text: "מפצלים כל אחת משתי כניסות הבס ל-4 כבלים נפרדים בעזרת שני מפצלים. את כניסת הבקרה משאירים כמו שהיא.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מחברים כל שני כבלים מתאימים (אחד מכל כניסה) ל-Mux, ומחברים את כניסת הבקרה לכל אחד מה-Mux-ים כדי שכולם יבחרו לפי אותו ביט בקרה.",
        highlight: {
          components: ["mux-0", "mux-1", "mux-2", "mux-3"],
          wires: [
            wireKey("split-a.leg0", "mux-0.in1"), wireKey("split-b.leg0", "mux-0.in2"), wireKey("task-card-1.inputInt3", "mux-0.in3"),
            wireKey("split-a.leg1", "mux-1.in1"), wireKey("split-b.leg1", "mux-1.in2"), wireKey("task-card-1.inputInt3", "mux-1.in3"),
            wireKey("split-a.leg2", "mux-2.in1"), wireKey("split-b.leg2", "mux-2.in2"), wireKey("task-card-1.inputInt3", "mux-2.in3"),
            wireKey("split-a.leg3", "mux-3.in1"), wireKey("split-b.leg3", "mux-3.in2"), wireKey("task-card-1.inputInt3", "mux-3.in3")
          ]
        }
      },
      {
        text: "מצרפים את 4 התוצאות חזרה לבס אחד בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("mux-0.out", "merge.leg0"), wireKey("mux-1.out", "merge.leg1"),
            wireKey("mux-2.out", "merge.leg2"), wireKey("mux-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "אפשר גם לעשות את זה כמו שבונים מוקס רגיל, רק להשתמש ב-And4, Or4, Not4 במקום ב-And, Or, Not."
      },
      {
        text: "מתחילים מלשכפל את כניסת הבקרה ולארוז את כל העותקים שלה יחד.",
        highlight: {
          components: ["ctrl-merge"],
          terminals: ["task-card-1.inputInt3", "ctrl-merge.single"],
          wires: [
            wireKey("task-card-1.inputInt3", "ctrl-merge.leg0"), wireKey("task-card-1.inputInt3", "ctrl-merge.leg1"),
            wireKey("task-card-1.inputInt3", "ctrl-merge.leg2"), wireKey("task-card-1.inputInt3", "ctrl-merge.leg3")
          ]
        }
      },
      {
        text: "זה יאפשר לנו להשתמש בה בכרטיסים And4, Or4, Not4 כך שהיא תשפיע על כל ביט בנפרד.",
        highlight: {
          components: ["ctrl-merge"],
          terminals: ["task-card-1.inputInt3", "ctrl-merge.single"],
          wires: [
            wireKey("task-card-1.inputInt3", "ctrl-merge.leg0"), wireKey("task-card-1.inputInt3", "ctrl-merge.leg1"),
            wireKey("task-card-1.inputInt3", "ctrl-merge.leg2"), wireKey("task-card-1.inputInt3", "ctrl-merge.leg3")
          ]
        }
      },
      {
        text: "מבצעים Not4 על בס הבקרה כדי לקבל את ההפך שלו.",
        highlight: {
          components: ["not4-c"],
          wires: [wireKey("ctrl-merge.single", "not4-c.in1")]
        }
      },
      {
        text: "עושים And4 בין הכניסה הראשונה לבס הבקרה ההפוך. כך הכניסה הראשונה עוברת רק כשהבקרה היא 0.",
        highlight: {
          components: ["and-1"],
          wires: [wireKey("not4-c.out", "and-1.in1"), wireKey("task-card-1.inputInt1", "and-1.in2")]
        }
      },
      {
        text: "ו-And4 בין הכניסה השנייה לבס הבקרה עצמו. כך הכניסה השנייה עוברת רק כשהבקרה היא 1.",
        highlight: {
          components: ["and-2"],
          wires: [wireKey("ctrl-merge.single", "and-2.in1"), wireKey("task-card-1.inputInt2", "and-2.in2")]
        }
      },
      {
        text: "מאחדים את שתי התוצאות ב-Or4 ומוציאים אותן מהכרטיס.",
        highlight: {
          components: ["or-1"],
          terminals: ["task-card-1.outputInt"],
          wires: [wireKey("and-1.out", "or-1.in1"), wireKey("and-2.out", "or-1.in2"), wireKey("or-1.out", "task-card-1.outputInt")]
        }
      }
    ],
    MUX16: [
      {
        text: "מפצלים כל אחת משתי כניסות הבס (רוחב 16) ל-4 בסים ברוחב 4 בעזרת שני מפצלים. את כניסת הבקרה משאירים כמו שהיא.",
        highlight: {
          components: ["split-a", "split-b"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "split-a.single", "split-b.single"],
          wires: [
            wireKey("task-card-1.inputInt1", "split-a.single"),
            wireKey("task-card-1.inputInt2", "split-b.single")
          ]
        }
      },
      {
        text: "מחברים כל שני בסים מתאימים (אחד מכל כניסה) ל-Mux4, ומחברים את כניסת הבקרה לכל אחד מה-Mux4-ים כדי שכולם יבחרו לפי אותו ביט בקרה.",
        highlight: {
          components: ["mux4-0", "mux4-1", "mux4-2", "mux4-3"],
          wires: [
            wireKey("split-a.leg0", "mux4-0.in1"), wireKey("split-b.leg0", "mux4-0.in2"), wireKey("task-card-1.inputInt3", "mux4-0.in3"),
            wireKey("split-a.leg1", "mux4-1.in1"), wireKey("split-b.leg1", "mux4-1.in2"), wireKey("task-card-1.inputInt3", "mux4-1.in3"),
            wireKey("split-a.leg2", "mux4-2.in1"), wireKey("split-b.leg2", "mux4-2.in2"), wireKey("task-card-1.inputInt3", "mux4-2.in3"),
            wireKey("split-a.leg3", "mux4-3.in1"), wireKey("split-b.leg3", "mux4-3.in2"), wireKey("task-card-1.inputInt3", "mux4-3.in3")
          ]
        }
      },
      {
        text: "מצרפים את 4 הבסים חזרה לבס אחד ברוחב 16 בעזרת מפצל נוסף, ומוציאים אותו מהכרטיס.",
        buttonLabel: "פתרון נוסף",
        highlight: {
          components: ["merge"],
          terminals: ["merge.single", "task-card-1.outputInt"],
          wires: [
            wireKey("mux4-0.out", "merge.leg0"), wireKey("mux4-1.out", "merge.leg1"),
            wireKey("mux4-2.out", "merge.leg2"), wireKey("mux4-3.out", "merge.leg3"),
            wireKey("merge.single", "task-card-1.outputInt")
          ]
        }
      },
      {
        text: "גם כאן אפשר לחזור על המימוש המקורי של Mux, אבל הפעם עם And16, Not16, OR16 במקום ב-And, Not, Or. בשביל זה יהיה צורך לבנות את OR16, שהוא לא אחת מהמשימות.",
        revealCreateCard: true,
        highlight: {
          components: ["or16-1"]
        }
      }
    ],
    And: [
      {
        text: "אנחנו מחברים את שתי הכניסות ל־Nand.",
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
        text: "היציאה שלו היא 0 (בלי מתח) רק אם 2 הכניסות הן 1 (עם מתח). זה בדיוק המקרה היחיד שבו הכרטיס And צריך להוציא 1.",
        highlight: {
          terminals: ["nand-1.out"]
        }
      },
      {
        text: "לכן אנחנו מחברים את היציאה של ה־Nand ל־Not.",
        highlight: {
          terminals: ["nand-1.out", "not-1.in1"],
          wires: [wireKey("nand-1.out", "not-1.in1")],
          components: ["not-1"]
        }
      },
      {
        text: "היציאה שלו היא בדיוק מה שאנחנו צריכים. לכן אנחנו מוציאים אותה החוצה מכל הכרטיס And.",
        highlight: {
          terminals: ["not-1.out", "task-card-1.outputInt"],
          wires: [wireKey("not-1.out", "task-card-1.outputInt")],
          components: ["not-1"]
        }
      }
    ],
    Or: [
      {
        text: "אנחנו צריכים לבדוק האם שתי הכניסות הן 0 ורק במקרה הזה להוציא 0. And עושה בדיוק את ההפך: הוא בודק אם שתי הכניסות הן 1 ורק במקרה הזה מוציא 1.",
        highlight: {
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2"]
        }
      },
      {
        text: "לכן אנחנו הופכים את שתי הכניסות על ידי Not-ים.",
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
        text: "ואז אנחנו מכניסים אותם ל־And.",
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
        text: "כרגע אנחנו מכבלים 1 בדיוק במקרה שבו אנחנו צריכים לקבל 0.",
        highlight: {
          terminals: ["and-1.out"],
          components: ["and-1"]
        }
      },
      {
        text: "לכן אנחנו מבצעים Not נוסף.",
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
        text: "שים לב, שהשילוב בין ה־And ל־Not הוא בעצם Nand.",
        highlight: {
          components: ["and-1", "not-3"],
          terminals: ["and-1.out", "not-3.in1", "not-3.out"]
        }
      },
      {
        text: "כך שאפשר להחליף אותם ב־Nand ולחסוך.",
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
        text: "עוד דרך לחשוב על הפתרון הזה היא שגם Nand וגם Or מוציאים 0 רק במקרה אחד. ההבדל ביניהם הוא שאצל Or המקרה הזה הוא כששתי הכניסות הן 0, ואצל Nand המקרה הזה הוא כששתי הכניסות הן 1. ה־Not-ים בהתחלה מחליפים בין המקרים.",
        highlight: {
          components: ["not-1", "not-2"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "not-1.in1", "not-2.in1", "not-1.out", "not-2.out"]
        }
      },
      {
        text: "כך אנו יכולים לעשות Or באמצעות Nand.",
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
        text: "כדי לבדוק ששלוש הכניסות הן 1, נתחיל משתי הכניסות הראשונות. נחבר אותן ל־And.",
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
        text: "היציאה של ה־And הראשון היא 1 רק אם שתי הכניסות הראשונות הן 1.",
        highlight: {
          terminals: ["and-1.out"],
          components: ["and-1"]
        }
      },
      {
        text: "עכשיו נשאר לבדוק שגם הכניסה השלישית היא 1. לכן נחבר את היציאה של ה־And הראשון ואת הכניסה השלישית ל־And נוסף.",
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
        text: "היציאה של ה־And השני היא 1 רק אם שתי הכניסות שלו הן 1, כלומר רק אם שלוש הכניסות המקוריות הן 1. לכן נוציא אותה החוצה מהכרטיס.",
        highlight: {
          terminals: ["and-2.out", "task-card-1.outputInt"],
          wires: [wireKey("and-2.out", "task-card-1.outputInt")],
          components: ["and-2"]
        }
      }
    ],
    OR4way: [
      {
        text: "בפתרון הראשון נתחיל משתי הכניסות הראשונות. נחבר את הכניסות 1 ו־2 ל־Or.",
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
        text: "היציאה של ה־Or הראשון היא 1 אם הכניסה הראשונה היא 1 או שהכניסה השנייה היא 1.",
        highlight: {
          terminals: ["or-ab.out"],
          components: ["or-ab"]
        }
      },
      {
        text: "עכשיו נוסיף את הכניסה השלישית. נחבר את התוצאה שקיבלנו ואת הכניסה השלישית ל־Or נוסף. הוא מוציא 1 אם לפחות אחת משלוש הכניסות הראשונות היא 1.",
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
        text: "לבסוף נוסיף את הכניסה הרביעית באותה דרך. נחבר את התוצאה הקודמת ואת הכניסה הרביעית ל־Or אחרון, ואת היציאה שלו נוציא החוצה.",
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
        text: "ה־Or העליון בודק את שתי הכניסות הראשונות.",
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
        text: "ה־Or התחתון בודק את שתי הכניסות האחרונות.",
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
        text: "עכשיו נחבר את שתי התוצאות ל־Or אחרון. אם אחד מהזוגות הכיל 1, היציאה הסופית תהיה 1.",
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
        text: "הכרטיס Xor צריך להוציא 1 רק אם החלק הראשון מוציא 1 והשני 0.",
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
        text: "שוב, השילוב בין ה־And ל־Not הוא בעצם Nand.",
        highlight: {
          components: ["and-raw", "not-1"],
          terminals: ["and-raw.out", "not-1.in1", "not-1.out"]
        }
      },
      {
        text: "כך שאפשר להחליף אותם ב־Nand ולחסוך.",
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
    DMux: [
      {
        text: "אפשר לטפל בכל יציאה בנפרד, כאילו מדובר בשני כרטיסים. יציאה 1 צריכה לקבל את הכניסה כאשר הבקרה 0, ויציאה 2 כאשר הבקרה 1.",
        highlight: {}
      },
      {
        text: "יציאה 1 היא הכניסה כאשר הבקרה 0 — כלומר הכניסה וגם (לא בקרה). הופכים את הבקרה עם Not ומבצעים And עם הכניסה.",
        highlight: {
          components: ["not-c", "and-1"],
          terminals: ["task-card-1.inputInt1", "not-c.out", "and-1.out"],
          wires: [
            wireKey("task-card-1.inputInt2", "not-c.in1"),
            wireKey("not-c.out", "and-1.in1"),
            wireKey("task-card-1.inputInt1", "and-1.in2"),
            wireKey("and-1.out", "task-card-1.outputInt1")
          ]
        }
      },
      {
        text: "יציאה 2 היא הכניסה כאשר הבקרה 1 — כלומר הכניסה וגם הבקרה. פשוט And בין הכניסה לבקרה.",
        highlight: {
          components: ["and-2"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "and-2.out"],
          wires: [
            wireKey("task-card-1.inputInt2", "and-2.in1"),
            wireKey("task-card-1.inputInt1", "and-2.in2"),
            wireKey("and-2.out", "task-card-1.outputInt2")
          ]
        }
      }
    ],
    Mux: [
      {
        text: "לפי טבלת האמת יש 4 שורות שבהן הכרטיס צריך להוציא 1 (מסומנות). הרעיון הכללי — השיטה שג'ון לימד: לכל שורה כזאת בונים חלק שמוציא 1 בדיוק במקרה שלה, ובסוף מאחדים את כולם עם Or.",
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
        text: "בסוף מחברים את כל ארבעת החלקים ל־Or: אם אחד מהם מוציא 1, גם הכרטיס מוציא 1. זה פתרון שעובד תמיד, אבל אפשר לעשות אותו בצורה חסכונית יותר.",
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
            wireKey("not-c.out", "and-1.in1"),
            wireKey("task-card-1.inputInt1", "and-1.in2")
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
            wireKey("task-card-1.inputInt3", "and-2.in1"),
            wireKey("task-card-1.inputInt2", "and-2.in2")
          ]
        }
      },
      {
        text: "כרגיל בסוף עושים Or לשתיהן.",
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
    ],
    Dmux4way: [
      {
        text: "קודם מפצלים את בס הבקרה לשני הביטים שלו בעזרת מפצל.",
        highlight: {
          components: ["ctrl-split"],
          terminals: ["task-card-1.inputInt2", "ctrl-split.single", "ctrl-split.leg0", "ctrl-split.leg1"],
          wires: [wireKey("task-card-1.inputInt2", "ctrl-split.single")]
        }
      },
      {
        text: "מחברים DMux ראשון: הכניסה הרגילה נכנסת אליו, וכניסת הבקרה שלו היא הביט הראשון (זה שבוחר בין הזוגות). כך הכניסה נשלחת לזוג היציאות הנכון.",
        highlight: {
          components: ["dmux-a"],
          terminals: ["task-card-1.inputInt1", "ctrl-split.leg1", "dmux-a.in1", "dmux-a.in2", "dmux-a.out1", "dmux-a.out2"],
          wires: [
            wireKey("task-card-1.inputInt1", "dmux-a.in1"),
            wireKey("ctrl-split.leg1", "dmux-a.in2")
          ]
        }
      },
      {
        text: "כל אחת משתי היציאות של ה-DMux הראשון מובילה לזוג יציאות אחר. מחברים לכל אחת מהן DMux נוסף שכניסת הבקרה שלו היא הביט השני, והוא בוחר בתוך הזוג.",
        highlight: {
          components: ["dmux-b", "dmux-c"],
          terminals: ["dmux-a.out1", "dmux-a.out2", "dmux-b.in1", "dmux-b.in2", "dmux-c.in1", "dmux-c.in2"],
          wires: [
            wireKey("dmux-a.out1", "dmux-b.in1"),
            wireKey("dmux-a.out2", "dmux-c.in1"),
            wireKey("ctrl-split.leg0", "dmux-b.in2"),
            wireKey("ctrl-split.leg0", "dmux-c.in2")
          ]
        }
      },
      {
        text: "ארבע היציאות של שני ה-DMux-ים האחרונים הן ארבע היציאות של הכרטיס.",
        highlight: {
          terminals: ["dmux-b.out1", "dmux-b.out2", "dmux-c.out1", "dmux-c.out2", "task-card-1.outputInt1", "task-card-1.outputInt2", "task-card-1.outputInt3", "task-card-1.outputInt4"],
          wires: [
            wireKey("dmux-b.out1", "task-card-1.outputInt1"),
            wireKey("dmux-b.out2", "task-card-1.outputInt2"),
            wireKey("dmux-c.out1", "task-card-1.outputInt3"),
            wireKey("dmux-c.out2", "task-card-1.outputInt4")
          ]
        }
      }
    ],
    Mux4way16: [
      {
        text: "קודם מפצלים את בס הבקרה לשני הביטים שלו בעזרת מפצל.",
        highlight: {
          components: ["ctrl-split"],
          terminals: ["task-card-1.inputInt5", "ctrl-split.single", "ctrl-split.leg0", "ctrl-split.leg1"],
          wires: [wireKey("task-card-1.inputInt5", "ctrl-split.single")]
        }
      },
      {
        text: "בעזרת Mux16 בוחרים בין שתי הכניסות הראשונות לפי הביט השני של הבקרה, וכך גם בין שתי הכניסות האחרונות בעזרת Mux16 נוסף.",
        highlight: {
          components: ["mux-lo", "mux-hi"],
          terminals: ["task-card-1.inputInt1", "task-card-1.inputInt2", "task-card-1.inputInt3", "task-card-1.inputInt4", "mux-lo.in1", "mux-lo.in2", "mux-lo.in3", "mux-hi.in1", "mux-hi.in2", "mux-hi.in3"],
          wires: [
            wireKey("task-card-1.inputInt1", "mux-lo.in1"),
            wireKey("task-card-1.inputInt2", "mux-lo.in2"),
            wireKey("ctrl-split.leg0", "mux-lo.in3"),
            wireKey("task-card-1.inputInt3", "mux-hi.in1"),
            wireKey("task-card-1.inputInt4", "mux-hi.in2"),
            wireKey("ctrl-split.leg0", "mux-hi.in3")
          ]
        }
      },
      {
        text: "עכשיו יש שתי אפשרויות ליציאה. בעזרת Mux16 נוסף בוחרים ביניהן לפי הביט הראשון של הבקרה.",
        highlight: {
          components: ["mux-fin"],
          terminals: ["mux-lo.out", "mux-hi.out", "mux-fin.in1", "mux-fin.in2", "mux-fin.in3"],
          wires: [
            wireKey("mux-lo.out", "mux-fin.in1"),
            wireKey("mux-hi.out", "mux-fin.in2"),
            wireKey("ctrl-split.leg1", "mux-fin.in3")
          ]
        }
      },
      {
        text: "היציאה של ה-Mux16 האחרון היא היציאה של הכרטיס.",
        highlight: {
          terminals: ["mux-fin.out", "task-card-1.outputInt"],
          wires: [wireKey("mux-fin.out", "task-card-1.outputInt")]
        }
      }
    ]
  };

  function renderSolutionDialog() {
    if (!state.solutionDialog) return "";
    const taskId = state.solutionDialog.taskId || "Not";
    const task = taskDefById(taskId);

    if (taskId === "Not") {
      const text = "אם בכניסה של ה־Not יש מתח, הוא מגיע לשתי הכניסות של ה־Nand, ולכן ביציאה של ה־Nand אין מתח. אם אין מתח בכניסה של ה־Not, אין גם מתח בשתי הכניסות של ה־Nand, ולכן ביציאה של ה־Nand יש מתח.";
      return `
        <div class="solution-overlay" role="presentation">
          <section class="solution-card" role="dialog" aria-modal="false" aria-label="פתרון Not">
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

    // The MUX16 "original-MUX" step ends the walkthrough by revealing the new
    // "create card" tool instead of a plain אישור: המשך drops the learner back
    // into the workspace with the tool + its speech bubble.
    const primaryButton = step.revealCreateCard
      ? '<button class="btn btn-primary" data-action="solution-reveal-create-card" type="button">המשך</button>'
      : (isLast ? '<button class="btn btn-primary" data-action="solution-ok" type="button">אישור</button>' : `<button class="btn btn-primary" data-action="solution-next" type="button">${esc(step.buttonLabel || "המשך")}</button>`);
    return `
      <div class="solution-overlay" role="presentation">
        <section class="solution-card" role="dialog" aria-modal="false" aria-label="פתרון ${esc(task?.label || taskId)}">
          <h2>פתרון</h2>
          <p>${esc(adaptGender(step.text))}</p>
          <div class="solution-actions">
            ${toggleButton}
            ${primaryButton}
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
          <p>${esc(adaptGender(BIT_EXPLANATION_STEPS[step]))}</p>
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
    return String(adaptGender(text) || "")
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

  // ---- Slide (panel / hint) loading & preloading -------------------------
  //
  // Every slide is a tiny SVG wrapper (~3KB) that references a heavy PNG raster
  // (~2.5MB) of the same basename. Two problems used to hurt the first view,
  // especially over the network: (a) nothing was fetched ahead of time, so each
  // slide paid its full download only when reached; (b) the SVG's vector layer
  // painted before its raster arrived, so the slide flashed in half-drawn.
  //
  // preloadPanelImage warms BOTH the wrapper and its PNG into the HTTP cache, so
  // neighbours are ready before the user gets there. setupPanelStage keeps the
  // freshly-rendered slide hidden behind a spinner until the whole thing (vector
  // AND raster) is loaded, then reveals it in one fade.

  const preloadedPanelImages = new Map(); // url -> Image (kept alive so it is not GC'd)

  function cleanAssetUrl(url) {
    return String(url || "").split("?")[0].split("#")[0];
  }

  // The heavy raster behind a slide: the matching .jpg for an .svg wrapper, or
  // the file itself when it is already a raster.
  function panelHeavyUrl(image) {
    const clean = cleanAssetUrl(image);
    if (!clean) return "";
    if (!clean.endsWith(".svg")) return clean;
    // Comic panels embed a .jpg raster; the hint slides (assets/hints/…) embed a
    // .webp. Derive the right one so the preload/readiness signal points at the
    // file the SVG actually loads (a wrong guess 404s and can stall the slide).
    // A preference variant SVG (_girl/_young/_older) reuses the base raster, so
    // strip that suffix first.
    const ext = clean.includes("/hints/") ? ".webp" : ".jpg";
    return clean.replace(/(_(?:girl|young|older|baby))?\.svg$/, ext);
  }

  function preloadAssetUrl(url) {
    const clean = cleanAssetUrl(url);
    if (!clean) return null;
    if (preloadedPanelImages.has(clean)) return preloadedPanelImages.get(clean);
    const image = new Image();
    image.src = clean;
    preloadedPanelImages.set(clean, image);
    return image;
  }

  // Warm a slide fully: the small SVG wrapper and its heavy PNG raster.
  function preloadPanelImage(image) {
    const clean = cleanAssetUrl(image);
    if (!clean) return;
    if (clean.endsWith(".svg")) preloadAssetUrl(clean);
    preloadAssetUrl(panelHeavyUrl(clean));
  }

  const preloadedHintSlides = new Set();

  function preloadHintSlides(slides = []) {
    slides.forEach((src) => {
      if (!src || preloadedHintSlides.has(src)) return;
      preloadPanelImage(src);
      preloadedHintSlides.add(src);
    });
  }

  // While the user reads the current story panel, quietly fetch the panels just
  // ahead (and the one behind, for going back) so navigation feels instant.
  function preloadStoryNeighbors() {
    const scene = currentScene();
    if (!scene || !Array.isArray(scene.panels)) return;
    const i = state.panelIndex;
    [i + 1, i + 2, i + 3, i - 1].forEach((k) => {
      if (k >= 0 && k < scene.panels.length) preloadPanelImage(displayPanelImage(scene.panels[k]));
    });
  }

  // Local dev aid: append ?slideDelay=2000 to the URL to force every slide to
  // take at least N ms to reveal. Locally the files load instantly, so the
  // spinner and the "reveal only when fully loaded" behaviour are otherwise
  // invisible; this makes them observable on demand. No param => no effect, so
  // it never touches the real experience. (Combine with the browser's Network
  // throttling + "Disable cache" to reproduce a true slow first load.)
  function devSlideDelayMs() {
    try {
      const raw = new URLSearchParams(location.search).get("slideDelay");
      const n = raw == null ? 0 : parseInt(raw, 10);
      return Number.isFinite(n) && n > 0 ? Math.min(n, 20000) : 0;
    } catch (err) {
      return 0;
    }
  }

  // Hide the just-rendered slide behind a centred spinner until it is fully
  // loaded, then reveal raster and vector together. `image` is the slide source;
  // `onReady` (optional) queues neighbour preloading once the current slide is up.
  function setupPanelStage(image, onReady) {
    const obj = app.querySelector(".panel-image");
    const spinner = app.querySelector("[data-panel-spinner]");
    if (!obj) {
      if (typeof onReady === "function") onReady();
      return;
    }

    obj.classList.add("is-pending");

    const devDelay = devSlideDelayMs();
    const startedAt = Date.now();
    let revealed = false;
    let spinnerTimer = null;
    const reveal = () => {
      if (revealed) return;
      // Honour the local dev delay so the spinner stays visible long enough to see.
      const wait = devDelay - (Date.now() - startedAt);
      if (wait > 0) {
        if (spinner) spinner.classList.add("is-active");
        setTimeout(reveal, wait);
        return;
      }
      revealed = true;
      if (spinnerTimer) clearTimeout(spinnerTimer);
      obj.classList.remove("is-pending");
      if (spinner) spinner.classList.remove("is-active");
      if (typeof onReady === "function") onReady();
    };

    try {
      // Only bother showing the spinner if the slide is still not up after a
      // short grace period, so cached/fast slides never flash it.
      spinnerTimer = setTimeout(() => {
        if (!revealed && spinner) spinner.classList.add("is-active");
      }, 200);

      // Reveal only once BOTH signals land: the <object> document finished
      // loading (its embedded raster included) and the PNG has decoded.
      let objReady = false;
      let rasterReady = false;
      const maybeReveal = () => {
        if (objReady && rasterReady) requestAnimationFrame(reveal);
      };

      obj.addEventListener("load", () => { objReady = true; maybeReveal(); }, { once: true });
      // If the object was served from cache it may already be complete.
      try {
        if (obj.contentDocument && obj.contentDocument.readyState === "complete") objReady = true;
      } catch (err) { /* cross-doc access can throw before load; ignored */ }

      // Use the raster only as a readiness signal, and only if it was ALREADY
      // being preloaded (as a neighbour). Creating a fresh request here would
      // race the <object>'s own fetch of the same file (harmless but noisy). If
      // it was not preloaded, the <object> load event already waits for the
      // embedded raster, so objReady alone covers it.
      //
      // `complete` is true once the preloaded image has finished — whether it
      // loaded OR failed. A failure is expected when panelHeavyUrl guesses the
      // wrong extension (e.g. an SVG that embeds a .webp, not a .jpg): we must
      // still treat it as "done" and rely on objReady, otherwise the spinner
      // would hang waiting for a raster that will never load.
      const raster = preloadedPanelImages.get(cleanAssetUrl(panelHeavyUrl(image)));
      if (!raster || raster.complete) {
        rasterReady = true;
      } else {
        raster.addEventListener("load", () => { rasterReady = true; maybeReveal(); }, { once: true });
        raster.addEventListener("error", () => { rasterReady = true; maybeReveal(); }, { once: true });
      }

      // Never leave a slide stuck behind the spinner if a signal is missed.
      setTimeout(reveal, 8000);
      maybeReveal();
    } catch (err) {
      reveal();
    }
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
      <section class="xor-hint-truth-table workspace-task-hint" aria-label="טבלת אמת של Xor">
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

  // The inline XOR-hint "דלג" jumps to the chapter's last panel, so in step-by-
  // step mode it is disabled until that panel (or a later chapter) has been
  // reached — the same rule as the story skip.
  function inlineXorHintSkipDisabled() {
    if (!isStepByStepPace()) return false;
    const returnTo = state.hintSlides?.returnTo || {};
    const chapter = chapterById(returnTo.chapterId || "chapter-6");
    const scene = SCENES[returnTo.sceneId] || sceneByChapter(chapter);
    const maxChapter = Number.isInteger(state.maxChapterReached) ? state.maxChapterReached : 0;
    if (maxChapter > chapterIndexById(chapter.id)) return false;
    const lastPanelIndex = Math.max(scene.panels.length - 1, 0);
    const reached = (state.maxPanelReached && typeof state.maxPanelReached === "object") ? state.maxPanelReached : {};
    const max = Number.isInteger(reached[scene.id]) ? reached[scene.id] : -1;
    return max < lastPanelIndex;
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
    if (inlineXorHintSkipDisabled()) return;

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
              <object class="panel-image hint-slide-image" data="${esc(imageSrc)}" type="image/svg+xml" width="1448" height="1086" aria-label="רמז Xor ${index + 1}" role="img"></object>
              ${renderXorHintTruthTable(index)}
            </div>
          </div>
        </section>
        <div class="panel-spinner" data-panel-spinner aria-hidden="true"><span class="panel-spinner-icon">⏳</span></div>
        <section class="controls">
          ${navButton("hint-slides-prev", "arrow-right", explanationReplayActive("truth-table-cards") && index === 0 ? "חזרה לתפריט ההסברים" : "הקודם")}
          ${navButton("hint-slides-replay", "restart", "הקרא שוב")}
          ${navButton("hint-slides-next", "arrow-left", "המשך", { primary: true })}
          ${inlineChapterHint
            ? `<button class="btn" data-action="hint-slides-skip-to-chapter-last" type="button" ${inlineXorHintSkipDisabled() ? "disabled" : ""}>דלג</button>`
            : (explanationReplayActive("truth-table-cards")
              ? `<button class="btn" data-action="explanations-return-to-menu" type="button">חזרה לתפריט ההסברים</button>`
              : `<button class="btn" data-action="hint-slides-close" type="button">דלג</button>`)}
          ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
        </section>
      </main>`;

    setupPanelStage(slides[index]);
  }

  function renderNandBuildHelpScreen() {
    // Reached from: the explanations-menu replay → back to that menu; the
    // end-of-monologue "כן" (session 1) → "חזרה למשחק", leaving the workbench;
    // otherwise (e.g. the session-2 build-help button) → back to the workbench.
    let backAction = "back-to-workspace";
    let backLabel = "חזרה לשולחן העבודה";
    if (explanationReplayActive("build-nand")) {
      backAction = "explanations-return-to-menu";
      backLabel = "חזרה לתפריט ההסברים";
    } else if (buildTeaserAtMonologueEnd()) {
      backAction = "build-help-back-to-game";
      backLabel = "חזרה למשחק";
    }
    app.innerHTML = `
      ${topbar()}
      <main class="screen nand-build-help-screen">
        <section class="nand-build-help-card">
          <p>
            ${genderText("חלק זה של המשחק עדיין בבנייה. אתה יכול בינתיים לשמוע על זה", "חלק זה של המשחק עדיין בבנייה. את יכולה בינתיים לשמוע על זה")}
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
              const completed = taskCompleted(task.id);
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
            ${noteClearProgressButton(routingNoteDialogActive() ? "routing" : "boolean")}
          </div>
        </section>
        ${renderNoteClearDialog()}
      </div>`;
  }

  // SVG focus decoration for the focused splitter: a dashed ring plus the mirror
  // handle (a vertical axis with arrows pointing outward = reflect around y).
  function renderSplitterControls() {
    if (state.screen !== "workspace") return "";
    const id = state.workspace.focusedComponentId;
    const component = splitterById(id);
    if (!component) return "";
    const cx = component.x;
    const cy = component.y;
    const halfH = splitterHalfHeight(component);
    const hy = cy - halfH - 30;
    return `
      <g class="splitter-focus" aria-hidden="false">
        <rect class="splitter-focus-ring" x="${cx - 82}" y="${cy - halfH - 12}" width="164" height="${halfH * 2 + 24}" rx="14" />
        <g class="splitter-mirror-handle" data-action="splitter-mirror" data-component-id="${esc(id)}" role="button" tabindex="0" aria-label="שקף את המפצל" transform="translate(${cx} ${hy})">
          <circle class="splitter-mirror-bg" cx="0" cy="0" r="16" />
          <g class="splitter-mirror-glyph">
            <line x1="0" y1="-9" x2="0" y2="9" />
            <polyline points="-4,-4 -10,0 -4,4" />
            <polyline points="4,-4 10,0 4,4" />
          </g>
        </g>
        ${__splitterResize.resizeHandleMarkup(id, cx, cy, halfH, splitterOutputCount(component))}
      </g>`;
  }

  // Once a splitter's width is fixed, every pin shows its width as a number
  // above it (legs = the width, the single pin = width * output count).
  function renderSplitterWidthLabels() {
    if (state.screen !== "workspace") return "";
    return state.workspace.components
      .filter((c) => c.type === "splitter" && Number.isInteger(c.width))
      .map((c) => Object.entries(splitterPins(c)).map(([pinId, pin]) => {
        const w = pinId === "single" ? c.width * splitterOutputCount(c) : c.width;
        return `<text class="splitter-width-label" x="${c.x + pin.x}" y="${c.y + pin.y - 13}">${w}</text>`;
      }).join("")).join("");
  }

  function renderWorkspace() {
    const evaluation = workspaceEvaluation();
    // The whole workspace is re-rendered via innerHTML on every state change
    // (e.g. after dragging a tool out), which would reset the tool palette's
    // scroll position to the top. Capture it before the rebuild and restore it
    // after, so the palette stays where the learner left it.
    const prevToolboxScroll = app.querySelector(".toolbox-list")?.scrollTop || 0;
    app.innerHTML = `
      ${topbar()}
      <main class="screen workspace-screen">
        <section class="workspace-layout">
          ${renderToolbar()}
          ${renderCreateCardBubble()}
          <section class="workspace-board-wrap">
            <div class="workspace-board" data-workspace-board>
              <svg class="workspace-canvas" data-workspace-svg  aria-label="שולחן עבודה אלקטרוני" role="img">
                <rect class="workspace-board-bg" x="0" y="0" width="100%" height="100%" rx="18" />
                <g class="workspace-task-shell-layer">
                  ${state.cardCreation ? renderCardCreationFrame() : renderWorkspaceTaskShell()}
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
                <g class="workspace-splitter-labels-layer">
                  ${renderSplitterWidthLabels()}
                </g>
                <g class="workspace-splitter-controls-layer">
                  ${renderSplitterControls()}
                </g>
              </svg>
              ${renderNotTaskHint()}
              ${renderSolutionDialog()}
              ${renderWorkspaceNandMonologue()}
              ${state.cardCreation ? renderCardCreationOverlays() : ""}
            </div>
          </section>
        </section>
        ${state.cardCreation ? renderCardCreationControls() : (explanationReplayActive("nand-function") ? renderNandFunctionExplanationControls() : `
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
        </section>`)}
      </main>
      ${renderWorkspaceUnderstoodPrompt()}
      ${renderWorkspaceBuildHelpPrompt()}
      ${renderWorkspaceTaskIntro()}
      ${renderWorkspaceAccidentModal()}
      ${renderNotTestResultDialog()}
      ${renderHintDialog()}
      ${renderInfoDialog()}`;
    if (prevToolboxScroll) {
      const list = app.querySelector(".toolbox-list");
      if (list) list.scrollTop = prevToolboxScroll;
    }
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

    // The bubble should stay above the Nand and avoid covering it.
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

  // --- Card creation mode (chapter 2.4) ------------------------------------
  // The shell/interface only: an empty framed workspace where the learner names
  // a new card and sets its input/output counts. The actual card building,
  // saving, and use are NOT implemented yet.
  // An empty free-build workbench used for card creation. The invisible fixed
  // anchor keeps the normalizer from restoring the default source+Nand+lamp, so
  // the board opens empty; `freeBuild` gives the full palette + drag/wire tools.
  function createCardBuildWorkspace(returnChapterId, returnPanelIndex, logic) {
    // When editing, seed the build table with the card's stored internal circuit
    // (minus the frame anchor, which is re-added). The frame's pins come from
    // state.cardCreation, so callers editing a card must set it before calling.
    const extra = logic ? (logic.components || []).filter((c) => c.type !== "cardFrame") : [];
    const wires = logic ? (logic.wires || []) : [];
    return normalizeWorkspace({
      selectedTerminal: null,
      // The card frame is a fixed anchor: it keeps the normalizer from restoring
      // the default components AND provides the card's connectable I/O pins.
      components: [{ id: "card-frame-1", type: "cardFrame", x: 500, y: 288 }, ...extra],
      wires,
      nextId: 2,
      unlocked: true,
      accident: null,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandMonologueStep: null,
      workspaceCompleted: false,
      workspaceSession: 2,
      taskId: null,
      taskIntroSeen: true,
      freeBuild: true,
      cardBuild: true,
      sessionReturnChapterId: returnChapterId,
      sessionReturnPanelIndex: returnPanelIndex
    });
  }

  function enterCardCreation(options = {}) {
    const ws = state.workspace || {};
    const returnChapterId = ws.sessionReturnChapterId || state.chapterId || "chapter-7";
    const returnPanelIndex = Number.isInteger(ws.sessionReturnPanelIndex) ? ws.sessionReturnPanelIndex : (Number.isInteger(state.panelIndex) ? state.panelIndex : 0);
    setState({
      screen: "workspace",
      workspace: createCardBuildWorkspace(returnChapterId, returnPanelIndex),
      cardCreation: {
        name: "כרטיס חדש",
        inputs: 2,
        outputs: 1,
        inputWidths: [1, 1],
        outputWidths: [1],
        pinEdit: null,
        editingType: null,
        // Where "חזרה למחסן" lands: the warehouse (default) or the My-cards page.
        returnScreen: options.returnScreen === "myCards" ? "myCards" : "story",
        returnChapterId,
        returnPanelIndex
      }
    }, false);
  }

  // Open the card-building page pre-loaded with an existing card, to edit it.
  function enterCardCreationForEdit(cardType) {
    const card = savedCardByType(cardType);
    if (!card) return;
    const returnChapterId = state.chapterId || "chapter-7";
    const returnPanelIndex = Number.isInteger(state.panelIndex) ? state.panelIndex : 0;
    const cc = {
      name: card.name,
      inputs: Math.max(1, (card.inputs || []).length),
      outputs: Math.max(1, (card.outputs || []).length),
      inputWidths: [...(card.inputs || [1])],
      outputWidths: [...(card.outputs || [1])],
      pinEdit: null,
      editingType: cardType,
      returnScreen: "myCards",
      returnChapterId,
      returnPanelIndex
    };
    // Set cardCreation BEFORE building the workspace so the frame's pins resolve
    // and the stored wires to them survive normalization.
    state.cardCreation = cc;
    const workspace = createCardBuildWorkspace(returnChapterId, returnPanelIndex, card.logic);
    setState({ screen: "workspace", workspace, cardCreation: cc }, false);
  }

  // The names already taken by the built-in cards/gates — a new card may not
  // reuse any of them (compared case-insensitively, trimmed).
  function builtInCardNames() {
    const names = ["Nand", "Or16"];
    for (const t of TASK_DEFS) names.push(t.label);
    for (const t of ROUTING_TASK_DEFS) names.push(t.label);
    for (const t of (typeof BUS_TASK_DEFS !== "undefined" ? BUS_TASK_DEFS : [])) names.push(t.label);
    return names;
  }

  // Characters allowed in a card name: Latin/Hebrew letters, digits, space,
  // hyphen and underscore. (Kept in sync with the live input sanitiser.)
  const CARD_NAME_ALLOWED = /^[A-Za-z0-9֐-׿ _-]+$/;

  // Validate a would-be card name. Returns an error message (to show in a
  // dialog) or null when the name is fine.
  function validateCardName(name, excludeType) {
    const trimmed = String(name || "").trim();
    if (!trimmed) return "יש לתת שם לכרטיס.";
    if (!CARD_NAME_ALLOWED.test(trimmed)) return "השם מכיל תווים לא חוקיים. אפשר להשתמש באותיות, ספרות, רווח, מקף וקו תחתון בלבד.";
    const norm = trimmed.toLowerCase();
    if (builtInCardNames().some((n) => String(n).trim().toLowerCase() === norm)) return "השם הזה כבר תפוס על ידי כרטיס מובנה. בחר שם אחר.";
    // When editing, the card may keep its own name.
    if ((state.savedCards || []).some((card) => card.type !== excludeType && String(card.name).trim().toLowerCase() === norm)) return "כבר קיים כרטיס בשם הזה. בחר שם אחר.";
    return null;
  }

  // Snapshot the card being built into a saved-card record (its I/O widths and
  // its internal logic, minus the frame anchor).
  function buildSavedCardFromCreation() {
    const cc = state.cardCreation || {};
    const ws = state.workspace || {};
    const nIn = Math.min(8, Math.max(1, Math.round(Number(cc.inputs) || 1)));
    const nOut = Math.min(8, Math.max(1, Math.round(Number(cc.outputs) || 1)));
    const inputs = [];
    for (let i = 0; i < nIn; i += 1) inputs.push(Math.round(Number((cc.inputWidths || [])[i]) || 1));
    const outputs = [];
    for (let i = 0; i < nOut; i += 1) outputs.push(Math.round(Number((cc.outputWidths || [])[i]) || 1));
    const id = state.nextSavedCardId || ((state.savedCards || []).length + 1);
    return {
      // Editing keeps the card's existing type so every placed instance and
      // dependent card keeps pointing at it.
      type: cc.editingType || `${SAVED_CARD_PREFIX}${id}`,
      name: String(cc.name || "").trim(),
      inputs,
      outputs,
      logic: {
        components: (ws.components || []).filter((c) => c.type !== "cardFrame"),
        wires: ws.wires || []
      }
    };
  }

  // "חזרה למחסן": save the card and leave the build page. The name must be valid
  // and unused; on any problem we show a dialog and FAIL the exit (stay put).
  function exitCardCreation() {
    const cc = state.cardCreation || {};
    const editing = Boolean(cc.editingType);
    const err = validateCardName(cc.name, cc.editingType || null);
    if (err) return setState({ infoDialog: { message: err, discardCard: true } });

    const card = buildSavedCardFromCreation();
    registerSavedCard(card);

    // Update the existing card when editing; otherwise append a new one.
    const savedCards = editing
      ? (state.savedCards || []).map((c) => (c.type === card.type ? card : c))
      : [...(state.savedCards || []), card];
    const nextSavedCardId = editing
      ? state.nextSavedCardId
      : (state.nextSavedCardId || ((state.savedCards || []).length + 1)) + 1;

    // Where to land: back to the My-cards page, or the warehouse (default).
    const returnPatch = cc.returnScreen === "myCards"
      ? { screen: "myCards" }
      : storyTarget(chapterById(cc.returnChapterId || "chapter-7"), Number.isInteger(cc.returnPanelIndex) ? cc.returnPanelIndex : 0);

    const firstTime = !state.myCardsIntroSeen && !editing;
    // Saving a brand-new card (not an edit) earns "ממציא כרטיסים"; if that card
    // is built out of a card from "הכרטיסים שלי", it also earns "ממציא שימושי".
    if (!editing) {
      unlockAchievement("card-inventor");
      const usesSavedCard = (card.logic?.components || []).some((c) => String(c.type || "").startsWith(SAVED_CARD_PREFIX));
      if (usesSavedCard) unlockAchievement("useful-inventor");
    }
    setState({
      ...returnPatch,
      cardCreation: null,
      workspace: createDefaultWorkspace(),
      savedCards,
      nextSavedCardId,
      myCardsIntroSeen: true,
      infoDialog: firstTime
        ? 'מעכשיו אתה יכול להשתמש בכרטיס הזה. תוכל גם לחזור ולערוך אותו מתוך תפריט "הכרטיסים שלי". שם גם תוכל לשמור אותו במקום בטוח'
        : null
    }, false);
  }

  // "השלך את הכרטיס": abandon the card-build page WITHOUT saving (offered when
  // the exit is blocked by an invalid card). Leaves to the same place a normal
  // exit would, but touches neither the saved cards nor the intro flag.
  function discardCardAndExit() {
    const cc = state.cardCreation || {};
    const returnPatch = cc.returnScreen === "myCards"
      ? { screen: "myCards" }
      : storyTarget(chapterById(cc.returnChapterId || "chapter-7"), Number.isInteger(cc.returnPanelIndex) ? cc.returnPanelIndex : 0);
    setState({
      ...returnPatch,
      cardCreation: null,
      workspace: createDefaultWorkspace(),
      infoDialog: null
    }, false);
  }

  // The one-off story beat at the end of the scripted card-intro moment: on
  // "הבנתי" we leave the table and cut to von Neumann catching the learner
  // "playing instead of working", then the plot continues.
  const VON_NEUMANN_PLAY_PANEL = "panel99b_chapter_2_4_von_neumann.svg";
  function dismissCardCreationIntro() {
    const cc = state.cardCreation || {};
    const chapterId = cc.returnChapterId || "chapter-7";
    const chapter = chapterById(chapterId);
    const scene = sceneByChapter(chapter);
    const panelIndex = panelIndexByImage(scene, VON_NEUMANN_PLAY_PANEL);
    // If the panel is missing for any reason, just close the intro in place.
    if (panelIndex < 0) return setState({ cardIntroPending: false, cardIntroDone: true }, false);
    setState({
      // Close any open dialog (the tasks note especially) so von Neumann's beat
      // is shown on a clean story panel.
      ...transientUiClearPatch(),
      ...storyTarget(chapter, panelIndex),
      cardIntroPending: false,
      cardIntroDone: true,
      cardCreation: null,
      workspace: createDefaultWorkspace()
    }, true);
  }

  // The final slide of the post-MUX16 monologue (von Neumann handing over the
  // new tasks). "המשך" from here returns to the worktable.
  function isMonologueEndPanel(panel) {
    return panelImageIs(panel, "panel99f_chapter_2_4_fermi.svg");
  }

  // Delete a saved card: drop its record and its component defs, then re-render.
  function deleteSavedCard(cardType) {
    const card = savedCardByType(cardType);
    if (!card) return setState({ cardDeleteConfirm: null }, false);
    delete WORKSPACE_COMPONENT_DEFS[cardType];
    delete WORKSPACE_COMPONENT_DEFS[savedCardFrameType(card)];
    setState({
      savedCards: (state.savedCards || []).filter((c) => c.type !== cardType),
      cardDeleteConfirm: null
    }, false);
  }

  // --- Save a card to / load a card from the learner's computer --------------
  // A card export bundles the card AND every saved card it (transitively) uses,
  // so it is self-contained. On import, all bundled types are given fresh ids
  // (rewriting internal references) so nothing collides with existing cards.
  function cardBundleFor(cardType) {
    const collected = [];
    const seen = new Set();
    const visit = (type) => {
      if (seen.has(type)) return;
      seen.add(type);
      const card = savedCardByType(type);
      if (!card) return;
      collected.push(card);
      for (const comp of (card.logic?.components || [])) {
        if (String(comp.type).startsWith(SAVED_CARD_PREFIX)) visit(comp.type);
      }
    };
    visit(cardType);
    return {
      format: "theonemachine-card",
      version: 1,
      root: cardType,
      cards: collected.map((c) => ({ type: c.type, name: c.name, inputs: c.inputs, outputs: c.outputs, logic: c.logic }))
    };
  }

  function downloadCardFile(cardType) {
    const card = savedCardByType(cardType);
    if (!card) return;
    const json = JSON.stringify(cardBundleFor(cardType), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const safe = String(card.name).trim().replace(/[^\w֐-׿ -]/g, "").replace(/\s+/g, "_") || "card";
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safe}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    // Saving a card to the hard disk earns "שומר כרטיסים". Re-render so the
    // unlock flourish plays (download itself does not change app state).
    if (!achievementUnlocked("card-saver")) {
      unlockAchievement("card-saver");
      setState({}, false);
    }
  }

  // Import a bundle: assign fresh types to every bundled card, rewrite the
  // internal usercard references, register and store them. Returns an error
  // message or null. The bundle's root card is the one the learner picked.
  function importCardBundle(data) {
    if (!data || data.format !== "theonemachine-card" || !Array.isArray(data.cards) || !data.cards.length) {
      return "הקובץ אינו קובץ כרטיס תקין.";
    }
    let nextId = state.nextSavedCardId || ((state.savedCards || []).length + 1);
    const typeMap = {};
    for (const c of data.cards) {
      if (!c || typeof c.type !== "string") return "הקובץ אינו קובץ כרטיס תקין.";
      typeMap[c.type] = `${SAVED_CARD_PREFIX}${nextId}`;
      nextId += 1;
    }
    const existingNames = new Set((state.savedCards || []).map((c) => String(c.name).trim().toLowerCase()));
    const remapType = (t) => (typeof t === "string" && typeMap[t]) ? typeMap[t] : t;
    const imported = data.cards.map((c) => {
      // Keep names unique against existing cards (append a counter if taken).
      let name = String(c.name || "כרטיס").trim() || "כרטיס";
      if (!CARD_NAME_ALLOWED.test(name)) name = "כרטיס";
      let candidate = name, n = 2;
      while (existingNames.has(candidate.toLowerCase()) || builtInCardNames().some((b) => String(b).trim().toLowerCase() === candidate.toLowerCase())) {
        candidate = `${name} ${n}`;
        n += 1;
      }
      existingNames.add(candidate.toLowerCase());
      return {
        type: typeMap[c.type],
        name: candidate,
        inputs: Array.isArray(c.inputs) ? c.inputs.map((w) => Math.round(Number(w) || 1)) : [1],
        outputs: Array.isArray(c.outputs) ? c.outputs.map((w) => Math.round(Number(w) || 1)) : [1],
        logic: {
          components: ((c.logic && c.logic.components) || []).map((comp) => ({ ...comp, type: remapType(comp.type) })),
          wires: ((c.logic && c.logic.wires) || []).map((w) => ({ ...w }))
        }
      };
    });
    imported.forEach(registerSavedCard);
    // Loading a card from the hard disk earns "טוען כרטיסים".
    unlockAchievement("card-necromancer");
    setState({
      savedCards: [...(state.savedCards || []), ...imported],
      nextSavedCardId: nextId
    }, false);
    return null;
  }

  // ---- Whole-progress save / load to a file --------------------------------
  // Download the entire saved game state as a .json file (so a learner can keep
  // a backup or move it to another computer without signing in). Earns "שומר".
  function saveProgressToFile() {
    const payload = { format: "theonemachine-progress", version: 1, state: stateForStorage() };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-one-machine-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    if (!achievementUnlocked("progress-saver")) {
      unlockAchievement("progress-saver");
      setState({}, false); // re-render so the unlock flourish plays
    }
  }

  // Replace the whole game state with a file made by saveProgressToFile. Returns
  // an error message or null. Lands back on the main menu with the loaded
  // progress in place, and earns "מעלה מן האוב".
  function loadProgressFromFile(data) {
    if (!data || data.format !== "theonemachine-progress" || typeof data.state !== "object" || !data.state) {
      return "הקובץ אינו קובץ התקדמות תקין.";
    }
    let normalized;
    try {
      normalized = normalizeLoadedState({ ...defaultState, ...data.state, soundOn: false });
    } catch (e) {
      return "לא הצלחתי לטעון את קובץ ההתקדמות.";
    }
    state = { ...normalized, screen: "menu" };
    unlockAchievement("progress-necromancer");
    saveState();
    render();
    return null;
  }

  // The y of pin i of a side with `n` pins (workspace coordinates: the frame
  // sits at x 200..800, y 100..476, like a task shell).
  function cardCreationPinY(index, n) {
    const top = 150, bottom = 426;
    return Math.round(top + (index + 1) * (bottom - top) / (Math.max(1, n) + 1));
  }

  // One pin on the frame's edge, drawn like other cards' pins, spanning the
  // external terminal (outer) and internal terminal (inner). Width 1 is a thin
  // cable; wider is a bus bar with its width number. Both ends are real wiring
  // terminals (rendered by the workspace); the MIDDLE of the stub (between them,
  // over the frame edge) is a double-click target for the width picker, so it
  // does not sit on either terminal.
  function cardCreationPinBar(side, index, y, width) {
    const [x1, x2] = side === "in" ? [160, 240] : [760, 840];
    const labelX = side === "in" ? 210 : 790;
    const hitX = side === "in" ? [178, 222] : [778, 822];
    const bar = width > 1
      ? `<line class="workspace-task-shell-bus" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />
         <line class="workspace-task-shell-bus-stripe" x1="${x1 + 4}" y1="${y}" x2="${x2 - 4}" y2="${y}" />
         <text class="splitter-width-label" x="${labelX}" y="${y - 16}" text-anchor="middle">${width}</text>`
      : `<line class="workspace-task-shell-pin" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" />`;
    const hit = `<rect class="card-pin-hit" x="${hitX[0]}" y="${y - 16}" width="${hitX[1] - hitX[0]}" height="32" fill="transparent" data-card-pin data-pin-side="${side}" data-pin-index="${index}" />`;
    return `<g class="card-pin">${bar}${hit}</g>`;
  }

  function cardCreationPins(cc, side) {
    const count = side === "in" ? cc.inputs : cc.outputs;
    const widths = (side === "in" ? cc.inputWidths : cc.outputWidths) || [];
    const n = Math.min(8, Math.max(1, Math.round(Number(count) || 1)));
    let out = "";
    for (let i = 0; i < n; i += 1) {
      out += cardCreationPinBar(side, i, cardCreationPinY(i, n), Math.round(Number(widths[i]) || 1));
    }
    return out;
  }

  // The little width picker shown after double-clicking a pin (turn it into a
  // bus). Positioned just outside the pin, on the board.
  function renderCardPinWidthBox() {
    const cc = state.cardCreation;
    if (!cc || !cc.pinEdit) return "";
    const { side, index } = cc.pinEdit;
    const n = Math.min(8, Math.max(1, side === "in" ? cc.inputs : cc.outputs));
    const y = cardCreationPinY(index, n);
    const x = side === "in" ? 118 : 882;
    const w = Math.round(Number((side === "in" ? cc.inputWidths : cc.outputWidths)[index]) || 1);
    return `
      <div class="splitter-count-box card-pin-width-box" style="left:${x}px; top:${y}px;">
        <label>רוחב
          <input type="number" min="1" max="16" step="1" value="${w}" data-card-pin-width aria-label="רוחב הפין" />
        </label>
      </div>`;
  }

  function renderCardCreationIntro() {
    // Shown only during the scripted post-MUX16 moment (cardIntroPending). Later
    // openings of the card page (via the tool or "My cards") show no explainer.
    if (!state.cardIntroPending) return "";
    return `
      <div class="card-creation-intro" role="dialog" aria-label="הסבר יצירת כרטיס">
        <p>אתה יכול להוסיף כניסות ויציאות. לחיצה כפולה על כל אחת מהן מאפשרת לך להפוך אותן לבס ברוחב שאתה רוצה.</p>
        <div class="card-creation-intro-actions">
          <button class="btn btn-primary" data-action="card-creation-intro-ok" type="button">הבנתי</button>
        </div>
      </div>`;
  }

  // Card-creation reuses the real workspace board (renderWorkspace). These render
  // the card-specific extras: the frame + editable pins (inside the task-shell
  // layer), the overlays (name, I/O boxes, width picker, intro), and the bottom
  // controls.
  function renderCardCreationFrame() {
    const cc = state.cardCreation;
    if (!cc) return "";
    return `
      <rect class="workspace-task-shell-frame" x="200" y="100" width="600" height="376" rx="18" />
      ${cardCreationPins(cc, "in")}
      ${cardCreationPins(cc, "out")}`;
  }

  function renderCardCreationOverlays() {
    const cc = state.cardCreation;
    if (!cc) return "";
    return `
      <div class="card-creation-name-overlay">
        <input class="card-creation-name" type="text" value="${esc(cc.name)}" aria-label="שם הכרטיס" maxlength="24" />
      </div>
      <div class="card-creation-io card-creation-io-left">
        <label>כניסות</label>
        <input class="card-creation-count" type="number" min="1" max="8" step="1" value="${cc.inputs}" data-card-io="inputs" aria-label="מספר כניסות" />
      </div>
      <div class="card-creation-io card-creation-io-right">
        <label>יציאות</label>
        <input class="card-creation-count" type="number" min="1" max="8" step="1" value="${cc.outputs}" data-card-io="outputs" aria-label="מספר יציאות" />
      </div>
      ${renderCardPinWidthBox()}
      ${renderCardCreationIntro()}`;
  }

  function renderCardCreationControls() {
    return `
      <section class="controls">
        ${navButton("card-creation-reset", "restart", "נקה שולחן")}
        <button class="btn" data-action="card-creation-back" type="button">חזרה למחסן</button>
        ${navButton("sound", state.soundOn ? "speaker" : "speaker-muted", state.soundOn ? "השתק סאונד" : "הפעל סאונד")}
      </section>`;
  }

  // --- Arithmetic notebook (chapter 2.5) -----------------------------------
  // Opened from the Stone-Millis book. A squared-paper page: every cell can be
  // clicked and typed into. A 4-digit + 4-digit column-addition exercise (with
  // at least one carry) is pre-printed high on the page; the learner writes the
  // carries and the answer in the surrounding cells.
  const NB_COLS = 21;
  const NB_ROWS = 13;
  // The exercise block anchors: digit columns 8..12 (5 slots, right-aligned),
  // operand rows 3 and 4, the sum line under row 4, the answer on row 5.
  const NB_DIGIT_COLS = [8, 9, 10, 11, 12];
  const NB_CARRY_ROW = 2;
  const NB_OP1_ROW = 3;
  const NB_OP2_ROW = 4;
  const NB_ANSWER_ROW = 5;
  const NB_PLUS_COL = 8;
  const NB_UNITS_COL = 12;
  const NB_TENS_COL = 11;

  const NB_COLUMN_NAMES = ["אחדות", "עשרות", "מאות", "אלפים", "עשרות אלפים"];
  const NOTEBOOK_HINT_NOTE = "(לחיצה על \"הפעל רמז\" תמחק את מה שעשית)";

  // Digit at position i (0=units … 3=thousands) of a number.
  function nbDigit(n, i) {
    return Math.floor(n / Math.pow(10, i)) % 10;
  }

  // The per-column breakdown of the current addition: for each of the four
  // columns, the two digits, the incoming carry, the sum, the digit written and
  // the outgoing carry. Drives the hints and the solution walkthrough.
  function notebookColumns() {
    const ex = state.notebook?.exercise;
    if (!ex) return [];
    const cols = [];
    let carry = 0;
    for (let i = 0; i < 4; i++) {
      const d1 = nbDigit(ex.a, i);
      const d2 = nbDigit(ex.b, i);
      const sum = d1 + d2 + carry;
      cols.push({ i, d1, d2, carryIn: carry, sum, digit: sum % 10, carryOut: Math.floor(sum / 10) });
      carry = Math.floor(sum / 10);
    }
    return cols;
  }

  function notebookColumnTextHint(i) {
    if (i === 0) return "התחל מלחשב את הסכום של ספרת האחדות של המספר הראשון עם ספרת האחדות של המספר השני.";
    const name = NB_COLUMN_NAMES[i];
    const base = `המשך לספרת ה${name}: חבר את ספרת ה${name} של המספר הראשון עם ספרת ה${name} של המספר השני`;
    return (notebookColumns()[i]?.carryIn > 0) ? `${base}, ואל תשכח להוסיף את הספרה שנשאת מהשלב הקודם.` : `${base}.`;
  }

  function notebookColumnPrompt(i) {
    return i === 0 ? "צריך עזרה עם הרמז הראשון?" : `צריך עזרה עם חישוב ספרת ה${NB_COLUMN_NAMES[i]}?`;
  }

  // The explanation shown when a column's step is filled in (interactive hint or
  // a walkthrough step). Adapts to a carry coming in and/or going out.
  function notebookColumnMessage(i) {
    const col = notebookColumns()[i];
    if (!col) return "";
    const name = NB_COLUMN_NAMES[i];
    let msg;
    if (i === 0) {
      msg = `הסכום הוא ${col.d1} + ${col.d2} = ${col.sum}.`;
    } else if (col.carryIn > 0) {
      msg = `סכום ספרות ה${name} הוא ${col.d1} + ${col.d2}, ועוד ${col.carryIn} שנשאנו מהשלב הקודם — סך הכל ${col.sum}.`;
    } else {
      msg = `סכום ספרות ה${name} הוא ${col.d1} + ${col.d2} = ${col.sum}.`;
    }
    if (col.carryOut > 0) {
      // "greater than 10" is wrong when the sum is exactly 10 — use "not less
      // than 10" there.
      const geTen = col.sum === 10 ? "לא קטנה מ-10" : "גדולה מ-10";
      if (i === 0) {
        msg += ` מכיוון שהתוצאה ${geTen} אנחנו לא יכולים לכתוב אותה בספרת האחדות, לכן אנחנו שומרים את העשר לאחר כך. מכיוון שהוא עשרה אחת אנחנו כותבים אותו כ-1 מעל המקום של ספרת העשרות.`;
      } else if (i < 3) {
        msg += ` מכיוון שהתוצאה ${geTen}, כותבים את ספרת האחדות שלה (${col.digit}) במקום, ונושאים 1 אל ספרת ה${NB_COLUMN_NAMES[i + 1]} (כותבים אותו מעל).`;
      } else {
        msg += ` מכיוון שהתוצאה ${geTen}, כותבים את ספרת האחדות שלה (${col.digit}) במקום, ואת ה-1 שנשאנו כותבים כספרה השמאלית ביותר של התשובה.`;
      }
    }
    return msg;
  }

  // The hint list: one verbal + one interactive hint per digit column, except
  // the last column keeps only its verbal hint — the interactive step for it is
  // replaced by the "הצגת פתרון" walkthrough, which is the final list item.
  function notebookHints() {
    if (!state.notebook?.exercise) return [];
    const hints = [];
    for (let i = 0; i < 4; i++) {
      hints.push({ title: `רמז ${hints.length + 1}`, kind: "text", col: i, text: notebookColumnTextHint(i) });
      if (i < 3) hints.push({ title: `רמז ${hints.length + 1}`, kind: "interactive", col: i, text: notebookColumnPrompt(i), note: NOTEBOOK_HINT_NOTE });
    }
    return hints;
  }

  // Hints unlock like the worktable: none until the second failed check, then
  // one more per failure (failCount - 1, capped at the hint count).
  function notebookUnlockedHints() {
    const nb = state.notebook;
    if (!nb) return 0;
    return Math.min(notebookHints().length, Math.max(0, (nb.failCount || 0) - 1));
  }

  // The solution walkthrough becomes offerable once every hint is unlocked.
  function notebookSolutionAvailable() {
    const hints = notebookHints();
    return hints.length > 0 && notebookUnlockedHints() >= hints.length;
  }

  // The correct answer (and its carries) filled in for columns 0..upToCol.
  function notebookSolutionCells(upToCol) {
    const cols = notebookColumns();
    const cells = {};
    for (let i = 0; i <= upToCol && i < cols.length; i++) {
      const col = cols[i];
      const digitCol = NB_UNITS_COL - i;
      cells[`${NB_ANSWER_ROW},${digitCol}`] = String(col.digit);
      if (col.carryOut > 0) {
        if (i < 3) cells[`${NB_CARRY_ROW},${digitCol - 1}`] = String(col.carryOut);
        else cells[`${NB_ANSWER_ROW},${digitCol - 1}`] = String(col.carryOut);
      }
    }
    return cells;
  }

  // The exercise sequence is deterministic (reproducible). The first, teaching
  // exercise is hand-built so its columns cover every case in order: units 3+4=7
  // (no carry), tens 6+4=10 (a carry whose sum is exactly 10), hundreds 7+5+1=13
  // (an ordinary carry, sum > 10) and thousands 8+9+1=18 (the last digit
  // overflows into a fifth digit) — 8763 + 9544 = 18307. The rest were drawn
  // once and frozen; anything past them comes from a seeded generator keyed by
  // index, so exercise N is always the same pair.
  const NB_HARDCODED_EXERCISES = [
    { a: 8763, b: 9544 },
    { a: 3394, b: 7917 },
    { a: 4374, b: 7169 },
    { a: 2345, b: 7518 },
    { a: 5573, b: 2588 }
  ];
  const NB_EXERCISE_SEED = 1943;

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Every exercise must have at least one carry that is NOT the final overflow —
  // i.e. a carry out of the units, tens or hundreds column (so mid-addition
  // carrying is actually practised).
  function exerciseHasMidCarry(a, b) {
    let carry = 0;
    for (let i = 0; i < 4; i++) {
      const s = nbDigit(a, i) + nbDigit(b, i) + carry;
      const carryOut = s >= 10 ? 1 : 0;
      if (carryOut && i < 3) return true;
      carry = carryOut;
    }
    return false;
  }

  function drawExercise(rng) {
    let a = 0;
    let b = 0;
    let guard = 0;
    do {
      a = 1000 + Math.floor(rng() * 9000);
      b = 1000 + Math.floor(rng() * 9000);
      guard += 1;
    } while (!exerciseHasMidCarry(a, b) && guard < 400);
    return { a, b };
  }

  // The exercise at a given index: frozen for the first five, seeded afterwards.
  function nthExercise(index) {
    if (index < NB_HARDCODED_EXERCISES.length) return { ...NB_HARDCODED_EXERCISES[index] };
    const rng = mulberry32((NB_EXERCISE_SEED + Math.imul(index, 2654435761)) >>> 0);
    return drawExercise(rng);
  }

  function openNotebook() {
    const existing = state.notebook && state.notebook.exercise ? state.notebook : null;
    const notebook = existing || freshNotebook(0);
    setState({ screen: "notebook", notebook });
  }

  function freshNotebook(index) {
    return {
      exerciseIndex: index,
      exercise: nthExercise(index),
      cells: {},
      active: null,
      failCount: 0,
      hintsSeen: 0,
      hintIndex: 0,
      solutionStep: 0,
      // From the 2nd exercise on, a failed check points at the first wrong digit
      // (position index) and highlights it until the next click.
      mistake: null,
      // Position of the movable hint/explanation window (null → default spot).
      winPos: null,
      // Current overlay: null | "correct" | "wrong" | "explanation-stub" |
      // "hints" | "hint-applied" | "solution".
      dialog: null
    };
  }

  // The first exercise teaches with the worktable-style hints; later exercises
  // (only reached after a non-clean solve) instead point at the first wrong
  // digit and, after five failures, offer the walkthrough.
  function notebookHintsMode() {
    return (state.notebook?.exerciseIndex || 0) === 0;
  }

  // The position (0 = units) of the learner's first wrong answer digit, scanning
  // from the units column up; also catches a stray digit in a guard column.
  function notebookMistakePosition(nb) {
    const expected = String(nb.exercise.a + nb.exercise.b);
    const L = expected.length;
    const startCol = NB_UNITS_COL + 1 - L;
    const cell = (c) => (nb.cells[`${NB_ANSWER_ROW},${c}`] || "");
    if (cell(NB_UNITS_COL + 1) !== "") return 0; // a stray digit right of the units
    for (let i = 0; i < L; i++) {
      if (cell(NB_UNITS_COL - i) !== expected[L - 1 - i]) return i;
    }
    if (cell(startCol - 1) !== "") return L; // a stray leading digit
    return 0;
  }

  // The pre-printed (non-editable) exercise cells: "r,c" -> character.
  function notebookFixedCells() {
    const ex = state.notebook?.exercise;
    if (!ex) return {};
    const a = String(ex.a).padStart(4, "0").split("");
    const b = String(ex.b).padStart(4, "0").split("");
    const cells = {};
    for (let i = 0; i < 4; i++) cells[`${NB_OP1_ROW},${NB_DIGIT_COLS[i + 1]}`] = a[i];
    cells[`${NB_OP2_ROW},${NB_PLUS_COL}`] = "+";
    for (let i = 0; i < 4; i++) cells[`${NB_OP2_ROW},${NB_DIGIT_COLS[i + 1]}`] = b[i];
    return cells;
  }

  function isLockedNotebookCell(r, c) {
    return Object.prototype.hasOwnProperty.call(notebookFixedCells(), `${r},${c}`);
  }

  // All notebook messages are movable windows that leave the page interactive;
  // only the read-only solution walkthrough freezes editing.
  function notebookInteractionBlocked() {
    return state.notebook?.dialog === "solution";
  }

  function notebookSelectCell(r, c) {
    const nb = state.notebook;
    if (!nb || notebookInteractionBlocked() || isLockedNotebookCell(r, c)) return;
    // Starting to write dismisses a "wrong" message and clears the mistake mark.
    const dialog = nb.dialog === "wrong" ? null : nb.dialog;
    setState({ notebook: { ...nb, active: `${r},${c}`, mistake: null, dialog } }, false);
  }

  // Check only the answer cells (the digits of the sum, right-aligned under the
  // units column) plus the single guard cell on either side, which must be
  // empty. Everything else on the page may be scribbled on freely.
  function notebookSolved(nb) {
    const cell = (r, c) => (nb.cells[`${r},${c}`] || "");
    const expected = String(nb.exercise.a + nb.exercise.b);
    const startCol = NB_UNITS_COL + 1 - expected.length; // leftmost answer column
    for (let i = 0; i < expected.length; i++) {
      if (cell(NB_ANSWER_ROW, startCol + i) !== expected[i]) return false;
    }
    if (cell(NB_ANSWER_ROW, startCol - 1) !== "") return false;      // guard left of the answer
    if (cell(NB_ANSWER_ROW, NB_UNITS_COL + 1) !== "") return false;  // guard right of the answer
    return true;
  }

  function checkNotebook() {
    const nb = state.notebook;
    if (!nb || !nb.exercise) return;
    if (notebookSolved(nb)) {
      const patch = { notebook: { ...nb, active: null, dialog: "correct" } };
      // Mark the library arithmetic task as done — but not when this notebook is
      // an explanation replay or a review reached back from the booklet.
      if (!nb.fromExplanations && !nb.reviewFromBooklet) patch.libraryArithDone = true;
      setState(patch);
      return;
    }
    const patch = { ...nb, active: null, failCount: (nb.failCount || 0) + 1, dialog: "wrong" };
    // Later exercises flag the first wrong digit instead of offering hints.
    if (!notebookHintsMode()) patch.mistake = notebookMistakePosition(nb);
    setState({ notebook: patch });
  }

  function resetNotebook() {
    const nb = state.notebook;
    if (!nb) return;
    // Clear the scribbles (but keep the exercise and the earned hint progress).
    setState({ notebook: { ...nb, cells: {}, active: null, dialog: null } });
  }

  // Dev shortcut (Ctrl+Shift+9): fill in the correct answer and check it.
  function secretSolveNotebook() {
    const nb = state.notebook;
    if (!nb || !nb.exercise) return;
    const sum = String(nb.exercise.a + nb.exercise.b);
    const startCol = NB_UNITS_COL + 1 - sum.length;
    const cells = {};
    for (let i = 0; i < sum.length; i++) cells[`${NB_ANSWER_ROW},${startCol + i}`] = sum[i];
    setState({ notebook: { ...nb, cells, active: null, mistake: null } }, false);
    checkNotebook();
  }

  // ---- Result / hint dialog transitions ----
  // A clean solve continues the plot: von Neumann's binary lesson, which sits
  // just after the library slides in the arithmetic scene.
  function notebookContinue() {
    // Leaving the notebook is the end of the decimal-addition solution → announce
    // its explanation unlock now (a no-op if the solution was never opened, or if
    // it was already announced on an earlier pass).
    announceExplanationUnlock("arith-dec-add");
    // The decimal-addition review opened from the booklet returns to the booklet
    // menu; the library's own notebook continues the plot.
    if (state.notebook?.reviewFromBooklet) {
      setState({ notebook: { variant: "binary", mode: "menu" } });
      return;
    }
    // A sample opened from the explanations menu returns there.
    if (state.notebook?.fromExplanations) {
      setState({ screen: "explanations", notebook: null }, false);
      return;
    }
    setState({
      ...transientUiClearPatch(),
      screen: "story",
      chapterId: "chapter-8",
      sceneId: "arithmetic",
      panelIndex: 2,
      replayNonce: state.replayNonce + 1,
      notebook: null
    }, true);
  }

  function notebookNextExercise() {
    const nb = state.notebook;
    const next = freshNotebook((nb?.exerciseIndex || 0) + 1);
    // Keep the booklet-review / from-explanations flags across exercises, so a
    // mistake never reverts to the library's own back/continue behaviour.
    if (nb?.reviewFromBooklet) next.reviewFromBooklet = true;
    if (nb?.fromExplanations) next.fromExplanations = true;
    setState({ notebook: next });
  }

  function notebookRetry() {
    const nb = state.notebook;
    setState({ notebook: { ...nb, dialog: null, mistake: null } });
  }

  // The solution occupies the slot after the last hint. Its index is the hint
  // count (so hintIndex === notebookHints().length selects the solution).
  function notebookSolutionSlot() {
    return notebookHints().length;
  }

  function notebookMaxHintIndex() {
    const unlocked = notebookUnlockedHints();
    return notebookSolutionAvailable() ? notebookSolutionSlot() : Math.max(0, unlocked - 1);
  }

  // The bottom button opens the browsable list; once the hints are exhausted it
  // opens straight on the solution slot instead of the last hint.
  function notebookOpenHints() {
    const nb = state.notebook;
    const unlocked = notebookUnlockedHints();
    if (unlocked <= 0 && !notebookSolutionAvailable()) return;
    const hintIndex = notebookSolutionAvailable() ? notebookSolutionSlot() : unlocked - 1;
    setState({ notebook: { ...nb, dialog: "hints", hintIndex, hintsSeen: Math.max(nb.hintsSeen || 0, unlocked) } });
  }

  function notebookSelectHint(index) {
    const nb = state.notebook;
    const clamped = Math.min(Math.max(0, index), notebookMaxHintIndex());
    setState({ notebook: { ...nb, hintIndex: clamped } }, false);
  }

  function notebookHintClose() {
    const nb = state.notebook;
    setState({ notebook: { ...nb, dialog: null } });
  }

  // Interactive hint for a column: fill the correct answer up to that column
  // (its digit, and any carry above the next column), erasing the learner's own
  // scribbles first, then explain that column's step.
  function notebookApplyHint(col) {
    const nb = state.notebook;
    setState({ notebook: { ...nb, cells: notebookSolutionCells(col), active: null, appliedCol: col, dialog: "hint-applied" } });
  }

  // ---- Solution walkthrough ----
  // The walkthrough has no early exit: it always ends by moving on (to the next
  // exercise, or the story when the exercise was solved with no mistakes).
  function notebookOpenSolution() {
    const nb = state.notebook;
    // Seeing the decimal-addition solution unlocks its חשבון menu button.
    unlockExplanation("arith-dec-add", { silent: true });
    setState({ notebook: { ...nb, dialog: "solution", solutionStep: 0, mistake: null } });
  }

  function notebookSolutionNext() {
    const nb = state.notebook;
    const last = notebookColumns().length - 1;
    setState({ notebook: { ...nb, solutionStep: Math.min(last, (nb.solutionStep || 0) + 1) } });
  }

  function notebookSolutionPrev() {
    const nb = state.notebook;
    setState({ notebook: { ...nb, solutionStep: Math.max(0, (nb.solutionStep || 0) - 1) } });
  }

  function notebookBackToLibrary() {
    // From the booklet's decimal-review, "back" goes to the workshop/warehouse.
    if (state.notebook?.reviewFromBooklet) return binBackToWorkshop(false);
    setState({
      ...transientUiClearPatch(),
      screen: "story",
      chapterId: "chapter-8",
      sceneId: "arithmetic",
      panelIndex: 1
    }, true);
  }

  function handleNotebookKey(event) {
    const nb = state.notebook;
    if (!nb || notebookInteractionBlocked()) return;
    if (event.key === "Escape") {
      if (nb.active) { setState({ notebook: { ...nb, active: null } }, false); event.preventDefault(); }
      return;
    }
    const active = nb.active;
    if (!active) return;
    const [r, c] = active.split(",").map(Number);
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
      let nr = r;
      let nc = c;
      if (event.key === "ArrowRight") nc = Math.min(NB_COLS - 1, c + 1);
      if (event.key === "ArrowLeft") nc = Math.max(0, c - 1);
      if (event.key === "ArrowUp") nr = Math.max(0, r - 1);
      if (event.key === "ArrowDown") nr = Math.min(NB_ROWS - 1, r + 1);
      setState({ notebook: { ...nb, active: `${nr},${nc}` } }, false);
      event.preventDefault();
      return;
    }
    if (isLockedNotebookCell(r, c)) return;
    if (event.key === "Backspace" || event.key === "Delete") {
      const cells = { ...nb.cells };
      delete cells[active];
      setState({ notebook: { ...nb, cells } }, false);
      event.preventDefault();
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const cells = { ...nb.cells };
      cells[active] = event.key;
      setState({ notebook: { ...nb, cells } }, false);
      event.preventDefault();
    }
  }

  function renderNotebook() {
    const nb = state.notebook || {};
    const inSolution = nb.dialog === "solution";
    const displayCells = inSolution ? notebookSolutionCells(nb.solutionStep || 0) : (nb.cells || {});
    const fixed = notebookFixedCells();
    const answerCols = new Set(NB_DIGIT_COLS.map((c) => `${NB_ANSWER_ROW},${c}`));
    const rows = [];
    for (let r = 0; r < NB_ROWS; r++) {
      let cells = "";
      for (let c = 0; c < NB_COLS; c++) {
        const key = `${r},${c}`;
        const fixedChar = fixed[key];
        const char = fixedChar != null ? fixedChar : (displayCells[key] || "");
        const classes = ["notebook-cell"];
        if (fixedChar != null) classes.push("notebook-cell-fixed");
        if (!inSolution && nb.active === key) classes.push("notebook-cell-active");
        // The addition line: a heavier bottom edge under the second operand.
        if (r === NB_OP2_ROW && NB_DIGIT_COLS.includes(c)) classes.push("notebook-cell-underline");
        if (answerCols.has(key)) classes.push("notebook-cell-answer");
        if (!inSolution && nb.mistake != null && key === `${NB_ANSWER_ROW},${NB_UNITS_COL - nb.mistake}`) classes.push("notebook-cell-mistake");
        const lockAttr = fixedChar != null ? ' aria-disabled="true"' : "";
        cells += `<button type="button" class="${classes.join(" ")}" data-action="notebook-cell" data-r="${r}" data-c="${c}"${lockAttr}>${esc(char)}</button>`;
      }
      rows.push(`<div class="notebook-row">${cells}</div>`);
    }
    const unlocked = notebookUnlockedHints();
    const hintFresh = (nb.hintsSeen || 0) < unlocked;
    // Once every hint is unlocked the button becomes "פתרון" (opening the list
    // straight on the solution); before that it invites the next hint.
    const hintLabel = notebookSolutionAvailable()
      ? "פתרון"
      : ((nb.hintsSeen || 0) === 0 ? "רוצה רמז?" : "רוצה עוד רמז?");
    // The hint button belongs only to the first, teaching exercise.
    const showHintBtn = notebookHintsMode() && (unlocked > 0 || notebookSolutionAvailable());
    const hintButton = showHintBtn
      ? `<button class="btn hint-btn ${hintFresh ? "hint-btn-ready" : "hint-btn-seen"}" data-action="notebook-hints-open" type="button">${esc(hintLabel)}</button>`
      : "";
    const footer = inSolution ? "" : `
        <div class="notebook-actions">
          <button class="btn btn-primary" data-action="notebook-check" type="button">בדיקה</button>
          ${hintButton}
          <button class="btn" data-action="notebook-back-to-library" type="button">${nb.reviewFromBooklet ? "חזרה למחסן" : "חזרה לספרייה"}</button>
          <button class="btn notebook-reset-btn" data-action="notebook-reset" type="button" aria-label="נקה הכל">↻</button>
        </div>`;
    app.innerHTML = `
      ${topbar()}
      <main class="screen notebook-screen">
        <div class="notebook-page" data-notebook-page>
          ${rows.join("")}
        </div>
        <div class="notebook-footer">${footer}</div>
        ${renderNotebookDialog(nb)}
      </main>`;
  }

  // Every notebook message is a movable window that leaves the exercise visible.
  function renderNotebookDialog(nb) {
    const dialog = nb.dialog;
    if (!dialog) return "";
    if (dialog === "hints") return renderNotebookHints(nb);
    if (dialog === "hint-applied") return renderNotebookExplain(nb);
    if (dialog === "solution") return renderNotebookSolution(nb);
    let title = "";
    let body = "";
    let actions = "";
    if (dialog === "correct") {
      // Reviewing the solution is mandatory, so it is the only way onward.
      title = "יפה מאוד!";
      body = "<p>כל הכבוד! פתרת נכון. עכשיו נעבור על הפתרון.</p>";
      actions = '<button class="btn btn-primary" data-action="notebook-solution-open" type="button">הצגת פתרון</button>';
    } else if (dialog === "wrong") {
      title = "בדיקה";
      if (notebookHintsMode()) {
        body = (nb.failCount || 0) <= 1 ? "<p>הפתרון שגוי.</p>" : "<p>הפתרון עדיין שגוי.</p>";
        actions = '<button class="btn btn-primary" data-action="notebook-retry" type="button">נסה שוב</button>';
      } else {
        const name = NB_COLUMN_NAMES[nb.mistake || 0] || "אחדות";
        body = `<p>הטעות הראשונה שלך היא בספרת ה${name}.</p>`;
        actions =
          '<button class="btn btn-primary" data-action="notebook-retry" type="button">נסה שוב</button>' +
          ((nb.failCount || 0) >= 5 ? '<button class="btn" data-action="notebook-solution-open" type="button">רוצה לראות את הפתרון</button>' : "");
      }
    } else if (dialog === "explanation-stub") {
      title = "המשך";
      body = "<p>שקף העלילה הבא יגיע בהמשך…</p>";
      actions = '<button class="btn" data-action="notebook-back-to-library" type="button">חזרה לספרייה</button>';
    }
    return notebookWindow(nb, title, body, actions);
  }

  // A movable window (drag by its header) that does not cover the exercise —
  // used for the hint list, the step explanation and the solution walkthrough.
  function notebookWindow(nb, title, bodyHtml, actionsHtml) {
    const pos = nb.winPos;
    const style = pos ? `left:${pos.left}px;top:${pos.top}px;bottom:auto;transform:none;` : "";
    return `
      <div class="nb-window" data-nb-window style="${style}">
        <div class="nb-window-head" data-nb-drag>
          <span class="nb-window-title">${esc(title)}</span>
          <span class="nb-window-grip" aria-hidden="true">⠿</span>
        </div>
        <div class="nb-window-body">${bodyHtml}</div>
        <div class="nb-window-actions">${actionsHtml}</div>
      </div>`;
  }

  // The browsable hint list, styled like the worktable's (hint titles on one
  // side, the selected hint's content on the other). The last item is the
  // solution walkthrough once every hint has unlocked.
  function renderNotebookHints(nb) {
    const unlocked = notebookUnlockedHints();
    const solutionOffered = notebookSolutionAvailable();
    if (unlocked <= 0 && !solutionOffered) return "";
    const hints = notebookHints();
    const solutionSlot = notebookSolutionSlot();
    const selectedIndex = Math.min(Math.max(0, nb.hintIndex || 0), notebookMaxHintIndex());
    const onSolution = solutionOffered && selectedIndex === solutionSlot;
    const items = hints.slice(0, unlocked).map((hint, index) => `
      <button class="hint-list-item ${index === selectedIndex ? "hint-list-item-active" : ""}" data-action="notebook-hint-select" data-hint-index="${index}" type="button">
        ${esc(hint.title)}
      </button>`).join("");
    // The solution is the final selectable slot; picking it shows a start button.
    const solutionItem = solutionOffered
      ? `<button class="hint-list-item hint-solution-item ${onSolution ? "hint-list-item-active" : ""}" data-action="notebook-hint-select" data-hint-index="${solutionSlot}" type="button">פתרון</button>`
      : "";
    let content;
    if (onSolution) {
      content = '<p>אפשר לראות את הפתרון המלא של התרגיל.</p><button class="btn btn-primary" data-action="notebook-solution-open" type="button">הצג פתרון</button>';
    } else {
      const selected = hints[selectedIndex];
      content = selected && selected.kind === "interactive"
        ? `<p>${esc(selected.text)}</p>${selected.note ? `<p class="notebook-dialog-note">${esc(selected.note)}</p>` : ""}<button class="btn btn-primary" data-action="notebook-hint-apply" data-col="${selected.col}" type="button">הפעל רמז</button>`
        : `<p>${esc(selected ? selected.text : "")}</p>`;
    }
    const body = `
      <div class="hint-layout">
        <nav class="hint-list" aria-label="רשימת רמזים">${items}${solutionItem}</nav>
        <div class="hint-content">${content}</div>
      </div>`;
    return notebookWindow(nb, "רמזים", body, '<button class="btn" data-action="notebook-hint-close" type="button">סגור</button>');
  }

  function renderNotebookExplain(nb) {
    const body = hintParagraphsHtml(notebookColumnMessage(nb.appliedCol || 0));
    return notebookWindow(nb, "הסבר", body, '<button class="btn btn-primary" data-action="notebook-hint-close" type="button">הבנתי</button>');
  }

  function renderNotebookSolution(nb) {
    const cols = notebookColumns();
    const step = Math.min(Math.max(0, nb.solutionStep || 0), Math.max(0, cols.length - 1));
    const isLast = step >= cols.length - 1;
    const hadFailures = (nb.failCount || 0) > 0;
    const body = hintParagraphsHtml(notebookColumnMessage(step));
    const prev = step > 0 ? '<button class="btn" data-action="notebook-solution-prev" type="button">הקודם</button>' : "";
    let actions;
    if (isLast) {
      // The walkthrough ends by moving on: another exercise if the learner made
      // any mistake, otherwise straight to the story. No "close" escape.
      actions = hadFailures
        ? prev + '<button class="btn btn-primary" data-action="notebook-next-exercise" type="button">תרגיל נוסף</button>'
        : prev + '<button class="btn btn-primary" data-action="notebook-continue" type="button">המשך</button>';
    } else {
      actions = prev + '<button class="btn btn-primary" data-action="notebook-solution-next" type="button">המשך</button>';
    }
    return notebookWindow(nb, `פתרון — ספרת ה${NB_COLUMN_NAMES[step]}`, body, actions);
  }

  // =====================================================================
  // Binary-conversion booklet (opened from the workshop, panel107).
  // A "variant" of the notebook screen: it reuses the notebook shell and the
  // movable nb-window chrome, but has its own equation display, calculator-
  // style digit entry (the cursor advances left→right as you type), its own
  // deterministic exercises, hints and walkthroughs. Two stages, each of
  // which repeats until the learner solves one with NO help and NO mistakes:
  //   "bin2dec": read a binary number, type its decimal value.
  //   "dec2bin": read a decimal number, type its binary form.
  // =====================================================================
  const BIN_BOOKLET_SEED = 1943;
  // Frozen teaching values (the rest come from the seeded generator, keyed by
  // index, so exercise N is always the same). bin2dec[0] = 22 = 10110₂.
  // All values stay above 40 (and ≤ 63, i.e. six-bit) in both directions.
  const BIN2DEC_HARDCODED = [45, 53, 43, 58, 51];
  const DEC2BIN_HARDCODED = [57, 51, 58, 45, 49];
  // The three booklet tasks, in order. A task is "done" once solved cleanly.
  const BIN_STAGES = ["bin2dec", "dec2bin", "binadd"];
  // Binary column-addition pairs, frozen for the first five (the rest seeded by
  // index). The first teaches every carry case in one sum: a column with no
  // carry, a column whose bits sum to 2 (write 0, carry 1), one that sums to 3
  // (write 1, carry 1) and a final carry that opens a new leftmost bit —
  // 27 + 14 = 41 (@[011011 + 001110 = 101001]).
  const BINADD_HARDCODED = [
    { a: 27, b: 14 }, // 41 = 101001
    { a: 22, b: 21 }, // 43 = 101011
    { a: 45, b: 19 }, // 64 = 1000000 (a full carry chain)
    { a: 30, b: 12 }, // 42 = 101010
    { a: 25, b: 38 }  // 63 = 111111 (no carries)
  ];
  function nthBinAddPair(index) {
    if (index < BINADD_HARDCODED.length) return { ...BINADD_HARDCODED[index] };
    // Two 5-bit-ish operands (12..47) whose sum needs at least one carry.
    const rng = mulberry32((BIN_BOOKLET_SEED + Math.imul(index + 313, 2654435761)) >>> 0);
    let a = 0; let b = 0; let guard = 0;
    do {
      a = 12 + Math.floor(rng() * 36);
      b = 12 + Math.floor(rng() * 36);
      guard += 1;
    } while (((a & b) === 0) && guard < 60); // (a & b) !== 0 guarantees a carry
    return { a, b };
  }
  // The booklet uses the same squared-paper grid as the arithmetic notebook:
  // the task is pre-printed on one row, every other cell is free scribble
  // space, and only the answer cells (right of the "=") are checked.
  const BIN_NB_COLS = 27;
  const BIN_NB_ROWS = 17;
  // bin→dec stacks each bit's contribution ABOVE the answer, so its equation
  // sits low; dec→bin writes its solution (chain, and the tall column form)
  // BELOW the equation, so its equation sits near the top.
  function binEqRow(stage) { return stage === "bin2dec" ? 8 : 2; }
  const BIN2DEC_ANS_W = 4; // decimal answers (values ≤ 63 → ≤ 2 digits) + guard
  const DEC2BIN_ANS_W = 6; // binary answers (values ≤ 63 → ≤ 6 bits)

  function toBinaryString(n) { return (n >>> 0).toString(2); }

  // The powers of two present in n, high→low: 22 → [16, 4, 2].
  function binaryPowers(n) {
    const out = [];
    for (let p = 1; p <= n; p *= 2) { if (n & p) out.unshift(p); }
    return out;
  }

  function popcount(n) { let c = 0; let v = n >>> 0; while (v) { c += v & 1; v >>>= 1; } return c; }

  function nthBinValue(stage, index) {
    const hard = stage === "bin2dec" ? BIN2DEC_HARDCODED : DEC2BIN_HARDCODED;
    if (index < hard.length) return hard[index];
    const salt = stage === "dec2bin" ? 777 : 0;
    const rng = mulberry32((BIN_BOOKLET_SEED + Math.imul(index + salt, 2654435761)) >>> 0);
    // 41..63 (above 40, six-bit) with at least three 1-bits.
    let v = 41; let guard = 0;
    do { v = 41 + Math.floor(rng() * 23); guard += 1; } while (popcount(v) < 3 && guard < 60);
    return v;
  }

  function binDone() {
    return Array.isArray(state.binBookletDone) ? state.binBookletDone : [];
  }
  function binFirstUnfinished(done = binDone()) {
    return BIN_STAGES.find((s) => !done.includes(s)) || null;
  }

  // Opening the booklet: while any task is unfinished, land on the start of the
  // first unfinished one (a FRESH exercise — in-task progress is not resumed).
  // Once all three are done, open the read-only menu of the three tasks.
  // The plot continues (once) with the bits-range dialogue after the booklet is
  // finished. Navigate there and mark it seen so later booklet visits go to the
  // practice menu instead. `extra` carries any state to persist alongside.
  // The panel index of von Neumann's bits-range entrance (panel108) in the
  // arithmetic scene, and whether the learner is currently parked on a story
  // slide BEFORE it (e.g. after navigating back or returning via the chapters
  // menu). Used to resume the plot when the booklet is already finished.
  function bitsRangeEntranceIndex() {
    const scene = SCENES["arithmetic"];
    return scene ? scene.panels.findIndex((p) => p.image && p.image.includes("panel108_chapter_2_5_bits_1")) : -1;
  }
  function onSlideBeforeBitsRange() {
    const vn = bitsRangeEntranceIndex();
    return vn >= 0
      && state.screen === "story"
      && state.chapterId === "chapter-8"
      && state.sceneId === "arithmetic"
      && Number.isInteger(state.panelIndex)
      && state.panelIndex < vn;
  }
  // Set when the finished booklet is opened from a pre-entrance slide, so leaving
  // it resumes von Neumann's entrance (issue: booklet done but parked earlier).
  let bookletBeforeEntrance = false;
  // The arithmetic story slide the booklet was opened FROM, so leaving it returns
  // there (e.g. re-opening the finished booklet from the worktable returns to the
  // worktable — note still on the table — instead of the pre-note workshop slide).
  let bookletEntryPanelIndex = null;

  function goToBitsRange(extra = {}) {
    const scene = SCENES["arithmetic"];
    const vnIndex = scene ? scene.panels.findIndex((p) => p.image && p.image.includes("panel108_chapter_2_5_bits_1")) : -1;
    if (vnIndex < 0) return false;
    setState({
      ...transientUiClearPatch(),
      ...extra,
      bitsRangeSeen: true,
      screen: "story",
      chapterId: "chapter-8",
      sceneId: "arithmetic",
      panelIndex: vnIndex,
      started: true,
      replayNonce: state.replayNonce + 1,
      notebook: null
    }, true);
    return true;
  }

  function openBinaryBooklet() {
    // Remember which arithmetic slide the booklet was opened from, so leaving it
    // returns there (see binBackToWorkshop).
    bookletEntryPanelIndex = (state.screen === "story" && state.chapterId === "chapter-8"
      && state.sceneId === "arithmetic" && Number.isInteger(state.panelIndex))
      ? state.panelIndex : null;
    const done = binDone();
    if (!binFirstUnfinished(done)) {
      // All tasks done: play the bits-range dialogue the first time, otherwise
      // open the practice menu. If the learner opened the finished booklet from a
      // slide BEFORE von Neumann's entrance, remember it so leaving the booklet
      // resumes his entrance (rather than dropping back before it).
      if (!state.bitsRangeSeen && goToBitsRange()) return;
      bookletBeforeEntrance = onSlideBeforeBitsRange();
      setState({ screen: "notebook", notebook: { variant: "binary", mode: "menu" } });
      return;
    }
    bookletBeforeEntrance = false;
    const stage = binFirstUnfinished(done);
    const ex = freshBinExercise(stage, 0, 0);
    if (stage === "binadd") ex.dialog = "addintro";
    setState({ screen: "notebook", notebook: ex });
  }

  function freshBinExercise(stage, index, dec2binExplainCount) {
    const pair = stage === "binadd" ? nthBinAddPair(index) : null;
    const base = {
      variant: "binary",
      stage,
      exerciseIndex: index,
      value: stage === "binadd" ? (pair.a + pair.b) : nthBinValue(stage, index),
      addA: pair ? pair.a : null,
      addB: pair ? pair.b : null,
      cells: {},
      active: null,
      failCount: 0,
      hintUsed: false,
      dialog: null, // null | "correct" | "wrong" | "hints" | "walkthrough" | "addintro"
      hintIndex: 0,
      hintsSeen: 0,
      winPos: null,
      dec2binExplainCount: dec2binExplainCount || 0
    };
    // Pre-select the first answer cell so the learner can start typing at once.
    const layout = binLayout(base);
    base.active = `${layout.row},${layout.answerCols[0]}`;
    return base;
  }

  function binExpectedAnswer(nb) {
    if (nb.stage === "bin2dec") return String(nb.value);
    if (nb.stage === "binadd") return toBinaryString((nb.addA || 0) + (nb.addB || 0));
    return toBinaryString(nb.value);
  }

  // The pre-printed equation and the answer cells, on one row of the grid. The
  // answer sits just right of the "=", written left→right (most significant
  // digit first). Only these answer cells are checked.
  function binLayout(nb) {
    const fixed = {};
    const row = binEqRow(nb.stage);
    const answerCols = [];
    const expected = binExpectedAnswer(nb);
    let binStart = null;
    let binLen = 0;
    let ansStart = null;
    if (nb.stage === "binadd") {
      // Column addition, mirroring the library: a carry row, the two operands
      // (pre-printed), the addition line, and the answer row below it. Only the
      // answer bits are graded; the carry cells above are free scribble space.
      const carryRow = 2; const op1Row = 3; const op2Row = 4; const ansRow = 5;
      const a = nb.addA || 0; const b = nb.addB || 0;
      const aBits = toBinaryString(a); const bBits = toBinaryString(b); const sumBits = toBinaryString(a + b);
      const opLen = Math.max(aBits.length, bBits.length);
      const maxLen = Math.max(opLen, sumBits.length);
      const totalCols = maxLen + 3; // room for "+" and a gap on the left, "₂" on the right
      const startCol = Math.max(0, Math.floor((BIN_NB_COLS - totalCols) / 2));
      const unitsCol = startCol + 2 + maxLen - 1;
      const place = (bits, r) => { const s = String(bits); for (let i = 0; i < s.length; i++) fixed[`${r},${unitsCol - (s.length - 1) + i}`] = s[i]; };
      place(aBits, op1Row);
      place(bBits, op2Row);
      fixed[`${op2Row},${unitsCol - opLen}`] = "+"; // left of the wider operand's top bit
      // A "₂" subscript marks every number as binary (both operands and the sum).
      fixed[`${op1Row},${unitsCol + 1}`] = "₂";
      fixed[`${op2Row},${unitsCol + 1}`] = "₂";
      fixed[`${ansRow},${unitsCol + 1}`] = "₂";
      for (let i = 0; i < sumBits.length; i++) answerCols.push(unitsCol - (sumBits.length - 1) + i);
      ansStart = answerCols[0];
      const lineCols = [];
      for (let c = answerCols[0]; c <= unitsCol; c++) lineCols.push(c);
      return { fixed, row: ansRow, answerCols, expected, binStart: null, binLen: 0, ansStart,
        addRows: { carry: carryRow, op1: op1Row, op2: op2Row, answer: ansRow }, unitsCol, guardCol: answerCols[0] - 1, lineCols };
    }
    if (nb.stage === "bin2dec") {
      const bin = toBinaryString(nb.value);
      binLen = bin.length;
      // Exactly as many answer cells as the decimal answer has digits — no
      // guard cells to accidentally fill, and only those get tinted/graded.
      const w = String(nb.value).length;
      const total = bin.length + 1 /*₂*/ + 1 /*=*/ + w;
      let c = Math.max(0, Math.floor((BIN_NB_COLS - total) / 2));
      binStart = c;
      for (const ch of bin) fixed[`${row},${c++}`] = ch;
      fixed[`${row},${c++}`] = "₂";
      fixed[`${row},${c++}`] = "=";
      ansStart = c;
      for (let i = 0; i < w; i++) answerCols.push(c++);
    } else {
      const dec = String(nb.value);
      const w = DEC2BIN_ANS_W;
      const total = dec.length + 1 /*=*/ + w + 1 /*₂*/;
      let c = Math.max(0, Math.floor((BIN_NB_COLS - total) / 2));
      for (const ch of dec) fixed[`${row},${c++}`] = ch;
      fixed[`${row},${c++}`] = "=";
      ansStart = c;
      for (let i = 0; i < w; i++) answerCols.push(c++);
      fixed[`${row},${c++}`] = "₂";
    }
    return { fixed, row, answerCols, expected, binStart, binLen, ansStart };
  }

  function binFixedCells(nb) {
    return binLayout(nb).fixed;
  }
  function isLockedBinCell(nb, r, c) {
    return Object.prototype.hasOwnProperty.call(binFixedCells(nb), `${r},${c}`);
  }

  // Only the answer cells are graded: read left→right they must spell the
  // expected answer, and any answer cell past the answer must be empty (so the
  // digit count has to be right — the point of the dec→bin task).
  function binSolved(nb) {
    const layout = binLayout(nb);
    const { row, answerCols, expected } = layout;
    // Read the answer cells left→right, ignoring invisible characters (spaces):
    // a whitespace-only cell counts as empty. Only the answer cells are graded.
    const got = answerCols.map((c) => String(nb.cells?.[`${row},${c}`] || "").trim()).join("");
    if (got !== expected) return false;
    // Addition also guards against a stray leading bit to the left of the answer.
    if (layout.guardCol != null && String(nb.cells?.[`${row},${layout.guardCol}`] || "").trim() !== "") return false;
    return true;
  }
  function binClean(nb) {
    return (nb.failCount || 0) === 0 && !nb.hintUsed;
  }

  // Per-column breakdown of a binary addition (0 = units, low→high): the two
  // bits, the incoming carry, the sum (0..3), the bit written and the carry out.
  function binAddColumns(nb) {
    const a = nb.addA || 0; const b = nb.addB || 0;
    const n = toBinaryString(a + b).length;
    const cols = [];
    let carry = 0;
    for (let i = 0; i < n; i++) {
      const d1 = (a >> i) & 1; const d2 = (b >> i) & 1;
      const sum = d1 + d2 + carry;
      cols.push({ i, d1, d2, carryIn: carry, sum, digit: sum % 2, carryOut: sum >= 2 ? 1 : 0 });
      carry = sum >= 2 ? 1 : 0;
    }
    return cols;
  }

  // ---- hints -------------------------------------------------------------
  function binHintList(nb) {
    if (nb.stage === "binadd") {
      return [
        { title: "רמז 1", text: "מתחילים מהעמודה הימנית ביותר (עמודת האחדות) ומחברים את שני הביטים שבה, בדיוק כמו בחיבור בטור רגיל." },
        { title: "רמז 2", text: "בבינרי יש רק שתי ספרות, לכן נושאים כבר כשמגיעים ל-2. אם סכום העמודה הוא 2 (1 ועוד 1) כותבים 0 ונושאים 1 לעמודה הבאה; אם הסכום הוא 3 כותבים 1 ונושאים 1." },
        { title: "רמז 3", text: "ממשיכים עמודה־עמודה שמאלה, ובכל עמודה מוסיפים לסכום גם את הביט שנשאתם מהעמודה הקודמת." }
      ];
    }
    if (nb.stage === "bin2dec") {
      const powers = binaryPowers(nb.value);
      return [{
        title: "רמז",
        text: `כל ביט שדלוק (1) מייצג חזקה של 2 לפי מיקומו. כאן הביטים הדלוקים הם ${powers.join(" + ")}. חבר אותם כדי לקבל את המספר.`
      }];
    }
    return [
      { title: "רמז 1", text: "תנסה לחשוב כמה ספרות אתה צריך." },
      { title: "רמז 2", text: "כל ספרה משמעותית פי שתיים מהקודמת. תנסה לראות כמה משמעותית יכולה להיות הספרה השמאלית ועדיין להיכנס למספר. למשל, אם המספר הוא 10 אז 8 נכנס לתוכו אבל 16 לא." },
      { title: "רמז 3", text: "ברגע שמצאת את הספרה הכי משמעותית, אתה יכול להפחית את המשמעות שלה מהמספר ולעבוד עם מה שנשאר." }
    ];
  }
  function binUnlockedHints(nb) {
    return Math.min(binHintList(nb).length, Math.max(0, nb.failCount || 0));
  }
  function binSolutionAvailable(nb) {
    return (nb.failCount || 0) >= binHintList(nb).length + 1;
  }

  // ---- walkthroughs ------------------------------------------------------
  // Allow a light markup inside otherwise-escaped text: *bold*, and @[...] to
  // isolate a left-to-right math run so digits/operators keep their order
  // inside the surrounding right-to-left Hebrew.
  function binParagraphsHtml(text) {
    return String(text).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
      const safe = esc(p)
        .replace(/@\[([^\]]+)\]/g, '<span class="bin-ltr" dir="ltr">$1</span>')
        .replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
      return `<p>${safe}</p>`;
    }).join("");
  }

  function binBin2decWalkthrough(value) {
    const bin = toBinaryString(value);
    const places = [];
    for (let i = 0; i < bin.length; i++) places.unshift(Math.pow(2, i)); // high→low, aligned with bin
    const powers = binaryPowers(value);
    const perDigit = bin.split("").map((b, i) => `${b}×${places[i]}`).join("  ,  ");
    return [
      `נתרגם את *@[${bin}₂]* לכתיב עשרוני. כל ספרה (ביט) מייצגת חזקה של 2 לפי מיקומה — מימין לשמאל: @[${places.slice().reverse().join(", ")}].`,
      `מכפילים כל ביט במשמעות המקום שלו: @[${perDigit}].`,
      `נשארות רק החזקות של הביטים הדלוקים: *@[${powers.join(" + ")}]*.`,
      `לכן @[${bin}₂ = ${powers.join(" + ")} = ${value}].`
    ].join("\n\n");
  }

  // The two-method decimal→binary explanation, parameterised by the value.
  // First time: full prose for both methods. From the 2nd time: shortened,
  // focused on the operations themselves.
  function binDec2binWalkthrough(value, shorten) {
    const bin = toBinaryString(value);
    // Method 1 — greedy decomposition into powers of two.
    const parts = [];
    let rem = value;
    while (rem > 0) { let p = 1; while (p * 2 <= rem) p *= 2; parts.push(p); rem -= p; }
    const topPower = parts[0];
    const rawSteps = [];
    let acc = value;
    const shown = [];
    for (let k = 0; k < parts.length; k++) {
      shown.push(parts[k]);
      acc -= parts[k];
      const tail = acc > 0 ? ` + ${acc}` : "";
      rawSteps.push(`${value} = ${shown.join(" + ")}${tail}`);
    }
    // The final line repeats once the remainder is itself a power — drop dups.
    const decompSteps = rawSteps.filter((s, i) => i === 0 || s !== rawSteps[i - 1]);
    // Method 2 — parity / halving.
    const halveRows = [];
    let m = value;
    while (m > 0) { halveRows.push({ n: m, bit: m % 2 }); m = Math.floor(m / 2); }
    const parity = (value % 2 === 0) ? "זוגי" : "אי-זוגי";
    const units = value % 2;

    if (shorten) {
      return [
        `נזכיר בקצרה איך ממירים את @[${value}] לבינארי.`,
        `*שיטה א׳ (חזקות של 2):* @[${decompSteps[decompSteps.length - 1]}]. סימון החזקות שמופיעות נותן @[${value} = ${bin}₂].`,
        `*שיטה ב׳ (זוגיות וחלוקה):* ` + halveRows.map((r) => `@[${r.n}]${r.n % 2 === 0 ? "→0" : "→1"}`).join("  ,  ") + `. קוראים את הביטים מלמטה למעלה: *@[${bin}₂]*.`
      ].join("\n\n");
    }

    const method1 = [
      `*שיטה ראשונה — מהספרה המשמעותית ביותר:*`,
      `רושמים בצד את המשמעויות של הספרות: @[1, 2, 4, 8, 16, 32, ...] (חזקות של 2), וממשיכים עד שעוברים את המספר.`,
      `החזקה הגדולה ביותר של 2 שנכנסת לתוך @[${value}] היא @[${topPower}]. כותבים @[${decompSteps[0]}]. חוזרים על אותו תהליך עם מה שנשאר:`,
      decompSteps.map((s) => `@[${s}]`).join("\n"),
      `עכשיו כותבים @[1] בכל מקום שהחזקה שלו מופיעה בפירוק, ו-@[0] בכל מקום שלא. מקבלים @[${value} = ${bin}₂].`
    ].join("\n\n");

    const method2 = [
      `*שיטה שנייה — מספרת האחדות:*`,
      `המשמעות של כל הספרות פרט לספרת האחדות היא זוגית, לכן אם המספר זוגי ספרת האחדות היא @[0], ואם הוא אי-זוגי היא @[1].`,
      `@[${value}] הוא ${parity}, לכן ספרת האחדות היא @[${units}]. מפחיתים אותה ומחלקים ב-2, וחוזרים על התהליך עם התוצאה — כל פעם הזוגיות נותנת את הספרה הבאה:`,
      halveRows.map((r) => `@[${r.n}] → ${r.n % 2 === 0 ? "זוגי" : "אי-זוגי"} → @[${r.bit}]`).join("\n"),
      `קוראים את הביטים שהתקבלו מלמטה למעלה ומקבלים @[${value} = ${bin}₂].`
    ].join("\n\n");

    return [
      `נראה איך ממירים את @[${value}] מעשרוני לכתיב בינארי. יש שתי דרכים:`,
      method1,
      method2
    ].join("\n\n");
  }

  function binWalkthroughText(nb) {
    return nb.stage === "bin2dec"
      ? binBin2decWalkthrough(nb.value)
      : binDec2binWalkthrough(nb.value, (nb.dec2binExplainCount || 0) > 0);
  }

  function binTaskPrompt(nb) {
    if (nb.stage === "binadd") return "חבר את שני המספרים הבינריים:";
    return nb.stage === "bin2dec"
      ? "מהו הערך העשרוני של המספר הבינארי הבא?"
      : "כתוב את המספר הבא בכתיב בינארי:";
  }

  // ---- interactions ------------------------------------------------------
  function binSelectCell(r, c) {
    const nb = state.notebook;
    if (!nb || nb.dialog === "walkthrough" || isLockedBinCell(nb, r, c)) return;
    const dialog = nb.dialog === "wrong" ? null : nb.dialog;
    setState({ notebook: { ...nb, active: `${r},${c}`, dialog } }, false);
  }

  // Grid entry like the arithmetic notebook, plus an auto-advancing cursor:
  // typing a character moves the selection one cell to the right so a multi-
  // digit answer can be typed in a run (left→right). Backspace steps back.
  function handleBinaryNotebookKey(event) {
    const nb = state.notebook;
    // In the solution walkthrough the arrow keys step through it, like the story:
    // → goes back, ← / space advances (and finishes on the last step).
    if (nb && nb.dialog === "walkthrough") {
      if (event.key === "ArrowRight") { event.preventDefault(); binWalkStep(-1); return; }
      if (event.key === "ArrowLeft" || event.key === " ") { event.preventDefault(); binWalkAdvance(); return; }
      return;
    }
    if (!nb || nb.mode === "menu" || nb.dialog === "addintro") return;
    if (event.key === "Escape") {
      if (nb.active) { setState({ notebook: { ...nb, active: null } }, false); event.preventDefault(); }
      return;
    }
    if (event.key === "Enter") { checkBinaryNotebook(); event.preventDefault(); return; }
    const active = nb.active;
    if (!active) return;
    const [r, c] = active.split(",").map(Number);
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
      let nr = r, nc = c;
      if (event.key === "ArrowRight") nc = Math.min(BIN_NB_COLS - 1, c + 1);
      if (event.key === "ArrowLeft") nc = Math.max(0, c - 1);
      if (event.key === "ArrowUp") nr = Math.max(0, r - 1);
      if (event.key === "ArrowDown") nr = Math.min(BIN_NB_ROWS - 1, r + 1);
      setState({ notebook: { ...nb, active: `${nr},${nc}` } }, false);
      event.preventDefault();
      return;
    }
    const clearWrong = nb.dialog === "wrong" ? null : nb.dialog;
    if (event.key === "Backspace" || event.key === "Delete") {
      const cells = { ...nb.cells };
      let target = active, nc = c;
      if (!cells[active] && c > 0) { nc = c - 1; target = `${r},${nc}`; } // step back into the previous cell
      if (isLockedBinCell(nb, r, nc)) { event.preventDefault(); return; }
      delete cells[target];
      setState({ notebook: { ...nb, cells, active: target, dialog: clearWrong } }, false);
      event.preventDefault();
      return;
    }
    if (isLockedBinCell(nb, r, c)) return;
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const cells = { ...nb.cells };
      cells[active] = event.key;
      // The conversion answers are typed as one left→right run, so the cursor
      // auto-advances. Column addition is written per-column (carries above,
      // digits below), so there the cursor stays put and the learner clicks.
      const nc = nb.stage === "binadd" ? c : Math.min(BIN_NB_COLS - 1, c + 1);
      setState({ notebook: { ...nb, cells, active: `${r},${nc}`, dialog: clearWrong } }, false);
      event.preventDefault();
    }
  }

  function checkBinaryNotebook() {
    const nb = state.notebook;
    if (!nb || nb.mode === "menu" || nb.dialog === "walkthrough" || nb.dialog === "addintro") return;
    if (binSolved(nb)) { setState({ notebook: { ...nb, active: null, dialog: "correct" } }); return; }
    setState({ notebook: { ...nb, active: null, failCount: (nb.failCount || 0) + 1, dialog: "wrong" } });
  }


  // Dev shortcut (Ctrl+Shift+9): fill the answer cells correctly and check.
  function binSecretSolve() {
    const nb = state.notebook;
    if (!nb || nb.mode === "menu" || nb.dialog === "addintro") return;
    const { row, answerCols, expected } = binLayout(nb);
    const cells = { ...nb.cells };
    for (let i = 0; i < expected.length; i++) cells[`${row},${answerCols[i]}`] = expected[i];
    setState({ notebook: { ...nb, cells, active: null } }, false);
    checkBinaryNotebook();
  }

  function binRetry() {
    const nb = state.notebook;
    setState({ notebook: { ...nb, dialog: null } });
  }

  // The workshop is where the booklet lives, so the exit returns there
  // (panel107), not to the library.
  // Leaving via the footer keeps the booklet state so re-opening it resumes
  // (like the arithmetic notebook); finishing the whole booklet clears it so a
  // later visit starts fresh.
  function binBackToWorkshop(clearNotebook) {
    // If the finished booklet was opened from a slide before von Neumann's
    // entrance, leaving it resumes his entrance instead of returning to the
    // pre-entrance workshop slide.
    if (bookletBeforeEntrance && !binFirstUnfinished()) {
      bookletBeforeEntrance = false;
      if (goToBitsRange()) return;
    }
    bookletBeforeEntrance = false;
    // Return to the slide the booklet was opened from (e.g. the worktable, note
    // still on the table); fall back to the workshop slide if that is unknown.
    const returnPanel = Number.isInteger(bookletEntryPanelIndex) ? bookletEntryPanelIndex : 7;
    setState({
      ...transientUiClearPatch(),
      screen: "story",
      chapterId: "chapter-8",
      sceneId: "arithmetic",
      panelIndex: returnPanel,
      ...(clearNotebook ? { notebook: null } : {})
    }, true);
  }

  function binOpenHints() {
    const nb = state.notebook;
    const unlocked = binUnlockedHints(nb);
    if (unlocked <= 0 && !binSolutionAvailable(nb)) return;
    const solutionSlot = binHintList(nb).length;
    const hintIndex = binSolutionAvailable(nb) ? solutionSlot : unlocked - 1;
    setState({ notebook: { ...nb, dialog: "hints", hintIndex, hintUsed: true, hintsSeen: Math.max(nb.hintsSeen || 0, unlocked) } });
  }
  function binSelectHint(index) {
    const nb = state.notebook;
    const solutionSlot = binHintList(nb).length;
    const max = binSolutionAvailable(nb) ? solutionSlot : Math.max(0, binUnlockedHints(nb) - 1);
    setState({ notebook: { ...nb, hintIndex: Math.min(Math.max(0, index), max) } }, false);
  }
  function binCloseHints() {
    const nb = state.notebook;
    setState({ notebook: { ...nb, dialog: null } });
  }

  // The bin→dec solution, drawn step by step INTO the grid: each set bit's
  // place value is stacked over the answer's units column and highlighted (with
  // the matching bit), then everything is summed into the answer. Each step is
  // a full snapshot { text, cells, highlight } advanced by a "המשך" click.
  function binBin2decSolutionSteps(nb) {
    const layout = binLayout(nb);
    const row = layout.row;
    const B = toBinaryString(nb.value);
    const len = B.length;
    const binStart = layout.binStart;
    const ansStr = String(nb.value);
    const unitsCol = layout.ansStart + ansStr.length - 1;
    const steps = [];
    const cum = {};
    const contribCells = [];
    let writeRow = row - 1;
    let leftmostCol = unitsCol;
    for (let k = 0; k < len; k++) {
      const bit = B[len - 1 - k];
      const binCol = binStart + (len - 1 - k);
      const place = Math.pow(2, k);
      const placeName = k === 0 ? "האחדות" : `ה-${place}`;
      if (bit === "1") {
        const s = String(place);
        const startCol = unitsCol - s.length + 1;
        const written = [];
        for (let i = 0; i < s.length; i++) { const c = startCol + i; cum[`${writeRow},${c}`] = s[i]; written.push(`${writeRow},${c}`); }
        if (startCol < leftmostCol) leftmostCol = startCol;
        contribCells.push(...written);
        const text = k === 0
          ? `ביט האחדות הוא @[1]. הוא תורם @[${place}].`
          : `ביט ${placeName} הוא @[1]. זה תורם לנו @[${place}].`;
        steps.push({ text, cells: { ...cum }, highlight: [...written, `${row},${binCol}`] });
        writeRow -= 1;
      } else {
        const text = k === 0
          ? `ביט האחדות הוא @[0]. הוא לא תורם כלום.`
          : `ביט ${placeName} הוא @[0]. הוא לא תורם כלום.`;
        steps.push({ text, cells: { ...cum }, highlight: [`${row},${binCol}`] });
      }
    }
    const plusCol = Math.max(0, leftmostCol - 1);
    cum[`${row - 1},${plusCol}`] = "+";
    steps.push({ text: "עכשיו צריך לסכם הכל.", cells: { ...cum }, highlight: [...contribCells] });
    const ansCells = [];
    for (let i = 0; i < ansStr.length; i++) { const c = layout.ansStart + i; cum[`${row},${c}`] = ansStr[i]; ansCells.push(`${row},${c}`); }
    steps.push({ text: `מקבלים את התשובה: @[${ansStr}].`, cells: { ...cum }, highlight: ansCells });
    return steps;
  }

  // The dec→bin solution (method 1: powers of two), drawn entirely into the
  // grid: a column of the powers of 2 appears on the side; the largest that
  // fits is highlighted; the number is decomposed step by step into a chain of
  // equalities written one below the other (each new right-hand side
  // highlighted) so the series is seen building up; finally the binary answer
  // is written in. The first decomposition and the next two are spelled out
  // explicitly; only past that do we collapse the rest with "ממשיכים...".
  function binDec2binSolutionSteps(nb) {
    const layout = binLayout(nb);
    const row = layout.row;
    const V = nb.value;
    const bin = toBinaryString(V);
    const decStr = String(V);
    const total = decStr.length + 1 + DEC2BIN_ANS_W + 1;
    const startCol = Math.max(0, Math.floor((BIN_NB_COLS - total) / 2));
    const eqCol = startCol + decStr.length; // column of the equation's "="

    // Powers of two up to and including the first one past V.
    const powers = [];
    for (let p = 1; ; p *= 2) { powers.push(p); if (p > V) break; }
    const pUnitsCol = 2;
    const baseCells = {};
    const powerCells = {};
    for (let i = 0; i < powers.length; i++) {
      const s = String(powers[i]);
      const r = 1 + i;
      const startC = pUnitsCol - (s.length - 1);
      const list = [];
      for (let j = 0; j < s.length; j++) { const c = startC + j; baseCells[`${r},${c}`] = s[j]; list.push(`${r},${c}`); }
      powerCells[powers[i]] = list;
    }

    // Greedy decomposition into powers of two, as rows of terms. Each row i is
    // V = P0 + P1 + ... + Pi + Ri (Ri dropped once it is 0).
    const decompRows = [];
    {
      let rem = V;
      const chosenP = [];
      while (rem > 0) {
        let p = 1; while (p * 2 <= rem) p *= 2;
        chosenP.push(p);
        const newRem = rem - p;
        const terms = chosenP.map(String);
        if (newRem > 0) terms.push(String(newRem));
        decompRows.push({ terms, power: p });
        rem = newRem;
      }
    }
    // Drop the trailing duplicate row (when the remainder was itself a power).
    const rows = decompRows.filter((r, i) => i === 0 || r.terms.join(",") !== decompRows[i - 1].terms.join(","));
    const topPower = rows[0].power;
    const usedPowers = rows[rows.length - 1].terms.map(Number); // final decomposition = the powers

    // Which rows get their own line: the first decomposition, then ONE explicit
    // "same again" step, then "continue" straight to the final row.
    const shown = [{ rowIdx: 0, mode: "write" }];
    if (rows.length >= 2) shown.push({ rowIdx: 1, mode: "same" });
    if (rows.length >= 3) shown.push({ rowIdx: rows.length - 1, mode: "continue" });
    const isPow2 = (x) => x > 0 && (x & (x - 1)) === 0;

    // Place a chain equation (prefix + terms joined by "+") on a grid row;
    // return its cells and, per term, the cells that hold it.
    function placeRow(gridRow, sCol, prefix, terms) {
      const cells = {};
      const termCells = [];
      let c = sCol;
      for (const ch of prefix) { cells[`${gridRow},${c}`] = ch; c += 1; }
      for (let t = 0; t < terms.length; t++) {
        if (t > 0) { cells[`${gridRow},${c}`] = "+"; c += 1; }
        const tc = [];
        for (const ch of terms[t]) { cells[`${gridRow},${c}`] = ch; tc.push(`${gridRow},${c}`); c += 1; }
        termCells.push(tc);
      }
      return { cells, termCells, endCol: c - 1 };
    }
    const colOf = (key) => Number(key.split(",")[1]);

    const firstTime = (nb.dec2binExplainCount || 0) === 0;
    const steps = [];

    // ===== First presentation (first time only): the chain of equalities. =====
    if (firstTime) {
      steps.push({
        html: '<p>יש שתי דרכים להמיר מספר עשרוני לכתיב בינארי:</p>'
          + '<ol class="bin-methods"><li>להתחיל מהספרה המשמעותית ביותר.</li><li>להתחיל מהספרה הכי פחות משמעותית (ספרת האחדות).</li></ol>'
          + '<p>השיטה השנייה קלה יותר לביצוע אך מסובכת יותר להבנה.</p>',
        cells: {}, highlight: []
      });
      steps.push({
        text: "ראשית רושמים בצד את המשמעויות של הספרות — הן חזקות של 2: @[1, 2, 4, 8, 16, ...]. ממשיכים עד שעוברים את המספר.",
        cells: { ...baseCells }, highlight: []
      });
      steps.push({
        text: `החזקה הגדולה ביותר של 2 שנכנסת לתוך @[${V}] היא @[${topPower}].`,
        cells: { ...baseCells }, highlight: powerCells[topPower] || []
      });
      const cum = { ...baseCells };
      let gridRow = row + 1;
      let prevTermCells = null;
      for (let d = 0; d < shown.length; d++) {
        const { rowIdx, mode } = shown[d];
        const r = rows[rowIdx];
        const prefix = d === 0 ? `${decStr}=` : "=";
        const sCol = d === 0 ? startCol : eqCol;
        const placed = placeRow(gridRow, sCol, prefix, r.terms);
        Object.assign(cum, placed.cells);
        let text;
        let highlight;
        if (mode === "write") {
          const powCells = r.terms.filter((t) => isPow2(Number(t))).flatMap((t) => powerCells[Number(t)] || []);
          text = `אנו יכולים לכתוב את @[${V}] כך:`;
          highlight = [...powCells, ...placed.termCells.flat()];
        } else {
          const prevRow = rows[shown[d - 1].rowIdx];
          const decomposed = prevRow.terms[prevRow.terms.length - 1];
          text = mode === "same" ? `עושים את אותו הדבר עם @[${decomposed}].` : "ממשיכים כך עד שהמספר נגמר.";
          const commonLen = prevRow.terms.length - 1;
          const newTerms = r.terms.slice(commonLen);
          const powCells = newTerms.filter((t) => isPow2(Number(t))).flatMap((t) => powerCells[Number(t)] || []);
          const newStartCol = colOf(placed.termCells[commonLen][0]);
          const newPart = Object.keys(placed.cells).filter((k) => colOf(k) >= newStartCol);
          const prevLast = prevTermCells ? prevTermCells[prevTermCells.length - 1] : [];
          highlight = [...powCells, ...prevLast, ...newPart];
        }
        steps.push({ text, cells: { ...cum }, highlight });
        prevTermCells = placed.termCells;
        gridRow += 1;
      }
      steps.push({
        text: "כעת רואים אילו ספרות הן @[1] — אלה שהחזקה המתאימה שלהן מופיעה בפירוק — ואילו @[0] (אלה שלא מופיעות).",
        cells: { ...cum }, highlight: usedPowers.flatMap((p) => powerCells[p] || [])
      });
      const ansCells = [];
      const withAns = { ...cum };
      for (let i = 0; i < bin.length; i++) { const c = layout.ansStart + i; withAns[`${row},${c}`] = bin[i]; ansCells.push(`${row},${c}`); }
      steps.push({ text: "נקבל את הפתרון.", cells: withAns, highlight: ansCells });
    }

    // ===== The column (בטור) form — shown every time; the board is cleared
    // back to the exercise and the powers list, then the subtraction is written
    // straight down: the largest power that fits is subtracted repeatedly. =====
    const colUnits = startCol + decStr.length - 1; // align the column under the decimal
    const colMinus = colUnits - 2;
    const put = (cells, gr, n) => {
      const s = String(n); const out = [];
      for (let i = 0; i < s.length; i++) { const c = colUnits - s.length + 1 + i; cells[`${gr},${c}`] = s[i]; out.push(`${gr},${c}`); }
      return out;
    };
    const hlineRow = (gr) => { const out = []; for (let c = colMinus; c <= colUnits; c++) out.push(`${gr},${c}`); return out; };
    const subs = [];
    { let m = V; while (m > 0) { let p = 1; while (p * 2 <= m) p *= 2; subs.push({ power: p, result: m - p }); m -= p; } }

    const colCum = { ...baseCells };
    const colUnderlines = [];
    // The equation's own number is the minuend — start the subtractions right
    // below it instead of re-writing it.
    let cr = row + 1;
    steps.push({
      text: firstTime ? "אפשר לכתוב את זה גם בטור." : "שיטה ראשונה",
      cells: { ...colCum }, highlight: [], underline: []
    });
    const allSubCells = [];
    for (let i = 0; i < subs.length; i++) {
      const { power, result } = subs[i];
      const subRow = cr; cr += 1;
      const resRow = cr; cr += 1;
      const pcells = put(colCum, subRow, power);
      allSubCells.push(...pcells);
      if (i < 2) {
        steps.push({
          text: `חזקת השתיים הגדולה ביותר שנכנסת ${i === 0 ? "היא" : "עכשיו היא"} @[${power}].`,
          cells: { ...colCum }, highlight: [...(powerCells[power] || []), ...pcells], underline: [...colUnderlines]
        });
        colCum[`${subRow},${colMinus}`] = "-";
        const rcells = put(colCum, resRow, result);
        colUnderlines.push(...hlineRow(subRow));
        steps.push({ text: "מפחיתים.", cells: { ...colCum }, highlight: rcells, underline: [...colUnderlines] });
      } else {
        colCum[`${subRow},${colMinus}`] = "-";
        put(colCum, resRow, result);
        colUnderlines.push(...hlineRow(subRow));
      }
    }
    if (subs.length > 2) {
      steps.push({ text: "ממשיכים כך עד שהמספר נגמר.", cells: { ...colCum }, highlight: [], underline: [...colUnderlines] });
    }
    steps.push({
      text: "בודקים אילו חזקות של 2 השתתפו.",
      cells: { ...colCum }, highlight: [...allSubCells, ...usedPowers.flatMap((p) => powerCells[p] || [])], underline: [...colUnderlines]
    });
    const colAnsCells = [];
    const colWithAns = { ...colCum };
    for (let i = 0; i < bin.length; i++) { const c = layout.ansStart + i; colWithAns[`${row},${c}`] = bin[i]; colAnsCells.push(`${row},${c}`); }
    steps.push({ text: "ומקבלים את התוצאה.", cells: colWithAns, highlight: colAnsCells, underline: [...colUnderlines] });

    // ===== Second method (first time only): parity / halving. The board is
    // cleared to just the exercise; the units bit is read off the number's
    // parity, the units digit is subtracted and the number halved, and this
    // repeats — each parity giving the next bit, written right→left. =====
    if (firstTime) {
      const numUnits = startCol + decStr.length - 1;
      const putN = (cells, gr, n) => {
        const s = String(n); const out = [];
        for (let i = 0; i < s.length; i++) { const c = numUnits - s.length + 1 + i; cells[`${gr},${c}`] = s[i]; out.push(`${gr},${c}`); }
        return out;
      };
      const m2 = {};
      let nr = row + 1;
      let bj = 0; // answer bit index, 0 = units (rightmost)
      const allAnsCells = [];
      const writeBit = (val) => { const c = layout.ansStart + (bin.length - 1 - bj); m2[`${row},${c}`] = String(val); bj += 1; allAnsCells.push(`${row},${c}`); return `${row},${c}`; };

      steps.push({ text: "נעבור לשיטה השנייה.", cells: {}, highlight: [] });
      steps.push({ text: "בשיטה הבינרית (כמו גם בעשרונית) אם המספר זוגי אז ביט האחדות הוא @[0], ואם הוא אי-זוגי אז ביט האחדות הוא @[1].", cells: {}, highlight: [] });
      steps.push({ text: "זאת מכיוון שכל הספרות חוץ מביט האחדות מסמלות מספרים זוגיים.", cells: {}, highlight: [] });
      steps.push({ text: "כך קל לזהות את ביט האחדות.", cells: {}, highlight: [] });

      const bV = V % 2;
      const bcellV = writeBit(bV);
      steps.push({ text: `במקרה שלנו ביט האחדות הוא @[${bV}].`, cells: { ...m2 }, highlight: [bcellV] });

      const even0 = V - bV;
      const cEven0 = putN(m2, nr, even0); nr += 1;
      steps.push({ text: "נפחית את ביט האחדות.", cells: { ...m2 }, highlight: cEven0 });
      steps.push({ text: "זהו מספר זוגי, לכן בכתב בינרי הוא מסתיים ב-@[0] — בדיוק כמו שבשיטה העשרונית מספר שמתחלק ב-10 מסתיים ב-@[0].", cells: { ...m2 }, highlight: [] });
      steps.push({ text: `אם נחלק את המספר ב-2 יימחק ה-@[0] מהסוף. לכן מספיק לתרגם את @[${even0}/2] לבינרי ולהוסיף @[0] מימין. כדי לקבל את @[${V}] נוסיף @[1] במקום ה-@[0].`, cells: { ...m2 }, highlight: [] });

      const half0 = even0 / 2;
      const cHalf0 = putN(m2, nr, half0); nr += 1;
      steps.push({ text: `לכן די לתרגם את @[${half0} = ${even0}/2].`, cells: { ...m2 }, highlight: cHalf0 });
      steps.push({ text: `את התרגום של @[${half0}] אפשר לעשות באותו אופן.`, cells: { ...m2 }, highlight: [] });

      const bH = half0 % 2;
      const bcellH = writeBit(bH);
      steps.push({ text: "מוצאים את ביט האחדות.", cells: { ...m2 }, highlight: [bcellH] });
      let n = half0;
      if (n % 2 === 1) { n -= 1; const e = putN(m2, nr, n); nr += 1; steps.push({ text: "מפחיתים במידת הצורך.", cells: { ...m2 }, highlight: e }); }
      else { steps.push({ text: "המספר זוגי, לכן אין צורך להפחית.", cells: { ...m2 }, highlight: [] }); }
      const half1 = n / 2;
      const cHalf1 = putN(m2, nr, half1); nr += 1;
      steps.push({ text: "מחלקים ב-2.", cells: { ...m2 }, highlight: cHalf1 });

      let m = half1;
      while (m > 0) {
        writeBit(m % 2);
        if (m % 2 === 1) { m -= 1; putN(m2, nr, m); nr += 1; }
        if (m === 0) break;
        m /= 2; putN(m2, nr, m); nr += 1;
      }
      steps.push({ text: "וממשיכים עד שהמספר נגמר. מקבלים שוב את אותה התשובה.", cells: { ...m2 }, highlight: allAnsCells });
    } else {
      // Compact second method for later presentations: find the units digit
      // from the parity, subtract it if needed, halve, and repeat — two
      // explicit digit cycles, then continue with the remainder.
      const numUnits = startCol + decStr.length - 1;
      const putN = (cells, gr, n) => {
        const s = String(n); const out = [];
        for (let i = 0; i < s.length; i++) { const c = numUnits - s.length + 1 + i; cells[`${gr},${c}`] = s[i]; out.push(`${gr},${c}`); }
        return out;
      };
      const m2 = {};
      let nr = row + 1;
      let bj = 0;
      const allAnsCells = [];
      const writeBit = (val) => { const c = layout.ansStart + (bin.length - 1 - bj); m2[`${row},${c}`] = String(val); bj += 1; allAnsCells.push(`${row},${c}`); return `${row},${c}`; };

      steps.push({ text: "שיטה שניה", cells: {}, highlight: [] });

      let m = V;
      for (let cyc = 0; cyc < 2 && m > 0; cyc++) {
        const bc = writeBit(m % 2);
        steps.push({ text: cyc === 0 ? "מוצאים את ספרת האחדות." : "מוצאים את הספרה הבאה.", cells: { ...m2 }, highlight: [bc] });
        if (m % 2 === 1) { m -= 1; const rc = putN(m2, nr, m); nr += 1; steps.push({ text: "מפחיתים.", cells: { ...m2 }, highlight: rc }); }
        m /= 2; const dc = putN(m2, nr, m); nr += 1; steps.push({ text: "מחלקים ב-2.", cells: { ...m2 }, highlight: dc });
      }
      while (m > 0) {
        writeBit(m % 2);
        if (m % 2 === 1) { m -= 1; putN(m2, nr, m); nr += 1; }
        if (m === 0) break;
        m /= 2; putN(m2, nr, m); nr += 1;
      }
      steps.push({ text: "וממשיכים הלאה.", cells: { ...m2 }, highlight: allAnsCells });
    }

    return steps;
  }

  // The addition solution, played inside the grid: column by column, right→left,
  // writing each answer bit and carrying 1 above the next column when the
  // column's bits sum to 2 or more.
  function binBinaddSolutionSteps(nb) {
    const layout = binLayout(nb);
    const { addRows, unitsCol, answerCols, row, fixed } = layout;
    const cols = binAddColumns(nb);
    const n = cols.length;
    const cum = {};
    const steps = [];
    const opKey = (rr, i) => `${rr},${unitsCol - i}`;
    const carryKey = (i) => `${addRows.carry},${unitsCol - i}`;
    const ansKey = (i) => `${row},${unitsCol - i}`;

    steps.push({ text: "נחבר עמודה־עמודה, מימין לשמאל — בדיוק כמו בחיבור עשרוני, רק שנושאים כשמגיעים ל-2.", cells: {}, highlight: [] });

    for (let i = 0; i < n; i++) {
      const col = cols[i];
      const hl = [];
      if (fixed[opKey(addRows.op1, i)] != null) hl.push(opKey(addRows.op1, i));
      if (fixed[opKey(addRows.op2, i)] != null) hl.push(opKey(addRows.op2, i));
      if (col.carryIn > 0) hl.push(carryKey(i));
      cum[ansKey(i)] = String(col.digit);
      if (col.carryOut > 0 && i < n - 1) cum[carryKey(i + 1)] = "1";

      let msg;
      if (i === 0) msg = `בעמודה הימנית ביותר מחברים @[${col.d1} + ${col.d2} = ${col.sum}].`;
      else if (col.carryIn > 0) msg = `בעמודה הבאה: @[${col.d1} + ${col.d2}], ועוד @[${col.carryIn}] שנשאנו — סך הכל @[${col.sum}].`;
      else msg = `בעמודה הבאה: @[${col.d1} + ${col.d2} = ${col.sum}].`;
      if (col.sum >= 2) {
        msg += (i < n - 1)
          ? ` מכיוון שהסכום הוא @[2] או יותר, כותבים @[${col.digit}] ונושאים @[1] לעמודה הבאה.`
          : ` כותבים @[${col.digit}], וה-@[1] שנשאנו הוא הביט השמאלי ביותר של התשובה.`;
      } else {
        msg += ` כותבים @[${col.digit}].`;
      }

      const stepHl = [...hl, ansKey(i)];
      if (col.carryOut > 0 && i < n - 1) stepHl.push(carryKey(i + 1));
      steps.push({ text: msg, cells: { ...cum }, highlight: stepHl });
    }
    steps.push({ text: "וקיבלנו את הסכום בכתיב בינרי.", cells: { ...cum }, highlight: answerCols.map((c) => `${row},${c}`) });
    return steps;
  }

  function binSolutionSteps(nb) {
    if (nb.stage === "binadd") return binBinaddSolutionSteps(nb);
    return nb.stage === "bin2dec" ? binBin2decSolutionSteps(nb) : binDec2binSolutionSteps(nb);
  }

  // The solution now always plays inside the grid (both directions).
  function binInGridSolution(nb) {
    return Boolean(nb && nb.dialog === "walkthrough");
  }

  function binOpenWalkthrough() {
    const nb = state.notebook;
    // Seeing a conversion/addition solution unlocks its חשבון menu button.
    if (["bin2dec", "dec2bin", "binadd"].includes(nb.stage)) unlockExplanation(`arith-${nb.stage}`, { silent: true });
    // Opening the walkthrough from a failed attempt counts as using help.
    const hintUsed = nb.dialog === "wrong" ? true : nb.hintUsed;
    setState({ notebook: { ...nb, dialog: "walkthrough", hintUsed, walkStep: 0 } });
  }

  function binWalkStep(delta) {
    const nb = state.notebook;
    if (!nb) return;
    const steps = binSolutionSteps(nb);
    const next = Math.min(Math.max(0, (nb.walkStep || 0) + delta), steps.length - 1);
    setState({ notebook: { ...nb, walkStep: next } });
  }

  // A plain click anywhere during the solution advances it, exactly like the
  // "המשך" button (and finishes on the last step).
  function binWalkAdvance() {
    const nb = state.notebook;
    if (!nb) return;
    const steps = binSolutionSteps(nb);
    if ((nb.walkStep || 0) >= steps.length - 1) binWalkthroughFinish();
    else binWalkStep(1);
  }

  // The walkthrough always ends by moving on: a clean solve advances to the
  // next stage (or leaves the booklet), any help/mistake gives another
  // exercise of the same kind.
  function binWalkthroughFinish() {
    const nb = state.notebook;
    const clean = binClean(nb);
    // Finishing the walkthrough is the end of that stage's solution explanation →
    // announce its unlock now (no-op on a replay / if it was never opened).
    if (["bin2dec", "dec2bin", "binadd"].includes(nb.stage)) announceExplanationUnlock(`arith-${nb.stage}`);
    // A sample opened from the explanations menu returns there when done — it is a
    // demonstration, so it earns no calculation achievement.
    if (nb.fromExplanations) { setState({ screen: "explanations", notebook: null }, false); return; }
    // A clean solve (no mistakes, no hint) is a correct-on-the-first-try
    // calculation → "מחשב מדויק".
    if (clean) unlockAchievement("precise-calc");
    // Practising a task from the menu (once everything is done): a single pass,
    // then straight back to the menu regardless of help/mistakes. Reaching here
    // means the task was solved, so record the menu re-solve (→ "מחשב יסודי" /
    // "מחשב יסודי מאוד" via syncAchievements).
    if (nb.fromMenu) {
      const resolved = Array.isArray(state.binMenuResolved) ? state.binMenuResolved : [];
      if (!resolved.includes(nb.stage)) state.binMenuResolved = [...resolved, nb.stage];
      openBinMenu();
      return;
    }
    if (!clean) {
      const nextCount = nb.stage === "dec2bin" ? (nb.dec2binExplainCount || 0) + 1 : (nb.dec2binExplainCount || 0);
      setState({ notebook: freshBinExercise(nb.stage, (nb.exerciseIndex || 0) + 1, nextCount) });
      return;
    }
    // A clean solve completes the task: record it and move to the next unfinished
    // one — or leave the booklet once all three are done (the next visit shows
    // the menu). Solving the stage's very first exercise cleanly (no earlier
    // practice run) counts as first-try for "מחשב יסודי ומדויק".
    const firstTryClean = Array.isArray(state.binFirstTryClean) ? state.binFirstTryClean : [];
    const nextFirstTryClean = ((nb.exerciseIndex || 0) === 0 && !firstTryClean.includes(nb.stage))
      ? [...firstTryClean, nb.stage]
      : firstTryClean;
    const done = binDone().includes(nb.stage) ? binDone() : [...binDone(), nb.stage];
    const next = binFirstUnfinished(done);
    if (!next) {
      // First time all booklet tasks are done: continue the plot with the
      // bits-range dialogue instead of opening the practice menu (later booklet
      // visits land on the menu — see openBinaryBooklet).
      if (!state.bitsRangeSeen && goToBitsRange({ binBookletDone: done, binFirstTryClean: nextFirstTryClean })) return;
      setState({ binBookletDone: done, binFirstTryClean: nextFirstTryClean, notebook: { variant: "binary", mode: "menu" } });
      return;
    }
    const ex = freshBinExercise(next, 0, next === "dec2bin" ? (nb.dec2binExplainCount || 0) : 0);
    if (next === "binadd") ex.dialog = "addintro";
    setState({ binBookletDone: done, binFirstTryClean: nextFirstTryClean, notebook: ex });
  }

  // The read-only menu of the three tasks, shown once all are done.
  function openBinMenu() {
    setState({ notebook: { variant: "binary", mode: "menu" } });
  }
  function binMenuSelect(stage) {
    if (!BIN_STAGES.includes(stage)) return;
    const ex = freshBinExercise(stage, 0, 0);
    ex.fromMenu = true;
    setState({ notebook: ex });
  }
  // The fourth menu choice: the library's decimal column-addition notebook, but
  // exiting to the warehouse and returning to this menu when done.
  function binMenuReviewDecimal() {
    const nb = freshNotebook(0);
    nb.reviewFromBooklet = true;
    setState({ notebook: nb });
  }
  function binAddIntroOk() {
    const nb = state.notebook;
    if (!nb) return;
    setState({ notebook: { ...nb, dialog: null } });
  }

  // The task menu shown once all three booklet tasks are done: a notebook-
  // looking page (the squared grid, read-only) with the three tasks as choices.
  const BIN_MENU_TITLES = [
    { stage: "bin2dec", label: "המרה מכתיב בינרי לכתיב עשרוני" },
    { stage: "dec2bin", label: "המרה מכתיב עשרוני לכתיב בינרי" },
    { stage: "binadd", label: "חיבור בינרי" }
  ];
  function renderBinaryMenu(nb) {
    const rows = [];
    for (let r = 0; r < BIN_NB_ROWS; r++) {
      let cells = "";
      for (let c = 0; c < BIN_NB_COLS; c++) cells += '<div class="notebook-cell"></div>';
      rows.push(`<div class="notebook-row">${cells}</div>`);
    }
    const list = BIN_MENU_TITLES.map((t) =>
      `<button class="bin-menu-item" data-action="binbk-menu-select" data-stage="${t.stage}" type="button">${esc(t.label)}</button>`).join("");
    // A fourth choice below a rule: revisit the library's decimal column addition.
    const review = '<button class="bin-menu-item" data-action="binbk-menu-review" type="button">חזרה על חיבור מספרים עשרוניים</button>';
    app.innerHTML = `
      ${topbar()}
      <main class="screen notebook-screen">
        <div class="bin-prompt">בחר תרגול</div>
        <div class="notebook-page bin-notebook-page bin-menu-page">
          ${rows.join("")}
          <div class="bin-menu">
            ${list}
            <div class="bin-menu-rule" aria-hidden="true"></div>
            ${review}
          </div>
        </div>
        <div class="notebook-footer">
          <div class="notebook-actions">
            <button class="btn" data-action="binbk-back" type="button">חזרה למחסן</button>
          </div>
        </div>
      </main>`;
  }

  function renderBinaryNotebook() {
    const nb = state.notebook || {};
    if (nb.mode === "menu") return renderBinaryMenu(nb);
    const layout = binLayout(nb);
    const { fixed, row, answerCols } = layout;
    const answerSet = new Set(answerCols.map((c) => `${row},${c}`));

    // While the bin→dec solution plays, the grid shows the walkthrough's own
    // cells and highlights instead of the learner's scribbles.
    const inGrid = binInGridSolution(nb);
    let displayCells = nb.cells || {};
    let highlightSet = new Set();
    let underlineSet = new Set();
    // The addition line sits under the second operand (drawn always, not just in
    // the walkthrough), like the library's column-addition line.
    if (nb.stage === "binadd" && layout.lineCols) {
      layout.lineCols.forEach((c) => underlineSet.add(`${layout.addRows.op2},${c}`));
    }
    let steps = null;
    let stepIndex = 0;
    if (inGrid) {
      steps = binSolutionSteps(nb);
      stepIndex = Math.min(Math.max(0, nb.walkStep || 0), steps.length - 1);
      displayCells = steps[stepIndex].cells;
      highlightSet = new Set(steps[stepIndex].highlight);
      (steps[stepIndex].underline || []).forEach((k) => underlineSet.add(k));
    }

    const rows = [];
    for (let r = 0; r < BIN_NB_ROWS; r++) {
      let cells = "";
      for (let c = 0; c < BIN_NB_COLS; c++) {
        const key = `${r},${c}`;
        const fx = fixed[key];
        const char = fx != null ? fx : (displayCells[key] || "");
        const classes = ["notebook-cell"];
        if (fx != null) classes.push("notebook-cell-fixed");
        if (!inGrid && nb.active === key) classes.push("notebook-cell-active");
        if (answerSet.has(key)) classes.push("notebook-cell-answer", "bin-answer-cell");
        if (highlightSet.has(key)) classes.push("bin-hl");
        if (underlineSet.has(key)) classes.push("bin-hline");
        const lock = fx != null ? ' aria-disabled="true"' : "";
        cells += `<button type="button" class="${classes.join(" ")}" data-action="binbk-cell" data-r="${r}" data-c="${c}"${lock}>${esc(char)}</button>`;
      }
      rows.push(`<div class="notebook-row">${cells}</div>`);
    }

    let footer;
    if (inGrid) {
      const step = steps[stepIndex];
      const isLast = stepIndex >= steps.length - 1;
      // Arrow nav like the main story: ← advances (and finishes on the last
      // step), → goes back; the keyboard arrows do the same (see the key handler).
      const prev = stepIndex > 0 ? navButton("binbk-walk-prev", "arrow-right", "הקודם") : "";
      const nextLabel = isLast ? (binClean(nb) ? "המשך" : "תרגיל נוסף") : "המשך";
      const nextAction = isLast ? "binbk-walk-finish" : "binbk-walk-next";
      const capBody = step.html ? step.html : binParagraphsHtml(step.text);
      footer = `
        <div class="bin-solution-caption">${capBody}</div>
        <div class="notebook-actions">
          ${prev}
          ${navButton(nextAction, "arrow-left", nextLabel, { primary: true })}
        </div>`;
    } else {
      const unlocked = binUnlockedHints(nb);
      const showHintBtn = unlocked > 0 || binSolutionAvailable(nb);
      const hintFresh = (nb.hintsSeen || 0) < unlocked;
      const hintLabel = binSolutionAvailable(nb) ? "פתרון" : ((nb.hintsSeen || 0) === 0 ? "רוצה רמז?" : "רוצה עוד רמז?");
      const hintButton = showHintBtn
        ? `<button class="btn hint-btn ${hintFresh ? "hint-btn-ready" : "hint-btn-seen"}" data-action="binbk-hints-open" type="button">${esc(hintLabel)}</button>`
        : "";
      footer = nb.dialog === "walkthrough" ? "" : `
        <div class="notebook-actions">
          <button class="btn btn-primary" data-action="binbk-check" type="button">בדיקה</button>
          ${hintButton}
          <button class="btn" data-action="binbk-back" type="button">חזרה למחסן</button>
        </div>`;
    }

    app.innerHTML = `
      ${topbar()}
      <main class="screen notebook-screen">
        <div class="bin-prompt">${esc(binTaskPrompt(nb))}</div>
        <div class="notebook-page bin-notebook-page">${rows.join("")}</div>
        <div class="notebook-footer">${footer}</div>
        ${inGrid ? "" : renderBinaryDialog(nb)}
      </main>`;
  }

  function renderBinaryDialog(nb) {
    const dialog = nb.dialog;
    if (!dialog) return "";
    if (dialog === "hints") return renderBinaryHints(nb);
    if (dialog === "walkthrough") return renderBinaryWalkthrough(nb);
    if (dialog === "addintro") {
      const body = binParagraphsHtml("אפשר לעשות חשבון עם מספרים הכתובים בשיטה הבינרית בדיוק כמו שעושים חשבון עם מספרים הכתובים בשיטה העשרונית. זה אפילו יותר פשוט כי יש פחות ספרות. בוא תנסה.");
      return notebookWindow(nb, "חיבור בינרי", body, '<button class="btn btn-primary" data-action="binbk-addintro-ok" type="button">בוא נתחיל</button>');
    }
    let title = "";
    let body = "";
    let actions = "";
    if (dialog === "correct") {
      title = "יפה מאוד!";
      body = "<p>כל הכבוד! פתרת נכון. עכשיו נעבור על ההסבר.</p>";
      actions = '<button class="btn btn-primary" data-action="binbk-walk-open" type="button">הצגת הסבר</button>';
    } else if (dialog === "wrong") {
      title = "בדיקה";
      body = (nb.failCount || 0) <= 1 ? "<p>הפתרון שגוי.</p>" : "<p>הפתרון עדיין שגוי.</p>";
      actions = '<button class="btn btn-primary" data-action="binbk-retry" type="button">נסה שוב</button>'
        + (binSolutionAvailable(nb) ? '<button class="btn" data-action="binbk-walk-open" type="button">רוצה לראות את הפתרון</button>' : "");
    }
    return notebookWindow(nb, title, body, actions);
  }

  function renderBinaryHints(nb) {
    const hints = binHintList(nb);
    const unlocked = binUnlockedHints(nb);
    const solutionOffered = binSolutionAvailable(nb);
    if (unlocked <= 0 && !solutionOffered) return "";
    const solutionSlot = hints.length;
    const selected = Math.min(Math.max(0, nb.hintIndex || 0), solutionOffered ? solutionSlot : Math.max(0, unlocked - 1));
    const onSolution = solutionOffered && selected === solutionSlot;
    const items = hints.slice(0, unlocked).map((hint, index) => `
      <button class="hint-list-item ${index === selected ? "hint-list-item-active" : ""}" data-action="binbk-hint-select" data-hint-index="${index}" type="button">${esc(hint.title)}</button>`).join("");
    const solutionItem = solutionOffered
      ? `<button class="hint-list-item hint-solution-item ${onSolution ? "hint-list-item-active" : ""}" data-action="binbk-hint-select" data-hint-index="${solutionSlot}" type="button">פתרון</button>`
      : "";
    const content = onSolution
      ? '<p>אפשר לראות את הפתרון המלא של התרגיל.</p><button class="btn btn-primary" data-action="binbk-walk-open" type="button">הצג פתרון</button>'
      : `<p>${esc((hints[selected] || {}).text || "")}</p>`;
    const body = `
      <div class="hint-layout">
        <nav class="hint-list" aria-label="רשימת רמזים">${items}${solutionItem}</nav>
        <div class="hint-content">${content}</div>
      </div>`;
    return notebookWindow(nb, "רמזים", body, '<button class="btn" data-action="binbk-hint-close" type="button">סגור</button>');
  }

  function renderBinaryWalkthrough(nb) {
    const body = binParagraphsHtml(binWalkthroughText(nb));
    const clean = binClean(nb);
    const label = clean ? "המשך" : "תרגיל נוסף";
    const actions = `<button class="btn btn-primary" data-action="binbk-walk-finish" type="button">${esc(label)}</button>`;
    const title = nb.stage === "bin2dec" ? "המרה לעשרוני" : "המרה לבינארי";
    return notebookWindow(nb, title, `<div class="bin-walkthrough">${body}</div>`, actions);
  }

  function render() {
    syncExplanationUnlocks();
    syncAchievements();
    // Play the unlock flourishes after this render paints (so the target buttons
    // exist and are laid out). The flying icons live on <body>, so the next
    // render does not wipe them mid-animation.
    if (explanationUnlockAnimationPending) {
      explanationUnlockAnimationPending = false;
      requestAnimationFrame(playExplanationUnlockAnimation);
    }
    if (achievementUnlockAnimationPending) {
      const achId = achievementUnlockAnimationPending;
      achievementUnlockAnimationPending = null;
      requestAnimationFrame(() => playAchievementUnlockAnimation(achId));
    }
    if (state.hintSlides) return renderHintSlides();
    if (state.screen === "menu") return renderMenu();
    if (state.screen === "explanations") return renderExplanationsMenu();
    if (state.screen === "about") return renderAbout();
    if (state.screen === "achievements") return renderAchievements();
    if (state.screen === "notReady") return renderNotReady();
    if (state.screen === "settings") return renderSettings();
    if (state.screen === "myCards") return renderMyCards();
    if (state.screen === "chapters") return renderChapters();
    if (state.screen === "nandBuildHelp") return renderNandBuildHelpScreen();
    if (state.screen === "notebook") return state.notebook?.variant === "binary" ? renderBinaryNotebook() : renderNotebook();

    if (state.screen === "workspace") {
      renderWorkspace();
      if (workspaceAccidentActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='workspace-accident-ok']")?.focus());
      } else if (workspaceBuildHelpPromptActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='build-help-later']")?.focus());
      } else if (workspaceUnderstoodPromptActive()) {
        requestAnimationFrame(() => app.querySelector("[data-action='understood-yes']")?.focus());
      }
      if (workspaceNandMonologueActive()) {
        requestAnimationFrame(positionWorkspaceNandMonologue);
      }
      // Focus the pin-width picker when it opens, so clicking elsewhere blurs it
      // (and closes it via focusout).
      if (state.cardCreation && state.cardCreation.pinEdit) {
        requestAnimationFrame(() => app.querySelector("[data-card-pin-width]")?.focus());
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
    } else {
      // Session 1: the "how Nand is built" enrichment teaser now appears at the
      // END of the Nand monologue (see advanceNandMonologue), a moment before
      // leaving the workbench — not on open. So start with it already dismissed
      // and with no persistent build-help button during the observe phase.
      workspace.helpPromptSeen = true;
      workspace.buildHelpButtonVisible = false;
    }

    // The Nand intro story just ended (the workbench is opening) → announce the
    // "הצגת ה־Nand" explanation now, at the end of that intro.
    if (state.chapterId === "chapter-4") announceExplanationUnlock("nand-intro");

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

    // Leaving a story panel that offered an enrichment explanation (via a red
    // corner link) is the moment its flourish fires if the learner ignored it —
    // the "declined" case. If they opened and read it, it was already announced
    // when they closed the reading, so this is a no-op then.
    if (state.screen === "story") {
      const leaving = currentPanel();
      if (leaving && leaving.unlocksExplanation) announceExplanationUnlock(leaving.unlocksExplanation);
    }

    const scene = currentScene();
    if (isWorkspaceLaunchPoint()) return openWorkspace();

    // At the end of von Neumann's monologue (the Fermi "here are your tasks"
    // slide), "המשך" leads to the NEXT-tasks worktable — a separate panel that
    // looks like the worktable but whose note lists Dmux4way / Mux4way16. The
    // original worktable (reached by replaying the chapter) keeps its own note.
    if (state.screen === "story" && isMonologueEndPanel(currentPanel())) {
      const nextWorktable = panelIndexByImage(scene, "panel99g_chapter_2_4_worktable_next.svg");
      if (nextWorktable >= 0) {
        return setState({ panelIndex: nextWorktable, started: true, replayNonce: state.replayNonce + 1, dialog: null }, true);
      }
    }

    if (shouldShowPostTasksXorHint()) return openPostTasksXorHintSlides();

    if (state.panelIndex < scene.panels.length - 1) {
      return setState({ panelIndex: state.panelIndex + 1, started: true, replayNonce: state.replayNonce + 1, dialog: null, panelAnswer: null }, true);
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
      return setState({ panelIndex: state.panelIndex - 1, started: true, replayNonce: state.replayNonce + 1, dialog: null, panelAnswer: null }, true);
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
    // At the end-of-monologue teaser (session 1), "לא כרגע" leaves the workbench.
    if (buildTeaserAtMonologueEnd()) return exitWorkbenchAfterBuildTeaser();
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
    // Capture the card's position BEFORE it is removed, to animate it being
    // "sucked" into the "הבנת?" button that now appears.
    const card = app.querySelector(".workspace-understood-card");
    const fromRect = card ? card.getBoundingClientRect() : null;
    const workspace = normalizeWorkspace(state.workspace);
    workspace.understoodPromptShown = false;
    workspace.understoodButtonVisible = true;
    workspace.selectedTerminal = null;
    // Unlocked silently — the "new explanation" flourish plays at the END of the
    // Nand monologue, not here.
    unlockExplanation("nand-function", { silent: true });
    setState({ workspace }, false);
    if (fromRect) requestAnimationFrame(() => playUnderstoodSuckAnimation(fromRect));
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
      // Preserve where this Nand session must return to (e.g. chapter 2.3),
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

    // Replaying the Nand monologue from the final warehouse must not reuse the
    // previous workbench state. Start from the same clean workbench as the
    // first Nand workbench visit, with the "הבנת?" button already available.
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

    // Session 1: offer the "how Nand is built" enrichment as the last beat —
    // show the build-help teaser now, right before leaving the workbench,
    // instead of exiting immediately. helpPromptSeen=false makes the teaser
    // active; workspaceCompleted=true marks this as the end-of-monologue teaser
    // (so "לא כרגע" / "חזרה למשחק" leave the workbench rather than dismiss).
    if (workspace.workspaceSession !== 2) {
      workspace.helpPromptSeen = false;
      workspace.buildHelpButtonVisible = false;
      // The Nand monologue just ended → announce the "איך Nand פועל" explanation.
      announceExplanationUnlock("nand-function");
      return setState({ workspace }, false);
    }

    const target = secondWorkspaceExitTarget();
    setState({
      ...target,
      replayNonce: state.replayNonce + 1,
      workspace
    }, true);
  }

  // Leave the session-1 Nand workbench after the end-of-monologue enrichment
  // teaser (its "לא כרגע", or "חזרה למשחק" from the build-help screen), continuing
  // the chapter-4 story where the monologue would have exited.
  function exitWorkbenchAfterBuildTeaser() {
    const workspace = normalizeWorkspace(state.workspace);
    workspace.helpPromptSeen = true;
    workspace.buildHelpButtonVisible = false;
    workspace.selectedTerminal = null;
    // Leaving the build-help teaser (declined "לא כרגע", or after closing the
    // build-help screen) → announce the "איך עושים Nand" explanation now.
    announceExplanationUnlock("build-nand");
    setState({
      ...firstWorkspaceExitTarget(),
      replayNonce: state.replayNonce + 1,
      workspace
    }, true);
  }

  // True while the end-of-monologue enrichment teaser (or its build-help screen)
  // is showing on the session-1 Nand workbench.
  function buildTeaserAtMonologueEnd() {
    return Boolean(state.workspace?.workspaceCompleted) && state.workspace?.workspaceSession !== 2;
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
      // Arith cards put sum (lamp-1) at the bottom and carry (lamp-2) on top;
      // the DMux keeps output 1 on top.
      if (isArithTask(taskId)) {
        return [
          { id: "lamp-1", type: "lamp", x: 940, y: 358 },
          { id: "lamp-2", type: "lamp", x: 940, y: 158 }
        ];
      }
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

  // --- DMUX scratch truth table: 4 rows, columns control/data/out1/out2. Shares
  // the same state.muxTable storage and cell-cycling as the MUX table.
  const DMUX_TABLE_COLUMNS = ["control", "data", "out1", "out2"];

  function createEmptyDmuxTable() {
    return Array.from({ length: 4 }, () => ({ control: null, data: null, out1: null, out2: null }));
  }

  // A DMUX row (inputs = [data, control]; outputs = [out1, out2]) as shown.
  function dmuxRowDisplay(row) {
    return {
      control: row.inputs[1] ? 1 : 0,
      data: row.inputs[0] ? 1 : 0,
      out1: row.outputs[0] ? 1 : 0,
      out2: row.outputs[1] ? 1 : 0
    };
  }

  function dmuxTableWithInputs(withOutputs) {
    const rows = taskDefById("DMux")?.rows || [];
    return rows.map((row) => {
      const d = dmuxRowDisplay(row);
      return { control: d.control, data: d.data, out1: withOutputs ? d.out1 : null, out2: withOutputs ? d.out2 : null };
    });
  }

  function dmuxCheckDisplayTable(rowIndex) {
    const snap = Array.isArray(muxTableSnapshot) && muxTableSnapshot.length === 4
      ? muxTableSnapshot.map((row) => ({ ...row }))
      : createEmptyDmuxTable();
    const row = taskDefById("DMux")?.rows?.[rowIndex];
    if (row) snap[rowIndex] = dmuxRowDisplay(row);
    return snap;
  }

  // The scratch-table shape for the current task (MUX or DMUX), or null.
  function scratchTableSpec() {
    const taskId = state.workspace?.taskId;
    if (taskId === "Mux") return { columns: MUX_TABLE_COLUMNS, count: 8, empty: createEmptyMuxTable };
    if (taskId === "DMux") return { columns: DMUX_TABLE_COLUMNS, count: 4, empty: createEmptyDmuxTable };
    if (isArithTask(taskId)) return { columns: arithScratchColumns(taskId), count: arithScratchRowCount(taskId), empty: () => arithEmptyScratchTable(taskId) };
    return null;
  }

  function handleMuxTruthCell(rowIndex, column) {
    const spec = scratchTableSpec();
    if (!spec) return;
    if (!spec.columns.includes(column)) return;
    if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= spec.count) return;
    const current = Array.isArray(state.muxTable) && state.muxTable.length === spec.count ? state.muxTable : spec.empty();
    const table = current.map((row) => ({ ...row }));
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
    const taskId = state.solutionDialog?.taskId;
    if (taskId !== "Mux" && taskId !== "DMux") return;
    const step = Number(state.solutionDialog.step) || 0;
    const workspace = solutionWorkspaceForTask(taskId, step);
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
    ["generic", "compact", "dmux"].forEach((key) => {
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
    if (result === "failure") {
      // Remember that this card's test has failed at least once, so a later
      // success no longer counts as "built correctly on the first try".
      if (taskId) {
        const failed = Array.isArray(state.tasksFailedOnce) ? state.tasksFailedOnce : [];
        if (!failed.includes(taskId)) patch.tasksFailedOnce = [...failed, taskId];
      }
      if (taskHasHints(taskId)) patch.hintState = recordHintFailure(taskId);
    } else if (result === "success" && taskId && !taskCompleted(taskId)
        && !(Array.isArray(state.tasksFailedOnce) ? state.tasksFailedOnce : []).includes(taskId)) {
      // First-ever pass of this card with no earlier failed test → "מהנדס מדויק".
      unlockAchievement("precise-engineer");
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
      ...(task.id === "Mux" ? { muxTable: muxCheckDisplayTable(rowIndex) } : {}),
      ...(task.id === "DMux" ? { muxTable: dmuxCheckDisplayTable(rowIndex) } : {})
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
    if (isMultibitTaskWorkspace()) return startMultibitTaskTest();
    if (isBusTaskWorkspace()) return startBusTaskTest();
    clearNotTestTimer();
    notTestSnapshot = clonePlain(state.workspace);
    muxTableSnapshot = Array.isArray(state.muxTable) ? state.muxTable.map((row) => ({ ...row })) : null;
    const testWorkspace = cleanedWorkspaceForTaskTest(state.workspace);
    runNotTestRow(testWorkspace, 0);
  }

  // --- Chapter 2.4 bus-task check ------------------------------------------
  // No truth table: a handful of input patterns per task, picked once at random
  // and then frozen. Each is the bit-vector fed into the single input bus.
  const BUS_TEST_CASES = {
    Not4: [
      [true, false, true, true],
      [false, true, false, false],
      [true, true, false, true],
      [false, false, true, false],
      [true, false, false, true]
    ],
    // A few frozen random 16-bit patterns (0/1 spelled out for readability).
    Not16: [
      [1,0,1,1, 0,0,1,0, 1,1,0,0, 0,1,0,1].map(Boolean),
      [0,1,0,0, 1,1,1,0, 0,0,1,1, 1,0,1,0].map(Boolean),
      [1,1,0,1, 0,1,0,0, 1,0,1,1, 0,0,1,0].map(Boolean),
      [0,0,1,0, 1,0,1,1, 0,1,1,0, 1,1,0,1].map(Boolean)
    ],
    // A 2-input task: each case is [inputA, inputB], each a 4-bit bus.
    AND4: [
      [[1,0,1,1].map(Boolean), [1,1,0,1].map(Boolean)],
      [[0,1,1,0].map(Boolean), [1,1,1,0].map(Boolean)],
      [[1,1,0,0].map(Boolean), [0,1,0,1].map(Boolean)],
      [[0,0,1,1].map(Boolean), [1,0,1,1].map(Boolean)],
      [[1,0,0,1].map(Boolean), [1,1,1,1].map(Boolean)]
    ],
    // OR4: 2 input buses of width 4.
    OR4: [
      [[1,0,1,0].map(Boolean), [0,0,1,1].map(Boolean)],
      [[0,1,0,0].map(Boolean), [1,0,0,1].map(Boolean)],
      [[1,1,0,0].map(Boolean), [0,0,0,1].map(Boolean)],
      [[0,0,1,0].map(Boolean), [0,1,1,0].map(Boolean)],
      [[1,0,0,0].map(Boolean), [0,0,0,0].map(Boolean)]
    ],
    // 2 input buses of width 16.
    AND16: [
      [[1,0,1,1,0,0,1,0,1,1,0,0,0,1,0,1].map(Boolean), [1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0].map(Boolean)],
      [[0,1,1,0,1,1,1,0,0,0,1,1,1,0,1,0].map(Boolean), [1,1,0,0,0,1,1,1,1,0,1,1,0,1,0,1].map(Boolean)],
      [[1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,1].map(Boolean), [0,1,0,1,1,1,0,0,1,1,1,0,0,0,1,1].map(Boolean)]
    ],
    // MUX: each case is [data1, data2, [control]] — control is a single bit.
    MUX4: [
      [[1,0,1,1].map(Boolean), [0,1,0,1].map(Boolean), [false]],
      [[1,0,1,1].map(Boolean), [0,1,0,1].map(Boolean), [true]],
      [[0,1,1,0].map(Boolean), [1,1,0,1].map(Boolean), [true]],
      [[1,1,0,0].map(Boolean), [0,0,1,1].map(Boolean), [false]]
    ],
    MUX16: [
      [[1,0,1,1,0,0,1,0,1,1,0,0,0,1,0,1].map(Boolean), [1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0].map(Boolean), [false]],
      [[1,0,1,1,0,0,1,0,1,1,0,0,0,1,0,1].map(Boolean), [1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0].map(Boolean), [true]],
      [[0,1,1,0,1,1,1,0,0,0,1,1,1,0,1,0].map(Boolean), [1,1,0,0,0,1,1,1,1,0,1,1,0,1,0,1].map(Boolean), [true]]
    ]
  };

  function busTaskCases(taskId) {
    return BUS_TEST_CASES[taskId] || [];
  }

  // The input buses of a test case as an array (one entry per card input). A
  // single-input task stores the bus bare; a multi-input task stores an array.
  function caseInputBuses(def, testCase) {
    return (def.inputs || 1) > 1 ? testCase : [testCase];
  }

  // The expected output bus, componentwise per the task's op over the inputs.
  // A MUX task's last input is a single shared control bit (data buses are the
  // rest): output[i] = op(data…[i], control).
  function busTaskExpected(def, buses) {
    if (def.control) {
      const dataBuses = buses.slice(0, -1);
      const control = buses[buses.length - 1][0];
      return Array.from({ length: def.width }, (_, i) => Boolean(taskOutput(def.op, [...dataBuses.map((b) => b[i]), control])));
    }
    return Array.from({ length: def.width }, (_, i) => Boolean(taskOutput(def.op, buses.map((bus) => bus[i]))));
  }

  // While a bus check runs, the case currently under test as a truth-table row
  // (the input buses + expected output bus); null when no bus check is active.
  function busCheckDisplayRow() {
    if (!state.notTest?.active && !state.notTest?.result) return null;
    const def = busTaskDefById(state.notTest?.taskId);
    if (!def) return null;
    const testCase = busTaskCases(def.id)[state.notTest?.rowIndex];
    if (!testCase) return null;
    const buses = caseInputBuses(def, testCase);
    return { inputs: buses, outputs: busTaskExpected(def, buses) };
  }

  // Assemble the check circuit for one input case. The learner's circuit inside
  // the card is kept, together with the pre-placed voltage source; the card is
  // then wrapped in a splitter harness — a merging splitter driven by that one
  // source (wired to the legs of the 1-bits) feeds the input bus, and a
  // splitting splitter fans the output bus out to one lamp per bit.
  function busTestHarnessWorkspace(baseWorkspace, def, buses) {
    const workspace = normalizeWorkspace(clonePlain(baseWorkspace));
    workspace.selectedTerminal = null;
    workspace.accident = null;
    workspace.focusedComponentId = null;
    // Keep ALL of the learner's components. (The bus circuits are large — four
    // gates barely fit the card frame — so filtering by a frame rectangle would
    // silently drop legitimate components placed near or past the edge and fail
    // a correct solution. Stray components not on the signal path are harmless.)
    // The pre-placed source drives every input; drop anything the learner wired
    // to it so the check controls it.
    workspace.wires = workspace.wires.filter((wire) => wire.a !== "source-1.out" && wire.b !== "source-1.out");
    removeInvalidWires(workspace);

    const width = def.width;
    // Input side: each DATA input bus gets a mirrored splitter (legs = individual
    // bits) fed by the single pre-placed source (a leg with no source is a 0
    // bit); a single-bit input (the MUX control) is wired straight from the
    // source. Each merging splitter is `w` legs tall, so wide data inputs
    // (AND16/MUX16) spread far apart in y — running off-screen is fine.
    const numData = buses.filter((_, j) => pinWidth(workspace, `task-card-1.inputExt${j + 1}`) > 1).length;
    let dataIdx = 0;
    buses.forEach((bits, j) => {
      const inputRef = `task-card-1.inputExt${j + 1}`;
      const w = pinWidth(workspace, inputRef);
      if (!Number.isInteger(w)) return;
      if (w === 1) {
        if (bits[0]) workspace.wires.push(normalizeWire("source-1.out", inputRef));
        return;
      }
      const splitId = `bus-in-split-${j}`;
      const splitHalfH = ((w - 1) * 34) / 2 + 13;
      const inSep = Math.max(180, splitHalfH * 2 + 30);
      const sy = 288 + (dataIdx - (numData - 1) / 2) * inSep;
      dataIdx += 1;
      workspace.components.push({ id: splitId, type: "splitter", x: 230, y: sy, mirrored: true, outputs: w, width: 1 });
      bits.forEach((bit, i) => {
        if (bit) workspace.wires.push(normalizeWire("source-1.out", `${splitId}.leg${i}`));
      });
      workspace.wires.push(normalizeWire(`${splitId}.single`, inputRef));
    });

    // Output side: an unmirrored splitter (single = input) at the card's output
    // pin fans the output bus out to one lamp per bit.
    const outSplit = { id: "bus-out-split", type: "splitter", x: 1050, y: 288, mirrored: false, outputs: width, width: 1 };
    workspace.components.push(outSplit);
    workspace.wires.push(normalizeWire("task-card-1.outputExt", "bus-out-split.single"));
    const layout = busLampLayout(width, outSplit.y, 1180);
    for (let i = 0; i < width; i += 1) {
      const lampId = `bus-out-lamp-${i}`;
      const lamp = { id: lampId, type: "lamp", x: layout.positions[i].x, y: layout.positions[i].y };
      if (layout.scale !== 1) lamp.scale = layout.scale;
      workspace.components.push(lamp);
      workspace.wires.push(normalizeWire(`bus-out-split.leg${i}`, `${lampId}.in`));
    }
    return workspace;
  }

  // Where (and at what scale) the check's output lamps sit. Lamp i reads output
  // leg i, so — like every bus component — lamp 0 sits at the BOTTOM and they
  // count upward. A narrow bus gets a few full-size lamps spread down the board;
  // a wide bus (16) gets a dense column of small lamps aligned with the legs.
  function busLampLayout(width, centerY, x) {
    if (width <= 6) {
      const spacing = 133;
      return { scale: 1, positions: Array.from({ length: width }, (_, i) => ({ x, y: Math.round(centerY + ((width - 1) / 2 - i) * spacing) })) };
    }
    return { scale: 0.32, positions: splitterOutputYs(width).map((dy) => ({ x, y: centerY + dy })) };
  }

  function runBusTestCase(baseWorkspace, caseIndex) {
    const def = busTaskDefById(baseWorkspace.taskId);
    if (!def) return showNotTestResult("failure", baseWorkspace, null);
    const cases = busTaskCases(def.id);
    if (caseIndex >= cases.length) return showNotTestResult("success", baseWorkspace, def.id);

    const buses = caseInputBuses(def, cases[caseIndex]);
    const workspace = busTestHarnessWorkspace(baseWorkspace, def, buses);
    setState({ workspace, notTest: { active: true, taskId: def.id, rowIndex: caseIndex } }, false);

    notTestTimer = window.setTimeout(() => {
      const evaluation = evaluateWorkspaceBits(workspace);
      const expected = busTaskExpected(def, buses);
      const ok = expected.every((bit, i) => Boolean(evaluation.lamps.get(`bus-out-lamp-${i}`)) === Boolean(bit));
      if (!ok) return showNotTestResult("failure", workspace, def.id);
      // Harness the NEXT case from the pristine learner circuit, not from this
      // already-harnessed workspace — otherwise each case re-wraps the previous
      // harness and duplicate splitters/lamps pile up on the board.
      runBusTestCase(baseWorkspace, caseIndex + 1);
    }, 850);
  }

  function startBusTaskTest() {
    if (!isBusTaskWorkspace() || notTestActive()) return;
    clearNotTestTimer();
    notTestSnapshot = clonePlain(state.workspace);
    muxTableSnapshot = null;
    runBusTestCase(state.workspace, 0);
  }

  // --- Chapter 2.5 multi-bit routing check (Dmux4way / Mux4way16) -----------
  // Each case drives every external input pin and reads every external output
  // pin. A control value v (0..3) maps to the bus bits [v&1 (LSB), v>>1 (MSB)],
  // so "01" (v=1) selects the second output/input, "10" (v=2) the third, etc.,
  // matching the requirement text.
  function multibitTaskCases(taskId) {
    if (taskId === "Dmux4way") {
      // Data=1 across all four control values (each lights exactly one output),
      // plus a data=0 sanity case (all outputs stay 0).
      const cases = [0, 1, 2, 3].map((control) => ({ data: 1, control }));
      cases.push({ data: 0, control: 2 });
      return cases;
    }
    if (taskId === "Mux4way16") {
      // Four distinct frozen 16-bit patterns; each control value must select the
      // matching data input.
      const P = [
        [1,0,1,1, 0,0,1,0, 1,1,0,0, 0,1,0,1],
        [0,1,0,0, 1,1,1,0, 0,0,1,1, 1,0,1,0],
        [1,1,0,1, 0,1,0,0, 1,0,1,1, 0,0,1,0],
        [0,0,1,0, 1,0,1,1, 0,1,1,0, 1,1,0,1]
      ].map((a) => a.map(Boolean));
      return [0, 1, 2, 3].map((control) => ({ datas: P, control }));
    }
    if (taskId === "Add4") {
      // (a, b, carry-in) cases exercising 0, carry ripple, and full overflow.
      return [
        { a: 0, b: 0, cin: 0 },
        { a: 5, b: 3, cin: 0 },
        { a: 7, b: 8, cin: 0 },
        { a: 9, b: 6, cin: 1 },
        { a: 12, b: 3, cin: 1 },
        { a: 15, b: 15, cin: 1 }
      ];
    }
    if (taskId === "Add16") {
      // (a, b) pairs exercising 0, a plain sum, a carry rippling between the
      // 4-bit chunks, and full 16-bit overflow (the discarded 17th digit).
      return [
        { a: 0, b: 0 },
        { a: 1234, b: 5678 },
        { a: 4095, b: 1 },       // 0x0FFF + 1 -> carry from the units chunk
        { a: 40000, b: 25535 },  // = 65535, all ones
        { a: 65535, b: 1 },      // overflow -> 0 (drop the leading carry)
        { a: 65535, b: 65535 }   // = 131070, keep only the low 16 bits
      ];
    }
    return [];
  }

  // A 4-bit bus as [LSB, …, MSB] booleans (leg0 = LSB = units digit, leg3 = MSB).
  // Little-endian to match BOTH the splitter's terminal geometry (leg0 is the
  // bottom leg) and the requirements text ("the bottom bit is the units digit"),
  // so the units adder wires to leg0 at the bottom with no crossing.
  function add4Bits(n) {
    return [n & 1, (n >> 1) & 1, (n >> 2) & 1, (n >> 3) & 1].map(Boolean);
  }

  // A 16-bit bus as [LSB, …, MSB] booleans (little-endian, same convention as
  // add4Bits): bit 0 is the units digit, bit 15 the most significant.
  function add16Bits(n) {
    return Array.from({ length: 16 }, (_, i) => Boolean((n >> i) & 1));
  }

  // The input drives and expected output bits for one case, keyed by external
  // pin ref. control -> the 2-bit bus [LSB, MSB].
  function multibitCaseSpec(taskId, testCase) {
    const controlBits = [Boolean(testCase.control & 1), Boolean((testCase.control >> 1) & 1)];
    if (taskId === "Dmux4way") {
      const data = Boolean(testCase.data);
      return {
        inputs: [
          { ref: "inputExt1", bits: [data] },
          { ref: "inputExt2", bits: controlBits }
        ],
        outputs: [1, 2, 3, 4].map((n) => ({
          ref: `outputExt${n}`,
          expected: [(n - 1) === testCase.control ? data : false]
        }))
      };
    }
    if (taskId === "Mux4way16") {
      return {
        inputs: [
          ...testCase.datas.map((bits, i) => ({ ref: `inputExt${i + 1}`, bits })),
          { ref: "inputExt5", bits: controlBits }
        ],
        outputs: [{ ref: "outputExt", expected: testCase.datas[testCase.control] }]
      };
    }
    if (taskId === "Add4") {
      const total = testCase.a + testCase.b + testCase.cin; // 0..31
      return {
        inputs: [
          { ref: "inputExt1", bits: add4Bits(testCase.a) },
          { ref: "inputExt2", bits: add4Bits(testCase.b) },
          { ref: "inputExt3", bits: [Boolean(testCase.cin)] }
        ],
        outputs: [
          { ref: "outputExt1", expected: [Boolean((total >> 4) & 1)] }, // carry-out (leading digit)
          { ref: "outputExt2", expected: add4Bits(total & 15) }         // the 4 sum digits
        ]
      };
    }
    if (taskId === "Add16") {
      const total = (testCase.a + testCase.b) & 0xffff; // drop the 17th digit (final carry)
      return {
        inputs: [
          { ref: "inputExt1", bits: add16Bits(testCase.a) },
          { ref: "inputExt2", bits: add16Bits(testCase.b) }
        ],
        outputs: [
          { ref: "outputExt1", expected: add16Bits(total) }
        ]
      };
    }
    return { inputs: [], outputs: [] };
  }

  // Wrap the learner's card in a check harness: every external input pin is
  // driven from the single pre-placed source (single-bit direct, wider via a
  // merging splitter whose high legs are wired to the source), and every
  // external output pin is read into lamps (single-bit → one lamp, wider →
  // a fan-out splitter to one lamp per bit). Returns { workspace, lampGroups }
  // where lampGroups[outIndex][bitIndex] is a lamp id.
  function multibitTestHarnessWorkspace(baseWorkspace, spec) {
    const workspace = normalizeWorkspace(clonePlain(baseWorkspace));
    workspace.selectedTerminal = null;
    workspace.accident = null;
    workspace.focusedComponentId = null;
    workspace.wires = workspace.wires.filter((wire) => wire.a !== "source-1.out" && wire.b !== "source-1.out");
    removeInvalidWires(workspace);

    // Inputs down the left side. The control bus (the input that pokes out the
    // top of the card) gets its merging splitter placed HIGH, level with the
    // control pin, above every data splitter. Data splitters are stacked
    // downward with enough vertical room that their legs never overlap — wide
    // 16-bit buses run very tall, so running off-screen is fine.
    const frameDef = WORKSPACE_COMPONENT_DEFS[taskCardComponentType(baseWorkspace.taskId)] || { pins: {} };
    // Arithmetic adder cards (Add4/Add16 …): their multi-bit buses carry NUMBERS,
    // so the check drives each numeric input from a dec→bin converter (showing the
    // addend) and reads each numeric output into a bin→dec converter (showing the
    // result) INSTEAD of a source/lamp fan-out. The carry bit and any other single
    // bit still use the plain source/lamp path.
    const useConverters = isArithBusTask(baseWorkspace.taskId);
    const bitsToDecimal = (bits) => bits.reduce((n, b, i) => n + (b ? 2 ** i : 0), 0);
    const controlIdx = spec.inputs.findIndex((input) => {
      const p = frameDef.pins[input.ref];
      return p && p.y < -150;
    });
    let stackTop = 100; // top of the next data splitter's leg span (below the control)
    let convInY = 120;  // stacked y for numeric-input converters
    spec.inputs.forEach((input, idx) => {
      const ref = `task-card-1.${input.ref}`;
      const w = pinWidth(workspace, ref);
      if (!Number.isInteger(w)) return;
      if (w === 1) {
        if (input.bits[0]) workspace.wires.push(normalizeWire("source-1.out", ref));
        return;
      }
      if (useConverters) {
        // A dec→bin converter set to the addend value, feeding the card input.
        const convId = `mb-in-conv-${idx}`;
        workspace.components.push({ id: convId, type: "converter-out", x: 200, y: convInY, value: bitsToDecimal(input.bits), width: w });
        workspace.wires.push(normalizeWire(`${convId}.out`, ref));
        convInY += 160;
        return;
      }
      const splitId = `mb-in-split-${idx}`;
      const halfH = ((w - 1) * 34) / 2 + 13;
      let sy;
      if (idx === controlIdx) {
        const cp = frameDef.pins[input.ref];
        sy = 288 + (cp ? cp.y : -250); // level with the control pin, up top
      } else {
        sy = stackTop + halfH;          // splitter centre = top + half its height
        stackTop = sy + halfH + 40;     // next data splitter clears this one's legs
      }
      workspace.components.push({ id: splitId, type: "splitter", x: 210, y: sy, mirrored: true, outputs: w, width: 1 });
      input.bits.forEach((bit, i) => {
        if (bit) workspace.wires.push(normalizeWire("source-1.out", `${splitId}.leg${i}`));
      });
      workspace.wires.push(normalizeWire(`${splitId}.single`, ref));
    });

    // Outputs down the right side. `outChecks` records how each output is
    // verified: a bin→dec converter's decimal value (numeric arith buses) or a
    // group of lamps (single bits and non-arith buses).
    const lampGroups = [];
    const outChecks = [];
    spec.outputs.forEach((output, idx) => {
      const ref = `task-card-1.${output.ref}`;
      const w = pinWidth(workspace, ref);
      const cy = 288 + (idx - (spec.outputs.length - 1) / 2) * 133;
      if (useConverters && Number.isInteger(w) && w > 1) {
        // A bin→dec converter displaying the numeric result of this output bus.
        const convId = `mb-out-conv-${idx}`;
        workspace.components.push({ id: convId, type: "converter-in", x: 1120, y: cy, width: w });
        workspace.wires.push(normalizeWire(ref, `${convId}.in`));
        lampGroups.push([]);
        outChecks.push({ kind: "converter", converterId: convId, expected: bitsToDecimal(output.expected) });
        return;
      }
      const groupLamps = [];
      if (!Number.isInteger(w) || w === 1) {
        const lampId = `mb-out-${idx}-lamp-0`;
        workspace.components.push({ id: lampId, type: "lamp", x: 1180, y: cy });
        workspace.wires.push(normalizeWire(ref, `${lampId}.in`));
        groupLamps.push(lampId);
      } else {
        const outSplit = { id: `mb-out-split-${idx}`, type: "splitter", x: 1050, y: cy, mirrored: false, outputs: w, width: 1 };
        workspace.components.push(outSplit);
        workspace.wires.push(normalizeWire(ref, `${outSplit.id}.single`));
        const layout = busLampLayout(w, cy, 1180);
        for (let i = 0; i < w; i += 1) {
          const lampId = `mb-out-${idx}-lamp-${i}`;
          const lamp = { id: lampId, type: "lamp", x: layout.positions[i].x, y: layout.positions[i].y };
          if (layout.scale !== 1) lamp.scale = layout.scale;
          workspace.components.push(lamp);
          workspace.wires.push(normalizeWire(`${outSplit.id}.leg${i}`, `${lampId}.in`));
          groupLamps.push(lampId);
        }
      }
      lampGroups.push(groupLamps);
      outChecks.push({ kind: "lamp", lamps: groupLamps, expected: output.expected });
    });
    return { workspace, lampGroups, outChecks };
  }

  function runMultibitTestCase(baseWorkspace, caseIndex) {
    const def = multibitTaskDefById(baseWorkspace.taskId);
    if (!def) return showNotTestResult("failure", baseWorkspace, null);
    const cases = multibitTaskCases(def.id);
    if (caseIndex >= cases.length) return showNotTestResult("success", baseWorkspace, def.id);

    const spec = multibitCaseSpec(def.id, cases[caseIndex]);
    const { workspace, outChecks } = multibitTestHarnessWorkspace(baseWorkspace, spec);
    setState({ workspace, notTest: { active: true, taskId: def.id, rowIndex: caseIndex } }, false);

    notTestTimer = window.setTimeout(() => {
      const evaluation = evaluateWorkspaceBits(workspace);
      // A numeric output passes when its bin→dec converter shows the expected
      // decimal; a lamp output passes bit-for-bit.
      const ok = outChecks.every((chk) => {
        if (chk.kind === "converter") {
          const info = evaluation.converters && evaluation.converters.get(chk.converterId);
          return Boolean(info) && Number(info.value) === Number(chk.expected);
        }
        return chk.expected.every((bit, i) => Boolean(evaluation.lamps.get(chk.lamps[i])) === Boolean(bit));
      });
      if (!ok) return showNotTestResult("failure", workspace, def.id);
      // Re-harness the NEXT case from the pristine learner circuit (see the bus
      // check note), so harnesses don't pile up.
      runMultibitTestCase(baseWorkspace, caseIndex + 1);
    }, 850);
  }

  function startMultibitTaskTest() {
    if (!isMultibitTaskWorkspace() || notTestActive()) return;
    clearNotTestTimer();
    notTestSnapshot = clonePlain(state.workspace);
    muxTableSnapshot = null;
    runMultibitTestCase(state.workspace, 0);
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

      // Multi-bit routing tasks (chapter 2.5), like the bus tasks, show their
      // solution walkthrough on success; finishing it completes the task and
      // returns to the next-tasks worktable (see finishSolutionDialog).
      if (["Not", "And", "Or", "Xor", "AND3way", "OR4way"].includes(taskId) || busTaskDefById(taskId) || taskHasSolutionWalkthrough(taskId)) return showTaskSolution(taskId, { completeOnClose: true });

      const completedTasks = taskId && !taskCompleted(taskId)
        ? [...completedTaskIds(), taskId]
        : completedTaskIds();

      // Arith cards with no solution walkthrough yet: complete and return to the
      // 2.5 worktable. All done -> "המשך יבוא" immediately; otherwise reopen the
      // note so the next card unlocks.
      if (isArithTask(taskId)) {
        const allArithDone = allArithTasksCompletedIn(completedTasks);
        return setState({
          ...arithWorktableReturnTarget(),
          taskDialog: null,
          notTest: null,
          muxTable: null,
          completedTasks,
          arithNoteList: !allArithDone,
          infoDialog: allArithDone ? "המשך יבוא..." : null,
          workspace: createDefaultWorkspace(),
          replayNonce: state.replayNonce + 1
        }, true);
      }

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

  // Return to the 2.5 arithmetic worktable (panel119) an arith build was opened
  // from, so completing / leaving a card lands back on the note.
  function arithWorktableReturnTarget() {
    const returnChapter = chapterById(state.workspace?.sessionReturnChapterId || "chapter-8");
    const returnPanelIndex = Number.isInteger(state.workspace?.sessionReturnPanelIndex) ? state.workspace.sessionReturnPanelIndex : 0;
    return storyTarget(returnChapter, returnPanelIndex);
  }

  function showTaskSolution(taskId, options = {}) {
    // Seeing a basic gate's solution unlocks its button in the explanations menu
    // (and plays the unlock flourish the first time). The routing cards unlock on
    // completion instead (see syncExplanationUnlocks).
    if (["Not", "And", "Or"].includes(taskId)) unlockExplanation(`gate-${taskId}`, { silent: true });
    const routing = isRoutingTask(taskId);
    const bus = Boolean(busTaskDefById(taskId));
    const multibit = Boolean(multibitTaskDefById(taskId));
    const arith = isArithTask(taskId);
    const chapter = arith ? chapterById("chapter-8")
      : (routing || bus || multibit) ? chapterById((bus || multibit) ? "chapter-7" : "chapter-6")
      : simpleGatesChapter();
    const workspace = solutionWorkspaceForTask(taskId, 0);
    if (routing || bus || multibit || arith) {
      // Keep the return target so leaving the solution goes back to the worktable.
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
      muxTable: taskId === "Mux" ? muxTableWithInputs(true) : taskId === "DMux" ? dmuxTableWithInputs(true) : (isArithTask(taskId) && !isArithBusTask(taskId)) ? arithTableWithInputs(taskId, true) : null,
      solutionDialog: { taskId, completeOnClose: options.completeOnClose !== false, step: 0, returnToExplanations: Boolean(options.returnToExplanations) },
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
    // The bit explanation was just read to the end → announce it now.
    announceExplanationUnlock("bit-info");
    const returnToNote = Boolean(state.bitDialog.returnToNote);
    if (returnToNote) {
      return setState({ bitDialog: null, taskDialog: { message: "" } }, false);
    }
    return setState({ bitDialog: null }, false);
  }

  // Opening a component's monologue counts as "examining" that piece of new
  // equipment; once both the bus and the splitter have been examined the 2.4
  // note unlocks its task list.
  function openComponentMonologue(kind) {
    const k = kind === "splitter" ? "splitter" : "bus";
    const seen = Array.isArray(state.busesEquipmentSeen) ? state.busesEquipmentSeen : [];
    const nextSeen = seen.includes(k) ? seen : [...seen, k];
    setState({ componentMonologue: { kind: k }, busesEquipmentSeen: nextSeen }, false);
  }

  function closeComponentMonologue() {
    setState({ componentMonologue: null }, false);
  }

  // The two binary↔decimal converters on the 2.5 worktable. Clicking one shows
  // its self-introduction and marks it examined; both must be examined before the
  // tasks note opens (mirrors the 2.4 bus/splitter equipment gate).
  function openConverterInfo(dir) {
    const d = dir === "out" ? "out" : "in";
    const seen = Array.isArray(state.arithConvertersSeen) ? state.arithConvertersSeen : [];
    const nextSeen = seen.includes(d) ? seen : [...seen, d];
    setState({ converterInfo: { dir: d }, arithConvertersSeen: nextSeen }, false);
  }

  function closeConverterInfo() {
    setState({ converterInfo: null }, false);
  }

  function arithConvertersChecked() {
    const seen = Array.isArray(state.arithConvertersSeen) ? state.arithConvertersSeen : [];
    return seen.includes("in") && seen.includes("out");
  }

  function newEquipmentChecked() {
    const seen = Array.isArray(state.busesEquipmentSeen) ? state.busesEquipmentSeen : [];
    return seen.includes("bus") && seen.includes("splitter");
  }

  // The 2.4 note's task list (BUS_TASK_DEFS, in js/app-data.js). Tasks unlock in
  // a dependency graph: Not4 is available first and opens Not16/AND4/OR4/MUX4;
  // AND4 opens AND16; MUX4 opens MUX16.
  function busTaskDefById(id) {
    return BUS_TASK_DEFS.find((task) => task.id === id) || null;
  }

  function busTaskUnlocked(id) {
    const def = busTaskDefById(id);
    if (!def) return false;
    // MUX16 is the last card: it unlocks only once every other bus card is done.
    if (id === "MUX16") return BUS_TASK_DEFS.every((t) => t.id === "MUX16" || taskCompleted(t.id));
    return def.requires === null || taskCompleted(def.requires);
  }

  function busTaskLockedMessage(id) {
    if (id === "MUX16") return "צריך קודם לבנות את שאר הכרטיסים.";
    const req = busTaskDefById(id)?.requires;
    const reqLabel = req ? (busTaskDefById(req)?.label || req) : "";
    return reqLabel ? `צריך קודם לבנות את ${reqLabel}.` : "";
  }

  // Which bus tasks have a real build workspace built.
  function busTaskImplemented(id) {
    return ["Not4", "Not16", "AND4", "AND16", "OR4", "MUX4", "MUX16"].includes(id);
  }

  function openBusesNote() {
    // The equipment (bus + splitter) must be examined only before the FIRST
    // note (the 2.4 bus-task worktable). The second note (the multi-bit
    // next-tasks worktable, reachable by skipping) has no such gate.
    if (!onNextTasksWorktable() && !newEquipmentChecked()) {
      return setState({ infoDialog: "קודם תבדוק את כל הציוד." });
    }
    return setState({ busesNoteList: true });
  }

  function handleMultibitNoteTask(id) {
    const task = MULTIBIT_TASKS.find((t) => t.id === id);
    if (!task) return;
    // A later task is locked until its predecessor is built.
    if (task.requires && !taskCompleted(task.requires)) {
      const reqLabel = MULTIBIT_TASKS.find((t) => t.id === task.requires)?.label || task.requires;
      return setState({ infoDialog: `קודם צריך לבנות את ${reqLabel}` });
    }
    // A completed task reopens its solution walkthrough; an unbuilt one opens the
    // build workspace.
    if (taskCompleted(task.id) && taskHasSolutionWalkthrough(task.id)) {
      return showTaskSolution(task.id, { completeOnClose: false });
    }
    openMultibitTaskWorkspace(task.id);
  }

  function handleBusNoteTask(index) {
    const task = BUS_TASK_DEFS[index];
    if (!task) return;
    if (!busTaskUnlocked(task.id)) {
      return setState({ infoDialog: busTaskLockedMessage(task.id) });
    }
    if (!busTaskImplemented(task.id)) {
      return setState({ infoDialog: "המשך יבוא..." });
    }
    // A completed task reopens its solution walkthrough (like the other tasks);
    // an unbuilt one opens the build workspace.
    if (taskCompleted(task.id) && taskHasSolutionWalkthrough(task.id)) {
      return showTaskSolution(task.id, { completeOnClose: false });
    }
    openBusTaskWorkspace(task.id);
  }

  // The next set of tasks (chapter 2.5 style), shown in the worktable note once
  // von Neumann's monologue has handed them over. They must be done in order:
  // the first is available, the rest wait for their predecessor. The build
  // workspaces/engine/checks are the next piece of work; for now clicking the
  // available task shows its requirements, and clicking a locked one explains
  // what must be built first. Hints are kept here for the upcoming hint slides.
  const MULTIBIT_TASKS = [
    {
      id: "Dmux4way",
      label: "DMux4Way",
      kind: "dmux4way",
      requires: null,
      requirements: "ה-DMux4Way הוא כרטיס עם 2 כניסות ו-4 יציאות: אחת מהכניסות היא כניסת בקרה (מלמעלה) והיא בס ברוחב 2. הכניסה האחרת היא כניסה רגילה. היציאות הן רגילות. אחת מהיציאות צריכה להיות זהה לכניסה הרגילה והאחרות - 0. כניסת הבקרה קובעת איזו מהיציאות תהיה זהה לכניסה (הרגילה). אם שני הביטים הם 0, אז זאת הראשונה; אם הם 01 אז השנייה; אם 10 אז השלישית; ואם 11 אז הרביעית.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      id: "Mux4way16",
      label: "Mux4Way16",
      kind: "mux4way16",
      requires: "Dmux4way",
      requirements: "ה-Mux4Way16 הוא כרטיס עם 5 כניסות ויציאה אחת: אחת מהכניסות היא כניסת בקרה (מלמעלה) והיא בס ברוחב 2. הכניסות האחרות הן בסים ברוחב 16. היציאה היא בס ברוחב 16. היציאה צריכה להיות זהה לאחת הכניסות. כניסת הבקרה קובעת איזו מהכניסות (משמאל) תהיה זהה ליציאה. אם שני הביטים הם 0, אז זאת הראשונה; אם הם 01 אז השנייה; אם 10 אז השלישית; ואם 11 אז הרביעית.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    }
  ];

  // ARITH_TASKS (the chapter 2.5 worktable cards) live in js/app-data.js so they
  // are registered as component defs at the top of this file — before the initial
  // state load, which would otherwise strip an unknown taskCard-<id> component.
  function arithTaskDefById(id) {
    return ARITH_TASKS.find((task) => task.id === id) || null;
  }

  function isArithTask(id) {
    return ARITH_TASKS.some((task) => task.id === id);
  }

  // Which arith cards have a real build workspace so far. The rest stay a
  // "המשך יבוא..." placeholder in the note.
  function arithTaskImplemented(id) {
    return ["halfAdder", "fullAdder", "Add4", "Add16"].includes(id);
  }

  // Add4/Add16 are BUS adder cards (multi-bit, no truth table), checked with the
  // multi-bit harness like the routing cards.
  function isArithBusTask(id) {
    return Boolean(arithTaskDefById(id)?.busWidth);
  }

  function arithTaskUnlocked(id) {
    const def = arithTaskDefById(id);
    if (!def) return false;
    return def.requires === null || taskCompleted(def.requires);
  }

  function arithTaskLockedMessage(id) {
    const req = arithTaskDefById(id)?.requires;
    const reqLabel = req ? (arithTaskDefById(req)?.label || req) : "";
    return reqLabel ? `קודם צריך לבנות את ${reqLabel}` : "";
  }

  // The editable scratch truth table shown alongside the arith card requirements:
  // one input column per input, then sum + carry. 2^inputs rows.
  function arithScratchColumns(taskId) {
    const def = arithTaskDefById(taskId);
    const n = def?.inputs || 2;
    const cols = [];
    for (let i = 1; i <= n; i += 1) cols.push(`in${i}`);
    cols.push("sum", "carry");
    return cols;
  }

  function arithScratchRowCount(taskId) {
    const def = arithTaskDefById(taskId);
    return 1 << (def?.inputs || 2);
  }

  function arithEmptyScratchTable(taskId) {
    const cols = arithScratchColumns(taskId);
    return Array.from({ length: arithScratchRowCount(taskId) }, () => {
      const row = {};
      cols.forEach((c) => { row[c] = null; });
      return row;
    });
  }

  // Fill the scratch table from the task's rows: inputs only (withOutputs=false,
  // the "empty table" skeleton) or inputs + sum/carry (withOutputs=true). Used by
  // the arith fill-table interactive hints, mirroring muxTableWithInputs.
  function arithTableWithInputs(taskId, withOutputs) {
    const def = taskDefById(taskId);
    if (!def || !Array.isArray(def.rows)) return arithEmptyScratchTable(taskId);
    return def.rows.map((row) => {
      const r = {};
      row.inputs.forEach((value, index) => { r[`in${index + 1}`] = value ? 1 : 0; });
      const outs = Array.isArray(row.outputs) ? row.outputs : [row.output];
      r.sum = withOutputs ? (outs[0] ? 1 : 0) : null;
      r.carry = withOutputs ? (outs[1] ? 1 : 0) : null;
      return r;
    });
  }

  // The fullAdder build hints construct the 3-halfAdder circuit one stage at a
  // time. Each stage is the cumulative circuit up to that point: HA1 adds the
  // first two inputs; HA2 adds the third to that sum; the sum output is wired;
  // then HA3 adds the two carries and its sum becomes the card's carry. HA3's
  // own carry is always 0, so it is left unconnected.
  const FA_HA1 = { id: "ha-1", type: "gate-halfAdder", x: 330, y: 200 };
  const FA_HA2 = { id: "ha-2", type: "gate-halfAdder", x: 500, y: 320 };
  // HA3 sits to the right of HA2 and high enough to stay inside the frame.
  const FA_HA3 = { id: "ha-3", type: "gate-halfAdder", x: 690, y: 240 };
  const FA_W_HA1 = [["task-card-1.inputInt1", "ha-1.in1"], ["task-card-1.inputInt2", "ha-1.in2"]];
  const FA_W_HA2 = [...FA_W_HA1, ["ha-1.out1", "ha-2.in1"], ["task-card-1.inputInt3", "ha-2.in2"]];
  const FA_W_SUM = [...FA_W_HA2, ["ha-2.out1", "task-card-1.outputInt1"]];
  // The two carries feed HA3; wired so the cables do not cross (carry1 from the
  // higher HA1 to the top input, carry2 from HA2 to the bottom input).
  const FA_W_CARRIES = [...FA_W_SUM, ["ha-1.out2", "ha-3.in1"], ["ha-2.out2", "ha-3.in2"]];
  // The full circuit also routes HA3's sum to the card's carry output; the HINT
  // deliberately stops one wire short of that (leaving it for the learner).
  const FA_W_FULL = [...FA_W_CARRIES, ["ha-3.out1", "task-card-1.outputInt2"]];
  const FULLADDER_HINT_STAGES = {
    "fulladder-ha1": { components: [FA_HA1], wires: FA_W_HA1 },
    "fulladder-ha2": { components: [FA_HA1, FA_HA2], wires: FA_W_HA2 },
    "fulladder-sum": { components: [FA_HA1, FA_HA2], wires: FA_W_SUM },
    "fulladder-carries": { components: [FA_HA1, FA_HA2], wires: FA_W_SUM },
    "fulladder-ha3": { components: [FA_HA1, FA_HA2, FA_HA3], wires: FA_W_CARRIES }
  };

  // The Add4 build hints progressively construct the ripple adder, matching the
  // solution layout (units fa3 at the bottom, next digit fa2 above it, the two
  // input splitters at the centre and the merge on the right). Each stage
  // rebuilds the workspace to a fixed cumulative state, so they must be applied
  // in order and each warns first (it overwrites the learner's work). The hints
  // stop after the second digit — fa1/fa0 are left for the learner to continue.
  const A4_SPLIT_A = { id: "split-a", type: "splitter", x: 451, y: 173, mirrored: false, outputs: 4, width: 1 };
  const A4_SPLIT_B = { id: "split-b", type: "splitter", x: 451, y: 310, mirrored: false, outputs: 4, width: 1 };
  const A4_FA_UNITS = { id: "fa0", type: "gate-fullAdder", x: 582, y: 406 };
  const A4_FA_NEXT = { id: "fa1", type: "gate-fullAdder", x: 602, y: 323 };
  const A4_MERGE = { id: "merge", type: "splitter", x: 796, y: 328, mirrored: true, outputs: 4, width: 1 };
  // Split both numbers and add the units digits (leg0, the bottom leg) with the
  // incoming carry.
  const A4_W_UNITS = [
    ["task-card-1.inputInt1", "split-a.single"],
    ["task-card-1.inputInt2", "split-b.single"],
    ["split-a.leg0", "fa0.in1"],
    ["split-b.leg0", "fa0.in2"],
    ["task-card-1.inputInt3", "fa0.in3"]
  ];
  // Route the units sum out (through the merge, into the units bit of the sum bus).
  const A4_W_UNITS_OUT = [...A4_W_UNITS, ["fa0.out1", "merge.leg0"], ["merge.single", "task-card-1.outputInt2"]];
  // Add the next digit (leg1), threading the units carry, and route its sum out.
  const A4_W_NEXT = [
    ...A4_W_UNITS_OUT,
    ["split-a.leg1", "fa1.in1"],
    ["split-b.leg1", "fa1.in2"],
    ["fa0.out2", "fa1.in3"],
    ["fa1.out1", "merge.leg1"]
  ];
  const ADD4_HINT_STAGES = {
    "add4-units": { components: [A4_SPLIT_A, A4_SPLIT_B, A4_FA_UNITS], wires: A4_W_UNITS },
    "add4-units-out": { components: [A4_SPLIT_A, A4_SPLIT_B, A4_FA_UNITS, A4_MERGE], wires: A4_W_UNITS_OUT },
    "add4-next-digit": { components: [A4_SPLIT_A, A4_SPLIT_B, A4_FA_UNITS, A4_FA_NEXT, A4_MERGE], wires: A4_W_NEXT }
  };
  // (FA_W_FULL is used by the fullAdder solution circuit in solution-workspaces.js.)

  // The Add16 build hints progressively construct the 16-bit adder from Add4
  // chunks: split each number into four 4-bit chunks (width-4 splitters), add the
  // units chunk (no carry-in), route it out, then add the next chunk threading
  // the carry. Same shape as the Add4 hints, one level up.
  const A16_SPLIT_A = { id: "split-a", type: "splitter", x: 430, y: 200, mirrored: false, outputs: 4, width: 4 };
  const A16_SPLIT_B = { id: "split-b", type: "splitter", x: 430, y: 420, mirrored: false, outputs: 4, width: 4 };
  const A16_AD_UNITS = { id: "ad0", type: "gate-Add4", x: 640, y: 520 };
  const A16_AD_NEXT = { id: "ad1", type: "gate-Add4", x: 640, y: 380 };
  const A16_MERGE = { id: "merge", type: "splitter", x: 850, y: 310, mirrored: true, outputs: 4, width: 4 };
  // Split both numbers and add the units chunks (leg0, the bottom chunk). Add16
  // has no carry-in, so the units Add4's in3 is left unconnected (0).
  const A16_W_UNITS = [
    ["task-card-1.inputInt1", "split-a.single"],
    ["task-card-1.inputInt2", "split-b.single"],
    ["split-a.leg0", "ad0.in1"],
    ["split-b.leg0", "ad0.in2"]
  ];
  // Route the units chunk sum out (through the merge, into the low 4 bits).
  const A16_W_UNITS_OUT = [...A16_W_UNITS, ["ad0.out1", "merge.leg0"], ["merge.single", "task-card-1.outputInt1"]];
  // Add the next chunk (leg1), threading the units carry, and route its sum out.
  const A16_W_NEXT = [
    ...A16_W_UNITS_OUT,
    ["split-a.leg1", "ad1.in1"],
    ["split-b.leg1", "ad1.in2"],
    ["ad0.out2", "ad1.in3"],
    ["ad1.out1", "merge.leg1"]
  ];
  const ADD16_HINT_STAGES = {
    "add16-units": { components: [A16_SPLIT_A, A16_SPLIT_B, A16_AD_UNITS], wires: A16_W_UNITS },
    "add16-units-out": { components: [A16_SPLIT_A, A16_SPLIT_B, A16_AD_UNITS, A16_MERGE], wires: A16_W_UNITS_OUT },
    "add16-next-chunk": { components: [A16_SPLIT_A, A16_SPLIT_B, A16_AD_UNITS, A16_AD_NEXT, A16_MERGE], wires: A16_W_NEXT }
  };

  function openArithNote() {
    // Examine both converters before the tasks note opens (mirrors the 2.4
    // bus/splitter equipment gate, which is unconditional).
    if (!arithConvertersChecked()) {
      return setState({ infoDialog: "קודם כל תבדוק את כל הציוד החדש." });
    }
    return setState({ arithNoteList: true });
  }

  // Open the build workspace for an arith card (halfAdder / fullAdder). Modeled on
  // openTaskWorkspace (single-bit truth-table task, two output lamps) but returns
  // to the 2.5 worktable with the arith note reopened, like the bus tasks.
  function openArithTaskWorkspace(taskId) {
    const task = taskDefById(taskId);
    if (!task) return;
    const chapter = chapterById("chapter-8");
    const returnChapterId = state.chapterId;
    const returnPanelIndex = Number.isInteger(state.panelIndex) ? state.panelIndex : null;
    const bus = isArithBusTask(task.id);
    const workspace = {
      ...createDefaultWorkspace(),
      components: bus
        ? [
          // Bus adder card (Add4/Add16): no output lamps — the multi-bit check
          // harness wires its own splitter/lamp fan-out. Add16 sits lower so its
          // taller frame (four stacked Add4 gates) fits on the board.
          { id: "task-card-1", type: taskCardComponentType(task.id), x: 640, y: task.id === "Add16" ? 310 : 288 },
          { id: "source-1", type: "source", x: 65, y: task.id === "Add16" ? 310 : 288 }
        ]
        : [
          { id: "source-1", type: "source", x: 80, y: 288 },
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
      exitTargetPanelIndex: returnPanelIndex,
      sessionReturnChapterId: returnChapterId,
      sessionReturnPanelIndex: returnPanelIndex,
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
      arithNoteList: false,
      requirementsPanelHidden: false,
      muxTable: bus ? null : arithEmptyScratchTable(task.id),
      workspace
    }, false);
  }

  function handleArithNoteTask(id) {
    const task = arithTaskDefById(id);
    if (!task) return;
    if (!arithTaskUnlocked(task.id)) {
      return setState({ infoDialog: arithTaskLockedMessage(task.id) });
    }
    if (!arithTaskImplemented(task.id)) {
      // Guard for any future arith card without a build workspace yet (all four
      // current ones — halfAdder / fullAdder / Add4 / Add16 — are implemented).
      return setState({ infoDialog: "המשך יבוא..." });
    }
    // A completed card reopens its solution walkthrough (like the other tasks);
    // an unbuilt one opens the build workspace.
    if (taskCompleted(task.id) && taskHasSolutionWalkthrough(task.id)) {
      return showTaskSolution(task.id, { completeOnClose: false });
    }
    openArithTaskWorkspace(task.id);
  }

  // The next-tasks worktable (post-monologue) shows the multi-bit task list; the
  // original worktable keeps the bus-task list. Keyed off which panel we're on,
  // so replaying the chapter naturally shows the original note.
  function onNextTasksWorktable() {
    return state.screen === "story" && panelImageIs(currentPanel(), "panel99g_chapter_2_4_worktable_next.svg");
  }

  function renderBusesNoteList() {
    if (!state.busesNoteList) return "";
    const body = onNextTasksWorktable()
      ? `
          <ol class="note-task-list buses-note-list">
            ${MULTIBIT_TASKS.map((task) => {
              const completed = taskCompleted(task.id);
              const locked = Boolean(task.requires) && !taskCompleted(task.requires);
              return `
                <li class="${completed ? "task-completed" : ""} ${locked ? "task-locked" : ""}">
                  <span class="note-task-check" aria-hidden="true">${completed ? "✓" : ""}</span>
                  <button class="note-task-button" data-action="multibit-note-task" data-task-id="${esc(task.id)}" type="button" aria-disabled="${locked ? "true" : "false"}">${esc(task.label)}</button>
                </li>`;
            }).join("")}
          </ol>`
      : `
          <ol class="note-task-list buses-note-list">
            ${BUS_TASK_DEFS.map((task, index) => {
              const completed = taskCompleted(task.id);
              const locked = !busTaskUnlocked(task.id);
              return `
                <li class="${completed ? "task-completed" : ""} ${locked ? "task-locked" : ""}">
                  <span class="note-task-check" aria-hidden="true">${completed ? "✓" : ""}</span>
                  <button class="note-task-button" data-action="bus-note-task" data-task-index="${index}" type="button" aria-disabled="${locked ? "true" : "false"}">${esc(task.label)}</button>
                </li>`;
            }).join("")}
          </ol>`;
    return `
      <div class="note-task-overlay" role="presentation">
        <section class="note-task-card" role="dialog" aria-modal="false" aria-label="רשימת משימות">
          <h2>משימות</h2>
          ${body}
          <div class="note-task-actions">
            <button class="btn" data-action="buses-note-close">סגור</button>
            ${noteClearProgressButton(onNextTasksWorktable() ? "multibit" : "buses")}
          </div>
        </section>
        ${renderNoteClearDialog()}
      </div>`;
  }

  function renderArithNoteList() {
    if (!state.arithNoteList) return "";
    const body = `
      <ol class="note-task-list buses-note-list">
        ${ARITH_TASKS.map((task) => {
          const completed = taskCompleted(task.id);
          const locked = !arithTaskUnlocked(task.id);
          return `
            <li class="${completed ? "task-completed" : ""} ${locked ? "task-locked" : ""}">
              <span class="note-task-check" aria-hidden="true">${completed ? "✓" : ""}</span>
              <button class="note-task-button" data-action="arith-note-task" data-task-id="${esc(task.id)}" type="button" aria-disabled="${locked ? "true" : "false"}">${esc(task.label)}</button>
            </li>`;
        }).join("")}
      </ol>`;
    return `
      <div class="note-task-overlay" role="presentation">
        <section class="note-task-card" role="dialog" aria-modal="false" aria-label="רשימת משימות">
          <h2>משימות</h2>
          ${body}
          <div class="note-task-actions">
            <button class="btn" data-action="arith-note-close">סגור</button>
            ${noteClearProgressButton("arith")}
          </div>
        </section>
        ${renderNoteClearDialog()}
      </div>`;
  }

  function finishSolutionDialog() {
    const taskId = state.solutionDialog?.taskId || "Not";
    // A gate solution opened from the explanations menu just goes back there,
    // without touching task progress or the story flow.
    if (state.solutionDialog?.returnToExplanations) {
      return setState({
        screen: "explanations",
        solutionDialog: null,
        taskDialog: null,
        notTest: null,
        hintDialog: null,
        muxTable: null,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, false);
    }
    // A basic-gate solution (Not/And/Or) was just closed → announce its
    // explanation at the end of reading it.
    if (["Not", "And", "Or"].includes(taskId)) announceExplanationUnlock(`gate-${taskId}`);

    const shouldComplete = Boolean(state.solutionDialog?.completeOnClose);
    const completedTasks = shouldComplete && taskId && !taskCompleted(taskId)
      ? [...completedTaskIds(), taskId]
      : completedTaskIds();

    // Bus tasks (2.4) and multi-bit routing tasks (2.5): back to the worktable
    // with the note reopened (so the next task unlocks).
    if (!isArithTask(taskId) && (busTaskDefById(taskId) || multibitTaskDefById(taskId))) {
      const returnChapterId = state.workspace?.sessionReturnChapterId || "chapter-7";
      const returnChapter = chapterById(returnChapterId);
      // Finishing the LAST multi-bit task (Mux4way16) rolls into the closing von
      // Neumann monologue ("great work, it's midnight…") instead of returning to
      // the worktable note.
      if (taskId === "Mux4way16") {
        const scene = sceneByChapter(returnChapter);
        const monologueIndex = panelIndexByImage(scene, "panel99h_chapter_2_4_vn_midnight.svg");
        if (monologueIndex >= 0) {
          return setState({
            ...storyTarget(returnChapter, monologueIndex),
            taskDialog: null,
            solutionDialog: null,
            notTest: null,
            hintDialog: null,
            muxTable: null,
            completedTasks,
            busesNoteList: false,
            workspace: createDefaultWorkspace(),
            replayNonce: state.replayNonce + 1
          }, true);
        }
      }
      const returnPanelIndex = Number.isInteger(state.workspace?.sessionReturnPanelIndex) ? state.workspace.sessionReturnPanelIndex : 0;
      return setState({
        ...storyTarget(returnChapter, returnPanelIndex),
        taskDialog: null,
        solutionDialog: null,
        notTest: null,
        hintDialog: null,
        muxTable: null,
        completedTasks,
        busesNoteList: true,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    // Arith cards (2.5): back to the worktable. If this completion finished the
    // WHOLE note, show the "המשך יבוא" notice immediately (end of current
    // content); otherwise reopen the note so the next card unlocks.
    if (isArithTask(taskId)) {
      const allArithDone = allArithTasksCompletedIn(completedTasks);
      return setState({
        ...arithWorktableReturnTarget(),
        taskDialog: null,
        solutionDialog: null,
        notTest: null,
        hintDialog: null,
        muxTable: null,
        completedTasks,
        arithNoteList: !allArithDone,
        infoDialog: allArithDone ? "המשך יבוא..." : null,
        workspace: createDefaultWorkspace(),
        replayNonce: state.replayNonce + 1
      }, true);
    }

    if (shouldComplete && allNoteTasksCompletedIn(completedTasks)) {
      // Finishing both routing cards (MUX+DMUX) advances from 2.3 into 2.4;
      // finishing the first one returns to the 2.3 worktable to pick the second.
      const advanceToBuses = isRoutingTask(taskId) && allRoutingTasksCompletedIn(completedTasks);
      return setState({
        ...(advanceToBuses ? chapter24StartTarget() : chapter23StartTarget()),
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

  // End the MUX16 "original-MUX" walkthrough by revealing the new "create card"
  // tool: complete the task, close the walkthrough, and stay in the workspace so
  // the learner sees the tool (and its one-time speech bubble) in the palette.
  function revealCreateCardTool() {
    const taskId = state.solutionDialog?.taskId || "MUX16";
    const shouldComplete = Boolean(state.solutionDialog?.completeOnClose);
    const completedTasks = shouldComplete && !taskCompleted(taskId)
      ? [...completedTaskIds(), taskId]
      : completedTaskIds();
    setState({ solutionDialog: null, completedTasks, createCardUnlocked: true, cardIntroPending: true }, false);
  }

  // Secret developer shortcut (Ctrl+Shift+Q): instantly mark the current
  // workspace task as solved and jump back to its note, so later tasks can be
  // reached without solving every prerequisite by hand. Not surfaced in the UI.
  function secretSolveAndExit() {
    if (state.screen !== "workspace") return;
    const taskId = state.workspace?.taskId;
    if (!taskId) return;
    const completedTasks = !taskCompleted(taskId) ? [...completedTaskIds(), taskId] : completedTaskIds();
    const base = {
      taskDialog: null, solutionDialog: null, notTest: null, hintDialog: null, muxTable: null,
      completedTasks, workspace: createDefaultWorkspace(), replayNonce: state.replayNonce + 1
    };
    if (!isArithTask(taskId) && (busTaskDefById(taskId) || multibitTaskDefById(taskId))) {
      const returnChapterId = state.workspace?.sessionReturnChapterId || "chapter-7";
      const returnChapter = chapterById(returnChapterId);
      if (taskId === "Mux4way16") {
        const monologueIndex = panelIndexByImage(sceneByChapter(returnChapter), "panel99h_chapter_2_4_vn_midnight.svg");
        if (monologueIndex >= 0) return setState({ ...storyTarget(returnChapter, monologueIndex), ...base, busesNoteList: false }, true);
      }
      const returnPanelIndex = Number.isInteger(state.workspace?.sessionReturnPanelIndex) ? state.workspace.sessionReturnPanelIndex : 0;
      return setState({ ...storyTarget(returnChapter, returnPanelIndex), ...base, busesNoteList: true }, true);
    }
    // Arith cards (2.5): back to the arithmetic worktable with its note, not the
    // 2.2 gates worktable. All done -> show the "המשך יבוא" notice.
    if (isArithTask(taskId)) {
      const allArithDone = allArithTasksCompletedIn(completedTasks);
      return setState({ ...arithWorktableReturnTarget(), ...base, arithNoteList: !allArithDone, infoDialog: allArithDone ? "המשך יבוא..." : null }, true);
    }
    return setState({ ...secondWorkspaceExitTarget(), ...base, taskDialog: { message: "", ...(isRoutingTask(taskId) ? { mode: "routing" } : {}) } }, true);
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
    if (isRoutingTask(taskId) || busTaskDefById(taskId) || multibitTaskDefById(taskId) || isArithTask(taskId)) {
      // The rebuilt solution workspace must keep the worktable return target.
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
    const source = componentById(workspace, "source-1") || { id: "source-1", type: "source", x: (taskId === "Mux" || taskId === "DMux") ? 45 : 80, y: 288 };
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

    if (taskId === "DMux" && (hint.action === "dmux-fill-inputs" || hint.action === "dmux-fill-outputs")) {
      const patch = {
        hintDialog: null,
        muxTable: dmuxTableWithInputs(hint.action === "dmux-fill-outputs")
      };
      if (hintStateOverride) patch.hintState = hintStateOverride;
      return setState(patch, false);
    }

    // Arith fill-table hints (halfAdder/fullAdder): fill only the input columns
    // (the "empty table" skeleton) or the whole table, like the MUX/DMUX hints.
    if (isArithTask(taskId) && (hint.action === "arith-fill-inputs" || hint.action === "arith-fill-outputs")) {
      const patch = {
        hintDialog: null,
        muxTable: arithTableWithInputs(taskId, hint.action === "arith-fill-outputs")
      };
      if (hintStateOverride) patch.hintState = hintStateOverride;
      return setState(patch, false);
    }

    // fullAdder build hints: progressively construct the 3-halfAdder circuit.
    // Each stage rebuilds the workspace to a fixed cumulative state, so they must
    // be applied in order (each warns first, as it overwrites the learner's work).
    if (taskId === "fullAdder" && FULLADDER_HINT_STAGES[hint.action]) {
      const faWorkspace = normalizeWorkspace(clonePlain(state.workspace));
      const source = componentById(faWorkspace, "source-1") || { id: "source-1", type: "source", x: 80, y: 288 };
      const card = componentById(faWorkspace, "task-card-1") || { id: "task-card-1", type: taskCardComponentType("fullAdder"), x: 500, y: 288 };
      const stage = FULLADDER_HINT_STAGES[hint.action];
      faWorkspace.components = [clonePlain(source), clonePlain(card), ...taskLampComponents("fullAdder"), ...stage.components];
      faWorkspace.wires = stage.wires.map((pair) => normalizeWire(pair[0], pair[1]));
      faWorkspace.nextId = 6;
      faWorkspace.selectedTerminal = null;
      faWorkspace.accident = null;
      faWorkspace.focusedComponentId = null;
      faWorkspace.unlocked = true;
      faWorkspace.taskIntroSeen = true;
      const faPatch = {
        workspace: normalizeWorkspace(faWorkspace),
        hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
      };
      if (hintStateOverride) faPatch.hintState = hintStateOverride;
      return setState(faPatch, false);
    }

    // Add4 build hints: progressively construct the ripple adder (units column,
    // route it out, next digit). Bus adder card, so no output lamps — just the
    // pre-placed source and card plus the stage's splitters/adders/merge.
    if (taskId === "Add4" && ADD4_HINT_STAGES[hint.action]) {
      const a4 = normalizeWorkspace(clonePlain(state.workspace));
      const source = componentById(a4, "source-1") || { id: "source-1", type: "source", x: 65, y: 288 };
      const card = componentById(a4, "task-card-1") || { id: "task-card-1", type: taskCardComponentType("Add4"), x: 640, y: 288 };
      const stage = ADD4_HINT_STAGES[hint.action];
      a4.components = [clonePlain(source), clonePlain(card), ...stage.components];
      a4.wires = stage.wires.map((pair) => normalizeWire(pair[0], pair[1]));
      a4.nextId = 2;
      a4.selectedTerminal = null;
      a4.accident = null;
      a4.focusedComponentId = null;
      a4.unlocked = true;
      a4.taskIntroSeen = true;
      const a4Patch = {
        workspace: normalizeWorkspace(a4),
        hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
      };
      if (hintStateOverride) a4Patch.hintState = hintStateOverride;
      return setState(a4Patch, false);
    }

    // Add16 build hints: progressively construct the 16-bit adder from Add4
    // chunks (units chunk, route it out, next chunk). Same scaffold shape as Add4.
    if (taskId === "Add16" && ADD16_HINT_STAGES[hint.action]) {
      const a16 = normalizeWorkspace(clonePlain(state.workspace));
      const source = componentById(a16, "source-1") || { id: "source-1", type: "source", x: 65, y: 288 };
      const card = componentById(a16, "task-card-1") || { id: "task-card-1", type: taskCardComponentType("Add16"), x: 640, y: 288 };
      const stage = ADD16_HINT_STAGES[hint.action];
      a16.components = [clonePlain(source), clonePlain(card), ...stage.components];
      a16.wires = stage.wires.map((pair) => normalizeWire(pair[0], pair[1]));
      a16.nextId = 2;
      a16.selectedTerminal = null;
      a16.accident = null;
      a16.focusedComponentId = null;
      a16.unlocked = true;
      a16.taskIntroSeen = true;
      const a16Patch = {
        workspace: normalizeWorkspace(a16),
        hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
      };
      if (hintStateOverride) a16Patch.hintState = hintStateOverride;
      return setState(a16Patch, false);
    }

    // Dmux4way interactive hint: scaffold the control-bus splitter and the first
    // DMUX, wired to the data input and the first (pair-selecting) control bit.
    // The two DMUX outputs are left for the learner to route onward.
    if (multibitTaskDefById(taskId) && hint.action === "dmux4way-connect-first-dmux") {
      const mbWorkspace = normalizeWorkspace(clonePlain(state.workspace));
      const card = componentById(mbWorkspace, "task-card-1") || { id: "task-card-1", type: taskCardComponentType(taskId), x: 640, y: 288 };
      const source = componentById(mbWorkspace, "source-1") || { id: "source-1", type: "source", x: 65, y: 288 };
      mbWorkspace.components = [
        clonePlain(source), clonePlain(card),
        { id: "ctrl-split", type: "splitter", x: 545, y: 150, mirrored: false, outputs: 2, width: 1 },
        { id: "dmux-a", type: "gate-DMux", x: 590, y: 300 }
      ];
      mbWorkspace.wires = [
        normalizeWire("task-card-1.inputInt2", "ctrl-split.single"),
        normalizeWire("task-card-1.inputInt1", "dmux-a.in1"),
        normalizeWire("ctrl-split.leg1", "dmux-a.in2")
      ];
      mbWorkspace.nextId = 2;
      mbWorkspace.selectedTerminal = null;
      mbWorkspace.accident = null;
      mbWorkspace.focusedComponentId = null;
      mbWorkspace.unlocked = true;
      mbWorkspace.taskIntroSeen = true;
      const mbPatch = {
        workspace: normalizeWorkspace(mbWorkspace),
        hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
      };
      if (hintStateOverride) mbPatch.hintState = hintStateOverride;
      return setState(mbPatch, false);
    }

    // Bus tasks: the interactive hints scaffold splitter(s) on the input bus(es)
    // and, at the next step, one sub-gate wired to a leg. Not4 splits into 4
    // single wires and uses a NOT; Not16 splits into 4 buses of width 4 and uses
    // a Not4; AND4 splits both inputs and uses a (single-bit) AND on a matching
    // pair of legs.
    if (busTaskDefById(taskId)) {
      const busWorkspace = normalizeWorkspace(clonePlain(state.workspace));
      const card = componentById(busWorkspace, "task-card-1") || { id: "task-card-1", type: taskCardComponentType(taskId), x: 640, y: 288 };
      // Keep a voltage source to the left of the card (as in the build/solution).
      const source = componentById(busWorkspace, "source-1") || { id: "source-1", type: "source", x: 65, y: 288 };
      let components, wires;
      if (["AND4", "OR4", "AND16"].includes(taskId)) {
        // A 2-input bus task. A width-4 task (AND4/OR4) splits each input into 4
        // single wires and uses the matching single-bit gate; a width-16 task
        // (AND16) splits each into 4 buses of width 4 and uses the ×4 bus gate.
        const busDef = busTaskDefById(taskId);
        const isWide = busDef.width === 16;
        const legWidth = isWide ? 4 : 1;
        const subGate = isWide ? gateComponentType(`${busDef.op === "And" ? "AND" : "OR"}4`) : gateComponentType(busDef.op);
        components = [clonePlain(source), clonePlain(card), { id: "split-a", type: "splitter", x: 450, y: 198, mirrored: false, outputs: 4, width: legWidth }];
        wires = [normalizeWire("task-card-1.inputInt1", "split-a.single")];
        if (!hint.action.endsWith("split-one")) {
          components.push({ id: "split-b", type: "splitter", x: 450, y: 378, mirrored: false, outputs: 4, width: legWidth });
          wires.push(normalizeWire("task-card-1.inputInt2", "split-b.single"));
        }
        if (hint.action.endsWith("split-both-and")) {
          // Leg 0 (the bottom cable) of each input, ANDed by a gate placed low.
          components.push({ id: "and-0", type: subGate, x: 660, y: 339 });
          wires.push(normalizeWire("split-a.leg0", "and-0.in1"));
          wires.push(normalizeWire("split-b.leg0", "and-0.in2"));
        }
      } else {
        const isNot16 = taskId === "Not16";
        const legWidth = isNot16 ? 4 : 1;
        const subGate = isNot16 ? "gate-Not4" : "gate-Not";
        const subId = isNot16 ? "not4-0" : "not-0";
        components = [clonePlain(source), clonePlain(card), { id: "split-in", type: "splitter", x: 450, y: 288, mirrored: false, outputs: 4, width: legWidth }];
        wires = [normalizeWire("task-card-1.inputInt1", "split-in.single")];
        if (hint.action.endsWith("split-and-not")) {
          // Wire the bottom leg (leg 0) to the sub-gate, placed low to match.
          components.push({ id: subId, type: subGate, x: 640, y: 339 });
          wires.push(normalizeWire("split-in.leg0", `${subId}.in1`));
        }
      }
      busWorkspace.components = components;
      busWorkspace.wires = wires;
      busWorkspace.nextId = 2;
      busWorkspace.selectedTerminal = null;
      busWorkspace.accident = null;
      busWorkspace.focusedComponentId = null;
      busWorkspace.unlocked = true;
      busWorkspace.taskIntroSeen = true;
      const busPatch = {
        workspace: normalizeWorkspace(busWorkspace),
        hintDialog: hint.openAfterApply ? { taskId, index: hintIndex } : null
      };
      if (hintStateOverride) busPatch.hintState = hintStateOverride;
      return setState(busPatch, false);
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
    // Finishing the Xor hint slides is the end of the truth-table-cards
    // explanation → announce its unlock now (not when the slides opened).
    if (unlockXorHelp) announceExplanationUnlock("truth-table-cards");

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

  // The task ids that belong to each task note. Chapter 2.4's tasks live in two
  // notes (buses + multibit), so it has two kinds.
  function noteTaskIdsForKind(kind) {
    if (kind === "boolean") return TASK_DEFS.map((t) => t.id);
    if (kind === "routing") return ROUTING_TASK_DEFS.map((t) => t.id);
    if (kind === "buses") return BUS_TASK_DEFS.map((t) => t.id);
    if (kind === "multibit") return MULTIBIT_TASKS.map((t) => t.id);
    if (kind === "arith") return ARITH_TASKS.map((t) => t.id);
    return [];
  }

  function noteHasProgress(kind) {
    return noteTaskIdsForKind(kind).some((id) => taskCompleted(id));
  }

  // "נקה התקדמות" for a task note: shown when the note already holds completed
  // tasks. Clearing wipes those tasks (and their first-try/hint bookkeeping) so
  // the chapter can be rebuilt from scratch.
  function noteClearProgressButton(kind) {
    if (!noteHasProgress(kind)) return "";
    return `<button class="btn notebook-clear-progress-btn" data-action="note-clear-open" data-note-kind="${kind}" type="button">נקה התקדמות</button>`;
  }

  function renderNoteClearDialog() {
    if (!state.noteClearConfirm) return "";
    return `
      <div class="pace-dialog-overlay" role="presentation">
        <section class="pace-dialog-card" role="dialog" aria-modal="false" aria-label="ניקוי התקדמות">
          <p>לנקות את ההתקדמות בפתק המשימות הזה?</p>
          <p class="my-card-delete-warn">הפעולה תמחק את כל המשימות שכבר השלמת בפתק הזה, ותצטרך לבנות אותן מחדש.</p>
          <div class="pace-dialog-actions">
            <button class="btn btn-primary" data-action="note-clear-confirm" type="button">נקה</button>
            <button class="btn" data-action="note-clear-cancel" type="button">ביטול</button>
          </div>
        </section>
      </div>`;
  }

  function clearNoteProgress() {
    const kind = state.noteClearConfirm;
    const ids = noteTaskIdsForKind(kind);
    if (!ids.length) return setState({ noteClearConfirm: null }, false);
    const idSet = new Set(ids);
    const completed = completedTaskIds();
    const clearedNow = ids.filter((id) => completed.includes(id));
    // Remember every ever-completed task, and which cleared tasks had been done,
    // so re-doing one later earns "מהנדס יסודי".
    const ever = Array.isArray(state.tasksEverCompleted) ? state.tasksEverCompleted : [];
    const everUnion = [...new Set([...ever, ...completed])];
    const clearedAfter = Array.isArray(state.tasksClearedAfterCompletion) ? state.tasksClearedAfterCompletion : [];
    const clearedAfterUnion = [...new Set([...clearedAfter, ...clearedNow])];
    // Reset the first-try / hint bookkeeping for this note's tasks so a clean
    // rebuild can earn the "מדויק" chapter achievement.
    const failed = Array.isArray(state.tasksFailedOnce) ? state.tasksFailedOnce : [];
    const newHintState = { ...hintState() };
    ids.forEach((id) => { delete newHintState[id]; });
    setState({
      completedTasks: completed.filter((id) => !idSet.has(id)),
      tasksFailedOnce: failed.filter((id) => !idSet.has(id)),
      tasksEverCompleted: everUnion,
      tasksClearedAfterCompletion: clearedAfterUnion,
      hintState: newHintState,
      noteClearConfirm: null
    }, false);
  }

  function openNoteTaskDialog() {
    setState({ taskDialog: { message: "" } }, false);
  }

  function openRoutingNoteTaskDialog() {
    setState({ taskDialog: { message: "", mode: "routing" } }, false);
  }

  function closeNoteTaskDialog() {
    // Closing the note when its chapter's tasks are all done advances to the
    // next chapter — this is the "come back later, open the note, close it"
    // path that mirrors finishing the last task. 2.2 (chapter-5) -> 2.3;
    // 2.3 (chapter-6) -> 2.4.
    const noteCloseTarget =
      state.chapterId === "chapter-5" && allNoteTasksCompletedIn() ? chapter23StartTarget()
      : state.chapterId === "chapter-6" && allRoutingTasksCompletedIn() ? chapter24StartTarget()
      : null;
    if (noteCloseTarget) {
      return setState({
        ...noteCloseTarget,
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
        { id: "source-1", type: "source", x: (task.id === "Mux" || task.id === "DMux") ? 45 : 80, y: 288 },
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
      requirementsPanelHidden: false,
      muxTable: taskId === "Mux" ? createEmptyMuxTable() : taskId === "DMux" ? createEmptyDmuxTable() : null,
      workspace
    }, false);
  }

  function openNotTaskWorkspace() {
    openTaskWorkspace("Not");
  }

  // Open the build workspace for a chapter 2.4 bus task (e.g. Not4). The learner
  // gets just the bus card centred on the table and builds the circuit inside it
  // from splitters, NOTs and the other gates. The check adds a splitter harness.
  function openBusTaskWorkspace(taskId) {
    const def = busTaskDefById(taskId);
    if (!def) return;
    const chapter = chapterById("chapter-7");
    // Remember the worktable panel so completing the task returns there with the
    // note reopened for the next task.
    const returnChapterId = state.chapterId;
    const returnPanelIndex = Number.isInteger(state.panelIndex) ? state.panelIndex : null;
    const workspace = {
      ...createDefaultWorkspace(),
      components: [
        // The card sits well right of centre so the input harness has room on
        // the left and the output harness has room on the right.
        { id: "task-card-1", type: taskCardComponentType(def.id), x: 640, y: 288 },
        // The check's single voltage source, pre-placed opposite the card's
        // centre. The space to its right is left free for the input splitter.
        { id: "source-1", type: "source", x: 65, y: 288 }
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
      exitTargetPanelIndex: returnPanelIndex,
      sessionReturnChapterId: returnChapterId,
      sessionReturnPanelIndex: returnPanelIndex,
      taskId: def.id,
      taskIntroSeen: false
    };
    setState({
      screen: "workspace",
      chapterId: chapter.id,
      sceneId: chapter.sceneId,
      started: true,
      dialog: null,
      taskDialog: null,
      busesNoteList: false,
      requirementsPanelHidden: false,
      muxTable: null,
      workspace
    }, false);
  }

  // Open the build workbench for a multi-bit routing task (Dmux4way / Mux4way16).
  // Mirrors openBusTaskWorkspace: the task-card frame sits right of centre with a
  // single voltage source pre-placed on the left; the learner builds the card's
  // internals inside the frame. Returning lands back on the worktable note.
  function openMultibitTaskWorkspace(taskId) {
    const def = multibitTaskDefById(taskId);
    if (!def) return;
    const chapter = chapterById("chapter-7");
    const returnChapterId = state.chapterId;
    const returnPanelIndex = Number.isInteger(state.panelIndex) ? state.panelIndex : null;
    const workspace = {
      ...createDefaultWorkspace(),
      components: [
        { id: "task-card-1", type: taskCardComponentType(def.id), x: 640, y: 288 },
        { id: "source-1", type: "source", x: 65, y: 288 }
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
      exitTargetPanelIndex: returnPanelIndex,
      sessionReturnChapterId: returnChapterId,
      sessionReturnPanelIndex: returnPanelIndex,
      taskId: def.id,
      taskIntroSeen: false
    };
    setState({
      screen: "workspace",
      chapterId: chapter.id,
      sceneId: chapter.sceneId,
      started: true,
      dialog: null,
      taskDialog: null,
      busesNoteList: false,
      requirementsPanelHidden: false,
      muxTable: null,
      workspace
    }, false);
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
      if (workspaceSkipDisabled()) return;
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

    // The 2.4 closing monologue leads into chapter 2.5 — skip jumps there.
    if (busesClosingMonologue()) {
      const nextChapter = CHAPTERS[chapterIndex + 1];
      if (nextChapter) return openChapter(nextChapter.id);
    }

    const patch = { panelIndex: skipTargetPanelIndex(), started: true, replayNonce: state.replayNonce + 1, dialog: null };
    // Skipping the 2.4 opening also skips examining the new bus and splitter, so
    // mark them seen — otherwise the worktable's tasks note stays locked behind
    // "קודם תבדוק את כל הציוד".
    if (chapter.id === "chapter-7") patch.busesEquipmentSeen = ["bus", "splitter"];
    setState(patch, true);
  }

  // Chapter 2.5 (arithmetic) uses a milestone-based "דלג": each narrative section
  // skips forward to the start of the next interactive milestone. Combined with
  // the usual step-mode gate (skipTargetReached), the shortcut only lights up
  // once the learner has NATURALLY reached that milestone; in see-everything mode
  // it is available from the start. Milestones (by the panel a section leads to):
  //   library slides (panel100–101)     → panel102 (first slide after the library task)
  //   binary teaching (panel102–106)    → panel107 (where the booklet tasks appear)
  //   booklet…handover (panel107–118)   → panel119 (where the note tasks appear)
  function arithSkipTarget() {
    if (currentChapter()?.id !== "chapter-8") return null;
    const scene = currentScene();
    if (!scene) return null;
    const afterLibrary = panelIndexByImage(scene, "panel102_chapter_2_5_library_vn.svg");
    const booklet = panelIndexByImage(scene, "panel107_chapter_2_5_workshop.svg");
    const noteTasks = panelIndexByImage(scene, "panel119_chapter_2_5_worktable.svg");
    const p = state.panelIndex;
    if (afterLibrary >= 0 && p < afterLibrary) return afterLibrary;
    if (booklet >= 0 && p < booklet) return booklet;
    if (noteTasks >= 0 && p < noteTasks) return noteTasks;
    return null;
  }

  // Where the "דלג" shortcut lands in the current story scene. In 2.4 that is the
  // worktable — but once PAST that worktable (i.e. inside the von Neumann
  // monologue) it becomes the next-tasks worktable that closes the monologue,
  // so skipping the monologue moves the plot forward rather than back to the
  // original worktable.
  function skipTargetPanelIndex() {
    const scene = currentScene();
    if (!scene) return 0;
    // Chapter 2.5: milestone-based skip target (see arithSkipTarget).
    const arithTarget = arithSkipTarget();
    if (arithTarget != null) return arithTarget;
    // 2.1 (chapter-4): skip opens the Nand workbench, whose story trigger is the
    // launch panel — that is the point the learner must reach for the shortcut.
    if (currentChapter()?.id === "chapter-4") {
      const launch = workspaceLaunchPanelIndex(scene);
      return Number.isInteger(launch) && launch >= 0 ? launch : Math.max(scene.panels.length - 1, 0);
    }
    const worktableIndex = panelIndexByImage(scene, "panel99_chapter_2_4_worktable.svg");
    const nextWorktableIndex = panelIndexByImage(scene, "panel99g_chapter_2_4_worktable_next.svg");
    const lastIndex = Math.max(scene.panels.length - 1, 0);
    // Past the next-tasks worktable (the closing "go to sleep" monologue) → skip
    // to the end of the scene.
    if (nextWorktableIndex >= 0 && state.panelIndex > nextWorktableIndex) return lastIndex;
    // Inside the first von Neumann monologue → skip forward to the next-tasks
    // worktable that closes it.
    if (worktableIndex >= 0 && nextWorktableIndex >= 0 && state.panelIndex > worktableIndex) {
      return nextWorktableIndex;
    }
    if (worktableIndex >= 0) return worktableIndex;
    return lastIndex;
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
      explanationsAnnounced: [],
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

  // Open an external reference (a hotspot over a book/journal/sign) in a new
  // browser tab, without handing the opened page a reference back to us.
  function openExternalUrl(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // A converter that is wired to nothing loses its fixed width, so it is free to
  // adopt a different bus width next time it is connected.
  function syncConverterWidths(workspace) {
    for (const component of workspace.components) {
      if (component.type !== "converter-in" && component.type !== "converter-out") continue;
      const wired = workspace.wires.some((wire) => wire.a.startsWith(`${component.id}.`) || wire.b.startsWith(`${component.id}.`));
      if (!wired && component.width != null) component.width = null;
    }
  }

  function withWorkspace(mutator) {
    const workspace = normalizeWorkspace(state.workspace);
    mutator(workspace);
    syncConverterWidths(workspace);
    workspace.selectedTerminal = terminalExists(workspace, workspace.selectedTerminal) ? workspace.selectedTerminal : null;
    workspace.unlocked = true;
    workspace.accident = detectWorkspaceAccident(workspace);
    if (workspace.accident) workspace.selectedTerminal = null;
    // Burning a Nand (over-voltage) earns the "משחית ציוד" achievement.
    if (workspace.accident?.type === "nand-overvoltage") unlockAchievement("equipment-destroyer");
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
      const component = { id, type, x: pos.x, y: pos.y };
      if (type === "splitter") {
        component.outputs = 4;
        component.mirrored = false;
      }
      workspace.components.push(component);
      workspace.selectedTerminal = null;
      // A freshly placed splitter is focused so its mirror handle shows.
      workspace.focusedComponentId = type === "splitter" ? id : null;
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

  // ---- dec→bin converter digit editing --------------------------------------
  // A converter's fixed bus width (null while undetermined) — the same source
  // the display and the pin use, so digit indices always line up.
  function converterFixedWidth(comp) {
    return Number.isInteger(comp?.width) && comp.width >= 1 ? comp.width : null;
  }
  // The digit string as shown (value padded to the digit count; longer if the
  // value itself is longer). Identical to board-render's converterDigits.
  function converterDisplayString(componentId, workspace = state.workspace) {
    const comp = componentById(workspace, componentId);
    const value = Math.max(0, Math.floor(Number(comp?.value) || 0));
    const dc = comp ? converterDisplayDigits(comp) : 5;
    const raw = String(value);
    return raw.length >= dc ? raw : raw.padStart(dc, "0");
  }

  // Single click on a digit: bump it +1 (mod 10). If the result exceeds what the
  // connected bus can hold, show a message and leave the value unchanged.
  function incrementConverterDigit(componentId, digitIndex) {
    const workspace = state.workspace;
    const comp = componentById(workspace, componentId);
    if (!comp || comp.type !== "converter-out") return;
    const w = converterFixedWidth(comp);
    const ds = converterDisplayString(componentId, workspace).split("");
    const idx = Number(digitIndex);
    if (!(idx >= 0 && idx < ds.length)) return;
    ds[idx] = String((Number(ds[idx]) + 1) % 10);
    const nv = parseInt(ds.join(""), 10) || 0;
    if (w != null && nv > Math.pow(2, w) - 1) {
      return setState({ infoDialog: "המספר גדול מדי לרוחב הבס." });
    }
    withWorkspace((ws) => { const c = componentById(ws, componentId); if (c) c.value = nv; });
  }

  // Double click on a converter: type the number directly. Rejects a value that
  // is too big for the connected bus.
  function editConverterValue(componentId) {
    const workspace = state.workspace;
    const comp = componentById(workspace, componentId);
    if (!comp || comp.type !== "converter-out") return;
    const w = converterFixedWidth(comp);
    const current = Math.max(0, Math.floor(Number(comp.value) || 0));
    const raw = window.prompt("הקלד מספר עשרוני:", String(current));
    if (raw == null) return;
    const nv = Math.max(0, Math.floor(Number(String(raw).trim())));
    if (!Number.isFinite(nv)) return setState({ infoDialog: "צריך להקליד מספר." });
    if (w != null && nv > Math.pow(2, w) - 1) {
      return setState({ infoDialog: "המספר גדול מדי לרוחב הבס." });
    }
    withWorkspace((ws) => { const c = componentById(ws, componentId); if (c) c.value = nv; });
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

  // --- Splitter focus / mirror / output-count -------------------------------
  // A splitter shows its mirror handle while focused; double-clicking it opens a
  // little box to change how many outputs it has. Wiring signals through it is
  // not implemented yet.
  function splitterById(id) {
    const component = componentById(state.workspace, id);
    return component && component.type === "splitter" ? component : null;
  }

  // Half the drawn height of a splitter (from centre to the outermost output),
  // used to place its focus controls. Must match splitterBoardMarkup's spacing.
  function splitterHalfHeight(component) {
    const n = Math.min(16, Math.max(2, Number(component?.outputs) || 4));
    return ((n - 1) * 34) / 2 + 13;
  }

  // ---- Splitter pins & bus widths ------------------------------------------
  function splitterOutputCount(component) {
    return Math.min(16, Math.max(2, Number(component?.outputs) || 4));
  }

  // Leg 0 is the BOTTOM leg (largest y); legs count upward. This matches the
  // project convention that cable/component 0 is the lowest one — the same
  // component that appears rightmost in a truth-table row.
  function splitterOutputYs(n) {
    const ys = [];
    for (let i = 0; i < n; i++) ys.push(Math.round(((n - 1) / 2 - i) * SPLITTER_OUTPUT_SPACING));
    return ys;
  }

  // The splitter's pins depend on the instance: one "single" spine pin and one
  // "leg" pin per output. Mirroring flips the geometry AND swaps the roles —
  // unmirrored the single pin is the input and the legs are outputs; mirrored
  // the single pin is the output and the legs are inputs.
  function splitterPins(component) {
    const n = splitterOutputCount(component);
    const mirrored = Boolean(component?.mirrored);
    const pins = {
      single: { x: mirrored ? 70 : -70, y: 0, direction: mirrored ? "out" : "in", label: "פין ראשי של המפצל" }
    };
    splitterOutputYs(n).forEach((y, i) => {
      pins[`leg${i}`] = { x: mirrored ? -66 : 66, y, direction: mirrored ? "in" : "out", label: `פין מפצל ${i + 1}` };
    });
    return pins;
  }

  // The card frame's connectable pins, resolved from the card being defined. Like
  // a task card, each pin is a passthrough: an EXTERNAL end (outside the frame,
  // for wiring a source/lamp while testing) and an INTERNAL end (inside, for the
  // circuit), electrically linked by the engine. Input: ext "in" -> int "out".
  // Output: int "in" -> ext "out". Each carries its per-pin bus width.
  function cardFramePins() {
    const cc = state.cardCreation;
    if (!cc) return {};
    const pins = {};
    const nIn = Math.min(8, Math.max(1, Math.round(Number(cc.inputs) || 1)));
    const nOut = Math.min(8, Math.max(1, Math.round(Number(cc.outputs) || 1)));
    for (let i = 0; i < nIn; i += 1) {
      const y = cardCreationPinY(i, nIn) - 288;
      const w = Math.round(Number((cc.inputWidths || [])[i]) || 1);
      pins[`inputExt${i}`] = { x: -340, y, direction: "in", width: w, label: `כניסה ${i + 1} חיצונית` };
      pins[`inputInt${i}`] = { x: -260, y, direction: "out", width: w, label: `כניסה ${i + 1} פנימית` };
    }
    for (let i = 0; i < nOut; i += 1) {
      const y = cardCreationPinY(i, nOut) - 288;
      const w = Math.round(Number((cc.outputWidths || [])[i]) || 1);
      pins[`outputInt${i}`] = { x: 260, y, direction: "in", width: w, label: `יציאה ${i + 1} פנימית` };
      pins[`outputExt${i}`] = { x: 340, y, direction: "out", width: w, label: `יציאה ${i + 1} חיצונית` };
    }
    return pins;
  }

  // How many digits a converter shows: enough for its (fixed) bus width, but
  // never fewer than the value it already holds. Drives both the rendered body
  // width and the bus-pin position, so they always line up.
  function converterDisplayDigits(component) {
    const w = Number.isInteger(component?.width) && component.width >= 1 ? Math.min(component.width, 40) : null;
    const base = Math.min(12, w ? String(Math.pow(2, w) - 1).length : 5);
    const value = Math.max(0, Math.floor(Number(component?.value) || 0));
    return Math.max(base, String(value).length);
  }

  // Where a converter's bus pin sits: the tip of the drawn stub, whose distance
  // from centre grows with the digit count. Geometry MIRRORS js/component-visuals.js
  // converterMarkup — kept in sync so the pin lands exactly on the visible stub
  // tip. (Inlined here, as a hoisted function, because pin resolution runs during
  // the initial loadState — before the component-visuals wrappers initialise.)
  function converterPinOffsetX(n) {
    const glyphW = 26, gap = 9, padX = 12, margin = 8, ext = 46;
    const k = Math.max(1, n);
    const screenW = k * glyphW + (k - 1) * gap + padX * 2;
    return screenW / 2 + margin + ext;
  }
  // Converter pins are dynamic: the single bus pin sits at the tip of the stub,
  // which moves as the digit count (hence casing width) changes.
  function converterPins(component) {
    const px = converterPinOffsetX(converterDisplayDigits(component));
    if (component.type === "converter-out") return { out: { x: px, y: 0, direction: "out", label: "יציאת הבס" } };
    return { in: { x: -px, y: 0, direction: "in", label: "כניסת הבס" } };
  }

  function componentPins(component) {
    if (component?.type === "splitter") return splitterPins(component);
    if (component?.type === "cardFrame") return cardFramePins();
    if (component?.type === "converter-in" || component?.type === "converter-out") return converterPins(component);
    return WORKSPACE_COMPONENT_DEFS[component?.type]?.pins || {};
  }

  // ---- User-saved cards ------------------------------------------------------
  // A saved card is drawn as a generic chip: a rounded body with its input pins
  // on the left and output pins on the right, and its name beneath. The body and
  // the pins share one geometry so the drawn stubs land on the wiring terminals.
  // (SAVED_CARD_PREFIX is declared near the top of the IIFE — registerAllSavedCards
  // runs at load, before this point, so it must be initialised earlier.)
  function savedCardByType(type) {
    return (state.savedCards || []).find((card) => card.type === type) || null;
  }
  // Does `cardType` use `targetType` — directly or through a chain of other saved
  // cards? True also when they are the same card. Used to (a) keep the card being
  // edited, and anything that depends on it, out of the edit toolbar (no cycles),
  // and (b) warn before deleting a card others rely on.
  function cardUsesCard(cardType, targetType, seen = new Set()) {
    if (cardType === targetType) return true;
    if (seen.has(cardType)) return false;
    seen.add(cardType);
    const card = savedCardByType(cardType);
    if (!card) return false;
    return (card.logic?.components || []).some((c) =>
      String(c.type).startsWith(SAVED_CARD_PREFIX) && cardUsesCard(c.type, targetType, seen));
  }
  function savedCardGeometry(card) {
    const nIn = Math.max(1, (card.inputs || []).length);
    const nOut = Math.max(1, (card.outputs || []).length);
    const rows = Math.max(nIn, nOut);
    const spacing = 30;
    const bodyW = 104;
    const bodyH = Math.max(70, rows * spacing + 24);
    const ys = (n) => Array.from({ length: n }, (_, i) => Math.round((i - (n - 1) / 2) * spacing));
    return { nIn, nOut, bodyW, bodyH, inX: -(bodyW / 2 + 24), outX: bodyW / 2 + 24, inYs: ys(nIn), outYs: ys(nOut) };
  }
  function savedCardPins(card) {
    const g = savedCardGeometry(card);
    const iw = card.inputs || [];
    const ow = card.outputs || [];
    const pins = {};
    g.inYs.forEach((y, i) => {
      pins[`in${i}`] = { x: g.inX, y, direction: "in", width: Math.round(Number(iw[i]) || 1), label: `כניסה ${i + 1} של ${card.name}` };
    });
    g.outYs.forEach((y, i) => {
      pins[`out${i}`] = { x: g.outX, y, direction: "out", width: Math.round(Number(ow[i]) || 1), label: `יציאה ${i + 1} של ${card.name}` };
    });
    return pins;
  }
  // The component type of the pass-through "frame" a saved card is expanded into
  // when its circuit is simulated (see flattenWorkspaceForEval). It carries the
  // ext/int input & output pins the engine's card pass-through logic understands.
  function savedCardFrameType(card) {
    return `usercardFrame-${String(card.type).slice(SAVED_CARD_PREFIX.length)}`;
  }
  function savedCardFramePins(card) {
    const iw = card.inputs || [];
    const ow = card.outputs || [];
    const pins = {};
    iw.forEach((w, i) => {
      const width = Math.round(Number(w) || 1);
      pins[`inputExt${i}`] = { x: -340, y: i * 40, direction: "in", width, label: `כניסה ${i + 1} חיצונית` };
      pins[`inputInt${i}`] = { x: -260, y: i * 40, direction: "out", width, label: `כניסה ${i + 1} פנימית` };
    });
    ow.forEach((w, i) => {
      const width = Math.round(Number(w) || 1);
      pins[`outputInt${i}`] = { x: 260, y: i * 40, direction: "in", width, label: `יציאה ${i + 1} פנימית` };
      pins[`outputExt${i}`] = { x: 340, y: i * 40, direction: "out", width, label: `יציאה ${i + 1} חיצונית` };
    });
    return pins;
  }
  // Register a saved card as a placeable component: its def (pins/bounds/label)
  // goes into the shared table so componentDef/clamp/toolbar all recognise it.
  // The paired frame type (used only during simulation) is registered too.
  function registerSavedCard(card) {
    const g = savedCardGeometry(card);
    WORKSPACE_COMPONENT_DEFS[card.type] = {
      label: card.name,
      savedCard: true,
      pins: savedCardPins(card),
      bounds: { left: g.bodyW / 2 + 40, right: g.bodyW / 2 + 40, top: g.bodyH / 2 + 16, bottom: g.bodyH / 2 + 44 }
    };
    WORKSPACE_COMPONENT_DEFS[savedCardFrameType(card)] = {
      label: card.name,
      fixed: true,
      pins: savedCardFramePins(card)
    };
  }
  function registerAllSavedCards() {
    (state.savedCards || []).forEach(registerSavedCard);
  }
  // The generic-chip markup (body + pin stubs + name), used on the board and (in
  // miniature, name suppressed) in the toolbar icon.
  function savedCardMarkup(type, options = {}) {
    const card = savedCardByType(type);
    if (!card) return "";
    const g = savedCardGeometry(card);
    const iw = card.inputs || [];
    const ow = card.outputs || [];
    const stub = (xInner, xOuter, y, width) => {
      if (width <= 1) return `<line class="usercard-pin" x1="${xInner}" y1="${y}" x2="${xOuter}" y2="${y}" />`;
      // A bus pin: draw it as a bus bar and, on the board, print its width above
      // the stub so the learner can read how wide the bus is.
      const label = options.toolbar ? "" : `<text class="splitter-width-label" x="${(xInner + xOuter) / 2}" y="${y - 11}" text-anchor="middle">${width}</text>`;
      return `<line class="usercard-bus" x1="${xInner}" y1="${y}" x2="${xOuter}" y2="${y}" /><line class="usercard-bus-stripe" x1="${xInner + (xOuter > xInner ? 3 : -3)}" y1="${y}" x2="${xOuter - (xOuter > xInner ? 3 : -3)}" y2="${y}" />${label}`;
    };
    let s = `<rect class="usercard-body" x="${-g.bodyW / 2}" y="${-g.bodyH / 2}" width="${g.bodyW}" height="${g.bodyH}" rx="12" />`;
    s += `<rect class="usercard-chip" x="${-g.bodyW / 2 + 22}" y="${-g.bodyH / 2 + 16}" width="${g.bodyW - 44}" height="${g.bodyH - 32}" rx="6" />`;
    g.inYs.forEach((y, i) => { s += stub(-g.bodyW / 2, g.inX, y, Math.round(Number(iw[i]) || 1)); });
    g.outYs.forEach((y, i) => { s += stub(g.bodyW / 2, g.outX, y, Math.round(Number(ow[i]) || 1)); });
    if (!options.toolbar) {
      s += `<text class="usercard-name" x="0" y="${g.bodyH / 2 + 26}" text-anchor="middle">${esc(card.name)}</text>`;
    }
    return `<g class="usercard">${s}</g>`;
  }

  // Expand every placed saved card into its stored internal circuit so the
  // engine can simulate it. Each usercard-N component becomes a pass-through
  // frame (usercardFrame-N, keeping the same id) wired to the card's internal
  // components (given prefixed ids). The frame's ext pins map to the card's
  // outer in{i}/out{i}; its int pins carry the card's internal frame node
  // (card-frame-1). Runs recursively so cards built from other cards expand too,
  // with a depth cap as a guard against a card that (accidentally) contains
  // itself. Returns the workspace unchanged when it holds no saved cards.
  function flattenWorkspaceForEval(workspace, depth = 0) {
    const comps = workspace.components || [];
    if (!comps.some((c) => String(c.type).startsWith(SAVED_CARD_PREFIX))) return workspace;
    if (depth > 8) return workspace;

    const remapOuter = (ref, cid) => {
      if (typeof ref !== "string" || !ref.startsWith(`${cid}.`)) return ref;
      const pin = ref.slice(cid.length + 1);
      const inM = pin.match(/^in(\d+)$/);
      if (inM) return `${cid}.inputExt${inM[1]}`;
      const outM = pin.match(/^out(\d+)$/);
      if (outM) return `${cid}.outputExt${outM[1]}`;
      return ref;
    };
    const remapInternal = (ref, cid, prefix) => {
      if (typeof ref !== "string") return ref;
      const dot = ref.indexOf(".");
      if (dot < 0) return ref;
      const compId = ref.slice(0, dot);
      const pin = ref.slice(dot + 1);
      // The card-build frame anchor becomes the outer card's pass-through frame.
      if (compId === "card-frame-1") return `${cid}.${pin}`;
      return `${prefix}${compId}.${pin}`;
    };

    const components = [];
    let wires = (workspace.wires || []).map((w) => ({ ...w }));

    for (const comp of comps) {
      const type = String(comp.type);
      if (!type.startsWith(SAVED_CARD_PREFIX)) { components.push(comp); continue; }
      const card = savedCardByType(type);
      // Replace the card with its pass-through frame (same id) and rewrite the
      // outer wires touching it from in{i}/out{i} to the frame's ext pins.
      const frameType = card ? savedCardFrameType(card) : `usercardFrame-${type.slice(SAVED_CARD_PREFIX.length)}`;
      components.push({ id: comp.id, type: frameType, x: comp.x, y: comp.y });
      wires = wires.map((w) => ({ ...w, a: remapOuter(w.a, comp.id), b: remapOuter(w.b, comp.id) }));
      if (!card || !card.logic) continue;
      const prefix = `${comp.id}~`;
      for (const ic of (card.logic.components || [])) {
        components.push({ ...ic, id: `${prefix}${ic.id}` });
      }
      for (const iw of (card.logic.wires || [])) {
        wires.push({ ...iw, a: remapInternal(iw.a, comp.id, prefix), b: remapInternal(iw.b, comp.id, prefix) });
      }
    }

    return flattenWorkspaceForEval({ ...workspace, components, wires }, depth + 1);
  }

  // The op/width of a placeable bus gate (gate-Not4 etc.), or null for anything
  // else. The circuit engine and the visuals use it to apply the op per bit and
  // to label the gate.
  function busGateSpec(type) {
    const def = WORKSPACE_COMPONENT_DEFS[type];
    if (!def || !def.busGate) return null;
    // `control`: the last input is a single shared control bit (the MUX select),
    // not another per-bit bus.
    return { op: def.op, inputs: def.inputs || 1, width: def.busWidth, label: def.label, control: Boolean(def.control) };
  }

  // A placeable bus-adder gate (gate-Add4): two width-N number buses plus a
  // single-bit carry-in, adding to a width-N sum (out1) and a carry-out (out2).
  function arithBusGateSpec(type) {
    const def = WORKSPACE_COMPONENT_DEFS[type];
    if (!def || !def.busAdder) return null;
    return { width: def.busWidth };
  }

  // A pin's bus width. Regular pins are single wires (1). A splitter's pins are
  // undefined (null) until a connection fixes its width; a leg pin is then that
  // width and the single pin is width * output-count.
  function pinWidth(workspace, ref) {
    const info = pinDefFor(workspace, ref);
    if (!info) return null;
    // A converter's width is undetermined (null) until it is wired to a bus of
    // known width, which fixes it (applyWireWidthDefinition). While null,
    // wireWidthLegal accepts ANY bus; once fixed, the converter itself can define
    // the width of a still-undetermined bus (e.g. dec→bin driving a bin→dec).
    if (info.component.type === "converter-in" || info.component.type === "converter-out") {
      return Number.isInteger(info.component.width) && info.component.width >= 1 ? info.component.width : null;
    }
    if (info.component.type !== "splitter") {
      // A per-pin width wins (e.g. the MUX control pin is 1 bit on a width-4
      // card); otherwise a bus card's pins are buses of the card's width.
      if (Number.isInteger(info.pin?.width)) return info.pin.width;
      const def = WORKSPACE_COMPONENT_DEFS[info.component.type];
      if (def && Number.isInteger(def.busWidth)) return def.busWidth;
      return 1;
    }
    const w = Number.isInteger(info.component.width) ? info.component.width : null;
    if (w === null) return null;
    return info.pinId === "single" ? w * splitterOutputCount(info.component) : w;
  }

  function isSplitterSinglePin(workspace, ref) {
    const info = pinDefFor(workspace, ref);
    return Boolean(info && info.component.type === "splitter" && info.pinId === "single");
  }

  // Whether a candidate connection between a and b obeys the width rules: at
  // least one side defined; two defined widths must be equal; defining a
  // splitter's single pin requires the width to divide its output count.
  function wireWidthLegal(workspace, a, b) {
    const wa = pinWidth(workspace, a);
    const wb = pinWidth(workspace, b);
    if (wa === null && wb === null) return false;
    if (wa !== null && wb !== null) return wa === wb;
    const defined = wa !== null ? wa : wb;
    const undefRef = wa === null ? a : b;
    if (isSplitterSinglePin(workspace, undefRef)) {
      const info = pinDefFor(workspace, undefRef);
      return defined % splitterOutputCount(info.component) === 0;
    }
    return true;
  }

  // After a legal wire is added, fix the width of the newly-defined splitter (if
  // one side was undefined). Setting the splitter's width defines all its pins.
  function applyWireWidthDefinition(workspace, a, b) {
    const wa = pinWidth(workspace, a);
    const wb = pinWidth(workspace, b);
    if ((wa === null) === (wb === null)) return;
    const defined = wa !== null ? wa : wb;
    const undefRef = wa === null ? a : b;
    const info = pinDefFor(workspace, undefRef);
    if (!info) return;
    const component = componentById(workspace, info.component.id);
    if (!component) return;
    // A converter adopts the connected bus width directly; a splitter's single
    // pin spreads the width across its legs.
    if (info.component.type === "converter-in" || info.component.type === "converter-out") {
      component.width = defined;
      return;
    }
    if (info.component.type !== "splitter") return;
    component.width = info.pinId === "single"
      ? Math.round(defined / splitterOutputCount(component))
      : defined;
  }

  function focusWorkspaceComponent(id) {
    const component = componentById(state.workspace, id);
    const focusId = component && component.type === "splitter" ? id : null;
    if (state.workspace.focusedComponentId === focusId) return;
    const workspace = normalizeWorkspace(state.workspace);
    workspace.focusedComponentId = focusId;
    setState({ workspace }, false);
  }

  function clearWorkspaceFocus() {
    if (!state.workspace.focusedComponentId) return;
    const workspace = normalizeWorkspace(state.workspace);
    workspace.focusedComponentId = null;
    setState({ workspace }, false);
  }

  function toggleSplitterMirror(id) {
    if (!splitterById(id)) return;
    withWorkspace((workspace) => {
      const component = componentById(workspace, id);
      if (component && component.type === "splitter") {
        component.mirrored = !component.mirrored;
        workspace.focusedComponentId = id;
      }
    });
  }

  // Change the number of outputs (committed on change). Because the fan-out
  // determines the width relationship, changing it clears the fixed width and
  // any wiring on this splitter.
  function setSplitterOutputs(id, value) {
    const current = splitterById(id);
    if (!current) return;
    const raw = parseInt(value, 10);
    if (!Number.isFinite(raw)) return;
    const n = Math.min(16, Math.max(2, raw));
    if (current.outputs === n) return;
    withWorkspace((workspace) => {
      const component = componentById(workspace, id);
      if (!component || component.type !== "splitter") return;
      component.outputs = n;
      component.width = null;
      workspace.wires = workspace.wires.filter((wire) => !wire.a.startsWith(`${id}.`) && !wire.b.startsWith(`${id}.`));
    });
  }

  // ---- Splitter leg-count drag handle --------------------------------------
  // Dragging the handle under a focused splitter (see renderSplitterControls +
  // js/splitter-resize.js) grows/shrinks its leg count live. The mapping from a
  // vertical drag distance to a leg count lives in the splitter-resize module;
  // committing a new count reuses setSplitterOutputs (which clears the fixed
  // width and any wiring, exactly like the old number box did).
  function startSplitterResize(id, event) {
    if (state.screen !== "workspace") return;
    const component = splitterById(id);
    if (!component) return;
    const point = boardPointFromEvent(event);
    if (!point) return;
    dragState = {
      kind: "splitter-resize",
      componentId: id,
      pointerId: event.pointerId,
      startY: point.y,
      startOutputs: splitterOutputCount(component),
      moved: false
    };
    event.target.setPointerCapture?.(event.pointerId);
  }

  function updateSplitterResize(event) {
    if (!dragState || dragState.kind !== "splitter-resize" || event.pointerId !== dragState.pointerId) return;
    const point = boardPointFromEvent(event);
    if (!point) return;
    const dy = point.y - dragState.startY;
    if (Math.abs(dy) > 4) dragState.moved = true;
    const n = __splitterResize.outputsForDrag(dragState.startOutputs, dy);
    const current = splitterById(dragState.componentId);
    // setSplitterOutputs re-renders (and no-ops when the count is unchanged);
    // document-level pointer listeners keep firing across the re-render even
    // though the captured handle element is replaced.
    if (current && current.outputs !== n) setSplitterOutputs(dragState.componentId, n);
  }

  function finishSplitterResize(event) {
    if (!dragState || dragState.kind !== "splitter-resize" || event.pointerId !== dragState.pointerId) return;
    const finished = dragState;
    dragState = null;
    // Swallow the click that a drag would otherwise fire (it would toggle the
    // splitter's focus off). A plain tap on the handle (no move) is left alone.
    if (finished.moved) {
      suppressNextClick = true;
      window.setTimeout(() => { suppressNextClick = false; }, 0);
    }
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

    // A dec→bin converter may hold a value too big for a narrow bus. While
    // unconnected any value looks fine, but wiring it to a bus that can't hold
    // the value is refused with a message (the value stays, the wire is not made).
    if (converterConnectionTooNarrow(workspace, workspace.selectedTerminal, ref)) {
      workspace.selectedTerminal = null;
      return setState({ workspace, infoDialog: "המספר גדול מדי לרוחב הבס." });
    }

    toggleWire(workspace.selectedTerminal, ref);
  }

  // True when wiring a/b would connect a dec→bin converter whose stored decimal
  // value exceeds what the bus on the OTHER end can represent.
  function converterConnectionTooNarrow(workspace, a, b) {
    for (const [self, other] of [[a, b], [b, a]]) {
      const info = pinDefFor(workspace, self);
      if (!info || info.component.type !== "converter-out") continue;
      const w = pinWidth(workspace, other);
      if (!Number.isInteger(w) || w < 1) continue;
      const value = Math.max(0, Math.floor(Number(info.component.value) || 0));
      if (value > Math.pow(2, w) - 1) return true;
    }
    return false;
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

    if (component) {
      for (const pinId of Object.keys(componentPins(component))) {
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

    // A click without a drag focuses a splitter (and shows its mirror handle);
    // clicking any other component clears the focus.
    return focusWorkspaceComponent(finished.componentId);
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

  // Settings form fields update state in place and persist WITHOUT a re-render,
  // so the age text box does not lose focus on every keystroke.
  function updateSetting(key, value) {
    const settings = normalizedSettings({ ...normalizedSettings(state.settings), [key]: value });
    state = { ...state, settings };
    saveState();
  }

  function handleSettingEvent(event) {
    const field = event.target.closest("[data-setting]");
    if (!field) return;
    const key = field.dataset.setting;
    // The recommendation dialog is shown only when LEAVING the recommended
    // "step by step" mode (step → all), and only the first time. Switching TO
    // step-by-step applies immediately with no warning. On the warned switch the
    // first attempt does NOT apply — the re-render reverts the <select> and the
    // learner confirms by choosing again.
    if (key === "pace") {
      const currentPace = state.settings?.pace || DEFAULT_PACE;
      if (field.value === "all" && currentPace === "step" && !state.paceHintShown) {
        return setState({ paceHintShown: true, paceDialog: true });
      }
    }
    updateSetting(key, field.value);
  }

  document.addEventListener("input", handleSettingEvent);
  document.addEventListener("change", handleSettingEvent);

  // Card-creation: the input/output count boxes re-draw the frame's pins and
  // resize the width arrays. (The pin-width box commits live on input and closes
  // only on focusout — see below — so a spinner click doesn't dismiss it.)
  // Load a card file picked on the "My cards" page.
  document.addEventListener("change", (event) => {
    const fileInput = event.target.closest("[data-card-file-input]");
    if (!fileInput) return;
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = ""; // allow re-picking the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data = null;
      try { data = JSON.parse(String(reader.result)); } catch { data = null; }
      const err = data ? importCardBundle(data) : "לא הצלחתי לקרוא את הקובץ.";
      if (err) setState({ infoDialog: err });
    };
    reader.onerror = () => setState({ infoDialog: "לא הצלחתי לקרוא את הקובץ." });
    reader.readAsText(file);
  });

  // The optional cloud module (js/auth.js) fires "tom:authchanged" when the
  // signed-in user changes. Signing in earns "מחובר"; while the main menu is
  // open, re-render so the account button flips between "התחבר"/"התנתק".
  window.addEventListener("tom:authchanged", (event) => {
    const user = event.detail && event.detail.user;
    if (user && typeof APP !== "undefined" && APP.unlockAchievement) APP.unlockAchievement("connected");
    if (state.screen === "menu") render();
  });

  // Load a whole-progress file picked from the main menu.
  document.addEventListener("change", (event) => {
    const fileInput = event.target.closest("[data-progress-file-input]");
    if (!fileInput) return;
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = ""; // allow re-picking the same file
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data = null;
      try { data = JSON.parse(String(reader.result)); } catch { data = null; }
      const err = data ? loadProgressFromFile(data) : "לא הצלחתי לקרוא את הקובץ.";
      if (err) setState({ infoDialog: err });
    };
    reader.onerror = () => setState({ infoDialog: "לא הצלחתי לקרוא את הקובץ." });
    reader.readAsText(file);
  });

  document.addEventListener("change", (event) => {
    if (!state.cardCreation) return;
    const box = event.target.closest("[data-card-io]");
    if (!box) return;
    const which = box.dataset.cardIo === "outputs" ? "outputs" : "inputs";
    const val = Math.min(8, Math.max(1, Math.round(Number(box.value) || 1)));
    const cc = { ...state.cardCreation, [which]: val, pinEdit: null };
    const key = which === "inputs" ? "inputWidths" : "outputWidths";
    const arr = [...(cc[key] || [])];
    while (arr.length < val) arr.push(1);
    arr.length = val;
    cc[key] = arr;
    setState({ cardCreation: cc }, false);
  });

  // Double-click a pin's OUTER stub to open its width picker (turn it into a
  // bus). The inner terminal is reserved for wiring, so this uses a separate hit
  // target that doesn't re-render on a single click.
  document.addEventListener("dblclick", (event) => {
    const pin = event.target.closest("[data-card-pin]");
    if (!pin || !state.cardCreation) return;
    const side = pin.dataset.pinSide === "out" ? "out" : "in";
    const index = Math.max(0, Math.round(Number(pin.dataset.pinIndex) || 0));
    setState({ cardCreation: { ...state.cardCreation, pinEdit: { side, index } } }, false);
  });

  // Keep uncontrolled card-creation fields in state WITHOUT re-rendering, so the
  // input keeps focus: the name, and the pin-width box (its value updates live;
  // the box stays open until focus leaves it — see focusout below).
  document.addEventListener("input", (event) => {
    if (!state.cardCreation) return;
    const nameBox = event.target.closest(".card-creation-name");
    if (nameBox) {
      // Strip characters that aren't allowed in a card name as they are typed,
      // so the name is always valid by the time the card is saved.
      const cleaned = nameBox.value.replace(/[^A-Za-z0-9֐-׿ _-]/g, "");
      if (cleaned !== nameBox.value) {
        const caret = Math.max(0, (nameBox.selectionStart || cleaned.length) - (nameBox.value.length - cleaned.length));
        nameBox.value = cleaned;
        try { nameBox.setSelectionRange(caret, caret); } catch (_) { /* ignore */ }
      }
      state.cardCreation.name = nameBox.value;
      return saveState();
    }
    const widthBox = event.target.closest("[data-card-pin-width]");
    if (widthBox && state.cardCreation.pinEdit) {
      const { side, index } = state.cardCreation.pinEdit;
      const w = Math.min(16, Math.max(1, Math.round(Number(widthBox.value) || 1)));
      const key = side === "in" ? "inputWidths" : "outputWidths";
      const arr = [...(state.cardCreation[key] || [])];
      arr[index] = w;
      state.cardCreation[key] = arr;
      saveState();
    }
  });

  // The story-panel answer box: keep the typed value live in state (without a
  // re-render, so focus/caret are preserved) and drop any stale feedback.
  document.addEventListener("input", (event) => {
    const box = event.target.closest && event.target.closest(".panel-question-input");
    if (!box) return;
    state.panelAnswer = { value: box.value, feedback: null };
    saveState();
  });

  // Close the pin-width box only when its focus leaves (a click elsewhere), then
  // re-render so the pin shows its new width. The width was committed live on
  // input, so nothing is lost.
  document.addEventListener("focusout", (event) => {
    if (!state.cardCreation || !state.cardCreation.pinEdit) return;
    if (!event.target.closest("[data-card-pin-width]")) return;
    setState({ cardCreation: { ...state.cardCreation, pinEdit: null } }, false);
  });

  document.addEventListener("keydown", (event) => {
    // Secret dev shortcut: Ctrl+Shift+9 instantly solves the current task and
    // returns to its note (for quickly reaching later tasks while testing).
    // Chosen because Ctrl+Shift+<digit> isn't reserved by browsers or the OS.
    // (event.code is layout-independent, so it works on any keyboard.)
    if (event.ctrlKey && event.shiftKey && event.code === "Digit9") {
      event.preventDefault();
      if (state.screen === "notebook") (state.notebook?.variant === "binary" ? binSecretSolve() : secretSolveNotebook());
      else secretSolveAndExit();
    }
  });

  // The arithmetic notebook grabs the keyboard while it is on screen: the
  // selected cell takes a typed character, Backspace/Delete clears it, the
  // arrows move the selection, Escape deselects.
  document.addEventListener("keydown", (event) => {
    if (state.screen !== "notebook") return;
    if (state.notebook?.variant === "binary") handleBinaryNotebookKey(event);
    else handleNotebookKey(event);
  });

  // Dragging the movable notebook windows (hints / explanation / solution) by
  // their header. The position is applied live to the element and persisted to
  // state on release so it survives re-renders.
  let nbWindowDrag = null;
  document.addEventListener("mousedown", (event) => {
    const handle = event.target.closest("[data-nb-drag]");
    if (!handle) return;
    const win = handle.closest("[data-nb-window]");
    if (!win) return;
    const rect = win.getBoundingClientRect();
    nbWindowDrag = { win, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    win.style.left = `${rect.left}px`;
    win.style.top = `${rect.top}px`;
    win.style.bottom = "auto";
    win.style.transform = "none";
    event.preventDefault();
  });
  document.addEventListener("mousemove", (event) => {
    if (!nbWindowDrag) return;
    const x = Math.max(0, Math.min(window.innerWidth - 60, event.clientX - nbWindowDrag.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 40, event.clientY - nbWindowDrag.dy));
    nbWindowDrag.win.style.left = `${x}px`;
    nbWindowDrag.win.style.top = `${y}px`;
  });
  document.addEventListener("mouseup", () => {
    if (!nbWindowDrag) return;
    const win = nbWindowDrag.win;
    const left = parseInt(win.style.left, 10);
    const top = parseInt(win.style.top, 10);
    nbWindowDrag = null;
    const nb = state.notebook;
    if (nb && Number.isFinite(left) && Number.isFinite(top)) {
      setState({ notebook: { ...nb, winPos: { left, top } } }, false);
    }
  });

  // A converter digit distinguishes single-click (increment mod 10) from
  // double-click (type a value): a lone click is deferred briefly, and a second
  // click on a digit within the window cancels it and opens the text box.
  let pendingConverterDigit = null;

  document.addEventListener("click", (event) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      event.preventDefault();
      return;
    }

    // Post-MUX16 scripted moment: while the "new card" bubble is up, ANY click in
    // the workbench (but not the top nav bar) opens the card-building page and its
    // explainer. Dismissing the explainer ("הבנתי") continues the plot.
    if (
      state.cardIntroPending &&
      state.createCardUnlocked &&
      state.screen === "workspace" &&
      !state.cardCreation &&
      !event.target.closest(".topbar")
    ) {
      event.preventDefault();
      return enterCardCreation();
    }

    const button = event.target.closest("[data-action]");
    if (!button) {
      // During the booklet solution a plain click anywhere advances it, like
      // the "המשך" button (but not clicks inside the movable window itself).
      if (state.screen === "notebook" && binInGridSolution(state.notebook) && !event.target.closest(".nb-window")) {
        event.preventDefault();
        return binWalkAdvance();
      }

      if (state.hintSlides && event.target.closest(".image-shell")) {
        event.preventDefault();
        return nextHintSlide();
      }

      // During the Nand monologue a plain click on the board advances it, the
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
        !currentPanel().question &&
        event.target.closest(".image-shell") &&
        !panelHotspots(currentPanel()).length
      ) {
        event.preventDefault();
        // During a story-panel explanation replay a plain click advances the
        // replay (and returns to the menu at the last slide), like "המשך".
        return explanationReplayActive() ? nextExplanationPanel() : nextPanel();
      }
      return;
    }

    const action = button.dataset.action;

    if (action === "converter-digit") {
      event.preventDefault();
      const componentId = button.dataset.componentId;
      const digitIndex = button.dataset.digitIndex;
      if (pendingConverterDigit) {
        clearTimeout(pendingConverterDigit.timer);
        pendingConverterDigit = null;
        return editConverterValue(componentId);
      }
      const timer = setTimeout(() => {
        pendingConverterDigit = null;
        incrementConverterDigit(componentId, digitIndex);
      }, 230);
      pendingConverterDigit = { timer };
      return;
    }

    if (state.taskDialog && !isGlobalNavigationAction(action) && !["note-task", "note-task-close", "note-clear-open", "note-clear-confirm", "note-clear-cancel"].includes(action)) {
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

    if (state.solutionDialog && !isGlobalNavigationAction(action) && !["solution-ok", "solution-next", "solution-toggle-table", "solution-reveal-create-card"].includes(action)) {
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
    if (action === "chapters") return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "chapters" });
    if (action === "about") return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "about" });
    if (action === "achievements") return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "achievements" });
    if (action === "settings") return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "settings" });
    if (action === "open-not-ready") return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "notReady" });
    if (action === "page-back") {
      const target = IN_GAME_SCREENS.includes(state.pageReturn) ? state.pageReturn : "menu";
      return setState({ ...transientUiClearPatch(), pageReturn: null, screen: target });
    }
    if (action === "pace-dialog-ok") return setState({ paceDialog: false });
    if (action === "info-dialog-ok") return setState({ infoDialog: null });
    if (action === "buses-note") return openBusesNote();
    if (action === "buses-note-close") return setState({ busesNoteList: false });
    if (action === "bus-note-task") return handleBusNoteTask(Number(button.dataset.taskIndex));
    if (action === "multibit-note-task") return handleMultibitNoteTask(button.dataset.taskId);
    if (action === "arith-note-close") {
      // The arith note is the LAST task list in the game. Closing it while every
      // card is already built shows the "המשך יבוא" notice — this is the "come
      // back to this state from elsewhere" trigger (finishing the last task shows
      // the same notice immediately; see finishSolutionDialog).
      const allArithDone = allArithTasksCompletedIn();
      return setState(allArithDone
        ? { arithNoteList: false, infoDialog: "המשך יבוא..." }
        : { arithNoteList: false });
    }
    if (action === "arith-note-task") return handleArithNoteTask(button.dataset.taskId);
    if (action === "splitter-mirror") return toggleSplitterMirror(button.dataset.componentId);
    if (action === "buses-crate-right") return openComponentMonologue("bus");
    if (action === "buses-crate-left") return openComponentMonologue("splitter");
    if (action === "component-monologue-ok") return closeComponentMonologue();
    if (action === "arith-converter-in") return openConverterInfo("in");
    if (action === "arith-converter-out") return openConverterInfo("out");
    if (action === "converter-info-ok") return closeConverterInfo();
    if (action === "explanations") return openExplanationsMenu();
    if (action === "explanations-return") return returnFromExplanationsMenu();
    // Opening any explanation from the הסברים menu earns "למדן".
    if (["explanation-open", "expl-gate-solution", "expl-routing-info", "expl-arith-solution"].includes(action)) {
      unlockAchievement("scholar");
    }
    if (action === "explanation-open") return startExplanation(button.dataset.explanationId);
    if (action === "expl-gate-solution") return showTaskSolution(button.dataset.taskId, { completeOnClose: false, returnToExplanations: true });
    if (action === "expl-routing-info") return setState({ explRoutingInfo: { taskId: button.dataset.taskId } }, false);
    if (action === "expl-routing-info-close") return setState({ explRoutingInfo: null }, false);
    if (action === "expl-arith-solution") return openArithExplanationSolution(button.dataset.arith);
    if (action === "explanations-return-to-menu") return returnToExplanationsMenuFromReplay();
    if (action === "explanation-prev") return previousExplanationPanel();
    if (action === "explanation-next") return nextExplanationPanel();
    if (action === "reset-progress") return openResetProgressDialog();
    if (action === "start") return openChapter(CHAPTERS[0].id);
    if (action === "continue") {
      if (!state.started) return openChapter(CHAPTERS[0].id);
      // Return to the exact in-game screen the learner left (workbench included),
      // as long as it is still valid — a workspace must still be unlocked.
      const resume = state.resumeScreen;
      if (IN_GAME_SCREENS.includes(resume)) {
        const workspaceScreen = resume === "workspace" || resume === "nandBuildHelp";
        if (!workspaceScreen || state.workspace?.unlocked) {
          return setState({ ...transientUiClearPatch(), screen: resume }, resume === "story");
        }
      }
      if (state.workspace.unlocked && ["chapter-4", "chapter-5", "chapter-6"].includes(state.chapterId)) return setState({ ...transientUiClearPatch(), screen: "workspace" }, false);
      return setState({ ...transientUiClearPatch(), screen: "story" }, true);
    }
    if (action === "chapter") {
      if (!chapterReached(button.dataset.chapterId)) return; // locked in step-by-step
      return openChapter(button.dataset.chapterId);
    }
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
    if (action === "open-external-url") return openExternalUrl(button.dataset.url);
    if (action === "stone-millis-book") return openNotebook();
    if (action === "binary-booklet") return openBinaryBooklet();
    if (action === "binbk-cell") return binInGridSolution(state.notebook) ? binWalkAdvance() : binSelectCell(Number(button.dataset.r), Number(button.dataset.c));
    if (action === "binbk-check") return checkBinaryNotebook();
    if (action === "binbk-back") return binBackToWorkshop(false);
    if (action === "binbk-retry") return binRetry();
    if (action === "binbk-hints-open") return binOpenHints();
    if (action === "binbk-hint-select") return binSelectHint(Number(button.dataset.hintIndex));
    if (action === "binbk-hint-close") return binCloseHints();
    if (action === "binbk-walk-open") return binOpenWalkthrough();
    if (action === "binbk-walk-next") return binWalkStep(1);
    if (action === "binbk-walk-prev") return binWalkStep(-1);
    if (action === "binbk-walk-finish") return binWalkthroughFinish();
    if (action === "binbk-addintro-ok") return binAddIntroOk();
    if (action === "binbk-menu-select") return binMenuSelect(button.dataset.stage);
    if (action === "binbk-menu-review") return binMenuReviewDecimal();
    if (action === "notebook-cell") return notebookSelectCell(Number(button.dataset.r), Number(button.dataset.c));
    if (action === "notebook-check") return checkNotebook();
    if (action === "notebook-reset") return resetNotebook();
    if (action === "notebook-back-to-library") return notebookBackToLibrary();
    if (action === "notebook-continue") return notebookContinue();
    if (action === "notebook-next-exercise") return notebookNextExercise();
    if (action === "notebook-retry") return notebookRetry();
    if (action === "notebook-hints-open") return notebookOpenHints();
    if (action === "notebook-hint-select") return notebookSelectHint(Number(button.dataset.hintIndex));
    if (action === "notebook-hint-close") return notebookHintClose();
    if (action === "notebook-hint-apply") return notebookApplyHint(Number(button.dataset.col));
    if (action === "notebook-solution-open") return notebookOpenSolution();
    if (action === "notebook-solution-next") return notebookSolutionNext();
    if (action === "notebook-solution-prev") return notebookSolutionPrev();
    if (action === "open-note-tasks") return openNoteTaskDialog();
    if (action === "open-routing-note-tasks") return openRoutingNoteTaskDialog();
    if (action === "note-task-close") return closeNoteTaskDialog();
    if (action === "note-task") return handleNoteTask(Number(button.dataset.taskIndex));
    if (action === "note-clear-open") return setState({ noteClearConfirm: button.dataset.noteKind || null }, false);
    if (action === "note-clear-cancel") return setState({ noteClearConfirm: null }, false);
    if (action === "note-clear-confirm") return clearNoteProgress();
    if (action === "panel-answer-check") return checkPanelAnswer();
    if (action === "open-words-bytes") { unlockExplanation("words-bytes", { silent: true }); return setState({ wordsBytesDialog: { page: 0 } }, false); }
    if (action === "words-bytes-close") return closeWordsBytes();
    if (action === "words-bytes-prev") return wordsBytesStep(-1);
    if (action === "words-bytes-next") return wordsBytesStep(1);
    if (action === "arith-tasks-note") return openArithNote();
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
    if (action === "solution-reveal-create-card") return revealCreateCardTool();
    if (action === "solution-toggle-table") return setState({ solutionTableHidden: !state.solutionTableHidden }, false);
    if (action === "create-card-tool") return enterCardCreation(); // the bubble + tool share this
    if (action === "card-creation-back") return exitCardCreation();
    if (action === "card-discard-exit") return discardCardAndExit();
    if (action === "my-cards") {
      if (!myCardsEnabled()) return;
      return setState({ ...transientUiClearPatch(), ...overlayReturnPatch(), screen: "myCards" });
    }
    if (action === "my-cards-new") return enterCardCreation({ returnScreen: "myCards" });
    if (action === "my-cards-load") { app.querySelector("[data-card-file-input]")?.click(); return; }
    if (action === "auth-signin") { authBridge()?.signIn?.(); return; }
    if (action === "auth-signout") { authBridge()?.signOut?.(); return; }
    if (action === "save-progress-file") return saveProgressToFile();
    if (action === "load-progress-file") { app.querySelector("[data-progress-file-input]")?.click(); return; }
    if (action === "my-card-edit") return enterCardCreationForEdit(button.dataset.cardType);
    if (action === "my-card-save-file") return downloadCardFile(button.dataset.cardType);
    if (action === "my-card-delete") return setState({ cardDeleteConfirm: button.dataset.cardType }, false);
    if (action === "card-delete-confirm") return deleteSavedCard(state.cardDeleteConfirm);
    if (action === "card-delete-cancel") return setState({ cardDeleteConfirm: null }, false);
    if (action === "card-creation-reset") {
      const cc = state.cardCreation || {};
      return setState({ workspace: createCardBuildWorkspace(cc.returnChapterId, cc.returnPanelIndex), cardCreation: { ...cc, pinEdit: null } }, false);
    }
    if (action === "card-creation-intro-ok") return dismissCardCreationIntro();
    if (action === "toggle-requirements") return setState({ requirementsPanelHidden: !state.requirementsPanelHidden }, false);
    if (action === "build-help-later") return dismissBuildHelpPrompt();
    if (action === "build-help-yes" || action === "build-help-open") return openNandBuildHelp();
    if (action === "back-to-workspace") return backToWorkspaceFromNandBuildHelp();
    if (action === "build-help-back-to-game") return exitWorkbenchAfterBuildTeaser();
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

    const splitterResizeHandle = event.target.closest("[data-action='splitter-resize']");
    if (splitterResizeHandle) {
      event.preventDefault();
      return startSplitterResize(splitterResizeHandle.dataset.componentId, event);
    }

    const component = event.target.closest("[data-action='workspace-component']");
    if (component) {
      event.preventDefault();
      return startComponentDrag(component.dataset.componentId, event);
    }

    // A pointerdown anywhere else while a splitter is focused (empty board, a
    // control button, ...) clears the focus — except on the splitter's own
    // controls (the mirror handle and the leg-count drag handle).
    if (state.screen === "workspace" && state.workspace.focusedComponentId) {
      if (event.target.closest("[data-action='splitter-mirror']") || event.target.closest("[data-action='splitter-resize']")) return;
      clearWorkspaceFocus();
    }
  });

  document.addEventListener("pointermove", (event) => {
    if (dialogDragState) return updateDialogDrag(event);
    if (!dragState) return;
    if (dragState.kind === "wire") return updateCableDrag(event);
    if (dragState.kind === "component") return updateComponentDrag(event);
    if (dragState.kind === "new-component") return updateToolbarDrag(event);
    if (dragState.kind === "splitter-resize") return updateSplitterResize(event);
  });

  window.addEventListener("pointerup", (event) => {
    if (dialogDragState) return finishDialogDrag(event);
    if (!dragState) return;
    if (dragState.kind === "wire") return finishCableDrag(event);
    if (dragState.kind === "component") return finishComponentDrag(event);
    if (dragState.kind === "new-component") return finishToolbarDrag(event);
    if (dragState.kind === "splitter-resize") return finishSplitterResize(event);
  }, true);

  window.addEventListener("pointercancel", cancelActiveDrag, true);
  window.addEventListener("mouseup", () => {
    if (dragState?.kind === "wire") cancelActiveDragNow();
  }, true);
  window.addEventListener("dragstart", (event) => event.preventDefault(), true);
  window.addEventListener("blur", cancelActiveDragNow);

  document.addEventListener("keydown", (event) => {
    // The paged "מילים ובתים" reading: ← / space / Enter advance (Enter closes on
    // the last page), → goes back, Esc closes. Captured before everything else.
    if (state.wordsBytesDialog) {
      const total = Math.max(1, wordsBytesParagraphs().length);
      const page = Math.min(Math.max(0, Number(state.wordsBytesDialog.page) || 0), total - 1);
      if (event.key === "Escape") { event.preventDefault(); return closeWordsBytes(); }
      if (event.key === "ArrowRight") { event.preventDefault(); return wordsBytesStep(-1); }
      if (event.key === "ArrowLeft" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (page >= total - 1) return closeWordsBytes();
        return wordsBytesStep(1);
      }
      event.preventDefault();
      return;
    }

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
    // A gating question panel: Enter submits the answer; the "next" keys are
    // blocked until it is right. Typing/arrows inside the answer box are left to
    // the input itself.
    if (currentPanel().question) {
      if (event.key === "Enter") { event.preventDefault(); return checkPanelAnswer(); }
      if (event.target && event.target.closest && event.target.closest(".panel-question-input")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); return previousPanel(); }
      if (event.key === "ArrowLeft" || event.key === " ") { event.preventDefault(); return; }
      return;
    }
    // During a story-panel explanation replay the arrow keys / space step the
    // replay, returning to the menu at the first/last slide (like the buttons).
    if (explanationReplayActive()) {
      if (event.key === "ArrowRight") { event.preventDefault(); return previousExplanationPanel(); }
      if (event.key === "ArrowLeft" || event.key === " ") { event.preventDefault(); return nextExplanationPanel(); }
      return;
    }
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

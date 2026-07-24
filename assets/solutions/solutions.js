// AUTO-GENERATED from assets/solutions/*.json — do not edit by hand.
// Regenerate with: node tools/build-solutions.js
// Lets the solution docs load from file:// (no server), where fetch() is blocked.
window.EMBEDDED_SOLUTIONS = {
  "Inc": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Inc",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Inc",
      "x": 640,
      "y": 288,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 60,
        "y": 80
      }
    ],
    "components": [
      {
        "id": "one-source",
        "type": "source",
        "x": 445,
        "y": 395
      },
      {
        "id": "one-merge",
        "type": "splitter",
        "x": 570,
        "y": 380,
        "mirrored": true,
        "outputs": 2,
        "legWidths": [
          1,
          15
        ],
        "singleWidth": 16
      },
      {
        "id": "add-1",
        "type": "gate-Add16",
        "x": 670,
        "y": 290
      }
    ],
    "wires": [
      {
        "a": "one-source.out",
        "b": "one-merge.leg0"
      },
      {
        "a": "one-merge.single",
        "b": "add-1.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "add-1.in1"
      },
      {
        "a": "add-1.out1",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 0
        },
        {
          "a": 41
        },
        {
          "a": 255
        },
        {
          "a": 4095
        },
        {
          "a": 30000
        },
        {
          "a": 65535
        }
      ],
      "note": "כניסה + 1 (16 ביט)"
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 120,
          "y": 288
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 288
        }
      }
    }
  },
  "ALU0": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "ALU0",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-ALU0",
      "x": 640,
      "y": 360,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -90,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר הראשון"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -90,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השני"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -260,
          "y": -250,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": -180,
          "w": 1,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 65,
        "y": 110
      }
    ],
    "components": [
      {
        "id": "and16",
        "type": "gate-AND16",
        "x": 535,
        "y": 295
      },
      {
        "id": "add16",
        "type": "gate-Add16",
        "x": 530,
        "y": 425
      },
      {
        "id": "mux",
        "type": "gate-MUX16",
        "x": 755,
        "y": 360
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "and16.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "and16.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "add16.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "add16.in2"
      },
      {
        "a": "and16.out",
        "b": "mux.in1"
      },
      {
        "a": "add16.out1",
        "b": "mux.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "mux.in3"
      },
      {
        "a": "mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 65535,
          "b": 4660,
          "control": 0
        },
        {
          "a": 3855,
          "b": 255,
          "control": 0
        },
        {
          "a": 12,
          "b": 10,
          "control": 0
        },
        {
          "a": 5,
          "b": 3,
          "control": 1
        },
        {
          "a": 1234,
          "b": 5678,
          "control": 1
        },
        {
          "a": 65535,
          "b": 1,
          "control": 1
        }
      ],
      "note": "בקרה 0 → AND · 1 → חיבור"
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 120,
          "y": 270
        },
        "inputExt2": {
          "x": 120,
          "y": 450
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 360
        }
      }
    }
  },
  "PreperNum": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "PreperNum",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-PreperNum",
      "x": 620,
      "y": 300,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -215,
          "y": -250,
          "w": 2,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -215,
          "y": -180,
          "w": 2,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 65,
        "y": 50
      }
    ],
    "components": [
      {
        "id": "ctrl-split",
        "type": "splitter",
        "x": 500,
        "y": 185,
        "mirrored": false,
        "outputs": 2,
        "width": 1
      },
      {
        "id": "mux1",
        "type": "gate-MUX16",
        "x": 472,
        "y": 302
      },
      {
        "id": "not16",
        "type": "gate-Not16",
        "x": 610,
        "y": 430
      },
      {
        "id": "mux2",
        "type": "gate-MUX16",
        "x": 733,
        "y": 302
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt2",
        "b": "ctrl-split.single"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mux1.in1"
      },
      {
        "a": "ctrl-split.leg0",
        "b": "mux1.in3"
      },
      {
        "a": "mux1.out",
        "b": "not16.in1"
      },
      {
        "a": "mux1.out",
        "b": "mux2.in1"
      },
      {
        "a": "not16.out",
        "b": "mux2.in2"
      },
      {
        "a": "ctrl-split.leg1",
        "b": "mux2.in3"
      },
      {
        "a": "mux2.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 43981,
          "control": 0
        },
        {
          "a": 4660,
          "control": 1
        },
        {
          "a": 61680,
          "control": 2
        },
        {
          "a": 255,
          "control": 3
        },
        {
          "a": 12345,
          "control": 1
        },
        {
          "a": 54321,
          "control": 3
        }
      ],
      "note": "בקרה 2 ביט: השני מאפס, הראשון עושה NOT"
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 120,
          "y": 300
        },
        "inputExt2": {
          "x": 210,
          "y": 50
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 300
        }
      }
    }
  },
  "ALU1": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "ALU1",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-ALU1",
      "x": 560,
      "y": 360,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -15,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר הראשון"
        },
        {
          "id": "inputInt1",
          "x": -265,
          "y": -15,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השני"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -215,
          "y": -250,
          "w": 6,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt3",
          "x": -215,
          "y": -180,
          "w": 6,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 85,
        "y": 110
      }
    ],
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 51,
          "y": 345
        },
        "inputExt2": {
          "x": 50,
          "y": 450
        },
        "inputExt3": {
          "x": 210,
          "y": 110
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 360
        }
      }
    },
    "components": [
      {
        "id": "ctrl-split",
        "type": "splitter",
        "x": 385,
        "y": 230,
        "outputs": 3,
        "width": 2,
        "mirrored": false
      },
      {
        "id": "part3-split",
        "type": "splitter",
        "x": 540,
        "y": 195,
        "outputs": 2,
        "width": 1,
        "mirrored": false
      },
      {
        "id": "pn1",
        "type": "gate-PreperNum",
        "x": 425,
        "y": 345
      },
      {
        "id": "pn2",
        "type": "gate-PreperNum",
        "x": 535,
        "y": 450
      },
      {
        "id": "alu0",
        "type": "gate-ALU0",
        "x": 675,
        "y": 370
      },
      {
        "id": "pn3-ctrl",
        "type": "splitter",
        "x": 655,
        "y": 195,
        "outputs": 2,
        "width": 1,
        "mirrored": true
      },
      {
        "id": "pn3",
        "type": "gate-PreperNum",
        "x": 775,
        "y": 240
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "ctrl-split.single"
      },
      {
        "a": "ctrl-split.leg0",
        "b": "pn1.in2"
      },
      {
        "a": "ctrl-split.leg1",
        "b": "pn2.in2"
      },
      {
        "a": "ctrl-split.leg2",
        "b": "part3-split.single"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "pn1.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "pn2.in1"
      },
      {
        "a": "pn1.out1",
        "b": "alu0.in1"
      },
      {
        "a": "pn2.out1",
        "b": "alu0.in2"
      },
      {
        "a": "part3-split.leg0",
        "b": "alu0.in3"
      },
      {
        "a": "part3-split.leg1",
        "b": "pn3-ctrl.leg1"
      },
      {
        "a": "pn3-ctrl.single",
        "b": "pn3.in2"
      },
      {
        "a": "alu0.out1",
        "b": "pn3.in1"
      },
      {
        "a": "pn3.out1",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 61680,
          "b": 255,
          "control": 0
        },
        {
          "a": 1234,
          "b": 5678,
          "control": 2
        },
        {
          "a": 4660,
          "b": 65535,
          "control": 1
        },
        {
          "a": 43981,
          "b": 255,
          "control": 16
        },
        {
          "a": 3855,
          "b": 4080,
          "control": 10
        },
        {
          "a": 4660,
          "b": 22136,
          "control": 63
        }
      ],
      "note": "בקרה 6 ביט: 0,1 הכנת כניסה1 · 2,3 כניסה2 · 4 פעולה · 5 NOT"
    }
  },
  "ALU2": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "ALU2",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-ALU2",
      "x": 560,
      "y": 360,
      "frameW": 600,
      "frameH": 540,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -150,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר הראשון"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -150,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השני"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 150,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השלישי"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 150,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -215,
          "y": -320,
          "w": 7,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt4",
          "x": -215,
          "y": -250,
          "w": 7,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 65,
        "y": 40
      }
    ],
    "components": [
      {
        "id": "ctrl-split",
        "type": "splitter",
        "x": 430,
        "y": 210,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          6,
          1
        ],
        "singleWidth": 7
      },
      {
        "id": "mux",
        "type": "gate-MUX16",
        "x": 470,
        "y": 468
      },
      {
        "id": "alu1",
        "type": "gate-ALU1",
        "x": 690,
        "y": 360
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt4",
        "b": "ctrl-split.single"
      },
      {
        "a": "ctrl-split.leg0",
        "b": "alu1.in3"
      },
      {
        "a": "ctrl-split.leg1",
        "b": "mux.in3"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "mux.in1"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "mux.in2"
      },
      {
        "a": "mux.out",
        "b": "alu1.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "alu1.in1"
      },
      {
        "a": "alu1.out1",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 61680,
          "b": 255,
          "d": 3855,
          "control": 0
        },
        {
          "a": 61680,
          "b": 255,
          "d": 3855,
          "control": 64
        },
        {
          "a": 1234,
          "b": 1,
          "d": 5678,
          "control": 66
        },
        {
          "a": 5,
          "b": 3,
          "d": 99,
          "control": 2
        },
        {
          "a": 4660,
          "b": 0,
          "d": 65535,
          "control": 65
        },
        {
          "a": 4660,
          "b": 22136,
          "d": 39612,
          "control": 127
        }
      ],
      "note": "ביט 7 בוחר אופרנד; 6 התחתונים = בקרת ALU1"
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 75,
          "y": 335
        },
        "inputExt2": {
          "x": 75,
          "y": 465
        },
        "inputExt3": {
          "x": 75,
          "y": 600
        },
        "inputExt4": {
          "x": 175,
          "y": 75
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 360
        }
      }
    }
  },
  "ALU3": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "ALU3",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-ALU3",
      "x": 560,
      "y": 360,
      "frameW": 600,
      "frameH": 540,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -150,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר הראשון"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -150,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השני"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 150,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השלישי"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 150,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -215,
          "y": -280,
          "w": 12,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt4",
          "x": -215,
          "y": -210,
          "w": 12,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת התוצאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 65,
        "y": 80
      }
    ],
    "components": [
      {
        "id": "ctrl-split",
        "type": "splitter",
        "x": 480,
        "y": 150,
        "mirrored": false,
        "outputs": 3,
        "legWidths": [
          7,
          4,
          1
        ],
        "singleWidth": 12
      },
      {
        "id": "optA-merge",
        "type": "splitter",
        "x": 445,
        "y": 235,
        "mirrored": true,
        "outputs": 2,
        "legWidths": [
          12,
          4
        ],
        "singleWidth": 16
      },
      {
        "id": "alu2",
        "type": "gate-ALU2",
        "x": 520,
        "y": 355
      },
      {
        "id": "mux",
        "type": "gate-MUX16",
        "x": 705,
        "y": 360
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt4",
        "b": "ctrl-split.single"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "optA-merge.leg0"
      },
      {
        "a": "ctrl-split.leg0",
        "b": "alu2.in4"
      },
      {
        "a": "ctrl-split.leg2",
        "b": "mux.in3"
      },
      {
        "a": "optA-merge.single",
        "b": "mux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "alu2.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "alu2.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "alu2.in3"
      },
      {
        "a": "alu2.out1",
        "b": "mux.in2"
      },
      {
        "a": "mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 4369,
          "b": 8738,
          "d": 13107,
          "control": 291
        },
        {
          "a": 43981,
          "b": 8738,
          "d": 13107,
          "control": 1451
        },
        {
          "a": 61680,
          "b": 255,
          "d": 3855,
          "control": 2048
        },
        {
          "a": 61680,
          "b": 255,
          "d": 3855,
          "control": 2112
        },
        {
          "a": 1234,
          "b": 1,
          "d": 5678,
          "control": 2114
        },
        {
          "a": 4660,
          "b": 22136,
          "d": 39612,
          "control": 2175
        }
      ],
      "note": "ביט 12: 0 → בקרה+אפסים · 1 → ALU2 על 7 התחתונים"
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 105,
          "y": 325
        },
        "inputExt2": {
          "x": 105,
          "y": 460
        },
        "inputExt3": {
          "x": 105,
          "y": 595
        },
        "inputExt4": {
          "x": 200,
          "y": 60
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 360
        }
      }
    }
  }
};

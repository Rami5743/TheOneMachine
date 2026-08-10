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
        "y": 225,
        "outputs": 4,
        "legWidths": [
          2,
          2,
          1,
          1
        ],
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
        "x": 520,
        "y": 450
      },
      {
        "id": "alu0",
        "type": "gate-ALU0",
        "x": 605.2,
        "y": 360
      },
      {
        "id": "not-merge",
        "type": "splitter",
        "x": 707,
        "y": 191,
        "outputs": 2,
        "legWidths": [
          1,
          1
        ],
        "mirrored": true
      },
      {
        "id": "pn3",
        "type": "gate-PreperNum",
        "x": 745,
        "y": 360
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
        "b": "alu0.in3"
      },
      {
        "a": "ctrl-split.leg3",
        "b": "not-merge.leg1"
      },
      {
        "a": "not-merge.single",
        "b": "pn3.in2"
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
      "frameH": 460,
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
          "y": -275,
          "w": 7,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt4",
          "x": -215,
          "y": -190,
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
        "x": 85,
        "y": 80
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
          "x": 180,
          "y": 115
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
      "frameH": 430,
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
        "x": 565,
        "y": 205,
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
  },
  "ALU4": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "ALU4",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-ALU4",
      "x": 560,
      "y": 360,
      "frameW": 600,
      "frameH": 360,
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
          "x": -115,
          "y": -230,
          "w": 12,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt4",
          "x": -115,
          "y": -140,
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
          "label": "יציאת התוצאה"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt2",
          "x": 70,
          "y": 145,
          "w": 1,
          "dir": "in",
          "label": "יציאת ng",
          "caption": "ng"
        },
        {
          "id": "outputExt2",
          "x": 70,
          "y": 225,
          "w": 1,
          "dir": "out",
          "label": "",
          "caption": "ng"
        },
        {
          "id": "outputInt3",
          "x": 195,
          "y": 150,
          "w": 1,
          "dir": "in",
          "label": "יציאת zr",
          "caption": "zr"
        },
        {
          "id": "outputExt3",
          "x": 195,
          "y": 225,
          "w": 1,
          "dir": "out",
          "label": "",
          "caption": "zr"
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
        "id": "alu3",
        "type": "gate-ALU3",
        "x": 445,
        "y": 360
      },
      {
        "id": "ng-split",
        "type": "splitter",
        "x": 525,
        "y": 465,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          15,
          1
        ],
        "singleWidth": 16
      },
      {
        "id": "neq0",
        "type": "gate-Neq0_16",
        "x": 620,
        "y": 405
      },
      {
        "id": "zr-not",
        "type": "gate-Not",
        "x": 705,
        "y": 405
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "alu3.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "alu3.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "alu3.in3"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "alu3.in4"
      },
      {
        "a": "alu3.out1",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "alu3.out1",
        "b": "ng-split.single"
      },
      {
        "a": "alu3.out1",
        "b": "neq0.in1"
      },
      {
        "a": "ng-split.leg1",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "neq0.out",
        "b": "zr-not.in1"
      },
      {
        "a": "zr-not.out",
        "b": "task-card-1.outputInt3"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 0,
          "b": 0,
          "d": 0,
          "control": 0
        },
        {
          "a": 4369,
          "b": 8738,
          "d": 13107,
          "control": 291
        },
        {
          "a": 0,
          "b": 0,
          "d": 0,
          "control": 2080
        },
        {
          "a": 4660,
          "b": 22136,
          "d": 39612,
          "control": 2175
        },
        {
          "a": 32768,
          "b": 65535,
          "d": 3855,
          "control": 2048
        }
      ],
      "note": "ALU4 = ALU3 result on the main output; ng = the first (top/MSB) bit of the result; zr = 1 iff the result is zero."
    },
    "harness": {
      "inputs": {
        "inputExt1": {
          "x": 35,
          "y": 360
        },
        "inputExt2": {
          "x": 40,
          "y": 515
        },
        "inputExt3": {
          "x": 40,
          "y": 665
        },
        "inputExt4": {
          "x": 170,
          "y": 95
        }
      },
      "outputs": {
        "outputExt1": {
          "x": 1120,
          "y": 360
        },
        "outputExt2": {
          "x": 535,
          "y": 630
        },
        "outputExt3": {
          "x": 870,
          "y": 625
        }
      }
    }
  },
  "Add16": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Add16",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Add16",
      "x": 640,
      "y": 310,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -90,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר הראשון חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -90,
          "w": 16,
          "dir": "out",
          "label": "כניסת המספר הראשון פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": "כניסת המספר השני חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": "כניסת המספר השני פנימית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "יציאת הסכום פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת הסכום חיצונית"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 65,
        "y": 310
      }
    ],
    "components": [
      {
        "id": "split-a",
        "type": "splitter",
        "x": 430,
        "y": 200,
        "mirrored": false,
        "outputs": 4,
        "width": 4
      },
      {
        "id": "split-b",
        "type": "splitter",
        "x": 430,
        "y": 420,
        "mirrored": false,
        "outputs": 4,
        "width": 4
      },
      {
        "id": "ad3",
        "type": "gate-Add4",
        "x": 640,
        "y": 100
      },
      {
        "id": "ad2",
        "type": "gate-Add4",
        "x": 640,
        "y": 240
      },
      {
        "id": "ad1",
        "type": "gate-Add4",
        "x": 640,
        "y": 380
      },
      {
        "id": "ad0",
        "type": "gate-Add4",
        "x": 640,
        "y": 520
      },
      {
        "id": "merge",
        "type": "splitter",
        "x": 850,
        "y": 310,
        "mirrored": true,
        "outputs": 4,
        "width": 4
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "split-a.single"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "split-b.single"
      },
      {
        "a": "merge.single",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "split-a.leg0",
        "b": "ad0.in1"
      },
      {
        "a": "split-b.leg0",
        "b": "ad0.in2"
      },
      {
        "a": "ad0.out1",
        "b": "merge.leg0"
      },
      {
        "a": "split-a.leg1",
        "b": "ad1.in1"
      },
      {
        "a": "split-b.leg1",
        "b": "ad1.in2"
      },
      {
        "a": "ad0.out2",
        "b": "ad1.in3"
      },
      {
        "a": "ad1.out1",
        "b": "merge.leg1"
      },
      {
        "a": "split-a.leg2",
        "b": "ad2.in1"
      },
      {
        "a": "split-b.leg2",
        "b": "ad2.in2"
      },
      {
        "a": "ad1.out2",
        "b": "ad2.in3"
      },
      {
        "a": "ad2.out1",
        "b": "merge.leg2"
      },
      {
        "a": "split-a.leg3",
        "b": "ad3.in1"
      },
      {
        "a": "split-b.leg3",
        "b": "ad3.in2"
      },
      {
        "a": "ad2.out2",
        "b": "ad3.in3"
      },
      {
        "a": "ad3.out1",
        "b": "merge.leg3"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 0,
          "b": 0
        },
        {
          "a": 1234,
          "b": 5678
        },
        {
          "a": 4095,
          "b": 1
        },
        {
          "a": 40000,
          "b": 25535
        },
        {
          "a": 65535,
          "b": 1
        },
        {
          "a": 65535,
          "b": 65535
        }
      ],
      "note": "סכום שני מספרים בני 16 ביט (הנשא ה-17 מושמט)"
    }
  },
  "Add4": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Add4",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Add4",
      "x": 640,
      "y": 288,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -140,
          "w": 4,
          "dir": "in",
          "label": "כניסת המספר הראשון חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -140,
          "w": 4,
          "dir": "out",
          "label": "כניסת המספר הראשון פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 0,
          "w": 4,
          "dir": "in",
          "label": "כניסת המספר השני חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 0,
          "w": 4,
          "dir": "out",
          "label": "כניסת המספר השני פנימית"
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 140,
          "w": 1,
          "dir": "in",
          "label": "כניסת הנשיאה חיצונית"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 140,
          "w": 1,
          "dir": "out",
          "label": "כניסת הנשיאה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": -90,
          "w": 1,
          "dir": "in",
          "label": "יציאת הנשיאה האחרונה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": -90,
          "w": 1,
          "dir": "out",
          "label": "יציאת הנשיאה האחרונה חיצונית"
        },
        {
          "id": "outputInt2",
          "x": 260,
          "y": 90,
          "w": 4,
          "dir": "in",
          "label": "יציאת הסכום פנימית"
        },
        {
          "id": "outputExt2",
          "x": 340,
          "y": 90,
          "w": 4,
          "dir": "out",
          "label": "יציאת הסכום חיצונית"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 165,
        "y": 425
      }
    ],
    "components": [
      {
        "id": "split-a",
        "type": "splitter",
        "x": 451,
        "y": 173,
        "mirrored": false,
        "outputs": 4,
        "width": 1
      },
      {
        "id": "split-b",
        "type": "splitter",
        "x": 451,
        "y": 310,
        "mirrored": false,
        "outputs": 4,
        "width": 1
      },
      {
        "id": "fa0",
        "type": "gate-fullAdder",
        "x": 582,
        "y": 406
      },
      {
        "id": "fa1",
        "type": "gate-fullAdder",
        "x": 602,
        "y": 323
      },
      {
        "id": "fa2",
        "type": "gate-fullAdder",
        "x": 610,
        "y": 245
      },
      {
        "id": "fa3",
        "type": "gate-fullAdder",
        "x": 635,
        "y": 170
      },
      {
        "id": "merge",
        "type": "splitter",
        "x": 815,
        "y": 380,
        "mirrored": true,
        "outputs": 4,
        "width": 1
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "split-a.single"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "split-b.single"
      },
      {
        "a": "merge.single",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "fa3.out2",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "split-a.leg0",
        "b": "fa0.in1"
      },
      {
        "a": "split-b.leg0",
        "b": "fa0.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "fa0.in3"
      },
      {
        "a": "fa0.out1",
        "b": "merge.leg0"
      },
      {
        "a": "split-a.leg1",
        "b": "fa1.in1"
      },
      {
        "a": "split-b.leg1",
        "b": "fa1.in2"
      },
      {
        "a": "fa0.out2",
        "b": "fa1.in3"
      },
      {
        "a": "fa1.out1",
        "b": "merge.leg1"
      },
      {
        "a": "split-a.leg2",
        "b": "fa2.in1"
      },
      {
        "a": "split-b.leg2",
        "b": "fa2.in2"
      },
      {
        "a": "fa1.out2",
        "b": "fa2.in3"
      },
      {
        "a": "fa2.out1",
        "b": "merge.leg2"
      },
      {
        "a": "split-a.leg3",
        "b": "fa3.in1"
      },
      {
        "a": "split-b.leg3",
        "b": "fa3.in2"
      },
      {
        "a": "fa2.out2",
        "b": "fa3.in3"
      },
      {
        "a": "fa3.out1",
        "b": "merge.leg3"
      }
    ],
    "check": {
      "cases": [
        {
          "a": 0,
          "b": 0,
          "cin": 0
        },
        {
          "a": 5,
          "b": 3,
          "cin": 0
        },
        {
          "a": 7,
          "b": 8,
          "cin": 0
        },
        {
          "a": 9,
          "b": 6,
          "cin": 1
        },
        {
          "a": 12,
          "b": 3,
          "cin": 1
        },
        {
          "a": 15,
          "b": 15,
          "cin": 1
        }
      ],
      "note": "סכום שני מספרים בני 4 ביט + נשא נכנס; הנשא היוצא הוא הספרה החמישית"
    },
    "harness": {
      "inputs": {},
      "outputs": {
        "outputExt2": {
          "x": 1130,
          "y": 375
        }
      }
    }
  },
  "halfAdder": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "halfAdder",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-halfAdder",
      "x": 500,
      "y": 288,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -70,
          "w": 1,
          "dir": "in",
          "label": "כניסת halfAdder 1 חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -70,
          "w": 1,
          "dir": "out",
          "label": "כניסת halfAdder 1 פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 70,
          "w": 1,
          "dir": "in",
          "label": "כניסת halfAdder 2 חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 70,
          "w": 1,
          "dir": "out",
          "label": "כניסת halfAdder 2 פנימית"
        },
        {
          "id": "outputInt2",
          "x": 260,
          "y": -100,
          "w": 1,
          "dir": "in",
          "label": "יציאת carry פנימית"
        },
        {
          "id": "outputExt2",
          "x": 340,
          "y": -100,
          "w": 1,
          "dir": "out",
          "label": "יציאת carry חיצונית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 100,
          "w": 1,
          "dir": "in",
          "label": "יציאת sum פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 100,
          "w": 1,
          "dir": "out",
          "label": "יציאת sum חיצונית"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 80,
        "y": 288
      }
    ],
    "components": [
      {
        "id": "and-1",
        "type": "gate-And",
        "x": 330,
        "y": 200
      },
      {
        "id": "xor-1",
        "type": "gate-Xor",
        "x": 330,
        "y": 380
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "xor-1.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "xor-1.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "and-1.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "and-1.in2"
      },
      {
        "a": "xor-1.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "and-1.out",
        "b": "task-card-1.outputInt2"
      }
    ],
    "check": {
      "note": "sum = XOR(a,b), carry = AND(a,b). הבדיקה עצמה היא טבלת אמת (בהגדרת המשימה)."
    },
    "harness": {
      "inputs": {},
      "outputs": {
        "outputExt1": {
          "x": 940,
          "y": 358
        },
        "outputExt2": {
          "x": 940,
          "y": 158
        }
      }
    }
  },
  "fullAdder": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "fullAdder",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-fullAdder",
      "x": 500,
      "y": 288,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -110,
          "w": 1,
          "dir": "in",
          "label": "כניסת fullAdder 1 חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -110,
          "w": 1,
          "dir": "out",
          "label": "כניסת fullAdder 1 פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 0,
          "w": 1,
          "dir": "in",
          "label": "כניסת fullAdder 2 חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 0,
          "w": 1,
          "dir": "out",
          "label": "כניסת fullAdder 2 פנימית"
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 110,
          "w": 1,
          "dir": "in",
          "label": "כניסת fullAdder 3 חיצונית"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 110,
          "w": 1,
          "dir": "out",
          "label": "כניסת fullAdder 3 פנימית"
        },
        {
          "id": "outputInt2",
          "x": 260,
          "y": -100,
          "w": 1,
          "dir": "in",
          "label": "יציאת carry פנימית"
        },
        {
          "id": "outputExt2",
          "x": 340,
          "y": -100,
          "w": 1,
          "dir": "out",
          "label": "יציאת carry חיצונית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 100,
          "w": 1,
          "dir": "in",
          "label": "יציאת sum פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 100,
          "w": 1,
          "dir": "out",
          "label": "יציאת sum חיצונית"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 80,
        "y": 288
      }
    ],
    "components": [
      {
        "id": "ha-1",
        "type": "gate-halfAdder",
        "x": 330,
        "y": 200
      },
      {
        "id": "ha-2",
        "type": "gate-halfAdder",
        "x": 500,
        "y": 320
      },
      {
        "id": "ha-3",
        "type": "gate-halfAdder",
        "x": 690,
        "y": 240
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "ha-1.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "ha-1.in2"
      },
      {
        "a": "ha-1.out1",
        "b": "ha-2.in1"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "ha-2.in2"
      },
      {
        "a": "ha-2.out1",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "ha-1.out2",
        "b": "ha-3.in1"
      },
      {
        "a": "ha-2.out2",
        "b": "ha-3.in2"
      },
      {
        "a": "ha-3.out1",
        "b": "task-card-1.outputInt2"
      }
    ],
    "check": {
      "note": "שלושה halfAdder-ים. הבדיקה עצמה היא טבלת אמת (בהגדרת המשימה)."
    },
    "harness": {
      "inputs": {},
      "outputs": {
        "outputExt1": {
          "x": 940,
          "y": 358
        },
        "outputExt2": {
          "x": 940,
          "y": 158
        }
      }
    }
  },
  "Register4": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Register4",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Register4",
      "x": 640,
      "y": 430,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": 0,
          "w": 4,
          "dir": "in",
          "label": "כניסת המידע חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": 0,
          "w": 4,
          "dir": "out",
          "label": "כניסת המידע פנימית"
        },
        {
          "id": "inputExt2",
          "x": -260,
          "y": -330,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": -230,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 4,
          "dir": "in",
          "label": "יציאת המידע פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 4,
          "dir": "out",
          "label": "יציאת המידע חיצונית"
        }
      ],
      "frameW": 600,
      "frameH": 560
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "split-in",
        "type": "splitter",
        "x": 470,
        "y": 430,
        "mirrored": false,
        "outputs": 4,
        "width": 1
      },
      {
        "id": "ff-1",
        "type": "ffCard",
        "x": 640,
        "y": 600
      },
      {
        "id": "ff-2",
        "type": "ffCard",
        "x": 640,
        "y": 490
      },
      {
        "id": "ff-3",
        "type": "ffCard",
        "x": 640,
        "y": 380
      },
      {
        "id": "ff-4",
        "type": "ffCard",
        "x": 640,
        "y": 270
      },
      {
        "id": "merge-out",
        "type": "splitter",
        "x": 820,
        "y": 430,
        "mirrored": true,
        "outputs": 4,
        "width": 1
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "split-in.single"
      },
      {
        "a": "split-in.leg0",
        "b": "ff-1.in1"
      },
      {
        "a": "split-in.leg1",
        "b": "ff-2.in1"
      },
      {
        "a": "split-in.leg2",
        "b": "ff-3.in1"
      },
      {
        "a": "split-in.leg3",
        "b": "ff-4.in1"
      },
      {
        "a": "ff-1.out",
        "b": "merge-out.leg0"
      },
      {
        "a": "ff-2.out",
        "b": "merge-out.leg1"
      },
      {
        "a": "ff-3.out",
        "b": "merge-out.leg2"
      },
      {
        "a": "ff-4.out",
        "b": "merge-out.leg3"
      },
      {
        "a": "merge-out.single",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "ff-1.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "ff-2.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "ff-3.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "ff-4.in2"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. מזינים ערכים לאורך כמה פעימות שעון ובודקים שהיציאה משקפת את הערך השמור (בקרה=1 כותב, בקרה=0 שומר)."
    }
  },
  "Register": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Register",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Register",
      "x": 640,
      "y": 430,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת המידע חיצונית"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "כניסת המידע פנימית"
        },
        {
          "id": "inputExt2",
          "x": -260,
          "y": -330,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה חיצונית"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": -230,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "יציאת המידע פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת המידע חיצונית"
        }
      ],
      "frameW": 600,
      "frameH": 560
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "split-in",
        "type": "splitter",
        "x": 450,
        "y": 430,
        "mirrored": false,
        "outputs": 4,
        "width": 4
      },
      {
        "id": "reg-1",
        "type": "gate-Register4",
        "x": 640,
        "y": 600
      },
      {
        "id": "reg-2",
        "type": "gate-Register4",
        "x": 640,
        "y": 490
      },
      {
        "id": "reg-3",
        "type": "gate-Register4",
        "x": 640,
        "y": 380
      },
      {
        "id": "reg-4",
        "type": "gate-Register4",
        "x": 640,
        "y": 270
      },
      {
        "id": "merge-out",
        "type": "splitter",
        "x": 840,
        "y": 430,
        "mirrored": true,
        "outputs": 4,
        "width": 4
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "split-in.single"
      },
      {
        "a": "split-in.leg0",
        "b": "reg-1.in1"
      },
      {
        "a": "split-in.leg1",
        "b": "reg-2.in1"
      },
      {
        "a": "split-in.leg2",
        "b": "reg-3.in1"
      },
      {
        "a": "split-in.leg3",
        "b": "reg-4.in1"
      },
      {
        "a": "reg-1.out",
        "b": "merge-out.leg0"
      },
      {
        "a": "reg-2.out",
        "b": "merge-out.leg1"
      },
      {
        "a": "reg-3.out",
        "b": "merge-out.leg2"
      },
      {
        "a": "reg-4.out",
        "b": "merge-out.leg3"
      },
      {
        "a": "merge-out.single",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "reg-1.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "reg-2.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "reg-3.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "reg-4.in2"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. מזינים ערכים לאורך כמה פעימות שעון ובודקים שהיציאה משקפת את הערך השמור (בקרה=1 כותב, בקרה=0 שומר)."
    }
  },
  "RAM4": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM4",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM4",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -70,
          "w": 2,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -70,
          "w": 2,
          "dir": "out",
          "label": "כניסת הכתובת פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-Register",
        "x": 740,
        "y": 335
      },
      {
        "id": "mem-2",
        "type": "gate-Register",
        "x": 695,
        "y": 430
      },
      {
        "id": "mem-3",
        "type": "gate-Register",
        "x": 630,
        "y": 540
      },
      {
        "id": "mem-4",
        "type": "gate-Register",
        "x": 525,
        "y": 645
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 325
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 905,
        "y": 460
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 320,
        "y": 180
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 905,
        "y": 180
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-nail-1.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "write-dmux.in2"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. כותבים ערכים לכמה כתובות לאורך פעימות שעון וקוראים אותם בחזרה — הבדיקה מסתכלת רק על ההתנהגות מבחוץ."
    }
  },
  "RAM16": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM16",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM16",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -70,
          "w": 4,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -70,
          "w": 4,
          "dir": "out",
          "label": "כניסת הכתובת פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-RAM4",
        "x": 740,
        "y": 290
      },
      {
        "id": "mem-2",
        "type": "gate-RAM4",
        "x": 720,
        "y": 410
      },
      {
        "id": "mem-3",
        "type": "gate-RAM4",
        "x": 650,
        "y": 525
      },
      {
        "id": "mem-4",
        "type": "gate-RAM4",
        "x": 530,
        "y": 620
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 275
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 910,
        "y": 460
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 350,
        "y": 195
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 905,
        "y": 195
      },
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 310,
        "y": 435,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          2,
          2
        ],
        "singleWidth": 4
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg1",
        "b": "addr-nail-1.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "write-dmux.in2"
      },
      {
        "a": "addr-nail-1.out",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-1.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-2.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-3.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-4.in3"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. כותבים ערכים לכמה כתובות לאורך פעימות שעון וקוראים אותם בחזרה — הבדיקה מסתכלת רק על ההתנהגות מבחוץ."
    }
  },
  "RAM64": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM64",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM64",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -70,
          "w": 6,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -70,
          "w": 6,
          "dir": "out",
          "label": "כניסת הכתובת פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-RAM16",
        "x": 740,
        "y": 290
      },
      {
        "id": "mem-2",
        "type": "gate-RAM16",
        "x": 720,
        "y": 410
      },
      {
        "id": "mem-3",
        "type": "gate-RAM16",
        "x": 650,
        "y": 525
      },
      {
        "id": "mem-4",
        "type": "gate-RAM16",
        "x": 530,
        "y": 620
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 275
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 910,
        "y": 460
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 350,
        "y": 195
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 905,
        "y": 195
      },
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 310,
        "y": 435,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          4,
          2
        ],
        "singleWidth": 6
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg1",
        "b": "addr-nail-1.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "write-dmux.in2"
      },
      {
        "a": "addr-nail-1.out",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-1.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-2.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-3.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-4.in3"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. כותבים ערכים לכמה כתובות לאורך פעימות שעון וקוראים אותם בחזרה — הבדיקה מסתכלת רק על ההתנהגות מבחוץ."
    }
  },
  "RAM256": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM256",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM256",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -70,
          "w": 8,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -70,
          "w": 8,
          "dir": "out",
          "label": "כניסת הכתובת פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-RAM64",
        "x": 740,
        "y": 290
      },
      {
        "id": "mem-2",
        "type": "gate-RAM64",
        "x": 720,
        "y": 410
      },
      {
        "id": "mem-3",
        "type": "gate-RAM64",
        "x": 650,
        "y": 525
      },
      {
        "id": "mem-4",
        "type": "gate-RAM64",
        "x": 530,
        "y": 620
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 275
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 910,
        "y": 460
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 350,
        "y": 195
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 905,
        "y": 195
      },
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 310,
        "y": 435,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          6,
          2
        ],
        "singleWidth": 8
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg1",
        "b": "addr-nail-1.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "write-dmux.in2"
      },
      {
        "a": "addr-nail-1.out",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-1.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-2.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-3.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-4.in3"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. כותבים ערכים לכמה כתובות לאורך פעימות שעון וקוראים אותם בחזרה — הבדיקה מסתכלת רק על ההתנהגות מבחוץ."
    }
  },
  "RAM1024": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM1024",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM1024",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -70,
          "w": 10,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -70,
          "w": 10,
          "dir": "out",
          "label": "כניסת הכתובת פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-RAM256",
        "x": 740,
        "y": 290
      },
      {
        "id": "mem-2",
        "type": "gate-RAM256",
        "x": 720,
        "y": 410
      },
      {
        "id": "mem-3",
        "type": "gate-RAM256",
        "x": 650,
        "y": 525
      },
      {
        "id": "mem-4",
        "type": "gate-RAM256",
        "x": 530,
        "y": 620
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 275
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 910,
        "y": 460
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 350,
        "y": 195
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 905,
        "y": 195
      },
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 310,
        "y": 435,
        "mirrored": false,
        "outputs": 2,
        "legWidths": [
          8,
          2
        ],
        "singleWidth": 10
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg1",
        "b": "addr-nail-1.in"
      },
      {
        "a": "addr-nail-1.out",
        "b": "write-dmux.in2"
      },
      {
        "a": "addr-nail-1.out",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-1.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-2.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-3.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "addr-split.leg0",
        "b": "mem-4.in3"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. כותבים ערכים לכמה כתובות לאורך פעימות שעון וקוראים אותם בחזרה — הבדיקה מסתכלת רק על ההתנהגות מבחוץ."
    }
  },
  "OPorts": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "OPorts",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-OPorts",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -250,
          "w": 2,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -250,
          "w": 2,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -180,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -180,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": -250,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -250,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 11"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "mem-1",
        "type": "gate-Register",
        "x": 710,
        "y": 330
      },
      {
        "id": "mem-2",
        "type": "gate-Register",
        "x": 660,
        "y": 385
      },
      {
        "id": "mem-3",
        "type": "gate-Register",
        "x": 620,
        "y": 445
      },
      {
        "id": "mem-4",
        "type": "gate-Register",
        "x": 525,
        "y": 590
      },
      {
        "id": "write-dmux",
        "type": "gate-Dmux4way",
        "x": 480,
        "y": 255
      },
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 960,
        "y": 290
      },
      {
        "id": "addr-nail-3",
        "type": "nail",
        "x": 960,
        "y": 190
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-nail-3.in"
      },
      {
        "a": "addr-nail-3.out",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "write-dmux.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-dmux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-1.in1"
      },
      {
        "a": "write-dmux.out1",
        "b": "mem-1.in2"
      },
      {
        "a": "mem-1.out",
        "b": "read-mux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-2.in1"
      },
      {
        "a": "write-dmux.out2",
        "b": "mem-2.in2"
      },
      {
        "a": "mem-2.out",
        "b": "read-mux.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-3.in1"
      },
      {
        "a": "write-dmux.out3",
        "b": "mem-3.in2"
      },
      {
        "a": "mem-3.out",
        "b": "read-mux.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "mem-4.in1"
      },
      {
        "a": "write-dmux.out4",
        "b": "mem-4.in2"
      },
      {
        "a": "mem-4.out",
        "b": "read-mux.in4"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "mem-1.out",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "mem-2.out",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "mem-3.out",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "mem-4.out",
        "b": "task-card-1.outputInt5"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: כותבים ערכים לכל ארבע הכתובות וקוראים בחזרה, ובכל שלב גם ארבעת בסי הפורטים חייבים להראות את הרגיסטרים שלהם."
    }
  },
  "IPorts": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "IPorts",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-IPorts",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt5",
          "x": -460,
          "y": -250,
          "w": 2,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": -250,
          "w": 2,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -460,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt2",
          "x": -340,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -460,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": -250,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -250,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "read-mux",
        "type": "gate-Mux4way16",
        "x": 520,
        "y": 570
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt5",
        "b": "read-mux.in5"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "read-mux.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "read-mux.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "read-mux.in3"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "read-mux.in4"
      },
      {
        "a": "read-mux.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס צירופי: מזינים ארבעה ערכים לפורטים ובוחרים כל כתובת בתורה."
    }
  },
  "Ports": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Ports",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Ports",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -250,
          "w": 3,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -250,
          "w": 3,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -180,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -180,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": -250,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -250,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt5",
          "x": -460,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt6",
          "x": -340,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt6",
          "x": -460,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt7",
          "x": -340,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt7",
          "x": -460,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 11"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 360,
        "y": 220,
        "outputs": 2,
        "legWidths": [
          2,
          1
        ],
        "mirrored": false
      },
      {
        "id": "write-sel",
        "type": "gate-DMux",
        "x": 630,
        "y": 280
      },
      {
        "id": "op",
        "type": "gate-OPorts",
        "x": 715,
        "y": 475
      },
      {
        "id": "ip",
        "type": "gate-IPorts",
        "x": 575,
        "y": 540
      },
      {
        "id": "read-sel",
        "type": "gate-MUX16",
        "x": 960,
        "y": 395
      },
      {
        "id": "sel-nail",
        "type": "nail",
        "x": 960,
        "y": 200
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg0",
        "b": "op.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "ip.in5"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-sel.in1"
      },
      {
        "a": "addr-split.leg1",
        "b": "write-sel.in2"
      },
      {
        "a": "write-sel.out1",
        "b": "op.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "op.in1"
      },
      {
        "a": "op.out",
        "b": "read-sel.in1"
      },
      {
        "a": "ip.out",
        "b": "read-sel.in2"
      },
      {
        "a": "addr-split.leg1",
        "b": "sel-nail.in"
      },
      {
        "a": "sel-nail.out",
        "b": "read-sel.in3"
      },
      {
        "a": "read-sel.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "op.outP1",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "op.outP2",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "op.outP3",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "op.outP4",
        "b": "task-card-1.outputInt5"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "ip.in1"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "ip.in2"
      },
      {
        "a": "task-card-1.inputInt6",
        "b": "ip.in3"
      },
      {
        "a": "task-card-1.inputInt7",
        "b": "ip.in4"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: כותבים לארבע הכתובות הראשונות וקוראים בחזרה, קוראים את ארבע הכתובות האחרונות מהמכשירים, ומוודאים שכתיבה אליהן לא עושה כלום."
    }
  },
  "RAM": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "RAM",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-RAM",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -250,
          "w": 16,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -250,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -180,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -180,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": -250,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -250,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 40,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 40,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt5",
          "x": -460,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt6",
          "x": -340,
          "y": 160,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt6",
          "x": -460,
          "y": 160,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt7",
          "x": -340,
          "y": 220,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt7",
          "x": -460,
          "y": 220,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 11"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "addr-split",
        "type": "splitter",
        "x": 360,
        "y": 205,
        "outputs": 3,
        "legWidths": [
          10,
          1,
          5
        ],
        "mirrored": false,
        "singleWidth": 16
      },
      {
        "id": "low-split",
        "type": "splitter",
        "x": 470,
        "y": 360,
        "outputs": 2,
        "legWidths": [
          3,
          7
        ],
        "mirrored": false
      },
      {
        "id": "write-sel",
        "type": "gate-DMux",
        "x": 525,
        "y": 250
      },
      {
        "id": "big",
        "type": "gate-RAM1024",
        "x": 650,
        "y": 335
      },
      {
        "id": "ports",
        "type": "gate-Ports",
        "x": 560,
        "y": 555
      },
      {
        "id": "read-sel",
        "type": "gate-MUX16",
        "x": 895,
        "y": 235
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg0",
        "b": "big.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "low-split.single"
      },
      {
        "a": "low-split.leg0",
        "b": "ports.in3"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-sel.in1"
      },
      {
        "a": "write-sel.out1",
        "b": "big.in2"
      },
      {
        "a": "write-sel.out2",
        "b": "ports.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "big.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "ports.in1"
      },
      {
        "a": "big.out",
        "b": "read-sel.in1"
      },
      {
        "a": "ports.out",
        "b": "read-sel.in2"
      },
      {
        "a": "read-sel.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "ports.outP1",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "ports.outP2",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "ports.outP3",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "ports.outP4",
        "b": "task-card-1.outputInt5"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "ports.inP1"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "ports.inP2"
      },
      {
        "a": "task-card-1.inputInt6",
        "b": "ports.inP3"
      },
      {
        "a": "task-card-1.inputInt7",
        "b": "ports.inP4"
      },
      {
        "a": "addr-split.leg1",
        "b": "write-sel.in2"
      },
      {
        "a": "addr-split.leg1",
        "b": "read-sel.in3"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: הזיכרון הרגיל והפורטים בכתובת אחת. כותבים וקוראים בשני הטווחים, ומוודאים שהכתובות הקוראות-בלבד לא ניתנות לכתיבה."
    }
  },
  "Prg": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Prg",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Prg",
      "x": 660,
      "y": 440,
      "frameW": 800,
      "frameH": 560,
      "pins": [
        {
          "id": "inputExt3",
          "x": -460,
          "y": -170,
          "w": 16,
          "dir": "in",
          "label": "כניסת כתובת הקריאה",
          "caption": "RAdr"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -170,
          "w": 16,
          "dir": "out",
          "label": "כניסת כתובת הקריאה פנימית"
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": -50,
          "w": 16,
          "dir": "in",
          "label": "כניסת כתובת הכתיבה",
          "caption": "WAdr"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": -50,
          "w": 16,
          "dir": "out",
          "label": "כניסת כתובת הכתיבה פנימית"
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": 110,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": 110,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -217,
          "y": -350,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt2",
          "x": -217,
          "y": -210,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 20,
          "w": 16,
          "dir": "in",
          "label": "יציאה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 20,
          "w": 16,
          "dir": "out",
          "label": "יציאה",
          "caption": "יציאה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 90
      }
    ],
    "components": [
      {
        "id": "addr-pick",
        "type": "gate-MUX16",
        "x": 445,
        "y": 330
      },
      {
        "id": "addr-cut",
        "type": "splitter",
        "x": 520,
        "y": 500,
        "outputs": 2,
        "mirrored": false,
        "legWidths": [
          10,
          6
        ],
        "singleWidth": 16
      },
      {
        "id": "bank",
        "type": "gate-RAM1024",
        "x": 710,
        "y": 535
      },
      {
        "id": "out-pick",
        "type": "gate-MUX16",
        "x": 960,
        "y": 550
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-pick.in1"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "addr-pick.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "addr-pick.in3"
      },
      {
        "a": "addr-pick.out",
        "b": "addr-cut.single"
      },
      {
        "a": "addr-cut.leg0",
        "b": "bank.in3"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "bank.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "bank.in2"
      },
      {
        "a": "bank.out",
        "b": "out-pick.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "out-pick.in3"
      },
      {
        "a": "out-pick.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. הבדיקה כותבת לכתובות בשני קצות הבנק — בכל כתיבה כתובת הקריאה מכוונת למקום אחר — קוראת הכל בחזרה, ומוודאת שבזמן כתיבה היציאה היא 0 ושכתיבה עם בקרה כבויה לא משנה כלום."
    }
  },
  "PC0": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "PC0",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-PC0",
      "x": 640,
      "y": 430,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -260,
          "y": -240,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -160,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "יציאת המונה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת המונה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "zero-mux",
        "type": "gate-MUX16",
        "x": 500,
        "y": 435
      },
      {
        "id": "counter",
        "type": "gate-Register",
        "x": 622,
        "y": 435
      },
      {
        "id": "plus-one",
        "type": "gate-Inc",
        "x": 711,
        "y": 490
      },
      {
        "id": "always-one",
        "type": "source",
        "x": 577,
        "y": 315
      },
      {
        "id": "loop-right",
        "type": "nail",
        "x": 759,
        "y": 566
      },
      {
        "id": "loop-left",
        "type": "nail",
        "x": 392,
        "y": 566
      },
      {
        "id": "loop-up",
        "type": "nail",
        "x": 392,
        "y": 416
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "zero-mux.in3"
      },
      {
        "a": "zero-mux.out",
        "b": "counter.in1"
      },
      {
        "a": "always-one.out",
        "b": "counter.in2"
      },
      {
        "a": "counter.out",
        "b": "plus-one.in1"
      },
      {
        "a": "counter.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "plus-one.out1",
        "b": "loop-right.in"
      },
      {
        "a": "loop-right.out",
        "b": "loop-left.in"
      },
      {
        "a": "loop-left.out",
        "b": "loop-up.in"
      },
      {
        "a": "loop-up.out",
        "b": "zero-mux.in1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. מחזיקים את האיפוס פעימה אחת, ואז המספר חייב לגדול ב-1 בכל פעימה ולחזור לנקודת ההתחלה אחרי איפוס נוסף. הבדיקה לא כופה מאיזה מספר מתחילים."
    }
  },
  "Cont0": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Cont0",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Cont0",
      "x": 640,
      "y": 430,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": 0,
          "w": 2,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": 0,
          "w": 2,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": -150,
          "w": 1,
          "dir": "in",
          "label": "יציאת D פנימית",
          "caption": "D"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": -150,
          "w": 1,
          "dir": "out",
          "label": "יציאת D",
          "caption": "D"
        },
        {
          "id": "outputInt2",
          "x": 260,
          "y": 0,
          "w": 1,
          "dir": "in",
          "label": "יציאת A פנימית",
          "caption": "A"
        },
        {
          "id": "outputExt2",
          "x": 340,
          "y": 0,
          "w": 1,
          "dir": "out",
          "label": "יציאת A",
          "caption": "A"
        },
        {
          "id": "outputInt3",
          "x": 260,
          "y": 150,
          "w": 1,
          "dir": "in",
          "label": "יציאת ‎*A‎ פנימית",
          "caption": "‎*A‎"
        },
        {
          "id": "outputExt3",
          "x": 340,
          "y": 150,
          "w": 1,
          "dir": "out",
          "label": "יציאת ‎*A‎",
          "caption": "‎*A‎"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "always-one",
        "type": "source",
        "x": 500,
        "y": 520
      },
      {
        "id": "pick",
        "type": "gate-Dmux4way",
        "x": 575,
        "y": 430
      }
    ],
    "wires": [
      {
        "a": "always-one.out",
        "b": "pick.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "pick.in2"
      },
      {
        "a": "pick.out2",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "pick.out3",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "pick.out4",
        "b": "task-card-1.outputInt3"
      }
    ],
    "check": {
      "cases": [
        {
          "control": 0
        },
        {
          "control": 1
        },
        {
          "control": 2
        },
        {
          "control": 3
        }
      ],
      "note": "כל ארבעת הערכים של בס הבקרה: 0 לא מדליק אף יציאה, 1 את D, 2 את A, 3 את ‎*A‎. היציאה הראשונה של ה-DMux4Way (זו של הערך 0) לא מחוברת לשום מקום."
    }
  },
  "CPU0": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "CPU0",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-CPU0",
      "x": 640,
      "y": 430,
      "frameW": 800,
      "frameH": 680,
      "pins": [
        {
          "id": "inputExt1",
          "x": -440,
          "y": -176,
          "w": 16,
          "dir": "in",
          "label": "כניסת הפקודה",
          "caption": "פקודה"
        },
        {
          "id": "inputInt1",
          "x": -360,
          "y": -176,
          "w": 16,
          "dir": "out",
          "label": "כניסת הפקודה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -440,
          "y": 176,
          "w": 16,
          "dir": "in",
          "label": "כניסת הקלט",
          "caption": "⁧קלט ‎*A‎⁩"
        },
        {
          "id": "inputInt2",
          "x": -360,
          "y": 176,
          "w": 16,
          "dir": "out",
          "label": "כניסת הקלט פנימית"
        },
        {
          "id": "inputExt3",
          "x": -347,
          "y": -370,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt3",
          "x": -347,
          "y": -290,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "outputInt1",
          "x": 360,
          "y": -88,
          "w": 16,
          "dir": "in",
          "label": "יציאת A פנימית"
        },
        {
          "id": "outputExt1",
          "x": 440,
          "y": -88,
          "w": 16,
          "dir": "out",
          "label": "יציאת A",
          "caption": "A"
        },
        {
          "id": "outputInt2",
          "x": 360,
          "y": -252,
          "w": 16,
          "dir": "in",
          "label": "יציאת PC פנימית"
        },
        {
          "id": "outputExt2",
          "x": 440,
          "y": -252,
          "w": 16,
          "dir": "out",
          "label": "יציאת PC",
          "caption": "PC"
        },
        {
          "id": "outputInt3",
          "x": 360,
          "y": 88,
          "w": 16,
          "dir": "in",
          "label": "יציאת הפלט פנימית"
        },
        {
          "id": "outputExt3",
          "x": 440,
          "y": 88,
          "w": 16,
          "dir": "out",
          "label": "יציאת הפלט",
          "caption": "⁧פלט ‎*A‎⁩"
        },
        {
          "id": "outputInt4",
          "x": 360,
          "y": 252,
          "w": 1,
          "dir": "in",
          "label": "יציאת הכתיבה פנימית"
        },
        {
          "id": "outputExt4",
          "x": 440,
          "y": 252,
          "w": 1,
          "dir": "out",
          "label": "יציאת הכתיבה",
          "caption": "⁧בקרת ‎*A‎⁩"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "counter",
        "type": "gate-PC0",
        "x": 520,
        "y": 175
      },
      {
        "id": "control",
        "type": "gate-Cont0",
        "x": 535,
        "y": 360
      },
      {
        "id": "alu",
        "type": "gate-ALU3",
        "x": 835,
        "y": 520
      },
      {
        "id": "reg-a",
        "type": "gate-Register",
        "x": 705,
        "y": 480
      },
      {
        "id": "reg-d",
        "type": "gate-Register",
        "x": 700,
        "y": 370
      },
      {
        "id": "word-split",
        "type": "splitter",
        "x": 320,
        "y": 300,
        "outputs": 3,
        "mirrored": false,
        "legWidths": [
          2,
          2,
          12
        ],
        "singleWidth": 16
      },
      {
        "id": "write-nail-out",
        "type": "nail",
        "x": 595,
        "y": 685
      },
      {
        "id": "ctrl-nail-in",
        "type": "nail",
        "x": 830,
        "y": 265
      },
      {
        "id": "res-nail-1",
        "type": "nail",
        "x": 875,
        "y": 600
      },
      {
        "id": "res-nail-2",
        "type": "nail",
        "x": 630,
        "y": 605
      },
      {
        "id": "res-nail-3",
        "type": "nail",
        "x": 625,
        "y": 425
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "word-split.single"
      },
      {
        "a": "control.in1",
        "b": "word-split.leg1"
      },
      {
        "a": "control.out1",
        "b": "reg-d.in2"
      },
      {
        "a": "control.out2",
        "b": "reg-a.in2"
      },
      {
        "a": "task-card-1.outputInt3",
        "b": "alu.out1"
      },
      {
        "a": "control.out3",
        "b": "write-nail-out.in"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "alu.in3"
      },
      {
        "a": "alu.in2",
        "b": "reg-a.out"
      },
      {
        "a": "alu.in4",
        "b": "ctrl-nail-in.out"
      },
      {
        "a": "alu.in1",
        "b": "reg-d.out"
      },
      {
        "a": "alu.out1",
        "b": "res-nail-1.in"
      },
      {
        "a": "res-nail-1.out",
        "b": "res-nail-2.in"
      },
      {
        "a": "res-nail-2.out",
        "b": "res-nail-3.in"
      },
      {
        "a": "reg-a.in1",
        "b": "res-nail-3.out"
      },
      {
        "a": "reg-d.in1",
        "b": "res-nail-3.out"
      },
      {
        "a": "task-card-1.outputInt1",
        "b": "reg-a.out"
      },
      {
        "a": "word-split.leg2",
        "b": "ctrl-nail-in.in"
      },
      {
        "a": "write-nail-out.out",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "counter.in1"
      },
      {
        "a": "counter.out",
        "b": "task-card-1.outputInt2"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. הבדיקה מריצה תוכנית של פקודות אמיתיות ובכל פעימה משווה את ארבע היציאות למה שהפרק אומר. הרגיסטרים מראים מה שהם מחזיקים, ולכן כתיבה נראית בפעימה שאחריה. הבנייה היא ALU3 (המעבד לא צריך את ng ו-zr), שני רגיסטרים, יחידת הבקרה, המונה ומפצל אחד לפקודה — שתי הכתובות יוצאות שלמות, ולכן אין בו אף מפצל של כתובת."
    }
  },
  "Computer0": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Computer0",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Computer0",
      "x": 660,
      "y": 440,
      "frameW": 1000,
      "frameH": 700,
      "pins": [
        {
          "id": "inputExt6",
          "x": -560,
          "y": -312,
          "w": 16,
          "dir": "in",
          "label": "כניסת כתובת התוכנה",
          "caption": "Prg-Adr"
        },
        {
          "id": "inputInt6",
          "x": -440,
          "y": -312,
          "w": 16,
          "dir": "out",
          "label": "כניסת כתובת התוכנה פנימית"
        },
        {
          "id": "inputExt7",
          "x": -560,
          "y": -225,
          "w": 16,
          "dir": "in",
          "label": "כניסת הפקודה לכתיבה",
          "caption": "Prg"
        },
        {
          "id": "inputInt7",
          "x": -440,
          "y": -225,
          "w": 16,
          "dir": "out",
          "label": "כניסת הפקודה לכתיבה פנימית"
        },
        {
          "id": "inputExt5",
          "x": -271,
          "y": -420,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt5",
          "x": -271,
          "y": -280,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "inputExt1",
          "x": -560,
          "y": 25,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In0",
          "caption": "In0"
        },
        {
          "id": "inputInt1",
          "x": -440,
          "y": 25,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In0 פנימית"
        },
        {
          "id": "inputExt2",
          "x": -560,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In1",
          "caption": "In1"
        },
        {
          "id": "inputInt2",
          "x": -440,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In1 פנימית"
        },
        {
          "id": "inputExt3",
          "x": -560,
          "y": 175,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In2",
          "caption": "In2"
        },
        {
          "id": "inputInt3",
          "x": -440,
          "y": 175,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In2 פנימית"
        },
        {
          "id": "inputExt4",
          "x": -560,
          "y": 250,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In3",
          "caption": "In3"
        },
        {
          "id": "inputInt4",
          "x": -440,
          "y": 250,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In3 פנימית"
        },
        {
          "id": "outputInt1",
          "x": 440,
          "y": 25,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out0 פנימית"
        },
        {
          "id": "outputExt1",
          "x": 560,
          "y": 25,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out0",
          "caption": "Out0"
        },
        {
          "id": "outputInt2",
          "x": 440,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out1 פנימית"
        },
        {
          "id": "outputExt2",
          "x": 560,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out1",
          "caption": "Out1"
        },
        {
          "id": "outputInt3",
          "x": 440,
          "y": 175,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out2 פנימית"
        },
        {
          "id": "outputExt3",
          "x": 560,
          "y": 175,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out2",
          "caption": "Out2"
        },
        {
          "id": "outputInt4",
          "x": 440,
          "y": 250,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out3 פנימית"
        },
        {
          "id": "outputExt4",
          "x": 560,
          "y": 250,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out3",
          "caption": "Out3"
        }
      ]
    },
    "components": [
      {
        "id": "program",
        "type": "gate-Prg",
        "x": 630,
        "y": 230
      },
      {
        "id": "cpu",
        "type": "gate-CPU0",
        "x": 390,
        "y": 353
      },
      {
        "id": "memory",
        "type": "gate-RAM",
        "x": 630,
        "y": 560
      },
      {
        "id": "instr-nail-1",
        "type": "nail",
        "x": 780,
        "y": 230
      },
      {
        "id": "instr-nail-2",
        "type": "nail",
        "x": 780,
        "y": 115
      },
      {
        "id": "instr-nail-3",
        "type": "nail",
        "x": 320,
        "y": 115
      },
      {
        "id": "mem-nail-1",
        "type": "nail",
        "x": 780,
        "y": 480
      },
      {
        "id": "mem-nail-2",
        "type": "nail",
        "x": 780,
        "y": 750
      },
      {
        "id": "mem-nail-3",
        "type": "nail",
        "x": 321,
        "y": 757
      }
    ],
    "wires": [
      {
        "a": "cpu.out2",
        "b": "program.in3"
      },
      {
        "a": "task-card-1.inputInt6",
        "b": "program.in4"
      },
      {
        "a": "task-card-1.inputInt7",
        "b": "program.in1"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "program.in2"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "cpu.in3"
      },
      {
        "a": "cpu.out1",
        "b": "memory.in3"
      },
      {
        "a": "cpu.out3",
        "b": "memory.in1"
      },
      {
        "a": "cpu.out4",
        "b": "memory.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "memory.inP1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "memory.inP2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "memory.inP3"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "memory.inP4"
      },
      {
        "a": "memory.outP1",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "memory.outP2",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "memory.outP3",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "memory.outP4",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "program.out",
        "b": "instr-nail-1.in"
      },
      {
        "a": "instr-nail-1.out",
        "b": "instr-nail-2.in"
      },
      {
        "a": "instr-nail-2.out",
        "b": "instr-nail-3.in"
      },
      {
        "a": "instr-nail-3.out",
        "b": "cpu.in1"
      },
      {
        "a": "memory.out",
        "b": "mem-nail-1.in"
      },
      {
        "a": "mem-nail-1.out",
        "b": "mem-nail-2.in"
      },
      {
        "a": "mem-nail-2.out",
        "b": "mem-nail-3.in"
      },
      {
        "a": "mem-nail-3.out",
        "b": "cpu.in2"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: הבדיקה כותבת תוכנית לזיכרון התוכנה (Prg) כשהריסט דלוק, מרפה ממנו ומריצה אותה פקודה בכל פעימה. הבנייה היא שלושה כרטיסים — CPU0, זיכרון התוכנה Prg וזיכרון הדאטה RAM — ושתי לולאות שחוזרות למעבד על נעצים: הפקודה מעל הלוח והמספר מהזיכרון מתחתיו."
    },
    "external": []
  },
  "PC": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "PC",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-PC",
      "x": 640,
      "y": 430,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt3",
          "x": -340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה",
          "caption": "דאטה"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "כניסת הדאטה פנימית"
        },
        {
          "id": "inputExt1",
          "x": -60,
          "y": -240,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt1",
          "x": -60,
          "y": -160,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "inputExt2",
          "x": -260,
          "y": -240,
          "w": 1,
          "dir": "in",
          "label": "כניסת הבקרה",
          "caption": "בקרה"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": -160,
          "w": 1,
          "dir": "out",
          "label": "כניסת הבקרה פנימית",
          "caption": "בקרה"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": "יציאת המונה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "out",
          "label": "יציאת המונה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "load-mux",
        "type": "gate-MUX16",
        "x": 465,
        "y": 430
      },
      {
        "id": "zero-mux",
        "type": "gate-MUX16",
        "x": 585,
        "y": 430
      },
      {
        "id": "counter",
        "type": "gate-Register",
        "x": 745,
        "y": 430
      },
      {
        "id": "plus-one",
        "type": "gate-Inc",
        "x": 840,
        "y": 505
      },
      {
        "id": "always-one",
        "type": "source",
        "x": 705,
        "y": 300
      },
      {
        "id": "loop-right",
        "type": "nail",
        "x": 890,
        "y": 575
      },
      {
        "id": "loop-left",
        "type": "nail",
        "x": 380,
        "y": 580
      },
      {
        "id": "loop-up",
        "type": "nail",
        "x": 380,
        "y": 470
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "load-mux.in2"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "load-mux.in3"
      },
      {
        "a": "load-mux.out",
        "b": "zero-mux.in1"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "zero-mux.in3"
      },
      {
        "a": "zero-mux.out",
        "b": "counter.in1"
      },
      {
        "a": "always-one.out",
        "b": "counter.in2"
      },
      {
        "a": "counter.out",
        "b": "plus-one.in1"
      },
      {
        "a": "counter.out",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "plus-one.out1",
        "b": "loop-right.in"
      },
      {
        "a": "loop-right.out",
        "b": "loop-left.in"
      },
      {
        "a": "loop-left.out",
        "b": "loop-up.in"
      },
      {
        "a": "loop-up.out",
        "b": "load-mux.in1"
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: אין טבלת אמת. מחזיקים את האיפוס פעימה אחת, ואז המספר חייב לגדול ב-1 בכל פעימה ולחזור לנקודת ההתחלה אחרי איפוס נוסף. הבדיקה לא כופה מאיזה מספר מתחילים."
    }
  },
  "JmpCnt": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "JmpCnt",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-JmpCnt",
      "x": 640,
      "y": 430,
      "frameW": 600,
      "frameH": 420,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -150,
          "w": 2,
          "dir": "in",
          "label": "כניסת תנאי הקפיצה"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -150,
          "w": 2,
          "dir": "out",
          "label": "כניסת תנאי הקפיצה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 20,
          "w": 1,
          "dir": "in",
          "label": "כניסת zr",
          "caption": "zr"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 20,
          "w": 1,
          "dir": "out",
          "label": "כניסת zr פנימית",
          "caption": "zr"
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 150,
          "w": 1,
          "dir": "in",
          "label": "כניסת ng",
          "caption": "ng"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 150,
          "w": 1,
          "dir": "out",
          "label": "כניסת ng פנימית",
          "caption": "ng"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": 0,
          "w": 1,
          "dir": "in",
          "label": "יציאת הקפיצה פנימית"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": 0,
          "w": 1,
          "dir": "out",
          "label": "יציאת הקפיצה"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "cond-split",
        "type": "splitter",
        "x": 440,
        "y": 300,
        "outputs": 2,
        "legWidths": [
          1,
          1
        ],
        "mirrored": false
      },
      {
        "id": "and-zero",
        "type": "gate-And",
        "x": 660,
        "y": 330
      },
      {
        "id": "and-neg",
        "type": "gate-And",
        "x": 660,
        "y": 520
      },
      {
        "id": "or-jump",
        "type": "gate-Or",
        "x": 810,
        "y": 430
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "cond-split.single"
      },
      {
        "a": "cond-split.leg1",
        "b": "and-zero.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "and-zero.in2"
      },
      {
        "a": "cond-split.leg0",
        "b": "and-neg.in1"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "and-neg.in2"
      },
      {
        "a": "and-zero.out",
        "b": "or-jump.in1"
      },
      {
        "a": "and-neg.out",
        "b": "or-jump.in2"
      },
      {
        "a": "or-jump.out",
        "b": "task-card-1.outputInt1"
      }
    ],
    "check": {
      "note": "כל 16 הצירופים של שני ביטי התנאי, zr ו-ng."
    }
  },
  "Cont": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Cont",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Cont",
      "x": 640,
      "y": 430,
      "frameW": 600,
      "frameH": 480,
      "pins": [
        {
          "id": "inputExt1",
          "x": -340,
          "y": -150,
          "w": 4,
          "dir": "in",
          "label": "כניסת הבקרה"
        },
        {
          "id": "inputInt1",
          "x": -260,
          "y": -150,
          "w": 4,
          "dir": "out",
          "label": "כניסת הבקרה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -340,
          "y": 20,
          "w": 1,
          "dir": "in",
          "label": "כניסת zr",
          "caption": "zr"
        },
        {
          "id": "inputInt2",
          "x": -260,
          "y": 20,
          "w": 1,
          "dir": "out",
          "label": "כניסת zr פנימית",
          "caption": "zr"
        },
        {
          "id": "inputExt3",
          "x": -340,
          "y": 150,
          "w": 1,
          "dir": "in",
          "label": "כניסת ng",
          "caption": "ng"
        },
        {
          "id": "inputInt3",
          "x": -260,
          "y": 150,
          "w": 1,
          "dir": "out",
          "label": "כניסת ng פנימית",
          "caption": "ng"
        },
        {
          "id": "outputInt1",
          "x": 260,
          "y": -180,
          "w": 1,
          "dir": "in",
          "label": "יציאת D פנימית",
          "caption": "D"
        },
        {
          "id": "outputExt1",
          "x": 340,
          "y": -180,
          "w": 1,
          "dir": "out",
          "label": "יציאת D",
          "caption": "D"
        },
        {
          "id": "outputInt2",
          "x": 260,
          "y": -60,
          "w": 1,
          "dir": "in",
          "label": "יציאת A פנימית",
          "caption": "A"
        },
        {
          "id": "outputExt2",
          "x": 340,
          "y": -60,
          "w": 1,
          "dir": "out",
          "label": "יציאת A",
          "caption": "A"
        },
        {
          "id": "outputInt3",
          "x": 260,
          "y": 60,
          "w": 1,
          "dir": "in",
          "label": "יציאת *A פנימית",
          "caption": "*A"
        },
        {
          "id": "outputExt3",
          "x": 340,
          "y": 60,
          "w": 1,
          "dir": "out",
          "label": "יציאת *A",
          "caption": "*A"
        },
        {
          "id": "outputInt4",
          "x": 260,
          "y": 180,
          "w": 1,
          "dir": "in",
          "label": "יציאת PC פנימית",
          "caption": "PC"
        },
        {
          "id": "outputExt4",
          "x": 340,
          "y": 180,
          "w": 1,
          "dir": "out",
          "label": "יציאת PC",
          "caption": "PC"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "bus-split",
        "type": "splitter",
        "x": 455,
        "y": 280,
        "outputs": 2,
        "legWidths": [
          2,
          2
        ],
        "mirrored": false
      },
      {
        "id": "dest",
        "type": "gate-Cont0",
        "x": 690,
        "y": 265
      },
      {
        "id": "jump",
        "type": "gate-JmpCnt",
        "x": 700,
        "y": 570
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "bus-split.single"
      },
      {
        "a": "bus-split.leg1",
        "b": "dest.in1"
      },
      {
        "a": "bus-split.leg0",
        "b": "jump.in1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "jump.in2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "jump.in3"
      },
      {
        "a": "dest.out1",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "dest.out2",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "dest.out3",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "jump.out",
        "b": "task-card-1.outputInt4"
      }
    ],
    "check": {
      "note": "כל 64 הצירופים של שני ביטי היעד, שני ביטי תנאי הקפיצה, zr ו-ng."
    }
  },
  "CPU": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "CPU",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-CPU",
      "x": 640,
      "y": 430,
      "frameW": 800,
      "frameH": 680,
      "pins": [
        {
          "id": "inputExt1",
          "x": -440,
          "y": -176,
          "w": 16,
          "dir": "in",
          "label": "כניסת הפקודה",
          "caption": "פקודה"
        },
        {
          "id": "inputInt1",
          "x": -360,
          "y": -176,
          "w": 16,
          "dir": "out",
          "label": "כניסת הפקודה פנימית"
        },
        {
          "id": "inputExt2",
          "x": -440,
          "y": 176,
          "w": 16,
          "dir": "in",
          "label": "כניסת הקלט",
          "caption": "⁧קלט ‎*A‎⁩"
        },
        {
          "id": "inputInt2",
          "x": -360,
          "y": 176,
          "w": 16,
          "dir": "out",
          "label": "כניסת הקלט פנימית"
        },
        {
          "id": "inputExt3",
          "x": -347,
          "y": -370,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt3",
          "x": -347,
          "y": -290,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "outputInt1",
          "x": 360,
          "y": -88,
          "w": 16,
          "dir": "in",
          "label": "יציאת A פנימית"
        },
        {
          "id": "outputExt1",
          "x": 440,
          "y": -88,
          "w": 16,
          "dir": "out",
          "label": "יציאת A",
          "caption": "A"
        },
        {
          "id": "outputInt2",
          "x": 360,
          "y": -252,
          "w": 16,
          "dir": "in",
          "label": "יציאת PC פנימית"
        },
        {
          "id": "outputExt2",
          "x": 440,
          "y": -252,
          "w": 16,
          "dir": "out",
          "label": "יציאת PC",
          "caption": "PC"
        },
        {
          "id": "outputInt3",
          "x": 360,
          "y": 88,
          "w": 16,
          "dir": "in",
          "label": "יציאת הפלט פנימית"
        },
        {
          "id": "outputExt3",
          "x": 440,
          "y": 88,
          "w": 16,
          "dir": "out",
          "label": "יציאת הפלט",
          "caption": "⁧פלט ‎*A‎⁩"
        },
        {
          "id": "outputInt4",
          "x": 360,
          "y": 252,
          "w": 1,
          "dir": "in",
          "label": "יציאת הכתיבה פנימית"
        },
        {
          "id": "outputExt4",
          "x": 440,
          "y": 252,
          "w": 1,
          "dir": "out",
          "label": "יציאת הכתיבה",
          "caption": "⁧בקרת ‎*A‎⁩"
        }
      ]
    },
    "external": [
      {
        "id": "source-1",
        "type": "source",
        "x": 90,
        "y": 140
      }
    ],
    "components": [
      {
        "id": "counter",
        "type": "gate-PC",
        "x": 520,
        "y": 175
      },
      {
        "id": "control",
        "type": "gate-Cont",
        "x": 535,
        "y": 360
      },
      {
        "id": "alu",
        "type": "gate-ALU4",
        "x": 835,
        "y": 520
      },
      {
        "id": "reg-a",
        "type": "gate-Register",
        "x": 705,
        "y": 480
      },
      {
        "id": "reg-d",
        "type": "gate-Register",
        "x": 700,
        "y": 370
      },
      {
        "id": "word-split",
        "type": "splitter",
        "x": 320,
        "y": 300,
        "outputs": 2,
        "mirrored": false,
        "legWidths": [
          4,
          12
        ],
        "singleWidth": 16
      },
      {
        "id": "write-nail-out",
        "type": "nail",
        "x": 595,
        "y": 685
      },
      {
        "id": "ctrl-nail-in",
        "type": "nail",
        "x": 830,
        "y": 265
      },
      {
        "id": "res-nail-1",
        "type": "nail",
        "x": 875,
        "y": 600
      },
      {
        "id": "res-nail-2",
        "type": "nail",
        "x": 630,
        "y": 605
      },
      {
        "id": "res-nail-3",
        "type": "nail",
        "x": 625,
        "y": 425
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt1",
        "b": "word-split.single"
      },
      {
        "a": "control.out1",
        "b": "reg-d.in2"
      },
      {
        "a": "control.out2",
        "b": "reg-a.in2"
      },
      {
        "a": "task-card-1.outputInt3",
        "b": "alu.out1"
      },
      {
        "a": "control.out3",
        "b": "write-nail-out.in"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "alu.in3"
      },
      {
        "a": "alu.in2",
        "b": "reg-a.out"
      },
      {
        "a": "alu.in4",
        "b": "ctrl-nail-in.out"
      },
      {
        "a": "alu.in1",
        "b": "reg-d.out"
      },
      {
        "a": "alu.out1",
        "b": "res-nail-1.in"
      },
      {
        "a": "res-nail-1.out",
        "b": "res-nail-2.in"
      },
      {
        "a": "res-nail-2.out",
        "b": "res-nail-3.in"
      },
      {
        "a": "reg-a.in1",
        "b": "res-nail-3.out"
      },
      {
        "a": "reg-d.in1",
        "b": "res-nail-3.out"
      },
      {
        "a": "task-card-1.outputInt1",
        "b": "reg-a.out"
      },
      {
        "a": "write-nail-out.out",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "counter.in1"
      },
      {
        "a": "counter.out",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "control.in1",
        "b": "word-split.leg0"
      },
      {
        "a": "word-split.leg1",
        "b": "ctrl-nail-in.in"
      },
      {
        "a": "alu.out3",
        "b": "control.in2"
      },
      {
        "a": "alu.out2",
        "b": "control.in3"
      },
      {
        "a": "control.out4",
        "b": "counter.in2"
      },
      {
        "a": "reg-a.out",
        "b": "counter.in3"
      }
    ],
    "check": {
      "note": "תוכנית קצרה שמסתיימת בקפיצות: על 0, על שלילי, על שניהם, ואיפוס שגובר על קפיצה."
    }
  },
  "Computer": {
    "format": "theonemachine-solution",
    "version": 1,
    "task": "Computer",
    "frame": {
      "id": "task-card-1",
      "type": "taskCard-Computer",
      "x": 660,
      "y": 440,
      "frameW": 1000,
      "frameH": 700,
      "pins": [
        {
          "id": "inputExt6",
          "x": -560,
          "y": -312,
          "w": 16,
          "dir": "in",
          "label": "כניסת כתובת התוכנה",
          "caption": "Prg-Adr"
        },
        {
          "id": "inputInt6",
          "x": -440,
          "y": -312,
          "w": 16,
          "dir": "out",
          "label": "כניסת כתובת התוכנה פנימית"
        },
        {
          "id": "inputExt7",
          "x": -560,
          "y": -225,
          "w": 16,
          "dir": "in",
          "label": "כניסת הפקודה לכתיבה",
          "caption": "Prg"
        },
        {
          "id": "inputInt7",
          "x": -440,
          "y": -225,
          "w": 16,
          "dir": "out",
          "label": "כניסת הפקודה לכתיבה פנימית"
        },
        {
          "id": "inputExt5",
          "x": -271,
          "y": -420,
          "w": 1,
          "dir": "in",
          "label": "כניסת האיפוס",
          "caption": "reset"
        },
        {
          "id": "inputInt5",
          "x": -271,
          "y": -280,
          "w": 1,
          "dir": "out",
          "label": "כניסת האיפוס פנימית",
          "caption": "reset"
        },
        {
          "id": "inputExt1",
          "x": -560,
          "y": 25,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In0",
          "caption": "In0"
        },
        {
          "id": "inputInt1",
          "x": -440,
          "y": 25,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In0 פנימית"
        },
        {
          "id": "inputExt2",
          "x": -560,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In1",
          "caption": "In1"
        },
        {
          "id": "inputInt2",
          "x": -440,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In1 פנימית"
        },
        {
          "id": "inputExt3",
          "x": -560,
          "y": 175,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In2",
          "caption": "In2"
        },
        {
          "id": "inputInt3",
          "x": -440,
          "y": 175,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In2 פנימית"
        },
        {
          "id": "inputExt4",
          "x": -560,
          "y": 250,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט In3",
          "caption": "In3"
        },
        {
          "id": "inputInt4",
          "x": -440,
          "y": 250,
          "w": 16,
          "dir": "out",
          "label": "כניסת פורט In3 פנימית"
        },
        {
          "id": "outputInt1",
          "x": 440,
          "y": 25,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out0 פנימית"
        },
        {
          "id": "outputExt1",
          "x": 560,
          "y": 25,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out0",
          "caption": "Out0"
        },
        {
          "id": "outputInt2",
          "x": 440,
          "y": 100,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out1 פנימית"
        },
        {
          "id": "outputExt2",
          "x": 560,
          "y": 100,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out1",
          "caption": "Out1"
        },
        {
          "id": "outputInt3",
          "x": 440,
          "y": 175,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out2 פנימית"
        },
        {
          "id": "outputExt3",
          "x": 560,
          "y": 175,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out2",
          "caption": "Out2"
        },
        {
          "id": "outputInt4",
          "x": 440,
          "y": 250,
          "w": 16,
          "dir": "in",
          "label": "יציאת פורט Out3 פנימית"
        },
        {
          "id": "outputExt4",
          "x": 560,
          "y": 250,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט Out3",
          "caption": "Out3"
        }
      ]
    },
    "components": [
      {
        "id": "program",
        "type": "gate-Prg",
        "x": 630,
        "y": 230
      },
      {
        "id": "cpu",
        "type": "gate-CPU",
        "x": 390,
        "y": 353
      },
      {
        "id": "memory",
        "type": "gate-RAM",
        "x": 630,
        "y": 560
      },
      {
        "id": "instr-nail-1",
        "type": "nail",
        "x": 780,
        "y": 230
      },
      {
        "id": "instr-nail-2",
        "type": "nail",
        "x": 780,
        "y": 115
      },
      {
        "id": "instr-nail-3",
        "type": "nail",
        "x": 320,
        "y": 115
      },
      {
        "id": "mem-nail-1",
        "type": "nail",
        "x": 780,
        "y": 480
      },
      {
        "id": "mem-nail-2",
        "type": "nail",
        "x": 780,
        "y": 750
      },
      {
        "id": "mem-nail-3",
        "type": "nail",
        "x": 321,
        "y": 757
      }
    ],
    "wires": [
      {
        "a": "cpu.out2",
        "b": "program.in3"
      },
      {
        "a": "task-card-1.inputInt6",
        "b": "program.in4"
      },
      {
        "a": "task-card-1.inputInt7",
        "b": "program.in1"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "program.in2"
      },
      {
        "a": "task-card-1.inputInt5",
        "b": "cpu.in3"
      },
      {
        "a": "cpu.out1",
        "b": "memory.in3"
      },
      {
        "a": "cpu.out3",
        "b": "memory.in1"
      },
      {
        "a": "cpu.out4",
        "b": "memory.in2"
      },
      {
        "a": "task-card-1.inputInt1",
        "b": "memory.inP1"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "memory.inP2"
      },
      {
        "a": "task-card-1.inputInt3",
        "b": "memory.inP3"
      },
      {
        "a": "task-card-1.inputInt4",
        "b": "memory.inP4"
      },
      {
        "a": "memory.outP1",
        "b": "task-card-1.outputInt1"
      },
      {
        "a": "memory.outP2",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "memory.outP3",
        "b": "task-card-1.outputInt3"
      },
      {
        "a": "memory.outP4",
        "b": "task-card-1.outputInt4"
      },
      {
        "a": "program.out",
        "b": "instr-nail-1.in"
      },
      {
        "a": "instr-nail-1.out",
        "b": "instr-nail-2.in"
      },
      {
        "a": "instr-nail-2.out",
        "b": "instr-nail-3.in"
      },
      {
        "a": "instr-nail-3.out",
        "b": "cpu.in1"
      },
      {
        "a": "memory.out",
        "b": "mem-nail-1.in"
      },
      {
        "a": "mem-nail-1.out",
        "b": "mem-nail-2.in"
      },
      {
        "a": "mem-nail-2.out",
        "b": "mem-nail-3.in"
      },
      {
        "a": "mem-nail-3.out",
        "b": "cpu.in2"
      }
    ],
    "check": {
      "note": "אותן תוכניות כמו במחשב הפשוט, ועוד תוכנית שקופצת מעל שתי פקודות."
    },
    "external": []
  }
};

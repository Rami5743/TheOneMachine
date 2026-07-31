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
          "label": "יציאת nz",
          "caption": "nz"
        },
        {
          "id": "outputExt3",
          "x": 195,
          "y": 225,
          "w": 1,
          "dir": "out",
          "label": "",
          "caption": "nz"
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
        "x": 550,
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
        "id": "nz",
        "type": "gate-Neq0_16",
        "x": 675,
        "y": 425
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
        "b": "nz.in1"
      },
      {
        "a": "ng-split.leg1",
        "b": "task-card-1.outputInt2"
      },
      {
        "a": "nz.out",
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
      "note": "ALU4 = ALU3 result on the main output; ng = the first (top/MSB) bit of the result; nz = 1 iff the result is non-zero."
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
        "id": "addr-nail-2",
        "type": "nail",
        "x": 355,
        "y": 300
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
        "a": "task-card-1.inputInt3",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
        "id": "addr-nail-2",
        "type": "nail",
        "x": 390,
        "y": 250
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
        "a": "addr-split.leg1",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
        "id": "addr-nail-2",
        "type": "nail",
        "x": 390,
        "y": 250
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
        "a": "addr-split.leg1",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
        "id": "addr-nail-2",
        "type": "nail",
        "x": 390,
        "y": 250
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
        "a": "addr-split.leg1",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
        "id": "addr-nail-2",
        "type": "nail",
        "x": 390,
        "y": 250
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
        "a": "addr-split.leg1",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
          "y": -150,
          "w": 2,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -150,
          "w": 2,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -70,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -70,
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
          "y": -150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -150,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": -30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": -30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 150,
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
        "y": 290
      },
      {
        "id": "addr-nail-1",
        "type": "nail",
        "x": 320,
        "y": 180
      },
      {
        "id": "addr-nail-2",
        "type": "nail",
        "x": 355,
        "y": 300
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
        "a": "task-card-1.inputInt3",
        "b": "addr-nail-2.in"
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
        "a": "addr-nail-2.out",
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
          "y": -140,
          "w": 2,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": -140,
          "w": 2,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -50,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -50,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt2",
          "x": -460,
          "y": 10,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt2",
          "x": -340,
          "y": 10,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt3",
          "x": -460,
          "y": 70,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": 70,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 130,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 130,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "outputInt1",
          "x": 340,
          "y": 0,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": 0,
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
        "x": 760,
        "y": 440
      },
      {
        "id": "addr-nail",
        "type": "nail",
        "x": 760,
        "y": 300
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt5",
        "b": "addr-nail.in"
      },
      {
        "a": "addr-nail.out",
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
          "y": -150,
          "w": 3,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -150,
          "w": 3,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -70,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -70,
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
          "y": -150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -150,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": -30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": -30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 150,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 10,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 10,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": 70,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt5",
          "x": -460,
          "y": 70,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt6",
          "x": -340,
          "y": 130,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt6",
          "x": -460,
          "y": 130,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt7",
          "x": -340,
          "y": 190,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt7",
          "x": -460,
          "y": 190,
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
        "x": 330,
        "y": 330,
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
        "x": 470,
        "y": 200
      },
      {
        "id": "op",
        "type": "gate-OPorts",
        "x": 650,
        "y": 330
      },
      {
        "id": "ip",
        "type": "gate-IPorts",
        "x": 650,
        "y": 620
      },
      {
        "id": "read-sel",
        "type": "gate-MUX16",
        "x": 880,
        "y": 460
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
          "y": -150,
          "w": 11,
          "dir": "in",
          "label": "כניסת הכתובת"
        },
        {
          "id": "inputInt3",
          "x": -340,
          "y": -150,
          "w": 11,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt1",
          "x": -460,
          "y": -70,
          "w": 16,
          "dir": "in",
          "label": "כניסת הדאטה"
        },
        {
          "id": "inputInt1",
          "x": -340,
          "y": -70,
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
          "y": -150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt1",
          "x": 460,
          "y": -150,
          "w": 16,
          "dir": "out",
          "label": "יציאה"
        },
        {
          "id": "outputInt2",
          "x": 340,
          "y": -30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt2",
          "x": 460,
          "y": -30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 00"
        },
        {
          "id": "outputInt3",
          "x": 340,
          "y": 30,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt3",
          "x": 460,
          "y": 30,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 01"
        },
        {
          "id": "outputInt4",
          "x": 340,
          "y": 90,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt4",
          "x": 460,
          "y": 90,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 10"
        },
        {
          "id": "outputInt5",
          "x": 340,
          "y": 150,
          "w": 16,
          "dir": "in",
          "label": ""
        },
        {
          "id": "outputExt5",
          "x": 460,
          "y": 150,
          "w": 16,
          "dir": "out",
          "label": "יציאת פורט 11"
        },
        {
          "id": "inputInt4",
          "x": -340,
          "y": 10,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt4",
          "x": -460,
          "y": 10,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 00"
        },
        {
          "id": "inputInt5",
          "x": -340,
          "y": 70,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt5",
          "x": -460,
          "y": 70,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 01"
        },
        {
          "id": "inputInt6",
          "x": -340,
          "y": 130,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt6",
          "x": -460,
          "y": 130,
          "w": 16,
          "dir": "in",
          "label": "כניסת פורט 10"
        },
        {
          "id": "inputInt7",
          "x": -340,
          "y": 190,
          "w": 16,
          "dir": "out",
          "label": ""
        },
        {
          "id": "inputExt7",
          "x": -460,
          "y": 190,
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
        "x": 330,
        "y": 330,
        "outputs": 3,
        "legWidths": [
          3,
          7,
          1
        ],
        "mirrored": false
      },
      {
        "id": "addr-merge",
        "type": "splitter",
        "x": 480,
        "y": 400,
        "outputs": 2,
        "legWidths": [
          3,
          7
        ],
        "mirrored": true
      },
      {
        "id": "write-sel",
        "type": "gate-DMux",
        "x": 470,
        "y": 190
      },
      {
        "id": "big",
        "type": "gate-RAM1024",
        "x": 680,
        "y": 330
      },
      {
        "id": "ports",
        "type": "gate-Ports",
        "x": 680,
        "y": 620
      },
      {
        "id": "read-sel",
        "type": "gate-MUX16",
        "x": 900,
        "y": 460
      }
    ],
    "wires": [
      {
        "a": "task-card-1.inputInt3",
        "b": "addr-split.single"
      },
      {
        "a": "addr-split.leg0",
        "b": "addr-merge.leg0"
      },
      {
        "a": "addr-split.leg1",
        "b": "addr-merge.leg1"
      },
      {
        "a": "addr-merge.single",
        "b": "big.in3"
      },
      {
        "a": "addr-split.leg0",
        "b": "ports.in3"
      },
      {
        "a": "task-card-1.inputInt2",
        "b": "write-sel.in1"
      },
      {
        "a": "addr-split.leg2",
        "b": "write-sel.in2"
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
        "a": "addr-split.leg2",
        "b": "read-sel.in3"
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
      }
    ],
    "check": {
      "note": "כרטיס מתוזמן: הזיכרון הרגיל והפורטים בכתובת אחת. כותבים וקוראים בשני הטווחים, ומוודאים שהכתובות הקוראות-בלבד לא ניתנות לכתיבה."
    }
  }
};

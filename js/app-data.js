// app-data.js — static data tables extracted verbatim from app.js.
// Loaded BEFORE app.js so these globals are visible inside app.js's IIFE,
// exactly as when they were declared inline (same mechanism as data.js).
// PURE DATA ONLY. Each block was verified to evaluate standalone (no
// references to app.js internals) and to never be mutated after declaration.

  const TASK_DEFS = [
    {
      id: "Not",
      label: "Not",
      inputs: 1,
      description: "ה־Not הוא כרטיס עם כניסה אחת ויציאה אחת. הוא מוציא את ההפך ממה שנכנס אליו. אם נכנס אליו מתח הוא לא מוציא מתח, ואם לא נכנס אליו מתח הוא מוציא מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false], output: true },
        { inputs: [true], output: false }
      ]
    },
    {
      id: "And",
      label: "And",
      inputs: 2,
      description: "ה־And הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח רק אם שתי הכניסות מקבלות מתח. בכל מצב אחר הוא לא מוציא מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false], output: false },
        { inputs: [false, true], output: false },
        { inputs: [true, false], output: false },
        { inputs: [true, true], output: true }
      ]
    },
    {
      id: "Or",
      label: "Or",
      inputs: 2,
      description: "ה־Or הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח אם לפחות אחת מהכניסות מקבלת מתח. הוא לא מוציא מתח רק אם שתי הכניסות כבויות. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false], output: false },
        { inputs: [false, true], output: true },
        { inputs: [true, false], output: true },
        { inputs: [true, true], output: true }
      ]
    },
    {
      id: "Xor",
      label: "Xor",
      inputs: 2,
      description: "ה־Xor הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח אם בדיוק אחת משתי הכניסות מקבלת מתח. אם שתיהן זהות, הוא לא מוציא מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false], output: false },
        { inputs: [false, true], output: true },
        { inputs: [true, false], output: true },
        { inputs: [true, true], output: false }
      ]
    },
    {
      id: "AND3way",
      label: "And3Way",
      inputs: 3,
      description: "ה־And3Way הוא כרטיס עם שלוש כניסות ויציאה אחת. הוא מוציא מתח רק אם כל שלוש הכניסות מקבלות מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false, false], output: false },
        { inputs: [false, false, true], output: false },
        { inputs: [false, true, false], output: false },
        { inputs: [false, true, true], output: false },
        { inputs: [true, false, false], output: false },
        { inputs: [true, false, true], output: false },
        { inputs: [true, true, false], output: false },
        { inputs: [true, true, true], output: true }
      ]
    },
    {
      id: "OR4way",
      label: "Or4Way",
      inputs: 4,
      description: "ה־Or4Way הוא כרטיס עם ארבע כניסות ויציאה אחת. הוא מוציא מתח אם לפחות אחת מארבע הכניסות מקבלת מתח. הוא לא מוציא מתח רק אם כל הכניסות כבויות. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false, false, false], output: false },
        { inputs: [false, false, false, true], output: true },
        { inputs: [false, false, true, false], output: true },
        { inputs: [false, false, true, true], output: true },
        { inputs: [false, true, false, false], output: true },
        { inputs: [false, true, false, true], output: true },
        { inputs: [false, true, true, false], output: true },
        { inputs: [false, true, true, true], output: true },
        { inputs: [true, false, false, false], output: true },
        { inputs: [true, false, false, true], output: true },
        { inputs: [true, false, true, false], output: true },
        { inputs: [true, false, true, true], output: true },
        { inputs: [true, true, false, false], output: true },
        { inputs: [true, true, false, true], output: true },
        { inputs: [true, true, true, false], output: true },
        { inputs: [true, true, true, true], output: true }
      ]
    }
  ];

  const SVG_PIN_FALLBACKS = {
    source: { out: { x: 46, y: 0 } },
    lamp: { in: { x: 0, y: 30 } },
    nand: { in1: { x: -60, y: -24 }, in2: { x: -60, y: 24 }, out: { x: 80, y: 0 } },
    "gate-Not": { in1: { x: -60, y: 0 }, out: { x: 80, y: 0 } },
    "gate-And": { in1: { x: -62, y: -23 }, in2: { x: -62, y: 23 }, out: { x: 66, y: 0 } },
    "gate-AND3way": { in1: { x: -62, y: -27 }, in2: { x: -62, y: 0 }, in3: { x: -62, y: 27 }, out: { x: 66, y: 0 } },
    "gate-Or": { in1: { x: -58, y: -23 }, in2: { x: -58, y: 23 }, out: { x: 80, y: 0 } },
    "gate-Xor": { in1: { x: -60, y: -23 }, in2: { x: -60, y: 23 }, out: { x: 80, y: 0 } },
    "gate-OR4way": {
      in1: { x: -60.326107, y: -30 },
      in2: { x: -59.462559, y: -9.9898129 },
      in3: { x: -59.919762, y: 10.020376 },
      in4: { x: -60.369907, y: 30 },
      out: { x: 80, y: 0 }
    }
  };

  const DEFAULT_WORKSPACE_COMPONENTS = [
    { id: "source-1", type: "source", x: 220, y: 300 },
    { id: "nand-1", type: "nand", x: 500, y: 300 },
    { id: "lamp-1", type: "lamp", x: 780, y: 270 }
  ];

  const OLD_TERMINAL_REFS = {
    "source.out": "source-1.out",
    "nand.in1": "nand-1.in1",
    "nand.in2": "nand-1.in2",
    "nand.out": "nand-1.out",
    "lamp.in": "lamp-1.in"
  };

  const FALLBACK_END_DIALOGS = {
    helpPrompt: {
      size: "small",
      ariaLabel: "בקשת עזרה",
      title: "האם אתה מסכים לעזור"
    },
    helpRefusal: {
      size: "large",
      ariaLabel: "סירוב לעזור",
      paragraphs: [
        "חבל מאוד. פון-נוימן לא יצליח לבנות את המחשב לבד בזמן הפרויקט. את הפצצה הגרעינית הם יצליחו לבנות, אבל מאוחר מדי. גרמניה הנאצית תיכנע כמה חודשים קודם לכן, אבל לא לפני שהיא תהרוס את אירופה ותרצח כמעט את כל היהודים בה. חלק גדול מהיהודים נרצחו ממש בחודשים האחרונים של המלחמה. אם הפצצה הייתה מוכנה שנה קודם לכן, מותם היה נמנע.",
        "בסופו של דבר הצליח פון-נוימן לממש את החזון של בבג', טיורינג ושלו, ובנה מחשב אלקטרוני. אבל זה לקח עוד 10 שנים. המחשבים האלקטרוניים לא רק החליפו את המחשבים האנושיים, הם הפכו לאחד הכלים המרכזיים בעולם המודרני. מלבד המחשבים האישיים המקיפים אותנו, היום יש מחשבים כמעט בכל מכשיר אלקטרוני. אפשר רק לדמיין איפה היינו היום אם המהפכה הזאת הייתה קורה 10 שנים קודם.",
        "אבל הי, כנראה שיש לך דברים יותר חשובים לעשות...",
        "או שאולי לא..., האם תרצה לשנות את דעתך?"
      ]
    },
    returnToNandPrompt: {
      size: "small",
      ariaLabel: "חזרה אל Nand",
      title: "היי, אתה כבר מכיר אותי. רוצה לשמוע עליי שוב?"
    },
    resetProgressPrompt: {
      size: "small",
      ariaLabel: "איפוס התקדמות",
      title: "לאפס את כל ההתקדמות?",
      paragraphs: [
        "פעולה זו תמחק את מצב הלומדה, כולל המשימות שכבר השלמת. האם לאשר?"
      ]
    }
  };

  const ROUTING_TASK_DEFS = [
    {
      id: "Mux",
      label: "Mux",
      inputs: 3,
      // The control input is input #3 (drawn on top of the card); inputs #1/#2
      // are the data inputs on the left. output = control ? input2 : input1.
      controlInputIndex: 2,
      description: "ה-Mux הוא כרטיס עם 3 כניסות ויציאה אחת. אחת הכניסות נמצאת למעלה. היא כניסת הבקרה. היא קובעת איזו מהכניסות \"עוברת\" ליציאה. אם היא 0 אז היציאה צריכה להיות זהה לכניסה הראשונה, ואם היא 1 אז היציאה צריכה להיות זהה לכניסה השנייה. שים לב, כניסת הבקרה היא כניסה לכל דבר. מבחינת הכרטיס אין שום הבדל בינה לשאר הכניסות. אבל כשאנחנו חושבים על פעולת הכרטיס נוח לנו לחשוב עליה בנפרד, כאילו היא לא חלק מהכניסות הרגילות, והיא מגדירה לכרטיס מה לעשות. בפועל היא פשוט אחד הביטים שעליהם מתבצע החישוב שהכרטיס עושה.",
      // inputs are [input1, input2, control]; output = control ? input2 : input1.
      // Rows are ordered control-major (control, input1, input2 = 000..111) so a
      // row's index matches its position in the scratch truth table.
      rows: [
        { inputs: [false, false, false], output: false },
        { inputs: [false, true, false], output: false },
        { inputs: [true, false, false], output: true },
        { inputs: [true, true, false], output: true },
        { inputs: [false, false, true], output: false },
        { inputs: [false, true, true], output: true },
        { inputs: [true, false, true], output: false },
        { inputs: [true, true, true], output: true }
      ]
    },
    {
      id: "DMux",
      label: "DMux",
      inputs: 2,
      // inputs are [data, control]; the control (input #2) is drawn on top.
      controlInputIndex: 1,
      outputs: 2,
      description: "ה-DMux הוא כרטיס עם כניסה אחת, כניסת בקרה, ושתי יציאות. הוא ההפך מ-Mux: במקום לבחור איזו כניסה עוברת ליציאה, הוא בוחר לאיזו יציאה עוברת הכניסה. כניסת הבקרה קובעת את הבחירה: אם הבקרה 0, הכניסה עוברת ליציאה הראשונה (והשנייה 0); אם הבקרה 1, הכניסה עוברת ליציאה השנייה (והראשונה 0).",
      // Rows are ordered control-major ([data, control] = 00,10,01,11) so a row's
      // index matches its position in the scratch truth table. Each row has two
      // outputs [out1, out2].
      rows: [
        { inputs: [false, false], outputs: [false, false] },
        { inputs: [true, false], outputs: [true, false] },
        { inputs: [false, true], outputs: [false, false] },
        { inputs: [true, true], outputs: [false, true] }
      ]
    }
  ];

  // Chapter 2.4 bus tasks — the note's task list. Each card operates on buses
  // instead of single bits. `width` is the bus width; `op` is the per-bit
  // operation applied componentwise; `inputs` is the number of bus inputs.
  // `requires` is the task that must be completed before this one unlocks
  // (null = available from the start). Unlock graph: Not4 opens
  // Not16/AND4/OR4/MUX4; AND4 opens AND16; MUX4 opens MUX16.
  const BUS_TASK_DEFS = [
    { id: "Not4",  label: "Not4",  op: "Not", width: 4,  inputs: 1, requires: null, description: "ה-Not4 הוא כרטיס עם כניסה אחת שהיא בס ברוחב 4, ויציאה אחת שהיא בס ברוחב 4. כל אחד מ-4 הרכיבים של היציאה מתקבל מהפעלת Not על הרכיב המתאים בכניסה." },
    { id: "Not16", label: "Not16", op: "Not", width: 16, inputs: 1, requires: "Not4", description: "ה-Not16 הוא כרטיס עם כניסה אחת שהיא בס ברוחב 16, ויציאה אחת שהיא בס ברוחב 16. כל אחד מ-16 הרכיבים של היציאה מתקבל מהפעלת Not על הרכיב המתאים בכניסה." },
    { id: "AND4",  label: "And4",  op: "And", width: 4,  inputs: 2, requires: "Not4", description: "ה-And4 הוא כרטיס עם 2 כניסות שלכל אחת נכנס בס ברוחב 4, ויציאה אחת שהיא בס ברוחב 4. כל אחד מ-4 הרכיבים של היציאה מתקבל מהפעלת And על שני רכיבים מתאימים מהכניסות (אחד מכל כניסה)." },
    { id: "AND16", label: "And16", op: "And", width: 16, inputs: 2, requires: "AND4", description: "ה-And16 הוא כרטיס עם 2 כניסות שלכל אחת נכנס בס ברוחב 16, ויציאה אחת שהיא בס ברוחב 16. כל אחד מ-16 הרכיבים של היציאה מתקבל מהפעלת And על שני רכיבים מתאימים מהכניסות (אחד מכל כניסה)." },
    { id: "OR4",   label: "Or4",   op: "Or",  width: 4,  inputs: 2, requires: "AND4", description: "ה-Or4 הוא כרטיס עם 2 כניסות שלכל אחת נכנס בס ברוחב 4, ויציאה אחת שהיא בס ברוחב 4. כל אחד מ-4 הרכיבים של היציאה מתקבל מהפעלת Or על שני רכיבים מתאימים מהכניסות (אחד מכל כניסה)." },
    // Neq0 (≠0) checks whether a bus is DIFFERENT from 0. Unlike the others its
    // output is a SINGLE bit (1 iff at least one input bit is 1), not a width-N
    // bus — op "Neq0" is handled specially (OR of all bits) wherever the
    // componentwise model is used.
    { id: "Neq0_4",  label: "≠0_4",  op: "Neq0", width: 4,  inputs: 1, requires: "Not4", description: "ה-≠0_4 הוא כרטיס עם כניסה אחת שהיא בס ברוחב 4, ויציאה אחת שהיא כבל בודד. היציאה היא 1 אם הכניסה שונה מ-0 (כלומר לפחות אחד מ-4 הביטים דלוק), ואחרת היא 0." },
    { id: "Neq0_16", label: "≠0_16", op: "Neq0", width: 16, inputs: 1, requires: "Neq0_4", description: "ה-≠0_16 הוא כרטיס עם כניסה אחת שהיא בס ברוחב 16, ויציאה אחת שהיא כבל בודד. היציאה היא 1 אם הכניסה שונה מ-0 (כלומר לפחות אחד מ-16 הביטים דלוק). אפשר להיעזר ב-≠0_4 שכבר בנית." },
    { id: "MUX4",  label: "Mux4",  op: "Mux", width: 4,  inputs: 2, requires: "OR4", control: true, description: "ה-Mux4 הוא כרטיס עם 3 כניסות: אחת מהכניסות היא כניסת בקרה (מלמעלה) ושתי האחרות הן בס ברוחב 4. ויציאה אחת שהיא בס ברוחב 4. אם כניסת הבקרה היא 0 אז היציאה זהה לכניסה הראשונה. אם כניסת הבקרה היא 1 אז היציאה זהה לכניסה השנייה." },
    // MUX16 unlocks only after every other bus card is built (see busTaskUnlocked).
    { id: "MUX16", label: "Mux16", op: "Mux", width: 16, inputs: 2, requires: "MUX4", control: true, description: "ה-Mux16 הוא כרטיס עם 3 כניסות: אחת מהכניסות היא כניסת בקרה (מלמעלה) ושתי האחרות הן בס ברוחב 16. ויציאה אחת שהיא בס ברוחב 16. אם כניסת הבקרה היא 0 אז היציאה זהה לכניסה הראשונה. אם כניסת הבקרה היא 1 אז היציאה זהה לכניסה השנייה." }
  ];

  // Chapter 2.5 arithmetic worktable cards (panel119 note). Done in order:
  // halfAdder is available first, and each later card waits for its predecessor.
  // halfAdder/fullAdder are single-bit truth-table tasks with TWO outputs
  // (sum/carry), built like DMux; Add4/Add16 (multi-bit, no truth table) are not
  // implemented yet and stay a "המשך יבוא..." placeholder in the note.
  const ARITH_TASKS = [
    {
      id: "halfAdder",
      label: "halfAdder",
      requires: null,
      inputs: 2,
      outputs: 2,
      description: "ה-halfAdder הוא כרטיס עם 2 כניסות ו-2 יציאות (אחת נקראת sum ואחת carry): הכרטיס צריך לחבר את שתי הכניסות (כשחושבים עליהן כמו מספרים בין 0 ל-1) ולהוציא את התוצאה. ספרת האחדות של הסכום צריכה לצאת ב-sum ואת ספרת ה-2 צריך להוציא ב-carry. אם התוצאה היא חד-ספרתית אז ה-carry הוא 0.",
      // outputs are [sum, carry]; sum = Xor(in1,in2), carry = And(in1,in2).
      rows: [
        { inputs: [false, false], outputs: [false, false] },
        { inputs: [false, true], outputs: [true, false] },
        { inputs: [true, false], outputs: [true, false] },
        { inputs: [true, true], outputs: [false, true] }
      ]
    },
    {
      id: "fullAdder",
      label: "fullAdder",
      requires: "halfAdder",
      inputs: 3,
      outputs: 2,
      description: "ה-fullAdder הוא כרטיס עם 3 כניסות ו-2 יציאות (אחת נקראת sum ואחת carry): הכרטיס צריך לחבר את שלוש הכניסות (כשחושבים עליהן כמו מספרים בין 0 ל-1) ולהוציא את התוצאה. ספרת האחדות של הסכום צריכה לצאת ב-sum ואת ספרת ה-2 צריך להוציא ב-carry. אם התוצאה היא חד-ספרתית אז ה-carry הוא 0. שים לב, סכום של 3 מספרים חד-ספרתיים לא יכול להיות יותר מדו-ספרתי. תנסה להבין למה.",
      // outputs are [sum, carry]; sum = in1^in2^in3, carry = majority(in1,in2,in3).
      rows: [
        { inputs: [false, false, false], outputs: [false, false] },
        { inputs: [false, false, true], outputs: [true, false] },
        { inputs: [false, true, false], outputs: [true, false] },
        { inputs: [false, true, true], outputs: [false, true] },
        { inputs: [true, false, false], outputs: [true, false] },
        { inputs: [true, false, true], outputs: [false, true] },
        { inputs: [true, true, false], outputs: [false, true] },
        { inputs: [true, true, true], outputs: [true, true] }
      ]
    },
    {
      id: "Add4",
      label: "Add4",
      requires: "fullAdder",
      inputs: 3,
      outputs: 2,
      busWidth: 4,
      requirements: "ה-Add4 הוא כרטיס עם 3 כניסות ו-2 יציאות. שתיים מהכניסות ואחת מהיציאות הן בסים ברוחב 4; הכניסה והיציאה הנוספות הן רגילות (ביט בודד). שתי הכניסות הרחבות מייצגות מספרים ברישום בינרי בן 4 ספרות (הביט התחתון הוא ספרת האחדות). הכניסה הנוספת מייצגת ביט בודד — הנשיאה מהפעם הקודמת. היציאה צריכה לייצג את הסכום שלהם: היציאה הרגילה היא הספרה המובילה של הסכום (שהיא למעשה הנשיאה האחרונה), והיציאה הרחבה היא שאר 4 הספרות.\n\nהערה: כשמפצלים בס שמייצג מספר אז ביט האחדות שלו הוא למטה והביט הכי משמעותי שלו הוא למעלה."
    },
    {
      id: "Add16",
      label: "Add16",
      requires: "Add4",
      inputs: 2,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-Add16 הוא כרטיס עם 2 כניסות ויציאה אחת: כל הכניסות והיציאה הן בסים ברוחב 16. שתי הכניסות מייצגות מספרים ברישום בינרי (16 ספרות; הביט האחרון הוא ספרת האחדות). היציאה צריכה לייצג את הסכום שלהם. אם הסכום יוצא בן 17 ספרות, מתעלמים מהספרה השמאלית ביותר (ה-carry האחרון).\n\nהערה: כשמפצלים בס שמייצג מספר אז ביט האחדות שלו הוא למטה והביט הכי משמעותי שלו הוא למעלה."
    }
  ];

  // ALU_TASKS — the chapter 2.6 (ALU) worktable note. Six cards built toward the
  // arithmetic-logic unit. `requires` is a LIST of prerequisites (all must be
  // completed before the card unlocks): Inc / ALU0 / PreperNum are available
  // immediately; ALU1 needs both ALU0 and PreperNum; ALU2 needs ALU1; ALU3 needs
  // ALU2. None have a build workspace yet — they open a "המשך יבוא..." notice.
  const ALU_TASKS = [
    {
      id: "ALU0",
      label: "ALU0",
      requires: [],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-ALU0 הוא כרטיס עם 3 כניסות ויציאה אחת. שתיים מהכניסות והיציאה הן בסים ברוחב 16, הכניסה השלישית היא כבל רגיל והיא כניסת בקרה (מלמעלה). הכרטיס צריך לבצע פעולה על 2 הכניסות שאינן כניסת הבקרה ולהוציא את התשובה. הפעולה נקבעת לפי כניסת הבקרה: אם היא 0 אז הפעולה היא AND (זאת אומרת לבצע AND לכל זוג ביטים בנפרד), אם היא 1 אז הפעולה היא חיבור (כרגיל מתעלמים מהספרה המובילה אם היא חורגת)."
    },
    {
      id: "PreperNum",
      label: "PreperNum",
      requires: [],
      inputs: 2,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-PreperNum הוא כרטיס עם 2 כניסות ויציאה אחת. אחת הכניסות (למעלה) היא כניסת בקרה והיא בס ברוחב 2, הכניסה האחרת היא בס ברוחב 16 והיציאה היא בס ברוחב 16. הכרטיס צריך לבצע פעולה על הכניסה שאינה כניסת הבקרה ולהוציא את התשובה. הפעולה נקבעת לפי כניסת הבקרה, ומתבצעת בשני שלבים:\n\n1. בשלב הראשון מחליפים את הכניסה בבס של אפסים אם ביט הבקרה השני הוא 1, ולא עושים דבר אם הוא 0.\n\n2. בשלב השני מתבצע NOT על התוצאה של השלב הראשון אם ביט הבקרה הראשון הוא 1, ולא קורה כלום אם הוא 0. (לבצע NOT אומר לבצע אותו על כל ביט בנפרד).\n\nלאחר שני השלבים התוצאה יוצאת מהכרטיס.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      id: "ALU1",
      label: "ALU1",
      requires: ["ALU0", "PreperNum"],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-ALU1 הוא כרטיס עם 3 כניסות ויציאה אחת. שתיים מהכניסות והיציאה הן בסים ברוחב 16, הכניסה השלישית היא בס ברוחב 6 והיא כניסת בקרה (מלמעלה).\n\nהכרטיס צריך לבצע פעולה על 2 הכניסות שאינן כניסת הבקרה ולהוציא את התשובה. הפעולה נקבעת לפי כניסת הבקרה:\n\nשני הביטים האחרונים של כניסת הבקרה קובעים איזו הכנה אנחנו עושים לכניסה הראשונה (ההכנה מתבצעת לפי ההוראות של PreperNum). שני הביטים שלפניהם קובעים איזו הכנה אנחנו עושים לכניסה השנייה. הביט השני קובע איזו פעולה אנחנו עושים על תוצאות שתי ההכנות (כמו ב-ALU0). הביט הראשון קובע האם מוציאים את התוצאה כמו שהיא או מבצעים עליה NOT לפני כן (אם הוא 1 — מבצעים NOT).\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      id: "ALU2",
      label: "ALU2",
      requires: ["ALU1"],
      inputs: 4,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-ALU2 הוא כרטיס עם 4 כניסות ויציאה אחת. שלוש מהכניסות והיציאה הן בסים ברוחב 16, הכניסה הרביעית היא בס ברוחב 7 והיא כניסת בקרה (מלמעלה).\n\nהכרטיס מבצע את הפעולה של ה-ALU1 על שתיים מהכניסות שלו. אם ביט הבקרה הראשון הוא 0 אז הוא מבצע את הפעולה על הכניסה הראשונה והשנייה. אם ביט הבקרה הראשון הוא 1 אז הוא מבצע את הפעולה על הכניסה הראשונה והשלישית. הוא משתמש ביתר ביטי הבקרה כדי להגדיר את הפעולה שהוא מבצע, כמו ב-ALU1.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      id: "ALU3",
      label: "ALU3",
      requires: ["ALU2"],
      inputs: 4,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-ALU3 הוא כרטיס עם 4 כניסות ויציאה אחת. שלוש מהכניסות והיציאה הן בסים ברוחב 16, הכניסה הרביעית היא בס ברוחב 12 והיא כניסת בקרה (מלמעלה).\n\nאם הביט הראשון של כניסת הבקרה הוא 0 אז היציאה צריכה להיות זהה לכניסת הבקרה, בתוספת 4 אפסים שיהוו את ארבעת הביטים הראשונים של היציאה. אחרת, הפעולה זהה לזו של ה-ALU2, כאשר מתייחסים רק ל-7 הביטים האחרונים בכניסת הבקרה.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      id: "ALU4",
      label: "ALU4",
      requires: ["ALU3"],
      inputs: 4,
      outputs: 3,
      busWidth: 16,
      requirements: "ה-ALU4 הוא כרטיס עם 4 כניסות ו-3 יציאות. הוא זהה בפעולתו ל-ALU3, אבל בנוסף מוציא עוד 2 יציאות למטה: האחת (ng) זהה לביט הראשון בבס היציאה של ה-ALU3, והשנייה (zr) היא ביט שהוא 1 אם כל היציאה של ה-ALU3 היא 0, ו-0 אחרת.\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
    },
    {
      // Inc is listed LAST but stays available from the very start (requires: [])
      // -- no other task depends on it, so its position is display-only.
      id: "Inc",
      label: "Inc",
      requires: [],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-Inc הוא כרטיס עם כניסה אחת ויציאה אחת. הכניסה והיציאה הן בסים ברוחב 16. הכרטיס צריך להוסיף 1 לכניסה ולהוציא את התוצאה."
    }
  ];

  const TASK_HINTS = {
    Not: [
      { kind: "text", title: "רמז 1", text: "נסה להשתמש ב־Nand." },
      { kind: "interactive", title: "רמז 2", action: "place-nand" },
      { kind: "text", title: "רמז 3", text: "אתה יכול לחבר את הכניסה של ה־Not לשתי רגלי ה־Nand." },
      { kind: "interactive", title: "רמז 4", action: "connect-not-input-to-nand" }
    ],
    And: [
      { kind: "text", title: "רמז 1", text: "חשוב על הקשר בין And ל־Nand." },
      { kind: "text", title: "רמז 2", text: "אם Nand נותן תשובה הפוכה מ־And, אז גם And נותן תשובה הפוכה מ־Nand." },
      { kind: "text", title: "רמז 3", text: "אתה יכול קודם לבצע Nand על שתי הכניסות ואז לראות איך אתה מטפל בתוצאה." },
      { kind: "interactive", title: "רמז 4", action: "and-place-first-nand" },
      { kind: "interactive", title: "רמז 5", action: "and-place-first-nand-explained", text: "זה נותן תוצאה הפוכה ממה שאתה צריך, עכשיו נותר רק להפוך אותה.", openAfterApply: true }
    ],
    Or: [
      { kind: "text", title: "רמז 1", text: "חשוב על הקשר בין Or ל־Nand או ל־And." },
      { kind: "text", title: "רמז 2", text: "כיוון מחשבה 1: Or מוציא 0 רק במקרה אחד. גם Nand מוציא 0 רק במקרה אחד. אולי תשתמש ב־Nand כדי לבנות את Or.\n\nכיוון מחשבה 2: להגיד שאחד משני דברים קורה זה כמו להגיד שזה לא נכון שאף אחד מהם לא קורה." },
      { kind: "text", title: "רמז 3", text: "כיוון מחשבה 1: חשוב מתי ה־Nand מוציא 0 ומתי ה־Or מוציא 0. מה הקשר בין המקרים?" },
      { kind: "text", title: "רמז 4", text: "כיוון מחשבה 1: מה צריך להכניס ל־Nand כדי שהוא ייתן את התוצאה שה־Or צריך לתת?" },
      { kind: "text", title: "רמז 5", text: "אולי יהיה לך יותר נוח אם תבצע Not לכל אחת מהכניסות. ככה תוכל לבדוק מתי שתיהן 0." },
      { kind: "interactive", title: "רמז 6", action: "or-connect-inputs-to-not" }
    ],
    Xor: [
      { kind: "text", title: "רמז 1", text: "כיוון מחשבה 1: אתה כבר יודע לדאוג לכך שהכרטיס יוציא 1 רק כאשר לפחות אחת מהכניסות היא 1. ואתה יודע איך לבנות כרטיס שבודק שלא שתי הכניסות הן 1. נסה לשלב את הדברים.\n\nכיוון מחשבה 2: נסה להבין מתי Xor צריך לתת 1 ולבנות כרטיס שמטפל בכל אחד מהמקרים האלה בנפרד. בסוף אתה צריך להוציא 1 כאשר אחד מהמקרים מתקיים." },
      { kind: "interactive", title: "רמז 2", action: "xor-slides" }
    ],
    AND3way: [
      { kind: "text", title: "רמז 1", text: "נסה להשתמש ב־And." },
      { kind: "text", title: "רמז 2", text: "אתה יכול לבדוק האם שתי הכניסות הראשונות הן 1 על ידי And." },
      { kind: "text", title: "רמז 3", text: "אתה צריך ששתי הכניסות הראשונות יהיו 1 וגם הכניסה השלישית תהיה 1." }
    ],
    OR4way: [
      { kind: "text", title: "רמז 1", text: "עשית כבר את And3Way. זה ממש דומה, רק עם Or במקום And ו־4 במקום 3." }
    ],
    DMux: [
      { kind: "text", title: "רמז 1", text: "לכרטיס הזה יש 2 יציאות, זה משהו שעוד לא ראית קודם. אבל למעשה אתה יכול לטפל בכל יציאה בנפרד כאילו מדובר בשני כרטיסים שונים." },
      { kind: "text", title: "רמז 2", text: "רוצה להכין לכרטיס טבלת אמת? שים לב, יש בטבלה 2 עמודות ליציאה, אחת לכל יציאה. אבל עדיין יש רק 4 שורות, כי יש 4 אפשרויות בכניסה." },
      { kind: "interactive", title: "רמז 3", action: "dmux-fill-inputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עזרה בהכנת טבלת האמת? (אם תלחץ על כן זה ימחק את כל מה שכתבת בטבלה)." },
      { kind: "interactive", title: "רמז 4", action: "dmux-fill-outputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עוד עזרה עם טבלת האמת?" }
    ],
    Not4: [
      { kind: "text", title: "רמז 1", text: "תפצל את הכניסה ל-4 כבלים נפרדים, תפעיל את ה-Notים הנדרשים ותצרף את הכניסות חזרה ע\"י מפצל נוסף." },
      { kind: "interactive", title: "רמז 2", action: "not4-split-input" },
      { kind: "interactive", title: "רמז 3", action: "not4-split-and-not" }
    ],
    Not16: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-Not4." },
      { kind: "text", title: "רמז 2", text: "אתה יכול לפצל את הכניסה ל-4 בסים ברוחב 4 כל אחד. אחר כך זה ממש דומה ל-Not4 רק שאתה משתמש ב-Not4 במקום ב-Not." },
      { kind: "interactive", title: "רמז 3", action: "not16-split-input" },
      { kind: "interactive", title: "רמז 4", action: "not16-split-and-not" }
    ],
    AND4: [
      { kind: "text", title: "רמז 1", text: "זה דומה ל-Not4 רק שצריך להשתמש ב-And במקום ב-Not." },
      { kind: "text", title: "רמז 2", text: "שים לב, ל-And יש שתי כניסות, אז צריך לחבר כל פעם שני כבלים מתאימים." },
      { kind: "text", title: "רמז 3", text: "תפצל את הכניסות ל-4 כבלים נפרדים, תפעיל את ה-Andים הנדרשים ותצרף את הכניסות חזרה ע\"י מפצל נוסף." },
      { kind: "interactive", title: "רמז 4", action: "and4-split-one" },
      { kind: "interactive", title: "רמז 5", action: "and4-split-both" },
      { kind: "interactive", title: "רמז 6", action: "and4-split-both-and" }
    ],
    AND16: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-And4." },
      { kind: "text", title: "רמז 2", text: "אתה יכול לפצל כל אחת מהכניסות ל-4 בסים ברוחב 4 כל אחד. אחר כך זה ממש דומה ל-And4 רק שאתה משתמש ב-And4 במקום ב-And." },
      { kind: "interactive", title: "רמז 3", action: "and16-split-one" },
      { kind: "interactive", title: "רמז 4", action: "and16-split-both" },
      { kind: "interactive", title: "רמז 5", action: "and16-split-both-and" }
    ],
    OR4: [
      { kind: "text", title: "רמז 1", text: "זה דומה ל-And4 רק שצריך להשתמש ב-Or במקום ב-And." },
      { kind: "text", title: "רמז 2", text: "שים לב, ל-Or יש שתי כניסות, אז צריך לחבר כל פעם שני כבלים מתאימים." },
      { kind: "text", title: "רמז 3", text: "תפצל את הכניסות ל-4 כבלים נפרדים, תפעיל את ה-Orים הנדרשים ותצרף את הכניסות חזרה ע\"י מפצל נוסף." },
      { kind: "interactive", title: "רמז 4", action: "or4-split-one" },
      { kind: "interactive", title: "רמז 5", action: "or4-split-both" },
      { kind: "interactive", title: "רמז 6", action: "or4-split-both-and" }
    ],
    Neq0_4: [
      { kind: "text", title: "רמז 1", text: "היציאה צריכה להיות 1 אם לפחות ביט אחד דלוק. האם בנית כרטיס שעושה משהו דומה בעבר?" },
      { kind: "text", title: "רמז 2", text: "אם עושים OR לכל הביטים, מקבלים 1 בדיוק כשלפחות אחד מהם דלוק — כלומר בדיוק כשהבס שונה מ-0." },
      { kind: "text", title: "רמז 3", text: "פצל את הבס ל-4 כבלים בודדים. זה יכול לעזור לך להשתמש ב-OR" },
      { kind: "interactive", title: "רמז 4", action: "neq0_4-split-input", text: "לפצל את הבס ל-4 כבלים בודדים." },
      { kind: "text", title: "רמז 5", text: "אתה יכול להשתמש ב-Or4way" }
    ],
    Neq0_16: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-≠0_4 שכבר בנית." },
      { kind: "text", title: "רמז 2", text: "פצל את הכניסה ל-4 בסים ברוחב 4, כך תוכל להשתמש ב-≠0_4" },
      { kind: "interactive", title: "רמז 3", action: "neq0_16-split-input", text: "לפצל את הכניסה ל-4 בסים ברוחב 4" },
      { kind: "text", title: "רמז 4", text: "אתה יכול להשתמש ב-≠0_4 על כל אחת מהיציאות של המפצל." },
      { kind: "interactive", title: "רמז 5", action: "neq0_16-split-and-neq0", text: "הפעל ≠0_4 על כל אחת מהיציאות של המפצל" },
      { kind: "text", title: "רמז 6", text: "כל אחת מהיציאות של ה-≠0_4 בודקת האם רבע מהבס שונה מ-0. מה אתה צריך לבדוק על היציאות האלה?" },
      { kind: "text", title: "רמז 7", text: "היציאה של כל הכרטיס צריכה להיות 1 אם לפחות אחת מהיציאות שקיבלת היא 1. איך אתה יכול לבדוק את זה?" }
    ],
    MUX4: [
      { kind: "text", title: "רמז 1", text: "זה דומה ל-And4 רק שצריך להשתמש ב-Mux במקום ב-And." },
      { kind: "text", title: "רמז 2", text: "שים לב, כניסת הבקרה בוחרת בין שתי האפשרויות, לכן אתה צריך להשתמש בה בכל אחד מ-Mux-ים." }
    ],
    MUX16: [
      { kind: "text", title: "רמז 1", text: "זה בדיוק כמו Mux4 רק שצריך להשתמש ב-Mux4 במקום ב-Mux." }
    ],
    Mux: [
      { kind: "text", title: "רמז 1", text: "זכור שמדובר בחישוב, הבן באילו אפשרויות יוצא 1 וטפל בהן." },
      { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש בשיטה שג'ון סיפר לך. אם זאת, אפשר קצת לפשט אותה במקרה זה." },
      { kind: "text", title: "רמז 3", text: "נסה להכין טבלת אמת. יש סה\"כ שלוש כניסות, לכן יש 8 אפשרויות (4 אם כניסת הבקרה היא 0 ועוד 4 אם כניסת הבקרה היא 1). נסה לרשום את כולן, ומכל אחת מהן לרשום מה היציאה." },
      { kind: "interactive", title: "רמז 4", action: "mux-fill-inputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עזרה בהכנת טבלת האמת? (אם תלחץ על כן זה ימחק את כל מה שכתבת בטבלה)." },
      { kind: "interactive", title: "רמז 5", action: "mux-fill-outputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עוד עזרה עם טבלת האמת?" }
    ],
    Dmux4way: [
      { kind: "text", title: "רמז 1", text: "תתחיל מלפצל את בס הבקרה לשני הביטים שלו." },
      { kind: "text", title: "רמז 2", text: "הביט הראשון של כניסת הבקרה בוחר לאיזה זוג יציאות צריך \"לחבר\" את הכניסה." },
      { kind: "text", title: "רמז 3", text: "תנסה להשתמש ב-DMux כדי לשלוח את הכניסה לכיוון זוג היציאות שמתוך אחת מהן היא תצטרך לצאת. תחשוב באיזה ביט בקרה אתה משתמש בשביל זה." },
      { kind: "interactive", title: "רמז 4", action: "dmux4way-connect-first-dmux", text: "מחברים את ה-DMux הראשון." },
      { kind: "text", title: "רמז 5", text: "נניח שה-DMux בחר בזוג הראשון. איך מחליטים לאן לשלוח את הכניסה? אולי תשתמש בעוד DMux?" }
    ],
    halfAdder: [
      { kind: "text", title: "רמז 1", text: "תחשוב על כל ספרה בנפרד." },
      { kind: "text", title: "רמז 2", text: "תנסה להרכיב טבלת אמת." },
      { kind: "text", title: "רמז 3", text: "בשביל לכתוב טבלת אמת אפשר לעבור על כל ארבעת האפשרויות ולכתוב את התוצאה בשיטה הבינרית." },
      { kind: "interactive", title: "רמז 4", action: "arith-fill-inputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עזרה בהכנת טבלת האמת? (אם תלחץ על כן זה ימחק את כל מה שכתבת בטבלה)." },
      { kind: "interactive", title: "רמז 5", action: "arith-fill-outputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עוד עזרה עם טבלת האמת? (אם תלחץ על כן זה ימחק את כל מה שכתבת בטבלה)." },
      { kind: "text", title: "רמז 6", text: "שים לב, לכל אחת מהיציאות יש טבלת אמת שכבר ראית פעם." },
      { kind: "text", title: "רמז 7", text: "ה-sum הוא XOR." },
      { kind: "text", title: "רמז 8", text: "ה-carry הוא And." }
    ],
    fullAdder: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-halfAdder." },
      { kind: "text", title: "רמז 2", text: "בשביל לחבר שלושה מספרים אפשר לחבר קודם את השניים הראשונים ואז לחבר את השלישי לתוצאה." },
      { kind: "text", title: "רמז 3", text: "אתה יכול לחבר את השניים הראשונים עם halfAdder. שים לב, התוצאה היא דו-ספרתית." },
      { kind: "interactive", title: "רמז 4", action: "fulladder-ha1", confirmBeforeApply: true, applyLabel: "כן", text: "אניח בשבילך את ה-halfAdder הראשון ואחבר אליו את שתי הכניסות הראשונות. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 5", text: "כדי לחבר את השלישי לתוצאה אתה יכול לחבר אותו לספרת האחדות." },
      { kind: "interactive", title: "רמז 6", action: "fulladder-ha2", confirmBeforeApply: true, applyLabel: "כן", text: "אניח את ה-halfAdder השני ואחבר אליו את ספרת האחדות של הסכום הקודם ואת הכניסה השלישית. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 7", text: "עכשיו אתה יודע כבר את ספרת האחדות של הסכום של כל השלושה." },
      { kind: "interactive", title: "רמז 8", action: "fulladder-sum", confirmBeforeApply: true, applyLabel: "כן", text: "אחבר את היציאה sum של ה-halfAdder השני ליציאת ה-sum של הכרטיס. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 9", text: "עכשיו יש שני דברים שתורמים לספרת ה-2. תנסה לאתר אותם." },
      { kind: "interactive", title: "רמז 10", action: "fulladder-carries", confirmBeforeApply: true, applyLabel: "כן", text: "שני התורמים לספרת ה-2 הם היציאה carry של ה-halfAdder הראשון והיציאה carry של ה-halfAdder השני. אחזיר את המעגל למצב שבו רואים אותם. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 11", text: "מה לדעתך צריך לעשות להם?" },
      { kind: "interactive", title: "רמז 12", action: "fulladder-ha3", confirmBeforeApply: true, applyLabel: "כן", text: "אניח halfAdder שמחבר את שתי היציאות carry. ה-sum שלו הוא ספרת ה-2 של התוצאה — נותר לך רק לחבר אותו ליציאת ה-carry של הכרטיס. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 13", text: "שים לב, קיבלנו 2 ספרות, אבל התוצאה צריכה להיות ספרת ה-2 של הסכום של שלושת המספרים, ולכן היא צריכה להיות חד-ספרתית — אחרת הסכום המקורי היה תלת-ספרתי. הספרה הנוספת (ספרת ה-4) תמיד 0, ולכן מתעלמים ממנה." }
    ],
    Add4: [
      { kind: "text", title: "רמז 1", text: "תחבר את המספרים כמו שעשית בתרגילי החיבור בטור." },
      { kind: "text", title: "רמז 2", text: "תתחיל מלפצל את הכניסות לכל הספרות שלהן." },
      { kind: "text", title: "רמז 3", text: "אתה יכול לחבר את ספרות האחדות אחת לשנייה בעזרת fullAdder. אל תשכח את הכניסה הנוספת (הנשיאה הקודמת)." },
      { kind: "interactive", title: "רמז 4", action: "add4-units", confirmBeforeApply: true, applyLabel: "כן", text: "אדגים בשבילך: אפצל את שני המספרים לספרות, ואחבר את שתי ספרות האחדות יחד עם הנשיאה הנכנסת בעזרת fullAdder. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 5", text: "כמו בחיבור בטור, ספרת האחדות של הסכום היא כבר ספרת האחדות של התוצאה. את ספרת ה-2 (הנשיאה) אתה צריך לשמור בשביל הפעולה הבאה." },
      { kind: "interactive", title: "רמז 6", action: "add4-units-out", confirmBeforeApply: true, applyLabel: "כן", text: "אוציא את ספרת האחדות של הסכום ליציאה: אחבר את יציאת ה-sum של ה-fullAdder לספרת האחדות של בס הסכום (דרך מאחד). (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 7", text: "עכשיו אתה צריך לחשב את הספרה הבאה. חבר את שתי הספרות הבאות של המספרים, אבל אל תשכח להוסיף עליהן את הנשיאה מהפעולה הקודמת — שוב בעזרת fullAdder." },
      { kind: "interactive", title: "רמז 8", action: "add4-next-digit", confirmBeforeApply: true, applyLabel: "כן", text: "אבצע את החיבור של הספרה הבאה: fullAdder שמחבר את שתי הספרות הבאות עם הנשיאה מהקודם, ואוציא את ה-sum שלו לספרה הבאה של בס הסכום. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 9", text: "מכאן ממשיכים הלאה באותו אופן עד הספרה האחרונה. הנשיאה האחרונה היא הספרה המובילה של הסכום." }
    ],
    Add16: [
      { kind: "text", title: "רמז 1", text: "תחבר את המספרים כמו בחיבור בטור — רק שהפעם כל \"ספרה\" היא בעצם קבוצה של 4 ביטים." },
      { kind: "text", title: "רמז 2", text: "תתחיל מלפצל כל אחד משני המספרים לארבע קבוצות של 4 ביטים." },
      { kind: "text", title: "רמז 3", text: "אתה יכול לחבר את שתי קבוצות האחדות (התחתונות) בעזרת Add4 — הכרטיס שכבר בנית. שים לב: אין נשיאה נכנסת, אז את כניסת הנשיאה של ה-Add4 הזה משאירים לא מחוברת." },
      { kind: "interactive", title: "רמז 4", action: "add16-units", confirmBeforeApply: true, applyLabel: "כן", text: "אדגים בשבילך: אפצל את שני המספרים לקבוצות של 4 ביטים, ואחבר את שתי קבוצות האחדות בעזרת Add4 (בלי נשיאה נכנסת). (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 5", text: "יציאת הסכום של ה-Add4 הזה היא קבוצת האחדות של התוצאה. את יציאת הנשיאה שלו צריך לשמור בשביל הקבוצה הבאה." },
      { kind: "interactive", title: "רמז 6", action: "add16-units-out", confirmBeforeApply: true, applyLabel: "כן", text: "אוציא את קבוצת האחדות של הסכום ליציאה: אחבר את יציאת הסכום של ה-Add4 לקבוצה התחתונה של בס הסכום (דרך מאחד). (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 7", text: "עכשיו הקבוצה הבאה: חבר את שתי הקבוצות הבאות יחד עם הנשיאה מהקודם, שוב בעזרת Add4." },
      { kind: "interactive", title: "רמז 8", action: "add16-next-chunk", confirmBeforeApply: true, applyLabel: "כן", text: "אבצע את החיבור של הקבוצה הבאה: Add4 שמחבר את שתי הקבוצות הבאות עם הנשיאה מהקודם, ואוציא את הסכום שלו לקבוצה הבאה של בס הסכום. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
      { kind: "text", title: "רמז 9", text: "ממשיכים כך קבוצה-קבוצה עד הקבוצה העליונה. הנשיאה האחרונה — הספרה ה-17 — לא נכנסת לתוצאה, אז משאירים אותה לא מחוברת." }
    ],
    Inc: [
      { kind: "text", title: "רמז 1", text: "אם אתה רוצה ליצור כבל שיש בו 1 אתה יכול פשוט לחבר אותו למקור מתח. אם אתה לא מחבר כניסה מסוימת לשום דבר, אז היא מקבלת 0 (כי היא לא מקבלת מתח)." },
      { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש ב-Add16." },
      { kind: "text", title: "רמז 3", text: "אתה יודע איך כותבים את המספר 1 בשיטה הבינרית. הוא אומנם חד ספרתי אבל אתה יכול לכתוב אותו גם כ-16 ספרתי, פשוט תכתוב 0 בספרות שלא מופיעות." },
      { kind: "text", title: "רמז 4", text: "אתה יכול להשתמש במפצל כדי לאגד כבלים לתוך בס." },
      { kind: "interactive", title: "רמז 5", action: "inc-build-one", confirmBeforeApply: true, applyLabel: "כן", text: "אדגים בשבילך איך יוצרים בס ברוחב 16 שמייצג את המספר 1 — באמצעות מפצל־מיזוג בעל שתי רגליים לא־שוות: הרגל התחתונה ברוחב ביט אחד ומחוברת למקור מתח, והרגל העליונה ברוחב 15 ביט ונשארת לא מחוברת (0). כך הצד המאוחד הוא בס ברוחב 16 שמייצג בדיוק 0001. (שים לב: זה ימחק את מה שבנית עד עכשיו)." }
    ],
    ALU0: [
      { kind: "text", title: "רמז 1", text: "תבצע את שתי הפעולות בנפרד, ואז \"תחליט\" איזה מהן אתה מוציא. אתה יכול להשתמש ב-Add16." },
      { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש ב-MUX16 כדי \"להחליט\"." }
    ],
    PreperNum: [
      { kind: "text", title: "רמז 1", text: "תפצל את כניסת הבקרה לביטים שמהם היא מורכבת." },
      { kind: "text", title: "רמז 2", text: "כדי ליצור בס של אפסים לא צריך לעשות כלום. כניסה שלא מחוברת היא 0." },
      { kind: "text", title: "רמז 3", text: "בכל אחד מהשלבים אתה יכול לבצע את שתי האפשרויות ולבחור ביניהן בעזרת MUX16." }
    ],
    ALU1: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-PreperNum וב-ALU0." },
      { kind: "text", title: "רמז 2", text: "תתחיל מלפצל את כניסת הבקרה ל-3 חלקים. את החלק האחרון אתה יכול לפצל ל-2." },
      { kind: "text", title: "רמז 3", text: "כעת אתה יכול לבצע PreperNum לכל אחת מהכניסות (לא הבקרה) עם החלק המתאים של כניסת הבקרה." },
      { kind: "text", title: "רמז 4", text: "את התוצאה אתה יכול להכניס ל-ALU0 עם החלק המתאים של כניסת הבקרה." },
      { kind: "text", title: "רמז 5", text: "בסוף אתה צריך לבצע NOT לפי הצורך. אתה יכול לעשות זאת עם PreperNum (פשוט לא להשתמש בכל הביטים של כניסת הבקרה שלו) או עם MUX16." }
    ],
    ALU2: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-ALU1." },
      { kind: "text", title: "רמז 2", text: "קודם כל תפצל את כניסת הבקרה ותרכיב ממנה את מה שאנחנו צריכים." },
      { kind: "text", title: "רמז 3", text: "אתה יודע מה צריכה להיות אחת מהכניסות של ה-ALU1 שאתה משתמש בו. תחבר אותה, ואז תחשוב מה צריכה להיות השנייה." },
      { kind: "text", title: "רמז 4", text: "כרגיל, כשיש 2 אפשרויות, אתה יכול לבחור ביניהן בעזרת MUX." },
      { kind: "text", title: "רמז 5", text: "ה-MUX שאתה צריך כאן הוא MUX16 (כי אתה בוחר בין 2 בסים ברוחב 16)." }
    ],
    ALU3: [
      { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-ALU2." },
      { kind: "text", title: "רמז 2", text: "קודם כל תפצל את כניסת הבקרה ותרכיב ממנה את מה שאנחנו צריכים." },
      { kind: "text", title: "רמז 3", text: "כרגיל, כשיש 2 אפשרויות, אתה מכין את שתיהן ומבצע MUX שבוחר ביניהן." },
      { kind: "text", title: "רמז 4", text: "ה-MUX שאתה צריך כאן הוא MUX16 (כי היציאה היא בס ברוחב 16)." }
    ],
    ALU4: [
      { kind: "text", title: "רמז 1", text: "השתמש ב-ALU3." },
      { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש ב-≠0." }
    ],
    Mux4way16: [
      { kind: "text", title: "רמז 1", text: "תתחיל מלפצל את בס הבקרה לשני הביטים שלו." },
      { kind: "text", title: "רמז 2", text: "הביט הראשון של כניסת הבקרה בוחר מאיזה זוג כניסות תבחר הכניסה אותה צריך \"לחבר\" ליציאה." },
      { kind: "text", title: "רמז 3", text: "תניחו שהביט הראשון של כניסת הבקרה הוא 0. תבנו רכיב שנותן את היציאה הנדרשת במקרה הזה. אל תחברו אותו בינתיים ליציאה." },
      { kind: "text", title: "רמז 4", text: "אתם מתקשים ליצור רכיב כזה? אתם יכולים להשתמש ב-Mux16." },
      { kind: "text", title: "רמז 5", text: "תניחו שהביט הראשון של כניסת הבקרה הוא 1. תבנו רכיב שנותן את היציאה הנדרשת במקרה הזה. אל תחברו אותו בינתיים ליציאה." },
      { kind: "text", title: "רמז 6", text: "קיבלתם 2 אפשרויות ליציאה, אבל רק אחת מהן נכונה. איך בוחרים ביניהן?" },
      { kind: "text", title: "רמז 7", text: "אתם יכולים להשתמש שוב ב-Mux16." }
    ]
  };

  // Player achievements, shown on the "השיגים" page. Each entry:
  //   { id, title, description, category: "progress" | "special" }
  // The page renders two category columns ("progress" / "special") with their
  // counts. Order within a category is the display order. Each id maps to a
  // unique colourful trophy icon (see renderAchievementIcon in app.js).
  // ACHIEVEMENTS (names + descriptions) moved to js/achievements-data.js so the
  // wording is editable in one dedicated file. Its unlock logic is in app.js and
  // its trophy icons are in js/achievement-icons.js.

  const EXPLANATION_ITEMS = [
    { id: "nand-intro", title: "הצגת ה־Nand" },
    { id: "nand-function", title: "איך Nand פועל" },
    { id: "build-nand", title: "איך עושים Nand" },
    { id: "bit-info", title: "מה זה ביט" },
    { id: "truth-table-cards", title: "הכנת כרטיסים מטבלת אמת" },
    { id: "why-route", title: "למה לנתב" },
    // The gate buttons in the menu (Not/And/Or, Mux/DMux) unlock once their
    // solution has been seen; each has an "unlock" id here so the shared
    // explanation-unlock machinery (and its animation) applies to them too.
    { id: "gate-Not", title: "Not" },
    { id: "gate-And", title: "And" },
    { id: "gate-Or", title: "Or" },
    { id: "gate-Mux", title: "Mux" },
    { id: "gate-DMux", title: "DMux" },
    // The חשבון buttons: each opens a sample exercise's solution. They unlock
    // once that exercise's solution has been seen.
    { id: "arith-dec-add", title: "חיבור עשרוני" },
    { id: "arith-bin2dec", title: "המרה מכתיב בינרי לכתיב עשרוני" },
    { id: "arith-dec2bin", title: "המרה מכתיב עשרוני לכתיב בינרי" },
    { id: "arith-binadd", title: "חיבור בינרי" },
    // Memory (chapter 3.1): the flip-flop goal narration, the MUX-latch demo, and
    // the "how a computer is clocked" enrichment videos.
    { id: "flipflop-what", title: "מה זה פליפ-פלופ" },
    { id: "flipflop-how", title: "איך עושים פליפ-פלופ" },
    { id: "clocking", title: "איך מתזמנים את הפעולה של המחשב" },
    // Chapter 3.3: von Neumann's closing monologue after the last RAM card —
    // what a thousand registers buy, where the name comes from, the punched tape
    // it replaced, and what it costs. Unlocked by reaching its first slide, which
    // only happens once RAM1024 is built.
    { id: "ram-story", title: "RAM" },
    // The ALU0 explanation (chapter 2.6): replays the ALU0 solution then the
    // "what is an ALU" message. Unlocked at the end of that message.
    { id: "alu-ALU0", title: "ALU" },
    // The subtraction demo (chapter 2.6): replays von Neumann's scripted 19−7
    // walkthrough. Unlocked once the demo has been seen (finished or skipped).
    { id: "subtraction-demo", title: "חיסור" },
    // Enrichment: the "negative numbers" window (the two explainer videos), reached
    // from the demo's red teaser. Unlocked once that window has been opened.
    { id: "negative-numbers", title: "מספרים שליליים" },
    // Enrichment (computer category): the "words & bytes" reading, opened either
    // from the red link on the last bits-range slide or from the explanations menu.
    { id: "words-bytes", title: "מילים ובתים" },
    // Chapter 4.1: von Neumann's walk through what the simple computer is made
    // of and how an instruction is laid out, ending with the worked examples.
    { id: "computer-structure", title: "מבנה המחשב הפשוט" },
    // Enrichment (software category): the assembler window, reached from the red
    // teaser beside the gnome on the 4.3 page.
    { id: "assembler", title: "אסמבלר" }
  ];

  // The "מילים ובתים" enrichment text, shown in a scrollable dialog.
  const WORDS_BYTES_PARAGRAPHS = [
    "אכן אפשר לכתוב מספרים מ-0 עד 65,535 עם 16 ביטים, אבל אי אפשר לכתוב כך מספרים שליליים. יש דרך מקובלת לכתוב מספרים שליליים באמצעות ביטים, אם תרצה יהיה על זה הסבר בהמשך. אבל מכיוון של-16 ביטים יש רק 65,536 אפשרויות, אם רוצים לכתוב מספרים שליליים צריך לוותר על חלק מהחיוביים. הדרך המקובלת מאפשרת לכתוב מספרים מ־32,768- ועד 32,767.",
    "אפשר לעבוד עם מספרים גדולים יותר גם אם כל הכרטיסים שלנו יודעים לבצע חישובים רק עם 16 ביטים. פשוט אפשר לחלק את המספר לחלקים ולבצע את החישובים עם כל חלק בנפרד. הסיבה לבחירה לעבוד עם 16 ביטים היא שהמספר 16 בעצמו הוא חזקה של 2. וזה הופך אותו ליותר נוח לעבודה, למרות שזה ממש לא הכרחי. החזקה הקודמת של 2 היא 8, ו-8 ביטים יתנו לנו רק 256 אפשרויות. זה ממש מעט, לא רק בשביל מספרים, אלא בשביל עוד דברים (כמו למשל הוראות שנרצה להעביר למחשב), לכן עברנו לחזקה הבאה שהיא 16.",
    "המחשב הראשון שבנה ג'ון פון-נוימן במציאות (בשנת 1952) עבד עם 40 ביטים. מחשבים מודרניים עובדים בדרך כלל עם 64 ביטים. אלה מחולקים ליחידות של 8 ביטים כל אחת. יחידות אלה מכונות בייט (בעברית בית). רצף הביטים שאיתם המחשב יודע לבצע פעולות נקרא מילה. כך שבמחשבים מודרניים מילה היא בדרך כלל 8 בייטים. המחשב גם מטפל ביחידות קטנות יותר. לדוגמה, הדרך המקובלת לשמור אות היא על ידי בייט אחד. למטרות שונות משתמשים במספרים בעלי מספר בייטים שונה. יש מספרים של 2 בייט, 4 בייט ו-8 בייט. אולם כמעט ולא משתמשים ביחידות שאינן מספר שלם של ביטים (למעט ברכיבים הכי בסיסיים בחומרה – הצ'יפים מהם בנוי המחשב).",
    "לכן, היחידה הבסיסית למדידת נפח אחסון מידע היא בייט. זאת יחידה מאוד קטנה. 1024 בייט נקראים קילו-בייט, 1024 קילו-בייט נקראים מגה-בייט (בערך מיליון בייט), 1024 מגה-בייט נקראים גיגה-בייט (או ג'יגה-בייט; בערך מיליארד בייט), 1024 גיגה-בייט נקראים טרה-בייט (בערך טריליון בייט; זה בערך נפח האחסון של מחשב מודרני), 1024 טרה-בייט נקראים פטה-בייט (בערך קוודריליון בייט), וכן הלאה. מחוץ לעולם המחשבים המילים קילו, מגה, גיגה, וכו' בעלות משמעות מעט שונה. הן אומרות אלף, מיליון, מיליארד וכו'. יצרני הרד-דיסקים (הרכיב במחשב ששומר מידע לטווח ארוך) לעיתים משתמשים במילים האלה כמו שמקובל מחוץ לעולם המחשבים כשהם מתארים את נפח ההרד-דיסק שלהם, כדי להציג אותו יותר גדול ממה שהוא באמת. בשנות ה-90 כאשר היצרנים התחרו מי יהיה הראשון שייצר הרד-דיסק ביתי בנפח גיגה-בייט, הם הכריזו שהרד-דיסק שלהם הוא כזה כשלמעשה היו בו רק מיליארד בייט (שזה בערך 7% פחות). גם היום לפעמים אומרים על הרד-דיסק שיש בו טרה-בייט כשלמעשה יש בו רק טריליון בייט (שזה בערך 9% פחות)."
  ];

  // Optional per-task "why the heck do we need this?" note, shown as a
  // collapsible panel at the bottom-left of the build board (renderWhyNote).
  // Only the tasks listed here get a panel.
  const TASK_WHY_NOTES = {
    Inc: `אתה בטח תוהה למה אנחנו צריכים את הכרטיס הזה, הרי ה-ALU שלנו יכול להוסיף 1 בקלות. אתה צודק, זה כמובן לא הכרחי. אבל הפעולה של הוספת 1 היא מאוד בסיסית, היא מאפשרת למחשב לספור, זה מאוד שימושי כשהוא צריך לעבור על הוראות שהוא מקבל אחת אחת, זה מאפשר לו "לדעת" בכל רגע איפה הוא "נמצא". לכן נוח לנו שיוקדש לזה כרטיס נפרד.`,
    PreperNum: `אנחנו רוצים שה-ALU יוכל לעשות הרבה פעולות. באופן עקרוני אפשר לממש כל אחת מהם ואז לבחור ביניהן עם מוקס אחד גדול. זה מייגע ומבזבז הרבה נאנדים. לכן אנחנו נבצע את הפעולות ב-3 שלבים. נפעיל פעולה פשוטה על כל אחת מהכניסות (בעזרת כרטיס זה), אז נבצע את פעולת ה-ALU0 ואז שוב נפעיל פעולה פשוטה על היציאה. זה ייתן לנו מגוון של פעולות, חלקן מיותרות חלקן זהות אחת לשנייה, אבל חלקן יהיו שימושיות מאוד.`,
    ALU2: `למה אנחנו צריכים ALU עם 3 כניסות? הרי אנחנו יודעים על מי אנחנו רוצים לבצע פעולה. הסיבה היא שבמחשב הכל מחובר באופן קבוע. לכן אם אנחנו רוצים לבצע פעולה על מספרים שונים ששמורים לנו במחשב אנחנו צריכים להיות מחוברים אל כמה אפשרויות, ולבחור ביניהם באמצעות MUX.`,
    ALU3: `זה בטח נראה לך מוזר שאנחנו צריכים אפשרות לגרום ל-ALU להוציא את המספר שאנחנו אומרים לו בכניסת הבקרה. הרי אם אנחנו יודעים איזה מספר הוא צריך להוציא, אז אנחנו לא צריכים ALU בשביל לחשב אותו. הסיבה היא שהכניסות הרגילות של ה-ALU יהיו מחוברות באופן קבוע לחלקים מסוימים במחשב, ולא תהיה לנו שליטה על מה שנכנס לשם, הדבר היחיד שאנו שולטים עליו באופן ישיר זה כניסת הבקרה של ה-ALU. לכן אם אנחנו רוצים להכניס מספר מסוים למחשב שלנו לצורך חישוב אנחנו נצטרך לעשות את זה דרך כניסת הבקרה.`,
    ALU4: `למה שנצטרך להוציא את שני הביטים האלו בנפרד? הרי אפשר לגלות אותם מהכניסה הראשית. נכון. זה לא הכרחי. אבל לשני הביטים האלה יהיה תפקיד נפרד במחשב שלנו. ולכן זה נוח שהם מופיעים בנפרד.`
  };

  const BIT_EXPLANATION_STEPS = [
    `שים לב, כל הכניסות, היציאות והכבלים שלנו יכולים להיות בשני מצבים: בלי מתח ועם מתח. דבר שיכול להיות בשני מצבים נקרא ביט. ביט הוא היחידה הבסיסית של מידע, וכל הטיפול במידע בעולם המחשבים עובד על ביטים. באופן עקרוני אפשר לבנות מכונות חישוב שלא מבוססות על חשמל אלא על תופעה אחרת, זרם מים למשל. במחשבים כאלה הביטים ייוצגו על ידי משהו שאינו מתח חשמלי, גובה או לחץ המים למשל. הבחירה במתח חשמלי התבררה כהכי יעילה והכי קלה לבנייה מעשית. פעם אפילו ניסו לבנות מחשבים שלא מבוססים על ביטים אלא על דברים שיכולים להיות ביותר מצבים; ספרה למשל יכולה להיות בעשרה מצבים. זה התברר כמסרבל ולא נוח. ביטים הרבה יותר פשוטים לתפעול, ובסופו של דבר, אם יש מספיק ביטים, אפשר לעבד כל מידע.

And ו־Not הם כרטיסים שמבצעים חישוב.`,
    `כל הכרטיסים שנבנה בזמן הקרוב יבצעו חישוב כלשהו. יהיה להם מספר כניסות ומספר יציאות, וגם אלה וגם אלה הן ביטים. היציאות תלויות בכניסות לפי חוקיות מסוימת. את החוקיות אפשר לתאר בטבלת אמת או במילים. אתה תראה שכל חישוב אפשר לבצע עם שילוב מתאים של Nand-ים. המשימה שלך תהיה למצוא את השילובים המתאימים. תוכל להשתמש לא רק ב־Nand-ים אלא גם בכרטיסים קודמים, אבל גם אלה עשויים בסופו של דבר מ־Nand-ים.`
  ];

  const XOR_HINT_SLIDES = [
    "assets/hints/xor/1.svg",
    "assets/hints/xor/2.svg",
    "assets/hints/xor/3.svg",
    "assets/hints/xor/4.svg",
    "assets/hints/xor/5.svg"
  ];

  const XOR_HINT_NARRATION = [
    "טבלת האמת של Xor מראה את כל האפשרויות לשתי הכניסות ואת היציאה המתאימה.",
    "אלה שתי השורות שבהן Xor צריך להוציא 1: בדיוק כאשר אחת משתי הכניסות היא 1.",
    "אפשר לחשוב על בניית הכרטיס דרך המקרים שבהם היציאה צריכה להיות 1.",
    "כאן מסומן אחד מהמקרים האלה: הכניסה הראשונה היא 0 והכניסה השנייה היא 1, ולכן היציאה היא 1.",
    "זהו סיכום הרעיון: משתמשים בטבלת האמת כדי לזהות את המקרים הרצויים, ואז בונים כרטיס שמוציא 1 בדיוק במקרים האלה."
  ];

  const NAND_MONOLOGUE_TEXTS = [
    "כפי שבטח שמת לב, אני מוציא מתח ביציאה בכל מצב אלא אם כן שתי הכניסות שלי מחוברות למתח. אפשר לבדוק האם יש מתח ביציאה אם מחברים אותה למנורה. אפשר לסכם את הפעולה שלי על ידי טבלת אמת:",
    "בכל שורה רואים אפשרות אחת של שתי הכניסות, ומה תהיה היציאה במקרה זה. 0 אומר שאין מתח ו-1 אומר שיש. יש בסך הכול 4 אפשרויות לשתי הכניסות ולכן יש 4 שורות.",
    "קוראים לי Nand כי אני עושה ההפך מאחי And. הוא מוציא מתח רק אם בשתי הכניסות שלו יש מתח. המילה And באנגלית אומרת “גם”. ובאמת And מוציא מתח רק אם גם הכניסה הראשונה וגם הכניסה השנייה מקבלות מתח. ה-N בשם שלי זה קיצור של המילה האנגלית Not שאומרת “לא”. לכן אני מוציא מתח רק אם And לא היה מוציא מתח באותו מצב."
  ];

  // The scripted 2.6 "subtraction" demo: von Neumann drives an ALU4 through
  // 19 − 7 on an inactive workbench, one speech bubble (and one animation) per
  // "המשך" press. Each entry is the bubble text for that step; the matching
  // animation/highlight is applied in the app from the step index.
  const SUBTRACTION_DEMO_TEXTS = [
    "אנחנו מכניסים מספר לכניסה הראשונה — כיתוב בינרי של מספר שאנחנו רוצים, למשל 19.",
    "ולכניסה השנייה אנחנו מכניסים כיתוב בינרי של מספר אחר, למשל 7.",
    "עכשיו נכניס את הביטים 110010 לכניסת הבקרה,",
    "זה אומר שאנחנו עושים Not לכניסה הראשונה,",
    "בוחרים את פעולת החיבור,",
    "ובסוף עושים NOT לתוצאה.",
    "עכשיו נחבר את היציאה לממיר כדי לראות מה יצא.",
    "תראה, יצאה 12 — שזה בדיוק ההפרש 19-7.",
    "מתברר שהשיטה הזאת תמיד עובדת, זאת אומרת רק אם ההפרש הוא חיובי.",
    "תראה, אם נחליף את הסדר נקבל משהו מוזר.",
    "אבל שים לב שהביט המוביל הוא 1.",
    "זה בעצם די נחמד, ככה אנחנו יכולים לבדוק איזה מספר גדול יותר: פשוט לעשות את ההפרש בשיטה הזאת ולבדוק את הביט המוביל. זו הסיבה שאנחנו רוצים לקבל את הביט המוביל בנפרד."
  ];
  // The red enrichment teaser shown above the demo the whole time.
  const SUBTRACTION_DEMO_TEASER = "ג'ון לא אומר לך את כל האמת. רוצה לדעת למה השיטה הזאת לחיסור עובדת, ואיך מטפלים במספרים שליליים במחשב? לחץ כאן.";
  // The "still under construction" window reached at the end of the demo (and from
  // the red teaser): a short note plus two explainer videos.
  const SUBTRACTION_DEMO_LINKS_TITLE = "חלק זה של המשחק עדיין בבנייה";
  const SUBTRACTION_DEMO_LINKS_INTRO = "כאן אפשר לשמוע על זה:";
  const SUBTRACTION_DEMO_LINKS = [
    { label: "סרטון 1", url: "https://www.youtube.com/watch?v=_ESppTswRyY" },
    { label: "סרטון 2", url: "https://www.youtube.com/watch?v=s8ORydrdQ1k" }
  ];

  // The flip-flop "clocking" enrichment window, reached from the red teaser on the
  // second FF-explanation bubble (after the latch collapses into a single FF).
  // Three explainer videos on how a computer keeps everything synchronised (a clock).
  const FF_CLOCK_LINKS_TITLE = "חלק זה של המשחק עדיין בבנייה";
  const FF_CLOCK_LINKS_INTRO = "כאן אפשר לשמוע איך גורמים לזה שבמחשב הכל יהיה מתוזמן:";
  const FF_CLOCK_LINKS = [
    { label: "סרטון 1", url: "https://www.youtube.com/watch?v=YmwfwfqoNmo" },
    { label: "סרטון 2", url: "https://www.youtube.com/watch?v=H6DjiE7TlzA" },
    { label: "סרטון 3", url: "https://www.youtube.com/watch?v=DFyrkfkBMTE&t=437s" }
  ];

  // Chapter 2.4 component monologues, shown when the learner clicks the two new
  // crate hotspots in the 2.4 worktable. Each is a single speech bubble: `intro`
  // text, then the component's schematic symbol inline, then `outro` text.
  const BUS_MONOLOGUE = {
    intro: "שלום, אני בס. אני כבל רחב שמאגד כמה כבלים. על שולחן העבודה אני נראה כך:",
    outro: "המספר מציין את מספר הכבלים שאני מורכב מהם. אפשר לפצל אותי לכבלים בודדים או לבסים קטנים יותר באמצעות מפצל."
  };

  const SPLITTER_MONOLOGUE = {
    intro: "שלום, אני מפצל. אני נועדתי כדי לפצל בסים. על שולחן העבודה אני נראה כך:",
    outro: "יש לי שני צדדים. לצד אחד מחברים בס, ומהצד השני יוצאים מספר כבלים או בסים. אפשר לשנות את מספר הבסים (או הכבלים), והם לא חייבים להיות שווים – כל רגל יכולה להיות ברוחב משלה, כל עוד יחד הם מסתכמים לרוחב הבס שנכנס. אם הופכים אותי אפשר להשתמש בי לכיוון השני – אני מחבר כמה בסים (או כבלים בודדים) לבס אחד רחב יותר."
  };

  // The נעץ (routing nail) self-introduction, shown from the nail-box hotspot on
  // the 3.1 memory worktable. Same shape as the bus/splitter monologues: intro,
  // its on-table symbol, then outro.
  const NAIL_MONOLOGUE = {
    intro: "שלום, אנחנו נעצים. על שולחן העבודה אנחנו נראים כך:",
    outro: "אנחנו יכולים לעזור לך לפרוס את הכבלים. אפשר להוציא מאותו נעץ כמה כבלים או בסים זהים — ובמקרה כזה הכניסה של הנעץ עוברת לכל אחד מהם בנפרד."
  };

  // Chapter 3.1 memory worktable cards, opened (in order) from the tasks note.
  // These are CLOCKED (sequential) cards: the build board runs a 2 Hz clock,
  // loops are allowed but every loop must contain at least one FF, combinatorial
  // parts settle instantly and each FF takes one clock. The card is checked by its
  // MEMORY behaviour (drive the input over several clocks, verify the output given
  // the history) — not by a truth table. The frame appears with its flip-flops
  // already inside; the learner wires the splitters and the shared control.
  // (That last fact is a property of the build, not a requirement, so it is NOT
  // part of the requirements text the learner reads.)
  const MEMORY_TASKS = [
    {
      id: "Register4",
      label: "Register4",
      requires: [],
      inputs: 2,
      outputs: 1,
      busWidth: 4,
      clocked: true,
      requirements: "ל-Register4 יש 2 כניסות: אחת בס ברוחב 4 והשנייה כניסה בודדת שהיא כניסת הבקרה. ויציאה אחת שהיא בס ברוחב 4. בתוכו יש 4 פליפ-פלופים ששומרים 4 ביטים. הוא מוציא את המידע השמור בפליפ-פלופים. אם כניסת הבקרה היא 0 אז המידע לא משתנה, ואם היא 1 אז המידע השמור בפליפ-פלופים משתנה בהתאם לכניסה.",
      hints: [
        { kind: "text", title: "רמז 1", text: "אתה תמיד יכול להתחיל מלפצל את הכניסה והיציאה." },
        { kind: "text", title: "רמז 2", text: "תשאיר את כניסת הבקרה לסוף. קודם כל תטפל בשאר." },
        { kind: "text", title: "רמז 3", text: "שים לב, אם אנחנו כותבים (זאת אומרת משנים את מה שנשמר בפליפ-פלופים) אנחנו עושים את זה בכל הכרטיס בו-זמנית, כך שכניסת הבקרה של כל הפליפ-פלופים צריכה להיות אותו הדבר." }
      ]
    },
    {
      id: "Register",
      label: "Register",
      requires: ["Register4"],
      inputs: 2,
      outputs: 1,
      busWidth: 16,
      clocked: true,
      requirements: "ל-Register יש 2 כניסות: אחת בס ברוחב 16 והשנייה כניסה בודדת שהיא כניסת הבקרה. ויציאה אחת שהיא בס ברוחב 16. בתוכו יש 16 פליפ-פלופים ששומרים 16 ביטים. הוא מוציא את המידע השמור בפליפ-פלופים. אם כניסת הבקרה היא 0 אז המידע לא משתנה, ואם היא 1 אז המידע השמור בפליפ-פלופים משתנה בהתאם לכניסה.",
      hints: [
        { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-Register4, או לעשות את הכרטיס כמו שעשית את Register4, רק עם 16 פליפ-פלופים במקום 4." },
        { kind: "text", title: "רמז 2", text: "זכור שכניסת הבקרה של כל הפליפ-פלופים צריכה להיות אותו הדבר." }
      ]
    }
  ];

  // Chapter 3.3 RAM cards, opened from the 3.3 worktable note. Strictly in order:
  // each size is built out of FOUR of the previous size (RAM4 out of four
  // Registers), though the frame arrives EMPTY and what goes in is the learner's
  // own call. Like the 3.1 memory cards these are
  // CLOCKED bus builds, checked by their memory behaviour: write a value to an
  // address, read it back later. The address is a bus of `addressWidth` bits, so
  // which address maps to which register is the learner's own choice — the check
  // only requires that writing then reading the same address agrees.
  const RAM_TASKS = [
    {
      id: "RAM4",
      label: "RAM4",
      requires: [],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      addressWidth: 2,
      controlPinX: -217,
      innerCardSpots: [[740, 335], [695, 430], [630, 540], [525, 645]],
      slots: 4,
      clocked: true,
      requirements: "ה-RAM4 הוא כרטיס עם 3 כניסות ויציאה אחת. ה-RAM4 מכיל 4 רגיסטרים.\n\nכניסות:\n\n1. כניסת דאטה - בס של 16 ביטים עם המידע שאנחנו רוצים לשמור בזיכרון\n\n2. כניסת הכתובת - בס של 2 ביטים שאומר לאיזה רגיסטר אנחנו רוצים לכתוב או מאיזה רגיסטר נרצה לקרוא (לקבל את מה שכתוב שם)\n\n3. כניסת בקרה - כבל בודד שנכנס מלמעלה ואומר האם אנחנו רוצים לכתוב משהו\n\nהיציאה:\n\nבס של 16 ביטים שמוציא את מה שכתוב ברגיסטר שבחרנו.\n\nשים לב, לבס הכתובת יש 4 אפשרויות. כך שזה מתאים למספר הרגיסטרים. אתה יכול לבחור איזו כתובת מתאימה לאיזה רגיסטר.",
      hints: [
        { kind: "text", title: "רמז 1", text: "הכרטיס צריך להכיל 4 רגיסטרים. אתה יכול להתחיל מהם." },
        { kind: "interactive", title: "רמז 2", action: "ram-place-inner-cards", confirmBeforeApply: true, applyLabel: "כן", text: "אניח בשבילך את 4 הרגיסטרים בתוך המסגרת. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
        { kind: "text", title: "רמז 3", text: "כניסת הבקרה צריכה להגיע רק לרגיסטר אחד — זה שהכתובת מצביעה עליו. כל שאר הרגיסטרים צריכים לקבל 0 בכניסת הבקרה שלהם, כדי שהמידע ששמור בהם לא ישתנה." },
        { kind: "text", title: "רמז 4", text: "כניסת הדאטה יכולה להתחבר לכל ארבעת הרגיסטרים במקביל. זה לא מפריע, כי רק הרגיסטר שכניסת הבקרה שלו היא 1 באמת ישמור את המידע." },
        { kind: "text", title: "רמז 5", text: "בנית כבר כרטיס שמעביר כניסה אחת לאחת מארבע יציאות לפי בס בקרה של 2 ביטים — DMux4Way. תן לו את כניסת הבקרה, ואת בס הכתובת בתור הבקרה שלו." },
        { kind: "text", title: "רמז 6", text: "וליציאה יש את הכרטיס ההפוך: Mux4Way16 בוחר אחד מארבעה בסים לפי אותו בס בקרה. חבר אליו את היציאות של ארבעת הרגיסטרים, ואת אותו בס כתובת." }
      ]
    },
    {
      id: "RAM16",
      label: "RAM16",
      requires: ["RAM4"],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      addressWidth: 4,
      controlPinX: -217,
      innerCardSpots: [[740, 290], [720, 410], [650, 525], [530, 620]],
      slots: 16,
      clocked: true,
      requirements: "ה-RAM16 הוא כרטיס עם 3 כניסות ויציאה אחת. ה-RAM16 מכיל 4 כרטיסי RAM4.\n\nכניסות:\n\n1. כניסת דאטה - בס של 16 ביטים עם המידע שאנחנו רוצים לשמור בזיכרון\n\n2. כניסת הכתובת - בס של 4 ביטים שאומר לאיזה רגיסטר אנחנו רוצים לכתוב או מאיזה רגיסטר נרצה לקרוא (לקבל את מה שכתוב שם)\n\n3. כניסת בקרה - כבל בודד שנכנס מלמעלה ואומר האם אנחנו רוצים לכתוב משהו\n\nהיציאה:\n\nבס של 16 ביטים שמוציא את מה שכתוב ברגיסטר שבחרנו.\n\nשים לב, לבס הכתובת יש 16 אפשרויות. כך שזה מתאים למספר הרגיסטרים. אתה יכול לבחור איזו כתובת מתאימה לאיזה רגיסטר.",
      hints: [
        { kind: "text", title: "רמז 1", text: "ה-RAM16 הוא בדיוק אותו רעיון כמו ה-RAM4, רק שבמקום 4 רגיסטרים יש בתוכו 4 כרטיסי RAM4." },
        { kind: "interactive", title: "רמז 2", action: "ram-place-inner-cards", confirmBeforeApply: true, applyLabel: "כן", text: "אניח בשבילך את 4 כרטיסי ה-RAM4 בתוך המסגרת. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
        { kind: "text", title: "רמז 3", text: "הכתובת היא 4 ביטים. שזה 16 אפשרויות. אתה צריך לחלק את האפשרויות ל-4 קבוצות, ועבור כל 4 אפשרויות להשתמש ב-RAM4" },
        { kind: "text", title: "רמז 4", text: "אתה יכול להחליט ששני הביטים הראשונים יקבעו את הקבוצה, ושני הביטים האחרונים יקבעו את הרגיסטר בתוך הקבוצה." },
        { kind: "text", title: "רמז 5", text: "זה אומר שאתה משתמש בשני הביטים הראשונים של הכתובת כדי לקבוע לאיזה RAM4 אתה כותב ומאיזה RAM4 אתה קורא, ושני הביטים האחרונים יהיו בס הכתובת של ה-RAM4 שתשתמש בו." },
        { kind: "text", title: "רמז 6", text: "שים לב, אתה יכול לשלוח את שני הביטים האחרונים של הכתובת לכל ארבעת כרטיסי ה-RAM4. בדיוק כמו שאתה יכול לשלוח את כניסת הדאטה לארבעתם. אתה רק צריך להקפיד שביט הבקרה יהיה 0 אצל כולם חוץ מאחד ואז אתה תכתוב רק לרגיסטר שאתה רוצה. בסוף אתה גם צריך להתעלם ביציאות של כל כרטיסי ה-RAM4 חוץ מאחד, כך שתקבל את התוכן של הרגיסטר שבחרת.\n\nבשביל זה אתה משתמש ב-DMUX וב-MUX בדיוק כמו שעשית ב-RAM4" }
      ]
    },
    {
      id: "RAM64",
      label: "RAM64",
      requires: ["RAM16"],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      addressWidth: 6,
      controlPinX: -217,
      innerCardSpots: [[740, 290], [720, 410], [650, 525], [530, 620]],
      slots: 64,
      clocked: true,
      requirements: "ה-RAM64 הוא כרטיס עם 3 כניסות ויציאה אחת. ה-RAM64 מכיל 4 כרטיסי RAM16.\n\nכניסות:\n\n1. כניסת דאטה - בס של 16 ביטים עם המידע שאנחנו רוצים לשמור בזיכרון\n\n2. כניסת הכתובת - בס של 6 ביטים שאומר לאיזה רגיסטר אנחנו רוצים לכתוב או מאיזה רגיסטר נרצה לקרוא (לקבל את מה שכתוב שם)\n\n3. כניסת בקרה - כבל בודד שנכנס מלמעלה ואומר האם אנחנו רוצים לכתוב משהו\n\nהיציאה:\n\nבס של 16 ביטים שמוציא את מה שכתוב ברגיסטר שבחרנו.\n\nשים לב, לבס הכתובת יש 64 אפשרויות. כך שזה מתאים למספר הרגיסטרים. אתה יכול לבחור איזו כתובת מתאימה לאיזה רגיסטר.",
      hints: [
        { kind: "text", title: "רמז 1", text: "זה בדיוק כמו RAM16, רק במקום להשתמש ב-RAM4 אתה צריך להשתמש ב-RAM16" }
      ]
    },
    {
      id: "RAM256",
      label: "RAM256",
      requires: ["RAM64"],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      addressWidth: 8,
      controlPinX: -217,
      innerCardSpots: [[740, 290], [720, 410], [650, 525], [530, 620]],
      slots: 256,
      clocked: true,
      requirements: "ה-RAM256 הוא כרטיס עם 3 כניסות ויציאה אחת. ה-RAM256 מכיל 4 כרטיסי RAM64.\n\nכניסות:\n\n1. כניסת דאטה - בס של 16 ביטים עם המידע שאנחנו רוצים לשמור בזיכרון\n\n2. כניסת הכתובת - בס של 8 ביטים שאומר לאיזה רגיסטר אנחנו רוצים לכתוב או מאיזה רגיסטר נרצה לקרוא (לקבל את מה שכתוב שם)\n\n3. כניסת בקרה - כבל בודד שנכנס מלמעלה ואומר האם אנחנו רוצים לכתוב משהו\n\nהיציאה:\n\nבס של 16 ביטים שמוציא את מה שכתוב ברגיסטר שבחרנו.\n\nשים לב, לבס הכתובת יש 256 אפשרויות. כך שזה מתאים למספר הרגיסטרים. אתה יכול לבחור איזו כתובת מתאימה לאיזה רגיסטר.",
      hints: []
    },
    {
      id: "RAM1024",
      label: "RAM1024",
      requires: ["RAM256"],
      inputs: 3,
      outputs: 1,
      busWidth: 16,
      addressWidth: 10,
      controlPinX: -217,
      innerCardSpots: [[740, 290], [720, 410], [650, 525], [530, 620]],
      slots: 1024,
      clocked: true,
      requirements: "ה-RAM1024 הוא כרטיס עם 3 כניסות ויציאה אחת. ה-RAM1024 מכיל 4 כרטיסי RAM256.\n\nכניסות:\n\n1. כניסת דאטה - בס של 16 ביטים עם המידע שאנחנו רוצים לשמור בזיכרון\n\n2. כניסת הכתובת - בס של 10 ביטים שאומר לאיזה רגיסטר אנחנו רוצים לכתוב או מאיזה רגיסטר נרצה לקרוא (לקבל את מה שכתוב שם)\n\n3. כניסת בקרה - כבל בודד שנכנס מלמעלה ואומר האם אנחנו רוצים לכתוב משהו\n\nהיציאה:\n\nבס של 16 ביטים שמוציא את מה שכתוב ברגיסטר שבחרנו.\n\nשים לב, לבס הכתובת יש 1024 אפשרויות. כך שזה מתאים למספר הרגיסטרים. אתה יכול לבחור איזו כתובת מתאימה לאיזה רגיסטר.",
      hints: []
    }
  ];

  // Chapter 3.4 ports, opened from the 3.4 worktable note. The chain: OPorts (a
  // RAM4 whose four registers also show their contents to the outside world),
  // IPorts (no registers at all — four buses coming IN from devices, picked by an
  // address), Ports (the eight of them as one block: four out, four in), and RAM
  // (the whole memory — RAM1024 with that block of ports living at the top of its
  // address space). Like the 3.3 cards these are CLOCKED bus builds; IPorts is
  // the one exception, being pure routing.
  const PORTS_TASKS = [
    {
      id: "OPorts",
      label: "OPorts",
      // OPorts and IPorts are BOTH open as soon as the note is opened — they are
      // the two halves of the same idea and neither needs the other. Ports and
      // RAM come after them, in order.
      requires: [],
      inputs: 3,
      outputs: 5,
      busWidth: 16,
      addressWidth: 2,
      slots: 4,
      writableSlots: 4,
      portOutputs: 4,
      portOutputBase: 0,
      clocked: true,
      requirements: "זהו כרטיס זהה ל-RAM4 רק יש לו בנוסף עוד 4 יציאות המראות את התוכן של הרגיסטרים לכל מי שרוצה. היציאות ממוספרות בשיטה הבינרית בין 00 עד 11 והן משקפות את הרגיסטרים עם הכתובות האלו.",
      hints: [
        { kind: "text", title: "רמז 1", text: "תתחיל מהמימוש של ה-RAM4 ואז תוסיף מה שאתה צריך" },
        { kind: "interactive", title: "רמז 2", action: "ports-place-ram4",
          confirmBeforeApply: true, applyLabel: "כן",
          text: "אניח בשבילך את המימוש של ה-RAM4 בתוך המסגרת. (שים לב: זה ימחק את מה שבנית עד עכשיו)." },
        { kind: "text", title: "רמז 3", text: "עכשיו נשאר לך להוציא את היציאות של כל הרגיסטרים ליציאות הנוספות." }
      ]
    },
    {
      id: "IPorts",
      label: "IPorts",
      requires: [],
      inputs: 5,
      outputs: 1,
      busWidth: 16,
      addressWidth: 2,
      slots: 4,
      portInputs: 4,
      clocked: false,
      requirements: "כרטיס זה לא מכיל רגיסטרים. הוא נותן למחשב לקרוא מידע שנותנים לו מכשירים חיצוניים. מבחינת המחשב זה יהיה כמו קריאה מזיכרון.\n\nיש לו כניסת כתובת שהיא בס ברוחב 2 (בדיוק כמו ל-RAM4) ו-4 כניסות שהם בס ברוחב 16, אלו הן הכניסות שיחוברו אל מכשירים חיצוניים. הן ממוספרות בשיטה הבינרית בין 00 ל-11.\n\nיש לו יציאה אחת, גם היא בס ברוחב 16 שמראה מה יש בכניסה שמספרה הוא הכתובת שנכנסת.",
      hints: [
        { kind: "text", title: "רמז 1", text: "למעשה זה כרטיס שכבר בנית פעם" },
        { kind: "text", title: "רמז 2", text: "אתה צריך לבחור בין 4 הכניסות ולהוציא את זה החוצה." },
        { kind: "text", title: "רמז 3", text: "תכל'ס זה מוקס" }
      ]
    },
    {
      id: "Ports",
      label: "Ports",
      requires: ["OPorts", "IPorts"],
      inputs: 7,
      outputs: 5,
      busWidth: 16,
      addressWidth: 3,
      // slots = every address; writableSlots = how many of them the computer may
      // WRITE. The read-only device addresses are the ones after them.
      slots: 8,
      writableSlots: 4,
      portOutputs: 4,
      portOutputBase: 0,
      portInputs: 4,
      clocked: true,
      requirements: "ה-Ports מחבר את שני הכרטיסים הקודמים לבלוק אחד של 8 כתובות, וזה הבלוק שדרכו המחשב מדבר עם העולם.\n\nכניסת הכתובת שלו היא בס ברוחב 3, כך שיש לה 8 אפשרויות:\n\n1. הכתובות 000 עד 011 הן ארבעת הרגיסטרים של ה-OPorts. המחשב כותב אליהם, והמכשירים שבחוץ קוראים מהם ביציאות הנוספות.\n\n2. הכתובות 100 עד 111 הן ארבע הכניסות של ה-IPorts. המכשירים שבחוץ מעבירים אליהן מידע, והמחשב רק קורא מהן. אם המחשב ינסה לכתוב לכתובת כזאת פשוט לא יקרה כלום.\n\nחוץ מזה הוא נראה בדיוק כמו כרטיס זיכרון רגיל: כניסת דאטה של 16 ביטים, כניסת כתובת, כניסת בקרה מלמעלה ויציאת דאטה אחת של 16 ביטים שמוציאה את מה שכתוב בכתובת שבחרנו.",
      hints: [
        { kind: "text", title: "רמז 1", text: "כבר בנית את שני החצאים. עכשיו אתה רק צריך להחליט לפי הכתובת באיזה מהם להשתמש." },
        { kind: "text", title: "רמז 2", text: "הביט הראשון של הכתובת (העליון) הוא זה שקובע: כשהוא 0 פונים ל-OPorts, וכשהוא 1 פונים ל-IPorts. שני הביטים האחרונים הם הכתובת בתוך הכרטיס שבחרת." },
        { kind: "text", title: "רמז 3", text: "את הביט הראשון של הכתובת אתה יכול להשתמש בו פעמיים: פעם אחת כדי לבחור מאיזה כרטיס לקרוא (MUX16), ופעם אחת כדי לוודא שביט הבקרה מגיע רק ל-OPorts - כך המחשב לעולם לא יכתוב לכניסות." }
      ]
    },
    {
      id: "RAM",
      label: "RAM",
      requires: ["Ports"],
      inputs: 7,
      outputs: 5,
      busWidth: 16,
      addressWidth: 11,
      slots: 1032,
      writableSlots: 1028,
      portOutputs: 4,
      // RAM's port registers sit at the top of its address space, at 1024.
      portOutputBase: 1024,
      portInputs: 4,
      clocked: true,
      requirements: "זהו הזיכרון השלם של המחשב: ה-RAM1024 וה-Ports יחד, בכרטיס אחד.\n\nכניסת הכתובת שלו (Adr) היא בס ברוחב 16, אבל הכרטיס מתעלם מחמשת הביטים הראשונים של הכתובת. (הכנסנו אותם רק כדי שיהיה נוח לשלב אותו עם רכיבים אחרים במחשב)\n\nאחד עשר הביטים האחרונים הם הכתובת עצמה:\n\n1. הכתובות 0 עד 1023, הן הכתובות שהביט הראשון מבין אחד עשר הביטים האלה הוא 0, אלו הן הכתובות של הרגיסטרים הרגילים של ה-RAM1024.\n\n2. הכתובות 1024 עד 1031 הן הכתובות שהביט הראשון מבין אחד עשר הביטים האלה הוא 1. אלו הן הכתובות של שמונת הפורטים.\n\nמבחינת המחשב אין ביניהם שום הבדל - הוא פונה לכולם באותה דרך, עם כתובת. ההבדל היחיד הוא שלארבע הכתובות האחרונות הוא לא יכול לכתוב, ואם ינסה פשוט לא יקרה כלום.\n\nבנוסף לכניסות והיציאות הרגילות יש לכרטיס עוד 4 כניסות שהן הבסים שמובילים לארבעת הפורטים האחרונים ועוד 4 יציאות שהן הבסים שיוצאים מארבעת הפורטים הראשונים.\n\n**שים לב:** יש עוד הרבה כתובות שהביט הראשון מבין אחד עשר הביטים האלה הוא 1. אתה יכול להתעלם מהן. המחשב לא אמור לנסות לקרוא או לכתוב מהן, ואם הוא ינסה אז לא ייכתב כלום והקריאה תהיה - 0",
      hints: [
        { kind: "text", title: "רמז 1", text: "זה בדיוק אותו רעיון כמו ה-Ports, רק שהפעם אתה בוחר בין ה-RAM1024 לבין ה-Ports." },
        { kind: "text", title: "רמז 2", text: "קודם כל תיפטר מחמשת הביטים הראשונים - הכרטיס לא צריך אותם. מבין אחד עשר הביטים שנשארו, הביט הראשון (העליון) הוא זה שקובע: כשהוא 0 פונים ל-RAM1024, וכשהוא 1 פונים ל-Ports. עשרת הביטים שאחריו הם הכתובת של ה-RAM1024, ושלושת הביטים האחרונים הם הכתובת של ה-Ports." },
        { kind: "text", title: "רמז 3", text: "שוב, בביט הראשון אתה משתמש פעמיים: פעם ב-MUX16 שבוחר מאיזה כרטיס לקרוא, ופעם ב-DMUX שמעביר את ביט הבקרה רק לכרטיס שאליו כותבים." }
      ]
    }
  ];

  // ---- 3.5 program memory ------------------------------------------------
  // One card: Prg, the memory the computer's instructions live in. It is the RAM
  // without the ports, read-only to the computer, and with a SECOND address that
  // the control input switches to for writing.
  // The requirements are not written yet, so the note offers the card but the
  // build is not open — handlePrgNoteTask shows "המשך יבוא..." until they arrive
  // (prgTaskImplemented in app.js is the single switch that opens it).
  const PRG_TASKS = [
    {
      id: "Prg",
      label: "Prg",
      requires: [],
      inputs: 4,
      outputs: 1,
      busWidth: 16,
      addressWidth: 10,
      slots: 1024,
      clocked: true,
      requirements: "Prg הוא זיכרון התוכנה של המחשב.\n\nיש לו 2 כניסות כתובת ברוחב 16 ביטים כל אחת, אבל הוא מתייחס רק ל-10 הביטים האחרונים של הכתובת. אחת מכניסות הכתובת היא לכתיבה (WAdr) והשנייה לקריאה (RAdr). יש לו גם כניסת בקרה וכניסת דאטה.\n\nאם כניסת הבקרה היא 0, הוא מתעלם מכתובת הכתיבה ומוציא את הערך של הרגיסטר שנמצא בכתובת הקריאה.\n\nאם כניסת הבקרה היא 1 הוא מתעלם מכתובת הקריאה וכותב לרגיסטר שנמצא בכתובת הכתיבה. במקרה זה הוא מוציא 0.",
      hints: [
        { kind: "text", title: "רמז 1", text: "הזיכרון עצמו הוא RAM1024 אחד. כל השאלה היא מה נכנס לכניסת הכתובת שלו ומה יוצא מהכרטיס — את שניהם צריך להחליט לפי כניסת הבקרה." },
        { kind: "text", title: "רמז 2", text: "יש לך שתי כתובות וכניסת כתובת אחת בזיכרון. אתה כבר מכיר כרטיס שבוחר בין שני בסים לפי ביט אחד." },
        { kind: "text", title: "רמז 3", text: "הכתובות הן בסים של 16 ול-RAM1024 יש כניסת כתובת של 10. תחתוך במפצל ותשאיר את שישה הביטים הראשונים לא מחוברים - הכרטיס מתעלם מהם ממילא." },
        { kind: "text", title: "רמז 4", text: "בזמן כתיבה הכרטיס צריך להוציא 0. גם כאן MUX16 עושה את העבודה: בכניסה אחת מה שיצא מהזיכרון, והכניסה השנייה נשארת לא מחוברת - כניסה לא מחוברת היא 0." }
      ]
    }
  ];

  // Objects a story slide can offer for a closer look: a click-zone over the
  // object opens a small window with its reference link and, when the object is
  // something the learner takes with them, a "לקחת" button that walks the story
  // on to the next slide.
  // Chapter 5.1's note: the demonstrations the machine has to give. They are done
  // in order — each is unlocked by the one before it — and each opens a
  // programming page like 4.3's. Only the first has one so far; the rest answer
  // "המשך יבוא...".
  const DEMO_TASKS = [
    {
      id: "demo-infinite-loop",
      label: "לולאה אינסופית",
      requires: [],
      title: "משימת תכנות: לולאה אינסופית",
      text: "כתוב תוכנה שמבצעת פקודות (לא משנה איזה) בלולאה אינסופית ולא מפסיקה לעולם (עד שמנתקים אותה מהחשמל) ולא יוצאת מהפקודות שנתת לה.",
      // The four hints unlock the usual way — one more after each failed run of
      // the machine, from the second — and they walk the loop in the order one
      // writes it: the body, then WHY a jump needs an address, then how to put
      // one there, and only then the jump itself.
      hints: [
        { kind: "text", title: "רמז 1", text: "תתחיל מלכתוב את הפעולה או הפעולות שאתה רוצה לעשות שוב ושוב. זה יכול להיות מה שאתה רוצה, למעשה אתה גם לא חייב שזה יהיה משהו בכלל..." },
        { kind: "text", title: "רמז 2", text: "עכשיו אתה רוצה לקפוץ לשורה הראשונה. אתה זוכר שפקודת קפיצה לא יכולה להגיד למחשב לאן לקפוץ, הוא תמיד קופץ למה שכתוב לו ברגיסטר A. אז מה אתה צריך לעשות כדי שהקפיצה תעבוד כמו שאתה רוצה?" },
        { kind: "text", title: "רמז 3", text: "אתה צריך לכתוב ברגיסטר A את מספר הפקודה אליה אתה רוצה לקפוץ. למשל זו פקודה 1 כי התחלנו לתכנת ברגיסטר מספר 1. אתה יכול פשוט לשים שם את המספר 1. לחילופין אתה יכול לכתוב שם שם של תגית ולתת לגמד למלא את המספר בעצמו. יש לזה לא מעט יתרונות, בחירה שלך." },
        { kind: "text", title: "רמז 4", text: "עכשיו נותר לקפוץ. תבצע חישוב שאתה יודע את התשובה שלו ותיתן תנאי שאתה יודע שיתקיים בשביל הקפיצה." }
      ],
      // Two walkthroughs, one after the other: the same three instructions
      // written first with the address itself and then with a tag, so the
      // difference between them is the only thing that changes.
      solution: [
        {
          title: "פתרון",
          lead: "לולאה היא רצף פקודות שבסופו קופצים בחזרה לתחילתו. אז נכתוב פקודה כלשהי, ואחריה נדאג לקפוץ אליה.",
          steps: [
            { code: "D+1 → D", bits: "1000001111100100", text: "זאת הפעולה שתחזור על עצמה. אין שום חשיבות לאיזו פעולה בחרנו — המשימה רק דורשת שהמכונה תמשיך לבצע פקודות. אפשר היה לכתוב כאן פקודה שלא כותבת לשום מקום בכלל." },
            { code: "1 → A", bits: "0000000000011000", text: "פקודת קפיצה לא נושאת איתה לאן לקפוץ — המחשב תמיד קופץ למה שכתוב ברגיסטר A. לכן לפני הקפיצה נכניס ל-A את מספר הפקודה שאליה אנחנו רוצים לחזור, וזאת פקודה 1." },
            { code: "0 ; קפוץ אם =0", bits: "1000000101010010", text: "הקפיצה עצמה. ה-ALU מחשב 0, והתנאי לקפיצה הוא שהתוצאה היא 0 — כלומר תנאי שתמיד מתקיים. אין יעד לתוצאה, הפקודה הזאת רק קופצת." }
          ],
          close: "שלוש פקודות, והמכונה תרוץ עליהן עד שינתקו אותה מהחשמל."
        },
        {
          title: "פתרון עם תגית",
          lead: "אותה תוכנה בדיוק, רק שבמקום לכתוב את מספר הפקודה בעצמנו ניתן לה שם ונשאיר לגמד למצוא את המספר.",
          steps: [
            { code: "לולאה:  D+1 → D", bits: "1000001111100100", label: "לולאה",
              text: "אותה פקודה, ובעמודת התגיות שלצידה כתבנו לה שם: לולאה." },
            { code: "לולאה → A", bits: "0000000000011000", shows: "לולאה",
              text: "וכאן, במקום המספר, כתבנו את שם התגית. הגמד מוצא באיזו שורה היא יושבת וממלא את הביטים בעצמו — אותם ביטים בדיוק שכתבנו קודם ביד." },
            { code: "0 ; קפוץ אם =0", bits: "1000000101010010", text: "הקפיצה לא משתנה כלל." }
          ],
          close: "היתרון מתגלה כשמזיזים פקודות: אם נוסיף שורה לפני הלולאה, המספר 1 כבר לא יהיה נכון — אבל התגית תמשיך להצביע על הפקודה הנכונה, כי היא נוסעת איתה."
        }
      ]
    },
    {
      id: "demo-count-loop",
      label: "לולאת ספירה",
      requires: ["demo-infinite-loop"]
    },
    {
      id: "demo-count-to",
      label: "ספירה עד מספר",
      requires: ["demo-count-loop"]
    },
    {
      id: "demo-multiply",
      label: "כפל",
      requires: ["demo-count-to"],
      rankId: "prg-multiply",
      rankLabel: "כפל",
      title: "משימת תכנות: כפל",
      text: "כתוב תוכנה שמכפילה את הערך של In0 ב-In1 וכותבת את התוצאה ב-Out0."
    },
    {
      id: "demo-divide",
      label: "חילוק",
      requires: ["demo-multiply"]
    }
  ];

  // The machine check for 5.1's infinite loop. Same bench as 4.3's, but what it
  // is watching for is different: not a number in Out0 — the task does not ask
  // for one — but that after fifty beats the machine is still inside the
  // instructions that were written.
  const PROGRAM_LOOP_TEST = {
    title: "בדיקת התוכנה",
    cycles: 50,
    passTitle: "הבדיקה הצליחה",
    passText: "המכונה רצה 50 מחזורי שעון והמשיכה לבצע את הפקודות שכתבת. התוכנה לא נגמרת.",
    failTitle: "הבדיקה נכשלה",
    emptyText: "עדיין לא כתבת אף פקודה.",
    ranOffText: "אחרי {steps} פקודות המכונה הגיעה לשורה {line}, שלא כתבת בה כלום. התוכנה נגמרה במקום להמשיך בלולאה.",
    incompleteText: "פקודה {line} לא הושלמה.",
    captions: {
      load: "התוכנה נטענת לזיכרון התוכנה",
      connect: "הריסט מתנתק",
      run: "המכונה רצה",
      check: "בודקים אם המכונה עדיין בתוך הפקודות",
      reset: ""
    }
  };

  const PANEL_OBJECTS = {
    dosimeter: {
      label: "תא עיפרון",
      url: "https://grokipedia.com/page/quartz_fiber_dosimeter",
      takeLabel: "לקחת"
    },
    // The hangar's two reference objects — nothing to take, just a link, like the
    // warehouse's non-game objects.
    nuclearWaste: {
      label: "פסולת גרעינית",
      url: "https://he.wikipedia.org/wiki/פסולת_רדיואקטיבית"
    },
    // The same waste, in the pile beside the door. It is a separate entry (not a
    // second zone with the same id) so its window opens beside the pile the
    // learner actually clicked.
    nuclearWasteLeft: {
      label: "פסולת גרעינית",
      url: "https://he.wikipedia.org/wiki/פסולת_רדיואקטיבית"
    },
    popy: {
      label: "פופי",
      url: "https://grokipedia.com/page/Proportional_counter"
    },

    // ---- Chapter 4.1, the computer room the learner is left alone in --------
    // The two racks get a reference link; every cable tag gets a short note
    // instead (`note` replaces `url`). Each tag is its OWN entry even where the
    // wording repeats, because the window opens beside the zone whose objectId
    // it matches — sharing an id would park it beside the first zone found.
    aluRack: {
      label: "ALU",
      url: "https://he.wikipedia.org/wiki/יחידה_לוגית_אריתמטית"
    },
    ramRack: {
      label: "RAM",
      url: "https://he.wikipedia.org/wiki/זיכרון_גישה_אקראית"
    },
    aluIn1: { label: "IN1", note: "הכניסה הראשונה של ה-ALU. בס ברוחב 16." },
    aluIn2: { label: "IN2", note: "הכניסה השנייה של ה-ALU. בס ברוחב 16." },
    aluIn3: { label: "IN3", note: "הכניסה השלישית של ה-ALU. בס ברוחב 16." },
    aluOut: { label: "OUT", note: "היציאה של ה-ALU. בס ברוחב 16 עם תוצאת החישוב." },
    aluInst: { label: "INST", note: "כניסת הבקרה של ה-ALU. בס ברוחב 12 שאומר לו איזה חישוב לבצע." },
    aluFlags: { label: "ng ו-zr", note: "שתי היציאות הנוספות של ה-ALU, כבלים בודדים ולא בסים: ng הוא הביט המוביל של התוצאה, ו-zr הוא 1 אם כל התוצאה היא 0 ו-0 אחרת." },
    ramIn: { label: "IN", note: "הבס שנכנס לזיכרון — המידע שרוצים לכתוב בו." },
    ramAdr: { label: "ADR", note: "הכתובת בזיכרון — היא קובעת לאיזה רגיסטר קוראים או כותבים." },
    ramOut: { label: "OUT", note: "הבס שיוצא מהזיכרון — התוכן של הרגיסטר שכתובתו מופיעה ב-ADR." },
    ramWrite: { label: "כבל הבקרה", note: "כבל בודד ולא בס: הוא קובע אם כותבים לזיכרון או רק קוראים ממנו." },
    ramIn0: { label: "IN0", note: "פורט כניסה 0. בס ברוחב 16 שמגיע מבחוץ, ממכשיר שמזין את המחשב." },
    ramIn1: { label: "IN1", note: "פורט כניסה 1. בס ברוחב 16 שמגיע מבחוץ, ממכשיר שמזין את המחשב." },
    ramIn2: { label: "IN2", note: "פורט כניסה 2. בס ברוחב 16 שמגיע מבחוץ, ממכשיר שמזין את המחשב." },
    ramIn3: { label: "IN3", note: "פורט כניסה 3. בס ברוחב 16 שמגיע מבחוץ, ממכשיר שמזין את המחשב." },
    ramOut0: { label: "OUT0", note: "פורט יציאה 0. בס ברוחב 16 שיוצא החוצה, למכשיר שהמחשב מפעיל." },
    ramOut1: { label: "OUT1", note: "פורט יציאה 1. בס ברוחב 16 שיוצא החוצה, למכשיר שהמחשב מפעיל." },
    ramOut2: { label: "OUT2", note: "פורט יציאה 2. בס ברוחב 16 שיוצא החוצה, למכשיר שהמחשב מפעיל." },
    ramOut3: { label: "OUT3", note: "פורט יציאה 3. בס ברוחב 16 שיוצא החוצה, למכשיר שהמחשב מפעיל." },
    // The note von Neumann left on the table: it opens the exercise sheet.
    tasksNote: { label: "הפתק", opens: "instruction-sheet" },
    // The second note, left beside it: the tasks for building the simple computer.
    buildNote: { label: "הפתק", opens: "build-tasks" },
    // The floor beside the worktable, facing the cables: the learner's own work
    // area. Clicking it walks over to the workbench in free build — a side trip,
    // not the way forward, so it does NOT block המשך.
    workArea: { label: "אזור העבודה", opens: "free-workbench", optional: true },

    // ---- Chapter 4.3, the same room once the computer is standing ----------
    // The ALU rack has become the CPU rack, the first two cables are the ones
    // that write the program into the program memory, and one unnamed cable
    // carries the reset switch.
    cpuRack: {
      label: "CPU",
      url: "https://he.wikipedia.org/wiki/יחידת_עיבוד_מרכזית"
    },
    prgPort: { label: "PRG", note: "בס ברוחב 16 שמחזיק את הפקודה שרוצים לכתוב לזיכרון התוכנה. המחשב מתעלם ממנו כל עוד הריסט לא לחוץ." },
    prgAdrPort: { label: "ADR PRG", note: "בס ברוחב 16 שאומר לאיזו כתובת בזיכרון התוכנה נכתבת הפקודה." },
    resetSwitch: { label: "המפסק של הריסט", note: "כשהוא לחוץ אפשר לכתוב לזיכרון התוכנה והמחשב לא מריץ; כשמשחררים אותו המחשב מתחיל לבצע את הפקודות מההתחלה." },
    // The description of the program to be written, left on the table: it opens
    // the 4.3 programming page.
    programNote: { label: "הפתק", opens: "program-sheet" },
    // The note von Neumann leaves at the end of 4.4: the cards that turn the
    // simple computer into a machine that can jump.
    jumpNote: { label: "הפתק", opens: "jump-tasks" },
    // 5.1's note, on the same table in the same room. Its own entry (not a second
    // zone sharing jumpNote's id) so it opens the demonstration tasks, not 4.4's.
    demoNote: { label: "הפתק", opens: "demo-tasks" },
    // The two converters on the hangar floor in 4.4, standing under the ports
    // they serve. They carried the prgPort / prgAdrPort ids — the PRG and ADR PRG
    // tags of 4.3's room, which still use them — so they announced themselves as
    // ports. Which is which comes from the ports each sits under: the one below
    // IN0-IN3 is dialled to feed the machine, the one below OUT0-OUT3 reads what
    // came out. The wording is the converters' own, from their 2.5 monologue.
    decToBinConverter: {
      label: "ממיר מעשרוני לבינרי",
      note: "התאם את הספרות שעליו למספר שאתה רוצה, והוא יוציא בס עם הביטים שמתאימים למספר."
    },
    binToDecConverter: {
      label: "ממיר מבינרי לעשרוני",
      note: "חבר אותו לבס, והוא יציג את הכתיב העשרוני של המספר שמקודד בבס."
    },
    // The tape reader standing on the hangar floor in 4.4. A reference object,
    // like the waste drums and the popy: nothing to take, just a link. Only the
    // last two words carry it (see `linkText` in renderPanelObjectPopover) —
    // the reader is part of our machine, the punched tape is the thing with an
    // encyclopaedia entry.
    tapeReader: {
      label: "קורא סרטים מנוקבים",
      linkText: "סרטים מנוקבים",
      url: "https://he.wikipedia.org/wiki/סרט_מנוקב"
    }
  };

  // The build tasks of chapter 4.4 — the conditional jump. PC and JmpCnt can
  // both be started at once; Cont waits on JmpCnt, CPU on PC and Cont, and
  // Computer on CPU.
  const JUMP_TASKS = [
    {
      id: "PC",
      label: "PC",
      requires: [],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      clocked: true,
      requirements: "ל-PC יש כניסת דאטה אחת שהיא בס בגודל 16, ויציאה אחת שהיא בס בגודל 16 שאומרת מה רשום בו. בדרך כלל המספר הזה גדל ב-1 בכל שלב.\n\nיש לו מלמעלה גם כניסת reset וגם כניסת בקרה: אם כניסת הבקרה היא 1, אז במקום לגדול ב-1 בשלב הבא, ה-PC שומר את כניסת הדאטה שלו (זו בעצם הקפיצה). אם כניסת ה-reset היא 1 אז ה-PC מתעלם מכל השאר והתוכן שלו מתאפס.",
      hints: [
        { kind: "text", title: "רמז 1", text: "ה-PC מאוד דומה ל-PC0. אתה יכול להתחיל ממנו ואז לשנות." },
        {
          kind: "interactive", title: "רמז 2", action: "pc-restore-pc0",
          confirmBeforeApply: true, applyLabel: "כן",
          text: "אתה רוצה שאשחזר לך את בניית ה-PC0? אם תלחץ כן, זה ימחק את כל מה שבנית.",
          appliedText: "זאת בניית ה-PC0. עכשיו תחשוב מה צריך להשתנות בה."
        },
        { kind: "text", title: "רמז 3", text: "תחשוב על הכניסה של הרגיסטר. מה צריך להיכנס לשם?" },
        { kind: "text", title: "רמז 4", text: "לפעמים אתה צריך לרשום את היציאה ועוד אחד, לפעמים את כניסת הדאטה ולפעמים לאפס. יש לך כרטיסים שיודעים לבחור. תשתמש בהם." },
        { kind: "text", title: "רמז 5", text: "תחשוב באיזה סדר אתה צריך לבחור." },
        { kind: "text", title: "רמז 6", text: "הריסט הוא זה שאומר את המילה האחרונה: אם הוא 1 אז השאר לא חשוב, סימן שהבחירה שלו צריכה להיות אחרונה. עכשיו תחשוב מה האפשרויות שלו." },
        { kind: "text", title: "רמז 7", text: "אחת האפשרויות היא ריקה (רגיסטר של אפסים), זה מה שקורה אם הריסט הוא 1. האפשרות השנייה תלויה בכניסת הבקרה, זאת אומרת שהיא היציאה של mux אחר. זה ה-mux שבוחר בין כניסת הדאטה ובין היציאה ועוד אחד." }
      ]
    },
    {
      id: "JmpCnt",
      label: "JmpCnt",
      requires: [],
      inputs: 1,
      outputs: 1,
      busWidth: 2,
      requirements: "זהו החלק של יחידת הבקרה שאחראי על הקפיצה.\n\nהוא מקבל בס ברוחב 2 שמורכב מהביטים שאומרים מהם תנאי הקפיצה:\n\nאם הביט הראשון הוא 1 אז קופצים אם התוצאה יצאה 0.\n\nאם הביט השני הוא 1 אז קופצים אם התוצאה יצאה שלילית.\n\nשים לב שיכול להיות ששני הביטים הם 1, ואז קופצים בכל אחד משני המקרים.\n\nה-JmpCnt מקבל גם את שני הביטים מה-ALU שנותנים את המידע הרלוונטי מתוצאת החישוב:\n\nzr - האם יצא 0\n\nng - האם יצא שלילי\n\nהיציאה של הכרטיס היא ביט אחד שאומר האם לבצע קפיצה.",
      hints: [
        { kind: "text", title: "רמז 1", text: "זה כרטיס חישוב, אין לו שום זיכרון, ואין לו גם מאוד הרבה אפשרויות לקלט. אתה יכול פשוט לפתור אותו עם טבלת אמת, בשיטה הכללית (אתה יכול להציץ בתפריט ההסברים אם שכחת אותה). אבל מצד שני זה די מיותר, אתה יכול גם לנסות לחשוב קצת וזה יחסוך לך זמן." },
        { kind: "text", title: "רמז 2", text: "יש שתי אפשרויות לקפיצה. טפל קודם בכל אחת מהן בנפרד ואז תבין מה עושים עם שתיהן." },
        { kind: "text", title: "רמז 3", text: "• אפשרות קפיצה ראשונה - הביט שאמר האם לקפוץ כשהתוצאה היא 0 הוא 1 והתוצאה היא באמת 0.\n\n• אפשרות קפיצה שנייה - הביט שאמר האם לקפוץ כשהתוצאה היא שלילית הוא 1 והתוצאה היא באמת שלילית.\n\nכל אחת מהאפשרויות האלה אומרת ששני דברים שונים צריכים להתקיים. יש לך כרטיס שבודק האם שני דברים שונים מתקיימים." },
        { kind: "text", title: "רמז 4", text: "אתה יכול להשתמש ב-And עבור כל אחת מהאפשרויות." },
        { kind: "text", title: "רמז 5", text: "אחרי שטיפלת בכל אחת מהאפשרויות, קיבלת 2 ביטים. מספיק שאחד מהם הוא 1 כדי שתהיה קפיצה." },
        { kind: "text", title: "רמז 6", text: "בשביל זה יש לך את Or." }
      ]
    },
    {
      id: "Cont",
      label: "Cont",
      requires: ["JmpCnt"],
      inputs: 1,
      outputs: 1,
      busWidth: 4,
      requirements: "זוהי יחידת הבקרה של המחשב. יש לה כניסה שהיא בס ברוחב 4, שאליה נכנסים 2 הביטים שאומרים לאן לרשום את פלט ה-ALU ושני הביטים שאומרים באילו תנאים לקפוץ.\n\nהיא מקבלת גם את zr ואת ng מה-ALU.\n\nל-Cont יש 4 יציאות שאומרות:\n\n1. האם לרשום ל-D\n\n2. האם לרשום ל-A\n\n3. האם לרשום ל-‎*A‎\n\n4. האם לרשום ל-PC (זאת אומרת - האם לבצע קפיצה)",
      hints: [
        { kind: "text", title: "רמז 1", text: "אתה יכול להשתמש ב-Cont0 שיטפל בנושא רישום התוצאה של ה-ALU, וב-JmpCnt שיטפל בקפיצה." },
        { kind: "text", title: "רמז 2", text: "אל תשכח לפצל את הבס לשני החלקים שרלוונטיים לכל אחד מהתפקידים השונים שלו." }
      ]
    },
    {
      id: "CPU",
      label: "CPU",
      requires: ["PC", "Cont"],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      clocked: true,
      requirements: "זהו המעבד של המחשב. מבחינת כניסות ויציאות הוא זהה למעבד של המחשב הפשוט, אבל התפקוד הפנימי שלו שונה כי הטיפול שלו בפקודה שונה.\n\nיש לו 3 כניסות:\n\n1. הפקודה - בס של 16 ביטים שמכיל את הפקודה שלו. זכור, 12 הביטים הראשונים זו ההוראה של ה-ALU4 שהיה בתוך המעבד, 2 הביטים הבאים אומרים לאן לרשום את התוצאה של ה-ALU4 ושני הביטים האחרונים אומרים באילו תנאים לבצע קפיצה.\n\n2. קלט - בס של 16 ביטים עם מידע שיגיע מהזיכרון. בפועל זה יהיה הבס ‎*A‎.\n\n3. ריסט - כבל בודד שאם הוא 1 המעבד צריך לאפס את התוכן של ה-PC. זה יתבטא בכך שהוא יתחיל את ריצתו מחדש.\n\nיש לו 4 יציאות:\n\n1. התוכן של רגיסטר A - בס של 16 ביטים. יציאה זאת תשמש את הזיכרון בתור כתובת (והזיכרון מתעלם בעצמו מחמשת הביטים הראשונים).\n\n2. התוכן של רגיסטר PC - בס של 16 ביטים. יציאה זאת תשמש את זיכרון התוכנה בתור כתובת, כדי שהוא יוכל לספק לנו את הפקודה לביצוע (וזיכרון התוכנה מתעלם בעצמו מששת הביטים הראשונים).\n\n3. פלט - בס של 16 ביטים עם מידע שיגיע אל הזיכרון. בפועל זה יהיה הבס שיירשם ל-‎*A‎.\n\n4. כבל בודד שיגיד האם אנחנו רושמים ל-‎*A‎.",
      hints: [
        { kind: "text", title: "רמז 1", text: "ה-CPU מאוד דומה ל-CPU0. אתה יכול להתחיל ממנו ואז לראות מה צריך לשנות." },
        {
          kind: "interactive", title: "רמז 2", action: "cpu-restore-cpu0",
          confirmBeforeApply: true, applyLabel: "כן",
          text: "אתה רוצה שאשחזר לך כאן את הבנייה של ה-CPU0? זה ימחק את כל מה שעשית.",
          appliedText: "זאת בניית ה-CPU0. עכשיו תחשוב מה צריך להשתנות בה."
        },
        { kind: "text", title: "רמז 3", text: "צריך להחליף את PC0 ב-PC, את Cont0 ב-Cont ואת ALU3 ב-ALU4" },
        {
          kind: "interactive", title: "רמז 4", action: "cpu-swap-cards",
          confirmBeforeApply: true, applyLabel: "כן",
          text: "אתה רוצה שאחליף את PC0 ב-PC, את Cont0 ב-Cont ואת ALU3 ב-ALU4? זה ימחק את כל מה שעשית.",
          appliedText: "הכרטיסים הוחלפו. שים לב שלכל אחד מהם יש עכשיו כניסות שאף אחד לא מחובר אליהן."
        },
        { kind: "text", title: "רמז 5", text: "שים לב, ה-Cont צריך מידע נוסף ממה שהיה צריך ה-Cont0. הוא גם נותן לך עוד מידע. לאן צריך לחבר אותו?" },
        { kind: "text", title: "רמז 6", text: "גם ה-PC צריך עוד מידע בנוסף למה שהיה צריך ה-PC0. מאיפה משיגים אותו?" }
      ]
    },
    {
      id: "Computer",
      label: "Computer",
      requires: ["CPU"],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      clocked: true,
      requirements: "זהו המחשב שלנו. הוא זהה בכניסות וביציאות שלו למחשב הפשוט, אבל הוא מפרש את הפקודות קצת אחרת. הוא משתמש בשני הביטים האחרונים של הפקודה כדי להחליט אם לעשות קפיצה. אם הם 0 אז הוא לא עושה קפיצה, ובכך משחזר בדיוק את הפעולה של המחשב הפשוט.\n\nיש לו 4 כניסות In0, In1, In2, In3 ו-4 יציאות Out0, Out1, Out2, Out3. אלו הם הפורטים של הזיכרון, שמאפשרים לנו לכתוב ולקרוא לרגיסטרים המיוחדים בזיכרון.\n\nיש לו גם כניסת reset שמאפשרת לנו לאפס את הרגיסטר PC ובכך לגרום למחשב להתחיל לבצע את רשימת הפקודות מהתחלה.\n\nבנוסף יש למחשב שתי כניסות לצורך כתיבה לזיכרון התוכנה:\n\n1. Prg-Adr\n\n2. Prg\n\nשתיהן בסים ברוחב 16: הראשונה אומרת לאיזו כתובת בזיכרון התוכנה אנחנו רוצים לכתוב, והשנייה מחזיקה את הפקודה אותה אנחנו רוצים לכתוב. המחשב מתעלם משתי כניסות אלה, אלא אם כן יש מתח בריסט. כך שבשביל לשנות לו את התוכנה שהוא מריץ אנחנו נצטרך לעצור אותו.\n\nכשכניסת ה-reset מכובה המחשב מבצע את הפקודות שבזיכרון התוכנה שנמצא בו אחת אחת לפי פורמט הפקודה של המחשב שדיברנו עליו קודם.",
      hints: [
        { kind: "text", title: "רמז 1", text: "זה ממש אותו הדבר כמו המבנה של Computer0, רק צריך להחליף את המעבד הישן CPU0 במעבד החדש CPU." },
        { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש בתפריט הפרקים כדי לחזור לפרק 4.2 בו בנינו את ה-Computer0." }
      ]
    }
  ];

  // The build tasks of chapter 4.1, to be done in this order. None of them has a
  // workspace yet — opening one says so.
  const SIMPLE_COMPUTER_TASKS = [
    {
      id: "PC0",
      label: "PC0",
      requires: [],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      clocked: true,
      // Read once, when the task opens: what a program counter IS.
      intro: [
        "ה-PC0 הוא רגיסטר שמכיל בכל רגע את הכתובת בזיכרון התוכנה בה נמצאת הפקודה שאנחנו מבצעים. מכיוון שהמחשב הפשוט צריך לבצע את כל הפקודות שהוא מקבל לפי הסדר, אז ה-PC0 צריך להכיל מספר שגדל ב-1 בכל שלב. הזמן בין שלב לשלב זה הזמן שלקח למחשב שלנו לרשום דברים. האנשים של ג'ון דאגו לכך שכל הפליפ-פלופים רושמים דברים בו זמנית, והזמן בין רישום לרישום מספיק כדי שכל החישובים יקרו.",
        "לכן, כל מה שה-PC0 צריך לעשות זה להוסיף 1 לתוכן שלו ולרשום אותו מחדש בתוכו שוב ושוב.",
        "אנחנו גם ניתן לו כניסה שאפשר לאפס את מה שכתוב בו, כדי לאתחל את המחשב."
      ],
      requirements: "ל-PC0 יש יציאה אחת שהיא בס בגודל 16, שאומרת מה רשום בו. בכל שלב המספר הזה גדל ב-1.\n\nיש לו גם כניסת reset מלמעלה: אם היא 1 אז התוכן של ה-PC מתאפס במקום לגדול ב-1.",
      hints: [
        { kind: "text", title: "רמז 1", text: "ה-PC0 הוא קודם כל רגיסטר. הכנס לתוכו רגיסטר ואז תחשוב איך אתה מפעיל אותו נכון." },
        { kind: "text", title: "רמז 2", text: "ה-PC0 כל הזמן משתנה, לכן אנחנו צריכים כל הזמן לכתוב משהו לרגיסטר. אנחנו רוצים שהבקרה שלו תהיה כל הזמן מופעלת. אתה יכול להשתמש במקור מתח כדי לעשות את זה באופן קבוע." },
        { kind: "text", title: "רמז 3", text: "תתעלם לרגע מהריסט. תחשוב מה אתה צריך להכניס לרגיסטר?" },
        { kind: "text", title: "רמז 4", text: "אתה צריך להכניס לו בכל רגע את היציאה שלו ועוד 1. יש לך כרטיס שיודע לחבר 1." },
        { kind: "text", title: "רמז 5", text: "אם טיפלת בהוספת 1 לרגיסטר עכשיו צריך לטפל בריסט. הכניסה של הרגיסטר היא לא תמיד היציאה שלו ועוד 1. לפעמים היא פשוט צריכה להיות 0. יש לך כרטיס שיודע לבחור בין אפשרויות." },
        { kind: "text", title: "רמז 6", text: "אתה יכול להשתמש ב-Mux16 כדי לבחור בין האפשרויות. זכור, כניסה לא מחוברת אומרת שיש 0 בכניסה." }
      ]
    },
    {
      id: "Cont0",
      label: "Cont0",
      // Open from the moment the note is: Cont0 has nothing to do with the
      // counter, so there is no reason to build PC0 first.
      requires: [],
      inputs: 1,
      outputs: 3,
      busWidth: 2,
      requirements: "זוהי יחידת הבקרה של המחשב הפשוט. יש לה כניסה שהיא בס ברוחב 2, שאליה נכנסים 2 הביטים שאומרים לאן לרשום את פלט ה-ALU. הם מייצגים מספר בינארי מ-0 עד 3 שמשמעותו:\n\n0 - לא רושמים לשום מקום\n\n1 - רושמים ל-D\n\n2 - רושמים ל-A\n\n3 - רושמים ל-\u200e*A\u200e\n\nל-Cont0 יש 3 יציאות שאומרות:\n\n1. האם לרשום ל-D\n\n2. האם לרשום ל-A\n\n3. האם לרשום ל-\u200e*A\u200e",
      hints: [
        { kind: "text", title: "רמז 1", text: "אתה צריך לבחור לאן להוציא את המתח. יש לך 4 אפשרויות. יש לך כרטיס שמוציא את הכניסה שלו לאחת מ-4 אפשרויות." },
        { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש ב-Dmux4way." },
        { kind: "text", title: "רמז 3", text: "חשוב מה אתה צריך לשים בכניסה של ה-Dmux4way." },
        { kind: "text", title: "רמז 4", text: "אתה יכול להשתמש במקור מתח כדי להכניס ל-Dmux4way 1 באופן קבוע." }
      ]
    },
    {
      id: "CPU0",
      label: "CPU0",
      // The processor is made OF the counter and the control unit, and a card of
      // this chapter is only in the palette once it is built — so both must be.
      requires: ["PC0", "Cont0"],
      inputs: 3,
      outputs: 4,
      busWidth: 16,
      clocked: true,
      requirements: "זהו המעבד של המחשב הפשוט. יש לו 3 כניסות:\n\n1. הפקודה - בס של 16 ביטים שמכיל את הפקודה שלו. זכור, 12 הביטים הראשונים זו ההוראה של ה-ALU4 שהיה בתוך המעבד, 2 הביטים הבאים אומרים לאן לרשום את התוצאה של ה-ALU4 ושני הביטים האחרונים מיותרים.\n\n2. קלט - בס של 16 ביטים עם מידע שיגיע מהזיכרון. בפועל זה יהיה הבס \u200e*A\u200e.\n\n3. ריסט - כבל בודד שאם הוא 1 המעבד צריך לאפס את התוכן של ה-PC0. זה יתבטא בכך שהוא יתחיל את ריצתו מחדש.\n\nיש לו 4 יציאות:\n\n1. התוכן של רגיסטר A - בס של 16 ביטים. יציאה זאת תשמש את הזיכרון בתור כתובת (והזיכרון מתעלם בעצמו מחמשת הביטים הראשונים).\n\n2. התוכן של רגיסטר PC - בס של 16 ביטים. יציאה זאת תשמש את זיכרון התוכנה בתור כתובת, כדי שהוא יוכל לספק לנו את הפקודה לביצוע (וזיכרון התוכנה מתעלם בעצמו מששת הביטים הראשונים).\n\n3. פלט - בס של 16 ביטים עם מידע שיגיע אל הזיכרון. בפועל זה יהיה הבס שיירשם ל-\u200e*A\u200e.\n\n4. כבל בודד שיגיד האם אנחנו רושמים ל-\u200e*A\u200e.",
      // Hint 6 is the interactive one: it wipes the board and lays down the ALU3
      // with its three data inputs already wired (D, A and the *A input), which
      // is the part the learner keeps getting wrong. Everything after it builds
      // on that layout, so the "top register is D" note comes back as its
      // applied message.
      hints: [
        { kind: "text", title: "רמז 1", text: "ה-CPU0 מורכב מ-3 חלקים: ה-ALU, הרגיסטרים ויחידת הבקרה. תניח אותם תחילה על שולחן העבודה, זה יעזור לך לחשוב." },
        { kind: "text", title: "רמז 2", text: "אתה צריך 2 רגיסטרים רגילים ואת הרגיסטר PC. לגבי ה-ALU, אתה יכול להסתפק ב-ALU3, אתה לא צריך את היציאות הנוספות של ה-ALU4." },
        { kind: "text", title: "רמז 3", text: "אתה יכול קודם לטפל ב-PC0. הוא נפרד מכל השאר." },
        { kind: "text", title: "רמז 4", text: "ה-PC0 צריך להיות מחובר ליציאת ה-PC ול-reset." },
        { kind: "text", title: "רמז 5", text: "אתה זוכר שה-ALU תמיד פועל על אותן הכניסות. אתה יכול לחבר אותו באופן קבוע אליהן." },
        {
          kind: "interactive",
          title: "רמז 6",
          action: "cpu0-place-alu",
          confirmBeforeApply: true,
          applyLabel: "כן",
          text: "אתה רוצה שאחבר את הכניסות של ה-ALU לאן שצריך? (זה ימחק את כל מה שעשית).",
          appliedText: "שים לב: הרגיסטר העליון הוא D והתחתון הוא A."
        },
        { kind: "text", title: "רמז 7", text: "עכשיו חשוב מה צריך להיות בכניסת ההוראות של ה-ALU?" },
        { kind: "text", title: "רמז 8", text: "אלו הם 12 הביטים הראשונים של הפקודה. אתה צריך לפצל את הפקודה." },
        { kind: "text", title: "רמז 9", text: "לאן צריכה להיות מחוברת יציאת ה-ALU?" },
        { kind: "text", title: "רמז 10", text: "שים לב. את היציאה אתה צריך לחבר לכל מקום שאולי תרצה לכתוב אליו. זה שהיציאה מחוברת למשהו זה לא אומר שבהכרח תכתוב לשם. בשביל זה יש ביט בקרה שקובע האם אתה כותב. כך שאתה יכול לחבר את היציאה באופן קבוע לכל היעדים. זכור שאחד היעדים הוא הפלט של ה-CPU0 שילך לזיכרון. אתה יכול להשתמש בנעצים כדי שיהיה לך נוח יותר לפרוס את הכבלים." },
        { kind: "text", title: "רמז 11", text: "עכשיו אתה צריך להחליט לאן אתה באמת כותב. בשביל זה יש לך את יחידת הבקרה. חשוב מה צריכה להיות הכניסה שלה." },
        { kind: "text", title: "רמז 12", text: "הכניסה של יחידת הבקרה היא 2 הביטים בפקודה שאחרי הוראות ה-ALU. אתה יכול לשלוף אותם מאותו המפצל שפיצל את הפקודה." },
        { kind: "text", title: "רמז 13", text: "היציאות של יחידת הבקרה בדיוק אומרות לך על כל אחד מהיעדים האם אתה רושם אליו. חבר אותם לכניסות הבקרה של היעדים האלה." }
      ]
    },
    {
      id: "Computer0",
      label: "Computer0",
      // The whole machine: the processor, plus the program memory. Prg is NOT
      // listed: it belongs to an earlier stage (3.5) and is assumed to be in the
      // warehouse the way every earlier card is — the learner may have skipped it
      // or cleared its note, and that must not lock the computer.
      requires: ["CPU0"],
      inputs: 7,
      outputs: 4,
      busWidth: 16,
      clocked: true,
      requirements: "זהו המחשב הפשוט. יש לו 4 כניסות In0, In1, In2, In3 ו-4 יציאות Out0, Out1, Out2, Out3. אלו הם הפורטים של הזיכרון, שמאפשרים לנו לכתוב ולקרוא לרגיסטרים המיוחדים בזיכרון.\n\nיש לו גם כניסת reset שמאפשרת לנו לאפס את הרגיסטר PC0 ובכך לגרום למחשב להתחיל לבצע את רשימת הפקודות מהתחלה.\n\nבנוסף יש למחשב שתי כניסות לצורך כתיבה לזיכרון התוכנה:\n\n1. Prg-Adr\n\n2. Prg\n\nשתיהן בסים ברוחב 16: הראשונה אומרת לאיזו כתובת בזיכרון התוכנה אנחנו רוצים לכתוב, והשנייה מחזיקה את הפקודה אותה אנחנו רוצים לכתוב. המחשב מתעלם משתי כניסות אלה, אלא אם כן יש מתח בריסט. כך שבשביל לשנות לו את התוכנה שהוא מריץ אנחנו נצטרך לעצור אותו.\n\nכשכניסת ה-reset מכובה המחשב מבצע את הפקודות שבזיכרון התוכנה שנמצא בו אחת אחת לפי פורמט הפקודה של המחשב שדיברנו עליו קודם.",
      // Nothing new is BUILT here — the three cards are already built — so the
      // hints walk the wiring in the order it makes sense to lay it: processor
      // to the two memories first (inputs, then outputs), then the ports, then
      // the program-writing inputs, and the reset last, because it is the one
      // wire with two jobs.
      hints: [
        { kind: "text", title: "רמז 1", text: "המחשב בנוי משלושה חלקים: זיכרון הדאטה, זיכרון התוכנה והמעבד. תניח אותם תחילה על אזור העבודה, זה יעזור לך לחשוב." },
        { kind: "text", title: "רמז 2", text: "בשלב הראשון התעלם מהקלט והפלט של המחשב (מהכניסות והיציאות שלו) ותתרכז באיך אתה מחבר את המעבד לשני הזיכרונות." },
        { kind: "text", title: "רמז 3", text: "תסתכל על הכניסות של המעבד. מה צריך להתחבר לשם?" },
        { kind: "text", title: "רמז 4", text: "המעבד צריך את הפקודה שהוא מבצע, הוא מקבל אותה מזיכרון התוכנה. הוא גם צריך את התוכן של הרגיסטר בזיכרון שהוא עובד עליו. הוא מקבל אותו מזיכרון הדאטה." },
        { kind: "text", title: "רמז 5", text: "עכשיו תסתכל על היציאות של המעבד. לאן הן צריכות להתחבר?" },
        { kind: "text", title: "רמז 6", text: "המעבד \"יודע\" מה הכתובת של הפקודה שהוא צריך לקרוא. הוא צריך להעביר אותה לזיכרון התוכנה כדי שזה יוכל לתת לו את הפקודה הנכונה. המעבד גם \"יודע\" על איזה רגיסטר בזיכרון הדאטה הוא צריך לעבוד, הוא צריך לשלוח את המידע הזה לזיכרון, כדי לקבל ממנו את תוכן הרגיסטר. לבסוף המעבד גם צריך לכתוב משהו לזיכרון, הוא צריך להעביר לזיכרון את מה שהוא צריך לכתוב, הוא גם צריך לתת לזיכרון את כבל הבקרה שאומר האם צריך לכתוב בו." },
        { kind: "text", title: "רמז 7", text: "עכשיו כשחיברת את המעבד לזיכרונות, אתה יכול להתפנות לטפל בקלט והפלט. זכור. אנחנו מתקשרים עם המחשב דרך ה-RAM, אז אנחנו צריכים לחבר את הכניסות והיציאות שלו ל-RAM." },
        { kind: "text", title: "רמז 8", text: "אנחנו גם רוצים לאפשר כתיבה בזיכרון התוכנה. חבר את הכניסות המתאימות של המחשב לכניסות של זיכרון התוכנה." },
        { kind: "text", title: "רמז 9", text: "כעת אפשר לטפל ב-reset. זכור, יש לו תפקיד כפול: לאתחל את ה-CPU ולאפשר כתיבה לזיכרון התוכנה." }
      ]
    }
  ];

  // ---- The 4.1 exercise: run these instructions in your head ---------------
  // The sheet shows only the BITS. `code` is the pseudo-code they were dictated
  // in (kept here as the reference for the encoding, never shown to the learner)
  // and `after` is the state of the processor's registers and of the first three
  // memory registers once that instruction has run, starting from all zeros.
  //
  // The encoding is the one chapter 4.1 teaches: [12 bits ALU][2 bits where to
  // write][2 unused]. In the ALU field bit 1 = 0 means "emit this number", and
  // bit 1 = 1 means compute — bit 6 picking D+A or D+*A and bits 7-12 the ALU1
  // operation. Destination 1 = A, 2 = D, 3 = *A.
  //
  // `hints` are that instruction's hints, in the order they unlock (bit numbers
  // count from 1, leftmost):
  //   mark       - the bits this hint is about, lit up on the page while it is open
  //   above      - a merged cell written in the row above those bits
  //   fill       - answers this hint fills in for the learner, per column
  //   applyLabel - makes the hint a question: the annotation (or the filling-in)
  //                only happens once the learner presses the button.
  const INSTRUCTION_SHEET = [
    { code: "A=1",     bits: "0000000000011000", after: { A: 1, D: 0,  R0: 0, R1: 0,  R2: 0 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU לא מחשב אלא מוציא את ההוראה שלו.", mark: [1, 1] },
        { title: "רמז 2", text: "הביטים האלה הם המספר 1.", mark: [2, 12] },
        { title: "רמז 3", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "1" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 4", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-A.", mark: [13, 14], above: { from: 13, to: 14, text: "→ A" } },
        { title: "רמז 5", text: "אל תשכח שבהתחלה כל הרגיסטרים הם 0." },
        { title: "רמז 6", text: "למלא לך את הרגיסטרים שלא השתנו ב-0?", fill: { D: 0, R0: 0, R1: 0, R2: 0 }, applyLabel: "כן, מלא" }
      ] },
    { code: "*A=17",   bits: "0000000100011100", after: { A: 1, D: 0,  R0: 0, R1: 17, R2: 0 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU לא מחשב אלא מוציא את ההוראה שלו.", mark: [1, 1] },
        { title: "רמז 2", text: "הביטים האלה הם המספר 17.", mark: [2, 12] },
        { title: "רמז 3", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "17" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 4", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-*A — הרגיסטר בזיכרון שכתובתו היא התוכן של A.", mark: [13, 14], above: { from: 13, to: 14, text: "→ *A" } },
        { title: "רמז 5", text: "חוץ מהרגיסטר *A שאר הרגיסטרים הם באותו המצב בדיוק." },
        { title: "רמז 6", text: "רוצה שאעתיק את המצב של הרגיסטרים שלא השתנו?", fill: { A: 1, D: 0, R0: 0, R2: 0 }, applyLabel: "כן, העתק" }
      ] },
    { code: "D=5",     bits: "0000000001010100", after: { A: 1, D: 5,  R0: 0, R1: 17, R2: 0 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU לא מחשב אלא מוציא את ההוראה שלו.", mark: [1, 1] },
        { title: "רמז 2", text: "הביטים האלה הם המספר 5.", mark: [2, 12] },
        { title: "רמז 3", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "5" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 4", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-D.", mark: [13, 14], above: { from: 13, to: 14, text: "→ D" } },
        { title: "רמז 5", text: "רוצה שאעתיק לך את המצב של כל הרגיסטרים שלא השתנו?", fill: { A: 1, R0: 0, R1: 17, R2: 0 }, applyLabel: "כן, העתק" }
      ] },
    { code: "D=*A-D",  bits: "1000011110000100", after: { A: 1, D: 12, R0: 0, R1: 17, R2: 0 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU כן מבצע חישוב.", mark: [1, 1] },
        { title: "רמז 2", text: "הביט הזה אומר שהחישוב נעשה על הכניסה הראשונה והשלישית של ה-ALU אלו הם D ו-*A.", mark: [6, 6] },
        { title: "רמז 3", text: "רוצה לבדוק על שולחן העבודה מה עושים ששת הביטים האלה? אתה יכול לבדוק את זה עם ALU1", mark: [7, 12], pointsAtWorkbench: true },
        { title: "רמז 4", text: "ששת הביטים האלה מסמנים חיסור, ובסדר הזה: הכניסה השלישית פחות הראשונה, כלומר *A פחות D.", mark: [7, 12] },
        { title: "רמז 5", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "*A-D" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 6", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-D.", mark: [13, 14], above: { from: 13, to: 14, text: "→ D" } },
        { title: "רמז 7", text: "רוצה שאעתיק לך את המצב של כל הרגיסטרים שלא השתנו?", fill: { A: 1, R0: 0, R1: 17, R2: 0 }, applyLabel: "כן, העתק" }
      ] },
    { code: "A=2",     bits: "0000000000101000", after: { A: 2, D: 12, R0: 0, R1: 17, R2: 0 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU לא מחשב אלא מוציא את ההוראה שלו.", mark: [1, 1] },
        { title: "רמז 2", text: "הביטים האלה הם המספר 2.", mark: [2, 12] },
        { title: "רמז 3", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "2" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 4", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-A.", mark: [13, 14], above: { from: 13, to: 14, text: "→ A" } },
        { title: "רמז 5", text: "רוצה שאעתיק לך את המצב של כל הרגיסטרים שלא השתנו?", fill: { D: 12, R0: 0, R1: 17, R2: 0 }, applyLabel: "כן, העתק" }
      ] },
    { code: "*A=D",    bits: "1000000011001100", after: { A: 2, D: 12, R0: 0, R1: 17, R2: 12 },
      hints: [
        { title: "רמז 1", text: "הביט הזה אומר שה-ALU כן מבצע חישוב.", mark: [1, 1] },
        { title: "רמז 2", text: "הביט הזה אומר שהחישוב נעשה על הכניסה הראשונה והשנייה של ה-ALU אלו הם D ו-A.", mark: [6, 6] },
        { title: "רמז 3", text: "רוצה לבדוק על שולחן העבודה מה עושים ששת הביטים האלה? אתה יכול לבדוק את זה עם ALU1", mark: [7, 12], pointsAtWorkbench: true },
        { title: "רמז 4", text: "ששת הביטים האלה אומרים ל-ALU להוציא את הכניסה הראשונה שלו כמו שהיא, כלומר את D.", mark: [7, 12] },
        { title: "רמז 5", text: "לכתוב לך מה משמעות ההוראה של ה-ALU מעל הביטים של ההוראה שלו?", above: { from: 1, to: 12, text: "D" }, applyLabel: "כן, כתוב לי" },
        { title: "רמז 6", text: "הביטים האלה אומרים שהיציאה של ה-ALU נרשמת ל-*A — הרגיסטר בזיכרון שכתובתו היא התוכן של A.", mark: [13, 14], above: { from: 13, to: 14, text: "→ *A" } },
        { title: "רמז 7", text: "רוצה שאעתיק לך את המצב של כל הרגיסטרים שלא השתנו?", fill: { A: 2, D: 12, R0: 0, R1: 17 }, applyLabel: "כן, העתק" }
      ] }
  ];

  const INSTRUCTION_SHEET_COLUMNS = ["A", "D", "R0", "R1", "R2"];

  // The reference window on the exercise page ("מבנה הפקודה"): a strip of the
  // sixteen squares of the instruction, with the fields of one level coloured in
  // and explained underneath. Each page zooms one level deeper — the word, the
  // ALU3/4 instruction inside it, the ALU2 instruction inside THAT, and the ALU1
  // instruction at the bottom. `from`/`to` are bit numbers (1 = leftmost).
  const INSTRUCTION_GUIDE = [
    {
      title: "מבנה הפקודה",
      groups: [
        { from: 1, to: 12, text: "הוראת ה-ALU4" },
        {
          from: 13, to: 14, text: "יעד ה-ALU4:",
          options: ["0 - אין", "1 - D", "2 - A", "3 - *A"]
        },
        { from: 15, to: 16, text: "ביטים מיותרים" }
      ]
    },
    {
      title: "מבנה הוראת ה-ALU3/4",
      groups: [
        {
          from: 1, to: 1, text: "האם לבצע חישוב:",
          options: ["0 - לא לבצע, להוציא את ההוראה עצמה", "1 - לבצע לפי הוראת ה-ALU2"]
        },
        { from: 2, to: 5, text: "כשלא מבצעים חישוב אלה חלק מהמספר שיוצא; כשמבצעים חישוב הם לא בשימוש" },
        { from: 6, to: 12, text: "הוראת ה-ALU2 (כשהוא מופעל)" }
      ]
    },
    {
      title: "מבנה הוראת ה-ALU2",
      groups: [
        {
          from: 6, to: 6, text: "על אילו כניסות לעבוד:",
          options: ["0 - הראשונה והשנייה (D ו-A)", "1 - הראשונה והשלישית (D ו-*A)"]
        },
        { from: 7, to: 12, text: "הוראת ה-ALU1 — הפעולה עצמה" }
      ]
    },
    {
      title: "מבנה הוראת ה-ALU1",
      groups: [
        {
          from: 7, to: 7, text: "האם לבצע Not על התוצאה בסוף:",
          options: ["0 - לא", "1 - כן"]
        },
        {
          from: 8, to: 8, text: "הפעולה על שתי הכניסות המוכנות:",
          options: ["0 - And", "1 - חיבור"]
        },
        {
          from: 9, to: 10, text: "ההכנה של הכניסה השנייה:",
          options: ["הביט הראשון - Not", "הביט השני - איפוס (מתבצע לפני ה-Not)"]
        },
        {
          from: 11, to: 12, text: "ההכנה של הכניסה הראשונה:",
          options: ["הביט הראשון - Not", "הביט השני - איפוס (מתבצע לפני ה-Not)"]
        }
      ]
    }
  ];

  // ---- Chapter 4.3, the programming page ----------------------------------
  // The task itself, shown first as a dialog and then as the window in the
  // bottom-left corner of the page.
  const PROGRAM_TASK = {
    title: "משימת תכנות",
    text: "כתוב תוכנה שמכפילה את הערך בקלט In0 ב-8 וכותבת את התוצאה ב-Out0.",
    // Its row in "דירוגי תוכנה": the shorter the program that passes, the better.
    rankId: "prg-times-8",
    rankLabel: "כפל ב-8"
  };

  // The little "טיפ" window beside the page, telling the learner the squares can
  // be marked and copied.
  const PROGRAM_TIP = {
    title: "טיפ",
    text: "אתה יכול לסמן ולהשתמש בפעולות העתק הדבק כדי להעתיק פקודות שכבר כתבת."
  };

  // "מבנה הזיכרון": which address is what, as the RAM card was built in 3.4 —
  // 0-1023 are its own registers, and the eight ports sit above them: the first
  // four are the ones the computer writes out through, the last four the ones it
  // can only read from.
  const PROGRAM_MEMORY_MAP = {
    title: "מבנה הזיכרון",
    items: [
      "כתובות 0-1023  --  זיכרון",
      "כתובות 1024-1027  --  פלט",
      "כתובות 1028-1031  --  קלט"
    ]
  };

  // "פקודות חישוב ב-ALU1": the six control bits (bits 7-12 of the instruction)
  // for the calculations worth having at hand. Bit by bit, left to right:
  // Not on the result, And/plus, Not and zero on the second input, Not and zero
  // on the first — exactly the ALU1 the learner built in 2.6.
  const ALU1_OPERATIONS = {
    title: "פקודות חישוב ב-ALU1",
    columns: ["הפעולה", "ההוראה"],
    rows: [
      { op: "0", bits: "010101" },
      { op: "1", bits: "111111" },
      { op: "-1", bits: "010111" },
      { op: "D", bits: "001100" },
      { op: "X", bits: "000011" },
      { op: "Not D", bits: "101100" },
      { op: "Not X", bits: "100011" },
      { op: "-D", bits: "111100" },
      { op: "-X", bits: "110011" },
      { op: "D+1", bits: "111110" },
      { op: "X+1", bits: "111011" },
      { op: "D-1", bits: "011100" },
      { op: "X-1", bits: "010011" },
      { op: "D+X", bits: "010000" },
      { op: "D-X", bits: "110010" },
      { op: "X-D", bits: "111000" },
      { op: "D And X", bits: "000000" },
      { op: "D Or X", bits: "101010" }
    ],
    // The order the assembler offers them in on the page: the ones this
    // chapter's task actually needs first, the rest under them.
    menuOrder: ["D+X", "D", "X", "D+1", "X+1", "0", "1", "-1", "D-1", "X-1",
      "D-X", "X-D", "-D", "-X", "Not D", "Not X", "D And X", "D Or X"],
    noteTitle: "הערה:",
    note: [
      "D הוא הכניסה הראשונה של ה-ALU (כי היא תמיד תהיה התוכן של רגיסטר D).",
      "X מסמן את הכניסה השנייה (הוא יכול להיות A או *A לפי הביט הסמוך לפקודת ה-ALU)."
    ]
  };

  // "בדיקה במכונה": the test bench that loads the program into the machine and
  // runs it on its own. The numbers it feeds In0, and what Out0 is supposed to
  // hold afterwards — the task asks for the input times eight.
  //
  // The machine is beaten once for every line of the program (there are no
  // jumps, so that is exactly how long a run takes); `cycles` is only a ceiling,
  // so a program that somehow never ends cannot hang the bench.
  const PROGRAM_TEST = {
    title: "בדיקת התוכנה",
    cycles: 50,
    inputs: [3, 7, 12],
    multiplier: 8,
    passTitle: "הבדיקה הצליחה",
    passText: "התוכנה החזירה את התוצאה הנכונה בכל הבדיקות.",
    failTitle: "הבדיקה נכשלה",
    emptyText: "עדיין לא כתבת אף פקודה.",
    // The stages of the animation, and what is written under it at each one.
    captions: {
      load: "התוכנה נטענת לזיכרון התוכנה",
      connect: "הריסט מתנתק, והממירים מתחברים ל-In0 ול-Out0",
      run: "המכונה רצה",
      check: "בודקים את Out0",
      reset: "הריסט מתחבר מחדש, והמספר בקלט מתחלף"
    }
  };

  // The helper task, reached from the fourth hint: the same page, the same
  // benches, one instruction's worth of work — move In0 across to Out0. Its
  // program is kept apart from the main one, so neither loses its place.
  const PROGRAM_HELPER_TASK = {
    title: "משימת עזר",
    text: "כתוב תוכנה שמעבירה את התוכן של In0 ל-Out0."
  };

  const PROGRAM_HELPER_TEST = {
    title: "בדיקת התוכנה",
    cycles: 50,
    inputs: [3, 7, 12],
    multiplier: 1,
    passTitle: "הבדיקה הצליחה",
    passText: "התוכנה החזירה את התוצאה הנכונה בכל הבדיקות.",
    failTitle: "הבדיקה נכשלה",
    emptyText: "עדיין לא כתבת אף פקודה.",
    captions: {
      load: "התוכנה נטענת לזיכרון התוכנה",
      connect: "הריסט מתנתק, והממירים מתחברים ל-In0 ול-Out0",
      run: "המכונה רצה",
      check: "בודקים את Out0",
      reset: "הריסט מתחבר מחדש, והמספר בקלט מתחלף"
    }
  };

  // The hints for the main task, in the order they unlock — one more after each
  // failed run of the machine, the way every hinted task in the game works.
  // The fourth one offers the helper task rather than telling anything.
  const PROGRAM_HINTS = [
    { title: "רמז 1", text: "להכפיל מספר ב-8 זה לחבר אותו ל-0 8 פעמים." },
    { title: "רמז 2", text: "תנסה לכתוב תוכנה שמחברת את IN0 לרגיסטר D." },
    { title: "רמז 3", text: "אתה יכול לבדוק מה קורה כשאתה לוחץ על בדיקה ידנית." },
    {
      title: "רמז 4",
      text: "אם הסתבכת עם הרמז הקודם, אתה יכול לעבור למשימת עזר.",
      offerHelper: true
    },
    { title: "רמז 5", text: "אם הסתדרת עם ההוספה ל-D, עכשיו אתה יכול לבצע את זה שוב ושוב 8 פעמים. אתה יכול לעשות פעולות העתק הדבק כדי לא לכתוב סתם את אותו הדבר שוב ושוב." },
    { title: "רמז 6", text: "בסוף כל מה שנשאר לך זה להעביר את התוכן של D ל-Out0." },
    { title: "רמז 7", text: "בשביל זה תצטרך לקבוע את הערך של A להיות הכתובת של Out0. אתה יכול לבדוק מהי, בחלונית מבנה הזיכרון משמאל." }
  ];

  // The helper task's hints. The fourth one writes the two instructions itself
  // rather than describing them — the words are the instruction bit by bit:
  //   A=1028  ->  0 10000000100 10 00
  //   D=*A    ->  1 0000 1 000011 01 00
  const PROGRAM_HELPER_HINTS = [
    { title: "רמז 1", text: "אתה לא יכול להעביר ישירות תכנים בין רגיסטרים בזיכרון. זאת מכיוון שבכל רגע אתה קורא רק דבר אחד בזיכרון. תנסה להעביר למקום אחר כשלב ביניים." },
    { title: "רמז 2", text: "בדיוק בשביל דברים כאלה נועד רגיסטר D. תתחיל מלהעביר את In0 לרגיסטר D." },
    { title: "רמז 3", text: "בשביל זה תצטרך לקבוע את A להיות הכתובת של In0. אתה יכול לבדוק מהי בחלונית מבנה הזיכרון מצד שמאל. אחרי זה פשוט תצטרך לשים את ‎*A ב-D." },
    {
      title: "רמז 4",
      text: "רוצה שאני אכתוב לך את 2 הפקודות שמעבירות את In0 לרגיסטר D (זה ימחק את כל מה שכתבת)?",
      writes: ["0100000001001000", "1000010000110100"]
    },
    { title: "רמז 5", text: "עכשיו נשאר להעביר את D ל-Out0. זה מאוד דומה למה שכבר עשית." }
  ];

  // A solution is walked ON THE PAGE: each step writes its instruction into the
  // program table and marks it. `bits` is that instruction, bit by bit; `parts`
  // (the helper task only) then walks the instruction's own fields, marking the
  // bits each field is written on.
  const PROGRAM_HELPER_SOLUTIONS = [
    {
      title: "פתרון",
      lead: "אין דרך להעביר מספר מרגיסטר אחד בזיכרון לאחר בפקודה אחת — בכל רגע קוראים רק כתובת אחת. לכן עוברים דרך D.",
      steps: [
        {
          code: "1028 → A",
          bits: "0100000001001000",
          text: "כתובת הקלט In0 היא 1028. נכניס אותה ל-A, וכך ‎*A הוא הקלט.",
          parts: [
            { from: 1, to: 1, text: "הביט הראשון הוא 0, ולכן ה-ALU לא מחשב כלום אלא פשוט מוציא את המספר שכתוב בפקודה עצמה." },
            { from: 2, to: 12, text: "אחד עשר הביטים האלה הם המספר עצמו — 1028 בבינארית. את זה האסמבלר מילא במקומנו." },
            { from: 13, to: 14, text: "שני הביטים האלה אומרים לאן הולכת התוצאה. כאן 10, כלומר לרגיסטר A." }
          ]
        },
        {
          code: "*A → D",
          bits: "1000010000110100",
          text: "לוקחים את הקלט אל רגיסטר D. עכשיו המספר נמצא במעבד, לא בזיכרון.",
          parts: [
            { from: 1, to: 1, text: "הפעם הביט הראשון הוא 1: ה-ALU מחשב." },
            { from: 6, to: 6, text: "הביט הזה בוחר על מי ה-ALU עובד חוץ מ-D. הוא 1, כלומר X הוא ‎*A — מה שנמצא בכתובת שב-A." },
            { from: 7, to: 12, text: "ששת הביטים האלה הם ההוראה ל-ALU. זאת ההוראה שאומרת לו להוציא את X כמו שהוא." },
            { from: 13, to: 14, text: "01 — התוצאה נכתבת לרגיסטר D." }
          ]
        },
        {
          code: "1024 → A",
          bits: "0100000000001000",
          text: "עכשיו משנים את A לכתובת הפלט, 1024. הקלט כבר לא נחוץ לנו — הוא שמור ב-D.",
          parts: [
            { from: 1, to: 1, text: "שוב 0: הפקודה מוציאה מספר, לא מחשבת." },
            { from: 2, to: 12, text: "המספר הפעם הוא 1024 — הכתובת של Out0." },
            { from: 13, to: 14, text: "10, כלומר שוב לרגיסטר A." }
          ]
        },
        {
          code: "D → *A",
          bits: "1000000011001100",
          text: "כותבים את מה שב-D לכתובת שב-A, כלומר ל-Out0.",
          parts: [
            { from: 1, to: 1, text: "1: ה-ALU מחשב." },
            { from: 7, to: 12, text: "ההוראה שאומרת ל-ALU להוציא את D כמו שהוא." },
            { from: 13, to: 14, text: "11 — וזה החלק החשוב: התוצאה נכתבת ל-‎*A, כלומר לכתובת שנמצאת ב-A." }
          ]
        }
      ],
      close: "ארבע פקודות: שתיים כדי לקרוא, שתיים כדי לכתוב. רגיסטר D הוא תחנת הביניים."
    }
  ];

  const PROGRAM_SOLUTIONS = [
    {
      title: "פתרון",
      lead: "להכפיל ב-8 זה לחבר את המספר ל-0 שמונה פעמים. נעשה בדיוק את זה.",
      steps: [
        { code: "1028 → A", bits: "0100000001001000", text: "כתובת הקלט In0 היא 1028. קודם כל נכניס אותה ל-A, כדי שנוכל לקרוא את הקלט עם ‎*A." },
        { code: "0 → D", bits: "0000000000000100", text: "מתחילים מאפס. אין כאן שום חישוב — הפקודה פשוט מוציאה את המספר 0 וכותבת אותו ל-D. זה המספר שאליו נחבר את הקלט שוב ושוב." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור הראשון. עכשיו ב-D יש את הקלט פעם אחת." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור השני. ב-D יש פי 2." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור השלישי. ב-D יש פי 3." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור הרביעי. ב-D יש פי 4. שים לב שכל השורות האלה זהות — אפשר לסמן אחת ולהדביק אותה שוב ושוב במקום לכתוב אותה מחדש." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור החמישי. ב-D יש פי 5." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור השישי. ב-D יש פי 6." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור השביעי. ב-D יש פי 7." },
        { code: "D+*A → D", bits: "1000010100000100", text: "החיבור השמיני. ב-D יש פי 8 — זאת התשובה." },
        { code: "1024 → A", bits: "0100000000001000", text: "סיימנו לחשב. כתובת הפלט Out0 היא 1024, ולכן נכניס אותה ל-A." },
        { code: "D → *A", bits: "1000000011001100", text: "כותבים את מה שב-D לכתובת שנמצאת ב-A, כלומר ל-Out0. זהו." }
      ],
      close: "שתים עשרה פקודות, שמונה מהן אותה פקודה בדיוק."
    },
    {
      title: "פתרון נוסף",
      lead: "אפשר להגיע לאותה תשובה מהר יותר: במקום לחבר שמונה פעמים, נכפיל פי 2 שלוש פעמים.",
      steps: [
        { code: "1028 → A", bits: "0100000001001000", text: "שוב מתחילים מכתובת הקלט." },
        { code: "*A → D", bits: "1000010000110100", text: "הפעם פשוט לוקחים את הקלט אל D." },
        { code: "D → A", bits: "1000000011001000", text: "וזה הטריק: מעתיקים את D גם ל-A. עכשיו אותו מספר נמצא בשני הרגיסטרים." },
        { code: "D+A → D", bits: "1000000100000100", text: "מחברים את D לעצמו, ובזה הכפלנו אותו. ב-D יש פי 2." },
        { code: "D → A", bits: "1000000011001000", text: "שוב מעתיקים את D ל-A..." },
        { code: "D+A → D", bits: "1000000100000100", text: "...ומכפילים שוב. ב-D יש פי 4." },
        { code: "D → A", bits: "1000000011001000", text: "ובפעם השלישית." },
        { code: "D+A → D", bits: "1000000100000100", text: "ב-D יש פי 8 — אחרי שלוש הכפלות בלבד." },
        { code: "1024 → A", bits: "0100000000001000", text: "כתובת הפלט." },
        { code: "D → *A", bits: "1000000011001100", text: "וכותבים אותה החוצה." }
      ],
      close: "‎8 = 2 בחזקת 3, ולכן שלוש הכפלות הספיקו. אילו היינו צריכים להכפיל ב-1024 היינו צריכים עשר הכפלות — במקום 1024 חיבורים."
    }
  ];

  // The assembler: the little fellow standing beside the ALU table on the 4.3
  // page. Clicking him opens his speech bubble; these are its pages.
  // The red teaser above his first page, and the window it opens.
  const ASSEMBLER_TEASER = {
    text: "במציאות אין גמדים שעושים בשבילך את העבודה, אבל יש דבר כזה אסמבלר. לחץ כאן אם אתה רוצה לדעת מה זה",
    dialog: {
      text: "חלק זה של המשחק עדיין לא קיים, אתה יכול בינתיים ללמוד על זה כאן",
      // The word in that sentence that carries the link; the address itself is
      // not written out.
      linkWord: "כאן",
      url: "https://www.youtube.com/watch?v=2iYOb9Uu7Mk"
    }
  };

  const ASSEMBLER_PAGES = [
    [{ p: "שלום, שמי אסמבלר, אני יכול לעזור לך לכתוב את הפקודות בביטים." }],
    [
      { ul: [
        "אם אתה רוצה שה-ALU יבצע חישוב, אז תכתוב 1 בתחילת הפקודה, ואז תוכל לבחור את החישוב שתרצה לבצע ואני אמלא את הביטים המתאימים.",
        "אם תרצה שה-ALU פשוט יחזיר את ההוראה שלו, אז תכתוב 0 בתחילת הפקודה, ואז תוכל לכתוב את המספר בצורה עשרונית ואני אתרגם אותו לבינרית ואמלא את הביטים המתאימים."
      ] },
      { p: "אני גם יכול לעזור לך לבחור על מי ה-ALU יבצע את החישוב (מלבד D)." }
    ],
    [
      { p: "אתה גם יכול לבחור את היעד של ה-ALU ואני אמלא את הביטים המתאימים בפקודה." },
      { p: "אני גם אדאג למלא באפסים את הביטים שלא משפיעים על כלום" }
    ],
    [{ p: "אני יכול גם לעזור לך עם הקפיצות. תבחר את התנאי לקפיצה ואני אמלא לך את הביטים המתאימים." }],
    [{ p: "אני יכול גם לרשום בשבילך את יעד הקפיצה. שים לב שמשמאל לפקודות שלך יש מקום לשים תגיות. אתה יכול לשים תגית ליד כל שורה, וכשאתה תרצה לכתוב את מספר השורה בפקודות שלך, אתה יכול למלא במקום זה את שם התגית ואני כבר אדאג למלא את המספר המתאים. תמיד עדיף להשתמש בתגיות ולא במספרי שורות. כך כשאתה תזיז את השורה למקום אחר, אני אעבור על כל המקומות שאתה משתמש בתגית ואשנה את המספרים." }],
    [
      { p: "רק אל תספר לג'ון שאני עוזר לך. הוא לא אוהב שאנשים מתעצלים. הוא רוצה שאנשים יכתבו בעצמם את הביטים" }
    ]
  ];

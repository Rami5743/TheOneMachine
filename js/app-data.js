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
        "בסופו של דבר הצליח פון-נוימן לממש את החזון של בבג', טיורינג ושלו, ובנה מחשב אלקטרוני. אבל זה לקח עוד 10 שנים. המחשבים האלקטרוניים לא רק החליפו את המחשבים האנושיים, הם הפכו לאחד הכלים המרכזיים בעולם המודרני. מלבד המחשבים האישיים המקיפים אותנו, היום יש מחשבים כמעט בכל מכשיר אלקטרוני. אפשר רק לדמיין איפה היינו היום אם המהפכה הזאת הייתה קורית 10 שנים קודם.",
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
      id: "Inc",
      label: "Inc",
      requires: [],
      inputs: 1,
      outputs: 1,
      busWidth: 16,
      requirements: "ה-Inc הוא כרטיס עם כניסה אחת ויציאה אחת. הכניסה והיציאה הן בסים ברוחב 16. הכרטיס צריך להוסיף 1 לכניסה ולהוציא את התוצאה."
    },
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
      requirements: "ה-ALU1 הוא כרטיס עם 3 כניסות ויציאה אחת. שתיים מהכניסות והיציאה הן בסים ברוחב 16, הכניסה השלישית היא בס ברוחב 6 והיא כניסת בקרה (מלמעלה).\n\nהכרטיס צריך לבצע פעולה על 2 הכניסות שאינן כניסת הבקרה ולהוציא את התשובה. הפעולה נקבעת לפי כניסת הבקרה:\n\nשני הביטים הראשונים של כניסת הבקרה קובעים איזו הכנה אנחנו עושים לכניסה הראשונה (ההכנה מתבצעת לפי ההוראות של PreperNum). שני הביטים הבאים קובעים איזו הכנה אנחנו עושים לכניסה השנייה. הביט החמישי קובע איזו פעולה אנחנו עושים על תוצאות שתי ההכנות (כמו ב-ALU0). הביט השישי (והאחרון) קובע האם מוציאים את התוצאה כמו שהיא או מבצעים עליה NOT לפני כן (אם הוא 1 — מבצעים NOT).\n\nהערה: כשמפצלים בס, הביט הראשון שלו למעלה והאחרון למטה."
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
      { kind: "interactive", title: "רמז 5", action: "inc-build-one", confirmBeforeApply: true, applyLabel: "כן", text: "אדגים בשבילך איך יוצרים בס ברוחב 16 שמייצג את המספר 1 — באמצעות 2 מפצלים בגודל 4: מפצל אחד מאגד 4 ביטים (רק הביט התחתון מחובר למקור מתח) לבס ברוחב 4, ומפצל שני מאגד 4 בסים כאלה (רק הקבוצה התחתונה מחוברת) לבס ברוחב 16. (שים לב: זה ימחק את מה שבנית עד עכשיו)." }
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
    // The ALU0 explanation (chapter 2.6): replays the ALU0 solution then the
    // "what is an ALU" message. Unlocked at the end of that message.
    { id: "alu-ALU0", title: "ALU0" },
    // Enrichment (processor category): the "words & bytes" reading, opened either
    // from the red link on the last bits-range slide or from the explanations menu.
    { id: "words-bytes", title: "מילים ובתים" }
  ];

  // The "מילים ובתים" enrichment text, shown in a scrollable dialog.
  const WORDS_BYTES_PARAGRAPHS = [
    "אכן אפשר לכתוב מספרים מ-0 עד 65,535 עם 16 ביטים, אבל אי אפשר לכתוב כך מספרים שליליים. יש דרך מקובלת לכתוב מספרים שליליים באמצעות ביטים, אם תרצה יהיה על זה הסבר בהמשך. אבל מכיוון של-16 ביטים יש רק 65,536 אפשרויות, אם רוצים לכתוב מספרים שליליים צריך לוותר על חלק מהחיוביים. הדרך המקובלת מאפשרת לכתוב מספרים מ־32,768- ועד 32,767.",
    "אפשר לעבוד עם מספרים גדולים יותר גם אם כל הכרטיסים שלנו יודעים לבצע חישובים רק עם 16 ביטים. פשוט אפשר לחלק את המספר לחלקים ולבצע את החישובים עם כל חלק בנפרד. הסיבה לבחירה לעבוד עם 16 ביטים היא שהמספר 16 בעצמו הוא חזקה של 2. וזה הופך אותו ליותר נוח לעבודה, למרות שזה ממש לא הכרחי. החזקה הקודמת של 2 היא 8, ו-8 ביטים יתנו לנו רק 256 אפשרויות. זה ממש מעט, לא רק בשביל מספרים, אלא בשביל עוד דברים (כמו למשל הוראות שנרצה להעביר למחשב), לכן עברנו לחזקה הבאה שהיא 16.",
    "המחשב הראשון שבנה ג'ון פון-נוימן במציאות (בשנת 1952) עבד עם 40 ביטים. מחשבים מודרניים עובדים בדרך כלל עם 64 ביטים. אלה מחולקים ליחידות של 8 ביטים כל אחת. יחידות אלה מכונות בייט (בעברית בית). רצף הביטים שאיתם המחשב יודע לבצע פעולות נקרא מילה. כך שבמחשבים מודרניים מילה היא בדרך כלל 8 בייטים. המחשב גם מטפל ביחידות קטנות יותר. לדוגמה, הדרך המקובלת לשמור אות היא על ידי בייט אחד. למטרות שונות משתמשים במספרים בעלי מספר בייטים שונה. יש מספרים של 2 בייט, 4 בייט ו-8 בייט. אולם כמעט ולא משתמשים ביחידות שאינן מספר שלם של ביטים (למעט ברכיבים הכי בסיסיים בחומרה – הצ'יפים מהם בנוי המחשב).",
    "לכן, היחידה הבסיסית למדידת נפח אחסון מידע היא בייט. זאת יחידה מאוד קטנה. 1024 בייט נקראים קילו-בייט, 1024 קילו-בייט נקראים מגה-בייט (בערך מיליון בייט), 1024 מגה-בייט נקראים גיגה-בייט (או ג'יגה-בייט; בערך מיליארד בייט), 1024 גיגה-בייט נקראים טרה-בייט (בערך טריליון בייט; זה בערך נפח האחסון של מחשב מודרני), 1024 טרה-בייט נקראים פטה-בייט (בערך קוודריליון בייט), וכן הלאה. מחוץ לעולם המחשבים המילים קילו, מגה, גיגה, וכו' בעלות משמעות מעט שונה. הן אומרות אלף, מיליון, מיליארד וכו'. יצרני הרד-דיסקים (הרכיב במחשב ששומר מידע לטווח ארוך) לעיתים משתמשים במילים האלה כמו שמקובל מחוץ לעולם המחשבים כשהם מתארים את נפח ההרד-דיסק שלהם, כדי להציג אותו יותר גדול ממה שהוא באמת. בשנות ה-90 כאשר היצרנים התחרו מי יהיה הראשון שייצר הרד-דיסק ביתי בנפח גיגה-בייט, הם הכריזו שהרד-דיסק שלהם הוא כזה כשלמעשה היו בו רק מיליארד בייט (שזה בערך 7% פחות). גם היום לפעמים אומרים על הרד-דיסק שיש בו טרה-בייט כשלמעשה יש בו רק טריליון בייט (שזה בערך 9% פחות)."
  ];

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

  // Chapter 2.4 component monologues, shown when the learner clicks the two new
  // crate hotspots in the 2.4 worktable. Each is a single speech bubble: `intro`
  // text, then the component's schematic symbol inline, then `outro` text.
  const BUS_MONOLOGUE = {
    intro: "שלום, אני בס. אני כבל רחב שמאגד כמה כבלים. על שולחן העבודה אני נראה כך:",
    outro: "המספר מציין את מספר הכבלים שאני מורכב מהם. אפשר לפצל אותי לכבלים בודדים או לבסים קטנים יותר באמצעות מפצל."
  };

  const SPLITTER_MONOLOGUE = {
    intro: "שלום, אני מפצל. אני נועדתי כדי לפצל בסים. על שולחן העבודה אני נראה כך:",
    outro: "יש לי שני צדדים. לצד אחד מחברים בס, ומהצד השני יוצאים מספר כבלים או בסים. אפשר לשנות את מספר הבסים (או הכבלים). אני תמיד מפצל את הבס שווה בשווה. אם הופכים אותי אפשר להשתמש בי לכיוון השני – אני מחבר כמה בסים שווים (או כבלים בודדים) לבס אחד רחב יותר."
  };

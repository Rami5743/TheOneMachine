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
      description: "ה־NOT הוא כרטיס עם כניסה אחת ויציאה אחת. הוא מוציא את ההפך ממה שנכנס אליו. אם נכנס אליו מתח הוא לא מוציא מתח, ואם לא נכנס אליו מתח הוא מוציא מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false], output: true },
        { inputs: [true], output: false }
      ]
    },
    {
      id: "And",
      label: "And",
      inputs: 2,
      description: "ה־AND הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח רק אם שתי הכניסות מקבלות מתח. בכל מצב אחר הוא לא מוציא מתח. הנה טבלת האמת שלו.",
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
      description: "ה־OR הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח אם לפחות אחת מהכניסות מקבלת מתח. הוא לא מוציא מתח רק אם שתי הכניסות כבויות. הנה טבלת האמת שלו.",
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
      description: "ה־XOR הוא כרטיס עם שתי כניסות ויציאה אחת. הוא מוציא מתח אם בדיוק אחת משתי הכניסות מקבלת מתח. אם שתיהן זהות, הוא לא מוציא מתח. הנה טבלת האמת שלו.",
      rows: [
        { inputs: [false, false], output: false },
        { inputs: [false, true], output: true },
        { inputs: [true, false], output: true },
        { inputs: [true, true], output: false }
      ]
    },
    {
      id: "AND3way",
      label: "AND3way",
      inputs: 3,
      description: "ה־AND3way הוא כרטיס עם שלוש כניסות ויציאה אחת. הוא מוציא מתח רק אם כל שלוש הכניסות מקבלות מתח. הנה טבלת האמת שלו.",
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
      label: "OR4way",
      inputs: 4,
      description: "ה־OR4way הוא כרטיס עם ארבע כניסות ויציאה אחת. הוא מוציא מתח אם לפחות אחת מארבע הכניסות מקבלת מתח. הוא לא מוציא מתח רק אם כל הכניסות כבויות. הנה טבלת האמת שלו.",
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
      title: "האם אתה  מסכים לעזור"
    },
    helpRefusal: {
      size: "large",
      ariaLabel: "סירוב לעזור",
      paragraphs: [
        "חבל מאוד. פון-נוימן לא יצליח לבנות את המחשב לבד בזמן הפרויקט. את הפצצה הגרעינית הם יצליחו לבנות, אבל מאוחר מדי. גרמניה הנאצית תיכנע כמה חודשים קודם לכן, אבל לא לפני שהיא תהרוס את אירופה ותרצח כמעט את כל היהודים בה. חלק גדול מהיהודים נרצחו ממש בחודשים האחרונים של המלחמה. אם הפצצה הייתה מוכנה שנה קודם לכן, מותם היה נמנע.",
        "בסופו של דבר הצליח פון-נוימן לממש את החזון של בבג', טיורינג ושלו, ובנה מחשב אלקטרוני. אבל זה לקח עוד 10 שנים. המחשבים האלקטרוניים לא רק החליפו את המחשבים האנושיים, הם הפכו לאחד הכלים המרכזיים בעולם המודרני. מלבד המחשבים האישיים המקיפים אותנו, היום יש מחשבים כמעט בכל מכשיר אלקטרוני. אפשר רק לדמיין איפה היינו היום אם המהפכה הזאת הייתה קורית 10 שנים קודם.",
        "אבל הי, כנראה שיש לך דברים יותר חשובים לעשות...",
        "או שאולי לא.., האם תרצה  לשנות את דעתך?"
      ]
    },
    returnToNandPrompt: {
      size: "small",
      ariaLabel: "חזרה אל NAND",
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
      label: "MUX",
      inputs: 3,
      // The control input is input #3 (drawn on top of the card); inputs #1/#2
      // are the data inputs on the left. output = control ? input2 : input1.
      controlInputIndex: 2,
      description: "ה-MUX הוא כרטיס עם 3 כניסות ויציאה אחת. אחת הכניסות נמצאת למעלה. היא כניסת הבקרה. היא קובעת איזו מהכניסות \"עוברת\" ליציאה. אם היא 0 אז היציאה צריכה להיות זהה לכניסה הראשונה, ואם היא 1 אז היציאה צריכה להיות זהה לכניסה השנייה. שים לב, כניסת הבקרה היא כניסה לכל דבר. מבחינת הכרטיס אין שום הבדל בינה לשאר הכניסות. אבל כשאנחנו חושבים על פעולת הכרטיס נוח לנו לחשוב עליה בנפרד, כאילו היא לא חלק מהכניסות הרגילות, והיא מגדירה לכרטיס מה לעשות. בפועל היא פשוט אחד הביטים שעליהם מתבצע החישוב שהכרטיס עושה.",
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
    { id: "DMux", label: "DMUX" }
  ];

  const TASK_HINTS = {
    Not: [
      { kind: "text", title: "רמז 1", text: "תנסה להשתמש ב־NAND." },
      { kind: "interactive", title: "רמז 2", action: "place-nand" },
      { kind: "text", title: "רמז 3", text: "אתה יכול לחבר את הכניסה של ה־NOT לשתי רגלי ה־NAND." },
      { kind: "interactive", title: "רמז 4", action: "connect-not-input-to-nand" }
    ],
    And: [
      { kind: "text", title: "רמז 1", text: "תחשוב על הקשר בין AND ל־NAND." },
      { kind: "text", title: "רמז 2", text: "אם NAND נותן תשובה הפוכה מ־AND, אז גם AND נותן תשובה הפוכה מ־NAND." },
      { kind: "text", title: "רמז 3", text: "אתה יכול קודם לבצע NAND על שתי הכניסות ואז לראות איך אתה מטפל בתוצאה." },
      { kind: "interactive", title: "רמז 4", action: "and-place-first-nand" },
      { kind: "interactive", title: "רמז 5", action: "and-place-first-nand-explained", text: "זה נותן תוצאה הפוכה ממה שאתה צריך, עכשיו נותר רק להפוך אותה.", openAfterApply: true }
    ],
    Or: [
      { kind: "text", title: "רמז 1", text: "תחשוב על הקשר בין OR ל־NAND או ל־AND." },
      { kind: "text", title: "רמז 2", text: "כיוון מחשבה 1: OR מוציא 0 רק במקרה אחד. גם NAND מוציא 0 רק במקרה אחד. אולי תשתמש ב־NAND כדי לבנות את OR.\n\nכיוון מחשבה 2: להגיד שאחד משני דברים קורה זה כמו להגיד שזה לא נכון שאף אחד מהם לא קורה." },
      { kind: "text", title: "רמז 3", text: "כיוון מחשבה 1: תחשוב מתי ה־NAND מוציא 0 ומתי ה־OR מוציא 0. מה הקשר בין המקרים?" },
      { kind: "text", title: "רמז 4", text: "כיוון מחשבה 1: מה צריך להכניס ל־NAND כדי שהוא ייתן את התוצאה שה־OR צריך לתת?" },
      { kind: "text", title: "רמז 5", text: "אולי יהיה לך יותר נוח אם תבצע NOT לכל אחת מהכניסות. ככה תוכל לבדוק מתי שתיהן 0." },
      { kind: "interactive", title: "רמז 6", action: "or-connect-inputs-to-not" }
    ],
    Xor: [
      { kind: "text", title: "רמז 1", text: "כיוון מחשבה 1: אתה כבר יודע לדאוג לכך שהכרטיס יוציא 1 רק כאשר לפחות אחת מהכניסות היא 1. ואתה יודע איך לבנות כרטיס שבודק שלא שתי הכניסות הן 1. תנסה לשלב את הדברים.\n\nכיוון מחשבה 2: תנסה להבין מתי XOR צריך לתת 1 ולבנות כרטיס שמטפל בכל אחד מהמקרים האלה בנפרד. בסוף אתה צריך להוציא 1 כאשר אחד מהמקרים מתקיים." },
      { kind: "interactive", title: "רמז 2", action: "xor-slides" }
    ],
    AND3way: [
      { kind: "text", title: "רמז 1", text: "נסה להשתמש ב־AND." },
      { kind: "text", title: "רמז 2", text: "אתה יכול לבדוק האם שתי הכניסות הראשונות הן 1 על ידי AND." },
      { kind: "text", title: "רמז 3", text: "אתה צריך ששתי הכניסות הראשונות יהיו 1 וגם הכניסה השלישית תהיה 1." }
    ],
    OR4way: [
      { kind: "text", title: "רמז 1", text: "עשית כבר את AND3way. זה ממש דומה, רק עם OR במקום AND ו־4 במקום 3." }
    ],
    Mux: [
      { kind: "text", title: "רמז 1", text: "תיזכור שמדובר בחישוב, תבין באיזה אפשרויות יוצא 1 וטפל בהן." },
      { kind: "text", title: "רמז 2", text: "אתה יכול להשתמש בשיטה שג'ון סיפר לך. אם זאת, אפשר קצת לפשט אותה במקרה זה." },
      { kind: "text", title: "רמז 3", text: "תנסה להכין טבלת אמת. יש סה\"כ שלוש כניסות, לכן יש 8 אפשרויות (4 אם כניסת הבקרה היא 0 ועוד 4 אם כניסת הבקרה היא 1). תנסה לרשום את כולן, ומכל אחת מהן לרשום מה היציאה." },
      { kind: "interactive", title: "רמז 4", action: "mux-fill-inputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עזרה בהכנת טבלת האמת? (אם תלחץ על כן זה ימחק את כל מה שכתבת בטבלה)." },
      { kind: "interactive", title: "רמז 5", action: "mux-fill-outputs", confirmBeforeApply: true, applyLabel: "כן", text: "אתה צריך עוד עזרה עם טבלת האמת?" }
    ]
  };

  const EXPLANATION_ITEMS = [
    { id: "nand-intro", title: "הצגת ה־NAND" },
    { id: "nand-function", title: "איך NAND פועל" },
    { id: "build-nand", title: "איך עושים NAND" },
    { id: "bit-info", title: "מה זה ביט" },
    { id: "truth-table-cards", title: "הכנת כרטיסים מטבלת אמת" }
  ];

  const BIT_EXPLANATION_STEPS = [
    `שים לב, כל הכניסות, היציאות והכבלים שלנו יכולים להיות בשני מצבים: בלי מתח ועם מתח. דבר שיכול להיות בשני מצבים נקרא ביט. ביט הוא היחידה הבסיסית של מידע, וכל הטיפול במידע בעולם המחשבים עובד על ביטים. באופן עקרוני אפשר לבנות מכונות חישוב שלא מבוססות על חשמל אלא על תופעה אחרת, זרם מים למשל. במחשבים כאלה הביטים ייוצגו על ידי משהו שאינו מתח חשמלי, גובה או לחץ המים למשל. הבחירה במתח חשמלי התבררה כהכי יעילה והכי קלה לבנייה מעשית. פעם אפילו ניסו לבנות מחשבים שלא מבוססים על ביטים אלא על דברים שיכולים להיות ביותר מצבים; ספרה למשל יכולה להיות בעשרה מצבים. זה התברר כמסרבל ולא נוח. ביטים הרבה יותר פשוטים לתפעול, ובסופו של דבר, אם יש מספיק ביטים, אפשר לעבד כל מידע.

AND ו־NOT הם כרטיסים שמבצעים חישוב.`,
    `כל הכרטיסים שנבנה בזמן הקרוב יבצעו חישוב כלשהו. יהיה להם מספר כניסות ומספר יציאות, וגם אלה וגם אלה הן ביטים. היציאות תלויות בכניסות לפי חוקיות מסוימת. את החוקיות אפשר לתאר בטבלת אמת או במילים. אתה תראה שכל חישוב אפשר לבצע עם שילוב מתאים של NAND-ים. המשימה שלך תהיה למצוא את השילובים המתאימים. תוכל להשתמש לא רק ב־NAND-ים אלא גם בכרטיסים קודמים, אבל גם אלה עשויים בסופו של דבר מ־NAND-ים.`
  ];

  const XOR_HINT_SLIDES = [
    "assets/hints/xor/1.svg",
    "assets/hints/xor/2.svg",
    "assets/hints/xor/3.svg",
    "assets/hints/xor/4.svg",
    "assets/hints/xor/5.svg"
  ];

  const XOR_HINT_NARRATION = [
    "טבלת האמת של XOR מראה את כל האפשרויות לשתי הכניסות ואת היציאה המתאימה.",
    "אלה שתי השורות שבהן XOR צריך להוציא 1: בדיוק כאשר אחת משתי הכניסות היא 1.",
    "אפשר לחשוב על בניית הכרטיס דרך המקרים שבהם היציאה צריכה להיות 1.",
    "כאן מסומן אחד מהמקרים האלה: הכניסה הראשונה היא 0 והכניסה השנייה היא 1, ולכן היציאה היא 1.",
    "זהו סיכום הרעיון: משתמשים בטבלת האמת כדי לזהות את המקרים הרצויים, ואז בונים כרטיס שמוציא 1 בדיוק במקרים האלה."
  ];

  const NAND_MONOLOGUE_TEXTS = [
    "כפי שבטח שמת לב, אני מוציא מתח ביציאה בכל מצב אלא אם כן שתי הכניסות שלי מחוברות למתח. אפשר לבדוק האם יש מתח ביציאה אם מחברים אותה למנורה. אפשר לסכם את הפעולה שלי על ידי טבלת אמת:",
    "בכל שורה רואים אפשרות אחת של שתי הכניסות, ומה תהיה היציאה במקרה זה. 0 אומר שאין מתח ו-1 אומר שיש. יש בסך הכול 4 אפשרויות לשתי הכניסות ולכן יש 4 שורות.",
    "קוראים לי NAND כי אני עושה ההפך מאחי AND. הוא מוציא מתח רק אם בשתי הכניסות שלו יש מתח. המילה AND באנגלית אומרת “גם”. ובאמת AND מוציא מתח רק אם גם הכניסה הראשונה וגם הכניסה השנייה מקבלות מתח. ה-N בשם שלי זה קיצור של המילה האנגלית NOT שאומרת “לא”. לכן אני מוציא מתח רק אם AND לא היה מוציא מתח באותו מצב."
  ];

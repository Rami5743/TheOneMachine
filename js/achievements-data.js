// achievements-data.js — the achievements' NAMES and TEXT DESCRIPTIONS, in one
// editable place. Loaded before app.js (same mechanism as app-data.js), so the
// ACHIEVEMENTS global is visible inside app.js. Edit titles/descriptions freely
// here — the trophy ICONS live in js/achievement-icons.js and the unlock LOGIC
// lives in js/app.js.
//
// Each entry: { id, title, description, category }
//   category "progress" -> the left  "השיגי התקדמות" column
//   category "special"  -> the right "השיגים מיוחדים" column
// The `id` ties an entry to its unlock logic and its icon, so keep it stable;
// the `title` and `description` are yours to edit.
const ACHIEVEMENTS = [
  // Progress: milestones along the main storyline.
  { id: "card-creator", title: "יוצר כרטיסים", description: "יצרת את הכרטיס הראשון שלך.", category: "progress" },
  { id: "boolean-engineer", title: "מהנדס בוליאני", description: "השלמת את כל הכרטיסים של פרק 2.2.", category: "progress" },
  { id: "routing-engineer", title: "מהנדס נתובים", description: "השלמת את כל הכרטיסים של פרק 2.3.", category: "progress" },
  { id: "bus-engineer", title: "מהנדס באסים", description: "השלמת את כל המשימות של פרק 2.4.", category: "progress" },
  { id: "calculator", title: "מחשב", description: "השלמת את משימות החשבון שבחוברת.", category: "progress" },
  { id: "arith-engineer", title: "מהנדס חשבון", description: "השלמת את כל משימות הבנייה של פרק 2.5.", category: "progress" },
  // Special: side accomplishments and mastery.
  { id: "equipment-destroyer", title: "משחית ציוד", description: "שרפת Nand.", category: "special" },
  { id: "precise-engineer", title: "מהנדס מדויק", description: "בנית כרטיס נכון בניסיון הראשון.", category: "special" },
  { id: "precise-boolean-engineer", title: "מהנדס בוליאני מדויק", description: "השלמת את כל הכרטיסים של פרק 2.2 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-routing-engineer", title: "מהנדס נתובים מדויק", description: "השלמת את כל הכרטיסים של פרק 2.3 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-bus-engineer", title: "מהנדס באסים מדויק", description: "השלמת את כל המשימות של פרק 2.4 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-arith-engineer", title: "מהנדס חשבון מדויק", description: "השלמת את כל משימות הבנייה של פרק 2.5 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "thorough-engineer", title: "מהנדס יסודי", description: "ניקית התקדמות בפתק משימות וביצעת מחדש משימה שכבר השלמת.", category: "special" },
  { id: "precise-calc", title: "מחשב מדויק", description: "פתרת חישוב נכון בניסיון הראשון.", category: "special" },
  { id: "thorough-calc", title: "מחשב יסודי", description: "חזרת ופתרת בהצלחה משימת חישוב בחוברת, אחרי שכבר השלמת את כולן.", category: "special" },
  { id: "very-thorough-calc", title: "מחשב יסודי מאוד", description: "חזרת ופתרת בהצלחה את כל משימות החישוב בחוברת, אחרי שכבר השלמת את כולן.", category: "special" },
  { id: "thorough-precise-calc", title: "מחשב יסודי ומדויק", description: "פתרת את כל משימות החישוב של פרק 2.5 בניסיון הראשון.", category: "special" },
  { id: "card-inventor", title: "ממציא כרטיסים", description: "יצרת כרטיס חדש בפעם הראשונה.", category: "special" },
  { id: "card-saver", title: "שומר כרטיסים", description: "שמרת כרטיס לדיסק הקשיח.", category: "special" },
  { id: "card-necromancer", title: "טוען כרטיסים", description: "טענת כרטיס מהדיסק הקשיח.", category: "special" },
  { id: "connected", title: "מחובר", description: "התחברת עם חשבון Google.", category: "special" },
  { id: "progress-saver", title: "שומר", description: "שמרת את ההתקדמות שלך למחשב.", category: "special" },
  { id: "progress-necromancer", title: "מעלה מן האוב", description: "טענת התקדמות שמורה מהמחשב.", category: "special" },
  { id: "useful-inventor", title: "ממציא שימושי", description: "השתמשת בכרטיס מ\"הכרטיסים שלי\" כדי להשלים בהצלחה משימת יצירת כרטיס.", category: "special" },
  { id: "scholar", title: "למדן", description: "חזרת לאחד ההסברים מתפריט ההסברים.", category: "special" },
  { id: "curious", title: "סקרן", description: "הקלקת על קישור מאחד העצמים שלא משתתפים במשחק.", category: "special" }
];

if (typeof module !== "undefined" && module.exports) module.exports = { ACHIEVEMENTS };

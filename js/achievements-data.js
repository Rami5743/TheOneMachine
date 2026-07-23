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
  { id: "card-creator", title: "יוצר כרטיסים", description: "יצרת כרטיס Not.", category: "progress" },
  { id: "boolean-engineer", title: "מהנדס בוליאני", description: "השלמת את כל הכרטיסים של פרק 2.2.", category: "progress" },
  { id: "routing-engineer", title: "מהנדס נתובים", description: "השלמת את כל הכרטיסים של פרק 2.3.", category: "progress" },
  { id: "bus-engineer", title: "מהנדס באסים", description: "השלמת את כל המשימות של פרק 2.4.", category: "progress" },
  { id: "calculator", title: "מחשב", description: "השלמת את משימות החשבון של פרק 2.5.", category: "progress" },
  { id: "arith-engineer", title: "מהנדס חשבון", description: "השלמת את כל הכרטיסים של פרק 2.5.", category: "progress" },
  // Special: side accomplishments and mastery.
  { id: "equipment-destroyer", title: "משחית ציוד", description: "שרפת Nand.", category: "special" },
  { id: "precise-engineer", title: "מהנדס מדויק", description: "בנית כרטיס נכון בניסיון הראשון.", category: "special" },
  { id: "precise-boolean-engineer", title: "מהנדס בוליאני מדויק", description: "השלמת את כל הכרטיסים של פרק 2.2 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-routing-engineer", title: "מהנדס נתובים מדויק", description: "השלמת את כל הכרטיסים של פרק 2.3 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-bus-engineer", title: "מהנדס באסים מדויק", description: "השלמת את כל המשימות של פרק 2.4 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "precise-arith-engineer", title: "מהנדס חשבון מדויק", description: "השלמת את כל הכרטיסים של פרק 2.5 בניסיון הראשון, ללא טעויות ורמזים.", category: "special" },
  { id: "thorough-engineer", title: "מהנדס יסודי", description: "ניקית התקדמות בפתק משימות וביצעת מחדש משימה שכבר השלמת.", category: "special" },
  { id: "precise-calc", title: "מחשב מדויק", description: "פתרת חישוב נכון בניסיון הראשון.", category: "special" },
  { id: "thorough-calc", title: "מחשב יסודי", description: "חזרת ופתרת בהצלחה משימת חישוב בחוברת, אחרי שכבר השלמת את כולן.", category: "special" },
  { id: "very-thorough-calc", title: "מחשב יסודי מאוד", description: "חזרת ופתרת בהצלחה את כל משימות החישוב בחוברת, אחרי שכבר השלמת את כולן.", category: "special" },
  { id: "thorough-precise-calc", title: "מחשב יסודי ומדויק", description: "פתרת את כל משימות החישוב של פרק 2.5 בניסיון הראשון.", category: "special" },
  { id: "card-inventor", title: "ממציא כרטיסים", description: "יצרת כרטיס משלך.", category: "special" },
  { id: "card-saver", title: "שומר כרטיסים", description: "שמרת כרטיס לדיסק הקשיח.", category: "special" },
  { id: "card-necromancer", title: "טוען כרטיסים", description: "טענת כרטיס מהדיסק הקשיח.", category: "special" },
  { id: "connected", title: "מחובר", description: "התחברת עם חשבון Google.", category: "special" },
  { id: "progress-saver", title: "שומר", description: "שמרת את ההתקדמות שלך למחשב.", category: "special" },
  { id: "progress-necromancer", title: "מעלה מן האוב", description: "טענת התקדמות שמורה מהמחשב.", category: "special" },
  { id: "useful-inventor", title: "ממציא שימושי", description: "השתמשת בכרטיס מ\"הכרטיסים שלי\" כדי להשלים בהצלחה משימת יצירת כרטיס.", category: "special" },
  { id: "scholar", title: "למדן", description: "חזרת לאחד ההסברים מתפריט ההסברים.", category: "special" },
  { id: "curious", title: "סקרן", description: "הקלקת על קישור מאחד העצמים שלא משתתפים במשחק.", category: "special" }
];

// --- Per-chapter "מדליסט" (medalist) achievements ---------------------------
// Four per chapter, earned from the efficiency-ranking MEDALS (rank 1/2/3) the
// player holds on that chapter's cards. `num` is the chapter number shown in the
// text; `nick` is the chapter's nickname (matches the "מהנדס X" achievements).
// Each entry carries a `medal` descriptor consumed by js/medal-achievements.js:
//   mode "any"     — a medal on any card | "anyGold" — a gold on any card
//   mode "all"     — a medal on every card | "allGold" — a gold on every card
// These are the only DYNAMIC achievements: once earned they stay, but if the
// player later loses the eligibility their title gains a " לשעבר" suffix (see
// renderAchievements); regaining it removes the suffix.
const MEDAL_CHAPTERS = [
  { num: "2.2", nick: "בוליאני", cards: (typeof TASK_DEFS !== "undefined" ? TASK_DEFS : []) },
  { num: "2.3", nick: "נתובים", cards: (typeof ROUTING_TASK_DEFS !== "undefined" ? ROUTING_TASK_DEFS : []) },
  { num: "2.4", nick: "באסים", cards: (typeof BUS_TASK_DEFS !== "undefined" ? BUS_TASK_DEFS : []) },
  { num: "2.5", nick: "חשבון", cards: (typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : []) },
  { num: "2.6", nick: "ALU", cards: (typeof ALU_TASKS !== "undefined" ? ALU_TASKS : []) }
];

const MEDAL_ACHIEVEMENTS = [];
MEDAL_CHAPTERS.forEach(function (ch) {
  var ids = (ch.cards || []).map(function (t) { return t.id; });
  MEDAL_ACHIEVEMENTS.push(
    { id: "medalist-" + ch.num, title: "מדליסט " + ch.nick,
      description: "קיבלת מדליה על כרטיס בפרק " + ch.num, category: "special",
      medal: { mode: "any", cards: ids } },
    { id: "medalist-" + ch.num + "-gold", title: "מדליסט " + ch.nick + " ראשון",
      description: "קיבלת מדלית זהב על כרטיס בפרק " + ch.num, category: "special",
      medal: { mode: "anyGold", cards: ids } },
    { id: "medalist-" + ch.num + "-all", title: "מדליסט " + ch.nick + " יסודי",
      description: "קיבלת מדליה על כל הכרטיסים בפרק " + ch.num, category: "special",
      medal: { mode: "all", cards: ids } },
    { id: "medalist-" + ch.num + "-allgold", title: "מדליסט " + ch.nick + " על",
      description: "קיבלת מדלית זהב על כל הכרטיסים בפרק " + ch.num, category: "special",
      medal: { mode: "allGold", cards: ids } }
  );
});
MEDAL_ACHIEVEMENTS.forEach(function (a) { ACHIEVEMENTS.push(a); });

if (typeof module !== "undefined" && module.exports) module.exports = { ACHIEVEMENTS, MEDAL_ACHIEVEMENTS, MEDAL_CHAPTERS };

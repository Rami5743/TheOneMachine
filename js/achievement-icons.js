// achievement-icons.js — the trophy ICONS for every achievement, in one
// editable place. Loaded before app.js (same mechanism as app-data.js), so
// renderAchievementIcon() is visible inside app.js.
//
// Every icon shares one cup/handles/base silhouette (achievementTrophy) and gets
// its own colour scheme + a distinct emblem SVG. To restyle an achievement, edit
// its `case` below: `top`/`bot` are the cup gradient, `rim`/`handle`/`base` the
// metal, `emblem` the SVG drawn on the cup (coordinate space is the 80×80
// viewBox; the cup interior sits roughly around x 29–51, y 19–40), and optional
// `extra` is drawn on top. To add an achievement's icon, add a `case` for its id;
// ids with no case fall through to the plain gold `default` cup.
//
// The achievements' TEXT lives in js/achievements-data.js; the unlock LOGIC in
// js/app.js.

function achievementTrophy(id, opts) {
  const g = `achv-g-${id}`;
  const rim = opts.rim || "#b98a1e";
  const handle = opts.handle || rim;
  const base = opts.base || rim;
  const defs = `
      <defs>
        <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${opts.top}"/>
          <stop offset="1" stop-color="${opts.bot}"/>
        </linearGradient>
      </defs>`;
  return `<svg class="achv-trophy" viewBox="0 0 80 80" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${defs}
      <path d="M23 17 C9 17 8 35 26 37" fill="none" stroke="${handle}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M57 17 C71 17 72 35 54 37" fill="none" stroke="${handle}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M36 49 H44 V58 H36 Z" fill="${base}"/>
      <path d="M27 58 H53 L56 66 H24 Z" fill="${base}"/>
      <rect x="21" y="66" width="38" height="6.5" rx="2.4" fill="${base}"/>
      <path d="M22 14 H58 V26 C58 42 50 50 40 50 C30 50 22 42 22 26 Z" fill="url(#${g})" stroke="${rim}" stroke-width="2"/>
      <path d="M24 15.5 H56 V18 H24 Z" fill="${rim}" opacity="0.85"/>
      <path d="M26 20 C26 34 31 41 39 44" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.28"/>
      ${opts.emblem || ""}
      ${opts.extra || ""}
    </svg>`;
}

function achvStar(cx, cy, s, fill) {
  return `<g transform="translate(${cx},${cy}) scale(${s})"><path d="M0,-6 L1.76,-1.85 L5.7,-1.85 L2.35,0.7 L3.53,4.85 L0,2.4 L-3.53,4.85 L-2.35,0.7 L-5.7,-1.85 L-1.76,-1.85 Z" fill="${fill}"/></g>`;
}

// The per-stage emblem engraved on a medal's centre plaque (chapter → symbol,
// mirroring the "מהנדס" achievement icons). Drawn in the `ink` colour on a white
// plaque centred at (40,52), so it reads on both gold and silver discs.
const MEDAL_STAGE_EMBLEMS = {
  "2.2": (ink) => // boolean: an AND gate
    `<path d="M37 46 H41 A5.5 5.5 0 0 1 41 57 H37 Z" fill="${ink}"/>
     <g stroke="${ink}" stroke-width="1.8" stroke-linecap="round">
       <line x1="32" y1="49" x2="37" y2="49"/><line x1="32" y1="54" x2="37" y2="54"/>
       <line x1="46.6" y1="51.5" x2="51" y2="51.5"/></g>`,
  "2.3": (ink) => // routing: a multiplexer trapezoid
    `<path d="M36 47 L45 50 V54 L36 57 Z" fill="${ink}"/>
     <g stroke="${ink}" stroke-width="1.7" stroke-linecap="round">
       <line x1="31" y1="49" x2="36" y2="49"/><line x1="31" y1="55" x2="36" y2="55"/>
       <line x1="45" y1="52" x2="50" y2="52"/></g>`,
  "2.4": (ink) => // buses: parallel bus lines
    `<g stroke="${ink}" stroke-width="2.5" stroke-linecap="round">
       <line x1="35" y1="47" x2="35" y2="57"/><line x1="40" y1="47" x2="40" y2="57"/>
       <line x1="45" y1="47" x2="45" y2="57"/></g>`,
  "2.5": (ink) => // arithmetic: a plus
    `<path d="M40 46 V58 M34 52 H46" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  "2.6": (ink) => // ALU: the notched trapezoid schematic symbol
    `<path d="M34 46 L39 46 L40 48.6 L41 46 L46 46 L43 58 L37 58 Z" fill="${ink}"/>`
};

// A laurel wreath framing the medal from below — marks the "all cards" (יסודי /
// על) variants, mastery of the whole chapter.
function medalWreath() {
  // Leaves sit OUTSIDE the disc (radius > 20 from the centre 40,52) so the opaque
  // medal does not cover them; the two branches meet at the bottom.
  const branch = `
    <g fill="#4f9a4a" stroke="#2f6b2c" stroke-width="0.6">
      <path d="M40 77 Q25 76 16 57" fill="none" stroke="#6b4a1e" stroke-width="1.6"/>
      <ellipse cx="33.5" cy="75.5" rx="3.6" ry="1.9" transform="rotate(60 33.5 75.5)"/>
      <ellipse cx="27.5" cy="73" rx="3.8" ry="2" transform="rotate(45 27.5 73)"/>
      <ellipse cx="22.5" cy="69" rx="3.9" ry="2" transform="rotate(28 22.5 69)"/>
      <ellipse cx="18.8" cy="64" rx="3.8" ry="2" transform="rotate(12 18.8 64)"/>
      <ellipse cx="16.4" cy="58.5" rx="3.5" ry="1.9" transform="rotate(-4 16.4 58.5)"/>
    </g>`;
  return `${branch}<g transform="translate(80,0) scale(-1,1)">${branch}</g>`;
}

// A hanging medal for the "מדליסט" (medalist) achievements. `gold` picks the gold
// palette (first-place / זהב) vs a neutral silver disc; `all` adds the laurel
// wreath (every card in the chapter); `chapter` selects the engraved stage emblem.
function achievementMedal({ gold, all, chapter }) {
  const g = `achv-medal-${gold ? "gold" : "silver"}-${chapter || "x"}`;
  const top = gold ? "#ffe07a" : "#eef2f7";
  const bot = gold ? "#d99411" : "#9aa6b5";
  const rim = gold ? "#a9720f" : "#6f7d8c";
  const ink = gold ? "#7a5209" : "#465059";
  const emblem = (MEDAL_STAGE_EMBLEMS[chapter] || (() => ""))(ink);
  return `<svg class="achv-trophy" viewBox="0 0 80 80" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="${g}" cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stop-color="${top}"/>
          <stop offset="1" stop-color="${bot}"/>
        </radialGradient>
      </defs>
      ${all ? medalWreath() : ""}
      <path d="M27 8 L20 40 L33 40 L38 14 Z" fill="#c23b3b"/>
      <path d="M53 8 L60 40 L47 40 L42 14 Z" fill="#2f6bd0"/>
      <circle cx="40" cy="52" r="20" fill="url(#${g})" stroke="${rim}" stroke-width="2.4"/>
      <circle cx="40" cy="52" r="11.5" fill="#fffdf3" stroke="${rim}" stroke-width="1.3"/>
      <path d="M28 44 C30 58 36 63 41 65" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.25"/>
      ${emblem}
    </svg>`;
}

function renderAchievementIcon(id) {
  if (typeof id === "string" && id.indexOf("medalist-") === 0) {
    // id: medalist-<chapter>[-gold|-all|-allgold] → distinct icon per stage+tier.
    const rest = id.slice("medalist-".length);
    const dash = rest.indexOf("-");
    const chapter = dash === -1 ? rest : rest.slice(0, dash);
    const suffix = dash === -1 ? "" : rest.slice(dash + 1);
    return achievementMedal({ chapter, gold: suffix.indexOf("gold") !== -1, all: suffix.indexOf("all") !== -1 });
  }
  switch (id) {
    case "card-creator": // gold cup, a fresh card being made
      return achievementTrophy(id, { top: "#ffdf6b", bot: "#e0a51c", rim: "#b9781a", base: "#c98a12", emblem:
        `<rect x="33" y="20" width="14" height="18" rx="2" fill="#fffdf3" stroke="#b9781a" stroke-width="1.6"/>
           <rect x="35.5" y="23" width="9" height="2.2" rx="1.1" fill="#c98a12"/>
           <rect x="35.5" y="27" width="9" height="2.2" rx="1.1" fill="#e6b64e"/>
           <rect x="35.5" y="31" width="6" height="2.2" rx="1.1" fill="#e6b64e"/>` });
    case "boolean-engineer": // blue cup, an AND gate
      return achievementTrophy(id, { top: "#7db4f2", bot: "#1c4e80", rim: "#153f6b", base: "#1c4e80", handle: "#2f6ba8", emblem:
        `<path d="M33 20 H40 A9 9 0 0 1 40 38 H33 Z" fill="#fffdf3" stroke="#153f6b" stroke-width="1.6"/>
           <line x1="28" y1="25" x2="33" y2="25" stroke="#fffdf3" stroke-width="2.4" stroke-linecap="round"/>
           <line x1="28" y1="33" x2="33" y2="33" stroke="#fffdf3" stroke-width="2.4" stroke-linecap="round"/>
           <line x1="49" y1="29" x2="54" y2="29" stroke="#fffdf3" stroke-width="2.4" stroke-linecap="round"/>` });
    case "routing-engineer": // green cup, a multiplexer
      return achievementTrophy(id, { top: "#79d69a", bot: "#158043", rim: "#0f5e30", base: "#158043", handle: "#2a9c5c", emblem:
        `<path d="M32 19 L47 24 V34 L32 39 Z" fill="#fffdf3" stroke="#0f5e30" stroke-width="1.6"/>
           <line x1="27" y1="24" x2="32" y2="24" stroke="#fffdf3" stroke-width="2.2" stroke-linecap="round"/>
           <line x1="27" y1="29" x2="32" y2="29" stroke="#fffdf3" stroke-width="2.2" stroke-linecap="round"/>
           <line x1="27" y1="34" x2="32" y2="34" stroke="#fffdf3" stroke-width="2.2" stroke-linecap="round"/>
           <line x1="47" y1="29" x2="52" y2="29" stroke="#fffdf3" stroke-width="2.2" stroke-linecap="round"/>` });
    case "calculator": // purple cup, a calculator
      return achievementTrophy(id, { top: "#c79cf0", bot: "#5b2a86", rim: "#45206a", base: "#5b2a86", handle: "#7d43ad", emblem:
        `<rect x="31" y="19" width="18" height="20" rx="2.4" fill="#fffdf3" stroke="#45206a" stroke-width="1.6"/>
           <rect x="33.5" y="21.5" width="13" height="5" rx="1" fill="#c9a3e6"/>
           <g fill="#5b2a86"><circle cx="35.5" cy="30" r="1.4"/><circle cx="40" cy="30" r="1.4"/><circle cx="44.5" cy="30" r="1.4"/><circle cx="35.5" cy="35" r="1.4"/><circle cx="40" cy="35" r="1.4"/><circle cx="44.5" cy="35" r="1.4"/></g>` });
    case "arith-engineer": // orange cup, a "+" adder box (chapter 2.5 build tasks)
      return achievementTrophy(id, { top: "#ffb35c", bot: "#c25a12", rim: "#8f3f0a", base: "#c25a12", handle: "#e07a24", emblem:
        `<rect x="30" y="19" width="20" height="20" rx="3" fill="#fffdf3" stroke="#8f3f0a" stroke-width="1.6"/>
           <path d="M40 23 V35 M34 29 H46" stroke="#c25a12" stroke-width="3" stroke-linecap="round"/>` });
    case "alu-engineer": // steel-blue cup, the ALU notched-trapezoid schematic (chapter 2.6)
      return achievementTrophy(id, { top: "#8ea6c8", bot: "#2b3f5e", rim: "#1d2c44", base: "#2b3f5e", handle: "#425a80", emblem:
        `<path d="M30 20 L37 20 L40 25 L43 20 L50 20 L45 39 L35 39 Z" fill="#fffdf3" stroke="#1d2c44" stroke-width="1.6" stroke-linejoin="round"/>
           <text x="40" y="34" font-size="7.5" font-weight="900" text-anchor="middle" fill="#2b3f5e" font-family="Arial,sans-serif">ALU</text>` });
    case "precise-alu-engineer": // steel-blue cup, ALU trapezoid on a bullseye (2.6 first-try clean)
      return achievementTrophy(id, { top: "#8ea6c8", bot: "#243652", rim: "#f3d27a", base: "#243652", handle: "#425a80", emblem:
        `<circle cx="40" cy="28" r="10" fill="none" stroke="#f3d27a" stroke-width="1.6" opacity="0.85"/>
           <circle cx="40" cy="28" r="6.3" fill="none" stroke="#f3d27a" stroke-width="1.3" opacity="0.6"/>
           <path d="M33 21 L37.5 21 L40 25 L42.5 21 L47 21 L43.5 35 L36.5 35 Z" fill="#fffdf3" stroke="#1d2c44" stroke-width="1.4" stroke-linejoin="round"/>` });
    case "equipment-destroyer": // burnt cup, cracked, with a flame
      return achievementTrophy(id, { top: "#c8492a", bot: "#5f1808", rim: "#3a1206", base: "#4a1608", handle: "#7a2410",
        emblem: `<path d="M40 19 C44 23 44 28 41 31 C43 31 45.5 29 45.5 26 C49 30 48 37 40 38 C32 37 32 30 35.5 27 C35.5 29.5 38 30.5 39 29.5 C36.5 26 38 22 40 19 Z" fill="#ffb038"/><path d="M40 24 C42 27 41.5 30 40 32 C38.5 30 38 27 40 24 Z" fill="#ff6a1e"/>`,
        extra: `<path d="M41 14 L37 25 L43 31 L38 44" fill="none" stroke="#2a0d04" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.75"/>` });
    case "precise-calc": // teal cup, a bullseye target
      return achievementTrophy(id, { top: "#5fd3cf", bot: "#0e6b6b", rim: "#0a5252", base: "#0e6b6b", handle: "#1c9490", emblem:
        `<circle cx="40" cy="28" r="9.5" fill="#fffdf3" stroke="#0a5252" stroke-width="1.6"/>
           <circle cx="40" cy="28" r="6" fill="none" stroke="#1c9490" stroke-width="1.8"/>
           <circle cx="40" cy="28" r="2.4" fill="#e23b3b"/>` });
    case "thorough-calc": // bronze cup, binary "101"
      return achievementTrophy(id, { top: "#e0a066", bot: "#7a4a1e", rim: "#5e3815", base: "#7a4a1e", handle: "#a06a30",
        emblem: `<text x="40" y="34" font-size="17" font-weight="900" text-anchor="middle" fill="#fffdf3" font-family="'Courier New',monospace">101</text>` });
    case "very-thorough-calc": // silver cup, three stars
      return achievementTrophy(id, { top: "#eef2f7", bot: "#93a1b2", rim: "#6f7d8c", base: "#8593a3", handle: "#aab6c4",
        emblem: `${achvStar(31, 30, 0.8, "#ffd351")}${achvStar(40, 26, 1.15, "#ffd351")}${achvStar(49, 30, 0.8, "#ffd351")}` });
    case "thorough-precise-calc": // platinum cup, a rainbow diamond (the ultimate)
      return achievementTrophy(id, { top: "#f4f7fb", bot: "#b3bfcc", rim: "#8794a3", base: "#9aa6b5", handle: "#c2ccd8",
        emblem: `<defs><linearGradient id="achv-gem-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5f6d"/><stop offset="0.4" stop-color="#ffc371"/><stop offset="0.7" stop-color="#3ad1c8"/><stop offset="1" stop-color="#6a8cff"/></linearGradient></defs>
           <path d="M33 22 H47 L51 27 L40 40 L29 27 Z" fill="url(#achv-gem-${id})" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
           <path d="M33 22 L36.5 27 H29 Z M47 22 L43.5 27 H51 Z M36.5 27 H43.5 L40 40 Z" fill="#ffffff" opacity="0.22"/>`,
        extra: `${achvStar(52, 20, 0.5, "#fff2a8")}${achvStar(27, 24, 0.4, "#fff2a8")}` });
    case "card-inventor": // indigo cup, a lightbulb (invention)
      return achievementTrophy(id, { top: "#9aa0f0", bot: "#312e8c", rim: "#26236e", base: "#312e8c", handle: "#4a46b5", emblem:
        `<circle cx="40" cy="26" r="7.5" fill="#fff6c9" stroke="#26236e" stroke-width="1.6"/>
           <rect x="37" y="33" width="6" height="4.5" rx="1" fill="#c7c3f0" stroke="#26236e" stroke-width="1"/>
           <line x1="40" y1="36" x2="40" y2="26" stroke="#e0a51c" stroke-width="1.4"/>
           <g stroke="#ffd351" stroke-width="1.6" stroke-linecap="round"><line x1="40" y1="14" x2="40" y2="17"/><line x1="30" y1="18" x2="32" y2="20"/><line x1="50" y1="18" x2="48" y2="20"/></g>` });
    case "card-saver": // steel cup, a floppy disk saving
      return achievementTrophy(id, { top: "#8fb3d9", bot: "#1e3a5f", rim: "#152a47", base: "#1e3a5f", handle: "#33587f", emblem:
        `<path d="M32 19 H46 L49 22 V38 H32 Z" fill="#fffdf3" stroke="#152a47" stroke-width="1.6"/>
           <rect x="35" y="19" width="8" height="6" fill="#33587f"/>
           <rect x="40" y="20" width="2.5" height="4" fill="#fffdf3"/>
           <rect x="35" y="30" width="11" height="7" rx="1" fill="#33587f"/>
           <path d="M40 40 V44 M36.5 40.5 L40 44 L43.5 40.5" fill="none" stroke="#8fb3d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` });
    case "card-necromancer": // steel cup, a floppy disk with a rising arrow (load — the mirror of card-saver)
      return achievementTrophy(id, { top: "#8fb3d9", bot: "#1e3a5f", rim: "#152a47", base: "#1e3a5f", handle: "#33587f", emblem:
        `<path d="M32 23 H46 L49 26 V41 H32 Z" fill="#fffdf3" stroke="#152a47" stroke-width="1.6"/>
           <rect x="35" y="35" width="8" height="6" fill="#33587f"/>
           <rect x="40" y="36" width="2.5" height="4" fill="#fffdf3"/>
           <rect x="35" y="24" width="11" height="7" rx="1" fill="#33587f"/>
           <path d="M40 21 V15 M36.5 18 L40 15 L43.5 18" fill="none" stroke="#8fb3d9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` });
    case "useful-inventor": // amber cup, a card with a gear
      return achievementTrophy(id, { top: "#f5c065", bot: "#a8560a", rim: "#834209", base: "#a8560a", handle: "#c9791e", emblem:
        `<rect x="31" y="21" width="13" height="17" rx="2" fill="#fffdf3" stroke="#834209" stroke-width="1.6"/>
           <line x1="34" y1="26" x2="41" y2="26" stroke="#c9791e" stroke-width="1.8" stroke-linecap="round"/>
           <line x1="34" y1="30" x2="41" y2="30" stroke="#e6b64e" stroke-width="1.8" stroke-linecap="round"/>
           <g transform="translate(46,23)"><circle r="4.6" fill="#ffcf6b" stroke="#834209" stroke-width="1.2"/><g stroke="#834209" stroke-width="1.6" stroke-linecap="round"><line x1="0" y1="-6.4" x2="0" y2="-4.4"/><line x1="0" y1="6.4" x2="0" y2="4.4"/><line x1="-6.4" y1="0" x2="-4.4" y2="0"/><line x1="6.4" y1="0" x2="4.4" y2="0"/><line x1="-4.5" y1="-4.5" x2="-3.1" y2="-3.1"/><line x1="4.5" y1="4.5" x2="3.1" y2="3.1"/><line x1="4.5" y1="-4.5" x2="3.1" y2="-3.1"/><line x1="-4.5" y1="4.5" x2="-3.1" y2="3.1"/></g><circle r="1.7" fill="#834209"/></g>` });
    case "precise-engineer": // crimson cup, a card with a check
      return achievementTrophy(id, { top: "#e56a8a", bot: "#7a1230", rim: "#5e0d25", base: "#7a1230", handle: "#a11c40", emblem:
        `<rect x="31" y="20" width="18" height="18" rx="2.4" fill="#fffdf3" stroke="#5e0d25" stroke-width="1.6"/>
           <path d="M35 29 L39 33 L46 24" fill="none" stroke="#1a9e4b" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` });
    case "bus-engineer": // deep cyan cup, a ribbon/bus cable
      return achievementTrophy(id, { top: "#57c6d6", bot: "#0d5a6b", rim: "#093f4b", base: "#0d5a6b", handle: "#1a8497", emblem:
        `<rect x="29" y="20" width="22" height="18" rx="2.4" fill="#fffdf3" stroke="#093f4b" stroke-width="1.4"/>
           <g stroke="#1a8497" stroke-width="2.4" stroke-linecap="round"><line x1="33" y1="20.5" x2="33" y2="37.5"/><line x1="37.5" y1="20.5" x2="37.5" y2="37.5"/><line x1="42.5" y1="20.5" x2="42.5" y2="37.5"/><line x1="47" y1="20.5" x2="47" y2="37.5"/></g>` });
    case "precise-boolean-engineer": // royal-blue cup, AND gate on a bullseye
      return achievementTrophy(id, { top: "#8fb8f5", bot: "#173d78", rim: "#f3d27a", base: "#173d78", handle: "#2f63b0", emblem:
        `<circle cx="40" cy="28" r="10" fill="none" stroke="#f3d27a" stroke-width="1.6" opacity="0.85"/>
           <circle cx="40" cy="28" r="6.3" fill="none" stroke="#f3d27a" stroke-width="1.3" opacity="0.6"/>
           <path d="M35 21 H40 A7 7 0 0 1 40 35 H35 Z" fill="#fffdf3" stroke="#123163" stroke-width="1.4"/>
           <line x1="31" y1="25" x2="35" y2="25" stroke="#fffdf3" stroke-width="2"/><line x1="31" y1="31" x2="35" y2="31" stroke="#fffdf3" stroke-width="2"/><line x1="47" y1="28" x2="51" y2="28" stroke="#fffdf3" stroke-width="2"/>` });
    case "precise-routing-engineer": // emerald cup, mux on a bullseye
      return achievementTrophy(id, { top: "#6fd6a0", bot: "#0d6b40", rim: "#f3d27a", base: "#0d6b40", handle: "#1f9660", emblem:
        `<circle cx="40" cy="28" r="10" fill="none" stroke="#f3d27a" stroke-width="1.6" opacity="0.85"/>
           <circle cx="40" cy="28" r="6.3" fill="none" stroke="#f3d27a" stroke-width="1.3" opacity="0.6"/>
           <path d="M35 22 L46 26 V32 L35 36 Z" fill="#fffdf3" stroke="#094d2c" stroke-width="1.4"/>
           <line x1="30" y1="26" x2="35" y2="26" stroke="#fffdf3" stroke-width="1.9"/><line x1="30" y1="32" x2="35" y2="32" stroke="#fffdf3" stroke-width="1.9"/><line x1="46" y1="29" x2="51" y2="29" stroke="#fffdf3" stroke-width="1.9"/>` });
    case "precise-bus-engineer": // teal cup, bus cable on a bullseye
      return achievementTrophy(id, { top: "#5fc8cf", bot: "#0c5560", rim: "#f3d27a", base: "#0c5560", handle: "#188390", emblem:
        `<circle cx="40" cy="28" r="10" fill="none" stroke="#f3d27a" stroke-width="1.6" opacity="0.85"/>
           <circle cx="40" cy="28" r="6.3" fill="none" stroke="#f3d27a" stroke-width="1.3" opacity="0.6"/>
           <g stroke="#fffdf3" stroke-width="2.4" stroke-linecap="round"><line x1="35" y1="22.5" x2="35" y2="33.5"/><line x1="40" y1="22.5" x2="40" y2="33.5"/><line x1="45" y1="22.5" x2="45" y2="33.5"/></g>` });
    case "precise-arith-engineer": // orange cup, a "+" on a bullseye (2.5 build, first-try clean)
      return achievementTrophy(id, { top: "#ffb35c", bot: "#b5510a", rim: "#f3d27a", base: "#b5510a", handle: "#e07a24", emblem:
        `<circle cx="40" cy="28" r="10" fill="none" stroke="#f3d27a" stroke-width="1.6" opacity="0.85"/>
           <circle cx="40" cy="28" r="6.3" fill="none" stroke="#f3d27a" stroke-width="1.3" opacity="0.6"/>
           <path d="M40 23 V33 M35 28 H45" stroke="#fffdf3" stroke-width="2.6" stroke-linecap="round"/>` });
    case "scholar": // warm amber cup, an open book
      return achievementTrophy(id, { top: "#f0c674", bot: "#9a5b16", rim: "#734211", base: "#9a5b16", handle: "#c07d24", emblem:
        `<path d="M40 22 C36 20 32 20 30 21 V37 C32 36 36 36 40 38 Z" fill="#fffdf3" stroke="#734211" stroke-width="1.4"/>
           <path d="M40 22 C44 20 48 20 50 21 V37 C48 36 44 36 40 38 Z" fill="#fdf3df" stroke="#734211" stroke-width="1.4"/>
           <g stroke="#c07d24" stroke-width="1.2" stroke-linecap="round"><line x1="33" y1="25" x2="38" y2="26"/><line x1="33" y1="29" x2="38" y2="30"/><line x1="42" y1="26" x2="47" y2="25"/><line x1="42" y1="30" x2="47" y2="29"/></g>` });
    case "curious": // vivid violet cup, a magnifying glass
      return achievementTrophy(id, { top: "#d59bf0", bot: "#6a1f9c", rim: "#4f1676", base: "#6a1f9c", handle: "#8c33bf", emblem:
        `<circle cx="37.5" cy="26" r="7" fill="#eaf6ff" stroke="#4f1676" stroke-width="1.8"/>
           <circle cx="37.5" cy="26" r="7" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
           <path d="M32.5 20.5 A7 7 0 0 1 40 22.5" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
           <line x1="42.7" y1="31.2" x2="48" y2="37" stroke="#f3d27a" stroke-width="3.4" stroke-linecap="round"/>
           <text x="37.5" y="29.5" font-size="9" font-weight="900" text-anchor="middle" fill="#6a1f9c" font-family="Arial,sans-serif">?</text>` });
    case "thorough-engineer": // slate cup, a redo arrow around a gear
      return achievementTrophy(id, { top: "#b7c2cf", bot: "#485563", rim: "#33414f", base: "#485563", handle: "#6a7787", emblem:
        `<g transform="translate(40,28)"><circle r="4.4" fill="#ffcf6b" stroke="#33414f" stroke-width="1.2"/><g stroke="#33414f" stroke-width="1.5" stroke-linecap="round"><line x1="0" y1="-6.2" x2="0" y2="-4.2"/><line x1="0" y1="6.2" x2="0" y2="4.2"/><line x1="-6.2" y1="0" x2="-4.2" y2="0"/><line x1="6.2" y1="0" x2="4.2" y2="0"/></g><circle r="1.6" fill="#33414f"/></g>
           <path d="M31 20 A11 11 0 1 1 30 33" fill="none" stroke="#fffdf3" stroke-width="2.2" stroke-linecap="round"/>
           <path d="M31 15.5 L31.5 20.5 L26.5 20 Z" fill="#fffdf3"/>` });
    case "connected": // sky-blue cup, a cloud with a check (signed in to the cloud)
      return achievementTrophy(id, { top: "#6fc0f5", bot: "#125f97", rim: "#0d4a76", base: "#125f97", handle: "#2f89cc", emblem:
        `<path d="M33 34 A5 5 0 0 1 34 24 A6.2 6.2 0 0 1 46.5 25 A4.6 4.6 0 0 1 46 34 Z" fill="#fffdf3" stroke="#0d4a76" stroke-width="1.4"/>
           <path d="M35 29 L38.5 32.5 L45 25.5" fill="none" stroke="#1a9e4b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` });
    case "progress-saver": // green cup, a shield (your progress kept safe)
      return achievementTrophy(id, { top: "#7ad98f", bot: "#17843f", rim: "#0f5e2c", base: "#17843f", handle: "#29a55c", emblem:
        `<path d="M40 18 L49 21 V29 C49 35.5 45 39.5 40 41.5 C35 39.5 31 35.5 31 29 V21 Z" fill="#fffdf3" stroke="#0f5e2c" stroke-width="1.6"/>
           <path d="M35.5 29 L39 32.5 L45 24.5" fill="none" stroke="#17843f" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` });
    case "progress-necromancer": // spectral cup, a rising ghost (raise saved progress from the dead)
      return achievementTrophy(id, { top: "#a884e0", bot: "#3d2470", rim: "#2c1a52", base: "#3d2470", handle: "#5b3a9e",
        emblem: `<path d="M32 39 V28 A8 8 0 0 1 48 28 V39 L44.5 35.5 L41 39 L37.5 35.5 Z" fill="#f3f0ff" stroke="#2c1a52" stroke-width="1.4"/>
           <circle cx="37" cy="28" r="1.7" fill="#3d2470"/><circle cx="43" cy="28" r="1.7" fill="#3d2470"/>`,
        extra: `<g stroke="#8fffc9" stroke-width="1.6" stroke-linecap="round" opacity="0.85"><line x1="29" y1="30" x2="26" y2="27"/><line x1="51" y1="30" x2="54" y2="27"/></g>` });
    default:
      return achievementTrophy(id, { top: "#ffdf6b", bot: "#e0a51c", rim: "#b9781a", base: "#c98a12", emblem:
        `<circle cx="40" cy="28" r="8" fill="#fffdf3" stroke="#b9781a" stroke-width="1.6"/>` });
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { achievementTrophy, achvStar, renderAchievementIcon };
}

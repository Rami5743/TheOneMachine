// rankings.js — the "דירוגים" screen. Two groups of tabs:
//
//   דירוגי חומרה — what the player BUILT, one row per card:
//   • "דירוגי יעילות" (default) — ranks by the TOTAL recursive Nand count of the
//     player's build (fewer = more efficient).
//   • "דירוגי מהירות" — ranks by the SERIAL Nand count: the most Nands in series
//     on any input→output path (the critical-path depth; fewer = faster).
//   • "מהירות תכנון" — ranks by DESIGN TIME (seconds): how long the player spent
//     designing the card, plus the creation time of each distinct user card used.
//
//   דירוגי תוכנה — what the player WROTE, one row per programming task:
//   • "אורך תוכנה" — ranks by the LENGTH of the program that passed the machine
//     (fewer instructions = a tighter program).
//
// Each tab is a table: the name | the metric's count | the player's rank among
// registered users | the current record. Clicking a row opens its records page,
// which mirrors the same tabs and opens on the tab you came from.
//
// Loaded BEFORE app.js. createRankings(deps) -> { rankingCards,
//   renderRankingsScreen, renderCardRecordsScreen }.
//   Counts come from state.cardNandCounts (efficiency) and state.cardSerialCounts
//   (speed), written by app.js. Cross-user rank/record come from
//   leaderboardFor(cardId, dim) with dim "counts"|"serial".

function createRankings({ getState, esc, adaptGender, topbar, isRegistered, leaderboardFor, leaderboardRows, getNickname, getTab, getMultibitCards }) {
  const DEFAULT_NICKNAME = "ללא שם";

  // Per-tab configuration: which stored map holds the count, which leaderboard
  // dimension to rank by, and the wording.
  const TABS = {
    efficiency: {
      key: "efficiency", ldim: "counts", label: "דירוגי יעילות",
      countHead: "נאנדים",
      sub: "מספר הנאנדים בבנייה שלך — סך כל הנאנדים שמרכיבים את הכרטיס — ככל שנמוך יותר כך הכרטיס יעיל יותר. לחץ על כרטיס לרשימת השיאים שלו.",
      recordsSub: "רשימת השיאנים — מספר הנאנדים הנמוך ביותר קודם.",
      map: "cardNandCounts"
    },
    speed: {
      key: "speed", ldim: "serial", label: "דירוגי מהירות",
      countHead: "נאנדים בטור",
      sub: "מספר הנאנדים בטור — הכי הרבה נאנדים במסלול אחד מכניסה ליציאה — ככל שנמוך יותר כך הכרטיס מהיר יותר. לחץ על כרטיס לרשימת השיאים שלו.",
      recordsSub: "רשימת השיאנים — מספר הנאנדים בטור הנמוך ביותר קודם.",
      map: "cardSerialCounts"
    },
    design: {
      key: "design", ldim: "design", label: "מהירות תכנון",
      countHead: "זמן תכנון",
      sub: "כמה זמן לקח לך לתכנן את הכרטיס — ככל שמהר יותר, טוב יותר. שימוש בכרטיס מעיצוב אישי מוסיף פעם אחת את זמן ההכנה שלו. לחץ על כרטיס לרשימת השיאים שלו.",
      recordsSub: "רשימת השיאנים — זמן התכנון הקצר ביותר קודם.",
      map: "cardDesignCounts",
      format: formatTime
    },
    // The software side. Its rows are the programming tasks, not the cards.
    software: {
      key: "software", ldim: "program", label: "אורך תוכנה",
      countHead: "פקודות",
      nameHead: "משימה",
      sub: "אורך התוכנה שכתבת — מספר הפקודות שהמכונה הריצה — ככל שקצר יותר כך התוכנה יעילה יותר. לחץ על משימה לרשימת השיאים שלה.",
      recordsSub: "רשימת השיאנים — התוכנה הקצרה ביותר קודם.",
      map: "programCounts",
      rows: "programs"
    },
    // The 5.1 tasks that ANSWER and stop — where the same answer can be reached
    // in very different ways — are also ranked by how long the machine ran and by
    // how much memory the program took. `runtimeOnly` keeps those two tabs to the
    // tasks that carry the measurement; a loop that never stops has no run to
    // measure.
    runtime: {
      key: "runtime", ldim: "runtime", label: "זמן ריצה",
      countHead: "צעדים",
      nameHead: "משימה",
      sub: "כמה פקודות המכונה צריכה לבצע עד שהיא מסיימת את כל מקרי הבדיקה יחד — ככל שפחות כך התוכנה מהירה יותר. לחץ על משימה לרשימת השיאים שלה.",
      recordsSub: "רשימת השיאנים — הריצה הקצרה ביותר קודם.",
      map: "programRuntimeCounts",
      rows: "programs",
      runtimeOnly: true
    },
    space: {
      key: "space", ldim: "memory", label: "מקום בזיכרון",
      countHead: "כתובות",
      nameHead: "משימה",
      sub: "בכמה כתובות בזיכרון התוכנה שלך השתמשה כדי לבצע את כל מקרי הבדיקה — ככל שפחות כך היא חסכונית יותר. הפלטים והקלטים לא נספרים, רק הזיכרון החופשי. לחץ על משימה לרשימת השיאים שלה.",
      recordsSub: "רשימת השיאנים — השימוש החסכוני ביותר בזיכרון קודם.",
      map: "programMemoryCounts",
      rows: "programs",
      runtimeOnly: true
    }
  };

  // The two groups of tabs, and which tabs are in each.
  const GROUPS = [
    { key: "hardware", label: "דירוגי חומרה", tabs: ["efficiency", "speed", "design"] },
    { key: "software", label: "דירוגי תוכנה", tabs: ["software", "runtime", "space"] }
  ];
  const TAB_ORDER = GROUPS.flatMap((g) => g.tabs);
  const activeTab = () => TABS[TAB_ORDER.includes(typeof getTab === "function" && getTab()) ? getTab() : "efficiency"];
  const groupOf = (key) => GROUPS.find((g) => g.tabs.includes(key)) || GROUPS[0];

  // Seconds → m:ss (or h:mm:ss). Used only by the design tab; other tabs render
  // their count as a plain number.
  function formatTime(sec) {
    if (typeof sec !== "number" || !isFinite(sec)) return "—";
    const s = Math.max(0, Math.round(sec));
    const m = Math.floor(s / 60), r = s % 60;
    if (m >= 60) return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
    return `${m}:${String(r).padStart(2, "0")}`;
  }
  // A Nand count reaches five figures on the big cards, so it is written the way
  // numbers are written — 12,345 — while the design tab keeps its own m:ss.
  function withThousands(v) {
    if (typeof v !== "number" || !isFinite(v)) return String(v);
    return Math.round(v).toLocaleString("en-US");
  }
  const fmt = (tab, v) => (tab.format ? tab.format(v) : withThousands(v));

  // The buildable cards, in game order. Nand (the given primitive) is not listed.
  function rankingCards() {
    const rows = [];
    const push = (arr) => {
      (Array.isArray(arr) ? arr : []).forEach((t) => {
        if (t && typeof t.id === "string") rows.push({ id: t.id, label: t.label || t.id });
      });
    };
    push(typeof TASK_DEFS !== "undefined" ? TASK_DEFS : []);
    push(typeof ROUTING_TASK_DEFS !== "undefined" ? ROUTING_TASK_DEFS : []);
    push(typeof BUS_TASK_DEFS !== "undefined" ? BUS_TASK_DEFS : []);
    // The 2.3/2.4 intermediate cards (DMux4Way, Mux4Way16) — real cards the
    // player builds and which the RAM cards are built on. Handed in from app.js.
    push(typeof getMultibitCards === "function" ? getMultibitCards() : []);
    push(typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : []);
    push(typeof ALU_TASKS !== "undefined" ? ALU_TASKS : []);
    push(typeof MEMORY_TASKS !== "undefined" ? MEMORY_TASKS : []); // 3.2 registers
    push(typeof RAM_TASKS !== "undefined" ? RAM_TASKS : []);       // 3.3 RAM
    push(typeof PORTS_TASKS !== "undefined" ? PORTS_TASKS : []);   // 3.4 ports
    push(typeof PRG_TASKS !== "undefined" ? PRG_TASKS : []);       // 3.5 program memory
    // 4.2 — the processor's cards (PC0 / Cont0 / CPU0 / Computer0), the last ones.
    push(typeof SIMPLE_COMPUTER_TASKS !== "undefined" ? SIMPLE_COMPUTER_TASKS : []);
    // 4.4 — the cards that add the conditional jump.
    push(typeof JUMP_TASKS !== "undefined" ? JUMP_TASKS : []);
    return rows;
  }

  // The programming tasks that carry a ranking — one row each, the way a card is
  // a row on the hardware side.
  function rankingPrograms(tab) {
    const rows = [];
    const push = (task) => {
      if (task && task.rankId) rows.push({ id: task.rankId, label: task.rankLabel || task.title || task.rankId });
    };
    // 4.3's single task carries a length but is not timed or measured, so it is
    // only on the first of the three software tabs.
    if (!tab || !tab.runtimeOnly) push(typeof PROGRAM_TASK !== "undefined" ? PROGRAM_TASK : null);
    // 5.1's demonstrations, in the order the note lists them, and then 5.2's
    // task under them — the same order the chapters are played in.
    (typeof DEMO_TASKS !== "undefined" ? DEMO_TASKS : [])
      .concat(typeof CASES_TASKS !== "undefined" ? CASES_TASKS : [])
      .forEach((task) => {
        if (tab && tab.runtimeOnly && !task.rankRuntime) return;
        push(task);
      });
    return rows;
  }

  // Whatever the active tab lists.
  function tabRows(tab) {
    return tab.rows === "programs" ? rankingPrograms(tab) : rankingCards();
  }

  // The player's count for a card in the active metric, or null when undefined.
  function countFor(cardId, tab) {
    if (cardId === "Nand") return 1; // one Nand: 1 total, 1 in series
    const map = getState()[tab.map] || {};
    const v = map[cardId];
    return typeof v === "number" && isFinite(v) ? v : null;
  }

  // Rank 1/2/3 render as gold/silver/bronze medals; other ranks as a plain number.
  function rankCell(rank) {
    if (rank == null) return `<span class="rank-empty">—</span>`;
    if (rank >= 1 && rank <= 3) {
      const kind = rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze";
      return `<span class="rank-medal rank-medal-${kind}" title="מקום ${rank}">${rank}</span>`;
    }
    return `<span class="rank-plain">${rank}</span>`;
  }

  // Two strips: the group above (חומרה / תוכנה), and that group's own tabs under
  // it. Picking a group lands on its first tab.
  function tabsBar(active) {
    const group = groupOf(active);
    const groupBtn = (g) => `
      <button class="rankings-group${g.key === group.key ? " is-active" : ""}" data-action="rankings-tab" data-tab="${g.tabs[0]}" type="button">
        ${esc(g.label)}
      </button>`;
    const btn = (key) => `
      <button class="rankings-tab${key === active ? " is-active" : ""}" data-action="rankings-tab" data-tab="${key}" type="button">
        ${esc(TABS[key].label)}
      </button>`;
    return `
      <div class="rankings-groups" role="tablist">${GROUPS.map(groupBtn).join("")}</div>
      <div class="rankings-tabs" role="tablist">${group.tabs.map(btn).join("")}</div>`;
  }

  function renderRankingsScreen(app) {
    const tab = activeTab();
    const registered = typeof isRegistered === "function" ? Boolean(isRegistered()) : false;
    const rows = tabRows(tab).map((card) => {
      const count = countFor(card.id, tab);
      const countText = count == null ? `<span class="rank-undef">—</span>` : esc(fmt(tab, count));
      const lb = typeof leaderboardFor === "function" ? leaderboardFor(card.id, tab.ldim) : null;
      const rank = lb && typeof lb.rank === "number" ? lb.rank : null;
      const record = lb && typeof lb.record === "number" ? lb.record : null;
      const rankHtml = registered ? rankCell(rank) : `<span class="rank-empty" title="זמין למשתמשים רשומים">—</span>`;
      const recordHtml = record == null ? `<span class="rank-empty">—</span>` : esc(fmt(tab, record));
      return `
        <tr class="rankings-row" role="button" tabindex="0" data-action="open-card-records" data-card-id="${esc(card.id)}" data-card-label="${esc(card.label)}">
          <td class="rank-card-name">${esc(card.label)}</td>
          <td class="rank-count">${countText}</td>
          <td class="rank-rank">${rankHtml}</td>
          <td class="rank-record">${recordHtml}</td>
        </tr>`;
    }).join("");

    const note = registered
      ? ""
      : `<p class="rankings-note">התחבר עם חשבון Google כדי לראות את הדירוג שלך מול שאר המשתמשים.</p>`;

    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen rankings-screen">
        <section class="menu-card rankings-card">
          <h1>דירוגים</h1>
          ${nicknameHeader()}
          ${tabsBar(tab.key)}
          <p class="rankings-sub">${esc(tab.sub)}</p>
          <div class="rankings-table-wrap">
            <table class="rankings-table">
              <thead>
                <tr>
                  <th class="rank-card-name">${esc(tab.nameHead || "כרטיס")}</th>
                  <th class="rank-count">${esc(tab.countHead)}</th>
                  <th class="rank-rank">דירוג</th>
                  <th class="rank-record">שיא נוכחי</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          ${note}
          <div class="about-actions" style="margin-top:1.15rem;padding-top:1rem;border-top:1px dashed rgba(70,50,25,.35);">
            <button class="btn btn-primary" data-action="rankings-back" type="button">חזרה להישגים</button>
          </div>
        </section>
      </main>`;
  }

  // The editable nickname (shared across both tabs). Never shown in the main
  // table; it labels the player in the per-card records lists. Default "ללא שם".
  function nicknameHeader() {
    const nick = typeof getNickname === "function" ? getNickname() : DEFAULT_NICKNAME;
    const state = getState();
    const err = state.rankingsNicknameError;
    return `
      <div class="rankings-nickname">
        <label for="rankings-nickname-input">הכינוי שלך:</label>
        <input id="rankings-nickname-input" class="rankings-nickname-input" data-rankings-nickname
               type="text" maxlength="20" value="${esc(nick)}" placeholder="${esc(DEFAULT_NICKNAME)}" />
        <button class="btn" data-action="rankings-nickname-save" type="button">שמור</button>
        ${err ? `<span class="rankings-nickname-error">${esc(err)}</span>` : ""}
      </div>`;
  }

  // A single card's records page: the same two tabs, opening on the tab you came
  // from. Each tab lists that card's record-holders (rank, count, nickname).
  function renderCardRecordsScreen(app) {
    const tab = activeTab();
    const state = getState();
    const cardId = state.rankingsCardId;
    const card = [...rankingCards(), ...rankingPrograms()].find((c) => c.id === cardId)
      || { id: cardId, label: cardId };
    const rows = (typeof leaderboardRows === "function" ? leaderboardRows(cardId, tab.ldim) : null) || [];
    const body = rows.length
      ? rows.map((r) => `
          <tr>
            <td class="rank-rank">${rankCell(r.rank)}</td>
            <td class="rank-count">${typeof r.count === "number" ? esc(fmt(tab, r.count)) : "—"}</td>
            <td class="rank-nick">${esc(r.nickname || DEFAULT_NICKNAME)}</td>
          </tr>`).join("")
      : `<tr><td colspan="3" class="rankings-empty-row">${tab.rows === "programs"
          ? "אין עדיין שיאים למשימה זו." : "אין עדיין שיאים לכרטיס זה."}</td></tr>`;
    app.innerHTML = `
      ${topbar()}
      <main class="screen menu-screen rankings-screen">
        <section class="menu-card rankings-card">
          <h1>שיאי ${esc(card.label)}</h1>
          ${tabsBar(tab.key)}
          <p class="rankings-sub">${esc(tab.recordsSub)}</p>
          <div class="rankings-table-wrap">
            <table class="rankings-table records-table">
              <thead>
                <tr>
                  <th class="rank-rank">דירוג</th>
                  <th class="rank-count">${esc(tab.countHead)}</th>
                  <th class="rank-nick">כינוי</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
          <div class="about-actions" style="margin-top:1.15rem;padding-top:1rem;border-top:1px dashed rgba(70,50,25,.35);">
            <button class="btn btn-primary" data-action="card-records-back" type="button">חזרה לדירוגים</button>
          </div>
        </section>
      </main>`;
  }

  return { rankingCards, rankingPrograms, renderRankingsScreen, renderCardRecordsScreen };
}

// rankings.js — the "דירוגים" screen. One page, two tabs:
//   • "דירוגי יעילות" (default) — ranks by the TOTAL recursive Nand count of the
//     player's build (fewer = more efficient).
//   • "דירוגי מהירות" — ranks by the SERIAL Nand count: the most Nands in series
//     on any input→output path (the critical-path depth; fewer = faster).
// Each tab is a table with one row per built-in card: card name | the metric's
// count | the player's rank among registered users | the current record.
// Clicking a card opens its records page, which mirrors the same two tabs and
// opens on the tab you came from.
//
// Loaded BEFORE app.js. createRankings(deps) -> { rankingCards,
//   renderRankingsScreen, renderCardRecordsScreen }.
//   Counts come from state.cardNandCounts (efficiency) and state.cardSerialCounts
//   (speed), written by app.js. Cross-user rank/record come from
//   leaderboardFor(cardId, dim) with dim "counts"|"serial".

function createRankings({ getState, esc, adaptGender, topbar, isRegistered, leaderboardFor, leaderboardRows, getNickname, getTab }) {
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
    }
  };
  const activeTab = () => TABS[(typeof getTab === "function" && getTab()) === "speed" ? "speed" : "efficiency"];

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
    push(typeof ARITH_TASKS !== "undefined" ? ARITH_TASKS : []);
    push(typeof ALU_TASKS !== "undefined" ? ALU_TASKS : []);
    return rows;
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

  // The two-tab strip. `active` is the current tab key; each button switches tabs.
  function tabsBar(active) {
    const btn = (key) => `
      <button class="rankings-tab${key === active ? " is-active" : ""}" data-action="rankings-tab" data-tab="${key}" type="button">
        ${esc(TABS[key].label)}
      </button>`;
    return `<div class="rankings-tabs" role="tablist">${btn("efficiency")}${btn("speed")}</div>`;
  }

  function renderRankingsScreen(app) {
    const tab = activeTab();
    const registered = typeof isRegistered === "function" ? Boolean(isRegistered()) : false;
    const rows = rankingCards().map((card) => {
      const count = countFor(card.id, tab);
      const countText = count == null ? `<span class="rank-undef">—</span>` : String(count);
      const lb = typeof leaderboardFor === "function" ? leaderboardFor(card.id, tab.ldim) : null;
      const rank = lb && typeof lb.rank === "number" ? lb.rank : null;
      const record = lb && typeof lb.record === "number" ? lb.record : null;
      const rankHtml = registered ? rankCell(rank) : `<span class="rank-empty" title="זמין למשתמשים רשומים">—</span>`;
      const recordHtml = record == null ? `<span class="rank-empty">—</span>` : String(record);
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
                  <th class="rank-card-name">כרטיס</th>
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
    const card = rankingCards().find((c) => c.id === cardId) || { id: cardId, label: cardId };
    const rows = (typeof leaderboardRows === "function" ? leaderboardRows(cardId, tab.ldim) : null) || [];
    const body = rows.length
      ? rows.map((r) => `
          <tr>
            <td class="rank-rank">${rankCell(r.rank)}</td>
            <td class="rank-count">${typeof r.count === "number" ? r.count : "—"}</td>
            <td class="rank-nick">${esc(r.nickname || DEFAULT_NICKNAME)}</td>
          </tr>`).join("")
      : `<tr><td colspan="3" class="rankings-empty-row">אין עדיין שיאים לכרטיס זה.</td></tr>`;
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

  return { rankingCards, renderRankingsScreen, renderCardRecordsScreen };
}

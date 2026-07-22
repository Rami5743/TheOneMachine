// rankings.js — the "דירוגי יעילות" (efficiency rankings) screen: a table with
// one row per built-in card. Columns: card name | the player's recursive Nand
// count for their build | the player's rank among registered users | the current
// record (lowest count anywhere). Lower is better; ranks 1/2/3 show as medals.
//
// Loaded BEFORE app.js. createRankings(deps) -> { RANKING_CARD_IDS,
//   renderRankingsScreen }
//   deps: getState, esc, adaptGender, topbar, isRegistered, leaderboardFor
//
// The Nand count itself is stored per card in state.cardNandCounts (written by
// app.js at task completion). Cross-user data (rank, record) comes from
// leaderboardFor(cardId) — { rank, record, registered } — which app.js fills
// from the cloud once the leaderboard backend exists; until then it returns null
// and those cells show a placeholder.

function createRankings({ getState, esc, adaptGender, topbar, isRegistered, leaderboardFor, leaderboardRows, getNickname }) {
  const DEFAULT_NICKNAME = "ללא שם";
  // The buildable cards, in game order. Nand is the given primitive (always 1).
  function rankingCards() {
    const rows = [{ id: "Nand", label: "Nand" }];
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

  // The player's recursive Nand count for a card, or null when undefined (not
  // built, or built with a card that has no count).
  function nandCountFor(cardId) {
    if (cardId === "Nand") return 1;
    const counts = getState().cardNandCounts || {};
    const v = counts[cardId];
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

  function renderRankingsScreen(app) {
    const registered = typeof isRegistered === "function" ? Boolean(isRegistered()) : false;
    const rows = rankingCards().map((card) => {
      const count = nandCountFor(card.id);
      const countText = count == null ? `<span class="rank-undef">—</span>` : String(count);
      const lb = typeof leaderboardFor === "function" ? leaderboardFor(card.id) : null;
      const rank = lb && typeof lb.rank === "number" ? lb.rank : null;
      const record = lb && typeof lb.record === "number" ? lb.record : null;
      const rankHtml = registered ? rankCell(rank) : `<span class="rank-empty" title="זמין למשתמשים רשומים">—</span>`;
      const recordHtml = record == null ? `<span class="rank-empty">—</span>` : String(record);
      // Each row opens that card's records page (rank/nands/nickname list).
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
          <h1>דירוגי יעילות</h1>
          ${nicknameHeader()}
          <p class="rankings-sub">מספר הנאנדים בבנייה שלך לכל כרטיס — ככל שנמוך יותר, יעיל יותר. לחץ על כרטיס לרשימת השיאים שלו.</p>
          <div class="rankings-table-wrap">
            <table class="rankings-table">
              <thead>
                <tr>
                  <th class="rank-card-name">כרטיס</th>
                  <th class="rank-count">נאנדים</th>
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

  // The editable nickname at the top of the page. Never shown in the main table;
  // it labels the player in the per-card records lists. Default "ללא שם".
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

  // A single card's records page: the leaderboard for that card — rank, Nand
  // count and nickname of each record-holder (nicknames ARE shown here).
  function renderCardRecordsScreen(app) {
    const state = getState();
    const cardId = state.rankingsCardId;
    const card = rankingCards().find((c) => c.id === cardId) || { id: cardId, label: cardId };
    const rows = (typeof leaderboardRows === "function" ? leaderboardRows(cardId) : null) || [];
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
          <p class="rankings-sub">רשימת השיאנים — מספר הנאנדים הנמוך ביותר קודם.</p>
          <div class="rankings-table-wrap">
            <table class="rankings-table records-table">
              <thead>
                <tr>
                  <th class="rank-rank">דירוג</th>
                  <th class="rank-count">נאנדים</th>
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

  return { rankingCards, nandCountFor, renderRankingsScreen, renderCardRecordsScreen };
}

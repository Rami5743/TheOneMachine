// auth.js — optional Google sign-in + cross-device progress sync, built on
// Supabase. Kept fully self-contained (its own UI, styles and event wiring) so
// it adds almost nothing to app.js and is easy to merge alongside other work.
//
// HOW IT PLUGS IN
// - Reads/writes the SAME localStorage key the game already uses
//   (APP.storageKey), so "progress" here means exactly the game's saved state.
// - Listens for the "tom:statesaved" window event that app.js fires after every
//   saveState(), and (when signed in) debounces a push of the latest state to
//   the cloud.
// - Injects a small account chip (fixed, bottom-start corner) into <body>, so
//   the game's full-innerHTML re-renders never wipe it. No topbar edits needed.
//
// DISABLED BY DEFAULT: if AUTH_CONFIG has no URL/key (see js/auth-config.js),
// this module does nothing at all — no library load, no UI — and the game runs
// local-only, exactly as before.
//
// CLOUD SHAPE: one row per user in a `progress` table:
//   { user_id uuid (pk, = auth.uid()), state jsonb, updated_at timestamptz }
// with Row Level Security so each user only ever sees/writes their own row.

(function () {
  "use strict";

  var cfg = (typeof AUTH_CONFIG !== "undefined" && AUTH_CONFIG) || {};
  var URL = String(cfg.SUPABASE_URL || "").trim();
  var ANON = String(cfg.SUPABASE_ANON_KEY || "").trim();

  // Feature flag: no credentials -> stay completely dormant.
  if (!URL || !ANON) return;

  var KEY = (typeof APP !== "undefined" && APP && APP.storageKey) || "nand2tetris-lomda-v12";
  var TABLE = "progress";
  var SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

  // Where to fetch supabase-js from. Tried in order; the first that loads wins,
  // so a network that blocks one CDN can still fall through to another. Both
  // serve the UMD build (sets window.supabase) and are pinned to the v2 major
  // (which supports the new sb_publishable_ keys).
  var SUPABASE_CDNS = [
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js"
  ];

  var sb = null;            // the Supabase client
  var currentUser = null;   // the signed-in user (or null)
  var reconciledUid = null; // uid we've already reconciled this page load
  var pushTimer = null;

  // ---- progress comparison (used to avoid overwriting better progress) ------
  // A coarse "how far along" score. Higher wins. Primary signal is the furthest
  // chapter reached; total story panels seen breaks near-ties. Anything we can't
  // read counts as 0 — safe, since a real save always has maxChapterReached.
  function progressScore(str) {
    try {
      var s = JSON.parse(str);
      var score = (Number(s.maxChapterReached) || 0) * 1e6;
      var mp = s.maxPanelReached && typeof s.maxPanelReached === "object" ? s.maxPanelReached : {};
      score += Object.keys(mp).reduce(function (a, k) { return a + (Number(mp[k]) || 0); }, 0) * 1e3;
      if (Array.isArray(s.achievementsUnlocked)) score += s.achievementsUnlocked.length;
      return score;
    } catch (e) { return 0; }
  }

  function localStateString() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  // Adopt the cloud save into the running app. Preferred path: hand it to the
  // app via APP.applyCloudState, which swaps state in place and re-renders — NO
  // page reload. We must never compare cloud and local as strings to decide
  // whether to reload: the cloud copy is stored as Postgres jsonb, which does
  // not preserve key order, so the strings essentially never match even when
  // the state is identical — that mismatch is what caused an endless reload
  // loop. The fallback (older/again-loaded app without the bridge) reloads at
  // most once per tab, guarded via sessionStorage.
  function adoptCloud(cloudObj) {
    if (typeof APP !== "undefined" && APP && typeof APP.applyCloudState === "function") {
      APP.applyCloudState(cloudObj);
      return;
    }
    try {
      if (sessionStorage.getItem("tom_auth_adopted") === "1") return; // already did it this tab
      sessionStorage.setItem("tom_auth_adopted", "1");
      localStorage.setItem(KEY, JSON.stringify(cloudObj));
      location.reload();
    } catch (e) { /* ignore */ }
  }

  // ---- cloud read / write ---------------------------------------------------
  async function pullCloud(uid) {
    var res = await sb.from(TABLE).select("state").eq("user_id", uid).maybeSingle();
    if (res.error) { console.warn("[auth] cloud read failed:", res.error.message); return undefined; }
    return res.data ? res.data.state : null; // null = no row yet
  }

  async function pushCloud(uid, obj) {
    var res = await sb.from(TABLE).upsert(
      { user_id: uid, state: obj, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (res.error) console.warn("[auth] cloud write failed:", res.error.message);
  }

  // Bring local and cloud into agreement once per sign-in. The decision is by
  // progress SCORE, never by string equality (see adoptCloud): adopt the cloud
  // copy only when it is strictly further along; on a tie or when local is
  // ahead, keep local and sync it up. This guarantees the process settles and
  // never ping-pongs.
  async function reconcile(uid) {
    if (reconciledUid === uid) return;
    reconciledUid = uid;

    var localStr = localStateString();
    var cloud = await pullCloud(uid);
    if (cloud === undefined) { reconciledUid = null; return; } // read errored; allow retry

    if (cloud === null) {                       // first sign-in for this account
      if (localStr) await pushCloud(uid, JSON.parse(localStr));
      return;
    }
    var localScore = localStr ? progressScore(localStr) : -1;
    var cloudScore = progressScore(JSON.stringify(cloud));
    if (cloudScore > localScore) {
      adoptCloud(cloud);                          // cloud is further along -> take it
    } else if (localStr) {
      await pushCloud(uid, JSON.parse(localStr)); // local ahead or equal -> keep + sync up
    }
  }

  function schedulePush() {
    if (!currentUser) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      var localStr = localStateString();
      if (localStr) pushCloud(currentUser.id, JSON.parse(localStr));
    }, 1500);
  }

  // ---- floating account chip (bottom-start corner, on every screen) ---------
  // The app's main menu also has an account button (via the APP.auth bridge);
  // this chip is kept in addition, matching the original look.
  var chip = null;
  function googleGlyph() {
    return '<svg class="auth-g" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.1-3.8 6.5-9.4 6.5-16z"/>' +
      '<path fill="#FBBC05" d="M10.4 28.3a14.5 14.5 0 0 1 0-8.6l-7.9-6.1a24 24 0 0 0 0 20.8l7.9-6.1z"/>' +
      '<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.8 2.1-6.3 0-11.7-3.7-13.6-9l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/>' +
      '</svg>';
  }
  function ensureChip() {
    if (chip) return chip;
    var style = document.createElement("style");
    style.textContent =
      ".auth-chip{position:fixed;inset-inline-start:12px;bottom:12px;z-index:2000;direction:rtl;font-family:inherit}" +
      ".auth-chip button{display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:1px solid rgba(255,255,255,.25);" +
      "background:rgba(20,20,20,.92);color:#fff;font:inherit;font-weight:700;font-size:.85rem;padding:8px 12px;border-radius:999px;" +
      "box-shadow:0 6px 18px rgba(0,0,0,.4)}" +
      ".auth-chip button:hover{background:rgba(40,40,40,.96)}" +
      ".auth-chip .auth-user{display:inline-flex;align-items:center;gap:8px;background:rgba(20,20,20,.92);color:#fff;" +
      "border:1px solid rgba(255,255,255,.2);padding:6px 10px;border-radius:999px;font-size:.8rem;box-shadow:0 6px 18px rgba(0,0,0,.4)}" +
      ".auth-chip .auth-avatar{width:22px;height:22px;border-radius:50%;object-fit:cover}" +
      ".auth-chip .auth-name{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}" +
      ".auth-chip .auth-signout{cursor:pointer;background:none;border:none;color:#ffd7d7;font:inherit;font-size:.75rem;" +
      "text-decoration:underline;padding:0 2px;box-shadow:none}";
    document.head.appendChild(style);
    chip = document.createElement("div");
    chip.className = "auth-chip";
    document.body.appendChild(chip);
    return chip;
  }
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function renderChip() {
    var el = ensureChip();
    if (currentUser) {
      var m = currentUser.user_metadata || {};
      var name = m.full_name || m.name || currentUser.email || "מחובר";
      var avatar = m.avatar_url || m.picture || "";
      el.innerHTML =
        '<span class="auth-user">' +
        (avatar ? '<img class="auth-avatar" src="' + esc(avatar) + '" alt="" referrerpolicy="no-referrer">' : "") +
        '<span class="auth-name">' + esc(name) + "</span>" +
        '<button class="auth-signout" data-auth-action="signout" type="button">התנתק</button>' +
        "</span>";
    } else {
      el.innerHTML =
        '<button data-auth-action="signin" type="button" aria-label="התחבר עם חשבון Google">' +
        googleGlyph() + "<span>התחבר עם Google</span></button>";
    }
  }
  document.addEventListener("click", function (event) {
    var t = event.target.closest ? event.target.closest("[data-auth-action]") : null;
    if (!t) return;
    event.preventDefault();
    if (t.getAttribute("data-auth-action") === "signin") signIn();
    else if (t.getAttribute("data-auth-action") === "signout") signOut();
  });

  // ---- account actions (also driven from the app's main menu button) --------
  async function signIn() {
    if (!sb) return;
    var redirect = String(cfg.REDIRECT_TO || "").trim() || location.href.split("#")[0];
    var res = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirect } });
    if (res.error) console.warn("[auth] sign-in failed:", res.error.message);
  }

  async function signOut() {
    if (!sb) return;
    // Push once more before leaving, so the last moves aren't lost.
    if (currentUser) {
      var localStr = localStateString();
      if (localStr) { try { await pushCloud(currentUser.id, JSON.parse(localStr)); } catch (e) {} }
    }
    await sb.auth.signOut();
  }

  // Publish the bridge the app's menu reads (APP is the global from data.js).
  // `available` tells the menu it may show the account button; `user` is the
  // signed-in user (or null); signIn/signOut are the actions.
  function publishBridge() {
    if (typeof APP === "undefined" || !APP) return;
    APP.auth = { available: true, user: currentUser, signIn: signIn, signOut: signOut };
  }

  // Tell the app the signed-in user changed, so it can refresh the menu button
  // and earn the "מחובר" achievement.
  function announceAuth() {
    publishBridge();
    renderChip();
    try {
      window.dispatchEvent(new CustomEvent("tom:authchanged", { detail: { user: currentUser } }));
    } catch (e) { /* very old browsers: ignore */ }
  }

  window.addEventListener("tom:statesaved", schedulePush);

  // ---- efficiency leaderboard (hall of fame) --------------------------------
  // One public-read row per user in a `rankings` table:
  //   { user_id uuid pk, nickname text, counts jsonb, updated_at }
  // counts maps cardId -> the user's best (lowest) Nand count. We cache every
  // row and derive, per card, the record (lowest count) and each user's rank
  // (ties share a rank). Nicknames appear only on a card's records list.
  var LB_TABLE = "rankings";
  var lbRows = [];
  var lbPushTimer = null;

  function myState() {
    try { return JSON.parse(localStateString() || "{}"); } catch (e) { return {}; }
  }
  function myNickname() {
    var s = myState();
    return (typeof s.rankingsNickname === "string" && s.rankingsNickname) || "ללא שם";
  }

  async function fetchLeaderboard() {
    if (!sb) return;
    var res = await sb.from(LB_TABLE).select("nickname,counts");
    if (res.error) { console.warn("[leaderboard] read failed:", res.error.message); return; }
    lbRows = Array.isArray(res.data) ? res.data : [];
    try { window.dispatchEvent(new CustomEvent("tom:leaderboard")); } catch (e) { /* ignore */ }
  }

  async function pushMyRankings() {
    if (!sb || !currentUser) return;
    var s = myState();
    var res = await sb.from(LB_TABLE).upsert(
      { user_id: currentUser.id, nickname: myNickname(), counts: s.cardNandCounts || {}, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (res.error) console.warn("[leaderboard] write failed:", res.error.message);
    else fetchLeaderboard();
  }

  function scheduleRankingsPush() {
    if (!currentUser) return;
    clearTimeout(lbPushTimer);
    lbPushTimer = setTimeout(pushMyRankings, 1500);
  }
  window.addEventListener("tom:statesaved", scheduleRankingsPush);

  // Every user's (nickname, count) for a card that has a numeric count, ranked
  // ascending with ties sharing a rank (1, 2, 2, 4 …).
  function rankedEntries(cardId) {
    var entries = lbRows
      .map(function (r) {
        var v = r && r.counts ? r.counts[cardId] : undefined;
        return (typeof v === "number" && isFinite(v)) ? { nickname: (r.nickname || "ללא שם"), count: v } : null;
      })
      .filter(Boolean)
      .sort(function (a, b) { return a.count - b.count; });
    var rank = 0, prev = null, seen = 0;
    return entries.map(function (e) {
      seen += 1;
      if (prev === null || e.count > prev) { rank = seen; prev = e.count; }
      return { rank: rank, count: e.count, nickname: e.nickname };
    });
  }

  function publishLeaderboardBridge() {
    if (typeof APP === "undefined" || !APP) return;
    APP.leaderboardRows = function (cardId) { return rankedEntries(cardId); };
    APP.leaderboardFor = function (cardId) {
      var ranked = rankedEntries(cardId);
      if (!ranked.length) return null;
      var out = { record: ranked[0].count, rank: null };
      if (currentUser) {
        var myCount = (myState().cardNandCounts || {})[cardId];
        if (typeof myCount === "number") {
          var below = ranked.filter(function (r) { return r.count < myCount; }).length;
          out.rank = below + 1; // ties share a rank; robust even if my row isn't fetched yet
        }
      }
      return out;
    };
    APP.refreshLeaderboard = fetchLeaderboard;
    APP.setNickname = async function (nick) {
      if (!sb || !currentUser) return; // local-only when signed out (no cross-user uniqueness)
      var res = await sb.from(LB_TABLE).upsert(
        { user_id: currentUser.id, nickname: nick, counts: (myState().cardNandCounts || {}), updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      if (res.error) {
        // A unique-index violation means the nickname is taken.
        try { window.dispatchEvent(new CustomEvent("tom:nicknametaken", { detail: { nickname: nick } })); } catch (e) { /* ignore */ }
      } else { fetchLeaderboard(); }
    };
  }

  // ---- boot -----------------------------------------------------------------
  function loadOneScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        if (window.supabase && window.supabase.createClient) resolve(window.supabase);
        else reject(new Error("loaded but createClient missing"));
      };
      s.onerror = function () { reject(new Error("network error")); };
      document.head.appendChild(s);
    });
  }

  async function loadSupabaseLib() {
    if (window.supabase && window.supabase.createClient) return window.supabase;
    var lastErr = null;
    for (var i = 0; i < SUPABASE_CDNS.length; i++) {
      try { return await loadOneScript(SUPABASE_CDNS[i]); }
      catch (e) { lastErr = e; }
    }
    throw new Error("failed to load supabase-js" + (lastErr ? " (" + lastErr.message + ")" : ""));
  }

  async function boot() {
    try {
      var lib = await loadSupabaseLib();
      sb = lib.createClient(URL, ANON, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    } catch (e) {
      // Offline / blocked / file:// -> quietly stay local-only (no account button).
      console.warn("[auth] disabled:", e.message);
      return;
    }
    publishBridge(); // menu may now show the account button (starts logged-out)
    publishLeaderboardBridge(); // rankings screen can query the leaderboard
    renderChip();    // show the floating chip (starts logged-out)
    fetchLeaderboard(); // load the public leaderboard even before sign-in
    sb.auth.onAuthStateChange(function (event, session) {
      currentUser = (session && session.user) || null;
      if (!currentUser) reconciledUid = null;
      announceAuth();
      if (currentUser) { reconcile(currentUser.id); pushMyRankings(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

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
      if (Array.isArray(s.unlockedAchievements)) score += s.unlockedAchievements.length;
      return score;
    } catch (e) { return 0; }
  }

  function localStateString() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  // Overwrite the local save with the cloud one and reload so the running app
  // re-reads it through its normal loadState(). Returns true if it reloaded.
  function adoptCloud(cloudObj) {
    var cloudStr = JSON.stringify(cloudObj);
    if (cloudStr === localStateString()) return false;
    try { localStorage.setItem(KEY, cloudStr); } catch (e) { return false; }
    location.reload();
    return true;
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

  // Bring local and cloud into agreement once per sign-in.
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
    var cloudStr = JSON.stringify(cloud);
    if (!localStr || cloudStr === localStr) {   // nothing local, or already equal
      if (!localStr) adoptCloud(cloud);
      return;
    }
    if (progressScore(localStr) > progressScore(cloudStr)) {
      await pushCloud(uid, JSON.parse(localStr)); // local is further along -> keep it
    } else {
      adoptCloud(cloud);                          // cloud is further (or last-write-wins)
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

  // ---- account actions (the UI lives in the app's main menu) ----------------
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
    try {
      window.dispatchEvent(new CustomEvent("tom:authchanged", { detail: { user: currentUser } }));
    } catch (e) { /* very old browsers: ignore */ }
  }

  window.addEventListener("tom:statesaved", schedulePush);

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
    sb.auth.onAuthStateChange(function (event, session) {
      currentUser = (session && session.user) || null;
      if (!currentUser) reconciledUid = null;
      announceAuth();
      if (currentUser) reconcile(currentUser.id);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

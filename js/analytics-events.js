// analytics-events.js — game-level events sent to GoatCounter, on top of the
// plain visit count. Self-contained and dormant unless analytics-config.js has a
// code (same flag as analytics.js). Reads the game's own saved state; touches
// nothing in app.js.
//
// Events (shown in GoatCounter under "Paths", flagged as events):
//   game/chapter-<n>   — reached chapter level <n>       (once per browser)
//   game/card-<id>     — completed the <id> build card   (once per browser)
//   game/playtime-<t>  — this SESSION stayed active ≥ t  (1m/5m/15m/30m/60m)
// The chapter/card milestones are de-duplicated per browser (localStorage), so
// each one reflects "how many people got this far", not repeat visits. Play-time
// is per session, giving a "how long do people play" funnel.
(function () {
  "use strict";
  var cfg = (typeof ANALYTICS_CONFIG !== "undefined" && ANALYTICS_CONFIG) || {};
  if (!String(cfg.GOATCOUNTER_CODE || "").trim()) return; // dormant until configured

  var KEY = (typeof APP !== "undefined" && APP && APP.storageKey) || "nand2tetris-lomda-v12";
  var SENT_KEY = "tom_analytics_sent"; // milestones already reported by this browser

  function readSent() {
    try { return new Set(JSON.parse(localStorage.getItem(SENT_KEY) || "[]")); } catch (e) { return new Set(); }
  }
  function writeSent(set) {
    try { localStorage.setItem(SENT_KEY, JSON.stringify(Array.from(set))); } catch (e) { /* ignore */ }
  }

  // Queue events until GoatCounter's count.js has loaded, then flush.
  var queue = [];
  function ready() { return window.goatcounter && typeof window.goatcounter.count === "function"; }
  function flush() {
    if (!ready()) return;
    while (queue.length) {
      var e = queue.shift();
      try { window.goatcounter.count(e); } catch (err) { /* ignore */ }
    }
  }
  function fire(path, title) {
    queue.push({ path: path, title: title || path, event: true });
    flush();
  }
  var tries = 0;
  var flushTimer = setInterval(function () {
    if (ready()) { flush(); clearInterval(flushTimer); }
    else if (++tries > 40) { clearInterval(flushTimer); } // give up after ~20s
  }, 500);

  // ---- once-per-browser milestones (chapters reached, cards completed) -------
  function reportMilestones() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return; }
    var set = readSent();
    var changed = false;
    var maxCh = Number(s.maxChapterReached) || 0;
    for (var c = 1; c <= maxCh; c += 1) {
      var ck = "chapter:" + c;
      if (!set.has(ck)) { set.add(ck); changed = true; fire("game/chapter-" + c, "Reached chapter level " + c); }
    }
    (Array.isArray(s.completedTasks) ? s.completedTasks : []).forEach(function (id) {
      var pk = "card:" + id;
      if (!set.has(pk)) { set.add(pk); changed = true; fire("game/card-" + id, "Completed card " + id); }
    });
    if (changed) writeSent(set);
  }
  window.addEventListener("tom:statesaved", reportMilestones);
  setTimeout(reportMilestones, 1500); // also once shortly after load

  // ---- per-session play-time funnel -----------------------------------------
  var THRESHOLDS = [[60, "1m"], [300, "5m"], [900, "15m"], [1800, "30m"], [3600, "60m"]];
  var visibleMs = 0, lastAt = Date.now(), firedPt = {};
  document.addEventListener("visibilitychange", function () { lastAt = Date.now(); });
  setInterval(function () {
    var now = Date.now();
    if (!document.hidden) visibleMs += now - lastAt;
    lastAt = now;
    var sec = visibleMs / 1000;
    THRESHOLDS.forEach(function (t) {
      if (sec >= t[0] && !firedPt[t[1]]) { firedPt[t[1]] = true; fire("game/playtime-" + t[1], "Played ≥ " + t[1]); }
    });
  }, 15000);
})();

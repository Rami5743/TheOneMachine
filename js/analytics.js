// analytics.js — loads GoatCounter (privacy-friendly, cookie-free visitor
// analytics) when js/analytics-config.js provides a site code. Fully self-
// contained and dormant by default: with no code it does nothing at all.
//
// The game is a single page that re-renders in place (no URL changes), so
// GoatCounter records one pageview per visit — enough to answer "how many people
// enter the site" plus referrer / country / device breakdowns. GoatCounter's
// own count.js skips localhost and private networks, so local testing is ignored.
(function () {
  "use strict";
  var cfg = (typeof ANALYTICS_CONFIG !== "undefined" && ANALYTICS_CONFIG) || {};
  var code = String(cfg.GOATCOUNTER_CODE || "").trim();
  if (!code) return; // not configured → stay completely dormant

  // Accept a bare code ("theonemachine") or a full endpoint URL.
  var endpoint = /^https?:\/\//.test(code)
    ? code
    : "https://" + code + ".goatcounter.com/count";

  var s = document.createElement("script");
  s.setAttribute("data-goatcounter", endpoint); // count.js reads the endpoint from here
  s.async = true;
  s.src = "//gc.zgo.at/count.js";
  (document.body || document.documentElement).appendChild(s);
})();

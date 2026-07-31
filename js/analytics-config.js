// analytics-config.js — turn on privacy-friendly visitor analytics (GoatCounter).
//
// Leave GOATCOUNTER_CODE empty and NOTHING happens: no script is loaded, no data
// is sent, the game behaves exactly as before. This is the default.
//
// To enable: create a free GoatCounter site (see ANALYTICS_SETUP.md), then put
// your site CODE here — the "<CODE>" from your https://<CODE>.goatcounter.com
// dashboard address (a full endpoint URL also works).
//
// GoatCounter is cookie-free and collects no personal data (privacy-friendly —
// suitable for a children's site). It reports how many VISITORS and PAGEVIEWS,
// plus referrer / country / device — never individuals. Local and private-network
// hosts (localhost, 127.*, 192.168.*, …) are ignored automatically, so testing
// never pollutes the stats.
const ANALYTICS_CONFIG = {
  GOATCOUNTER_CODE: ""
};

// auth-config.js — fill these in to turn on Google sign-in + cross-device
// progress sync. Leave the strings EMPTY and the game behaves exactly as it
// does today: everything is saved locally, and no login UI appears.
//
// Where to find the values: Supabase dashboard -> Project Settings -> API.
//   SUPABASE_URL      = "Project URL"  (looks like https://xxxx.supabase.co)
//   SUPABASE_ANON_KEY = "anon public" key. This one is SAFE to expose in the
//                       browser — it is designed for client-side use and is
//                       guarded by Row Level Security. NEVER put the
//                       "service_role" key here.
//
// Notes:
// - Google sign-in only works over http(s) (e.g. your GitHub Pages URL), NOT
//   when opening index.html by double-click (file://). Off the web the game
//   simply stays in local-only mode.
// - REDIRECT_TO is where Google returns the user after sign-in. Leave it empty
//   to return to the current page (correct for GitHub Pages). Set it only if
//   you want a fixed landing URL.
const AUTH_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  REDIRECT_TO: ""
};

if (typeof module !== "undefined" && module.exports) module.exports = { AUTH_CONFIG };

// medal-achievements.js — eligibility logic for the per-chapter "מדליסט"
// (medalist) achievements. Loaded before app.js. The achievement ENTRIES and
// their chapter/mode descriptors live in js/achievements-data.js
// (MEDAL_ACHIEVEMENTS); the unlock wiring, the persistent "earned" ledger and the
// " לשעבר" title decoration live in js/app.js. This module only answers, live
// from the leaderboard: "is this medalist achievement currently deserved?".
//
// A card earns a MEDAL when the player's rank on it is 1–3, and GOLD at rank 1.
// The rank comes from the injected leaderboardFor(cardId) → { rank, record } (or
// null). It is non-null only for a signed-in player who has a count for the card
// and whose leaderboard data has been fetched.
//
// createMedalAchievements({ leaderboardFor }) -> { eligible, eligibilityMap,
//   isMedalId }
function createMedalAchievements({ leaderboardFor }) {
  function entries() {
    return typeof MEDAL_ACHIEVEMENTS !== "undefined" ? MEDAL_ACHIEVEMENTS : [];
  }

  function cardMedal(cardId) {
    const lb = typeof leaderboardFor === "function" ? leaderboardFor(cardId) : null;
    const rank = lb && typeof lb.rank === "number" ? lb.rank : null;
    return { medal: rank !== null && rank >= 1 && rank <= 3, gold: rank === 1 };
  }

  // Is a single medalist achievement (its `medal` descriptor) currently deserved?
  function eligible(descriptor) {
    const cards = (descriptor && descriptor.cards) || [];
    if (!cards.length) return false;
    const states = cards.map(cardMedal);
    switch (descriptor.mode) {
      case "any": return states.some((s) => s.medal);
      case "anyGold": return states.some((s) => s.gold);
      case "all": return states.every((s) => s.medal);
      case "allGold": return states.every((s) => s.gold);
      default: return false;
    }
  }

  // { achievementId -> currently-deserved bool } for every medalist achievement.
  function eligibilityMap() {
    const out = {};
    entries().forEach((a) => { out[a.id] = eligible(a.medal); });
    return out;
  }

  function isMedalId(id) {
    return typeof id === "string" && id.indexOf("medalist-") === 0;
  }

  return { eligible, eligibilityMap, isMedalId };
}

if (typeof module !== "undefined" && module.exports) module.exports = { createMedalAchievements };

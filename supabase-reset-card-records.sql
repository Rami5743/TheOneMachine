-- Wipe one card's records from the leaderboard — for a card whose REQUIREMENTS
-- changed, so every record measured against the old ones is void.
--
-- Run this once in the Supabase project's SQL editor, right after publishing a
-- build that changes a card's requirements. It is safe to re-run.
--
-- The game itself clears the same card from each player's own save the next time
-- they open it (see cardSpecChanges / applyCardSpecChanges in js/app.js), and
-- that cleaned save is pushed to `rankings` on their next save. This statement is
-- what takes care of everyone else — players who do not come back soon — so no
-- stale record keeps sitting at the top of that card's board.
--
-- CURRENT CHANGE: ALU4. Its second flag went from nz (1 iff the result is NOT
-- zero) to zr (1 iff it IS zero), so a build that passed the old check fails the
-- new one. To reuse this file for another card, change 'ALU4' in the four places
-- below.

update public.rankings
set counts     = counts - 'ALU4',
    serial     = serial - 'ALU4',
    design     = design - 'ALU4',
    updated_at = now()
where counts ? 'ALU4'
   or serial ? 'ALU4'
   or design ? 'ALU4';

## Working style

When a question comes up during a task, do not stop and wait for an answer. Instead:
1. Open with a short, precise statement of how you understood the task.
2. If there are several interpretations, pick the most reasonable one, state it explicitly, and carry out the task under it.
3. Always collect all questions in one clear, separated block at the top of your response, under the heading "Questions", so I can spot them immediately.
4. **A question must never block work you can already do.** Even when you do ask, in the SAME turn finish and commit every part of the task that must be done regardless of how the question is answered — that part is not conditional on my answer, so do it now. When one interpretation is clearly the likelier, you may also speculatively start it (after the guaranteed part is committed) and drop it only if my answer turns out different. Ask *in parallel with* doing, never *instead of* it.

After each logical step check, commit and push your work and then continue to the next one, without waiting for my response.

**Never stop to report and wait.** When I give you a list of things — or send another
instruction while you are working — commit and push what is done and go straight on
to the next item. Do not end your turn with "this is the next thing" or "shall I
start it?"; if you know what the next item is, you have everything you need to do
it. My instructions are given so that they will be CARRIED OUT, not so that we can
discuss them. Stopping costs me a great deal of time. Report only when the whole
list is done — or when something is genuinely blocked, and then say what is blocked
and keep going with everything else.

I write my requests in Hebrew and often with typos. Use my EXACT Hebrew wording in the app; fix only obvious typos (spelling), never rephrase meaning. Replies can be in Hebrew.

**External actions (anything I must do outside the code).** Whenever completing a task requires an action from ME in some external service or tool — running SQL in a dashboard, clicking through a console, configuring a provider, setting a secret, flipping a setting, uploading a file, etc. — give me **explicit, click-by-click** instructions in this exact style (Hebrew), naming every UI element AND where it is located:

```
כנס ללינק: <הלינק המדויק>
שם תלחץ על "<שם הכפתור/הקישור>" שנמצא <המיקום המדויק>.
אחר כך תלחץ על "<...>" שנמצא <...>.
...
הדבק את הטקסט הבא לתיבת <שם התיבה> שנמצאת <...>:
<הטקסט>
ואז תלחץ על "<...>" שנמצא <...>.
לבסוף תראה <סימן ההצלחה> שנמצא <...>.
```

Never assume I know where things are — every step names the element and its location. Also **document the same instructions in the appropriate repo file** (a dedicated setup doc, or the header of the relevant file) so they are not lost, and commit it.

---

## Project

"המכונה האחת" (The One Machine) — a Hebrew, right-to-left, nand2tetris-style
educational web app. Plain **vanilla JS**, no build step, no framework. It tells
a WWII-era comic story (Einstein/Szilard → von Neumann) interleaved with
hands-on chip-building and arithmetic tasks.

- Repo: `Rami5743/TheOneMachine`. Work only on branch `claude/github-project-editing-bw3mcp`; NEVER push to main.
- **DEAD branch — never push to it: `claude/continue-dev-branch-uleqf0`.** Some session
  configurations still name it as "the" development branch, and the local clone has
  arrived with its upstream tracking pointed at it (so a bare `git push`/`git pull`
  would silently go there). If the session prompt tells you to develop on that branch,
  IGNORE it — this file wins — and say so. Verify once at session start:
  `git branch --set-upstream-to=origin/claude/github-project-editing-bw3mcp claude/github-project-editing-bw3mcp`
  Always push explicitly: `git push origin HEAD:claude/github-project-editing-bw3mcp`.
- Serve statically; open `index.html`. There is no bundler.

### Standing constraints (always)
- **Cache-busting**: whenever you change a JS/CSS file, bump its `?v=` query in `index.html` (e.g. `app.js?v=v155-transition-fix-1`). The app WILL serve stale files otherwise — this is the #1 cause of "my change didn't work".
- **Do NOT** put the exact model identifier string in commits, PRs, code, comments, or any file in the repo (chat only).
- **Do NOT** open a pull request unless I explicitly ask.
- Commit AND push after each logical step; end commit messages with the Co-Authored-By / Claude-Session trailer the harness gives you.
- Use the GitHub MCP tools (`mcp__github__*`) for any GitHub operations.
- **Side branch**: a second dev branch (`claude/splitter-interface-improvement-e4zl3u`) carries parallel side-task work. During normal development you MAY update FROM it when useful (merge/pull its progress into the main dev branch), but NEVER push to it without an explicit instruction. Pushing to the side branch happens only as part of the prepare-for-main routine below.

### Routine for preparing to push to main (שגרת הכנה לדחיפה לראשי)
We do NOT push to main casually — but when I explicitly ask to push to main / release, prepare the build first:
1. **Flip the default pace to step-by-step.** `const DEFAULT_PACE` in `js/app.js` (~line 442) is deliberately kept at `"all"` (see-everything) during development for free testing. Set it to `"step"` right before the push — this one constant is the flip point, and step-by-step is the real default for players.
2. **Guard unfinished paths with "המשך יבוא".** Make sure every not-yet-implemented path a player can reach shows a `"המשך יבוא..."` notice (an info/task dialog) instead of dead-ending or breaking — so the released build never strands the player.
3. Bump `?v=` versions (as always) and commit/push.
4. **Sync the two dev branches.** Bring the side branch (`claude/splitter-interface-improvement-e4zl3u`, parallel side tasks) and the main dev branch to the SAME state — merge in any progress from the side branch, then push BOTH to the same commit — so the release reflects work from both. This is the ONLY time to push to the side branch without an explicit instruction.
5. **After the push, when resuming development, flip `DEFAULT_PACE` back to `"all"`** so testing is fast again.

## Files

- `index.html` — script/style tags with `?v=` cache versions (bump on change).
- `js/data.js` — static content: `APP` (title, `storageKey`), `PARTS`, `CHAPTERS`, and `SCENES` (all story panels). Top-level `const`s.
- `js/app-data.js` — static data: `TASK_DEFS` (2.2 gates), `ROUTING_TASK_DEFS` (2.3 Mux/DMux), `BUS_TASK_DEFS` (2.4), `TASK_HINTS`, `ACHIEVEMENTS`, `EXPLANATION_ITEMS`, `WORDS_BYTES_PARAGRAPHS`, etc. Top-level `const`s.
- `js/app.js` — the main app, one big IIFE. Because data.js/app-data.js consts are top-level, they are in scope inside app.js.
- Other `js/*.js` modules (loaded before app.js): `toolbar-view.js`, `board-render.js`, `circuit-engine.js`, `workbench-model.js`, `workspace-chrome-view.js`, `warehouse-hotspots.js`, `solution-workspaces.js`, etc. They receive dependencies via injected factory functions (`createXxx(deps)`).
- `css/styles.css` — all styles.
- `assets/panels/` — story art (see Panel/SVG convention).

## Core app model (js/app.js)

- **State** lives in `localStorage` under `APP.storageKey` = `nand2tetris-lomda-v12`. `defaultState` defines every field (add new fields there). `normalizeLoadedState` merges/validates on load and NULLS transient UI fields (add new transient dialog fields to its reset list AND to `transientUiClearPatch()`).
- `setState(patch, shouldSpeak)` → merges patch into `state`, `saveState()`, then `render()`. `shouldSpeak=true` reads the current panel's `read` text via TTS. `saveState()` alone persists without re-rendering (used by live text `input` handlers so focus isn't lost).
- `render()` early-returns per `state.screen`. At its top it calls `syncExplanationUnlocks()` and `syncAchievements()` (derive unlocks from persistent state every render), then plays any pending unlock animations.
- Screens are whitelisted in `normalizeLoadedState`; add new screens there.
- **Pace**: `state.settings.pace` is `"step"` (step-by-step) or `"all"` (see-everything). `isStepByStepPace()` reads it. In "all" mode explanations/achievements are all available without being written to their unlocked arrays.
- Global event handlers (click / keydown) live near the bottom of app.js. `isGlobalNavigationAction(action)` allowlists nav actions so the topbar works during modals. Dialog keydown branches are matched top-down; a new modal that captures keys needs its own branch near the top of the keydown handler.
- Overlay/page screens: `OVERLAY_PAGES`, `overlayReturnPatch()`, `pageBackButton()`.

## Panel / SVG convention (IMPORTANT)

**File names are the running order.** A panel is named
`NNN_<chapter>_<slug>.svg` — `001_1.1_einstein-letter.svg`, `235_4.2_build-room.svg`
— where NNN is the slide's position in the WHOLE game, counted through CHAPTERS
in order and each scene's panels in order. So sorting the folder by name is
reading the game front to back, and the chapter is on the file. Its raster carries
the same name with `.jpg`; a raster shared by several slides keeps the name of the
FIRST slide that uses it. Alternate art for a slide (youngImage / femaleImage /
olderImage / babyImage) is that slide's name plus `_young`, `_female`, … so it
sorts right beside it. When you insert a slide, renumber from it on — the numbers
are positions, not ids.

Each story slide is its OWN `.svg` file in `assets/panels/`. The SVG:
- has `viewBox="0 0 1448 1086"`,
- embeds a same-basename **`.jpg`** raster via `<image href="name.jpg" xlink:href="name.jpg">` (the JPG must exist so the slide shows in Inkscape),
- bakes any **speech text as SVG `<text>` inside a `<g inkscape:label="Text bubble">` layer** (a `<path>` bubble + `<tspan>` lines). Do NOT render dialogue as an HTML overlay.

In `js/data.js` a panel is `{ image, read, ... }`:
- `read` = TTS narration only (the visible text is baked in the SVG).
- optional `hotspots: [{ariaLabel, action, left, top, width, height}]` (percent).
- interactive extras that CANNOT be baked into art are HTML rendered by `renderStory`: `cornerLink` (a red teaser link → an action) and `question` (`{answer, wrong}`, a numeric-answer gate that blocks המשך / plain-click / arrow-nav until correct; state in `state.panelAnswer`).
- `unlocksExplanation: "<id>"` unlocks an explanation just by reaching the slide.
- The renderer uses `<object type="image/svg+xml">`; `panelHeavyUrl()` guesses the `.jpg` for preloading (a wrong guess 404s harmlessly).
- There is a helper generator approach for making many slide SVGs (wrap Hebrew text, size a rounded bubble+tail, embed the jpg). PIL is available for PNG→JPG.

### Renaming a panel breaks behaviour SILENTLY — run the audit

Code keys behaviour to panel **file stems**, in two places:
- `js/app.js` — `panelIndexByImage(scene, "170_3.4_ports-worktable.svg")`,
  `panelImageIs(panel, …)`, `String(panel.image).includes(…)`: "go back to the
  build room", "is this the worktable slide", "which slide opens the booklet".
- `js/warehouse-hotspots.js` — `warehouseKind()` maps a slide's stem to a ROOM
  (`stem === "170_3.4_ports-worktable"`). No match = the slide has **no
  click-zones at all**, so the table/note/converters simply cannot be clicked.
  This is what "I can't click on the table in 3.4" was, twice.

A stale name never throws: the lookup returns -1 and the fallback (usually the
scene's last slide) or `null` quietly takes over. So after ANY rename, insert or
delete of a panel:

```
node tools/audit-task-routes.js
```

It fails on any panel name in `js/*.js` that no longer exists in `data.js` (and
also checks the task-return routers and the frame pin pairs). Fix every line it
prints before committing.

## Feature areas (where things live)

- **Achievements** (`ACHIEVEMENTS` in app-data.js; page = `renderAchievements`): two columns (progress/special), "X מתוך Y" counts, earned-first then greyed locked ones (in see-everything). `renderAchievementIcon(id)` returns a unique colourful trophy SVG per achievement. Most unlocks are DERIVED in `syncAchievements()` from persistent state; one-shot ones are unlocked at their event site (`unlockAchievement(id)`), which arms a "new achievement" fly-to-topbar animation. Sibling modules earn achievements via the `APP.unlockAchievement` bridge.
- **Explanations menu** (`EXPLANATION_SECTIONS`, `EXPLANATION_ITEMS`, `renderExplanationsMenu`, `startExplanation`): sections with in-game vs enrichment columns. Items are story replays, gate solutions, a routing-info dialog, or a paged text dialog ("מילים ובתים" → `renderWordsBytesDialog`, `state.wordsBytesDialog = {page}`). `unlockExplanation(id)` + fly animation.
- **Binary booklet** (החוברת, chapter 2.5 / `chapter-8`, scene `arithmetic`): stages `["bin2dec","dec2bin","binadd"]` (`BIN_STAGES`). `state.binBookletDone`, `binFirstTryClean`, `binMenuResolved`. `binWalkthroughFinish` handles completion; when all three are first done it calls `goToBitsRange()` (the post-booklet plot dialogue), gated by `state.bitsRangeSeen` (also fired from `openBinaryBooklet` for players who finished earlier). Dev solve: Ctrl+Shift+9.
- **Task notes** (build-task lists): 2.2/2.3 = `state.taskDialog` (`renderNoteTaskDialog`, `currentNoteTaskDefs()`); 2.4 = `state.busesNoteList` (`renderBusesNoteList`, bus + multibit notes). Each has a "נקה התקדמות" button (`clearNoteProgress`) that wipes that note's completed tasks + first-try/hint bookkeeping (drives the re-do achievements).
- **Card creation** (createCardUnlocked): `enterCardCreation`/`exitCardCreation`; user cards in `state.savedCards` (type `usercard-N`); download/import as JSON; "My cards" page.
- **Warehouse hotspots** (`js/warehouse-hotspots.js`): click-zones over story panels, incl. Wikipedia reference links on non-game objects.

## Current plot state

Story runs chapters 1.1–2.5. Chapter 2.5 (`arithmetic` scene) currently ends
with: library → binary explanation → workshop → the binary booklet → (after
completing it) the "bits-range" von Neumann dialogue (121_2.5_bits-1–129_2.5_add-4) →
task handover (130_2.5_handover wordless, 131_2.5_doorway doorway speech, 134_2.5_worktable empty
worktable). The worktable's tasks-note zone (`arith-tasks-note`) is a
placeholder ("המשך יבוא...") — the arithmetic build tasks (2-digit adder,
3-digit adder, multi-digit adder) are NOT yet implemented.

## Testing (Playwright)

Chromium is preinstalled; DO NOT run `playwright install`. Pattern that works
here (proxy + `<object>` SVG frames make the defaults hang):

```js
const { chromium } = require('/home/user/TheOneMachine/node_modules/playwright');
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox']
});
const p = await b.newPage();                 // newPage, not newContext (per-context proxy)
await p.goto(URL, { waitUntil: 'commit' });  // 'commit', never networkidle/domcontentloaded
await p.evaluate(([k,v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, seed]);
await p.reload({ waitUntil: 'commit' });      // seed-then-reload; addInitScript gets normalized away
```

- Serve with `python3 -m http.server <port>` from the repo root; KEY = `nand2tetris-lomda-v12`.
- Seed realistic state: `settings:{pace:'step'|'all'}` (top-level `pace` is IGNORED — it must be under `settings`), `maxChapterReached` high enough to allow the chapter, plus the fields the screen needs. Give each test its own `browser.newContext()` (or clear localStorage) so state does not leak between checks.
- Use `node --check` for a quick syntax gate before running the browser.

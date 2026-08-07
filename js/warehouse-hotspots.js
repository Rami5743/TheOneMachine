(function () {
  "use strict";

  const STORAGE_KEY = (() => {
    try { return APP.storageKey; } catch { return "nand2tetris-lomda-v12"; }
  })();

  // --- Fallback geometry -----------------------------------------------------
  // The click-zones are defined inside the panel SVG files as invisible
  // <rect data-hotspot="..."> elements (opacity 0), so they can be moved and
  // resized in Inkscape. Each panel SVG also carries a tiny <script> that reads
  // those rects from INSIDE the SVG document and posts their positions to this
  // page (see readme). That works even when the courseware is opened directly
  // from disk (file://), where reading a separate SVG file is blocked.
  // These arrays are only a last-resort fallback, used when a panel SVG has no
  // hotspot script yet (e.g. an old SVG, or one saved from Inkscape in a mode
  // that stripped the script).
  const FALLBACK_ITEMS = [
    { id: "bulbs", label: "נורות חשמליות", url: "https://he.wikipedia.org/wiki/נורה_חשמלית", x: 76, y: 78, w: 22, h: 19 },
    { id: "triodes", label: "טריודות", url: "https://he.wikipedia.org/wiki/טריודה", x: 8, y: 78, w: 13, h: 18 },
    { id: "diode", label: "דיודה", url: "https://he.wikipedia.org/wiki/דיודה", x: 1, y: 81, w: 8, h: 13 },
    { id: "cable", label: "כבל חשמלי", url: "https://he.wikipedia.org/wiki/כבל_חשמלי", x: 72, y: 57, w: 13, h: 18 },
    { id: "source", label: "מקור מתח", url: "https://he.wikipedia.org/wiki/מקור_מתח", x: 88, y: 21, w: 9, h: 20 },
    { id: "voltmeter", label: "מד מתח", url: "https://he.wikipedia.org/wiki/וולטמטר", x: 26, y: 84, w: 18, h: 15 }
  ];

  const FALLBACK_TABLE = { label: "שולחן עבודה", x: 10, y: 50, w: 78, h: 49 };

  // Geometry posted by the panel SVGs, keyed by panel file stem. Each value is
  // { objects: [...], table: {...}|null, actions: { <action>: {x,y,w,h} } }.
  const svgPosted = Object.create(null);
  // Slides already moaned about for having no zones of their own (once each).
  const warnedFallback = Object.create(null);

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }

  function writeState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function imageFileStem(filename) {
    return String(filename || "")
      .split("?")[0]
      .split("#")[0]
      .split("/")
      .pop()
      .replace(/\.(png|svg)$/i, "");
  }

  function panelObject() {
    return document.querySelector(".image-shell .panel-image, .image-shell img, .image-shell object");
  }

  function currentImageName() {
    const image = panelObject();
    if (!image) return "";
    const raw = image.getAttribute("src") || image.getAttribute("data") || "";
    return String(raw).split("?")[0].split("/").pop();
  }

  function overlaysActive() {
    if (document.querySelector(".dialog-overlay,.note-task-overlay,.bit-overlay,.hint-overlay,.solution-overlay,.not-test-result-overlay,.workspace-accident-overlay,.workspace-task-intro-overlay")) return true;
    const state = readState();
    return Boolean(state.dialog || state.taskDialog || state.bitDialog || state.hintDialog || state.hintSlides || state.solutionDialog || state.notTest);
  }

  function warehouseKind() {
    if (overlaysActive()) return null;
    const stem = imageFileStem(currentImageName());
    if (stem === "077_2.1_nand-workshop-1943") return "chapter-4";
    if (stem === "090_2.2_simple-gates-worktable") return "chapter-5";
    if (stem === "096_2.3_worktable") return "chapter-6";
    if (stem === "102_2.4_worktable") return "chapter-7";
    if (stem === "109_2.4_worktable-next") return "chapter-7";
    // The 2.5 library / binary workshop: reference links only (no worktable /
    // free-build), driven entirely by the object rects the panel SVG posts.
    if (stem === "114_2.5_library-inside-v2") return "library";
    if (stem === "120_2.5_workshop") return "binary-workshop";
    // The 2.5 arithmetic worktable (post-handover) is the same room: it carries
    // the free-build table and the reference-link objects too, alongside its
    // tasks note.
    if (stem === "134_2.5_worktable") return "binary-workshop";
    // The 2.6 ALU worktable — same room and click-zones as panel119, but its own
    // kind so the free-build table returns to the ALU worktable (not the 2.5 one).
    if (stem === "140_2.6_alu-worktable") return "alu-worktable";
    // The 3.2 memory worktable — same room and click-zones as panel125, with its
    // own kind so the free-build table returns here (and its note is the memory one).
    if (stem === "153_3.2_memory-worktable") return "memory-worktable";
    // The 3.3 RAM worktable — the same room again, its own kind so the free-build
    // table returns here and its note is the RAM one.
    if (stem === "159_3.3_ram-worktable") return "ram-worktable";
    // The 3.4 ports worktable — same room again, its own kind so the free-build
    // table comes back here and the note it opens is the ports one.
    if (stem === "170_3.4_ports-worktable") return "ports-worktable";
    // The 3.5 program-memory worktable — the same room once more, its own kind so
    // the free-build table comes back here and its note is the Prg one. It was
    // missing entirely: the chapter was added after this list was written, so its
    // worktable had no room and therefore none of the click-zones its SVG draws.
    if (stem === "175_3.5_program-memory-worktable") return "prg-worktable";
    return null;
  }

  // --- Receiving hotspot geometry from the panel SVGs ------------------------
  // Each panel SVG posts { __warehouseHotspots: true, payload: { panel, ... } }.
  window.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data || data.__warehouseHotspots !== true || !data.payload) return;
    const payload = data.payload;
    // WHOSE geometry this is, is decided by WHO sent it — not by the name the SVG
    // writes about itself. Each panel SVG carries `var PANEL = "<its own name>"`,
    // and renaming the files left all seventeen of them announcing their old
    // name: the zones arrived, were filed under a name no slide has, and every
    // room quietly fell back to the hardcoded rectangles instead of the ones
    // placed in Inkscape. The message comes from the displayed panel's own
    // document, so file it under THAT panel and keep the declared name only as
    // an alias.
    const declared = imageFileStem(payload.panel);
    const showing = imageFileStem(currentImageName());
    const object = panelObject();
    const fromShownPanel = Boolean(object && object.contentWindow && event.source === object.contentWindow);
    const panel = fromShownPanel && showing ? showing : declared;
    if (!panel) return;
    const geometry = {
      objects: Array.isArray(payload.objects) ? payload.objects : [],
      table: payload.table || null,
      actions: payload.actions || {}
    };
    svgPosted[panel] = geometry;
    if (declared && declared !== panel) svgPosted[declared] = geometry;
    // Apply immediately now that we have fresh positions for this panel.
    patch();
  });

  // --- Reading the zones straight out of the panel document -----------------
  // The SVG posts its rects a few times right after IT loads. If the page is not
  // listening yet (a cached slide posts before this script has run), those
  // messages are simply lost and the room falls back to the hardcoded rectangles
  // — the same wrong zones, appearing at random. Over http the panel document is
  // same-origin, so we can just READ the rects ourselves and never depend on the
  // timing. The postMessage path stays for file://, where contentDocument is
  // blocked.
  function zonesFromPanelDocument() {
    const object = panelObject();
    let doc = null;
    try { doc = object && object.contentDocument; } catch (e) { doc = null; }
    if (!doc) return null;
    const svg = doc.querySelector("svg") || doc.documentElement;
    if (!svg || typeof svg.querySelectorAll !== "function") return null;
    const vb = svg.viewBox && svg.viewBox.baseVal;
    const VW = vb && vb.width ? vb.width : 1448;
    const VH = vb && vb.height ? vb.height : 1086;
    let rootM = null;
    try { rootM = svg.getScreenCTM(); } catch (e) { rootM = null; }
    // A rect's box in viewBox units, following whatever transforms its layers add.
    const box = (rect) => {
      let bb;
      try { bb = rect.getBBox(); } catch (e) { return null; }
      let m = null;
      try { if (rootM) m = rootM.inverse().multiply(rect.getScreenCTM()); } catch (e) { m = null; }
      if (!m) return { x: bb.x, y: bb.y, w: bb.width, h: bb.height };
      const map = (x, y) => ({ x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f });
      const p = [map(bb.x, bb.y), map(bb.x + bb.width, bb.y), map(bb.x, bb.y + bb.height), map(bb.x + bb.width, bb.y + bb.height)];
      const xs = p.map((q) => q.x), ys = p.map((q) => q.y);
      const minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
      const minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
      return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    };
    const pct = (rect) => {
      const b = box(rect);
      if (!b || !(b.w > 0) || !(b.h > 0)) return null;
      return { x: b.x / VW * 100, y: b.y / VH * 100, w: b.w / VW * 100, h: b.h / VH * 100 };
    };
    const rects = svg.querySelectorAll("[data-hotspot]");
    if (!rects.length) return null;
    const out = { objects: [], table: null, actions: {} };
    rects.forEach((rect) => {
      const kind = rect.getAttribute("data-hotspot");
      const g = pct(rect);
      if (!g) return;
      if (kind === "object") {
        out.objects.push({
          id: rect.getAttribute("data-id") || rect.id || "",
          label: rect.getAttribute("data-label") || "",
          url: rect.getAttribute("data-url") || "",
          x: g.x, y: g.y, w: g.w, h: g.h
        });
      } else if (kind === "table") {
        out.table = { label: rect.getAttribute("data-label") || "שולחן עבודה", x: g.x, y: g.y, w: g.w, h: g.h };
      } else if (kind === "action") {
        const action = rect.getAttribute("data-action");
        if (action) out.actions[action] = { x: g.x, y: g.y, w: g.w, h: g.h };
      }
    });
    if (!out.objects.length && !out.table && !Object.keys(out.actions).length) return null;
    return out;
  }

  function ensureStyle() {
    if (document.getElementById("warehouse-hotspots-style")) return;
    const style = document.createElement("style");
    style.id = "warehouse-hotspots-style";
    style.textContent = `
      .image-shell .panel-hotspot { z-index: 80; }
      .warehouse-object-hotspot,
      .warehouse-table-hotspot {
        position: absolute;
        border: 0;
        padding: 0;
        background: rgba(255,255,255,0.001);
        cursor: pointer;
        pointer-events: auto;
      }
      .warehouse-object-hotspot { z-index: 20; }
      .warehouse-table-hotspot { z-index: 5; }
      .warehouse-object-hotspot:hover,
      .warehouse-object-hotspot:focus-visible,
      .warehouse-table-hotspot:hover,
      .warehouse-table-hotspot:focus-visible {
        outline: 3px solid rgba(255,230,120,.8);
        outline-offset: 2px;
        border-radius: 14px;
        background: rgba(255,230,120,.08);
      }
      .warehouse-info-popover {
        position: absolute;
        z-index: 120;
        min-width: 90px;
        max-width: 210px;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(36,26,13,.85);
        background: rgba(249,244,232,.98);
        color: #1e1b16;
        box-shadow: 0 12px 30px rgba(0,0,0,.35);
        direction: rtl;
        font-size: .95rem;
        line-height: 1.35;
        text-align: center;
      }
      .warehouse-info-popover a {
        color: #2c55a2;
        font-weight: 700;
        text-decoration: underline;
      }
    `;
    document.head.append(style);
  }

  function removeHotspots() {
    document.querySelectorAll(".warehouse-object-hotspot,.warehouse-table-hotspot,.warehouse-info-popover").forEach((node) => node.remove());
  }

  function hidePopover() {
    document.querySelectorAll(".warehouse-info-popover").forEach((node) => node.remove());
  }

  function setOriginalHotspotsDisabled(disabled) {
    document.querySelectorAll(".panel-hotspot").forEach((node) => {
      if (disabled) {
        if (!node.dataset.warehouseHotspotsDisabled) {
          node.dataset.warehouseHotspotsDisabled = "1";
          node.dataset.warehouseHotspotsPreviousPointerEvents = node.style.pointerEvents || "";
          node.dataset.warehouseHotspotsPreviousTabIndex = node.getAttribute("tabindex") || "";
          node.style.pointerEvents = "none";
          node.setAttribute("tabindex", "-1");
        }
      } else if (node.dataset.warehouseHotspotsDisabled) {
        node.style.pointerEvents = node.dataset.warehouseHotspotsPreviousPointerEvents || "";
        if (node.dataset.warehouseHotspotsPreviousTabIndex) {
          node.setAttribute("tabindex", node.dataset.warehouseHotspotsPreviousTabIndex);
        } else {
          node.removeAttribute("tabindex");
        }
        delete node.dataset.warehouseHotspotsDisabled;
        delete node.dataset.warehouseHotspotsPreviousPointerEvents;
        delete node.dataset.warehouseHotspotsPreviousTabIndex;
      }
    });
  }

  // Move app.js's own <button class="panel-hotspot"> elements to the geometry
  // defined by the matching action rect in the SVG. app.js still renders these
  // buttons (from js/data.js) and owns their click behaviour; here we only make
  // the SVG the source of truth for WHERE each zone sits.
  function syncActionHotspots(shell, actions) {
    if (!actions) return;
    shell.querySelectorAll(".panel-hotspot").forEach((btn) => {
      const action = btn.dataset.action;
      if (!action) return;
      // A slide can carry several zones for the same action — two piles of the
      // same radioactive waste, say — so a zone is keyed by its object id when
      // it has one, and by the bare action otherwise.
      const objectId = btn.dataset.objectId;
      const geo = (objectId && actions[`${action}:${objectId}`]) || actions[action];
      if (!geo) return;
      btn.style.left = `${geo.x}%`;
      btn.style.top = `${geo.y}%`;
      btn.style.width = `${geo.w}%`;
      btn.style.height = `${geo.h}%`;
      btn.dataset.hotspotSvgSynced = "1";
    });
  }

  function addHotspot(shell, spec, className, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = className;
    b.style.left = `${spec.x}%`;
    b.style.top = `${spec.y}%`;
    b.style.width = `${spec.w}%`;
    b.style.height = `${spec.h}%`;
    b.setAttribute("aria-label", spec.label);
    b.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    });
    shell.append(b);
  }

  function showInfo(shell, item) {
    hidePopover();
    const pop = document.createElement("div");
    pop.className = "warehouse-info-popover";
    pop.style.left = `${Math.min(item.x + item.w, 82)}%`;
    pop.style.top = `${Math.max(2, item.y - 3)}%`;
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.label;
    link.addEventListener("click", () => {
      // Following a reference link from a non-game object earns "סקרן".
      try { if (typeof APP !== "undefined" && APP.unlockAchievement) APP.unlockAchievement("curious"); } catch {}
      window.setTimeout(hidePopover, 0);
    });
    pop.append(link);
    shell.append(pop);
  }

  // Each worktable chapter's free-build workspace: chapter id, its story scene,
  // and the worktable panel index the learner returns to on exit.
  const FREE_WORKSPACE = {
    "chapter-5": { chapterId: "chapter-5", sceneId: "simple-gates", panelIndex: 4 },
    "chapter-6": { chapterId: "chapter-6", sceneId: "complex-gates", panelIndex: 5 },
    "chapter-7": { chapterId: "chapter-7", sceneId: "buses", panelIndex: 5 },
    // The 2.5 binary workshop table opens a free workbench in chapter 2.5, so
    // every card unlocked through the earlier chapters is available.
    "binary-workshop": { chapterId: "chapter-8", sceneId: "arithmetic", panelIndex: 7 },
    // The 2.6 ALU worktable table opens a free workbench in chapter 2.6 (all cards
    // built through 2.5 available). Return goes to the current panel (panel125).
    "alu-worktable": { chapterId: "chapter-9", sceneId: "alu", panelIndex: 5 },
    // The 3.2 memory worktable table opens a free workbench in chapter 3.2 (every
    // card through 3.1 plus the FF/נעץ). Return goes to the worktable (panel135,
    // the 5th slide of the registers scene).
    "memory-worktable": { chapterId: "chapter-11", sceneId: "registers", panelIndex: 4 },
    // The 3.3 RAM worktable is the last slide of its own scene.
    "ram-worktable": { chapterId: "chapter-12", sceneId: "ram", panelIndex: 3 },
    "ports-worktable": { chapterId: "chapter-13", sceneId: "ports", panelIndex: 6 },
    "prg-worktable": { chapterId: "chapter-17", sceneId: "program-memory", panelIndex: 4 }
  };

  // The chapter 2.5 arithmetic worktable (panel119) — the post-von Neumann
  // worktable that carries the tasks note. Resolved live from the panel's image
  // (via the APP bridge) so it never goes stale when slides are inserted; the
  // constant is only a last-resort fallback.
  const ARITH_WORKTABLE_INDEX_FALLBACK = 21;
  function arithWorktableIndex() {
    try {
      if (typeof APP !== "undefined" && APP.panelIndexByImage) {
        const i = APP.panelIndexByImage("arithmetic", "134_2.5_worktable.svg");
        if (Number.isInteger(i) && i >= 0) return i;
      }
    } catch (e) {}
    return ARITH_WORKTABLE_INDEX_FALLBACK;
  }

  function openFreeWorkspace(kind = "chapter-5") {
    const state = readState();
    const target = FREE_WORKSPACE[kind] || FREE_WORKSPACE["chapter-5"];
    // Return to the worktable the learner actually opened the table from — the
    // original OR the next-tasks worktable (chapter 2.4 has both) — not a fixed
    // panel index. The table hotspot is only shown while on a worktable panel.
    // Exception: the 2.5 workshop table, once von Neumann's entrance has played
    // (bitsRangeSeen), returns to the arithmetic worktable that carries the tasks
    // note (panel119) rather than the pre-entrance workshop slide.
    const returnPanel = (kind === "binary-workshop" && state.bitsRangeSeen)
      ? arithWorktableIndex()
      : (Number.isInteger(state.panelIndex) ? state.panelIndex : target.panelIndex);
    state.screen = "workspace";
    state.chapterId = target.chapterId;
    state.sceneId = target.sceneId;
    state.panelIndex = returnPanel;
    state.dialog = null;
    state.taskDialog = null;
    state.notTest = null;
    state.hintDialog = null;
    state.hintSlides = null;
    state.solutionDialog = null;
    state.bitDialog = null;
    state.started = true;
    state.replayNonce = (Number(state.replayNonce) || 0) + 1;
    // The 2.5 workshop table is a free playground with everything the learner
    // could have built by now — including the "create new card" tool, enabled
    // here regardless of whether it was unlocked in this playthrough. cardIntroDone
    // is set too so enabling it does not re-arm the one-time scripted card intro.
    if (kind === "binary-workshop" || kind === "alu-worktable" || kind === "memory-worktable" || kind === "ram-worktable" || kind === "ports-worktable" || kind === "prg-worktable") {
      state.createCardUnlocked = true;
      state.cardIntroDone = true;
      state.cardIntroPending = false;
    }
    state.workspace = {
      selectedTerminal: null,
      // A single invisible fixed component prevents the app's normalizer from
      // restoring the default source+Nand+lamp set. It is not rendered on the
      // board, so the workbench opens visually empty.
      components: [{ id: "free-anchor-1", type: "notCard", x: 500, y: 288 }],
      wires: [],
      nextId: 2,
      unlocked: true,
      accident: null,
      helpPromptSeen: true,
      buildHelpButtonVisible: false,
      nandOutputObserved: { zero: false, one: false },
      understoodPromptShown: false,
      understoodButtonVisible: false,
      nandMonologueStep: null,
      workspaceLaunchPanelIndex: null,
      workspaceCompleted: false,
      workspaceSession: 2,
      exitTargetPanelIndex: state.panelIndex,
      returnToWorkspaceAfterMonologue: false,
      taskId: null,
      taskIntroSeen: true,
      sessionReturnChapterId: state.chapterId,
      sessionReturnPanelIndex: state.panelIndex,
      freeBuild: true
    };
    writeState(state);
    window.location.reload();
  }

  function patch() {
    const blocked = overlaysActive();
    setOriginalHotspotsDisabled(blocked);

    const shell = document.querySelector(".image-shell");
    const kind = warehouseKind();
    const stem = imageFileStem(currentImageName());
    // Prefer what the panel document itself says right now; fall back to whatever
    // it managed to post (the file:// path), and only then to the hardcoded set.
    let svgHotspots = svgPosted[stem] || null;
    if (!svgHotspots && stem) {
      const read = zonesFromPanelDocument();
      if (read) { svgPosted[stem] = read; svgHotspots = read; }
    }

    // Keep app.js's action buttons aligned with the SVG-defined rects, even
    // while an overlay is up (harmless: the buttons are invisible & disabled).
    if (shell && svgHotspots) syncActionHotspots(shell, svgHotspots.actions);

    if (blocked) {
      removeHotspots();
      return;
    }

    if (!kind || !shell) {
      removeHotspots();
      return;
    }

    // The warehouse fallback item set (bulbs/triodes/…) belongs only to the
    // worktable panels; the library / binary workshop show nothing until their
    // own SVG posts.
    const isWorktable = kind === "chapter-4" || kind === "chapter-5" || kind === "chapter-6" || kind === "chapter-7";
    const fallbackItems = isWorktable ? FALLBACK_ITEMS : [];
    const items = (svgHotspots && svgHotspots.objects.length) ? svgHotspots.objects : fallbackItems;
    const table = (svgHotspots && svgHotspots.table) ? svgHotspots.table : FALLBACK_TABLE;
    // Falling back is not a normal state — every room slide has its zones drawn
    // inside its SVG. Say so out loud ONCE per slide, so the next time the two
    // drift apart it is visible in the console instead of showing rectangles in
    // roughly-right places that nobody placed. The SVG posts as soon as it has
    // laid out, which is a moment AFTER the slide appears, so only complain once
    // that moment has clearly passed.
    if (!svgHotspots && stem && !warnedFallback[stem]) {
      warnedFallback[stem] = "pending";
      window.setTimeout(() => {
        if (svgPosted[stem] || imageFileStem(currentImageName()) !== stem) return;
        console.warn(`[hotspots] ${stem} posted no zones — falling back to the hardcoded rectangles. Its SVG's zones are not reaching the page.`);
      }, 3000);
    }
    const wantsTable = (kind === "chapter-5" || kind === "chapter-6" || kind === "chapter-7" || kind === "binary-workshop" || kind === "alu-worktable" || kind === "memory-worktable" || kind === "ram-worktable" || kind === "ports-worktable" || kind === "prg-worktable");

    // Signature of the geometry we intend to render. When a panel SVG posts new
    // positions (e.g. after an Inkscape edit) the signature changes and we
    // rebuild; when nothing changed we leave the existing hotspots untouched so
    // the 700ms tick does not cause flicker.
    const sig = kind + "|" + JSON.stringify(items) + "|" + (wantsTable ? JSON.stringify(table) : "none");

    ensureStyle();
    // The "already rendered" guard must recognise EITHER kind of injected
    // hotspot. On a table-only panel (the 2.5 workshop posts a table but its
    // object rects arrive a beat later) there is no object hotspot to find, so
    // keying the guard on the object hotspot alone would let every mutation tick
    // rebuild the table, and each rebuild re-triggers the observer — a runaway
    // loop. Matching the table hotspot too lets the guard settle.
    if (shell.querySelector(".warehouse-object-hotspot,.warehouse-table-hotspot") && shell.dataset.warehouseSig === sig) return;
    removeHotspots();
    shell.dataset.warehouseSig = sig;

    if (wantsTable) {
      addHotspot(shell, table, "warehouse-table-hotspot", () => {
        hidePopover();
        openFreeWorkspace(kind);
      });
    }

    items.forEach((item) => {
      addHotspot(shell, item, "warehouse-object-hotspot", () => showInfo(shell, item));
    });
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest(".warehouse-object-hotspot,.warehouse-info-popover")) return;
    hidePopover();
  });

  const observer = new MutationObserver(patch);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", patch);
  } else {
    patch();
  }
  window.setInterval(patch, 700);
})();

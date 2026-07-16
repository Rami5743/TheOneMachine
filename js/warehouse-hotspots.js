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
    if (stem === "panel74a") return "chapter-4";
    if (stem === "panel87_simple_gates_worktable") return "chapter-5";
    if (stem === "panel93_chapter_2_3_worktable") return "chapter-6";
    if (stem === "panel99_chapter_2_4_worktable") return "chapter-7";
    if (stem === "panel99g_chapter_2_4_worktable_next") return "chapter-7";
    return null;
  }

  // --- Receiving hotspot geometry from the panel SVGs ------------------------
  // Each panel SVG posts { __warehouseHotspots: true, payload: { panel, ... } }.
  window.addEventListener("message", (event) => {
    const data = event && event.data;
    if (!data || data.__warehouseHotspots !== true || !data.payload) return;
    const payload = data.payload;
    const panel = imageFileStem(payload.panel);
    if (!panel) return;
    svgPosted[panel] = {
      objects: Array.isArray(payload.objects) ? payload.objects : [],
      table: payload.table || null,
      actions: payload.actions || {}
    };
    // Apply immediately now that we have fresh positions for this panel.
    patch();
  });

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
      const geo = action && actions[action];
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
    link.addEventListener("click", () => window.setTimeout(hidePopover, 0));
    pop.append(link);
    shell.append(pop);
  }

  // Each worktable chapter's free-build workspace: chapter id, its story scene,
  // and the worktable panel index the learner returns to on exit.
  const FREE_WORKSPACE = {
    "chapter-5": { chapterId: "chapter-5", sceneId: "simple-gates", panelIndex: 4 },
    "chapter-6": { chapterId: "chapter-6", sceneId: "complex-gates", panelIndex: 5 },
    "chapter-7": { chapterId: "chapter-7", sceneId: "buses", panelIndex: 5 }
  };

  function openFreeWorkspace(kind = "chapter-5") {
    const state = readState();
    const target = FREE_WORKSPACE[kind] || FREE_WORKSPACE["chapter-5"];
    // Return to the worktable the learner actually opened the table from — the
    // original OR the next-tasks worktable (chapter 2.4 has both) — not a fixed
    // panel index. The table hotspot is only shown while on a worktable panel.
    const returnPanel = Number.isInteger(state.panelIndex) ? state.panelIndex : target.panelIndex;
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
    const svgHotspots = svgPosted[stem] || null;

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

    const items = (svgHotspots && svgHotspots.objects.length) ? svgHotspots.objects : FALLBACK_ITEMS;
    const table = (svgHotspots && svgHotspots.table) ? svgHotspots.table : FALLBACK_TABLE;
    const wantsTable = (kind === "chapter-5" || kind === "chapter-6" || kind === "chapter-7");

    // Signature of the geometry we intend to render. When a panel SVG posts new
    // positions (e.g. after an Inkscape edit) the signature changes and we
    // rebuild; when nothing changed we leave the existing hotspots untouched so
    // the 700ms tick does not cause flicker.
    const sig = kind + "|" + JSON.stringify(items) + "|" + (wantsTable ? JSON.stringify(table) : "none");

    ensureStyle();
    if (shell.querySelector(".warehouse-object-hotspot") && shell.dataset.warehouseSig === sig) return;
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

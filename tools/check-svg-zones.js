// Do the click-zones a room slide shows come from ITS OWN SVG?
//
// The zones are invisible <rect data-hotspot="…"> elements inside each panel
// SVG (so they can be moved in Inkscape); a tiny script inside the SVG posts
// their positions to the page. Two things have silently broken that chain
// before: the room lookup keyed on the panel's old file name, and every SVG
// announcing its old name in `var PANEL = "…"`. Either one leaves the page
// drawing the hardcoded fallback rectangles instead — zones nobody placed, in
// roughly-plausible places, which is very hard to notice by eye.
//
// This reads the rects straight out of each SVG, opens the slide in a browser,
// and checks that every zone on screen sits where the SVG says (±0.6%).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const KEY = 'nand2tetris-lomda-v12';
const URL = process.env.URL || 'http://127.0.0.1:8199/index.html';

// slide file -> the chapter/scene it is reached in
const ROOMS = [
  ['090_2.2_simple-gates-worktable.svg', 'chapter-5', 'simple-gates'],
  ['096_2.3_worktable.svg', 'chapter-6', 'routing'],
  ['102_2.4_worktable.svg', 'chapter-7', 'buses'],
  ['109_2.4_worktable-next.svg', 'chapter-7', 'buses'],
  ['114_2.5_library-inside-v2.svg', 'chapter-8', 'arithmetic'],
  ['120_2.5_workshop.svg', 'chapter-8', 'arithmetic'],
  ['134_2.5_worktable.svg', 'chapter-8', 'arithmetic'],
  ['140_2.6_alu-worktable.svg', 'chapter-9', 'alu'],
  ['153_3.2_memory-worktable.svg', 'chapter-11', 'registers'],
  ['159_3.3_ram-worktable.svg', 'chapter-12', 'ram'],
  ['170_3.4_ports-worktable.svg', 'chapter-13', 'ports'],
  ['175_3.5_program-memory-worktable.svg', 'chapter-17', 'program-memory'],
  // The two 4.x rooms are not worktables — they have no object/table zones of
  // their own — but every clickable thing in them (the racks, each port, the
  // note, and the floor that opens the free table) is an ACTION rect, so the
  // same check applies.
  ['231_4.1_empty-room.svg', 'chapter-15', 'simple-computer'],
  ['235_4.2_build-room.svg', 'chapter-16', 'build-simple-computer'],
  ['244_4.3_program-room.svg', 'chapter-18', 'simple-programming'],
  ['259_4.4_build-room.svg', 'chapter-19', 'conditional-jump'],
  ['273_5.1_demo-room.svg', 'chapter-20', 'demonstrations'],
  // The same room once the first demonstration is written: the two counters are
  // off the floor, so it carries sixteen zones where 273 carries eighteen. The
  // app only stands on it while that demonstration is done — otherwise it moves
  // the learner to 273 — so the fourth field ticks the task that makes it real.
  ['274_5.1_demo-room-done.svg', 'chapter-20', 'demonstrations', ['demo-infinite-loop']],
  // 5.2's room: the same art and the same zones once more, with its own note.
  ['279_5.2_room.svg', 'chapter-21', 'conditions']
];
const ALL_TASKS = ['Not','And','Or','Xor','Mux','DMux','Not4','Not16','AND4','AND16','OR4','Neq0_4','Neq0_16','MUX4','MUX16','Dmux4way','Mux4way16','halfAdder','fullAdder','Add4','Add16','Inc','ALU0','PreperNum','ALU1','ALU2','ALU3','ALU4','Register4','Register','RAM4','RAM16','RAM64','RAM256','RAM1024','OPorts','IPorts','Ports','RAM','Prg'];

function svgZones(file) {
  const text = fs.readFileSync(path.join(ROOT, 'assets/panels', file), 'utf8');
  const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(text);
  const VW = vb ? Number(vb[1]) : 1448;
  const VH = vb ? Number(vb[2]) : 1086;
  const declared = /var PANEL = "([^"]*)"/.exec(text);
  const zones = [];
  for (const m of text.matchAll(/<rect[^>]*data-hotspot="([^"]*)"[^>]*>/g)) {
    const tag = m[0];
    const attr = (name) => (new RegExp(`${name}="([^"]*)"`).exec(tag) || [, ''])[1];
    const label = attr('data-label') || attr('data-id') || attr('id');
    const x = Number(attr('x')), y = Number(attr('y'));
    const w = Number(attr('width')), h = Number(attr('height'));
    if (!(w > 0) || !(h > 0)) continue;
    zones.push({ kind: m[1], label, x: x / VW * 100, y: y / VH * 100, w: w / VW * 100, h: h / VH * 100 });
  }
  return { declared: declared ? declared[1] : null, zones, stem: file.replace(/\.svg$/, '') };
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  let bad = 0;
  for (const [file, chapterId, sceneId, extraTasks] of ROOMS) {
    // Some slides only exist once certain work is done.
    const tasks = ALL_TASKS.concat(extraTasks || []);
    const info = svgZones(file);
    const problems = [];
    if (info.declared !== info.stem) problems.push(`the SVG calls itself "${info.declared}"`);
    const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
    p.on('pageerror', (e) => problems.push(`page error: ${e.message.slice(0, 120)}`));
    await p.goto(URL, { waitUntil: 'commit' });
    await p.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, {
      screen: 'story', chapterId, sceneId, panelIndex: 0, maxChapterReached: 20, started: true,
      settings: { pace: 'all' }, completedTasks: tasks,
      workspace: { components: [], wires: [], nextId: 1 }
    }]);
    await p.reload({ waitUntil: 'commit' });
    await p.waitForSelector('.screen', { timeout: 15000 });
    const at = await p.evaluate((img) => {
      const key = 'nand2tetris-lomda-v12';
      const s = JSON.parse(localStorage.getItem(key));
      const scene = SCENES[s.sceneId];
      const i = scene ? scene.panels.findIndex((pp) => String(pp.image || '').includes(img)) : -1;
      if (i >= 0) { s.panelIndex = i; localStorage.setItem(key, JSON.stringify(s)); }
      return i;
    }, file);
    if (at < 0) { console.log(`✗ ${file}: not in scene ${sceneId}`); bad++; await p.close(); continue; }
    // Land ON the slide: the app normalises the saved state on boot and can move
    // the panel index, so check what is actually displayed and try again if it is
    // not ours. (Measuring a different slide reads as "this room has no zones".)
    let displayed = '';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await p.reload({ waitUntil: 'commit' });
      await p.waitForSelector('.image-shell object, .image-shell img', { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(1200);
      displayed = await p.evaluate(() => {
        const o = document.querySelector('.image-shell object, .image-shell img');
        return o ? String(o.getAttribute('data') || o.getAttribute('src') || '').split('?')[0].split('/').pop() : '';
      });
      if (displayed === file) break;
      await p.evaluate(([img]) => {
        const key = 'nand2tetris-lomda-v12';
        const s = JSON.parse(localStorage.getItem(key));
        const scene = SCENES[s.sceneId];
        const i = scene ? scene.panels.findIndex((pp) => String(pp.image || '').includes(img)) : -1;
        if (i >= 0) { s.panelIndex = i; localStorage.setItem(key, JSON.stringify(s)); }
      }, [file]);
    }
    if (displayed !== file) problems.push(`the app shows ${displayed || 'nothing'} instead of this slide`);
    // The SVG posts its rects once it has laid out, which can take a moment on a
    // heavy slide — wait for zones rather than guessing a delay.
    const wantsOwnZones = info.zones.some((z) => z.kind !== 'action');
    if (wantsOwnZones) {
      await p.waitForSelector('.warehouse-object-hotspot,.warehouse-table-hotspot', { timeout: 12000 })
        .catch(() => {});
    }
    await p.waitForTimeout(1200);
    const overlay = await p.$eval('body', (bd) => {
      const o = bd.querySelector('[class*="-overlay"]');
      return o ? o.className : '';
    }).catch(() => '');
    if (overlay) problems.push(`an overlay is up (${overlay}) — zones are hidden while one is`);
    const shown = await p.evaluate(() => Array
      .from(document.querySelectorAll('.warehouse-object-hotspot,.warehouse-table-hotspot,.panel-hotspot'))
      .map((z) => ({
        label: z.getAttribute('aria-label') || '',
        action: z.getAttribute('data-action') || '',
        x: parseFloat(z.style.left), y: parseFloat(z.style.top),
        w: parseFloat(z.style.width), h: parseFloat(z.style.height)
      }))
      .filter((z) => Number.isFinite(z.x)));
    // Every object/table rect in the SVG must be on screen where the SVG puts it.
    for (const zone of info.zones.filter((z) => z.kind !== 'action')) {
      const near = shown.find((s) => Math.abs(s.x - zone.x) < 0.6 && Math.abs(s.y - zone.y) < 0.6);
      if (!near) problems.push(`"${zone.label}" is not on screen at ${zone.x.toFixed(1)},${zone.y.toFixed(1)}`);
    }
    // And the ACTION rects: app.js draws those buttons (the tasks note, the nail
    // box, the converters); the SVG only says WHERE. Each must have been moved
    // onto its rect.
    for (const zone of info.zones.filter((z) => z.kind === 'action')) {
      const near = shown.find((s) => Math.abs(s.x - zone.x) < 0.6 && Math.abs(s.y - zone.y) < 0.6);
      if (!near) problems.push(`action zone ${zone.label || '?'} is not aligned at ${zone.x.toFixed(1)},${zone.y.toFixed(1)}`);
    }
    if (!shown.length) problems.push('no zones on screen at all');
    if (problems.length) { bad++; console.log(`✗ ${file}: ${problems.join(' | ')}`); }
    else console.log(`ok ${file} — ${info.zones.length} zone(s), all from its own SVG`);
    await p.close();
  }
  await b.close();
  console.log(bad ? `\n${bad} room(s) are not using their SVG's zones` : '\nevery room draws the zones from its own SVG');
  process.exit(bad ? 1 : 0);
})();

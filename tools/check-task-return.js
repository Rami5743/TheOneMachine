// Finish PC0 for real (its own solution, its own check) and report where the app
// puts the learner afterwards: which screen, which slide, and which note is open.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const KEY = 'nand2tetris-lomda-v12';
const DIR = '/home/user/TheOneMachine/assets/solutions';
const OUT = '/tmp/claude-0/-home-user-TheOneMachine/b01c0f26-4f74-531b-8044-3d41d11a9025/scratchpad';
const task = process.argv[2] || 'PC0';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const doc = JSON.parse(fs.readFileSync(`${DIR}/${task}.json`, 'utf8'));
  const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await p.goto('http://127.0.0.1:8199/index.html', { waitUntil: 'commit' });
  await p.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, {
    screen: 'workspace', chapterId: 'chapter-16', sceneId: 'build-simple-computer',
    panelIndex: 3, maxChapterReached: 20, settings: { pace: 'all' },
    completedTasks: ['Register','Inc','MUX16','ALU4','Dmux4way','RAM1024','RAM','Prg'],
    workspace: {
      components: [{ id: doc.frame.id, type: doc.frame.type, x: doc.frame.x, y: doc.frame.y },
        ...(doc.external || []), ...doc.components],
      wires: doc.wires, nextId: 40, unlocked: true, helpPromptSeen: true, workspaceSession: 2,
      clocked: true, busClocked: true, taskId: task, taskIntroSeen: true,
      sessionReturnChapterId: 'chapter-16', sessionReturnPanelIndex: 3
    }
  }]);
  await p.reload({ waitUntil: 'commit' });
  await p.waitForSelector('.screen', { timeout: 15000 });
  await p.waitForTimeout(1600);
  await p.click('[data-action="check-not-task"]');
  await p.waitForTimeout(6000);
  const ok = await p.$eval('.not-test-result-card, .dialog-card, .pace-dialog-card',
    (e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)).catch(() => 'NO RESULT');
  console.log('check said:', ok);
  const confirm = await p.$('text=אישור');
  if (confirm) await confirm.click();
  await p.waitForTimeout(1500);
  // walk the solution walkthrough to its end — that is where the routing happens
  for (let i = 0; i < 20; i += 1) {
    const next = await p.$('[data-action="solution-next"]');
    if (next) { await next.click(); await p.waitForTimeout(600); continue; }
    const ok = await p.$('[data-action="solution-ok"]');
    if (ok) { await ok.click(); await p.waitForTimeout(1500); break; }
    break;
  }
  await p.waitForTimeout(1500);
  const where = await p.evaluate((k) => {
    const s = JSON.parse(localStorage.getItem(k));
    return { screen: s.screen, chapterId: s.chapterId, sceneId: s.sceneId, panelIndex: s.panelIndex,
      buses: s.busesNoteList, build: s.buildNoteList, prg: s.prgNoteList, ports: s.portsNoteList,
      solutionDialog: s.solutionDialog, wsTask: s.workspace && s.workspace.taskId,
      completed: s.completedTasks };
  }, KEY);
  console.log('landed on:', JSON.stringify(where));
  const noteTitle = await p.$eval('.note-card h2, .note-list h2, .note-title',
    (e) => e.textContent.trim()).catch(() => '(no note heading)');
  console.log('note heading:', noteTitle);
  await p.screenshot({ path: `${OUT}/after-${task}.png` });
  await b.close();
})();

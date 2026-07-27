const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const p = await b.newPage(); p.on('pageerror', e=>console.log('PAGEERROR',e.message));
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8271/index.html';
  // Seed the memory worktable (panel135, idx7) so we can open the note -> Register4
  const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:[] };
  await p.goto(URL,{waitUntil:'commit'});
  await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
  await p.reload({waitUntil:'commit'}); await p.waitForTimeout(900);
  const clk = async (s)=>{const e=await p.$(s); if(!e) throw new Error('missing '+s); await e.click({force:true}); await p.waitForTimeout(200);};
  await clk("[data-action='memory-tasks-note']");
  await clk("[data-action='memory-note-task'][data-task-id='Register4']");
  await p.waitForTimeout(600);
  const st = await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nand2tetris-lomda-v12'));return {screen:s.screen, taskId:s.workspace?.taskId, clocked:s.workspace?.clocked, busClocked:s.workspace?.busClocked, comps:(s.workspace?.components||[]).map(c=>c.type)};});
  console.log('after open Register4:', JSON.stringify(st));
  const palette = await p.$$eval('.toolbox-component span', els=>els.map(e=>e.textContent));
  console.log('palette:', JSON.stringify(palette));
  const shell = await p.$('.workspace-task-shell-layer *');
  const reqText = await p.$eval('.not-task-hint, .requirements, [data-requirements], .multibit-requirements', e=>e.textContent).catch(()=>null);
  console.log('task shell present:', !!shell, '| requirements snippet:', (reqText||'').replace(/\s+/g,' ').slice(0,60));
  const ffCount = await p.$$eval('g.component-ffCard', els=>els.length);
  const clockPill = await p.$('.clock-display');
  console.log('ffCard count on board:', ffCount, '| clock running display:', !!clockPill);
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

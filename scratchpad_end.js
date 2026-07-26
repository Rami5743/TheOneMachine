const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const p = await b.newPage(); p.on('pageerror', e=>console.log('PAGEERROR',e.message));
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8261/index.html';
  // flipflop scene panels: 128,129,130,131,132,133,134,135,136,137 -> good_work=idx8, night=idx9
  for (const idx of [8,9]) {
    const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:idx, started:true, maxChapterReached:20, settings:{pace:'all'} };
    await p.goto(URL,{waitUntil:'commit'});
    await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
    await p.reload({waitUntil:'commit'}); await p.waitForTimeout(800);
    const img = await p.$eval('.image-shell object', e=>e.getAttribute('data')).catch(()=>null);
    console.log('idx',idx,'img',img);
  }
  // verify panel135 continue -> 136 -> 137
  const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'} };
  await p.goto(URL,{waitUntil:'commit'});
  await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
  await p.reload({waitUntil:'commit'}); await p.waitForTimeout(700);
  for (let i=0;i<2;i++){ const c=await p.$("[data-action='next']")||await p.$("[data-action='continue']"); await c.click(); await p.waitForTimeout(500); }
  const st = await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nand2tetris-lomda-v12'));return {screen:s.screen,panelIndex:s.panelIndex};});
  const img = await p.$eval('.image-shell object', e=>e.getAttribute('data')).catch(()=>null);
  console.log('135 ->continue x2 ->', JSON.stringify(st), img);
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

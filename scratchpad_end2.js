const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8262/index.html';
  // fresh context per index
  for (const idx of [8,9]) {
    const ctx = await b.newContext(); const p = await ctx.newPage();
    const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:idx, started:true, maxChapterReached:20, settings:{pace:'all'} };
    await p.goto(URL,{waitUntil:'commit'});
    await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
    await p.reload({waitUntil:'commit'}); await p.waitForTimeout(1000);
    const img = await p.$eval('.image-shell object', e=>e.getAttribute('data')).catch(()=>null);
    console.log('idx',idx,'->',img);
    await ctx.close();
  }
  // continue chain from 135
  const ctx = await b.newContext(); const p = await ctx.newPage();
  const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'} };
  await p.goto(URL,{waitUntil:'commit'});
  await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
  await p.reload({waitUntil:'commit'}); await p.waitForTimeout(800);
  for (let i=0;i<2;i++){
    const c=await p.$("[data-action='next']")||await p.$("[data-action='continue']");
    await c.click(); await p.waitForTimeout(600);
    const st = await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nand2tetris-lomda-v12'));return s.screen+':'+s.panelIndex;});
    console.log('after continue',i+1,'->',st);
  }
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

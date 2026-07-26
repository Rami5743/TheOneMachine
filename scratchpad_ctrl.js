const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8263/index.html';
  for (const idx of [5,7]) { // 5=panel133 (normal), 7=panel135 (worktable)
    const ctx=await b.newContext(); const p=await ctx.newPage();
    const seed = { screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:idx, started:true, maxChapterReached:20, settings:{pace:'all'} };
    await p.goto(URL,{waitUntil:'commit'});
    await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
    await p.reload({waitUntil:'commit'}); await p.waitForTimeout(800);
    const btns = await p.$$eval('.controls [data-action]', els=>els.map(e=>({a:e.getAttribute('data-action'), dis:e.disabled||e.getAttribute('aria-disabled')})));
    console.log('idx',idx,'controls:',JSON.stringify(btns));
    await ctx.close();
  }
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

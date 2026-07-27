const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8282/index.html';
  const ctx=await b.newContext(); const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  const seed={ screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:["Register4"] };
  await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(800);
  const clk=async(s)=>{const e=await p.$(s); await e.click({force:true}); await p.waitForTimeout(250);};
  await clk("[data-action='memory-tasks-note']"); await clk("[data-action='memory-note-task'][data-task-id='Register']");
  await p.waitForTimeout(500);
  const pal=await p.$$eval('.toolbox-component span', els=>els.map(e=>e.textContent));
  console.log('Register4 in palette:', pal.includes('Register4'), '| tail:', JSON.stringify(pal.slice(-7)));
  // and NOT offered before it is completed
  await ctx.close();
  const ctx2=await b.newContext(); const p2=await ctx2.newPage();
  const seed2={ screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:[] };
  await p2.goto(URL,{waitUntil:'commit'}); await p2.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed2]); await p2.reload({waitUntil:'commit'}); await p2.waitForTimeout(800);
  const clk2=async(s)=>{const e=await p2.$(s); await e.click({force:true}); await p2.waitForTimeout(250);};
  await clk2("[data-action='memory-tasks-note']"); await clk2("[data-action='memory-note-task'][data-task-id='Register4']");
  await p2.waitForTimeout(400);
  const pal2=await p2.$$eval('.toolbox-component span', els=>els.map(e=>e.textContent));
  console.log('During Register4 build, Register4 tool absent (correct):', !pal2.includes('Register4'));
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

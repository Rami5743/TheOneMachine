const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8295/index.html';
  const allErrs=[];
  // Walk every chapter-10 panel
  for (let idx=0; idx<10; idx++){
    const ctx=await b.newContext(); const p=await ctx.newPage(); p.on('pageerror',e=>allErrs.push(`panel${idx}: ${e.message}`));
    const seed={ screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:idx, started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:["Register4","Register"] };
    await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(600);
    const img=await p.$eval('.image-shell object', e=>e.getAttribute('data')).catch(()=>null);
    process.stdout.write(`${idx}:${(img||'?').replace('assets/panels/panel','p').replace('.svg','')}  `);
    await ctx.close();
  }
  console.log('');
  // Spot-check earlier chapters still render (2.5 worktable + 2.6 worktable)
  for (const [ch,sc,idx,label] of [["chapter-8","arithmetic",0,"2.5 start"],["chapter-9","alu",0,"2.6 start"],["chapter-7","buses",0,"2.4 start"]]){
    const ctx=await b.newContext(); const p=await ctx.newPage(); p.on('pageerror',e=>allErrs.push(`${label}: ${e.message}`));
    const seed={ screen:'story', chapterId:ch, sceneId:sc, panelIndex:idx, started:true, maxChapterReached:20, settings:{pace:'all'} };
    await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(600);
    const ok=await p.$('.image-shell object'); console.log(label,'renders:',!!ok);
    await ctx.close();
  }
  console.log('TOTAL PAGE ERRORS:', allErrs.length? JSON.stringify(allErrs):'none');
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

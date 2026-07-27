const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8281/index.html';
  // Register built from FOUR gate-Register4 blocks (4 bits each = 16).
  const comps=[{ id:"task-card-1", type:"taskCard-Register", x:640, y:430 },
    { id:"spin", type:"splitter", x:420, y:430, outputs:4, legWidths:[4,4,4,4], singleWidth:16, mirrored:false },
    { id:"spout", type:"splitter", x:860, y:430, outputs:4, legWidths:[4,4,4,4], singleWidth:16, mirrored:true }];
  const wires=[{ a:"task-card-1.inputInt1", b:"spin.single" },{ a:"spout.single", b:"task-card-1.outputInt1" }];
  for (let i=0;i<4;i++){ comps.push({ id:`r${i}`, type:"gate-Register4", x:640, y:280+i*100 });
    wires.push({ a:`spin.leg${i}`, b:`r${i}.in1` }); wires.push({ a:"task-card-1.inputInt2", b:`r${i}.in2` }); wires.push({ a:`r${i}.out`, b:`spout.leg${i}` }); }
  const ws={ unlocked:true, clocked:true, busClocked:true, taskId:"Register", taskIntroSeen:true, helpPromptSeen:true, workspaceSession:2, nextId:99, sessionReturnChapterId:"chapter-10", sessionReturnPanelIndex:7, components:comps, wires };
  async function run(label, mutate){
    const w=JSON.parse(JSON.stringify(ws)); if(mutate) mutate(w);
    const ctx=await b.newContext(); const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PAGEERROR',e.message));
    const seed={ screen:"workspace", chapterId:"chapter-10", sceneId:"flipflop", started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:["Register4"], workspace:w };
    await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(900);
    await (await p.$("[data-action='check-not-task']")).click({force:true}); await p.waitForTimeout(600);
    const txt=await p.evaluate(()=>document.body.innerText);
    console.log(label,'-> success:',txt.includes("הבדיקה הצליחה"),'| fail:',txt.includes("הבדיקה נכשלה"));
    await ctx.close();
  }
  await run("Register from 4x Register4 gates", null);
  await run("  ...with one block's control missing", (w)=>{ w.wires=w.wires.filter(x=>!(x.a==="task-card-1.inputInt2"&&x.b==="r2.in2")); });
  // toolbar: Register4 appears as a tool once completed
  {
    const ctx=await b.newContext(); const p=await ctx.newPage();
    const seed={ screen:'story', chapterId:'chapter-10', sceneId:'flipflop', panelIndex:7, started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:["Register4"] };
    await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(800);
    const clk=async(s)=>{const e=await p.$(s); await e.click({force:true}); await p.waitForTimeout(250);};
    await clk("[data-action='memory-tasks-note']"); await clk("[data-action='memory-note-task'][data-task-id='Register']");
    await p.waitForTimeout(500);
    const pal=await p.$$eval('.toolbox-component span', els=>els.map(e=>e.textContent));
    console.log('Register4 in palette:', pal.includes('Register4'), '| tail:', JSON.stringify(pal.slice(-6)));
    await ctx.close();
  }
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

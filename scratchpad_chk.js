const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8273/index.html';

  // Build a CORRECT Register4 workspace: input splitter -> 4 FFs -> output splitter; control -> all 4.
  const ff = (i)=>({ id:`ff-${i}`, type:"ffCard", x:640, y:280+(i-1)*100 });
  const correct = {
    unlocked:true, clocked:true, busClocked:true, taskId:"Register4", taskIntroSeen:true,
    helpPromptSeen:true, workspaceSession:2, nextId:9,
    sessionReturnChapterId:"chapter-10", sessionReturnPanelIndex:7,
    components:[
      { id:"task-card-1", type:"taskCard-Register4", x:640, y:430 },
      ff(1),ff(2),ff(3),ff(4),
      { id:"spin", type:"splitter", x:470, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:false },
      { id:"spout", type:"splitter", x:820, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:true }
    ],
    wires:[
      { a:"task-card-1.inputInt1", b:"spin.single" },
      { a:"spin.leg0", b:"ff-1.in1" },{ a:"spin.leg1", b:"ff-2.in1" },{ a:"spin.leg2", b:"ff-3.in1" },{ a:"spin.leg3", b:"ff-4.in1" },
      { a:"task-card-1.inputInt2", b:"ff-1.in2" },{ a:"task-card-1.inputInt2", b:"ff-2.in2" },{ a:"task-card-1.inputInt2", b:"ff-3.in2" },{ a:"task-card-1.inputInt2", b:"ff-4.in2" },
      { a:"ff-1.out", b:"spout.leg0" },{ a:"ff-2.out", b:"spout.leg1" },{ a:"ff-3.out", b:"spout.leg2" },{ a:"ff-4.out", b:"spout.leg3" },
      { a:"spout.single", b:"task-card-1.outputInt1" }
    ]
  };
  async function runCase(label, mutate) {
    const ws = JSON.parse(JSON.stringify(correct));
    if (mutate) mutate(ws);
    const ctx = await b.newContext(); const p = await ctx.newPage(); p.on('pageerror', e=>console.log('PAGEERROR',e.message));
    const seed = { screen:"workspace", chapterId:"chapter-10", sceneId:"flipflop", started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:[], workspace: ws };
    await p.goto(URL,{waitUntil:'commit'});
    await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]);
    await p.reload({waitUntil:'commit'}); await p.waitForTimeout(900);
    await (await p.$("[data-action='check-not-task']")).click({force:true});
    await p.waitForTimeout(600);
    const res = await p.evaluate(()=>JSON.parse(localStorage.getItem('nand2tetris-lomda-v12')).notTest);
    // notTest not persisted? read from DOM instead
    const dialog = await p.evaluate(()=>document.body.innerText);
    const ok = /הצלחת|כל הכבוד|עבר|success/i.test(dialog);
    const fail = /לא עבר|נכשל|שגיאה|נסה/i.test(dialog);
    console.log(label, '-> notTest:', JSON.stringify(res), '| dialogHasSuccessWord:', ok, '| fail:', fail);
    await ctx.close();
  }
  await runCase("CORRECT", null);
  await runCase("NO-CONTROL (ff never loads)", (ws)=>{ ws.wires = ws.wires.filter(w=>!(w.a==="task-card-1.inputInt2")); });
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

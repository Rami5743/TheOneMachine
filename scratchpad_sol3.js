const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8293/index.html';
  const ff=(i)=>({ id:`ff-${i}`, type:"ffCard", x:640, y:280+(i-1)*100 });
  function mk(taskId, extra){ return Object.assign({ unlocked:true, clocked:true, busClocked:true, taskId, taskIntroSeen:true, helpPromptSeen:true, workspaceSession:2, nextId:9, sessionReturnChapterId:"chapter-10", sessionReturnPanelIndex:7 }, extra); }
  const r4 = mk("Register4", {
    components:[{ id:"task-card-1", type:"taskCard-Register4", x:640, y:430 }, ff(1),ff(2),ff(3),ff(4),
      { id:"spin", type:"splitter", x:470, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:false },
      { id:"spout", type:"splitter", x:820, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:true }],
    wires:[{ a:"task-card-1.inputInt1", b:"spin.single" },
      { a:"spin.leg0", b:"ff-1.in1" },{ a:"spin.leg1", b:"ff-2.in1" },{ a:"spin.leg2", b:"ff-3.in1" },{ a:"spin.leg3", b:"ff-4.in1" },
      { a:"task-card-1.inputInt2", b:"ff-1.in2" },{ a:"task-card-1.inputInt2", b:"ff-2.in2" },{ a:"task-card-1.inputInt2", b:"ff-3.in2" },{ a:"task-card-1.inputInt2", b:"ff-4.in2" },
      { a:"ff-1.out", b:"spout.leg0" },{ a:"ff-2.out", b:"spout.leg1" },{ a:"ff-3.out", b:"spout.leg2" },{ a:"ff-4.out", b:"spout.leg3" },
      { a:"spout.single", b:"task-card-1.outputInt1" }] });
  // Register from 4x Register4
  const rcomps=[{ id:"task-card-1", type:"taskCard-Register", x:640, y:430 },
    { id:"spin", type:"splitter", x:450, y:430, outputs:4, legWidths:[4,4,4,4], singleWidth:16, mirrored:false },
    { id:"spout", type:"splitter", x:840, y:430, outputs:4, legWidths:[4,4,4,4], singleWidth:16, mirrored:true }];
  const rwires=[{ a:"task-card-1.inputInt1", b:"spin.single" },{ a:"spout.single", b:"task-card-1.outputInt1" }];
  for(let i=0;i<4;i++){ rcomps.push({id:`r${i}`,type:"gate-Register4",x:640,y:280+i*100});
    rwires.push({a:`spin.leg${i}`,b:`r${i}.in1`}); rwires.push({a:"task-card-1.inputInt2",b:`r${i}.in2`}); rwires.push({a:`r${i}.out`,b:`spout.leg${i}`}); }
  const rg = mk("Register", { components:rcomps, wires:rwires });

  async function run(label, ws, completedBefore, expectStepText){
    const ctx=await b.newContext(); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    const seed={ screen:"workspace", chapterId:"chapter-10", sceneId:"flipflop", started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:completedBefore, workspace:ws };
    await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(1000);
    await (await p.$("[data-action='check-not-task']")).click({force:true}); await p.waitForTimeout(500);
    await (await p.$("[data-action='not-test-ok']")).click({force:true}); await p.waitForTimeout(700);
    const body=await p.evaluate(()=>document.body.innerText);
    console.log(label,'| walkthrough step1:', body.includes(expectStepText));
    for (let i=0;i<8;i++){ const n=await p.$("[data-action='solution-next']"); if(!n) break; await n.click({force:true}); await p.waitForTimeout(300); }
    const okb=await p.$("[data-action='solution-ok']"); if(okb){ await okb.click({force:true}); await p.waitForTimeout(800); }
    const st=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nand2tetris-lomda-v12'));return {screen:s.screen,panelIndex:s.panelIndex,completed:s.completedTasks,note:s.memoryNoteList};});
    console.log('   after:', JSON.stringify(st), '| errors:', errs.length?JSON.stringify(errs):'none');
    await ctx.close();
  }
  await run("Register4", r4, [], "כרטיס זיכרון בנוי מפליפ-פלופים");
  await run("Register  ", rg, ["Register4"], "אפשר לבנות את Register בדיוק כמו");
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

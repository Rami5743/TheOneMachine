const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const KEY='nand2tetris-lomda-v12', URL='http://localhost:8291/index.html';
  const ff=(i)=>({ id:`ff-${i}`, type:"ffCard", x:640, y:280+(i-1)*100 });
  const ws={ unlocked:true, clocked:true, busClocked:true, taskId:"Register4", taskIntroSeen:true, helpPromptSeen:true, workspaceSession:2, nextId:9, sessionReturnChapterId:"chapter-10", sessionReturnPanelIndex:7,
    components:[{ id:"task-card-1", type:"taskCard-Register4", x:640, y:430 }, ff(1),ff(2),ff(3),ff(4),
      { id:"spin", type:"splitter", x:470, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:false },
      { id:"spout", type:"splitter", x:820, y:430, outputs:4, legWidths:[1,1,1,1], singleWidth:4, mirrored:true }],
    wires:[{ a:"task-card-1.inputInt1", b:"spin.single" },
      { a:"spin.leg0", b:"ff-1.in1" },{ a:"spin.leg1", b:"ff-2.in1" },{ a:"spin.leg2", b:"ff-3.in1" },{ a:"spin.leg3", b:"ff-4.in1" },
      { a:"task-card-1.inputInt2", b:"ff-1.in2" },{ a:"task-card-1.inputInt2", b:"ff-2.in2" },{ a:"task-card-1.inputInt2", b:"ff-3.in2" },{ a:"task-card-1.inputInt2", b:"ff-4.in2" },
      { a:"ff-1.out", b:"spout.leg0" },{ a:"ff-2.out", b:"spout.leg1" },{ a:"ff-3.out", b:"spout.leg2" },{ a:"ff-4.out", b:"spout.leg3" },
      { a:"spout.single", b:"task-card-1.outputInt1" }] };
  const p=await b.newPage(); p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  const seed={ screen:"workspace", chapterId:"chapter-10", sceneId:"flipflop", started:true, maxChapterReached:20, settings:{pace:'all'}, completedTasks:[], workspace:ws };
  await p.goto(URL,{waitUntil:'commit'}); await p.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[KEY,seed]); await p.reload({waitUntil:'commit'}); await p.waitForTimeout(1000);
  await (await p.$("[data-action='check-not-task']")).click({force:true}); await p.waitForTimeout(500);
  await (await p.$("[data-action='not-test-ok']")).click({force:true}); await p.waitForTimeout(700);
  // Now the solution walkthrough should be up
  const solText = await p.$eval('.solution-dialog, .solution-card, [data-action="solution-next"]', e=>e.textContent).catch(()=>null);
  const body = await p.evaluate(()=>document.body.innerText);
  const hasStep1 = body.includes("כרטיס זיכרון בנוי מפליפ-פלופים");
  const actions = await p.$$eval('[data-action]', els=>[...new Set(els.map(e=>e.getAttribute('data-action')))].filter(a=>/solution/.test(a)));
  console.log('walkthrough shown:', hasStep1, '| solution actions:', JSON.stringify(actions));
  // step through it
  for (let i=0;i<5;i++){ const n=await p.$("[data-action='solution-next']"); if(!n) break; await n.click({force:true}); await p.waitForTimeout(300); }
  const st=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nand2tetris-lomda-v12'));return {screen:s.screen,panelIndex:s.panelIndex,completed:s.completedTasks,note:s.memoryNoteList};});
  console.log('after walkthrough:', JSON.stringify(st));
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

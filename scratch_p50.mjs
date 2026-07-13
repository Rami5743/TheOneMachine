import { chromium } from 'playwright';
const EXE='/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const b=await chromium.launch({executablePath:EXE});
async function shot(age,label){
  const p=await b.newPage({viewport:{width:1200,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.addInitScript((age)=>localStorage.setItem('nand2tetris-lomda-v12',JSON.stringify(
    {started:true,soundOn:false,replayNonce:1,screen:'story',chapterId:'chapter-2',sceneId:'berkeley-1942',panelIndex:33,settings:{language:'he',gender:'',age:age,pace:'all'}})),age);
  await p.goto('http://localhost:8199/index.html',{waitUntil:'load'}); await p.waitForTimeout(900);
  const data=await p.$eval('.panel-image',o=>o.getAttribute('data')).catch(()=>null);
  console.log(label,'->',data,'| err:',errs.length?errs.join('|'):'none');
  await p.screenshot({path:`/tmp/shot_${label}.png`});
  await p.close();
}
await shot('','p50_full');   // default age -> full bubble
await shot('10','p50_young'); // under 13 -> no "כולנו בני כלבות" in SVG
await b.close();

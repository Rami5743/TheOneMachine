// A FULL audit of the solution editor, not just a wire count:
//   1. every component type of every solution has a DEFS entry and a PINS entry
//   2. every wire endpoint resolves to a real pin (that is what makes a wire draw)
//   3. every component actually DRAWS something (an empty box = a missing visual)
//   4. every frame pin the wires use exists in the JSON's own frame
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
const ROOT='/home/user/TheOneMachine';
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox']});
  const p=await b.newPage({viewport:{width:1500,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  await p.goto('http://127.0.0.1:8199/editor.html',{waitUntil:'commit'});
  await p.waitForTimeout(2500);
  const files=fs.readdirSync(path.join(ROOT,'assets/solutions')).filter(f=>f.endsWith('.json')).sort();
  let bad=0;
  for(const file of files){
    const text=fs.readFileSync(path.join(ROOT,'assets/solutions',file),'utf8');
    const doc=JSON.parse(text);
    await p.evaluate(t=>{document.getElementById('json-box').value=t;},text);
    await p.click('#btn-apply'); await p.waitForTimeout(320);
    const r=await p.evaluate(([d])=>{
      const out={missingDef:[],missingPins:[],deadEnds:[],emptyDraw:[],drawn:0};
      const all=[{id:d.frame.id,type:d.frame.type,__frame:true},
                 ...(d.external||[]),...(d.components||[])];
      const byId={}; all.forEach(c=>byId[c.id]=c);
      for(const c of all){
        if(c.__frame) continue;
        if(c.type!=='splitter'&&c.type!=='nail'&&c.type!=='source'&&c.type!=='lamp'
           &&!/^converter-/.test(c.type)&&c.type!=='nand'&&c.type!=='ffCard'&&c.type!=='flipflopFrame'){
          if(!PINS[c.type]) out.missingPins.push(c.type);
          if(c.type.startsWith('gate-')&&!DEFS[c.type]&&!/^gate-(Not|And|Or|Xor|Mux|DMux|Inc|Neq0|halfAdder|fullAdder|Add4|Register|RAM|PreperNum|ALU|AND16|Or16|Add16|Not16|MUX16|Dmux4way|Mux4way16)/.test(c.type))
            out.missingDef.push(c.type);
        }
        const markup=CV.componentMarkup(c.type,{outputs:c.outputs,mirrored:c.mirrored,width:c.width,legWidths:c.legWidths});
        if(!markup||!markup.trim()) out.emptyDraw.push(c.id+':'+c.type);
      }
      const framePins=new Set((d.frame.pins||[]).map(x=>x.id));
      const frameDir={}; (d.frame.pins||[]).forEach(x=>frameDir[x.id]=x.dir);
      // Which way a pin faces. A SPLITTER only merges when it is mirrored: legs
      // in, single out. Not mirrored it splits: single in, legs out. Getting that
      // backwards is silent — the wire is simply dropped when the solution loads.
      const dirOf=(c,pid)=>{
        if(c.__frame) return frameDir[pid]||null;
        if(c.type==='splitter') return pid==='single' ? (c.mirrored?'out':'in') : (c.mirrored?'in':'out');
        if(c.type==='nail') return null;                 // a nail's ring is either
        if(c.type==='source') return 'out';
        if(/^converter-out$/.test(c.type)) return 'out';
        if(/^converter-in$/.test(c.type)) return 'in';
        return /^in/.test(pid) ? 'in' : 'out';
      };
      out.badDirection=[];
      for(const w of d.wires||[]){
        const ends=[w.a,w.b].map(r=>{const [cid,pid]=String(r).split('.');return {c:byId[cid],pid,ref:r};});
        if(ends.some(e=>!e.c)) continue;
        const ds=ends.map(e=>dirOf(e.c,e.pid));
        if(ds[0]&&ds[1]&&ds[0]===ds[1]) out.badDirection.push(`${w.a} & ${w.b} are both ${ds[0]}`);
      }
      for(const w of d.wires||[]){
        for(const ref of [w.a,w.b]){
          const [cid,pid]=String(ref).split('.');
          const c=byId[cid];
          if(!c){ out.deadEnds.push(ref+' (no such component)'); continue; }
          if(c.__frame){ if(!framePins.has(pid)) out.deadEnds.push(ref+' (frame has no such pin)'); continue; }
          if(c.type==='splitter'){ if(!/^(single|leg\d+)$/.test(pid)) out.deadEnds.push(ref); continue; }
          const tbl=PINS[c.type];
          if(!tbl){ out.deadEnds.push(ref+' (type not in PINS)'); continue; }
          if(!tbl[pid]) out.deadEnds.push(ref+' (pin not in PINS)');
        }
      }
      out.drawn=document.querySelectorAll('#stage line.ed-bus, #stage line.ed-cable').length;
      return out;
    },[doc]);
    const want=(doc.wires||[]).length;
    const problems=[];
    if(r.drawn!==want) problems.push(`drew ${r.drawn}/${want} wires`);
    if(r.missingPins.length) problems.push('no PINS entry: '+[...new Set(r.missingPins)].join(','));
    if(r.missingDef.length) problems.push('no DEFS entry: '+[...new Set(r.missingDef)].join(','));
    if(r.deadEnds.length) problems.push('dead wire ends: '+[...new Set(r.deadEnds)].slice(0,4).join(' '));
    if(r.emptyDraw.length) problems.push('draws NOTHING: '+r.emptyDraw.join(','));
    if(r.badDirection&&r.badDirection.length) problems.push('wire between two same-direction pins: '+r.badDirection.join(' ; '));
    if(problems.length){ bad++; console.log(doc.task.padEnd(11),'✗ '+problems.join(' | ')); }
    else console.log(doc.task.padEnd(11),'ok  ('+want+' wires, '+((doc.components||[]).length)+' components)');
  }
  if(errs.length) console.log('\npage errors:',[...new Set(errs)].slice(0,4));
  console.log(bad?`\n${bad} solution(s) have problems`:'\nevery solution is clean in the editor');
  await b.close();
})();

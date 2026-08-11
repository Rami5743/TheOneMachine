// A FULL audit of the solution editor, not just a wire count:
//   1. every component type of every solution has a DEFS entry and a PINS entry
//   2. every wire endpoint resolves to a real pin (that is what makes a wire draw)
//   3. every component actually DRAWS something (an empty box = a missing visual)
//   4. every frame pin the wires use exists in the JSON's own frame
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
const ROOT='/home/user/TheOneMachine';
let bad0=0;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox']});
  const p=await b.newPage({viewport:{width:1500,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  await p.goto('http://127.0.0.1:8199/editor.html',{waitUntil:'commit'});
  await p.waitForTimeout(2500);
  // ---- 0. does the editor's copy of the card table still match the game's? ----
  // editor.html keeps its own DEFS/PINS by hand. Every drift is silent: a card it
  // has never heard of draws as an empty box, and a pin at the wrong x draws every
  // wire of that solution landing short of the stub. Diff them first.
  const game=await (async()=>{
    const gp=await b.newPage();
    await gp.goto('http://127.0.0.1:8199/index.html',{waitUntil:'commit'});
    await gp.waitForTimeout(2500);
    const defs=await gp.evaluate(()=>{
      const d=window.__COMPONENT_DEFS; if(!d) return null;
      const out={};
      // The editor draws these by other means (its own splitter geometry, the
      // source/lamp/nand images), so they are not part of the mirrored table.
      const drawnElsewhere=new Set(["nand","lamp","source","splitter","nail","bus","ffCard","flipflopFrame","converter-in","converter-out"]);
      for(const [type,def] of Object.entries(d)){
        if(!def||!def.pins||def.fixed||drawnElsewhere.has(type)) continue;
        // A pin with no width of its own is as wide as the card's bus.
        const w=(v)=>v.width==null?(def.busWidth||1):v.width;
        out[type]=Object.fromEntries(Object.entries(def.pins).map(([k,v])=>[k,[v.x,v.y,w(v)]]));
      }
      return out;
    });
    await gp.close();
    return defs;
  })();
  if(!game){ console.log('! the game does not expose __COMPONENT_DEFS — cannot diff the editor\'s table'); }
  else {
    const mirror=await p.evaluate(()=>Object.fromEntries(Object.entries(PINS).map(([t,tbl])=>
      [t,Object.fromEntries(Object.entries(tbl).map(([k,v])=>[k,[v.x,v.y,v.w==null?1:v.w]]))])));
    const problems=[];
    for(const [type,pins] of Object.entries(game)){
      if(!mirror[type]){ problems.push(`${type}: the editor has never heard of it`); continue; }
      for(const [pid,g] of Object.entries(pins)){
        const m=mirror[type][pid];
        if(!m){ problems.push(`${type}.${pid}: missing from the editor`); continue; }
        if(m[0]!==g[0]||m[1]!==g[1]||m[2]!==g[2]) problems.push(`${type}.${pid}: game (${g}) vs editor (${m})`);
      }
    }
    if(problems.length){ bad0=problems.length; console.log('THE EDITOR\'S CARD TABLE HAS DRIFTED:'); problems.forEach(s=>console.log('  '+s)); console.log(''); }
    else console.log("the editor's card table matches the game's, pin for pin\n");
  }

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
      // 5. a nail that is not a corner. A נעץ earns its place by BENDING a run:
      // one cable in, one cable out, at a different angle. When the cable arrives
      // and leaves at (nearly) the same angle the nail sits in the middle of a
      // straight line and removing it would not move a single pixel of the
      // drawing — so it is just clutter. Fan-out nails (one in, several out) are
      // never redundant; they are how one signal is duplicated.
      out.straightNails=[];
      const SPACING=34, SCALE=0.6;
      const scaleOf=(t)=>(String(t).startsWith('gate-')||t==='nand'||t==='ffCard')?SCALE:1;
      const posOf=(ref)=>{
        const [cid,pid]=String(ref).split('.');
        const c=byId[cid]; if(!c) return null;
        if(c.__frame){ const q=(d.frame.pins||[]).find((x)=>x.id===pid);
          return q?{x:d.frame.x+q.x,y:d.frame.y+q.y}:null; }
        let pin;
        if(c.type==='splitter'){
          const n=Math.min(16,Math.max(2,Number(c.outputs)||4)), m=Boolean(c.mirrored);
          pin=pid==='single'?{x:m?38:-38,y:0}
            :{x:m?-37:37,y:Math.round(((n-1)/2-Number(pid.slice(3)))*SPACING)};
        } else pin=(PINS[c.type]||{})[pid];   // the editor's mirror, diffed against the game above
        if(!pin) return null;
        const s=scaleOf(c.type);
        return {x:c.x+pin.x*s, y:c.y+pin.y*s};
      };
      for(const nail of (d.components||[]).filter((c)=>c.type==='nail')){
        const mine=(d.wires||[]).filter((w)=>[w.a,w.b].some((r)=>String(r).split('.')[0]===nail.id));
        const side=(w)=>String(w.a).split('.')[0]===nail.id?{own:w.a,other:w.b}:{own:w.b,other:w.a};
        const ins=mine.filter((w)=>side(w).own.endsWith('.in'));
        const outs=mine.filter((w)=>side(w).own.endsWith('.out'));
        if(ins.length!==1||outs.length!==1) continue;
        const from=posOf(side(ins[0]).other), to=posOf(side(outs[0]).other);
        if(!from||!to) continue;
        const a1=Math.atan2(nail.y-from.y,nail.x-from.x)*180/Math.PI;
        const a2=Math.atan2(to.y-nail.y,to.x-nail.x)*180/Math.PI;
        let bend=Math.abs(a1-a2); if(bend>180) bend=360-bend;
        if(bend<12) out.straightNails.push(`${nail.id} (${bend.toFixed(1)}°)`);
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
    if(r.straightNails&&r.straightNails.length) problems.push('nail that bends nothing (drop it): '+r.straightNails.join(' '));
    // A נעץ chain has to be listed IN FLOW ORDER. The solution walkthrough draws
    // one cable at a time, and a cable between two nails that are both still
    // floating has no width on either side yet — so it is refused and quietly
    // never drawn, and the finished build is missing wires nobody notices until
    // the check fails. Walk the list the way the walkthrough does.
    const nailIds=new Set((doc.components||[]).filter((c)=>c.type==='nail').map((c)=>c.id));
    if(nailIds.size){
      const owner=(ref)=>String(ref).slice(0,String(ref).lastIndexOf('.'));
      const known=new Set();              // nails whose width is settled so far
      const late=[];
      for(const w of (doc.wires||[])){
        const a=owner(w.a), b=owner(w.b);
        const aFloat=nailIds.has(a)&&!known.has(a);
        const bFloat=nailIds.has(b)&&!known.has(b);
        if(aFloat&&bFloat) late.push(`${w.a} -> ${w.b}`);
        if(nailIds.has(a)&&!bFloat) known.add(a);
        if(nailIds.has(b)&&!aFloat) known.add(b);
      }
      if(late.length) problems.push('nail chain listed out of flow order (the walkthrough will skip these): '+late.join(' ; '));
    }
    if(problems.length){ bad++; console.log(doc.task.padEnd(11),'✗ '+problems.join(' | ')); }
    else console.log(doc.task.padEnd(11),'ok  ('+want+' wires, '+((doc.components||[]).length)+' components)');
  }
  if(errs.length) console.log('\npage errors:',[...new Set(errs)].slice(0,4));
  console.log(bad?`\n${bad} solution(s) have problems`:'\nevery solution is clean in the editor');
  if(bad0) console.log(`${bad0} pin(s) differ between the game and the editor`);
  await b.close();
})();

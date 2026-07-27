const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-proxy-server','--disable-dev-shm-usage','--disable-gpu','--no-sandbox'] });
  const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8294/index.html',{waitUntil:'commit'}); await p.waitForTimeout(1500);
  // all solution docs loaded + their frames applied
  const info = await p.evaluate(()=>({ keys: Object.keys(window.EMBEDDED_SOLUTIONS||{}) }));
  console.log('embedded solutions:', info.keys.length, JSON.stringify(info.keys));
  console.log('page errors on load:', errs.length? JSON.stringify(errs):'none');
  await b.close();
})().catch(e=>{console.error('ERR',e);process.exit(1);});

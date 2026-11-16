// Scroll benchmark: real wheel events from top to bottom with the CPU 4x slower. Prints frame statistics.
const {chromium}=require('playwright');
const URL=process.env.URL||'http://localhost:3217/';
const MODES={
  base:{},
  noglare:{css:'.product-frame > span[aria-hidden]{display:none!important}'},
  noblur:{css:'*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'},
  nowillchange:{css:'*{will-change:auto!important}'},
  nograin:{css:'.grain::before,.grain::after{display:none!important}'},
  noaurora:{block:/\/chunks\/[^/]*\.js/ ,aurora:true},
  native:{reduced:true},
};
(async()=>{
 const wanted=(process.argv[2]||'base').split(',');
 for(const name of wanted){
  const m=MODES[name]; const mobile=process.argv[3]==='m';
  const b=await chromium.launch();
  const ctx=await b.newContext(mobile?{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:m.reduced?'reduce':'no-preference'}:{viewport:{width:1440,height:900},reducedMotion:m.reduced?'reduce':'no-preference'});
  const p=await ctx.newPage(); const cdp=await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await cdp.send('Performance.enable');
  if(process.env.NOAURORA) await p.addInitScript(()=>{const mm=window.matchMedia.bind(window);window.matchMedia=q=>q.includes('min-width: 768px')?{matches:false,media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}:mm(q)});
  if(m.css) await p.addInitScript(css=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=css;document.head.append(s)})},m.css);
  await p.goto(URL,{waitUntil:'load'}); await p.waitForTimeout(4500);
  // make sure every photo is decoded before measuring so we measure scrolling, not first downloads
  await p.evaluate(()=>{document.querySelectorAll('img').forEach(i=>{i.loading='eager'})}); await p.waitForTimeout(2500);
  await p.evaluate(()=>{window.__f=[];window.__go=true;let l=performance.now();const f=t=>{__f.push(t-l);l=t;if(window.__go)requestAnimationFrame(f)};requestAnimationFrame(f);
    window.__lt=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt+=Math.max(0,e.duration-50)}).observe({type:'longtask',buffered:true})});
  const m0=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
  const y0=await p.evaluate(()=>scrollY); const t0=Date.now();
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  if(mobile){ // touch: native scrolling with fling gestures through CDP
    const touch=(type,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:195,y,id:1}]});
    for(let i=0;i<16;i++){
      await touch('touchStart',720);
      for(let s=1;s<=10;s++){await touch('touchMove',720-s*60);await p.waitForTimeout(16)}
      await touch('touchEnd',0);
      await p.waitForTimeout(350);
    }
    await p.waitForTimeout(600);
  } else {
    await p.mouse.move(+(process.env.MOUSEX||700),450);
    for(let i=0;i<70;i++){await p.mouse.wheel(0,110);await p.waitForTimeout(16)}
    await p.waitForTimeout(900);
  }
  const dt=Date.now()-t0; const y1=await p.evaluate(()=>scrollY);
  const m1=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
  const r=await p.evaluate(()=>{window.__go=false;const a=__f.slice(3).sort((x,y)=>x-y),n=a.length;return {n,p50:a[n>>1],p95:a[Math.floor(n*.95)],max:a[n-1],over33:a.filter(x=>x>33).length,over50:a.filter(x=>x>50).length,long:Math.round(__lt)}});
  const d=k=>((m1[k]-m0[k])*1000).toFixed(0);
  console.log(`${(mobile?'M ':'D ')+name.padEnd(13)} scroll ${Math.round(y1-y0)}px/${dt}ms | frames ${r.n} p50 ${r.p50.toFixed(0)} p95 ${r.p95.toFixed(0)} max ${r.max.toFixed(0)} ms | >33ms: ${r.over33}  >50ms: ${r.over50} | tareas largas ${r.long}ms | script ${d('ScriptDuration')} estilo ${d('RecalcStyleDuration')} layout ${d('LayoutDuration')} ms`);
  await b.close();
 }
})();

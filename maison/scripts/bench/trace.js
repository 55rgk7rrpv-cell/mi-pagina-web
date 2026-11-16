const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const mobile=process.argv[2]==='m';const b=await chromium.launch();
const ctx=await b.newContext(mobile?{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900}});
const p=await ctx.newPage();const cdp=await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await p.goto(process.env.URL||'http://localhost:3217/',{waitUntil:'load'});await p.waitForTimeout(4500);
await p.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));await p.waitForTimeout(2500);
await b.startTracing(p,{path:'trace.json',categories:['devtools.timeline','disabled-by-default-devtools.timeline','disabled-by-default-devtools.timeline.invalidationTracking','v8.execute']});
if(mobile){const touch=(type,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:195,y,id:1}]});
 for(let i=0;i<8;i++){await touch('touchStart',720);for(let s=1;s<=10;s++){await touch('touchMove',720-s*60);await p.waitForTimeout(16)}await touch('touchEnd',0);await p.waitForTimeout(350)}}
else{await p.mouse.move(+(process.env.MOUSEX||700),450);for(let i=0;i<40;i++){await p.mouse.wheel(0,110);await p.waitForTimeout(16)}await p.waitForTimeout(600)}
await b.stopTracing();await b.close();
const t=JSON.parse(fs.readFileSync('trace.json','utf8'));const ev=t.traceEvents||t;
const dur={};const cnt={};
for(const e of ev){ if(e.ph==='X'&&['Layout','UpdateLayoutTree','RunTask','FunctionCall','Paint','Layerize','Commit','PrePaint','HitTest','EventDispatch','FireAnimationFrame','UpdateLayer','CompositeLayers'].includes(e.name)){dur[e.name]=(dur[e.name]||0)+e.dur/1000;cnt[e.name]=(cnt[e.name]||0)+1}}
console.log('Tiempo por tipo de evento (ms):');for(const k of Object.keys(dur).sort((a,b)=>dur[b]-dur[a]))console.log('  ',k.padEnd(20),dur[k].toFixed(0).padStart(6),'ms en',cnt[k],'eventos');
// who invalidates style / layout
const why={};
for(const e of ev){const n=e.name;
 if(n==='StyleRecalcInvalidationTracking'||n==='StyleInvalidatorInvalidationTracking'){const a=e.args.data||{};const k=n.slice(0,5)+' '+(a.reason||'')+' | '+(a.invalidationSet||a.selectorPart||'')+' | '+(a.changedClass||a.changedAttribute||a.changedId||a.changedPseudo||'')+' | '+(a.nodeName||'');why[k]=(why[k]||0)+1}
 if(n==='LayoutInvalidationTracking'){const a=e.args.data||{};const k='LAYOUT '+(a.reason||'')+' | '+(a.nodeName||'');why[k]=(why[k]||0)+1}}
console.log('\nMotivos de invalidación (más frecuentes):');for(const [k,v] of Object.entries(why).sort((a,b)=>b[1]-a[1]).slice(0,14))console.log('  ',String(v).padStart(6),k.slice(0,140));
// JS that forces layout / style
const forced={};for(const e of ev){if((e.name==='Layout'||e.name==='UpdateLayoutTree')&&e.ph==='X'){const st=(e.args&&e.args.beginData&&e.args.beginData.stackTrace)||[];if(st.length){const f=st[0];const k=e.name+' <- '+f.functionName+' '+(f.url||'').split('/').pop()+':'+f.lineNumber;forced[k]=(forced[k]||0)+e.dur/1000}}}
console.log('\nLayout/estilo forzado desde JS (ms):');for(const [k,v] of Object.entries(forced).sort((a,b)=>b[1]-a[1]).slice(0,8))console.log('  ',v.toFixed(0).padStart(6),k)
})();

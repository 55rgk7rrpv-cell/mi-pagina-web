// For every product card at several screen sizes: is the photo complete, centred, undistorted and well inside its frame?
const {chromium}=require('playwright');
const DEVICES=[['iPhone SE',375,667,2],['iPhone 15 Pro Max',430,932,3],['iPad vertical',768,1024,2],['iPad horizontal',1024,768,2],['Laptop',1366,768,1],['Escritorio',1920,1080,1]];
(async()=>{const b=await chromium.launch();let bad=0;
for(const [name,w,h,dpr] of DEVICES){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:dpr,isMobile:w<800,hasTouch:w<800});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:3217/',{waitUntil:'load'});await p.waitForTimeout(1500);
  await p.evaluate(()=>document.querySelectorAll('img').forEach(i=>{i.loading='eager'}));await p.waitForTimeout(3500);
  const r=await p.evaluate(()=>{
    const out=[];let overflow=document.documentElement.scrollWidth>innerWidth+1;
    for(const card of document.querySelectorAll('.product-card')){
      const frame=card.querySelector('.product-frame'),img=card.querySelector('.card-photo img');const name=card.querySelector('h3').textContent.trim();
      if(!img||!img.complete||!img.naturalWidth){out.push({name,err:'foto sin cargar'});continue}
      const f=frame.getBoundingClientRect(),i=img.getBoundingClientRect();
      const s=Math.min(i.width/img.naturalWidth,i.height/img.naturalHeight);const dw=img.naturalWidth*s,dh=img.naturalHeight*s;   // object-contain
      const cx=i.left+i.width/2,cy=i.top+i.height/2;
      const L=(cx-dw/2)-f.left,R=f.right-(cx+dw/2),T=(cy-dh/2)-f.top,B=f.bottom-(cy+dh/2);
      out.push({name,margin:Math.min(L,R,T,B)/f.width*100,offx:Math.abs(L-R),offy:Math.abs(T-B),fillw:dw/f.width*100,fillh:dh/f.height*100,aspectErr:Math.abs((dw/dh)/(img.naturalWidth/img.naturalHeight)-1)*100,sq:Math.abs(f.width-f.height),src:img.currentSrc.split('/').slice(-2).join('/')});
    }
    return {out,overflow,n:document.querySelectorAll('.product-card').length}});
  const worst={margin:99,offx:0,offy:0,aspect:0,sq:0};let problems=[];
  for(const o of r.out){ if(o.err){problems.push(o.name+': '+o.err);continue}
    worst.margin=Math.min(worst.margin,o.margin);worst.offx=Math.max(worst.offx,o.offx);worst.offy=Math.max(worst.offy,o.offy);worst.aspect=Math.max(worst.aspect,o.aspectErr);worst.sq=Math.max(worst.sq,o.sq);
    if(o.margin<4||o.offx>1.5||o.offy>1.5||o.aspectErr>1||o.sq>1)problems.push(`${o.name}: margen ${o.margin.toFixed(1)}% desvío ${o.offx.toFixed(1)}/${o.offy.toFixed(1)}px deformación ${o.aspectErr.toFixed(2)}%`)}
  if(r.overflow)problems.push('la página se desborda en horizontal');
  console.log(`${name.padEnd(18)} ${w}x${h}@${dpr}  tarjetas ${r.n} | margen mínimo ${worst.margin.toFixed(1)}% | descentrado máx ${Math.max(worst.offx,worst.offy).toFixed(2)}px | deformación máx ${worst.aspect.toFixed(2)}% | marco cuadrado ✓ ${worst.sq<=1} | errores JS ${errs.length}${problems.length?'\n   PROBLEMAS: '+problems.join('\n   '):''}`);
  bad+=problems.length+errs.length;
  if(name==='Laptop'){const o=r.out.map(x=>x.src).filter(Boolean);console.log('   fuentes usadas por las tarjetas: todas miniaturas =',o.every(s=>s.startsWith('m/')))}
  await ctx.close();
}
console.log(bad?`\n${bad} problemas`:'\nTodo en orden en los 6 tamaños');await b.close()})();

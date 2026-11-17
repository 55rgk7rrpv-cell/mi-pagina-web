// Verificador de superposiciones: recorre el video cada --step s y reporta texto sobre texto o texto sobre imagen.
// uso (desde la raíz de lemo-opuscar): node films/meridian/check_overlap.mjs films/meridian [--step 0.1]
import { openDemo, closeServer } from '../../core/render/page.mjs';
const dir = process.argv[2]; const si = process.argv.indexOf('--step'); const STEP = si > 0 ? +process.argv[si + 1] : 0.1;
const { browser, page } = await openDemo(dir, { w: 1080, h: 1920 });
const warns = []; page.on('console', m => { if (m.type() === 'warning') warns.push(m.text()); });
await page.reload(); await page.waitForFunction(() => window.READY === true);
const dur = await page.evaluate(() => window.DUR);
const found = new Map();
for (let t = 0; t <= dur + 1e-6; t += STEP) {
  const hits = await page.evaluate(t => {
    window.render(t);
    const VW = 1080, VH = 1920;
    const inter = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
    const ok = r => r.r - r.l > 2 && r.b - r.t > 2;
    function visible(el) { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden') return false; o *= +s.opacity; } return o > .05; }
    function clipOf(start, r) {   // recorta por overflow:hidden y clip-path:inset() desde start hacia arriba
      for (let e = start; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e), b = e.getBoundingClientRect();
        if (s.overflow === 'hidden') r = inter(r, { l: b.left, t: b.top, r: b.right, b: b.bottom });
        const m = /inset\(([-\d.]+)%(?:\s+([-\d.]+)%)?(?:\s+([-\d.]+)%)?(?:\s+([-\d.]+)%)?/.exec(s.clipPath);
        if (m) { const [T, R, B, L] = [m[1], m[2] ?? m[1], m[3] ?? m[1], m[4] ?? m[2] ?? m[1]].map(Number);
          r = inter(r, { l: b.left + b.width * L / 100, t: b.top + b.height * T / 100, r: b.right - b.width * R / 100, b: b.bottom - b.height * B / 100 }); }
      }
      return inter(r, { l: 0, t: 0, r: VW, b: VH });
    }
    const layer = el => { for (let e = el; e; e = e.parentElement) if (e.dataset && e.dataset.layer) return e; return null; };
    const items = [];
    const tw = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!visible(el)) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const q of rg.getClientRects()) { const r = clipOf(el, { l: q.left, t: q.top, r: q.right, b: q.bottom }); if (ok(r)) items.push({ el, r, kind: 'texto', label: n.textContent.trim().slice(0, 28), L: layer(el) }); } }
    for (const im of document.images) { const box = im.parentElement; if (!visible(im)) continue; const q = box.getBoundingClientRect();
      const r = clipOf(box, { l: q.left, t: q.top, r: q.right, b: q.bottom }); if (ok(r)) items.push({ el: im, r, kind: 'imagen', label: im.src.split('/').pop(), L: layer(im) }); }
    const out = [];
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const A = items[i], B = items[j]; if (A.kind === 'imagen' && B.kind === 'imagen') continue;
      if (A.el === B.el || A.L !== B.L) continue;
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const x = inter(A.r, B.r); if (!ok(x)) continue;
      // ¿se ven las dos en la zona común? (nada opaco las tapa)
      let seen = 0;
      for (let px = x.l + 1; px < x.r; px += 4) for (let py = x.t + 1; py < x.b; py += 4) { const top = document.elementFromPoint(px, py);
        if (top && (A.el.contains(top) || top === A.el || B.el.contains(top) || top === B.el || top.contains(A.el) || top.contains(B.el))) seen++; }
      if (seen) out.push(`${A.kind} «${A.label}» ⟷ ${B.kind} «${B.label}» (${Math.round(x.r - x.l)}×${Math.round(x.b - x.t)} px)`);
    }
    return out;
  }, +t.toFixed(3));
  for (const h of hits) { const f = found.get(h); if (f) f[1] = t; else found.set(h, [t, t]); }
}
await browser.close(); closeServer();
for (const w of new Set(warns)) console.log('AVISO', w);
if (!found.size) { console.log('OK: ninguna superposición de texto en todo el video'); process.exit(0); }
for (const [h, [a, b]] of found) console.log(`${a.toFixed(1)}–${b.toFixed(1)} s  ${h}`);
process.exit(1);

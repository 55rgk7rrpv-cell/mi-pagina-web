"""Mezcla: voz + música (con ducking y silencios) + SFX procedurales sincronizados a timeline.json."""
import json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from pathlib import Path

D = Path(__file__).parent
SR = 48000
TL = json.loads((D / 'timeline.json').read_text())
N = int(TL['dur'] * SR)
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def norm(x, p=1.0): m = np.abs(x).max(); return x * p / m if m else x
def env(d, a, r): t = t_(d); return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)

# ---------- sound palette ----------
def click(v=.5):   # crisp UI click: text pops on screen
    d = .04; x = hp(noise(d), 2500) * env(d, .0005, .006); return norm(x, v)
def pop(v=.45):
    t = t_(.09); f = 900 * np.exp(-t * 30) + 300; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(.09, .001, .03); return norm(x, v)
def whoosh(d=.45, v=.5, lo=300, hi=3500):   # zooms, pans, wipes
    x = noise(d); t = t_(d); c = np.sin(np.pi * t / d) ** 2
    out = np.zeros_like(x); step = 512
    for i in range(0, len(x), step):
        p = i / len(x); f = lo + (hi - lo) * np.sin(np.pi * p)
        seg = x[i:i + step]; out[i:i + step] = bp(np.pad(seg, (0, 0)), max(80, f * .6), min(SR / 2 - 100, f * 1.4))[:len(seg)]
    return norm(out * c, v)
def swoosh_big(v=.6): return sm(whoosh(.6, v, 150, 2500), norm(lp(noise(.6), 180) * np.sin(np.pi * t_(.6) / .6) ** 2, v * .5))
def thud(v=.8, f=58):   # felt landing, numeral thunk
    t = t_(.45); x = np.sin(2 * np.pi * f * t * (1 + .6 * np.exp(-t * 25))) * env(.45, .002, .12)
    return norm(x + .25 * lp(noise(.45), 400) * env(.45, .001, .03), v)
def thunk(v=.6): return sm(thud(v, 90), click(.25))
def stamp(v=.9):   # rubber stamp: thud + paper slap
    return norm(thud(1, 70)[:int(.3 * SR)] + np.pad(bp(noise(.08), 400, 3000) * env(.08, .001, .02), (0, int(.22 * SR))), v)
def hit(v=.75):   # attention impact for the hook ("fahhh"-like airy impact)
    d = 1.2; t = t_(d); body = np.sin(2 * np.pi * 48 * t) * env(d, .003, .25)
    air = bp(noise(d), 1200, 6000) * env(d, .004, .35)
    return norm(body + .55 * air, v)
def hit_big(v=.9): return norm(sm(hit(1), .6 * thud(1, 40)), v)
def reveal(v=.4):   # magic reveal shimmer
    d = .9; t = t_(d); x = np.zeros_like(t)
    for i, f in enumerate([1568, 2093, 2637, 3136, 4186]):
        st = i * .06; x += np.where(t > st, np.sin(2 * np.pi * f * (t - st)) * np.exp(-(t - st) / .25), 0)
    return norm(x * np.minimum(1, t / .01) + .15 * hp(noise(d), 6000) * env(d, .05, .2), v)
def ding(v=.45):
    t = t_(1.0); x = (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 2640 * t)) * env(1.0, .002, .3); return norm(x, v)
def error(v=.45):   # short low buzz
    t = t_(.32); x = np.sign(np.sin(2 * np.pi * 110 * t)) * env(.32, .005, .18); return norm(lp(x, 1800), v)
def cut(v=.5):   # knife/guillotine snick
    d = .18; t = t_(d); x = hp(noise(d), 3000) * np.exp(-t / .03) * (1 + 2 * (t < .02)); return norm(x, v)
def tick(v=.35): return sm(click(v), pop(v * .3))
def type_(v=.35):
    d = .05; x = bp(noise(d), 1200, 5000) * env(d, .0005, .01); return norm(x, v)
def coin(v=.35):
    t = t_(.3); x = (np.sin(2 * np.pi * 2349 * t) + np.sin(2 * np.pi * 3136 * t) * (t > .06)) * env(.3, .001, .09); return norm(x, v)
def tick_pen(v=.5):   # pen tick "tss"
    d = .12; x = bp(noise(d), 2500, 8000) * env(d, .004, .04); return norm(sm(x, click(.3)), v)
def shutter(v=.55):
    a = hp(noise(.03), 1500) * env(.03, .0005, .008); b = np.pad(bp(noise(.05), 800, 5000) * env(.05, .0005, .012), (int(.07 * SR), 0))
    a = np.pad(a, (0, len(b) - len(a))); return norm(a + b, v)
def riser(d=.5, v=.5):
    t = t_(d); f = 200 + 1800 * (t / d) ** 2
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 2 + .5 * hp(noise(d), 3000) * (t / d) ** 3; return norm(x, v)
def riser_down(v=.4):
    d = .7; t = t_(d); f = 1200 * np.exp(-t * 4) + 80
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, .01, .3), v)
def drone(d=3.6, v=.25):
    t = t_(d); x = np.sin(2 * np.pi * 55 * t) + .5 * np.sin(2 * np.pi * 82.5 * t)
    e = np.minimum(1, t / .6) * np.minimum(1, (d - t) / .8); return norm(x * e, v)
def fill(d=1.0, v=.3):   # rising tone while the bar fills
    t = t_(d); f = 300 + 500 * t / d; return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (d - t) / .05) * np.minimum(1, t / .02), v)

def sm(*xs):
    n=max(len(x) for x in xs); return sum(np.pad(x,(0,n-len(x))) for x in xs)

def add(buf, x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = x[:max(0, len(buf) - i)]
    buf[i:i + len(x), 0] += x * g * (1 - max(0, pan)); buf[i:i + len(x), 1] += x * g * (1 + min(0, pan))

def load(p):
    x, sr = sf.read(p, always_2d=True); x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr)
    return x

# ---------- voice ----------
vo = np.zeros((N, 2))
for l in TL['lines']:
    add(vo, load(D / 'assets' / f"{l['id']}.wav") * .95, l['t'])

# ---------- sfx (anclados a palabras habladas: "L03:encuentra#n") ----------
import unicodedata, re
def _n(s): s = unicodedata.normalize('NFD', s.lower()); return re.sub(r'[^a-z0-9]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))
LINES = {l['id']: l for l in TL['lines']}
def W(ref):
    lid, wq = ref.split(':', 1); w, _, n = wq.partition('#'); c = 0
    for x in LINES[lid]['words']:
        if _n(x['w']) == _n(w):
            c += 1
            if c == int(n or 1): return x['t']
    raise KeyError(ref)
for e in TL['sfx']:
    if 'at' in e: e['t'] = W(e['at']) + e.get('off', 0)
    if 'to' in e: e['span'] = W(e['to']) + e.get('to_off', 0) - e['t']
fx = np.zeros((N, 2))
for e in TL['sfx']:
    k, t = e['k'], e['t']
    if k in ('ticks',):
        n, sp = e['n'], e['span']
        for i in range(n): add(fx, tick(.18 if e.get('soft') else .28), t + sp * (i / n) ** (1.2), pan=(-.2 if i % 2 else .2))
    elif k == 'type':
        n, sp = e['n'], e['span']
        for i in range(n): add(fx, type_(.3 + .1 * rng.random()), t + sp * i / n + .015 * rng.random(), pan=.15 * rng.standard_normal())
    elif k == 'coin':
        for i in range(e['n']): add(fx, coin(), t + e['span'] * i / (e['n'] - 1))
    elif k == 'riser': add(fx, riser(e['span']), t)
    elif k == 'drone': add(fx, drone(e['span']), t)
    elif k == 'fill': add(fx, fill(e['span']), t)
    else:
        f = {'hit': hit, 'hit_big': hit_big, 'whoosh': whoosh, 'swoosh_big': swoosh_big, 'click': click, 'pop': pop,
             'stamp': stamp, 'thud': thud, 'thunk': thunk, 'reveal': reveal, 'error': error, 'cut': cut, 'ding': ding,
             'tick_pen': tick_pen, 'shutter': shutter, 'riser_down': riser_down}[k]
        add(fx, f(), t)

# ---------- music with ducking ----------
m, sr = sf.read(D / 'assets' / 'music.wav', always_2d=True)
if m.shape[1] == 1: m = np.repeat(m, 2, 1)
if sr != SR: m = np.stack([resample_poly(m[:, c], SR, sr) for c in range(2)], 1)
m = m[:N]; m = np.pad(m, ((0, N - len(m)), (0, 0)))
g = np.full(N, TL['music']['full'])
tt = np.arange(N) / SR
for l in TL['lines']:
    g[(tt > l['t'] - .15) & (tt < l['t'] + l['d'] + .2)] = TL['music']['duck']
for a, b in TL['music']['silences']:
    g[(tt > a) & (tt < b)] = .04
k = int(.12 * SR); g = np.convolve(g, np.ones(k) / k, 'same')       # smooth gain moves
g *= np.clip((TL['dur'] - tt) / 2.0, 0, 1)                          # fade out at the end
m = m / (np.abs(m).max() + 1e-9) * 0.9

mix = vo + .55 * fx + m * g[:, None]
mix /= max(1.0, np.abs(mix).max() / .95)
sf.write(D / 'out' / 'mix.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print('mix written', mix.shape, 'peak', np.abs(mix).max())

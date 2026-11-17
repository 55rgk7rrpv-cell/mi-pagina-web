"""Mezcla del reel tipográfico: música recortada al compás + SFX en cada palabra (golpes de 110 BPM)."""
import numpy as np, soundfile as sf
from pathlib import Path
D = Path(__file__).parent
src = (D / 'sfxlib.py').read_text().split('# ---------- voice')[0]
G = {'__file__': str(D / 'sfxlib.py')}; exec(src, G)
SR, N = G['SR'], G['N']; add = G['add']; f = G
BEAT = 60 / 110; b = lambda n: n * BEAT
MUSIC_OFF = 0.23 + 26 * BEAT        # golpe 26 de la pista = golpe 0 del video
fx = np.zeros((N, 2))
ev = [(0,'hit',.6),(0,'pop',.5),(1,'click',.6),(2,'click',.6),(3,'whoosh',.5),(3,'click',.5),(4,'click',.6),(5,'cut',.8),
      (6,'hit_big',.9),(7,'thunk',.7),(13,'click',.6),(14,'click',.6),(15,'click',.6),(16,'thud',.8),(18,'hit',.7),(19,'thunk',.7),
      (20,'click',.6),(21,'reveal',.6),(22,'pop',.5)]
for n, k, g in ev: add(fx, f[k](), b(n), g)
add(fx, f['riser'](b(1)), b(5), .45)                       # sube hacia el golpe 6
add(fx, f['whoosh'](b(1.25), .6, 150, 2500), b(16.75), .7)  # zoom de "crecer."
for i, n in enumerate(np.arange(8.5, 12.5, .5)): add(fx, f['tick'](.4), b(n), 1, pan=(-.25 if i % 2 else .25))
m, sr = sf.read(D / 'assets' / 'music.wav', always_2d=True)
m = m[int(MUSIC_OFF * sr):][:N]; m = np.pad(m, ((0, N - len(m)), (0, 0)))
t = np.arange(N) / SR; g = np.clip(t / .25, 0, 1) * np.clip((14.8 - t) / 1.4, 0, 1)
mix = .8 * m / (np.abs(m).max() + 1e-9) * g[:, None] + .7 * fx
mix /= max(1.0, np.abs(mix).max() / .95)
sf.write(D / 'out' / 'mix.wav', mix.astype(np.float32), SR, subtype='FLOAT'); print('ok', mix.shape)

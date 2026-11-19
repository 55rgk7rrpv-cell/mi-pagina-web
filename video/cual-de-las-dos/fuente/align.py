"""Alineación voz → palabras, sin modelos externos.
Detecta en cada pista las frases habladas (bloques de voz separados por pausas) y las empareja
con las frases del texto (cortadas en , . :). Dentro de cada frase reparte las palabras por sílabas
aproximadas. Escribe lines[i].words = [{w, t}] en timeline.json (t absoluto en el video)."""
import json, re, unicodedata, numpy as np, soundfile as sf
from pathlib import Path

D = Path(__file__).parent
TL = json.loads((D / 'timeline.json').read_text())

def syl(w):   # sílabas aproximadas en español (grupos vocálicos)
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return max(1, len(re.findall(r'[aeiouy]+', w)))

def speech_blocks(x, sr, min_gap=.11):
    hop = int(sr * .01); fr = len(x) // hop
    rms = np.array([np.sqrt((x[i*hop:(i+1)*hop] ** 2).mean()) for i in range(fr)])
    db = 20 * np.log10(rms + 1e-9); th = db.max() - 32
    on = db > th; blocks = []; i = 0
    while i < fr:
        if on[i]:
            j = i
            while j < fr and (on[j] or (j + int(min_gap * 100) < fr and on[j:j + int(min_gap * 100)].any())): j += 1
            blocks.append([i / 100, j / 100]); i = j
        else: i += 1
    return blocks

for l in TL['lines']:
    x, sr = sf.read(D / 'assets' / f"{l['id']}.wav"); x = x if x.ndim == 1 else x.mean(1)
    blocks = speech_blocks(x, sr)
    phrases = [p.strip() for p in re.split(r'(?<=[,.:])\s+', l['text']) if p.strip()]
    # unir bloques sobrantes (pausas internas) a la frase más cercana por duración relativa
    while len(blocks) > len(phrases):
        gaps = [blocks[i+1][0] - blocks[i][1] for i in range(len(blocks) - 1)]
        k = int(np.argmin(gaps)); blocks[k][1] = blocks[k+1][1]; del blocks[k+1]
    if len(blocks) < len(phrases):   # menos pausas que comas: repartir el bloque por sílabas
        s0, s1 = blocks[0][0], blocks[-1][1]; tot = sum(sum(syl(w) for w in p.split()) for p in phrases)
        blocks, c = [], 0
        for p in phrases:
            n = sum(syl(w) for w in p.split()); blocks.append([s0 + (s1 - s0) * c / tot, s0 + (s1 - s0) * (c + n) / tot]); c += n
    words = []
    for p, (a, b) in zip(phrases, blocks):
        ws = p.split(); tot = sum(syl(w) for w in ws); c = 0
        for w in ws:
            words.append({'w': w, 't': round(l['t'] + a + (b - a) * c / tot, 3)}); c += syl(w)
    l['words'] = words
    l['phrases'] = [[round(l['t'] + a, 3), round(l['t'] + b, 3)] for a, b in blocks]
    print(l['id'], [(p[:18], round(a, 2)) for p, (a, b) in zip(phrases, blocks)])

(D / 'timeline.json').write_text(json.dumps(TL, ensure_ascii=False, indent=1))

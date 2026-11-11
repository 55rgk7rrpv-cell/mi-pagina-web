# Step 2: strict framing.
#  - never stretch: the garment keeps its exact pixels and proportions (no resize before pasting)
#  - square canvas, pure white #FFFFFF, side = longest side of the garment + 18% margin
#  - garment pasted at the exact geometric centre
#  - only afterwards the whole square may be scaled down uniformly (both sides by the same factor)
import os, sys, numpy as np
from PIL import Image
SRC, OUT = sys.argv[1], sys.argv[2]
MARGIN = 0.18        # inside the 15–20% requested
MAX_SIDE = 1400      # web size cap; uniform downscale only, never upscale
os.makedirs(OUT, exist_ok=True)
report = []
for f in sorted(os.listdir(SRC)):
    rgba = Image.open(f"{SRC}/{f}").convert("RGBA")
    alpha = np.asarray(rgba)[:, :, 3]
    ys, xs = np.where(alpha > 60)                       # ignore faint halo pixels when measuring
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    g = rgba.crop(box)                                  # the garment, untouched
    gw, gh = g.size
    side = int(round(max(gw, gh) * (1 + MARGIN)))
    canvas = Image.new("RGB", (side, side), (255, 255, 255))
    ox, oy = (side - gw) // 2, (side - gh) // 2         # geometric centre
    canvas.paste(g, (ox, oy), g)                        # alpha-composite onto pure white
    if side > MAX_SIDE:
        canvas = canvas.resize((MAX_SIDE, MAX_SIDE), Image.LANCZOS)  # square -> square: same factor on both axes
    canvas.save(f"{OUT}/{f[:-4]}.webp", "WEBP", quality=88, method=6)
    # checks
    s = canvas.size[0] / side
    l, t = ox * s, oy * s; r = canvas.size[0] - (ox + gw) * s; b = canvas.size[1] - (oy + gh) * s
    ratio_in, ratio_out = gw / gh, (gw * s) / (gh * s)
    report.append((f, gw, gh, canvas.size[0], min(l, r, t, b) / canvas.size[0] * 100, abs(l - r), abs(t - b), abs(ratio_in - ratio_out)))
bad = [r for r in report if r[4] < 7.4 or r[5] > 1.01 or r[6] > 1.01 or r[7] > 1e-9 or tuple(Image.open(f"{OUT}/{r[0][:-4]}.webp").getpixel((0, 0))) != (255, 255, 255)]
print(f"{len(report)} fotos. Margen mínimo: {min(r[4] for r in report):.1f}% del lado. Descentrado máximo: {max(max(r[5], r[6]) for r in report):.1f}px. Deformación máxima: {max(r[7] for r in report)}.")
print("Fallan la verificación:", [r[0] for r in bad] or "ninguna")
small = [(r[0], r[3]) for r in report if r[3] < 700]
print("Fotos de origen pequeñas (lado < 700px, se ven menos nítidas):", small)

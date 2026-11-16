# Garment-only photos sent by the shop (no person) -> public/catalogo/{key}-sola.webp
#
#   python catalogo/herramientas/fotos-solas.py catalogo/fotos-solas-originales
#
# The originals in catalogo/fotos-solas-originales are never touched. For each web copy:
#   1. a collage photo is cut into its panels, ALONG THE WHITE GAPS between garments ("crop" in fotos-solas.json)
#   2. a flat light-grey backdrop is turned white ("whiten": automatic when the backdrop is not white, or forced with
#      true/false in fotos-solas.json). Only pixels that are backdrop change; garment pixels are never touched.
#      "holes": false (pale garments): only the backdrop that touches the photo's edge is whitened.
#   3. the canvas is cut to the garment plus an EQUAL margin on all four sides (white is added where the photo had no
#      room), so every garment sits exactly centred and every card has the same breathing space.
#   4. the one sticker over the yellow jacket's lining is rebuilt from its surroundings.
# Nothing else is edited: no resizing, no colour changes of the garment.
import json, sys, os, numpy as np, cv2
from PIL import Image

UP = sys.argv[1]
SOLAS = json.load(open("catalogo/herramientas/fotos-solas.json"))

THRESH = 10                      # distance from the backdrop (0-255, after a light blur) that counts as "garment"
MIN_BLOB = 60                    # specks smaller than this (JPEG dust) are ignored when measuring the garment
PAD_MIN, PAD_PCT = 14, 0.025     # equal margin on every side: at least 14 px or 2.5% of the garment's longer side
AUTO_WHITEN_BELOW = 248          # backdrops darker than this (in every channel) are whitened by default
W_TOL, W_HIGH, W_HOLE_MIN, W_HOLE_MEAN = 9, 30, 120, 3.5

def backdrop_model(rgb):
    """Backdrop colour at every pixel: a plane fitted to the photo's border (handles slight light gradients)."""
    h, w, _ = rgb.shape
    ring = np.zeros((h, w), bool); ring[:4] = ring[-4:] = True; ring[:, :4] = ring[:, -4:] = True
    ys, xs = np.mgrid[0:h, 0:w]
    full = np.stack([np.ones(h * w), xs.ravel() / w, ys.ravel() / h], 1)
    X = np.stack([np.ones(ring.sum()), xs[ring] / w, ys[ring] / h], 1)
    med = np.median(rgb[ring].astype(np.float64), axis=0)
    inlier = np.abs(rgb[ring].astype(np.float64) - med).max(axis=1) <= 14      # border pixels that are backdrop
    out = np.empty((h, w, 3), np.float32)
    for c in range(3):
        y = rgb[..., c][ring].astype(np.float64)
        coef, *_ = np.linalg.lstsq(X[inlier], y[inlier], rcond=None) if inlier.sum() > 20 else (np.array([med[c], 0, 0]),)
        out[..., c] = (full @ coef).reshape(h, w)
    return out, med, rgb[ring][inlier].std(axis=0).max() if inlier.any() else 99

def whiten_backdrop(rgb, holes=True):
    bg, _, _ = backdrop_model(rgb)
    d = np.abs(rgb.astype(np.float32) - bg).max(axis=2)
    cand = (d <= W_TOL).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(cand, connectivity=4)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    flood = np.zeros(cand.shape, np.uint8)
    for i in range(1, n):
        # the backdrop = what touches the photo's edge, plus enclosed gaps (inside tie loops...) that match it very closely
        if i in border or (holes and st[i][4] >= W_HOLE_MIN and d[lab == i].mean() <= W_HOLE_MEAN):
            flood[lab == i] = 1
    # a thin rim around the backdrop fades smoothly, so the garment's edge has no halo and no hard step
    near = cv2.dilate(flood, np.ones((5, 5), np.uint8)).astype(np.float32)
    ramp = np.clip((W_HIGH - d) / (W_HIGH - W_TOL), 0, 1)
    w = np.maximum(flood.astype(np.float32), ramp * near)
    w = w * w * (3 - 2 * w)
    w[d > W_HIGH] = 0
    return np.rint(rgb * (1 - w[..., None]) + 255 * w[..., None]).astype(np.uint8)

def garment_box(rgb):
    bg, _, _ = backdrop_model(rgb)
    diff = np.abs(rgb.astype(np.float32) - bg).max(axis=2).astype(np.uint8)
    diff = cv2.GaussianBlur(diff, (0, 0), 1.2)
    mask = (diff > THRESH).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(cv2.dilate(mask, np.ones((7, 7), np.uint8)), connectivity=8)
    keep = np.zeros_like(mask)
    for i in range(1, n):
        if stats[i][4] >= MIN_BLOB:
            keep[lab == i] = 1
    keep &= mask | cv2.erode(keep, np.ones((3, 3), np.uint8))
    ys, xs = np.where(keep)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1) if len(xs) else None

def equal_margin_canvas(rgb, fill):
    """Garment + the same margin on all four sides; real photo pixels where they exist, flat backdrop where not."""
    box = garment_box(rgb)
    if not box:
        return rgb
    x0, y0, x1, y1 = box; h, w, _ = rgb.shape
    pad = max(PAD_MIN, round(PAD_PCT * max(x1 - x0, y1 - y0)))
    cx0, cy0, cx1, cy1 = max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)
    crop = rgb[cy0:cy1, cx0:cx1]
    top, bottom, left, right = pad - (y0 - cy0), pad - (cy1 - y1), pad - (x0 - cx0), pad - (cx1 - x1)
    return cv2.copyMakeBorder(crop, top, bottom, left, right, cv2.BORDER_CONSTANT, value=[int(v) for v in fill])

report = []
for key, src in SOLAS.items():
    spec = src if isinstance(src, dict) else {"file": src}
    a = np.asarray(Image.open(os.path.join(UP, spec["file"])).convert("RGB")).copy()
    if key == "chaqueta-capucha-lunares__amarillo":   # "Talla / Ref" sticker on the lining
        h, w, _ = a.shape; y0, y1, x0, x1 = int(h*.19), int(h*.30), int(w*.42), int(w*.60)
        white = (a[y0:y1, x0:x1].min(axis=2) > 235); ys, xs = np.where(white); m = np.zeros(a.shape[:2], np.uint8)
        m[y0+ys.min()-4:y0+ys.max()+5, x0+xs.min()-4:x0+xs.max()+5] = 255
        a = cv2.inpaint(a, m, 9, cv2.INPAINT_TELEA)
    if "crop" in spec:
        x0, y0, x1, y1 = spec["crop"]; a = a[y0:y1, x0:x1]
    _, med, _ = backdrop_model(a)
    grey = bool(med.max() < AUTO_WHITEN_BELOW)
    whiten = spec.get("whiten", grey)
    if whiten:
        a = whiten_backdrop(a, holes=spec.get("holes", True))   # holes=false for pale garments: their highlights look like backdrop
    fill = (255, 255, 255) if whiten else np.median(a[:4].reshape(-1, 3), axis=0)
    a = equal_margin_canvas(a, fill)
    Image.fromarray(a).save(f"public/catalogo/{key}-sola.webp", "WEBP", quality=90, method=6)
    report.append((key, a.shape[1], a.shape[0], "fondo blanqueado" if whiten else ""))
for k, w, h, note in report:
    print(f"{k:58s} {w:4d} x {h:4d}  {note}")

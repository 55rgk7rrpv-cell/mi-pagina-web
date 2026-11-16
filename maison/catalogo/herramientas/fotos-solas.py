# Garment-only photos sent by the shop (white background, no person) -> public/catalogo/{key}-sola.webp
#
#   python catalogo/herramientas/fotos-solas.py catalogo/fotos-solas-originales
#
# The originals in catalogo/fotos-solas-originales are never touched. For each web copy:
#   1. a collage photo is cut into its panels, ALONG THE WHITE GAPS between garments ("crop" in fotos-solas.json)
#   2. the white margin around the garment is trimmed, so every piece fills its card the same way
#      (only background-white pixels are removed; the garment is never cut: see TRIM below)
#   3. the one sticker over the yellow jacket's lining is rebuilt from its surroundings
# Nothing else is edited: no background removal, no resizing, no colour changes.
import json, sys, os, numpy as np, cv2
from PIL import Image

UP = sys.argv[1]
SOLAS = json.load(open("catalogo/herramientas/fotos-solas.json"))

# --- TRIM: bounding box of everything that is not background white, plus a safety margin ----------------
THRESH = 10      # distance from the backdrop colour (0-255) that counts as "not background" after a light blur
MIN_BLOB = 60    # specks smaller than this (JPEG dust) are ignored when measuring the box
PAD_MIN, PAD_PCT = 16, 0.035   # margin kept around the garment: at least 16 px or 3.5% of its longer side

def background_color(rgb):
    """Colour of the backdrop: median of a thin ring along the photo's border (white for most, light grey for some)."""
    ring = np.concatenate([rgb[:4].reshape(-1, 3), rgb[-4:].reshape(-1, 3), rgb[:, :4].reshape(-1, 3), rgb[:, -4:].reshape(-1, 3)])
    return np.median(ring, axis=0)

def trim_box(rgb):
    bg = background_color(rgb)
    diff = np.abs(rgb.astype(np.int16) - bg.astype(np.int16)).max(axis=2).astype(np.uint8)
    diff = cv2.GaussianBlur(diff, (0, 0), 1.2)
    mask = (diff > THRESH).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(cv2.dilate(mask, np.ones((7, 7), np.uint8)), connectivity=8)
    keep = np.zeros_like(mask)
    for i in range(1, n):
        if stats[i][4] >= MIN_BLOB:
            keep[lab == i] = 1
    keep &= mask | cv2.erode(keep, np.ones((3, 3), np.uint8))   # tight to the real pixels
    ys, xs = np.where(keep)
    if len(xs) == 0:
        return None
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    pad = max(PAD_MIN, int(PAD_PCT * max(x1 - x0, y1 - y0)))
    h, w = mask.shape
    return max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)

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
    full = a.shape[1] * a.shape[0]
    if spec.get("trim", True):
        box = trim_box(a)
        if box:
            a = a[box[1]:box[3], box[0]:box[2]]
    Image.fromarray(a).save(f"public/catalogo/{key}-sola.webp", "WEBP", quality=90, method=6)
    report.append((key, a.shape[1], a.shape[0], round(100 * a.shape[1] * a.shape[0] / full)))
for k, w, h, pct in report:
    print(f"{k:58s} {w:4d} x {h:4d}  ({pct}% de la foto, queda el resto de la prenda)")

# Light copies of every catalogue photo for the product grid, cart and checkout: public/catalogo/m/<same name>.webp
# The grid shows each photo at ~400 px (about 800 px on a retina screen), so the full-size file (up to 1263 px tall)
# only costs download time and decoded-image memory there. The quick view keeps using the full-size photo.
# Not a crop and not a colour change: the same picture, scaled down so its longer side is at most MAX px.
import os
from PIL import Image
MAX = 880
os.makedirs("public/catalogo/m", exist_ok=True)
keep = set()
for f in sorted(os.listdir("public/catalogo")):
    src = f"public/catalogo/{f}"
    if not os.path.isfile(src):
        continue
    keep.add(f)
    with Image.open(src) as im:
        im = im.convert("RGB")
        if max(im.size) > MAX:
            k = MAX / max(im.size)
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        im.save(f"public/catalogo/m/{f}", "WEBP", quality=84, method=6)
for f in os.listdir("public/catalogo/m"):      # drop thumbnails whose photo no longer exists
    if f not in keep:
        os.remove(f"public/catalogo/m/{f}")
tot = sum(os.path.getsize(f"public/catalogo/m/{f}") for f in keep) / 1024
full = sum(os.path.getsize(f"public/catalogo/{f}") for f in keep) / 1024
print(f"{len(keep)} miniaturas: {tot:.0f} KB en total (las originales web pesan {full:.0f} KB)")

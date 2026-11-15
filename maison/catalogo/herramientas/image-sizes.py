# Writes src/lib/image-sizes.ts: the real pixel size of every photo (full size and card thumbnail),
# so every <img> can carry width/height and the browser reserves its space before it loads (no layout shift).
import os, json
from PIL import Image
sizes = {}
for f in sorted(os.listdir("public/catalogo")):
    if os.path.isfile(f"public/catalogo/{f}"):
        with Image.open(f"public/catalogo/{f}") as im: sizes[f"catalogo/{f}"] = list(im.size)
for f in sorted(os.listdir("public/catalogo/m")):
    with Image.open(f"public/catalogo/m/{f}") as im: sizes[f"catalogo/m/{f}"] = list(im.size)
ts = ("// Generado por catalogo/herramientas/image-sizes.py — no editar a mano.\n"
      "// Tamaño real (ancho, alto) de cada foto, para los atributos width/height de <img>.\n"
      "export const IMAGE_SIZES: Record<string, [number, number]> = " + json.dumps(sizes, indent=1) + ";\n\n"
      "/** width/height props for an <img>; a square fallback keeps the layout stable if a photo is missing here */\n"
      "export const imgSize = (src: string) => {\n  const [width, height] = IMAGE_SIZES[src] ?? [1000, 1000];\n  return { width, height };\n};\n\n"
      "/** Light copy of a catalogue photo (<= 880 px) for the grid, cart and checkout */\n"
      "export const thumbOf = (src: string) => src.replace(/^catalogo\\//, \"catalogo/m/\");\n")
open("src/lib/image-sizes.ts", "w").write(ts); print(len(sizes), "fotos")

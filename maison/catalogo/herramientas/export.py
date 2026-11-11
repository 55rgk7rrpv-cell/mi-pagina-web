import os, json
from PIL import Image
R="recortes"; OUT="/home/user/mi-pagina-web/maison/public/catalogo"; os.makedirs(OUT,exist_ok=True)
B={"vestido-halter-volantes__blanco-lunares-grandes","vestido-halter-volantes__azul-marino","vestido-halter-volantes__blanco-lunares-pequenos",
 "vestido-largo-un-hombro__negro","vestido-halter-lunares-escote__vinotinto","vestido-halter-lunares-escote__crema",
 "vestido-floral-manga-globo__blanco-floral","vestido-midi-asimetrico__negro","top-halter-aberturas__negro","top-encaje-corse__negro",
 "vestido-blazer-manga-larga__rojo","vestido-encaje-hombros-descubiertos__amarillo","vestido-blazer-halter__vinotinto",
 "top-encaje-hombro-descubierto__negro","vestido-mangas-acampanadas__rojo"}
DROP={"top-encaje-corse__negro-2","conjunto-chaleco-short__crema-lunares-plano","conjunto-chaleco-short__amarillo-plano"}
import sys; sys.path.insert(0,'.'); from specs import S
done=[]
for key,*_ in S:
    if key in DROP: continue
    src=f"{R}/{'B' if key in B else 'A'}/{key}.jpg"
    im=Image.open(src).convert("RGB").resize((800,1000),Image.LANCZOS)
    im.save(f"{OUT}/{key}.webp","WEBP",quality=82,method=6); done.append(key)
# hero: same cutout, on the brand's champagne instead of white
print(len(done),"fotos;", round(sum(os.path.getsize(f"{OUT}/{k}.webp") for k in done)/1e6,2),"MB")

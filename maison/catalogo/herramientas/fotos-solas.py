# Garment-only photos sent later by the shop (white background, no person).
# Copies them to public/catalogo as {pid}__{key}-sola.webp WITHOUT cropping or resizing.
# Only change: the white "Talla / Ref" sticker on the yellow jacket is rebuilt from its surroundings (it sits on the lining).
import json, sys, os, numpy as np, cv2
from PIL import Image
UP=sys.argv[1]
SOLAS=json.load(open("catalogo/herramientas/fotos-solas.json"))
for key,src in SOLAS.items():
    a=np.asarray(Image.open(os.path.join(UP,src)).convert("RGB")).copy()
    if key=="chaqueta-capucha-lunares__amarillo":
        h,w,_=a.shape; y0,y1,x0,x1=int(h*.19),int(h*.30),int(w*.42),int(w*.60)
        reg=a[y0:y1,x0:x1]; white=(reg.min(axis=2)>235)
        ys,xs=np.where(white); m=np.zeros(a.shape[:2],np.uint8)
        m[y0+ys.min()-4:y0+ys.max()+5, x0+xs.min()-4:x0+xs.max()+5]=255
        a=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA)
    Image.fromarray(a).save(f"public/catalogo/{key}-sola.webp","WEBP",quality=90,method=6)
    print(key, a.shape[1],"x",a.shape[0])

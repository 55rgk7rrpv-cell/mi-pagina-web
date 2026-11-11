# Step 1: cut each garment out once and save it with transparency (no framing yet).
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from rembg import new_session, remove
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from specs import S
U="/root/.claude/uploads/16ab63f0-5b1d-5e2d-9464-4b8b426ada6c/"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
# Version chosen after visual review: B = garment only (clothing mask), A = whole subject
B={"vestido-halter-volantes__blanco-lunares-grandes","vestido-halter-volantes__azul-marino","vestido-halter-volantes__blanco-lunares-pequenos",
 "vestido-largo-un-hombro__negro","vestido-halter-lunares-escote__vinotinto","vestido-halter-lunares-escote__crema",
 "vestido-floral-manga-globo__blanco-floral","vestido-midi-asimetrico__negro","top-halter-aberturas__negro","top-encaje-corse__negro",
 "vestido-blazer-manga-larga__rojo","vestido-encaje-hombros-descubiertos__amarillo","vestido-blazer-halter__vinotinto",
 "top-encaje-hombro-descubierto__negro","vestido-mangas-acampanadas__rojo"}
DROP={"top-encaje-corse__negro-2","conjunto-chaleco-short__crema-lunares-plano","conjunto-chaleco-short__amarillo-plano"}
PATCH={"conjunto-top-falda-sirena__azul-marino":[(0.385,0.3,0.48,0.41)]}
COLOR_KEY={"cinturon-cadena-corazones__dorado"}  # thin chain on a plain light background
DARK_KEY={"falda-plisada-short__gris"}            # dark garment on a light background next to skin
fg=new_session("isnet-general-use"); cl=new_session("u2net_cloth_seg")
def clean(m, thr=128):
    lab,n=ndimage.label(m>thr)
    if n==0: return m
    sizes=ndimage.sum(np.ones_like(m),lab,range(1,n+1)); big=sizes.max()
    keep=np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>=0.08*big])
    return np.where(keep,m,0).astype(np.uint8)
only=set(sys.argv[2:])
for key,f,crop,kind in S:
    if key in DROP or (only and key not in only): continue
    im=Image.open(U+f+"-image.jpg").convert("RGB")
    for (x0,y0,x1,y1) in PATCH.get(key,[]):
        ImageDraw.Draw(im).rectangle((int(x0*im.width),int(y0*im.height),int(x1*im.width),int(y1*im.height)),fill="white")
    if crop:
        x0,y0,x1,y1=crop; im=im.crop((int(x0*im.width),int(y0*im.height),int(x1*im.width),int(y1*im.height)))
    if key in COLOR_KEY:
        a=np.asarray(im).astype(np.int16); h,w,_=a.shape
        border=np.concatenate([a[:8].reshape(-1,3),a[-8:].reshape(-1,3),a[:,:8].reshape(-1,3),a[:,-8:].reshape(-1,3)])
        bgc=np.median(border,axis=0); d=np.sqrt(((a-bgc)**2).sum(2))
        m=np.clip((d-28)*8,0,255).astype(np.uint8)
        m=ndimage.binary_closing(m>128,iterations=2)*255
        lab,n=ndimage.label(m>128); sizes=ndimage.sum(np.ones_like(m),lab,range(1,n+1))
        m=(lab==(int(np.argmax(sizes))+1))*255   # the chain is one connected piece: keep only it
        mask=Image.fromarray(m.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    elif key in DARK_KEY:
        lum=np.asarray(im.convert("L")).astype(np.float32)
        sat=np.asarray(im.convert("HSV"))[:,:,1].astype(np.float32)
        m=np.clip((125-lum)*6,0,255)*(sat<70)          # dark AND grey: excludes skin and shadows on skin
        m=ndimage.binary_opening(m>128,iterations=2); m=ndimage.binary_closing(m,iterations=3); m=ndimage.binary_fill_holes(m)
        lab,n=ndimage.label(m); sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
        m=(lab==(int(np.argmax(sizes))+1))*255
        mask=Image.fromarray(m.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))
    else:
        mask=remove(im,session=fg,only_mask=True)
        if key in B:
            c=np.maximum.reduce([np.array(x) for x in cl.predict(im)]).astype(np.uint8)
            c=np.array(Image.fromarray(c).filter(ImageFilter.GaussianBlur(2)))
            mask=Image.fromarray(np.minimum(c,np.array(mask)).astype(np.uint8))
        mask=Image.fromarray(clean(np.array(mask)))
    out=im.copy(); out.putalpha(mask)
    out.save(f"{OUT}/{key}.png"); print("ok",key,flush=True)

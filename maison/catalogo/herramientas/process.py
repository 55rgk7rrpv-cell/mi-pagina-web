# v3: integrity first.
#  EXPAND  -> light, plain background: no background removal, no masks. Original photo pasted on a
#             larger pure-white square canvas ("canvas expand").
#  CUTOUT  -> busy background: soft isnet alpha kept as is (no thresholding), widened a few pixels
#             (a hairline of original background is preferred over losing fabric), whole figure kept
#             (no garment-only mask), no small-piece filtering.
# Then: square canvas = longest side + 18%, subject at the exact centre, never resized before pasting.
import sys, os, json, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from rembg import new_session, remove
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from specs import S
U="/root/.claude/uploads/16ab63f0-5b1d-5e2d-9464-4b8b426ada6c/"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True)
MARGIN=0.18; MAX_SIDE=1400
DROP={"top-encaje-corse__negro-2","conjunto-chaleco-short__crema-lunares-plano","conjunto-chaleco-short__amarillo-plano"}
EXPAND={"vestido-largo-strapless-rosa__vinotinto","vestido-floral-manga-globo__blanco-floral","vestido-midi-asimetrico__negro",
 "vestido-strapless-encaje-rosa__vinotinto","vestido-largo-halter-plisado__vinotinto","cinturon-elegante__marron","cinturon-elegante__negro",
 "top-saten-cruzado__marron","top-saten-cruzado__champana","top-saten-cruzado__negro","top-saten-cuello-alto__vinotinto","top-saten-cuello-alto__marron",
 "top-saten-lazo__rojo","top-saten-lazo__amarillo","top-saten-lazo__verde","top-saten-lazo__marron","top-saten-lazo__champana",
 "falda-plisada-short__gris","cinturon-cadena-corazones__dorado"}
CROP_FIX={"falda-plisada-short__gris":(0.0,0.0,1.0,0.695),"cinturon-cadena-corazones__dorado":(0.55,0.0,1.0,0.86),
 "cinturon-elegante__marron":(0.0,0.0,1.0,0.47),"cinturon-elegante__negro":(0.0,0.5,1.0,0.95),
 # satin tops: exact panel edges of the 5-colour collage (no slivers of the neighbouring panel)
 "top-saten-lazo__marron":(0.0,0.0,0.33,0.336),"top-saten-lazo__champana":(0.337,0.0,0.662,0.336),"top-saten-lazo__rojo":(0.67,0.0,1.0,0.336),
 "top-saten-lazo__verde":(0.0,0.348,0.33,0.667),"top-saten-lazo__amarillo":(0.337,0.348,0.662,0.667)}
PATCH={"conjunto-top-falda-sirena__azul-marino":[(0.385,0.3,0.48,0.41)]}   # "COLOR" overlay text touching the arm
L=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"labels.json")))
EXTRA_LABELS={"5726378b":[(0.835,0.925,0.96,0.985)],
 "b5dc6738":[(0.258,0.292,0.323,0.336),(0.597,0.296,0.655,0.336),(0.887,0.296,0.944,0.336),(0.25,0.617,0.311,0.667),(0.563,0.62,0.648,0.667)]}
def labels_for(f):
    boxes=[b for b in L.get(f,[]) if b[1]>0.55]          # stickers always sit low in the photo...
    if f=="2ff30d6c": boxes=L[f]                          # ...except this one, top-right
    return boxes+EXTRA_LABELS.get(f,[])
def erase(im, boxes):
    # rebuild the background under each sticker from its surroundings (inpainting), not a flat block
    import cv2
    a=np.asarray(im).copy(); h,w,_=a.shape; m=np.zeros((h,w),np.uint8)
    for x0,y0,x1,y1 in boxes:
        m[max(int(y0*h)-6,0):min(int(y1*h)+6,h), max(int(x0*w)-6,0):min(int(x1*w)+6,w)]=255
    if m.any(): a=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA)
    return Image.fromarray(a)
def frame(rgb, alpha=None):
    if alpha is None:
        g=rgb.convert("RGBA")
    else:
        g=rgb.copy(); g.putalpha(alpha)
        ys,xs=np.where(np.asarray(alpha)>8)              # bounding box from even faint pixels: nothing gets cut
        g=g.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
    gw,gh=g.size; side=int(round(max(gw,gh)*(1+MARGIN)))
    c=Image.new("RGB",(side,side),(255,255,255)); c.paste(g,((side-gw)//2,(side-gh)//2),g)
    if side>MAX_SIDE: c=c.resize((MAX_SIDE,MAX_SIDE),Image.LANCZOS)   # square->square, same factor both axes
    return c,(gw,gh,side)
fg=new_session("isnet-general-use")
only=set(sys.argv[2:]); log=[]
for key,f,crop,kind in S:
    if key in DROP or (only and key not in only): continue
    im=Image.open(U+f+"-image.jpg").convert("RGB")
    im=erase(im,labels_for(f))
    for (x0,y0,x1,y1) in PATCH.get(key,[]):
        ImageDraw.Draw(im).rectangle((int(x0*im.width),int(y0*im.height),int(x1*im.width),int(y1*im.height)),fill="white")
    crop=CROP_FIX.get(key,crop)
    if crop:
        x0,y0,x1,y1=crop; im=im.crop((int(x0*im.width),int(y0*im.height),int(x1*im.width),int(y1*im.height)))
    if key in EXPAND:
        out,info=frame(im); mode="expand"
    else:
        soft=np.asarray(remove(im,session=fg,only_mask=True)).astype(np.float32)
        core=soft>25
        core=ndimage.binary_dilation(core,iterations=5)        # grow the edge: keep a hairline of background
        core=ndimage.binary_fill_holes(core)                   # never punch holes inside the figure
        grown=np.asarray(Image.fromarray((core*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
        alpha=np.maximum(soft,grown)                           # only ever ADD opacity, never remove it
        out,info=frame(im,Image.fromarray(alpha.clip(0,255).astype(np.uint8))); mode="cutout"
    out.save(f"{OUT}/{key}.webp","WEBP",quality=88,method=6)
    log.append((key,mode)+info); print("ok",mode,key,flush=True)
json.dump(log,open(f"{OUT}/_log.json","w"))

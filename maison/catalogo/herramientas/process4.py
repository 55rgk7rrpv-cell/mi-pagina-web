# v4: no background removal, no masks, no baked-in canvas. Each web photo is the original photo:
#  - cropped only to isolate one colour panel of a collage (or the main figure of an "Inspo" collage),
#  - with the white "Talla / Ref" sticker rebuilt from its surroundings (inpainting; never on the garment),
#  - reduced uniformly if larger than 1600 px (never enlarged, never stretched).
# Framing (white background, margins, centring) is done by CSS on the page.
import sys, os, json, numpy as np, cv2
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from specs import S
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"process.py")).read()
ns={"json":json,"os":os,"__file__":os.path.abspath("process.py")}; exec(src[src.index("DROP="):src.index("def erase")], ns)
CROP_FIX,labels_for=ns["CROP_FIX"],ns["labels_for"]
DROP={"top-encaje-corse__negro-2"}  # the flat-lay insets of the vest set are now wanted (garment only)
U="/root/.claude/uploads/16ab63f0-5b1d-5e2d-9464-4b8b426ada6c/"
OUT=sys.argv[1]; os.makedirs(OUT,exist_ok=True); MAXS=1600
OVERLAY={"vestido-halter-lunares-escote__vinotinto":[(0.24,0.476,0.296,0.51)]}  # size sticker "S" on the first panel
# "Inspo COLOR" title printed on the white background of 4 collages: erase only its dark letter pixels
TEXT={"b6999bf0":(0.38,0.27,0.66,0.41),"e2acbed6":(0.37,0.27,0.66,0.41),"24c7a896":(0.38,0.27,0.66,0.41),"8194e676":(0.37,0.275,0.65,0.392)}
rep=[]
for key,f,crop,kind in S:
    if key in DROP: continue
    im=Image.open(U+f+"-image.jpg").convert("RGB"); a=np.asarray(im).copy(); h,w,_=a.shape
    m=np.zeros((h,w),np.uint8)
    for x0,y0,x1,y1 in labels_for(f)+OVERLAY.get(key,[]):
        m[max(int(y0*h)-6,0):min(int(y1*h)+6,h), max(int(x0*w)-6,0):min(int(x1*w)+6,w)]=255
    if f in TEXT:
        x0,y0,x1,y1=TEXT[f]; X0,Y0,X1,Y1=int(x0*w),int(y0*h),int(x1*w),int(y1*h)
        lum=a[Y0:Y1,X0:X1].mean(2)
        t=(lum<140).astype(np.uint8)*255
        t=cv2.dilate(t,np.ones((5,5),np.uint8),iterations=1)
        m[Y0:Y1,X0:X1]=np.maximum(m[Y0:Y1,X0:X1],t)
    if m.any(): a=cv2.inpaint(a,m,9,cv2.INPAINT_TELEA)
    im=Image.fromarray(a)
    crop=CROP_FIX.get(key,crop)
    if crop:
        x0,y0,x1,y1=crop; im=im.crop((int(x0*w),int(y0*h),int(x1*w),int(y1*h)))
    cw,ch=im.size; s=min(1,MAXS/max(cw,ch))
    if s<1: im=im.resize((round(cw*s),round(ch*s)),Image.LANCZOS)
    im.save(f"{OUT}/{key}.webp","WEBP",quality=88,method=6)
    rep.append(abs(cw/ch-im.size[0]/im.size[1]))
print(len(rep),"fotos. Variación máxima de proporción:",round(max(rep),4))

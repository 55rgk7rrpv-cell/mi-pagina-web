# Find the white "Talla / Ref" stickers: a near-pure-white rounded box with dark bold text inside.
import os, json, numpy as np
from PIL import Image
from scipy import ndimage
U="/root/.claude/uploads/16ab63f0-5b1d-5e2d-9464-4b8b426ada6c/"
def find(im):
    a=np.asarray(im.convert("RGB")).astype(int); h,w,_=a.shape
    white=(a.min(2)>=246)
    dark=(a.max(2)<90)
    lab,n=ndimage.label(ndimage.binary_closing(white|dark,iterations=1) & ~dark | white)
    out=[]
    for i,sl in enumerate(ndimage.find_objects(lab)):
        if sl is None: continue
        y0,y1,x0,x1=sl[0].start,sl[0].stop,sl[1].start,sl[1].stop
        bw,bh=x1-x0,y1-y0; area=bw*bh
        if not (0.002*w*h<area<0.06*w*h): continue
        if bw<0.06*w or bh<0.025*h or bw>0.5*w: continue
        box=a[y0:y1,x0:x1]
        wf=(box.min(2)>=246).mean(); df=(box.max(2)<90).mean()
        if wf>0.45 and 0.04<df<0.45:
            out.append([x0/w,y0/h,x1/w,y1/h])
    return out
res={}
for f in sorted(os.listdir(U)):
    if not f.endswith(".jpg"): continue
    res[f[:8]]=find(Image.open(U+f))
json.dump(res,open("labels.json","w"),indent=0)
print(sum(1 for v in res.values() if v),"fotos con etiqueta detectada de",len(res))
print("sin detectar:",[k for k,v in res.items() if not v])

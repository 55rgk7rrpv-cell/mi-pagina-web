import sys, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from rembg import new_session, remove
sys.path.insert(0, os.path.dirname(__file__)); from specs import S
U="/root/.claude/uploads/16ab63f0-5b1d-5e2d-9464-4b8b426ada6c/"
OUT=sys.argv[1]; os.makedirs(OUT+"/A",exist_ok=True); os.makedirs(OUT+"/B",exist_ok=True)
fg=new_session("isnet-general-use"); cl=new_session("u2net_cloth_seg")
W,H=1000,1250
def keep_main(m):
    # drop stray blobs (size labels, text) and keep the big connected shapes
    lab,n=ndimage.label(m>128)
    if n==0: return m
    sizes=ndimage.sum(np.ones_like(m),lab,range(1,n+1)); big=sizes.max()
    keep=np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>=0.08*big])
    return np.where(keep,m,0).astype(np.uint8)
def place(im,mask):
    m=np.array(mask); ys,xs=np.where(m>20)
    if len(xs)==0: return None
    box=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
    im=im.crop(box); mask=mask.crop(box)
    s=min(W*0.86/im.width,H*0.9/im.height)
    im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS)
    mask=mask.resize(im.size,Image.LANCZOS)
    c=Image.new("RGB",(W,H),"white"); c.paste(im,((W-im.width)//2,(H-im.height)//2),mask); return c
only=set(sys.argv[2:])
PATCH={"conjunto-top-falda-sirena__azul-marino":[(0.385,0.3,0.48,0.41)]}
for key,f,crop,kind in S:
    if only and key not in only: continue
    im=Image.open(U+f+"-image.jpg").convert("RGB")
    # paint out overlay text that touches the model (fractions of the original photo)
    for (px0,py0,px1,py1) in PATCH.get(key,[]):
        from PIL import ImageDraw
        ImageDraw.Draw(im).rectangle((int(px0*im.width),int(py0*im.height),int(px1*im.width),int(py1*im.height)),fill="white")
    if crop:
        x0,y0,x1,y1=crop; im=im.crop((int(x0*im.width),int(y0*im.height),int(x1*im.width),int(y1*im.height)))
    if kind=="plain":
        # already on a clean background: just frame it on the white canvas
        c=Image.new("RGB",(W,H),"white"); s_=min(W*0.92/im.width,H*0.92/im.height)
        im2=im.resize((int(im.width*s_),int(im.height*s_)),Image.LANCZOS); c.paste(im2,((W-im2.width)//2,(H-im2.height)//2))
        c.save(f"{OUT}/A/{key}.jpg",quality=90); print("ok",key,flush=True); continue
    a=remove(im,session=fg,only_mask=True)
    a=Image.fromarray(keep_main(np.array(a)))
    r=place(im,a); r and r.save(f"{OUT}/A/{key}.jpg",quality=90)
    if kind=="model":
        ms=cl.predict(im); c=np.maximum.reduce([np.array(x) for x in ms]).astype(np.float32)
        c=Image.fromarray(c.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
        b=np.minimum(np.array(c),np.array(a)).astype(np.uint8)
        b=Image.fromarray(keep_main(b))
        r=place(im,b); r and r.save(f"{OUT}/B/{key}.jpg",quality=90)
    print("ok",key,flush=True)

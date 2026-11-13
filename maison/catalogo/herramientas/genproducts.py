import json, re, unicodedata
cat=json.load(open("catalogo/catalogo.json"))["productos"]
MEASURED=json.load(open("catalogo/herramientas/colores-medidos.json"))  # swatch = real colour measured on the photo
PRICE_FIX={}  # prices now live only in catalogo.json
def slug(s):
    s=unicodedata.normalize("NFD",s.lower()); s="".join(c for c in s if unicodedata.category(c)!="Mn")
    return re.sub(r"[^a-z0-9]+","-",s).strip("-")
# color name -> (image key suffix, swatch hex)
SW=[("rojo","#C1121F"),("vinotinto","#6D1A2C"),("azul marino","#1F2A44"),("amarillo claro","#F3EAB5"),("amarillo","#EFCB4A"),
    ("rosa","#F0BFCB"),("verde","#1F5C3F"),("marron y negro","#5A3A2E"),("marron","#5A3A2E"),("champana","#E7D8BE"),("crema","#EDE3CF"),
    ("blanco","#F6F3EC"),("negro y blanco","#1A1A1A"),("negro","#161616"),("gris","#3C3C3C"),("dorado","#C9A35C")]
def hexof(name):
    n=slug(name).replace("-"," ")
    for k,h in SW:
        if n.startswith(k): return h
    return "#999999"
# per-colour image keys exported in public/catalogo
IMG={
 "vestido-halter-volantes":["rojo","blanco-lunares-grandes","azul-marino","blanco-lunares-pequenos"],
 "conjunto-top-falda-sirena":["azul-marino"],"vestido-largo-strapless-rosa":["vinotinto"],
 "vestido-largo-un-hombro":["amarillo-claro","negro"],"vestido-halter-lunares-escote":["vinotinto","negro","crema"],
 "vestido-floral-manga-globo":["blanco-floral"],"top-tul-volantes":["negro"],"vestido-otra-pinta-lenceria":["marron-negro"],
 "vestido-midi-asimetrico":["negro"],"top-halter-aberturas":["negro"],"vestido-strapless-encaje-rosa":["vinotinto"],
 "falda-volantes-bicolor":["negro-blanco"],"chaqueta-capucha-lunares":["amarillo","rosa"],"top-encaje-corse":["negro"],
 "falda-saten-encaje":["negro"],"top-saten-cruzado":["marron","champana","negro"],"top-saten-cuello-alto":["vinotinto","marron"],
 "top-saten-lazo":["rojo","amarillo","verde","marron","champana"],"vestido-blazer-manga-larga":["rojo"],
 "vestido-encaje-hombros-descubiertos":["amarillo"],"vestido-blazer-halter":["vinotinto"],
 "vestido-largo-espalda-descubierta":["amarillo-claro"],"enterizo-tul-manga-larga":["negro"],
 "vestido-largo-lunares-panuelo":["amarillo"],"vestido-halter-suelto":["rojo"],"vestido-largo-halter-plisado":["vinotinto"],
 "vestido-asimetrico-volantes":["vinotinto"],"vestido-halter-suelto-tul":["blanco-lunares"],
 "vestido-corto-lunares-panuelo":["amarillo","marron","crema","negro"],"top-encaje-hombro-descubierto":["negro"],
 "vestido-mangas-acampanadas":["rojo"],"conjunto-chaleco-short":["amarillo-plano","crema-lunares-plano"],"falda-larga-encaje":["negro"],
 "falda-plisada-short":["gris"],"cinturon-cadena-corazones":["dorado"],"cinturon-elegante":["marron","negro"],
}
EXTRA={"vestido-floral-manga-globo":["blanco-floral-2"],"vestido-largo-halter-plisado":["vinotinto-modelo"],
 "conjunto-chaleco-short":["amarillo","crema-lunares"],"cinturon-cadena-corazones":["dorado-modelo"]}
# Garment-only images generated with AI (Canva) from the real model photo. They become the colour's photo;
# the real photo stays in the gallery. The page marks them as illustrative.
GENERATED={"conjunto-top-falda-sirena__azul-marino","vestido-largo-strapless-rosa__vinotinto"}
# Real garment-only photos sent later by the shop (catalogo/fotos-solas-originales, copied by fotos-solas.py).
# They become the colour's photo. The older photo stays in the gallery only if it shows the garment worn;
# an older garment-only shot of the same piece (hanger, floor, low resolution) is replaced.
SOLAS=set(json.load(open("catalogo/herramientas/fotos-solas.json")))
# Photos that show only the garment: no person, not even a hand. Everything else counts as "with model".
GARMENT_ONLY={
 "vestido-strapless-encaje-rosa__vinotinto","falda-volantes-bicolor__negro-blanco","chaqueta-capucha-lunares__rosa",
 "top-saten-cruzado__marron","top-saten-cruzado__champana","top-saten-cruzado__negro",
 "top-saten-cuello-alto__vinotinto","top-saten-cuello-alto__marron",
 "top-saten-lazo__rojo","top-saten-lazo__amarillo","top-saten-lazo__verde","top-saten-lazo__marron","top-saten-lazo__champana",
 "vestido-largo-halter-plisado__vinotinto","cinturon-cadena-corazones__dorado","cinturon-elegante__marron","cinturon-elegante__negro",
 "conjunto-chaleco-short__amarillo-plano","conjunto-chaleco-short__crema-lunares-plano"}
import colorsys, numpy as np
from PIL import Image
def vivid(path):
    a=np.asarray(Image.open(path).convert("RGB")).astype(float)/255; h,w,_=a.shape
    reg=a[int(h*.3):int(h*.7), int(w*.3):int(w*.7)].reshape(-1,3)
    hsv=np.array([colorsys.rgb_to_hsv(*px) for px in reg[::9]])
    skin=(hsv[:,0]>0.02)&(hsv[:,0]<0.11)&(hsv[:,1]>0.18)&(hsv[:,1]<0.6)&(hsv[:,2]>0.45)
    keep=hsv[~skin] if (~skin).sum()>50 else hsv
    med=np.median(np.array([colorsys.hsv_to_rgb(*x) for x in keep]),axis=0); hh,ss,vv=colorsys.rgb_to_hsv(*med)
    # vividness = saturation weighted above brightness, so beige/cream/champagne never beat a real colour
    return ss*(vv**0.5), "#%02X%02X%02X"%tuple(int(x*255) for x in med)
DESC={
 "vestido-halter-volantes":"Cuello halter, cintura fruncida que estiliza y una falda de volantes en capas que se mueve contigo.",
 "conjunto-top-falda-sirena":"Top corto drapeado y falda larga tipo sirena con fruncido en la cadera. Dos piezas que juntas son un look completo.",
 "vestido-largo-strapless-rosa":"Strapless ajustado con rosa aplicada, abertura lateral y volantes en el ruedo. Incluye gargantilla de rosa.",
 "vestido-largo-un-hombro":"Un solo hombro, cuerpo fruncido hasta la cadera y falda larga y vaporosa. Elegante sin esfuerzo.",
 "vestido-halter-lunares-escote":"Corto, con escote en V profundo, espalda descubierta y falda con vuelo. Lunares que nunca pasan de moda.",
 "vestido-floral-manga-globo":"Estampado floral, mangas globo, escote en V y falda con vuelo. Romántico y fresco.",
 "top-tul-volantes":"Top de tirantes con tul semitransparente, lazo al frente y volantes que caen a los lados.",
 "vestido-otra-pinta-lenceria":"Nuestro vestido insignia: franela marrón con encaje negro encima, en tendencia lingerie look. Tela: poliamida.",
 "vestido-midi-asimetrico":"Midi ajustado, con hombro asimétrico, drapeado lateral y abertura en la pierna.",
 "top-halter-aberturas":"Top halter fruncido con aberturas al frente y ruedo con volante.",
 "vestido-strapless-encaje-rosa":"Strapless de encaje con cintura fruncida, falda de volantes en capas y una rosa con cinta caída.",
 "falda-volantes-bicolor":"Falda corta negra con volantes blancos en capas. Contraste puro.",
 "chaqueta-capucha-lunares":"Chaqueta ligera con capucha, cierre y puños elásticos, en lunares.",
 "top-encaje-corse":"Top tipo corsé de encaje con copas, tirantes finos y abertura al centro.",
 "falda-saten-encaje":"Falda midi de satén con ruedo en picos de encaje. Combínala con el top de encaje tipo corsé.",
 "top-saten-cruzado":"Top de satén con cuello halter cruzado y ruedo asimétrico de encaje.",
 "top-saten-cuello-alto":"Top de satén con cuello alto, sin mangas y ruedo asimétrico de encaje.",
 "top-saten-lazo":"Top de satén que se amarra al cuello con lazo, con ruedo de encaje. Cinco colores para elegir.",
 "vestido-blazer-manga-larga":"Vestido blazer de manga larga, cuello solapa y falda con pliegues. Poder y feminidad.",
 "vestido-encaje-hombros-descubiertos":"Encaje con hombros descubiertos, mangas largas transparentes y falda de volantes.",
 "vestido-blazer-halter":"Vestido blazer halter con solapas, botones al frente y falda con pliegues.",
 "vestido-largo-espalda-descubierta":"Largo, con escote y abertura al frente, espalda descubierta y fruncido que marca la figura.",
 "enterizo-tul-manga-larga":"Enterizo corto de tul fruncido, cuello alto y manga larga.",
 "vestido-largo-lunares-panuelo":"Largo y ajustado, de tirantes, con lunares y un pañuelo a juego para el cuello.",
 "vestido-halter-suelto":"Halter suelto con lazo en la espalda y falda corta de volantes. Ligero y coqueto.",
 "vestido-largo-halter-plisado":"Largo, cuello halter con lazo, cuerpo texturizado y falda plisada en capas.",
 "vestido-asimetrico-volantes":"Un solo hombro, cuerpo fruncido y ruedo asimétrico de volantes.",
 "vestido-halter-suelto-tul":"Halter suelto con lunares, lazo en la espalda y falda de volantes con borde de tul.",
 "vestido-corto-lunares-panuelo":"Corto, de escote pronunciado, con lunares y pañuelo largo a juego. Cuatro colores.",
 "top-encaje-hombro-descubierto":"Top de encaje con un hombro descubierto, manga larga y ruedo asimétrico.",
 "vestido-mangas-acampanadas":"Corto, con hombros descubiertos, mangas acampanadas y falda de volantes en capas.",
 "conjunto-chaleco-short":"Chaleco con botones dorados y short a juego. Fresco y elegante a la vez.",
 "falda-larga-encaje":"Falda de encaje con volantes, corta al frente y larga atrás.",
 "falda-plisada-short":"Falda corta plisada con short por dentro, para moverte con tranquilidad.",
 "cinturon-cadena-corazones":"Cinturón de cadena dorada con medallones y corazones.",
 "cinturon-elegante":"Cinturón de cuero sintético con hebilla y puntera doradas. Precio por unidad.",
}
CATMAP={"Conjuntos":"Conjuntos"}
out=[]
for i,p in enumerate(cat):
    pid=p["id"]; keys=IMG[pid]; assert len(keys)==len(p["variantes"]),pid
    # pair every colour with its photo BY NAME (never by position: colour order changes with the cover rule)
    def words(x): return set(slug(x).split("-"))-{"con","y","plano"}
    pairs=[]
    for v in p["variantes"]:
        if len(keys)==1: k=keys[0]
        else:
            cand=[k for k in keys if words(k) <= words(v["color"])]
            if len(cand)>1: cand=[max(cand,key=lambda k:len(words(k)))]
            assert len(cand)==1,(pid,v["color"],cand)
            k=cand[0]
        pairs.append((v,k))
    assert len({k for _,k in pairs})==len(keys),(pid,"photo used twice")
    colors=[]; real_photos=[]
    for v,k in pairs:
        img=f"catalogo/{pid}__{k}.webp"; ai=f"{pid}__{k}" in GENERATED and f"{pid}__{k}" not in SOLAS
        if f"{pid}__{k}" in SOLAS:
            if f"{pid}__{k}" not in GARMENT_ONLY: real_photos.append({"src":img,"withModel":True})
            img=f"catalogo/{pid}__{k}-sola.webp"
        elif ai:
            real_photos.append({"src":img,"withModel":True})
            img=f"catalogo/{pid}__{k}-ia.webp"
        vv,hx=vivid("public/"+img)
        colors.append({"name":v["color"],"hex":hx,"sizes":v["tallas"],"image":img,
                       "withModel":(not ai) and f"{pid}__{k}" not in GARMENT_ONLY and f"{pid}__{k}" not in SOLAS,"aiGenerated":ai,"_v":vv})
    # Rule 1: a garment-only photo is always the cover when one exists. Rule 2: then the most vivid colour.
    colors.sort(key=lambda c:(c["withModel"],-c["_v"]))
    for c in colors: c.pop("_v")
    gallery=real_photos+[{"src":f"catalogo/{pid}__{k}.webp","withModel":f"{pid}__{k}" not in GARMENT_ONLY} for k in EXTRA.get(pid,[])]
    sizes_total=sum(len(c["sizes"]) for c in colors)
    out.append({"id":pid,"name":p["nombre"],"category":p["categoria"],"price":p["precio_usd"],
      "description":DESC[pid],"colors":colors,"gallery":gallery,
      "coverHasModel":colors[0]["withModel"],
      "badge":"Última pieza" if sizes_total==1 else None,"featured":0})
    # keep the master catalogue in the same order and record what the web uses
    order={c["name"]:j for j,c in enumerate(colors)}
    p["variantes"].sort(key=lambda v:order[v["color"]])
    for v in p["variantes"]:
        c=next(c for c in colors if c["name"]==v["color"]); v["foto_web"]=c["image"]; v["con_modelo"]=c["withModel"]
    p["imagen_principal"]=colors[0]["image"]; p["portada_con_modelo"]=colors[0]["withModel"]
    p["imagenes_secundarias"]=[c["image"] for c in colors[1:]]+[g["src"] for g in gallery]
# "Destacados": products with a garment-only cover first, keeping catalogue order inside each group
for n,o in enumerate(sorted(out,key=lambda o:(o["coverHasModel"],cat.index(next(c for c in cat if c["id"]==o["id"]))))): o["featured"]=n+1
json.dump({"tienda":"Otra Pinta","moneda":"USD","productos":cat},open("catalogo/catalogo.json","w"),ensure_ascii=False,indent=2)
js=json.dumps(out,ensure_ascii=False,indent=2)
ts='''// Catálogo de Otra Pinta. Generado a partir de catalogo/catalogo.json.
// Cada color tiene su propia foto (prenda sobre fondo blanco) y sus tallas.

export type Category = "Vestidos" | "Conjuntos" | "Tops" | "Faldas" | "Chaquetas" | "Accesorios";

export interface ColorVariant {
  name: string;
  hex: string;
  sizes: string[];
  image: string;
  /** true when the photo shows a person (model, or a hand holding the garment) */
  withModel: boolean;
  /** true when the photo is an AI rendering made from the real photo (shown as illustrative) */
  aiGenerated: boolean;
}

export interface GalleryImage {
  src: string;
  withModel: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Precio en USD (el "Ref" del catálogo) */
  price: number;
  description: string;
  /** El primer color es la portada: el más llamativo */
  colors: ColorVariant[];
  /** Fotos extra del mismo producto (solo para la galería de la vista rápida) */
  gallery: GalleryImage[];
  /** true while the product still has no garment-only photo */
  coverHasModel: boolean;
  badge: "Última pieza" | null;
  featured: number;
}

export const CATEGORIES: ("Todo" | Category)[] = ["Todo", "Vestidos", "Conjuntos", "Tops", "Faldas", "Chaquetas", "Accesorios"];

export const PRODUCTS: Product[] = ''' + js + ''';

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

/** AI renderings, so the page can label them as illustrative */
export const isAiImage = (p: Product, src: string) => p.colors.some((c) => c.image === src && c.aiGenerated);

export const getColor = (p: Product, color?: string) => p.colors.find((c) => c.name === color) ?? p.colors[0];

/** All photos of a product (quick-view gallery): one per colour, then the extra shots */
export const productImages = (p: Product) => [...p.colors.map((c) => c.image), ...p.gallery.map((g) => g.src)];

/** Garment-only photos (no person): the only ones the catalogue grid may show */
export const garmentImages = (p: Product) =>
  [...p.colors.filter((c) => !c.withModel).map((c) => c.image), ...p.gallery.filter((g) => !g.withModel).map((g) => g.src)];
'''
open("src/lib/products.ts","w").write(ts)
print(len(out),"productos; categorías:",sorted({o["category"] for o in out}))
import os
missing=[c["image"] for o in out for c in o["colors"] if not os.path.exists("public/"+c["image"])]+[g["src"] for o in out for g in o["gallery"] if not os.path.exists("public/"+g["src"])]
print("fotos que faltan:",missing)

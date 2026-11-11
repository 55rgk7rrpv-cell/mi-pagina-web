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
 "vestido-mangas-acampanadas":["rojo"],"conjunto-chaleco-short":["amarillo","crema-lunares"],"falda-larga-encaje":["negro"],
 "falda-plisada-short":["gris"],"cinturon-cadena-corazones":["dorado"],"cinturon-elegante":["marron","negro"],
}
EXTRA={"vestido-floral-manga-globo":["blanco-floral-2"],"vestido-largo-halter-plisado":["vinotinto-modelo"]}
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
    colors=[]
    for v,k in zip(p["variantes"],keys):
        colors.append({"name":v["color"],"hex":MEASURED.get(f"{pid}||{v['color']}",[hexof(v["color"])])[0],"sizes":v["tallas"],"image":f"catalogo/{pid}__{k}.webp"})
    sizes_total=sum(len(c["sizes"]) for c in colors)
    out.append({"id":pid,"name":p["nombre"],"category":p["categoria"],"price":PRICE_FIX.get(pid,p["precio_usd"]),
      "description":DESC[pid],"colors":colors,"gallery":[f"catalogo/{pid}__{k}.webp" for k in EXTRA.get(pid,[])],
      "badge":"Última pieza" if sizes_total==1 else None,"featured":i+1})
    assert out[-1]["price"] is not None, pid
js=json.dumps(out,ensure_ascii=False,indent=2)
ts='''// Catálogo de Otra Pinta. Generado a partir de catalogo/catalogo.json.
// Cada color tiene su propia foto (prenda sobre fondo blanco) y sus tallas.

export type Category = "Vestidos" | "Conjuntos" | "Tops" | "Faldas" | "Chaquetas" | "Accesorios";

export interface ColorVariant {
  name: string;
  hex: string;
  sizes: string[];
  image: string;
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
  /** Fotos extra del mismo producto */
  gallery: string[];
  badge: "Última pieza" | null;
  featured: number;
}

export const CATEGORIES: ("Todo" | Category)[] = ["Todo", "Vestidos", "Conjuntos", "Tops", "Faldas", "Chaquetas", "Accesorios"];

export const PRODUCTS: Product[] = ''' + js + ''';

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const getColor = (p: Product, color?: string) => p.colors.find((c) => c.name === color) ?? p.colors[0];

/** All photos of a product: one per colour, then the extra shots */
export const productImages = (p: Product) => [...p.colors.map((c) => c.image), ...p.gallery];
'''
open("src/lib/products.ts","w").write(ts)
print(len(out),"productos; categorías:",sorted({o["category"] for o in out}))
import os
missing=[c["image"] for o in out for c in o["colors"] if not os.path.exists("public/"+c["image"])]+[g for o in out for g in o["gallery"] if not os.path.exists("public/"+g)]
print("fotos que faltan:",missing)

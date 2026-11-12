# Independent audit: expected values typed straight from the labels on the 44 photos.
import json, os
src=open("src/lib/products.ts").read()
P=json.loads(src[src.index("PRODUCTS: Product[] = ")+22:src.index("];\n\nexport const getProduct")+1])
E={ # id: (price, {colour prefix: [sizes]}, cover prefix)
 "vestido-halter-volantes":(35,{"Rojo":["XS"],"Blanco con lunares grandes":["M (ajusta S)"],"Azul marino":["L (ajusta M)"],"Blanco con lunares pequeños":["S"]},"Rojo"),
 "conjunto-top-falda-sirena":(45,{"Azul marino":["S","M"]},None),
 "vestido-largo-strapless-rosa":(45,{"Vinotinto":["XS","S"]},None),
 "vestido-largo-un-hombro":(45,{"Amarillo claro":["S"],"Negro":["S"]},"Amarillo claro"),
 "vestido-halter-lunares-escote":(28,{"Vinotinto":["S"],"Negro":["XS","M"],"Crema":["M"]},"Vinotinto"),
 "vestido-floral-manga-globo":(40,{"Blanco":["S"]},None),
 "top-tul-volantes":(20,{"Negro":["XXS"]},None),
 "vestido-otra-pinta-lenceria":(28,{"Marrón y negro":["S"]},None),
 "vestido-midi-asimetrico":(38,{"Negro":["XXS"]},None),
 "top-halter-aberturas":(16,{"Negro":["XS"]},None),
 "vestido-strapless-encaje-rosa":(35,{"Vinotinto":["XS","S"]},None),
 "falda-volantes-bicolor":(28,{"Negro y blanco":["S","M"]},None),
 "chaqueta-capucha-lunares":(38,{"Amarillo":["L"],"Rosa":["M"]},"Rosa"),
 "top-encaje-corse":(20,{"Negro":["XS","M"]},None),
 "falda-saten-encaje":(30,{"Negro":["XS","S"]},None),
 "top-saten-cruzado":(18,{"Marrón":["S"],"Champaña":["XXS"],"Negro":["XS"]},"Marrón"),
 "top-saten-cuello-alto":(18,{"Vinotinto":["M"],"Marrón":["S"]},"Vinotinto"),
 "top-saten-lazo":(18,{"Rojo":["S"],"Amarillo":["XXS"],"Verde":["M"],"Marrón":["M"],"Champaña":["XS"]},"Rojo"),
 "vestido-blazer-manga-larga":(70,{"Rojo":["M"]},None),
 "vestido-encaje-hombros-descubiertos":(35,{"Amarillo":["S"]},None),
 "vestido-blazer-halter":(60,{"Vinotinto":["S"]},None),
 "vestido-largo-espalda-descubierta":(43,{"Amarillo claro":["S"]},None),
 "enterizo-tul-manga-larga":(30,{"Negro":["S"]},None),
 "vestido-largo-lunares-panuelo":(40,{"Amarillo":["S"]},None),
 "vestido-halter-suelto":(35,{"Rojo":["S"]},None),
 "vestido-largo-halter-plisado":(45,{"Vinotinto":["S"]},None),
 "vestido-asimetrico-volantes":(38,{"Vinotinto":["S"]},None),
 "vestido-halter-suelto-tul":(40,{"Blanco":["XS"]},None),
 "vestido-corto-lunares-panuelo":(30,{"Amarillo":["L"],"Marrón":["S"],"Crema":["XS"],"Negro":["XXS"]},"Amarillo"),
 "top-encaje-hombro-descubierto":(16,{"Negro":["XS"]},None),
 "vestido-mangas-acampanadas":(38,{"Rojo":["M"]},None),
 "conjunto-chaleco-short":(30,{"Amarillo":["XS","M"],"Crema":["S","M"]},"Amarillo"),
 "falda-larga-encaje":(30,{"Negro":["XXS","S"]},None),
 "falda-plisada-short":(28,{"Gris":["S"]},None),
 "cinturon-cadena-corazones":(15,{"Dorado":["Única"]},None),
 "cinturon-elegante":(13,{"Marrón":["Única"],"Negro":["Única"]},"Marrón"),
}
errors=[]; got={p["id"]:p for p in P}
if set(got)!=set(E): errors.append(("productos distintos", set(got)^set(E)))
for pid,(price,cols,cover) in E.items():
    p=got.get(pid)
    if not p: continue
    if p["price"]!=price: errors.append((pid,"precio",p["price"],price))
    if len(p["colors"])!=len(cols): errors.append((pid,"nº colores",len(p["colors"]),len(cols)))
    for pref,sizes in cols.items():
        m=[c for c in p["colors"] if c["name"].startswith(pref)]
        if len(m)!=1: errors.append((pid,"color",pref,[c["name"] for c in p["colors"]])); continue
        if m[0]["sizes"]!=sizes: errors.append((pid,pref,"tallas",m[0]["sizes"],sizes))
        if not os.path.exists("public/"+m[0]["image"]): errors.append((pid,pref,"falta foto"))
    if cover and not p["colors"][0]["name"].startswith(cover): errors.append((pid,"portada",p["colors"][0]["name"],cover))
# rule: if a product has any garment-only photo, its cover must be garment-only
for p in P:
    if any(not c["withModel"] for c in p["colors"]) and p["colors"][0]["withModel"]: errors.append((p["id"],"portada con modelo habiendo foto de la prenda sola"))
imgs=[c["image"] for p in P for c in p["colors"]]
if len(imgs)!=len(set(imgs)): errors.append(("una foto repetida en dos colores",))
print(f"{len(P)} productos, {sum(len(p['colors']) for p in P)} variantes de color, {sum(len(c['sizes']) for p in P for c in p['colors'])} tallas revisadas.")
print("Errores:", errors or "ninguno")

# Cómo se prepararon las fotos del catálogo

1. `specs.py`: qué foto original corresponde a cada producto y color, y qué parte recortar.
2. `rgba.py`: recorta cada prenda una sola vez y la guarda con transparencia, sin encuadrar.
   Usa `rembg` (modelos `isnet-general-use` y `u2net_cloth_seg`); la falda plisada y el cinturón
   de corazones se separan por color porque el recorte automático fallaba con ellas.
3. `frame.py`: encuadre estricto. Lienzo cuadrado blanco puro (#FFFFFF) cuyo lado es el lado más
   largo de la prenda + 18 %, prenda pegada en el centro exacto, sin estirar ni agrandar.
   Al final verifica margen, centrado y proporciones de cada foto.
4. `genproducts.py`: genera `src/lib/products.ts` a partir de `catalogo.json`.

`cutout.py` es la versión anterior (encuadre fijo 4:5 con márgenes de ~5 %), que se reemplazó.

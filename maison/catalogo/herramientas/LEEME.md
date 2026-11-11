# Cómo se prepararon las fotos del catálogo

1. `specs.py`: qué foto original corresponde a cada producto y color, y qué parte recortar.
2. `cutout.py`: quita el fondo y deja la prenda (o la modelo) sobre fondo blanco, en 1000×1250.
   Usa la librería `rembg` (modelos `isnet-general-use` y `u2net_cloth_seg`).
3. `export.py`: elige la mejor versión de cada foto y la guarda en `public/catalogo/` en formato WebP.
4. `genproducts.py`: genera `src/lib/products.ts` a partir de `catalogo.json`.

Para añadir prendas nuevas: agrega la foto en `specs.py`, el producto en `catalogo.json`
y vuelve a correr los cuatro pasos.

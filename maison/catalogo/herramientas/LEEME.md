# Cómo se prepararon las fotos del catálogo (v4, vigente)

Regla: **no se quita el fondo ni se recorta la prenda**. Las fotos originales no se modifican;
las copias web solo:
1. se recortan para separar cada color cuando la foto original es un collage (`specs.py`);
2. borran la etiqueta blanca "Talla / Ref" y el título "Inspo COLOR", reconstruyendo el fondo
   de alrededor (inpainting, `labels.json`), nunca sobre la prenda;
3. se reducen de tamaño de forma proporcional si superan 1600 px (nunca se agrandan ni se estiran).

El encuadre lo hace el CSS de la tienda: tarjeta cuadrada blanca, margen limpio del 7 % por lado,
`object-fit: contain` y foto centrada.

- `process4.py`: genera las copias web en `public/catalogo/`.
- `audit.py`: comprueba precio, colores, tallas, portada y foto de cada producto contra lo que dicen
  las fotos originales. Ejecutar desde `maison/` con `python3 catalogo/herramientas/audit.py`.
- `genproducts.py`: genera `src/lib/products.ts` a partir de `catalogo.json`.
- `process.py` y `labels.py`: versión anterior (v3, con recorte de fondo) y detector de etiquetas.

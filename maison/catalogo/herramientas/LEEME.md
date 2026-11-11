# Cómo se prepararon las fotos del catálogo (v3)

Regla principal: **la prenda nunca pierde pedazos**. Es preferible un borde finito del fondo original.

1. `labels.py` detecta las etiquetas blancas de "Talla / Ref" en las fotos originales (`labels.json`).
2. `process.py` procesa cada foto definida en `specs.py`:
   - Borra las etiquetas reconstruyendo el fondo alrededor (inpainting), no con un bloque de color.
   - **Fondo claro y liso** (estudio, mármol, cinturones, el render): NO se quita el fondo ni se usan
     máscaras. Se pega la foto original sobre un lienzo blanco más grande ("canvas expand").
   - **Fondo cargado** (exteriores, paredes, pisos): se quita el fondo de forma suave: se conserva la
     transparencia original (sin umbral), se ensancha el borde unos píxeles, se rellenan huecos internos
     y no se descartan piezas pequeñas. Se conserva la figura completa (no se recorta "solo la prenda").
   - Encuadre: lienzo cuadrado blanco puro (#FFFFFF) = lado más largo + 18 %, sujeto en el centro exacto,
     sin estirar ni agrandar.
3. `genproducts.py` genera `src/lib/products.ts` desde `catalogo.json`. Los precios viven solo en
   `catalogo.json`; las muestras de color salen del color medido en cada foto (`colores-medidos.json`).

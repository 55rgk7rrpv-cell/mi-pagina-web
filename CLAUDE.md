# Otra Pinta — memoria del proyecto

Tienda de ropa femenina de Puerto Ordaz (Instagram @otrapintapzo). Next.js + Tailwind + Framer Motion, exportada como página estática.
**Este archivo se lee solo al empezar cada chat. Con él no hace falta releer el proyecto ni la conversación anterior.**

## Cómo trabajar con la dueña (reglas fijas)
- Hablar en **español sencillo**, respuestas cortas. Todo el contenido de la tienda en español.
- No preguntar lo que se puede decidir con criterio. Decir con franqueza qué se probó y qué no.
- Usar la skill **ponytail**: el cambio más pequeño que resuelva todo, sin extras. No aplica a las fotos/diseño que ella pidió explícitamente.
- Rama de trabajo: `claude/keen-sagan-4wdsps`. Hacer commit y push de cada cambio (ver "Tasa BCV"). **No abrir PR** salvo que lo pida.

## Estructura (la app está en `maison/`)
- `maison/src/lib/products.ts` — **GENERADO**, no editar a mano. Se regenera con `genproducts.py`.
- `maison/src/lib/tienda.ts` — datos de cobro (Pago Móvil), WhatsApp (+58 424-9489024, ya puesto; sale en el pie de página y en el botón del pedido), Instagram. Único sitio donde cambiarlos.
- `maison/src/lib/pedido.ts` + `components/checkout/` — pago: SOLO Pago Móvil y efectivo; no hay servidor, el pedido es un mensaje (WhatsApp/Instagram).
- `maison/src/lib/catalog.ts` (filtros/orden), `components/shop/` (ProductCard, Collection, CatalogToolbar, QuickView), `components/bits/` (React Bits).
- `maison/catalogo/catalogo.json` — catálogo maestro (precio = "Ref" en USD, colores, tallas). `maison/catalogo/herramientas/` — scripts del catálogo. `maison/catalogo/fotos-solas-originales/` — fotos originales: **nunca se tocan**.
- `maison/public/catalogo/` — fotos web: `*-sola.webp` = prenda sola recortada, `*.webp` = foto con modelo (solo galería), `*-ia.webp` = render de IA, `m/` = miniaturas de 880 px para la parrilla.
- Fuera de `maison/`: `meridian-digital-v8.html`, `404.html`, `capturas/` son de antes; no tocar.

## Comandos (desde `maison/`)
- `npm run lint` (tsc) · `npm run export:artifact` (compila a `artifact/` + `artifact-files.json`) · `npx -y serve out -l 3217` (probar local).
- Python para fotos: `python3 -m venv /tmp/imgenv && /tmp/imgenv/bin/pip install pillow numpy opencv-python-headless`.
- Flujo de fotos nuevas: copiar originales a `catalogo/fotos-solas-originales/` → añadir clave `producto__color` en `catalogo/herramientas/fotos-solas.json` (un collage lleva `{"file":…,"crop":[x0,y0,x1,y1]}`, cortando por los huecos blancos) → `python catalogo/herramientas/fotos-solas.py catalogo/fotos-solas-originales` → `python catalogo/herramientas/genproducts.py` (genera products.ts, miniaturas y tamaños) → `python catalogo/herramientas/audit.py` (debe decir "Errores: ninguno"). Si una foto reemplaza a otra, borrar la vieja (`git rm`); el audit marca fotos sin usar.
- Medir rendimiento: `maison/scripts/bench/` (`scroll.js` scroll con CPU 4x más lento; `frames.js` encuadre en 6 pantallas; `trace.js` qué dispara estilos/layout). Necesitan `npx -y serve out -l 3217` y `node` con playwright (ya instalado).

## Reglas de fotos (de la dueña)
- Integridad primero: **no quitar fondos, no borrar personas con código, no deformar**. Solo se recorta el margen blanco y los paneles de collage. Excepción aprobada por ella: aclarar a blanco un fondo gris liso con `whiten` (vestido strapless).
- Portada de cada producto = foto de la **prenda sola**; entre colores, el más vivo primero (saturación·√brillo). Fotos con modelo solo en la galería de la vista rápida.
- Si un producto solo tiene foto con modelo: **avisarle**, no inventar. Render de IA solo si ella lo pide, marcado "Imagen ilustrativa".
- El encuadre es por CSS (`object-contain` en marco cuadrado blanco, `inset-[5%]`). No cambiar a otro aspecto sin consultar.
- `fotos-solas.py` deja cada foto con el MISMO margen en los 4 lados (lienzo = prenda + margen igual) y blanquea solo el fondo gris liso automáticamente (flags en `fotos-solas.json`: `whiten`, `holes:false` para prendas claras). `top-saten-cruzado__champana` conserva su gris (la tela crema se confunde con el fondo): pedir a la dueña una foto con fondo blanco.

## Reglas de la tienda
- Precios en USD. Pago: Pago Móvil (monto en Bs con tasa BCV) o efectivo. Solo Puerto Ordaz: delivery $5 (gratis desde $80) o retiro gratis. Sin envío nacional.
- Códigos: BIENVENIDA 10 %, OTRAPINTA 15 % desde $100, ENVIOGRATIS. Máximo 1 pieza por talla/color; accesorios hasta 5.

## Publicación (Artifact)
- URL fija: https://claude.ai/artifact/44Z3Cj4zWMS6ojch2yFb1G (siempre actualizar esta, no crear otra).
- Publicar: `file_path` = `maison/artifact/index.html`, `root` = `maison/artifact`, `files` = **solo lo que cambió** (código de `assets/` sin `/media/`, `index.txt`, fotos nuevas). Lo omitido se conserva. Sin `capabilities`.
- No "leer" el artifact completo antes (cuesta ~10 mil tokens): intentar publicar. Si se rechaza porque la tarea diaria publicó otra versión, el rechazo guarda esa versión en un archivo local: leer solo sus primeras líneas (`limit: 4`) y publicar de nuevo. La versión de la tarea diaria solo difiere de la mía en el id de compilación.
- Cada build deja archivos viejos en `assets/`: limpiarlos con `null` en `files` de vez en cuando (límite 511). Nunca borrar `tasa.json`, `index.html`, `index.txt`.

## Tasa BCV (automática)
- Tarea programada `trig_01JVqZGaVpMMV9xmRUJRenMV`, todos los días 5:47 (Caracas): `maison/scripts/preparar-tasa.sh` baja la tasa de ve.dolarapi.com, compila y publica con `tasa.json`. Rechaza saltos >25 % o datos viejos; la tienda no muestra Bs si la tasa tiene más de 4 días.
- **La tarea compila desde la rama en GitHub: siempre hacer push antes de las 5:47**, o publicaría la versión anterior.
- Entorno de nube `mi-pagina-web` (`env_013Qkqg2u3c9GTgtUTXWH8k4`) permite: ui.shadcn.com, reactbits.dev, www.canva.com, export-download.canva.com, ve.dolarapi.com.

## Lecciones de rendimiento (no repetir)
- Nada con `:has()` que dependa de `:hover` en la parrilla (atenuar "las demás" recalculaba 36 tarjetas). Evitar `will-change` permanente, `mix-blend-mode` por tarjeta y `backdrop-filter` grande en elementos fijos.
- Con el ratón quieto las tarjetas pasan debajo al hacer scroll: `html[data-scrolling]` congela sus efectos (`SmoothScroll.tsx`). Lenis solo con mouse y se apaga si el equipo va lento. GSAP fue eliminado; solo Framer Motion.
- Pegar `framer-motion` y `motion-dom` en la misma versión (12.42.2): si no, no compila.

## Pendiente
- **Todas las portadas y colores tienen foto de prenda sola real** (36/36, sin imágenes de IA). No faltan fotos.
- Foto negra de top de cuello alto (captura con barras negras, guardada en `maison/catalogo/fotos-sin-asignar/`): no hay color negro de ese top en el catálogo; preguntar a la dueña si es un color nuevo (y con qué talla) antes de agregarlo.
- Fotos con fondo gris claro de origen: top lazo rojo, marrón y champaña, top cruzado champaña y negro, top cuello alto marrón. Se pueden pasar a fondo blanco con `"whiten": true` en `fotos-solas.json` (solo pinta de blanco los píxeles de fondo; ya aplicado al vestido strapless). Hacerlo solo si la dueña lo aprueba (ella pidió no quitar fondos).
- "Conjunto de satén con encaje" (id `falda-saten-encaje`, categoría Conjuntos): se vende junto (top + falda) como en la foto; no tocar su foto. Su precio sigue en $30 (el de la falda): confirmar con la dueña si el conjunto cuesta otro. Aparte existe "Top de encaje tipo corsé" ($20).
- Confirmar con la dueña: color "Rojo" del vestido halter suelto (se ve vinotinto) y que el top de encaje corsé es la misma prenda; la cédula está como V-.

## Ahorrar tokens al empezar de nuevo o cambiar de modelo
- Chat nuevo: pegar solo `Lee CLAUDE.md y continúa con: <tarea>`. No volver a pegar fotos ni explicar el proyecto.
- Cambiar de modelo en el mismo chat vuelve a leer **toda** la conversación sin caché (la caché es por modelo). Si la conversación es larga: terminar lo pendiente, hacer commit/push, actualizar este archivo y abrir chat nuevo; o usar `/compact` antes de cambiar.
- Al terminar una tarea grande, actualizar "Pendiente" y "Lecciones" aquí (3 líneas), no escribir resúmenes largos.
- Para revisar muchas fotos, juntarlas en **una** imagen de contactos en vez de abrirlas una por una; no volcar archivos grandes (HTML publicado, listados completos) a la conversación.

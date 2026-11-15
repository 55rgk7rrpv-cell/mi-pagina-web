# Reel Meridian Digital: "Tener web no significa tener clientes"

`meridian-reel.mp4`: vertical 1080×1920, 30 fps, 55 s, audio a −14 LUFS (el nivel de Instagram).
`meridian-reel.srt`: subtítulos en español. `poster.jpg`: portada.

## Guion (voz en off)

| Capítulo | Tiempo | Locución |
|---|---|---|
| 01 · El proyecto | 0:00 | Por fin tienes tu página web. Quedó bonita. La publicaste. La compartiste en tus estados. |
| 02 · El silencio | 0:07 | Pasa un mes, y no te llega ni un mensaje. Un cliente te busca en Google, y encuentra a tu competencia. Otro abre tu web en el teléfono, espera ocho segundos, y se va. Y tu web sigue ahí, cobrando hosting, sin traerte un solo cliente. |
| 03 · Las reglas | 0:24 | Antes de pagar por una web, exige tres cosas. Uno: que cargue en menos de tres segundos en el teléfono. Dos: un botón de WhatsApp a un toque, en todas las páginas. Tres: que Google la encuentre cuando alguien busca lo que vendes. Y pide el precio por escrito, antes de empezar. |
| 04 · La conclusión | 0:43 | Tener web no significa tener clientes. |
| Cierre | 0:47 | En Meridian Digital hacemos webs que te traen clientes. Escríbenos por WhatsApp y cotiza en segundos. |

Estructura tomada del reel de referencia (@theoffbook, "Client says: just a small change"): grid editorial suizo, capítulos numerados, UI animada y un efecto de sonido en cada acción. El tema cambia al lado del cliente de Meridian: el dueño de negocio.

Psicología aplicada (skill `marketing-psychology`): aversión a la pérdida (el cliente se va con la competencia), especificidad (8 segundos, 0 mensajes, 3 reglas), reciprocidad (tres consejos útiles antes de pedir nada) y un cierre con una sola acción (WhatsApp). El texto pasó por `stop-slop`: sin rayas, sin adverbios de relleno, frases cortas en segunda persona.

## Tipografías (inspiradas en @osheacreations)

OSHEA usa fuentes comerciales (TT Backwards, Monr Pro…), así que el video usa equivalentes libres (licencia OFL) del mismo tipo:

- **Anton**: grotesca ultracondensada (números gigantes, "MERIDIAN DIGITAL").
- **Inter Tight**: neogrotesca tipo Helvetica (frases principales).
- **Instrument Serif Italic**: serif itálica de contraste (palabras de acento en rojo).
- **JetBrains Mono**: etiquetas técnicas.

Paleta: blanco verdoso `#EEF2EA` y rojo `#FF1E0F` de OSHEA, con el azul noche `#03071F` de la web de Meridian.

## Sonido

Efectos generados por código en `fuente/mix.py`, según los reels de referencia: impacto en el gancho, whoosh en paneos y cortinas, click al aparecer texto, "magic reveal" en las revelaciones, contador, tecleo, sello, error, campanita y obturador al final. La música baja sola cuando entra la voz y hay dos silencios casi totales antes de los momentos clave.

## Créditos

- Voz: vidIQ Voiceover, voz "Francisco" (español latinoamericano).
- Música: vidIQ AI Music, pista original libre de derechos.
- Foto de la vitrina de pan dulce: aportada por Meridian Digital (sustituye a la imagen de IA de la primera versión).
- Foto de manos con teléfono: generada con vidIQ.
- "Panadería Aurora" es un negocio ficticio de ejemplo.
- Fuentes: Anton, Inter Tight, Instrument Serif, JetBrains Mono (SIL Open Font License, Google Fonts).
- Render: motor Lemo-Opuscar (estilo "Swiss Motion Graphics") + Playwright/Chromium + ffmpeg.

## Volver a generarlo

`fuente/` tiene la animación (`index.html`, que lee `timeline.json`) y la mezcla (`mix.py`). Las pistas de voz y la música (`L00–L12.wav`, `music.wav`) no se suben al repo por su tamaño. Para regenerar, colócalas en `fuente/assets/` y, desde una copia de lemo-opuscar:

```sh
node core/render/video.mjs <carpeta-fuente> --fps 30 --size 1080x1920 --out out/video.mp4
python3 <carpeta-fuente>/mix.py      # escribe out/mix.wav
# luego ffmpeg con loudnorm a -14 LUFS para unir imagen y audio
```

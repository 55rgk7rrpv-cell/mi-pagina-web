---
name: reel-meridian
description: Crear reels de Instagram (9:16) para Meridian Digital con las reglas, la marca y el flujo ya acordados con el usuario. Usar siempre que pida un reel, video, animación o descripción para Instagram.
---

# Reels para Meridian Digital

Todo en **español**, para dueños de negocios locales en Venezuela. Reels ya hechos, como referencia de nivel y estilo: `video/` (cada carpeta tiene README, `fuente/` y `descripcion.txt`).

## Reglas que el usuario pidió (obligatorias)

1. **Paleta Meridian siempre** (ver `CLAUDE.md`). Nada de rojos u otros colores ajenos a la marca. El verde solo para un botón de WhatsApp genérico.
2. **Cero superposiciones**: ningún texto puede pisar a otro texto ni a una imagen en ningún frame. Verificar con `video/_herramientas/check_overlap.mjs` (cada 0,05 s o menos) antes de entregar.
3. **Sincronía exacta**: textos, animaciones y efectos se anclan a la palabra de la voz (`align.py`) o al corte/golpe del audio. Nada adelantado ni atrasado.
4. **Sin distorsión**: imágenes con `object-fit: cover` y `aspect-ratio`; nunca `scaleX`/`scaleY` sobre texto o fotos (ajustar por tamaño de fuente).
5. **Sin saltos de layout**: mover con `transform`, `clip-path`, `opacity`, `visibility`. Contadores con dígitos de ancho fijo medidos sobre la fuente real.
6. **Ortografía impecable** (tildes, ¿ ¡). Textos grandes y legibles en celular.
7. **Zona segura de Instagram**: texto entre y≈200 y y≈1480 px y a la izquierda de x≈940 (1080×1920).
8. **Una sola llamada a la acción** por reel.
9. **No añadir información de más**: si el audio termina, el video termina. Nada de tarjetas extra que el pedido no incluya.
10. **Duración**: respetar la que pida. Si el guion no cabe, avisar y proponer (acelerar voz, recortar o alargar), no decidir en silencio.
11. **Imágenes reales, no de IA**: el usuario rechazó una foto generada por IA por verse falsa. Pedirle sus fotos; si no hay, usar ilustraciones vectoriales hechas en código. Negocios de ejemplo siempre inventados, sin marcas ni logos de terceros.
12. **Si da un reel de referencia y pide "tal cual"**: descargarlo con **Composio** (`GETANYAPI_GET_INSTAGRAM_POST`, `host_video: true`, ~$0,005), usar **su audio original**, copiar sus cortes frame a frame (`video/_herramientas/cortes.py`) y mantener su duración. Adaptar solo el texto (español, páginas web) y los colores. Al entregar, recordar que en Instagram conviene montar el reel con "Usar audio" del original por derechos.
13. **Cierres con sentido en español**: no traducir literal (p. ej. "repeat." → mejor la marca, "Meridian."). Si hay duda, ofrecer 2–3 opciones.
14. **Siempre entregar también la descripción** (`descripcion.txt`): gancho en la primera línea, beneficio concreto, la misma CTA del video, 8–12 hashtags.

## Estilo de texto

- Sin muletillas de IA (reglas de *stop-slop*): frases cortas, segunda persona, sin rayas (—), sin adverbios de relleno.
- Persuasión honesta (*marketing-psychology*): miedo a perder la venta, cifras concretas, aportar valor antes de vender.
- Solo datos reales de la web (planes, precios, WhatsApp). No inventar estadísticas ni testimonios.

## Tipografías

Inspiradas en @osheacreations, versiones libres (OFL) en `video/_herramientas/fonts/`: **Anton** (números/titulares condensados), **Inter Tight** 500/800 (texto principal; la más usada), **Instrument Serif Italic** (acentos), **JetBrains Mono** (etiquetas).

## Flujo de trabajo probado

1. **Referencias**: Instagram está bloqueado en el contenedor. Usar Firecrawl (texto/caption), vidIQ `vidiq_get_images` (portada, gratis) y Composio/GetAnyAPI (video completo). Si el host de descarga está bloqueado, proponer añadirlo a la red del entorno.
2. **Motor**: clonar `https://github.com/lemomo-ai/lemo-opuscar.git` en el scratchpad, `npm ci`, crear `films/<slug>/` con `index.html` determinista (`window.render(t)`, `window.READY`, `window.DUR`) y copiar ahí `video/_herramientas/*`. Chromium: `PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`. Render: `node core/render/video.mjs films/<slug> --fps 30 --size 1080x1920`.
3. **Voz** (si lleva): proveedores probados: vidIQ (voz "Francisco", se quedó sin créditos), Speko → Inworld "Diego" (es-MX, funciona con crédito gratuito; el audio llega como WAV en tool-results). ElevenLabs falló por bloqueo de la cuenta gratuita; Microsoft edge-tts está bloqueado por red. Recortar silencios y alinear con `align.py` (escribe tiempos por palabra en `timeline.json`).
4. **Sonido**: `mix.py` (SFX procedurales anclados a palabras: whoosh en cortes, click al aparecer texto, reveal en revelaciones, hit en el gancho; música con ducking bajo la voz). Música original disponible: la pista de vidIQ usada en los reels anteriores (110 BPM).
5. **Master**: ffmpeg `loudnorm` en dos pasadas a **−14 LUFS**, pico ≤ −1 dB, H.264 yuv420p + AAC 192k. Comprobar duración y que no haya frames negros.
6. **Revisión**: hoja de contactos de fotogramas, `check_overlap.mjs` sin avisos, y comparar cortes con la referencia si la hay.
7. **Entrega**: `video/<slug>/` con `.mp4`, `poster.jpg`, `.srt` (si hay voz), `descripcion.txt`, `README.md` y `fuente/`. Commit y push a la rama de la sesión. Enviar el video al usuario. Explicar en pocas líneas qué se hizo y qué debe revisar (por ejemplo, escuchar la voz).

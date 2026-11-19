# Reel: "¿Cuál de estas dos se queda con el cliente?"

`meridian-cual-de-las-dos.mp4`: vertical 1080×1920, 30 fps, 35,0 s, audio a −14 LUFS. Subtítulos animados dentro del video y en `.srt` aparte. Portada: `poster.jpg`.

| Escena | Tiempo | Qué pasa |
|---|---|---|
| 1 | 0:00–0:04,5 | Pantalla dividida: Pastelería A arriba, Pastelería B abajo, cada una con su celular. Título: "¿Cuál de estas dos se queda con el cliente?" |
| 2 | 0:04,5–0:11 | A: una sola foto, sin precios ni forma de pedir ("Solo Instagram"). B: catálogo con precios, entregas y botón verde de pedido ("Con web"). |
| 3 | 0:11–0:18 | A: chat de las 11:40 pm sin respuesta. B: un dedo toca el botón, se abre el chat con el pedido ya escrito ("Pedido en 1 toque"). |
| 4 | 0:18–0:25 | A se vuelve gris; B se ilumina con check verde. "Se la lleva la B". |
| 5 | 0:25–0:35 | Logo Meridian Digital. "Comenta WEB" + checklist de 7 puntos. "Diseño web con precio publicado, desde $250". |

- **Negocios y pantallas inventados.** Las pantallas imitan apps genéricas, sin logos de terceros. Las tortas son ilustraciones vectoriales hechas en código: ni fotos de stock ni IA.
- **Zona segura de Instagram.** Todo el texto queda entre y=200 y y=1480 px y a la izquierda de x≈940, para no quedar debajo de los botones ni del pie de la app.
- **Voz:** Inworld "Diego" (español latino neutro) vía Speko, acelerada ×1,19 sin cambio de tono para que el guion completo entre en 35 s.
- **Música:** la misma pista original del reel anterior (vidIQ AI Music). **Efectos:** generados por código, anclados a palabras de la voz.
- **Control de calidad:** `fuente/check_overlap.mjs` revisó el video cada 0,05 s y no encontró ninguna superposición de texto.

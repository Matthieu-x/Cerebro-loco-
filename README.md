# Cerebro Loco Remaster v6

Build vertical para móviles con tres escenas ilustradas e interacción táctil.

## Contenido
- `index.html`: interfaz y estructura de pantallas.
- `game.css`: rediseño visual cálido y responsive.
- `game.js`: Canvas, animación de objetos, detección táctil, arrastre, progreso y anuncios Playgama.
- `scene-01.webp` a `scene-03.webp`: fondos ilustrados de las escenas.
- `levels-v2.json`: definición de los tres acertijos.
- `manifest.json`: versión de contenido y changelog.

## Interacciones
1. Escena 1: tocar el teléfono ilustrado.
2. Escena 2: arrastrar la llave hasta el candado del cofre.
3. Escena 3: arrastrar la llave hasta la cerradura de la puerta.

## Actualización de contenido
El juego consulta `manifest.json` y `levels-v2.json` con `cache: no-store` y un parámetro anti-caché. Si detecta una versión nueva, permite descargarla desde el diálogo de actualización. Vercel debe publicar todos los archivos del ZIP en el mismo directorio.

## Anuncios
Se conserva el SDK de Playgama original y los anuncios interstitial/recompensados. Su disponibilidad real depende de la configuración y publicación del juego en Playgama.

## Service Worker
No se incluye `sw.js` ni se registra un Service Worker externo. Al iniciar, el juego intenta retirar un Service Worker antiguo del mismo origen para evitar que entregue archivos desactualizados.

## Pruebas realizadas
- Sintaxis JavaScript (`node --check`).
- JSON válido para niveles y manifiesto.
- Integridad del ZIP y presencia de los tres recursos WebP.
- No se ha probado en BlueStacks ni en el entorno de producción de Playgama.

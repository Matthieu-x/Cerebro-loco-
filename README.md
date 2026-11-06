# Cerebro Loco — Rediseño v3

Juego web estático listo para GitHub Pages o Vercel.

## Archivos
- `index.html`: pantallas y estructura.
- `game.css`: nueva identidad visual adaptable a móvil.
- `game.js`: motor Canvas, Milo, controles, niveles, progreso y actualizaciones.
- `levels-v2.json`: contenido de desafíos.
- `manifest.json`: versión del contenido.
- `sw.js`, `vercel.json`, `manifest.json`: soporte de despliegue y PWA.

## Publicar en Vercel
Importa el repositorio en Vercel con Framework Preset `Other`. No necesita comando de build ni directorio de salida especial; deja el directorio raíz como salida.

## Notas
El selector de edad no abre el teclado. El jugador puede usar los botones +/− o deslizar el control.
La escena del juego y Milo se dibujan en Canvas. La actualización de contenido se muestra como modal centrado.

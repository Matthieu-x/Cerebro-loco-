# Cerebro Loco

Sitio estático (sin Node, sin build). Todos los archivos van en la raíz del repo.

- `index.html`, `game.css`, `game.js`: el juego.
- `manifest.json`: versión del contenido y nombre del archivo de niveles.
- `levels-v1.json`: los 30 niveles.
- `vercel.json`: evita que Vercel guarde versiones viejas en caché.

## Vercel
Importa el repo desde GitHub. Framework: **Other**. Build command y output directory: vacíos.

## Actualizar niveles
1. Crea `levels-v2.json` con el array completo de niveles.
2. En `manifest.json` sube `contentVersion`, cambia `levelsFile`, `updatedAt` y `changelog`.
3. Sube primero el JSON nuevo y después el manifiesto.

# Cerebro Loco Remaster v7

Build horizontal 16:9 para móviles y emuladores. Mantiene tres niveles ilustrados y el SDK de anuncios Playgama.

## Archivos
- `index.html`: pantallas de perfil, menú, mapa, juego y centro de actualizaciones.
- `game.css`: interfaz horizontal, pantallas rediseñadas y diseño adaptable.
- `game.js`: Canvas, objetos interactivos, animaciones ambientales, progreso, precarga y anuncios.
- `scene-01.webp` a `scene-03.webp`: ilustraciones WebP de las tres escenas.
- `levels-v2.json`: contenido de los tres niveles.
- `manifest.json`: versión del contenido y changelog.
- `vercel.json`: cabeceras sin caché para los archivos de contenido.

## Formato horizontal
La web fuerza una pantalla de orientación horizontal y muestra una indicación para girar el dispositivo si se abre en vertical. Para un APK Android, el contenedor debe usar `android:screenOrientation="landscape"` en la actividad principal.

## Escenas e interacciones
- Nivel 1: tocar el teléfono.
- Nivel 2: arrastrar la llave hasta el candado del cofre.
- Nivel 3: arrastrar la llave hasta la cerradura de la puerta.
- Las ilustraciones completas se muestran dentro del escenario; el espacio sobrante se rellena con una versión ambiental desenfocada para no cortar personajes ni objetos.
- Se animan el acompañante del menú, el movimiento ambiental, los destellos y los objetos interactivos. Los personajes que están pintados dentro de los fondos siguen siendo parte de la ilustración y no tienen animación articulada independiente.

## Actualizaciones
El centro de actualizaciones consulta `manifest.json` y el archivo `levels-v2.json` con `cache: no-store`. Las actualizaciones de contenido se pueden descargar desde el juego. Las actualizaciones del motor/interfaz requieren publicar el ZIP completo nuevo en el hosting; no se pueden reemplazar de forma segura solo con el manifiesto.

Publica todos los archivos del ZIP en la misma raíz de Vercel. No renombres `manifest.json`, `levels-v2.json` ni las escenas WebP.

## Anuncios
Se conserva el SDK original de Playgama y las llamadas de anuncios interstitial/recompensados. La entrega real depende de la configuración del proyecto y de que Playgama habilite los anuncios.

## Caché y carga
No se registra un Service Worker. Al iniciar, se intenta retirar un Service Worker antiguo del mismo origen. Las tres escenas WebP se precargan para reducir la espera al cambiar de nivel.

## Validaciones realizadas
- `node --check game.js`.
- JSON válido para `manifest.json` y `levels-v2.json`.
- Integridad del ZIP y presencia de los recursos.
- No se ha probado en BlueStacks, en un APK instalado ni en producción de Playgama.

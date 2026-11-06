# Cerebro Loco Remaster v8

Build horizontal para pantallas móviles y emuladores. Incluye tres escenas panorámicas completas, una interfaz unificada y conserva Playgama.

## Archivos principales
- `index.html`: perfil, inicio, mapa, juego y centro de actualizaciones.
- `game.css`: interfaz horizontal 16:9, responsive y coherente entre pantallas.
- `game.js`: Canvas, interacción táctil/arrastre, animaciones, progreso, precarga y anuncios.
- `scene-01.webp` a `scene-03.webp`: escenas panorámicas 1600×900. El arte original se conserva completo centrado; los laterales se amplían con ambiente desenfocado para no cortar personajes ni objetos.
- `levels-v2.json`: tres acertijos y posiciones interactivas ajustadas a las escenas panorámicas.
- `manifest.json`: versión de contenido 8.

## Orientación
La interfaz está diseñada para horizontal. Para el APK, configura `android:screenOrientation="landscape"` en la actividad principal.

## Actualizaciones
El centro de actualizaciones consulta `manifest.json` y `levels-v2.json` sin caché. Las actualizaciones de motor/interfaz requieren publicar todos los archivos del ZIP nuevo en la raíz del hosting; las actualizaciones de contenido compatibles se instalan desde el juego.

## Anuncios
Se conserva el SDK y las llamadas originales de Playgama. La disponibilidad real depende de la configuración y publicación del proyecto.

## Pruebas
Validación de sintaxis JavaScript, JSON, integridad del ZIP y prueba visual en Chromium de escritorio en orientación horizontal. No equivale a una prueba en BlueStacks ni a validar anuncios o actualización en producción.

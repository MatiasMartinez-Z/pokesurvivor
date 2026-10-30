# DBZ Survivor — Goku base en motor real (alpha)

**Rama aislada:** `dbz/goku-base-integration` basada en el commit `b297089` de JPTER78 (código MIT). La rama `main` no se modifica.

## Probar
1. En GitHub seleccionar `dbz/goku-base-integration` → Code → Download ZIP.
2. Descomprimir **todo** y abrir `dbz.html` (no `index.html`).
3. En la selección de personaje buscar **Goku (base)** (reemplazo temporal de Pokémon #1 / Bulbasaur).
4. Jugar con WASD/flechas y selección de habilidades 1–4, Q/E.
5. Si file:// bloquea algo, ejecutar desde carpeta raíz: `python -m http.server 8000` y abrir `http://localhost:8000/dbz.html`.

## Archivos incorporados
- `dbz.html`: copia experimental de `dev.html`, carga scripts originales y nuestras dos modificaciones, sin sobrescribir el original.
- `dbz/sprites.js`: copia adaptada del lector de sprites MIT de JPTER78.
- `dbz/goku-base.js`: generador de atlas PNG transparentes en navegador + modificación temporal del personaje #1.
- `dbz/goku_base_views.png`: Goku base aprobado, cuatro vistas de 64x64, atlas 256x64; fuente íntegra de alta calidad en Canva/carpeta del proyecto de arte.

## Importante: ESTADO DE LAS ANIMACIONES
**NO TERMINADAS**. Las siete animaciones reconocidas por el motor se generan como secuencias de movimiento provisionales a partir de cuatro vistas; no son siete acciones dibujadas a mano. Las cuatro diagonales repiten un lateral. Las poses de brazos y piernas no están dibujadas dentro de este branch. Los efectos y otras técnicas DBZ no están integrados al sistema de combate del juego, y en este momento se reutiliza provisionalmente el movimiento de agua como ataque inicial.

El pipeline de ilustración y animación ampliada se gestiona en `MatiasMartinez-Z/dbz-survivor`. No sustituir el Goku original aprobado por imagen generada sin validación del usuario.

## Aspectos técnicos
Geometría: `64x64` por fotograma, 8 filas (Down, DownRight, Right, UpRight, Up, UpLeft, Left, DownLeft), N columnas, `ax=31.5`, `ay=61`. Las hojas del personaje #1 se materializan en tiempo de ejecución usando canvas y se cargan por el mismo `G.Sprites.sheet` del motor. El resto de personajes continúan sin cambios.

## Licencias
Copyright 2026 JPTER78 — engine MIT hasta la revisión b297089. Esta rama conserva las licencias y avisos que vinieron con el upstream. Arte y marcas Pokémon no están cubiertos por la licencia de código y deberían retirarse/reemplazarse antes de distribuir una adaptación independiente. Dragon Ball es de sus respectivos titulares, sin licencia oficial.

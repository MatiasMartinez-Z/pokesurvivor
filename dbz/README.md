# DBZ Survivor — Goku base en el motor original (alpha)

**Rama experimental** `dbz/goku-base-integration`, derivada de `b297089` (código MIT © 2026 JPTER78). `main` conserva el fork sin modificar.

## Cómo probar
1. Abrir https://github.com/MatiasMartinez-Z/pokesurvivor/tree/dbz/goku-base-integration
2. **Code → Download ZIP**, descomprimir la carpeta completa.
3. Abrir `dbz.html` en un navegador. Si el navegador bloquea `file://`, iniciar desde la carpeta `python -m http.server 8000` y abrir `http://localhost:8000/dbz.html`.
4. Elegir **Goku (base)** (sustituye temporalmente el personaje con dex #1). Mover con WASD/flechas, habilidades con 1–4 o Q/E.
5. Para ver/inspeccionar las hojas sin jugar: `dbz/animation-inspector.html`.

## Integración real existente
- `dbz/animations/`: siete archivos PNG 64×64 por fotograma, 8 filas, **464 celdas**, acciones `Idle,Walk,Attack,Shoot,Charge,Hurt,Faint`.
- `dbz/atlas-config.js`: habilita las siete hojas reales, con `ay=56`, en lugar de regenerar siempre el bloque procedural.
- `dbz/goku-base.js`: define Goku #1 y movimientos EXCLUSIVOS `dbz-ki-blast`, `dbz-kamehameha`, `dbz-genkidama`; las habilidades originales Pokémon no se renombran ni se comparten indiscriminadamente.
- `dbz/ki-vfx.js` y `dbz/ki-shapes.js`: paleta azul y formas de energía de ki, rayo y esfera grande.
- `dbz/sprites.js`: lector original del motor adaptado con escala y anclaje propios para Goku.
- `dbz/animation-inspector.html`: visor/QA de atlases reales y archivos PNG elegidos por el usuario.
- `dbz.html`: entrada a la prueba en motor original. `dev.html` e `index.html` originales no se han sobrescrito.

## Estado artístico: NO TERMINADO
Los siete atlas son estudios procedurales con movimiento de extremidades extraído del personaje, **no animaciones definitivas dibujadas a mano**. Las diagonales provienen de composiciones de vistas frontales/laterales y aún necesitan correcciones. El gi roto está pendiente de aprobación; no está activado.
La Genkidama es una esfera grande y penetrante, pero no tiene explosión final ni animación perfecta; Kamehameha usa el sistema beam original con efectos azules.
No se ha podido verificar una partida real en navegador desde este entorno (el navegador automatizado bloquea localhost).

## Pruebas reproducibles
Desde la raíz del fork:
```bash
node dbz/validate.mjs
node dbz/tests/goku-smoke.cjs
node dbz/tests/goku-assets.cjs
node dbz/tests/ki-vfx-smoke.cjs
```
Validaciones geométricas NO sustituyen inspección visual.

## Fuente original de arte y memoria
https://github.com/MatiasMartinez-Z/dbz-survivor
Fuente original aprobada: `assets/characters/goku/base/source/goku_master_aprobado.png`.
Guía de producción: `docs/goku-rig-production.md`.
Cerebro: `brain/`.

## Licencias
Motor de JPTER78 hasta `b297089` bajo MIT con aviso; versiones posteriores bajo licencia no comercial. Personajes y marcas Pokémon/Dragon Ball están sujetos a derechos separados. El fork incluye recursos originales que deberían sustituirse o retirarse antes de distribuir una adaptación independiente.

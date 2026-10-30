# Animaciones de Goku — punto de reemplazo para arte final

Este directorio recibirá **únicamente spritesheets terminados y aprobados**, no los bloqueos WIP.
La rama experimental carga de forma predeterminada los dibujos provisionales de cuatro vistas.
Cuando haya PNG finales, editar `dbz/atlas-config.js` para activar cada hoja sin modificar `dbz/goku-base.js`.

| Archivo | Columnas | Filas | Dimensión total |
|---|---:|---:|---:|
| Idle.png | 6 | 8 | 384x512 |
| Walk.png | 8 | 8 | 512x512 |
| Attack.png | 8 | 8 | 512x512 |
| Shoot.png | 8 | 8 | 512x512 |
| Charge.png | 12 | 8 | 768x512 |
| Hurt.png | 6 | 8 | 384x512 |
| Faint.png | 10 | 8 | 640x512 |

Orden fijo de filas: Down, DownRight, Right, UpRight, Up, UpLeft, Left, DownLeft.
Cada celda debe ser PNG RGBA 64x64, sin textos, sin cuadrículas, con pies anclados.
La opción `ay` indica altura del anclaje desde el borde superior del fotograma.
Se comprueba el tamaño real del PNG antes de usarlo; si falla, carga bloqueo provisional y avisa en consola.

**Importante:** las 4 direcciones diagonales actuales son suplencias, no arte aprobado, y los bloques tampoco son animación artística final. El maestro de Goku aprobado está en el repositorio de arte y Canva.

Para validar código sin navegador (con Node):
```bash
node dbz/tests/goku-smoke.cjs
node dbz/validate.mjs
```

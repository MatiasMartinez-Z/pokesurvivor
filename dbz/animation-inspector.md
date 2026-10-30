# Inspector de animaciones de Goku

[Archivo HTML](animation-inspector.html) — herramienta visual para revisar sprites antes de incorporarlos al motor.

## Ejecución sencilla (Windows/VS Code)
1. Descargar el ZIP de esta rama (`dbz/goku-base-integration`) o clonarla con Git.
2. Extraer el repositorio completo.
3. Abrir `dbz/animation-inspector.html` en el navegador; si el navegador bloquea archivos locales, iniciar `python -m http.server 8000` desde la raíz y abrir `http://localhost:8000/dbz/animation-inspector.html`.
4. Elegir `Walk` y una de las ocho direcciones.
5. Seleccionar un PNG usando **Imagen propia** para verificarlo sin sobrescribir archivos de GitHub.

## Formato de hojas finales
- Cada fotograma: **64x64** píxeles transparentes.
- Cada hoja: **8 filas**, en orden Down, DownRight, Right, UpRight, Up, UpLeft, Left, DownLeft.
- Columnas: Idle 6, Walk 8, Attack 8, Shoot 8, Charge 12, Hurt 6 y Faint 10.
- El inspector compara los píxeles de las diagonales frente a sus vistas cardinales vecinas. Detecta fotogramas vacíos y contacto con los bordes, además de verificar resolución.
- El inspector no comprueba anatomía ni calidad artística de una perspectiva; un PNG puede pasar la prueba geométrica y seguir necesitando corrección manual.

## Integración real
La página del juego experimental sigue siendo `dbz.html` en la raíz. El inspector no sustituye ese juego.
Configurar cada atlas aprobado en `dbz/atlas-config.js`, por ejemplo:
```js
window.DBZ_GOKU_ATLASES = {
  Walk: { src: 'dbz/animations/Walk.png', ay: 61 }
};
```
El inspector convierte automáticamente la ruta `dbz/...` al contexto de su carpeta; la página `dbz.html` utiliza la misma ruta sin alterarla.
Si un atlas no cumple el ancho o alto esperado, `dbz/goku-base.js` mantiene el bloc de prueba y registra una advertencia.

## Estado actual
- Cuatro vistas cardinales de Goku: aprobadas.
- Cuatro diagonales: bocetos procedurales y pendientes de retoque y aprobación.
- Siete acciones: bloqueos/prototipos, no animación artística completa.
- La ejecución de `dbz.html` en navegador real sigue pendiente.

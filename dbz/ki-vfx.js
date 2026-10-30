/* DBZ Survivor: VFX scoped to the three experimental Goku abilities.
 * Loaded AFTER original js/entities/vfx.js, BEFORE the combat/FX systems.
 * Never recolors existing Pokemon moves. Works with the existing renderer.
 * Genkidama is still a provisional area move; art/gameplay not final.
 */
(function () {
  'use strict';
  if (!window.G || !G.VFX || !G.VFX.PAL) throw Error('DBZ VFX: G.VFX no está listo');
  G.VFX.PAL['dbz-ki'] = ['#102e73','#1764ba','#2798f6','#81d7ff','#f1fcff'];
  const base = G.VFX.forMove.bind(G.VFX);
  const overrides = {
    'dbz-ki-blast': { pal: 'dbz-ki', proj: 'ball', trail: 'spark' },
    'dbz-kamehameha': { pal: 'dbz-ki', proj: 'ball', beam: 'shard', trail: 'spark' },
    'dbz-genkidama': { pal: 'dbz-ki', proj: 'ball', trail: 'spark' }
  };
  G.VFX.forMove = function (move) {
    const normal = base(move);
    const special = move && overrides[move.id];
    return special ? Object.assign({},normal,special) : normal;
  };
  console.info('[DBZ Survivor] Efectos de ki azul limitados a las técnicas de Goku');
})();

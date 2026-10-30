/* DBZ Survivor / Goku alpha integration — code only, original game unmodified.
 * These frame sequences are procedural MOTION BLOCKOUTS, not final animation art.
 * Character #1 (Bulbasaur) is temporarily replaced with Goku to exercise real gameplay.
 * Attribution: original engine (c) 2026 JPTER78, MIT revision b297089.
 */
window.DBZ_GOKU = (() => {
  'use strict';
  const sprite = new Image();
  const pending = new Promise((resolve, reject) => {
    sprite.onload = resolve; sprite.onerror = () => reject(new Error('No se encontró dbz/goku_base_views.png'));
  });
  sprite.src = 'dbz/goku_base_views.png';
  const dirs = [0,3,3,3,1,2,2,2]; // down, down-right, right, up-right, up, up-left, left, down-left
  // Animation manifest: 7 states in 8 directions. Replaces old 4/6-frame temporary profiles.
  const timing = {
    Idle:Array(6).fill(8), Walk:Array(8).fill(5), Attack:Array(8).fill(4),
    Shoot:Array(8).fill(5), Charge:Array(12).fill(6), Hurt:Array(6).fill(5),
    Faint:Array(10).fill(8)
  };
  const external = window.DBZ_GOKU_ATLASES || {};
  const names = Object.keys(timing);
  const meta = { s:1, sh:0, a:{} };
  for (const name of names) {
    const d=timing[name];
    meta.a[name]={ w:64,h:64,n:d.length,r:8,d,ax:31.5,ay:61 };
    if (external[name] && Number.isFinite(external[name].ay)) meta.a[name].ay=external[name].ay;
  }
  const cache = new Map();
  function drawFrame(ctx, action, frame, row, columns) {
    const src=dirs[row], dy = action === 'Walk' ? [0,-2,-1,0,-2,-1,0,-1][frame%8] :
      action === 'Idle' ? [0,-1,-1,0,-1,0][frame%6] :
      action === 'Charge' ? [0,-1,-2,-2,-1,0,-1,0,0,-1,-2,-1][frame%12] :
      action === 'Hurt' ? [0,1,2,1,0,0][frame%6] : 0;
    let dx=0;
    if(action==='Walk') dx=[-1,0,1,0,-1,0,1,0][frame%8];
    if(action==='Attack') dx=[0,1,2,2,1,0,0,0][frame];
    if(action==='Hurt') dx=[0,-1,-2,0,0,0][frame%6];
    const x=frame*64,y=row*64;
    ctx.drawImage(sprite,src*64,0,64,64,x+dx,y+dy,64,64);
    if(action==='Charge' && frame > 1 && frame < 7) {
      ctx.save();ctx.strokeStyle='rgba(99,181,255,.75)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(x+32,y+40,24+frame%3,0.2,2.9);ctx.stroke();ctx.restore();
    }
    if(action==='Shoot' && frame===3) {
      ctx.save();ctx.fillStyle='#aeefff';ctx.beginPath();ctx.arc(x+51,y+29,4,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    if(action==='Hurt' && (frame===1 || frame===2)) {
      ctx.save();ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(255,70,48,.25)';
      ctx.fillRect(x,y,64,64);ctx.restore();
    }
    if(action==='Faint' && frame>=2) {
      // The true falling pose must be redrawn in Aseprite. Kept as blockout.
      ctx.save();ctx.fillStyle='rgba(6,16,26,.8)';ctx.fillRect(x,y,64,64);ctx.restore();
    }
  }
  async function sheetURL(action) {
    if(cache.has(action)) return cache.get(action);
    // If a completed 64px atlas exists, consume it without changing engine code.
    // Invalid/missing art gracefully falls back to a clearly marked blockout.
    const config = external[action];
    if (config && config.src) {
      const expectedWidth = 64 * (timing[action]?.length ?? 4);
      const image = new Image();
      const loaded = await new Promise(resolve => {
        image.onload = () => resolve(image.naturalWidth === expectedWidth && image.naturalHeight === 512);
        image.onerror = () => resolve(false);
        image.src = config.src;
      });
      if (loaded) { cache.set(action,config.src); return config.src; }
      console.warn('[DBZ] Atlas inválido o ausente, usando blockout:', action, config.src);
    }
    await pending;
    const n=timing[action]?.length ?? 4;
    const c=document.createElement('canvas');c.width=64*n;c.height=64*8;
    const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
    for(let row=0;row<8;row++)for(let col=0;col<n;col++)drawFrame(ctx,action,col,row,n);
    const url=c.toDataURL('image/png');
    cache.set(action,url);
    return url;
  }
  function patchData() {
    if(!window.G || !G.DEX || !G.SPRITE_META) throw Error('DBZ: faltan datos del motor');
    const hero=G.DEX.find(x=>x.dex===1);
    if(hero){hero.name='Goku (base)';hero.types=['fighting'];hero.hp=125;hero.spd=112;hero.atk=1.25;}
    G.SPRITE_META[1]=meta;
    // Aislar los ataques DBZ: NO renombrar los movimientos de todos los Pokémon.
    if (G.Moves && G.Moves.BY_ID && G.Moves.POOL) {
      const attacks = [
        {from:'water-gun', id:'dbz-ki-blast', name:'Ráfaga de ki', desc:'Proyectiles de energía automáticos.',
         dmg:13, cd:0.48, type:'fighting'},
        {from:'hydro-pump', id:'dbz-kamehameha', name:'Kamehameha', desc:'Rayo de energía concentrada.',
         dmg:30, cd:3.8, type:'fighting'},
        {from:'psychic', id:'dbz-genkidama', name:'Genkidama', desc:'Ataque de energía de gran área (provisional).',
         dmg:27, cd:6.5, type:'fighting'}
      ];
      G.Moves.POOL.fighting = G.Moves.POOL.fighting || [];
      for (const spec of attacks) {
        if (G.Moves.BY_ID[spec.id]) continue; // idempotente en recargas
        const base = G.Moves.BY_ID[spec.from];
        if (!base) { console.warn('DBZ: falta técnica base', spec.from); continue; }
        const move = Object.assign({}, base, spec);
        delete move.from;
        G.Moves.BY_ID[move.id] = move;
        G.Moves.ALL.push(move);
        G.Moves.POOL.fighting.push(move.id);
      }
      if (G.STARTERS) {
        const candidate = G.STARTERS.find(x=>x.dex===1);
        if (candidate && G.Moves.BY_ID['dbz-ki-blast']) candidate.start='dbz-ki-blast';
      }
    }
    console.info('[DBZ Survivor] Goku base disponible en lugar del Pokémon #1 (prueba técnica).');
  }
  return {sheetURL,patchData,meta,actions:names};
})();
DBZ_GOKU.patchData();

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
  const timing = { Idle:[18,18,18,18], Walk:[5,5,5,5,5,5], Attack:[4,3,3,4,4,4,5,5],
    Shoot:[6,4,4,4,5,6], Charge:[5,5,5,5,5,5,5,5], Hurt:[3,3,5,6], Faint:[7,5,5,5,10,20] };
  const names = Object.keys(timing);
  const meta = { s:1, sh:0, a:{} };
  for (const name of names) {
    const d=timing[name];
    meta.a[name]={ w:64,h:64,n:d.length,r:8,d,ax:31.5,ay:61 };
  }
  const cache = new Map();
  function drawFrame(ctx, action, frame, row, columns) {
    const src=dirs[row], dy = action === 'Walk' ? [0,-2,-1,0,-2,-1][frame] :
      action === 'Idle' ? [0,-1,-1,0][frame] :
      action === 'Charge' ? [0,-1,-2,-2,-1,0,-1,0][frame] :
      action === 'Hurt' ? [0,1,2,1][frame] : 0;
    let dx=0;
    if(action==='Walk') dx=[-1,0,1,0,-1,0][frame];
    if(action==='Attack') dx=[0,1,2,2,1,0,0,0][frame];
    if(action==='Hurt') dx=[0,-1,-2,0][frame];
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
    if(G.STARTERS){const candidate=G.STARTERS.find(x=>x.dex===1);if(candidate)candidate.start='water-gun';}
    console.info('[DBZ Survivor] Goku base disponible en lugar del Pokémon #1 (prueba técnica).');
  }
  return {sheetURL,patchData,meta,actions:names};
})();
DBZ_GOKU.patchData();

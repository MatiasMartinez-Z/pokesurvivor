/**
 * Test real source code from dbz/goku-base.js without a browser or network.
 * node dbz/tests/goku-smoke.cjs
 * This checks data isolation and sprite-atlas generation; NOT browser gameplay.
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname,'..','goku-base.js'),'utf8');

const drawn = [];
const rotations = [];
const canvas = {
  width:0,height:0,
  getContext:()=>({
    imageSmoothingEnabled:false,
    drawImage:(...args)=>drawn.push(args),
    save(){}, restore(){}, beginPath(){}, arc(){}, stroke(){}, fill(){},
    translate(){}, scale(){}, rotate:(angle)=>rotations.push(angle),
    fillRect(){}, set strokeStyle(v){}, set lineWidth(v){},set fillStyle(v){},
  }),
  toDataURL:()=> 'data:image/png;base64,MOCK'
};
class MockImage {
  set src(value) { this._src=value; queueMicrotask(()=>{this.naturalWidth=256;this.onload?.()}); }
  get src() { return this._src; }
}
const mk=(id,name,type,kind)=>({id,name,type,kind,desc:'original',ups:[{t:'test',m:{}}],maxLvl:2,cd:1,dmg:10});
const BY_ID={
  'water-gun':mk('water-gun','Pistola Agua','water','projectile'),
  'hydro-pump':mk('hydro-pump','Hidrobomba','water','beam'),
  'psychic':mk('psychic','Psíquico','psychic','nova')
};
const g={
  DEX:[{dex:1,name:'Bulbasaur',types:['grass']},{dex:4,name:'Charmander',types:['fire']}],
  SPRITE_META:{1:{s:1,a:{}}},
  STARTERS:[{dex:1,start:'vine-whip'},{dex:4,start:'ember'}],
  Moves:{BY_ID,ALL:Object.values(BY_ID),POOL:{fighting:['karate-chop'],water:['water-gun'],psychic:['psychic']}}
};
g.Moves.poolFor = mon => [...new Set([...(g.Moves.POOL.normal || []),...mon.types.flatMap(t=>g.Moves.POOL[t] || [])])];
const context={G:g,Image:MockImage,document:{createElement:name=>{assert.equal(name,'canvas');return canvas;}},console};
context.window=context;
vm.createContext(context);
vm.runInContext(source,context,{filename:'dbz/goku-base.js',timeout:2000});
assert.equal(g.DEX[0].name,'Goku (base)');
assert.equal(g.DEX[1].name,'Charmander');
assert.equal(g.Moves.BY_ID['water-gun'].name,'Pistola Agua','No mutate other Pokémon moves');
for(const id of ['dbz-ki-blast','dbz-kamehameha','dbz-genkidama']){
  assert.ok(g.Moves.BY_ID[id],id+' exists');
  assert.ok(g.Moves.poolFor(g.DEX[0]).includes(id),id+' available only to Goku');
  assert.ok(!g.Moves.poolFor({dex:999,types:['fighting']}).includes(id),id+' must not leak to other fighters');
  assert.ok(!g.Moves.POOL.fighting.includes(id),id+' must not alter global fighting pool');
}
assert.equal(g.STARTERS[0].start,'dbz-ki-blast');
assert.equal(g.STARTERS[1].start,'ember');
assert.equal(g.SPRITE_META[1].a.Walk.r,8);
assert.equal(g.SPRITE_META[1].a.Walk.n,8);

(async()=>{
  const url=await context.DBZ_GOKU.sheetURL('Walk');
  assert.ok(url.startsWith('data:image/png'));
  assert.equal(canvas.width,512);
  assert.equal(canvas.height,512);
  assert.equal(drawn.length,64);
  const faint = await context.DBZ_GOKU.sheetURL('Faint');
  assert.ok(faint.startsWith('data:image/png'));
  assert.equal(canvas.width,640);
  assert.equal(canvas.height,512);
  assert.equal(drawn.length,144, '64 Walk + 80 Faint sprite draws');
  assert.equal(rotations.length,64, 'Faint must visibly tilt in 8 rows of 8 non-idle frames');
  console.log('PASS: data isolation, 3 new attacks, Goku starter, 8x8 sprite atlas');
  console.log('IMPORTANT: browser rendering and real drawn animation still untested.');
})().catch(error=>{console.error(error);process.exitCode=1});

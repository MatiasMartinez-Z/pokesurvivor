/* Node smoke test: both DBZ visual layers must remain scoped to Goku. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const G={VFX:{PAL:{},SHAPES:{},forMove:m=>({pal:m.type,proj:'ball'})}};
const scope={G,window:{G},console:{info(){}}};
for(const name of ['ki-vfx.js','ki-shapes.js']) {
  vm.runInNewContext(fs.readFileSync('dbz/'+name,'utf8'),scope,{filename:name});
}
assert.equal(G.VFX.forMove({id:'dbz-ki-blast',type:'fighting'}).pal,'dbz-ki');
assert.equal(G.VFX.forMove({id:'dbz-kamehameha',type:'fighting'}).beam,'dbz-beam');
assert.equal(G.VFX.forMove({id:'dbz-genkidama',type:'fighting'}).proj,'dbz-spirit');
assert.equal(G.VFX.forMove({id:'karate-chop',type:'fighting'}).pal,'fighting');
assert.equal(G.VFX.forMove({id:'flamethrower',type:'fire'}).pal,'fire');
assert.equal(G.VFX.SHAPES['dbz-spirit'].w,31);
assert.equal(G.VFX.SHAPES['dbz-beam'].w,23);
console.log('PASS: scoped blue ki visuals, spirit sphere and beam');

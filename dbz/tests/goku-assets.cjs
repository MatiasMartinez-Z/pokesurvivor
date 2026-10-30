/* Verifica archivos REALES del atlas Goku 64x64, sin dependencias externas.
 * Ejecutar desde la raiz: node dbz/tests/goku-assets.cjs
 * Esto comprueba geometría/PNG. Calidad artística requiere inspección manual.
 */
'use strict';
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const actions={Idle:6,Walk:8,Attack:8,Shoot:8,Charge:12,Hurt:6,Faint:10};
const root=path.resolve(__dirname,'..','animations');
const signature=Buffer.from([137,80,78,71,13,10,26,10]);
let count=0;
for (const [name,n] of Object.entries(actions)) {
 const file=path.join(root,name+'.png');
 const bytes=fs.readFileSync(file);
 assert.ok(bytes.subarray(0,8).equals(signature),name+' PNG signature');
 assert.equal(bytes.toString('ascii',12,16),'IHDR',name+' IHDR');
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 assert.equal(width,64*n,name+' width');assert.equal(height,64*8,name+' height');
 const kind=bytes.readUInt8(25);
 assert.ok([3,6].includes(kind),name+' alpha-capable color type '+kind);
 count+=n*8;
 console.log(name+': '+width+'x'+height+' (8 directions, '+n+' frames)');
}
assert.equal(count,464);
console.log('PASS: 7 complete-sized PNG atlases, 464 cells, valid PNG headers.');
console.log('WARNING: artwork is procedural study, NOT final approved animation.');

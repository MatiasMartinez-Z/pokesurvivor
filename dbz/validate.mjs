#!/usr/bin/env node
/* Validación estática reproducible, sin depender de servicios ni dependencias. */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p));
let errors=[];
for(const file of ['dbz/goku-base.js','dbz/sprites.js']){
  try{new vm.Script(read(file).toString('utf8'),{filename:file});}
  catch(e){errors.push(file+': '+e.message);}
}
const html=read('dbz.html').toString('utf8');
for(const src of ['dbz/goku-base.js','dbz/sprites.js']){
 if(!html.includes('src="'+src+'"')) errors.push('dbz.html missing '+src);
}
const png=read('dbz/goku_base_views.png');
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
if(!png.subarray(0,8).equals(sig))errors.push('bad PNG signature');
else if(png.readUInt32BE(16)!==256||png.readUInt32BE(20)!==64)
 errors.push('Goku atlas must be 256x64');
const script=read('dbz/goku-base.js').toString('utf8');
if(!script.includes('G.SPRITE_META[1]=meta')) errors.push('missing runtime metadata patch');
if(!script.includes('for(let row=0;row<8;row++)')) errors.push('missing eight directional rows');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('DBZ alpha static checks PASSED: scripts, links, atlas PNG, 8 directions');
console.log('NOTE: passing static tests does not prove browser/gameplay correctness or art quality');

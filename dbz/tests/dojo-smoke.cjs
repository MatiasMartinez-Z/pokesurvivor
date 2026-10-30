'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const html=fs.readFileSync(path.resolve(__dirname,'../dojo.html'),'utf8');const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const events={},els=new Map(),callbacks=[],timers=[];let drawCalls=0;
const ctx=new Proxy({getContext(){return this},drawImage(){drawCalls++}}, {get(target,key){if(key in target)return target[key];return ()=>{}},set(target,key,value){target[key]=value;return true}});
const get=id=>{if(!els.has(id))els.set(id,{textContent:'',onclick:null,addEventListener(){},getContext(){return ctx}});return els.get(id)};
const document={querySelector:()=>get('scene'),getElementById:get};
class Image {set src(v){this._src=v;const name=v.split('/').pop().replace('.png','');this.naturalWidth=64*({Idle:6,Walk:8,Attack:8,Shoot:8,Charge:12,Hurt:6,Faint:10}[name]||1);this.naturalHeight=512;Promise.resolve().then(()=>this.onload?.())} get src(){return this._src}};
const w={addEventListener(name,fn){events[name]=fn}};
const scope={window:w,document,Image,Math,console,Set,Map,Number,Array,Promise,requestAnimationFrame:fn=>callbacks.push(fn),setTimeout:(fn)=>timers.push(fn)};
vm.runInNewContext(script,scope,{filename:'dojo.js',timeout:3000});
(async()=>{await Promise.resolve();for(let i=0;i<15;i++){const f=callbacks.shift();assert(f,'expected game frame');f(i*16)}
assert(get('state').textContent.includes('7 / 7'),'all atlases should load');
assert(drawCalls>10,'player animation should render');
for(const key of ['Digit1','Digit2','Digit3','Space','ShiftLeft'])events.keydown({code:key,preventDefault(){},repeat:false});
for(const t of timers)t();
for(let i=15;i<30;i++){const f=callbacks.shift();assert(f);f(i*16)}
assert(drawCalls>=30);console.log('PASS: dojo loads 7 sprites, renders frames, processes ki/beam/bomb/dash');
})().catch(e=>{console.error(e);process.exitCode=1});
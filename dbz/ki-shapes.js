/* Original DBZ energy geometries: engine-independent pixel recipes. */
(function(){
'use strict';
const v=G.VFX;
v.SHAPES['dbz-spirit']={w:31,h:31,frames:4,gen(P,f){
 const r=12.5+f*.35;
 P.fill((x,y)=>{const d=Math.hypot(x-15,y-15);return d<5.5?'w':d<9?'l':d<r?'m':d<r+1?'d':null;});
 P.outline();
}};
v.SHAPES['dbz-beam']={w:23,h:11,frames:3,dir:true,gen(P,f){
 P.fill((x,y)=>{const d=Math.abs(y-5)+Math.sin(x*.8+f*1.6)*.4;
 return d<1.5?'w':d<3?'l':d<4.6?'m':null;});
 P.outline();
}};
const before=v.forMove.bind(v);
v.forMove=m=>{
 const shape=before(m);
 if(m?.id==='dbz-genkidama')return Object.assign({},shape,{pal:'dbz-ki',proj:'dbz-spirit'});
 if(m?.id==='dbz-kamehameha')return Object.assign({},shape,{pal:'dbz-ki',beam:'dbz-beam'});
 return shape;
};
})();

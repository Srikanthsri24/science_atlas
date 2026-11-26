import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/rustConditions.ts'),G=await loadTs('src/lib/chemistry/rustConditionsGeometry.ts'),q=M.defaultRustInputs;
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
const volume=v=>{let sum=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);sum+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return sum};
test('closed cylinder winding and actual triangle volumes match polygonal reference volumes',()=>{
 for(const r of [.05,.3,1.2])for(const h of [.001,1,10])near(volume(G.rustCylinderTriangles(r,h,2)),128*Math.sin(2*Math.PI/128)/2*r*r*h);
 assert.deepEqual(G.rustCylinderTriangles(0,1,0),[]);assert.throws(()=>G.rustCylinderTriangles(-1,1,0),RangeError);
});
test('metal core and hollow attached-product triangles retain separate material volumes',()=>{
 for(const ironG of [.05,.3])for(const attachedFraction of [0,.25,1])for(const timeDays of [0,3,14]){
  const p={...q,ironG,attachedFraction,timeDays},s=G.rustGeometry(p,'wet_oxygen');near(volume(G.rustCoreTriangles(p,'wet_oxygen')),s.ironLeftG/8,1e-12);
  near(volume(G.rustAttachedTriangles(p,'wet_oxygen')),s.attachedProductG/4.2,1e-12);
  assert.ok(s.outerRadiusCm>=s.coreRadiusCm&&s.outerHeightCm>=s.coreHeightCm);
 }
});
test('sediment and water meshes meet at one surface without overlapping their modeled volumes',()=>{
 for(const waterMl of [.001,2])for(const attachedFraction of [0,.25,1])for(const timeDays of [0,14])for(const condition of M.rustConditions){
  const p={...q,waterMl,attachedFraction,timeDays},s=G.rustGeometry(p,condition);
  near(volume(G.rustSedimentTriangles(p,condition)),s.sedimentProductG/4.2,1e-12);near(volume(G.rustWaterTriangles(p,condition)),s.waterLeftG,1e-12);
  near(s.sedimentTopY,s.waterBottomY);near(s.waterTopY-s.waterBottomY,s.waterDepthCm);
 }
});
test('all phase volumes fit the rigid cell, keep the coupon above the pool and recover the modeled gas space',()=>{
 const a=G.rustApparatus;
 for(const ironG of [.05,.3])for(const waterMl of [.001,2])for(const chamberMl of [25,100])for(const oxygenFraction of [.1,.3])for(const attachedFraction of [0,1])for(const timeDays of [0,14]){
  for(const condition of M.rustConditions){const s=G.rustGeometry({...q,ironG,waterMl,chamberMl,oxygenFraction,attachedFraction,timeDays},condition);
   near(a.chamberAreaCm2*s.chamberHeightCm,chamberMl);assert.ok(s.waterTopY<s.couponBottomY);assert.ok(s.couponTopY<a.bottomY+s.chamberHeightCm);assert.ok(s.outerRadiusCm<a.chamberRadiusCm);
   near(chamberMl-s.metalVolumeMl-s.attachedVolumeMl-s.sedimentVolumeMl-s.waterVolumeMl,s.gasVolumeMl);
  }
 }
});
test('ideal excluded controls contain neither an invented shell nor a sediment layer',()=>{
 for(const condition of M.rustConditions.slice(1)){const p={...q,timeDays:14};assert.deepEqual(G.rustAttachedTriangles(p,condition),[]);assert.deepEqual(G.rustSedimentTriangles(p,condition),[])}
});

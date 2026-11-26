import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/corrosionCoatingsGeometry.ts'),S=await loadTs('src/lib/chemistry/corrosionCoatings.ts'),q=S.defaultCoatingInputs;
const near=(a,b,t=1e-11)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function volume(v){let total=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);total+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return total}
test('reference rectangular phase triangles are closed and outward with exact volume',()=>{
 const v=M.coatingBoxTriangles(-.25,.25,2,2.1,-.25,.25);assert.equal(v.length,108);near(volume(v),.025);
 const edges=new Map();for(let i=0;i<v.length;i+=9){const tri=[v.slice(i,i+3),v.slice(i+3,i+6),v.slice(i+6,i+9)];for(let j=0;j<3;j++){const a=tri[j].join(','),b=tri[(j+1)%3].join(','),key=[a,b].sort().join('|');edges.set(key,(edges.get(key)||0)+(a<b?1:-1))}}assert.ok([...edges.values()].every(v=>v===0));
 assert.deepEqual(M.coatingBoxTriangles(0,0,0,1,0,1),[]);assert.throws(()=>M.coatingBoxTriangles(1,0,0,1,0,1),RangeError);
});
test('every actual metal, product and inert film triangle volume matches the material inventory',()=>{
 for(const kind of S.coatingCases)for(const exposedFraction of [0,.01,.05,.5,1])for(const timeDays of [0,7,30]){
  const p={...q,exposedFraction,timeDays,bareCoefficientPerDay:1.2},g=M.coatingGeometry(p,kind);
  for(const i of [0,1]){near(volume(M.coatingZoneTriangles(p,kind,i,'metal')),g.zones[i].metalVolumeMl);near(volume(M.coatingZoneTriangles(p,kind,i,'product')),g.zones[i].productVolumeMl);near(volume(M.coatingZoneTriangles(p,kind,i,'film')),i===1?g.coatingVolumeMl:0)}
 }
});
test('separate stacked phases share surfaces without occupying the same interior',()=>{
 for(const kind of S.coatingCases)for(const timeDays of [0,14,30]){
  const g=M.coatingGeometry({...q,timeDays},kind);near(g.zones[0].x1,g.zones[1].x0);
  for(const z of g.zones){assert.ok(z.metalTopY>=2&&z.productTopY>=z.metalTopY&&z.filmTopY>=z.productTopY);if(z.fraction===0)assert.equal(z.areaCm2,0)}
  near(g.zones[0].areaCm2+g.zones[1].areaCm2,.25);
 }
});
test('water volume, coupon clearance and whole-cell gas space remain consistent at preparation corners',()=>{
 for(const ironG of [.1,.3])for(const waterMl of [0,.00001,2])for(const chamberMl of [25,75])for(const exposedFraction of [0,.01,.5,1])for(const timeDays of [0,30])for(const kind of S.coatingCases){
  const p={...q,ironG,waterMl,chamberMl,exposedFraction,timeDays,bareCoefficientPerDay:1.2},g=M.coatingGeometry(p,kind);
  near(volume(M.coatingWaterTriangles(p,kind)),g.waterLeftG,1e-10);assert.ok(g.waterTopY<2);
  assert.ok(g.zones.every(z=>z.filmTopY<.5+g.chamberHeightCm));near(g.chamberHeightCm*M.coatingApparatus.chamberAreaCm2,chamberMl);
  near(g.gasVolumeMl+g.metalVolumeMl+g.productVolumeMl+g.coatingVolumeMl+g.waterLeftG,chamberMl);
 }
});
test('local iron exhaustion removes only that metal mesh while retaining product and covered film',()=>{
 const p={...q,bareCoefficientPerDay:1.2,exposedFraction:.03,timeDays:30},g=M.coatingGeometry(p,'scratched');assert.equal(g.zones[0].ironLeftMol,0);assert.deepEqual(M.coatingZoneTriangles(p,'scratched',0,'metal'),[]);
 assert.ok(M.coatingZoneTriangles(p,'scratched',0,'product').length>0);assert.ok(M.coatingZoneTriangles(p,'scratched',1,'metal').length>0);assert.ok(M.coatingZoneTriangles(p,'scratched',1,'film').length>0);
 assert.deepEqual(M.coatingZoneTriangles(p,'bare',1,'film'),[]);assert.throws(()=>M.coatingZoneTriangles(p,'bare',2,'metal'),RangeError);
});

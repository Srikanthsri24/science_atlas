import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const G=await loadTs('src/lib/chemistry/carbonateGasGeometry.ts'),M=await loadTs('src/lib/chemistry/carbonateGas.ts');
const q=M.defaultCarbonateGasInputs,a=G.carbonateApparatus,near=(x,y)=>assert.ok(Math.abs(x-y)<1e-8,`${x} vs ${y}`);
test('closed polygonal flask capacity and syringe full stroke match the declared volumes',()=>{
 near(a.flaskCapacityMl,150);near(a.syringeAreaCm2*a.syringeTravelCm,200);assert.ok(a.baseHeight>0);
 const unit=a.sides*Math.sin(2*Math.PI/a.sides)/2;near(unit*a.syringeRadiusCm**2,10);
});
test('shrinking reference chips conserve represented carbonate volume and stay submerged',()=>{
 for(const carbonateG of[0,.1,.5])for(const acidMl of[10,30])for(const acidMolL of[0,.3])for(const timeS of[0,1,120,600]){
  const s=G.carbonateGasGeometry({...q,carbonateG,acidMl,acidMolL,timeS});
  near(s.chipEdgeCm**3*16,s.solidVolumeMl);near(s.perChipG*16,s.carbonateLeftG);
  assert.ok(s.chipEdgeCm<s.displacedLiquidDepthCm);assert.ok(s.displacedLiquidDepthCm<a.baseHeight);
  assert.ok(s.chipEdgeCm<.7);for(const p of G.carbonateChipCentres)assert.ok(Math.hypot(Math.abs(p[0])+s.chipEdgeCm/2,Math.abs(p[2])+s.chipEdgeCm/2)<3.6*Math.cos(Math.PI/128));
 }
});
test('liquid displacement, variable flask gas space and piston movement close geometrically',()=>{
 for(const timeS of[0,120,300,600]){
  const s=G.carbonateGasGeometry({...q,timeS});near(s.displacedLiquidDepthCm*a.baseArea-s.solidVolumeMl,q.acidMl);
  near(s.flaskAirAndCo2Ml+5,s.deadSpaceMl);near(s.pistonTravelCm*10,s.syringeMl);
  near(s.flaskAirAndCo2Ml+5+s.pistonTravelCm*10,s.totalGasVolumeMl);
 }
});
test('elapsed history retains exact endpoints without future data',()=>{
 for(const timeS of[0,19.606,119.37,300,600]){const h=G.carbonateGasHistory({...q,timeS});assert.equal(h[0].timeS,0);assert.equal(h.at(-1).timeS,timeS);assert.ok(h.every(p=>p.timeS<=timeS));near(h.at(-1).syringeMl,M.carbonateGasState({...q,timeS}).syringeMl)}
});
function meshVolume(v){let total=0;for(let i=0;i<v.length;i+=9){const[x,y,z,a,b,c,d,e,f]=v.slice(i,i+9);total+=(x*(b*f-c*e)+y*(c*d-a*f)+z*(a*e-b*d))/6}return total}
test('actual liquid mesh excludes solid cavities and retains exact reference liquid volume',()=>{for(const carbonateG of[0,.1,.5])for(const acidMl of[10,30])for(const timeS of[0,120,600]){const input={...q,carbonateG,acidMl,timeS},s=G.carbonateGasGeometry(input);near(meshVolume(G.carbonateChipTriangles(input)),s.solidVolumeMl);near(meshVolume(G.carbonateLiquidTriangles(input)),acidMl)}});

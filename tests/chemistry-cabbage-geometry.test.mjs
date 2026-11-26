import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const G=await loadTs('src/lib/chemistry/cabbageGeometry.ts'),M=await loadTs('src/lib/chemistry/cabbageIndicator.ts');
const q=M.defaultCabbageInputs,a=G.cabbageApparatus,near=(x,y,e=1e-9)=>assert.ok(Math.abs(x-y)<e,`${x} vs ${y}`);
function volume(v){let total=0;for(let i=0;i<v.length;i+=9){const[x,y,z,a,b,c,d,e,f]=v.slice(i,i+9);total+=(x*(b*f-c*e)+y*(c*d-a*f)+z*(a*e-b*d))/6}return total}
test('actual triangular drop meshes represent the specified metered volume',()=>{
 for(const ml of[0,.3/12,.6/12,1.2/6]){near(volume(G.cabbageDropTriangles(ml)),ml);const d=G.cabbageDropDimensions(ml);near(4*Math.PI*d.equivalentRadiusCm**3/3,ml);assert.ok(d.meshRadiusCm>=d.equivalentRadiusCm)}
});
test('polygonal vessel and reservoir heights retain their exact reference volumes',()=>{
 for(const sampleMl of[10,30])for(const doseMl of[0,1.2])for(const timeS of[0,2,2.05,10,65]){
  const s=G.cabbageGeometry({...q,sampleMl,doseMl,timeS},'acid');near(s.liquidDepthCm*a.vesselAreaCm2,s.vesselMl);near(s.reservoirDepthCm*a.reservoirAreaCm2,s.reservoirMl);
  assert.ok(s.liquidDepthCm<a.vesselHeightCm);assert.ok(s.reservoirDepthCm<a.reservoirHeightCm);
 }
});
test('the whole falling mesh stays above liquid until its declared contact event',()=>{
 const f=M.cabbageState().flightS;
 for(const sampleMl of[10,30])for(const doseMl of[.3,1.2])for(const u of[0,.25,.5,.999999]){
  const s=G.cabbageGeometry({...q,sampleMl,doseMl,timeS:2+f*u},'acid'),drop=s.dropCentres[0];
  assert.ok(drop.centreY-s.meshRadiusCm>=s.liquidSurfaceY);near(drop.centreY-s.meshRadiusCm-s.liquidSurfaceY,8*(1-u*u),1e-8);
  assert.ok(drop.centreY+s.meshRadiusCm<=s.nozzleY+1e-8);
 }
});
test('height controlled dispensers follow volume changes while retaining the same fall clearance',()=>{
 const initial=G.cabbageGeometry(q,'acid'),end=G.cabbageGeometry({...q,timeS:65},'acid');
 near(end.nozzleY-initial.nozzleY,end.liquidSurfaceY-initial.liquidSurfaceY);near(end.nozzleY-end.liquidSurfaceY,8+2*end.meshRadiusCm);
 for(const sample of['acid','neutral','base'])assert.equal(G.cabbageGeometry(q,sample).stationX,a.stations[sample]);
});
test('elapsed histories include release/arrival discontinuities without future evidence',()=>{
 for(const timeS of[0,2.05,19.606,65]){
  const h=G.cabbageHistory({...q,timeS},'acid');assert.equal(h[0].timeS,0);assert.equal(h.at(-1).timeS,timeS);assert.ok(h.every(p=>p.timeS<=timeS));
  for(const p of h)near(p.vesselPigmentMg+p.reservoirPigmentMg+p.inFlightPigmentMg,.3);
  if(timeS===65){const arrival=2+M.cabbageState().flightS;assert.ok(h.some(p=>p.timeS===arrival));assert.ok(h.some(p=>p.timeS===arrival-1e-6))}
 }
});
test('negative or nonfinite drop volumes cannot become geometry',()=>{for(const ml of[-1,NaN,Infinity])assert.throws(()=>G.cabbageDropTriangles(ml),RangeError)});

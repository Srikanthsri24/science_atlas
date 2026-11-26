import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/neutralization.ts'),G=await loadTs('src/lib/chemistry/neutralizationGeometry.ts'),q=M.defaultNeutralizationInputs;
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
const volume=v=>{let sum=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);sum+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return sum};
test('outward closed drop triangles retain their metered volumes across all aliquot sizes',()=>{
 for(const v of [.00025,.05,.1,.2]){const mesh=G.neutralizationDropTriangles(v);near(volume(mesh),v,1e-12);assert.ok(volume(mesh)>0)}
 assert.deepEqual(G.neutralizationDropTriangles(0),[]);assert.throws(()=>G.neutralizationDropTriangles(-1),RangeError);
});
test('polygonal burette and beaker geometry close actual liquid volumes without overflowing',()=>{
 const area=128*Math.sin(2*Math.PI/128)/2;
 for(const acidMl of [10,30])for(const plannedBaseMl of [0,.1,40])for(const timeS of [0,2.05,40,105]){
  const s=G.neutralizationGeometry({...q,acidMl,plannedBaseMl,timeS});near(s.vesselDepthCm*area*2.5**2,s.vesselMl);
  near(s.reservoirDepthCm*area*.8**2,s.reservoirMl);assert.ok(s.vesselDepthCm<G.neutralizationApparatus.vesselHeightCm);
  assert.ok(s.barrelSurfaceY<=G.neutralizationApparatus.barrelBottomY+G.neutralizationApparatus.barrelHeightCm);
 }
});
test('the burette scale increases downward and meniscus reading excludes a still-falling aliquot',()=>{
 const s=G.neutralizationGeometry({...q,timeS:2.03});near(s.scale[0].readingMl,0);near(s.scale.at(-1).readingMl,50);
 for(let i=1;i<s.scale.length;i++)assert.ok(s.scale[i].y<s.scale[i-1].y);
 near(s.initialBuretteReadingMl,10);near(s.buretteReadingMl,10.1);near(s.deliveredMl,0);near(s.inFlightMl,.1);
 near((s.scale[0].y-s.barrelSurfaceY)*M.neutralizationBuretteArea,s.buretteReadingMl);
});
test('all mesh bottoms stay above the unchanged pre-contact surface until arrival',()=>{
 for(const acidMl of [10,30])for(const plannedBaseMl of [.1,40])for(const aliquots of [200,400]){
  const p={...q,acidMl,plannedBaseMl,aliquots};for(const index of [0,Math.floor(aliquots/2),aliquots-1]){
   const e=M.neutralizationEvents(p)[index];for(const fraction of [0,.25,.5,.99]){
    const s=G.neutralizationGeometry({...p,timeS:e.releaseS+fraction*e.flightS}),drop=s.inFlight.find(d=>d.index===index);assert.ok(drop);
    assert.ok(drop.centreY-s.meshRadiusCm>=s.vesselSurfaceY-1e-9);
    near(drop.centreY-s.meshRadiusCm-s.vesselSurfaceY,e.bottomClearanceCm*(1-fraction**2));
   }
   const landed=G.neutralizationGeometry({...p,timeS:e.arrivalS});assert.equal(landed.arrivedCount,index+1);
  }
 }
});

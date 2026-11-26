import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/rustConditions.ts'),q=M.defaultRustInputs,C=M.rustReference;
const near=(a,b,tol=1e-11)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
test('reference phase has a balanced elemental and molar-mass equation',()=>{
 assert.deepEqual({Fe:4,O:3*2+2,H:2*2},{Fe:4,O:4*2,H:4});
 near(C.ironMolarG+.75*C.oxygenMolarG+.5*C.waterMolarG,C.productMolarG,1e-13);
});
test('all four reference cells start at the same pressure with no invented product',()=>{
 for(const s of M.rustComparison(q)){near(s.pressureKPa,101.325);near(s.productG,0);near(s.ironLeftG,.15);near(s.totalG,s.initialTotalG);assert.ok(s.gasVolumeMl>0)}
 const wet=M.rustState(q),dry=M.rustState(q,'dry_oxygen');near(dry.initialGasVolumeMl-wet.initialGasVolumeMl,2);
});
test('both available water and oxygen are required for this selected modeled pathway',()=>{
 const s=M.rustComparison({...q,timeDays:14});assert.ok(s[0].productG>0);
 assert.equal(s[1].productG,0);assert.equal(s[2].productG,0);assert.equal(s[3].productG,0);
 assert.equal(s[1].limiting,'water excluded');assert.equal(s[2].limiting,'oxygen excluded');assert.equal(s[3].limiting,'water and oxygen excluded');
 for(const v of s.slice(1)){near(v.pressureKPa,101.325);near(v.ironLeftG,.15);assert.equal(v.rateIronMolDay,0)}
});
test('a chosen residual oxygen reference can produce a small nonzero product without claiming perfect deoxygenation',()=>{
 const p={...q,reducedOxygenFraction:.001,timeDays:14},wet=M.rustState(p,'wet_reduced_oxygen'),normal=M.rustState(p);
 assert.ok(wet.productG>0&&wet.productG<normal.productG);assert.equal(wet.limiting,'oxygen');
 assert.equal(M.rustState(p,'dry_reduced_oxygen').productG,0);
});
test('the default capacity follows a finite oxygen inventory and chosen exponential law',()=>{
 const s=M.rustState({...q,timeDays:7});const nGas=101.325*((50-.15/8-2)/1000)/(8.314462618*298.15),cap=nGas*.21/.75;
 near(s.capacityMol,cap,1e-14);near(s.reactedIronMol,cap*(1-Math.exp(-.25*7)),1e-14);near(s.productG,s.reactedIronMol*88.851);
 assert.equal(s.limiting,'oxygen');
});
test('iron and water limited preparations do not silently use an oxygen-only capacity',()=>{
 const iron=M.rustState({...q,ironG:.05,chamberMl:100,oxygenFraction:.3,timeDays:14});assert.equal(iron.limiting,'iron');near(iron.capacityMol,.05/55.845);
 const water=M.rustState({...q,waterMl:.001,timeDays:14});assert.equal(water.limiting,'water');near(water.capacityMol,(.001/18.015)/.5);
});
test('whole mass and Fe/O/H atom inventories close across the control corners',()=>{
 for(const ironG of [.05,.3])for(const waterMl of [.001,2])for(const chamberMl of [25,100])for(const oxygenFraction of [.1,.3])for(const reducedOxygenFraction of [0,.01])for(const attachedFraction of [0,.25,1])for(const timeDays of [0,3,14]){
  for(const s of M.rustComparison({...q,ironG,waterMl,chamberMl,oxygenFraction,reducedOxygenFraction,attachedFraction,timeDays})){
   near(s.totalG,s.initialTotalG,1e-12);near(s.currentIronAtomsMol,s.initialIronAtomsMol,1e-14);near(s.currentOxygenAtomsMol,s.initialOxygenAtomsMol,1e-14);near(s.currentHydrogenAtomsMol,s.initialHydrogenAtomsMol,1e-14);
   near(s.attachedProductG+s.sedimentProductG,s.productG);assert.ok([s.ironLeftMol,s.oxygenLeftMol,s.waterLeftMol,s.gasVolumeMl,s.pressureKPa].every(v=>v>=0&&Number.isFinite(v)));
  }
 }
});
test('changing attached fraction redistributes product without changing chemistry or gas pressure',()=>{
 const a=M.rustState({...q,timeDays:14,attachedFraction:0}),b=M.rustState({...q,timeDays:14,attachedFraction:1});
 near(a.productG,b.productG);near(a.pressureKPa,b.pressureKPa);assert.equal(a.attachedProductG,0);assert.equal(b.sedimentProductG,0);
 assert.ok(a.couponG<q.ironG);assert.ok(b.couponG>q.ironG);near(a.retainedIronContainingG,b.retainedIronContainingG);assert.ok(a.retainedIronContainingG>q.ironG);
});
test('pressure uses the current gas space after all solid and liquid displacements',()=>{
 const s=M.rustState({...q,timeDays:14});const occupied=s.ironLeftG/8+s.productG/4.2+s.waterLeftG;
 near(s.gasVolumeMl,50-occupied);near(s.pressureKPa,(s.oxygenLeftMol+s.inertMol)*8.314462618*298.15/((50-occupied)/1000));assert.ok(s.pressureKPa<101.325);
 near(s.oxygenMoleFraction,s.oxygenLeftMol/(s.oxygenLeftMol+s.inertMol));
});
test('limiting-reagent tails remain positive and state rates agree with an independent finite difference',()=>{
 for(const patch of [{},{waterMl:.001},{ironG:.05,chamberMl:100,oxygenFraction:.3}]){
  const p={...q,...patch,ratePerDay:.6,timeDays:13.5},s=M.rustState(p),later=M.rustState({...p,timeDays:p.timeDays+1e-5});
  assert.ok(s.ironLeftMol>0&&s.oxygenLeftMol>0&&s.waterLeftMol>0);
  const derivative=(later.reactedIronMol-s.reactedIronMol)/1e-5;near(derivative,s.rateIronMolDay,1e-10);
 }
});
test('elapsed histories stop at the observed day and grow only the appropriate material phases',()=>{
 const p={...q,timeDays:3.25},h=M.rustHistory(p,'wet_oxygen');assert.equal(h.length,61);near(h[0].timeDays,0);near(h.at(-1).timeDays,3.25);near(h.at(-1).productG,M.rustState(p).productG);
 for(let i=1;i<h.length;i++){assert.ok(h[i].timeDays<=3.25&&h[i].productG>=h[i-1].productG&&h[i].ironLeftG<=h[i-1].ironLeftG);near(h[i].totalG,h[0].totalG)}
 assert.ok(M.rustHistory(p,'dry_oxygen').every(v=>v.productG===0));
});
test('120second guide has setup, fourteen-day compressed evolution and a final comparison hold',()=>{
 near(M.rustGuide(10).timeDays,0);near(M.rustGuide(60).timeDays,7);near(M.rustGuide(110).timeDays,14);near(M.rustGuide(120).timeDays,14);
 for(let t=0;t<=120;t++){const g=M.rustGuide(t);assert.equal(g.samples.length,4);for(const s of g.samples)near(s.totalG,s.initialTotalG)}
});
test('nonfinite, coerced or out-of-bounds controls cannot become observations',()=>{
 for(const patch of [{ironG:0},{waterMl:0},{chamberMl:1},{oxygenFraction:1},{reducedOxygenFraction:.02},{ratePerDay:0},{attachedFraction:2},{timeDays:15},{timeDays:NaN},{ironG:'0.15'}])assert.throws(()=>M.rustState({...q,...patch}),RangeError);
 assert.throws(()=>M.rustState(q,'other'),RangeError);assert.throws(()=>M.rustGuide(Infinity),RangeError);
});

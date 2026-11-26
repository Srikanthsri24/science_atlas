import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/corrosionCoatings.ts'),q=M.defaultCoatingInputs,C=M.coatingReference;
const near=(a,b,t=1e-12)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('four cases start with equal iron, zero product and correctly displaced finite gas',()=>{
 for(const s of M.coatingComparison(q)){near(s.ironLeftG,q.ironG);assert.equal(s.productG,0);near(s.pressureKPa,101.325);near(s.gasVolumeMl,50-.15/8-2-s.coatingVolumeMl);near(s.totalG,s.initialTotalG)}
 const bare=M.coatingState(q,'bare'),intact=M.coatingState(q,'intact');assert.equal(bare.coatingVolumeMl,0);near(intact.coatingVolumeMl,.5*.5*.005);near(intact.coatingG,.00125*1.2);
});
test('ideal blocking, zero oxygen and dry preparations do not acquire decorative product',()=>{
 for(const timeDays of [0,1,7,30]){
  assert.equal(M.coatingState({...q,timeDays},'ideal').productG,0);
  for(const patch of [{oxygenFraction:0},{waterMl:0}])for(const s of M.coatingComparison({...q,...patch,timeDays})){assert.equal(s.productG,0);assert.equal(s.currentOxygenRateMolDay,0);near(s.totalG,s.initialTotalG)}
 }
});
test('bare reference follows the independent oxygen-decay solution',()=>{
 for(const timeDays of [1,7,30]){const s=M.coatingState({...q,timeDays},'bare');near(s.oxygenLeftMol,s.initialOxygenMol*Math.exp(-.4*timeDays));near(s.reactedIronMol,s.initialOxygenMol*(-Math.expm1(-.4*timeDays))/.75)}
});
test('fully open and fully covered scratched references match the appropriate comparison',()=>{
 for(const [exposedFraction,kind] of [[0,'intact'],[1,'bare']])for(const timeDays of [0,7,30]){
  const a=M.coatingState({...q,exposedFraction,timeDays},'scratched'),b=M.coatingState({...q,timeDays},kind);near(a.productG,b.productG);near(a.oxygenLeftMol,b.oxygenLeftMol);near(a.gasVolumeMl,b.gasVolumeMl);near(a.coatingG,b.coatingG);
 }
});
test('unit relative transmission gives the bare normalized oxygen decay without inventing equal gas volumes',()=>{
 const s=M.coatingState({...q,relativeTransmission:1,timeDays:7},'scratched'),bare=M.coatingState({...q,timeDays:7},'bare');near(s.oxygenConsumedFraction,bare.oxygenConsumedFraction);assert.ok(s.initialOxygenMol<bare.initialOxygenMol);
});
test('a zero-transmission barrier stops at the finite exposed-zone iron capacity',()=>{
 const s=M.coatingState({...q,relativeTransmission:0,bareCoefficientPerDay:1.2,exposedFraction:.01,timeDays:30});
 assert.equal(s.zones[0].ironLeftMol,0);near(s.zones[1].ironLeftMol,s.initialZoneIronMol[1]);near(s.oxygenUsedMol,s.initialZoneIronMol[0]*.75);assert.equal(s.currentOxygenRateMolDay,0);assert.equal(s.segments.at(-1).event,'exposed exhausted');assert.ok(s.oxygenLeftMol>0);
});
test('after exposed iron exhaustion only the covered channel continues',()=>{
 const s=M.coatingState({...q,bareCoefficientPerDay:1.2,exposedFraction:.03,timeDays:30});assert.equal(s.zones[0].ironLeftMol,0);assert.ok(s.zones[1].reactedIronMol>0);assert.ok(s.zones[1].ironLeftMol>0);assert.ok(s.currentOxygenRateMolDay>0);
 assert.equal(s.segments[0].event,'exposed exhausted');assert.equal(s.segments[1].weights[0],0);assert.equal(s.segments.length,2);
});
test('local exhaustion events are continuous and never overconsume local iron',()=>{
 const p={...q,bareCoefficientPerDay:1.2,exposedFraction:.03,timeDays:30},s=M.coatingState(p),event=s.segments[0].endDay;
 const before=M.coatingState({...p,timeDays:event-1e-7}),after=M.coatingState({...p,timeDays:event+1e-7});assert.ok(before.zones[0].ironLeftMol>0);assert.equal(after.zones[0].ironLeftMol,0);near(before.productG,after.productG,1e-8);
 for(const seg of s.segments)near(seg.oxygenStartMol-seg.oxygenEndMol,seg.oxygenUsedByZone[0]+seg.oxygenUsedByZone[1]);
});
test('shared water exhaustion stops both channels while retaining unused oxygen',()=>{
 for(const kind of ['bare','intact','scratched']){const s=M.coatingState({...q,waterMl:.00001,timeDays:30},kind);assert.equal(s.waterLeftMol,0);assert.equal(s.waterExhausted,true);near(s.oxygenUsedMol,s.initialWaterMol*1.5);assert.ok(s.oxygenLeftMol>0);assert.equal(s.currentOxygenRateMolDay,0);assert.equal(s.segments.at(-1).event,'water exhausted');near(s.totalG,s.initialTotalG)}
});
test('whole mass and Fe/O/H inventories close across preparation corners',()=>{
 for(const ironG of [.1,.3])for(const waterMl of [0,.00001,2])for(const chamberMl of [25,75])for(const oxygenFraction of [0,.3])for(const relativeTransmission of [0,.02,1])for(const exposedFraction of [0,.01,.5,1])for(const timeDays of [0,7,30]){
  for(const s of M.coatingComparison({...q,ironG,waterMl,chamberMl,oxygenFraction,relativeTransmission,exposedFraction,timeDays})){
   near(s.totalG,s.initialTotalG);near(s.currentIronAtomsMol,s.initialIronAtomsMol);near(s.currentOxygenAtomsMol,s.initialOxygenAtomsMol);near(s.currentHydrogenAtomsMol,s.initialHydrogenAtomsMol);
   near(s.zones.reduce((a,z)=>a+z.productG,0),s.productG);near(s.zones.reduce((a,z)=>a+z.ironLeftG,0),s.ironLeftG);
   for(const value of [s.oxygenLeftMol,s.waterLeftMol,s.ironLeftMol,s.gasVolumeMl,s.pressureKPa,...s.zones.flatMap(z=>[z.ironLeftMol,z.productG])])assert.ok(value>=0&&Number.isFinite(value));assert.ok(s.segments.length<=3);
  }
 }
});
test('dry-gas pressure includes coating and every current material displacement',()=>{
 const s=M.coatingState({...q,timeDays:30});near(s.gasVolumeMl,q.chamberMl-s.ironLeftG/8-s.productG/4.2-s.waterLeftG-s.coatingVolumeMl);near(s.pressureKPa,(s.oxygenLeftMol+s.inertMol)*8.314462618*298.15/(s.gasVolumeMl/1000));near(s.coatingG,s.coatingVolumeMl*1.2);assert.ok(s.specimenG>q.ironG+s.coatingG);
});
test('more access increases corrosion within the chosen common preparations',()=>{
 let previous=-1;for(const exposedFraction of [0,.01,.05,.2,.5,1]){const s=M.coatingState({...q,exposedFraction,timeDays:14});assert.ok(s.productG>=previous);previous=s.productG}
 previous=-1;for(const relativeTransmission of [0,.001,.02,.1,1]){const s=M.coatingState({...q,relativeTransmission,timeDays:14});assert.ok(s.productG>=previous);previous=s.productG}
});
test('current oxygen rate agrees with a finite difference away from local events',()=>{
 for(const kind of M.coatingCases){const p={...q,timeDays:25},s=M.coatingState(p,kind),later=M.coatingState({...p,timeDays:p.timeDays+1e-5},kind);near((later.oxygenUsedMol-s.oxygenUsedMol)/1e-5,s.currentOxygenRateMolDay,1e-10)}
});
test('piecewise analytic consumption agrees with a separate small-step inventory integrator',()=>{
 const p={...q,bareCoefficientPerDay:1.2,exposedFraction:.03,timeDays:30},s=M.coatingState(p),dt=30/200000;
 let oxygen=s.initialOxygenMol,water=s.initialWaterMol;const iron=[...s.initialZoneIronMol],weights=[p.exposedFraction,(1-p.exposedFraction)*p.relativeTransmission];
 for(let j=0;j<200000;j++){
  const demand=weights.map((w,i)=>iron[i]>0?w*p.bareCoefficientPerDay*oxygen*dt:0),capped=demand.map((v,i)=>Math.min(v,.75*iron[i]));
  const total=capped[0]+capped[1],scale=total?Math.min(1,oxygen/total,water*1.5/total):0;
  for(let i=0;i<2;i++)iron[i]=Math.max(0,iron[i]-capped[i]*scale/.75);oxygen=Math.max(0,oxygen-total*scale);water=Math.max(0,water-total*scale*2/3);
 }
 near(oxygen,s.oxygenLeftMol,3e-9);near(iron[1],s.zones[1].ironLeftMol,3e-9);assert.equal(iron[0],0);
});
test('elapsed histories never expose future observations',()=>{
 const h=M.coatingHistory({...q,timeDays:8.5},'scratched');assert.equal(h.length,61);near(h[0].timeDays,0);near(h.at(-1).timeDays,8.5);
 for(let i=1;i<h.length;i++){assert.ok(h[i].timeDays<=8.5&&h[i].productG>=h[i-1].productG);near(h[i].totalG,h[0].totalG)}
});
test('guide supplies one hundred seconds of evolution plus setup and final hold',()=>{
 near(M.coatingGuide(10).timeDays,0);near(M.coatingGuide(60).timeDays,15);near(M.coatingGuide(110).timeDays,30);near(M.coatingGuide(120).timeDays,30);
 for(let t=0;t<=120;t++){const g=M.coatingGuide(t);assert.equal(g.samples.length,4);assert.ok(g.caption.length>40);for(const s of g.samples)near(s.totalG,s.initialTotalG)}
});
test('invalid, nonfinite and coerced controls cannot become model observations',()=>{
 for(const patch of [{ironG:.01},{waterMl:-1},{chamberMl:100},{oxygenFraction:.4},{bareCoefficientPerDay:0},{relativeTransmission:2},{exposedFraction:-1},{timeDays:31},{timeDays:NaN},{waterMl:'2'}])assert.throws(()=>M.coatingState({...q,...patch}),RangeError);
 assert.throws(()=>M.coatingState(q,'zinc'),RangeError);assert.throws(()=>M.coatingGuide(Infinity),RangeError);
});

import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/neutralization.ts'),q=M.defaultNeutralizationInputs;
const near=(a,b,tol=1e-12)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
test('initial acid, equivalence and base overshoot follow stoichiometry without singular pH',()=>{
 const initial=M.neutralizationAtVolume(q,0),equiv=M.neutralizationAtVolume(q,20),over=M.neutralizationAtVolume(q,40);
 near(initial.pH,2,1e-8);near(equiv.pH,7);near(equiv.hMolL,1e-7);near(equiv.ohMolL,1e-7);
 near(over.pH,14+Math.log10(.0002/.06),1e-8);assert.equal(initial.category,'acidic');assert.equal(equiv.category,'neutral');assert.equal(over.category,'basic');near(equiv.neutralizedMol,.0002);
});
test('water autoionization and charge balance hold throughout equivalence and dilute blanks',()=>{
 for(const ca of [0,1e-12,.005,.02])for(const cb of [0,1e-12,.005,.02])for(const v of [0,1,19.9999999999,20,20.0000000001,40]){
  const s=M.neutralizationAtVolume({...q,acidMolL:ca,baseMolL:cb},v);
  near(s.hMolL*s.ohMolL,1e-14,1e-24);near(s.positiveChargeMolL,s.negativeChargeMolL,1e-14);
  near(s.pH+s.pOH,14,1e-13);assert.ok(s.hMolL>0&&s.ohMolL>0&&Number.isFinite(s.pH));
 }
});
test('rationalized basic branch preserves tiny positive hydronium concentrations',()=>{
 const s=M.neutralizationAtVolume({...q,acidMolL:0,baseMolL:.02,acidMl:10},40);
 assert.ok(s.hMolL>0&&s.hMolL<1e-12);near(s.hMolL*s.ohMolL,1e-14,1e-25);near(s.ohMolL,.016,1e-10);
});
test('zero base is dilution, while no acid and no base stay neutral',()=>{
 const diluted=M.neutralizationAtVolume({...q,baseMolL:0},40);near(diluted.pH,-Math.log10(.0002/.06),1e-8);assert.equal(diluted.equivalentBaseMl,null);assert.equal(diluted.equivalentWithinPlan,false);
 for(const v of [0,10,40])near(M.neutralizationAtVolume({...q,acidMolL:0,baseMolL:0},v).pH,7);
});
test('equivalence depends on amounts and need not be reachable in the charged burette',()=>{
 const s=M.neutralizationAtVolume({...q,acidMl:30,acidMolL:.02,baseMolL:.005},40);near(s.equivalentBaseMl,120);assert.equal(s.equivalentWithinPlan,false);assert.equal(s.category,'acidic');
 const t=M.neutralizationAtVolume({...q,acidMl:10,acidMolL:.005,baseMolL:.02},2.5);near(t.pH,7);near(t.equivalentBaseMl,2.5);
});
test('all allowed aliquots arrive before the next release and program ends before105s',()=>{
 for(const acidMl of [10,30])for(const plannedBaseMl of [0,.1,40])for(const aliquots of [200,400])for(const intervalS of [.15,.25]){
  const events=M.neutralizationEvents({...q,acidMl,plannedBaseMl,aliquots,intervalS});
  for(const e of events){assert.ok(e.bottomClearanceCm>0&&e.flightS<intervalS);near(.5*981*e.flightS**2,e.bottomClearanceCm);assert.ok(e.arrivalS<105)}
 }
});
test('release and contact are distinct events with a falling aliquot above pre-arrival liquid',()=>{
 const e=M.neutralizationEvents(q)[0];const before=M.neutralizationState({...q,timeS:e.releaseS-1e-6}),fall=M.neutralizationState({...q,timeS:e.releaseS+e.flightS/2}),after=M.neutralizationState({...q,timeS:e.arrivalS});
 assert.equal(before.releasedCount,0);assert.equal(fall.releasedCount,1);assert.equal(fall.arrivedCount,0);assert.equal(fall.inFlight.length,1);assert.ok(fall.inFlight[0].centreY-fall.meshRadiusCm>fall.vesselSurfaceY);
 assert.equal(after.arrivedCount,1);assert.equal(after.inFlight.length,0);near(after.deliveredMl,.1);
});
test('liquid, sodium inventory and acid/base equivalents close at all controls and times',()=>{
 for(const plannedBaseMl of [0,.1,.3,13.7,40])for(const aliquots of [200,237,400])for(const timeS of [0,2,2.05,30,41.9,81.9,105]){
  const s=M.neutralizationState({...q,plannedBaseMl,aliquots,timeS});near(s.liquidAccountedMl,s.initialLiquidMl);
  near(s.reservoirBaseMol+s.inFlightBaseMol+s.deliveredBaseMol,s.initialBaseMol,1e-15);
  near(s.acidExcessMol+s.neutralizedMol,s.initialAcidMol,1e-15);near(s.baseExcessMol+s.neutralizedMol,s.deliveredBaseMol,1e-15);
  near(s.buretteReadingMl-s.initialBuretteReadingMl,s.releasedMl);
  assert.ok(s.reservoirMl>=0&&s.inFlightMl>=0);
  if(plannedBaseMl===0)assert.equal(s.inFlight.length+s.releasedCount+s.arrivedCount,0);
 }
});
test('elapsed titration curve contains only arrived aliquots and all endpoint volumes are valid',()=>{
 for(const plannedBaseMl of [.1,.3,13.7,40])for(const timeS of [0,20,105]){
  const p={...q,plannedBaseMl,timeS},s=M.neutralizationState(p),points=M.neutralizationCurve(p);
  assert.equal(points.length,s.arrivedCount+1);near(points.at(-1).deliveredMl,s.deliveredMl);assert.ok(points.every(v=>v.deliveredMl<=s.deliveredMl));
 }
});
test('120second presentation holds setup and endpoint around actual titration development',()=>{
 near(M.neutralizationGuide(10).timeS,0);near(M.neutralizationGuide(60).timeS,52.5);near(M.neutralizationGuide(110).timeS,105);near(M.neutralizationGuide(120).timeS,105);
 const end=M.neutralizationGuide(120);assert.equal(end.arrivedCount,400);near(end.deliveredMl,40);assert.match(end.caption,/endpoint/);
 for(let i=0;i<=120;i++)assert.ok(Number.isFinite(M.neutralizationGuide(i).pH));
});
test('invalid and coerced controls cannot become model observations',()=>{
 for(const patch of [{acidMl:0},{acidMolL:-1},{baseMolL:.1},{plannedBaseMl:41},{aliquots:199},{aliquots:200.5},{intervalS:.1},{timeS:106},{timeS:NaN},{acidMl:'20'}])assert.throws(()=>M.neutralizationState({...q,...patch}),RangeError);
 assert.throws(()=>M.neutralizationAtVolume(q,-1),RangeError);assert.throws(()=>M.neutralizationAtVolume(q,41),RangeError);assert.throws(()=>M.neutralizationGuide(Infinity),RangeError);
});

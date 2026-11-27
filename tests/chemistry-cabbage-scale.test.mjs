import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTs} from './load-ts.mjs';
const M=await loadTs('src/lib/chemistry/cabbageScale.ts'),q=M.defaultCabbage;
const near=(a,b,t=1e-12)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
const full={...q,fractions:[1,1,1,1,1,1]};
test('five independently specified standards and a separate investigation require complete dosing',()=>{
 const s=M.cabbageState(q);assert.equal(s.tubes.length,6);assert.deepEqual(s.references.map(t=>t.pH),[2,4,7,9,11]);assert.equal(s.investigation.pH,4);assert.equal(s.ready,false);assert.deepEqual(s.matchingReferences,[]);assert.ok(s.tubes.every(t=>t.category==='not-ready'));
 for(let missing=0;missing<6;missing++){const fractions=[1,1,1,1,1,1];fractions[missing]=.999;const v=M.cabbageState({...q,fractions});assert.equal(v.ready,false);assert.deepEqual(v.matchingReferences,[]);assert.equal(v.tubes[missing].category,'not-ready')}
});
test('shared pink teaching cards retain ambiguity rather than inventing exact pH or an interval',()=>{
 for(const testPH of [2,4]){const s=M.cabbageState({...full,testPH});assert.deepEqual(s.matchingReferences,[2,4]);assert.ok(s.inference.includes('cannot distinguish'));assert.ok(s.inference.includes('does not establish a continuous'))}
 for(const testPH of [7,9,11]){const s=M.cabbageState({...full,testPH});assert.deepEqual(s.matchingReferences,[testPH]);assert.ok(s.inference.includes('does not prove exact pH'))}
});
test('imposed reference pH remains distinct from addition volume and indicator colour inference',()=>{
 for(const pH of M.cabbageReferencePH){const a=M.cabbageState({...full,testPH:pH,sampleMl:5,indicatorDoseUl:50}),b=M.cabbageState({...full,testPH:pH,sampleMl:20,indicatorDoseUl:5});near(a.investigation.hydrogenM,b.investigation.hydrogenM);assert.equal(a.investigation.pH,pH);assert.notEqual(a.investigation.indicatorVolumeFraction,b.investigation.indicatorVolumeFraction);assert.equal(a.investigation.category,b.investigation.category)}assert.ok(M.cabbageLimitations.includes('independently maintained'));assert.ok(M.cabbageLimitations.includes('not measured RGB'));
});
test('20160 sampled preparations preserve each liquid account and the finite indicator reservoir',()=>{
 let cases=0;for(const sampleMl of [5,10,20])for(const indicatorDoseUl of [5,25,50])for(const testPH of M.cabbageReferencePH)for(let i=0;i<64;i++){const fractions=Array.from({length:6},(_,j)=>((i*(j+3)+j*11)%101)/100);for(const scale of [0,1/6,2/6,3/6,4/6,5/6,1]){const s=M.cabbageState({sampleMl,indicatorDoseUl,testPH,fractions:fractions.map(f=>f*scale)});cases++;near(s.stockResidualUl,0);near(s.systemVolumeResidualMl,0,1e-12);assert.ok(s.remainingStockUl>=-1e-12);assert.ok(s.remainingStockUl<=s.initialStockUl);for(const t of s.tubes){near(t.deliveredUl,indicatorDoseUl*t.fraction);near(t.deliveredMl,t.deliveredUl/1000);near(t.volumeMl,sampleMl+t.deliveredMl);near(t.volumeResidualMl,0,4e-15);assert.ok(t.indicatorVolumeFraction>=0&&t.indicatorVolumeFraction<.01)}}}assert.equal(cases,20160);
});
test('independent exponent identities and tenfold ratios cover all selected reference pairs',()=>{
 for(const pH of M.cabbageReferencePH){const v=M.cabbageIdealIons(pH);near(v.hydrogenM,Math.exp(-pH*Math.LN10),1e-16);near(v.hydroxideM,1e-14/v.hydrogenM,1e-16);near(v.kwResidualM2,0,3e-30);near(v.logResidual,0);near(v.pH+v.pOH,14)}
 for(let a=0;a<6;a++)for(let b=0;b<6;b++){const p=M.cabbagePair(full,a,b);near(p.hydrogenRatioLeftToRight,p.tenPowerDelta,Math.max(1e-12,p.tenPowerDelta*1e-14));const rev=M.cabbagePair(full,b,a);near(p.hydrogenRatioLeftToRight*rev.hydrogenRatioLeftToRight,1)}near(M.cabbagePair(full,0,1).hydrogenRatioLeftToRight,100,1e-12);assert.equal(M.cabbagePair(full,0,1).sameTeachingCategory,true);assert.equal(M.cabbagePair(q,0,1).sameTeachingCategory,null);
});
test('changing the investigation standard never changes the five reference preparations',()=>{
 const a=M.cabbageState(full);for(const testPH of M.cabbageReferencePH){const b=M.cabbageState({...full,testPH});assert.deepEqual(a.references,b.references)}
});
test('120-second guide completes independent approaches and ordered finite doses before comparison',()=>{
 let prior=[0,0,0,0,0,0];for(let n=0;n<=1200;n++){const g=M.cabbageGuide(n/10,q);for(let i=0;i<6;i++){assert.ok(g.inputs.fractions[i]>=prior[i]);if(g.inputs.fractions[i]>0)for(let j=0;j<i;j++)assert.equal(g.inputs.fractions[j],1)}prior=g.inputs.fractions;if(n<990)assert.equal(g.state.ready,false);else assert.equal(g.state.ready,true);assert.ok(g.state.remainingStockUl>=-1e-12)}assert.deepEqual(M.cabbageGuide(120,q).inputs.fractions,[1,1,1,1,1,1]);assert.equal(M.cabbageGuide(120,q).activeIndex,null);for(let i=0;i<6;i++){assert.equal(M.cabbageGuide(20+i*14,q).inputs.fractions[i],0);assert.equal(M.cabbageGuide(29+i*14,q).inputs.fractions[i],1)}});
test('invalid pH,delivery fractions,preparations,pair indices and presentation clocks are rejected',()=>{
 for(const patch of[{sampleMl:4.9},{sampleMl:20.1},{indicatorDoseUl:0},{indicatorDoseUl:51},{testPH:3},{testPH:NaN},{fractions:[]},{fractions:[1,1,1,1,1,1.01]},{fractions:[1,1,1,1,1,NaN]},{fractions:null},{fractions:Array(6)}])assert.throws(()=>M.cabbageState({...q,...patch}),RangeError);for(const t of[-1,120.1,NaN,Infinity])assert.throws(()=>M.cabbageGuide(t,q),RangeError);for(const p of[1,12,NaN])assert.throws(()=>M.cabbageIdealIons(p),RangeError);for(const pair of[[-1,0],[0,6],[.5,0],[0,NaN]])assert.throws(()=>M.cabbagePair(q,...pair),RangeError);
});
const R=await loadTs('src/lib/chemistry/cabbageScaleRecord.ts');
test('six-tube records and81worked blocks per trial cover every selected reference and partial protocol',()=>{
 for(const testPH of M.cabbageReferencePH)for(const fractions of[[0,0,0,0,0,0],[1,1,.5,0,0,0],[1,1,1,1,1,1]]){const t={...q,testPH,fractions,note:'Controlled comparison'};assert.equal(R.cabbagePreparationValues(t,0).length,R.cabbagePreparationHeaders.length);let blocks=R.cabbageCommonCalculations(t);assert.equal(blocks.length,6);for(let i=0;i<6;i++){assert.equal(R.cabbageObservationValues(t,0,i).length,R.cabbageObservationHeaders.length);const b=R.cabbageTubeCalculations(t,i);assert.equal(b.length,10);blocks=blocks.concat(b)}for(let i=0;i<5;i++){assert.equal(R.cabbageComparisonValues(t,0,i).length,R.cabbageComparisonHeaders.length);const b=R.cabbagePairCalculations(t,i);assert.equal(b.length,3);blocks=blocks.concat(b)}assert.equal(blocks.length,81);assert.ok(blocks.every(b=>Object.values(b).every(v=>typeof v==='string'&&v.length>0)&&!`${b.substitution} ${b.result}`.match(/NaN|Infinity/)));assert.ok(R.cabbageResultSummary(t).includes('not a colour-derived measurement'))}
 for(const n of[-1,6,NaN])assert.throws(()=>R.cabbageTubeCalculations(q,n),RangeError);for(const n of[-1,5,NaN])assert.throws(()=>R.cabbagePairCalculations(q,n),RangeError);
});
test('validated input-only reports clone fractions,escape student text and retain exact preparations',()=>{
 const p={...q,sampleMl:12.345678901234,fractions:[.1234567890123,.2,.3,.4,.5,.6],note:'</script><img src=x> & evidence'},r=R.validateCabbageRecord({plan:'<plan>&',conclusion:'<result>&',trials:[{...p,hydrogenM:900},{...p,testPH:5},null]});assert.equal(r.trials.length,1);assert.equal(r.trials[0].sampleMl,p.sampleMl);assert.equal(r.trials[0].hydrogenM,undefined);assert.notEqual(r.trials[0].fractions,p.fractions);assert.deepEqual(r.trials[0].fractions,p.fractions);const html=R.cabbageReport(r);assert.ok(!html.includes('<img src=x>'));assert.ok(html.includes('&lt;plan&gt;&amp;'));const payload=html.match(/id="cabbage-scale-record-inputs">([^<]*)<\/script>/)[1];assert.deepEqual(JSON.parse(payload),r);assert.equal((html.match(/<table>/g)||[]).length,3);assert.equal((html.match(/class="worked"/g)||[]).length,81);assert.equal(R.validateCabbageRecord({plan:'x'.repeat(5000),trials:Array(45).fill(p)}).trials.length,40);assert.equal(R.validateCabbageRecord({plan:'x'.repeat(5000)}).plan.length,4000);
});

test('fractional microlitre doses retain nonnegative stock through all six completions',()=>{for(let n=0;n<=450;n++){const indicatorDoseUl=5+n/10,s=M.cabbageState({...full,indicatorDoseUl});assert.equal(s.remainingStockUl,0);near(s.stockResidualUl,0,1e-12);assert.ok(s.tubes.every(t=>t.complete))}});
const G=await loadTs('src/lib/chemistry/cabbageScaleGeometry.ts');
test('flat-bottom vial and metered-stock geometry retain true volumes throughout every guide',()=>{
 for(const sampleMl of[5,20])for(const indicatorDoseUl of[5,50])for(let n=0;n<=120;n++){const p={...q,sampleMl,indicatorDoseUl},guide=M.cabbageGuide(n,p),g=G.cabbageGeometry(guide.inputs,n);assert.ok(g.capacityMl>20.05);assert.ok(g.indicatorReservoirCapacityUl>300);for(const t of g.tubes){near(Math.PI*g.radiusCm**2*t.liquidHeightCm,t.volumeMl,1e-13);assert.ok(t.liquidHeightCm>0&&t.liquidHeightCm<g.rimCm);assert.equal(t.hatch,!t.complete)}near(Math.PI*g.actor.reservoirRadiusCm**2*g.actor.reservoirLiquidHeightCm*1000,g.state.remainingStockUl,1e-12);assert.ok(g.actor.reservoirLiquidHeightCm>=0&&g.actor.reservoirLiquidHeightCm<=4.5)}
});
test('the metering actor approaches each independent vial before delivery and returns after comparison',()=>{
 for(let i=0;i<6;i++){const start=15+i*14,at=t=>{const guide=M.cabbageGuide(t,q);return G.cabbageGeometry(guide.inputs,t)},a=at(start),b=at(start+2.5),c=at(start+5);assert.equal(a.actor.active,false);assert.equal(b.actor.active,false);near(c.actor.x,c.tubes[i].x);near(c.actor.z,c.tubes[i].z);const distance=g=>Math.hypot(g.actor.x-g.tubes[i].x,g.actor.z-g.tubes[i].z);assert.ok(distance(a)>distance(b));assert.ok(distance(b)>distance(c));const pouring=at(start+7);assert.equal(pouring.actor.active,true);assert.equal(pouring.actor.target,i)}
 const end=M.cabbageGuide(120,q),g=G.cabbageGeometry(end.inputs,120);near(g.actor.x,7);near(g.actor.z,-4);assert.equal(g.actor.active,false);assert.equal(g.actor.reservoirLiquidHeightCm,0);
});
test('paused metering poses are deterministic,follow actual delivered volume and reject invalid selection',()=>{
 const guide=M.cabbageGuide(24,q),a=G.cabbageGeometry(guide.inputs,24),b=G.cabbageGeometry(guide.inputs,24);assert.deepEqual(a,b);near(a.actor.phase,(guide.inputs.fractions[0]*q.indicatorDoseUl/5)%1);for(const n of[-1,.5,6,NaN])assert.throws(()=>G.cabbageGeometry(q,24,n),RangeError);for(const t of[-1,121,NaN])assert.throws(()=>G.cabbageGeometry(q,t),RangeError);
});

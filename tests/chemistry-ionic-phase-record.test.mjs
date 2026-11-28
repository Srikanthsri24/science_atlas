import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';const c=await loadTs('src/lib/chemistry/ionicPhaseComparison.ts'),r=await loadTs('src/lib/chemistry/ionicPhaseRecord.ts');
const trial=(phase)=>({...c.defaultIonicPhase,phase,guideBase:null,guideSeconds:null,note:'<img src=x onerror=alert(1)>'});
test('solid record never fabricates a numeric conductivity; aqueous inversions retain correct units',()=>{
 const solid=r.ionicPhaseCalculations(trial('solid'));assert.equal(solid.find(x=>x.key==='solidConductivity').result,'Unavailable');assert.equal(solid.find(x=>x.key==='solidCurrent').result,'0 A');
 const solution=r.ionicPhaseCalculations(trial('solution'));assert.equal(solution.find(x=>x.key==='inverseKappa').result,'0.140823 S/m');assert.equal(solution.find(x=>x.key==='microCurrent').result,'70.4115 µA');
});
test('unavailable inverse formulas are not evaluated; tiny water current remains positive',()=>{
 const q=trial('solution');q.cell={...q.cell,immersedDepthCm:0};for(const k of ['cellConstant','inverseG','inverseKappa']){const w=r.ionicPhaseCalculations(q).find(x=>x.key===k);assert.equal(w.result,'Unavailable');assert.equal(w.substitution,'Not evaluated')}
 const water=r.ionicPhaseCalculations(trial('water')).find(x=>x.key==='current');assert.ok(parseFloat(water.result)>0);
});
test('guide snapshots preserve original conditions and reject forged stages',()=>{
 const base=c.defaultIonicPhase,g=c.ionicPhaseGuide(145,base),q={...g.inputs,guideBase:base,guideSeconds:145,note:''};assert.equal(r.ionicPhaseSnapshotLabel(r.validateIonicPhaseTrial(q)),'Verified guide stage');assert.throws(()=>r.validateIonicPhaseTrial({...q,phase:'solid'}));assert.throws(()=>r.validateIonicPhaseTrial({...q,guideSeconds:20}));
});
test('HTML report has consistent tables, escaped notes and round-trippable original inputs',()=>{
 const input={plan:'Compare <solid>',conclusion:'Evidence & interpretation',trials:['solid','solution','water'].map(trial)},html=r.ionicPhaseReport(input);
 assert.equal((html.match(/<table>/g)||[]).length,3);assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));const payload=html.match(/id="ionic-phase-record-inputs">(.*?)<\/script>/s)[1];assert.deepEqual(r.validateIonicPhaseRecord(JSON.parse(payload)),r.validateIonicPhaseRecord(input));
 for(const q of input.trials){const rows=r.ionicPhaseRows(q,0);rows.forEach((row,i)=>assert.equal(row.length,r.ionicPhaseHeaders[i].length))}
});

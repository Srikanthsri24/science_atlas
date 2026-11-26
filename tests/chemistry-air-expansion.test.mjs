import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/airExpansion.ts'),q=M.defaultAirInputs,C=M.airReference;
const near=(a,b,t=1e-11)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('both closed references start with matched amount, pressure, volume and temperature',()=>{
 const [a,b]=M.airComparison(q);near(a.amountMol,b.amountMol);for(const s of [a,b]){near(s.gasK,298.15);near(s.pressureKPa,101.325);near(s.volumeMl,50);assert.equal(s.heatJ,0);assert.equal(s.workJ,0);assert.equal(s.internalChangeJ,0);near(s.pressureVolumeJ,s.idealGasJ)}
 near(a.amountMol,101.325*.05/(8.314462618*298.15));assert.equal(a.segments.length,0);
});
test('fixed-pressure warming expands and fixed-volume warming increases pressure using kelvin',()=>{
 const [a,b]=M.airComparison({...q,timeSeconds:300});assert.ok(a.volumeMl>50);assert.equal(a.pressureKPa,101.325);assert.equal(b.volumeMl,50);assert.ok(b.pressureKPa>101.325);
 near(a.volumeMl/q.initialVolumeMl,a.gasK/a.initialK);near(b.pressureKPa/q.initialPressureKPa,b.gasK/b.initialK);assert.ok(Math.abs(a.volumeMl/q.initialVolumeMl-a.gasC/q.initialC)>.5);
});
test('same jacket conductance gives different Cp/Cv time constants rather than identical fabricated temperatures',()=>{
 const [a,b]=M.airComparison({...q,timeSeconds:30});near(a.tauSeconds/b.tauSeconds,1.4);assert.ok(a.gasK<b.gasK);near(a.thermalCapacityJK,a.amountMol*3.5*C.R);near(b.thermalCapacityJK,b.amountMol*2.5*C.R);
});
test('gas temperature lags the jacket and approaches the selected constant target',()=>{
 for(const boundary of M.airBoundaries){const a=M.airState({...q,timeSeconds:1},boundary),b=M.airState({...q,timeSeconds:300},boundary);assert.ok(a.gasC>25&&a.gasC<65);assert.ok(b.gasC>a.gasC&&b.gasC<65);near(a.deltaK,40*(-Math.expm1(-1/a.tauSeconds)))}
});
test('a colder jacket contracts the piston and lowers rigid pressure with negative heat and work',()=>{
 const [a,b]=M.airComparison({...q,targetC:5,timeSeconds:120});assert.ok(a.volumeMl<50&&a.heatJ<0&&a.workJ<0&&a.internalChangeJ<0);assert.ok(b.pressureKPa<101.325&&b.heatJ<0);assert.equal(b.workJ,0);assert.ok(a.heatRateW<0&&b.heatRateW<0);
});
test('equal initial and target temperatures produce a stationary control throughout both programs',()=>{
 for(const program of ['constant','return'])for(const timeSeconds of [0,120,240,300])for(const s of M.airComparison({...q,targetC:q.initialC,program,timeSeconds})){assert.equal(s.deltaK,0);assert.equal(s.heatJ,0);assert.equal(s.heatRateW,0);near(s.volumeMl,50);near(s.pressureKPa,101.325)}
});
test('jacket return changes heat-flow direction without an instantaneous gas-state jump',()=>{
 for(const boundary of M.airBoundaries){const p={...q,program:'return'},before=M.airState({...p,timeSeconds:120-1e-7},boundary),at=M.airState({...p,timeSeconds:120},boundary),after=M.airState({...p,timeSeconds:120+1e-7},boundary);near(before.gasK,at.gasK,1e-9);near(after.gasK,at.gasK,1e-9);assert.ok(before.heatRateW>0&&at.heatRateW<0);assert.equal(at.bathC,25);assert.equal(after.segments.length,2);assert.ok(after.segments[1].heatJ<0)}
});
test('finite return cooling retains a small residual rather than snapping exactly to the start',()=>{
 for(const boundary of M.airBoundaries){const s=M.airState({...q,program:'return',timeSeconds:240},boundary);near(s.deltaK,40*(-Math.expm1(-120/s.tauSeconds))*Math.exp(-120/s.tauSeconds));assert.ok(s.deltaK>0&&s.deltaK<1);assert.ok(s.segments[0].heatJ>0&&s.segments[1].heatJ<0)}
});
test('ideal-gas closure, mass and signed first-law inventories hold across all control corners',()=>{
 for(const initialVolumeMl of [20,60])for(const initialPressureKPa of [80,120])for(const initialC of [15,35])for(const targetC of [5,85])for(const conductanceWK of [.0005,.005])for(const program of ['constant','return'])for(const timeSeconds of [0,1,120,240,300])for(const s of M.airComparison({...q,initialVolumeMl,initialPressureKPa,initialC,targetC,conductanceWK,program,timeSeconds})){
  near(s.pressureVolumeJ,s.idealGasJ);near(s.firstLawResidualJ,0);near(s.heatJ-s.workJ,s.internalChangeJ);near(s.massG,s.amountMol*.02897*1000);near(s.densityGL*s.volumeMl/1000,s.massG);
  near(s.segments.reduce((a,b)=>a+b.heatJ,0),s.heatJ);near(s.segments.reduce((a,b)=>a+b.workJ,0),s.workJ);assert.ok(s.volumeMl>0&&s.volumeMl<90&&s.pressureKPa>0&&s.gasK>0);
 }
});
test('energy-rate and volume/pressure derivatives agree with finite differences away from jacket switches',()=>{
 for(const boundary of M.airBoundaries)for(const program of ['constant','return'])for(const timeSeconds of [30,180]){
  const p={...q,program,timeSeconds},s=M.airState(p,boundary),later=M.airState({...p,timeSeconds:timeSeconds+1e-4},boundary),earlier=M.airState({...p,timeSeconds:timeSeconds-1e-4},boundary);
  near((later.gasK-earlier.gasK)/2e-4,s.temperatureRateKs,1e-6);near((later.heatJ-earlier.heatJ)/2e-4,s.heatRateW,1e-6);near((later.volumeMl-earlier.volumeMl)/2e-4,s.volumeRateMlS,1e-6);near((later.pressureKPa-earlier.pressureKPa)/2e-4,s.pressureRateKPaS,1e-6);
 }
});
test('boundary work equals imposed pressure times signed volume change with correct kPa/mL conversion',()=>{
 for(const targetC of [5,65,85]){const a=M.airState({...q,targetC,timeSeconds:90});near(a.workJ,q.initialPressureKPa*a.volumeChangeMl/1000);const b=M.airState({...q,targetC,timeSeconds:90},'rigid');assert.equal(b.workJ,0);near(b.heatJ,b.internalChangeJ)}
});
test('rms speed is a molecular temperature reference, not the visible piston speed',()=>{
 const a=M.airState(q),b=M.airState({...q,timeSeconds:120});near(b.rmsSpeedMS/a.rmsSpeedMS,Math.sqrt(b.gasK/a.gasK));assert.ok(a.rmsSpeedMS>400&&a.rmsSpeedMS<600);assert.notEqual(b.rmsSpeedMS,b.volumeRateMlS);
});
test('elapsed histories stop at observed time and preserve amount through heating and cooling',()=>{
 const p={...q,program:'return',timeSeconds:180};for(const boundary of M.airBoundaries){const h=M.airHistory(p,boundary);assert.equal(h.length,61);near(h.at(-1).timeSeconds,180);for(const s of h){assert.ok(s.timeSeconds<=180);near(s.amountMol,h[0].amountMol)}assert.ok(h.at(-1).gasK<h[40].gasK)}
});
test('120second explanation includes100seconds of continuous heating and cooling',()=>{
 near(M.airGuide(10).timeSeconds,0);near(M.airGuide(60).timeSeconds,120);near(M.airGuide(110).timeSeconds,240);near(M.airGuide(120).timeSeconds,240);
 for(let t=0;t<=120;t++){const g=M.airGuide(t);assert.equal(g.samples.length,2);assert.ok(g.caption.length>40);for(const s of g.samples)near(s.firstLawResidualJ,0)}
});
test('malformed, nonfinite and unsupported preparations are rejected',()=>{
 for(const patch of [{initialVolumeMl:0},{initialPressureKPa:0},{initialC:-273.15},{targetC:100},{conductanceWK:0},{timeSeconds:301},{timeSeconds:NaN},{initialC:'25'},{program:'other'}])assert.throws(()=>M.airState({...q,...patch}),RangeError);
 assert.throws(()=>M.airState(q,'balloon'),RangeError);assert.throws(()=>M.airGuide(Infinity),RangeError);
});

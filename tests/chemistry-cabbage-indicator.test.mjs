import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/cabbageIndicator.ts'),q=M.defaultCabbageInputs;
const st=(x,sample='acid')=>M.cabbageState({...q,...x},sample),near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} vs ${b}`);
test('three reference samples keep their known pH and start without visible indicator',()=>{
 const p=M.cabbageComparison();assert.equal(p.acid.referencePH,3);assert.equal(p.neutral.referencePH,7);assert.equal(p.base.referencePH,10);
 for(const s of Object.values(p)){near(s.vesselMl,20);near(s.reservoirMl,.6);assert.equal(s.hasIndicator,false);near(s.opacity,0);assert.equal(s.observedColour,'No visible indicator colour')}
});
test('release and arrival are separate material events with a real falling interval',()=>{
 const f=st({}).flightS,before=st({timeS:2-1e-8}),released=st({timeS:2}),flying=st({timeS:2+f/2}),landed=st({timeS:2+f});
 assert.equal(before.releasedCount,0);assert.equal(released.releasedCount,1);assert.equal(released.arrivedCount,0);
 near(released.inFlightMl,.05);near(released.inFlight[0].heightAboveSurfaceCm,8);
 near(flying.inFlight[0].heightAboveSurfaceCm,6);assert.equal(landed.arrivedCount,1);assert.equal(landed.inFlight.length,0);near(landed.vesselMl,20.05);
});
test('every drop carries the specified liquid volume and pigment mass',()=>{
 const s=st({timeS:2.05});near(4*Math.PI*s.dropRadiusCm**3/3,s.dropMl);
 near(s.inFlight[0].pigmentMg,s.dropMl*q.pigmentMgMl);near(s.flightS,Math.sqrt(2*.08/9.81));
});
test('liquid and pigment close across all dosing corners and times',()=>{
 for(const sampleMl of[10,30])for(const doseMl of[0,.6,1.2])for(const drops of[6,12])
 for(const intervalS of[2,5])for(const pigmentMgMl of[0,1])for(const timeS of[0,2,2.05,10,30,57.05,65]){
  const s=st({sampleMl,doseMl,drops,intervalS,pigmentMgMl,timeS});near(s.liquidAccountedMl,sampleMl+doseMl);near(s.pigmentAccountedMg,doseMl*pigmentMgMl);
  assert.ok(s.reservoirMl>=0&&s.inFlightMl>=0&&s.vesselPigmentMg>=0&&s.opacity>=0&&s.opacity<=1);
 }
});
test('all permitted pulse programs finish before the declared observation endpoint',()=>{
 for(const drops of[6,12])for(const intervalS of[2,5]){const s=st({drops,intervalS,timeS:65});assert.equal(s.arrivedCount,drops);near(s.reservoirMl,0);near(s.inFlightMl,0);near(s.arrivedMl,.6)}
});
test('no-dose and pigment-free controls do not invent visible indicator colour',()=>{
 for(const x of[{doseMl:0},{pigmentMgMl:0}]){const s=st({...x,timeS:65});assert.equal(s.hasIndicator,false);near(s.opacity,0);assert.equal(s.observedColour,'No visible indicator colour')}
 const blank=st({doseMl:0,timeS:65});assert.equal(blank.releasedCount,0);assert.equal(blank.inFlight.length,0);
});
test('ideal reference pH implies matching hydrogen/hydroxide concentrations at25C',()=>{
 for(const sample of['acid','neutral','base']){const s=st({acidPH:6,basePH:8,timeS:65},sample);near(s.hMolL*s.ohMolL,1e-14,1e-25);near(-Math.log10(s.hMolL),s.referencePH)}
});
test('dose changes pigment concentration and drawing strength without pretending to infer pH',()=>{
 const a=st({doseMl:.3,timeS:65}),b=st({doseMl:1.2,timeS:65});near(a.referencePH,b.referencePH);assert.equal(a.colour.hex,b.colour.hex);assert.ok(b.concentrationMgMl>a.concentrationMgMl&&b.opacity>a.opacity);assert.match(a.interpretation,/not measured cabbage calibration/);
});
test('qualitative colour interpolation stays valid and distinct for the three default references',()=>{
 const p=M.cabbageComparison({...q,timeS:65});assert.equal(new Set(Object.values(p).map(s=>s.colour.hex)).size,3);
 for(let ph=2;ph<=12;ph+=.125){const c=M.cabbageColour(ph);assert.match(c.hex,/^#[0-9a-f]{6}$/);assert.ok(c.rgb.every(x=>Number.isInteger(x)&&x>=0&&x<=255))}
});
test('120second guide has setup/evolution/endpoint holds and all material accounted for',()=>{
 near(M.cabbageGuide(10).timeS,0);near(M.cabbageGuide(60).timeS,32.5);near(M.cabbageGuide(110).timeS,65);near(M.cabbageGuide(120).timeS,65);
 for(let t=0;t<=120;t++){const p=M.cabbageGuide(t);for(const key of['acid','neutral','base'])near(p[key].pigmentAccountedMg,.3)}
});
test('invalid, nonfinite or coerced dosing controls cannot become observations',()=>{
 for(const x of[{acidPH:1},{basePH:13},{sampleMl:9},{doseMl:-1},{doseMl:2},{drops:6.5},{drops:13},{intervalS:1},{pigmentMgMl:2},{timeS:66},{timeS:NaN},{sampleMl:'20'}])assert.throws(()=>st(x),RangeError);
 assert.throws(()=>st({},'other'),RangeError);assert.throws(()=>M.cabbageGuide(Infinity),RangeError);assert.throws(()=>M.cabbageColour(13),RangeError);
});

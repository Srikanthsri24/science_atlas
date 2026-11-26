import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/invertedCup.ts'),q=M.defaultCupInputs,C=M.cupReference;
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('both cups begin at the original free surface without invented water intrusion or displacement',()=>{
 for(const s of M.cupComparison(q)){assert.equal(s.insertionCm,0);assert.equal(s.surfaceCm,0);assert.equal(s.waterInsideMl,0);near(s.gasVolumeMl,s.initialGasMl);near(s.gasPressureKPa,q.atmosphericKPa);near(s.amountMol,s.initialAmountMol);near(s.totalWaterMl,s.initialWaterMl);assert.equal(s.airOutMol,0);assert.equal(s.airInMol,0)}
});
test('a vertical trapped cup compresses isothermal air rather than excluding every drop of water',()=>{
 const s=M.cupState({...q,timeSeconds:50});assert.ok(s.waterHeightCm>0&&s.waterHeightCm<.5);assert.ok(s.gasPressureKPa>q.atmosphericKPa);assert.ok(s.gasVolumeMl<s.initialGasMl);near(s.pressureVolumeJ,q.atmosphericKPa*s.initialGasMl/1000);near(s.gasPressureKPa,s.hydrostaticInterfaceKPa);assert.ok(s.interfaceY<s.surfaceCm);near(s.amountMol,s.initialAmountMol);
});
test('a partially immersed atmospheric vent matches inside and outside water levels while changing air amount',()=>{
 const p={...q,timeSeconds:4},a=M.cupState(p,'trapped'),b=M.cupState(p,'vented');assert.ok(b.gasPresent);near(b.interfaceY,b.surfaceCm);near(b.gasPressureKPa,q.atmosphericKPa);assert.ok(b.amountMol<b.initialAmountMol);assert.ok(b.waterInsideMl>a.waterInsideMl);assert.ok(b.surfaceCm<a.surfaceCm);
 const ann=b.outerAreaCm2-b.innerAreaCm2;near(b.surfaceCm,ann*b.insertionCm/(b.basinAreaCm2-ann));
});
test('a flooded vented cavity has no fictitious gas-pressure reading',()=>{
 const s=M.cupState({...q,timeSeconds:50},'vented');assert.equal(s.gasPresent,false);assert.equal(s.gasVolumeMl,0);assert.equal(s.amountMol,0);assert.equal(s.gasPressureKPa,null);assert.equal(s.pressureVolumeJ,null);assert.equal(s.hydrostaticInterfaceKPa,null);near(s.waterInsideMl,s.initialGasMl);assert.ok(s.waterAtRoofKPa>q.atmosphericKPa);assert.equal(s.outwardFlowMolS,0);
});
test('fully submerged vented displacement is only the submerged glass, not a nonexistent gas pocket',()=>{
 const s=M.cupState({...q,timeSeconds:50},'vented'),glass=(s.outerAreaCm2-s.innerAreaCm2)*q.cupHeightCm+s.outerAreaCm2*C.capThicknessCm;near(s.displacedMl,glass);near(s.surfaceCm,glass/s.basinAreaCm2);assert.equal(s.submergedGasMl,0);
});
test('an independent air-intrusion root reproduces the coupled finite-basin sealed equilibrium',()=>{
 const s=M.cupState({...q,timeSeconds:50}),H=q.cupHeightCm,Vo=s.outerAreaCm2*(H+C.capThicknessCm),B=s.basinAreaCm2,A=s.innerAreaCm2,k=1000*9.81/100000;
 let lo=0,hi=H*(1-1e-12);for(let i=0;i<80;i++){const x=(lo+hi)/2,S=(Vo-A*x)/B,f=q.atmosphericKPa*H/(H-x)-q.atmosphericKPa-k*(q.maximumInsertionCm+S-x);if(f>0)hi=x;else lo=x}const x=(lo+hi)/2;
 near(s.waterHeightCm,x);near(s.surfaceCm,(Vo-A*x)/B);near(s.gasPressureKPa,q.atmosphericKPa+k*(q.maximumInsertionCm+s.surfaceCm-x));
});
test('water, displaced volume, gas and hydrostatic balances close across all preparation corners',()=>{
 for(const cupRadiusCm of [2,3])for(const cupHeightCm of [6,12])for(const basinRadiusCm of [7,10])for(const maximumInsertionCm of [0,30])for(const atmosphericKPa of [80,120])for(const temperatureC of [15,35])for(const timeSeconds of [0,25,50,90,115,140,160])for(const s of M.cupComparison({...q,cupRadiusCm,cupHeightCm,basinRadiusCm,maximumInsertionCm,atmosphericKPa,temperatureC,timeSeconds})){
  near(s.totalWaterMl,s.initialWaterMl);near(s.basinAreaCm2*s.surfaceCm,s.displacedMl);near(s.displacedMl,s.submergedWallMl+s.submergedCapMl+s.submergedGasMl);near(s.surfaceResidualMl,0,1e-9);near(s.airInventoryResidualMol,0);
  if(s.gasPresent){near(s.pressureVolumeJ,s.idealGasJ);near(s.gasPressureKPa,s.hydrostaticInterfaceKPa)}
  assert.ok(s.surfaceCm>=0&&s.surfaceCm<C.basinTopY);assert.ok(s.waterInsideMl>=0&&s.outsideWaterMl>0);assert.ok(s.waterHeightCm>=0&&s.waterHeightCm<=cupHeightCm);assert.ok(s.gasVolumeMl>=0);assert.ok(s.rimY>-C.waterDepthCm);assert.ok(s.surfaceCm<C.ventOutletY);
 }
});
test('vented flooding transition is continuous even though gas presence and pressure applicability change',()=>{
 const s=M.cupAtInsertion(q,'vented',0),ann=s.outerAreaCm2-s.innerAreaCm2,critical=q.cupHeightCm*(s.basinAreaCm2-ann)/s.basinAreaCm2;
 const a=M.cupAtInsertion(q,'vented',critical-1e-7),b=M.cupAtInsertion(q,'vented',critical+1e-7);assert.ok(a.gasPresent);assert.equal(b.gasPresent,false);near(a.surfaceCm,b.surfaceCm,1e-6);near(a.waterInsideMl,b.waterInsideMl,1e-6);
});
test('gas leaving and reentering the vent is retained as a proper open-system inventory',()=>{
 const down=M.cupState({...q,timeSeconds:25},'vented'),hold=M.cupState({...q,timeSeconds:50},'vented'),back=M.cupState({...q,timeSeconds:160},'vented');assert.ok(down.airOutMol>0&&down.airInMol===0);near(hold.airOutMol,hold.initialAmountMol);near(back.airOutMol,back.initialAmountMol);near(back.airInMol,back.initialAmountMol);near(back.amountMol,back.initialAmountMol);near(back.airInventoryResidualMol,0);assert.equal(back.waterInsideMl,0);
 for(const t of [0,25,50,115,160]){const s=M.cupState({...q,timeSeconds:t});assert.equal(s.airOutMol,0);assert.equal(s.airInMol,0);near(s.amountMol,s.initialAmountMol)}
});
test('contact history does not make a previously reached marker instantly dry on withdrawal',()=>{
 const start=M.cupState(q,'vented'),deep=M.cupState({...q,timeSeconds:50},'vented'),back=M.cupState({...q,timeSeconds:160},'vented');assert.equal(start.markerEverContacted,false);assert.equal(deep.markerContactNow,true);assert.equal(back.markerContactNow,false);assert.equal(back.markerEverContacted,true);
 assert.equal(M.cupState({...q,timeSeconds:160},'trapped').markerEverContacted,false);
});
test('the quasistatic vertical cycle has continuous positions and no insertion for the stationary control',()=>{
 near(M.cupMotion({...q,timeSeconds:50}).insertionCm,25);near(M.cupMotion({...q,timeSeconds:90}).insertionCm,25);near(M.cupMotion({...q,timeSeconds:140}).insertionCm,0);
 for(const t of [50,90,140]){const a=M.cupMotion({...q,timeSeconds:t-1e-7}),b=M.cupMotion({...q,timeSeconds:t+1e-7});near(a.insertionCm,b.insertionCm,1e-6)}
 for(const timeSeconds of [0,25,50,115,160])for(const s of M.cupComparison({...q,maximumInsertionCm:0,timeSeconds})){assert.equal(s.insertionCm,0);assert.equal(s.waterInsideMl,0);assert.equal(s.airOutMol,0);assert.equal(s.airInMol,0);assert.equal(s.outwardFlowMolS,0)}
});
test('vent flow agrees with the derivative of retained air during partial immersion and withdrawal',()=>{
 for(const timeSeconds of [4,138]){const p={...q,timeSeconds},s=M.cupState(p,'vented'),a=M.cupState({...p,timeSeconds:timeSeconds-1e-4},'vented'),b=M.cupState({...p,timeSeconds:timeSeconds+1e-4},'vented');near(-(b.amountMol-a.amountMol)/2e-4,s.outwardFlowMolS,1e-9);assert.equal(Math.sign(s.outwardFlowMolS),timeSeconds===4?1:-1)}
});
test('elapsed history exposes no future displacement or air/contact history',()=>{
 const h=M.cupHistory({...q,timeSeconds:30},'vented');assert.equal(h.length,61);near(h.at(-1).timeSeconds,30);for(let i=1;i<h.length;i++){assert.ok(h[i].timeSeconds<=30);assert.ok(h[i].airOutMol>=h[i-1].airOutMol);near(h[i].totalWaterMl,h[0].totalWaterMl)}
});
test('120second guide includes62.5seconds of actual cup motion and synchronized hold/return stages',()=>{
 near(M.cupGuide(10).timeSeconds,0);near(M.cupGuide(41.25).timeSeconds,50);near(M.cupGuide(66.25).timeSeconds,90);near(M.cupGuide(97.5).timeSeconds,140);near(M.cupGuide(110).timeSeconds,160);near(M.cupGuide(120).timeSeconds,160);
 for(let t=0;t<=120;t++){const g=M.cupGuide(t);assert.equal(g.samples.length,2);assert.ok(g.caption.length>40);for(const s of g.samples)near(s.totalWaterMl,s.initialWaterMl)}
});
test('invalid, nonfinite and coerced preparations cannot become model observations',()=>{
 for(const patch of [{cupRadiusCm:0},{cupHeightCm:20},{basinRadiusCm:3},{maximumInsertionCm:40},{atmosphericKPa:0},{temperatureC:0},{timeSeconds:161},{timeSeconds:NaN},{cupHeightCm:'10'}])assert.throws(()=>M.cupState({...q,...patch}),RangeError);
 assert.throws(()=>M.cupState(q,'tilted'),RangeError);assert.throws(()=>M.cupAtInsertion(q,'trapped',-1),RangeError);assert.throws(()=>M.cupGuide(Infinity),RangeError);
});

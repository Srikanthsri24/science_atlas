import{writeFileSync}from'node:fs';import{loadTs}from'../../tests/load-ts.mjs';
const m=await loadTs('src/lib/chemistry/ionicPhaseComparison.ts');const cases=[];
for(const phase of ['solid','solution','water'])for(const sampleId of ['kcl001','kcl01','kcl1'])for(const gapCm of [.5,3])for(const widthCm of [.5,2])for(const immersedDepthCm of [0,1,3])for(const voltageRmsV of [0,.005,.1])for(const connected of [false,true])for(const phaseCycle of [0,.13,.25,.5,.75]){
 const q={phase,cell:{sampleId,gapCm,widthCm,immersedDepthCm,voltageRmsV,connected,phaseCycle}},s=m.ionicPhaseState(q);
 const keys=['appliedVoltageRmsV','instantVoltageV','currentRmsA','instantCurrentA','meanPowerW','positiveIonDirection','negativeIonDirection','externalElectronDirection','assignedSolutionConductivitySM','reconstructedConductivitySM','measuredConductanceS','solidConductivitySM','readingAvailable'];
 cases.push({inputs:q,actual:Object.fromEntries(keys.map(k=>[k,s[k]]))});
}
writeFileSync('reports/chemistry-expansion/CL-0120/core-reference-fixtures.json',JSON.stringify(cases));console.log(cases.length,'circuits exported');

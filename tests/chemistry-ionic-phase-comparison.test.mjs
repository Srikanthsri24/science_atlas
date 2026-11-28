import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';
const m = await loadTs('src/lib/chemistry/ionicPhaseComparison.ts');
test('solid has pre-existing immobile ions, applied voltage and no fabricated solid conductivity', () => {
 const s=m.ionicPhaseState(m.defaultIonicPhase);
 assert.equal(s.appliedVoltageRmsV,.05); assert.ok(s.instantVoltageV>0);
 for(const k of ['currentRmsA','instantCurrentA','positiveIonDirection','negativeIonDirection','externalElectronDirection']) assert.equal(s[k],0);
 assert.equal(s.solidConductivitySM,null); assert.equal(s.reconstructedConductivitySM,null); assert.equal(s.readingAvailable,false);
});
test('aqueous reference retains quantitative KCl result and reverses ionic drift',()=>{
 for(const phaseCycle of [.25,.75]){
 const s=m.ionicPhaseState({...m.defaultIonicPhase,phase:'solution',cell:{...m.defaultIonicPhase.cell,phaseCycle}});
 assert.ok(Math.abs(s.currentRmsA-70.4115e-6)<1e-18);
 assert.equal(s.positiveIonDirection,phaseCycle===.25?1:-1);assert.equal(s.negativeIonDirection,-s.positiveIonDirection);
 assert.ok(Math.abs(s.reconstructedConductivitySM-.140823)<1e-15);
 }
});
test('water comparison is a tiny positive current, not a false zero',()=>{
 const s=m.ionicPhaseState({...m.defaultIonicPhase,phase:'water'});
 assert.ok(s.currentRmsA>0);assert.ok(Math.abs(s.currentRmsA-2.75e-9)<1e-22);
 assert.equal(s.assignedSolutionConductivitySM,5.5e-6);
});
test('source and immersion controls preserve unavailable inverse readings for both aqueous modes',()=>{
 for(const phase of ['solution','water'])for(const control of [{connected:false},{immersedDepthCm:0},{voltageRmsV:0}]){
 const s=m.ionicPhaseState({...m.defaultIonicPhase,phase,cell:{...m.defaultIonicPhase.cell,...control}});
 assert.equal(s.currentRmsA,0);assert.equal(s.reconstructedConductivitySM,null);
 if(control.immersedDepthCm===0)assert.equal(s.appliedVoltageRmsV,.05);
 }
});
test('dissolution storyboard never interpolates a made-up conductivity or marks an early snapshot verified',()=>{
 for(const t of [0,20,45,55,64.999,65,99,100,124,125,139.9,140,150]){
 const g=m.ionicPhaseGuide(t,m.defaultIonicPhase);assert.equal(g.recordable,t>=140);
 assert.ok(g.dissolutionIllustration>=0&&g.dissolutionIllustration<=1);
 const s=m.ionicPhaseState(g.inputs);
 if(t<65){assert.equal(s.currentRmsA,0);assert.equal(s.assignedSolutionConductivitySM,null)}
 }
});
test('invalid phases, non-KCl pairings and guide times are rejected',()=>{
 for(const q of [null,[],{}, {...m.defaultIonicPhase,phase:'molten'},{...m.defaultIonicPhase,cell:{...m.defaultIonicPhase.cell,sampleId:'water'}}])assert.throws(()=>m.validateIonicPhase(q));
 for(const t of [-1,151,NaN])assert.throws(()=>m.ionicPhaseGuide(t,m.defaultIonicPhase));
});

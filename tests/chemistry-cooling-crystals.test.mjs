import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTs} from './load-ts.mjs';
const M = await loadTs('src/lib/chemistry/coolingCrystalGrowth.ts');
const defaults = M.defaultCoolingCrystalInputs;
const near = (a,b,e=1e-8) => assert.ok(Math.abs(a-b)<e, `${a} versus ${b}`);

test('cooling reference uses grams per 100 g water at the four audited temperatures', () => {
  for(const [t,s] of [[20,31.6],[40,63.9],[60,110],[80,169]]) near(M.coolingSolubility(t),s);
  near(M.coolingSolubility(30),47.75);
  near(M.coolingSolubility(50),86.95);
  near(M.coolingSolubility(70),139.5);
});
test('all permitted hot preparations fit the initial capacity without pre-existing crystals', () => {
  for(const waterG of [50,100]) for(const saltG of [40,80]) {
    const s=M.coolingCrystalState({...defaults,waterG,saltG});
    assert.ok(s.capacityG>=saltG);
    near(s.crystalG,0); near(s.sites,0); near(s.dissolvedG,saltG);
    near(s.areaCm2,0); near(s.meanEquivalentRadiusCm,0);
  }
});
test('equal elapsed time is not misrepresented as equal temperature', () => {
  const p=M.coolingCrystalPair({...defaults,timeS:120});
  near(p.fast.temperatureC,20); near(p.slow.temperatureC,68);
  near(p.slow.crystalG,0); assert.ok(p.fast.crystalG>0);
  const matched=M.coolingCrystalPair({...defaults,timeS:600});
  near(matched.fast.temperatureC,20); near(matched.slow.temperatureC,20);
});
test('reference ensemble develops more smaller effective sites under default fast cooling', () => {
  const {fast,slow}=M.coolingCrystalPair({...defaults,timeS:1200});
  assert.ok(fast.sites>slow.sites);
  assert.ok(fast.meanEquivalentRadiusCm<slow.meanEquivalentRadiusCm);
  near(fast.crystalG,48.4,1e-7); near(slow.crystalG,48.4,1e-7);
  near(fast.wholeMassG,slow.wholeMassG);
});
test('nucleus mass is included in solid inventory and equivalent size reconstructs the mass', () => {
  for(const timeS of [90,120,150,600,1200]) {
    const s=M.coolingCrystalState({...defaults,timeS});
    assert.ok(s.crystalG>=s.sites*M.coolingCrystalReference.nucleusMassG-1e-10);
    near(s.nucleusMassG+s.surfaceGrowthMassG,s.crystalG);
    near(s.nucleusRateGS+s.growthRateGS,s.totalCrystalRateGS);
    if(s.sites>0) {
      near(s.meanCrystalMassG*s.sites,s.crystalG);
      near(4*Math.PI/3*s.meanEquivalentRadiusCm**3*s.sites*2.109,s.crystalG);
      near(4*Math.PI*s.meanEquivalentRadiusCm**2*s.sites,s.areaCm2);
    }
  }
});
test('halving the production step changes final mass, population and radius by less than 0.5 percent across 64 corners', () => {
  for(const waterG of [50,100]) for(const saltG of [40,80])
    for(const growthFluxGcm2s of [.005,.05]) for(const nucleationPerS of [.2,5])
      for(const threshold of [.02,.2]) for(const duration of [60,1200]) {
        const q={...defaults,waterG,saltG,growthFluxGcm2s,nucleationPerS,threshold,timeS:2400};
        const a=M.simulateCoolingCrystals(q,duration,.05),b=M.simulateCoolingCrystals(q,duration,.025);
        for(const key of ['crystalG','sites','meanEquivalentRadiusCm'])
          assert.ok(Math.abs(a[key]-b[key])<=.005*Math.max(1e-6,Math.abs(b[key])),`${key}: ${a[key]} vs ${b[key]}`);
      }
});
test('positive cooling integration conserves both materials across preparation and kinetic corners', () => {
  for(const waterG of [50,100]) for(const saltG of [40,80])
    for(const growthFluxGcm2s of [.005,.05]) for(const nucleationPerS of [.2,5]) {
      let previous=0;
      for(const timeS of [0,60,120,600,1200,2400]) {
        const s=M.coolingCrystalState({...defaults,waterG,saltG,growthFluxGcm2s,nucleationPerS,timeS});
        near(s.dissolvedG+s.crystalG,saltG); near(s.waterRetainedG,waterG);
        near(s.wholeMassG,waterG+saltG);
        assert.ok(s.crystalG>=previous-1e-10 && s.crystalG>=0 && s.dissolvedG>=0);
        assert.ok(s.crystalG<=s.equilibriumCrystalG+1e-8);
        assert.ok(Number.isFinite(s.areaCm2) && s.sites>=0);
        previous=s.crystalG;
      }
    }
});
test('fractional-time cached states agree with direct positive integration', () => {
  for(const program of ['fast','slow']) for(const timeS of [0,.013,90.027,120.123,600.031,2400]) {
    const q={...defaults,timeS},cached=M.coolingCrystalState(q,program);
    const direct=M.simulateCoolingCrystals(q,program==='fast'?120:600);
    near(cached.crystalG,direct.crystalG,1e-7);
    near(cached.sites,direct.sites,1e-7);
  }
});
test('guide contains 120 seconds with preparation and final holds', () => {
  near(M.coolingCrystalGuide(0).timeS,0);
  near(M.coolingCrystalGuide(10).timeS,0);
  near(M.coolingCrystalGuide(60).timeS,600);
  near(M.coolingCrystalGuide(110).timeS,1200);
  near(M.coolingCrystalGuide(120).timeS,1200);
  near(M.coolingCrystalGuide(999).presentationS,120);
});
test('invalid physical inputs and solver settings cannot become results', () => {
  for(const change of [{waterG:49},{saltG:81},{fastCoolingS:59},{slowMultiplier:6},
    {growthFluxGcm2s:0},{nucleationPerS:0},{threshold:-.1},{timeS:-1},{timeS:2401},
    {waterG:'100'},{timeS:NaN}]) assert.throws(()=>M.coolingCrystalState({...defaults,...change}),RangeError);
  assert.throws(()=>M.coolingCrystalState(defaults,'other'),RangeError);
  for(const step of [0,-1,Infinity,3]) assert.throws(()=>M.simulateCoolingCrystals(defaults,120,step),RangeError);
  for(const duration of [0,59,1201,NaN]) assert.throws(()=>M.simulateCoolingCrystals(defaults,duration),RangeError);
  for(const t of [19,81,NaN]) assert.throws(()=>M.coolingSolubility(t),RangeError);
  assert.throws(()=>M.coolingCrystalGuide(Infinity),RangeError);
});

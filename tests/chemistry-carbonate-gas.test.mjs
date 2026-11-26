import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/carbonateGas.ts'),q=M.defaultCarbonateGasInputs;
const state=x=>M.carbonateGasState({...q,...x}),near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,`${a} vs ${b}`);
test('default preparation is acid limited with one CO2 per carbonate and two HCl',()=>{
 const s=state({timeS:300});near(s.acidMol,.004);near(s.maximumExtentMol,.002);assert.equal(s.limitingReagent,'acid');
 near(s.acidMol-s.acidLeftMol,2*s.extentMol);near(s.carbonateMol-s.carbonateLeftMol,s.extentMol);
 near(s.co2G,s.extentMol*44.009);assert.ok(s.carbonateLeftG>0);
});
test('initial reacting contents and trapped air are explicitly separate inventories',()=>{
 const s=state({});near(s.syringeMl,0);near(s.extentMol,0);near(s.co2MoleFraction,0);
 near(s.contentsG,20.3);near(s.deadSpaceAirMol,s.initialAirMol);near(s.syringeAirMol,0);
});
test('all material budgets close across preparation corners and finite times',()=>{
 for(const carbonateG of[0,.1,.5])for(const acidMl of[10,30])for(const acidMolL of[0,.05,.3])for(const timeS of[0,1,100,600]){
  const s=state({carbonateG,acidMl,acidMolL,timeS});near(s.contentsG,s.initialContentsG);
  near(s.condensedContentsG+s.co2G,s.initialContentsG);assert.ok(s.carbonateLeftG>=0&&s.hclLeftG>=0&&s.initialWaterG>=0);
  near(s.syringeCo2Mol+s.deadSpaceCo2Mol,s.extentMol);near(s.syringeAirMol+s.deadSpaceAirMol,s.initialAirMol);
 }
});
test('syringe expansion follows PV=nRT but collected mixture is not pure CO2',()=>{
 const s=state({timeS:150});near((s.syringeMl+s.liberatedSolidVolumeMl)/1000*q.pressureKPa,s.extentMol*8.314462618*(25+273.15));
 assert.ok(s.syringeCo2Mol<s.extentMol);assert.ok(s.co2MoleFraction>0&&s.co2MoleFraction<1);
 near((s.syringeCo2Mol+s.syringeAirMol)*s.molarVolumeMl,s.syringeMl);
});
test('empty carbonate or zero acid produces no bubbles, gas or products',()=>{
 for(const blank of[{carbonateG:0},{acidMolL:0}]){const s=state({...blank,timeS:600});near(s.extentMol,0);near(s.syringeMl,0);near(s.syringeRateMlS,0);assert.equal(s.limitingReagent,'no reaction')}
});
test('carbonate limiting and matched stoichiometric preparations are distinguished',()=>{
 assert.equal(state({carbonateG:.1,acidMolL:.3}).limitingReagent,'carbonate');
 assert.equal(state({carbonateG:.002*100.086}).limitingReagent,'stoichiometric');
});
test('temperature and pressure change ideal volume without changing extent or yield',()=>{
 const a=state({timeS:200,temperatureC:20,pressureKPa:110}),b=state({timeS:200,temperatureC:35,pressureKPa:90});
 near(a.extentMol,b.extentMol);near(b.gasEquivalentMl/a.gasEquivalentMl,(308.15/293.15)*(110/90));
});
test('all maximum gas yields fit the declared free piston travel',()=>{
 for(const temperatureC of[20,35])for(const pressureKPa of[90,110]){
  const s=state({carbonateG:.5,acidMl:30,acidMolL:.3,temperatureC,pressureKPa,timeS:600});assert.ok(s.maximumSyringeMl<200);assert.equal(s.syringeWithinCapacity,true);
 }
});
test('chosen extent law has correct instantaneous derivative and finite tail',()=>{
 const h=.0001,t=120,s=state({timeS:t}),lo=state({timeS:t-h}),hi=state({timeS:t+h});
 near((hi.extentMol-lo.extentMol)/(2*h),s.extentRateMolS,1e-11);near((hi.syringeMl-lo.syringeMl)/(2*h),s.syringeRateMlS,1e-7);
 assert.ok(state({timeS:600}).acidLeftMol>0);assert.ok(state({timeS:600}).extentMol<.002);
});
test('120-second guide includes setup, evolution and final hold',()=>{
 near(M.carbonateGasGuide(10).timeS,0);near(M.carbonateGasGuide(60).timeS,150);near(M.carbonateGasGuide(110).timeS,300);near(M.carbonateGasGuide(120).timeS,300);
});
test('invalid or coerced controls cannot produce measurements',()=>{
 for(const bad of[{carbonateG:-1},{carbonateG:.6},{acidMl:9},{acidMolL:.4},{temperatureC:36},{pressureKPa:89},{rateSInv:0},{timeS:601},{timeS:NaN},{acidMl:'20'}])assert.throws(()=>state(bad),RangeError);
 assert.throws(()=>M.carbonateGasGuide(Infinity),RangeError);
});

test('released solid displacement changes dead space and reduces piston expansion',()=>{const a=state({timeS:0}),b=state({timeS:300});near(b.deadSpaceMl-a.deadSpaceMl,b.liberatedSolidVolumeMl);near(b.syringeMl+b.liberatedSolidVolumeMl,b.gasEquivalentMl);near(b.deadSpaceMl+b.syringeMl,b.totalGasVolumeMl);near(a.initialDeadSpaceMl,150+5-20-.3/2.71)});

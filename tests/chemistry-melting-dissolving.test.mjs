import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/meltingDissolving.ts');
test('separate melting and dissolving vessels conserve their own matter at all supported boundaries',()=>{
 for(const m of[5,10,20])for(const w of[20,100,150])for(const H of[0,.1,.3,.4])for(const stir of[false,true])for(const t of[0,1,60,300,600,900]){const s=M.meltingDissolvingState(m,w,H,stir,t);assert.ok(Math.abs(s.meltWaterAccountedG-m)<1e-12);assert.ok(Math.abs(s.dissolvingMatterAccountedG-w-m)<1e-12);assert.ok(s.waterC>=0&&s.waterC<25);assert.ok(s.dissolvedG>=0&&s.dissolvedG<=Math.min(m,.36*w));assert.ok(s.iceG>=0&&s.moltenG>=0&&s.saltSolidG>=0);assert.ok(Math.abs(s.inputHeatJ-s.latentJ-s.sensibleJ)<1e-9)}});
test('independent power/latent substitution gives the phase plateau and continuous full-melt boundary',()=>{
 const tm=10*333.5/(.3*25),a=M.meltingDissolvingState(10,100,.3,true,tm-1e-5),b=M.meltingDissolvingState(10,100,.3,true,tm),c=M.meltingDissolvingState(10,100,.3,true,tm+1e-5);assert.ok(a.iceG>0);assert.equal(a.waterC,0);assert.ok(Math.abs(b.moltenG-10)<1e-12);assert.equal(b.waterC,0);assert.ok(c.waterC>0&&c.waterC<.00001);assert.ok(Math.abs(b.inputHeatJ-3335)<1e-9);assert.ok(Math.abs(a.inputHeatJ-b.inputHeatJ)<.001);assert.ok(Math.abs(c.inputHeatJ-b.inputHeatJ)<.001);
});
test('independent numerical enthalpy integration checks heat flow across the latent plateau and liquid warming',()=>{
 for(const[m,H]of[[5,.4],[10,.3],[20,.4]]){const dt=.02,L=m*333.5,cp=m*4.18;let E=0;const f=e=>H*(25-Math.max(0,e-L)/cp);for(let i=0;i<45000;i++){let k1=f(E),k2=f(E+dt*k1/2),k3=f(E+dt*k2/2),k4=f(E+dt*k3);E+=dt*(k1+2*k2+2*k3+k4)/6}const s=M.meltingDissolvingState(m,100,H,true,900);assert.ok(Math.abs(s.inputHeatJ-E)<.0001);assert.ok(Math.abs(s.waterC-Math.max(0,E-L)/cp)<.00001)}
});
test('no supplied heat does not stop a separate salt solution from forming',()=>{
 const s=M.meltingDissolvingState(10,100,0,true,900);assert.equal(s.iceG,10);assert.equal(s.moltenG,0);assert.equal(s.meltEndS,null);assert.equal(s.inputHeatJ,0);assert.equal(s.waterC,0);assert.ok(s.dissolvedG>9.99);assert.match(M.meltingDissolvingWorked(10,100,0,true,900),/no supplied heat/)
});
test('stirring changes rate without changing equilibrium capacity or residual; water and solution denominators differ',()=>{
 const a=M.meltingDissolvingState(20,20,.3,false,300),b=M.meltingDissolvingState(20,20,.3,true,300);assert.equal(a.capacityG,7.2);assert.equal(a.targetDissolvedG,b.targetDissolvedG);assert.equal(a.eventualResidualG,12.8);assert.equal(a.eventualResidualG,b.eventualResidualG);assert.ok(b.dissolvedG>a.dissolvedG);assert.ok(a.saltGPer100GWater>a.solutionSaltMassPercent);assert.ok(Math.abs(b.saltSolidG-(20-7.2*(1-Math.exp(-.012*300))))<1e-12);assert.match(M.meltingDissolvingWorked(20,20,.3,true,300),/mass percent of SOLUTION/)
});
test('independent dissolved-mass numerical integration agrees with analytic values without finite-time disappearance',()=>{
 for(const stir of[false,true]){let d=0,dt=.02,k=stir?.012:.004,target=7.2;for(let i=0;i<15000;i++){let f=x=>k*(target-x),a=f(d),b=f(d+dt*a/2),c=f(d+dt*b/2),e=f(d+dt*c);d+=dt*(a+2*b+2*c+e)/6}let s=M.meltingDissolvingState(20,20,.3,stir,300);assert.ok(Math.abs(d-s.dissolvedG)<1e-11);assert.ok(s.saltSolidG>s.eventualResidualG);assert.ok(Math.abs(s.saltSolidVolumeCm3*2.16-s.saltSolidG)<1e-12)}
});
test('110-second guide advances900 model seconds and invalid numeric or categorical settings are rejected',()=>{
 assert.equal(M.meltingDissolvingGuide(0).timeS,0);assert.equal(M.meltingDissolvingGuide(10).timeS,0);assert.equal(M.meltingDissolvingGuide(50).timeS,450);assert.equal(M.meltingDissolvingGuide(90).timeS,900);assert.equal(M.meltingDissolvingGuide(110).timeS,900);for(const a of[[4,100,.3,true,0],[21,100,.3,true,0],[10,19,.3,true,0],[10,151,.3,true,0],[10,100,-1,true,0],[10,100,.5,true,0],[10,100,.3,1,0],[10,100,.3,true,-1],[10,100,.3,true,901],[NaN,100,.3,true,0],[10,Infinity,.3,true,0]])assert.throws(()=>M.meltingDissolvingState(...a),RangeError);for(const t of[-1,111,NaN])assert.throws(()=>M.meltingDissolvingGuide(t),RangeError)
});

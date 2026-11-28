import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const m=await loadTs('src/lib/chemistry/ionicPhaseGeometry.ts'),c=await loadTs('src/lib/chemistry/ionicPhaseComparison.ts');
const q=c.defaultIonicPhase;
test('solid lattice is balanced, stable under phase change and has opposite nearest neighbours',()=>{
 const a=m.ionicPhaseGeometry(q),b=m.ionicPhaseGeometry({...q,cell:{...q.cell,phaseCycle:.75}});
 assert.equal(a.ions.length,24);assert.equal(a.ions.reduce((n,x)=>n+x.sign,0),0);
 assert.deepEqual(a.ions,b.ions);assert.ok(a.links.length>0);
 for(const link of a.links){const ids=link.id.split('/'),ends=ids.map(id=>a.ions.find(i=>i.id===id));assert.equal(ends[0].sign,-ends[1].sign)}
});
test('dissolution retains identities and never changes the solid circuit reading',()=>{
 const start=m.ionicPhaseGeometry(q,0),middle=m.ionicPhaseGeometry(q,.5),end=m.ionicPhaseGeometry(q,1);
 assert.deepEqual(start.ions.map(x=>x.id),end.ions.map(x=>x.id));
 for(let i=0;i<24;i++)for(let k=0;k<3;k++){assert.equal(start.ions[i].position[k],start.ions[i].lattice[k]);assert.equal(end.ions[i].position[k],end.ions[i].dispersed[k]);assert.ok(Math.abs(middle.ions[i].position[k]-(start.ions[i].position[k]+end.ions[i].position[k])/2)<1e-14)}
 assert.equal(end.state.currentRmsA,0);assert.equal(end.state.reconstructedConductivitySM,null);assert.equal(end.activeDrift,false);
});
test('hydration oxygen points inward for K+, hydrogen side points inward for chloride',()=>{
 const g=m.ionicPhaseGeometry({...q,phase:'solution'});
 for(const ion of g.ions)for(const w of ion.hydration){
  const radial=w.oxygen.map((v,k)=>v-ion.position[k]);const midpoint=w.hydrogens[0].map((v,k)=>(v+w.hydrogens[1][k])/2-w.oxygen[k]);
  const dot=radial.reduce((n,v,k)=>n+v*midpoint[k],0);assert.equal(Math.sign(dot),ion.sign);
 }
});
test('solution drift reverses; unavailable controls stop it without deleting ions',()=>{
 for(const phaseCycle of [.25,.75]){const g=m.ionicPhaseGeometry({...q,phase:'solution',cell:{...q.cell,phaseCycle}});for(const ion of g.ions)assert.equal(ion.velocityDirection,ion.sign*(phaseCycle===.25?1:-1))}
 for(const change of [{connected:false},{immersedDepthCm:0},{voltageRmsV:0}]){const g=m.ionicPhaseGeometry({...q,phase:'solution',cell:{...q.cell,...change}});assert.equal(g.ions.length,24);assert.equal(g.activeDrift,false);assert.ok(g.ions.every(i=>i.velocityDirection===0))}
});
test('normalized solid waveform keeps voltage while showing zero transport current',()=>{
 const g=m.ionicPhaseGeometry(q);assert.ok(g.waveform.some(p=>p.voltage!==0));assert.ok(g.waveform.every(p=>p.current===0));
 const w=m.ionicPhaseGeometry({...q,phase:'water'});assert.equal(w.ions.length,0);assert.ok(w.waveform.some(p=>p.current!==0));
});
test('all illustrative particles and water molecules fit declared bounds; paused calls are deterministic',()=>{
 for(const phase of ['solid','solution','water'])for(const phaseCycle of [0,.25,.5,.75,1]){
 const input={...q,phase,cell:{...q.cell,phaseCycle}},g=m.ionicPhaseGeometry(input);assert.deepEqual(g,m.ionicPhaseGeometry(input));
 for(const ion of g.ions)for(const p of [ion.position,...ion.hydration.flatMap(w=>[w.oxygen,...w.hydrogens])])for(let k=0;k<3;k++)assert.ok(p[k]>=g.limits.min[k]&&p[k]<=g.limits.max[k]);
 }
 for(const x of [-1,1.01,NaN])assert.throws(()=>m.ionicPhaseGeometry(q,x));
});
test('schematic water geometry retains bent molecular shape and equal display bonds',()=>{
 const g=m.ionicPhaseGeometry({...q,phase:'solution'});
 for(const ion of g.ions)for(const w of ion.hydration){
 const vectors=w.hydrogens.map(h=>h.map((v,k)=>v-w.oxygen[k])),lengths=vectors.map(v=>Math.hypot(...v));
 lengths.forEach(n=>assert.ok(Math.abs(n-.105)<1e-14));
 const cosine=vectors[0].reduce((s,v,k)=>s+v*vectors[1][k],0)/(lengths[0]*lengths[1]);assert.ok(Math.abs(Math.acos(cosine)*180/Math.PI-104.5)<1e-10);
 }
});

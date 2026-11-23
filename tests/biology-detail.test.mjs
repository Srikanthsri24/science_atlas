import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadTs } from './load-ts.mjs';
const F=await loadTs('src/components/foundation/world.ts');
const U=await loadTs('src/components/universe/world.ts');
const D=await loadTs('src/components/science/biology/detailWorld.ts');
const A=await loadTs('src/components/science/animation.ts');
const S=await loadTs('src/components/science/stories.ts');
const records=JSON.parse(readFileSync('data/authored-concepts.json')).records.filter(c=>Number(c.recordId.slice(3))<=50).sort((a,b)=>a.recordId.localeCompare(b.recordId));
for(const c of records)test(`${c.recordId} ${c.title}: five staged chapters, finite geometry and motion`,()=>{
 assert.equal(c.steps.length,5);assert.ok(D.hasBiologyDetail(c.kind));
 const signatures=[];
 for(let chapter=0;chapter<5;chapter++)for(const progress of[.05,.5,.95]){
  const f=A.animationFrame(c.kind,S.chapterStart(c.kind,chapter)+progress*S.stories[c.kind][chapter].duration,chapter*20+progress*20,{...c.preset,...c.steps[chapter].parameters});
  assert.equal(f.index,chapter);assert.ok(Object.values(f.p).every(x=>typeof x==='boolean'||Number.isFinite(x)));
  const w=F.foundationWorld(c.kind,f.p,f.time),v=w.things.length?w:U.universeWorld(c.kind,f.p,f.time,true);
  for(const t of v.things){assert.ok(t.at.every(Number.isFinite));if(t.points)assert.ok(t.points.every(p=>p.every(Number.isFinite)));if(t.size)assert.ok(t.size.every(x=>Number.isFinite(x)&&x>=0));}
  signatures.push(JSON.stringify([f.p,f.time,f.phase,f.chapterIndex,v.things,v.flows]));
 }
 assert.ok(new Set(signatures).size>5,'staged states must advance rather than remain frozen');
});
test('anatomical detail preserves base measurements and does not invent quantitative flows',()=>{
 const base={things:[],flows:[],metrics:[{label:'Rate',value:'12.0',unit:'mL/min'}],physical:'Model limits',focus:[]};
 const enhanced=D.biologyDetails('nephron',{ua:0,ub:0,uc:0,ud:0},2,base);
 assert.deepEqual(enhanced.metrics,base.metrics);assert.deepEqual(enhanced.flows,base.flows);assert.equal(enhanced.physical,base.physical);
 assert.ok(enhanced.things.some(t=>t.inspect==='Glomerular capillary tuft'));
});
test('detail respects bacterial nuclear organization',()=>{
 const w=F.foundationWorld('cellstructure',{ua:2,ub:0,uc:0,ud:0},2);
 assert.ok(!w.things.some(t=>t.inspect==='Nuclear pore'||t.inspect==='Mitochondrial crista'));
});

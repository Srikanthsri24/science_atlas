import test from 'node:test';import assert from 'node:assert/strict';
import {loadTs} from './load-ts.mjs';
const F=await loadTs('src/components/foundation/world.ts'),U=await loadTs('src/components/universe/world.ts'),B=await loadTs('src/components/science/biology/plantGeneticsDetails.ts'),G=await loadTs('src/lib/inheritanceGuided.ts');
const defaults={ua:0,ub:0,uc:0,ud:0};
test('stomatal aperture and visible vapour stop at a closed or zero-deficit condition',()=>{
 const base={things:[],flows:[],metrics:[],physical:'model',focus:[]};
 const closed=B.plantGeneticsDetails('transpiration',{...defaults,ua:25,ub:50,uc:0,ud:1},2,base),open=B.plantGeneticsDetails('transpiration',{...defaults,ua:25,ub:50,uc:1,ud:1},2,base),humid=B.plantGeneticsDetails('transpiration',{...defaults,ua:25,ub:100,uc:1,ud:1},2,base);
 assert.equal(closed.flows.length,0);assert.equal(humid.flows.length,0);assert.ok(open.flows.length>0);
 const spread=w=>Math.abs(w.things.filter(t=>t.inspect==='Guard cell')[0].at[0]-w.things.filter(t=>t.inspect==='Guard cell')[1].at[0]);assert.ok(spread(open)>spread(closed));
});
test('plant transport retains distinct source-to-sink paths and anatomical conduits',()=>{
 const w=F.foundationWorld('planttransport',{ua:50,ub:1,uc:0,ud:0},2);
 for(const name of['Xylem wall thickening','Phloem sieve plate','Companion cell','Root hair'])assert.ok(w.things.some(t=>t.inspect===name),name);
 assert.equal(w.flows.length,2);assert.ok(w.flows[0].points[0][1]<w.flows[0].points.at(-1)[1]);assert.ok(w.flows[1].points[0][1]>w.flows[1].points.at(-1)[1]);
});
test('DNA inspection has no false longitudinal molecular traffic; PCR extension fronts track new ends',()=>{
 const dna=F.foundationWorld('geneticcode',{...defaults,ua:0},2);assert.equal(dna.flows.length,0);assert.equal(dna.things.filter(t=>t.inspect==='Sugar–phosphate backbone marker').length,34);
 for(const t of[1,3,5]){const w=F.foundationWorld('pcr',{ua:1,ub:1,uc:10,ud:3},t),fronts=w.things.filter(t=>t.inspect==='Polymerase extension-front guide'),strands=w.things.filter(t=>t.inspect==='New strand extension');assert.equal(fronts.length,2);for(let i=0;i<2;i++)assert.ok(Math.abs(fronts[i].at[0]-strands[i].points.at(-1)[0])<1e-10)}
});
test('Genes and Mendelian lessons reveal allele outcomes only in their own combination window',()=>{
 assert.equal(G.inheritanceConceptReveal('SA-0043',50),0);assert.equal(G.inheritanceConceptReveal('SA-0043',61),1);assert.equal(G.inheritanceConceptReveal('SA-0044',41),1);
 for(const id of['SA-0043','SA-0044'])for(const t of[80,90,100])assert.equal(G.inheritanceConceptReveal(id,t),4);
});

const PCR=await loadTs('src/lib/pcrGuided.ts');
test('the 100-second PCR copy-count sweep is monotonic and both extension chapters span one growth window',()=>{
 let last=-1;for(let t=0;t<=100;t++){const w=F.foundationWorld('pcr',{ua:1,ub:1,uc:20,ud:0},PCR.pcrConceptTime(t)),n=Number(w.metrics.find(m=>m.label==='Completed model cycles').value);assert.ok(n>=last);last=n}assert.equal(last,20);
 for(const start of[40,60]){const length=t=>{const w=F.foundationWorld('pcr',{ua:1,ub:1,uc:20,ud:3},PCR.pcrConceptTime(t));const q=w.things.find(t=>t.inspect==='New strand extension');return Math.abs(q.points[1][0]-q.points[0][0])};assert.ok(length(start+19)>length(start+1)+1.5)}
});

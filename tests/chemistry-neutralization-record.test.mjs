import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/neutralization.ts'),R=await loadTs('src/lib/chemistry/neutralizationRecord.ts'),q={...M.defaultNeutralizationInputs,timeS:42,observation:'Past the target.'};
test('saved observations retain physical controls and writing, never forged pH',()=>{
 const r=R.validateNeutralizationRecord({prediction:'P',conclusion:'C',trials:[{...q,pH:999},null,{}, {...q,acidMl:'20'},{...q,aliquots:200.1}]});
 assert.equal(r.trials.length,1);assert.equal('pH'in r.trials[0],false);assert.equal(r.trials[0].observation,q.observation);
});
test('latest sixty valid observations survive malformed suffixes and bounded writing',()=>{
 const r=R.validateNeutralizationRecord({prediction:'x'.repeat(5000),trials:[...Array.from({length:65},(_,i)=>({...q,timeS:i})),...Array(70).fill(null)]});
 assert.equal(r.trials.length,60);assert.equal(r.trials[0].timeS,5);assert.equal(r.trials.at(-1).timeS,64);assert.equal(r.prediction.length,4000);
});
test('twenty-five columns distinguish released and arrived volume during flight',()=>{
 const row=R.neutralizationTrialValues({...q,timeS:2.03},0);assert.equal(row.length,25);assert.equal(R.neutralizationHeaders.length,25);
 assert.equal(+row[8],10);assert.equal(+row[9],10.1);assert.equal(+row[10],.1);assert.equal(+row[11],.1);assert.equal(+row[12],0);assert.equal(+row[13],20);assert.equal(row[22],'acidic');assert.equal(+row[23],20);
});
test('twenty-nine formula blocks stay finite through equivalence, overshoot and controls',()=>{
 const events=M.neutralizationEvents(q);for(const patch of[{timeS:0},{timeS:2.03},{timeS:events[199].arrivalS},{timeS:105},{baseMolL:0},{acidMolL:0},{plannedBaseMl:0},{acidMl:30,acidMolL:.02,baseMolL:.005}]){
  const p={...q,...patch},b=R.neutralizationCalculations(p);assert.equal(b.length,29);for(const step of b){assert.ok(step.title&&step.formula&&step.substitution&&step.result);assert.doesNotMatch(step.result,/NaN|Infinity|undefined/)}
  assert.ok(Math.abs(parseFloat(b[25].result)-(p.acidMl+p.plannedBaseMl))<1e-6);
  if(p.baseMolL===0)assert.match(b[22].result,/Not defined/);else assert.ok(Math.abs(parseFloat(b[22].result)-p.acidMl*p.acidMolL/p.baseMolL)<1e-6);
 }
});
test('equivalence result keeps water ions rather than log-zero or invented blank concentrations',()=>{
 const event=M.neutralizationEvents(q)[199],b=R.neutralizationCalculations({...q,timeS:event.arrivalS});
 assert.equal(parseFloat(b[18].result),1e-7);assert.equal(parseFloat(b[19].result),1e-7);assert.equal(parseFloat(b[20].result),7);
 const pure=R.neutralizationCalculations({...q,acidMolL:0,baseMolL:0});assert.equal(parseFloat(pure[20].result),7);assert.equal(parseFloat(pure[11].result),0);
});
test('small equivalent amounts retain enough digits for displayed subtraction to reproduce the excess',()=>{
 const p={...q,acidMl:15,acidMolL:.005,baseMolL:.015,aliquots:250},event=M.neutralizationEvents(p)[30];
 const b=R.neutralizationCalculations({...p,timeS:event.arrivalS+1e-6});
 assert.equal(R.neutralizationNumber(.0000744),'7.44000000e-5');
 assert.ok(Math.abs(parseFloat(b[0].result)-parseFloat(b[10].result)-parseFloat(b[12].result))<1e-14);
});
test('download splits four print tables, recomputes every trial and escapes all writing',()=>{
 const html=R.neutralizationReport({prediction:'<script>bad</script>',conclusion:'A & B',trials:[{...q,observation:'<img src=x>'},{...q,baseMolL:0}]});
 assert.equal((html.match(/data-neutralization-table=/g)||[]).length,4);assert.equal((html.match(/Substitution:/g)||[]).length,58);assert.match(html,/&lt;script&gt;/);assert.match(html,/&lt;img src=x&gt;/);assert.doesNotMatch(html,/<script|<img|https?:\/\//);assert.match(html,/A4 landscape/);assert.match(html,/VisionariesAI Labs Private Limited/);
});

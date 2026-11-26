import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const R=await loadTs('src/lib/chemistry/cabbageRecord.ts'),M=await loadTs('src/lib/chemistry/cabbageIndicator.ts');
const q={...M.defaultCabbageInputs,timeS:20,sample:'acid',observation:'Pink reference.'};
test('saved records retain controls and writing while rejecting forged derived values',()=>{
 const r=R.validateCabbageRecord({prediction:'P',conclusion:'C',trials:[{...q,hMolL:999},null,{}, {...q,sample:'unknown'},{...q,sample:undefined},{...q,drops:6.5}]});
 assert.equal(r.trials.length,1);assert.equal('hMolL'in r.trials[0],false);assert.equal(r.trials[0].observation,q.observation);assert.equal(r.prediction,'P');
});
test('latest sixty valid trials survive invalid suffixes and writing is bounded',()=>{
 const r=R.validateCabbageRecord({prediction:'a'.repeat(5000),trials:[...Array.from({length:65},(_,i)=>({...q,timeS:i})),...Array(70).fill(null)]});
 assert.equal(r.trials.length,60);assert.equal(r.trials[0].timeS,5);assert.equal(r.trials.at(-1).timeS,64);assert.equal(r.prediction.length,4000);
});
test('twenty observation columns independently match arrived drops, dilution and ideal ions',()=>{
 const row=R.cabbageTrialValues(q,0);assert.equal(row.length,20);assert.equal(R.cabbageHeaders.length,20);
 // At 20 s, releases at 2,6,10,14,18 have all arrived.
 assert.equal(+row[10],5);assert.equal(+row[13],20.25);assert.equal(+row[14],.125);assert.ok(Math.abs(+row[15]-.125/20.25)<5.1e-7);
 assert.equal(+row[16],.001);assert.equal(+row[17],1e-11);assert.equal(row[19],q.observation);
});
test('fourteen worked steps remain finite through controls, flight and endpoint for every reference',()=>{
 for(const sample of ['acid','neutral','base'])for(const change of[{timeS:0},{timeS:2.05},{timeS:65},{doseMl:0},{pigmentMgMl:0},{sampleMl:30,doseMl:1.2,drops:6}]){
  const p={...q,...change};const b=R.cabbageCalculations(p,sample);assert.equal(b.length,14);
  for(const c of b){assert.ok(c.title&&c.formula&&c.substitution&&c.result);assert.doesNotMatch(c.result,/NaN|Infinity|undefined/)}
  assert.ok(Math.abs(parseFloat(b[10].result)-(p.sampleMl+p.doseMl))<1e-6);assert.ok(Math.abs(parseFloat(b[11].result)-p.doseMl*p.pigmentMgMl)<1e-6);
  const ph=sample==='acid'?p.acidPH:sample==='base'?p.basePH:7;
  assert.ok(Math.abs(parseFloat(b[12].result)/10**-ph-1)<1e-6);
 }
});
test('report escapes writing, splits three print tables and recomputes every trial',()=>{
 const html=R.cabbageReport({prediction:'<script>x</script>',conclusion:'A & B',trials:[{...q,observation:'<img src=x>'},{...q,sample:'base'}]});
 assert.equal((html.match(/data-cabbage-table=/g)||[]).length,3);assert.equal((html.match(/Substitution:/g)||[]).length,28);
 assert.match(html,/&lt;script&gt;/);assert.match(html,/&lt;img src=x&gt;/);assert.match(html,/A &amp; B/);assert.doesNotMatch(html,/<script|<img|https?:\/\//);assert.match(html,/A4 landscape/);
});

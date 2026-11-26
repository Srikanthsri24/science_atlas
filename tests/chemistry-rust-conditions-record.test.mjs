import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/rustConditions.ts'),R=await loadTs('src/lib/chemistry/rustConditionsRecord.ts'),q={...M.defaultRustInputs,timeDays:7,condition:'wet_oxygen',observation:'Retained orange-brown product.'};
test('records retain controls and condition without trusting forged product mass',()=>{
 const r=R.validateRustRecord({prediction:'P',trials:[{...q,productG:999},null,{}, {...q,condition:undefined},{...q,condition:'other'},{...q,ironG:'0.15'}]});assert.equal(r.trials.length,1);assert.equal('productG'in r.trials[0],false);assert.equal(r.trials[0].condition,'wet_oxygen');assert.equal(r.prediction,'P');
});
test('latest sixty valid trials and bounded writing survive invalid suffixes',()=>{
 const r=R.validateRustRecord({prediction:'x'.repeat(5000),trials:[...Array.from({length:65},(_,i)=>({...q,timeDays:i/10})),...Array(70).fill(null)]});assert.equal(r.trials.length,60);assert.equal(r.trials[0].timeDays,.5);assert.equal(r.trials.at(-1).timeDays,6.4);assert.equal(r.prediction.length,4000);
});
test('twenty-three columns distinguish condition inventories and different weighed materials',()=>{
 const row=R.rustTrialValues(q,0);assert.equal(row.length,23);assert.equal(R.rustHeaders.length,23);assert.equal(row[1],'Water + oxygen');assert.equal(row[9],'oxygen');
 const gas=101.325*((50-.15/8-2)/1000)/(8.314462618*298.15),x=gas*.21/.75*(1-Math.exp(-.25*7));
 assert.ok(Math.abs(+row[11]-x*88.851)<1e-10);assert.ok(Math.abs(+row[18]-(.15-x*55.845+x*88.851*.25))<1e-10);assert.ok(Math.abs(+row[20]-+row[21])<1e-6);
 const dry=R.rustTrialValues({...q,condition:'dry_oxygen'},0);assert.equal(+dry[4],0);assert.equal(+dry[11],0);
});
test('twenty-nine worked blocks remain finite for all controls, capacities and partitions',()=>{
 for(const condition of M.rustConditions)for(const patch of[{timeDays:0},{timeDays:14},{waterMl:.001},{ironG:.05,chamberMl:100,oxygenFraction:.3},{reducedOxygenFraction:.001},{attachedFraction:0},{attachedFraction:1}]){
  const b=R.rustCalculations({...q,...patch},condition);assert.equal(b.length,29);for(const c of b){assert.ok(c.title&&c.formula&&c.substitution&&c.result);assert.doesNotMatch(c.result,/NaN|Infinity|undefined/)}assert.ok(Math.abs(parseFloat(b[26].result)-parseFloat(b[27].result))<1e-6);
 }
});
test('tiny product and reactant values are visible rather than silently rounded to zero',()=>{
 assert.equal(R.rustNumber(0),'0');assert.match(R.rustNumber(1e-10),/e-10/);const b=R.rustCalculations({...q,reducedOxygenFraction:.0001},'wet_reduced_oxygen');assert.ok(parseFloat(b[13].result)>0);assert.match(b[13].result,/e-/);
});
test('report splits three print tables, recomputes trials and escapes student writing',()=>{
 const html=R.rustReport({prediction:'<script>x</script>',conclusion:'A & B',trials:[{...q,observation:'<img src=x>'},{...q,condition:'dry_oxygen'}]});assert.equal((html.match(/data-rust-table=/g)||[]).length,3);assert.equal((html.match(/Substitution:/g)||[]).length,58);assert.match(html,/&lt;script&gt;/);assert.match(html,/&lt;img src=x&gt;/);assert.doesNotMatch(html,/<script|<img|https?:\/\//);assert.match(html,/A4 landscape/);assert.match(html,/VisionariesAI Labs Private Limited/);
});

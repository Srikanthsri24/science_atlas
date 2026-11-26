import test from 'node:test';import assert from 'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const R=await loadTs('src/lib/chemistry/carbonateGasRecord.ts'),M=await loadTs('src/lib/chemistry/carbonateGas.ts');
const q={...M.defaultCarbonateGasInputs,timeS:120,observation:'Piston moves.'};
test('record retains physical controls and writing, not forged derived measurements',()=>{
 const r=R.validateCarbonateRecord({prediction:'P',conclusion:'C',trials:[{...q,syringeMl:999}]});assert.equal(r.trials.length,1);assert.equal(r.trials[0].timeS,120);assert.equal('syringeMl'in r.trials[0],false);assert.equal(r.prediction,'P');
});
test('malformed observations are rejected and latest sixty valid candidates retained in order',()=>{
 const r=R.validateCarbonateRecord({prediction:'x'.repeat(5000),trials:[null,{},...Array.from({length:65},(_,i)=>({...q,timeS:i,observation:`n${i}`}))]});assert.equal(r.prediction.length,4000);assert.equal(r.trials.length,60);assert.equal(r.trials[0].timeS,5);assert.equal(r.trials.at(-1).observation,'n64');
 assert.equal(R.validateCarbonateRecord({trials:[{...q,acidMl:'20'}]}).trials.length,0);
});
test('24-column row matches controls, limiting reagent and an independent analytical extent',()=>{
 const row=R.carbonateTrialValues(q,0);assert.equal(row.length,24);assert.equal(R.carbonateHeaders.length,24);assert.equal(row[8],'acid');
 const extent=.002*(1-Math.exp(-.015*120)),vm=1000*8.314462618*298.15/101.325,piston=extent*(vm-100.086/2.71);
 assert.ok(Math.abs(+row[9]-extent)<5.1e-7);assert.ok(Math.abs(+row[10]-piston)<5.1e-7);assert.equal(+row[18],20.3);assert.equal(row[23],'Piston moves.');
});
test('30 worked blocks expose finite values for initial, reacting, blank and limiting cases',()=>{
 for(const change of[{timeS:0},{timeS:120},{timeS:600},{carbonateG:0},{acidMolL:0},{carbonateG:.1,acidMolL:.3}]){
  const b=R.carbonateCalculations({...q,...change});assert.equal(b.length,30);for(const c of b){assert.ok(c.title&&c.formula&&c.substitution&&c.result);assert.doesNotMatch(c.result,/NaN|Infinity|undefined/)}
  const n=b.map(c=>parseFloat(c.result));assert.ok(Math.abs(n[21]+n[18]-n[15])<2e-6);assert.ok(Math.abs(n[26]+n[27]-n[4])<2e-6);assert.equal(n[12],20+(change.carbonateG??.3));
 }
});
test('report includes three print tables and all worked trials with escaped writing',()=>{
 const html=R.carbonateGasReport({prediction:'<script>x</script>',conclusion:'A & B',trials:[{...q,observation:'<img src=x>'},{...q,timeS:0}]});
 assert.equal((html.match(/data-carbonate-table=/g)||[]).length,3);assert.equal((html.match(/Substitution:/g)||[]).length,60);assert.match(html,/&lt;script&gt;x&lt;\/script&gt;/);assert.match(html,/&lt;img src=x&gt;/);assert.doesNotMatch(html,/<script|<img|https?:\/\//);assert.match(html,/A4 landscape/);assert.match(html,/VisionariesAI Labs Private Limited/);
});
test('small positive residuals remain visible in scientific notation',()=>{assert.match(R.carbonateNumber(1e-10),/e-10/);assert.equal(R.carbonateNumber(0),'0')});

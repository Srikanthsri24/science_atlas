import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTs} from './load-ts.mjs';
const R=await loadTs('src/lib/chemistry/coolingCrystalRecord.ts');
const M=await loadTs('src/lib/chemistry/coolingCrystalGrowth.ts');
const trial={...M.defaultCoolingCrystalInputs,timeS:120,program:'fast',observation:'Growth begins.'};
test('record keeps exact experiment controls without accepting fake saved results',()=>{
  const r=R.validateCoolingRecord({prediction:'P',conclusion:'C',trials:[{...trial,crystalG:999}]});
  assert.equal(r.trials.length,1); assert.equal(r.trials[0].timeS,120);
  assert.equal('crystalG' in r.trials[0],false);
  assert.equal(r.prediction,'P'); assert.equal(r.conclusion,'C');
});
test('malformed controls or programs are excluded and writing is bounded',()=>{
  const r=R.validateCoolingRecord({prediction:'x'.repeat(5000),trials:[null,{},
    {...trial,program:'other'},{...trial,saltG:'80'},{...trial,timeS:9999},trial]});
  assert.equal(r.prediction.length,4000); assert.equal(r.trials.length,1);
  assert.deepEqual(R.validateCoolingRecord(null),{prediction:'',conclusion:'',trials:[]});
});
test('latest sixty observations preserve ordering and student notes',()=>{
  const trials=Array.from({length:75},(_,i)=>({...trial,timeS:i,observation:`note${i}`}));
  const r=R.validateCoolingRecord({trials}); assert.equal(r.trials.length,60);
  assert.equal(r.trials[0].timeS,15); assert.equal(r.trials[59].observation,'note74');
});
test('observation row aligns all twenty-two headings with recomputed values',()=>{
  const a=R.coolingTrialValues(trial,0); assert.equal(a.length,22);
  assert.equal(R.coolingHeaders.length,22); assert.equal(a[0],'1'); assert.equal(a[1],'fast');
  assert.equal(+a[11],20); assert.equal(+a[12],31.6);
  assert.ok(Math.abs(+a[13]+ +a[14]-80)<2e-6);
  assert.equal(+a[20],180); assert.equal(a[21],'Growth begins.');
});
test('twenty-two worked blocks expose substitution units and finite results for both programs',()=>{
  for(const program of ['fast','slow']) for(const timeS of [0,120,600,1200,2400]) {
    const blocks=R.coolingCalculations({...trial,timeS},program);
    assert.equal(blocks.length,22);
    for(const b of blocks) {
      assert.ok(b.title && b.formula && b.substitution && b.result);
      assert.doesNotMatch(b.result,/NaN|Infinity|undefined/);
    }
    const values=blocks.map(b=>parseFloat(b.result));
    assert.ok(Math.abs(values[6]+values[4]-80)<2e-6);
    assert.ok(Math.abs(values[10]+values[11]-values[4])<2e-6);
    assert.ok(Math.abs(values[16]+values[17]-values[18])<2e-6);
    assert.equal(values[19],80); assert.equal(values[20],180);
    assert.match(blocks[4].result,/integrated changing rates/);
  }
});
test('coarse interpolation substitution selects correct temperature segment',()=>{
  for(const [timeS,temp] of [[0,80],[20,70],[40,60],[60,50],[80,40],[100,30],[120,20]]) {
    const c=R.coolingCalculations({...trial,timeS},'fast');
    assert.equal(parseFloat(c[1].result),temp);
    assert.ok(Math.abs(parseFloat(c[2].result)-M.coolingSolubility(temp))<1e-8);
  }
});
test('download includes all trials, split print tables, worked blocks and escaped student writing',()=>{
  const html=R.coolingCrystalReport({prediction:'<script>alert(1)</script>',conclusion:'A & B',
    trials:[{...trial,observation:'<img src=x onerror=bad>'},{...trial,program:'slow'}]});
  assert.match(html,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html,/&lt;img src=x onerror=bad&gt;/); assert.match(html,/A &amp; B/);
  assert.doesNotMatch(html,/<script|<img/);
  assert.equal((html.match(/data-cooling-table=/g)||[]).length,3);
  assert.equal((html.match(/Substitution:/g)||[]).length,44);
  assert.match(html,/@page\{size:A4 landscape/);
  assert.match(html,/VisionariesAI Labs Private Limited/);
  assert.doesNotMatch(html,/https?:\/\//);
});
test('tiny numerical values stay visible rather than silently rounding to zero',()=>{
  assert.match(R.coolingNumber(1e-10),/e-10/); assert.equal(R.coolingNumber(0),'0');
});

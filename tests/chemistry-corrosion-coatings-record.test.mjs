import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/corrosionCoatingsRecord.ts'),S=await loadTs('src/lib/chemistry/corrosionCoatings.ts'),q=S.defaultCoatingInputs;
const trial=(patch={})=>({...q,kind:'scratched',observation:'Matched elapsed day',...patch});
test('record validation retains preparation and rejects invalid or forged derived observations',()=>{
 const r=M.validateCoatingRecord({prediction:'Expected barrier effect',conclusion:'Chosen model only',trials:[trial({productG:999}),trial({ironG:0}),trial({kind:'zinc'}),trial({relativeTransmission:'0.1'}),null]});assert.equal(r.trials.length,1);assert.equal('productG'in r.trials[0],false);assert.equal(r.trials[0].kind,'scratched');assert.equal(r.prediction,'Expected barrier effect');
});
test('latest sixty valid trials and bounded writing survive malformed stored suffixes',()=>{
 const r=M.validateCoatingRecord({prediction:'x'.repeat(5000),conclusion:42,trials:[...Array.from({length:70},(_,i)=>trial({observation:String(i)})),{}]});assert.equal(r.trials.length,60);assert.equal(r.trials[0].observation,'10');assert.equal(r.trials.at(-1).observation,'69');assert.equal(r.prediction.length,4000);assert.equal(r.conclusion,'');assert.deepEqual(M.validateCoatingRecord(null),{prediction:'',conclusion:'',trials:[]});
});
test('twenty-five columns distinguish local phases, film and whole-cell mass',()=>{
 const t=trial({timeDays:30,bareCoefficientPerDay:1.2,exposedFraction:.03}),s=S.coatingState(t,t.kind),row=M.coatingTrialValues(t,0);assert.equal(M.coatingHeaders.length,25);assert.equal(row.length,25);assert.equal(row[1],'Barrier with exposed strip');assert.equal(Number(row[11]),0);assert.ok(Number(row[12])>0);assert.ok(Number(row[13])>0);assert.ok(Number(row[14])>0);assert.ok(Math.abs(Number(row[15])-s.productG)<1e-10);assert.ok(Math.abs(Number(row[21])-Number(row[22]))<1e-10);assert.equal(row[24],t.observation);
});
test('worked substitutions cover initial inventories, exact intervals and final masses without NaN or numeric infinity',()=>{
 for(const kind of S.coatingCases)for(const patch of [{},{timeDays:30},{timeDays:30,relativeTransmission:0,exposedFraction:.01,bareCoefficientPerDay:1.2},{timeDays:30,waterMl:.00001},{timeDays:30,waterMl:0},{timeDays:30,oxygenFraction:0},{timeDays:30,exposedFraction:0},{timeDays:30,exposedFraction:1,relativeTransmission:1}]){
  const p={...q,...patch},s=S.coatingState(p,kind),b=M.coatingCalculations(p,kind);assert.equal(b.length,31+9*s.segments.length);assert.equal(b[0].title,'Initial iron amount');assert.equal(b.at(-1).title,'Current chosen oxygen consumption rate');
  assert.ok(b.every(x=>x.title&&x.formula&&x.substitution&&x.result));assert.equal(/NaN|Infinity|undefined/.test(JSON.stringify(b)),false);
  assert.ok(Math.abs(Number(b.find(x=>x.title==='Total retained product').result.split(' ')[0])-s.productG)<1e-9);
 }
});
test('local exhaustion intervals are included separately rather than applying an invalid single exponent across them',()=>{
 const p={...q,timeDays:30,bareCoefficientPerDay:1.2,exposedFraction:.03},s=S.coatingState(p),blocks=M.coatingCalculations(p,'scratched');assert.equal(s.segments.length,2);assert.ok(blocks.some(b=>b.title==='Interval 1 · elapsed interval'&&b.result.includes('exposed exhausted')));assert.ok(blocks.some(b=>b.title==='Interval 2 · chosen coefficient'));assert.ok(blocks.some(b=>b.title==='Interval 2 · exposed-zone consumption'&&Number(b.result.split(' ')[0])===0));
});
test('exam report contains all recorded calculations, three printable tables and escaped company-only writing',()=>{
 const r={prediction:'<script>alert(1)</script>',conclusion:'<img src=x>',trials:[trial({timeDays:0}),trial({timeDays:30}),trial({kind:'ideal',timeDays:30})]},html=M.coatingReport(r),count=r.trials.reduce((a,t)=>a+M.coatingCalculations(t,t.kind).length,0);
 assert.equal((html.match(/<table>/g)||[]).length,3);assert.equal((html.match(/Result: /g)||[]).length,count);assert.ok(html.includes('&lt;script&gt;')&&html.includes('&lt;img src=x&gt;'));assert.equal(/<script|<img|https?:\/\//.test(html),false);assert.ok(html.includes('A4 landscape')&&html.includes('VisionariesAI Labs Private Limited'));assert.ok(html.includes('finite local iron')&&html.includes('No finite exhaustion event'));
});

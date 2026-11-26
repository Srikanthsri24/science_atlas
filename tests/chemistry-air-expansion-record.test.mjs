import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/airExpansionRecord.ts'),S=await loadTs('src/lib/chemistry/airExpansion.ts'),q=S.defaultAirInputs;
const trial=(patch={})=>({...q,boundary:'piston',observation:'Compare equal elapsed time',...patch});
test('records preserve preparation and reject malformed controls, boundaries and derived forgeries',()=>{
 const r=M.validateAirRecord({prediction:'Expected expansion',trials:[trial({volumeMl:999}),trial({initialC:'25'}),trial({program:'invalid'}),trial({boundary:'balloon'}),{}]});assert.equal(r.trials.length,1);assert.equal('volumeMl'in r.trials[0],false);assert.equal(r.trials[0].initialVolumeMl,50);assert.equal(r.prediction,'Expected expansion');assert.equal(r.conclusion,'');
});
test('latest sixty valid observations and bounded student writing survive bad stored suffixes',()=>{
 const r=M.validateAirRecord({prediction:'x'.repeat(5000),conclusion:1,trials:[...Array.from({length:70},(_,i)=>trial({observation:String(i)})),null,{}]});assert.equal(r.trials.length,60);assert.equal(r.trials[0].observation,'10');assert.equal(r.trials.at(-1).observation,'69');assert.equal(r.prediction.length,4000);assert.equal(r.conclusion,'');assert.deepEqual(M.validateAirRecord(null),{prediction:'',conclusion:'',trials:[]});
});
test('twenty-six observation columns distinguish boundary, gas/jacket temperature and signed energy',()=>{
 const a=trial({timeSeconds:180,program:'return'}),b=trial({timeSeconds:180,program:'return',boundary:'rigid'}),row=M.airTrialValues(a,0),rigid=M.airTrialValues(b,1);assert.equal(M.airHeaders.length,26);assert.equal(row.length,26);assert.equal(row[1],'Free-piston reference');assert.equal(row[2],'Return jacket at 120 s');assert.notEqual(row[9],row[11]);assert.ok(Number(row[15])>0);assert.equal(Number(row[17]),0);assert.equal(Number(rigid[15]),0);assert.ok(Number(rigid[17])>0);assert.ok(Number(row[21])<0);assert.ok(Math.abs(Number(row[18])-Number(row[19])-Number(row[20]))<2e-6);
});
test('worked calculations remain finite for both boundaries, cooling, stationary and switch controls',()=>{
 for(const boundary of S.airBoundaries)for(const patch of [{},{timeSeconds:30},{timeSeconds:120,program:'return'},{timeSeconds:240,program:'return'},{timeSeconds:300,targetC:5},{timeSeconds:300,targetC:25},{initialVolumeMl:20,initialPressureKPa:80,initialC:35,targetC:5,conductanceWK:.0005,timeSeconds:300,program:'return'},{initialVolumeMl:60,initialPressureKPa:120,initialC:15,targetC:85,conductanceWK:.005,timeSeconds:300}]){
  const p={...q,...patch},s=S.airState(p,boundary),b=M.airCalculations(p,boundary);assert.equal(b.length,26+8*s.segments.length);assert.equal(/NaN|Infinity|undefined/.test(JSON.stringify(b)),false);assert.ok(b.every(x=>x.title&&x.formula&&x.substitution&&x.result));
  for(const [title,value] of [['Current gas absolute temperature',s.gasK],['Current gas volume',s.volumeMl],['Current absolute pressure',s.pressureKPa],['Net heat into gas',s.heatJ],['Net work by gas',s.workJ]])assert.ok(Math.abs(Number(b.find(x=>x.title===title).result.split(' ')[0])-value)<1e-6);
 }
});
test('return programme records positive heating and negative cooling as separate signed intervals',()=>{
 const blocks=M.airCalculations({...q,timeSeconds:240,program:'return'},'piston'),first=blocks.find(b=>b.title==='Interval 1 · heat into gas'),second=blocks.find(b=>b.title==='Interval 2 · heat into gas');assert.ok(Number(first.result.split(' ')[0])>0);assert.ok(Number(second.result.split(' ')[0])<0);assert.ok(Number(blocks.find(b=>b.title==='Current heat-flow rate').result.split(' ')[0])<0);assert.ok(blocks.find(b=>b.title==='Current gas absolute temperature').result.endsWith(' K'));
});
test('exam report recomputes every trial, splits printable tables and escapes company-only writing',()=>{
 const r={prediction:'<script>alert(1)</script>',conclusion:'<img src=x>',trials:[trial(),trial({timeSeconds:240,program:'return'}),trial({timeSeconds:300,targetC:5,boundary:'rigid'})]},html=M.airReport(r),count=r.trials.reduce((a,t)=>a+M.airCalculations(t,t.boundary).length,0);assert.equal((html.match(/<table>/g)||[]).length,3);assert.equal((html.match(/Result: /g)||[]).length,count);assert.ok(html.includes('A4 landscape')&&html.includes('VisionariesAI Labs Private Limited'));assert.ok(html.includes('&lt;script&gt;')&&html.includes('&lt;img src=x&gt;'));assert.equal(/<script|<img|https?:\/\//.test(html),false);assert.ok(html.includes('gas temperature remains continuous')&&html.includes('temperature in kelvin'));
});

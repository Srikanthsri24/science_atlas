import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/invertedCupRecord.ts'),S=await loadTs('src/lib/chemistry/invertedCup.ts'),q=S.defaultCupInputs;
const trial=(patch={})=>({...q,condition:'trapped',observation:'Compare matched insertion',...patch});
test('record validation retains preparation while rejecting invalid controls and derived forgeries',()=>{
 const r=M.validateCupRecord({prediction:'Air occupies space',trials:[trial({gasPressureKPa:999,markerEverContacted:true}),trial({cupRadiusCm:'2.5'}),trial({condition:'tilted'}),trial({timeSeconds:200}),{}]});assert.equal(r.trials.length,1);assert.equal('gasPressureKPa'in r.trials[0],false);assert.equal('markerEverContacted'in r.trials[0],false);assert.equal(r.trials[0].cupRadiusCm,2.5);assert.equal(r.prediction,'Air occupies space');
});
test('latest sixty valid trials and bounded writing survive malformed stored suffixes',()=>{
 const r=M.validateCupRecord({prediction:'x'.repeat(5000),conclusion:1,trials:[...Array.from({length:70},(_,i)=>trial({observation:String(i)})),null,{}]});assert.equal(r.trials.length,60);assert.equal(r.trials[0].observation,'10');assert.equal(r.trials.at(-1).observation,'69');assert.equal(r.prediction.length,4000);assert.equal(r.conclusion,'');assert.deepEqual(M.validateCupRecord(null),{prediction:'',conclusion:'',trials:[]});
});
test('twenty-eight columns distinguish flooded pressure from zero gas amount and retain contact history',()=>{
 const deep=M.cupTrialValues(trial({condition:'vented',timeSeconds:50}),0),back=M.cupTrialValues(trial({condition:'vented',timeSeconds:160}),1);assert.equal(M.cupHeaders.length,28);assert.equal(deep.length,28);assert.equal(deep[16],M.cupNoGas);assert.equal(Number(deep[15]),0);assert.equal(Number(deep[18]),0);assert.equal(deep[25],'Contact');assert.equal(back[25],'No contact');assert.equal(back[26],'Contact recorded');assert.ok(Number(back[20])>0);assert.ok(Math.abs(Number(back[23])-Number(back[24]))<1e-6);
});
test('worked calculations remain finite and recomputed across all stages and preparation corners',()=>{
 for(const condition of S.cupConditions)for(const timeSeconds of [0,4,25,50,90,115,138,160])for(const patch of [{},{maximumInsertionCm:0},{cupRadiusCm:3,cupHeightCm:12,basinRadiusCm:7,maximumInsertionCm:30,atmosphericKPa:80,temperatureC:15}]){
  const p={...q,...patch,timeSeconds},s=S.cupState(p,condition),b=M.cupCalculations(p,condition);assert.equal(/NaN|Infinity|undefined/.test(JSON.stringify(b)),false);assert.ok(b.every(x=>x.title&&x.formula&&x.substitution&&x.result));
  for(const [title,v] of [['Retained gas volume',s.gasVolumeMl],['Inside water volume',s.waterInsideMl],['Total retained water',s.totalWaterMl],['Current retained air amount',s.amountMol]])assert.ok(Math.abs(Number(b.find(x=>x.title===title).result.split(' ')[0])-v)<1e-6);
  assert.ok(b.some(x=>x.title==='Coupled outside level rise'&&x.formula.includes('clamp')));assert.ok(b.some(x=>x.title==='Air inventory check'));
 }
});
test('flooded worked steps label pressure and PV not applicable while retaining water-pressure calculations',()=>{
 const p={...q,timeSeconds:50},b=M.cupCalculations(p,'vented');for(const title of ['Retained gas pressure','Hydrostatic interface check','Retained pressure-volume expression'])assert.equal(b.find(x=>x.title===title).result,M.cupNoGas);assert.ok(Number(b.find(x=>x.title==='Water pressure at the rim').result.split(' ')[0])>q.atmosphericKPa);
 const back=M.cupCalculations({...q,timeSeconds:160},'vented');assert.ok(back.find(x=>x.title==='Contact marker history').result.includes('Contact recorded'));assert.equal(Number(back.find(x=>x.title==='Inside water volume').result.split(' ')[0]),0);
});
test('exam report recomputes every recorded result, splits printable tables and escapes company-only writing',()=>{
 const r={prediction:'<script>alert(1)</script>',conclusion:'<img src=x>',trials:[trial(),trial({condition:'vented',timeSeconds:50}),trial({condition:'vented',timeSeconds:160})]},html=M.cupReport(r),count=r.trials.reduce((a,t)=>a+M.cupCalculations(t,t.condition).length,0);assert.equal((html.match(/<table>/g)||[]).length,3);assert.equal((html.match(/Result: /g)||[]).length,count);assert.ok(html.includes('&lt;script&gt;')&&html.includes('&lt;img src=x&gt;'));assert.equal(/<script|<img|https?:\/\//.test(html),false);assert.ok(html.includes('A4 landscape')&&html.includes('VisionariesAI Labs Private Limited'));assert.ok(html.includes(M.cupNoGas)&&html.includes('contact proxy'));
});

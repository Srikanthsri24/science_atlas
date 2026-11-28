import test from 'node:test';import assert from 'node:assert/strict';import {loadTs} from './load-ts.mjs';
const m=await loadTs('src/lib/chemistry/carbonateExposureRecord.ts'),c=await loadTs('src/lib/chemistry/carbonateExposure.ts');
const q={...c.defaultCarbonateExposure,deliveredMl:1000,note:'Measured virtual endpoint'};
test('carbonate report has matched observation rows and correct hand-calculated substitutions',()=>{
 const b=m.carbonateExposureCalculations(q),loss=b.find(v=>v.key==='acid.specimenLostG');assert.equal(b.length,112);assert.ok(Math.abs(parseFloat(loss.result)-.0050043)<1e-14);assert.match(loss.substitution,/×/);
 for(const t of m.carbonateExposureTables){const rows=m.carbonateExposureObservationRows(q,0,t.id);assert.equal(rows.length,4);for(const row of rows)assert.equal(row.length,t.fields.length+2);}
 assert.equal(b.find(v=>v.key==='water.requiredDoseMl').result.startsWith('Undefined'),true);assert.equal(b.find(v=>v.key==='blank.requiredDoseMl').result.startsWith('Undefined'),true);
 const html=m.carbonateExposureReport({plan:'Compare matched exposure',conclusion:'Selected acid removes carbonate in this model',trials:[q]});assert.equal((html.match(/class="worked"/g)||[]).length,112);for(const title of ['Aim and prediction','Procedure and recording instructions','Preparation observations','Result and conclusion','Precautions and interpretation limits'])assert.ok(html.includes(title));
});
test('notebook rejects malformed trials and unknown table requests',()=>{for(const trials of [null,{},Array(41).fill(q),[{...q,pressureKPa:0}]])assert.throws(()=>m.validateCarbonateExposureRecord({trials}));assert.throws(()=>m.carbonateExposureObservationRows(q,0,'missing'));});
test('download report escapes student text and preserves inputs as inert JSON',()=>{
 const danger='</script><img src=x onerror=alert(1)>',r={plan:danger,conclusion:danger,trials:[{...q,note:danger}]},html=m.carbonateExposureReport(r);assert.ok(!html.includes(danger));assert.ok(html.includes('&lt;img'));const payload=html.match(/<script id="carbonate-exposure-record-inputs" type="application\/json">(.*?)<\/script>/s)[1];assert.deepEqual(JSON.parse(payload),r);
});

import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {loadTs} from '../../../tests/load-ts.mjs';
const dir='reports/chemistry-expansion/CL-0041/';
const before=JSON.parse(readFileSync(dir+'record-before-reload.json'));
const after=JSON.parse(readFileSync(dir+'record-after-reload.json'));
assert.deepEqual(after,before);assert.equal(after.rows.length,30);
const {decantationState}=await loadTs('src/lib/chemistry/sedimentationDecantation.ts');
const {decantationCalculations}=await loadTs('src/lib/chemistry/decantationRecord.ts');
const fields=['settledSandG','sourceSuspendedSandG','receiverSandG','receiverWaterMl','sourceWaterMl','retainedSandPercent','sourceWetResidueG'];
for(const row of after.rows){const s=decantationState(+row[1],+row[2],+row[3]);fields.forEach((key,i)=>assert.ok(Math.abs(s[key]-Number(row[i+4]))<.000005,`trial ${row[0]} ${key}`));}
const html=readFileSync(dir+'downloaded-practical.html','utf8');
assert.equal((html.match(/<h3>Trial /g)||[]).length,30);
for(const label of ['Formula:','Substitution:','Result:'])assert.equal(html.split(label).length-1,420);
for(const heading of ['Aim','Apparatus and model','Prediction','Procedure','Observation table','Result and conclusion','Precautions and limitations'])assert.ok(html.includes('<h2>'+heading+'</h2>'));
assert.ok(html.includes(after.prediction));assert.ok(html.includes(after.conclusion));assert.ok(!/https?:\/\//.test(html));
assert.ok(html.includes('white-space:nowrap'));
const current=readFileSync(dir+'early-transfer-calculations.txt','utf8');
for(const c of decantationCalculations(50,2,80)){assert.ok(current.includes(c.title),c.title);assert.ok(current.includes(c.substitution),c.title+' substitution');}
writeFileSync(dir+'practical-record-validation.json',JSON.stringify({passed:true,actualGuiRows:30,exactReloadPersistence:true,comparedNumericReadings:210,downloadedTrialSections:30,workedCalculations:420,renderedCurrentSubstitutions:14,externalUrls:false,scope:'Actual browser record and downloaded HTML; screen layout tested separately, physical print not certified.'},null,2));
console.log('30 GUI rows, 210 readings, 420 exported calculations and exact persistence passed');

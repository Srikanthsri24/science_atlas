import {validateElectrolysis,electrolysisState,electrolysisGuide,electrolysisConstants as C,type ElectrolysisInputs} from './waterElectrolysis';
export interface ElectrolysisTrial extends ElectrolysisInputs{guideBase:ElectrolysisInputs|null;guideSeconds:number|null;note:string}
export interface ElectrolysisRecord{plan:string;conclusion:string;trials:ElectrolysisTrial[]}
const clean=(x:unknown)=>typeof x==='string'?x.slice(0,4000):'',f=(x:number|null)=>x===null?'Unavailable':Number(x.toPrecision(12)).toString(),esc=(x:unknown)=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function validateElectrolysisTrial(raw:unknown):ElectrolysisTrial{
 const q=validateElectrolysis(raw),r=raw as ElectrolysisTrial;let base:ElectrolysisInputs|null=null;
 if(r.guideSeconds===null){if(r.guideBase!==null)throw new RangeError('Manual record has no guide base')}
 else{if(typeof r.guideSeconds!=='number')throw new TypeError('Explicit guide time or manual null required');base=validateElectrolysis(r.guideBase);const expected=electrolysisGuide(r.guideSeconds,base).inputs;if(JSON.stringify(q)!==JSON.stringify(expected))throw new RangeError('Observation differs from original guide conditions/time')}
 return{...q,guideBase:base,guideSeconds:r.guideSeconds,note:clean(r.note)};
}
export function validateElectrolysisRecord(raw:unknown):ElectrolysisRecord{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Electrolysis notebook required');const r=raw as ElectrolysisRecord;if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('At most40observations');return{plan:clean(r.plan),conclusion:clean(r.conclusion),trials:r.trials.map(validateElectrolysisTrial)};
}
export function electrolysisSnapshotLabel(t:ElectrolysisTrial){return t.guideSeconds===null?'Manual source-history snapshot':t.guideSeconds<140?'Guided snapshot before verification':'Verified guided reference'}
export const electrolysisHeaders=[
 ['Trial','Source history: A, s, connection','Configured current (A)','Source connected now?','Gas temperature (°C)','Common dry-gas pressure (kPa)','Each tube capacity (mL)','Guide seconds or manual','Snapshot status','Student observation'],
 ['Trial','Elapsed physical time (s)','Passed charge (C)','Electron amount (mol)','H2 generated (mol)','O2 generated (mol)','Water consumed (mol)','Active current now (A)'],
 ['Trial','H2 dry-equivalent generated (mL)','H2 retained (mL)','H2 overflow (mL)','O2 dry-equivalent generated (mL)','O2 retained (mL)','O2 overflow (mL)','Generated H2/O2 volume ratio','Retained H2/O2 volume ratio'],
 ['Trial','Temperature (K)','Pressure (Pa)','H2 compartment fill fraction','O2 compartment fill fraction','Gas-volume interpretation'],
];
export function electrolysisRows(q:ElectrolysisTrial,index:number){const s=electrolysisState(q);return[
 [index+1,q.history.map(r=>`${f(r.currentA)} A × ${f(r.durationS)} s (${r.connected?'connected':'disconnected'})`).join('; ')||'No passed-time segments',f(q.currentA),q.connected?'Yes':'No',f(q.temperatureC),f(q.pressureKPa),f(q.capacityMl),q.guideSeconds??'Manual',electrolysisSnapshotLabel(q),q.note],
 [index+1,...[s.elapsedS,s.chargeC,s.electronMoles,s.hydrogenMol,s.oxygenMol,s.waterConsumedMol,s.activeCurrentA].map(f)],
 [index+1,...[s.hydrogenGeneratedMl,s.hydrogenRetainedMl,s.hydrogenOverflowMl,s.oxygenGeneratedMl,s.oxygenRetainedMl,s.oxygenOverflowMl,s.generatedVolumeRatio,s.retainedVolumeRatio].map(f)],
 [index+1,f(s.temperatureK),f(s.pressurePa),f(s.hydrogenFillFraction),f(s.oxygenFillFraction),'Compensated dry-equivalent volumes at common T/P; not raw wet-gas meniscus measurements.'],
]}
export interface ElectrolysisWorking{key:string;title:string;formula:string;substitution:string;result:number|null;unit:string;reason:string}
export function electrolysisCalculations(q:ElectrolysisInputs):ElectrolysisWorking[]{
 const s=electrolysisState(q),blocks:ElectrolysisWorking[]=[];
 const add=(key:string,title:string,formula:string,substitution:string,result:number|null,unit:string,reason='')=>blocks.push({key,title,formula,substitution,result,unit,reason});
 add('elapsed','Elapsed physical time','t = sum(segment durations)',q.history.length?q.history.map(r=>r.durationS).join(' + '):'0',s.elapsedS,'s');
 q.history.forEach((r,i)=>add(`segment${i}`,`Charge in segment ${i+1}`,'Qsegment = connectedFlag × I × duration',`${r.connected?1:0} * ${r.currentA} * ${r.durationS}`,r.connected?r.currentA*r.durationS:0,'C'));
 add('charge','Total passed charge','Q = sum(connectedFlag × I × duration)',q.history.length?q.history.map(r=>`(${r.connected?1:0} * ${r.currentA} * ${r.durationS})`).join(' + '):'0',s.chargeC,'C','Source changes never rewrite earlier charge.');
 add('electrons','Electron amount','ne = Q / F',`${s.chargeC} / ${C.faradayCMol}`,s.electronMoles,'mol');
 add('hydrogen','Hydrogen generated at negative cathode','nH2 = Q / (2 × F)',`${s.chargeC} / (2 * ${C.faradayCMol})`,s.hydrogenMol,'mol');
 add('oxygen','Oxygen generated at positive anode','nO2 = Q / (4 × F)',`${s.chargeC} / (4 * ${C.faradayCMol})`,s.oxygenMol,'mol');
 add('water','Net water consumption','nH2O = 2 × nO2',`2 * ${s.oxygenMol}`,s.waterConsumedMol,'mol');
 add('temperature','Convert gas temperature','T = temperatureC + 273.15',`${q.temperatureC} + 273.15`,s.temperatureK,'K');
 add('pressure','Convert gas pressure','P = pressureKPa × 1000',`${q.pressureKPa} * 1000`,s.pressurePa,'Pa');
 for(const [id,mol,generated,retained,overflow]of[['H2',s.hydrogenMol,s.hydrogenGeneratedMl,s.hydrogenRetainedMl,s.hydrogenOverflowMl],['O2',s.oxygenMol,s.oxygenGeneratedMl,s.oxygenRetainedMl,s.oxygenOverflowMl]]as const){
  add(`${id}volume`,`${id} dry-equivalent volume`,'VmL = n × R × T / P × 1000000',`${mol} * ${C.gasConstantJMolK} * ${s.temperatureK} / ${s.pressurePa} * 1000000`,generated,'mL','Ideal dry gas at common stated T/P; no vapour or hydrostatic correction is claimed.');
  add(`${id}retained`,`${id} retained volume`,'Vretained = min(capacity, Vgenerated)',`min(${q.capacityMl}, ${generated})`,retained,'mL');
  add(`${id}overflow`,`${id} overflow account`,'Voverflow = Vgenerated - Vretained',`${generated} - ${retained}`,overflow,'mL');
  add(`${id}balance`,`${id} volume-account check`,'Vgenerated = Vretained + Voverflow',`${retained} + ${overflow}`,generated,'mL');
  add(`${id}fill`,`${id} compartment fill`,'fill = Vretained / capacity',`${retained} / ${q.capacityMl}`,retained/q.capacityMl,'1');
 }
 add('generatedRatio','Generated gas-volume ratio','ratioGenerated = VH2generated / VO2generated',s.generatedVolumeRatio===null?'Not evaluated':`${s.hydrogenGeneratedMl} / ${s.oxygenGeneratedMl}`,s.generatedVolumeRatio,'1',s.generatedVolumeRatio===null?'No gas has been generated; a measured ratio is unavailable.':'The ideal generated ratio is2 at common T/P.');
 add('retainedRatio','Retained gas-volume ratio','ratioRetained = VH2retained / VO2retained',s.retainedVolumeRatio===null?'Not evaluated':`${s.hydrogenRetainedMl} / ${s.oxygenRetainedMl}`,s.retainedVolumeRatio,'1','Finite tube capacity may change the retained ratio; keep overflow in the account.');
 return blocks;
}
export const electrolysisProcedure=[
 'State your prediction and identify negative cathode/H2 and positive anode/O2. The virtual cell assumes sufficient acidified water with an inert non-chloride supporting electrolyte.',
 'Start a fresh comparison with stated current, gas temperature, dry-gas pressure and tube capacity. Changing temperature, pressure or capacity starts a fresh trial.',
 'Run a known interval. Record every current-duration-connection segment; disconnected intervals add elapsed time but no passed charge.',
 'Pause before recording. Read generated, retained and overflow volumes separately. The tube levels represent compensated dry-equivalent gas, not raw wet-gas meniscus readings.',
 'Apply Q=sum(It) over connected intervals, then nH2=Q/(2F) and nO2=Q/(4F). Convert temperature to kelvin and pressure to pascals before using V=nRT/P.',
 'Compare the generated volumes at common T/P. If a tube saturates, include its overflow; do not infer a new chemical ratio from capacity-limited retained volumes.',
 'Write an exam-style result with observations, substituted calculations, conclusion and limitations. Bubble-marker counts do not measure gas quantity.',
];
export function electrolysisReport(raw:unknown){const r=validateElectrolysisRecord(raw),rows=r.trials.map(electrolysisRows);return`<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0121 · Water electrolysis practical</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;font-size:12px;margin:20px 0}td,th{border:1px solid #ccd4df;padding:7px;text-align:left;overflow-wrap:anywhere}article{break-inside:avoid;border-bottom:1px solid #ddd;padding:10px}code{overflow-wrap:anywhere}@media print{body{margin:0}table{font-size:9px}}</style><h1>Water electrolysis: charge and gas-volume accounts</h1><p>VisionariesAI Labs Private Limited · CL-0121</p><h2>Aim</h2><p>Relate passed charge to ideal hydrogen and oxygen amounts and compare generated versus capacity-limited retained gas volumes.</p><h2>Apparatus</h2><p>Virtual regulated DC source, inert electrodes, non-chloride supporting electrolyte, separate graduated gas-volume accounts and timer.</p><h2>Safety</h2><p>Virtual investigation only; no real gases are generated. A real electrolysis practical requires teacher supervision, approved equipment, suitable ventilation and controlled chemicals. Never connect household mains to liquids or ignite collected gases.</p><h2>Prediction and plan</h2><p>${esc(r.plan)}</p><h2>Procedure</h2><ol>${electrolysisProcedure.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h2>Observations</h2>${electrolysisHeaders.map((headers,i)=>`<table><thead><tr>${headers.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr>${x[i].map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('')}<h2>Worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${electrolysisCalculations(q).map(w=>`<article data-trial="${i}" data-key="${w.key}"><h4>${esc(w.title)}</h4><p class="formula">${esc(w.formula)}</p><code>${esc(w.substitution)}</code><p class="result">${w.result===null?'Unavailable':esc(f(w.result)+' '+w.unit)}</p><p>${esc(w.reason)}</p></article>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and limitations</h2><p>Unity Faradaic efficiency, supplied regulated current, sufficient acidified water and inert non-chloride support. No current-voltage/overpotential, gas solubility, crossover, vapour, hydrostatic, thermal or reaction-kinetics solver. Geometry and levels show dry-equivalent reference-volume accounting; bubble markers are explanatory. Changing T/P/capacity starts a fresh run; overflow is not a path-dependent pressure simulation. F=${C.faradayCMol} C/mol; R=${C.gasConstantJMolK} J/(mol K), derived from exact SI defining constants. Internal functional review is not independent expert or official curriculum certification.</p><script id="water-electrolysis-record-inputs" type="application/json">${JSON.stringify(r).replace(/</g,'\\u003c')}</script></html>`}

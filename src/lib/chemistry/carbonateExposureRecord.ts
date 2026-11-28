import {validateCarbonateExposure,carbonateExposureState,carbonateExposureConstants as c,type CarbonateExposureInputs} from './carbonateExposure';
export interface CarbonateExposureTrial extends CarbonateExposureInputs {note:string}
export interface CarbonateExposureRecord {plan:string;conclusion:string;trials:CarbonateExposureTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
const f=(v:number)=>v.toPrecision(17);
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function validateCarbonateExposureRecord(raw:unknown):CarbonateExposureRecord {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Carbonate exposure record required');
 const r=raw as Record<string,unknown>;
 if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('0–40 observations supported');
 return {plan:text(r.plan),conclusion:text(r.conclusion),trials:r.trials.map(v=>({...validateCarbonateExposure(v),note:text((v as Record<string,unknown>).note)}))};
}
export const carbonateExposurePreparationFields=['specimenG','areaCm2','acidMmolL','deliveredMl','contactFraction','captureFraction','temperatureK','pressureKPa'] as const;
export const carbonateExposurePreparationHeaders=['Trial','Initial specimen g','Plan area cm²','Selected acid mmol/L','Exposure mL','Contact fraction','Capture fraction','Temperature K','Pressure kPa','Student observation'];
export const carbonateExposureTables=[
 {id:'surface',title:'Specimen and reaction observations',fields:[['Initial specimen g','initialSpecimenG'],['Acid strength mmol/L','acidMmolL'],['Contact acid mol','contactAcidMol'],['Carbonate reacted mol','reactedCarbonateMol'],['Specimen loss g','specimenLostG'],['Specimen remaining g','remainingSpecimenG'],['Surface removed mm','removedDepthMm'],['Required exposure mL (undefined for water, no access or blank)','requiredDoseMl']]},
 {id:'gas',title:'Runoff and gas observations',fields:[['Contact stream mL','contactStreamMl'],['Bypass mL','bypassStreamMl'],['Calcium mol','calciumMol'],['Nitrate mol','nitrateMol'],['Unreacted acid mol','remainingAcidMol'],['Generated water g','generatedWaterG'],['Captured dry-gas equivalent mL','capturedGasMl'],['Escaped CO₂ g','escapedGasG']]},
 {id:'balance',title:'Material and charge checks',fields:[['Initial material g','initialAccountG'],['Retained material g','retainedAccountG'],['Retained plus escaped g','accountIncludingEscapeG'],['Material residual g','materialResidualG'],['Aqueous charge residual mol charge','aqueousChargeResidualMol'],['Remaining stock g','remainingStockG'],['Runoff g','effluentG']]}
] as const;
export function carbonateExposurePreparationValues(q:CarbonateExposureTrial,i:number){return [String(i+1),...carbonateExposurePreparationFields.map(k=>f(q[k])),q.note];}
export function carbonateExposureObservationRows(q:CarbonateExposureInputs,i:number,id:string){const t=carbonateExposureTables.find(v=>v.id===id);if(!t)throw new RangeError('Unknown carbonate observation table');return carbonateExposureState(q).cells.map(s=>[String(i+1),s.id,...t.fields.map(([,k])=>s[k]===null?'Undefined':f(s[k] as number))]);}
export function carbonateExposureCalculations(raw:CarbonateExposureInputs){
 const q=validateCarbonateExposure(raw),blocks:{key:string;group:string;title:string;formula:string;substitution:string;result:string;unit:string}[]=[];
 for(const s of carbonateExposureState(q).cells){
 const add=(key:string,title:string,formula:string,substitution:string,value:number|null,unit:string)=>blocks.push({key:s.id+'.'+key,group:s.id,title,formula,substitution,result:value===null?'Undefined — no specimen, no acid or no contact':f(value)+' '+unit,unit});
 add('initialCarbonateMol','Initial carbonate','n₀ = m₀ / MCaCO₃',`${f(s.initialSpecimenG)} / ${f(c.carbonateGmol)}`,s.initialCarbonateMol,'mol');
 add('deliveredAcidMol','Delivered acid','nH = c × V / 10⁶',`${f(s.acidMmolL)} × ${f(q.deliveredMl)} / 1000000`,s.deliveredAcidMol,'mol');
 add('contactStreamMl','Contact stream','Vc = V × contact fraction',`${f(q.deliveredMl)} × ${f(q.contactFraction)}`,s.contactStreamMl,'mL');
 add('bypassStreamMl','Bypass stream','Vb = V − Vc',`${f(q.deliveredMl)} − ${f(s.contactStreamMl)}`,s.bypassStreamMl,'mL');
 add('contactAcidMol','Accessible acid','nH,c = nH × contact fraction',`${f(s.deliveredAcidMol)} × ${f(q.contactFraction)}`,s.contactAcidMol,'mol');
 add('reactedCarbonateMol','Limiting reactant','n = min(n₀, nH,c / 2); blank = 0',`min(${f(s.initialCarbonateMol)}, ${f(s.contactAcidMol)} / 2); no specimen → 0`,s.reactedCarbonateMol,'mol');
 add('acidConsumedMol','Acid consumed','nH,used = 2n',`2 × ${f(s.reactedCarbonateMol)}`,s.acidConsumedMol,'mol');
 add('remainingAcidMol','Unreacted acid','nH,left = max(0, nH − 2n)',`max(0, ${f(s.deliveredAcidMol)} − ${f(s.acidConsumedMol)})`,s.remainingAcidMol,'mol');
 add('specimenLostG','Specimen mass lost','Δm = n × MCaCO₃',`${f(s.reactedCarbonateMol)} × ${f(c.carbonateGmol)}`,s.specimenLostG,'g');
 add('remainingSpecimenG','Remaining solid','m = m₀ − Δm',`${f(s.initialSpecimenG)} − ${f(s.specimenLostG)}`,s.remainingSpecimenG,'g');
 add('removedDepthMm','Uniform surface loss','Δd = Δm / (ρ × A) × 10',`${f(s.specimenLostG)} / (${f(c.calciteDensityGml)} × ${f(q.areaCm2)}) × 10`,s.removedDepthMm,'mm');
 add('calciumMol','Runoff calcium','nCa = n',`${f(s.reactedCarbonateMol)}`,s.calciumMol,'mol');
 add('nitrateMol','Nitrate retained','nNO₃ = nH,delivered',`${f(s.deliveredAcidMol)}`,s.nitrateMol,'mol');
 add('generatedWaterG','Generated water','mH₂O = n × MH₂O',`${f(s.reactedCarbonateMol)} × ${f(c.waterGmol)}`,s.generatedWaterG,'g');
 add('carbonDioxideG','Carbon dioxide produced','mCO₂ = n × MCO₂',`${f(s.reactedCarbonateMol)} × ${f(c.carbonDioxideGmol)}`,s.carbonDioxideG,'g');
 add('capturedGasMol','Captured gas','nCaptured = n × capture fraction',`${f(s.reactedCarbonateMol)} × ${f(q.captureFraction)}`,s.capturedGasMol,'mol');
 add('escapedGasMol','Escaped gas','nEscaped = n − nCaptured',`${f(s.reactedCarbonateMol)} − ${f(s.capturedGasMol)}`,s.escapedGasMol,'mol');
 add('capturedGasMl','Dry ideal-gas equivalent','V = nCaptured × R × T / P × 1000',`${f(s.capturedGasMol)} × ${f(c.gasR)} × ${f(q.temperatureK)} / ${f(q.pressureKPa)} × 1000`,s.capturedGasMl,'mL');
 add('escapedGasG','Gas leaving apparatus','mEscaped = nEscaped × MCO₂',`${f(s.escapedGasMol)} × ${f(c.carbonDioxideGmol)}`,s.escapedGasG,'g');
 add('stockAcidMol','Finite initial stock','nStock = c × 1000 / 10⁶',`${f(s.acidMmolL)} × 1000 / 1000000`,s.stockAcidMol,'mol');
 add('remainingStockAcidMol','Acid left in stock','nLeft = nStock − nH',`${f(s.stockAcidMol)} − ${f(s.deliveredAcidMol)}`,s.remainingStockAcidMol,'mol');
 add('deliveredCarrierG','Delivered carrier','mCarrier = V × 1 − nH × MHNO₃',`${f(q.deliveredMl)} × 1 − ${f(s.deliveredAcidMol)} × ${f(c.nitricAcidGmol)}`,s.deliveredCarrierG,'g');
 add('aqueousSolutesG','Runoff ion mass','mIons = nCa MCa + nNO₃ MNO₃ + nH,left MH',`${f(s.calciumMol)} × ${f(c.Ca)} + ${f(s.nitrateMol)} × ${f(c.nitrateGmol)} + ${f(s.remainingAcidMol)} × ${f(c.H)}`,s.aqueousSolutesG,'g');
 add('effluentG','Runoff material','mRunoff = mCarrier + mGeneratedWater + mIons',`${f(s.deliveredCarrierG)} + ${f(s.generatedWaterG)} + ${f(s.aqueousSolutesG)}`,s.effluentG,'g');
 add('retainedAccountG','Retained apparatus material','mRetained = mSolid + mRunoff + mCapturedCO₂ + mStock,left',`${f(s.remainingSpecimenG)} + ${f(s.effluentG)} + ${f(s.capturedGasG)} + ${f(s.remainingStockG)}`,s.retainedAccountG,'g');
 add('materialResidualG','Full material balance','εm = mRetained + mEscaped − mInitial',`${f(s.retainedAccountG)} + ${f(s.escapedGasG)} − ${f(s.initialAccountG)}`,s.materialResidualG,'g');
 add('aqueousChargeResidualMol','Aqueous charge balance','εq = 2nCa + nH,left − nNO₃',`2 × ${f(s.calciumMol)} + ${f(s.remainingAcidMol)} − ${f(s.nitrateMol)}`,s.aqueousChargeResidualMol,'mol charge');
 add('requiredDoseMl','Exposure for complete removal','VRequired = 2n₀ / (c × contact fraction) × 10⁶',`2 × ${f(s.initialCarbonateMol)} / (${f(s.acidMmolL)} × ${f(q.contactFraction)}) × 1000000; undefined without specimen, acid or contact`,s.requiredDoseMl,'mL');
 }return blocks;
}
export const carbonateExposureProcedure=[
 'Write an aim and prediction. Compare water, half-strength acid, selected acid and a no-specimen reagent blank using the same exposure volume.',
 'Record initial mass, planar area, acid-equivalent concentration, temperature, pressure, contact fraction and gas-capture fraction before changing any control.',
 'Pause at a selected cumulative exposure and record all four cells as one trial. Repeat at several exposure volumes; keep the other controls fixed for a fair comparison.',
 'Copy solid mass, removed depth, calcium, acid remaining and dry-gas equivalent into the corresponding observation tables with units. Record what was visible separately from model calculations.',
 'Apply the 2:1 acid-to-carbonate ratio, identify the limiting reactant, substitute the recorded values and calculate mass loss and gas equivalents. Check mass and aqueous-charge residuals.',
 'Explain the difference between specimen loss and whole-apparatus loss: dissolved calcium stays in runoff, captured gas stays inside, and only escaped gas leaves the accounted apparatus.',
 'Write a result and conclusion supported by your trials. State that this defined acid reference does not predict natural-rain pH, monument erosion rate or equilibrium carbonate dissolution.'
];
export const carbonateExposureLimitations=[
 'A defined nitric-acid-equivalent teaching preparation, not measured rainwater. Acid capacity is supplied explicitly and is not inferred from pH.',
 'Instantaneous stoichiometric reaction endpoint with ideal complete CO₂ stripping. Dissolved carbonate species, atmospheric carbonic-acid weathering, gypsum and reaction kinetics are omitted.',
 'Uniform thinning at fixed planar area; calcite reference density 2.71 g/mL. The surface view may require a labelled magnification. No roughness or pitting law is predicted.',
 'Prepared solution density is selected as 1 g/mL. Carrier mass excludes acid solute; gas volume is a dry ideal-gas equivalent at selected temperature and pressure.',
 'Each cell has its own finite 1000 mL stock. The 120-second sequence stages laboratory delivery and interpretation, not elapsed environmental weathering time.',
 'The blank has no carbonate specimen. Required removal volume is undefined for the blank, water control or zero contact. A computed requirement may exceed available stock.',
 'Virtual investigation: numerical outputs are model results, not experimental measurements. A classroom activity involving acids requires a teacher-approved procedure and suitable protection.'
];
export function carbonateExposureReport(raw:CarbonateExposureRecord){
 const r=validateCarbonateExposureRecord(raw);
 const table=(headers:readonly string[],rows:string[][])=>`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const payload=JSON.stringify(r).replace(/</g,'\\u003c');
 return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0111 Carbonate surface practical</title><style>body{font:16px/1.5 system-ui;max-width:1100px;margin:auto;padding:24px;color:#172238}table{border-collapse:collapse;display:block;overflow:auto;max-width:100%}th,td{border:1px solid #ccd4e0;padding:8px;vertical-align:top}.worked{border-bottom:1px solid #ddd;padding:12px 0;overflow-wrap:anywhere}@media print{body{max-width:none;padding:0}table{font-size:10px}}</style><body><h1>Carbonate surface and defined acid exposure — practical record</h1><p>Science Atlas 360° · VisionariesAI Labs Private Limited · CL-0111</p><h2>Aim and prediction</h2><p>${esc(r.plan)}</p><h2>Apparatus and principle</h2><p>Matched finite feed reservoirs, contact and bypass streams, carbonate slabs, runoff collectors and ideal dry-gas capture accounts. CaCO₃ + 2 H⁺ → Ca²⁺ + CO₂ + H₂O; nitrate counterions remain in solution.</p><h2>Procedure and recording instructions</h2><ol>${carbonateExposureProcedure.map(v=>`<li>${esc(v)}</li>`).join('')}</ol><h2>Preparation observations</h2>${table(carbonateExposurePreparationHeaders,r.trials.map(carbonateExposurePreparationValues))}${carbonateExposureTables.map(t=>`<h2>${esc(t.title)}</h2>${table(['Trial','Control',...t.fields.map(([h])=>h)],r.trials.flatMap((q,i)=>carbonateExposureObservationRows(q,i,t.id)))}`).join('')}<h2>Formulas, substitutions and worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${carbonateExposureCalculations(q).map(b=>`<section class="worked" data-key="${esc(b.key)}"><h4>${esc(b.group)} · ${esc(b.title)}</h4><p class="formula">${esc(b.formula)}</p><p class="substitution">${esc(b.substitution)}</p><p class="result">${esc(b.result)}</p></section>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and interpretation limits</h2><ul>${carbonateExposureLimitations.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><script id="carbonate-exposure-record-inputs" type="application/json">${payload}</script></body></html>`;
}

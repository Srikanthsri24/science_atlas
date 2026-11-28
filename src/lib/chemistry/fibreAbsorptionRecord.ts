import {validateFibreAbsorption,fibreAbsorptionState,fibreAbsorptionConstants as c,type FibreAbsorptionInputs} from './fibreAbsorption';
export interface FibreAbsorptionTrial extends FibreAbsorptionInputs{note:string}
export interface FibreAbsorptionRecord{plan:string;conclusion:string;trials:FibreAbsorptionTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
const f=(v:number)=>v.toPrecision(17);
const indicationText=(key:string,value:number)=>key.endsWith('MilliG')?value.toFixed(0):['indicatedDryG','indicatedWetG','indicatedWaterG'].includes(key)?value.toFixed(3):f(value);
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function validateFibreAbsorptionRecord(raw:unknown):FibreAbsorptionRecord{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Fibre practical record required');const r=raw as Record<string,unknown>;
 if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('0–40 observations supported');
 return{plan:text(r.plan),conclusion:text(r.conclusion),trials:r.trials.map(v=>({...validateFibreAbsorption(v),note:text((v as Record<string,unknown>).note)}))};
}
export const fibreAbsorptionPreparationFields=['dryMassG','bathMl','soakS','drainS','constructionFactor','retentionScale','wettingScale','panTareG'] as const;
export const fibreAbsorptionPreparationHeaders=['Trial','Dry mass g','Initial water mL','Selected soak s','Selected drain s','Construction factor','Strong retention scale','Wetting scale','Pan tare g','Student observation'];
export const fibreAbsorptionTables=[
 {id:'water',title:'Uptake and drainage observations',fields:[['Capacity reference g','totalCapacityG'],['Water at lift g','uptakeG'],['Strongly retained at lift g','strongAtLiftG'],['Drainable at lift g','drainableAtLiftG'],['Drained into catch g','drainedG'],['Water retained after drain g','retainedG'],['Water left in bath g','remainingBathG']]},
 {id:'balance',title:'Balance indications and normalization',fields:[['Dry gross indication mg','dryGrossMilliG'],['Wet gross indication mg','wetGrossMilliG'],['Tare indication mg','tareMilliG'],['Indicated dry mass g','indicatedDryG'],['Indicated wet mass g','indicatedWetG'],['Indicated retained water g','indicatedWaterG'],['Model retained water g/g dry','retainedGg'],['Model dry-basis gain %','dryBasisGainPercent'],['Model wet-basis water %','wetBasisWaterPercent'],['Indicated dry-basis gain %','indicatedDryBasisGainPercent']]},
 {id:'account',title:'Material balance and indication error',fields:[['Wet coupon model g','wetCouponG'],['Indication minus model water g','indicationErrorG'],['Initial material g','initialMaterialG'],['Final material g','finalMaterialG'],['Water residual g','waterResidualG'],['Material residual g','materialResidualG']]}
] as const;
export function fibreAbsorptionPreparationValues(q:FibreAbsorptionTrial,i:number){return[String(i+1),...fibreAbsorptionPreparationFields.map(k=>f(q[k])),q.note];}
export function fibreAbsorptionObservationRows(q:FibreAbsorptionInputs,i:number,id:string){const t=fibreAbsorptionTables.find(v=>v.id===id);if(!t)throw new RangeError('Unknown fibre table');return fibreAbsorptionState(q).cells.map(s=>[String(i+1),s.id,...t.fields.map(([,k])=>indicationText(k,s[k]))]);}
export function fibreAbsorptionCalculations(raw:FibreAbsorptionInputs){
 const q=validateFibreAbsorption(raw),blocks:{key:string;group:string;title:string;formula:string;substitution:string;result:string;unit:string}[]=[];
 for(const s of fibreAbsorptionState(q).cells){const add=(key:string,title:string,formula:string,substitution:string,value:number,unit:string)=>blocks.push({key:s.id+'.'+key,group:s.id,title,formula,substitution,result:indicationText(key,value)+' '+unit,unit});
 add('strongCapacityG','Strong-retention capacity reference','Cs = md × rs × retention scale',`${f(q.dryMassG)} × ${f(s.strongReferenceGg)} × ${f(q.retentionScale)}`,s.strongCapacityG,'g');
 add('drainableCapacityG','Drainable capacity reference','Cl = md × rl × construction factor',`${f(q.dryMassG)} × ${f(s.drainableReferenceGg)} × ${f(q.constructionFactor)}`,s.drainableCapacityG,'g');
 add('totalCapacityG','Total selected capacity','C = Cs + Cl',`${f(s.strongCapacityG)} + ${f(s.drainableCapacityG)}`,s.totalCapacityG,'g');
 add('soakExponent','Selected wetting exposure','x = wetting scale × soak / τsoak',`${f(q.wettingScale)} × ${f(q.soakS)} / ${f(s.soakTauS)}`,s.soakExponent,'dimensionless');
 add('soakFraction','Unconstrained wetting fraction','F = 1 − exp(−x)',`1 − exp(−${f(s.soakExponent)})`,s.soakFraction,'fraction');
 add('unlimitedUptakeG','Uptake with unlimited bath','U∞ = C × F',`${f(s.totalCapacityG)} × ${f(s.soakFraction)}`,s.unlimitedUptakeG,'g');
 add('initialBathG','Finite initial water','W₀ = V × ρwater',`${f(q.bathMl)} × ${f(c.waterDensityGml)}`,s.initialBathG,'g');
 add('uptakeG','Finite bath cap','U = min(W₀, U∞)',`min(${f(s.initialBathG)}, ${f(s.unlimitedUptakeG)})`,s.uptakeG,'g');
 add('capacityFraction','Filled fraction of both pools','f = U / C',`${f(s.uptakeG)} / ${f(s.totalCapacityG)}`,s.capacityFraction,'fraction');
 add('strongAtLiftG','Strong pool at lift','S = Cs × f',`${f(s.strongCapacityG)} × ${f(s.capacityFraction)}`,s.strongAtLiftG,'g');
 add('drainableAtLiftG','Drainable pool at lift','L₀ = Cl × f',`${f(s.drainableCapacityG)} × ${f(s.capacityFraction)}`,s.drainableAtLiftG,'g');
 add('drainageExponent','Selected drainage exposure','y = drain / τdrain',`${f(q.drainS)} / ${f(s.drainTauS)}`,s.drainageExponent,'dimensionless');
 add('drainFraction','Drained fraction of loose pool','D = 1 − exp(−y)',`1 − exp(−${f(s.drainageExponent)})`,s.drainFraction,'fraction');
 add('drainableRemainingG','Drainable pool still retained','L = L₀ × exp(−y)',`${f(s.drainableAtLiftG)} × exp(−${f(s.drainageExponent)})`,s.drainableRemainingG,'g');
 add('drainedG','Water in catch tray','mCatch = L₀ × D',`${f(s.drainableAtLiftG)} × ${f(s.drainFraction)}`,s.drainedG,'g');
 add('retainedG','All water still in coupon','mWater = S + L',`${f(s.strongAtLiftG)} + ${f(s.drainableRemainingG)}`,s.retainedG,'g');
 add('remainingBathG','Water left in original bath','W = W₀ − U',`${f(s.initialBathG)} − ${f(s.uptakeG)}`,s.remainingBathG,'g');
 add('wetCouponG','True model wet coupon mass','mw = md + mWater',`${f(q.dryMassG)} + ${f(s.retainedG)}`,s.wetCouponG,'g');
 add('dryGrossG','Dry gross model mass','gd = tare + md',`${f(q.panTareG)} + ${f(q.dryMassG)}`,s.dryGrossG,'g');
 add('wetGrossG','Wet gross model mass','gw = tare + mw',`${f(q.panTareG)} + ${f(s.wetCouponG)}`,s.wetGrossG,'g');
 add('tareMilliG','Tare indication','I(m) = floor((m + boundary allowance) × 1000 + 0.5)',`floor((${f(q.panTareG)} + ${f(c.balanceBoundaryAllowanceG)}) × 1000 + 0.5)`,s.tareMilliG,'mg');
 add('dryGrossMilliG','Dry gross indication','I(gd) = floor((gd + boundary allowance) × 1000 + 0.5)',`floor((${f(s.dryGrossG)} + ${f(c.balanceBoundaryAllowanceG)}) × 1000 + 0.5)`,s.dryGrossMilliG,'mg');
 add('wetGrossMilliG','Wet gross indication','I(gw) = floor((gw + boundary allowance) × 1000 + 0.5)',`floor((${f(s.wetGrossG)} + ${f(c.balanceBoundaryAllowanceG)}) × 1000 + 0.5)`,s.wetGrossMilliG,'mg');
 add('indicatedDryG','Tare-corrected dry indication','md,ind = (I(gd) − I(tare)) / 1000',`(${f(s.dryGrossMilliG)} − ${f(s.tareMilliG)}) / 1000`,s.indicatedDryG,'g');
 add('indicatedWetG','Tare-corrected wet indication','mw,ind = (I(gw) − I(tare)) / 1000',`(${f(s.wetGrossMilliG)} − ${f(s.tareMilliG)}) / 1000`,s.indicatedWetG,'g');
 add('indicatedWaterG','Indicated mass gain','Δmind = (I(gw) − I(gd)) / 1000',`(${f(s.wetGrossMilliG)} − ${f(s.dryGrossMilliG)}) / 1000`,s.indicatedWaterG,'g');
 add('retainedGg','Model dry-mass normalization','R = mWater / md',`${f(s.retainedG)} / ${f(q.dryMassG)}`,s.retainedGg,'g/g dry');
 add('dryBasisGainPercent','Model dry-basis gain','Gdry = 100 × mWater / md',`100 × ${f(s.retainedG)} / ${f(q.dryMassG)}`,s.dryBasisGainPercent,'% dry basis');
 add('wetBasisWaterPercent','Model wet-basis water fraction','Gwet = 100 × mWater / mw',`100 × ${f(s.retainedG)} / ${f(s.wetCouponG)}`,s.wetBasisWaterPercent,'% wet basis');
 add('indicatedRetainedGg','Indicated dry-mass normalization','Rind = Δmind / md,ind',`${f(s.indicatedWaterG)} / ${f(s.indicatedDryG)}`,s.indicatedRetainedGg,'g/g dry');
 add('indicatedDryBasisGainPercent','Indicated dry-basis percentage gain','Gind = 100 × indicated water / indicated dry mass',`100 × ${f(s.indicatedWaterG)} / ${f(s.indicatedDryG)}`,s.indicatedDryBasisGainPercent,'% dry basis');
 add('indicationErrorG','Indication minus model','εI = Δmind − mWater',`${f(s.indicatedWaterG)} − ${f(s.retainedG)}`,s.indicationErrorG,'g');
 add('initialMaterialG','Initial material account','mInitial = md + W₀',`${f(q.dryMassG)} + ${f(s.initialBathG)}`,s.initialMaterialG,'g');
 add('finalMaterialG','Final material account','mFinal = mw + W + mCatch',`${f(s.wetCouponG)} + ${f(s.remainingBathG)} + ${f(s.drainedG)}`,s.finalMaterialG,'g');
 add('waterResidualG','Water balance residual','εW = W + mWater + mCatch − W₀',`${f(s.remainingBathG)} + ${f(s.retainedG)} + ${f(s.drainedG)} − ${f(s.initialBathG)}`,s.waterResidualG,'g');
 add('materialResidualG','Whole material balance residual','εm = mFinal − mInitial',`${f(s.finalMaterialG)} − ${f(s.initialMaterialG)}`,s.materialResidualG,'g');
 }return blocks;
}
export const fibreAbsorptionProcedure=[
 'Write the aim and prediction. Use equal dry mass and record the coupon identity, selected construction, wetting and retention references.',
 'Record the dry weighing-pan tare and dry gross indication. Subtract tare to obtain indicated dry mass. Do not confuse grams with milligrams.',
 'Immerse each coupon in its own finite water bath for the same selected soak duration. Record bath volume; a small supply may limit uptake.',
 'Lift clear, transfer above the catch tray and allow the same selected drain duration. Keep collected drainage separate from remaining bath water.',
 'Transfer the drained coupon to a dry pan. Record wet gross indication and use the same tare. Keep water away from the balance mechanism.',
 'Calculate indicated wet minus dry mass, normalize by indicated dry mass and report the selected protocol. Compare this instrument result with the exact model prediction.',
 'Record observations for all four coupons at zero soak, increasing soak times and matched drain times. Change only one factor for each comparison.',
 'Write a conclusion using the recorded evidence. Distinguish dry-basis gain from wet-basis water fraction; mass gain alone does not identify internal absorption, inter-fibre retention or wearer comfort.'
];
export const fibreAbsorptionLimitations=[
 'All strong/drainable capacities and time constants are explicitly selected teaching references, not measured constants for cotton, wool, nylon or polyester.',
 'Two operational water pools share one selected wetting fraction. They are not an experimentally resolved molecular-absorption and capillary-retention decomposition.',
 'Only drainable water leaves during the selected 0–180 s drainage window. Strong-pool desorption, evaporation, humidity exchange, chemical changes and apparatus hold-up are omitted.',
 'The material account covers coupon and water in bath/catch; fixed pan tare and rig are excluded from both sides. Lifting and load transfer are prescribed, not an actuator-force model.',
 'A construction factor changes the drainable capacity; finishes and textile structure can alter real results. No universal natural-versus-synthetic ranking is established.',
 'Water density is selected as 1 g/mL. Coupon shape is a visual reference; the model does not predict fibre swelling or true microscopic pore geometry.',
 'The digital reference has 1 mg divisions. Its 1 pg numerical half-division allowance is a computational boundary rule, not physical measurement uncertainty.',
 'The 120-second guide stages a protocol. Selected soak and drain durations remain separate from presentation time. These immersed-liquid results are not humidity-based moisture regain.'
];
export function fibreAbsorptionReport(raw:FibreAbsorptionRecord){const r=validateFibreAbsorptionRecord(raw),table=(headers:readonly string[],rows:string[][])=>`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,payload=JSON.stringify(r).replace(/</g,'\\u003c');
 return`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0112 Fibre absorption practical</title><style>body{font:16px/1.5 system-ui;max-width:1100px;margin:auto;padding:24px;color:#172238}table{border-collapse:collapse;display:block;overflow:auto;max-width:100%}th,td{border:1px solid #ccd4e0;padding:8px;vertical-align:top}.worked{border-bottom:1px solid #ddd;padding:12px 0;overflow-wrap:anywhere}@media print{body{max-width:none;padding:0}table{font-size:10px}}</style><body><h1>Fibre soaking, drainage and mass gain — practical record</h1><p>Science Atlas 360° · VisionariesAI Labs Private Limited · CL-0112</p><h2>Aim and prediction</h2><p>${esc(r.plan)}</p><h2>Apparatus and principle</h2><p>Matched dry coupons, separate finite water baths, lifting supports, drainage catch trays and a dry weighing pan with a 1 mg digital reference. Follow operational retained/drainable water accounts and subtract the same tare from dry and wet gross indications.</p><h2>Procedure and recording instructions</h2><ol>${fibreAbsorptionProcedure.map(v=>`<li>${esc(v)}</li>`).join('')}</ol><h2>Preparation observations</h2>${table(fibreAbsorptionPreparationHeaders,r.trials.map(fibreAbsorptionPreparationValues))}${fibreAbsorptionTables.map(t=>`<h2>${esc(t.title)}</h2>${table(['Trial','Coupon',...t.fields.map(([h])=>h)],r.trials.flatMap((q,i)=>fibreAbsorptionObservationRows(q,i,t.id)))}`).join('')}<h2>Formulas, substitutions and worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${fibreAbsorptionCalculations(q).map(b=>`<section class="worked" data-key="${esc(b.key)}"><h4>${esc(b.group)} · ${esc(b.title)}</h4><p class="formula">${esc(b.formula)}</p><p class="substitution">${esc(b.substitution)}</p><p class="result">${esc(b.result)}</p></section>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and interpretation limits</h2><ul>${fibreAbsorptionLimitations.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><script id="fibre-absorption-record-inputs" type="application/json">${payload}</script></body></html>`;
}

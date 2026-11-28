import{validateSoapHardness,soapHardnessState,soapHardnessConstants as c,type SoapHardnessInputs}from'./soapHardness';
export interface SoapHardnessTrial extends SoapHardnessInputs{note:string}
export interface SoapHardnessRecord{plan:string;conclusion:string;trials:SoapHardnessTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
const f=(v:number)=>v.toPrecision(17);
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function validateSoapHardnessRecord(raw:unknown):SoapHardnessRecord{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Soap-hardness record required');
 const r=raw as Record<string,unknown>;
 if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('0–40 observations supported');
 return{plan:text(r.plan),conclusion:text(r.conclusion),trials:r.trials.map(v=>({...validateSoapHardness(v),note:text((v as Record<string,unknown>).note)}))};
}
export const soapHardnessPreparationFields=['sampleMl','calciumMmolL','magnesiumMmolL','soapMolL','deliveredMl','agitationCycles']as const;
export const soapHardnessPreparationHeaders=['Trial','Sample mL','Selected calcium mmol/L','Selected magnesium mmol/L','Soap stock mol/L','Delivered soap mL','Selected agitation cycles','Student observation'];
export const soapHardnessTables=[
 {id:'ions',title:'Ion removal and free soap',fields:[['Initial calcium mol','calciumMol'],['Initial magnesium mol','magnesiumMol'],['Soap delivered mol','deliveredSoapMol'],['Calcium precipitated mol','calciumPrecipitatedMol'],['Magnesium precipitated mol','magnesiumPrecipitatedMol'],['Calcium remaining mol','calciumRemainingMol'],['Magnesium remaining mol','magnesiumRemainingMol'],['Bound oleate mol','boundOleateMol'],['Free oleate mol','freeOleateMol']]},
 {id:'hardness',title:'Hardness, dilution and qualitative lather',fields:[['Initial hardness mg/L as CaCO₃','initialHardnessMgL'],['Dilution-only hardness mg/L as CaCO₃','dilutionOnlyHardnessMgL'],['Residual hardness mg/L as CaCO₃','residualHardnessMgL'],['Stoichiometric soap requirement mL','stoichiometricSoapMl'],['Free soap mmol/L nominal mixture','freeSoapMmolL'],['Chosen foam proxy (0–1; not height)','foamProxy'],['Calcium soap equivalent g','calciumSoapG'],['Magnesium soap equivalent g','magnesiumSoapG']]},
 {id:'account',title:'Stock, material and aqueous charge accounts',fields:[['Soap stock remaining mol','remainingStockSoapMol'],['Remaining stock g','remainingStockG'],['Final vessel g','vesselFinalG'],['Initial total account g','initialAccountG'],['Final total account g','finalAccountG'],['Material residual g','materialResidualG'],['Aqueous charge residual mol charge','aqueousChargeResidualMol'],['Oleate residual mol','oleateResidualMol']]}
]as const;
export function soapHardnessPreparationValues(q:SoapHardnessTrial,i:number){return[String(i+1),...soapHardnessPreparationFields.map(k=>f(q[k])),q.note];}
export function soapHardnessObservationRows(q:SoapHardnessInputs,i:number,id:string){const t=soapHardnessTables.find(v=>v.id===id);if(!t)throw new RangeError('Unknown soap observation table');return soapHardnessState(q).cells.map(s=>[String(i+1),s.id,...t.fields.map(([,k])=>f(s[k]))]);}
export function soapHardnessCalculations(raw:SoapHardnessInputs){
 const q=validateSoapHardness(raw),blocks:{key:string;group:string;title:string;formula:string;substitution:string;result:string;unit:string}[]=[];
 for(const s of soapHardnessState(q).cells){
  const add=(key:string,title:string,formula:string,substitution:string,value:number,unit:string)=>blocks.push({key:s.id+'.'+key,group:s.id,title,formula,substitution,result:`${f(value)} ${unit}`,unit});
  const ca=s.id==='calcium'||s.id==='mixed'?q.calciumMmolL:0,mg=s.id==='magnesium'||s.id==='mixed'?q.magnesiumMmolL:0;
  add('calciumMol','Initial calcium','nCa = cCa(mmol/L) × V(mL) / 10⁶',`${f(ca)} × ${f(q.sampleMl)} / 1000000`,s.calciumMol,'mol');
  add('magnesiumMol','Initial magnesium','nMg = cMg(mmol/L) × V(mL) / 10⁶',`${f(mg)} × ${f(q.sampleMl)} / 1000000`,s.magnesiumMol,'mol');
  add('hardnessMol','Initial divalent-ion inventory','nH = nCa + nMg',`${f(s.calciumMol)} + ${f(s.magnesiumMol)}`,s.hardnessMol,'mol');
  add('stockSoapMol','Finite soap stock','nStock = cSoap × VStock / 1000',`${f(q.soapMolL)} × 20 / 1000`,s.stockSoapMol,'mol');
  add('deliveredSoapMol','Delivered soap','nDelivered = cSoap × VDelivered / 1000',`${f(q.soapMolL)} × ${f(q.deliveredMl)} / 1000`,s.deliveredSoapMol,'mol');
  add('remainingStockSoapMol','Soap left in stock','nLeft = nStock − nDelivered',`${f(s.stockSoapMol)} − ${f(s.deliveredSoapMol)}`,s.remainingStockSoapMol,'mol');
  add('precipitatedMetalMol','Limiting reagent','nPrecipitated = min(nH, nDelivered / 2)',`min(${f(s.hardnessMol)}, ${f(s.deliveredSoapMol)} / 2)`,s.precipitatedMetalMol,'mol');
  add('reactedFraction','Chosen proportional allocation',s.hardnessMol>0?'r = nPrecipitated / nH':'r = 0 when no initial divalent ions',s.hardnessMol>0?`${f(s.precipitatedMetalMol)} / ${f(s.hardnessMol)}`:'0',s.reactedFraction,'fraction');
  add('calciumPrecipitatedMol','Calcium in soap equivalent','nCa,p = nCa × r',`${f(s.calciumMol)} × ${f(s.reactedFraction)}`,s.calciumPrecipitatedMol,'mol');
  add('magnesiumPrecipitatedMol','Magnesium in soap equivalent','nMg,p = nMg × r',`${f(s.magnesiumMol)} × ${f(s.reactedFraction)}`,s.magnesiumPrecipitatedMol,'mol');
  add('calciumRemainingMol','Calcium still in solution','nCa,r = nCa − nCa,p',`${f(s.calciumMol)} − ${f(s.calciumPrecipitatedMol)}`,s.calciumRemainingMol,'mol');
  add('magnesiumRemainingMol','Magnesium still in solution','nMg,r = nMg − nMg,p',`${f(s.magnesiumMol)} − ${f(s.magnesiumPrecipitatedMol)}`,s.magnesiumRemainingMol,'mol');
  add('boundOleateMol','Two soap anions per divalent ion','nBound = 2 × nPrecipitated',`2 × ${f(s.precipitatedMetalMol)}`,s.boundOleateMol,'mol');
  add('freeOleateMol','Excess soap','nFree = max(0, nDelivered − nBound)',`max(0, ${f(s.deliveredSoapMol)} − ${f(s.boundOleateMol)})`,s.freeOleateMol,'mol');
  add('nominalFinalMl','Nominal additive mixture volume','VNominal = VSample + VDelivered',`${f(q.sampleMl)} + ${f(q.deliveredMl)}`,s.nominalFinalMl,'mL');
  add('initialHardnessMgL','Initial calcium-carbonate equivalent','HInitial = nH × MCaCO₃ × 10⁶ / VSample',`${f(s.hardnessMol)} × ${f(c.calciumCarbonate)} × 1000000 / ${f(q.sampleMl)}`,s.initialHardnessMgL,'mg/L as CaCO₃');
  add('dilutionOnlyHardnessMgL','Dilution without ion removal','HDilution = nH × MCaCO₃ × 10⁶ / VNominal',`${f(s.hardnessMol)} × ${f(c.calciumCarbonate)} × 1000000 / ${f(s.nominalFinalMl)}`,s.dilutionOnlyHardnessMgL,'mg/L as CaCO₃');
  add('residualHardnessMgL','Residual divalent ions','HResidual = (nCa,r + nMg,r) × MCaCO₃ × 10⁶ / VNominal',`(${f(s.calciumRemainingMol)} + ${f(s.magnesiumRemainingMol)}) × ${f(c.calciumCarbonate)} × 1000000 / ${f(s.nominalFinalMl)}`,s.residualHardnessMgL,'mg/L as CaCO₃');
  add('stoichiometricSoapMl','Soap needed by ideal stoichiometry','VRequired = 2 × nH × 1000 / cSoap',`2 × ${f(s.hardnessMol)} × 1000 / ${f(q.soapMolL)}`,s.stoichiometricSoapMl,'mL');
  add('freeSoapMmolL','Free soap in nominal mixture','cFree = nFree × 10⁶ / VNominal',`${f(s.freeOleateMol)} × 1000000 / ${f(s.nominalFinalMl)}`,s.freeSoapMmolL,'mmol/L');
  add('foamProxy','Chosen qualitative indicator','P = min(1, cFree / 1 mmol/L) × cycles / 30',`min(1, ${f(s.freeSoapMmolL)} / 1) × ${f(q.agitationCycles)} / 30`,s.foamProxy,'index');
  for(const [key,n,mass,title]of[['calciumSoapG',s.calciumPrecipitatedMol,c.calciumOleate,'Calcium soap equivalent'],['magnesiumSoapG',s.magnesiumPrecipitatedMol,c.magnesiumOleate,'Magnesium soap equivalent']]as const)add(key,title,'mSoap = nMetal,p × MMetal(oleate)₂',`${f(n)} × ${f(mass)}`,s[key],'g');
  add('scumEquivalentG','All soap product equivalents','mScum = mCaSoap + mMgSoap',`${f(s.calciumSoapG)} + ${f(s.magnesiumSoapG)}`,s.scumEquivalentG,'g');
  add('sampleSaltG','Prepared chloride salts','mSalts = nCa × MCaCl₂ + nMg × MMgCl₂',`${f(s.calciumMol)} × ${f(c.calciumChloride)} + ${f(s.magnesiumMol)} × ${f(c.magnesiumChloride)}`,s.sampleSaltG,'g');
  add('sampleCarrierG','Sample carrier from prepared solution mass','mCarrier,s = VSample × 1 g/mL − mSalts',`${f(q.sampleMl)} × 1 − ${f(s.sampleSaltG)}`,s.sampleCarrierG,'g');
  add('deliveredCarrierG','Delivered stock carrier','mCarrier,d = VDelivered × 1 g/mL − nDelivered × MNaOleate',`${f(q.deliveredMl)} × 1 − ${f(s.deliveredSoapMol)} × ${f(c.sodiumOleate)}`,s.deliveredCarrierG,'g');
  add('stockCarrierG','Initial stock carrier','mCarrier,stock = 20 mL × 1 g/mL − nStock × MNaOleate',`20 × 1 − ${f(s.stockSoapMol)} × ${f(c.sodiumOleate)}`,s.stockCarrierG,'g');
  add('remainingStockCarrierG','Carrier left in stock','mCarrier,left = mCarrier,stock − mCarrier,d',`${f(s.stockCarrierG)} − ${f(s.deliveredCarrierG)}`,s.remainingStockCarrierG,'g');
  add('sodiumMol','Delivered sodium counterions','nNa = nDelivered',`${f(s.deliveredSoapMol)}`,s.sodiumMol,'mol');
  add('chlorideMol','Initial chloride counterions','nCl = 2 × nH',`2 × ${f(s.hardnessMol)}`,s.chlorideMol,'mol');
  add('aqueousSolutesG','Remaining aqueous solutes','mAqueous = nCa,r MCa + nMg,r MMg + nNa MNa + nCl MCl + nFree MOleate',`${f(s.calciumRemainingMol)} × ${f(c.Ca)} + ${f(s.magnesiumRemainingMol)} × ${f(c.Mg)} + ${f(s.sodiumMol)} × ${f(c.Na)} + ${f(s.chlorideMol)} × ${f(c.Cl)} + ${f(s.freeOleateMol)} × ${f(c.oleate)}`,s.aqueousSolutesG,'g');
  add('vesselFinalG','Vessel material account','mVessel = mCarrier,s + mCarrier,d + mAqueous + mScum',`${f(s.sampleCarrierG)} + ${f(s.deliveredCarrierG)} + ${f(s.aqueousSolutesG)} + ${f(s.scumEquivalentG)}`,s.vesselFinalG,'g');
  add('remainingStockG','Remaining stock material','mStock,left = mCarrier,left + nLeft × MNaOleate',`${f(s.remainingStockCarrierG)} + ${f(s.remainingStockSoapMol)} × ${f(c.sodiumOleate)}`,s.remainingStockG,'g');
  add('initialAccountG','Initial closed chemical-material account','mInitial = VSample × 1 g/mL + 20 mL × 1 g/mL',`${f(q.sampleMl)} × 1 + 20 × 1`,s.initialAccountG,'g');
  add('finalAccountG','Final closed chemical-material account','mFinal = mVessel + mStock,left',`${f(s.vesselFinalG)} + ${f(s.remainingStockG)}`,s.finalAccountG,'g');
  add('materialResidualG','Material balance residual','Δm = mFinal − mInitial',`${f(s.finalAccountG)} − ${f(s.initialAccountG)}`,s.materialResidualG,'g');
  add('aqueousChargeResidualMol','Aqueous ionic charge residual','Δq = 2(nCa,r + nMg,r) + nNa − nCl − nFree',`2 × (${f(s.calciumRemainingMol)} + ${f(s.magnesiumRemainingMol)}) + ${f(s.sodiumMol)} − ${f(s.chlorideMol)} − ${f(s.freeOleateMol)}`,s.aqueousChargeResidualMol,'mol charge');
 }
 return blocks;
}
export const soapHardnessProcedure=[
 'State the aim: compare soap demand for four matched samples. Predict which needs the largest dose before free soap remains.',
 'Record the sample volume, chosen calcium/magnesium concentrations, soap-stock concentration and zero-dose observations. The control contains neither hardness ion.',
 'Keep sample volumes, soap-stock strength and agitation matched. Increase the delivered dose in small recorded steps; pause before saving each observation.',
 'For every dose record each sample’s remaining ions, initial/dilution-only/residual hardness, product equivalents, free soap and the qualitative lather indicator.',
 'Apply the same number of agitation cycles to each sample. Compare free soap separately from agitation; the lather indicator is not a measured foam height.',
 'Show the mole conversion, 2:1 soap-to-divalent-ion ratio and the full hardness substitution with units. Compare ideal required dose with the finite 20 mL stock.',
 'Write a result supported by the table. Explain ion removal versus dilution and state why this model cannot certify an unknown real-water sample.'
];
export const soapHardnessLimitations=[
 'Ideal complete divalent-soap precipitation with chosen proportional calcium/magnesium allocation; no Ksp selectivity, pH, temperature dependence or precipitation kinetics.',
 'Only calcium chloride, magnesium chloride and sodium oleate are represented. Real soap mixtures and other water constituents can behave differently.',
 'Prepared-solution density is selected as 1 g/mL and nominal volumes are additive. Solid displacement and true final liquid volume are not inferred.',
 'The dimensionless foam proxy uses a chosen 1 mmol/L excess-soap reference and selected agitation cycles. It is not calibrated foam height, stability or a critical micelle concentration.',
 'Air bubbles are qualitative visual aids. No gas is produced by the represented reaction; the closed chemical-material account covers prepared solutions, remaining stock and soap-product equivalents, excluding apparatus and environmental air.'
];
export function soapHardnessReport(raw:SoapHardnessRecord){
 const r=validateSoapHardnessRecord(raw),table=(headers:readonly string[],rows:string[][])=>`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const payload=JSON.stringify(r).replace(/</g,'\\u003c');
 return`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0109 Soap and hardness practical</title><style>body{font:16px/1.5 system-ui;max-width:1100px;margin:auto;padding:24px;color:#172238}table{border-collapse:collapse;display:block;overflow:auto;max-width:100%}th,td{border:1px solid #ccd4e0;padding:8px;vertical-align:top}code{white-space:normal;overflow-wrap:anywhere}.worked{border-bottom:1px solid #ddd;padding:12px 0}@media print{body{max-width:none;padding:0}table{font-size:10px}section{break-inside:avoid}}</style><body><h1>Soap and water hardness — practical record</h1><p>Science Atlas 360° · VisionariesAI Labs Private Limited · CL-0109</p><h2>Aim and prediction</h2><p>${esc(r.plan)}</p><h2>Apparatus and model</h2><p>Four matched sample vessels, four finite 20 mL soap stocks, delivery scale and matched agitation. Calcium/magnesium chloride samples and sodium oleate are idealized prepared solutions. M²⁺ + 2 RCOO⁻ → M(RCOO)₂ equivalents.</p><h2>Procedure and recording instructions</h2><ol>${soapHardnessProcedure.map(v=>`<li>${esc(v)}</li>`).join('')}</ol><h2>Preparation observations</h2>${table(soapHardnessPreparationHeaders,r.trials.map(soapHardnessPreparationValues))}${soapHardnessTables.map(t=>`<h2>${esc(t.title)}</h2>${table(['Trial','Sample',...t.fields.map(([h])=>h)],r.trials.flatMap((q,i)=>soapHardnessObservationRows(q,i,t.id)))}`).join('')}<h2>Formulas, substitutions and worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${soapHardnessCalculations(q).map(b=>`<section class="worked" data-key="${esc(b.key)}"><h4>${esc(b.group)} · ${esc(b.title)}</h4><p class="formula">${esc(b.formula)}</p><p class="substitution">${esc(b.substitution)}</p><p class="result">${esc(b.result)}</p></section>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and interpretation limits</h2><ul>${soapHardnessLimitations.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><script id="soap-hardness-record-inputs" type="application/json">${payload}</script></body></html>`;
}

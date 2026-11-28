import{soapDetergentState,validateSoapDetergent,soapDetergentConstants as c,type SoapDetergentInputs}from'./soapDetergent';
export interface SoapDetergentTrial extends SoapDetergentInputs{note:string}
export interface SoapDetergentRecord{plan:string;conclusion:string;trials:SoapDetergentTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'',f=(n:number)=>n.toPrecision(17),esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function validateSoapDetergentRecord(raw:unknown):SoapDetergentRecord{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Soap/detergent record required');const r=raw as Record<string,unknown>;
 if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('0–40 observations supported');
 return{plan:text(r.plan),conclusion:text(r.conclusion),trials:r.trials.map(v=>({...validateSoapDetergent(v),note:text((v as Record<string,unknown>).note)}))};
}
export const soapDetergentPreparationFields=['sampleMl','calciumMmolL','magnesiumMmolL','soapMolL','deliveredMl','agitationCycles','matching']as const;
export const soapDetergentPreparationHeaders=['Trial','Matched sample mL','Hard sample calcium mmol/L','Hard sample magnesium mmol/L','Soap reference mol/L','Delivered stock mL','Selected agitation cycles','Dose matching basis','Student observation'];
export function soapDetergentPreparationValues(q:SoapDetergentTrial,i:number){return[String(i+1),...soapDetergentPreparationFields.map(k=>typeof q[k]==='number'?f(q[k]as number):q[k]as string),q.note];}
export const soapDetergentTables=[
 {id:'dose',title:'Matched dose and surfactant availability',fields:[['Formula reference g/mol','formulaMassGmol'],['Actual stock mol/L','stockMolL'],['Stock solute g/L','stockGL'],['Delivered surfactant mol','deliveredSurfactantMol'],['Delivered surfactant g','deliveredSurfactantG'],['Bound surfactant mol','boundSurfactantMol'],['Unprecipitated surfactant mol','freeSurfactantMol'],['Unprecipitated surfactant mmol/L','freeSurfactantMmolL'],['Available fraction (undefined at zero dose)','availableFraction']]},
 {id:'ions',title:'Hardness ions and soap-product equivalents',fields:[['Initial calcium mol','initialCalciumMol'],['Initial magnesium mol','initialMagnesiumMol'],['Calcium precipitated mol','calciumPrecipitatedMol'],['Magnesium precipitated mol','magnesiumPrecipitatedMol'],['Calcium remaining mol','calciumRemainingMol'],['Magnesium remaining mol','magnesiumRemainingMol'],['Initial hardness mg/L as CaCO₃','initialHardnessMgL'],['Dilution-only hardness mg/L as CaCO₃','dilutionOnlyHardnessMgL'],['Residual hardness mg/L as CaCO₃','residualHardnessMgL'],['Soap-product equivalent g','scumEquivalentG'],['Neutral-detergent CMC reference band only','nonionicCmcReferencePosition']]},
 {id:'account',title:'Finite stock and material/charge diagnostics',fields:[['Stock surfactant remaining mol','remainingStockSurfactantMol'],['Stock material remaining g','remainingStockG'],['Final vessel material g','vesselFinalG'],['Initial whole account g','initialAccountG'],['Final whole account g','finalAccountG'],['Material residual g','materialResidualG'],['Aqueous charge residual mol charge','aqueousChargeResidualMol'],['Surfactant inventory residual mol','surfactantResidualMol']]}
]as const;
export function soapDetergentObservationRows(q:SoapDetergentInputs,i:number,id:string){const t=soapDetergentTables.find(v=>v.id===id);if(!t)throw new RangeError('Unknown soap/detergent observation table');return soapDetergentState(q).cells.map(s=>[String(i+1),s.id,...t.fields.map(([,k])=>s[k]===null?'Not defined / not applicable':typeof s[k]==='number'?f(s[k]as number):String(s[k]))]);}
export function soapDetergentCalculations(raw:SoapDetergentInputs){
 const q=validateSoapDetergent(raw),state=soapDetergentState(q),out:{key:string;group:string;title:string;formula:string;substitution:string;result:string;unit:string}[]=[];
 const add=(group:string,key:string,title:string,formula:string,substitution:string,value:number|null,unit:string)=>out.push({key:group+'.'+key,group,title,formula,substitution,result:value===null?'Undefined at zero delivered dose':`${f(value)} ${unit}`,unit});
 for(const s of state.cells){
  const a=(key:string,title:string,formula:string,substitution:string,value:number|null,unit:string)=>add(s.id,key,title,formula,substitution,value,unit),ca=s.isHard?q.calciumMmolL:0,mg=s.isHard?q.magnesiumMmolL:0;
  a('stockMolL','Actual stock concentration',s.isSoap||q.matching==='molar'?'c = soap-reference concentration':'cDet = cSoap × MSoap / MDet',s.isSoap||q.matching==='molar'?`${f(q.soapMolL)}`:`${f(q.soapMolL)} × ${f(c.sodiumOleate)} / ${f(c.octylGlucoside)}`,s.stockMolL,'mol/L');
  a('stockGL','Stock solute mass concentration','w = c × M',`${f(s.stockMolL)} × ${f(s.formulaMassGmol)}`,s.stockGL,'g/L');
  a('stockSurfactantMol','Finite initial stock','nStock = c × 20 mL / 1000',`${f(s.stockMolL)} × 20 / 1000`,s.stockSurfactantMol,'mol');
  a('deliveredSurfactantMol','Delivered amphiphile','nDose = c × VDose / 1000',`${f(s.stockMolL)} × ${f(q.deliveredMl)} / 1000`,s.deliveredSurfactantMol,'mol');
  a('deliveredSurfactantG','Delivered solute mass','mDose = nDose × M',`${f(s.deliveredSurfactantMol)} × ${f(s.formulaMassGmol)}`,s.deliveredSurfactantG,'g');
  a('remainingStockSurfactantMol','Surfactant left in stock','nLeft = nStock − nDose',`${f(s.stockSurfactantMol)} − ${f(s.deliveredSurfactantMol)}`,s.remainingStockSurfactantMol,'mol');
  a('initialCalciumMol','Initial calcium','nCa = cCa(mmol/L) × VSample(mL) / 10⁶',`${f(ca)} × ${f(q.sampleMl)} / 1000000`,s.initialCalciumMol,'mol');
  a('initialMagnesiumMol','Initial magnesium','nMg = cMg(mmol/L) × VSample(mL) / 10⁶',`${f(mg)} × ${f(q.sampleMl)} / 1000000`,s.initialMagnesiumMol,'mol');
  a('initialHardnessMol','Initial divalent-ion amount','nH = nCa + nMg',`${f(s.initialCalciumMol)} + ${f(s.initialMagnesiumMol)}`,s.initialHardnessMol,'mol');
  a('precipitatedMetalMol','Ideal soap-product formation',s.isSoap?'nP = min(nH, nDose / 2)':'nP = 0 for the selected neutral-detergent channel',s.isSoap?`min(${f(s.initialHardnessMol)}, ${f(s.deliveredSurfactantMol)} / 2)`:'0',s.precipitatedMetalMol,'mol');
  a('reactedFraction','Proportional Ca/Mg allocation',s.initialHardnessMol>0?'r = nP / nH':'r = 0 when no hardness ions are present',s.initialHardnessMol>0?`${f(s.precipitatedMetalMol)} / ${f(s.initialHardnessMol)}`:'0',s.reactedFraction,'fraction');
  a('calciumPrecipitatedMol','Calcium in product equivalent','nCa,p = nCa × r',`${f(s.initialCalciumMol)} × ${f(s.reactedFraction)}`,s.calciumPrecipitatedMol,'mol');
  a('magnesiumPrecipitatedMol','Magnesium in product equivalent','nMg,p = nMg × r',`${f(s.initialMagnesiumMol)} × ${f(s.reactedFraction)}`,s.magnesiumPrecipitatedMol,'mol');
  a('calciumRemainingMol','Calcium remaining in solution','nCa,r = nCa − nCa,p',`${f(s.initialCalciumMol)} − ${f(s.calciumPrecipitatedMol)}`,s.calciumRemainingMol,'mol');
  a('magnesiumRemainingMol','Magnesium remaining in solution','nMg,r = nMg − nMg,p',`${f(s.initialMagnesiumMol)} − ${f(s.magnesiumPrecipitatedMol)}`,s.magnesiumRemainingMol,'mol');
  a('boundSurfactantMol','Two anions per divalent soap product','nBound = 2 × nP',`2 × ${f(s.precipitatedMetalMol)}`,s.boundSurfactantMol,'mol');
  a('freeSurfactantMol','Unprecipitated surfactant inventory','nFree = max(0, nDose − nBound)',`max(0, ${f(s.deliveredSurfactantMol)} − ${f(s.boundSurfactantMol)})`,s.freeSurfactantMol,'mol');
  a('availableFraction','Fraction not consumed by the represented channel','fAvailable = nFree / nDose; undefined when nDose = 0',s.deliveredSurfactantMol>0?`${f(s.freeSurfactantMol)} / ${f(s.deliveredSurfactantMol)}`:'Undefined: denominator is zero',s.availableFraction,'fraction');
  a('nominalFinalMl','Nominal additive mixture volume','VNominal = VSample + VDose',`${f(q.sampleMl)} + ${f(q.deliveredMl)}`,s.nominalFinalMl,'mL');
  a('freeSurfactantMmolL','Unprecipitated surfactant concentration','cFree = nFree × 10⁶ / VNominal',`${f(s.freeSurfactantMol)} × 1000000 / ${f(s.nominalFinalMl)}`,s.freeSurfactantMmolL,'mmol/L');
  a('initialHardnessMgL','Initial calcium-carbonate equivalent','HInitial = nH × MCaCO₃ × 10⁶ / VSample',`${f(s.initialHardnessMol)} × ${f(c.calciumCarbonate)} × 1000000 / ${f(q.sampleMl)}`,s.initialHardnessMgL,'mg/L as CaCO₃');
  a('dilutionOnlyHardnessMgL','Concentration change by dilution alone','HDilution = nH × MCaCO₃ × 10⁶ / VNominal',`${f(s.initialHardnessMol)} × ${f(c.calciumCarbonate)} × 1000000 / ${f(s.nominalFinalMl)}`,s.dilutionOnlyHardnessMgL,'mg/L as CaCO₃');
  a('residualHardnessMgL','Residual dissolved hardness','HResidual = (nCa,r + nMg,r) × MCaCO₃ × 10⁶ / VNominal',`(${f(s.calciumRemainingMol)} + ${f(s.magnesiumRemainingMol)}) × ${f(c.calciumCarbonate)} × 1000000 / ${f(s.nominalFinalMl)}`,s.residualHardnessMgL,'mg/L as CaCO₃');
  a('sodiumMol','Soap sodium counterions','nNa = nDose for sodium oleate; 0 for neutral detergent',s.isSoap?f(s.deliveredSurfactantMol):'0',s.sodiumMol,'mol');
  a('chlorideMol','Hardness chloride counterions','nCl = 2 × nH',`2 × ${f(s.initialHardnessMol)}`,s.chlorideMol,'mol');
  a('calciumSoapEquivalentG','Calcium soap-equivalent mass','mCaSoap = nCa,p × (MCa + 2 MOleate)',`${f(s.calciumPrecipitatedMol)} × (${f(c.Ca)} + 2 × ${f(c.oleate)})`,s.calciumSoapEquivalentG,'g');
  a('magnesiumSoapEquivalentG','Magnesium soap-equivalent mass','mMgSoap = nMg,p × (MMg + 2 MOleate)',`${f(s.magnesiumPrecipitatedMol)} × (${f(c.Mg)} + 2 × ${f(c.oleate)})`,s.magnesiumSoapEquivalentG,'g');
  a('scumEquivalentG','Total product-equivalent mass','mScum = mCaSoap + mMgSoap',`${f(s.calciumSoapEquivalentG)} + ${f(s.magnesiumSoapEquivalentG)}`,s.scumEquivalentG,'g');
  a('sampleSaltG','Initial chloride-salt mass','mSalt = nCa(MCa + 2 MCl) + nMg(MMg + 2 MCl)',`${f(s.initialCalciumMol)} × (${f(c.Ca)} + 2 × ${f(c.Cl)}) + ${f(s.initialMagnesiumMol)} × (${f(c.Mg)} + 2 × ${f(c.Cl)})`,s.sampleSaltG,'g');
  a('sampleCarrierG','Prepared sample carrier','mCarrier,s = VSample × 1 g/mL − mSalt',`${f(q.sampleMl)} × 1 − ${f(s.sampleSaltG)}`,s.sampleCarrierG,'g');
  a('stockCarrierG','Prepared stock carrier','mCarrier,stock = 20 mL × 1 g/mL − nStock × M',`20 × 1 − ${f(s.stockSurfactantMol)} × ${f(s.formulaMassGmol)}`,s.stockCarrierG,'g');
  a('deliveredCarrierG','Carrier delivered with solute','mCarrier,d = VDose × 1 g/mL − mDose',`${f(q.deliveredMl)} × 1 − ${f(s.deliveredSurfactantG)}`,s.deliveredCarrierG,'g');
  a('remainingStockCarrierG','Stock carrier remaining','mCarrier,left = mCarrier,stock − mCarrier,d',`${f(s.stockCarrierG)} − ${f(s.deliveredCarrierG)}`,s.remainingStockCarrierG,'g');
  a('freeSurfactantG','Free anion or neutral-detergent mass','mFree = nFree × species molar mass',`${f(s.freeSurfactantMol)} × ${f(s.isSoap?c.oleate:s.formulaMassGmol)}`,s.freeSurfactantG,'g');
  a('aqueousSolutesG','Dissolved material account','mAqueous = nCa,r MCa + nMg,r MMg + nNa MNa + nCl MCl + mFree',`${f(s.calciumRemainingMol)} × ${f(c.Ca)} + ${f(s.magnesiumRemainingMol)} × ${f(c.Mg)} + ${f(s.sodiumMol)} × ${f(c.Na)} + ${f(s.chlorideMol)} × ${f(c.Cl)} + ${f(s.freeSurfactantG)}`,s.aqueousSolutesG,'g');
  a('vesselFinalG','Vessel material account','mVessel = mCarrier,s + mCarrier,d + mAqueous + mScum',`${f(s.sampleCarrierG)} + ${f(s.deliveredCarrierG)} + ${f(s.aqueousSolutesG)} + ${f(s.scumEquivalentG)}`,s.vesselFinalG,'g');
  a('remainingStockG','Remaining stock material','mLeft = mCarrier,left + nLeft × M',`${f(s.remainingStockCarrierG)} + ${f(s.remainingStockSurfactantMol)} × ${f(s.formulaMassGmol)}`,s.remainingStockG,'g');
  a('initialAccountG','Initial chemical-material account','mInitial = VSample × 1 g/mL + 20 mL × 1 g/mL',`${f(q.sampleMl)} × 1 + 20 × 1`,s.initialAccountG,'g');
  a('finalAccountG','Final chemical-material account','mFinal = mVessel + mLeft',`${f(s.vesselFinalG)} + ${f(s.remainingStockG)}`,s.finalAccountG,'g');
  a('materialResidualG','Closed material-account residual','Δm = mFinal − mInitial',`${f(s.finalAccountG)} − ${f(s.initialAccountG)}`,s.materialResidualG,'g');
  a('aqueousChargeResidualMol','Aqueous ionic charge residual','Δq = 2(nCa,r + nMg,r) + nNa − nCl − nFreeAnion',`2 × (${f(s.calciumRemainingMol)} + ${f(s.magnesiumRemainingMol)}) + ${f(s.sodiumMol)} − ${f(s.chlorideMol)} − ${f(s.isSoap?s.freeSurfactantMol:0)}`,s.aqueousChargeResidualMol,'mol charge');
 }
 const[ss,sh,ds,dh]=state.cells;
 for(const[key,title,a,b,unit]of[
  ['soapHardWaterLossMol','Soap removed by the represented hard-water channel',ss.freeSurfactantMol,sh.freeSurfactantMol,'mol'],
  ['detergentHardWaterLossMol','Neutral-detergent loss in the represented channel',ds.freeSurfactantMol,dh.freeSurfactantMol,'mol'],
  ['detergentMinusSoapDeliveredMol','Detergent minus soap delivered amount',dh.deliveredSurfactantMol,sh.deliveredSurfactantMol,'mol'],
  ['detergentMinusSoapDeliveredG','Detergent minus soap delivered solute mass',dh.deliveredSurfactantG,sh.deliveredSurfactantG,'g']
 ]as const)add('comparison',key,title,'Difference = first amount − second amount',`${f(a)} − ${f(b)}`,state[key],unit);
 return out;
}
export const soapDetergentProcedure=[
 'State the aim: compare the selected sodium-oleate soap and neutral octyl-glucoside reference in soft and prepared hard water.',
 'Select equal-molar or equal-solute-mass stock matching. Record actual stock molarity and g/L for each surfactant; equal stock volumes alone do not establish equal dose.',
 'Record zero-dose observations for all four preparations. Keep sample volume, hard-water ion concentrations and delivered volumes matched.',
 'Increase delivered dose in recorded steps. Pause and record surfactant bound/unprecipitated, remaining hardness and product-equivalent mass for all four cells.',
 'Apply matched agitation for the visual comparison. Do not infer measured foam height, micelle counts or cleaning efficiency from the animation.',
 'Show dose conversion, the soap 2:1 anion-to-divalent-ion ratio, dose-basis conversion, hardness substitution and material/charge accounts with units.',
 'Repeat with the other dose-matching basis. Compare which quantities remain equal and which change.',
 'Write a result using table values. Explain why the neutral-detergent reference can remain unprecipitated while hardness ions remain in solution; qualify the conclusion to this model.'
];
export const soapDetergentLimitations=[
 'This selected comparison represents sodium oleate and neutral octyl β-D-glucopyranoside; it does not represent all commercial soaps or detergent formulations.',
 'Soap precipitation is ideal and complete with proportional calcium/magnesium allocation when soap limits. No Ksp preference, pH, kinetic or temperature model is used.',
 'No divalent carboxylate channel is assigned to the selected neutral detergent. Other associations, salt effects and clouding are omitted; this is not a universal claim of immunity to hard water.',
 'Unprecipitated surfactant is an inventory, not necessarily free monomers. No aggregate count, micelle size, foam height, cleansing efficiency or surface tension is predicted.',
 'The 20–25 mmol/L nonionic CMC band is a published reference at 20–25 °C. Position relative to that band does not establish the CMC in this salt-containing mixture.',
 'Prepared-solution density is selected as 1 g/mL; nominal prepared volumes add. Carrier mass excludes dissolved solute so it is not double-counted. Precipitate volume is not inferred.'
];
export function soapDetergentReport(raw:SoapDetergentRecord){
 const r=validateSoapDetergentRecord(raw),table=(heads:readonly string[],rows:string[][])=>`<table><thead><tr>${heads.map(v=>`<th>${esc(v)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 return`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0110 Soap and detergent practical</title><style>body{font:16px/1.5 system-ui;color:#172238;max-width:1100px;margin:auto;padding:24px}table{border-collapse:collapse;display:block;max-width:100%;overflow:auto}th,td{border:1px solid #ccd4e0;padding:8px;vertical-align:top}.worked{padding:12px 0;border-bottom:1px solid #ddd}p{overflow-wrap:anywhere}@media print{body{max-width:none;padding:0}table{font-size:10px}.worked{break-inside:avoid}}</style><body><h1>Soap and selected nonionic detergent — practical record</h1><p>Science Atlas 360° · VisionariesAI Labs Private Limited · CL-0110</p><h2>Aim and prediction</h2><p>${esc(r.plan)}</p><h2>Apparatus and represented chemistry</h2><p>Four matched sample vessels, separate finite 20 mL stocks, metered delivery and matched agitation. Soap: sodium oleate. Neutral-detergent reference: octyl β-D-glucopyranoside. M²⁺ + 2 oleate⁻ → M(oleate)₂ equivalents is represented only for the soap channel.</p><h2>Procedure</h2><ol>${soapDetergentProcedure.map(v=>`<li>${esc(v)}</li>`).join('')}</ol><h2>Preparation observations</h2>${table(soapDetergentPreparationHeaders,r.trials.map(soapDetergentPreparationValues))}${soapDetergentTables.map(t=>`<h2>${esc(t.title)}</h2>${table(['Trial','Sample',...t.fields.map(([h])=>h)],r.trials.flatMap((q,i)=>soapDetergentObservationRows(q,i,t.id)))}`).join('')}<h2>Formulas, substitution and worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${soapDetergentCalculations(q).map(b=>`<section class="worked" data-key="${esc(b.key)}"><h4>${esc(b.group)} · ${esc(b.title)}</h4><p class="formula">${esc(b.formula)}</p><p class="substitution">${esc(b.substitution)}</p><p class="result">${esc(b.result)}</p></section>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and interpretation limits</h2><ul>${soapDetergentLimitations.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><script id="soap-detergent-record-inputs" type="application/json">${JSON.stringify(r).replace(/</g,'\\u003c')}</script></body></html>`;
}

import {carbonateGasState,checkCarbonateGas,carbonateGasReference as c,type CarbonateGasInputs} from './carbonateGas';
import {carbonateGasGeometry} from './carbonateGasGeometry';
export interface CarbonateTrial extends CarbonateGasInputs {observation:string}
export interface CarbonateRecord {prediction:string;conclusion:string;trials:CarbonateTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
export const carbonateNumber=(n:number)=>n===0?'0':Math.abs(n)<1e-5?n.toExponential(8):n.toFixed(6);
export function validateCarbonateRecord(raw:unknown):CarbonateRecord {
  const r=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
  const trials:CarbonateTrial[]=[];
  if(Array.isArray(r.trials))for(const v of r.trials.slice(-60)) {
    if(!v||typeof v!=='object')continue;const t=v as CarbonateTrial;
    try{checkCarbonateGas(t);trials.push({carbonateG:t.carbonateG,acidMl:t.acidMl,acidMolL:t.acidMolL,
      temperatureC:t.temperatureC,pressureKPa:t.pressureKPa,rateSInv:t.rateSInv,timeS:t.timeS,
      observation:text(t.observation)})}catch{/* Malformed saved controls are not evidence. */}
  }
  return {prediction:text(r.prediction),conclusion:text(r.conclusion),trials};
}
export const carbonateHeaders=['Trial','Elapsed s','Initial carbonate g','Acid mL','Acid mol/L',
  'Temperature °C','Pressure kPa','Chosen rate s⁻¹','Limiting reagent','Extent mol','Piston mL',
  'CO₂ equivalent mL','Freed solid volume mL','Carbonate left g','HCl left g','CaCl₂ formed g',
  'Water formed g','CO₂ formed g','Reacting contents g','Initial air mol','CO₂ mole fraction',
  'CO₂ in syringe mol','CO₂ in flask/tube mol','Observation'];
export function carbonateTrialValues(t:CarbonateTrial,index:number) {
  const s=carbonateGasState(t),n=carbonateNumber;
  return [String(index+1),...[t.timeS,t.carbonateG,t.acidMl,t.acidMolL,t.temperatureC,t.pressureKPa,t.rateSInv].map(n),
    s.limitingReagent,...[s.extentMol,s.syringeMl,s.gasEquivalentMl,s.liberatedSolidVolumeMl,
      s.carbonateLeftG,s.hclLeftG,s.calciumChlorideG,s.generatedWaterG,s.co2G,s.contentsG,
      s.initialAirMol,s.co2MoleFraction,s.syringeCo2Mol,s.deadSpaceCo2Mol].map(n),t.observation];
}
export function carbonateCalculations(q:CarbonateGasInputs) {
  const s=carbonateGasGeometry(q),n=carbonateNumber;
  const step=(title:string,formula:string,substitution:string,value:number,unit:string)=>
    ({title,formula,substitution,result:`${n(value)} ${unit}`});
  return [
    step('Initial carbonate amount','nC₀ = mC₀/MC',`${n(q.carbonateG)}/${c.carbonateMolarG}`,s.carbonateMol,'mol'),
    step('Initial acid amount','nH₀ = cH VH/1000',`${n(q.acidMolL)} × ${n(q.acidMl)}/1000`,s.acidMol,'mol HCl'),
    step('Maximum reaction extent','ξmax = min(nC₀,nH₀/2)',`min(${n(s.carbonateMol)},${n(s.acidMol)}/2)`,s.maximumExtentMol,'mol; two HCl per carbonate'),
    step('Chosen reacted fraction','f = 1−exp(−kt)',`1−exp(−${n(q.rateSInv)} × ${n(q.timeS)})`,s.fraction,'dimensionless; illustrative kinetics'),
    step('Current reaction extent','ξ = ξmax f',`${n(s.maximumExtentMol)} × ${n(s.fraction)}`,s.extentMol,'mol'),
    step('Remaining carbonate','mC = (nC₀−ξ) MC',`(${n(s.carbonateMol)}−${n(s.extentMol)}) × ${c.carbonateMolarG}`,s.carbonateLeftG,'g; stable exponential residual used'),
    step('Remaining hydrochloric acid','mH = (nH₀−2ξ) MH',`(${n(s.acidMol)}−2 × ${n(s.extentMol)}) × ${c.hclMolarG}`,s.hclLeftG,'g; stable exponential residual used'),
    step('Calcium chloride formed','msalt = ξ MCaCl₂',`${n(s.extentMol)} × ${c.calciumChlorideMolarG}`,s.calciumChlorideG,'g'),
    step('Carbon dioxide formed','mCO₂ = ξ MCO₂',`${n(s.extentMol)} × ${c.co2MolarG}`,s.co2G,'g'),
    step('Water formed','mwater,new = ξ MH₂O',`${n(s.extentMol)} × ${c.waterMolarG}`,s.generatedWaterG,'g'),
    step('Initial solvent water','mW₀ = ρsolution VH−nH₀ MH',`${c.solutionDensityGml} × ${n(q.acidMl)}−${n(s.acidMol)} × ${c.hclMolarG}`,s.initialWaterG,'g; chosen solution density'),
    step('Water now','mW = mW₀+mwater,new',`${n(s.initialWaterG)}+${n(s.generatedWaterG)}`,s.waterG,'g'),
    step('Reacting-material mass closure','mC+mH+msalt+mW+mCO₂ = minitial',`${n(s.carbonateLeftG)}+${n(s.hclLeftG)}+${n(s.calciumChlorideG)}+${n(s.waterG)}+${n(s.co2G)}`,s.contentsG,'g; initial trapped air excluded on both sides'),
    step('Absolute temperature','TK = T°C+273.15',`${n(q.temperatureC)}+273.15`,s.temperatureK,'K'),
    step('Ideal molar gas volume','Vm = 1000 RTK/P',`1000 × ${c.gasConstantLKPaMolK} × ${n(s.temperatureK)}/${n(q.pressureKPa)}`,s.molarVolumeMl,'mL/mol'),
    step('Generated CO₂ equivalent volume','Veq = ξ Vm',`${n(s.extentMol)} × ${n(s.molarVolumeMl)}`,s.gasEquivalentMl,'mL; not the pure CO₂ volume collected in syringe'),
    step('Initial solid displacement','VC₀ = mC₀/ρC',`${n(q.carbonateG)}/${c.carbonateDrawingDensityGml}`,s.initialSolidVolumeMl,'mL; drawing reference'),
    step('Remaining solid displacement','VC = mC/ρC',`${n(s.carbonateLeftG)}/${c.carbonateDrawingDensityGml}`,s.solidVolumeMl,'mL'),
    step('Freed solid space','ΔVC = ξ MC/ρC',`${n(s.extentMol)} × ${c.carbonateMolarG}/${c.carbonateDrawingDensityGml}`,s.liberatedSolidVolumeMl,'mL'),
    step('Initial trapped-air volume','Vdead₀ = 150+5−VH−VC₀',`150+5−${n(q.acidMl)}−${n(s.initialSolidVolumeMl)}`,s.initialDeadSpaceMl,'mL'),
    step('Current flask/tube gas volume','Vdead = 150+5−VH−VC',`150+5−${n(q.acidMl)}−${n(s.solidVolumeMl)}`,s.deadSpaceMl,'mL; solution drawing volume held constant'),
    step('Syringe expansion','Vpiston = Veq−ΔVC',`${n(s.gasEquivalentMl)}−${n(s.liberatedSolidVolumeMl)}`,s.syringeMl,'mL'),
    step('Piston travel','x = Vpiston/Asyringe',`${n(s.syringeMl)}/10`,s.pistonTravelCm,'cm; reference cross-section10cm²'),
    step('Initial air amount','nair = Vdead₀/Vm',`${n(s.initialDeadSpaceMl)}/${n(s.molarVolumeMl)}`,s.initialAirMol,'mol; conserved'),
    step('Current total gas volume','Vtotal = Vdead+Vpiston',`${n(s.deadSpaceMl)}+${n(s.syringeMl)}`,s.totalGasVolumeMl,'mL'),
    step('CO₂ mole fraction','yCO₂ = ξ/(nair+ξ)',`${n(s.extentMol)}/(${n(s.initialAirMol)}+${n(s.extentMol)})`,s.co2MoleFraction,'dimensionless; instant uniform mixing assumption'),
    step('CO₂ in syringe','nCO₂,s = ξ Vpiston/Vtotal',`${n(s.extentMol)} × ${n(s.syringeMl)}/${n(s.totalGasVolumeMl)}`,s.syringeCo2Mol,'mol'),
    step('CO₂ in flask and tube','nCO₂,d = ξ Vdead/Vtotal',`${n(s.extentMol)} × ${n(s.deadSpaceMl)}/${n(s.totalGasVolumeMl)}`,s.deadSpaceCo2Mol,'mol'),
    step('Current reaction rate','dξ/dt = k ξmax exp(−kt)',`${n(q.rateSInv)} × ${n(s.maximumExtentMol)} × exp(−${n(q.rateSInv*q.timeS)})`,s.extentRateMolS,'mol/s'),
    step('Current piston volume rate','dVpiston/dt = (dξ/dt)(Vm−MC/ρC)',`${n(s.extentRateMolS)} × (${n(s.molarVolumeMl)}−${c.carbonateMolarG}/${c.carbonateDrawingDensityGml})`,s.syringeRateMlS,'mL/s; not cumulative volume divided by current time'),
  ];
}
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function carbonateGasReport(input:unknown) {
  const r=validateCarbonateRecord(input),groups=[{name:'A. Preparation and timing',cols:[0,1,2,3,4,5,6,7,8]},
    {name:'B. Gas reading and distribution',cols:[0,1,9,10,11,12,19,20,21,22]},
    {name:'C. Material inventories and observations',cols:[0,1,13,14,15,16,17,18,23]}];
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0061 Acid and carbonate practical</title><style>body{font:16px/1.6 system-ui;max-width:1100px;margin:auto;padding:24px;overflow-wrap:anywhere}.table{overflow:auto}table{width:100%;min-width:1000px;border-collapse:collapse;font-size:12px}td,th{border:1px solid #aaa;padding:8px}code{white-space:normal}@page{size:A4 landscape;margin:12mm}@media print{body{padding:0;font-size:11px}.table{overflow:visible}table{min-width:0;table-layout:fixed;font-size:8px}td,th{padding:3px}tr{break-inside:avoid}}</style>
<h1>Observe carbon dioxide production from an acid and carbonate</h1><p>Science Atlas360° · VisionariesAI Labs Private Limited · CL-0061 · Class5 editorial investigation</p>
<h2>Aim</h2><p>Follow carbonate reacting with dilute hydrochloric acid, measure syringe expansion and account for products, remaining reactants and initial trapped air.</p>
<h2>Apparatus and principle</h2><p>Virtual150mL flask, delivery tube with5mL reference dead volume, clamp and200mL free-piston gas syringe. CaCO₃+2HCl→CaCl₂+CO₂+H₂O. The limiting reagent bounds the reaction extent. Quantitative formulas are teacher extensions.</p>
<h2>Prediction</h2><p>${esc(r.prediction)||'Not entered.'}</p><h2>Procedure</h2><ol><li>Record carbonate mass, acid volume/concentration, temperature, pressure and chosen rate.</li><li>Predict the limiting reagent. Record the initial clear solution, solid and zero piston reading.</li><li>Run, pause and record at regular elapsed times. Compare the shrinking carbonate with the moving piston.</li><li>Distinguish generated CO₂-equivalent volume from piston travel volume. The syringe contains an air/CO₂ mixture.</li><li>Repeat with excess acid, excess carbonate and a zero-reactant control. Compare finite-time readings with maximum yield.</li><li>Substitute values with units. Check material closure and write the result, conclusion and limitations.</li></ol>
<h2>Observation tables</h2>${groups.map((g,index)=>`<h3>${g.name}</h3><div class="table"><table data-carbonate-table="${index}"><thead><tr>${g.cols.map(i=>`<th>${esc(carbonateHeaders[i])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,i)=>{const row=carbonateTrialValues(t,i);return `<tr>${g.cols.map(j=>`<td>${esc(row[j])}</td>`).join('')}</tr>`}).join('')||`<tr><td colspan="${g.cols.length}">No observations recorded.</td></tr>`}</tbody></table></div>`).join('')}
<h2>Formula substitution and worked calculations</h2><p>Rounded display values do not replace retained precision. Tiny positive residues use scientific notation. Current rate and cumulative volume are different quantities.</p>${r.trials.map((t,i)=>`<h3>Trial ${i+1}</h3><ol>${carbonateCalculations(t).map(c=>`<li><strong>${esc(c.title)}</strong><p><code>${esc(c.formula)}</code></p><p>Substitution: ${esc(c.substitution)}</p><p>Result: ${esc(c.result)}</p></li>`).join('')}</ol>`).join('')}
<h2>Result, conclusion and limitations</h2><p>${esc(r.conclusion)||'Not entered.'}</p><h2>Interpretation and precautions</h2><p>Virtual model, not instructions for unsupervised chemical handling. Dry ideal gas, isothermal constant pressure, freely moving piston, instant uniform gas mixing. No dissolved CO₂, water vapour, leak, friction or heat-balance model. Initial air is retained and excluded from the reacting-material mass budget on both sides. Solution drawing volume is held constant; carbonate density2.71g/mL, weighted cubic forms and tube routing are schematic references. Shrinking solid increases flask gas space, slightly reducing piston expansion. Chosen first-order extent relaxation is illustrative, not measured kinetics. No official-board, physical-device or independent-expert certification is claimed.</p></html>`;
}

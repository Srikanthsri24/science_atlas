import {checkNeutralization,neutralizationState,neutralizationReference as c,type NeutralizationInputs} from './neutralization';
export interface NeutralizationTrial extends NeutralizationInputs {observation:string}
export interface NeutralizationRecord {prediction:string;conclusion:string;trials:NeutralizationTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
export const neutralizationNumber=(n:number)=>n===0?'0':Math.abs(n)<1e-3?n.toExponential(8):Math.abs(n)<1?Number(n.toPrecision(10)).toString():n.toFixed(6);
export function validateNeutralizationRecord(raw:unknown):NeutralizationRecord{
 const r=raw&&typeof raw==='object'?raw as Record<string,unknown>:{},trials:NeutralizationTrial[]=[];
 if(Array.isArray(r.trials))for(const v of r.trials){if(!v||typeof v!=='object')continue;const q=v as NeutralizationTrial;
  try{checkNeutralization(q);trials.push({acidMl:q.acidMl,acidMolL:q.acidMolL,baseMolL:q.baseMolL,plannedBaseMl:q.plannedBaseMl,aliquots:q.aliquots,intervalS:q.intervalS,timeS:q.timeS,observation:text(q.observation)})}catch{/* Reject malformed saved controls, never trust stored derived results. */}
 }
 return {prediction:text(r.prediction),conclusion:text(r.conclusion),trials:trials.slice(-60)};
}
export const neutralizationHeaders=['Trial','Elapsed s','Acid mL','Acid mol/L','Base mol/L','Planned base mL',
 'Programmed aliquots','Interval s','Initial burette mL','Current burette mL','Released mL','In-flight mL',
 'Delivered mL','Vessel mL','Initial acid equiv mol','Arrived base equiv mol','Neutralized equiv mol',
 'Acid excess equiv mol','Base excess equiv mol','Ideal [H₃O⁺] mol/L','Ideal [OH⁻] mol/L','Ideal pH',
 'Category','Equivalence target mL','Observation'];
export function neutralizationTrialValues(q:NeutralizationTrial,index:number){const s=neutralizationState(q),n=neutralizationNumber;
 return [String(index+1),...[q.timeS,q.acidMl,q.acidMolL,q.baseMolL,q.plannedBaseMl,q.aliquots,q.intervalS,
 s.initialBuretteReadingMl,s.buretteReadingMl,s.releasedMl,s.inFlightMl,s.deliveredMl,s.vesselMl,s.initialAcidMol,
 s.deliveredBaseMol,s.neutralizedMol,s.acidExcessMol,s.baseExcessMol,s.hMolL,s.ohMolL,s.pH].map(n),s.category,
 s.equivalentBaseMl===null?'Not defined: no base equivalents':n(s.equivalentBaseMl),q.observation];
}
export function neutralizationCalculations(q:NeutralizationInputs){const s=neutralizationState(q),n=neutralizationNumber;
 const step=(title:string,formula:string,substitution:string,value:number,unit:string)=>({title,formula,substitution,result:`${n(value)} ${unit}`});
 const d=s.chargeDifferenceMolL,root=Math.hypot(d,2*Math.sqrt(c.kw));
 return [
 step('Initial acid amount','nA = cA VA / 1000',`${n(q.acidMolL)} × ${n(q.acidMl)} / 1000`,s.initialAcidMol,'mol acid equivalents'),
 step('Metered aliquot volume','Vdrop = Vplan / N',`${n(q.plannedBaseMl)} / ${q.aliquots}`,s.dropMl,'mL/aliquot'),
 step('Released volume','Vreleased = Vplan (Nreleased/N)',`${n(q.plannedBaseMl)} × (${s.releasedCount}/${q.aliquots})`,s.releasedMl,'mL; left the burette'),
 step('In-flight volume','Vflight = Vplan (Nreleased−Narrived)/N',`${n(q.plannedBaseMl)} × (${s.releasedCount}−${s.arrivedCount})/${q.aliquots}`,s.inFlightMl,'mL; not yet reacted in vessel'),
 step('Delivered volume','Vdelivered = Vplan (Narrived/N)',`${n(q.plannedBaseMl)} × (${s.arrivedCount}/${q.aliquots})`,s.deliveredMl,'mL; arrived and mixed'),
 step('Burette volume remaining','Vreservoir = Vplan (N−Nreleased)/N',`${n(q.plannedBaseMl)} × (${q.aliquots}−${s.releasedCount})/${q.aliquots}`,s.reservoirMl,'mL'),
 step('Initial burette reading','R₀ = 50−Vplan',`50−${n(q.plannedBaseMl)}`,s.initialBuretteReadingMl,'mL; downward-increasing scale'),
 step('Current burette reading','R = 50−Vreservoir',`50−${n(s.reservoirMl)}`,s.buretteReadingMl,'mL'),
 step('Reading-to-delivery check','Vdelivered = (R−R₀)−Vflight',`(${n(s.buretteReadingMl)}−${n(s.initialBuretteReadingMl)})−${n(s.inFlightMl)}`,s.deliveredMl,'mL'),
 step('Total vessel volume','V = (VA+Vdelivered)/1000',`(${n(q.acidMl)}+${n(s.deliveredMl)})/1000`,s.volumeL,'L; additive-volume model'),
 step('Arrived base amount','nB = cB Vdelivered/1000',`${n(q.baseMolL)} × ${n(s.deliveredMl)}/1000`,s.deliveredBaseMol,'mol base equivalents'),
 step('Neutralized amount','ξ = min(nA,nB)',`min(${n(s.initialAcidMol)},${n(s.deliveredBaseMol)})`,s.neutralizedMol,'mol stoichiometric equivalents'),
 step('Acid excess','nA,excess = nA−ξ',`${n(s.initialAcidMol)}−${n(s.neutralizedMol)}`,s.acidExcessMol,'mol equivalents; not intact HCl molecules'),
 step('Base excess','nB,excess = nB−ξ',`${n(s.deliveredBaseMol)}−${n(s.neutralizedMol)}`,s.baseExcessMol,'mol equivalents; not intact NaOH molecules'),
 step('Sodium concentration','[Na⁺] = nB/V',`${n(s.deliveredBaseMol)}/${n(s.volumeL)}`,s.sodiumMolL,'mol/L'),
 step('Chloride concentration','[Cl⁻] = nA/V',`${n(s.initialAcidMol)}/${n(s.volumeL)}`,s.chlorideMolL,'mol/L'),
 step('Charge difference','D = (nA−nB)/V',`(${n(s.initialAcidMol)}−${n(s.deliveredBaseMol)})/${n(s.volumeL)}`,d,'mol/L; [H₃O⁺]−[OH⁻]'),
 step('Water-equilibrium discriminant','S = √(D²+4Kw)',`√((${n(d)})²+4 × 1e−14)`,root,'mol/L'),
 step('Hydronium with water autoionization',d>=0?'[H₃O⁺] = (D+S)/2':'[H₃O⁺] = 2Kw/(S−D)',d>=0?`(${n(d)}+${n(root)})/2`:`2 × 1e−14/(${n(root)}−(${n(d)}))`,s.hMolL,'mol/L; stable positive root'),
 step('Hydroxide with water autoionization','[OH⁻] = Kw/[H₃O⁺]',`1e−14/${n(s.hMolL)}`,s.ohMolL,'mol/L'),
 step('Ideal pH','pH = −log₁₀([H₃O⁺]/(1 mol/L))',`−log₁₀(${n(s.hMolL)})`,s.pH,'dimensionless; ideal concentration approximation'),
 step('Ideal pOH','pOH = −log₁₀([OH⁻]/(1 mol/L))',`−log₁₀(${n(s.ohMolL)})`,s.pOH,'dimensionless'),
 s.equivalentBaseMl===null?{title:'Equivalence volume target',formula:'Veq = cA VA/cB, only when cB > 0',substitution:`${n(q.acidMolL)} × ${n(q.acidMl)}/0 is not a valid titration target`,result:'Not defined: the burette solution supplies no base equivalents.'}:
 step('Equivalence volume target','Veq = cA VA/cB',`${n(q.acidMolL)} × ${n(q.acidMl)}/${n(q.baseMolL)}`,s.equivalentBaseMl,`mL; ${s.equivalentWithinPlan?'within':'outside'} planned charge; discrete aliquots may skip this exact volume`),
 step('Positive charge concentration','C⁺ = [H₃O⁺]+[Na⁺]',`${n(s.hMolL)}+${n(s.sodiumMolL)}`,s.positiveChargeMolL,'mol/L charge equivalents'),
 step('Negative charge concentration','C⁻ = [OH⁻]+[Cl⁻]',`${n(s.ohMolL)}+${n(s.chlorideMolL)}`,s.negativeChargeMolL,'mol/L charge equivalents; equals C⁺'),
 step('Liquid inventory closure','Vreservoir+Vflight+Vvessel',`${n(s.reservoirMl)}+${n(s.inFlightMl)}+${n(s.vesselMl)}`,s.liquidAccountedMl,'mL; equals initial acid volume plus burette charge'),
 step('Sodium inventory closure','nNa,reservoir+nNa,flight+nNa,vessel',`${n(s.reservoirBaseMol)}+${n(s.inFlightBaseMol)}+${n(s.deliveredBaseMol)}`,s.reservoirBaseMol+s.inFlightBaseMol+s.deliveredBaseMol,'mol; equals cB Vplan/1000'),
 step('Acid-equivalent closure','ξ+nA,excess',`${n(s.neutralizedMol)}+${n(s.acidExcessMol)}`,s.neutralizedMol+s.acidExcessMol,'mol; equals initial acid equivalents'),
 step('Arrived-base-equivalent closure','ξ+nB,excess',`${n(s.neutralizedMol)}+${n(s.baseExcessMol)}`,s.neutralizedMol+s.baseExcessMol,'mol; equals arrived base equivalents'),
 ];
}
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function neutralizationReport(raw:NeutralizationRecord){const r=validateNeutralizationRecord(raw);
 const tables=[[0,1,2,3,4,5,6,7],[0,8,9,10,11,12,13],[0,14,15,16,17,18],[0,19,20,21,22,23,24]].map((cols,i)=>`<table data-neutralization-table="${i}"><caption>${['Preparation and elapsed time','Burette and liquid volumes','Stoichiometric equivalent accounting','Calculated pH, category and observation'][i]}</caption><thead><tr>${cols.map(j=>`<th>${esc(neutralizationHeaders[j])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,k)=>{const row=neutralizationTrialValues(t,k);return `<tr>${cols.map(j=>`<td>${esc(row[j])}</td>`).join('')}</tr>`}).join('')}</tbody></table>`).join('');
 return `<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0063 Neutralization practical</title><style>body{font:15px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;margin:24px 0}th,td{border:1px solid #aaa;padding:7px;overflow-wrap:anywhere}p{white-space:pre-wrap;overflow-wrap:anywhere}li{break-inside:avoid;margin-bottom:12px}@page{size:A4 landscape;margin:14mm}@media print{body{max-width:none;margin:0}table{font-size:10px}thead{display:table-header-group}tr{break-inside:avoid}}</style><h1>Neutralizing an acidic solution</h1><p>CL-0063 · VisionariesAI Labs Private Limited · Virtual practical</p><h2>Aim</h2><p>Follow metered sodium-hydroxide solution into known hydrochloric acid. Compare acid excess, stoichiometric equivalence and base overshoot using calculated ideal pH and an elapsed titration curve.</p><h2>Principle</h2><p>HCl + NaOH → NaCl + H₂O. Net ionic shorthand: H⁺ + OH⁻ → H₂O. Sodium and chloride remain dissolved spectator ions. The solutions are clear; pH is calculated from an ideal equilibrium model, not inferred from physical colour.</p><h2>Apparatus and procedure</h2><p>Calibrated virtual burette, metering valve, sample vessel, timer and ideal pH readout. Record acid volume/concentration, base concentration, planned charge, aliquot count, interval and initial burette reading. Run, pause and record before, near and after the target volume. A falling aliquot has left the burette but has not entered the vessel: subtract it from the reading change. Repeat no-addition, water-dilution and no-acid controls. Use smaller effective aliquots to bracket equivalence; never snap an observation to pH7. Record result, conclusion and limitations.</p><h2>Prediction</h2><p>${esc(r.prediction)}</p><h2>Observations</h2>${tables}<h2>Formula substitution and worked results</h2>${r.trials.map((t,i)=>`<h3>Trial ${i+1}</h3><ol>${neutralizationCalculations(t).map(b=>`<li><b>${esc(b.title)}</b><p>${esc(b.formula)}</p><p>Substitution: ${esc(b.substitution)}</p><p>Result: ${esc(b.result)}</p></li>`).join('')}</ol>`).join('')}<h2>Result, conclusion and limitations</h2><p>${esc(r.conclusion)}</p><p>Complete dissociation of dilute strong acid/base, additive drawing volumes, fixed25°C, ideal ion activities and retained water autoionization. Whole aliquots mix/react instantly after contact. No heat balance, finite mixing kinetics, CO₂ uptake, splashing, pH-meter calibration/response or uncertainty model. Valve/nozzle hold-up and any probe displacement are omitted drawing references. Equivalence is a stoichiometric target; indicator endpoint is a different observation. Class placement is editorial; quantitative formulas are teacher extensions. This virtual model is not a physical handling procedure for unsupervised students.</p></html>`;
}

import { ionicPhaseState, ionicPhaseGuide, validateIonicPhase, type IonicPhaseInputs } from './ionicPhaseComparison';
export interface IonicPhaseTrial extends IonicPhaseInputs { guideBase:IonicPhaseInputs|null; guideSeconds:number|null; note:string }
export interface IonicPhaseRecord { plan:string; conclusion:string; trials:IonicPhaseTrial[] }
const clean=(x:unknown)=>typeof x==='string'?x.slice(0,4000):'';
const escape=(x:unknown)=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const f=(x:number|null)=>x===null?'Unavailable':Number(x.toPrecision(12)).toString();
export function validateIonicPhaseTrial(raw:unknown):IonicPhaseTrial {
 const q=validateIonicPhase(raw),r=raw as IonicPhaseTrial;
 let base:IonicPhaseInputs|null=null;
 if(r.guideSeconds===null){if(r.guideBase!==null)throw new RangeError('Manual snapshot must not contain a guide base')}
 else {
  if(typeof r.guideSeconds!=='number')throw new TypeError('Guide time or explicit manual snapshot required');
  base=validateIonicPhase(r.guideBase);const expected=ionicPhaseGuide(r.guideSeconds,base).inputs;
  if(q.phase!==expected.phase||Object.keys(q.cell).some(k=>q.cell[k as keyof typeof q.cell]!==expected.cell[k as keyof typeof q.cell]))throw new RangeError('Snapshot differs from guide stage');
 }
 return {...q,guideBase:base,guideSeconds:r.guideSeconds,note:clean(r.note)};
}
export function validateIonicPhaseRecord(raw:unknown):IonicPhaseRecord {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Practical notebook required');
 const r=raw as IonicPhaseRecord;if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('At most 40 observations');
 return{plan:clean(r.plan),conclusion:clean(r.conclusion),trials:r.trials.map(validateIonicPhaseTrial)};
}
export function ionicPhaseSnapshotLabel(q:IonicPhaseTrial){return q.guideSeconds===null?'Manual snapshot':q.guideSeconds<140?'Guided snapshot before verification':'Verified guide stage'}
export const ionicPhaseHeaders=[
 ['Trial','Material','Paired KCl reference','Gap (cm)','Width (cm)','Contact depth (cm)','Configured Vrms (V)','Source connected?','Phase cycle','Guide seconds or manual','Snapshot status','Student observation'],
 ['Trial','Applied Vrms (V)','Ideal transport Irms (A)','Instantaneous voltage (V)','Instantaneous transport current (A)','Ideal mean power (W)','Inverse reading available?'],
 ['Trial','Assigned aqueous κ (S/m)','Bulk G reading (S)','Reconstructed aqueous κ (S/m)','Solid conductivity measurement','Positive-ion drift sign','Negative-ion drift sign','Interpretation'],
];
export function ionicPhaseRows(q:IonicPhaseTrial,index:number){const s=ionicPhaseState(q);return[
 [index+1,q.phase,q.cell.sampleId,q.cell.gapCm,q.cell.widthCm,q.cell.immersedDepthCm,q.cell.voltageRmsV,q.cell.connected?'Yes':'No',q.cell.phaseCycle,q.guideSeconds??'Manual',ionicPhaseSnapshotLabel(q),q.note],
 [index+1,f(s.appliedVoltageRmsV),f(s.currentRmsA),f(s.instantVoltageV),f(s.instantCurrentA),f(s.meanPowerW),s.readingAvailable?'Yes':'No'],
 [index+1,f(s.assignedSolutionConductivitySM),f(s.measuredConductanceS),f(s.reconstructedConductivitySM),'Not measured',s.positiveIonDirection,s.negativeIonDirection,s.interpretation],
]}
export interface IonicPhaseWorking {key:string;title:string;formula:string;substitution:string;result:string;reason:string}
export function ionicPhaseCalculations(q:IonicPhaseInputs):IonicPhaseWorking[]{
 const s=ionicPhaseState(q),a=s.aqueousReference,w:IonicPhaseWorking[]=[];
 const add=(key:string,title:string,formula:string,substitution:string,value:number|null,unit:string,reason='')=>w.push({key,title,formula,substitution,result:value===null?'Unavailable':`${f(value)} ${unit}`.trim(),reason});
 add('voltage','Applied voltage','Vcell = connectedFlag × Vconfigured',`${q.cell.connected?1:0} * ${q.cell.voltageRmsV}`,s.appliedVoltageRmsV,'V');
 add('gap','Convert facing gap','l = gapCm / 100',`${q.cell.gapCm} / 100`,a.gapM,'m');
 add('area','Facing contact area','A = (widthCm / 100) × (depthCm / 100)',`(${q.cell.widthCm} / 100) * (${q.cell.immersedDepthCm} / 100)`,a.areaM2,'m²','For the solid this is contact geometry only; it does not imply a liquid cell constant.');
 if(s.fixedLattice){
  add('solidCurrent','Ideal fixed-lattice transport','Itransport = 0 (fixed-lattice model condition)','0',0,'A','Not a measured zero conductivity. Defects, moisture and thermal activation excluded.');
  add('solidConductivity','Solid conductivity','No solid conductivity measurement','Not evaluated',null,'','No calibrated solid transport model is supplied.');
 } else {
  add('reference','Assigned aqueous conductivity','κ = selected fixed-temperature reference',`${a.conductivitySM}`,a.conductivitySM,'S/m',a.sample.referenceNote);
  add('conductance','Reference bulk conductance','G = κ × A / l',`${a.conductivitySM} * ${a.areaM2} / ${a.gapM}`,a.bulkConductanceS,'S');
  add('current','Ideal RMS bulk current','Irms = Vcell × G',`${s.appliedVoltageRmsV} * ${a.bulkConductanceS}`,s.currentRmsA,'A');
  add('microCurrent','Convert current','IµA = IA × 1000000',`${s.currentRmsA} * 1000000`,s.currentRmsA*1e6,'µA');
  add('cellConstant','Wetted cell constant','K = l / A',a.wetted?`${a.gapM} / ${a.areaM2}`:'Not evaluated',a.cellConstantMInv,'m⁻¹',a.wetted?'':'No immersed area.');
  add('inverseG','Reconstruct bulk conductance','Greading = Irms / Vcell',s.readingAvailable?`${s.currentRmsA} / ${s.appliedVoltageRmsV}`:'Not evaluated',s.measuredConductanceS,'S',s.readingAvailable?'':'Requires connected, wetted and nonzero excitation.');
  add('inverseKappa','Reconstruct conductivity','κreading = Greading × K',s.readingAvailable?`${s.measuredConductanceS} * ${a.cellConstantMInv}`:'Not evaluated',s.reconstructedConductivitySM,'S/m',s.readingAvailable?'':'No inverse reading for this circuit state.');
 }
 add('power','Ideal bulk power','Pmean = Vrms × Irms',`${s.appliedVoltageRmsV} * ${s.currentRmsA}`,s.meanPowerW,'W');
 return w;
}
export const ionicPhaseProcedure=[
 'Predict whether charged ions are present in a solid KCl lattice and whether they can translate through it.',
 'Pause the demonstration before recording. Keep paired reference, source voltage and electrode geometry unchanged while comparing materials.',
 'Record the solid control: applied voltage can be present, but ideal fixed-lattice transport current is zero. Write “not measured” for solid conductivity.',
 'Follow separation of existing K+ and Cl− ions and schematic hydration. This visual transition is not a measured rate or a conductivity mixing law.',
 'Select the aqueous KCl reference. Note molality, fixed 25 °C temperature, RMS current and opposite ion drift. Reverse phase and distinguish instantaneous from RMS current.',
 'Compare ideal water at identical geometry and source settings. Retain its small positive current rather than rounding it to zero.',
 'Use the aqueous formulas with SI units. Disconnect the source or lift the electrodes to investigate why inverse readings become unavailable.',
 'Write a result supported by your observations: mobile charged carriers permit solution transport; the mere presence of ions is insufficient in the fixed-lattice model.',
];
export function ionicPhaseReport(raw:unknown){const r=validateIonicPhaseRecord(raw),rows=r.trials.map(ionicPhaseRows);return`<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0120 · Ionic solid and solution practical</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;font-size:12px;width:100%;margin:24px 0}th,td{border:1px solid #ccd4df;padding:8px;text-align:left;overflow-wrap:anywhere}article{break-inside:avoid;border-bottom:1px solid #ddd;padding:10px}code{overflow-wrap:anywhere} @media print{body{margin:0}table{font-size:9px}}</style><h1>Ionic solid and aqueous solution</h1><p>VisionariesAI Labs Private Limited · CL-0120</p><h2>Aim</h2><p>Compare charge transport in ideal solid KCl, an aqueous KCl reference and ideal water.</p><h2>Apparatus</h2><p>Virtual low-voltage AC source, paired electrodes, ideal bulk current channel, solid KCl structural inset and reference solution cell.</p><h2>Safety</h2><p>Virtual investigation. Do not connect household electricity to liquids. A real practical requires teacher supervision and approved low-voltage equipment.</p><h2>Plan</h2><p>${escape(r.plan)}</p><h2>Procedure</h2><ol>${ionicPhaseProcedure.map(x=>`<li>${escape(x)}</li>`).join('')}</ol><h2>Observations</h2>${ionicPhaseHeaders.map((headers,i)=>`<table><thead><tr>${headers.map(x=>`<th>${escape(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr>${x[i].map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('')}<h2>Calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${ionicPhaseCalculations(q).map(w=>`<article data-trial="${i}" data-key="${w.key}"><h4>${escape(w.title)}</h4><p class="formula">${escape(w.formula)}</p><code>${escape(w.substitution)}</code><p class="result">${escape(w.result)}</p><p>${escape(w.reason)}</p></article>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${escape(r.conclusion)}</p><h2>Precautions and limitations</h2><p>Fixed 25 °C, ideal in-phase 1 kHz bulk channel. Published KCl references are molality-based and solvent-excluded. No solid conductivity measurement, defect transport, electrode polarization, reactive current, electrolysis, detection limits or thermal feedback. Particle counts, spacing, hydration orientations and slow-motion timing are illustrative; no molecular dynamics or dissolution kinetics. Internal functional review does not imply independent expert or official curriculum certification.</p><script type="application/json" id="ionic-phase-record-inputs">${JSON.stringify(r).replace(/</g,'\\u003c')}</script></html>`}

import {checkCabbage,cabbageState,cabbageReference as c,type CabbageInputs,type CabbageSample} from './cabbageIndicator';
export interface CabbageTrial extends CabbageInputs {sample:CabbageSample;observation:string}
export interface CabbageRecord {prediction:string;conclusion:string;trials:CabbageTrial[]}
const text=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
export const cabbageNumber=(v:number)=>v===0?'0':Math.abs(v)<1e-5?v.toExponential(8):v.toFixed(6);
export function validateCabbageRecord(raw:unknown):CabbageRecord {
  const r=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};const trials:CabbageTrial[]=[];
  if(Array.isArray(r.trials))for(const value of r.trials){
    if(!value||typeof value!=='object')continue;const t=value as CabbageTrial;
    try{checkCabbage(t);if(!['acid','neutral','base'].includes(t.sample))continue;cabbageState(t,t.sample);trials.push({acidPH:t.acidPH,basePH:t.basePH,sampleMl:t.sampleMl,
      doseMl:t.doseMl,drops:t.drops,intervalS:t.intervalS,pigmentMgMl:t.pigmentMgMl,timeS:t.timeS,
      sample:t.sample,observation:text(t.observation)})}catch{/* Invalid saved controls are not observations. */}
  }
  return {prediction:text(r.prediction),conclusion:text(r.conclusion),trials:trials.slice(-60)};
}
export const cabbageHeaders=['Trial','Sample','Elapsed s','Known reference pH','Initial sample mL','Planned dose mL',
  'Programmed drops','Interval s','Stock pigment mg/mL','Released drops','Arrived drops','Reservoir mL',
  'In-flight mL','Vessel mL','Vessel pigment mg','Pigment mg/mL','Ideal [H⁺] mol/L','Ideal [OH⁻] mol/L','Visible colour','Observation'];
export function cabbageTrialValues(t:CabbageTrial,index:number){const s=cabbageState(t,t.sample),n=cabbageNumber;
  return [String(index+1),t.sample,...[t.timeS,s.referencePH,t.sampleMl,t.doseMl,t.drops,t.intervalS,t.pigmentMgMl,
    s.releasedCount,s.arrivedCount,s.reservoirMl,s.inFlightMl,s.vesselMl,s.vesselPigmentMg,s.concentrationMgMl,
    s.hMolL,s.ohMolL].map(n),s.observedColour,t.observation];
}
export function cabbageCalculations(q:CabbageInputs,sample:CabbageSample){const s=cabbageState(q,sample),n=cabbageNumber;
  const step=(title:string,formula:string,substitution:string,value:number,unit:string)=>({title,formula,substitution,result:`${n(value)} ${unit}`});
  return [
    step('Metered drop volume','Vdrop = Vdose / N',`${n(q.doseMl)} / ${q.drops}`,s.dropMl,'mL/drop'),
    step('Ideal fall time','tf = √(2h/g)',`√(2 × ${c.fallHeightM} / ${c.gravityMs2})`,s.flightS,'s; 8 cm bottom clearance, no air drag'),
    step('Released indicator volume','Vreleased = Nreleased Vdrop',`${s.releasedCount} × ${n(s.dropMl)}`,s.releasedMl,'mL'),
    step('Arrived indicator volume','Varrived = Narrived Vdrop',`${s.arrivedCount} × ${n(s.dropMl)}`,s.arrivedMl,'mL'),
    step('Reservoir volume','Vreservoir = (N − Nreleased) Vdrop',`(${q.drops} − ${s.releasedCount}) × ${n(s.dropMl)}`,s.reservoirMl,'mL'),
    step('In-flight volume','Vflight = (Nreleased − Narrived) Vdrop',`(${s.releasedCount} − ${s.arrivedCount}) × ${n(s.dropMl)}`,s.inFlightMl,'mL'),
    step('Vessel volume','Vvessel = Vsample + Varrived',`${n(q.sampleMl)} + ${n(s.arrivedMl)}`,s.vesselMl,'mL; additive drawing volumes'),
    step('Initial pigment mass','m₀ = Vdose cstock',`${n(q.doseMl)} × ${n(q.pigmentMgMl)}`,s.pigmentInitialMg,'mg'),
    step('Vessel pigment mass','mvessel = Varrived cstock',`${n(s.arrivedMl)} × ${n(q.pigmentMgMl)}`,s.vesselPigmentMg,'mg'),
    step('Vessel pigment concentration','cvessel = mvessel / Vvessel',`${n(s.vesselPigmentMg)} / ${n(s.vesselMl)}`,s.concentrationMgMl,'mg/mL'),
    step('Liquid inventory closure','Vreservoir + Vflight + Vvessel',`${n(s.reservoirMl)} + ${n(s.inFlightMl)} + ${n(s.vesselMl)}`,s.liquidAccountedMl,'mL; equals initial sample plus planned dose'),
    step('Pigment inventory closure','mreservoir + mflight + mvessel',`${n(s.reservoirPigmentMg)} + ${n(s.inFlightPigmentMg)} + ${n(s.vesselPigmentMg)}`,s.pigmentAccountedMg,'mg; equals initial pigment'),
    step('Ideal hydrogen-ion concentration','[H⁺] = 10^(−pH)',`10^(−${n(s.referencePH)})`,s.hMolL,'mol/L; calculated from known reference setting'),
    step('Ideal hydroxide-ion concentration','[OH⁻] = Kw / [H⁺]',`1.0e−14 / ${n(s.hMolL)}`,s.ohMolL,'mol/L; ideal activity approximation at 25 °C'),
  ];
}
const escape=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function cabbageReport(raw:CabbageRecord){const r=validateCabbageRecord(raw);
  const tables=[[0,1,2,3,4,5,6,7,8],[0,9,10,11,12,13,14,15],[0,16,17,18,19]].map((cols,i)=>`<table data-cabbage-table="${i}"><caption>${['Preparation and reference settings','Dosing and material inventory','Ion calculations and observations'][i]}</caption><thead><tr>${cols.map(j=>`<th>${escape(cabbageHeaders[j])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,k)=>{const row=cabbageTrialValues(t,k);return `<tr>${cols.map(j=>`<td>${escape(row[j])}</td>`).join('')}</tr>`}).join('')}</tbody></table>`).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0062 Cabbage indicator practical</title><style>body{font:15px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;margin:24px 0}th,td{border:1px solid #aaa;padding:7px;overflow-wrap:anywhere}pre,p{white-space:pre-wrap;overflow-wrap:anywhere}li{break-inside:avoid;margin-bottom:12px}@page{size:A4 landscape;margin:14mm}@media print{body{max-width:none;margin:0}table{font-size:10px}thead{display:table-header-group}tr{break-inside:avoid}}</style><h1>Cabbage indicator: comparing prepared references</h1><p>CL-0062 · VisionariesAI Labs Private Limited · Virtual practical</p><h2>Aim</h2><p>Compare qualitative indicator colours at equal dose in known acid, neutral and base reference buffers. Track liquid and pigment without inferring an unknown sample’s pH.</p><h2>Apparatus and method</h2><p>Three equal sample vessels, matched metered dispensers and a virtual timer. Record the settings before dosing. Run, pause and record initial, intermediate and final states for each reference. Compare equal elapsed times and equal doses. Repeat no-dose and pigment-free controls. Note the observed colour in words, not only a swatch.</p><h2>Prediction</h2><p>${escape(r.prediction)}</p><h2>Observations</h2>${tables}<h2>Formula substitution and worked results</h2>${r.trials.map((t,i)=>`<h3>Trial ${i+1}: ${escape(t.sample)}</h3><ol>${cabbageCalculations(t,t.sample).map(b=>`<li><b>${escape(b.title)}</b><p>${escape(b.formula)}</p><p>Substitution: ${escape(b.substitution)}</p><p>Result: ${escape(b.result)}</p></li>`).join('')}</ol>`).join('')}<h2>Result, conclusion and limitations</h2><p>${escape(r.conclusion)}</p><p>Known reference pH remains fixed: non-perturbing tracer assumption, not finite buffer-capacity chemistry. Colour anchors and drawing strength are illustrative, not calibrated spectra. Instant whole-drop mixing at contact; dispenser follows the surface to maintain its ideal fall clearance. No unknown-sample pH measurement, neutralization or pigment-species kinetics. Ion calculations use ideal concentrations at 25 °C and are teacher extensions.</p></html>`;
}

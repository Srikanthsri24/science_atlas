import {gasLiquidState,type GasLiquidInputs} from './gasLiquidDiffusion';
export function gasLiquidObservation(q:GasLiquidInputs){return{preparation:{...q},gas:gasLiquidState(q,'gas'),liquid:gasLiquidState(q,'liquid')}}
export function gasLiquidCalculations(q:GasLiquidInputs,medium:'gas'|'liquid'){
 const s=gasLiquidState(q,medium),f=(n:number)=>Number(n.toPrecision(7)).toString();
 const c=s.concentrationsUgMl,n=c.length;
 return [
 `Volume = A × L = ${f(q.areaMm2)} mm² × ${f(q.lengthMm)} mm = ${f(q.areaMm2*q.lengthMm)} mm³ = ${f(s.volumeMl)} mL.`,
 `Mean concentration = M / V = ${f(q.massUg)} µg / ${f(s.volumeMl)} mL = ${f(s.meanUgMl)} µg/mL.`,
 `D = ${f(s.diffusivityM2S)} m²/s × 10⁶ mm²/m² = ${f(s.diffusivityM2S*1e6)} mm²/s.`,
 `θ = Dt/L² = (${f(s.diffusivityM2S*1e6)} mm²/s × ${f(s.seconds)} s) / (${f(q.lengthMm)} mm)² = ${f(s.diffusivityM2S*1e6*s.seconds/q.lengthMm**2)}.${q.gateClosed?' Partition closed: exchange solver uses θ = 0.':''}`,
 `Left mass = Σ(left-cell concentration × cell volume) = ${f(s.leftMassUg)} µg. Right mass = M − left mass = ${f(q.massUg)} − ${f(s.leftMassUg)} = ${f(s.rightMassUg)} µg.`,
 q.gateClosed?'Central partition closed: cross-partition flux and transfer rate are zero.':`Grid-face flux = −D ΔC/Δx = −${f(s.diffusivityM2S*1e6)} × ((${f(c[n/2])} − ${f(c[n/2-1])}) / 1000) / ${f(s.dxMm)} = ${f(s.gridFluxUgMm2S)} µg/(mm²·s). Concentrations divided by1000 convert µg/mL to µg/mm³.`,
 `Transfer rate = J × A = ${f(s.gridFluxUgMm2S)} × ${f(q.areaMm2)} = ${f(s.transferUgS)} µg/s.`,
 `Conservation check: ${f(s.leftMassUg)} + ${f(s.rightMassUg)} = ${f(s.totalMassUg)} µg (prepared ${f(q.massUg)} µg).`,
 'The 160-cell face flux is a finite-grid estimate. The ideal continuum initial concentration step has singular instantaneous flux; do not interpret the finite initial grid value as a physical measurement.'
 ];
}
export const gasLiquidPracticalInstructions=[
 'Aim: compare diffusion of generic dilute passive tracers in sealed gas and liquid channels.',
 'Keep channel length, cross-sectional area and tracer mass identical. Record the chosen diffusion coefficients; they are teaching inputs, not measured material properties.',
 'Begin with the partition closed. Record the initial left and right masses and zero cross-partition transfer.',
 'Remove the ideal central partition. Under equal clocks, pause at several times and record both physical clocks, half-channel masses and net flux. Change only one independent variable per comparison.',
 'Reset for the matched-progress trial. Compare at the same Dt/L² and record the different physical times. Never label these observations as equal-time trials.',
 'Use the worked substitutions to check volume, concentration, transfer rate and total tracer conservation. Copy units into every table heading.',
 'Conclusion: compare transfer at equal physical times, then explain why matching Dt/L² produces matching profiles. State that convection, reactions and chemical-specific properties were excluded.'
];
export function gasLiquidExamReport(q:GasLiquidInputs){const r=gasLiquidObservation(q);return[
 'SCIENCE ATLAS 360° · VisionariesAI Labs Private Limited',
 'CL-0075 · Model diffusion in gases and liquids',
 ...gasLiquidPracticalInstructions,
 `Observation: ${q.mode==='equal'?'Equal physical clocks':'Matched diffusion progress'}; partition ${q.gateClosed?'closed':'removed'}.`,
 ...(['gas','liquid'] as const).flatMap(m=>[`${m.toUpperCase()} · physical time ${r[m].seconds} s`,...gasLiquidCalculations(q,m)]),
 'Result: '+(q.gateClosed?'No tracer crosses the closed partition.':q.mode==='matched'?'Matching dimensionless progress gives matching concentration profiles at different physical times.':'For the chosen coefficients, the gas transfers tracer faster at equal positive physical times.'),
 'Precautions and limitations: use sealed channels, exclude bulk stirring, preserve identical geometry and mass, distinguish model values from measured laboratory data, and distinguish finite representative tracers from continuum concentration.'
].join('\n\n')}
export const gasLiquidHeaders=['Trial','Clock comparison','Partition','L (mm)','A (mm²)','M (µg)','Medium','D (m²/s)','Physical time (s)','Exchange Dt/L²','Left mass (µg)','Right mass (µg)','Total (µg)','Mean concentration (µg/mL)','Grid flux (µg/mm²/s)','Transfer (µg/s)','Maximum deviation (%)'];
export function gasLiquidTrialValues(t:GasLiquidInputs,i:number,medium:'gas'|'liquid'){const s=gasLiquidState(t,medium);return[i+1,t.mode,t.gateClosed?'closed':'removed',t.lengthMm,t.areaMm2,t.massUg,medium,s.diffusivityM2S,s.seconds,s.theta,s.leftMassUg,s.rightMassUg,s.totalMassUg,s.meanUgMl,s.gridFluxUgMm2S,s.transferUgS,s.maxRelativeDeviation*100].map(v=>typeof v==='number'?Number(v.toPrecision(7)).toString():v)}
const escape=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function gasLiquidHtmlReport(record:{plan:string;conclusion:string;trials:GasLiquidInputs[]}){return`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0075 · Diffusion practical</title><style>body{font:15px/1.6 system-ui;color:#172238;max-width:1200px;margin:24px auto;padding:20px}h1,h2{color:#51418f}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #aebaca;padding:5px;text-align:left}section{overflow:auto}p,li{overflow-wrap:anywhere;white-space:pre-wrap}@media print{@page{size:A4 landscape;margin:12mm}body{padding:0;margin:0}thead{display:table-header-group}tr{break-inside:avoid}table{font-size:8px}section{overflow:visible}}</style><header><p>Science Atlas 360° · VisionariesAI Labs Private Limited</p><h1>CL-0075 · Model diffusion in gases and liquids</h1></header><h2>Aim, apparatus and procedure</h2><p>Apparatus: two identical sealed rectangular channels, central ideal partitions, virtual clocks and concentration/half-mass readers.</p><ol>${gasLiquidPracticalInstructions.map(v=>`<li>${escape(v)}</li>`).join('')}</ol><h2>Student prediction and plan</h2><p>${escape(record.plan||'Not entered')}</p><h2>Observation table</h2><section><table><caption>Paired trials, explicitly labelled physical clocks</caption><thead><tr>${gasLiquidHeaders.map(v=>`<th>${escape(v)}</th>`).join('')}</tr></thead><tbody>${record.trials.flatMap((q,i)=>(['gas','liquid']as const).map(m=>`<tr>${gasLiquidTrialValues(q,i,m).map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`)).join('')||'<tr><td colspan="17">No observations recorded.</td></tr>'}</tbody></table></section><h2>Worked calculations and model results</h2>${record.trials.map((q,i)=>`<h3>Trial ${i+1}</h3><p>${escape(gasLiquidExamReport(q))}</p>`).join('')}<h2>Student result, conclusion and limitations</h2><p>${escape(record.conclusion||'Not entered')}</p><p>Internal educational model; not a chemical-specific calibration or official curriculum verification. Latest60 paired trials retained in browser.</p></html>`}

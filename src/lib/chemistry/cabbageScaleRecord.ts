import { cabbageState, cabbagePair, checkCabbage, cabbageLimitations,
  type CabbageInputs, type CabbageFractions } from './cabbageScale';
export interface CabbageTrial extends CabbageInputs { note: string }
export interface CabbageRecord { plan: string; conclusion: string; trials: CabbageTrial[] }
export interface CabbageCalculation { title: string; formula: string; substitution: string; result: string }
const f = (n: number) => Number(n.toPrecision(12)).toString();
const text = (v: unknown) => typeof v === 'string' ? v.slice(0, 4000) : '';
const esc = (v: string) => v.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const fmt = (v: number | string) => typeof v === 'number' ? f(v) : v;
const block = (title: string, formula: string, substitution: string, result: string): CabbageCalculation => ({title, formula, substitution, result});
export function validateCabbageRecord(raw: unknown): CabbageRecord {
  const r = raw && typeof raw === 'object' ? raw as Record<string,unknown> : {};
  const trials: CabbageTrial[] = [];
  if (Array.isArray(r.trials)) for (const value of r.trials) try {
    checkCabbage(value);
    trials.push({sampleMl:value.sampleMl,indicatorDoseUl:value.indicatorDoseUl,testPH:value.testPH,
      fractions:[...value.fractions] as CabbageFractions,note:text(value.note)});
  } catch { /* Reconstruct quantities only from a valid complete input contract. */ }
  return {plan:text(r.plan),conclusion:text(r.conclusion),trials:trials.slice(-40)};
}
export const cabbagePreparationHeaders = ['Trial','Sample per tube mL','Indicator per tube µL','Independently specified test pH','Reference2 fraction','Reference4 fraction','Reference7 fraction','Reference9 fraction','Reference11 fraction','Investigation fraction','Observation'];
export function cabbagePreparationValues(q: CabbageTrial, i: number) {
  checkCabbage(q);return [i+1,q.sampleMl,q.indicatorDoseUl,q.testPH,...q.fractions,q.note].map(fmt);
}
export const cabbageObservationHeaders = ['Trial','Tube','Imposed pH','Dose fraction','Indicator delivered µL','Indicator delivered mL','Total mL','Total L','Indicator volume fraction','Protocol complete','Teaching category','Ideal H⁺ mol/L','Ideal OH⁻ mol/L','Ideal pOH','Volume residual mL','Kw residual (mol/L)²'];
export function cabbageObservationValues(q: CabbageInputs, i: number, index: number) {
  const t=cabbageState(q).tubes[index];if(!t)throw new RangeError('Tube0–5 required');
  return [i+1,t.name,t.pH,t.fraction,t.deliveredUl,t.deliveredMl,t.volumeMl,t.volumeL,t.indicatorVolumeFraction,t.complete?'Yes':'No',t.category,t.hydrogenM,t.hydroxideM,t.pOH,t.volumeResidualMl,t.kwResidualM2].map(fmt);
}
export const cabbageComparisonHeaders = ['Trial','Reference pH','Specified test pH','Test minus reference pH','Reference/test H⁺ ratio','10^(pHtest−pHref)','Same completed teaching category','All six prepared','Colour-only inference'];
export function cabbageComparisonValues(q: CabbageInputs, i: number, reference: number) {
  if(!Number.isInteger(reference)||reference<0||reference>4)throw new RangeError('Reference0–4 required');
  const s=cabbageState(q),p=cabbagePair(q,reference,5);
  return [i+1,s.tubes[reference].pH,q.testPH,p.deltaPH,p.hydrogenRatioLeftToRight,p.tenPowerDelta,
    p.sameTeachingCategory===null?'Not ready':p.sameTeachingCategory?'Yes':'No',s.ready?'Yes':'No',s.inference].map(fmt);
}
export const cabbageProcedure = [
  'Aim: compare prepared cabbage-indicator teaching references with an investigation, while distinguishing independently specified pH from evidence available through colour matching.',
  'Apparatus: five separate known-pH reference tubes, one investigation tube, a finite metered indicator reservoir, a clean delivery tip, white comparison cards and a notebook. The selected teaching cards are original illustrations, not measured calibration standards.',
  'Record the equal initial sample volume, selected indicator dose and independently specified investigation pH. Keep each tube independent. The reference conditions are ideal maintained pH; indicator loading and real buffer chemistry are not calculated.',
  'Meter the same selected indicator amount into each reference separately. Record delivered fraction, actual volume and whether the protocol is complete. Do not read a partial-dose hatching pattern as a real dye colour.',
  'Prepare the investigation with the same selected dose and viewing conditions. Compare only after all six selected additions are complete.',
  'Record every reference category, the investigation category and all matching selected reference pH values. The shared pink cards at pH2 and pH4 deliberately demonstrate ambiguity. Matching listed cards does not prove that an unknown lies in the continuous interval between them.',
  'For the optional ideal calculations, convert microlitres to millilitres, add actual delivered volume and account for the finite remaining stock. Calculate H⁺ from the independently imposed pH, pOH=14−pH and OH⁻ from pOH at ideal25°C.',
  'Compare two independently specified pH values using Href/Htest=10^(pHtest−pHref). A two-unit difference means a100-fold ideal concentration ratio even when the chosen teaching shade is shared. Do not average pH arithmetically or infer pH from an arbitrary RGB value.',
  'Write the colour-only result separately from the disclosed reference pH and numerical work. State the illustrative scale, neglected indicator load, ideal reference conditions and lack of measured dye kinetics or universal colour calibration. Do not claim a chemical identity from matching colour.'
];
export function cabbageTubeCalculations(q: CabbageInputs, index: number) {
  const t=cabbageState(q).tubes[index];if(!t)throw new RangeError('Tube0–5 required');
  return [
    block('Delivered indicator','Vindicator,µL=planned dose × delivered fraction',`${f(q.indicatorDoseUl)} × ${f(t.fraction)}`,`${f(t.deliveredUl)} µL`),
    block('Indicator volume conversion','Vindicator,mL=Vindicator,µL/1000',`${f(t.deliveredUl)}/1000`,`${f(t.deliveredMl)} mL`),
    block('Current tube volume','Vtube,mL=Vsample,mL+Vindicator,mL',`${f(q.sampleMl)}+${f(t.deliveredMl)}`,`${f(t.volumeMl)} mL`),
    block('Tube volume in litres','Vtube,L=Vtube,mL/1000',`${f(t.volumeMl)}/1000`,`${f(t.volumeL)} L`),
    block('Indicator volume fraction','φ=Vindicator,mL/Vtube,mL',`${f(t.deliveredMl)}/${f(t.volumeMl)}`,f(t.indicatorVolumeFraction)),
    block('Ideal hydroxide exponent','pOH=pKw−pH at ideal25°C',`14−${f(t.pH)}`,f(t.pOH)),
    block('Ideal hydrogen concentration','H=1mol/L ×10^(−imposed pH)',`10^(-${f(t.pH)})`,`${f(t.hydrogenM)} mol/L`),
    block('Ideal hydroxide concentration','OH=1mol/L ×10^(−pOH)',`10^(-${f(t.pOH)})`,`${f(t.hydroxideM)} mol/L`),
    block('Water-product closure','rKw=H OH−1e-14',`${f(t.hydrogenM)} × ${f(t.hydroxideM)}−1e-14`,`${f(t.kwResidualM2)} (mol/L)²`),
    block('Tube-volume closure','rV=Vtube−Vsample−Vindicator',`${f(t.volumeMl)}−${f(q.sampleMl)}−${f(t.deliveredMl)}`,`${f(t.volumeResidualMl)} mL`),
  ];
}
export function cabbageCommonCalculations(q: CabbageInputs) {
  const s=cabbageState(q);
  return [
    block('Initial indicator stock','Vstock,0=6 × planned dose',`6 × ${f(q.indicatorDoseUl)}`,`${f(s.initialStockUl)} µL`),
    block('Total delivered indicator','Vdelivered=Σ six delivered doses',s.tubes.map(t=>f(t.deliveredUl)).join('+'),`${f(s.deliveredTotalUl)} µL`),
    block('Indicator remaining','Vremaining=Vstock,0−Vdelivered',`${f(s.initialStockUl)}−${f(s.deliveredTotalUl)}`,`${f(s.remainingStockUl)} µL`),
    block('Indicator-stock closure','rstock=Vstock,0−Vdelivered−Vremaining',`${f(s.initialStockUl)}−${f(s.deliveredTotalUl)}−${f(s.remainingStockUl)}`,`${f(s.stockResidualUl)} µL`),
    block('Initial samples','Vsamples,0=6 × Vsample',`6 × ${f(q.sampleMl)}`,`${f(s.initialSamplesMl)} mL`),
    block('Whole-system volume closure','rsystem=ΣVtube+Vremaining/1000−(Vsamples,0+Vstock,0/1000)',`${s.tubes.map(t=>f(t.volumeMl)).join('+')}+${f(s.remainingStockUl)}/1000−(${f(s.initialSamplesMl)}+${f(s.initialStockUl)}/1000)`,`${f(s.systemVolumeResidualMl)} mL`),
  ];
}
export function cabbagePairCalculations(q: CabbageInputs, reference: number) {
  if(!Number.isInteger(reference)||reference<0||reference>4)throw new RangeError('Reference0–4 required');
  const s=cabbageState(q),p=cabbagePair(q,reference,5),a=s.tubes[reference],b=s.investigation;
  return [
    block('Specified pH difference','ΔpH=pHtest−pHref',`${f(b.pH)}−${f(a.pH)}`,f(p.deltaPH)),
    block('Hydrogen concentration ratio','Href/Htest',`${f(a.hydrogenM)}/${f(b.hydrogenM)}`,f(p.hydrogenRatioLeftToRight)),
    block('Logarithmic ratio check','Href/Htest=10^(pHtest−pHref)',`10^(${f(p.deltaPH)})`,f(p.tenPowerDelta)),
  ];
}
export function cabbageResultSummary(q: CabbageInputs) {
  const s=cabbageState(q);
  return `${s.inference} ${f(s.deliveredTotalUl)} µL indicator delivered across six independent tubes;${f(s.remainingStockUl)} µL remains. The independently specified investigation pH is ${q.testPH};its optional ideal H⁺ calculation is ${f(s.investigation.hydrogenM)} mol/L. This is not a colour-derived measurement. Selected-reference matches: ${s.matchingReferences.length?s.matchingReferences.join(', '):'not ready'}.`;
}
export function cabbageReport(raw: unknown) {
  const r=validateCabbageRecord(raw);
  const table=(headers:string[],rows:string[][])=>`<table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const work=(blocks:CabbageCalculation[])=>`<ol>${blocks.map(b=>`<li class="worked"><b>${esc(b.title)}</b><code>${esc(b.formula)}</code><p class="substitution">${esc(b.substitution)}</p><p class="result">${esc(b.result)}</p></li>`).join('')}</ol>`;
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0095 cabbage reference-scale practical</title><style>body{font:16px/1.6 system-ui;max-width:1200px;margin:2rem auto;padding:1rem;color:#172238}table{border-collapse:collapse;display:block;overflow:auto;margin:1rem 0}th,td{border:1px solid #cad2e0;padding:.5rem;min-width:6rem;overflow-wrap:anywhere}code{display:block;white-space:normal}.worked{break-inside:avoid;margin-bottom:1rem}pre{white-space:pre-wrap}@media print{body{margin:0;max-width:none;font-size:10pt}table{display:table;font-size:7pt;width:100%}th,td{min-width:0;padding:3pt}}</style><body><h1>Cabbage reference-scale practical</h1><p>Science Atlas360° · VisionariesAI Labs Private Limited</p><h2>Aim</h2><p>Compare selected indicator reference cards and distinguish qualitative matching from independently specified pH and ideal calculations.</p><h2>Student hypothesis and plan</h2><pre>${esc(r.plan)}</pre><h2>Apparatus,controlled variables and procedure</h2><ol>${cabbageProcedure.map(p=>`<li>${esc(p)}</li>`).join('')}</ol><h2>Preparation observations</h2>${table(cabbagePreparationHeaders,r.trials.map(cabbagePreparationValues))}<h2>Six-tube observations</h2>${table(cabbageObservationHeaders,r.trials.flatMap((q,i)=>[0,1,2,3,4,5].map(n=>cabbageObservationValues(q,i,n))))}<h2>Reference comparison</h2>${table(cabbageComparisonHeaders,r.trials.flatMap((q,i)=>[0,1,2,3,4].map(n=>cabbageComparisonValues(q,i,n))))}<h2>Formula substitution and worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1} · common volume accounts</h3>${work(cabbageCommonCalculations(q))}${[0,1,2,3,4,5].map(n=>`<h3>Trial ${i+1} · tube ${n+1}</h3>${work(cabbageTubeCalculations(q,n))}`).join('')}${[0,1,2,3,4].map(n=>`<h3>Trial ${i+1} · reference ${n+1} versus investigation</h3>${work(cabbagePairCalculations(q,n))}`).join('')}`).join('')}<p>Numbers display twelve significant digits;exact original inputs are retained. Free-ion quantities are ideal reference calculations,not measured dye calibration.</p><h2>Calculated result from last observation</h2><p>${r.trials.length?esc(cabbageResultSummary(r.trials.at(-1)!)):'No observation recorded.'}</p><h2>Student result and conclusion</h2><pre>${esc(r.conclusion)}</pre><h2>Limitations</h2><p>${esc(cabbageLimitations)}</p><script type="application/json" id="cabbage-scale-record-inputs">${JSON.stringify(r).replace(/</g,'\\u003c')}</script></body></html>`;
}

import {
  coolingCrystalState, checkCoolingCrystals, coolingCrystalReference as ref,
  type CoolingCrystalInputs,
} from './coolingCrystalGrowth';

export interface CoolingTrial extends CoolingCrystalInputs {
  program: 'fast' | 'slow';
  observation: string;
}
export interface CoolingRecord { prediction: string; conclusion: string; trials: CoolingTrial[] }
const clean = (v: unknown) => typeof v === 'string' ? v.slice(0,4000) : '';
export const coolingNumber = (v: number) => v === 0 ? '0' : Math.abs(v)<1e-5 ? v.toExponential(8) : v.toFixed(6);

export function validateCoolingRecord(raw: unknown): CoolingRecord {
  const r=raw && typeof raw === 'object' ? raw as Record<string,unknown> : {};
  const trials: CoolingTrial[]=[];
  if(Array.isArray(r.trials)) for(const v of r.trials.slice(-60)) {
    if(!v || typeof v !== 'object') continue;
    const t=v as CoolingTrial;
    try {
      checkCoolingCrystals(t);
      if(t.program !== 'fast' && t.program !== 'slow') continue;
      trials.push({waterG:t.waterG,saltG:t.saltG,fastCoolingS:t.fastCoolingS,
        slowMultiplier:t.slowMultiplier,growthFluxGcm2s:t.growthFluxGcm2s,
        nucleationPerS:t.nucleationPerS,threshold:t.threshold,timeS:t.timeS,
        program:t.program,observation:clean(t.observation)});
    } catch { /* Malformed saved states are not observations. */ }
  }
  return {prediction:clean(r.prediction),conclusion:clean(r.conclusion),trials};
}

export const coolingHeaders=['Trial','Program','Elapsed s','Water g','Initial salt g',
  'Fast duration s','Slow multiplier','Chosen growth flux g/(cm² s)',
  'Chosen site coefficient s⁻¹','Chosen threshold','Cooling duration s',
  'Temperature °C','Capacity g','Dissolved g','Solid g','Effective sites',
  'Mean equivalent radius cm','Supersaturation','Surface growth g/s',
  'Nucleus mass g','Whole contents g','Observation'];
export function coolingTrialValues(t: CoolingTrial,index: number) {
  const s=coolingCrystalState(t,t.program);
  return [String(index+1),t.program,...[t.timeS,t.waterG,t.saltG,t.fastCoolingS,
    t.slowMultiplier,t.growthFluxGcm2s,t.nucleationPerS,t.threshold,s.coolingDurationS,
    s.temperatureC,s.capacityG,s.dissolvedG,s.crystalG,s.sites,s.meanEquivalentRadiusCm,
    s.supersaturation,s.growthRateGS,s.nucleusMassG,s.wholeMassG].map(coolingNumber),t.observation];
}

/** Numerical inventories are explicitly identified as integration outputs;
 * instantaneous rates are not multiplied by the entire elapsed time. */
export function coolingCalculations(q: CoolingCrystalInputs,program: 'fast'|'slow') {
  const s=coolingCrystalState(q,program),n=coolingNumber;
  const lo=s.temperatureC<=40?20:s.temperatureC<=60?40:60;
  const lowS=lo===20?31.6:lo===40?63.9:110;
  const highS=lo===20?63.9:lo===40?110:169;
  const step=(title:string,formula:string,substitution:string,value:number,unit:string) =>
    ({title,formula,substitution,result:`${n(value)} ${unit}`});
  return [
    step('Cooling duration','d = dfast × (1 for fast; multiplier for slow)',`${n(q.fastCoolingS)} × ${program==='fast'?'1':n(q.slowMultiplier)}`,s.coolingDurationS,'s'),
    step('Prescribed temperature','T = 80 − 60 min(1,t/d)',`80 − 60 × min(1,${n(q.timeS)}/${n(s.coolingDurationS)})`,s.temperatureC,'°C; prescribed, not heat-balance prediction'),
    step('Reference solubility','sT = slo + (shi−slo)(T−Tlo)/20',`${n(lowS)} + (${n(highS)}−${n(lowS)}) × (${n(s.temperatureC)}−${lo})/20`,s.solubilityGPer100WaterG,'g per 100 g WATER; coarse interpolation'),
    step('Dissolved capacity','C = W sT/100',`${n(q.waterG)} × ${n(s.solubilityGPer100WaterG)}/100`,s.capacityG,'g salt'),
    step('Numerical solid inventory','X = ∫[m₀ B max(σ−σ₀,0)² + kg A σ] dt',`Positive exponential transfer with ≤${ref.stepS} s steps, X(0)=0; t=${n(q.timeS)} s`,s.crystalG,'g; integrated changing rates, not current rate × time'),
    step('Numerical effective sites','N = ∫ B max(σ−σ₀,0)² dt',`N(0)=0; B=${n(q.nucleationPerS)} s⁻¹, threshold=${n(q.threshold)}; same evolving trajectory`,s.sites,'effective sites; not a literal crystal count'),
    step('Dissolved inventory','D = M−X',`${n(q.saltG)} − ${n(s.crystalG)}`,s.dissolvedG,'g'),
    step('Current saturation ratio','R = D/C',`${n(s.dissolvedG)}/${n(s.capacityG)}`,s.saturationRatio,'dimensionless'),
    step('Current supersaturation','σ = max(R−1,0)',`max(${n(s.saturationRatio)}−1,0)`,s.supersaturation,'dimensionless'),
    step('Current effective site formation','dN/dt = B max(σ−σ₀,0)²',`${n(q.nucleationPerS)} × max(${n(s.supersaturation)}−${n(q.threshold)},0)²`,s.siteBirthRateSInv,'effective sites/s; chosen teaching law'),
    step('Material in nuclei','mnuclei = m₀N',`${ref.nucleusMassG} g × ${n(s.sites)}`,s.nucleusMassG,'g; already included in X'),
    step('Mass transferred by subsequent growth','mgrowth = X−m₀N',`${n(s.crystalG)} − ${n(s.nucleusMassG)}`,s.surfaceGrowthMassG,'g'),
    step('Solid volume','V = X/ρ',`${n(s.crystalG)}/${ref.densityGcm3}`,s.crystalVolumeCm3,'cm³'),
    step('Mean mass per effective site','mmean = X/N, or 0 if N=0',`${n(s.crystalG)}/${n(s.sites)}; zero-site branch avoids division by zero`,s.meanCrystalMassG,'g/effective site'),
    step('Mean equivalent spherical radius','r = [3X/(4πρN)]^(1/3), or 0 if N=0',`[3 × ${n(s.crystalG)}/(4π × ${ref.densityGcm3} × ${n(s.sites)})]^(1/3); zero-site branch if needed`,s.meanEquivalentRadiusCm,'cm; equivalent size, not crystal habit'),
    step('Equivalent growth area','A = (36π)^(1/3) (X/ρ)^(2/3) N^(1/3)',`(36π)^(1/3) × (${n(s.crystalG)}/${ref.densityGcm3})^(2/3) × ${n(s.sites)}^(1/3)`,s.areaCm2,'cm²'),
    step('Current surface growth rate','vgrowth = kg A σ',`${n(q.growthFluxGcm2s)} × ${n(s.areaCm2)} × ${n(s.supersaturation)}`,s.growthRateGS,'g/s; excludes material in newly born nuclei'),
    step('Current nucleus mass rate','vnuclei = m₀ dN/dt',`${ref.nucleusMassG} × ${n(s.siteBirthRateSInv)}`,s.nucleusRateGS,'g/s'),
    step('Current total solid rate','dX/dt = vgrowth+vnuclei',`${n(s.growthRateGS)} + ${n(s.nucleusRateGS)}`,s.totalCrystalRateGS,'g/s'),
    step('Salt closure','D+X = M',`${n(s.dissolvedG)} + ${n(s.crystalG)}`,s.saltAccountedG,'g'),
    step('Whole contents','W+D+X = W+M',`${n(q.waterG)} + ${n(s.dissolvedG)} + ${n(s.crystalG)}`,s.wholeMassG,'g'),
    step('Equilibrium solid at current temperature','Xeq = max(M−C,0)',`max(${n(q.saltG)} − ${n(s.capacityG)},0)`,s.equilibriumCrystalG,'g; does not imply equilibrium has been reached'),
  ];
}

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function coolingCrystalReport(input:unknown) {
  const r=validateCoolingRecord(input);
  const groups=[{title:'A. Preparation and chosen controls',cols:[0,1,2,3,4,5,6,7,8,9]},
    {title:'B. Temperature and inventories',cols:[0,1,2,10,11,12,13,14,19,20,21]},
    {title:'C. Population and growth',cols:[0,1,2,15,16,17,18]}];
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CL-0060 Cooling and crystal growth practical</title>
<style>body{font:16px/1.6 system-ui;max-width:1100px;margin:auto;padding:24px;overflow-wrap:anywhere}.table{overflow:auto}table{width:100%;min-width:1000px;border-collapse:collapse;font-size:12px}td,th{border:1px solid #aaa;padding:8px}code{white-space:normal}@page{size:A4 landscape;margin:12mm}@media print{body{padding:0;font-size:11px}.table{overflow:visible}table{min-width:0;table-layout:fixed;font-size:8px}td,th{padding:3px}tr{break-inside:avoid}}</style>
<h1>Compare crystal growth during fast and slow cooling</h1><p>Science Atlas 360° · VisionariesAI Labs Private Limited · CL-0060 · Class 5 editorial investigation</p>
<h2>Aim</h2><p>Investigate how two prescribed cooling durations affect supersaturation, effective growth sites and equivalent crystal size for equal initial solutions.</p>
<h2>Apparatus and assumptions</h2><p>Two covered virtual potassium-nitrate solutions start at 80°C with no crystals. Water and salt are conserved. Linear cooling ends at 20°C and then holds. The solubility reference is a coarse piecewise interpolation on a water-mass basis. Effective site formation and surface growth use chosen teaching laws; they are not calibrated material kinetics or literal crystal counts. No evaporation or heat-balance solver.</p>
<h2>Prediction</h2><p>${esc(r.prediction)||'Not entered.'}</p><h2>Procedure</h2><ol>
<li>Record equal water and dissolved salt masses, fast duration and slow multiplier. Keep growth flux, site coefficient and threshold matched.</li><li>Predict the effect of cooling duration. Both samples begin clear at 80°C.</li><li>Run and pause at several elapsed times. Record both temperatures as well as dissolved and solid inventories.</li><li>Compare after both programs have reached 20°C, allowing further growth if needed. Equal elapsed time during cooling does not imply equal temperature.</li><li>Record effective sites, equivalent radius and current supersaturation. Distinguish cumulative mass from instantaneous growth rate.</li><li>Check salt and water closure; substitute values with units. State the observed model result and its limitations.</li></ol>
<h2>Observation tables</h2>${groups.map((g,j)=>`<h3>${g.title}</h3><div class="table"><table data-cooling-table="${j}"><thead><tr>${g.cols.map(i=>`<th>${esc(coolingHeaders[i])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,i)=>{const values=coolingTrialValues(t,i);return `<tr>${g.cols.map(k=>`<td>${esc(values[k])}</td>`).join('')}</tr>`}).join('')||`<tr><td colspan="${g.cols.length}">No observations recorded.</td></tr>`}</tbody></table></div>`).join('')}
<h2>Formula substitution and worked calculations</h2><p>Numerical inventories integrate changing rates; the current rate is not multiplied by the full elapsed time. Tiny quantities use scientific notation. Quantitative formulas are teacher extensions.</p>${r.trials.map((t,i)=>`<h3>Trial ${i+1} · ${t.program}</h3><ol>${coolingCalculations(t,t.program).map(c=>`<li><strong>${esc(c.title)}</strong><p><code>${esc(c.formula)}</code></p><p>Substitution: ${esc(c.substitution)}</p><p>Result: ${esc(c.result)}</p></li>`).join('')}</ol>`).join('')}
<h2>Result, conclusion and limitations</h2><p>${esc(r.conclusion)||'Not entered.'}</p><h2>Interpretation and precautions</h2><p>Virtual investigation, not an unsupervised chemical preparation. Effective sites may be fractional. Equivalent spherical size and area do not predict actual habit or a measured size distribution. Cooling is prescribed, not a thermal calculation. All nucleus mass is included in the solid inventory. The chosen coefficients are not measured nucleation or growth constants. Numerical integration uses steps no larger than 0.05 s; finite-step convergence is checked separately. No official-board, physical-device or independent-expert certification is claimed.</p></html>`;
}

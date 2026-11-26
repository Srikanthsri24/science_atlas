import {checkCoating,coatingState,coatingCases,coatingNames,coatingReference as c,type CoatingInputs,type CoatingCase} from './corrosionCoatings';
import {rustNumber as n} from './rustConditionsRecord';
export interface CoatingTrial extends CoatingInputs {kind:CoatingCase;observation:string}
export interface CoatingRecord {prediction:string;conclusion:string;trials:CoatingTrial[]}
const writing=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
export function validateCoatingRecord(raw:unknown):CoatingRecord{
 const r=raw&&typeof raw==='object'?raw as Record<string,unknown>:{},trials:CoatingTrial[]=[];
 if(Array.isArray(r.trials))for(const value of r.trials){if(!value||typeof value!=='object')continue;const t=value as CoatingTrial;
  try{checkCoating(t);if(!coatingCases.includes(t.kind))continue;trials.push({ironG:t.ironG,waterMl:t.waterMl,chamberMl:t.chamberMl,oxygenFraction:t.oxygenFraction,bareCoefficientPerDay:t.bareCoefficientPerDay,relativeTransmission:t.relativeTransmission,exposedFraction:t.exposedFraction,timeDays:t.timeDays,kind:t.kind,observation:writing(t.observation)})}catch{/* Derived stored results are recomputed. */}
 }return {prediction:writing(r.prediction),conclusion:writing(r.conclusion),trials:trials.slice(-60)};
}
export const coatingHeaders=['Trial','Reference condition','Day','Initial iron g','Available water mL','Cell cavity mL','Initial O₂ fraction','Chosen bare coefficient /day','Chosen covered transmission','Exposed face fraction','Inert film g','Exposed-zone iron g','Covered-zone iron g','Exposed-zone product g','Covered-zone product g','All product g','O₂ remaining mol','Water remaining g','Gas space mL','Dry-gas pressure kPa','Specimen including film g','Whole-cell material g','Initial whole-cell material g','Latest reference event','Observation'];
export function coatingTrialValues(t:CoatingTrial,i:number){const s=coatingState(t,t.kind);return [String(i+1),coatingNames[t.kind],...[t.timeDays,t.ironG,t.waterMl,t.chamberMl,t.oxygenFraction,t.bareCoefficientPerDay,s.transmission,s.exposed,s.coatingG,s.zones[0].ironLeftG,s.zones[1].ironLeftG,s.zones[0].productG,s.zones[1].productG,s.productG,s.oxygenLeftMol,s.waterLeftG,s.gasVolumeMl,s.pressureKPa,s.specimenG,s.totalG,s.initialTotalG].map(n),s.segments.at(-1)?.event??'No reaction interval',t.observation]}
export interface CoatingCalculation {title:string;formula:string;substitution:string;result:string}
export function coatingCalculations(q:CoatingInputs,kind:CoatingCase){
 const s=coatingState(q,kind),blocks:CoatingCalculation[]=[];
 const step=(title:string,formula:string,substitution:string,value:number,unit:string)=>blocks.push({title,formula,substitution,result:`${n(value)} ${unit}`});
 step('Initial iron amount','nFe₀ = mFe₀/MFe',`${n(q.ironG)}/${c.ironMolarG}`,s.initialIronMol,'mol Fe');
 step('Initial available water','nW₀ = ρW VW₀/MW',`${c.waterDrawingDensityGml} × ${n(q.waterMl)}/${c.waterMolarG}`,s.initialWaterMol,'mol H₂O');
 step('Initial metal volume','VFe₀ = mFe₀/ρFe',`${n(q.ironG)}/${c.ironDrawingDensityGml}`,q.ironG/c.ironDrawingDensityGml,'mL');
 step('Inert film volume','Vfilm = (1−f)Aface hfilm',`(1−${n(s.exposed)}) × ${c.faceWidthCm} × ${c.faceDepthCm} × ${c.filmThicknessCm}`,s.coatingVolumeMl,'mL; chosen uniform film');
 step('Inert film mass','mfilm = ρfilm Vfilm',`${c.filmDrawingDensityGml} × ${n(s.coatingVolumeMl)}`,s.coatingG,'g; retained unchanged');
 step('Initial gas space','Vgas₀ = Vcell−VFe₀−VW₀−Vfilm',`${n(q.chamberMl)}−${n(q.ironG/c.ironDrawingDensityGml)}−${n(q.waterMl)}−${n(s.coatingVolumeMl)}`,s.initialGasVolumeMl,'mL');
 step('Initial gas amount','ngas₀ = P₀(Vgas₀/1000)/(RT)',`${c.initialPressureKPa} × (${n(s.initialGasVolumeMl)}/1000)/(${c.gasConstantLKPaMolK} × ${c.temperatureK})`,s.initialGasMol,'mol O₂/N₂ reference');
 step('Initial oxygen amount','nO₂₀ = yO₂₀ ngas₀',`${n(q.oxygenFraction)} × ${n(s.initialGasMol)}`,s.initialOxygenMol,'mol O₂');
 step('Inert gas amount','nN₂ = (1−yO₂₀)ngas₀',`(1−${n(q.oxygenFraction)}) × ${n(s.initialGasMol)}`,s.inertMol,'mol N₂');
 step('Initial exposed-zone iron','nFe,e₀ = f nFe₀',`${n(s.exposed)} × ${n(s.initialIronMol)}`,s.initialZoneIronMol[0],'mol Fe');
 step('Initial covered-zone iron','nFe,c₀ = (1−f)nFe₀',`(1−${n(s.exposed)}) × ${n(s.initialIronMol)}`,s.initialZoneIronMol[1],'mol Fe');
 step('Chosen exposed-zone weight','we = f',n(s.exposed),s.weights[0],'dimensionless; zero after local iron exhaustion');
 step('Chosen covered-zone weight','wc = (1−f)p',`(1−${n(s.exposed)}) × ${n(s.transmission)}`,s.weights[1],'dimensionless; relative access, not measured permeability');
 let previousUsed:[number,number]=[0,0];
 s.segments.forEach((seg,i)=>{
  const prefix=`Interval ${i+1} · `,W=seg.weights[0]+seg.weights[1],lambda=q.bareCoefficientPerDay*W;
  const local=seg.weights.map((w,j)=>w>0?Math.max(0,.75*s.initialZoneIronMol[j]-previousUsed[j])*W/w:Infinity);
  const waterLimit=Math.max(0,1.5*s.initialWaterMol-previousUsed[0]-previousUsed[1]);
  const delta=Math.min(seg.oxygenStartMol,waterLimit,...local),eventTime=delta<seg.oxygenStartMol?-Math.log1p(-delta/seg.oxygenStartMol)/lambda:Infinity;
  const show=(v:number)=>Number.isFinite(v)?n(v):'inactive channel';
  step(prefix+'active access','W = we,active + wc,active',`${n(seg.weights[0])}+${n(seg.weights[1])}`,W,'dimensionless');
  step(prefix+'chosen coefficient','λ = kbare W',`${n(q.bareCoefficientPerDay)} × ${n(W)}`,lambda,'day⁻¹');
  step(prefix+'oxygen-consumption bound','ΔO₂limit = min(O₂start,water budget,local exposed bound,local covered bound)',`min(${n(seg.oxygenStartMol)},${n(waterLimit)},${show(local[0])},${show(local[1])}); local bound=0.75 nFe,remaining W/wi`,delta,'mol O₂; calculated bound, not a future observation');
  if(Number.isFinite(eventTime))step(prefix+'calculated event delay','τevent = −ln(1−ΔO₂limit/O₂start)/λ',`−ln(1−${n(delta)}/${n(seg.oxygenStartMol)})/${n(lambda)}`,eventTime,'days from interval start');
  else blocks.push({title:prefix+'calculated event delay',formula:'Oxygen approaches zero asymptotically when no earlier finite inventory event occurs.',substitution:`ΔO₂limit=${n(delta)} mol; O₂start=${n(seg.oxygenStartMol)} mol`,result:'No finite exhaustion event from oxygen depletion alone.'});
  step(prefix+'elapsed interval','Δt = min(remaining observed days,calculated event delay)',`min(${n(q.timeDays-seg.startDay)},${Number.isFinite(eventTime)?n(eventTime):'no finite event'})`,seg.endDay-seg.startDay,`days; ${seg.event}`);
  step(prefix+'oxygen at interval end','O₂end = O₂start exp(−λ Δt)',`${n(seg.oxygenStartMol)} × exp(−${n(lambda)} × ${n(seg.endDay-seg.startDay)})`,seg.oxygenEndMol,'mol O₂; exhaustion-event inventory snapped exactly');
  const used=seg.oxygenUsedByZone[0]+seg.oxygenUsedByZone[1];
  step(prefix+'oxygen consumed','ΔO₂ = O₂start−O₂end',`${n(seg.oxygenStartMol)}−${n(seg.oxygenEndMol)}`,used,'mol O₂');
  step(prefix+'exposed-zone consumption','ΔO₂,e = ΔO₂ we,active/W',`${n(used)} × ${n(seg.weights[0])}/${n(W)}`,seg.oxygenUsedByZone[0],'mol O₂');
  step(prefix+'covered-zone consumption','ΔO₂,c = ΔO₂ wc,active/W',`${n(used)} × ${n(seg.weights[1])}/${n(W)}`,seg.oxygenUsedByZone[1],'mol O₂');
  previousUsed=[previousUsed[0]+seg.oxygenUsedByZone[0],previousUsed[1]+seg.oxygenUsedByZone[1]];
 });
 for(const [i,label] of ['Exposed','Covered'].entries()){
  const z=s.zones[i];
  step(`${label}-zone reacted iron`,'ξzone = ΣΔO₂,zone/0.75',`${n(z.oxygenUsedMol)}/0.75`,z.reactedIronMol,'mol Fe');
  step(`${label}-zone iron remaining`,'mFe,zone = (nFe,zone₀−ξzone)MFe',`(${n(z.initialIronMol)}−${n(z.reactedIronMol)}) × ${c.ironMolarG}`,z.ironLeftG,'g Fe; finite local inventory');
  step(`${label}-zone product`,'mproduct,zone = ξzone MFeOOH',`${n(z.reactedIronMol)} × ${c.productMolarG}`,z.productG,'g FeOOH equivalent');
 }
 step('Total reacted iron','ξ = ξexposed+ξcovered',`${n(s.zones[0].reactedIronMol)}+${n(s.zones[1].reactedIronMol)}`,s.reactedIronMol,'mol Fe');
 step('Total retained product','mproduct = mproduct,e+mproduct,c',`${n(s.zones[0].productG)}+${n(s.zones[1].productG)}`,s.productG,'g; all product retained attached');
 step('Oxygen remaining','nO₂ = nO₂₀−ΣΔO₂',`${n(s.initialOxygenMol)}−${n(s.oxygenUsedMol)}`,s.oxygenLeftMol,'mol O₂; stable interval exponential');
 step('Water remaining','mW = (nW₀−(2/3)ΣΔO₂)MW',`(${n(s.initialWaterMol)}−(2/3) × ${n(s.oxygenUsedMol)}) × ${c.waterMolarG}`,s.waterLeftG,'g; zero at shared-water exhaustion');
 step('Current metal volume','VFe = mFe/ρFe',`${n(s.ironLeftG)}/${c.ironDrawingDensityGml}`,s.metalVolumeMl,'mL');
 step('Current product volume','Vproduct = mproduct/ρproduct',`${n(s.productG)}/${c.productDrawingDensityGml}`,s.productVolumeMl,'mL; chosen drawing density');
 step('Current gas space','Vgas = Vcell−VFe−Vproduct−VW−Vfilm',`${n(q.chamberMl)}−${n(s.metalVolumeMl)}−${n(s.productVolumeMl)}−${n(s.waterLeftG/c.waterDrawingDensityGml)}−${n(s.coatingVolumeMl)}`,s.gasVolumeMl,'mL');
 step('Current dry-gas pressure','P = (nO₂+nN₂)RT/(Vgas/1000)',`(${n(s.oxygenLeftMol)}+${n(s.inertMol)}) × ${c.gasConstantLKPaMolK} × ${c.temperatureK}/(${n(s.gasVolumeMl)}/1000)`,s.pressureKPa,'kPa; no vapour/dissolved oxygen storage');
 step('Retained specimen including film','mspecimen = mFe+mproduct+mfilm',`${n(s.ironLeftG)}+${n(s.productG)}+${n(s.coatingG)}`,s.specimenG,'g');
 step('Whole-cell material mass','mtotal = mspecimen+mW+mO₂+mN₂',`${n(s.specimenG)}+${n(s.waterLeftG)}+${n(s.oxygenLeftMol*c.oxygenMolarG)}+${n(s.inertMol*c.inertMolarG)}`,s.totalG,'g; cell/wick/mask hardware excluded consistently');
 step('Initial whole-cell material mass','mtotal₀ = mFe₀+mW₀+mO₂₀+mN₂+mfilm',`${n(q.ironG)}+${n(q.waterMl)}+${n(s.initialOxygenMol*c.oxygenMolarG)}+${n(s.inertMol*c.inertMolarG)}+${n(s.coatingG)}`,s.initialTotalG,'g; equals current whole-cell material mass');
 step('Current chosen oxygen consumption rate','rO₂ = kbare (we,active+wc,active)nO₂',`${n(q.bareCoefficientPerDay)} × (${n(s.zones[0].activeWeight)}+${n(s.zones[1].activeWeight)}) × ${n(s.oxygenLeftMol)}`,s.currentOxygenRateMolDay,'mol O₂/day; not measured corrosion-rate calibration');
 return blocks;
}
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function coatingReport(raw:CoatingRecord){
 const r=validateCoatingRecord(raw),groups=[[0,1,2,3,4,5,6,7,8,9],[0,10,11,12,13,14,15,16,17],[0,18,19,20,21,22,23,24]];
 const tables=groups.map((cols,i)=>`<table><caption>${['Preparation and access references','Metal, product and reactants','Gas, mass and observations'][i]}</caption><thead><tr>${cols.map(j=>`<th>${esc(coatingHeaders[j])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,i)=>{const row=coatingTrialValues(t,i);return `<tr>${cols.map(j=>`<td>${esc(row[j])}</td>`).join('')}</tr>`}).join('')}</tbody></table>`).join('');
 return `<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0065 Coating comparison practical</title><style>body{font:15px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;margin:24px 0}th,td{border:1px solid #aaa;padding:7px;overflow-wrap:anywhere}p{white-space:pre-wrap;overflow-wrap:anywhere}li{break-inside:avoid;margin-bottom:12px}@page{size:A4 landscape;margin:14mm}@media print{body{max-width:none;margin:0}table{font-size:10px}thead{display:table-header-group}tr{break-inside:avoid}}</style><h1>Compare corrosion protection by coatings</h1><p>CL-0065 · VisionariesAI Labs Private Limited · Virtual practical</p><h2>Aim</h2><p>Compare matched bare, covered, exposed-strip and ideal-blocking references. Account for separate local iron inventories, finite oxygen/water and retained corrosion product.</p><h2>Principle and apparatus</h2><p>Chosen equivalent reaction:4Fe+3O₂+2H₂O→4FeOOH. Real rust is a mixture. Sealed reference cells, equal iron blocks, a prepared upper face with side/back access excluded, inert barrier film, available water through a schematic wick, elapsed-day timer and calculated dry-gas pressure. Relative transmission and bare coefficient are chosen comparison parameters.</p><h2>Procedure</h2><p>Write the prediction. Record preparation and film settings. Record all four starting conditions, then run and pause at equal elapsed days. Inspect exposed and covered metal/product separately; note any local iron or shared-water exhaustion. Compare a fully open strip, zero transmission, small damage, dry and no-oxygen references. Record masses, gas space and pressure with units. Apply the segment-wise formulas, check whole-cell mass and write result, conclusion and model limitations.</p><h2>Prediction</h2><p>${esc(r.prediction)}</p><h2>Observations</h2>${tables}<h2>Worked calculations</h2>${r.trials.map((t,i)=>`<h3>Trial ${i+1}: ${esc(coatingNames[t.kind])}</h3><ol>${coatingCalculations(t,t.kind).map(b=>`<li><b>${esc(b.title)}</b><p>${esc(b.formula)}</p><p>Substitution: ${esc(b.substitution)}</p><p>Result: ${esc(b.result)}</p></li>`).join('')}</ol>`).join('')}<h2>Result, conclusion and limitations</h2><p>${esc(r.conclusion)}</p><p>Generic barrier comparison, not a measured paint/oil/wax ranking, protection lifetime, galvanic mechanism or physical corrosion prediction. Fixed25°C idealO₂/N₂ gas, chosen parallel-zone kinetics, finite local iron/shared oxygen/water, retained FeOOH-equivalent product and uniform volume-based layers. Only the prepared upper face reacts. Film follows the covered reference top; no mechanical cracking/lifting/adhesion, pitting, under-film lateral transport, evolving coating, dissolved oxygen/vapour storage, sorption, wetting, heat or salt chemistry solver. Drawing densitiesFe8/product4.2/water1/film1.2g/mL and film thickness0.005cm are chosen references. Ideal blocking does not establish that real coatings are permanently impermeable. Quantitative formulas are teacher extensions; class placement editorial.</p></html>`;
}

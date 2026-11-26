import {checkAir,airState,airBoundaries,airBoundaryNames,airReference as c,type AirInputs,type AirBoundary} from './airExpansion';
import {airGeometry,airCrossSectionCm2} from './airExpansionGeometry';
import {rustNumber as n} from './rustConditionsRecord';
export interface AirTrial extends AirInputs {boundary:AirBoundary;observation:string}
export interface AirRecord {prediction:string;conclusion:string;trials:AirTrial[]}
export const airProgramNames={constant:'Hold selected jacket',return:'Return jacket at 120 s'};
const writing=(v:unknown)=>typeof v==='string'?v.slice(0,4000):'';
export function validateAirRecord(raw:unknown):AirRecord{
 const r=raw&&typeof raw==='object'?raw as Record<string,unknown>:{},trials:AirTrial[]=[];
 if(Array.isArray(r.trials))for(const value of r.trials){if(!value||typeof value!=='object')continue;const t=value as AirTrial;
  try{checkAir(t);if(!airBoundaries.includes(t.boundary))continue;trials.push({initialVolumeMl:t.initialVolumeMl,initialPressureKPa:t.initialPressureKPa,initialC:t.initialC,targetC:t.targetC,conductanceWK:t.conductanceWK,timeSeconds:t.timeSeconds,program:t.program,boundary:t.boundary,observation:writing(t.observation)})}catch{/* Recompute measurements from valid preparations only. */}
 }return {prediction:writing(r.prediction),conclusion:writing(r.conclusion),trials:trials.slice(-60)};
}
export const airHeaders=['Trial','Boundary','Jacket programme','Time s','Initial volume mL','Initial absolute pressure kPa','Initial gas °C','Selected jacket °C','Chosen conductance W/K','Gas °C','Gas K','Current jacket °C','Amount mol','Time constant s','Gas volume mL','Volume change mL','Absolute pressure kPa','Pressure change kPa','Net heat into gas J','Work by gas J','Internal-energy change J','Current heat flow W','Gas mass g','Gas density g/L','Gas-column height cm','Observation'];
export function airTrialValues(t:AirTrial,i:number){const s=airGeometry(t,t.boundary);return [String(i+1),airBoundaryNames[t.boundary],airProgramNames[t.program],...[t.timeSeconds,t.initialVolumeMl,t.initialPressureKPa,t.initialC,t.targetC,t.conductanceWK,s.gasC,s.gasK,s.bathC,s.amountMol,s.tauSeconds,s.volumeMl,s.volumeChangeMl,s.pressureKPa,s.pressureChangeKPa,s.heatJ,s.workJ,s.internalChangeJ,s.heatRateW,s.massG,s.densityGL,s.gasHeightCm].map(n),t.observation]}
export interface AirCalculation {title:string;formula:string;substitution:string;result:string}
export function airCalculations(q:AirInputs,boundary:AirBoundary){
 const s=airState(q,boundary),blocks:AirCalculation[]=[];
 const step=(title:string,formula:string,substitution:string,value:number,unit:string)=>blocks.push({title,formula,substitution,result:`${n(value)} ${unit}`});
 step('Initial absolute temperature','T₀ = θ₀+273.15',`${n(q.initialC)}+273.15`,s.initialK,'K');
 step('Selected jacket absolute temperature','Tj,target = θj,target+273.15',`${n(q.targetC)}+273.15`,s.targetK,'K');
 step('Closed gas amount','n = P₀(V₀/1000)/(RT₀)',`${n(q.initialPressureKPa)} × (${n(q.initialVolumeMl)}/1000)/(${c.R} × ${n(s.initialK)})`,s.amountMol,'mol; retained unchanged');
 step('Process molar heat capacity',boundary==='piston'?'Cp = 3.5R':'Cv = 2.5R',`${boundary==='piston'?3.5:2.5} × ${c.R}`,s.molarCapacity,'J/(mol K); chosen ideal-diatomic reference');
 step('Process thermal capacity','C = n Cprocess',`${n(s.amountMol)} × ${n(s.molarCapacity)}`,s.thermalCapacityJK,'J/K');
 step('Thermal time constant','τ = C/G',`${n(s.thermalCapacityJK)}/${n(q.conductanceWK)}`,s.tauSeconds,'s; G is chosen, not measured calibration');
 s.segments.forEach((seg,i)=>{
  const prefix=`Interval ${i+1} · `,dt=seg.endSeconds-seg.startSeconds;
  step(prefix+'elapsed duration','Δt = tend−tstart',`${n(seg.endSeconds)}−${n(seg.startSeconds)}`,dt,'s');
  step(prefix+'jacket temperature','Tj = prescribed jacket °C+273.15',`${n(seg.bathK-c.kelvinOffset)}+273.15`,seg.bathK,'K; externally thermostatted');
  step(prefix+'starting gas temperature','Tstart = preceding gas state',n(seg.gasStartK),seg.gasStartK,'K; continuous at jacket switch');
  step(prefix+'gas temperature change','ΔT = (Tj−Tstart)[1−exp(−Δt/τ)]',`(${n(seg.bathK)}−${n(seg.gasStartK)}) × [1−exp(−${n(dt)}/${n(s.tauSeconds)})]`,seg.deltaK,'K; signed heating/cooling');
  step(prefix+'ending gas temperature','Tend = Tstart+ΔT',`${n(seg.gasStartK)}+(${n(seg.deltaK)})`,seg.gasEndK,'K');
  step(prefix+'heat into gas','Qinterval = n Cprocess ΔT',`${n(s.amountMol)} × ${n(s.molarCapacity)} × (${n(seg.deltaK)})`,seg.heatJ,'J; negative when heat leaves');
  step(prefix+'work by gas',boundary==='piston'?'Winterval = nR ΔT':'Winterval = 0 at fixed volume',boundary==='piston'?`${n(s.amountMol)} × ${c.R} × (${n(seg.deltaK)})`:'Rigid boundary: ΔV=0',seg.workJ,'J; negative for compression');
  step(prefix+'internal-energy change','ΔUinterval = n Cv ΔT',`${n(s.amountMol)} × ${n(c.molarCv)} × (${n(seg.deltaK)})`,seg.internalChangeJ,'J');
 });
 step('Total gas temperature change','ΔTtotal = Tgas−T₀',`${n(s.gasK)}−${n(s.initialK)}`,s.deltaK,'K; stable exponential residual retained');
 step('Current gas absolute temperature','Tgas = T₀+ΔTtotal',`${n(s.initialK)}+(${n(s.deltaK)})`,s.gasK,'K');
 step('Current gas Celsius temperature','θgas = Tgas−273.15',`${n(s.gasK)}−273.15`,s.gasC,'°C');
 step('Current jacket temperature','θj = current prescribed jacket K−273.15',`${n(s.bathK)}−273.15`,s.bathC,'°C; not assumed equal to gas temperature');
 step('Volume change',boundary==='piston'?'ΔV = V₀ ΔTtotal/T₀':'ΔV = 0 at rigid boundary',boundary==='piston'?`${n(q.initialVolumeMl)} × (${n(s.deltaK)})/${n(s.initialK)}`:'Fixed initial volume',s.volumeChangeMl,'mL');
 step('Current gas volume','V = V₀+ΔV',`${n(q.initialVolumeMl)}+(${n(s.volumeChangeMl)})`,s.volumeMl,'mL');
 step('Absolute-pressure change',boundary==='rigid'?'ΔP = P₀ ΔTtotal/T₀':'ΔP = 0 for imposed constant pressure',boundary==='rigid'?`${n(q.initialPressureKPa)} × (${n(s.deltaK)})/${n(s.initialK)}`:'Frictionless quasistatic moving boundary',s.pressureChangeKPa,'kPa');
 step('Current absolute pressure','P = P₀+ΔP',`${n(q.initialPressureKPa)}+(${n(s.pressureChangeKPa)})`,s.pressureKPa,'kPa; absolute, not gauge pressure');
 step('Net heat into gas','Qnet = n Cprocess ΔTtotal',`${n(s.amountMol)} × ${n(s.molarCapacity)} × (${n(s.deltaK)})`,s.heatJ,'J; sum of signed interval heat');
 step('Net work by gas',boundary==='piston'?'Wnet = P₀ ΔV/1000':'Wnet = 0 at fixed volume',boundary==='piston'?`${n(q.initialPressureKPa)} × (${n(s.volumeChangeMl)})/1000`:'ΔV=0',s.workJ,'J; kPa mL/1000 converts to J');
 step('Net internal-energy change','ΔU = n Cv ΔTtotal',`${n(s.amountMol)} × ${n(c.molarCv)} × (${n(s.deltaK)})`,s.internalChangeJ,'J');
 step('Current heat-flow rate','Q̇ = G(Tj−Tgas)',`${n(q.conductanceWK)} × (${n(s.bathK)}−${n(s.gasK)})`,s.heatRateW,'W; sign changes immediately when jacket switches');
 step('Current gas-temperature rate','dT/dt = Q̇/(n Cprocess)',`${n(s.heatRateW)}/${n(s.thermalCapacityJK)}`,s.temperatureRateKs,'K/s');
 step('Closed gas mass','m = n M ×1000',`${n(s.amountMol)} × ${c.molarMassKg} ×1000`,s.massG,'g; chosen mean molar mass');
 step('Gas density','ρ = m/(V/1000)',`${n(s.massG)}/(${n(s.volumeMl)}/1000)`,s.densityGL,'g/L');
 step('Gas-column height','h = V/A128',`${n(s.volumeMl)}/${n(airCrossSectionCm2)}`,s.volumeMl/airCrossSectionCm2,'cm; actual polygonal area');
 step('Pressure-volume energy','PV = P(V/1000)',`${n(s.pressureKPa)} × (${n(s.volumeMl)}/1000)`,s.pressureVolumeJ,'J');
 step('Ideal-gas energy expression','nRT = n R Tgas',`${n(s.amountMol)} × ${c.R} × ${n(s.gasK)}`,s.idealGasJ,'J; equals PV');
 step('First-law check','Qnet−Wnet−ΔU',`${n(s.heatJ)}−(${n(s.workJ)})−(${n(s.internalChangeJ)})`,s.firstLawResidualJ,'J; floating-point residual near zero');
 step('Molecular rms speed reference','vrms = √(3RTgas/M)',`√(3 × ${c.R} × ${n(s.gasK)}/${c.molarMassKg})`,s.rmsSpeedMS,'m/s; not visible piston speed or bulk flow');
 return blocks;
}
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function airReport(raw:AirRecord){const r=validateAirRecord(raw),groups=[[0,1,2,3,4,5,6,7,8],[0,9,10,11,12,13,14,15,16,17],[0,18,19,20,21,22,23,24,25]];
 const tables=groups.map((cols,i)=>`<table><caption>${['Preparation and boundary conditions','Temperature, amount, volume and pressure','Signed energy, retained mass and observations'][i]}</caption><thead><tr>${cols.map(j=>`<th>${esc(airHeaders[j])}</th>`).join('')}</tr></thead><tbody>${r.trials.map((t,i)=>{const row=airTrialValues(t,i);return `<tr>${cols.map(j=>`<td>${esc(row[j])}</td>`).join('')}</tr>`}).join('')}</tbody></table>`).join('');
 return `<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0066 Air expansion practical</title><style>body{font:15px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;margin:24px 0}th,td{border:1px solid #aaa;padding:7px;overflow-wrap:anywhere}p{white-space:pre-wrap;overflow-wrap:anywhere}li{break-inside:avoid;margin-bottom:12px}@page{size:A4 landscape;margin:14mm}@media print{body{max-width:none;margin:0}table{font-size:10px}thead{display:table-header-group}tr{break-inside:avoid}}</style><h1>Compare expansion of air on warming</h1><p>CL-0066 · VisionariesAI Labs Private Limited · Virtual practical</p><h2>Aim</h2><p>Compare matched closed-air references with a free moving boundary and a rigid fixed volume. Observe warming and cooling; distinguish gas and jacket temperature, volume and absolute pressure.</p><h2>Principle and apparatus</h2><p>Idealized diatomic-air reference:PV=nRT with temperature in kelvin and pressure absolute. Frictionless quasistatic piston, rigid-volume comparison, thermostatted annular jackets, volume scale, calculated thermometers and absolute-pressure gauge. The chosen common conductance gives different process time constants because Cp=3.5R and Cv=2.5R.</p><h2>Procedure</h2><p>Record initial volume, absolute pressure, gas temperature, jacket target and chosen conductance. Predict the two boundary responses. Record both starting states, then run and pause at matched elapsed times. Compare heating, cooling, equal-temperature and return-jacket programmes. At120s in the return programme the jacket changes, while gas temperature remains continuous. Record gas temperature, volume, pressure, heat, work and retained mass. Apply substitutions with units, use kelvin ratios, checkPV=nRT andQ−W=ΔU, then write result and limitations.</p><h2>Prediction</h2><p>${esc(r.prediction)}</p><h2>Observations</h2>${tables}<h2>Formula substitutions and worked results</h2>${r.trials.map((t,i)=>`<h3>Trial ${i+1}: ${esc(airBoundaryNames[t.boundary])}</h3><ol>${airCalculations(t,t.boundary).map(b=>`<li><b>${esc(b.title)}</b><p>${esc(b.formula)}</p><p>Substitution: ${esc(b.substitution)}</p><p>Result: ${esc(b.result)}</p></li>`).join('')}</ol>`).join('')}<h2>Result, conclusion and limitations</h2><p>${esc(r.conclusion)}</p><p>Closed idealized dry diatomic air, fixed reference heat capacities and mean molar mass, uniform gas temperature, chosen lumped conductance and externally prescribed jacket. Moving boundary is frictionless and quasistatic; no piston inertia/friction/leaks, real-gas corrections, humidity, evaporation, spatial temperature fields, jacket/hardware thermal storage or measured apparatus calibration. Jacket stays below the piston face; no varying water-head load. Rod/probe volumes do not intrude into gas. Air colour, if displayed, is an explanatory overlay. Finite return cooling approaches the initial state rather than snapping to it. This virtual model is not pressure-vessel certification or a physical sealed-container heating procedure. Class placement is editorial; quantitative energy calculations are teacher extensions.</p></html>`;
}

/** CL-0066. Closed ideal-diatomic-air references with lumped jacket heating.
 * Moving boundary is frictionless/quasistatic; no measured syringe dynamics.
 */
export type AirBoundary='piston'|'rigid';
export type AirProgram='constant'|'return';
export interface AirInputs {initialVolumeMl:number;initialPressureKPa:number;initialC:number;targetC:number;conductanceWK:number;timeSeconds:number;program:AirProgram}
export const airBoundaries:AirBoundary[]=['piston','rigid'];
export const airBoundaryNames:Record<AirBoundary,string>={piston:'Free-piston reference',rigid:'Rigid-volume comparison'};
export const airReference={R:8.314462618,molarCv:2.5*8.314462618,molarCp:3.5*8.314462618,molarMassKg:.02897,kelvinOffset:273.15,returnSeconds:120};
export const defaultAirInputs:AirInputs={initialVolumeMl:50,initialPressureKPa:101.325,initialC:25,targetC:65,conductanceWK:.002,timeSeconds:0,program:'constant'};
export function checkAir(q:AirInputs){
 if(!q||![q.initialVolumeMl,q.initialPressureKPa,q.initialC,q.targetC,q.conductanceWK,q.timeSeconds].every(Number.isFinite)
 ||q.initialVolumeMl<20||q.initialVolumeMl>60||q.initialPressureKPa<80||q.initialPressureKPa>120||q.initialC<15||q.initialC>35||q.targetC<5||q.targetC>85
 ||q.conductanceWK<.0005||q.conductanceWK>.005||q.timeSeconds<0||q.timeSeconds>300||!['constant','return'].includes(q.program))
 throw new RangeError('Volume20–60mL,absolute pressure80–120kPa,initial15–35°C,jacket5–85°C,conductance0.0005–0.005W/K,time0–300s and supported program required');
}
export interface AirSegment {startSeconds:number;endSeconds:number;bathK:number;gasStartK:number;gasEndK:number;deltaK:number;heatJ:number;workJ:number;internalChangeJ:number}
export function airState(q:AirInputs=defaultAirInputs,boundary:AirBoundary='piston'){
 checkAir(q);if(!airBoundaries.includes(boundary))throw new RangeError('A supported gas boundary is required');
 const c=airReference,initialK=q.initialC+c.kelvinOffset,targetK=q.targetC+c.kelvinOffset;
 const amountMol=q.initialPressureKPa*(q.initialVolumeMl/1000)/(c.R*initialK);
 const molarCapacity=boundary==='piston'?c.molarCp:c.molarCv,thermalCapacityJK=amountMol*molarCapacity,tauSeconds=thermalCapacityJK/q.conductanceWK;
 const firstDuration=q.program==='return'?Math.min(q.timeSeconds,c.returnSeconds):q.timeSeconds;
 const firstDeltaK=(q.targetC-q.initialC)*(-Math.expm1(-firstDuration/tauSeconds));
 const returnDuration=q.program==='return'?Math.max(0,q.timeSeconds-c.returnSeconds):0;
 const deltaK=returnDuration>0?firstDeltaK*Math.exp(-returnDuration/tauSeconds):firstDeltaK;
 const gasK=initialK+deltaK,bathK=q.program==='return'&&q.timeSeconds>=c.returnSeconds?initialK:targetK;
 const heatRateW=q.conductanceWK*(bathK-gasK),temperatureRateKs=heatRateW/thermalCapacityJK;
 const volumeChangeMl=boundary==='piston'?q.initialVolumeMl*deltaK/initialK:0;
 const volumeMl=q.initialVolumeMl+volumeChangeMl;
 const pressureChangeKPa=boundary==='rigid'?q.initialPressureKPa*deltaK/initialK:0;
 const pressureKPa=q.initialPressureKPa+pressureChangeKPa;
 const internalChangeJ=amountMol*c.molarCv*deltaK,workJ=boundary==='piston'?amountMol*c.R*deltaK:0,heatJ=amountMol*molarCapacity*deltaK;
 const segments:AirSegment[]=[];
 const segment=(startSeconds:number,endSeconds:number,bath:number,startK:number,endK:number,change:number)=>segments.push({startSeconds,endSeconds,bathK:bath,gasStartK:startK,gasEndK:endK,deltaK:change,heatJ:amountMol*molarCapacity*change,workJ:boundary==='piston'?amountMol*c.R*change:0,internalChangeJ:amountMol*c.molarCv*change});
 if(firstDuration>0)segment(0,firstDuration,targetK,initialK,initialK+firstDeltaK,firstDeltaK);
 if(returnDuration>0)segment(c.returnSeconds,q.timeSeconds,initialK,initialK+firstDeltaK,gasK,firstDeltaK*Math.expm1(-returnDuration/tauSeconds));
 const massG=amountMol*c.molarMassKg*1000;
 return {...q,boundary,initialK,targetK,amountMol,molarCapacity,thermalCapacityJK,tauSeconds,firstDuration,returnDuration,firstDeltaK,deltaK,gasK,gasC:gasK-c.kelvinOffset,bathK,bathC:bathK-c.kelvinOffset,
  volumeMl,volumeChangeMl,pressureKPa,pressureChangeKPa,internalChangeJ,workJ,heatJ,heatRateW,temperatureRateKs,
  volumeRateMlS:boundary==='piston'?q.initialVolumeMl/initialK*temperatureRateKs:0,
  pressureRateKPaS:boundary==='rigid'?q.initialPressureKPa/initialK*temperatureRateKs:0,
  massG,densityGL:massG/(volumeMl/1000),rmsSpeedMS:Math.sqrt(3*c.R*gasK/c.molarMassKg),
  pressureVolumeJ:pressureKPa*volumeMl/1000,idealGasJ:amountMol*c.R*gasK,
  firstLawResidualJ:heatJ-workJ-internalChangeJ,segments,
  observation:deltaK>0?(boundary==='piston'?'Gas is warmer than initially: volume increases at fixed absolute pressure.':'Gas is warmer than initially: absolute pressure increases at fixed volume.'):deltaK<0?(boundary==='piston'?'Gas is cooler than initially: volume decreases at fixed absolute pressure.':'Gas is cooler than initially: absolute pressure decreases at fixed volume.'):'Gas remains at its initial temperature and state.'};
}
export const airComparison=(q:AirInputs)=>airBoundaries.map(b=>airState(q,b));
export function airHistory(q:AirInputs,boundary:AirBoundary){checkAir(q);return Array.from({length:61},(_,i)=>airState({...q,timeSeconds:q.timeSeconds*i/60},boundary))}
export function airGuide(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('Finite presentation time required');
 const t=Math.max(0,Math.min(120,seconds)),timeSeconds=Math.max(0,Math.min(240,(t-10)*2.4));
 const caption=t<10?'Trap equal dry-air reference samples. One boundary moves freely; the other holds volume fixed.':t<35?'A warmer jacket transfers energy to the gas. The free piston rises while its imposed absolute pressure stays fixed.':t<60?'Compare the rigid reference: its volume stays fixed and pressure rises. With the same chosen conductance, the heat capacities give different warming times.':t<85?'The jacket returns to its initial temperature. Heat flows out; the piston descends and the rigid pressure falls.':t<110?'Use gas temperature in kelvin, rather than jacket temperature or Celsius ratios. Track signed heat, work and internal-energy changes.':'Record equal elapsed times and compare the two boundary conditions. A finite cooling interval approaches the starting state; it need not return exactly.';
 return {timeSeconds,caption,samples:airComparison({...defaultAirInputs,program:'return',timeSeconds})};
}

/** CL-0121: ideal Faradaic accounting under a prescribed regulated DC current.
 * Dry-equivalent gas volumes, common specified T/P, unity current efficiency.
 * No voltage/conductivity, vapour, hydrostatic, crossover or kinetic solver. */
export const electrolysisConstants = {
  avogadroMolInv: 6.02214076e23, elementaryChargeC: 1.602176634e-19,
  boltzmannJK: 1.380649e-23,
  faradayCMol: 6.02214076e23 * 1.602176634e-19,
  gasConstantJMolK: 6.02214076e23 * 1.380649e-23,
};
export interface ElectrolysisSegment { currentA:number; durationS:number; connected:boolean }
export interface ElectrolysisInputs {
  history:ElectrolysisSegment[]; currentA:number; connected:boolean;
  temperatureC:number; pressureKPa:number; capacityMl:number;
}
export const defaultElectrolysis:ElectrolysisInputs={history:[],currentA:.5,connected:true,temperatureC:25,pressureKPa:101.325,capacityMl:50};
const number=(x:unknown,lo:number,hi:number,name:string)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<lo||x>hi)throw new RangeError(`Invalid ${name}`);return x};
export function validateElectrolysis(raw:unknown):ElectrolysisInputs {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Electrolysis inputs required');
 const r=raw as ElectrolysisInputs;
 if(!Array.isArray(r.history)||r.history.length>40)throw new RangeError('At most40source-history segments');
 if(typeof r.connected!=='boolean')throw new TypeError('Source connection required');
 const history=r.history.map(x=>{if(!x||typeof x!=='object'||Array.isArray(x)||typeof x.connected!=='boolean')throw new TypeError('Explicit source segment required');return{currentA:number(x.currentA,0,1,'segment current'),durationS:number(x.durationS,0,1800,'segment duration'),connected:x.connected}});
 return{history,currentA:number(r.currentA,0,1,'current'),connected:r.connected,temperatureC:number(r.temperatureC,15,35,'temperature'),pressureKPa:number(r.pressureKPa,90,110,'pressure'),capacityMl:number(r.capacityMl,10,100,'tube capacity')};
}
export function electrolysisState(raw:unknown){
 const q=validateElectrolysis(raw),c=electrolysisConstants;
 const elapsedS=q.history.reduce((s,r)=>s+r.durationS,0),chargeC=q.history.reduce((s,r)=>s+(r.connected?r.currentA*r.durationS:0),0);
 const electronMoles=chargeC/c.faradayCMol,hydrogenMol=electronMoles/2,oxygenMol=electronMoles/4,waterConsumedMol=hydrogenMol,temperatureK=q.temperatureC+273.15,pressurePa=q.pressureKPa*1000;
 const volume=(mol:number)=>mol*c.gasConstantJMolK*temperatureK/pressurePa*1e6;
 const hydrogenGeneratedMl=volume(hydrogenMol),oxygenGeneratedMl=volume(oxygenMol),hydrogenRetainedMl=Math.min(q.capacityMl,hydrogenGeneratedMl),oxygenRetainedMl=Math.min(q.capacityMl,oxygenGeneratedMl);
 return{inputs:q,elapsedS,chargeC,electronMoles,hydrogenMol,oxygenMol,waterConsumedMol,temperatureK,pressurePa,
  hydrogenGeneratedMl,oxygenGeneratedMl,hydrogenRetainedMl,oxygenRetainedMl,
  hydrogenOverflowMl:Math.max(0,hydrogenGeneratedMl-q.capacityMl),oxygenOverflowMl:Math.max(0,oxygenGeneratedMl-q.capacityMl),
  generatedVolumeRatio:oxygenGeneratedMl>0?hydrogenGeneratedMl/oxygenGeneratedMl:null,
  retainedVolumeRatio:oxygenRetainedMl>0?hydrogenRetainedMl/oxygenRetainedMl:null,
  hydrogenFillFraction:hydrogenRetainedMl/q.capacityMl,oxygenFillFraction:oxygenRetainedMl/q.capacityMl,
  activeCurrentA:q.connected?q.currentA:0,
  cathode:'negative · hydrogen · reduction',anode:'positive · oxygen · oxidation',
  scope:'Unity Faradaic efficiency; sufficient acidified water and inert non-chloride supporting electrolyte. Regulated current is supplied, not predicted. Volumes are dry-equivalent at common stated T/P; finite tube retention/overflow is bookkeeping, not wet-gas meniscus or pressure dynamics. No real gases generated.',
 };
}
/** Append elapsed physical time without retroactively changing earlier charge.
 * Merge only identical source conditions, preserving each changed-current segment. */
export function advanceElectrolysis(raw:unknown,seconds:number):ElectrolysisInputs {
 const q=validateElectrolysis(raw);number(seconds,0,1800,'advance duration');if(seconds===0)return q;
 const history=q.history.map(r=>({...r})),last=history.at(-1);
 if(last&&last.currentA===q.currentA&&last.connected===q.connected&&last.durationS+seconds<=1800)last.durationS+=seconds;
 else{if(history.length>=40)throw new RangeError('History full; reset before another source segment');history.push({currentA:q.currentA,durationS:seconds,connected:q.connected})}
 return validateElectrolysis({...q,history});
}
export function electrolysisGuide(seconds:number,base:ElectrolysisInputs){
 number(seconds,0,150,'guide time');const q=validateElectrolysis(base);
 const physicalElapsedS=seconds<=20?0:seconds<110?(seconds-20)*600/90:600;
 const stage=seconds<20?0:seconds<45?1:seconds<80?2:seconds<110?3:seconds<140?4:5;
 // Each guide is a fresh600sreference run; it never silently adds old charge.
 const inputs={...q,history:physicalElapsedS>0?[{currentA:q.currentA,durationS:physicalElapsedS,connected:q.connected}]:[],connected:seconds>20&&seconds<110?q.connected:false};
 return{seconds,stage,physicalElapsedS,inputs,recordable:seconds>=140,title:['Predict the products','Start charge transfer','Collect separate gases','Compare generated volumes','Pause and calculate','Record the conclusion'][stage]};
}

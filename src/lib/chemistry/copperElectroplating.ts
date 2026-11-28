/** Ideal Cu/Cu2+ soluble-anode plating at a rounded20°C density reference.
 * Prescribed regulated current, unity efficiency, uniform single exposed face.
 * Automatic ideal cutoff at finite anode depletion; no side-reaction/voltage solver. */
export const copperConstants={molarMassGMol:63.546,densityGCm3:8.96,faradayCMol:6.02214076e23*1.602176634e-19};
export interface PlatingSegment{currentA:number;durationS:number;connected:boolean}
export interface PlatingInputs{history:PlatingSegment[];currentA:number;connected:boolean;anodeInitialG:number;cathodeInitialG:number;widthCm:number;heightCm:number}
export const defaultPlating:PlatingInputs={history:[],currentA:.5,connected:true,anodeInitialG:1,cathodeInitialG:10,widthCm:2,heightCm:3};
const bounded=(x:unknown,lo:number,hi:number,name:string)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<lo||x>hi)throw new RangeError(`Invalid ${name}`);return x};
export function validatePlating(raw:unknown):PlatingInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Copper plating inputs required');const q=raw as PlatingInputs;
 if(typeof q.connected!=='boolean'||!Array.isArray(q.history)||q.history.length>40)throw new TypeError('Explicit source connection and at most40history segments required');
 const history=q.history.map(r=>{if(!r||typeof r!=='object'||typeof r.connected!=='boolean')throw new TypeError('Source-history segment required');return{currentA:bounded(r.currentA,0,1,'segment current'),durationS:bounded(r.durationS,0,1800,'segment duration'),connected:r.connected}});
 return{history,currentA:bounded(q.currentA,0,1,'current'),connected:q.connected,anodeInitialG:bounded(q.anodeInitialG,.02,2,'anode mass'),cathodeInitialG:bounded(q.cathodeInitialG,5,30,'cathode mass'),widthCm:bounded(q.widthCm,.5,4,'exposed width'),heightCm:bounded(q.heightCm,1,5,'exposed height')};
}
export function platingState(raw:unknown){
 const q=validatePlating(raw),c=copperConstants,chargeLimitC=q.anodeInitialG/c.molarMassGMol*2*c.faradayCMol;
 let elapsedS=0,requestedChargeC=0,passedChargeC=0,energizedS=0;
 const segments=q.history.map((r,index)=>{
  const requestC=r.connected?r.currentA*r.durationS:0,remainingC=Math.max(0,chargeLimitC-passedChargeC),deliveredC=Math.min(remainingC,requestC),activeS=r.currentA>0?deliveredC/r.currentA:0;
  const out={index,...r,requestC,deliveredC,unmetDemandC:Math.max(0,requestC-deliveredC),activeS,startS:elapsedS,endS:elapsedS+r.durationS};
  elapsedS+=r.durationS;requestedChargeC+=requestC;passedChargeC=requestC>=remainingC?chargeLimitC:passedChargeC+deliveredC;energizedS+=activeS;return out;
 });
 const depleted=passedChargeC>=chargeLimitC,depositMassG=depleted?q.anodeInitialG:passedChargeC/(2*c.faradayCMol)*c.molarMassGMol,anodeFinalG=depleted?0:q.anodeInitialG-depositMassG,cathodeFinalG=q.cathodeInitialG+depositMassG;
 const areaCm2=q.widthCm*q.heightCm,areaM2=areaCm2/10000,depositVolumeCm3=depositMassG/c.densityGCm3,thicknessCm=depositVolumeCm3/areaCm2,thicknessM=thicknessCm/100,thicknessMicrometre=thicknessCm*10000;
 return{inputs:q,segments,elapsedS,requestedChargeC,passedChargeC,chargeLimitC,unmetChargeDemandC:Math.max(0,requestedChargeC-passedChargeC),energizedS,
  electronMol:passedChargeC/c.faradayCMol,copperMol:depositMassG/c.molarMassGMol,depositMassG,depositMassMg:depositMassG*1000,anodeLossG:depositMassG,anodeFinalG,cathodeGainG:depositMassG,cathodeFinalG,areaCm2,areaM2,depositVolumeCm3,thicknessCm,thicknessM,thicknessMicrometre,
  initialElectrodeMassG:q.anodeInitialG+q.cathodeInitialG,finalElectrodeMassG:anodeFinalG+cathodeFinalG,
  massAccountResidualG:anodeFinalG+cathodeFinalG-(q.anodeInitialG+q.cathodeInitialG),bathNetCopperChangeMol:0,
  depleted,activeCurrentA:q.connected&&!depleted?q.currentA:0,
  currentDensityAm2:q.connected&&!depleted?q.currentA/areaM2:0,
  scope:'Ideal copper(II) electrolyte with soluble copper anode and adequate well-mixed bath; unity efficiency, masked single exposed cathode face and uniform dense copper film. Automatic open-circuit cutoff at finite anode exhaustion; unmet requested coulomb budget is not passed charge. No conductivity, voltage, concentration gradient, roughness, porosity, adhesion, side-reaction or transport-rate solver. Rounded copper references, not precision material certification.',
 };
}
export function advancePlating(raw:unknown,seconds:number):PlatingInputs{
 const q=validatePlating(raw);bounded(seconds,0,1800,'advance duration');if(seconds===0)return q;const history=q.history.map(r=>({...r})),last=history.at(-1);
 if(last&&last.currentA===q.currentA&&last.connected===q.connected&&last.durationS+seconds<=1800)last.durationS+=seconds;
 else{if(history.length>=40)throw new RangeError('History full; reset before another source interval');history.push({currentA:q.currentA,durationS:seconds,connected:q.connected})}
 return validatePlating({...q,history});
}
export function platingGuide(seconds:number,base:PlatingInputs){
 bounded(seconds,0,150,'guide time');const q=validatePlating(base),physicalElapsedS=seconds<=45?0:seconds<115?(seconds-45)*600/70:600,stage=seconds<20?0:seconds<45?1:seconds<75?2:seconds<115?3:seconds<140?4:5;
 const inputs={...q,history:physicalElapsedS>0?[{currentA:q.currentA,durationS:physicalElapsedS,connected:q.connected}]:[],connected:seconds>45&&seconds<115?q.connected:false};
 return{seconds,stage,physicalElapsedS,inputs,recordable:seconds>=140,title:['Predict electrode changes','Read initial masses','Follow copper transfer','Inspect the coating cross-section','Disconnect and weigh','Record the result'][stage]};
}

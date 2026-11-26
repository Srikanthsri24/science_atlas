/** CL-0065. Two finite iron zones share a mixed finite oxygen inventory.
 * Chosen relative coating transmission is not measured permeability, paint
 * lifetime, galvanic protection or a pitting/under-film transport solver.
 */
import {rustReference as c} from './rustConditions';
export type CoatingCase='bare'|'intact'|'scratched'|'ideal';
export interface CoatingInputs {
 ironG:number;waterMl:number;chamberMl:number;oxygenFraction:number;
 bareCoefficientPerDay:number;relativeTransmission:number;exposedFraction:number;timeDays:number;
}
export const coatingCases:CoatingCase[]=['bare','intact','scratched','ideal'];
export const coatingNames:Record<CoatingCase,string>={bare:'Bare reference',intact:'Intact barrier',scratched:'Barrier with exposed strip',ideal:'Ideal blocking reference'};
export const defaultCoatingInputs:CoatingInputs={ironG:.15,waterMl:2,chamberMl:50,oxygenFraction:.21,bareCoefficientPerDay:.4,relativeTransmission:.02,exposedFraction:.05,timeDays:0};
export const coatingReference={...c,faceWidthCm:.5,faceDepthCm:.5,filmThicknessCm:.005,filmDrawingDensityGml:1.2};
export function checkCoating(q:CoatingInputs){
 if(!q||![q.ironG,q.waterMl,q.chamberMl,q.oxygenFraction,q.bareCoefficientPerDay,q.relativeTransmission,q.exposedFraction,q.timeDays].every(Number.isFinite)
 ||q.ironG<.1||q.ironG>.3||q.waterMl<0||q.waterMl>2||q.chamberMl<25||q.chamberMl>75||q.oxygenFraction<0||q.oxygenFraction>.3
 ||q.bareCoefficientPerDay<.1||q.bareCoefficientPerDay>1.2||q.relativeTransmission<0||q.relativeTransmission>1
 ||q.exposedFraction<0||q.exposedFraction>1||q.timeDays<0||q.timeDays>30)
 throw new RangeError('Iron0.1–0.3g,water0–2mL,cell25–75mL,oxygen0–0.3,barecoefficient0.1–1.2/day,transmission/exposedfraction0–1,time0–30days required');
}
export interface CoatingSegment {startDay:number;endDay:number;oxygenStartMol:number;oxygenEndMol:number;weights:[number,number];oxygenUsedByZone:[number,number];event:'elapsed'|'exposed exhausted'|'covered exhausted'|'both zones exhausted'|'water exhausted'}
export function coatingState(q:CoatingInputs=defaultCoatingInputs,kind:CoatingCase='scratched'){
 checkCoating(q);if(!coatingCases.includes(kind))throw new RangeError('A supported coating case is required');
 const exposed=kind==='bare'?1:kind==='scratched'?q.exposedFraction:0;
 const transmission=kind==='ideal'?0:q.relativeTransmission;
 const area=coatingReference.faceWidthCm*coatingReference.faceDepthCm;
 const coatingVolumeMl=(1-exposed)*area*coatingReference.filmThicknessCm;
 const coatingG=coatingVolumeMl*coatingReference.filmDrawingDensityGml;
 const initialIronMol=q.ironG/c.ironMolarG,initialWaterMol=q.waterMl/c.waterMolarG;
 const initialGasVolumeMl=q.chamberMl-q.ironG/c.ironDrawingDensityGml-q.waterMl-coatingVolumeMl;
 const initialGasMol=c.initialPressureKPa*(initialGasVolumeMl/1000)/(c.gasConstantLKPaMolK*c.temperatureK);
 const initialOxygenMol=q.oxygenFraction*initialGasMol,inertMol=(1-q.oxygenFraction)*initialGasMol;
 const initialZoneIronMol:[number,number]=[initialIronMol*exposed,initialIronMol*(1-exposed)];
 const capacity:[number,number]=initialZoneIronMol.map(n=>n*.75) as [number,number];
 const weights:[number,number]=[exposed,(1-exposed)*transmission];
 const used:[number,number]=[0,0],segments:CoatingSegment[]=[];
 const waterOxygenBudget=initialWaterMol*1.5;
 let oxygen=initialOxygenMol,elapsed=0,waterExhausted=waterOxygenBudget===0;
 // At most two local exhaustion events and one shared-water event. Within a
 // segment, dO2/dt=-k(sum active area weights)O2 has an exact solution.
 for(let stage=0;stage<4&&elapsed<q.timeDays&&!waterExhausted;stage++){
  const active:[number,number]=[used[0]<capacity[0]?weights[0]:0,used[1]<capacity[1]?weights[1]:0];
  const sum=active[0]+active[1];if(sum===0||oxygen===0)break;
  const remainingWaterBudget=Math.max(0,waterOxygenBudget-used[0]-used[1]);if(remainingWaterBudget===0){waterExhausted=true;break}
  const local=active.map((w,i)=>w>0?Math.max(0,capacity[i]-used[i])*sum/w:Infinity);
  const delta=Math.min(oxygen,remainingWaterBudget,...local);
  const coefficient=q.bareCoefficientPerDay*sum;
  const eventTime=delta<oxygen?-Math.log1p(-delta/oxygen)/coefficient:Infinity;
  const duration=Math.min(q.timeDays-elapsed,eventTime),eventReached=eventTime<=q.timeDays-elapsed;
  const oxygenStartMol=oxygen;
  const consumed=eventReached?delta:oxygen*(-Math.expm1(-coefficient*duration));
  const byZone:[number,number]=[consumed*active[0]/sum,consumed*active[1]/sum];
  for(let i=0;i<2;i++){
   used[i]+=byZone[i];
   if(eventReached&&local[i]===delta){byZone[i]+=capacity[i]-used[i];used[i]=capacity[i]}
  }
  oxygen=eventReached?Math.max(0,oxygen-delta):oxygen*Math.exp(-coefficient*duration);
  const startDay=elapsed;elapsed+=duration;
  if(eventReached&&remainingWaterBudget===delta)waterExhausted=true;
  const hitExposed=eventReached&&local[0]===delta,hitCovered=eventReached&&local[1]===delta;
  const event:CoatingSegment['event']=waterExhausted?'water exhausted':hitExposed&&hitCovered?'both zones exhausted':hitExposed?'exposed exhausted':hitCovered?'covered exhausted':'elapsed';
  segments.push({startDay,endDay:elapsed,oxygenStartMol,oxygenEndMol:oxygen,weights:active,oxygenUsedByZone:byZone,event});
  if(!eventReached)break;
 }
 const oxygenUsedMol=used[0]+used[1],reactedIronMol=oxygenUsedMol/.75;
 const zones=initialZoneIronMol.map((n,i)=>{
  const fraction=i===0?exposed:1-exposed,reactedMol=used[i]/.75;
  const ironLeftMol=Math.max(0,capacity[i]-used[i])/.75;
  const ironLeftG=ironLeftMol*c.ironMolarG,productG=reactedMol*c.productMolarG;
  return {kind:i===0?'exposed':'covered',fraction,initialIronMol:n,ironLeftMol,reactedIronMol:reactedMol,ironLeftG,productG,
   oxygenUsedMol:used[i],metalVolumeMl:ironLeftG/c.ironDrawingDensityGml,productVolumeMl:productG/c.productDrawingDensityGml,
   areaCm2:area*fraction,activeWeight:!waterExhausted&&used[i]<capacity[i]?weights[i]:0};
 });
 const ironLeftMol=zones[0].ironLeftMol+zones[1].ironLeftMol,ironLeftG=ironLeftMol*c.ironMolarG;
 const productG=reactedIronMol*c.productMolarG,waterUsedMol=oxygenUsedMol*2/3;
 const waterLeftMol=waterExhausted?0:Math.max(0,waterOxygenBudget-oxygenUsedMol)/1.5;
 const waterLeftG=waterLeftMol*c.waterMolarG,oxygenLeftMol=oxygen;
 const metalVolumeMl=ironLeftG/c.ironDrawingDensityGml,productVolumeMl=productG/c.productDrawingDensityGml;
 const gasVolumeMl=q.chamberMl-metalVolumeMl-productVolumeMl-waterLeftG/c.waterDrawingDensityGml-coatingVolumeMl;
 const pressureKPa=(oxygenLeftMol+inertMol)*c.gasConstantLKPaMolK*c.temperatureK/(gasVolumeMl/1000);
 const specimenG=ironLeftG+productG+coatingG;
 const initialTotalG=q.ironG+q.waterMl+initialOxygenMol*c.oxygenMolarG+inertMol*c.inertMolarG+coatingG;
 const totalG=specimenG+waterLeftG+oxygenLeftMol*c.oxygenMolarG+inertMol*c.inertMolarG;
 const currentOxygenRateMolDay=q.bareCoefficientPerDay*(zones[0].activeWeight+zones[1].activeWeight)*oxygenLeftMol;
 return {...q,kind,exposed,transmission,coatingVolumeMl,coatingG,initialIronMol,initialWaterMol,initialGasVolumeMl,initialGasMol,initialOxygenMol,inertMol,
  initialZoneIronMol,weights,zones,segments,waterExhausted,oxygenUsedMol,reactedIronMol,ironLeftMol,ironLeftG,productG,waterUsedMol,waterLeftMol,waterLeftG,
  oxygenLeftMol,metalVolumeMl,productVolumeMl,gasVolumeMl,pressureKPa,specimenG,initialTotalG,totalG,currentOxygenRateMolDay,
  oxygenConsumedFraction:initialOxygenMol>0?oxygenUsedMol/initialOxygenMol:0,
  initialIronAtomsMol:initialIronMol,currentIronAtomsMol:ironLeftMol+reactedIronMol,
  initialOxygenAtomsMol:2*initialOxygenMol+initialWaterMol,currentOxygenAtomsMol:2*oxygenLeftMol+waterLeftMol+2*reactedIronMol,
  initialHydrogenAtomsMol:2*initialWaterMol,currentHydrogenAtomsMol:2*waterLeftMol+reactedIronMol};
}
export const coatingComparison=(q:CoatingInputs)=>coatingCases.map(kind=>coatingState(q,kind));
export function coatingHistory(q:CoatingInputs,kind:CoatingCase){checkCoating(q);return Array.from({length:61},(_,i)=>coatingState({...q,timeDays:q.timeDays*i/60},kind))}
export function coatingGuide(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('Finite guide time required');
 const t=Math.max(0,Math.min(120,seconds)),timeDays=Math.max(0,Math.min(30,(t-10)/100*30));
 const caption=t<10?'Prepare equal iron samples. Compare bare, covered, exposed-strip and ideal blocking references.':t<35?'Follow oxygen access. The chosen covered-zone transmission is smaller, rather than universally zero.':t<65?'Inspect the exposed strip separately. Its finite local iron inventory can be exhausted while covered iron remains.':t<95?'Track metal, reference product and oxygen. The barrier changes the chosen rate; it does not create or destroy material.':t<110?'Compare matched elapsed days and inspect the coating assumptions. These generic references do not rank real paints or solve galvanic protection.':'Record observations, apply substitutions and conclude from this comparison. Real coating performance also depends on preparation, damage, moisture and environment.';
 return {timeDays,caption,samples:coatingComparison({...defaultCoatingInputs,timeDays})};
}

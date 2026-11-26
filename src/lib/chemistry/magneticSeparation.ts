/** CL-0040: original one-dimensional reference pickup model, not calibrated filings.
 * A local-axis field B=pole*B0 exp(-(gap-y)/ell) acts on a reversible induced
 * moment mu=m*sigma*tanh(B/Bs). F=mu*dB/dy is upward for either pole.
 * The source supports grains at y=0; a fixed pole captures at y=gap.
 * Point-kernel, prescribed local field, ideal contact. No global field solution,
 * hysteresis, demagnetisation, collisions, entrained sand, air drag or lateral motion.
 */
export const magneticSeparationConstants={g:9.81,lengthM:.008,dtS:.0001,endS:.3,ironG:12,sandG:36,count:24,cohortKernels:1000}as const;
export type SeparationPole=1|-1;
export type MagneticPickupPhase='source'|'rising'|'captured';
export interface MagneticSeparationParams{surfaceMilliT:number;gapMm:number;pole:SeparationPole;enabled:boolean}
export const magneticSeparationDefaults:MagneticSeparationParams={surfaceMilliT:3,gapMm:10,pole:1,enabled:true};
export function checkMagneticSeparation(p:MagneticSeparationParams,timeS=0){if(!p||![p.surfaceMilliT,p.gapMm,timeS].every(Number.isFinite)||p.surfaceMilliT<0||p.surfaceMilliT>8||p.gapMm<4||p.gapMm>20||timeS<0||timeS>.3||![1,-1].includes(p.pole)||typeof p.enabled!=='boolean')throw new RangeError('Surface field0–8mT, gap4–20mm, pole±1, enabled boolean and time0–0.3s required')}
export function magneticSeparationKernel(index:number){if(!Number.isInteger(index)||index<0||index>=24)throw new RangeError('Reference index0–23 required');return{index,massKg:.5e-6*(.8+.4*index/23),specificSaturationAm2Kg:150*(.85+.3*((index*7)%24)/23),fieldScaleT:.001*(.85+.3*((index*11)%24)/23),cohortMassG:.5*(.8+.4*index/23),xM:((index%8)-3.5)*.003,zM:(Math.floor(index/8)-1)*.004}}
export function magneticSeparationForce(p:MagneticSeparationParams,index:number,yM=0){checkMagneticSeparation(p);if(!Number.isFinite(yM)||yM<0||yM>p.gapMm/1000)throw new RangeError('Height must be between source and pole');const k=magneticSeparationKernel(index),fieldT=p.enabled?p.pole*p.surfaceMilliT/1000*Math.exp(-(p.gapMm/1000-yM)/.008):0,gradientTPerM=fieldT/.008,momentAm2=k.massKg*k.specificSaturationAm2Kg*Math.tanh(fieldT/k.fieldScaleT),forceN=momentAm2*gradientTPerM,weightN=k.massKg*9.81;return{fieldT,gradientTPerM,momentAm2,forceN:forceN===0?0:forceN,weightN,netFreeForceN:forceN-weightN,accelerationMS2:(forceN-weightN)/k.massKg,liftRatio:forceN/weightN}}
export interface MagneticPickupPoint{tS:number;yM:number;velocityMS:number}
export interface MagneticPickupRoute{points:MagneticPickupPoint[];captureS:number|null;initialLiftRatio:number}
const cache=new Map<string,MagneticPickupRoute[]>();
function route(p:MagneticSeparationParams,index:number,dtS=.0001):MagneticPickupRoute{checkMagneticSeparation(p);if(!Number.isFinite(dtS)||dtS<.00001||dtS>.001)throw new RangeError('Integration step0.00001–0.001s required');const initial=magneticSeparationForce(p,index),points:MagneticPickupPoint[]=[{tS:0,yM:0,velocityMS:0}],gap=p.gapMm/1000;
 if(initial.liftRatio<=1)return{points,captureS:null,initialLiftRatio:initial.liftRatio};
 const a=(y:number)=>magneticSeparationForce(p,index,Math.max(0,Math.min(gap,y))).accelerationMS2;
 let y=0,v=0,t=0;
 while(t<.3-1e-12){const h=Math.min(dtS,.3-t),k1y=v,k1v=a(y),k2y=v+h*k1v/2,k2v=a(y+h*k1y/2),k3y=v+h*k2v/2,k3v=a(y+h*k2y/2),k4y=v+h*k3v,k4v=a(y+h*k3y),yn=y+h*(k1y+2*k2y+2*k3y+k4y)/6,vn=v+h*(k1v+2*k2v+2*k3v+k4v)/6;
  if(yn>=gap){const f=(gap-y)/(yn-y),captureS=t+h*f;points.push({tS:captureS,yM:gap,velocityMS:v+(vn-v)*f});return{points,captureS,initialLiftRatio:initial.liftRatio}}
  t+=h;y=yn;v=vn;points.push({tS:t,yM:y,velocityMS:v});
 }
 return{points,captureS:null,initialLiftRatio:initial.liftRatio};
}
export const magneticSeparationRoute=route;
function routes(p:MagneticSeparationParams){const key=JSON.stringify([p.surfaceMilliT,p.gapMm,p.pole,p.enabled]);let r=cache.get(key);if(!r){r=Array.from({length:24},(_,i)=>route(p,i));cache.set(key,r);if(cache.size>8)cache.delete(cache.keys().next().value!)}return r}
export function magneticSeparationPoint(r:MagneticPickupRoute,timeS:number,gapMm:number){if(!Number.isFinite(timeS)||timeS<0||timeS>.3||!Number.isFinite(gapMm)||gapMm<4||gapMm>20)throw new RangeError('Time and gap outside supported range');if(r.captureS!==null&&timeS>=r.captureS)return{yM:gapMm/1000,velocityMS:0,phase:'captured' as MagneticPickupPhase};if(r.points.length===1)return{yM:0,velocityMS:0,phase:'source' as MagneticPickupPhase};let lo=0,hi=r.points.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(r.points[mid].tS<=timeS)lo=mid;else hi=mid}const a=r.points[lo],b=r.points[hi],f=Math.max(0,Math.min(1,(timeS-a.tS)/(b.tS-a.tS)));return{yM:a.yM+(b.yM-a.yM)*f,velocityMS:a.velocityMS+(b.velocityMS-a.velocityMS)*f,phase:timeS===0?'source' as MagneticPickupPhase:'rising' as MagneticPickupPhase}}
export function magneticSeparationState(p:MagneticSeparationParams,timeS:number){checkMagneticSeparation(p,timeS);const rs=routes(p);let sourceIronG=0,risingIronG=0,capturedIronG=0;const kernels=rs.map((r,i)=>{const k=magneticSeparationKernel(i),v=magneticSeparationPoint(r,timeS,p.gapMm);if(v.phase==='source')sourceIronG+=k.cohortMassG;else if(v.phase==='rising')risingIronG+=k.cohortMassG;else capturedIronG+=k.cohortMassG;return{...k,...v,captureS:r.captureS,initialLiftRatio:r.initialLiftRatio,...magneticSeparationForce(p,i,v.yM)}});return{...p,timeS,kernels,sourceIronG,risingIronG,capturedIronG,sandG:36,totalG:sourceIronG+risingIronG+capturedIronG+36,purityPercent:capturedIronG>0?100:null,recoveryPercent:capturedIronG/12*100,settled:risingIronG===0,referenceDurationComplete:timeS===.3}}
/** Magnetic work from height0 to y: integral mu(B)dB. The induced moment
 * depends on B; differentiating -mu(B)B would incorrectly add an extra term. */
export function magneticSeparationWork(p:MagneticSeparationParams,index:number,yM:number){const f=magneticSeparationForce(p,index,yM),start=magneticSeparationForce(p,index,0),k=magneticSeparationKernel(index),logCosh=(v:number)=>Math.abs(v)+Math.log1p(Math.exp(-2*Math.abs(v)))-Math.LN2;return k.massKg*k.specificSaturationAm2Kg*k.fieldScaleT*(logCosh(f.fieldT/k.fieldScaleT)-logCosh(start.fieldT/k.fieldScaleT))}
export function magneticSeparationGuide(time:number){if(!Number.isFinite(time))throw new RangeError('Finite guide time required');const t=Math.max(0,Math.min(110,time)),timeS=t<10?0:t<80?(t-10)/70*.13:t<90?.13+(t-80)/10*.17:.3,caption=t<10?'Identify the mixed sample and fixed magnetic pickup face. Predict which reference grains will rise.':t<35?'Watch in slow motion. A grain lifts only when the upward magnetic force exceeds its weight.':t<65?'Compare reference grains. Their reversible magnetic responses differ, so a weak field can recover only part of the iron.':t<90?'Follow rising iron to the pickup face. Pure quartz sand stays in the source in this ideal model; entrainment is not simulated.':'Record the captured iron, remaining iron and sand. High purity alone does not mean all iron has been recovered.';return{timeS,caption,playbackRate:t>=10&&t<80?.13/70:t>=80&&t<90?.017:0}}

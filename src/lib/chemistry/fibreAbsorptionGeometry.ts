import {fibreAbsorptionState,fibreAbsorptionGuide,type FibreAbsorptionInputs} from './fibreAbsorption';
/** Selected common porous-coupon geometry; these are not measured densities or
 * fibre microstructure. All water fits the reference void envelope. */
export const fibreAbsorptionApparatus={cellX:[-18,-6,6,18],couponSideCm:5,dryBulkDensityGml:.2,referenceSkeletonDensityGml:1.3,bathAreaCm2:36,bathBaseY:1,bathHeightCm:3,bathZ:-4,catchAreaCm2:36,catchBaseY:1,catchZ:4,panY:1.6,panZ:10,raisedY:8} as const;
/** Exact free-water volume around a horizontal rectangular porous envelope.
 * Internal coupon water is a separate compartment, so the outer immersed
 * envelope is excluded once from the surrounding bath volume. */
export function fibreBathLevel(freeWaterMl:number,bottomCm:number,heightCm:number,footprintCm2:number,baseCm2=36){
 if(![freeWaterMl,bottomCm,heightCm,footprintCm2,baseCm2].every(Number.isFinite)||freeWaterMl<0||bottomCm<0||heightCm<=0||footprintCm2<0||footprintCm2>=baseCm2)throw new RangeError('Invalid porous envelope / bath geometry');
 const unoccupied=freeWaterMl/baseCm2;if(unoccupied<=bottomCm||footprintCm2===0)return unoccupied;
 const partial=(freeWaterMl-footprintCm2*bottomCm)/(baseCm2-footprintCm2);
 return partial<=bottomCm+heightCm?partial:(freeWaterMl+footprintCm2*heightCm)/baseCm2;
}
const lerp=(a:number,b:number,f:number)=>a+(b-a)*f;
export function fibreAbsorptionGeometry(q:FibreAbsorptionInputs,seconds?:number){
 const a=fibreAbsorptionApparatus,model=fibreAbsorptionState(q);if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>120))throw new RangeError('Guide time must be 0–120 seconds');
 const t=seconds,stage=t===undefined?'manual':fibreAbsorptionGuide(t,q).stage;
 let bottomY:number=a.panY,z:number=a.panZ;
 if(t!==undefined){
  if(t<15){bottomY=a.panY;z=a.panZ;}
  else if(t<18){bottomY=lerp(a.panY,a.raisedY,(t-15)/3);z=a.panZ;}
  else if(t<22){bottomY=a.raisedY;z=lerp(a.panZ,a.bathZ,(t-18)/4);}
  else if(t<25){bottomY=lerp(a.raisedY,a.bathBaseY,(t-22)/3);z=a.bathZ;}
  else if(t<65){bottomY=a.bathBaseY;z=a.bathZ;}
  else if(t<70){bottomY=lerp(a.bathBaseY,a.raisedY,(t-65)/5);z=a.bathZ;}
  else if(t<75){bottomY=a.raisedY;z=lerp(a.bathZ,a.catchZ,(t-70)/5);}
  else if(t<100){bottomY=a.raisedY;z=a.catchZ;}
  else if(t<106){bottomY=a.raisedY;z=lerp(a.catchZ,a.panZ,(t-100)/6);}
  else if(t<110){bottomY=lerp(a.raisedY,a.panY,(t-106)/4);z=a.panZ;}
 }
 const envelopeMl=q.dryMassG/a.dryBulkDensityGml,skeletonMl=q.dryMassG/a.referenceSkeletonDensityGml,voidMl=envelopeMl-skeletonMl,couponHeightCm=envelopeMl/a.couponSideCm**2;
 return {stage,balanceLoaded:t===undefined||t<15||t>=110,cells:model.cells.map((s,i)=>{
  const overlapsBath=Math.abs(z-a.bathZ)<(6+a.couponSideCm)/2;
  // Every horizontal crossing is above the liquid; partial overlap area is
  // irrelevant there. The vertical entry/exit uses the full 25 cm² footprint.
  const footprint=overlapsBath?a.couponSideCm**2:0,bathLevelCm=fibreBathLevel(s.remainingBathG,bottomY-a.bathBaseY,couponHeightCm,footprint,a.bathAreaCm2);
  const immersedHeightCm=overlapsBath?Math.max(0,Math.min(couponHeightCm,bathLevelCm-(bottomY-a.bathBaseY))):0;
  return {id:s.id,x:a.cellX[i],material:s,bottomY,z,couponHeightCm,envelopeMl,skeletonMl,voidMl,retainedWaterMl:s.retainedG,remainingVoidMl:voidMl-s.retainedG,bathLevelCm,immersedEnvelopeMl:immersedHeightCm*footprint,catchLevelCm:s.drainedG/a.catchAreaCm2,
   balanceMilliG:t===undefined||t<15||t>=110?s.wetGrossMilliG:s.tareMilliG,
   dripping:t!==undefined&&t>75&&t<100&&s.drainableAtLiftG>0&&q.drainS>0,dripPhase:t===undefined?0:t%1,
   wetness:s.retainedG/s.totalCapacityG};
 })};
}

import {rustState,rustReference,type RustInputs,type RustCondition} from './rustConditions';
export type RustVector=[number,number,number];
const sides=128,unitArea=sides*Math.sin(2*Math.PI/sides)/2;
export const rustApparatus={sides,unitArea,chamberRadiusCm:1.2,chamberAreaCm2:unitArea*1.2**2,
 bottomY:.5,couponCentreY:2,couponInitialLengthCm:1};
/** Closed outward polygonal cylinder. No smooth-sphere volume approximation. */
export function rustCylinderTriangles(radius:number,height:number,centreY:number){
 if(![radius,height,centreY].every(Number.isFinite)||radius<0||height<0)throw new RangeError('Finite nonnegative radius/height and finite centre required');
 if(radius===0||height===0)return[];const out:number[]=[],low=centreY-height/2,high=centreY+height/2;
 for(let i=0;i<sides;i++){
  const t=2*Math.PI*i/sides,u=2*Math.PI*(i+1)/sides;
  const a:RustVector=[radius*Math.cos(t),low,radius*Math.sin(t)],b:RustVector=[radius*Math.cos(u),low,radius*Math.sin(u)],
   c:RustVector=[radius*Math.cos(t),high,radius*Math.sin(t)],d:RustVector=[radius*Math.cos(u),high,radius*Math.sin(u)];
  out.push(...a,...c,...b,...b,...c,...d,...[0,low,0],...a,...b,...[0,high,0],...d,...c);
 }return out;
}
export function rustGeometry(q:RustInputs,condition:RustCondition){
 const s=rustState(q,condition),a=rustApparatus;
 const initialRadiusCm=Math.sqrt(s.initialMetalVolumeMl/(a.unitArea*a.couponInitialLengthCm));
 const coreScale=Math.cbrt(s.metalVolumeMl/s.initialMetalVolumeMl),outerScale=Math.cbrt((s.metalVolumeMl+s.attachedVolumeMl)/s.initialMetalVolumeMl);
 const coreRadiusCm=initialRadiusCm*coreScale,coreHeightCm=a.couponInitialLengthCm*coreScale,
  outerRadiusCm=initialRadiusCm*outerScale,outerHeightCm=a.couponInitialLengthCm*outerScale;
 const sedimentDepthCm=s.sedimentVolumeMl/a.chamberAreaCm2,waterDepthCm=s.waterVolumeMl/a.chamberAreaCm2;
 return {...s,initialRadiusCm,coreRadiusCm,coreHeightCm,outerRadiusCm,outerHeightCm,
  chamberHeightCm:q.chamberMl/a.chamberAreaCm2,sedimentDepthCm,sedimentTopY:a.bottomY+sedimentDepthCm,
  waterDepthCm,waterBottomY:a.bottomY+sedimentDepthCm,waterTopY:a.bottomY+sedimentDepthCm+waterDepthCm,
  couponBottomY:a.couponCentreY-outerHeightCm/2,couponTopY:a.couponCentreY+outerHeightCm/2,
  geometryNote:'128-sided volume-calibrated reference cells. Uniform homothetic attached-product shell and separate uniform retained-sediment bed are chosen geometry, not actual rust morphology or a protective-coating prediction. Available water reaches the coupon through a zero-volume schematic wick; wetting/transport/film storage and settling kinetics are not solved. Chosen drawing densities:metal8,product4.2,water1g/mL.'};
}
export function rustCoreTriangles(q:RustInputs,condition:RustCondition){const s=rustGeometry(q,condition);return rustCylinderTriangles(s.coreRadiusCm,s.coreHeightCm,rustApparatus.couponCentreY)}
export function rustAttachedTriangles(q:RustInputs,condition:RustCondition){
 const s=rustGeometry(q,condition);if(s.attachedVolumeMl===0)return[];
 const outer=rustCylinderTriangles(s.outerRadiusCm,s.outerHeightCm,rustApparatus.couponCentreY),inner=rustCoreTriangles(q,condition),out=[...outer];
 // Reverse the inner closed cylinder to form the metal-shaped cavity.
 for(let i=0;i<inner.length;i+=9)out.push(...inner.slice(i,i+3),...inner.slice(i+6,i+9),...inner.slice(i+3,i+6));return out;
}
export function rustSedimentTriangles(q:RustInputs,condition:RustCondition){const s=rustGeometry(q,condition),a=rustApparatus;return rustCylinderTriangles(a.chamberRadiusCm,s.sedimentDepthCm,a.bottomY+s.sedimentDepthCm/2)}
export function rustWaterTriangles(q:RustInputs,condition:RustCondition){const s=rustGeometry(q,condition),a=rustApparatus;return rustCylinderTriangles(a.chamberRadiusCm,s.waterDepthCm,s.waterBottomY+s.waterDepthCm/2)}
export const rustDrawingDensityNote=`Chosen drawing references: Fe ${rustReference.ironDrawingDensityGml},FeOOH-equivalent product ${rustReference.productDrawingDensityGml},water ${rustReference.waterDrawingDensityGml}g/mL; not measured material constants.`;

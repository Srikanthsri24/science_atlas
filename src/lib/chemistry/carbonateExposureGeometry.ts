import {carbonateExposureState,carbonateExposureConstants as c,type CarbonateExposureInputs} from './carbonateExposure';
/** Centimetres and millilitres. Reservoir and runoff height are nominal volume
 * references, not predictions of partial molar volume or gas displacement. */
export const carbonateExposureApparatus={stockAreaCm2:100,stockCapacityMl:1000,runoffAreaCm2:100,runoffCapacityMl:1000,cellX:[-21,-7,7,21],surfaceBaseY:4,stockBaseY:10,gasGaugeCapacityMl:20,gasGaugeRadiusCm:1.2,gasGaugeSegments:128} as const;
export function carbonateExposureGeometry(raw:CarbonateExposureInputs,seconds?:number){
 const model=carbonateExposureState(raw),a=carbonateExposureApparatus;
 if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>120))throw new RangeError('Guide time must be 0–120 seconds');
 return {cells:model.cells.map((s,i)=>{
  const sideCm=Math.sqrt(raw.areaCm2),initialHeightCm=s.initialDepthMm/10,remainingHeightCm=s.remainingDepthMm/10;
  // Separate normalized sections show retained and removed depth. The whole
  // slab always uses physical dimensions; neither layer is clamped visibly up.
  const sectionScale=s.hasSpecimen?4/initialHeightCm:1;
  const magnifiedRemainingCm=remainingHeightCm*sectionScale,magnifiedRemovedCm=s.removedDepthMm/10*sectionScale;
  return {id:s.id,x:a.cellX[i],material:s,sideCm,initialHeightCm,remainingHeightCm,slabCentreY:a.surfaceBaseY+remainingHeightCm/2,slabVolumeMl:raw.areaCm2*remainingHeightCm,
   sectionScale,magnifiedRemainingCm,magnifiedRemovedCm,
   stockRemainingMl:c.stockMl-raw.deliveredMl,stockLevelCm:(c.stockMl-raw.deliveredMl)/a.stockAreaCm2,
   runoffNominalMl:raw.deliveredMl,runoffLevelCm:raw.deliveredMl/a.runoffAreaCm2,
   contactShare:raw.contactFraction,bypassShare:1-raw.contactFraction,
   gasGaugeFill:s.capturedGasMl/a.gasGaugeCapacityMl,
   gasGaugeAreaCm2:a.gasGaugeSegments*Math.sin(2*Math.PI/a.gasGaugeSegments)*a.gasGaugeRadiusCm**2/2,
   gasGaugeHeightCm:s.capturedGasMl/(a.gasGaugeSegments*Math.sin(2*Math.PI/a.gasGaugeSegments)*a.gasGaugeRadiusCm**2/2),
   flowActive:seconds!==undefined&&seconds>15&&seconds<105&&raw.deliveredMl>0,
   phase:seconds===undefined?0:seconds%2/2};
 })};
}

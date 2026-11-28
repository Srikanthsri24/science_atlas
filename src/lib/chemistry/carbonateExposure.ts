/** CL-0111: a defined dilute nitric-acid-equivalent reference, not rainwater
 * equilibrium, measured weathering kinetics or a prediction of monument loss. */
export interface CarbonateExposureInputs{specimenG:number;areaCm2:number;acidMmolL:number;deliveredMl:number;contactFraction:number;captureFraction:number;temperatureK:number;pressureKPa:number}
export const carbonateExposureIds=['water','half-acid','acid','blank']as const;
export type CarbonateExposureId=typeof carbonateExposureIds[number];
const Ca=40.078,C=12.011,O=15.999,H=1.008,N=14.007;
export const carbonateExposureConstants={Ca,C,O,H,N,carbonateGmol:Ca+C+3*O,nitrateGmol:N+3*O,nitricAcidGmol:H+N+3*O,calciumNitrateGmol:Ca+2*(N+3*O),carbonDioxideGmol:C+2*O,waterGmol:2*H+O,calciteDensityGml:2.71,stockMl:1000,gasR:6.02214076e23*1.380649e-23,durationS:120}as const;
export const defaultCarbonateExposure:CarbonateExposureInputs={specimenG:.1,areaCm2:1,acidMmolL:.1,deliveredMl:0,contactFraction:1,captureFraction:1,temperatureK:298.15,pressureKPa:101.325};
export const carbonateExposureBounds={specimenG:[.02,1],areaCm2:[.5,4],acidMmolL:[0,1],deliveredMl:[0,1000],contactFraction:[0,1],captureFraction:[0,1],temperatureK:[273.15,313.15],pressureKPa:[80,120]}as const;
export function validateCarbonateExposure(raw:unknown):CarbonateExposureInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Carbonate exposure preparation required');const r=raw as Record<string,unknown>,q={}as CarbonateExposureInputs;
 for(const key of Object.keys(carbonateExposureBounds)as(keyof CarbonateExposureInputs)[]){const n=r[key],[lo,hi]=carbonateExposureBounds[key];if(typeof n!=='number'||!Number.isFinite(n)||n<lo||n>hi)throw new RangeError(`${key} must be finite in ${lo}–${hi}`);q[key]=n;}
 for(const key of['acidMmolL','deliveredMl','contactFraction','captureFraction']as const)if(q[key]>0&&q[key]<1e-6)throw new RangeError(`${key}: nonzero values must be at least 0.000001`);
 for(const key of['contactFraction','captureFraction']as const)if(q[key]<1&&q[key]>0&&1-q[key]<1e-6)throw new RangeError(`${key}: interior fractions must stay at least 0.000001 from either endpoint`);
 return q;
}
export function carbonateExposureCell(raw:CarbonateExposureInputs,id:CarbonateExposureId){
 const q=validateCarbonateExposure(raw),c=carbonateExposureConstants;if(!carbonateExposureIds.includes(id))throw new RangeError('Choose a carbonate exposure control');
 const hasSpecimen=id!=='blank',acidScale=id==='water'?0:id==='half-acid'?.5:1,acidMmolL=q.acidMmolL*acidScale;
 const initialSpecimenG=hasSpecimen?q.specimenG:0,initialCarbonateMol=initialSpecimenG/c.carbonateGmol;
 const stockAcidMol=acidMmolL*c.stockMl/1e6,deliveredAcidMol=acidMmolL*q.deliveredMl/1e6,remainingStockAcidMol=stockAcidMol-deliveredAcidMol;
 const contactStreamMl=q.deliveredMl*q.contactFraction,bypassStreamMl=q.deliveredMl-contactStreamMl,contactAcidMol=deliveredAcidMol*q.contactFraction;
 const reactedCarbonateMol=hasSpecimen?Math.min(initialCarbonateMol,contactAcidMol/2):0,acidConsumedMol=2*reactedCarbonateMol,remainingAcidMol=Math.max(0,deliveredAcidMol-acidConsumedMol);
 const specimenExhausted=hasSpecimen&&reactedCarbonateMol===initialCarbonateMol;
 const specimenLostG=specimenExhausted?initialSpecimenG:reactedCarbonateMol*c.carbonateGmol,remainingSpecimenG=initialSpecimenG-specimenLostG;
 const calciumMol=reactedCarbonateMol,nitrateMol=deliveredAcidMol,carbonDioxideMol=reactedCarbonateMol,generatedWaterMol=reactedCarbonateMol;
 const capturedGasMol=carbonDioxideMol*q.captureFraction,escapedGasMol=carbonDioxideMol-capturedGasMol;
 const carbonDioxideG=carbonDioxideMol*c.carbonDioxideGmol,capturedGasG=capturedGasMol*c.carbonDioxideGmol,escapedGasG=escapedGasMol*c.carbonDioxideGmol,generatedWaterG=generatedWaterMol*c.waterGmol;
 const idealVolume=(mol:number)=>mol*c.gasR*q.temperatureK/(q.pressureKPa*1000)*1e6;
 const capturedGasMl=idealVolume(capturedGasMol),escapedGasEquivalentMl=idealVolume(escapedGasMol),totalGasEquivalentMl=idealVolume(carbonDioxideMol);
 const stockAcidG=stockAcidMol*c.nitricAcidGmol,deliveredAcidG=deliveredAcidMol*c.nitricAcidGmol;
 // Prepared density selected as 1 g/mL; subtract dissolved acid from carrier.
 const stockCarrierG=c.stockMl-stockAcidG,deliveredCarrierG=q.deliveredMl-deliveredAcidG,remainingStockCarrierG=stockCarrierG-deliveredCarrierG;
 const calciumG=calciumMol*Ca,nitrateG=nitrateMol*c.nitrateGmol,remainingHydrogenG=remainingAcidMol*H;
 const aqueousSolutesG=calciumG+nitrateG+remainingHydrogenG,effluentG=deliveredCarrierG+generatedWaterG+aqueousSolutesG;
 const calciumNitrateEquivalentG=calciumMol*c.calciumNitrateGmol,unreactedAcidEquivalentG=remainingAcidMol*c.nitricAcidGmol;
 const remainingStockG=remainingStockCarrierG+remainingStockAcidMol*c.nitricAcidGmol;
 const initialAccountG=initialSpecimenG+c.stockMl,retainedAccountG=remainingSpecimenG+effluentG+capturedGasG+remainingStockG,accountIncludingEscapeG=retainedAccountG+escapedGasG;
 const initialVolumeMl=initialSpecimenG/c.calciteDensityGml,remainingVolumeMl=remainingSpecimenG/c.calciteDensityGml,lostVolumeMl=specimenLostG/c.calciteDensityGml;
 const initialDepthMm=hasSpecimen?initialVolumeMl/q.areaCm2*10:0,remainingDepthMm=hasSpecimen?remainingVolumeMl/q.areaCm2*10:0,removedDepthMm=hasSpecimen?lostVolumeMl/q.areaCm2*10:0;
 const requiredDoseMl=hasSpecimen&&acidMmolL>0&&q.contactFraction>0?2*initialCarbonateMol/(acidMmolL*q.contactFraction)*1e6:null;
 return{id,hasSpecimen,acidScale,acidMmolL,initialSpecimenG,initialCarbonateMol,stockAcidMol,deliveredAcidMol,remainingStockAcidMol,contactStreamMl,bypassStreamMl,contactAcidMol,reactedCarbonateMol,acidConsumedMol,remainingAcidMol,specimenExhausted,specimenLostG,remainingSpecimenG,calciumMol,nitrateMol,carbonDioxideMol,generatedWaterMol,capturedGasMol,escapedGasMol,carbonDioxideG,capturedGasG,escapedGasG,generatedWaterG,capturedGasMl,escapedGasEquivalentMl,totalGasEquivalentMl,stockAcidG,deliveredAcidG,stockCarrierG,deliveredCarrierG,remainingStockCarrierG,calciumG,nitrateG,remainingHydrogenG,aqueousSolutesG,effluentG,calciumNitrateEquivalentG,unreactedAcidEquivalentG,remainingStockG,initialAccountG,retainedAccountG,accountIncludingEscapeG,initialVolumeMl,remainingVolumeMl,lostVolumeMl,initialDepthMm,remainingDepthMm,removedDepthMm,requiredDoseMl,reachableWithStock:requiredDoseMl===null?null:requiredDoseMl<=c.stockMl,
  specimenLossPercent:hasSpecimen?100*specimenLostG/initialSpecimenG:null,
  acidConsumedFraction:deliveredAcidMol>0?acidConsumedMol/deliveredAcidMol:null,
  materialResidualG:accountIncludingEscapeG-initialAccountG,
  retainedMassResidualG:retainedAccountG-initialAccountG+escapedGasG,
  aqueousChargeResidualMol:2*calciumMol+remainingAcidMol-nitrateMol,
  carbonateCarbonResidualMol:initialCarbonateMol-remainingSpecimenG/c.carbonateGmol-carbonDioxideMol,
  calciumResidualMol:initialCarbonateMol-remainingSpecimenG/c.carbonateGmol-calciumMol,
  nitrateResidualMol:stockAcidMol-remainingStockAcidMol-nitrateMol,
  gasPartitionResidualMol:carbonDioxideMol-capturedGasMol-escapedGasMol,
  reactionHydrogenResidualMol:acidConsumedMol-2*generatedWaterMol,
  reactionOxygenResidualMol:3*reactedCarbonateMol+3*acidConsumedMol-6*calciumMol-2*carbonDioxideMol-generatedWaterMol,
  equivalentSolutesResidualG:aqueousSolutesG-calciumNitrateEquivalentG-unreactedAcidEquivalentG};
}
export function carbonateExposureState(raw:CarbonateExposureInputs){const q=validateCarbonateExposure(raw);return{inputs:q,cells:carbonateExposureIds.map(id=>carbonateExposureCell(q,id))};}
export function carbonateExposureGuide(seconds:number,raw:CarbonateExposureInputs){
 const q=validateCarbonateExposure(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be 0–120 seconds');
 const staged=q.deliveredMl*Math.max(0,Math.min(1,(seconds-15)/90));
 // The preparation domain starts at 1 nL. Hold sub-domain staged readings at
 // zero; this is a numerical staging boundary, not a physical droplet size.
 const deliveredMl=staged>0&&staged<1e-6?0:staged;
 return{inputs:{...q,deliveredMl},stage:seconds<15?'Compare water, half-strength acid, selected acid and a reagent blank without a carbonate specimen.':seconds<105?'Meter a finite defined exposure. Follow carbonate loss, calcium in runoff and separately captured or escaped carbon dioxide.':'Compare specimen loss with retained-apparatus loss. This ideal full-gas-release reaction channel is not rainwater equilibrium or measured stone-weathering time.'};
}

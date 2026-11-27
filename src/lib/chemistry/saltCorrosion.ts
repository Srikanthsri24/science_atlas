/** CL-0107: conditional ionic-resistance/oxygen-transport reference for matched iron coupons.
 * Neither this ceiling nor the selected fraction is an empirically calibrated rust-rate law.
 */
export type SaltCorrosionMode='dilute'|'entered';
export interface SaltCorrosionInputs {
  mode:SaltCorrosionMode;ironG:number;solutionG:number;exposedAreaCm2:number;
  saltPctA:number;saltPctB:number;densityA:number;densityB:number;
  conductivityA:number;conductivityB:number;oxygenMgLA:number;oxygenMgLB:number;
  driveV:number;solutionPathMm:number;boundaryLayerMm:number;ceilingFraction:number;elapsedDays:number;
}
export const saltCorrosionConstants={ironGmol:55.845,oxygenGmol:31.998,waterGmol:18.015,saltGmol:58.44,ironDensityGml:7.87,molarConductivitySM2Mol:.01265,waterConductivitySM:5.5e-6,oxygenDiffusionM2S:2e-9,avogadro:6.02214076e23,elementaryChargeC:1.602176634e-19,faradayCmol:6.02214076e23*1.602176634e-19,dayS:86400,hydrationNumber:1,durationS:120}as const;
export const defaultSaltCorrosion:SaltCorrosionInputs={mode:'dilute',ironG:.5,solutionG:50,exposedAreaCm2:4,saltPctA:.005,saltPctB:.05,densityA:1,densityB:1.025,conductivityA:.02,conductivityB:5,oxygenMgLA:8,oxygenMgLB:8,driveV:.05,solutionPathMm:10,boundaryLayerMm:.5,ceilingFraction:1,elapsedDays:0};
export function validateSaltCorrosion(raw:unknown):SaltCorrosionInputs {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Saltwater comparison preparation required');
  const r=raw as Record<string,unknown>;
  if(r.mode!=='dilute'&&r.mode!=='entered')throw new RangeError('Choose dilute or entered solution properties');
  const q={mode:r.mode}as SaltCorrosionInputs;
  const bounds={ironG:[.2,1],solutionG:[20,100],exposedAreaCm2:[4,20],saltPctA:[0,10],saltPctB:[0,10],densityA:[.99,1.2],densityB:[.99,1.2],conductivityA:[5.5e-6,30],conductivityB:[5.5e-6,30],oxygenMgLA:[0,12],oxygenMgLB:[0,12],driveV:[0,.2],solutionPathMm:[2,20],boundaryLayerMm:[.1,2],ceilingFraction:[0,1],elapsedDays:[0,14]}as const;
  for(const key of Object.keys(bounds)as(keyof typeof bounds)[]){const value=r[key],[lo,hi]=bounds[key];if(typeof value!=='number'||!Number.isFinite(value)||value<lo||value>hi)throw new RangeError(`${key} must be finite in ${lo}–${hi}`);q[key]=value;}
  for(const key of ['saltPctA','saltPctB','oxygenMgLA','oxygenMgLB','driveV','ceilingFraction']as const)if(q[key]>0&&q[key]<1e-6)throw new RangeError(`${key}: nonzero values must be at least 0.000001 in the stated unit`);
  if(q.mode==='dilute'&&(q.saltPctA>.05||q.saltPctB>.05))throw new RangeError('Dilute approximation supports at most0.05 mass percent; use entered properties for broader concentrations');
  return q;
}
export function saltCorrosionCell(raw:SaltCorrosionInputs,id:'a'|'b') {
  const q=validateSaltCorrosion(raw),c=saltCorrosionConstants;
  if(id!=='a'&&id!=='b')throw new RangeError('Choose comparison cell a or b');
  const percent=id==='a'?q.saltPctA:q.saltPctB,oxygenMgL=id==='a'?q.oxygenMgLA:q.oxygenMgLB;
  const densityGml=q.mode==='dilute'?1:id==='a'?q.densityA:q.densityB;
  const saltG=q.solutionG*percent/100,waterG=q.solutionG-saltG,saltMol=saltG/c.saltGmol;
  const solutionMl=q.solutionG/densityGml,solutionM3=solutionMl*1e-6;
  const saltMolM3=saltMol/solutionM3,molarityMolL=saltMol/(solutionMl/1000),molalityMolKg=saltMol/(waterG/1000);
  const conductivitySM=q.mode==='dilute'?c.waterConductivitySM+c.molarConductivitySM2Mol*saltMolM3:id==='a'?q.conductivityA:q.conductivityB;
  const areaM2=q.exposedAreaCm2*1e-4,pathM=q.solutionPathMm/1000,boundaryLayerM=q.boundaryLayerMm/1000;
  const oxygenMolM3=oxygenMgL/c.oxygenGmol;
  const oxygenFluxCeilingMolM2S=c.oxygenDiffusionM2S*oxygenMolM3/boundaryLayerM;
  const ohmicCeilingAM2=conductivitySM*q.driveV/pathM;
  // Total O2 includes cathodic reduction AND the assumed further Fe(II)->Fe(III) maturation.
  const oxygenCeilingAM2=8*c.faradayCmol*oxygenFluxCeilingMolM2S/3;
  const currentCeilingAM2=Math.min(ohmicCeilingAM2,oxygenCeilingAM2);
  const referenceCurrentAM2=q.ceilingFraction*currentCeilingAM2,initialCurrentA=referenceCurrentAM2*areaM2;
  const resistanceOhm=pathM/(conductivitySM*areaM2),elapsedS=q.elapsedDays*c.dayS;
  const exhaustionChargeC=2*c.faradayCmol*q.ironG/c.ironGmol;
  const exhaustionS=initialCurrentA>0?exhaustionChargeC/initialCurrentA:null;
  const activeS=exhaustionS===null?0:Math.min(elapsedS,exhaustionS);
  const exhausted=exhaustionS!==null&&elapsedS>=exhaustionS;
  const primaryChargeC=exhausted?exhaustionChargeC:initialCurrentA*activeS;
  const convertedIronMol=exhausted?q.ironG/c.ironGmol:primaryChargeC/(2*c.faradayCmol);
  const convertedIronG=exhausted?q.ironG:convertedIronMol*c.ironGmol;
  const remainingIronG=exhausted?0:Math.max(0,q.ironG-convertedIronG);
  const instantaneousCurrentA=exhausted?0:initialCurrentA;
  const meanCurrentA=elapsedS>0?primaryChargeC/elapsedS:null;
  const primaryElectronMol=primaryChargeC/c.faradayCmol,secondaryEquivalentChargeC=convertedIronMol*c.faradayCmol;
  const totalRedoxEquivalentChargeC=primaryChargeC+secondaryEquivalentChargeC;
  const cathodicOxygenMol=convertedIronMol/2,furtherOxygenMol=convertedIronMol/4,oxygenSuppliedMol=cathodicOxygenMol+furtherOxygenMol;
  const oxygenSuppliedG=oxygenSuppliedMol*c.oxygenGmol;
  const productReferenceMol=convertedIronMol/2,hydrationWaterSuppliedMol=productReferenceMol,hydrationWaterSuppliedG=hydrationWaterSuppliedMol*c.waterGmol;
  const productReferenceG=convertedIronG+oxygenSuppliedG+hydrationWaterSuppliedG;
  const retainedSpecimenG=remainingIronG+productReferenceG,specimenGainG=oxygenSuppliedG+hydrationWaterSuppliedG;
  const initialCarrierAccountG=q.ironG+q.solutionG,externalInputG=oxygenSuppliedG+hydrationWaterSuppliedG;
  const finalCarrierAccountG=retainedSpecimenG+q.solutionG;
  const materialResidualG=initialCarrierAccountG+externalInputG-finalCarrierAccountG;
  const ironAtomResidualMol=q.ironG/c.ironGmol-remainingIronG/c.ironGmol-2*productReferenceMol;
  const oxygenAtomResidualMol=2*oxygenSuppliedMol+hydrationWaterSuppliedMol-4*productReferenceMol;
  const hydrogenAtomResidualMol=2*hydrationWaterSuppliedMol-2*productReferenceMol;
  const primaryChargeResidualC=primaryChargeC-2*c.faradayCmol*convertedIronMol;
  const totalRedoxResidualC=totalRedoxEquivalentChargeC-4*c.faradayCmol*oxygenSuppliedMol;
  const initialIronMl=q.ironG/c.ironDensityGml,remainingIronMl=remainingIronG/c.ironDensityGml;
  const faceAreaCm2=q.exposedAreaCm2/2,sideCm=Math.sqrt(faceAreaCm2),initialThicknessCm=initialIronMl/faceAreaCm2,remainingThicknessCm=remainingIronMl/faceAreaCm2;
  const penetrationPerFaceMm=convertedIronG*10/(c.ironDensityGml*q.exposedAreaCm2);
  const currentMassLossGS=instantaneousCurrentA*c.ironGmol/(2*c.faradayCmol);
  const meanMassLossGDay=q.elapsedDays>0?convertedIronG/q.elapsedDays:null;
  const currentTotalOxygenFluxMolM2S=3*instantaneousCurrentA/(8*c.faradayCmol*areaM2);
  const limitingRegime=q.driveV===0?'zero-driving-reference':oxygenMgL===0?'oxygen-absent':Math.abs(ohmicCeilingAM2-oxygenCeilingAM2)<=Math.max(ohmicCeilingAM2,oxygenCeilingAM2)*1e-12?'matched-ceilings':ohmicCeilingAM2<oxygenCeilingAM2?'resistance-limited':'oxygen-transport-limited';
  return{id,percent,oxygenMgL,densityGml,saltG,waterG,saltMol,solutionMl,solutionM3,saltMolM3,molarityMolL,molalityMolKg,conductivitySM,areaM2,pathM,boundaryLayerM,oxygenMolM3,oxygenFluxCeilingMolM2S,ohmicCeilingAM2,oxygenCeilingAM2,currentCeilingAM2,referenceCurrentAM2,initialCurrentA,resistanceOhm,elapsedS,exhaustionChargeC,exhaustionS,activeS,primaryChargeC,convertedIronMol,convertedIronG,remainingIronG,instantaneousCurrentA,meanCurrentA,primaryElectronMol,secondaryEquivalentChargeC,totalRedoxEquivalentChargeC,cathodicOxygenMol,furtherOxygenMol,oxygenSuppliedMol,oxygenSuppliedG,productReferenceMol,hydrationWaterSuppliedMol,hydrationWaterSuppliedG,productReferenceG,retainedSpecimenG,specimenGainG,initialCarrierAccountG,externalInputG,finalCarrierAccountG,materialResidualG,ironAtomResidualMol,oxygenAtomResidualMol,hydrogenAtomResidualMol,primaryChargeResidualC,totalRedoxResidualC,initialIronMl,remainingIronMl,faceAreaCm2,sideCm,initialThicknessCm,remainingThicknessCm,penetrationPerFaceMm,currentMassLossGS,meanMassLossGDay,currentTotalOxygenFluxMolM2S,limitingRegime,exhausted,newProductCalculated:convertedIronMol>0};
}
export function saltCorrosionState(raw:SaltCorrosionInputs){const q=validateSaltCorrosion(raw),a=saltCorrosionCell(q,'a'),b=saltCorrosionCell(q,'b');return{a,b,deltaIronLossG:b.convertedIronG-a.convertedIronG,deltaSpecimenGainG:b.specimenGainG-a.specimenGainG,initialCurrentRatioBoverA:a.initialCurrentA>0?b.initialCurrentA/a.initialCurrentA:null};}
export function saltCorrosionGuide(seconds:number,raw:SaltCorrosionInputs){const q=validateSaltCorrosion(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Saltwater guide time must be0–120seconds');const progress=Math.max(0,Math.min(1,(seconds-15)/90));return{inputs:{...q,elapsedDays:7*progress},progress,stage:seconds<15?'Match coupon mass, exposed faces and carrier-solution mass. Distinguish salt mass percent from molarity.':seconds<105?'Advance a chosen seven-day transport-ceiling reference. Ionic resistance and oxygen supply are separate limits, not a universal measured corrosion law.':'Compare cleaned metal loss, retained-product gain and oxygen/water supplied by the maintained bath.'};}

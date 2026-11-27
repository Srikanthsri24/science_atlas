/** CL-0106: controlled water/oxygen conditions with an explicitly assumed corrosion account.
 * This is not a calibrated prediction of real rust formation or a unique rust composition.
 */
export interface CorrosionInputs {
  ironG:number;
  waterG:number;
  accessibleOxygenMol:number;
  chosenRatePerDay:number;
  elapsedDays:number;
  hydrationNumber:number;
  nailLengthCm:number;
}
export type CorrosionCellId='wet-air'|'oxygen-excluded'|'dry-air';
export const corrosionCellIds:readonly CorrosionCellId[]=['wet-air','oxygen-excluded','dry-air'];
export const corrosionConstants={ironGmol:55.845,oxygenGmol:31.998,waterGmol:18.015,ironDensityGml:7.87,tipLengthCm:.3,headThicknessCm:.12,headRadiusRatio:2,durationS:120} as const;
export const defaultCorrosion:CorrosionInputs={ironG:.4,waterG:20,accessibleOxygenMol:.001,chosenRatePerDay:.02,elapsedDays:0,hydrationNumber:1,nailLengthCm:4};
export function validateCorrosion(raw:unknown):CorrosionInputs {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Corrosion preparation required');
  const input=raw as Record<string,unknown>,q={} as CorrosionInputs;
  const bounds={ironG:[.2,1],waterG:[20,40],accessibleOxygenMol:[0,.005],chosenRatePerDay:[0,1],elapsedDays:[0,14],hydrationNumber:[0,3],nailLengthCm:[3,5]} as const;
  for(const key of Object.keys(bounds)as(keyof CorrosionInputs)[]){
    const value=input[key],[lo,hi]=bounds[key];
    if(typeof value!=='number'||!Number.isFinite(value)||value<lo||value>hi)throw new RangeError(`${key} must be finite in ${lo}–${hi}`);
    q[key]=value;
  }
  return q;
}
export function corrosionCell(raw:CorrosionInputs,id:CorrosionCellId) {
  const q=validateCorrosion(raw),c=corrosionConstants;
  if(!corrosionCellIds.includes(id))throw new RangeError('Unknown corrosion control');
  const initialWaterG=id==='dry-air'?0:q.waterG;
  const initialOxygenMol=id==='oxygen-excluded'?0:q.accessibleOxygenMol;
  const initialIronMol=q.ironG/c.ironGmol,initialWaterMol=initialWaterG/c.waterGmol;
  const chosenProgressFraction=-Math.expm1(-q.chosenRatePerDay*q.elapsedDays);
  const targetIronMol=initialIronMol*chosenProgressFraction;
  const oxygenIronLimitMol=4*initialOxygenMol/3;
  const waterIronLimitMol=q.hydrationNumber>0?2*initialWaterMol/q.hydrationNumber:null;
  const conditionsPresent=initialWaterG>0&&initialOxygenMol>0;
  const convertedIronMol=conditionsPresent?Math.min(targetIronMol,oxygenIronLimitMol,waterIronLimitMol??Infinity):0;
  const oxideReferenceMol=convertedIronMol/2;
  const targetLimited=conditionsPresent&&convertedIronMol===targetIronMol;
  const convertedIronG=targetLimited?q.ironG*chosenProgressFraction:convertedIronMol*c.ironGmol;
  const remainingIronG=targetLimited?q.ironG*Math.exp(-q.chosenRatePerDay*q.elapsedDays):Math.max(0,q.ironG-convertedIronG),remainingIronMol=remainingIronG/c.ironGmol;
  const oxygenConsumedMol=.75*convertedIronMol;
  const oxygenRemainingMol=conditionsPresent&&convertedIronMol===oxygenIronLimitMol?0:Math.max(0,initialOxygenMol-oxygenConsumedMol);
  const oxygenInitialG=initialOxygenMol*c.oxygenGmol,oxygenConsumedG=oxygenConsumedMol*c.oxygenGmol,oxygenRemainingG=oxygenRemainingMol*c.oxygenGmol;
  const hydrationWaterMol=q.hydrationNumber*oxideReferenceMol,hydrationWaterG=hydrationWaterMol*c.waterGmol;
  const remainingWaterG=Math.max(0,initialWaterG-hydrationWaterG),remainingWaterMol=remainingWaterG/c.waterGmol;
  const dryOxideReferenceG=convertedIronG+oxygenConsumedG;
  const productReferenceG=dryOxideReferenceG+hydrationWaterG;
  const referenceFormulaGmol=2*c.ironGmol+1.5*c.oxygenGmol+q.hydrationNumber*c.waterGmol;
  const retainedSpecimenG=remainingIronG+productReferenceG;
  const specimenMassGainG=oxygenConsumedG+hydrationWaterG;
  const initialAccountG=q.ironG+initialWaterG+oxygenInitialG;
  const finalAccountG=retainedSpecimenG+remainingWaterG+oxygenRemainingG;
  const convertedFraction=convertedIronG/q.ironG;
  const initialIronMl=q.ironG/c.ironDensityGml,remainingIronMl=remainingIronG/c.ironDensityGml;
  const shaftRadiusCm=Math.sqrt(initialIronMl/(Math.PI*(q.nailLengthCm-2*c.tipLengthCm/3+c.headRadiusRatio**2*c.headThicknessCm)));
  const remainingRadiusCm=shaftRadiusCm*Math.sqrt(remainingIronG/q.ironG);
  return {id,initialWaterG,initialOxygenMol,initialIronMol,initialWaterMol,chosenProgressFraction,targetIronMol,oxygenIronLimitMol,waterIronLimitMol,convertedIronMol,oxideReferenceMol,convertedIronG,remainingIronG,remainingIronMol,oxygenConsumedMol,oxygenRemainingMol,oxygenInitialG,oxygenConsumedG,oxygenRemainingG,hydrationWaterMol,hydrationWaterG,remainingWaterG,remainingWaterMol,dryOxideReferenceG,productReferenceG,referenceFormulaGmol,retainedSpecimenG,specimenMassGainG,initialAccountG,finalAccountG,massResidualG:initialAccountG-finalAccountG,ironAtomResidualMol:initialIronMol-remainingIronMol-2*oxideReferenceMol,oxygenAtomResidualMol:2*initialOxygenMol+initialWaterMol-2*oxygenRemainingMol-remainingWaterMol-(3+q.hydrationNumber)*oxideReferenceMol,hydrogenAtomResidualMol:2*initialWaterMol-2*remainingWaterMol-2*q.hydrationNumber*oxideReferenceMol,convertedFraction,initialIronMl,remainingIronMl,shaftRadiusCm,remainingRadiusCm,conditionsPresent,newProductCalculated:convertedIronMol>0,condition:id==='dry-air'?'water-excluded':initialOxygenMol===0?'oxygen-excluded':q.chosenRatePerDay===0?'zero-rate-reference':convertedIronMol===0?'initial-reference':Math.abs(targetIronMol-oxygenIronLimitMol)<=Math.max(targetIronMol,oxygenIronLimitMol)*1e-12?'matched-target-and-oxygen-reference':convertedIronMol===oxygenIronLimitMol?'oxygen-limited-reference':waterIronLimitMol!==null&&convertedIronMol===waterIronLimitMol?'hydration-water-limited-reference':'chosen-progress-reference'};
}
export function corrosionState(raw:CorrosionInputs){const q=validateCorrosion(raw);return corrosionCellIds.map(id=>corrosionCell(q,id));}
export function corrosionGuide(seconds:number,raw:CorrosionInputs){
  const q=validateCorrosion(raw);
  if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Corrosion guide time must be 0–120 seconds');
  const progress=Math.max(0,Math.min(1,(seconds-15)/90));
  return {inputs:{...q,elapsedDays:7*progress},progress,stage:seconds<15?'Match the iron specimens. Change oxygen or water availability in one control at a time.':seconds<105?'Advance an illustrative seven-day reference account. This selected progress law is not measured corrosion data.':'Compare the wet, oxygen-excluded and dry controls. Interpret chemical identity and the stated model limits.'};
}

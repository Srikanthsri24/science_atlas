/** Selected operational filtration/rinsing reference. Solute inventory during
 * drying spans liquid and solid phases; no solubility or thermal rate model. */
export interface WaterImpuritiesInputs{sampleMl:number;saltMgL:number;solidMgL:number;filteredFraction:number;holdUpFraction:number;retention:number;rinseMl:number;dryFraction:number;filterTareG:number;dishTareG:number}
export const waterImpuritiesIds=['water','salt','suspension','mixture'] as const;
export type WaterImpuritiesId=typeof waterImpuritiesIds[number];
export const waterImpuritiesBounds={sampleMl:[25,200],saltMgL:[0,2000],solidMgL:[0,1000],filteredFraction:[0,1],holdUpFraction:[0,.2],retention:[0,1],rinseMl:[0,100],dryFraction:[0,1],filterTareG:[.5,5],dishTareG:[10,100]} as const;
export const defaultWaterImpurities:WaterImpuritiesInputs={sampleMl:100,saltMgL:1000,solidMgL:500,filteredFraction:1,holdUpFraction:.05,retention:1,rinseMl:20,dryFraction:1,filterTareG:1,dishTareG:25};
export function validateWaterImpurities(raw:unknown):WaterImpuritiesInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Water preparation required');const r=raw as Record<string,unknown>,q={} as WaterImpuritiesInputs;
 for(const k of Object.keys(waterImpuritiesBounds)as(keyof WaterImpuritiesInputs)[]){const n=r[k],[lo,hi]=waterImpuritiesBounds[k];if(typeof n!=='number'||!Number.isFinite(n)||n<lo||n>hi)throw new RangeError(`${k} must be finite in ${lo}–${hi}`);q[k]=n;}
 for(const k of ['saltMgL','solidMgL','filteredFraction','holdUpFraction','retention','rinseMl','dryFraction'] as const)if(q[k]>0&&q[k]<1e-12)throw new RangeError(`${k}: nonzero values must be at least 1e-12`);
 return q;
}
export function waterImpuritiesCell(raw:WaterImpuritiesInputs,id:WaterImpuritiesId){
 const q=validateWaterImpurities(raw);if(!waterImpuritiesIds.includes(id))throw new RangeError('Choose a known prepared control');
 const saltG=id==='salt'||id==='mixture'?q.saltMgL*q.sampleMl/1e6:0,solidG=id==='suspension'||id==='mixture'?q.solidMgL*q.sampleMl/1e6:0;
 // Selected solution density1g/mL; suspended solid is an additional mass.
 const carrierG=q.sampleMl-saltG,f=q.filteredFraction,processedMl=q.sampleMl*f,feedCarrierG=carrierG*(1-f),feedSaltG=saltG*(1-f),feedSolidG=solidG*(1-f),processedCarrierG=carrierG*f,processedSaltG=saltG*f,processedSolidG=solidG*f;
 const retainedSolidG=processedSolidG*q.retention,passedSolidG=processedSolidG-retainedSolidG,cakeCarrierBeforeDryG=processedCarrierG*q.holdUpFraction,cakeSaltBeforeRinseG=processedSaltG*q.holdUpFraction,rinseCarrierG=q.rinseMl*f;
 // Ideal well-mixed displacement rinse at constant cake carrier volume.
 // expm1 preserves a small positive removed mass; no rinse is a true control.
 const rinseRatio=cakeCarrierBeforeDryG>0?rinseCarrierG/cakeCarrierBeforeDryG:0,rinseRemainingFraction=cakeCarrierBeforeDryG>0?Math.exp(-rinseRatio):1,rinseRemovedFraction=cakeCarrierBeforeDryG>0?-Math.expm1(-rinseRatio):0;
 const cakeSaltG=cakeSaltBeforeRinseG*rinseRemainingFraction,rinsedSaltG=cakeSaltBeforeRinseG*rinseRemovedFraction,receiverSaltG=processedSaltG*(1-q.holdUpFraction)+rinsedSaltG,receiverCarrierBeforeDryG=processedCarrierG*(1-q.holdUpFraction)+rinseCarrierG;
 const cakeCarrierG=cakeCarrierBeforeDryG*(1-q.dryFraction),receiverCarrierG=receiverCarrierBeforeDryG*(1-q.dryFraction),cakeVapourG=cakeCarrierBeforeDryG*q.dryFraction,receiverVapourG=receiverCarrierBeforeDryG*q.dryFraction,vapourG=cakeVapourG+receiverVapourG;
 const cakeDryMaterialG=retainedSolidG+cakeSaltG,receiverDryMaterialG=receiverSaltG+passedSolidG,filterGrossG=q.filterTareG+cakeDryMaterialG+cakeCarrierG,dishGrossG=q.dishTareG+receiverDryMaterialG+receiverCarrierG;
 const feedG=feedCarrierG+feedSaltG+feedSolidG,cakeG=cakeDryMaterialG+cakeCarrierG,receiverG=receiverDryMaterialG+receiverCarrierG,initialG=carrierG+saltG+solidG+rinseCarrierG,finalG=feedG+cakeG+receiverG+vapourG;
 return{id,rinseApplicable:cakeCarrierBeforeDryG>0,saltG,solidG,carrierG,processedMl,feedCarrierG,feedSaltG,feedSolidG,processedCarrierG,processedSaltG,processedSolidG,retainedSolidG,passedSolidG,cakeCarrierBeforeDryG,cakeSaltBeforeRinseG,rinseCarrierG,rinseRatio,rinseRemainingFraction,rinseRemovedFraction,cakeSaltG,rinsedSaltG,receiverSaltG,receiverCarrierBeforeDryG,cakeCarrierG,receiverCarrierG,cakeVapourG,receiverVapourG,vapourG,cakeDryMaterialG,receiverDryMaterialG,filterGrossG,dishGrossG,feedG,cakeG,receiverG,initialG,finalG,
  filterDryGrossG:q.filterTareG+cakeDryMaterialG,dishDryGrossG:q.dishTareG+receiverDryMaterialG,
  apparentRetainedMgL:processedMl>0?cakeDryMaterialG*1e6/processedMl:null,apparentPassedMgL:processedMl>0?receiverDryMaterialG*1e6/processedMl:null,
  saltCarryoverFraction:processedSaltG>0?cakeSaltG/processedSaltG:null,solidCaptureFraction:processedSolidG>0?retainedSolidG/processedSolidG:null,
  materialResidualG:finalG-initialG,saltResidualG:feedSaltG+cakeSaltG+receiverSaltG-saltG,solidResidualG:feedSolidG+retainedSolidG+passedSolidG-solidG,carrierResidualG:feedCarrierG+cakeCarrierG+receiverCarrierG+vapourG-carrierG-rinseCarrierG,
  dryObservationReady:q.dryFraction===1&&processedMl>0};
}
export function waterImpuritiesState(raw:WaterImpuritiesInputs){const q=validateWaterImpurities(raw);return{inputs:q,cells:waterImpuritiesIds.map(id=>waterImpuritiesCell(q,id))};}
export function waterImpuritiesGuide(seconds:number,raw:WaterImpuritiesInputs){const q=validateWaterImpurities(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>150)throw new RangeError('Guide time must be0–150seconds');const supported=(x:number)=>x>0&&x<1e-12?0:x,clamp=(x:number)=>Math.max(0,Math.min(1,x)),stage=seconds<15?'prepare':seconds<55?'filter':seconds<80?'rinse':seconds<125?'dry':seconds<145?'weigh':'compare';return{stage,inputs:{...q,filteredFraction:supported(q.filteredFraction*clamp((seconds-15)/40)),rinseMl:supported(q.rinseMl*clamp((seconds-55)/25)),dryFraction:supported(q.dryFraction*clamp((seconds-80)/45))},caption:stage==='prepare'?'Compare known water, salt, suspension and mixed references. Clarity does not establish drinking safety.':stage==='filter'?'Follow the finite solution and suspended solid into the filter and receiver. Some solution stays with the filter.':stage==='rinse'?'Rinse the retained material. The selected mixed-pore-liquid reference transfers some trapped solute into the receiver; every gram of rinse water is tracked.':stage==='dry'?'Track water into a separate vapour account. The remaining nonvolatile material includes salt and any passed or retained particles. This stages drying, not a thermal or solubility prediction.':stage==='weigh'?'Lift the filter paper clear of the funnel, transfer it to its separate balance pan and wait for the weighing position. Dry composition is a forecast until the paper is on the pan.':'Subtract each dry tare. An unwashed filter can retain salt, and passed particles can contribute to dish residue. These operational residues are not certified TSS/TDS measurements.'};}

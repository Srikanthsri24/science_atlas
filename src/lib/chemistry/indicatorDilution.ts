/** CL-0099: finite water delivery to paired indicator cells.
 * Ideal strong electrolyte at25°C; nonperturbing indicator tracer.
 * Colour families are qualitative. No measured absorbance or calibrated RGB.
 */
export interface IndicatorDilutionInputs {kind:'acid'|'base';sampleMl:number;stockMolL:number;waterMl:number;orangeFraction:number;phenolFraction:number}
export const defaultIndicatorDilution:IndicatorDilutionInputs={kind:'acid',sampleMl:10,stockMolL:.01,waterMl:80,orangeFraction:0,phenolFraction:0};
export const indicatorDilutionConstants={durationS:120,kw:1e-14,indicatorMgL:1,cellWidthCm:5,cellDepthCm:2,cellRimCm:12,beamHeightCm:.5,reservoirAreaCm2:20,reservoirHeightCm:10}as const;
export function validateIndicatorDilution(raw:unknown):IndicatorDilutionInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Indicator preparation required');
 const r=raw as Record<string,unknown>;if(r.kind!=='acid'&&r.kind!=='base')throw new TypeError('Choose acid or base');
 const out={kind:r.kind}as IndicatorDilutionInputs;
 const bounds={sampleMl:[10,20],stockMolL:[.01,.1],waterMl:[0,80],orangeFraction:[0,1],phenolFraction:[0,1]}as const;
 for(const key of Object.keys(bounds)as (keyof typeof bounds)[]){const v=r[key],[lo,hi]=bounds[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${key} outside ${lo}–${hi}`);out[key]=v}return out;
}
export function indicatorDilutionState(raw:IndicatorDilutionInputs){
 const q=validateIndicatorDilution(raw),k=indicatorDilutionConstants;
 const cell=(indicator:'methyl-orange'|'phenolphthalein',test:boolean,fraction:number)=>{
  const addedWaterMl=test?q.waterMl*fraction:0,volumeMl=q.sampleMl+addedWaterMl,formalMol=q.stockMolL*q.sampleMl/1000,
   formalMolL=formalMol*1000/volumeMl,major=(formalMolL+Math.hypot(formalMolL,2*Math.sqrt(k.kw)))/2,
   hMolL=q.kind==='acid'?major:k.kw/major,ohMolL=k.kw/hMolL,pH=-Math.log10(hMolL),
   indicatorMg=k.indicatorMgL*q.sampleMl/1000,indicatorMgL=indicatorMg*1000/volumeMl,concentrationRatio=q.sampleMl/volumeMl,
   colourFamily=indicator==='methyl-orange'?(pH<3.1?'red':pH>4.4?'yellow':'transition'):(pH<8.2?'colourless':pH>10?'pink':'transition');
  return{indicator,test,addedWaterMl,volumeMl,formalMol,formalMolL,hMolL,ohMolL,pH,indicatorMg,indicatorMgL,concentrationRatio,colourFamily,
   fillHeightCm:volumeMl/(k.cellWidthCm*k.cellDepthCm),opticalPathCm:k.cellDepthCm};
 };
 const cells=[cell('methyl-orange',false,0),cell('methyl-orange',true,q.orangeFraction),cell('phenolphthalein',false,0),cell('phenolphthalein',true,q.phenolFraction)];
 const reservoirInitialMl=2*q.waterMl,reservoirRemainingMl=q.waterMl*(2-q.orangeFraction-q.phenolFraction),
  initialTotalMl=4*q.sampleMl+reservoirInitialMl,finalTotalMl=cells.reduce((s,c)=>s+c.volumeMl,0)+reservoirRemainingMl;
 return{...q,cells,reservoirInitialMl,reservoirRemainingMl,reservoirHeightCm:reservoirRemainingMl/k.reservoirAreaCm2,initialTotalMl,finalTotalMl,volumeResidualMl:finalTotalMl-initialTotalMl,initialContentsG:initialTotalMl,finalContentsG:finalTotalMl};
}
/** Choreographed additions,not empirical flow kinetics. Two independent deliveries. */
export function indicatorDilutionGuide(seconds:number,raw:IndicatorDilutionInputs){
 const q=validateIndicatorDilution(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be0–120s');
 const ramp=(start:number,end:number)=>Math.max(0,Math.min(1,(seconds-start)/(end-start)));
 const inputs={...q,orangeFraction:ramp(15,55),phenolFraction:ramp(65,105)};
 return{inputs,seconds,orangeFlow:q.waterMl>0&&seconds>15&&seconds<55,phenolFlow:q.waterMl>0&&seconds>65&&seconds<105,
  stage:seconds<15?'Inspect equal prepared aliquots':seconds<55?'Dilute methyl-orange test':seconds<65?'Compare orange pair':seconds<105?'Dilute phenolphthalein test':'Compare amount, concentration and colour family'};
}

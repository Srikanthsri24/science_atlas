/** CL-0092 original simulated balance. All mass quantities are in grams unless named kg.
 * Pseudo-normal loaded-reading variation + fixed zero offset, then display quantization.
 * Empty indication is a noiseless quantized zero check. Not a full uncertainty budget.
 */
export type BalanceResolutionG=0.01|0.1|1;
export interface RepeatMeasurementInputs{referenceMassG:number;noiseSdG:number;zeroOffsetG:number;resolutionG:BalanceResolutionG;repeats:number;seed:number}
export const defaultRepeatMeasurements:RepeatMeasurementInputs={referenceMassG:50.35,noiseSdG:.12,zeroOffsetG:.3,resolutionG:.01,repeats:6,seed:27183};
export function checkRepeatMeasurements(q:RepeatMeasurementInputs){
 for(const[k,lo,hi]of[['referenceMassG',10,100],['noiseSdG',0,1],['zeroOffsetG',-2,2],['repeats',2,20],['seed',1,1e6]]as const){if(!Number.isFinite(q[k])||q[k]<lo||q[k]>hi)throw new RangeError(`${k} must be ${lo}–${hi}`)}
 if(!Number.isInteger(q.repeats)||!Number.isInteger(q.seed))throw new RangeError('Integer repeat count and seed required');if(![.01,.1,1].includes(q.resolutionG))throw new RangeError('Display step must be0.01,0.1 or1g');
}
/** Round half away from zero; decimal conversion avoids visible binary tails and negative zero. */
export function balanceQuantize(value:number,resolution:BalanceResolutionG){if(!Number.isFinite(value)||![.01,.1,1].includes(resolution))throw new RangeError('Finite mass and supported display step required');const factor=1/resolution,x=value*factor,rounded=Math.sign(x)*Math.floor(Math.abs(x)+.5),digits=resolution===1?0:resolution===.1?1:2;return Number((rounded/factor).toFixed(digits))||0}
function compensatedSum(values:readonly number[]){let sum=0,c=0;for(const v of values){const y=v-c,t=sum+y;c=(t-sum)-y;sum=t}return sum}
export function repeatStatistics(readings:readonly number[]){
 if(readings.length>20||readings.some(x=>!Number.isFinite(x)||Math.abs(x)>1e6))throw new RangeError('Up to20 finite readings within1e6g required');
 const n=readings.length;if(n===0)return{n,sumG:0,meanG:null,minG:null,maxG:null,rangeG:null,deviationsG:[]as number[],squaredDeviationsG2:[]as number[],sumSquaresG2:null,sampleVarianceG2:null,sampleSdG:null,meanStandardUncertaintyG:null};
 const anchor=readings[0],meanG=anchor+compensatedSum(readings.map(x=>x-anchor))/n,deviationsG=readings.map(x=>(x-meanG)||0),squaredDeviationsG2=deviationsG.map(x=>x*x),sumSquaresG2=compensatedSum(squaredDeviationsG2),sampleVarianceG2=n<2?null:sumSquaresG2/(n-1),sampleSdG=sampleVarianceG2===null?null:Math.sqrt(sampleVarianceG2),minG=Math.min(...readings),maxG=Math.max(...readings);
 return{n,sumG:compensatedSum(readings),meanG,minG,maxG,rangeG:(maxG-minG)||0,deviationsG,squaredDeviationsG2,sumSquaresG2,sampleVarianceG2,sampleSdG,meanStandardUncertaintyG:sampleSdG===null?null:sampleSdG/Math.sqrt(n)};
}
/** Mulberry32 uniform mixing, then Box–Muller. Reproducible teaching samples,not laboratory data. */
function normalSamples(seed:number,n:number){let a=seed>>>0;const uniform=()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return(((t^(t>>>14))>>>0)+.5)/4294967296};return Array.from({length:n},()=>Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform()))}
export function repeatMeasurementState(q:RepeatMeasurementInputs=defaultRepeatMeasurements,recordedCount=q.repeats){
 checkRepeatMeasurements(q);if(!Number.isInteger(recordedCount)||recordedCount<0||recordedCount>q.repeats)throw new RangeError('Recorded count must be an integer in0..repeats');
 const emptyIndicationG=balanceQuantize(q.zeroOffsetG,q.resolutionG),residualOffsetG=(q.zeroOffsetG-emptyIndicationG)||0,samples=normalSamples(q.seed,q.repeats),trials=samples.map((z,i)=>{const noiseG=q.noiseSdG*z,unquantizedG=q.referenceMassG+q.zeroOffsetG+noiseG,rawG=balanceQuantize(unquantizedG,q.resolutionG),correctedG=Number((rawG-emptyIndicationG).toFixed(2))||0;return{index:i+1,z,noiseG,unquantizedG,rawG,correctedG,quantizationErrorG:(rawG-unquantizedG)||0,rawErrorG:(rawG-q.referenceMassG)||0,correctedErrorG:(correctedG-q.referenceMassG)||0}}),recorded=trials.slice(0,recordedCount),raw=repeatStatistics(recorded.map(x=>x.rawG)),corrected=repeatStatistics(recorded.map(x=>x.correctedG));
 return{...q,referenceMassKg:q.referenceMassG/1000,emptyIndicationG,residualOffsetG,trials,recorded,raw,corrected,rawMeanErrorG:raw.meanG===null?null:(raw.meanG-q.referenceMassG)||0,correctedMeanErrorG:corrected.meanG===null?null:(corrected.meanG-q.referenceMassG)||0};
}
export type RepeatGuideStage='empty'|'place'|'settle'|'record'|'remove'|'summary';
export function repeatMeasurementGuide(seconds:number,q:RepeatMeasurementInputs=defaultRepeatMeasurements){
 checkRepeatMeasurements(q);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide0–120s required');const cycleSeconds=96/q.repeats,s=repeatMeasurementState(q);let stage:RepeatGuideStage='empty',trialIndex=0,recordedCount=0,loadFraction=0;
 if(seconds>=110){stage='summary';trialIndex=q.repeats-1;recordedCount=q.repeats;loadFraction=0}else if(seconds>=14){const position=(seconds-14)/cycleSeconds;trialIndex=Math.min(q.repeats-1,Math.floor(position));const p=position-trialIndex;stage=p<.25?'place':p<.55?'settle':p<.85?'record':'remove';recordedCount=trialIndex+(p>=.55?1:0);loadFraction=stage==='place'?p/.25:stage==='remove'?1-(p-.85)/.15:1}
 loadFraction=Math.max(0,Math.min(1,loadFraction));const displayedRawG=stage==='empty'||stage==='summary'?s.emptyIndicationG:stage==='record'?s.trials[trialIndex].rawG:null,caption=stage==='empty'?'Check the empty balance before loading. A fixed zero offset can remain even when repeated loaded readings have little spread.':stage==='place'?'Place the same sealed specimen on the pan. Do not record a moving or unsettled indication.':stage==='settle'?'Wait for a settled indication. Placement timing is a staged demonstration,not a mechanical balance-response model.':stage==='record'?`Record reading ${trialIndex+1} in grams. Subtract the recorded empty indication to obtain the zero-corrected value.`:stage==='remove'?'Remove the specimen before the next repeat. Keep the specimen and preparation unchanged.':'Calculate the mean and range. Optional s/√n describes repeatability of the mean under independent-reading assumptions;it is not total uncertainty or proof of accuracy.';
 return{durationSeconds:120,cycleSeconds,stage,trialIndex,recordedCount,loadFraction,displayedRawG,caption,state:repeatMeasurementState(q,recordedCount)};
}

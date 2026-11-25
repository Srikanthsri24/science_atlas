/** Chosen first-order retained-water model, not calibrated paper/cloth measurements.
 * Retained water W = min(available water, capacity × (1 − exp(−kt))).
 * Capacity = dry mass × specific capacity. Values represent the same short drain protocol.
 * Density is approximated as 1 g/mL; swelling, evaporation, dissolution and surface droplets are excluded.
 */
export const absorptionSamples={paper:{name:'Paper sample',capacityMlPerG:3,ratePerSecond:.06},cloth:{name:'Cloth sample',capacityMlPerG:2,ratePerSecond:.025},plastic:{name:'Plastic sample',capacityMlPerG:0,ratePerSecond:0}}as const;
export type AbsorptionSample=keyof typeof absorptionSamples;
export function absorptionState(sample:AbsorptionSample,timeSeconds:number,dryMassG=2,availableMl=20){
 if(!Object.hasOwn(absorptionSamples,sample)||![timeSeconds,dryMassG,availableMl].every(Number.isFinite)||timeSeconds<0||timeSeconds>180||dryMassG<.5||dryMassG>5||availableMl<0||availableMl>30)throw new RangeError('Choose a known sample, time 0–180 s, dry mass 0.5–5 g and water 0–30 mL');
 const p=absorptionSamples[sample],capacityMl=dryMassG*p.capacityMlPerG,potentialMl=capacityMl*(-Math.expm1(-p.ratePerSecond*timeSeconds)),absorbedMl=Math.min(availableMl,potentialMl),remainingMl=availableMl-absorbedMl,densityGPerMl=1,retainedMassG=absorbedMl*densityGPerMl,wetMassG=dryMassG+retainedMassG,uptakePercent=100*retainedMassG/dryMassG;
 return{sample,timeSeconds,dryMassG,availableMl,capacityMl,absorbedMl,remainingMl,densityGPerMl,retainedMassG,wetMassG,uptakePercent,saturationFraction:capacityMl?absorbedMl/capacityMl:0};
}
export function absorptionFrame(time:number):{sample:AbsorptionSample;testTime:number;caption:string;stage:AbsorptionStage;phaseProgress:number}{
 if(!Number.isFinite(time))throw new RangeError('Finite lesson time required');
 const t=Math.max(0,Math.min(110,time)),sample:AbsorptionSample=t<45?'paper':t<70?'cloth':'plastic',local=t<45?t-20:t<70?t-45:t-70;
 const stage=t<20?'dry':t>=95?'compare':local<2?'lower':local<18?'soak':local<21?'drain':'weigh';
 const testTime=t<20?0:t>=95?60:Math.max(0,Math.min(60,(local-2)*60/16));
 const phaseProgress=stage==='lower'?local/2:stage==='soak'?(local-2)/16:stage==='drain'?(local-18)/3:stage==='weigh'?(local-21)/4:0;
 const caption=stage==='dry'?(t<10?'Identify the dry sample, water bath and balance. Start by comparing equal dry masses.':'Weigh the dry sample first. The balance reports mass in grams. Record the initial mass.'):stage==='lower'?`Lower the chosen ${sample} sample into the water bath. Keep dry mass and available water equal.`:stage==='soak'?`Soak the ${sample} sample for a modelled 60-second interval. Guide time is staged. The sample retains water according to the chosen uptake model.`:stage==='drain'?'Lift the sample and use the same short draining procedure. Loose surface droplets are excluded from the retained-water model.':stage==='weigh'?`Weigh the drained ${sample} sample. Compare wet mass with its original dry mass. The mass gain represents retained water in this model.`:'Compare mass gain and retained water separately from water passing through a hole. Absorption and waterproof barrier behaviour are different investigations.';
 return{sample,testTime,caption,stage,phaseProgress};
}
export type AbsorptionStage='dry'|'lower'|'soak'|'drain'|'weigh'|'compare';
/** Bench coordinates; the balance reads only once the specimen rests on its pan. */
export function absorptionPlacement(stage:AbsorptionStage,progress=1,bathHeight=.48){
 if(!Number.isFinite(bathHeight)||bathHeight<.13||bathHeight>1.1)throw new RangeError('Bath position is outside the apparatus');
 if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError('Movement progress must be 0–1');
 const dry=[-1.55,.83,0],bath=[1,bathHeight,0],raised=[1,1.65,0];
 const mix=(a:number[],b:number[],p:number)=>a.map((v,i)=>v+(b[i]-v)*p) as [number,number,number];
 if(stage==='dry'||stage==='compare')return{position:dry as [number,number,number],onBalance:true};
 if(stage==='lower'){const p=progress;return{position:mix(dry,bath,p).map((v,i)=>i===1?v+Math.sin(p*Math.PI)*1.2:v) as [number,number,number],onBalance:false}}
 if(stage==='soak')return{position:bath as [number,number,number],onBalance:false};
 if(stage==='drain')return{position:mix(bath,raised,Math.min(1,progress/.35)),onBalance:false};
 if(stage==='weigh'){const p=Math.min(1,progress/.45);return{position:(p===1?dry:mix(raised,dry,p).map((v,i)=>i===1?v+Math.sin(p*Math.PI)*.5:v)) as [number,number,number],onBalance:p===1}}
 throw new RangeError('Unknown workflow stage');
}

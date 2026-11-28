/** Operational soak/drain reference. The two water pools are strongly retained
 * and drainable, not measurements of molecular absorption or moisture regain.
 * All capacities and time constants are selected teaching preparations. */
export interface FibreAbsorptionInputs{dryMassG:number;bathMl:number;soakS:number;drainS:number;constructionFactor:number;retentionScale:number;wettingScale:number;panTareG:number}
export const fibreAbsorptionIds=['cotton','wool','nylon','polyester'] as const;
export type FibreAbsorptionId=typeof fibreAbsorptionIds[number];
export const fibreAbsorptionReferences={
 cotton:{strongGg:.3,drainableGg:1.2,soakTauS:30,drainTauS:12,natural:true},
 wool:{strongGg:.45,drainableGg:.8,soakTauS:90,drainTauS:20,natural:true},
 nylon:{strongGg:.08,drainableGg:1,soakTauS:40,drainTauS:10,natural:false},
 polyester:{strongGg:.02,drainableGg:1.4,soakTauS:20,drainTauS:8,natural:false}
} as const;
export const fibreAbsorptionConstants={waterDensityGml:1,balanceResolutionG:.001,balanceBoundaryAllowanceG:1e-12,durationS:120} as const;
export const defaultFibreAbsorption:FibreAbsorptionInputs={dryMassG:1,bathMl:20,soakS:120,drainS:30,constructionFactor:1,retentionScale:1,wettingScale:1,panTareG:25};
export const fibreAbsorptionBounds={dryMassG:[.2,5],bathMl:[0,50],soakS:[0,300],drainS:[0,180],constructionFactor:[.25,2],retentionScale:[0,2],wettingScale:[0,2],panTareG:[10,100]} as const;
export function validateFibreAbsorption(raw:unknown):FibreAbsorptionInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Fibre preparation required');const r=raw as Record<string,unknown>,q={} as FibreAbsorptionInputs;
 for(const k of Object.keys(fibreAbsorptionBounds)as(keyof FibreAbsorptionInputs)[]){const v=r[k],[lo,hi]=fibreAbsorptionBounds[k];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${k} must be finite in ${lo}–${hi}`);q[k]=v;}
 for(const k of ['bathMl','soakS','drainS','retentionScale','wettingScale'] as const)if(q[k]>0&&q[k]<1e-6)throw new RangeError(`${k}: nonzero settings must be at least 0.000001`);
 return q;
}
/** Three-decimal indication. A 1 pg computational boundary allowance avoids
 * binary noise at decimal half divisions; it is not balance uncertainty. */
export function fibreBalanceMilliG(g:number){if(!Number.isFinite(g)||g<0||g>150)throw new RangeError('Balance reference must be 0–150 g');return Math.floor((g+fibreAbsorptionConstants.balanceBoundaryAllowanceG)*1000+.5);}
export function fibreAbsorptionCell(raw:FibreAbsorptionInputs,id:FibreAbsorptionId){
 const q=validateFibreAbsorption(raw);if(!fibreAbsorptionIds.includes(id))throw new RangeError('Choose one of four fibre preparations');const r=fibreAbsorptionReferences[id];
 const strongCapacityG=q.dryMassG*r.strongGg*q.retentionScale,drainableCapacityG=q.dryMassG*r.drainableGg*q.constructionFactor,totalCapacityG=strongCapacityG+drainableCapacityG;
 const soakExponent=q.wettingScale*q.soakS/r.soakTauS,soakFraction=-Math.expm1(-soakExponent),unlimitedUptakeG=totalCapacityG*soakFraction,initialBathG=q.bathMl*fibreAbsorptionConstants.waterDensityGml;
 const uptakeG=Math.min(initialBathG,unlimitedUptakeG),capacityFraction=uptakeG/totalCapacityG,strongAtLiftG=strongCapacityG*capacityFraction,drainableAtLiftG=drainableCapacityG*capacityFraction;
 const drainageExponent=q.drainS/r.drainTauS,drainFraction=-Math.expm1(-drainageExponent),drainableRemainingG=drainableAtLiftG*Math.exp(-drainageExponent),drainedG=drainableAtLiftG*drainFraction;
 const retainedG=strongAtLiftG+drainableRemainingG,remainingBathG=initialBathG-uptakeG,wetCouponG=q.dryMassG+retainedG,wetAtLiftG=q.dryMassG+uptakeG;
 const dryGrossG=q.panTareG+q.dryMassG,wetGrossG=q.panTareG+wetCouponG,tareMilliG=fibreBalanceMilliG(q.panTareG),dryGrossMilliG=fibreBalanceMilliG(dryGrossG),wetGrossMilliG=fibreBalanceMilliG(wetGrossG);
 const indicatedDryG=(dryGrossMilliG-tareMilliG)/1000,indicatedWetG=(wetGrossMilliG-tareMilliG)/1000,indicatedWaterG=(wetGrossMilliG-dryGrossMilliG)/1000;
 const initialMaterialG=q.dryMassG+initialBathG,finalMaterialG=wetCouponG+remainingBathG+drainedG;
 return {id,natural:r.natural,strongReferenceGg:r.strongGg,drainableReferenceGg:r.drainableGg,soakTauS:r.soakTauS,drainTauS:r.drainTauS,strongCapacityG,drainableCapacityG,totalCapacityG,soakExponent,soakFraction,unlimitedUptakeG,initialBathG,uptakeG,capacityFraction,strongAtLiftG,drainableAtLiftG,drainageExponent,drainFraction,drainableRemainingG,drainedG,retainedG,remainingBathG,wetCouponG,wetAtLiftG,dryGrossG,wetGrossG,tareMilliG,dryGrossMilliG,wetGrossMilliG,indicatedDryG,indicatedWetG,indicatedWaterG,
  uptakeGg:uptakeG/q.dryMassG,retainedGg:retainedG/q.dryMassG,dryBasisGainPercent:100*retainedG/q.dryMassG,wetBasisWaterPercent:100*retainedG/wetCouponG,
  indicatedRetainedGg:indicatedWaterG/indicatedDryG,indicatedDryBasisGainPercent:100*indicatedWaterG/indicatedDryG,indicationErrorG:indicatedWaterG-retainedG,
  initialMaterialG,finalMaterialG,materialResidualG:finalMaterialG-initialMaterialG,waterResidualG:remainingBathG+retainedG+drainedG-initialBathG,poolResidualG:strongAtLiftG+drainableAtLiftG-uptakeG,
  bathLimited:initialBathG<unlimitedUptakeG,emptyBath:initialBathG===0};
}
export function fibreAbsorptionState(raw:FibreAbsorptionInputs){const q=validateFibreAbsorption(raw);return {inputs:q,cells:fibreAbsorptionIds.map(id=>fibreAbsorptionCell(q,id))};}
/** 120-second staging: inspect dry reference, lower, soak, lift, drain, transfer
 * to balance and interpret. Guide seconds are not the selected soak/drain time. */
export function fibreAbsorptionGuide(seconds:number,raw:FibreAbsorptionInputs){
 const q=validateFibreAbsorption(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be 0–120 seconds');
 const stage=seconds<15?'dry':seconds<25?'lower':seconds<65?'soak':seconds<75?'lift':seconds<100?'drain':seconds<110?'weigh':'interpret';
 const soak=q.soakS*Math.max(0,Math.min(1,(seconds-25)/40)),drain=q.drainS*Math.max(0,Math.min(1,(seconds-75)/25));
 const supported=(v:number)=>v>0&&v<1e-6?0:v;
 return {stage,inputs:{...q,soakS:supported(soak),drainS:supported(drain)},caption:stage==='dry'?'Tare a dry pan and record each dry coupon. Keep dry mass and the soak/drain protocol matched.':stage==='lower'?'Lower each coupon into its own finite bath. No water uptake is staged until the selected soak begins.':stage==='soak'?'Follow the selected operational uptake reference. Water leaves the finite bath and enters two retained-water accounts.':stage==='lift'?'Lift clear of the bath and move over a separate catch tray. Drainage is staged next; no dripping onto the balance.':stage==='drain'?'Drainable water enters the catch tray. Strongly retained water is held constant over this selected reference window.':stage==='weigh'?'Move the drained coupon to the dry weighing pan. Read gross mass and subtract the same tare.':'Compare retained water per gram of dry coupon. Report the protocol and construction; mass gain does not isolate molecular absorption or establish a universal natural-versus-synthetic ranking.'};
}

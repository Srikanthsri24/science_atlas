/** Selected ideal divalent sulfate displacement channel; Zn > Fe > Cu.
 * Progress is a controlled stoichiometric extent, never a measured rate law.
 * No competing corrosion, passivation, oxygen chemistry or Fe3+ channel. */
export type DisplacementMetal='Zn'|'Fe'|'Cu';
export const displacementMetals={Zn:{title:'Zinc',molarMassGMol:65.38,rank:3},Fe:{title:'Iron',molarMassGMol:55.845,rank:2},Cu:{title:'Copper',molarMassGMol:63.546,rank:1}};
export interface DisplacementInputs{coupon:DisplacementMetal;solution:DisplacementMetal;couponMassG:number;concentrationMolL:number;volumeMl:number;progress:number;contact:boolean}
export const defaultDisplacement:DisplacementInputs={coupon:'Fe',solution:'Cu',couponMassG:.5,concentrationMolL:.1,volumeMl:50,progress:0,contact:true};
const number=(x:unknown,min:number,max:number,name:string)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<min||x>max)throw new RangeError(`Invalid ${name}`);return x};
export function validateDisplacement(raw:unknown):DisplacementInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Metal displacement inputs required');const q=raw as DisplacementInputs;
 if(!Object.hasOwn(displacementMetals,q.coupon)||!Object.hasOwn(displacementMetals,q.solution))throw new RangeError('Select Zn, Fe or Cu only');if(typeof q.contact!=='boolean')throw new TypeError('Explicit contact state required');
 return{coupon:q.coupon,solution:q.solution,couponMassG:number(q.couponMassG,0,2,'coupon mass'),concentrationMolL:number(q.concentrationMolL,0,.5,'concentration'),volumeMl:number(q.volumeMl,10,100,'volume'),progress:number(q.progress,0,1,'progress'),contact:q.contact};
}
export function displacementState(raw:unknown){
 const q=validateDisplacement(raw),host=displacementMetals[q.coupon],target=displacementMetals[q.solution],volumeL=q.volumeMl/1000,couponInitialMol=q.couponMassG/host.molarMassGMol,targetInitialMol=q.concentrationMolL*volumeL,eligible=host.rank>target.rank,capacityMol=eligible?Math.min(couponInitialMol,targetInitialMol):0,extentMol=q.contact?q.progress*capacityMol:0,complete=q.contact&&q.progress===1&&eligible;
 const couponRemainingMol=complete&&couponInitialMol<=targetInitialMol?0:Math.max(0,couponInitialMol-extentMol),targetRemainingMol=complete&&targetInitialMol<=couponInitialMol?0:Math.max(0,targetInitialMol-extentMol);
 const metalIds=['Zn','Fe','Cu']as const;
 const species=metalIds.map(id=>{const initialSolidMol=id===q.coupon?couponInitialMol:0,initialBathMol=id===q.solution?targetInitialMol:0,finalSolidMol=(id===q.coupon?couponRemainingMol:0)+(id===q.solution?extentMol:0),finalBathMol=(id===q.solution?targetRemainingMol:0)+(id===q.coupon?extentMol:0);return{id,initialSolidMol,initialBathMol,finalSolidMol,finalBathMol,initialTotalMol:initialSolidMol+initialBathMol,finalTotalMol:finalSolidMol+finalBathMol,finalConcentrationMolL:finalBathMol/volumeL}});
 const couponDissolvedG=complete&&couponInitialMol<=targetInitialMol?q.couponMassG:extentMol*host.molarMassGMol,couponRemainingG=Math.max(0,q.couponMassG-couponDissolvedG),depositMassG=extentMol*target.molarMassGMol,solidAssemblyG=couponRemainingG+depositMassG,initialRelevantMetalMassG=q.couponMassG+targetInitialMol*target.molarMassGMol,finalBathMetalMassG=species.reduce((sum,x)=>sum+x.finalBathMol*displacementMetals[x.id].molarMassGMol,0),finalRelevantMetalMassG=solidAssemblyG+finalBathMetalMassG;
 const netReaction=eligible&&q.contact&&capacityMol>0;
 const limiting=!eligible?(q.coupon===q.solution?'same-metal control':'reverse-order control'):!q.contact?'no-contact control':couponInitialMol===0?'no coupon':targetInitialMol===0?'no target ions':couponInitialMol<targetInitialMol?'coupon':couponInitialMol>targetInitialMol?'solution ions':'co-limiting';
 return{inputs:q,host,target,volumeL,couponInitialMol,targetInitialMol,eligible,netReaction,capacityMol,extentMol,couponRemainingMol,targetRemainingMol,couponRemainingG,couponDissolvedG,depositMassG,solidAssemblyG,initialRelevantMetalMassG,finalBathMetalMassG,finalRelevantMetalMassG,massAccountResidualG:finalRelevantMetalMassG-initialRelevantMetalMassG,
  electronTransferMol:2*extentMol,sulfateMol:targetInitialMol,initialCationChargeEqMol:2*targetInitialMol,finalCationChargeEqMol:2*species.reduce((a,x)=>a+x.finalBathMol,0),sulfateChargeEqMol:-2*targetInitialMol,
  targetConversion:targetInitialMol>0?extentMol/targetInitialMol:null,couponConversion:couponInitialMol>0?extentMol/couponInitialMol:null,limiting,species,
  equation:eligible?`${q.coupon}(s) + ${q.solution}2+(aq) → ${q.coupon}2+(aq) + ${q.solution}(s)`:'No net selected metal-displacement reaction',
  scope:'Selected ideal Zn/Fe/Cu divalent sulfate channel; Zn > Fe > Cu. Controlled progress is stoichiometric, not kinetics or an observation-time prediction. Constant solution volume, complete dissociation and ideal limiting-reagent endpoint; competing water/acid/oxygen corrosion, passivation, Fe3+, activities, heat and morphology excluded. Zero target ions means no selected displacement, not a claim that a metal cannot react with water or air. Colour is schematic, not calibrated concentration.',
 };
}
export function displacementComparison(raw:unknown){const q=validateDisplacement(raw);return(['Zn','Fe','Cu']as const).map(coupon=>({coupon,state:displacementState({...q,coupon})}))}
export function displacementMatrix(){return(['Zn','Fe','Cu']as const).flatMap(coupon=>(['Zn','Fe','Cu']as const).map(solution=>({coupon,solution,eligible:displacementMetals[coupon].rank>displacementMetals[solution].rank})))}
export function displacementGuide(seconds:number,base:DisplacementInputs){
 number(seconds,0,150,'guide time');const q=validateDisplacement(base),stage=seconds<20?0:seconds<45?1:seconds<105?2:seconds<125?3:seconds<140?4:5,progress=seconds<=45?0:seconds<105?(seconds-45)/60:1;
 // One60s illustrative extent sweep, then endpoint/comparison; no laboratory rate claim.
 return{seconds,stage,recordable:seconds>=140,inputs:{...q,progress,contact:seconds<20?false:q.contact},title:['Predict the order','Inspect finite starting amounts','Follow the controlled displacement extent','Compare self and reverse controls','Apply mole and mass accounts','Record the conclusion'][stage]};
}

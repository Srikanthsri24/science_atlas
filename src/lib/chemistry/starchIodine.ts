/** Finite iodine/iodide test preparations plus an explicitly SELECTED apparent
 * association reference. Binding units are iodine-equivalent capacity units,
 * not glucose monomers or a fixed polyiodide molecular stoichiometry. */
export interface StarchIodineInputs{sampleMl:number;starchGL:number;iodineMmolL:number;withdrawnMl:number;deliveredMl:number;capacityMmolG:number;kdMmolL:number}
export const starchIodineIds=['starch','half-starch','glucose','water'] as const;
export type StarchIodineId=typeof starchIodineIds[number];
const I=126.90447,K=39.0983;
export const starchIodineConstants={I,K,iodineGmol:2*I,potassiumIodideGmol:K+I,iodideToIodineRatio:10,stockMl:2,preparedDensityGml:1,durationS:120} as const;
export const defaultStarchIodine:StarchIodineInputs={sampleMl:20,starchGL:1,iodineMmolL:.5,withdrawnMl:2,deliveredMl:2,capacityMmolG:.2,kdMmolL:.02};
export const starchIodineBounds={sampleMl:[5,30],starchGL:[0,5],iodineMmolL:[0,1],withdrawnMl:[0,2],deliveredMl:[0,2],capacityMmolG:[0,1],kdMmolL:[.001,1]} as const;
export function validateStarchIodine(raw:unknown):StarchIodineInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Starch/iodine preparation required');const r=raw as Record<string,unknown>,q={} as StarchIodineInputs;
 for(const key of Object.keys(starchIodineBounds)as(keyof StarchIodineInputs)[]){const n=r[key],[lo,hi]=starchIodineBounds[key];if(typeof n!=='number'||!Number.isFinite(n)||n<lo||n>hi)throw new RangeError(`${key} must be finite in ${lo}–${hi}`);q[key]=n;}
 if(q.deliveredMl>q.withdrawnMl)throw new RangeError('Delivered volume cannot exceed withdrawn volume');
 for(const key of ['starchGL','iodineMmolL','withdrawnMl','deliveredMl','capacityMmolG'] as const)if(q[key]>0&&q[key]<1e-6)throw new RangeError(`${key}: nonzero values must be at least 0.000001`);
 return q;
}
export function starchIodineCell(raw:StarchIodineInputs,id:StarchIodineId){
 const q=validateStarchIodine(raw),c=starchIodineConstants;if(!starchIodineIds.includes(id))throw new RangeError('Choose a prepared assay reference');
 const starchFraction=id==='starch'?1:id==='half-starch'?.5:0,glucoseFraction=id==='glucose'?1:id==='half-starch'?.5:0;
 const starchG=q.starchGL*q.sampleMl/1000*starchFraction,glucoseG=q.starchGL*q.sampleMl/1000*glucoseFraction,sampleCarrierG=q.sampleMl-starchG-glucoseG;
 const remainingStockMl=c.stockMl-q.withdrawnMl,pipetteMl=q.withdrawnMl-q.deliveredMl,vialMl=q.sampleMl+q.deliveredMl,iodideMmolL=c.iodideToIodineRatio*q.iodineMmolL;
 const iodineMol=(ml:number)=>q.iodineMmolL*ml/1e6,kiMol=(ml:number)=>iodideMmolL*ml/1e6;
 const initialIodineEqMol=iodineMol(c.stockMl),stockIodineEqMol=iodineMol(remainingStockMl),pipetteIodineEqMol=iodineMol(pipetteMl),vialIodineEqMol=iodineMol(q.deliveredMl);
 const initialKiMol=kiMol(c.stockMl),stockKiMol=kiMol(remainingStockMl),pipetteKiMol=kiMol(pipetteMl),vialKiMol=kiMol(q.deliveredMl);
 const carrier=(ml:number)=>ml-iodineMol(ml)*c.iodineGmol-kiMol(ml)*c.potassiumIodideGmol;
 const initialReagentCarrierG=carrier(c.stockMl),stockCarrierG=carrier(remainingStockMl),pipetteCarrierG=carrier(pipetteMl),deliveredCarrierG=carrier(q.deliveredMl);
 const capacityMol=starchG*q.capacityMmolG/1000,iodineEqMmolL=vialIodineEqMol*1e6/vialMl,capacityMmolL=capacityMol*1e6/vialMl,L=iodineEqMmolL,S=capacityMmolL,D=q.kdMmolL;
 const discriminant=(L-S)**2+2*D*(L+S)+D*D,root=Math.sqrt(discriminant),associatedMmolL=L>0&&S>0?2*L*S/(L+S+D+root):0;
 const associatedIodineEqMol=associatedMmolL*vialMl/1e6,unassociatedIodineEqMol=vialIodineEqMol-associatedIodineEqMol,unusedCapacityMol=capacityMol-associatedIodineEqMol;
 const associatedIodineEqG=associatedIodineEqMol*c.iodineGmol,unassociatedIodineEqG=unassociatedIodineEqMol*c.iodineGmol,vialKiG=vialKiMol*c.potassiumIodideGmol;
 const stockG=stockCarrierG+stockIodineEqMol*c.iodineGmol+stockKiMol*c.potassiumIodideGmol,pipetteG=pipetteCarrierG+pipetteIodineEqMol*c.iodineGmol+pipetteKiMol*c.potassiumIodideGmol;
 const vialG=sampleCarrierG+starchG+glucoseG+deliveredCarrierG+associatedIodineEqG+unassociatedIodineEqG+vialKiG,initialAccountG=q.sampleMl+c.stockMl,finalAccountG=stockG+pipetteG+vialG;
 return{id,starchFraction,glucoseFraction,starchG,glucoseG,sampleCarrierG,remainingStockMl,pipetteMl,vialMl,iodideMmolL,initialIodineEqMol,stockIodineEqMol,pipetteIodineEqMol,vialIodineEqMol,initialKiMol,stockKiMol,pipetteKiMol,vialKiMol,initialReagentCarrierG,stockCarrierG,pipetteCarrierG,deliveredCarrierG,capacityMol,iodineEqMmolL,capacityMmolL,discriminant,associatedMmolL,associatedIodineEqMol,unassociatedIodineEqMol,unusedCapacityMol,associatedIodineEqG,unassociatedIodineEqG,vialKiG,stockG,pipetteG,vialG,initialAccountG,finalAccountG,
  associatedFraction:vialIodineEqMol>0?associatedIodineEqMol/vialIodineEqMol:null,capacityOccupancy:capacityMol>0?associatedIodineEqMol/capacityMol:null,
  cue:vialIodineEqMol===0?'no-iodine-reference':associatedIodineEqMol>0?'association-reference':'reagent-colour-reference',
  associationResidualMmolL2:D*associatedMmolL-(L-associatedMmolL)*(S-associatedMmolL),materialResidualG:finalAccountG-initialAccountG,
  iodineEquivalentResidualMol:initialIodineEqMol-stockIodineEqMol-pipetteIodineEqMol-associatedIodineEqMol-unassociatedIodineEqMol,
  iodideInventoryResidualMol:initialKiMol-stockKiMol-pipetteKiMol-vialKiMol,
  iodineAtomResidualMol:2*(initialIodineEqMol-stockIodineEqMol-pipetteIodineEqMol-associatedIodineEqMol-unassociatedIodineEqMol)+initialKiMol-stockKiMol-pipetteKiMol-vialKiMol,
  potassiumAtomResidualMol:initialKiMol-stockKiMol-pipetteKiMol-vialKiMol,capacityResidualMol:capacityMol-associatedIodineEqMol-unusedCapacityMol};
}
export function starchIodineState(raw:StarchIodineInputs){const q=validateStarchIodine(raw);return{inputs:q,cells:starchIodineIds.map(id=>starchIodineCell(q,id))};}
export function starchIodineGuide(seconds:number,raw:StarchIodineInputs){
 const q=validateStarchIodine(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be 0–120 seconds');
 const supported=(v:number)=>v>0&&v<1e-6?0:v,withdrawnMl=supported(q.withdrawnMl*Math.max(0,Math.min(1,(seconds-15)/15))),deliveredMl=supported(q.deliveredMl*Math.max(0,Math.min(1,(seconds-40)/30)));
 const stage=seconds<15?'prepare':seconds<30?'withdraw':seconds<40?'position':seconds<70?'dispense':seconds<95?'mix':'interpret';
 return {stage,inputs:{...q,withdrawnMl,deliveredMl:Math.min(withdrawnMl,deliveredMl)},mixProgress:Math.max(0,Math.min(1,(seconds-70)/25)),observationReady:seconds>=95,
  caption:stage==='prepare'?'Compare prepared starch, half-starch plus glucose, glucose and water controls. The reagent contains iodine and potassium iodide.':stage==='withdraw'?'Withdraw a finite aliquot. Follow stock remaining, reagent held in the pipette and zero volume delivered.':stage==='position'?'Move the loaded pipette over the sample without dispensing. Held reagent remains separately accounted for.':stage==='dispense'?'Deliver the chosen aliquot. The association numbers are a selected, well-mixed endpoint reference—not a prediction of local colour during mixing.':stage==='mix'?'Mix the prepared references. A schematic helix-association cue explains the qualitative contrast; it does not establish one unique polyiodide structure.':'Compare the qualitative reference cue with controls. The apparent association model has selected capacity and strength; it is not a calibrated detection limit, absorbance or food-composition measurement.'};
}

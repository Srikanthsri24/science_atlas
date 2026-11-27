/** CL-0102: finite AgNO3 and NaCl stocks feeding one water-containing receiver.
 * Ideal uncomplexed-ion equilibrium at25°C. Nominal total mixture volume is additive;
 * aqueous volume excludes precipitate true material volume. Not optical/kinetic data.
 */
export interface SaltPrecipitationInputs{receiverMl:number;silverStockMl:number;chlorideStockMl:number;silverMolL:number;chlorideMolL:number;silverFraction:number;chlorideFraction:number}
export const saltPrecipitationConstants={ksp:1.8e-10,temperatureK:298.15,silverGmol:107.868,chlorideGmol:35.450,sodiumGmol:22.990,nitrateGmol:62.004,silverNitrateGmol:169.872,sodiumChlorideGmol:58.440,silverChlorideGmol:143.318,solidDensityGml:5.56,initialSolutionDensityGml:1,durationS:120}as const;
export const defaultSaltPrecipitation:SaltPrecipitationInputs={receiverMl:20,silverStockMl:30,chlorideStockMl:30,silverMolL:.01,chlorideMolL:.01,silverFraction:0,chlorideFraction:0};
export function validateSaltPrecipitation(raw:unknown):SaltPrecipitationInputs{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Two salt stocks and receiver required');const r=raw as Record<string,unknown>,q={}as SaltPrecipitationInputs,bounds={receiverMl:[20,60],silverStockMl:[10,50],chlorideStockMl:[10,50],silverMolL:[0,.02],chlorideMolL:[0,.02],silverFraction:[0,1],chlorideFraction:[0,1]}as const;for(const key of Object.keys(bounds)as(keyof typeof bounds)[]){const v=r[key],[lo,hi]=bounds[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${key} must be finite in${lo}–${hi}`);q[key]=v}return q}
export function saltPrecipitationState(raw:SaltPrecipitationInputs){const q=validateSaltPrecipitation(raw),k=saltPrecipitationConstants,
 silverInitialMol=q.silverStockMl*q.silverMolL/1000,chlorideInitialMol=q.chlorideStockMl*q.chlorideMolL/1000,
 silverDeliveredMl=q.silverStockMl*q.silverFraction,chlorideDeliveredMl=q.chlorideStockMl*q.chlorideFraction,
 silverDeliveredMol=silverInitialMol*q.silverFraction,chlorideDeliveredMol=chlorideInitialMol*q.chlorideFraction,
 silverStockRemainingMl=q.silverStockMl-silverDeliveredMl,chlorideStockRemainingMl=q.chlorideStockMl-chlorideDeliveredMl,
 silverStockRemainingMol=silverInitialMol-silverDeliveredMol,chlorideStockRemainingMol=chlorideInitialMol-chlorideDeliveredMol,
 nominalMixtureMl=q.receiverMl+silverDeliveredMl+chlorideDeliveredMl,nominalMixtureL=nominalMixtureMl/1000,
 analyticalSilverMolL=silverDeliveredMol/nominalMixtureL,analyticalChlorideMolL=chlorideDeliveredMol/nominalMixtureL,
 initialIonProduct=analyticalSilverMolL*analyticalChlorideMolL,
 minorInitialMol=Math.min(silverDeliveredMol,chlorideDeliveredMol),differenceMol=Math.abs(silverDeliveredMol-chlorideDeliveredMol),solidLPerMol=k.silverChlorideGmol/k.solidDensityGml/1000;
 let precipitateMol=0,freeSilverMol=silverDeliveredMol,freeChlorideMol=chlorideDeliveredMol;
 if(initialIonProduct>k.ksp){let lo=0,hi=minorInitialMol;for(let i=0;i<100;i++){const minor=(lo+hi)/2,extent=minorInitialMol-minor,aqueousL=nominalMixtureL-extent*solidLPerMol,product=minor*(differenceMol+minor)/aqueousL**2;if(product>k.ksp)hi=minor;else lo=minor}const minor=(lo+hi)/2;precipitateMol=Math.max(0,minorInitialMol-minor);if(silverDeliveredMol>=chlorideDeliveredMol){freeSilverMol=differenceMol+minor;freeChlorideMol=minor}else{freeSilverMol=minor;freeChlorideMol=differenceMol+minor}}
 const precipitateG=precipitateMol*k.silverChlorideGmol,solidMl=precipitateG/k.solidDensityGml,aqueousMl=nominalMixtureMl-solidMl,aqueousL=aqueousMl/1000,
 freeSilverMolL=freeSilverMol/aqueousL,freeChlorideMolL=freeChlorideMol/aqueousL,nitrateMol=silverDeliveredMol,sodiumMol=chlorideDeliveredMol,
 nitrateMolL=nitrateMol/aqueousL,sodiumMolL=sodiumMol/aqueousL,finalIonProduct=freeSilverMolL*freeChlorideMolL,
 silverInitialWaterG=q.silverStockMl-silverInitialMol*k.silverNitrateGmol,chlorideInitialWaterG=q.chlorideStockMl-chlorideInitialMol*k.sodiumChlorideGmol,
 silverStockWaterG=silverInitialWaterG*(1-q.silverFraction),chlorideStockWaterG=chlorideInitialWaterG*(1-q.chlorideFraction),
 receiverWaterG=q.receiverMl+silverInitialWaterG*q.silverFraction+chlorideInitialWaterG*q.chlorideFraction,
 receiverIonsG=freeSilverMol*k.silverGmol+freeChlorideMol*k.chlorideGmol+nitrateMol*k.nitrateGmol+sodiumMol*k.sodiumGmol,
 receiverLiquidG=receiverWaterG+receiverIonsG,initialContentsG=q.receiverMl+q.silverStockMl+q.chlorideStockMl,
 finalContentsG=silverStockRemainingMl+chlorideStockRemainingMl+receiverLiquidG+precipitateG,
 silverResidualMol=silverInitialMol-silverStockRemainingMol-freeSilverMol-precipitateMol,
 chlorideResidualMol=chlorideInitialMol-chlorideStockRemainingMol-freeChlorideMol-precipitateMol,
 sodiumResidualMol=chlorideInitialMol-chlorideStockRemainingMol-sodiumMol,
 nitrateResidualMol=silverInitialMol-silverStockRemainingMol-nitrateMol,
 chargeResidualMol=freeSilverMol+sodiumMol-freeChlorideMol-nitrateMol;
 return{...q,silverInitialMol,chlorideInitialMol,silverDeliveredMl,chlorideDeliveredMl,silverDeliveredMol,chlorideDeliveredMol,silverStockRemainingMl,chlorideStockRemainingMl,silverStockRemainingMol,chlorideStockRemainingMol,nominalMixtureMl,nominalMixtureL,analyticalSilverMolL,analyticalChlorideMolL,initialIonProduct,precipitateMol,precipitateG,solidMl,aqueousMl,aqueousL,freeSilverMol,freeChlorideMol,freeSilverMolL,freeChlorideMolL,nitrateMol,sodiumMol,nitrateMolL,sodiumMolL,finalIonProduct,silverInitialWaterG,chlorideInitialWaterG,silverStockWaterG,chlorideStockWaterG,receiverWaterG,receiverIonsG,receiverLiquidG,initialContentsG,finalContentsG,massResidualG:initialContentsG-finalContentsG,silverResidualMol,chlorideResidualMol,sodiumResidualMol,nitrateResidualMol,chargeResidualMol,volumeResidualMl:q.receiverMl+q.silverStockMl+q.chlorideStockMl-silverStockRemainingMl-chlorideStockRemainingMl-aqueousMl-solidMl,
 category:precipitateMol>0?'solid-equilibrium':silverDeliveredMol===0&&chlorideDeliveredMol===0?'water-only':silverDeliveredMol===0||chlorideDeliveredMol===0?'one-ion-missing':'no-solid',stoichiometricLimit:silverDeliveredMol===0&&chlorideDeliveredMol===0?'neither-ion-delivered':Math.abs(silverDeliveredMol-chlorideDeliveredMol)<=Math.max(silverDeliveredMol,chlorideDeliveredMol)*1e-13?'matched':silverDeliveredMol<chlorideDeliveredMol?'silver-limited':'chloride-limited'};
}
export function saltPrecipitationGuide(seconds:number,raw:SaltPrecipitationInputs){const q=validateSaltPrecipitation(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be0–120s');const ramp=(a:number,b:number)=>Math.max(0,Math.min(1,(seconds-a)/(b-a))),inputs={...q,silverFraction:ramp(10,50),chlorideFraction:ramp(60,100)};return{seconds,inputs,silverFlow:seconds>10&&seconds<50,chlorideFlow:seconds>60&&seconds<100,stage:seconds<10?'Inspect two separate stocks and the water receiver':seconds<50?(q.silverMolL===0?'Deliver a finite water-control aliquot':'Deliver a finite silver-nitrate aliquot'):seconds<60?(q.silverMolL===0?'Account for the water-control transfer':'Account for dissolved silver and nitrate before mixing'):seconds<100?(q.chlorideMolL===0?'Add the water-control aliquot and follow dilution':'Add chloride and follow the equilibrium precipitate'):'Compare limiting material,dissolved ions and mass closure'};}

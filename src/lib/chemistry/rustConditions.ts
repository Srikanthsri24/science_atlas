/** CL-0064. Chosen FeOOH-equivalent material balance, not universal rust
 * composition or measured corrosion kinetics. Four sealed reference cells
 * compare available liquid water and normal/reduced oxygen at fixed25°C.
 */
export type RustCondition='wet_oxygen'|'dry_oxygen'|'wet_reduced_oxygen'|'dry_reduced_oxygen';
export interface RustInputs {
 ironG:number;waterMl:number;chamberMl:number;oxygenFraction:number;reducedOxygenFraction:number;
 ratePerDay:number;attachedFraction:number;timeDays:number;
}
export const rustConditions:RustCondition[]=['wet_oxygen','dry_oxygen','wet_reduced_oxygen','dry_reduced_oxygen'];
export const rustConditionNames:Record<RustCondition,string>={wet_oxygen:'Water + oxygen',dry_oxygen:'Dry + oxygen',wet_reduced_oxygen:'Water + reduced oxygen',dry_reduced_oxygen:'Dry + reduced oxygen'};
export const rustReference={ironMolarG:55.845,oxygenMolarG:31.998,waterMolarG:18.015,
 productMolarG:88.851,inertMolarG:28.014,gasConstantLKPaMolK:8.314462618,
 temperatureK:298.15,temperatureC:25,initialPressureKPa:101.325,
 // Chosen rounded drawing densities, not measured specimen/phase calibration.
 ironDrawingDensityGml:8,productDrawingDensityGml:4.2,waterDrawingDensityGml:1};
export const defaultRustInputs:RustInputs={ironG:.15,waterMl:2,chamberMl:50,oxygenFraction:.21,
 reducedOxygenFraction:0,ratePerDay:.25,attachedFraction:.25,timeDays:0};
export function checkRust(q:RustInputs){
 if(!q||![q.ironG,q.waterMl,q.chamberMl,q.oxygenFraction,q.reducedOxygenFraction,q.ratePerDay,q.attachedFraction,q.timeDays].every(Number.isFinite)
  ||q.ironG<.05||q.ironG>.3||q.waterMl<.001||q.waterMl>2||q.chamberMl<25||q.chamberMl>100
  ||q.oxygenFraction<.1||q.oxygenFraction>.3||q.reducedOxygenFraction<0||q.reducedOxygenFraction>.01
  ||q.ratePerDay<.1||q.ratePerDay>.6||q.attachedFraction<0||q.attachedFraction>1||q.timeDays<0||q.timeDays>14)
  throw new RangeError('Iron0.05–0.3g,wetwater0.001–2mL,cell25–100mL,oxygen0.1–0.3,reducedoxygen0–0.01,chosenrate0.1–0.6/day,attachedfraction0–1,time0–14days required');
}
export function rustState(q:RustInputs=defaultRustInputs,condition:RustCondition='wet_oxygen'){
 checkRust(q);if(!rustConditions.includes(condition))throw new RangeError('A supported water/oxygen condition is required');
 const c=rustReference,wet=condition.startsWith('wet'),reduced=condition.includes('reduced');
 const waterInitialMl=wet?q.waterMl:0,oxygenInitialFraction=reduced?q.reducedOxygenFraction:q.oxygenFraction;
 const initialIronMol=q.ironG/c.ironMolarG,initialWaterG=waterInitialMl*c.waterDrawingDensityGml,initialWaterMol=initialWaterG/c.waterMolarG;
 const initialMetalVolumeMl=q.ironG/c.ironDrawingDensityGml;
 const initialGasVolumeMl=q.chamberMl-initialMetalVolumeMl-waterInitialMl;
 const initialGasMol=c.initialPressureKPa*(initialGasVolumeMl/1000)/(c.gasConstantLKPaMolK*c.temperatureK);
 const initialOxygenMol=initialGasMol*oxygenInitialFraction,inertMol=initialGasMol*(1-oxygenInitialFraction);
 // Per mole Fe reacted: 0.75 mol O2 and0.5mol H2O form1mol FeOOH reference.
 const ironCapacityMol=initialIronMol,oxygenCapacityMol=initialOxygenMol/.75,waterCapacityMol=initialWaterMol/.5;
 const capacityMol=Math.min(ironCapacityMol,oxygenCapacityMol,waterCapacityMol);
 const limiting=initialWaterMol===0&&initialOxygenMol===0?'water and oxygen excluded':initialWaterMol===0?'water excluded':initialOxygenMol===0?'oxygen excluded':[
  {name:'iron',value:ironCapacityMol},{name:'oxygen',value:oxygenCapacityMol},{name:'water',value:waterCapacityMol}
 ].filter(v=>v.value===capacityMol).map(v=>v.name).join(' + ');
 const tail=Math.exp(-q.ratePerDay*q.timeDays),reactedFraction=-Math.expm1(-q.ratePerDay*q.timeDays);
 const reactedIronMol=capacityMol*reactedFraction,rateIronMolDay=capacityMol*q.ratePerDay*tail;
 // Stable limiting-reagent residues, including near-complete endpoint tails.
 const ironLeftMol=Math.max(0,initialIronMol-capacityMol)+capacityMol*tail;
 const oxygenLeftMol=Math.max(0,initialOxygenMol-.75*capacityMol)+.75*capacityMol*tail;
 const waterLeftMol=Math.max(0,initialWaterMol-.5*capacityMol)+.5*capacityMol*tail;
 const ironLeftG=ironLeftMol*c.ironMolarG,oxygenLeftG=oxygenLeftMol*c.oxygenMolarG,waterLeftG=waterLeftMol*c.waterMolarG;
 const productG=reactedIronMol*c.productMolarG,attachedProductG=productG*q.attachedFraction,sedimentProductG=productG*(1-q.attachedFraction);
 const inertG=inertMol*c.inertMolarG;
 const metalVolumeMl=ironLeftG/c.ironDrawingDensityGml,attachedVolumeMl=attachedProductG/c.productDrawingDensityGml,
  sedimentVolumeMl=sedimentProductG/c.productDrawingDensityGml,waterVolumeMl=waterLeftG/c.waterDrawingDensityGml;
 const gasVolumeMl=q.chamberMl-metalVolumeMl-attachedVolumeMl-sedimentVolumeMl-waterVolumeMl;
 const gasMol=oxygenLeftMol+inertMol,pressureKPa=gasMol*c.gasConstantLKPaMolK*c.temperatureK/(gasVolumeMl/1000);
 const initialOxygenG=initialOxygenMol*c.oxygenMolarG;
 const initialTotalG=q.ironG+initialWaterG+initialOxygenG+inertG;
 const totalG=ironLeftG+attachedProductG+sedimentProductG+waterLeftG+oxygenLeftG+inertG;
 return {...q,condition,wet,reduced,waterInitialMl,oxygenInitialFraction,initialIronMol,initialWaterG,initialWaterMol,
  initialMetalVolumeMl,initialGasVolumeMl,initialGasMol,initialOxygenMol,inertMol,ironCapacityMol,oxygenCapacityMol,waterCapacityMol,
  capacityMol,limiting,tail,reactedFraction,reactedIronMol,rateIronMolDay,ironLeftMol,oxygenLeftMol,waterLeftMol,
  ironLeftG,oxygenLeftG,waterLeftG,productG,attachedProductG,sedimentProductG,inertG,
  metalVolumeMl,attachedVolumeMl,sedimentVolumeMl,waterVolumeMl,gasVolumeMl,gasMol,pressureKPa,
  oxygenMoleFraction:oxygenLeftMol/gasMol,initialOxygenG,initialTotalG,totalG,
  oxygenUsedMol:.75*reactedIronMol,waterUsedMol:.5*reactedIronMol,
  couponG:ironLeftG+attachedProductG,retainedIronContainingG:ironLeftG+productG,
  initialIronAtomsMol:initialIronMol,currentIronAtomsMol:ironLeftMol+reactedIronMol,
  initialOxygenAtomsMol:2*initialOxygenMol+initialWaterMol,currentOxygenAtomsMol:2*oxygenLeftMol+waterLeftMol+2*reactedIronMol,
  initialHydrogenAtomsMol:2*initialWaterMol,currentHydrogenAtomsMol:2*waterLeftMol+reactedIronMol,
  interpretation:'Chosen FeOOH-equivalent reference:4Fe+3O₂+2H₂O→4FeOOH. Real rust is a mixture. Chosen first-order capacity relaxation and attached/retained-sediment partition are not measured kinetics or morphology. Rigid sealed cells at25°C contain an ideal O₂/N₂ reference gas; water vapour and dissolved oxygen storage are neglected. Wetting and gas/water transport are lumped; no evaporation, pH, electrochemical-field, anaerobic-corrosion, passivation, heat or particle-settling solver. Drawing densities8/4.2/1g/mL are chosen references, not specimen measurements.'};
}
export function rustComparison(q:RustInputs=defaultRustInputs){return rustConditions.map(condition=>rustState(q,condition))}
export function rustHistory(q:RustInputs,condition:RustCondition){
 checkRust(q);return Array.from({length:61},(_,i)=>{const s=rustState({...q,timeDays:q.timeDays*i/60},condition);
  return {timeDays:s.timeDays,ironLeftG:s.ironLeftG,productG:s.productG,attachedProductG:s.attachedProductG,
   sedimentProductG:s.sedimentProductG,oxygenUsedMol:s.oxygenUsedMol,pressureKPa:s.pressureKPa,totalG:s.totalG};
 });
}
export function rustGuide(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('Finite guide time required');
 const presentationS=Math.min(120,Math.max(0,seconds)),timeDays=Math.min(14,Math.max(0,(presentationS-10)*.14));
 const samples=rustComparison({...defaultRustInputs,timeDays});
 const caption=presentationS<10?'Prepare equal iron samples in matched rigid cells. Compare available water and oxygen; the excluded-oxygen controls are ideal reference conditions.':presentationS<45?'Follow the wet, oxygen-present sample. Iron is consumed while FeOOH-equivalent product grows; the other conditions test what is missing.':presentationS<80?'Compare the material compartments: some product stays attached and some is retained as sediment. Oxygen and water supply the added atoms.':'Compare coupon mass, all iron-containing material and total sealed-cell mass. These are different measurements. The reference conserves mass; its chosen rate is not a measured rusting time prediction.';
 return {presentationS,timeDays,samples,caption};
}

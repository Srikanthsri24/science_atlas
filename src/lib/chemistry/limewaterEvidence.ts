/** CL-0098: finite carbonate/HCl source,dry gas syringe,and independent limewater receiver.
 * Receiver uses a sequential stoichiometric-limit envelope,NOT carbonate equilibrium,
 * calibrated turbidity,absorption efficiency or measured reaction kinetics.
 */
export interface LimewaterInputs{carbonateG:number;acidMl:number;acidMolL:number;limeMl:number;limeMolL:number;reactionFraction:number;transferFraction:number}
export const limewaterReference={carbonateGmol:100.086,hclGmol:36.458,calciumChlorideGmol:110.978,
 co2Gmol:44.009,waterGmol:18.015,hydroxideGmol:74.092,bicarbonateGmol:162.110,
 gasConstantLKPaMolK:8.314462618,temperatureK:298.15,pressureKPa:101.325,
 /** Nominal drawing assumptions for initial AND final solutions,not empirical final densities. */
 solutionDensityGml:1,solidDensityGml:2.71,durationS:120}as const;
export const defaultLimewater:LimewaterInputs={carbonateG:.2,acidMl:20,acidMolL:.2,limeMl:25,limeMolL:.01,reactionFraction:0,transferFraction:0};
const keys=['carbonateG','acidMl','acidMolL','limeMl','limeMolL','reactionFraction','transferFraction']as const;
const limits=[[0,.4],[10,30],[0,.3],[10,50],[0,.015],[0,1],[0,1]]as const;
export function validateLimewater(raw:unknown):LimewaterInputs{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Source and receiver preparation required');const r=raw as Record<string,unknown>,q={}as LimewaterInputs;keys.forEach((k,i)=>{const v=r[k],[lo,hi]=limits[i];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${k} must be finite in${lo}–${hi}`);q[k]=v});if(q.transferFraction>q.reactionFraction)throw new RangeError('Transferred fraction of maximum gas cannot exceed generated fraction');return q}
export function limewaterState(raw:LimewaterInputs){const q=validateLimewater(raw),c=limewaterReference;
 const carbonateInitialMol=q.carbonateG/c.carbonateGmol,hclInitialMol=q.acidMl*q.acidMolL/1000,
 maximumReactionMol=Math.min(carbonateInitialMol,hclInitialMol/2),reactedMol=maximumReactionMol*q.reactionFraction,
 carbonateRemainingMol=carbonateInitialMol-reactedMol,hclRemainingMol=hclInitialMol-2*reactedMol,
 sourceCalciumChlorideMol=reactedMol,sourceInitialWaterG=q.acidMl*c.solutionDensityGml-hclInitialMol*c.hclGmol,
 sourceWaterG=sourceInitialWaterG+reactedMol*c.waterGmol,
 sourceLiquidG=sourceWaterG+hclRemainingMol*c.hclGmol+sourceCalciumChlorideMol*c.calciumChlorideGmol,
 sourceSolidG=carbonateRemainingMol*c.carbonateGmol,generatedMol=reactedMol,
 transferredMol=maximumReactionMol*q.transferFraction,syringeMol=generatedMol-transferredMol,
 gasMl=(n:number)=>n*c.gasConstantLKPaMolK*c.temperatureK/c.pressureKPa*1000,
 limeInitialMol=q.limeMl*q.limeMolL/1000,precipitatedMol=Math.min(transferredMol,limeInitialMol),
 redissolvedMol=Math.min(Math.max(transferredMol-limeInitialMol,0),limeInitialMol),
 limeRemainingMol=limeInitialMol-precipitatedMol,precipitateMol=precipitatedMol-redissolvedMol,
 bicarbonateMol=redissolvedMol,consumedCo2Mol=precipitatedMol+redissolvedMol,
 bypassMol=Math.max(0,transferredMol-consumedCo2Mol),receiverInitialWaterG=q.limeMl*c.solutionDensityGml-limeInitialMol*c.hydroxideGmol,
 receiverWaterG=receiverInitialWaterG+(precipitatedMol-redissolvedMol)*c.waterGmol,
 receiverSolidG=precipitateMol*c.carbonateGmol,
 receiverLiquidG=receiverWaterG+limeRemainingMol*c.hydroxideGmol+bicarbonateMol*c.bicarbonateGmol,
 initialTotalG=q.carbonateG+(q.acidMl+q.limeMl)*c.solutionDensityGml,
 finalTotalG=sourceLiquidG+sourceSolidG+(syringeMol+bypassMol)*c.co2Gmol+receiverLiquidG+receiverSolidG,
 sourceLiquidMl=sourceLiquidG/c.solutionDensityGml,sourceSolidMl=sourceSolidG/c.solidDensityGml,
 receiverLiquidMl=receiverLiquidG/c.solutionDensityGml,receiverSolidMl=receiverSolidG/c.solidDensityGml,
 clearedBoundary=limeInitialMol>0&&transferredMol>=2*limeInitialMol*(1-1e-13),
 category=transferredMol===0?'untested':limeInitialMol===0?'no-lime-reagent':clearedBoundary?'cleared-envelope':redissolvedMol>0?'partly-redissolved':'precipitate-envelope',
 carbonateThresholdFraction=maximumReactionMol===0?null:limeInitialMol/maximumReactionMol,
 clearingThresholdFraction=maximumReactionMol===0?null:2*limeInitialMol/maximumReactionMol,
 sourceWaterMol=sourceWaterG/c.waterGmol,receiverWaterMol=receiverWaterG/c.waterGmol,
 initialWaterMol=(sourceInitialWaterG+receiverInitialWaterG)/c.waterGmol;
 return{...q,carbonateInitialMol,hclInitialMol,maximumReactionMol,reactedMol,carbonateRemainingMol,hclRemainingMol,
 sourceCalciumChlorideMol,sourceInitialWaterG,sourceWaterG,sourceLiquidG,sourceSolidG,
 sourceLiquidMl,sourceSolidMl,sourceFillMl:sourceLiquidMl+sourceSolidMl,
 generatedMol,transferredMol,syringeMol,generatedMl:gasMl(generatedMol),transferredMl:gasMl(transferredMol),syringeMl:gasMl(syringeMol),
 limeInitialMol,precipitatedMol,redissolvedMol,limeRemainingMol,precipitateMol,bicarbonateMol,consumedCo2Mol,bypassMol,bypassMl:gasMl(bypassMol),
 receiverInitialWaterG,receiverWaterG,receiverSolidG,receiverLiquidG,receiverLiquidMl,receiverSolidMl,
 receiverFillMl:receiverLiquidMl+receiverSolidMl,initialTotalG,finalTotalG,category,clearedBoundary,
 carbonateThresholdFraction,clearingThresholdFraction,
 peakReachable:maximumReactionMol>0&&limeInitialMol>0&&maximumReactionMol>=limeInitialMol,
 clearingReachable:maximumReactionMol>0&&limeInitialMol>0&&maximumReactionMol>=2*limeInitialMol,
 sourceMassResidualG:q.carbonateG+q.acidMl*c.solutionDensityGml-sourceLiquidG-sourceSolidG-generatedMol*c.co2Gmol,
 receiverMassResidualG:q.limeMl*c.solutionDensityGml+consumedCo2Mol*c.co2Gmol-receiverLiquidG-receiverSolidG,
 gasResidualMol:generatedMol-syringeMol-consumedCo2Mol-bypassMol,
 calciumResidualMol:carbonateInitialMol+limeInitialMol-carbonateRemainingMol-sourceCalciumChlorideMol-limeRemainingMol-precipitateMol-bicarbonateMol,
 carbonResidualMol:carbonateInitialMol-carbonateRemainingMol-syringeMol-bypassMol-precipitateMol-2*bicarbonateMol,
 chlorineResidualMol:hclInitialMol-hclRemainingMol-2*sourceCalciumChlorideMol,
 hydrogenResidualMol:hclInitialMol+2*initialWaterMol+2*limeInitialMol-hclRemainingMol-2*sourceWaterMol-2*limeRemainingMol-2*bicarbonateMol-2*receiverWaterMol,
 oxygenResidualMol:3*carbonateInitialMol+initialWaterMol+2*limeInitialMol-3*carbonateRemainingMol-sourceWaterMol-2*(syringeMol+bypassMol)-2*limeRemainingMol-3*precipitateMol-6*bicarbonateMol-receiverWaterMol,
 massResidualG:initialTotalG-finalTotalG,
 inference:category==='untested'?(generatedMol>0?'Gas is in the syringe but has not tested the receiver.':'No gas has reached the receiver. Check source reactants and generation separately.'):
 category==='no-lime-reagent'?'Gas has been delivered,but no lime reagent was prepared. A clear receiver is not a negative CO₂ identification.':
 category==='cleared-envelope'?'This ideal sequential envelope has no remaining precipitate after sufficient excess CO₂. Clearing does not mean no gas was generated.':
 category==='partly-redissolved'?'Additional CO₂ converts some precipitate into soluble bicarbonate in the teaching envelope. Some solid remains.':
 'The teaching envelope contains a white calcium-carbonate precipitate. Its schematic appearance is not calibrated turbidity.'};
}
function transferSchedule(t:number,max:number,lime:number){
 const u=Math.max(0,Math.min(60,t-42));if(max===0||lime===0||lime>=max)return{fraction:u/60,moving:u>0&&u<60};
 const peak=Math.min(1,lime/max),clear=Math.min(1,2*lime/max);
 if(u<20)return{fraction:peak*u/20,moving:u>0};if(u<30)return{fraction:peak,moving:false};
 if(u<50)return{fraction:peak+(clear-peak)*(u-30)/20,moving:clear>peak};
 return{fraction:clear+(1-clear)*(u-50)/10,moving:u<60&&clear<1};
}
export function limewaterGuide(seconds:number,raw:LimewaterInputs){const q=validateLimewater(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide seconds0–120 required');
 const maximum=Math.min(q.carbonateG/limewaterReference.carbonateGmol,q.acidMl*q.acidMolL/2000),lime=q.limeMl*q.limeMolL/1000,
 reactionFraction=Math.max(0,Math.min(1,(seconds-10)/25)),transfer=transferSchedule(seconds,maximum,lime),
 inputs={...q,reactionFraction,transferFraction:seconds<42?0:transfer.fraction},
 stage=seconds<10?'prepare':seconds<35?'generate':seconds<42?'collect':seconds<102?'test':'interpret';
 const s=limewaterState(inputs);return{inputs,stage,sourceActive:seconds>=10&&seconds<35&&maximum>0,
 receiverActive:seconds>=42&&seconds<102&&transfer.moving&&maximum>0,
 sourcePhase:(seconds*1.1)%1,receiverPhase:(seconds*.8)%1,
 caption:stage==='prepare'?'Record independent source and limewater preparations. The dry gas path is assumed pre-purged;this is not a home mixing instruction.':
 stage==='generate'?'React the finite carbonate and acid. The limiting amount sets the maximum CO₂;the syringe stores only the gas actually generated.':
 stage==='collect'?'Inspect the generated gas in the syringe before testing. Gas present in a syringe is different from gas already delivered to limewater.':
 stage==='test'?`Transfer a controlled gas aliquot. ${s.inference}`:
 `${s.inference} Compare material accounts,not a claimed optical or kinetic calibration.`};
}
export const limewaterLimitations='Sequential stoichiometric-limit teaching envelope,not aqueous carbonate equilibrium,measured absorption efficiency or calibrated turbidity. CaCO₃+2HCl→CaCl₂+CO₂+H₂O;CO₂ first precipitates CaCO₃ from limewater,then excess CO₂ can form soluble bicarbonate. Fixed ideal dry gas at25°C and101.325kPa in a pre-purged path;gas dissolution in the source,water vapour,initial air,leaks,headspace/tube holdup,piston friction and pressure transients omitted. Initial and final liquid volumes use nominal solution density1g/mL and solid drawing density2.71g/mL,not empirical final densities or measured partial molar volumes. Reaction water,remaining reagents,receiver products and bypass gas remain separate mass accounts. Displayed solid markers are equivalent-volume illustrations,not real particle count,size,settling,crystal habit or optical scattering. Guide time is staged,not a measured reaction rate;flow glyphs are annotations,not additional uncounted gas. Rounded consistent molar masses support bookkeeping. Mass totals refer to chemical contents;apparatus hardware tare is excluded. No exactpH,gas purity or unique chemical identity is inferred from a visual result. At a cleared envelope boundary,classification allows relative1e−13 floating-point tolerance;analytical quantities are retained.';

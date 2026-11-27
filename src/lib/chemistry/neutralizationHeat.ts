/** CL-0097: original ideal constant-pressure,adiabatic strong-acid/base calorimeter.
 * Both solutions and cup start at the same temperature. Complete 1:1 reaction;
 * no measured kinetics,heat of dilution,activities or environmental heat loss.
 */
export interface NeutralizationHeatInputs {
 acidMl:number;baseMl:number;acidMolL:number;baseMolL:number;
 initialC:number;cupJK:number;deliveredFraction:number;
}
export const neutralizationHeatConstants={densityGml:1,specificHeatJgK:4.184,
 /** Selected approximate teaching parameter,not a fitted experimental result. */
 reactionJmol:-57300,durationS:120} as const;
export const defaultNeutralizationHeat:NeutralizationHeatInputs={acidMl:50,baseMl:50,acidMolL:1,baseMolL:1,initialC:25,cupJK:15,deliveredFraction:0};
const keys=['acidMl','baseMl','acidMolL','baseMolL','initialC','cupJK','deliveredFraction']as const;
const bounds=[[10,100],[10,100],[.1,1],[.1,1],[20,30],[0,50],[0,1]]as const;
export function validateNeutralizationHeat(raw:unknown):NeutralizationHeatInputs {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Calorimeter preparation required');
 const r=raw as Record<string,unknown>,q={}as NeutralizationHeatInputs;
 keys.forEach((k,i)=>{const v=r[k],[lo,hi]=bounds[i];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${k} must be finite in ${lo}–${hi}`);q[k]=v});return q;
}
export function neutralizationHeatState(raw:NeutralizationHeatInputs){
 const q=validateNeutralizationHeat(raw),c=neutralizationHeatConstants;
 const deliveredMl=q.acidMl*q.deliveredFraction,reservoirMl=q.acidMl-deliveredMl,
 acidInitialMol=q.acidMl*q.acidMolL/1000,acidDeliveredMol=deliveredMl*q.acidMolL/1000,
 acidReservoirMol=reservoirMl*q.acidMolL/1000,baseInitialMol=q.baseMl*q.baseMolL/1000,
 reactedMol=Math.min(acidDeliveredMol,baseInitialMol),acidExcessMol=acidDeliveredMol-reactedMol,
 baseExcessMol=baseInitialMol-reactedMol,solutionMl=q.baseMl+deliveredMl,
 massG=solutionMl*c.densityGml,solutionJK=massG*c.specificHeatJgK,totalJK=solutionJK+q.cupJK,
 reactionJ=c.reactionJmol*reactedMol,releasedJ=-reactionJ,riseK=releasedJ/totalJK,
 temperatureC=q.initialC+riseK,solutionJ=solutionJK*riseK,cupJ=q.cupJK*riseK,
 equivalenceMl=1000*baseInitialMol/q.acidMolL,equivalenceFraction=equivalenceMl/q.acidMl,
 equivalenceReachable=equivalenceFraction<=1+1e-14,
 // Relative floating-point boundary tolerance only;analytical inventories remain exact min/subtraction.
 atEquivalence=reactedMol>0&&Math.abs(acidDeliveredMol-baseInitialMol)<=1e-13*Math.max(acidDeliveredMol,baseInitialMol),
 condition=deliveredMl===0?'not-started':atEquivalence?'stoichiometric':acidDeliveredMol<baseInitialMol?'base-excess':'acid-excess',
 correctedKJmol=reactedMol===0?null:-(solutionJ+cupJ)/(1000*reactedMol),
 solutionOnlyKJmol=reactedMol===0?null:-solutionJ/(1000*reactedMol),
 peakDeliveredMl=Math.min(q.acidMl,equivalenceMl),peakReactedMol=Math.min(peakDeliveredMl*q.acidMolL/1000,baseInitialMol),
 peakRiseK=-c.reactionJmol*peakReactedMol/((q.baseMl+peakDeliveredMl)*c.densityGml*c.specificHeatJgK+q.cupJK);
 return{...q,deliveredMl,reservoirMl,acidInitialMol,acidDeliveredMol,acidReservoirMol,baseInitialMol,
 reactedMol,acidExcessMol,baseExcessMol,solutionMl,massG,solutionJK,totalJK,reactionJ,releasedJ,riseK,
 temperatureC,solutionJ,cupJ,equivalenceMl,equivalenceFraction,equivalenceReachable,atEquivalence,
 condition,correctedKJmol,solutionOnlyKJmol,peakDeliveredMl,peakTemperatureC:q.initialC+peakRiseK,
 sodiumMol:baseInitialMol,chlorideMol:acidDeliveredMol,
 volumeResidualMl:q.acidMl+q.baseMl-reservoirMl-solutionMl,
 acidResidualMol:acidInitialMol-acidReservoirMol-reactedMol-acidExcessMol,
 baseResidualMol:baseInitialMol-reactedMol-baseExcessMol,
 chargeResidualMol:baseInitialMol+acidExcessMol-acidDeliveredMol-baseExcessMol,
 energyResidualJ:reactionJ+solutionJ+cupJ,
 inference:condition==='not-started'?'Record the common initial temperature before delivery.':
 condition==='stoichiometric'?'The delivered analytical amounts match 1:1. Warming alone would not prove this match.':
 condition==='base-excess'?'The mixture has warmed but unreacted analytical base remains.':
 'Analytical acid is in excess. Further same-initial-temperature acid increases heat capacity without releasing more neutralization heat.'};
}
export function neutralizationHeatTrace(raw:NeutralizationHeatInputs,segments=100){
 const q=validateNeutralizationHeat(raw);if(!Number.isInteger(segments)||segments<2||segments>1000)throw new RangeError('2–1000 trace segments required');
 const end=q.deliveredFraction,eq=neutralizationHeatState(q).equivalenceFraction,
 fractions=Array.from({length:segments+1},(_,i)=>end*i/segments);
 if(eq>0&&eq<end)fractions.push(eq);
 return [...new Set(fractions)].sort((a,b)=>a-b).map(deliveredFraction=>{
 const s=neutralizationHeatState({...q,deliveredFraction});return{deliveredMl:s.deliveredMl,temperatureC:s.temperatureC,releasedJ:s.releasedJ,condition:s.condition}});
}
export function neutralizationHeatGuide(seconds:number,raw:NeutralizationHeatInputs){
 const q=validateNeutralizationHeat(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide seconds0–120 required');
 const deliveredFraction=Math.max(0,Math.min(1,(seconds-16)/60)),inputs={...q,deliveredFraction};
 const stage=seconds<16?'prepare':seconds<76?'deliver':seconds<92?'stir':seconds<106?'energy':'interpret';
 const caption=stage==='prepare'?'Read the same initial temperature of the acid,base and cup. Record volumes,concentrations and cup heat capacity.':
 stage==='deliver'?'Meter colourless acid into the insulated base. Follow remaining reservoir,reacted moles and the temperature trace together.':
 stage==='stir'?'Inspect the final well-mixed reading. Rod motion is a presentation aid;the ideal calculation assumes immediate mixing at each delivered amount.':
 stage==='energy'?'The reaction releases heat to both the solution and cup. Add both positive heat accounts to balance the negative reaction heat.':
 'Compare analytical amounts before concluding equivalence. A warm solution may still contain excess acid or base;the simulated enthalpy is an input model parameter.';
 return{inputs,stage,caption,delivering:seconds>=16&&seconds<76,
 flowPhase:((seconds-16)*1.7%1+1)%1,stirAngle:seconds<16?0:(Math.min(seconds,92)-16)*2.4};
}
export const neutralizationHeatLimitations='Ideal adiabatic,constant-pressure HCl/NaOH teaching model with complete1:1 reaction and identical initial solution/cup temperatures. Selected approximate reaction enthalpy−57.3kJ/mol,density1g/mL and specific heat4.184J/(g K) are fixed model parameters,not experimentally fitted measurements. Heat of dilution,activities,temperature-dependent properties,heat exchange with air,evaporation,probe lag and measured mixing kinetics are omitted. Volume is additive and thermal expansion neglected. Analytical excess is not a calculated free-ion concentration or pH. Flow/stir/energy marks are annotations,not extra liquid or measured reaction rates. Reconstructed molar enthalpy repeats the model parameter and is not an independent experimental validation.';

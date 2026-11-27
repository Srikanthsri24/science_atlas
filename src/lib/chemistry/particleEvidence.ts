/** CL-0076. Molecular identity evidence, not a combustion-rate or mechanism model.
 * Virtual ideal-gas reference chamber at600K. Stoichiometric extent is prescribed;
 * thermostat exchanges heat without a calorimetry prediction. Physical compression
 * preserves species; the chemical comparison uses CH4+2O2 -> CO2+2H2O(g).
 */
export interface ParticleEvidenceInputs{methaneMol:number;oxygenMol:number;extentFraction:number;volumeRatio:number;operation:'physical'|'chemical'}
export const defaultParticleEvidence:ParticleEvidenceInputs={methaneMol:.01,oxygenMol:.02,extentFraction:0,volumeRatio:1,operation:'physical'};
export const particleEvidenceConstants={R:8.314462618,temperatureK:600,referencePressurePa:101325,atomicMass:{C:12.011,H:1.008,O:15.999}};
export const evidenceSpecies=['CH4','O2','CO2','H2O']as const;
export type EvidenceSpecies=typeof evidenceSpecies[number];
const atoms:Record<EvidenceSpecies,{C:number;H:number;O:number}>={CH4:{C:1,H:4,O:0},O2:{C:0,H:0,O:2},CO2:{C:1,H:0,O:2},H2O:{C:0,H:2,O:1}};
export function particleEvidenceState(q:ParticleEvidenceInputs){
 if(!q||![q.methaneMol,q.oxygenMol,q.extentFraction,q.volumeRatio].every(Number.isFinite)||q.methaneMol<.005||q.methaneMol>.02||q.oxygenMol<.005||q.oxygenMol>.06||q.extentFraction<0||q.extentFraction>1||q.volumeRatio<.5||q.volumeRatio>1.5||!['physical','chemical'].includes(q.operation))throw new RangeError('Supported finite molecular evidence preparation required');
 const c=particleEvidenceConstants,maxExtentMol=Math.min(q.methaneMol,q.oxygenMol/2),extentMol=q.operation==='chemical'?q.extentFraction*maxExtentMol:0;
 const amounts:Record<EvidenceSpecies,number>={CH4:q.methaneMol-extentMol,O2:q.oxygenMol-2*extentMol,CO2:extentMol,H2O:2*extentMol};
 const atomMoles={C:0,H:0,O:0},speciesMassG={}as Record<EvidenceSpecies,number>;
 for(const sp of evidenceSpecies){let molarMass=0;for(const element of ['C','H','O']as const){atomMoles[element]+=amounts[sp]*atoms[sp][element];molarMass+=atoms[sp][element]*c.atomicMass[element]}speciesMassG[sp]=amounts[sp]*molarMass;}
 const initialMoles=q.methaneMol+q.oxygenMol,totalMoles=Object.values(amounts).reduce((a,b)=>a+b,0),initialVolumeM3=initialMoles*c.R*c.temperatureK/c.referencePressurePa,volumeM3=initialVolumeM3*(q.operation==='physical'?q.volumeRatio:1),pressurePa=totalMoles*c.R*c.temperatureK/volumeM3;
 return{amounts,atomMoles,speciesMassG,totalMassG:Object.values(speciesMassG).reduce((a,b)=>a+b,0),totalMoles,initialVolumeM3,volumeM3,pressurePa,maxExtentMol,extentMol,newSpeciesPresent:extentMol>0,classification:extentMol>0?'Chemical conversion':'Species unchanged',note:q.operation==='physical'?'Changing ideal-gas volume changes pressure without changing molecular species.':'Prescribed stoichiometric extent,not an elementary bond mechanism or a prediction of ignition,rate,flame temperature or heat release.'};
}
/** Presentation time is not physical reaction time; trial reset is explicit. */
export function particleEvidenceGuide(seconds:number){if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Presentation0–120s');
 if(seconds<40){const t=seconds/40,volumeRatio=t<.4?1-1.25*t:t<.8?.5+2.5*(t-.4):1.5-2.5*(t-.8);return{operation:'physical' as const,volumeRatio,extentFraction:0,caption:'Move the virtual piston at fixed temperature. Spacing and pressure change, but CH₄ and O₂ remain the same species. Mechanical motion alone does not form a new substance.'};}
 if(seconds<50)return{operation:'chemical' as const,volumeRatio:1,extentFraction:0,caption:'Reset for the chemical comparison. Read the balanced equation and count C, H and O before conversion. The next sequence is stoichiometric accounting, not an elementary reaction mechanism.'};
 return{operation:'chemical' as const,volumeRatio:1,extentFraction:Math.min(1,(seconds-50)/60),caption:seconds<110?'Increase the prescribed reaction extent. Reactants decrease and CO₂ plus water vapour appear. Compare molecular identity while checking every element and total mass.':'Compare the final species inventory with the initial one. Atoms and mass are conserved; molecular identities changed. The ideal-gas mole total happens to stay constant for this equation.'};
}

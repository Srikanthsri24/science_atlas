/** CL-0061: acid/carbonate material accounting and ideal gas-syringe model.
 * Chosen extent relaxation is illustrative, not measured reaction kinetics.
 * Dry, isothermal gas; no CO2 dissolution, leaks, piston friction or pressure rise.
 */
export interface CarbonateGasInputs {
  carbonateG:number;acidMl:number;acidMolL:number;temperatureC:number;
  pressureKPa:number;rateSInv:number;timeS:number;
}
export const carbonateGasReference={carbonateMolarG:100.086,hclMolarG:36.458,
  calciumChlorideMolarG:110.978,co2MolarG:44.009,waterMolarG:18.015,
  gasConstantLKPaMolK:8.314462618,solutionDensityGml:1,flaskCapacityMl:150,tubeVolumeMl:5,carbonateDrawingDensityGml:2.71,syringeCapacityMl:200};
export const defaultCarbonateGasInputs:CarbonateGasInputs={carbonateG:.3,acidMl:20,
  acidMolL:.2,temperatureC:25,pressureKPa:101.325,rateSInv:.015,timeS:0};
export function checkCarbonateGas(q:CarbonateGasInputs) {
  if(!q||![q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS].every(Number.isFinite)
    ||q.carbonateG<0||q.carbonateG>.5||q.acidMl<10||q.acidMl>30||q.acidMolL<0||q.acidMolL>.3
    ||q.temperatureC<20||q.temperatureC>35||q.pressureKPa<90||q.pressureKPa>110
    ||q.rateSInv<.005||q.rateSInv>.03||q.timeS<0||q.timeS>600)
    throw new RangeError('Carbonate0–0.5g,acid10–30mL at0–0.3mol/L,20–35°C,90–110kPa,chosen rate0.005–0.03s⁻¹,time0–600s required');
}
export function carbonateGasState(q:CarbonateGasInputs=defaultCarbonateGasInputs) {
  checkCarbonateGas(q);const c=carbonateGasReference;
  const carbonateMol=q.carbonateG/c.carbonateMolarG,acidMol=q.acidMl/1000*q.acidMolL;
  const maximumExtentMol=Math.min(carbonateMol,acidMol/2);
  const fraction=-Math.expm1(-q.rateSInv*q.timeS),remainingFraction=Math.exp(-q.rateSInv*q.timeS);
  const extentMol=maximumExtentMol*fraction,extentRateMolS=maximumExtentMol*q.rateSInv*remainingFraction;
  const carbonateLeftMol=carbonateMol-maximumExtentMol+maximumExtentMol*remainingFraction;
  const acidLeftMol=acidMol-2*maximumExtentMol+2*maximumExtentMol*remainingFraction;
  const carbonateLeftG=carbonateLeftMol*c.carbonateMolarG,hclLeftG=acidLeftMol*c.hclMolarG;
  const calciumChlorideG=extentMol*c.calciumChlorideMolarG,co2G=extentMol*c.co2MolarG;
  const generatedWaterG=extentMol*c.waterMolarG,initialSolutionG=q.acidMl*c.solutionDensityGml;
  const initialWaterG=initialSolutionG-acidMol*c.hclMolarG,waterG=initialWaterG+generatedWaterG;
  const temperatureK=q.temperatureC+273.15,molarVolumeMl=c.gasConstantLKPaMolK*temperatureK/q.pressureKPa*1000;
  const initialSolidVolumeMl=q.carbonateG/c.carbonateDrawingDensityGml;
  const solidVolumeMl=carbonateLeftG/c.carbonateDrawingDensityGml;
  const initialDeadSpaceMl=c.flaskCapacityMl+c.tubeVolumeMl-q.acidMl-initialSolidVolumeMl;
  const deadSpaceMl=c.flaskCapacityMl+c.tubeVolumeMl-q.acidMl-solidVolumeMl;
  const liberatedSolidVolumeMl=extentMol*c.carbonateMolarG/c.carbonateDrawingDensityGml;
  const gasEquivalentMl=extentMol*molarVolumeMl;
  const syringeMl=extentMol*(molarVolumeMl-c.carbonateMolarG/c.carbonateDrawingDensityGml);
  const maximumSyringeMl=maximumExtentMol*(molarVolumeMl-c.carbonateMolarG/c.carbonateDrawingDensityGml);
  const totalGasVolumeMl=initialDeadSpaceMl+gasEquivalentMl;
  const initialAirMol=initialDeadSpaceMl/molarVolumeMl,co2MoleFraction=extentMol/(initialAirMol+extentMol);
  // Uniformly mixed gas in the syringe is a mixture; it is not pure CO2.
  const syringeCo2Mol=extentMol*syringeMl/totalGasVolumeMl,deadSpaceCo2Mol=extentMol*deadSpaceMl/totalGasVolumeMl;
  const syringeAirMol=initialAirMol*syringeMl/totalGasVolumeMl,deadSpaceAirMol=initialAirMol*deadSpaceMl/totalGasVolumeMl;
  const contentsG=carbonateLeftG+hclLeftG+calciumChlorideG+waterG+co2G;
  const limitingReagent=carbonateMol===0||acidMol===0?'no reaction':Math.abs(carbonateMol-acidMol/2)<1e-14?'stoichiometric':carbonateMol<acidMol/2?'carbonate':'acid';
  return {...q,carbonateMol,acidMol,maximumExtentMol,fraction,remainingFraction,extentMol,extentRateMolS,
    carbonateLeftMol,acidLeftMol,carbonateLeftG,hclLeftG,calciumChlorideG,co2G,generatedWaterG,
    initialSolutionG,initialWaterG,waterG,contentsG,initialContentsG:initialSolutionG+q.carbonateG,
    condensedContentsG:contentsG-co2G,temperatureK,molarVolumeMl,syringeMl,maximumSyringeMl,
    initialSolidVolumeMl,solidVolumeMl,initialDeadSpaceMl,deadSpaceMl,liberatedSolidVolumeMl,gasEquivalentMl,
    syringeRateMlS:extentRateMolS*(molarVolumeMl-c.carbonateMolarG/c.carbonateDrawingDensityGml),totalGasVolumeMl,initialAirMol,co2MoleFraction,
    syringeCo2Mol,deadSpaceCo2Mol,syringeAirMol,deadSpaceAirMol,limitingReagent,
    syringeWithinCapacity:maximumSyringeMl<=c.syringeCapacityMl,
    interpretation:'Ideal dry isothermal constant-pressure frictionless gas syringe, including initial dead-space air. Instant uniform mixing, no dissolved CO2, water vapour, leak or heat-balance model. Chosen extent relaxation is not measured kinetics. Solution drawing volume is held at initial acid volume; carbonate drawing density2.71g/mL accounts for released solid displacement. Initial air mass is unchanged and excluded from the reacting-contents mass budget.'};
}
export function carbonateGasGuide(seconds:number) {
  if(!Number.isFinite(seconds))throw new RangeError('Finite presentation time required');
  const presentationS=Math.min(120,Math.max(0,seconds));
  const timeS=presentationS<=10?0:presentationS>=110?300:(presentationS-10)*3;
  return {...carbonateGasState({...defaultCarbonateGasInputs,timeS}),presentationS,
    caption:presentationS<10?'Prepare carbonate and dilute acid in a closed virtual apparatus connected to a freely moving gas syringe.':timeS<150?'Follow bubbles, shrinking carbonate and syringe expansion. The syringe contains a mixture with initial air, not pure carbon dioxide.':'Compare gas volume with the limiting reagent. Account for the remaining acid, carbonate, salt, water and carbon dioxide; the chosen model retains a finite reaction tail.'};
}

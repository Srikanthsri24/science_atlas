/** CL-0035: two separate vessels, not salt added to melting ice.
 * Ice starts at its melting point; the ideal sample is well mixed and has
 * negligible vessel heat capacity. A maintained 25 °C bath supplies heat
 * through a chosen, constant overall conductance. NaCl dissolves in a
 * separate, temperature-held 25 °C water sample under a chosen lumped law.
 * No calibrated dissolution kinetics, freezing-point depression, solution
 * volume, solution enthalpy or resolved convection is claimed.
 */
export const meltingDissolvingReference = {
  bathC:25, iceMeltingC:0, fusionJG:333.5, liquidHeatJGK:4.18,
  saltCapacityGPer100GWater:36,
  stillRateS:.004, stirredRateS:.012,
  iceDensityGCm3:.917, saltDensityGCm3:2.16,
} as const;

export type MeltingDissolvingInput = {
  sampleG:number; solventG:number; conductanceWK:number; stirred:boolean; timeS:number;
};

export function meltingDissolvingState(sampleG=10,solventG=100,conductanceWK=.3,stirred=true,timeS=0){
  if(![sampleG,solventG,conductanceWK,timeS].every(Number.isFinite)||sampleG<5||sampleG>20||solventG<20||solventG>150||conductanceWK<0||conductanceWK>.4||typeof stirred!=='boolean'||timeS<0||timeS>900)throw new RangeError('Sample5–20g, solvent20–150g, conductance0–0.4W/K, boolean stirring and time0–900s required');
  const r=meltingDissolvingReference,initialHeatRateW=conductanceWK*r.bathC,
    meltEndS=initialHeatRateW===0?null:sampleG*r.fusionJG/initialHeatRateW,
    moltenG=meltEndS===null?0:Math.min(sampleG,initialHeatRateW*timeS/r.fusionJG),
    iceG=Math.max(0,sampleG-moltenG),warmingS=meltEndS===null?0:Math.max(0,timeS-meltEndS),
    thermalDecayS=conductanceWK/(sampleG*r.liquidHeatJGK),
    waterC=r.bathC*-Math.expm1(-thermalDecayS*warmingS),
    latentJ=moltenG*r.fusionJG,sensibleJ=sampleG*r.liquidHeatJGK*waterC,
    inputHeatJ=latentJ+sensibleJ,heatRateW=conductanceWK*(r.bathC-waterC),
    capacityG=solventG*r.saltCapacityGPer100GWater/100,
    targetDissolvedG=Math.min(sampleG,capacityG),rateS=stirred?r.stirredRateS:r.stillRateS,
    dissolvedG=targetDissolvedG*-Math.expm1(-rateS*timeS),saltSolidG=sampleG-dissolvedG,
    dissolvedRateGS=rateS*(targetDissolvedG-dissolvedG),
    eventualResidualG=Math.max(0,sampleG-capacityG),
    solutionG=solventG+dissolvedG,solutionSaltMassPercent=100*dissolvedG/solutionG,
    saltGPer100GWater=100*dissolvedG/solventG;
  return {sampleG,solventG,conductanceWK,stirred,timeS,meltEndS,initialHeatRateW,
    moltenG,iceG,waterC,latentJ,sensibleJ,inputHeatJ,heatRateW,
    capacityG,targetDissolvedG,rateS,dissolvedG,saltSolidG,dissolvedRateGS,eventualResidualG,
    solutionG,solutionSaltMassPercent,saltGPer100GWater,
    meltFraction:moltenG/sampleG,dissolvedFraction:dissolvedG/sampleG,
    targetProgress:targetDissolvedG===0?0:dissolvedG/targetDissolvedG,
    meltWaterAccountedG:iceG+moltenG,
    dissolvingMatterAccountedG:solventG+dissolvedG+saltSolidG,
    iceVolumeCm3:iceG/r.iceDensityGCm3,
    // Volume of undissolved compact solid only. No additive solution volume.
    saltSolidVolumeCm3:saltSolidG/r.saltDensityGCm3,
  };
}

export function meltingDissolvingWorked(sampleG=10,solventG=100,conductanceWK=.3,stirred=true,timeS=0){
  const s=meltingDissolvingState(sampleG,solventG,conductanceWK,stirred,timeS),r=meltingDissolvingReference,
    n=(x:number,d=6)=>x!==0&&Math.abs(x)<10**-d?x.toExponential(d):x.toFixed(d);
  const thermal=s.meltEndS===null
    ?'H=0 W/K: no supplied heat in this ideal control; the ice remains at 0 °C. There is no finite melting-completion time.'
    :`Initial heating power=H(25−0)=${n(conductanceWK,3)}×25=${n(s.initialHeatRateW)} W. Full-melt time=mL/P=${sampleG}×333.5/${n(s.initialHeatRateW)}=${n(s.meltEndS)} s. Melted mass=min(m,Pt/L)=min(${sampleG},${n(s.initialHeatRateW)}×${n(timeS)}/333.5)=${n(s.moltenG)} g. ${timeS<=s.meltEndS?'While ice and liquid coexist, sample temperature stays 0 °C in this equilibrium model.':`After melting, Δt=${n(timeS-s.meltEndS)} s and T=25[1−exp(−HΔt/(mcp))]=25[1−exp(−${n(conductanceWK,3)}×${n(timeS-s.meltEndS)}/(${sampleG}×4.18))]=${n(s.waterC)} °C.`}`;
  return `${thermal} Latent energy=m_melted×333.5=${n(s.moltenG)}×333.5=${n(s.latentJ)} J. Sensible energy=m×4.18×T=${sampleG}×4.18×${n(s.waterC)}=${n(s.sensibleJ)} J. Heat supplied=latent+sensible=${n(s.inputHeatJ)} J. Current heat rate=H(25−T)=${n(conductanceWK,3)}(25−${n(s.waterC)})=${n(s.heatRateW)} W. Ice mass closure:${n(s.iceG)}+${n(s.moltenG)}=${sampleG} g. In the separate 25 °C dissolving vessel, reference capacity=36 g/100 g water×${solventG} g water=${n(s.capacityG)} g. Target=min(${sampleG},${n(s.capacityG)})=${n(s.targetDissolvedG)} g. Chosen ${stirred?'stirred':'still'} rate k=${n(s.rateS)} s⁻¹. Dissolved mass=target[1−exp(−kt)]=${n(s.targetDissolvedG)}[1−exp(−${n(s.rateS)}×${n(timeS)})]=${n(s.dissolvedG)} g. Undissolved salt=${sampleG}−${n(s.dissolvedG)}=${n(s.saltSolidG)} g. Dissolving rate=k(target−dissolved)=${n(s.rateS)}(${n(s.targetDissolvedG)}−${n(s.dissolvedG)})=${n(s.dissolvedRateGS)} g/s. Eventual residual=max(0,m−capacity)=${n(s.eventualResidualG)} g; the exponential approaches its target asymptotically. Solution mass=water+dissolved salt=${solventG}+${n(s.dissolvedG)}=${n(s.solutionG)} g. Salt per100 g WATER=100×${n(s.dissolvedG)}/${solventG}=${n(s.saltGPer100GWater)} g; salt mass percent of SOLUTION=100×${n(s.dissolvedG)}/${n(s.solutionG)}=${n(s.solutionSaltMassPercent)}%. Total matter=${solventG}+${n(s.dissolvedG)}+${n(s.saltSolidG)}=${n(s.dissolvingMatterAccountedG)} g. Dissolved salt is dispersed as ions in water; it has not become molten salt. Kinetics and conductance are chosen teaching assumptions. The bath supplies melting heat and holds solution temperature; no solution-enthalpy or complete heat-flow field is solved. Rounded substitutions are a teacher extension.`;
}

export function meltingDissolvingGuide(t:number){
  if(!Number.isFinite(t)||t<0||t>110)throw new RangeError('Guide time0–110s required');
  const timeS=Math.max(0,Math.min(900,(t-10)*11.25)),s=meltingDissolvingState(10,100,.3,true,timeS);
  const caption=t<10?'Compare two separate vessels: 10 g ice initially at 0 °C, and 10 g salt in 100 g water at 25 °C. Predict what remains after each visible solid changes.'
    :t<45?'The ice absorbs heat and changes phase into liquid water. While both phases coexist, its temperature stays at the melting point. In the other vessel, salt disperses as ions through water; it is not molten salt.'
    :t<90?'Follow both mass balances. After all ice melts, its water warms toward the maintained bath temperature. Dissolved salt still contributes to solution mass. Stirring changes this chosen rate, not the 25 °C reference capacity.'
    :'Melting produces the liquid phase of the same substance. Dissolving forms a solution with a solvent. Neither process makes matter disappear. Compare no supplied heat, still water and too little solvent; use the observations to explain each difference.';
  return{sampleG:10,solventG:100,conductanceWK:.3,stirred:true,timeS,caption,state:s};
}

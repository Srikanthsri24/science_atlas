/** CL-0057: relative optical comparison, NOT an NTU/FNU calibration or safety test.
 * Homogeneous upper optical compartment, exponential settling to a retained bed.
 * Beer–Lambert direct attenuation; illustrative single-scatter 90° collection.
 * Multiple scattering, colour spectra, particle-size distributions and sensor
 * calibration are outside this chosen teaching model.
 */
export interface WaterTurbidityInputs {
  initialSuspendedMgL:number;
  settlingRateSInv:number;
  colourAbsorptionMInv:number;
  dilutionFactor:number;
  pathCm:number;
  sourceMw:number;
  timeS:number;
}
export const turbidityReference={cellVolumeMl:100,scatteringMInvPerMgL:.1,waterAbsorptionMInv:.02,collectionFraction:.01};
export const defaultWaterTurbidityInputs:WaterTurbidityInputs={initialSuspendedMgL:80,settlingRateSInv:.002,colourAbsorptionMInv:0,dilutionFactor:1,pathCm:5,sourceMw:5,timeS:0};
export const waterTurbiditySamples={
  blank:{title:'Reference blank',initialSuspendedMgL:0,settlingRateSInv:0,colourAbsorptionMInv:0},
  fine:{title:'Slow-settling suspension',initialSuspendedMgL:80,settlingRateSInv:.002,colourAbsorptionMInv:0},
  coarse:{title:'Faster-settling suspension',initialSuspendedMgL:80,settlingRateSInv:.015,colourAbsorptionMInv:0},
  coloured:{title:'Dissolved-colour comparison',initialSuspendedMgL:0,settlingRateSInv:0,colourAbsorptionMInv:5}
} as const;
export type WaterTurbiditySample=keyof typeof waterTurbiditySamples;
export function checkWaterTurbidity(q:WaterTurbidityInputs){
  if(!q||!Object.values(q).every(v=>typeof v==='number'&&Number.isFinite(v))||
    ![q.initialSuspendedMgL,q.settlingRateSInv,q.colourAbsorptionMInv,q.dilutionFactor,q.pathCm,q.sourceMw,q.timeS].every(Number.isFinite)||
    q.initialSuspendedMgL<0||q.initialSuspendedMgL>200||q.settlingRateSInv<0||q.settlingRateSInv>.02||q.colourAbsorptionMInv<0||q.colourAbsorptionMInv>10||q.dilutionFactor<1||q.dilutionFactor>10||q.pathCm<1||q.pathCm>10||q.sourceMw<1||q.sourceMw>10||q.timeS<0||q.timeS>300)
    throw new RangeError('Suspension0–200mg/L,settling0–0.02s⁻¹,colour0–10m⁻¹,dilution1–10,path1–10cm,source1–10mW,time0–300s required');
}
export function waterTurbidityState(q:WaterTurbidityInputs=defaultWaterTurbidityInputs){
  checkWaterTurbidity(q);const r=turbidityReference,pathM=q.pathCm/100,volumeL=r.cellVolumeMl/1000,
    aliquotMl=r.cellVolumeMl/q.dilutionFactor,blankAddedMl=r.cellVolumeMl-aliquotMl,
    dilutedInitialMgL=q.initialSuspendedMgL/q.dilutionFactor,
    suspendedFraction=Math.exp(-q.settlingRateSInv*q.timeS),settledFraction=-Math.expm1(-q.settlingRateSInv*q.timeS),
    suspendedMgL=dilutedInitialMgL*suspendedFraction,
    initialParticleMg=dilutedInitialMgL*volumeL,suspendedParticleMg=initialParticleMg*suspendedFraction,
    settledParticleMg=initialParticleMg*settledFraction,
    scatteringMInv=r.scatteringMInvPerMgL*suspendedMgL,
    absorptionMInv=q.colourAbsorptionMInv/q.dilutionFactor,
    extinctionMInv=scatteringMInv+absorptionMInv+r.waterAbsorptionMInv,
    sampleOpticalDepth=(scatteringMInv+absorptionMInv)*pathM,totalOpticalDepth=extinctionMInv*pathM,
    blankTransmission=Math.exp(-r.waterAbsorptionMInv*pathM),
    relativeTransmission=Math.exp(-sampleOpticalDepth),
    directMw=q.sourceMw*Math.exp(-totalOpticalDepth),blankDirectMw=q.sourceMw*blankTransmission,
    directLossMw=q.sourceMw*(-Math.expm1(-totalOpticalDepth)),
    sideFraction=r.collectionFraction*scatteringMInv*pathM*Math.exp(-totalOpticalDepth),
    sideMw=q.sourceMw*sideFraction,
    sideRelativeToBlank=sideFraction/blankTransmission,
    opticalDensity=sampleOpticalDepth/Math.LN10,
    currentSettlingMgS=q.settlingRateSInv*suspendedParticleMg;
  return{...q,pathM,volumeL,aliquotMl,blankAddedMl,dilutedInitialMgL,suspendedFraction,settledFraction,suspendedMgL,initialParticleMg,suspendedParticleMg,settledParticleMg,particleAccountedMg:suspendedParticleMg+settledParticleMg,scatteringMInv,absorptionMInv,extinctionMInv,sampleOpticalDepth,totalOpticalDepth,blankTransmission,relativeTransmission,relativeTransmissionPct:100*relativeTransmission,directMw,blankDirectMw,directLossMw,sideFraction,sideMw,sideRelativeToBlank,sideRelativeToBlankPct:100*sideRelativeToBlank,opticalDensity,currentSettlingMgS,
    sideResponseRegime:sampleOpticalDepth>1?'Attenuation can reduce the side signal: do not rank cloudiness from this signal alone.':'Thin-to-moderate reference: compare matched path, dilution, colour and elapsed time.',
    interpretation:'Relative optical model only; no NTU/FNU calibration or drinking-safety conclusion.'};
}
export function waterTurbidityPair(q:WaterTurbidityInputs=defaultWaterTurbidityInputs){
  return{slow:waterTurbidityState({...q,initialSuspendedMgL:80,settlingRateSInv:.002,colourAbsorptionMInv:0}),fast:waterTurbidityState({...q,initialSuspendedMgL:80,settlingRateSInv:.015,colourAbsorptionMInv:0})};
}
export function waterTurbidityGuide(seconds:number){
  if(!Number.isFinite(seconds))throw new RangeError('Finite presentation seconds required');const presentationS=Math.max(0,Math.min(120,seconds)),timeS=presentationS<=10?0:presentationS>=100?180:(presentationS-10)*2,pair=waterTurbidityPair({...defaultWaterTurbidityInputs,timeS});
  return{presentationS,timeS,...pair,phase:presentationS<10?'setup':presentationS<100?'settling':'comparison',caption:presentationS<10?'Prepare equal 100 mL samples, equal starting suspension and the same light path. Record the blank before comparing.':presentationS<45?'Particles move out of the upper optical compartment into the retained bed. Compare direct and right-angle light under matched conditions.':presentationS<100?'The faster-settling sample has less suspended material in the beam. The particles remain in its bed; they have not vanished.':'Compare both samples at 180 physical seconds. Relative clarity describes this optical test; it does not establish drinking safety or a calibrated turbidity unit.'};
}

/** Illustrative narrowband slab: chosen coefficients, forward scattering only.
 * Not calibrated material data, a refraction solver, or full multiple-scattering transport.
 * Absorption and scattering coefficients use mm⁻¹; incoming radiant power uses W.
 */
export const opticalSamples={
 clear:{name:'Clear sample',reflectance:.04,absorptionPerMm:.01,forwardScatterPerMm:.001},
 frosted:{name:'Frosted sample',reflectance:.08,absorptionPerMm:.04,forwardScatterPerMm:1.2},
 opaque:{name:'Opaque sample',reflectance:.15,absorptionPerMm:2,forwardScatterPerMm:.5},
}as const;
export type OpticalSample=keyof typeof opticalSamples;
export function transparencyState(sample:OpticalSample,thicknessMm:number,incomingWatts:number){
 if(!Object.hasOwn(opticalSamples,sample)||!Number.isFinite(thicknessMm)||!Number.isFinite(incomingWatts)||thicknessMm<0||thicknessMm>10||incomingWatts<0||incomingWatts>5)throw new RangeError('Choose a known sample, thickness 0–10 mm and radiant power 0–5 W');
 const s=opticalSamples[sample],reflection=thicknessMm===0?0:s.reflectance,transmittedFraction=(1-reflection)*Math.exp(-s.absorptionPerMm*thicknessMm),diffuseFraction=transmittedFraction*(-Math.expm1(-s.forwardScatterPerMm*thicknessMm)),directFraction=transmittedFraction-diffuseFraction,absorbedFraction=1-reflection-transmittedFraction;
 return{incomingWatts,reflectedWatts:incomingWatts*reflection,absorbedWatts:incomingWatts*absorbedFraction,directWatts:incomingWatts*directFraction,diffuseWatts:incomingWatts*diffuseFraction,transmittedWatts:incomingWatts*transmittedFraction,transmittedFraction,directFraction,diffuseFraction,absorbedFraction,reflectedFraction:reflection};
}
/** 100-second lesson: apparatus, three controlled comparisons, then conclusions. */
export function transparencyFrame(time:number){
 if(!Number.isFinite(time))throw new RangeError('Finite timeline required');
 const t=Math.max(0,Math.min(100,time));
 const sample:OpticalSample=t<35?'clear':t<60?'frosted':'opaque';
 const caption=t<10?'Identify the source, sample holder and receiving screen. Follow light from the source, through the sample, toward the screen.':t<35?'Clear sample: most transmitted light remains directed. A sharp pattern is possible.':t<60?'Frosted sample: light still passes through, but scattering spreads it. Brightness does not mean a clear image.':t<85?'Opaque sample: at this thickness, almost no light reaches the screen. Reflection and absorption account for the rest.':'Compare equal thickness and source power. Record transmission and image clarity separately. These are illustrative samples, not measured materials.';
 return{sample,caption,thicknessMm:5,incomingWatts:t<10?Math.max(0,t/10):1};
}

/** Five narrated windows: preparation, condensation, alignment, separation, daughter formation. */
export function mitosisGuidedProgress(seconds:number){const t=Math.max(0,Math.min(100,seconds)),i=Math.min(4,Math.floor(t/20)),u=Math.min(1,t/20-i),starts=[0,10,20,40,60],ends=[10,20,40,60,99.999];return starts[i]+(ends[i]-starts[i])*Math.min(.99999,u)}

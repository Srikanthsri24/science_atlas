/** Map the five narrated fertilization windows into one ordered six-second model cycle. */
export function flowerGuidedTime(seconds:number){const t=Math.max(0,Math.min(100,seconds)),i=Math.min(4,Math.floor(t/20)),u=Math.min(.99999,t/20-i),starts=[0,.65,.85,.9,.95],ends=[.65,.84,.9,.95,.999];return 6*(starts[i]+(ends[i]-starts[i])*u)}

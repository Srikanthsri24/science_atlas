/** Original axisymmetric reference vessel;not calibrated commercial glassware. */
export const funnelShape={heightCm:12,radiusAmplitudeCm:3.4,maximumRadiusCm:Math.sqrt(.25**2+3.4**2),neckRadiusCm:.25};
export function funnelAreaCm2(h:number){if(!Number.isFinite(h)||h<0||h>12)throw new RangeError('Funnel height0–12cm');return Math.PI*(.25**2+3.4**2*Math.sin(Math.PI*h/12)**2)}
export function funnelVolumeMl(h:number){if(!Number.isFinite(h)||h<0||h>12)throw new RangeError('Funnel height0–12cm');return Math.PI*.25**2*h+Math.PI*3.4**2*(h/2-12*Math.sin(2*Math.PI*h/12)/(4*Math.PI))}
export const funnelCapacityMl=funnelVolumeMl(12);
export function funnelHeightCm(volume:number){if(!Number.isFinite(volume)||volume<0||volume>funnelCapacityMl)throw new RangeError('Volume outside reference funnel');if(volume===0)return 0;if(volume===funnelCapacityMl)return 12;let lo=0,hi=12;for(let i=0;i<55;i++){const mid=(lo+hi)/2;if(funnelVolumeMl(mid)<volume)lo=mid;else hi=mid}return(lo+hi)/2}

export function funnelRadiusCm(h:number){return Math.sqrt(funnelAreaCm2(h)/Math.PI)}

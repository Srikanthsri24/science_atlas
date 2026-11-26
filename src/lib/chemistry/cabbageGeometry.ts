import {cabbageState,cabbageReference,type CabbageInputs,type CabbageSample} from './cabbageIndicator';
export type CabbageVector=[number,number,number];
const sides=128,unitArea=sides*Math.sin(2*Math.PI/sides)/2;
export const cabbageApparatus={sides,vesselRadiusCm:2,vesselHeightCm:4,bottomY:1,
  vesselAreaCm2:unitArea*4,reservoirRadiusCm:.55,reservoirAreaCm2:unitArea*.55**2,
  reservoirHeightCm:1.8,nozzleGapCm:.35,stations:{acid:-7,neutral:0,base:7}};
function signedVolume(v:number[]) {
  let sum=0;for(let i=0;i<v.length;i+=9){const [ax,ay,az,bx,by,bz,cx,cy,cz]=v.slice(i,i+9);
    sum+=(ax*(by*cz-bz*cy)+ay*(bz*cx-bx*cz)+az*(bx*cy-by*cx))/6}
  return sum;
}
/** Closed UV reference surface, normalized by its actual triangle volume.
 * Small triangulation correction preserves volume; mesh radius is disclosed
 * separately from the equivalent analytical sphere radius. */
const unitDrop=(()=>{
  const out:number[]=[],segments=32,stacks=24;
  const point=(j:number,i:number):CabbageVector=>{const phi=Math.PI*j/stacks,theta=2*Math.PI*i/segments;
    return [Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta)]};
  for(let j=0;j<stacks;j++)for(let i=0;i<segments;i++){
    const a=point(j,i),b=point(j+1,i),c=point(j+1,i+1),d=point(j,i+1);
    if(j>0)out.push(...a,...d,...b);if(j<stacks-1)out.push(...d,...c,...b);
  }
  if(signedVolume(out)<0)for(let i=0;i<out.length;i+=9){const b=out.slice(i+3,i+6);out.splice(i+3,3,...out.slice(i+6,i+9));out.splice(i+6,3,...b)}
  return {vertices:out,volume:signedVolume(out)};
})();
export function cabbageDropDimensions(volumeMl:number) {
  if(!Number.isFinite(volumeMl)||volumeMl<0)throw new RangeError('Nonnegative drop volume required');
  return {equivalentRadiusCm:Math.cbrt(3*volumeMl/(4*Math.PI)),meshRadiusCm:Math.cbrt(volumeMl/unitDrop.volume)};
}
export function cabbageDropTriangles(volumeMl:number) {
  const r=cabbageDropDimensions(volumeMl).meshRadiusCm;
  return volumeMl===0?[]:unitDrop.vertices.map(v=>v*r);
}
export function cabbageGeometry(q:CabbageInputs,sample:CabbageSample) {
  const s=cabbageState(q,sample),a=cabbageApparatus,d=cabbageDropDimensions(s.dropMl);
  const liquidDepthCm=s.vesselMl/a.vesselAreaCm2,liquidSurfaceY=a.bottomY+liquidDepthCm;
  const nozzleY=liquidSurfaceY+100*cabbageReference.fallHeightM+2*d.meshRadiusCm;
  const reservoirBottomY=nozzleY+a.nozzleGapCm;
  return {...s,...d,stationX:a.stations[sample],liquidDepthCm,liquidSurfaceY,nozzleY,
    reservoirBottomY,reservoirDepthCm:s.reservoirMl/a.reservoirAreaCm2,
    dropCentres:s.inFlight.map(drop=>({...drop,centreY:liquidSurfaceY+d.meshRadiusCm+drop.heightAboveSurfaceCm})),
    geometryNote:'128-sided calibrated vessel/reservoir. Volume-normalized triangular drops; mesh radius differs slightly from equivalent sphere radius. Height-controlled dispenser follows the liquid surface between releases; flight/instant coalescence are idealized.'};
}
export function cabbageHistory(q:CabbageInputs,sample:CabbageSample) {
  const s=cabbageState(q,sample),times=new Set([0,q.timeS]);
  for(let i=0;i<q.drops;i++)for(const t of [2+i*q.intervalS,2+i*q.intervalS+s.flightS])
    if(t<=q.timeS){times.add(t);if(t>1e-6)times.add(t-1e-6)}
  for(let i=1;i<61;i++)times.add(Math.min(q.timeS,q.timeS*i/61));
  return [...times].sort((a,b)=>a-b).map(timeS=>{const s=cabbageState({...q,timeS},sample);
    return {timeS,vesselPigmentMg:s.vesselPigmentMg,reservoirPigmentMg:s.reservoirPigmentMg,
      inFlightPigmentMg:s.inFlightPigmentMg,arrivedMl:s.arrivedMl,concentrationMgMl:s.concentrationMgMl,opacity:s.opacity}});
}

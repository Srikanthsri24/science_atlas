import {neutralizationState,neutralizationReference as c,neutralizationUnitDropVolume,
 neutralizationBuretteArea,neutralizationVesselArea,type NeutralizationInputs} from './neutralization';
export type NeutralizationVector=[number,number,number];
export const neutralizationApparatus={sides:128,vesselRadiusCm:2.5,vesselBottomY:1.5,vesselHeightCm:5.5,
 barrelRadiusCm:.8,barrelBottomY:7.35,barrelHeightCm:50/neutralizationBuretteArea,standX:4.2,standHeight:35};
const dropVertices=(()=>{const out:number[]=[];const point=(j:number,i:number):NeutralizationVector=>{
 const p=Math.PI*j/24,t=2*Math.PI*i/32;return[Math.sin(p)*Math.cos(t),Math.cos(p),Math.sin(p)*Math.sin(t)]};
 for(let j=0;j<24;j++)for(let i=0;i<32;i++){
  const a=point(j,i),b=point(j+1,i),d=point(j,i+1),e=point(j+1,i+1);
  if(j>0)out.push(...a,...d,...b);if(j<23)out.push(...d,...e,...b);
 }return out})();
export function neutralizationDropTriangles(volumeMl:number){
 if(!Number.isFinite(volumeMl)||volumeMl<0)throw new RangeError('Nonnegative metered volume required');
 const radius=Math.cbrt(volumeMl/neutralizationUnitDropVolume);
 // Closed reference winding is outward; preserve it while scaling.
 return volumeMl===0?[]:dropVertices.map(x=>x*radius);
}
export function neutralizationGeometry(q:NeutralizationInputs){
 const s=neutralizationState(q),a=neutralizationApparatus;
 return {...s,vesselDepthCm:s.vesselMl/neutralizationVesselArea,
  barrelSurfaceY:a.barrelBottomY+s.reservoirDepthCm,
  initialBarrelSurfaceY:a.barrelBottomY+q.plannedBaseMl/neutralizationBuretteArea,
  scale:Array.from({length:11},(_,i)=>({readingMl:i*5,y:a.barrelBottomY+(c.buretteCapacityMl-i*5)/neutralizationBuretteArea})),
  wholeDrawingMassG:s.initialLiquidMl*c.drawingDensityGml,
  geometryNote:s.geometryNote+' 128-sided barrel capacity50mL; its reading increases downward. Valve/nozzle schematic has zero modeled hold-up volume. Vessel capacity is above all allowed final sample volumes.'};
}

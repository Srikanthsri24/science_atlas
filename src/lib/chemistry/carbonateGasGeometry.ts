import {carbonateGasState,carbonateGasReference as c,type CarbonateGasInputs} from './carbonateGas';
export type CarbonateVector=[number,number,number];
const sides=128,unitArea=sides*Math.sin(2*Math.PI/sides)/2;
const baseRadius=3.6,neckRadius=.9,shoulderHeight=5,neckHeight=2;
const shoulderVolume=unitArea*shoulderHeight*(baseRadius**2+baseRadius*neckRadius+neckRadius**2)/3;
const neckVolume=unitArea*neckRadius**2*neckHeight;
const baseArea=unitArea*baseRadius**2;
const baseHeight=(c.flaskCapacityMl-shoulderVolume-neckVolume)/baseArea;
export const carbonateApparatus={sides,baseRadius,neckRadius,baseHeight,shoulderHeight,neckHeight,
  bottomY:1,baseArea,flaskCapacityMl:baseArea*baseHeight+shoulderVolume+neckVolume,
  syringeAreaCm2:10,syringeRadiusCm:Math.sqrt(10/unitArea),syringeTravelCm:20,
  tubeVolumeMl:5,carbonateForms:16};
export const carbonateChipCentres:CarbonateVector[]=Array.from({length:16},(_,i)=>[(i%4-1.5)*.7,0,(Math.floor(i/4)-1.5)*.7]);
export function carbonateGasGeometry(q:CarbonateGasInputs) {
  const s=carbonateGasState(q),a=carbonateApparatus;
  const chipEdgeCm=Math.cbrt(s.solidVolumeMl/a.carbonateForms);
  const displacedLiquidDepthCm=(q.acidMl+s.solidVolumeMl)/a.baseArea;
  return {...s,chipEdgeCm,perChipG:s.carbonateLeftG/a.carbonateForms,
    liquidVolumeMl:q.acidMl,displacedLiquidDepthCm,liquidSurfaceY:a.bottomY+displacedLiquidDepthCm,
    pistonTravelCm:s.syringeMl/a.syringeAreaCm2,
    flaskAirAndCo2Ml:c.flaskCapacityMl-q.acidMl-s.solidVolumeMl,
    drawingNote:'Solution drawing volume held constant at the initial acid volume, not a measured reaction-volume calibration. Sixteen equal-weight cubic carbonate forms are schematic, not actual marble morphology or grain-size kinetics. Tube dead volume is a calibrated reference, not inferred from a simplified routed line.'};
}
export function carbonateGasHistory(q:CarbonateGasInputs) {
  carbonateGasState(q);const times=new Set([0,q.timeS]);
  for(let i=1;i<61;i++)times.add(Math.min(q.timeS,q.timeS*i/61));
  return [...times].sort((a,b)=>a-b).map(timeS=>{
    const s=carbonateGasState({...q,timeS});return {timeS,syringeMl:s.syringeMl,
      gasEquivalentMl:s.gasEquivalentMl,rateMlS:s.syringeRateMlS,
      carbonateG:s.carbonateLeftG,co2G:s.co2G,co2Fraction:s.co2MoleFraction};
  });
}
export function carbonateChipTriangles(q:CarbonateGasInputs):number[] {
  const s=carbonateGasGeometry(q);if(s.chipEdgeCm===0)return [];
  const e=s.chipEdgeCm/2,out:number[]=[];
  const faces=[[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,4,7],[0,7,3],
    [1,2,6],[1,6,5],[0,1,5],[0,5,4],[3,7,6],[3,6,2]];
  for(const center of carbonateChipCentres) {
    const vertices:CarbonateVector[]=[[-e,0,-e],[e,0,-e],[e,2*e,-e],[-e,2*e,-e],
      [-e,0,e],[e,0,e],[e,2*e,e],[-e,2*e,e]];
    for(const face of faces)for(const i of face){const p=vertices[i];out.push(p[0]+center[0],p[1]+carbonateApparatus.bottomY,p[2]+center[2])}
  }
  return out;
}
/** Closed liquid shell with reversed solid boundaries: the liquid drawing
 * volume is the initial acid volume, not liquid plus solid volume. */
export function carbonateLiquidTriangles(q:CarbonateGasInputs):number[] {
  const s=carbonateGasGeometry(q),a=carbonateApparatus,out:number[]=[];
  const tri=(p:CarbonateVector,q:CarbonateVector,r:CarbonateVector)=>out.push(...p,...q,...r);
  const bottom:CarbonateVector=[0,a.bottomY,0],top:CarbonateVector=[0,s.liquidSurfaceY,0];
  for(let i=0;i<a.sides;i++) {
    const angle=2*Math.PI*i/a.sides,next=2*Math.PI*(i+1)/a.sides;
    const b0:CarbonateVector=[a.baseRadius*Math.cos(angle),a.bottomY,a.baseRadius*Math.sin(angle)];
    const b1:CarbonateVector=[a.baseRadius*Math.cos(next),a.bottomY,a.baseRadius*Math.sin(next)];
    const t0:CarbonateVector=[b0[0],s.liquidSurfaceY,b0[2]],t1:CarbonateVector=[b1[0],s.liquidSurfaceY,b1[2]];
    tri(bottom,b0,b1);tri(top,t1,t0);tri(b0,t0,t1);tri(b0,t1,b1);
  }
  const chips=carbonateChipTriangles(q);
  for(let i=0;i<chips.length;i+=9)out.push(...chips.slice(i,i+3),...chips.slice(i+6,i+9),...chips.slice(i+3,i+6));
  return out;
}

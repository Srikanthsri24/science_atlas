import {coatingState,coatingReference as c,type CoatingInputs,type CoatingCase} from './corrosionCoatings';
import {rustApparatus,rustCylinderTriangles} from './rustConditionsGeometry';
export const coatingApparatus={sides:rustApparatus.sides,chamberAreaCm2:rustApparatus.chamberAreaCm2,chamberRadiusCm:1.2,bottomY:.5,couponBaseY:2};
export type CoatingVector=[number,number,number];
/** Closed outward rectangular phase. All dimensions are centimetres. */
export function coatingBoxTriangles(x0:number,x1:number,y0:number,y1:number,z0:number,z1:number){
 if(![x0,x1,y0,y1,z0,z1].every(Number.isFinite)||x1<x0||y1<y0||z1<z0)throw new RangeError('Finite ordered box bounds required');
 if(x0===x1||y0===y1||z0===z1)return[];
 const points:CoatingVector[]=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
 // Each quad is outward when viewed from outside its solid phase.
 const faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]];
 return faces.flatMap(([a,b,d,e])=>[...points[a],...points[b],...points[d],...points[a],...points[d],...points[e]]);
}
export function coatingGeometry(q:CoatingInputs,kind:CoatingCase){
 const s=coatingState(q,kind),a=coatingApparatus;
 const boundaryX=-c.faceWidthCm/2+c.faceWidthCm*s.exposed;
 const zones=s.zones.map((zone,i)=>{
  const x0=i===0?-c.faceWidthCm/2:boundaryX,x1=i===0?boundaryX:c.faceWidthCm/2;
  const metalHeightCm=zone.areaCm2>0?zone.metalVolumeMl/zone.areaCm2:0;
  const productHeightCm=zone.areaCm2>0?zone.productVolumeMl/zone.areaCm2:0;
  const filmHeightCm=i===1&&zone.fraction>0?c.filmThicknessCm:0;
  const metalTopY=a.couponBaseY+metalHeightCm,productTopY=metalTopY+productHeightCm,filmTopY=productTopY+filmHeightCm;
  return {...zone,x0,x1,metalHeightCm,productHeightCm,filmHeightCm,metalTopY,productTopY,filmTopY};
 });
 const waterDepthCm=s.waterLeftG/c.waterDrawingDensityGml/a.chamberAreaCm2;
 return {...s,zones,boundaryX,chamberHeightCm:q.chamberMl/a.chamberAreaCm2,waterDepthCm,waterTopY:a.bottomY+waterDepthCm,
  geometryNote:'Two parallel planar iron zones with side/back access excluded by the reference preparation. Metal, retained FeOOH-equivalent product and inert film occupy separate closed volume-based layers. Film follows the covered-zone top without stretching in this reference geometry; no mechanical lifting, cracking, adhesion, under-film lateral transport or real pitting calculation. Water access through a zero-volume schematic wick. Drawing densities and transmission are chosen references.'};
}
export function coatingZoneTriangles(q:CoatingInputs,kind:CoatingCase,index:0|1,phase:'metal'|'product'|'film'){
 if(index!==0&&index!==1)throw new RangeError('Zone0 or1 required');
 if(!['metal','product','film'].includes(phase))throw new RangeError('A supported material phase is required');
 const z=coatingGeometry(q,kind).zones[index];
 const bottom=phase==='metal'?coatingApparatus.couponBaseY:phase==='product'?z.metalTopY:z.productTopY;
 const top=phase==='metal'?z.metalTopY:phase==='product'?z.productTopY:z.filmTopY;
 return coatingBoxTriangles(z.x0,z.x1,bottom,top,-c.faceDepthCm/2,c.faceDepthCm/2);
}
export function coatingWaterTriangles(q:CoatingInputs,kind:CoatingCase){const g=coatingGeometry(q,kind);return rustCylinderTriangles(coatingApparatus.chamberRadiusCm,g.waterDepthCm,coatingApparatus.bottomY+g.waterDepthCm/2)}

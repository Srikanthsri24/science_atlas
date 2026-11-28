import{zincProtectionState,zincProtectionGuide,zincProtectionConstants as c,type ZincProtectionInputs}from'./zincProtection';
export const zincProtectionApparatus={segments:128,radiusCm:2.5,capacityMl:140,bottomY:1,couponCentreY:1.5,cellX:[-9.6,-3.2,3.2,9.6],insulatingSpacerCm:.015}as const;
/** Exact equivalent metal volumes. Uniform Fe loss and fixed prepared bath levels are reference geometry. */
export function zincProtectionGeometry(q:ZincProtectionInputs,seconds?:number){
 const model=zincProtectionState(q),a=zincProtectionApparatus,baseArea=a.segments*Math.sin(2*Math.PI/a.segments)*a.radiusCm**2/2,wallHeight=a.capacityMl/baseArea;
 if(seconds!==undefined&&Math.abs(zincProtectionGuide(seconds,q).inputs.elapsedDays-q.elapsedDays)>1e-12)throw new RangeError('Geometry requires current zinc guide inputs');
 const sideCm=Math.sqrt(q.areaCm2/2),initialIronThicknessCm=(q.ironG/c.ironDensityGml)/(q.areaCm2/2);
 const cells=model.cells.map((material,i)=>{
  const s=material,coatingAreaCm2=q.areaCm2*s.coatedFraction,bandWidthCm=sideCm*s.coatedFraction/2,scratchWidthCm=sideCm*s.defect,initialZincThicknessCm=coatingAreaCm2>0?s.initialZincVolumeMl/coatingAreaCm2:0,remainingZincThicknessCm=coatingAreaCm2>0?s.remainingZincVolumeMl/coatingAreaCm2:0,ironThicknessCm=s.remainingIronVolumeMl/(q.areaCm2/2);
  // Open insulating support rails are apparatus. Detached zinc does not block nominal iron exposure.
  const spacerCm=s.initialZincG>0&&!s.metalContact?a.insulatingSpacerCm:0,spacerVolumeMl=.01*coatingAreaCm2*spacerCm;
  const initialBottomY=a.couponCentreY-initialIronThicknessCm/2-spacerCm-initialZincThicknessCm,initialTopY=a.couponCentreY+initialIronThicknessCm/2+spacerCm+initialZincThicknessCm,preparedLevelHeight=q.wet?(q.carrierG+s.initialIronVolumeMl+s.initialZincVolumeMl+spacerVolumeMl)/baseArea:0;
  const patches=([-1,1]as const).flatMap(face=>([-1,1]as const).map(sign=>({face,offsetX:sign*(sideCm/2-bandWidthCm/2),centreY:a.couponCentreY+face*(ironThicknessCm/2+spacerCm+remainingZincThicknessCm/2),widthCm:bandWidthCm,heightCm:remainingZincThicknessCm,depthCm:sideCm,volumeMl:bandWidthCm*remainingZincThicknessCm*sideCm})));
  return{id:s.id,x:a.cellX[i],material:s,sideCm,scratchWidthCm,bandWidthCm,coatingAreaCm2,initialIronThicknessCm,ironThicknessCm,initialZincThicknessCm,remainingZincThicknessCm,spacerCm,spacerVolumeMl,initialBottomY,initialTopY,preparedLevelHeight,carrierInBathMl:q.wet?q.carrierG:0,carrierInSeparateStockMl:q.wet?0:q.carrierG,unusedZincCubeSideCm:Math.cbrt(s.unappliedZincG/c.zincDensityGml),patches,flowActive:seconds!==undefined&&seconds>15&&seconds<105&&s.ironCurrentA+s.zincCurrentA>0,flowPhase:(s.primaryChargeC/2)%1,protectiveFlowActive:seconds!==undefined&&seconds>15&&seconds<105&&s.protectiveCurrentA>0,protectiveFlowPhase:s.protectiveChargeC%1};
 });
 const dryCarrierStock={widthCm:24,depthCm:3,areaCm2:72,capacityMl:500,volumeMl:q.wet?0:4*q.carrierG,heightCm:q.wet?0:4*q.carrierG/72};
 return{baseArea,wallHeight,cells,dryCarrierStock};
}

/** Original qualitative spangle cue on a unit square; it is not measured crystal microscopy. */
export function zincProtectionGrainMesh(){const positions:number[]=[],normals:number[]=[],colors:number[]=[];for(let row=0;row<8;row++)for(let col=0;col<8;col++){const x=col/8-.5,z=row/8-.5,d=1/8;for(let tri=0;tri<2;tri++){const points=tri?[[x,z],[x,z+d],[x+d,z+d]]:[[x,z],[x+d,z+d],[x+d,z]],tone=.72+.22*(Math.sin((row*8+col)*31+tri*17)*.5+.5);for(const[u,v]of points){positions.push(u,0,v);normals.push(0,1,0);colors.push(tone*.73,tone*.9,tone);}}}return{positions:new Float32Array(positions),normals:new Float32Array(normals),colors:new Float32Array(colors)};}

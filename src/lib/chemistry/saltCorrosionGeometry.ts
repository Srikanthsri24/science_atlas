import{saltCorrosionState,saltCorrosionCell,saltCorrosionGuide,type SaltCorrosionInputs}from'./saltCorrosion';
export const saltCorrosionApparatus={segments:128,radiusCm:2.5,capacityMl:140,bottomY:1,cellX:[-3.6,3.6],couponCentreY:1.65}as const;
/** Prepared carrier level is a reference envelope; no unknown rust density/volume is inferred. */
export function saltCorrosionGeometry(q:SaltCorrosionInputs,seconds?:number){
  const model=saltCorrosionState(q),a=saltCorrosionApparatus,area=a.segments*Math.sin(2*Math.PI/a.segments)*a.radiusCm**2/2,wallHeight=a.capacityMl/area;
  if(seconds!==undefined&&Math.abs(saltCorrosionGuide(seconds,q).inputs.elapsedDays-q.elapsedDays)>1e-12)throw new RangeError('Geometry requires current saltwater guide inputs');
  const cells=([model.a,model.b]as const).map((material,index)=>{
    const x=a.cellX[index],preparedLevelHeight=(material.solutionMl+material.initialIronMl)/area;
    const initialBottomY=a.couponCentreY-material.initialThicknessCm/2,initialTopY=a.couponCentreY+material.initialThicknessCm/2;
    const currentBottomY=a.couponCentreY-material.remainingThicknessCm/2,currentTopY=a.couponCentreY+material.remainingThicknessCm/2;
    return{id:material.id,x,material,sideCm:material.sideCm,initialThicknessCm:material.initialThicknessCm,remainingThicknessCm:material.remainingThicknessCm,initialBottomY,initialTopY,currentBottomY,currentTopY,preparedLevelHeight,initialMetalVolumeMl:material.faceAreaCm2*material.initialThicknessCm,remainingMetalVolumeMl:material.faceAreaCm2*material.remainingThicknessCm,flowActive:seconds!==undefined&&seconds>15&&seconds<105&&material.instantaneousCurrentA>0,flowPhase:(material.primaryChargeC/5)%1,hasSaltMarkers:material.saltMol>0,oxygenPath:[[x,1+wallHeight+1,0],[x,1+preparedLevelHeight+.3,0],[x,initialTopY+.1,0]]as[number,number,number][]};
  });
  return{area,wallHeight,cells,comparison:model};
}
export function saltCorrosionSeries(q:SaltCorrosionInputs,steps=56){
  saltCorrosionState(q);
  if(!Number.isInteger(steps)||steps<2||steps>200)throw new RangeError('Use2–200 history intervals');
  const times=Array.from({length:steps+1},(_,i)=>14*i/steps);
  for(const id of['a','b']as const){const s=saltCorrosionCell(q,id);if(s.exhaustionS!==null){const t=s.exhaustionS/86400;if(t>0&&t<14)times.push(t);}}
  times.push(q.elapsedDays);
  return[...new Set(times)].sort((a,b)=>a-b).map(days=>{const s=saltCorrosionState({...q,elapsedDays:days});return{days,lossA:s.a.convertedIronG,lossB:s.b.convertedIronG,gainA:s.a.specimenGainG,gainB:s.b.specimenGainG};});
}

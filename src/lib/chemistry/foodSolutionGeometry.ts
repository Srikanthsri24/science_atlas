import{foodSolutionState,foodSolutionGuide,foodSolutionConstants as k,type FoodSolutionInputs}from'./foodSolutionModels';
export const foodSolutionApparatus={radiusCm:2,segments:128,bottomCm:1,rimCm:9,bulbRadiusCm:.2,raisedBulbY:10,spacingCm:6}as const;
/** Ideal nonconsuming probe;displacement and transfer between samples are neglected. */
export function foodSolutionGeometry(q:FoodSolutionInputs,seconds?:number){const s=foodSolutionState(q),a=foodSolutionApparatus,area=a.segments*Math.sin(2*Math.PI/a.segments)*a.radiusCm**2/2,fillHeight=q.volumeMl/area,surfaceY=a.bottomCm+fillHeight,travel=(a.raisedBulbY-surfaceY+a.bulbRadiusCm)/k.immersionFraction,guide=seconds===undefined?null:foodSolutionGuide(seconds,q);
 if(guide&&(guide.inputs.sampleIndex!==q.sampleIndex||Math.abs(guide.inputs.insertionFraction-q.insertionFraction)>1e-12))throw new RangeError('Geometry must use current guide probe state');
 const carriageIndex=guide?.carriageIndex??q.sampleIndex,probeX=(carriageIndex-2)*a.spacingCm,bulbY=a.raisedBulbY-travel*q.insertionFraction,selectedX=(q.sampleIndex-2)*a.spacingCm,
 aligned=Math.abs(probeX-selectedX)<1e-10,bulbFullyImmersed=aligned&&bulbY+a.bulbRadiusCm<=surfaceY+1e-12&&bulbY-a.bulbRadiusCm>=a.bottomCm;
 return{area,fillHeight,surfaceY,capacityMl:(a.rimCm-a.bottomCm)*area,cells:s.cells.map((c,i)=>({...c,x:(i-2)*a.spacingCm,nominalVolumeMl:q.volumeMl,surfaceY})),probeX,bulbY,probeTravel:travel,bulbFullyImmersed,reading:bulbFullyImmersed?s.selected.pH:null,carriageIndex};
}

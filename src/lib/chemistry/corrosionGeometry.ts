import{corrosionState,corrosionGuide,corrosionConstants,type CorrosionInputs}from'./corrosionConditions';
export const corrosionApparatus={segments:128,radiusCm:.95,capacityMl:50,bottomY:1,cellX:[-3,0,3],preparedOilMl:1,desiccantBedMl:2}as const;
/** Geometry describes prepared liquid levels. A variable-composition rust volume is deliberately not inferred. */
export function corrosionGeometry(q:CorrosionInputs,seconds?:number){
  const states=corrosionState(q),a=corrosionApparatus,c=corrosionConstants;
  const area=a.segments*Math.sin(2*Math.PI/a.segments)*a.radiusCm**2/2;
  const wallHeight=a.capacityMl/area;
  // Compensate the faceted circular approximation so metal mesh volumes equal the analytic account.
  const metalRadiusCorrection=Math.sqrt(2*Math.PI/(a.segments*Math.sin(2*Math.PI/a.segments)));
  if(seconds!==undefined){const guide=corrosionGuide(seconds,q);if(Math.abs(guide.inputs.elapsedDays-q.elapsedDays)>1e-12)throw new RangeError('Use the current corrosion guide state');}
  const cells=states.map((state,index)=>{
    const dry=state.id==='dry-air',tipBottomY=a.bottomY+(dry?3.5:.5);
    const initialShaftRadius=state.shaftRadiusCm*metalRadiusCorrection,remainingShaftRadius=state.remainingRadiusCm*metalRadiusCorrection;
    const shaftHeight=q.nailLengthCm-c.tipLengthCm;
    const shaftCentreY=tipBottomY+c.tipLengthCm+shaftHeight/2;
    const tipCentreY=tipBottomY+c.tipLengthCm/2;
    const headCentreY=tipBottomY+q.nailLengthCm+c.headThicknessCm/2;
    const preparedWaterHeight=dry?0:(q.waterG+state.initialIronMl)/area;
    const oilHeight=state.id==='oxygen-excluded'?a.preparedOilMl/area:0;
    const desiccantHeight=dry?a.desiccantBedMl/area:0;
    const oxygenBudgetFraction=state.initialOxygenMol>0?state.oxygenRemainingMol/state.initialOxygenMol:0;
    const transferActive=seconds!==undefined&&seconds>15&&seconds<105&&state.conditionsPresent&&state.condition==='chosen-progress-reference';
    // Zero-thickness appearance patches are qualitative; they do not encode rust volume or measured coverage.
    const surfacePatches=Array.from({length:24},(_,i)=>{
      const opacity=Math.min(1,Math.max(0,state.convertedFraction*5*24-i))*.92;
      const height=Math.min(shaftHeight*.2,.1+.04*(i%5));
      const centreFraction=i===0?.5:i===1?.54:i===2?.46:.1+.8*((i*.61803398875)%1);
      const centreY=tipBottomY+c.tipLengthCm+shaftHeight*centreFraction;
      return{opacity,height,centreY,radius:remainingShaftRadius*1.005,...corrosionPatchSpec(i)};
    }).filter(p=>p.opacity>0);
    return {id:state.id,x:a.cellX[index],material:state,surfacePatches,initialShaftRadius,remainingShaftRadius,initialHeadRadius:initialShaftRadius*c.headRadiusRatio,remainingHeadRadius:remainingShaftRadius*c.headRadiusRatio,shaftHeight,shaftCentreY,tipCentreY,tipBottomY,headCentreY,headTopY:headCentreY+c.headThicknessCm/2,preparedWaterHeight,oilHeight,desiccantHeight,oxygenBudgetFraction,transferActive,transferPhase:(q.elapsedDays/.35)%1};
  });
  return {area,wallHeight,metalRadiusCorrection,cells};
}
/** Original, deterministic appearance glyphs. Open curved patches have no enclosed rust volume. */
export function corrosionPatchSpec(seed:number){
  if(!Number.isInteger(seed)||seed<0||seed>=24)throw new RangeError('Surface patch seed must be0–23');
  return{angle:seed===0?0:seed===1?.7:seed===2?5.6:2*Math.PI*((seed*.41421356237)%1),span:.6+.2*(seed%3),color:seed%3===0?'#7d3c20':seed%3===1?'#b36331':'#ca8447'};
}
export function corrosionSurfacePatchMesh(seed:number){
  const {angle,span}=corrosionPatchSpec(seed),segments=24,rings=6,positions:number[]=[],normals:number[]=[],colors:number[]=[],indices:number[]=[],palette=[[125,60,32],[179,99,49],[202,132,71]][seed%3];
  const vertex=(radial:number,phi:number)=>{
    const edge=.8+.11*Math.sin(phi*5+seed*1.7)+.06*Math.sin(phi*9-seed*.8);
    const theta=angle+span/2+Math.cos(phi)*span/2*radial*edge;
    const y=Math.sin(phi)*.5*radial*edge;
    positions.push(Math.sin(theta),y,Math.cos(theta));normals.push(Math.sin(theta),0,Math.cos(theta));
    const tone=.8+.16*Math.sin(phi*13+radial*19+seed);
    colors.push(...palette.map(value=>Math.pow(value/255,2.2)*tone));
  };
  vertex(0,0);
  for(let ring=1;ring<=rings;ring++)for(let j=0;j<segments;j++)vertex(ring/rings,2*Math.PI*j/segments);
  for(let j=0;j<segments;j++)indices.push(0,1+j,1+(j+1)%segments);
  for(let ring=1;ring<rings;ring++)for(let j=0;j<segments;j++){
    const next=(j+1)%segments,inner=1+(ring-1)*segments,outer=1+ring*segments;
    indices.push(inner+j,outer+j,outer+next,inner+j,outer+next,inner+next);
  }
  return{positions:new Float32Array(positions),normals:new Float32Array(normals),colors:new Float32Array(colors),indices:new Uint16Array(indices)};
}

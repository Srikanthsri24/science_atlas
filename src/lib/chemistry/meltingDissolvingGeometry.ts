import{meltingDissolvingState,meltingDissolvingReference}from'./meltingDissolving';
export const comparisonIceAreaCm2=16,comparisonSaltGrainCount=60;
/** Reference centimetres. Uniformly shrinking cubes are teaching geometry,
 * not a resolved melting front or measured dissolution morphology. */
export function meltingDissolvingGeometry(sampleG=10,solventG=100,conductanceWK=.3,stirred=true,timeS=0){
 const s=meltingDissolvingState(sampleG,solventG,conductanceWK,stirred,timeS),a=Math.cbrt(s.iceVolumeCm3),
   floating=s.iceG>0&&sampleG/comparisonIceAreaCm2>=meltingDissolvingReference.iceDensityGCm3*a,
   waterHeightCm=s.iceG===0?sampleG/comparisonIceAreaCm2:floating?sampleG/comparisonIceAreaCm2:s.moltenG/(comparisonIceAreaCm2-a*a),
   iceBottomCm=floating?Math.max(0,waterHeightCm-meltingDissolvingReference.iceDensityGCm3*a):0,
   surroundingDepth=Math.max(0,Math.min(a,waterHeightCm-iceBottomCm)),margin=(4-a)/2,
   blocks:{x:number;z:number;width:number;depth:number;base:number;height:number}[]=[];
 if(s.iceG===0)blocks.push({x:0,z:0,width:4,depth:4,base:0,height:waterHeightCm});
 else{
   if(iceBottomCm>0)blocks.push({x:0,z:0,width:4,depth:4,base:0,height:iceBottomCm});
   if(surroundingDepth>0){for(const sign of[-1,1])blocks.push({x:sign*(a/2+margin/2),z:0,width:margin,depth:4,base:iceBottomCm,height:surroundingDepth});for(const sign of[-1,1])blocks.push({x:0,z:sign*(a/2+margin/2),width:a,depth:margin,base:iceBottomCm,height:surroundingDepth})}
 }
 return {iceSideCm:a,iceBottomCm,waterHeightCm,floating,waterBlocks:blocks,
   saltGrainSideCm:Math.cbrt(s.saltSolidVolumeCm3/comparisonSaltGrainCount),
   // Right fill is schematic: solution partial volumes are deliberately absent.
   solventReferenceHeightCm:solventG/25,stirAngle:stirred?timeS*Math.PI/2:0,
   heatIndicatorPhase:s.inputHeatJ/500%1};
}
const saltSites=Array.from({length:64},(_,i)=>({x:(i%8-3.5)*.59,z:(Math.floor(i/8)-3.5)*.59})).filter(p=>Math.abs(p.x)>.4||Math.abs(p.z)>.4);
export function comparisonSaltSite(i:number){if(!Number.isInteger(i)||i<0||i>=60)throw new RangeError('Model grain index0–59 required');return saltSites[i]}
export function comparisonNumber(x:number,d=5){if(!Number.isFinite(x)||x<0)throw new RangeError('Finite nonnegative measurement required');return x>0&&x<10**-d?`<${(10**-d).toFixed(d)}`:x.toFixed(d)}

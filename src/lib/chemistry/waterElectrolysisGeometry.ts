import {electrolysisState,type ElectrolysisInputs} from './waterElectrolysis';
export type ElectrolysisVector=[number,number,number];
/** Original equal-capacity tube geometry, centimetre display coordinates.
 * Gas compartments show compensated dry-equivalent volume, not raw wet-gas level.
 * Bubble markers are explanatory; their number/size is not a molecule/flow meter. */
export function electrolysisGeometry(raw:ElectrolysisInputs,displaySeconds=0){
 if(!Number.isFinite(displaySeconds)||displaySeconds<0||displaySeconds>1e6)throw new RangeError('Nonnegative finite display time required');
 const state=electrolysisState(raw),q=state.inputs,heightCm=8,bottomY=1,topY=9,radiusCm=Math.sqrt(q.capacityMl/(Math.PI*heightCm));
 const tubes=([-1,1] as const).map(sign=>{
  const hydrogen=sign===-1,id=hydrogen?'hydrogen':'oxygen',x=sign*3.2,retainedMl=hydrogen?state.hydrogenRetainedMl:state.oxygenRetainedMl,overflowMl=hydrogen?state.hydrogenOverflowMl:state.oxygenOverflowMl,fill=retainedMl/q.capacityMl,gasHeightCm=heightCm*fill,interfaceY=topY-gasHeightCm;
  const bubbleTop=Math.max(bottomY+.15,interfaceY-.15),bubbleSpan=Math.max(0,bubbleTop-(bottomY+.15));
  const bubbles=state.activeCurrentA>0&&bubbleSpan>0?Array.from({length:12},(_,i)=>{
   const fraction=(i/12+displaySeconds*.3)%1,angle=i*2.399963229728653;
   return{id:`${id}:bubble:${i}`,position:[x+Math.cos(angle)*radiusCm*.35,bottomY+.15+bubbleSpan*fraction,Math.sin(angle)*radiusCm*.35] as ElectrolysisVector,radius:.045+(i%3)*.012};
  }):[];
  const ticks=Array.from({length:11},(_,i)=>({volumeMl:q.capacityMl*i/10,y:topY-heightCm*i/10}));
  return{id,gas:hydrogen?'H2':'O2',polarity:hydrogen?'-':'+',electrodeRole:hydrogen?'Cathode · reduction':'Anode · oxidation',center:[x,bottomY+heightCm/2,0] as ElectrolysisVector,x,radiusCm,heightCm,bottomY,topY,interfaceY,gasHeightCm,liquidHeightCm:heightCm-gasHeightCm,retainedMl,overflowMl,bubbles,ticks,
   gasCenter:[x,topY-gasHeightCm/2,0] as ElectrolysisVector,liquidCenter:[x,bottomY+(heightCm-gasHeightCm)/2,0] as ElectrolysisVector,
   electrode:[x,.65,0] as ElectrolysisVector,
   lead:[[x,.4,0],[x,-1.15,0],[hydrogen?-1.1:1.1,-1.15,0],[hydrogen?-1.1:1.1,-2,0]] as ElectrolysisVector[],
  };
 });
 return{state,tubes,heightCm,radiusCm,sourceCenter:[0,-2.4,0] as ElectrolysisVector,
  limits:{min:[-6,-3.5,-2.5] as ElectrolysisVector,max:[6,10.5,2.5] as ElectrolysisVector},
  scope:'Tube geometry uses centimetres: πr²h equals selected capacity in mL. Levels show compensated dry-equivalent gas volume at stated common T/P, not a wet meniscus prediction. Equal arbitrary bubble-marker counts do not measure relative gas quantities. Thermal motion, fluid displacement, vapour and hydrostatic pressure are omitted.'};
}

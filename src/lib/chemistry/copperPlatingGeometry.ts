import {platingState,copperConstants,type PlatingInputs} from './copperElectroplating';
export type PlatingVector=[number,number,number];
const scales=[200,100,50,20,10,5,2,1];
function scaleFor(cm:number){return scales.find(s=>s*cm<=1.5)??1}
/** cm apparatus plus explicitly magnified cross-sections. The substrate fixture
 * is schematic; its independently supplied balance mass is not inferred from its mesh. */
export function platingGeometry(raw:PlatingInputs,displaySeconds=0){
 if(!Number.isFinite(displaySeconds)||displaySeconds<0||displaySeconds>1e6)throw new RangeError('Finite nonnegative display time required');
 const state=platingState(raw),q=state.inputs,anodeAreaCm2=6,anodeWidthCm=1.5,anodeHeightCm=4,anodeInitialThicknessCm=q.anodeInitialG/(copperConstants.densityGCm3*anodeAreaCm2),anodeRemainingThicknessCm=state.anodeFinalG/(copperConstants.densityGCm3*anodeAreaCm2),filmScale=scaleFor(state.thicknessCm),anodeScale=scaleFor(anodeInitialThicknessCm);
 const cathode={center:[3,3,0] as PlatingVector,widthCm:q.widthCm,heightCm:q.heightCm,fixtureThicknessCm:.12,filmThicknessCm:state.thicknessCm,filmCenter:[3,3,.06+state.thicknessCm/2] as PlatingVector};
 const anode={center:[-3,3,0] as PlatingVector,widthCm:anodeWidthCm,heightCm:anodeHeightCm,areaCm2:anodeAreaCm2,initialThicknessCm:anodeInitialThicknessCm,remainingThicknessCm:anodeRemainingThicknessCm};
 const filmInset={origin:[3,-2,0] as PlatingVector,scale:filmScale,displayThicknessCm:state.thicknessCm*filmScale,physicalThicknessCm:state.thicknessCm};
 const anodeInset={origin:[-3,-2,0] as PlatingVector,scale:anodeScale,initialDisplayThicknessCm:anodeInitialThicknessCm*anodeScale,remainingDisplayThicknessCm:anodeRemainingThicknessCm*anodeScale};
 // Stable sign/flow markers in a separate electrolyte lane, not literal atom tracing.
 const markers=Array.from({length:12},(_,i)=>{const base=i/12,travel=state.activeCurrentA>0?(displaySeconds*.12)%1:0,fraction=(base+travel)%1;return{id:`cu-marker:${i}`,position:[-2.4+4.8*fraction,1.5+(i%3)*.4,.8] as PlatingVector,fraction,label:'Cu2+',visible:state.activeCurrentA>0}});
 const leads=[{id:'anode',positive:true,path:[[-1,7.8,0],[-4.8,7.8,0],[-4.8,6.5,0],[-3,6.5,0],[-3,5,0]] as PlatingVector[]},{id:'cathode',positive:false,path:[[1,7.8,0],[5.1,7.8,0],[5.1,6.5,0],[3,6.5,0],[3,3+q.heightCm/2,0]] as PlatingVector[]}];
 const wireElectrons=leads.flatMap(l=>Array.from({length:10},(_,i)=>{
  const direction=l.positive?-1:1,base=(i+.5)/10,move=state.activeCurrentA>0?direction*displaySeconds*.15:0,fraction=((base+move)%1+1)%1,lengths=l.path.slice(1).map((v,j)=>Math.hypot(...v.map((x,k)=>x-l.path[j][k]))),total=lengths.reduce((a,b)=>a+b,0);
  let distance=fraction*total,position:PlatingVector=[...l.path[0]];
  for(let j=0;j<lengths.length;j++){if(distance<=lengths[j]||j===lengths.length-1){const t=lengths[j]?distance/lengths[j]:0;position=l.path[j].map((x,k)=>x+(l.path[j+1][k]-x)*t) as PlatingVector;break}distance-=lengths[j]}
  return{id:`electron:${l.id}:${i}`,lead:l.id,directionAlongPath:direction,fraction,position,visible:state.activeCurrentA>0};
 }));
 return{state,cathode,anode,filmInset,anodeInset,markers,tank:{center:[0,3,0] as PlatingVector,widthCm:11.5,heightCm:6,depthCm:5},sourceCenter:[0,7.8,0] as PlatingVector,
  leads,wireElectrons,
  limits:{min:[-6.3,-3.6,-3] as PlatingVector,max:[6.3,9.2,3] as PlatingVector},
  scope:'Apparatus dimensions in cm. Actual copper film thickness follows mass/density/exposed area; separate cross-sections explicitly magnify coating and anode thickness. Initial cathode mass is an independent balance input, not inferred from schematic fixture geometry. Visible Cu2+ markers are arbitrary transfer signs, not measured trajectories, concentrations or atom counts.'};
}

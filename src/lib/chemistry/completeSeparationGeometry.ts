import {separationState,type SeparationInputs} from './completeSeparation';
export type SeparationVessel='source'|'residue'|'filtrate'|'wash';
export const separationVessels:SeparationVessel[]=['source','residue','filtrate','wash'];
export const separationVesselNames:Record<SeparationVessel,string>={source:'Mixing beaker',residue:'Retained filter residue',filtrate:'Filtrate / salt dish',wash:'Reserved wash water'};
export type SeparationVector=[number,number,number];
export const separationContainer={source:{radiusCm:2,heightCm:8.5},residue:{radiusCm:1.6,heightCm:8},filtrate:{radiusCm:3.5,heightCm:5.5},wash:{radiusCm:1.5,heightCm:13.5}};
export const separationSegments=128,separationPacking=.6;
export function separationGeometry(q:SeparationInputs,kind:SeparationVessel){
 const s=separationState(q),hardware=separationContainer[kind];if(!hardware)throw new RangeError('Supported separation vessel required');
 const sandMl=kind==='source'?s.sourceSandMl:kind==='residue'?s.cakeSandMl:0,crystalMl=kind==='source'?s.sourceCrystalMl:kind==='residue'?s.cakeCrystalMl:kind==='filtrate'?s.receiverCrystalMl:0,solutionMl=kind==='source'?s.sourceSolutionMl:kind==='residue'?s.cakeSolutionMl:kind==='filtrate'?s.receiverSolutionMl:s.washReservoirG;
 // Lumped porous-layer reference: solids occupy60% of their envelope; remaining
 // voids contain liquid first, then air. This is not a measured capillary profile.
 const areaCm2=separationSegments*hardware.radiusCm**2*Math.sin(2*Math.PI/separationSegments)/2,solidMl=sandMl+crystalMl,bedEnvelopeMl=solidMl/separationPacking,poreCapacityMl=bedEnvelopeMl-solidMl,poreSolutionMl=Math.min(poreCapacityMl,solutionMl),wetFraction=poreCapacityMl>0?poreSolutionMl/poreCapacityMl:0,wetBedMl=bedEnvelopeMl*wetFraction,dryBedMl=bedEnvelopeMl-wetBedMl,freeSolutionMl=solutionMl-poreSolutionMl,airInBedMl=poreCapacityMl-poreSolutionMl;
 const wetHeightCm=wetBedMl/areaCm2,dryHeightCm=dryBedMl/areaCm2,bedHeightCm=wetHeightCm+dryHeightCm,freeHeightCm=freeSolutionMl/areaCm2,topCm=bedHeightCm+freeHeightCm;
 // Wet envelope sits below a dry envelope if partly wetted; free liquid only
 // exists after the pores fill, so it never floats above a dry layer.
 const bands=[{id:'wet' as const,bottomCm:0,heightCm:wetHeightCm,envelopeMl:wetBedMl,solidMl:solidMl*wetFraction,solutionMl:poreSolutionMl,airMl:0},{id:'dry' as const,bottomCm:wetHeightCm,heightCm:dryHeightCm,envelopeMl:dryBedMl,solidMl:solidMl*(1-wetFraction),solutionMl:0,airMl:airInBedMl},{id:'solution' as const,bottomCm:bedHeightCm,heightCm:freeHeightCm,envelopeMl:freeSolutionMl,solidMl:0,solutionMl:freeSolutionMl,airMl:0}];
 return {kind,...hardware,areaCm2,sandMl,crystalMl,solutionMl,solidMl,bedEnvelopeMl,poreCapacityMl,poreSolutionMl,airInBedMl,wetFraction,wetBedMl,dryBedMl,freeSolutionMl,wetHeightCm,dryHeightCm,bedHeightCm,freeHeightCm,topCm,bands,wallCm:.1,baseCm:.15};
}
export function separationBandTriangles(q:SeparationInputs,kind:SeparationVessel,id:'wet'|'dry'|'solution'){
 const g=separationGeometry(q,kind),band=g.bands.find(b=>b.id===id)!;if(band.heightCm<=0)return [];
 const y0=g.baseCm+band.bottomCm,y1=y0+band.heightCm,R=g.radiusCm,tri:SeparationVector[][]=[];
 for(let i=0;i<separationSegments;i++){const a=2*Math.PI*i/separationSegments,b=2*Math.PI*(i+1)/separationSegments,p:SeparationVector=[R*Math.cos(a),y0,R*Math.sin(a)],v:SeparationVector=[R*Math.cos(b),y0,R*Math.sin(b)],P:SeparationVector=[p[0],y1,p[2]],V:SeparationVector=[v[0],y1,v[2]];tri.push([[0,y0,0],p,v],[[0,y1,0],V,P],[p,P,v],[v,P,V])}return tri;
}
export function separationTransfer(q:SeparationInputs){const s=separationState(q),t=q.timeSeconds;if(t>0&&t<200)return {kind:'stir',progress:s.dissolution,label:'Prescribed dissolution; salt changes compartment, sand stays solid'};if(t>200&&t<400)return {kind:'filter',progress:s.filtration,label:'Instantaneous transfer path; no extra in-flight inventory'};if(s.activeWash)return {kind:s.washDrainFraction>0?'drain':'wash',progress:s.washDrainFraction>0?s.washDrainFraction:s.washFillFraction,label:'Fresh wash mixes before a solution drains to the filtrate'};if(t>700&&t<1200)return {kind:'vapour',progress:s.drying,label:'Invisible water transfer cue, not visible steam volume or heat kinetics'};return {kind:'none',progress:0,label:'No active material transfer'}}

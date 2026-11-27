import{limewaterState,limewaterGuide,type LimewaterInputs}from'./limewaterEvidence';
export type LimewaterVector=[number,number,number];
export const limewaterApparatus={sides:128,sourceX:-8,sourceBottom:1,sourceRadius:2.3,sourceHeight:4,
 receiverX:8,receiverBottom:1,receiverRadius:1.8,receiverHeight:6,
 syringeX:-5,syringeY:11,syringeRadius:1.8,syringeCapacityMl:150,sourceGrains:16,receiverParticles:64,
 sphereWidthSegments:32,sphereHeightSegments:24}as const;
export const limewaterPolygonArea=(r:number)=>{if(!Number.isFinite(r)||r<=0)throw new RangeError('Positive radius required');return 128*Math.sin(2*Math.PI/128)*r*r/2};
/** Exact volume of the closed32×24 triangulated THREE sphere used for equivalent-solid markers. */
export const limewaterUnitSphereVolume=(()=>{const N=32,bands=24,A=N*Math.sin(2*Math.PI/N)/2;let V=0;for(let j=0;j<bands;j++){const p=Math.PI*j/bands,q=Math.PI*(j+1)/bands,r=Math.sin(p),s=Math.sin(q),dy=Math.cos(p)-Math.cos(q);V+=A*dy*(r*r+r*s+s*s)/3}return V})();
export function limewaterGeometry(q:LimewaterInputs,seconds?:number){const s=limewaterState(q),a=limewaterApparatus,sourceArea=limewaterPolygonArea(a.sourceRadius),receiverArea=limewaterPolygonArea(a.receiverRadius),syringeArea=limewaterPolygonArea(a.syringeRadius),
 sourceFillHeight=s.sourceFillMl/sourceArea,receiverFillHeight=s.receiverFillMl/receiverArea,
 sourceGrainRadius=Math.cbrt(s.sourceSolidMl/(a.sourceGrains*limewaterUnitSphereVolume)),
 receiverParticleRadius=Math.cbrt(s.receiverSolidMl/(a.receiverParticles*limewaterUnitSphereVolume)),
 syringeGasLength=s.syringeMl/syringeArea,guide=seconds===undefined?null:limewaterGuide(seconds,q);
 if(guide&&(Math.abs(guide.inputs.reactionFraction-q.reactionFraction)>1e-13||Math.abs(guide.inputs.transferFraction-q.transferFraction)>1e-13))throw new RangeError('Geometry requires current guided generation and transfer fractions');
 const sourceGrainPositions=Array.from({length:a.sourceGrains},(_,i)=>[a.sourceX+(i%4-1.5)*.5,a.sourceBottom+sourceGrainRadius,(Math.floor(i/4)-1.5)*.5]as LimewaterVector),
 receiverParticlePositions=Array.from({length:a.receiverParticles},(_,i)=>{const theta=i*Math.PI*(3-Math.sqrt(5)),radial=Math.sqrt(((i*37)%64+.5)/64)*(a.receiverRadius-receiverParticleRadius-.12),height=((i*23)%64+.5)/64;return[a.receiverX+Math.cos(theta)*radial,a.receiverBottom+receiverParticleRadius+(receiverFillHeight-2*receiverParticleRadius)*height,Math.sin(theta)*radial]as LimewaterVector});
 return{...s,sourceFillHeight,receiverFillHeight,sourceGrainRadius,receiverParticleRadius,sourceGrainPositions,receiverParticlePositions,
 sourceCapacityMl:sourceArea*a.sourceHeight,receiverCapacityMl:receiverArea*a.receiverHeight,
 syringeArea,syringeGasLength,syringeBarrelLength:a.syringeCapacityMl/syringeArea,
 plungerX:a.syringeX+syringeGasLength,
 sourceActive:!!guide?.sourceActive,receiverActive:!!guide?.receiverActive,bypassActive:!!guide?.receiverActive&&s.bypassMol>0,
 sourcePhase:guide?.sourcePhase??0,receiverPhase:guide?.receiverPhase??0};
}
/** Explanatory conduit paths;markers carry no additional uncounted gas inventory. */
export const limewaterPaths:{source:LimewaterVector[];receiver:LimewaterVector[];bypass:LimewaterVector[]}={source:[[-8,5,0],[-8,11,0],[-5,11,0]],receiver:[[-5,11,0],[-5,8,0],[8,8,0],[8,1.2,0]],bypass:[[8.8,7,0],[10.5,7,0],[10.5,9,0]]};
export function limewaterPathPoint(points:LimewaterVector[],fraction:number):LimewaterVector{if(points.length<2||points.some(p=>p.length!==3||p.some(v=>!Number.isFinite(v)))||!Number.isFinite(fraction)||fraction<0||fraction>1)throw new RangeError('Finite path and fraction0–1 required');const lengths=points.slice(1).map((p,i)=>Math.hypot(...p.map((v,j)=>v-points[i][j]))),total=lengths.reduce((a,b)=>a+b,0);if(!total)throw new RangeError('Nonzero conduit path required');let distance=fraction*total;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]&&lengths[i]>0)return points[i].map((v,j)=>v+(points[i+1][j]-v)*distance/lengths[i])as LimewaterVector;distance-=lengths[i]}return[...points.at(-1)!]}

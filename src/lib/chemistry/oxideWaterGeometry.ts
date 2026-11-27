import{oxideWaterState,oxideWaterGuide,oxideWaterConstants as k,type OxideWaterInputs}from'./oxideWater';
export const oxideWaterApparatus={acidX:-9,controlX:0,baseX:9,bottom:1,acidRadius:2.2,beakerRadius:2.3,beakerHeight:8,segments:128,syringeX:-10,syringeY:25,syringeRadius:1.15,syringeCapacityMl:100,oxideCount:32,hydroxideCount:64}as const;
/** Liquid and gas volumes in cm³=mL. Polygon areas match rendered128-sided cylinders. */
export function oxideWaterGeometry(q:OxideWaterInputs,seconds?:number){const s=oxideWaterState(q),a=oxideWaterApparatus,area=(r:number)=>a.segments*Math.sin(2*Math.PI/a.segments)*r*r/2,acidArea=area(a.acidRadius),beakerArea=area(a.beakerRadius),syringeArea=area(a.syringeRadius),guide=seconds===undefined?null:oxideWaterGuide(seconds,q);
 if(guide&&(['gasFraction','oxideFraction','hydrationFraction']as const).some(key=>Math.abs(guide.inputs[key]-q[key])>1e-12))throw new RangeError('Geometry must receive current guide extents');
 const particles=(volumeMl:number,count:number,x:number,layer:number)=>{const side=Math.cbrt(volumeMl/count);return{side,positions:Array.from({length:count},(_,i)=>{const theta=i*Math.PI*(3-Math.sqrt(5)),radius=Math.sqrt(((i*37)%count+.5)/count)*1.4;return[x+radius*Math.cos(theta),a.bottom+side/2+layer+((i*23)%count)/count*.12,radius*Math.sin(theta)]as[number,number,number]})}};
 const oxide=particles(s.oxideSolidG/k.oxideDensityGml,a.oxideCount,a.baseX,0),hydroxide=particles(s.hydroxideSolidG/k.hydroxideDensityGml,a.hydroxideCount,a.baseX,.2),pan=particles(s.oxidePanG/k.oxideDensityGml,a.oxideCount,a.baseX,0);
 // The pan is separate apparatus,not an additional copy of material in the beaker.
 const panParticles={...pan,positions:pan.positions.map(([x,y,z])=>[x,y+12,z]as[number,number,number])};
 return{acidArea,beakerArea,syringeArea,acidLiquidHeight:q.waterMl/acidArea,acidHeadspaceHeight:q.headspaceMl/acidArea,acidLidY:a.bottom+(q.waterMl+q.headspaceMl)/acidArea,
 controlLiquidHeight:q.waterMl/beakerArea,baseLiquidHeight:q.waterMl/beakerArea,baseDisplacedHeight:s.baseDisplacedMl/beakerArea,
 syringeGasLength:s.gasStoredMl/syringeArea,syringeBarrelLength:a.syringeCapacityMl/syringeArea,syringePlungerX:a.syringeX+s.gasStoredMl/syringeArea,
 oxideParticles:oxide,hydroxideParticles:hydroxide,panParticles,
 gasPath:[[a.syringeX,a.syringeY,0],[a.syringeX-2,a.syringeY,0],[a.acidX,a.bottom+(q.waterMl+q.headspaceMl)/acidArea,0]]as[number,number,number][],
 gasFlow:guide?.gasFlow??false,solidTransfer:guide?.solidTransfer??false,hydrating:guide?.hydrating??false,phase:seconds===undefined?0:(seconds%3)/3};
}
export function oxideWaterPathPoint(path:[number,number,number][],fraction:number):[number,number,number]{if(path.length<2||!Number.isFinite(fraction)||fraction<0||fraction>1||path.some(p=>p.some(v=>!Number.isFinite(v))))throw new RangeError('Finite path and fraction required');const lengths=path.slice(1).map((p,i)=>Math.hypot(...p.map((v,j)=>v-path[i][j]))),total=lengths.reduce((s,v)=>s+v,0);if(total===0)throw new RangeError('Nonzero path required');let left=total*fraction;for(let i=0;i<lengths.length;i++){if(left<=lengths[i]||i===lengths.length-1){const t=lengths[i]===0?0:left/lengths[i];return path[i].map((v,j)=>v+(path[i+1][j]-v)*t)as[number,number,number]}left-=lengths[i]}return path.at(-1)!}

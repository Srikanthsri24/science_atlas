/** Quasistatic cylinder containment with an optional vented base orifice.
 * cm, mL and s; no sloshing, capillarity, jet-flight inventory or seal deformation.
 * Discharge coefficient is an illustrative assumption, not a measured calibration.
 */
export type ContainerKind='open'|'sealed'|'holed';
export const containerRadiusCm=2.5,containerHeightCm=12,containerCapacityMl=Math.PI*2.5**2*12;
const R=containerRadiusCm,H=containerHeightCm,A=Math.PI*R*R,clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export function circleAreaBelow(q:number){if(q<=-R)return 0;if(q>=R)return A;return R*R*Math.acos(-q/R)+q*Math.sqrt(R*R-q*q)}
function areaPrimitive(q:number){if(q<=-R)return 0;if(q>=R)return A*q;const d=Math.sqrt(Math.max(0,R*R-q*q));return R*R*q*Math.acos(-q/R)+R*R*d-d**3/3}
export function cylinderVolumeBelow(heightCm:number,angleDeg:number){
 const theta=angleDeg*Math.PI/180,s=Math.sin(theta),c=Math.cos(theta);
 if(Math.abs(s)<1e-9)return A*clamp(heightCm+H/2,0,H);
 if(Math.abs(c)<1e-7)return H*circleAreaBelow(heightCm/s);
 return clamp(s/c*(areaPrimitive((heightCm+H/2*c)/s)-areaPrimitive((heightCm-H/2*c)/s)),0,containerCapacityMl);
}
export function waterSurfaceCm(volumeMl:number,angleDeg:number){const t=angleDeg*Math.PI/180,extent=H/2*Math.abs(Math.cos(t))+R*Math.sin(t);let lo=-extent,hi=extent;for(let i=0;i<40;i++){const mid=(lo+hi)/2;if(cylinderVolumeBelow(mid,angleDeg)<volumeMl)lo=mid;else hi=mid}return(lo+hi)/2}
export function openCapacityMl(angleDeg:number){if(angleDeg>=90)return 0;const t=angleDeg*Math.PI/180;return cylinderVolumeBelow(H/2*Math.cos(t)-R*Math.sin(t),angleDeg)}
const holeRadiusCm=.1,dischargeCoefficient=.62,gravityCmS2=981;
function leakRate(volume:number,angle:number){if(volume<=0)return 0;const head=Math.max(0,waterSurfaceCm(volume,angle)+H/2*Math.cos(angle*Math.PI/180));return dischargeCoefficient*Math.PI*holeRadiusCm**2*Math.sqrt(2*gravityCmS2*head)}
const cache=new Map<string,{v:Float64Array;s:Float64Array;l:Float64Array}>(),dt=.05;
function trajectory(kind:ContainerKind,initial:number,target:number){const key=`${kind}:${initial}:${target}`,old=cache.get(key);if(old)return old;const v=new Float64Array(601),s=new Float64Array(601),l=new Float64Array(601);v[0]=initial;for(let i=1;i<=600;i++){const midAngle=target*Math.min(1,(i-.5)*dt/20),endAngle=target*Math.min(1,i*dt/20);let volume=v[i-1],spill=s[i-1],leak=l[i-1];if(kind!=='sealed'){let cap=openCapacityMl(midAngle);spill+=Math.max(0,volume-cap);volume=Math.min(volume,cap);if(kind==='holed'){const q0=leakRate(volume,midAngle),qMid=leakRate(Math.max(0,volume-q0*dt/2),midAngle),loss=Math.min(volume,qMid*dt);volume-=loss;leak+=loss}cap=openCapacityMl(endAngle);spill+=Math.max(0,volume-cap);volume=Math.min(volume,cap)}v[i]=volume;s[i]=spill;l[i]=leak}const entry={v,s,l};if(cache.size>=96)cache.delete(cache.keys().next().value!);cache.set(key,entry);return entry}
export function liquidContainerState(kind:ContainerKind='open',initialMl=150,targetAngleDeg=90,timeS=0){
 if(!['open','sealed','holed'].includes(kind)||!Number.isFinite(initialMl)||initialMl<50||initialMl>200||!Number.isFinite(targetAngleDeg)||targetAngleDeg<0||targetAngleDeg>100||!Number.isFinite(timeS)||timeS<0||timeS>30)throw new RangeError('Container type, 50–200 mL, tilt 0–100° and time 0–30 s required');
 const path=trajectory(kind,initialMl,targetAngleDeg),position=timeS/dt,i=Math.min(600,Math.floor(position)),j=Math.min(600,i+1),f=position-i,mix=(a:Float64Array)=>a[i]+(a[j]-a[i])*f,angleDeg=targetAngleDeg*Math.min(1,timeS/20),capacityMl=kind==='sealed'?containerCapacityMl:openCapacityMl(angleDeg);let retainedMl=mix(path.v),spilledMl=mix(path.s);const leakedMl=mix(path.l),extra=Math.max(0,retainedMl-capacityMl);retainedMl-=extra;spilledMl+=extra;const surfaceCm=waterSurfaceCm(retainedMl,angleDeg),holeHeightCm=-H/2*Math.cos(angleDeg*Math.PI/180),headCm=retainedMl>0?Math.max(0,surfaceCm-holeHeightCm):0;
 return{kind,initialMl,targetAngleDeg,timeS,angleDeg,capacityMl,retainedMl,spilledMl,leakedMl,collectedMl:spilledMl+leakedMl,accountedMl:retainedMl+spilledMl+leakedMl,surfaceCm,headCm,holeHeightCm,holeRadiusCm,dischargeCoefficient,gravityCmS2,leakRateMlS:kind==='holed'?leakRate(retainedMl,angleDeg):0,spillRateMlS:j>i?(path.s[j]-path.s[i])/dt:0,retentionPercent:100*retainedMl/initialMl,collectorDepthCm:(spilledMl+leakedMl)/300};
}
export function liquidContainerFrame(time:number){if(!Number.isFinite(time))throw new RangeError('Finite guide time required');const t=clamp(time,0,110),index=clamp(Math.floor((t-10)/30),0,2),kind=(['open','sealed','holed'] as const)[index];return{kind,initialMl:150,targetAngleDeg:90,timeS:t<10?0:clamp(t-10-index*30,0,30),caption:t<10?'Compare equal amounts of water in three containers. Predict which can carry water upright and which can retain it when tilted.':t<40?'Tilt the open tumbler slowly. The water surface stays horizontal; water spills once it reaches the lowest point of the rim.':t<70?'Repeat with the watertight lid fitted. The container turns, but water remains inside. This model assumes a perfect seal.':t<100?'The open cup with a base hole loses water through the hole and can also spill at its rim. Watch both paths and record them separately.':'Use retained, spilled and leaked volumes as evidence. Choose a container for the intended task; retained plus collected water must equal the starting amount.'}}

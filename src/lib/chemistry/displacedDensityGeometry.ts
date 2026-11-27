import{displacedDensityState,densityMeniscusRise,type DisplacedDensityInputs}from'./displacedDensity';
export type DensityPoint=[number,number,number];
/** Closed water boundary with a specimen-shaped cavity and calibrated wall rise.
 * Tessellation is a visual approximation; readings use the analytic model.
 */
export function displacedDensityWater(q:DisplacedDensityInputs){const s=displacedDensityState(q),N=96,T=36,rings=12,out:number[]=[];
 const tri=(a:DensityPoint,b:DensityPoint,c:DensityPoint,n:DensityPoint)=>{const u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]),cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],dot=cross.reduce((sum,x,i)=>sum+x*n[i],0);out.push(...a,...(dot<0?c:b),...(dot<0?b:c))};
 const intersect=s.submergedMl>0&&s.topYcm>s.levelCm,cap=intersect?Math.sqrt(Math.max(0,1-((s.levelCm-s.centreYcm)/s.semiYcm)**2)):0,hx=s.semiXcm*cap,hz=s.semiZcm*cap;
 const surface=(t:number,u:number):DensityPoint=>{const x=(hx+(s.radiusCm-hx)*u)*Math.cos(t),z=(hz+(s.radiusCm-hz)*u)*Math.sin(t);return[x,s.levelCm+densityMeniscusRise(Math.min(s.radiusCm,Math.hypot(x,z))),z]};
 for(let i=0;i<N;i++){const a=i*2*Math.PI/N,b=(i+1)*2*Math.PI/N;for(let j=0;j<rings;j++){const pa=surface(a,j/rings),pb=surface(b,j/rings),pc=surface(a,(j+1)/rings),pd=surface(b,(j+1)/rings);tri(pa,pb,pc,[0,1,0]);tri(pb,pd,pc,[0,1,0]);}const topA=surface(a,1),topB=surface(b,1),baseA:DensityPoint=[topA[0],0,topA[2]],baseB:DensityPoint=[topB[0],0,topB[2]],normal:DensityPoint=[Math.cos((a+b)/2),0,Math.sin((a+b)/2)];tri(baseA,baseB,topA,normal);tri(baseB,topB,topA,normal);tri([0,0,0],baseA,baseB,[0,-1,0]);}
 if(s.submergedMl>0){const thetaMax=Math.acos(Math.max(-1,Math.min(1,(s.centreYcm-s.levelCm)/s.semiYcm))),point=(t:number,a:number):DensityPoint=>[s.semiXcm*Math.sin(t)*Math.cos(a),s.centreYcm-s.semiYcm*Math.cos(t),s.semiZcm*Math.sin(t)*Math.sin(a)];for(let j=0;j<T;j++)for(let i=0;i<N;i++){const a=i*2*Math.PI/N,b=(i+1)*2*Math.PI/N,t0=j*thetaMax/T,t1=(j+1)*thetaMax/T,pa=point(t0,a),pb=point(t0,b),pc=point(t1,a),pd=point(t1,b),m=point((t0+t1)/2,(a+b)/2),normal:DensityPoint=[-m[0]/s.semiXcm**2,-(m[1]-s.centreYcm)/s.semiYcm**2,-m[2]/s.semiZcm**2];tri(pa,pb,pc,normal);tri(pb,pd,pc,normal);}}
 return new Float32Array(out);
}
export function densityMeshVolume(vertices:Float32Array){let v=0;for(let i=0;i<vertices.length;i+=9){const a=vertices.slice(i,i+3),b=vertices.slice(i+3,i+6),c=vertices.slice(i+6,i+9);v+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6}return v;}
/** Prescribed quasistatic transfer path: lift above rim,translate,then lower.
 * The same specimen never crosses the cylinder wall. Presentation progress
 * does not predict actuator dynamics. During transfer retain the earlier dry
 * balance reading as a saved measurement,not a live pan force.
 */
export function densitySpecimenPose(q:DisplacedDensityInputs,transfer=q.station==='immerse'?1:0){const s=displacedDensityState(q);if(!Number.isFinite(transfer)||transfer<0||transfer>1)throw new RangeError('Transfer progress0–1');const balanceX=-9,cylinderX=9,panY=3,clearY=s.rimCm+1+s.semiYcm,ease=(v:number)=>v*v*(3-2*v);if(q.station==='immerse')return{x:cylinderX,y:s.centreYcm,z:0,savedDryReading:true};if(transfer<=.25)return{x:balanceX,y:panY+s.semiYcm+(clearY-panY-s.semiYcm)*ease(transfer*4),z:0,savedDryReading:transfer>0};if(transfer<=.75)return{x:balanceX+(cylinderX-balanceX)*ease((transfer-.25)*2),y:clearY,z:0,savedDryReading:true};return{x:cylinderX,y:clearY+(s.initialLevelCm+s.semiYcm-clearY)*ease((transfer-.75)*4),z:0,savedDryReading:true};}

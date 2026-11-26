import{solidDisplacementState,type DisplacementSpecimen}from'./solidDisplacement';
export const displacementVesselRadiusCm=Math.sqrt(16/Math.PI),displacementReceiverRadiusCm=Math.sqrt(4/Math.PI);
type Point=[number,number,number];
/** Closed liquid boundary with an actual specimen-shaped cavity. Triangle
 * tessellation approximates the exact analytic volume used by the readings.
 * Coordinates are reference centimetres, with vessel floor at y=0. */
export function displacementWaterMesh(specimen:DisplacementSpecimen='glass',volumeCm3=20,waterML=50,timeS=0){
 const s=solidDisplacementState(specimen,volumeCm3,waterML,timeS),g=s.shape,R=displacementVesselRadiusCm,N=96,T=40,h=s.levelCm,b=s.bottomCm,top=b+g.heightCm,positions:number[]=[];
 function tri(a:Point,b:Point,c:Point,n:Point){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],dot=(uy*vz-uz*vy)*n[0]+(uz*vx-ux*vz)*n[1]+(ux*vy-uy*vx)*n[2];if(dot<0)positions.push(...a,...c,...b);else positions.push(...a,...b,...c)}
 const circ=(r:number,y:number,a:number):Point=>[r*Math.cos(a),y,r*Math.sin(a)],ellipse=(x:number,z:number,y:number,a:number):Point=>[x*Math.cos(a),y,z*Math.sin(a)];
 let holeX=0,holeZ=0;if(h>b&&h<=top){const f=g.kind==='cylinder'?1:Math.sqrt(Math.max(0,1-((h-b-g.semiY)/g.semiY)**2));holeX=g.semiX*f;holeZ=g.semiZ*f}
 for(let i=0;i<N;i++){const a=i*2*Math.PI/N,z=(i+1)*2*Math.PI/N,oa=circ(R,h,a),ob=circ(R,h,z),ia=ellipse(holeX,holeZ,h,a),ib=ellipse(holeX,holeZ,h,z),ba=circ(R,0,a),bb=circ(R,0,z),radial:Point=[Math.cos((a+z)/2),0,Math.sin((a+z)/2)];tri(oa,ob,ia,[0,1,0]);tri(ob,ib,ia,[0,1,0]);tri(ba,bb,oa,radial);tri(bb,ob,oa,radial);tri([0,0,0],ba,bb,[0,-1,0])}
 const depth=Math.max(0,Math.min(g.heightCm,h-b));
 if(depth>0&&g.kind==='ellipsoid'){
  const maxTheta=Math.acos(Math.max(-1,Math.min(1,1-depth/g.semiY))),point=(theta:number,phi:number):Point=>[g.semiX*Math.sin(theta)*Math.cos(phi),b+g.semiY*(1-Math.cos(theta)),g.semiZ*Math.sin(theta)*Math.sin(phi)];
  for(let j=0;j<T;j++)for(let i=0;i<N;i++){const a=i*2*Math.PI/N,z=(i+1)*2*Math.PI/N,t0=j*maxTheta/T,t1=(j+1)*maxTheta/T,pa=point(t0,a),pb=point(t0,z),pc=point(t1,a),pd=point(t1,z),mid=point((t0+t1)/2,(a+z)/2),normal:Point=[-mid[0]/g.semiX**2,-(mid[1]-b-g.semiY)/g.semiY**2,-mid[2]/g.semiZ**2];tri(pa,pb,pc,normal);tri(pb,pd,pc,normal)}
 }else if(depth>0){for(let i=0;i<N;i++){const a=i*2*Math.PI/N,z=(i+1)*2*Math.PI/N,pa=ellipse(g.semiX,g.semiZ,b,a),pb=ellipse(g.semiX,g.semiZ,b,z),pc=ellipse(g.semiX,g.semiZ,b+depth,a),pd=ellipse(g.semiX,g.semiZ,b+depth,z),normal:Point=[-Math.cos((a+z)/2),0,-Math.sin((a+z)/2)];tri(pa,pb,pc,normal);tri(pb,pd,pc,normal);tri([0,b,0],pa,pb,[0,1,0]);if(h>top)tri([0,top,0],pc,pd,[0,-1,0])}}
 return new Float32Array(positions);
}
export function displacementGeometry(specimen:DisplacementSpecimen='glass',volumeCm3=20,waterML=50,timeS=0){const s=solidDisplacementState(specimen,volumeCm3,waterML,timeS);return{state:s,objectCenterY:s.bottomCm+s.shape.semiY,receiverDepthCm:s.capturedOverflowML/4,overflowPhase:s.capturedOverflowML/2%1}}
export function displacementNumber(v:number,places=5){if(!Number.isFinite(v))throw new RangeError('Finite measurement required');return v!==0&&Math.abs(v)<10**-places?`${v<0?'−':''}<${(10**-places).toFixed(places)}`:v.toFixed(places)}

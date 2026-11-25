/** Faceted closed liquid mesh for a cylinder clipped by a horizontal world plane.
 * Local cylinder axis is y. Rotate the mesh around z by angleDeg. The clipping
 * normal rotates into world +y, keeping the liquid free surface horizontal.
 * 128 rim facets approximate curved glass/liquid boundaries, not model volume.
 */
import{waterSurfaceCm,containerRadiusCm as R,containerHeightCm as H}from './liquidContainer';
export type ContainerPoint=[number,number,number];
const dot=(a:ContainerPoint,b:ContainerPoint)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export function liquidCylinderTriangles(volumeMl:number,angleDeg:number,segments=128){
 if(!Number.isFinite(volumeMl)||volumeMl<0||volumeMl>Math.PI*R*R*H||!Number.isFinite(angleDeg)||angleDeg<0||angleDeg>100||!Number.isInteger(segments)||segments<16||segments>256)throw new RangeError('Supported cylinder volume, angle and 16–256 facets required');
 if(volumeMl<=1e-10)return new Float32Array();
 const theta=angleDeg*Math.PI/180,normal:ContainerPoint=[Math.sin(theta),Math.cos(theta),0],plane=waterSurfaceCm(volumeMl,angleDeg),bottom:ContainerPoint[]=[],top:ContainerPoint[]=[],cuts:ContainerPoint[]=[],triangles:number[]=[];
 for(let i=0;i<segments;i++){const a=i/segments*2*Math.PI;bottom.push([R*Math.cos(a),-H/2,R*Math.sin(a)]);top.push([R*Math.cos(a),H/2,R*Math.sin(a)])}
 function clip(face:ContainerPoint[]){const result:ContainerPoint[]=[];for(let i=0;i<face.length;i++){const a=face[i],b=face[(i+1)%face.length],da=dot(normal,a)-plane,db=dot(normal,b)-plane;if(da<=0)result.push(a);if((da<0&&db>0)||(da>0&&db<0)){const f=da/(da-db),p:ContainerPoint=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];result.push(p);if(!cuts.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])<1e-7))cuts.push(p)}}return result}
 function add(face:ContainerPoint[]){for(let i=1;i+1<face.length;i++)triangles.push(...face[0],...face[i],...face[i+1])}
 // Winding is outward for the cylinder's side and end faces.
 add(clip(bottom));add(clip([...top].reverse()));for(let i=0;i<segments;i++){const j=(i+1)%segments;add(clip([bottom[i],top[i],top[j],bottom[j]]))}
 if(cuts.length>=3){const center:ContainerPoint=[0,0,0];for(const p of cuts){center[0]+=p[0]/cuts.length;center[1]+=p[1]/cuts.length;center[2]+=p[2]/cuts.length}const axis:ContainerPoint=[Math.cos(theta),-Math.sin(theta),0];cuts.sort((a,b)=>Math.atan2(-(a[2]-center[2]),dot(axis,[a[0]-center[0],a[1]-center[1],a[2]-center[2]]))-Math.atan2(-(b[2]-center[2]),dot(axis,[b[0]-center[0],b[1]-center[1],b[2]-center[2]])));add(cuts)}
 return new Float32Array(triangles);
}
export function liquidSectionPolygon(volumeMl:number,angleDeg:number){if(volumeMl<=0)return[];const t=angleDeg*Math.PI/180,n:ContainerPoint=[Math.sin(t),Math.cos(t),0],plane=waterSurfaceCm(volumeMl,angleDeg),points:ContainerPoint[]=[[-R,-H/2,0],[R,-H/2,0],[R,H/2,0],[-R,H/2,0]],result:ContainerPoint[]=[];for(let i=0;i<4;i++){const a=points[i],b=points[(i+1)%4],da=dot(n,a)-plane,db=dot(n,b)-plane;if(da<=0)result.push(a);if(da*db<0){const f=da/(da-db);result.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,0])}}return result}

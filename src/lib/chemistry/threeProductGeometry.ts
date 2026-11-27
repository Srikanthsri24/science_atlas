/** Inventory-scaled representative grains;not a crystal habit/size distribution. */
export interface ProductGeometryInputs{ironG:number;sandG:number;solidSaltG:number;dissolvedSaltG:number;waterG:number}
export function threeProductGeometry(q:ProductGeometryInputs){
 if(Object.values(q).some(x=>!Number.isFinite(x)||x<0)||q.ironG>10||q.sandG>20||q.solidSaltG+q.dissolvedSaltG>10.00000001||q.waterG>150.00000001)throw new RangeError('Supported component inventories required');
 const radius=4,area=Math.PI*radius**2,rim=5,grains:{x:number;y:number;z:number;radius:number;kind:'iron'|'sand'|'salt';volume:number}[]=[];
 for(const[kind,mass,density,ring]of[['iron',q.ironG,7.87,1.2],['sand',q.sandG,2.65,2.25],['salt',q.solidSaltG,2.165,3.3]]as const){
  if(mass<=1e-12)continue;const volume=mass/density/12,r=Math.cbrt(3*volume/(4*Math.PI));
  for(let i=0;i<12;i++){const a=i/12*2*Math.PI;grains.push({x:ring*Math.cos(a),y:r,z:ring*Math.sin(a),radius:r,kind,volume})}
 }
 const submerged=(level:number)=>grains.reduce((v,g)=>{const h=Math.max(0,Math.min(2*g.radius,level));return v+Math.PI*h*h*(g.radius-h/3)},0);
 const solutionVolumeMl=q.waterG+.3*q.dissolvedSaltG;
 let lo=0,hi=rim;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(area*mid-submerged(mid)<solutionVolumeMl)lo=mid;else hi=mid}
 const level=solutionVolumeMl>0?(lo+hi)/2:0;
 if(level>=rim-1e-8)throw new RangeError('Reference vessel capacity exceeded');
 return{radius,area,rim,grains,solutionVolumeMl,level,submergedSolidMl:submerged(level),solidVolumeMl:grains.reduce((n,g)=>n+g.volume,0)};
}

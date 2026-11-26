/** Closed outward annular cylinder with actual ring caps (no overlapping disks).
 * Units follow the caller; centimetres give signed volume in cm³/mL.
 */
export function annulusTriangles(outerRadius:number,innerRadius:number,height:number,centreY:number,sides=128){
 if(![outerRadius,innerRadius,height,centreY].every(Number.isFinite)||outerRadius<0||innerRadius<0||innerRadius>outerRadius||height<0||!Number.isInteger(sides)||sides<3||sides>512)throw new RangeError('Finite ordered nonnegative radii/height, centre and3–512sides required');
 if(height===0||outerRadius===innerRadius)return[];
 const out:number[]=[],low=centreY-height/2,high=centreY+height/2;
 for(let i=0;i<sides;i++){
  const t=i*2*Math.PI/sides,u=(i+1)*2*Math.PI/sides;
  const a=[outerRadius*Math.cos(t),low,outerRadius*Math.sin(t)],b=[outerRadius*Math.cos(u),low,outerRadius*Math.sin(u)],
   c=[a[0],high,a[2]],d=[b[0],high,b[2]],e=[innerRadius*Math.cos(t),low,innerRadius*Math.sin(t)],f=[innerRadius*Math.cos(u),low,innerRadius*Math.sin(u)],g=[e[0],high,e[2]],h=[f[0],high,f[2]];
  out.push(...a,...c,...b,...b,...c,...d);
  if(innerRadius>0)out.push(...e,...f,...g,...f,...h,...g,...a,...b,...e,...b,...f,...e,...c,...g,...d,...d,...g,...h);
  else out.push(...e,...a,...b,...g,...d,...c);
 }
 return out;
}

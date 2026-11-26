import {coolingCrystalState,coolingCrystalReference as ref,type CoolingCrystalInputs} from './coolingCrystalGrowth';
export type CoolingVector=[number,number,number];
export const coolingVessel={radiusCm:4.7,bottomCm:1,heightCm:5,sides:128,
  waterDensityGcm3:1,dissolvedPartialCm3g:.45,spacingCm:1.65};
/** Fixed weighted apparatus forms show total solid volume. Effective N and
 * equivalent mean radius are separate measurements, not this drawing count. */
export const coolingCentres:CoolingVector[]=Array.from({length:25},(_,i)=>
  [i%5-2,0,Math.floor(i/5)-2] as CoolingVector)
  .filter(p=>!(Math.abs(p[0])===2&&Math.abs(p[2])===2))
  .map(p=>[p[0]*coolingVessel.spacingCm,0,p[2]*coolingVessel.spacingCm]);

export function coolingCrystalDimensions(solidG:number) {
  if(!Number.isFinite(solidG)||solidG<0) throw new RangeError('Nonnegative solid mass required');
  const volume=solidG/ref.densityGcm3/coolingCentres.length;
  const scale=Math.cbrt(volume/(1.6*1.6/2*.9*11/15));
  return {widthCm:1.6*scale,depthCm:1.6*scale,heightCm:.9*scale,
    perVolumeCm3:volume,perMassG:solidG/coolingCentres.length,
    rotatedHalfWidthCm:1.6*scale/(2*Math.sqrt(2))};
}
export function coolingCrystalGeometry(q:CoolingCrystalInputs,program:'fast'|'slow') {
  const s=coolingCrystalState(q,program),a=coolingVessel,d=coolingCrystalDimensions(s.crystalG);
  const floorAreaCm2=a.sides*a.radiusCm**2*Math.sin(2*Math.PI/a.sides)/2;
  const solutionVolumeCm3=q.waterG/a.waterDensityGcm3+s.dissolvedG*a.dissolvedPartialCm3g;
  const liquidDepthCm=(solutionVolumeCm3+s.crystalVolumeCm3)/floorAreaCm2;
  return {...s,...d,floorAreaCm2,solutionVolumeCm3,liquidDepthCm,
    liquidSurfaceY:a.bottomCm+liquidDepthCm,solidTopY:a.bottomCm+d.heightCm};
}

/** Rotated capped rhombic forms. Lower/upper tips each occupy 0.2h,
 * middle prism 0.6h: V=(width*depth/2)*height*11/15. */
export function coolingSolidTriangles(solidG:number) {
  const d=coolingCrystalDimensions(solidG); if(solidG===0) return [];
  const out:number[]=[],tri=(a:CoolingVector,b:CoolingVector,c:CoolingVector)=>out.push(...a,...b,...c);
  const ring:CoolingVector[]=[[d.widthCm/2,0,0],[0,0,-d.depthCm/2],[-d.widthCm/2,0,0],[0,0,d.depthCm/2]];
  for(const center of coolingCentres) {
    const p=(v:CoolingVector):CoolingVector=>[(v[0]-v[2])/Math.sqrt(2)+center[0],
      v[1]+coolingVessel.bottomCm,(v[0]+v[2])/Math.sqrt(2)+center[2]];
    const bottom=p([0,0,0]),top=p([0,d.heightCm,0]);
    const low=ring.map(v=>p([v[0],d.heightCm*.2,v[2]]));
    const high=ring.map(v=>p([v[0],d.heightCm*.8,v[2]]));
    for(let i=0;i<4;i++) { const j=(i+1)%4;
      tri(bottom,low[j],low[i]);tri(low[i],low[j],high[j]);
      tri(low[i],high[j],high[i]);tri(high[i],high[j],top);
    }
  }
  return out;
}
/** Closed fluid boundary subtracts solid cavities, including displacement. */
export function coolingLiquidTriangles(q:CoolingCrystalInputs,program:'fast'|'slow') {
  const g=coolingCrystalGeometry(q,program),a=coolingVessel,out:number[]=[];
  const tri=(p:CoolingVector,q:CoolingVector,r:CoolingVector)=>out.push(...p,...q,...r);
  const bottom:CoolingVector=[0,a.bottomCm,0],top:CoolingVector=[0,g.liquidSurfaceY,0];
  for(let i=0;i<a.sides;i++) {
    const angle=2*Math.PI*i/a.sides,next=2*Math.PI*(i+1)/a.sides;
    const b0:CoolingVector=[a.radiusCm*Math.cos(angle),a.bottomCm,a.radiusCm*Math.sin(angle)];
    const b1:CoolingVector=[a.radiusCm*Math.cos(next),a.bottomCm,a.radiusCm*Math.sin(next)];
    const t0:CoolingVector=[b0[0],g.liquidSurfaceY,b0[2]],t1:CoolingVector=[b1[0],g.liquidSurfaceY,b1[2]];
    tri(bottom,b0,b1);tri(top,t1,t0);tri(b0,t0,t1);tri(b0,t1,b1);
  }
  const solids=coolingSolidTriangles(g.crystalG);
  for(let i=0;i<solids.length;i+=9)out.push(...solids.slice(i,i+3),...solids.slice(i+6,i+9),...solids.slice(i+3,i+6));
  return out;
}
export function coolingHistory(q:CoolingCrystalInputs,program:'fast'|'slow') {
  const end=coolingCrystalState(q,program),times=new Set([0,q.timeS]);
  for(const t of [q.fastCoolingS,q.fastCoolingS*q.slowMultiplier])if(t<=q.timeS)times.add(t);
  for(let i=1;i<60;i++)times.add(Math.min(q.timeS,q.timeS*i/60));
  return [...times].sort((a,b)=>a-b).map(timeS=>{
    const s=timeS===q.timeS?end:coolingCrystalState({...q,timeS},program);
    return {timeS,temperature:s.temperatureC,dissolved:s.dissolvedG,solid:s.crystalG,
      sites:s.sites,meanRadius:s.meanEquivalentRadiusCm,supersaturation:s.supersaturation};
  });
}

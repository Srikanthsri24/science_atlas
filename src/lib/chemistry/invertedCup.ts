/** CL-0067. Vertical quasi-static cup immersion in a finite water reservoir.
 * Trapped isothermal air versus an ideal atmospheric vent with no dead volume.
 */
export type CupCondition='trapped'|'vented';
export interface CupInputs {cupRadiusCm:number;cupHeightCm:number;basinRadiusCm:number;maximumInsertionCm:number;atmosphericKPa:number;temperatureC:number;timeSeconds:number}
export const cupConditions:CupCondition[]=['trapped','vented'];
export const cupConditionNames:Record<CupCondition,string>={trapped:'Trapped-air cup',vented:'Atmospherically vented cup'};
export const cupReference={R:8.314462618,molarMassKg:.02897,waterDensityKgM3:1000,g:9.81,sides:128,wallThicknessCm:.15,capThicknessCm:.15,waterDepthCm:35,basinTopY:10,ventOutletY:16,markerBelowRoofCm:.5};
export const defaultCupInputs:CupInputs={cupRadiusCm:2.5,cupHeightCm:10,basinRadiusCm:8,maximumInsertionCm:25,atmosphericKPa:101.325,temperatureC:25,timeSeconds:0};
export const cupUnitArea=cupReference.sides*Math.sin(2*Math.PI/cupReference.sides)/2;
export function checkCup(q:CupInputs){
 if(!q||![q.cupRadiusCm,q.cupHeightCm,q.basinRadiusCm,q.maximumInsertionCm,q.atmosphericKPa,q.temperatureC,q.timeSeconds].every(Number.isFinite)
 ||q.cupRadiusCm<2||q.cupRadiusCm>3||q.cupHeightCm<6||q.cupHeightCm>12||q.basinRadiusCm<7||q.basinRadiusCm>10||q.maximumInsertionCm<0||q.maximumInsertionCm>30
 ||q.atmosphericKPa<80||q.atmosphericKPa>120||q.temperatureC<15||q.temperatureC>35||q.timeSeconds<0||q.timeSeconds>160)
 throw new RangeError('Cup radius2–3cm,height6–12cm,basin radius7–10cm,insertion0–30cm,absolute atmosphere80–120kPa,temperature15–35°C,time0–160s required');
}
const limit=(x:number,low:number,high:number)=>Math.max(low,Math.min(high,x));
export function cupMotion(q:CupInputs){
 checkCup(q);const t=q.timeSeconds,D=q.maximumInsertionCm;
 return {insertionCm:t<50?D*t/50:t<90?D:t<140?D*(140-t)/50:0,
  insertionSpeedCmS:D===0?0:t>0&&t<50?D/50:t>=90&&t<140?-D/50:0,
  peakInsertionCm:t<50?D*t/50:D,
  stage:t<50?'Lower the inverted cup vertically':t<90?'Hold the rim at depth':t<140?'Raise the cup vertically':'Observe the returned cup'};
}
export function cupAtInsertion(q:CupInputs,condition:CupCondition,insertionCm:number){
 checkCup(q);if(!cupConditions.includes(condition)||!Number.isFinite(insertionCm)||insertionCm<0||insertionCm>30)throw new RangeError('Supported cup condition and insertion0–30cm required');
 const c=cupReference,A=cupUnitArea*q.cupRadiusCm**2,outerRadiusCm=q.cupRadiusCm+c.wallThicknessCm,Aouter=cupUnitArea*outerRadiusCm**2,B=cupUnitArea*q.basinRadiusCm**2,H=q.cupHeightCm;
 const hydroKPaPerCm=c.waterDensityKgM3*c.g/100000,T=q.temperatureC+273.15,initialGasMl=A*H;
 const initialAmountMol=q.atmosphericKPa*(initialGasMl/1000)/(c.R*T);
 function sample(surface:number){
  const D=insertionCm+surface;
  // Stable small root of k*x²-[P0+k(D+H)]x+kDH=0.
  const C=q.atmosphericKPa+hydroKPaPerCm*(D+H);
  const discriminant=Math.sqrt(q.atmosphericKPa**2+2*q.atmosphericKPa*hydroKPaPerCm*(D+H)+hydroKPaPerCm**2*(D-H)**2);
  const waterHeightCm=condition==='vented'?limit(D,0,H):2*hydroKPaPerCm*D*H/(C+discriminant);
  const waterInsideMl=A*waterHeightCm;
  const submergedEnvelopeMl=Aouter*limit(D,0,H+c.capThicknessCm);
  const displacedMl=submergedEnvelopeMl-waterInsideMl;
  return {D,waterHeightCm,waterInsideMl,submergedEnvelopeMl,displacedMl,residual:B*surface-displacedMl};
 }
 let surfaceCm=0;
 if(insertionCm>0){let low=0,high=Aouter*(H+c.capThicknessCm)/B;for(let i=0;i<70;i++){const mid=(low+high)/2;if(sample(mid).residual>0)high=mid;else low=mid}surfaceCm=(low+high)/2}
 const e=sample(surfaceCm),gasHeightCm=H-e.waterHeightCm,gasVolumeMl=A*gasHeightCm,gasPresent=gasVolumeMl>0;
 const gasPressureKPa:number|null=gasPresent?(condition==='trapped'?q.atmosphericKPa*H/gasHeightCm:q.atmosphericKPa):null;
 const amountMol=condition==='trapped'?initialAmountMol:gasVolumeMl*q.atmosphericKPa/1000/(c.R*T);
 const rimY=-insertionCm,roofY=H-insertionCm,interfaceY=rimY+e.waterHeightCm;
 const submergedWallMl=(Aouter-A)*limit(e.D,0,H),submergedCapMl=Aouter*limit(e.D-H,0,c.capThicknessCm);
 const submergedGasMl=A*limit(e.D-e.waterHeightCm,0,gasHeightCm);
 const initialWaterMl=B*c.waterDepthCm;
 const outsideWaterMl=B*(c.waterDepthCm+surfaceCm)-submergedWallMl-submergedCapMl-submergedGasMl-e.waterInsideMl;
 const hydrostaticInterfaceKPa=gasPresent?q.atmosphericKPa+hydroKPaPerCm*(surfaceCm-interfaceY):null;
 return {...q,condition,insertionCm,innerAreaCm2:A,outerAreaCm2:Aouter,basinAreaCm2:B,outerRadiusCm,temperatureK:T,hydroKPaPerCm,
  initialGasMl,initialAmountMol,surfaceCm,actualRimDepthCm:e.D,rimY,roofY,outerTopY:roofY+c.capThicknessCm,interfaceY,
  waterHeightCm:e.waterHeightCm,waterInsideMl:e.waterInsideMl,gasHeightCm,gasVolumeMl,gasPresent,gasPressureKPa,amountMol,
  initialGasMassG:initialAmountMol*c.molarMassKg*1000,gasMassG:amountMol*c.molarMassKg*1000,
  hydrostaticInterfaceKPa,rimWaterPressureKPa:q.atmosphericKPa+hydroKPaPerCm*e.D,
  waterAtRoofKPa:q.atmosphericKPa+hydroKPaPerCm*Math.max(0,surfaceCm-roofY),
  submergedWallMl,submergedCapMl,submergedGasMl,submergedEnvelopeMl:e.submergedEnvelopeMl,displacedMl:e.displacedMl,surfaceResidualMl:e.residual,
  initialWaterMl,outsideWaterMl,totalWaterMl:outsideWaterMl+e.waterInsideMl,
  pressureVolumeJ:gasPressureKPa===null?null:gasPressureKPa*gasVolumeMl/1000,idealGasJ:amountMol*c.R*T,
  markerHeightCm:H-c.markerBelowRoofCm,markerContactNow:e.waterHeightCm>=H-c.markerBelowRoofCm};
}
export function cupState(q:CupInputs=defaultCupInputs,condition:CupCondition='trapped'){
 const motion=cupMotion(q),s=cupAtInsertion(q,condition,motion.insertionCm),peak=cupAtInsertion(q,condition,motion.peakInsertionCm);
 const airOutMol=condition==='trapped'?0:Math.max(0,s.initialAmountMol-peak.amountMol);
 const airInMol=condition==='trapped'?0:Math.max(0,s.amountMol-peak.amountMol);
 const annulus=s.outerAreaCm2-s.innerAreaCm2;
 const outwardFlowMolS=condition==='vented'&&s.gasPresent?s.atmosphericKPa*s.innerAreaCm2/(1000*cupReference.R*s.temperatureK)*s.basinAreaCm2/(s.basinAreaCm2-annulus)*motion.insertionSpeedCmS:0;
 return {...s,...motion,airOutMol,airInMol,outwardFlowMolS,markerEverContacted:peak.markerContactNow,
  airInventoryResidualMol:s.initialAmountMol+airInMol-airOutMol-s.amountMol,
  observation:condition==='trapped'?'The vertical rim retains air. Water enters a small distance and compresses the isothermal pocket.':s.gasPresent?'An ideal vent exchanges air with the atmosphere; the internal water surface matches the outside level.':'The cup cavity is flooded. No retained cup gas pocket exists, so a gas-pressure reading is not defined.'};
}
export const cupComparison=(q:CupInputs)=>cupConditions.map(c=>cupState(q,c));
export function cupHistory(q:CupInputs,condition:CupCondition){checkCup(q);return Array.from({length:61},(_,i)=>cupState({...q,timeSeconds:q.timeSeconds*i/60},condition))}
export function cupGuide(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('Finite guide time required');
 const t=Math.max(0,Math.min(120,seconds)),timeSeconds=Math.max(0,Math.min(160,(t-10)*1.6));
 const caption=t<10?'Invert two dry reference cups at the water surface. Keep both vertical; one retains air and one has an atmospheric vent.':t<41.25?'Lower the cups slowly. The trapped pocket compresses; vented air can leave and water can enter. The finite basin level also changes.':t<66.25?'Hold at depth. Compare water height inside, retained air volume and the contact marker beneath the roof.':t<97.5?'Raise both cups vertically. Trapped air expands again; the vented cup takes air back in as water drains.':t<110?'Compare the returned preparations. A marker that contacted water keeps that history; it does not become instantly dry.':'Record observations and apply pressure, volume and water-inventory calculations. This model uses quasi-static, isothermal references, not actual wave or paper-wicking dynamics.';
 return {timeSeconds,caption,samples:cupComparison({...defaultCupInputs,timeSeconds})};
}

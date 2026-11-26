/** CL-0062. Prepared reference buffers hold their selected pH. Indicator is
 * a non-perturbing tracer; colour anchors/opacity are illustrative, not a
 * calibrated cabbage spectrum, unknown-sample pH meter or titration model.
 */
export interface CabbageInputs {
  acidPH:number;basePH:number;sampleMl:number;doseMl:number;drops:number;
  intervalS:number;pigmentMgMl:number;timeS:number;
}
export type CabbageSample='acid'|'neutral'|'base';
export const cabbageReference={temperatureC:25,kw:1e-14,fallHeightM:.08,gravityMs2:9.81,
  firstReleaseS:2,maximumTimeS:65,drawingDensityGml:1,drawingOpacityMlMg:40};
export const defaultCabbageInputs:CabbageInputs={acidPH:3,basePH:10,sampleMl:20,
  doseMl:.6,drops:12,intervalS:4,pigmentMgMl:.5,timeS:0};
export function checkCabbage(q:CabbageInputs) {
  if(!q||![q.acidPH,q.basePH,q.sampleMl,q.doseMl,q.drops,q.intervalS,q.pigmentMgMl,q.timeS].every(Number.isFinite)
    ||q.acidPH<2||q.acidPH>6||q.basePH<8||q.basePH>12||q.sampleMl<10||q.sampleMl>30
    ||q.doseMl<0||q.doseMl>1.2||!Number.isInteger(q.drops)||q.drops<6||q.drops>12
    ||q.intervalS<2||q.intervalS>5||q.pigmentMgMl<0||q.pigmentMgMl>1||q.timeS<0||q.timeS>65)
    throw new RangeError('AcidpH2–6,basepH8–12,sample10–30mL,dose0–1.2mL,6–12integerdrops,interval2–5s,pigment0–1mg/mL,time0–65s required');
}
const anchors=[{pH:2,rgb:[219,52,91]},{pH:4,rgb:[207,75,155]},
  {pH:6,rgb:[144,91,177]},{pH:7,rgb:[108,88,183]},
  {pH:8,rgb:[67,119,184]},{pH:10,rgb:[59,158,126]},{pH:12,rgb:[171,180,62]}];
export function cabbageColour(referencePH:number) {
  if(!Number.isFinite(referencePH)||referencePH<2||referencePH>12)throw new RangeError('Reference pH2–12 required');
  const hi=anchors.findIndex(p=>p.pH>=referencePH),upper=anchors[hi],lower=anchors[Math.max(0,hi-1)];
  const f=upper.pH===lower.pH?0:(referencePH-lower.pH)/(upper.pH-lower.pH);
  const rgb=lower.rgb.map((v,i)=>Math.round(v+f*(upper.rgb[i]-v)));
  return {rgb,hex:'#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join(''),
    description:referencePH<=4?'red / pink reference':referencePH<7?'pink-purple reference':referencePH===7?'purple-blue neutral reference':referencePH<10?'blue / blue-green reference':referencePH<12?'green reference':'yellow-green reference',
    limitation:'Chosen qualitative colour palette, not calibrated hue-to-pH data.'};
}
export function cabbageState(q:CabbageInputs=defaultCabbageInputs,sample:CabbageSample='acid') {
  checkCabbage(q);if(!['acid','neutral','base'].includes(sample))throw new RangeError('Acid,neutral orbase sample required');
  const c=cabbageReference,flightS=Math.sqrt(2*c.fallHeightM/c.gravityMs2),dropMl=q.doseMl/q.drops;
  const events=Array.from({length:q.drops},(_,i)=>({index:i,releaseS:c.firstReleaseS+i*q.intervalS,
    arrivalS:c.firstReleaseS+i*q.intervalS+flightS}));
  const releasedCount=q.doseMl===0?0:events.filter(e=>q.timeS>=e.releaseS).length;
  const arrivedCount=q.doseMl===0?0:events.filter(e=>q.timeS>=e.arrivalS).length;
  const releasedMl=releasedCount*dropMl,arrivedMl=arrivedCount*dropMl;
  const reservoirMl=(q.drops-releasedCount)*dropMl,inFlightMl=(releasedCount-arrivedCount)*dropMl;
  const vesselMl=q.sampleMl+arrivedMl,pigmentInitialMg=q.doseMl*q.pigmentMgMl;
  const reservoirPigmentMg=reservoirMl*q.pigmentMgMl,inFlightPigmentMg=inFlightMl*q.pigmentMgMl;
  const vesselPigmentMg=arrivedMl*q.pigmentMgMl,concentrationMgMl=vesselPigmentMg/vesselMl;
  const referencePH=sample==='acid'?q.acidPH:sample==='base'?q.basePH:7;
  const hMolL=10**(-referencePH),ohMolL=c.kw/hMolL,colour=cabbageColour(referencePH);
  const hasIndicator=vesselPigmentMg>0,opacity=-Math.expm1(-c.drawingOpacityMlMg*concentrationMgMl);
  const inFlight=q.doseMl===0?[]:events.filter(e=>q.timeS>=e.releaseS&&q.timeS<e.arrivalS).map(e=>{
    const ageS=q.timeS-e.releaseS;return {...e,ageS,volumeMl:dropMl,pigmentMg:dropMl*q.pigmentMgMl,
      heightAboveSurfaceCm:100*Math.max(0,c.fallHeightM-.5*c.gravityMs2*ageS**2)};
  });
  return {...q,sample,flightS,dropMl,dropRadiusCm:Math.cbrt(3*dropMl/(4*Math.PI)),releasedCount,arrivedCount,
    releasedMl,arrivedMl,reservoirMl,inFlightMl,vesselMl,pigmentInitialMg,reservoirPigmentMg,
    inFlightPigmentMg,vesselPigmentMg,concentrationMgMl,referencePH,hMolL,ohMolL,colour,hasIndicator,opacity,inFlight,
    liquidAccountedMl:reservoirMl+inFlightMl+vesselMl,
    pigmentAccountedMg:reservoirPigmentMg+inFlightPigmentMg+vesselPigmentMg,
    initialLiquidMl:q.sampleMl+q.doseMl,wholeDrawingMassG:(q.sampleMl+q.doseMl)*c.drawingDensityGml,
    observedColour:hasIndicator?colour.description:'No visible indicator colour',
    interpretation:'Prepared ideal reference buffers hold pH at25°C. Indicator assumed non-perturbing and instantly mixed after arrival. Chosen pigment concentration,colour anchors anddrawing opacity are not measured cabbage calibration. No unknown-sample pH inference,buffer-capacity calculation,neutralization oranthocyanin-species kinetics.'};
}
export function cabbageComparison(q:CabbageInputs=defaultCabbageInputs) {
  return {acid:cabbageState(q,'acid'),neutral:cabbageState(q,'neutral'),base:cabbageState(q,'base')};
}
export function cabbageGuide(seconds:number) {
  if(!Number.isFinite(seconds))throw new RangeError('Finite presentation time required');
  const presentationS=Math.min(120,Math.max(0,seconds));
  const timeS=presentationS<=10?0:presentationS>=110?65:(presentationS-10)*.65;
  return {...cabbageComparison({...defaultCabbageInputs,timeS}),presentationS,timeS,
    caption:presentationS<10?'Prepare three equal reference samples and matched indicator dispensers. Their acid,neutral andbase pH values are known settings.':timeS<48?'Follow metered drops from dispenser to sample. Compare colour at equal dose; pigment and liquid stay accounted for.':'Compare the reference colours. Try no-dose or pigment-free controls in your own investigation. Colour suggests a category here; it does not measure an unknown sample’s exact pH.'};
}

/** CL-0036. Quasistatic immersion in a reference-area graduated vessel.
 * A prescribed hanger lowers, holds and withdraws a dense insoluble solid.
 * Water displaced over the rim remains in the receiver after withdrawal.
 * No wetting film, meniscus correction, bubbles, absorption, splash, drag,
 * drainage transit inventory or calibrated material density is solved.
 */
export type DisplacementSpecimen='glass'|'steel'|'stone';
export const displacementSpecimens={glass:{title:'Glass sphere',densityGCm3:2.5},steel:{title:'Steel cylinder',densityGCm3:7.8},stone:{title:'Stone ellipsoid',densityGCm3:2.7}} as const;
export const displacementReference={areaCm2:16,capacityML:100,waterDensityGCm3:1,gravityMS2:9.81,baseClearanceCm:.15} as const;
export function displacementShape(specimen:DisplacementSpecimen,volumeCm3:number){
 if(!Object.hasOwn(displacementSpecimens,specimen)||!Number.isFinite(volumeCm3)||volumeCm3<5||volumeCm3>30)throw new RangeError('Supported specimen and volume5–30cm³ required');
 const r=Math.cbrt(3*volumeCm3/(4*Math.PI)),q=Math.cbrt(volumeCm3/Math.PI),semiX=specimen==='steel'?.8*q:specimen==='stone'?1.1*r:r,semiZ=specimen==='steel'?.8*q:specimen==='stone'?.85*r:r,semiY=specimen==='steel'?q/(2*.64):specimen==='stone'?r/(1.1*.85):r;
 return{specimen,volumeCm3,kind:specimen==='steel'?'cylinder' as const:'ellipsoid' as const,semiX,semiY,semiZ,heightCm:2*semiY,densityGCm3:displacementSpecimens[specimen].densityGCm3};
}
export function displacementImmersedVolume(specimen:DisplacementSpecimen,volumeCm3:number,depthCm:number){
 const g=displacementShape(specimen,volumeCm3);if(!Number.isFinite(depthCm))throw new RangeError('Finite depth required');const u=Math.max(0,Math.min(1,depthCm/g.heightCm));return volumeCm3*(g.kind==='cylinder'?u:u*u*(3-2*u));
}
export function displacementMotion(timeS:number){
 if(!Number.isFinite(timeS)||timeS<0||timeS>120)throw new RangeError('Time0–120s required');
 const insertion=timeS<10?0:timeS<40?(timeS-10)/30:timeS<=60?1:timeS<90?1-(timeS-60)/30:0;
 return{insertion,peakInsertion:timeS<40?insertion:1,stage:timeS<10?'baseline':timeS<40?'lowering':timeS<=60?'immersed hold':timeS<90?'withdrawal':'clear after withdrawal'};
}
export function solidDisplacementState(specimen:DisplacementSpecimen='glass',solidVolumeCm3=20,initialWaterML=50,timeS=0){
 const shape=displacementShape(specimen,solidVolumeCm3),motion=displacementMotion(timeS),r=displacementReference;
 if(!Number.isFinite(initialWaterML)||initialWaterML<40||initialWaterML>80)throw new RangeError('Initial water40–80mL required');
 const rimCm=r.capacityML/r.areaCm2,startBottomCm=rimCm+.5,
  bottomAt=(insertion:number)=>startBottomCm-(startBottomCm-r.baseClearanceCm)*insertion,
  bottomCm=bottomAt(motion.insertion),peakBottomCm=bottomAt(motion.peakInsertion),
  rimDisplacementAtPeakML=displacementImmersedVolume(specimen,solidVolumeCm3,rimCm-peakBottomCm),
  capturedOverflowML=Math.max(0,initialWaterML+rimDisplacementAtPeakML-r.capacityML),
  remainingWaterML=initialWaterML-capturedOverflowML;
 let lo=0,hi=rimCm;for(let i=0;i<64;i++){const h=(lo+hi)/2,occupiedML=r.areaCm2*h-displacementImmersedVolume(specimen,solidVolumeCm3,h-bottomCm);if(occupiedML<remainingWaterML)lo=h;else hi=h}
 const levelCm=(lo+hi)/2,readingML=r.areaCm2*levelCm,immersedVolumeML=displacementImmersedVolume(specimen,solidVolumeCm3,levelCm-bottomCm),
  naiveRiseML=readingML-initialWaterML,correctedDisplacedML=Math.max(0,naiveRiseML+capturedOverflowML),
  solidMassG=shape.densityGCm3*solidVolumeCm3,weightN=solidMassG/1000*r.gravityMS2,
  buoyancyN=r.waterDensityGCm3*1000*r.gravityMS2*immersedVolumeML*1e-6,tensionN=weightN-buoyancyN,
  rimDepth=rimCm-bottomCm,sectionCoordinate=(rimDepth-shape.semiY)/shape.semiY,
  rimSectionCm2=rimDepth<=0||rimDepth>=shape.heightCm?0:Math.PI*shape.semiX*shape.semiZ*(shape.kind==='cylinder'?1:1-sectionCoordinate**2),
  overflowRateMLs=motion.stage==='lowering'&&capturedOverflowML>0?rimSectionCm2*(startBottomCm-r.baseClearanceCm)/30:0;
 return{specimen,solidVolumeCm3,initialWaterML,timeS,shape,...motion,rimCm,bottomCm,levelCm,readingML,immersedVolumeML,
  capturedOverflowML,remainingWaterML,naiveRiseML,correctedDisplacedML,solidMassG,weightN,buoyancyN,tensionN,
  apparentMassG:tensionN/r.gravityMS2*1000,waterAccountedML:remainingWaterML+capturedOverflowML,overflowRateMLs,
  fullySubmerged:levelCm>=bottomCm+shape.heightCm-1e-10};
}
export function solidDisplacementWorked(specimen:DisplacementSpecimen='glass',solidVolumeCm3=20,initialWaterML=50,timeS=0){
 const s=solidDisplacementState(specimen,solidVolumeCm3,initialWaterML,timeS),n=(x:number)=>Math.abs(x)<1e-12?'0.000000':x.toFixed(6);
 return `Reference cylinder area A=16 cm²; rim capacity100 mL, so rim height=100/16=6.25 cm. 1 mL=1 cm³=10⁻⁶ m³. Initial reading V1=${initialWaterML} mL. At ${n(timeS)} s (${s.stage}), solid bottom=${n(s.bottomCm)} cm above the vessel base and water level=${n(s.levelCm)} cm. Current reading V2=A×h=16×${n(s.levelCm)}=${n(s.readingML)} mL. Captured overflow=${n(s.capturedOverflowML)} mL. Remaining vessel water=${initialWaterML}−${n(s.capturedOverflowML)}=${n(s.remainingWaterML)} mL. Water closure:${n(s.remainingWaterML)}+${n(s.capturedOverflowML)}=${initialWaterML} mL. Simple reading change V2−V1=${n(s.readingML)}−${initialWaterML}=${n(s.naiveRiseML)} mL. Corrected immersed volume=V2−V1+captured overflow=${n(s.readingML)}−${initialWaterML}+${n(s.capturedOverflowML)}=${n(s.correctedDisplacedML)} cm³. ${s.fullySubmerged?'The solid is fully submerged, so this immersed volume equals its full volume.':'The solid is not fully submerged: do not report this immersed volume as its full volume.'} Reference solid density=${s.shape.densityGCm3} g/cm³; mass=ρV=${s.shape.densityGCm3}×${solidVolumeCm3}=${n(s.solidMassG)} g. Weight=(mass/1000)×9.81=${n(s.weightN)} N. Buoyancy=ρ_water g V_immersed=1000×9.81×(${n(s.immersedVolumeML)}×10⁻⁶)=${n(s.buoyancyN)} N. Hanger tension=weight−buoyancy=${n(s.weightN)}−${n(s.buoyancyN)}=${n(s.tensionN)} N. The solid stays clear of the base; quasistatic tension is a teacher extension. Any overflow stays captured after lifting; it does not return automatically. Densities, flat reference level and slow prescribed motion are teaching approximations.`;
}
export function solidDisplacementGuide(t:number){
 if(!Number.isFinite(t)||t<0||t>110)throw new RangeError('Guide time0–110s required');
 const timeS=Math.max(0,Math.min(120,(t-10)*1.5)),stage=displacementMotion(timeS).stage,
  caption=t<10?'Record the initial water reading. An insoluble solid hangs clear above the vessel. Predict whether partial and complete immersion give the same volume difference.'
   :stage==='baseline'?'Read the initial level at eye height while the solid is still clear. All water remains in the vessel; no solid volume is immersed yet.'
   :stage==='lowering'?'Lower the solid slowly. Its immersed part excludes water, so the level rises. Read at eye level and distinguish immersed volume from the whole object.'
   :stage==='immersed hold'?'With the solid fully underwater, compare the before and after readings. Check for captured overflow before using the simple difference. Neither solid mass nor water has vanished.'
   :stage==='withdrawal'?'Lift the solid clear. As its immersed volume decreases, the level falls. Captured overflow stays in the receiver rather than returning automatically.'
   :t<90?'After lifting, the solid displaces no water. With no overflow the original water level returns; after an overflow trial the vessel retains less water.'
   :'A fully immersed solid displaces its volume. Add captured overflow when required, and never use a partial-immersion reading as the full solid volume. Repeat with shape and starting-water controls.';
 return{specimen:'glass' as const,solidVolumeCm3:20,initialWaterML:50,timeS,caption};
}

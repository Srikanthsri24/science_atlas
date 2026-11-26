/** CL-0063: dilute ideal HCl/NaOH, complete dissociation, 25 °C.
 * Water autoionization and electroneutrality are retained near equivalence.
 * Metered aliquots fall from a fixed burette tip, then instantly mix/react.
 * No heat balance, finite mixing kinetics, activity correction or CO2 uptake.
 */
export interface NeutralizationInputs {
 acidMl:number;acidMolL:number;baseMolL:number;plannedBaseMl:number;
 aliquots:number;intervalS:number;timeS:number;
}
export const neutralizationReference={kw:1e-14,temperatureC:25,gravityCmS2:981,firstReleaseS:2,
 maximumTimeS:105,tipY:7,vesselBottomY:1.5,vesselRadiusCm:2.5,sides:128,
 buretteCapacityMl:50,buretteRadiusCm:.8,drawingDensityGml:1};
const polygonArea=(r:number)=>128*Math.sin(2*Math.PI/128)/2*r*r;
export const neutralizationVesselArea=polygonArea(2.5),neutralizationBuretteArea=polygonArea(.8);
/** Volume of the closed 32-sector/24-band triangulated unit UV sphere.
 * Each band is a regular polygonal frustum; this normalization gives the
 * renderer's actual mesh the metered volume, rather than an approximate one.
 */
export const neutralizationUnitDropVolume=(()=>{let v=0;const a=32*Math.sin(2*Math.PI/32)/2;
 for(let j=0;j<24;j++){const p=Math.PI*j/24,q=Math.PI*(j+1)/24,r=Math.sin(p),s=Math.sin(q);
  v+=a*(Math.cos(p)-Math.cos(q))*(r*r+r*s+s*s)/3}return v})();
export const defaultNeutralizationInputs:NeutralizationInputs={acidMl:20,acidMolL:.01,baseMolL:.01,
 plannedBaseMl:40,aliquots:400,intervalS:.2,timeS:0};
export function checkNeutralization(q:NeutralizationInputs){
 if(!q||![q.acidMl,q.acidMolL,q.baseMolL,q.plannedBaseMl,q.aliquots,q.intervalS,q.timeS].every(Number.isFinite)
  ||q.acidMl<10||q.acidMl>30||q.acidMolL<0||q.acidMolL>.02||q.baseMolL<0||q.baseMolL>.02
  ||q.plannedBaseMl<0||q.plannedBaseMl>40||!Number.isInteger(q.aliquots)||q.aliquots<200||q.aliquots>400
  ||q.intervalS<.15||q.intervalS>.25||q.timeS<0||q.timeS>105)
  throw new RangeError('Acid10–30mL, acid/base0–0.02mol/L, plannedbase0–40mL,200–400integeraliquots,interval0.15–0.25s,time0–105s required');
}
export function neutralizationAtVolume(q:NeutralizationInputs,deliveredMl:number){
 checkNeutralization(q);if(!Number.isFinite(deliveredMl)||deliveredMl<0||deliveredMl>q.plannedBaseMl)throw new RangeError('Delivered volume must be within the planned dose');
 const c=neutralizationReference,vesselMl=q.acidMl+deliveredMl,volumeL=vesselMl/1000;
 const initialAcidMol=q.acidMolL*q.acidMl/1000,deliveredBaseMol=q.baseMolL*deliveredMl/1000;
 const neutralizedMol=Math.min(initialAcidMol,deliveredBaseMol),acidExcessMol=Math.max(0,initialAcidMol-deliveredBaseMol),baseExcessMol=Math.max(0,deliveredBaseMol-initialAcidMol);
 const chlorideMolL=initialAcidMol/volumeL,sodiumMolL=deliveredBaseMol/volumeL;
 const chargeDifferenceMolL=(initialAcidMol-deliveredBaseMol)/volumeL;
 const root=Math.hypot(chargeDifferenceMolL,2*Math.sqrt(c.kw));
 // Rationalized basic branch avoids subtracting almost equal positive numbers.
 const hMolL=chargeDifferenceMolL>=0?(chargeDifferenceMolL+root)/2:2*c.kw/(root-chargeDifferenceMolL);
 const ohMolL=c.kw/hMolL,pH=-Math.log10(hMolL),pOH=-Math.log10(ohMolL);
 const equivalentBaseMl=q.baseMolL===0?null:q.acidMolL*q.acidMl/q.baseMolL;
 const equivalentAliquots=equivalentBaseMl===null||q.plannedBaseMl===0?null:equivalentBaseMl*q.aliquots/q.plannedBaseMl;
 return {deliveredMl,vesselMl,volumeL,initialAcidMol,deliveredBaseMol,neutralizedMol,acidExcessMol,baseExcessMol,
  chlorideMolL,sodiumMolL,chargeDifferenceMolL,hMolL,ohMolL,pH,pOH,equivalentBaseMl,equivalentAliquots,
  equivalentWithinPlan:equivalentBaseMl!==null&&equivalentBaseMl<=q.plannedBaseMl,
  positiveChargeMolL:hMolL+sodiumMolL,negativeChargeMolL:ohMolL+chlorideMolL,
  category:chargeDifferenceMolL>0?'acidic':chargeDifferenceMolL<0?'basic':'neutral',
  interpretation:'Ideal strong-acid/strong-base reference at25°C. Complete dissociation, additive solution volumes and instantaneous whole-aliquot mixing. Ion activities approximated by concentrations; water autoionization retained. Acid/base excess values are stoichiometric equivalents, not intact HCl/NaOH molecule counts. Indicator endpoint is not automatically the equivalence point.'};
}
export function neutralizationEvents(q:NeutralizationInputs){
 checkNeutralization(q);const c=neutralizationReference,dropMl=q.plannedBaseMl/q.aliquots;
 const meshRadiusCm=Math.cbrt(dropMl/neutralizationUnitDropVolume);
 return Array.from({length:q.aliquots},(_,index)=>{
  const releaseS=c.firstReleaseS+index*q.intervalS,preArrivalMl=q.acidMl+index*dropMl;
  const surfaceBeforeY=c.vesselBottomY+preArrivalMl/neutralizationVesselArea;
  const bottomClearanceCm=c.tipY-2*meshRadiusCm-surfaceBeforeY;
  const flightS=Math.sqrt(2*bottomClearanceCm/c.gravityCmS2);
  return {index,releaseS,arrivalS:releaseS+flightS,flightS,surfaceBeforeY,bottomClearanceCm,meshRadiusCm,dropMl};
 });
}
export function neutralizationState(q:NeutralizationInputs=defaultNeutralizationInputs){
 const events=neutralizationEvents(q),c=neutralizationReference,dropMl=q.plannedBaseMl/q.aliquots;
 const releasedCount=q.plannedBaseMl===0?0:events.filter(e=>q.timeS>=e.releaseS).length;
 const arrivedCount=q.plannedBaseMl===0?0:events.filter(e=>q.timeS>=e.arrivalS).length;
 const releasedMl=q.plannedBaseMl*(releasedCount/q.aliquots),deliveredMl=q.plannedBaseMl*(arrivedCount/q.aliquots);
 // Integer-count expressions avoid negative final residues from subtraction.
 const reservoirMl=q.plannedBaseMl*((q.aliquots-releasedCount)/q.aliquots),inFlightMl=q.plannedBaseMl*((releasedCount-arrivedCount)/q.aliquots);
 const s=neutralizationAtVolume(q,deliveredMl),inFlight=q.plannedBaseMl===0?[]:events.filter(e=>q.timeS>=e.releaseS&&q.timeS<e.arrivalS).map(e=>{
  const ageS=q.timeS-e.releaseS;return {...e,ageS,centreY:c.tipY-e.meshRadiusCm-.5*c.gravityCmS2*ageS**2};
 });
 return {...q,...s,dropMl,releasedCount,arrivedCount,releasedMl,reservoirMl,inFlightMl,inFlight,
  initialBuretteReadingMl:c.buretteCapacityMl-q.plannedBaseMl,buretteReadingMl:c.buretteCapacityMl-reservoirMl,
  reservoirBaseMol:q.baseMolL*reservoirMl/1000,inFlightBaseMol:q.baseMolL*inFlightMl/1000,
  initialBaseMol:q.baseMolL*q.plannedBaseMl/1000,
  liquidAccountedMl:reservoirMl+inFlightMl+s.vesselMl,initialLiquidMl:q.acidMl+q.plannedBaseMl,
  vesselSurfaceY:c.vesselBottomY+s.vesselMl/neutralizationVesselArea,
  reservoirDepthCm:reservoirMl/neutralizationBuretteArea,
  meshRadiusCm:Math.cbrt(dropMl/neutralizationUnitDropVolume),
  geometryNote:'Fixed burette tip. Each aliquot contacts the pre-arrival surface; its full volume then mixes. All permitted flight times are shorter than the release interval, so no earlier drop is still arriving. Volume-normalized UV meshes; not a splash/free-surface solver.'};
}
export function neutralizationCurve(q:NeutralizationInputs){
 const s=neutralizationState(q),n=s.arrivedCount;
 return Array.from({length:n+1},(_,i)=>neutralizationAtVolume(q,q.plannedBaseMl*(i/q.aliquots)));
}
export function neutralizationGuide(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('Finite guide time required');
 const presentationS=Math.min(120,Math.max(0,seconds)),timeS=Math.min(105,Math.max(0,(presentationS-10)*1.05));
 const s=neutralizationState({...defaultNeutralizationInputs,timeS});
 const caption=presentationS<10?'Start with known hydrochloric acid and a charged sodium-hydroxide burette. Predict the volume needed for equal acid and base equivalents.':s.deliveredMl<19?'Watch the burette empty and follow each metered aliquot into the acid. Delivered base reduces the acid excess; the pH rises.':s.deliveredMl<21?'Examine the steep pH change around 20 mL delivered. Equal stoichiometric amounts give pH 7 in this ideal 25 °C strong-acid/strong-base model.':'Keep adding base and observe the overshoot: extra hydroxide makes the solution basic. An indicator endpoint need not equal the stoichiometric equivalence point.';
 return {...s,presentationS,caption};
}

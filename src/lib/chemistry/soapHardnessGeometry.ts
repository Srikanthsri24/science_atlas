import{soapHardnessState,type SoapHardnessInputs}from'./soapHardness';
export const soapHardnessApparatus={sampleRadiusCm:2.1,sampleCapacityMl:180,stockRadiusCm:.7,stockCapacityMl:20,segments:128,baseY:.5}as const;
export function soapHardnessGeometry(q:SoapHardnessInputs,seconds?:number){
 if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>120))throw new RangeError('Scene guide time must be 0–120 seconds');
 const a=soapHardnessApparatus,area=(r:number)=>a.segments*r*r*Math.sin(2*Math.PI/a.segments)/2,sampleAreaCm2=area(a.sampleRadiusCm),stockAreaCm2=area(a.stockRadiusCm);
 const delivering=seconds!==undefined&&seconds>15&&seconds<65&&q.deliveredMl>0;
 const agitating=seconds!==undefined&&seconds>65&&seconds<105&&q.agitationCycles>0;
 return{sampleAreaCm2,stockAreaCm2,sampleHeightCm:a.sampleCapacityMl/sampleAreaCm2,stockHeightCm:a.stockCapacityMl/stockAreaCm2,delivering,agitating,
  phase:seconds===undefined?0:(seconds%2)/2,
  cells:soapHardnessState(q).cells.map((material,i)=>({id:material.id,material,x:(i%2)*12-6,z:i<2?-5:5,
   liquidHeightCm:material.nominalFinalMl/sampleAreaCm2,stockHeightCm:(20-q.deliveredMl)/stockAreaCm2,
   shakeOffsetCm:agitating?.15*Math.sin(2*Math.PI*q.agitationCycles):0,
   bubbleCount:Math.floor(material.foamProxy*24)}))};
}

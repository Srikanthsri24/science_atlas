import{soapDetergentState,type SoapDetergentInputs}from'./soapDetergent';
/** Original nominal apparatus, centimetres/millilitres. No product-volume model. */
export const soapDetergentApparatus={bottomRadiusCm:3.7,neckRadiusCm:1.1,bodyHeightCm:7.5,neckHeightCm:1.6,baseY:.55,syringeRadiusCm:1.15,stockMl:20,segments:128}as const;
const a=soapDetergentApparatus;
export const soapDetergentPolygonFactor=a.segments*Math.sin(2*Math.PI/a.segments)/2;
const bodyVolume=(h:number)=>{const top=a.bottomRadiusCm-(a.bottomRadiusCm-a.neckRadiusCm)*h/a.bodyHeightCm;return soapDetergentPolygonFactor*h*(a.bottomRadiusCm*a.bottomRadiusCm+a.bottomRadiusCm*top+top*top)/3};
export const soapDetergentBodyCapacityMl=bodyVolume(a.bodyHeightCm);
export const soapDetergentCapacityMl=soapDetergentBodyCapacityMl+soapDetergentPolygonFactor*a.neckRadiusCm*a.neckRadiusCm*a.neckHeightCm;
export function soapDetergentFill(volumeMl:number){
 if(!Number.isFinite(volumeMl)||volumeMl<0||volumeMl>soapDetergentCapacityMl)throw new RangeError('Volume must fit the comparison flask');
 let bodyHeightCm=0,neckHeightCm=0;
 if(volumeMl>=soapDetergentBodyCapacityMl){bodyHeightCm=a.bodyHeightCm;neckHeightCm=(volumeMl-soapDetergentBodyCapacityMl)/(soapDetergentPolygonFactor*a.neckRadiusCm*a.neckRadiusCm);}
 else{let lo:number=0,hi:number=a.bodyHeightCm;for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(bodyVolume(mid)<volumeMl)lo=mid;else hi=mid;}bodyHeightCm=volumeMl===0?0:(lo+hi)/2;}
 const topRadiusCm=a.bottomRadiusCm-(a.bottomRadiusCm-a.neckRadiusCm)*bodyHeightCm/a.bodyHeightCm;
 return{bodyHeightCm,neckHeightCm,topRadiusCm,bottomRadiusCm:a.bottomRadiusCm,levelY:a.baseY+bodyHeightCm+neckHeightCm};
}
export function soapDetergentGeometry(q:SoapDetergentInputs,seconds?:number){
 if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>120))throw new RangeError('Geometry time must be 0–120 seconds');
 const state=soapDetergentState(q),stockAreaCm2=soapDetergentPolygonFactor*a.syringeRadiusCm*a.syringeRadiusCm,barrelHeightCm=a.stockMl/stockAreaCm2,neckTopY=a.baseY+a.bodyHeightCm+a.neckHeightCm,barrelBaseY=neckTopY+2.2;
 const delivering=seconds!==undefined&&seconds>15&&seconds<65&&q.deliveredMl>0,agitating=seconds!==undefined&&seconds>70&&seconds<110&&q.agitationCycles>0;
 const retract=seconds===undefined?1:Math.max(0,Math.min(1,(seconds-65)/2.5));
 // Raise the cap outside the flask, translate above the neck, then lower it.
 // This avoids passing the stopper through the glass during closure.
 let capOffsetX=0,capY=neckTopY+.15;
 if(seconds!==undefined&&seconds<70){const p=Math.max(0,Math.min(1,(seconds-67.5)/2.5));
  if(p<1/3){capOffsetX=-5.3;capY=.35+(neckTopY+2-.35)*p*3;}
  else if(p<2/3){capOffsetX=-5.3*(2-p*3);capY=neckTopY+2;}
  else{capOffsetX=0;capY=neckTopY+2-(2-.15)*(p*3-2);}
 }
 return{stockAreaCm2,barrelHeightCm,barrelBaseY,neckTopY,rodLengthCm:barrelHeightCm+2,delivering,agitating,flowPhase:seconds===undefined?0:(seconds%1.6)/1.6,
  cells:state.cells.map((material,i)=>{const stockMl=20-q.deliveredMl,stockHeightCm=stockMl/stockAreaCm2;return{id:material.id,material,x:(i%2)*15-7.5,z:i<2?-6.2:6.2,liquid:soapDetergentFill(material.nominalFinalMl),stockMl,stockHeightCm,plungerY:barrelBaseY+stockHeightCm,retractX:5.3*retract,retractY:retract,capOffsetX,capY,shakeOffsetCm:agitating?.15*Math.sin(2*Math.PI*q.agitationCycles):0,headGroup:material.isSoap?'carboxylate-negative':'glucoside-neutral'};})};
}

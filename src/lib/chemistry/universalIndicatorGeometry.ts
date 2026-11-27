import {universalState,universalGuide,universalReferencePH,type UniversalInputs} from './universalIndicator';
/** Centimetre rectangular cells,shallow cylindrical stock dishes and conical pipette tips. */
export function universalGeometry(q:UniversalInputs,seconds?:number){
 const state=universalState(q);if(seconds!==undefined)universalGuide(seconds,q);
 const cellWidthCm=2,cellDepthCm=2,cellRimCm=7,stockRadiusCm=3.5,stockRimCm=3,tipRadiusCm=.3,tipHeightCm=1.5,tipSlope=tipRadiusCm/tipHeightCm;
 const smooth=(x:number)=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const stations=state.cells.map((t,i)=>{
  const side=i===0?-1:1,stockX=side*5,stockZ=-4,cellX=side*4,cellZ=5,startLoad=i===0?12:58,endLoad=i===0?22:68,startDose=i===0?30:76,endDose=i===0?50:96;
  let x=stockX,z=stockZ,tipY=.1;
  if(seconds===undefined){if(t.fraction===1){x=side*8;z=1;tipY=8.5}else if(t.fraction>0||t.loadFraction===1){x=cellX;z=cellZ;tipY=7.8}}
  else if(seconds>=endLoad&&seconds<endLoad+2){tipY=.1+8.1*smooth((seconds-endLoad)/2)}
  else if(seconds>=endLoad+2&&seconds<startDose-2){const p=smooth((seconds-endLoad-2)/4);x=stockX+(cellX-stockX)*p;z=stockZ+(cellZ-stockZ)*p;tipY=8.2}
  else if(seconds>=startDose-2&&seconds<endDose){x=cellX;z=cellZ;tipY=8.2-.4*smooth((seconds-startDose+2)/2)}
  else if(seconds>=endDose){const p=smooth((seconds-endDose)/4);x=cellX+(side*8-cellX)*p;z=cellZ+(1-cellZ)*p;tipY=7.8+.7*p}
  const tipLiquidHeightCm=t.pipetteMl===0?0:Math.cbrt(3*t.pipetteMl/(Math.PI*tipSlope**2)),tipLiquidRadiusCm=tipSlope*tipLiquidHeightCm;
  return{...t,stockX,stockZ,cellX,cellZ,stockHeightCm:t.stockRemainingMl/(Math.PI*stockRadiusCm**2),cellHeightCm:t.volumeMl/(cellWidthCm*cellDepthCm),tipLiquidHeightCm,tipLiquidRadiusCm,actor:{x,z,tipY,aspirating:seconds===undefined?t.loadFraction>0&&t.loadFraction<1&&t.fraction===0:seconds>startLoad&&seconds<endLoad,dispensing:seconds===undefined?t.fraction>0&&t.fraction<t.loadFraction:seconds>startDose&&seconds<endDose,aspirationPhase:(t.loadedUl/5)%1,deliveryPhase:(t.deliveredUl/5)%1}};
 });
 const targetAngle=universalReferencePH.indexOf(q.pH)*Math.PI/3,comparisonAngle=seconds===undefined?targetAngle:targetAngle*smooth((seconds-96)/12);
 return{state,stations,cellWidthCm,cellDepthCm,cellRimCm,cellCapacityMl:cellWidthCm*cellDepthCm*cellRimCm,stockRadiusCm,stockRimCm,stockCapacityMl:Math.PI*stockRadiusCm**2*stockRimCm,tipRadiusCm,tipHeightCm,tipCapacityUl:Math.PI*tipRadiusCm**2*tipHeightCm/3*1000,comparisonAngle};
}

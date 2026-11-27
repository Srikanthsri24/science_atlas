import { cabbageState, cabbageGuide, type CabbageInputs } from './cabbageScale';
/** Centimetre ideal flat-bottom cylindrical vials; mL=cm³. */
export function cabbageGeometry(q: CabbageInputs, seconds?: number, selectedTube = 5) {
  if (!Number.isInteger(selectedTube) || selectedTube < 0 || selectedTube > 5) throw new RangeError('Selected tube0–5 required');
  const state=cabbageState(q), radiusCm=.85, bottomCm=0, rimCm=12;
  const tubes=state.tubes.map((t,i)=>({...t,x:(i%3-1)*3.5,z:i<3?-2.4:2.4,
    liquidHeightCm:t.volumeMl/(Math.PI*radiusCm**2),
    hatch:!t.complete,
  }));
  let target=selectedTube, progress=1, fromIndex:number|null=null, previous={x:7,z:-4};
  if(seconds!==undefined){
    cabbageGuide(seconds,q); // Validate presentation range through the scientific guide contract.
    if(seconds<15){target=0;progress=0;}
    else if(seconds>=104){target=5;progress=1-Math.min(1,(seconds-104)/5);}
    else{
      target=Math.min(5,Math.floor((seconds-15)/14));
      progress=Math.min(1,(seconds-(15+target*14))/5);
      if(target>0){fromIndex=target-1;previous={x:tubes[target-1].x,z:tubes[target-1].z};}
    }
  }
  const smooth=progress*progress*(3-2*progress), t=tubes[target];
  const actor={target,fromIndex,approach:smooth,x:previous.x+(t.x-previous.x)*smooth,z:previous.z+(t.z-previous.z)*smooth,
    tipY:13.2,active:seconds!==undefined&&seconds>=104?false:t.fraction>0&&t.fraction<1&&progress===1,
    phase:(t.deliveredUl/5)%1,
    reservoirRadiusCm:.15,
    reservoirLiquidHeightCm:(state.remainingStockUl/1000)/(Math.PI*.15**2),
  };
  return {state,tubes,actor,radiusCm,bottomCm,rimCm,
    capacityMl:Math.PI*radiusCm**2*(rimCm-bottomCm),
    indicatorReservoirCapacityUl:Math.PI*.15**2*4.5*1000};
}

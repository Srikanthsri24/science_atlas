import{neutralizationHeatState,neutralizationHeatGuide,type NeutralizationHeatInputs}from'./neutralizationHeat';
/** Use the actual regular128-sided renderer cross-section rather than πr². cm³=mL. */
export const neutralizationHeatApparatus={sides:128,cupRadiusCm:3.2,cupBottomCm:1,cupRimCm:9,
 reservoirRadiusCm:2.2,reservoirBottomCm:14,reservoirHeightCm:8,reservoirX:-2.2,tipX:0,tipY:12.5,
 probeX:1.5,probeBottomCm:1.15,probeTopCm:11}as const;
export const neutralizationHeatPolygonArea=(r:number)=>{if(!Number.isFinite(r)||r<=0)throw new RangeError('Positive radius required');return 128*Math.sin(2*Math.PI/128)*r*r/2};
export function neutralizationHeatGeometry(q:NeutralizationHeatInputs,seconds?:number){
 const s=neutralizationHeatState(q),a=neutralizationHeatApparatus,
 cupArea=neutralizationHeatPolygonArea(a.cupRadiusCm),reservoirArea=neutralizationHeatPolygonArea(a.reservoirRadiusCm),
 liquidHeightCm=s.solutionMl/cupArea,reservoirLiquidHeightCm=s.reservoirMl/reservoirArea,
 guide=seconds===undefined?null:neutralizationHeatGuide(seconds,q),flowing=!!guide?.delivering;
 // In guided mode the caller supplies guide.inputs. Reject a mismatched liquid state.
 if(guide&&Math.abs(guide.inputs.deliveredFraction-q.deliveredFraction)>1e-13)throw new RangeError('Geometry must receive the current guided inputs');
 return{...s,liquidHeightCm,liquidTopCm:a.cupBottomCm+liquidHeightCm,
 reservoirLiquidHeightCm,cupCapacityMl:cupArea*(a.cupRimCm-a.cupBottomCm),
 reservoirCapacityMl:reservoirArea*a.reservoirHeightCm,flowing,
 flowPhase:guide?.flowPhase??0,stirAngle:guide?.stirAngle??0,
 probeImmersed:a.probeBottomCm<a.cupBottomCm+liquidHeightCm,
 // Temperature dial is an annotated instrument scale,not a thermally expanding chemical liquid.
 thermometerFraction:(s.temperatureC-20)/25,
 energyArrowFraction:s.releasedJ===0?0:s.solutionJ/s.releasedJ};
}

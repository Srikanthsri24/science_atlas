import {cupState,cupReference,type CupInputs,type CupCondition} from './invertedCup';
import {rustCylinderTriangles} from './rustConditionsGeometry';import {annulusTriangles} from './closedAnnulus';
export function invertedCupGeometry(q:CupInputs,condition:CupCondition){
 const s=cupState(q,condition),floorY=-cupReference.waterDepthCm;
 const middleTopY=Math.min(s.surfaceCm,s.outerTopY);
 return {...s,floorY,waterBelowRimHeightCm:s.rimY-floorY,waterAroundCupHeightCm:middleTopY-s.rimY,waterAroundCupTopY:middleTopY,
  waterAboveCupHeightCm:Math.max(0,s.surfaceCm-s.outerTopY),markerY:s.rimY+s.markerHeightCm,
  geometryNote:'Closed128-polygon water phases separate below-rim, annular outside-cup, above-roof and inside-cup volumes without occupying glass or retained gas. Actual annular ring caps leave a genuine cavity. Cup stays vertical; camera orbit is not physical tilt. Vent path and contact marker have zero modeled dead volume/displacement. Marker indicates contact history, not paper absorption or drying. Gas colour must be labeled as an explanatory overlay.'};
}
export function invertedCupGasTriangles(q:CupInputs,condition:CupCondition){const s=invertedCupGeometry(q,condition);return rustCylinderTriangles(q.cupRadiusCm,s.gasHeightCm,(s.interfaceY+s.roofY)/2)}
export function invertedCupInsideWaterTriangles(q:CupInputs,condition:CupCondition){const s=invertedCupGeometry(q,condition);return rustCylinderTriangles(q.cupRadiusCm,s.waterHeightCm,(s.rimY+s.interfaceY)/2)}
export function invertedCupWallTriangles(q:CupInputs,condition:CupCondition){const s=invertedCupGeometry(q,condition);return annulusTriangles(s.outerRadiusCm,q.cupRadiusCm,q.cupHeightCm,(s.rimY+s.roofY)/2)}
export function invertedCupCapTriangles(q:CupInputs,condition:CupCondition){const s=invertedCupGeometry(q,condition);return rustCylinderTriangles(s.outerRadiusCm,cupReference.capThicknessCm,s.roofY+cupReference.capThicknessCm/2)}
export function invertedCupOutsideWaterTriangles(q:CupInputs,condition:CupCondition){
 const s=invertedCupGeometry(q,condition);
 return [...rustCylinderTriangles(q.basinRadiusCm,s.waterBelowRimHeightCm,(s.floorY+s.rimY)/2),
  ...annulusTriangles(q.basinRadiusCm,s.outerRadiusCm,s.waterAroundCupHeightCm,(s.rimY+s.waterAroundCupTopY)/2),
  ...rustCylinderTriangles(q.basinRadiusCm,s.waterAboveCupHeightCm,s.outerTopY+s.waterAboveCupHeightCm/2)];
}

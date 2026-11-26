import {airState,type AirInputs,type AirBoundary} from './airExpansion';
import {rustCylinderTriangles} from './rustConditionsGeometry';
import {annulusTriangles} from './closedAnnulus';
export const airApparatus={sides:128,innerRadiusCm:1.25,outerRadiusCm:1.32,gasBaseRadiusCm:1.34,bottomY:2,capacityMl:90,pistonThicknessCm:.35,rodLengthCm:4,jacketInnerRadiusCm:1.36,jacketOuterRadiusCm:2,jacketBottomY:1.6,jacketTopY:4.4};
const unitArea=128*Math.sin(2*Math.PI/128)/2;
export const airCrossSectionCm2=unitArea*airApparatus.innerRadiusCm**2;
export function airGeometry(q:AirInputs,boundary:AirBoundary){
 const s=airState(q,boundary),a=airApparatus,gasHeightCm=s.volumeMl/airCrossSectionCm2,gasTopY=a.bottomY+gasHeightCm;
 return {...s,gasHeightCm,gasBottomY:a.bottomY,gasTopY,initialGasTopY:a.bottomY+q.initialVolumeMl/airCrossSectionCm2,
  barrelTopY:a.bottomY+a.capacityMl/airCrossSectionCm2,pistonBottomY:gasTopY,pistonTopY:gasTopY+a.pistonThicknessCm,
  rodTopY:gasTopY+a.pistonThicknessCm+a.rodLengthCm,
  pressureGaugeFraction:(s.pressureKPa-60)/100,pressureGaugeAngleRad:(-120+240*(s.pressureKPa-60)/100)*Math.PI/180,
  gasThermometerFraction:s.gasC/90,jacketThermometerFraction:s.bathC/90,
  pistonSpeedCmS:s.volumeRateMlS/airCrossSectionCm2,
  absoluteHeatTransferredJ:s.segments.reduce((sum,p)=>sum+Math.abs(p.heatJ),0),
  geometryNote:'Closed128-sided gas volume has the actual model volume in cm³/mL. A frictionless ideal seal moves at imposed constant absolute pressure, or a rigid cap holds initial volume. No rod or probe intrudes into the gas. Thermostatted annular jacket remains below the lowest possible piston face and does not exert a modeled water head on it. The chosen lumped conductance is not calculated from jacket area or glass dimensions. Hardware, jacket water, friction/inertia and leaks are not part of the closed-air inventory.'};
}
export function airGasTriangles(q:AirInputs,boundary:AirBoundary){const g=airGeometry(q,boundary);return rustCylinderTriangles(airApparatus.innerRadiusCm,g.gasHeightCm,airApparatus.bottomY+g.gasHeightCm/2)}
export function airPistonTriangles(q:AirInputs){const g=airGeometry(q,'piston');return rustCylinderTriangles(airApparatus.innerRadiusCm,airApparatus.pistonThicknessCm,g.pistonBottomY+airApparatus.pistonThicknessCm/2)}
/** Closed outward annular reference-jacket water, outside the gas barrel. */
export function airJacketTriangles(){
 const a=airApparatus,h=a.jacketTopY-a.jacketBottomY,y=(a.jacketTopY+a.jacketBottomY)/2;
 return annulusTriangles(a.jacketOuterRadiusCm,a.jacketInnerRadiusCm,h,y);
}

import{waterCoolingState,type WaterCoolingInputs}from './waterCooling';
/** Constant reference densities:water1000kg/m³,ice917kg/m³. The latter is a
 * rounded near-melting value;thermal expansion within either phase is omitted.
 * Stacked regions show phase inventories,not a predicted crystal front or
 * freely floating ice. Ice is represented at the thermal-contact side. */
export function waterCoolingGeometry(q:WaterCoolingInputs){const s=waterCoolingState(q),waterDensityGMl=1,iceDensityGMl=.917,radiusCm=4,areaCm2=Math.PI*radiusCm**2,innerHeightCm=12,liquidVolumeMl=s.liquidG/waterDensityGMl,iceVolumeMl=s.iceG/iceDensityGMl,liquidHeightCm=liquidVolumeMl/areaCm2,iceHeightCm=iceVolumeMl/areaCm2,totalVolumeMl=liquidVolumeMl+iceVolumeMl,totalHeightCm=liquidHeightCm+iceHeightCm;return{waterDensityGMl,iceDensityGMl,radiusCm,areaCm2,innerHeightCm,liquidVolumeMl,iceVolumeMl,totalVolumeMl,liquidHeightCm,iceHeightCm,totalHeightCm,capacityMl:areaCm2*innerHeightCm,floorCm:.2,iceTopYcm:.2+iceHeightCm,sampleTopYcm:.2+totalHeightCm,rimYcm:12.2}}

import{waterHeatingState,type WaterHeatingInputs}from './waterHeating';
/** Saturated-liquid density anchors from NISTIR5078Table1,kg/m³.
 * Piecewise linear interpolation is a visualization approximation for the
 * near-atmospheric vessel,not a fixed-pressure equation of state. It does not
 * change the constant-Cp thermal model. No meniscus or gas-void volume fit. */
export const waterHeatingDensityAnchors=Object.freeze([[20,998.16],[40,992.18],[60,983.16],[80,971.77],[100,958.35]]as const);
export function waterHeatingDensityKgM3(temperatureC:number){if(!Number.isFinite(temperatureC)||temperatureC<20||temperatureC>100)throw new RangeError('Density approximation20–100°C required');const a=waterHeatingDensityAnchors;for(let i=1;i<a.length;i++)if(temperatureC<=a[i][0]){const [lo,rhoLo]=a[i-1],[hi,rhoHi]=a[i];return rhoLo+(rhoHi-rhoLo)*(temperatureC-lo)/(hi-lo)}return a[a.length-1][1]}
export function waterHeatingGeometry(q:WaterHeatingInputs){const s=waterHeatingState(q),densityKgM3=waterHeatingDensityKgM3(s.temperatureC),radiusCm=4,areaCm2=Math.PI*radiusCm**2,innerHeightCm=12,volumeMl=s.remainingG/densityKgM3*1000,liquidHeightCm=volumeMl/areaCm2,initialVolumeMl=q.waterMassG/waterHeatingDensityKgM3(20)*1000;return{densityKgM3,radiusCm,areaCm2,innerHeightCm,capacityMl:areaCm2*innerHeightCm,volumeMl,liquidHeightCm,initialVolumeMl,headspaceMl:areaCm2*innerHeightCm-volumeMl,floorCm:.2,liquidTopYcm:.2+liquidHeightCm,rimYcm:.2+innerHeightCm}}

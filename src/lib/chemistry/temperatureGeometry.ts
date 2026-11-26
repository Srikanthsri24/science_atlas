/** Apparatus geometry in cm, not a heat-flow or bath-volume simulation. */
export const temperatureProbeX=2.8,temperatureProbeRadiusCm=.13;
export function thermometerScaleY(tempC:number){if(!Number.isFinite(tempC)||tempC<0||tempC>60)throw new RangeError('Thermometer scale 0–60 °C required');return 2+tempC*.125}
export function temperatureBathProfile(){return[[3.56,0],[4.8,0],[4.8,4.6],[3.56,4.6],[3.56,0]]as[number,number][]}
export function temperatureBathColor(tempC:number){if(!Number.isFinite(tempC)||tempC<5||tempC>60)throw new RangeError('Bath temperature 5–60 °C required');return tempC<20?'#6eb9d3':tempC<35?'#8fc7b4':'#dba078'}

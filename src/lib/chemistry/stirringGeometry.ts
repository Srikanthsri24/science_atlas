/** Centimetres. Supported grains stay clear of an annular stirring rod.
 * Water level depicts starting solvent only; solution expansion/displacement
 * are not solved. Load transfer follows the reviewed lumped kinetic model.
 */
export const stirringCellRadiusCm=3.5,stirringRodOrbitCm=3.34,stirringRodRadiusCm=.055,stirringSupportY=.65,stirringFluidBaseY=.35;
export function stirringGrainPose(index:number,sideCm:number){if(!Number.isInteger(index)||index<0||index>=64||!Number.isFinite(sideCm)||sideCm<0||sideCm>.5)throw new RangeError('Grain 0–63 and side 0–0.5 cm required');return{x:(index%8-3.5)*.58,y:stirringSupportY+sideCm/2,z:(Math.floor(index/8)-3.5)*.58}}
export function stirringRodPose(setting:number,timeS:number){if(!Number.isFinite(setting)||setting<0||setting>1||!Number.isFinite(timeS)||timeS<0||timeS>120)throw new RangeError('Setting 0–1 and time 0–120 s required');const angle=setting*timeS*.9;return{angle,x:stirringRodOrbitCm*Math.cos(angle),z:stirringRodOrbitCm*Math.sin(angle),bottomY:1,topY:10.1}}

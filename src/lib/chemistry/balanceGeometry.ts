import{balanceArmM,balanceComDropM}from './beamBalance';
/** Illustrative load geometry, not a density/volume measurement. */
export function balanceLoadHeightCm(massG:number){if(!Number.isFinite(massG)||massG<0||massG>100)throw new RangeError('Mass 0–100 g required');return massG===0?0:1+massG/100}
export function balanceGeometry(angleRad:number){if(!Number.isFinite(angleRad))throw new RangeError('Finite angle required');const pivot={x:0,y:23},L=balanceArmM*100,d=balanceComDropM*100,c=Math.cos(angleRad),s=Math.sin(angleRad),left={x:-L*c,y:pivot.y-L*s},right={x:L*c,y:pivot.y+L*s};return{pivot,left,right,leftPan:{x:left.x,y:left.y-10},rightPan:{x:right.x,y:right.y-10},beamCom:{x:d*s,y:pivot.y-d*c},stringLengthCm:10}}

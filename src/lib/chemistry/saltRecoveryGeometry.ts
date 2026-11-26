import{saltRecoveryState}from'./saltRecovery';
export const recoveryDishRadiusCm=4,recoveryDishAreaCm2=16*Math.PI,recoveryDishHeightCm=3,recoveryCrystalCount=25;
/**25 original ideal cubic growth sites account for the actual solid volume.
 * Density1+0.75w is a chosen volume-visualization approximation, not measured
 * solution density. Liquid height solves volume excluding immersed cubes. */
export function saltRecoveryGeometry(saltG:number,rateSInv:number,timeS:number){const s=saltRecoveryState(saltG,rateSInv,timeS),edgeCm=Math.cbrt(s.crystalVolumeMl/recoveryCrystalCount),occupiedAreaCm2=recoveryCrystalCount*edgeCm**2,thresholdVolumeMl=recoveryDishAreaCm2*edgeCm-s.crystalVolumeMl,liquidHeightCm=s.solutionVolumeMl>=thresholdVolumeMl?(s.solutionVolumeMl+s.crystalVolumeMl)/recoveryDishAreaCm2:s.solutionVolumeMl/(recoveryDishAreaCm2-occupiedAreaCm2),immersedCrystalVolumeMl=occupiedAreaCm2*Math.min(liquidHeightCm,edgeCm),crystals=Array.from({length:recoveryCrystalCount},(_,i)=>({id:i,x:(i%5-2)*1.2,z:(Math.floor(i/5)-2)*1.2,y:edgeCm/2,edgeCm}));return{s,edgeCm,occupiedAreaCm2,liquidHeightCm,immersedCrystalVolumeMl,reconstructedLiquidVolumeMl:recoveryDishAreaCm2*liquidHeightCm-immersedCrystalVolumeMl,crystals,crystalTopsExposed:edgeCm>liquidHeightCm}}
/** Orthographic frustum centre is a WORLD coordinate; zoom only scales the
 * half extents. Multiplying the centre by zoom would crop off-centre bounds. */
export function fitRecoveryCamera(width:number,height:number,x0:number,x1:number,y0:number,y1:number){if(![width,height,x0,x1,y0,y1].every(Number.isFinite)||width<=0||height<=0||x1<=x0||y1<=y0)throw new RangeError('Positive viewport and ordered finite camera-space bounds required');return{zoom:Math.min(width/(x1-x0),height/(y1-y0))*.88,centreX:(x0+x1)/2,centreY:(y0+y1)/2}}

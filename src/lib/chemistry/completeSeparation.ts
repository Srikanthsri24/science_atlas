/** CL0071. Original sequential material-balance investigation.
 * Prescribed transfers/mixing/drying are not measured kinetics or heat predictions.
 * A retained mother-liquor compartment makes incomplete washing visible.
 */
export interface SeparationInputs {saltG:number;sandG:number;waterG:number;holdUpG:number;washG:number;washes:number;timeSeconds:number}
export const defaultSeparation:SeparationInputs={saltG:5,sandG:10,waterG:50,holdUpG:3,washG:15,washes:2,timeSeconds:0};
export const separationReference={capacitySaltPerWater:.36,waterDensityGcm3:1,saltDensityGcm3:2.165,sandDensityGcm3:2.65,apparentDissolvedVolumeMlG:.3};
export const separationStages=['Dissolve the salt','Filter the suspension','Wash the retained residue','Dry and compare the products','Record the final products'] as const;
export function checkSeparation(q:SeparationInputs){if(!q||![q.saltG,q.sandG,q.waterG,q.holdUpG,q.washG,q.washes,q.timeSeconds].every(Number.isFinite)||q.saltG<1||q.saltG>6||q.sandG<5||q.sandG>15||q.waterG<30||q.waterG>70||q.holdUpG<0||q.holdUpG>6||q.washG<10||q.washG>30||!Number.isInteger(q.washes)||q.washes<0||q.washes>3||q.timeSeconds<0||q.timeSeconds>1200)throw new RangeError('Salt1–6g; sand5–15g; initialwater30–70g; retainedmotherwater0–6g; wash10–30g; washes0–3; sequencetime0–1200s required')}
const smooth=(x:number)=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u)};
export function separationState(q:SeparationInputs=defaultSeparation){
 checkSeparation(q);const c=separationReference,t=q.timeSeconds,dissolution=smooth(t/200),filtration=smooth((t-200)/200);
 const initialSaltCapacityG=c.capacitySaltPerWater*q.waterG,sourceDissolvedG=q.saltG*dissolution*(1-filtration),sourceCrystalG=q.saltG*(1-dissolution),sourceWaterG=q.waterG*(1-filtration),sourceSandG=q.sandG*(1-filtration);
 const initialCakeSaltG=q.saltG*q.holdUpG/q.waterG;
 let cakeWaterG=q.holdUpG*filtration,cakeSaltG=initialCakeSaltG*filtration,receiverWaterG=(q.waterG-q.holdUpG)*filtration,receiverSaltG=(q.saltG-initialCakeSaltG)*filtration,washReservoirG=q.washes*q.washG,completedWashes=0,activeWash=0,washFillFraction=0,washDrainFraction=0;
 // Each optional wash occupies a fixed100s slot: first50s fill/mix, next50s drain.
 // The reservoir belongs to the declared system from the start; no water appears.
 for(let i=0;i<q.washes;i++){
  const local=t-(400+i*100),fill=smooth(local/50),drain=smooth((local-50)/50),before=cakeSaltG,filledWater=q.holdUpG+q.washG;
  if(local<=0)continue;
  const saltOut=before*(q.washG/filledWater)*drain;
  cakeSaltG-=saltOut;receiverSaltG+=saltOut;
  cakeWaterG+=q.washG*(fill-drain);receiverWaterG+=q.washG*drain;washReservoirG-=q.washG*fill;
  if(local>=100)completedWashes++;else{activeWash=i+1;washFillFraction=fill;washDrainFraction=drain}
 }
 const preDryCakeWaterG=cakeWaterG,preDryReceiverWaterG=receiverWaterG,drying=smooth((t-700)/500);
 const cakeEvaporatedG=preDryCakeWaterG*drying,receiverEvaporatedG=preDryReceiverWaterG*drying;
 cakeWaterG-=cakeEvaporatedG;receiverWaterG-=receiverEvaporatedG;
 const cakeDissolvedG=Math.min(cakeSaltG,c.capacitySaltPerWater*cakeWaterG),cakeCrystalG=Math.max(0,cakeSaltG-cakeDissolvedG),receiverDissolvedG=Math.min(receiverSaltG,c.capacitySaltPerWater*receiverWaterG),receiverCrystalG=Math.max(0,receiverSaltG-receiverDissolvedG),cakeSandG=q.sandG*filtration,evaporatedWaterG=cakeEvaporatedG+receiverEvaporatedG;
 const saltAccountedG=sourceDissolvedG+sourceCrystalG+cakeSaltG+receiverSaltG,sandAccountedG=sourceSandG+cakeSandG,waterAccountedG=sourceWaterG+cakeWaterG+receiverWaterG+washReservoirG+evaporatedWaterG,initialWaterG=q.waterG+q.washes*q.washG,initialMassG=q.saltG+q.sandG+initialWaterG;
 const sourceMassG=sourceWaterG+sourceDissolvedG+sourceCrystalG+sourceSandG,cakeMassG=cakeWaterG+cakeSaltG+cakeSandG,receiverMassG=receiverWaterG+receiverSaltG;
 const finalCakeSaltG=initialCakeSaltG*(q.holdUpG/(q.holdUpG+q.washG))**q.washes,finalSaltProductG=q.saltG-finalCakeSaltG,finalSandProductPurityPercent=100*q.sandG/(q.sandG+finalCakeSaltG),predictedSaltRecoveryPercent=100*finalSaltProductG/q.saltG;
 const stage=t<200?0:t<400?1:t<700?2:t<1200?3:4,finished=t===1200;
 return {...q,dissolution,filtration,drying,stage,stageName:separationStages[stage],initialSaltCapacityG,initialCakeSaltG,sourceDissolvedG,sourceCrystalG,sourceWaterG,sourceSandG,cakeWaterG,cakeSaltG,cakeDissolvedG,cakeCrystalG,cakeSandG,receiverWaterG,receiverSaltG,receiverDissolvedG,receiverCrystalG,washReservoirG,completedWashes,activeWash,washFillFraction,washDrainFraction,preDryCakeWaterG,preDryReceiverWaterG,cakeEvaporatedG,receiverEvaporatedG,evaporatedWaterG,saltAccountedG,sandAccountedG,waterAccountedG,initialWaterG,initialMassG,sourceMassG,cakeMassG,receiverMassG,totalAccountedMassG:sourceMassG+cakeMassG+receiverMassG+washReservoirG+evaporatedWaterG,finalCakeSaltG,finalSaltProductG,finalSandProductPurityPercent,predictedSaltRecoveryPercent,
  drySaltRecoveryPercent:100*receiverCrystalG/q.saltG,receiverSolutionConcentrationGPerWaterG:receiverWaterG>0?receiverDissolvedG/receiverWaterG:null,cakeSolutionConcentrationGPerWaterG:cakeWaterG>0?cakeDissolvedG/cakeWaterG:null,finished,idealCompleteSeparation:finished&&q.holdUpG===0,
  sourceSolutionMl:sourceWaterG/c.waterDensityGcm3+c.apparentDissolvedVolumeMlG*sourceDissolvedG,sourceCrystalMl:sourceCrystalG/c.saltDensityGcm3,sourceSandMl:sourceSandG/c.sandDensityGcm3,
  cakeSolutionMl:cakeWaterG/c.waterDensityGcm3+c.apparentDissolvedVolumeMlG*cakeDissolvedG,cakeCrystalMl:cakeCrystalG/c.saltDensityGcm3,cakeSandMl:cakeSandG/c.sandDensityGcm3,
  receiverSolutionMl:receiverWaterG/c.waterDensityGcm3+c.apparentDissolvedVolumeMlG*receiverDissolvedG,receiverCrystalMl:receiverCrystalG/c.saltDensityGcm3,
  observation:finished?(q.holdUpG===0?'Ideal zero-retention limit: dry sand and salt are fully separated. Real apparatus does not guarantee this limit.':'Dry sand retains the salt left in its mother liquor. Washing improves recovery; finite washing does not guarantee perfectly pure sand.'):'Track every compartment. A filtrate is salt solution, not dry recovered salt; a damp sand residue can contain dissolved salt.'};
}
export function separationHistory(q:SeparationInputs){checkSeparation(q);return Array.from({length:61},(_,i)=>separationState({...q,timeSeconds:q.timeSeconds*i/60}))}
export function separationGuide(seconds:number){if(!Number.isFinite(seconds))throw new RangeError('Finite guide time required');const t=Math.max(0,Math.min(120,seconds)),timeSeconds=t<=10?0:t>=110?1200:(t-10)*12,s=separationState({...defaultSeparation,timeSeconds});return {timeSeconds,caption:t<10?'Predict how dissolving, filtration, washing and drying separate a salt-and-sand mixture. Count all initial and reserved wash water.':s.stage===0?'Watch solid salt diminish as dissolved salt enters the water. Sand remains solid; the original salt has not disappeared.':s.stage===1?'Transfer the suspension through an ideal retaining filter. Sand stays on the filter, but a little salty mother liquor stays with the damp residue.':s.stage===2?'Add and mix each fresh wash, then drain. Dissolved salt moves into the filtrate. Compare the shrinking salt contamination in the sand residue.':s.stage===3?'Dry the filtrate and residue in separate dishes. Water moves into the air inventory. Salt crystallizes as the remaining liquid loses its dissolving capacity.':'Record both dry products. Check salt, sand and water separately. A high salt recovery is not a proof of perfectly pure sand.',timingNote:'120s guide:10setup+100continuous prescribed process+10hold. Sequence time0–1200s is accelerated12×, an instructional schedule, not measured dissolution, filtration or drying kinetics.'}}

/** CL-0081: original reference inventory model, not a calibrated chemical/heat model.
 * E removes water only; J removes well-mixed solution, never solid crystals.
 * Material transfer stops on removal to the cooling/weighing station.
 */
export interface EvaporationRecoveryInputs {
  waterG:number; soluteG:number; evaporationGS:number; spillGS:number;
  heatSeconds:number; coolSeconds:number; station:'drying'|'weighing';
  tareG:number; balanceIncrementG:.01|.1;
}
export const defaultEvaporationRecovery:EvaporationRecoveryInputs={waterG:30,soluteG:3,evaporationGS:.1,spillGS:.01,heatSeconds:0,coolSeconds:0,station:'drying',tareG:20,balanceIncrementG:.01};
export const recoveryCapacity=.25;
export function validateEvaporationRecovery(q:EvaporationRecoveryInputs){
  for(const [key,lo,hi]of[['waterG',20,100],['soluteG',1,5],['evaporationGS',.05,.2],['spillGS',0,.02],['heatSeconds',0,2400],['coolSeconds',0,240],['tareG',15,30]]as const){if(!Number.isFinite(q[key])||q[key]<lo||q[key]>hi)throw new RangeError(key)}
  if(![.01,.1].includes(q.balanceIncrementG))throw new RangeError('balanceIncrementG');
  if(q.station!=='drying'&&q.station!=='weighing')throw new RangeError('station');
}
export function evaporationRecoveryDish(q:EvaporationRecoveryInputs,spillGS=q.spillGS){
  validateEvaporationRecovery(q);
  if(!Number.isFinite(spillGS)||spillGS<0||spillGS>.02)throw new RangeError('spillGS');
  const c=recoveryCapacity,E=q.evaporationGS,J=spillGS,v=E+J,M0=q.waterG+q.soluteG;
  const saturationMassG=M0*Math.pow((q.soluteG/M0)/(c/(1+c)),v/E);
  const saturationWaterG=saturationMassG/(1+c),saturationSoluteG=c*saturationWaterG;
  const saturationSeconds=Math.max(0,(M0-saturationMassG)/v);
  const saturatedWaterRateGS=E+J/(1+c);
  const drySeconds=saturationSeconds+saturationWaterG/saturatedWaterRateGS;
  const wetSeconds=Math.min(q.heatSeconds,drySeconds),dry=q.heatSeconds>=drySeconds;
  let waterG:number,soluteG:number;
  if(wetSeconds<saturationSeconds){
    const totalG=M0-v*wetSeconds;
    soluteG=q.soluteG*Math.pow(totalG/M0,J/v);waterG=totalG-soluteG;
  }else{
    const u=wetSeconds-saturationSeconds;
    waterG=dry?0:Math.max(0,saturationWaterG-saturatedWaterRateGS*u);
    soluteG=saturationSoluteG-J*c/(1+c)*u;
  }
  const dissolvedG=Math.min(soluteG,c*waterG),solidG=Math.max(0,soluteG-dissolvedG);
  const vapourWaterG=E*wetSeconds,spilledSoluteG=Math.max(0,q.soluteG-soluteG),spilledWaterG=Math.max(0,q.waterG-waterG-vapourWaterG);
  const temperatureC=q.station==='drying'?70:25+45*Math.exp(-q.coolSeconds/30);
  const canWeigh=q.station==='weighing'&&temperatureC<=30;
  const round=(x:number)=>Math.round((x+Number.EPSILON)/q.balanceIncrementG)*q.balanceIncrementG;
  const tareReadingG=round(q.tareG),grossReadingG=canWeigh?round(q.tareG+waterG+soluteG):null;
  const netReadingG=grossReadingG===null?null:grossReadingG-tareReadingG;
  return {waterG,soluteG,dissolvedG,solidG,vapourWaterG,spilledWaterG,spilledSoluteG,
    catcherG:spilledWaterG+spilledSoluteG,wetSeconds,saturationSeconds,drySeconds,dry,
    temperatureC,canWeigh,tareReadingG,grossReadingG,netReadingG,
    apparentRecoveryPercent:netReadingG===null?null:100*netReadingG/q.soluteG,
    dryRecoveryPercent:netReadingG!==null&&dry?100*netReadingG/q.soluteG:null,
    referenceSoluteRecoveryPercent:100*soluteG/q.soluteG,
    waterClosureG:waterG+vapourWaterG+spilledWaterG,
    soluteClosureG:soluteG+spilledSoluteG,
    theoreticalDrySoluteG:saturationSoluteG*E/saturatedWaterRateGS};
}
export function evaporationRecoveryPair(q:EvaporationRecoveryInputs){return{retained:evaporationRecoveryDish(q,0),loss:evaporationRecoveryDish(q)}}
export function evaporationRecoveryGuide(seconds:number,q:EvaporationRecoveryInputs){
  if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('guide seconds');
  const pair=evaporationRecoveryPair(q),end=Math.max(pair.retained.drySeconds,pair.loss.drySeconds);
  const drying=seconds<90;
  return{...q,heatSeconds:end*Math.min(1,seconds/90),coolSeconds:drying?0:(seconds-90)*4,station:drying?'drying' as const:'weighing' as const,
    caption:seconds<25?'Start with equal known solute and water masses. Water vapour carries no solute in this chosen reference.':seconds<60?'Compare the retained preparation with a controlled solution loss to the catcher. Track both water and solute inventories.':seconds<90?'Crystals remain in the dishes while dissolved solution may be lost. Continue until reference water reaches zero.':'Remove both dishes,allow cooling and subtract the empty-dish reading. Compare dry recovery;wet residue would overestimate it.'};
}

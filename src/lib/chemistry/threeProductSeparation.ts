/** CL-0082: original separation-quality inventory model.
 * Capture/co-pickup fractions and procedure clocks are chosen references,not
 * measured magnetic force,flow,dissolution or thermal kinetics.
 */
export interface ThreeProductInputs{
 ironG:number;sandG:number;saltG:number;waterG:number;passes:number;
 captureFraction:number;coPickupFraction:number;holdUpG:number;
 washG:number;washes:number;timeSeconds:number;
}
export const defaultThreeProduct:ThreeProductInputs={ironG:5,sandG:10,saltG:5,waterG:40,passes:3,captureFraction:.65,coPickupFraction:.015,holdUpG:3,washG:15,washes:2,timeSeconds:0};
export const threeProductReference={capacityGPerWaterG:.36,ironDensityGml:7.87,sandDensityGml:2.65,saltDensityGml:2.165,waterDensityGml:1,dissolvedVolumeMlG:.3};
export function checkThreeProduct(q:ThreeProductInputs){
 if(!q)throw new RangeError('Preparation required');
 for(const[k,min,max]of[['ironG',1,10],['sandG',5,20],['saltG',1,10],['waterG',10,80],['passes',0,5],['captureFraction',.3,.95],['coPickupFraction',0,.04],['holdUpG',0,10],['washG',0,20],['washes',0,3],['timeSeconds',0,1200]]as const)if(!Number.isFinite(q[k])||q[k]<min||q[k]>max)throw new RangeError(k);
 if(!Number.isInteger(q.passes)||!Number.isInteger(q.washes))throw new RangeError('Integer pass and wash counts required');
}
const smooth=(x:number)=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u)};
export function threeProductState(q:ThreeProductInputs){
 checkThreeProduct(q);const c=threeProductReference.capacityGPerWaterG,t=q.timeSeconds;
 const magnetApproach=smooth(t/20),magnetLift=smooth((t-160)/20),magnet=smooth((t-20)/140),dissolution=smooth((t-180)/180),filtration=smooth((t-360)/180),drying=smooth((t-900)/300);
 const effectivePasses=q.passes*magnet,ironCollectedG=q.ironG*(1-(1-q.captureFraction)**effectivePasses),sandCoPickedG=q.sandG*(1-(1-q.coPickupFraction)**effectivePasses),saltCoPickedG=q.saltG*(1-(1-q.coPickupFraction)**effectivePasses);
 const remainingIronG=q.ironG-ironCollectedG,remainingSandG=q.sandG-sandCoPickedG,remainingSaltG=q.saltG-saltCoPickedG;
 const waterAddedG=q.waterG*dissolution,initialWaterReserveG=q.waterG-waterAddedG,initialDissolvedG=Math.min(remainingSaltG,c*q.waterG)*dissolution;
 const sourceWaterG=waterAddedG-q.waterG*filtration,sourceDissolvedG=initialDissolvedG*(1-filtration),sourceSolidSaltG=(remainingSaltG-initialDissolvedG)*(1-filtration),sourceIronG=remainingIronG*(1-filtration),sourceSandG=remainingSandG*(1-filtration);
 const retainedBeforeWashG=(remainingSaltG-initialDissolvedG+initialDissolvedG*q.holdUpG/q.waterG)*filtration;
 const washSteps:{number:number;beforeSaltG:number;fullWaterG:number;fullDissolvedG:number;saltOutG:number;afterSaltG:number;fill:number;drain:number}[]=[];
 let cakeSaltG=retainedBeforeWashG,cakeWaterG=q.holdUpG*filtration,receiverSaltG=initialDissolvedG*(1-q.holdUpG/q.waterG)*filtration,receiverWaterG=(q.waterG-q.holdUpG)*filtration,washReserveG=q.washes*q.washG,completedWashes=0,activeWash=0,fillFraction=0,drainFraction=0;
 for(let i=0;i<q.washes;i++){
  const local=t-(540+i*120);if(local<=0)continue;
  const fill=smooth(local/60),drain=smooth((local-60)/60),before=cakeSaltG,fullWater=q.holdUpG+q.washG;
  const fullDissolvedG=Math.min(before,c*fullWater),saltOutG=fullWater>0?fullDissolvedG*q.washG/fullWater*drain:0;
  cakeSaltG=Math.max(0,cakeSaltG-saltOutG);receiverSaltG+=saltOutG;washSteps.push({number:i+1,beforeSaltG:before,fullWaterG:fullWater,fullDissolvedG,saltOutG,afterSaltG:cakeSaltG,fill,drain});
  cakeWaterG+=q.washG*(fill-drain);receiverWaterG+=q.washG*drain;washReserveG-=q.washG*fill;
  if(local>=120)completedWashes++;else{activeWash=i+1;fillFraction=fill;drainFraction=drain}
 }
 const preDryCakeWaterG=cakeWaterG,preDryReceiverWaterG=receiverWaterG,cakeVapourG=cakeWaterG*drying,receiverVapourG=receiverWaterG*drying;
 cakeWaterG-=cakeVapourG;receiverWaterG-=receiverVapourG;
 const cakeIronG=remainingIronG*filtration,cakeSandG=remainingSandG*filtration,cakeDissolvedG=Math.min(cakeSaltG,c*cakeWaterG),cakeSolidSaltG=Math.max(0,cakeSaltG-cakeDissolvedG),receiverDissolvedG=Math.min(receiverSaltG,c*receiverWaterG),receiverCrystalG=Math.max(0,receiverSaltG-receiverDissolvedG),vapourWaterG=cakeVapourG+receiverVapourG;
 const magnetDryMassG=ironCollectedG+sandCoPickedG+saltCoPickedG,cakeDryMassG=cakeIronG+cakeSandG+cakeSaltG,receiverMassG=receiverSaltG+receiverWaterG;
 const ironAccountedG=ironCollectedG+sourceIronG+cakeIronG,sandAccountedG=sandCoPickedG+sourceSandG+cakeSandG,saltAccountedG=saltCoPickedG+sourceDissolvedG+sourceSolidSaltG+cakeSaltG+receiverSaltG,waterAccountedG=initialWaterReserveG+sourceWaterG+cakeWaterG+receiverWaterG+washReserveG+vapourWaterG;
 const sourceMassG=sourceIronG+sourceSandG+sourceSolidSaltG+sourceDissolvedG+sourceWaterG,cakeMassG=cakeDryMassG+cakeWaterG,initialWaterG=q.waterG+q.washes*q.washG,finished=t===1200;
 return{washSteps,magnetApproach,magnetLift,magnet,dissolution,filtration,drying,effectivePasses,ironCollectedG,sandCoPickedG,saltCoPickedG,remainingIronG,remainingSandG,remainingSaltG,waterAddedG,initialWaterReserveG,initialDissolvedG,sourceWaterG,sourceDissolvedG,sourceSolidSaltG,sourceIronG,sourceSandG,retainedBeforeWashG,cakeSaltG,cakeWaterG,receiverSaltG,receiverWaterG,washReserveG,completedWashes,activeWash,fillFraction,drainFraction,preDryCakeWaterG,preDryReceiverWaterG,cakeVapourG,receiverVapourG,cakeIronG,cakeSandG,cakeDissolvedG,cakeSolidSaltG,receiverDissolvedG,receiverCrystalG,vapourWaterG,magnetDryMassG,cakeDryMassG,receiverMassG,sourceMassG,cakeMassG,ironAccountedG,sandAccountedG,saltAccountedG,waterAccountedG,initialWaterG,
  initialWholeMassG:q.ironG+q.sandG+q.saltG+initialWaterG,totalAccountedG:magnetDryMassG+sourceMassG+cakeMassG+receiverMassG+initialWaterReserveG+washReserveG+vapourWaterG,
  ironRecoveryPercent:100*ironCollectedG/q.ironG,ironProductPurityPercent:magnetDryMassG>0?100*ironCollectedG/magnetDryMassG:null,
  sandRecoveryPercent:finished?100*cakeSandG/q.sandG:null,sandProductPurityPercent:finished&&cakeDryMassG>0?100*cakeSandG/cakeDryMassG:null,
  saltRecoveryPercent:finished?100*receiverCrystalG/q.saltG:null,saltProductPurityPercent:finished&&receiverSaltG>0?100:null,finished,
  stage:t<180?'magnet':t<360?'dissolve':t<540?'filter':t<900?'wash':t<1200?'dry':'complete',
  observation:finished?'Check all three products. More magnet passes can recover more iron while mechanically carrying more sand and salt. Washing removes soluble contamination but cannot remove iron retained with sand.':'Track each component separately. Wet filtrate and cake masses are not dry product recovery.'};
}
export function threeProductGuide(seconds:number,q:ThreeProductInputs=defaultThreeProduct){
 checkThreeProduct(q);
 if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide seconds0–120 required');
 const timeSeconds=seconds*10;
 return{timeSeconds,caption:seconds<18?(q.passes===0?'Zero-pass comparison:no iron is collected. The remaining iron will travel with sand into the filter residue.':'Pass the covered magnet through the dry mixture. Capture is incomplete,and chosen mechanical co-pickup can carry nonmagnetic grains into the iron product.'):seconds<36?'Add the reserved water and dissolve the soluble component up to the chosen capacity. Remaining iron and sand stay solid;insufficient water leaves some salt undissolved.':seconds<54?'Filter the suspension. Remaining iron and sand stay with any undissolved salt;mother liquor also retains some dissolved salt in the wet cake.':seconds<90?(q.washG===0&&q.washes>0?'Zero-volume washes:no fresh water is added. Inspect the retained salt before drying.':q.washes===0?'No washing selected. Inspect the salt retained with the wet cake before drying.':seconds>=54+q.washes*12?'The selected washes are complete. Inspect the collected filtrate and residual contamination before drying.':'Add,mix and drain each chosen wash separately. Collect the wash filtrates with the salt solution. Fresh water reduces soluble contamination but cannot remove retained iron.'):seconds<120?'Dry the cake and combined filtrate separately in this prescribed time-lapse. Water moves into the vapour inventory;do not count wet mass as recovered dry solute.':'Compare recovery and purity for iron,sand and salt. Close four component inventories. High recovery alone does not prove a pure product.',timingNote:'120s presentation maps linearly to a1200s prescribed procedure:180s magnet,180s dissolution,180s filtration,three optional120s wash slots and300s drying. These are instructional transfers,not measured physical rates.'};
}

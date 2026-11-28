import {starchIodineState,type StarchIodineInputs} from './starchIodine';
export const starchIodineApparatus={segments:128,cellX:[-18,-6,6,18],stockOffsetX:-2.7,vialOffsetX:2.7,baseY:1,stockRadiusCm:.6,stockCapacityMl:2.4,vialRadiusCm:1.4,vialCapacityMl:40,pipetteRadiusCm:.3,pipetteCapacityMl:2,stemCm:3} as const;
const lerp=(a:number,b:number,p:number)=>a+(b-a)*p,clamp=(p:number)=>Math.max(0,Math.min(1,p));
/** Exact 128-sided nominal volumes; stem and tip hold-up are idealized as zero. */
export function starchIodineGeometry(q:StarchIodineInputs,seconds?:number){
 const a=starchIodineApparatus,model=starchIodineState(q);if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>120))throw new RangeError('Guide time must be 0–120 seconds');
 const area=(r:number)=>a.segments*Math.sin(2*Math.PI/a.segments)*r*r/2,stockArea=area(a.stockRadiusCm),vialArea=area(a.vialRadiusCm),pipetteArea=area(a.pipetteRadiusCm),stockWallHeight=a.stockCapacityMl/stockArea,vialWallHeight=a.vialCapacityMl/vialArea,barrelHeight=a.pipetteCapacityMl/pipetteArea;
 const vialTopY=a.baseY+vialWallHeight,clearanceTipY=vialTopY+2,deliveryTipY=vialTopY+.3,t=seconds;
 return {stockArea,vialArea,pipetteArea,stockWallHeight,vialWallHeight,barrelHeight,vialTopY,clearanceTipY,deliveryTipY,observationReady:t===undefined||t>=95,mixProgress:t===undefined?1:clamp((t-70)/25),storyProgress:t===undefined?1:clamp((t-40)/55),cells:model.cells.map((s,i)=>{
  const stockX=a.cellX[i]+a.stockOffsetX,vialX=a.cellX[i]+a.vialOffsetX,stockHeightCm=s.remainingStockMl/stockArea,vialHeightCm=s.vialMl/vialArea,pipetteHeightCm=s.pipetteMl/pipetteArea,stockTipY=a.baseY+Math.max(0,stockHeightCm-.2),initialTipY=a.baseY+2/stockArea-.2;
  let tipX=stockX,tipY=clearanceTipY;
  if(t!==undefined){
   if(t<10){tipX=stockX;tipY=clearanceTipY;}
   else if(t<15){tipY=lerp(clearanceTipY,initialTipY,(t-10)/5);}
   else if(t<30){tipY=stockTipY;}
   else if(t<34){tipY=lerp(stockTipY,clearanceTipY,(t-30)/4);}
   else if(t<38){tipX=lerp(stockX,vialX,(t-34)/4);}
   else if(t<40){tipX=vialX;tipY=lerp(clearanceTipY,deliveryTipY,(t-38)/2);}
   else if(t<70){tipX=vialX;tipY=deliveryTipY;}
   else if(t<75){tipX=vialX;tipY=lerp(deliveryTipY,clearanceTipY,(t-70)/5);}
   else if(t<80){tipX=lerp(vialX,stockX,(t-75)/5);}
  }
  const barrelBaseY=tipY+a.stemCm,plungerY=barrelBaseY+pipetteHeightCm;
  return{id:s.id,material:s,stockX,vialX,stockHeightCm,vialHeightCm,pipetteHeightCm,tipX,tipY,barrelBaseY,plungerY,
   dispensing:t!==undefined&&t>40&&t<70&&q.deliveredMl>0,withdrawing:t!==undefined&&t>15&&t<30&&q.withdrawnMl>0,mixing:t!==undefined&&t>70&&t<95,
   flowPhase:t===undefined?0:t%1,stirAngle:t===undefined?0:clamp((t-70)/25)*Math.PI*20};
 })};
}
/** Left-handed amylose-like schematic in nm reference coordinates. Residue
 * markers and iodine/iodide cue markers are representative, not atom positions,
 * a unique polyiodide species or a count inferred from a mole inventory. */
export function starchIodineHelix(progress:number){
 if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError('Schematic progress must be 0–1');
 const turns=4,residuesPerTurn=6,pitchNm=.8,backboneRadiusNm=.45,residueMarkerRadiusNm=.2;
 const point=(theta:number)=>[backboneRadiusNm*Math.cos(theta),pitchNm*theta/(2*Math.PI),backboneRadiusNm*Math.sin(theta)] as [number,number,number];
 return {turns,residuesPerTurn,pitchNm,backboneRadiusNm,residueMarkerRadiusNm,path:Array.from({length:385},(_,i)=>point(i/384*turns*2*Math.PI)),residues:Array.from({length:24},(_,i)=>point(i/residuesPerTurn*2*Math.PI)),associationCues:Array.from({length:9},(_,i)=>[1.5*(1-progress),.35+i*.3,0] as [number,number,number])};
}

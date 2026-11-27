/** CL-0096: original reference comparator,not empirical mixture spectroscopy.
 * Specific virtual stock formulation;imposed maintained25°Creference pH.
 */
export const universalReferencePH=[2,4,6,7,9,11]as const;
export type UniversalPH=typeof universalReferencePH[number];
export const universalComponents=[
 {id:'methyl-red',name:'Methyl red',stockGPerL:.4,ranges:[[4.4,6.2]],low:'red',high:'yellow'},
 {id:'methyl-orange',name:'Methyl orange',stockGPerL:.2,ranges:[[3.2,4.4]],low:'red',high:'yellow-orange'},
 {id:'phenolphthalein',name:'Phenolphthalein',stockGPerL:.2,ranges:[[8,10]],low:'colourless',high:'pink'},
 {id:'thymol-blue',name:'Thymol blue',stockGPerL:1,ranges:[[1.2,2.8],[8,9.6]],low:'red',high:'blue'},
 {id:'bromothymol-blue',name:'Bromothymol blue',stockGPerL:.8,ranges:[[6.2,7.6]],low:'yellow',high:'blue'},
]as const;
export type UniversalComponent=typeof universalComponents[number]['id'];
export interface UniversalInputs{stockMl:number;sampleMl:number;doseUl:number;pH:UniversalPH;component:UniversalComponent;mixtureFraction:number;singleFraction:number;mixtureLoadFraction:number;singleLoadFraction:number}
export const defaultUniversal:UniversalInputs={stockMl:25,sampleMl:10,doseUl:50,pH:7,component:'methyl-red',mixtureFraction:0,singleFraction:0,mixtureLoadFraction:0,singleLoadFraction:0};
export const universalTeachingCards=[
 {pH:2,category:'red',colour:'#d35965'},
 {pH:4,category:'orange',colour:'#df9457'},
 {pH:6,category:'yellow',colour:'#dfc85d'},
 {pH:7,category:'green',colour:'#7faf73'},
 {pH:9,category:'blue',colour:'#6598cc'},
 {pH:11,category:'purple',colour:'#aa79c0'},
]as const;
export const universalLimitations='A particular virtual five-dye formulation,not every commercial universal indicator. Mixture colour cards are original selected-reference illustrations,not measured RGB calibration or calculated absorbance. Constituent transition intervals are qualitative effective ranges,not exact pKa values;within-range hue is unresolved. Imposed reference pH is maintained independently at ideal25°C;indicator loading,finite buffering,activities,solvent effects,temperature changes and measured mixing kinetics are omitted. Volume and95%ethanol-solvent accounts are nominal additive bookkeeping;real ethanol/water contraction and dye displacement are neglected. Colourless is a valid completed endpoint,not a missing dose. Tip displacement,wall thickness and droplet transit holdup are neglected;flow markers are annotations,not additional liquid inventories. No exactpH or chemical identity is inferred from a matching colour.';
export function checkUniversal(q:UniversalInputs){
 if(!q||!universalReferencePH.includes(q.pH)||!universalComponents.some(c=>c.id===q.component))throw new RangeError('Selected pH reference and known constituent required');
 for(const[k,lo,hi]of[['stockMl',10,100],['sampleMl',5,20],['doseUl',10,100],['mixtureFraction',0,1],['singleFraction',0,1],['mixtureLoadFraction',0,1],['singleLoadFraction',0,1]]as const)
  if(!Number.isFinite(q[k])||q[k]<lo||q[k]>hi)throw new RangeError(`${k} must be ${lo}–${hi}`);
 if(q.mixtureFraction>q.mixtureLoadFraction||q.singleFraction>q.singleLoadFraction)throw new RangeError('Delivery cannot exceed the amount aspirated into its own pipette');
}
export function universalConstituent(component:UniversalComponent,pH:number){
 const c=universalComponents.find(c=>c.id===component);
 if(!c||!Number.isFinite(pH)||pH<2||pH>11)throw new RangeError('Known constituent and pH2–11 required');
 const inRange=c.ranges.some(([lo,hi])=>pH>=lo&&pH<=hi);
 const category=inRange?'unresolved':component==='thymol-blue'?(pH<1.2?'red':pH<8?'yellow':'blue'):pH<c.ranges[0][0]?c.low:c.high;
 const colours:Record<string,string>={red:'#ce6571',yellow:'#e0c75c','yellow-orange':'#dca153',pink:'#ca83b2',blue:'#6799c4',colourless:'#c5dce8',unresolved:'#92a2b1'};
 return{...c,inRange,category,colour:colours[category],evidence:inRange?'Inside a stated constituent transition interval;do not invent a calibrated intermediate hue.':category==='colourless'?'Completed colourless endpoint;colourless does not mean no indicator was delivered.':'Outside the stated constituent transition interval;this endpoint alone does not rank all reference pH values on that side.'};
}
export function universalState(q:UniversalInputs=defaultUniversal){
 checkUniversal(q);const selected=universalComponents.find(c=>c.id===q.component)!,singleEndpoint=universalConstituent(q.component,q.pH),card=universalTeachingCards.find(c=>c.pH===q.pH)!,hydrogenM=10**(-q.pH),pOH=14-q.pH,hydroxideM=10**(-pOH);
 const cells=(['mixture','single']as const).map(id=>{
  const fraction=id==='mixture'?q.mixtureFraction:q.singleFraction,loadFraction=id==='mixture'?q.mixtureLoadFraction:q.singleLoadFraction,loadedUl=q.doseUl*loadFraction,loadedMl=loadedUl/1000,deliveredUl=q.doseUl*fraction,deliveredMl=deliveredUl/1000,pipetteMl=(loadedUl-deliveredUl)/1000,volumeMl=q.sampleMl+deliveredMl,volumeL=volumeMl/1000,stockRemainingMl=q.stockMl-loadedMl,nominalEthanolMl=.95*deliveredMl,nominalStockWaterMl=.05*deliveredMl,nominalWaterMl=q.sampleMl+nominalStockWaterMl,complete=fraction===1;
  const components=universalComponents.map(c=>{
   const stockGPerL=id==='mixture'||c.id===q.component?c.stockGPerL:0,initialStockMassMg=stockGPerL*q.stockMl,deliveredMassMg=stockGPerL*deliveredMl,remainingStockMassMg=stockGPerL*stockRemainingMl,pipetteMassMg=stockGPerL*pipetteMl,cellMgPerL=deliveredMassMg/volumeL;
   return{id:c.id,name:c.name,stockGPerL,referenceMassMgPer100Ml:stockGPerL*100,initialStockMassMg,deliveredMassMg,remainingStockMassMg,pipetteMassMg,cellMgPerL,massResidualMg:initialStockMassMg-deliveredMassMg-remainingStockMassMg-pipetteMassMg};
  });
  const initialTotalDyeMg=components.reduce((sum,c)=>sum+c.initialStockMassMg,0),deliveredTotalDyeMg=components.reduce((sum,c)=>sum+c.deliveredMassMg,0),remainingTotalDyeMg=components.reduce((sum,c)=>sum+c.remainingStockMassMg,0),pipetteTotalDyeMg=components.reduce((sum,c)=>sum+c.pipetteMassMg,0),category=complete?(id==='mixture'?card.category:singleEndpoint.category):'not-ready',colour=complete?(id==='mixture'?card.colour:singleEndpoint.colour):'#c5dce8';
  return{id,name:id==='mixture'?'Five-dye mixture':`${selected.name} alone`,fraction,loadFraction,loadedUl,loadedMl,pipetteMl,deliveredUl,deliveredMl,volumeMl,volumeL,stockRemainingMl,nominalEthanolMl,nominalStockWaterMl,nominalWaterMl,nominalEthanolVolumeFraction:nominalEthanolMl/volumeMl,complete,category,colour,components,initialTotalDyeMg,deliveredTotalDyeMg,remainingTotalDyeMg,pipetteTotalDyeMg,systemVolumeResidualMl:q.stockMl+q.sampleMl-stockRemainingMl-pipetteMl-volumeMl,volumeResidualMl:volumeMl-q.sampleMl-deliveredMl,stockVolumeResidualMl:q.stockMl-loadedMl-stockRemainingMl,solventVolumeResidualMl:nominalWaterMl+nominalEthanolMl-volumeMl,totalDyeResidualMg:initialTotalDyeMg-deliveredTotalDyeMg-remainingTotalDyeMg-pipetteTotalDyeMg};
 });
 const mixture=cells[0],single=cells[1],mixtureSelected=mixture.components.find(c=>c.id===q.component)!,singleSelected=single.components.find(c=>c.id===q.component)!,ready=mixture.complete&&single.complete,selectedMassRatio=singleSelected.deliveredMassMg===0?null:mixtureSelected.deliveredMassMg/singleSelected.deliveredMassMg,selectedMassDifferenceMg=mixtureSelected.deliveredMassMg-singleSelected.deliveredMassMg;
 const inference=!ready?'Complete the selected dose in both independent cells before comparing endpoints.':singleEndpoint.inRange?'The constituent is within its stated transition interval,so its exact intermediate hue remains unresolved. Compare that limited range with the mixture’s selected teaching card,not a colour-derived exactpH.':singleEndpoint.category==='colourless'?'The completed constituent cell is colourless despite receiving its measured dye dose. The mixture’s selected teaching card differs;colourless is not evidence of an empty or undosed cell.':'A constituent endpoint covers many pH values outside its transition interval. The mixture offers several selected teaching reference cards,but no match proves an exactpH or chemical identity.';
 return{...q,selected,singleEndpoint,card,hydrogenM,pOH,hydroxideM,kwResidualM2:hydrogenM*hydroxideM-1e-14,hydrogenRatioToPH7:hydrogenM/1e-7,cells,mixture,single,mixtureSelected,singleSelected,ready,selectedMassRatio,selectedMassDifferenceMg,inference,mixtureStockGPerL:universalComponents.reduce((sum,c)=>sum+c.stockGPerL,0)};
}
export function universalGuide(seconds:number,preparation:UniversalInputs=defaultUniversal){
 checkUniversal(preparation);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide0–120s required');
 const progress=(start:number,end:number)=>Math.max(0,Math.min(1,(seconds-start)/(end-start))),mixtureLoadFraction=progress(12,22),mixtureFraction=progress(30,50),singleLoadFraction=progress(58,68),singleFraction=progress(76,96),inputs={...preparation,mixtureLoadFraction,singleLoadFraction,mixtureFraction,singleFraction},state=universalState(inputs),stage=seconds<12?'stocks':seconds<22?'load-mixture':seconds<30?'approach-mixture':seconds<50?'dose-mixture':seconds<58?'inspect-mixture':seconds<68?'load-single':seconds<76?'approach-single':seconds<96?'dose-single':seconds<108?'compare':'ranges';
 const caption=stage==='stocks'?'Inspect two independent prepared stocks. The single-constituent stock matches that constituent’s concentration in this specific five-dye recipe.':stage==='load-mixture'||stage==='load-single'?'Aspirate the selected dose into its own pipette. The stock decreases while the pipette inventory increases;the reference cell has not received that liquid yet.':stage==='approach-mixture'||stage==='approach-single'?'Move the loaded pipette to its own reference cell. Moving the tool does not transfer its contents to the cell.':stage==='dose-mixture'?'Dispense the mixture dose into its own maintained-pH cell. The pipette inventory decreases while the cell receives all five dye amounts.':stage==='inspect-mixture'?'Read the mixture’s selected teaching card. Its colour is illustrative,not a calculated spectrum or proof of exactpH.':stage==='dose-single'?'Dispense the constituent dose from its own pipette. Equal completed doses contain the same amount of the chosen constituent.':state.inference;
 return{durationSeconds:120,stage,inputs,state,caption};
}

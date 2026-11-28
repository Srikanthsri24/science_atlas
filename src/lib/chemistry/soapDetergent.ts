/** CL-0110. Selected sodium oleate / nonionic octyl-glucoside comparison.
 * Ideal soap precipitation; no empirical foam, cleansing or aggregation model. */
export interface SoapDetergentInputs{sampleMl:number;calciumMmolL:number;magnesiumMmolL:number;soapMolL:number;deliveredMl:number;agitationCycles:number;matching:'molar'|'mass'}
export const soapDetergentIds=['soap-soft','soap-hard','detergent-soft','detergent-hard']as const;
export type SoapDetergentId=typeof soapDetergentIds[number];
const Ca=40.078,Mg=24.305,Na=22.98976928,Cl=35.45,C=12.011,H=1.008,O=15.999,oleate=18*C+33*H+2*O;
export const soapDetergentConstants={Ca,Mg,Na,Cl,C,H,O,oleate,sodiumOleate:Na+oleate,octylGlucoside:14*C+28*H+6*O,calciumCarbonate:Ca+C+3*O,stockMl:20,durationS:120,nonionicReferenceCmcLowMmolL:20,nonionicReferenceCmcHighMmolL:25}as const;
export const defaultSoapDetergent:SoapDetergentInputs={sampleMl:50,calciumMmolL:1,magnesiumMmolL:.5,soapMolL:.01,deliveredMl:0,agitationCycles:0,matching:'molar'};
export const soapDetergentBounds={sampleMl:[20,100],calciumMmolL:[0,5],magnesiumMmolL:[0,5],soapMolL:[.005,.05],deliveredMl:[0,20],agitationCycles:[0,30]}as const;
export function validateSoapDetergent(raw:unknown):SoapDetergentInputs{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Soap/detergent preparation required');
 const r=raw as Record<string,unknown>,q={}as SoapDetergentInputs;
 for(const k of Object.keys(soapDetergentBounds)as(keyof typeof soapDetergentBounds)[]){const n=r[k],[lo,hi]=soapDetergentBounds[k];if(typeof n!=='number'||!Number.isFinite(n)||n<lo||n>hi)throw new RangeError(`${k} must be finite in ${lo}–${hi}`);q[k]=n;}
 if(r.matching!=='molar'&&r.matching!=='mass')throw new RangeError('Select molar or mass matching');q.matching=r.matching;return q;
}
export function soapDetergentCell(raw:SoapDetergentInputs,id:SoapDetergentId){
 const q=validateSoapDetergent(raw),c=soapDetergentConstants;if(!soapDetergentIds.includes(id))throw new RangeError('Choose one of the four matched comparisons');
 const isSoap=id.startsWith('soap-'),isHard=id.endsWith('-hard'),formulaMassGmol=isSoap?c.sodiumOleate:c.octylGlucoside;
 const stockMolL=isSoap||q.matching==='molar'?q.soapMolL:q.soapMolL*c.sodiumOleate/c.octylGlucoside;
 const stockGL=stockMolL*formulaMassGmol,stockSurfactantMol=stockMolL*c.stockMl/1000,deliveredSurfactantMol=stockMolL*q.deliveredMl/1000,remainingStockSurfactantMol=stockSurfactantMol-deliveredSurfactantMol;
 const initialCalciumMol=isHard?q.calciumMmolL*q.sampleMl/1e6:0,initialMagnesiumMol=isHard?q.magnesiumMmolL*q.sampleMl/1e6:0,initialHardnessMol=initialCalciumMol+initialMagnesiumMol;
 // The neutral detergent has no carboxylate precipitation channel here.
 // Nonionic association, salts, clouding and other mechanisms are omitted.
 const precipitatedMetalMol=isSoap?Math.min(initialHardnessMol,deliveredSurfactantMol/2):0;
 const reactedFraction=initialHardnessMol>0?precipitatedMetalMol/initialHardnessMol:0;
 const calciumPrecipitatedMol=initialCalciumMol*reactedFraction,magnesiumPrecipitatedMol=initialMagnesiumMol*reactedFraction;
 const calciumRemainingMol=initialCalciumMol-calciumPrecipitatedMol,magnesiumRemainingMol=initialMagnesiumMol-magnesiumPrecipitatedMol;
 const boundSurfactantMol=2*precipitatedMetalMol,freeSurfactantMol=Math.max(0,deliveredSurfactantMol-boundSurfactantMol);
 const nominalFinalMl=q.sampleMl+q.deliveredMl;
 const initialHardnessMgL=initialHardnessMol*c.calciumCarbonate*1e6/q.sampleMl;
 const dilutionOnlyHardnessMgL=initialHardnessMol*c.calciumCarbonate*1e6/nominalFinalMl;
 const residualHardnessMgL=(calciumRemainingMol+magnesiumRemainingMol)*c.calciumCarbonate*1e6/nominalFinalMl;
 const freeSurfactantMmolL=freeSurfactantMol*1e6/nominalFinalMl;
 const availableFraction=deliveredSurfactantMol>0?freeSurfactantMol/deliveredSurfactantMol:null;
 const deliveredSurfactantG=deliveredSurfactantMol*formulaMassGmol;
 const sodiumMol=isSoap?deliveredSurfactantMol:0,chlorideMol=2*initialHardnessMol;
 const calciumSoapEquivalentG=calciumPrecipitatedMol*(Ca+2*oleate),magnesiumSoapEquivalentG=magnesiumPrecipitatedMol*(Mg+2*oleate),scumEquivalentG=calciumSoapEquivalentG+magnesiumSoapEquivalentG;
 const sampleSaltG=initialCalciumMol*(Ca+2*Cl)+initialMagnesiumMol*(Mg+2*Cl);
 const sampleCarrierG=q.sampleMl-sampleSaltG,stockCarrierG=c.stockMl-stockSurfactantMol*formulaMassGmol,deliveredCarrierG=q.deliveredMl-deliveredSurfactantG,remainingStockCarrierG=stockCarrierG-deliveredCarrierG;
 const freeSurfactantG=freeSurfactantMol*(isSoap?oleate:formulaMassGmol);
 const aqueousSolutesG=calciumRemainingMol*Ca+magnesiumRemainingMol*Mg+sodiumMol*Na+chlorideMol*Cl+freeSurfactantG;
 const vesselFinalG=sampleCarrierG+deliveredCarrierG+aqueousSolutesG+scumEquivalentG;
 const remainingStockG=remainingStockCarrierG+remainingStockSurfactantMol*formulaMassGmol,initialAccountG=q.sampleMl+c.stockMl,finalAccountG=vesselFinalG+remainingStockG;
 // CMC classification is only a comparison with a published 20–25 mM range
 // at 20–25 °C; not a prediction for this salt-containing mixture.
 const nonionicCmcReferencePosition=isSoap?null:freeSurfactantMmolL<20?'below_reference_band':freeSurfactantMmolL<=25?'within_reference_band':'above_reference_band';
 return{id,isSoap,isHard,formulaMassGmol,stockMolL,stockGL,stockSurfactantMol,deliveredSurfactantMol,remainingStockSurfactantMol,initialCalciumMol,initialMagnesiumMol,initialHardnessMol,precipitatedMetalMol,reactedFraction,calciumPrecipitatedMol,magnesiumPrecipitatedMol,calciumRemainingMol,magnesiumRemainingMol,boundSurfactantMol,freeSurfactantMol,nominalFinalMl,initialHardnessMgL,dilutionOnlyHardnessMgL,residualHardnessMgL,freeSurfactantMmolL,availableFraction,deliveredSurfactantG,sodiumMol,chlorideMol,calciumSoapEquivalentG,magnesiumSoapEquivalentG,scumEquivalentG,sampleSaltG,sampleCarrierG,stockCarrierG,deliveredCarrierG,remainingStockCarrierG,freeSurfactantG,aqueousSolutesG,vesselFinalG,remainingStockG,initialAccountG,finalAccountG,nonionicCmcReferencePosition,
  materialResidualG:finalAccountG-initialAccountG,
  vesselMaterialResidualG:vesselFinalG-q.sampleMl-q.deliveredMl,
  aqueousChargeResidualMol:2*(calciumRemainingMol+magnesiumRemainingMol)+sodiumMol-chlorideMol-(isSoap?freeSurfactantMol:0),
  calciumResidualMol:initialCalciumMol-calciumRemainingMol-calciumPrecipitatedMol,
  magnesiumResidualMol:initialMagnesiumMol-magnesiumRemainingMol-magnesiumPrecipitatedMol,
  surfactantResidualMol:stockSurfactantMol-remainingStockSurfactantMol-freeSurfactantMol-boundSurfactantMol,
  sodiumResidualMol:(isSoap?stockSurfactantMol:0)-sodiumMol-(isSoap?remainingStockSurfactantMol:0)};
}
export function soapDetergentState(raw:SoapDetergentInputs){
 const q=validateSoapDetergent(raw),cells=soapDetergentIds.map(id=>soapDetergentCell(q,id)),[softSoap,hardSoap,softDetergent,hardDetergent]=cells;
 return{inputs:q,cells,soapHardWaterLossMol:softSoap.freeSurfactantMol-hardSoap.freeSurfactantMol,detergentHardWaterLossMol:softDetergent.freeSurfactantMol-hardDetergent.freeSurfactantMol,detergentMinusSoapDeliveredMol:hardDetergent.deliveredSurfactantMol-hardSoap.deliveredSurfactantMol,detergentMinusSoapDeliveredG:hardDetergent.deliveredSurfactantG-hardSoap.deliveredSurfactantG};
}
export function soapDetergentGuide(seconds:number,raw:SoapDetergentInputs){
 const q=validateSoapDetergent(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be 0–120 seconds');
 return{inputs:{...q,deliveredMl:q.deliveredMl*Math.max(0,Math.min(1,(seconds-15)/50)),agitationCycles:q.agitationCycles*Math.max(0,Math.min(1,(seconds-70)/40))},stage:seconds<15?'Compare the two surfactants in soft and hard water. Choose whether dose matching means equal moles or equal solute mass.':seconds<65?'Deliver matched stock volumes. Soap can be consumed in divalent soap-product equivalents; the selected neutral detergent has no such channel.':seconds<70?'Retract the metering heads and close each sample before matched agitation.':seconds<110?'Apply equal agitation. Compare unprecipitated surfactant and remaining hardness, not a claim of equal cleansing or foam performance.':'The neutral detergent can remain available while hardness ions remain in solution. Equal mass and equal moles are different comparisons; neither alone establishes washing performance.'};
}

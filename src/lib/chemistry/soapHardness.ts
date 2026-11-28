/** CL-0109: ideal finite sodium-oleate dose; not a measured foam or solubility model. */
export interface SoapHardnessInputs {
 sampleMl:number; calciumMmolL:number; magnesiumMmolL:number;
 soapMolL:number; deliveredMl:number; agitationCycles:number;
}
export const soapHardnessIds=['control','calcium','magnesium','mixed']as const;
export type SoapHardnessId=typeof soapHardnessIds[number];
// Chosen conventional atomic weights, g/mol; retain a consistent formula-mass account.
const Ca=40.078,Mg=24.305,Na=22.98976928,Cl=35.45,C=12.011,H=1.008,O=15.999;
const oleate=18*C+33*H+2*O;
export const soapHardnessConstants={Ca,Mg,Na,Cl,oleate,sodiumOleate:Na+oleate,calciumChloride:Ca+2*Cl,magnesiumChloride:Mg+2*Cl,calciumOleate:Ca+2*oleate,magnesiumOleate:Mg+2*oleate,calciumCarbonate:Ca+C+3*O,stockMl:20,foamReferenceMmolL:1,durationS:120}as const;
export const defaultSoapHardness:SoapHardnessInputs={sampleMl:50,calciumMmolL:1,magnesiumMmolL:.5,soapMolL:.01,deliveredMl:0,agitationCycles:0};
export const soapHardnessBounds={sampleMl:[20,100],calciumMmolL:[0,5],magnesiumMmolL:[0,5],soapMolL:[.005,.05],deliveredMl:[0,20],agitationCycles:[0,30]}as const;
export function validateSoapHardness(raw:unknown):SoapHardnessInputs {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Soap-hardness preparation required');
 const q={}as SoapHardnessInputs,r=raw as Record<string,unknown>;
 for(const key of Object.keys(soapHardnessBounds)as(keyof SoapHardnessInputs)[]){const v=r[key],[lo,hi]=soapHardnessBounds[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${key} must be finite in ${lo}–${hi}`);q[key]=v;}
 return q;
}
export function soapHardnessCell(raw:SoapHardnessInputs,id:SoapHardnessId){
 const q=validateSoapHardness(raw),c=soapHardnessConstants;
 if(!soapHardnessIds.includes(id))throw new RangeError('Choose a soap-hardness comparison');
 const calciumMol=id==='calcium'||id==='mixed'?q.calciumMmolL*q.sampleMl/1e6:0;
 const magnesiumMol=id==='magnesium'||id==='mixed'?q.magnesiumMmolL*q.sampleMl/1e6:0;
 const hardnessMol=calciumMol+magnesiumMol;
 const stockSoapMol=q.soapMolL*c.stockMl/1000,deliveredSoapMol=q.soapMolL*q.deliveredMl/1000,remainingStockSoapMol=stockSoapMol-deliveredSoapMol;
 // Ideal complete precipitation. When soap limits, chosen proportional Ca/Mg allocation;
 // this is explicitly not preferential precipitation derived from Ksp.
 const precipitatedMetalMol=Math.min(hardnessMol,deliveredSoapMol/2);
 const reactedFraction=hardnessMol>0?precipitatedMetalMol/hardnessMol:0;
 const calciumPrecipitatedMol=calciumMol*reactedFraction,magnesiumPrecipitatedMol=magnesiumMol*reactedFraction;
 const calciumRemainingMol=calciumMol-calciumPrecipitatedMol,magnesiumRemainingMol=magnesiumMol-magnesiumPrecipitatedMol;
 const boundOleateMol=2*precipitatedMetalMol;
 const freeOleateMol=Math.max(0,deliveredSoapMol-boundOleateMol);
 const sodiumMol=deliveredSoapMol,chlorideMol=2*hardnessMol;
 const nominalFinalMl=q.sampleMl+q.deliveredMl;
 const initialHardnessMgL=hardnessMol*c.calciumCarbonate*1e6/q.sampleMl;
 const residualHardnessMgL=(calciumRemainingMol+magnesiumRemainingMol)*c.calciumCarbonate*1e6/nominalFinalMl;
 const dilutionOnlyHardnessMgL=hardnessMol*c.calciumCarbonate*1e6/nominalFinalMl;
 const stoichiometricSoapMl=2*hardnessMol/q.soapMolL*1000;
 const freeSoapMmolL=freeOleateMol*1e6/nominalFinalMl;
 const foamProxy=Math.min(1,freeSoapMmolL/c.foamReferenceMmolL)*q.agitationCycles/30;
 const calciumSoapG=calciumPrecipitatedMol*c.calciumOleate,magnesiumSoapG=magnesiumPrecipitatedMol*c.magnesiumOleate,scumEquivalentG=calciumSoapG+magnesiumSoapG;
 const sampleSaltG=calciumMol*c.calciumChloride+magnesiumMol*c.magnesiumChloride;
 // Prepared solutions use an assumed density of 1 g/mL. Carriers are prepared
 // solution mass minus solutes, not a second sampleMl grams of water.
 const sampleCarrierG=q.sampleMl-sampleSaltG;
 const stockCarrierG=c.stockMl-stockSoapMol*c.sodiumOleate;
 const deliveredCarrierG=q.deliveredMl-deliveredSoapMol*c.sodiumOleate;
 const remainingStockCarrierG=stockCarrierG-deliveredCarrierG;
 const aqueousSolutesG=calciumRemainingMol*Ca+magnesiumRemainingMol*Mg+sodiumMol*Na+chlorideMol*Cl+freeOleateMol*oleate;
 const vesselFinalG=sampleCarrierG+deliveredCarrierG+aqueousSolutesG+scumEquivalentG;
 const remainingStockG=remainingStockCarrierG+remainingStockSoapMol*c.sodiumOleate;
 const initialAccountG=q.sampleMl+c.stockMl,finalAccountG=vesselFinalG+remainingStockG;
 return{id,calciumMol,magnesiumMol,hardnessMol,stockSoapMol,deliveredSoapMol,remainingStockSoapMol,precipitatedMetalMol,reactedFraction,calciumPrecipitatedMol,magnesiumPrecipitatedMol,calciumRemainingMol,magnesiumRemainingMol,boundOleateMol,freeOleateMol,sodiumMol,chlorideMol,nominalFinalMl,initialHardnessMgL,residualHardnessMgL,dilutionOnlyHardnessMgL,stoichiometricSoapMl,freeSoapMmolL,foamProxy,calciumSoapG,magnesiumSoapG,scumEquivalentG,sampleSaltG,sampleCarrierG,stockCarrierG,deliveredCarrierG,remainingStockCarrierG,aqueousSolutesG,vesselFinalG,remainingStockG,initialAccountG,finalAccountG,
  materialResidualG:finalAccountG-initialAccountG,
  vesselMaterialResidualG:vesselFinalG-q.sampleMl-q.deliveredMl,
  aqueousChargeResidualMol:2*(calciumRemainingMol+magnesiumRemainingMol)+sodiumMol-chlorideMol-freeOleateMol,
  calciumResidualMol:calciumMol-calciumRemainingMol-calciumPrecipitatedMol,
  magnesiumResidualMol:magnesiumMol-magnesiumRemainingMol-magnesiumPrecipitatedMol,
  oleateResidualMol:stockSoapMol-freeOleateMol-boundOleateMol-remainingStockSoapMol,
  sodiumResidualMol:stockSoapMol-sodiumMol-remainingStockSoapMol};
}
export function soapHardnessState(raw:SoapHardnessInputs){const q=validateSoapHardness(raw);return{inputs:q,cells:soapHardnessIds.map(id=>soapHardnessCell(q,id))};}
export function soapHardnessGuide(seconds:number,raw:SoapHardnessInputs){
 const q=validateSoapHardness(raw);
 if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be 0–120 seconds');
 // Demonstration staging, not a clock for chemical kinetics. Delivery progresses
 // for 50 seconds; another 40 seconds shows selected agitation cycles.
 const deliveredMl=q.deliveredMl*Math.max(0,Math.min(1,(seconds-15)/50));
 const agitationCycles=q.agitationCycles*Math.max(0,Math.min(1,(seconds-65)/40));
 return{inputs:{...q,deliveredMl,agitationCycles},stage:seconds<15?'Compare the same sample volume and matched soap stocks.':seconds<65?'Deliver a finite soap dose; compare bound and excess soap.':seconds<105?'Apply matched agitation. Bubbles illustrate a qualitative foam proxy, not generated gas.':'Separate ion removal from dilution. Compare dose, residual hardness and free soap; foam is not a calibrated hardness measurement.'};
}

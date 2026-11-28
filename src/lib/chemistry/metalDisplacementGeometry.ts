import{validateDisplacement,displacementState,type DisplacementInputs,type DisplacementMetal}from'./metalDisplacement';
export type DisplacementVector=[number,number,number];
/** Original reference-volume beakers and normalized material-stock models.
 * Coupon/deposit shapes encode stock fractions, not physical density/morphology. */
export function displacementGeometry(raw:DisplacementInputs,portrait=false,compare=false){
 const q=validateDisplacement(raw),metals:DisplacementMetal[]=compare?['Zn','Fe','Cu']:[q.coupon],radiusCm=2.5,heightCm=6,fluidHeightCm=q.volumeMl/(Math.PI*radiusCm**2);
 const cells=metals.map((coupon,index)=>{
  const state=displacementState({...q,coupon}),base:DisplacementVector=compare?(portrait?[0,(2-index)*9.5,0]:[(index-1)*6.5,0,0]):[0,0,0];
  const remainingFraction=q.couponMassG>0?Math.max(0,Math.min(1,state.couponRemainingG/q.couponMassG)):0,couponScale=Math.cbrt(remainingFraction),depositFraction=state.capacityMol>0?Math.max(0,Math.min(1,state.extentMol/state.capacityMol)):0;
  const couponCenter:DisplacementVector=[base[0],base[1]+(q.contact?fluidHeightCm/2:heightCm+.8),0];
  const deposits=Array.from({length:16},(_,i)=>{const amount=Math.max(0,Math.min(1,depositFraction*16-i));return{id:`${coupon}:deposit:${i}`,amount,radius:.16*Math.cbrt(amount),position:[base[0]+((i%4)-1.5)*.38,base[1]+.18,((Math.floor(i/4))-1.5)*.38]as DisplacementVector,metal:q.solution}});
  const bath=state.species.map(s=>({id:s.id,moles:s.finalBathMol,fraction:state.targetInitialMol>0?s.finalBathMol/state.targetInitialMol:0}));
  return{id:coupon,selected:coupon===q.coupon,state,base,vesselCenter:[base[0],base[1]+heightCm/2,0]as DisplacementVector,radiusCm,heightCm,fluidHeightCm,surfaceY:base[1]+fluidHeightCm,fluidCenter:[base[0],base[1]+fluidHeightCm/2,0]as DisplacementVector,couponCenter,couponScale,couponSize:[1.6*couponScale,.25*couponScale,.2*couponScale]as DisplacementVector,remainingFraction,depositFraction,deposits,bath};
 });
 const min:DisplacementVector=compare&&!portrait?[-10,-1.8,-3.5]:[-3.5,-1.8,-3.5],max:DisplacementVector=compare?(portrait?[3.5,27.2,3.5]:[10,8.2,3.5]):[3.5,8.2,3.5];
 return{cells,compare,portrait,radiusCm,heightCm,fluidHeightCm,limits:{min,max},scope:'Beaker geometry uses cm and reference liquid height πr²h=solution mL; solid displacement and reaction-volume changes omitted. Coupon volume fraction and deposited-grain fractions encode normalized stocks, not measured dimensions, density, literal atoms or deposit morphology. Deposit is accounted as retained solid whether or not adherent. Bath composition fractions are stoichiometric; colours are schematic, not calibrated concentration.'};
}

/** CL-0087 original reference system, not measured compound data.
 * Ideal liquid; separate pure A/B solids; equal constant molar Cp in all
 * phases; no mixing enthalpy, gradients, superheating or apparatus heat.
 * Net heat delivered to each sample is imposed, not electrical heater power.
 * mu_s=mu_l gives ln(x_i)=-L_i/R(1/T-1/Tm_i).
 */
export const mixtureMeltingConstants = Object.freeze({R:8.31446261815324,tmAK:333.15,tmBK:353.15,latentAJMol:10000,latentBJMol:12000,cpJMolK:50,initialK:278.15,maxK:363.15});
const C=mixtureMeltingConstants;
export function liquidusSolubility(temperatureK:number,component:'A'|'B'){
 if(!Number.isFinite(temperatureK)||temperatureK<=0||!['A','B'].includes(component))throw new RangeError('Positive finite kelvin temperature and A/B required');
 return Math.exp(-(component==='A'?C.latentAJMol:C.latentBJMol)/C.R*(1/temperatureK-1/(component==='A'?C.tmAK:C.tmBK)));
}
function bisect(f:(x:number)=>number,lo:number,hi:number){for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(f(mid)>0)hi=mid;else lo=mid}return(lo+hi)/2}
export const eutecticK=bisect(t=>liquidusSolubility(t,'A')+liquidusSolubility(t,'B')-1,100,Math.min(C.tmAK,C.tmBK));
export const eutecticXA=liquidusSolubility(eutecticK,'A');
export type MixtureMeltingInputs={xA:number;amountMmol:number;netPowerW:number;timeSeconds:number};
export const defaultMixtureMelting:MixtureMeltingInputs={xA:.8,amountMmol:2,netPowerW:.1,timeSeconds:0};
export function checkMixtureMelting(p:MixtureMeltingInputs){if(![p.xA,p.amountMmol,p.netPowerW,p.timeSeconds].every(Number.isFinite)||p.xA<0||p.xA>1||p.amountMmol<1||p.amountMmol>5||p.netPowerW<.05||p.netPowerW>.5||p.timeSeconds<0||p.timeSeconds>2400)throw new RangeError('xA0–1,amount1–5mmol,net heat0.05–0.5W,time0–2400s required')}
export function mixtureMeltingBoundaries(xA:number){
 if(!Number.isFinite(xA)||xA<0||xA>1)throw new RangeError('Mole fraction0–1 required');
 const pure=xA===0||xA===1,onsetK=pure?(xA===1?C.tmAK:C.tmBK):eutecticK;
 const completionK=pure?onsetK:xA>=eutecticXA?1/(1/C.tmAK-C.R/C.latentAJMol*Math.log(xA)):1/(1/C.tmBK-C.R/C.latentBJMol*Math.log(1-xA));
 const liquidAtPlateau=pure?1:Math.min(xA/eutecticXA,(1-xA)/(1-eutecticXA));
 const plateauLatentJMol=pure?(xA===1?C.latentAJMol:C.latentBJMol):liquidAtPlateau*(eutecticXA*C.latentAJMol+(1-eutecticXA)*C.latentBJMol);
 return{onsetK,completionK,liquidAtPlateau,plateauLatentJMol,onsetJMol:C.cpJMolK*(onsetK-C.initialK),completionJMol:C.cpJMolK*(completionK-C.initialK)+xA*C.latentAJMol+(1-xA)*C.latentBJMol};
}
export function mixtureMeltingState(p:MixtureMeltingInputs=defaultMixtureMelting){
 checkMixtureMelting(p);const n=p.amountMmol/1000,boundaries=mixtureMeltingBoundaries(p.xA),requestedHeatJ=p.netPowerW*p.timeSeconds,maxHeatJ=n*(C.cpJMolK*(C.maxK-C.initialK)+p.xA*C.latentAJMol+(1-p.xA)*C.latentBJMol),heatJ=Math.min(requestedHeatJ,maxHeatJ),h=heatJ/n,low=boundaries.onsetJMol,high=low+boundaries.plateauLatentJMol;
 let temperatureK:number,a:number,b:number;
 if(h<low){temperatureK=C.initialK+h/C.cpJMolK;a=0;b=0}
 else if(h<=high){temperatureK=boundaries.onsetK;const fraction=Math.max(0,Math.min(1,(h-low)/boundaries.plateauLatentJMol));if(p.xA===0||p.xA===1){a=p.xA*fraction;b=(1-p.xA)*fraction}else{a=boundaries.liquidAtPlateau*eutecticXA*fraction;b=boundaries.liquidAtPlateau*(1-eutecticXA)*fraction}}
 else if(h>=boundaries.completionJMol){a=p.xA;b=1-p.xA;temperatureK=C.initialK+(h-a*C.latentAJMol-b*C.latentBJMol)/C.cpJMolK}
 else{ // Invert liquid fraction rather than T: stable even for trace impurities.
 const aRich=p.xA>eutecticXA;
 const at=(f:number)=>{const aa=aRich?f-(1-p.xA):p.xA,bb=aRich?1-p.xA:f-p.xA;
 const logx=Math.log1p(-(aRich?bb:aa)/f);
 const t=1/(1/(aRich?C.tmAK:C.tmBK)-C.R/(aRich?C.latentAJMol:C.latentBJMol)*logx);
 return{a:aa,b:bb,t,h:C.cpJMolK*(t-C.initialK)+aa*C.latentAJMol+bb*C.latentBJMol}};
 const f=bisect(f=>at(f).h-h,boundaries.liquidAtPlateau,1),z=at(f);temperatureK=z.t;a=z.a;b=z.b}

 const liquidFraction=a+b,sensibleJ=n*C.cpJMolK*(temperatureK-C.initialK),latentAJ=n*a*C.latentAJMol,latentBJ=n*b*C.latentBJMol;
 return{...p,...boundaries,temperatureK,temperatureC:temperatureK-273.15,heatJ,requestedHeatJ,blockedHeatJ:requestedHeatJ-heatJ,maxHeatJ,liquidFraction,liquidXA:liquidFraction>0?a/liquidFraction:null,liquidAMmol:a*p.amountMmol,liquidBMmol:b*p.amountMmol,solidAMmol:(p.xA-a)*p.amountMmol,solidBMmol:(1-p.xA-b)*p.amountMmol,sensibleJ,latentAJ,latentBJ,energyResidualJ:heatJ-sensibleJ-latentAJ-latentBJ,onsetSeconds:n*low/p.netPowerW,plateauEndSeconds:n*high/p.netPowerW,completionSeconds:n*boundaries.completionJMol/p.netPowerW,cutoff:requestedHeatJ>=maxHeatJ};
}
/** 120-second narrated guide maps one shared physical clock to both samples.
 * Pure A and chosen mixture receive equal net heat at equal amount. The
 * final hold freezes physical time; no decorative motion during holds. */
export function mixtureMeltingGuide(seconds:number,preparation:MixtureMeltingInputs=defaultMixtureMelting){
 checkMixtureMelting(preparation);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide0–120s required');
 const mixture=mixtureMeltingState({...preparation,timeSeconds:0}),pure=mixtureMeltingState({...preparation,xA:1,timeSeconds:0});
 const endSeconds=Math.min(2400,Math.max(mixture.completionSeconds,pure.completionSeconds)*1.08);
 const advancing=seconds>12&&seconds<110,timeSeconds=seconds<=12?0:seconds>=110?endSeconds:(seconds-12)/98*endSeconds;
 const inputs={...preparation,timeSeconds},sample=mixtureMeltingState(inputs),reference=mixtureMeltingState({...inputs,xA:1});
 const caption=seconds<=12?'Compare pure reference A with the selected A/B sample. Both start at 5°C with equal amounts and receive the same net heat rate. A and B are hypothetical teaching substances.':seconds>=110?'Inspect the completed curves and component balances. A sharp melting transition alone does not prove purity: the eutectic mixture also melts at one temperature.':sample.liquidFraction===0?'Both component inventories remain solid. Supplied energy raises temperature before the first equilibrium liquid appears.':sample.liquidFraction>=1?'The selected sample is fully liquid. Additional net heat raises its temperature; compare its completion temperature with the pure A reference.':Math.abs(sample.temperatureK-sample.onsetK)<1e-8?'During the invariant melting interval, energy changes the phase amounts while temperature stays fixed. Watch A and B transfer into the liquid without disappearing.':'One excess solid remains beside a changing liquid composition. The lever rule conserves each component while temperature rises along the liquidus.';
 return{durationSeconds:120,timeSeconds,endSeconds,advancing,inputs,sample,reference,caption};
}

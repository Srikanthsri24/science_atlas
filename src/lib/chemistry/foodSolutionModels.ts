/** CL-0101. Controlled pure-solute food analogues,not measurements of real foods.
 * Ideal25°C aqueous speciation;closed bicarbonate liquid omits gas headspace/exchange.
 */
export interface FoodSolutionInputs{volumeMl:number;aceticMolL:number;lacticMolL:number;citricMolL:number;bicarbonateMolL:number;sampleIndex:number;insertionFraction:number}
export const foodSolutionConstants={kw:1e-14,aceticKa:1.75e-5,lacticPka:3.86,citricPkas:[3.13,4.76,6.4]as const,carbonicK1:4.45e-7,carbonicK2:4.68e-11,temperatureK:298.15,immersionFraction:.95,durationS:120}as const;
export const defaultFoodSolutions:FoodSolutionInputs={volumeMl:40,aceticMolL:.01,lacticMolL:.01,citricMolL:.01,bicarbonateMolL:.01,sampleIndex:0,insertionFraction:0};
export function validateFoodSolutions(raw:unknown):FoodSolutionInputs{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Five prepared model solutions required');const r=raw as Record<string,unknown>,q={}as FoodSolutionInputs,bounds={volumeMl:[20,80],aceticMolL:[0,.1],lacticMolL:[0,.1],citricMolL:[0,.1],bicarbonateMolL:[0,.1],sampleIndex:[0,4],insertionFraction:[0,1]}as const;for(const key of Object.keys(bounds)as(keyof typeof bounds)[]){const v=r[key],[lo,hi]=bounds[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi)throw new RangeError(`${key} must be finite in${lo}–${hi}`);q[key]=v}if(!Number.isInteger(q.sampleIndex))throw new RangeError('Select one complete sample index');return q}
/** Fractions of protonation states with charge0,−1,...;no material is duplicated. */
export function foodSpeciesFractions(h:number,kas:readonly number[]){if(!Number.isFinite(h)||h<=0||h>1||kas.length>3||kas.some(k=>!Number.isFinite(k)||k<=0))throw new RangeError('Finite aqueous protonation constants required');const weights=[1];for(const ka of kas)weights.push(weights.at(-1)!*ka/h);const sum=weights.reduce((a,b)=>a+b,0);return weights.map(w=>w/sum)}
export function foodSolutionState(raw:FoodSolutionInputs){const q=validateFoodSolutions(raw),k=foodSolutionConstants;
 const specs=[{id:'water',title:'Pure-water control',analogue:'No food composition inferred',c:0,kas:[]as number[],sodium:0,molarMass:0},
 {id:'acetic',title:'Acetic-acid model',analogue:'Vinegar analogue · pure solute',c:q.aceticMolL,kas:[k.aceticKa],sodium:0,molarMass:60.052},
 {id:'lactic',title:'Lactic-acid model',analogue:'Fermented-food analogue · pure solute',c:q.lacticMolL,kas:[10**(-k.lacticPka)],sodium:0,molarMass:90.078},
 {id:'citric',title:'Citric-acid model',analogue:'Citrus analogue · pure solute',c:q.citricMolL,kas:k.citricPkas.map(p=>10**(-p)),sodium:0,molarMass:192.123},
 {id:'bicarbonate',title:'Sodium-bicarbonate model',analogue:'Baking-soda analogue · pure solute',c:q.bicarbonateMolL,kas:[k.carbonicK1,k.carbonicK2],sodium:q.bicarbonateMolL,molarMass:84.006}];
 const cells=specs.map(spec=>{const charge=(h:number)=>{const fractions=foodSpeciesFractions(h,spec.kas),speciesMolL=fractions.map(f=>f*spec.c),anionChargeMolL=speciesMolL.reduce((sum,c,i)=>sum+i*c,0);return{fractions,speciesMolL,anionChargeMolL,residual:h+spec.sodium-k.kw/h-anionChargeMolL}};
 let lo=-14,hi=0;for(let i=0;i<100;i++){const mid=(lo+hi)/2;if(charge(10**mid).residual>0)hi=mid;else lo=mid}const hMolL=spec.c===0?Math.sqrt(k.kw):10**((lo+hi)/2),distribution=charge(hMolL),pH=-Math.log10(hMolL),formalMol=spec.c*q.volumeMl/1000,soluteG=formalMol*spec.molarMass,waterG=q.volumeMl-soluteG;
 return{...spec,hMolL,ohMolL:k.kw/hMolL,pH,...distribution,formalMol,soluteG,waterG,nominalContentsG:q.volumeMl,sodiumMol:spec.sodium*q.volumeMl/1000,speciesMol:distribution.speciesMolL.map(c=>c*q.volumeMl/1000),formalResidualMolL:spec.c-distribution.speciesMolL.reduce((a,b)=>a+b,0),category:Math.abs(pH-7)<1e-10?'neutral':pH<7?'acidic':'basic'};
 });
 const selected=cells[q.sampleIndex],probeImmersed=q.insertionFraction>=k.immersionFraction,totalSoluteG=cells.reduce((s,c)=>s+c.soluteG,0),totalSolventG=cells.reduce((s,c)=>s+c.waterG,0);
 return{...q,cells,selected,probeImmersed,probeReading:probeImmersed?selected.pH:null,totalSoluteG,totalSolventG,totalContentsG:5*q.volumeMl,massResidualG:5*q.volumeMl-totalSoluteG-totalSolventG};
}
/** Each20s cycle:6s carriage travel,5s insertion,5s comparison,4s withdrawal.
 * Final sample remains inserted for the closing comparison. No sensor kinetics claimed.
 */
export function foodSolutionGuide(seconds:number,raw:FoodSolutionInputs){const q=validateFoodSolutions(raw);if(!Number.isFinite(seconds)||seconds<0||seconds>120)throw new RangeError('Guide time must be0–120s');const cycle=Math.min(4,Math.max(0,Math.floor((seconds-10)/20))),local=seconds<10?0:Math.min(30,seconds-10-cycle*20),travel=Math.min(1,local/6),insertionFraction=local<6?0:local<11?(local-6)/5:local<16||cycle===4?1:Math.max(0,1-(local-16)/4),inputs={...q,sampleIndex:cycle,insertionFraction},carriageIndex=cycle===0?0:cycle-1+travel;
 return{seconds,inputs,carriageIndex,stage:seconds<10?'Inspect controlled food-solution analogues':local<6?'Move the raised probe to the next sample':local<11?'Lower the virtual nonconsuming probe':local<16?'Compare ideal pH and dissolved species':cycle===4?'Compare all five samples and explain the model limits':'Withdraw before moving to another sample'};
}

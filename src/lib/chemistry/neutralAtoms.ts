/** Discrete neutral-atom diagram construction for Z1–18. Tokens are counting
 * models, not physical nuclear assembly, electron trajectories or ion states. */
export const neutralAtomElements=[
 {z:1,symbol:'H',name:'Hydrogen',masses:[1,2],shells:[1],configuration:'1s1'},
 {z:2,symbol:'He',name:'Helium',masses:[3,4],shells:[2],configuration:'1s2'},
 {z:3,symbol:'Li',name:'Lithium',masses:[6,7],shells:[2,1],configuration:'1s2 2s1'},
 {z:4,symbol:'Be',name:'Beryllium',masses:[9],shells:[2,2],configuration:'1s2 2s2'},
 {z:5,symbol:'B',name:'Boron',masses:[10,11],shells:[2,3],configuration:'1s2 2s2 2p1'},
 {z:6,symbol:'C',name:'Carbon',masses:[12,13],shells:[2,4],configuration:'1s2 2s2 2p2'},
 {z:7,symbol:'N',name:'Nitrogen',masses:[14,15],shells:[2,5],configuration:'1s2 2s2 2p3'},
 {z:8,symbol:'O',name:'Oxygen',masses:[16,17,18],shells:[2,6],configuration:'1s2 2s2 2p4'},
 {z:9,symbol:'F',name:'Fluorine',masses:[19],shells:[2,7],configuration:'1s2 2s2 2p5'},
 {z:10,symbol:'Ne',name:'Neon',masses:[20,21,22],shells:[2,8],configuration:'1s2 2s2 2p6'},
 {z:11,symbol:'Na',name:'Sodium',masses:[23],shells:[2,8,1],configuration:'1s2 2s2 2p6 3s1'},
 {z:12,symbol:'Mg',name:'Magnesium',masses:[24,25,26],shells:[2,8,2],configuration:'1s2 2s2 2p6 3s2'},
 {z:13,symbol:'Al',name:'Aluminium',masses:[27],shells:[2,8,3],configuration:'1s2 2s2 2p6 3s2 3p1'},
 {z:14,symbol:'Si',name:'Silicon',masses:[28,29,30],shells:[2,8,4],configuration:'1s2 2s2 2p6 3s2 3p2'},
 {z:15,symbol:'P',name:'Phosphorus',masses:[31],shells:[2,8,5],configuration:'1s2 2s2 2p6 3s2 3p3'},
 {z:16,symbol:'S',name:'Sulfur',masses:[32,33,34,36],shells:[2,8,6],configuration:'1s2 2s2 2p6 3s2 3p4'},
 {z:17,symbol:'Cl',name:'Chlorine',masses:[35,37],shells:[2,8,7],configuration:'1s2 2s2 2p6 3s2 3p5'},
 {z:18,symbol:'Ar',name:'Argon',masses:[36,38,40],shells:[2,8,8],configuration:'1s2 2s2 2p6 3s2 3p6'}
] as const;
export const elementaryChargeC=1.602176634e-19;
export const neutralAtomIsotopes=neutralAtomElements.flatMap(e=>e.masses.map(a=>({id:`${e.symbol}-${a}`,z:e.z,a,symbol:e.symbol,name:e.name,neutronTarget:a-e.z,electronTarget:e.z,shells:[...e.shells],configuration:e.configuration})));
export interface NeutralAtomInputs{isotopeId:string;protons:number;neutrons:number;electrons:number}
export const defaultNeutralAtom:NeutralAtomInputs={isotopeId:'C-12',protons:6,neutrons:6,electrons:6};
export function neutralAtomTarget(id:string){const target=neutralAtomIsotopes.find(e=>e.id===id);if(!target)throw new RangeError('Choose a supported known isotope, H through Ar');return target}
export function completeNeutralAtom(id:string):NeutralAtomInputs{const t=neutralAtomTarget(id);return{isotopeId:id,protons:t.z,neutrons:t.neutronTarget,electrons:t.z}}
export function validateNeutralAtom(raw:unknown):NeutralAtomInputs{if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Neutral atom construction required');const r=raw as Record<string,unknown>;if(typeof r.isotopeId!=='string')throw new TypeError('Isotope identifier required');const t=neutralAtomTarget(r.isotopeId),q={isotopeId:r.isotopeId}as NeutralAtomInputs;
 for(const[k,max]of [['protons',t.z],['neutrons',t.neutronTarget],['electrons',t.z]]as const){const v=r[k];if(typeof v!=='number'||!Number.isInteger(v)||v<0||v>max)throw new RangeError(`${k} must be an integer from0to${max}`);q[k]=v;}return q;}
export function neutralAtomState(raw:NeutralAtomInputs){const q=validateNeutralAtom(raw),t=neutralAtomTarget(q.isotopeId),missingProtons=t.z-q.protons,missingNeutrons=t.neutronTarget-q.neutrons,missingElectrons=t.z-q.electrons,placedNucleons=q.protons+q.neutrons,chargeUnits=q.protons-q.electrons,protonChargeC=q.protons*elementaryChargeC,electronChargeC=-q.electrons*elementaryChargeC;
 let remaining=q.electrons;const placedShells=t.shells.map(cap=>{const count=Math.min(remaining,cap);remaining-=count;return count});
 return {inputs:q,target:t,placedNucleons,missingProtons,missingNeutrons,missingElectrons,missingTotal:missingProtons+missingNeutrons+missingElectrons,chargeUnits,protonChargeC,electronChargeC,chargeC:chargeUnits*elementaryChargeC,
  placedShells,targetShells:[...t.shells],shellElectronSum:placedShells.reduce((a,b)=>a+b,0),targetNucleons:t.z+t.neutronTarget,netChargeBalanced:chargeUnits===0,nucleusComplete:missingProtons===0&&missingNeutrons===0,complete:missingProtons===0&&missingNeutrons===0&&missingElectrons===0,
  status:missingProtons===0&&missingNeutrons===0&&missingElectrons===0?'Complete neutral reference':'Counting diagram under construction — not an identified atom or ion',massNumber:t.a,atomicNumber:t.z};}
export function neutralAtomComparison(a:string,b:string){const left=neutralAtomTarget(a),right=neutralAtomTarget(b);return{left,right,sameElement:left.z===right.z,sameIsotope:left.id===right.id,deltaProtons:right.z-left.z,deltaNeutrons:right.neutronTarget-left.neutronTarget,deltaElectrons:right.z-left.z,deltaMassNumber:right.a-left.a,deltaChargeUnits:0};}
export function neutralAtomGuide(seconds:number,raw:NeutralAtomInputs){const q=validateNeutralAtom(raw),t=neutralAtomTarget(q.isotopeId);if(!Number.isFinite(seconds)||seconds<0||seconds>150)throw new RangeError('Guide time must be0–150seconds');const portion=(start:number,end:number,count:number)=>Math.floor(count*Math.max(0,Math.min(1,(seconds-start)/(end-start)))+1e-12),stage=seconds<15?'inspect':seconds<45?'protons':seconds<75?'neutrons':seconds<120?'electrons':seconds<135?'verify':'compare';return {stage,inputs:{isotopeId:q.isotopeId,protons:portion(15,45,t.z),neutrons:portion(45,75,t.neutronTarget),electrons:portion(75,120,t.z)},caption:stage==='inspect'?'Read the selected isotope symbol, atomic number and mass number. Count tokens; this is not physical nuclear assembly.':stage==='protons'?'Place proton tokens and connect their final count with atomic number Z. The enlarged nucleus is a counting model, not a measured shape.':stage==='neutrons'?'Apply n = A − Z and place neutron tokens. Changing neutron count alone does not change the element.':stage==='electrons'?'Fill labelled shell-occupancy slots for the selected neutral ground-state reference. Moving tokens are diagram placement, not electron trajectories.':stage==='verify'?'Check p = e, total token charge zero, and A = p + n. A mass number is an integer nucleon count, not an atomic mass in grams or u.':'Compare known isotopes or different elements. Shell diagrams describe occupancy; they do not solve electron positions, probability densities or nuclear binding.'};}

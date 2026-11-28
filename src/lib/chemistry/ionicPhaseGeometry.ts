import { ionicPhaseState, type IonicPhaseInputs } from './ionicPhaseComparison';
export type IonicVector = [number, number, number];
const add=(a:IonicVector,b:IonicVector):IonicVector=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const lerp=(a:IonicVector,b:IonicVector,t:number):IonicVector=>a.map((v,i)=>v+(b[i]-v)*t) as IonicVector;
/** Separate enlarged structural inset. Counts/spacing/drift are display choices,
 * not concentrations, ionic radii, molecular dynamics or a dissolution law. */
export function ionicPhaseGeometry(raw:IonicPhaseInputs, dissolutionIllustration:number|null=null) {
 const state=ionicPhaseState(raw),q=state.inputs;
 if(dissolutionIllustration!==null&&(!Number.isFinite(dissolutionIllustration)||dissolutionIllustration<0||dissolutionIllustration>1))throw new RangeError('Illustration fraction 0–1 required');
 const transition=dissolutionIllustration!==null;
 const separation=transition?dissolutionIllustration!:q.phase==='solution'?1:0;
 const activeDrift=q.phase==='solution'&&!transition&&state.readingAvailable;
 const shift=activeDrift?-.12*Math.cos(q.cell.phaseCycle*2*Math.PI):0;
 const ions=q.phase==='water'?[]:Array.from({length:24},(_,i)=>{
  const x=i%4,y=Math.floor(i/4)%3,z=Math.floor(i/12),sign=(x+y+z)%2===0?1:-1;
  const lattice:IonicVector=[(x-1.5)*.62,(y-1)*.62,(z-.5)*.62];
  // Keep every ion identity through separation; a deterministic display layout.
  const dispersed:IonicVector=[(x-1.5)*1.34+(y%2?.2:-.2),(y-1)*1.42,(z-.5)*1.6];
  const position=add(lerp(lattice,dispersed,separation),[sign*shift,0,0]);
  const hydration=Array.from({length:4},(_,j)=>{
   const theta=j*Math.PI/2+(z?.3:0),out:IonicVector=[Math.cos(theta),Math.sin(theta),0];
   // Oxygen points toward a cation; hydrogens point toward an anion.
   const oxygen=add(position,out.map(v=>v*.32) as IonicVector);
   const direction=sign===1?1:-1,halfAngle=104.5*Math.PI/360,bond=.105;
   const tang:IonicVector=[-out[1],out[0],0];
   const hydrogens=([-1,1] as const).map(side=>add(oxygen,out.map((v,k)=>direction*bond*Math.cos(halfAngle)*v+side*bond*Math.sin(halfAngle)*tang[k]) as IonicVector));
   return{id:`water:${i}:${j}`,oxygen,hydrogens,visibility:separation};
  });
  return{id:`kcl-ion:${i}`,sign,label:sign===1?'K+':'Cl−',lattice,dispersed,position,hydration,
   velocityDirection:activeDrift?(sign===1?state.positiveIonDirection:state.negativeIonDirection):0};
 });
 const links=ions.flatMap((a,i)=>ions.slice(i+1).flatMap(b=>{
  const distance=Math.hypot(...a.lattice.map((v,k)=>v-b.lattice[k]));
  return Math.abs(distance-.62)<1e-10?[{id:`${a.id}/${b.id}`,start:a.position,end:b.position,opacity:1-separation}]:[];
 }));
 const waveform=Array.from({length:129},(_,i)=>{
  const phase=i/128,sine=i===0||i===64||i===128?0:Math.sin(phase*2*Math.PI);
  return{phase,voltage:state.appliedVoltageRmsV>0?sine:0,current:state.currentRmsA>0?sine:0};
 });
 return{state,ions,links,waveform,separation,transition,activeDrift,
  modeLabel:transition?'Explanatory separation only · circuit remains the solid control':q.phase==='solid'?'Fixed ionic lattice':q.phase==='water'?'Ideal water background · no KCl ions in this inset':'Hydrated mobile ions',
  limits:{min:[-3,-2.3,-1.4] as IonicVector,max:[3,2.3,1.4] as IonicVector},
  scope:'Enlarged illustrative inset; arbitrary equal visible K+/Cl− counts, spacing and drift amplitude. Hydration orientations are schematic. No concentration, hydration number, dissolution rate or thermal-motion prediction.'};
}

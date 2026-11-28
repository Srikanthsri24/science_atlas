import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Quaternion,Vector3} from 'three';
import {BenchStudio,BenchTag,type BenchVector} from './ScienceBenchPrimitives';
import IonicStructureViewer from './IonicStructureViewer';
import {conductivityGeometry,type ConductivityVector} from '../../lib/chemistry/solutionConductivityGeometry';
import {ionicPhaseState,type IonicPhaseInputs} from '../../lib/chemistry/ionicPhaseComparison';
interface Props{q:IonicPhaseInputs;portrait:boolean;mode:'2D'|'3D';dissolutionIllustration?:number|null;focus?:'structure'|'apparatus'}
function Rod({a,b,color}:{a:BenchVector;b:BenchVector;color:string}){const av=new Vector3(...a),bv=new Vector3(...b),d=bv.clone().sub(av);return <mesh position={av.add(bv).multiplyScalar(.5)} quaternion={new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.clone().normalize())}><cylinderGeometry args={[.035,.035,d.length(),12]}/><meshStandardMaterial color={color} roughness={.4}/></mesh>}
const f=(n:number|null)=>n===null?'Unavailable':Number(n.toPrecision(6)).toString();
export default function IonicPhaseViewer(p:Props){
 const[structural,setStructural]=useState(false),[electrons,setElectrons]=useState(true),[reset,setReset]=useState(0),s=ionicPhaseState(p.q);
 // Reuse verified cell dimensions/path layout, but gate all wire transport by this material's model.
 useEffect(()=>{if(p.focus)setStructural(p.focus==='structure')},[p.focus]);
 const aq={...p.q.cell,sampleId:p.q.phase==='water'?'water' as const:p.q.cell.sampleId};
 const g=conductivityGeometry({...aq,connected:s.fixedLattice?false:aq.connected},p.portrait),b=g.vesselBase;
 const points=useMemo(()=>{const lo=p.portrait?[-4.4,-5.2,-3]:[-6.5,-3.4,-3],hi=p.portrait?[4.4,11.2,3]:[6.5,8.8,3];return[lo[0],hi[0]].flatMap(x=>[lo[1],hi[1]].flatMap(y=>[lo[2],hi[2]].map(z=>[x,y,z] as BenchVector)))},[p.portrait]);
 const plan=useMemo(()=>({target:(p.portrait?[0,3,0]:[0,2.7,0]) as BenchVector,offset:[8,5,13] as BenchVector}),[p.portrait]);
 const project=(v:ConductivityVector)=>p.portrait?[360+v[0]*60,925-v[1]*65-v[2]*9]:[620+v[0]*78,540-v[1]*59-v[2]*8];
 const path=(v:ConductivityVector[])=>v.map((a,i)=>`${i?'L':'M'}${project(a).join(',')}`).join(' '),source=project(g.sourceCenter),base=project(b),width=p.portrait?720:1280,height=p.portrait?1280:720;
 return <div className='ionic-phase-view'>
 <div className='fibre-tools'><button aria-pressed={!structural} onClick={()=>setStructural(false)}>Circuit apparatus</button><button aria-pressed={structural} onClick={()=>setStructural(true)}>Inspect ions and hydration</button>{!structural&&<><button aria-pressed={electrons} onClick={()=>setElectrons(!electrons)}>Wire electrons</button>{p.mode==='3D'&&<button onClick={()=>setReset(x=>x+1)}>Reset apparatus camera</button>}</>}</div>
 {structural?<IonicStructureViewer {...p}/>:<div className='ionic-apparatus' style={{aspectRatio:p.portrait?'9/16':'16/9'}}>
 <div className='ionic-apparatus-display'>
 {p.mode==='2D'?<svg viewBox={`0 0 ${width} ${height}`} width='100%' height='100%' role='group' aria-label='Low-voltage ionic material comparison apparatus'>
 <defs><linearGradient id='ionic-fill' x2='0' y2='1'><stop stopColor={s.fixedLattice?'#a9bdd4':'#7cd4e5'} stopOpacity='.5'/><stop offset='1' stopColor={s.fixedLattice?'#647e9b':'#225b89'} stopOpacity='.4'/></linearGradient></defs>
 {g.leads.map(l=><g key={l.id}><path d={path(l.path)} fill='none' stroke={l.id==='left'?'#b29ae8':'#72cbb6'} strokeWidth='5'/>{electrons&&l.particles.map(e=>{const pos=project(e.position);return <circle key={e.id} cx={pos[0]} cy={pos[1]} r='3' fill='#d7efff'/>})}</g>)}
 <rect x={base[0]-145} y={base[1]-270} width='290' height='270' rx='10' fill='url(#ionic-fill)' stroke='#97b9d1' strokeWidth='3'/>
 {g.plates.map(a=>{const top=project([a.center[0],a.top,0]),bottom=project([a.center[0],a.bottom,0]);return <rect key={a.id} x={top[0]-5} y={top[1]} width='10' height={bottom[1]-top[1]} fill='#ccd6e2'/>})}
 <rect x={source[0]-130} y={source[1]-50} width='260' height='100' rx='12' fill='#223a55' stroke='#627e9c'/><text x={source[0]} y={source[1]-14} textAnchor='middle' fill='#dce6f3' fontSize='17'>Isolated AC · 1 kHz</text><text x={source[0]} y={source[1]+17} textAnchor='middle' fill='#9fe3d3' fontSize='18'>{f(s.appliedVoltageRmsV)} Vrms</text>
 <text x={base[0]} y={base[1]+18} textAnchor='middle' fill='#dce6f3' fontSize='18'>{s.fixedLattice?'Solid KCl · ideal fixed lattice':p.q.phase==='water'?'Ideal water background':'Aqueous KCl reference'}</text>
 <text x={source[0]} y={source[1]+85} textAnchor='middle' fill='#bcd2e7' fontSize='17'>Irms = {f(s.currentRmsA*1e6)} µA</text>
 <text x={width/2} y={height-25} textAnchor='middle' fill='#a9bfd4' fontSize='14'>Apparatus schematic · dimensions and current model stated in controls</text>
 </svg>:<Canvas orthographic camera={{position:[8,5,13],zoom:45}} dpr={[1,1.5]} gl={{preserveDrawingBuffer:true}}><color attach='background' args={['#0b1c2e']}/><ambientLight intensity={.8}/><directionalLight position={[5,9,10]} intensity={2.7}/><BenchStudio plan={plan} points={points} reset={reset}/>
 <mesh position={[b[0],b[1]+2,0]}><boxGeometry args={[4.4,4,2.8]}/><meshPhysicalMaterial color={s.fixedLattice?'#b6c5d7':'#409fc2'} transparent opacity={s.fixedLattice?.65:.2} roughness={s.fixedLattice?.7:.12} depthWrite={false}/></mesh>
 {[-1,1].flatMap(sign=>[<mesh key={'glassx'+sign} position={[b[0]+sign*2.24,b[1]+2.25,0]}><boxGeometry args={[.04,4.5,2.85]}/><meshPhysicalMaterial color='#b2d5ec' transparent opacity={.17} roughness={.08} depthWrite={false}/></mesh>,<mesh key={'glassz'+sign} position={[b[0],b[1]+2.25,sign*1.43]}><boxGeometry args={[4.5,4.5,.04]}/><meshPhysicalMaterial color='#b2d5ec' transparent opacity={.1} roughness={.08} depthWrite={false}/></mesh>])}
 <mesh position={[b[0],b[1]-.08,0]}><boxGeometry args={[4.5,.16,2.9]}/><meshStandardMaterial color='#536c85'/></mesh>
 {g.plates.map(a=><mesh key={a.id} position={a.center}><boxGeometry args={[a.width,a.height,a.depth]}/><meshStandardMaterial color='#c0cede' metalness={.8} roughness={.25}/></mesh>)}
 {g.leads.map(l=><group key={l.id}>{l.path.slice(1).map((end,i)=><Rod key={i} a={l.path[i]} b={end} color={l.id==='left'?'#ab97d7':'#68bfb0'}/>)}{electrons&&l.particles.map(e=><mesh key={e.id} position={e.position}><sphereGeometry args={[.04,12,10]}/><meshStandardMaterial color='#d7efff'/></mesh>)}</group>)}
 <mesh position={g.sourceCenter}><boxGeometry args={[3.4,1.7,.8]}/><meshStandardMaterial color='#263b56' roughness={.35} metalness={.4}/></mesh><BenchTag text={`${f(s.appliedVoltageRmsV)} Vrms · ${f(s.currentRmsA*1e6)} µA`} position={[g.sourceCenter[0],g.sourceCenter[1],.5]} width={3.2}/><BenchTag text={s.fixedLattice?'Solid · fixed lattice':p.q.phase==='water'?'Ideal water':'Aqueous KCl'} position={[b[0],b[1]-.75,0]} width={4}/>
 </Canvas>}
 </div></div>}
 <div className='fibre-footnote' role='status'><strong>{p.q.phase.toUpperCase()} · {f(s.appliedVoltageRmsV)} Vrms · {f(s.currentRmsA*1e6)} µA</strong><span>Instantaneous v {f(s.instantVoltageV)} V · i {f(s.instantCurrentA)} A.</span><span>{s.interpretation}</span></div>
 </div>;
}

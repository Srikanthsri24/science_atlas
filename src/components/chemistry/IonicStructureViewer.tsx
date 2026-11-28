import {useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Quaternion,Vector3} from 'three';
import {BenchStudio,type BenchVector} from './ScienceBenchPrimitives';
import {ionicPhaseGeometry,type IonicVector} from '../../lib/chemistry/ionicPhaseGeometry';
import type {IonicPhaseInputs} from '../../lib/chemistry/ionicPhaseComparison';
interface Props{q:IonicPhaseInputs;portrait:boolean;dissolutionIllustration?:number|null;mode?:'2D'|'3D'}
function Bond({start,end,color,opacity=1}:{start:IonicVector;end:IonicVector;color:string;opacity?:number}){
 const a=new Vector3(...start),b=new Vector3(...end),delta=b.clone().sub(a),rotation=new Quaternion().setFromUnitVectors(new Vector3(0,1,0),delta.clone().normalize());
 return <mesh position={a.add(b).multiplyScalar(.5)} quaternion={rotation}><cylinderGeometry args={[.015,.015,delta.length(),8]}/><meshStandardMaterial color={color} transparent opacity={opacity}/></mesh>;
}
export default function IonicStructureViewer(p:Props){
 const[mode,setMode]=useState<'2D'|'3D'>('2D'),[hydration,setHydration]=useState(true),[links,setLinks]=useState(true),[selected,setSelected]=useState('kcl-ion:0'),[reset,setReset]=useState(0);
 const viewMode=p.mode??mode;
 const g=ionicPhaseGeometry(p.q,p.dissolutionIllustration??null),ion=g.ions.find(i=>i.id===selected);
 const plan=useMemo(()=>({target:[0,0,0] as BenchVector,offset:[5,3,10] as BenchVector}),[]);
 const points=useMemo(()=>[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>[x*3,y*2.3,z*1.4] as BenchVector))),[]);
 const scale=85+(1-g.separation)*65;
 const project=(v:IonicVector)=>[360+v[0]*scale+v[2]*18,220-v[1]*scale+v[2]*9];
 return <section className='ionic-structure' aria-label='Enlarged ionic structure demonstration'>
 <div className='fibre-tools'>{!p.mode&&<><button aria-pressed={mode==='2D'} onClick={()=>setMode('2D')}>2D structure</button><button aria-pressed={mode==='3D'} onClick={()=>setMode('3D')}>3D structure</button></>}<button aria-pressed={hydration} onClick={()=>setHydration(!hydration)}>Hydration shells</button><button aria-pressed={links} onClick={()=>setLinks(!links)}>Lattice guides</button>{viewMode==='3D'&&<button onClick={()=>setReset(x=>x+1)}>Reset structure camera</button>}</div>
 <p>{g.modeLabel}</p>
 <div style={{width:'100%',aspectRatio:p.portrait?'9/16':'16/9',minHeight:240,background:'#0b1c2e',overflow:'hidden',borderRadius:18}}>
 <div className='ionic-structure-display'>
 {viewMode==='2D'?<svg viewBox='0 0 720 440' width='100%' height='100%' role='group' aria-label='Projected ionic structure; select an ion to inspect its charge'>
 {links&&g.links.map(l=>{const a=project(l.start),b=project(l.end);return <line key={l.id} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke='#8ba0b7' opacity={l.opacity*.45} strokeDasharray='4 4'/>})}
 {g.ions.map(i=>{const pos=project(i.position);return <g key={i.id}>
 {hydration&&i.hydration.map(w=>{const o=project(w.oxygen);return <g key={w.id} opacity={w.visibility}>{w.hydrogens.map((h,k)=>{const hp=project(h);return <g key={k}><line x1={o[0]} y1={o[1]} x2={hp[0]} y2={hp[1]} stroke='#b5cad9'/><circle cx={hp[0]} cy={hp[1]} r='2.8' fill='#f2f7fa'/></g>})}<circle cx={o[0]} cy={o[1]} r='4.2' fill='#ee8d91'/></g>})}
 <g role='button' tabIndex={0} aria-label={`${i.label} ${i.id}`} aria-pressed={selected===i.id} onClick={()=>setSelected(i.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i.id)}}} style={{cursor:'pointer'}}><circle cx={pos[0]} cy={pos[1]} r={selected===i.id?12:9} fill={i.sign===1?'#b5a0ec':'#77d4c0'} stroke={selected===i.id?'#fff':'#244357'} strokeWidth='2'/><text x={pos[0]} y={pos[1]+4} textAnchor='middle' fontSize='11' fill='#102238'>{i.sign===1?'+':'−'}</text></g></g>})}
 {p.q.phase==='water'&&<text x='360' y='220' textAnchor='middle' fill='#dce8f4' fontSize='15'>No KCl ions added · water background current retained</text>}
 <text x='360' y='418' textAnchor='middle' fill='#aabbcf' fontSize='12'>Enlarged structural inset · counts and distances are illustrative</text>
 </svg>:<Canvas orthographic camera={{position:[5,3,10],zoom:60}} dpr={[1,1.5]} gl={{preserveDrawingBuffer:true}}><color attach='background' args={['#0b1c2e']}/><ambientLight intensity={.8}/><directionalLight position={[5,8,10]} intensity={2.4}/><BenchStudio plan={plan} points={points} reset={reset}/>
 {links&&g.links.map(l=><Bond key={l.id} start={l.start} end={l.end} color='#7d91a8' opacity={l.opacity*.45}/>)}
 {g.ions.map(i=><group key={i.id}><mesh position={i.position} onClick={e=>{e.stopPropagation();setSelected(i.id)}}><sphereGeometry args={[selected===i.id?.15:.12,24,16]}/><meshStandardMaterial color={i.sign===1?'#b5a0ec':'#77d4c0'} roughness={.22} metalness={.12} emissive={selected===i.id?'#4f5274':'#000'} emissiveIntensity={.3}/></mesh>{hydration&&i.hydration.filter(w=>w.visibility>0).map(w=><group key={w.id}><mesh position={w.oxygen}><sphereGeometry args={[.045,12,10]}/><meshStandardMaterial color='#ee8d91' transparent opacity={w.visibility}/></mesh>{w.hydrogens.map((h,k)=><group key={k}><Bond start={w.oxygen} end={h} color='#bacbd8' opacity={w.visibility}/><mesh position={h}><sphereGeometry args={[.027,10,8]}/><meshStandardMaterial color='#f2f7fa' transparent opacity={w.visibility}/></mesh></group>)}</group>)}</group>)}
 </Canvas>}
 </div></div>
 <label>Inspect ion <select aria-label='Inspect ionic structure particle' value={ion?selected:''} onChange={e=>setSelected(e.target.value)} disabled={!g.ions.length}>{!g.ions.length&&<option value=''>No KCl ions</option>}{g.ions.map(i=><option key={i.id} value={i.id}>{i.label} · {i.id}</option>)}</select></label>
 <p aria-live='polite'>{ion?`${ion.label}: ${g.activeDrift?`instantaneous drift sign ${ion.velocityDirection}`:g.transition?'separation illustration, not a transport reading':'no translational drift in this state'}. ${ion.sign===1?'Water oxygen faces the cation.':'The hydrogen side of water faces the anion.'}`:g.state.carrierDescription}</p><small>{g.scope}</small>
 </section>;
}

import {useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {Quaternion,Vector3} from 'three';
import {BenchStudio,BenchTag,type BenchVector} from './ScienceBenchPrimitives';
import {electrolysisGeometry,type ElectrolysisVector} from '../../lib/chemistry/waterElectrolysisGeometry';
import type {ElectrolysisInputs} from '../../lib/chemistry/waterElectrolysis';
interface Props{q:ElectrolysisInputs;portrait:boolean;mode:'2D'|'3D';displaySeconds:number}
const f=(x:number|null)=>x===null?'Unavailable':Number(x.toPrecision(6)).toString();
function Rod({a,b,color,radius=.035}:{a:BenchVector;b:BenchVector;color:string;radius?:number}){const av=new Vector3(...a),bv=new Vector3(...b),d=bv.clone().sub(av);return <mesh position={av.add(bv).multiplyScalar(.5)} quaternion={new Quaternion().setFromUnitVectors(new Vector3(0,1,0),d.clone().normalize())}><cylinderGeometry args={[radius,radius,d.length(),12]}/><meshStandardMaterial color={color} metalness={.35} roughness={.3}/></mesh>}
export default function WaterElectrolysisViewer(p:Props){
 const[labels,setLabels]=useState(true),[markers,setMarkers]=useState(true),[cutaway,setCutaway]=useState(false),[selected,setSelected]=useState('hydrogen'),[reset,setReset]=useState(0),g=electrolysisGeometry(p.q,p.displaySeconds),s=g.state;
 const points=useMemo(()=>[-6,6].flatMap(x=>[-3.5,10.5].flatMap(y=>[-2.5,2.5].map(z=>[x,y,z] as BenchVector))),[]),plan=useMemo(()=>({target:[0,3.5,0] as BenchVector,offset:[8,4,16] as BenchVector}),[]);
 const width=p.portrait?720:1100,height=p.portrait?1280:800,scale=p.portrait?52:48,originX=width/2,originY=p.portrait?850:550;
 const project=(v:ElectrolysisVector)=>[originX+v[0]*scale,originY-v[1]*scale];
 const path=(points:ElectrolysisVector[])=>points.map((v,i)=>`${i?'L':'M'}${project(v).join(',')}`).join(' ');
 const chosen=g.tubes.find(t=>t.id===selected)!;
 return <div className='electrolysis-view'><div className='fibre-tools'><button aria-pressed={labels} onClick={()=>setLabels(!labels)}>Tube labels</button><button aria-pressed={markers} onClick={()=>setMarkers(!markers)}>Bubble markers</button>{p.mode==='3D'&&<><button aria-pressed={cutaway} onClick={()=>setCutaway(!cutaway)}>Open glass view</button><button onClick={()=>setReset(x=>x+1)}>Reset electrolysis camera</button></>}</div>
 <div className='electrolysis-frame' style={{aspectRatio:p.portrait?'9/16':'16/9'}}><div className='electrolysis-display'>
 {p.mode==='2D'?<svg width='100%' height='100%' viewBox={`0 0 ${width} ${height}`} role='group' aria-label='Water electrolysis with separate compensated hydrogen and oxygen volume tubes'>
 <defs><linearGradient id='electrolysis-water' x2='1'><stop stopColor='#245b88' stopOpacity='.55'/><stop offset='.5' stopColor='#66bfd3' stopOpacity='.32'/><stop offset='1' stopColor='#204d78' stopOpacity='.65'/></linearGradient></defs>
 <text x={width/2} y={p.portrait?90:35} textAnchor='middle' fill='#b7cde0' fontSize='16'>DRY-EQUIVALENT VOLUME ACCOUNTS · COMMON T/P</text>
 {g.tubes.map(t=>{const top=project([t.x,t.topY,0]),bottom=project([t.x,t.bottomY,0]),r=t.radiusCm*scale,iy=project([t.x,t.interfaceY,0])[1],color=t.id==='hydrogen'?'#b49ae9':'#78d9c4';return <g key={t.id}>
 <path d={path(t.lead)} fill='none' stroke={color} strokeWidth='4'/>
 <rect x={top[0]-r} y={top[1]} width={2*r} height={t.heightCm*scale} rx={Math.min(r,18)} fill='#203e57' stroke={selected===t.id?'#e8f2fb':'#93b1c9'} strokeWidth={selected===t.id?3:2}/>
 {t.gasHeightCm>0&&<rect x={top[0]-r+3} y={top[1]+3} width={2*r-6} height={Math.max(0,t.gasHeightCm*scale-3)} rx='8' fill={color} opacity='.28'/>}
 {t.liquidHeightCm>0&&<rect x={top[0]-r+3} y={iy} width={2*r-6} height={Math.max(0,t.liquidHeightCm*scale-3)} fill='url(#electrolysis-water)'/>}
 <line x1={top[0]-r+3} x2={top[0]+r-3} y1={iy} y2={iy} stroke={color} strokeWidth='3'/>
 {t.ticks.map((tick,i)=>{const y=project([t.x,tick.y,0])[1];return <g key={i}><line x1={top[0]+r-13} x2={top[0]+r} y1={y} y2={y} stroke='#d4e4f1'/>{labels&&i%2===0&&<text x={top[0]+r+7} y={y+4} fill='#bfd1e0' fontSize='11'>{f(tick.volumeMl)}</text>}</g>})}
 {markers&&t.bubbles.map(b=>{const pos=project(b.position);return <circle key={b.id} cx={pos[0]} cy={pos[1]} r={b.radius*scale} fill={color} opacity='.75' stroke='#e4f3ff' strokeWidth='.7'/>})}
 <rect x={bottom[0]-15} y={bottom[1]} width='30' height='35' fill='#aab7c8'/>
 <g role='button' tabIndex={0} aria-label={`Inspect ${t.gas} ${t.electrodeRole}`} onClick={()=>setSelected(t.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(t.id)}}} style={{cursor:'pointer'}}><rect x={top[0]-r} y={top[1]-63} width={2*r} height='46' rx='8' fill='#253f5a'/><text x={top[0]} y={top[1]-43} textAnchor='middle' fill={color} fontSize='18'>{t.gas} · {t.polarity}</text><text x={top[0]} y={top[1]-25} textAnchor='middle' fill='#d9e7f2' fontSize='12'>{f(t.retainedMl)} mL</text></g>
 {labels&&<text x={bottom[0]} y={bottom[1]+59} textAnchor='middle' fill='#d4e4f1' fontSize='13'>{t.id==='hydrogen'?'Negative cathode':'Positive anode'}</text>}
 </g>})}
 {(()=>{const p0=project(g.sourceCenter);return <g><rect x={p0[0]-100} y={p0[1]-34} width='200' height='68' rx='12' fill='#263f59' stroke='#6686a3'/><text x={p0[0]} y={p0[1]-8} textAnchor='middle' fill='#dce9f5' fontSize='15'>REGULATED DC</text><text x={p0[0]} y={p0[1]+16} textAnchor='middle' fill='#92d9cd' fontSize='17'>{f(s.activeCurrentA)} A · Q {f(s.chargeC)} C</text></g>})()}
 <text x={width/2} y={height-30} textAnchor='middle' fill='#a8bed3' fontSize='13'>Levels are compensated dry-volume readings · bubble counts are illustrative</text>
 </svg>:<Canvas orthographic camera={{position:[8,4,16],zoom:40}} dpr={[1,1.5]} gl={{preserveDrawingBuffer:true}}><color attach='background' args={['#0b1c2e']}/><ambientLight intensity={.75}/><directionalLight position={[5,9,10]} intensity={2.8}/><BenchStudio plan={plan} points={points} reset={reset}/>
 <mesh position={[0,-.1,0]}><boxGeometry args={[11.5,.2,5]}/><meshStandardMaterial color='#344b64' roughness={.35} metalness={.4}/></mesh>
 {g.tubes.map(t=><group key={t.id}>
 {!cutaway&&<mesh position={t.center} onClick={e=>{e.stopPropagation();setSelected(t.id)}}><cylinderGeometry args={[t.radiusCm,t.radiusCm,t.heightCm,48,1,true]}/><meshPhysicalMaterial color='#bedcec' transparent opacity={selected===t.id?.2:.12} roughness={.07} metalness={.04} depthWrite={false} side={2}/></mesh>}
 {!cutaway&&<mesh position={[t.x,t.topY+.025,0]}><cylinderGeometry args={[t.radiusCm,t.radiusCm,.05,48]}/><meshPhysicalMaterial color='#bedcec' transparent opacity={.22} roughness={.07} depthWrite={false}/></mesh>}
 {t.liquidHeightCm>0&&<mesh position={t.liquidCenter}><cylinderGeometry args={[t.radiusCm*.97,t.radiusCm*.97,t.liquidHeightCm,40]}/><meshPhysicalMaterial color='#4eadd0' transparent opacity={.25} roughness={.1} depthWrite={false}/></mesh>}
 {t.gasHeightCm>0&&<mesh position={t.gasCenter}><cylinderGeometry args={[t.radiusCm*.96,t.radiusCm*.96,t.gasHeightCm,40]}/><meshPhysicalMaterial color={t.id==='hydrogen'?'#b49ae9':'#78d9c4'} transparent opacity={.12} depthWrite={false}/></mesh>}
 <mesh position={[t.x,t.interfaceY,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[t.radiusCm*.92,t.radiusCm,48]}/><meshStandardMaterial color={t.id==='hydrogen'?'#b49ae9':'#78d9c4'} side={2}/></mesh>
 {t.ticks.map((tick,i)=><Rod key={i} a={[t.x+t.radiusCm*.8,tick.y,t.radiusCm*.6]} b={[t.x+t.radiusCm,tick.y,t.radiusCm*.6]} color='#b8d1e3' radius={.018}/>)}
 <mesh position={t.electrode}><boxGeometry args={[.5,.6,.15]}/><meshStandardMaterial color='#b9c6d6' metalness={.85} roughness={.2}/></mesh>
 {t.lead.slice(1).map((end,i)=><Rod key={i} a={t.lead[i]} b={end} color={t.id==='hydrogen'?'#b49ae9':'#78d9c4'}/>)}
 {markers&&t.bubbles.map(b=><mesh key={b.id} position={b.position}><sphereGeometry args={[b.radius,12,10]}/><meshPhysicalMaterial color={t.id==='hydrogen'?'#c5b4f4':'#9de9d6'} transparent opacity={.7} roughness={.1}/></mesh>)}
 {labels&&<BenchTag text={`${t.gas} ${t.polarity} · ${f(t.retainedMl)} mL`} position={[t.x,9.65,0]} width={3.1}/>}
 </group>)}
 <mesh position={g.sourceCenter}><boxGeometry args={[3.6,1.2,1]}/><meshStandardMaterial color='#263f59' roughness={.3} metalness={.4}/></mesh><BenchTag text={`${f(s.activeCurrentA)} A · ${f(s.chargeC)} C`} position={[0,-2.4,.55]} width={3.3}/>
 </Canvas>}
 </div></div>
 <label>Inspect collection tube<select aria-label='Electrolysis selected tube' value={selected} onChange={e=>setSelected(e.target.value)}><option value='hydrogen'>H2 · negative cathode</option><option value='oxygen'>O2 · positive anode</option></select></label>
 <div className='fibre-footnote'><strong>{chosen.gas}: {chosen.electrodeRole} · retained {f(chosen.retainedMl)} mL · overflow {f(chosen.overflowMl)} mL</strong><span>Generated H2/O2 ratio {f(s.generatedVolumeRatio)} · retained ratio {f(s.retainedVolumeRatio)}. Q {f(s.chargeC)} C.</span><small>{g.scope}</small></div>
 </div>;
}

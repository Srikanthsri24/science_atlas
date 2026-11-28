import{useMemo,useState}from'react';
import{Canvas}from'@react-three/fiber';
import{BenchStudio,BenchTag,type BenchVector}from'./ScienceBenchPrimitives';
import{displacementGeometry}from'../../lib/chemistry/metalDisplacementGeometry';
import type{DisplacementInputs,DisplacementMetal}from'../../lib/chemistry/metalDisplacement';
import './metalDisplacement.css';
interface Props{q:DisplacementInputs;portrait:boolean;mode:'2D'|'3D';compare:boolean}
const metalColor:Record<DisplacementMetal,string>={Zn:'#becbd3',Fe:'#8995a3',Cu:'#dc9967'};
const ionColor:Record<DisplacementMetal,string>={Zn:'#c9e0ed',Fe:'#86cba2',Cu:'#58a9e4'};
const f=(n:number)=>Number(n.toPrecision(5)).toString();
export default function MetalDisplacementViewer({q,portrait,mode,compare}:Props){
 const[labels,setLabels]=useState(true),[glass,setGlass]=useState(true),[reset,setReset]=useState(0),[selection,setSelection]=useState<DisplacementMetal>(q.coupon);
 const g=displacementGeometry(q,portrait,compare),selected=g.cells.find(c=>c.id===selection)??g.cells[0];
 const points=useMemo(()=>{const bounds=displacementGeometry(q,portrait,compare).limits;return bounds.min.flatMap((_,i)=>i===0?[bounds.min[0],bounds.max[0]].flatMap(x=>[bounds.min[1],bounds.max[1]].flatMap(y=>[bounds.min[2],bounds.max[2]].map(z=>[x,y,z]as BenchVector))):[])},[portrait,compare]);
 const plan=useMemo(()=>({target:[0,compare&&portrait?12:3,0]as BenchVector,offset:[8,5,16]as BenchVector}),[portrait,compare]);
 const w=portrait?720:1280,h=portrait?1280:720,scale=compare?(portrait?37:54):(portrait?88:66),originY=compare&&portrait?1110:portrait?930:565;
 const xy=(v:BenchVector)=>[w/2+v[0]*scale,originY-v[1]*scale];
 const bathColor=(cell:typeof selected)=>{const total=cell.bath.reduce((sum,b)=>sum+b.moles,0);if(total===0)return '#bfd9e8';const rgb=[0,0,0];for(const b of cell.bath){const hex=ionColor[b.id].slice(1);for(let i=0;i<3;i++)rgb[i]+=parseInt(hex.slice(i*2,i*2+2),16)*b.moles/total}return '#'+rgb.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')};
 return <div className='displacement-view'><div className='fibre-tools'><button aria-pressed={labels} onClick={()=>setLabels(v=>!v)}>Stock labels</button>{mode==='3D'&&<><button aria-pressed={glass} onClick={()=>setGlass(v=>!v)}>Glass vessels</button><button onClick={()=>setReset(v=>v+1)}>Reset displacement camera</button></>}</div>
 <div className='displacement-frame' style={{aspectRatio:portrait?'9/16':'16/9'}}><div className='displacement-display'>
 {mode==='2D'?<svg width='100%' height='100%' viewBox={`0 0 ${w} ${h}`} role='img' aria-label='Metal displacement reference beakers showing original coupon remaining, retained deposit and dissolved element stocks'>
 <defs><linearGradient id='displacement-metal'><stop stopColor='#536473'/><stop offset='.45' stopColor='#e5ecf1'/><stop offset='1' stopColor='#718494'/></linearGradient></defs>
 <text x={w/2} y={portrait?55:38} textAnchor='middle' fill='#d5e6f2' fontSize={portrait?23:20}>METAL DISPLACEMENT · CONTROLLED EXTENT</text>
 {g.cells.map(cell=>{const[bx,by]=xy(cell.base),top=by-6*scale,[cx,cy]=xy(cell.couponCenter),fs=compare&&portrait?18:20;return <g key={cell.id}>
 <path d={`M${bx-2.5*scale} ${top}v${6*scale}q${2.5*scale} ${.3*scale} ${5*scale} 0v${-6*scale}`} fill='none' stroke={cell.id===q.coupon?'#b7a4f5':'#8ba9c0'} strokeWidth='3'/>
 <rect x={bx-2.48*scale} y={by-cell.fluidHeightCm*scale} width={4.96*scale} height={cell.fluidHeightCm*scale} fill={bathColor(cell)} opacity='.28'/><line x1={bx-2.48*scale} x2={bx+2.48*scale} y1={by-cell.fluidHeightCm*scale} y2={by-cell.fluidHeightCm*scale} stroke={bathColor(cell)} strokeWidth='2'/>
 {cell.couponScale>0&&<rect x={cx-cell.couponSize[0]*scale/2} y={cy-cell.couponSize[1]*scale/2} width={cell.couponSize[0]*scale} height={cell.couponSize[1]*scale} rx='3' fill='url(#displacement-metal)' stroke={metalColor[cell.id]}/>}
 {cell.deposits.filter(d=>d.amount>0).map(d=>{const[x,y]=xy(d.position);return <circle key={d.id} cx={x+d.position[2]*scale*.25} cy={y-d.position[2]*scale*.16} r={d.radius*scale} fill={metalColor[d.metal]} stroke='#c8d6df' strokeWidth='.5'/>})}
 {labels&&<><text x={bx} y={top-23} fill='#e6edf5' textAnchor='middle' fontSize={fs}>{cell.id} + {q.solution}²⁺ solution</text><text x={bx} y={by+35} fill='#bfd4e6' textAnchor='middle' fontSize={fs}>{f(cell.state.couponRemainingG)} g coupon · {f(cell.state.depositMassG)} g deposit</text><text x={bx} y={by+65} fill='#b7c9dc' textAnchor='middle' fontSize={fs-2}>{cell.state.eligible?(q.contact?'Allowed selected reaction':'No-contact control'):'No net selected reaction'}</text></>}
 </g>})}
 <text x={w/2} y={h-25} fill='#aac2d5' textAnchor='middle' fontSize={portrait?17:16}>Normalized solid stocks · schematic bath colour · no measured reaction rate</text>
 </svg>:<Canvas orthographic camera={{position:[8,5,16],zoom:45}} dpr={[1,1.5]} gl={{preserveDrawingBuffer:true}}><color attach='background' args={['#0b1c2e']}/><ambientLight intensity={.9}/><directionalLight position={[4,12,9]} intensity={2.5}/><BenchStudio plan={plan} points={points} reset={reset}/>
 {g.cells.map(cell=><group key={cell.id}>
 <mesh position={[cell.base[0],cell.base[1]-.12,0]}><cylinderGeometry args={[2.65,2.7,.24,64]}/><meshStandardMaterial color={cell.id===q.coupon?'#635496':'#334c64'} metalness={.35} roughness={.4}/></mesh>
 <mesh position={cell.fluidCenter}><cylinderGeometry args={[2.47,2.47,cell.fluidHeightCm,64]}/><meshPhysicalMaterial color={bathColor(cell)} transparent opacity={.22} roughness={.15} depthWrite={false}/></mesh>
 {glass&&<><mesh position={cell.vesselCenter}><cylinderGeometry args={[2.5,2.5,6,64,1,true]}/><meshPhysicalMaterial color='#c7e0ee' transparent opacity={.14} roughness={.08} side={2} depthWrite={false}/></mesh><mesh position={[cell.base[0],cell.base[1]+6,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.5,.035,8,64]}/><meshStandardMaterial color='#bed6e6' metalness={.4}/></mesh></>}
 {cell.couponScale>0&&<mesh position={cell.couponCenter} onClick={e=>{e.stopPropagation();setSelection(cell.id)}}><boxGeometry args={cell.couponSize}/><meshStandardMaterial color={metalColor[cell.id]} metalness={.85} roughness={.28}/></mesh>}
 {cell.deposits.filter(d=>d.amount>0).map(d=><mesh key={d.id} position={d.position} onClick={e=>{e.stopPropagation();setSelection(cell.id)}}><icosahedronGeometry args={[d.radius,1]}/><meshStandardMaterial color={metalColor[d.metal]} metalness={.8} roughness={.35}/></mesh>)}
 {labels&&<><BenchTag text={`${cell.id} coupon · ${q.solution}²⁺ bath`} position={[cell.base[0],cell.base[1]+7.5,0]} width={5.4}/><BenchTag text={`${f(cell.state.couponRemainingG)} g + ${f(cell.state.depositMassG)} g deposit`} position={[cell.base[0],cell.base[1]-.8,0]} width={5.6}/></>}
 </group>)}
 </Canvas>}
 </div></div>
 <label>Inspect reference beaker<select aria-label='Displacement reference beaker' value={selected.id} onChange={e=>setSelection(e.target.value as DisplacementMetal)}>{g.cells.map(c=><option key={c.id} value={c.id}>{c.id} coupon in {q.solution}²⁺ solution</option>)}</select></label>
 <div className='fibre-footnote'><strong>{selected.state.equation}</strong><span>Reacted extent {f(selected.state.extentMol)} mol · control / limiting stock: {selected.state.limiting}</span><span>Dissolved stocks: {selected.bath.map(b=>`${b.id}²⁺ ${f(b.moles)} mol`).join(' · ')}. No free electrons are depicted in the solution.</span><small>{g.scope} Equal starting coupon mass in comparison does not mean equal initial moles.</small></div>
 </div>;
}

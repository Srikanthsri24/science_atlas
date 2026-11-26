import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,DoubleSide,Plane,Vector3} from 'three';
import {BenchStudio,BenchLine,BenchTag,type BenchVector} from './ScienceBenchPrimitives';
import {cupConditionNames,cupConditions,cupReference as c,type CupInputs,type CupCondition} from '../../lib/chemistry/invertedCup';
import {invertedCupGeometry,invertedCupGasTriangles,invertedCupInsideWaterTriangles,invertedCupWallTriangles,invertedCupCapTriangles,invertedCupOutsideWaterTriangles} from '../../lib/chemistry/invertedCupGeometry';
function Volume({vertices,color,opacity,cut=false}:{vertices:number[];color:string;opacity:number;cut?:boolean}){
 const geometry=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(vertices),3));g.computeVertexNormals();return g},[vertices]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 const plane=useMemo(()=>[new Plane(new Vector3(0,0,-1),0)],[]);
 return <mesh geometry={geometry}><meshPhysicalMaterial color={color} roughness={.18} metalness={.04} transparent={opacity<1} opacity={opacity} depthWrite={opacity===1} side={DoubleSide} clippingPlanes={cut?plane:null}/></mesh>;
}
function Apparatus({q,condition,x,follow,overlay,cut}:{q:CupInputs;condition:CupCondition;x:number;follow:boolean;overlay:boolean;cut:boolean}){
 const s=invertedCupGeometry(q,condition),parts=useMemo(()=>({gas:invertedCupGasTriangles(q,condition),inside:invertedCupInsideWaterTriangles(q,condition),wall:invertedCupWallTriangles(q,condition),cap:invertedCupCapTriangles(q,condition),outside:invertedCupOutsideWaterTriangles(q,condition)}),[q,condition]);
 return <group position={[x,follow?-s.rimY:0,0]}>
 <Volume vertices={parts.outside} color='#399fcd' opacity={.25} cut={cut}/>
 <Volume vertices={parts.wall} color='#d4ebef' opacity={.3} cut={cut}/><Volume vertices={parts.cap} color='#b5d7df' opacity={.6}/>
 {s.gasPresent&&overlay&&<Volume vertices={parts.gas} color='#f2b94d' opacity={.13}/>}
 {follow&&<><BenchTag text={s.gasPresent?`AIR ${s.gasVolumeMl.toFixed(2)} mL`:'NO RETAINED AIR'} position={[0,s.roofY-q.cupHeightCm*.25,q.cupRadiusCm+.3]} width={q.cupRadiusCm*1.5}/><BenchTag text={`WATER ${s.waterInsideMl.toFixed(2)} mL`} position={[0,s.rimY-.4,q.cupRadiusCm+.3]} width={q.cupRadiusCm*1.7}/></>}
 {s.waterHeightCm>0&&<Volume vertices={parts.inside} color='#46c6e4' opacity={.65} cut={cut}/>}
 {!follow&&<mesh position={[0,(c.basinTopY+s.floorY)/2,0]}><cylinderGeometry args={[q.basinRadiusCm+.15,q.basinRadiusCm+.15,c.basinTopY-s.floorY,128,1,true]}/><meshPhysicalMaterial color='#b3d7e7' transparent opacity={.08} side={DoubleSide} depthWrite={false}/></mesh>}
 <mesh position={[0,s.floorY-.15,0]}><cylinderGeometry args={[q.basinRadiusCm+.25,q.basinRadiusCm+.25,.3,128]}/><meshStandardMaterial color='#49657a' roughness={.35} metalness={.3}/></mesh>
 <BenchLine a={[-q.cupRadiusCm,s.markerY,0]} b={[q.cupRadiusCm,s.markerY,0]} radius={.055} color={s.markerEverContacted?'#d66b86':'#e9d895'}/>
 {condition==='vented'&&<><BenchLine a={[q.cupRadiusCm*.65,s.roofY,0]} b={[q.cupRadiusCm*.65,c.ventOutletY,0]} radius={.055} color='#d6b9ef'/><BenchTag text='IDEAL DRY VENT' position={[0,c.ventOutletY+1,0]} width={6}/></>}
 <BenchTag text={cupConditionNames[condition]} position={[0,c.basinTopY+3,0]} width={10}/>
 </group>;
}
export default function InvertedCupScene({q,condition,portrait}:{q:CupInputs;condition:CupCondition;portrait:boolean}){
 const [camera,setCamera]=useState('comparison'),[overlay,setOverlay]=useState(true),[cut,setCut]=useState(true),[reset,setReset]=useState(0),s=invertedCupGeometry(q,condition),follow=camera==='cup'||camera==='entry';
 const plan=useMemo(()=>({target:[0,camera==='entry'?1:camera==='cup'?q.cupHeightCm/2:-9,0] as BenchVector,offset:[5,3,70] as BenchVector}),[camera,q.cupHeightCm]);
 const points=useMemo(()=>{const r=camera==='comparison'?2*q.basinRadiusCm+3:camera==='entry'?q.cupRadiusCm+1:camera==='cup'?q.cupRadiusCm+2:q.basinRadiusCm+2;const ys=camera==='entry'?[-.5,3]:camera==='cup'?[-1,q.cupHeightCm+2]:[-36,19];return [-r,r].flatMap(x=>ys.flatMap(y=>[-q.cupRadiusCm,q.cupRadiusCm].map(z=>[x,y,z] as BenchVector)))},[camera,q.basinRadiusCm,q.cupHeightCm,q.cupRadiusCm]);
 return <div className={`cup-scene ${portrait?'vertical':''}`} data-cup-3d-time={q.timeSeconds} data-cup-3d-condition={condition}><div className='cup-tools'><label>Inspect <select aria-label='Cup 3D camera' value={camera} onChange={e=>setCamera(e.target.value)}><option value='comparison'>Both complete basins</option><option value='selected'>Selected complete basin</option><option value='cup'>Follow selected cup</option><option value='entry'>Follow rim · water entry close-up</option></select></label><button aria-pressed={overlay} onClick={()=>setOverlay(v=>!v)}>Air volume overlay {overlay?'on':'off'}</button><button aria-pressed={cut} onClick={()=>setCut(v=>!v)}>Diagnostic cutaway {cut?'on':'off'}</button><button onClick={()=>setReset(v=>v+1)}>Reset cup camera</button></div>
 <Canvas orthographic camera={{position:[0,0,70],near:.1,far:500}} gl={{localClippingEnabled:true}} frameloop='demand' dpr={[1,1.5]}><color attach='background' args={['#102235']}/><ambientLight intensity={1}/><directionalLight position={[-15,30,25]} intensity={2}/><BenchStudio plan={plan} points={points} reset={reset}/>{camera==='comparison'?cupConditions.map((v,i)=><Apparatus key={v} q={q} condition={v} x={(i?1:-1)*(q.basinRadiusCm+2)} follow={false} overlay={overlay} cut={cut}/>):<Apparatus q={q} condition={condition} x={0} follow={follow} overlay={overlay} cut={cut}/>}</Canvas>
 <div className='cup-readouts' role='region' aria-label='Cup 3D readings' tabIndex={0}><strong>{cupConditionNames[condition]} · {q.timeSeconds.toFixed(2)} s</strong><span>Water inside {s.waterInsideMl.toFixed(3)} mL · retained air {s.gasVolumeMl.toFixed(3)} mL</span><span>Gas pressure: {s.gasPressureKPa===null?'Not applicable: no gas pocket':`${s.gasPressureKPa.toFixed(3)} kPa absolute`}</span><span>Air tint is explanatory. Cutaway removes no modeled material. Camera orbit is not physical cup tilt. Follow views move the camera reference with the rim.</span></div></div>;
}

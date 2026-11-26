import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,CanvasTexture,DoubleSide,SRGBColorSpace} from 'three';
import {BenchStudio,BenchTag,BenchLine,type BenchVector} from './ScienceBenchPrimitives';
import {neutralizationGeometry,neutralizationDropTriangles,neutralizationApparatus as a} from '../../lib/chemistry/neutralizationGeometry';
import type {NeutralizationInputs} from '../../lib/chemistry/neutralization';
function ScaleNumber({value,y}:{value:number;y:number}){
 const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=160;const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#10273e';ctx.fillRect(0,0,256,160);ctx.fillStyle='#e6f2fc';ctx.font='88px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(value),128,80);const t=new CanvasTexture(canvas);t.colorSpace=SRGBColorSpace;return t},[value]);
 useEffect(()=>()=>texture.dispose(),[texture]);return <sprite position={[-2,y,.7]} scale={[1.5,.94,1]}><spriteMaterial map={texture} depthTest={false}/></sprite>;
}
function Apparatus({q,delivery,buretteOnly}:{q:NeutralizationInputs;delivery:boolean;buretteOnly:boolean}){
 const s=neutralizationGeometry(q),drop=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(neutralizationDropTriangles(q.plannedBaseMl/q.aliquots)),3));g.computeVertexNormals();return g},[q.plannedBaseMl,q.aliquots]);
 useEffect(()=>()=>drop.dispose(),[drop]);
 const glass=<meshPhysicalMaterial color='#c8e8f4' transparent opacity={.1} roughness={.12} side={DoubleSide} depthWrite={false}/>;
 return <group>
 {!delivery&&<>
  <mesh position={[0,a.barrelBottomY+a.barrelHeightCm/2,0]}><cylinderGeometry args={[a.barrelRadiusCm,a.barrelRadiusCm,a.barrelHeightCm,128,1,true]}/>{glass}</mesh>
  {s.reservoirDepthCm>0&&<mesh position={[0,a.barrelBottomY+s.reservoirDepthCm/2,0]}><cylinderGeometry args={[.8,.8,s.reservoirDepthCm,128]}/><meshPhysicalMaterial color='#a9d4e5' transparent opacity={.24} roughness={.14} depthWrite={false}/></mesh>}
  {[a.barrelBottomY,a.barrelBottomY+a.barrelHeightCm].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.8,.035,8,128]}/><meshStandardMaterial color='#c2dce9' metalness={.3}/></mesh>)}
  {!buretteOnly&&<><BenchLine a={[a.standX,.9,0]} b={[a.standX,a.standHeight,0]} radius={.14}/>{[16,27].map(y=><group key={y}><BenchLine a={[a.standX,y,0]} b={[1,y,0]} radius={.1}/><mesh position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.95,.065,8,64]}/><meshStandardMaterial color='#8198b0' metalness={.6}/></mesh></group>)}</>}
  {s.scale.map(t=><group key={t.readingMl}><BenchLine a={[-.83,t.y,.8]} b={[-1.17,t.y,.8]} radius={.025}/><ScaleNumber value={t.readingMl} y={t.y}/></group>)}
  {!buretteOnly&&<mesh position={[a.standX,.65,0]}><boxGeometry args={[5,.4,5]}/><meshStandardMaterial color='#586c86' metalness={.3}/></mesh>}
  <BenchTag text='50 mL BURETTE · NaOH SOLUTION' position={[0,34,0]} width={buretteOnly?8:11}/>
 </>}
 <mesh position={[0,7.175,0]}><cylinderGeometry args={[.8,.04,.35,32]}/><meshStandardMaterial color='#a4b7c9' metalness={.45} roughness={.2}/></mesh><BenchLine a={[-.7,7.45,0]} b={[.7,7.45,0]} radius={.07} color='#b2a0d9'/>
 {!buretteOnly&&<><mesh position={[0,a.vesselBottomY+a.vesselHeightCm/2,0]}><cylinderGeometry args={[2.5,2.5,5.5,128,1,true]}/>{glass}</mesh>
 {[1.5,7].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[2.5,.045,8,128]}/><meshStandardMaterial color='#bddae8' roughness={.2} metalness={.3}/></mesh>)}
 <mesh position={[0,1.5+s.vesselDepthCm/2,0]}><cylinderGeometry args={[2.5,2.5,s.vesselDepthCm,128]}/><meshPhysicalMaterial color='#a9d4e5' transparent opacity={.24} roughness={.14} depthWrite={false}/></mesh>
 <mesh position={[0,1.25,0]}><cylinderGeometry args={[2.7,2.7,.35,128]}/><meshStandardMaterial color='#526b88' metalness={.3}/></mesh>
 <BenchLine a={[1.4,1.75,.4]} b={[1.4,8.2,.4]} radius={.055} color='#798eab'/><mesh position={[1.4,1.75,.4]}><sphereGeometry args={[.13,24,16]}/><meshStandardMaterial color='#c7e4ef' roughness={.22}/></mesh>
 {s.inFlight.map(d=><mesh key={d.index} geometry={drop} position={[0,d.centreY,0]}><meshPhysicalMaterial color='#c3eaf4' roughness={.13} transparent opacity={.9}/></mesh>)}
 <BenchTag text='CLEAR SAMPLE · CALCULATED pH' position={[0,.25,0]} width={8}/></>}
 </group>;
}
type Camera='apparatus'|'burette'|'delivery';
export default function NeutralizationScene({q,portrait}:{q:NeutralizationInputs;portrait:boolean}){
 const [camera,setCamera]=useState<Camera>('apparatus'),[reset,setReset]=useState(0),s=neutralizationGeometry(q);
 const plan=useMemo(()=>({target:(camera==='delivery'?[0,4.5,0]:camera==='burette'?[0,20,0]:[0,17,0]) as BenchVector,offset:(camera==='delivery'?[3,3,25]:[8,9,60]) as BenchVector}),[camera]);
 const points=useMemo(()=>{const xs=camera==='delivery'?[-5,5]:camera==='burette'?[-4,4]:[-6.5,8],ys=camera==='delivery'?[-.4,9]:camera==='burette'?[6.6,35]:[-1,36];return xs.flatMap(x=>ys.flatMap(y=>[-3,3].map(z=>[x,y,z] as BenchVector)))},[camera]);
 return <div className={`neutralization-scene ${portrait?'vertical':''}`} data-neutralization-3d-time={q.timeS} data-neutralization-3d-ph={s.pH}>
 <div className='neutralization-tools'><label>Inspect <select aria-label='Neutralization 3D camera' value={camera} onChange={e=>setCamera(e.target.value as Camera)}><option value='apparatus'>Complete titration apparatus</option><option value='burette'>Burette scale and liquid level</option><option value='delivery'>Falling aliquot and sample</option></select></label><button onClick={()=>setReset(v=>v+1)}>Reset titration camera</button></div>
 <Canvas orthographic camera={{position:[0,20,60],near:.1,far:500}} frameloop='demand' dpr={[1,1.5]}><color attach='background' args={['#102235']}/><ambientLight intensity={1.1}/><directionalLight position={[-10,35,20]} intensity={2}/><BenchStudio plan={plan} points={points} reset={reset}/><Apparatus q={q} delivery={camera==='delivery'} buretteOnly={camera==='burette'}/></Canvas>
 <div className='neutralization-readouts' role='region' aria-label='Neutralization live readings' tabIndex={0} aria-live='off'><strong>Calculated pH {s.pH.toFixed(4)} · {s.category} · 25 °C</strong><span>Burette {s.buretteReadingMl.toFixed(3)} mL · released {s.releasedMl.toFixed(3)} mL · arrived {s.deliveredMl.toFixed(3)} mL</span><span>In flight {s.inFlightMl.toFixed(3)} mL · vessel {s.vesselMl.toFixed(3)} mL · elapsed {q.timeS.toFixed(3)} s</span><span>Both solutions are clear. Rotate / zoom / pan with pointer controls.</span></div>
 <details className='neutralization-notes' tabIndex={0} aria-label='Neutralization model limitations'><summary>What this titration models</summary><p>Ideal dilute HCl/NaOH at25°C; water autoionization and charge balance determine the calculated pH. Whole aliquots mix instantly after contact. No heat, air drag, activity correction, CO₂ uptake, splash or sensor-response model. Probe displacement and zero-volume valve/nozzle are drawing assumptions. In the delivery close-up, the rest of the burette is omitted. A colour endpoint is not automatically stoichiometric equivalence.</p></details></div>;
}

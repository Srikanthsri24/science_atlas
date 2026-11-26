import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,DoubleSide} from 'three';
import {BenchStudio,BenchTag,BenchLine,type BenchVector} from './ScienceBenchPrimitives';
import {cabbageGeometry,cabbageDropTriangles,cabbageApparatus as a} from '../../lib/chemistry/cabbageGeometry';
import type {CabbageInputs,CabbageSample} from '../../lib/chemistry/cabbageIndicator';
const samples:CabbageSample[]=['acid','neutral','base'];
function Station({q,sample}:{q:CabbageInputs;sample:CabbageSample}){
 const s=cabbageGeometry(q,sample);
 const drop=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(cabbageDropTriangles(q.doseMl/q.drops)),3));g.computeVertexNormals();return g},[q.doseMl,q.drops]);
 useEffect(()=>()=>drop.dispose(),[drop]);
 const glass=<meshPhysicalMaterial color='#c7e4ef' transparent opacity={.12} roughness={.1} side={DoubleSide} depthWrite={false}/>;
 return <group position={[s.stationX,0,0]}>
 <mesh position={[0,3,0]}><cylinderGeometry args={[2,2,4,128,1,true]}/>{glass}</mesh>
 {[1,5].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[2,.045,8,128]}/><meshStandardMaterial color='#bcd9e8' metalness={.4}/></mesh>)}
 <mesh position={[0,1+s.liquidDepthCm/2,0]}><cylinderGeometry args={[2,2,s.liquidDepthCm,128]}/><meshPhysicalMaterial color='#b4dce5' transparent opacity={.16} roughness={.2} depthWrite={false}/></mesh>
 {s.hasIndicator&&<mesh position={[0,1+s.liquidDepthCm/2,0]}><cylinderGeometry args={[1.999,1.999,s.liquidDepthCm,128]}/><meshPhysicalMaterial color={s.colour.hex} transparent opacity={s.opacity*.85} roughness={.2} depthWrite={false}/></mesh>}
 <mesh position={[0,s.reservoirBottomY+.9,0]}><cylinderGeometry args={[.55,.55,1.8,128,1,true]}/>{glass}</mesh>
 {s.reservoirDepthCm>0&&<mesh position={[0,s.reservoirBottomY+s.reservoirDepthCm/2,0]}><cylinderGeometry args={[.55,.55,s.reservoirDepthCm,128]}/><meshPhysicalMaterial color={q.pigmentMgMl>0?'#975cb1':'#b4dce5'} transparent opacity={.6} roughness={.2}/></mesh>}
 <mesh position={[0,s.nozzleY+.175,0]}><cylinderGeometry args={[.3,.04,.35,32]}/><meshStandardMaterial color='#7d96af' metalness={.6} roughness={.2}/></mesh>
 {s.dropCentres.map(d=><mesh key={d.index} geometry={drop} position={[0,d.centreY,0]}><meshPhysicalMaterial color={q.pigmentMgMl>0?'#aa70ca':'#b4dce5'} roughness={.12} metalness={.1}/></mesh>)}
 <BenchLine a={[2.7,.5,0]} b={[2.7,15,0]} radius={.1}/><BenchLine a={[2.7,s.reservoirBottomY+1,0]} b={[.6,s.reservoirBottomY+1,0]} radius={.08}/>
 <mesh position={[0,.7,0]}><cylinderGeometry args={[2.2,2.2,.3,128]}/><meshStandardMaterial color='#61718d' metalness={.3}/></mesh>
 <BenchTag text={`${sample.toUpperCase()} · KNOWN pH ${s.referencePH}`} position={[0,-.4,0]} width={6.5}/>
 <BenchTag text={`${s.arrivedCount}/${q.drops} ARRIVED · ${s.vesselMl.toFixed(2)} mL`} position={[0,16,0]} width={6.5}/>
 </group>;
}
export default function CabbageScene({q,portrait}:{q:CabbageInputs;portrait:boolean}){
 const [camera,setCamera]=useState('all'),[reset,setReset]=useState(0);
 const plan=useMemo(()=>({target:[camera==='all'?0:a.stations[camera as CabbageSample],7,0] as BenchVector,offset:[6,7,35] as BenchVector}),[camera]);
 const points=useMemo(()=>{const x=camera==='all'?[-11,11]:[a.stations[camera as CabbageSample]-3.5,a.stations[camera as CabbageSample]+3.5];return x.flatMap(x=>[-1.3,17].flatMap(y=>[-3,3].map(z=>[x,y,z] as BenchVector)))},[camera]);
 return <div className={`cabbage-scene ${portrait?'vertical':''}`}><div className='cabbage-tools'><label>Inspect <select aria-label='Cabbage 3D camera' value={camera} onChange={e=>setCamera(e.target.value)}><option value='all'>All three references</option>{samples.map(s=><option key={s} value={s}>{s} reference</option>)}</select></label><button onClick={()=>setReset(v=>v+1)}>Reset cabbage camera</button></div>
 <Canvas orthographic camera={{position:[0,15,40],near:.1,far:500}} frameloop='demand' dpr={[1,1.5]}><color attach='background' args={['#102235']}/><ambientLight intensity={1.1}/><directionalLight position={[0,25,15]} intensity={2}/><BenchStudio plan={plan} points={points} reset={reset}/>{(camera==='all'?samples:[camera as CabbageSample]).map(sample=><Station key={sample} q={q} sample={sample}/>)}</Canvas>
 <div className='cabbage-readouts' aria-live='off'>{samples.map(sample=>{const s=cabbageGeometry(q,sample);return <span key={sample}>{sample}: {s.observedColour} · {s.vesselPigmentMg.toFixed(4)} mg in {s.vesselMl.toFixed(3)} mL</span>})}<span>Elapsed {q.timeS.toFixed(2)} s · rotate / zoom / pan with pointer controls</span></div>
 <details className='cabbage-notes' tabIndex={0} aria-label='Cabbage model limitations'><summary>What this apparatus models</summary><p>Known ideal buffer pH stays fixed. Matched drops fall 8 cm above the rising surface; the dispenser follows it. Whole aliquots mix on contact. Colour is qualitative, not a calibrated measurement of pH. The glass and drops use volume-calibrated meshes; no splashing, diffusion or pigment-species kinetics are solved.</p></details></div>;
}

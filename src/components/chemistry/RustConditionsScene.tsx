import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,DataTexture,RGBAFormat,RepeatWrapping,DoubleSide,Plane,Vector3} from 'three';
import {BenchStudio,BenchLine,BenchTag,type BenchVector} from './ScienceBenchPrimitives';
import {rustGeometry,rustCoreTriangles,rustAttachedTriangles,rustWaterTriangles,rustSedimentTriangles,rustApparatus as a} from '../../lib/chemistry/rustConditionsGeometry';
import {rustConditions,rustConditionNames,rustReference,type RustInputs,type RustCondition} from '../../lib/chemistry/rustConditions';
const cutPlane=new Plane(new Vector3(0,0,1),0),cutPlanes=[cutPlane];
function Phase({vertices,kind,cutaway=false}:{vertices:number[];kind:'metal'|'product'|'sediment'|'water';cutaway?:boolean}){
 const geometry=useMemo(()=>{const g=new BufferGeometry(),uv:number[]=[];let radius=0;
  for(let i=0;i<vertices.length;i+=3)radius=Math.max(radius,Math.hypot(vertices[i],vertices[i+2]));
  for(let i=0;i<vertices.length;i+=9){const cap=Math.max(vertices[i+1],vertices[i+4],vertices[i+7])-Math.min(vertices[i+1],vertices[i+4],vertices[i+7])<1e-12;
   const angles=[0,3,6].map(j=>Math.atan2(vertices[i+j+2],vertices[i+j])/(2*Math.PI)+.5),seam=Math.max(...angles)-Math.min(...angles)>.5;
   for(let j=0;j<3;j++)uv.push(cap?vertices[i+j*3]/(2*Math.max(radius,1e-12))+.5:angles[j]+(seam&&angles[j]<.5?1:0),cap?vertices[i+j*3+2]/(2*Math.max(radius,1e-12))+.5:vertices[i+j*3+1]*3);
  }g.setAttribute('position',new BufferAttribute(new Float32Array(vertices),3));g.setAttribute('uv',new BufferAttribute(new Float32Array(uv),2));g.computeVertexNormals();return g},[vertices]);
 const bump=useMemo(()=>{if(kind==='metal'||kind==='water')return null;const pixels=new Uint8Array(128*128*4);for(let i=0;i<128*128;i++){const hash=Math.imul(i+17,1664525)^Math.imul(i*i+31,1013904223),v=128+((hash>>>16)&127);pixels.set([v,v,v,255],i*4)}const t=new DataTexture(pixels,128,128,RGBAFormat);t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(2,2);t.needsUpdate=true;return t},[kind]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);useEffect(()=>()=>bump?.dispose(),[bump]);if(!vertices.length)return null;
 return <mesh geometry={geometry}><meshPhysicalMaterial color={kind==='metal'?'#a0aebc':kind==='water'?'#81c7da':'#7b3b1e'} metalness={kind==='metal'?.7:0} roughness={kind==='metal'?.38:kind==='water'?.15:.94} transparent={kind==='water'} opacity={kind==='water'?.24:1} side={DoubleSide} map={bump??undefined} bumpMap={bump??undefined} bumpScale={.001} depthWrite={kind!=='water'} clippingPlanes={cutaway?cutPlanes:null}/></mesh>;
}
function Cell({q,condition,x,isolated,cutaway}:{q:RustInputs;condition:RustCondition;x:number;isolated:boolean;cutaway:boolean}){
 const s=rustGeometry(q,condition);
 const phases=useMemo(()=>({core:rustCoreTriangles(q,condition),attached:rustAttachedTriangles(q,condition),water:rustWaterTriangles(q,condition),sediment:rustSedimentTriangles(q,condition)}),[q.ironG,q.waterMl,q.chamberMl,q.oxygenFraction,q.reducedOxygenFraction,q.ratePerDay,q.attachedFraction,q.timeDays,condition]);
 const progress=s.initialOxygenMol>0?s.oxygenUsedMol/s.initialOxygenMol:0;
 return <group position={[x,0,0]}>
  <Phase vertices={phases.core} kind='metal'/><Phase vertices={phases.attached} kind='product' cutaway={cutaway}/>
  {!isolated&&<>
   <Phase vertices={phases.water} kind='water'/><Phase vertices={phases.sediment} kind='sediment'/>
   <mesh position={[0,a.bottomY+s.chamberHeightCm/2,0]}><cylinderGeometry args={[1.2,1.2,s.chamberHeightCm,128,1,true]}/><meshPhysicalMaterial color='#bce1ee' transparent opacity={.08} side={DoubleSide} depthWrite={false} roughness={.12}/></mesh>
   <mesh position={[0,a.bottomY+s.chamberHeightCm+.075,0]}><cylinderGeometry args={[1.28,1.28,.15,128]}/><meshStandardMaterial color='#677e98' metalness={.35}/></mesh><mesh position={[0,.35,0]}><cylinderGeometry args={[1.28,1.28,.2,128]}/><meshStandardMaterial color='#526b88' metalness={.3}/></mesh>
   {s.wet&&<><BenchLine a={[.35,s.waterBottomY+s.waterDepthCm/2,.15]} b={[.35,2,.15]} radius={.016} color='#aec6ad'/><BenchLine a={[.35,2,.15]} b={[s.outerRadiusCm,2,0]} radius={.016} color='#aec6ad'/></>}
   {s.rateIronMolDay>0&&<>{[0,.25,.5,.75].map(offset=>{const t=(progress*8+offset)%1;return <mesh key={offset} position={[.8-.65*t,3.6-1.6*t,.4*Math.sin(Math.PI*t)]}><sphereGeometry args={[.035,16,12]}/><meshStandardMaterial color='#78d7df' emissive='#397c8d' emissiveIntensity={.4}/></mesh>})}<BenchLine a={[.8,3.6,0]} b={[.15,2,0]} radius={.007} color='#5595a6'/></>}
   <BenchTag text={`${s.wet?'WATER':'DRY'} · ${s.reduced?'REDUCED O₂':'O₂'}`} position={[0,-.15,0]} width={3.2}/>
  </>}
 </group>;
}
type Camera='coupon'|'cell'|'comparison';
export default function RustConditionsScene({q,condition,portrait}:{q:RustInputs;condition:RustCondition;portrait:boolean}){
 const [camera,setCamera]=useState<Camera>('coupon'),[cutaway,setCutaway]=useState(true),[reset,setReset]=useState(0),s=rustGeometry(q,condition);
 const plan=useMemo(()=>({target:(camera==='coupon'?[0,2,0]:[0,.5+q.chamberMl/a.chamberAreaCm2/2,0]) as BenchVector,offset:(camera==='coupon'?[.08,8,1]:camera==='cell'?[3,4,35]:[7,8,45]) as BenchVector}),[camera,q.chamberMl]);
 const points=useMemo(()=>{const initialR=Math.sqrt((q.ironG/rustReference.ironDrawingDensityGml)/a.unitArea),growth=Math.max(1,Math.cbrt(rustReference.ironDrawingDensityGml*rustReference.productMolarG*q.attachedFraction/(rustReference.ironMolarG*rustReference.productDrawingDensityGml))),r=initialR*growth*1.15;const xs=camera==='coupon'?[-r,r]:camera==='cell'?[-2,2]:[-7.2,7.2],ys=camera==='coupon'?[2-growth*.55,2+growth*.55]:[-.7,1+q.chamberMl/a.chamberAreaCm2],zs=camera==='coupon'?[-r,r]:[-1.6,1.6];return xs.flatMap(x=>ys.flatMap(y=>zs.map(z=>[x,y,z] as BenchVector)))},[camera,q.chamberMl,q.ironG,q.attachedFraction]);
 return <div className={`rust-scene ${portrait?'vertical':''}`} data-rust-3d-time={q.timeDays} data-rust-3d-condition={condition} data-rust-product-g={s.productG} data-rust-pressure={s.pressureKPa}>
 <div className='rust-tools'><label>Inspect <select aria-label='Rust 3D camera' value={camera} onChange={e=>setCamera(e.target.value as Camera)}><option value='coupon'>Magnified coupon and attached product</option><option value='cell'>Selected sealed reference cell</option><option value='comparison'>Four sealed reference cells</option></select></label>{camera==='coupon'&&<button disabled={s.attachedProductG===0} aria-pressed={cutaway} onClick={()=>setCutaway(v=>!v)}>{s.attachedProductG===0?'No attached layer to cut':cutaway?'Half-shell cutaway on':'Show half-shell cutaway'}</button>}<button onClick={()=>setReset(v=>v+1)}>Reset rust camera</button></div>
 <Canvas orthographic camera={{position:[0,15,40],near:.1,far:500}} frameloop='demand' dpr={[1,1.5]} onCreated={({gl})=>{gl.localClippingEnabled=true}}><color attach='background' args={['#102235']}/><ambientLight intensity={1.1}/><directionalLight position={[-5,15,8]} intensity={2}/><BenchStudio plan={plan} points={points} reset={reset}/>{camera==='comparison'?rustConditions.map((c,i)=><Cell key={c} q={q} condition={c} x={-5.4+i*3.6} isolated={false} cutaway={false}/>):<Cell q={q} condition={condition} x={0} isolated={camera==='coupon'} cutaway={camera==='coupon'&&cutaway}/>}</Canvas>
 <div className='rust-readouts' role='region' aria-label='Rust live readings' tabIndex={0}><strong>{rustConditionNames[condition]} · day {q.timeDays.toFixed(3)}</strong><span>Metal {(s.ironLeftG*1000).toFixed(4)} mg · attached {(s.attachedProductG*1000).toFixed(4)} mg · sediment {(s.sedimentProductG*1000).toFixed(4)} mg</span><span>Coupon {s.couponG.toFixed(6)} g · whole cell {s.totalG.toFixed(6)} g · dry-gas reference {s.pressureKPa.toFixed(3)} kPa</span><span>{camera==='coupon'?'Isolated coupon; cutaway hides part of the shell for inspection without removing modeled material.':'Cyan markers show normalised oxygen-consumption progress, not molecule counts or measured transport.'}</span></div>
 <details className='rust-notes' tabIndex={0} aria-label='Rust model limitations'><summary>What this rust reference models</summary><p>Chosen FeOOH-equivalent chemistry, first-order capacity law and attached/sediment partition; real rust is a mixture. Uniform shells and beds are volume references, not protective-layer or floc morphology predictions. Procedural surface roughness is illustrative, not measured grain geometry. Wet-cell water is accessible through a zero-volume schematic wick; wetting and transport are not solved. Fixed 25 °C ideal O₂/N₂ gas; no vapour, dissolved-oxygen storage, heat, pH, anaerobic pathway or settling solver. The half-shell cutaway is a diagnostic view. Drawing densities are 8/4.2/1 g/mL.</p></details></div>;
}

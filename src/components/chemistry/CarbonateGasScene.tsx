import './carbonateGas.css';
import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,DoubleSide,CanvasTexture,SRGBColorSpace} from 'three';
import {BenchStudio,BenchTag,BenchLine} from './ScienceBenchPrimitives';
import {carbonateGasGeometry,carbonateChipTriangles,carbonateLiquidTriangles,
  carbonateApparatus as a,type CarbonateVector} from '../../lib/chemistry/carbonateGasGeometry';
import type {CarbonateGasInputs} from '../../lib/chemistry/carbonateGas';

function ScaleLabel({value,x}:{value:number;x:number}) {
  const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=160;
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#10273e';ctx.fillRect(0,0,256,160);
    ctx.fillStyle='#e7f2fa';ctx.font='88px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(value),128,80);
    const t=new CanvasTexture(canvas);t.colorSpace=SRGBColorSpace;return t},[value]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <sprite position={[x,14.2,1.2]} scale={[1.55,.95,1]}><spriteMaterial map={texture} depthTest={false}/></sprite>;
}

function Surface({vertices,solid}:{vertices:number[];solid:boolean}) {
  const geometry=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(vertices),3));g.computeVertexNormals();return g},[vertices]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><meshPhysicalMaterial color={solid?'#eee6d6':'#82bfd8'} transparent={!solid} opacity={solid?1:.2} roughness={solid?.65:.14} side={DoubleSide} depthWrite={solid}/></mesh>;
}
function Flask({q,detail}:{q:CarbonateGasInputs;detail:boolean}) {
  const s=carbonateGasGeometry(q),baseTop=a.bottomY+a.baseHeight,neckBase=baseTop+a.shoulderHeight,top=neckBase+a.neckHeight;
  const solid=useMemo(()=>carbonateChipTriangles(q),[q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS]);
  const liquid=useMemo(()=>carbonateLiquidTriangles(q),[q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS]);
  const glass=<meshPhysicalMaterial color='#bdd8e8' transparent opacity={.08} side={DoubleSide} roughness={.1} depthWrite={false}/>;
  return <group position={[-9,0,0]}>
    {!detail&&<>
      <mesh position={[0,a.bottomY+a.baseHeight/2,0]}><cylinderGeometry args={[a.baseRadius,a.baseRadius,a.baseHeight,128,1,true]}/>{glass}</mesh>
      <mesh position={[0,baseTop+a.shoulderHeight/2,0]}><cylinderGeometry args={[a.neckRadius,a.baseRadius,a.shoulderHeight,128,1,true]}/>{glass}</mesh>
      <mesh position={[0,neckBase+a.neckHeight/2,0]}><cylinderGeometry args={[a.neckRadius,a.neckRadius,a.neckHeight,128,1,true]}/>{glass}</mesh>
      <mesh position={[0,top,0]}><cylinderGeometry args={[1,1,.4,32]}/><meshStandardMaterial color='#63788a' roughness={.7}/></mesh>
      <mesh position={[0,.8,0]}><cylinderGeometry args={[3.8,3.8,.35,128]}/><meshStandardMaterial color='#62778e' metalness={.3}/></mesh>
      <BenchTag text='150 mL FLASK · VIRTUAL PREPARATION' position={[0,-.6,0]} width={11}/>
      <BenchTag text={`CARBONATE ${s.carbonateLeftG.toFixed(5)} g`} position={[0,top+2,0]} width={10}/>
    </>}
    <Surface vertices={liquid} solid={false}/>{solid.length>0&&<Surface vertices={solid} solid/>}
  </group>;
}
function Syringe({q}:{q:CarbonateGasInputs}) {
  const s=carbonateGasGeometry(q),r=a.syringeRadiusCm;
  return <group>
    <mesh position={[10,11,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[r,r,20,128,1,true]}/><meshPhysicalMaterial color='#cce3ee' transparent opacity={.1} side={DoubleSide} roughness={.12} depthWrite={false}/></mesh>
    {s.pistonTravelCm>0&&<mesh position={[s.pistonTravelCm/2,11,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[r,r,s.pistonTravelCm,128]}/><meshBasicMaterial color='#9bafc8' transparent opacity={.12} depthWrite={false}/></mesh>}
    <mesh position={[s.pistonTravelCm+.065,11,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[r-.015,r-.015,.13,128]}/><meshStandardMaterial color='#a997d0' roughness={.4}/></mesh>
    <BenchLine a={[s.pistonTravelCm+.13,11,0]} b={[s.pistonTravelCm+20.5,11,0]} radius={.13} color='#9dadbf'/>
    <BenchLine a={[s.pistonTravelCm+20.5,9.9,0]} b={[s.pistonTravelCm+20.5,12.1,0]} radius={.2} color='#9dadbf'/>
    {Array.from({length:11},(_,i)=><group key={i}><BenchLine a={[i*2,12.7,.5]} b={[i*2,13.1,.5]} radius={.025}/><ScaleLabel value={i*20} x={i*2}/></group>)}
    <BenchTag text={`PISTON ${s.syringeMl.toFixed(4)} mL · mL SCALE`} position={[10,17.5,0]} width={21}/>
    <BenchTag text={`AIR / CO₂ MIXTURE · ${(100*s.co2MoleFraction).toFixed(3)}% CO₂`} position={[10,7.8,0]} width={20}/>
    {[7,18].map(x=><group key={x}><BenchLine a={[x,.5,2.5]} b={[x,11,2.5]} radius={.16}/><BenchLine a={[x,11,2.5]} b={[x,11,1.9]} radius={.13}/><mesh position={[x,11,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[r+.15,.06,8,64]}/><meshStandardMaterial color='#728ba2' metalness={.5}/></mesh></group>)}
  </group>;
}
type Camera='apparatus'|'flask'|'syringe'|'chips';
export default function CarbonateGasScene({q,portrait}:{q:CarbonateGasInputs;portrait:boolean}) {
  const [camera,setCamera]=useState<Camera>('apparatus'),[reset,setReset]=useState(0),s=carbonateGasGeometry(q);
  const plan=useMemo(()=>({target:(camera==='flask'||camera==='chips'?[-9,camera==='chips'?1.5:5,0]:camera==='syringe'?[15,11,0]:[10,7,0]) as CarbonateVector,offset:(camera==='chips'?[2,4,7]:[8,15,40]) as CarbonateVector}),[camera]);
  const points=useMemo(()=>{const xs=camera==='flask'?[-15,-3]:camera==='chips'?[-11,-7]:camera==='syringe'?[-2,36]:[-16,36];const ys=camera==='chips'?[.5,2.6]:camera==='syringe'?[7,19.5]:[-2,19.5];const out:CarbonateVector[]=[];for(const x of xs)for(const y of ys)for(const z of camera==='chips'?[-2,2]:[-5,5])out.push([x,y,z]);return out},[camera]);
  const tube:CarbonateVector[]=[[-9,a.bottomY+a.baseHeight+a.shoulderHeight+a.neckHeight,0],[-9,11,0],[0,11,0]];
  return <div className={`carbonate-scene ${portrait?'vertical':''}`}>
    <div className='carbonate-tools'><label>Inspect<select aria-label='Carbonate gas 3D camera' value={camera} onChange={e=>setCamera(e.target.value as Camera)}><option value='apparatus'>Complete gas collection apparatus</option><option value='flask'>Reaction flask</option><option value='syringe'>Syringe scale and piston</option><option value='chips'>Submerged carbonate cutaway</option></select></label><button onClick={()=>setReset(v=>v+1)}>Reset carbonate camera</button></div>
    <Canvas orthographic camera={{position:[0,20,50],near:.1,far:500}} frameloop='demand' dpr={[1,1.5]}>
      <color attach='background' args={['#102235']}/><ambientLight intensity={1.1}/><directionalLight position={[0,25,15]} intensity={2}/><BenchStudio plan={plan} points={points} reset={reset}/>
      {camera!=='syringe'&&<Flask q={q} detail={camera==='chips'}/>}{(camera==='apparatus'||camera==='syringe')&&<Syringe q={q}/>}
      {camera==='apparatus'&&<>
        <mesh position={[8,.1,0]}><boxGeometry args={[51,.5,10]}/><meshStandardMaterial color='#2b4059' roughness={.55}/></mesh>
        {tube.slice(1).map((p,i)=><BenchLine key={i} a={tube[i]} b={p} radius={.18} color='#9ab4c8'/>)}
        {s.syringeRateMlS>1e-9&&Array.from({length:8},(_,i)=>{const u=(q.timeS*.035+i/8)%1;return <mesh key={i} position={[-9+u*9,11,.21]}><sphereGeometry args={[.08,10,8]}/><meshBasicMaterial color='#c6a9ed'/></mesh>})}
      </>}
    </Canvas>
    <div className='carbonate-readouts' role='region' aria-label='Carbonate gas live readouts' tabIndex={0} data-carbonate-inputs={JSON.stringify(q)} data-carbonate-state={JSON.stringify(s)} data-carbonate-camera={camera}>
      <strong>Elapsed {q.timeS.toFixed(2)} s · limiting reagent: {s.limitingReagent}</strong><span>Piston {s.syringeMl.toFixed(5)} mL · CO₂ equivalent {s.gasEquivalentMl.toFixed(5)} mL · freed solid volume {s.liberatedSolidVolumeMl.toFixed(5)} mL</span><span>Carbonate {s.carbonateLeftG.toFixed(5)} g · CO₂ {s.co2G.toFixed(5)} g · conserved reacting contents {s.contentsG.toFixed(5)} g</span>
    </div>
    <details className='carbonate-notes' tabIndex={0} aria-label='Carbonate gas model notes'><summary>Explanation & model notes</summary><p>Original virtual flask, tube and freely moving syringe. Dry, isothermal ideal gas at constant pressure; no dissolved CO₂, water vapour, leakage, piston friction or heat balance. Initial trapped air remains: the syringe contains a mixture, not pure CO₂. Shrinking carbonate frees flask space, reducing syringe travel relative to the generated gas-equivalent volume. Solution drawing volume is held constant; carbonate density2.71g/mL and 16 equal-weight cubic forms are geometric references, not actual marble morphology. The cutaway hides the glass for inspection without opening the model. Liquid mesh excludes solid interiors. Moving markers indicate gas transfer, not literal molecular speeds. Routed tube is schematic with a declared5mL dead-volume reference. Chosen reaction relaxation is not measured kinetics.</p></details>
  </div>;
}

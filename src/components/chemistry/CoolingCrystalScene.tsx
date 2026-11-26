import {useEffect,useMemo,useState} from 'react';
import {Canvas} from '@react-three/fiber';
import {BufferAttribute,BufferGeometry,DoubleSide} from 'three';
import {BenchStudio,BenchTag,BenchCylinder,BenchLine} from './ScienceBenchPrimitives';
import {coolingCrystalGeometry,coolingSolidTriangles,coolingLiquidTriangles,coolingCentres,
  coolingVessel as a,type CoolingVector} from '../../lib/chemistry/coolingCrystalGeometry';
import type {CoolingCrystalInputs} from '../../lib/chemistry/coolingCrystalGrowth';

function Surface({vertices,solid}:{vertices:number[];solid:boolean}) {
  const geometry=useMemo(()=>{const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(vertices),3));g.computeVertexNormals();return g},[vertices]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><meshPhysicalMaterial color={solid?'#e2e9ef':'#80c5df'}
    transparent opacity={solid?.9:.12} roughness={.18} metalness={solid?.04:0}
    depthWrite={solid} side={DoubleSide}/></mesh>;
}
function Cell({q,program,x}:{q:CoolingCrystalInputs;program:'fast'|'slow';x:number}) {
  const g=coolingCrystalGeometry(q,program);
  const solid=useMemo(()=>coolingSolidTriangles(g.crystalG),[g.crystalG]);
  const liquid=useMemo(()=>coolingLiquidTriangles(q,program),[q,program]);
  const color=program==='fast'?'#baa5f0':'#85dfc2';
  return <group position={[x,0,0]}>
    <mesh position={[0,.1,0]}><cylinderGeometry args={[5.4,5.6,1.2,64]}/><meshStandardMaterial color='#526782' metalness={.4} roughness={.28}/></mesh>
    <mesh position={[0,a.bottomCm+a.heightCm/2,0]}><cylinderGeometry args={[a.radiusCm+.05,a.radiusCm+.05,a.heightCm,128,1,true]}/><meshPhysicalMaterial color='#c3dfed' transparent opacity={.08} roughness={.1} side={DoubleSide} depthWrite={false}/></mesh>
    {[a.bottomCm,a.bottomCm+a.heightCm].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[a.radiusCm+.05,.035,8,96]}/><meshStandardMaterial color='#adc9da' metalness={.25}/></mesh>)}
    <BenchCylinder x={0} y={6.05} r={4.85} h={.14} color='#c4dbe8' opacity={.22}/>
    <BenchCylinder x={0} y={6.19} r={.5} h={.45} color='#728ba4'/>
    <Surface vertices={liquid} solid={false}/>{solid.length>0&&<Surface vertices={solid} solid/>}
    {g.totalCrystalRateGS>1e-9&&coolingCentres.filter((_,i)=>i%3===0).map((p,i)=>{
      const u=(q.timeS*.025+i/7)%1;
      return <mesh key={i} position={[p[0],g.solidTopY+.04+(1-u)*Math.max(.06,g.liquidSurfaceY-g.solidTopY-.08),p[2]]} rotation={[0,0,Math.PI]}><coneGeometry args={[.045,.16,8]}/><meshBasicMaterial color={color}/></mesh>;
    })}
    <BenchTag text={`${program.toUpperCase()} · ${g.coolingDurationS.toFixed(0)} s COOLING`} position={[0,9.6,0]} width={13}/>
    <BenchTag text={`${g.temperatureC.toFixed(2)} °C · SOLID ${g.crystalG.toFixed(3)} g`} position={[0,7.3,0]} width={12}/>
    <BenchTag text={`EFFECTIVE SITES ${g.sites.toFixed(3)} · NOT DRAWING COUNT`} position={[0,-1.5,4]} width={13}/>
  </group>;
}
function SizeComparison({q}:{q:CoolingCrystalInputs}) {
  return <group>{(['fast','slow'] as const).map((program,i)=>{
    const g=coolingCrystalGeometry(q,program),x=i?3.5:-3.5,color=i?'#85dfc2':'#baa5f0';
    return <group key={program} position={[x,0,0]}>
      {g.sites>0&&<mesh position={[0,3.2,0]}><sphereGeometry args={[g.meanEquivalentRadiusCm,48,32]}/><meshPhysicalMaterial color={color} metalness={.1} roughness={.2}/></mesh>}
      <BenchTag text={program.toUpperCase()} position={[0,6.6,0]} width={4.5}/>
      <BenchTag text={g.sites>0?`r = ${g.meanEquivalentRadiusCm.toFixed(4)} cm`:'NO EFFECTIVE SITES'} position={[0,5.9,0]} width={5.8}/>
      <BenchLine a={[-.5,.1,0]} b={[.5,.1,0]} radius={.025} color={color}/>
      {[-.5,.5].map(v=><BenchLine key={v} a={[v,-.02,0]} b={[v,.22,0]} radius={.015} color={color}/>)}
      <BenchTag text='1 cm · SAME SCALE' position={[0,-.5,0]} width={4.8}/>
    </group>;
  })}</group>;
}
type Camera='comparison'|'fast'|'slow'|'size';
export default function CoolingCrystalScene({q,portrait}:{q:CoolingCrystalInputs;portrait:boolean}) {
  const [camera,setCamera]=useState<Camera>('comparison'),[reset,setReset]=useState(0);
  const plan=useMemo(()=>({target:[camera==='fast'?-7:camera==='slow'?7:0,camera==='size'?3:3,0] as CoolingVector,
    offset:(camera==='size'?[1,2,20]:[10,13,30]) as CoolingVector}),[camera]);
  const points=useMemo(()=>{
    const xs=camera==='size'?[-7.5,7.5]:camera==='fast'?[-15,0]:camera==='slow'?[0,15]:[-15,15];
    const out:CoolingVector[]=[];
    for(const x of xs)for(const y of camera==='size'?[-1,7.2]:[-2,11])for(const z of camera==='size'?[-2,2]:[-6,7])out.push([x,y,z]);
    return out;
  },[camera]);
  const states=(['fast','slow'] as const).map(p=>coolingCrystalGeometry(q,p));
  return <div className={`cooling-scene ${portrait?'vertical':''}`}>
    <div className='cooling-tools'><label>Inspect<select aria-label='Cooling crystals 3D camera' value={camera} onChange={e=>setCamera(e.target.value as Camera)}>
      <option value='comparison'>Two cooling vessels</option><option value='fast'>Fast vessel detail</option><option value='slow'>Slow vessel detail</option><option value='size'>Mean equivalent size · same scale</option>
    </select></label><button onClick={()=>setReset(v=>v+1)}>Reset cooling camera</button></div>
    <Canvas orthographic camera={{position:[0,12,40],near:.1,far:500}} frameloop='demand' dpr={[1,1.5]}>
      <color attach='background' args={['#102235']}/><ambientLight intensity={1.1}/><directionalLight position={[7,20,14]} intensity={2}/>
      <BenchStudio plan={plan} points={points} reset={reset}/>
      {camera==='size'?<SizeComparison q={q}/>:<>{camera!=='slow'&&<Cell q={q} program='fast' x={-7}/>} {camera!=='fast'&&<Cell q={q} program='slow' x={7}/>}</>}
    </Canvas>
    <div className='cooling-readouts' role='region' aria-label='Cooling crystals live readouts' tabIndex={0} data-cooling-inputs={JSON.stringify(q)} data-cooling-camera={camera}>
      <strong>Elapsed {q.timeS.toFixed(2)} s · equal initial water and salt</strong>
      {states.map((s,i)=><span key={i} data-cooling-state={JSON.stringify(s)}>{i?'Slow':'Fast'} · {s.temperatureC.toFixed(2)} °C · solid {s.crystalG.toFixed(4)} g · sites {s.sites.toFixed(4)} · mean equivalent radius {s.meanEquivalentRadiusCm.toFixed(4)} cm</span>)}
    </div>
    <details className='cooling-notes' tabIndex={0} aria-label='Cooling crystals model notes'><summary>Explanation & model notes</summary><p>Cooling is prescribed, not a heat-balance calculation. During cooling, equal elapsed time does not mean equal temperature. Twenty-one weighted capped rhombic apparatus forms represent the total solid volume, not the effective site count or a measured size distribution. Liquid geometry excludes their interiors. The size view compares mean equivalent spheres on the same centimetre scale; these spheres describe volume, not actual crystal habit. Moving cones show net material-transfer direction, not literal ions. Fractional effective sites, nucleus mass and growth laws are chosen teaching references, not calibrated material kinetics. Water and salt are conserved in the covered model.</p></details>
  </div>;
}

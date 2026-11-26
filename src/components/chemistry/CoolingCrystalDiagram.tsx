import {useMemo,useState} from 'react';
import {coolingCrystalGeometry,coolingHistory,coolingVessel as a} from '../../lib/chemistry/coolingCrystalGeometry';
import type {CoolingCrystalInputs} from '../../lib/chemistry/coolingCrystalGrowth';
type Metric='temperature'|'solid'|'sites'|'meanRadius'|'supersaturation';
const quantities:Record<Metric,string>={temperature:'Temperature / °C',solid:'Solid salt / g',sites:'Effective sites',meanRadius:'Mean equivalent radius / cm',supersaturation:'Supersaturation'};
export default function CoolingCrystalDiagram({q,portrait}:{q:CoolingCrystalInputs;portrait:boolean}) {
  const [zoom,setZoom]=useState(1),[pane,setPane]=useState<'apparatus'|'history'>('apparatus');
  const [metric,setMetric]=useState<Metric>('temperature'),[windowS,setWindowS]=useState(1200);
  const states=(['fast','slow'] as const).map(program=>coolingCrystalGeometry(q,program));
  const curves=useMemo(()=>(['fast','slow'] as const).map(p=>coolingHistory({...q,timeS:Math.min(q.timeS,windowS)},p)),[q.waterG,q.saltG,q.fastCoolingS,q.slowMultiplier,q.growthFluxGcm2s,q.nucleationPerS,q.threshold,q.timeS,windowS]);
  const W=portrait?600:1100,H=portrait?1067:820,cardW=portrait?550:510,cardH=portrait?414:550;
  const k=portrait?21:28,mid=cardW/2,bottom=portrait?228:300;
  const ymax=metric==='temperature'?85:Math.max(.01,...curves.flatMap(c=>c.map(p=>p[metric])))*1.1;
  const chartX=(t:number)=>75+(W-125)*t/windowS,chartY=(v:number)=>H-220-(H-420)*v/ymax;
  const form=(x:number,width:number,height:number)=>`M${x} ${bottom}L${x+width} ${bottom-.2*height}V${bottom-.8*height}L${x} ${bottom-height}L${x-width} ${bottom-.8*height}V${bottom-.2*height}Z`;
  return <div className='cooling-diagram'><div className='cooling-tools'>
    <div role='group' aria-label='Cooling crystals diagram panel'><button aria-pressed={pane==='apparatus'} onClick={()=>{setPane('apparatus');setZoom(1)}}>Cooling vessels & size</button><button aria-pressed={pane==='history'} onClick={()=>{setPane('history');setZoom(1)}}>Elapsed evidence</button></div>
    {pane==='history'&&<><label>Plot<select aria-label='Cooling crystals history quantity' value={metric} onChange={e=>setMetric(e.target.value as Metric)}>{Object.entries(quantities).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Window<select aria-label='Cooling crystals history window' value={windowS} onChange={e=>setWindowS(+e.target.value)}><option value='1200'>First 1200 s</option><option value='2400'>0–2400 s</option></select></label></>}
    <div role='group' aria-label='Cooling crystals diagram zoom'><button aria-label='Zoom out cooling diagram' disabled={zoom===1} onClick={()=>setZoom(v=>Math.max(1,v-.5))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label='Zoom in cooling diagram' disabled={zoom===3} onClick={()=>setZoom(v=>Math.min(3,v+.5))}>+</button><button onClick={()=>setZoom(1)}>Reset cooling diagram</button></div>
  </div><div className='cooling-pan' role='region' aria-label='Cooling crystals diagram pan area' tabIndex={0}>
    <svg role='img' aria-label={`Fast and slow cooling at ${q.timeS.toFixed(2)} elapsed seconds. Compare temperatures, solid mass and equivalent size.`} data-cooling-inputs={JSON.stringify(q)} data-cooling-pane={pane} data-cooling-metric={metric} data-cooling-window={windowS} viewBox={`0 0 ${W} ${H}`} style={{width:`${zoom*100}%`,minWidth:`${zoom*100}%`,height:`${zoom*100}%`,minHeight:`${zoom*100}%`}}>
      <defs><linearGradient id='coolingBackground' x2='1' y2='1'><stop stopColor='#102235'/><stop offset='1' stopColor='#203e54'/></linearGradient><pattern id='coolingGrid' width='30' height='30' patternUnits='userSpaceOnUse'><path d='M30 0H0V30' fill='none' stroke='#80a7c3' strokeOpacity='.08'/></pattern>
        {states.map((s,i)=><mask key={i} id={`coolingLiquid${i}`} maskUnits='userSpaceOnUse' x='0' y='0' width={cardW} height={cardH}><rect width={cardW} height={cardH} fill='white'/>{[-2,-1,0,1,2].map(j=><path key={j} d={form(mid+j*a.spacingCm*k,s.rotatedHalfWidthCm*k,s.heightCm*k)} fill='black'/>)}</mask>)}
      </defs><rect width={W} height={H} fill='url(#coolingBackground)'/><rect width={W} height={H} fill='url(#coolingGrid)'/>
      <g fontFamily='system-ui,sans-serif'><text x='25' y='34' fontSize='13' letterSpacing='2' fill='#9dbdd4'>SCIENCE ATLAS / COOLING & CRYSTALS</text>
        <text x='25' y='75' fontSize={portrait?25:32} fontWeight='700' fill='#f0f7fb'>{pane==='apparatus'?'Two paths from the same beginning.':'Follow the evidence as it develops.'}</text>
        <text x='25' y='108' fontSize='14' fill='#bad2e4'>Elapsed {q.timeS.toFixed(2)} s · equal initial water and salt</text>
        {pane==='apparatus'?states.map((s,i)=>{
          const left=portrait?25:25+i*540,top=portrait?135+i*435:145,color=i?'#85dfc2':'#baa5f0';
          const sizeY=portrait?330:422,sizeScale=(portrait?27:36)/Math.max(1,...states.map(s=>s.meanEquivalentRadiusCm));
          return <g key={i} transform={`translate(${left},${top})`} data-cooling-cell={i} data-cooling-state={JSON.stringify(s)} data-cooling-scale={k} data-cooling-bottom={bottom} data-cooling-mid={mid}>
            <rect width={cardW} height={cardH} rx='18' fill='#142e41' stroke='#426077'/>
            <text x='18' y='28' fontSize='19' fill={color}>{i?'Slow':'Fast'} · {s.coolingDurationS.toFixed(0)} s cooling</text>
            <text x='18' y='53' fontSize='13' fill='#bfd6e5'>{s.temperatureC.toFixed(2)} °C · capacity {s.capacityG.toFixed(3)} g</text>
            <text x='18' y='76' fontSize='12' fill='#a7c5d9'>{s.coolingFinished?'20°C hold':'Prescribed linear cooling'} · water retained {q.waterG.toFixed(1)} g</text>
            <path d={`M${mid-a.radiusCm*k} ${bottom-a.heightCm*k}V${bottom}H${mid+a.radiusCm*k}V${bottom-a.heightCm*k}`} fill='#a5c8da' fillOpacity='.025' stroke='#bad5e5' strokeWidth='2'/>
            <rect data-cooling-liquid='' x={mid-a.radiusCm*k} y={bottom-s.liquidDepthCm*k} width={2*a.radiusCm*k} height={s.liquidDepthCm*k} fill='#73bdd8' fillOpacity='.26' mask={`url(#coolingLiquid${i})`}/>
            <rect x={mid-(a.radiusCm+.1)*k} y={bottom-(a.heightCm+.15)*k} width={2*(a.radiusCm+.1)*k} height={.15*k} rx='2' fill='#8ba8bb'/>
            {s.crystalG>0&&[-2,-1,0,1,2].map(j=><g key={j}><path data-cooling-crystal='' data-form-mass-g={s.perMassG} d={form(mid+j*a.spacingCm*k,s.rotatedHalfWidthCm*k,s.heightCm*k)} fill='#dbe8ed' stroke='#eef7fa' strokeWidth='.8'/><path d={`M${mid+j*a.spacingCm*k} ${bottom}V${bottom-s.heightCm*k}`} stroke='#92aec2' strokeWidth='.7'/></g>)}
            {s.totalCrystalRateGS>1e-9&&[-2,-1,0,1,2].map((j,index)=>{
              const u=(q.timeS*.025+index/5)%1,y=bottom-(s.heightCm+.04+(1-u)*Math.max(.06,s.liquidDepthCm-s.heightCm-.08))*k;
              return <path key={j} data-cooling-transfer='' data-rate-weight-gs={s.totalCrystalRateGS/5} d={`M${mid+j*a.spacingCm*k-3} ${y}l3 5 3 -5`} fill='none' stroke={color} strokeWidth='1.8'/>;
            })}
            <text x={mid} y={bottom+20} textAnchor='middle' fontSize='10' fill='#a7c5d9'>Central section: 5 of 21 weighted total-volume forms</text>
            <text x='18' y={portrait?276:348} fontSize='14' fill='#e0d7f5'>Dissolved {s.dissolvedG.toFixed(4)} g · solid {s.crystalG.toFixed(4)} g</text>
            <text x='18' y={portrait?300:376} fontSize='13' fill={color}>Effective sites {s.sites.toFixed(4)} · σ {s.supersaturation.toFixed(5)}</text>
            {s.sites>0&&<circle data-cooling-equivalent='' data-size-scale={sizeScale} cx='83' cy={sizeY+13} r={s.meanEquivalentRadiusCm*sizeScale} fill={color} fillOpacity='.8' stroke='#e7f2fa'/>}
            <path d={`M${83-sizeScale/2} ${sizeY+52}h${sizeScale}m0 -4v8m${-sizeScale} -8v8`} stroke={color} fill='none' strokeWidth='1.4'/>
            <text x='83' y={sizeY+70} textAnchor='middle' fontSize='10' fill='#c6dce9'>1 cm</text>
            <text x='145' y={sizeY+5} fontSize='12' fill='#d4e6f0'>Mean equivalent sphere · SAME SCALE</text>
            <text x='145' y={sizeY+28} fontSize='13' fill={color}>{s.sites>0?`Radius ${s.meanEquivalentRadiusCm.toFixed(5)} cm`:'No effective sites yet'}</text>
            <text x='145' y={sizeY+50} fontSize='11' fill='#a7c5d9'>Equivalent volume, not actual crystal habit</text>
            {!portrait&&<text x='18' y='529' fontSize='12' fill='#bfd6e5'>Salt {s.saltAccountedG.toFixed(4)} g · contents {s.wholeMassG.toFixed(3)} g</text>}
          </g>;
        }):<>
          <text x='75' y='170' fontSize='14' fill='#bdd5e4'>{quantities[metric]}</text>
          {[0,.25,.5,.75,1].map(f=><g key={f}><line x1='75' x2={W-50} y1={chartY(ymax*f)} y2={chartY(ymax*f)} stroke='#9dbbcf' strokeOpacity='.2'/><text x='64' y={chartY(ymax*f)+4} textAnchor='end' fontSize='12' fill='#bbd1e1'>{(ymax*f).toFixed(metric==='meanRadius'||metric==='supersaturation'?3:1)}</text></g>)}
          {[0,.25,.5,.75,1].map(f=><text key={f} x={chartX(f*windowS)} y={H-195} textAnchor='middle' fontSize='12' fill='#bfd6e6'>{(f*windowS).toFixed(0)}</text>)}
          {curves.map((curve,i)=><polyline key={i} data-cooling-series={i} data-history-times={JSON.stringify(curve.map(p=>p.timeS))} data-history-values={JSON.stringify(curve.map(p=>p[metric]))} points={curve.map(p=>`${chartX(p.timeS)},${chartY(p[metric])}`).join(' ')} fill='none' stroke={i?'#85dfc2':'#baa5f0'} strokeWidth='3'/>)}
          <text x={W/2} y={H-165} textAnchor='middle' fontSize='13' fill='#bed4e4'>Elapsed physical time / seconds · {q.timeS>windowS?'current time beyond window':'elapsed evidence only'}</text>
          {curves.map((c,i)=><text key={i} x={75+i*(portrait?240:360)} y={H-126} fontSize='13' fill={i?'#85dfc2':'#baa5f0'}>{i?'Slow':'Fast'} · plotted {c.at(-1)![metric].toFixed(5)}</text>)}
          {q.timeS===0&&<text x={W/2} y={H/2} textAnchor='middle' fontSize='14' fill='#dceaf3'>Run the investigation to trace elapsed evidence.</text>}
        </>}
        <text x={W/2} y={H-32} textAnchor='middle' fontSize={portrait?11:13} fill='#afcadc'>{pane==='apparatus'?'Equal elapsed time does not imply equal temperature.':'Chosen site and growth laws; coarse reference solubility.'}</text>
      </g>
    </svg>
  </div></div>;
}

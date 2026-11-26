import {useState} from 'react';
import {neutralizationGeometry,neutralizationApparatus as a} from '../../lib/chemistry/neutralizationGeometry';
import {neutralizationCurve,type NeutralizationInputs} from '../../lib/chemistry/neutralization';
export default function NeutralizationDiagram({q,portrait}:{q:NeutralizationInputs;portrait:boolean}){
 const [view,setView]=useState('apparatus'),[zoom,setZoom]=useState(100),s=neutralizationGeometry(q);
 const w=portrait?600:1000,h=portrait?900:650,scale=view==='delivery'?(portrait?65:60):(portrait?21:14),x=portrait?270:420,base=portrait?790:570;
 const Y=(v:number)=>base-v*scale,R=a.vesselRadiusCm*scale,r=a.barrelRadiusCm*scale;
 const points=view==='curve'?neutralizationCurve(q):[],left=portrait?70:90,top=110,pw=w-left-60,ph=h-top-100;
 const X=(v:number)=>left+v/Math.max(1,q.plannedBaseMl)*pw,PY=(p:number)=>top+(14-p)/14*ph;
 return <div className='neutralization-diagram'><div className='neutralization-tools'><label>Inspect <select aria-label='Neutralization diagram view' value={view} onChange={e=>{setView(e.target.value);setZoom(100)}}><option value='apparatus'>Complete titration apparatus</option><option value='delivery'>Falling aliquot and sample</option><option value='curve'>Elapsed titration curve</option></select></label><label>Zoom <input aria-label='Neutralization diagram zoom' type='range' min='100' max='300' step='25' value={zoom} onChange={e=>setZoom(+e.target.value)}/>{zoom}%</label><button onClick={()=>setZoom(100)}>Fit titration view</button></div>
 <div className='neutralization-pan' role='region' aria-label='Neutralization diagram pan area' tabIndex={0}><svg role='img' aria-label={view==='curve'?'Calculated pH against arrived base volume; only elapsed states are plotted':view==='delivery'?'Close-up of metered liquid falling into the acid sample':'Calibrated burette, stand, sample vessel and schematic pH probe'} viewBox={`0 0 ${w} ${h}`} style={{width:`${zoom}%`,minWidth:`${zoom}%`,height:`${zoom}%`,minHeight:`${zoom}%`}}>
 <defs><linearGradient id='neutralization-glass' x2='1' y2='0'><stop stopColor='#cbe9f5' stopOpacity='.26'/><stop offset='.5' stopColor='#d8eef7' stopOpacity='.03'/><stop offset='1' stopColor='#cbe9f5' stopOpacity='.25'/></linearGradient></defs><rect width='100%' height='100%' fill='#102235'/>
 <text x='24' y='30' fill='#d9ebf6' fontSize={portrait?20:17}>{view==='curve'?'ARRIVED ALIQUOTS · IDEAL pH · 25 °C':view==='delivery'?'DELIVERY CLOSE-UP · LIQUIDS ARE CLEAR':'METERED TITRATION · FIXED BURETTE TIP'}</text>
 {view==='curve'?<g data-neutralization-curve={points.length}>
  {[0,2,4,6,7,8,10,12,14].map(p=><g key={p}><line x1={left} x2={left+pw} y1={PY(p)} y2={PY(p)} stroke={p===7?'#759fa7':'#294258'} strokeDasharray={p===7?'6 5':undefined}/><text x={left-14} y={PY(p)+5} textAnchor='end' fill='#c7ddeb' fontSize={portrait?22:17}>{p}</text></g>)}
  {[0,.25,.5,.75,1].map(f=><g key={f}><line x1={left+f*pw} x2={left+f*pw} y1={top} y2={top+ph} stroke='#294258'/><text x={left+f*pw} y={top+ph+25} textAnchor='middle' fill='#c7ddeb' fontSize={portrait?22:17}>{(f*Math.max(1,q.plannedBaseMl)).toFixed(1)}</text></g>)}
  <text x={left} y={top-(portrait?10:22)} fill='#dcecf8' fontSize={portrait?22:19}>Ideal pH</text><text x={left+pw/2} y={h-38} textAnchor='middle' fill='#dcecf8' fontSize={portrait?22:18}>Arrived base volume / mL</text>
  {s.equivalentBaseMl!==null&&s.equivalentWithinPlan&&<g><line x1={X(s.equivalentBaseMl)} x2={X(s.equivalentBaseMl)} y1={top} y2={top+ph} stroke='#c6a5ef' strokeDasharray='8 6'/><text x={Math.max(left+90,Math.min(left+pw-90,X(s.equivalentBaseMl)))} y={top-(portrait?45:55)} textAnchor='middle' fill='#d6b9f4' fontSize={portrait?22:17}>Known target {s.equivalentBaseMl.toFixed(2)} mL</text></g>}
  <polyline data-neutralization-history='true' points={points.map(p=>`${X(p.deliveredMl)},${PY(p.pH)}`).join(' ')} fill='none' stroke='#72d7ca' strokeWidth='3'/><circle cx={X(s.deliveredMl)} cy={PY(s.pH)} r='6' fill='#e3fff8'/>
 </g>:<g data-neutralization-time={q.timeS} data-delivered-ml={s.deliveredMl} data-reservoir-ml={s.reservoirMl} data-vessel-ml={s.vesselMl} data-ph={s.pH} data-scale={scale} data-base-y={base}>
  {view==='apparatus'&&<><line x1={x+a.standX*scale} x2={x+a.standX*scale} y1={Y(0)} y2={Y(a.standHeight)} stroke='#7f96aa' strokeWidth={.14*scale}/><line x1={x+a.standX*scale} x2={x+r} y1={Y(23)} y2={Y(23)} stroke='#7f96aa' strokeWidth={.1*scale}/>
   <rect x={x-r} y={Y(a.barrelBottomY+a.barrelHeightCm)} width={2*r} height={a.barrelHeightCm*scale} fill='url(#neutralization-glass)' stroke='#c3dce9' strokeWidth='2'/>
   <rect data-neutralization-reservoir='true' x={x-r} y={Y(s.barrelSurfaceY)} width={2*r} height={s.reservoirDepthCm*scale} fill='#95d0df' opacity='.34'/><line x1={x-r} x2={x+r} y1={Y(s.barrelSurfaceY)} y2={Y(s.barrelSurfaceY)} stroke='#e8f7ff' strokeWidth='2'/>
   {s.scale.map(t=><g key={t.readingMl}><line x1={x-r} x2={x-r-9} y1={Y(t.y)} y2={Y(t.y)} stroke='#b8d3e4'/><text x={x-r-14} y={Y(t.y)+5} textAnchor='end' fill='#d4e8f4' fontSize={portrait?22:16}>{t.readingMl}</text></g>)}
   <text x={x} y={portrait?65:70} textAnchor='middle' fill='#c7dceb' fontSize={portrait?22:16}>{portrait?'50 mL burette':'50 mL burette · scale increases downward'}</text>
  </>}
  <path d={`M ${x-.8*scale} ${Y(a.barrelBottomY)} L ${x} ${Y(7)} L ${x+.8*scale} ${Y(a.barrelBottomY)}`} fill='#99aec4'/><line x1={x-.7*scale} x2={x+.7*scale} y1={Y(7.45)} y2={Y(7.45)} stroke='#b1a1d9' strokeWidth={.13*scale}/>
  <path d={`M ${x-R-2} ${Y(7)} V ${Y(1.5)} H ${x+R+2} V ${Y(7)}`} fill='url(#neutralization-glass)' stroke='#b5d3e6' strokeWidth='2'/>
  <rect data-neutralization-vessel='true' x={x-R} y={Y(s.vesselSurfaceY)} width={2*R} height={s.vesselDepthCm*scale} fill='#9dcbdc' opacity='.26'/><line x1={x-R} x2={x+R} y1={Y(s.vesselSurfaceY)} y2={Y(s.vesselSurfaceY)} stroke='#c2e7ed'/>
  <line x1={x+1.4*scale} x2={x+1.4*scale} y1={Y(8.2)} y2={Y(1.75)} stroke='#8ca5b8' strokeWidth={.11*scale}/><circle cx={x+1.4*scale} cy={Y(1.75)} r={.13*scale} fill='#d8edf4'/>
  {s.inFlight.map(d=><circle key={d.index} data-neutralization-drop={d.index} data-age={d.ageS} cx={x} cy={Y(d.centreY)} r={s.meshRadiusCm*scale} fill='#bceef8' stroke='#e2fbff'/>)}
  <rect x={x-R-16} y={Y(1.2)} width={2*R+32} height={.4*scale} rx='4' fill='#596c87'/>
  <text x={x} y={base+18} textAnchor='middle' fill='#dfedf8' fontSize={portrait?20:17}>{s.vesselMl.toFixed(3)} mL · {s.arrivedCount}/{q.aliquots} arrived</text>
  <text x={w/2} y={h-28} textAnchor='middle' fill='#bed8e8' fontSize={portrait?17:16}>{view==='delivery'?'Rest of burette outside this close-up':'Probe and valve volumes omitted · ideal drawing'}</text>
 </g>}
 </svg></div><div className='neutralization-readouts' role='region' aria-label='Neutralization live readings' tabIndex={0}><strong>Calculated pH {s.pH.toFixed(4)} · {s.category} · 25 °C</strong><span>Burette {s.buretteReadingMl.toFixed(3)} mL · released {s.releasedMl.toFixed(3)} mL · arrived {s.deliveredMl.toFixed(3)} mL</span><span>{s.inFlightMl.toFixed(3)} mL still falling · elapsed {q.timeS.toFixed(3)} s</span><span>{view==='curve'?'Lines connect arrived model states; dashed target is a calculation, not an observation.':'No indicator colour is simulated. pH readout is a calculated ideal reference, not a calibrated sensor.'}</span></div></div>;
}

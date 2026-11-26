import {useState} from 'react';
import {cabbageGeometry,cabbageApparatus as a} from '../../lib/chemistry/cabbageGeometry';
import type {CabbageInputs,CabbageSample} from '../../lib/chemistry/cabbageIndicator';
const samples:CabbageSample[]=['acid','neutral','base'];
export default function CabbageDiagram({q,portrait}:{q:CabbageInputs;portrait:boolean}){
 const [zoom,setZoom]=useState(100),[view,setView]=useState<CabbageSample|'all'>('all');
 const selected=portrait&&view==='all'?'acid':view,shown=selected==='all'?samples:[selected];
 return <div className='cabbage-diagram'><div className='cabbage-tools'><label>Inspect <select aria-label='Cabbage diagram reference' value={selected} onChange={e=>setView(e.target.value as CabbageSample|'all')}>{!portrait&&<option value='all'>All three references</option>}{samples.map(s=><option key={s} value={s}>{s} reference</option>)}</select></label><label>Diagram zoom <input aria-label='Cabbage diagram zoom' type='range' min='100' max='300' step='25' value={zoom} onChange={e=>setZoom(+e.target.value)}/>{zoom}%</label><button onClick={()=>setZoom(100)}>Fit apparatus</button></div>
 <div className='cabbage-pan' tabIndex={0} role='region' aria-label='Cabbage diagram pan area'><svg role='img' aria-label={selected==='all'?'Three matched indicator dispensers above known acid, neutral and base reference samples':`${selected} reference sample and matched indicator dispenser`} viewBox={portrait?'0 0 600 850':'0 0 1000 600'} style={{width:`${zoom}%`,minWidth:`${zoom}%`,height:`${zoom}%`,minHeight:`${zoom}%`}}>
 <defs><linearGradient id='cabbage-glass' x2='1' y2='0'><stop stopColor='#bce5ef' stopOpacity='.28'/><stop offset='.5' stopColor='#e5f8ff' stopOpacity='.03'/><stop offset='1' stopColor='#bce5ef' stopOpacity='.22'/></linearGradient></defs>
 <rect width='100%' height='100%' fill='#102235'/><text x='24' y='30' fill='#d8e8f5' fontSize='16'>MATCHED DOSE · KNOWN REFERENCE BUFFERS · 25 °C</text>
 {shown.map((sample,i)=>{const s=cabbageGeometry(q,sample),scale=portrait?35:23,x=portrait?300:selected==='all'?180+i*320:500,base=portrait?650:455;
 const y=(v:number)=>base-v*scale,r=a.vesselRadiusCm*scale;
 return <g key={sample} data-cabbage-sample={sample} data-time={q.timeS} data-vessel-ml={s.vesselMl} data-pigment-mg={s.vesselPigmentMg} data-surface-y={s.liquidSurfaceY} data-drop-ml={s.dropMl}>
 <path d={`M ${x-r-3} ${y(5)} V ${y(1)} Q ${x-r-3} ${y(.85)} ${x-r} ${y(.85)} H ${x+r} Q ${x+r+3} ${y(.85)} ${x+r+3} ${y(1)} V ${y(5)}`} fill='url(#cabbage-glass)' stroke='#b4d5e8' strokeWidth='2'/>
 <rect x={x-r} y={y(s.liquidSurfaceY)} width={2*r} height={s.liquidDepthCm*scale} fill='#acd9e5' opacity='.25'/>
 <rect x={x-r} y={y(s.liquidSurfaceY)} width={2*r} height={s.liquidDepthCm*scale} fill={s.colour.hex} opacity={s.opacity}/>
 <line x1={x-r} x2={x+r} y1={y(s.liquidSurfaceY)} y2={y(s.liquidSurfaceY)} stroke='#e6f2f9'/>
 <rect x={x-.55*scale} y={y(s.reservoirBottomY+1.8)} width={1.1*scale} height={1.8*scale} rx='3' fill='url(#cabbage-glass)' stroke='#aac7db'/>
 <rect x={x-.55*scale} y={y(s.reservoirBottomY+s.reservoirDepthCm)} width={1.1*scale} height={s.reservoirDepthCm*scale} fill={q.pigmentMgMl>0?'#955bb5':'#a8d4e0'} opacity='.8'/>
 <path d={`M ${x-.3*scale} ${y(s.reservoirBottomY)} L ${x} ${y(s.nozzleY)} L ${x+.3*scale} ${y(s.reservoirBottomY)}`} fill='#7c94ac'/>
 {s.dropCentres.map(d=><circle key={d.index} data-drop-index={d.index} data-bottom-clearance={s.inFlight.find(f=>f.index===d.index)?.heightAboveSurfaceCm} cx={x} cy={y(d.centreY)} r={s.meshRadiusCm*scale} fill={q.pigmentMgMl>0?'#b377cc':'#c9ecf7'} stroke='#f2e1ff'/>)}
 <text x={x} y={base+20} textAnchor='middle' fill='#e8f0fa' fontSize={portrait?22:19}>{sample.toUpperCase()} · pH {s.referencePH}</text>
 <text x={x} y={base+46} textAnchor='middle' fill='#c4d9e8' fontSize={portrait?22:16}>{s.arrivedCount}/{q.drops} drops · {s.vesselMl.toFixed(2)} mL</text>
 <text x={x} y={base+70} textAnchor='middle' fill='#c4d9e8' fontSize={portrait?20:14}>{s.hasIndicator?s.colour.description:'No visible indicator colour'}</text>
 </g>})}
 <text x={portrait?300:500} y={portrait?800:575} textAnchor='middle' fill='#c4d9e8' fontSize='14'>Elapsed {q.timeS.toFixed(2)} s · colour is qualitative, not a pH meter</text>
 </svg></div></div>;
}

import {useState} from 'react';
import {rustGeometry,rustApparatus as a} from '../../lib/chemistry/rustConditionsGeometry';
import {rustConditions,rustConditionNames,rustHistory,type RustInputs,type RustCondition} from '../../lib/chemistry/rustConditions';
export default function RustConditionsDiagram({q,condition,portrait}:{q:RustInputs;condition:RustCondition;portrait:boolean}){
 const [view,setView]=useState('section'),[zoom,setZoom]=useState(100),s=rustGeometry(q,condition),w=portrait?600:1000,h=portrait?900:650;
 const sectionScale=(portrait?230:270)/(s.initialRadiusCm*1.65),cx=portrait?300:350,cy=portrait?350:325;
 const left=portrait?85:90,top=110,pw=w-left-70,ph=portrait?530:320;
 const samples=rustConditions.map(c=>rustGeometry(q,c)),maxMg=Math.max(.001,...samples.map(v=>v.capacityMol*88.851*1000))*1.1;
 const colours=['#e5a46b','#80b7d7','#9bcfb0','#b7a0df'];
 return <div className='rust-diagram'><div className='rust-tools'><label>Inspect <select aria-label='Rust diagram view' value={view} onChange={e=>{setView(e.target.value);setZoom(100)}}><option value='section'>Coupon centre cross-section</option><option value='cells'>Four sealed reference cells</option><option value='history'>Elapsed product-mass histories</option></select></label><label>Zoom <input aria-label='Rust diagram zoom' type='range' min='100' max='300' step='25' value={zoom} onChange={e=>setZoom(+e.target.value)}/>{zoom}%</label><button onClick={()=>setZoom(100)}>Fit rust view</button></div>
 <div className='rust-pan' role='region' aria-label='Rust diagram pan area' tabIndex={0}><svg role='img' aria-label={view==='section'?'Magnified centre cross-section of remaining iron and attached reference product':view==='cells'?'Four rigid reference cells comparing water and oxygen conditions':'Product masses against elapsed days, using only observed model time'} viewBox={`0 0 ${w} ${h}`} style={{width:`${zoom}%`,minWidth:`${zoom}%`,height:`${zoom}%`,minHeight:`${zoom}%`}}>
 <defs><radialGradient id='rust-metal'><stop stopColor='#e4ecf3'/><stop offset='.7' stopColor='#9faebb'/><stop offset='1' stopColor='#697c90'/></radialGradient><linearGradient id='rust-glass'><stop stopColor='#c5e5f3' stopOpacity='.22'/><stop offset='.5' stopColor='#c5e5f3' stopOpacity='.025'/><stop offset='1' stopColor='#c5e5f3' stopOpacity='.22'/></linearGradient></defs><rect width='100%' height='100%' fill='#102235'/>
 <text x='24' y='32' fill='#d8e9f6' fontSize={portrait?20:18}>{view==='section'?'CENTRE SECTION · CHOSEN UNIFORM GEOMETRY':view==='cells'?'MATCHED CELLS · FIXED 25 °C · FINITE INVENTORIES':'ELAPSED PRODUCT MASS · NOT A MEASURED RATE'}</text>
 {view==='section'?<g data-rust-section={condition} data-time={q.timeDays} data-iron-g={s.ironLeftG} data-attached-g={s.attachedProductG} data-sediment-g={s.sedimentProductG} data-scale={sectionScale}>
  <circle data-rust-outer='true' cx={cx} cy={cy} r={s.outerRadiusCm*sectionScale} fill={s.attachedProductG>0?'#b46f3d':'url(#rust-metal)'} stroke='#e1b07c'/><circle data-rust-core='true' cx={cx} cy={cy} r={s.coreRadiusCm*sectionScale} fill='url(#rust-metal)'/>
  <text x={cx} y={cy+9} textAnchor='middle' fill='#172b3d' fontSize={portrait?27:26}>Iron core</text>
  <text x={cx} y={cy+(portrait?250:280)} textAnchor='middle' fill='#d5e7f3' fontSize={portrait?22:20}>Radial layer: {((s.outerRadiusCm-s.coreRadiusCm)*10).toFixed(5)} mm</text>
  <text x={cx} y={cy+(portrait?278:308)} textAnchor='middle' fill='#c0d8e8' fontSize={portrait?19:17}>Magnification preserves the radius ratio</text>
  <g transform={`translate(${portrait?40:655},${portrait?675:190})`} fill='#cde1ef' fontSize={portrait?22:19}>
   <text y='0'>{rustConditionNames[condition]}</text><text y='36'>Metal: {(s.ironLeftG*1000).toFixed(4)} mg</text><text y='72'>Attached: {(s.attachedProductG*1000).toFixed(4)} mg</text><text y='108'>Sediment: {(s.sedimentProductG*1000).toFixed(4)} mg</text><text y='144'>Day {q.timeDays.toFixed(3)} · {s.limiting}</text>
  </g>
 </g>:view==='cells'?<g>{samples.map((v,i)=>{const scale=Math.min(portrait?26:30,(portrait?285:430)/(v.chamberHeightCm+.8)),x=portrait?150+(i%2)*300:150+i*235,base=portrait?385+Math.floor(i/2)*410:560,y=(value:number)=>base-value*scale,R=1.2*scale;
  return <g key={v.condition} data-rust-cell={v.condition} data-time={q.timeDays} data-scale={scale} data-base-y={base} data-gas-ml={v.gasVolumeMl} data-pressure={v.pressureKPa}>
   <rect x={x-R} y={y(a.bottomY+v.chamberHeightCm)} width={2*R} height={v.chamberHeightCm*scale} fill='url(#rust-glass)' stroke='#a8cadd'/><rect x={x-R-4} y={y(a.bottomY+v.chamberHeightCm)-6} width={2*R+8} height='6' rx='2' fill='#687d95'/>
   <rect data-rust-sediment='true' x={x-R} y={y(v.sedimentTopY)} width={2*R} height={v.sedimentDepthCm*scale} fill='#a86b3f'/><rect data-rust-water='true' x={x-R} y={y(v.waterTopY)} width={2*R} height={v.waterDepthCm*scale} fill='#78c6d9' opacity='.3'/>
   {v.wet&&<path d={`M ${x+.3*scale} ${y(a.bottomY)} V ${y(2)} H ${x}`} fill='none' stroke='#b9d5bd' strokeWidth='2' strokeDasharray='3 3'/>}
   <rect x={x-v.outerRadiusCm*scale} y={y(v.couponTopY)} width={2*v.outerRadiusCm*scale} height={v.outerHeightCm*scale} fill={v.attachedProductG>0?'#b46f3d':'#a6b8c8'}/><rect x={x-v.coreRadiusCm*scale} y={y(2+v.coreHeightCm/2)} width={2*v.coreRadiusCm*scale} height={v.coreHeightCm*scale} fill='#b4c6d4'/>
   <text x={x} y={base+24} textAnchor='middle' fill={colours[i]} fontSize={portrait?18:17}>{v.wet?'Water':'Dry'} + {v.reduced?'reduced O₂':'O₂'}</text><text x={x} y={base+50} textAnchor='middle' fill='#d1e4f1' fontSize={portrait?18:16}>{(v.productG*1000).toFixed(4)} mg product</text>
  </g>})}</g>:<g data-rust-history='true'>
  {[0,.25,.5,.75,1].map(f=><g key={f}><line x1={left} x2={left+pw} y1={top+(1-f)*ph} y2={top+(1-f)*ph} stroke='#29445a'/><text x={left-14} y={top+(1-f)*ph+5} textAnchor='end' fill='#cbdfee' fontSize={portrait?22:17}>{(f*maxMg).toFixed(2)}</text></g>)}
  {[0,3.5,7,10.5,14].map(day=><text key={day} x={left+day/14*pw} y={top+ph+27} textAnchor='middle' fill='#cbdfee' fontSize={portrait?22:17}>{day}</text>)}
  <text x={left} y={top-28} fill='#d5e7f4' fontSize={portrait?22:19}>FeOOH-equivalent product / mg</text><text x={left+pw/2} y={top+ph+65} textAnchor='middle' fill='#d5e7f4' fontSize={portrait?22:19}>Elapsed days</text>
  {rustConditions.map((c,i)=><polyline key={c} data-rust-curve={c} points={rustHistory(q,c).map(p=>`${left+p.timeDays/14*pw},${top+ph-p.productG*1000/maxMg*ph}`).join(' ')} stroke={colours[i]} strokeWidth={3-i*.4} strokeDasharray={i?`${9-i*2} ${3+i}`:undefined} fill='none'/>)}
  {samples.map((v,i)=><text key={v.condition} x={left} y={top+ph+105+i*29} fill={colours[i]} fontSize={portrait?20:17}>{rustConditionNames[v.condition]} · {(v.productG*1000).toFixed(4)} mg</text>)}
 </g>}
 </svg></div><div className='rust-readouts' role='region' aria-label='Rust live readings' tabIndex={0}><strong>{rustConditionNames[condition]} · day {q.timeDays.toFixed(3)}</strong><span>Product {(s.productG*1000).toFixed(4)} mg · O₂ used {(s.oxygenUsedMol*1e6).toFixed(4)} µmol</span><span>Coupon {s.couponG.toFixed(6)} g · all iron-containing phases {s.retainedIronContainingG.toFixed(6)} g</span><span>Whole cell {s.totalG.toFixed(6)} g · dry-gas reference {s.pressureKPa.toFixed(3)} kPa</span></div></div>;
}

import './carbonateGas.css';
import {useMemo,useState} from 'react';
import {carbonateGasGeometry,carbonateGasHistory,carbonateApparatus as a} from '../../lib/chemistry/carbonateGasGeometry';
import type {CarbonateGasInputs} from '../../lib/chemistry/carbonateGas';

export default function CarbonateGasDiagram({q,portrait}:{q:CarbonateGasInputs;portrait:boolean}) {
  const [zoom,setZoom]=useState(1),[history,setHistory]=useState(false);
  const s=carbonateGasGeometry(q),curve=useMemo(()=>carbonateGasHistory(q),[q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS]);
  const W=portrait?600:1100,H=portrait?1067:800,k=portrait?25:35;
  const mid=portrait?165:210,bottom=portrait?640:490;
  const shoulderY=bottom-a.baseHeight*k,neckBaseY=shoulderY-a.shoulderHeight*k,top=neckBaseY-a.neckHeight*k;
  const syringeX=portrait?160:500,syringeY=portrait?220:260,syringeK=portrait?12:15;
  const radius=a.syringeRadiusCm*syringeK,piston=syringeX+s.pistonTravelCm*syringeK,barrel=20*syringeK;
  const tube=portrait?[[mid,top],[mid,310],[110,310],[110,syringeY],[syringeX,syringeY]]:[[mid,top],[mid,130],[460,130],[460,syringeY],[syringeX,syringeY]];
  const tubePath=tube.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join('');
  const lengths=tube.slice(1).map((p,i)=>Math.hypot(p[0]-tube[i][0],p[1]-tube[i][1]));
  const routeLength=lengths.reduce((x,y)=>x+y,0);
  const marker=(fraction:number)=>{let d=fraction*routeLength;for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){const f=d/lengths[i];return[tube[i][0]+f*(tube[i+1][0]-tube[i][0]),tube[i][1]+f*(tube[i+1][1]-tube[i][1])]}d-=lengths[i]}return tube.at(-1)!};
  const body=`M${mid-a.neckRadius*k} ${top}V${neckBaseY}L${mid-a.baseRadius*k} ${shoulderY}V${bottom}H${mid+a.baseRadius*k}V${shoulderY}L${mid+a.neckRadius*k} ${neckBaseY}V${top}`;
  const chartX=(t:number)=>80+(W-140)*t/600,chartY=(v:number)=>H-200-(H-400)*v/200;
  return <div className='carbonate-diagram'><div className='carbonate-tools'>
    <div role='group' aria-label='Carbonate gas diagram panel'><button aria-pressed={!history} onClick={()=>{setHistory(false);setZoom(1)}}>Flask & gas syringe</button><button aria-pressed={history} onClick={()=>{setHistory(true);setZoom(1)}}>Elapsed gas evidence</button></div>
    <div role='group' aria-label='Carbonate gas diagram zoom'><button aria-label='Zoom out carbonate diagram' disabled={zoom===1} onClick={()=>setZoom(v=>Math.max(1,v-.5))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label='Zoom in carbonate diagram' disabled={zoom===3} onClick={()=>setZoom(v=>Math.min(3,v+.5))}>+</button><button onClick={()=>setZoom(1)}>Reset carbonate diagram</button></div>
  </div><div className='carbonate-pan' role='region' aria-label='Carbonate gas diagram pan area' tabIndex={0}>
    <svg role='img' aria-label={`Acid and carbonate at ${q.timeS.toFixed(2)} seconds. Syringe expansion ${s.syringeMl.toFixed(3)} millilitres. Gas contains initial air and carbon dioxide.`} viewBox={`0 0 ${W} ${H}`} data-carbonate-inputs={JSON.stringify(q)} data-carbonate-state={JSON.stringify(s)} data-carbonate-pane={history?'history':'apparatus'} style={{width:`${zoom*100}%`,minWidth:`${zoom*100}%`,height:`${zoom*100}%`,minHeight:`${zoom*100}%`}}>
      <defs><linearGradient id='carbonateBg' x2='1' y2='1'><stop stopColor='#102235'/><stop offset='1' stopColor='#203d51'/></linearGradient><linearGradient id='carbonateGasFill'><stop stopColor='#8dcfbf' stopOpacity='.28'/><stop offset='1' stopColor='#b5a3ec' stopOpacity='.4'/></linearGradient><mask id='carbonateLiquidMask' maskUnits='userSpaceOnUse' x='0' y='0' width={W} height={H}><rect width={W} height={H} fill='white'/>{[-1.5,-.5,.5,1.5].map(j=><rect key={j} x={mid+j*.7*k-s.chipEdgeCm*k/2} y={bottom-s.chipEdgeCm*k} width={s.chipEdgeCm*k} height={s.chipEdgeCm*k} fill='black'/>)}</mask></defs>
      <rect width={W} height={H} fill='url(#carbonateBg)'/>
      <g fontFamily='system-ui,sans-serif'><text x='25' y='34' fontSize='13' letterSpacing='2' fill='#a2bed1'>SCIENCE ATLAS / GAS PRODUCTION</text><text x='25' y='75' fontSize={portrait?26:32} fontWeight='700' fill='#eef7fb'>{history?'From reaction to a reading.':'A reaction that moves a piston.'}</text><text x='25' y='108' fontSize='14' fill='#bed5e4'>Elapsed {q.timeS.toFixed(2)} s · {q.temperatureC.toFixed(1)} °C · {q.pressureKPa.toFixed(3)} kPa</text>
      {!history?<>
        <path d={body} fill='#bddeec' fillOpacity='.035' stroke='#bdd9e7' strokeWidth='2'/>
        <rect data-carbonate-liquid='' x={mid-a.baseRadius*k} y={bottom-s.displacedLiquidDepthCm*k} width={2*a.baseRadius*k} height={s.displacedLiquidDepthCm*k} fill='#81bfda' fillOpacity='.35' mask='url(#carbonateLiquidMask)'/>
        {s.carbonateLeftG>0&&[-1.5,-.5,.5,1.5].map(j=><rect key={j} data-carbonate-chip='' data-form-mass-g={s.perChipG} x={mid+j*.7*k-s.chipEdgeCm*k/2} y={bottom-s.chipEdgeCm*k} width={s.chipEdgeCm*k} height={s.chipEdgeCm*k} fill='#f0e8d5' stroke='#c8c3b6' strokeWidth='.6'/>)}
        <rect x={mid-a.neckRadius*k-3} y={top-5} width={2*a.neckRadius*k+6} height='12' rx='3' fill='#607489'/>
        <path d={tubePath} fill='none' stroke='#a4bdce' strokeWidth='7' strokeLinejoin='round'/><path d={tubePath} fill='none' stroke='#203d51' strokeWidth='3'/>
        {s.syringeRateMlS>1e-9&&[0,1,2,3,4].map(i=>{const p=marker((q.timeS*.035+i/5)%1);return <circle key={i} data-carbonate-transfer='' cx={p[0]} cy={p[1]} r='3' fill='#d5b4f3'/>})}
        <rect x={syringeX} y={syringeY-radius} width={barrel} height={2*radius} rx='3' fill='#abcddd' fillOpacity='.05' stroke='#c5deea' strokeWidth='2'/>
        <rect data-carbonate-syringe-gas='' x={syringeX} y={syringeY-radius+1} width={s.pistonTravelCm*syringeK} height={2*radius-2} fill='url(#carbonateGasFill)'/>
        {Array.from({length:11},(_,i)=><g key={i}><line x1={syringeX+i*barrel/10} x2={syringeX+i*barrel/10} y1={syringeY-radius} y2={syringeY-radius-9} stroke='#d7e6ef'/><text x={syringeX+i*barrel/10} y={syringeY-radius-17} textAnchor='middle' fontSize='10' fill='#bed5e4'>{i*20}</text></g>)}
        <line data-carbonate-piston='' x1={piston} x2={piston} y1={syringeY-radius+2} y2={syringeY+radius-2} stroke='#c0b0df' strokeWidth='7'/><line x1={piston+4} x2={piston+barrel+20} y1={syringeY} y2={syringeY} stroke='#9aadc0' strokeWidth='5'/><line x1={piston+barrel+20} x2={piston+barrel+20} y1={syringeY-14} y2={syringeY+14} stroke='#9aadc0' strokeWidth='7'/>
        <text x={syringeX} y={syringeY+radius+30} fontSize='15' fill='#c7b5ef'>Reading {s.syringeMl.toFixed(4)} mL · scale in mL</text>
        <text x={syringeX} y={syringeY+radius+55} fontSize='12' fill='#9de0c9'>Air / CO₂ mixture · {(s.co2MoleFraction*100).toFixed(3)}% CO₂</text>
        <text x={mid} y={bottom+27} textAnchor='middle' fontSize='11' fill='#b4cddd'>4 of 16 weighted carbonate forms · front projection</text>
        <text x={portrait?25:500} y={portrait?725:405} fontSize='16' fill='#f1e8d3'>Carbonate remaining: {s.carbonateLeftG.toFixed(5)} g</text>
        <text x={portrait?25:500} y={portrait?761:442} fontSize='14' fill='#c4dbeb'>Limiting reagent: {s.limitingReagent}</text>
        <text x={portrait?25:500} y={portrait?797:479} fontSize='14' fill='#b5a5e8'>CO₂ equivalent volume: {s.gasEquivalentMl.toFixed(4)} mL</text>
        <text x={portrait?25:500} y={portrait?833:516} fontSize='13' fill='#b6d2e4'>Released solid volume: {s.liberatedSolidVolumeMl.toFixed(5)} mL</text>
        <text x={portrait?25:500} y={portrait?869:553} fontSize='14' fill='#9de0c9'>Reacting contents: {s.contentsG.toFixed(5)} g · conserved</text>
        <text x='25' y={portrait?939:650} fontSize='13' fill='#c7dce9'>CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O</text>
        <text x='25' y={portrait?973:686} fontSize='12' fill='#a8c3d7'>Moving dots show gas transfer, not literal molecule speed.</text>
      </>:<>
        <text x='80' y='170' fontSize='14' fill='#c7deec'>Volume / mL · purple piston, mint CO₂ equivalent</text>
        {[0,50,100,150,200].map(v=><g key={v}><line x1='80' x2={W-60} y1={chartY(v)} y2={chartY(v)} stroke='#8aafc6' strokeOpacity='.2'/><text x='65' y={chartY(v)+4} textAnchor='end' fontSize='12' fill='#bbd4e3'>{v}</text></g>)}
        {[0,150,300,450,600].map(t=><text key={t} x={chartX(t)} y={H-175} textAnchor='middle' fontSize='12' fill='#bbd4e3'>{t}</text>)}
        {(['syringeMl','gasEquivalentMl'] as const).map((key,i)=><polyline key={key} data-carbonate-series={key} data-history-times={JSON.stringify(curve.map(p=>p.timeS))} data-history-values={JSON.stringify(curve.map(p=>p[key]))} points={curve.map(p=>`${chartX(p.timeS)},${chartY(p[key])}`).join(' ')} fill='none' stroke={i?'#85dfc2':'#baa5f0'} strokeWidth={i?1.5:3} strokeDasharray={i?'5 4':undefined}/>)}
        <text x={W/2} y={H-130} textAnchor='middle' fontSize='14' fill='#c0d9e8'>Elapsed physical time / seconds · no future values plotted</text>
        <text x='80' y={H-85} fontSize='12' fill='#a8c3d7'>Piston reading subtracts the space freed by shrinking solid.</text>
      </>}
      <text x={W/2} y={H-30} textAnchor='middle' fontSize={portrait?10:12} fill='#aac6da'>Ideal dry gas, free piston, chosen reaction rate. No dissolved CO₂ or heat model.</text>
      </g>
    </svg>
  </div></div>;
}

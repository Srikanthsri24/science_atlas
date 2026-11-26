import './evaporationArea.css';
import './evaporationAir.css';
import './coolingCrystals.css';
import {lazy,memo,Suspense,useCallback,useEffect,useMemo,useState} from 'react';
import {useClock} from '../science/useClock';
import LabPresentation from './LabPresentation';
import Diagram from './CoolingCrystalDiagram';
import {coolingCrystalPair,coolingCrystalGuide,defaultCoolingCrystalInputs,type CoolingCrystalInputs} from '../../lib/chemistry/coolingCrystalGrowth';
import {validateCoolingRecord,coolingHeaders,coolingTrialValues,coolingCalculations,coolingCrystalReport,type CoolingTrial} from '../../lib/chemistry/coolingCrystalRecord';
const Scene=lazy(()=>import('./CoolingCrystalScene'));
const storageKey='sa360-chemistry-CL-0060';
function inputs(q:CoolingCrystalInputs):CoolingCrystalInputs {
  return {waterG:q.waterG,saltG:q.saltG,fastCoolingS:q.fastCoolingS,slowMultiplier:q.slowMultiplier,
    growthFluxGcm2s:q.growthFluxGcm2s,nucleationPerS:q.nucleationPerS,threshold:q.threshold,timeS:q.timeS};
}
function initial() {try{return validateCoolingRecord(JSON.parse(localStorage.getItem(storageKey)||'null'))}catch{return validateCoolingRecord(null)}}
const Observations=memo(function Observations({trials,onEdit}:{trials:CoolingTrial[];onEdit:(i:number,value:string)=>void}) {
  return <div className='chem-table-scroll' role='region' aria-label='Cooling crystals observation table' tabIndex={0}><table>
    <caption>Equal initial solutions · prescribed temperatures · conserved salt · effective sites and equivalent size</caption>
    <thead><tr>{coolingHeaders.map(h=><th key={h}>{h}</th>)}</tr></thead>
    <tbody>{trials.map((t,i)=><tr key={i}>{coolingTrialValues(t,i).slice(0,-1).map((v,j)=><td key={j}>{v}</td>)}<td><input aria-label={`Cooling crystals observation ${i+1}`} value={t.observation} maxLength={4000} onChange={e=>onEdit(i,e.target.value)}/></td></tr>)}
      {!trials.length&&<tr><td colSpan={22}>Pause and record both cooling programs at the same elapsed time.</td></tr>}
    </tbody>
  </table></div>;
});
export default function CoolingCrystalLab() {
  const [conditions,setConditions]=useState(defaultCoolingCrystalInputs),[guided,setGuided]=useState(false);
  const [record,setRecord]=useState(initial),[notice,setNotice]=useState('');
  const guide=useClock(120,{loop:false}),manual=useClock(120,{loop:false});
  const g=coolingCrystalGuide(guide.time),q=guided?inputs(g.fast):{...conditions,timeS:manual.time*20};
  const pair=useMemo(()=>coolingCrystalPair(q),[q.waterG,q.saltG,q.fastCoolingS,q.slowMultiplier,q.growthFluxGcm2s,q.nucleationPerS,q.threshold,q.timeS]);
  const calc=useMemo(()=>(['fast','slow'] as const).map(program=>({program,steps:coolingCalculations(q,program)})),[q.waterG,q.saltG,q.fastCoolingS,q.slowMultiplier,q.growthFluxGcm2s,q.nucleationPerS,q.threshold,q.timeS]);
  const playing=guided?guide.playing:manual.playing;
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(record))}catch{setNotice('Browser storage is unavailable. Download the practical report to retain your writing.')}},[record]);
  const setup=(next:CoolingCrystalInputs)=>{guide.setPlaying(false);manual.setPlaying(false);setGuided(false);setConditions(inputs(next));manual.seek(next.timeS/20)};
  const watch=()=>{manual.setPlaying(false);setGuided(true);guide.replay();requestAnimationFrame(()=>document.querySelector('.chem-cooling .chem-bench-viewer')?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const edit=useCallback((i:number,value:string)=>setRecord(r=>({...r,trials:r.trials.map((t,j)=>j===i?{...t,observation:value}:t)})),[]);
  const download=()=>{const url=URL.createObjectURL(new Blob([coolingCrystalReport(record)],{type:'text/html'})),link=document.createElement('a');link.href=url;link.download='CL-0060-cooling-crystal-growth-practical.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  const caption=guided?g.caption:`Elapsed ${q.timeS.toFixed(2)} s. Fast ${pair.fast.temperatureC.toFixed(2)} °C, slow ${pair.slow.temperatureC.toFixed(2)} °C. ${pair.slow.coolingFinished?'Both have reached the final 20°C hold. Compare their effective sites and equivalent mean size.':'Record both temperatures: equal elapsed time does not mean equal temperature.'} Salt stays ${q.saltG.toFixed(2)} g and water stays ${q.waterG.toFixed(2)} g in each covered sample.`;
  const range=(label:string,key:keyof CoolingCrystalInputs,min:number,max:number,step:number,unit:string)=><label>{label}: {q[key].toFixed(step<1?3:0)} {unit}<input aria-label={`Cooling crystals ${label}`} type='range' min={min} max={max} step={step} value={q[key]} onChange={e=>setup({...q,[key]:+e.target.value,timeS:0})}/></label>;
  return <div className='chem-practical chem-area chem-air chem-cooling'>
    <a className='back-link' href='#chemistry/5'>← Back to Class 5 chemistry</a>
    <div className='page-heading'><div><div className='eyebrow'>CL-0060 · CLASS 5 · COOLING & CRYSTAL GROWTH</div><h1>The same solution. A different path.</h1><p>Follow temperature, supersaturation and growth. Compare crystal size with the evidence beside it.</p></div></div>
    <p className='cooling-intro'>Both samples start at 80°C with the same dissolved salt and water. Only the prescribed cooling duration differs. Effective sites and equivalent size are chosen model estimates; the apparatus forms show total solid volume.</p>
    <div className='chem-practical-layout'>
      <LabPresentation duration={120} clock={guide} guided={guided} onWatch={watch} onSeek={t=>{manual.setPlaying(false);guide.setPlaying(false);setGuided(true);guide.seek(t)}} onManual={()=>setup(q)} caption={caption}
        help='Coarse KNO3 solubility on a water-mass basis. Prescribed 80→20°C cooling, without evaporation or heat-balance prediction. Chosen effective-site and growth laws are not calibrated material kinetics. Guide: 10 s setup + 100 s evolution across 1200 physical seconds + 10 s hold. Quantitative formulas are teacher extensions.'
        render2D={portrait=><Diagram q={q} portrait={portrait}/>} render3D={portrait=><Suspense fallback={<p>Preparing the cooling vessels…</p>}><Scene q={q} portrait={portrait}/></Suspense>}
        formatLabel='Cooling crystals presentation format' timelineLabel='Cooling crystals guide timeline'
        experimentControl={<button onClick={manual.toggle}>{manual.playing?'Pause experiment':'Run / resume experiment · 120 s'}</button>}/>
      <aside className='panel chem-sample-panel'><h2>Prepare equal hot solutions</h2>
        <div className='chem-procedure-buttons'><button onClick={()=>setup(defaultCoolingCrystalInputs)}>Default cooling comparison</button><button onClick={()=>setup({...defaultCoolingCrystalInputs,waterG:50,saltG:80})}>Concentrated hot preparation</button><button onClick={()=>setup({...defaultCoolingCrystalInputs,waterG:100,saltG:40,growthFluxGcm2s:.005})}>Lower charge · slow growth</button></div>
        {range('Water mass','waterG',50,100,10,'g')}{range('Initial dissolved salt','saltG',40,80,5,'g')}
        {range('Fast cooling duration','fastCoolingS',60,240,30,'s')}{range('Slow cooling multiplier','slowMultiplier',2,5,1,'×')}
        {range('Chosen growth flux','growthFluxGcm2s',.005,.05,.005,'g/(cm² s)')}
        {range('Chosen site coefficient','nucleationPerS',.2,5,.2,'s⁻¹')}{range('Chosen supersaturation threshold','threshold',.02,.2,.02,'')}
        <label>Elapsed physical time: {q.timeS.toFixed(2)} s<input aria-label='Cooling crystals physical time seconds' type='number' min='0' max='2400' step='.01' value={+q.timeS.toFixed(6)} onChange={e=>{const t=e.currentTarget.valueAsNumber;if(Number.isFinite(t)&&t>=0&&t<=2400)setup({...q,timeS:t})}}/>
          <input aria-label='Cooling crystals physical time slider' type='range' min='0' max='2400' step='.1' value={q.timeS} onChange={e=>setup({...q,timeS:+e.target.value})}/></label>
        <p>Changing preparation starts two fresh matched samples. Manual 120 s playback spans 2400 physical seconds. The slow duration is {(q.fastCoolingS*q.slowMultiplier).toFixed(0)} s.</p>
        <div className='chem-procedure-buttons'><button onClick={()=>setup({...q,timeS:0})}>Hot prepared state</button><button onClick={()=>setup({...q,timeS:q.fastCoolingS})}>Fast reaches 20°C</button><button onClick={()=>setup({...q,timeS:q.fastCoolingS*q.slowMultiplier})}>Both at 20°C</button><button onClick={()=>setup({...q,timeS:1200})}>Later growth ·1200 s</button><button onClick={()=>setup({...q,timeS:2400})}>Final observation ·2400 s</button></div>
        {(['fast','slow'] as const).map(program=>{const s=pair[program];return <div key={program}><h3>{program==='fast'?'Fast':'Slow'} program</h3><dl><dt>Temperature / capacity</dt><dd>{s.temperatureC.toFixed(2)} °C / {s.capacityG.toFixed(3)} g</dd><dt>Dissolved / solid</dt><dd>{s.dissolvedG.toFixed(4)} / {s.crystalG.toFixed(4)} g</dd><dt>Effective sites / mean radius</dt><dd>{s.sites.toFixed(4)} / {s.meanEquivalentRadiusCm.toFixed(5)} cm</dd><dt>Supersaturation / total solid rate</dt><dd>{s.supersaturation.toFixed(5)} / {s.totalCrystalRateGS.toFixed(6)} g/s</dd><dt>Salt / whole contents</dt><dd>{s.saltAccountedG.toFixed(3)} / {s.wholeMassG.toFixed(3)} g</dd></dl></div>})}
        <button className='button primary' disabled={playing} onClick={()=>setRecord(r=>({...r,trials:[...r.trials,...(['fast','slow'] as const).map(program=>({...inputs(q),program,observation:''}))].slice(-60)}))}>Record both cooling programs</button><p>Pause before recording. Every observation saves both programs at the same elapsed time, including their individual temperatures.</p>
      </aside>
    </div>
    <section className='panel chem-record'><h2>Practical observations and exam-style report</h2>
      <ol><li>Write the aim: compare growth under two cooling durations using equal initial solutions.</li><li>Record water, dissolved salt, cooling durations and all matched chosen coefficients. Predict the difference.</li><li>Run, pause and record both samples before and after the fast and slow programs reach 20°C.</li><li>Note both temperatures. Compare at a common final temperature before attributing size differences to the cooling history.</li><li>Record effective sites and mean equivalent radius separately from total solid mass. Inspect the equal-scale size view.</li><li>Check dissolved plus solid salt and retained water. Apply formulas with units; cumulative inventories require integration of changing rates.</li><li>Write the result, conclusion and limitations. Do not present chosen effective sites as literal counts or calibrated experimental predictions.</li></ol>
      <label>Prediction and reasoning<textarea aria-label='Cooling crystals prediction' value={record.prediction} maxLength={4000} onChange={e=>setRecord(r=>({...r,prediction:e.target.value}))}/></label>
      <Observations trials={record.trials} onEdit={edit}/>
      <details className='chem-calculation'><summary>Worked calculations · both cooling programs</summary><p>22 steps per program use the current controls. The report recomputes every recorded trial. Numerical inventories integrate changing rates; the current rate is not multiplied by the whole elapsed time.</p>
        {calc.map(c=><div key={c.program}><h3>{c.program==='fast'?'Fast':'Slow'} program</h3><ol className='area-calculations'>{c.steps.map(s=><li key={s.title}><strong>{s.title}</strong><code>{s.formula}</code><p>Substitution: {s.substitution}</p><p><b>Result: {s.result}</b></p></li>)}</ol></div>)}
      </details>
      <label>Result, conclusion and limitations<textarea aria-label='Cooling crystals conclusion' value={record.conclusion} maxLength={4000} onChange={e=>setRecord(r=>({...r,conclusion:e.target.value}))}/></label>
      <p>Latest60 trials remain in this browser. Virtual covered model, coarse solubility, prescribed cooling, chosen population/growth laws and equivalent spherical size. No measured kinetic calibration or predicted actual crystal habit.</p>
      <button className='button primary' onClick={download}>Download exam-style practical report</button>{notice&&<p role='status'>{notice}</p>}
    </section>
  </div>;
}

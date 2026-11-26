import './evaporationArea.css';
import './evaporationAir.css';
import './carbonateGas.css';
import {lazy,memo,Suspense,useCallback,useEffect,useMemo,useState} from 'react';
import {useClock} from '../science/useClock';
import LabPresentation from './LabPresentation';
import Diagram from './CarbonateGasDiagram';
import {carbonateGasState,carbonateGasGuide,defaultCarbonateGasInputs,type CarbonateGasInputs} from '../../lib/chemistry/carbonateGas';
import {validateCarbonateRecord,carbonateHeaders,carbonateTrialValues,carbonateCalculations,carbonateGasReport,type CarbonateTrial} from '../../lib/chemistry/carbonateGasRecord';
const Scene=lazy(()=>import('./CarbonateGasScene')),storageKey='sa360-chemistry-CL-0061';
function inputs(q:CarbonateGasInputs):CarbonateGasInputs{return {carbonateG:q.carbonateG,acidMl:q.acidMl,
  acidMolL:q.acidMolL,temperatureC:q.temperatureC,pressureKPa:q.pressureKPa,rateSInv:q.rateSInv,timeS:q.timeS}}
function initial(){try{return validateCarbonateRecord(JSON.parse(localStorage.getItem(storageKey)||'null'))}catch{return validateCarbonateRecord(null)}}
const Observations=memo(function Observations({trials,onEdit}:{trials:CarbonateTrial[];onEdit:(i:number,value:string)=>void}){
  return <div className='chem-table-scroll' role='region' aria-label='Carbonate gas observation table' tabIndex={0}><table>
    <caption>Preparation · time · piston reading · gas mixture · conserved reacting material</caption>
    <thead><tr>{carbonateHeaders.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>
      {trials.map((t,i)=><tr key={i}>{carbonateTrialValues(t,i).slice(0,-1).map((v,j)=><td key={j}>{v}</td>)}<td><input aria-label={`Carbonate gas observation ${i+1}`} maxLength={4000} value={t.observation} onChange={e=>onEdit(i,e.target.value)}/></td></tr>)}
      {!trials.length&&<tr><td colSpan={24}>Pause and record the initial state, growing gas volume and later observations.</td></tr>}
    </tbody>
  </table></div>;
});
export default function CarbonateGasLab(){
  const [conditions,setConditions]=useState(defaultCarbonateGasInputs),[guided,setGuided]=useState(false);
  const [record,setRecord]=useState(initial),[notice,setNotice]=useState('');
  const guide=useClock(120,{loop:false}),manual=useClock(120,{loop:false}),g=carbonateGasGuide(guide.time);
  const q=guided?inputs(g):{...conditions,timeS:manual.time*5};
  const s=useMemo(()=>carbonateGasState(q),[q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS]);
  const calc=useMemo(()=>carbonateCalculations(q),[q.carbonateG,q.acidMl,q.acidMolL,q.temperatureC,q.pressureKPa,q.rateSInv,q.timeS]);
  const playing=guided?guide.playing:manual.playing;
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(record))}catch{setNotice('Browser storage is unavailable. Download your practical report to retain your writing.')}},[record]);
  const setup=(next:CarbonateGasInputs)=>{guide.setPlaying(false);manual.setPlaying(false);setGuided(false);setConditions(inputs(next));manual.seek(next.timeS/5)};
  const watch=()=>{manual.setPlaying(false);setGuided(true);guide.replay();requestAnimationFrame(()=>document.querySelector('.chem-carbonate .chem-bench-viewer')?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const edit=useCallback((i:number,value:string)=>setRecord(r=>({...r,trials:r.trials.map((t,j)=>j===i?{...t,observation:value}:t)})),[]);
  const download=()=>{const url=URL.createObjectURL(new Blob([carbonateGasReport(record)],{type:'text/html'})),link=document.createElement('a');link.href=url;link.download='CL-0061-acid-carbonate-practical.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  const caption=guided?g.caption:`Elapsed ${q.timeS.toFixed(2)} s. Piston reading ${s.syringeMl.toFixed(4)} mL; generated CO₂ equivalent ${s.gasEquivalentMl.toFixed(4)} mL. Shrinking solid frees ${s.liberatedSolidVolumeMl.toFixed(5)} mL inside the flask. Limiting reagent: ${s.limitingReagent}. Reacting contents stay ${s.initialContentsG.toFixed(4)} g.`;
  const range=(label:string,key:keyof CarbonateGasInputs,min:number,max:number,step:number,unit:string)=><label>{label}: {q[key].toFixed(step<1?3:0)} {unit}<input aria-label={`Carbonate gas ${label}`} type='range' min={min} max={max} step={step} value={q[key]} onChange={e=>setup({...q,[key]:+e.target.value,timeS:0})}/></label>;
  return <div className='chem-practical chem-area chem-air chem-carbonate'>
    <a className='back-link' href='#chemistry/5'>← Back to Class 5 chemistry</a>
    <div className='page-heading'><div><div className='eyebrow'>CL-0061 · CLASS 5 · REACTION & GAS COLLECTION</div><h1>A reaction you can measure.</h1><p>Watch the solid shrink, follow gas transfer and connect a moving piston with a balanced reaction.</p></div></div>
    <p className='carbonate-intro'>CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O. This virtual apparatus retains its initial air. The syringe holds an air/CO₂ mixture, and its travel also accounts for the space freed by shrinking carbonate.</p>
    <div className='chem-practical-layout'>
      <LabPresentation duration={120} clock={guide} guided={guided} onWatch={watch} onSeek={t=>{manual.setPlaying(false);guide.setPlaying(false);setGuided(true);guide.seek(t)}} onManual={()=>setup(q)} caption={caption}
        help='Ideal dry gas at constant pressure with a freely moving piston. No dissolved CO₂, water vapour, leakage, friction or heat balance. Chosen reaction relaxation is illustrative, not measured kinetics. Guide: 10 s setup + 100 s evolution across 300 physical seconds + 10 s hold. Formulas are teacher extensions.'
        render2D={portrait=><Diagram q={q} portrait={portrait}/>} render3D={portrait=><Suspense fallback={<p>Preparing the gas-collection apparatus…</p>}><Scene q={q} portrait={portrait}/></Suspense>}
        formatLabel='Carbonate gas presentation format' timelineLabel='Carbonate gas guide timeline'
        experimentControl={<button onClick={manual.toggle}>{manual.playing?'Pause experiment':'Run / resume experiment · 120 s'}</button>}/>
      <aside className='panel chem-sample-panel'><h2>Prepare the virtual reaction</h2>
        <div className='chem-procedure-buttons'><button onClick={()=>setup(defaultCarbonateGasInputs)}>Default acid-limited preparation</button><button onClick={()=>setup({...defaultCarbonateGasInputs,carbonateG:.1,acidMolL:.3})}>Carbonate-limited preparation</button><button onClick={()=>setup({...defaultCarbonateGasInputs,acidMolL:0})}>No-acid control</button><button onClick={()=>setup({...defaultCarbonateGasInputs,carbonateG:0})}>No-carbonate control</button></div>
        {range('Initial carbonate mass','carbonateG',0,.5,.05,'g')}{range('Acid volume','acidMl',10,30,5,'mL')}{range('Acid concentration','acidMolL',0,.3,.05,'mol/L')}
        {range('Temperature','temperatureC',20,35,5,'°C')}{range('Pressure','pressureKPa',90,110,.025,'kPa')}{range('Chosen reaction coefficient','rateSInv',.005,.03,.005,'s⁻¹')}
        <label>Elapsed physical time: {q.timeS.toFixed(2)} s<input aria-label='Carbonate gas physical time seconds' type='number' min='0' max='600' step='.01' value={+q.timeS.toFixed(6)} onChange={e=>{const t=e.currentTarget.valueAsNumber;if(Number.isFinite(t)&&t>=0&&t<=600)setup({...q,timeS:t})}}/><input aria-label='Carbonate gas physical time slider' type='range' min='0' max='600' step='.1' value={q.timeS} onChange={e=>setup({...q,timeS:+e.target.value})}/></label>
        <p>Changing a preparation starts a fresh sample. Manual120 s playback spans600 physical seconds. Temperature and pressure change ideal gas volume; the chosen reaction coefficient remains independent.</p>
        <div className='chem-procedure-buttons'>{[0,30,60,120,300,600].map(t=><button key={t} onClick={()=>setup({...q,timeS:t})}>{t===0?'Initial preparation':`Observe ·${t} s`}</button>)}</div>
        <dl><dt>Limiting reagent / maximum extent</dt><dd>{s.limitingReagent} / {s.maximumExtentMol.toExponential(4)} mol</dd><dt>Piston reading / CO₂ equivalent</dt><dd>{s.syringeMl.toFixed(4)} / {s.gasEquivalentMl.toFixed(4)} mL</dd><dt>Carbonate / acid remaining</dt><dd>{s.carbonateLeftG.toFixed(5)} / {s.hclLeftG.toFixed(5)} g</dd><dt>CO₂ formed / fraction in gas</dt><dd>{s.co2G.toFixed(5)} g / {(s.co2MoleFraction*100).toFixed(4)}%</dd><dt>Current piston rate</dt><dd>{s.syringeRateMlS.toFixed(6)} mL/s</dd><dt>Reacting contents / initial contents</dt><dd>{s.contentsG.toFixed(5)} / {s.initialContentsG.toFixed(5)} g</dd></dl>
        <button className='button primary' disabled={playing} onClick={()=>setRecord(r=>({...r,trials:[...r.trials,{...inputs(q),observation:''}].slice(-60)}))}>Record carbonate gas evidence</button>
        <p>Pause before recording. The gas stays inside the ideal apparatus; it has moved between compartments. Initial air mass is unchanged and excluded from both sides of the reacting-material balance.</p>
      </aside>
    </div>
    <section className='panel chem-record'><h2>Practical observations and exam-style report</h2>
      <ol><li>Write the aim and a prediction. Record all initial masses, volumes, concentration, temperature, pressure and chosen coefficient.</li><li>Use the balanced equation to find the limiting reagent and maximum possible CO₂ amount.</li><li>Record the initial zero piston reading. Run, pause and take observations at regular elapsed times.</li><li>Compare shrinking carbonate, remaining acid, gas reading and current piston rate. Rate and accumulated volume are different quantities.</li><li>Compare an acid-limited sample with a carbonate-limited sample. Repeat both zero-reactant controls.</li><li>Account for the initial trapped air and space freed by the solid. Do not describe the syringe contents as pure CO₂.</li><li>Apply formulas with units, check mass closure, and write the result, conclusion and model limitations.</li></ol>
      <label>Prediction and reasoning<textarea aria-label='Carbonate gas prediction' maxLength={4000} value={record.prediction} onChange={e=>setRecord(r=>({...r,prediction:e.target.value}))}/></label>
      <Observations trials={record.trials} onEdit={edit}/>
      <details className='chem-calculation'><summary>Worked calculations · reaction, gas volume and mass</summary><p>30 formula/substitution/result steps use the current controls. The report recomputes every recorded trial. Tiny positive residues use scientific notation.</p><ol className='area-calculations'>{calc.map(c=><li key={c.title}><strong>{c.title}</strong><code>{c.formula}</code><p>Substitution: {c.substitution}</p><p><b>Result: {c.result}</b></p></li>)}</ol></details>
      <label>Result, conclusion and limitations<textarea aria-label='Carbonate gas conclusion' maxLength={4000} value={record.conclusion} onChange={e=>setRecord(r=>({...r,conclusion:e.target.value}))}/></label>
      <p>Latest60 trials remain in this browser. Chosen kinetics and drawing-volume assumptions do not replace measured experiments. This is a virtual model; physical chemical handling requires teacher supervision.</p>
      <button className='button primary' onClick={download}>Download exam-style practical report</button>{notice&&<p role='status'>{notice}</p>}
    </section>
  </div>;
}

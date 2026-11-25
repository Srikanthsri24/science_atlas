export const materials=[{id:'wood',name:'Wood',colour:'#b88854'},{id:'glass',name:'Glass',colour:'#91c8d4'},{id:'stone',name:'Stone',colour:'#8f96a2'},{id:'plastic',name:'Plastic',colour:'#6f93e1'},{id:'metal',name:'Metal',colour:'#b8c9d8'},{id:'rubber',name:'Rubber',colour:'#d9898b'}]as const;
export type MaterialId=typeof materials[number]['id'];
export const samples=[
 {id:'spoon',name:'Spoon',material:'metal',clue:'This chosen sample is made of metal. It has a reflective surface and keeps its shape.'},
 {id:'block',name:'Block',material:'wood',clue:'This chosen wooden block has visible grain. Its surface is opaque.'},
 {id:'bottle',name:'Bottle',material:'plastic',clue:'This lightweight blue bottle is a chosen plastic sample. Other bottles can be glass or metal.'},
 {id:'marble',name:'Marble',material:'glass',clue:'This chosen glass marble is smooth and translucent. Its shape alone does not identify its material.'},
 {id:'eraser',name:'Eraser',material:'rubber',clue:'This sample is a rubber eraser. Real erasers may also use other materials.'},
 {id:'pebble',name:'Pebble',material:'stone',clue:'This chosen stone sample is hard, opaque and irregular in shape.'},
]as const;
export type SampleId=typeof samples[number]['id'];
export type SortingTrial={sample:SampleId;bin:MaterialId;observation:string;timestamp:string};
export type SortingRecord={version:1;prediction:string;trials:SortingTrial[];result:string;conclusion:string};
export const emptySortingRecord=():SortingRecord=>({version:1,prediction:'',trials:[],result:'',conclusion:''});
export function correctSort(sample:SampleId,bin:MaterialId){const object=samples.find(s=>s.id===sample);return Boolean(object&&object.material===bin);}
export function sortingStations(portrait:boolean){return{
 rack:samples.map((_,i)=>portrait?{x:(i%3-1)*1.35,z:-2.5+Math.floor(i/3)*1.25}:{x:(i-2.5)*1.15,z:-.8}),
 trays:materials.map((_,i)=>portrait?{x:(i%3-1)*1.35,z:.5+Math.floor(i/3)*1.3}:{x:(i-2.5)*1.15,z:.85}),
 table:portrait?{width:4.8,depth:6.4,z:-.25}:{width:8,depth:3.3,z:0},
 platform:portrait?{width:4.5,depth:2.4,z:-1.9}:{width:7.6,depth:1.03,z:-.8},
};}
export function sortingSummary(trials:SortingTrial[]){const classified=new Set(trials.filter(t=>correctSort(t.sample,t.bin)).map(t=>t.sample));return{attempts:trials.length,correctAttempts:trials.filter(t=>correctSort(t.sample,t.bin)).length,classified:classified.size,total:samples.length};}
export function sortingFrame(seconds:number){
 if(!Number.isFinite(seconds))throw new RangeError('A finite display time is required');
 const t=Math.max(0,Math.min(100,seconds)),index=Math.min(5,Math.floor(t/15)),phase=t>=90?1:Math.max(0,Math.min(1,(t%15-4)/8));
 const placements=samples.map((s,i)=>({sample:s.id,bin:s.material as MaterialId,progress:t>=90||i<index?1:i===index?phase:0}));
 return{index,phase,placements,caption:t>=90?'Compare the six material groups. An object’s shape and its material are different ideas.':phase===0?`Inspect the ${samples[index].name.toLowerCase()}. ${samples[index].clue}`:`Move the ${samples[index].name.toLowerCase()} to the ${samples[index].material} group.`,finished:t>=100};
}
export function validateSortingRecord(value:unknown):SortingRecord{
 const empty=emptySortingRecord();if(!value||typeof value!=='object')return empty;
 const v=value as Partial<SortingRecord>;if(v.version!==1||!Array.isArray(v.trials))return empty;
 const text=(s:unknown)=>typeof s==='string'?s.slice(0,4000):'';
 return{version:1,prediction:text(v.prediction),result:text(v.result),conclusion:text(v.conclusion),trials:v.trials.filter(t=>t&&samples.some(s=>s.id===t.sample)&&materials.some(m=>m.id===t.bin)).slice(-60).map(t=>({sample:t.sample,bin:t.bin,observation:text(t.observation),timestamp:text(t.timestamp)}))};
}
const escape=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function sortingReport(r:SortingRecord){const s=sortingSummary(r.trials);return`<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0001 — Practical report</title><style>body{font:16px/1.6 system-ui;color:#172238;max-width:1000px;margin:40px auto;padding:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #b5c0d0;padding:10px;text-align:left}h1,h2{color:#493ca5}@media print{body{margin:0}}</style><h1>Practical record: Sort objects by their material</h1><p>Class 1 · CL-0001 · VisionariesAI Labs Private Limited</p><h2>Aim</h2><p>Group six selected objects by the material they are made from.</p><h2>Apparatus and samples</h2><p>Six virtual sorting trays; spoon, block, bottle, marble, eraser and pebble.</p><h2>Principle</h2><p>Material is what an object is made from; shape and use are different properties. These samples have specified materials. Appearance alone cannot identify all real materials.</p><h2>Prediction</h2><p>${escape(r.prediction||'Not yet written')}</p><h2>Procedure</h2><ol><li>Inspect a sample and read its description.</li><li>Choose its material group.</li><li>Record the result and describe the evidence.</li><li>Repeat with all six samples and compare the groups.</li></ol><h2>Observation table</h2><table><thead><tr><th>Trial</th><th>Sample</th><th>Chosen group</th><th>Model feedback</th><th>My observation</th></tr></thead><tbody>${r.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${escape(samples.find(s=>s.id===t.sample)!.name)}</td><td>${escape(t.bin)}</td><td>${correctSort(t.sample,t.bin)?'Matches specified material':'Reconsider this grouping'}</td><td>${escape(t.observation||'Not yet written')}</td></tr>`).join('')}</tbody></table><h2>Counting and result</h2><p>Distinct samples classified correctly = ${s.classified}; total samples = ${s.total}. Unclassified = ${s.total} − ${s.classified} = ${s.total-s.classified} objects. Repeated attempts do not increase the distinct-sample count.</p><p>${escape(r.result||'Result not yet written')}</p><h2>Conclusion</h2><p>${escape(r.conclusion||'Conclusion not yet written')}</p><h2>Model limits</h2><p>This is a classification activity using known virtual samples and their specified main materials. Objects may contain several materials. This model does not measure hardness, composition, safety or chemical reactivity, and objects with the same name may be made from different materials.</p></html>`;}

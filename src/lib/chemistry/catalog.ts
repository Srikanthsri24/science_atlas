import data from '../../../data/chemistry-labs.json';
export type ChemistryLab={id:string;sequence:number;grade:number;title:string;strand:string;status:'planned'|'in_progress'|'ready';curriculumStatus:string;aim:string;minimumAnimationSeconds:number;review:Record<'model'|'twoD'|'threeD'|'responsive'|'practicalRecord','pending'|'passed'>};
export const chemistryLabs=data.labs as ChemistryLab[];
export const chemistryClasses=Array.from({length:12},(_,i)=>({grade:i+1,strand:chemistryLabs.find(l=>l.grade===i+1)!.strand,count:chemistryLabs.filter(l=>l.grade===i+1).length}));
export function chemistryClass(value?:string){const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=12?n:0;}
export function filterChemistryLabs(grade:number,query='',status='all'){
 const q=query.normalize('NFKC').trim().toLowerCase();
 return chemistryLabs.filter(l=>(!grade||l.grade===grade)&&(status==='all'||l.status===status)&&`${l.id} ${l.title} ${l.strand} class ${l.grade}`.normalize('NFKC').toLowerCase().includes(q)).sort((a,b)=>a.sequence-b.sequence);
}
export function chemistryCsv(){const quote=(s:unknown)=>'"'+String(s).replaceAll('"','""')+'"';return[['ID','Class','Strand','Laboratory','Status'],...chemistryLabs.map(l=>[l.id,l.grade,l.strand,l.title,l.status])].map(row=>row.map(quote).join(',')).join('\r\n');}

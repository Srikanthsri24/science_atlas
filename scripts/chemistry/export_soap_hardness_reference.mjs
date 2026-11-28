import{writeFileSync}from'node:fs';import{loadTs}from'../../tests/load-ts.mjs';
const m=await loadTs('src/lib/chemistry/soapHardness.ts'),inputs=[];
for(const sampleMl of[20,50,100])for(const calciumMmolL of[0,1,5])for(const magnesiumMmolL of[0,.5,5])for(const soapMolL of[.005,.01,.05])for(const deliveredMl of[0,1,15,20])for(const agitationCycles of[0,10,20,30])inputs.push({sampleMl,calciumMmolL,magnesiumMmolL,soapMolL,deliveredMl,agitationCycles});
let seed=109;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<120;i++)inputs.push({sampleMl:20+80*random(),calciumMmolL:5*random(),magnesiumMmolL:5*random(),soapMolL:.005+.045*random(),deliveredMl:20*random(),agitationCycles:30*random()});
for(const factor of[1-1e-8,1,1+1e-8])inputs.push({...m.defaultSoapHardness,deliveredMl:15*factor,agitationCycles:30});
writeFileSync('reports/chemistry-expansion/CL-0109/core-reference.json',JSON.stringify(inputs.map(input=>({input,cells:m.soapHardnessState(input).cells})),null,2)+'\n');
console.log(inputs.length,'preparations exported');

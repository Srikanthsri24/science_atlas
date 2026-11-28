import{writeFileSync}from'node:fs';import{loadTs}from'../../tests/load-ts.mjs';
const m=await loadTs('src/lib/chemistry/soapDetergent.ts'),inputs=[];
for(const sampleMl of[20,50,80,100])for(const calciumMmolL of[0,5])for(const magnesiumMmolL of[0,5])for(const soapMolL of[.005,.01,.025,.05])for(const deliveredMl of[0,6,20])for(const agitationCycles of[0,30])for(const matching of['molar','mass'])inputs.push({sampleMl,calciumMmolL,magnesiumMmolL,soapMolL,deliveredMl,agitationCycles,matching});
let seed=110;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<160;i++)inputs.push({sampleMl:20+80*random(),calciumMmolL:5*random(),magnesiumMmolL:5*random(),soapMolL:.005+.045*random(),deliveredMl:20*random(),agitationCycles:30*random(),matching:i%2?'mass':'molar'});
for(const factor of[1-1e-8,1,1+1e-8])inputs.push({...m.defaultSoapDetergent,deliveredMl:15*factor});
for(const soapMolL of[.04,.05])inputs.push({...m.defaultSoapDetergent,sampleMl:20,soapMolL,deliveredMl:20});
writeFileSync('reports/chemistry-expansion/CL-0110/core-reference.json',JSON.stringify(inputs.map(input=>({input,state:m.soapDetergentState(input)})),null,2)+'\n');console.log(inputs.length,'preparations exported');

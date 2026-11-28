import{writeFileSync}from'node:fs';import{loadTs}from'../../tests/load-ts.mjs';const m=await loadTs('src/lib/chemistry/fibreAbsorption.ts'),q=m.defaultFibreAbsorption,rows=[];
const add=input=>rows.push({input,cells:m.fibreAbsorptionState(input).cells});
for(const dryMassG of[.2,1,5])for(const bathMl of[0,.1,5,50])for(const soakS of[0,10,120,300])for(const drainS of[0,30,180])for(const constructionFactor of[.25,1,2])add({...q,dryMassG,bathMl,soakS,drainS,constructionFactor});
let seed=112;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);for(let i=0;i<128;i++)add({dryMassG:.2+4.8*random(),bathMl:50*random(),soakS:300*random(),drainS:180*random(),constructionFactor:.25+1.75*random(),retentionScale:2*random(),wettingScale:2*random(),panTareG:10+90*random()});
for(const id of m.fibreAbsorptionIds){const s=m.fibreAbsorptionCell(q,id);for(const factor of[1-1e-8,1+1e-8])add({...q,bathMl:s.unlimitedUptakeG*factor});}
for(const patch of[{bathMl:1e-6,soakS:1e-6,drainS:1e-6,retentionScale:1e-6,wettingScale:1e-6},{retentionScale:0,wettingScale:0},{retentionScale:0,drainS:180},{panTareG:25.0005,dryMassG:.2005}])add({...q,...patch});
writeFileSync('reports/chemistry-expansion/CL-0112/core-reference.json',JSON.stringify(rows));console.log(rows.length,'preparations exported');

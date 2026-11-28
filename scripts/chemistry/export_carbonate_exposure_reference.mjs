import{writeFileSync}from'node:fs';import{loadTs}from'../../tests/load-ts.mjs';
const m=await loadTs('src/lib/chemistry/carbonateExposure.ts'),q=m.defaultCarbonateExposure,inputs=[];
for(const specimenG of[.02,.1,1])for(const areaCm2 of[.5,4])for(const acidMmolL of[0,.1,1])for(const deliveredMl of[0,100,1000])for(const contactFraction of[0,.25,1])for(const captureFraction of[0,.5,1])inputs.push({...q,specimenG,areaCm2,acidMmolL,deliveredMl,contactFraction,captureFraction});
let seed=111;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<128;i++)inputs.push({specimenG:.02+.98*random(),areaCm2:.5+3.5*random(),acidMmolL:.00001+.99999*random(),deliveredMl:.00001+999.99999*random(),contactFraction:.001+.998*random(),captureFraction:.001+.998*random(),temperatureK:273.15+40*random(),pressureKPa:80+40*random()});
for(const id of['half-acid','acid']){const p={...q,specimenG:.02,acidMmolL:1};const threshold=m.carbonateExposureCell(p,id).requiredDoseMl;for(const factor of[1-1e-8,1+1e-8])inputs.push({...p,deliveredMl:threshold*factor});}
for(const factor of[1-1e-8,1-1e-12])inputs.push({...q,acidMmolL:1,deliveredMl:1000*factor});
for(const captureFraction of[0,1e-6,.5,1])inputs.push({...q,acidMmolL:1e-6,deliveredMl:1e-6,contactFraction:1e-6,captureFraction});
writeFileSync('reports/chemistry-expansion/CL-0111/core-reference.json',JSON.stringify(inputs.map(input=>({input,cells:m.carbonateExposureState(input).cells})),null,2)+'\n');console.log(inputs.length,'preparations exported');

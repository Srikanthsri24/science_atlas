export type CellSite={at:[number,number,number];share:number;label:string};
/** Conventional cubic teaching cells; coordinates are display units, not nm. */
export function cellSites(type:number,half=.8):CellSite[]{const sites:CellSite[]=[];for(const x of[-half,half])for(const y of[-half,half])for(const z of[-half,half])sites.push({at:[x,y,z],share:1/8,label:'⅛'});if(type===1)sites.push({at:[0,0,0],share:1,label:'1'});if(type===2)for(const side of[-half,half])for(let axis=0;axis<3;axis++){const at:[number,number,number]=[0,0,0];at[axis]=side;sites.push({at,share:.5,label:'½'})}return sites;}

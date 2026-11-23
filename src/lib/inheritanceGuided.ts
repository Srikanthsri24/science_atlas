/** Different lessons place allele combination in different narrated windows. */
export function inheritanceConceptReveal(id:string,seconds:number){
 const start=id==='SA-0043'?60:id==='SA-0044'?40:null;
 if(start===null)return null;
 const t=Math.max(0,Math.min(100,seconds));
 return t<start?0:t>=start+20?4:Math.min(4,1+Math.floor((t-start)/5));
}

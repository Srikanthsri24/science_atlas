import type{Parameters}from'../components/science/types';
export function waveThermalConceptTime(id:string,seconds:number,p:Parameters):number|null{
 const t=Math.max(0,Math.min(100,seconds)),trial=(reset=80)=>t<reset?t/reset:(t-reset)/(100-reset);
 if(id==='SA-0117')return p.ua*t/100;
 if(id==='SA-0118'){const period=2*Math.PI*Math.sqrt(p.springMass/p.springK);return period*(t<80?t/160:(t-80)/20);}
 if(id==='SA-0112')return Math.min(4.99999,trial()*5);
 if(['SA-0113','SA-0122','SA-0125'].includes(id))return Math.min(5.99999,trial()*6);
 if(id==='SA-0114'||id==='SA-0124')return Math.min(5.99999,t/100*6);
 return null;
}
/** Fixed reference conductance 5 W/K; varying actual conductance changes the rate at a shared time. */
export function conductionClock(display:number,mass:number){return ((display%6)+6)%6/6*3*mass*900/(2*5);}
/** Fixed reference absorption 20 m², so treatment changes the visible decay at a shared time. */
export function reverbClock(display:number,volume:number){return ((display%6)+6)%6/6*.161*volume/20;}
export function slitLayout(widthMm:number,separationMm:number,double:boolean){const halfWidth=widthMm*.8,centres=double?[-separationMm*.8,separationMm*.8]:[0];return{halfWidth,centres};}

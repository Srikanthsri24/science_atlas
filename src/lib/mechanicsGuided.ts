import{projectile}from'./expansionModels';
import{falling}from'./batchModels';
import type{Parameters}from'../components/science/types';
/** Concept demonstrations slow an ordered trial; manual experiments retain their physical clock. */
export function mechanicsConceptTime(id:string,seconds:number,p:Parameters):number|null{
 const t=Math.max(0,Math.min(100,seconds));
 if(id==='SA-0063'||id==='SA-0064'){const end=projectile(0,p.launchSpeed,p.launchAngle,p.launchGravity).flight;return end*Math.min(1,t/(id==='SA-0063'?80:100));}
 if(id==='SA-0065'||id==='SA-0075'){const end=falling(0,p.fallHeight,p.fallMass,p.fallArea,p.airDrag).impactTime;return end*(t<80?t/80:(t-80)/20);}
 if(id==='SA-0076'||id==='SA-0077'){const end=falling(0,p.fallHeight,p.fallMass,p.fallArea,p.airDrag).impactTime,reset=id==='SA-0076'?60:80;return end*(t<reset?t/reset:(t-reset)/(100-reset));}
 if(['SA-0090','SA-0091','SA-0092','SA-0097'].includes(id)){return 6*Math.min(.99999,(t<80?t/80:(t-80)/20));}
 if(id==='SA-0079'||id==='SA-0087'){return 6*Math.min(.99999,(t<60?t/60:(t-60)/40));}
 if(id==='SA-0069'){const impact=3.6/p.uc,duration=impact+.4,physical=t<60?impact*t/60:impact+.4*(t-60)/40;return 6*Math.min(.99999,physical/duration);}
 return null;
}
/** Stroboscopic positions at equal physical-time intervals; no predicted future samples. */
export function fallSamples(p:Parameters,t:number){const end=falling(0,p.fallHeight,p.fallMass,p.fallArea,p.airDrag).impactTime,now=Math.min(t,end),dt=end/12;return Array.from({length:12},(_,j)=>now-(j+1)*dt).filter(t=>t>=0).reverse().map(t=>({time:t,height:falling(t,p.fallHeight,p.fallMass,p.fallArea,p.airDrag).height}));}

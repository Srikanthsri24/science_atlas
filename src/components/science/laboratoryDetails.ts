import type{World,Thing,V}from'../universe/world';
import type{UniverseParameters}from'../../lib/universeTypes';
import{foodEnergy,population,orbit,collision,lever}from'../../lib/universeModels';
import{forceMotion}from'../../lib/foundationModels';
import{cycleBudget,pollutionBox}from'../../lib/cosmosModels';

export function laboratoryDetails(kind:string,p:UniverseParameters,time:number,base:World):World{
 const kinds=['foodweb','population','cycles','pollution','food','nutrition','hygiene','reproduction','force','collision','cradle','rotation','lever','orbit'];if(!kinds.includes(kind))return base;
 const things:Thing[]=base.things.map(t=>({...t})),flows=[...base.flows],green='#90b49a',blue='#82b7c6',gold='#d6bb80',rose='#c38b8e',dark='#566b70',cream='#dbd6bc';
 const tube=(points:V[],color:string,radius=.012,inspect?:string)=>things.push({shape:'tube',at:[0,0,0],points,color,radius,inspect});
 const ell=(at:V,size:V,color:string,inspect:string,opacity=1)=>things.push({shape:'ellipsoid',at,size,color,inspect,opacity});
 const box=(at:V,size:V,color:string,inspect:string,material?:'metal')=>things.push({shape:'box',at,size,color,inspect,material});
 const label=(at:V,text:string,color=cream)=>things.push({shape:'text',at,text,color});
 const arrow=(a:V,b:V,color:string,inspect:string)=>things.push({shape:'arrow',at:a,points:[a,b],color,inspect});
 const ring=(at:V,r:number,color:string,inspect:string)=>tube(Array.from({length:33},(_,j)=>[at[0]+r*Math.cos(j/32*2*Math.PI),at[1]+r*Math.sin(j/32*2*Math.PI),at[2]] as V),color,.009,inspect);
 const u=(((time%6)+6)%6)/6,mode=Math.round(p.ua);
 if(kind==='foodweb'){
  const s=foodEnergy(p.ua,p.ub,p.uc);for(let i=0;i<p.uc;i++){const x=(i-(p.uc-1)/2)*1.2,y=.4-i*.2;
   const h=.48*s.energy[i]/s.energy[0];box([x,y-.34+h/2,.25],[.68,h,.09],i===0?green:gold,'Common-scale energy budget');
   if(i<p.uc-1){label([x,y-1.25,.1],`${s.untransferred[i].toFixed(0)} kJ`,rose);}
  }label([0,1.8,.1],'Equal numerical scale · energy is transferred, not recycled',cream);
 }
 if(kind==='population'){
  const elapsed=u*60,ymax=Math.max(1,p.ua/p.ub),curve=Array.from({length:61},(_,j)=>[-2.25+j/60*4.5,-1.50+population(j,p.ua,p.ub,p.uc).n/p.ub/ymax*.45,.10] as V);
  tube([[-2.25,-1.5,.1],[2.25,-1.5,.1]],dark,.009,'Time axis');tube([[-2.25,-1.5,.1],[-2.25,-1.0,.1]],dark,.009,'N/K axis');tube(curve,green,.014,'Expected logistic population');tube([[-2.25,-1.5+.45/ymax,.10],[2.25,-1.5+.45/ymax,.10]],dark,.005,'Carrying-capacity reference');
  const s=population(elapsed,p.ua,p.ub,p.uc);ell([-2.25+u*4.5,-1.5+s.n/p.ub/ymax*.45,.13],[.04,.04,.04],gold,'Current population on graph');label([0,-1.83,.1],`0 → 60 model days · N/K scale 0–${ymax.toFixed(1)}`,cream);
 }
 if(kind==='pollution'){
  box([-1.8,.25,-.08],[.24,.75,.3],dark,'Input-source conduit');tube([[-1.8,.6,.1],[-1.8,.9,.1]],rose,.055,'Input opening');
  box([1.6,-.4,-.08],[.32,.55,.3],green,'Removal-system symbol');for(let j=0;j<4;j++)tube([[1.45,-.6+j*.13,.12],[1.75,-.6+j*.13,.12]],cream,.012,'Removal filter guide');
  if(pollutionBox(p.ua,p.ub,p.uc,u*24).amount<=1e-12)for(let i=flows.length-1;i>=0;i--)if(flows[i].points.at(-1)![0]>1.5)flows.splice(i,1);
  if(p.ub===0)for(let i=flows.length-1;i>=0;i--)if(flows[i].points[0][0]<-1.5)flows.splice(i,1);
  label([0,1.25,.1],'Input − removal = change in stored mass',gold);
 }
 if(kind==='cycles'){
  const amounts=cycleBudget([80,15,5],p.ub,p.uc,u*12),nodes:V[]=[[-1.3,.5,0],[1.3,.5,0],[0,-.9,0]];
  flows.length=0;for(let i=0;i<3;i++){const next=(i+1)%3,rate=(i===2?p.uc:p.ub)*amounts[i];tube([nodes[i],nodes[next]],dark,.010,'Reservoir transfer route');if(rate>1e-10)flows.push({points:[nodes[i],nodes[next]],color:gold,count:3,speed:.25});}
  for(let i=0;i<3;i++)label([nodes[i][0],nodes[i][1]-.65,.1],`${amounts[i].toFixed(2)} mass units`,i===1?green:blue);
  label([0,1.65,.1],'Matter is conserved across the three selected pools',cream);
 }
 if(kind==='food'){
  if(mode===0)for(let j=0;j<18;j++){const x=-1.72+(j%3)*.32,y=-.36+Math.floor(j/3)*.08;ell([x,y,.285],[.015,.025,.008],gold,'Bread crumb pore');}
  if(mode===2){for(let j=0;j<8;j++)tube([[-1.3,-.48+j*.09,.34],[-1.45,-.45+j*.09,.31]],rose,.006,'Fruit skin contour');}
  ell([1.4,1.15,0],[.22,.25,.20],cream,'Head landmark',.4);for(const s of[-1,1])tube([[1.4,-.45,0],[1.4+s*.20,-.95,0]],cream,.05,'Body outline leg');
 }
 if(kind==='nutrition'){
  for(let j=0;j<5;j++)ell([-.2+j*.1,.03,.29],[.012,.012,.012],gold,'Nutrient transfer marker');
  if(mode===0)for(let j=0;j<6;j++)ring([1,-.04,.36],.08+j*.015,rose,'Red-cell surface guide');
  if(mode===2)for(const y of[-.28,.28])for(const x of[.94,1.06])ell([x,y,.35],[.055,.045,.04],cream,'Bone end guide');
  label([0,-1.15,.1],'Structure–function illustration · symptoms are not a diagnosis',cream);
 }
 if(kind==='hygiene'){
  if(mode===0&&p.ub>.5){for(const side of[-1,1])for(let j=0;j<4;j++)tube([[side*.16+(j-1.5)*.035,-.2,.39],[side*.16+(j-1.5)*.04,-.08,.39]],cream,.009,'Finger guide');}
  if(mode===2&&p.ub>.5)box([0,.23,.1],[.76,.06,.06],dark,'Window frame');
  label([0,-1.25,.1],'Preventive systems reduce routes; this model predicts no risk percentage',cream);
 }
 if(kind==='reproduction'&&mode===5){
  const h=[.6,1.5,2.2,2.6,2.5][Math.round(p.ub)],skin='#cbb7a5';
  for(let i=things.length-1;i>=0;i--)if(['Head · life-stage outline','Trunk','Arm','Leg'].includes(things[i].inspect??''))things.splice(i,1);
  flows.length=0;
  const limb=(a:V,b:V,r:number,color:string,name:string)=>{const dx=b[0]-a[0],dy=b[1]-a[1],mid=a.map((v,i)=>(v+b[i])/2) as V;things.push({shape:'ellipsoid',at:mid,size:[r,Math.hypot(dx,dy)/2+r*.35,r],turn:Math.atan2(-dx,dy),color,inspect:name});};
  ell([0,h*.42,0],[h*.10,h*.12,h*.085],skin,'Head · life-stage outline');ell([0,h*.305,0],[h*.04,h*.055,h*.045],skin,'Neck outline');
  things.push({shape:'profile',at:[0,0,0],points:[[-.04*h,.31*h,-.02],[-.14*h,.27*h,-.02],[-.13*h,.12*h,-.02],[-.09*h,-.05*h,-.02],[-.13*h,-.18*h,-.02],[.13*h,-.18*h,-.02],[.09*h,-.05*h,-.02],[.13*h,.12*h,-.02],[.14*h,.27*h,-.02],[.04*h,.31*h,-.02]],size:[1,1,h*.10],color:blue,inspect:'Clothed torso · life-stage outline'});
  for(const side of[-1,1]){const shoulder:V=[side*.14*h,.26*h,0],elbow:V=[side*.22*h,.04*h,0],wrist:V=[side*.25*h,-.17*h+.015*h*Math.sin(time*2),0];limb(shoulder,elbow,.045*h,blue,'Upper arm outline');limb(elbow,wrist,.033*h,skin,'Forearm outline');ell([wrist[0],wrist[1]-.035*h,.02],[.032*h,.055*h,.022*h],skin,'Hand outline');const hip:V=[side*.07*h,-.16*h,0],knee:V=[side*.075*h,-.34*h,0],ankle:V=[side*.08*h,-.49*h,0];limb(hip,knee,.053*h,dark,'Upper leg outline');limb(knee,ankle,.037*h,dark,'Lower leg outline');ell([ankle[0],ankle[1]-.015*h,.025*h],[.045*h,.024*h,.07*h],dark,'Shoe outline');ell([side*.035*h,.44*h,.083*h],[.008*h,.008*h,.005*h],dark,'Eye guide');ell([side*.10*h,.42*h,.01],[.020*h,.035*h,.025*h],skin,'Ear outline');}
  label([0,-1.8,.1],'Life-stage outline · individual development varies',cream);
 }
 if(kind==='force'){
  const s0=forceMotion(0,p.ua,p.ub,p.uc),duration=Math.abs(s0.a)>1e-9?Math.min(2,Math.sqrt(3/Math.abs(s0.a))):2,s=forceMotion(u*duration,p.ua,p.ub,p.uc),x=s.x;
  for(let j=0;j<12;j++)tube([[-2.2+j*.4,-.48,.51],[-2.2+j*.4,-.43,.51]],cream,.008,'Track graduation');
  for(const side of[-1,1])box([x+side*.19,-.47,.19],[.10,.06,.35],dark,'Block contact shoe');
  if(p.ua!==0){const side=Math.sign(p.ua),ax=side*2.4;box([ax,.05,0],[.18,.6,.5],dark,'External actuator symbol','metal');box([ax,-.34,0],[.1,.2,.3],dark,'Actuator stand');box([ax,-.44,0],[.4,.12,.7],dark,'Actuator support foot');tube([[x+side*.3,-.1,.1],[ax,-.1,.1]],cream,.014,'Applied-force coupling');arrow([ax,.70,.1],[ax-p.ua*.12,.70,.1],rose,'Third-law partner on actuator');}
  label([0,-1.65,.1],'Partner forces act on different bodies',rose);
 }
 if(kind==='collision'){
  const s=collision(u*(3.6/p.uc+.4),p.ua,p.ub,p.uc,p.ud);
  for(const x of[s.x1*.6,s.x2*.6]){ring([x,-.37,Math.sqrt(.12**2-.095**2)+.001],.095,cream,'Impact-body contour');}
  for(let j=0;j<13;j++)tube([[-2.4+j*.4,-.48,.51],[-2.4+j*.4,-.43,.51]],cream,.008,'Track graduation');
 }
 if(kind==='cradle'){
  for(let j=0;j<5;j++){const n=Math.round(p.ua)+1,points=Array.from({length:17},(_,k)=>{const t=Math.max(0,time-(16-k)*.025),phase=t*2,active=Math.cos(phase)>=0?j<n:j>=5-n,shift=active?-.45*Math.cos(phase):0;return[-.64+j*.32+shift,-.5+shift*shift/3,.04] as V});if(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0]))>1e-5){tube(points,blue,.008,'Recent bob position trail');things[things.length-1].opacity=.4;}}
  for(const x of[-1.32,1.32])for(const z of[-.36,.36])ell([x,-1.18,z],[.10,.035,.09],dark,'Frame foot');
 }
 if(kind==='rotation'&&p.ud<.5){
  for(let j=0;j<16;j++){const a=j/16*Math.PI*2;tube([[p.ua*Math.cos(a),p.ua*Math.sin(a),-.02],[(p.ua+.05)*Math.cos(a),(p.ua+.05)*Math.sin(a),-.02]],cream,.007,'Angular position tick');}
  ell([0,0,0],[.06,.06,.08],dark,'Fixed rotation axis');
  const end=time,history=Array.from({length:25},(_,j)=>{const t=Math.max(0,end-(24-j)*.04),a=p.ub*t;return[p.ua*Math.cos(a),p.ua*Math.sin(a),.06] as V});if(p.ub!==0)tube(history,blue,.016,'Recent position trail');
 }
 if(kind==='lever'){
  const s=lever(u*5,p.ua,p.ub,p.uc,p.ud);for(const x of[-p.uc,p.ud]){const at:V=[x*Math.cos(s.theta),x*Math.sin(s.theta),.10];ring(at,.045,cream,'Load attachment eye');}
  for(let j=-5;j<=5;j++){const x=j*.2;if(x>=-p.uc&&x<=p.ud)tube([[x*Math.cos(s.theta),x*Math.sin(s.theta),.08],[x*Math.cos(s.theta),x*Math.sin(s.theta)+.06,.08]],cream,.007,'Beam distance mark');}
  ell([0,0,.06],[.065,.065,.065],dark,'Pivot bearing');
 }
 if(kind==='orbit'){
  const initial=orbit(0,p.ua,p.ub),days=u*initial.period,scale=2.1/p.ua;
  const trail=Array.from({length:33},(_,j)=>{const q=orbit(Math.max(0,days-(32-j)*initial.period/240),p.ua,p.ub);return[q.x*scale,.03,q.y*scale] as V});tube(trail,blue,.018,'Recent orbital arc');
  const q=orbit(days,p.ua,p.ub),pos:V=[q.x*scale,0,q.y*scale];arrow(pos,[pos[0]*.8,0,pos[2]*.8],rose,'Inward gravitational direction');
  label([0,-1.05,0],'Gravity points toward the star at a focus',rose);
 }
 return{...base,things,flows,focus:[...new Set(things.flatMap(t=>t.inspect?[t.inspect]:[]))]};
}

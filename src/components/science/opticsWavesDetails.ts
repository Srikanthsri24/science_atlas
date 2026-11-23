import type{World,Thing,V}from'../universe/world';import type{UniverseParameters}from'../../lib/universeTypes';
import{drivenOscillator,fringe,pendulumWave}from'../../lib/physicsExtensionModels';import{conduction,echo}from'../../lib/universeModels';
import{conductionClock,slitLayout,reverbClock}from'../../lib/waveThermalPresentation';
export function opticsWavesDetails(kind:string,p:UniverseParameters,time:number,base:World):World{
 if(!['planemirror','waveoptics','eye','echo','sonar','reverb','pendarray','resonator','doppler','conduction','expansion'].includes(kind))return base;
 const things:Thing[]=base.things.map(t=>({...t})),flows=[...base.flows],u=((time%6)+6)%6/6,steel='#7e929c',blue='#8bbac9',gold='#dfc58a',rose='#c88e98',dark='#506773';
 const line=(points:V[],color:string,radius=.012,inspect?:string)=>things.push({shape:'tube',at:[0,0,0],points,color,radius,inspect});
 const box=(at:V,size:V,color:string,inspect:string,opacity=1)=>things.push({shape:'box',at,size,color,inspect,opacity});
 const ell=(at:V,size:V,color:string,inspect:string)=>things.push({shape:'ellipsoid',at,size,color,inspect});
 const label=(at:V,text:string,color=gold)=>things.push({shape:'text',at,text,color});
 const arrow=(a:V,b:V,color:string,inspect:string)=>things.push({shape:'arrow',at:a,points:[a,b],color,inspect});
 if(kind==='planemirror'){
  for(let j=0;j<12;j++)line([[.04,-1.35+j*.24,-.20],[.18,-1.22+j*.24,-.20]],steel,.008,'Mirror backing hatch');
  for(const side of[-1,1]){line([[side*.05,-1.45,.35],[side*p.ua,-1.45,.35]],steel,.008,'Object-image distance ruler');label([side*p.ua/2,-1.7,.35],`${p.ua.toFixed(2)} m`,side<0?gold:rose);}
  const angle=Math.atan(.5/p.ua);for(const side of[-1,1])line(Array.from({length:25},(_,j)=>{const a=side*angle*j/24;return[-.45*Math.cos(a),.45*Math.sin(a),.36]as V}),side<0?blue:gold,.008,'Equal angles at central normal');
  label([-1.2,1.5,.35],`θᵢ = θᵣ = ${(angle*180/Math.PI).toFixed(1)}°`);
 }
 if(kind==='waveoptics'){
  const mode=Math.round(p.ua);if(mode<2){
   const {halfWidth,centres}=slitLayout(p.uc,p.ud,mode===0);
   flows.length=0;for(const y of centres)flows.push({points:[[-2,y,.3],[-.8,y,.3]],color:gold,count:3,speed:.3});
   for(let i=things.length-1;i>=0;i--)if(['Slit screen','Slit opening'].includes(things[i].inspect??''))things.splice(i,1);
   let start=-1.4;for(const y of centres){const end=y-halfWidth;if(end>start)box([-.8,(start+end)/2,0],[.08,end-start,.4],dark,'Opaque slit barrier');start=y+halfWidth;}
   if(start<1.4)box([-.8,(start+1.4)/2,0],[.08,1.4-start,.4],dark,'Opaque slit barrier');
   // Replace generic wavefronts so their source follows the selected, enlarged aperture centres.
   for(let i=things.length-1;i>=0;i--)if(things[i].shape==='tube'&&!things[i].inspect&&things[i].radius===.008)things.splice(i,1);
   for(const y of centres)for(let j=0;j<5;j++){const r=((u+j/5)%1)*2;line(Array.from({length:41},(_,i)=>{const a=-Math.PI/2+i/40*Math.PI;return[-.7+r*Math.cos(a),y+r*Math.sin(a),.10]as V}),blue,.008,'Staged outgoing wavefront');}
   const y=-1.4+u*2.8,s=fringe(p.ub,p.uc,p.ud,y*.006,mode===0);
   line([[2.05,-1.4,.4],[2.05,1.4,.4]],steel,.008,'Intensity zero reference');ell([2.05+s.intensity*.8,y,.42],[.035,.035,.035],rose,'Intensity sampling probe');
   label([0,-1.8,.3],`Sample ${(y*6).toFixed(2)} mm · I/I₀ ${s.intensity.toFixed(3)}`,blue);
   box([-.8,-1.65,0],[.65,.12,1.1],steel,'Slit carrier foot');label([-.9,1.9,.3],'Apertures enlarged; screen scale 6 mm/unit',steel);
  }else if(mode===2){
   const vertices:V[]=[[-.8,-.7,.42],[.8,-.7,.42],[0,.685640646,.42],[-.8,-.7,.42]];line(vertices,steel,.014,'Prism front edges');
   box([0,-.85,0],[1.9,.12,.9],dark,'Prism mounting plate');
   const entry:V=[-.5,-.180384758,.43];line([[entry[0]-.55*Math.cos(-Math.PI/6),entry[1]-.55*Math.sin(-Math.PI/6),.43],[entry[0]+.55*Math.cos(-Math.PI/6),entry[1]+.55*Math.sin(-Math.PI/6),.43]],steel,.007,'First-face normal');
   label([0,1.25,.4],'450 / 550 / 650 nm · common 55° incidence',blue);
  }
 }
 if(kind==='eye'){
  for(const sign of[-1,1])box([-.65,sign*.48,.2],[.08,.24,.25],dark,'Iris aperture guide');
  line([[.68,.25,-.1],[1.05,.15,-.1],[1.45,.30,-.1]],gold,.08,'Optic nerve landmark');
  label([0,-1.7,.2],'Reduced optical eye · not detailed ocular anatomy',steel);
 }
 if(kind==='echo'||kind==='sonar'){
  for(let j=0;j<9;j++){const x=-1.6+j*.4;line([[x,-1.05,.15],[x,-1.15,.15]],steel,.009,'Range graduation');}
  const distance=p.ua,speed=kind==='echo'?echo(p.ua,p.ub).speed:1480;
  label([0,-1.8,.15],`d = cΔt/2 · ${distance.toFixed(0)} m · c ${speed.toFixed(1)} m/s`,blue);
  if(kind==='sonar')box([-1.7,-.55,0],[.6,.18,.8],dark,'Transducer mount');
 }
 if(kind==='reverb'){
  const t=reverbClock(time,p.ua),rt=.161*p.ua/p.ub;
  for(let j=0;j<5;j++)box([-1.72+j*.12,.85,.4],[.07,.75,.08],blue,'Illustrative acoustic treatment panel');
  label([0,-1.9,.2],`A ${p.ub.toFixed(0)} m² · t/RT₆₀ ${(t/rt).toFixed(2)}`,blue);
 }
 if(kind==='pendarray'){
  box([0,-1.45,0],[4.35,.15,1.1],dark,'Pendulum array base');
  for(const x of[-2,2])for(const z of[-.35,.35])ell([x,-1.57,z],[.12,.045,.10],steel,'Array levelling foot');
  for(let j=0;j<9;j++){const s=pendulumWave(j,p.ub,p.ua);label([-1.65+j*.41,.67,.07],String(j+1),steel);if(j===0||j===8)label([j===0?-1.65:1.63,-.97,.1],`L ${s.length.toFixed(3)} m`,blue);}
  label([0,-1.95,.1],`Physical elapsed ${time.toFixed(2)} / ${p.ua.toFixed(0)} s`,gold);
 }
 if(kind==='resonator'){
  const s=drivenOscillator(p.ua,p.ub,time),maximum=drivenOscillator(s.peakRatio,p.ub,0).gain;
  line(Array.from({length:101},(_,j)=>[-2.15+j/100*4.3,-1.8+.65*drivenOscillator(j/50,p.ub,0).gain/maximum,.2]as V),blue,.014,'Steady-state amplitude response');
  ell([-2.15+p.ua/2*4.3,-1.8+.65*s.gain/maximum,.22],[.04,.04,.04],rose,'Selected drive frequency on response curve');
  line([[-2.15,-1.8,.2],[2.15,-1.8,.2]],steel,.007,'Frequency-ratio axis');
  label([0,-2.05,.2],'ω/ω₀: 0 → 2 · amplitude normalized to this curve peak',steel);
  const x=s.x*2;box([1.55,0,0],[.65,.18,.24],steel,'Viscous damper body');line([[x+.18,0,.02],[1.25,0,.02]],gold,.025,'Damper piston rod');
  if(Math.abs(s.velocity)>1e-8)arrow([x,-.40,.25],[x-Math.sign(s.velocity)*.35,-.40,.25],rose,'Damping opposes velocity');
 }
 if(kind==='doppler'){
  const wavelength=343/p.ub,fore=(343-p.ua)/p.ub,aft=(343+p.ua)/p.ub;
  line([[-1.9,-2,.1],[-1.9+fore/wavelength*1.1,-2,.1]],rose,.02,'Ahead relative wavelength');
  line([[.25,-2,.1],[.25+aft/wavelength*1.1,-2,.1]],blue,.02,'Behind relative wavelength');
  label([0,-2.45,.1],`λ ahead ${fore.toFixed(3)} m · behind ${aft.toFixed(3)} m`,steel);
 }
 if(kind==='conduction'){
  const t=conductionClock(time,p.uc),s=conduction(t,p.ua,p.ub,p.uc,p.ud),loss=p.uc*900*(p.ua-s.left);
  for(const side of[-1,1]){const value=side<0?s.left:s.right;box([side*1.75,-.1,.45],[.09,1.6,.08],steel,'Temperature scale backing');box([side*1.75,-.9+value/100*.8,.51],[.045,Math.max(.001,value/100*1.6),.03],side<0?rose:blue,'Temperature column');}
  for(let j=0;j<6;j++)line([[-.16,-.35+j*.14,.55],[.16,-.35+j*.14,.55]],steel,.007,'Thermal contact fins');
  label([0,-1.5,.2],`Left loss = right gain = ${loss.toFixed(1)} J`,blue);
  label([0,-1.85,.2],`Shared reference clock: ${t.toFixed(0)} s`,steel);
 }
 if(kind==='expansion'){
  for(const x of[-.5-p.ua/2,-.5+p.ua/2])box([x,-.95,0],[.22,.35,.7],steel,'Bench foot');
  box([-2.5,.65,0],[.65,1.45,.08],dark,'Model extension readout panel');
  const amount=p.ua*p.uc*1e-6*p.ub*u*1000;label([-2.5,1.65,.1],'Staged ΔL',steel);label([-2.5,.8,.12],`${amount.toFixed(3)} mm`,gold);
  if(p.ub===0)flows.length=0;
 }
 return{...base,things,flows,focus:[...new Set(things.flatMap(t=>t.inspect?[t.inspect]:[]))]};
}

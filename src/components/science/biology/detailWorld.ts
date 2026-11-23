import{fluidFieldDetails}from'../fluidFieldDetails';
import{laboratoryDetails}from'../laboratoryDetails';
import{plantGeneticsDetails}from'./plantGeneticsDetails';
import type { World, Thing, V } from '../../universe/world';
import type { UniverseParameters } from '../../../lib/universeTypes';
import { elbow } from '../../../lib/livingModels';

// Original teaching geometry. Added anatomy is illustrative, never a new numerical solver.
export const biologyPreviewKinds = ['classification','cellstructure','mitosis','tissues','microbe','evolution','joint','neuron','bodyatlas','reflex','digestion','tooth','breathing','nephron','endocrine','senses','reproduction','immune','tropism','planttransport','photosynthesis','transpiration','flower','husbandry','animals','geneticcode','genetics','pcr','recombinant','ecosystem','foodweb','population','pollution','cycles','food','nutrition','hygiene','projectile','freefall','force','spring','collision','cradle','rotation','lever','orbit','capillary','motor','magnet','centrifuge','hydrostatic','transformer','escape','circuit','buoyancy','bernoulli','induction'] as const;
export const hasBiologyDetail = (kind:string) => (biologyPreviewKinds as readonly string[]).includes(kind);
export function biologyDetails(kind:string,p:UniverseParameters,time:number,base:World):World {
 if(!hasBiologyDetail(kind))return base;
 const things:Thing[]=base.things.map(t=>({...t})),flows=[...base.flows];
 const rose='#bc838d',ivory='#dcd5b6',jade='#91b7a0',purple='#a18fae',red='#c67873',blue='#75a5b7',dark='#526b70';
 const line=(points:V[],color:string,radius=.012,inspect?:string)=>things.push({shape:'tube',at:[0,0,0],points,color,radius,inspect});
 const ell=(at:V,size:V,color:string,inspect:string,opacity=1,turn=0)=>things.push({shape:'ellipsoid',at,size,color,inspect,opacity,turn});
 const loop=(at:V,rx:number,ry:number,color:string,inspect:string,z=0)=>line(Array.from({length:33},(_,j)=>{const a=j/32*Math.PI*2;return[at[0]+rx*Math.cos(a),at[1]+ry*Math.sin(a),at[2]+z] as V}),color,.012,inspect);
 const veins=(a:V,b:V,color:string,inspect:string)=>{line([a,b],color,.012,inspect);for(let i=1;i<6;i++){const u=i/6,x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u;for(const s of[-1,1])line([[x,y,a[2]],[x+(b[0]-a[0])*.12,y+s*.09,a[2]]],color,.006,inspect)}};
 const membrane=(at:V,rx:number,ry:number,inspect:string)=>{for(let j=0;j<36;j++){const a=j/36*Math.PI*2;ell([at[0]+rx*Math.cos(a),at[1]+ry*Math.sin(a),at[2]],[.018,.018,.018],ivory,inspect)}};
 const mode=Math.round(p.ua);
 if(kind==='classification'){
  if(mode===0){for(const s of[-1,1])veins([s*.08,-.15,.13],[s*.8,.05,.13],dark,'Leaf veins');for(const s of[-1,1])for(let j=0;j<4;j++)line([[0,-.8,0],[s*(.2+j*.12),-1-j*.07,.04]],ivory,.015,'Branching roots');}
  if(mode===1){for(const s of[-1,1]){ell([-.94+s*.10,.36,.23],[.035,.048,.025],dark,'Cat eye');for(let j=0;j<3;j++)line([[-.99,.18,.22],[-1.27,.17+(j-1)*.07,.25]],ivory,.006,'Whisker')}ell([-1.05,.23,.25],[.05,.03,.035],rose,'Nose');}
  if(mode===2)for(let j=0;j<17;j++){const a=j/17*2*Math.PI;line([[.12*Math.cos(a),.43,.12*Math.sin(a)],[.78*Math.cos(a),.40,.45*Math.sin(a)]],ivory,.008,'Mushroom gill')}
  if(mode===3)membrane([0,0,.28],.88,.39,'Bacterial surface');
  if(mode===4){for(let j=0;j<9;j++)line(Array.from({length:22},(_,k)=>{const a=k/21*Math.PI*2;return[.58*Math.cos(a),.83*Math.sin(a),.12+j*.015] as V}),ivory,.005,'Seed coat contour');}
  if(mode===6){for(let i=0;i<things.length;i++){const t=things[i];if(t.inspect==='Combustion region'){const x=t.at[0],y=t.at[1],h=(t.size?.[1]??.4)*2,lean=.05*Math.sin(time*3+i);things[i]={shape:'profile',at:[0,0,0],points:[[x-.13,y-h*.4,.1],[x-.17,y-h*.1,.1],[x-.1,y+h*.2,.1],[x+lean,y+h*.65,.1],[x+.08,y+h*.15,.1],[x+.13,y-h*.1,.1],[x+.1,y-h*.4,.1]],size:[1,1,.08],color:t.color,opacity:.82,inspect:'Combustion region'}}}}
  if(mode===5)for(let j=0;j<7;j++)line([[-.7+j*.15,-.34,.31],[-.5+j*.15,.28,.36]],ivory,.007,'Mineral texture guide');
 }
 if(kind==='cellstructure'){
  if(mode!==2){for(let j=0;j<6;j++){const y=.45-j*.13;line(Array.from({length:26},(_,k)=>{const a=-.2+k/25*Math.PI*1.4;return[-.8+.75*Math.cos(a),.1+.62*Math.sin(a)+y*.1,.25+j*.035] as V}),purple,.026,'Folded ER membrane')}
   for(let j=0;j<11;j++){const a=j/11*2*Math.PI;loop([-.8+.51*Math.cos(a),.1+.51*Math.sin(a),.57],.028,.028,ivory,'Nuclear pore')}
   for(const x of[-1.2,.9])for(let j=0;j<7;j++)line([[x-.24+j*.075,-.70,.38],[x-.23+j*.075,-.56,.40]],ivory,.008,'Mitochondrial crista');
  }
  membrane([0,0,.48],mode===1?1.95:2,mode===1?1.3:1.05,'Membrane surface proteins');
 }
 if(kind==='microbe'){
  if(mode===0)membrane([0,0,.3],.85,.35,'Envelope proteins');
  if(mode===1)for(let j=0;j<24;j++){const a=j*2.399,y=1-(j+.5)/12,r=Math.sqrt(1-y*y);ell([.76*r*Math.cos(a),.76*y,.76*r*Math.sin(a)],[.035,.035,.035],rose,'Envelope protein')}
  if(mode===2){for(let j=0;j<7;j++)line(Array.from({length:22},(_,k)=>{const a=k/21*Math.PI*2;return[.57*Math.cos(a),.76*Math.sin(a),.25+j*.015] as V}),jade,.006,'Yeast wall lamella');}
  if(mode===3)for(let j=0;j<14;j++){const a=j*2.399,r=.15+.35*(j%4)/4;ell([r*Math.cos(a),r*Math.sin(a),.28],[.025,.025,.025],ivory,'Cytoplasmic granule')}
 }
 if(kind==='evolution'){
  const generation=Math.min(50,Math.floor((((time%6)+6)%6)/6*51));
  const history=things.find(t=>t.shape==='tube'&&t.points?.length===51);
  if(history?.points){const complete=history.points;history.points=complete.slice(0,Math.max(2,generation+1));line(complete,dark,.006,'Full model trajectory reference');}
 }
 if(kind==='joint'){
  const angle=p.uc>.5?p.ua:p.ua*(.5-.5*Math.cos(time*1.4)),s=elbow(angle,p.ub),end:V=[...s.forearm,0];
  for(const dx of[-.08,.08]){ell([dx,.1,.01],[.10,.13,.12],ivory,'Humeral condyle');line([[dx,-.09,-.06],[end[0]+dx,end[1],-.06]],ivory,.036,dx<0?'Radius guide':'Ulna guide')}
  for(let j=0;j<7;j++){const off=(j-3)*.014;line([[s.origin[0]+off,s.origin[1],.24],[s.insertion[0]+off,s.insertion[1],.24]],rose,.006,'Parallel muscle fibres')}
  loop([0,0,.14],.19,.20,blue,'Joint capsule');
 }
 if(kind==='digestion'){
  if(mode===0){
   const replace=(name:string,points:V[],depth:number,color:string)=>{const i=things.findIndex(t=>t.inspect===name);if(i>=0)things[i]={shape:'profile',at:[0,0,0],points,size:[1,1,depth],color,inspect:name}};
   replace('Stomach',[[-.32,.73,.12],[-.4,.62,.12],[-.48,.55,.12],[-.65,.58,.12],[-.83,.52,.12],[-.98,.38,.12],[-.99,.18,.12],[-.9,.02,.12],[-.72,-.03,.12],[-.51,.01,.12],[-.35,.12,.12],[-.26,.28,.12],[-.20,.36,.12],[-.08,.34,.12],[-.05,.42,.12],[-.22,.49,.12],[-.3,.57,.12]],.35,rose);
   replace('Liver',[[.04,.69,.02],[.26,.83,.02],[.62,.82,.02],[.99,.67,.02],[1.13,.51,.02],[.94,.37,.02],[.66,.33,.02],[.38,.42,.02],[.06,.46,.02],[-.04,.57,.02]],.32,'#a87560');
   line([[.48,.72,.20],[.51,.48,.20],[.65,.36,.20]],dark,.012,'Liver lobe division guide');
   line([[0,.80,.2],[-.10,.72,.2],[-.31,.72,.2]],rose,.067,'Oesophageal entry');
   line([[-.08,.37,.2],[.16,.24,.2],[.12,.04,.2],[0,-.1,.2]],ivory,.065,'Duodenal connection');
   line([[0,-.95,.2],[-.60,-1.03,.2],[-.9,-.85,.1]],ivory,.06,'Ileocaecal connection guide');
   if(flows[0])flows[0]={...flows[0],points:[[0,1.55,.35],[0,.8,.35],[-.31,.72,.35],[-.6,.35,.35],[-.08,.37,.35],[.16,.24,.35],[.12,.04,.35],[0,-.1,.35],...flows[0].points.slice(4)]};

for(let j=0;j<7;j++)line([[-.82+j*.07,.15,.39],[-.87+j*.07,.35,.40],[-.73+j*.07,.51,.39]],rose,.012,'Stomach rugae');
   for(let j=0;j<12;j++){const y=-.15-j*.062,x=Math.sin(j*.8)*.5;line([[x-.04,y,.28],[x,y+.055,.32],[x+.04,y,.28]],ivory,.008,'Intestinal wall fold')}
  }
  // A contraction ring travels down the oesophagus; illustrative, not transit-rate data.
  const y=1.45-(time%3)/3*.8;loop([0,y,.2],.09,.025,ivory,'Peristaltic contraction');
 }
 if(kind==='tooth'){
  const roots=mode===2?[-.25,.25]:[0];for(const x of roots){for(let j=0;j<8;j++){const y=-.15-j*.12;line([[x-.06,y,.31],[x-.18,y-.04,.30]],ivory,.006,'Dentine tubule');line([[x+.06,y,.31],[x+.18,y-.04,.30]],ivory,.006,'Dentine tubule')}
   line([[x-.05,-1,.31],[x-.06,-.4,.32],[0,.35,.32]],red,.012,'Pulp arterial supply');line([[x+.05,-1,.32],[x+.06,-.4,.33],[.05,.35,.33]],blue,.012,'Pulp venous return');}
  for(let j=0;j<5;j++)line([[-.65,-.35-j*.14,.06],[.65,-.35-j*.14,.06]],jade,.008,'Alveolar bone section');
 }
 if(kind==='tissues'){
  if(mode===0)for(let j=0;j<8;j++){const x=-1.4+j*.4;for(let k=0;k<5;k++)line([[x-.12+k*.06,.3,.16],[x-.12+k*.06,.39,.16]],ivory,.005,'Apical microvillus')}
  if(mode===1)for(let j=0;j<5;j++){const x=-.9+j*.45;for(const s of[-1,1])line([[x,Math.sin(j)*.45,.2],[x+s*.18,Math.sin(j)*.45+s*.13,.25]],purple,.008,'Fibroblast process')}
  if(mode===2){const L=2.8-.6*(1-Math.cos(time*3))/2;for(let j=0;j<5;j++)for(const s of[-1,1])ell([s*(L/2-.13),-.7+j*.35,.19],[.08,.035,.025],purple,'Peripheral muscle nucleus')}
  if(mode===4)for(const t of base.things.filter(t=>t.inspect==='Meristematic cell'))loop([t.at[0],t.at[1],.16],.22,.22,ivory,'Cell wall junction');
 }
 if(kind==='bodyatlas'){
  if(mode===1){for(let j=0;j<11;j++){const y=-.58+j*.043;line(Array.from({length:20},(_,k)=>[.35+k/19*.72,y+.03*Math.sin(k*.3),.34] as V),rose,.010,'Cerebellar folia')}
   for(const s of[-1,1])line([[s*.2,-.1,.6],[s*.35,.3,.66],[s*.65,.65,.47],[s*.85,.8,.28]],red,.014,'Surface vessel guide');
  }else{line([[.12,.58,.34],[.12,.95,.29],[-.1,1.05,.22],[-.17,.3,.30],[-.14,-.45,.22]],red,.018,'Aortic route guide');line([[.27,-.45,.20],[.28,.4,.27],[.17,.58,.30]],blue,.018,'Venous return guide');for(const s of[-1,1])line([[-.14,.08,.22],[s*.34,-.1,.12]],red,.014,'Renal artery guide')}
 }
 if(kind==='reflex'){
  for(const t of base.things.filter(t=>t.inspect==='Reflex pathway')){const pts=t.points!;for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j];if(j===3)continue;for(let k=0;k<3;k++){const u=(k+.4)/3;ell(a.map((v,i)=>v+(b[i]-v)*u) as V,[.10,.06,.06],ivory,'Myelin segment')}}}
  ell([.05,.35,.16],[.04,.04,.03],ivory,'Central canal guide');
 }
 if(kind==='nephron'){
  for(let j=0;j<8;j++){const a=j/8*Math.PI*2;line(Array.from({length:20},(_,k)=>{const b=k/19*2*Math.PI;return[-1.5+.24*Math.cos(b),.8+.2*Math.sin(b)*Math.cos(a),.17+.1*Math.sin(a)] as V}),red,.014,'Glomerular capillary tuft')}
  line([[-2,.9,.1],[-1.76,.9,.1]],red,.045,'Afferent arteriole');line([[-1.76,.7,.1],[-1.2,.3,.15],[-.82,-1.2,.15],[.30,-1.62,.15],[.86,-1,.15],[.9,.5,.15]],red,.022,'Peritubular capillary guide');
  for(let j=0;j<6;j++)line([[-.15+j*.05,.65-j*.05,.10],[-.09+j*.05,.65-j*.05,.20]],ivory,.008,'Tubule brush border');
 }
 if(kind==='endocrine'){
  for(let j=0;j<12;j++){const a=j*2.399;ell([-1+.34*Math.cos(a)*(j%3+1)/3,.12*Math.sin(a),.20],[.055,.045,.04],rose,'Pancreatic islet cell')}
  for(let j=0;j<5;j++){const y=-.22+j*.11;ell([.72,y,.22],[.028,.028,.028],purple,'Target membrane receptor')}
  line([[-1.5,-.36,.1],[-.6,-.36,.1],[.8,-.36,.1],[1.5,-.36,.1]],red,.026,'Circulating hormone route');
 }
 if(kind==='senses'){
  if(mode===0){loop([-.42,.3,.62],.10,.10,blue,'Iris');ell([-.42,.3,.65],[.035,.055,.025],dark,'Pupil')}
  if(mode===1){for(let j=0;j<4;j++)loop([.72,.1,.14+j*.015],.11,.21,rose,'Pinna fold')}
  if(mode===2)for(let j=0;j<5;j++)ell([-.7+(j-2)*.045,-.5,.44],[.02,.03,.018],ivory,'Representative skin receptor');
  if(mode===3)for(const s of[-1,1])ell([s*.055,-.04,.75],[.025,.03,.015],dark,'Nostril');
  if(mode===4)for(let j=0;j<8;j++)ell([-.14+j*.04,-.35,.63],[.012,.015,.012],rose,'Tongue papilla');
 }
 if(kind==='reproduction'){
  if(mode===0){for(let j=0;j<6;j++)line([[-.34+j*.12,.28,.27],[-.28+j*.10,-.45,.27]],rose,.010,'Uterine lining fold');for(const s of[-1,1])for(let j=0;j<5;j++)line([[s,.4,.05],[s*(1.08+j*.025),.27+j*.04,.07]],rose,.013,'Tubal fimbria')}
  if(mode===1)for(const s of[-1,1])line(Array.from({length:60},(_,j)=>[s*.3+.10*Math.cos(j*.8),-.85+j/59*.3,.12+.035*Math.sin(j*.8)] as V),ivory,.009,'Coiled seminiferous tubule guide');
  if(mode===2||mode===4)membrane([.65,0,.35],.49,.49,'Zona boundary guide');
 }
 if(kind==='immune'){
  for(let j=0;j<12;j++){const a=j/12*2*Math.PI;ell([.7+.36*Math.cos(a),.36*Math.sin(a),.17],[.035,.035,.03],jade,'Leukocyte membrane')}
  if(mode===0)for(let j=0;j<6;j++)ell([-1.7,-.8+j*.31,.24],[.12,.14,.04],ivory,'Barrier epithelial cell');
  if(mode>0){const x=-.7+((time%6)+6)%6/6*.8;for(let j=0;j<7;j++){const a=j/7*Math.PI*2;ell([x+.11*Math.cos(a),.2+.11*Math.sin(a),.1],[.025,.025,.025],red,'Antigen surface epitope')}}
 }
 if(kind==='tropism'){
  const stem=base.things.find(t=>t.inspect==='Growing shoot');if(stem?.points){for(let j=3;j<stem.points.length-2;j+=4){const a=stem.points[j];for(const s of[-1,1])line([[a[0]+s*.055,a[1]-.03,.045],[a[0]+s*.055,a[1]+.06,.045]],ivory,.008,'Elongating cell file')}
   const tip=stem.points.at(-1)!;for(const s of[-1,1])veins([tip[0],tip[1]-.1,.10],[tip[0]+s*.5,tip[1]-.1,.10],dark,'Leaf venation');}
 }
 return fluidFieldDetails(kind,p,time,laboratoryDetails(kind,p,time,plantGeneticsDetails(kind,p,time,{...base,things,flows,focus:[...new Set(things.flatMap(t=>t.inspect?[t.inspect]:[]))]})));
}

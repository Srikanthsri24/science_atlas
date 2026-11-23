import type { World,Thing,V } from '../../universe/world';
import type { UniverseParameters } from '../../../lib/universeTypes';
import { transpiration } from '../../../lib/universeModels';

export function plantGeneticsDetails(kind:string,p:UniverseParameters,time:number,base:World):World {
 const supported=['cellstructure','planttransport','transpiration','tropism','flower','tissues','husbandry','digestion','animals','reproduction','reflex','geneticcode','pcr','recombinant','ecosystem'];
 if(!supported.includes(kind))return base;
 const things:Thing[]=base.things.map(t=>({...t})),flows=[...base.flows];
 const green='#91b79a',cream='#dbd5b1',rose='#c38992',gold='#d6bb7f',purple='#a593b4',blue='#7ab8c8',dark='#4d6a68';
 const tube=(points:V[],color:string,radius=.012,inspect?:string)=>things.push({shape:'tube',at:[0,0,0],points,color,radius,inspect});
 const ell=(at:V,size:V,color:string,inspect:string,opacity=1,turn=0)=>things.push({shape:'ellipsoid',at,size,color,inspect,opacity,turn});
 const label=(at:V,text:string,color=cream)=>things.push({shape:'text',at,text,color});
 const ring=(at:V,rx:number,ry:number,color:string,inspect:string)=>tube(Array.from({length:33},(_,j)=>{const a=j/32*Math.PI*2;return[at[0]+rx*Math.cos(a),at[1]+ry*Math.sin(a),at[2]] as V}),color,.009,inspect);
 const veins=(at:V,rx:number,ry:number,turn=0)=>{const point=(x:number,y:number):V=>[at[0]+x*Math.cos(turn)-y*Math.sin(turn),at[1]+x*Math.sin(turn)+y*Math.cos(turn),at[2]];tube([point(-rx*.88,0),point(rx*.88,0)],dark,.009,'Leaf midrib');for(let j=-3;j<=3;j++)for(const s of[-1,1]){const x=j*rx*.20;tube([point(x-rx*.17,0),point(x,s*ry*Math.sqrt(1-(x/rx)**2)*.88)],dark,.005,'Reticulate leaf vein')}};
 const mode=Math.round(p.ua),phase=(((time%6)+6)%6)/6;
 if(kind==='cellstructure'&&mode===1){
  for(const x of[-1.3,1.3]){ring([x,.7,.34],.30,.15,cream,'Chloroplast envelope');for(let j=0;j<3;j++)tube([[x-.20+j*.15,.6,.34],[x-.20+j*.15,.79,.34]],green,.009,'Intergranal membrane guide')}
  for(let j=0;j<7;j++)tube([[-1.9,-1.2+j*.4,.48],[-1.75,-1.2+j*.4,.48]],cream,.010,'Plant wall lamella');
 }
 if(kind==='planttransport'){
  // Distinct conduits, with their original source/sink flow directions retained.
  for(let j=0;j<19;j++){const y=-1.45+j*.15;ring([0,y,.1],.065,.028,cream,'Xylem wall thickening');}
  for(let j=0;j<5;j++){const y=-1.35+j*.55;tube([[.14,y,.13],[.24,y,.13]],purple,.018,'Phloem sieve plate');for(let k=0;k<3;k++)ell([.16+k*.025,y,.15],[.007,.007,.007],dark,'Sieve pore');}
  ell([.34,-.10,.02],[.08,.75,.08],green,'Companion cell',.7);ell([.34,.2,.11],[.025,.05,.02],purple,'Companion-cell nucleus');
  for(const y of[-.1,1])for(const side of[-1,1])veins([side*.7,y,.22],.60,.18);
  for(const side of[-1,1])for(let j=0;j<6;j++){const x=side*(.3+j*.08);tube([[x,-1.5-j*.04,.08],[x+side*.12,-1.7-j*.04,.08]],cream,.008,'Root hair');}
 }
 if(kind==='transpiration'){
  for(const t of base.things.filter(t=>t.inspect==='Leaf'))veins([t.at[0],t.at[1],.19],.68,.22,t.turn??0);
  // Enlarged lower-epidermis section: aperture follows the actual stomatal control.
  const centre:V=[1.55,-1.15,.20],gap=.015+Math.max(0,Math.min(1,p.uc))*.11;
  for(const s of[-1,1]){ell([centre[0]+s*(.10+gap),centre[1],.2],[.11,.25,.09],green,'Guard cell',.9,s*.12);for(let j=0;j<3;j++)ell([centre[0]+s*(.12+gap),centre[1]-.13+j*.13,.29],[.02,.03,.015],dark,'Guard-cell chloroplast');}
  label([1.55,-1.63,.2],'Stoma · enlarged',green);
  const state=transpiration(p.ua,p.ub,p.uc,p.ud);if(state.mlHour>1e-10)flows.push({points:[[1.55,-1.15,.35],[1.7,-.8,.35],[1.9,-.55,.35]],color:blue,count:3,speed:.18});
 }
 if(kind==='flower'){
  for(const t of base.things.filter(t=>t.inspect==='Petal')){const a=t.turn??0;for(let j=-1;j<=1;j++)tube([[t.at[0]-.3*Math.cos(a),t.at[1]-.3*Math.sin(a),t.at[2]+.14],[t.at[0]+.25*Math.cos(a)-j*.08*Math.sin(a),t.at[1]+.25*Math.sin(a)+j*.08*Math.cos(a),t.at[2]+.14]],rose,.006,'Petal vein');}
  for(const t of base.things.filter(t=>t.inspect==='Anther'))for(let j=0;j<5;j++){const a=j/5*Math.PI*2;ell([t.at[0]+.065*Math.cos(a),t.at[1]+.035*Math.sin(a),.13],[.017,.017,.017],gold,'Representative pollen grain');}
  if(mode===3)for(let j=0;j<9;j++)tube([[-.32+j*.08,-.55,.24],[-.30+j*.07,-.70,.24]],cream,.006,'Seed coat detail');
 }
 if(kind==='tissues'&&mode>=4){
  if(mode===4)for(const cell of base.things.filter(t=>t.inspect==='Meristematic cell')){tube([[cell.at[0]-.3,cell.at[1]+.3,.15],[cell.at[0]+.3,cell.at[1]+.3,.15]],cream,.009,'Adjacent cell wall');}
  else for(let j=0;j<15;j++){const y=-1.15+j*.17;ring([-.7,y,.22],.21,.045,cream,'Spiral xylem thickening');}
 }
 if(kind==='husbandry'){
  if(mode===0){for(let j=0;j<5;j++)tube([[-.6+j*.28,.32,.20],[-.64+j*.28,-.18,.29]],cream,.007,'Coat contour');}
  if(mode===1)for(const fish of base.things.filter(t=>t.inspect==='Fish')){const [x,y,z]=fish.at;tube([[x-.08,y+.05,z+.09],[x-.10,y,z+.10],[x-.08,y-.05,z+.09]],dark,.006,'Gill-cover guide');}
  if(mode===2)for(let j=0;j<6;j++)tube([[.02+j*.06,.15,.30],[.18+j*.04,-.15,.31]],cream,.007,'Wing feather');
  if(mode===3)for(const bee of base.things.filter(t=>t.inspect==='Honey bee'))for(const dx of[-.04,.03])tube([[bee.at[0]+dx,bee.at[1]-.055,.07],[bee.at[0]+dx,bee.at[1]+.055,.07]],dark,.01,'Abdominal stripe');
  if(mode===4)for(const segment of base.things.filter(t=>t.inspect==='Silkworm larva segment'))ring([segment.at[0],segment.at[1],.11],.09,.09,cream,'Larval segment fold');
 }
 if(kind==='digestion'&&mode===1){
  const rumen:V=[-.8,.2,.42];for(let j=0;j<12;j++){const a=j*2.399,r=.12+.24*(j%3)/3;ell([rumen[0]+r*Math.cos(a),rumen[1]+r*Math.sin(a),.42],[.035,.06,.025],green,'Rumen papilla guide',.85,a);}
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){const x=-.36+col*.09,y=.31+row*.09;tube(Array.from({length:7},(_,j)=>[x+.05*Math.cos(j*Math.PI/3),y+.05*Math.sin(j*Math.PI/3),.37] as V),cream,.006,'Reticulum honeycomb fold');}
  for(let j=0;j<7;j++)tube([[.2+j*.04,.20,.36],[.19+j*.04,.52,.36]],rose,.012,'Omasal leaf fold');
  for(let j=0;j<5;j++)tube([[.50+j*.1,-.05,.36],[.54+j*.1,.15,.36]],cream,.008,'Abomasal gastric fold');
 }
 if(kind==='animals'){
  if(mode===2){for(let j=0;j<5;j++)tube([[.72,0,.15],[1.27,.35-j*.17,.15]],cream,.009,'Fin ray');for(let row=0;row<3;row++)for(let col=0;col<7;col++)ring([-.5+col*.17,-.22+row*.2,.29],.07,.045,blue,'Scale guide');}
  if(mode===1)for(const s of[-1,1])for(let j=0;j<5;j++)tube([[.05,.12,s*.35],[.3+j*.08,.07,s*(.5+j*.07)]],cream,.01,'Flight feather guide');
  if(mode===3)for(let j=0;j<5;j++)ring([.50+j*.09,0,.32],.06,.25,purple,'Abdominal segment');
 }
 if(kind==='reproduction'&&mode===4){
  // External-fertilization example: vitelline envelope, not a mammalian zona pellucida.
  for(const t of things)if(t.inspect==='Zona boundary guide')t.inspect='Egg envelope · representative';
  ring([.65,0,.37],.56,.56,blue,'Egg extracellular envelope');
 }
 if(kind==='reflex')label([0,-1.55,.1],'One illustrative circuit · behaviour involves wider networks',cream);
 if(kind==='geneticcode'){
  if(mode===0){
   for(let j=0;j<17;j++)for(const sign of[-1,1]){const x=-1.8+j/16*3.6,a=j/16*8*2*Math.PI/10.5+time*.15;ell([x,sign*.65*Math.cos(a),sign*.65*Math.sin(a)],[.040,.040,.040],sign===1?purple:blue,'Sugar–phosphate backbone marker');}
   flows.length=0;label([0,-1.65,.1],'Inspection rotation · not a literal molecular trajectory',cream);
  }else if(mode===1){const x=-1.8+Math.min(.999,phase)*3.6;ell([x,.05,.10],[.25,.40,.18],green,'RNA polymerase guide',.32);tube([[x,-.1,.3],[x-.12,-.42,.3],[x-.35,-.72,.3]],gold,.018,'Emerging RNA guide');}
  else for(let j=0;j<3;j++)ell([-.7+j*.7,-.7,.30],[.075,.075,.075],rose,'Peptide backbone guide',phase>(j+1)/4?.9:.12);
 }
 if(kind==='pcr'){
  const stage=p.ud>.5?Math.round(p.ud)-1:Math.floor(phase*3),sep=stage===0?.45:stage===1?.4:.18;
  for(let j=0;j<12;j++)for(const sign of[-1,1])ell([-1.3+j*.23,sign*sep,.07],[.025,.025,.025],sign<0?blue:purple,'Template backbone unit');
  if(stage===2){const q=p.ud>.5?(phase*5)%1:(phase*3)%1;ell([-.8+2.1*q,-sep,.22],[.14,.12,.10],green,'Polymerase extension-front guide',.7);ell([.8-2.1*q,sep,.22],[.14,.12,.10],green,'Polymerase extension-front guide',.7);}
  // Previous free-floating bottom traffic did not depict any PCR step.
  flows.length=0;label([0,-1.35,.1],'Template · primer · new strand · staged molecular geometry',cream);
  const cycles=base.metrics.find(m=>m.label==='Completed model cycles')?.value??'0';label([0,1.95,.1],`Completed model cycles: ${cycles}`,gold);
 }
 if(kind==='recombinant'){
  const backbone=base.things.find(t=>t.inspect==='Plasmid backbone');if(backbone?.points)for(let j=0;j<backbone.points.length;j+=4)ell(backbone.points[j],[.025,.025,.025],cream,'Plasmid backbone unit');
  if(mode===1){for(const point of[backbone?.points?.[0],backbone?.points?.at(-1)])if(point)ell(point,[.09,.09,.06],rose,'Prepared DNA end guide',.7);}
  for(const t of things)if(t.inspect==='Process guide'){t.shape='text';t.at=[0,-1.35,.1];t.text='Staged construct inspection · not a protocol';t.color=cream;}
 }
 if(kind==='ecosystem'){
  const producer=base.things.find(t=>t.inspect==='Producer stem');if(producer){tube([[-1.9,-1,.01],[-2.05,-1.15,.05],[-2.15,-1.15,.05]],cream,.009,'Producer root');}
  for(const t of base.things.filter(t=>t.inspect==='Rabbit body')){ell([t.at[0]-.23,t.at[1]+.12,.1],[.018,.018,.018],dark,'Rabbit eye');}
  for(const t of base.things.filter(t=>t.inspect==='Hawk body'))for(let j=0;j<3;j++)tube([[t.at[0],t.at[1]+.04,.08],[t.at[0]+.22+j*.05,t.at[1]+.15-j*.06,.08]],rose,.009,'Hawk feather guide');
 }
 return{...base,things,flows,focus:[...new Set(things.flatMap(t=>t.inspect?[t.inspect]:[]))]};
}

import{settlingClock,motorSideVectors}from'../../lib/fluidFieldPresentation';
import type{World,Thing,V}from'../universe/world';
import type{UniverseParameters}from'../../lib/universeTypes';
import{capillary,motor,centrifuge,dipole}from'../../lib/universeModels';
import{hydrostatic,transformer}from'../../lib/physicsExtensionModels';
import{radialLaunch,worlds}from'../../lib/cosmosModels';

/** Original apparatus details and vector guides; numerical readouts keep their source models. */
export function fluidFieldDetails(kind:string,p:UniverseParameters,time:number,base:World):World{
 if(!['capillary','motor','magnet','centrifuge','hydrostatic','transformer','escape'].includes(kind))return base;
 const things:Thing[]=base.things.map(t=>({...t})),flows=[...base.flows],u=((time%6)+6)%6/6;
 const steel='#71858e',copper='#c69f72',liquid='#82b8c5',gold='#ddc58d',rose='#c78e91',ink='#4d646f';
 const tube=(points:V[],color:string,radius=.012,inspect?:string)=>things.push({shape:'tube',at:[0,0,0],points,color,radius,inspect});
 const box=(at:V,size:V,color:string,inspect:string,opacity=1)=>things.push({shape:'box',at,size,color,inspect,opacity});
 const ell=(at:V,size:V,color:string,inspect:string)=>things.push({shape:'ellipsoid',at,size,color,inspect});
 const label=(at:V,text:string,color=gold)=>things.push({shape:'text',at,text,color});
 const arrow=(a:V,b:V,color:string,inspect:string)=>things.push({shape:'arrow',at:a,points:[a,b],color,inspect});
 const ring=(at:V,r:number,color:string,inspect:string,plane:'xy'|'xz'='xy')=>tube(Array.from({length:49},(_,j)=>{const a=j/48*2*Math.PI;return plane==='xz'?[at[0]+r*Math.cos(a),at[1],at[2]+r*Math.sin(a)]:[at[0]+r*Math.cos(a),at[1]+r*Math.sin(a),at[2]] as V}),color,.009,inspect);
 if(kind==='capillary'){
  const s=capillary(p.ua,p.ub,p.uc),ease=u*u*(3-2*u),top=s.height*ease*Math.min(25,1.8/Math.max(.001,Math.abs(s.height))),r=.17,c=Math.cos(p.ub*Math.PI/180),R=r/Math.max(1e-8,Math.abs(c));
  for(let i=things.length-1;i>=0;i--)if(['Capillary wall','Liquid column','Liquid reservoir'].includes(things[i].inspect??'')||things[i].shape==='ring')things.splice(i,1);
  things.push({shape:'cylinder',at:[0,.1,0],radius:.205,size:[.41,4.2,.41],color:steel,opacity:.10,inspect:'Capillary glass tube'});
  box([0,-1.05,-.2],[3.2,2.1,1.2],liquid,'Liquid reservoir',.08);
  for(const z of[-.2,.2])tube([[-.20,-2,z],[-.20,2.2,z]],steel,.012,'Capillary glass wall');
  for(const x of[-.20,.20])tube([[x,-2,-.2],[x,2.2,-.2]],steel,.012,'Capillary glass wall');
  things.push({shape:'cylinder',at:[0,(-2+top)/2,0],radius:r,size:[r*2,Math.max(.001,top+2),r*2],color:liquid,opacity:.52,inspect:'Liquid column'});
  // Spherical-cap cross sections show wetting/depression; neither radius nor transient is a calibrated solver.
  for(let j=0;j<=16;j++){const q=r*j/16,dy=Math.abs(c)<1e-6?0:Math.sign(c)*(R-Math.sqrt(Math.max(0,R*R-q*q)));ring([0,top+dy,0],Math.max(.002,q),liquid,'Meniscus surface','xz');}
  tube(Array.from({length:33},(_,j)=>{const x=-r+j/32*2*r;return[x,top+Math.sign(c)*(R-Math.sqrt(Math.max(0,R*R-x*x))),.01] as V}),liquid,.008,'Meniscus cross-section guide');
  const angle=p.ub*Math.PI/180,contact:V=[1.35,.30,.4];tube([[1.35,-.45,.4],[1.35,1.15,.4]],steel,.018,'Enlarged contact wall');
  tube([contact,[1.35-.65*Math.sin(angle),.30-.65*Math.cos(angle),.4]],liquid,.016,'Liquid-side tangent');
  tube(Array.from({length:25},(_,j)=>[1.35-.35*Math.sin(angle*j/24),.30-.35*Math.cos(angle*j/24),.42] as V),gold,.008,'Contact angle through liquid');
  label([1.3,-.85,.4],`θ = ${p.ub.toFixed(0)}° · through liquid`);label([0,-2.55,0],'Meniscus/contact inset enlarged · height approach illustrative',steel);
 }
 if(kind==='motor'){
  const s=motor(u*12,p.ua,p.ub,p.uc,p.ud),phi=s.theta-Math.PI/2,rot=(v:V):V=>[v[0]*Math.cos(phi)+v[2]*Math.sin(phi),v[1],-v[0]*Math.sin(phi)+v[2]*Math.cos(phi)],pts=([[-.6,.8,0],[-.6,-.8,0],[.6,-.8,0],[.6,.8,0],[-.6,.8,0]] as V[]).map(rot);
  const coil=things.find(t=>t.inspect==='Current-carrying coil');if(coil)coil.points=pts;
  flows.length=0;if(p.ub!==0)flows.push({points:s.currentSign>0?pts:[...pts].reverse(),color:liquid,count:5,speed:.5});
  box([0,-1.65,0],[4.9,.18,2.5],ink,'Motor base');
  for(const y of[-.95,.95]){box([0,y,-.28],[.42,.13,.5],steel,'Shaft bearing');ring([0,y,.01],.12,steel,'Shaft collar','xz');}
  for(const sign of[-1,1]){const vector=motorSideVectors(s.theta,s.currentSign,sign),[x,,z]=vector.at,f=vector.force[2];
   if(p.ub!==0)arrow([x,0,z],[x,0,z+f*.6],rose,'Coil-side magnetic force');
   for(let j=0;j<3;j++)tube([rot([sign*(.6+j*.018),-.8,0]),rot([sign*(.6+j*.018),.8,0])],copper,.009,'Representative coil winding');
   box([sign*.36,-1.25,0],[.22,.12,.24],ink,'Stationary brush');
   tube([[sign*.45,-1.25,0],[sign*1.1,-1.25,0],[sign*1.1,-1.6,0]],sign<0?rose:liquid,.022,'Brush supply lead');
   tube(Array.from({length:25},(_,j)=>{const a=phi+(sign<0?0:Math.PI)+.12+j/24*(Math.PI-.24);return[.24*Math.cos(a),-1.25,.24*Math.sin(a)] as V}),copper,.037,'Split-ring commutator');
  }
  label([-2.2,1.45,0],'N',rose);label([2.2,1.45,0],'S',liquid);
  arrow([0,0,0],[.65*Math.cos(s.theta),0,-.65*Math.sin(s.theta)],steel,'Geometric reference normal');
  label([0,2.1,0],`θ(reference normal, B) ${(Math.acos(Math.cos(s.theta))*180/Math.PI).toFixed(0)}°`);
  label([0,-2.05,0],'Blue: current · rose: force directions (scaled)',liquid);
 }
 if(kind==='magnet'){
  const s=dipole(p.ua,p.ub,p.uc),at:V=[p.ub*1.65,p.uc*1.3,.15];ring(at,.28,steel,'Compass bezel');
  arrow(at,[at[0]-Math.cos(s.angle)*.55,at[1]-Math.sin(s.angle)*.55,.15],liquid,'Compass south end');
  ell([at[0],at[1],.16],[.035,.035,.04],gold,'Compass pivot');
  tube([[0,0,-.05],[at[0],at[1],-.05]],steel,.006,'Probe displacement guide');label([0,-1.75,0],'N → S outside · markers indicate field direction',steel);
 }
 if(kind==='centrifuge'){
  const transform=(v:V):V=>[v[0]*.75,v[1]*.75+.3,v[2]*.75];
  for(const t of things){if(t.shape==='text'){if(t.at[1]>2)t.at=[0,2.05,0];else t.at=[0,-1.4,0];}else{t.at=transform(t.at);if(t.points)t.points=t.points.map(transform);if(t.radius)t.radius*=.75;if(t.size)t.size=t.size.map(v=>v*.75)as V;}}
  const s=centrifuge(settlingClock(time,p.ua,p.ub,p.uc),p.ua,p.ub,p.uc,p.ud),x=-1.4+(s.radius-.03)/.05*2.8;
  box([0,-2.0,0],[3.5,.6,.65],ink,'Stationary radial inset backing');tube([[-1.4,-1.9,.36],[1.4,-1.9,.36]],liquid,.025,'Radial settling inset');
  for(let j=0;j<6;j++){const a=-1.4+j*.56;tube([[a,-2.0,.4],[a,-1.8,.4]],steel,.008,'Radial inset graduation');}
  ell([x,-1.9,.40],[.07,.07,.07],gold,'Same particle in co-rotating inset');
  label([0,-2.46,.35],`3 → 8 cm · η ${p.ud.toFixed(2)} mPa·s · slowed inset`,liquid);
  const theta=time*1.3;for(let i=0;i<4;i++){const a=theta+i*Math.PI/2,dir:V=[Math.cos(a),Math.sin(a),0];ring([dir[0]*1.76*.75,dir[1]*1.76*.75+.3,0],.15*.75,steel,'Sample-tube end');}
 }
 if(kind==='hydrostatic'){
  const s=hydrostatic(p.ua,p.ub,p.uc,p.ud),probe=1.2-p.ub*.55;
  if(p.uc===0)for(let i=things.length-1;i>=0;i--)if(['Applied force','Output force'].includes(things[i].inspect??''))things.splice(i,1);
  for(let i=0;i<=8;i++){const y=1.2-i*.275;tube([[-1.52,y,.32],[-1.40,y,.32]],steel,.009,'Depth ruler');if(i%2===0)label([-1.8,y,.32],`${i/2} m`,steel);}
  if(p.ub>0)for(const side of[-1,1])arrow([-1+side*.40,probe,.4],[-1+side*.15,probe,.4],gold,'Pressure acts inward on probe');
  box([.8,-1.10,0],[2.1,.15,1],ink,'Hydraulic apparatus base');
  for(const [x,r]of[[.2,.15],[1.4,.15*Math.sqrt(p.ud)]]as[number,number][])for(const side of[-1,1])tube([[x+side*r,-.8,.18],[x+side*r,.9,.18]],steel,.015,'Cylinder wall');
  label([.8,1.75,.1],`Δp ${(s.added/1000).toFixed(1)} kPa · equal elevation`,liquid);
  label([.8,-1.55,.1],`F₁ ${p.uc.toFixed(1)} N → F₂ ${s.force2.toFixed(1)} N`);
  // No circulation: highlight the imposed pressure together across the connected liquid.
  flows.length=0;const opacity=.25+.25*(1+Math.sin(time*2))/2;
  if(p.uc>0)tube([[.2,.3,.3],[.2,-.8,.3],[1.4,-.8,.3],[1.4,.3,.3]],gold,.025,'Pressure-increment highlight');
  if(p.uc>0)things[things.length-1].opacity=opacity;
 }
 if(kind==='transformer'){
  const s=transformer(p.ua,p.ub,p.uc,p.ud),phase=Math.sin(2*Math.PI*time),path:V[]=[[-.9,.6,.5],[.9,.6,.5],[.9,-.6,.5],[-.9,-.6,.5],[-.9,.6,.5]];
  flows.length=0;if(p.ua>0&&Math.abs(phase)>1e-6)flows.push({points:phase>0?path:[...path].reverse(),color:phase>0?liquid:gold,count:6,speed:.3,opacity:Math.abs(phase)});
  for(let j=0;j<6;j++)tube([[-1.2,-.8+j*.32,-.12],[1.2,-.8+j*.32,-.12]],steel,.005,'Core lamination guide');
  for(const side of[-1,1])for(const y of[-.55,.55])tube([[side*.9,y,.15],[side*1.65,y,.15],[side*1.65,y*1.6,.15]],side<0?liquid:copper,.022,'Winding lead');
  box([1.65,0,.15],[.18,.65,.18],copper,'Resistive secondary load');tube([[1.65,-.88,.15],[1.65,-.32,.15]],copper,.022,'Load connection');tube([[1.65,.32,.15],[1.65,.88,.15]],copper,.022,'Load connection');
  ring([-1.65,0,.15],.26,steel,'AC input source');tube([[-1.65,-.88,.15],[-1.65,-.26,.15]],liquid,.022,'Source lead');tube([[-1.65,.26,.15],[-1.65,.88,.15]],liquid,.022,'Source lead');
  tube(Array.from({length:25},(_,j)=>[-1.85+j*.4/24,.12*Math.sin(j/24*2*Math.PI),.17] as V),liquid,.012,'AC source symbol');
  label([0,1.75,.2],`N₂/N₁ ${(p.uc/p.ub).toFixed(2)} · V₂ ${s.v2.toFixed(1)} V RMS`);
  label([0,-1.6,.2],`Flux sign reverses · P₁ = P₂ = ${s.power.toFixed(2)} W`,steel);
 }
 if(kind==='escape'){
  const s=radialLaunch(Math.round(p.ua),p.ub,u*8),x=-1.4+Math.log(s.dimensionlessRadius)*1.1;
  flows.length=0; // The old unrelated horizontal traffic did not represent radial launch physics.
  if(!s.landed&&Math.abs(s.velocity)>1e-8)arrow([x,.22,0],[x+Math.sign(s.velocity)*.45,.22,0],gold,'Signed radial velocity');
  arrow([x,-.22,0],[x-.4,-.22,0],rose,'Inward gravitational attraction');
  label([0,1.6,0],`${worlds[Math.round(p.ua)].name} · v₀/vesc ${p.ub.toFixed(2)}`);
  label([0,-1.35,0],s.specificEnergy<0?'Negative energy: bound radial launch':'Nonnegative energy: unbound ideal launch',liquid);
 }
 return{...base,things,flows,focus:[...new Set(things.flatMap(t=>t.inspect?[t.inspect]:[]))]};
}

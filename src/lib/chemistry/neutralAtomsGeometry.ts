import {validateNeutralAtom,neutralAtomState,type NeutralAtomInputs} from './neutralAtoms';
export type AtomVector=[number,number,number];
export const neutralAtomDrawing={nucleonRadius:.13,electronRadius:.09,latticeStep:.3,shellRadii:[1.5,2.4,3.3],trayX:-6,trayY:{proton:-2.5,neutron:-.5,electron:1.5}} as const;
const clamp=(n:number)=>Math.max(0,Math.min(1,n)),smooth=(n:number)=>n*n*(3-2*n);
/** Arbitrary display coordinates. No fm/nm scale, nuclear packing, electron
 * orbit, electron position measurement or wavefunction is represented. */
export function neutralAtomsGeometry(raw:NeutralAtomInputs,seconds?:number,portrait=false){const q=validateNeutralAtom(raw),state=neutralAtomState(q),t=state.target,a=neutralAtomDrawing;if(seconds!==undefined&&(!Number.isFinite(seconds)||seconds<0||seconds>150))throw new RangeError('Guide time must be0–150seconds');
 if(seconds!==undefined)for(const[key,start,end,total]of [['protons',15,45,t.z],['neutrons',45,75,t.neutronTarget],['electrons',75,120,t.z]]as const){const expected=Math.floor(total*clamp((seconds-start)/(end-start))+1e-12);if(q[key]!==expected)throw new RangeError('Timed geometry requires the current guided token counts');}
 const lattice:AtomVector[]=[];for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++)for(let z=-3;z<=3;z++)lattice.push([x*a.latticeStep,y*a.latticeStep,z*a.latticeStep]);lattice.sort((p,q)=>p.reduce((s,v)=>s+v*v,0)-q.reduce((s,v)=>s+v*v,0)||p[0]-q[0]||p[1]-q[1]||p[2]-q[2]);
 const nucleus=lattice.slice(0,t.a),protonSites:AtomVector[]=[],neutronSites:AtomVector[]=[];for(let i=0;i<t.a;i++)(Math.floor((i+1)*t.z/t.a)>Math.floor(i*t.z/t.a)?protonSites:neutronSites).push(nucleus[i]);
 const electronSites=t.shells.flatMap((count,shell)=>Array.from({length:count},(_,slot)=>{const theta=2*Math.PI*slot/count+Math.PI/2;return{point:[a.shellRadii[shell]*Math.cos(theta),a.shellRadii[shell]*Math.sin(theta),0]as AtomVector,shell: shell+1,slot:slot+1}}));
 const group=(kind:'proton'|'neutron'|'electron',sites:AtomVector[],placedCount:number,start:number,end:number)=>sites.map((site,index)=>{const placed=index<placedCount,from:AtomVector=portrait?[({proton:-3.5,neutron:-1.2,electron:1.1}[kind])+(index%6)*.3,-5+Math.floor(index/6)*.3,0]:[a.trayX+(index%6)*.3,a.trayY[kind]+Math.floor(index/6)*.3,0],progress=placed?1:seconds===undefined?0:clamp((seconds-(start+(end-start)*index/sites.length))/((end-start)/sites.length)),p=smooth(progress),position=(progress===1?[...site]:progress===0?[...from]:from.map((v,j)=>v+(site[j]-v)*p))as AtomVector;
  // A visibly raised transfer arc is a token-placement demonstration only.
  if(progress>0&&progress<1)position[2]+=Math.sin(Math.PI*p)*.6;
  return {id:kind+'-'+(index+1),kind,index,site,from,position,progress,placed,inTransit:!placed&&progress>0&&progress<1,radius:kind==='electron'?a.electronRadius:a.nucleonRadius,shell:kind==='electron'?electronSites[index].shell:null};});
 const tokens=[...group('proton',protonSites,q.protons,15,45),...group('neutron',neutronSites,q.neutrons,45,75),...group('electron',electronSites.map(e=>e.point),q.electrons,75,120)];
 return{state,nucleus,protonSites,neutronSites,electronSites,tokens,placedTokens:tokens.filter(v=>v.placed).length,inTransitTokens:tokens.filter(v=>v.inTransit).length,trayTokens:tokens.filter(v=>!v.placed&&!v.inTransit).length,
  shellRadii:a.shellRadii.slice(0,t.shells.length),recordable:state.complete&&(seconds===undefined||seconds>=135),displayUnits:'arbitrary counting-diagram units'};
}
/** A separate flat hexagonal counting layout keeps every nuclear token
 * inspectable in 2D rather than projecting coincident 3D lattice sites. */
export function neutralAtomDiagramLayout(raw:NeutralAtomInputs,seconds?:number,portrait=false){const g=neutralAtomsGeometry(raw,seconds),points:AtomVector[]=[];for(let row=-6;row<=6;row++)for(let col=-6;col<=6;col++)points.push([(col+(Math.abs(row)%2)*.5)*.3,row*.3*Math.sqrt(3)/2,0]);points.sort((a,b)=>a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]||a[0]-b[0]||a[1]-b[1]);const nucleus=points.slice(0,g.state.target.a);
 return {...g,diagramNucleus:nucleus,tokens:g.tokens.map(token=>{const index=token.kind==='electron'?-1:g.nucleus.indexOf(token.site),site=index<0?token.site:nucleus[index],from:AtomVector=portrait?[({proton:-3.5,neutron:-1.2,electron:1.1}[token.kind])+(token.index%6)*.3,-5+Math.floor(token.index/6)*.3,0]:token.from,p=smooth(token.progress),position=(p===1?[...site]:p===0?[...from]:from.map((v,j)=>v+(site[j]-v)*p))as AtomVector;if(p>0&&p<1)position[1]+=Math.sin(Math.PI*p)*.6;return{...token,diagramSite:site,diagramFrom:from,diagramPosition:position}})};
}

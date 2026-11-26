import{classificationAtoms,classificationEntities,type ElementSymbol,type SpeciesId,type ClassificationInputs}from'./materialClassification';
export type ClassificationPoint=[number,number,number];
export interface ClassificationAtom {symbol:ElementSymbol;position:ClassificationPoint;radiusNm:number}
export interface ClassificationBond {a:number;b:number;order:number}
export interface ClassificationMolecule {atoms:ClassificationAtom[];bonds:ClassificationBond[];shape:string;geometryNote:string}
/** Atom spheres are chosen ball-and-stick glyphs, NOT van der Waals surfaces.
 * Coordinates use rounded gas-phase bond references in nm; fixed rigid geometry.
 * Ozone uses two equivalent1.5-order explanatory connections, not fixed resonance.
 */
const radii:Record<ElementSymbol,number>={He:.035,H:.022,C:.035,N:.032,O:.032};
const atom=(symbol:ElementSymbol,position:ClassificationPoint):ClassificationAtom=>({symbol,position,radiusNm:radii[symbol]});
function centre(atoms:ClassificationAtom[]){const mass=atoms.reduce((a,b)=>a+classificationAtoms[b.symbol].relativeMass,0),com=[0,1,2].map(i=>atoms.reduce((a,b)=>a+b.position[i]*classificationAtoms[b.symbol].relativeMass,0)/mass);return atoms.map(a=>({...a,position:a.position.map((v,i)=>v-com[i]) as ClassificationPoint}))}
const bent=(middle:ElementSymbol,end:ElementSymbol,length:number,degrees:number)=>{const t=degrees*Math.PI/360;return centre([atom(middle,[0,0,0]),atom(end,[-length*Math.sin(t),length*Math.cos(t),0]),atom(end,[length*Math.sin(t),length*Math.cos(t),0])])};
export function classificationMolecule(id:SpeciesId):ClassificationMolecule{if(id==='helium')return{atoms:[atom('He',[0,0,0])],bonds:[],shape:'monatomic',geometryNote:'One helium atom; no intramolecular bond'};
 if(id==='hydrogen'||id==='nitrogen'||id==='oxygen'){const symbol=id==='hydrogen'?'H':id==='nitrogen'?'N':'O',d=id==='hydrogen'?.0741:id==='nitrogen'?.1098:.1208;return{atoms:[atom(symbol,[-d/2,0,0]),atom(symbol,[d/2,0,0])],bonds:[{a:0,b:1,order:id==='hydrogen'?1:id==='nitrogen'?3:2}],shape:'linear diatomic',geometryNote:`Rounded reference bond length ${d.toFixed(4)} nm`}}
 if(id==='water'||id==='ozone'){const water=id==='water',d=water?.0958:.1278,angle=water?104.5:116.8;return{atoms:bent('O',water?'H':'O',d,angle),bonds:[{a:0,b:1,order:water?1:1.5},{a:0,b:2,order:water?1:1.5}],shape:'bent',geometryNote:`${d.toFixed(4)} nm bonds; ${angle}° angle${water?'':'; equivalent resonance-hybrid connections'}`}}
 if(id==='carbonDioxide')return{atoms:[atom('C',[0,0,0]),atom('O',[-.1162,0,0]),atom('O',[.1162,0,0])],bonds:[{a:0,b:1,order:2},{a:0,b:2,order:2}],shape:'linear triatomic',geometryNote:'Rounded C–O0.1162 nm; O–C–O180°'};
 if(id!=='methane')throw new RangeError('Known molecular reference required');const r=.1087/Math.sqrt(3),corners:ClassificationPoint[]=[[r,r,r],[r,-r,-r],[-r,r,-r],[-r,-r,r]];return{atoms:[atom('C',[0,0,0]),...corners.map(p=>atom('H',p))],bonds:corners.map((_,i)=>({a:0,b:i+1,order:1})),shape:'tetrahedral',geometryNote:'Rounded C–H0.1087 nm; ideal tetrahedral109.471°'};
}
/** Equivalent to Three Euler XYZ: apply local Z, then Y, then X. */
export function rotateClassificationPoint(p:ClassificationPoint,angles:ClassificationPoint):ClassificationPoint{const [a,b,c]=angles,[x,y,z]=p,x1=x*Math.cos(c)-y*Math.sin(c),y1=x*Math.sin(c)+y*Math.cos(c),x2=x1*Math.cos(b)+z*Math.sin(b),z2=-x1*Math.sin(b)+z*Math.cos(b);return[x2,y1*Math.cos(a)-z2*Math.sin(a),y1*Math.sin(a)+z2*Math.cos(a)]}
export function classificationWorldEntities(q:ClassificationInputs,magnification=30){if(!Number.isFinite(magnification)||magnification<1||magnification>40)throw new RangeError('Molecular glyph magnification1–40 required');return classificationEntities(q).map(e=>{const m=classificationMolecule(e.species);return{...e,...m,atoms:m.atoms.map(a=>{const r=rotateClassificationPoint(a.position,e.rotation);return{...a,position:r.map((v,i)=>e.position[i]+v*magnification) as ClassificationPoint,radiusNm:a.radiusNm*magnification}})}})}
/** Three fixed orthographic projections keep depth explicit, not a cross-section. */
export function classificationProjection(p:ClassificationPoint,view:'front'|'top'|'side'):ClassificationPoint{return view==='top'?[p[0],-p[2],p[1]]:view==='side'?[p[2],p[1],-p[0]]:p}
export const classificationCubeEdges=(side:number)=>{if(!Number.isFinite(side)||side<=0)throw new RangeError('Positive box edge required');const h=side/2,vertices:ClassificationPoint[]=Array.from({length:8},(_,i)=>[i&1?h:-h,i&2?h:-h,i&4?h:-h]);return vertices.flatMap((p,i)=>[1,2,4].filter(bit=>!(i&bit)).map(bit=>({a:p,b:vertices[i|bit]})))};

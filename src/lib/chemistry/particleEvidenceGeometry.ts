import{classificationMolecule,rotateClassificationPoint,type ClassificationPoint}from'./materialClassificationGeometry';
export type EvidenceAtom={id:number;element:'C'|'H'|'O';position:ClassificationPoint};
export const packetElements=['C','H','H','H','H','O','O','O','O']as const;
const add=(a:ClassificationPoint,b:ClassificationPoint)=>a.map((v,i)=>v+b[i])as ClassificationPoint;
const methane=classificationMolecule('methane'),oxygen=classificationMolecule('oxygen'),co2=classificationMolecule('carbonDioxide'),water=classificationMolecule('water');
/** Nine fixed element identities before/after one stoichiometric accounting packet.
 * Atom trajectories between endpoints are illustrative, not molecular dynamics.
 */
export function evidencePacket(progress:number,rotation=0,spacingRatio=1){if(!Number.isFinite(progress)||progress<0||progress>1||!Number.isFinite(rotation)||!Number.isFinite(spacingRatio)||spacingRatio<.5||spacingRatio>1.5)throw new RangeError('Packet progress0–1 and finite rotation');
 const initial:ClassificationPoint[]=[...methane.atoms.map(a=>add(a.position,[-.26*spacingRatio,0,0])),...oxygen.atoms.map(a=>add(a.position,[.12*spacingRatio,.16,0])),...oxygen.atoms.map(a=>add(a.position,[.12*spacingRatio,-.16,0]))];
 const end:ClassificationPoint[]=Array(9);end[0]=add(co2.atoms[0].position,[-.22,.07,0]);end[5]=add(co2.atoms[1].position,[-.22,.07,0]);end[6]=add(co2.atoms[2].position,[-.22,.07,0]);
 for(let j=0;j<2;j++){const centre:ClassificationPoint=[.16,j===0?.16:-.16,0];end[j===0?7:8]=add(water.atoms[0].position,centre);end[j===0?1:3]=add(water.atoms[1].position,centre);end[j===0?2:4]=add(water.atoms[2].position,centre);}
 const smooth=progress*progress*(3-2*progress),atoms:EvidenceAtom[]=packetElements.map((element,id)=>({id,element,position:rotateClassificationPoint(initial[id].map((v,k)=>v+(end[id][k]-v)*smooth)as ClassificationPoint,[.25,rotation,.15])}));
 const reactantBonds=[{a:0,b:1,order:1},{a:0,b:2,order:1},{a:0,b:3,order:1},{a:0,b:4,order:1},{a:5,b:6,order:2},{a:7,b:8,order:2}],productBonds=[{a:0,b:5,order:2},{a:0,b:6,order:2},{a:7,b:1,order:1},{a:7,b:2,order:1},{a:8,b:3,order:1},{a:8,b:4,order:1}];
 return{atoms,reactantBonds,productBonds,reactantOpacity:1-progress,productOpacity:progress,caption:progress===0?'CH₄ + 2O₂':progress===1?'CO₂ + 2H₂O':'Illustrative atom accounting transition · not a reaction intermediate'};
}
/** Two immutable composition references. The cursor compares the same atom ID;
 * it is a bookkeeping pointer, never a microscopic reaction trajectory.
 */
export function evidenceComparison(progress:number,rotation=0){if(!Number.isFinite(progress)||progress<0||progress>1)throw new RangeError('Comparison progress0–1');const selectedAtom=Math.min(8,Math.floor(progress*9)),local=progress===1?1:progress*9-selectedAtom;return{before:evidencePacket(0,rotation),after:evidencePacket(1,rotation),selectedAtom,cursorFraction:local,referenceNote:'Fixed reactant/product reference snapshots; current bulk composition is recorded separately.'}}

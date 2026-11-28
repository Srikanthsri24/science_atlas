import {formalIonState,validateFormalIon,type FormalIonInputs}from'./formalIons';import {completeNeutralAtom}from'./neutralAtoms';import {neutralAtomsGeometry,type AtomVector}from'./neutralAtomsGeometry';
/** Two counting panels and an explicit electron-in-transit marker. Grid slots
 * are inventory positions, NOT atomic orbitals or ion ground-state geometry. */
export function formalIonsGeometry(raw:FormalIonInputs,transferProgress=.5,portrait=false){const q=validateFormalIon(raw),s=formalIonState(q),z=s.protons;if(!Number.isFinite(transferProgress)||transferProgress<0||transferProgress>1)throw new RangeError('Transfer progress must be0–1');const atomCenter:AtomVector=portrait?[0,3.3,0]:[-3.8,0,0],reservoirCenter:AtomVector=portrait?[0,-3.3,0]:[3.8,0,0],atomSlot=(i:number):AtomVector=>[atomCenter[0]+(i%7-3)*.38,atomCenter[1]-.5-Math.floor(i/7)*.38,0],reservoirSlot=(i:number):AtomVector=>[reservoirCenter[0]+(i%8-3.5)*.38,reservoirCenter[1]+.2-Math.floor(i/8)*.38,0];
 const travellingId=q.transitDirection==='none'?null:q.transitDirection==='gain'?(q.transfer>=0?'R'+q.transfer:'A'+(z+q.transfer)):(q.transfer>0?'R'+(q.transfer-1):'A'+(z+q.transfer-1));
 const tokens=Array.from({length:z+20},(_,n)=>{const initialAtom=n<z,index=initialAtom?n:n-z,id=(initialAtom?'A':'R')+index;let owner:'atom'|'reservoir'|'transit'=initialAtom?'atom':'reservoir',slot=index;
  if(initialAtom&&q.transfer<0&&index>=z+q.transfer){owner='reservoir';slot=20+z-1-index;}else if(!initialAtom&&q.transfer>0&&index<q.transfer){owner='atom';slot=z+index;}
  const from=owner==='atom'?atomSlot(slot):reservoirSlot(slot);let destination=from,destinationPool:'atom'|'reservoir'=owner;
  if(id===travellingId){owner='transit';destinationPool=q.transitDirection==='gain'?'atom':'reservoir';const destinationSlot=initialAtom?(destinationPool==='atom'?index:20+z-1-index):(destinationPool==='atom'?z+index:index);destination=destinationPool==='atom'?atomSlot(destinationSlot):reservoirSlot(destinationSlot);}
  const p=owner==='transit'?transferProgress*transferProgress*(3-2*transferProgress):0,position=(owner!=='transit'||p===0?[...from]:p===1?[...destination]:from.map((v,j)=>v+(destination[j]-v)*p))as AtomVector;if(owner==='transit'&&p>0&&p<1)position[2]+=1.5*Math.sin(Math.PI*p);
  return{id,initialPool:initialAtom?'atom':'reservoir',owner,slot,from,destination,destinationPool,position,radius:.11};
 });
 const neutral=neutralAtomsGeometry(completeNeutralAtom(q.isotopeId));return{state:s,atomCenter,reservoirCenter,atomSlots:Array.from({length:z+3},(_,i)=>atomSlot(i)),reservoirSlots:Array.from({length:23},(_,i)=>reservoirSlot(i)),tokens,travellingId,
  nucleus:neutral.tokens.filter(t=>t.kind!=='electron').map(t=>({id:t.id,kind:t.kind,position:[t.site[0]+atomCenter[0],t.site[1]+atomCenter[1]+2.2,t.site[2]]as AtomVector,radius:t.radius})),
  atomTokenCount:tokens.filter(t=>t.owner==='atom').length,reservoirTokenCount:tokens.filter(t=>t.owner==='reservoir').length,transitTokenCount:tokens.filter(t=>t.owner==='transit').length,displayUnits:'arbitrary inventory-panel units'};
}

"""Independent exact integer transfer and Decimal charge accounts. No ion
configuration, affinity, reaction mechanism or stability claim is tested."""
import json,sys
from pathlib import Path
from validate_neutral_atoms import target,compare,E

def reference(q):
 t=target(q['isotopeId']);transfer=q['transfer'];direction=q['transitDirection'];assert type(transfer)is int and -min(3,t['z'])<=transfer<=3;assert direction in ['none','gain','loss'];assert not(direction=='gain'and transfer==3 or direction=='loss'and transfer==-min(3,t['z']))
 # Begin with the completed signed transfer, then take one travelling token
 # out of its source. It belongs to neither destination until arrival.
 atom=t['z']+transfer;reservoir=20-transfer;travelling=0
 if direction=='gain':reservoir-=1;travelling=1
 elif direction=='loss':atom-=1;travelling=1
 aq=t['z']-atom;rq=20-reservoir;tq=-travelling;total=atom+reservoir+travelling;notation=t['symbol']+(''if aq==0 else(str(abs(aq))if abs(aq)!=1 else'')+('+'if aq>0 else'−'))
 return dict(inputs=q,target=t,protons=t['z'],neutrons=t['neutronTarget'],massNumber=t['a'],initialAtomElectrons=t['z'],initialReservoirElectrons=20,fixedReservoirPositiveUnits=20,atomElectrons=atom,reservoirElectrons=reservoir,transitElectrons=travelling,atomElectronChange=atom-t['z'],reservoirElectronChange=reservoir-20,atomChargeUnits=aq,reservoirChargeUnits=rq,transitChargeUnits=tq,totalChargeUnits=0,atomPositiveChargeC=t['z']*E,atomElectronChargeC=-atom*E,atomChargeC=aq*E,reservoirChargeC=rq*E,transitChargeC=tq*E,totalChargeC=0*E,totalElectrons=total,initialTotalElectrons=t['z']+20,electronResidual=0,nucleonResidual=0,formalNotation=notation,chargeClass='neutral'if aq==0 else'cation count'if aq>0 else'anion count',transferComplete=travelling==0,status='Electron in transit — use all three charge accounts'if travelling else'Completed formal bookkeeping reference')
def validate(rows):return dict(formalStates=len(rows),fieldChecks=sum(compare(r['state'],reference(r['input']))for r in rows))
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

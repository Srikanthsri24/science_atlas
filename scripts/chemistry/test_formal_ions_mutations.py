import copy,json
from pathlib import Path
from validate_formal_ions import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0116/core-reference.json').read_text());base=next(r for r in rows if r['input']=={'isotopeId':'Na-23','transfer':0,'transitDirection':'loss'})
mutations={'erased-travelling-electron':('transitElectrons',0),'electron-counted-at-both-endpoints':('reservoirElectrons',21),'lost-reservoir-electron':('reservoirElectrons',19),'changed-proton-identity':('protons',10),'changed-neutron-identity':('neutrons',11),'changed-nucleon-count':('massNumber',22),'wrong-atomic-charge-sign':('atomChargeUnits',-1),'erased-small-coulomb-charge':('atomChargeC',0),'wrong-transit-charge':('transitChargeUnits',0),'created-electrons':('totalElectrons',32),'wrong-initial-electron-account':('initialTotalElectrons',30),'false-transfer-completion':('transferComplete',True),'unbalanced-total-charge':('totalChargeUnits',1),'wrong-formal-notation':('formalNotation','Na−'),'wrong-charge-class':('chargeClass','anion count'),'missing-electron-residual':('electronResidual',1)}
results=[]
for name,(key,value)in mutations.items():
 row=copy.deepcopy(base);assert row['state'][key]!=value;row['state'][key]=value
 try:validate([row])
 except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+name)
Path('reports/chemistry-expansion/CL-0116/core-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'core corruptions rejected')

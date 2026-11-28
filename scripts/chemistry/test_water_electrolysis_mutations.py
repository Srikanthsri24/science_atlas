import json,copy
from pathlib import Path
from validate_water_electrolysis import validate
p=Path('reports/chemistry-expansion/CL-0121');cases=json.loads((p/'core-reference-fixtures.json').read_text());checks=[]
def reject(name,predicate,key,value):
 c=copy.deepcopy(next(c for c in cases if predicate(c)));c['actual'][key]=value
 try:validate([c])
 except(AssertionError,TypeError,ValueError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
positive=lambda c:c['actual']['chargeC']>0
reject('charge erased on disconnection',lambda c:positive(c)and not c['inputs']['connected'],'chargeC',0)
reject('elapsed time mistaken for live source time',lambda c:len(c['inputs']['history'])>1,'elapsedS',0)
reject('electron stoichiometry wrong',positive,'electronMoles',1)
reject('hydrogen electron factor wrong',positive,'hydrogenMol',1)
reject('oxygen electron factor wrong',positive,'oxygenMol',1)
reject('ideal gas conversion wrong',positive,'hydrogenGeneratedMl',1)
reject('overflow lost',lambda c:c['actual']['hydrogenOverflowMl']>0,'hydrogenOverflowMl',0)
reject('capacity exceeded',lambda c:c['actual']['hydrogenOverflowMl']>0,'hydrogenRetainedMl',101)
reject('saturated retained ratio falsely 2',lambda c:c['actual']['retainedVolumeRatio']==1,'retainedVolumeRatio',2)
reject('empty gas ratio falsely 2',lambda c:c['actual']['generatedVolumeRatio']is None,'generatedVolumeRatio',2)
reject('small positive volume erased',positive,'oxygenGeneratedMl',0)
reject('disconnected current nonzero',lambda c:not c['inputs']['connected'],'activeCurrentA',1)
(p/'core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')

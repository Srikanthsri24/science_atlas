import copy,json
from pathlib import Path
from validate_oxide_neutral import validate
p=Path('reports/chemistry-expansion/CL-0125');cases=json.loads((p/'core-reference-fixtures.json').read_text());checks=[]
def reject(name,predicate,section,key,value):
 c=copy.deepcopy(next(c for c in cases if predicate(c)));c[section][key]=value
 try:validate([c])
 except(AssertionError,TypeError,ValueError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
positive=lambda c:c['actual']['extentMol']>0
reject('no-contact reaction invented',lambda c:not c['inputs']['contact'],'actual','extentMol',.001)
reject('acid factor of two lost',positive,'actual','acidConsumedMol',.123)
reject('copper stock erased',positive,'actual','copperIonMol',0)
reject('chloride spectator lost',lambda c:c['actual']['chlorideMol']>0,'actual','chlorideMol',0)
reject('unavailable copper solution pH fabricated',lambda c:True,'actual','acidPH',7)
reject('delivered base volume omitted',lambda c:c['actual']['baseDeliveredMl']>0,'actual','carbonVolumeL',.02)
reject('tiny positive stored volume erased',lambda c:0<c['actual']['baseStoredMl']<.00001,'actual','baseStoredMl',0)
reject('sodium amount not delivered',lambda c:c['carbon']['sodiumMol']>0,'carbon','sodiumMol',0)
reject('closed carbon created',lambda c:True,'carbon','finalCarbonMol',1)
reject('neutral carbon pool erased',lambda c:c['carbon']['neutralPoolMol']>0,'carbon','neutralPoolMol',0)
reject('bicarbonate equilibrium erased',lambda c:c['carbon']['bicarbonateMol']>0,'carbon','bicarbonateMol',0)
reject('carbonate equilibrium erased',lambda c:c['carbon']['carbonateMol']>0,'carbon','carbonateMol',0)
reject('zero-carbon equivalence ratio invented',lambda c:c['carbon']['baseEquivalentsPerCarbon']is None,'carbon','baseEquivalentsPerCarbon',0)
reject('pH set to neutral regardless of dose',lambda c:abs(c['carbon']['pH']-7)>1,'carbon','pH',7)
(p/'core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')

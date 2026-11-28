import copy,json
from pathlib import Path
from validate_metal_displacement import validate
p=Path('reports/chemistry-expansion/CL-0123');cases=json.loads((p/'core-reference-fixtures.json').read_text());checks=[]
def reject(name,predicate,field,value):
 c=copy.deepcopy(next(c for c in cases if predicate(c)));c['actual'][field]=value
 try:validate([c])
 except(AssertionError,TypeError,ValueError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
positive=lambda c:c['actual']['extentMol']>0
reject('reactivity order reversed',lambda c:c['actual']['eligible'],'eligible',False)
reject('self reaction invented',lambda c:c['inputs']['coupon']==c['inputs']['solution'],'extentMol',.001)
reject('reverse reaction invented',lambda c:not c['actual']['eligible'],'depositMassG',.1)
reject('no-contact conversion invented',lambda c:not c['inputs']['contact'],'extentMol',.001)
reject('tiny positive deposit erased',positive,'depositMassG',0)
reject('coupon dissolution missing',positive,'couponDissolvedG',0)
reject('target-ion inventory not consumed',positive,'targetRemainingMol',999)
reject('electron factor wrong',positive,'electronTransferMol',1)
reject('spectator sulfate removed',lambda c:c['actual']['sulfateMol']>0,'sulfateMol',0)
reject('cation charge conservation broken',lambda c:c['actual']['targetInitialMol']>0,'finalCationChargeEqMol',0)
reject('zero denominator given numeric conversion',lambda c:c['actual']['targetConversion']is None,'targetConversion',0)
reject('limiting reagent misclassified',positive,'limiting','not applicable')
c=copy.deepcopy(next(c for c in cases if positive(c)));c['species'][0]['finalTotalMol']+=1
try:validate([c])
except AssertionError:checks.append('element inventory corrupted')
else:raise AssertionError('Accepted element corruption')
(p/'core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')

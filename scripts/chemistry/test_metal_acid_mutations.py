import copy,json
from pathlib import Path
from validate_metal_acid import validate
p=Path('reports/chemistry-expansion/CL-0124');cases=json.loads((p/'core-reference-fixtures.json').read_text());checks=[]
def reject(name,predicate,key,value):
 c=copy.deepcopy(next(c for c in cases if predicate(c)));c['actual'][key]=value
 try:validate([c])
 except(AssertionError,ValueError,TypeError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
positive=lambda c:c['actual']['extentMol']>0
reject('copper hydrogen invented',lambda c:c['inputs']['metal']=='Cu','hydrogenMol',.01)
reject('no-contact reaction invented',lambda c:not c['inputs']['contact'],'extentMol',.01)
reject('hydrogen yield erased',positive,'hydrogenMol',0)
reject('acid factor of two lost',positive,'acidConsumedMol',.123)
reject('coupon dissolution erased',positive,'metalDissolvedG',0)
reject('chloride spectator missing',lambda c:c['actual']['chlorideMol']>0,'chlorideMol',0)
reject('positive charge lost',lambda c:c['actual']['positiveChargeEqMol']>0,'positiveChargeEqMol',0)
reject('gas volume unit error',positive,'generatedMl',10000)
reject('overflow lost',lambda c:c['actual']['overflowMl']>0,'overflowMl',0)
reject('collector retains more than capacity',lambda c:c['actual']['reliefOpen'],'retainedMl',999)
reject('zero acid conversion given numeric value',lambda c:c['actual']['acidConversion']is None,'acidConversion',0)
reject('limiting stock forged',positive,'limiting','unknown')
(p/'core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')

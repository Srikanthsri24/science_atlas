import json,copy
from pathlib import Path
from validate_copper_plating import validate
p=Path('reports/chemistry-expansion/CL-0122');cases=json.loads((p/'core-reference-fixtures.json').read_text());checks=[]
def reject(name,predicate,key,value):
 c=copy.deepcopy(next(c for c in cases if predicate(c)));c['actual'][key]=value
 try:validate([c])
 except(AssertionError,TypeError,ValueError):checks.append(name)
 else:raise AssertionError('Accepted corruption: '+name)
positive=lambda c:c['actual']['depositMassG']>0
reject('small positive deposited mass erased',positive,'depositMassG',0)
reject('requested charge falsely treated as passed after cutoff',lambda c:c['actual']['depleted'],'passedChargeC',9999)
reject('finite anode exhaustion ignored',lambda c:c['actual']['depleted'],'depleted',False)
reject('current continues after depletion',lambda c:c['actual']['depleted'],'activeCurrentA',1)
reject('anode loss missing',positive,'anodeLossG',0)
reject('cathode gain missing',positive,'cathodeGainG',0)
reject('bath creates net copper',positive,'bathNetCopperChangeMol',1)
reject('area unit conversion wrong',lambda c:True,'areaM2',1)
reject('coating thickness conversion wrong',positive,'thicknessMicrometre',1)
reject('coating density ignored',positive,'depositVolumeCm3',1)
reject('unserved coulomb budget lost',lambda c:c['actual']['unmetChargeDemandC']>0,'unmetChargeDemandC',0)
reject('disconnected history erased',lambda c:positive(c)and not c['inputs']['connected'],'passedChargeC',0)
reject('active duration includes disconnected time',lambda c:len(c['inputs']['history'])>1,'energizedS',9999)
(p/'core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')

import copy,json
from pathlib import Path
from validate_ionic_phase import validate
base=json.loads(Path('reports/chemistry-expansion/CL-0120/core-reference-fixtures.json').read_text());rejected=[]
def reject(label,predicate,field,value):
 case=copy.deepcopy(next(c for c in base if predicate(c)))
 case['actual'][field]=value
 try:validate([case])
 except (AssertionError,ValueError,TypeError):rejected.append(label)
 else:raise AssertionError('Accepted corruption: '+label)
reject('fabricated solid conductivity',lambda c:c['inputs']['phase']=='solid','solidConductivitySM',0)
reject('solid current despite fixed lattice',lambda c:c['inputs']['phase']=='solid','currentRmsA',1e-9)
reject('solid inverse reading fabricated',lambda c:c['inputs']['phase']=='solid','reconstructedConductivitySM',.140823)
reject('dry voltage erased',lambda c:c['inputs']['cell']['connected'] and c['inputs']['cell']['voltageRmsV']>0 and c['inputs']['cell']['immersedDepthCm']==0,'appliedVoltageRmsV',0)
wet=lambda c:c['inputs']['phase']!='solid' and c['actual']['readingAvailable']
reject('water current erased',lambda c:wet(c) and c['inputs']['phase']=='water','currentRmsA',0)
reject('inverse reading erased',wet,'reconstructedConductivitySM',None)
reject('current unit factor',wet,'currentRmsA',1)
reject('positive carrier direction reversed',lambda c:wet(c) and c['actual']['positiveIonDirection']==1,'positiveIonDirection',-1)
reject('negative carrier direction reversed',lambda c:wet(c) and c['actual']['negativeIonDirection']==-1,'negativeIonDirection',1)
reject('unavailable reading marked valid',lambda c:not c['actual']['readingAvailable'],'readingAvailable',True)
reject('reference molality conductivity changed',lambda c:wet(c) and c['inputs']['phase']=='solution','assignedSolutionConductivitySM',42)
Path('reports/chemistry-expansion/CL-0120/core-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(rejected),checks=rejected),indent=2)+'\n');print('PASS',len(rejected),'corruptions rejected')

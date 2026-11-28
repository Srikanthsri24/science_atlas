"""Independent Decimal aqueous-reference comparison plus explicit ideal solid contract."""
import json,sys
from pathlib import Path
from decimal import Decimal as D
from validate_solution_conductivity import reference

def expected(q):
 c=dict(q['cell']);c['sampleId']='water' if q['phase']=='water' else c['sampleId'];a=reference(c)
 solid=q['phase']=='solid'
 current=D(0) if solid else a['currentRmsA']
 available=False if solid else a['excited']
 return dict(appliedVoltageRmsV=a['cellVoltageRmsV'],instantVoltageV=a['instantVoltageV'],currentRmsA=current,instantCurrentA=D(0) if solid else a['instantCurrentA'],meanPowerW=a['cellVoltageRmsV']*current,positiveIonDirection=0 if solid else a['positiveIonDirection'],negativeIonDirection=0 if solid else a['negativeIonDirection'],externalElectronDirection=0 if solid else a['externalElectronDirection'],assignedSolutionConductivitySM=None if solid else a['conductivitySM'],reconstructedConductivitySM=a['reconstructedConductivitySM'] if available else None,measuredConductanceS=a['measuredConductanceS'] if available else None,solidConductivitySM=None,readingAvailable=available)
def validate(data):
 count=0
 for case in data:
  ex=expected(case['inputs']);actual=case['actual'];assert set(actual)==set(ex)
  for k,b in ex.items():
   a=actual[k]
   if b is None:assert a is None,(k,a,b)
   elif isinstance(b,bool):assert a is b,(k,a,b)
   else:
    assert type(a) in [int,float],(k,a)
    assert abs(D(str(a))-D(str(b)))<=abs(D(str(b)))*D('3e-14'),(k,a,str(b))
   count+=1
 return dict(circuits=len(data),typedFieldChecks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1] if len(sys.argv)>1 else 'reports/chemistry-expansion/CL-0120/core-reference-fixtures.json').read_text()))))

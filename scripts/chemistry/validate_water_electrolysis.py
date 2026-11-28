"""Independent 80-digit exact-SI charge/stoichiometry/dry-volume accounting."""
import json,sys
from pathlib import Path
from decimal import Decimal as D,getcontext
getcontext().prec=80
F=D('6.02214076e23')*D('1.602176634e-19');R=D('6.02214076e23')*D('1.380649e-23')
def reference(q):
 elapsed=sum((D(str(r['durationS']))for r in q['history']),D(0));charge=sum((D(str(r['currentA']))*D(str(r['durationS']))if r['connected']else D(0)for r in q['history']),D(0));electrons=charge/F;h=electrons/2;o=electrons/4;T=D(str(q['temperatureC']))+D('273.15');P=D(str(q['pressureKPa']))*1000;hv=h*R*T/P*1000000;ov=o*R*T/P*1000000;cap=D(str(q['capacityMl']));hr=min(cap,hv);orr=min(cap,ov)
 return dict(elapsedS=elapsed,chargeC=charge,electronMoles=electrons,hydrogenMol=h,oxygenMol=o,waterConsumedMol=h,temperatureK=T,pressurePa=P,hydrogenGeneratedMl=hv,oxygenGeneratedMl=ov,hydrogenRetainedMl=hr,oxygenRetainedMl=orr,hydrogenOverflowMl=max(D(0),hv-cap),oxygenOverflowMl=max(D(0),ov-cap),generatedVolumeRatio=hv/ov if ov else None,retainedVolumeRatio=hr/orr if orr else None,hydrogenFillFraction=hr/cap,oxygenFillFraction=orr/cap,activeCurrentA=D(str(q['currentA']))if q['connected']else D(0))
def validate(cases):
 count=0
 for case in cases:
  expected=reference(case['inputs']);a=case['actual'];assert set(a)==set(expected)
  for k,b in expected.items():
   if b is None:assert a[k]is None,(k,a[k])
   else:
    assert type(a[k])in [float,int]
    assert abs(D(str(a[k]))-b)<=abs(b)*D('4e-14'),(k,str(a[k]),str(b))
   count+=1
 return dict(sourceHistories=len(cases),typedFieldChecks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]if len(sys.argv)>1 else 'reports/chemistry-expansion/CL-0121/core-reference-fixtures.json').read_text()))))

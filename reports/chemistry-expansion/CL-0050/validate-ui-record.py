"""Independent rendered-table and actual report checks,without app imports."""
from pathlib import Path
import json,math
r=Path(__file__).parent;a=json.loads((r/'ui-trials-before-reload.json').read_text());b=json.loads((r/'ui-trials-after-reload.json').read_text());assert a==b and len(b)==31*18
written=json.loads((r/'ui-written-before-reload.json').read_text());assert written==json.loads((r/'ui-written-after-reload.json').read_text());assert written['notes'][6].startswith('At the exact computed drying time')
for i in range(31):
 q=b[i*18:(i+1)*18];t,V,A,B=map(float,q[1:5]);areas=[A,B];loss=[min(V,.02*area*t) for area in areas];remain=[V-x for x in loss]
 # Physical hours display six decimals;rounding can shift loss by <=1e-6g.
 for j,e in [(5,remain[0]),(6,remain[1]),(7,loss[0]),(8,loss[1]),(9,remain[0]/A),(10,remain[1]/B)]:assert abs(float(q[j])-e)<.000002,(i,j,q[j],e)
 for idx,area in enumerate(areas):
  reportedRemaining=float(q[5+idx]);actualRate=float(q[11+idx]);dryTime=V/(.02*area)
  if abs(t-dryTime)<=.00000051:assert actualRate in[0,.02*area] or abs(actualRate-.02*area)<1e-9
  else:assert abs(actualRate-(.02*area if reportedRemaining>0 else 0))<1e-9
  assert abs(float(q[13+idx])-float(q[7+idx])*2428)<.0013
 assert abs(float(q[16])-2*V)<1e-9
 if t==0:assert q[15]=='Undefined'
 else:assert abs(float(q[15])-float(q[7])/float(q[8]))<.000001
assert b[6*18+6]=='0' and b[6*18+12]=='0'
report=(r/'ui-exported-practical.html').read_text();assert report.count('Formula:')==775
for text in[written['prediction'],written['conclusion'],written['notes'][0],written['notes'][6]]:assert text in report
assert 'Manual 120-second playback spans 72 physical hours' in report
print('31 actual UI trials:remaining/lost mass,depths,current rates,latent energy,ratios and pair budgets independently verified within displayed-hour rounding;exact persistence and775 exported worked calculations passed.')

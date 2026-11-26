"""Independent checks of actual rendered trial cells and downloaded HTML."""
from pathlib import Path
import math,json
r=Path(__file__).parent;before=json.loads((r/'ui-trials-before-reload.json').read_text());after=json.loads((r/'ui-trials-after-reload.json').read_text());assert before==after and len(after)==37*19
written=json.loads((r/'ui-written-before-reload.json').read_text());assert written==json.loads((r/'ui-written-after-reload.json').read_text());assert written['notes'][0].startswith('Full 120 s guide:')
for i in range(37):
 c=after[i*19:(i+1)*19];t,V=float(c[1]),float(c[2]);v=min(t,V);a,ta,b,tb=map(float,[c[5],c[6],c[10],c[11]])
 for j,expected in [(3,v),(4,V-v),(7,ta+a*v),(8,a*v),(12,tb+b*v),(13,b*v),(15,v/(math.pi*2**2)),(16,a*V),(17,b*V)]:assert abs(float(c[j])-expected)<=.0000006,(i,j,c[j],expected)
 for j,rho in [(9,a),(14,b)]:
  if v==0:assert c[j]=='Undefined'
  else:assert abs(float(c[j])-rho)<.0000006
report=(r/'ui-exported-practical.html').read_text();assert report.count('Formula:')==740
for text in [written['prediction'],written['conclusion'],written['notes'][0]]:assert text in report
assert '16.000000 g / 20.000000 mL' in report and 'Not defined for an empty sample' in report
# The deliberate tare reversal must preserve the opposite liquid-mass ordering.
c=after[3*19:4*19];assert float(c[7])>float(c[12]) and float(c[8])<float(c[13])
print('37 actual UI trials:407 derived or undefined readings verified;exact37-row/note/prediction/conclusion reload;downloaded report contains740 worked steps and correct partial-volume/empty-sample cases.')

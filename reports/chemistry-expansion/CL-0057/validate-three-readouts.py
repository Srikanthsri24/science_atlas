import json,math,re
from pathlib import Path
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 assert v['pageWidth']<=v['width'];assert v['visibleHeight']>=69.9;assert v['canvasMatchesWrapper'];assert v['readoutsInside'] and v['notesInside']
 qs=[v['inputs']['a']]+([v['inputs']['b']] if v['inputs']['paired'] else[])
 rows=re.findall(r'Sample ([AB]) · suspended ([\d.]+) mg \+ bed ([\d.]+) mg · T ([\d.]+)% · side ([\d.]+) mW',v['readout']);assert len(rows)==len(qs)
 for i,(q,row) in enumerate(zip(qs,rows)):
  C,k,a,d,L,I,t=[q[n] for n in ['initialSuspendedMgL','settlingRateSInv','colourAbsorptionMInv','dilutionFactor','pathCm','sourceMw','timeS']];L/=100;susp=C/d*math.exp(-k*t);bed=C/d*.1*(-math.expm1(-k*t));s=.1*susp;T=100*math.exp(-(s+a/d)*L);side=I*.01*s*L*math.exp(-(s+a/d+.02)*L)
  for x,y,tol in zip(row[1:],[susp*.1,bed,T,side],[.000051,.000051,.000501,.00000051]):assert abs(float(x)-y)<=tol,(q,x,y)
print(f'PASS:{len(states)} actual3D readouts independently match optical/mass quantities;visiblecanvas wrappers andexpandednotes contained')

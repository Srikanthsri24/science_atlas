"""Validate actual DOM geometry against independent polygon-frustum integration."""
import json,math,re,runpy
from pathlib import Path
p=Path(__file__).parent
cases=[json.loads(s) for s in (p/'responsive-and-rendered.jsonl').read_text().splitlines()]
a=math.acos(-math.sqrt(3.5**2-.75**2)/3.5)
profile=[(4.1-3.5*math.cos(a*i/64),3.5*math.sin(a*i/64)) for i in range(65)];profile.append((profile[-1][0]+3,.75))
k=96*math.sin(2*math.pi/96)/2
reference=runpy.run_path(str(p/"validate-ui-record.py"))["reference"]
checks=0;readings=0;curvepoints=0
for c in cases:
 assert c['documentWidth']<=c['width']+1,(c['label'],'overflow')
 assert c['canvas']['w']>100 and c['canvas']['h']>100,(c['label'],'collapsed')
 assert c['canvas']['w']<=c['root']['w']+1,(c['label'],'canvas overflow')
 if c.get('sourceVolume') is not None:
  r=['0',c['time'],'100','160','.5','1.5','20','50'];ref=reference(r)
  for key,value in [('sourceTemperature',ref['T']),('sourceVolume',ref['left']/ref['rho']),('recoveredVolume',ref['rec']/.95835),('recovered',ref['rec']),('escaped',ref['esc'])]:
   assert math.isclose(float(c[key]),value,rel_tol=1e-9,abs_tol=1e-8),(c['label'],key,c[key],value)
   readings+=1
 for curve in c['curves']:
  points=re.findall(r'[ML]([^, ]+),([^ ]+)',curve['d']);assert len(points)==61
  portrait='portrait' in c['label'] or 'history-' in c['label'];pw=(650 if portrait else 1100)-155;ph=500 if portrait else 420
  for i,(x,y) in enumerate(points):
   t=float(c['time'])*i/60;ref=reference(['0',t,'100','160','.5','1.5','20','50']);value={'source':ref['left'],'recovered':ref['rec'],'escaped':ref['esc'],'temperature':ref['T'],'throughput':ref['through'],'input':ref['qin']/1000,'sourceHeat':ref['hs']/1000,'collectedHeat':ref['hr']/1000,'escapeHeat':ref['he']/1000,'coolingHeat':ref['qc']/1000,'ambientHeat':ref['loss']/1000}[curve['key']]
   assert math.isclose(float(x),85+pw*t/2400,abs_tol=1e-7)
   assert math.isclose(float(y),145+ph*(1-value/float(curve['high'])),abs_tol=1e-7),(c['label'],curve['key'],i,y,value)
   curvepoints+=1
 for v in c['vessels']:
  top=float(v['level']);volume=float(v['volume'])
  if v['name']=='collector':got=k*2.1**2*(top-.6)
  else:
   got=0
   for (y,r),(y2,r2) in zip(profile,profile[1:]):
    if top<=y:break
    h=min(top,y2)-y;rr=r+(r2-r)*h/(y2-y);got+=k*h*(r*r+r*rr+rr*rr)/3
  assert math.isclose(got,volume,abs_tol=1e-8), (c['label'],v,got)
  checks+=1
out={'status':'passed','actualCases':len(cases),'independentVesselVolumeChecks':checks,'independent3DReadings':readings,'independentHistoryPoints':curvepoints,'pageOverflow':False,'positiveContainedViewers':True}
(p/'independent-rendered-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)

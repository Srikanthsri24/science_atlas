import json,re,math
from pathlib import Path
from validation_model import state
p=Path(__file__).parent;apparatus=0;markers=0;points=0;micro=0;sections=0

def near(a,b,tol=1e-7):assert abs(float(a)-b)<tol,(a,b)
rows=[json.loads(x) for x in (p/'responsive-2d.jsonl').read_text().splitlines()]
for r in rows:
 assert r['width']==r['scroll'] and r['svgHeight']>0
 for a in r['apparatus']:
  s=state(t=float(a['time']),sample=a['kind']);scale=float(a['scale']);near(a['cloud'],s['z']);near(a['bed'],s['b']);near(a['settled'],s['mb'])
  for v,k in zip(a['phases'],['b','hc','hclear']):near(v,s[k]*scale)
  expected={}
  for i in range(80):
   y0=s['H']*(i+.5)/80;y=y0-100*s['v']*float(a['time'])
   if y>s['b'] and y<=s['z']:expected[str(i)]=float(a['base'])-(.5+y)*scale
  assert len(expected)==len(a['markers'])
  for m in a['markers']:near(m['cy'],expected[m['id']]);markers+=1
  apparatus+=1
 if r['section']:
  a=r['section'];s=state(t=float(r['time']),sample=a['sample']);height=s['Bmax']*1.5;scale=410/height;near(a['height'],height);near(a['scale'],scale);near(a['bed'],s['b']);near(a['bedPixels'],s['b']*scale);near(a['cloudPixels'],max(0,min(height,s['z'])-s['b'])*scale);sections+=1
 if r['micro']:
  a=r['micro'];N=len(a['cores']);assert N in [1,16,36,64,100];near(a['R'],2*math.sqrt(N));assert len({v['id'] for v in a['cores']})==N
  for v in a['cores']:near(v['r'],2*float(a['scale']))
  micro+=1
 portrait=r['format']=='portrait';left=95 if portrait else 110;pw=435 if portrait else 820;ph=560 if portrait else 370
 for curve in r['curves']:
  metric=curve['metric'];high=100 if metric=='settled' else state()['H']*1.1 if metric=='clear' else state()['Bmax']*1.15;near(curve['high'],high)
  v=re.findall(r'[ML]([\d.e+\-]+),([\d.e+\-]+)',curve['d']);assert len(v)==61
  for i,(x,y) in enumerate(v):
   t=float(r['time'])*i/60;s=state(t=t,sample=curve['kind']);value=100*s['f'] if metric=='settled' else s['hclear'] if metric=='clear' else s['b'];near(x,left+t/2400*pw,1e-4);near(y,120+ph-value/high*ph,1e-4);points+=1
states=[json.loads(x) for x in (p/'responsive-3d.jsonl').read_text().splitlines()]
for r in states:
 assert r['width']==r['scroll'] and r['canvas']['w']>0 and r['canvas']['h']>0;s=state(t=float(r['time']),sample=r['sample']);near(r['cloud'],s['z']);near(r['bed'],s['b']);near(r['settled'],s['mb'])
result=dict(status='passed',twoDCases=len(rows),apparatusStates=apparatus,actualMarkerPositions=markers,uniformBedSections=sections,microscopicCases=micro,independentCurvePoints=points,threeDStates=len(states),minimumSvgHeight=min(r['svgHeight'] for r in rows));(p/'independent-rendered-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(result)

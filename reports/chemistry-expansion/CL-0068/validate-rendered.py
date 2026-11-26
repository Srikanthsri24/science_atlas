import json,re,math
from pathlib import Path
p=Path(__file__).parent;points=0;apparatus=0
for line in (p/'responsive-2d.jsonl').read_text().splitlines():
 s=json.loads(line);assert s['width']==s['scroll'];portrait=s['format']=='portrait';left=85 if portrait else 100;pw=445 if portrait else 830;ph=530 if portrait else 330
 for a in s.get('apparatus',[]):
  t=float(a['time']);cc=20 if a['kind']=='reference' else 160/(8+8*min(t/80,1));A=.02*cc*float(a['path']);assert abs(float(a['concentration'])-cc)<1e-10;assert abs(float(a['absorbance'])-A)<1e-10;assert abs(float(a['transmission'])-10**(-A))<1e-10;apparatus+=1
 for curve in s.get('curves',[]):
  metric=curve['metric'];high=23 if metric=='concentration' else .46 if metric=='absorbance' else 100
  v=re.findall(r'[ML]([\d.e+\-]+),([\d.e+\-]+)',curve['d']);assert len(v)==61
  for i,(x,y) in enumerate(v):
   t=float(s['time'])*i/60;cc=20 if curve['kind']=='reference' else 160/(8+8*min(t/80,1));value=cc if metric=='concentration' else .02*cc if metric=='absorbance' else 100*10**(-.02*cc)
   assert abs(float(x)-(left+t/100*pw))<1e-4
   assert abs(float(y)-(120+ph-value/high*ph))<1e-4
   points+=1
states=[json.loads(v) for v in (p/'responsive-3d.jsonl').read_text().splitlines()]
for s in states:
 assert s['width']==s['scroll'];assert s['canvas']['height']>0 and s['canvas']['width']>0
 t=float(s['time']);cc=160/(8+8*min(t/80,1));assert abs(float(s['concentration'])-cc)<1e-10;assert abs(float(s['absorbance'])-.02*cc)<1e-10
r=dict(status='passed',apparatusStates=apparatus,independentCurvePoints=points,threeDStates=len(states));(p/'independent-rendered-validation.json').write_text(json.dumps(r,indent=2)+'\n');print(r)

"""Independent actual SVG reconstruction;no app imports."""
from pathlib import Path
import json,math,re
r=Path(__file__).parent;states=json.loads((r/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 A,H,P,F,t=map(float,v['parameters']);Q=A/10000*(H+6)/100/70*1e6;S=min(P+F,Q*t);pore=2*A*1.25;labelOut=max(0,min(P,S-pore));labelSource=P-min(P,S);clearSource=F-max(0,S-P);k=float(v['svg']['data-bed-scale']);horizon=float(v['svg']['data-bed-horizon']);portrait=v['svg']['viewBox']=='0 0 600 1300';px,py,pw,ph=(75,940,450,180) if portrait else (760,270,290,210)
 sources={q['data-bed-source']:q for q in v['source']}
 for name,amount,x in [('labelled',labelSource,150),('clear',clearSource,450)]:
  if amount>1e-8:
   q=sources[name];rad=math.sqrt(50/math.pi)*k
   for key,value in [('x',x-rad),('y',280-amount/50*k),('width',2*rad),('height',amount/50*k)]:assert near(q[key],value)
  else:assert name not in sources or float(sources[name]['height'])<1e-8
 if S>1e-8:
  q=v['receiver'];rad=math.sqrt(100/math.pi)*k
  for key,value in [('x',250-rad),('y',640-S/100*k),('width',2*rad),('height',S/100*k)]:assert near(q[key],value)
 else:assert v['receiver'] is None
 bands={q['data-bed-band']:q for q in v['bands']};before=0
 for i,(name,phi) in enumerate(zip(['gravel','sand','carbon'],[.4,.35,.5])):
  vol=A*2*phi;after=before+vol;start=max(before,S-P);end=min(after,S);label=max(0,end-start)
  assert abs(float(v['layerLabels'][i].split()[0])-label)<.000501
  if label>1e-8:
   q=bands[name];depth=i*2+(start-before)/vol*2;high=label/vol*2;rad=math.sqrt(A/math.pi)*k
   for key,value in [('x',250-rad),('y',340+depth*k),('width',2*rad),('height',high*k)]:assert near(q[key],value)
  else:assert name not in bands or float(bands[name]['height'])<1e-8
  before=after
 for i,current in enumerate([S,labelOut]):
  assert near(v['points'][i]['cx'],px+t/horizon*pw) and near(v['points'][i]['cy'],py+ph-current/(P+F)*ph)
  curve=[tuple(map(float,q)) for q in re.findall(r'[ML]([^,]+),([^ML]+)',v['traces'][i]['d'])]
  expected=lambda h:(min(P+F,Q*h) if i==0 else max(0,min(P,min(P+F,Q*h)-pore)))
  for x,y in curve:
   h=(x-px)/pw*horizon;assert h<=t+1e-7;assert near(y,py+ph-expected(h)/(P+F)*ph)
  for a,b in zip(curve,curve[1:]):
   h=((a[0]+b[0])/2-px)/pw*horizon;assert near((a[1]+b[1])/2,py+ph-expected(h)/(P+F)*ph),'Curve smoothed a physical arrival/stop corner'
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('overlap',a['text'],b['text'],dx,dy)
 assert not v['zoomOverlayCollisions']
print(f'{len(states)} actual SVG states independently verify source/receiver volumes,label-band pore inventories,elapsed curves and readable labels.')

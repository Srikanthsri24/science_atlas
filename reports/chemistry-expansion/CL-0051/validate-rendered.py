"""Independent reconstruction of actual DOM SVG geometry;no application imports."""
from pathlib import Path
import json,math,re
r=Path(__file__).parent;states=json.loads((r/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 V,A,RH,F,t=[float(q['value']) for q in v['parameters']];initial=V*.997;k=float(v['svg']['data-air-scale']);base=float(v['svg']['data-air-base']);horizon=float(v['svg']['data-air-horizon']);P=v['svg']['viewBox']=='0 0 600 1200';px,py,pw,ph=(70,900,460,170) if P else (775,300,275,230)
 for i,(q,film) in enumerate(zip(v['samples'],[10,F])):
  rate=(.000025/(film/1000))*(.023*(1-RH/100))*(A/10000)*3600*1000;mass=max(0,initial-rate*t);loss=initial-mass;depth=mass/.997/A;origin=float(q['attrs']['data-air-origin']);radius=math.sqrt(A/math.pi)
  assert near(q['initial']['y1'],base-V/A*k)
  if mass>1e-8:
   assert q['water'] is not None
   for key,value in [('x',origin-radius*k),('y',base-depth*k),('width',2*radius*k),('height',depth*k)]:assert near(q['water'][key],value)
  else:assert q['water'] is None or float(q['water']['height'])<1e-8
  assert abs(float(q['remaining'].split()[0])-mass)<.000501
  assert abs(float(q['loss'].split()[1])-loss)<.000501
  assert near(v['films'][i]['height'],film*(9 if P else 5))
  assert near(v['points'][i]['cx'],px+t/horizon*pw) and near(v['points'][i]['cy'],py+ph-mass/initial*ph)
  curve=[tuple(map(float,q)) for q in re.findall(r'[ML]([^,]+),([^ML]+)',v['traces'][i]['d'])]
  for x,y in curve:
   h=(x-px)/pw*horizon;assert h<=t+1e-7;assert near(y,py+ph-max(0,initial-rate*h)/initial*ph)
  for a,b in zip(curve,curve[1:]):
   h=((a[0]+b[0])/2-px)/pw*horizon;assert near((a[1]+b[1])/2,py+ph-max(0,initial-rate*h)/initial*ph),'Smoothed drying corner'
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('overlapping text',a['text'],b['text'],dx,dy)
 assert not v['zoomOverlayCollisions'],('zoom overlay collision',v['zoomOverlayCollisions'])
print(f'{len(states)} actual SVG states verify equal area,depth,remaining/lost mass,film heights,elapsed curves and readable labels.')

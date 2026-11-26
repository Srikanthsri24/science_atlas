"""Independent actual SVG reconstruction,no app imports."""
from pathlib import Path
import math,json,re
r=Path(__file__).parent;states=json.loads((r/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 V,A,B,t=map(lambda x:float(x['value']),v['parameters']);k=float(v['svg']['data-area-scale']);base=float(v['svg']['data-area-base']);horizon=float(v['svg']['data-area-horizon']);portrait=v['svg']['viewBox']=='0 0 600 1067';px,py,pw,ph=(65,740,470,200) if portrait else (760,240,290,230)
 for i,(q,area) in enumerate(zip(v['samples'],[A,B])):
  mass=max(0,V-.02*area*t);loss=V-mass;origin=float(q['attrs']['data-area-origin']);radius=math.sqrt(area/math.pi);depth=mass/area
  assert near(q['initial']['y1'],base-V/area*k)
  if mass>1e-10:
   assert q['water'] is not None
   for key,value in [('x',origin-radius*k),('y',base-depth*k),('width',2*radius*k),('height',depth*k)]:assert near(q['water'][key],value)
  else:assert q['water'] is None or float(q['water']['height'])<1e-8
  assert abs(float(q['remaining'].split()[0])-mass)<.000501;assert abs(float(q['loss'].split()[1])-loss)<.000501
  point=v['points'][i];assert near(point['cx'],px+t/horizon*pw) and near(point['cy'],py+ph-mass/V*ph)
  curve=[tuple(map(float,q)) for q in re.findall(r'[ML]([^,]+),([^ML]+)',v['traces'][i]['d'])]
  for x,y in curve:
   time=(x-px)/pw*horizon;assert time<=t+1e-7;assert near(y,py+ph-max(0,V-.02*area*time)/V*ph)
  for a,b in zip(curve,curve[1:]):
   time=((a[0]+b[0])/2-px)/pw*horizon;assert near((a[1]+b[1])/2,py+ph-max(0,V-.02*area*time)/V*ph),'Curve smoothed the dry-time corner'
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal text clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical text clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('overlapping text',a['text'],b['text'],dx,dy)
layouts=json.loads((r/'responsive.json').read_text())
for v in layouts:
 assert v['pageWidth']<=v['width']
 if v['mode']=='3D':assert v['canvasHeight']>0 and v['legendInsideStage'] and v['readoutsInsideStage']
print(f'{len(states)} actual SVG states independently verify radii,depths,remaining/lost mass,initial levels and exact elapsed curves;{len(layouts)} responsive layouts passed.')

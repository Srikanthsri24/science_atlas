"""Independent reconstruction of actual rendered SVG attributes; no app imports."""
import json,math,re
from pathlib import Path
root=Path(__file__).parent
states=json.loads((root/'rendered-svg-states.json').read_text())
near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 vals=[float(p['value']) for p in v['parameters']];w,o,rho,t,z=vals
 A=math.pi*2.5**2; oil=min(o,t); wh=w/A;oh=oil/A;top=wh+oh
 k=float(v['svg']['data-layer-scale']);base=float(v['svg']['data-layer-base-y']);ox=float(v['svg']['data-layer-origin-x'])
 assert near(v['water']['height'],wh*k) and near(v['water']['y'],base-wh*k)
 if oil: assert near(v['oil']['height'],oh*k) and near(v['oil']['y'],base-top*k)
 else: assert v['oil'] is None
 assert near(v['source']['height'],(o-oil)/(math.pi*1.8**2)*k)
 assert near(v['probe']['cy'],base-z*k) and near(v['probe']['cx'],ox+.6*k)
 portrait=v['svg']['viewBox']=='0 0 600 1067';px,py,pw,ph=(90,700,350,250) if portrait else (680,200,310,270)
 pressure=lambda h:1000*9.81*max(0,wh-h)*.01+rho*1000*9.81*max(0,top-max(h,wh))*.01
 assert near(v['pressure']['cx'],px+pressure(z)/1300*pw) and near(v['pressure']['cy'],py+ph-z/13*ph)
 points=re.findall(r'[ML]([^,]+),([^ML]+)',v['curve']['d']);assert len(points)==131
 for i,(x,y) in enumerate(points):
  h=13*i/130
  assert near(x,px+pressure(h)/1300*pw) and near(y,py+ph-h/13*ph)
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('text horizontally clipped',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('text vertically clipped',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])
   assert not(dx>.75 and dy>.75),('overlapping labels',a['text'],b['text'],dx,dy)
layouts=json.loads((root/'responsive-initial.json').read_text())
for v in layouts:
 assert v['pageWidth']<=v['width']
 if v['mode']=='3D':assert v['canvas']['height']>0
 assert v.get('legendInsideStage',True)
print(f'{len(states)} actual SVG states: independent liquid/source volumes,probe position,pressure point,131-point curves and text bounds/overlap passed;{len(layouts)} responsive layouts have no page overflow.')

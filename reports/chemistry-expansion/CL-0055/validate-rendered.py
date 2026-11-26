"""Independent actual SVG reconstruction; no application imports."""
from pathlib import Path
import json,math,re
p=Path(__file__).parent;states=json.loads((p/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 q=v['inputs'];P=q['progress'];f=min(1,P);r=max(0,P-1);k=float(v['svg']['data-change-scale']);base=float(v['svg']['data-change-base']);cx=float(v['svg']['data-change-centre']);sy=lambda Y:base-Y*k
 if q['sample']=='ice':
  ice=q['iceMassG']*(1-f+r);water=q['iceMassG']*(f-r);a=(ice/.917)**(1/3) if ice>0 else 0;H=q['iceMassG']/.9998/40;floatIce=a>0 and H>=a*.917/.9998;b=H-a*.917/.9998 if floatIce else 0;h=H if a==0 or floatIce else water/.9998/(40-a*a)
  if ice>1e-8:
   x=v['ice'];assert near(x['x'],cx-a/2*k) and near(x['y'],sy(b+a)) and near(x['width'],a*k) and near(x['height'],a*k)
  else:assert v['ice'] is None
  if water>1e-8:
   x=v['water'];assert near(x['y'],sy(h)) and near(x['height'],h*k) and near(x['width'],2*math.sqrt(40/math.pi)*k)
  else:assert v['water'] is None
 elif q['sample']=='paper':
  cuts=q['cuts'];completed=min(cuts,math.floor(f*cuts+8*2.220446049250313e-16*cuts));partial=max(0,f*cuts-completed);gap=f*(1-r)*.8;strip=10/(cuts+1);assert len(v['pieces'])==completed+1
  for j,piece in enumerate(v['pieces']):
   left=-5+j*strip;right=5 if j==completed else left+strip;shift=(j-completed/2)*gap
   assert near(piece['x'],cx+(left+shift)*k) and near(piece['width'],(right-left)*k) and near(piece['height'],10*k)
  if partial>0 and completed<cuts:
   a=v['partial'];nums=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[+-]?\d+)?',a['d'])));expectedx=cx+(-5+(completed+1)*strip+completed/2*gap)*k;assert near(nums[0],expectedx) and near(nums[1],sy(-5)) and near(nums[2],sy(-5+partial*10))
  else:assert v['partial'] is None
 else:
  xi=min(q['bicarbonateG']/84.006,q['acidMmol']/1000)*f;gasG=xi*44.009;condensed=100+q['bicarbonateG']-gasG;V=xi*8.314462618*298.15/101325*1e6;rise=V/200;liq=condensed/1.03/25
  assert near(v['liquid']['height'],liq*k) and near(v['liquid']['y'],sy(liq))
  assert near(v['piston']['y'],sy(2+rise+.2)) and near(v['piston']['width'],2*math.sqrt(200/math.pi)*k)
  if rise>1e-8:assert near(v['gas']['height'],rise*k) and near(v['gas']['y'],sy(2+rise))
  else:assert v['gas'] is None
 box=v['box']
 for t in v['texts']:
  assert t['x']>=box['x']-.5 and t['x']+t['width']<=box['x']+box['width']+.5,('horizontal clipping',q['sample'],t)
  assert t['y']>=box['y']-.5 and t['y']+t['height']<=box['y']+box['height']+.5,('vertical clipping',q['sample'],t)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('label overlap',q['sample'],a['text'],b['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print(f'{len(states)} actual SVG states independently match ice displacement,paper cuts andgas-piston volume;label bounds/overlaps passed.')

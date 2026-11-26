"""Independent reconstruction of real SVG states; no imports from the app."""
import json,math,re
from pathlib import Path
r=Path(__file__).parent;states=json.loads((r/'rendered-svg-states.json').read_text());close=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 mg,p,t=[float(q['value']) for q in v['parameters']];mode=v['protocol'];m=mg/1000;L=m*334000;h0=L+m*4186*10 if mode=='cool' else -m*2090*10;lo=-m*2090*20;hi=L+m*4186*60;clip=lambda q:max(lo,min(hi,q));ht=t if mode=='heat' else min(t,60) if mode=='cycle' else 0;ct=t if mode=='cool' else max(0,t-60) if mode=='cycle' else 0;h=clip(clip(h0+p*ht)-p*ct);f=max(0,min(1,h/L));ms=mg*(1-f);ml=mg*f;temp=h/(m*2090) if h<0 else (h-L)/(m*4186) if h>L else 0
 area=math.pi*16;side=(ms/.917)**(1/3) if ms else 0;draft=.917*side;floatline=(ml+side*side*draft)/area;floats=ms>0 and ml>0 and floatline>=draft;waterline=0 if ml==0 else ml/area if ms==0 else floatline if floats else ml/(area-side*side);bottom=waterline-draft if floats else 0
 k=float(v['svg']['data-melting-scale']);base=float(v['svg']['data-melting-base']);ox=float(v['svg']['data-melting-origin']);horizon=float(v['svg']['data-melting-horizon']);portrait=v['svg']['viewBox']=='0 0 600 1067'
 if ms:
  assert v['ice'] is not None
  for name,expected in [('x',ox-side*k/2),('y',base-(bottom+side)*k),('width',side*k),('height',side*k)]:assert close(v['ice'][name],expected),(name,v['ice'][name],expected)
 else:assert v['ice'] is None
 if ml:
  vals=list(map(float,re.findall(r'[-+]?\d*\.?\d+(?:e[-+]?\d+)?',v['water']['d'],re.I)));expected=[ox-4*k,base,ox+4*k,base-waterline*k,ox-4*k]
  if ms and waterline>bottom:expected +=[ox-side*k/2,base-bottom*k,ox+side*k/2,base-waterline*k,ox-side*k/2]
  assert len(vals)==len(expected)
  assert all(close(a,b) for a,b in zip(vals,expected));assert v['water']['fill-rule']=='evenodd'
 else:assert v['water'] is None
 thermoY,thermoH=(185,235) if portrait else (175,250);bar=(temp+20)/80*thermoH;assert close(v['thermometer']['height'],bar);assert close(v['thermometer']['y'],thermoY+thermoH-bar)
 px,py,pw,ph=(65,670,460,240) if portrait else (675,200,350,280)
 assert close(v['point']['cx'],px+t/horizon*pw) and close(v['point']['cy'],py+(60-temp)/80*ph)
 points=[tuple(map(float,q)) for q in re.findall(r'[ML]([^,]+),([^ML]+)',v['trace']['d'])]
 def model_temp(time):
  ht=time if mode=='heat' else min(time,60) if mode=='cycle' else 0;ct=time if mode=='cool' else max(0,time-60) if mode=='cycle' else 0;H=clip(clip(h0+p*ht)-p*ct)
  return H/(m*2090) if H<0 else (H-L)/(m*4186) if H>L else 0
 for x,y in points:
  time=(x-px)/pw*horizon;assert time<=t+1e-7;assert close(y,py+(60-model_temp(time))/80*ph)
 for a,b in zip(points,points[1:]):
  midx=(a[0]+b[0])/2;time=(midx-px)/pw*horizon;assert close((a[1]+b[1])/2,py+(60-model_temp(time))/80*ph),'Curve smoothed over a physical transition'
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal text clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical text clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('overlapping labels',a['text'],b['text'],dx,dy)
layouts=json.loads((r/'responsive.json').read_text())
for v in layouts:
 assert v['pageWidth']<=v['width']
 if v['mode']=='3D':assert v['canvasHeight']>0 and v['legendInsideStage'] and v['readoutsInsideStage']
print(f'{len(states)} real SVG states:phase masses,ice/water geometry,thermometer and exact elapsed thermal-curve segments independently checked;{len(layouts)} responsive layouts passed.')

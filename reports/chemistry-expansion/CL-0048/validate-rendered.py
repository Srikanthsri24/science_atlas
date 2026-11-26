"""Reconstruct actual SVG geometry and displayed readings without app imports."""
import json,math
from pathlib import Path
root=Path(__file__).parent;states=json.loads((root/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 V,A,B,TA,TB,T=[float(q['value']) for q in v['parameters']];delivered=min(V,T);remaining=V-delivered;area=math.pi*2**2;sourceArea=math.pi*1.6**2;k=float(v['svg']['data-density-scale']);base=float(v['svg']['data-density-base']);h=delivered/area
 for sample,rho,tare in zip(v['samples'],[A,B],[TA,TB]):
  x=float(sample['attrs']['data-density-origin']);q=sample['liquid'];src=sample['source'];assert near(q['height'],h*k) and near(q['y'],base-(2.2+h)*k);assert near(q['width'],4*k) and near(q['x'],x-2*k)
  assert near(src['height'],remaining/sourceArea*k) and near(src['y'],base-(15+remaining/sourceArea)*k)
  assert abs(float(sample['gross'].split()[0])-(tare+rho*delivered))<=.000501
  assert abs(float(sample['net'].split()[1])-rho*delivered)<=.000501
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal text clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical text clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])
   assert not(dx>.75 and dy>.75),('overlapping text',a['text'],b['text'],dx,dy)
layouts=json.loads((root/'responsive.json').read_text())
for v in layouts:
 assert v['pageWidth']<=v['width']
 if v['mode']=='3D':assert v['canvasHeight']>0 and v['legendInsideStage'] and v['readoutsInsideStage']
print(f'{len(states)} actual SVG states: independently reconstructed equal column/source volumes,gross and net readings,text bounds and text separation;{len(layouts)} responsive checks passed.')

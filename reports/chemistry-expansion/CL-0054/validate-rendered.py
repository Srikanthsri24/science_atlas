"""Independent reconstruction of actual rendered SVG apparatus; no app imports."""
from pathlib import Path
import json,math,re
p=Path(__file__).parent;states=json.loads((p/'rendered-svg-states.json').read_text())
near=lambda a,b:abs(float(a)-b)<1e-6
for v in states:
 q=v['values'];I=float(q['Sequence iron grams']);S=float(q['Sequence sand grams']);N=float(q['Sequence salt grams']);W=float(q['Sequence reserved water grams']);P=float(q['Sequence procedure progress']);a,b,f,e=[max(0,min(1,P-j)) for j in range(4)];D=min(N,.36*W)*b;sourceSolid=(I*(1-a)/7.87+S*(1-f)/2.65+(N-D)*(1-f)/2.165);sourceSolution=W*b*(1-f)/.997+D*(1-f)*.3;sourceBulk=sourceSolid/.6;sourceHeight=(max(sourceBulk,sourceSolid+sourceSolution) if sourceSolution>0 else sourceBulk)/40;dishW=W*b*f*(1-e);dishD=min(D*f,.36*dishW);crystal=D*f-dishD;dishBulk=crystal/2.165/.6;dishSolution=dishW/.997+dishD*.3;dishHeight=(max(dishBulk,crystal/2.165+dishSolution) if dishSolution>0 else dishBulk)/50
 k=float(v['svg']['data-sequence-scale']);base=float(v['svg']['data-sequence-base']);cx=float(v['svg']['data-sequence-centre']);view=v['svg']['data-sequence-view'];fills={x['data-sequence-fill']:x for x in v['fills']};expect={}
 if view in ['overview','magnet','dissolve','filter']:
  if sourceSolution>0:expect['source-liquid']=(-6,2,math.sqrt(40/math.pi),sourceHeight)
  if sourceBulk>0:expect['source-grains']=(-6,2,math.sqrt(40/math.pi),sourceBulk/40)
 if view in ['overview','magnet'] and I*a>0:expect['iron']=(-16,0,2,I*a/7.87/.6/12)
 if view in ['overview','dissolve'] and W*(1-b)>0:expect['supply-liquid']=(-8,8,math.sqrt(20/math.pi),W*(1-b)/.997/20)
 if view in ['overview','filter','evaporate']:
  if dishSolution>0:expect['dish-liquid']=(17,0,math.sqrt(50/math.pi),dishHeight)
  if crystal>0:expect['dish-crystals']=(17,0,math.sqrt(50/math.pi),dishBulk/50)
 for name,(x,y,r,h) in expect.items():
  z=fills[name]
  for key,val in [('x',cx+(x-r)*k),('y',base-(y+h)*k),('width',2*r*k),('height',h*k)]:assert near(z[key],val),(name,key,z[key],val)
 for name in fills:
  if name!='filter-grains':assert name in expect,(name,P)
 retainedVol=(S*f/2.65+(N-D)*f/2.165)/.6
 if view in ['overview','filter'] and retainedVol>0:
  z=fills['filter-grains'];n=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[+-]?\d+)?',z['d'])));Rt=(n[2]-n[0])/2/k;h=(n[4]-n[1])/k;assert near(math.pi*h/3*(Rt*Rt+.3*Rt+.09),retainedVol)
 box=v['box']
 for z in v['texts']:
  assert z['x']>=box['x']-.5 and z['x']+z['width']<=box['x']+box['width']+.5,('horizontal clipping',view,z)
  assert z['y']>=box['y']-.5 and z['y']+z['height']<=box['y']+box['height']+.5,('vertical clipping',view,z)
 for i,z in enumerate(v['texts']):
  for other in v['texts'][i+1:]:
   dx=min(z['x']+z['width'],other['x']+other['width'])-max(z['x'],other['x']);dy=min(z['y']+z['height'],other['y']+other['height'])-max(z['y'],other['y']);assert not(dx>.75 and dy>.75),('label overlap',view,z['text'],other['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print(f'{len(states)} actual SVG states independently reconstruct source/residue/dish volumes andfit all labels without overlaps.')

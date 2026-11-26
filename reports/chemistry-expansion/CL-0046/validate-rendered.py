"""Independent checks of actual browser geometry; no application imports."""
import json,math,re
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0046');states=json.loads((p/'rendered-states.json').read_text());checks=[];water_by_volume={}
def near(a,b,t=1e-8):assert abs(a-b)<=t,(a,b)
for d in states:
 V,E,D=map(float,[d['volume'],d['offset'],d['distance']]);a=d['svg'];scale=float(a['data-eye-scale']);ox=float(a['data-eye-origin-x']);base=float(a['data-eye-base-y']);toPhysical=lambda point:((float(point['cx'])-ox)/scale,(base-float(point['cy']))/scale)
 target,eye,front,back=map(toPhysical,[d['target'],d['eye'],d['front'],d['back']]);near(target[0],0);near(eye[0],D);near(eye[1]-target[1],E);near(front[0],1.3);near(back[0],-1.3)
 for point in[front,back]:near(point[1],target[1]+(eye[1]-target[1])*(point[0]-target[0])/(eye[0]-target[0]))
 surface=re.findall(r'[ML]([-+0-9.eE]+),([-+0-9.eE]+)',d['surface']['d']);assert len(surface)==81
 physical=[((float(x)-ox)/scale,(base-float(y))/scale) for x,y in surface];R=(physical[-1][0]-physical[0][0])/2;A=math.pi*R*R;b=physical[40][1];rise=physical[0][1]-b;near(R,1.3);near(rise,.12);near(A*(b+rise/2),V);near(b,target[1])
 for i,(x,y) in enumerate(physical):near(x,-R+2*R*i/80);near(y,b+rise*x*x/(R*R))
 assert d['water']['d'].startswith(d['surface']['d']);near(float(d['water']['data-eye-water']),V)
 key=(V,a['viewBox']);previous=water_by_volume.setdefault(key,d['water']['d']);assert previous==d['water']['d'],'Water moved although contained volume and layout did not change'
 for tick in d['ticks']:
  v=float(tick['data-eye-tick']);h=v/A;expected=h-min(.12,h)/2;near((base-float(tick['y1']))/scale,expected);near(float(tick['y1']),float(tick['y2']))
 assert len(d['ticks'])==101
 for line in d['sight']:
  x1,y1=(float(line['x1'])-ox)/scale,(base-float(line['y1']))/scale;x2,y2=(float(line['x2'])-ox)/scale,(base-float(line['y2']))/scale
  for x,y in[(x1,y1),(x2,y2)]:near(y,b+E*x/D)
 lo,hi,wy,wh=map(float,[a['data-eye-window-low'],a['data-eye-window-high'],a['data-eye-window-y'],a['data-eye-window-height']]);near(lo,math.floor(V+.5)-6);near(hi,lo+12)
 values={}
 for line in d['window']:
  ml=hi-(float(line['y1'])-wy)/wh*(hi-lo);near(float(line['y1']),float(line['y2']));key=next(k for k in line if k.startswith('data-eye-window-'));values[key]=ml
 frontMl=A*(front[1]+rise/2);backMl=A*(back[1]+rise/2);near(values['data-eye-window-front'],frontMl);near(values['data-eye-window-back'],backMl);near(values['data-eye-window-ref'],V)
 metrics={m['name']:m['value'] for m in d['metrics']};near(float(metrics['Fixed water'].removesuffix(' mL')),V,.050001)
 if a['data-eye-revealed']=='true':
  rounded=math.floor((frontMl+2.220446049250313e-14)/.1+.5)*.1;near(float(metrics['Rounded front reading'].removesuffix(' mL')),rounded,.050001);near(float(metrics['Total signed error'].removesuffix(' mL')),rounded-V,.00050001)
 else:
  assert metrics['Rounded front reading']==('Estimate first' if a.get('data-eye-reading-layout')=='large-type-portrait' else 'Estimate, then reveal');assert metrics['Total signed error']=='Hidden for practice'
 checks.append({'name':d['name'],'passed':True,'physicalSurfacePoints':81,'calibratedTicks':101,'windowLines':3,'scope':'Actual sight-line intersections,physical volume-correct surface,unchanged water geometry,graduations,magnified reference lines and reveal-dependent metrics.'})
(p/'independent-gui-validation.json').write_text(json.dumps({'passed':True,'states':len(checks),'checks':checks},indent=2)+'\n');print('Independent actual SVG checks:',len(checks),'passed')

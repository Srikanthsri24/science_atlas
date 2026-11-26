"""Independent reconstruction of actual browser SVG scales and liquid sections."""
import json,math,re
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0045');states=json.loads((p/'rendered-states.json').read_text());checks=[]
def near(a,b,t=1e-8):assert abs(a-b)<=t,(a,b)
def bottom(volume,rise,area):
 h=volume/area
 return h-min(rise,h)/2
for d in states:
 target,bias,time=map(float,[d['target'],d['bias'],d['timeS']]);volume=min(target,time);scale=float(d['svg']['data-volume-scale']);base=float(d['svg']['data-volume-base']);settled=time>=target;metrics={x['name']:x['value'] for x in d['metrics']}
 near(float(metrics['Known aliquot each'].removesuffix(' mL')),target,.050001);near(float(metrics['Received in each vessel'].removesuffix(' mL')),volume,.00050001);near(float(metrics['Source remaining'].removesuffix(' mL')),2*(target-volume),.00050001)
 for v in d['vessels']:
  name=v['vessel'];r,rise,division=(2.5,.08,10) if name=='beaker' else (1.3,.12,1);area=math.pi*r*r;h=volume/area;a=min(rise,h);cx=float(v['centre']);pts=re.findall(r'[ML]([-+0-9.eE]+),([-+0-9.eE]+)',v['surface']['d']);assert len(pts)==81
  for i,(xp,yp) in enumerate(pts):
   xp,yp=float(xp),float(yp);x=(xp-cx)/scale;y=(base-yp)/scale;near(x,-r+2*r*i/80);near(y,h+a*(x*x/(r*r)-.5))
  assert (v['liquid'] is not None)==(volume>0)
  for tick in v['ticks']:
   nominal=float(tick['data-volume-tick']);physical=nominal-bias;assert 0<=physical<=100;near((base-float(tick['y1']))/scale,bottom(physical,rise,area));near(float(tick['y1']),float(tick['y2']))
  indicated=volume+bias;step=division*(1 if d['convention']=='nearest-mark' else .1);rounded=math.floor((indicated+2.220446049250313e-14)/step+.5)*step;label=metrics['Beaker reading' if name=='beaker' else 'Cylinder reading']
  if settled:near(float(label.removesuffix(' mL')),rounded,.050001)
  else:assert label=='Wait for flow to stop'
  if settled:
   inset=next(q for q in d['insets'] if q['data-volume-inset-surface']==name);points=re.findall(r'[ML]([-+0-9.eE]+),([-+0-9.eE]+)',inset['d']);assert len(points)==41;lower=math.floor(indicated/division)*division;lo=bottom(lower-bias,rise,area);hi=bottom(lower+division-bias,rise,area);dy=110/(hi-lo);center=(0 if name=='beaker' else 145)+45
   for i,(xp,yp) in enumerate(points):
    x=(float(xp)-center)/35*r;y=lo+(150-float(yp))/dy;near(x,-r+2*r*i/40);near(y,h+a*(x*x/(r*r)-.5))
  else:assert not d['insets']
 checks.append({'name':d['name'],'passed':True,'sectionPoints':162,'insetPoints':82 if settled else 0,'scope':'Actual full physical sections,volume-correct meniscus,biased tick heights,magnified curves and displayed paired readings; no app imports.'})
(p/'independent-gui-validation.json').write_text(json.dumps({'passed':True,'states':len(checks),'checks':checks},indent=2)+'\n');print('Independent actual SVG checks:',len(checks),'passed')

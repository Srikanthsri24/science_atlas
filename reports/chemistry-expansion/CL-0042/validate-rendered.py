"""Independent Python reconstruction of actual browser SVG geometry; no app imports."""
import json,math
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0042');states=json.loads((p/'rendered-states.json').read_text());checks=[]
def near(a,b,tol=1e-8):
 assert abs(a-b)<=tol,(a,b)
def display(v,places):
 return '<'+format(10**-places,f'.{places}f') if 0<v<10**-places else format(v,f'.{places}f')
for d in states:
 t=float(d['timeS']);diameter=float(d['particle'])
 for m in d['modules']:
  side=m['attrs']['data-filter-module'];opening=float(d[side]);scale=float(m['attrs']['data-scale-px-cm']);ox=float(m['attrs']['data-origin-x']);oy=float(m['attrs']['data-origin-y']);k=.4*(opening*1e-6/2)**2/(8*5);rate=k*1000*9.81/(.001*.0002);x=math.exp(-rate*t)
  retained=sum(.02 for size in [4,12,30] if size>=opening);captured=retained*(1-x);passed=(.06-retained)*(1-x);upstream=.06*x
  liquids={a['data-filter-liquid']:a for a in m['liquids']};src=liquids.get('source');recv=liquids.get('receiver')
  source_volume=float(src['height'])/scale*10 if src else 0;receiver_volume=float(recv['height'])/scale*(4*math.pi) if recv else 0
  near(source_volume,(100+.06/2.7)*x);near(receiver_volume,100*(1-x)+passed/2.7)
  actual_capture=sum(float(a['height'])/scale*10*2.7 for a in m['captured']);near(actual_capture,captured)
  actual_x=source_volume/(100+.06/2.7);actual_upwater=100*actual_x;actual_receiverwater=receiver_volume-passed/2.7
  near(actual_upwater+actual_receiverwater,100);near(upstream+actual_capture+passed,.06);near(actual_upwater+actual_receiverwater+upstream+actual_capture+passed,100.06)
  metrics={a['name']:a['value'] for a in m['metrics']}
  assert metrics['Collected water']==display(100*(1-x),3)+' mL',(d['name'],metrics)
  assert metrics['Current flow']==display(rate*100*x,4)+' mL/s'
  assert metrics['Captured solid']==display(captured,5)+' g'
  assert metrics['Receiver solid']==display(passed,5)+' g'
  for mark in m['markers']:
   species,index=map(int,mark['data-filter-marker'].split('-'));size=[4,12,30][species];processed=(index+.5)/32<=1-x
   compartment=('captured' if size>=opening else 'receiver') if processed else 'upstream';assert mark['data-compartment']==compartment
   radius=size*.0001/2*200;near(float(mark['r'])/scale,radius)
   marker_x=(float(mark['cx'])-ox)/scale;marker_y=(oy-float(mark['cy']))/scale
   if compartment=='receiver':lo=1.5;hi=1.5+receiver_volume/(4*math.pi);r=2
   else:lo=12+captured/2.7/10;hi=lo+source_volume/10;r=math.sqrt(10/math.pi)
   assert abs(marker_x)+radius<=r+1e-8
   if compartment!='captured':assert marker_y-radius>=lo-1e-8 and marker_y+radius<=hi+1e-8
   else:near(marker_y,12+captured/2.7/10+radius)
  lines=m['poreLines'];near(float(lines[1]['x1'])-float(lines[0]['x2']),opening)
  baseline=float(lines[0]['y1']);pr=diameter/2;hole=opening/2;phase=(t%12)/12;contact=math.sqrt(max(0,pr**2-hole**2)) if diameter>=opening else 0
  y=max(contact,50-phase*100) if diameter>=opening else 50-phase*120
  near(float(m['encounter']['r']),pr);near(float(m['encounter']['cy']),baseline-y)
 checks.append({'name':d['name'],'passed':True,'modules':2,'scope':'Actual SVG phase volumes, mass and water balances, four displayed metrics, all visible glyph compartments/bounds and equal-scale ideal pore encounter.'})
(p/'independent-gui-validation.json').write_text(json.dumps({'passed':True,'states':len(checks),'checks':checks},indent=2)+'\n');print('Independent actual SVG checks:',len(checks),'passed')

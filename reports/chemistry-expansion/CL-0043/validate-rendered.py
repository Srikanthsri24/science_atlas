"""Independent reconstruction of actual SVG phase volumes, not app-state imports."""
import json,math
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0043');states=json.loads((p/'rendered-states.json').read_text());checks=[]
def near(a,b,tol=1e-8):assert abs(a-b)<=tol,(a,b)
def fmt(v):return '<0.001' if 0<v<.001 else f'{v:.3f}'
for d in states:
 salt,k,t=map(float,[d['salt'],d['rate'],d['timeS']]);scale=float(d['svg']['data-recovery-scale']);ts=float(d['svg']['data-recovery-top-scale']);ox=float(d['svg']['data-recovery-origin-x']);oy=float(d['svg']['data-recovery-origin-y']);tx=float(d['plan']['data-origin-x']);ty=float(d['plan']['data-origin-y']);radius=float(d['planCircle']['r'])/ts;area=math.pi*radius**2;near(radius,4);near(area,float(d['svg']['data-recovery-area-cm2']))
 h=float(d['liquid']['height'])/scale;near(float(d['liquid']['width'])/scale,2*radius);near(oy-float(d['liquid']['y']),h*scale)
 actual_crystal_volume=sum((float(c['width'])/ts)**3 for c in d['planCubes']);actual_crystal=actual_crystal_volume*2.165;dissolved=salt-actual_crystal;edge=float(d['planCubes'][0]['width'])/ts if d['planCubes'] else 0
 liquid_volume=area*h-25*edge**2*min(h,edge);solution_mass=(liquid_volume+math.sqrt(liquid_volume**2+3*liquid_volume*dissolved))/2;actual_water=solution_mass-dissolved
 water=100*math.exp(-k*t);crystal=max(0,salt-.36*water);expected_dissolved=min(salt,.36*water)
 near(actual_water,water);near(actual_crystal,crystal);near(dissolved,expected_dissolved);near(actual_water+(100-water),100);near(actual_water+salt+(100-water),100+salt)
 assert len(d['planCubes']) in[0,25];assert len(d['sectionCubes']) in[0,5]
 for c in d['planCubes']:
  ident=int(c['data-recovery-plan-cube']);e=float(c['width'])/ts;near(e,edge);near(float(c['height'])/ts,e);x=(float(c['x'])-tx)/ts+e/2;z=(float(c['y'])-ty)/ts+e/2;near(x,(ident%5-2)*1.2);near(z,(ident//5-2)*1.2)
  for dx in[-.5,.5]:
   for dz in[-.5,.5]:assert math.hypot(x+dx*e,z+dz*e)<radius
 for c in d['sectionCubes']:
  ident=int(c['data-recovery-section-cube']);near(float(c['width'])/scale,edge);near(float(c['height'])/scale,edge);near((oy-float(c['y']))/scale,edge);near((float(c['x'])-ox)/scale+edge/2,(ident%5-2)*1.2);assert ident//5==2
 metrics={m['name']:m['value'] for m in d['metrics']};expected={'Water in dish':water,'Salt dissolved':expected_dissolved,'Salt crystals':crystal,'Water to air':100-water,'Wet dish contents':water+salt,'Complete balance':100+salt}
 for key,value in expected.items():assert metrics[key]==fmt(value)+' g',(d['name'],key,metrics[key],value)
 assert actual_water>0 and actual_water+salt>actual_crystal
 checks.append({'name':d['name'],'passed':True,'scope':'Actual plan cube volumes,5-cube centre cut,liquid displacement inversion,solution water/salt/crystal masses,all six readings and conservation; no application model imports.'})
(p/'independent-gui-validation.json').write_text(json.dumps({'passed':True,'states':len(checks),'checks':checks},indent=2)+'\n');print('Independent actual SVG checks:',len(checks),'passed')

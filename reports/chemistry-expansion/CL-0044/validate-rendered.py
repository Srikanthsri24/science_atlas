"""Independent checks of actual rendered rulers,peak coordinates and density samples."""
import json,math,re
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0044');states=json.loads((p/'rendered-states.json').read_text());checks=[]
def near(a,b,tol=1e-8):assert abs(a-b)<=tol,(a,b)
def cdf(x):return (1+math.erf(x/math.sqrt(2)))/2
for d in states:
 a,b,c,t=map(float,[d['blue'],d['yellow'],d['capillary'],d['timeS']]);v=d['svg'];scale=float(v['data-ink-scale']);oy=float(v['data-ink-origin-y']);gx=float(v['data-ink-profile-origin-x']);gy=float(v['data-ink-profile-origin-y']);gs=float(v['data-ink-profile-scale']);gw=float(v['data-ink-profile-width']);dmax=float(v['data-ink-density-max'])
 origin=(oy-float(d['origin']['y1']))/scale;front=(oy-float(d['front']['y1']))/scale;near(origin,2);near(front,.8+math.sqrt(c*t));travel=max(0,front-origin);arrival=1.44/c;mobile=t>=arrival;variance=.08**2+2*.00005*max(0,t-arrival);sigma=math.sqrt(variance)
 assert front<12 and origin>.8
 peaks={q['data-ink-peak']:(oy-float(q['cy']))/scale for q in d['peaks']};metrics={m['name']:m['value'] for m in d['metrics']}
 near(float(metrics['Front from origin'].removesuffix(' cm')),travel,.00050001);assert metrics['Complete ink account']=='2.000 mg'
 for name,k in [('blue',a),('yellow',b)]:
  reference=1/(1+k);mu=origin+reference*travel;near(peaks[name],mu)
  value=metrics[name.title()+' Rf']
  if travel<=1e-9:assert value=='Undefined'
  else:near(float(value),(peaks[name]-origin)/travel,.00005001)
  profile=next(q for q in d['profiles'] if q['data-ink-profile']==name);points=re.findall(r'[ML]([-+0-9.eE]+),([-+0-9.eE]+)',profile['d']);assert len(points)==481
  z=cdf((front-mu)/sigma)-cdf((.8-mu)/sigma) if mobile else 0
  for i,(xp,yp) in enumerate(points):
   xp,yp=float(xp),float(yp);y=(gy-yp)/gs;near(y,12*i/480);actual=(xp-gx)/gw*dmax
   expected=math.exp(-.5*((y-mu)/sigma)**2)/(math.sqrt(2*math.pi)*sigma*z) if mobile and y>=.8-1e-10 and y<=front+1e-10 else 0
   near(actual,expected,5e-6);assert gx-1e-7<=xp<=gx+gw+1e-7
 checks.append({'name':d['name'],'passed':True,'densitySamples':962,'scope':'Actual SVG ruler/origin/front and peak geometry,Rf readouts and every plotted density sample; colour image is illustrative,not a calibrated mass image. Independent normal CDF via math.erf; no app imports.'})
(p/'independent-gui-validation.json').write_text(json.dumps({'passed':True,'states':len(checks),'checks':checks},indent=2)+'\n');print('Independent actual SVG checks:',len(checks),'passed')

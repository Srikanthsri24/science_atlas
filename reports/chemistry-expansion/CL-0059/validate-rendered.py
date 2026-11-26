from pathlib import Path
import json,math,re
p=Path(__file__).parent

def physics(q,t=None):
 W,D,S,T,k,delay,t0=[q[n] for n in ['waterG','dissolvedChargeG','seedG','temperatureC','rateSInv','nucleationDelayS','timeS']];t=t0 if t is None else t;capacity=W*(31.6+32.3*(T-20)/20)/100;M=D+S;target=min(M,capacity);A=D-target;tau=delay if S==0 and A>0 else 0;u=max(0,t-tau);lag=A*math.exp(-k*u);dissolved=target+lag;solid=-lag if A<0 and M==target else S+A*(-math.expm1(-k*u));volume=solid/2.109;scale=(volume/21/(1.6*1.6/2*1.1*11/15))**(1/3) if volume>0 else 0;area=128*4.5**2*math.sin(2*math.pi/128)/2;height=(W+.45*dissolved+volume)/area
 return dict(capacity=capacity,dissolved=dissolved,solid=solid,newSolid=solid-S,ratio=dissolved/capacity,total=M,whole=W+M,height=height,width=1.6*scale,crystalHeight=1.1*scale,rate=k*lag if t>tau else 0)
def near(a,b):assert math.isclose(float(a),b,rel_tol=1e-8,abs_tol=1e-6),(a,b)
for v in json.loads((p/'rendered-svg-states.json').read_text()):
 qs=[v['inputs']['a']]+([v['inputs']['b']] if v['inputs']['paired'] else[]);W,H=map(float,v['viewBox'].split()[2:])
 if v['pane']=='apparatus':
  assert len(v['cells'])==len(qs)
  for q,c in zip(qs,v['cells']):
   s=physics(q);k=c['scale'];bottom=c['bottom'];mid=c['mid'];r=c['liquid'];near(r['x'],mid-4.5*k);near(r['width'],9*k);near(r['y'],bottom-s['height']*k);near(r['height'],s['height']*k)
   for name,key in [('dissolvedG','dissolved'),('crystalG','solid'),('totalSaltG','total'),('wholeMassG','whole'),('liquidTopHeightCm','height')]:near(c['state'][name],s[key])
   assert len(c['forms'])==(5 if s['solid']>0 else 0)
   for index,f in enumerate(c['forms']):
    near(f['data-form-mass-g'],s['solid']/21);values=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[-+]?\d+)?',f['d'],re.I)));x=mid+(-2+index)*1.65*k;w=s['width']*k/2;h=s['crystalHeight']*k
    expected=[x,bottom,x+w,bottom-.2*h,bottom-.8*h,x,bottom-h,x-w,bottom-.8*h,bottom-.2*h];assert len(values)==len(expected)
    for a,b in zip(values,expected):near(a,b)
   assert len(c['transfer'])==(5 if s['rate']!=0 else 0)
   for m in c['transfer']:near(m['data-rate-weight-gs'],abs(s['rate'])/12);assert m['data-growth-transfer']==('to solid' if s['rate']>0 else 'to solution')
 else:
  ymax=max(1.1,*[q['dissolvedChargeG']/physics(q)['capacity'] for q in qs])*1.05 if v['metric']=='ratio' else max(1,*[max(physics(q)['total'],physics(q)['capacity']) for q in qs])*1.05
  assert len(v['series'])==len(qs)
  for q,c in zip(qs,v['series']):
   times=json.loads(c['data-history-times']);values=json.loads(c['data-history-values']);near(times[0],0);near(times[-1],min(q['timeS'],v['window']));assert all(t<=q['timeS']+1e-8 for t in times);xy=[list(map(float,z.split(','))) for z in c['points'].split()]
   for t,value,(x,y) in zip(times,values,xy):near(value,physics(q,t)[v['metric']]);near(x,75+(W-120)*t/v['window']);near(y,H-220-(H-420)*value/ymax)
 b=v['box']
 for z in v['texts']:
  assert z['x']>=b['x']-.5 and z['x']+z['width']<=b['x']+b['width']+.5,('horizontal clipping',z)
  assert z['y']>=b['y']-.5 and z['y']+z['height']<=b['y']+b['height']+.5,('vertical clipping',z)
 for i,a in enumerate(v['texts']):
  for z in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],z['x']+z['width'])-max(a['x'],z['x']);dy=min(a['y']+a['height'],z['y']+z['height'])-max(a['y'],z['y']);assert not(dx>.75 and dy>.75),('text overlap',a['text'],z['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print('PASS:actual SVG crystal/liquid dimensions,mass inventories,transfer directions,elapsed-only curves andtext bounds/overlaps')

from pathlib import Path
import json,math
p=Path(__file__).parent

def physics(q,t=None):
 W,D,T,P,F,C,t0=[q[k] for k in ['waterG','dyeMg','initialTemperatureC','netPowerW','coolantFlowMlMin','coolantInletC','timeS']];t=t0 if t is None else t;warm=W*4.18*(100-T);tb=warm/P;rate=P/2256;dur=.5*W/rate;stop=tb+dur;clamp=lambda delay:max(0,min(dur,t-tb-delay));v=rate*clamp(0);arr=rate*clamp(3);caprate=F/60*4.18;cap=min(caprate*20,caprate*(100-C)*(-math.expm1(-2/caprate))) if F>0 else 0;eta=min(1,cap/P);rec=eta*rate*clamp(4);heat=P*min(t,stop);sen=min(heat,warm)
 return dict(pot=W-v,vapour=v-arr,drain=eta*arr-rec,receiver=rec,vent=(1-eta)*arr,heat=heat,sensible=sen,latent=v*2256,temperature=T+sen/(W*4.18))
def near(a,b):assert math.isclose(float(a),b,abs_tol=1e-6,rel_tol=1e-9),(a,b)
for v in json.loads((p/'rendered-svg-states.json').read_text()):
 q=v['inputs'];s=physics(q);k=v['scale'];base=v['base'];cx=v['centre'];W,H=map(float,v['viewBox'].split()[2:])
 if v['pane']=='apparatus':
  lo,hi=0,9
  for _ in range(70):
   h=(lo+hi)/2
   if math.pi*h*h*(4.5-h/3)<s['pot']:lo=h
   else:hi=h
  h=(lo+hi)/2;pot=v['pot'];near(pot['x'],cx-15.5*k);near(pot['y'],base-(1.5+h)*k);near(pot['height'],h*k);near(pot['width'],9*k)
  if s['receiver']>0:
   r=v['receiver'];rh=s['receiver']/(9*math.pi);near(r['height'],rh*k);near(r['y'],base-(.5+rh)*k);near(r['x'],cx+13*k);near(r['width'],6*k)
  else:assert v['receiver'] is None
  for kind in ['vapour','drain']:near(sum(float(m['data-weight-g']) for m in v['markers'] if m['data-still-marker']==kind),s[kind])
  if q['coolantFlowMlMin']==0:assert not any(m['data-still-marker']=='coolant' for m in v['markers'])
  def point(path,f):
   lengths=[math.dist(a,b) for a,b in zip(path,path[1:])];d=max(0,min(1,f))*sum(lengths)
   for index,length in enumerate(lengths):
    if d<=length or index==len(lengths)-1:return [path[index][j]+(path[index+1][j]-path[index][j])*d/length for j in range(3)]
    d-=length
  paths={'vapour':[[-11,10.5,0],[-11,14,0],[-5,14,0],[11,8,0]],'drain':[[11,8,0],[16,6.5,0],[16,5.5,0]],'coolant':[[10,4,3],[10,8.375,.65],[-4,13.625,.65],[-4,10,4],[-1,10,4]],'vent':[[16,5.5,0],[19,7,0],[20,10,0]]}
  tb=q['waterG']*4.18*(100-q['initialTemperatureC'])/q['netPowerW'];stop=tb+q['waterG']*.5*2256/q['netPowerW']
  for kind,path0 in paths.items():
   markers=[m for m in v['markers'] if m['data-still-marker']==kind]
   for i,m in enumerate(markers):
    if kind in ['vapour','drain']:
     delay=3 if kind=='vapour' else 1;start=tb if kind=='vapour' else tb+3;end=stop if kind=='vapour' else stop+3;age=max(0,q['timeS']-end)+(min(delay,q['timeS']-start)-max(0,q['timeS']-end))*((q['timeS']/delay+i/12)%1);f=age/delay
    else:f=(q['timeS']*q['coolantFlowMlMin']/18000+i/10)%1 if kind=='coolant' else (q['timeS']*.4+i/6)%1
    position=point(path0,f);near(m['cx'],cx+position[0]*k);near(m['cy'],base-position[1]*k)

 else:
  keys=['pot','vapour','drain','receiver','vent'] if v['pane']=='mass' else ['heat','sensible','latent'];assert len(v['series'])==len(keys);window=v['window'];heatMax=q['waterG']*4.18*(100-q['initialTemperatureC'])+q['waterG']*.5*2256
  for j,z in enumerate(v['series']):
   times=json.loads(z['data-history-times']);near(times[0],0);near(times[-1],min(window,q['timeS']));assert all(t<=q['timeS']+1e-8 for t in times)
   xy=[list(map(float,x.split(','))) for x in z['points'].split()]
   for i,t in enumerate(times):
    s0=physics(q,t);x=70+(W-110)*t/window;near(xy[i][0],x)
    if v['pane']=='mass':
     low=sum(s0[z] for z in keys[:j]);high=low+s0[keys[j]];near(xy[i][1],H-265-(H-455)*high/q['waterG']);near(xy[2*len(times)-1-i][0],x);near(xy[2*len(times)-1-i][1],H-265-(H-455)*low/q['waterG'])
    else:near(xy[i][1],H-265-(H-455)*s0[keys[j]]/heatMax)
 b=v['box']
 for z in v['texts']:
  assert z['x']>=b['x']-.5 and z['x']+z['width']<=b['x']+b['width']+.5,('horizontal clipping',z)
  assert z['y']>=b['y']-.5 and z['y']+z['height']<=b['y']+b['height']+.5,('vertical clipping',z)
 for i,a in enumerate(v['texts']):
  for z in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],z['x']+z['width'])-max(a['x'],z['x']);dy=min(a['y']+a['height'],z['y']+z['height'])-max(a['y'],z['y']);assert not(dx>.75 and dy>.75),('text overlap',a['text'],z['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print('PASS:actual SVG liquid geometry,mass/transport inventories,elapsed-only water/heat curves and text bounds/overlaps')

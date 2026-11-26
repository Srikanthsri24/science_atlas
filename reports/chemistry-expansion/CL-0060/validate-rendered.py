"""Independent Python reconstruction of captured SVG and 3D readout evidence.
No application module is imported. This checks render/model coupling, not
calibration of the chosen teaching kinetics against real experiments.
"""
from pathlib import Path
import json, math, re

ROOT=Path(__file__).parent
CACHE={}
def solubility(t):
    lo,hi,a,b=(20,40,31.6,63.9) if t<=40 else (40,60,63.9,110) if t<=60 else (60,80,110,169)
    return a+(b-a)*(t-lo)/(hi-lo)
def temperature(t,duration): return 80-60*min(1,t/duration)
def area(x,n): return (36*math.pi)**(1/3)*(x/2.109)**(2/3)*n**(1/3) if x>0 and n>0 else 0
def advance(q,duration,t,dt,p):
    x,n=p;c=q['waterG']*solubility(temperature(t+dt/2,duration))/100
    available=max(0,q['saltG']-c-x);sigma=max(0,(q['saltG']-x)/c-1)
    born=min(q['nucleationPerS']*max(0,sigma-q['threshold'])**2*dt,available/.0001)
    n+=born;birth=born*.0001;x+=birth
    growth=max(0,available-birth)*(-math.expm1(-q['growthFluxGcm2s']*area(x,n)/c*dt))
    return x+growth,n
def physics(q,program,t=None):
    t=q['timeS'] if t is None else t
    duration=q['fastCoolingS']*(q['slowMultiplier'] if program=='slow' else 1)
    key=tuple(q[k] for k in ['waterG','saltG','growthFluxGcm2s','nucleationPerS','threshold'])+(duration,)
    if key not in CACHE:
        states=[(0,0)]
        for i in range(1,48001):states.append(advance(q,duration,(i-1)*.05,.05,states[-1]))
        CACHE[key]=states
    i=math.floor(t/.05);remainder=t-i*.05
    x,n=advance(q,duration,i*.05,remainder,CACHE[key][i]) if remainder>0 else CACHE[key][i]
    temp=temperature(t,duration);c=q['waterG']*solubility(temp)/100;d=q['saltG']-x
    sigma=max(0,d/c-1);birth=q['nucleationPerS']*max(0,sigma-q['threshold'])**2
    radius=(3*x/(4*math.pi*2.109*n))**(1/3) if n>0 else 0
    scale=(x/2.109/21/(1.6*1.6/2*.9*11/15))**(1/3) if x>0 else 0
    floor=128*4.7**2*math.sin(2*math.pi/128)/2
    return dict(temperature=temp,solid=x,dissolved=d,sites=n,meanRadius=radius,
        supersaturation=sigma,capacity=c,width=1.6*scale,height=.9*scale,
        halfWidth=1.6*scale/(2*math.sqrt(2)),liquidDepth=(q['waterG']+.45*d+x/2.109)/floor,
        totalRate=q['growthFluxGcm2s']*area(x,n)*sigma+.0001*birth)
def near(actual,expected):
    assert math.isclose(float(actual),expected,rel_tol=2e-8,abs_tol=2e-6),(actual,expected)
def check_state(s,p):
    for name,key in [('temperatureC','temperature'),('crystalG','solid'),('dissolvedG','dissolved'),
        ('sites','sites'),('meanEquivalentRadiusCm','meanRadius'),('supersaturation','supersaturation'),
        ('capacityG','capacity'),('liquidDepthCm','liquidDepth'),('totalCrystalRateGS','totalRate')]:near(s[name],p[key])

svg=json.loads((ROOT/'rendered-svg.json').read_text())
for v in svg:
    q=v['inputs'];W,H=map(float,v['viewBox'].split()[2:]);programs=['fast','slow']
    expected=[physics(q,p) for p in programs]
    if v['pane']=='apparatus':
        assert len(v['cells'])==2
        for i,c in enumerate(v['cells']):
            attrs=c['attrs'];state=json.loads(attrs['data-cooling-state']);p=expected[i];check_state(state,p)
            k=float(attrs['data-cooling-scale']);bottom=float(attrs['data-cooling-bottom']);mid=float(attrs['data-cooling-mid']);liquid=c['liquid']
            near(liquid['x'],mid-4.7*k);near(liquid['width'],9.4*k)
            near(liquid['height'],p['liquidDepth']*k);near(liquid['y'],bottom-p['liquidDepth']*k)
            assert len(c['crystals'])==(5 if p['solid']>0 else 0)
            for j,f in enumerate(c['crystals']):
                near(f['data-form-mass-g'],p['solid']/21)
                values=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[-+]?\d+)?',f['d'],re.I)))
                x=mid+(j-2)*1.65*k;w=p['halfWidth']*k;h=p['height']*k
                points=[x,bottom,x+w,bottom-.2*h,bottom-.8*h,x,bottom-h,x-w,bottom-.8*h,bottom-.2*h]
                assert len(values)==len(points)
                for a,b in zip(values,points):near(a,b)
            assert len(c['transfers'])==(5 if p['totalRate']>1e-9 else 0)
            for j,m in enumerate(c['transfers']):
                near(m['data-rate-weight-gs'],p['totalRate']/5)
                u=(q['timeS']*.025+j/5)%1;x=mid+(j-2)*1.65*k
                y=bottom-(p['height']+.04+(1-u)*max(.06,p['liquidDepth']-p['height']-.08))*k
                values=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[-+]?\d+)?',m['d'],re.I)))
                for a,b in zip(values,[x-3,y,3,5,3,-5]):near(a,b)
            if p['sites']>0:
                assert c['equivalent'];scale=(27 if W==600 else 36)/max(1,*[s['meanRadius'] for s in expected])
                near(c['equivalent']['data-size-scale'],scale);near(c['equivalent']['r'],p['meanRadius']*scale)
            else:assert c['equivalent'] is None
    else:
        assert len(v['series'])==2;all_values=[]
        for program,series in zip(programs,v['series']):
            times=json.loads(series['data-history-times']);values=json.loads(series['data-history-values'])
            near(times[0],0);near(times[-1],min(q['timeS'],v['window']))
            assert all(t<=q['timeS']+1e-9 for t in times)
            for t,value in zip(times,values):near(value,physics(q,program,t)[v['metric']])
            all_values+=values
        ymax=85 if v['metric']=='temperature' else max(.01,*all_values)*1.1
        for series in v['series']:
            times=json.loads(series['data-history-times']);values=json.loads(series['data-history-values'])
            points=[list(map(float,p.split(','))) for p in series['points'].split()]
            for t,value,(x,y) in zip(times,values,points):
                near(x,75+(W-125)*t/v['window']);near(y,H-220-(H-420)*value/ymax)
    b=v['box']
    for z in v['text']:
        assert z['x']>=b['x']-.5 and z['x']+z['w']<=b['x']+b['width']+.5,('horizontal clipping',v['label'],z)
        assert z['y']>=b['y']-.5 and z['y']+z['h']<=b['y']+b['height']+.5,('vertical clipping',v['label'],z)
    for i,a in enumerate(v['text']):
        for z in v['text'][i+1:]:
            dx=min(a['x']+a['w'],z['x']+z['w'])-max(a['x'],z['x']);dy=min(a['y']+a['h'],z['y']+z['h'])-max(a['y'],z['y'])
            assert not(dx>.75 and dy>.75),('text overlap',v['label'],a['text'],z['text'],dx,dy)
    assert v['pageWidth']<=v['width'],('page overflow',v['label'])

three=json.loads((ROOT/'rendered-3d.json').read_text())
for v in three:
    for program,s in zip(['fast','slow'],v['states']):check_state(s,physics(v['inputs'],program))
    assert v['canvasMatchesWrapper'] and v['readoutsInside'] and v['notesInside'],('containment',v['label'])
    assert v['visibleHeight']>=70 and v['pageWidth']<=v['width'],('visibility',v['label'])
print(f'PASS: {len(svg)} actual SVG states and {len(three)} actual 3D states: independent inventory, temperature, population, size, dimensions, transfer, histories, text bounds and containment.')

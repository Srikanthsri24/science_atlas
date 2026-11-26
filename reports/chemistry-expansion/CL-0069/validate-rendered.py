import json,re,math
from pathlib import Path
p=Path(__file__).parent;points=0;apparatus=0;area=64*math.sin(2*math.pi/128)*2.2**2

def state(t,kind):
 u=t/100;C=20 if kind=='reference' else 20+10*(3*u*u-2*u*u*u);T=C+273.15;T0=293.15;h0=.0013*math.exp(1500*(1/T0-1/298.15));N=h0*.1*.21+.21*.1/(.08314462618*T0);h=.0013*math.exp(1500*(1/T-1/298.15));D=h*.1;G=.1/(.08314462618*T);po=N/(D+G);mgL=D*po*31.9988*1000/.1;return C,po,po+.79*T/T0,mgL

def near(a,b,tol=1e-7):assert abs(float(a)-b)<tol,(a,b)
rows=[json.loads(v) for v in (p/'responsive-2d.jsonl').read_text().splitlines()]
for s in rows:
 assert s['width']==s['scroll'] and s['svgHeight']>0
 for a in s['apparatus']:
  C,po,pd,mg=state(float(a['time']),a['kind']);near(a['temperature'],C);near(a['oxygen'],po);near(a['dry'],pd);near(a['dissolved'],mg);scale=float(a['scale']);near(a['waterH'],100/area*scale);near(a['gasH'],100/area*scale);near(a['thermoY'],float(a['base'])-(1.5+6*C/35)*scale)
  angle=(-120+240*((po-.05)/.35 if a['mode']=='oxygen' else (pd-.7)/.6))*math.pi/180;near(a['angle'],angle);x1,y1,x2,y2=map(float,a['needle']);r=16 if s['view']=='comparison' else 26;near(x2-x1,r*math.sin(angle));near(y2-y1,-r*math.cos(angle));apparatus+=1
 portrait=s['format']=='portrait';left=95 if portrait else 110;pw=435 if portrait else 820;ph=560 if portrait else 370
 for curve in s['curves']:
  metric=curve['metric'];high=state(0,'reference')[3]*1.15 if metric=='dissolved' else 35 if metric=='temperature' else 1.3;near(curve['high'],high)
  vs=re.findall(r'[ML]([\d.e+\-]+),([\d.e+\-]+)',curve['d']);assert len(vs)==61
  for i,(x,y) in enumerate(vs):
   t=float(s['time'])*i/60;C,po,pd,mg=state(t,curve['kind']);value=mg if metric=='dissolved' else C if metric=='temperature' else pd;near(x,left+t/100*pw,1e-4);near(y,120+ph-value/high*ph,1e-4);points+=1
states=[json.loads(v) for v in (p/'responsive-3d.jsonl').read_text().splitlines()]
for s in states:
 assert s['width']==s['scroll'] and s['canvas']['w']>0 and s['canvas']['h']>0;C,po,pd,mg=state(float(s['time']),'programmed');near(s['temperature'],C);near(s['oxygen'],po);near(s['dry'],pd);near(s['dissolved'],mg)
r=dict(status='passed',twoDCases=len(rows),apparatusStates=apparatus,independentCurvePoints=points,threeDStates=len(states),minimumSvgHeight=min(s['svgHeight'] for s in rows));(p/'independent-rendered-validation.json').write_text(json.dumps(r,indent=2)+'\n');print(r)

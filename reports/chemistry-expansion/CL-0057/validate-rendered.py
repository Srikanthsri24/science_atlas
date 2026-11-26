from pathlib import Path
import json,math
p=Path(__file__).parent

def physics(q,t=None):
 C,k,a,d,L,I,T=[q[x] for x in ['initialSuspendedMgL','settlingRateSInv','colourAbsorptionMInv','dilutionFactor','pathCm','sourceMw','timeS']];T=T if t is None else t;L/=100;f=math.exp(-k*T);c=C/d*f;s=.1*c;mu=s+a/d+.02;direct=I*math.exp(-mu*L);blank=I*math.exp(-.02*L);side=I*.01*s*L*math.exp(-mu*L)
 return dict(suspendedMgL=c,transmissionPct=100*direct/blank,sidePct=100*side/blank,suspendedParticleMg=C/d*.1*f,settledParticleMg=C/d*.1*(-math.expm1(-k*T)),initialParticleMg=C/d*.1,directMw=direct,sideMw=side)
def near(a,b):assert math.isclose(a,b,rel_tol=1e-9,abs_tol=1e-7),(a,b)
for v in json.loads((p/'rendered-svg-states.json').read_text()):
 states=[v['inputs']['a']]+([v['inputs']['b']] if v['inputs']['paired'] else[]);W,H=map(float,v['viewBox'].split()[2:])
 if v['pane']=='apparatus':
  assert len(v['cells'])==len(states)
  for q,c in zip(states,v['cells']):
   s=physics(q)
   for key in ['suspendedMgL','suspendedParticleMg','settledParticleMg','initialParticleMg','directMw','sideMw']:near(c['state'][key],s[key])
   near(sum(x['weight'] for x in c['upper']),s['suspendedParticleMg']);near(sum(x['weight'] for x in c['bed']),s['settledParticleMg'])
   assert len([x for x in c['rays'] if x['type']=='side'])==(6 if s['sideMw']>0 else 0)
 else:
  assert len(v['series'])==len(states)
  ymax=100 if v['metric']=='transmissionPct' else .4 if v['metric']=='sidePct' else max(1,*[q['initialSuspendedMgL']/q['dilutionFactor'] for q in states])
  for q,c in zip(states,v['series']):
   assert c['times'][0]==0;near(c['times'][-1],q['timeS']);assert all(t<=q['timeS']+1e-9 for t in c['times']);xy=[list(map(float,x.split(','))) for x in c['points'].split()]
   for t,value,(x,y) in zip(c['times'],c['values'],xy):near(value,physics(q,t)[v['metric']]);near(x,80+(W-125)*t/300);near(y,H-180-(H-370)*value/ymax)
 b=v['box']
 for t in v['texts']:
  assert t['x']>=b['x']-.5 and t['x']+t['width']<=b['x']+b['width']+.5,('horizontal clipping',t)
  assert t['y']>=b['y']-.5 and t['y']+t['height']<=b['y']+b['height']+.5,('vertical clipping',t)
 for i,a in enumerate(v['texts']):
  for z in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],z['x']+z['width'])-max(a['x'],z['x']);dy=min(a['y']+a['height'],z['y']+z['height'])-max(a['y'],z['y']);assert not(dx>.75 and dy>.75),('text overlap',a['text'],z['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print('PASS:actual SVG model quantities,representative mass budgets,elapsed-only curves and text bounds/overlaps')

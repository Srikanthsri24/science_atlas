"""Independent water-reference rigid transform and actual rendered atom checks."""
import json,math
from pathlib import Path
p=Path(__file__).parent
cases=[json.loads(s) for s in (p/'responsive-rendered.jsonl').read_text().splitlines()]
checks=0;atoms=0
length=.0958;theta=104.5*math.pi/360;raw=[('O',[0,0,0]),('H',[-length*math.sin(theta),length*math.cos(theta),0]),('H',[length*math.sin(theta),length*math.cos(theta),0])];mass={'H':1.008,'O':15.999};com=[sum(mass[k]*a[j] for k,a in raw)/18.015 for j in range(3)];base=[(k,[v-com[i] for i,v in enumerate(a)]) for k,a in raw]
for c in cases:
 assert c['documentWidth']<=c['width']+1,(c['label'],'overflow')
 assert c['canvas']['w']>100 and c['canvas']['h']>100,(c['label'],'collapsed')
 assert c['canvas']['w']<=c['root']['w']+1
 if c['atoms'] is not None:
  assert c['atoms']=='72' and c['entities']=='24' and c['classification']=='compound';checks+=3
 for e in c['world']:
  assert e['species']=='water' and len(e['atoms'])==3
  i=int(e['id']);t=float(c['time']);f=lambda n:(math.sin((i+1)*n)*43758.5453)%1;z=2*f(12.9898)-1;phi=2*math.pi*f(78.233);r=math.sqrt(1-z*z);direction=[r*math.cos(phi),z,r*math.sin(phi)];speed=math.sqrt(3*1.380649e-23*298.15/(18.015*1.66053906892e-27))*.001
  centre=[]
  for seed,d in zip([39.3467,11.135,83.155],direction):
   x=(f(seed)*100+d*speed*t)%200;centre.append((x if x<=100 else 200-x)-50)
  a,b,d=[f(seed)*2*math.pi+t*v for seed,v in [(19.91,.013),(4.7,.017),(3.21,.011)]];inspect='inspect' in c['label']
  for observed,(symbol,pos) in zip(e['atoms'],base):
   assert observed['symbol']==symbol
   x,y,z=pos;u=x*math.cos(d)-y*math.sin(d);v=x*math.sin(d)+y*math.cos(d);x1=u*math.cos(b)+z*math.sin(b);z1=-u*math.sin(b)+z*math.cos(b);rot=[x1,v*math.cos(a)-z1*math.sin(a),v*math.sin(a)+z1*math.cos(a)];expected=rot if inspect else [centre[j]+30*rot[j] for j in range(3)];got=list(map(float,observed['position'].split(',')))
   assert all(math.isclose(x,y,abs_tol=1e-8) for x,y in zip(got,expected)),(c['label'],i,symbol,got,expected);atoms+=1
out={'status':'passed','actualCases':len(cases),'independent3DReadings':checks,'independentRenderedAtoms':atoms,'noPageOverflow':True,'positiveContainedViewers':True};(p/'independent-rendered-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)

"""Independent actual SVG andcontact geometry reconstruction;no application imports."""
from pathlib import Path
import json,math,re
r=Path(__file__).parent;states=json.loads((r/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6
profiles={'reference':(10,15,1),'saltFree':(10,15,0),'moreFines':(20,10,1)}
for v in states:
 p=v['parameters'];V=float(p['solutionMl']);S=float(p['sieveUm']);F=float(p['filterUm']);T=float(p['timeS']);f=min(1,T/60);sand,gravel,C=profiles[p['profile']];k=float(v['svg']['data-method-scale']);base=float(v['svg']['data-method-base']);sy=lambda y:base-y*k
 for q,opening in zip(v['arms'],[S,F]):
  x=float(q['attrs']['data-method-centre']);ret=(sand if 150>=opening else 0)*f+(gravel if 3000>=opening else 0)*f;passed=(sand+gravel)*f-ret;source=(V+(sand+gravel)/2.65)*(1-f);receiver=V*f+passed/2.65;R=math.sqrt(50/math.pi)*k
  for name,amount,bottom in [('source',source,sy(8)),('receiver',receiver,sy(-5))]:
   if amount>1e-8:
    a=q[name]
    for key,expected in [('x',x-R),('y',bottom-amount/50*k),('width',2*R),('height',amount/50*k)]:assert near(a[key],expected)
   else:assert q[name] is None or float(q[name]['height'])<1e-8
  assert abs(float(q['dry'].split()[1])-ret)<.000501;assert abs(float(q['collected'].split()[1])-V*f)<.000501;assert abs(float(q['passed'].split()[2])-passed)<.000501
  if ret>1e-8:
   a=q['retained']
   if q['attrs']['data-method-arm']=='sieve':assert near(float(a['height'])/k*math.pi*9*.6*2.65,ret)
   else:
    n=list(map(float,re.findall(r'-?\d+(?:\.\d+)?(?:e[+-]?\d+)?',a['d'])));Rt=(n[2]-n[0])/2/k;Rb=(n[3]-n[5])/2/k;h=(n[4]-n[1])/k;assert near(math.pi*h/3*(Rt*Rt+Rt*Rb+Rb*Rb)*.6*2.65,ret)
  else:assert q['retained'] is None or float(q['retained'].get('height',0))<1e-8
  if passed>1e-8:assert near(q['receiverGrains']['height'],passed/2.65/.6/50*k)
 diameter=150 if p['particle']=='sand' else 3000;world=5/max(diameter,S,F)
 for i,q in enumerate(v['openings']):
  opening=[S,F][i];a=q['attrs'];mk=float(a['data-method-micro-scale']);x=float(a['data-method-micro-x']);slot=float(a['data-method-slot-y']);radius=diameter*world/2;gap=opening*world
  assert near(a['data-method-world-per-um'],world);assert near(q['grain']['r'],radius*mk);assert near(q['grain']['cx'],x)
  assert near(float(q['right']['x'])-(float(q['left']['x'])+float(q['left']['width'])),gap*mk)
  start=.15+radius+2.5;contact=.15+math.sqrt(max(0,radius*radius-gap*gap/4));y=start+(contact-start)*min(1,f/.35) if diameter>=opening else start+(-radius-2.5-start)*f
  assert near(q['grain']['cy'],slot-y*mk)
  if diameter>opening and f>=.35:assert near((float(q['grain']['cy'])-(slot-.15*mk))**2+(gap*mk/2)**2,(radius*mk)**2)
 box=v['svgBox']
 for q in v['texts']:
  assert q['x']>=box['x']-.5 and q['x']+q['width']<=box['x']+box['width']+.5,('horizontal clipping',q)
  assert q['y']>=box['y']-.5 and q['y']+q['height']<=box['y']+box['height']+.5,('vertical clipping',q)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('text overlap',a['text'],b['text'],dx,dy)
 assert not v['zoomOverlayCollisions']
print(f'{len(states)} actual SVG states independently verify displaced fill volumes,dry residues,passing grains,matched magnification andexact grain/edge contact;label bounds/overlaps passed.')

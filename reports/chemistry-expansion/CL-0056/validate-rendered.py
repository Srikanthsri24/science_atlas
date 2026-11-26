"""Independent actual SVG,transfer andelapsed-chart reconstruction;no app imports."""
from pathlib import Path
import json,math,re
p=Path(__file__).parent;states=json.loads((p/'rendered-svg-states.json').read_text());near=lambda a,b:abs(float(a)-b)<1e-6

def physics(q,T=None):
 W,S,k,t=q['waterG'],q['saltG'],q['rateSInv'],q['timeS'] if T is None else T;a=S/10;R=S*min(1,t/10);u=max(0,t-.1);A=S*min(1,u/10);C=.36*W;M=min(S,C);tr=min(10,C/a)
 ramp=lambda z:a/k*(k*z+math.expm1(-k*z));end=ramp(tr)
 if t<=tr+.1:D=ramp(u);U=A-D
 else:lag=(M-end)*math.exp(-k*(t-.1-tr));D=M-lag;U=A-M+lag
 return dict(cup=S-R,transit=R-A,undissolved=U,dissolved=D)
for v in states:
 q=v['inputs'];s=physics(q);k=float(v['svg']['data-closed-scale']);base=float(v['svg']['data-closed-base']);cx=float(v['svg']['data-closed-centre']);pane=v['svg']['data-closed-pane'];W,H=map(float,v['svg']['viewBox'].split()[2:]);bed=s['undissolved']/2.165/.6/40;water=max(s['undissolved']/2.165/.6,q['waterG']/.997+s['dissolved']*.28+s['undissolved']/2.165)/40;cup=s['cup']/2.165/.6/(math.pi*1.8**2)
 if pane=='apparatus':
  for key,h,bottom,radius in [('liquid',water,1,math.sqrt(40/math.pi)),('bed',bed,1,math.sqrt(40/math.pi)),('cup',cup,8,1.8)]:
   z=v.get(key)
   if h>1e-10:
    assert z is not None,(key,q)
    for name,value in [('x',cx-radius*k),('y',base-(bottom+h)*k),('width',2*radius*k),('height',h*k)]:assert near(z[name],value),(key,name,z[name],value)
   else:assert z is None or float(z.get('height',0))<1e-8
  assert near(sum(float(z['data-weight-g']) for z in v['transit']),s['transit'])
  for j,z in enumerate(v['transit']):
   age=max(0,q['timeS']-10)+(min(.1,q['timeS'])-max(0,q['timeS']-10))*((q['timeS']/.1+j/12)%1);Y=8-(8-(1+water))*age/.1
   assert near(float(z['x'])+.05*k,cx+.25*math.sin(j*2.4)*k);assert near(float(z['y'])+.05*k,base-Y*k)
  expectedReading=150+q['waterG']+q['saltG'] if q['reading']=='gross' else q['waterG']+q['saltG'];assert near(float(v['reading'].split()[0]),expectedReading)
 else:
  window=float(v['svg']['data-closed-window']);keys=['cup','transit','undissolved','dissolved'];assert len(v['series'])==4
  for index,z in enumerate(v['series']):
   times=json.loads(z['data-history-times']);assert times[0]==0 and abs(times[-1]-min(window,q['timeS']))<1e-7;assert all(t<=q['timeS']+1e-8 for t in times)
   n=len(times);xy=[list(map(float,point.split(','))) for point in z['points'].split()];assert len(xy)==2*n
   for i,t in enumerate(times):
    s0=physics(q,t);lo=sum(s0[key] for key in keys[:index]);hi=lo+s0[keys[index]];X=70+(W-110)*t/window;sy=lambda m:H-250-(H-445)*m/q['saltG'];assert near(xy[i][0],X) and near(xy[i][1],sy(hi));assert near(xy[2*n-1-i][0],X) and near(xy[2*n-1-i][1],sy(lo))
 box=v['box']
 for z in v['texts']:
  assert z['x']>=box['x']-.5 and z['x']+z['width']<=box['x']+box['width']+.5,('horizontal clipping',pane,z)
  assert z['y']>=box['y']-.5 and z['y']+z['height']<=box['y']+box['height']+.5,('vertical clipping',pane,z)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y']);assert not(dx>.75 and dy>.75),('text overlap',pane,a['text'],b['text'],dx,dy)
 assert v['pageWidth']<=v['width']
print(f'{len(states)} actual SVG states independently verify reference volumes,finite transfer andelapsed-only history;label bounds/overlaps passed.')

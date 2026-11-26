"""Independent reconstruction of actual DOM/SVG states; no app-model imports."""
import json,math,re
from pathlib import Path
root=Path(__file__).parent
area=128*math.sin(2*math.pi/128)/2
vessel_area=area*2.5**2;barrel_area=area*.8**2
unit_area=32*math.sin(2*math.pi/32)/2
unit_volume=sum(unit_area*(math.cos(math.pi*j/24)-math.cos(math.pi*(j+1)/24))*(math.sin(math.pi*j/24)**2+math.sin(math.pi*j/24)*math.sin(math.pi*(j+1)/24)+math.sin(math.pi*(j+1)/24)**2)/3 for j in range(24))
def near(a,b,tol=1e-8):
 assert abs(float(a)-float(b))<=tol*max(1,abs(float(b))),(a,b)
def ph_at(c,v):
 acid=c['acidMl']*c['acidMolL']/1000;base=v*c['baseMolL']/1000;litres=(c['acidMl']+v)/1000;d=(acid-base)/litres
 # Solve independently with hydroxide first on the basic branch.
 if d<0:oh=(-d+math.sqrt(d*d+4e-14))/2;h=1e-14/oh
 else:h=(d+math.sqrt(d*d+4e-14))/2
 return -math.log10(h)
def model(c):
 dose=c['plannedBaseMl'];N=int(c['aliquots']);drop=dose/N;r=(drop/unit_volume)**(1/3) if drop else 0;t=c['timeS'];events=[]
 for i in range(N):
  release=2+i*c['intervalS'];surface=1.5+(c['acidMl']+i*drop)/vessel_area;flight=math.sqrt(2*(7-2*r-surface)/981)
  events.append((release,release+flight,surface))
 nr=sum(t>=e[0] for e in events) if dose else 0;na=sum(t>=e[1] for e in events) if dose else 0
 v=dose*(na/N);reservoir=dose*((N-nr)/N)
 return dict(nr=nr,na=na,delivered=v,reservoir=reservoir,flight=dose*((nr-na)/N),vessel=c['acidMl']+v,pH=ph_at(c,v),r=r,events=events)
def defaults(t):return dict(acidMl=20,acidMolL=.01,baseMolL=.01,plannedBaseMl=40,aliquots=400,intervalS=.2,timeS=t)
for mode in ['3d','2d']:
 frames=json.loads((root/f'guide-{mode}-frames.json').read_text())
 assert float(frames[-1]['timeline'])==120 and frames[-1]['recordEnabled']
 for f in frames:
  t=float(f['time']);assert abs(t-min(105,max(0,(float(f['timeline'])-10)*1.05)))<.061
  s=model(defaults(t));read=f['readouts'];p=float(re.search(r'Calculated pH ([0-9.]+)',read)[1]);assert abs(p-s['pH'])<5.1e-5
  arrived=float(re.search(r'arrived ([0-9.]+) mL',read)[1]);assert abs(arrived-s['delivered'])<5.1e-4
 print(f'{len(frames)} actual {mode} guide samples reconstructed; endpoint verified')
labels={'Neutralization Initial acid volume':'acidMl','Neutralization Acid concentration':'acidMolL','Neutralization Base concentration':'baseMolL','Neutralization Planned base charge':'plannedBaseMl','Neutralization Metered aliquots':'aliquots','Neutralization Release interval':'intervalS','Neutralization physical time seconds':'timeS'}
states=json.loads((root/'rendered-states.json').read_text())
for d in states:
 assert d['viewport']['scroll']<=d['viewport']['w']+1,d['label']
 c={labels[x['label']]:float(x['value']) for x in d['controls'] if x['label'] in labels}
 if d['apparatus']:c['timeS']=float(d['apparatus']['neutralizationTime'])
 elif d['scene']:c['timeS']=float(d['scene']['neutralization-3dTime'])
 s=model(c)
 if d['apparatus']:
  a=d['apparatus'];near(a['deliveredMl'],s['delivered']);near(a['reservoirMl'],s['reservoir']);near(a['vesselMl'],s['vessel']);near(a['ph'],s['pH']);scale=float(a['scale']);base=float(a['baseY'])
  v=d['vessel'];near(float(v['height'])/scale,s['vessel']/vessel_area);near(v['y'],base-(1.5+s['vessel']/vessel_area)*scale)
  if d['reservoir']:
   r=d['reservoir'];near(float(r['height'])/scale,s['reservoir']/barrel_area);near(r['y'],base-(7.35+s['reservoir']/barrel_area)*scale)
  assert len(d['drops'])==s['nr']-s['na']
  for drop in d['drops']:
   i=int(drop['data']['neutralizationDrop']);age=c['timeS']-s['events'][i][0];centre=7-s['r']-.5*981*age*age
   near(drop['cy'],base-centre*scale);near(drop['r'],s['r']*scale)
   assert centre-s['r']>=1.5+s['vessel']/vessel_area-1e-8
 if d['scene']:near(d['scene']['neutralization-3dPh'],s['pH'])
 if d.get('curve'):
  pairs=[tuple(map(float,p.split(','))) for p in d['curve'].split()];assert len(pairs)==s['na']+1==int(d['curveCount'])
  w,h=(600,900) if d['format']=='portrait' else (1000,650);left=70 if w==600 else 90;pw=w-left-60;ph=h-210
  for i,(x,y) in enumerate(pairs):
   v=c['plannedBaseMl']*(i/c['aliquots']);near(x,left+v/max(1,c['plannedBaseMl'])*pw);near(y,110+(14-ph_at(c,v))/14*ph)
 if d['svg'] and 'zoom' not in d['label']:
  r=d['svg']
  for t in d['texts']:
   assert t['x']>=r['x']-1 and t['right']<=r['right']+1,(d['label'],t)
   assert t['y']>=r['y']-1 and t['bottom']<=r['bottom']+1,(d['label'],t)
 if d['canvas']:
  r=d['canvas'];w=d['wrapper'];assert r['h']>=70 and r['w']>0
  assert r['x']>=w['x']-1 and r['right']<=w['right']+1 and r['y']>=w['y']-1 and r['bottom']<=w['bottom']+1,d['label']
print(f'{len(states)} rendered model/geometry/curve/layout states independently reconstructed')
manual=json.loads((root/'manual-camera-check.json').read_text())
assert not manual['recordingWhilePlaying'] and manual['recordingPaused']
assert manual['paused']['controls']==manual['afterCamera']['controls']
orbit=json.loads((root/'orbit-check.json').read_text())
assert orbit['before']['controls']==orbit['after']['controls']==orbit['reset']['controls']
pixels=json.loads((root/'orbit-pixel-verification.json').read_text());assert pixels['orbitPixelMeanDifference']>1 and pixels['resetPixelMeanDifference']<1
keyboard=json.loads((root/'keyboard-notes-readouts.json').read_text())
for s in keyboard.values():assert s['total']>s['client'] and s['scroll']>0
zoom=json.loads((root/'zoom-keyboard-reset.json').read_text());assert zoom['zoom']['left']>0 and zoom['zoom']['top']>0
assert zoom['fit']['left']==zoom['fit']['top']==0 and zoom['fit']['w']==zoom['fit']['sw'] and zoom['fit']['h']==zoom['fit']['sh']
layout=json.loads((root/'phone-practical-layout.json').read_text());assert layout['blocks']==29 and not layout['overflowing'] and layout['page']==layout['viewport']==390
navigation=json.loads((root/'navigation-check.json').read_text());assert navigation['retainedTrials']==30 and navigation['class5RoundTrip']
print('Manual/record gates, actual orbit/reset, keyboard scrolling/pan, phone calculations and navigation verified')

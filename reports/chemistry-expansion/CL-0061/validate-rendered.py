"""Reconstruct captured rendering from independent analytical equations.
Checks coupling and geometry, not empirical calibration of chosen kinetics.
"""
from pathlib import Path
import json,math,re
root=Path(__file__).parent
def physics(q,t=None):
 t=q['timeS'] if t is None else t;nc=q['carbonateG']/100.086;nh=q['acidMl']/1000*q['acidMolL'];limit=min(nc,nh/2)
 rem=math.exp(-q['rateSInv']*t);extent=limit*(-math.expm1(-q['rateSInv']*t))
 carb=(nc-limit+limit*rem)*100.086;hcl=(nh-2*limit+2*limit*rem)*36.458
 salt=extent*110.978;co2=extent*44.009;water0=q['acidMl']-nh*36.458;waternew=extent*18.015
 vm=1000*8.314462618*(q['temperatureC']+273.15)/q['pressureKPa'];eq=extent*vm
 solid0=q['carbonateG']/2.71;solid=carb/2.71;freed=extent*100.086/2.71
 initialdead=155-q['acidMl']-solid0;dead=155-q['acidMl']-solid;piston=extent*(vm-100.086/2.71)
 total=initialdead+eq;air=initialdead/vm;fraction=extent/(air+extent);area=128*3.6**2*math.sin(2*math.pi/128)/2
 return dict(carbonateMol=nc,acidMol=nh,maximumExtentMol=limit,extentMol=extent,
  carbonateLeftG=carb,hclLeftG=hcl,calciumChlorideG=salt,co2G=co2,generatedWaterG=waternew,
  initialWaterG=water0,waterG=water0+waternew,contentsG=carb+hcl+salt+co2+water0+waternew,
  molarVolumeMl=vm,gasEquivalentMl=eq,initialSolidVolumeMl=solid0,solidVolumeMl=solid,
  liberatedSolidVolumeMl=freed,initialDeadSpaceMl=initialdead,deadSpaceMl=dead,syringeMl=piston,
  totalGasVolumeMl=total,initialAirMol=air,co2MoleFraction=fraction,syringeCo2Mol=extent*piston/total,
  deadSpaceCo2Mol=extent*dead/total,syringeAirMol=air*piston/total,deadSpaceAirMol=air*dead/total,
  syringeRateMlS=limit*q['rateSInv']*rem*(vm-100.086/2.71),chipEdgeCm=(solid/16)**(1/3) if solid>0 else 0,
  displacedLiquidDepthCm=(q['acidMl']+solid)/area,pistonTravelCm=piston/10,
  flaskAirAndCo2Ml=150-q['acidMl']-solid)
def near(a,b):assert math.isclose(float(a),b,rel_tol=1e-8,abs_tol=1e-8),(a,b)
def state_check(state,p):
 for key,value in p.items():near(state[key],value)
def route_point(route,f):
 lengths=[math.dist(a,b) for a,b in zip(route,route[1:])];d=f*sum(lengths)
 for i,length in enumerate(lengths):
  if d<=length:
   u=d/length;return [route[i][j]+u*(route[i+1][j]-route[i][j]) for j in [0,1]]
  d-=length
 return route[-1]
for v in json.loads((root/'rendered-svg.json').read_text()):
 q=v['inputs'];p=physics(q);state_check(v['state'],p);W,H=map(float,v['viewBox'].split()[2:]);portrait=W==600
 k,mid,bottom,sk,sx,sy=(25,165,640,12,160,220) if portrait else (35,210,490,15,500,260)
 if v['pane']=='apparatus':
  liquid=v['liquid'];near(liquid['x'],mid-3.6*k);near(liquid['width'],7.2*k)
  near(liquid['height'],p['displacedLiquidDepthCm']*k);near(liquid['y'],bottom-p['displacedLiquidDepthCm']*k)
  near(v['gas']['width'],p['pistonTravelCm']*sk);near(v['piston']['x1'],sx+p['pistonTravelCm']*sk)
  assert len(v['chips'])==(4 if p['carbonateLeftG']>0 else 0)
  for j,chip in enumerate(v['chips']):
   edge=p['chipEdgeCm']*k;near(chip['width'],edge);near(chip['height'],edge)
   near(chip['x'],mid+(j-1.5)*.7*k-edge/2);near(chip['y'],bottom-edge);near(chip['data-form-mass-g'],p['carbonateLeftG']/16)
  assert len(v['transfers'])==(5 if p['syringeRateMlS']>1e-9 else 0)
  unit=128*math.sin(2*math.pi/128)/2;base=(150-unit*5*(3.6**2+3.6*.9+.9**2)/3-unit*.9**2*2)/(unit*3.6**2)
  top=bottom-(base+5+2)*k
  route=[[mid,top],[mid,310],[110,310],[110,sy],[sx,sy]] if portrait else [[mid,top],[mid,130],[460,130],[460,sy],[sx,sy]]
  for i,marker in enumerate(v['transfers']):
   x,y=route_point(route,(q['timeS']*.035+i/5)%1);near(marker['cx'],x);near(marker['cy'],y)
 else:
  assert len(v['series'])==2
  for series in v['series']:
   times=json.loads(series['data-history-times']);values=json.loads(series['data-history-values']);near(times[0],0);near(times[-1],q['timeS']);assert all(t<=q['timeS']+1e-9 for t in times)
   points=[list(map(float,p.split(','))) for p in series['points'].split()]
   for t,value,(x,y) in zip(times,values,points):
    near(value,physics(q,t)[series['data-carbonate-series']]);near(x,80+(W-140)*t/600);near(y,H-200-(H-400)*value/200)
 b=v['box']
 for t in v['texts']:
  assert t['x']>=b['x']-.5 and t['x']+t['width']<=b['x']+b['width']+.5,('horizontal clipping',v['label'],t)
  assert t['y']>=b['y']-.5 and t['y']+t['height']<=b['y']+b['height']+.5,('vertical clipping',v['label'],t)
 for i,a in enumerate(v['texts']):
  for b in v['texts'][i+1:]:
   dx=min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x']);dy=min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])
   assert not(dx>.75 and dy>.75),('text overlap',v['label'],a['text'],b['text'],dx,dy)
 assert v['pageWidth']<=v['width'],('page overflow',v['label'])
print('PASS: captured SVG material/gas inventories,liquid/chip/piston dimensions,transfer positions,elapsed curves,text bounds/overlaps andpage containment.')

three_file=root/'rendered-3d.json'
if three_file.exists():
 three=json.loads(three_file.read_text())
 for v in three:
  state_check(v['state'],physics(v['inputs']))
  assert v['canvasMatchesWrapper'] and v['readoutsInside'] and v['notesInside'],('3D containment',v['label'])
  assert v['visibleHeight']>=70 and v['pageWidth']<=v['width'],('3D visible canvas',v['label'])
 print('PASS:',len(three),'actual3D readouts/visiblecanvas/notes containment states.')

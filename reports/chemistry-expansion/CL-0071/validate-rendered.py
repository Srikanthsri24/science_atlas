import json,math,re
from pathlib import Path
from validation_model import state,smooth
root=Path(__file__).parent
n=0;apparatus=0;curves=0;states3d=0

def model(t):return state(['',t,'',5,10,50,3,15,2])
def near(a,b):
 global n
 assert math.isclose(a,b,rel_tol=2e-8,abs_tol=2e-7),(a,b)
 n+=1

def geometry(s,kind):
 if kind=='source':
  solidSalt=5*(1-smooth(s['t']/200));dissolved=s['sourceSalt']-solidSalt;sand=s['sourceSand'];water=s['sourceWater']
 elif kind=='residue':solidSalt=s['rc'];dissolved=s['rd'];sand=s['sand'];water=s['rw']
 elif kind=='filtrate':solidSalt=s['fc'];dissolved=s['fd'];sand=0;water=s['fw']
 else:solidSalt=0;dissolved=0;sand=0;water=s['reserve']
 radius={'source':2,'residue':1.6,'filtrate':3.5,'wash':1.5}[kind]
 area=64*radius*radius*math.sin(math.pi/64)
 solid=solidSalt/2.165+sand/2.65;solution=water+.3*dissolved
 envelope=solid/.6;pores=envelope-solid;wet=min(pores,solution);wetVolume=wet/.4 if pores>0 else 0;dryVolume=envelope-wetVolume;free=solution-wet
 bands=[(0,wetVolume/area),(wetVolume/area,dryVolume/area),(envelope/area,free/area)]
 return bands,(envelope+free)/area
for line in (root/'responsive-2d.jsonl').read_text().splitlines():
 e=json.loads(line);assert not e['overflow'];assert e['svg']['height']>0 and e['svg']['width']>0
 for v in e['vessels']:
  s=model(v['time']);kind=v['kind'];bands,top=geometry(s,kind)
  near(v['top'],top)
  if kind=='source':salt,water,sand=s['sourceSalt'],s['sourceWater'],s['sourceSand']
  elif kind=='residue':salt,water,sand=s['rs'],s['rw'],s['sand']
  elif kind=='filtrate':salt,water,sand=s['fs'],s['fw'],0
  else:salt,water,sand=0,s['reserve'],0
  near(v['salt'],salt);near(v['water'],water);near(v['sand'],sand)
  for b,(bottom,height) in zip(v['bands'],bands):near(b['height'],height*v['scale']);near(b['y'],v['base']-(bottom+height)*v['scale'])
  apparatus+=1
 for c in e['curves']:
  points=[tuple(map(float,p)) for p in re.findall(r'[ML]([\d.eE+\-]+),([\d.eE+\-]+)',c['d'])];assert len(points)==61
  portrait=e['format']=='portrait';width=600 if portrait else 1100;ph=650 if portrait else 410;pw=width-150
  end=(points[-1][0]-90)/pw*1200
  for j,(x,y) in enumerate(points):
   t=end*j/60;s=model(t);near(x,90+pw*t/1200)
   key,metric=c['key'],c['metric']
   if metric=='recovery':value=s['recovery'] if key=='recovery' else s['purity']
   elif metric=='salt':value={'source':s['sourceSalt'],'residue':s['rs'],'filtrate':s['fs']}[key]
   else:value={'source':s['sourceWater'],'residue':s['rw'],'filtrate':s['fw'],'wash':s['reserve'],'air':s['air']}[key]
   near(y,140+ph*(1-value/c['high']));curves+=1
for line in (root/'responsive-3d-final.jsonl').read_text().splitlines():
 e=json.loads(line);s=model(e['time']);assert not e['overflow'];c=e['canvas'];p=e['scene'];assert c['height']>0 and c['width']>0
 assert c['x']>=p['x']-1 and c['y']>=p['y']-1 and c['x']+c['width']<=p['x']+p['width']+1 and c['y']+c['height']<=p['y']+p['height']+1
 near(e['salt'],s['fc']);near(e['residueSalt'],s['rs']);near(e['water'],s['initialWater']);states3d+=1
out={'status':'passed','apparatusStates':apparatus,'independentCurvePoints':curves,'threeDStates':states3d,'numericChecks':n}
(root/'independent-rendered-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)

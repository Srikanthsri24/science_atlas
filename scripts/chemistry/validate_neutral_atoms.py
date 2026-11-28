"""Independent integer count/occupancy and exact-Decimal charge reference.
Whitelisted nuclides are selected from CIAAW2024; no abundances are modelled."""
import json,math,sys
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=80
ELEMENTS=[('H','Hydrogen',[1,2]),('He','Helium',[3,4]),('Li','Lithium',[6,7]),('Be','Beryllium',[9]),('B','Boron',[10,11]),('C','Carbon',[12,13]),('N','Nitrogen',[14,15]),('O','Oxygen',[16,17,18]),('F','Fluorine',[19]),('Ne','Neon',[20,21,22]),('Na','Sodium',[23]),('Mg','Magnesium',[24,25,26]),('Al','Aluminium',[27]),('Si','Silicon',[28,29,30]),('P','Phosphorus',[31]),('S','Sulfur',[32,33,34,36]),('Cl','Chlorine',[35,37]),('Ar','Argon',[36,38,40])]
E=D('1.602176634e-19')
def target(id):
 symbol,mass=id.split('-');a=int(mass);entry=next((z,name,masses)for z,(sym,name,masses)in enumerate(ELEMENTS,1)if sym==symbol);z,name,masses=entry;assert a in masses
 # Independent subshell allocation for this restricted Z<=18 set.
 left=z;shells=[0,0,0];config=[]
 for shell,orbital,cap in [(1,'s',2),(2,'s',2),(2,'p',6),(3,'s',2),(3,'p',6)]:
  n=min(left,cap)
  if n:config.append(f'{shell}{orbital}{n}');shells[shell-1]+=n;left-=n
 assert left==0
 return dict(id=id,z=z,a=a,symbol=symbol,name=name,neutronTarget=a-z,electronTarget=z,shells=[n for n in shells if n],configuration=' '.join(config))
def reference(q):
 t=target(q['isotopeId']);p,n,e=(q[k]for k in ['protons','neutrons','electrons']);assert all(type(v)is int for v in [p,n,e]);assert 0<=p<=t['z']and 0<=n<=t['neutronTarget']and 0<=e<=t['z'];complete=(p==t['z']and n==t['neutronTarget']and e==t['z']);prefix=0;placed=[]
 for cap in t['shells']:placed.append(min(cap,max(0,e-prefix)));prefix+=cap
 return dict(inputs=q,target=t,placedNucleons=p+n,missingProtons=t['z']-p,missingNeutrons=t['neutronTarget']-n,missingElectrons=t['z']-e,missingTotal=t['a']+t['z']-p-n-e,chargeUnits=p-e,protonChargeC=p*E,electronChargeC=-e*E,chargeC=(p-e)*E,placedShells=placed,targetShells=t['shells'],shellElectronSum=e,targetNucleons=t['a'],netChargeBalanced=p==e,nucleusComplete=p==t['z']and n==t['neutronTarget'],complete=complete,status='Complete neutral reference'if complete else'Counting diagram under construction — not an identified atom or ion',massNumber=t['a'],atomicNumber=t['z'])
def compare(a,w,path=''):
 if isinstance(w,dict):
  assert isinstance(a,dict)and set(a)==set(w),(path,'fields')
  return sum(compare(a[k],v,path+'.'+k) for k,v in w.items())
 if isinstance(w,list):
  assert isinstance(a,list)and len(a)==len(w),(path,'array')
  return sum(compare(x,y,path+f'[{i}]')for i,(x,y)in enumerate(zip(a,w)))
 if isinstance(w,D):
  assert type(a)in[int,float]and math.isfinite(a),(path,a)
  assert abs(D(str(a))-w)<=abs(w)*D('4e-16'),(path,a,str(w))
 elif type(w)is int:assert type(a)is int and a==w,(path,a,w)
 else:assert type(a)==type(w)and a==w,(path,a,w)
 return 1
def validate(rows):return {'constructionStates':len(rows),'fieldChecks':sum(compare(r['state'],reference(r['input']))for r in rows)}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

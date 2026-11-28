"""Independent80digit direct-charge root, separate station parameter sweeps."""
import json
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=80
K1=D('4.3e-7');K2=D('4.7e-11');KW=D('1e-14');MM=D('79.545')
def carbon_reference(n,v,na_n):
 ct=n/v;na=na_n/v
 def at(h):
  den=h*h+K1*h+K1*K2;a0=h*h/den;a1=K1*h/den;a2=K1*K2/den;oh=KW/h
  return a0,a1,a2,oh,h+na-oh-ct*a1-2*ct*a2
 if n==0 and na_n==0:h=D('1e-7')
 else:
  lo=D(0);hi=D(1)
  for _ in range(300):
   mid=(lo+hi)/2
   if at(mid)[4]>0:hi=mid
   else:lo=mid
  h=(lo+hi)/2
 a0,a1,a2,oh,residual=at(h)
 return dict(hMolL=h,ohMolL=oh,alpha0=a0,alpha1=a1,alpha2=a2,neutralPoolMolL=ct*a0,bicarbonateMolL=ct*a1,carbonateMolL=ct*a2,volumeL=v,totalCarbonMol=n,totalCarbonMolL=ct,sodiumMol=na_n,sodiumMolL=na,neutralPoolMol=ct*a0*v,bicarbonateMol=ct*a1*v,carbonateMol=ct*a2*v,finalCarbonMol=n,pH=-h.log10(),pOH=-oh.log10(),positiveChargeMol=(h+na)*v,negativeChargeMol=(oh+ct*a1+2*ct*a2)*v,baseEquivalentsPerCarbon=na_n/n if n else None)
def reference(q):
 def d(key):return D(str(q[key]))
 mass=d('oxideG');vol=d('acidVolumeMl')/1000;n=mass/MM;a=d('acidMolL')*vol;cap=min(n,a/2);x=d('reactionProgress')*cap if q['contact']else D(0);complete=q['contact']and d('reactionProgress')==1
 loss=mass if complete and n<=a/2 else x*MM;remaining=0 if complete and n<=a/2 else max(D(0),n-x);acidused=a if complete and a/2<=n else 2*x;acidleft=0 if complete and a/2<=n else max(D(0),a-2*x)
 b=d('baseMolL')*d('baseStockMl')/1000;bv=d('baseStockMl')*d('baseFraction');bn=b*d('baseFraction');ncarbon=d('carbonMmol')/1000;cv=(d('waterMl')+bv)/1000
 limiting='no-contact control'if not q['contact']else'no CuO'if n==0 else'no acid'if a==0 else'CuO'if n<a/2 else'acid'if n>a/2 else'co-limiting'
 return dict(acidVolumeL=vol,oxideInitialMol=n,acidInitialMol=a,capacityMol=cap,extentMol=x,oxideDissolvedG=loss,oxideRemainingG=max(D(0),mass-loss),oxideRemainingMol=remaining,acidConsumedMol=acidused,acidRemainingMol=acidleft,copperIonMol=x,waterFormedMol=x,chlorideMol=a,acidEquivalentMolL=acidleft/vol,copperTotalMol=n,acidPositiveChargeMol=acidleft+2*x,acidNegativeChargeMol=-a,acidPH=None,limiting=limiting,baseInitialMol=b,baseDeliveredMl=bv,baseDeliveredMol=bn,baseStoredMl=d('baseStockMl')-bv,baseStoredMol=b-bn,carbonInitialMol=ncarbon,carbonVolumeL=cv),carbon_reference(ncarbon,cv,bn)
def validate(cases):
 fields=0
 for c in cases:
  left,right=reference(c['inputs'])
  for actual,expected in [(c['actual'],left),(c['carbon'],right)]:
   for key,e in expected.items():
    a=actual[key]
    if e is None:assert a is None,key
    elif isinstance(e,str):assert a==e,(key,a,e)
    else:
     assert isinstance(a,(float,int))and not isinstance(a,bool),key
     a=D(str(a));e=D(e);assert abs(a-e)<=max(abs(a),abs(e))*D('7e-12'),(key,a,e)
    fields+=1
 return dict(cases=len(cases),fields=fields)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path('reports/chemistry-expansion/CL-0125/core-reference-fixtures.json').read_text()))))

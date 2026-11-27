"""Check CL-0104 state against independent analytic time-integral inversion."""
import json,math,sys
from surface_area_reference import solve,D,mp
NUMERIC_REL=D('2e-8')
def validate(path):
 rows=json.load(open(path));checks=0;maxerr={}
 for row in rows:
  q=row['inputs'];refs={label:solve(q,q[key])for label,key in[('a','grainsA'),('b','grainsB')]}
  for label,s in refs.items():
   actual=row['state'][label];assert set(actual)==set(s)|{'category'}
   for key,want in s.items():
    got=actual[key];checks+=1
    if want is None:assert got is None;continue
    if isinstance(want,bool):assert got==want,(q,key,got,want);continue
    assert isinstance(got,(int,float))and math.isfinite(got),(key,got)
    # Near finite-capacity equilibrium a subtraction of O(1) saturation quantities
    # leaves only floating roundoff. Bound that specific drive/rate, not all small masses.
    floor=D('4e-12')if key in['massResidualG','saltResidualG']else D('2e-14')if key in['drivingFraction','rateGS','edgeShrinkCmS']else D('1e-25')
    err=abs(D(got)-want);assert err<=max(floor,abs(want)*NUMERIC_REL),(q,key,got,str(want),str(err));maxerr[key]=max(maxerr.get(key,mp.mpf(0)),err)
   category='zero-flux-control'if q['fluxGcm2S']==0 else'initially-saturated'if q['initialSaturation']==1 else'solid-exhausted'if s['complete']else'numerical-capacity-equilibrium'if actual['drivingFraction']==0 else'dissolving';assert actual['category']==category
  a,b=refs['a'],refs['b'];state=row['state'];wanted={'initialAreaRatioBoverA':b['initialAreaCm2']/a['initialAreaCm2'],'currentAreaRatioBoverA':b['areaCm2']/a['areaCm2']if a['areaCm2']else None,'initialRateRatioBoverA':b['initialRateGS']/a['initialRateGS']if a['initialRateGS']else None,'deltaAdditionalG':b['additionalDissolvedG']-a['additionalDissolvedG'],'deltaRateGS':b['rateGS']-a['rateGS']}
  for key,want in wanted.items():
   checks+=1;got=state[key]
   if want is None:assert got is None;continue
   floor=D('1e-9')if key=='deltaAdditionalG'else D('1e-11')if key=='deltaRateGS'else D('1e-23')
   assert abs(D(got)-want)<=max(floor,abs(want)*NUMERIC_REL),(q,key,got,str(want))
  for key,x,y in[('amountLeader',a['additionalDissolvedG'],b['additionalDissolvedG']),('rateLeader',a['rateGS'],b['rateGS'])]:
   # At numerically equilibrated capacities, accept equality only within the verified solver bound.
   expect='equal'if abs(x-y)<=max(abs(x),abs(y))*D('1e-10')else'A'if x>y else'B'
   if state[key]!=expect:assert abs(x-y)<=D('1e-9')and state[key]=='equal',(q,key,state[key],expect)
 return{'cases':len(rows),'numericChecks':checks,'maxAbsoluteErrors':{k:float(v)for k,v in maxerr.items()}}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

"""Check every exported paired material field against independent Decimal reference."""
import json,sys,math
from decimal import Decimal
from reaction_speed_reference import solve
D=lambda x:Decimal(str(x))
def validate(path):
 cases=json.load(open(path));checks=0
 for row in cases:
  q=row['inputs'];s=row['state']
  for label,key in [('a','kA'),('b','kB')]:
   ref=solve(q,q[key]);actual=s[label];assert set(actual)==set(ref),(set(actual)^set(ref))
   for name,want in ref.items():
    got=actual[name];checks+=1
    if want is None:assert got is None,(name,got);continue
    assert isinstance(got,(int,float))and math.isfinite(got),(name,got)
    # Decimal gas subtraction intentionally cancels an initial headspace at very tiny times;
    # absolute residual allowances apply only to closure, ordinary values use relative tolerance.
    floor=D('3e-12')if name.endswith('ResidualG')else D('1e-17')if name.endswith('ResidualMol')else D('1e-30')
    assert abs(D(got)-want)<=max(floor,abs(want)*D('3e-11')),(q,name,got,str(want))
  a,b=solve(q,q['kA']),solve(q,q['kB'])
  for name,want in [('deltaGasMl',a['gasMl']-b['gasMl']),('deltaRateMlS',a['gasRateMlS']-b['gasRateMlS'])]:
   checks+=1;assert abs(D(s[name])-want)<=max(D('3e-14'),abs(want)*D('1e-10')),(name,s[name],want)
  ka,kb=D(q['kA']),D(q['kB']);cross=(ka/kb).ln()/(ka-kb)if ka and kb and ka!=kb and q['concentrationMolL']>0 else None
  if cross is None:assert s['crossoverS']is None
  else:assert abs(D(s['crossoverS'])-cross)<=abs(cross)*D('3e-13')
  for name,x,y in [('cumulativeLeader',a['gasMl'],b['gasMl']),('currentRateLeader',a['gasRateMlS'],b['gasRateMlS'])]:
   expect='equal'if abs(x-y)<=max(abs(x),abs(y))*D('1e-12')else'A'if x>y else'B';assert s[name]==expect,(name,s[name],expect)
 return{'cases':len(cases),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

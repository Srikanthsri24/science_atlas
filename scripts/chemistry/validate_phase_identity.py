"""CL-0105 all state fields against an independent Decimal limiting-mass/latent-energy reference."""
import json,sys,math
from decimal import Decimal
from phase_identity_reference import solve,D
def validate(path):
 rows=json.load(open(path));checks=0
 for row in rows:
  q=row['inputs'];expected=solve(q);actual=row['state'];assert set(actual)==set(expected)
  # Binary64 near-stoichiometric residuals have a stock-scale absolute rounding bound.
  mgfloor=D('1.8e-15')*D(q['magnesiumG']);ofloor=D('1.8e-15')*max(D(q['oxygenMol']),D(q['magnesiumG'])/D('24.305')/2)
  floors={'unreactedMagnesiumG':mgfloor,'unreactedMagnesiumMol':mgfloor/D('24.305'),'unreactedMagnesiumMl':mgfloor/D('1.74'),'oxygenRemainingMol':ofloor,'oxygenRemainingG':ofloor*D('31.998'),'oxygenKpa':ofloor*D('8.314')*D('298.15')/(D('99')/1000)}
  for key,want in expected.items():
   got=actual[key];checks+=1
   if isinstance(want,(bool,str)):assert got==want,(key,got,want);continue
   assert isinstance(got,(int,float))and math.isfinite(got),(key,got)
   floor=D('3e-12')if key in['phaseMassResidualG','chemicalMassResidualG','wholeMassResidualG']else D('2e-14')if key in['waterMoleResidual','buoyancyResidualN']else D('1e-16')if key in['magnesiumAtomResidualMol','oxygenAtomResidualMol']else floors.get(key,D('1e-30'))
   assert abs(D(got)-want)<=max(floor,abs(want)*D('3e-11')),(q,key,got,str(want))
 return{'cases':len(rows),'checkedFields':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

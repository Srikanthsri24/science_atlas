"""All CL-0106 fields checked against an independent 80-digit Decimal account."""
import json,sys,math
from corrosion_conditions_reference import solve,D

def validate(path):
 rows=json.load(open(path));checks=0
 for row in rows:
  q=row['inputs'];expected=solve(q,row['state']['id']);actual=row['state'];assert set(actual)==set(expected)
  oxygenfloor=D('1.8e-15')*max(expected['initialOxygenMol'],D('.75')*expected['convertedIronMol'])
  for key,want in expected.items():
   got=actual[key];checks+=1
   if want is None or isinstance(want,(bool,str)):assert got==want,(key,got,want);continue
   assert isinstance(got,(int,float))and math.isfinite(got),(key,got)
   floor=D('3e-12')if key=='massResidualG'else D('3e-14')if key.endswith('AtomResidualMol')else oxygenfloor if key=='oxygenRemainingMol'else oxygenfloor*D('31.998')if key=='oxygenRemainingG'else D('1e-30')
   assert abs(D(got)-want)<=max(floor,abs(want)*D('3e-11')),(q,key,got,str(want))
 return{'cases':len(rows),'checkedFields':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

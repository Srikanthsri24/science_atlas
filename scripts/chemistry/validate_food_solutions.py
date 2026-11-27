import json,sys
from decimal import Decimal
from food_solution_reference import solve
D=lambda v:Decimal(str(v))
def validate(cases):
 count=0
 def near(a,b,key):
  nonlocal count
  count+=1;b=D(b)
  if abs(D(a)-b)>max(D('2e-12')if 'residual'in key.lower()else D('1e-24'),abs(b)*D('3e-11')):raise AssertionError(f'{key}: {a} != {b}')
 for case in cases:
  expected=solve(case['inputs']);actual=case['state']
  for key in ['totalSoluteG','totalSolventG','totalContentsG','massResidualG']:near(actual[key],expected[key],key)
  for ac,ex in zip(actual['cells'],expected['cells']):
   assert ac['id']==ex['id']
   for key,value in ex.items():
    if key=='id':continue
    if isinstance(value,list):
     assert len(ac[key])==len(value)
     for a,b in zip(ac[key],value):near(a,b,key)
    else:near(ac[key],value,key)
 return count
if __name__=='__main__':
 cases=json.load(open(sys.argv[1]));print(f'PASS {len(cases)} cases; {validate(cases)} independent numeric checks')

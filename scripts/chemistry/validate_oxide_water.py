import json,sys
from decimal import Decimal
from oxide_water_reference import solve
D=lambda n:Decimal(str(n))
def validate(cases):
 checks=0
 for case in cases:
  for key,want in solve(case['inputs']).items():
   actual=case['state']
   for part in key.split('.'):actual=actual[part]
   if abs(D(actual)-want)>max(D('2e-12') if 'Residual' in key else D('1e-24'),abs(want)*D('3e-11')):raise AssertionError(f'{key}: {actual} != {want}')
   checks+=1
 return checks
if __name__=='__main__':
 cases=json.load(open(sys.argv[1]));print(f'PASS {len(cases)} cases; {validate(cases)} independent field checks')

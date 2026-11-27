import json,sys
from decimal import Decimal
from salt_precipitation_reference import solve
D=lambda x:Decimal(str(x))
def validate(cases):
 count=0
 for case in cases:
  expected=solve(case['inputs']);a=case['state'];stockScale=max(expected['silverInitialMol'],expected['chlorideInitialMol']);nearThreshold=abs(expected['initialIonProduct']-D('1.8e-10'))<D('1e-16')
  for key,want in expected.items():
   # Tiny precipitation differences near saturation lose relative digits in binary64
   # when subtracting nearly equal inventories. Bound by stock-scale roundoff instead.
   tolerance=max(D('2e-12')if'Residual'in key else D('1e-24'),abs(want)*D('3e-11'))
   if nearThreshold and key in ['precipitateMol','precipitateG','solidMl']:tolerance=max(tolerance,stockScale*D('1e-13')*(D(150)if key!='precipitateMol'else D(1)))
   if abs(D(a[key])-want)>tolerance:raise AssertionError(f'{key}: {a[key]} != {want} (tol {tolerance})')
   count+=1
 return count
if __name__=='__main__':
 cases=json.load(open(sys.argv[1]));print(f'PASS {len(cases)} cases; {validate(cases)} independent numeric checks')

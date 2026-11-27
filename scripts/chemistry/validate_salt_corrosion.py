"""Check every CL-0107 field against the independent80-digit material/charge reference."""
import json,math,sys
from salt_corrosion_reference import solve,D

def validate(path):
 rows=json.load(open(path));checks=0
 for row in rows:
  q=row['inputs'];actual=row['state'];expected=solve(q,actual['id']);assert set(actual)==set(expected)
  ironfloor=D('2e-15')*D(q['ironG']);floors={'remainingIronG':ironfloor,'remainingIronMl':ironfloor/D('7.87'),'remainingThicknessCm':ironfloor/D('7.87')/(D(q['exposedAreaCm2'])/2)}
  for key,want in expected.items():
   got=actual[key];checks+=1
   if want is None or isinstance(want,(str,bool)):assert got==want,(key,got,want);continue
   assert type(got)in(int,float)and math.isfinite(got),(key,got)
   floor=D('3e-12')if key=='materialResidualG'else D('3e-14')if key.endswith('AtomResidualMol')else D('5e-12')if key in['primaryChargeResidualC','totalRedoxResidualC']else floors.get(key,D('1e-300'))
   assert abs(D(got)-want)<=max(floor,abs(want)*D('3e-11')),(q,key,got,str(want))
  if actual['id']=='a':
   b=solve(q,'b');a=expected;expectedComparison={'deltaIronLossG':b['convertedIronG']-a['convertedIronG'],'deltaSpecimenGainG':b['specimenGainG']-a['specimenGainG'],'initialCurrentRatioBoverA':b['initialCurrentA']/a['initialCurrentA']if a['initialCurrentA']else None};gotComparison=row['comparison'];assert set(gotComparison)==set(expectedComparison)
   for key,want in expectedComparison.items():
    checks+=1;got=gotComparison[key]
    if want is None:assert got is None;continue
    assert type(got)in(int,float)and math.isfinite(got)
    floor=D('2e-14')*max(abs(a['convertedIronG']),abs(b['convertedIronG']))if key=='deltaIronLossG'else D('2e-14')*max(abs(a['specimenGainG']),abs(b['specimenGainG']))if key=='deltaSpecimenGainG'else D('1e-300')
    assert abs(D(got)-want)<=max(floor,abs(want)*D('3e-11')),(key,got,str(want))
 return{'cases':len(rows),'checkedFields':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

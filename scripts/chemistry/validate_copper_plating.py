"""Independent80-digit Decimal copper inventory, charge, coating and cutoff reference."""
import json,sys
from pathlib import Path
from decimal import Decimal as D,getcontext
getcontext().prec=80
F=D('6.02214076e23')*D('1.602176634e-19');M=D('63.546');RHO=D('8.96')
def reference(q):
 mass=D(str(q['anodeInitialG']));limit=mass/M*2*F;elapsed=D(0);requested=D(0);passed=D(0);energized=D(0)
 for r in q['history']:
  I=D(str(r['currentA']));dt=D(str(r['durationS']));request=I*dt if r['connected']else D(0);delivered=min(max(D(0),limit-passed),request);requested+=request;passed+=delivered;elapsed+=dt;energized+=delivered/I if I else D(0)
 depleted=passed>=limit;deposit=mass if depleted else passed/(2*F)*M;anode=mass-deposit;cathode=D(str(q['cathodeInitialG']))+deposit;area=D(str(q['widthCm']))*D(str(q['heightCm']));volume=deposit/RHO;thickness=volume/area;active=D(str(q['currentA']))if q['connected']and not depleted else D(0)
 return dict(elapsedS=elapsed,requestedChargeC=requested,passedChargeC=passed,chargeLimitC=limit,unmetChargeDemandC=max(D(0),requested-passed),energizedS=energized,electronMol=passed/F,copperMol=deposit/M,depositMassG=deposit,depositMassMg=deposit*1000,anodeLossG=deposit,anodeFinalG=anode,cathodeGainG=deposit,cathodeFinalG=cathode,areaCm2=area,areaM2=area/10000,depositVolumeCm3=volume,thicknessCm=thickness,thicknessM=thickness/100,thicknessMicrometre=thickness*10000,initialElectrodeMassG=mass+D(str(q['cathodeInitialG'])),finalElectrodeMassG=anode+cathode,bathNetCopperChangeMol=D(0),depleted=depleted,activeCurrentA=active,currentDensityAm2=active/(area/10000))
def validate(cases):
 count=0
 for case in cases:
  expected=reference(case['inputs']);actual=case['actual'];assert set(actual)==set(expected)
  for k,b in expected.items():
   a=actual[k]
   if isinstance(b,bool):assert a is b,(k,a,b)
   else:
    assert type(a)in[int,float]
    assert abs(D(str(a))-b)<=abs(b)*D('5e-14'),(k,str(a),str(b))
   count+=1
 return dict(sourceHistories=len(cases),typedFieldChecks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]if len(sys.argv)>1 else 'reports/chemistry-expansion/CL-0122/core-reference-fixtures.json').read_text()))))

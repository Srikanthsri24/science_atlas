"""Independent80digit Decimal in-phase AC bulk-circuit reference."""
import json,sys
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=80
SAMPLES={'water':('0.0000055','0'),'sucrose':('0.0000055','0.1'),'kcl001':('0.140823','0.01'),'kcl01':('1.28246','0.1'),'kcl1':('10.862','1')}
PI=D('3.141592653589793238462643383279502884197169399375105820974944592307816406286')
def phase_sine(phase):
 if phase in[0,.5,1]:return D(0)
 if phase==.25:return D(1)
 if phase==.75:return D(-1)
 x=D(str(phase))*2*PI
 if x>PI:x-=2*PI
 term=x;total=x
 for i in range(1,100):
  term=-term*x*x/D((2*i)*(2*i+1));total+=term
  if abs(term)<D('1e-78'):break
 return total
def reference(q):
 k,m=map(D,SAMPLES[q['sampleId']]);gap=D(str(q['gapCm']))/100;width=D(str(q['widthCm']))/100;depth=D(str(q['immersedDepthCm']))/100;area=width*depth;acm=D(str(q['widthCm']))*D(str(q['immersedDepthCm']));volts=D(str(q['voltageRmsV']));wet=area>0;excited=q['connected']and wet and volts>0;cell=gap/area if wet else None;g=k*area/gap if wet else D(0);v=volts if q['connected']else D(0);current=v*g;peakv=D(2).sqrt()*v;peaki=D(2).sqrt()*current;sine=phase_sine(q['phaseCycle']);iv=peakv*sine;ii=peaki*sine;ef=v/gap if wet else D(0);ief=iv/gap if wet else D(0);direction=1 if ief>0 else-1 if ief<0 else 0
 return dict(temperatureC=25,physicalFrequencyHz=1000,physicalPeriodS=D('.001'),displayCycleSeconds=4,timeMagnification=4000,gapM=gap,widthM=width,depthM=depth,areaM2=area,areaCm2=acm,wetted=wet,cellConstantMInv=cell,cellConstantCmInv=D(str(q['gapCm']))/acm if wet else None,conductivitySM=k,conductivityScm=k/100,conductivityMicroScm=k*10000,bulkConductanceS=g,bulkResistanceOhm=1/g if g else None,excited=bool(excited),cellVoltageRmsV=v,currentRmsA=current,currentMicroA=current*1000000,voltagePeakV=peakv,currentPeakA=peaki,phaseSine=sine,instantVoltageV=iv,instantCurrentA=ii,fieldRmsVm=ef,instantFieldVm=ief,currentDensityRmsAm2=k*ef if excited else D(0),instantCurrentDensityAm2=k*ief if excited else D(0),meanPowerW=v*current,instantPowerW=iv*ii,measuredConductanceS=g if excited else None,reconstructedConductivitySM=k if excited else None,reconstructionResidualSM=D(0)if excited else None,positiveIonDirection=direction,negativeIonDirection=-direction,externalElectronDirection=-direction,averageCurrentOverCycleA=0,chargePerFullCycleC=0,status='Source disconnected — no conductivity reading'if not q['connected']else'Electrodes not immersed — no conductivity reading'if not wet else'Zero excitation — no conductivity reading'if volts==0 else'Ideal in-phase bulk reading; reactive/interface currents excluded')
def validate(rows):
 checks=0
 for row in rows:
  q=row['input'];s=row['state'];assert s['inputs']==q;want=reference(q);k,m=map(D,SAMPLES[q['sampleId']]);assert s['sample']['id']==q['sampleId']and D(str(s['sample']['conductivitySM']))==k and D(str(s['sample']['molalityMolKg']))==m
  assert set(s)==set(want)|{'inputs','sample'}
  for field,value in want.items():
   actual=s[field]
   if value is None:assert actual is None,(field,actual)
   elif type(value)is bool:assert type(actual)is bool and actual==value
   elif isinstance(value,str):assert actual==value
   else:
    assert type(actual)in[int,float];a=D(str(actual));tolerance=abs(D(value))*D('1e-14')
    if field=='reconstructionResidualSM':tolerance=k*D('1e-14')
    assert abs(a-D(value))<=tolerance,(field,str(a),str(value))
   checks+=1
 return dict(circuits=len(rows),typedFieldChecks=checks)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

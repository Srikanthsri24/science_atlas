"""Independent Decimal operational separation reference; no certified TSS/TDS,
thermal kinetics or solubility allocation. Decimal exp uses 100-digit precision."""
import json,math,sys
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=100
IDS=['water','salt','suspension','mixture']
def reference(raw,id):
 q={k:D(str(v)) for k,v in raw.items()};v=q['sampleMl'];f=q['filteredFraction'];h=q['holdUpFraction'];r=q['retention'];d=q['dryFraction'];salt=q['saltMgL']*v/D(1000000) if id in ['salt','mixture'] else D(0);solid=q['solidMgL']*v/D(1000000) if id in ['suspension','mixture'] else D(0);water=v-salt
 # Distinct compartment construction: distribute inventories by shares, then
 # mix pore solution in a continuum rinse and assemble wet/dry mass accounts.
 pc=water*f;ps=salt*f;pp=solid*f;cw=pc*h;cs=ps*h;rw=q['rinseMl']*f
 ratio=rw/cw if cw else D(0);remaining=(-ratio).exp() if cw else D(1);removed=1-remaining
 cake_salt=cs*remaining;rinse_salt=cs*removed;receiver_salt=ps-cake_salt
 retained=pp*r;passed=pp*(1-r);receiver_water=pc-cw+rw
 feed_water=water*(1-f);feed_salt=salt*(1-f);feed_solid=solid*(1-f)
 cake_water=cw*(1-d);dish_water=receiver_water*(1-d);cv=cw*d;dv=receiver_water*d;vap=cv+dv;cake_dry=retained+cake_salt;dish_dry=receiver_salt+passed
 initial=v+solid+rw;feed=feed_water+feed_salt+feed_solid;cake=cake_water+cake_dry;dish=dish_water+dish_dry;processed=v*f
 return dict(id=id,rinseApplicable=bool(cw),saltG=salt,solidG=solid,carrierG=water,processedMl=processed,feedCarrierG=feed_water,feedSaltG=feed_salt,feedSolidG=feed_solid,processedCarrierG=pc,processedSaltG=ps,processedSolidG=pp,retainedSolidG=retained,passedSolidG=passed,cakeCarrierBeforeDryG=cw,cakeSaltBeforeRinseG=cs,rinseCarrierG=rw,rinseRatio=ratio,rinseRemainingFraction=remaining,rinseRemovedFraction=removed,cakeSaltG=cake_salt,rinsedSaltG=rinse_salt,receiverSaltG=receiver_salt,receiverCarrierBeforeDryG=receiver_water,cakeCarrierG=cake_water,receiverCarrierG=dish_water,cakeVapourG=cv,receiverVapourG=dv,vapourG=vap,cakeDryMaterialG=cake_dry,receiverDryMaterialG=dish_dry,filterGrossG=q['filterTareG']+cake, dishGrossG=q['dishTareG']+dish,feedG=feed,cakeG=cake,receiverG=dish,initialG=initial,finalG=initial,filterDryGrossG=q['filterTareG']+cake_dry,dishDryGrossG=q['dishTareG']+dish_dry,apparentRetainedMgL=cake_dry*D(1000000)/processed if processed else None,apparentPassedMgL=dish_dry*D(1000000)/processed if processed else None,saltCarryoverFraction=cake_salt/ps if ps else None,solidCaptureFraction=r if pp else None,materialResidualG=D(0),saltResidualG=D(0),solidResidualG=D(0),carrierResidualG=D(0),dryObservationReady=d==1 and bool(processed))
def compare(actual,want,key,q,s):
 if want is None or isinstance(want,(str,bool)):
  assert type(actual)==type(want) and actual==want,(key,actual,want);return
 assert type(actual) in [int,float] and math.isfinite(actual),(key,actual)
 # Tight relative bounds for positive inventories. Only cancellation-derived
 # quantities receive a scale-based double subtraction allowance.
 floor=D('1e-300');relative=D('4e-12')
 if key in ['passedSolidG','feedCarrierG','feedSaltG','feedSolidG','cakeCarrierG','receiverCarrierG']:
  scale=s['processedSolidG'] if key=='passedSolidG' else s['carrierG']+s['rinseCarrierG'] if key.endswith('CarrierG') else s['saltG'] if key=='feedSaltG' else s['solidG']
  floor=max(floor,abs(scale)*D('4e-16'))
 if key in ['receiverDryMaterialG','apparentPassedMgL']:
  propagated=abs(s['processedSolidG'])*D('4e-16')
  if key=='apparentPassedMgL' and s['processedMl']:propagated*=D(1000000)/s['processedMl']
  floor=max(floor,propagated)
 if key in ['cakeG','receiverG']:
  floor=max(floor,abs(s['carrierG']+s['rinseCarrierG'])*D('4e-16'))
 if 'Residual' in key:floor=D('3e-12') if key in ['materialResidualG','carrierResidualG'] else D('3e-16')
 # Exp underflow is permitted only below representable binary64, not at a
 # blanket absolute tolerance that would erase small but representable salt.
 if key in ['cakeSaltG','rinseRemainingFraction','saltCarryoverFraction'] and abs(want)<D('5e-324'):floor=D('5e-324')
 assert abs(D(str(actual))-want)<=max(floor,abs(want)*relative),(key,actual,str(want))
def validate(rows):
 checks=0
 for row in rows:
  assert len(row['cells'])==4
  for id,s in zip(IDS,row['cells']):
   expected=reference(row['input'],id);assert set(s)==set(expected)
   for k,w in expected.items():compare(s[k],w,k,row['input'],expected);checks+=1
 return dict(preparations=len(rows),cells=4*len(rows),fieldChecks=checks)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

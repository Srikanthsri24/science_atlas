import json,sys
from decimal import Decimal
from zinc_protection_reference import cell,D

def validate(path):
 data=json.load(open(path));checks=0
 for row in data:
  q=row['input'];endq={**q,'elapsedDays':14};endrefs={id:cell(endq,id)for id in ['bare','intact','scratched','isolated']};refs={id:cell(q,id)for id in ['bare','intact','scratched','isolated']}
  for actual in row['cells']:
   expected=refs[actual['id']];events=[endrefs[actual['id']][k]for k in ['ironExhaustionS','zincExhaustionS']if endrefs[actual['id']][k]is not None];near_event=any(abs(D(q['elapsedDays'])*86400-e)<=max(D(1),e)*D('1e-6')for e in events);expected['ironSavedVersusBareG']=refs['bare']['convertedIronG']-expected['convertedIronG']
   for key,want in expected.items():
    got=actual[key]
    if want is None:assert got is None,(key,got,want)
    elif isinstance(want,(bool,str)):assert got==want,(key,got,want)
    else:
     floor=D('2e-12')if 'Residual' in key else D('1e-28')
     if key in ['remainingIronG','remainingIronVolumeMl']:floor=max(floor,D(q['ironG'])*D('3e-14'))
     if key in ['remainingZincG','remainingZincVolumeMl']:floor=max(floor,D(q['zincG'])*D('3e-14'))
     if key=='ironSavedVersusBareG':floor=max(floor,D(q['ironG'])*D('3e-14'))
     # Event-time subtraction is ill-conditioned for a newly started tiny channel.
     # 64 binary64 eps of the metal inventory, only near a known event and in its units.
     if near_event:
      eps=D('1.4210854715202004e-14');mass=D(q['ironG'])+D(q['zincG']);moles=D(q['ironG'])/D('55.845')+D(q['zincG'])/D('65.38')
      if key.endswith('C'):floor=max(floor,eps*2*D('96485.3321233100184')*moles)
      elif key.endswith('G') and key not in ['initialAccountG','finalAccountG']:floor=max(floor,eps*mass*2)
      elif key.endswith('Mol'):floor=max(floor,eps*moles*2)
      elif key.endswith('VolumeMl'):floor=max(floor,eps*mass)
      elif key=='meanCurrentA' and D(q['elapsedDays'])>0:floor=max(floor,eps*2*D('96485.3321233100184')*moles/(D(q['elapsedDays'])*86400))
     assert got is not None and abs(D(got)-want)<=max(floor,abs(want)*D('3e-10')),(key,got,str(want),q)
    checks+=1
   stages=actual['stages'];previous=D(0);sums={'ironChargeC':D(0),'zincChargeC':D(0)}
   assert len(stages)<=3
   for stage in stages:
    start,end=D(stage['startS']),D(stage['endS']);assert start==previous and end>=start;previous=end
    midpoint=(start+end)/2;reference=cell({**q,'elapsedDays':str(midpoint/D(86400))},actual['id'])
    for key in ['ironCurrentA','zincCurrentA','protectiveCurrentA','zincSelfCurrentA','oxygenScale','exposedIronAreaCm2','exposedZincAreaCm2','selectedDemandA']:
     want=reference[key];assert abs(D(stage[key])-want)<=max(D('1e-28'),abs(want)*D('3e-10')),(key,stage,reference);checks+=1
    budget=D('1.4210854715202004e-14')*(expected['ironCapacityC']+expected['zincCapacityC'])
    for key,rate in [('ironChargeC','ironCurrentA'),('zincChargeC','zincCurrentA')]:
     amount=D(stage[key]);assert amount>=0;assert abs(amount-D(stage[rate])*(end-start))<=max(D('1e-28'),budget);sums[key]+=amount;checks+=1
   assert previous==D(actual['elapsedS'])
   for key,value in sums.items():assert abs(value-D(actual[key]))<=max(D('1e-28'),abs(D(actual[key]))*D('1e-14'))
 return{'preparations':len(data),'cells':4*len(data),'checkedFields':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

"""Independent 80-digit Decimal operational uptake/drainage reference.
No application or TypeScript model imports. Selected coefficients are not
experimental fibre constants and are not humidity-regain measurements.
"""
import json,math,sys
from pathlib import Path
from decimal import Decimal as D,getcontext,ROUND_FLOOR
getcontext().prec=80
IDS=['cotton','wool','nylon','polyester']
COEFFICIENTS={'cotton':('.3','1.2',30,12,True),'wool':('.45','.8',90,20,True),'nylon':('.08','1',40,10,False),'polyester':('.02','1.4',20,8,False)}
def reference(raw,id):
 q={k:D(str(v))for k,v in raw.items()};strong,loose,tau,drainTau,natural=COEFFICIENTS[id];strong=D(strong);loose=D(loose);tau=D(tau);drainTau=D(drainTau)
 cs=q['dryMassG']*strong*q['retentionScale'];cl=q['dryMassG']*loose*q['constructionFactor'];capacity=cs+cl;x=q['wettingScale']*q['soakS']/tau;fraction=1-(-x).exp();unlimited=capacity*fraction;water=q['bathMl'];ratio=min(fraction,water/capacity);uptake=capacity*ratio;s=cs*ratio;l=cl*ratio
 dx=q['drainS']/drainTau;remaining=l*(-dx).exp();drainFraction=1-(-dx).exp();drained=l*drainFraction;retained=s+remaining;bath=D(0)if water<=unlimited else water-uptake;wet=q['dryMassG']+retained;dryGross=q['panTareG']+q['dryMassG'];wetGross=q['panTareG']+wet
 indication=lambda value:int(((value+D('1e-12'))*1000+D('.5')).to_integral_value(rounding=ROUND_FLOOR))
 tareM=indication(q['panTareG']);dryM=indication(dryGross);wetM=indication(wetGross);indDry=D(dryM-tareM)/1000;indWet=D(wetM-tareM)/1000;indWater=D(wetM-dryM)/1000
 initial=q['dryMassG']+water
 return dict(id=id,natural=natural,strongReferenceGg=strong,drainableReferenceGg=loose,soakTauS=tau,drainTauS=drainTau,strongCapacityG=cs,drainableCapacityG=cl,totalCapacityG=capacity,soakExponent=x,soakFraction=fraction,unlimitedUptakeG=unlimited,initialBathG=water,uptakeG=uptake,capacityFraction=ratio,strongAtLiftG=s,drainableAtLiftG=l,drainageExponent=dx,drainFraction=drainFraction,drainableRemainingG=remaining,drainedG=drained,retainedG=retained,remainingBathG=bath,wetCouponG=wet,wetAtLiftG=q['dryMassG']+uptake,dryGrossG=dryGross,wetGrossG=wetGross,tareMilliG=tareM,dryGrossMilliG=dryM,wetGrossMilliG=wetM,indicatedDryG=indDry,indicatedWetG=indWet,indicatedWaterG=indWater,uptakeGg=uptake/q['dryMassG'],retainedGg=retained/q['dryMassG'],dryBasisGainPercent=100*retained/q['dryMassG'],wetBasisWaterPercent=100*retained/wet,indicatedRetainedGg=indWater/indDry,indicatedDryBasisGainPercent=100*indWater/indDry,indicationErrorG=indWater-retained,initialMaterialG=initial,finalMaterialG=initial,materialResidualG=D(0),waterResidualG=D(0),poolResidualG=D(0),bathLimited=water<unlimited,emptyBath=water==0)
def compare(actual,want,key,s):
 if isinstance(want,(str,bool)):
  assert actual==want and type(actual)==type(want),(key,actual,want);return
 if key in['tareMilliG','dryGrossMilliG','wetGrossMilliG']:assert actual==want,(key,actual,want);return
 assert type(actual)in[int,float]and math.isfinite(actual),(key,actual)
 floor=D('1e-300')
 if key.endswith('ResidualG'):floor=D('2e-12')
 elif key=='remainingBathG':floor=D(64)*D(str(2**-52))*s['initialBathG']
 elif key=='indicationErrorG':floor=D(64)*D(str(2**-52))*max(abs(s['indicatedWaterG']),s['retainedG'])
 assert abs(D(str(actual))-want)<=max(floor,abs(want)*D('2e-10')),(key,actual,str(want),str(floor))
def validate(rows):
 count=0
 for row in rows:
  assert [s['id']for s in row['cells']]==IDS
  for actual in row['cells']:
   want=reference(row['input'],actual['id']);assert set(actual)==set(want)
   for key,value in want.items():compare(actual[key],value,key,want);count+=1
 return {'preparations':len(rows),'cells':len(rows)*4,'fieldChecks':count}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

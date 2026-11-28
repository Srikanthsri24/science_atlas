"""Independent 80-digit nitric-acid/carbonate endpoint reference; no app imports."""
from decimal import Decimal as D,getcontext
from pathlib import Path
import json,sys,math
getcontext().prec=80
CA,C,O,H,N=map(D,['40.078','12.011','15.999','1.008','14.007']);MC=CA+C+3*O;NO3=N+3*O;ACID=H+NO3;SALT=CA+2*NO3;GAS=C+2*O;WATER=2*H+O;R=D('8.31446261815324');RHO=D('2.71');EPS=D(2)**-52
IDS=['water','half-acid','acid','blank']
def reference(raw,id):
 q={k:D(str(v))for k,v in raw.items()};has=id!='blank';scale=D(0)if id=='water'else D('.5')if id=='half-acid'else D(1)
 strength=q['acidMmolL']*scale;initial=q['specimenG']if has else D(0);nc=initial/MC
 stock=strength/1000;dose=strength*q['deliveredMl']/1000000;left=stock-dose;contact=dose*q['contactFraction']
 # Independent limiting fraction: acid-equivalent capacity consumed / 2.
 fraction=min(D(1),contact/(2*nc))if has else D(0)
 reacted=nc*fraction;used=2*reacted;unreacted=dose-used
 exhausted=has and fraction==1;loss=initial if exhausted else reacted*MC;remaining=initial-loss
 captured=reacted*q['captureFraction'];escaped=reacted*(1-q['captureFraction'])
 gasg=reacted*GAS;capturedg=captured*GAS;escapedg=escaped*GAS;waterg=reacted*WATER
 volume=lambda n:n*R*q['temperatureK']/q['pressureKPa']*1000
 stockacid=stock*ACID;doseacid=dose*ACID;stockwater=1000-stockacid;dosewater=q['deliveredMl']-doseacid;leftwater=stockwater-dosewater
 cag=reacted*CA;nitrateg=dose*NO3;hg=unreacted*H;aq=cag+nitrateg+hg;effluent=dosewater+waterg+aq
 product=reacted*SALT;freeacid=unreacted*ACID;leftg=leftwater+left*ACID
 initialaccount=initial+1000;retained=remaining+effluent+capturedg+leftg;combined=retained+escapedg
 initialv=initial/RHO;remainingv=remaining/RHO;lostv=loss/RHO
 requirement=2*nc/(strength*q['contactFraction'])*1000000 if has and strength and q['contactFraction']else None
 return dict(id=id,hasSpecimen=has,acidScale=scale,acidMmolL=strength,initialSpecimenG=initial,initialCarbonateMol=nc,stockAcidMol=stock,deliveredAcidMol=dose,remainingStockAcidMol=left,contactStreamMl=q['deliveredMl']*q['contactFraction'],bypassStreamMl=q['deliveredMl']*(1-q['contactFraction']),contactAcidMol=contact,reactedCarbonateMol=reacted,acidConsumedMol=used,remainingAcidMol=unreacted,specimenExhausted=exhausted,specimenLostG=loss,remainingSpecimenG=remaining,calciumMol=reacted,nitrateMol=dose,carbonDioxideMol=reacted,generatedWaterMol=reacted,capturedGasMol=captured,escapedGasMol=escaped,carbonDioxideG=gasg,capturedGasG=capturedg,escapedGasG=escapedg,generatedWaterG=waterg,capturedGasMl=volume(captured),escapedGasEquivalentMl=volume(escaped),totalGasEquivalentMl=volume(reacted),stockAcidG=stockacid,deliveredAcidG=doseacid,stockCarrierG=stockwater,deliveredCarrierG=dosewater,remainingStockCarrierG=leftwater,calciumG=cag,nitrateG=nitrateg,remainingHydrogenG=hg,aqueousSolutesG=aq,effluentG=effluent,calciumNitrateEquivalentG=product,unreactedAcidEquivalentG=freeacid,remainingStockG=leftg,initialAccountG=initialaccount,retainedAccountG=retained,accountIncludingEscapeG=combined,initialVolumeMl=initialv,remainingVolumeMl=remainingv,lostVolumeMl=lostv,initialDepthMm=initialv/q['areaCm2']*10 if has else D(0),remainingDepthMm=remainingv/q['areaCm2']*10 if has else D(0),removedDepthMm=lostv/q['areaCm2']*10 if has else D(0),requiredDoseMl=requirement,reachableWithStock=None if requirement is None else requirement<=1000,specimenLossPercent=100*loss/initial if has else None,acidConsumedFraction=used/dose if dose else None,materialResidualG=D(0),retainedMassResidualG=D(0),aqueousChargeResidualMol=D(0),carbonateCarbonResidualMol=D(0),calciumResidualMol=D(0),nitrateResidualMol=D(0),gasPartitionResidualMol=D(0),reactionHydrogenResidualMol=D(0),reactionOxygenResidualMol=D(0),equivalentSolutesResidualG=D(0))
def compare(actual,want,key,q,s):
 if want is None or isinstance(want,(str,bool)):
  assert actual==want and type(actual)==type(want),(key,actual,want);return
 assert type(actual)in[int,float]and math.isfinite(actual),(key,actual)
 floor=D('1e-300')
 if 'Residual'in key:floor=D('2e-11')if key.endswith('G')else D('2e-17')
 # Only quantities formed by subtraction use stock-scale rounding allowances.
 # Direct loss, gas production and consumed reactant retain strict relative
 # checks even at the smallest supported nonzero input combination.
 elif key in['remainingSpecimenG','remainingVolumeMl','remainingDepthMm']:
  floor=64*EPS*s['initialSpecimenG']
  if key=='remainingVolumeMl':floor/=RHO
  if key=='remainingDepthMm':floor=floor/RHO/D(str(q['areaCm2']))*10
 elif key in['remainingStockCarrierG','remainingStockG']:floor=64*EPS*1000
 elif key=='remainingStockAcidMol':floor=64*EPS*s['stockAcidMol']
 elif key=='remainingAcidMol':floor=64*EPS*s['deliveredAcidMol']
 elif key=='remainingHydrogenG':floor=64*EPS*s['deliveredAcidMol']*H
 elif key=='unreactedAcidEquivalentG':floor=64*EPS*s['deliveredAcidMol']*ACID
 elif key in['escapedGasMol','escapedGasG','escapedGasEquivalentMl']:
  floor=64*EPS*s['carbonDioxideMol']
  if key=='escapedGasG':floor*=GAS
  if key=='escapedGasEquivalentMl':floor=floor*R*D(str(q['temperatureK']))/D(str(q['pressureKPa']))*1000
 elif key=='bypassStreamMl':floor=64*EPS*D(str(q['deliveredMl']))
 assert abs(D(str(actual))-want)<=max(floor,abs(want)*D('2e-10')),(key,actual,str(want),str(floor))
def validate(rows):
 checks=0
 for row in rows:
  assert [s['id']for s in row['cells']]==IDS
  for s in row['cells']:
   want=reference(row['input'],s['id']);assert set(s)==set(want),(set(s)-set(want),set(want)-set(s))
   for key,value in want.items():compare(s[key],value,key,row['input'],want);checks+=1
 return{'preparations':len(rows),'cells':len(rows)*4,'fieldChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

"""Independent 75-digit reference; no application-module imports."""
from decimal import Decimal as D,getcontext
from pathlib import Path
import json,sys,math
getcontext().prec=75
CA,MG,NA,CL,C,H,O=map(D,['40.078','24.305','22.98976928','35.45','12.011','1.008','15.999'])
R=18*C+33*H+2*O;SOAP=R+NA;DET=14*C+28*H+6*O
IDS=['soap-soft','soap-hard','detergent-soft','detergent-hard']
def cell(raw,id):
 q={k:D(str(v))for k,v in raw.items()if k!='matching'};soap=id.startswith('soap-');hard=id.endswith('-hard')
 mw=SOAP if soap else DET
 strength=q['soapMolL']if soap or raw['matching']=='molar'else q['soapMolL']*SOAP/DET
 v=q['sampleMl'];dose=q['deliveredMl'];stock=strength/50;delivered=strength*dose/1000;left=stock-delivered
 ca=q['calciumMmolL']*v/1000000 if hard else D(0);mg=q['magnesiumMmolL']*v/1000000 if hard else D(0);nh=ca+mg
 # Independent limiting fraction rather than the application's event amount.
 fraction=min(D(1),delivered/(2*nh))if soap and nh else D(0)
 pca=ca*fraction;pmg=mg*fraction;rca=ca-pca;rmg=mg-pmg;bound=2*(pca+pmg);free=delivered-bound
 sodium=delivered if soap else D(0);chloride=2*nh;vol=v+dose;freeconc=free*1000000/vol
 caproduct=pca*(CA+2*R);mgproduct=pmg*(MG+2*R);solids=caproduct+mgproduct
 salt=ca*(CA+2*CL)+mg*(MG+2*CL);water=v-salt;stockwater=20-stock*mw;dosewater=dose-delivered*mw
 freeg=free*(R if soap else mw);aqueous=rca*CA+rmg*MG+sodium*NA+chloride*CL+freeg
 vessel=water+dosewater+aqueous+solids;remaining=stockwater-dosewater+left*mw
 return dict(id=id,isSoap=soap,isHard=hard,formulaMassGmol=mw,stockMolL=strength,stockGL=strength*mw,stockSurfactantMol=stock,deliveredSurfactantMol=delivered,remainingStockSurfactantMol=left,initialCalciumMol=ca,initialMagnesiumMol=mg,initialHardnessMol=nh,precipitatedMetalMol=pca+pmg,reactedFraction=fraction,calciumPrecipitatedMol=pca,magnesiumPrecipitatedMol=pmg,calciumRemainingMol=rca,magnesiumRemainingMol=rmg,boundSurfactantMol=bound,freeSurfactantMol=free,nominalFinalMl=vol,initialHardnessMgL=nh*(CA+C+3*O)*1000000/v,dilutionOnlyHardnessMgL=nh*(CA+C+3*O)*1000000/vol,residualHardnessMgL=(rca+rmg)*(CA+C+3*O)*1000000/vol,freeSurfactantMmolL=freeconc,availableFraction=free/delivered if delivered else None,deliveredSurfactantG=delivered*mw,sodiumMol=sodium,chlorideMol=chloride,calciumSoapEquivalentG=caproduct,magnesiumSoapEquivalentG=mgproduct,scumEquivalentG=solids,sampleSaltG=salt,sampleCarrierG=water,stockCarrierG=stockwater,deliveredCarrierG=dosewater,remainingStockCarrierG=stockwater-dosewater,freeSurfactantG=freeg,aqueousSolutesG=aqueous,vesselFinalG=vessel,remainingStockG=remaining,initialAccountG=v+20,finalAccountG=vessel+remaining,nonionicCmcReferencePosition=None if soap else'below_reference_band'if freeconc<20 else'within_reference_band'if freeconc<=25 else'above_reference_band',materialResidualG=D(0),vesselMaterialResidualG=D(0),aqueousChargeResidualMol=D(0),calciumResidualMol=D(0),magnesiumResidualMol=D(0),surfactantResidualMol=D(0),sodiumResidualMol=D(0))
def compare(got,want,key):
 if want is None or isinstance(want,(str,bool)):assert got==want and type(got)==type(want),(key,got,want);return
 assert type(got)in[int,float]and math.isfinite(got),(key,got)
 floor=D('2e-18')if key.endswith('Mol')else D('2e-11')
 assert abs(D(str(got))-want)<=max(floor,abs(want)*D('2e-10')),(key,got,str(want))
def validate(rows):
 checks=0
 for row in rows:
  q=row['input'];state=row['state'];assert state['inputs']==q and [s['id']for s in state['cells']]==IDS
  expected=[cell(q,id)for id in IDS]
  for actual,want in zip(state['cells'],expected):
   assert set(actual)==set(want)
   for k,v in want.items():compare(actual[k],v,k);checks+=1
  ss,sh,ds,dh=expected
  comparison={'soapHardWaterLossMol':ss['freeSurfactantMol']-sh['freeSurfactantMol'],'detergentHardWaterLossMol':ds['freeSurfactantMol']-dh['freeSurfactantMol'],'detergentMinusSoapDeliveredMol':dh['deliveredSurfactantMol']-sh['deliveredSurfactantMol'],'detergentMinusSoapDeliveredG':dh['deliveredSurfactantG']-sh['deliveredSurfactantG']}
  assert set(state)==set(comparison)|{'inputs','cells'}
  for k,v in comparison.items():compare(state[k],v,k);checks+=1
 return{'preparations':len(rows),'cells':len(rows)*4,'fieldChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

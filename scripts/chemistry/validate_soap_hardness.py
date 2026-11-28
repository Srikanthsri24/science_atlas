"""Independent 70-digit material/species reference; never imports app code."""
from decimal import Decimal as D, getcontext
import json,sys,math
from pathlib import Path
getcontext().prec=70
CA,MG,NA,CL,C,H,O=map(D,['40.078','24.305','22.98976928','35.45','12.011','1.008','15.999'])
R=18*C+33*H+2*O
def reference(raw,id):
 q={k:D(str(v))for k,v in raw.items()};v=q['sampleMl'];dose=q['deliveredMl'];strength=q['soapMolL']
 ca=q['calciumMmolL']*v/D(1000000)if id in['calcium','mixed']else D(0)
 mg=q['magnesiumMmolL']*v/D(1000000)if id in['magnesium','mixed']else D(0)
 total=ca+mg;soap=strength*dose/1000;stock=strength/50
 # Solve soap availability in divalent equivalents, then distribute those
 # equivalents proportionally (the selected comparison assumption).
 ratio=min(D(1),soap/(2*total))if total else D(0)
 pca=ca*ratio;pmg=mg*ratio;rca=ca-pca;rmg=mg-pmg
 bound=2*(pca+pmg);free=soap-bound;finalv=v+dose
 salt=ca*(CA+2*CL)+mg*(MG+2*CL)
 samplecarrier=v-salt;stockcarrier=20-stock*(NA+R)
 deliveredcarrier=dose-soap*(NA+R)
 aq=rca*CA+rmg*MG+soap*NA+2*total*CL+free*R
 sca=pca*(CA+2*R);smg=pmg*(MG+2*R)
 vessel=samplecarrier+deliveredcarrier+aq+sca+smg
 remainingstock=(stockcarrier-deliveredcarrier)+(stock-soap)*(NA+R)
 return dict(calciumMol=ca,magnesiumMol=mg,hardnessMol=total,stockSoapMol=stock,deliveredSoapMol=soap,remainingStockSoapMol=stock-soap,precipitatedMetalMol=pca+pmg,reactedFraction=ratio,calciumPrecipitatedMol=pca,magnesiumPrecipitatedMol=pmg,calciumRemainingMol=rca,magnesiumRemainingMol=rmg,boundOleateMol=bound,freeOleateMol=free,sodiumMol=soap,chlorideMol=2*total,nominalFinalMl=finalv,initialHardnessMgL=total*(CA+C+3*O)*1000000/v,residualHardnessMgL=(rca+rmg)*(CA+C+3*O)*1000000/finalv,dilutionOnlyHardnessMgL=total*(CA+C+3*O)*1000000/finalv,stoichiometricSoapMl=2*total/strength*1000,freeSoapMmolL=free*1000000/finalv,foamProxy=min(D(1),free*1000000/finalv)*q['agitationCycles']/30,calciumSoapG=sca,magnesiumSoapG=smg,scumEquivalentG=sca+smg,sampleSaltG=salt,sampleCarrierG=samplecarrier,stockCarrierG=stockcarrier,deliveredCarrierG=deliveredcarrier,remainingStockCarrierG=stockcarrier-deliveredcarrier,aqueousSolutesG=aq,vesselFinalG=vessel,remainingStockG=remainingstock,initialAccountG=v+20,finalAccountG=vessel+remainingstock,materialResidualG=D(0),vesselMaterialResidualG=D(0),aqueousChargeResidualMol=D(0),calciumResidualMol=D(0),magnesiumResidualMol=D(0),oleateResidualMol=D(0),sodiumResidualMol=D(0))
def validate(rows):
 checks=0
 for row in rows:
  assert [s['id']for s in row['cells']]==['control','calcium','magnesium','mixed']
  for cell in row['cells']:
   expected=reference(row['input'],cell['id'])
   assert set(cell)==set(expected)|{'id'}
   for k,want in expected.items():
    got=cell[k];assert type(got)in[int,float]and math.isfinite(got),(cell['id'],k,got)
    # Near stoichiometric endpoints subtracting molecular inventories can lose
    # relative precision; absolute floors remain far below any UI measurement.
    floor=D('2e-18')if k.endswith('Mol')else D('2e-11')if k.endswith('G')else D('2e-11')
    error=abs(D(str(got))-want)
    assert error<=max(floor,abs(want)*D('2e-10')),(cell['id'],k,str(error),str(want),got)
    checks+=1
 return {'preparations':len(rows),'cells':len(rows)*4,'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

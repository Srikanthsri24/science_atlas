"""Independent 80-digit selected apparent-association reference; not a
calibrated starch assay or resolved iodine/iodide species calculation."""
import json,math,sys
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=80
I=D('126.90447');K=D('39.0983');MI=2*I;MKI=K+I;EPS=D(str(2**-52));IDS=['starch','half-starch','glucose','water']
def reference(raw,id):
 q={k:D(str(v))for k,v in raw.items()};sf=D(1)if id=='starch'else D('.5')if id=='half-starch'else D(0);gf=D(1)if id=='glucose'else D('.5')if id=='half-starch'else D(0)
 starch=q['starchGL']*q['sampleMl']/1000*sf;glucose=q['starchGL']*q['sampleMl']/1000*gf;samplecarrier=q['sampleMl']-starch-glucose
 left=2-q['withdrawnMl'];held=q['withdrawnMl']-q['deliveredMl'];v=q['sampleMl']+q['deliveredMl'];ki=10*q['iodineMmolL']
 iodine=lambda ml:q['iodineMmolL']*ml/D('1e6');potassium=lambda ml:ki*ml/D('1e6');carrier=lambda ml:ml-iodine(ml)*MI-potassium(ml)*MKI
 n0=iodine(2);ns=iodine(left);np=iodine(held);nv=iodine(q['deliveredMl']);k0=potassium(2);ks=potassium(left);kp=potassium(held);kv=potassium(q['deliveredMl'])
 cap=starch*q['capacityMmolG']/1000;L=nv*D('1e6')/v;S=cap*D('1e6')/v;kd=q['kdMmolL'];A=L+S+kd
 # Deliberately use the alternate quadratic root at high precision, rather
 # than the application's rationalized double-precision expression.
 B=(A-(A*A-4*L*S).sqrt())/2 if L and S else D(0);associated=B*v/D('1e6');unassociated=nv-associated;unused=cap-associated
 c0=carrier(2);cs=carrier(left);cp=carrier(held);cd=carrier(q['deliveredMl']);ag=associated*MI;ug=unassociated*MI;kg=kv*MKI;sg=cs+ns*MI+ks*MKI;pg=cp+np*MI+kp*MKI;vg=samplecarrier+starch+glucose+cd+ag+ug+kg;initial=q['sampleMl']+2
 return dict(id=id,starchFraction=sf,glucoseFraction=gf,starchG=starch,glucoseG=glucose,sampleCarrierG=samplecarrier,remainingStockMl=left,pipetteMl=held,vialMl=v,iodideMmolL=ki,initialIodineEqMol=n0,stockIodineEqMol=ns,pipetteIodineEqMol=np,vialIodineEqMol=nv,initialKiMol=k0,stockKiMol=ks,pipetteKiMol=kp,vialKiMol=kv,initialReagentCarrierG=c0,stockCarrierG=cs,pipetteCarrierG=cp,deliveredCarrierG=cd,capacityMol=cap,iodineEqMmolL=L,capacityMmolL=S,discriminant=A*A-4*L*S,associatedMmolL=B,associatedIodineEqMol=associated,unassociatedIodineEqMol=unassociated,unusedCapacityMol=unused,associatedIodineEqG=ag,unassociatedIodineEqG=ug,vialKiG=kg,stockG=sg,pipetteG=pg,vialG=vg,initialAccountG=initial,finalAccountG=initial,associatedFraction=associated/nv if nv else None,capacityOccupancy=associated/cap if cap else None,cue='no-iodine-reference'if not nv else'association-reference'if associated>0 else'reagent-colour-reference',associationResidualMmolL2=D(0),materialResidualG=D(0),iodineEquivalentResidualMol=D(0),iodideInventoryResidualMol=D(0),iodineAtomResidualMol=D(0),potassiumAtomResidualMol=D(0),capacityResidualMol=D(0))
def compare(actual,want,key,q,s):
 if want is None or isinstance(want,str):assert actual==want and type(actual)==type(want),(key,actual,want);return
 assert type(actual)in[int,float]and math.isfinite(actual),(key,actual)
 floor=D('1e-300')
 if 'Residual'in key:floor=D('2e-12')if key.endswith('G')else D('2e-13')if key.endswith('L2')else D('2e-18')
 # Cancellation allowances apply only to remaining stock/held volume and
 # quantities derived from those input subtractions, not association signal.
 if key in['remainingStockMl','stockIodineEqMol','stockKiMol','stockCarrierG','stockG','pipetteMl','pipetteIodineEqMol','pipetteKiMol','pipetteCarrierG','pipetteG']:
  scale=D(2)if key.startswith('stock')or key=='remainingStockMl'else D(str(q['withdrawnMl']));floor=64*EPS*scale
  if key.endswith('IodineEqMol'):floor*=D(str(q['iodineMmolL']))/D('1e6')
  if key.endswith('KiMol'):floor*=10*D(str(q['iodineMmolL']))/D('1e6')
 assert abs(D(str(actual))-want)<=max(floor,abs(want)*D('2e-10')),(key,actual,str(want),str(floor))
def validate(rows):
 count=0
 for row in rows:
  assert [s['id']for s in row['cells']]==IDS
  for actual in row['cells']:
   want=reference(row['input'],actual['id']);assert set(actual)==set(want),(set(actual)-set(want),set(want)-set(actual))
   for key,value in want.items():compare(actual[key],value,key,row['input'],want);count+=1
 return {'preparations':len(rows),'cells':len(rows)*4,'fieldChecks':count}
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))

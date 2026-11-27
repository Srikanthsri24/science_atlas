"""Independent CL-0098 reference:50-digit Decimal and species-vector atom/mass ledger.
No imports from the application. Reusable for the forthcoming practical-report checker.
"""
import json,sys
from decimal import Decimal,localcontext
D=lambda v:Decimal(str(v))
ATOMS={'Ca':D('40.078'),'C':D('12.011'),'H':D('1.008'),'O':D('15.999'),'Cl':D('35.45')}
SPECIES={'carbonate':{'Ca':1,'C':1,'O':3},'acid':{'H':1,'Cl':1},'chloride':{'Ca':1,'Cl':2},'gas':{'C':1,'O':2},'water':{'H':2,'O':1},'lime':{'Ca':1,'O':2,'H':2},'bicarbonate':{'Ca':1,'H':2,'C':2,'O':6}}
MASS={name:sum(ATOMS[a]*n for a,n in formula.items())for name,formula in SPECIES.items()}
KEYS=['carbonateG','acidMl','acidMolL','limeMl','limeMolL','reactionFraction','transferFraction']
LIMITS=[(0,.4),(10,30),(0,.3),(10,50),(0,.015),(0,1),(0,1)]
def solve(raw):
 with localcontext()as ctx:
  ctx.prec=50
  for k,(lo,hi)in zip(KEYS,LIMITS):assert isinstance(raw[k],(int,float))and not isinstance(raw[k],bool)and D(lo)<=D(raw[k])<=D(hi)
  m,va,ca,vl,cl,fr,ft=[D(raw[k])for k in KEYS];assert ft<=fr
  nc=m/MASS['carbonate'];na=va*ca/1000;nl=vl*cl/1000;max_r=min(nc,na/2);r=max_r*fr;delivered=max_r*ft;stored=r-delivered
  p=min(delivered,nl);d=min(max(D(0),delivered-nl),nl);solid=p-d;unreacted=nl-p;bypass=max(D(0),delivered-p-d)
  ws0=va-na*MASS['acid'];wr0=vl-nl*MASS['lime'];ws=ws0+r*MASS['water'];wr=wr0+(p-d)*MASS['water']
  source=[('carbonate',nc-r),('acid',na-2*r),('chloride',r),('water',ws/MASS['water'])]
  receiver=[('lime',unreacted),('carbonate',solid),('bicarbonate',d),('water',wr/MASS['water'])]
  gas=[('gas',stored),('gas',bypass)]
  initial=[('carbonate',nc),('acid',na),('water',ws0/MASS['water']),('lime',nl),('water',wr0/MASS['water'])]
  def mass(rows):return sum(MASS[name]*n for name,n in rows)
  def atoms(rows,atom):return sum(D(SPECIES[name].get(atom,0))*n for name,n in rows)
  total=source+receiver+gas;source_solid=(nc-r)*MASS['carbonate'];receiver_solid=solid*MASS['carbonate'];source_liquid=mass(source)-source_solid;receiver_liquid=mass(receiver)-receiver_solid
  molar_ml=D('8.314462618')*D('298.15')/D('101.325')*1000
  cleared=nl>0 and delivered>=2*nl*(1-D('1e-13'))
  category='untested'if delivered==0 else'no-lime-reagent'if nl==0 else'cleared-envelope'if cleared else'partly-redissolved'if d>0 else'precipitate-envelope'
  result=dict(carbonateInitialMol=nc,hclInitialMol=na,maximumReactionMol=max_r,reactedMol=r,carbonateRemainingMol=nc-r,hclRemainingMol=na-2*r,sourceCalciumChlorideMol=r,sourceInitialWaterG=ws0,sourceWaterG=ws,sourceLiquidG=source_liquid,sourceSolidG=source_solid,sourceLiquidMl=source_liquid,sourceSolidMl=source_solid/D('2.71'),sourceFillMl=source_liquid+source_solid/D('2.71'),generatedMol=r,transferredMol=delivered,syringeMol=stored,generatedMl=r*molar_ml,transferredMl=delivered*molar_ml,syringeMl=stored*molar_ml,limeInitialMol=nl,precipitatedMol=p,redissolvedMol=d,limeRemainingMol=unreacted,precipitateMol=solid,bicarbonateMol=d,consumedCo2Mol=p+d,bypassMol=bypass,bypassMl=bypass*molar_ml,receiverInitialWaterG=wr0,receiverWaterG=wr,receiverSolidG=receiver_solid,receiverLiquidG=receiver_liquid,receiverLiquidMl=receiver_liquid,receiverSolidMl=receiver_solid/D('2.71'),receiverFillMl=receiver_liquid+receiver_solid/D('2.71'),initialTotalG=mass(initial),finalTotalG=mass(total),category=category,clearedBoundary=cleared,carbonateThresholdFraction=None if max_r==0 else nl/max_r,clearingThresholdFraction=None if max_r==0 else 2*nl/max_r,peakReachable=max_r>0 and nl>0 and max_r>=nl,clearingReachable=max_r>0 and nl>0 and max_r>=2*nl,sourceMassResidualG=m+va-mass(source)-r*MASS['gas'],receiverMassResidualG=vl+(p+d)*MASS['gas']-mass(receiver),gasResidualMol=r-stored-p-d-bypass,massResidualG=mass(initial)-mass(total))
  for atom,field in [('Ca','calciumResidualMol'),('C','carbonResidualMol'),('Cl','chlorineResidualMol'),('H','hydrogenResidualMol'),('O','oxygenResidualMol')]:result[field]=atoms(initial,atom)-atoms(total,atom)
  return result

def main(path):
 data=json.load(open(path));checks=0
 for i,case in enumerate(data['cases']):
  expected=solve(case['inputs']);actual=case['state']
  for key,value in expected.items():
   checks+=1
   if value is None or isinstance(value,(str,bool)):assert actual[key]==value,(i,key,actual[key],value)
   else:
    n=D(actual[key]);tol=max(D('1e-14')if key.endswith('Mol')else D('2e-12'),abs(value)*D('5e-11'));assert n.is_finite()and abs(n-value)<=tol,(i,key,n,value,tol)
 print(f'PASS:{len(data["cases"])}cases,{checks}independent species-vector/Decimal field checks;five elements and whole mass retained.')
if __name__=='__main__':main(sys.argv[1])

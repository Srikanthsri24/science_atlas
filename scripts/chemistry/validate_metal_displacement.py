"""Independent80-digit Decimal finite-stock selected-displacement reference."""
import json,sys
from pathlib import Path
from decimal import Decimal as D,getcontext
getcontext().prec=80
METALS={'Zn':(D('65.38'),3),'Fe':(D('55.845'),2),'Cu':(D('63.546'),1)}
def reference(q):
 A=q['coupon'];B=q['solution'];ma,ra=METALS[A];mb,rb=METALS[B];mass=D(str(q['couponMassG']));L=D(str(q['volumeMl']))/1000;na=mass/ma;nb=D(str(q['concentrationMolL']))*L;eligible=ra>rb;cap=min(na,nb)if eligible else D(0);extent=D(str(q['progress']))*cap if q['contact']else D(0);arem=na-extent;brem=nb-extent;species=[]
 for element,(M,_)in METALS.items():
  si=na if element==A else D(0);bi=nb if element==B else D(0);sf=(arem if element==A else D(0))+(extent if element==B else D(0));bf=(brem if element==B else D(0))+(extent if element==A else D(0));species.append(dict(id=element,initialSolidMol=si,initialBathMol=bi,finalSolidMol=sf,finalBathMol=bf,initialTotalMol=si+bi,finalTotalMol=sf+bf,finalConcentrationMolL=bf/L))
 complete=eligible and q['contact']and q['progress']==1;loss=mass if complete and na<=nb else extent*ma;remaining=D(0)if complete and na<=nb else mass-loss;deposit=extent*mb;solid=remaining+deposit;initial=mass+nb*mb;bmass=sum((s['finalBathMol']*METALS[s['id']][0]for s in species),D(0))
 limiting=('same-metal control'if A==B else'reverse-order control')if not eligible else'no-contact control'if not q['contact']else'no coupon'if na==0 else'no target ions'if nb==0 else'coupon'if na<nb else'solution ions'if na>nb else'co-limiting'
 return dict(volumeL=L,couponInitialMol=na,targetInitialMol=nb,eligible=eligible,netReaction=eligible and q['contact']and cap>0,capacityMol=cap,extentMol=extent,couponRemainingMol=arem,targetRemainingMol=brem,couponRemainingG=remaining,couponDissolvedG=loss,depositMassG=deposit,solidAssemblyG=solid,initialRelevantMetalMassG=initial,finalBathMetalMassG=bmass,finalRelevantMetalMassG=solid+bmass,electronTransferMol=2*extent,sulfateMol=nb,initialCationChargeEqMol=2*nb,finalCationChargeEqMol=2*sum((s['finalBathMol']for s in species),D(0)),sulfateChargeEqMol=-2*nb,targetConversion=extent/nb if nb else None,couponConversion=extent/na if na else None,limiting=limiting),species

def compare(a,b):
 if b is None:assert a is None
 elif isinstance(b,(bool,str)):assert type(a)==type(b)and a==b,(a,b)
 else:
  assert type(a)in[int,float]
  assert abs(D(str(a))-b)<=abs(b)*D('6e-14'),(str(a),str(b))
def validate(cases):
 checks=0
 for case in cases:
  expected,species=reference(case['inputs']);assert set(case['actual'])==set(expected)
  for k,b in expected.items():compare(case['actual'][k],b);checks+=1
  assert len(case['species'])==3
  for a,b in zip(case['species'],species):
   assert set(a)==set(b)
   for k,value in b.items():compare(a[k],value);checks+=1
 return dict(combinations=len(cases),typedFieldChecks=checks)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]if len(sys.argv)>1 else'reports/chemistry-expansion/CL-0123/core-reference-fixtures.json').read_text()))))

"""Independent high-precision finite acid / metal / hydrogen accounts."""
import json
from decimal import Decimal as D,getcontext
from pathlib import Path
getcontext().prec=80
M={'Zn':D('65.38'),'Fe':D('55.845'),'Cu':D('63.546')};R=D('8.31446261815324')
def reference(q):
 mass=D(str(q['massG']));c=D(str(q['acidMolL']));v=D(str(q['volumeMl']))/1000;p=D(str(q['progress']));t=D(str(q['temperatureC']))+D('273.15');pressure=D(str(q['pressureKPa']))*1000;collector=D(str(q['collectorMl']));n=mass/M[q['metal']];a=c*v;reactive=q['metal']!='Cu';cap=min(n,a/2)if reactive else D(0);x=p*cap if q['contact']else D(0);end=q['contact']and p==1 and reactive
 loss=mass if end and n<=a/2 else x*M[q['metal']];remaining=0 if end and n<=a/2 else max(D(0),n-x);acid=0 if end and a/2<=n else max(D(0),a-2*x);consumed=a if end and a/2<=n else 2*x
 m3=x*R*t/pressure;ml=m3*1000000;retained=min(ml,collector);overflow=max(D(0),ml-collector);retainedn=collector/1000000*pressure/(R*t)if ml>collector else x
 limiting='copper control'if not reactive else'no-contact control'if not q['contact']else'no metal'if n==0 else'no acid'if a==0 else'metal'if n<a/2 else'acid'if n>a/2 else'co-limiting'
 return dict(volumeL=v,metalInitialMol=n,acidInitialMol=a,capacityMol=cap,extentMol=x,metalDissolvedG=loss,metalRemainingG=max(D(0),mass-loss),metalRemainingMol=remaining,acidConsumedMol=consumed,acidRemainingMol=acid,metalIonMol=x,hydrogenMol=x,electronTransferMol=2*x,temperatureK=t,pressurePa=pressure,generatedM3=m3,generatedMl=ml,retainedMl=retained,overflowMl=overflow,retainedMol=retainedn,overflowMol=max(D(0),x-retainedn),reliefOpen=overflow>0,chlorideMol=a,positiveChargeEqMol=acid+2*x,negativeChargeEqMol=-a,metalInitialTotalMol=n,metalFinalTotalMol=remaining+x,hydrogenInitialAtomMol=a,hydrogenFinalAtomMol=acid+2*x,chlorineInitialAtomMol=a,chlorineFinalAtomMol=a,metalConversion=x/n if n else None,acidConversion=consumed/a if a else None,limiting=limiting,equation=f"{q['metal']}(s) + 2HCl(aq) → {q['metal']}Cl2(aq) + H2(g)"if reactive else'No selected hydrogen-evolution reaction with dilute HCl')
def validate(cases):
 count=0
 for case in cases:
  expected=reference(case['inputs']);actual=case['actual']
  for key,e in expected.items():
   a=actual[key]
   if e is None:assert a is None,key
   elif isinstance(e,(bool,str)):assert type(a)==type(e)and a==e,(key,a,e)
   else:
    assert isinstance(a,(float,int))and not isinstance(a,bool),key
    a=D(str(a));e=D(e);assert abs(a-e)<=max(abs(a),abs(e))*D('5e-12'),(key,a,e)
   count+=1
 return dict(cases=len(cases),fields=count)
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path('reports/chemistry-expansion/CL-0124/core-reference-fixtures.json').read_text()))))

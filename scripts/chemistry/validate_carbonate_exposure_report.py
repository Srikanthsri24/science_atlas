"""Independent CL-0111 HTML tables, results, arithmetic and operand audit."""
import ast,json,re,sys
from pathlib import Path
from validate_soap_hardness_report import Report as BaseReport,signature
from validate_salt_corrosion_report import evaluate_substitution,NUM
from validate_carbonate_exposure import reference,compare,D,MC,CA,NO3,H,ACID,WATER,GAS,R,RHO,IDS
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):
  attrs=[(k,'soap-hardness-record-inputs'if k=='id'and v=='carbonate-exposure-record-inputs'else v)for k,v in attrs]
  super().handle_starttag(tag,attrs)
def expressions(q,s):
 x=lambda k:str(s[k]);v=lambda k:str(q[k])
 return{
 'initialCarbonateMol':f'{x("initialSpecimenG")}/{MC}',
 'deliveredAcidMol':f'{x("acidMmolL")}*{v("deliveredMl")}/1000000',
 'contactStreamMl':f'{v("deliveredMl")}*{v("contactFraction")}',
 'bypassStreamMl':f'{v("deliveredMl")}-{x("contactStreamMl")}',
 'contactAcidMol':f'{x("deliveredAcidMol")}*{v("contactFraction")}',
 'reactedCarbonateMol':f'min({x("initialCarbonateMol")},{x("contactAcidMol")}/2)',
 'acidConsumedMol':f'2*{x("reactedCarbonateMol")}',
 'remainingAcidMol':f'max(0,{x("deliveredAcidMol")}-{x("acidConsumedMol")})',
 'specimenLostG':f'{x("reactedCarbonateMol")}*{MC}',
 'remainingSpecimenG':f'{x("initialSpecimenG")}-{x("specimenLostG")}',
 'removedDepthMm':f'{x("specimenLostG")}/({RHO}*{v("areaCm2")})*10',
 'calciumMol':x('reactedCarbonateMol'),'nitrateMol':x('deliveredAcidMol'),
 'generatedWaterG':f'{x("reactedCarbonateMol")}*{WATER}',
 'carbonDioxideG':f'{x("reactedCarbonateMol")}*{GAS}',
 'capturedGasMol':f'{x("reactedCarbonateMol")}*{v("captureFraction")}',
 'escapedGasMol':f'{x("reactedCarbonateMol")}-{x("capturedGasMol")}',
 'capturedGasMl':f'{x("capturedGasMol")}*{R}*{v("temperatureK")}/{v("pressureKPa")}*1000',
 'escapedGasG':f'{x("escapedGasMol")}*{GAS}',
 'stockAcidMol':f'{x("acidMmolL")}*1000/1000000',
 'remainingStockAcidMol':f'{x("stockAcidMol")}-{x("deliveredAcidMol")}',
 'deliveredCarrierG':f'{v("deliveredMl")}*1-{x("deliveredAcidMol")}*{ACID}',
 'aqueousSolutesG':f'{x("calciumMol")}*{CA}+{x("nitrateMol")}*{NO3}+{x("remainingAcidMol")}*{H}',
 'effluentG':f'{x("deliveredCarrierG")}+{x("generatedWaterG")}+{x("aqueousSolutesG")}',
 'retainedAccountG':f'{x("remainingSpecimenG")}+{x("effluentG")}+{x("capturedGasG")}+{x("remainingStockG")}',
 'materialResidualG':f'{x("retainedAccountG")}+{x("escapedGasG")}-{x("initialAccountG")}',
 'aqueousChargeResidualMol':f'2*{x("calciumMol")}+{x("remainingAcidMol")}-{x("nitrateMol")}',
 'requiredDoseMl':f'2*{x("initialCarbonateMol")}/({x("acidMmolL")}*{v("contactFraction")})*1000000'}
FIELDS=[['initialSpecimenG','acidMmolL','contactAcidMol','reactedCarbonateMol','specimenLostG','remainingSpecimenG','removedDepthMm','requiredDoseMl'],['contactStreamMl','bypassStreamMl','calciumMol','nitrateMol','remainingAcidMol','generatedWaterG','capturedGasMl','escapedGasG'],['initialAccountG','retainedAccountG','accountIncludingEscapeG','materialResidualG','aqueousChargeResidualMol','remainingStockG','effluentG']]
def unit(key):
 if key.endswith('G'):return'g'
 if key.endswith('Mol'):return'mol charge'if key=='aqueousChargeResidualMol'else'mol'
 if key.endswith('Mm'):return'mm'
 return'mL'
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);assert len(p.tables)==4;trials=r['trials'];assert len(trials)<=40;assert len(p.blocks)==112*len(trials);tables=0;operands=0;undefined=0;seen=set()
 keys=['specimenG','areaCm2','acidMmolL','deliveredMl','contactFraction','captureFraction','temperatureK','pressureKPa']
 assert len(p.tables[0])==len(trials)+1 and len(p.tables[0][0])==10
 for i,q in enumerate(trials):
  row=p.tables[0][i+1];assert row[0]==str(i+1)and row[-1]==q['note']and len(row)==10
  for actual,k in zip(row[1:-1],keys):assert abs(D(actual)-D(str(q[k])))<=max(D('1e-300'),abs(D(str(q[k])))*D('2e-15'));tables+=1
 for table,fields in zip(p.tables[1:],FIELDS):
  assert len(table)==1+4*len(trials)and len(table[0])==2+len(fields)
  for i,q in enumerate(trials):
   for j,id in enumerate(IDS):
    row=table[1+i*4+j];assert row[:2]==[str(i+1),id]and len(row)==len(fields)+2;s=reference({k:q[k]for k in keys},id)
    for a,k in zip(row[2:],fields):
     if s[k]is None:assert a=='Undefined'
     else:compare(float(a),s[k],k,q,s)
     tables+=1
 for b in p.blocks:
  i=b['trial'];id,k=b['key'].split('.');assert (i,id,k)not in seen;seen.add((i,id,k));q=trials[i];s=reference({k:q[k]for k in keys},id);want=expressions(q,s)[k]
  actual=b['substitution'].split(';')[0].replace('×','*').replace('−','-').strip()
  assert signature(ast.parse(actual,mode='eval').body)==signature(ast.parse(want,mode='eval').body),(k,'operators')
  leaves=lambda source:[ast.get_source_segment(source,n)for n in ast.walk(ast.parse(source,mode='eval'))if isinstance(n,ast.Constant)]
  av=leaves(actual);wv=leaves(want);assert len(av)==len(wv)
  for a,w in zip(av,wv):assert abs(D(a)-D(w))<=max(D('3e-16'),abs(D(w))*D('2e-10')),(k,a,w);operands+=1
  if s[k]is None:assert b['result'].startswith('Undefined');undefined+=1;continue
  result=re.fullmatch('('+NUM+') (.+)',b['result']);assert result and result[2]==unit(k),(k,b['result']);compare(float(result[1]),s[k],k,q,s)
  calc=evaluate_substitution(actual);assert abs(calc-D(result[1]))<=max(D('2e-11')if 'Residual'in k or k.endswith('G')else D('2e-17'),abs(calc)*D('2e-10')),(k,calc,result[1])
 return {'trials':len(trials),'workedResults':len(p.blocks),'undefinedResults':undefined,'operandChecks':operands,'tableChecks':tables}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

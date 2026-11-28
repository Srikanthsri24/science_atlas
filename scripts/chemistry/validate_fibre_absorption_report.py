"""Independent CL-0112 HTML: tables, results, units, operands and operations."""
import ast,json,re,sys
from pathlib import Path
from decimal import ROUND_FLOOR
from validate_soap_hardness_report import Report as BaseReport,signature
from validate_salt_corrosion_report import NUM
from validate_fibre_absorption import reference,compare,D,IDS
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'soap-hardness-record-inputs'if k=='id'and v=='fibre-absorption-record-inputs'else v)for k,v in attrs])
def expressions(q,s):
 x=lambda k:str(s[k]);v=lambda k:str(q[k])
 return{
 'strongCapacityG':f'{v("dryMassG")}*{x("strongReferenceGg")}*{v("retentionScale")}',
 'drainableCapacityG':f'{v("dryMassG")}*{x("drainableReferenceGg")}*{v("constructionFactor")}',
 'totalCapacityG':f'{x("strongCapacityG")}+{x("drainableCapacityG")}',
 'soakExponent':f'{v("wettingScale")}*{v("soakS")}/{x("soakTauS")}',
 'soakFraction':f'1-exp(-{x("soakExponent")})',
 'unlimitedUptakeG':f'{x("totalCapacityG")}*{x("soakFraction")}',
 'initialBathG':f'{v("bathMl")}*1',
 'uptakeG':f'min({x("initialBathG")},{x("unlimitedUptakeG")})',
 'capacityFraction':f'{x("uptakeG")}/{x("totalCapacityG")}',
 'strongAtLiftG':f'{x("strongCapacityG")}*{x("capacityFraction")}',
 'drainableAtLiftG':f'{x("drainableCapacityG")}*{x("capacityFraction")}',
 'drainageExponent':f'{v("drainS")}/{x("drainTauS")}',
 'drainFraction':f'1-exp(-{x("drainageExponent")})',
 'drainableRemainingG':f'{x("drainableAtLiftG")}*exp(-{x("drainageExponent")})',
 'drainedG':f'{x("drainableAtLiftG")}*{x("drainFraction")}',
 'retainedG':f'{x("strongAtLiftG")}+{x("drainableRemainingG")}',
 'remainingBathG':f'{x("initialBathG")}-{x("uptakeG")}',
 'wetCouponG':f'{v("dryMassG")}+{x("retainedG")}',
 'dryGrossG':f'{v("panTareG")}+{v("dryMassG")}',
 'wetGrossG':f'{v("panTareG")}+{x("wetCouponG")}',
 'tareMilliG':f'floor(({v("panTareG")}+1e-12)*1000+0.5)',
 'dryGrossMilliG':f'floor(({x("dryGrossG")}+1e-12)*1000+0.5)',
 'wetGrossMilliG':f'floor(({x("wetGrossG")}+1e-12)*1000+0.5)',
 'indicatedDryG':f'({x("dryGrossMilliG")}-{x("tareMilliG")})/1000',
 'indicatedWetG':f'({x("wetGrossMilliG")}-{x("tareMilliG")})/1000',
 'indicatedWaterG':f'({x("wetGrossMilliG")}-{x("dryGrossMilliG")})/1000',
 'retainedGg':f'{x("retainedG")}/{v("dryMassG")}',
 'dryBasisGainPercent':f'100*{x("retainedG")}/{v("dryMassG")}',
 'wetBasisWaterPercent':f'100*{x("retainedG")}/{x("wetCouponG")}',
 'indicatedRetainedGg':f'{x("indicatedWaterG")}/{x("indicatedDryG")}',
 'indicatedDryBasisGainPercent':f'100*{x("indicatedWaterG")}/{x("indicatedDryG")}',
 'indicationErrorG':f'{x("indicatedWaterG")}-{x("retainedG")}',
 'initialMaterialG':f'{v("dryMassG")}+{x("initialBathG")}',
 'finalMaterialG':f'{x("wetCouponG")}+{x("remainingBathG")}+{x("drainedG")}',
 'waterResidualG':f'{x("remainingBathG")}+{x("retainedG")}+{x("drainedG")}-{x("initialBathG")}',
 'materialResidualG':f'{x("finalMaterialG")}-{x("initialMaterialG")}'}
def evaluate(source):
 def visit(node):
  if isinstance(node,ast.Expression):return visit(node.body)
  if isinstance(node,ast.Constant):assert type(node.value)in[int,float];return D(ast.get_source_segment(source,node))
  if isinstance(node,ast.UnaryOp):
   if isinstance(node.op,ast.USub):return -visit(node.operand)
   if isinstance(node.op,ast.UAdd):return visit(node.operand)
  if isinstance(node,ast.BinOp):
   a,b=visit(node.left),visit(node.right)
   if isinstance(node.op,ast.Add):return a+b
   if isinstance(node.op,ast.Sub):return a-b
   if isinstance(node.op,ast.Mult):return a*b
   if isinstance(node.op,ast.Div):return a/b
  if isinstance(node,ast.Call)and isinstance(node.func,ast.Name)and not node.keywords:
   args=[visit(a)for a in node.args]
   if node.func.id=='min':return min(args)
   if node.func.id=='exp'and len(args)==1:return args[0].exp()
   if node.func.id=='floor'and len(args)==1:return args[0].to_integral_value(rounding=ROUND_FLOOR)
  raise AssertionError('Unsupported expression: '+source)
 return visit(ast.parse(source,mode='eval'))
FIELDS=[['totalCapacityG','uptakeG','strongAtLiftG','drainableAtLiftG','drainedG','retainedG','remainingBathG'],['dryGrossMilliG','wetGrossMilliG','tareMilliG','indicatedDryG','indicatedWetG','indicatedWaterG','retainedGg','dryBasisGainPercent','wetBasisWaterPercent','indicatedDryBasisGainPercent'],['wetCouponG','indicationErrorG','initialMaterialG','finalMaterialG','waterResidualG','materialResidualG']]
def unit(key):
 if key.endswith('MilliG'):return'mg'
 if key.endswith('Gg'):return'g/g dry'
 if key in['dryBasisGainPercent','indicatedDryBasisGainPercent']:return'% dry basis'
 if key=='wetBasisWaterPercent':return'% wet basis'
 if key.endswith('Fraction'):return'fraction'
 if key in['soakExponent','drainageExponent']:return'dimensionless'
 return'g'
def near(a,b,key,s):compare(float(a),b,key,s)
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40;assert len(p.tables)==4;assert len(p.blocks)==144*len(trials);tablechecks=0;operands=0;seen=set()
 keys=['dryMassG','bathMl','soakS','drainS','constructionFactor','retentionScale','wettingScale','panTareG']
 assert len(p.tables[0])==len(trials)+1 and p.tables[0][0]==['Trial','Dry mass g','Initial water mL','Selected soak s','Selected drain s','Construction factor','Strong retention scale','Wetting scale','Pan tare g','Student observation']
 for table,units in zip(p.tables[1:],[['g']*7,['mg']*3+['g']*3+['g/g dry','%','%','%'],['g']*6]):
  assert table[0][:2]==['Trial','Coupon']
  for header,u in zip(table[0][2:],units):assert header.endswith(' '+u),(header,u)
 assert 'dry-basis'in p.tables[2][0][9]and 'wet-basis'in p.tables[2][0][10]and 'dry-basis'in p.tables[2][0][11]
 for i,q in enumerate(trials):
  row=p.tables[0][i+1];assert len(row)==10 and row[0]==str(i+1)and row[-1]==q['note']
  for a,k in zip(row[1:-1],keys):assert abs(D(a)-D(str(q[k])))<=max(D('1e-300'),abs(D(str(q[k])))*D('2e-15'));tablechecks+=1
 for table,fields in zip(p.tables[1:],FIELDS):
  assert len(table)==4*len(trials)+1 and len(table[0])==len(fields)+2
  for i,q in enumerate(trials):
   for j,id in enumerate(IDS):
    row=table[1+4*i+j];assert row[:2]==[str(i+1),id]and len(row)==len(fields)+2;s=reference({k:q[k]for k in keys},id)
    for a,k in zip(row[2:],fields):near(a,s[k],k,s);tablechecks+=1
 for b in p.blocks:
  i=b['trial'];id,k=b['key'].split('.');assert (i,id,k)not in seen;seen.add((i,id,k));q=trials[i];s=reference({k:q[k]for k in keys},id);want=expressions(q,s)[k];actual=b['substitution'].replace('×','*').replace('−','-')
  assert signature(ast.parse(actual,mode='eval').body)==signature(ast.parse(want,mode='eval').body),(k,'operators')
  leaves=lambda source:[ast.get_source_segment(source,n)for n in ast.walk(ast.parse(source,mode='eval'))if isinstance(n,ast.Constant)]
  av,wv=leaves(actual),leaves(want);assert len(av)==len(wv)
  for a,w in zip(av,wv):assert abs(D(a)-D(w))<=max(D('1e-300'),abs(D(w))*D('2e-10')),(k,a,w);operands+=1
  result=re.fullmatch('('+NUM+') (.+)',b['result']);assert result and result[2]==unit(k),(k,b['result']);near(result[1],s[k],k,s)
  calculated=evaluate(actual);floor=D('2e-12')if k.endswith('ResidualG')else D('1e-16')if k=='indicationErrorG'else D('1e-300');assert abs(calculated-D(result[1]))<=max(floor,abs(calculated)*D('2e-10')),(k,calculated,result[1])
 return {'trials':len(trials),'workedResults':len(p.blocks),'operandChecks':operands,'tableChecks':tablechecks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

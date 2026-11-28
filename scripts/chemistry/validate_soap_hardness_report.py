"""Independent report arithmetic, operand, operator and unit checks."""
import ast,json,re,sys
from pathlib import Path
from html.parser import HTMLParser
from decimal import Decimal as D
from validate_soap_hardness import reference,CA,MG,NA,CL,C,O,R
from validate_salt_corrosion_report import evaluate_substitution,NUM
class Report(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.blocks=[];self.payload='';self.script=False;self.block=None;self.part=None;self.trial=None;self.heading=False;self.title='';self.tables=[];self.table=None;self.row=None;self.incell=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h3':self.heading=True;self.title=''
  if tag=='table':self.table=[]
  if tag=='tr':self.row=[]
  if tag in['th','td']:self.incell=True;self.row.append('')
  if tag=='script'and a.get('id')=='soap-hardness-record-inputs':self.script=True
  if tag=='section'and a.get('class')=='worked':self.block={'key':a['data-key'],'trial':self.trial,'substitution':'','result':''}
  if tag=='p'and self.block is not None and a.get('class')in['substitution','result']:self.part=a['class']
 def handle_data(self,s):
  if self.script:self.payload+=s
  if self.heading:self.title+=s
  if self.block is not None and self.part:self.block[self.part]+=s
  if self.incell:self.row[-1]+=s
 def handle_endtag(self,tag):
  if tag=='script':self.script=False
  if tag=='h3':self.heading=False;self.trial=int(self.title.split()[-1])-1
  if tag=='p':self.part=None
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None
  if tag in['th','td']:self.incell=False
  if tag=='tr':
   assert self.table is not None,'Row outside observation table'
   self.table.append(self.row);self.row=None
  if tag=='table':
   assert self.table is not None,'Missing table opening'
   self.tables.append(self.table);self.table=None
def expressions(q,id,s):
 def x(k):return str(s[k])
 ca=q['calciumMmolL']if id in['calcium','mixed']else 0
 mg=q['magnesiumMmolL']if id in['magnesium','mixed']else 0
 v=q['sampleMl'];dose=q['deliveredMl'];strength=q['soapMolL']
 return {
 'calciumMol':f'{ca}*{v}/1000000','magnesiumMol':f'{mg}*{v}/1000000',
 'hardnessMol':f'{x("calciumMol")}+{x("magnesiumMol")}',
 'stockSoapMol':f'{strength}*20/1000','deliveredSoapMol':f'{strength}*{dose}/1000',
 'remainingStockSoapMol':f'{x("stockSoapMol")}-{x("deliveredSoapMol")}',
 'precipitatedMetalMol':f'min({x("hardnessMol")},{x("deliveredSoapMol")}/2)',
 'reactedFraction':f'{x("precipitatedMetalMol")}/{x("hardnessMol")}'if s['hardnessMol']else'0',
 'calciumPrecipitatedMol':f'{x("calciumMol")}*{x("reactedFraction")}',
 'magnesiumPrecipitatedMol':f'{x("magnesiumMol")}*{x("reactedFraction")}',
 'calciumRemainingMol':f'{x("calciumMol")}-{x("calciumPrecipitatedMol")}',
 'magnesiumRemainingMol':f'{x("magnesiumMol")}-{x("magnesiumPrecipitatedMol")}',
 'boundOleateMol':f'2*{x("precipitatedMetalMol")}',
 'freeOleateMol':f'max(0,{x("deliveredSoapMol")}-{x("boundOleateMol")})',
 'nominalFinalMl':f'{v}+{dose}',
 'initialHardnessMgL':f'{x("hardnessMol")}*{CA+C+3*O}*1000000/{v}',
 'dilutionOnlyHardnessMgL':f'{x("hardnessMol")}*{CA+C+3*O}*1000000/{x("nominalFinalMl")}',
 'residualHardnessMgL':f'({x("calciumRemainingMol")}+{x("magnesiumRemainingMol")})*{CA+C+3*O}*1000000/{x("nominalFinalMl")}',
 'stoichiometricSoapMl':f'2*{x("hardnessMol")}*1000/{strength}',
 'freeSoapMmolL':f'{x("freeOleateMol")}*1000000/{x("nominalFinalMl")}',
 'foamProxy':f'min(1,{x("freeSoapMmolL")}/1)*{q["agitationCycles"]}/30',
 'calciumSoapG':f'{x("calciumPrecipitatedMol")}*{CA+2*R}',
 'magnesiumSoapG':f'{x("magnesiumPrecipitatedMol")}*{MG+2*R}',
 'scumEquivalentG':f'{x("calciumSoapG")}+{x("magnesiumSoapG")}',
 'sampleSaltG':f'{x("calciumMol")}*{CA+2*CL}+{x("magnesiumMol")}*{MG+2*CL}',
 'sampleCarrierG':f'{v}*1-{x("sampleSaltG")}',
 'deliveredCarrierG':f'{dose}*1-{x("deliveredSoapMol")}*{NA+R}',
 'stockCarrierG':f'20*1-{x("stockSoapMol")}*{NA+R}',
 'remainingStockCarrierG':f'{x("stockCarrierG")}-{x("deliveredCarrierG")}',
 'sodiumMol':x('deliveredSoapMol'),'chlorideMol':f'2*{x("hardnessMol")}',
 'aqueousSolutesG':f'{x("calciumRemainingMol")}*{CA}+{x("magnesiumRemainingMol")}*{MG}+{x("sodiumMol")}*{NA}+{x("chlorideMol")}*{CL}+{x("freeOleateMol")}*{R}',
 'vesselFinalG':f'{x("sampleCarrierG")}+{x("deliveredCarrierG")}+{x("aqueousSolutesG")}+{x("scumEquivalentG")}',
 'remainingStockG':f'{x("remainingStockCarrierG")}+{x("remainingStockSoapMol")}*{NA+R}',
 'initialAccountG':f'{v}*1+20*1','finalAccountG':f'{x("vesselFinalG")}+{x("remainingStockG")}',
 'materialResidualG':f'{x("finalAccountG")}-{x("initialAccountG")}',
 'aqueousChargeResidualMol':f'2*({x("calciumRemainingMol")}+{x("magnesiumRemainingMol")})+{x("sodiumMol")}-{x("chlorideMol")}-{x("freeOleateMol")}'
 }
def unit(key):
 if key in['initialHardnessMgL','dilutionOnlyHardnessMgL','residualHardnessMgL']:return'mg/L as CaCO₃'
 if key=='freeSoapMmolL':return'mmol/L'
 if key=='foamProxy':return'index'
 if key=='reactedFraction':return'fraction'
 if key=='aqueousChargeResidualMol':return'mol charge'
 if key.endswith('Mol'):return'mol'
 if key.endswith('Ml'):return'mL'
 return'g'
def near(a,b,floor=D('2e-11')):assert abs(D(str(a))-D(str(b)))<=max(floor,abs(D(str(b)))*D('2e-10')),(a,b)
def signature(node):
 if isinstance(node,ast.Constant):return'number'
 if isinstance(node,ast.UnaryOp):return(type(node.op).__name__,signature(node.operand))
 if isinstance(node,ast.BinOp):return(type(node.op).__name__,signature(node.left),signature(node.right))
 if isinstance(node,ast.Call):return(node.func.id,tuple(signature(x)for x in node.args))
 raise AssertionError('Unexpected expression')
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);assert len(p.tables)==4
 tables=[
  [('Initial calcium mol','calciumMol'),('Initial magnesium mol','magnesiumMol'),('Soap delivered mol','deliveredSoapMol'),('Calcium precipitated mol','calciumPrecipitatedMol'),('Magnesium precipitated mol','magnesiumPrecipitatedMol'),('Calcium remaining mol','calciumRemainingMol'),('Magnesium remaining mol','magnesiumRemainingMol'),('Bound oleate mol','boundOleateMol'),('Free oleate mol','freeOleateMol')],
  [('Initial hardness mg/L as CaCO₃','initialHardnessMgL'),('Dilution-only hardness mg/L as CaCO₃','dilutionOnlyHardnessMgL'),('Residual hardness mg/L as CaCO₃','residualHardnessMgL'),('Stoichiometric soap requirement mL','stoichiometricSoapMl'),('Free soap mmol/L nominal mixture','freeSoapMmolL'),('Chosen foam proxy (0–1; not height)','foamProxy'),('Calcium soap equivalent g','calciumSoapG'),('Magnesium soap equivalent g','magnesiumSoapG')],
  [('Soap stock remaining mol','remainingStockSoapMol'),('Remaining stock g','remainingStockG'),('Final vessel g','vesselFinalG'),('Initial total account g','initialAccountG'),('Final total account g','finalAccountG'),('Material residual g','materialResidualG'),('Aqueous charge residual mol charge','aqueousChargeResidualMol'),('Oleate residual mol','oleateResidualMol')]]
 assert p.tables[0][0]==['Trial','Sample mL','Selected calcium mmol/L','Selected magnesium mmol/L','Soap stock mol/L','Delivered soap mL','Selected agitation cycles','Student observation']
 assert len(p.tables[0])==len(r['trials'])+1;tablechecks=0
 for i,q in enumerate(r['trials']):
  row=p.tables[0][i+1];assert len(row)==8 and row[0]==str(i+1)and row[-1]==q['note']
  for actual,key in zip(row[1:-1],['sampleMl','calciumMmolL','magnesiumMmolL','soapMolL','deliveredMl','agitationCycles']):near(actual,q[key],D('2e-18'));tablechecks+=1
 for table,fields in zip(p.tables[1:],tables):
  assert table[0]==['Trial','Sample']+[h for h,k in fields]
  assert len(table)==4*len(r['trials'])+1
  for i,q in enumerate(r['trials']):
   for j,id in enumerate(['control','calcium','magnesium','mixed']):
    row=table[1+4*i+j];assert len(row)==len(fields)+2 and row[:2]==[str(i+1),id]
    s=reference({k:v for k,v in q.items()if k!='note'},id)
    for actual,(_,key)in zip(row[2:],fields):near(actual,s[key],D('2e-18')if key.endswith('Mol')else D('2e-11'));tablechecks+=1
 assert len(p.blocks)==152*len(r['trials']);seen=set();operands=0
 for b in p.blocks:
  trial=b['trial'];id,key=b['key'].split('.');assert (trial,id,key)not in seen;seen.add((trial,id,key))
  assert id in['control','calcium','magnesium','mixed'];q={k:v for k,v in r['trials'][trial].items()if k!='note'};s=reference(q,id);expected=expressions(q,id,s);assert key in expected
  value=re.fullmatch('('+NUM+') (.+)',b['result']);assert value and value[2]==unit(key),(key,b['result'])
  near(value[1],s[key],D('2e-18')if key.endswith('Mol')else D('2e-11'))
  actual=b['substitution'].replace('×','*').replace('−','-');want=expected[key]
  assert signature(ast.parse(actual,mode='eval').body)==signature(ast.parse(want,mode='eval').body),(key,'operator mismatch')
  # Walk numeric AST leaves so a subtraction operator is not mistaken for
  # the sign of its right-hand operand by a plain number-token regex.
  leaves=lambda source:[ast.get_source_segment(source,n)for n in ast.walk(ast.parse(source,mode='eval'))if isinstance(n,ast.Constant)]
  av=leaves(actual);wv=leaves(want);assert len(av)==len(wv)
  for a,w in zip(av,wv):near(a,w,D('2e-18'));operands+=1
  near(evaluate_substitution(actual),D(value[1]),D('2e-18')if key.endswith('Mol')else D('2e-11'))
 return{'trials':len(r['trials']),'workedResults':len(p.blocks),'expressionChecks':len(p.blocks),'operandChecks':operands,'tableNumericChecks':tablechecks,'tables':4}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

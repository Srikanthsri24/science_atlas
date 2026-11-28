"""Independent exported HTML audit: values, operand identities, operations,
units, table headers, original inputs and explicit undefined ratios."""
import ast,json,re,sys,math
from pathlib import Path
from validate_soap_hardness_report import Report as BaseReport
from validate_water_impurities import reference,compare,D,IDS
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):
  super().handle_starttag(tag,[(k,'soap-hardness-record-inputs' if k=='id' and v=='water-impurities-record-inputs' else v) for k,v in attrs])
  if tag=='p' and self.block is not None and dict(attrs).get('class')=='formula':self.part='formula';self.block['formula']=''
EXPR={
'saltG':'cSalt*V/1000000*hasSalt','solidG':'cParticles*V/1000000*hasParticles','carrierG':'V*1-saltG','processedMl':'V*F',
'feedCarrierG':'carrierG*(1-F)','feedSaltG':'saltG*(1-F)','feedSolidG':'solidG*(1-F)','processedCarrierG':'carrierG*F','processedSaltG':'saltG*F','processedSolidG':'solidG*F',
'retainedSolidG':'processedSolidG*R','passedSolidG':'processedSolidG-retainedSolidG','cakeCarrierBeforeDryG':'processedCarrierG*H','cakeSaltBeforeRinseG':'processedSaltG*H','rinseCarrierG':'W*F',
'rinseRatio':'rinseCarrierG/cakeCarrierBeforeDryG','rinseRemainingFraction':'exp(0-rinseRatio)','rinseRemovedFraction':'-expm1(-rinseRatio)',
'cakeSaltG':'cakeSaltBeforeRinseG*rinseRemainingFraction','rinsedSaltG':'cakeSaltBeforeRinseG*rinseRemovedFraction','receiverSaltG':'processedSaltG*(1-H)+rinsedSaltG','receiverCarrierBeforeDryG':'processedCarrierG*(1-H)+rinseCarrierG',
'cakeCarrierG':'cakeCarrierBeforeDryG*(1-D)','receiverCarrierG':'receiverCarrierBeforeDryG*(1-D)','cakeVapourG':'cakeCarrierBeforeDryG*D','receiverVapourG':'receiverCarrierBeforeDryG*D','vapourG':'cakeVapourG+receiverVapourG',
'cakeDryMaterialG':'retainedSolidG+cakeSaltG','receiverDryMaterialG':'receiverSaltG+passedSolidG','filterGrossG':'filterTare+cakeDryMaterialG+cakeCarrierG','dishGrossG':'dishTare+receiverDryMaterialG+receiverCarrierG','filterDryGrossG':'filterTare+cakeDryMaterialG','dishDryGrossG':'dishTare+receiverDryMaterialG',
'feedG':'feedCarrierG+feedSaltG+feedSolidG','cakeG':'cakeDryMaterialG+cakeCarrierG','receiverG':'receiverDryMaterialG+receiverCarrierG','initialG':'carrierG+saltG+solidG+rinseCarrierG','finalG':'feedG+cakeG+receiverG+vapourG',
'apparentRetainedMgL':'cakeDryMaterialG*1000000/processedMl','apparentPassedMgL':'receiverDryMaterialG*1000000/processedMl','saltCarryoverFraction':'cakeSaltG/processedSaltG','solidCaptureFraction':'retainedSolidG/processedSolidG',
'materialResidualG':'finalG-initialG','saltResidualG':'feedSaltG+cakeSaltG+receiverSaltG-saltG','solidResidualG':'feedSolidG+retainedSolidG+passedSolidG-solidG','carrierResidualG':'feedCarrierG+cakeCarrierG+receiverCarrierG+vapourG-carrierG-rinseCarrierG',
'filterTareDifferenceG':'filterDryGrossG-filterTare','dishTareDifferenceG':'dishDryGrossG-dishTare'}
QMAP={'V':'sampleMl','cSalt':'saltMgL','cParticles':'solidMgL','F':'filteredFraction','H':'holdUpFraction','R':'retention','W':'rinseMl','D':'dryFraction','filterTare':'filterTareG','dishTare':'dishTareG'}
QKEYS=list(QMAP.values())
HEADERS=[['Trial','Initial solution mL','Salt loading mg/L','Suspended loading mg/L','Processed fraction','Selected liquid hold-up fraction','Selected particle retention','Full-protocol rinse mL','Drying completion fraction','Dry filter tare g','Dish tare g','Student observation'],['Trial','Sample','Processed sample mL','Actual rinse carrier g','Cake carrier before drying g','Receiver carrier before drying g','Unprocessed feed g'],['Trial','Sample','Captured particles g','Passed particles g','Salt with dry filter g','Salt in dish g','Dry filter gross g','Dry dish gross g','Dry filter gain g','Dry dish residue g','Apparent retained residue mg/L original sample','Apparent passed residue mg/L original sample'],['Trial','Sample','Carrier vapour g','Initial material plus rinse g','Accounted material g','Total residual g','Salt residual g','Particle residual g','Carrier residual g']]
FIELDS=[['processedMl','rinseCarrierG','cakeCarrierBeforeDryG','receiverCarrierBeforeDryG','feedG'],['retainedSolidG','passedSolidG','cakeSaltG','receiverSaltG','filterDryGrossG','dishDryGrossG','cakeDryMaterialG','receiverDryMaterialG','apparentRetainedMgL','apparentPassedMgL'],['vapourG','initialG','finalG','materialResidualG','saltResidualG','solidResidualG','carrierResidualG']]
def shape(n):
 if isinstance(n,(ast.Name,ast.Constant)):return 'number'
 if isinstance(n,ast.BinOp):return(type(n.op).__name__,shape(n.left),shape(n.right))
 if isinstance(n,ast.UnaryOp):return(type(n.op).__name__,shape(n.operand))
 if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id in ['exp','expm1']and not n.keywords:return(n.func.id,tuple(shape(a)for a in n.args))
 raise AssertionError('Unsupported operation')
def leaves(n):return [a for a in ast.walk(n)if isinstance(a,ast.Constant)or isinstance(a,ast.Name)and a.id not in ['exp','expm1']]
def strict(a,b):assert abs(D(str(a))-D(str(b)))<=max(D('1e-300'),abs(D(str(b)))*D('2e-15')),(a,b)
def evaluate(source):
 def ev(n):
  if isinstance(n,ast.Constant)and type(n.value)in[int,float]:return D(ast.get_source_segment(source,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return -ev(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  if isinstance(n,ast.Call)and len(n.args)==1:
   x=ev(n.args[0]);assert n.func.id in ['exp','expm1'];return x.exp() if n.func.id=='exp' else x.exp()-1
  raise AssertionError('Unsupported arithmetic')
 return ev(ast.parse(source,mode='eval').body)
def unit(k):return 'mg/L' if k.endswith('MgL') else 'mL' if k=='processedMl' else 'ratio' if k=='rinseRatio' else 'fraction' if k.endswith('Fraction') else 'g'
def result_compare(value,want,key,q,s):
 if key.endswith('TareDifferenceG'):
  tare=q['filterTareG']if key.startswith('filter')else q['dishTareG'];assert abs(D(str(value))-want)<=D(str(tare))*D('5e-16')+abs(want)*D('4e-12'),(key,value,str(want))
 else:compare(float(value),want,key,q,s)
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert 0<=len(trials)<=40 and len(p.blocks)==192*len(trials)and len(p.tables)==4
 for t,h in zip(p.tables,HEADERS):assert t[0]==h
 assert len(p.tables[0])==1+len(trials);tablechecks=operandchecks=undefined=0;seen=set()
 for i,q in enumerate(trials):
  assert all(type(q[k])in[int,float]and math.isfinite(q[k])for k in QKEYS)
  bounds={'sampleMl':(25,200),'saltMgL':(0,2000),'solidMgL':(0,1000),'filteredFraction':(0,1),'holdUpFraction':(0,.2),'retention':(0,1),'rinseMl':(0,100),'dryFraction':(0,1),'filterTareG':(.5,5),'dishTareG':(10,100)}
  for k,(lo,hi)in bounds.items():assert lo<=q[k]<=hi and(q[k]==0 or q[k]>=1e-12)
  assert q['dryFraction']==1 and q['filteredFraction']>0
  row=p.tables[0][i+1];assert len(row)==12 and row[0]==str(i+1)and row[-1]==q['note']
  for value,key in zip(row[1:-1],QKEYS):strict(value,q[key]);tablechecks+=1
 for table,fields in zip(p.tables[1:],FIELDS):
  assert len(table)==1+4*len(trials)
  for i,q in enumerate(trials):
   for j,id in enumerate(IDS):
    s=reference({k:q[k]for k in QKEYS},id);row=table[1+4*i+j];assert len(row)==len(fields)+2 and row[:2]==[str(i+1),id]
    for v,k in zip(row[2:],fields):
     if s[k]is None:assert v=='Undefined'
     else:compare(float(v),s[k],k,q,s)
     tablechecks+=1
 for b in p.blocks:
  i=b['trial'];id,k=b['key'].split('.');assert (i,id,k)not in seen;seen.add((i,id,k));q=trials[i];s=reference({k:q[k]for k in QKEYS},id);e=EXPR[k]
  if k in ['rinseRatio','rinseRemainingFraction','rinseRemovedFraction']and not s['rinseApplicable']:e='1'if k=='rinseRemainingFraction'else'0'
  if k.endswith('TareDifferenceG'):assert b['formula']=='dry gross - dry tare'
  elif k in ['rinseRatio','rinseRemainingFraction','rinseRemovedFraction']and not s['rinseApplicable']:assert b['formula']=='No pore-carrier rinse calculation applies'
  else:assert ast.dump(ast.parse(b['formula'],mode='eval'))==ast.dump(ast.parse(EXPR[k],mode='eval')),(k,'symbolic formula mismatch')
  actual=b['substitution'];a=ast.parse(actual,mode='eval').body;expected=ast.parse(e,mode='eval').body;assert shape(a)==shape(expected),(k,'operator mismatch')
  av,ev=leaves(a),leaves(expected);assert len(av)==len(ev)
  for x,y in zip(av,ev):
   assert isinstance(x,ast.Constant)and type(x.value)in[int,float];v=ast.get_source_segment(actual,x)
   if isinstance(y,ast.Constant):strict(v,ast.get_source_segment(e,y))
   elif y.id in QMAP:strict(v,q[QMAP[y.id]])
   elif y.id in ['hasSalt','hasParticles']:strict(v,int(id in(['salt','mixture']if y.id=='hasSalt'else['suspension','mixture'])))
   else:compare(float(v),s[y.id],y.id,q,s)
   operandchecks+=1
  want=s.get(k)
  if k.endswith('TareDifferenceG'):want=s['cakeDryMaterialG']if k.startswith('filter')else s['receiverDryMaterialG']
  if want is None:assert b['result'].startswith('Undefined');undefined+=1;continue
  match=re.fullmatch(r'([-+0-9.eE]+) (.+)',b['result']);assert match and match[2]==unit(k),(k,b['result']);result_compare(match[1],want,k,q,s)
  calculated=evaluate(actual);result_compare(match[1],calculated,k,q,s)
 return dict(trials=len(trials),workedResults=len(p.blocks),undefinedResults=undefined,operandChecks=operandchecks,tableFieldChecks=tablechecks)
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

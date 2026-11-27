"""Independent CL-0102 HTML validation of five tables,46results and every numeric operand."""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
from salt_precipitation_reference import solve
D=lambda x:Decimal(str(x))
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
class Report(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.rows=[];self.cell='';self.incell=False;self.intable=False;self.inputs='';self.inscript=False;self.blocks=[];self.block=None;self.field=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([]);self.intable=True
  if tag=='tr':self.rows=[]
  if tag in ('td','th'):self.incell=True;self.cell=''
  if tag=='section'and a.get('class')=='worked':self.block={'key':a.get('data-key')}
  if self.block is not None and tag=='p'and a.get('class')in['substitution','result']:self.field=a['class'];self.block[self.field]=''
  if tag=='script'and a.get('id')=='salt-precipitation-record-inputs':self.inscript=True
 def handle_data(self,data):
  if self.incell:self.cell+=data
  if self.inscript:self.inputs+=data
  if self.field:self.block[self.field]+=data
 def handle_endtag(self,tag):
  if tag in ('td','th'):self.rows.append(self.cell.strip());self.incell=False
  if tag=='tr'and self.intable:self.tables[-1].append(self.rows)
  if tag=='table':self.intable=False
  if tag=='script':self.inscript=False
  if tag=='p':self.field=None
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None
STOCKS=['silverInitialMol','chlorideInitialMol','silverDeliveredMl','chlorideDeliveredMl','silverDeliveredMol','chlorideDeliveredMol','silverStockRemainingMl','chlorideStockRemainingMl','silverStockRemainingMol','chlorideStockRemainingMol','silverInitialWaterG','chlorideInitialWaterG','silverStockWaterG','chlorideStockWaterG']
RECEIVER=['nominalMixtureMl','analyticalSilverMolL','analyticalChlorideMolL','initialIonProduct','precipitateMol','precipitateG','solidMl','aqueousMl','receiverWaterG','receiverIonsG','receiverLiquidG']
IONS=['freeSilverMol','freeChlorideMol','freeSilverMolL','freeChlorideMolL','nitrateMol','sodiumMol','nitrateMolL','sodiumMolL','finalIonProduct']
CLOSURE=['initialContentsG','finalContentsG','massResidualG','silverResidualMol','chlorideResidualMol','sodiumResidualMol','nitrateResidualMol','chargeResidualMol','volumeResidualMl']
def operands(q,s):
 w,va,vb,ca,cb,fa,fb=map(D,[q[k]for k in['receiverMl','silverStockMl','chlorideStockMl','silverMolL','chlorideMolL','silverFraction','chlorideFraction']]);minor=min(s['freeSilverMol'],s['freeChlorideMol']);small=min(s['silverDeliveredMol'],s['chlorideDeliveredMol']);diff=abs(s['silverDeliveredMol']-s['chlorideDeliveredMol']);beta=D('143.318')/D('5.56')/1000
 return{
 'silverInitialMol':[ca,va,1000],'chlorideInitialMol':[cb,vb,1000],'silverInitialWaterG':[1,va,s['silverInitialMol'],D('169.872')],'chlorideInitialWaterG':[1,vb,s['chlorideInitialMol'],D('58.440')],
 'silverDeliveredMl':[va,fa],'chlorideDeliveredMl':[vb,fb],'silverDeliveredMol':[s['silverInitialMol'],fa],'chlorideDeliveredMol':[s['chlorideInitialMol'],fb],
 'silverStockRemainingMl':[va,s['silverDeliveredMl']],'chlorideStockRemainingMl':[vb,s['chlorideDeliveredMl']],'silverStockRemainingMol':[s['silverInitialMol'],s['silverDeliveredMol']],'chlorideStockRemainingMol':[s['chlorideInitialMol'],s['chlorideDeliveredMol']],
 'silverStockWaterG':[s['silverInitialWaterG'],1,fa],'chlorideStockWaterG':[s['chlorideInitialWaterG'],1,fb],
 'nominalMixtureMl':[w,s['silverDeliveredMl'],s['chlorideDeliveredMl']],'nominalMixtureL':[s['nominalMixtureMl'],1000],'analyticalSilverMolL':[s['silverDeliveredMol'],s['nominalMixtureL']],'analyticalChlorideMolL':[s['chlorideDeliveredMol'],s['nominalMixtureL']],'initialIonProduct':[s['analyticalSilverMolL'],s['analyticalChlorideMolL']],
 'freeMinorMol':[minor,minor,diff,minor,s['nominalMixtureL'],beta,small,minor,s['finalIonProduct'],D('1.8e-10')]if s['precipitateMol']>0 else[s['silverDeliveredMol'],s['chlorideDeliveredMol'],s['initialIonProduct'],D('1.8e-10')],
 'precipitateMol':[small,minor],'precipitateG':[s['precipitateMol'],D('143.318')],'solidMl':[s['precipitateG'],D('5.56')],'aqueousMl':[s['nominalMixtureMl'],s['solidMl']],'aqueousL':[s['aqueousMl'],1000],
 'freeSilverMol':[s['silverDeliveredMol'],s['precipitateMol']],'freeChlorideMol':[s['chlorideDeliveredMol'],s['precipitateMol']],'freeSilverMolL':[s['freeSilverMol'],s['aqueousL']],'freeChlorideMolL':[s['freeChlorideMol'],s['aqueousL']],
 'nitrateMol':[s['silverDeliveredMol']],'sodiumMol':[s['chlorideDeliveredMol']],'nitrateMolL':[s['nitrateMol'],s['aqueousL']],'sodiumMolL':[s['sodiumMol'],s['aqueousL']],'finalIonProduct':[s['freeSilverMolL'],s['freeChlorideMolL']],
 'receiverWaterG':[1,w,s['silverInitialWaterG'],fa,s['chlorideInitialWaterG'],fb],
 'receiverIonsG':[s['freeSilverMol'],D('107.868'),s['freeChlorideMol'],D('35.450'),s['nitrateMol'],D('62.004'),s['sodiumMol'],D('22.990')],
 'receiverLiquidG':[s['receiverWaterG'],s['receiverIonsG']],'initialContentsG':[1,w,va,vb],'finalContentsG':[1,s['silverStockRemainingMl'],s['chlorideStockRemainingMl'],s['receiverLiquidG'],s['precipitateG']],'massResidualG':[s['initialContentsG'],s['finalContentsG']],
 'silverResidualMol':[s['silverInitialMol'],s['silverStockRemainingMol'],s['freeSilverMol'],s['precipitateMol']],'chlorideResidualMol':[s['chlorideInitialMol'],s['chlorideStockRemainingMol'],s['freeChlorideMol'],s['precipitateMol']],'sodiumResidualMol':[s['chlorideInitialMol'],s['chlorideStockRemainingMol'],s['sodiumMol']],'nitrateResidualMol':[s['silverInitialMol'],s['silverStockRemainingMol'],s['nitrateMol']],
 'chargeResidualMol':[s['freeSilverMol'],s['sodiumMol'],s['freeChlorideMol'],s['nitrateMol']],'volumeResidualMl':[w,va,vb,s['silverStockRemainingMl'],s['chlorideStockRemainingMl'],s['aqueousMl'],s['solidMl']]}
def validate(path):
 p=Report();p.feed(open(path).read());raw=json.loads(p.inputs);trials=raw['trials'];checks=0;current=None
 def near(actual,want,key):
  nonlocal checks
  checks+=1;want=D(want)
  floor=D('1e-24')
  if 'Residual' in key:floor=D('2e-12') if 'G' in key or 'Ml' in key else D('1e-16')
  tolerance=max(floor,abs(want)*D('3e-11'))
  if current and abs(current['initialIonProduct']-D('1.8e-10'))<D('1e-16') and current['precipitateMol']>0:
   for phaseKey in ['precipitateMol','precipitateG','solidMl']:
    if want==current[phaseKey]:
     scale=max(D(1),abs(want/current['precipitateMol']))
     tolerance=max(tolerance,max(current['silverInitialMol'],current['chlorideInitialMol'])*D('1e-13')*scale)
  if abs(D(actual)-want)>tolerance:raise AssertionError(f'{key}: {actual} != {want}')
 assert len(p.tables)==5 and[len(t[0])for t in p.tables]==[9,15,14,10,10]
 assert all(len(t)==len(trials)+1 for t in p.tables);assert len(p.blocks)==46*len(trials)
 with localcontext()as ctx:
  ctx.prec=60
  for i,q in enumerate(trials):
   s=solve(q);current=s;s['freeMinorMol']=min(s['freeSilverMol'],s['freeChlorideMol']);ops=operands(q,s);blocks=p.blocks[i*46:(i+1)*46];assert len({b['key']for b in blocks})==46 and set(b['key']for b in blocks)==set(ops)
   for b in blocks:
    key=b['key'];near(re.match(NUM,b['result'])[0],s[key],key);numbers=re.findall(NUM,b['substitution']);assert len(numbers)==len(ops[key]),(key,numbers,ops[key])
    for actual,want in zip(numbers,ops[key]):near(actual,want,key+'operand')
   prep=p.tables[0][i+1];assert len(prep)==9 and prep[0]==str(i+1)and prep[-1]==q['note']
   for actual,key in zip(prep[1:-1],['receiverMl','silverStockMl','chlorideStockMl','silverMolL','chlorideMolL','silverFraction','chlorideFraction']):near(actual,q[key],key)
   for table,keys,extras in zip(p.tables[1:],[STOCKS,RECEIVER,IONS,CLOSURE],[0,2,0,0]):
    row=table[i+1];assert len(row)==1+len(keys)+extras and row[0]==str(i+1)
    for actual,key in zip(row[1:],keys):near(actual,s[key],key)
   category='solid-equilibrium'if s['precipitateMol']>0 else'water-only'if s['silverDeliveredMol']==0 and s['chlorideDeliveredMol']==0 else'one-ion-missing'if s['silverDeliveredMol']==0 or s['chlorideDeliveredMol']==0 else'no-solid'
   a,b=s['silverDeliveredMol'],s['chlorideDeliveredMol'];limit='neither-ion-delivered'if a==b==0 else'matched'if abs(a-b)<=max(a,b)*D('1e-13')else'silver-limited'if a<b else'chloride-limited';assert p.tables[2][i+1][-2:]==[category,limit]
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

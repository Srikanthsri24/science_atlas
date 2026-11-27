"""Independent CL-0100 HTML checker: tables,43results and every numeric substitution operand."""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
from oxide_water_reference import solve
D=lambda n:Decimal(str(n))
class Report(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.rows=[];self.cell='';self.incell=False;self.intable=False;self.inputs='';self.inscript=False;self.blocks=[];self.block=None;self.field=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([]);self.intable=True
  if tag=='tr':self.rows=[]
  if tag in ('td','th'):self.incell=True;self.cell=''
  if tag=='section' and a.get('class')=='worked':self.block={}
  if self.block is not None and tag=='p' and a.get('class') in ['substitution','result']:self.field=a['class'];self.block[self.field]=''
  if tag=='script' and a.get('id')=='oxide-water-record-inputs':self.inscript=True
 def handle_data(self,data):
  if self.incell:self.cell+=data
  if self.inscript:self.inputs+=data
  if self.field:self.block[self.field]+=data
 def handle_endtag(self,tag):
  if tag in ('td','th'):self.rows.append(self.cell.strip());self.incell=False
  if tag=='tr' and self.intable:self.tables[-1].append(self.rows)
  if tag=='table':self.intable=False
  if tag=='script':self.inscript=False
  if tag=='p':self.field=None
  if tag=='section' and self.block is not None:self.blocks.append(self.block);self.block=None
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
def expected(q):
 s=solve(q);w,head,gas,oxide,gf,of,hf=map(D,[q[k] for k in ['waterMl','headspaceMl','gasStockMl','oxideG','gasFraction','oxideFraction','hydrationFraction']]);vl=w/1000;vg=head/1000;r=D('.08205736608096');t=D('298.15');rt=r*t;kw=D('1e-14');k1=D('4.45e-7');k2=D('4.68e-11');kh=D('.03406');h=s['acid.hMolL'];ca=s['baseCaMolL'];sat=s['saturationCaMolL'];ohsat=sat+(sat*sat+kw).sqrt();s['baseCalciumResidualMol']=D(0);s['controlPH']=D(7)
 keys=['gasInitialMol','gasDeliveredMol','gasStoredMol','gasStoredMl','acid.hMolL','acid.pressureAtm','acid.co2StarMolL','acid.bicarbonateMolL','acid.carbonateMolL','acid.ohMolL','acidPH','acidAqueousCarbonMol','acidGasCarbonMol','acidCarbonResidualMol','acidLiquidG','oxideInitialMol','oxideDeliveredMol','oxidePanG','hydratedMol','oxideUnreactedMol','waterConsumedG','baseWaterG','saturationCaMolL','dissolvedCaMol','solidHydroxideMol','baseCaMolL','baseOHMolL','baseHMolL','basePH','baseIonProduct','baseChargeResidualMolL','baseLiquidG','oxideSolidG','hydroxideSolidG','baseSolidMl','baseDisplacedMl','initialTrackedG','finalTrackedG','massResidualG','baseCalciumResidualMol','controlPH']
 values=[vl,vg]+[s[k] for k in keys]
 subs=[[w,1000],[head,1000],[1,gas,1000,r,t],[s['gasInitialMol'],gf],[s['gasInitialMol'],s['gasDeliveredMol']],[s['gasStoredMol'],r,t,1,1000],
 [h,h,kw,h,s['acid.bicarbonateMolL'],2,s['acid.carbonateMolL'],s['acid.chargeResidualMolL'],D('1e-7'),D('.1')],
 [s['gasDeliveredMol'],vg,rt,kh,vl,1,k1/h,k1*k2/h**2],[kh,s['acid.pressureAtm']],[k1,s['acid.co2StarMolL'],h],[k1,k2,s['acid.co2StarMolL'],h],[kw,h],[h,1],
 [vl,s['acid.co2StarMolL'],s['acid.bicarbonateMolL'],s['acid.carbonateMolL']],[s['acid.pressureAtm'],vg,rt],[s['gasDeliveredMol'],s['acidAqueousCarbonMol'],s['acidGasCarbonMol']],[w,s['acidAqueousCarbonMol'],D('44.009')],
 [oxide,D('56.077')],[s['oxideInitialMol'],of],[oxide,1,of],[s['oxideInitialMol'],hf],[s['oxideDeliveredMol'],s['hydratedMol']],[s['hydratedMol'],D('18.015')],[w,s['waterConsumedG']],
 [sat,sat,sat,kw,sat*ohsat**2,D('5.02e-6')],[s['hydratedMol'],sat,vl],[s['hydratedMol'],s['dissolvedCaMol']],[s['dissolvedCaMol'],vl],[ca,ca,kw],[kw,s['baseOHMolL']],[s['baseHMolL'],1],[ca,s['baseOHMolL']],[2,ca,s['baseHMolL'],s['baseOHMolL']],
 [s['baseWaterG'],s['dissolvedCaMol'],D('74.092')],[s['oxideUnreactedMol'],D('56.077')],[s['solidHydroxideMol'],D('74.092')],[s['oxideSolidG'],D('3.34'),s['hydroxideSolidG'],D('2.24')],[w,s['baseSolidMl']],
 [3,w,oxide,s['gasInitialMol'],D('44.009')],[w,s['acidLiquidG'],s['gasStoredMol'],s['acidGasCarbonMol'],D('44.009'),s['oxidePanG'],s['baseLiquidG'],s['oxideSolidG'],s['hydroxideSolidG']],[s['initialTrackedG'],s['finalTrackedG']],[s['oxideInitialMol'],s['oxidePanG'],D('56.077'),s['oxideUnreactedMol'],s['dissolvedCaMol'],s['solidHydroxideMol']],[kw,1]]
 assert len(values)==len(subs)==43
 return s,values,subs
ACID=['gasInitialMol','gasDeliveredMol','gasStoredMol','gasStoredMl','acid.pressureAtm','acid.co2StarMolL','acid.bicarbonateMolL','acid.carbonateMolL','acid.hMolL','acid.ohMolL','acidPH','acidAqueousCarbonMol','acidGasCarbonMol','acidCarbonResidualMol','acidLiquidG','acid.chargeResidualMolL']
BASE=['oxideInitialMol','oxideDeliveredMol','hydratedMol','oxidePanG','oxideUnreactedMol','waterConsumedG','baseWaterG','saturationCaMolL','dissolvedCaMol','solidHydroxideMol','baseCaMolL','baseOHMolL','baseHMolL','basePH','baseIonProduct','baseChargeResidualMolL','baseLiquidG','oxideSolidG','hydroxideSolidG','baseSolidMl','baseDisplacedMl']
CLOSURE=['controlPH','initialTrackedG','finalTrackedG','massResidualG','baseCalciumResidualMol']
def validate(path):
 p=Report();p.feed(open(path).read());raw=json.loads(p.inputs);checks=0
 def near(actual,want):
  nonlocal checks
  checks+=1;want=D(want)
  if abs(D(actual)-want)>max(D('2e-12') if abs(want)<D('1e-11') else D('1e-24'),abs(want)*D('3e-11')):raise AssertionError(f'{actual} != {want}')
 assert len(p.tables)==4
 assert len(p.blocks)==43*len(raw['trials'])
 with localcontext() as ctx:
  ctx.prec=55
  for i,q in enumerate(raw['trials']):
   s,values,subs=expected(q)
   prep=p.tables[0][i+1];assert len(prep)==9 and prep[0]==str(i+1) and prep[-1]==q['note']
   for val,key in zip(prep[1:-1],['waterMl','headspaceMl','gasStockMl','oxideG','gasFraction','oxideFraction','hydrationFraction']):near(val,q[key])
   for j,(want,operands) in enumerate(zip(values,subs)):
    block=p.blocks[i*43+j];near(re.match(NUM,block['result'])[0],want)
    actual=re.findall(NUM,block['substitution']);assert len(actual)==len(operands),(i,j,actual,operands)
    for a,b in zip(actual,operands):near(a,b)
   for table,keys in zip(p.tables[1:],[ACID,BASE,CLOSURE]):
    row=table[i+1];assert row[0]==str(i+1);assert len(row)==1+len(keys)+(0 if keys is CLOSURE else 1)
    for val,key in zip(row[1:],keys):near(val,s[key])
   acidCategory='water-control' if s['gasDeliveredMol']==0 else 'acidic'
   baseCategory='no-hydroxide-yet' if s['hydratedMol']==0 else 'basic-saturated-with-solid' if s['solidHydroxideMol']>D('1e-15') else 'basic-unsaturated'
   assert p.tables[1][i+1][-1]==acidCategory and p.tables[2][i+1][-1]==baseCategory
 return {'trials':len(raw['trials']),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

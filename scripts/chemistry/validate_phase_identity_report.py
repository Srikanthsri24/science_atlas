"""Independent Decimal audit of CL-0105 exported practical tables and worked values."""
import json,re,sys
from html.parser import HTMLParser
from phase_identity_reference import solve,D
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
class Report(HTMLParser):
 def __init__(self):
  super().__init__();self.tables=[];self.row=[];self.cell=None;self.inputs='';self.inscript=False;self.blocks=[];self.block=None;self.field=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([])
  if tag=='tr':self.row=[]
  if tag in['td','th']:self.cell=''
  if tag=='section'and a.get('class')=='worked':self.block={'key':a.get('data-key')}
  if self.block is not None and tag=='p'and a.get('class')in['substitution','result']:self.field=a['class'];self.block[self.field]=''
  if tag=='script'and a.get('id')=='phase-identity-record-inputs':self.inscript=True
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.inscript:self.inputs+=data
  if self.field:self.block[self.field]+=data
 def handle_endtag(self,tag):
  if tag in['td','th']:self.row.append(self.cell.strip());self.cell=None
  if tag=='tr':self.tables[-1].append(self.row)
  if tag=='script':self.inscript=False
  if tag=='p':self.field=None
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None
TABLES=[
 ['maximumFusionJ','phaseEnergyJ','meltedIceG','iceG','liquidG','remainingFusionJ','returnPhaseHeatJ','phaseAtInitialPartition'],
 ['iceMl','liquidMl','submergedIceMl','iceAboveWaterMl','liquidEnvelopeMl','phaseMaterialMl','iceEdgeCm','iceDraftCm','iceFreeboardCm','iceWeightN','buoyancyN','buoyancyResidualN'],
 ['iceWaterMol','liquidWaterMol','totalWaterMol','waterMoleResidual','phaseInitialMassG','phaseFinalMassG','phaseMassResidualG'],
 ['magnesiumInitialMol','magnesiumDeliveredG','magnesiumStockG','magnesiumDeliveredMol','extentMol','reactedMagnesiumMol','reactedMagnesiumG','unreactedMagnesiumG','unreactedMagnesiumMol','magnesiumStockMol','oxideMol','oxideG'],
 ['oxygenConsumedMol','oxygenRemainingMol','oxygenInitialG','oxygenConsumedG','oxygenRemainingG','newSubstanceFormed','reactionRegime'],
 ['magnesiumStockMl','unreactedMagnesiumMl','oxideMl','reactorSolidMl','reactorGasMl','initialOxygenKpa','oxygenKpa'],
 ['reactorContentsG','chemicalInitialMassG','chemicalFinalMassG','chemicalMassResidualG','magnesiumAtomResidualMol','oxygenAtomResidualMol','initialWholeMassG','finalWholeMassG','wholeMassResidualG']]
def operands(q,s):
 ice,bath,mg,o2,phi,feed=[D(q[k])for k in['initialIceG','bathWaterG','magnesiumG','oxygenMol','phaseHeatFraction','magnesiumFeedFraction']]
 op={'maximumFusionJ':[ice,334],'phaseEnergyJ':[s['maximumFusionJ'],phi],'meltedIceG':[ice,phi],'iceG':[ice,1,phi],'liquidG':[bath,s['meltedIceG']],'remainingFusionJ':[s['iceG'],334],'returnPhaseHeatJ':[s['phaseEnergyJ']],
 'phaseInitialMassG':[bath,ice],'phaseFinalMassG':[s['liquidG'],s['iceG']],'phaseMassResidualG':[s['phaseInitialMassG'],s['phaseFinalMassG']],
 'iceMl':[s['iceG'],D('.917')],'liquidMl':[s['liquidG'],1],'submergedIceMl':[s['iceG'],1],'iceAboveWaterMl':[s['iceMl'],s['submergedIceMl']],'liquidEnvelopeMl':[s['liquidMl'],s['submergedIceMl']],'phaseMaterialMl':[s['liquidMl'],s['iceMl']],'iceEdgeCm':[s['iceMl']],'iceDraftCm':[s['submergedIceMl'],s['iceEdgeCm']]if s['iceEdgeCm']else[0],'iceFreeboardCm':[s['iceEdgeCm'],s['iceDraftCm']],'iceWeightN':[s['iceG'],1000,D('9.81')],'buoyancyN':[s['submergedIceMl'],1,1000,D('9.81')],'buoyancyResidualN':[s['iceWeightN'],s['buoyancyN']],
 'iceWaterMol':[s['iceG'],D('18.015')],'liquidWaterMol':[s['liquidG'],D('18.015')],'totalWaterMol':[s['iceWaterMol'],s['liquidWaterMol']],'waterMoleResidual':[s['phaseInitialMassG'],D('18.015'),s['totalWaterMol']],
 'magnesiumInitialMol':[mg,D('24.305')],'magnesiumDeliveredG':[mg,feed],'magnesiumStockG':[mg,1,feed],'magnesiumDeliveredMol':[s['magnesiumDeliveredG'],D('24.305')],'extentMol':[s['magnesiumDeliveredMol'],2,o2],'reactedMagnesiumMol':[2,s['extentMol']],'reactedMagnesiumG':[s['reactedMagnesiumMol'],D('24.305')],'unreactedMagnesiumG':[0,s['magnesiumDeliveredG'],s['reactedMagnesiumG']],'unreactedMagnesiumMol':[s['unreactedMagnesiumG'],D('24.305')],'magnesiumStockMol':[s['magnesiumStockG'],D('24.305')],
 'oxygenConsumedMol':[s['extentMol']],'oxygenRemainingMol':[0,o2,s['extentMol']],'oxygenInitialG':[o2,D('31.998')],'oxygenConsumedG':[s['oxygenConsumedMol'],D('31.998')],'oxygenRemainingG':[s['oxygenRemainingMol'],D('31.998')],'oxideMol':[2,s['extentMol']],'oxideG':[s['reactedMagnesiumG'],s['oxygenConsumedG']],
 'magnesiumStockMl':[s['magnesiumStockG'],D('1.74')],'unreactedMagnesiumMl':[s['unreactedMagnesiumG'],D('1.74')],'oxideMl':[s['oxideG'],D('3.58')],'reactorSolidMl':[s['unreactedMagnesiumMl'],s['oxideMl']],'reactorGasMl':[100,s['reactorSolidMl']],'initialOxygenKpa':[o2,D('8.314'),D('298.15'),100,1000],'oxygenKpa':[s['oxygenRemainingMol'],D('8.314'),D('298.15'),s['reactorGasMl'],1000],
 'reactorContentsG':[s['unreactedMagnesiumG'],s['oxideG'],s['oxygenRemainingG']],'chemicalInitialMassG':[mg,s['oxygenInitialG']],'chemicalFinalMassG':[s['magnesiumStockG'],s['reactorContentsG']],'chemicalMassResidualG':[s['chemicalInitialMassG'],s['chemicalFinalMassG']],'magnesiumAtomResidualMol':[s['magnesiumInitialMol'],s['magnesiumStockMol'],s['unreactedMagnesiumMol'],s['oxideMol']],'oxygenAtomResidualMol':[2,o2,2,s['oxygenRemainingMol'],s['oxideMol']],
 'initialWholeMassG':[s['phaseInitialMassG'],s['chemicalInitialMassG']],'finalWholeMassG':[s['phaseFinalMassG'],s['chemicalFinalMassG']],'wholeMassResidualG':[s['initialWholeMassG'],s['finalWholeMassG']]}
 return op

def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.inputs);trials=r['trials'];assert len(p.tables)==8;assert len(p.blocks)==59*len(trials);checks=0
 for j,table in enumerate(p.tables):assert len(table)==len(trials)+1,(j,len(table))
 for i,q in enumerate(trials):
  s=solve(q);mgfloor=D('1.8e-15')*D(q['magnesiumG']);ofloor=D('1.8e-15')*max(D(q['oxygenMol']),D(q['magnesiumG'])/D('24.305')/2)
  floors={'unreactedMagnesiumG':mgfloor,'unreactedMagnesiumMol':mgfloor/D('24.305'),'unreactedMagnesiumMl':mgfloor/D('1.74'),'oxygenRemainingMol':ofloor,'oxygenRemainingG':ofloor*D('31.998'),'oxygenKpa':ofloor*D('8.314')*D('298.15')/(D('99')/1000)}
  # Operand roundoff near exhaustion uses the largest stock-scale bound only for the named residual operands.
  operandfloors={'unreactedMagnesiumMol':mgfloor,'unreactedMagnesiumMl':mgfloor,'reactorSolidMl':mgfloor,'reactorContentsG':max(mgfloor,ofloor*32),'chemicalFinalMassG':max(mgfloor,ofloor*32),'oxygenRemainingG':ofloor,'oxygenKpa':ofloor,'magnesiumAtomResidualMol':mgfloor,'oxygenAtomResidualMol':ofloor}
  def near(actual,want,key,operand=False):
   nonlocal checks
   checks+=1;assert re.fullmatch(NUM,str(actual)),(key,actual)
   floor=D('3e-12')if key in['phaseMassResidualG','chemicalMassResidualG','wholeMassResidualG']else D('2e-14')if key in['waterMoleResidual','buoyancyResidualN']else D('1e-16')if key in['magnesiumAtomResidualMol','oxygenAtomResidualMol']else floors.get(key,D('1e-30'))
   if operand:floor=max(floor,operandfloors.get(key,D('1e-30')))
   assert abs(D(actual)-D(want))<=max(floor,abs(D(want))*D('3e-11')),(i,key,actual,str(want))
  prep=p.tables[0][i+1];assert len(prep)==8 and prep[0]==str(i+1)and prep[-1]==q['note']
  for actual,key in zip(prep[1:-1],['bathWaterG','initialIceG','magnesiumG','oxygenMol','phaseHeatFraction','magnesiumFeedFraction']):near(actual,D(q[key]),key)
  for table,keys in zip(p.tables[1:],TABLES):
   row=table[i+1];assert len(row)==len(keys)+1 and row[0]==str(i+1)
   for actual,key in zip(row[1:],keys):
    if isinstance(s[key],bool):assert actual==str(s[key]).lower(),(key,actual)
    elif isinstance(s[key],str):assert actual==s[key]
    else:near(actual,s[key],key)
  blocks=p.blocks[59*i:59*(i+1)];expectedkeys={key for key,value in s.items()if not isinstance(value,(str,bool))};assert {b['key']for b in blocks}==expectedkeys
  op=operands(q,s);assert set(op)==expectedkeys
  for b in blocks:
   key=b['key'];result=re.match(NUM,b['result']);assert result;near(result[0],s[key],key)
   numbers=re.findall(NUM,b['substitution']);assert len(numbers)==len(op[key]),(key,numbers,op[key])
   for actual,want in zip(numbers,op[key]):near(actual,want,key,True)
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

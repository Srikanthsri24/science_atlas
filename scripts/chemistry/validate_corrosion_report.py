"""Independent CL-0106 HTML tables, units, computed results and numeric operands."""
import json,re,sys
from html.parser import HTMLParser
from corrosion_conditions_reference import solve,D,PI
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
IDS=['wet-air','oxygen-excluded','dry-air']
TITLES=['Wet + accessible oxygen','Water + ideal oxygen exclusion','Dry + accessible oxygen']
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
  if tag=='script'and a.get('id')=='corrosion-record-inputs':self.inscript=True
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
TABLES=[['initialWaterG','initialOxygenMol','conditionsPresent','newProductCalculated','condition'],['initialIronMol','initialWaterMol','chosenProgressFraction','targetIronMol','oxygenIronLimitMol','waterIronLimitMol','convertedIronMol','convertedFraction'],['convertedIronG','remainingIronG','remainingIronMol','initialIronMl','remainingIronMl','shaftRadiusCm','remainingRadiusCm'],['oxygenConsumedMol','oxygenRemainingMol','oxygenInitialG','oxygenConsumedG','oxygenRemainingG'],['oxideReferenceMol','hydrationWaterMol','hydrationWaterG','remainingWaterG','remainingWaterMol','dryOxideReferenceG','productReferenceG','referenceFormulaGmol','retainedSpecimenG','specimenMassGainG'],['initialAccountG','finalAccountG','massResidualG','ironAtomResidualMol','oxygenAtomResidualMol','hydrogenAtomResidualMol']]
UNITS={'initialWaterG':'g','initialOxygenMol':'mol','initialIronMol':'mol','initialWaterMol':'mol','chosenProgressFraction':'fraction','targetIronMol':'mol','oxygenIronLimitMol':'mol Fe','waterIronLimitMol':'mol Fe','convertedIronMol':'mol Fe','oxideReferenceMol':'mol formula equivalents','convertedIronG':'g','remainingIronG':'g','remainingIronMol':'mol','oxygenConsumedMol':'mol O\u2082','oxygenRemainingMol':'mol O\u2082','oxygenInitialG':'g','oxygenConsumedG':'g','oxygenRemainingG':'g','hydrationWaterMol':'mol H\u2082O','hydrationWaterG':'g','remainingWaterG':'g','remainingWaterMol':'mol','dryOxideReferenceG':'g','productReferenceG':'g','referenceFormulaGmol':'g/mol','retainedSpecimenG':'g','specimenMassGainG':'g','initialAccountG':'g','finalAccountG':'g','massResidualG':'g','ironAtomResidualMol':'mol atoms','oxygenAtomResidualMol':'mol atoms','hydrogenAtomResidualMol':'mol atoms','convertedFraction':'fraction','initialIronMl':'mL','remainingIronMl':'mL','shaftRadiusCm':'cm','remainingRadiusCm':'cm'}
def operands(q,s):
 Fe,rate,days,x,L=[D(q[k])for k in['ironG','chosenRatePerDay','elapsedDays','hydrationNumber','nailLengthCm']]
 return {'initialWaterG':[s['initialWaterG']],'initialOxygenMol':[s['initialOxygenMol']],'initialIronMol':[Fe,D('55.845')],'initialWaterMol':[s['initialWaterG'],D('18.015')],'chosenProgressFraction':[1,rate,days],'targetIronMol':[s['initialIronMol'],s['chosenProgressFraction']],'oxygenIronLimitMol':[4,s['initialOxygenMol'],3],'waterIronLimitMol':[2,s['initialWaterMol'],x]if x else[],
 'convertedIronMol':([s['targetIronMol'],s['oxygenIronLimitMol']]+([s['waterIronLimitMol']]if x else[]))if s['conditionsPresent']else[0],'oxideReferenceMol':[s['convertedIronMol'],2],'convertedIronG':[s['convertedIronMol'],D('55.845')],'remainingIronG':[Fe,s['convertedIronG']],'remainingIronMol':[s['remainingIronG'],D('55.845')],
 'oxygenConsumedMol':[3,s['convertedIronMol'],4],'oxygenRemainingMol':[0,s['initialOxygenMol'],s['oxygenConsumedMol']],'oxygenInitialG':[s['initialOxygenMol'],D('31.998')],'oxygenConsumedG':[s['oxygenConsumedMol'],D('31.998')],'oxygenRemainingG':[s['oxygenRemainingMol'],D('31.998')],'hydrationWaterMol':[x,s['oxideReferenceMol']],'hydrationWaterG':[s['hydrationWaterMol'],D('18.015')],'remainingWaterG':[0,s['initialWaterG'],s['hydrationWaterG']],'remainingWaterMol':[s['remainingWaterG'],D('18.015')],
 'dryOxideReferenceG':[s['convertedIronG'],s['oxygenConsumedG']],'productReferenceG':[s['dryOxideReferenceG'],s['hydrationWaterG']],'referenceFormulaGmol':[2,D('55.845'),D('1.5'),D('31.998'),x,D('18.015')],'retainedSpecimenG':[s['remainingIronG'],s['productReferenceG']],'specimenMassGainG':[s['oxygenConsumedG'],s['hydrationWaterG']],'initialAccountG':[Fe,s['initialWaterG'],s['oxygenInitialG']],'finalAccountG':[s['retainedSpecimenG'],s['remainingWaterG'],s['oxygenRemainingG']],
 'massResidualG':[s['initialAccountG'],s['finalAccountG']],'ironAtomResidualMol':[s['initialIronMol'],s['remainingIronMol'],2,s['oxideReferenceMol']],'oxygenAtomResidualMol':[2,s['initialOxygenMol'],s['initialWaterMol'],2,s['oxygenRemainingMol'],s['remainingWaterMol'],3,x,s['oxideReferenceMol']],'hydrogenAtomResidualMol':[2,s['initialWaterMol'],2,s['remainingWaterMol'],2,x,s['oxideReferenceMol']],'convertedFraction':[s['convertedIronG'],Fe],'initialIronMl':[Fe,D('7.87')],'remainingIronMl':[s['remainingIronG'],D('7.87')],'shaftRadiusCm':[s['initialIronMl'],PI,L,2,D('.3'),3,4,D('.12')],'remainingRadiusCm':[s['shaftRadiusCm'],s['remainingIronG'],Fe]}

def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.inputs);trials=r['trials'];assert len(p.tables)==7;assert len(p.blocks)==114*len(trials);checks=0
 for j,table in enumerate(p.tables):assert len(table)==1+len(trials)*(1 if j==0 else 3),(j,len(table))
 for i,q in enumerate(trials):
  prep=p.tables[0][i+1];assert len(prep)==9 and prep[0]==str(i+1)and prep[-1]==q['note']
  def near(actual,want,key,ofloor=D(0),operand=False):
   nonlocal checks
   checks+=1;assert re.fullmatch(NUM,str(actual)),(key,actual)
   floor=D('3e-12')if key=='massResidualG'else D('3e-14')if key.endswith('AtomResidualMol')else ofloor if key=='oxygenRemainingMol'else ofloor*D('31.998')if key=='oxygenRemainingG'else D('1e-30')
   if operand and key in['oxygenRemainingG','oxygenAtomResidualMol']:floor=max(floor,ofloor)
   if operand and key=='finalAccountG':floor=max(floor,ofloor*D('31.998'))
   assert abs(D(actual)-D(want))<=max(floor,abs(D(want))*D('3e-11')),(i,key,actual,str(want))
  for actual,key in zip(prep[1:-1],['ironG','waterG','accessibleOxygenMol','chosenRatePerDay','elapsedDays','hydrationNumber','nailLengthCm']):near(actual,D(q[key]),key)
  blocks=p.blocks[114*i:114*(i+1)]
  for j,id in enumerate(IDS):
   s=solve(q,id);ofloor=D('1.8e-15')*max(s['initialOxygenMol'],D('.75')*s['convertedIronMol']);op=operands(q,s);selected=[b for b in blocks if b['key'].startswith(id+'.')];assert len(selected)==38;assert {b['key'][len(id)+1:]for b in selected}==set(UNITS)==set(op)
   for table,keys in zip(p.tables[1:],TABLES):
    row=table[1+3*i+j];assert len(row)==2+len(keys)and row[:2]==[str(i+1),TITLES[j]]
    for actual,key in zip(row[2:],keys):
     want=s[key]
     if want is None:assert actual=='Not a net-consumption limit'
     elif isinstance(want,bool):assert actual==str(want).lower(),(key,actual,want)
     elif isinstance(want,str):assert actual==want,(key,actual,want)
     else:near(actual,want,key,ofloor)
   for block in selected:
    key=block['key'][len(id)+1:];want=s[key]
    if want is None:assert block['result']=='Not applicable: no net hydration-water consumption';assert not re.findall(NUM,block['substitution']);continue
    match=re.fullmatch('('+NUM+r') (.+)',block['result']);assert match,(key,block['result']);assert match[2]==UNITS[key],(key,match[2],UNITS[key]);near(match[1],want,key,ofloor)
    expected=op[key]
    if key=='remainingIronG'and'exp'in block['substitution']:
     assert s['conditionsPresent']and abs(s['convertedIronMol']-s['targetIronMol'])<=max(s['targetIronMol'],s['oxygenIronLimitMol'])*D('1e-12')
     expected=[D(q['ironG']),D(q['chosenRatePerDay']),D(q['elapsedDays'])]
    numbers=re.findall(NUM,block['substitution']);assert len(numbers)==len(expected),(key,numbers,expected)
    for actual,value in zip(numbers,expected):near(actual,D(value),key,ofloor,True)
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

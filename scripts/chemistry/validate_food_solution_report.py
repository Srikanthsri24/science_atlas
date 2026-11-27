"""CL-0101 exported HTML validation independent of application code.
Checks all prediction/species/probe/material tables and112results+substitution operands.
"""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
from food_solution_reference import solve
D=lambda x:Decimal(str(x))
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
class Report(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.rows=[];self.cell='';self.incell=False;self.intable=False;self.inputs='';self.inscript=False;self.blocks=[];self.block=None;self.field=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([]);self.intable=True
  if tag=='tr':self.rows=[]
  if tag in ('td','th'):self.incell=True;self.cell=''
  if tag=='section' and a.get('class')=='worked':self.block={}
  if self.block is not None and tag=='p' and a.get('class')in['substitution','result']:self.field=a['class'];self.block[self.field]=''
  if tag=='script' and a.get('id')=='food-model-record-inputs':self.inscript=True
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
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None
TITLES=['Pure-water control','Acetic-acid model','Lactic-acid model','Citric-acid model','Sodium-bicarbonate model']
def expected(q):
 s=solve(q);v=D(q['volumeMl']);vl=v/1000;cs=[D(0)]+[D(q[n])for n in['aceticMolL','lacticMolL','citricMolL','bicarbonateMolL']];masses=list(map(D,['0','60.052','90.078','192.123','84.006']));pkas=list(map(D,['3.86','3.13','4.76','6.4']));kas=[[],[D('1.75e-5')],[D(10)**-pkas[0]],[D(10)**-p for p in pkas[1:]],[D('4.45e-7'),D('4.68e-11')]];kw=D('1e-14');values=[];subs=[]
 def add(value,operands):values.append(value);subs.append(operands)
 for p in pkas:add(D(10)**-p,[10,p])
 for index,c in enumerate(s['cells']):
  concentration=cs[index];h=c['hMolL'];na=concentration if index==4 else D(0);weights=[D(1)];product=D(1)
  for j,ka in enumerate(kas[index]):product*=ka;weights.append(product/h**(j+1))
  den=sum(weights)
  add(vl,[v,1000]);add(c['formalMol'],[concentration,vl]);add(c['soluteG'],[c['formalMol'],masses[index]]);add(c['waterG'],[1,v,c['soluteG']]);add(h,[h,h,na,kw,h,c['anionChargeMolL'],c['residual']]);add(c['ohMolL'],[kw,h]);add(c['pH'],[h,1])
  for j,alpha in enumerate(c['fractions']):
   add(alpha,[weights[j]]+weights);add(c['speciesMolL'][j],[concentration,alpha]);add(c['speciesMol'][j],[c['speciesMolL'][j],vl])
  add(c['anionChargeMolL'],[n for j,x in enumerate(c['speciesMolL'])for n in[j,x]]);add(c['sodiumMol'],[na,vl]);add(c['formalResidualMolL'],[concentration]+c['speciesMolL']);add(c['residual'],[h,na,c['ohMolL'],c['anionChargeMolL']]);add(D(0),[1,v,c['soluteG'],c['waterG']])
 for c in s['cells'][1:]:add(c['pH']-s['cells'][0]['pH'],[c['pH'],s['cells'][0]['pH']]);add(c['hMolL']/s['cells'][0]['hMolL'],[10,s['cells'][0]['pH'],c['pH']])
 add(s['totalSoluteG'],[c['soluteG']for c in s['cells']]);add(s['totalSolventG'],[c['waterG']for c in s['cells']]);add(s['totalContentsG'],[5,1,v]);add(s['massResidualG'],[s['totalContentsG'],s['totalSoluteG'],s['totalSolventG']]);assert len(values)==len(subs)==112
 return s,cs,values,subs

def validate(path):
 report=Report();report.feed(open(path).read());raw=json.loads(report.inputs);trials=raw['trials'];checks=0
 def near(actual,want):
  nonlocal checks
  checks+=1;want=D(want)
  if abs(D(actual)-want)>max(D('2e-12')if abs(want)<D('1e-11')else D('1e-24'),abs(want)*D('3e-11')):raise AssertionError(f'{actual} != {want}')
 assert len(report.tables)==5 and len(report.blocks)==112*len(trials)
 assert[len(t[0])for t in report.tables]==[9,11,6,6,5]
 assert[len(t)-1 for t in report.tables]==[len(trials),5*len(trials),12*len(trials),len(trials),len(trials)]
 with localcontext()as ctx:
  ctx.prec=55
  for i,q in enumerate(trials):
   s,cs,values,subs=expected(q);prep=report.tables[0][i+1];assert prep[0]==str(i+1)and prep[-1]==q['note']and len(prep)==9
   for value,key in zip(prep[1:-1],['volumeMl','aceticMolL','lacticMolL','citricMolL','bicarbonateMolL','sampleIndex','insertionFraction']):near(value,q[key])
   for j,(result,operands)in enumerate(zip(values,subs)):
    block=report.blocks[i*112+j];near(re.match(NUM,block['result'])[0],result);numbers=re.findall(NUM,block['substitution']);assert len(numbers)==len(operands),(i,j,numbers,operands)
    for actual,want in zip(numbers,operands):near(actual,want)
   speciesOffset=i*12+1
   for j,c in enumerate(s['cells']):
    row=report.tables[1][i*5+j+1];assert len(row)==11and row[:2]==[str(i+1),TITLES[j]]
    fields=[cs[j],c['formalMol'],c['soluteG'],c['waterG'],c['sodiumMol'],c['hMolL'],c['ohMolL'],c['pH']]
    for actual,want in zip(row[2:-1],fields):near(actual,want)
    category='neutral'if abs(c['pH']-7)<D('1e-10')else'acidic'if c['pH']<7else'basic';assert row[-1]==category
    for state,frac in enumerate(c['fractions']):
     row=report.tables[2][speciesOffset];speciesOffset+=1;assert len(row)==6and row[:2]==[str(i+1),TITLES[j]]
     label='0 · CO₂* pool'if j==4and state==0else'0'if state==0else f'−{state}';assert row[2]==label
     for actual,want in zip(row[3:],[frac,c['speciesMolL'][state],c['speciesMol'][state]]):near(actual,want)
   probe=report.tables[3][i+1];immersed=D(q['insertionFraction'])>=D('.95');assert len(probe)==6and probe[:2]==[str(i+1),TITLES[q['sampleIndex']]]and probe[-1]==q['note'];near(probe[2],q['insertionFraction']);assert probe[3]==('Yes'if immersed else'No')
   if immersed:near(probe[4],s['cells'][q['sampleIndex']]['pH'])
   else:assert probe[4]=='Reading withheld · immerse bulb'
   contents=report.tables[4][i+1];assert len(contents)==5and contents[0]==str(i+1)
   for actual,key in zip(contents[1:],['totalContentsG','totalSoluteG','totalSolventG','massResidualG']):near(actual,s[key])
 return{'trials':len(trials),'workedResults':len(report.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

"""Independent CL-0103 report inputs,tables,results and numeric substitutions."""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
from reaction_speed_reference import solve
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
  if tag=='script'and a.get('id')=='reaction-speed-record-inputs':self.inscript=True
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
KINETICS=['k','initialPeroxideMol','remainingFraction','conversion','remainingPeroxideMol','consumedPeroxideMol','extentMol','remainingConcentrationMolL','disappearanceMolLS','reactionRateMolLS','oxygenRateMolS','halfLifeS','t90S','inferredK']
GAS=['oxygenMol','headspaceMl','initialAirMol','totalGasMol','oxygenMoleFraction','totalGasVolumeMl','gasMl','maximumGasMl','gasRateMlS','meanGasRateMlS']
MASS=['initialPeroxideG','initialSolventG','remainingPeroxideG','createdWaterMol','createdWaterG','oxygenG','initialAirG','liquidG','gasG','initialContentsG','finalContentsG','massResidualG','hydrogenResidualMol','oxygenResidualMol']
def operands(q,s):
 v,C,t,T,P=map(D,[q[k]for k in['volumeMl','concentrationMolL','elapsedS','temperatureK','pressureKpa']]);k=s['k'];R=D('8.314');N=s['initialPeroxideMol']
 return{'k':[k],'initialPeroxideMol':[C,v,1000],'remainingFraction':[k,t],'conversion':[1,k,t],'remainingPeroxideMol':[N,s['remainingFraction']],'consumedPeroxideMol':[N,s['conversion']],'extentMol':[s['consumedPeroxideMol'],2],'oxygenMol':[s['extentMol']],'createdWaterMol':[2,s['extentMol']],'remainingConcentrationMolL':[C,s['remainingFraction']],'disappearanceMolLS':[k,s['remainingConcentrationMolL']],'reactionRateMolLS':[s['disappearanceMolLS'],2],'oxygenRateMolS':[k,s['remainingPeroxideMol'],2],
 'gasMl':[s['oxygenMol'],R,T,P,1000],'gasRateMlS':[s['oxygenRateMolS'],R,T,P,1000],'maximumGasMl':[N,2,R,T,P,1000],'headspaceMl':[100,v],'initialAirMol':[P,s['headspaceMl'],1000,R,T],'totalGasMol':[s['initialAirMol'],s['oxygenMol']],'oxygenMoleFraction':[D('.2095'),s['initialAirMol'],s['oxygenMol'],s['totalGasMol']],'totalGasVolumeMl':[s['headspaceMl'],s['gasMl']],
 'initialPeroxideG':[N,D('34.014')],'initialSolventG':[1,v,s['initialPeroxideG']],'remainingPeroxideG':[s['remainingPeroxideMol'],D('34.014')],'createdWaterG':[s['createdWaterMol'],D('18.015')],'oxygenG':[s['oxygenMol'],D('31.998')],'initialAirG':[s['initialAirMol'],D('28.97')],'liquidG':[s['initialSolventG'],s['remainingPeroxideG'],s['createdWaterG']],'gasG':[s['initialAirG'],s['oxygenG']],'initialContentsG':[1,v,s['initialAirG']],'finalContentsG':[s['liquidG'],s['gasG']],'massResidualG':[s['initialContentsG'],s['finalContentsG']],'hydrogenResidualMol':[2,N,2,s['remainingPeroxideMol'],2,s['createdWaterMol']],'oxygenResidualMol':[2,N,2,s['remainingPeroxideMol'],s['createdWaterMol'],2,s['oxygenMol']],
 'halfLifeS':[2,k]if k else[],'t90S':[10,k]if k else[],'meanGasRateMlS':[s['gasMl'],t]if t else[],'inferredK':[1,s['conversion'],t]if t and N else[]}
def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.inputs);trials=r['trials'];assert len(p.tables)==5;assert len(p.blocks)==79*len(trials);checks=0;comparison_roundoff={}
 def near(value,want,name):
  nonlocal checks
  checks+=1;assert re.fullmatch(NUM,str(value)),(name,value)
  floor=D('3e-12')if name.endswith('massResidualG')else D('1e-17')if name.endswith(('hydrogenResidualMol','oxygenResidualMol'))else D('1e-28')
  assert abs(D(value)-D(want))<=max(floor,comparison_roundoff.get(name,D(0)),abs(D(want))*D('3e-11')),(name,value,str(want))
 for j,table in enumerate(p.tables):assert len(table)==1+len(trials)*(2 if j in[1,2,3]else 1)
 for i,q in enumerate(trials):
  prep=p.tables[0][i+1];assert len(prep)==9 and prep[0]==str(i+1)and prep[-1]==q['note']
  for actual,key in zip(prep[1:-1],['volumeMl','concentrationMolL','kA','kB','elapsedS','temperatureK','pressureKpa']):near(actual,q[key],key)
  cells={name:solve(q,q['k'+name.upper()])for name in['a','b']};blocks=p.blocks[79*i:79*(i+1)];assert len({b['key']for b in blocks})==79
  for name,s in cells.items():
   ops=operands(q,s);selected=[b for b in blocks if b['key'].startswith(name+'.')];assert len(selected)==38 and {b['key'][2:]for b in selected}==set(s)
   for b in selected:
    key=b['key'][2:];want=s[key]
    if want is None:assert b['result']=='Unavailable under these conditions';assert not re.findall(NUM,b['substitution']);continue
    match=re.match(NUM,b['result']);assert match,(key,b);near(match[0],want,key)
    nums=re.findall(NUM,b['substitution']);assert len(nums)==len(ops[key]),(key,nums,ops[key])
    for actual,value in zip(nums,ops[key]):near(actual,value,key+'operand')
   rowindex=1+2*i+(0 if name=='a'else 1)
   for table,keys in zip(p.tables[1:4],[KINETICS,GAS,MASS]):
    row=table[rowindex];assert len(row)==2+len(keys)and row[:2]==[str(i+1),name.upper()]
    for value,key in zip(row[2:],keys):
     if s[key]is None:assert value=='Unavailable'
     else:near(value,s[key],key)
  a,b=cells['a'],cells['b'];comparison_roundoff={'deltaGasMl':max(abs(a['gasMl']),abs(b['gasMl']))*D('1.8e-15'),'deltaRateMlS':max(abs(a['gasRateMlS']),abs(b['gasRateMlS']))*D('1.8e-15')};ka,kb=D(q['kA']),D(q['kB']);cross=(ka/kb).ln()/(ka-kb)if ka and kb and ka!=kb and q['concentrationMolL']>0 else None;vals={'deltaGasMl':a['gasMl']-b['gasMl'],'deltaRateMlS':a['gasRateMlS']-b['gasRateMlS'],'crossoverS':cross};op={'deltaGasMl':[a['gasMl'],b['gasMl']],'deltaRateMlS':[a['gasRateMlS'],b['gasRateMlS']],'crossoverS':[ka,kb,ka,kb]if cross is not None else[]}
  for block in[b for b in blocks if'.'not in b['key']]:
   key=block['key'];want=vals[key]
   if want is None:assert block['result']=='Unavailable under these conditions';continue
   near(re.match(NUM,block['result'])[0],want,key);nums=re.findall(NUM,block['substitution']);assert len(nums)==len(op[key])
   for actual,value in zip(nums,op[key]):near(actual,value,key+'operand')
  row=p.tables[4][i+1];assert len(row)==6 and row[0]==str(i+1);near(row[1],vals['deltaGasMl'],'deltaGasMl');near(row[2],vals['deltaRateMlS'],'deltaRateMlS')
  for actual,x,y in[(row[3],a['gasMl'],b['gasMl']),(row[4],a['gasRateMlS'],b['gasRateMlS'])]:assert actual==('equal'if abs(x-y)<=max(abs(x),abs(y))*D('1e-12')else'A'if x>y else'B')
  if cross is None:assert row[5]=='No unique positive-time crossover'
  else:near(row[5],cross,'crossoverS')
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

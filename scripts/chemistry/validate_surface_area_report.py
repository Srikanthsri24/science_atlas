"""Independent CL-0104 HTML tables,77results and every numeric substitution operand."""
import json,re,sys
from html.parser import HTMLParser
from surface_area_reference import solve,D,mp
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
  if tag=='script'and a.get('id')=='surface-area-record-inputs':self.inscript=True
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
GEOMETRY=['count','edgeLossFraction','initialEdgeCm','edgeCm','initialAreaCm2','areaCm2','initialSolidMl','solidMl']
CAPACITY=['capacityG','initialDissolvedG','availableCapacityG','equilibriumAdditionalG','equilibriumSolidG','alpha','delta','minimumX']
MATERIAL=['additionalDissolvedG','solidG','totalDissolvedG','wholeSaltG','waterMl','solutionG','solutionMl','solidMl','mixtureMl','initialContentsG','finalContentsG','massResidualG','saltResidualG']
RATES=['beta','initialRateGS','rateGS','meanRateGS','convertedFraction','drivingFraction','saturationFraction','edgeShrinkCmS']
def operands(q,s):
 w,m,f,J,t=map(D,[q[k]for k in['waterG','saltG','initialSaturation','fluxGcm2S','elapsedS']]);N=s['count'];z=s['edgeLossFraction']
 return{'count':[N],'capacityG':[D('.36'),w],'initialDissolvedG':[f,s['capacityG']],'availableCapacityG':[s['capacityG'],s['initialDissolvedG']],'equilibriumAdditionalG':[m,s['availableCapacityG']],'equilibriumSolidG':[m,s['equilibriumAdditionalG']],'alpha':[m,s['capacityG']],'delta':[1,f],'initialEdgeCm':[m,D('2.17'),N],'beta':[2,J,D('2.17'),s['initialEdgeCm']],'minimumX':[s['equilibriumSolidG'],m],
 'edgeLossFraction':[s['beta'],s['delta'],s['alpha'],3,3,0,0,t,D('.05')],
 'additionalDissolvedG':[s['equilibriumAdditionalG'],m,z,3,3,z,z],'solidG':[s['equilibriumSolidG'],m,1,z],'edgeCm':[s['initialEdgeCm'],s['solidG'],m],'initialAreaCm2':[6,N,s['initialEdgeCm']],'areaCm2':[6,N,s['edgeCm']],'totalDissolvedG':[s['initialDissolvedG'],s['additionalDissolvedG']],'saturationFraction':[s['totalDissolvedG'],s['capacityG']],'drivingFraction':[0,1,s['saturationFraction']],'initialRateGS':[J,s['initialAreaCm2'],s['delta']],'rateGS':[J,s['areaCm2'],s['drivingFraction']],'meanRateGS':[s['additionalDissolvedG'],t]if t else[],'convertedFraction':[s['additionalDissolvedG'],m],
 'solutionG':[w,s['totalDissolvedG']],'waterMl':[w,1],'solutionMl':[s['waterMl'],s['totalDissolvedG'],D('.28')],'initialSolidMl':[m,D('2.17')],'solidMl':[s['solidG'],D('2.17')],'mixtureMl':[s['solutionMl'],s['solidMl']],'initialContentsG':[w,s['initialDissolvedG'],m],'finalContentsG':[s['solutionG'],s['solidG']],'wholeSaltG':[s['totalDissolvedG'],s['solidG']],'massResidualG':[s['initialContentsG'],s['finalContentsG']],'saltResidualG':[s['initialDissolvedG'],m,s['wholeSaltG']],'edgeShrinkCmS':[2,J,s['drivingFraction'],D('2.17')]if s['solidG']else[0]}
def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.inputs);trials=r['trials'];assert len(p.tables)==6;assert len(p.blocks)==77*len(trials);checks=0
 def near(value,want,name,drive_operand=False):
  nonlocal checks
  checks+=1;assert re.fullmatch(NUM,str(value)),(name,value)
  floor=D('2e-14')if drive_operand else D('4e-12')if name in['massResidualG','saltResidualG']else D('2e-14')if name in['drivingFraction','rateGS','edgeShrinkCmS']else D('1e-9')if name=='deltaAdditionalG'else D('1e-11')if name=='deltaRateGS'else D('1e-25')
  assert abs(D(value)-want)<=max(floor,abs(want)*D('2e-8')),(name,value,str(want))
 for j,table in enumerate(p.tables):assert len(table)==1+len(trials)*(2 if j in[1,2,3,4]else 1),(j,len(table))
 for i,q in enumerate(trials):
  prep=p.tables[0][i+1];assert len(prep)==9 and prep[0]==str(i+1)and prep[-1]==q['note']
  for actual,key in zip(prep[1:-1],['waterG','saltG','initialSaturation','grainsA','grainsB','fluxGcm2S','elapsedS']):near(actual,D(q[key]),key)
  cells={name:solve(q,q['grains'+name.upper()])for name in['a','b']};blocks=p.blocks[77*i:77*(i+1)];assert len({b['key']for b in blocks})==77
  for name,s in cells.items():
   selected=[b for b in blocks if b['key'].startswith(name+'.')];ops=operands(q,s);assert len(selected)==36 and {b['key'][2:]for b in selected}==set(s)-{'complete'}
   for b in selected:
    key=b['key'][2:];want=s[key]
    if want is None:assert b['result']=='Unavailable at the initial instant';assert not re.findall(NUM,b['substitution']);continue
    match=re.match(NUM,b['result']);assert match,(key,b);near(match[0],want,key);nums=re.findall(NUM,b['substitution']);assert len(nums)==len(ops[key]),(key,nums,ops[key])
    for operand_index,(actual,value)in enumerate(zip(nums,ops[key])):near(actual,D(value),key+'operand',key in['rateGS','edgeShrinkCmS']and operand_index==2)
   rowindex=1+2*i+(0 if name=='a'else 1)
   for table,keys in zip(p.tables[1:5],[GEOMETRY,CAPACITY,MATERIAL,RATES]):
    row=table[rowindex];extras=2 if table is p.tables[4]else 0;assert len(row)==2+len(keys)+extras and row[:2]==[str(i+1),name.upper()]
    for actual,key in zip(row[2:],keys):
     if s[key]is None:assert actual=='Unavailable'
     else:near(actual,s[key],key)
   condition=p.tables[4][rowindex][-1];done=p.tables[4][rowindex][-2];assert done==str(s['complete']).lower()
   if q['fluxGcm2S']==0:assert condition=='zero-flux-control'
   elif q['initialSaturation']==1:assert condition=='initially-saturated'
   elif s['complete']:assert condition=='solid-exhausted'
   elif condition=='numerical-capacity-equilibrium':assert s['drivingFraction']<D('2e-14')
   else:assert condition=='dissolving'
  a,b=cells['a'],cells['b'];values={'initialAreaRatioBoverA':b['initialAreaCm2']/a['initialAreaCm2'],'currentAreaRatioBoverA':b['areaCm2']/a['areaCm2']if a['areaCm2']else None,'initialRateRatioBoverA':b['initialRateGS']/a['initialRateGS']if a['initialRateGS']else None,'deltaAdditionalG':b['additionalDissolvedG']-a['additionalDissolvedG'],'deltaRateGS':b['rateGS']-a['rateGS']};op={'initialAreaRatioBoverA':[b['initialAreaCm2'],a['initialAreaCm2']],'currentAreaRatioBoverA':[b['areaCm2'],a['areaCm2']],'initialRateRatioBoverA':[b['initialRateGS'],a['initialRateGS']],'deltaAdditionalG':[b['additionalDissolvedG'],a['additionalDissolvedG']],'deltaRateGS':[b['rateGS'],a['rateGS']]}
  for block in[b for b in blocks if'.'not in b['key']]:
   key=block['key'];want=values[key]
   if want is None:assert block['result']=='Unavailable: denominator is zero';assert not re.findall(NUM,block['substitution']);continue
   near(re.match(NUM,block['result'])[0],want,key);nums=re.findall(NUM,block['substitution']);assert len(nums)==2
   for actual,value in zip(nums,op[key]):near(actual,value,'rateGS'if key=='deltaRateGS'else key+'operand')
  row=p.tables[5][i+1];assert len(row)==8 and row[0]==str(i+1)
  for actual,(key,want)in zip(row[1:6],values.items()):
   if want is None:assert actual=='Unavailable'
   else:near(actual,want,key)
  for actual,x,y in[(row[6],a['additionalDissolvedG'],b['additionalDissolvedG']),(row[7],a['rateGS'],b['rateGS'])]:
   expect='equal'if abs(x-y)<=max(abs(x),abs(y))*D('1e-10')else'A'if x>y else'B';assert actual==expect or(actual=='equal'and abs(x-y)<D('1e-9')),(actual,expect,x,y)
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))

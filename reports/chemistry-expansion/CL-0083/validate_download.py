"""Verify actual exported four-lane readings and worked results without app imports."""
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import math,re,json
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.table=[]
  elif tag=='tr':self.row=[]
  elif tag in ('td','th'):self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  elif tag=='tr' and self.row is not None:self.table.append(self.row);self.row=None
  elif tag=='table':self.tables.append(self.table);self.table=None
p=Path(__file__).parent;html=p.joinpath('actual-ui-report.html').read_text();parser=Tables();parser.feed(html)
tables=[t[1:] for t in parser.tables];assert len(tables)>=6
preps,develop,lanes,matches,notes=tables[:5];n=len(preps);assert n>=3 and len(develop)==len(notes)==n and len(lanes)==4*n and len(matches)==3*n
fieldChecks=numericFields=workedChecks=numericWorked=0
def check(actual,expected,kind):
 global fieldChecks,numericFields,workedChecks,numericWorked
 if expected is None:assert actual=='Not established' or actual.startswith('Not established:'),(actual,expected)
 elif isinstance(expected,str):assert actual==expected,(actual,expected)
 else:
  m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',actual,re.I);assert m,actual
  a=float(m[0]);assert abs(a-expected)<=9e-8*max(1,abs(expected)),(a,expected)
  if kind=='field':numericFields+=1
  else:numericWorked+=1
 if kind=='field':fieldChecks+=1
 else:workedChecks+=1
rf={'P':{'S1':.25,'S2':.22},'Q':{'S1':.7,'S2':.66},'R':{'S1':.25,'S2':.48},'T':{'S1':.5,'S2':.8}}
recipes={'A':['P','Q'],'B':['P','T'],'C':['R','T'],'D':['R','Q']};vials={'1':'A','2':'B','3':'C','4':'D'}
results=re.findall(r'<p>Result: (.*?)</p>',html);position=0;allOutcomes=[]
raw=json.loads(re.search(r'<script id="ink-comparison-inputs" type="application/json">(.*?)</script>',html,re.S)[1]);assert len(raw['trials'])==n
for i,row in enumerate(preps):
 inputs=raw['trials'][i];solvent=inputs['solvent'];vial=inputs['unknownVial'];load,sigma0,D,c,r,t=[inputs[k] for k in['inkLoadMg','initialSigmaCm','dispersionCm2S','capillaryCm2S','rulerIncrementCm','timeSeconds']]
 for actual,value in zip(row,[i+1,solvent,vial,load,sigma0,D,c,r,t]):check(actual,value,'field')
 stop=(11.5-.8)**2/c;active=min(t,stop);front=.8+math.sqrt(c*active);L=max(0,front-2);wet=max(0,active-1.44/c);variance=sigma0*sigma0+2*D*wet;sigma=math.sqrt(variance);rnd=lambda x:math.floor((x+2.220446049250313e-16)/r+.5)*r;F=rnd(L) if L>=4 else None
 for actual,value in zip(develop[i],[i+1,active,front,L,F,wet,sigma,4*load]):check(actual,value,'field')
 measured=[];resolution=[];eligible=[];values=[front,L,F,variance]
 for j,recipe in enumerate(['A','B','C',vials[vial]]):
  aff=sorted(rf[d][solvent] for d in recipes[recipe]);Rs=(aff[1]-aff[0])*L/(4*sigma);reason='develop further' if L<4 else 'unresolved' if Rs<1.5 else 'reportable';ok=reason=='reportable';data=[];working=[Rs]
  for a in aff:
   d=rnd(a*L) if ok else None;ratio=d/F if ok else None;lo=max(0,(d-r/2)/(F+r/2)) if ok else None;hi=min(1,(d+r/2)/(F-r/2)) if ok else None;data.extend([d,ratio,lo,hi]);working.extend([d,ratio,lo,hi])
  expected=[i+1,['A','B','C','U'][j],Rs,reason]+data+[load]
  for actual,value in zip(lanes[4*i+j],expected):check(actual,value,'field')
  values+=working;measured.append(data);resolution.append(Rs);eligible.append(ok)
 values.append(r/F if F is not None else None);outcomes=[]
 for j in range(3):
  delta=[abs(measured[j][k]-measured[3][k]) for k in[0,4]] if eligible[j] and eligible[3] else None
  status='inconclusive' if delta is None else 'consistent' if all(x<=r+1e-10 for x in delta) else 'different';outcomes.append(status)
  expected=[i+1,['A','B','C'][j],status,*((delta) if delta is not None else[None,None]),r,r/F if F is not None else None]
  for actual,value in zip(matches[3*i+j],expected):check(actual,value,'field')
  values+=delta if delta is not None else[None,None]
 assert len(values)==47
 for value in values:check(unescape(results[position]),value,'worked');position+=1
 allOutcomes.append((vial,solvent,outcomes))
assert position==len(results)
for table,vial in zip(tables[5:],sorted(set(row[2] for row in preps))):
 for j,row in enumerate(table):
  yes={s for v,s,o in allOutcomes if v==vial and o[j]=='consistent'};no={s for v,s,o in allOutcomes if v==vial and o[j]=='different'};good=sum(v==vial and o[j]!='inconclusive' for v,s,o in allOutcomes);bad=sum(v==vial and o[j]=='inconclusive' for v,s,o in allOutcomes)
  status='excluded' if no else 'consistent_both' if len(yes)==2 else 'consistent_one' if yes else 'inconclusive'
  for actual,value in zip(row,[['A','B','C'][j],status,', '.join(sorted(yes)) or'None',', '.join(sorted(no)) or'None',good,bad]):check(actual,value,'field')
assert '&lt;safe&gt; &amp; evidence' in html and '<safe>' not in html
out={'status':'passed','actualGuiDevelopments':n,'actualLaneRecords':4*n,'observationFieldChecks':fieldChecks,'numericObservationChecks':numericFields,'workedResultChecks':workedChecks,'numericWorkedResults':numericWorked,'reportTables':len(tables),'method':'Separate Python front/broadening/ruler/comparison calculation;no app code imported','scope':'Internal numerical export verification;not real ink calibration or independent expert certification.'}
p.joinpath('download-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))

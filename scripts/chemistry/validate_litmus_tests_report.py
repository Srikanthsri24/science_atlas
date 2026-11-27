"""Independent CL-0093 report arithmetic. Charge balance solved by log-space bisection,not app quadratic."""
import json,math,re,sys
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.worked=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script' and a.get('id')=='litmus-tests-record-inputs':self.in_json=True
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
  if self.p is not None:self.p+=s
  if self.in_json:self.json_text+=s
 def handle_endtag(self,tag):
  if tag in('td','th'):self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p':
   if self.part=='substitution':self.sub=self.p
   if self.part=='result':self.worked.append((self.sub,self.p))
   self.p=None;self.part=None
kw=1e-14
keys=['kind','stockMilliM','dilutionFactor','sampleVolumeMl','dropVolumeUl','redFraction','blueFraction']
def solve(q):
 stock=0 if q['kind']=='water' else q['stockMilliM']/1000;C=stock/q['dilutionFactor'];sign=1 if q['kind']=='acid' else -1 if q['kind']=='base' else 0;lo=0.;hi=14.
 for _ in range(120):
  mid=(lo+hi)/2;H=10**(-mid)
  if H-kw/H-sign*C>0:lo=mid
  else:hi=mid
 pH=(lo+hi)/2;H=10**(-pH);OH=kw/H;pOH=-math.log10(OH);major=max(H,OH);minor=min(H,OH);root=major+minor;red=q['dropVolumeUl']/1000*q['redFraction'];blue=q['dropVolumeUl']/1000*q['blueFraction'];reservoir=q['sampleVolumeMl']-red-blue;ni=C*q['sampleVolumeMl']/1000;nr=C*reservoir/1000;na=C*red/1000;nb=C*blue/1000
 end='water-control' if q['kind']=='water' else 'acid-endpoint' if pH<4.5 else 'base-endpoint' if pH>8.3 else 'transition-unresolved';complete=q['redFraction']==1 and q['blueFraction']==1
 rf='blue' if end=='base-endpoint' else 'red' if end in('acid-endpoint','water-control') else 'unresolved';bf='red' if end=='acid-endpoint' else 'blue' if end in('base-endpoint','water-control') else 'unresolved'
 ro='Untested red paper' if q['redFraction']==0 else 'Contact stage;reading pending' if q['redFraction']<1 else 'Transition colour unresolved' if rf=='unresolved' else 'Red paper remains red' if rf=='red' else 'Red paper becomes blue'
 bo='Untested blue paper' if q['blueFraction']==0 else 'Contact stage;reading pending' if q['blueFraction']<1 else 'Transition colour unresolved' if bf=='unresolved' else 'Blue paper remains blue' if bf=='blue' else 'Blue paper becomes red'
 inference='Test both fresh papers before making an inference.' if not complete else 'The blue paper turns red;the pair supports an acidic reference.' if end=='acid-endpoint' else 'The red paper turns blue;the pair supports a basic reference.' if end=='base-endpoint' else 'Both papers retain their starting colours in the chosen water control. This does not prove that an unknown sample has exactly pH7.' if end=='water-control' else 'The prepared reference lies within the broad transition region. Do not assign an exact pH or a confident classification from this paired-paper model.'
 observations=[stock,C,H,OH,pH,pOH,'neutral' if q['kind']=='water' else 'acidic' if q['kind']=='acid' else 'basic',end,'Yes' if complete else 'No',ro,bo,inference]
 budget=[reservoir,red,blue,0,ni,nr,na,nb,0,0,0]
 results=[stock,C,q['sampleVolumeMl']/1000,q['dropVolumeUl']/1000,red,blue,reservoir,0,ni,nr,na,nb,0,root,major,minor,H,OH,pH,pOH,0,0,0]
 subs=[[0]if q['kind']=='water' else[q['stockMilliM'],1000],[stock,q['dilutionFactor']],[q['sampleVolumeMl'],1000],[q['dropVolumeUl'],1000],[q['dropVolumeUl']/1000,q['redFraction']],[q['dropVolumeUl']/1000,q['blueFraction']],[q['sampleVolumeMl'],red,blue],[reservoir,red,blue,q['sampleVolumeMl']],[C,q['sampleVolumeMl']/1000],[C,reservoir,1000],[C,red,1000],[C,blue,1000],[nr,na,nb,ni],[C,4,kw],[C,root,2],[kw,major],[kw]if q['kind']=='water' else[major if q['kind']=='acid' else minor],[kw]if q['kind']=='water' else[major if q['kind']=='base' else minor],[H,1],[OH,1],[pH,pOH,14],[H,OH,sign*C],[H,OH,kw]]
 return observations,budget,results,subs
# Avoid counting the base in the function name log10 as a substitution operand.
def nums(s):return[float(x)for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert len(d.tables)==3;checks=0
 def near(a,b,where,absolute=2e-22):
  nonlocal checks
  assert math.isfinite(a) and math.isfinite(b),where
  assert abs(a-b)<=2e-10*abs(b)+absolute,(where,a,b);checks+=1
 def row(actual,expected,where,absolute):
  assert len(actual)==len(expected),(where,len(actual),len(expected))
  for j,(a,b)in enumerate(zip(actual,expected)):
   if isinstance(b,str):assert a==b,(where,j,a,b)
   else:near(float(a),b,(where,j),absolute.get(j,2e-22))
 for i,q in enumerate(trials):
  obs,budget,results,subs=solve(q)
  row(d.tables[0][i+1],[i+1,*[q[k]for k in keys],q['note']],('prep',i),{})
  row(d.tables[1][i+1],[i+1,*obs],('observations',i),{})
  row(d.tables[2][i+1],[i+1,*budget],('budget',i),{4:3e-15,9:2e-19,10:2e-17,11:2e-28})
  for j,(sub,result)in enumerate(zip(subs,results)):
   a,b=d.worked[i*23+j];an=nums(a);bn=nums(b);assert len(an)==len(sub),(i,j,a,sub);assert len(bn)==1,(i,j,b)
   for x,y in zip(an,sub):near(x,y,('operand',i,j))
   near(bn[0],result,('result',i,j),3e-15 if j==7 else 2e-19 if j==12 else 3e-14 if j==20 else 2e-17 if j==21 else 2e-28 if j==22 else 2e-22)
 assert len(d.worked)==len(trials)*23
 assert all(len(t)==len(trials)+1 for t in d.tables)
 print(f'PASS:{len(trials)}trials,{checks}independent table/numeric-operand/result checks,{len(d.worked)}workedblocks.')
if __name__=='__main__':main(sys.argv[1])

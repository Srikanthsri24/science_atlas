import json,math,re,html
from pathlib import Path
from html.parser import HTMLParser
p=Path(__file__).parent;before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text());assert before==after;r=after['record'];assert len(r['trials'])==31
calc=[]
for i,q in enumerate(r['trials']):
 C,k,a,d,P,I,t=[q[n] for n in ['initialSuspendedMgL','settlingRateSInv','colourAbsorptionMInv','dilutionFactor','pathCm','sourceMw','timeS']];L=P/100;v=100/d;cd=C/d;m=cd*.1;f=math.exp(-k*t);susp=cd*f;ms=m*f;bed=m*(-math.expm1(-k*t));s=.1*susp;ac=a/d;mu=s+ac+.02;tau=(s+ac)*L;total=mu*L;blank=I*math.exp(-.02*L);direct=I*math.exp(-total);T=100*direct/blank;side=I*.01*s*L*math.exp(-total);S=100*side/blank;OD=tau/math.log(10)
 row=[i+1,q['sample'],t,C,k,a,d,P,I,v,100-v,susp,ms,bed,m,blank,direct,T,side,S,OD,q['observation']]
 for col,x in enumerate(row):
  y=after['rows'][i][col]
  if isinstance(x,str):assert y==x
  else:assert math.isclose(float(y),x,rel_tol=1e-8,abs_tol=5.1e-7),(i,col,y,x)
 calc.extend([L,v,100-v,cd,m,f,susp,ms,bed,m,s,ac,mu,tau,total,blank,direct,T,side,S,OD,k*ms])
report=(p/'ui-exported-practical.html').read_text();assert 'VisionariesAI Labs' in report and not re.search(r'https?://',report)
for name in ['prediction','conclusion']:assert html.escape(r[name],quote=True).replace('&#x27;','&#39;') in report
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.row=None;self.cell=None;self.inp=False;self.p='';self.results=[]
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-turbidity-table');self.tables[self.current]=[]
  if tag=='tr' and self.current is not None:self.row=[]
  if tag=='td' and self.current is not None:self.cell=''
  if tag=='p':self.inp=True;self.p=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.inp:self.p+=data
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None and self.row:self.tables[self.current].append(self.row);self.row=None
  if tag=='table':self.current=None
  if tag=='p' and self.inp:
   if self.p.startswith('Result: '):self.results.append(self.p[8:])
   self.inp=False
v=Parser();v.feed(report)
for j,cols in enumerate([[0,1,2,3,4,5,6,7,8,9,10],[0,1,2,11,12,13,14,21],[0,1,2,15,16,17,18,19,20]]):assert v.tables[str(j)]==[[row[c] for c in cols] for row in after['rows']]
assert len(v.results)==len(calc)==682
for i,(s,x) in enumerate(zip(v.results,calc)):
 m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',s,re.I);assert m
 assert math.isclose(float(m[0]),x,rel_tol=1e-8,abs_tol=5.1e-7),(i,m[0],x)
print('PASS:31 GUI trials,22-column records,682 independent worked results,3 print tables,HTML escaping/company-only report and exact reload persistence')

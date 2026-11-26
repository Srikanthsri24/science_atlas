import json,math,re,html
from pathlib import Path
from html.parser import HTMLParser
p=Path(__file__).parent;before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text());assert before==after;r=after['record'];assert len(r['trials'])==54;calc=[]
def close(y,x):
 y=float(y)
 if abs(x)<1e-12:return abs(y-x)<1e-12
 if abs(x)<1e-5:return math.isclose(y,x,rel_tol=1e-7,abs_tol=1e-15)
 return math.isclose(y,x,rel_tol=1e-8,abs_tol=5.1e-7)
for i,q in enumerate(r['trials']):
 W,D,S,T,k,delay,t=[q[n] for n in ['waterG','dissolvedChargeG','seedG','temperatureC','rateSInv','nucleationDelayS','timeS']];f=(T-20)/20;sol=31.6+32.3*f;cap=W*sol/100;M=D+S;target=min(M,cap);eqsolid=M-target;A=-S if target==M else D-target;tau=delay if S==0 and A>0 else 0;u=max(0,t-tau);relax=-math.expm1(-k*u);lag=A*math.exp(-k*u);diss=target+lag;solid=-lag if A<0 and eqsolid==0 else S+A*relax;new=solid-S;ratio=diss/cap;rate=k*lag if t>tau else 0;solutionMass=W+diss;whole=W+M;hot=1.69*W;solidvol=solid/2.109;solvol=W+.45*diss;area=128*4.5**2*math.sin(2*math.pi/128)/2;height=(solvol+solidvol)/area;form=solid/21
 row=[i+1,q['sample'],t,W,D,S,T,k,delay,cap,diss,solid,new,M,whole,rate,ratio,u,lag,q['observation']]
 for j,x in enumerate(row):
  y=after['rows'][i][j]
  if isinstance(x,str):assert y==x
  else:assert close(y,x),(i,j,y,x)
 calc.extend([f,sol,cap,M,target,eqsolid,A,tau,u,relax,lag,diss,solid,new,ratio,rate,M,solutionMass,whole,hot,solidvol,solvol,area,height,form])
report=(p/'ui-exported-practical.html').read_text();assert 'VisionariesAI Labs' in report and not re.search(r'https?://',report)
for n in ['prediction','conclusion']:assert html.escape(r[n],quote=True).replace('&#x27;','&#39;') in report
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.row=None;self.cell=None;self.inp=False;self.p='';self.results=[]
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-growth-table');self.tables[self.current]=[]
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
for j,cols in enumerate([[0,1,2,3,4,5,6,7,8],[0,1,2,9,10,11,12,13,14,19],[0,1,2,15,16,17,18]]):assert v.tables[str(j)]==[[row[c] for c in cols] for row in after['rows']]
assert len(v.results)==len(calc)==1350
for i,(s,x) in enumerate(zip(v.results,calc)):
 m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',s,re.I);assert m
 assert close(m[0],x),(i,m[0],x)
print('PASS:54 actualGUItrials,20-column records,1350 independent workedresults,3printtables,escaping/company-only output andexactreload persistence;small residues checked atrelative precision')

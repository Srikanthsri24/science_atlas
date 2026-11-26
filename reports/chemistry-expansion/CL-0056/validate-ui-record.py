import json,math,re,html
from pathlib import Path
from html.parser import HTMLParser
p=Path(__file__).parent
before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text())
assert before==after
r=after['record'];assert len(r['trials'])==32
expected=[]
for i,q in enumerate(r['trials']):
 W,S,k,t=[q[n] for n in ['waterG','saltG','rateSInv','timeS']];a=S/10;R=S*min(1,t/10);u=max(0,t-.1);A=S*min(1,u/10);cup=S-R;flight=R-A;C=.36*W;M=min(S,C);T=min(10,C/a)
 # Independent integral of the linear driving target, evaluated with expm1.
 def ramp(v):return a/k*(k*v+math.expm1(-k*v))
 end=ramp(T)
 if u<=T:D=ramp(u);U=A-D
 else:lag=(M-end)*math.exp(-k*(u-T));D=M-lag;U=A-M+lag
 rate=k*(min(A,C)-D);volume=W/.997+.28*D
 row=[i+1,t,W,S,k,cup,flight,A,U,D,C,W+D,W+A,W+S,150,150+W+S,W+S,rate,volume]
 expected.append((row,[a,R,u,A,cup,flight,C,M,T,end,D,U,W+D,W+A,W+S,150+W+S,W+S,round((150+W+S)*10)/10,rate,W/.997,D*.28,volume,U/2.165,max(0,S-C),S]))
 for n,v in enumerate(row):assert math.isclose(float(after['rows'][i][n]),v,rel_tol=1e-8,abs_tol=5.1e-7),(i,n,after['rows'][i][n],v)
 assert after['rows'][i][19]==q['observation']
report=(p/'ui-exported-practical.html').read_text();assert 'VisionariesAI Labs' in report and not re.search(r'https?://',report)
for n in ['prediction','conclusion']:assert html.escape(r[n],quote=True).replace('&#x27;','&#39;') in report
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.row=None;self.cell=None;self.results=[];self.result=False;self.resultText=''
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-closed-table');self.tables[self.current]=[]
  if tag=='tr' and self.current is not None:self.row=[]
  if tag=='td' and self.current is not None:self.cell=''
  if tag=='p':self.result=True;self.resultText=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.result:self.resultText+=data
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None and self.row:self.tables[self.current].append(self.row);self.row=None
  if tag=='table':self.current=None
  if tag=='p' and self.result:
   if self.resultText.startswith('Result: '):self.results.append(self.resultText[8:])
   self.result=False
v=Parser();v.feed(report)
for j,cols in enumerate([[0,1,2,3,4,5,6,7,8,9,19],[0,1,10,11,12,13,14,15,16],[0,1,17,18]]):assert v.tables[str(j)]==[[row[c] for c in cols] for row in after['rows']]
assert len(v.results)==800
for i,(_,calc) in enumerate(expected):
 for j,x in enumerate(calc):
  m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',v.results[25*i+j],re.I);assert m,(i,j)
  assert math.isclose(float(m[0]),x,rel_tol=1e-8,abs_tol=5.1e-7),(i,j,m[0],x)
print('PASS:32 GUI trials,20-column records,800 independently computed results,3 print tables,HTML escaping/company-only output and exact reload persistence')
